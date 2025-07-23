# Aurora MVP

A full-stack application with React frontend and Node.js/Express backend.

## Project Structure

```
auroraMVP/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── config/
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `env.example`):
   ```bash
   cp env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:5000`

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

## API Endpoints

- `GET /health` - Health check
- `GET /api/hello` - Sample GET endpoint
- `POST /api/data` - Sample POST endpoint

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- CORS
- Helmet (Security)
- Morgan (Logging)

## Development

The frontend is configured to proxy API requests to the backend during development. Any request to `/api/*` will be automatically forwarded to `http://localhost:5000`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT 