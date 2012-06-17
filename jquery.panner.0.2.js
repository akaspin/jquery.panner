;(function($, window, document, undefined){

    // Namespace
    var ns = 'panner';
    var eventNs = '.' + ns;
    var defaultOptions = {
        wrapper: '.pan-wrap',   // Pan wrapper class
        
        brakeLeft : 'pan-brake-left',
        brakeRight : 'pan-brake-right',
        brakeTimeout : 500,
        
        sweepTimeout: 300,      // Sweep detection timeout in millis
        sweepThreshold : 100,   // Minimum sweep distance threshold
        sweepMulti : 5,         // Sweep distance multi. 
        sweepSpeed : 5          // Sweep time multi. Higher - longer.
    }
    
    function Pane(container, options) {
        options = !!options ? options : {};
        $.extend(options, defaultOptions)
        
        this.options = options;
        this.container = container;
        this.$$ = $(container);
        this.wrap = $(options.wrapper, container);
        
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
        var wrap = this.wrap;
        var options = this.options;
        
        function checkDrag(lastScroll, delta, ev) {
            var newScroll = wrap.scrollLeft();
            
            if (lastScroll == newScroll) {
                attachBrake(delta);
            }
        };
        
        function attachBrake(delta) {
            if (delta == 0) return;
            var brakeClass = (delta < 0) ? 
                    options.brakeLeft : options.brakeRight;
            $$.addClass(brakeClass);
            setTimeout(function() {
                $$.removeClass(brakeClass);
            }, options.brakeTimeout);
        }
        
        // Start drag. Binds mousemove and mouseup
        function startDrag(ev) {
            // stop all animations and reset sweep.
            wrap.stop(true);
            that.sweepTimer = (new Date()).getTime() ;
            that.sweepValue = 0;
            
            that._lastX = ev.pageX;
            wrap
            .on('mouseup' + eventNs, function(ev) {
                checkSweep(ev);
            })
            .on('mouseleave' + eventNs, function(ev) {
                    stopDrag(ev);
            })
            .on('mousemove' + eventNs, function(ev) {
                drag(ev);
                return false;
            });
        }
        
        function drag(ev) {
            var x = ev.pageX;
            var delta = that._lastX - x;
            var lastScroll = wrap.scrollLeft();
            that._lastX = x;
            
            wrap.scrollLeft(wrap.scrollLeft() + delta);
            
            // Hardly check sweep.
            // So if scroll direction is same as `that.sweepValue` - 
            // increase it keep timer. Else
            var scrollDelta = wrap.scrollLeft() - lastScroll;
            var newSweep = that.sweepValue + scrollDelta;
            if (Math.abs(that.sweepValue) < Math.abs(newSweep)) {
                that.sweepValue = newSweep;
            } else {
                that.sweepTimer = (new Date()).getTime();
                that.sweepValue = scrollDelta;
            }
            
            checkDrag(lastScroll, delta, ev);
        }
        
        function checkSweep(ev) {
            stopDrag(ev);
            var sweepTime = (new Date()).getTime() - that.sweepTimer;
            
            if (Math.abs(that.sweepValue) >= options.sweepThreshold &&
                    sweepTime < options.sweepTimeout) {
                // calculate sweep distance
                var sweepDistance = (that.sweepValue * options.sweepMulti);
                var sweepSpeed = 
                    (options.sweepTimeout - sweepTime) * options.sweepSpeed;
                wrap.animate(
                        {scrollLeft: wrap.scrollLeft() + sweepDistance}, 
                        sweepSpeed,
                        'swing');
            }
        };
        
        function stopDrag() {
            wrap.off('mousemove' + eventNs +
                   ' mouseup' + eventNs +
                   ' mouseleave' + eventNs);
        }
        
        wrap.on('mousedown' + eventNs, function(ev) { 
            startDrag(ev);
            return false;
        });
    };
    
    /**
     * Methods
     */
    var methods = {
        // Init
        init : function(options) {
            return this.each(function () {
                if (!$.data(this, 'plugin__' + ns)) 
                $.data(this, 'plugin__' + ns, 
                        new Pane(this, options));
            });
        }
    }

    $.fn[ns] = function(method) {

        // Method calling logic
        return methods.init.apply(this, arguments);
    };
    
})(jQuery, window, document);