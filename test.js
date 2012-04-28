$("document").ready(function() {
    // Create some content to testing. 
    var $containers = $('.container');
    
    var $contents = $('<div>');
    var toAdd = ""
    for ( var i = 1; i < 10; i++) {
        var $chunk = $('<div>').addClass('pan_item')
                .append($('<img>').attr('src', 'images/'+i+".jpg"));
        $chunk.appendTo($contents);
    }
    $containers.append($contents.html()).panner();
});