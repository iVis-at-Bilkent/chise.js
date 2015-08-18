;
(function($$, $) {
  'use strict';

  // registers the extension on a cytoscape lib ref
  var register = function($$, $) {
    if (!cytoscape) {
      return;
    } // can't register if cytoscape unspecified

    var defaults = {
      handleColor: '#000000', // the colour of the handle and the line drawn from it
      hoverDelay: 150, // time spend over a target node before it is considered a target selection
      enabled: true, // whether to start the plugin in the enabled state
      minNodeWidth: 30,
      minNodeHeight: 30,
      triangleSize: 10,
      lines: 3,
      padding: 5,

      start: function(sourceNode) {
        // fired when noderesize interaction starts (drag on handle)
      },
      complete: function(sourceNode, targetNodes, addedEntities) {
        // fired when noderesize is done and entities are added
      },
      stop: function(sourceNode) {
        // fired when noderesize interaction is stopped (either complete with added edges or incomplete)
      }
    };

    /**
     * Checks if the point p is inside the triangle p0,p1,p2
     * using barycentric coordinates
     */
    function ptInTriangle(p, p0, p1, p2) {
      var A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
      var sign = A < 0 ? -1 : 1;
      var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
      var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

      return s > 0 && t > 0 && (s + t) < 2 * A * sign;
    };


    $.fn.cytoscapeNodeResize = function(params) {
      var fn = params;

      var functions = {
        destroy: function() {
          var $container = $(this);
          var data = $container.data('cynoderesize');

          if (data == null) {
            return;
          }

          data.unbind();
          $container.data('cynoderesize', {});

          return $container;
        },

        option: function(name, value) {
          var $container = $(this);
          var data = $container.data('cynoderesize');

          if (data == null) {
            return;
          }

          var options = data.options;

          if (value === undefined) {
            if (typeof name == typeof {}) {
              var newOpts = name;
              options = $.extend(true, {}, defaults, newOpts);
              data.options = options;
            } else {
              return options[name];
            }
          } else {
            options[name] = value;
          }

          $container.data('cynoderesize', data);

          return $container;
        },

        disable: function() {
          return functions.option.apply(this, ['enabled', false]);
        },

        enable: function() {
          return functions.option.apply(this, ['enabled', true]);
        },

        resize: function() {
          var $container = $(this);

          $container.trigger('cynoderesize.resize');
        },

        drawon: function() {
          $(this).trigger('cynoderesize.drawon');
        },

        drawoff: function() {
          $(this).trigger('cynoderesize.drawoff');
        },

        init: function() {
          var self = this;
          var opts = $.extend(true, {}, defaults, params);
          var $container = $(this);
          var cy;
          var $canvas = $('<canvas></canvas>');
          var handle;
          var line, linePoints;
          var mdownOnHandle = false;
          var grabbingNode = false;
          var inForceStart = false;
          var hoverTimeout;
          var drawsClear = true;
          var sourceNode;
          var drawMode = false;

          $container.append($canvas);

          function sizeCanvas() {
            $canvas
              .attr('height', $container.height())
              .attr('width', $container.width())
              .css({
                'position': 'absolute',
                'z-index': '999'
              });
          }
          sizeCanvas();

          $(window).bind('resize', function() {
            sizeCanvas();
          });

          $container.bind('cynoderesize.resize', function() {
            sizeCanvas();
          });

          var prevUngrabifyState;
          $container.on('cynoderesize.drawon', function() {
            drawMode = true;

            prevUngrabifyState = cy.autoungrabify();

            cy.autoungrabify(true);
          });

          $container.on('cynoderesize.drawoff', function() {
            drawMode = false;

            cy.autoungrabify(prevUngrabifyState);
          });

          var ctx = $canvas[0].getContext('2d');

          // write options to data
          var data = $container.data('cynoderesize');
          if (data == null) {
            data = {};
          }
          data.options = opts;

          var optCache;

          function options() {
            return optCache || (optCache = $container.data('cynoderesize').options);
          }

          function enabled() {
            return options().enabled;
          }

          function disabled() {
            return !enabled();
          }

          function clearDraws() {

            if (drawsClear) {
              return;
            } // break early to be efficient

            var w = $container.width();
            var h = $container.height();

            ctx.clearRect(0, 0, w, h);
            drawsClear = true;
          }

          var lastPanningEnabled, lastZoomingEnabled, lastBoxSelectionEnabled;

          function disableGestures() {
            lastPanningEnabled = cy.panningEnabled();
            lastZoomingEnabled = cy.zoomingEnabled();
            lastBoxSelectionEnabled = cy.boxSelectionEnabled();

            cy
              .zoomingEnabled(false)
              .panningEnabled(false)
              .boxSelectionEnabled(false);
          }

          function resetGestures() {
            cy
              .zoomingEnabled(lastZoomingEnabled)
              .panningEnabled(lastPanningEnabled)
              .boxSelectionEnabled(lastBoxSelectionEnabled);
          }

          function resetToDefaultState() {

            clearDraws();

            sourceNode = null;

            resetGestures();
          }

          function drawHandle(node) {
            var cy = node.cy();
            ctx.fillStyle = options().handleColor;
            ctx.strokeStyle = options().handleColor;
            var padding = options().padding * cy.zoom();
            var p = node.renderedPosition();
            var w = node.renderedOuterWidth() + padding * 2;
            var h = node.renderedOuterHeight() + padding * 2;
            var ts = options().triangleSize * cy.zoom();

            var x1 = p.x + w / 2 - ts;
            var y1 = p.y + h / 2;
            var x2 = p.x + w / 2;
            var y2 = p.y + h / 2 - ts;

            var lines = options().lines;
            var wStep = ts / lines;
            var hStep = ts / lines;
            var lw = 1.5 * cy.zoom();
            for (var i = 0; i < lines - 1; i++) {
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.lineTo(x2, y2 + lw);
              ctx.lineTo(x1 + lw, y1);
              ctx.lineTo(x1, y1);
              ctx.closePath();
              ctx.fill();
              x1 += wStep;
              y2 += hStep;
            }
            ctx.beginPath();
            ctx.moveTo(x2, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x1, y1);
            ctx.closePath();
            ctx.fill();

            drawsClear = false;
          }

          function hoverOut(node) {

            clearTimeout(hoverTimeout);

          }

          $container.cytoscape(function(e) {
            cy = this;

            lastPanningEnabled = cy.panningEnabled();
            lastZoomingEnabled = cy.zoomingEnabled();
            lastBoxSelectionEnabled = cy.boxSelectionEnabled();

            cy.style().selector('.noderesize-resized').css({
              'width': 'data(width)',
              'height': 'data(height)',
            });

            // console.log('handles on ready')

            var lastActiveId;

            var transformHandler;
            cy.bind('zoom pan', transformHandler = function() {
              clearDraws();
            });

            var lastMdownHandler;

            var startHandler, hoverHandler, leaveHandler, grabNodeHandler, freeNodeHandler, dragNodeHandler, forceStartHandler, removeHandler, tapToStartHandler, dragHandler, grabHandler;
            cy.on('mouseover tap', 'node', startHandler = function(e) {

              var node = this;

              if (disabled() || drawMode || mdownOnHandle || grabbingNode || inForceStart || node.isParent()) {
                return; // don't override existing handle that's being dragged
                // also don't trigger when grabbing a node etc
              }

              //console.log('mouseover startHandler %s %o', this.id(), this);

              if (lastMdownHandler) {
                $container[0].removeEventListener('mousedown', lastMdownHandler, true);
                $container[0].removeEventListener('touchstart', lastMdownHandler, true);
              }

              lastActiveId = node.id();

              // remove old handle
              clearDraws();

              // add new handle
              drawHandle(node);

              node.trigger('cynoderesize.showhandle');
              var lastPosition = {};

              function mdownHandler(e) {

                $container[0].removeEventListener('mousedown', mdownHandler, true);
                $container[0].removeEventListener('touchstart', mdownHandler, true);

                var pageX = !e.touches ? e.pageX : e.touches[0].pageX;
                var pageY = !e.touches ? e.pageY : e.touches[0].pageY;
                var x = pageX - $container.offset().left;
                var y = pageY - $container.offset().top;
                lastPosition.x = x;
                lastPosition.y = y;

                if (e.button !== 0 && !e.touches) {
                  return; // sorry, no right clicks allowed 
                }
                
                var padding = options().padding;
                var rp = node.renderedPosition();
                var w = node.renderedOuterWidth() + padding * 2;
                var h = node.renderedOuterHeight() + padding * 2;
                var ts = options().triangleSize * cy.zoom();

                var x1 = rp.x + w / 2 - ts;
                var y1 = rp.y + h / 2;
                var x2 = rp.x + w / 2;
                var y2 = rp.y + h / 2 - ts;

                var p = {x: x, y: y};
                var p0 = {x: x1, y: y1};
                var p1 = {x: x2, y: y2};
                var p2 = {x: rp.x + w/2, y: rp.y + h/2};

                if (!ptInTriangle(p, p0, p1, p2)) {
                  return; // only consider this a proper mousedown if on the handle
                }

                if (inForceStart) {
                  return; // we don't want this going off if we have the forced start to consider
                }

                // console.log('mdownHandler %s %o', node.id(), node);
                node.addClass('noderesize-resized');

                mdownOnHandle = true;

                e.preventDefault();
                e.stopPropagation();

                sourceNode = node;

                node.trigger('cynoderesize.start');
                var originalSize = {
                  width: node.width(),
                  height: node.height()
                };

                function doneMoving(dmEvent) {
                  // console.log('doneMoving %s %o', node.id(), node);

                  if (!mdownOnHandle || inForceStart) {
                    return;
                  }

                  var $this = $(this);
                  mdownOnHandle = false;
                  $(window).unbind('mousemove touchmove', moveHandler);

                  resetToDefaultState();

                  options().stop(node);
                  node.trigger('cynoderesize.stop');
                  cy.trigger('cynoderesize.noderesized',
                    [
                        node,
                        originalSize,
                        {
                            width: node.width(),
                            height: node.height()
                        }
                    ]
                  );
                }

                $(window).one('mouseup touchend touchcancel blur', doneMoving).bind('mousemove touchmove', moveHandler);
                disableGestures();

                options().start(node);

                return false;
              }

              function moveHandler(e) {
                // console.log('mousemove moveHandler %s %o', node.id(), node);

                var pageX = !e.originalEvent.touches ? e.pageX : e.originalEvent.touches[0].pageX;
                var pageY = !e.originalEvent.touches ? e.pageY : e.originalEvent.touches[0].pageY;
                var x = pageX - $container.offset().left;
                var y = pageY - $container.offset().top;

                //var dx = e.originalEvent.movementX;
                //var dy = e.originalEvent.movementY;

                var dx = x - lastPosition.x;
                var dy = y - lastPosition.y;

                lastPosition.x = x;
                lastPosition.y = y;
                // console.log(dx + " " + dy);
                var keepAspectRatio = e.originalEvent.ctrlKey;
                var w = node.data('width') || node.width();
                var h = node.data('height') || node.height();

                if (keepAspectRatio) {
                  var aspectRatio = w / h;
                  if (dy == 0) {
                    dy = dx = dx * aspectRatio;
                  } else {
                    dx = dy = (dy < 0 ? Math.min(dx, dy) : Math.max(dx, dy)) * aspectRatio;
                  }
                }
                dx /= cy.zoom();
                dy /= cy.zoom();

                node.data('width', Math.max(w + dx, options().minNodeWidth));
                node.data('height', Math.max(h + dy, options().minNodeHeight));

                clearDraws();
                drawHandle(node);


                return false;
              }

              $container[0].addEventListener('mousedown', mdownHandler, true);
              $container[0].addEventListener('touchstart', mdownHandler, true);
              lastMdownHandler = mdownHandler;


            }).on('mouseover tapdragover', 'node', hoverHandler = function() {
              var node = this;
              var target = this;

              // console.log('mouseover hoverHandler')

              if (disabled() || drawMode) {
                return; // ignore preview nodes
              }

              if (mdownOnHandle) { // only handle mdown case

                // console.log( 'mouseover hoverHandler %s $o', node.id(), node );

                return false;
              }

            }).on('mouseout tapdragout', 'node', leaveHandler = function() {
              var node = this;

              if (drawMode) {
                return;
              }

              if (mdownOnHandle) {
                hoverOut(node);
              }

            }).on('drag position', 'node', dragNodeHandler = function() {
              if (drawMode) {
                return;
              }

              var node = this;

              setTimeout(clearDraws, 50);

            }).on('grab', 'node', grabHandler = function() {
              //grabbingNode = true;

              //setTimeout(function(){
              clearDraws();
              //}, 5);


            }).on('drag', 'node', dragHandler = function() {
              grabbingNode = true;


            }).on('free', 'node', freeNodeHandler = function() {
              grabbingNode = false;

            }).on('cynoderesize.forcestart', 'node', forceStartHandler = function() {
              var node = this;

              inForceStart = true;
              clearDraws(); // clear just in case

              sourceNode = node;

              lastActiveId = node.id();

              node.trigger('cynoderesize.start');

              drawHandle(node);

              node.trigger('cynoderesize.showhandle');

              // case: down and drag as normal
              var downHandler = function(e) {

                $container[0].removeEventListener('mousedown', downHandler, true);
                $container[0].removeEventListener('touchstart', downHandler, true);

                var x = (e.pageX !== undefined ? e.pageX : e.originalEvent.touches[0].pageX) - $container.offset().left;
                var y = (e.pageY !== undefined ? e.pageY : e.originalEvent.touches[0].pageY) - $container.offset().top;
                var d = hr / 2;
                var onNode = p.x - w / 2 - d <= x && x <= p.x + w / 2 + d && p.y - h / 2 - d <= y && y <= p.y + h / 2 + d;

                if (onNode) {
                  disableGestures();
                  mdownOnHandle = true; // enable the regular logic for handling going over target nodes

                  var moveHandler = function(me) {
                    var x = (me.pageX !== undefined ? me.pageX : me.originalEvent.touches[0].pageX) - $container.offset().left;
                    var y = (me.pageY !== undefined ? me.pageY : me.originalEvent.touches[0].pageY) - $container.offset().top;


                    clearDraws();
                    drawHandle(node);
                  }

                  $container[0].addEventListener('mousemove', moveHandler, true);
                  $container[0].addEventListener('touchmove', moveHandler, true);

                  $(window).one('mouseup touchend blur', function() {
                    $container[0].removeEventListener('mousemove', moveHandler, true);
                    $container[0].removeEventListener('touchmove', moveHandler, true);

                    inForceStart = false; // now we're done so reset the flag
                    mdownOnHandle = false; // we're also no longer down on the node


                    options().stop(node);
                    node.trigger('cynoderesize.stop');

                    cy.off('tap', 'node', tapHandler);
                    node.off('remove', removeBeforeHandler);
                    resetToDefaultState();
                  });

                  e.stopPropagation();
                  e.preventDefault();
                  return false;
                }
              };

              $container[0].addEventListener('mousedown', downHandler, true);
              $container[0].addEventListener('touchstart', downHandler, true);

              var removeBeforeHandler;
              node.one('remove', function() {
                $container[0].removeEventListener('mousedown', downHandler, true);
                $container[0].removeEventListener('touchstart', downHandler, true);
                cy.off('tap', 'node', tapHandler);
              });

              // case: tap a target node
              var tapHandler;
              cy.one('tap', 'node', tapHandler = function() {
                var target = this;

                inForceStart = false; // now we're done so reset the flag

                options().stop(node);
                node.trigger('cynoderesize.stop');

                $container[0].removeEventListener('mousedown', downHandler, true);
                $container[0].removeEventListener('touchstart', downHandler, true);
                node.off('remove', removeBeforeHandler);
                resetToDefaultState();
              });


            }).on('remove', 'node', removeHandler = function() {
              var id = this.id();

              if (id === lastActiveId) {
                setTimeout(function() {
                  resetToDefaultState();
                }, 5);
              }


            }).on('tap', 'node', tapToStartHandler = function() {
              return;
              var node = this;

              if (!sourceNode) { // must not be active
                setTimeout(function() {
                  clearDraws(); // clear just in case

                  drawHandle(node);

                  node.trigger('cynoderesize.showhandle');
                }, 16);
              }

            });


            data.unbind = function() {
              cy
                .off('mouseover', 'node', startHandler)
                .off('mouseover', 'node', hoverHandler)
                .off('mouseout', 'node', leaveHandler)
                .off('drag position', 'node', dragNodeHandler)
                .off('grab', 'node', grabNodeHandler)
                .off('free', 'node', freeNodeHandler)
                .off('cynoderesize.forcestart', 'node', forceStartHandler)
                .off('remove', 'node', removeHandler)
                .off('tap', 'node', tapToStartHandler);

              cy.unbind('zoom pan', transformHandler);
            };
          });

          $container.data('cynoderesize', data);
        },

        start: function(id) {
          var $container = $(this);

          $container.cytoscape(function(e) {
            var cy = this;

            cy.$('#' + id).trigger('cynoderesize.forcestart');
          });
        }
      };

      if (functions[fn]) {
        return functions[fn].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof fn == 'object' || !fn) {
        return functions.init.apply(this, arguments);
      } else {
        $.error('No such function `' + fn + '` for jquery.cytoscapeNodeResize');
      }

      return $(this);
    };

    $.fn.cyNodeResize = $.fn.cytoscapeNodeResize;

    $$('core', 'noderesize', function(options) {
      var cy = this;

      return $(cy.container()).cytoscapeNodeResize(options);
    });

  };

  if (typeof module !== 'undefined' && module.exports) { // expose as a commonjs module
    module.exports = register;
  }

  if (typeof define !== 'undefined' && define.amd) { // expose as an amd/requirejs module
    define('cytoscape-noderesize', function() {
      return register;
    });
  }

  if ($ && $$) { // expose to global cytoscape (i.e. window.cytoscape)
    register($$, $);
  }

})(cytoscape, jQuery);