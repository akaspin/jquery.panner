# Pan plugin for jQuery

Horisontal panning for jQuery with touch fallback. 

## Benefits and drawbacks

* `+` No need to provide sizes, dimenisions and other.
* `+` Minimal intervention in styles (Can be completelly disabled).
* `+` Sweep support (Can be disabled). 
* `+` Support to display right and left brakes (Can be disabled).
* `+` Automatic disabling on touch devices (Overridable).
* `+` Wide compatibility.

* `-` Hardware acceleration depends on jQuery. 

## Compatibility

Most of modern and old browsers. Currently tested on Chrome, MSIE 7+ and 
FF 3.6+, Chrome for Android, Android Browser (2.1 and 4.0.4).

## Dependencies

This plugin depend on [jQuery](http://jquery.com/) and optional 
[jQuery Easing](http://gsgd.co.uk/sandbox/jquery/easing/).

## Basic usage

Very basic setup of pane is two nested `div`s (or anything that you need).

    <!-- Wrapper -->
    <div class='wrap'>
    
        <!-- And our hero -->
        <div class='pan'>
            My very long content...
        </div>
    </div>
    
... some css:

    .wrap {
      width: 90%;             /* Make it ellastic */
      }
      
    .pan {
      white-space: nowrap;  /* Place all in ribbon */
      overflow: auto;       /* Good for touch devices and automatic 
                               fallback for non-js browsers. */       
      }
      
... and let's rock

    $('.pan').panner();
    
## Touch devices

By default `panner` kills himself on touch devices. This behaviour can be 
overriden by option `touch`. `touch` is simple `function` that returns `true`
if device supports touch events.

    $(...).panner({ 
        touch: function() {
            return 'ontouchstart' in document.documentElement;
            }
    });
    
Instead this you can provide own `function` or boolean value. Be careful. 
`panner` not supports touch events.

## Container CSS

To correctly display scrollable container `panner` automatically sets 
`overflow: hidden` on it for non-touch devices. You can provide own styles by
`css` option.

    $(...).panner({ 
        css: {'overflow': 'hidden'}
    });

## Brakes

If you dig basic usage, you might notice that when ribbon (`.pan`) came up
against towards right or left, one of the styles (`brake-left` or 
`brake-right`) for half a second was added to the wrapper (`.wrap`). This can 
be used to display brakes. Just small corrections to CSS.

    .wrap {
      position: relative;     /* Needed to correct display brakes */
      width: 90%;             /* Make it ellastic */
      }
      
    /* Brake styles. Just display empty rectangle on needed side */
    .brake-left:after,
    .brake-right:after {
      content: "";
      position: absolute;
      height: 100%;
      top: 0px;
      width: 3px;
      background-color: orange;
      }
    /* Show right brake on ... right */
    .brake-right:after {
      right: 0px;
      }

All behavior of brakes controlled by `brake` option.

    $(...).panner({ 
        brake: {
            left : 'brake-left',
            right : 'brake-right',
            timeout : 500
        }
    });

### Disabling

Instead display brakes, you can completelly disable them. Just set `brake` 
option to `false`.

    $(...).panner({ 
        brake: false
    });

Of course, in this case wrapper (`.wrap`) is not needed and can be purged 
from layout.

### Custom target

By default, `panner` use parent element (`$('el').parent()`) to display 
brakes. This good for most cases. To use different, set `brake.what` option.

    $(...).panner({ 
        brake: {
            what: $('#my-brakes')
        }
    });

### Timeout
 
 By default, brakes are shown for half a second. To set other timeout use 
 corresponding option. 
 
    $(...).panner({ 
        brake: {
            timeout : 500
        }
    });

### Styles

To use other styles for display brakes, you can use options `brake.left` and 
`brake.right`.

    $(...).panner({ 
        brake: {
            left: 'my-left-brake',
            right : 'my-right-brake'
        }
    });
    
## Sweep scrolling

`panner` supports sweep scrolling on non-touch devices. All sweep behaviour 
controlled by `sweep` option.

    $(...).panner({ 
        sweep : {
            distance : 150, 
            timeout : 200,
            distanceMulti : 3,
            timeMulti : 10,
            easing : 'linear'
        }
    });
    
If user start another scroll while sweeping, sweep scrolling stops.
    
### Disabling

Sweep can be turned off exactly as brakes. Just set `sweep` option to `false`.

    $(...).panner({ 
        sweep : false
    });
 
### Detection

On start scrolling, `panner` monitors movements. And if distance of last 
movement exceeds a certain value in the maximum time, `panner` scroll 
container (`.pan`) in sweep manner.

To control sweep detection, you can use `sweep.distance` and 
`sweep.timeout` options.

    $(...).panner({ 
        sweep : {
            distance : 150, 
            timeout : 200
        }
    });

`sweep.distance` means minimal scroll distance and `sweep.timeout` means 
maximum time of last movement.

### Distance and speed

`panner` calculates sweep distance and speed calculates on the basis of last 
scroll distance and time. 

    $(...).panner({ 
        sweep : {
            distanceMulti : 3,
            timeMulti : 10
        }
    });
    
If `panner` detects sweep, it multiplies scroll distance and time on 
corresponds options.

### Easing

By default setting of sweep easing is `'linear'`. It is made because of 
horrible builtin jQuery `'swing'` easing.

    $(...).panner({ 
        sweep : {
            easing : 'linear'
        }
    });

For other easings, I recommend [jQuery Easing](http://gsgd.co.uk/sandbox/jquery/easing/) plugin. This is drop-in extension 
for easings. 

    ... plug jquery.easing ...
    
    $(...).panner({ 
        sweep : {
            easing : 'swing'
        }
    });

    ... if you disable jquery.easing, you can see difference.
    
## Bonus. Shift on load

On non-touch devices, without scrollbar user may simply not guess that 
element is scrollable by dragging. To help him, `panner` can slightly shift 
contents to left and back.

    $(...).panner({ 
        shift: 0
    });
  
`shift` option is off by default. For shift container contents (`.pan`) on 
start, use any positive value in pixels.


    