const customerService = () => {
    const getAllCustomers = (cb, errorCb) => {
        // Your implementation goes here
    };

    const getCustomerById = (id, cb, errorCb) => {
        // Your implementation goes here
    };

    const getCustomerAuctionBids = (customerId, cb, errorCb) => {
        // Your implementation goes here
    };

	const createCustomer = (customer, cb, errorCb) => {
        // Your implementation goes here
    };

    return {
        getAllCustomers,
        getCustomerById,
        getCustomerAuctionBids,
		createCustomer
    };
};

module.exports = customerService();
