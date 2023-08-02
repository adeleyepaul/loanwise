const Users = require('../model/user_notification');
const bcrypt = require("bcrypt");


const resetPasswordAndSecurityQuestion = (req, res) => {
    const { previousPassword, newPassword, confirmPassword, securityQuestions, answers } = req.body;
  
    if (!previousPassword || !newPassword || !confirmPassword || !securityQuestions || !answers) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
  
    const userId = req.params.id;
  
    const resetPasswordPromise = new Promise(async (resolve, reject) => {
        try {
            const currentUser = await Users.findOne({ _id: userId });
    
            if (!currentUser) {
            reject({ statusCode: 404, message: 'User not found' });
            }
    
            const isMatch = await bcrypt.compare(previousPassword, currentUser.password);
            if (!isMatch) {
            reject({ statusCode: 401, message: 'Previous password is invalid' });
            }
    
            if (previousPassword === newPassword) {
            reject({ statusCode: 400, message: 'New password must be different from the previous password' });
            }
    
            if (newPassword !== confirmPassword) {
            reject({ statusCode: 400, message: 'Password and confirm password do not match' });
            }
    
            const saltRounds = 15;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
            currentUser.password = hashedPassword;
            await currentUser.save();
    
            resolve('Password reset successful');
        } catch (error) {
            console.error('Error resetting password:', error);
            reject({ statusCode: 500, message: 'Failed to reset password' });
        }
    });
  
    const resetSecurityQuestionPromise = new Promise(async (resolve, reject) => {
        try {
            const currentUser = await Users.findOneAndUpdate(
            { _id: userId },
            { securityQuestions, securityQuestionAnswers: answers },
            { new: true }
            );
    
            if (!currentUser) {
            reject({ statusCode: 404, message: 'User not found' });
            }
    
            resolve('Security question reset successful');
        } catch (error) {
            console.error('Error resetting security questions:', error);
            reject({ statusCode: 500, message: 'Failed to reset security questions' });
        }
    });
  
    Promise.all([resetPasswordPromise, resetSecurityQuestionPromise])
        .then((results) => {
            return res.status(200).json({ message: 'Password and security question reset successfully' });
        })
        .catch((error) => {
            return res.status(error.statusCode || 500).json({ message: error.message || 'Failed to reset password and security questions' });
        });
};
  


exports.resetPasswordAndSecurityQuestion = resetPasswordAndSecurityQuestion;