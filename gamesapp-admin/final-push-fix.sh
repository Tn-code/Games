#!/bin/bash

echo "🚀 Fixing push conflict..."

# Try to pull first
echo "📥 Pulling latest changes..."
git pull origin main --rebase

if [ $? -eq 0 ]; then
    echo "✅ Pull successful!"
    echo "⬆️ Pushing changes..."
    git push origin main
else
    echo "❌ Pull failed. Trying force push..."
    git push --force origin main
fi

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 View your repository: https://github.com/Tn-code/Games"
else
    echo "❌ Push failed. Trying alternative..."
    echo "git pull origin main --allow-unrelated-histories"
    git pull origin main --allow-unrelated-histories
    git push origin main
fi
