import { describe, expect, test } from "bun:test";

import { buildObjectUrl, generateS3Key, type StorageConfig } from "./s3";

const yandex: StorageConfig = {
  provider: "yandex",
  bucket: "acme-files",
  region: "ru-central1",
  accessKeyId: "key",
  secretAccessKey: "secret",
  endpoint: "https://storage.yandexcloud.net",
  forcePathStyle: false,
};

const minio: StorageConfig = {
  provider: "s3",
  bucket: "files.acme.com",
  region: "us-east-1",
  accessKeyId: "minio",
  secretAccessKey: "password",
  endpoint: "http://localhost:9002",
  forcePathStyle: true,
};

const aws: StorageConfig = {
  provider: "s3",
  bucket: "acme-files",
  region: "eu-central-1",
  accessKeyId: "key",
  secretAccessKey: "secret",
  forcePathStyle: false,
};

describe("buildObjectUrl", () => {
  test("Yandex Cloud uses virtual-hosted style", () => {
    expect(buildObjectUrl(yandex, "uploads/photo 1.png")).toBe(
      "https://acme-files.storage.yandexcloud.net/uploads/photo%201.png",
    );
  });

  test("MinIO uses path style", () => {
    expect(buildObjectUrl(minio, "uploads/photo 1.png")).toBe(
      "http://localhost:9002/files.acme.com/uploads/photo%201.png",
    );
  });

  test("AWS without an endpoint", () => {
    expect(buildObjectUrl(aws, "/uploads/photo.png")).toBe(
      "https://acme-files.s3.eu-central-1.amazonaws.com/uploads/photo.png",
    );
  });
});

describe("generateS3Key", () => {
  test("prefixes uploads with a timestamp and a unique id", () => {
    const key = generateS3Key("report.pdf");
    expect(key).toMatch(/^uploads\/\d+-[a-f0-9]{12}-report\.pdf$/);
    expect(generateS3Key("report.pdf")).not.toBe(key);
  });

  test("temporary uploads land under temp/", () => {
    expect(generateS3Key("/avatar.png", true)).toMatch(
      /^temp\/\d+-[a-f0-9]{12}-avatar\.png$/,
    );
  });
});
