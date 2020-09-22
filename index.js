const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;

// Other imports
const artistService = require('./services/artistService');
const artService = require('./services/artService');
const auctionService = require('./services/auctionService');
const customerService = require('./services/customerService');

const server = express();

// Settings
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());


//////////////////////////////////////////////////////////////////
//
//                      Routes 
//
//////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
//
//                      Arts 
//
//////////////////////////////////////////////////////////////////
//  /api/arts [GET] 
server.get('/api/arts', async (req, res) => {
    const response = await artService.getAllArts();
    return res.json(response);
});

//  /api/arts/:id [GET]
server.get('/api/arts/:id', async (req, res) => {
    const id = req.params.id;
    const response = await artService.getArtById(id);
    if (response === -1) { return res.status(404).send(); }
    return res.json(response);
});

//  /api/arts [POST]
server.post('/api/arts', (req, res) => {
    const response = artService.createArt(req.body, (art) => {
        return res.status(201).json(art);
    }, (error, item) => {
        if (error === -1) { return res.status(500).json("Id already exists") }
        return res.status(400).json(error);
    });

});

//////////////////////////////////////////////////////////////////
//
//                      Artist 
//
//////////////////////////////////////////////////////////////////
//  /api/artists [GET] 
server.get('/api/artists', async (req, res) => {
    const response = await artistService.getAllArtists();
    return res.json(response);
});

//  /api/artists/:id [GET]
server.get('/api/artists/:id', async (req, res) => {
    const id = req.params.id;
    const response = await artistService.getArtistById(id);
    if (response === -1) { return res.status(404).send(); }
    return res.json(response);
});

//  /api/artists [POST]
server.post('/api/artists', (req, res) => {
    const response = artistService.createArtist(req.body, (art) => {
        return res.status(201).json("Successfully created new artist");
    }, (error, item) => {
        if (error === -1) { return res.status(500).json("Id already exists") }
        return res.status(400).json(error);
    });

});

//////////////////////////////////////////////////////////////////
//
//                      Customer 
//
//////////////////////////////////////////////////////////////////
//  /api/customers [GET] 
server.get('/api/customers', async (req, res) => {
    const response = await customerService.getAllCustomers();
    return res.json(response);
});

//  /api/customers/:id [GET]
server.get('/api/customers/:id', async (req, res) => {
    const id = req.params.id;
    const response = await customerService.getCustomerById(id);
    if (response === -1) { return res.status(404).send(); }
    return res.json(response);
});

//  /api/customers [POST]
server.post('/api/customers', (req, res) => {
    const response = customerService.createCustomer(req.body, (art) => {
        return res.status(201).json("Successfully created new customer");
    }, (error, item) => {
        if (error === -1) { return res.status(500).json("Id already exists") }
        return res.status(400).json(error);
    });

});

//////////////////////////////////////////////////////////////////
//
//                      Auction 
//
//////////////////////////////////////////////////////////////////
//  /api/auctions/:id/auction-bids [GET] 
server.get('/api/auctions/:id/auction-bids', async (req, res) => {
    const id = req.params.id;
    const response = await auctionService.getCustomerAuctionBids(id);
    if (response === -1) { return res.status(404).send("No auction found"); }
    return res.status(200).json(response);
});

//  /api/auctions [GET]
server.get('/api/auctions', async (req, res) => {
    const response = await auctionService.getAllAuctions();
    return res.status(200).json(response);
});

//  /api/auctions/:id [GET]
server.get('/api/auctions/:id', async (req, res) => {
    const id = req.params.id;
    const response = await auctionService.getAuctionById(id);
    if (response === -1) { return res.status(404).send(`No auction with ID: { ${id} } Found.`); }
    return res.status(200).json(response);
});

//  /api/auctions/:id/winner [GET]
server.get('/api/auctions/:id/winner', async (req, res) => {
    const id = req.params.id;
    const response = await auctionService.getAuctionWinner(id, (art) => {
        return res.status(200).json(art);
    }, (error, item) => {
        if (error === -1) { return res.status(200).send(`No auction with ID: { ${id} } has any bids.`); }
        if (error === -2) { return res.status(409).send(`Auction is not finished.`); }
        return res.status(400).json(error);
    });
});

//  /api/auctions [POST]
server.post('/api/auctions/:id', async (req, res) => {
    const response = await auctionService.createAuction(req.body, (auction) => {
        return res.status(200).json("Auction successfully created");
    }, (error, item) => {
        switch (error) {
            case -1:
                return res.status(412).send(`Artist with that id not found.`);
                break;
            case -2:
                return res.status(412).send(`Item is not for Auction`);
                break;
            case -3:
                return res.status(412).send(`The Item is already up for auction.`);
                break;
            default:
                return res.status(500).json(error);
        }
    });

});

//  /api/auctions/:id/bids [GET]
server.get('/api/auctions/:id/bids', async (req, res) => {
    const id = req.params.id;
    const response = await auctionService.getAuctionBidsWithinAuction(id);
    if (response === -1) { return res.status(404).send(`No auction bids found for Auction with with ID: { ${id} } Found.`); }
    return res.status(200).json(response);
});

//  /api/auctions/:id/bids [POST]
server.post('/api/auctions/:id/bids', async (req, res) => {
    const data = req.body;
    const response = await auctionService.placeNewBid(data.auctionId, data.customerId, data.price, (bidresp) => {
        return res.status(200).json(`Bid for auctionId: ${data.auctionId} successfully created`);
    }, (err, res) => {
        switch (err) {
            case -1:
                return res.status(404).send(`No auction with ID: { ${id} } Found.`);
                break;
            case -2:
                res.status(403).send(`That Auction has ended.`);
                break;
            case -3:
                res.status(412).send(`Auction is not higher than the minimum price.`);
                break;
            default:
                res.status(500).send(err);

        }
    });
});




server.listen(port, () => {
    console.log(`Server is listening on: ${port}`);
});