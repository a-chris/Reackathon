import cors from 'cors';
import express from 'express';
import session from 'express-session';
import http from 'http';
import * as _ from 'lodash';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import socketIo from 'socket.io';
import * as attendantsController from './controllers/attendants';
import * as authController from './controllers/auth';
import * as filtersController from './controllers/filters';
import * as hackathonsController from './controllers/hackatons';
import * as usersController from './controllers/users';

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);
const io = socketIo(httpServer);

if (process.env.MONGODB_URI != null) {
    mongoose.connect(process.env.MONGODB_URI as string, { useNewUrlParser: true });
} else {
    mongoose.connect('mongodb://192.168.1.123', {
        dbName: 'test',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
}

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
        secret: 'reackathon2020',
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
app.route('/info').post(authController.info);
app.route('/login').post(authController.login);
app.route('/signup').post(authController.signup);
app.route('/logout').post(authController.logout);
app.route('/users/exist').get(usersController.usernameExists);

/**
 * Authenticated Routes
 */
app.route('/users').get(authController.isOrganization, usersController.getUsers);

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

app.route('/hackathons/org').get(
    authController.isOrganization,
    hackathonsController.findOrganizationHackathons
);

app.route('/hackathons/:id').get(hackathonsController.findHackathon);

app.route('/hackathons/:id/sub')
    .put(authController.isClient, hackathonsController.subscribeUser)
    .delete(hackathonsController.deleteAttendant);

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

/**
 * HTTP Server
 */
httpServer.listen(PORT, () => 'Server started!');

/**
 * Socket.io put here to reuse the http server
 */
io.on('connection', (client) => {
    client.on('test', () => {
        client.emit('FromAPI', new Date());
    });

    /*
     * Create a room for a certain organization
     * identified by the organization username
     */
    client.on('org_room', (username: string) => {
        console.log('TCL: org_room', username);
        client.join(username);
    });
});
