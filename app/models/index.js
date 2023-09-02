const mongoose = require('mongoose');
mongoose.set('autoIndex', false);

// mongoose.Promise = global.Promise;
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);

const db = {};

db.mongoose = mongoose;

db.user = require("./customer.model");
db.coach = require("./coach.model");
db.certification = require("./certification.model");
db.major = require("./major.model");
db.cart = require("./cart.model");
db.order = require("./order.model");




db.ROLES = ["user", "admin", "moderator"];

module.exports = db;