# TOTP Generator

A lightweight, dependency-free TypeScript implementation of Time-based One-Time Password (TOTP) algorithm as defined in [RFC 6238](https://tools.ietf.org/html/rfc6238). This library provides a simple way to generate and verify 6-digit OTP codes commonly used in two-factor authentication (2FA) systems.

## ✨ Features

- **Zero Dependencies** - Pure TypeScript implementation using Web Crypto API
- **RFC 6238 Compliant** - Standard TOTP implementation with HMAC-SHA1
- **6-Digit OTP** - Generates standard 6-digit one-time passwords
- **30-Second Window** - Default time step of 30 seconds per token
- **Base32 Support** - Built-in Base32 encoding and decoding utilities
- **TypeScript** - Full TypeScript support with type definitions

## 📋 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Usage Examples](#-usage-examples)
- [API Reference](#-api-reference)
- [How It Works](#-how-it-works)
- [Development](#️-development)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Installation

```bash
# Using pnpm
pnpm install
```

## ⚡ Quick Start

```typescript
import { generateTOTP, verifyTOTP } from './src/index'

// Generate a TOTP token
const secret = 'JBSWY3DPEHPK3PXP'
const token = await generateTOTP(secret)
console.log(`Your OTP: ${token}`)

// Verify a token
const isValid = await verifyTOTP(secret, token)
console.log(isValid ? '✅ Valid' : '❌ Invalid')
```

## 💡 Usage Examples

### Basic Token Generation

```typescript
import { generateTOTP } from './src/index'

const secret = 'JBSWY3DPEHPK3PXP'

// Generate current OTP
const token = await generateTOTP(secret)
console.log(`Your OTP: ${token}`)

// Generate OTP for a specific timestamp
const customToken = await generateTOTP(secret, Date.now())
console.log(`Custom OTP: ${customToken}`)
```

### Token Verification

```typescript
import { verifyTOTP } from './src/index'

const secret = 'JBSWY3DPEHPK3PXP'
const userInputToken = '123456'

const isValid = await verifyTOTP(secret, userInputToken)

if (isValid) {
	console.log('✅ Token is valid!')
} else {
	console.log('❌ Token is invalid')
}
```

### Base32 Encoding

```typescript
import { stringToBase32 } from './src/index'

// Convert a plain text secret to Base32 format
const plainSecret = 'mysecretkey'
const base32Secret = stringToBase32(plainSecret)
console.log(`Base32 Secret: ${base32Secret}`)
```

### 2FA Authentication Implementation

```typescript
import { verifyTOTP } from './src/index'

async function authenticateUser(userId: string, token: string) {
	// Retrieve user's secret from secure storage
	const userSecret = await getUserSecret(userId)

	// Verify the token
	const isValid = await verifyTOTP(userSecret, token)

	if (isValid) {
		return { success: true, message: 'Authentication successful' }
	} else {
		return { success: false, message: 'Invalid token' }
	}
}

// Usage
const result = await authenticateUser('user123', '654321')
console.log(result.message)
```

## 📖 API Reference

### `generateTOTP(secret: string, timestamp?: number): Promise<string>`

Generates a 6-digit TOTP code.

**Parameters:**

- `secret` (string) - Base32-encoded secret key
- `timestamp` (number, optional) - Unix timestamp in milliseconds. Defaults to `Date.now()`

**Returns:** Promise<string> - A 6-digit OTP string

**Example:**

```typescript
const token = await generateTOTP('JBSWY3DPEHPK3PXP')
// Returns: "123456"
```

---

### `verifyTOTP(secret: string, userToken: string, timestamp?: number): Promise<boolean>`

Verifies a TOTP code against the secret.

**Parameters:**

- `secret` (string) - Base32-encoded secret key
- `userToken` (string) - The 6-digit OTP to verify
- `timestamp` (number, optional) - Unix timestamp in milliseconds. Defaults to `Date.now()`

**Returns:** Promise<boolean> - `true` if valid, `false` otherwise

**Example:**

```typescript
const isValid = await verifyTOTP('JBSWY3DPEHPK3PXP', '123456')
// Returns: true or false
```

---

### `stringToBase32(text: string): string`

Converts a plain text string to Base32 encoding.

**Parameters:**

- `text` (string) - The string to encode

**Returns:** string - Base32-encoded string with padding

**Example:**

```typescript
const base32 = stringToBase32('mysecretkey')
// Returns: "NV4SA43UOJUW4ZY="
```

## 🔧 How It Works

The TOTP algorithm generates time-based one-time passwords through the following process:

1. **Base32 Decoding** - The secret key is decoded from Base32 format to binary
2. **Counter Calculation** - Current Unix timestamp is divided by the time step (30 seconds)
3. **HMAC Generation** - HMAC-SHA1 hash is computed using the key and counter
4. **Dynamic Truncation** - A 4-byte segment is extracted from the HMAC hash based on the last byte
5. **OTP Generation** - The extracted bytes are converted to a 6-digit number

### Technical Specifications

| Property         | Value               |
| ---------------- | ------------------- |
| **Algorithm**    | HMAC-SHA1           |
| **Time Step**    | 30 seconds (T0 = 0) |
| **Token Length** | 6 digits            |
| **Encoding**     | Base32              |
| **Counter Size** | 8 bytes (64-bit)    |

## 🛠️ Development

### Prerequisites

- Node.js (v20 or higher recommended)
- pnpm

### Available Scripts

```bash
# Build the project (compiles TypeScript to JavaScript)
pnpm build

# Run the compiled code
pnpm start

# Development mode with watch (auto-reloads on file changes)
pnpm dev
```

### Project Structure

```
TOTP/
├── src/
│   └── index.ts          # Main TOTP implementation
├── dist/                 # Compiled JavaScript output (generated)
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── pnpm-workspace.yaml   # pnpm workspace configuration
├── pnpm-lock.yaml        # pnpm lock file
└── README.md             # Documentation
```

### Setup Instructions

```bash
# Clone the repository
git clone "https://github.com/RifatMahmudno-1/TOTP"
cd TOTP

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run in development mode
pnpm dev
```

### TypeScript Configuration

The project uses strict TypeScript settings:

- **Target**: ES2020
- **Module**: ES2020
- **Strict Mode**: Enabled (all strict type-checking options)
- **Source Maps**: Generated for debugging
- **Declarations**: Generated for TypeScript consumers
- **Output Directory**: `./dist`

### Dependencies

**Development Dependencies:**

- `@types/node` (^20.19.25) - TypeScript definitions for Node.js
- `tsx` (^4.21.0) - TypeScript execution and development environment
- `typescript` (^5.9.3) - TypeScript compiler

**Runtime Dependencies:**

- None - This project has **zero runtime dependencies** and uses only built-in Node.js APIs and Web Crypto API

## 🔒 Security

### Best Practices

⚠️ **Important Security Considerations:**

- **Secret Storage** - Never store secrets in plain text. Use secure storage solutions (e.g., environment variables, secret management services)
- **Version Control** - Never commit secrets to version control systems
- **Client-Side** - Avoid exposing secrets in client-side code or browser environments
- **HTTPS Only** - Always use HTTPS for all authentication endpoints
- **Rate Limiting** - Implement rate limiting to prevent brute-force attacks (e.g., max 3 attempts per minute)
- **Time Skew** - Consider implementing a time window tolerance (±1 time step) to account for clock skew
- **Secret Length** - Use secrets that are at least 160 bits (20 bytes) for optimal security
- **Token Expiry** - Tokens are only valid for 30 seconds, reducing the window for attacks

### Recommended Implementation

```typescript
// ✅ Good: Secret stored securely
const secret = process.env.TOTP_SECRET

// ❌ Bad: Secret hardcoded in source
const secret = 'JBSWY3DPEHPK3PXP'
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is open source and available for use.
