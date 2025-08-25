## Simplified E-Commerce Website
A full-stack e-commerce platform with a focus on user authentication, product browsing, and personal favorites. Built using Node.js, Express, MongoDB, and vanilla JS with SCSS styling.

## Features
### User Authentication
- Register with validation (username, email, strong password)
- Login via username or email
- Auth-protected routes using JWT
- Session persistence and logout

### Product Browsing
- Gallery of 30 seeded products with pagination (3x3 grid)
- Filter by brand and product type
- Product detail pages with related brand suggestions

### Favorites System
- Logged-in users can favorite/unfavorite products
- Favorites appear in a sidebar
- Data persisted in MongoDB

### Admin Panel
- View all users and their favorite products
- Access restricted to admin users only

## Tech Stack
### Backend
- Node.js, Express, MongoDB, Mongoose

### Frontend
- HTML, SCSS, JavaScript

### Styling
- Bootstrap

### Auth
- JWT (JSON Web Token)

### Architecture
- MVC Pattern

## Input Validation
- Both client-side and server-side
- Handles invalid formats, duplicate entries, and unauthorized access
- Custom error responses

## Security & Access
- Input sanitization to prevent script injection
- Route guards based on role and token
- Proper redirect/handling for unsupported routes

### Setup Instructions
- Clone the repo
- Run npm install
- Set up .env with your MongoDB URI and JWT secret
- Run npm run seed to populate the DB
- Start the server: npm start
  
### Author
Sajan Aryal
