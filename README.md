# Finura

## Introduction
Finura is a user-friendly web application that helps you manage your personal finances. With Finura, you can easily create monthly budgets, track your expenses, and visualize your financial trends. The app is designed to make budgeting simple and accessible for everyone.

## Problem Statement
Many people struggle to keep track of their income, spending, and savings. Without a clear overview, it is easy to overspend or miss financial goals. Finura solves this problem by providing a simple tool to organize your finances, set budgets, and monitor your expenses in one place.

## Main Features

- **User Registration and Login**: Securely create an account and log in to access your personal dashboard.
- **Dashboard Overview**: See a summary of your income, expenses, and remaining budget for the current month.
- **Create Monthly Budgets**: Set your income and allocate spending limits to different categories (like Food, Rent, etc.) for each month.
- **Track Expenses**: Add expenses to your budget categories and see how much you have spent and what remains.
- **Expense Categories**: Organize your spending by categories for better tracking and analysis.
- **Profile Management**: Update your account information and change your password securely.
- **Data Visualization**: View charts and graphs that show your spending trends and category breakdowns.
- **Protected Routes**: Only logged-in users can access and manage their budgets and expenses.
- **Responsive Design**: The app works well on both desktop and mobile devices.

## How to Use and Navigate the App

1. **Register an Account**
   - Go to the registration page and fill in your name, email, and password.
   - After registering, you will be logged in automatically.

2. **Login**
   - If you already have an account, go to the login page and enter your email and password.

3. **Dashboard**
   - After logging in, you will see your dashboard. Here, you can view your total income, expenses, and remaining budget for the current month.
   - You will also see charts that help you understand your spending habits.

4. **Create a Budget**
   - Go to the "Budgets" page.
   - Click on "New Budget" or "Create Budget".
   - Enter the month, your income, and add categories with their spending limits.
   - Save the budget. You can create a new budget for each month.

5. **Add Expenses**
   - Go to the "Expenses" page.
   - Click on "Add Expense".
   - Select the budget and category, enter the amount, date, and an optional note.
   - Save the expense. Your dashboard and budget pages will update automatically.

6. **Edit or Delete Budgets and Expenses**
   - On the Budgets or Expenses pages, you can edit or delete any entry by clicking the edit or delete icons next to each item.

7. **Profile Management**
   - Go to the "Profile" page to update your name, email, or change your password.

8. **Logout**
   - Click the "Logout" button in the sidebar or menu to securely log out of your account.

## Tools and Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **API Documentation**: Swagger
- **Icons**: Lucide React

## Getting Started (Development Setup)

### Prerequisites
- Node.js and npm installed
- MongoDB installed and running

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:5173` (or the port shown in your terminal).

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contact
If you have any questions or suggestions, feel free to open an issue or contact the project maintainer. 