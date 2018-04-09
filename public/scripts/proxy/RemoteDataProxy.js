
class RemoteDataProxy {
    constructor(){
    }

    getRemoteData(url, success, error){
	console.log(url)
        $.ajax({url: url, 
            success: function(result, xhr, status){
                success(result);
            },
            error: function(xhr,status,err){
                error(err);
            },
         });
    }

}
