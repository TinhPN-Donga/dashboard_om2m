const indexController = require('../controllers/index');
const configServerOM2M = require("../utils/config_om2m");
var authRouter = require('./auth');
var dashboardRouter = require('./dashboard');
const authMiddleware = require('../middlewares/auth');

var platformRoute = require('./platform.route');
var roleUserControllers = require('./role_user.route');

const routes = (app) => {

    // platform
    app.use('/platform', platformRoute);

    //role use
    app.use('/role-user', roleUserControllers);
    
    // auth
    authRouter(app);

    app.get('/', authMiddleware.authLogin);


    // dashboard
    app.use(authMiddleware.authentication,authMiddleware.saveUserLocal,dashboardRouter);
}

module.exports = routes;