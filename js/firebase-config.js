/**
 * Firebase Configuration — Aryans Resource Portal
 * =================================================
 * SMART MODE:
 * - If real Firebase credentials are provided below → uses Firebase Realtime DB + Storage.
 * - If placeholder values remain → loads data from sample-data.json locally.
 *
 * To switch to Firebase:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a project and enable Realtime Database + Auth (Email/Password) + Storage
 * 3. Replace the placeholder config below with your real values
 * 4. Import sample-data.json into your Realtime Database
 */

const firebaseConfig = {
  apiKey: "AIzaSyDq4GYSRY-Dr2B83-jI-VOKS_8sVvrmSDk",
  authDomain: "aisadmin-201c3.firebaseapp.com",
  databaseURL: "https://aisadmin-201c3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aisadmin-201c3",
  storageBucket: "aisadmin-201c3.firebasestorage.app",
  messagingSenderId: "85221054211",
  appId: "1:85221054211:web:fdce82812735a003a2bb36",
  measurementId: "G-3HDT1D4EX0"
};

const USE_FIREBASE = firebaseConfig.apiKey !== "YOUR_API_KEY";

/* ============================================================
   REAL FIREBASE MODE
   ============================================================ */
let db, auth;

if (USE_FIREBASE) {
  firebase.initializeApp(firebaseConfig);
  db = firebase.database();
  auth = firebase.auth();
  console.log('Firebase initialized — Live mode');
} else {
  console.log('Firebase not configured — Loading from sample-data.json (offline mode)');

  /* ============================================================
     LOCAL JSON MOCK — provides the same API surface as Firebase
     so the rest of the app works unchanged.
     ============================================================ */

  // In-memory data store (loaded from sample-data.json)
  let _store = {};
  let _loaded = false;
  let _loadPromise = null;
  // Listeners registry for real-time mock updates
  let _listeners = {};

  function _ensureLoaded() {
    if (_loadPromise) return _loadPromise;
    _loadPromise = fetch('sample-data.json')
      .then(res => {
        if (!res.ok) {
          // Try with relative path from admin directory
          return fetch('../sample-data.json');
        }
        return res;
      })
      .then(res => {
        if (!res.ok) throw new Error('Could not load sample-data.json');
        return res.json();
      })
      .then(data => {
        _store = data;
        _loaded = true;
        console.log('Sample data loaded:', Object.keys(_store));
      })
      .catch(err => {
        console.error('Failed to load sample-data.json:', err);
        _store = {};
        _loaded = true;
      });
    return _loadPromise;
  }

  // Start loading immediately
  _ensureLoaded();

  /**
   * Notify all listeners watching a specific path
   */
  function _notifyListeners(path) {
    // Notify exact path listeners
    Object.keys(_listeners).forEach(listenPath => {
      if (path.startsWith(listenPath) || listenPath.startsWith(path)) {
        const callbacks = _listeners[listenPath];
        if (callbacks && callbacks.length > 0) {
          const data = _getByPath(listenPath);
          const snap = new MockSnapshot(data, listenPath.split('/').pop() || '');
          callbacks.forEach(cb => {
            try { cb(snap); } catch(e) { console.error('Listener error:', e); }
          });
        }
      }
    });
  }

  /**
   * Mock snapshot that mimics Firebase DataSnapshot
   */
  class MockSnapshot {
    constructor(data, key) {
      this._data = data;
      this._key = key;
    }
    exists() {
      return this._data !== null && this._data !== undefined;
    }
    val() {
      return this._data;
    }
    get key() {
      return this._key;
    }
    forEach(callback) {
      if (!this._data || typeof this._data !== 'object') return;
      Object.entries(this._data).forEach(([key, val]) => {
        callback(new MockSnapshot(val, key));
      });
    }
    numChildren() {
      if (!this._data || typeof this._data !== 'object') return 0;
      return Object.keys(this._data).length;
    }
  }

  /**
   * Gets a value from the store by dot/slash path
   */
  function _getByPath(path) {
    if (!path) return _store;
    const parts = path.replace(/^\/+|\/+$/g, '').split('/');
    let current = _store;
    for (const part of parts) {
      if (current === null || current === undefined || typeof current !== 'object') return undefined;
      current = current[part];
    }
    return current;
  }

  /**
   * Sets a value in the store by path
   */
  function _setByPath(path, value) {
    if (!path) { _store = value; return; }
    const parts = path.replace(/^\/+|\/+$/g, '').split('/');
    let current = _store;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]] || typeof current[parts[i]] !== 'object') {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    if (value === null) {
      delete current[parts[parts.length - 1]];
    } else {
      current[parts[parts.length - 1]] = value;
    }
  }

  /**
   * Mock Reference that mimics Firebase DatabaseReference
   */
  class MockRef {
    constructor(path) {
      this._path = path || '';
    }

    child(childPath) {
      return new MockRef(this._path ? this._path + '/' + childPath : childPath);
    }

    push() {
      const key = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      const childRef = new MockRef(this._path ? this._path + '/' + key : key);
      childRef.key = key;
      return childRef;
    }

    async once(eventType, callback) {
      await _ensureLoaded();
      const data = _getByPath(this._path);
      const snap = new MockSnapshot(data, this._path.split('/').pop() || '');
      if (callback) callback(snap);
      return snap;
    }

    async on(eventType, callback) {
      await _ensureLoaded();
      // Register listener
      if (!_listeners[this._path]) _listeners[this._path] = [];
      _listeners[this._path].push(callback);
      // Fire immediately with current data
      const data = _getByPath(this._path);
      const snap = new MockSnapshot(data, this._path.split('/').pop() || '');
      if (callback) callback(snap);
    }

    off(eventType, callback) {
      if (_listeners[this._path]) {
        if (callback) {
          _listeners[this._path] = _listeners[this._path].filter(cb => cb !== callback);
        } else {
          delete _listeners[this._path];
        }
      }
    }

    orderByChild(child) {
      // Return self — sorting happens in-memory at render time
      return this;
    }

    limitToLast(count) {
      // Store the limit and apply it when queried
      const ref = new MockRef(this._path);
      ref._limit = count;

      ref.once = async function(eventType, callback) {
        await _ensureLoaded();
        let data = _getByPath(this._path);
        if (data && typeof data === 'object' && this._limit) {
          const entries = Object.entries(data);
          const limited = entries.slice(-this._limit);
          data = Object.fromEntries(limited);
        }
        const snap = new MockSnapshot(data, this._path.split('/').pop() || '');
        if (callback) callback(snap);
        return snap;
      };

      ref.on = async function(eventType, callback) {
        await _ensureLoaded();
        // Register listener
        if (!_listeners[this._path]) _listeners[this._path] = [];
        _listeners[this._path].push(callback);
        // Fire immediately
        let data = _getByPath(this._path);
        if (data && typeof data === 'object' && this._limit) {
          const entries = Object.entries(data);
          const limited = entries.slice(-this._limit);
          data = Object.fromEntries(limited);
        }
        const snap = new MockSnapshot(data, this._path.split('/').pop() || '');
        if (callback) callback(snap);
      };

      ref.off = function(eventType, callback) {
        if (_listeners[this._path]) {
          if (callback) {
            _listeners[this._path] = _listeners[this._path].filter(cb => cb !== callback);
          } else {
            delete _listeners[this._path];
          }
        }
      };

      return ref;
    }

    async set(value) {
      await _ensureLoaded();
      _setByPath(this._path, value);
      showToast('Saved (local mode — changes are not persisted)', 'warning');
      // Notify listeners
      _notifyListeners(this._path);
      return;
    }

    async update(value) {
      await _ensureLoaded();
      const existing = _getByPath(this._path) || {};
      _setByPath(this._path, { ...existing, ...value });
      showToast('Updated (local mode — changes are not persisted)', 'warning');
      // Notify listeners
      _notifyListeners(this._path);
      return;
    }

    async remove() {
      await _ensureLoaded();
      _setByPath(this._path, null);
      showToast('Removed (local mode — changes are not persisted)', 'warning');
      // Notify listeners
      _notifyListeners(this._path);
      return;
    }
  }

  /**
   * Mock Database
   */
  db = {
    ref(path) {
      return new MockRef(path || '');
    }
  };

  /**
   * Mock Auth
   */
  auth = {
    _user: null,
    _callbacks: [],
    onAuthStateChanged(callback) {
      this._callbacks.push(callback);
      // In local mode, simulate being "logged in" on admin pages
      const isAdminPage = window.location.pathname.includes('/admin/') &&
                          !window.location.pathname.includes('login');
      if (isAdminPage) {
        this._user = { email: 'admin@local.dev', uid: 'local-admin' };
      }
      setTimeout(() => callback(this._user), 100);
    },
    async signInWithEmailAndPassword(email, password) {
      // Accept any credentials in local/demo mode
      this._user = { email, uid: 'local-admin' };
      this._callbacks.forEach(cb => cb(this._user));
      return { user: this._user };
    },
    async signOut() {
      this._user = null;
      this._callbacks.forEach(cb => cb(null));
    }
  };

  /**
   * Mock Storage (no-op in local mode)
   */
  storage = null;
}

/* ============================================================
   SHARED HELPERS (work in both modes)
   ============================================================ */

function generateId() {
  if (USE_FIREBASE) return db.ref().push().key;
  return 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-IN', options);
}

function getTypeBadgeClass(type) {
  const map = {
    'Worksheet': 'badge-worksheet',
    'PYQ': 'badge-pyq',
    'Sample Paper': 'badge-sample-paper',
    'Notes': 'badge-notes',
    'Important Paper': 'badge-important'
  };
  return map[type] || 'badge-default';
}

function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ============================================================
   GOOGLE DRIVE LINK HELPERS
   ============================================================ */

/**
 * Convert a Google Drive share link to a direct download link
 */
function getGDriveDownloadLink(shareLink) {
  if (!shareLink) return '#';
  const match = shareLink.match(/\/d\/([-\w]+)/);
  if (match) return 'https://drive.google.com/uc?export=download&id=' + match[1];
  const match2 = shareLink.match(/id=([-\w]+)/);
  if (match2) return 'https://drive.google.com/uc?export=download&id=' + match2[1];
  return shareLink;
}

