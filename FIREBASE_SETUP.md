# Firebase Setup Guide

Follow these steps to enable cloud sync for your Outdoor Time Tracker:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "outdoor-time-tracker")
4. Disable Google Analytics (optional, not needed for this app)
5. Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (`</>`) to add a web app
2. Enter an app nickname (e.g., "Outdoor Tracker Web")
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the `firebaseConfig` object shown

## Step 3: Enable Authentication

1. In Firebase Console, go to **Build** > **Authentication**
2. Click "Get started"
3. Click on **Sign-in method** tab
4. Click on **Google** provider
5. Toggle "Enable"
6. Select a support email
7. Click "Save"

## Step 4: Set Up Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose **Start in production mode** (we'll add rules next)
4. Select a location (choose closest to your users)
5. Click "Enable"

## Step 5: Configure Security Rules

1. In Firestore Database, go to the **Rules** tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

These rules ensure users can only read/write their own data.

## Step 6: Update Your Code

1. Open `firebase-config.js` in your project
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

3. Save the file

## Step 7: Test Locally

1. Open your `index.html` in a browser (use a local server)
2. You should see a "Sign in with Google" button
3. Click it and sign in with your Google account
4. Your data should now sync to Firebase!

## Step 8: Deploy to GitHub Pages

1. Commit all changes:
```bash
git add .
git commit -m "Add Firebase cloud sync"
git push
```

2. Your GitHub Pages site will update automatically

## Troubleshooting

**"Firebase: Error (auth/unauthorized-domain)"**
- Go to Firebase Console > Authentication > Settings > Authorized domains
- Add your GitHub Pages domain (e.g., `yourusername.github.io`)

**"Missing or insufficient permissions"**
- Check your Firestore security rules
- Make sure you're signed in

**Sign-in popup blocked**
- Allow popups for your site in browser settings

## Features Now Available

✅ Sign in with Google account
✅ Data syncs across all devices
✅ Data persists in cloud (never lost)
✅ Automatic merge of local and cloud data
✅ Works offline (syncs when back online)

## Cost

Firebase free tier includes:
- 50,000 reads/day
- 20,000 writes/day
- 1GB storage

This is more than enough for personal use!
