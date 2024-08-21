const authMiddleware = require('../middlewares/auth');
const authController = require('../controllers/auth.controller');
const routes = (app) => {
    app.get('/login',authMiddleware.authMiddleware ,(req, res)=>{
        res.render('login/login_page');
    });

    app.get('/logout',(req, res)=>{
        if(req.cookies.user){
            res.clearCookie('user');
        }
        res.redirect('/');
    });
    
    app.post('/login', authController.login);
    app.post('/register', (req, res)=>{
        console.log('register page');
        res.redirect('/');
    })  
}

module.exports = routes;