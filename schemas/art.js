const { ObjectID } = require('bson');

const Schema = require('mongoose').Schema;

module.exports = new Schema({
    artistId: { type: ObjectID, required: true },
    title: { type: String, required: true },
    date: Date,
    images: [],
    description: String,
    isAuctionItem: Boolean
});
