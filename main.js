// Sample questions if no Excel file is uploaded
let questions = []; 
let currentQuestion = 0;

let isFreeUser = document.getElementById('free_user').checked;
// const freeUser = document.getElementById('free_user');

// Global Exam Configuration Variables
let EXAM_QUESTION_COUNT; // Set the total number of questions for the exam
let EXAM_TIME_LIMIT_MINUTES; // Set the exam duration in minutes
let TOTAL_QUESTIONS;

let userAnswers = []; //let timerInterval;
let timeLeft; // minutes in seconds // DOM elements

const loginPage = document.getElementById('login-page');
const examSelectionPage = document.getElementById('exam-selection-page'); // Added
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
const selectExamBtn = document.getElementById('select-exam-btn'); // Added
const studentIdInput = document.getElementById('student-id');
const passwordInput = document.getElementById('password-input'); // Added
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastMessage = document.getElementById('toast-message');
const bsToast = new bootstrap.Toast(toast);

submitBtn.type = 'button'; // Add this line

const togglePassword = document.getElementById('show-password');

togglePassword.addEventListener('change', function () {
    passwordInput.type = this.checked ? 'text' : 'password';
});

// --- Start of new code to add ---

// Define which exams each user can access


// Function to dynamically render the exam selection options
function renderExamSelection(allowedExams) {
    const examSelectionContainer = document.getElementById('exam-selection-options');
    examSelectionContainer.innerHTML = ''; // Clear previous options

    if (allowedExams && allowedExams.length > 0) {
        allowedExams.forEach((exam) => {
            let labelText = '';
            let isChecked = '';

            // Set the display name and check the first option by default AOM20112022_30
           if (exam === 'auto') {
                labelText = 'Automatic Block System (AUTO) Exam';
                isChecked = 'checked';
            } else if (exam === 'AOM23JUNE') {
                labelText = 'AOM - JUNE 2023';
                if (allowedExams.length === 1) {
                    isChecked = 'checked';
                }
            }else if (exam === 'AOM20112022_30') {
                labelText = 'AOM 30% LDCE - 20th NOV 2022';
                if (allowedExams.length === 1) {
                    isChecked = 'checked';
                }
            } else if (exam === 'AOM19022023_70') {
                labelText = 'AOM 70% LDCE - 19th FEB 2023';
                if (allowedExams.length === 1) {
                    isChecked = 'checked';
                }
            } else if (exam === 'AOM05032023_70') {
                labelText = 'AOM 70% LDCE - 05th MAR 2023';
                if (allowedExams.length === 1) {
                    isChecked = 'checked';
                }
            }else if (exam === 'AOM25062023_30') {
                labelText = 'AOM 30% LDCE - 25th JUNE 2023';
                if (allowedExams.length === 1) {
                    isChecked = 'checked';
                }
            }else {
                labelText = exam; // Fallback for other exams
            }

            const optionHtml = `
                <div class="form-check text-start">
                    <input class="form-check-input option-input" type="radio" name="exam_type" id="${exam}_exam" value="${exam}" ${isChecked}>
                    <label class="form-check-label option-label" for="${exam}_exam">${labelText}</label>
                </div>
            `;
            examSelectionContainer.innerHTML += optionHtml;
        });
    } else {
        // Handle case where no exams are available for the user
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

// Format time as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

// Login button event listener
loginBtn.addEventListener('click', function () {
    isFreeUser = document.getElementById('free_user').checked;
    const studentId = studentIdInput.value.trim().toUpperCase();
    const password = passwordInput.value;

    if (!studentId) {
        showToast("Error", "Please enter Crew ID");
        return;
    }

    if (isFreeUser) {
        // FREE user: no password check
        loginPage.classList.add('hidden');
        renderExamSelection(['auto']);
        examSelectionPage.classList.remove('hidden'); // Show exam selection page
    } else {
        // PAID user: check password
        if (!password) {
            showToast("Error", "Please enter password");
            return;
        }

        try {
            const storedPassword = eval(studentId);
            if (storedPassword && storedPassword === password) {
                loginPage.classList.add('hidden');
                examSelectionPage.classList.remove('hidden'); // Show exam selection page
                
                // Get allowed exams from the map, or an empty array if not found
                const allowedExams = userExamMap[studentId] || [];
                
                // Call the new function to render the correct options
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

// Select Exam button event listener
selectExamBtn.addEventListener('click', function () {
    const examType = document.querySelector('input[name="exam_type"]:checked').value;
    startExam(examType);
});

// New function to start the exam after selection
function startExam(examType) {
    if (examType === 'auto') {
        questions = autoQuestions;
    } else if (examType === 'AOM23JUNE') {
        questions = AOM23JUNE;
    } else if (examType === 'AOM20112022_30') {
        questions = AOM20112022_30;
    } else if (examType === 'AOM19022023_70') {
        questions = AOM19022023_70;
    } else if (examType === 'AOM05032023_70') {
        questions = AOM05032023_70;
    } else if (examType === 'AOM25062023_30') {
        questions = AOM25062023_30;
    } else {
        // Default to AOM if something goes wrong
        questions = AOM23JUNE;
    }
    
    EXAM_QUESTION_COUNT = questions.length;
    EXAM_TIME_LIMIT_MINUTES = questions.length;
    TOTAL_QUESTIONS = questions.length;
    userAnswers = new Array(EXAM_TIME_LIMIT_MINUTES).fill(null);
    timeLeft = EXAM_TIME_LIMIT_MINUTES * 60;
    
    document.getElementById("tot_time").innerHTML = `${EXAM_TIME_LIMIT_MINUTES}`;
    document.getElementById("tot_questions").textContent = TOTAL_QUESTIONS;
    document.getElementById("res_questions").textContent = TOTAL_QUESTIONS;

    examSelectionPage.classList.add('hidden');
    examPage.classList.remove('hidden');
    timerInterval = setInterval(updateTimer, 1000);
    loadQuestion(currentQuestion);
    updateProgressBar();
}

// Update timer
function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        submitExam();
        return;
    }

    timeLeft--;
    timerElement.textContent = formatTime(timeLeft);

    // Change color when time is running out
    if (timeLeft < 300) { // Less than 5 minutes
        timerElement.style.color = '#dc3545';
    }
}

// Load question
// Load question
function loadQuestion(index) {
    questionsContainer.innerHTML = '';

    const questionCard = document.createElement('div');
    questionCard.className = 'question-card';

    const questionNumber = document.createElement('div');
    questionNumber.className = 'question-number mb-3';
    questionNumber.textContent = `Q${index + 1}: ${questions[index].question}`;
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
        // Add the option number to the label text
        label.textContent = `${optionIndex + 1}.  ${option}`;

        input.addEventListener('change', () => {
            userAnswers[index] = optionIndex;
            updateProgressBar();
        });

        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        questionCard.appendChild(optionDiv);
    });

    questionsContainer.appendChild(questionCard);

    // Update button states
    prevBtn.disabled = index === 0;
    if (index === questions.length - 1) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
}
// Update progress bar
function updateProgressBar() {
    const answeredCount = userAnswers.filter(answer => answer !== null).length;
    const percentage = (answeredCount / questions.length) * 100;

    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${answeredCount}/${questions.length}`;

}

// Submit exam
function submitExam() {
    clearInterval(timerInterval);

    // Calculate score
    let score = 0;
    const feedback = [];

    for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i] === questions[i].correctAnswer) {
            score++;
            feedback.push(`Question ${i + 1}: Correct!`);
        } else {
            feedback.push(`Question ${i + 1}: Incorrect. The correct answer was: ${questions[i].options[questions[i].correctAnswer]}`);
        }
    }

    // Display results
    scoreElement.textContent = score;

    document.getElementById("r-id").innerHTML = "Crew ID: " + studentIdInput.value.toLocaleUpperCase();

    // Generate feedback
    if (score === questions.length) {
        feedbackElement.className = 'feedback alert alert-success';
        feedbackElement.innerHTML = `<strong>Excellent!</strong> You got all questions correct!`;
    } else if (score >= questions.length * 0.7) {
        feedbackElement.className = 'feedback alert alert-info';
        feedbackElement.innerHTML = `<strong>Good job!</strong> You passed the exam with ${score} correct answers.`;
    } else {
        feedbackElement.className = 'feedback alert alert-danger';
        feedbackElement.innerHTML = `<strong>Needs improvement.</strong> You scored ${score} out of ${questions.length}.`;
    }

    // Prepare correct answers display
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
    `;
        correctAnswersContainer.appendChild(answerDiv);
    });

    // Show result page
    examPage.classList.add('hidden');
    resultPage.classList.remove('hidden');
    answersContainer.classList.add('hidden');


    // Simplified main.js with EmailJS integration (real logic assumed already exists)

    // After submitExam() result display
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


//Event Listeners
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
    // Reset everything
    currentQuestion = 0;
    userAnswers = new Array(EXAM_TIME_LIMIT_MINUTES).fill(null); //timeLeft = 25 * 60; //timerElement.textContent = formatTime(timeLeft);
    updateProgressBar();

    // Show exam page again
    resultPage.classList.add('hidden');
    examPage.classList.remove('hidden');
    answersContainer.classList.add('hidden');

    // Start timer again
    timerInterval = setInterval(updateTimer, 1000);
    // Load first question
    loadQuestion(currentQuestion);
});
// Initialize
// updateProgressBar(); // Initial call is now moved to startExam()



document.getElementById('export-btn').addEventListener('click', function () {
    const studentId = studentIdInput.value.trim().toUpperCase();

    const data = questions.map((q, i) => {
        return {
            "Question No.": i + 1,
            "Question": q.question,
            "Your Answer": userAnswers[i] !== null ? q.options[userAnswers[i]] : 'Not Answered',
            "Correct Answer": q.options[q.correctAnswer],
            "Result": userAnswers[i] === q.correctAnswer ? "Correct" : "Wrong"
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

    XLSX.writeFile(workbook, `${studentId}_Exam_Results.xlsx`);
});