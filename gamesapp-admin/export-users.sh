#!/bin/bash

echo "📤 Exporting users from Firebase Authentication..."

# Login to Firebase
firebase login

# Export users to JSON
firebase auth:export users.json --project=gamesapp-33a5f

echo "✅ Users exported to users.json"

# Now import to Firestore using a script
node import-users.js
