# Online Exam Portal

A **web-based examination system** that allows users to take multiple-choice question (MCQ) exams with a timer, progress tracking, and results display. This system is designed for simplicity and speed, making it suitable for mock tests, practice exams, and educational assessments.

## 📌 Features

- **MCQ Exam Interface** – Displays questions one by one with multiple-choice options.
- **Timer Functionality** – Exam duration countdown with auto-submit on time expiry.
- **Progress Tracking** – Shows how many questions are completed and remaining.
- **Result Calculation** – Instantly displays score after exam completion.
- **Free User Mode** – Allows unrestricted practice without login.
- **Login System** – Supports optional ID and password authentication.
- **Data-Driven** – Loads questions from `data.js` for easy customization.
- **Copy Prevention** – JavaScript-based disabling of text selection and copying.

## 🗂 Project Structure

```
Online Exam/
│── index.html        # Main exam interface
│── main.css          # Styling for the exam UI
│── main.js           # Exam logic (question display, navigation, timer, results)
│── data.js           # Question bank in JavaScript format
│── disableCopy.js    # Script to prevent copying exam content
│── user.pswd         # User credentials file (if login is enabled)
│── img/              # Image assets (e.g., IR logo)
```

## 🚀 Getting Started

### 1️⃣ Prerequisites
- Any modern web browser (Chrome, Firefox, Edge, etc.)
- No server is required — works as a static HTML/JS site.

### 2️⃣ Installation
1. Download or clone this repository:
   ```bash
   git clone https://github.com/your-username/online-exam.git
   ```
2. Place all files in a single folder (maintaining structure).
3. Open `index.html` in your browser to start.

### 3️⃣ Optional: Hosting
You can host the site on:
- **GitHub Pages**  
- **Netlify / Vercel**  
- Any static hosting provider

## ⚙️ Customization

- **Edit Questions:**  
  Open `data.js` and modify the JSON array to update questions, options, and correct answers.
  
- **Change Exam Settings:**  
  Inside `main.js`, update variables for:
  - Total questions in the exam
  - Time limit in minutes
  - Free user or login mode

- **Login Credentials:**  
  Stored in `user.pswd` (simple authentication).

## 🛡 Security Notes
- Since this is a front-end-only project, answers are stored in `data.js` and can be viewed by anyone with access to source code. For secure, real exams, use a server-side backend.
- `disableCopy.js` prevents basic copying, but determined users can still inspect the code.

## 📷 Screenshots
*(Optional — Add screenshots of the exam UI here.)*

## 📄 License
This project is open-source under the MIT License.
