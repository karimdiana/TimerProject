const mongoose = require('mongoose');
const { scrypt } = require('crypto');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        match: /.+@.+\.edu$/
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    securityQuestion: {
        type: String,
        required: true,
        enum: [
            'What was your first pet\'s name?',
            'What is your mother\'s maiden name?',
            'What city were you born in?',
            'What was your first car?',
            'What is your favorite book?'
        ]
    },
    securityAnswer: {
        type: String,
        required: true
    }
});

// Method to hash and set password
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    const bit = 32;
    return new Promise((resolve, reject) => {
        scrypt(password, this.salt, bit, (err, derivedKey) => {
            if (err) reject(err);
            this.password = derivedKey.toString('hex');
            resolve();
        });
    });
};

//Jack's implementation for password verification
userSchema.methods.verifyPassword = function(password) {
    const bit = 32;
    return new Promise((resolve, reject) => {
        scrypt(password, this.salt, bit, (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey.toString('hex') === this.password);
        });
    });
};

module.exports = mongoose.model('User', userSchema);