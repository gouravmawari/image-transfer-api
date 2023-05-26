const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userschema = new mongoose.Schema({
    username : {
        type : String,
        require : true
    },
    password : {
        type: String,
        require : true
    },
    image :{
        name : {    
            type :String,
        },
        path :{
            type:String
        }
    }
});


userschema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

userschema.statics.receive = async function(username,password){
    const user = await this.findOne({username})
    if(user){
        const ismatch = await bcrypt.compare(password,user.password);
        if(ismatch){
            return user
        }
        else{
            return{"error":"incorrect password"}
        }
    }
    else{
        return{"error":"incorrec password"}
    }
}

const User = mongoose.model("yo",userschema);
module.exports = User;