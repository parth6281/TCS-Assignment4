const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const isValidName = (name) => (name = name.toString()) && name.match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/);
const isValidAge = (age) => (age = parseInt(age)) && age !== NaN && age > 0 && age < 100
const isValidGender = (gender) => (gender = gender.toString()) && (gender.toUpperCase() === "MALE" || gender.toUpperCase() === "FEMALE");
const isValidEmail = (email) => (email = email.toString()) && email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/);

const addProfile = async (req, res) => {
    let { id, name, age, gender, email } = req.body;

    if (!id || !name || !age || !gender || !email) {
        res.status(400).json({
            message: "Required fields missing."
        });
        return;
    }

    if (!isValidName(name)) {
        res.status(400).json({
            message: "Name is Invalid."
        });
        return;
    }


    if (!isValidAge(age)) {
        res.status(400).json({
            message: "Age information is invalid."
        });
        return;
    }


    if (!isValidGender(gender)) {
        res.status(400).json({
            message: "Gender information is invalid."
        });
        return;
    }

    if (!isValidEmail(email)) {
        res.status(400).json({
            message: "Email information is invalid."
        });
        return;
    }

    try {
        const data = JSON.parse(await readFile('./data/post.json'));

        data.push({
            id, name, age, gender, email
        });

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

const viewProfile = async (req, res) => {
    const id = req.params.id;
    let data = []
    try {
        data = JSON.parse(await readFile('./data/get.json'));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something wrong happened."
        })
    }

    if (!id) {
        res.status(200).json(data);
    } else {
        let matched = data.filter(i => i.id == id);
        if (matched.length == 0) {
            res.status(404).json({
                message: `Profile with id: ${id} not Found.`
            })
        } else {
            res.status(200).json(matched);
        }
    }
}

const editProfile = async (req, res) => {

    const id = req.params.id;
    let data = []
    try {
        data = JSON.parse(await readFile('./data/post.json'));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something wrong happened."
        })
    }

    let matched = data.find(i => i.id == id);
    if (!matched) {
        res.status(404).json({
            message: `Record with the id: ${id} not found.`
        });
        return;
    }

    let { name, age, gender, email } = req.body;
    if (!name && !age && !gender && !email) {
        res.status(400).json({
            message: "Please provide at least one valid field"
        });
        return;
    }

    if (name && !isValidName(name)) {
        res.status(400).json({
            message: "Name is Invalid."
        });
        return;
    } else if (name) matched.name = name;

    if (age && !isValidAge(age)) {
        res.status(400).json({
            message: "Age information is invalid."
        });
        return;
    } else if (age) matched.age = age;

    if (gender && !isValidGender(gender)) {
        res.status(400).json({
            message: "Gender information is invalid."
        });
        return;
    } else if (gender) matched.gender = gender;

    if (email && !isValidEmail(email)) {
        res.status(400).json({
            message: "Email information is invalid."
        });
        return;
    } else if (email) matched.email = email;

    data[data.indexOf(matched)] = matched;

    try {
        await writeFile('./data/post.json', JSON.stringify(data));
        res.status(200).json({
            message: "Profile saved Successfully."
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something wrong happened."
        })
    }
}

module.exports = {
    addProfile,
    viewProfile,
    editProfile
}