const express=require('express')
const router=express.Router()
const {productSchema}=require('../schemas.js')
const ExpressError=require('../utils/ExpressError')
const catchAsync=require('../utils/catchAsync')
const product=require('../models/product')
const {isLoggedin,validateproduct, isAuthor}=require("../middleware")
const products=require("../controllers/products")
const multer  = require('multer')
const {storage}=require('../cloudinary')
const upload = multer({storage})

router.get('/',catchAsync(products.index))

router.get('/new',isLoggedin,products.renderNewForm)
router.post('/',isLoggedin,upload.array('image'),validateproduct,catchAsync(products.createCamp))

router.get('/:id',catchAsync(products.showCamp))

router.get('/:id/edit',isLoggedin,isAuthor,catchAsync(products.renderEditForm))
router.put('/:id',isLoggedin,isAuthor,upload.array('image'),validateproduct,catchAsync(products.updateCamp))

router.delete('/:id',isLoggedin,isAuthor,catchAsync(products.deleteCamp))

module.exports=router