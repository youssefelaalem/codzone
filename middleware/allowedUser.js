const appError = require("../utils/appError")

module.exports=(...roles)=>{//spread operator
    console.log('roles prameters',roles);
    //roles=['ADMIN','MANAGER']
    return (req,res,next)=>{
    console.log('req.currentUserToken.role',req.currentUserToken.role);
        if(!roles.includes(req.currentUserToken.role)){

            return next(appError.create("invaled role to do this action",401))
        }
       next()
    }

}