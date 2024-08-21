const email_regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const validate = {
    isEmail: (email) =>{
        return email_regex.test(email);
    }
}

module.exports = validate;