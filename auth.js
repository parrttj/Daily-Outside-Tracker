// Authentication UI and Logic
import { auth, db, signInWithGoogle, signOutUser, onAuthChange } from './firebase-init.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

let currentUser = null;

// Initialize auth UI
export function initAuth() {
    const authContainer = document.getElementById('authContainer');
    
    onAuthChange(async (user) => {
        currentUser = user;
        
        if (user) {
            // User is signed in
            authContainer.innerHTML = `
                <div class="auth-info">
                    <img src="${user.photoURL || 'icon.svg'}" alt="Profile" class="profile-pic">
                    <span class="user-name">${user.displayName || user.email}</span>
                    <button id="signOutBtn" class="btn btn-small">Sign Out</button>
                </div>
            `;
            
            document.getElementById('signOutBtn').addEventListener('click', handleSignOut);
            
            // Load user data from Firestore
            await loadUserData(user.uid);
            
        } else {
            // User is signed out
            authContainer.innerHTML = `
                <div class="auth-prompt">
                    <p>Sign in to sync your data across devices</p>
                    <button id="signInBtn" class="btn btn-primary">
                        <svg width="18" height="18" viewBox="0 0 18 18" style="margin-right: 8px; vertical-align: middle;">
                            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            `;
            
            document.getElementById('signInBtn').addEventListener('click', handleSignIn);
            
            // Load local data
            loadLocalData();
        }
    });
}

async function handleSignIn() {
    try {
        const user = await signInWithGoogle();
        
        // Check if user has existing cloud data
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
            // Cloud data exists, ask user what to do
            const localData = localStorage.getItem('outdoorTime');
            if (localData && Object.keys(JSON.parse(localData)).length > 0) {
                const choice = confirm(
                    'You have data both locally and in the cloud.\n\n' +
                    'Click OK to merge them (recommended)\n' +
                    'Click Cancel to use only cloud data'
                );
                
                if (choice) {
                    await mergeData(user.uid, JSON.parse(localData));
                }
            }
        } else {
            // No cloud data, upload local data if exists
            const localData = localStorage.getItem('outdoorTime');
            if (localData) {
                await uploadLocalData(user.uid, JSON.parse(localData));
            }
        }
        
    } catch (error) {
        console.error('Sign in error:', error);
        alert('Failed to sign in. Please try again.');
    }
}

async function handleSignOut() {
    try {
        await signOutUser();
        loadLocalData();
    } catch (error) {
        console.error('Sign out error:', error);
        alert('Failed to sign out. Please try again.');
    }
}

async function loadUserData(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
            const data = userDoc.data().timeEntries || {};
            localStorage.setItem('outdoorTime', JSON.stringify(data));
            
            // Trigger UI update
            if (window.updateStats) window.updateStats();
            if (window.renderHistory) window.renderHistory();
            if (window.renderCalendar) window.renderCalendar();
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function loadLocalData() {
    // Just trigger UI update with local data
    if (window.updateStats) window.updateStats();
    if (window.renderHistory) window.renderHistory();
    if (window.renderCalendar) window.renderCalendar();
}

async function uploadLocalData(userId, localData) {
    try {
        await setDoc(doc(db, 'users', userId), {
            timeEntries: localData,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error uploading local data:', error);
    }
}

async function mergeData(userId, localData) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        const cloudData = userDoc.exists() ? userDoc.data().timeEntries || {} : {};
        
        // Merge: take the maximum hours for each date
        const merged = { ...cloudData };
        for (const [date, hours] of Object.entries(localData)) {
            merged[date] = Math.max(merged[date] || 0, hours);
        }
        
        await setDoc(doc(db, 'users', userId), {
            timeEntries: merged,
            lastUpdated: new Date().toISOString()
        });
        
        localStorage.setItem('outdoorTime', JSON.stringify(merged));
        
        // Trigger UI update
        if (window.updateStats) window.updateStats();
        if (window.renderHistory) window.renderHistory();
        if (window.renderCalendar) window.renderCalendar();
        
    } catch (error) {
        console.error('Error merging data:', error);
    }
}

// Save data to Firestore when user is logged in
export async function saveToCloud(data) {
    if (!currentUser) return;
    
    try {
        await setDoc(doc(db, 'users', currentUser.uid), {
            timeEntries: data,
            lastUpdated: new Date().toISOString()
        }, { merge: true });
    } catch (error) {
        console.error('Error saving to cloud:', error);
    }
}

export function getCurrentUser() {
    return currentUser;
}
