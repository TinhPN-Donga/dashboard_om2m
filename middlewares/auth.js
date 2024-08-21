const authentication = (req, res, next) => {
    if (!req.cookies.user) {
        return res.redirect('/login');
    }
    next();
}

const authMiddleware = (req, res, next) => {
    if (req.cookies.user) { 
        return res.redirect('/'); 
    }
    next();
};

const authLogin = (req, res, next) => {
    if (!req.cookies.user) {
        return res.redirect('/login');
    }else{
        return res.redirect('/dashboard');
    }
}

const saveUserLocal = (req, res, next) => {
    if (req.cookies.user) {
        req.user = JSON.parse(req.cookies.user);
        res.locals.user = JSON.parse(req.cookies.user);
    }else{
        res.locals.user = null;
    }
    next();
}

module.exports = {
    authentication,
    authLogin,
    saveUserLocal,
    authMiddleware
}



