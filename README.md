# Form Builder

A modern, interactive form builder application built with React, Node.js, and MongoDB. Create dynamic forms with drag-and-drop functionality, including categorization, fill-in-the-blank, and comprehension questions.

## Features

- **Interactive Form Builder** - Drag-and-drop interface for creating forms
- **Multiple Question Types**:
  - Categorization questions with drag-and-drop sorting
  - Fill-in-the-blank (Cloze) questions with draggable words
  - Comprehension questions with multiple choice
- **Image Upload Support** - Add images to questions
- **Real-time Preview** - See how forms look while building
- **Form Management** - Create, edit, publish, and delete forms
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Drag & Drop**: @dnd-kit
- **Animations**: Anime.js
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd form-builder
   ```

2. **Install dependencies**

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Server environment
   cd ../server
   cp .env.example .env
   # Edit .env with your MongoDB connection string

   # Client environment (optional)
   cd ../client
   cp .env.example .env
   # Edit if you need custom API URLs
   ```

4. **Start MongoDB**

   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Update connection string in server/.env

5. **Run the application**

   ```bash
   # Start the server (in server directory)
   npm run dev

   # Start the client (in client directory, new terminal)
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Environment Variables

### Server (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/formbuilder
CLIENT_URL=http://localhost:5173
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
SESSION_SECRET=your-secret-key-here
```

### Client (.env - optional)

```env
VITE_API_URL=http://localhost:5000/api
VITE_UPLOAD_URL=http://localhost:5000/uploads
```

## Usage

1. **Create a Form**: Click "New Form" on the dashboard
2. **Add Questions**: Use the sidebar to add different question types
3. **Configure Questions**: Set up categories, blank words, or multiple choice options
4. **Add Images**: Upload images to enhance your questions
5. **Preview**: Use the preview button to see how your form looks
6. **Publish**: Make your form available for others to fill
7. **Share**: Use the fill link to share your form

## API Endpoints

- `GET /api/forms` - Get all forms
- `POST /api/forms` - Create a new form
- `GET /api/forms/:id` - Get a specific form
- `PUT /api/forms/:id` - Update a form
- `DELETE /api/forms/:id` - Delete a form
- `POST /api/responses` - Submit form response
- `POST /api/images/upload` - Upload image
- `DELETE /api/images/:filename` - Delete image

## Project Structure

```
form-builder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── config/        # Configuration files
│   └── public/            # Static assets
└── server/                # Node.js backend
    ├── models/            # MongoDB models
    ├── routes/            # API routes
    ├── middleware/        # Custom middleware
    └── uploads/           # Uploaded images
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
