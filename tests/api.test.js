const axios = require('axios');
const API_URL = "http://localhost:5000"

const data = {
    id: 1,
    name: "updated name",
    age: 22,
    gender: "Male",
    email: "userone@gmail.com"
};

describe('Test Suite to test /add route with various possibilities of fields',
    () => {

        async function CallVerify(postData, message) {
            try {
                await axios.post(`${API_URL}/add`, postData)
            } catch ({ response }) {
                expect(response.status).toBe(400);
                expect(response.data.message).toBe(message);
            }
        }


        test('Try to insert using one of the fields missing.', async () => {
            let d = { ...data }
            delete d.name;
            await CallVerify(d, "Required fields missing.")
        })
        test('Try to insert using bad name', async () => {
            let d = { ...data }
            d.name = 234;
            await CallVerify(d, "Name is Invalid.");
        })

        test('Try to insert using alphetic age', async () => {
            let d = { ...data }
            d.age = "age";
            await CallVerify(d, "Age information is invalid.");
        })

        test('Try to insert using negative age', async () => {
            let d = { ...data }
            d.age = -43;
            await CallVerify(d, "Age information is invalid.");
        })

        test('Try to insert using age > 100', async () => {
            let d = { ...data }
            d.age = 143;
            await CallVerify(d, "Age information is invalid.");
        })

        test('Try to insert using using bad gender', async () => {
            let d = { ...data }
            d.gender = "ief"
            await CallVerify(d, "Gender information is invalid.");
        })

        test('Try to insert using using bad email', async () => {
            let d = { ...data }
            d.email = "ief@dss"
            await CallVerify(d, "Email information is invalid.");
        })

        test('Try to insert the profile', async () => {
            try {
                const response = await axios.post(`${API_URL}/add`, data)
                expect(response.status).toBe(200);
                expect(response.data.message).toBe("Profile saved Successfully.");
            } catch (error) {
                console.log(error);
            }
        })
    })

describe('Test Suite to test /view route', () => {
    test('Test the route without id', async () => {
        try {
            const response = await axios.get(`${API_URL}/view`)
            expect(response.status).toBe(200);
            expect(response.data.length).toBe(3);
        } catch (error) {
            console.log(error);
        }
    })

    test('Test the route with id 1', async () => {
        try {
            const response = await axios.get(`${API_URL}/view/1`)
            expect(response.status).toBe(200);
            expect(response.data[0]).toEqual({
                "id": 1,
                "name": "updated name",
                "age": 22,
                "gender": "Male",
                "email": "userone@gmail.com"
            });
        } catch (error) {
            console.log(error);
        }
    })
})


describe('Test Suite to test /edit route', () => {


    test('Test the route with non-existing id', async () => {
        try {
            await axios.patch(`${API_URL}/edit/500`, { name: "parth" })
        } catch ({ response }) {
            expect(response.status).toBe(404);
            expect(response.data.message).toBe("Record with the id: 500 not found.");
        }
    })


    test('Test the route with existing id', async () => {
        try {
            const response = await axios.patch(`${API_URL}/edit/1`, { email: "updated_email@gmail.com" })
            expect(response.status).toBe(200);
            expect(response.data.message).toBe("Profile saved Successfully.");
        } catch (error) {
            console.error(error)
        }
    })
})