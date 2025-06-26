# School Blog - MERN Stack Project

## Overview
A comprehensive blog platform for schools built using the MERN (MongoDB, Express, React, Node.js) stack. This application demonstrates how these technologies work together to create a full-featured web application with user authentication, data persistence, and responsive UI.

![Screenshot Description](https://via.placeholder.com/800x400?text=School+Blog+Screenshot)

## Features

### User Authentication
- **Register:** Create a new account with name, email, and password
- **Login:** Authenticate using email and password
- **Protected Routes:** Certain actions require authentication

### Blog Management
- **View Posts:** Browse through all blog posts on the homepage
- **Create Posts:** Authenticated users can create new blog posts
- **View Details:** Read full blog post content on a dedicated page
- **Delete Posts:** Authors can delete their own posts
- **Author Attribution:** Posts display author name and creation date

### User Experience
- **Responsive Design:** Works on desktop and mobile devices
- **Bootstrap UI:** Clean, modern interface using React Bootstrap
- **Alerts:** User feedback for actions like login, registration, and post creation

## Technology Stack

### Frontend
- **React:** UI library for building component-based interfaces
- **React Router:** For navigation and routing
- **React Bootstrap:** UI component library
- **Context API:** For state management across components
- **Axios:** For HTTP requests to the backend

### Backend
- **Node.js:** JavaScript runtime for server-side code
- **Express.js:** Web framework for building the REST API
- **MongoDB:** NoSQL database for storing blog posts and user data
- **Mongoose:** ODM (Object Data Modeling) for MongoDB
- **JWT:** JSON Web Tokens for authentication
- **Bcrypt:** For password hashing and security

## Project Structure
```
school-blog/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Context API state management
│   │   └── utils/          # Utility functions
│   └── public/             # Static files
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   └── server.js           # Entry point
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB installation)

### Setting up MongoDB Atlas

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose the FREE tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create Cluster" (takes a few minutes to provision)

3. **Set Up Database Access**
   - In the left sidebar, click "Database Access"
   - Click "Add New Database User"
   - Set Authentication Method to "Password"
   - Enter a simple username (e.g., "schoolblog")
   - Create a password (avoid special characters)
   - Set User Privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - In the sidebar, click "Network Access"
   - Click "Add IP Address"
   - For development, choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Your Connection String**
   - Go back to "Database" in sidebar
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - Replace `<username>` and `<password>` with the user credentials you created

6. **Update Your .env File**
   - Create or edit server/.env file:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/school-blog?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```
   - Make sure to add the database name (`school-blog`) after the hostname and before the parameters
   - Generate a JWT secret with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Installation

1. **Clone the repository or download the files**

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install both server and client dependencies**
   ```bash
   npm run install-all
   ```

### Running the Application

**Development Mode (with hot reloading)**
```bash
npm run dev
```
This runs both the backend server (port 5000) and React development server (port 3000) concurrently.

**Backend Only**
```bash
npm run server
```

**Frontend Only**
```bash
npm run client
```

**Production Mode**
```bash
npm run build  # Build React frontend
npm start      # Start Express server
```

## How to Use

1. **Register a new account**
   - Click "Register" in the navigation bar
   - Fill in your name, email, and password
   - Submit the form

2. **Login to your account**
   - Click "Login" in the navigation bar
   - Enter your email and password
   - Submit the form

3. **Create a new blog post**
   - After logging in, click "Create Post" from the dropdown
   - Fill in the title and content
   - Submit the form to create your post

4. **View and manage posts**
   - All posts are displayed on the homepage
   - Click on a post title to view the full content
   - Delete button is available for posts you've created

## API Endpoints

### Authentication
- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login a user
- **GET /api/auth**: Get the authenticated user's data

### Posts
- **GET /api/posts**: Get all blog posts
- **POST /api/posts**: Create a new blog post (requires authentication)
- **GET /api/posts/:id**: Get a specific blog post
- **PUT /api/posts/:id**: Update a blog post (requires authentication)
- **DELETE /api/posts/:id**: Delete a blog post (requires authentication)

## Troubleshooting

**Authentication Issues**
- Ensure your MongoDB connection string is correct
- Check that the JWT_SECRET is set in your .env file
- Verify network requests in your browser's developer tools
- Clear browser localStorage if you encounter persistent login issues

**Database Connection Problems**
- Confirm your IP is whitelisted in MongoDB Atlas
- Verify the database name in your connection string
- Check server logs for connection errors

**Post Creation/Viewing Issues**
- Ensure you're logged in before creating posts
- Check network requests for API call failures
- Verify the post data format in requests

## License

MIT

## Acknowledgements

- React Bootstrap for UI components
- MongoDB Atlas for database hosting
- FontAwesome for icons 