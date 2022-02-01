require('dotenv').config();
const mongoose=require("mongoose")

mongoose.connect(process.env.MONGOOSE_CONNECTION_URL, {  useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Database connected!"))
.catch(error => console.log(error));

const userSchema=new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true},
  contact:{type:Number,required:true}
})
// const User=mongoose.model('User',userSchema)
module.exports=mongoose.model("User",userSchema);
