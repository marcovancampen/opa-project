# Photo Archive Application

A full-stack application for managing and searching photo archives with people tagging.

## 🚀 Quick Start (Windows)

### Prerequisites
**Only these two things are required:**
1. **Java 17 or later** - [Download here](https://adoptium.net/)
2. **Node.js 18 or later** - [Download here](https://nodejs.org/)

**Note:** Maven is NOT required! The script will automatically download a portable Maven if needed (no admin rights required).

### Running the Application

**Simply double-click `start.bat`**

That's it! The script will:
- ✅ Check if Java and Node.js are installed
- ✅ Install frontend dependencies if needed
- ✅ Start the backend server (http://localhost:8080)
- ✅ Start the frontend server (http://localhost:5173)
- ✅ Open both in separate terminal windows

The frontend will automatically open in your browser at http://localhost:5173

### Stopping the Application

Close the terminal windows that appeared, or press `Ctrl+C` in either window.

---

## 📋 Manual Setup (Alternative)

If you prefer to run things manually:

### Backend
```bash
cd photo-archive-backend
mvnw.cmd spring-boot:run
```

### Frontend (in a separate terminal)
```bash
npm install
npm run dev
```

---

## 📁 Project Structure

```
opa-project/
├── start.bat                    # Double-click to start both servers
├── photo-archive-backend/       # Spring Boot backend
│   ├── src/
│   ├── mvnw.cmd                # Maven wrapper (no Maven install needed)
│   └── pom.xml
├── src/                        # React frontend
├── package.json
└── README.md                   # This file
```

---

## 🔧 Troubleshooting

### "Java is not installed or not in PATH"
- Install Java from https://adoptium.net/
- Make sure to check "Add to PATH" during installation
- Restart your terminal/computer after installing

### "Node.js is not installed or not in PATH"
- Install Node.js from https://nodejs.org/
- Restart your terminal/computer after installing

### Port Already in Use
If you see errors about ports 8080 or 5173 being in use:
- Close any other applications using these ports
- Or change the ports in the configuration files

### Backend won't start
- Make sure you have Java 17 or later: `java -version`
- Check if port 8080 is available
- Look for error messages in the backend terminal window

### Frontend won't start
- Delete `node_modules` folder and run `npm install` again
- Make sure port 5173 is available
- Check the frontend terminal window for errors

---

## 📖 Usage

1. **Upload CSV**: Go to the Upload page and upload your `Register17.csv` file
2. **Search by Person**: Find all photos containing a specific person
3. **Search by Event**: Find photos by event keywords (e.g., "Sinterklaas", "Vierdaagse")
4. **View Results**: Click on photo cards to see all linked people (shows first 5, click to expand)

---

## 💾 Database

The application uses an embedded H2 database that stores data in:
- `photo-archive-backend/data/photoarchive.mv.db`

This file persists between application restarts. To reset the database, delete this file.

---

## 🛠️ Development

### Backend
- **Framework**: Spring Boot 3.x
- **Database**: H2 (embedded)
- **Java Version**: 17+

### Frontend
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

---

## 📄 License

This project is for personal use.

---

## 🤝 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Look at the terminal windows for error messages
3. Make sure all prerequisites are installed correctly
