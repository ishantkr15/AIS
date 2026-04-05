# 🚀 Firebase Setup Guide — Aryans Resource Portal

This guide will walk you through setting up a free **Firebase Spark Plan** to power your resource portal with live data, secure login, and real-time updates.

---

## 📅 Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** (or Select an existing one).
3. Enter a name (e.g., `Aryans-Resource-Portal`).
4. (Optional) Disable Google Analytics for this project to speed up setup.
5. Click **Create Project** and wait for it to finish.

---

## 🔒 Step 2: Enable Authentication (Admin Login)
1. In the left sidebar dashboard, click on **Build** > **Authentication**.
2. Click **Get Started**.
3. Under **Sign-in method**, select **Email/Password**.
4. Enable the first toggle (**Email/Password**) and click **Save**.
5. Go to the **Users** tab (top of page).
6. Click **Add User** and create your first administrator:
   * **Email**: `admin@school.com` *(or your preference)*
   * **Password**: `choose_a_strong_password`
   * *Note down these credentials to log into your Admin Panel later.*

---

## 🗄️ Step 3: Enable Realtime Database
1. In the left sidebar dashboard, click on **Build** > **Realtime Database**.
2. Click **Create Database**.
3. Select your Database Location (e.g., *United States* or *Asia-South*) and click **Next**.
4. Select **Start in locked mode** and click **Enable**.

---

## 📃 Step 4: Set Database Security Rules
1. In the Realtime Database view, click the **Rules** tab at the top.
2. Open the file `firebase-rules.json` from your project folder.
3. **Copy everything** inside `firebase-rules.json`.
4. Delete the default rules in the Firebase Console and **paste** the copied contents.
5. Click **Publish** to save.

> [!TIP]
> These rules allow any student to read content but strictly restrict making changes only to users logged in with your Admin account.

---

## 📑 Step 5: Import Sample Data
1. In the Realtime Database view, go back to the **Data** tab.
2. Click the **three vertical dots** (`...`) on the top right above the empty root node (your-project-id).
3. Select **Import JSON**.
4. Click **Browse** and select the `sample-data.json` file from your desktop/workspace folder.
5. Click **Import**. You should now see classes, news, and resources tree branches populate.

---

## ⚙️ Step 6: Link Your Website to Firebase
1. Return to the **Project Overview** (gear icon next to Project Overview in left sidebar).
2. Click the **Web icon** (`</>`) under "Get started by adding Firebase to your app".
3. Enter an App Nickname (e.g., `Aryans Web App`).
4. (Optional) Check "Also set up Firebase Hosting" if you want to deploy to the web later.
5. Click **Register app**.
6. Find the `firebaseConfig` object resembling this:
   ```javascript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     databaseURL: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
7. Open **`js/firebase-config.js`** in your code editor.
8. **Replace the placeholder object** with your new configuration block.
9. **Save the file.**

---

## 🎉 Step 7: Test Your Setup
1. Refresh your browser page.
2. Check the browser's developer console. It should say: `🔥 Firebase initialized — Live mode`.
3. Go to `/admin/login.html` and use the email/password you created in **Step 2**.
4. You will now be able to add, edit, or delete items on the live database network.
