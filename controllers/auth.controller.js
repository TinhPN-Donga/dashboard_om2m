const UserService = require('../services/user.service')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const validate = require('../utils/validate');
const jwt = require('jsonwebtoken');

const defaultResult = {
    message: 'success',
    error: null,
    result: null
}

const ACCESS_TOKEN_SECRET = 'access_secret_key';
const REFRESH_TOKEN_SECRET = 'refresh_secret_key';
const REFRESH_TOKENS = []; 

const generateAccessToken = (user) => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET);
  REFRESH_TOKENS.push(refreshToken); // Lưu trữ refresh token
  return refreshToken;
};

const authController = {
    login: async (req, res)=> {
        try {
            const body = req.body;
            console.log("body", body);
            if(!body.email || !validate.isEmail(body.email)){
                throw new Error('Email is wrong');
            }
            if(!body.password || body.password.length < 6){
                throw new Error('Password is wrong');
            }
            const user = await UserService.findByEmail(body.email);
            if(!user){
                throw new Error('Email is not exists');
            }
            let checkPass = await bcrypt.compare(body.password, user.password);
            if(checkPass){
                const newAccessToken = generateAccessToken({ data: user});
                res.cookie('user', JSON.stringify(user));
                res.cookie('access_token', newAccessToken, { httpOnly: true }),
                res.redirect('/');
    
            }else{
                throw new Error('Password is wrong');
            }
        } catch (error) {
            const result = {...defaultResult, error: error.message, message: 'failed'};
            res.redirect(`/auth/login?error=${error.message}`);
        }
    },
    register: async (req, res) => {
        try {
            const body = req.body;
            let newData = {...body};
            
            if(!newData.password || !newData.confirm_password || newData.password.length < 6){
                throw new Error('Password must be at least 6 characters');
            }

            if(newData.password != newData.confirm_password){
                throw new Error('Confirm password is invalid');
            }
    
            if(!newData.email || !validate.isEmail(newData.email)){
                throw new Error('Email is wrong');
            }

            if(!newData.userName){
                throw new Error('User name not empty');
            }
            
            const emailExisted = await UserService.findByEmail(newData.email);
            if(emailExisted){
                throw new Error('Email already exists');
            }
            const hashPass = bcrypt.hashSync(newData.password, saltRounds);
            newData = {...newData, password: hashPass}
    
            const newUser = await UserService.create(newData);
            const newAccessToken = generateAccessToken({ data: newUser});

            res.cookie('user', JSON.stringify(newUser));
            res.cookie('access_token', newAccessToken);
            res.redirect('/');
        } catch (error) {
            const result = {...defaultResult, error: error.message, message: 'failed'};
            console.log(error.message);
            
            res.redirect(`/login?error=${error.message}`);
        }
    },
    logout: (req, res) => {
        if(req.cookies.user){
            res.clearCookie('user');
        }
        if(req.cookies.access_token){
            res.clearCookie('access_token');
        }
        res.redirect('/');
    },
}



module.exports = authController;