const Schema = require('mongoose').Schema;
const { ObjectID } = require('bson');

module.exports = new Schema({
    auctionId: { type: ObjectID, required: true },
    customerId: { type: ObjectID, required: true },
    price: Number,
});
