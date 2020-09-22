const auctionBid = require('../data/db').AuctionBid;
const auction = require('../data/db').Auction;
const customer = require('../data/db').Customer;
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
        // Find the auction
        const auctionQueryToArr = await auctionQuery.find({ '_id': ObjectID(`${id}`) }).toArray();
        // If the there is no auction return error value
        if (auctionQueryToArr.length === 0) { return -1; }
        return auctionQueryToArr;
    };

    const getAuctionWinner = async (auctionId, cb, errorCb) => {
        // Get the auction by id
        const auctionQueryToArr = await getAuctionById(auctionId);
        // if there is no auction with that id return error value
        if (auctionQueryToArr.length === 0) { errorCb(-1); }
        else {
            // Get the customer with id
            const  customers = await customerService.getCustomerById(auctionQueryToArr[0].auctionWinner);
            console.log("DATE COMPARISON: ", customers.endDate > new Date());
            // if the auction has not ended return 409 conflict
            if (customers.endDate > new Date()) { return -2 };
            // pass the customer back to the callback
            cb(customers);
        }

    };

	const createAuction = async (auction, cb, errorCb) => {
        // Get the artist with id
        const checkIfArtExist = artService.getArtById(auction.artId);
        // if no art has that id
        if (checkIfArtExist.length === 0) { return errorCb(-1) };
        // if art is not for auction
        if (!checkIfArtExist[0].isAuctionItem) { return errorCb(-2) };

        // Check if there is any auction with that id
        const auctionQueryToArr = await auctionQuery.find({ 'artId': ObjectID(`${checkIfArtExist._id}`) }).toArray();
        // if there is auction with that artId return error code value
        if (auctionQueryToArr.length === 0) { return errorCb(-3) }
        // Else create new Auction
        else {
            const resp = auctionQuery.insertOne({
                '_id': (auction._id ? ObjectID(auction._id) : ObjectID ),
                'auctionId': auction.auctionId,
                'customerId': auction.customerId,
                'price': auction.price
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
        if (auctionQueryToArr.length === 0) { return -1; }
        return auctionQueryToArr;
    };

	const placeNewBid = async (auctionId, customerId, price, cb, errorCb) => {
        // Find the auction.
        const auctionQueryToArr = await auctionbidQuery.find({ 'auctionId': ObjectID(`${auctionId}`) }).toArray();
        // if no auction has that Auction id
        if (auctionQueryToArr.length === 0) { return -1; }
        // if the auction has passed end date return 403
        if (new date(auctionQueryToArr[0].endDate) > new Date()) { return -2 };
        // if the price is to low
        if (auctionQueryToArr[0].price > price) { return -3 };
        // bid Must be higher than the minimum price or current highest bid else return 412
        // get the auctions bids for that auction
        const auctionBids = await getAuctionBidsWithinAuction(auctionQueryToArr[0]._id);
        // Get the top Bid
        const auctioBidsTopPrice = Math.max.apply(Math, auctionBids.map(function(o) { return o.price; }));
        console.log("TOP BID: ", auctioBidsTopPrice);
        // Check if the new bid is bigger then the top bid.
        if (auctioBidsTopPrice[0].price > price) { return -3 };
        // if it was higher we want to Change the currentWinner id for that auction
        const changeTopBid = auctionbidQuery.updateOne({ 'auctionId': ObjectID(`${auctionId}`) }, 
                                                       { $set: { auctionWinner:  ObjectID(`${customerId}`)}, 
                                                        }, (err, item) => {
                                                            if (err) { return errorCb(-4) }
                                                            return cb(item)
                                                        });
	};


};

module.exports = auctionService();
