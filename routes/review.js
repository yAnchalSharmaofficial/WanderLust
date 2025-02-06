const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");
const { validateReview,isLoggedIn ,isReviewAuthor }=require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// Post Reviews Route
router.post("/",isLoggedIn,validateReview,(reviewController.createReview));

// Delete Reviews Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;