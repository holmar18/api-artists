const artist = require('../data/db').Artist;

const ArtistQuery = artist.db.collection("Artist");
const { ObjectID } = require('bson');

const artistService = () => {
    const getAllArtists = (cb, errorCb) => {
        return ArtistQuery.find({}).toArray();
    };

    const getArtistById = async (id, cb, errorCb) => {
        var isValidID = ObjectID.isValid(id);
        if (!isValidID) { return - 2 }
        const ArtisQueryToArr = await ArtistQuery.find({ '_id': ObjectID(`${id}`) }).toArray();
        if (ArtisQueryToArr.length === 0) { return -1; }
        return ArtisQueryToArr;
    };

    const createArtist = async (artist, cb, errorCb) => {
        var date = new Date();
        var isValidID = ObjectID.isValid(artist._id);
        if (!isValidID && artist._id != undefined) { return errorCb(-2) }
        const ArtisQueryToArr = await ArtistQuery.find({ '_id': `${artist._id}` }).toArray();
        if (ArtisQueryToArr.length > 0) { cb(-1); }
        else {
            const resp = ArtistQuery.insertOne({
                '_id': (artist._id ? ObjectID(artist._id) : ObjectID ),
                'name': artist.name,
                'nickname': artist.nickname,
                'address': artist.address,
                'memberSince': (artist.memberSince ? artist.memberSince : date.getDate()),
                }, (error, results) => {
                    if (error) {errorCb(-1)}
                    else { cb(results) };
                });
            }
    };

    return {
        getAllArtists,
        getArtistById,
        createArtist
    };
};

module.exports = artistService();
