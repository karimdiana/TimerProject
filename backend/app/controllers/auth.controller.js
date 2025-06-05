const User = require('../models/user'),
    { scrypt } = require('crypto');

module.exports = {
    checkUser: checkUser,
    signUp: signUp,
    login: login,
    secQuestion: secQuestion,
    resetPass: resetPass
}

async function checkUser(req, res) {
    try {
        const user = await User.findOne({ username: req.params.username });
        res.json({ available: !user });
    } catch (error) {
        console.error('Error checking username:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function signUp(req, res) {
    try {
        const { username, password, securityQuestion, securityAnswer } = req.body;
        
        console.log('Signup attempt:', { username, securityQuestion }); // Log signup attempt
        
        // Check if email is .edu
        if (!username.match(/.+@.+\.edu$/)) {
            console.log('Invalid email format');
            res.redirect('/?error=invalid_email');
            return;
        }

        // Log all existing users for debugging
        const allUsers = await User.find({});
        console.log('All existing users:', allUsers.map(u => u.username));

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('Username already taken');
            res.redirect('/?error=username_taken');
            return;
        }

        // Create new user with hashed password
        const user = new User({
            username: username,
            securityQuestion: securityQuestion,
            securityAnswer: securityAnswer
        });
        
        console.log('Setting password...');
        await user.setPassword(password);
        console.log('Password set, saving user...');
        await user.save();
        console.log('User saved successfully');
        res.redirect('/?success=account_created');
    } catch (error) {
        console.error('Signup error:', error);
        res.redirect('/?error=signup_failed');
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body;
        
        console.log('Login attempt:', { username }); // Log login attempt
        
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            res.redirect('/?error=invalid_credentials');
            return;
        }

        const bit = 32;
        scrypt(password, user.salt, bit, (err, derivedKey) => {
            if (err) {
                console.error('Password verification error:', err);
                res.redirect('/?error=login_failed');
                return;
            }
            if (derivedKey.toString('hex') === user.password) {
                console.log('User successfully logged in.');
                res.cookie('salt', user.salt);
                res.redirect('/Timer');
            }
            else {
                console.log('Password mismatch');
                res.redirect('/?error=invalid_credentials');
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.redirect('/?error=login_failed');
    }
}

async function secQuestion(req, res) {
    try {
        const username = req.params.username;
        console.log('Security question request:', { username });
        
        // Check if email is .edu
        if (!username.match(/.+@.+\.edu$/)) {
            console.log('Invalid email format');
            res.status(400).json({ error: 'Invalid email domain' });
            return;
        }

        const user = await User.findOne({ username });
        console.log('User found:', user ? user.username : 'No user');
        
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ question: user.securityQuestion });
    } catch (error) {
        console.error('Error getting security question:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

async function resetPass(req, res) {
    try {
        const { username, securityAnswer, newPassword } = req.body;
        
        // Check if email is .edu
        if (!username.match(/.+@.+\.edu$/)) {
            res.redirect('/?error=invalid_email');
            return;
        }

        const user = await User.findOne({ username });
        if (!user) {
            res.redirect('/?error=user_not_found');
            return;
        }

        if (user.securityAnswer !== securityAnswer) {
            res.redirect('/?error=invalid_answer');
            return;
        }

        // Use the setPassword method to properly hash the new password
        await user.setPassword(newPassword);
        await user.save();
        
        console.log('Password reset successful for user:', username);
        res.redirect('/?success=password_reset');
    } catch (error) {
        console.error('Error resetting password:', error);
        res.redirect('/?error=reset_failed');
    }
}