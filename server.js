// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const authRoutes = require("./routes/authRoutes");
const puzzleRoutes = require('./routes/puzzleRoutes'); // Added for puzzle progression
const apiRoutes = require('./routes/apiRoutes'); // Importing the new API routes
const http = require('http');
const { Server } = require("socket.io");
const chatController = require('./controllers/chatController'); // Importing chat controller
const sharedsession = require("express-socket.io-session"); // Importing shared session middleware

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting the templating engine to EJS
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });

// Session configuration with connect-mongo
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
    cookie: { 
      maxAge: 1800000, // Session expires after 30 minutes of inactivity
      httpOnly: true, // Secure flag to prevent access to the cookie via client-side scripts
      secure: process.env.NODE_ENV === "production", // Secure cookies only in production
    },
});

app.use(sessionMiddleware);

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Logging session creation and destruction
app.use((req, res, next) => {
  const sess = req.session;
  // Make session available to all views
  res.locals.session = sess;
  if (!sess.views) {
    sess.views = 1;
    console.log("Session created at: ", new Date().toISOString());
  } else {
    sess.views++;
    console.log(
      `Session accessed again at: ${new Date().toISOString()}, Views: ${sess.views}, User ID: ${sess.userId || '(unauthenticated)'}`,
    );
  }
  next();
});

// Authentication Routes
app.use(authRoutes);

// Puzzle Routes - Added for puzzle progression
app.use('/puzzle', puzzleRoutes);

// API Routes - Handling API requests
app.use('/api', apiRoutes);

// Root path response
app.get("/", (req, res) => {
  res.render("index");
});

// Chat route - Handling chat interface
app.get("/chat", (req, res) => {
  try {
    res.render("chat");
    console.log("Chat page rendered successfully.");
  } catch (error) {
    console.error("Error rendering chat page: ", error.message);
    console.error(error.stack);
    res.status(500).send("Error rendering chat page.");
  }
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

// Setting up http server and socket.io
const server = http.createServer(app);
const io = new Server(server);

// Use shared session middleware for socket.io
io.engine.use(sessionMiddleware);

io.on('connection', (socket) => {
  console.log('A user connected to the WebSocket.');

  socket.on('disconnect', () => {
    console.log('User disconnected from the WebSocket.');
  });

  socket.on('chatMessage', (msg) => {
    console.log(`Received message from user: ${msg}`);
    // Handling chat message using chatController
    chatController.handleChatMessage(socket, msg).catch(error => {
      console.error("Error in chat message handling:", error.message);
      console.error(error.stack);
      socket.emit('chatMessage', "An error occurred while processing your message.");
    });
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});