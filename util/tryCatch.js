const tryCatch = (fController) => async (req, res, next) => {
    try{
        await fController(req, res);
    } catch(err){
        return next(err);        
    }
}

module.exports = tryCatch