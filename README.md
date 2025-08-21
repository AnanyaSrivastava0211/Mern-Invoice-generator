# MERN Stack PDF Generator

A full-stack invoice generator application built with the MERN stack that allows users to create, manage, and download invoices as PDF files.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Product Management**: Add, edit, and remove products with real-time calculations
- **PDF Generation**: Server-side PDF generation using Puppeteer
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Calculations**: Automatic GST (18%) and total calculations
- **Form Validation**: Comprehensive client and server-side validation
- **Modern UI**: Built with Tailwind CSS and Shadcn UI components

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI components
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Puppeteer** - PDF generation
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd mern-pdf-generator
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

#### Backend Environment
Create a `.env` file in the `backend` directory:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/invoice-generator
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

#### Frontend Environment
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5001/api
```

### 4. Database Setup

Make sure MongoDB is running on your system. The application will automatically create the required collections.

For MongoDB Atlas (cloud):
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get your connection string
3. Replace the `MONGODB_URI` in your backend `.env` file

## 🚀 Running the Application

### Development Mode

#### Option 1: Run both frontend and backend together
```bash
# From the root directory
npm run dev
```

#### Option 2: Run separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: mern-invoice-generator.netlify.app
- **Backend**: http://localhost:5001

### Production Build

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Build Backend
```bash
cd backend
npm run build
npm start
```

## 📱 Application Flow

1. **Registration**: Users can create an account with name, email, and password
2. **Login**: Authenticated users can access the application
3. **Add Products**: Users can add multiple products with quantity and rate
4. **Generate PDF**: Create and download professional invoices as PDF files

## 🎨 UI/UX Features

- **Pixel-perfect design** matching the provided Figma specifications
- **Responsive layout** that works on mobile, tablet, and desktop
- **Dark theme** with modern gradient backgrounds
- **Interactive forms** with real-time validation
- **Loading states** and error handling
- **Toast notifications** for user feedback

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password hashing** using bcryptjs
- **Input validation** on both client and server
- **Rate limiting** to prevent abuse
- **CORS configuration** for secure cross-origin requests
- **Helmet.js** for security headers

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Invoice
- `POST /api/invoice/generate` - Generate PDF invoice
- `GET /api/invoice/history` - Get user's invoice history

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to your preferred platform

### Backend Deployment (Vercel/Railway/Render)

1. Build the backend:
```bash
cd backend
npm run build
```

2. Deploy with your preferred platform
3. Update environment variables on the hosting platform

### Environment Variables for Production

#### Backend
```env
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
```

#### Frontend
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## 🧪 Testing

Run the application locally and test the following:

1. **User Registration** - Create a new account
2. **User Login** - Login with created credentials
3. **Add Products** - Add multiple products with different quantities and rates
4. **PDF Generation** - Generate and download invoice PDF
5. **Responsive Design** - Test on different screen sizes
6. **Form Validation** - Test with invalid inputs

## 📝 Project Structure

```
mern-pdf-generator/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Ensure all environment variables are set correctly
3. Verify MongoDB connection
4. Check that all dependencies are installed

## 🎯 Assignment Compliance

This project meets all the specified requirements:

- ✅ **React** for Frontend
- ✅ **Puppeteer** for PDF generation from backend
- ✅ **Redux** for State Management
- ✅ **Node.js** for Backend
- ✅ **Vite.js** as Build tool
- ✅ **TypeScript** throughout the application
- ✅ **TanStack Query** for server state
- ✅ **Tailwind CSS** with Shadcn components
- ✅ **MongoDB** for data storage
- ✅ **JWT** authentication
- ✅ **Responsive design** for all devices
- ✅ **Form validation** and error handling
- ✅ **PDF generation** from backend only

---

**Happy Coding! 🚀**
