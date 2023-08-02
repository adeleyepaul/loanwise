const crypto = require("crypto");


const sendError = (res, error, status = 401) => {
    res.status(status).json({ success: false, error});
}

const createRandomBytes = () =>
    new Promise((resolve, reject) => {
        crypto.randomBytes(30, (err, buff) => {
            if(err) reject(err);

            const token = buff.toString('hex');
            resolve(token)
        });
});


exports.sendError = sendError;
exports.createRandomBytes = createRandomBytes;