const mongoose=require('mongoose')
const Review=require("./review.js")
const Schema=mongoose.Schema

const imageSchema=new Schema({
    url:String,
    filename:String
})

const opts={toJSON:{virtuals:true}}

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload','/upload/w_150')
})
const productSchema=new Schema({
    title: String,
    images:[imageSchema],
    price: Number,
    description: String,
    location: String,
    author:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
},opts)

productSchema.virtual('properties.popUpMarkUp').get(function () {
    return `
    <strong><a href="/products/${this._id}">${this.title}</a></strong>`
})

productSchema.post('findOneAndDelete',async function(doc){
    if(doc)
    {
        await Review.deleteMany({_id:{$in: doc.reviews}})
    }
})
module.exports=mongoose.model('product',productSchema)