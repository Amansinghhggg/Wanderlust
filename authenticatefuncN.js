const Listing = require("./MODELS/listing");
const Review = require("./MODELS/review");
const { listingSchema, reviewSchema } = require('./validationschema');
const ExpressError = require('./utils/ExpressError');

module.exports.isloggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        console.log('Saving redirect URL:', req.originalUrl);
        req.flash("error","You Must Be Logged In First")
        return res.redirect("/login")
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log('Restored redirect URL:', res.locals.redirectUrl);
    }
    next();
}
module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You Are Not The Owner Of This Listing!")
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You Are Not The Author Of This review!")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//validateListing 
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  }
  next();
};
//validate review
module.exports.validatereview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body.review);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  }
  next();
};