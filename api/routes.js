// Importing the required modules
const fs = require('fs');
const util = require('util');

// Promisifying the fs module functions
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Function to validate the name field
const isValidName = (name) => (name = name.toString()) && name.match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/);

// Function to validate the age field
const isValidAge = (age) => (age = parseInt(age)) && age !== NaN && age > 0 && age < 100;

// Function to validate the gender field
const isValidGender = (gender) => (gender = gender.toString()) && (gender.toUpperCase() === "MALE" || gender.toUpperCase() === "FEMALE");

// Function to validate the email field
const isValidEmail = (email) => (email = email.toString()) && email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/);

// Function to add a new profile to the database
const addProfile = async (req, res) => {
    let { id, name, age, gender, email } = req.body;

    // Checking if all the required fields are present
    if (!id || !name || !age || !gender || !email) {
        res.status(400).json({
            message: "Required fields missing."
        });
        return;
    }

    // Validating the name field
    if (!isValidName(name)) {
        res.status(400).json({
            message: "Name is Invalid."
        });
        return;
    }

    // Validating the age field
    if (!isValidAge(age)) {
        res.status(400).json({
            message: "Age information is invalid."
        });
        return;
    }

    // Validating the gender field
    if (!isValidGender(gender)) {
        res.status(400).json({
            message: "Gender information is invalid."
        });
        return;
    }

    // Validating the email field
    if (!isValidEmail(email)) {
        res.status(400).json({
            message: "Email information is invalid."
        });
        return;
    }

    try {
        // Reading the data from the database file
        const data = JSON.parse(await readFile('./data/post.json'));

        // Adding the new profile to the data
        data.push({
            id, name, age, gender, email
        });

        // Writing the updated data to the database file
        await writeFile('./data/post.json', JSON.stringify(data));
        res.status(200).json({
            message: "Profile saved Successfully."
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error Occurred. Try Again!'
        })
    }
}

// Function to view a profile based on the id provided in the request parameters
const viewProfile = async (req, res) => {
    // Get the id from the request parameters
    const id = req.params.id;
    // Initialize an empty array to hold the profile data
    let data = []
    try {
        // Attempt to read the profile data from the specified file
        data = JSON.parse(await readFile('./data/get.json'));
    } catch (error) {
        // If an error occurs while attempting to read the file, log the error and return a 500 status code with an error message
        console.error(error);
        res.status(500).json({
            message: "Something wrong happened."
        })
    }

    // If no id is provided in the request parameters, return all profiles as an array
    if (!id) {
        res.status(200).json(data);
    } else {
        // If an id is provided, filter the profile data to find the profile with the matching id
        let matched = data.filter(i => i.id == id);
        // If no profiles match the provided id, return a 404 status code with an error message
        if (matched.length == 0) {
            res.status(404).json({
                message: `Profile with id: ${id} not Found.`
            })
        } else {
            // If a profile is found, return the profile as an array with a 200 status code
            res.status(200).json(matched);
        }
    }
}


const editProfile = async (req, res) => {

    // Get the id of the profile to edit from the request parameters
    const id = req.params.id;

    // Initialize an empty array to store data from the file
    let data = [];

    // Try to read the data from the file
    try {
        data = JSON.parse(await readFile('./data/post.json'));
    } catch (error) {
        console.error(error);
        // If an error occurs, send a 500 status response with an error message
        res.status(500).json({
            message: "Something wrong happened."
        });
    }

    // Find the profile to edit in the array
    let matched = data.find(i => i.id == id);

    // If the profile isn't found, send a 404 status response with an error message
    if (!matched) {
        res.status(404).json({
            message: `Record with the id: ${id} not found.`
        });
        return;
    }

    // Get the values to update from the request body
    let { name, age, gender, email } = req.body;

    // Check if at least one valid field is provided
    if (!name && !age && !gender && !email) {
        res.status(400).json({
            message: "Please provide at least one valid field"
        });
        return;
    }

    // Check if the name field is provided and valid
    if (name && !isValidName(name)) {
        res.status(400).json({
            message: "Name is Invalid."
        });
        return;
    } else if (name) matched.name = name;

    // Check if the age field is provided and valid
    if (age && !isValidAge(age)) {
        res.status(400).json({
            message: "Age information is invalid."
        });
        return;
    } else if (age) matched.age = age;

    // Check if the gender field is provided and valid
    if (gender && !isValidGender(gender)) {
        res.status(400).json({
            message: "Gender information is invalid."
        });
        return;
    } else if (gender) matched.gender = gender;

    // Check if the email field is provided and valid
    if (email && !isValidEmail(email)) {
        res.status(400).json({
            message: "Email information is invalid."
        });
        return;
    } else if (email) matched.email = email;

    // Replace the old profile with the updated one in the data array
    data[data.indexOf(matched)] = matched;

    // Try to write the updated data to the file
    try {
        await writeFile('./data/post.json', JSON.stringify(data));
        // If successful, send a 200 status response with a success message
        res.status(200).json({
            message: "Profile saved Successfully."
        });
    } catch (error) {
        console.error(error);
        // If an error occurs, send a 500 status response with an error message
        res.status(500).json({
            message: "Something wrong happened."
        });
    }
}

module.exports = {
    addProfile,
    viewProfile,
    editProfile
}