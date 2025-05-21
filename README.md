# Blog API with Authentication

This project is a RESTful API built with **Node.js**, **Express**, and **MongoDB**. It includes user authentication, blog post management, and commenting functionalities.

##  Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- bcryptjs (Password Hashing)
- jsonwebtoken (JWT Auth)
- dotenv (Environment Variables)
- express-rate-limit (Rate Limiting)

---

## -------------------------------- Installation--------------------------------

1. Clone the repository:

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

Install dependencies:

npm install express mongoose bcryptjs jsonwebtoken dotenv express-rate-limit
--------------------------------
Create a .env file in the root folder and add your environment variables:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
--------------------------------
Start the server:
node server.js
----------------------------------------------------------------
                                   API Endpoints
----------------------------------------------------------------
                                 Authentication
1] Register a User
POST /api/users/register

{
  "name": "Krishna Shukla",
  "email": "krishna@gmail.com",
  "password": "password123"
}

2] Login a User
POST /api/users/login

{
  "email": "krishna@gmail.com",
  "password": "password123"
}
----------------------------------------------------------------
                               Blog Posts
3] Create a Post (Auth Required)
POST /api/posts

Headers:
Authorization: Bearer <your_token>

Body:

{
  "title": "My Second Post",
  "content": "This is the content of my first post.",
  "tags": ["tech", "blog"],
  "authorId": "user_id"
}
--------------------------------
4] Get All Posts (Paginated)

GET /api/posts?page=1&limit=10

5] Get Single Post

GET /api/posts/:postId

6] Update a Post (Auth Required)

PUT /api/posts/:postId

Headers:

Authorization: Bearer <your_token>

Body:

{
  "title": "Updated Post Title",
  "content": "Updated content of the post.",
  "tags": ["tech", "update"]
}

7] Delete a Post (Auth Required)

DELETE /api/posts/:postId

Headers:
Authorization: Bearer <your_token>
----------------------------------------------------------------
                            Comments

8] Add a Comment to a Post (Auth Required)
POST /api/comments

Headers:

Authorization: Bearer <your_token>
Body:

{
  "text": "This is a great post!",
  "postId": "post_id"
}

9] List Comments for a Post
GET /api/comments?postId=post_id&page=1&limit=10

--------------------------------Response Format--------------------------------
All responses follow this format:

{
  "status": 200,
  "success": true,
  "message": "Descriptive message",
  "data": { ... }
}
-------------------------------- Folder Structure--------------------------------

/project-root
  ├── models/
  ├── routes/
  ├── controllers/
  ├── middlewares/
  ├── .env
  ├── index.js
  └── README.md
-------------------------------- Security--------------------------------
Passwords are hashed using bcryptjs.
JWT used for secure authentication.
Rate limiting applied on routes to prevent abuse.

--------------------------------Contact--------------------------------
Developed by Krishna Shukla , krishnaprasad24795@gmail.com

