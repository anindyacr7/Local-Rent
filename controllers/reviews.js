const product=require('../models/product')
const Review=require('../models/review')


module.exports.submitReview=async(req,res)=>{
    const {id}=req.params
    const review=new Review(req.body)
    const product=await product.findById(id)
    review.author=req.user
    product.reviews.push(review)
    await review.save()
    await product.save()
    req.flash('success',"Review successfully submitted")
    res.redirect(`/products/${id}`)
}

module.exports.deleteReview=async(req,res)=>{
    const {id,revId}=req.params
    await product.findByIdAndUpdate(id,{$pull:{reviews:revId}})
    await Review.findByIdAndDelete(revId)
    req.flash('success',"Review successfully deleted")
    res.redirect(`/products/${id}`)
}

