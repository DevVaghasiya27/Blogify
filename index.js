const path = require('path');
const express = require('express'); 
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const Blog = require('./models/blog');      

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = 8000;

mongoose.connect("mongodb://localhost:27017/blogify").then((e) => console.log("MongoDb Connected"));  

app.set("view engine", "ejs");
app.set("views" , path.resolve("./views"));

app.use(express.urlencoded({ extended: false}))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")));

app.get("/", async(req, res) => {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    })
    console.log("============================================="+req.user)
}); 

app.use("/user", userRoute); // use the user route middleware
app.use("/blog", blogRoute); // use the blog route middleware

app.listen(PORT, ()=> console.log(`server started at http://localhost:${PORT}`));   