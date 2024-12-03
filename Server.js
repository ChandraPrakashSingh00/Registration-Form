const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const port = 3000;

const app = express();

// Middleware for serving static files and parsing request bodies
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/students', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.once('open', () => {
    console.log("MongoDB connection successful");
});

// Schema definition
const userSchema = new mongoose.Schema({
    regd_no: String,
    name: String,
    email: String,
    branch: String,
});

// Model creation
const User = mongoose.model("data", userSchema);

// Route to serve the form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Form.html'));
});

// POST route to handle form submission
app.post('/post', async (req, res) => {
    try {
        const { regd_no, name, email, branch } = req.body;

        // Create a new user instance
        const newUser = new User({
            regd_no,
            name,
            email,
            branch,
        });

        // Save the user to the database
        await newUser.save();

        console.log(newUser);
        res.send("Form submitted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error submitting the form");
    }
});
  
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
