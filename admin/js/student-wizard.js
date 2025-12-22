// Student Wizard Logic - Shared between Dashboard and Students pages

let currentWizardStep = 1;

const totalWizardSteps = 3;

function wizardNext() {
    if (validateWizardStep(currentWizardStep)) {
        if (currentWizardStep < totalWizardSteps) {
            currentWizardStep++;
            updateWizardUI();
        }
    }
}

function wizardPrev() {
    if (currentWizardStep > 1) {
        currentWizardStep--;
        updateWizardUI();
    }
}

function goToStep(step) {
    if (step >= 1 && step <= totalWizardSteps) {
        currentWizardStep = step;
        updateWizardUI();
    }
}

function updateWizardUI() {
    // Update indicator
    const steps = document.querySelectorAll('.wizard-step');
    steps.forEach(s => {
        const stepNum = parseInt(s.dataset.step);
        s.classList.toggle('active', stepNum === currentWizardStep);
        s.classList.toggle('completed', stepNum < currentWizardStep);
    });

    // Update panel visibility
    const stepPanels = document.querySelectorAll('.wizard-panel');
    stepPanels.forEach(p => {
        const panelNum = parseInt(p.dataset.panel);
        p.classList.toggle('active', panelNum === currentWizardStep);
    });

    // Update footer buttons (Correct IDs from HTML)
    const prevBtn = document.getElementById('wizardPrevBtn');
    const nextBtn = document.getElementById('wizardNextBtn');
    const submitBtn = document.getElementById('wizardSubmitBtn');

    if (prevBtn) prevBtn.style.display = currentWizardStep === 1 ? 'none' : 'block';
    if (nextBtn) nextBtn.style.display = currentWizardStep === 3 ? 'none' : 'block';
    if (submitBtn) submitBtn.style.display = currentWizardStep === 3 ? 'block' : 'none';
}

function validateWizardStep(step) {
    if (step === 1) {
        const name = document.getElementById('studentName').value.trim();
        const phone = document.getElementById('studentPhone').value.trim();
        if (!name || phone.length < 10) {
            showToast('Please enter name and valid 10-digit phone', 'error');
            return false;
        }
    } else if (step === 2) {
        const selectedCourses = getSelectedCourses();
        const totalFee = document.getElementById('totalFee').value;
        if (selectedCourses.length === 0 || !totalFee) {
            showToast('Please select at least one course and enter total fee', 'error');
            return false;
        }
    }
    return true;
}

function resetWizard() {
    currentWizardStep = 1;
    updateWizardUI();
    const form = document.getElementById('addStudentForm');
    if (form) form.reset();
    const totalFee = document.getElementById('totalFee');
    if (totalFee) totalFee.value = '';
    if (typeof resetCourseSelection === 'function') {
        resetCourseSelection();
    }
    const feesList = document.getElementById('courseFeesList');
    if (feesList) feesList.innerHTML = '';
    const feesContainer = document.getElementById('courseFeesContainer');
    if (feesContainer) feesContainer.style.display = 'none';
    if (typeof calculateFinalFee === 'function') {
        calculateFinalFee();
    }
}

// Multi-Select Course logic
function toggleMultiSelect() {
    const dropdown = document.getElementById('studentCoursesDropdown');
    if (dropdown) dropdown.classList.toggle('open');
}

function getSelectedCourses() {
    const dropdown = document.getElementById('studentCoursesDropdown');
    if (!dropdown) return [];
    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function updateCourseSelectionDisplay() {
    const dropdown = document.getElementById('studentCoursesDropdown');
    if (!dropdown) return;
    const selectedText = dropdown.querySelector('.selected-text');
    const selectedCourses = getSelectedCourses();

    if (selectedCourses.length === 0) {
        selectedText.textContent = 'Select courses...';
        selectedText.classList.remove('has-selection');
    } else if (selectedCourses.length === 1) {
        selectedText.textContent = selectedCourses[0];
        selectedText.classList.add('has-selection');
    } else {
        selectedText.textContent = `${selectedCourses.length} courses selected`;
        selectedText.classList.add('has-selection');
    }

    // Update dynamic fee fields
    const feesContainer = document.getElementById('courseFeesContainer');
    const feesList = document.getElementById('courseFeesList');

    if (feesContainer && feesList) {
        if (selectedCourses.length > 0) {
            feesContainer.style.display = 'block';

            // Keep track of existing values to avoid clearing them as user checks/unchecks
            const existingFees = {};
            feesList.querySelectorAll('input').forEach(input => {
                existingFees[input.dataset.course] = input.value;
            });

            feesList.innerHTML = selectedCourses.map(course => `
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 0.75rem; color: #64748b; margin-bottom: 4px;">${course}</label>
                    <input type="number" class="course-fee-input" data-course="${course}" 
                           placeholder="Fee for ${course}" min="0" 
                           value="${existingFees[course] || ''}"
                           onchange="calculateFinalFee()"
                           style="padding: 10px; font-size: 0.9rem;">
                </div>
            `).join('');
        } else {
            feesContainer.style.display = 'none';
            feesList.innerHTML = '';
        }
    }

    // Update hidden field if exists for compatibility
    const hiddenInput = document.getElementById('studentCourse');
    if (hiddenInput) hiddenInput.value = selectedCourses.join(', ');

    // Recalculate fees
    if (typeof calculateFinalFee === 'function') {
        calculateFinalFee();
    }
}

function resetCourseSelection() {
    const dropdown = document.getElementById('studentCoursesDropdown');
    if (dropdown) {
        dropdown.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        dropdown.classList.remove('open');
        updateCourseSelectionDisplay();
    }
}

// Global modal helpers
function openAddStudentModal() {
    const form = document.getElementById('addStudentForm');
    if (form) form.reset();
    const totalFee = document.getElementById('totalFee');
    if (totalFee) totalFee.value = '';

    resetWizard();
    document.getElementById('addStudentModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Initialize listeners
document.addEventListener('DOMContentLoaded', () => {
    // Course selection listener
    const courseDropdown = document.getElementById('studentCoursesDropdown');
    if (courseDropdown) {
        courseDropdown.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', updateCourseSelectionDisplay);
        });
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('studentCoursesDropdown');
        if (dropdown && !dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
});

// Exports
window.goToStep = goToStep;
window.resetWizard = resetWizard;
window.toggleMultiSelect = toggleMultiSelect;
window.openAddStudentModal = openAddStudentModal;
window.closeModal = closeModal;
window.resetCourseSelection = resetCourseSelection;
window.updateCourseSelectionDisplay = updateCourseSelectionDisplay;
