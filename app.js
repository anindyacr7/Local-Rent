if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express=require('express')
const app=express()
const methodOverride=require('method-override')
const flash=require("connect-flash")
const mongoose=require('mongoose')
const ejsMate=require('ejs-mate')
const path=require('path')
const {productSchema,reviewSchema}=require("./schemas.js")
const session=require("express-session")
const passport=require('passport')
const LocalStrategy=require('passport-local')
const User=require("./models/user")
const mongoSanitize = require('express-mongo-sanitize');
const MongoDBStore = require('connect-mongo')(session)

const ExpressError=require("./utils/ExpressError")
const catchAsync=require("./utils/catchAsync")
const product=require('./models/product')
const Review=require("./models/review")

const productRoutes=require("./routes/product")
const reviewRoutes=require("./routes/review")
const userRoutes=require("./routes/user")
const dbUrl=process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected')
});

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize())

const secret=process.env.SECRET || 'nosecret'

const store=new MongoDBStore({
    url:dbUrl,
    secret,
    touchAfter: 24*60*60
})

store.on("error",function(e){
    console.log("SESSION STORE ERROR",e)
})

const sessionConfig={
    store:store,
    name:'session',
    secret,
    resave: false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        //secure=true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*7*24
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next()
})

app.use("/",userRoutes)
app.use('/products',productRoutes)
app.use('/products/:id/reviews',reviewRoutes)

app.get('/',(req,res)=>{
    res.render('home')
})
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err,req,res,next)=>{
    const {status=500}=err
    res.status(status).render('error',{err})
})
const port =process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`Serving on port ${port}`)
})