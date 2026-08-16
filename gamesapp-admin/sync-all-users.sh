#!/bin/bash

echo "🔄 Starting user sync..."

# Check if service account file exists
if [ ! -f "gamesapp-33a5f-firebase-adminsdk-*.json" ]; then
    echo "⚠️ Service account file not found!"
    echo "Please download your service account key from:"
    echo "https://console.firebase.google.com/project/gamesapp-33a5f/settings/serviceaccounts/adminsdk"
    echo "And save it as: gamesapp-33a5f-firebase-adminsdk.json"
    exit 1
fi

# Run the sync script
node sync-users-script.js

echo "✅ Sync complete!"
