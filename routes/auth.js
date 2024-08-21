const authMiddleware = require('../middlewares/auth');
const authController = require('../controllers/auth.controller');
const routes = (app) => {
    app.get('/login',authMiddleware.authMiddleware ,(req, res)=>{
        res.render('login/login_page');
    });

    app.get('/logout',authController.logout);
    
    app.post('/login', authController.login);
    app.post('/register', authController.register)  
}

module.exports = routes;