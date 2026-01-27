/* ============================================
   SKELETON LOADING - JavaScript
   ============================================ */

function removeSkeletonAndPopulate(elementId, content, isHTML = false) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Set the content
    if (isHTML) {
        element.innerHTML = content;
    } else {
        element.innerText = content;
    }

    // Remove skeleton class and inline styles
    element.classList.remove('skeleton-placeholder');
    element.classList.remove('skeleton');
    element.removeAttribute('style');
}
