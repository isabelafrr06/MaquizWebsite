# Maquiz Artist Website

A modern artist portfolio website built with Ruby on Rails backend and React frontend.

## Features

- 🎨 Modern, responsive design with turquoise, blue, and violet color scheme
- 🖼️ Image carousel showcasing featured artworks
- 🚀 Ready for deployment on Railway (backend) and Vercel (frontend)
- 📱 Fully responsive design

## Tech Stack

### Backend
- Ruby on Rails 7.1 (API mode)
- PostgreSQL
- Puma web server

### Frontend
- React 18
- Vite
- React Router
- Axios

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
bundle install
```

3. Set up the database:
```bash
rails db:create
rails db:migrate
rails db:seed
```

4. Start the Rails server:
```bash
rails server
```

The backend will run on `http://localhost:3000`

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

The frontend will run on `http://localhost:5173`

## Deployment

### Railway (Backend)

1. Push your code to GitHub
2. Connect your repository to Railway
3. Railway will automatically detect the Rails app
4. Add a PostgreSQL database service
5. Set environment variables if needed
6. Deploy!

The backend API will be available at your Railway URL.

### Vercel (Frontend)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Set the root directory to `frontend`
4. Update `vercel.json` with your Railway backend URL
5. Deploy!

## Project Structure

```
MaquizWebsite/
├── backend/          # Ruby on Rails API
│   ├── app/
│   ├── config/
│   └── db/
└── frontend/         # React application
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── App.jsx
    └── public/
```

## API Endpoints

- `GET /api/v1/artworks` - Get all artworks
- `GET /api/v1/artworks/:id` - Get a specific artwork

## License

MIT

