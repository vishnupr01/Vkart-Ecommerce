const coupon=require('../model/CouponModel')

module.exports ={
 
    findingCoupon:async(_req,res)=>{
      try {
        let currentDate=Date.now()
       await coupon.updateMany({ expiryDate: { $gte:currentDate} },{$set:{status:true}})
       await coupon.updateMany({ expiryDate: { $lte:currentDate} },{$set:{status:false}})
        
       
      const result=  await coupon.find()
      
      return result
  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).send({ message: 'Some error occurred' });
    
  }
  
  

   
  },
  singleCoupon:async(couponId,req,res)=>{   
      try {
      
        var result = await coupon.findOne({ _id: couponId});
        return result
        
      } catch (error) {
        console.error('Error in createUser:', error);
        res.status(500).send({ message: 'Some error occurred' });
        
      }
     
    
    }
  

  
}