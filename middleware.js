const {productSchema ,reviewSchema}=require('./schemas.js')
const product = require("./models/product")
const Review= require("./models/review")
const ExpressError=require('./utils/ExpressError')

module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl
        req.flash('error','Login First')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateproduct=(req,res,next)=>{
    const {error}=productSchema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next()
    }
}

module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params
    const product=await product.findById(id)
    if(!product.author.equals(req.user._id)){
        req.flash('error','You dont have permision')
        return res.redirect(`/products/${id}`)
    }
    next()
}

module.exports.validateReview =(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next()
    }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,revId}=req.params
    const review=await Review.findById(revId)
    if(!review.author.equals(req.user._id)){
        req.flash('error','You dont have permision')
        return res.redirect(`/products/${id}`)
    }
    next()
}