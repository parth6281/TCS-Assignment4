// Import the express module
const express = require('express');

// Set the port for the server, if not provided use 5000 as default
const port = process.env.PORT || 5000;

// Import the routes from routes.js file
const api = require('./api/routes.js');

// Create a new instance of express application
const app = express();

// Parse incoming request body as JSON
app.use(express.json());

// Route for adding a new profile via HTTP POST method
app.post('/add', api.addProfile);

// Route for viewing a profile with a specific id via HTTP GET method
app.get('/view/:id', api.viewProfile);

// Route for viewing all profiles via HTTP GET method
app.get('/view', api.viewProfile);

// Route for editing a profile with a specific id via HTTP PATCH method
app.patch('/edit/:id', api.editProfile);

// Route to handle any other requests that don't match the above routes
app.use((req, res) => {
    res.status(404).json({
        message: 'Not Found!'
    })
})

// Start the server and listen to the specified port
app.listen(port, () => {
    console.info(`Server listening on port: ${port}`);
});