const User = require("../model/User");
const PasswordReset = require("../model/passwordSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const JWT_SECRET_KEY = "JDBFEIUBndfbjfbhdbweb23urhwnr9wcj";
const nodemailer = require('nodemailer');
const moment = require('moment');
const mongoose = require("mongoose")


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: 'loanwise50@gmail.com',
        pass: 'rkhicdwjnlayqfkp',
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log('Ready for messages');
        console.log(success);
    }
});

const signup = async (req, res, next) => {
    // const {name, email, password, } = req.body;
    const {name, email, password, selectedQuestions, confirmPassword} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email: email});
    }catch (err){
        console.log(err)
    }
    if (existingUser){
        return res.status(400).json({message : "User already exists! Please login"})
    }

    const verificationCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    const expiration = moment().add(1, 'hour').toDate();

    const hashedPassword = bcrypt.hashSync(password, 15);

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        res.status(400).json({ message: 'Password and confirm password do not match' });
        return;
    }

    const user = new User({
        name,
        email,
        password: hashedPassword,
        confirmPassword,
        selectedQuestions,
        verificationCode,
        expiresAt: expiration,
    });

    try{
        await user.save();
    } catch (err){
        console.log(err)
    }

    const mailOptions = {
        from: 'loanwise50@gmail.com',
        to: email,
        subject: "Activate your Account",
        html: `<p>Your activation code for signing up is: <b>${verificationCode}</b>. Kindly note that this code is valid for <b>1 hour</b>.</p>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
    });

    return res.status(201).json({message:'A signup code has been sent to your mail.'})
}

const securityQuestions = async (req, res) => {
    const { userId } = req.params; // Assuming the user ID is passed as a URL parameter
    const { securityQuestions, answers } = req.body;
  
    try {
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user = await User.findByIdAndUpdate(
            userId,
        { securityQuestions, securityQuestionAnswers: answers }, // Update both security questions and answers
        { new: true }
      );
  
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
        return res.status(200).json({ user });
    } catch (err) {
    // Handle any errors
    console.error(err);
        return res.status(500).json({ message: 'Error updating security questions' });
    }
}

const verifySignup = async (req, res, next) => {
    try {
      const { email, verificationCode } = req.body;
      const existingUser = await User.findOne({ email });
  
      if (!existingUser) {
        return res.status(400).json({ message: "User not found" });
      }
  
      if (existingUser.verificationCode !== verificationCode) {
        return res.status(400).json({ message: "Invalid verification code" });
      }
  
      const currentTime = moment();
      if (currentTime.isAfter(existingUser.expiresAt)) {
        return res.status(400).json({ message: "Verification code has expired" });
      }
  
      existingUser.isVerified = true;
      await existingUser.save();
  
      return res.status(201).json({ 
        message: "Verification successful",
        user_id: existingUser._id // Return the user ID
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  
const professionalRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    try {
        const userRole = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        );

        if (!userRole) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(userRole);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating user role' });
    }
}

const login = async (req,res, next) => {
    const {email, password} = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({ email: email});
    }catch (err){
        return new Error(err);
    }
    if (!existingUser){
        return res.status(400).json({message: "User not found. Please signup"})
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message: 'Invalid Email/Password'});
    }
    const token = jwt.sign({id: existingUser._id},JWT_SECRET_KEY,{
        expiresIn: "35s"})

    console.log("Generated Token\n", token);

    if(req.cookies[`${existingUser._id}`]){
        req.cookies[`${existingUser._id}`] = ""
    }

    res.cookie(String(existingUser._id), token, {
        path: '/',
        expires: new Date (Date.now() + 1000 * 30),
        httpOnly: true,
        sameSite: 'lax',
    });
    
    return res.status(200).json({message: 'Successfully logged in', user:existingUser, token });
}

const verifyToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    const token = cookies ? cookies.split("=")[1] : null;
  
    if (!token) {
      return res.status(400).json({ message: "No token found" });
    }
  
    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(400).json({ message: "Invalid Token" });
      }
  
      req.id = user.id;
      next();
    });
  };
  
  const getUser = async (req, res, next) => {
    const userId = req.id;
  
    try {
      const user = await User.findById(userId, "-password");
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      return res.status(200).json({ user });
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
const refreshToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    const token = cookies.split("=")[1];
    if(!prevToken){
        return res.status(400).json({message: "Could not find token"});
    }
    jwt.verify(String(prevToken), JWT_SECRET_KEY, (err, user) => {
        if (err){
            console.log(err);
            return res.status(403).json({message: 'Authentication Failed'});
        }
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = "";

        const token = jwt.sign({id: user.id}, JWT_SECRET_KEY, {
            expiresIn: "35s"
        })

        console.log("Generated Token\n", token);

        res.cookie(String(user.id), token, {
            path: '/',
            expires: new Date (Date.now() + 1000 * 30), //30 seconds
            httpOnly: true,
            sameSite: 'lax',
        });

        req.id = user.id;
        next();
    })
}

const forgetPassword = async (req,res, next) => {
    const {email} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email })
    } catch (error) {
        console.log(error)
    }
    if (!existingUser){
        return res.status(400).json({message: "User not found. Please signup"})
    }

    const recoveryCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const expirations = moment().add(1, 'hour').toDate();
    const passwordReset = new PasswordReset({
        email,
        recoveryCode,
        expiresAt: expirations,
    });

    passwordReset.save()
    .then(() => {
        console.log('Forget password details saved');
    })
    .catch(err => {
        console.error('Error saving forget password details:', err);
    });


    const mailOptions = {
        from: 'loanwise50@gmail.com',
        to: email,
        subject: "Password Recovery Code",
        html: `<p>Your password recovery code is: <b>${recoveryCode}</b>. Kindly note that this code is valid for <b>1 hour</b>.</P>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
    });
      

    res.json({ message: 'Password recovery code sent' })
}


const recoveryAccount = async (req, res, next) => {
    const { email, recoveryCode } = req.body;
  
    try {
      const existingUser = await PasswordReset.findOne({ email: email });
  
      if (!existingUser) {
        return res.status(400).json({ message: "User not found" });
      }
  
      if (existingUser.recoveryCode !== recoveryCode) {
        return res.status(400).json({ message: "Invalid recovery code" });
      }
  
      const currentTime = moment();
      if (currentTime.isAfter(existingUser.expiresAt)) {
        return res.status(400).json({ message: "Recovery code has expired" });
      }
  
      
      existingUser.isVerified = true;
      await existingUser.save();
  
      return res.status(201).json({ message: "Recovery Account successful" });

    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
};



const resetPassword = async (req, res) => {
    const { recoveryCode, newPassword, confirmPassword } = req.body;
  
    const passwordReset = await PasswordReset.findOne({
        recoveryCode,
        expiresAt: { $gt: new Date() },
    });
  
    if (!passwordReset) {
        return res.status(400).json({ message: 'Invalid or expired recovery code' });
    }

    const existingUser = await User.findOne({ email: passwordReset.email });
  
    if (!existingUser) {
        return res.status(400).json({ message: 'User not found' });
    }

    if (newPassword === existingUser.password) {
        return res.status(400).json({ message: 'New password must be different from the old password' });
    }

    if (newPassword !== confirmPassword) {
        res.status(400).json({ message: 'Password and confirm password do not match' });
        return;
    }
  

    existingUser.password = newPassword;
  
    try {
        await existingUser.save();
    

        await PasswordReset.deleteOne({ _id: passwordReset._id });


        const isPasswordCorrect = (newPassword, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid Email/Password' });
        }

        const token = jwt.sign({ id: existingUser._id }, JWT_SECRET_KEY, { expiresIn: '35s' });

        console.log('Generated Token\n', token);

        if (req.cookies[`${existingUser._id}`]) {
            req.cookies[`${existingUser._id}`] = '';
        }

        res.cookie(String(existingUser._id), token, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 30),
            httpOnly: true,
            sameSite: 'lax',
        });
      
        return res.status(200).json({ message: 'Password reset successful and user logged in', existingUser, token });


    } catch (error) {
      console.error('Error resetting password:', error);
      return res.status(500).json({ message: 'Failed to reset password' });
    }
};
  



exports.signup =signup;
exports.verifySignup = verifySignup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
exports.forgetPassword = forgetPassword;
exports.recoveryAccount = recoveryAccount;
exports.resetPassword = resetPassword;
exports.securityQuestions = securityQuestions;
exports.professionalRole = professionalRole;
