const errorHandler = (err, req, res, next)=>{
    //JSON ERROR
    if(err instanceof SyntaxError && err.status === 400 && "body" in err ){
        return res.status(400).json({ok: false, message: "invalid JSON"});
    }
    //Invalid MONGO Object Id
    if (err.name === "CastError"){
        return res.status(400).json({
            ok: false,
            messsage: "Inavlid Id format"
        })
    }
    //Duplicate key (unique fields like email)
    if(err.code === 11000){
        const field= Object.keys(err.keyValue)[0];
        return res.status(400).json({
            ok: false,
            message: `${field} already exists`
        })
    }

    //fallback
    console.error(err); //generic error
    return res.status(500).json({ok: false, message: "internal Server Error"});
}

export {errorHandler};