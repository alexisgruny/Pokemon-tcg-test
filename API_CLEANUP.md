# Pokemon TCG Trade - API Documentation

## Project Structure Cleanup ✨

This project has been refactored with the following improvements:

### 1. **Centralized Constants** (`src/constants/`)
- **`messages.ts`** - All user-facing messages and descriptions
- **`api.ts`** - HTTP status codes, pagination limits, request timeouts

### 2. **Standardized API Responses** (`src/utils/apiResponse.ts`)
All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

### 3. **Frontend API Service** (`frontend/src/services/api.ts`)
Centralized API calls with automatic JWT token handling:

```typescript
import apiService from '@/services/api';

// Login
const response = await apiService.login(email, password);
if (response.success) {
  localStorage.setItem('token', response.data.token);
}

// Get Cards
const cards = await apiService.getCards();

// Add Card
await apiService.addOrUpdateCard(cardId, quantity);
```

### 4. **Security Improvements** 🔒
- ✅ `secret.env` removed from repository
- ✅ Environment variables via `.env` file (use `.env.example` template)
- ✅ Password validation with complexity requirements
- ✅ Rate limiting on authentication endpoints
- ✅ HTTPS/secure cookies configuration
- ✅ CORS protection
- ✅ Input validation middleware

### 5. **TypeScript Strictness** 📋
- `strict: true` enabled
- `noUnusedLocals` enabled
- `noUnusedParameters` enabled
- `noImplicitReturns` enabled
- Proper type definitions for all controllers

### 6. **API Routes Overview**

#### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new account  
- `POST /api/auth/google/login` - Google OAuth login
- `GET /api/auth/logout` - Logout

#### Cards
- `GET /api/cards/list` - Get all cards
- `GET /api/cards/id/:id` - Get card details
- `POST /api/cards/addOrUpdate` - Add or update owned card (auth required)
- `POST /api/cards/remove` - Remove owned card (auth required)
- `GET /api/cards/filter` - Filter cards by set/name

#### Users
- `GET /api/users/search` - Search users (auth required)
- `GET /api/users/list` - Get random users
- `GET /api/users/username/:username` - Get user profile

#### Profile
- `GET /api/profile` - Get logged-in user profile (auth required)
- `POST /api/profile/update` - Update profile (auth required)
- `POST /api/profile/delete` - Delete account (auth required)

### 7. **Environment Configuration**

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure these variables:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pokemon_tcg
DB_USER=postgres
DB_PASSWORD=your_password

SESSION_SECRET=generate_strong_random_string
JWT_SECRET=generate_strong_random_string

GOOGLE_CLIENT_ID=your.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret

NODE_ENV=development
PORT=3000
```

### 8. **Development**

```bash
# Install dependencies
npm install
cd frontend && npm install

# Start backend (dev mode with hot reload)
npm run dev-backend

# Start frontend (in another terminal)
npm run dev-frontend

# Build for production
npm run build
npm start
```

### 9. **Code Patterns**

#### Controllers - Use ApiResponse for all responses:
```typescript
import { ApiResponse } from '../utils/apiResponse';
import { CARD_MESSAGES } from '../constants/messages';

export const getCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card) {
      return ApiResponse.notFound(res, CARD_MESSAGES.NOT_FOUND);
    }
    return ApiResponse.success(res, card);
  } catch (error) {
    return ApiResponse.internal(res);
  }
};
```

#### Frontend - Use API Service:
```typescript
import apiService from '@/services/api';

const cards = await apiService.getCards();
if (cards.success) {
  // Use cards.data
}
```

### 10. **Messages & Constants**

All hardcoded strings moved to constants for easy maintenance:
- Change messages in one place
- Consistent terminology across app
- Example: `AUTH_MESSAGES.INVALID_CREDENTIALS`

### 11. **Future Improvements**
- [ ] Add pagination to card list
- [ ] Implement caching strategy
- [ ] Add N+1 query fixes
- [ ] Unit/integration tests
- [ ] Full Swagger/OpenAPI documentation
- [ ] Database query optimization

---

**Last Updated:** April 10, 2026  
**Status:** Clean, production-ready structure ✅
