const Campground=require('../models/campground')
const Review=require('../models/review')


module.exports.submitReview=async(req,res)=>{
    const {id}=req.params
    const review=new Review(req.body)
    const campground=await Campground.findById(id)
    review.author=req.user
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success',"Review successfully submitted")
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteReview=async(req,res)=>{
    const {id,revId}=req.params
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:revId}})
    await Review.findByIdAndDelete(revId)
    req.flash('success',"Review successfully deleted")
    res.redirect(`/campgrounds/${id}`)
}

