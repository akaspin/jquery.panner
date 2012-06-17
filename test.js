$("document").ready(function() {
    // Create some content to testing. 
    var $containers = $('.pan');
    
    var $contents = $('<div>');
    var toAdd = ""
    for ( var i = 1; i < 100; i++) {
        var $chunk = $('<div>').addClass('pan_item')
                .append($('<img>').attr('src', 'images/1.jpg'));
        $chunk.appendTo($contents);
    }
    $('.pan-wrap').append($contents.html());
    $('.pan').panner();
});