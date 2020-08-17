class EventType {
    constructor(obj) {
        this._id = obj ? obj._id : null;
        this.name = obj ? obj.name : null;

        this.createdBy = obj ? obj.createdBy : null;
        this.createdDate = obj ? obj.createdDate : null;
        this.updatedBy = obj ? obj.updatedBy : null;
        this.updatedDate = obj ? obj.updatedDate : null;
    }
}

module.exports = EventType;