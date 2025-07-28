const mongoose = require("mongoose");
const Review=require("./reviews.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  coordinates:{
    latitude:Number,
    longitude:Number,
  },
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review",
  }],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  }
});

listingSchema.post("findOneAndDelete", async(lisitng)=>{
  if(lisitng){
  await Review.deleteMany({_id: {$in:lisitng.reviews}})
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;