const jwt=require('jsonwebtoken');
require('dotenv').config();


exports.auth=async (req,res,next)=>{
    try{
        const token = req.cookies.token ||  req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            return res.status(400).json({
                success:false,
                message:"token not found."
            });
        }

        try{
            const decode=await jwt.verify(token,process.env.JWT_TOKEN);

            req.user=decode;
        }catch(error){
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            });
        }
        next();
    }catch(error){
        console.log(error)
        return res.status(401).json({
            success:false,
            message:"something went wrong !! while verifying token."
        })
    }
}
