/* ============================================
   Course Recommendation Quiz Logic
   ============================================ */

const quizData = [
    {
        question: "What excites you the most when you see a great website or app?",
        options: [
            { text: "The beautiful layout, colors, and visual design.", score: { design: 10, uiux: 8 } },
            { text: "The features - how login works, how data flows.", score: { fullstack: 10, python: 8, java: 7 } },
            { text: "The security and how it protects user data.", score: { cybersecurity: 10, devsecops: 8 } },
            { text: "The speed and how it handles millions of users.", score: { aws: 10, devops: 10, azure: 7 } }
        ]
    },
    {
        question: "Which activity sounds most enjoyable to you?",
        options: [
            { text: "Creating logos, posters, and visual branding.", score: { design: 10 } },
            { text: "Building apps and writing code that works.", score: { fullstack: 10, python: 10, java: 10, react: 8 } },
            { text: "Setting up servers and automating deployments.", score: { aws: 10, devops: 10, azure: 8 } },
            { text: "Analyzing data and finding hidden patterns.", score: { dataanalytics: 10, aiml: 8 } }
        ]
    },
    {
        question: "What's your biggest career goal right now?",
        options: [
            { text: "Become a creative professional in design.", score: { design: 10, uiux: 10 } },
            { text: "Get a high-paying developer job at a tech company.", score: { fullstack: 10, python: 8, interview: 5, java: 8, react: 7 } },
            { text: "Work in cloud/DevOps and manage infrastructure.", score: { aws: 10, devops: 10, azure: 9 } },
            { text: "Master AI or Data Science tools.", score: { aiml: 10, dataanalytics: 10 } }
        ]
    },
    {
        question: "How do you prefer to solve problems?",
        options: [
            { text: "By sketching, wireframing, and visualizing.", score: { uiux: 10, design: 5 } },
            { text: "By writing step-by-step logic and code.", score: { fullstack: 10, python: 10, java: 9, dsa: 8 } },
            { text: "By analyzing systems and optimizing performance.", score: { devops: 10, aws: 8, azure: 8 } },
            { text: "By protecting systems from hackers and threats.", score: { cybersecurity: 10, devsecops: 9 } }
        ]
    },
    {
        question: "What kind of data or information interests you more?",
        options: [
            { text: "Visual assets, icons, and typography.", score: { design: 10, uiux: 8 } },
            { text: "User profiles, database records, and API calls.", score: { fullstack: 10, sql: 8, java: 7 } },
            { text: "Network logs, traffic patterns, and alerts.", score: { cybersecurity: 10, devops: 7 } },
            { text: "Sales figures, trends, and market statistics.", score: { dataanalytics: 10, aiml: 7, salesforce: 5 } }
        ]
    },
    {
        question: "Which work environment sounds best to you?",
        options: [
            { text: "A creative studio working on branding.", score: { design: 10 } },
            { text: "A fast-paced tech startup building apps.", score: { fullstack: 10, react: 8, python: 7 } },
            { text: "Managing cloud infrastructure for a Global MNC.", score: { aws: 10, azure: 10, devops: 9 } },
            { text: "Enterprise CRM and business automation.", score: { salesforce: 10, oracle: 8 } }
        ]
    }
];

const courseRecommendations = {
    design: { title: "Graphic Design", icon: "fas fa-paint-brush", url: "courses/graphic-design/", desc: "Unleash your creativity and master branding with our graphic design excellence program." },
    uiux: { title: "UI/UX Design", icon: "fas fa-object-group", url: "courses/ui-ux/", desc: "Design interfaces that people love using Figma and modern design principles." },
    fullstack: { title: "Full Stack Development", icon: "fas fa-code", url: "courses/full-stack/", desc: "Become a complete developer by mastering frontend, backend, and databases." },
    devops: { title: "DevOps Engineering", icon: "fas fa-infinity", url: "courses/devops/", desc: "Bridge the gap between development and operations with automation and CI/CD." },
    aws: { title: "AWS Cloud Excellence", icon: "fab fa-aws", url: "courses/aws/", desc: "Master the world's leading cloud platform and build scalable infrastructure." },
    azure: { title: "Azure Cloud Mastery", icon: "fab fa-microsoft", url: "courses/azure/", desc: "Become an expert in Microsoft Azure and manage robust enterprise cloud solutions." },
    aiml: { title: "AI & Machine Learning", icon: "fas fa-brain", url: "courses/ai-ml/", desc: "Dive into the future of technology by building intelligent models and AI systems." },
    dataanalytics: { title: "Data Analytics", icon: "fas fa-chart-line", url: "courses/data-analytics/", desc: "Turn raw data into actionable insights with modern analytics tools and techniques." },
    cybersecurity: { title: "Cyber Security", icon: "fas fa-shield-alt", url: "courses/cyber-security/", desc: "Protect organizations from digital threats and master ethical hacking." },
    devsecops: { title: "DevSecOps", icon: "fas fa-user-shield", url: "courses/devsecops/", desc: "Integrate security into the DevOps pipeline and build resilient systems." },
    salesforce: { title: "Salesforce Mastery", icon: "fab fa-salesforce", url: "courses/salesforce/", desc: "Master the world's #1 CRM platform and build powerful business automations." },
    python: { title: "Python Programming", icon: "fab fa-python", url: "courses/python/", desc: "Learn the most versatile programming language and build powerful applications." },
    java: { title: "Java Development", icon: "fab fa-java", url: "courses/java/", desc: "Master enterprise-grade development with Java and modern frameworks." },
    react: { title: "React JS Mastery", icon: "fab fa-react", url: "courses/react/", desc: "Build dynamic and high-performance user interfaces with React." },
    sql: { title: "SQL & Database Design", icon: "fas fa-database", url: "courses/sql/", desc: "Master data management and complex query optimization." },
    dsa: { title: "DSA Excellence", icon: "fas fa-subscript", url: "courses/dsa/", desc: "Master Data Structures and Algorithms to ace your technical interviews." },
    oracle: { title: "Oracle Fusion Cloud", icon: "fas fa-cloud", url: "courses/oracle-fusion-cloud/", desc: "Learn Oracle's leading enterprise resource planning solutions." }
};

let currentQuizStep = 0;
let userScores = {};

function initQuiz() {
    const quizTrigger = document.getElementById('startQuizBtn');
    const inlineContainer = document.getElementById('inlineQuizContainer');
    const ctaContent = document.getElementById('quizCtaContent');

    if (quizTrigger && inlineContainer) {
        // Use inline mode
        quizTrigger.addEventListener('click', function () {
            startInlineQuiz();
        });
    } else if (quizTrigger) {
        // Fallback to modal mode
        quizTrigger.addEventListener('click', openQuizModal);
        createModalIfNeeded();
    }
}

function startInlineQuiz() {
    const inlineContainer = document.getElementById('inlineQuizContainer');
    const ctaContent = document.getElementById('quizCtaContent');
    const quizCard = document.getElementById('quizCtaCard');

    if (!inlineContainer || !ctaContent) return;

    // Hide the CTA content and show quiz
    ctaContent.style.display = 'none';
    inlineContainer.classList.add('active');
    quizCard.classList.add('quiz-active');

    // Reduce section padding for a tighter fit
    const section = quizCard.closest('.quiz-cta-section');
    if (section) section.style.padding = '40px 0';

    // Start the quiz
    currentQuizStep = 0;
    userScores = {};
    renderInlineQuestion();
}

function renderInlineQuestion() {
    const quizBody = document.getElementById('inlineQuizBody');
    if (!quizBody) return;

    const question = quizData[currentQuizStep];

    quizBody.innerHTML = `
        <div class="inline-quiz-question">
            <div class="quiz-progress-bar">
                <div class="quiz-progress-fill" style="width: ${((currentQuizStep + 1) / quizData.length) * 100}%"></div>
            </div>
            <span class="quiz-step-indicator">Question ${currentQuizStep + 1} of ${quizData.length}</span>
            <h3>${question.question}</h3>
            <div class="quiz-options">
                ${question.options.map((opt, idx) => `
                    <button class="quiz-option" data-option-index="${idx}">
                        ${opt.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    // Add event listeners to options
    const options = quizBody.querySelectorAll('.quiz-option');
    options.forEach(option => {
        option.addEventListener('click', function () {
            const optionIdx = parseInt(this.getAttribute('data-option-index'));
            handleInlineOptionSelect(optionIdx);
        });
    });
}

function handleInlineOptionSelect(optionIdx) {
    const option = quizData[currentQuizStep].options[optionIdx];

    // Aggregate scores
    for (const [key, val] of Object.entries(option.score)) {
        userScores[key] = (userScores[key] || 0) + val;
    }

    currentQuizStep++;

    if (currentQuizStep < quizData.length) {
        renderInlineQuestion();
    } else {
        renderInlineResult();
    }
}

function renderInlineResult() {
    const quizBody = document.getElementById('inlineQuizBody');
    if (!quizBody) return;

    // Find highest score
    let bestMatchKey = 'fullstack';
    let maxScore = -1;

    for (const [key, score] of Object.entries(userScores)) {
        if (score > maxScore) {
            maxScore = score;
            bestMatchKey = key;
        }
    }

    const recommendation = courseRecommendations[bestMatchKey] || courseRecommendations['fullstack'];

    quizBody.innerHTML = `
        <div class="inline-quiz-result">
            <div class="result-badge">🎉 Perfect match found!</div>
            <div class="result-icon"><i class="${recommendation.icon}"></i></div>
            <h2>We recommend: ${recommendation.title}</h2>
            <p>${recommendation.desc}</p>
            <div class="result-actions">
                <a href="https://wa.me/917842239090?text=I'd like to enroll in ${recommendation.title}!" target="_blank" class="btn btn-whatsapp">
                    <i class="fab fa-whatsapp"></i> Enroll via WhatsApp
                </a>
                <a href="${recommendation.url}" class="btn btn-secondary">View Course Details</a>
            </div>
            <button class="quiz-restart" id="inlineRestartBtn"><i class="fas fa-dice"></i> Take another quiz</button>
        </div>
    `;

    // Add event listener for restart button
    const restartBtn = quizBody.querySelector('#inlineRestartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', resetInlineQuiz);
    }
}

function resetInlineQuiz() {
    const inlineContainer = document.getElementById('inlineQuizContainer');
    const ctaContent = document.getElementById('quizCtaContent');
    const quizCard = document.getElementById('quizCtaCard');

    if (!inlineContainer || !ctaContent) return;

    // Show the CTA content and hide quiz
    inlineContainer.classList.remove('active');
    quizCard.classList.remove('quiz-active');
    ctaContent.style.display = '';

    // Restore section padding
    const section = quizCard.closest('.quiz-cta-section');
    if (section) section.style.padding = '';

    // Reset state
    currentQuizStep = 0;
    userScores = {};
}

function createModalIfNeeded() {
    // Modal creation and injection (fallback for pages without inline container)
    if (!document.getElementById('quizModal')) {
        const modalHtml = `
            <div id="quizModal" class="quiz-modal">
                <div class="quiz-modal-content">
                    <button class="quiz-close" id="quizCloseBtn" aria-label="Close quiz">&times;</button>
                    <div id="quizBody">
                        <div class="quiz-intro">
                            <i class="fas fa-graduation-cap quiz-main-icon"></i>
                            <h2>Find Your Perfect Career Path</h2>
                            <p>Answer 3 quick questions and we'll recommend the best course for you!</p>
                            <button class="btn btn-primary" id="quizStartBtn">Get Started</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const closeBtn = document.getElementById('quizCloseBtn');
        const startBtn = document.getElementById('quizStartBtn');
        const modal = document.getElementById('quizModal');

        if (closeBtn) closeBtn.addEventListener('click', closeQuizModal);
        if (startBtn) startBtn.addEventListener('click', startQuiz);
        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) closeQuizModal();
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeQuizModal();
            }
        });
    }
}

function openQuizModal() {
    const modal = document.getElementById('quizModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeQuizModal() {
    const modal = document.getElementById('quizModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            currentQuizStep = 0;
            userScores = {};
            renderQuizIntro();
        }, 300);
    }
}

function renderQuizIntro() {
    const quizBody = document.getElementById('quizBody');
    if (!quizBody) return;
    quizBody.innerHTML = `
        <div class="quiz-intro">
            <i class="fas fa-graduation-cap quiz-main-icon"></i>
            <h2>Find Your Perfect Career Path</h2>
            <p>Answer 3 quick questions and we'll recommend the best course for you!</p>
            <button class="btn btn-primary" id="modalStartBtn">Get Started</button>
        </div>
    `;
    const startBtn = quizBody.querySelector('#modalStartBtn');
    if (startBtn) startBtn.addEventListener('click', startQuiz);
}

function startQuiz() {
    currentQuizStep = 0;
    userScores = {};
    renderQuestion();
}

function renderQuestion() {
    const quizBody = document.getElementById('quizBody');
    if (!quizBody) return;

    const question = quizData[currentQuizStep];

    quizBody.innerHTML = `
        <div class="quiz-question-container">
            <div class="quiz-progress-bar">
                <div class="quiz-progress-fill" style="width: ${((currentQuizStep + 1) / quizData.length) * 100}%"></div>
            </div>
            <span class="quiz-step-indicator">Question ${currentQuizStep + 1} of ${quizData.length}</span>
            <h3>${question.question}</h3>
            <div class="quiz-options">
                ${question.options.map((opt, idx) => `
                    <button class="quiz-option" data-option-index="${idx}">
                        ${opt.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    const options = quizBody.querySelectorAll('.quiz-option');
    options.forEach(option => {
        option.addEventListener('click', function () {
            const optionIdx = parseInt(this.getAttribute('data-option-index'));
            handleOptionSelect(optionIdx);
        });
    });
}

function handleOptionSelect(optionIdx) {
    const option = quizData[currentQuizStep].options[optionIdx];

    for (const [key, val] of Object.entries(option.score)) {
        userScores[key] = (userScores[key] || 0) + val;
    }

    currentQuizStep++;

    if (currentQuizStep < quizData.length) {
        renderQuestion();
    } else {
        renderResult();
    }
}

function renderResult() {
    const quizBody = document.getElementById('quizBody');
    if (!quizBody) return;

    let bestMatchKey = 'fullstack';
    let maxScore = -1;

    for (const [key, score] of Object.entries(userScores)) {
        if (score > maxScore) {
            maxScore = score;
            bestMatchKey = key;
        }
    }

    const recommendation = courseRecommendations[bestMatchKey] || courseRecommendations['fullstack'];

    quizBody.innerHTML = `
        <div class="inline-quiz-result" style="animation: slideUp 0.5s ease-out;">
            <div class="result-badge">Perfect Match Found!</div>
            <div class="result-icon"><i class="${recommendation.icon}"></i></div>
            <h2>We Recommend: ${recommendation.title}</h2>
            <p>${recommendation.desc}</p>
            <div class="result-actions">
                <a href="https://wa.me/917842239090?text=I'd like to enroll in ${recommendation.title}!" target="_blank" class="btn btn-whatsapp">
                    <i class="fab fa-whatsapp"></i> Enroll via WhatsApp
                </a>
                <a href="${recommendation.url}" class="btn btn-secondary">View Course Details</a>
            </div>
            <button class="quiz-restart" id="quizRestartBtn">← Take Another Quiz</button>
        </div>
    `;

    const restartBtn = quizBody.querySelector('#quizRestartBtn');
    if (restartBtn) restartBtn.addEventListener('click', startQuiz);
}

document.addEventListener('DOMContentLoaded', initQuiz);
window.startQuiz = startQuiz;
window.handleOptionSelect = handleOptionSelect;
window.closeQuizModal = closeQuizModal;
window.openQuizModal = openQuizModal;
window.resetInlineQuiz = resetInlineQuiz;
