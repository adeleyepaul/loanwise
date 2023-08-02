const Users = require("../model/user_notification");


const getNotification = async (req, res) => {
    try {
        const user = await Users.findOne({_id: req.params.id})
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } 

        return res.json({
            newApplications: user.newApplications,
            loanRepayments: user.loanRepayments,
            dueDates: user.dueDates,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const updateNotification = async (req, res) => {

    try {
        const { newApplications, loanRepayments, dueDates } = req.body;
        const updatedUser = await Users.findOneAndUpdate(
            {_id: req.params.id},
            {
                newApplications: {
                    inAppNotification: newApplications?.inAppNotification || false,
                    emailNotification: newApplications?.emailNotification || false,
                },
                loanRepayments: {
                    inAppNotification: loanRepayments?.inAppNotification || false,
                    emailNotification: loanRepayments?.emailNotification || false,
                },
                dueDates: {
                    inAppNotification: dueDates?.inAppNotification || false,
                    emailNotification: dueDates?.emailNotification || false,
                },
            },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(400).json({ message: 'User not found' });
        }
        return res.json({ message: 'Notification settings updated successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



exports.getNotification = getNotification;
exports.updateNotification = updateNotification;