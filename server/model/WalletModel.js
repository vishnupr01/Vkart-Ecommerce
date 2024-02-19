const mongoose = require('mongoose')
const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    transactions: [
        {
            amount: {
                type: Number
            },
            date: {
                type: Date,
                default: Date.now()
            },
            status:{
                type:String
            }
        }
    ]
})

const Walletdb = mongoose.model('walletdbs', walletSchema)
module.exports=Walletdb