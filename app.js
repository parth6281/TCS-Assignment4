const express = require('express');
const port = process.env.PORT || 5000;
const api = require('./api/routes.js');
const app = express();

app.use(express.json());
app.post('/add', api.addProfile);
app.get('/view/:id', api.viewProfile);
app.get('/view', api.viewProfile);
app.patch('/edit/:id', api.editProfile);

app.use((req, res) => {
    res.status(404).json({
        message: 'Not Found!'
    })
})

app.listen(port, () => {
    console.info(`Server listening on port: ${port}.`);
});
