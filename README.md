# 🧠 MindSense AI — Mental Health Score Prediction

> An end-to-end machine learning web application that predicts a mental health score from user-provided lifestyle and questionnaire data, explains the prediction using SHAP, provides personalized recommendations, maintains prediction history, and generates downloadable PDF reports.

## 🚀 Live Demo

🔗 **Live Application:**  
https://mental-health-score-prediction-61cy.onrender.com

## 📌 Overview

**MindSense** is a machine learning-based web application designed to provide an estimated mental health score based on user-provided information.

The application combines a machine learning model with an interactive web interface and explainable AI techniques. Instead of displaying only a prediction, MindSense also provides information about the factors contributing to the prediction and generates recommendations based on the result.

The application is built as a full-stack ML project with a Python/FastAPI backend, JavaScript-based frontend, SQLite database, and a trained machine learning model.

---

## ✨ Features

### 📊 Mental Health Score Prediction

Users can enter their information through an interactive prediction form. The submitted data is processed by the backend and passed to the trained machine learning model.

The application returns a predicted mental health score.

### 🔍 Explainable AI with SHAP

MindSense uses **SHAP (SHapley Additive exPlanations)** to provide an explanation of the model prediction.

This helps users understand which input features contributed to the predicted score instead of treating the model as a complete black box.

### 💡 Personalized Recommendations

After generating a prediction, the application displays recommendations based on the prediction and relevant factors.

### 📜 Prediction History

Previous predictions are stored in the database and displayed in the prediction history section.

The history includes information such as:

- Date and time
- Predicted score
- Risk level
- Status

### 📄 PDF Reports

Users can download a PDF report containing their prediction results and related information.

### ✅ Form Validation

The application validates user input before sending the prediction request to the backend.

### 🌐 Web Interface

The application includes multiple pages:

- Home
- Predict
- About
- Contact

### ☁️ Deployment

The complete application is deployed on **Render** and can be accessed through the live demo link above.

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Bootstrap

### Backend

- Python
- FastAPI
- Jinja2

### Machine Learning

- Python
- NumPy
- Pandas
- Scikit-learn
- SHAP

### Database

- SQLite

### Reporting

- PDF report generation

### Deployment

- Render

### Development Tools

- Git
- GitHub
- VS Code

---

## 🏗️ Application Architecture

```text
                    ┌──────────────────────┐
                    │       User           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Web Interface     │
                    │   HTML/CSS/JS        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      FastAPI         │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
          ┌─────────────────┐    ┌─────────────────┐
          │  ML Prediction  │    │     SQLite      │
          │     Model       │    │    Database     │
          └────────┬────────┘    └─────────────────┘
                   │
          ┌────────┴─────────┐
          │                  │
          ▼                  ▼
   ┌─────────────┐    ┌───────────────┐
   │     SHAP    │    │ Recommendations│
   │ Explanation │    │                │
   └─────────────┘    └───────────────┘
                   │
                   ▼
          ┌─────────────────┐
          │   PDF Report    │
          └─────────────────┘




## 📂 Project Structure

```text
mental-health-score-prediction/
│
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   │
│   ├── index.html
│   ├── predict.html
│   ├── about.html
│   └── contact.html
│
├── backend/
│   ├── main.py
│   ├── routes.py
│   ├── database.py
│   └── ...
│
├── model/
│   └── model.pkl
│
├── requirements.txt
├── pyproject.toml
├── .gitignore
└── README.md

🧠 How It Works
User Input
    ↓
Frontend Form Validation
    ↓
FastAPI Backend
    ↓
Machine Learning Model
    ↓
Mental Health Score
    ↓
┌───────────────────────┐
│ SHAP Explanation      │
│ Recommendations       │
│ Prediction History    │
│ PDF Report            │
└───────────────────────┘
⚙️ Run Locally
1. Clone the Repository
git clone https://github.com/aarfa-12/mental-health-score-prediction.git
2. Navigate to the Project
cd mental-health-score-prediction
3. Create a Virtual Environment
python -m venv .venv
4. Activate the Environment

Windows:

.venv\Scripts\activate

Linux/macOS:

source .venv/bin/activate
5. Install Dependencies
pip install -r requirements.txt
6. Start the Application
uvicorn main:app --reload

Open the application in your browser:

http://127.0.0.1:8000
🌐 Deployment

The application is deployed on Render.

The FastAPI backend serves the frontend and handles the machine learning prediction workflow through a single application URL.

Production URL:

https://mental-health-score-prediction-61cy.onrender.com

⚠️ Disclaimer

MindSense is an educational machine learning project.

The predictions and recommendations provided by this application should not be considered medical advice, diagnosis, or treatment and should not replace professional medical or mental health evaluation.

👩‍💻 Author

Aarfa Fatima

B.Tech — Computer Science & Engineering
Specialization: Artificial Intelligence & Machine Learning

GitHub:
https://github.com/aarfa-12

⭐ If you find this project useful or interesting, consider giving the repository a star.




