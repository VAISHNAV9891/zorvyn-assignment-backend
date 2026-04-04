import mongoose, { Schema } from "mongoose";


const transactionSchema = new mongoose.Schema({
user : {type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true},
amount : {type : Number, min : [0.01,'Amount must be greater than zero.'], required : true},
type : {type : String, enum : ['income','expense'], required : true},
category : {type : String, required : true, trim : true, min : [1,'Category must be atleast of 1 length.']},
date : {type : Date, default : Date.now},
notes : {type : String, trim : true},
isDeleted : {type : Boolean, default : false}
}, { timestamps: true });

//Created a compound index for fast querying the database
transactionSchema.index({ user: 1, date: -1 });
const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;