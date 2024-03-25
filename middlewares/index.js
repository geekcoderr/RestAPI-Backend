const fs = require('fs');

function logAppend(filename) {
    return (req, res, next) => {
        console.log(`At[${(new Date()).toDateString()}] recieved ${req.method} Request On [${req.url}] from IP: ${req.ip}`);
        fs.appendFile(filename, `Time: ${(new Date()).toDateString()} , Method: ${req.method} , URL/Path: ${req.url} , IP: ${req.ip}\n`, (err, data) => {
            next();
        });
    };
};

module.exports={
    logAppend,
}