var libs = require('./lib-utilities').getLibs();
var $ = libs.jQuery;

module.exports = function () {

  var options, elementUtilities, cy;

  function cyStyleAndEvents (param) {
    elementUtilities = param.elementUtilities;
    options = param.optionUtilities.getOptions();
    cy = param.sbgnvizInstanceUtilities.getCy();

    //Helpers
    var initElementData = function (ele) {
      var eleclass = ele.data('class');
      if (!eleclass) {
        return;
      }
      eleclass = elementUtilities.demultimerizeClass(eleclass);
      var classProperties = elementUtilities.defaultProperties[eleclass];

      cy.batch(function () {
        if (ele.isNode()) {
          if (classProperties['width'] && !ele.data('bbox').w) {
            ele.data('bbox').w = classProperties['width'];
          }
          if (classProperties['height'] && !ele.data('bbox').h) {
            ele.data('bbox').h = classProperties['height'];
          }
          if (!ele.data('font-size') && classProperties['font-size']) {
            ele.data('font-size', classProperties['font-size']);
          }
          if (!ele.data('font-family') && classProperties['font-family']) {
            ele.data('font-family', classProperties['font-family']);
          }
          if (!ele.data('font-style') && classProperties['font-style']) {
            ele.data('font-style', classProperties['font-style']);
          }
          if (!ele.data('font-weight') && classProperties['font-weight']) {
            ele.data('font-weight', classProperties['font-weight']);
          }
          if (!ele.data('color') && classProperties['color']) {
            ele.data('color', classProperties['color']);
          }
          if (!ele.data('background-color') && classProperties['background-color']) {
            ele.data('background-color', classProperties['background-color']);
          }
          if (!ele.data('background-opacity') && classProperties['background-opacity']) {
            ele.data('background-opacity', classProperties['background-opacity']);
          }
          if (!ele.data('border-color') && classProperties['border-color']) {
            ele.data('border-color', classProperties['border-color']);
          }
          if (!ele.data('border-width') && classProperties['border-width']) {
            ele.data('border-width', classProperties['border-width']);
          }
          if (!ele.data('text-wrap') && classProperties['text-wrap']) {
            ele.data('text-wrap', classProperties['text-wrap']);
          }
          
          if (ele.data('init') && ele.data('background-image') === undefined && classProperties['background-image']) {
            ele.data('background-image', classProperties['background-image']);
          }
          if (ele.data('init') && ele.data('background-fit') === undefined && classProperties['background-fit']) {
            ele.data('background-fit', classProperties['background-fit']);
          }
          if (ele.data('init') && ele.data('background-position-x') === undefined && classProperties['background-position-x']) {
            ele.data('background-position-x', classProperties['background-position-x']);
          }
          if (ele.data('init') && ele.data('background-position-y') === undefined && classProperties['background-position-y']) {
            ele.data('background-position-y', classProperties['background-position-y']);
          }
          if (ele.data('init') && ele.data('background-width') === undefined && classProperties['background-width']) {
            ele.data('background-width', classProperties['background-width']);
          }
          if (ele.data('init') && ele.data('background-height') === undefined && classProperties['background-height']) {
            ele.data('background-height', classProperties['background-height']);
          }
          if (ele.data('init') && ele.data('background-image-opacity') === undefined && classProperties['background-image-opacity']) {
            ele.data('background-image-opacity', classProperties['background-image-opacity']);
          }
          
          if(!ele.data('init')){
            ele.data('init', true);
          }
        }
        else if (ele.isEdge()) {
          if (!ele.data('width') && classProperties['width']) {
            ele.data('width', classProperties['width']);
          }
          if (!ele.data('line-color') && classProperties['line-color']) {
            ele.data('line-color', classProperties['line-color']);
          }
        }
      });
    };

    // Update cy stylesheet
    var updateStyleSheet = function() {
      cy.style()
      .selector("node[class][font-size]")
      .style({
        'font-size': function (ele) {
          // If node labels are expected to be adjusted automatically or element cannot have label
          // return elementUtilities.getLabelTextSize() else return ele.data('font-size')
          var opt = options.adjustNodeLabelFontSizeAutomatically;
          var adjust = typeof opt === 'function' ? opt() : opt;

          if (!adjust) {
            return ele.data('font-size');
          }

          return elementUtilities.getLabelTextSize(ele);
        }
      })
      .selector("node[class][font-family]")
      .style({
        'font-family': function (ele) {
          return ele.data('font-family');
        }
      })
      .selector("node[class][font-style]")
      .style({
        'font-style': function (ele) {
          return ele.data('font-style');
        }
      })
      .selector("node[class][font-weight]")
      .style({
        'font-weight': function (ele) {
          return ele.data('font-weight');
        }
      })
      .selector("node[class][color]")
      .style({
        'color': function (ele) {
          return ele.data('color');
        }
      })
      .selector("node[class][background-color]")
      .style({
        'background-color': function (ele) {
          return ele.data('background-color');
        }
      })
      .selector("node[class][background-opacity]")
      .style({
        'background-opacity': function (ele) {
          return ele.data('background-opacity');
        }
      })
      .selector("node[class][border-width]")
      .style({
        'border-width': function (ele) {
          return ele.data('border-width');
        }
      })
      .selector("node[class][border-color]")
      .style({
        'border-color': function (ele) {
          return ele.data('border-color');
        }
      })
      .selector("node[class][text-wrap]")
      .style({
        'text-wrap': function (ele) {
          return ele.data('text-wrap');
        }
      })
      .selector("edge[class][line-color]")
      .style({
        'line-color': function (ele) {
          return ele.data('line-color');
        },
        'source-arrow-color': function(ele) {
          return ele.data('line-color');
        },
        'target-arrow-color': function(ele) {
          return ele.data('line-color');
        }
      })
      .selector("edge[class][width]")
      .style({
        'width': function(ele) {
          return ele.data('width');
        }
      })
      .selector("edge.cy-expand-collapse-meta-edge")
      .css({
        'line-color': '#C4C4C4',
        'source-arrow-color': '#C4C4C4',
        'target-arrow-color': '#C4C4C4'
      })
      .selector("node:selected")
      .style({
        'border-color': '#d67614',
        'text-outline-color': '#000'
      })
      .selector("edge:selected")
      .style({
        'line-color': '#d67614',
        'source-arrow-color': '#d67614',
        'target-arrow-color': '#d67614'
      }).update();
    };

    // Bind events
    var bindCyEvents = function() {
      cy.on("add", function (event) {
        var ele = event.cyTarget || event.target;
        initElementData(ele);
      });
    };
    // Helpers End

    // Once cy is ready bind events and update style sheet
    cy.ready( function(event) {
      bindCyEvents();
      updateStyleSheet();
    });
  }

  return cyStyleAndEvents;
};
