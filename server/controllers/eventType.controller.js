const DBConnect = require('../services/db.service');
const { ObjectID } = require('mongodb');
const EventType = require('../classes/eventType');

class EventTypeController {
    EventTypes;
    constructor() {
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.createNew = this.createNew.bind(this);
        this.update = this.update.bind(this);
        this.deleteBulk = this.deleteBulk.bind(this);
        this.getAllDataUpToDate = this.getAllDataUpToDate.bind(this);
    }

    /**
     * Get all event types in database
     */
    async getAllDataUpToDate() {
        let db = await DBConnect.Get();
        let result = await db.collection(process.env.EVENT_TYPE_COLLECTION)
            .find({})
            .toArray();
        this.EventTypes = result.sort((a, b) => {
            return (new Date(a['createdDate'])).getTime() - (new Date(b['createdDate'])).getTime();
        });
    }

    /**
     * API: Get all data
     * @param {*} req Request object
     * @param {*} res Response object
     */
    async getAll(req, res) {
        try {
            if (this.EventTypes == null)
                await this.getAllDataUpToDate();
            res.json(this.EventTypes);
        } catch (e) {
            res.status(500).json(true);
            return e;
        }
    }

    /**
     * API: Get record by _id
     * @param {*} req Request object
     * @param {*} res Response object
     */
    async getById(req, res) {
        try {
            if (this.EventTypes == null)
                await this.getAllDataUpToDate();
            let result = {};
            for (let i = 0; i < this.EventTypes.length; i++) {
                if (this.EventTypes[i]._id == req.params.id) {
                    result = this.EventTypes[i];
                    break;
                }
            }
            res.json(result);
        } catch (error) {
            res.status(500).json(true);
            return error;
        }
    }

    /**
     * API: create new record
     * @param {*} req Request object
     * @param {*} res Response object
     */
    async createNew(req, res) {
        try {
            let db = await DBConnect.Get();
            let newObj = new EventType(req.body);
            newObj.createdBy = req.user;
            newObj.createdDate = new Date();
            newObj.updatedBy = req.user;
            newObj.updatedDate = new Date();
            await db.collection(process.env.EVENT_TYPE_COLLECTION)
                .insertOne(newObj, (err, result) => {
                    if (err) {
                        let message = err.code == 11000 ? 'Duplicate name' : 'Could not insert';
                        return res.status(500).json(message);
                    }
                    res.json(result.insertedId);
                    this.getAllDataUpToDate();
                });
        } catch (error) {
            res.status(500).json(true);
            return error;
        }
    }

    /**
     * API: update selected record
     * @param {*} req Request object
     * @param {*} res Response object
     */
    async update(req, res) {
        try {
            let db = await DBConnect.Get();
            let targetObj = new EventType(req.body);
            targetObj.updatedBy = req.user;
            targetObj.updatedDate = new Date();
            db.collection(process.env.EVENT_TYPE_COLLECTION)
                .updateOne({
                        _id: ObjectID(targetObj._id)
                    }, {
                        $set: {
                            name: targetObj.name,
                            updatedBy: targetObj.updatedBy,
                            updatedDate: targetObj.updatedDate
                        }
                    },
                    (err, result) => {
                        if (err) {
                            let message = err.code == 11000 ? 'Duplicate name' : 'Could not update';
                            return res.status(500).json(message);
                        }
                        res.json({
                            modifiedCount: result.modifiedCount,
                            matchedCount: result.matchedCount
                        });
                        this.getAllDataUpToDate();
                    }
                );
        } catch (err) {
            res.status(500).json(true);
            return err;
        }
    }

    /**
     * API: delete multiple records
     * @param {*} req Request object
     * @param {*} res Response object
     */
    async deleteBulk(req, res) {
        try {
            if (!req.body) {
                res.json('No record was deleted');
                return;
            }
            //convert _id to ObjectID in mongoDB
            let listId = [];
            for (let i = 0; i < req.body.length; i++) {
                listId.push(ObjectID(req.body[i]._id));
            }
            //delete bulk
            let db = await DBConnect.Get();
            db.collection(process.env.EVENT_TYPE_COLLECTION)
                .deleteMany({
                        _id: { $in: listId }
                    },
                    (err, result) => {
                        if (err) return res.status(500).json('Could not delete');
                        res.json(result.deletedCount);
                        this.getAllDataUpToDate();
                    }
                );
        } catch (err) {
            res.status(500).json(true);
            return err;
        }
    }
}

module.exports = EventTypeController;