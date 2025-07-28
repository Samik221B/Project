const express=require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviews.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");
const Listing = require("../models/listing.js");


//POST reviews
router.post("/", validateReview, isLoggedIn, wrapAsync(async (req,res)=>{
    console.log("DEBUG req.params:", req.params);  // should be { id: '...' }
    const { id } = req.params;
    let listing = await Listing.findById(id);
    console.log("DEBUG listing:", listing);       // should not be null
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);  
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}));

  
// Delete review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;