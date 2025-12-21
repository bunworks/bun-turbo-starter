# Authentication Setup

Полноценная система аутентификации с использованием better-auth.

## Методы входа

### 1. Google OAuth
- Вход через Google аккаунт
- Настроен в `.env`: `AUTH_GOOGLE_ID` и `AUTH_GOOGLE_SECRET`

### 2. Email + Password
- Регистрация с email и паролем
- Вход с email и паролем
- Минимальная длина пароля: 8 символов

### 3. Email OTP (One-Time Password)
- Вход через код, отправленный на email
- Код действителен 10 минут

### 4. Восстановление пароля
- Запрос ссылки для сброса пароля
- Ссылка действительна 1 час

## Маршруты

- `/auth/login` - Вход (все методы)
- `/auth/signup` - Регистрация
- `/auth/otp` - Ввод OTP кода
- `/auth/forgot-password` - Запрос восстановления пароля
- `/auth/reset-password` - Установка нового пароля

## Компоненты

### UnifiedAuthForm
Универсальная форма входа со всеми методами:
- Google OAuth
- Email + Password (с табами)
- Email OTP

```tsx
import { UnifiedAuthForm } from "~/components/auth";

<UnifiedAuthForm mode="signin" /> // или mode="signup"
```

### EmailPasswordForm
Отдельная форма для входа/регистрации с паролем:

```tsx
import { EmailPasswordForm } from "~/components/auth";

<EmailPasswordForm mode="signin" />
```

### ForgotPasswordForm
Форма запроса восстановления пароля

### ResetPasswordForm
Форма установки нового пароля

### OTPForm
Форма ввода OTP кода

## Использование в коде

### Client-side

```tsx
import { authClient } from "~/auth/client";

// Вход с паролем
await authClient.signIn.email({
  email: "user@example.com",
  password: "password123"
});

// Регистрация
await authClient.signUp.email({
  email: "user@example.com",
  password: "password123",
  name: "User Name"
});

// Вход через Google
authClient.signIn.social({ provider: "google" });

// Отправка OTP
await authClient.emailOtp.sendVerificationOtp({
  email: "user@example.com",
  type: "sign-in"
});

// Вход с OTP
await authClient.signIn.emailOtp({
  email: "user@example.com",
  otp: "123456"
});

// Восстановление пароля
await authClient.forgetPassword({
  email: "user@example.com",
  redirectTo: "/auth/reset-password"
});

// Сброс пароля
await authClient.resetPassword({
  newPassword: "newpassword123",
  token: "reset-token"
});

// Выход
await authClient.signOut();
```

### Server-side

```tsx
import { getSession } from "~/auth/server";

const session = await getSession();
if (!session) {
  redirect("/auth/login");
}

const user = session.user;
```

## Email шаблоны

### OTP Email
Используется для:
- Вход через OTP
- Верификация email

### Reset Password Email
Используется для восстановления пароля с кнопкой и ссылкой.

## Переменные окружения

```env
# Database
POSTGRES_URL="your-database-url"

# Auth Secret (generate with: openssl rand -base64 32)
AUTH_SECRET="your-secret-key"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
EMAIL_SANDBOX_ENABLED="true"
```

## База данных

Схема включает таблицы:
- `users` - пользователи
- `accounts` - OAuth аккаунты и пароли
- `sessions` - сессии
- `verifications` - OTP коды и токены восстановления

Обновление схемы:
```bash
bun run db:push
```

## Особенности

- Все формы следуют accessibility guidelines
- Поддержка менеджеров паролей
- Правильные `autocomplete` атрибуты
- Защита от вставки в поля ввода НЕ блокируется
- Кнопки показывают состояние загрузки
- Inline валидация с фокусом на первой ошибке
- Таймер для повторной отправки OTP (60 секунд)
- Мобильная оптимизация (font-size ≥16px)
