const UserService = require('../services/user.service')

const authController = {
    login: async (req, res)=> {

    },
    register: async (req, res) => {
        try {
            const body = req.body;
            let newData = {...body};
            if(!newData.password || newData.password.length < 6){
                throw new Error('Password must be at least 6 characters');
            }
    
            if(!newData.email || !validate.isEmail(newData.email)){
                throw new Error('Email is wrong');
            }
           
            const emailExisted = await UserService.findByEmail(newData.email);
            if(emailExisted){
                throw new Error('Email already exists');
            }
            const hashPass = bcrypt.hashSync(newData.password, saltRounds);
            newData = {...newData, password: hashPass}
    
            const newUser = await UserService.create(newData);

            res.cookie('user', JSON.stringify(user));
            res.redirect('/');
        } catch (error) {
            const result = {...defaultResult, error: error.message, message: 'failed'};
            res.redirect(`/auth/register?error=${error.message}`);
        }
    },
    logout: (req, res) => {

    },
}

module.exports = authController;