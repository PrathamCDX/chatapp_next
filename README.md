# Chat App (Next.js + Node.js + Socket.io)

A real-time chat application with a Next.js frontend and a Node.js/Express backend using Socket.io for instant messaging. The app supports user authentication, friend management, and live chat features.

## Features

- **User Authentication**: Sign up and sign in functionality.
- **Friend Management**: Add, search, and list friends.
- **Real-Time Messaging**: Instant chat with friends using Socket.io.
- **Seen Status**: Unread message indicator for new messages.
- **Modern UI**: Built with React, Tailwind CSS, and Next.js.

## V2 Architecture & Features

The `v2` version introduces improved scalability, performance, and maintainability for the chat application. Key enhancements include:

- **Redis Caching**: Frequently accessed user and friend data are cached in Redis for faster reads and writes.
- **MongoDB Bulk Operations**: Uses MongoDB bulkWrite for efficient batch updates, especially for friend management and message status.
- **Message Queue (RabbitMQ)**: Decouples write operations using a producer/consumer pattern, improving reliability and throughput.
- **Controllers & Modularization**: Backend logic is organized into versioned controllers (e.g., `controllers/v2/`), making it easier to extend and maintain.
- **Improved Error Handling**: More robust error checks and logging throughout the backend.

### Key V2 Backend Files

- `backend/controllers/v2/data.cotrollers.js`: Handles friend management, message sending, and integrates Redis and RabbitMQ.
- `backend/helper/messageQueue/rabbitMQ.producer.js`: Publishes operations to the queue.
- `backend/helper/messageQueue/rabbitMQ.consumer.js`: Consumes and processes queued operations.
- `backend/models/v2/`: Updated Mongoose models for v2 data structures.

### How V2 Works

1. **Friend Add/Update**:

   - Checks Redis for user/friend data.
   - Updates Redis and pushes a bulk operation to RabbitMQ.
   - Consumer processes the queue and writes to MongoDB in batches.

2. **Messaging**:

   - Similar flow: updates Redis, queues MongoDB writes for eventual consistency.

3. **Benefits**:
   - Faster user experience due to Redis caching.
   - Reduced MongoDB load via bulk operations.
   - More resilient and scalable backend with message queue decoupling.

---

## Project Structure

```
chat_app_next/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── socketio.js
│   ├── helper/
│   │   └── encryptDecrypt.js
│   ├── models/
│   │   ├── friends.js
│   │   ├── msg.js
│   │   └── user.js
│   └── router/
│       ├── authRouter.js
│       └── dataRouter.js
└── frontend/
    ├── package.json
    ├── next.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── public/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── context/
    │   ├── interfaces/
    │   └── encryptDecrypt.ts
    └── ...
```

## Getting Started

## Example `.env` Files

### Backend (`backend/.env`)

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
RABBIT_URL=amqp://localhost
CORS_ORIGIN=http://localhost:3000
SOCKET_IO_PATH=/socket.io
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_SOCKET_URI=http://localhost:8000/
NEXT_PUBLIC_API_URL=http://localhost:8000/
```


### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Backend Setup

1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the backend server:
   ```sh
   npm start
   ```
   The backend will run on the port specified in your environment variables or default to 3001.

### Frontend Setup

1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the Next.js development server:
   ```sh
   npm run dev
   ```
   The frontend will run on [http://localhost:3000](http://localhost:3000).

### Environment Variables

- Configure your backend and frontend `.env` files as needed.
- Example for frontend (`frontend/.env.local`):
  ```env
  NEXT_PUBLIC_SOCKET_URI=http://localhost:3001/
  ```

## Folder Details

- **backend/**: Node.js/Express server, Socket.io setup, authentication, and data routes.
- **frontend/**: Next.js app with React components, context, and pages for chat UI.

## Main Components (Frontend)

- `FriendList.tsx`: Displays the user's friends and their message status.
- `Messagebox.tsx`: Shows chat messages with a selected friend.
- `Signin.tsx` / `Signup.tsx`: Authentication forms.
- `AddFriend.tsx`: Add new friends.
- `Searchbar.tsx`: Search for friends.

## Scripts

- `npm run dev` (frontend): Start Next.js in development mode.
- `npm start` (backend): Start the Express server.
