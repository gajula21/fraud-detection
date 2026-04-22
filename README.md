# 🛡️ Rule-Based Fraud Detection System

A high-performance Fraud Detection Engine built with **JavaScript**, demonstrating advanced **Data Structures (DSA)** and **Object-Oriented Programming (OOP)** principles. This project features a real-time monitoring interface with a virtual terminal to visualize algorithmic logic.

## 🚀 Live Demo
[Check out the Live Interface here!](https://gajula21.github.io/fraud-detection/) *(Note: Replace with your actual GitHub Pages link once enabled)*

---

## 🧠 Key Technical Features

### 1. Object-Oriented Architecture (OOP)
*   **Encapsulation**: Used a `Transaction` class to model financial data safely.
*   **Polymorphism**: Implemented a `BaseRule` class with polymorphic `evaluate()` methods. Specific rules like `VelocityRule`, `AmountLimitRule`, and `LocationMismatchRule` inherit from this base.
*   **Scalability**: The `FraudEngine` uses an array-based rule system, making it easy to add new detection logic without modifying the core engine.

### 2. Data Structures & Algorithms (DSA)
*   **Queue**: A manual linked-node Queue implementation handles incoming transaction streams (FIFO).
*   **Hash Map**: Uses a JS `Map` for **$O(1)$ constant time** lookup of user behavior profiles.
*   **Singly Linked List**: Stores individual user histories with **$O(1)$ prepend insertions**, ensuring the system stays fast as data grows.
*   **QuickSort**: A manual recursive QuickSort algorithm ranks flagged transactions by their Risk Score ($O(N \log N)$ average complexity).

---

## 🛠️ How it Works

The system assigns a **Risk Score (0.0 to 1.0)** to every transaction based on:
1.  **Velocity**: Are there too many transactions in a short window?
2.  **Amount**: Is the transaction value unusually high?
3.  **Location**: Did the user's location change significantly since the last transaction?

Transactions with a score > 0 are flagged and ranked for investigation.

---

## 💻 How to Run Locally

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/gajula21/fraud-detection.git
    cd fraud-detection
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Launch the UI:**
    ```bash
    npm start
    ```
    *Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## 🎓 College Project Context
This project was developed as a demonstration of **Algorithm Efficiency** and **Software Design Patterns**. It explicitly logs every DSA operation (Queuing, Hashing, Sorting) to the console/UI terminal to aid evaluators in understanding the underlying computational steps.
