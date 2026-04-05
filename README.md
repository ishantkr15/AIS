# Aryans Resource Portal

A dynamic, responsive web portal for publishing and managing educational resources (worksheets, PYQs, sample papers, etc.) for **Aryans International School, Moradabad**.

Built with HTML5, CSS3, Vanilla JavaScript and **Firebase (Spark/Free Plan)**.

---

## 🚀 Features

- **Homepage** – Hero section, feature highlights, latest resources & news feed
- **Resource Browsing** – Cascading filters (Class → Subject → Chapter), type filter, real-time search
- **Resource Detail Page** – Full details + Google Drive download button
- **News Feed** – School announcements in real-time
- **Admin Panel** – Secure login, resource CRUD, news CRUD, category management
- **Real-time Sync** – Firebase Realtime Database updates instantly across all users
- **Responsive** – Works on desktop, tablet and mobile
- **Firebase Spark Plan** – 100% free tier, no billing required

---

## 📁 Project Structure

```
sc/
├── index.html              # Homepage
├── resources.html           # Resource browsing with filters
├── resource.html            # Single resource detail/download
├── news.html                # News & announcements
├── css/
│   ├── styles.css           # Main design system
│   └── admin.css            # Admin panel styles
├── js/
│   ├── firebase-config.js   # Firebase initialization + helpers
│   └── app.js               # Shared utilities (nav, scroll, etc.)
├── admin/
│   ├── login.html           # Admin login
│   ├── dashboard.html       # Resource & news management
│   └── categories.html      # Class/Subject/Chapter management
├── sample-data.json         # Sample data for Firebase import
├── firebase-rules.json      # Firebase Realtime Database security rules
└── README.md                # This file
```

---

## 🔧 Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** (or select an existing one)
3. Give it a name (e.g., `aryans-resource-portal`)
4. Disable Google Analytics (optional, not needed for Spark plan)
5. Click **Create**

### 2. Enable Authentication

1. In Firebase Console → **Build → Authentication**
2. Click **"Get Started"**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Go to **Users** tab → **Add user**
   - Enter your admin email and password
   - This will be used to log into the admin panel

### 3. Create Realtime Database

1. In Firebase Console → **Build → Realtime Database**
2. Click **"Create Database"**
3. Choose your region (any)
4. Start in **Locked mode** (we'll update rules next)

### 4. Set Security Rules

1. In Realtime Database → **Rules** tab
2. Replace the default rules with the content from `firebase-rules.json`:

```json
{
  "rules": {
    "classes":   { ".read": true, ".write": "auth != null" },
    "subjects":  { ".read": true, ".write": "auth != null" },
    "chapters":  { ".read": true, ".write": "auth != null" },
    "resources": { ".read": true, ".write": "auth != null",
                   ".indexOn": ["dateAdded","classId","subjectId","chapterId","type"] },
    "news":      { ".read": true, ".write": "auth != null",
                   ".indexOn": ["date"] }
  }
}
```

3. Click **Publish**

### 5. Import Sample Data

1. In Realtime Database → **Data** tab
2. Click the **⋮ (three dots)** menu → **Import JSON**
3. Select the `sample-data.json` file from this project
4. Click **Import**

### 6. Get Your Firebase Config

1. In Firebase Console → **Project Settings** (gear icon) → **General**
2. Scroll to **"Your apps"** → Click **Web** icon (`</>`)
3. Register the app (any nickname)
4. Copy the `firebaseConfig` object

### 7. Update the Config in Code

Open `js/firebase-config.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 8. Deploy / Host

#### Option A: Firebase Hosting (Recommended, Free)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select your project, set public directory to "." or the project folder
firebase deploy
```

#### Option B: Any Static Host
Upload all files to **Netlify**, **Vercel**, **GitHub Pages**, or any web server.

#### Option C: Local Testing
Simply open `index.html` in a browser. The Firebase SDK loads from CDN, so the site works locally as long as you have internet connectivity.

---

## 🔐 Admin Panel Usage

1. Navigate to `/admin/login.html`
2. Sign in with the email/password you created in Firebase Authentication
3. **Dashboard** → Add/Edit/Delete resources and news
4. **Categories** → Manage Classes, Subjects, and Chapters

---

## 📊 Firebase Spark (Free) Plan Limits

| Service              | Limit                       |
|---------------------|-----------------------------|
| Realtime Database    | 1 GB storage, 10 GB/month download |
| Authentication       | Unlimited (email/password)  |
| Hosting              | 10 GB storage, 360 MB/day   |
| Simultaneous DB connections | 100               |

This is more than sufficient for a school portal.

---

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+
- **Tablet**: 768px – 1024px
- **Mobile**: < 768px

---

## 🏫 School Details

- **School**: Aryans International School
- **Affiliation**: CBSE (No: 2131897)
- **School Code**: 81783
- **UDISE**: 09041501318
- **Address**: Budhi Vihar, Khushalpur Road, Moradabad - 244001, U.P.
- **Phone**: +91-8941001618
- **Email**: admin@aryansinternationalschool.com
- **Website**: [aryansinternationalschool.com](https://www.aryansinternationalschool.com/)

---

## 📄 License

This project is built for Aryans International School. All rights reserved.
