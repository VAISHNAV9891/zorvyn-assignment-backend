import User from "../models/userSchema.js";
import validator from "email-validator";
import passwordValidator from "password-validator";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

//Now, user can login with this credentials
export const createUser = async(req,res) => {
    try{
        if(!req.body){
            return res.status(400).json({ success: false,message : 'Request body cannot be empty.'});
        }
        const { username,email,password,role } = req.body;
        const schema = new passwordValidator();
        schema
            .has().uppercase()
            .has().lowercase()
            .has().digits(1)
            .has().not().spaces();

        if(!username || !email || !password || !role){
            return res.status(400).json({ success: false,message : 'All data is needed to proceed with this request.'});
        }

        const allowedRoles = ['Analyst','Viewer','Admin'];

        if(!allowedRoles.includes(role)){
            return res.status(400).json({ success: false,message : 'Role provided is not a valid role.'});
        }

        if(!validator.validate(email)){
            return res.status(400).json({ success: false,message : 'Provided email is not in valid format.'});
        }
        

        if(!schema.validate(password)){
            return res.status(400).json({ success: false,message : 'Password must follow the password making rules.'});
        }

        
        if(username.length < 3 || username.length > 10){
            return res.status(400).json({success: false, message : 'Username length must be greater than or equal to 3 and less than or equal to 10'});
        }

       const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({success: false, message: 'Username already taken.' });
            }
            return res.status(400).json({success: false, message: 'This email is associated with some other account! Try using a different email.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role
        });
        

        return res.status(201).json({
        success : true,
        message: 'User account created successfully.',
        user: {
            username : user.username,
            email : user.email,
            role : user.role,
            status : user.status,
            accountSecurityStatus : user.accountSecurityStatus,
            userId : user._id
        } 
        });

    }catch(error){
        if(error.name === 'CastError') return res.status(400).json({ success: false,message : 'Data is provided in invalid format.' });
        return res.status(500).json({ success: false,message : 'Internal Server Error.', error : error.message});
    }
};

export const updateUserRole = async(req,res) => {
    try{
        if(!req.body){
            return res.status(400).json({ success: false,message : 'Request body cannot be empty.'});
        }
        const { uniqueIdentifier,role } = req.body;

        if(!uniqueIdentifier){
            return res.status(400).json({ success: false,message : 'username,email or ._id is needed to update the role.'});
        }
        if(!isNaN(role)){
            return res.status(400).json({ success: false, message : 'Role cannot be a number.'});
        }

        

        const allowedRoles = ['Viewer','Admin','Analyst'];

        if(!allowedRoles.includes(role)){
            return res.status(400).json({ success: false,message : 'Error : Provided role is not available'});
        }

        const searchQuery = { $or: [{ email: uniqueIdentifier }, { username: uniqueIdentifier }], isDeleted : false };
    
   
        if (mongoose.Types.ObjectId.isValid(uniqueIdentifier)) {
            searchQuery.$or.push({ _id: uniqueIdentifier });
        }

    
        const updatedUser = await User.findOneAndUpdate(
        searchQuery,
        { role: role },
        { returnDocument : 'after', runValidators: true } 
        );

        if(!updatedUser) res.status(404).json({ success: false,message : 'User not found.'});

        return res.status(200).json({
        success: true,
        message: "User role updated successfully.",
        data: {
            id: updatedUser._id,
            username: updatedUser.username,
            role: updatedUser.role
        }
        });

    }catch(error){
        if(error.name === 'CastError') return res.status(400).json({success: false, message : 'Data is provided in invalid format.'});
        return res.status(500).json({ success: false,message : 'Internal Server Error.', log : error.message});
    }
};

export const updateAccountStatus = async(req,res) => {
    try{
        if(!req.body){
            return res.status(400).json({ success: false,message : 'Request body cannot be empty.'});
        }
        
        const { uniqueIdentifier,status } = req.body;
        if(!status){
            return res.status(400).json({ success: false, message : 'Give a valid status value to perform this action.'});
        }
        if(!uniqueIdentifier){
            return res.status(400).json({ success: false, message : 'username,email or ._id is needed to update the role.'});
        }

        if(!isNaN(status)){
            return res.status(400).json({ success: false, message : 'Status cannot be a number.'});
        }

        const allowedStatus = ['active','inactive'];
        const temp = status.toLowerCase();

        if(!allowedStatus.includes(temp)){
            return res.status(400).json({ success: false,message : 'Error : account status can only be "active" or "inactive".'});
        }

        const searchQuery = { $or: [{ email: uniqueIdentifier }, { username: uniqueIdentifier }], isDeleted : false };
    
   
        if (mongoose.Types.ObjectId.isValid(uniqueIdentifier)) {
            searchQuery.$or.push({ _id: uniqueIdentifier });
        }

    
        const updatedUser = await User.findOneAndUpdate(
        searchQuery,
        { status : temp },
        { returnDocument : 'after', runValidators: true } 
        );

        if(!updatedUser) return res.status(404).json({ success: false,message : 'User not found.'});

        return res.status(200).json({
        success: true,
        message: "User account status updated successfully.",
        data: {
            id: updatedUser._id,
            username: updatedUser.username,
            status: updatedUser.status
        }
        });

    }catch(error){
        if(error.name === 'CastError') return res.status(400).json({ success: false,message : 'Data is provided in invalid format.'});
        return res.status(500).json({ success: false,message : 'Internal Server Error.'});
    }
};

export const deleteUserAccount = async(req,res) => {
    try{
        const userId = req.params.id;

        const user = await User.findOne({_id : userId, isDeleted : false});

        if(!user) return res.status(404).json({success: false, message : 'User Not found'});
        
        user.isDeleted = true;
        await user.save();

        return res.status(200).json({success : true, message : 'User deleted successfully.'});
    }catch(error){
        if(error.name === 'CastError') return res.status(400).json({success: false, message : 'Data is provided in invalid format.'});
        return res.status(500).json({success: false, message : 'Internal Server Error.'});
    }
};

export const getAllUsers = async(req,res) => {
    try{
        //Implemented cursor based pagination to reduce load on the client side browser(using this we'll prevent server from crashing on user's browser)
        const cursor = req.query.cursor;
        const limit  = parseInt(req.query.limit) || 10;
        const filter = {};
        //Get the users in the increasing order of their created timestamp (assigned by mongoDB by default)
        if(cursor){
           filter._id = { $gt : cursor };
        }

        const users  = await User.find(filter).sort({ _id : 1 }).limit(limit+1);
        const nextCursor = (users.length === limit+1)? users[users.length-2]._id : null;

        if(users.length === limit + 1){
            users.pop();
        }

        return res.status(200).json({ success : true, message : 'All users fetched successfully.', users, nextCursor  });
    }catch(error){
        if(error.name === 'CastError') return res.status(400).json({ success : false, message : 'Data is provided in invalid format.' });
        return res.status(500).json({ success : false, message : 'Internal Server Error' });
    }
};