
class MenuProxy {
    constructor(options){
        this.url = options.url; 
    }

    getMenuJsonData(success, error){
        $.ajax({url: this.url, 
            success: function(result, xhr, status){
                success(result);
            },
            error: function(xhr,status,err){
                error(err);
            },
         });
    }

}

