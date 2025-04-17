import userModel from "../models/usermodel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import razorpay from "razorpay"
import transactionModel from "../models/transactionModel.js";

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: 'Missing Details'
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        const userData = {
            name,
            email,
            password: hashedpassword
        }
        const newUser = new userModel(userData)
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token, user: { name: user.name } })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}
const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            res.json({
                success: false,
                message: 'User does not exist'
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            console.log(token);
            res.json({
                success: true,
                token,
                user: { name: user.name }
            })
        }
        else {
            return res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const userCredits = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await userModel.findById(userId);

        res.json({
            success: true, credit: user.creditBalance,
            user: {
                name: user.name
            }
        })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})
const paymentRazorpay = async (req, res) => {
    try {
        const userId = req.user.id;
        const { planId } = req.body

        console.log(userId);


        const userData = await userModel.findById(userId);

        if (!userId || !planId) {
            return res.json({
                success: false,
                message: 'Missing Details'
            })
        }
        let credits, plan, amount, date

        switch(planId) {
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;

            case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50
                break;

            case 'Bussiness':
                plan = 'Bussiness'
                credits = 5000
                amount = 250
                break;
            default:
                return res.json({
                    success:false,
                    message:'plan does not exist'
                })
        }
        date=Date.now();
        const transactionData={
            userId,plan,amount,credits,date
        }
        const newTransaction=await transactionModel.create(transactionData)
        const options={
            amount:amount*100,
            currency:process.env.CURRENCY,
            receipt:newTransaction._id.toString()
        }
        await razorpayInstance.orders.create(options,(error,order)=>{
            if(error){
                console.log(error);
                return res.json({success:false,message:error})
            }
            return res.json({success:true,order})

        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,

        })
    }
}

const verifyRazorpay=async(req,res)=>{
    try {
        const {razorpay_order_id}=req.body;
        const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status==='Paid'){
            const transactionData=await transactionModel.findById(orderInfo.receipt)
            if(transactionData.payment){
                return res.json({success:false,message:'Payment Failed'})
            }
            const userData=await userModel.findById(transactionData.userId)

            const creditBalance=userData.creditBalance+transactionData.credit
            await userModel.findByIdAndUpdate(userData._id,{creditBalance})
            await transactionModel.findByIdAndUpdate(transactionData._id,{payment:true})

            res.json({success:true,message:"Credits Added"})
        }
        else{
            return res.json({success:false,message:'Payment Failed'}) 
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,

        })
    }
}

export { registerUser, LoginUser, userCredits,paymentRazorpay,verifyRazorpay }