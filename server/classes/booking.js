class Booking {
    constructor(obj) {
        this._id = obj ? obj._id : null;
        this.status = obj ? obj.status : null;
        this.eventType = obj ? obj.eventType : null;
        this.location = obj ? obj.location : null;
        this.proposedDateTime1 = obj ? obj.proposedDateTime1 : null;
        this.proposedDateTime2 = obj ? obj.proposedDateTime2 : null;
        this.proposedDateTime3 = obj ? obj.proposedDateTime3 : null;
        this.choosenDateTime = obj ? obj.choosenDateTime : null;
        this.reasonForRejection = obj ? obj.reasonForRejection : null;

        this.createdBy = obj ? obj.createdBy : null;
        this.createdDate = obj ? obj.createdDate : null;
        this.updatedBy = obj ? obj.updatedBy : null;
        this.updatedDate = obj ? obj.updatedDate : null;
    }
}

module.exports = Booking;