const express=require('express')
const router=express.Router({mergeParams: true})
const Review=require('../models/review')
const ExpressError=require("../utils/ExpressError")
const catchAsync=require("../utils/catchAsync")
const {validateReview,isLoggedin,isReviewAuthor}=require("../middleware")

const Product=require('../models/product')
const reviews=require("../controllers/reviews")

router.post("/",isLoggedin,validateReview,catchAsync(reviews.submitReview))

router.delete("/:revId",isLoggedin,isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports=router;