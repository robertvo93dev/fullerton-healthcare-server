class User {
    constructor(obj) {
        this._id = (obj != null && obj._id != null) ? obj._id : null;
        this.email = (obj != null && obj.email != null) ? obj.email : '';
        this.password = (obj != null && obj.password != null) ? obj.password : '';
        this.firstName = (obj != null && obj.firstName != null) ? obj.firstName : '';
        this.lastName = (obj != null && obj.lastName != null) ? obj.lastName : '';
        this.role = (obj != null && obj.role != null) ? obj.role : '';
        this.token = (obj != null && obj.token != null) ? obj.token : '';
    }
}

module.exports = User;