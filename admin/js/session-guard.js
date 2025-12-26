/* ============================================
   Session Guard v2 - Simple & Bulletproof
   Single Tab Session Enforcement
   ============================================ */

(function () {
    'use strict';

    const LOCK_KEY = 'craftsoft_admin_lock';
    const LOCK_TIMEOUT = 3000; // 3 seconds - if no update, consider tab dead

    // Generate unique ID for this tab
    const thisTabId = 'T' + Date.now() + Math.random().toString(36).substr(2, 5);

    // ============================================
    // CHECK IF SESSION IS LOCKED BY ANOTHER TAB
    // ============================================

    function isLockedByAnotherTab() {
        const lockData = localStorage.getItem(LOCK_KEY);

        if (!lockData) {
            return false; // No lock exists
        }

        try {
            const lock = JSON.parse(lockData);
            const now = Date.now();

            // Check if lock is still valid (updated within timeout)
            if (now - lock.timestamp > LOCK_TIMEOUT) {
                // Lock is stale (tab crashed or closed without cleanup)
                return false;
            }

            // Lock is valid and belongs to another tab
            if (lock.tabId !== thisTabId) {
                return true;
            }

            return false;
        } catch (e) {
            return false;
        }
    }

    // ============================================
    // ACQUIRE LOCK FOR THIS TAB
    // ============================================

    function acquireLock() {
        const lockData = {
            tabId: thisTabId,
            timestamp: Date.now()
        };
        localStorage.setItem(LOCK_KEY, JSON.stringify(lockData));
    }

    // ============================================
    // KEEP LOCK ALIVE (heartbeat)
    // ============================================

    let heartbeatInterval = null;

    function startHeartbeat() {
        // Update lock every 1 second
        heartbeatInterval = setInterval(() => {
            const lockData = localStorage.getItem(LOCK_KEY);
            if (lockData) {
                try {
                    const lock = JSON.parse(lockData);
                    if (lock.tabId === thisTabId) {
                        // Still our lock, refresh timestamp
                        lock.timestamp = Date.now();
                        localStorage.setItem(LOCK_KEY, JSON.stringify(lock));
                    } else {
                        // Another tab took the lock - we should leave
                        redirectToSignin();
                    }
                } catch (e) {
                    // Error parsing, redirect to be safe
                    redirectToSignin();
                }
            }
        }, 1000);
    }

    // ============================================
    // RELEASE LOCK ON TAB CLOSE
    // ============================================

    function releaseLock() {
        const lockData = localStorage.getItem(LOCK_KEY);
        if (lockData) {
            try {
                const lock = JSON.parse(lockData);
                if (lock.tabId === thisTabId) {
                    localStorage.removeItem(LOCK_KEY);
                }
            } catch (e) {
                // Ignore
            }
        }
        if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
        }
    }

    // ============================================
    // REDIRECT TO SIGNIN
    // ============================================

    function redirectToSignin() {
        releaseLock();
        window.location.replace('signin.html');
    }

    // ============================================
    // SHOW PAGE (make visible after validation)
    // ============================================

    function showPage() {
        if (document.body) {
            document.body.classList.add('session-validated');
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.classList.add('session-validated');
            });
        }
    }

    // ============================================
    // WATCH FOR OTHER TABS TRYING TO TAKE OVER
    // ============================================

    function watchForChanges() {
        window.addEventListener('storage', (event) => {
            if (event.key === LOCK_KEY && event.newValue) {
                try {
                    const newLock = JSON.parse(event.newValue);
                    if (newLock.tabId !== thisTabId) {
                        // Another tab acquired the lock - redirect this one
                        redirectToSignin();
                    }
                } catch (e) {
                    // Ignore parse errors
                }
            }
        });
    }

    // ============================================
    // MAIN INITIALIZATION
    // ============================================

    function init() {
        // Step 1: Check if locked by another active tab
        if (isLockedByAnotherTab()) {
            // Don't show anything, just redirect immediately
            window.location.replace('signin.html');
            return; // Stop execution
        }

        // Step 2: Acquire lock for this tab
        acquireLock();

        // Step 3: Start heartbeat to keep lock alive
        startHeartbeat();

        // Step 4: Watch for other tabs
        watchForChanges();

        // Step 5: Release lock when tab closes
        window.addEventListener('beforeunload', releaseLock);
        window.addEventListener('pagehide', releaseLock);

        // Step 6: Show the page content
        showPage();
    }

    // Run immediately
    init();

})();
