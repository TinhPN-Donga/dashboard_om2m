const indexController = require('../controllers/index');
const configServerOM2M = require("../utils/config_om2m");
var authRouter = require('./auth');
var dashboardRouter = require('./dashboard');
const authMiddleware = require('../middlewares/auth');

var platformRoute = require('./platform.route');
var roleUserControllers = require('./role_user.route');

const routes = (app) => {

    
    // auth
    authRouter(app);

    app.get('/', authMiddleware.authLogin);

    // platform
    app.use('/platform', authMiddleware.authentication, authMiddleware.saveUserLocal, platformRoute);

    //role use
    app.use('/role-user', authMiddleware.authentication, authMiddleware.saveUserLocal, roleUserControllers);

    // dashboard
    app.use(authMiddleware.authentication,authMiddleware.saveUserLocal,dashboardRouter);
}

module.exports = routes;