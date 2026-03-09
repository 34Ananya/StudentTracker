const express = require('express');
const path = require('path');
const fs = require('fs');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = 3000;

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Use student routes
app.use('/', studentRoutes);

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('<h1>404 - Page Not Found</h1>');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});