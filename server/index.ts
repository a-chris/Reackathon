import cors from 'cors';
import express from 'express';
import session from 'express-session';
import * as _ from 'lodash';
import mongoose from 'mongoose';
import * as authController from './controllers/auth';
import * as hackathonsController from './controllers/hackatons';
import * as usersController from './controllers/users';

const app = express();
const PORT = 5000;

mongoose.connect('mongodb://192.168.1.123', {
    dbName: 'test',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const MongoStore = require('connect-mongo')(session);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'reackathon2020',
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 14 }, // two weeks
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            collections: 'sessions',
            autoRemove: 'native',
        }),
    })
);
// TODO: wrap this in a if statement
// before to deploy in qa/production
app.use(cors());

app.use((req, res, next) => {
    let logString = `${req.originalUrl}:`;
    if (!_.isEmpty(req.params)) logString = logString + ` params: ${JSON.stringify(req.params)}`;
    if (!_.isEmpty(req.query)) logString = logString + ` query: ${JSON.stringify(req.query)}`;
    if (!_.isEmpty(req.body)) logString = logString + ` body: ${JSON.stringify(req.body)}`;
    if (!_.isEmpty(req.session)) logString = logString + ` session: ${JSON.stringify(req.session)}`;
    console.log(logString);
    next();
});

/**
 * Returns React build
 */
app.use(express.static('../build'));

/**
 * Auth Routes
 */
app.route('/info').post(authController.info);
app.route('/login').post(authController.login);
app.route('/signup').post(authController.signup);
app.route('/logout').post(authController.logout);
app.route('/users/exist').get(usersController.usernameExists);

/**
 * Authenticated Routes
 */
app.route('/users')
    .get(authController.isOrganization, usersController.getUsers)
    .post(authController.isLogged, usersController.updateUser);

app.route('/hackathons')
    .get(hackathonsController.findHackathons)
    .post(hackathonsController.saveHackathons);

app.route('/hackathons/:id')
    .get(hackathonsController.findHackathon)
    .put(hackathonsController.changeHackathonStatus);
/**
 * Listen
 */
app.listen(PORT, () => console.log('Server started!'));
