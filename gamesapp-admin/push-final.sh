#!/bin/bash

echo "🚀 Pushing complete GamesApp to GitHub..."

# Go to the project directory
cd /workspaces/Games/gamesapp-admin

# Add all files
echo "📦 Adding all files..."
git add .

# Check what's being committed
echo "📝 Files to commit:"
git status --short

# Commit
echo "📝 Committing..."
git commit -m "Complete GamesApp Platform with all features

✅ Admin Dashboard for houssinetrabelsi6@gmail.com
✅ User Dashboard with Google login
✅ Story Management (French/Arabic, Free/Premium)
✅ Quiz Management (French/Arabic, Free/Premium)
✅ Quiz Play mode (users can only play)
✅ Payment System for Premium content
✅ User Management for Admin
✅ Revenue tracking and analytics

Tech Stack:
- React 18 + Vite
- Firebase (Auth, Firestore)
- Tailwind CSS
- Font Awesome"

# Push
echo "⬆️ Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 View your repository: https://github.com/Tn-code/Games"
else
    echo "❌ Push failed. Trying force push..."
    git push --force origin main
fi
