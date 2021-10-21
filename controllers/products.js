const product=require('../models/product')
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index=async(req,res)=>{
    const products=await product.find({})
    res.render('products/index',{products})
}

module.exports.renderNewForm=(req,res)=>{
    res.render('products/new')
}

module.exports.createprod=async(req,res,next)=>{
    const geoData=await geocoder.forwardGeocode({
        query: req.body.location,
        limit:1
    }).send()
    const prod=new product(req.body)
    prod.geometry=geoData.body.features[0].geometry
    console.log(prod.geometry)
    prod.images=req.files.map(f=>({filename:f.filename, url: f.path}))
    prod.author=req.user._id;
    await prod.save()
    req.flash('success','Successfully Added new Product')
    res.redirect(`/products/${prod._id}`)
}

module.exports.showprod=async(req,res)=>{
    const product=await product.findById(req.params.id).populate('reviews').populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author')
    if(!product)
    {
        req.flash('error','Product not exists')
        return res.redirect('/products')
    }
    res.render('products/show',{product})
}

module.exports.renderEditForm=async(req,res)=>{
    const product=await product.findById(req.params.id)
    if(!product)
    {
        req.flash('error','Product not exists')
        return res.redirect('/products')
    }
    res.render('products/edit',{product})
}

module.exports.updateprod=async(req,res)=>{
    const {id}=req.params
    const prod=await product.findByIdAndUpdate(id,req.body)
    const imgs=req.files.map(f=>({filename:f.filename, url: f.path}))
    prod.images.push(...imgs)
    await prod.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await prod.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Successfully Updated')
    res.redirect(`/products/${id}`)
}

module.exports.deleteprod=async(req,res)=>{
    await product.findByIdAndDelete(req.params.id)
    req.flash('success','Successfully Deleted Product')
    res.redirect('/products')
}