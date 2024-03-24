const express = require('express');
const users = require('./MOCK_DATA.json');
const file = require('fs');
const mongoose = require('mongoose');
const { strict } = require('assert');
const app = express();
const PORT = 8000;
const DATABASE_NAME = 'geekcoderr';

mongoose.connect(`mongodb://127.0.0.1:27017/${DATABASE_NAME}`).then(() => {
    console.log('Connection Done!\n');
}).catch((error) => { console.log('Error occured as', err) });

//Schema Defination
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profile: {
        type: String,
    },
    gender: {
        type: String,
    }

},
    {
        timestamps: true,
    });

const User = mongoose.model('user', userSchema);

app.use(express.urlencoded({ extended: false }));  // middleware for parsing application/x-www-form
app.use((req, res, next) => {
    // if (req.headers['x-uname'] !== 'geekcoderr') {
    //     return res.json({ 'message': 'Unauthorized' });
    // }
    console.log(`At[${(new Date()).toDateString()}] recieved ${req.method} Request On [${req.url}] from IP: ${req.ip}`);
    file.appendFile('requestLogs.txt', `Time: ${(new Date()).toDateString()} , Method: ${req.method} , URL/Path: ${req.url} , IP: ${req.ip}\n`, (err, data) => {
        next();
    });
});

console.log('Middleware Bypassed');
app.get('/users', async (req, res) => {
    const allUsers= await User.find({});
    const html = `
    <ul>
    ${allUsers.map((user) => `<li>${user.firstname}</li>`).join('')}
    </ul>
    `;
    return res.send(html);
});

app.get('/api/users', async (req, res) => {
    const  users = await User.find({});
    return res.json(users);
});

app.route('/api/users/id/:id')
    .get( async (req, res) => {
        const id = Number(req.params.id);
        const users = await User.find((user) => user.id === id);
        if (!users) {
            res.status(404).json({ message: 'User not found.' });
        }
        return res.json(users);
    })
    .patch((req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex((user) => user.id === id);
        if (index > 0) {
            const updatedUser = { ...users[index], ...req.body };
            users[index] = updatedUser;
            file.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
                console.log("Data Updated for user with ID: " + id);
                return res.json({ "Status": `Patch Success with ID->${id}` });
            });
        } else {
            return res.json({ "Status": `Patch Unsuccessful with Invalid ID->${id}` });
        }
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex((user) => user.id === id);
        if (index > 0 && index <= users.length) {
            users.splice(index, 1);
            file.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ "error": "An error occurred while deleting data" });
                }
                console.log("Data Deleted with index:" + index);
                return res.json({ "Status": `Delete Success with ID->${id}` });
            });
        } else {
            return res.json({ "Status": `Delete Unsuccessful with Invalid ID->${id}` });
        }
    });


app.post('/api/users', async (req, res) => {
    const body = req.body;
    if (!body
        || !body.first_name
        || !body.last_name
        || !body.email
        || !body.gender
        || !body.profile) {
        return res.status(400).json({ 'Error': 'Missing Field' });
    }

    const result = await User.create({
        firstname: body.first_name,
        lastname: body.last_name,
        gender: body.gender,
        email: body.email,
        profile: body.profile,
    });
    console.log('Result -> \n', result);
    return res.status(201).json(result);

});

app.listen(PORT, console.log('Server started'));