# 📚 BookNook – Online Library Management System

BookNook is an online library management system where users can explore books, borrow books, manage their borrowed books, and return them. It provides a simple and user-friendly platform for managing library activities.

## ✨ Features

- Browse all available books
- Search and explore books
- View book details
- User registration and login
- Google authentication
- Add new books
- Edit and delete books
- Borrow books
- View personal borrowing history
- Return borrowed books
- User-based access control
- Responsive design for mobile and desktop

## 🛠️ Technologies Used

**Frontend:**
- Next.js
- React
- TypeScript
- Tailwind CSS
- DaisyUI
- Swiper

**Authentication:**
- Better Auth
- JWT

**Backend:**
- Node.js
- Express.js
- TypeScript
- MongoDB

## 📂 Related Repository

- **Backend:** [BookNook Server](https://github.com/tasneem28892/booknook-server)

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/tasneem28892/booknook.git
```

### 2. Navigate to the project folder

```bash
cd booknook
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the root directory and add your own credentials:

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note:** The backend server must also be running for the application to work properly.

## 👩‍💻 Developer

**Tasneem Rezwana**

- GitHub: [@tasneem28892](https://github.com/tasneem28892)

---

Made with ❤️ using Next.js and MongoDB.
