# Project Architecture

## 📁 Folder Structure

```
app/
├── api/                    # Infrastructure Layer
│   ├── client.ts          # Axios instance with interceptors
│   ├── config.ts          # API configuration
│   ├── errors.ts          # Error handling
│   ├── endpoints.ts       # Endpoint definitions
│   ├── http.service.ts    # Low-level HTTP methods
│   ├── types.ts           # TypeScript types
│   └── index.ts          # API exports
│
├── services/              # Business Logic Layer
│   ├── auth.service.ts   # Authentication business logic
│   ├── products.service.ts # Products business logic
│   └── index.ts          # Services exports
│
├── store/                 # Redux store
├── screens/              # Screen components
├── components/           # Reusable components
└── utils/                # Utility functions
```

## 🏗️ Architecture Layers

### 1. **API Layer** (`app/api/`)
**Purpose**: Infrastructure for HTTP communication

**Contains**:
- HTTP client setup (Axios configuration)
- Error handling infrastructure
- Type definitions
- Endpoint constants
- Low-level HTTP methods

**Used by**: Services layer

**Example**:
```typescript
import { httpService, ENDPOINTS } from '../api';
```

### 2. **Services Layer** (`app/services/`)
**Purpose**: Business logic that uses the API infrastructure

**Contains**:
- Domain-specific business logic
- High-level API methods
- Data transformation
- Business rules

**Used by**: Redux thunks, components, utilities

**Example**:
```typescript
import { authService, productsService } from '../services';
```

### 3. **Store Layer** (`app/store/`)
**Purpose**: State management

**Uses**: Services layer for async operations

**Example**:
```typescript
import { productsService } from '../services';
```

## 🔄 Data Flow

```
┌─────────────┐
│ Components  │
│   Screens   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Redux Store │
│   (Thunks)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Services   │  ← Business Logic
│  (app/services/)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     API     │  ← Infrastructure
│  (app/api/) │
└─────────────┘
```

## 📖 Usage Guidelines

### ✅ DO

- **Use services** for business logic: `import { authService } from '../services'`
- **Use API** for infrastructure: `import { ApiException } from '../api'`
- **Keep API layer** focused on HTTP/infrastructure only
- **Keep services layer** focused on business logic only

### ❌ DON'T

- Don't import services from `app/api/` (they're in `app/services/`)
- Don't put business logic in `app/api/`
- Don't put infrastructure code in `app/services/`
- Don't bypass services layer to use API directly (unless advanced use case)

## 🎯 Benefits

1. **Separation of Concerns**: Clear boundaries between infrastructure and business logic
2. **Maintainability**: Easy to find and modify code
3. **Testability**: Services can be easily mocked
4. **Scalability**: Easy to add new services or API utilities
5. **Reusability**: Services can be used across the app

## 📝 Adding New Features

### Adding a New Service

1. Create service file in `app/services/`
2. Import API utilities from `../api`
3. Export from `app/services/index.ts`
4. Use in Redux thunks or components

### Adding API Infrastructure

1. Add to `app/api/` folder
2. Export from `app/api/index.ts`
3. Use in services layer
