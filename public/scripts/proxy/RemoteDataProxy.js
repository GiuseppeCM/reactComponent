
class RemoteDataProxy {
    constructor(){
    }

    getRemoteData(options, success, error){
        $.post(options.url, options.polygon.data )
        .done(function( data ) {
          success(data);
        })
        .fail(function( err ) {
            error(err);
        })
    }

}