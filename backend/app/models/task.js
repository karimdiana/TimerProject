const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Task', taskSchema);

