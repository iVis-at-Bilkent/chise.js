var sbgnStyleSheet = cytoscape.stylesheet()
    .selector("node")
    .css({
      "border-color": "#555",
      "border-width": "1.5px",
      'background-color': '#FFFFFF',
      'background-opacity': 0.5,
      'text-opacity': 1,
      'opacity': 1,
      'font-size': 11
    })
    .selector("node[?sbgnclonemarker][sbgnclass='perturbing agent']")
    .css({
      'background-image': 'sampleapp-images/clone_bg.png',
      'background-position-x': '50%',
      'background-position-y': '100%',
      'background-width': '100%',
      'background-height': '25%',
      'background-fit': 'none',
      'background-image-opacity': function (ele) {
        if(!ele.data('sbgnclonemarker')){
          return 0;
        }
        return ele.css('background-opacity');
      }
    })
    .selector("node[sbgnclass][sbgnclass!='complex'][sbgnclass!='process'][sbgnclass!='association'][sbgnclass!='dissociation'][sbgnclass!='compartment'][sbgnclass!='source and sink']")
    .css({
      'content': function (ele) {
        return getElementContent(ele);
      },
      'text-valign': 'center',
      'text-halign': 'center'
    })
    .selector("node[sbgnclass]")
    .css({
      'shape': function (ele) {
        return getCyShape(ele);
      },
      'font-weight': function(ele) {
        return ele.data('fontweight') ? ele.data('fontweight') : sbgnElementUtilities.defaultFontProperties.fontweight;
      },
      'font-family': function(ele) {
        return ele.data('fontfamily') ? ele.data('fontfamily') : sbgnElementUtilities.defaultFontProperties.fontfamily;
      },
      'font-style': function(ele) {
        return ele.data('fontstyle') ? ele.data('fontstyle') : sbgnElementUtilities.defaultFontProperties.fontstyle;
      },
      'font-size': function (ele) {
        var labelsize = getLabelTextSize(ele);
        if(labelsize) {
          return labelsize;
        }
       
        return ele.css('font-size');
      }
    })
    .selector("node[sbgnclass='perturbing agent']")
    .css({
      'shape-polygon-points': '-1, -1,   -0.5, 0,  -1, 1,   1, 1,   0.5, 0, 1, -1'
    })
//    .selector("node[sbgnclass='association']")
//    .css({
//      'background-color': '#6B6B6B'
//    })
    .selector("node[sbgnclass='tag']")
    .css({
      'shape-polygon-points': '-1, -1,   0.25, -1,   1, 0,    0.25, 1,    -1, 1'
    })
    .selector("node[sbgnclass='complex']")
    .css({
//      'background-color': '#F4F3EE',
      'text-valign': 'bottom',
      'text-halign': 'center',
      'content': function(ele){
        return getElementContent(ele);
      }
    })
    .selector("node[sbgnclass='compartment']")
    .css({
      'border-width': 3.75,
      'background-opacity': 0,
//      'background-color': '#FFFFFF',
      'content': function(ele){
        return getElementContent(ele);
      },
      'text-valign': 'bottom',
      'text-halign': 'center'
    })
    .selector("node[sbgnbbox]")
    .css({
      'width': 'data(sbgnbbox.w)',
      'height': 'data(sbgnbbox.h)'
    })
    .selector("node[expanded-collapsed='collapsed']")
    .css({
      'width': 36,
      'height': 36
    })
    .selector("node:selected")
    .css({
      'border-color': '#d67614',
      'target-arrow-color': '#000',
      'text-outline-color': '#000'})
    .selector("node:active")
    .css({
      'background-opacity': 0.7, 'overlay-color': '#d67614',
      'overlay-padding': '14'
    })
    .selector("edge")
    .css({
      'curve-style': 'bezier',
      'line-color': '#555',
      'target-arrow-fill': 'hollow',
      'source-arrow-fill': 'hollow',
      'width': 1.5,
      'target-arrow-color': '#555',
      'source-arrow-color': '#555',
      'text-border-color': function(ele){
        if(ele.selected()) {
          return '#d67614';
        }
        return ele.data('lineColor') || ele.css('line-color');
      },
      'color': function(ele){
        if(ele.selected()) {
          return '#d67614';
        }
        return ele.data('lineColor') || ele.css('line-color');
      }
//          'target-arrow-shape': 'data(sbgnclass)'
    })
    .selector("edge[sbgncardinality > 0]")
    .css({
      'text-rotation': 'autorotate',
      'text-background-shape': 'rectangle',
      'text-border-opacity': '1',
      'text-border-width': '1'
    })
    .selector("edge[sbgnclass='consumption'][sbgncardinality > 0]")
    .css({
      'source-label': function(ele) {
        return '' + ele.data('sbgncardinality');
      },
      'source-text-margin-y': '-10',
      'source-text-offset': function(ele) {
        return getCardinalityDistance(ele);
      }
    })
    .selector("edge[sbgnclass='production'][sbgncardinality > 0]")
    .css({
      'target-label': function(ele) {
        return '' + ele.data('sbgncardinality');
      },
      'target-text-margin-y': '-10',
      'target-text-offset': function(ele) {
        return getCardinalityDistance(ele);
      }
    })
    .selector("edge[sbgnclass]")
    .css({
      'target-arrow-shape': function (ele) {
        return getCyArrowShape(ele);
      },
      'source-arrow-shape': 'none'
    })
    .selector("edge[sbgnclass='inhibition']")
    .css({
      'target-arrow-fill': 'filled'
    })
    .selector("edge[sbgnclass='consumption']")
    .css({
//      'line-style': 'consumption'
    })
    .selector("edge[sbgnclass='production']")
    .css({
      'target-arrow-fill': 'filled',
//      'line-style': 'production'
    })
    .selector("edge:selected")
    .css({
      'line-color': '#d67614',
      'source-arrow-color': '#d67614',
      'target-arrow-color': '#d67614'
    })
    .selector("edge:active")
    .css({
      'background-opacity': 0.7, 'overlay-color': '#d67614',
      'overlay-padding': '8'
    })
    .selector("core")
    .css({
      'selection-box-color': '#d67614',
      'selection-box-opacity': '0.2', 'selection-box-border-color': '#d67614'
    })
    .selector(".ui-cytoscape-edgehandles-source")
    .css({
      'border-color': '#5CC2ED',
      'border-width': 3
    })
    .selector(".ui-cytoscape-edgehandles-target, node.ui-cytoscape-edgehandles-preview")
    .css({
      'background-color': '#5CC2ED'
    })
    .selector("edge.ui-cytoscape-edgehandles-preview")
    .css({
      'line-color': '#5CC2ED'
    })
    .selector("node.ui-cytoscape-edgehandles-preview, node.intermediate")
    .css({
      'shape': 'rectangle',
      'width': 15,
      'height': 15
    })
    .selector('edge.meta')
    .css({
      'line-color': '#C4C4C4',
      'source-arrow-color': '#C4C4C4',
      'target-arrow-color': '#C4C4C4'
    })
    .selector("edge.meta:selected")
    .css({
      'line-color': '#d67614',
      'source-arrow-color': '#d67614',
      'target-arrow-color': '#d67614'
    })
    .selector("node.changeBackgroundOpacity[backgroundOpacity]")
    .css({
      'background-opacity': 'data(backgroundOpacity)'
    })
    .selector("node.changeLabelTextSize")
    .css({
      'font-size': function (ele) {
        return getLabelTextSize(ele);
      }
    })
    .selector("node.changeContent")
    .css({
      'content': function (ele) {
        return getElementContent(ele);
      }
    })
    .selector("node.changeBorderColor")
    .css({
      'border-color': 'data(borderColor)'
    })
    .selector("node.changeBorderColor:selected")
    .css({
      'border-color': '#d67614'
    })
    .selector("edge.changeLineColor")
    .css({
      'line-color': 'data(lineColor)',
      'source-arrow-color': 'data(lineColor)',
      'target-arrow-color': 'data(lineColor)'
    })
    .selector("edge.changeLineColor:selected")
    .css({
      'line-color': '#d67614',
      'source-arrow-color': '#d67614',
      'target-arrow-color': '#d67614'
    })
    .selector('edge.changeLineColor.meta')
    .css({
      'line-color': '#C4C4C4',
      'source-arrow-color': '#C4C4C4',
      'target-arrow-color': '#C4C4C4'
    })
    .selector("edge.changeLineColor.meta:selected")
    .css({
      'line-color': '#d67614',
      'source-arrow-color': '#d67614',
      'target-arrow-color': '#d67614'
    }).selector("node.changeClonedStatus")
    .css({
      'background-image-opacity': function (ele) {
        if(!ele.data('sbgnclonemarker')){
          return 0;
        }
        return ele.css('background-opacity');
      }
    }).selector("node.noderesized")
    .css({
      'width': 'data(sbgnbbox.w)',
      'height': 'data(sbgnbbox.h)'
    });
// end of sbgnStyleSheet

var NotyView = Backbone.View.extend({
  render: function () {
    //this.model["theme"] = " twitter bootstrap";
    this.model["layout"] = "bottomRight";
    this.model["timeout"] = 8000;
    this.model["text"] = "Right click on a gene to see its details!";

    noty(this.model);
    return this;
  }
});

var SBGNContainer = Backbone.View.extend({
  cyStyle: sbgnStyleSheet,
  render: function () {
    (new NotyView({
      template: "#noty-info",
      model: {}
    })).render();

    var container = $(this.el);
    // container.html("");
    // container.append(_.template($("#loading-template").html()));


    var cytoscapeJsGraph = (this.model.cytoscapeJsGraph);

    var positionMap = {};
    //add position information to data for preset layout
    for (var i = 0; i < cytoscapeJsGraph.nodes.length; i++) {
      var xPos = cytoscapeJsGraph.nodes[i].data.sbgnbbox.x;
      var yPos = cytoscapeJsGraph.nodes[i].data.sbgnbbox.y;
      positionMap[cytoscapeJsGraph.nodes[i].data.id] = {'x': xPos, 'y': yPos};
    }

    var cyOptions = {
      elements: cytoscapeJsGraph,
      style: sbgnStyleSheet,
      layout: {
        name: 'preset',
        positions: positionMap
      },
      showOverlay: false, minZoom: 0.125, maxZoom: 16,
      boxSelectionEnabled: true,
      motionBlur: true,
      wheelSensitivity: 0.1,
      ready: function ()
      {
        window.cy = this;
        registerUndoRedoActions();

        // register the extensions

        cy.expandCollapse(getExpandCollapseOptions());
        
        cy.autopanOnDrag();
        
        var contextMenus = cy.contextMenus({
          menuItemClasses: ['customized-context-menus-menu-item']
        });
        
        cy.edgeBendEditing({
          // this function specifies the positions of bend points
          bendPositionsFunction: function(ele) {
            return ele.data('bendPointPositions');
          },
          // whether the bend editing operations are undoable (requires cytoscape-undo-redo.js)
          undoable: true,
          // title of remove bend point menu item
          removeBendMenuItemTitle: "Delete Bend Point"
        });
        
        contextMenus.appendMenuItems([
          {
            id: 'ctx-menu-sbgn-properties',
            title: 'Properties...',
            coreAsWell: true,
            onClickFunction: function (event) { 
              $("#sbgn-properties").trigger("click");
            }
          },
          {
            id: 'ctx-menu-delete',
            title: 'Delete',
            selector: 'node, edge', 
            onClickFunction: function (event) { 
              cy.undoRedo().do("removeEles", event.cyTarget);
            }
          },
          {
            id: 'ctx-menu-delete-selected', 
            title: 'Delete Selected', 
            onClickFunction: function () { 
              $("#delete-selected-simple").trigger('click');
            },
            coreAsWell: true // Whether core instance have this item on cxttap
          },
          {
            id: 'ctx-menu-hide-selected', 
            title: 'Hide Selected', 
            onClickFunction: function () { 
              $("#hide-selected").trigger('click');
            },
            coreAsWell: true // Whether core instance have this item on cxttap
          },
          {
            id: 'ctx-menu-show-all', 
            title: 'Show All', 
            onClickFunction: function () { 
              $("#show-all").trigger('click');
            },
            coreAsWell: true // Whether core instance have this item on cxttap
          },
          {
            id: 'ctx-menu-expand', // ID of menu item
            title: 'Expand', // Title of menu item
            // Filters the elements to have this menu item on cxttap
            // If the selector is not truthy no elements will have this menu item on cxttap
            selector: 'node[expanded-collapsed="collapsed"]', 
            onClickFunction: function (event) { // The function to be executed on click
              cy.undoRedo().do("expand", {
                nodes: event.cyTarget
              });
            }
          },
          {
            id: 'ctx-menu-collapse',
            title: 'Collapse',
            selector: 'node[expanded-collapsed="expanded"]', 
            onClickFunction: function (event) {
              cy.undoRedo().do("collapse", {
                nodes: event.cyTarget
              });
            }
          },
          {
            id: 'ctx-menu-perform-layout', 
            title: 'Perform Layout', 
            onClickFunction: function () { 
              if (modeHandler.mode == "selection-mode") {
                $("#perform-layout").trigger('click');
              }
            },
            coreAsWell: true // Whether core instance have this item on cxttap
          },
          {
            id: 'ctx-menu-select-all-object-of-this-type', 
            title: 'Select Objects of This Type', 
            selector: 'node, edge', 
            onClickFunction: function (event) { 
              var cyTarget = event.cyTarget;
              var sbgnclass = cyTarget.data('sbgnclass');
              
              cy.elements().unselect();
              cy.elements('[sbgnclass="' + sbgnclass + '"]').select();
            }
          }
        ]);

        cy.clipboard({
          clipboardSize: 5, // Size of clipboard. 0 means unlimited. If size is exceeded, first added item in clipboard will be removed.
          shortcuts: {
            enabled: false, // Whether keyboard shortcuts are enabled
            undoable: true // and if undoRedo extension exists
          }
        });

        cy.viewUtilities({
          node: {
            highlighted: {
              'border-width': '10px'
            }, // styles for when nodes are highlighted.
            unhighlighted: {// styles for when nodes are unhighlighted.
              'opacity': function (ele) {
                return ele.css('opacity');
              }
            },
            hidden: {
              "display": "none"
            }
          },
          edge: {
            highlighted: {
              'width': '10px'
            }, // styles for when edges are highlighted.
            unhighlighted: {// styles for when edges are unhighlighted.
              'opacity': function (ele) {
                return ele.css('opacity');
              }
            },
            hidden: {
              "display": "none"
            }
          }
        });

        var fixedAspectRatioModeTypes = ["source and sink", "process", "omitted process", "uncertain process", "association", "dissociation", "and", "or", "not"];
        cy.nodeResize({
          padding: 2, // spacing between node and grapples/rectangle
          undoable: true, // and if cy.undoRedo exists

          grappleSize: 7, // size of square dots
          grappleColor: "#d67614", // color of grapples
          inactiveGrappleStroke: "inside 1px #d67614",
          boundingRectangle: true, // enable/disable bounding rectangle
          boundingRectangleLineDash: [1.5, 1.5], // line dash of bounding rectangle
          boundingRectangleLineColor: "darkgray",
          boundingRectangleLineWidth: 1.5,
          zIndex: 999,

          minWidth: function (node) {
            var data = node.data("resizeMinWidth");
            return data ? data : 10;
          }, // a function returns min width of node
          minHeight: function (node) {
            var data = node.data("resizeMinHeight");
            return data ? data : 10;
          }, // a function returns min height of node

          isFixedAspectRatioResizeMode: function (node) {
            var sbgnclass = node.data("sbgnclass");
            return fixedAspectRatioModeTypes.indexOf(sbgnclass) >= 0;
          },// with only 4 active grapples (at corners)
          isNoResizeMode: function (node) { return node.is(".noResizeMode, :parent") }, // no active grapples
          
          isFixedAspectRatioResizeMode: function(node) {
            return window.nodeResizeUseAspectRatio;
          },

          cursors: { // See http://www.w3schools.com/cssref/tryit.asp?filename=trycss_cursor
            // May take any "cursor" css property
            default: "default", // to be set after resizing finished or mouseleave
            inactive: "not-allowed",
            nw: "nw-resize",
            n: "n-resize",
            ne: "ne-resize",
            e: "e-resize",
            se: "se-resize",
            s: "s-resize",
            sw: "sw-resize",
            w: "w-resize"
          }
        });

        var edges = cy.edges();

        refreshPaddings();
        initilizeUnselectedDataOfElements();

        //For adding edges interactively
        cy.edgehandles({
          complete: function (sourceNode, targetNodes, addedEntities) {
            // fired when edgehandles is done and entities are added
            var param = {};
            var source = sourceNode.id();
            var target = targetNodes[0].id();
            var sourceClass = sourceNode.data('sbgnclass');
            var targetClass = targetNodes[0].data('sbgnclass');
            var sbgnclass = modeHandler.elementsHTMLNameToName[modeHandler.selectedEdgeType];

            if (sbgnclass == 'consumption' || sbgnclass == 'modulation'
                || sbgnclass == 'stimulation' || sbgnclass == 'catalysis'
                || sbgnclass == 'inhibition' || sbgnclass == 'necessary stimulation') {
              if (!isEPNClass(sourceClass) || !isPNClass(targetClass)) {
                if (isPNClass(sourceClass) && isEPNClass(targetClass)) {
                  //If just the direction is not valid reverse the direction
                  var temp = source;
                  source = target;
                  target = temp;
                }
                else {
                  return;
                }
              }
            }
            else if (sbgnclass == 'production') {
              if (!isPNClass(sourceClass) || !isEPNClass(targetClass)) {
                if (isEPNClass(sourceClass) && isPNClass(targetClass)) {
                  //If just the direction is not valid reverse the direction
                  var temp = source;
                  source = target;
                  target = temp;
                }
                else {
                  return;
                }
              }
            }
            else if (sbgnclass == 'logic arc') {
              var invalid = false;
              if (!isEPNClass(sourceClass) || !isLogicalOperator(targetClass)) {
                if (isLogicalOperator(sourceClass) && isEPNClass(targetClass)) {
                  //If just the direction is not valid reverse the direction
                  var temp = source;
                  source = target;
                  target = temp;
                }
                else {
                  invalid = true;
                }
              }
              
              // the case that both sides are logical operators are valid too
              if(isLogicalOperator(sourceClass) && isLogicalOperator(targetClass)) {
                invalid = false;
              }
              
              if( invalid ) {
                return;
              }
            }
            else if (sbgnclass == 'equivalence arc') {
              if (!(isEPNClass(sourceClass) && convenientToEquivalence(targetClass))
                  && !(isEPNClass(targetClass) && convenientToEquivalence(sourceClass))) {
                return;
              }
            }

            param.newEdge = {
              source: source,
              target: target,
              sbgnclass: sbgnclass
            };
            param.firstTime = true;

            cy.undoRedo().do("addEdge", param);
            
            if( !modeHandler.sustainMode ) {
              modeHandler.setSelectionMode();
            }
            
            cy.edges()[cy.edges().length - 1].select();
          }
        });

        cy.edgehandles('drawoff');

        var panProps = ({
          fitPadding: 10,
          fitSelector: ':visible',
          animateOnFit: function(){
            return sbgnStyleRules['animate-on-drawing-changes'];
          },
          animateOnZoom: function(){
            return sbgnStyleRules['animate-on-drawing-changes'];
          }
        });

        container.cytoscapePanzoom(panProps);


        cy.gridGuide({
          drawGrid: sbgnStyleRules['show-grid'],
          snapToGrid: sbgnStyleRules['snap-to-grid'],
          discreteDrag: sbgnStyleRules['discrete-drag'],
          gridSpacing: sbgnStyleRules['grid-size'],
          resize: sbgnStyleRules['auto-resize-nodes'],
          guidelines: sbgnStyleRules['show-alignment-guidelines'],
          guidelinesTolerance: sbgnStyleRules['guideline-tolerance'],
          guidelinesStyle: {
            strokeStyle: sbgnStyleRules['guideline-color']
          }
        });

        // listen events

        cy.on("beforeCollapse", "node", function (event) {
          var node = this;
          //The children info of complex nodes should be shown when they are collapsed
          if (node._private.data.sbgnclass == "complex") {
            //The node is being collapsed store infolabel to use it later
            var infoLabel = getInfoLabel(node);
            node._private.data.infoLabel = infoLabel;
          }
        });

        cy.on("afterCollapse", "node", function (event) {
          var node = this;
          refreshPaddings();

          if (node._private.data.sbgnclass == "complex") {
            node.addClass('changeContent');
          }
        });

        cy.on("beforeExpand", "node", function (event) {
          var node = this;
          node.removeData("infoLabel");
        });

        cy.on("afterExpand", "node", function (event) {
          var node = this;
          cy.nodes().updateCompoundBounds();

          //Don't show children info when the complex node is expanded
          if (node._private.data.sbgnclass == "complex") {
            node.removeStyle('content');
          }

          refreshPaddings();
        });
        
        cy.on("resizeend", function(event, type, nodes) {
          nodeResizeEndFunction(nodes);
        });

        cy.on("afterDo", function(event, actionName, args){
          refreshUndoRedoButtonsStatus();
        });

        cy.on("afterUndo", function(event, actionName, args){
          refreshUndoRedoButtonsStatus();
          
          if(actionName === 'resize') {
            nodeResizeEndFunction(args.nodes);
          }
        });

        cy.on("afterRedo", function(event, actionName, args){
          refreshUndoRedoButtonsStatus();
          
          if(actionName === 'resize') {
            nodeResizeEndFunction(args.nodes);
          }
        });

        cy.on("mousedown", "node", function (event) {
          var self = this;
          if (modeHandler.mode == 'selection-mode' && window.ctrlKeyDown) {
            enableDragAndDropMode();
            window.nodesToDragAndDrop = self.union(cy.nodes(':selected'));
            window.dragAndDropStartPosition = event.cyPosition;
          }
        });

        cy.on("mouseup", function (event) {
          var self = event.cyTarget;
          if (window.dragAndDropModeEnabled) {
            var newParent;
            if (self != cy) {
              newParent = self;
              
              if(newParent.data("sbgnclass") != "complex" && newParent.data("sbgnclass") != "compartment") {
                newParent = newParent.parent()[0];
              }
            }
            var nodes = window.nodesToDragAndDrop;

            if(newParent && newParent.data("sbgnclass") != "complex" && newParent.data("sbgnclass") != "compartment") {
              return;
            }

            if (newParent && newParent.data("sbgnclass") == "complex") {
              nodes = nodes.filter(function(i, ele) {
                return isEPNClass(ele.data("sbgnclass"));
              });
            }
            
            nodes = nodes.filter(function(i, ele) {
              if(!newParent) {
                return ele.data('parent') != null;
              }
              return ele.data('parent') !== newParent.id();
            });
            
            if (newParent) {
              nodes = nodes.difference( newParent.ancestors() );
            }
            
            if(nodes.length === 0) {
              return;
            }

            disableDragAndDropMode();
            var parentData = newParent ? newParent.id() : null;

            var param = {
              firstTime: true,
              parentData: parentData, // It keeps the newParentId (Just an id for each nodes for the first time)
              nodes: nodes,
              posDiffX: event.cyPosition.x - window.dragAndDropStartPosition.x,
              posDiffY: event.cyPosition.y - window.dragAndDropStartPosition.y
            };
            
            window.dragAndDropStartPosition = null;
            window.nodesToDragAndDrop = null;
            
            cy.undoRedo().do("changeParent", param);
          }
        });


        function removeQtip(e) {
          if (this.qtipTimeOutFcn != null) {
            clearTimeout(this.qtipTimeOutFcn);
            this.qtipTimeOutFcn = null;
          }
          this.mouseover = false;           //make preset layout to redraw the nodes
          this.removeData("showingTooltip");
          cy.off('mouseout', 'node', removeQtip);
          cy.off("drag", "node", removeQtip);
          $(".qtip").remove();
          cy.forceRender();
        }

        cy.on("mouseover", "node", function (e) {
          e.cy.$("[showingTooltip]").trigger("hideTooltip");
          e.cyTarget.trigger("showTooltip");
        });


        cy.on("hideTooltip", "node", removeQtip);

        cy.on('showTooltip', 'node', function (e) {
          var node = this;
          
          if (node.renderedStyle("label") == node.data("sbgnlabel") && node.data("sbgnstatesandinfos").length == 0 &&  node.data("sbgnclass") != "complex")
              return;

           node.data("showingTooltip", true);
          $(".qtip").remove();

          if (e.originalEvent.shiftKey)
            return;

          node.qtipTimeOutFcn = setTimeout(function () {
            nodeQtipFunction(node);
          }, 1000);
          cy.on('mouseout', 'node', removeQtip);
          cy.on("drag", "node", removeQtip)
        });

//        var cancelSelection;
//        var selectAgain;
        window.firstSelectedNode = null;
        cy.on('select', 'node', function (event) {
//          if (cancelSelection) {
//            this.unselect();
//            cancelSelection = null;
//            selectAgain.select();
//            selectAgain = null;
//          }
          if (cy.nodes(':selected').filter(':visible').length == 1) {
            window.firstSelectedNode = this;
          }
        });

        cy.on('unselect', 'node', function (event) {
          if (window.firstSelectedNode == this) {
            window.firstSelectedNode = null;
          }
        });

        cy.on('select', function (event) {
          inspectorUtilities.handleSBGNInspector();
        });

        cy.on('unselect', function (event) {
          inspectorUtilities.handleSBGNInspector();
        });
        
        cy.on('drag', 'node', function (event) {
          cy.style().update();
        });

        cy.on('tap', function (event) {
          $('input').blur();

          if (modeHandler.mode == "add-node-mode") {
            var cyPosX = event.cyPosition.x;
            var cyPosY = event.cyPosition.y;
            var param = {};
            var sbgnclass = modeHandler.elementsHTMLNameToName[modeHandler.selectedNodeType];

            param.newNode = {
              x: cyPosX,
              y: cyPosY,
              sbgnclass: sbgnclass
            };
            param.firstTime = true;

            cy.undoRedo().do("addNode", param);
            
            if( !modeHandler.sustainMode ) {
              modeHandler.setSelectionMode();
            }
            
            cy.nodes()[cy.nodes().length - 1].select();
          }
        });

        var tappedBefore = null;

        cy.on('doubleTap', 'node', function (event) {
          if (modeHandler.mode == 'selection-mode') {
            var node = this;
            
            if (!canHaveSBGNLabel( node )) {
              return;
            }
            
            var containerPos = $(cy.container()).position();
            var left = containerPos.left + this.renderedPosition().x;
            left -= $("#node-label-textbox").width() / 2;
            left = left.toString() + 'px';
            var top = containerPos.top + this.renderedPosition().y;
            top -= $("#node-label-textbox").height() / 2;
            top = top.toString() + 'px';

            $("#node-label-textbox").css('left', left);
            $("#node-label-textbox").css('top', top);
            $("#node-label-textbox").show();
            var sbgnlabel = this._private.data.sbgnlabel;
            if (sbgnlabel == null) {
              sbgnlabel = "";
            }
            $("#node-label-textbox").val(sbgnlabel);
            $("#node-label-textbox").data('node', this);
            $("#node-label-textbox").focus();
          }
        });

        cy.on('tap', 'node', function (event) {
          var node = this;

          var tappedNow = event.cyTarget;
          setTimeout(function () {
            tappedBefore = null;
          }, 300);
          if (tappedBefore === tappedNow) {
            tappedNow.trigger('doubleTap');
            tappedBefore = null;
          } else {
            tappedBefore = tappedNow;
          }
        });
      }
    };

    container.html("");
    endSpinner("load-file-spinner");
    container.cy(cyOptions);
    return this;
  }
});

var PromptSave = Backbone.View.extend({
  
  initialize: function () {
    var self = this;
    self.template = _.template($("#prompt-save-template").html());
  },
  render: function (afterFunction) {
    var self = this;
    self.template = _.template($("#prompt-save-template").html());
    $(self.el).html(self.template);

    dialogUtilities.openDialog(self.el, {width: "auto", height: "auto", "minHeight": "none"});

    $(document).off("click", "#prompt-save-accept").on("click", "#prompt-save-accept", function (evt) {
      $("#save-as-sbgnml").trigger('click');
      afterFunction();
      $(self.el).dialog('close');
    });
    
    $(document).off("click", "#prompt-save-reject").on("click", "#prompt-save-reject", function (evt) {
      afterFunction();
      $(self.el).dialog('close');
    });
    
    $(document).off("click", "#prompt-save-cancel").on("click", "#prompt-save-cancel", function (evt) {
      $(self.el).dialog('close');
    });

    return this;
  }
});

var SBGNLayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: 'cose-bilkent',
    nodeRepulsion: 4500,
    idealEdgeLength: 50,
    edgeElasticity: 0.45,
    nestingFactor: 0.1,
    gravity: 0.25,
    numIter: 2500,
    tile: true,
    animationEasing: 'cubic-bezier(0.19, 1, 0.22, 1)',
    animate: 'end',
    animationDuration: 1000,
    randomize: false,
    tilingPaddingVertical: function () {
      return calculateTilingPaddings(parseInt(sbgnStyleRules['tiling-padding-vertical'], 10));
    },
    tilingPaddingHorizontal: function () {
      return calculateTilingPaddings(parseInt(sbgnStyleRules['tiling-padding-horizontal'], 10));
    },
    gravityRangeCompound: 1.5,
    gravityCompound: 1.0,
    gravityRange: 3.8,
    stop: function(){
      if($('.layout-spinner').length > 0){
        $('.layout-spinner').remove();
      }
    }
  },
  currentLayoutProperties: null,
  initialize: function () {
    var self = this;
    self.copyProperties();

    var templateProperties = _.clone(self.currentLayoutProperties);
    templateProperties.tilingPaddingVertical = sbgnStyleRules['tiling-padding-vertical'];
    templateProperties.tilingPaddingHorizontal = sbgnStyleRules['tiling-padding-horizontal'];

    self.template = _.template($("#layout-settings-template").html());
    self.template = self.template(templateProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
  },
  applyLayout: function (preferences, undoable) {
    if(preferences === undefined){
      preferences = {};
    }
    var options = $.extend({}, this.currentLayoutProperties, preferences);
    if(undoable === false) {
      cy.elements().filter(':visible').layout(options);
    }
    else {
      cy.undoRedo().do("layout", {
        options: options,
        eles: cy.elements().filter(':visible')
      });
    }
  },
  render: function () {
    var self = this;

    var templateProperties = _.clone(self.currentLayoutProperties);
    templateProperties.tilingPaddingVertical = sbgnStyleRules['tiling-padding-vertical'];
    templateProperties.tilingPaddingHorizontal = sbgnStyleRules['tiling-padding-horizontal'];

    self.template = _.template($("#layout-settings-template").html());
    self.template = self.template(templateProperties);
    $(self.el).html(self.template);

    dialogUtilities.openDialog(self.el);

    $(document).off("click", "#save-layout").on("click", "#save-layout", function (evt) {
      self.currentLayoutProperties.nodeRepulsion = Number(document.getElementById("node-repulsion").value);
      self.currentLayoutProperties.idealEdgeLength = Number(document.getElementById("ideal-edge-length").value);
      self.currentLayoutProperties.edgeElasticity = Number(document.getElementById("edge-elasticity").value);
      self.currentLayoutProperties.nestingFactor = Number(document.getElementById("nesting-factor").value);
      self.currentLayoutProperties.gravity = Number(document.getElementById("gravity").value);
      self.currentLayoutProperties.numIter = Number(document.getElementById("num-iter").value);
      self.currentLayoutProperties.tile = document.getElementById("tile").checked;
      self.currentLayoutProperties.animate = document.getElementById("animate").checked?'during':'end';
      self.currentLayoutProperties.randomize = !document.getElementById("incremental").checked;
      self.currentLayoutProperties.gravityRangeCompound = Number(document.getElementById("gravity-range-compound").value);
      self.currentLayoutProperties.gravityCompound = Number(document.getElementById("gravity-compound").value);
      self.currentLayoutProperties.gravityRange = Number(document.getElementById("gravity-range").value);

      sbgnStyleRules['tiling-padding-vertical'] = Number(document.getElementById("tiling-padding-vertical").value);
      sbgnStyleRules['tiling-padding-horizontal'] = Number(document.getElementById("tiling-padding-horizontal").value);
    });

    $(document).off("click", "#default-layout").on("click", "#default-layout", function (evt) {
      self.copyProperties();

      sbgnStyleRules['tiling-padding-vertical'] = defaultSbgnStyleRules['tiling-padding-vertical'];
      sbgnStyleRules['tiling-padding-horizontal'] = defaultSbgnStyleRules['tiling-padding-horizontal'];

      var templateProperties = _.clone(self.currentLayoutProperties);
      templateProperties.tilingPaddingVertical = sbgnStyleRules['tiling-padding-vertical'];
      templateProperties.tilingPaddingHorizontal = sbgnStyleRules['tiling-padding-horizontal'];

      self.template = _.template($("#layout-settings-template").html());
      self.template = self.template(templateProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});

var SBGNProperties = Backbone.View.extend({
  defaultSBGNProperties: {
    compoundPadding: parseInt(sbgnStyleRules['compound-padding'], 10),
    dynamicLabelSize: sbgnStyleRules['dynamic-label-size'],
    fitLabelsToNodes: sbgnStyleRules['fit-labels-to-nodes'],
    rearrangeAfterExpandCollapse: sbgnStyleRules['rearrange-after-expand-collapse'],
    animateOnDrawingChanges: sbgnStyleRules['animate-on-drawing-changes'],
    adjustNodeLabelFontSizeAutomatically: sbgnStyleRules['adjust-node-label-font-size-automatically']
  },
  currentSBGNProperties: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    self.template = _.template($("#sbgn-properties-template").html());
    self.template = self.template(self.currentSBGNProperties);
  },
  copyProperties: function () {
    this.currentSBGNProperties = _.clone(this.defaultSBGNProperties);
  },
  render: function () {
    var self = this;
    self.template = _.template($("#sbgn-properties-template").html());
    self.template = self.template(self.currentSBGNProperties);
    $(self.el).html(self.template);

    dialogUtilities.openDialog(self.el);

    $(document).off("click", "#save-sbgn").on("click", "#save-sbgn", function (evt) {

      var param = {};
      param.firstTime = true;
      param.previousSBGNProperties = _.clone(self.currentSBGNProperties);

      self.currentSBGNProperties.compoundPadding = Number(document.getElementById("compound-padding").value);
      self.currentSBGNProperties.dynamicLabelSize = $('select[name="dynamic-label-size"] option:selected').val();
      self.currentSBGNProperties.fitLabelsToNodes = document.getElementById("fit-labels-to-nodes").checked;
      self.currentSBGNProperties.rearrangeAfterExpandCollapse =
          document.getElementById("rearrange-after-expand-collapse").checked;
      self.currentSBGNProperties.animateOnDrawingChanges =
          document.getElementById("animate-on-drawing-changes").checked;
      self.currentSBGNProperties.adjustNodeLabelFontSizeAutomatically =
          document.getElementById("adjust-node-label-font-size-automatically").checked;

      //Refresh paddings if needed
      if (sbgnStyleRules['compound-padding'] != self.currentSBGNProperties.compoundPadding) {
        sbgnStyleRules['compound-padding'] = self.currentSBGNProperties.compoundPadding;
        refreshPaddings();
      }
      //Refresh label size if needed
      if (sbgnStyleRules['dynamic-label-size'] != self.currentSBGNProperties.dynamicLabelSize) {
        sbgnStyleRules['dynamic-label-size'] = '' + self.currentSBGNProperties.dynamicLabelSize;
        cy.nodes().removeClass('changeLabelTextSize');
        cy.nodes().addClass('changeLabelTextSize');
      }
      //Refresh truncations if needed
      if (sbgnStyleRules['fit-labels-to-nodes'] != self.currentSBGNProperties.fitLabelsToNodes) {
        sbgnStyleRules['fit-labels-to-nodes'] = self.currentSBGNProperties.fitLabelsToNodes;
        cy.nodes().removeClass('changeContent');
        cy.nodes().addClass('changeContent');
      }

      sbgnStyleRules['rearrange-after-expand-collapse'] =
          self.currentSBGNProperties.rearrangeAfterExpandCollapse;

      sbgnStyleRules['animate-on-drawing-changes'] =
          self.currentSBGNProperties.animateOnDrawingChanges;
  
      //Refresh node label sizes if needed
      if (sbgnStyleRules['adjust-node-label-font-size-automatically'] != self.currentSBGNProperties.adjustNodeLabelFontSizeAutomatically) {
        sbgnStyleRules['adjust-node-label-font-size-automatically'] = self.currentSBGNProperties.adjustNodeLabelFontSizeAutomatically;
        cy.nodes().removeClass('changeLabelTextSize');
        cy.nodes().addClass('changeLabelTextSize');
      }
    });

    $(document).off("click", "#default-sbgn").on("click", "#default-sbgn", function (evt) {
      self.copyProperties();
      self.template = _.template($("#sbgn-properties-template").html());
      self.template = self.template(self.currentSBGNProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});

var GridProperties = Backbone.View.extend({
  defaultGridProperties: {
    showGrid: sbgnStyleRules['show-grid'],
    snapToGrid: sbgnStyleRules['snap-to-grid'],
    discreteDrag: sbgnStyleRules['discrete-drag'],
    gridSize: sbgnStyleRules['grid-size'],
    autoResizeNodes: sbgnStyleRules['auto-resize-nodes'],
    showAlignmentGuidelines: sbgnStyleRules['show-alignment-guidelines'],
    guidelineTolerance: sbgnStyleRules['guideline-tolerance'],
    guidelineColor: sbgnStyleRules['guideline-color']
  },
  currentGridProperties: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    self.template = _.template($("#grid-properties-template").html());
    self.template = self.template(self.currentGridProperties);
  },
  copyProperties: function () {
    this.currentGridProperties = _.clone(this.defaultGridProperties);
  },
  render: function () {
    var self = this;
    self.template = _.template($("#grid-properties-template").html());
    self.template = self.template(self.currentGridProperties);
    $(self.el).html(self.template);

    dialogUtilities.openDialog(self.el);

    $(document).off("click", "#save-grid").on("click", "#save-grid", function (evt) {

      var param = {};
      param.firstTime = true;
      param.previousGrid = _.clone(self.currentGridProperties);

      self.currentGridProperties.showGrid = document.getElementById("show-grid").checked;
      self.currentGridProperties.snapToGrid = document.getElementById("snap-to-grid").checked;
      self.currentGridProperties.gridSize = Number(document.getElementById("grid-size").value);
      self.currentGridProperties.discreteDrag = document.getElementById("discrete-drag").checked;
      self.currentGridProperties.autoResizeNodes = document.getElementById("auto-resize-nodes").checked;
      self.currentGridProperties.showAlignmentGuidelines = document.getElementById("show-alignment-guidelines").checked;
      self.currentGridProperties.guidelineTolerance = Number(document.getElementById("guideline-tolerance").value);
      self.currentGridProperties.guidelineColor = document.getElementById("guideline-color").value;

      sbgnStyleRules["show-grid"] = document.getElementById("show-grid").checked;
      sbgnStyleRules["snap-to-grid"] = document.getElementById("snap-to-grid").checked;
      sbgnStyleRules["grid-size"] = Number(document.getElementById("grid-size").value);
      sbgnStyleRules["discrete-drag"] = document.getElementById("discrete-drag").checked;
      sbgnStyleRules["auto-resize-nodes"] = document.getElementById("auto-resize-nodes").checked;
      sbgnStyleRules["show-alignment-guidelines"] = document.getElementById("show-alignment-guidelines").checked;
      sbgnStyleRules["guideline-tolerance"] = Number(document.getElementById("guideline-tolerance").value);
      sbgnStyleRules["guideline-color"] = document.getElementById("guideline-color").value;


      cy.gridGuide({
        drawGrid: self.currentGridProperties.showGrid,
        snapToGrid: self.currentGridProperties.snapToGrid,
        gridSpacing: self.currentGridProperties.gridSize,
        discreteDrag: self.currentGridProperties.discreteDrag,
        resize: self.currentGridProperties.autoResizeNodes,
        guidelines: self.currentGridProperties.showAlignmentGuidelines,
        guidelinesTolerance: self.currentGridProperties.guidelineTolerance,
        guidelinesStyle: {
          strokeStyle: self.currentGridProperties.guidelineColor
        }
      });
    });

    $(document).off("click", "#default-grid").on("click", "#default-grid", function (evt) {
      self.copyProperties();
      self.template = _.template($("#grid-properties-template").html());
      self.template = self.template(self.currentGridProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});

var PathsBetweenQuery = Backbone.View.extend({
  defaultQueryParameters: {
    geneSymbols: "",
    lengthLimit: 1
//    shortestK: 0,
//    enableShortestKAlteration: false,
//    ignoreS2SandT2TTargets: false
  },
  currentQueryParameters: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    self.template = _.template($("#query-pathsbetween-template").html());
    self.template = self.template(self.currentQueryParameters);
  },
  copyProperties: function () {
    this.currentQueryParameters = _.clone(this.defaultQueryParameters);
  },
  render: function () {
    var self = this;
    self.template = _.template($("#query-pathsbetween-template").html());
    self.template = self.template(self.currentQueryParameters);
    $(self.el).html(self.template);

    $("#query-pathsbetween-enable-shortest-k-alteration").change(function(e){
      if(document.getElementById("query-pathsbetween-enable-shortest-k-alteration").checked){
        $( "#query-pathsbetween-shortest-k" ).prop( "disabled", false );
      }
      else {
        $( "#query-pathsbetween-shortest-k" ).prop( "disabled", true );
      }
    });

//    $(self.el).dialog({width:'auto'});
    dialogUtilities.openDialog(self.el, {width:'auto'});

    $(document).off("click", "#save-query-pathsbetween").on("click", "#save-query-pathsbetween", function (evt) {

      self.currentQueryParameters.geneSymbols = document.getElementById("query-pathsbetween-gene-symbols").value;
      self.currentQueryParameters.lengthLimit = Number(document.getElementById("query-pathsbetween-length-limit").value);
//      self.currentQueryParameters.shortestK = Number(document.getElementById("query-pathsbetween-shortest-k").value);
//      self.currentQueryParameters.enableShortestKAlteration =
//              document.getElementById("query-pathsbetween-enable-shortest-k-alteration").checked;
//      self.currentQueryParameters.ignoreS2SandT2TTargets =
//              document.getElementById("query-pathsbetween-ignore-s2s-t2t-targets").checked;

      var pc2URL = "http://www.pathwaycommons.org/pc2/";
      var format = "graph?format=SBGN";
      var kind = "&kind=PATHSBETWEEN";
      var limit = "&limit=" + self.currentQueryParameters.lengthLimit;
      var sources = "";
      var newfilename = "";

      var geneSymbolsArray = self.currentQueryParameters.geneSymbols.replace("\n"," ").replace("\t"," ").split(" ");
      for(var i = 0; i < geneSymbolsArray.length; i++){
        var currentGeneSymbol = geneSymbolsArray[i];
        if(currentGeneSymbol.length == 0 || currentGeneSymbol == ' ' || currentGeneSymbol == '\n' || currentGeneSymbol == '\t'){
          continue;
        }

        sources = sources + "&source=" + currentGeneSymbol;

        if(newfilename == ''){
          newfilename = currentGeneSymbol;
        }
        else{
          newfilename = newfilename + '_' + currentGeneSymbol;
        }
      }

      newfilename = newfilename + '_PBTWN.sbgnml';

      setFileContent(newfilename);
      pc2URL = pc2URL + format + kind + limit + sources;

      var containerWidth = cy.width();
      var containerHeight = cy.height();
      $('#sbgn-network-container').html('<i style="position: absolute; z-index: 9999999; left: ' + containerWidth / 2 + 'px; top: ' + containerHeight / 2 + 'px;" class="fa fa-spinner fa-spin fa-3x fa-fw"></i>');

      $.ajax(
          {
            url: pc2URL,
            type: 'GET',
            success: function(data)
            {
              (new SBGNContainer({
                el: '#sbgn-network-container',
                model: {cytoscapeJsGraph: sbgnmlToJson.convert(data)}
              })).render();
              inspectorUtilities.handleSBGNInspector();
            }
          });

      $(self.el).dialog('close');
    });

    $(document).off("click", "#cancel-query-pathsbetween").on("click", "#cancel-query-pathsbetween", function (evt) {
      $(self.el).dialog('close');
    });

    return this;
  }
});

var ReactionTemplate = Backbone.View.extend({
  defaultTemplateParameters: {
    templateType: "association",
    macromoleculeList: ["", ""],
    templateReactionEnableComplexName: true,
    templateReactionComplexName: "",
    getMacromoleculesHtml: function(){
      var html = "<table>";
      for( var i = 0; i < this.macromoleculeList.length; i++){
        html += "<tr><td>"
            + "<input type='text' class='template-reaction-textbox input-small layout-text' name='"
            + i + "'" + " value='" + this.macromoleculeList[i] + "'></input>"
            + "</td><td><img style='padding-bottom: 8px;' class='template-reaction-delete-button' width='12px' height='12px' name='" + i + "' src='sampleapp-images/delete.png'/></td></tr>";
      }

      html += "<tr><td><img id='template-reaction-add-button' src='sampleapp-images/add.png'/></td></tr></table>";
      return html;
    },
    getComplexHtml: function(){
      var html = "<table>"
          + "<tr><td><input type='checkbox' class='input-small layout-text' id='template-reaction-enable-complex-name'";

      if(this.templateReactionEnableComplexName){
        html += " checked ";
      }

      html += "/>"
          + "</td><td><input type='text' class='input-small layout-text' id='template-reaction-complex-name' value='"
          + this.templateReactionComplexName + "'";

      if(!this.templateReactionEnableComplexName){
        html += " disabled ";
      }

      html += "></input>"
          + "</td></tr></table>";

      return html;
    },
    getInputHtml: function(){
      if(this.templateType === 'association') {
        return this.getMacromoleculesHtml();
      }
      else if(this.templateType === 'dissociation'){
        return this.getComplexHtml();
      }
    },
    getOutputHtml: function(){
      if(this.templateType === 'association') {
        return this.getComplexHtml();
      }
      else if(this.templateType === 'dissociation'){
        return this.getMacromoleculesHtml();
      }
    }
  },
  currentTemplateParameters: undefined,
  initialize: function () {
    var self = this;
    self.copyProperties();
    self.template = _.template($("#reaction-template").html());
    self.template = self.template(self.currentTemplateParameters);
  },
  copyProperties: function () {
    this.currentTemplateParameters = jQuery.extend(true, [], this.defaultTemplateParameters);
  },
  render: function () {
    var self = this;
    self.template = _.template($("#reaction-template").html());
    self.template = self.template(self.currentTemplateParameters);
    $(self.el).html(self.template);

     dialogUtilities.openDialog(self.el, {width:'auto'});

    $(document).off('change', '#reaction-template-type-select').on('change', '#reaction-template-type-select', function (e) {
      var optionSelected = $("option:selected", this);
      var valueSelected = this.value;
      self.currentTemplateParameters.templateType = valueSelected;

      self.template = _.template($("#reaction-template").html());
      self.template = self.template(self.currentTemplateParameters);
      $(self.el).html(self.template);

      $(self.el).dialog({width:'auto'});
    });

    $(document).off("change", "#template-reaction-enable-complex-name").on("change", "#template-reaction-enable-complex-name", function(e){
      self.currentTemplateParameters.templateReactionEnableComplexName =
          !self.currentTemplateParameters.templateReactionEnableComplexName;
      self.template = _.template($("#reaction-template").html());
      self.template = self.template(self.currentTemplateParameters);
      $(self.el).html(self.template);

      $(self.el).dialog({width:'auto'});
    });

    $(document).off("change", "#template-reaction-complex-name").on("change", "#template-reaction-complex-name", function(e){
      self.currentTemplateParameters.templateReactionComplexName = $(this).val();
      self.template = _.template($("#reaction-template").html());
      self.template = self.template(self.currentTemplateParameters);
      $(self.el).html(self.template);

      $(self.el).dialog({width:'auto'});
    });

    $(document).off("click", "#template-reaction-add-button").on("click", "#template-reaction-add-button", function (event) {
      self.currentTemplateParameters.macromoleculeList.push("");

      self.template = _.template($("#reaction-template").html());
      self.template = self.template(self.currentTemplateParameters);
      $(self.el).html(self.template);

      $(self.el).dialog({width:'auto'});
    });

    $(document).off("change", ".template-reaction-textbox").on('change', ".template-reaction-textbox", function () {
      var index = parseInt($(this).attr('name'));
      var value = $(this).val();
      self.currentTemplateParameters.macromoleculeList[index] = value;

      self.template = _.template($("#reaction-template").html());
      self.template = self.template(self.currentTemplateParameters);
      $(self.el).html(self.template);

      $(self.el).dialog({width:'auto'});
    });

    $(document).off("click", ".template-reaction-delete-button").on("click", ".template-reaction-delete-button", function (event) {
      if(self.currentTemplateParameters.macromoleculeList.length <= 2){
        return;
      }

      var index = parseInt($(this).attr('name'));
      self.currentTemplateParameters.macromoleculeList.splice(index, 1);

      self.template = _.template($("#reaction-template").html());
      self.template = self.template(self.currentTemplateParameters);
      $(self.el).html(self.template);

      $(self.el).dialog({width:'auto'});
    });

    $(document).off("click", "#create-template").on("click", "#create-template", function (evt) {
      var param = {
        firstTime: true,
        templateType: self.currentTemplateParameters.templateType,
        processPosition: sbgnElementUtilities.convertToModelPosition({x: cy.width() / 2, y: cy.height() / 2}),
        macromoleculeList: jQuery.extend(true, [], self.currentTemplateParameters.macromoleculeList),
        complexName: self.currentTemplateParameters.templateReactionEnableComplexName?self.currentTemplateParameters.templateReactionComplexName:undefined,
        tilingPaddingVertical: calculateTilingPaddings(parseInt(sbgnStyleRules['tiling-padding-vertical'], 10)),
        tilingPaddingHorizontal: calculateTilingPaddings(parseInt(sbgnStyleRules['tiling-padding-horizontal'], 10))
      };

      cy.undoRedo().do("createTemplateReaction", param);

      self.copyProperties();
      $(self.el).dialog('close');
    });

    $(document).off("click", "#cancel-template").on("click", "#cancel-template", function (evt) {
      self.copyProperties();
      $(self.el).dialog('close');
    });

    return this;
  }
});

var FontProperties = Backbone.View.extend({
  defaultFontProperties: {
    fontFamily: "",
    fontSize: "",
    fontWeight: "",
    fontStyle: ""
  },
  currentFontProperties: undefined,
  copyProperties: function () {
    this.currentFontProperties = _.clone(this.defaultFontProperties);
  },
  fontFamilies: ["", "Helvetica", "Arial", "Calibri", "Cambria", "Comic Sans MS", "Consolas", "Corsiva"
    ,"Courier New" ,"Droid Sans", "Droid Serif", "Georgia", "Impact" 
    ,"Lato", "Roboto", "Source Sans Pro", "Syncopate", "Times New Roman"
    ,"Trebuchet MS", "Ubuntu", "Verdana"],
  getOptionIdByFontFamily: function(fontfamily) {
    var id = "font-properties-font-family-" + fontfamily;
    return id;
  },
  getFontFamilyByOptionId: function(id) {
    var lastIndex = id.lastIndexOf("-");
    var fontfamily = id.substr(lastIndex + 1);
    return fontfamily;
  },
  getFontFamilyHtml: function(self) {
    if(self == null){
      self = this;
    }
    
    var fontFamilies = self.fontFamilies;
    
    var html = "";
    html += "<select id='font-properties-select-font-family' class='input-medium layout-text' name='font-family-select'>";
    
    var optionsStr = "";
    
    for ( var i = 0; i < fontFamilies.length; i++ ) {
      var fontFamily = fontFamilies[i];
      var optionId = self.getOptionIdByFontFamily(fontFamily);
      var optionStr = "<option id='" + optionId + "'" 
              + " value='" + fontFamily + "' style='" + "font-family: " + fontFamily + "'";
      
      if (fontFamily === self.currentFontProperties.fontFamily) {
        optionStr += " selected";
      }
      
      optionStr += "> ";
      optionStr += fontFamily;
      optionStr += " </option>";
      
      optionsStr += optionStr;
    }
    
    html += optionsStr;
    
    html += "</select>";
    
    return html;
  },
  initialize: function () {
    var self = this;
    self.defaultFontProperties.getFontFamilyHtml = function(){
      return self.getFontFamilyHtml(self);
    };
    self.copyProperties();
    self.template = _.template($("#font-properties-template").html());
    self.template = self.template(self.defaultFontProperties);
  },
  extendProperties: function (eles) {
    var self = this;
    var commonProperties = {};
    
    var commonFontSize = getCommonLabelFontSize(eles);
    var commonFontWeight = getCommonLabelFontWeight(eles);
    var commonFontFamily = getCommonLabelFontFamily(eles);
    var commonFontStyle = getCommonLabelFontStyle(eles);
    
    if( commonFontSize != null ) {
      commonProperties.fontSize = commonFontSize;
    }
    
    if( commonFontWeight != null ) {
      commonProperties.fontWeight = commonFontWeight;
    }
    
    if( commonFontFamily != null ) {
      commonProperties.fontFamily = commonFontFamily;
    }
    
    if( commonFontStyle != null ) {
      commonProperties.fontStyle = commonFontStyle;
    }
    
    self.currentFontProperties = $.extend({}, this.defaultFontProperties, commonProperties);
  },
  render: function (eles) {
    var self = this;
    self.extendProperties(eles);
    self.template = _.template($("#font-properties-template").html());
    self.template = self.template(self.currentFontProperties);
    $(self.el).html(self.template);

    dialogUtilities.openDialog(self.el);

    $(document).off("click", "#set-font-properties").on("click", "#set-font-properties", function (evt) {
      var data = {};
      
      var labelsize = $('#font-properties-font-size').val();
      var fontfamily = $('select[name="font-family-select"] option:selected').val();
      var fontweight = $('select[name="font-weight-select"] option:selected').val();
      var fontstyle = $('select[name="font-style-select"] option:selected').val();
      
      if ( labelsize != '' ) {
        data.labelsize = parseInt(labelsize);
      }
      
      if ( fontfamily != '' ) {
        data.fontfamily = fontfamily;
      }
      
      if ( fontweight != '' ) {
        data.fontweight = fontweight;
      }
      
      if ( fontstyle != '' ) {
        data.fontstyle = fontstyle;
      }
      
      var keys = Object.keys(data);
      
      if(keys.length === 0) {
        return;
      }
      
      var validAction = false;
      
      for ( var i = 0; i < eles.length; i++ ) {
        var ele = eles[i];
        
        keys.forEach(function(key, idx) {
          if ( data[key] != ele.data(key) ) {
            validAction = true;
          }
        }); 
        
        if ( validAction ) {
          break;
        }
      }
      
      if ( validAction === false ) {
        return;
      }
      
      var param = {
        eles: eles,
        data: data,
        firstTime: true
      };

      cy.undoRedo().do("changeFontProperties", param);
      
      self.copyProperties();
//      $(self.el).dialog('close');
    });

    return this;
  }
});