const { models } = require('mongoose');
const User = require('../models/user');

async function getAllUsersHTML(req, res) {
    const allUsers = await User.find({});
    const html = `
    <ul>
    ${allUsers.map((user) => `<li>${user.firstname}</li>`).join('')}
    </ul>
    `;
    return res.send(html);
};

async function getAllUsersJSON(req, res) {
    const users = await User.find({});
    return res.json(users);
};

async function postUserData(req, res) {
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
};

async function patchData(req, res) {
    await User.findByIdAndUpdate(req.params.id, { firstname: 'Changed' });
    return res.status(201).json({ Message: 'Success' });
    // const id = Number(req.params.id);
    // const index = users.findIndex((user) => user.id === id);
    // if (index > 0) {
    //     const updatedUser = { ...users[index], ...req.body };
    //     users[index] = updatedUser;
    //     file.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
    //         console.log("Data Updated for user with ID: " + id);
    //         return res.json({ "Status": `Patch Success with ID->${id}` });
    //     });
    // } else {
    //     return res.json({ "Status": `Patch Unsuccessful with Invalid ID->${id}` });
    // }
};

async function deleteData(req, res) {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ Message: 'Deleted' });
    // const id = Number(req.params.id);
    // const index = users.findIndex((user) => user.id === id);
    // if (index > 0 && index <= users.length) {
    //     users.splice(index, 1);
    //     file.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
    //         if (err) {
    //             console.error(err);
    //             return res.status(500).json({ "error": "An error occurred while deleting data" });
    //         }
    //         console.log("Data Deleted with index:" + index);
    //         return res.json({ "Status": `Delete Success with ID->${id}` });
    //     });
    // } else {
    //     return res.json({ "Status": `Delete Unsuccessful with Invalid ID->${id}` });
    // }
};

async function idWiseData(req, res) {
    const id = req.params.id;
    const users = await User.findById(id);
    if (!users) {
        res.status(404).json({ message: 'User not found.' });
    }
    return res.json(users);
};
module.exports = {
    getAllUsersJSON,
    getAllUsersHTML,
    postUserData,
    patchData,
    deleteData,
    idWiseData,
};