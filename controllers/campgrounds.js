const Campground=require('../models/campground')
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index=async(req,res)=>{
    const campgrounds=await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/new')
}

module.exports.createCamp=async(req,res,next)=>{
    const geoData=await geocoder.forwardGeocode({
        query: req.body.location,
        limit:1
    }).send()
    const camp=new Campground(req.body)
    camp.geometry=geoData.body.features[0].geometry
    console.log(camp.geometry)
    camp.images=req.files.map(f=>({filename:f.filename, url: f.path}))
    camp.author=req.user._id;
    await camp.save()
    req.flash('success','Successfully Added new Product')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.showCamp=async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate('reviews').populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author')
    if(!campground)
    {
        req.flash('error','Product not exists')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}

module.exports.renderEditForm=async(req,res)=>{
    const campground=await Campground.findById(req.params.id)
    if(!campground)
    {
        req.flash('error','Product not exists')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground})
}

module.exports.updateCamp=async(req,res)=>{
    const {id}=req.params
    const camp=await Campground.findByIdAndUpdate(id,req.body)
    const imgs=req.files.map(f=>({filename:f.filename, url: f.path}))
    camp.images.push(...imgs)
    await camp.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Successfully Updated')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCamp=async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id)
    req.flash('success','Successfully Deleted Product')
    res.redirect('/campgrounds')
}