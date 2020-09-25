const auctionBid = require('../data/db').AuctionBid;
const auction = require('../data/db').Auction;
// let dataVar = async function data() { return await artQuery.find({}).toArray() }
const auctionbidQuery = auctionBid.db.collection("AuctionBid");
const auctionQuery = auction.db.collection("Auction");
const { ObjectID } = require('bson');

const customerService = require('./customerService');
const artService = require('./artService');

const auctionService = () => {
    const getAllAuctions = (cb, errorCb) => {
        return auctionQuery.find({}).toArray();
    };

    const getAuctionById = async (id, cb, errorCb) => {
        // Needs to be a valid object id length
        var isValidID = ObjectID.isValid(id);
        if (!isValidID) { return - 2 }
        // Find the auction
        const auctionQueryToArr = await auctionQuery.find({ '_id': ObjectID(`${id}`) }).toArray();
        // If the there is no auction return error value
        if (auctionQueryToArr.length === 0) { return -1; }
        return auctionQueryToArr;
    };

    const getAuctionWinner = async (auctionId, cb, errorCb) => {
        var currentDate = new Date();
        // Get the auction by id
        const auctionQueryToArr = await getAuctionById(auctionId);
        // if there is no auction with that id return error value
        if (auctionQueryToArr.length === 0) { errorCb(-1); }
        else if(new Date(auctionQueryToArr[0].endDate) > currentDate) { errorCb(-2); }
        else {
            // Get the customer with id
            const  customers = await customerService.getCustomerById(auctionQueryToArr[0].auctionWinner);
            // if the auction has not ended return 409 conflict
            if (customers.endDate > new Date()) { return -2 };
            // pass the customer back to the callback
            cb(customers);
        }

    };

	const createAuction = async (auction, cb, errorCb) => {
        // CHeck if artId is valid object id
        var isValidID = ObjectID.isValid(auction.artId);
        if (!isValidID) { return errorCb(-4) }
        // Get the art with id
        const checkIfArtExist = await artService.getArtById(auction.artId);
        // if no art has that id
        if (checkIfArtExist == -1 || checkIfArtExist == -2) { return errorCb(-1) };
        // if art is not for auction
        if (!checkIfArtExist[0].isAuctionItem) { return errorCb(-2) };

        // Check if there is any auction with that id
        const auctionQueryToArr = await auctionQuery.find({ 'artId': `${checkIfArtExist._id}` }).toArray();
        // if there is auction with that artId return error code value
        if (auctionQueryToArr.length > 0) { return errorCb(-3) }
        // Else create new Auction
        else {
            const resp = auctionQuery.insertOne({
                'artId': auction.artId,
                'minimumPrice': auction.minimumPrice,
                'endDate': auction.endDate
                }, (error, results) => {
                    // if the insert failes return Error code value to the error callback function
                    if (error) {errorCb(-1)}
                    // if the insert failes return Error code value to the callback function
                    else { cb(results) };
                });
        }
    };

    const getCustomerAuctionBids = async (customerId, cb, errorCb) => {
        // Find custmer auction bids
        const auctionQueryToArr = await auctionbidQuery.find({ 'customerId': `${customerId}` }).toArray();
        // if he has no bids return Error value
        if (auctionQueryToArr.length === 0) { return -1; }
        return auctionQueryToArr;
    };

	const getAuctionBidsWithinAuction = async (auctionId, cb, errorCb) => {
        const auctionQueryToArr = await auctionbidQuery.find({ 'auctionId': ObjectID(`${auctionId}`) }).toArray();
        console.log("AUCTION BIDS: ", auctionQueryToArr);
        if (auctionQueryToArr.length === 0) { return -1; }
        return auctionQueryToArr;
    };

	const placeNewBid = async (auctionId, customerId, price, cb, errorCb) => {
        var currentDate = new Date();
        // Find the auction.
        const auctionQueryToArr = await auctionQuery.find({ '_id': ObjectID(`${auctionId}`) }).toArray();
        // if no auction has that Auction id
        if (auctionQueryToArr.length === 0) { return errorCb(-1); }
        // if the auction has passed end date return 403
        if (new Date(auctionQueryToArr[0].endDate) < currentDate) { return errorCb(-2) };
        // if the price is to low
        if (auctionQueryToArr[0].price > price) { return errorCb(-3) };
        // bid Must be higher than the minimum price or current highest bid else return 412
        // get the auctions bids for that auction
        const auctionBids = await getAuctionBidsWithinAuction(auctionQueryToArr[0]._id);
        // Get the top Bid
        if (auctionBids.length > 0) {
            const auctioBidsTopPrice = Math.max.apply(Math, auctionBids.map(function(o) { return o.price; }));
            // Check if the new bid is bigger then the top bid.
            if (auctioBidsTopPrice > price) { return errorCb(-3) };
        }
        // if it was higher we want to Change the currentWinner id for that auction
        const changeTopBidd = await auctionQuery.find({ '_id': ObjectID(`${auctionId}`) }).toArray();
        const changeTopBid = await auctionQuery.updateOne({ '_id': ObjectID(`${auctionId}`) }, 
                                                       { $set: { auctionWinner:  `${customerId}`}, 
                                                        }, (err, item) => {
                                                            if (err) { return errorCb(-4) }
                                                            //return cb(item)
                                                        });
        // INSERT the new auction bid
        const addNewBid = await auctionbidQuery.insertOne({'auctionId': ObjectID(auctionId),
                                                    'customerId': ObjectID(customerId),
                                                    'price': price
                                                    }, (err, item) =>  {
                                                        if (err) { return errorCb(-4) }
                                                        return cb(item)
                                                    });
    };
    return {
        getAllAuctions,
        getAuctionById,
        getAuctionWinner,
        createAuction,
        getCustomerAuctionBids,
        getAuctionBidsWithinAuction,
        placeNewBid
    };


};

module.exports = auctionService();
