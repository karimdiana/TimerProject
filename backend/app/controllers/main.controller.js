const path = require('path');
const { login } = require('./auth.controller');
module.exports = {

    // show the home page
    signIn: (_, res) => {
        res.sendFile(path.join(__dirname, '../../../frontend/public/html/SignIn.html'));
    },

    // show the home page
    user: (req, res) => {
        let salt = req.cookies.salt;
        if (!salt) {
            res.redirect('/')
            return;
        }

        res.render('user', { 
            title: 'User Page'
        });
    },

    signInValidation: (req, res) => {
        login(req, res);
    },

    logout: (_, res) => {
        res.clearCookie('salt')
        res.redirect('/');
    },
}
