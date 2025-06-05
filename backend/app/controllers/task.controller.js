
const Task = require('../models/task');

async function timerPage(req, res) {
    try {
        let salt = req.cookies.salt;
        if (!salt) {
            res.redirect('/')
            return;
        }
        let tasks = await Task.find({salt: salt});
        res.render('timer', { 
            title: 'Timer',
            tasks: tasks
        });
    } catch (e) {
        res.status(500)
        res.send('Database error:\n' + e.message)
    }
}

async function timerNewTask(req, res) {
    try {
        let salt = req.cookies.salt;
        let { slotDate, slotStart, slotEnd, slotDuration, slotName } = req.body;

        let newTask = new Task({
            date: slotDate,
            startTime: slotStart,
            endTime: slotEnd,
            duration: slotDuration,
            name: slotName,
            salt: salt
        });

        newTask.save((_, task) => {
            console.log(`Task ${task.name} saved successfully.`)
        });

        let tasks = await Task.find({salt: salt});

        res.render('timer', { 
            title: 'Timer',
            tasks: tasks
        });
    } catch (e) {
        res.status(500)
        res.send('Database error:\n' + e.message)
    }
}

module.exports = {
    timerPage: timerPage,
    timerNewTask: timerNewTask
}