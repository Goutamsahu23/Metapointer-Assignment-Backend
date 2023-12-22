const Transaction = require('../models/transactionModel');
const User=require('../models/userModel');

exports.userTransaction = async (req, res) => {
    try {
        const userId = req.user._id;


        const userWithTransactions = await User.findById(userId).populate('transactions').exec();

        res.status(200).json({
            success: true,
            transactions: userWithTransactions.transactions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
};

exports.userDetails=async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        res.status(200).json({
            success: true,
            amount: user.amount,
            name:user.name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
}
