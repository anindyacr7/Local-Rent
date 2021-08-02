const express=require('express')
const router=express.Router()
const {campgroundSchema}=require('../schemas.js')
const ExpressError=require('../utils/ExpressError')
const catchAsync=require('../utils/catchAsync')
const Campground=require('../models/campground')
const {isLoggedin,validateCampground, isAuthor}=require("../middleware")
const campgrounds=require("../controllers/campgrounds")
const multer  = require('multer')
const {storage}=require('../cloudinary')
const upload = multer({storage})

router.get('/',catchAsync(campgrounds.index))

router.get('/new',isLoggedin,campgrounds.renderNewForm)
router.post('/',isLoggedin,upload.array('image'),validateCampground,catchAsync(campgrounds.createCamp))

router.get('/:id',catchAsync(campgrounds.showCamp))

router.get('/:id/edit',isLoggedin,isAuthor,catchAsync(campgrounds.renderEditForm))
router.put('/:id',isLoggedin,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCamp))

router.delete('/:id',isLoggedin,isAuthor,catchAsync(campgrounds.deleteCamp))

module.exports=router