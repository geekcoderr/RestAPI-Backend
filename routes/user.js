const express = require('express');
const router = express.Router();
const { getAllUsersJSON,
    getAllUsersHTML,
    postUserData,
    patchData,
    deleteData,
    idWiseData, } = require('../controllers/user')

router.route('/')
    .get(getAllUsersHTML)
    .post(postUserData);

router.get('/api', getAllUsersJSON);

router.route('/api/id/:id')
    .get(idWiseData)
    .patch(patchData)
    .delete(deleteData);

module.exports = router;