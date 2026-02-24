const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// middleware to read form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static files (css, images)
app.use(express.static('public'));


// ROUTES FOR HTML PAGES

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});


// SIGNUP LOGIC

app.post('/signup', (req, res) => {

    const newUser = req.body;

    const users = JSON.parse(fs.readFileSync('users.json'));

    users.push(newUser);

    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

    res.send("Signup successful!");
});


// LOGIN LOGIC

app.post('/login', (req, res) => {

    const { email, password } = req.body;

    const users = JSON.parse(fs.readFileSync('users.json'));

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) return res.send("Invalid credentials");

    res.send("Login successful!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});