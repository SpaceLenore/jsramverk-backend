const jwt = require('jsonwebtoken');

const jwtsecret = process.env.JWT_SECRET;

const generateToken = (usrEmail) => {
    return new Promise((resolve, reject) => {
        //Crete a time object for expiery date
        let data = {email: usrEmail};
        let finalJWT = jwt.sign(data, jwtsecret);

        resolve(finalJWT);
    });
}

const validateToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtsecret, (err, decoded) => {
            //check for decode error in jwt
            if (err != null) {
                resolve(false);
            }
            resolve(true);
        });

    });
}

module.exports = {
    generateToken,
    validateToken
}
