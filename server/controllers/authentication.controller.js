const bcrypt = require('bcryptjs'); //hash the password
const jwt = require('jsonwebtoken'); //handle JWT token
const ObjectId = require('mongodb').ObjectID; //Convert _id to ObjectId in MongoDB

const User = require('../classes/user');
const DbConnection = require('../services/db.service');

class AuthenticationController {
    constructor() {}

    /**
     * API: Handle register new account
     * @param {*} req Request object
     * @param {*} res Response object
     */
    async register(req, res) {
        try {
            //hash password
            req.body.password = bcrypt.hashSync(req.body.password);
            let newUser = new User(req.body);
            //insert new user
            let db = await DbConnection.Get();
            let result = await db.collection(process.env.USER_COLLECTION).insertOne(newUser);
            //get token for new user
            res.json(result.insertedId);
        } catch (e) {
            res.status(500).json('Duplicate email!!!');
            return e;
        }
    }

    /**
     * API: Handle login to the system
     * @param {*} req Request object
     * @param {*} res Response object
     */
    async login(req, res) {
        try {
            //connect db to get login user's information
            let db = await DbConnection.Get();
            await db.collection(process.env.USER_COLLECTION)
                .findOne({
                    email: req.body.username
                }, (err, user) => {
                    //case of error
                    if (err) throw err;
                    //case of user not found
                    if (!user) return res.status(404).json('User not found!');
                    //compare pasword
                    const result = bcrypt.compareSync(req.body.password, user.password);
                    //case of password not match
                    if (!result) return res.status(401).json('Password not valid!');
                    //generate new token, the token will be expired within 24 hours if not remember
                    const expiresIn = 24 * 60 * 60;
                    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
                    if (!req.body.rememberMe) {
                        //if remember me was checked then the token will not be expired
                        setTimeout(() => {
                            //remove token after expire
                            db.collection(process.env.USER_COLLECTION).updateOne({ '_id': user._id }, { $set: { 'token': '' } });
                        }, expiresIn * 1000);
                    }
                    //update new token to db
                    db.collection(process.env.USER_COLLECTION).updateOne({ '_id': user._id }, { $set: { 'token': accessToken } });
                    //response current user
                    res.json({
                        '_id': user._id,
                        'name': `${user.firstName} ${user.lastName}`,
                        'firstName': user.firstName,
                        'lastName': user.lastName,
                        'email': user.email,
                        'token': accessToken,
                        'role': user.role
                    });
                });
        } catch (e) {
            res.status(500).json(true);
            return e;
        }
    }

    /**
     * API: Handle logout
     * @param {*} req Request object
     * @param {*} res Response object
     */
    async logout(req, res) {
        try {
            //get token and login user's info
            const token = req.header('Authorization').replace('bearer ', '');
            const data = jwt.verify(token, process.env.SECRET_KEY);
            //connect db to remove the token
            let db = await DbConnection.Get();
            db.collection(process.env.USER_COLLECTION).updateOne({
                _id: ObjectId(data.id),
                token: token
            }, {
                $set: { 'token': '' }
            });
            //response
            res.json(true);
        } catch (e) {
            res.status(500).json(true);
            return e;
        }
    }

    /**
     * Handle authorization before execute the API request.
     * @param {*} req Request object
     * @param {*} res Response object
     * @param {*} next Callback function of express
     */
    async authorization(req, res, next) {
        try {
            //get login user's token
            const token = req.headers['authorization'].replace('bearer ', '');
            const data = jwt.verify(token, process.env.SECRET_KEY);
            //check if login user and the request is valid
            let db = await DbConnection.Get();
            let user = await db.collection(process.env.USER_COLLECTION)
                .findOne({
                    _id: ObjectId(data.id),
                    token: token
                });
            if (!user) {
                throw new Error();
            }
            req.user = user;
            req.token = token;
            //run next step
            next();
        } catch (error) {
            res.status(401).json({ error: 'Not authorized to access this resource' });
        }
    }
}
module.exports = AuthenticationController;