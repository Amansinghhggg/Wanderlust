const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapasync');
const Listing = require('../MODELS/listing');
const {isloggedIn,isOwner,validateListing} = require('../authenticatefuncN')

// Routes For Listings
// Index
router.get('/',wrapAsync(async (req, res, next) => {
    const listings = await Listing.find({}).populate('reviews');
    res.render('index', { listings });
  }));

// New listing Form
router.get('/new',isloggedIn, wrapAsync(async (req, res) => {
  res.render('newlisting');
}));

// Create listing
router.post('/',isloggedIn, validateListing, wrapAsync(async (req, res,next) => {
  const listing = new Listing(req.body);
  listing.owner = req.user._id;
  await listing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect(`/listings`); // or res.redirect('/listings');
}));

// Edit listing Form

router.get('/:id/edit',isloggedIn,isOwner, wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
   if (!listing){
      req.flash('error', 'Listing Does Not Exist!');
      return res.redirect('/listings');
    }
  res.render('editlisting', { listing });
}));

// Show one listing

router.get('/:id', wrapAsync(async (req, res, next) => {
  const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:'reviews', populate:{path: 'author'}}).populate("owner");
    if (!listing){
      req.flash('error', 'Listing Does Not Exist!');
      return res.redirect('/listings');
    }
    console.log(listing);
    res.render('showlisting', { listing });
}));

// Update listing

router.put('/:id',isloggedIn, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
     if (!listing){
      req.flash('error', 'Listing Does Not Exist!');
      return res.redirect('/listings');
    };
    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${listing._id}`);
  }));

// Deletelisting
router.delete('/:id',isloggedIn,isOwner,wrapAsync(async (req, res, next) => {
   const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the listing!');
    res.redirect('/listings');
  }));
  

  module.exports = router;