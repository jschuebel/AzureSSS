var lazyload = (function () {
    var url_to_new_content = '/api/message/lazy';
    var loading = false;//to prevent duplicate
    var holdst = 0;


    function loadNewContent(eltype) {
        $.ajax({
            type: 'GET',
            url: url_to_new_content,
            success: function (data) {
                if (data != "") {
                    loading = false;
                    switch (eltype) {
                        case 1:
                            $("#lzscroll").html(data);
                            $("#lzscroll").scrollTop(holdst);
                            break;
                        case 2:
                            angular.element($('#firstControllerID')).scope().UpdateGrid(data);
                            $("#divGrd").scrollTop(holdst);
                            angular.element($('#firstControllerID')).scope().$apply();
                            break;
                        default:
                            $("#lzscroll").html(data);
                            $("#lzscroll").scrollTop(holdst);
                            break;
                    }
                }
            }
        });
    }

    inmyscroll = function (e, eltype) {


        //$('#lzscroll').on('scroll', function() {
        //var myscroll = function (e) {
        holdst = $(e).scrollTop();
        var ih2 = $(e).innerHeight();
        var sh2 = $(e)[0].scrollHeight;

        var cb2 = holdst + ih2;

        if ($(e).scrollTop() + $(e).innerHeight() >= ($(e)[0].scrollHeight - 1)) {
            if (!loading) {
                loading = true;
                loadNewContent(eltype); //call function to load content when scroll reachs DIV bottom                
            }
        }
    }


    getTextWidth = function (text, font) {
        // re-use canvas object for better performance
        var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    }

    //expose public interface
    return {
        myscroll: inmyscroll,
        getTextWidth: getTextWidth
    }
})();