# PULMOCARE – PNEUMONIA DETECTION SYSTEM

[![Java](https://img.shields.io/badge/Java-17-blue)]()
[![Spring Boot](https://img.shields.io/badge/SpringBoot-Backend-brightgreen)]()
[![Python](https://img.shields.io/badge/Python-ML-yellow)]()
[![TensorFlow](https://img.shields.io/badge/TensorFlow-Model-orange)]()
[![Maven](https://img.shields.io/badge/Build-Maven-red)]()
[![Deployment](https://img.shields.io/badge/Deployment-Railway-purple)]()
[![Frontend](https://img.shields.io/badge/Frontend-Netlify-blue)]()

PulmoCare is an AI-powered pneumonia detection system that analyzes chest X-ray images and provides instant predictions. It integrates a deep learning model with a Spring Boot backend to deliver fast, reliable, and scalable medical image analysis.

---

# LIVE DEMO

(Netlify)
[https://strippy.netlify.app/](https://strippy.netlify.app/)
---

# OVERVIEW

This project demonstrates the integration of machine learning with backend engineering to solve a real-world healthcare problem. Users can upload chest X-ray images and receive predictions indicating whether pneumonia is present.

---

# KEY FEATURES

* Deep learning-based pneumonia detection
* RESTful API built using Spring Boot
* Real-time image upload and prediction
* Clean and structured JSON responses
* Fully deployed frontend and backend

---

# TECH STACK

| Layer      | Technology                 |
| ---------- | -------------------------- |
| Backend    | Java, Spring Boot          |
| ML Model   | Python, TensorFlow / Keras |
| Build Tool | Maven                      |
| Testing    | Postman                    |
| Deployment | Railway                    |
| Frontend   | Netlify                    |

---

# ARCHITECTURE

```id="giyj4e"
Client (Netlify UI)
        ↓
Spring Boot REST API (Railway)
        ↓
ML Model (Python)
        ↓
Prediction Response (JSON)
```

---

# PROJECT STRUCTURE

```id="8rco6e"
PulmoCare-PneumoniaDetection/
│
├── backend/           # Spring Boot application
├── model/             # ML model and scripts
├── src/
│   ├── controller/    # API endpoints
│   ├── service/       # Business logic
│   ├── util/          # Helper classes
│
├── resources/         # Configuration files
├── pom.xml
└── README.md
```

---

# API REFERENCE

## POST /predict

Uploads a chest X-ray image and returns prediction results.

**Request**

* Content-Type: multipart/form-data
* Body: image file

**Response**

```json id="beak8o"
{
  "prediction": "Pneumonia",
  "confidence": 0.94
}
```

---

# GETTING STARTED

## PREREQUISITES

* Java 17+
* Maven
* Python 3.8+
* pip

---

## INSTALLATION

```bash id="ivg36l"
git clone https://github.com/vartikasharmadev/PulmoCare-PneumoniaDetection.git
cd PulmoCare-PneumoniaDetection
```

---

## RUN BACKEND

```bash id="5wo3gs"
cd backend
mvn clean install
mvn spring-boot:run
```

---

## RUN ML MODEL

```bash id="cvq3ul"
cd model
pip install -r requirements.txt
python app.py
```

---

# DEPLOYMENT

## BACKEND (RAILWAY)

* Connected GitHub repository
* Build command: `mvn clean install`
* Start command: Spring Boot application
* Environment variables configured

---

## FRONTEND (NETLIFY)

* Static frontend deployed via Netlify
* Integrated with backend API for predictions

---

# FUTURE SCOPE

* Multi-disease detection support
* Improved model accuracy
* Enhanced frontend UI/UX
* Authentication and user management
* Patient data storage and analytics

---

# DISCLAIMER

This application is intended for educational and research purposes only and should not be used as a substitute for professional medical advice or diagnosis.

---

# AUTHOR

Vartika Sharma
GitHub: [https://github.com/vartikasharmadev](https://github.com/vartikasharmadev)

---

# CONTRIBUTING

Contributions are welcome. Fork the repository and submit a pull request for improvements.

---
