const indexController = require('../controllers/index');
const configServerOM2M = require("../utils/config_om2m");
var authRouter = require('./auth');
var dashboardRouter = require('./dashboard');
const authMiddleware = require('../middlewares/auth');

const routes = (app) => {
    // auth
    authRouter(app);

    app.get('/', authMiddleware.authLogin);

    // dashboard
    app.use(authMiddleware.authentication,authMiddleware.saveUserLocal,dashboardRouter);

}

module.exports = routes;