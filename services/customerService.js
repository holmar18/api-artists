const customer = require('../data/db').Customer;

const CustomertQuery = customer.db.collection("Customer");
const { ObjectID } = require('bson');

const customerService = () => {
    const getAllCustomers = (cb, errorCb) => {
        return CustomertQuery.find({}).toArray();
    };

    const getCustomerById = async (id, cb, errorCb) => {
        console.log("CU1: ", CustomerQueryToArr);
        const CustomerQueryToArr = await CustomertQuery.find({ '_id': ObjectID(`${id}`) }).toArray();
        console.log("CU1: ", CustomerQueryToArr);
        console.log("CU2: ", CustomerQueryToArr.length);
        if (CustomerQueryToArr.length === 0) { return -1; }
        return CustomerQueryToArr;
    };

    const getCustomerAuctionBids = (customerId, cb, errorCb) => {
        // Your implementation goes here
    };

	const createCustomer = async (customer, cb, errorCb) => {
        var date = new Date();
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
