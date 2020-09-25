const customer = require('../data/db').Customer;
const auctionBid = require('../data/db').AuctionBid;

const CustomertQuery = customer.db.collection("Customer");
const auctionbidQuery = auctionBid.db.collection("AuctionBid");
const { ObjectID } = require('bson');

const customerService = () => {
    const getAllCustomers = (cb, errorCb) => {
        return CustomertQuery.find({}).toArray();
    };

    const getCustomerById = async (id, cb, errorCb) => {
        var isValidID = ObjectID.isValid(id);
        if (!isValidID) { return - 2 }
        const CustomerQueryToArr = await CustomertQuery.find({ '_id': ObjectID(`${id}`) }).toArray();
        if (CustomerQueryToArr.length === 0) { return -1; }
        return CustomerQueryToArr;
    };

    const getCustomerAuctionBids = async (customerId, cb, errorCb) => {
        // Find custmer auction bids
        var isValidID = ObjectID.isValid(customerId);
        if (!isValidID) { return - 2 }
        const auctionQueryToArr = await auctionbidQuery.find({ 'customerId': `${customerId}` }).toArray();
        // if he has no bids return Error value
        if (auctionQueryToArr.length === 0) { return -1; }
        return auctionQueryToArr;
    };

	const createCustomer = async (customer, cb, errorCb) => {
        var isValidID = ObjectID.isValid(customer._id);
        if (!isValidID && customer._id != undefined) { return errorCb(-2) }
        const CustomerQueryToArr = await CustomertQuery.find({ '_id': `${customer._id}` }).toArray();
        if (CustomerQueryToArr.length > 0) { cb(-1); }
        else {
            const resp = CustomertQuery.insertOne({
                '_id': (customer._id ? ObjectID(customer._id) : ObjectID ),
                'name': customer.name,
                'username': customer.username,
                'email': customer.email,
                'address': customer.address
                }, (error, results) => {
                    if (error) {errorCb(-1)}
                    else { cb(results) };
                });
            }
    };

    return {
        getAllCustomers,
        getCustomerById,
        getCustomerAuctionBids,
		createCustomer
    };
};

module.exports = customerService();
