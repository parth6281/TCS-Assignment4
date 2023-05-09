// Importing the axios library and setting the API_URL constant to "http://localhost:5000"
const axios = require('axios');
const API_URL = "http://localhost:5000"

// Creating the data object to be used in tests
const data = {
    id: 1,
    name: "Parth",
    age: 22,
    gender: "Male",
    email: "userone@gmail.com"
};

// Test suite to test the '/add' route with various possibilities of fields
describe('Test Suite to test /add route with various possibilities of fields',
    () => {
        // CallVerify function to verify the response from the server to match status Code and message
        async function CallVerify(postData, message) {
            try {
                await axios.post(`${API_URL}/add`, postData)
            } catch ({ response }) {
                // Verifying the response status and message
                expect(response.status).toBe(400);
                expect(response.data.message).toBe(message);
            }
        }
        // Test case to insert data using one of the fields missing
        test('Try to insert using one of the fields missing.', async () => {
            let d = { ...data }
            delete d.name;
            await CallVerify(d, "Required fields missing.")
        })

        // Test case to insert data using bad name
        test('Try to insert using bad name', async () => {
            let d = { ...data }
            d.name = 234;
            await CallVerify(d, "Name is Invalid.");
        })

        // Test case to insert data using alphabetic age
        test('Try to insert using alphabetic age', async () => {
            let d = { ...data }
            d.age = "age";
            await CallVerify(d, "Age information is invalid.");
        })

        // Test case to insert data using negative age
        test('Try to insert using negative age', async () => {
            let d = { ...data }
            d.age = -43;
            await CallVerify(d, "Age information is invalid.");
        })

        // Test case to insert data using age greater than 100
        test('Try to insert using age > 100', async () => {
            let d = { ...data }
            d.age = 143;
            await CallVerify(d, "Age information is invalid.");
        })

        // Test case to insert data using bad gender
        test('Try to insert using using bad gender', async () => {
            let d = { ...data }
            d.gender = "ief"
            await CallVerify(d, "Gender information is invalid.");
        })

        // Test case to insert data using bad email
        test('Try to insert using using bad email', async () => {
            let d = { ...data }
            d.email = "ief@dss"
            await CallVerify(d, "Email information is invalid.");
        })

        // Test case to insert the profile
        test('Try to insert the profile', async () => {
            try {
                const response = await axios.post(`${API_URL}/add`, data)
                // Verifying the response status and message
                expect(response.status).toBe(200);
                expect(response.data.message).toBe("Profile saved Successfully.");
            } catch (error) {
                console.log(error);
            }
        })
    })


// This test suite tests the /view route of the API.
describe('Test Suite to test /view route', () => {

    // This test case tests the API without specifying the `id`.
    test('Test the route without id', async () => {
        try {
            const response = await axios.get(`${API_URL}/view`)
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(3); // Verify that 3 profiles are returned
        } catch (error) {
            console.log(error);
        }
    })

    // This test case tests the API by specifying `id` as 1.
    test('Test the route with id 1', async () => {
        try {
            const response = await axios.get(`${API_URL}/view/1`)
            expect(response.status).toBe(200);
            // Verify that the profile returned for `id` 1 is as expected.
            expect(response.data[0]).toEqual({
                id: 1,
                name: "updated name",
                age: 22,
                gender: "Male",
                email: "userone@gmail.com"
            });
        } catch (error) {
            console.log(error);
        }
    })

})



// This test suite is to test the functionality of the /edit route.
describe('Test Suite to test /edit route', () => {


    // Test the route with non-existing id.
    test('Test the route with non-existing id', async () => {
        try {
            // Make a patch request with id 500 to update name.
            await axios.patch(`${API_URL}/edit/500`, { name: "parth" })
        } catch ({ response }) {
            // Check if the response has a 404 status code and the message is correct.
            expect(response.status).toBe(404);
            expect(response.data.message).toBe("Record with the id: 500 not found.");
        }
    })

    // Test the route with existing id.
    test('Test the route with existing id', async () => {
        try {
            // Make a patch request with id 1 to update email.
            const response = await axios.patch(`${API_URL}/edit/1`, { email: "updated_email@gmail.com" })
            // Check if the response has a 200 status code and the message is correct.
            expect(response.status).toBe(200);
            expect(response.data.message).toBe("Profile saved Successfully.");
        } catch (error) {
            console.error(error)
        }
    })
})