# 🚀 MoboRev - Quick Start Guide

Welcome to MoboRev! Follow these steps to run the app locally in your browser.

## 📋 Prerequisites

Before you start, make sure you have:
- **Node.js 16+** installed ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## 🏃‍♂️ Quick Start (Automatic)

### Option 1: Using Start Script (Recommended)

**For macOS/Linux:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**For Windows:**
```batch
start-dev.bat
```

### Option 2: Manual Setup

If the automatic scripts don't work, follow these manual steps:

```bash
# 1. Install dependencies
npm install

# 2. Install Expo CLI globally (if not already installed)
npm install -g @expo/cli

# 3. Build for web
npx expo export --platform web

# 4. Start development server
node web-server.js
```

Then open your browser and visit: **http://localhost:3000**

## 🎭 Demo Features

Once the app loads, you'll see:

### 1. **Authentication Flow**
- Click "Get Started" to sign up
- Use demo credentials:
  - Email: `alice@example.com` or `bob@example.com` 
  - Password: any password (this is mock auth)

### 2. **Dashboard Features**
- **Demo Controls**: Use the yellow demo panel to populate sample data
- **Thought Bubbles**: Tap bubbles to expand replies
- **Notifications**: Click the bell icon to see notifications
- **Connection Animation**: See the heartbeat when partnered

### 3. **Mind Map View**
- Click "Mind Map" button in the header
- Try different view modes: Force, Radial, Timeline
- Filter thoughts by author
- Click nodes to see details

### 4. **Interactive Elements**
- **Add Thoughts**: Use the blue + button
- **Reply**: Click "Reply" on any thought bubble
- **Animations**: Watch for smooth bubble animations
- **Notifications**: Test notifications using demo controls

## 🛠️ Development Features

The app includes several development-friendly features:

- **Hot Reload**: Changes reflect automatically
- **Demo Data**: Realistic sample conversations
- **Debug Controls**: Yellow panel for testing features
- **Responsive Design**: Works on mobile and desktop

## 🌐 Browser Compatibility

Tested and optimized for:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🐛 Troubleshooting

### Common Issues:

**1. "expo command not found"**
```bash
npm install -g @expo/cli
```

**2. "Port 3000 already in use"**
```bash
# Kill any process using port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /f
```

**3. "Module not found" errors**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**4. Web build fails**
```bash
# Make sure you're in the project directory
cd moborev
npx expo export --platform web --clear
```

## 📱 Mobile Testing

To test on mobile devices on the same network:

1. Find your computer's IP address:
   - **macOS/Linux**: `ifconfig | grep inet`
   - **Windows**: `ipconfig`

2. Visit `http://YOUR_IP_ADDRESS:3000` on your mobile browser

## 🎯 Feature Showcase

### Must-Try Features:
1. **Demo Mode**: Click "Start Demo" to see realistic conversation flow
2. **Notifications**: Test various notification types
3. **Mind Map**: Switch between different visualization modes
4. **Animations**: Long-press bubbles for haptic feedback (mobile)
5. **Responsive Design**: Try resizing your browser window

### Sample User Journey:
1. Sign up with mock credentials
2. Start demo to populate sample data
3. Explore thought bubbles and replies
4. Switch to mind map view
5. Test different filters and view modes
6. Check notifications panel

## 🚀 Next Steps

After exploring locally:
- **Production Deployment**: Ready for Expo EAS Build
- **Backend Integration**: Firebase/Supabase setup available
- **Real Push Notifications**: Expo push notification service
- **Advanced Features**: Voice messages, photo sharing, etc.

## 💡 Tips

- Use the demo controls to quickly populate realistic data
- Try the app on different screen sizes to see responsive design
- Test notification features with the demo notification button
- Long-press bubbles for additional interaction feedback
- Switch between timeline and mind map views for different perspectives

---

**🎉 Enjoy exploring MoboRev! The app showcases modern React Native web development with beautiful animations, smart notifications, and intuitive user experience.**