# Chat App (Next.js + Node.js + Socket.io)

A real-time chat application with a Next.js frontend and a Node.js/Express backend using Socket.io for instant messaging. The app supports user authentication, friend management, and live chat features.

## Features

- **User Authentication**: Sign up and sign in functionality.
- **Friend Management**: Add, search, and list friends.
- **Real-Time Messaging**: Instant chat with friends using Socket.io.
- **Seen Status**: Unread message indicator for new messages.
- **Modern UI**: Built with React, Tailwind CSS, and Next.js.

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

## License

This project is for educational purposes.
