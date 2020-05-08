import express from 'express';
import * as _ from 'lodash';
import mongoose from 'mongoose';
import * as authController from './controllers/auth';
import * as usersController from './controllers/users';

const app = express();
const PORT = 5000;

mongoose.connect('mongodb://192.168.1.123', {
    dbName: 'test',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    let logString = `${req.originalUrl}:`;
    if (!_.isEmpty(req.params)) logString = logString + ` params: ${JSON.stringify(req.params)}`;
    if (!_.isEmpty(req.query)) logString = logString + ` query: ${JSON.stringify(req.query)}`;
    if (!_.isEmpty(req.body)) logString = logString + ` body: ${JSON.stringify(req.body)}`;
    console.log(logString);
    next();
});

app.use(express.static('../build'));

app.route('/login').post(authController.login);
app.route('/signup').post(usersController.signup);
app.route('/users').get(usersController.getUsers);
app.route('/users/exist').get(usersController.usernameExists);
app.listen(PORT, () => console.log('Server started!'));
