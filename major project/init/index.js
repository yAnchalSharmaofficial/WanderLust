const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
// console.log(initData);

const MONGOURL = 'mongodb://127.0.0.1:27017/wanderLust';

main().then(()=> {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGOURL);
}

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner:"66d7ae318b57ddff7ed3c67c",}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");    
};

initDB();
