import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    username : {type : String, required : true, unique : true, trim : true},
    email : {type : String, required : true, unique : true, trim : true},
    password : {type : String, minLength : 8, select : false},
    role : {type : String, enum : ['Viewer','Admin','Analyst'], default : 'Viewer'},
    isDeleted : {type : Boolean, default : false},
    googleId : {type : String, default : null},
    isVerified : {type : Boolean, default : false},
    twoFactorType : {type : String, enum : ['APP','EMAIL','NONE'], default : 'NONE'},
    twoFactorSecret : {type : String, select : false, default : null},
    isTwoFactorEnabled : {type : Boolean, select : false, default : false},
    accountSecurityStatus : {type : String, enum : ['ACTIVE','FREEZE'], default : 'ACTIVE'},
    status: { type : String, enum : ['active','inactive'], default : 'active'}
},
{timestamps : true}
);


//Mongoose queries middleware
userSchema.pre(/^find/, function () {
  if (!this.getOptions().bypassSoftDelete) {
    
    this.where({ isDeleted: { $ne: true } }); 
  }
});


const User = mongoose.model('User',userSchema);

export default User;