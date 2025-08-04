// Categorize questions by count for section navigation and topic assignment
function categorizeQuestionsByCount(questions) {
    if (questions.length === 175) {
        let start = 0;
        const sections = [
            { topic: 'Traffic', count: 85 },
            { topic: 'GK/Rajabhasha', count: 55 },
            { topic: 'Est/Fin/Acc', count: 35 }
        ];
        return sections.flatMap(section => {
            const sectionQuestions = questions.slice(start, start + section.count)
                .map(q => ({ ...q, topic: section.topic }));
            start += section.count;
            return sectionQuestions;
        });
    } else if (questions.length === 110) {
        let start = 0;
        const sections = [
            { topic: 'Traffic', count: 70 },
            { topic: 'Rajabhasha', count: 10 },
            { topic: 'Est/Fin/Acc', count: 30 }
        ];
        return sections.flatMap(section => {
            const sectionQuestions = questions.slice(start, start + section.count)
                .map(q => ({ ...q, topic: section.topic }));
            start += section.count;
            return sectionQuestions;
        });
    } else {
        // No section breakdown for other counts
        return questions.map(q => ({ ...q, topic: 'General' }));
    }
}
// Section navigation button labels for 175 and 110 question exams
const sectionLabels_30 = [
    { label: 'Technical', key: 'Traffic' },
    { label: 'GK & Rajbhasha', key: 'GK/Rajabhasha' },
    { label: 'Est & Finance', key: 'Est/Fin/Acc' }
];
const sectionLabels_70 = [
    { label: 'Traffic', key: 'Traffic' },
    { label: 'Rajabhasha', key: 'Rajabhasha' },
    { label: 'Est/Fin/Acc', key: 'Est/Fin/Acc' }
];

// Render section navigation buttons based on question count
function renderSectionNav() {
    const nav = document.getElementById('section-nav');
    nav.innerHTML = '';
    let labels = [];
    let sectionRanges = [];
    if (questions.length === 175) {
        labels = sectionLabels_30;
        sectionRanges = [0, 85, 140, 175];
    } else if (questions.length === 110) {
        labels = sectionLabels_70;
        sectionRanges = [0, 70, 80, 110];
    } else {
        return;
    }
    for (let i = 0; i < labels.length; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-primary btn-sm section-nav-btn';
        btn.textContent = labels[i].label;
        btn.onclick = () => jumpToSection(labels[i].key);
        btn.dataset.sectionIndex = i;
        nav.appendChild(btn);
    }
    // Highlight the correct tab based on currentQuestion
    highlightSectionTab(sectionRanges);
}

function highlightSectionTab(sectionRanges) {
    const nav = document.getElementById('section-nav');
    const btns = nav.querySelectorAll('.section-nav-btn');
    let activeIdx = 0;
    for (let i = 0; i < sectionRanges.length - 1; i++) {
        if (currentQuestion >= sectionRanges[i] && currentQuestion < sectionRanges[i + 1]) {
            activeIdx = i;
            break;
        }
    }
    // Remove 'active' from all tabs first
    btns.forEach(btn => btn.classList.remove('active'));
    // Add 'active' only to the current tab
    if (btns[activeIdx]) btns[activeIdx].classList.add('active');
}

// Jump to the first question of a section by key
function jumpToSection(sectionKey) {
    let idx = 0;
    if (questions.length === 175) {
        if (sectionKey === 'Traffic') idx = 0;
        else if (sectionKey === 'GK/Rajabhasha') idx = 85;
        else if (sectionKey === 'Est/Fin/Acc') idx = 140;
    } else if (questions.length === 110) {
        if (sectionKey === 'Traffic') idx = 0;
        else if (sectionKey === 'Rajabhasha') idx = 70;
        else if (sectionKey === 'Est/Fin/Acc') idx = 80;
    } else {
        idx = questions.findIndex(q => (q.topic || q.section) === sectionKey);
    }
    if (idx !== -1 && questions[idx]) {
        currentQuestion = idx;
        loadQuestion(currentQuestion);
        let labels = sectionLabels_30;
        if (questions.length === 110) labels = sectionLabels_70;
        document.querySelectorAll('.section-nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.trim() === labels.find(l => l.key === sectionKey).label) {
                btn.classList.add('active');
            }
        });
        setTimeout(() => {
            const qCont = document.getElementById('questions-container');
            if (qCont) qCont.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}
// --- Global State and DOM Elements ---
let questions = []; // Holds current exam questions
let currentQuestion = 0; // Current question index
let isFreeUser = document.getElementById('free_user').checked;
let EXAM_QUESTION_COUNT; // Total number of questions for the exam
let EXAM_TIME_LIMIT_MINUTES; // Exam duration in minutes
let TOTAL_QUESTIONS; // For progress display
let userAnswers = []; // User's selected answers
let timeLeft; // Time left in seconds

// DOM element references
const loginPage = document.getElementById('login-page');
const examSelectionPage = document.getElementById('exam-selection-page');
const examPage = document.getElementById('exam-page');
const resultPage = document.getElementById('result-page');
const questionsContainer = document.getElementById('questions-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const timerElement = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const scoreElement = document.getElementById('score');
const feedbackElement = document.getElementById('feedback');
const viewAnswersBtn = document.getElementById('view-answers-btn');
const answersContainer = document.getElementById('answers-container');
const correctAnswersContainer = document.getElementById('correct-answers');
const retakeBtn = document.getElementById('retake-btn');
const excelUpload = document.getElementById('excel-upload');
const loginBtn = document.getElementById('login-btn');
const selectExamBtn = document.getElementById('select-exam-btn');
const studentIdInput = document.getElementById('student-id');
const passwordInput = document.getElementById('password-input');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastMessage = document.getElementById('toast-message');
const bsToast = new bootstrap.Toast(toast);
submitBtn.type = 'button';
const togglePassword = document.getElementById('show-password');
togglePassword.addEventListener('change', function () {
    passwordInput.type = this.checked ? 'text' : 'password';
});

// --- Start of new code to add ---

// Define which exams each user can access


// Render the exam selection radio buttons for allowed exams
function renderExamSelection(allowedExams) {
    const examSelectionContainer = document.getElementById('exam-selection-options');
    examSelectionContainer.innerHTML = '';
    if (allowedExams && allowedExams.length > 0) {
        const examLabels = {
            'auto': 'Automatic Block System (AUTO) Exam',
            'AOM23JUNE': 'AOM - JUNE 2023',
            'AOM20112022_30': 'AOM 30% LDCE - 20th NOV 2022',
            'AOM19022023_70': 'AOM 70% LDCE - 19th FEB 2023',
            'AOM05032023_70': 'AOM 70% LDCE - 05th MAR 2023',
            'AOM25062023_30': 'AOM 30% LDCE - 25th JUNE 2023'
        };
        allowedExams.forEach((exam, idx) => {
            const labelText = examLabels[exam] || exam;
            const isChecked = (allowedExams.length === 1 || idx === 0) ? 'checked' : '';
            const optionHtml = `
                <div class="form-check text-start">
                    <input class="form-check-input option-input" type="radio" name="exam_type" id="${exam}_exam" value="${exam}" ${isChecked}>
                    <label class="form-check-label option-label" for="${exam}_exam">${labelText}</label>
                </div>
            `;
            examSelectionContainer.innerHTML += optionHtml;
        });
        // Remove instructions loading from here; will be loaded after exam selection
    } else {
        examSelectionContainer.innerHTML = `<p>No exams available for this user. Contact KOMMARA SURESH</p>`;
        document.getElementById('select-exam-btn').disabled = true;
    }
}

// --- End of new code to add ---

function showToast(title, message, type = 'primary') {
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toast.className = `toast border-${type}`;
    bsToast.show();

    document.getElementById("e-id").innerHTML = "Crew ID: " + studentIdInput.value.toLocaleUpperCase();
}

// Format seconds as MM:SS for timer display
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

// Handle login: free user skips password, paid user checks password and loads allowed exams
loginBtn.addEventListener('click', function () {
    isFreeUser = document.getElementById('free_user').checked;
    const studentId = studentIdInput.value.trim().toUpperCase();
    const password = passwordInput.value;
    if (!studentId) {
        showToast("Error", "Please enter Crew ID");
        return;
    }
    if (isFreeUser) {
        loginPage.classList.add('hidden');
        renderExamSelection(['auto']);
        examSelectionPage.classList.remove('hidden');
    } else {
        if (!password) {
            showToast("Error", "Please enter password");
            return;
        }
        try {
            const storedPassword = eval(studentId);
            if (storedPassword && storedPassword === password) {
                loginPage.classList.add('hidden');
                examSelectionPage.classList.remove('hidden');
                const allowedExams = userExamMap[studentId] || [];
                renderExamSelection(allowedExams);
                showToast('Welcome', `Crew ID: ${studentId}`, 'success');
            } else {
                showToast("Access Denied", "Incorrect password");
            }
        } catch (e) {
            showToast("Access Denied", "Invalid Crew ID");
        }
    }
});

// Show instructions after exam type is selected, then allow proceeding to exam
selectExamBtn.addEventListener('click', function () {
    const examType = document.querySelector('input[name="exam_type"]:checked').value;
    // Hide exam page and show instructions section
    examSelectionPage.classList.add('hidden');
    // Create or show instructions modal/section
    let instrSection = document.getElementById('instructions-section');
    if (!instrSection) {
        instrSection = document.createElement('div');
        instrSection.id = 'instructions-section';
        instrSection.style.maxWidth = '700px';
        instrSection.style.margin = '30px auto';
        instrSection.style.background = '#fff';
        instrSection.style.borderRadius = '10px';
        instrSection.style.boxShadow = '0 0 10px #ccc';
        instrSection.style.padding = '24px';
        instrSection.style.textAlign = 'left';
        document.body.appendChild(instrSection);
    }
    instrSection.innerHTML = '<div style="text-align:center;font-size:1.2em;font-weight:bold;margin-bottom:10px;">Exam Instructions</div>';
    // Determine which instructions file to load based on exam structure
    let instructionsFile = 'instructions_other.html';
    // Map examType to question count (if needed, you can expand this logic)
    let qCount = 0;
    if (examType === 'auto') qCount = (typeof autoQuestions !== 'undefined') ? autoQuestions.length : 0;
    else if (examType === 'AOM23JUNE') qCount = (typeof AOM23JUNE !== 'undefined') ? AOM23JUNE.length : 0;
    else if (examType === 'AOM20112022_30') qCount = (typeof AOM20112022_30 !== 'undefined') ? AOM20112022_30.length : 0;
    else if (examType === 'AOM19022023_70') qCount = (typeof AOM19022023_70 !== 'undefined') ? AOM19022023_70.length : 0;
    else if (examType === 'AOM05032023_70') qCount = (typeof AOM05032023_70 !== 'undefined') ? AOM05032023_70.length : 0;
    else if (examType === 'AOM25062023_30') qCount = (typeof AOM25062023_30 !== 'undefined') ? AOM25062023_30.length : 0;
    if (qCount === 175) instructionsFile = 'instructions_175.html';
    else if (qCount === 110) instructionsFile = 'instructions_110.html';
    // fallback: other
    fetch(instructionsFile)
        .then(response => response.text())
        .then(html => {
            instrSection.innerHTML += html;
            // Add Proceed button
            if (!document.getElementById('proceed-to-exam-btn')) {
                const proceedBtn = document.createElement('button');
                proceedBtn.id = 'proceed-to-exam-btn';
                proceedBtn.className = 'btn btn-success mt-3';
                proceedBtn.style.display = 'block';
                proceedBtn.style.margin = '30px auto 0 auto';
                proceedBtn.textContent = 'Proceed to Exam';
                proceedBtn.onclick = function() {
                    instrSection.style.display = 'none';
                    startExam(examType);
                };
                instrSection.appendChild(proceedBtn);
            } else {
                document.getElementById('proceed-to-exam-btn').onclick = function() {
                    instrSection.style.display = 'none';
                    startExam(examType);
                };
            }
            instrSection.style.display = 'block';
        });
});

// Start the exam: load questions, set timer, initialize state, and show exam page
function startExam(examType) {
    currentQuestion = 0;
    const examMap = {
        'auto': autoQuestions,
        'AOM23JUNE': AOM23JUNE,
        'AOM20112022_30': AOM20112022_30,
        'AOM19022023_70': AOM19022023_70,
        'AOM05032023_70': AOM05032023_70,
        'AOM25062023_30': AOM25062023_30
    };
    questions = examMap[examType] || AOM23JUNE;
    questions = categorizeQuestionsByCount(questions);
    EXAM_QUESTION_COUNT = questions.length;
    if (questions.length === 175) {
        EXAM_TIME_LIMIT_MINUTES = 180;
    } else if (questions.length === 110) {
        EXAM_TIME_LIMIT_MINUTES = 120;
    } else {
        EXAM_TIME_LIMIT_MINUTES = questions.length;
    }
    TOTAL_QUESTIONS = questions.length;
    userAnswers = new Array(questions.length).fill(null);
    timeLeft = EXAM_TIME_LIMIT_MINUTES * 60;
    document.getElementById("tot_time").innerHTML = `${EXAM_TIME_LIMIT_MINUTES}`;
    document.getElementById("tot_questions").textContent = TOTAL_QUESTIONS;
    document.getElementById("res_questions").textContent = TOTAL_QUESTIONS;
    // Always show Crew ID, even for free user
    document.getElementById("e-id").innerHTML = "Crew ID: " + studentIdInput.value.toLocaleUpperCase();
    examSelectionPage.classList.add('hidden');
    examPage.classList.remove('hidden');
    timerInterval = setInterval(updateTimer, 1000);
    renderSectionNav();
    loadQuestion(currentQuestion);
    updateProgressBar();
}

// Update the countdown timer and handle time expiry
function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        submitExam();
        return;
    }
    timeLeft--;
    timerElement.textContent = formatTime(timeLeft);
    if (timeLeft < 300) {
        timerElement.style.color = '#dc3545';
    }
}

// Render the current question and options, update navigation buttons
function loadQuestion(index) {
    questionsContainer.innerHTML = '';
    const questionCard = document.createElement('div');
    questionCard.className = 'question-card';
    const questionNumber = document.createElement('div');
    questionNumber.className = 'question-number mb-3 pill-qnum';
    questionNumber.innerHTML = `<span class="pill pill-q">Q${index + 1}</span> <span class="qtext">${questions[index].question}</span>`;
    questionCard.appendChild(questionNumber);
    questions[index].options.forEach((option, optionIndex) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'form-check';
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question${index}`;
        input.id = `q${index}option${optionIndex}`;
        input.className = 'option-input';
        input.value = optionIndex;
        if (userAnswers[index] === optionIndex) {
            input.checked = true;
        }
        const label = document.createElement('label');
        label.htmlFor = `q${index}option${optionIndex}`;
        label.className = 'option-label';
        label.innerHTML = `<span class="pill pill-opt">${optionIndex + 1}</span> <span class="option-text">${option}</span>`;
        input.addEventListener('change', () => {
            userAnswers[index] = optionIndex;
            updateProgressBar();
        });
        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        questionCard.appendChild(optionDiv);
    });
    questionsContainer.appendChild(questionCard);
    // Update navigation button states
    prevBtn.disabled = index === 0;
    if (index === questions.length - 1) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
    // Highlight the correct tab based on current question
    if (questions.length === 175) {
        highlightSectionTab([0, 85, 140, 175]);
    } else if (questions.length === 110) {
        highlightSectionTab([0, 70, 80, 110]);
    }
}
// Update the progress bar and answered count
function updateProgressBar() {
    const answeredCount = userAnswers.filter(answer => answer !== null).length;
    const percentage = (answeredCount / questions.length) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${answeredCount}/${questions.length}`;
}

// Submit the exam, calculate score, show feedback, and email results
function submitExam() {
    clearInterval(timerInterval);
    let attempted = 0;
    let score = 0;
    let negative = 0;
    for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i] !== null) {
            attempted++;
            if (userAnswers[i] === questions[i].correctAnswer) {
                score++;
            } else {
                negative += 1/3;
            }
        }
        if (attempted === 150) break;
    }
    let finalScore = score - negative;
    if (finalScore < 0) finalScore = 0;
    finalScore = Math.round(finalScore * 100) / 100;
    scoreElement.textContent = finalScore;
    document.getElementById("r-id").innerHTML = "Crew ID: " + studentIdInput.value.toLocaleUpperCase();
    if (finalScore >= 90) {
        feedbackElement.className = 'feedback alert alert-success';
        feedbackElement.innerHTML = `<strong>Congratulations!</strong> You qualified with ${finalScore} marks!`;
    } else {
        feedbackElement.className = 'feedback alert alert-danger';
        feedbackElement.innerHTML = `<strong>Needs improvement.</strong> You scored ${finalScore} out of 150.`;
    }
    // Show correct answers for all questions
    correctAnswersContainer.innerHTML = '';
    questions.forEach((q, i) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'mb-3 p-2 border-bottom';
        const userAnswerIndex = userAnswers[i];
        const userAnswerText = userAnswerIndex !== null ? q.options[userAnswerIndex] : 'Not Answered';
        const isCorrect = userAnswerIndex === q.correctAnswer;
        const resultColor = isCorrect ? 'green' : (userAnswerText === "Not Answered") ? 'OrangeRed' : 'Red';
        answerDiv.innerHTML = `
        <strong style="color:DarkBlue;">Q ${i + 1}:</strong> ${q.question}<br>
        <span style="color:${resultColor};"><strong>Your Answer:</strong> ${userAnswerText}</span><br>
        <strong>Correct Answer:</strong> ${q.options[q.correctAnswer]}
        <span style="float:right; font-size:smaller; color:#888;">[${q.topic || ''}]</span>
        `;
        correctAnswersContainer.appendChild(answerDiv);
    });
    // Show result page
    examPage.classList.add('hidden');
    resultPage.classList.remove('hidden');
    answersContainer.classList.add('hidden');
    // EmailJS integration: send result to admin
    emailjs.init("8QLH7j50J-Z06jiLq");
    emailjs.send("service_3y0p7zd", "template_9xwwa3n", {
        to_email: "vskptmc@gmail.com",
        student_id: studentIdInput.value.toUpperCase(),
        score: score,
        total: questions.length,
        result_body: questions.map((q, i) => {
            const yourAnswer = userAnswers[i] !== null ? q.options[userAnswers[i]] : "Not Answered";
            const correctAnswer = q.options[q.correctAnswer];
            return `Q${i + 1}: ${q.question}\nYour Answer: ${yourAnswer}\nCorrect Answer: ${correctAnswer}`;
        }).join("\n------------------------\n")
    }).then(() => {
        console.log("✅ Result email sent to admin");
    }).catch((error) => {
        console.error("❌ Failed to send email:", error);
    });
}


// --- Navigation and Action Event Listeners ---
prevBtn.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion(currentQuestion);
    }
});
nextBtn.addEventListener('click', () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion(currentQuestion);
    }
});
submitBtn.addEventListener('click', submitExam);
viewAnswersBtn.addEventListener('click', () => {
    answersContainer.classList.toggle('hidden');
});
retakeBtn.addEventListener('click', () => {
    // Reset state for retake
    currentQuestion = 0;
    userAnswers = new Array(EXAM_TIME_LIMIT_MINUTES).fill(null);
    updateProgressBar();
    resultPage.classList.add('hidden');
    examPage.classList.remove('hidden');
    answersContainer.classList.add('hidden');
    timerInterval = setInterval(updateTimer, 1000);
    loadQuestion(currentQuestion);
});



// Export exam results to Excel file
document.getElementById('export-btn').addEventListener('click', function () {
    const studentId = studentIdInput.value.trim().toUpperCase();
    const data = questions.map((q, i) => ({
        "Question No.": i + 1,
        "Question": q.question,
        "Your Answer": userAnswers[i] !== null ? q.options[userAnswers[i]] : 'Not Answered',
        "Correct Answer": q.options[q.correctAnswer],
        "Result": userAnswers[i] === q.correctAnswer ? "Correct" : "Wrong"
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, `${studentId}_Exam_Results.xlsx`);
});