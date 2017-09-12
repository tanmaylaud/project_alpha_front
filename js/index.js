(function() {
    // Insert separator for logging
    console.log("Start Web net");
  
  	// Shared variables;
    var width, height, canvas, ctx, points, target, animateHeader = true;

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {
            x: width / 2,
            y: height / 3
        };

        canvas = document.getElementById( 'net' );
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext( '2d' );

        // create points
        points = [];
        for ( var x = 0; x < width; x = x + width / 20 ) {
            for ( var y = 0; y < height; y = y + height / 20 ) {
                var px = x + Math.random() * width / 20;
                var py = y + Math.random() * height / 20;
                var p = {
                    x: px,
                    originX: px,
                    y: py,
                    originY: py,
                    active: 0
                };
                points.push( p );
            }
        }

        // for each point find the k closest points
        for ( var i = 0; i < points.length; i++ ) {
            var closest = [];
            var p1 = points[ i ];
            for ( var j = 0; j < points.length; j++ ) {
                var p2 = points[ j ]
                if ( !( p1 == p2 ) ) {
                    var placed = false;
                    for ( var k = 0; k < 4; k++ ) {
                        if ( !placed ) {
                            if ( closest[ k ] == undefined ) {
                                closest[ k ] = p2;
                                placed = true;
                            }
                        }
                    }

                    for ( var k = 0; k < 4; k++ ) {
                        if ( !placed ) {
                            if ( getDistance( p1, p2 ) < getDistance( p1, closest[ k ] ) ) {
                                closest[ k ] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for ( var i in points ) {
            var c = new Circle( points[ i ], 2 + Math.random() * 2, 'rgba(64,255,255,α)' );
            points[ i ].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        window.addEventListener( 'mousemove', mouseMove );
        
        //window.addEventListener( 'scroll', scrollCheck );
        window.addEventListener( 'resize', resize );
    }

    function mouseMove( e ) {
        var posx = 0, posy = 0;
        if ( e.pageX || e.pageY ) {
            posx = e.pageX;
            posy = e.pageY;
        } else if ( e.clientX || e.clientY ) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = lerp(target.x, posx, 0.15);
        target.y = lerp(target.y, posy, 0.15);
    }

    /*function scrollCheck() {
        if ( document.body.scrollTop > height ) animateHeader = false;
        else animateHeader = true;
    }*/

    function resize() {
      	var oldWidth = width;
      	var oldHeight = height;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
      	redistribute(oldWidth, oldHeight, width, height);
    }
  
  	function redistribute (oldWidth, oldHeight, width, height ){
      var xScale = width / oldWidth;
      var yScale = height / oldHeight;
      for ( var i = 0; i < points.length; i++ ) {
      	var p = points[i];
        p.originX = p.originX * xScale;
        p.originY = p.originY * yScale;
      }
    }

    // animation
    function initAnimation() {
        animate();
        for ( var i in points ) {
            shiftPoint( points[ i ] );
        }
    }

    function animate() {
        if ( animateHeader ) {
            ctx.clearRect( 0, 0, width, height );
            for ( var i in points ) {
                // detect points in range
              	var d = Math.abs( getDistance( target, points[ i ] ) );
              	var fadeSpeed = 0.03;
              	if ( d < 40 ) {
                    points[ i ].active = lerp(points[ i ].active, 0.8, fadeSpeed);
                    points[ i ].circle.active = lerp(points[ i ].circle.active, 1, fadeSpeed);
                } else if ( d < 200 ) {
                    points[ i ].active = lerp(points[ i ].active, 0.6, fadeSpeed);
                    points[ i ].circle.active = lerp(points[ i ].circle.active, 0.8, fadeSpeed);
                } else if ( d < 4000 ) {
                  	points[ i ].active = lerp(points[ i ].active, 0.3, fadeSpeed);
                    points[ i ].circle.active = lerp(points[ i ].circle.active, 0.6, fadeSpeed);
                } else if ( d < 20000 ) {
                  	points[ i ].active = lerp(points[ i ].active, 0.1, fadeSpeed);
                    points[ i ].circle.active = lerp(points[ i ].circle.active, 0.3, fadeSpeed);
                }
              	if ( d < 40000 ) {
                    points[ i ].active = lerp(points[ i ].active, 0.02, fadeSpeed);
                    points[ i ].circle.active = lerp(points[ i ].circle.active, 0.1, fadeSpeed);
                    points[ i ].active = Math.max(points[ i ].active, 0.02);
                    points[ i ].circle.active = Math.max(points[ i ].circle.active, 0.1);
                } else {
                  	points[ i ].active = lerp(points[ i ].active, 0, .3);
                    points[ i ].circle.active = lerp(points[ i ].circle.active, 0, .5);
                    //points[ i ].active = 0;
                    //points[ i ].circle.active = 0;
                }

                drawLines( points[ i ] );
                points[ i ].circle.draw();
            }
        }
        requestAnimationFrame( animate );
    }

    function shiftPoint( p ) {
        TweenLite.to( p, 2 + 3 *Math.random(), {
            x: p.originX - 10 + Math.random() * 20,
            y: p.originY - 10 + Math.random() * 20,
            onComplete: function() {
                shiftPoint( p );
            }
        } );
    }

    // Canvas manipulation
    function drawLines( p ) {
        if ( !p.active ) return;
        for ( var i in p.closest ) {
            ctx.beginPath();
            ctx.moveTo( p.x, p.y );
            ctx.lineTo( p.closest[ i ].x, p.closest[ i ].y );
            ctx.strokeStyle = 'rgba(128,255,255,' + p.active + ')';
          	//ctx.strokeStyle = p.circle.color.replace('α', _this.active);
            ctx.stroke();
        }
    }

    function Circle( pos, rad, color ) {
        var _this = this;

        // constructor
        ( function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
          	_this.active = 0;
        } )();

        this.draw = function() {
            if ( !_this.active ) return;
            ctx.beginPath();
            ctx.arc( _this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false );
            //ctx.fillStyle = 'rgba(255,255,255,' + _this.active + ')';
          	var activeColor = _this.color.replace('α', _this.active);
          	ctx.fillStyle = activeColor;
            ctx.fill();
        };
    }

    // Util
    function getDistance( p1, p2 ) { // squared
    	return Math.pow( p1.x - p2.x, 2 ) + Math.pow( p1.y - p2.y, 2 );
    }
  
    function lerp( l, r, a )	{
			return (1-a)*l + a*r;
    }

}())