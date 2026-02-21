# 🌲 Outdoor Time Tracker

Track your outdoor time and reach your 1000-hour yearly goal! This app helps you monitor daily outdoor activities with cloud sync across all your devices.

## ✨ Features

- ⏱️ **Timer**: Track outdoor time in real-time
- 📝 **Manual Entry**: Add time with separate hours and minutes inputs
- 📊 **Progress Tracking**: Daily and weekly progress bars
- 📅 **Calendar View**: Visual monthly overview with color-coded days
- 🎯 **Goals**: 2.75 hours daily, 1000 hours yearly
- 🏆 **Milestones**: Celebrate achievements with fun animations
- ☁️ **Cloud Sync**: Sign in with Google to sync across devices
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- 🔒 **Secure**: Your data is private and encrypted

## 🚀 Getting Started

### Option 1: Use Without Sign-In
Just open the app and start tracking! Your data is saved locally in your browser.

### Option 2: Enable Cloud Sync
1. Click "Sign in with Google"
2. Your data will sync across all devices
3. Never lose your progress!

## 🔧 Setup (For Developers)

### Prerequisites
- A Firebase account (free)
- GitHub account (for hosting)

### Firebase Setup
See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed instructions.

Quick steps:
1. Create a Firebase project
2. Enable Google Authentication
3. Create a Firestore database
4. Copy your config to `firebase-config.js`
5. Deploy!

### Local Development
```bash
# Clone the repository
git clone https://github.com/parrttj/Daily-Outside-Tracker.git

# Open with a local server (required for Firebase)
python -m http.server 8000
# or
npx serve

# Open http://localhost:8000 in your browser
```

## 📁 Project Structure

```
├── index.html           # Main HTML file
├── script.js            # Core app logic
├── styles.css           # Styling
├── auth.js              # Authentication logic
├── firebase-init.js     # Firebase initialization
├── firebase-config.js   # Firebase credentials (create this)
├── manifest.json        # PWA manifest
├── icon.svg             # App icon
└── FIREBASE_SETUP.md    # Setup instructions
```

## 🔐 Security

- Firestore security rules ensure users can only access their own data
- Firebase config API keys are safe to expose (they're restricted by domain)
- All authentication is handled by Google's secure OAuth

## 🌟 How It Works

1. **Local Storage**: Data is always saved locally first
2. **Cloud Sync**: When signed in, data syncs to Firebase Firestore
3. **Merge Strategy**: When conflicts occur, the app keeps the maximum hours for each date
4. **Offline Support**: Works offline, syncs when connection returns

## 📊 Data Structure

```javascript
{
  "2024-01-15": 3.5,  // Date: hours (decimal)
  "2024-01-16": 2.75,
  "2024-01-17": 4.0
}
```

## 🎨 Customization

Want to change the daily goal? Edit these constants in `script.js`:
```javascript
const DAILY_GOAL = 2.75;  // Hours per day
const YEARLY_GOAL = 1000; // Hours per year
```

## 📱 Install as App

This is a Progressive Web App (PWA)! You can install it:
- **Desktop**: Click the install icon in your browser's address bar
- **Mobile**: Use "Add to Home Screen" from your browser menu

## 🤝 Contributing

Feel free to fork and submit pull requests!

## 📄 License

MIT License - feel free to use this for your own outdoor tracking!

## 🐛 Issues?

If you encounter any problems, please open an issue on GitHub.

---

Made with 🌲 for outdoor enthusiasts
