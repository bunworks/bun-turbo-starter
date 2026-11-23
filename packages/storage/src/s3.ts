import { randomUUID } from "node:crypto";

import { env, logger } from "@acme/config";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Object storage.
 *
 * Primary provider: Yandex Cloud Object Storage (S3-compatible, static access
 * keys). Fallback: any S3-compatible endpoint (MinIO locally, AWS S3) from the
 * `AWS_*` variables, so local development keeps working without cloud keys.
 *
 * Both speak the S3 API, so the whole package stays on `@aws-sdk/client-s3`.
 */

export type StorageProvider = "yandex" | "s3";

export interface StorageConfig {
  provider: StorageProvider;
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  /** Custom endpoint (Yandex Cloud, MinIO). Unset: AWS S3. */
  endpoint?: string;
  /** Path-style addressing (`endpoint/bucket/key`), needed by MinIO. */
  forcePathStyle: boolean;
}

export interface PresignOptions {
  /** Content type the uploader must send. Defaults to `application/octet-stream`. */
  contentType?: string;
  /** URL lifetime in seconds. Defaults to 1 hour. */
  expiresIn?: number;
}

export interface DownloadUrlOptions {
  /** URL lifetime in seconds. Defaults to 1 hour. */
  expiresIn?: number;
  /** Ask the browser to download the object with this file name. */
  downloadFileName?: string;
}

export interface UploadOptions {
  contentType?: string;
  cacheControl?: string;
  contentDisposition?: string;
  metadata?: Record<string, string>;
}

export type UploadBody = Buffer | Uint8Array | Blob;

export interface UploadResult {
  key: string;
  bucket: string;
  provider: StorageProvider;
  etag?: string;
}

const DEFAULT_EXPIRES_IN = 3600; // 1 hour

function readYandexConfig(): StorageConfig | null {
  const accessKeyId = env.YANDEX_STORAGE_ACCESS_KEY_ID;
  const secretAccessKey = env.YANDEX_STORAGE_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) return null;

  return {
    provider: "yandex",
    bucket: env.YANDEX_STORAGE_BUCKET ?? env.AWS_S3_BUCKET,
    region: env.YANDEX_STORAGE_REGION,
    accessKeyId,
    secretAccessKey,
    endpoint: env.YANDEX_STORAGE_ENDPOINT,
    // Yandex serves buckets as <bucket>.storage.yandexcloud.net.
    forcePathStyle: false,
  };
}

function readGenericS3Config(): StorageConfig | null {
  const accessKeyId = env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = env.AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) return null;

  return {
    provider: "s3",
    bucket: env.AWS_S3_BUCKET,
    region: env.AWS_REGION,
    accessKeyId,
    secretAccessKey,
    endpoint: env.AWS_S3_ENDPOINT,
    // Path style is the safe default for MinIO when an endpoint is set.
    forcePathStyle: env.AWS_S3_FORCE_PATH_STYLE !== "false",
  };
}

/**
 * Resolve the active backend: Yandex Cloud when its keys are present,
 * otherwise the generic S3 configuration. `null` when nothing is configured.
 */
export function resolveStorageConfig(): StorageConfig | null {
  return readYandexConfig() ?? readGenericS3Config();
}

export function isStorageConfigured(): boolean {
  return resolveStorageConfig() !== null;
}

export function getStorageConfig(): StorageConfig {
  const config = resolveStorageConfig();
  if (!config) {
    throw new Error(
      "Object storage is not configured. Set YANDEX_STORAGE_ACCESS_KEY_ID and " +
        "YANDEX_STORAGE_SECRET_ACCESS_KEY (Yandex Cloud Object Storage), or " +
        "AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY for any S3-compatible " +
        "endpoint (MinIO locally).",
    );
  }
  return config;
}

let cachedClient: S3Client | undefined;

function getClient(): S3Client {
  if (cachedClient) return cachedClient;

  const config = getStorageConfig();
  cachedClient = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    // Yandex Cloud Object Storage and MinIO reject the optional AWS SDK v3
    // CRC32 trailer, so only send checksums when the operation requires them.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
    ...(config.endpoint
      ? { endpoint: config.endpoint, forcePathStyle: config.forcePathStyle }
      : {}),
  });

  return cachedClient;
}

function encodeKey(key: string): string {
  return key
    .split("/")
    .filter((segment) => segment.length > 0)
    .map(encodeURIComponent)
    .join("/");
}

function joinPath(...parts: string[]): string {
  const joined = parts
    .map((part) => part.replace(/^\/+|\/+$/g, ""))
    .filter((part) => part.length > 0)
    .join("/");
  return `/${joined}`;
}

/**
 * Public (unsigned) URL of an object. Works for buckets with anonymous read
 * access; private objects need `getDownloadUrl` instead.
 */
export function buildObjectUrl(config: StorageConfig, key: string): string {
  const encodedKey = encodeKey(key);

  if (config.endpoint) {
    const url = new URL(config.endpoint);
    if (config.forcePathStyle) {
      url.pathname = joinPath(url.pathname, config.bucket, encodedKey);
    } else {
      url.host = `${config.bucket}.${url.host}`;
      url.pathname = joinPath(url.pathname, encodedKey);
    }
    return url.toString();
  }

  return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${encodedKey}`;
}

export function getPublicUrl(key: string): string {
  return buildObjectUrl(getStorageConfig(), key);
}

/** Presigned PUT URL the browser can upload to directly. */
export async function createPresignedUrl(
  key: string,
  options: PresignOptions = {},
): Promise<string> {
  const { contentType = "application/octet-stream", expiresIn } = options;
  const command = new PutObjectCommand({
    Bucket: getStorageConfig().bucket,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(getClient(), command, {
    expiresIn: expiresIn ?? DEFAULT_EXPIRES_IN,
  });
}

export function generateS3Key(originalKey: string, temporary = false): string {
  const timestamp = Date.now();
  const randomId = randomUUID().replace(/-/g, "").slice(0, 12);
  const prefix = temporary ? "temp" : "uploads";
  const fileName = originalKey.replace(/^\/+/, "");

  return `${prefix}/${timestamp}-${randomId}-${fileName}`;
}

/**
 * Upload bytes from the server. Accepts the legacy `contentType` string as the
 * third argument, or an options object for cache headers and metadata.
 */
export async function uploadBufferToS3(
  key: string,
  body: UploadBody,
  contentTypeOrOptions?: string | UploadOptions,
): Promise<UploadResult> {
  const options: UploadOptions =
    typeof contentTypeOrOptions === "string"
      ? { contentType: contentTypeOrOptions }
      : (contentTypeOrOptions ?? {});
  const config = getStorageConfig();

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: body,
    ContentType: options.contentType ?? "application/octet-stream",
    CacheControl: options.cacheControl,
    ContentDisposition: options.contentDisposition,
    Metadata: options.metadata,
  });

  try {
    const res = await getClient().send(command);
    return {
      key,
      bucket: config.bucket,
      provider: config.provider,
      etag: res.ETag,
    };
  } catch (error) {
    logger.error("Object storage upload failed", error, {
      provider: config.provider,
      bucket: config.bucket,
      key,
    });
    throw new Error(
      `Failed to upload to ${config.provider} bucket '${config.bucket}' key '${key}': ${
        (error as Error)?.message ?? String(error)
      }`,
    );
  }
}

/** Presigned GET URL for a private object. */
export async function getDownloadUrl(
  key: string,
  options: DownloadUrlOptions = {},
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: getStorageConfig().bucket,
    Key: key,
    ...(options.downloadFileName
      ? {
          ResponseContentDisposition: `attachment; filename="${options.downloadFileName.replace(/"/g, "")}"`,
        }
      : {}),
  });

  return getSignedUrl(getClient(), command, {
    expiresIn: options.expiresIn ?? DEFAULT_EXPIRES_IN,
  });
}

export async function deleteObject(key: string): Promise<void> {
  const config = getStorageConfig();
  const command = new DeleteObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });

  try {
    await getClient().send(command);
  } catch (error) {
    logger.error("Object storage delete failed", error, {
      provider: config.provider,
      bucket: config.bucket,
      key,
    });
    throw new Error(
      `Failed to delete '${key}' from ${config.provider} bucket '${config.bucket}': ${
        (error as Error)?.message ?? String(error)
      }`,
    );
  }
}
