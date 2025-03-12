class resSuccess {
    constructor(statuscode, message, result){
        this.success = true;
        this.statuscode = statuscode;        
        this.code = statuscode;
        this.message = message;
        this.result = result;
    }

    response()
    {
        const resp = {
            success: this.success,
            code: this.code,
            message: this.message,
            result: this.result || {}        
        }
        return resp;
    }
}

module.exports =  resSuccess;
