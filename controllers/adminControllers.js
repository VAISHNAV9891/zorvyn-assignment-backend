import User from "../models/userSchema.js";
import validator from "email-validator";
import passwordValidator from "password-validator";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

//Now, user can login with this credentials
export const createUser = async(req,res) => {
    try{
        if(!req.body){
            return res.status(400).json({ message : 'Request body cannot be empty.'});
        }
        const { username,email,password,role } = req.body;
        const schema = new passwordValidator();
        schema
            .has().uppercase()
            .has().lowercase()
            .has().digits(1)
            .has().not().spaces();

        if(!username || !email || !password || !role){
            return res.status(400).json({ message : 'All data is needed to proceed with this request.'});
        }

        const allowedRoles = ['Analyst','Viewer','Admin'];

        if(!allowedRoles.includes(role)){
            return res.status(400).json({ message : 'Role provided is not a valid role.'});
        }

        if(!validator.validate(email)){
            return res.status(400).json({ message : 'Provided email is not in valid format.'});
        }
        
        if(password.length < 8 || password.length > 25){
            return res.status(400).json({ message : 'Password length must be greater than or equal to 8 and less than or equal to 25'});
        }

        if(!schema.validate(password)){
            return res.status(400).json({ message : 'Password must follow the password making rules.'});
        }

        
        if(username.length < 3 || username.length > 10){
            return res.status(400).json({ message : 'Username length must be greater than or equal to 3 and less than or equal to 10'});
        }

       const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: 'Username already taken.' });
            }
            return res.status(400).json({ message: 'This email is associated with some other account! Try using a different email.' });
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
        message: 'User account created successfully.',
        user: {
            username : user.username,
            email : user.email,
            role : user.role,
            status : user.status,
            accountSecurityStatus : user.accountSecurityStatus
        } 
        });

    }catch(error){
        if(error.name === 'CastError') return res.status(400).json({ message : 'Data is provided in invalid format.' });

        return res.status(500).json({ message : 'Internal Server Error.' , log : error.message});
    }
};

export const updateUserRole = async(req,res) => {
    try{
        const { uniqueIdentifier,role } = req.body;

        if(!uniqueIdentifier){
            return res.status(400).json({ message : 'username,email or ._id is needed to update the role.'});
        }

        const allowedRoles = ['Viewer','Admin','Analyst'];

        if(!allowedRoles.includes(role)){
            return res.status(400).json({ message : 'Error : Provided role is not available'});
        }

        const searchQuery = { $or: [{ email: uniqueIdentifier }, { username: uniqueIdentifier }] };
    
   
        if (mongoose.Types.ObjectId.isValid(uniqueIdentifier)) {
            searchQuery.$or.push({ _id: uniqueIdentifier });
        }

    
        const updatedUser = await User.findOneAndUpdate(
        searchQuery,
        { role: role },
        { returnDocument : 'after', runValidators: true } 
        );

        if(!updatedUser) res.status(404).json({ message : 'User not found.'});

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
        return res.status(500).json({ message : 'Internal Server Error.', message : error.message});
    }
};

export const updateAccountStatus = async(req,res) => {
    try{
        const { uniqueIdentifier,status } = req.body;

        if(!uniqueIdentifier){
            return res.status(400).json({ message : 'username,email or ._id is needed to update the role.'});
        }

        const allowedStatus = ['active','inactive'];
        const temp = status.toLowerCase();

        if(!allowedStatus.includes(temp)){
            return res.status(400).json({ message : 'Error : account status can only be "active" or "inactive".'});
        }

        const searchQuery = { $or: [{ email: uniqueIdentifier }, { username: uniqueIdentifier }] };
    
   
        if (mongoose.Types.ObjectId.isValid(uniqueIdentifier)) {
            searchQuery.$or.push({ _id: uniqueIdentifier });
        }

    
        const updatedUser = await User.findOneAndUpdate(
        searchQuery,
        { status : temp },
        { returnDocument : 'after', runValidators: true } 
        );

        if(!updatedUser) res.status(404).json({ message : 'User not found.'});

        res.status(200).json({
        success: true,
        message: "User account status updated successfully.",
        data: {
            id: updatedUser._id,
            username: updatedUser.username,
            status: updatedUser.status
        }
        });

    }catch(error){
        if(error.name === 'CastError') return res.status(400).json({ message : 'Data is provided in invalid format.'});
        return res.status(500).json({ message : 'Internal Server Error.', message : error.message });
    }
};