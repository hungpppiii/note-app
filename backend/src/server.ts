import express from 'express';
const app = express();

const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello ac');
});

app.get('/check', (req, res) => {
    res.send('Check - 123');
});

app.listen(port, () => {
    console.log('Server run successfully at http://localhost:5000');
});
