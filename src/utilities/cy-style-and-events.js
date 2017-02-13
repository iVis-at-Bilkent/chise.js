var elementUtilities = require('./element-utilities');
var libs = require('./lib-utilities').getLibs();
var $ = libs.jQuery;
var options = require('./option-utilities').getOptions();

module.exports = function (sbgnviz) {
  //Helpers
  
  // This function is to be called after nodes are resized throuh the node resize extension or through undo/redo actions
  var nodeResizeEndFunction = function (nodes) {
    cy.startBatch();
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var w = node.width();
      var h = node.height();

      node.removeStyle('width');
      node.removeStyle('height');

      node.data('bbox').w = w;
      node.data('bbox').h = h;
    }
    cy.endBatch();
    cy.style().update();
  };
  
  // Update cy stylesheet
  var upateStyleSheet = function() {
    cy.style()
    .selector("node[class][labelsize]")
    .style({
      'font-size': function (ele) {
        // If the node has labelsize data check adjustNodeLabelFontSizeAutomatically option.
        // If it is not set use labelsize data as font size eles. Use getLabelTextSize method.
        var opt = options.adjustNodeLabelFontSizeAutomatically;
        var adjust = typeof opt === 'function' ? opt() : opt;
        if (!adjust) {
          return ele.data('labelsize');
        }
        
        return elementUtilities.getLabelTextSize(ele);
      }
    }).update();
  };
  
  // Bind events
  var bindCyEvents = function() {
    cy.on("noderesize.resizeend", function (event, type, node) {
      nodeResizeEndFunction(node);
    });

    cy.on("afterDo", function (event, actionName, args) {
      if (actionName === 'changeParent') {
        sbgnviz.refreshPaddings();
      }
    });

    cy.on("afterUndo", function (event, actionName, args) {
      if (actionName === 'resize') {
        nodeResizeEndFunction(args.node);
      }
      else if (actionName === 'changeParent') {
        sbgnviz.refreshPaddings();
      }
    });

    cy.on("afterRedo", function (event, actionName, args) {
      if (actionName === 'resize') {
        nodeResizeEndFunction(args.node);
      }
      else if (actionName === 'changeParent') {
        sbgnviz.refreshPaddings();
      }
    });
  };
  // Helpers End
  
  $(document).on('updateGraphEnd', function(event) {
    cy.startBatch();
    // Initilize font related data of the elements which can have label
    cy.nodes().each(function(i, ele) {
      if (elementUtilities.canHaveSBGNLabel(ele)) {
        var _class = ele.data('class').replace(" multimer", "");
        ele.data('labelsize', elementUtilities.defaultProperties[_class].labelsize);
      }
    });
    cy.endBatch();
  });
  
  // Do these just one time
  $(document).one('updateGraphEnd', function(event) {
    upateStyleSheet();
    bindCyEvents();
  });
};