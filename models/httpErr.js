class httpErr extends Error{
    constructor(msg, code){
        //create an error with a message and assign error code to httpErr
        super(msg);
        this.errorCode = code;
    }
}

module.exports = httpErr;