var express=require("express"),
    bodyParser=require("body-parser"),
	app=express(),
	mongoose=require("mongoose");
    methodOverride=require("method-override");
    expressSanitizer=require("express-sanitizer");
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
mongoose.set("useFindAndModify", false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/blog_app");
app.use(methodOverride("_method_"));
// mongoose model config
var blogSchema= new mongoose.Schema({
   	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
  
});
var Blog=mongoose.model("Blog",blogSchema);

 // Blog.create({
 // title:"My Desktop set up",
 // image:"https://i0.wp.com/www.techsiting.com/wp-content/uploads/2019/11/Gaming-Computer-Desk-Setup.jpg?fit=1422%2C800&ssl=1",
 // body:"Take a look babe"
 // });


//RESTFUll routes

app.get("/",function(req,res){
	
	res.redirect("/blogs");

});
//Index
app.get("/blogs",function(req,res){
	
	 Blog.find({},function(err,blogs){
		  if(err){
			  console.log("Babe its a erroe");
		  }
		 else{
			 res.render("index",{blogs:blogs});
		 }
	 });
	
});

//new

app.get("/blogs/new",function(req,res){
	
	res.render("new");
});

//Create
app.post("/blogs",function(req,res){
	 req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,nwblog){
		  if(err)
			   {
				   res.redirect("/new");
			   }
		else 
			{
				
				res.redirect("/blogs");
			}
	});
});

//show
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err)
			 {
				 res.redirect("/blogs");
			 }
		else 
			{
				res.render("show",{blog:blog});
			}
	});
	
});
//Edit
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err)
			 {
				 res.redirect("/blogs");
			 }
		else 
			{
				res.render("edit",{blog:blog});
			}
	});
	
});

 //update
app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateblog){
		  if(err)
			   {
				   res.redirect("/blogs");
			   }
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});
//delete

app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
			 {
				 res.redirect("/blogs");
			 }
		else 
			{
				res.redirect("/blogs");
			}
	});
	
});
app.listen(3000,function(){
	console.log("BlogApp Server running port : 3000 ....");
});