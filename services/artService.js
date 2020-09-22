const art = require('../data/db').Art;
// let dataVar = async function data() { return await artQuery.find({}).toArray() }
const artQuery = art.db.collection("Art");
const { ObjectID } = require('bson');


const artService = () => {
    const getAllArts = (cb, errorCb) => {
        return artQuery.find({}).toArray();
    };

    const getArtById = async (id, cb, errorCb) => {
        const artQueryToArr = await artQuery.find({ '_id': ObjectID(`${id}`) }).toArray();
        if (artQueryToArr.length === 0) { return -1; }
        return artQueryToArr;
    };

    const createArt = async (art, cb, errorCb) => {
        const artQueryToArr = await artQuery.find({ '_id': ObjectID(`${art._id}`) }).toArray();
        var date = new Date();
        if (artQueryToArr.length > 0) { errorCb(-1) }
        else {
            const resp = artQuery.insertOne({
                '_id': (art._id ? ObjectID(art._id) : ObjectID ),
                'artistId': (art.artistId ? ObjectID(art.artistId) : ObjectID(0) ),
                'title': art.name,
                'date': date.getDate(),
                'images': art.images,
                'description': art.description,
                'isAuctionItem': (art.isAuctionItem ? art.isAuctionItem : false)
                }, (error, results) => {
                    if (error) {errorCb(error)}
                    else { cb(results) };
                });
        }
    };

    return {
        getAllArts,
        getArtById,
        createArt
    };
};

module.exports = artService();
