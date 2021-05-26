# How to use

its made with node, but to use it a DB is needed with MongoDB for example you only need to change the link in "data/db.js"
`const connection = mongoose.createConnection('Your link goes here', { useNewUrlParser: true });`

# Api

_Arts auction api, can post auctions with end-dates for the auction to expire_

## End Points

#### Arts endpoints

`/api/arts [GET]` - Gets all arts
`/api/arts/:id [GET]` - Gets an art by id
`/api/arts [POST]` - Creates a new art (see how model should look like in Model section)

### Artist endpoints

`/api/artists [GET]` - Gets all artists
`/api/artists [POST]` - Creates a new artist (see how model should look like in Model section)

### Customer endpoints

`/api/customers [GET]` - Gets all customers
`/api/customers/:id [GET]` - Gets a customer by id
`/api/customers [POST] ` - Creates a new customer (see how model should looklike in Model section)

### Customer auction BIDS endpoints

`/api/customers/:id/auction-bids [GET]` - Gets all auction bids associated with a customer

### Auction endpoints

`/api/auctions [GET]` - Gets all auctions
`/api/auctions/:id [GET]` - Gets an auction by id
` /api/auctions/:id/winner [GET]` - Gets the winner of the auction. If the auction is not finished the web service should return a status code 409 (Conflict), otherwise it should return the customer which holds the highest bid. If the auction had no bids, it should return a status code 200 (OK) with the message: ‘This auction had no bids.’.
`/api/auctions [POST]` - Create a new auction (see how model should look like in Model section). The art id provided within the body must be a valid art id with its property isAuctionItem set to true. If the isAuctionItem is set to false, the web service should return a status code 412 (Precondition failed). Also if there is an ongoing auction currently for this art, the web service should return a status code 409 (Conflict).
`/api/auctions/:id/bids [GET]` - Gets all auction bids associated with an
auction
`/api/auctions/:id/bids [POST]` - Creates a new auction bid (see how model should look like in Model section). Auction bids must be higher than the minimum price and must also be higher than the current highest bid. If the auction bid price is lower than the minimum price or current highest bid, the web service should return a status code 412 (Precondition failed). If the auction has already passed its end date,
the web service should return a status code 403 (Forbidden). As a side-effect the auctionWinner p

## Schemas

- `Art`
  - `title`\* (String),
  - `artistId`\* (ObjectId),
  - `date`\* (Date, defaults to now),
  - `images` (A list of String),
  - `description` (String),
  - `isAuctionItem` (Boolean, defaults to false)
- `Artist`
  - `name`\* (String),
  - `nickname`\* (String),
  - `address`\* (String),
  - `memberSince`\* (Date, defaults to now)
- `Auction`
  - `artId`\* (ObjectId),
  - `minimumPrice` (Number, defaults to 1000),
  - `endDate`\* (Date),
  - `auctionWinner` (ObjectId, which should be a valid id of a customer which holds the highest bid)
- `AuctionBid`
  - `auctionId`\* (ObjectId),
  - `customerId`\* (ObjectId),
  - `price`\* (Number)
- `Customer`
  - `name`\* (String),
  - `username`\* (String),
  - `email`\* (String),
  - `address`\* (String)
