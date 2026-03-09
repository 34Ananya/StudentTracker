const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const usersFilePath = path.join(__dirname, '../users.json');

// Helper function to read users.json
function readUsersFile(callback) {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, JSON.parse(data));
        }
    });
}

// Helper function to write to users.json
function writeUsersFile(data, callback) {
    fs.writeFile(usersFilePath, JSON.stringify(data, null, 2), 'utf8', callback);
}

// GET / - Serve home page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/home.html'));
});

// GET /signup - Serve signup form
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/signup.html'));
});

// POST /signup - Handle signup form submission
router.post('/signup', (req, res) => {
    const { name, email, password, academicDetails, skills, dob, address } = req.body;
    const photo = req.body.photo || 'default.png'; // Default photo if none provided

    console.log('Received data:', req.body); // Debugging log

    readUsersFile((err, users) => {
        if (err) {
            return res.status(500).send('Error reading user data.');
        }

        // Check if user already exists
        if (users.some(user => user.email === email)) {
            return res.send('User already exists. Please log in.');
        }

        // Add new user
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password,
            dob,
            address,
            academicDetails,
            skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
            photo
        };
        users.push(newUser);

        writeUsersFile(users, (err) => {
            if (err) {
                return res.status(500).send('Error saving user data.');
            }
            res.redirect('/login');
        });
    });
});

// GET /login - Serve login form
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

// POST /login - Handle login form submission
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    readUsersFile((err, users) => {
        if (err) {
            return res.status(500).send('Error reading user data.');
        }

        // Validate user credentials
        const user = users.find(user => user.email === email && user.password === password);
        if (!user) {
            return res.send('Invalid credentials. Please try again.');
        }

        res.redirect(`/profile/${user.id}`);
    });
});

// GET /profile/:id - Serve user profile
router.get('/profile/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);

    readUsersFile((err, users) => {
        if (err) {
            return res.status(500).send('Error reading user data.');
        }

        const user = users.find(user => user.id === userId);
        if (!user) {
            return res.status(404).send('User not found.');
        }

        res.send(`
            <h1>${user.name}'s Profile</h1>
            <table border="1" style="width: 80%; margin: 20px auto; text-align: left; border-collapse: collapse;">
                <tr>
                    <th colspan="2" style="background-color: #f4f4f9;">Personal Details</th>
                </tr>
                <tr>
                    <td><strong>Name:</strong></td>
                    <td>${user.name}</td>
                </tr>
                <tr>
                    <td><strong>Email:</strong></td>
                    <td>${user.email}</td>
                </tr>
                <tr>
                    <td><strong>Date of Birth:</strong></td>
                    <td>${user.dob || 'Not provided'}</td>
                </tr>
                <tr>
                    <td><strong>Address:</strong></td>
                    <td>${user.address || 'Not provided'}</td>
                </tr>
                <tr>
                    <th colspan="2" style="background-color: #f4f4f9;">Academic Details</th>
                </tr>
                <tr>
                    <td colspan="2">${user.academicDetails || 'Not provided'}</td>
                </tr>
                <tr>
                    <th colspan="2" style="background-color: #f4f4f9;">Skills</th>
                </tr>
                <tr>
                    <td colspan="2">${user.skills && user.skills.length > 0 ? user.skills.join(', ') : 'Not provided'}</td>
                </tr>
            </table>
            <img src="/images/${user.photo}" alt="${user.name}'s photo" style="width:150px;height:150px;">
        `);
    });
});

// GET /about - Serve about page
router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/about.html'));
});

module.exports = router;