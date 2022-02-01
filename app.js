const express=require("express")
const bodyParser=require('body-parser')
const path=require('path')
const ejs=require('ejs')
const app=express();
const User=require("./modals/user")
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname,'public')))
app.set('views', path.join(__dirname, '/views'));
app.set('view engine','ejs')

app.get('/',(req,res)=>{
  res.render("home")
})
app.get('/addmember',(req,res)=>{
  res.render('addmember')
})
app.post('/addmember',(req,res)=>{
  User.findOne({contact:req.body.contact},(err,foundUser)=>{
  if(!err){
    if(foundUser)
      res.send("User with this contact no already exists.Try Again")
  else {
    const newUser=new User({
      name:req.body.name,
      email:req.body.email,
      contact:req.body.contact
    })
    newUser.save((error)=>{
      if(error){
        res.send('Unable to add the user please check the credentials again')
      }
      else {
        res.send("User added successfully")
      }
    })
  }
  }
  else {
    res.send(toString(err))
  }
  })
})
app.get("/list",(req,res)=>{
  User.find({},(err,foundUsers)=>{
    if(!err)
    {
      if(foundUsers)
        res.render('list',{"usersArray":foundUsers})
    }
    else{
      res.error
    }
  })
})
app.post('/edit/:uid',(req,res)=>{
  const id=req.params.uid
  User.findOne({contact:req.body.contact,_id: { $ne: id }},(error,foundUser)=>{
  if(!error){
    if(foundUser){
      res.write("User with this contact no already exists.Try Again")
      res.write("<h3>Go to home</h3>")
      res.write("<button><a href='/'>Home</a></button>")
      res.send()
    }
    else{
      User.findOne({_id:id},(err,fu)=>{
        if(!err){
          if(fu){
            fu.name=req.body.name,
            fu.contact=req.body.contact,
            fu.email=req.body.email
            fu.save((err)=>{
              if(!err)
                res.redirect("/list")
            })
          }
        }
        else{
          res.send("User doesnot exist")
        }
      })
    }
  }})
})
app.get('/edit/:uid',(req,res)=>{
  const id=req.params.uid
  User.findOne({_id:id},(err,fu)=>{
    if(!err){
      if(fu)
       res.render("edit",{"user":fu})
    }
    else{
      res.send("User doesnot exist")
    }
  })
})
app.get('/delete/:uid',(req,res)=>{
  const id=req.params.uid

    User.deleteOne({_id:id},(err)=>{
       if(!err)
         res.redirect("/list")
     })
  })
app.listen(3000,()=>{
  console.log("server started on port 3000");
})
