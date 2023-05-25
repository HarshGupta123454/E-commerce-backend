class customErrorHandler extends Error{
    constructor(status,message){
        super()
        this.message=message,
        this.status=status
    }
    static alreadyExist(message){
        return new customErrorHandler(409,message)
    }
    static wrontCredential(message="wrong email and password"){
        return new customErrorHandler(401,message)
    }
    static unauthorised(meaasge="unauthorised user"){
        return new customErrorHandler(401,meaasge)
    }
    static notFound(meaasge="user not found"){
    return new customErrorHandler(404,meaasge)
    }
    static unAuthorized(message = 'unAuthorized') {
        return new customErrorHandler(401, message);
    }
}

export default customErrorHandler