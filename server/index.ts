
import express from 'express';

const app = express();
const PORT = 5000;

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.body);
    next();
});

app.use(express.static('../build'))
app.listen(PORT, () => console.log('Server started'));
