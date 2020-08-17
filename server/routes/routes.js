const express = require('express');
const Authentication = require('../controllers/authentication.controller.js');
const BookingController = require('../controllers/booking.controller.js');
const EventTypeController = require('../controllers/eventType.controller.js');

class Routers {
    router;
    constructor() {
        this.router = express.Router();
        this.router.get('', (req, res) => {
            res.json('');
        });
        //Authentication routers
        let authen = new Authentication()
        this.router.post('/api/register', authen.register);
        this.router.post('/api/login', authen.login);
        this.router.post('/api/logout', authen.logout);

        //booking routers
        let bookings = new BookingController();
        this.router.post('/api/bookings', authen.authorization, bookings.createNew);
        this.router.get('/api/bookings', authen.authorization, bookings.getAll);
        this.router.get('/api/bookings/:id', authen.authorization, bookings.getById);
        this.router.get('/api/bookings/user/:id', authen.authorization, bookings.getByUser);
        this.router.put('/api/bookings', authen.authorization, bookings.update);
        this.router.delete('/api/bookings', authen.authorization, bookings.deleteBulk);

        //event type routers
        let eventTypes = new EventTypeController();
        this.router.post('/api/eventtypes', authen.authorization, eventTypes.createNew);
        this.router.get('/api/eventtypes', authen.authorization, eventTypes.getAll);
        this.router.get('/api/eventtypes/:id', authen.authorization, eventTypes.getById);
        this.router.put('/api/eventtypes', authen.authorization, eventTypes.update);
        this.router.delete('/api/eventtypes', authen.authorization, eventTypes.deleteBulk);
    }
}
module.exports = Routers;