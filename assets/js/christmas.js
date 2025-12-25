/* ============================================
   CHRISTMAS SNOWFALL - JavaScript
   Auto-activates: Dec 25 00:00 to Jan 1 23:59 IST (every year)
   ============================================ */

(function () {
    'use strict';

    // Check if it's Christmas season (Dec 25 - Jan 1)
    function isChristmasSeason() {
        const now = new Date();
        const month = now.getMonth(); // 0-11 (0=Jan, 11=Dec)
        const day = now.getDate();

        // Dec 25-31 (month 11, day 25-31) OR Jan 1 (month 0, day 1)
        if (month === 11 && day >= 25) return true;  // Dec 25-31
        if (month === 0 && day === 1) return true;   // Jan 1
        return false;
    }

    if (!isChristmasSeason()) {
        console.log('🎄 Not Christmas season. Snowfall inactive.');
        return;
    }

    // Don't run on admin pages
    if (window.location.pathname.includes('/admin')) {
        return;
    }

    console.log('🎄 Merry Christmas! Snowfall activated.');

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/christmas.css';
    document.head.appendChild(link);

    // Create snowfall container
    const snowfall = document.createElement('div');
    snowfall.className = 'snowfall';
    snowfall.setAttribute('aria-hidden', 'true');

    // Festive characters - snowflakes and trees
    const flakes = ['❄', '❅', '❆', '✧', '✦'];
    const trees = ['🎄'];
    const stars = ['⭐', '✨'];

    // Create 25 snowflakes
    for (let i = 0; i < 25; i++) {
        const flake = document.createElement('span');
        flake.className = 'snowflake';
        flake.textContent = flakes[Math.floor(Math.random() * flakes.length)];
        snowfall.appendChild(flake);
    }

    // Create decorative trees at bottom
    const treeContainer = document.createElement('div');
    treeContainer.className = 'christmas-trees';

    // Left tree
    const leftTree = document.createElement('span');
    leftTree.className = 'tree tree-left';
    leftTree.textContent = '🎄';
    treeContainer.appendChild(leftTree);

    // Right tree
    const rightTree = document.createElement('span');
    rightTree.className = 'tree tree-right';
    rightTree.textContent = '🎄';
    treeContainer.appendChild(rightTree);

    // Add to page when DOM is ready
    function addChristmasElements() {
        document.body.appendChild(snowfall);
        document.body.appendChild(treeContainer);
    }

    if (document.body) {
        addChristmasElements();
    } else {
        document.addEventListener('DOMContentLoaded', addChristmasElements);
    }
})();
