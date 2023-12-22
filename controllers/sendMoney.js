const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');

exports.sendMoney = async (req, res) => {
    try {
        const { phoneNum, amount } = req.body;

        const sender = await User.findById(req.user._id);
        if (!phoneNum || !amount || !sender) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in the required data.',
            });
        }

        const recipient = await User.findOne({ phoneNum });
        if (!recipient) {
            return res.status(400).json({
                success: false,
                message: 'Recipient does not exist.',
            });
        }

        if (sender.amount < amount) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient balance.',
            });
        }

        if (amount % 500 === 0) {
            const giveCoupon = Math.random() < 0.5;
            const cashback = giveCoupon ? 'Coupon' : 0;

            const updatedSender = await User.findByIdAndUpdate(sender._id, {
                $set: { amount: sender.amount - amount },
            });

            const updatedRecipient = await User.findByIdAndUpdate(recipient._id, {
                $set: { amount: recipient.amount + parseFloat(amount) },
            });

            return res.status(200).json({
                success: true,
                message: 'Money sent successfully.',
                cashback: cashback,
                updatedSender: { ...updatedSender._doc, amount: updatedSender.amount - amount },
                updatedRecipient: { ...updatedRecipient._doc, amount: updatedRecipient.amount },
            });
        }

        const updatedSenderBalance = sender.amount - parseFloat(amount);
        const updatedRecipientBalance = recipient.amount + parseFloat(amount);

        let cashback = 0;
        if (amount < 1000) {
            cashback = 0.05 * amount;
        } else {
            cashback = 0.02 * amount;
        }

        

        const transaction = new Transaction({
            from: sender.phoneNum,
            to: recipient.phoneNum,
            amount: amount,
            cashback: cashback,
            user: sender._id,
        });

        await transaction.save();

        const updatedSender = await User.findByIdAndUpdate(sender._id, {
            $set: { amount: updatedSenderBalance + cashback },
            $push: { transactions: transaction._id },
        },
            { new: true }
        );

        const updatedRecipient = await User.findOneAndUpdate(
            { phoneNum: phoneNum },
            { $set: { amount: parseFloat(updatedRecipientBalance) } },
            { new: true }
        );


        res.status(200).json({
            success: true,
            message: 'Money sent successfully.',
            cashback: cashback,
            updatedSender: { ...updatedSender._doc, amount: updatedSenderBalance + cashback },
            updatedRecipient: { ...updatedRecipient._doc, amount: updatedRecipientBalance },
            transaction
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
};
