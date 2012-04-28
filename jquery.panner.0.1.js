;(function($, window, document, undefined){

    // Namespace
    var ns = 'panner';
    var eventNs = '.' + ns;
    
    function Pane(container) {
        this.container = container;
        this.$$ = $(container);
        this._lastX = 0;        // Only for drag

        this.init();
    };
    
    /**
     * Init
     */
    Pane.prototype.init = function() {
        this.bindDrag();
    };
    
    /**
     * Bind mouse events.
     *  * On 'mousedown' - start drag:
     *    * bind 'mousemove' to drag pane
     *    * bind 'mouseup' and 'mouseleave' to stop drag
     *      * unbind 'mousemove', 'mouseup' and 'mouseleave'
     */
    Pane.prototype.bindDrag = function() {
        var that = this;
        var $$ = this.$$;
        
        // Start drag. Binds mousemove and mouseup
        function startDrag(x) {
            that._lastX = x;
            $$
            .on('mouseup' + eventNs + ' mouseleave' + eventNs, 
                function(ev) {
                    stopDrag();
            })
            .on('mousemove' + eventNs, function(ev) {
                drag(ev.pageX);
                return false;
            });
        }
        
        function drag(x) {
            var delta = that._lastX - x;
            that._lastX = x;
            $$.scrollLeft($$.scrollLeft() + delta);
        }
        
        function stopDrag() {
            $$.off('mousemove' + eventNs +
                    ' mouseup' + eventNs +
                    ' mouseleave' + eventNs);
        }
        
        $$
        .on('mousedown' + eventNs, function(ev) { 
            startDrag(ev.pageX);
            return false;
        });
    };
    
    /**
     * Methods
     */
    var methods = {
        // Init
        init : function() {
            return this.each(function () {
                if (!$.data(this, 'plugin__' + ns)) 
                $.data(this, 'plugin__' + ns, 
                        new Pane(this));
            });
        }
    }

    $.fn[ns] = function(method) {

        // Method calling logic
        return methods.init.apply(this, arguments);
    };
    
})(jQuery, window, document);