# Services Layer

Business logic services that use the API infrastructure layer.

## 📁 Structure

```
app/services/
├── auth.service.ts      # Authentication business logic
├── products.service.ts  # Products business logic
└── index.ts            # Central exports
```

## 🎯 Purpose

The **Services Layer** contains business logic that:
- Uses the API infrastructure (`app/api/`)
- Provides high-level, domain-specific methods
- Handles business rules and data transformation
- Is consumed by Redux thunks, components, and other parts of the app

## 📖 Usage

```typescript
import { authService, productsService } from '../services';

// Use services in your code
const user = await authService.login({ username, password });
const products = await productsService.getProducts({ limit: 10 });
```

## 🔄 Architecture

```
┌─────────────────┐
│   Components    │
│  Redux Thunks   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Services     │  ← Business Logic Layer
│  (This folder)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│      API        │  ← Infrastructure Layer
│  (app/api/)     │
└─────────────────┘
```

## ✨ Benefits

- **Separation of Concerns**: Business logic separated from HTTP infrastructure
- **Reusability**: Services can be used across components, thunks, and utilities
- **Testability**: Easy to mock services for testing
- **Maintainability**: Clear structure makes code easier to understand and modify
