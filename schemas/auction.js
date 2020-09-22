const { ObjectID } = require('bson');
const Schema = require('mongoose').Schema;

module.exports = new Schema({
    artId: { type: ObjectID, required: true },
    minimumPrice: Number,
    endDate: { type: Date, required: true },
    auctionWinner: { type: ObjectID },
});
