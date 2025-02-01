class ApiError extends Error{
    constructor(statusCode,message){
        super();
        this.message=message
        this.statusCode=statusCode;
        this.success=false
    }
}

export default ApiError