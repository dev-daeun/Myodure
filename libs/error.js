class LocalError extends Error {
    contructor(status, message){
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = status;
        this.message = message;
    }
}

module.exports = LocalError;