const validator = require("email-validator");

module.exports = {
    validateRegister: (req, res, next) => {
        const {email, passwordOne, passwordTwo} = req.body;

        if (!validator.validate(email)) {
            return res.send({success: false, message: "Invalid email address"});
        }
        if (passwordOne !== passwordTwo) {
            return res.send({success: false, message: "Passwords do not match"});
        }
        if (passwordOne.length <= 5 || passwordTwo.length <= 5) {
            return res.send({success: false, message: "Password needs to be at least 5 characters long"});
        }
        next();
    },

    validateLogin: (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.send({ success: false, message: "Email and password are required" });
        }
        next();
    }
}
