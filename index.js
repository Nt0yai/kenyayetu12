const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const initdatabase = () => {
    pool.query("CREATE DATABASE IF NOT EXISTS PLP_STUDENTS", (err) => {
        if (err) {
            console.error("Error creating database", err);
            return;
        }
        console.log("Database PLP_STUDENTS successfully created/already exists");

        const dbConnection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: "PLP_STUDENTS",
        });

        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS Users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        dbConnection.query(createUsersTable, (err) => {
            if (err) {
                console.error("Error creating Users table", err);
                return;
            }
            console.log("Users table created successfully");
        });

        const createCategoriesTable = `
            CREATE TABLE IF NOT EXISTS Categories (
                category_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                category_name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(user_id)
            )
        `;
        dbConnection.query(createCategoriesTable, (err) => {
            if (err) {
                console.error("Error creating Categories table", err);
                return;
            }
            console.log("Categories table created successfully");
        });

        const createExpensesTable = `
            CREATE TABLE IF NOT EXISTS Expenses (
                expense_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                category_id INT,
                amount DECIMAL(10, 2) NOT NULL,
                date DATE NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(user_id),
                FOREIGN KEY (category_id) REFERENCES Categories(category_id)
            )
        `;
        dbConnection.query(createExpensesTable, (err) => {
            if (err) {
                console.error("Error creating Expenses table", err);
                return;
            }
            console.log("Expenses table created successfully");
        });

        const createPaymentMethodsTable = `
            CREATE TABLE IF NOT EXISTS PaymentMethods (
                payment_method_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                payment_method_name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(user_id)
            )
        `;
        dbConnection.query(createPaymentMethodsTable, (err) => {
            if (err) {
                console.error("Error creating PaymentMethods table", err);
                return;
            }
            console.log("PaymentMethods table created successfully");
        });

        const createBudgetsTable = `
            CREATE TABLE IF NOT EXISTS Budgets (
                budget_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                category_id INT,
                amount DECIMAL(10, 2) NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(user_id),
                FOREIGN KEY (category_id) REFERENCES Categories(category_id)
            )
        `;
        dbConnection.query(createBudgetsTable, (err) => {
            if (err) {
                console.error("Error creating Budgets table", err);
                return;
            }
            console.log("Budgets table created successfully");
        });

        dbConnection.end();
    });
};

initdatabase();

const PORT = process.env.PORT || 11000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

