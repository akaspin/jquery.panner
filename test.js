$("document").ready(function() {
    // Create some content to testing. 
    var $container = $('#pan_container');
    
    var $contents = $('<div>');
    var toAdd = ""
    for ( var i = 1; i < 10; i++) {
        var $chunk = $('<div>').addClass('pan_item')
                .append($('<img>').attr('src', 'images/'+i+".jpg"));
        $chunk.appendTo($contents);
    }
    $('#pan_container').append($contents.html()).panner();
});