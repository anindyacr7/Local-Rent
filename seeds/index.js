const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author:'607ec4c2a17bb336585723dc',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry:{
                type:'Point',
                coordinates:[
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images:[
                {
                    filename: 'YelpCamp/mhxr6fvcoapgyrpjgwxg',
                    url: 'https://res.cloudinary.com/dobys3kkb/image/upload/v1619016246/YelpCamp/mhxr6fvcoapgyrpjgwxg.jpg'
                  },
                  {
                    filename: 'YelpCamp/jzl74dhzuw68jwr2jnfv',
                    url: 'https://res.cloudinary.com/dobys3kkb/image/upload/v1619016244/YelpCamp/jzl74dhzuw68jwr2jnfv.jpg'
                  }
                
            ],
            description:' ok vro',
            price: Math.floor(Math.random()*20)+10
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})