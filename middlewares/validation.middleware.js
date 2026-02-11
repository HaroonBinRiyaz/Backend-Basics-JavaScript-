export const validate = (schema) =>(req, res, next) =>{
    const result = schema.safeParse(req.body);
    
    if (!result.sucess){
        const errors = result.error.errors.map((err)=> ({
            field: err.path[0],
            message: err.message,

        }));
        return res.status(400).json({
            ok: false,
            errors,
        });
    }

    req.body = result.data;
    next();
}