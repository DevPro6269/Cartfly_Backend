# Cartfly Backend API

This is the backend for **Cartfly**, an e-commerce application built with **Node.js**, **Express.js**, and **MongoDB**. It provides RESTful APIs to manage user authentication, products, cart functionality, and more.


The source code is hosted on GitHub:  
[Cartfly Backend Repository](https://github.com/DevPro6269/Cartfly_Backend)


## Features

- **User Authentication**: Users can register, log in, and manage sessions.
- **Cart Management**: Users can add, update, and delete items in the cart.
- **Product Management**: Admins can add, update, view, and delete products.
- **Categories and Subcategories**: Products are grouped into categories and subcategories.
- **Cloud Storage**: Product media and thumbnails are uploaded to **Cloudinary**.
- **Admin Routes**: Admin users can manage all products.

## Installation

### Prerequisites

1. **Node.js** (>=14.x)
2. **MongoDB** (for local development or use **MongoDB Atlas**)
3. **Cloudinary Account** (for uploading product images)

### Steps to Set Up

1. Clone the Repository:
   ```bash
   git clone https://github.com/DevPro6269/Cartfly_Backend.git
   cd Cartfly_Backend

Install Dependencies:

bash
Copy
Edit
npm install
Set up the environment variables in a .env file:

env
Copy
Edit
MONGO_URI=your_mongo_database_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
Run the Server:

bash
Copy
Edit
npm start
