#!/bin/bash

echo "🔧 Complete fix for GamesApp..."

# Go to the correct directory
cd /workspaces/Games/gamesapp-admin

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "📝 Creating package.json..."
    cat > package.json << 'PKG'
{
  "name": "gamesapp-admin",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "firebase": "^10.7.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
PKG
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run the app
echo "🚀 Starting the app..."
npm run dev
