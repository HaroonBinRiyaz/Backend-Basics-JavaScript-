/* utils are meant to store helper functions/ repitative functions/code. Here for example,
writing async contoller function could in update or delete could lead to DB crash, if error happens,
hence we normally wrap them in try catch block, however doing that with every controller function is
repitative, hence a universal function needs to be set that would address all of them */

// const asyncHandler = (fn)=>{
//     return async (req, res, next) =>{
//         try{
//             await fn(req, res, next) 
//         }catch(error){
//             next(error);
//         }
//     };
// };

const asyncHandler = (fn)=> (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
}

export {asyncHandler};