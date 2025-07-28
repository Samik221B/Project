const Listing = require("../models/listing.js");

//Index Route controller
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    console.log("Current User:", req.user);
    res.render("listings/index.ejs", { allListings });
}

//New Route controller
module.exports.renderNewForm=(req, res) => { 
  res.render("listings/new.ejs");
}

//Show Route controller
module.exports.show=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
        path:"author"
      },
    })
    .populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}

//Create Route controller
module.exports.createListing=async(req, res,next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"..",filename);
    const newListing = new Listing(req.body.listing);
  
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.coordinates={
      latitude:req.body.listing.latitude,
      longitude:req.body.listing.longitude,
    }
    await newListing.save();
    req.flash("success", "New Lisitng Created!");
    res.redirect("/listings");
}

//Edit route Controller
module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    let originalImgUrl=listing.image.url;
    originalImgUrl=originalImgUrl.replace("/upload","/upload/h_300,w_400");
    res.render("listings/edit.ejs", { listing , originalImgUrl});
}

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    // Update coordinates
    listing.coordinates={
      latitude:req.body.listing.latitude,
      longitude:req.body.listing.longitude,
    }
    
    if(typeof req.file !== "undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
    }
    
    await listing.save();
    req.flash("success","Listing was updated!");
    res.redirect(`/listings/${id}`);

}

module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Lisitng Deleted!");
    res.redirect("/listings");
}