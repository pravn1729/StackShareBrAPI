exports.httpResponse = function(success, code, message, results){
    var response = {};
    response.success = success;
    response.code   = code;
    response.message = message;
    if(results instanceof Array) {
        response.results = results;
    }else if(results instanceof Object) {
        response.results = [results];
    }

    return response;
}