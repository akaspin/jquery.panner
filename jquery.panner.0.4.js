/**
 * jquery.panner v0.4.1
 * Horisontal panning. With touch fallback. 
 * Dependencies: jQuery, jQuery.easing (optional)
 */

(function($) {

    // Namespaces
    var ns = 'panner';
    var eventNs = '.' + ns;
    
    function Panner(el, options) {
        this.options = options;
        this.el = $(el);
        
        this.brake = false;
        if (!!options.brake) {
            this.brake = !!options.brake.what ? 
                    options.brake.what : this.el.parent();
        }
        
        // Control
        this.control = !!options.control ? options.control : this.el;
        
        this._lastX = 0;
        this.init();
    }
    
    /**
     * Init
     */
    Panner.prototype.init = function() {
        var that = this;
        
        if (!!this.options.css) this.el.css(this.options.css);
        
            // and bind events 
        this.control.on('mousedown' + eventNs, function(ev) { 
                that.startDrag(ev);
                return false;
            });
        this.doShift();
    };
    
    /**
     * Start dragging.
     */
    Panner.prototype.startDrag = function(ev) {
        // stop all animations and reset sweep.
        this.el.stop(true);
        
        if (!!this.options.sweep) {
            this.sweepTimer = (new Date()).getTime() ;
            this.sweepValue = 0; 
        }
        
        this._lastX = ev.pageX;
        
        var that = this;
        this.control
            // On mouseup need to check sweep status
            .on('mouseup' + eventNs, function(ev) {
                    that.stopDrag(); 
                    that.doSweep(ev);
            })
            // On mouseleave just stop dragging
            .on('mouseleave' + eventNs, function() {
                    that.stopDrag();
            })
            // On mousemove do draggind
            .on('mousemove' + eventNs, function(ev) {
                    that.doDrag(ev);
                    return false;
            });
    }
    
    /**
     * Stop dragging
     */
    Panner.prototype.stopDrag = function() {
        this.control.off(
                'mousemove' + eventNs +
                ' mouseup' + eventNs +
                ' mouseleave' + eventNs
                );
    }
    
    /**
     * Do drag and maintain sweep state.
     */
    Panner.prototype.doDrag = function(ev) {
        var el = this.el;
        var x = ev.pageX;
        var delta = this._lastX - x;
        var lastScroll = el.scrollLeft();
        this._lastX = x;
        
        el.scrollLeft(lastScroll + delta);
        
        // Maintain sweep state if needed
        if (!!this.options.sweep) {
            var scrollDelta = el.scrollLeft() - lastScroll;
            var newSweep = this.sweepValue + scrollDelta;
            if (Math.abs(this.sweepValue) < Math.abs(newSweep)) {
                this.sweepValue = newSweep;
            } else {
                this.sweepTimer = (new Date()).getTime();
                this.sweepValue = scrollDelta;
            }
        }
        
        this.doBrake(lastScroll, delta, ev);
    }
    
    /**
     * Do brakes if needed.
     */
    Panner.prototype.doBrake = function(lastScroll, delta, ev) {
        if (!!this.brake 
                && lastScroll == this.el.scrollLeft()
                && delta != 0) {
            var brake = this.brake;
            var opts = this.options.brake;
            
            var brakeClass = (delta < 0) ? opts.left : opts.right;
            brake.addClass(brakeClass);
            setTimeout(function() {
                brake.removeClass(brakeClass);
            }, opts.timeout);
        }
    }
    
    /**
     * Do sweep if needed.
     */
    Panner.prototype.doSweep = function(ev) {
        if (!!this.options.sweep) {
            var sweepTime = (new Date()).getTime() - this.sweepTimer;
            var opts = this.options.sweep;
            
            if (Math.abs(this.sweepValue) >= opts.distance 
                    && sweepTime < opts.timeout) {
                var sweepDistance = (this.sweepValue * opts.distanceMulti);
                var sweepTime = (opts.timeout - sweepTime) * opts.timeMulti;
                this.el.animate(
                        {scrollLeft: this.el.scrollLeft() + sweepDistance}, 
                        sweepTime,
                        opts.easing);
            }
        }
    }
    
    /**
     * Pull on init if needed.
     */
    Panner.prototype.doShift = function() {
        if (!!this.options.shift) {
            var opts =  this.options.sweep;
            var el = this.el;
            el.animate(
                    {scrollLeft: this.options.shift},
                    opts.timeMulti * 10,
                    opts.easing, 
                    function() {
                        el.animate(
                                {scrollLeft: 0},
                                opts.timeMulti * 20,
                                opts.easing);
                    });
        }
    }
    
    /**
     * Entry point.
     */
    $.fn[ns] = function(options) {
        var settings = {
                
                // Touch detection
                touch : function() {
                    return 'ontouchstart' in document.documentElement;
                },
                
                // Css override for band.
                css : {'overflow': 'hidden'},
                
                // Brake settings
                brake: {
                    left : 'panner-brake-left',    // Left brake class
                    right : 'panner-brake-right',  // Right brake class
                    timeout : 500               // Brake remove timeout
                },
                
                // Sweep settings
                sweep : {
                    distance : 150,     // Minimal distance for sweep detection 
                    timeout : 200,      // Maximum timeout for sweep detection in millis
                    distanceMulti : 3,  // Sweep distance multi
                    timeMulti : 10,     // Sweep time multi
                    easing : 'linear'   // Sweep easing. Linear by default.
                        // Highly recommends to use `swing` from 
                        // jquery.easing. Default `swing` is horrible.
                },
                
                shift: 0                 // Pull on start
        }
        
        options = !!options ? options : {};
        options = $.extend(true, settings, options);
        
        return this.each(function () {
            if (!!!options.touch() && !$.data(this, 'plugin__' + ns))
                $.data(this, 'plugin__' + ns, new Panner(this, options));
        });
    };
    
})(jQuery);