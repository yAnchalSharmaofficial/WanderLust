const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js")

const listingSchema = new Schema ({
    title:{
        type: String,
        required: true,
    },
    description: String,
    image:{
        type: String,
        default: "https://static.vecteezy.com/system/resources/thumbnails/012/508/173/small/paradise-island-beach-tropical-landscape-of-summer-scenic-sea-sand-sky-with-palm-trees-luxury-travel-vacation-destination-exotic-beach-landscape-amazing-nature-relax-freedom-nature-template-photo.jpg",
        set : (v) => v === "" ? "https://static.vecteezy.com/system/resources/thumbnails/012/508/173/small/paradise-island-beach-tropical-landscape-of-summer-scenic-sea-sand-sky-with-palm-trees-luxury-travel-vacation-destination-exotic-beach-landscape-amazing-nature-relax-freedom-nature-template-photo.jpg" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews}})
    }
});

const Listing = mongoose.model("Listings",listingSchema);
module.exports = Listing;