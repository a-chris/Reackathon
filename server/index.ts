import cors from 'cors';
import express from 'express';
import session from 'express-session';
import http from 'http';
import * as _ from 'lodash';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import socketIo from 'socket.io';
import { isProduction } from './config/constants';
import * as attendantsController from './controllers/attendants';
import * as authController from './controllers/auth';
import * as filtersController from './controllers/filters';
import * as hackathonsController from './controllers/hackathons';
import * as usersController from './controllers/users';

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);
const io = socketIo(httpServer, { origins: '*:*' });

mongoose.connect(process.env.MONGODB_URI as string, {
    dbName: isProduction() ? undefined : 'test',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const MongoStore = require('connect-mongo')(session);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = file.originalname.slice(0, file.originalname.length - ext.length);
        cb(null, Date.now() + '_' + filename + ext);
    },
});

const upload = multer({ storage });

// required to work with heroku
app.enable('trust proxy');
app.set('io', io);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        credentials: true,
    })
);
app.use(
    session({
        name: 'reackathon_session',
        secret: process.env.SECRET as string,
        proxy: true,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 14,
            secure: false,
            httpOnly: false,
        }, // two weeks
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            collections: 'sessions',
            autoRemove: 'native',
        }),
    })
);

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
 * Returns the uploaded resources
 */
app.use('/avatar', express.static(__dirname + '/uploads'));

/**
 * Auth Routes
 */
app.route('/login').post(authController.login);
app.route('/signup').post(authController.signup);
app.route('/logout').post(authController.logout);
app.route('/users/exist').get(usersController.usernameExists);

app.route('/users/ranking').get(usersController.getUsersRanking);

app.route('/users/:username')
    .get(authController.isLogged, usersController.getUserDetail)
    .post(authController.isClient, usersController.updateClient)
    .post(authController.isOrganization, usersController.updateOrganization);

app.route('/users/:username/avatar').post(
    authController.isLogged,
    upload.single('avatar'),
    usersController.uploadAvatar
);

app.route('/hackathons')
    .get(hackathonsController.findHackathons)
    .post(hackathonsController.saveHackathons);

app.route('/hackathons/org').get(hackathonsController.findOrganizationHackathons);

app.route('/hackathons/:id').get(hackathonsController.findHackathon);

app.route('/hackathons/:id/sub').put(authController.isClient, hackathonsController.subscribeUser);

app.route('/hackathons/:id/status').put(hackathonsController.changeHackathonStatus);

app.route('/attendants/:userId').get(
    authController.isClient,
    attendantsController.getUserAttendants
);
app.route('/attendants/:attendantId/invite').post(
    authController.isClient,
    attendantsController.inviteAttendantToGroup
);
app.route('/attendants/invites/:inviteId').put(
    authController.isClient,
    attendantsController.replyToInvite
);

app.route('/filters/cities').get(filtersController.getAvailableCities);

app.route('/stats').get(authController.isOrganization, hackathonsController.organizationStats);

app.route('/testWs').get(attendantsController.testWs);

/**
 * HTTP Server
 */
httpServer.listen(PORT, () => 'Server started!');

/**
 * Socket.io put here to reuse the http server
 */
io.on('connection', (client) => {
    /*
     * Create a room for a certain user
     * identified by the username
     */
    client.on('join_room', (username: string) => {
        console.log('TCL: join_room', username);
        client.join(username);
    });

    /*
     * Remove the client from his rooms
     */
    client.on('disconnect', () => {
        client.leaveAll();
    });
});
