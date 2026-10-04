## 11-Week Development Plan for Simple Restaurant Management Web App Project Overview

This is a basic restaurant management web app for a manager. The manager can:

- \- View food items by category - Add, edit, delete food items - Increment or decrement quantity of food items - Generate a bill from selected items

Technologies used: Node.js, Express, MySQL (Backend) and ReactJS (Frontend)

## 11-Week Development Plan

## Week 1 – Project Setup + HTML Form Design

- Tasks:

- Create basic HTML forms (Food entry: Name, Price, Category, Description)

- Style using CSS or Bootstrap

- Deliverables:

- foodForm.html

- style.css

## Week 2 – JavaScript Form Functionality

- Tasks:

- Validate input fields using JavaScript

- Store data in array and show in HTML table

- Deliverables:

- app.js with JS-only CRUD


## Week 3 – Backend with Node.js + ExpressJS

- Tasks:

- Setup NodeJS, ExpressJS project

- Create endpoints: /api/foods GET, POST

- Deliverables:

- Running Express server with JSON routes

## Week 4 – MySQL Integration

- Tasks:

- Setup MySQL and restaurant_db

- Create foods and categories tables and connect MySQL to Express

- Deliverables:

- db.js, SQL schema script, working API

## Week 5 – Full CRUD API for Food

- Tasks:

- Implement RESTful endpoints: GET, POST, PUT, DELETE

- Deliverables:

- Tested CRUD API for foods

## Week 6 – Build React Frontend (UI Only)

- Tasks:

- Create React app with Vite/CRA

- Create pages: FoodList, AddFood, EditFood using static data

- Deliverables:

- React pages and routes created


## Week 7 – Integrate Backend API with React

- Tasks:

- Use Axios/Fetch to connect to backend API

- Perform Add and View operations

- Deliverables:

- React + API working integration

## Week 8 – Food Category & Quantity Buttons

- Tasks:

- Group food items by category

- Implement + and - buttons for quantity control

- Deliverables:

- Working quantity UI and React state update

## Week 9 – Generate Bill Functionality

- Tasks:

- Generate bill from selected items with quantities and total price

- Optionally save to database

- Deliverables:

- Bill component with calculation

## Week 10 – Styling & Form Validations

- Tasks:

- Use Bootstrap or custom CSS for styling

- Add form validations

- Deliverables:

- Styled UI with validations


## Week 11 – Final Testing & Deployment

- Tasks:

- Host backend on Render or Cyclic

- Host frontend on Vercel or Netlify

- Prepare GitHub repo, ERD, documentation

- Deliverables:

- Live URLs, GitHub repo, documentation

## Extra Add-Ons (Optional)

- PDF Bill generation

- Role-based login (manager only)

- Category-wise filters with dropdown

- Real-time update with Socket.io
