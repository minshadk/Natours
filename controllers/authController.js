const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
// Create user
exports.signup = async(req,res,next) => {
    const newUser =await User.create(req.body)

    res.status(201).json({
        status:"success",
        data: {
            user:newUser
        }
    })
}