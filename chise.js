(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sbgnviz = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function(){
  var chise = window.chise = function(_options, _libs) {
    var libs = {};
    libs.jQuery = _libs.jQuery || jQuery;
    libs.cytoscape = _libs.cytoscape || cytoscape;
    libs.sbgnviz = _libs.sbgnviz || sbgnviz;
    libs.saveAs = _libs.filesaverjs ? _libs.filesaverjs.saveAs : saveAs;
    
    libs.sbgnviz(_options, _libs); // Initilize sbgnviz
    
    // Set the libraries to access them from any file
    var libUtilities = _dereq_('./utilities/lib-utilities');
    libUtilities.setLibs(libs);
    
    var optionUtilities = _dereq_('./utilities/option-utilities');
    var options = optionUtilities.extendOptions(_options); // Extends the default options with the given options
    
    // Update style and bind events
    var cyStyleAndEvents = _dereq_('./utilities/cy-style-and-events');
    cyStyleAndEvents(libs.sbgnviz);
    
    // Register undo/redo actions
    var registerUndoRedoActions = _dereq_('./utilities/register-undo-redo-actions');
    registerUndoRedoActions(options.undoableDrag);
    
    var mainUtilities = _dereq_('./utilities/main-utilities');
    var elementUtilities = _dereq_('./utilities/element-utilities');
    var undoRedoActionFunctions = _dereq_('./utilities/undo-redo-action-functions');
    
    // Expose the api
    
    // Expose the properties inherited from sbgnviz
    // then override some of these properties and expose some new properties
    for (var prop in libs.sbgnviz) {
      chise[prop] = libs.sbgnviz[prop];
    }
    
    // Expose each main utility seperately
    for (var prop in mainUtilities) {
      chise[prop] = mainUtilities[prop];
    }
    
    // Expose elementUtilities and undoRedoActionFunctions as is
    chise.elementUtilities = elementUtilities;
    chise.undoRedoActionFunctions = undoRedoActionFunctions;
  };
  
  if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = chise;
  }
})();
},{"./utilities/cy-style-and-events":2,"./utilities/element-utilities":3,"./utilities/lib-utilities":4,"./utilities/main-utilities":5,"./utilities/option-utilities":6,"./utilities/register-undo-redo-actions":7,"./utilities/undo-redo-action-functions":8}],2:[function(_dereq_,module,exports){
var elementUtilities = _dereq_('./element-utilities');
var libs = _dereq_('./lib-utilities').getLibs();
var $ = libs.jQuery;
var options = _dereq_('./option-utilities').getOptions();

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
    cy.on("noderesize.resizeend", function (event, type, node) {
      nodeResizeEndFunction(node);
    });

    cy.on("afterDo", function (event, actionName, args) {
      
    });

    cy.on("afterUndo", function (event, actionName, args) {
      if (actionName === 'resize') {
        nodeResizeEndFunction(args.node);
      }
    });

    cy.on("afterRedo", function (event, actionName, args) {
      if (actionName === 'resize') {
        nodeResizeEndFunction(args.node);
      }
    });
    
    cy.on("add", function (event) {
      var ele = event.cyTarget;
      initElementData(ele);
    });
  };
  // Helpers End
  
  // Do these just one time
  $(document).one('updateGraphEnd', function(event) {
    bindCyEvents();
    updateStyleSheet();
    var eles = cy.elements();
    
    for (var i = 0; i < eles.length; i++) {
      initElementData(eles[i]);
    }
  });
};
},{"./element-utilities":3,"./lib-utilities":4,"./option-utilities":6}],3:[function(_dereq_,module,exports){
// Extends sbgnviz.elementUtilities
var libs = _dereq_('./lib-utilities').getLibs();
var sbgnviz = libs.sbgnviz;
var jQuery = $ = libs.jQuery;
var elementUtilities = sbgnviz.elementUtilities;
var options = _dereq_('./option-utilities').getOptions();

elementUtilities.defaultProperties = {
  "process": {
    width: 15,
    height: 15,
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
  },
  "omitted process": {
    width: 15,
    height: 15,
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
  },
  "uncertain process": {
    width: 15,
    height: 15,
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
  },
  "association": {
    width: 15,
    height: 15,
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
  },
  "dissociation": {
    width: 15,
    height: 15,
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
  },
  "macromolecule": {
    width: 70,
    height: 35,
    'font-size': 11,
    'font-family': 'Helvetica',
    'font-style': 'normal',
    'font-weight': 'normal',
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
    
  },
  "nucleic acid feature": {
    width: 70,
    height: 35,
    'font-size': 11,
    'font-family': 'Helvetica',
    'font-style': 'normal',
    'font-weight': 'normal',
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
  },
  "simple chemical": {
    width: 35,
    height: 35,
    'font-size': 11,
    'font-family': 'Helvetica',
    'font-style': 'normal',
    'font-weight': 'normal',
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
  },
  "source and sink": {
    width: 25,
    height: 25,
    'font-size': 11,
    'font-family': 'Helvetica',
    'font-style': 'normal',
    'font-weight': 'normal',
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
  },
  "tag": {
    width: 35,
    height: 35,
    'font-size': 11,
    'font-family': 'Helvetica',
    'font-style': 'normal',
    'font-weight': 'normal',
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
  },
  "phenotype": {
    width: 70,
    height: 35,
    'font-size': 11,
    'font-family': 'Helvetica',
    'font-style': 'normal',
    'font-weight': 'normal',
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
  },
  "unspecified entity": {
    width: 70,
    height: 35,
    'font-size': 11,
    'font-family': 'Helvetica',
    'font-style': 'normal',
    'font-weight': 'normal',
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
  },
  "perturbing agent": {
    width: 70,
    height: 35,
    'font-size': 11,
    'font-family': 'Helvetica',
    'font-style': 'normal',
    'font-weight': 'normal',
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
  },
  "complex": {
    width: 100,
    height: 100,
    'font-size': 11,
    'font-family': 'Helvetica',
    'font-style': 'normal',
    'font-weight': 'normal',
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
  },
  "compartment": {
    width: 100,
    height: 100,
    'font-size': 11,
    'font-family': 'Helvetica',
    'font-style': 'normal',
    'font-weight': 'normal',
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 3.25,
    'border-color': '#555'
  },
  "and": {
    width: 25,
    height: 25,
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
  },
  "or": {
    width: 25,
    height: 25,
    'font-size': 11,
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
  },
  "not": {
    width: 25,
    height: 25,
    'font-size': 11,
    'background-color': '#ffffff',
    'background-opacity': 0.5,
    'border-width': 1.25,
    'border-color': '#555'
  },
  "consumption": {
    'line-color': '#555',
    'width': 1.25
  },
  "production": {
    'line-color': '#555',
    'width': 1.25
  },
  "modulation": {
    'line-color': '#555',
    'width': 1.25
  },
  "stimulation": {
    'line-color': '#555',
    'width': 1.25
  },
  "catalysis": {
    'line-color': '#555',
    'width': 1.25
  },
  "inhibition": {
    'line-color': '#555',
    'width': 1.25
  },
  "necessary stimulation": {
    'line-color': '#555',
    'width': 1.25
  },
  "logic arc": {
    'line-color': '#555',
    'width': 1.25
  },
  "equivalence arc": {
    'line-color': '#555',
    'width': 1.25
  }
};

// Section Start
// Add remove utilities

elementUtilities.addNode = function (x, y, sbgnclass, id, parent, visibility) {
  var defaultProperties = this.defaultProperties;
  var defaults = defaultProperties[sbgnclass];

  var width = defaults ? defaults.width : 50;
  var height = defaults ? defaults.height : 50;
  
  var css = {};
  
  if (visibility) {
    css.visibility = visibility;
  }

  if (defaults && defaults.multimer) {
    sbgnclass += " multimer";
  }
  var data = {
    class: sbgnclass,
    bbox: {
      h: height,
      w: width,
      x: x,
      y: y
    },
    statesandinfos: [],
    ports: [],
    clonemarker: defaults && defaults.clonemarker ? defaults.clonemarker : undefined
  };

  if(id) {
    data.id = id;
  }
  
  if (parent) {
    data.parent = parent;
  }

  var eles = cy.add({
    group: "nodes",
    data: data,
    css: css,
    position: {
      x: x,
      y: y
    }
  });

  var newNode = eles[eles.length - 1];

  return newNode;
};

elementUtilities.addEdge = function (source, target, sbgnclass, id, visibility) {
  var defaultProperties = this.defaultProperties;
  var defaults = defaultProperties[sbgnclass];
  
  var css = {};

  if (visibility) {
    css.visibility = visibility;
  }

  var data = {
      source: source,
      target: target,
      class: sbgnclass
  };
  
  if(id) {
    data.id = id;
  }

  var eles = cy.add({
    group: "edges",
    data: data,
    css: css
  });

  var newEdge = eles[eles.length - 1];
  
  return newEdge;
};

elementUtilities.addProcessWithConvenientEdges = function(_source, _target, processType) {
  // If source and target IDs are given get the elements by IDs
  var source = typeof _source === 'string' ? cy.getElementById(_source) : _source;
  var target = typeof _target === 'string' ? cy.getElementById(_target) : _target;
  
  // Process parent should be the closest common ancestor of the source and target nodes
  var processParent = cy.collection([source[0], target[0]]).commonAncestors().first();
  
  // Process should be at the middle of the source and target nodes
  var x = ( source.position('x') + target.position('x') ) / 2;
  var y = ( source.position('y') + target.position('y') ) / 2;
  
  // Create the process with given/calculated variables
  var process = elementUtilities.addNode(x, y, processType, undefined, processParent.id());
  
  // Create the edges one is between the process and the source node (which should be a consumption), 
  // the other one is between the process and the target node (which should be a production).
  // For more information please refer to SBGN-PD reference card.
  var edgeBtwSrc = elementUtilities.addEdge(source.id(), process.id(), 'consumption');
  var edgeBtwTgt = elementUtilities.addEdge(process.id(), target.id(), 'production');
  
  // Create a collection including the elements and to be returned
  var collection = cy.collection([process[0], edgeBtwSrc[0], edgeBtwTgt[0]]);
  return collection;
};

/*
 * Returns if the elements with the given parent class can be parent of the elements with the given node class
 */
elementUtilities.isValidParent = function(_nodeClass, _parentClass) {
  // If nodeClass and parentClass params are elements itselves instead of their class names handle it
  var nodeClass = typeof _nodeClass !== 'string' ? _nodeClass.data('class') : _nodeClass;
  var parentClass = _parentClass != undefined && typeof _parentClass !== 'string' ? _parentClass.data('class') : _parentClass;
  
  if (parentClass == undefined || parentClass === 'compartment') { // Compartments and the root can include any type of nodes
    return true;
  }
  else if (parentClass === 'complex') { // Complexes can only include EPNs
    return elementUtilities.isEPNClass(nodeClass);
  }
  
  return false; // Currently just 'compartment' and 'complex' compounds are supported return false for any other parentClass
};

/*
 * This method assumes that param.nodesToMakeCompound contains at least one node
 * and all of the nodes including in it have the same parent. It creates a compound fot the given nodes an having the given type.
 */
elementUtilities.createCompoundForGivenNodes = function (nodesToMakeCompound, compoundType) {
  var oldParentId = nodesToMakeCompound[0].data("parent");
  // The parent of new compound will be the old parent of the nodes to make compound. x, y and id parameters are not set.
  var newCompound = elementUtilities.addNode(undefined, undefined, compoundType, undefined, oldParentId);
  var newCompoundId = newCompound.id();
  var newEles = nodesToMakeCompound.move({parent: newCompoundId});
  newEles = newEles.union(newCompound);
  return newEles;
};

/*
 * Creates a template reaction with given parameters. Requires cose-bilkent layout to tile the free macromolecules included
 * in the complex. Parameters are explained below.
 * templateType: The type of the template reaction. It may be 'association' or 'dissociation' for now.
 * macromoleculeList: The list of the names of macromolecules which will involve in the reaction.
 * complexName: The name of the complex in the reaction.
 * processPosition: The modal position of the process in the reaction. The default value is the center of the canvas.
 * tilingPaddingVertical: This option will be passed to the cose-bilkent layout with the same name. The default value is 15.
 * tilingPaddingHorizontal: This option will be passed to the cose-bilkent layout with the same name. The default value is 15.
 * edgeLength: The distance between the process and the macromolecules at the both sides.
 */
elementUtilities.createTemplateReaction = function (templateType, macromoleculeList, complexName, processPosition, tilingPaddingVertical, tilingPaddingHorizontal, edgeLength) {
  var defaultMacromoleculProperties = elementUtilities.defaultProperties["macromolecule"];
  var templateType = templateType;
  var processWidth = elementUtilities.defaultProperties[templateType] ? elementUtilities.defaultProperties[templateType].width : 50;
  var macromoleculeWidth = defaultMacromoleculProperties ? defaultMacromoleculProperties.width : 50;
  var macromoleculeHeight = defaultMacromoleculProperties ? defaultMacromoleculProperties.height : 50;
  var processPosition = processPosition ? processPosition : elementUtilities.convertToModelPosition({x: cy.width() / 2, y: cy.height() / 2});
  var macromoleculeList = macromoleculeList;
  var complexName = complexName;
  var numOfMacromolecules = macromoleculeList.length;
  var tilingPaddingVertical = tilingPaddingVertical ? tilingPaddingVertical : 15;
  var tilingPaddingHorizontal = tilingPaddingHorizontal ? tilingPaddingHorizontal : 15;
  var edgeLength = edgeLength ? edgeLength : 60;

  cy.startBatch();

  var xPositionOfFreeMacromolecules;
  if (templateType === 'association') {
    xPositionOfFreeMacromolecules = processPosition.x - edgeLength - processWidth / 2 - macromoleculeWidth / 2;
  }
  else {
    xPositionOfFreeMacromolecules = processPosition.x + edgeLength + processWidth / 2 + macromoleculeWidth / 2;
  }

  //Create the process in template type
  var process = elementUtilities.addNode(processPosition.x, processPosition.y, templateType);
  process.data('justAdded', true);

  //Define the starting y position
  var yPosition = processPosition.y - ((numOfMacromolecules - 1) / 2) * (macromoleculeHeight + tilingPaddingVertical);

  //Create the free macromolecules
  for (var i = 0; i < numOfMacromolecules; i++) {
    var newNode = elementUtilities.addNode(xPositionOfFreeMacromolecules, yPosition, "macromolecule");
    newNode.data('justAdded', true);
    newNode.data('label', macromoleculeList[i]);

    //create the edge connected to the new macromolecule
    var newEdge;
    if (templateType === 'association') {
      newEdge = elementUtilities.addEdge(newNode.id(), process.id(), 'consumption');
    }
    else {
      newEdge = elementUtilities.addEdge(process.id(), newNode.id(), 'production');
    }

    newEdge.data('justAdded', true);

    //update the y position
    yPosition += macromoleculeHeight + tilingPaddingVertical;
  }

  //Create the complex including macromolecules inside of it
  //Temprorarily add it to the process position we will move it according to the last size of it
  var complex = elementUtilities.addNode(processPosition.x, processPosition.y, 'complex');
  complex.data('justAdded', true);
  complex.data('justAddedLayoutNode', true);

  //If a name is specified for the complex set its label accordingly
  if (complexName) {
    complex.data('label', complexName);
  }

  //create the edge connnected to the complex
  var edgeOfComplex;
  if (templateType === 'association') {
    edgeOfComplex = elementUtilities.addEdge(process.id(), complex.id(), 'production');
  }
  else {
    edgeOfComplex = elementUtilities.addEdge(complex.id(), process.id(), 'consumption');
  }
  edgeOfComplex.data('justAdded', true);

  //Create the macromolecules inside the complex
  for (var i = 0; i < numOfMacromolecules; i++) {
    // Add a macromolecule not having a previously defined id and having the complex created in this reaction as parent
    var newNode = elementUtilities.addNode(complex.position('x'), complex.position('y'), "macromolecule", undefined, complex.id());
    newNode.data('justAdded', true);
    newNode.data('label', macromoleculeList[i]);
    newNode.data('justAddedLayoutNode', true);
  }
  
  cy.endBatch();

  var layoutNodes = cy.nodes('[justAddedLayoutNode]');
  layoutNodes.removeData('justAddedLayoutNode');
  layoutNodes.layout({
    name: 'cose-bilkent',
    randomize: false,
    fit: false,
    animate: false,
    tilingPaddingVertical: tilingPaddingVertical,
    tilingPaddingHorizontal: tilingPaddingHorizontal,
    stop: function () {
      //re-position the nodes inside the complex
      var supposedXPosition;
      var supposedYPosition = processPosition.y;

      if (templateType === 'association') {
        supposedXPosition = processPosition.x + edgeLength + processWidth / 2 + complex.outerWidth() / 2;
      }
      else {
        supposedXPosition = processPosition.x - edgeLength - processWidth / 2 - complex.outerWidth() / 2;
      }

      var positionDiffX = supposedXPosition - complex.position('x');
      var positionDiffY = supposedYPosition - complex.position('y');
      elementUtilities.moveNodes({x: positionDiffX, y: positionDiffY}, complex);
    }
  });

  //filter the just added elememts to return them and remove just added mark
  var eles = cy.elements('[justAdded]');
  eles.removeData('justAdded');
  
  cy.elements().unselect();
  eles.select();
  
  return eles; // Return the just added elements
};

/*
 * Move the nodes to a new parent and change their position if possDiff params are set.
 */
elementUtilities.changeParent = function(nodes, newParent, posDiffX, posDiffY) {
  var newParentId = newParent == undefined || typeof newParent === 'string' ? newParent : newParent.id();
  nodes.move({"parent": newParentId});
  elementUtilities.moveNodes({x: posDiffX, y: posDiffY}, nodes);
};

// Resize given nodes if useAspectRatio is truthy one of width or height should not be set.
elementUtilities.resizeNodes = function (nodes, width, height, useAspectRatio) {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var ratio = undefined;
    var eleMustBeSquare = elementUtilities.mustBeSquare(node.data('class'));

    // Note that both width and height should not be set if useAspectRatio is truthy
    if (width) {
      if (useAspectRatio || eleMustBeSquare) {
        ratio = width / node.width();
      }

      node.data("bbox").w = width;
    }

    if (height) {
      if (useAspectRatio || eleMustBeSquare) {
        ratio = height / node.height();
      }

      node.data("bbox").h = height;
    }

    if (ratio && !height) {
      node.data("bbox").h = node.height() * ratio;
    }
    else if (ratio && !width) {
      node.data("bbox").w = node.width() * ratio;
    }
  }
};

// Section End
// Add remove utilities

// Section Start
// Common element properties

// Get common properties of given elements. Returns null if the given element list is empty or the
// property is not common for all elements. dataOrCss parameter specify whether to check the property on data or css.
// The default value for it is data. If propertyName parameter is given as a function instead of a string representing the 
// property name then use what that function returns.
elementUtilities.getCommonProperty = function (elements, propertyName, dataOrCss) {
  if (elements.length == 0) {
    return null;
  }

  var isFunction;
  // If we are not comparing the properties directly users can specify a function as well
  if (typeof propertyName === 'function') {
    isFunction = true;
  }

  // Use data as default
  if (!isFunction && !dataOrCss) {
    dataOrCss = 'data';
  }

  var value = isFunction ? propertyName(elements[0]) : elements[0][dataOrCss](propertyName);

  for (var i = 1; i < elements.length; i++) {
    if ( ( isFunction ? propertyName(elements[i]) : elements[i][dataOrCss](propertyName) ) != value) {
      return null;
    }
  }

  return value;
};

// Returns if the function returns a truthy value for all of the given elements.
elementUtilities.trueForAllElements = function (elements, fcn) {
  for (var i = 0; i < elements.length; i++) {
    if (!fcn(elements[i])) {
      return false;
    }
  }

  return true;
};

// Returns whether the give element can have sbgncardinality
elementUtilities.canHaveSBGNCardinality = function (ele) {
  var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');

  return ele.data('class') == 'consumption' || ele.data('class') == 'production';
};

// Returns whether the give element can have sbgnlabel
elementUtilities.canHaveSBGNLabel = function (ele) {
  var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');

  return sbgnclass != 'and' && sbgnclass != 'or' && sbgnclass != 'not'
          && sbgnclass != 'association' && sbgnclass != 'dissociation' && !sbgnclass.endsWith('process');
};

// Returns whether the give element have unit of information
elementUtilities.canHaveUnitOfInformation = function (ele) {
  var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');

  if (sbgnclass == 'simple chemical'
          || sbgnclass == 'macromolecule' || sbgnclass == 'nucleic acid feature'
          || sbgnclass == 'complex' || sbgnclass == 'simple chemical multimer'
          || sbgnclass == 'macromolecule multimer' || sbgnclass == 'nucleic acid feature multimer'
          || sbgnclass == 'complex multimer') {
    return true;
  }
  return false;
};

// Returns whether the give element have state variable
elementUtilities.canHaveStateVariable = function (ele) {
  var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');

  if (sbgnclass == 'macromolecule' || sbgnclass == 'nucleic acid feature'
          || sbgnclass == 'complex'
          || sbgnclass == 'macromolecule multimer' || sbgnclass == 'nucleic acid feature multimer'
          || sbgnclass == 'complex multimer') {
    return true;
  }
  return false;
};

// Returns whether the given ele should be square in shape
elementUtilities.mustBeSquare = function (ele) {
  var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');

  return (sbgnclass.indexOf('process') != -1 || sbgnclass == 'source and sink'
          || sbgnclass == 'and' || sbgnclass == 'or' || sbgnclass == 'not'
          || sbgnclass == 'association' || sbgnclass == 'dissociation');
};

// Returns whether any of the given nodes must not be in square shape
elementUtilities.someMustNotBeSquare = function (nodes) {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (!elementUtilities.mustBeSquare(node.data('class'))) {
      return true;
    }
  }

  return false;
};

// Returns whether the gives element can be cloned
elementUtilities.canBeCloned = function (ele) {
  var sbgnclass = (typeof ele === 'string' ? ele : ele.data('class')).replace(" multimer", "");

  var list = {
    'unspecified entity': true,
    'macromolecule': true,
    'complex': true,
    'nucleic acid feature': true,
    'simple chemical': true,
    'perturbing agent': true
  };

  return list[sbgnclass] ? true : false;
};

// Returns whether the gives element can be cloned
elementUtilities.canBeMultimer = function (ele) {
  var sbgnclass = (typeof ele === 'string' ? ele : ele.data('class')).replace(" multimer", "");

  var list = {
    'macromolecule': true,
    'complex': true,
    'nucleic acid feature': true,
    'simple chemical': true
  };

  return list[sbgnclass] ? true : false;
};

// Returns whether the given element is an EPN
elementUtilities.isEPNClass = function (ele) {
  var sbgnclass = (typeof ele === 'string' ? ele : ele.data('class')).replace(" multimer", "");

  return (sbgnclass == 'unspecified entity'
          || sbgnclass == 'simple chemical'
          || sbgnclass == 'macromolecule'
          || sbgnclass == 'nucleic acid feature'
          || sbgnclass == 'complex');
};

// Returns whether the given element is a PN
elementUtilities.isPNClass = function (ele) {
  var sbgnclass = (typeof ele === 'string' ? ele : ele.data('class')).replace(" multimer", "");

  return (sbgnclass == 'process'
          || sbgnclass == 'omitted process'
          || sbgnclass == 'uncertain process'
          || sbgnclass == 'association'
          || sbgnclass == 'dissociation'
          || sbgnclass == 'phenotype');
};

// Returns wether the given element or string is of the special empty set/source and sink class
elementUtilities.isEmptySetClass = function (ele) {
  var sbgnclass = (typeof ele === 'string' ? ele : ele.data('class')).replace(" multimer", "");
  return sbgnclass == 'source and sink';
};

// Returns whether the given element is a logical operator
elementUtilities.isLogicalOperator = function (ele) {
  var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');
  return (sbgnclass == 'and' || sbgnclass == 'or' || sbgnclass == 'not');
};

// Returns whether the class of given element is a equivalance class
elementUtilities.convenientToEquivalence = function (ele) {
  var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');
  return (sbgnclass == 'tag' || sbgnclass == 'terminal');
};

// Returns wether the class of given elemnt is a modulation arc as defined in PD specs
elementUtilities.isModulationArcClass = function (ele) {
  var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');
  return (sbgnclass == 'modulation'
          || sbgnclass == 'stimulation' || sbgnclass == 'catalysis'
          || sbgnclass == 'inhibition' || sbgnclass == 'necessary stimulation');
}

// Relocates state and info boxes. This function is expected to be called after add/remove state and info boxes
elementUtilities.relocateStateAndInfos = function (ele) {
  var stateAndInfos = (ele.isNode && ele.isNode()) ? ele.data('statesandinfos') : ele;
  var length = stateAndInfos.length;
  if (length == 0) {
    return;
  }
  else if (length == 1) {
    stateAndInfos[0].bbox.x = 0;
    stateAndInfos[0].bbox.y = -50;
  }
  else if (length == 2) {
    stateAndInfos[0].bbox.x = 0;
    stateAndInfos[0].bbox.y = -50;

    stateAndInfos[1].bbox.x = 0;
    stateAndInfos[1].bbox.y = 50;
  }
  else if (length == 3) {
    stateAndInfos[0].bbox.x = -25;
    stateAndInfos[0].bbox.y = -50;

    stateAndInfos[1].bbox.x = 25;
    stateAndInfos[1].bbox.y = -50;

    stateAndInfos[2].bbox.x = 0;
    stateAndInfos[2].bbox.y = 50;
  }
  else {
    stateAndInfos[0].bbox.x = -25;
    stateAndInfos[0].bbox.y = -50;

    stateAndInfos[1].bbox.x = 25;
    stateAndInfos[1].bbox.y = -50;

    stateAndInfos[2].bbox.x = -25;
    stateAndInfos[2].bbox.y = 50;

    stateAndInfos[3].bbox.x = 25;
    stateAndInfos[3].bbox.y = 50;
  }
};

// Change state value or unit of information box of given nodes with given index.
// Type parameter indicates whether to change value or variable, it is valid if the box at the given index is a state variable.
// Value parameter is the new value to set.
// This method returns the old value of the changed data (We assume that the old value of the changed data was the same for all nodes).
elementUtilities.changeStateOrInfoBox = function (nodes, index, value, type) {
  var result;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var stateAndInfos = node.data('statesandinfos');
    var box = stateAndInfos[index];

    if (box.clazz == "state variable") {
      if (!result) {
        result = box.state[type];
      }

      box.state[type] = value;
    }
    else if (box.clazz == "unit of information") {
      if (!result) {
        result = box.label.text;
      }

      box.label.text = value;
    }
  }

  return result;
};

// Add a new state or info box to given nodes.
// The box is represented by the parameter obj.
// This method returns the index of the just added box.
elementUtilities.addStateOrInfoBox = function (nodes, obj) {
  var index;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var stateAndInfos = node.data('statesandinfos');
    
    // Clone the object to avoid referencing issues
    var clone = jQuery.extend(true, {}, obj);
    
    stateAndInfos.push(clone);
    index = stateAndInfos.length - 1;
    this.relocateStateAndInfos(stateAndInfos); // Relocate state and infos
  }

  return index;
};

// Remove the state or info boxes of the given nodes at given index.
// Returns the removed box.
elementUtilities.removeStateOrInfoBox = function (nodes, index) {
  var obj;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var stateAndInfos = node.data('statesandinfos');
    if (!obj) {
      obj = stateAndInfos[index];
    }
    stateAndInfos.splice(index, 1); // Remove the box
    this.relocateStateAndInfos(stateAndInfos); // Relocate state and infos
  }

  return obj;
};

// Set multimer status of the given nodes to the given status.
elementUtilities.setMultimerStatus = function (nodes, status) {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var sbgnclass = node.data('class');
    var isMultimer = node.data('class').endsWith(' multimer');

    if (status) { // Make multimer status true
      if (!isMultimer) {
        node.data('class', sbgnclass + ' multimer');
      }
    }
    else { // Make multimer status false
      if (isMultimer) {
        node.data('class', sbgnclass.replace(' multimer', ''));
      }
    }
  }
};

// Set clone marker status of given nodes to the given status.
elementUtilities.setCloneMarkerStatus = function (nodes, status) {
  if (status) {
    nodes.data('clonemarker', true);
  }
  else {
    nodes.removeData('clonemarker');
  }
};

//elementUtilities.setCloneMarkerStatus = function()

// Change font properties of the given elements with given font data
elementUtilities.changeFontProperties = function (eles, data) {
  for (var prop in data) {
    eles.data(prop, data[prop]);
  }
};

// This function gets an edge, and ends of that edge (Optionally it may take just the classes of these elements as well) as parameters.
// It may return 'valid' (that ends is valid for that edge), 'reverse' (that ends is not valid for that edge but they would be valid 
// if you reverse the source and target), 'invalid' (that ends are totally invalid for that edge).
elementUtilities.validateArrowEnds = function (edge, source, target) {
  var edgeclass = typeof edge === 'string' ? edge : edge.data('class');
  // TODO is it necessary to accept strings ? better to always have the elements for source and target.
  // The day we need to check other rules we will need to access some properties of each element.
  var sourceclass = typeof source === 'string' ? source : source.data('class');
  var targetclass = typeof target === 'string' ? target : target.data('class');

  if (this.isModulationArcClass(edgeclass)){
    /*
     * Case of the output arc of a logic operator, which can be any modulation arc type.
     * Has to go from logic operator to PN class.
     * PD37 says there should be only 1, not enforced for now, rules are left commented.
     */
    valid = true;
    reverse = false;
    if (this.isLogicalOperator(sourceclass) || this.isLogicalOperator(targetclass)){ // a logic operator is involved
      if (!this.isLogicalOperator(sourceclass) || !this.isPNClass(targetclass)){ // different from the ideal case of logic -> process
        if (this.isPNClass(sourceclass) && this.isLogicalOperator(targetclass)){
          reverse = true;
          /*if (target.outgoers('edge').size() != 0){ // only 1 outgoing edge allowed (PD37)
            valid = false;
          }*/
        }
        else {
          valid = false;
        }
      }
      /*else if (source.outgoers('edge').size() != 0){ // only 1 outgoing edge allowed (PD37)
        valid = false;
      }*/

      if (valid){
        return reverse ? 'reverse' : 'valid';
      }
      else{
        return 'invalid';
      }
    }
  }

  if (edgeclass == 'consumption' || this.isModulationArcClass(edgeclass)) {
    if (this.isEmptySetClass(sourceclass) || this.isEmptySetClass(targetclass)){ // case of EmptySet in one of the 2
      // following block is the same as the 'else if' below, with isEPNClass replaced by isEmptySetClass
      if (!this.isEmptySetClass(sourceclass) || !this.isPNClass(targetclass)){
        if (this.isPNClass(sourceclass) && this.isEmptySetClass(targetclass)) {
          //If just the direction is not valid reverse the direction
          return 'reverse';
        }
        else {
          return 'invalid';
        }
      }
    }
    else if (!this.isEPNClass(sourceclass) || !this.isPNClass(targetclass)) {
      if (this.isPNClass(sourceclass) && this.isEPNClass(targetclass)) {
        //If just the direction is not valid reverse the direction
        return 'reverse';
      }
      else {
        return 'invalid';
      }
    }
  }
  else if (edgeclass == 'production') {
    if (this.isEmptySetClass(sourceclass) || this.isEmptySetClass(targetclass)){ // case of EmptySet in one of the 2
      // following block is the same as the 'else if' below, with isEPNClass replaced by isEmptySetClass
      if (!this.isPNClass(sourceclass) || !this.isEmptySetClass(targetclass)){
        if (this.isEmptySetClass(sourceclass) && this.isPNClass(targetclass)) {
          //If just the direction is not valid reverse the direction
          return 'reverse';
        }
        else {
          return 'invalid';
        }
      }
    }
    else if (!this.isPNClass(sourceclass) || !this.isEPNClass(targetclass)) {
      if (this.isEPNClass(sourceclass) && this.isPNClass(targetclass)) {
        //If just the direction is not valid reverse the direction
        return 'reverse';
      }
      else {
        return 'invalid';
      }
    }
  }
  else if (edgeclass == 'logic arc') {
    var invalid = false;
    if (!this.isEPNClass(sourceclass) || !this.isLogicalOperator(targetclass)) {
      if (this.isLogicalOperator(sourceclass) && this.isEPNClass(targetclass)) {
        //If just the direction is not valid reverse the direction
        return 'reverse';
      }
      else {
        invalid = true;
      }
    }

    // the case that both sides are logical operators are valid too
    if (this.isLogicalOperator(sourceclass) && this.isLogicalOperator(targetclass)) {
      invalid = false;
    }

    if (invalid) {
      return 'invalid';
    }
  }
  else if (edgeclass == 'equivalence arc') {
    if (!(this.isEPNClass(sourceclass) && this.convenientToEquivalence(targetclass))
            && !(this.isEPNClass(targetclass) && this.convenientToEquivalence(sourceclass))) {
      return 'invalid';
    }
  }

  return 'valid';
};

/*
 * Unhide given eles and perform given layout afterward. Layout parameter may be layout options
 * or a function to call.
 */
elementUtilities.showAndPerformLayout = function(eles, layoutparam) {
  var result = cy.viewUtilities().show(eles); // Show given eles
  if (typeof layoutparam === 'function') {
    layoutparam(); // If layoutparam is a function execute it
  }
  else {
    cy.layout(layoutparam); // If layoutparam is layout options call layout with that options.
  }
  
  return result;
};

/*
 * Change style/css of given eles by setting getting property name to the given value/values (Note that valueMap parameter may be
 * a single string or an id to value map).
 */
elementUtilities.changeCss = function(eles, name, valueMap) {
  if ( typeof valueMap === 'object' ) {
    cy.startBatch();
    for (var i = 0; i < eles.length; i++) {
      var ele = eles[i];
      ele.css(name, valueMap[ele.id()]); // valueMap is an id to value map use it in this way
    }
    cy.endBatch();
  }
  else {
    eles.css(name, valueMap); // valueMap is just a string set css('name') for all eles to this value
  }
};

/*
 * Change data of given eles by setting getting property name to the given value/values (Note that valueMap parameter may be
 * a single string or an id to value map).
 */
elementUtilities.changeData = function(eles, name, valueMap) {
  if ( typeof valueMap === 'object' ) {
    cy.startBatch();
    for (var i = 0; i < eles.length; i++) {
      var ele = eles[i];
      ele.data(name, valueMap[ele.id()]); // valueMap is an id to value map use it in this way
    }
    cy.endBatch();
  }
  else {
    eles.data(name, valueMap); // valueMap is just a string set css('name') for all eles to this value
  }
};

/*
 * Return the set of all nodes present under the given position
 * renderedPos must be a point defined relatively to cytoscape container
 * (like renderedPosition field of a node)
 */
elementUtilities.getNodesAt = function(renderedPos) {
  var nodes = cy.nodes();
  var x = renderedPos.x;
  var y = renderedPos.y;
  var resultNodes = [];
  for(var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var renderedBbox = node.renderedBoundingBox({
      includeNodes: true,
      includeEdges: false,
      includeLabels: false,
      includeShadows: false
    });
    if (x >= renderedBbox.x1 && x <= renderedBbox.x2) {
      if (y >= renderedBbox.y1 && y <= renderedBbox.y2) {
        resultNodes.push(node);
      }
    }
  }
  return resultNodes;
};

elementUtilities.demultimerizeClass = function(sbgnclass) {
  return sbgnclass.replace(" multimer", "");
}

module.exports = elementUtilities;

},{"./lib-utilities":4,"./option-utilities":6}],4:[function(_dereq_,module,exports){
/* 
 * Utility file to get and set the libraries to which sbgnviz is dependent from any file.
 */

var libUtilities = function(){
};

libUtilities.setLibs = function(libs) {
  this.libs = libs;
};

libUtilities.getLibs = function() {
  return this.libs;
};

module.exports = libUtilities;
},{}],5:[function(_dereq_,module,exports){
var options = _dereq_('./option-utilities').getOptions();
var elementUtilities = _dereq_('./element-utilities');

/*
 * The main utilities to be exposed directly.
 */
function mainUtilities() {
};

/*
 * Adds a new node with the given class and at the given coordinates. Considers undoable option.
 */
mainUtilities.addNode = function(x, y , nodeclass, id, parent, visibility) {
  if (!options.undoable) {
    return elementUtilities.addNode(x, y, nodeclass, id, parent, visibility);
  }
  else {
    var param = {
      newNode : {
        x: x,
        y: y,
        class: nodeclass,
        id: id,
        parent: parent,
        visibility: visibility
      }
    };
    
    cy.undoRedo().do("addNode", param);
  }
};

/*
 * Adds a new edge with the given class and having the given source and target ids. Considers undoable option.
 */
mainUtilities.addEdge = function(source, target , edgeclass, id, visibility) {
  // Get the validation result
  var validation = elementUtilities.validateArrowEnds(edgeclass, cy.getElementById(source), cy.getElementById(target));

  // If validation result is 'invalid' cancel the operation
  if (validation === 'invalid') {
    return;
  }
  
  // If validation result is 'reverse' reverse the source-target pair before creating the edge
  if (validation === 'reverse') {
    var temp = source;
    source = target;
    target = temp;
  }
      
  if (!options.undoable) {
    return elementUtilities.addEdge(source, target, edgeclass, id, visibility);
  }
  else {
    var param = {
      newEdge : {
        source: source,
        target: target,
        class: edgeclass,
        id: id,
        visibility: visibility
      }
    };
    
    cy.undoRedo().do("addEdge", param);
  }
};

/*
 * Adds a process with convenient edges. For more information please see 'https://github.com/iVis-at-Bilkent/newt/issues/9'.
 * Considers undoable option.
 */
mainUtilities.addProcessWithConvenientEdges = function(_source, _target, processType) {
  // If source and target IDs are given get the elements by IDs
  var source = typeof _source === 'string' ? cy.getElementById(_source) : _source;
  var target = typeof _target === 'string' ? cy.getElementById(_target) : _target;
  
  // If source or target does not have an EPN class the operation is not valid
  if (!elementUtilities.isEPNClass(source) || !elementUtilities.isEPNClass(target)) {
    return;
  }
  
  if (!options.undoable) {
    return elementUtilities.addProcessWithConvenientEdges(_source, _target, processType);
  }
  else {
    var param = {
      source: _source,
      target: _target,
      processType: processType
    };
    
    cy.undoRedo().do("addProcessWithConvenientEdges", param);
  }
};

/*
 * Clone given elements. Considers undoable option. Requires cytoscape-clipboard extension.
 */
mainUtilities.cloneElements = function (eles) {
  if (eles.length === 0) {
    return;
  }
  
  var cb = cy.clipboard();
  var _id = cb.copy(eles, "cloneOperation");

  if (options.undoable) {
    cy.undoRedo().do("paste", {id: _id});
  } 
  else {
    cb.paste(_id);
  }
};

/*
 * Copy given elements to clipboard. Requires cytoscape-clipboard extension.
 */
mainUtilities.copyElements = function (eles) {
  cy.clipboard().copy(eles);
};

/*
 * Past the elements copied to clipboard. Considers undoable option. Requires cytoscape-clipboard extension.
 */
mainUtilities.pasteElements = function() {
  if (options.undoable) {
    cy.undoRedo().do("paste");
  } 
  else {
    cy.clipboard().paste();
  }
};

/*
 * Aligns given nodes in given horizontal and vertical order. 
 * Horizontal and vertical parameters may be 'none' or undefined.
 * alignTo parameter indicates the leading node.
 * Requrires cytoscape-grid-guide extension and considers undoable option.
 */
mainUtilities.align = function (nodes, horizontal, vertical, alignTo) {
  if (nodes.length === 0) {
    return;
  }
  
  if (options.undoable) {
    cy.undoRedo().do("align", {
      nodes: nodes,
      horizontal: horizontal,
      vertical: vertical,
      alignTo: alignTo
    });
  } else {
    nodes.align(horizontal, vertical, alignTo);
  }
};

/*
 * Create compound for given nodes. compoundType may be 'complex' or 'compartment'.
 * This method considers undoable option.
 */
mainUtilities.createCompoundForGivenNodes = function (_nodes, compoundType) {
  var nodes = _nodes;
  /*
   * Eleminate the nodes which cannot have a parent with given compound type
   */
  nodes = _nodes.filter(function (i, element) {
    var sbgnclass = element.data("class");
    return elementUtilities.isValidParent(sbgnclass, compoundType);
  });
  
  nodes = elementUtilities.getTopMostNodes(nodes);

  // All elements should have the same parent and the common parent should not be a 'complex' 
  // if compoundType is 'compartent'
  // because the old common parent will be the parent of the new compartment after this operation and
  // 'complexes' cannot include 'compartments'
  if (nodes.length == 0 || !elementUtilities.allHaveTheSameParent(nodes)
          || ( compoundType === 'compartment' && nodes.parent().data('class') === 'complex' ) ) {
    return;
  }
  
  if (cy.undoRedo()) {
    var param = {
      compoundType: compoundType,
      nodesToMakeCompound: nodes
    };

    cy.undoRedo().do("createCompoundForGivenNodes", param);
  }
  else {
    elementUtilities.createCompoundForGivenNodes(nodes, compoundType);
  }
};

/*
 * Move the nodes to a new parent and change their position if possDiff params are set.
 * Considers undoable option and checks if the operation is valid.
 */
mainUtilities.changeParent = function(nodes, _newParent, posDiffX, posDiffY) {
  var newParent = typeof _newParent === 'string' ? cy.getElementById(_newParent) : _newParent;
  // New parent is supposed to be one of the root, a complex or a compartment
  if (newParent && newParent.data("class") != "complex" && newParent.data("class") != "compartment") {
    return;
  }
  
  /*
   * Eleminate the nodes which cannot have the newParent as their parent
   */
  nodes = nodes.filter(function (i, element) {
    var sbgnclass = element.data("class");
    return elementUtilities.isValidParent(sbgnclass, newParent);
  });
  
  // Discard the nodes whose parent is already newParent
  nodes = nodes.filter(function (i, ele) {
    if (!newParent) {
      return ele.data('parent') != null;
    }
    return ele.data('parent') !== newParent.id();
  });

  // If some nodes are ancestor of new parent eleminate them
  if (newParent) {
    nodes = nodes.difference(newParent.ancestors());
  }

  // If all nodes are eleminated return directly
  if (nodes.length === 0) {
    return;
  }

  // Just move the top most nodes
  nodes = elementUtilities.getTopMostNodes(nodes);
  
  var parentId = newParent ? newParent.id() : null;
  
  if (options.undoable) {
    var param = {
      firstTime: true,
      parentData: parentId, // It keeps the newParentId (Just an id for each nodes for the first time)
      nodes: nodes,
      posDiffX: posDiffX,
      posDiffY: posDiffY
    };

    cy.undoRedo().do("changeParent", param); // This action is registered by undoRedo extension
  }
  else {
    elementUtilities.changeParent(nodes, parentId, posDiffX, posDiffY);
  }
};

/*
 * Creates a template reaction with given parameters. Requires cose-bilkent layout to tile the free macromolecules included
 * in the complex. Considers undoable option. For more information see the same function in elementUtilities
 */
mainUtilities.createTemplateReaction = function (templateType, macromoleculeList, complexName, processPosition, tilingPaddingVertical, tilingPaddingHorizontal, edgeLength) {
  if (!options.undoable) {
    elementUtilities.createTemplateReaction(templateType, macromoleculeList, complexName, processPosition, tilingPaddingVertical, tilingPaddingHorizontal, edgeLength);
  }
  else {
    var param = {
      templateType: templateType,
      macromoleculeList: macromoleculeList,
      complexName: complexName,
      processPosition: processPosition,
      tilingPaddingVertical: tilingPaddingVertical,
      tilingPaddingHorizontal: tilingPaddingHorizontal,
      edgeLength: edgeLength
    };
    
    cy.undoRedo().do("createTemplateReaction", param);
  }
};

/*
 * Resize given nodes if useAspectRatio is truthy one of width or height should not be set. 
 * Considers undoable option.
 */
mainUtilities.resizeNodes = function(nodes, width, height, useAspectRatio) {
  if (nodes.length === 0) {
    return;
  }
  
  if (options.undoable) {
    var param = {
      nodes: nodes,
      width: width,
      height: height,
      useAspectRatio: useAspectRatio,
      performOperation: true
    };
    
    cy.undoRedo().do("resizeNodes", param);
  }
  else {
    elementUtilities.resizeNodes(nodes, width, height, useAspectRatio);
  }
  
  cy.style().update();
};

/*
 * Changes the label of the given nodes to the given label. Considers undoable option.
 */
mainUtilities.changeNodeLabel = function(nodes, label) {
  if (nodes.length === 0) {
    return;
  }
  
  if (!options.undoable) {
    nodes.data('label', label);
  }
  else {
    var param = {
      nodes: nodes,
      label: label,
      firstTime: true
    };
    
    cy.undoRedo().do("changeNodeLabel", param);
  }
  
  cy.style().update();
};

/*
 * Change font properties for given nodes use the given font data.
 * Considers undoable option.
 */
mainUtilities.changeFontProperties = function(eles, data) {
  if (eles.length === 0) {
    return;
  }
  
  if (options.undoable) {
    var param = {
      eles: eles,
      data: data,
      firstTime: true
    };

    cy.undoRedo().do("changeFontProperties", param);
  }
  else {
    elementUtilities.changeFontProperties(eles, data);
  }
  
  cy.style().update();
};

/*
 * Change state value or unit of information box of given nodes with given index.
 * Considers undoable option.
 * For more information about the parameters see elementUtilities.changeStateOrInfoBox
 */
mainUtilities.changeStateOrInfoBox = function(nodes, index, value, type) {
  if (nodes.length === 0) {
    return;
  }
  if (options.undoable) {
    var param = {
      index: index,
      value: value,
      type: type,
      nodes: nodes
    };
    
    cy.undoRedo().do("changeStateOrInfoBox", param);
  }
  else {
    return elementUtilities.changeStateOrInfoBox(nodes, index, value, type);
  }
  
  cy.style().update();
};

// Add a new state or info box to given nodes.
// The box is represented by the parameter obj.
// Considers undoable option.
mainUtilities.addStateOrInfoBox = function(nodes, obj) {
  if (nodes.length === 0) {
    return;
  }
  
  if (!options.undoable) {
    elementUtilities.addStateOrInfoBox(nodes, obj);
  }
  else {
    var param = {
      obj: obj,
      nodes: nodes
    };
    
    cy.undoRedo().do("addStateOrInfoBox", param);
  }
  
  cy.style().update();
};

// Remove the state or info boxes of the given nodes at given index.
// Considers undoable option.
mainUtilities.removeStateOrInfoBox = function(nodes, index) {
  if (nodes.length === 0) {
    return;
  }
  
  if (!options.undoable) {
    elementUtilities.removeStateOrInfoBox(nodes, index);
  }
  else {
    var param = {
      index: index,
      nodes: nodes
    };

    cy.undoRedo().do("removeStateOrInfoBox", param);
  }
  
  cy.style().update();
};

/*
 * Set multimer status of the given nodes to the given status.
 * Considers undoable option.
 */
mainUtilities.setMultimerStatus = function(nodes, status) {
  if (nodes.length === 0) {
    return;
  }
  
  if (options.undoable) {
    var param = {
      status: status,
      nodes: nodes,
      firstTime: true
    };

    cy.undoRedo().do("setMultimerStatus", param);
  }
  else {
    elementUtilities.setMultimerStatus(nodes, status);
  }
  
  cy.style().update();
};

/*
 * Set clone marker status of given nodes to the given status.
 * Considers undoable option.
 */ 
mainUtilities.setCloneMarkerStatus = function(nodes, status) {
  if (nodes.length === 0) {
    return;
  }
  
  if (options.undoable) {
    var param = {
      status: status,
      nodes: nodes,
      firstTime: true
    };

    cy.undoRedo().do("setCloneMarkerStatus", param);
  }
  else {
    elementUtilities.setCloneMarkerStatus(nodes, status);
  }
  
  cy.style().update();
};

/*
 * Change style/css of given eles by setting getting property name to the given given value/values (Note that valueMap parameter may be
 * a single string or an id to value map). Considers undoable option.
 */
mainUtilities.changeCss = function(eles, name, valueMap) {
  if (eles.length === 0) {
    return;
  }
  
  if (!options.undoable) {
    elementUtilities.changeCss(eles, name, valueMap);
  }
  else {
    var param = {
      eles: eles,
      valueMap: valueMap,
      name: name
    };
    
    cy.undoRedo().do("changeCss", param);
  }
  
  cy.style().update();
};

/*
 * Change data of given eles by setting getting property name to the given given value/values (Note that valueMap parameter may be
 * a single string or an id to value map). Considers undoable option.
 */
mainUtilities.changeData = function(eles, name, valueMap) {
  if (eles.length === 0) {
    return;
  }
  
  if (!options.undoable) {
    elementUtilities.changeData(eles, name, valueMap);
  }
  else {
    var param = {
      eles: eles,
      valueMap: valueMap,
      name: name
    };
    
    cy.undoRedo().do("changeData", param);
  }
  
  cy.style().update();
};

/*
 * Unhide given eles (the ones which are hidden if any) and perform given layout afterward. Layout parameter may be layout options
 * or a function to call. Requires viewUtilities extension and considers undoable option.
 */
mainUtilities.showAndPerformLayout = function(eles, layoutparam) {
  var hiddenEles = eles.filter(':hidden');
  if (hiddenEles.length === 0) {
    return;
  }
  
  if (!options.undoable) {
    elementUtilities.showAndPerformLayout(hiddenEles, layoutparam);
  }
  else {
    var param = {
      eles: hiddenEles,
      layoutparam: layoutparam,
      firstTime: true
    };
    
    cy.undoRedo().do("showAndPerformLayout", param);
  }
};

module.exports = mainUtilities;
},{"./element-utilities":3,"./option-utilities":6}],6:[function(_dereq_,module,exports){
/*
 *  Extend default options and get current options by using this file 
 */

// default options
var defaults = {
  // The path of core library images when sbgnviz is required from npm and the index html 
  // file and node_modules are under the same folder then using the default value is fine
  imgPath: 'node_modules/sbgnviz/src/img',
  // Whether to fit labels to nodes
  fitLabelsToNodes: function () {
    return false;
  },
  // dynamic label size it may be 'small', 'regular', 'large'
  dynamicLabelSize: function () {
    return 'regular';
  },
  // percentage used to calculate compound paddings
  compoundPadding: function () {
    return 10;
  },
  // Whether to adjust node label font size automatically.
  // If this option return false do not adjust label sizes according to node height uses node.data('font-size')
  // instead of doing it.
  adjustNodeLabelFontSizeAutomatically: function() {
    return true;
  },
  // The selector of the component containing the sbgn network
  networkContainerSelector: '#sbgn-network-container',
  // Whether the actions are undoable, requires cytoscape-undo-redo extension
  undoable: true,
  // Whether to have undoable drag feature in undo/redo extension. This options will be passed to undo/redo extension
  undoableDrag: true
};

var optionUtilities = function () {
};

// Extend the defaults options with the user options
optionUtilities.extendOptions = function (options) {
  var result = {};

  for (var prop in defaults) {
    result[prop] = defaults[prop];
  }
  
  for (var prop in options) {
    result[prop] = options[prop];
  }

  optionUtilities.options = result;

  return options;
};

optionUtilities.getOptions = function () {
  return optionUtilities.options;
};

module.exports = optionUtilities;
},{}],7:[function(_dereq_,module,exports){
var undoRedoActionFunctions = _dereq_('./undo-redo-action-functions');
var libs = _dereq_('./lib-utilities').getLibs();
var options = _dereq_('./option-utilities').getOptions();
var $ = libs.jQuery;

var registerUndoRedoActions = function (undoableDrag) {
  if (!options.undoable) {
    return;
  }
  // create undo-redo instance
  var ur = cy.undoRedo({
    undoableDrag: undoableDrag
  });

  // register add remove actions
  ur.action("addNode", undoRedoActionFunctions.addNode, undoRedoActionFunctions.deleteElesSimple);
  ur.action("deleteElesSimple", undoRedoActionFunctions.deleteElesSimple, undoRedoActionFunctions.restoreEles);
  ur.action("addEdge", undoRedoActionFunctions.addEdge, undoRedoActionFunctions.deleteElesSimple);
  ur.action("addProcessWithConvenientEdges", undoRedoActionFunctions.addProcessWithConvenientEdges, undoRedoActionFunctions.deleteElesSimple);
  ur.action("deleteElesSmart", undoRedoActionFunctions.deleteElesSmart, undoRedoActionFunctions.restoreEles);
  ur.action("createCompoundForGivenNodes", undoRedoActionFunctions.createCompoundForGivenNodes, undoRedoActionFunctions.createCompoundForGivenNodes);

  // register general actions
  ur.action("resizeNodes", undoRedoActionFunctions.resizeNodes, undoRedoActionFunctions.resizeNodes);
  ur.action("changeNodeLabel", undoRedoActionFunctions.changeNodeLabel, undoRedoActionFunctions.changeNodeLabel);
  ur.action("changeData", undoRedoActionFunctions.changeData, undoRedoActionFunctions.changeData);
  ur.action("changeCss", undoRedoActionFunctions.changeCss, undoRedoActionFunctions.changeCss);
  ur.action("changeBendPoints", undoRedoActionFunctions.changeBendPoints, undoRedoActionFunctions.changeBendPoints);
  ur.action("changeFontProperties", undoRedoActionFunctions.changeFontProperties, undoRedoActionFunctions.changeFontProperties);
  ur.action("showAndPerformLayout", undoRedoActionFunctions.showAndPerformLayout, undoRedoActionFunctions.undoShowAndPerformLayout);

  // register SBGN actions
  ur.action("addStateOrInfoBox", undoRedoActionFunctions.addStateOrInfoBox, undoRedoActionFunctions.removeStateOrInfoBox);
  ur.action("changeStateOrInfoBox", undoRedoActionFunctions.changeStateOrInfoBox, undoRedoActionFunctions.changeStateOrInfoBox);
  ur.action("setMultimerStatus", undoRedoActionFunctions.setMultimerStatus, undoRedoActionFunctions.setMultimerStatus);
  ur.action("setCloneMarkerStatus", undoRedoActionFunctions.setCloneMarkerStatus, undoRedoActionFunctions.setCloneMarkerStatus);
  ur.action("removeStateOrInfoBox", undoRedoActionFunctions.removeStateOrInfoBox, undoRedoActionFunctions.addStateOrInfoBox);
  
  // register easy creation actions
  ur.action("createTemplateReaction", undoRedoActionFunctions.createTemplateReaction, undoRedoActionFunctions.deleteElesSimple);

  ur.action("setDefaultProperty", undoRedoActionFunctions.setDefaultProperty, undoRedoActionFunctions.setDefaultProperty);
};

module.exports = function(undoableDrag) {
  $(document).ready(function() {
    registerUndoRedoActions(undoableDrag);
  });
};
},{"./lib-utilities":4,"./option-utilities":6,"./undo-redo-action-functions":8}],8:[function(_dereq_,module,exports){
// Extends sbgnviz.undoRedoActionFunctions
var libs = _dereq_('./lib-utilities').getLibs();
var sbgnviz = libs.sbgnviz;
var undoRedoActionFunctions = sbgnviz.undoRedoActionFunctions;
var elementUtilities = _dereq_('./element-utilities');

// Section Start
// add/remove action functions

undoRedoActionFunctions.addNode = function (param) {
  var result;
  if (param.firstTime) {
    var newNode = param.newNode;
    result = elementUtilities.addNode(newNode.x, newNode.y, newNode.class, newNode.id, newNode.parent, newNode.visibility);
  }
  else {
    result = elementUtilities.restoreEles(param);
  }

  return {
    eles: result
  };
};

undoRedoActionFunctions.addEdge = function (param) {
  var result;
  if (param.firstTime) {
    var newEdge = param.newEdge;
    result = elementUtilities.addEdge(newEdge.source, newEdge.target, newEdge.class, newEdge.id, newEdge.visibility);
  }
  else {
    result = elementUtilities.restoreEles(param);
  }

  return {
    eles: result
  };
};

undoRedoActionFunctions.addProcessWithConvenientEdges = function(param) {
  var result;
  if (param.firstTime) {
    result = elementUtilities.addProcessWithConvenientEdges(param.source, param.target, param.processType);
  }
  else {
    result = elementUtilities.restoreEles(param);
  }

  return {
    eles: result
  };
};

undoRedoActionFunctions.createCompoundForGivenNodes = function (param) {
  var result = {};

  if (param.firstTime) {
    // Nodes to make compound and edges connected to them will be removed during createCompoundForGivenNodes operation
    // (internally by eles.move() operation), so mark them as removed eles for undo operation.
    var nodesToMakeCompound = param.nodesToMakeCompound;
    result.removedEles = nodesToMakeCompound.union(nodesToMakeCompound.connectedEdges());
    // Assume that all nodes to make compound have the same parent
    var oldParentId = nodesToMakeCompound[0].data("parent");
    // The parent of new compound will be the old parent of the nodes to make compound
    // New eles includes new compound and the moved eles and will be used in undo operation.
    result.newEles = elementUtilities.createCompoundForGivenNodes(nodesToMakeCompound, param.compoundType);
  }
  else {
    result.removedEles = param.newEles.remove();
    result.newEles = param.removedEles.restore();
  }

  return result;
};

// Section End
// add/remove action functions

// Section Start
// easy creation action functions

undoRedoActionFunctions.createTemplateReaction = function (param) {
  var firstTime = param.firstTime;
  var eles;

  if (firstTime) {
    eles = elementUtilities.createTemplateReaction(param.templateType, param.macromoleculeList, param.complexName, param.processPosition, param.tilingPaddingVertical, param.tilingPaddingHorizontal, param.edgeLength)
  }
  else {
    eles = param;
    cy.add(eles);
    
    cy.elements().unselect();
    eles.select();
  }

  return {
    eles: eles
  };
};

// Section End
// easy creation action functions

// Section Start
// general action functions

undoRedoActionFunctions.getNodePositions = function () {
  var positions = {};
  var nodes = cy.nodes();
  
  nodes.each(function(i, ele) {
    positions[ele.id()] = {
      x: ele.position("x"),
      y: ele.position("y")
    };
  });

  return positions;
};

undoRedoActionFunctions.returnToPositions = function (positions) {
  var currentPositions = {};
  cy.nodes().positions(function (i, ele) {
    currentPositions[ele.id()] = {
      x: ele.position("x"),
      y: ele.position("y")
    };
    
    var pos = positions[ele.id()];
    return {
      x: pos.x,
      y: pos.y
    };
  });

  return currentPositions;
};

undoRedoActionFunctions.resizeNodes = function (param) {
  var result = {
    performOperation: true
  };

  var nodes = param.nodes;

  result.sizeMap = {};
  result.useAspectRatio = false;

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    result.sizeMap[node.id()] = {
      w: node.width(),
      h: node.height()
    };
  }

  result.nodes = nodes;

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];

    if (param.performOperation) {
      if (param.sizeMap) {
        node.data("bbox").w = param.sizeMap[node.id()].w;
        node.data("bbox").h = param.sizeMap[node.id()].h;
      }
      else {
        elementUtilities.resizeNodes(param.nodes, param.width, param.height, param.useAspectRatio);
      }
    }
  }

  return result;
};

undoRedoActionFunctions.changeNodeLabel = function (param) {
  var result = {
  };
  var nodes = param.nodes;
  result.nodes = nodes;
  result.label = {};

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    result.label[node.id()] = node._private.data.label;
  }

  if (param.firstTime) {
    nodes.data('label', param.label);
  }
  else {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      node._private.data.label = param.label[node.id()];
    }
  }

  return result;
};

undoRedoActionFunctions.changeData = function (param) {
  var result = {
  };
  var eles = param.eles;
  result.name = param.name;
  result.valueMap = {};
  result.eles = eles;

  for (var i = 0; i < eles.length; i++) {
    var ele = eles[i];
    result.valueMap[ele.id()] = ele.data(param.name);
  }

  elementUtilities.changeData(param.eles, param.name, param.valueMap);

  return result;
};

undoRedoActionFunctions.changeCss = function (param) {
  var result = {
  };
  var eles = param.eles;
  result.name = param.name;
  result.valueMap = {};
  result.eles = eles;

  for (var i = 0; i < eles.length; i++) {
    var ele = eles[i];
    result.valueMap[ele.id()] = ele.css(param.name);
  }

  elementUtilities.changeCss(param.eles, param.name, param.valueMap);

  return result;
};

undoRedoActionFunctions.changeFontProperties = function (param) {
  var result = {
  };

  var eles = param.eles;
  result.data = {};
  result.eles = eles;

  for (var i = 0; i < eles.length; i++) {
    var ele = eles[i];

    result.data[ele.id()] = {};

    var data = param.firstTime ? param.data : param.data[ele.id()];

    for (var prop in data) {
      result.data[ele.id()][prop] = ele.data(prop);
    }
  }

  if (param.firstTime) {
    elementUtilities.changeFontProperties(eles, data);
  }
  else {
    for (var i = 0; i < eles.length; i++) {
      var ele = eles[i];
      
      elementUtilities.changeFontProperties(ele, data);
    }
  }

  return result;
};

/*
 * Show eles and perform layout.
 */
undoRedoActionFunctions.showAndPerformLayout = function (param) {
  var eles = param.eles;

  var result = {};
  result.positions = undoRedoActionFunctions.getNodePositions();
  
  if (param.firstTime) {
    result.eles = elementUtilities.showAndPerformLayout(param.eles, param.layoutparam);
  }
  else {
    result.eles = cy.viewUtilities().show(eles); // Show given eles
    undoRedoActionFunctions.returnToPositions(param.positions);
  }

  return result;
};

undoRedoActionFunctions.undoShowAndPerformLayout = function (param) {
  var eles = param.eles;

  var result = {};
  result.positions = undoRedoActionFunctions.getNodePositions();
  result.eles = cy.viewUtilities().hide(eles); // Hide previously unhidden eles;

  undoRedoActionFunctions.returnToPositions(param.positions);

  return result;
};

// Section End
// general action functions

// Section Start
// sbgn action functions

undoRedoActionFunctions.changeStateOrInfoBox = function (param) {
  var result = {
  };
  result.type = param.type;
  result.nodes = param.nodes;
  result.index = param.index;

  result.value = elementUtilities.changeStateOrInfoBox(param.nodes, param.index, param.value, param.type);

  cy.forceRender();

  return result;
};

undoRedoActionFunctions.addStateOrInfoBox = function (param) {
  var obj = param.obj;
  var nodes = param.nodes;

  var index = elementUtilities.addStateOrInfoBox(nodes, obj);

  cy.forceRender();

  var result = {
    nodes: nodes,
    index: index,
    obj: obj
  };
  return result;
};

undoRedoActionFunctions.removeStateOrInfoBox = function (param) {
  var index = param.index;
  var nodes = param.nodes;

  var obj = elementUtilities.removeStateOrInfoBox(nodes, index);

  cy.forceRender();

  var result = {
    nodes: nodes,
    obj: obj
  };
  return result;
};

undoRedoActionFunctions.setMultimerStatus = function (param) {
  var firstTime = param.firstTime;
  var nodes = param.nodes;
  var status = param.status;
  var resultStatus = {};

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var isMultimer = node.data('class').endsWith(' multimer');

    resultStatus[node.id()] = isMultimer;
  }

  // If this is the first time change the status of all nodes at once.
  // If not change status of each seperately to the values mapped to their id.
  if (firstTime) {
    elementUtilities.setMultimerStatus(nodes, status);
  }
  else {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      elementUtilities.setMultimerStatus(node, status[node.id()]);
    }
  }

//  if (!firstTime && _.isEqual(nodes, cy.nodes(':selected'))) {
//    $('#inspector-is-multimer').attr("checked", !$('#inspector-is-multimer').attr("checked"));
//  }

  var result = {
    status: resultStatus,
    nodes: nodes
  };

  return result;
};

undoRedoActionFunctions.setCloneMarkerStatus = function (param) {
  var nodes = param.nodes;
  var status = param.status;
  var firstTime = param.firstTime;
  var resultStatus = {};

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    resultStatus[node.id()] = node.data('clonemarker');
    var currentStatus = firstTime ? status : status[node.id()];
    elementUtilities.setCloneMarkerStatus(node, currentStatus);
  }

//  if (!firstTime && _.isEqual(nodes, cy.nodes(':selected'))) {
//    $('#inspector-is-clone-marker').attr("checked", !$('#inspector-is-clone-marker').attr("checked"));
//  }

  var result = {
    status: resultStatus,
    nodes: nodes
  };

  return result;
};

// param: {class: sbgnclass, name: propertyName, value: value}
undoRedoActionFunctions.setDefaultProperty = function (param) {
  var sbgnclass = param.class;
  var name = param.name;
  var value = param.value;
  var classDefaults = elementUtilities.defaultProperties[sbgnclass];
  var result = {
    class: sbgnclass,
    name: name,
    value: classDefaults.hasOwnProperty(name) ? classDefaults[name] : undefined
  };

  classDefaults[name] = value;

  return result;
};

// Section End
// sbgn action functions

module.exports = undoRedoActionFunctions;
},{"./element-utilities":3,"./lib-utilities":4}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9saWItdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdGtDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcGlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpe1xyXG4gIHZhciBjaGlzZSA9IHdpbmRvdy5jaGlzZSA9IGZ1bmN0aW9uKF9vcHRpb25zLCBfbGlicykge1xyXG4gICAgdmFyIGxpYnMgPSB7fTtcclxuICAgIGxpYnMualF1ZXJ5ID0gX2xpYnMualF1ZXJ5IHx8IGpRdWVyeTtcclxuICAgIGxpYnMuY3l0b3NjYXBlID0gX2xpYnMuY3l0b3NjYXBlIHx8IGN5dG9zY2FwZTtcclxuICAgIGxpYnMuc2JnbnZpeiA9IF9saWJzLnNiZ252aXogfHwgc2JnbnZpejtcclxuICAgIGxpYnMuc2F2ZUFzID0gX2xpYnMuZmlsZXNhdmVyanMgPyBfbGlicy5maWxlc2F2ZXJqcy5zYXZlQXMgOiBzYXZlQXM7XHJcbiAgICBcclxuICAgIGxpYnMuc2JnbnZpeihfb3B0aW9ucywgX2xpYnMpOyAvLyBJbml0aWxpemUgc2JnbnZpelxyXG4gICAgXHJcbiAgICAvLyBTZXQgdGhlIGxpYnJhcmllcyB0byBhY2Nlc3MgdGhlbSBmcm9tIGFueSBmaWxlXHJcbiAgICB2YXIgbGliVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpO1xyXG4gICAgbGliVXRpbGl0aWVzLnNldExpYnMobGlicyk7XHJcbiAgICBcclxuICAgIHZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbiAgICB2YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zKF9vcHRpb25zKTsgLy8gRXh0ZW5kcyB0aGUgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhlIGdpdmVuIG9wdGlvbnNcclxuICAgIFxyXG4gICAgLy8gVXBkYXRlIHN0eWxlIGFuZCBiaW5kIGV2ZW50c1xyXG4gICAgdmFyIGN5U3R5bGVBbmRFdmVudHMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9jeS1zdHlsZS1hbmQtZXZlbnRzJyk7XHJcbiAgICBjeVN0eWxlQW5kRXZlbnRzKGxpYnMuc2JnbnZpeik7XHJcbiAgICBcclxuICAgIC8vIFJlZ2lzdGVyIHVuZG8vcmVkbyBhY3Rpb25zXHJcbiAgICB2YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9yZWdpc3Rlci11bmRvLXJlZG8tYWN0aW9ucycpO1xyXG4gICAgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMob3B0aW9ucy51bmRvYWJsZURyYWcpO1xyXG4gICAgXHJcbiAgICB2YXIgbWFpblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzJyk7XHJcbiAgICB2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzJyk7XHJcbiAgICB2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy91bmRvLXJlZG8tYWN0aW9uLWZ1bmN0aW9ucycpO1xyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgdGhlIGFwaVxyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgdGhlIHByb3BlcnRpZXMgaW5oZXJpdGVkIGZyb20gc2JnbnZpelxyXG4gICAgLy8gdGhlbiBvdmVycmlkZSBzb21lIG9mIHRoZXNlIHByb3BlcnRpZXMgYW5kIGV4cG9zZSBzb21lIG5ldyBwcm9wZXJ0aWVzXHJcbiAgICBmb3IgKHZhciBwcm9wIGluIGxpYnMuc2JnbnZpeikge1xyXG4gICAgICBjaGlzZVtwcm9wXSA9IGxpYnMuc2JnbnZpeltwcm9wXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIGVhY2ggbWFpbiB1dGlsaXR5IHNlcGVyYXRlbHlcclxuICAgIGZvciAodmFyIHByb3AgaW4gbWFpblV0aWxpdGllcykge1xyXG4gICAgICBjaGlzZVtwcm9wXSA9IG1haW5VdGlsaXRpZXNbcHJvcF07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEV4cG9zZSBlbGVtZW50VXRpbGl0aWVzIGFuZCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyBhcyBpc1xyXG4gICAgY2hpc2UuZWxlbWVudFV0aWxpdGllcyA9IGVsZW1lbnRVdGlsaXRpZXM7XHJcbiAgICBjaGlzZS51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xyXG4gIH07XHJcbiAgXHJcbiAgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gY2hpc2U7XHJcbiAgfVxyXG59KSgpOyIsInZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyICQgPSBsaWJzLmpRdWVyeTtcclxudmFyIG9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKS5nZXRPcHRpb25zKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzYmdudml6KSB7XHJcbiAgLy9IZWxwZXJzXHJcbiAgXHJcbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyB0byBiZSBjYWxsZWQgYWZ0ZXIgbm9kZXMgYXJlIHJlc2l6ZWQgdGhyb3VoIHRoZSBub2RlIHJlc2l6ZSBleHRlbnNpb24gb3IgdGhyb3VnaCB1bmRvL3JlZG8gYWN0aW9uc1xyXG4gIHZhciBub2RlUmVzaXplRW5kRnVuY3Rpb24gPSBmdW5jdGlvbiAobm9kZXMpIHtcclxuICAgIGN5LnN0YXJ0QmF0Y2goKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgdmFyIHcgPSBub2RlLndpZHRoKCk7XHJcbiAgICAgIHZhciBoID0gbm9kZS5oZWlnaHQoKTtcclxuXHJcbiAgICAgIG5vZGUucmVtb3ZlU3R5bGUoJ3dpZHRoJyk7XHJcbiAgICAgIG5vZGUucmVtb3ZlU3R5bGUoJ2hlaWdodCcpO1xyXG5cclxuICAgICAgbm9kZS5kYXRhKCdiYm94JykudyA9IHc7XHJcbiAgICAgIG5vZGUuZGF0YSgnYmJveCcpLmggPSBoO1xyXG4gICAgfVxyXG4gICAgY3kuZW5kQmF0Y2goKTtcclxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgfTtcclxuICBcclxuICB2YXIgaW5pdEVsZW1lbnREYXRhID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgdmFyIGVsZWNsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgICBpZiAoIWVsZWNsYXNzKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGVsZWNsYXNzID0gZWxlbWVudFV0aWxpdGllcy5kZW11bHRpbWVyaXplQ2xhc3MoZWxlY2xhc3MpO1xyXG4gICAgdmFyIGNsYXNzUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbZWxlY2xhc3NdO1xyXG5cclxuICAgIGN5LmJhdGNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKGVsZS5pc05vZGUoKSkge1xyXG4gICAgICAgIGlmIChjbGFzc1Byb3BlcnRpZXNbJ3dpZHRoJ10gJiYgIWVsZS5kYXRhKCdiYm94Jykudykge1xyXG4gICAgICAgICAgZWxlLmRhdGEoJ2Jib3gnKS53ID0gY2xhc3NQcm9wZXJ0aWVzWyd3aWR0aCddO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2xhc3NQcm9wZXJ0aWVzWydoZWlnaHQnXSAmJiAhZWxlLmRhdGEoJ2Jib3gnKS5oKSB7XHJcbiAgICAgICAgICBlbGUuZGF0YSgnYmJveCcpLmggPSBjbGFzc1Byb3BlcnRpZXNbJ2hlaWdodCddO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdmb250LXNpemUnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtc2l6ZSddKSB7XHJcbiAgICAgICAgICBlbGUuZGF0YSgnZm9udC1zaXplJywgY2xhc3NQcm9wZXJ0aWVzWydmb250LXNpemUnXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2ZvbnQtZmFtaWx5JykgJiYgY2xhc3NQcm9wZXJ0aWVzWydmb250LWZhbWlseSddKSB7XHJcbiAgICAgICAgICBlbGUuZGF0YSgnZm9udC1mYW1pbHknLCBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtZmFtaWx5J10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdmb250LXN0eWxlJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydmb250LXN0eWxlJ10pIHtcclxuICAgICAgICAgIGVsZS5kYXRhKCdmb250LXN0eWxlJywgY2xhc3NQcm9wZXJ0aWVzWydmb250LXN0eWxlJ10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdmb250LXdlaWdodCcpICYmIGNsYXNzUHJvcGVydGllc1snZm9udC13ZWlnaHQnXSkge1xyXG4gICAgICAgICAgZWxlLmRhdGEoJ2ZvbnQtd2VpZ2h0JywgY2xhc3NQcm9wZXJ0aWVzWydmb250LXdlaWdodCddKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnYmFja2dyb3VuZC1jb2xvcicpICYmIGNsYXNzUHJvcGVydGllc1snYmFja2dyb3VuZC1jb2xvciddKSB7XHJcbiAgICAgICAgICBlbGUuZGF0YSgnYmFja2dyb3VuZC1jb2xvcicsIGNsYXNzUHJvcGVydGllc1snYmFja2dyb3VuZC1jb2xvciddKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnYmFja2dyb3VuZC1vcGFjaXR5JykgJiYgY2xhc3NQcm9wZXJ0aWVzWydiYWNrZ3JvdW5kLW9wYWNpdHknXSkge1xyXG4gICAgICAgICAgZWxlLmRhdGEoJ2JhY2tncm91bmQtb3BhY2l0eScsIGNsYXNzUHJvcGVydGllc1snYmFja2dyb3VuZC1vcGFjaXR5J10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdib3JkZXItY29sb3InKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2JvcmRlci1jb2xvciddKSB7XHJcbiAgICAgICAgICBlbGUuZGF0YSgnYm9yZGVyLWNvbG9yJywgY2xhc3NQcm9wZXJ0aWVzWydib3JkZXItY29sb3InXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2JvcmRlci13aWR0aCcpICYmIGNsYXNzUHJvcGVydGllc1snYm9yZGVyLXdpZHRoJ10pIHtcclxuICAgICAgICAgIGVsZS5kYXRhKCdib3JkZXItd2lkdGgnLCBjbGFzc1Byb3BlcnRpZXNbJ2JvcmRlci13aWR0aCddKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAoZWxlLmlzRWRnZSgpKSB7XHJcbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnd2lkdGgnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ3dpZHRoJ10pIHtcclxuICAgICAgICAgIGVsZS5kYXRhKCd3aWR0aCcsIGNsYXNzUHJvcGVydGllc1snd2lkdGgnXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2xpbmUtY29sb3InKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2xpbmUtY29sb3InXSkge1xyXG4gICAgICAgICAgZWxlLmRhdGEoJ2xpbmUtY29sb3InLCBjbGFzc1Byb3BlcnRpZXNbJ2xpbmUtY29sb3InXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG4gIFxyXG4gIC8vIFVwZGF0ZSBjeSBzdHlsZXNoZWV0XHJcbiAgdmFyIHVwZGF0ZVN0eWxlU2hlZXQgPSBmdW5jdGlvbigpIHtcclxuICAgIGN5LnN0eWxlKClcclxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2ZvbnQtc2l6ZV1cIilcclxuICAgIC5zdHlsZSh7XHJcbiAgICAgICdmb250LXNpemUnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgLy8gSWYgbm9kZSBsYWJlbHMgYXJlIGV4cGVjdGVkIHRvIGJlIGFkanVzdGVkIGF1dG9tYXRpY2FsbHkgb3IgZWxlbWVudCBjYW5ub3QgaGF2ZSBsYWJlbFxyXG4gICAgICAgIC8vIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldExhYmVsVGV4dFNpemUoKSBlbHNlIHJldHVybiBlbGUuZGF0YSgnZm9udC1zaXplJylcclxuICAgICAgICB2YXIgb3B0ID0gb3B0aW9ucy5hZGp1c3ROb2RlTGFiZWxGb250U2l6ZUF1dG9tYXRpY2FsbHk7XHJcbiAgICAgICAgdmFyIGFkanVzdCA9IHR5cGVvZiBvcHQgPT09ICdmdW5jdGlvbicgPyBvcHQoKSA6IG9wdDtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIWFkanVzdCkge1xyXG4gICAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250LXNpemUnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0TGFiZWxUZXh0U2l6ZShlbGUpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bZm9udC1mYW1pbHldXCIpXHJcbiAgICAuc3R5bGUoe1xyXG4gICAgICAnZm9udC1mYW1pbHknOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250LWZhbWlseScpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bZm9udC1zdHlsZV1cIilcclxuICAgIC5zdHlsZSh7XHJcbiAgICAgICdmb250LXN0eWxlJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnZm9udC1zdHlsZScpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bZm9udC13ZWlnaHRdXCIpXHJcbiAgICAuc3R5bGUoe1xyXG4gICAgICAnZm9udC13ZWlnaHQnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250LXdlaWdodCcpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bYmFja2dyb3VuZC1jb2xvcl1cIilcclxuICAgIC5zdHlsZSh7XHJcbiAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnYmFja2dyb3VuZC1jb2xvcicpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bYmFja2dyb3VuZC1vcGFjaXR5XVwiKVxyXG4gICAgLnN0eWxlKHtcclxuICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2JhY2tncm91bmQtb3BhY2l0eScpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bYm9yZGVyLXdpZHRoXVwiKVxyXG4gICAgLnN0eWxlKHtcclxuICAgICAgJ2JvcmRlci13aWR0aCc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2JvcmRlci13aWR0aCcpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bYm9yZGVyLWNvbG9yXVwiKVxyXG4gICAgLnN0eWxlKHtcclxuICAgICAgJ2JvcmRlci1jb2xvcic6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2JvcmRlci1jb2xvcicpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzc11bbGluZS1jb2xvcl1cIilcclxuICAgIC5zdHlsZSh7XHJcbiAgICAgICdsaW5lLWNvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnbGluZS1jb2xvcicpO1xyXG4gICAgICB9LFxyXG4gICAgICAnc291cmNlLWFycm93LWNvbG9yJzogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdsaW5lLWNvbG9yJyk7XHJcbiAgICAgIH0sXHJcbiAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiBmdW5jdGlvbihlbGUpIHtcclxuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2xpbmUtY29sb3InKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3NdW3dpZHRoXVwiKVxyXG4gICAgLnN0eWxlKHtcclxuICAgICAgJ3dpZHRoJzogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCd3aWR0aCcpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnNlbGVjdG9yKFwibm9kZTpzZWxlY3RlZFwiKVxyXG4gICAgLnN0eWxlKHtcclxuICAgICAgJ2JvcmRlci1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgJ3RleHQtb3V0bGluZS1jb2xvcic6ICcjMDAwJ1xyXG4gICAgfSlcclxuICAgIC5zZWxlY3RvcihcImVkZ2U6c2VsZWN0ZWRcIilcclxuICAgIC5zdHlsZSh7XHJcbiAgICAgICdsaW5lLWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyNkNjc2MTQnXHJcbiAgICB9KS51cGRhdGUoKTtcclxuICB9O1xyXG4gIFxyXG4gIC8vIEJpbmQgZXZlbnRzXHJcbiAgdmFyIGJpbmRDeUV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY3kub24oXCJub2RlcmVzaXplLnJlc2l6ZWVuZFwiLCBmdW5jdGlvbiAoZXZlbnQsIHR5cGUsIG5vZGUpIHtcclxuICAgICAgbm9kZVJlc2l6ZUVuZEZ1bmN0aW9uKG5vZGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oXCJhZnRlckRvXCIsIGZ1bmN0aW9uIChldmVudCwgYWN0aW9uTmFtZSwgYXJncykge1xyXG4gICAgICBcclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKFwiYWZ0ZXJVbmRvXCIsIGZ1bmN0aW9uIChldmVudCwgYWN0aW9uTmFtZSwgYXJncykge1xyXG4gICAgICBpZiAoYWN0aW9uTmFtZSA9PT0gJ3Jlc2l6ZScpIHtcclxuICAgICAgICBub2RlUmVzaXplRW5kRnVuY3Rpb24oYXJncy5ub2RlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oXCJhZnRlclJlZG9cIiwgZnVuY3Rpb24gKGV2ZW50LCBhY3Rpb25OYW1lLCBhcmdzKSB7XHJcbiAgICAgIGlmIChhY3Rpb25OYW1lID09PSAncmVzaXplJykge1xyXG4gICAgICAgIG5vZGVSZXNpemVFbmRGdW5jdGlvbihhcmdzLm5vZGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgY3kub24oXCJhZGRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHZhciBlbGUgPSBldmVudC5jeVRhcmdldDtcclxuICAgICAgaW5pdEVsZW1lbnREYXRhKGVsZSk7XHJcbiAgICB9KTtcclxuICB9O1xyXG4gIC8vIEhlbHBlcnMgRW5kXHJcbiAgXHJcbiAgLy8gRG8gdGhlc2UganVzdCBvbmUgdGltZVxyXG4gICQoZG9jdW1lbnQpLm9uZSgndXBkYXRlR3JhcGhFbmQnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgYmluZEN5RXZlbnRzKCk7XHJcbiAgICB1cGRhdGVTdHlsZVNoZWV0KCk7XHJcbiAgICB2YXIgZWxlcyA9IGN5LmVsZW1lbnRzKCk7XHJcbiAgICBcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpbml0RWxlbWVudERhdGEoZWxlc1tpXSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07IiwiLy8gRXh0ZW5kcyBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXNcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBzYmdudml6ID0gbGlicy5zYmdudml6O1xyXG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xyXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHNiZ252aXouZWxlbWVudFV0aWxpdGllcztcclxudmFyIG9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKS5nZXRPcHRpb25zKCk7XHJcblxyXG5lbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzID0ge1xyXG4gIFwicHJvY2Vzc1wiOiB7XHJcbiAgICB3aWR0aDogMTUsXHJcbiAgICBoZWlnaHQ6IDE1LFxyXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXHJcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxyXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXHJcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXHJcbiAgfSxcclxuICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiB7XHJcbiAgICB3aWR0aDogMTUsXHJcbiAgICBoZWlnaHQ6IDE1LFxyXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXHJcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxyXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXHJcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXHJcbiAgfSxcclxuICBcInVuY2VydGFpbiBwcm9jZXNzXCI6IHtcclxuICAgIHdpZHRoOiAxNSxcclxuICAgIGhlaWdodDogMTUsXHJcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcclxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXHJcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcclxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcclxuICB9LFxyXG4gIFwiYXNzb2NpYXRpb25cIjoge1xyXG4gICAgd2lkdGg6IDE1LFxyXG4gICAgaGVpZ2h0OiAxNSxcclxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcclxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxyXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xyXG4gIH0sXHJcbiAgXCJkaXNzb2NpYXRpb25cIjoge1xyXG4gICAgd2lkdGg6IDE1LFxyXG4gICAgaGVpZ2h0OiAxNSxcclxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcclxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxyXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xyXG4gIH0sXHJcbiAgXCJtYWNyb21vbGVjdWxlXCI6IHtcclxuICAgIHdpZHRoOiA3MCxcclxuICAgIGhlaWdodDogMzUsXHJcbiAgICAnZm9udC1zaXplJzogMTEsXHJcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcclxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXHJcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcclxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcclxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxyXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xyXG4gICAgXHJcbiAgfSxcclxuICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHtcclxuICAgIHdpZHRoOiA3MCxcclxuICAgIGhlaWdodDogMzUsXHJcbiAgICAnZm9udC1zaXplJzogMTEsXHJcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcclxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXHJcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcclxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcclxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxyXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xyXG4gIH0sXHJcbiAgXCJzaW1wbGUgY2hlbWljYWxcIjoge1xyXG4gICAgd2lkdGg6IDM1LFxyXG4gICAgaGVpZ2h0OiAzNSxcclxuICAgICdmb250LXNpemUnOiAxMSxcclxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxyXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcclxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxyXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXHJcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxyXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXHJcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXHJcbiAgfSxcclxuICBcInNvdXJjZSBhbmQgc2lua1wiOiB7XHJcbiAgICB3aWR0aDogMjUsXHJcbiAgICBoZWlnaHQ6IDI1LFxyXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxyXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXHJcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxyXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXHJcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcclxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXHJcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcclxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcclxuICB9LFxyXG4gIFwidGFnXCI6IHtcclxuICAgIHdpZHRoOiAzNSxcclxuICAgIGhlaWdodDogMzUsXHJcbiAgICAnZm9udC1zaXplJzogMTEsXHJcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcclxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXHJcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcclxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcclxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxyXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xyXG4gIH0sXHJcbiAgXCJwaGVub3R5cGVcIjoge1xyXG4gICAgd2lkdGg6IDcwLFxyXG4gICAgaGVpZ2h0OiAzNSxcclxuICAgICdmb250LXNpemUnOiAxMSxcclxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxyXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcclxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxyXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXHJcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxyXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXHJcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXHJcbiAgfSxcclxuICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiB7XHJcbiAgICB3aWR0aDogNzAsXHJcbiAgICBoZWlnaHQ6IDM1LFxyXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxyXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXHJcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxyXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXHJcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcclxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXHJcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcclxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcclxuICB9LFxyXG4gIFwicGVydHVyYmluZyBhZ2VudFwiOiB7XHJcbiAgICB3aWR0aDogNzAsXHJcbiAgICBoZWlnaHQ6IDM1LFxyXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxyXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXHJcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxyXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXHJcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcclxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXHJcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcclxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcclxuICB9LFxyXG4gIFwiY29tcGxleFwiOiB7XHJcbiAgICB3aWR0aDogMTAwLFxyXG4gICAgaGVpZ2h0OiAxMDAsXHJcbiAgICAnZm9udC1zaXplJzogMTEsXHJcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcclxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXHJcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcclxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcclxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxyXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xyXG4gIH0sXHJcbiAgXCJjb21wYXJ0bWVudFwiOiB7XHJcbiAgICB3aWR0aDogMTAwLFxyXG4gICAgaGVpZ2h0OiAxMDAsXHJcbiAgICAnZm9udC1zaXplJzogMTEsXHJcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcclxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXHJcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcclxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcclxuICAgICdib3JkZXItd2lkdGgnOiAzLjI1LFxyXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xyXG4gIH0sXHJcbiAgXCJhbmRcIjoge1xyXG4gICAgd2lkdGg6IDI1LFxyXG4gICAgaGVpZ2h0OiAyNSxcclxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcclxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxyXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xyXG4gIH0sXHJcbiAgXCJvclwiOiB7XHJcbiAgICB3aWR0aDogMjUsXHJcbiAgICBoZWlnaHQ6IDI1LFxyXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxyXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXHJcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxyXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXHJcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXHJcbiAgfSxcclxuICBcIm5vdFwiOiB7XHJcbiAgICB3aWR0aDogMjUsXHJcbiAgICBoZWlnaHQ6IDI1LFxyXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxyXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXHJcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxyXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXHJcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXHJcbiAgfSxcclxuICBcImNvbnN1bXB0aW9uXCI6IHtcclxuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxyXG4gICAgJ3dpZHRoJzogMS4yNVxyXG4gIH0sXHJcbiAgXCJwcm9kdWN0aW9uXCI6IHtcclxuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxyXG4gICAgJ3dpZHRoJzogMS4yNVxyXG4gIH0sXHJcbiAgXCJtb2R1bGF0aW9uXCI6IHtcclxuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxyXG4gICAgJ3dpZHRoJzogMS4yNVxyXG4gIH0sXHJcbiAgXCJzdGltdWxhdGlvblwiOiB7XHJcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcclxuICAgICd3aWR0aCc6IDEuMjVcclxuICB9LFxyXG4gIFwiY2F0YWx5c2lzXCI6IHtcclxuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxyXG4gICAgJ3dpZHRoJzogMS4yNVxyXG4gIH0sXHJcbiAgXCJpbmhpYml0aW9uXCI6IHtcclxuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxyXG4gICAgJ3dpZHRoJzogMS4yNVxyXG4gIH0sXHJcbiAgXCJuZWNlc3Nhcnkgc3RpbXVsYXRpb25cIjoge1xyXG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXHJcbiAgICAnd2lkdGgnOiAxLjI1XHJcbiAgfSxcclxuICBcImxvZ2ljIGFyY1wiOiB7XHJcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcclxuICAgICd3aWR0aCc6IDEuMjVcclxuICB9LFxyXG4gIFwiZXF1aXZhbGVuY2UgYXJjXCI6IHtcclxuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxyXG4gICAgJ3dpZHRoJzogMS4yNVxyXG4gIH1cclxufTtcclxuXHJcbi8vIFNlY3Rpb24gU3RhcnRcclxuLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcclxuXHJcbmVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSA9IGZ1bmN0aW9uICh4LCB5LCBzYmduY2xhc3MsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcclxuICB2YXIgZGVmYXVsdFByb3BlcnRpZXMgPSB0aGlzLmRlZmF1bHRQcm9wZXJ0aWVzO1xyXG4gIHZhciBkZWZhdWx0cyA9IGRlZmF1bHRQcm9wZXJ0aWVzW3NiZ25jbGFzc107XHJcblxyXG4gIHZhciB3aWR0aCA9IGRlZmF1bHRzID8gZGVmYXVsdHMud2lkdGggOiA1MDtcclxuICB2YXIgaGVpZ2h0ID0gZGVmYXVsdHMgPyBkZWZhdWx0cy5oZWlnaHQgOiA1MDtcclxuICBcclxuICB2YXIgY3NzID0ge307XHJcbiAgXHJcbiAgaWYgKHZpc2liaWxpdHkpIHtcclxuICAgIGNzcy52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcclxuICB9XHJcblxyXG4gIGlmIChkZWZhdWx0cyAmJiBkZWZhdWx0cy5tdWx0aW1lcikge1xyXG4gICAgc2JnbmNsYXNzICs9IFwiIG11bHRpbWVyXCI7XHJcbiAgfVxyXG4gIHZhciBkYXRhID0ge1xyXG4gICAgY2xhc3M6IHNiZ25jbGFzcyxcclxuICAgIGJib3g6IHtcclxuICAgICAgaDogaGVpZ2h0LFxyXG4gICAgICB3OiB3aWR0aCxcclxuICAgICAgeDogeCxcclxuICAgICAgeTogeVxyXG4gICAgfSxcclxuICAgIHN0YXRlc2FuZGluZm9zOiBbXSxcclxuICAgIHBvcnRzOiBbXSxcclxuICAgIGNsb25lbWFya2VyOiBkZWZhdWx0cyAmJiBkZWZhdWx0cy5jbG9uZW1hcmtlciA/IGRlZmF1bHRzLmNsb25lbWFya2VyIDogdW5kZWZpbmVkXHJcbiAgfTtcclxuXHJcbiAgaWYoaWQpIHtcclxuICAgIGRhdGEuaWQgPSBpZDtcclxuICB9XHJcbiAgXHJcbiAgaWYgKHBhcmVudCkge1xyXG4gICAgZGF0YS5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgfVxyXG5cclxuICB2YXIgZWxlcyA9IGN5LmFkZCh7XHJcbiAgICBncm91cDogXCJub2Rlc1wiLFxyXG4gICAgZGF0YTogZGF0YSxcclxuICAgIGNzczogY3NzLFxyXG4gICAgcG9zaXRpb246IHtcclxuICAgICAgeDogeCxcclxuICAgICAgeTogeVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICB2YXIgbmV3Tm9kZSA9IGVsZXNbZWxlcy5sZW5ndGggLSAxXTtcclxuXHJcbiAgcmV0dXJuIG5ld05vZGU7XHJcbn07XHJcblxyXG5lbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UgPSBmdW5jdGlvbiAoc291cmNlLCB0YXJnZXQsIHNiZ25jbGFzcywgaWQsIHZpc2liaWxpdHkpIHtcclxuICB2YXIgZGVmYXVsdFByb3BlcnRpZXMgPSB0aGlzLmRlZmF1bHRQcm9wZXJ0aWVzO1xyXG4gIHZhciBkZWZhdWx0cyA9IGRlZmF1bHRQcm9wZXJ0aWVzW3NiZ25jbGFzc107XHJcbiAgXHJcbiAgdmFyIGNzcyA9IHt9O1xyXG5cclxuICBpZiAodmlzaWJpbGl0eSkge1xyXG4gICAgY3NzLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xyXG4gIH1cclxuXHJcbiAgdmFyIGRhdGEgPSB7XHJcbiAgICAgIHNvdXJjZTogc291cmNlLFxyXG4gICAgICB0YXJnZXQ6IHRhcmdldCxcclxuICAgICAgY2xhc3M6IHNiZ25jbGFzc1xyXG4gIH07XHJcbiAgXHJcbiAgaWYoaWQpIHtcclxuICAgIGRhdGEuaWQgPSBpZDtcclxuICB9XHJcblxyXG4gIHZhciBlbGVzID0gY3kuYWRkKHtcclxuICAgIGdyb3VwOiBcImVkZ2VzXCIsXHJcbiAgICBkYXRhOiBkYXRhLFxyXG4gICAgY3NzOiBjc3NcclxuICB9KTtcclxuXHJcbiAgdmFyIG5ld0VkZ2UgPSBlbGVzW2VsZXMubGVuZ3RoIC0gMV07XHJcbiAgXHJcbiAgcmV0dXJuIG5ld0VkZ2U7XHJcbn07XHJcblxyXG5lbGVtZW50VXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24oX3NvdXJjZSwgX3RhcmdldCwgcHJvY2Vzc1R5cGUpIHtcclxuICAvLyBJZiBzb3VyY2UgYW5kIHRhcmdldCBJRHMgYXJlIGdpdmVuIGdldCB0aGUgZWxlbWVudHMgYnkgSURzXHJcbiAgdmFyIHNvdXJjZSA9IHR5cGVvZiBfc291cmNlID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9zb3VyY2UpIDogX3NvdXJjZTtcclxuICB2YXIgdGFyZ2V0ID0gdHlwZW9mIF90YXJnZXQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3RhcmdldCkgOiBfdGFyZ2V0O1xyXG4gIFxyXG4gIC8vIFByb2Nlc3MgcGFyZW50IHNob3VsZCBiZSB0aGUgY2xvc2VzdCBjb21tb24gYW5jZXN0b3Igb2YgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0IG5vZGVzXHJcbiAgdmFyIHByb2Nlc3NQYXJlbnQgPSBjeS5jb2xsZWN0aW9uKFtzb3VyY2VbMF0sIHRhcmdldFswXV0pLmNvbW1vbkFuY2VzdG9ycygpLmZpcnN0KCk7XHJcbiAgXHJcbiAgLy8gUHJvY2VzcyBzaG91bGQgYmUgYXQgdGhlIG1pZGRsZSBvZiB0aGUgc291cmNlIGFuZCB0YXJnZXQgbm9kZXNcclxuICB2YXIgeCA9ICggc291cmNlLnBvc2l0aW9uKCd4JykgKyB0YXJnZXQucG9zaXRpb24oJ3gnKSApIC8gMjtcclxuICB2YXIgeSA9ICggc291cmNlLnBvc2l0aW9uKCd5JykgKyB0YXJnZXQucG9zaXRpb24oJ3knKSApIC8gMjtcclxuICBcclxuICAvLyBDcmVhdGUgdGhlIHByb2Nlc3Mgd2l0aCBnaXZlbi9jYWxjdWxhdGVkIHZhcmlhYmxlc1xyXG4gIHZhciBwcm9jZXNzID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHgsIHksIHByb2Nlc3NUeXBlLCB1bmRlZmluZWQsIHByb2Nlc3NQYXJlbnQuaWQoKSk7XHJcbiAgXHJcbiAgLy8gQ3JlYXRlIHRoZSBlZGdlcyBvbmUgaXMgYmV0d2VlbiB0aGUgcHJvY2VzcyBhbmQgdGhlIHNvdXJjZSBub2RlICh3aGljaCBzaG91bGQgYmUgYSBjb25zdW1wdGlvbiksIFxyXG4gIC8vIHRoZSBvdGhlciBvbmUgaXMgYmV0d2VlbiB0aGUgcHJvY2VzcyBhbmQgdGhlIHRhcmdldCBub2RlICh3aGljaCBzaG91bGQgYmUgYSBwcm9kdWN0aW9uKS5cclxuICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBwbGVhc2UgcmVmZXIgdG8gU0JHTi1QRCByZWZlcmVuY2UgY2FyZC5cclxuICB2YXIgZWRnZUJ0d1NyYyA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShzb3VyY2UuaWQoKSwgcHJvY2Vzcy5pZCgpLCAnY29uc3VtcHRpb24nKTtcclxuICB2YXIgZWRnZUJ0d1RndCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIHRhcmdldC5pZCgpLCAncHJvZHVjdGlvbicpO1xyXG4gIFxyXG4gIC8vIENyZWF0ZSBhIGNvbGxlY3Rpb24gaW5jbHVkaW5nIHRoZSBlbGVtZW50cyBhbmQgdG8gYmUgcmV0dXJuZWRcclxuICB2YXIgY29sbGVjdGlvbiA9IGN5LmNvbGxlY3Rpb24oW3Byb2Nlc3NbMF0sIGVkZ2VCdHdTcmNbMF0sIGVkZ2VCdHdUZ3RbMF1dKTtcclxuICByZXR1cm4gY29sbGVjdGlvbjtcclxufTtcclxuXHJcbi8qXHJcbiAqIFJldHVybnMgaWYgdGhlIGVsZW1lbnRzIHdpdGggdGhlIGdpdmVuIHBhcmVudCBjbGFzcyBjYW4gYmUgcGFyZW50IG9mIHRoZSBlbGVtZW50cyB3aXRoIHRoZSBnaXZlbiBub2RlIGNsYXNzXHJcbiAqL1xyXG5lbGVtZW50VXRpbGl0aWVzLmlzVmFsaWRQYXJlbnQgPSBmdW5jdGlvbihfbm9kZUNsYXNzLCBfcGFyZW50Q2xhc3MpIHtcclxuICAvLyBJZiBub2RlQ2xhc3MgYW5kIHBhcmVudENsYXNzIHBhcmFtcyBhcmUgZWxlbWVudHMgaXRzZWx2ZXMgaW5zdGVhZCBvZiB0aGVpciBjbGFzcyBuYW1lcyBoYW5kbGUgaXRcclxuICB2YXIgbm9kZUNsYXNzID0gdHlwZW9mIF9ub2RlQ2xhc3MgIT09ICdzdHJpbmcnID8gX25vZGVDbGFzcy5kYXRhKCdjbGFzcycpIDogX25vZGVDbGFzcztcclxuICB2YXIgcGFyZW50Q2xhc3MgPSBfcGFyZW50Q2xhc3MgIT0gdW5kZWZpbmVkICYmIHR5cGVvZiBfcGFyZW50Q2xhc3MgIT09ICdzdHJpbmcnID8gX3BhcmVudENsYXNzLmRhdGEoJ2NsYXNzJykgOiBfcGFyZW50Q2xhc3M7XHJcbiAgXHJcbiAgaWYgKHBhcmVudENsYXNzID09IHVuZGVmaW5lZCB8fCBwYXJlbnRDbGFzcyA9PT0gJ2NvbXBhcnRtZW50JykgeyAvLyBDb21wYXJ0bWVudHMgYW5kIHRoZSByb290IGNhbiBpbmNsdWRlIGFueSB0eXBlIG9mIG5vZGVzXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgZWxzZSBpZiAocGFyZW50Q2xhc3MgPT09ICdjb21wbGV4JykgeyAvLyBDb21wbGV4ZXMgY2FuIG9ubHkgaW5jbHVkZSBFUE5zXHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKG5vZGVDbGFzcyk7XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiBmYWxzZTsgLy8gQ3VycmVudGx5IGp1c3QgJ2NvbXBhcnRtZW50JyBhbmQgJ2NvbXBsZXgnIGNvbXBvdW5kcyBhcmUgc3VwcG9ydGVkIHJldHVybiBmYWxzZSBmb3IgYW55IG90aGVyIHBhcmVudENsYXNzXHJcbn07XHJcblxyXG4vKlxyXG4gKiBUaGlzIG1ldGhvZCBhc3N1bWVzIHRoYXQgcGFyYW0ubm9kZXNUb01ha2VDb21wb3VuZCBjb250YWlucyBhdCBsZWFzdCBvbmUgbm9kZVxyXG4gKiBhbmQgYWxsIG9mIHRoZSBub2RlcyBpbmNsdWRpbmcgaW4gaXQgaGF2ZSB0aGUgc2FtZSBwYXJlbnQuIEl0IGNyZWF0ZXMgYSBjb21wb3VuZCBmb3QgdGhlIGdpdmVuIG5vZGVzIGFuIGhhdmluZyB0aGUgZ2l2ZW4gdHlwZS5cclxuICovXHJcbmVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKG5vZGVzVG9NYWtlQ29tcG91bmQsIGNvbXBvdW5kVHlwZSkge1xyXG4gIHZhciBvbGRQYXJlbnRJZCA9IG5vZGVzVG9NYWtlQ29tcG91bmRbMF0uZGF0YShcInBhcmVudFwiKTtcclxuICAvLyBUaGUgcGFyZW50IG9mIG5ldyBjb21wb3VuZCB3aWxsIGJlIHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kLiB4LCB5IGFuZCBpZCBwYXJhbWV0ZXJzIGFyZSBub3Qgc2V0LlxyXG4gIHZhciBuZXdDb21wb3VuZCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29tcG91bmRUeXBlLCB1bmRlZmluZWQsIG9sZFBhcmVudElkKTtcclxuICB2YXIgbmV3Q29tcG91bmRJZCA9IG5ld0NvbXBvdW5kLmlkKCk7XHJcbiAgdmFyIG5ld0VsZXMgPSBub2Rlc1RvTWFrZUNvbXBvdW5kLm1vdmUoe3BhcmVudDogbmV3Q29tcG91bmRJZH0pO1xyXG4gIG5ld0VsZXMgPSBuZXdFbGVzLnVuaW9uKG5ld0NvbXBvdW5kKTtcclxuICByZXR1cm4gbmV3RWxlcztcclxufTtcclxuXHJcbi8qXHJcbiAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxyXG4gKiBpbiB0aGUgY29tcGxleC4gUGFyYW1ldGVycyBhcmUgZXhwbGFpbmVkIGJlbG93LlxyXG4gKiB0ZW1wbGF0ZVR5cGU6IFRoZSB0eXBlIG9mIHRoZSB0ZW1wbGF0ZSByZWFjdGlvbi4gSXQgbWF5IGJlICdhc3NvY2lhdGlvbicgb3IgJ2Rpc3NvY2lhdGlvbicgZm9yIG5vdy5cclxuICogbWFjcm9tb2xlY3VsZUxpc3Q6IFRoZSBsaXN0IG9mIHRoZSBuYW1lcyBvZiBtYWNyb21vbGVjdWxlcyB3aGljaCB3aWxsIGludm9sdmUgaW4gdGhlIHJlYWN0aW9uLlxyXG4gKiBjb21wbGV4TmFtZTogVGhlIG5hbWUgb2YgdGhlIGNvbXBsZXggaW4gdGhlIHJlYWN0aW9uLlxyXG4gKiBwcm9jZXNzUG9zaXRpb246IFRoZSBtb2RhbCBwb3NpdGlvbiBvZiB0aGUgcHJvY2VzcyBpbiB0aGUgcmVhY3Rpb24uIFRoZSBkZWZhdWx0IHZhbHVlIGlzIHRoZSBjZW50ZXIgb2YgdGhlIGNhbnZhcy5cclxuICogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiBUaGlzIG9wdGlvbiB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY29zZS1iaWxrZW50IGxheW91dCB3aXRoIHRoZSBzYW1lIG5hbWUuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDE1LlxyXG4gKiB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cclxuICogZWRnZUxlbmd0aDogVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSBtYWNyb21vbGVjdWxlcyBhdCB0aGUgYm90aCBzaWRlcy5cclxuICovXHJcbmVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKSB7XHJcbiAgdmFyIGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1tcIm1hY3JvbW9sZWN1bGVcIl07XHJcbiAgdmFyIHRlbXBsYXRlVHlwZSA9IHRlbXBsYXRlVHlwZTtcclxuICB2YXIgcHJvY2Vzc1dpZHRoID0gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1t0ZW1wbGF0ZVR5cGVdID8gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1t0ZW1wbGF0ZVR5cGVdLndpZHRoIDogNTA7XHJcbiAgdmFyIG1hY3JvbW9sZWN1bGVXaWR0aCA9IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID8gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMud2lkdGggOiA1MDtcclxuICB2YXIgbWFjcm9tb2xlY3VsZUhlaWdodCA9IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID8gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMuaGVpZ2h0IDogNTA7XHJcbiAgdmFyIHByb2Nlc3NQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbiA/IHByb2Nlc3NQb3NpdGlvbiA6IGVsZW1lbnRVdGlsaXRpZXMuY29udmVydFRvTW9kZWxQb3NpdGlvbih7eDogY3kud2lkdGgoKSAvIDIsIHk6IGN5LmhlaWdodCgpIC8gMn0pO1xyXG4gIHZhciBtYWNyb21vbGVjdWxlTGlzdCA9IG1hY3JvbW9sZWN1bGVMaXN0O1xyXG4gIHZhciBjb21wbGV4TmFtZSA9IGNvbXBsZXhOYW1lO1xyXG4gIHZhciBudW1PZk1hY3JvbW9sZWN1bGVzID0gbWFjcm9tb2xlY3VsZUxpc3QubGVuZ3RoO1xyXG4gIHZhciB0aWxpbmdQYWRkaW5nVmVydGljYWwgPSB0aWxpbmdQYWRkaW5nVmVydGljYWwgPyB0aWxpbmdQYWRkaW5nVmVydGljYWwgOiAxNTtcclxuICB2YXIgdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPSB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA/IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsIDogMTU7XHJcbiAgdmFyIGVkZ2VMZW5ndGggPSBlZGdlTGVuZ3RoID8gZWRnZUxlbmd0aCA6IDYwO1xyXG5cclxuICBjeS5zdGFydEJhdGNoKCk7XHJcblxyXG4gIHZhciB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcztcclxuICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XHJcbiAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XHJcbiAgfVxyXG5cclxuICAvL0NyZWF0ZSB0aGUgcHJvY2VzcyBpbiB0ZW1wbGF0ZSB0eXBlXHJcbiAgdmFyIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCB0ZW1wbGF0ZVR5cGUpO1xyXG4gIHByb2Nlc3MuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcblxyXG4gIC8vRGVmaW5lIHRoZSBzdGFydGluZyB5IHBvc2l0aW9uXHJcbiAgdmFyIHlQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi55IC0gKChudW1PZk1hY3JvbW9sZWN1bGVzIC0gMSkgLyAyKSAqIChtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsKTtcclxuXHJcbiAgLy9DcmVhdGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXNcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mTWFjcm9tb2xlY3VsZXM7IGkrKykge1xyXG4gICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMsIHlQb3NpdGlvbiwgXCJtYWNyb21vbGVjdWxlXCIpO1xyXG4gICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcclxuICAgIG5ld05vZGUuZGF0YSgnbGFiZWwnLCBtYWNyb21vbGVjdWxlTGlzdFtpXSk7XHJcblxyXG4gICAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubmVjdGVkIHRvIHRoZSBuZXcgbWFjcm9tb2xlY3VsZVxyXG4gICAgdmFyIG5ld0VkZ2U7XHJcbiAgICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XHJcbiAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3Tm9kZS5pZCgpLCBwcm9jZXNzLmlkKCksICdjb25zdW1wdGlvbicpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBuZXdOb2RlLmlkKCksICdwcm9kdWN0aW9uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgbmV3RWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcclxuXHJcbiAgICAvL3VwZGF0ZSB0aGUgeSBwb3NpdGlvblxyXG4gICAgeVBvc2l0aW9uICs9IG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XHJcbiAgfVxyXG5cclxuICAvL0NyZWF0ZSB0aGUgY29tcGxleCBpbmNsdWRpbmcgbWFjcm9tb2xlY3VsZXMgaW5zaWRlIG9mIGl0XHJcbiAgLy9UZW1wcm9yYXJpbHkgYWRkIGl0IHRvIHRoZSBwcm9jZXNzIHBvc2l0aW9uIHdlIHdpbGwgbW92ZSBpdCBhY2NvcmRpbmcgdG8gdGhlIGxhc3Qgc2l6ZSBvZiBpdFxyXG4gIHZhciBjb21wbGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwgJ2NvbXBsZXgnKTtcclxuICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xyXG4gIGNvbXBsZXguZGF0YSgnanVzdEFkZGVkTGF5b3V0Tm9kZScsIHRydWUpO1xyXG5cclxuICAvL0lmIGEgbmFtZSBpcyBzcGVjaWZpZWQgZm9yIHRoZSBjb21wbGV4IHNldCBpdHMgbGFiZWwgYWNjb3JkaW5nbHlcclxuICBpZiAoY29tcGxleE5hbWUpIHtcclxuICAgIGNvbXBsZXguZGF0YSgnbGFiZWwnLCBjb21wbGV4TmFtZSk7XHJcbiAgfVxyXG5cclxuICAvL2NyZWF0ZSB0aGUgZWRnZSBjb25ubmVjdGVkIHRvIHRoZSBjb21wbGV4XHJcbiAgdmFyIGVkZ2VPZkNvbXBsZXg7XHJcbiAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xyXG4gICAgZWRnZU9mQ29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIGNvbXBsZXguaWQoKSwgJ3Byb2R1Y3Rpb24nKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlZGdlT2ZDb21wbGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKGNvbXBsZXguaWQoKSwgcHJvY2Vzcy5pZCgpLCAnY29uc3VtcHRpb24nKTtcclxuICB9XHJcbiAgZWRnZU9mQ29tcGxleC5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcclxuXHJcbiAgLy9DcmVhdGUgdGhlIG1hY3JvbW9sZWN1bGVzIGluc2lkZSB0aGUgY29tcGxleFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtT2ZNYWNyb21vbGVjdWxlczsgaSsrKSB7XHJcbiAgICAvLyBBZGQgYSBtYWNyb21vbGVjdWxlIG5vdCBoYXZpbmcgYSBwcmV2aW91c2x5IGRlZmluZWQgaWQgYW5kIGhhdmluZyB0aGUgY29tcGxleCBjcmVhdGVkIGluIHRoaXMgcmVhY3Rpb24gYXMgcGFyZW50XHJcbiAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShjb21wbGV4LnBvc2l0aW9uKCd4JyksIGNvbXBsZXgucG9zaXRpb24oJ3knKSwgXCJtYWNyb21vbGVjdWxlXCIsIHVuZGVmaW5lZCwgY29tcGxleC5pZCgpKTtcclxuICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcbiAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgbWFjcm9tb2xlY3VsZUxpc3RbaV0pO1xyXG4gICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJywgdHJ1ZSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LmVuZEJhdGNoKCk7XHJcblxyXG4gIHZhciBsYXlvdXROb2RlcyA9IGN5Lm5vZGVzKCdbanVzdEFkZGVkTGF5b3V0Tm9kZV0nKTtcclxuICBsYXlvdXROb2Rlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJyk7XHJcbiAgbGF5b3V0Tm9kZXMubGF5b3V0KHtcclxuICAgIG5hbWU6ICdjb3NlLWJpbGtlbnQnLFxyXG4gICAgcmFuZG9taXplOiBmYWxzZSxcclxuICAgIGZpdDogZmFsc2UsXHJcbiAgICBhbmltYXRlOiBmYWxzZSxcclxuICAgIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLFxyXG4gICAgdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLFxyXG4gICAgc3RvcDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAvL3JlLXBvc2l0aW9uIHRoZSBub2RlcyBpbnNpZGUgdGhlIGNvbXBsZXhcclxuICAgICAgdmFyIHN1cHBvc2VkWFBvc2l0aW9uO1xyXG4gICAgICB2YXIgc3VwcG9zZWRZUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueTtcclxuXHJcbiAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcclxuICAgICAgICBzdXBwb3NlZFhQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBjb21wbGV4Lm91dGVyV2lkdGgoKSAvIDI7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgc3VwcG9zZWRYUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gY29tcGxleC5vdXRlcldpZHRoKCkgLyAyO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgcG9zaXRpb25EaWZmWCA9IHN1cHBvc2VkWFBvc2l0aW9uIC0gY29tcGxleC5wb3NpdGlvbigneCcpO1xyXG4gICAgICB2YXIgcG9zaXRpb25EaWZmWSA9IHN1cHBvc2VkWVBvc2l0aW9uIC0gY29tcGxleC5wb3NpdGlvbigneScpO1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyh7eDogcG9zaXRpb25EaWZmWCwgeTogcG9zaXRpb25EaWZmWX0sIGNvbXBsZXgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvL2ZpbHRlciB0aGUganVzdCBhZGRlZCBlbGVtZW10cyB0byByZXR1cm4gdGhlbSBhbmQgcmVtb3ZlIGp1c3QgYWRkZWQgbWFya1xyXG4gIHZhciBlbGVzID0gY3kuZWxlbWVudHMoJ1tqdXN0QWRkZWRdJyk7XHJcbiAgZWxlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWQnKTtcclxuICBcclxuICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XHJcbiAgZWxlcy5zZWxlY3QoKTtcclxuICBcclxuICByZXR1cm4gZWxlczsgLy8gUmV0dXJuIHRoZSBqdXN0IGFkZGVkIGVsZW1lbnRzXHJcbn07XHJcblxyXG4vKlxyXG4gKiBNb3ZlIHRoZSBub2RlcyB0byBhIG5ldyBwYXJlbnQgYW5kIGNoYW5nZSB0aGVpciBwb3NpdGlvbiBpZiBwb3NzRGlmZiBwYXJhbXMgYXJlIHNldC5cclxuICovXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50ID0gZnVuY3Rpb24obm9kZXMsIG5ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XHJcbiAgdmFyIG5ld1BhcmVudElkID0gbmV3UGFyZW50ID09IHVuZGVmaW5lZCB8fCB0eXBlb2YgbmV3UGFyZW50ID09PSAnc3RyaW5nJyA/IG5ld1BhcmVudCA6IG5ld1BhcmVudC5pZCgpO1xyXG4gIG5vZGVzLm1vdmUoe1wicGFyZW50XCI6IG5ld1BhcmVudElkfSk7XHJcbiAgZWxlbWVudFV0aWxpdGllcy5tb3ZlTm9kZXMoe3g6IHBvc0RpZmZYLCB5OiBwb3NEaWZmWX0sIG5vZGVzKTtcclxufTtcclxuXHJcbi8vIFJlc2l6ZSBnaXZlbiBub2RlcyBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHkgb25lIG9mIHdpZHRoIG9yIGhlaWdodCBzaG91bGQgbm90IGJlIHNldC5cclxuZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uIChub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8pIHtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgdmFyIHJhdGlvID0gdW5kZWZpbmVkO1xyXG4gICAgdmFyIGVsZU11c3RCZVNxdWFyZSA9IGVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlKG5vZGUuZGF0YSgnY2xhc3MnKSk7XHJcblxyXG4gICAgLy8gTm90ZSB0aGF0IGJvdGggd2lkdGggYW5kIGhlaWdodCBzaG91bGQgbm90IGJlIHNldCBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHlcclxuICAgIGlmICh3aWR0aCkge1xyXG4gICAgICBpZiAodXNlQXNwZWN0UmF0aW8gfHwgZWxlTXVzdEJlU3F1YXJlKSB7XHJcbiAgICAgICAgcmF0aW8gPSB3aWR0aCAvIG5vZGUud2lkdGgoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gd2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGhlaWdodCkge1xyXG4gICAgICBpZiAodXNlQXNwZWN0UmF0aW8gfHwgZWxlTXVzdEJlU3F1YXJlKSB7XHJcbiAgICAgICAgcmF0aW8gPSBoZWlnaHQgLyBub2RlLmhlaWdodCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBoZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJhdGlvICYmICFoZWlnaHQpIHtcclxuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gbm9kZS5oZWlnaHQoKSAqIHJhdGlvO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocmF0aW8gJiYgIXdpZHRoKSB7XHJcbiAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IG5vZGUud2lkdGgoKSAqIHJhdGlvO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8vIFNlY3Rpb24gRW5kXHJcbi8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXHJcblxyXG4vLyBTZWN0aW9uIFN0YXJ0XHJcbi8vIENvbW1vbiBlbGVtZW50IHByb3BlcnRpZXNcclxuXHJcbi8vIEdldCBjb21tb24gcHJvcGVydGllcyBvZiBnaXZlbiBlbGVtZW50cy4gUmV0dXJucyBudWxsIGlmIHRoZSBnaXZlbiBlbGVtZW50IGxpc3QgaXMgZW1wdHkgb3IgdGhlXHJcbi8vIHByb3BlcnR5IGlzIG5vdCBjb21tb24gZm9yIGFsbCBlbGVtZW50cy4gZGF0YU9yQ3NzIHBhcmFtZXRlciBzcGVjaWZ5IHdoZXRoZXIgdG8gY2hlY2sgdGhlIHByb3BlcnR5IG9uIGRhdGEgb3IgY3NzLlxyXG4vLyBUaGUgZGVmYXVsdCB2YWx1ZSBmb3IgaXQgaXMgZGF0YS4gSWYgcHJvcGVydHlOYW1lIHBhcmFtZXRlciBpcyBnaXZlbiBhcyBhIGZ1bmN0aW9uIGluc3RlYWQgb2YgYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBcclxuLy8gcHJvcGVydHkgbmFtZSB0aGVuIHVzZSB3aGF0IHRoYXQgZnVuY3Rpb24gcmV0dXJucy5cclxuZWxlbWVudFV0aWxpdGllcy5nZXRDb21tb25Qcm9wZXJ0eSA9IGZ1bmN0aW9uIChlbGVtZW50cywgcHJvcGVydHlOYW1lLCBkYXRhT3JDc3MpIHtcclxuICBpZiAoZWxlbWVudHMubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgdmFyIGlzRnVuY3Rpb247XHJcbiAgLy8gSWYgd2UgYXJlIG5vdCBjb21wYXJpbmcgdGhlIHByb3BlcnRpZXMgZGlyZWN0bHkgdXNlcnMgY2FuIHNwZWNpZnkgYSBmdW5jdGlvbiBhcyB3ZWxsXHJcbiAgaWYgKHR5cGVvZiBwcm9wZXJ0eU5hbWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGlzRnVuY3Rpb24gPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLy8gVXNlIGRhdGEgYXMgZGVmYXVsdFxyXG4gIGlmICghaXNGdW5jdGlvbiAmJiAhZGF0YU9yQ3NzKSB7XHJcbiAgICBkYXRhT3JDc3MgPSAnZGF0YSc7XHJcbiAgfVxyXG5cclxuICB2YXIgdmFsdWUgPSBpc0Z1bmN0aW9uID8gcHJvcGVydHlOYW1lKGVsZW1lbnRzWzBdKSA6IGVsZW1lbnRzWzBdW2RhdGFPckNzc10ocHJvcGVydHlOYW1lKTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKCAoIGlzRnVuY3Rpb24gPyBwcm9wZXJ0eU5hbWUoZWxlbWVudHNbaV0pIDogZWxlbWVudHNbaV1bZGF0YU9yQ3NzXShwcm9wZXJ0eU5hbWUpICkgIT0gdmFsdWUpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdmFsdWU7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIGlmIHRoZSBmdW5jdGlvbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlIGZvciBhbGwgb2YgdGhlIGdpdmVuIGVsZW1lbnRzLlxyXG5lbGVtZW50VXRpbGl0aWVzLnRydWVGb3JBbGxFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVtZW50cywgZmNuKSB7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKCFmY24oZWxlbWVudHNbaV0pKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgY2FuIGhhdmUgc2JnbmNhcmRpbmFsaXR5XHJcbmVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05DYXJkaW5hbGl0eSA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcclxuXHJcbiAgcmV0dXJuIGVsZS5kYXRhKCdjbGFzcycpID09ICdjb25zdW1wdGlvbicgfHwgZWxlLmRhdGEoJ2NsYXNzJykgPT0gJ3Byb2R1Y3Rpb24nO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgY2FuIGhhdmUgc2JnbmxhYmVsXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbCA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcclxuXHJcbiAgcmV0dXJuIHNiZ25jbGFzcyAhPSAnYW5kJyAmJiBzYmduY2xhc3MgIT0gJ29yJyAmJiBzYmduY2xhc3MgIT0gJ25vdCdcclxuICAgICAgICAgICYmIHNiZ25jbGFzcyAhPSAnYXNzb2NpYXRpb24nICYmIHNiZ25jbGFzcyAhPSAnZGlzc29jaWF0aW9uJyAmJiAhc2JnbmNsYXNzLmVuZHNXaXRoKCdwcm9jZXNzJyk7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBoYXZlIHVuaXQgb2YgaW5mb3JtYXRpb25cclxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlVW5pdE9mSW5mb3JtYXRpb24gPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XHJcblxyXG4gIGlmIChzYmduY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCdcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZScgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCcgfHwgc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwgbXVsdGltZXInXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUgbXVsdGltZXInIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUgbXVsdGltZXInXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXggbXVsdGltZXInKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgaGF2ZSBzdGF0ZSB2YXJpYWJsZVxyXG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTdGF0ZVZhcmlhYmxlID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xyXG5cclxuICBpZiAoc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4J1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlIG11bHRpbWVyJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4IG11bHRpbWVyJykge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlIHNob3VsZCBiZSBzcXVhcmUgaW4gc2hhcGVcclxuZWxlbWVudFV0aWxpdGllcy5tdXN0QmVTcXVhcmUgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XHJcblxyXG4gIHJldHVybiAoc2JnbmNsYXNzLmluZGV4T2YoJ3Byb2Nlc3MnKSAhPSAtMSB8fCBzYmduY2xhc3MgPT0gJ3NvdXJjZSBhbmQgc2luaydcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYW5kJyB8fCBzYmduY2xhc3MgPT0gJ29yJyB8fCBzYmduY2xhc3MgPT0gJ25vdCdcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYXNzb2NpYXRpb24nIHx8IHNiZ25jbGFzcyA9PSAnZGlzc29jaWF0aW9uJyk7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgYW55IG9mIHRoZSBnaXZlbiBub2RlcyBtdXN0IG5vdCBiZSBpbiBzcXVhcmUgc2hhcGVcclxuZWxlbWVudFV0aWxpdGllcy5zb21lTXVzdE5vdEJlU3F1YXJlID0gZnVuY3Rpb24gKG5vZGVzKSB7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5tdXN0QmVTcXVhcmUobm9kZS5kYXRhKCdjbGFzcycpKSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZXMgZWxlbWVudCBjYW4gYmUgY2xvbmVkXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2FuQmVDbG9uZWQgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xyXG5cclxuICB2YXIgbGlzdCA9IHtcclxuICAgICd1bnNwZWNpZmllZCBlbnRpdHknOiB0cnVlLFxyXG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxyXG4gICAgJ2NvbXBsZXgnOiB0cnVlLFxyXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcclxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxyXG4gICAgJ3BlcnR1cmJpbmcgYWdlbnQnOiB0cnVlXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGxpc3Rbc2JnbmNsYXNzXSA/IHRydWUgOiBmYWxzZTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZXMgZWxlbWVudCBjYW4gYmUgY2xvbmVkXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2FuQmVNdWx0aW1lciA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XHJcblxyXG4gIHZhciBsaXN0ID0ge1xyXG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxyXG4gICAgJ2NvbXBsZXgnOiB0cnVlLFxyXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcclxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGxpc3Rbc2JnbmNsYXNzXSA/IHRydWUgOiBmYWxzZTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhbiBFUE5cclxuZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcclxuXHJcbiAgcmV0dXJuIChzYmduY2xhc3MgPT0gJ3Vuc3BlY2lmaWVkIGVudGl0eSdcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCcpO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGVtZW50IGlzIGEgUE5cclxuZWxlbWVudFV0aWxpdGllcy5pc1BOQ2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xyXG5cclxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAncHJvY2VzcydcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnb21pdHRlZCBwcm9jZXNzJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICd1bmNlcnRhaW4gcHJvY2VzcydcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYXNzb2NpYXRpb24nXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2Rpc3NvY2lhdGlvbidcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAncGhlbm90eXBlJyk7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBvciBzdHJpbmcgaXMgb2YgdGhlIHNwZWNpYWwgZW1wdHkgc2V0L3NvdXJjZSBhbmQgc2luayBjbGFzc1xyXG5lbGVtZW50VXRpbGl0aWVzLmlzRW1wdHlTZXRDbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XHJcbiAgcmV0dXJuIHNiZ25jbGFzcyA9PSAnc291cmNlIGFuZCBzaW5rJztcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhIGxvZ2ljYWwgb3BlcmF0b3JcclxuZWxlbWVudFV0aWxpdGllcy5pc0xvZ2ljYWxPcGVyYXRvciA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcclxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAnYW5kJyB8fCBzYmduY2xhc3MgPT0gJ29yJyB8fCBzYmduY2xhc3MgPT0gJ25vdCcpO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBjbGFzcyBvZiBnaXZlbiBlbGVtZW50IGlzIGEgZXF1aXZhbGFuY2UgY2xhc3NcclxuZWxlbWVudFV0aWxpdGllcy5jb252ZW5pZW50VG9FcXVpdmFsZW5jZSA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcclxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAndGFnJyB8fCBzYmduY2xhc3MgPT0gJ3Rlcm1pbmFsJyk7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdldGhlciB0aGUgY2xhc3Mgb2YgZ2l2ZW4gZWxlbW50IGlzIGEgbW9kdWxhdGlvbiBhcmMgYXMgZGVmaW5lZCBpbiBQRCBzcGVjc1xyXG5lbGVtZW50VXRpbGl0aWVzLmlzTW9kdWxhdGlvbkFyY0NsYXNzID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xyXG4gIHJldHVybiAoc2JnbmNsYXNzID09ICdtb2R1bGF0aW9uJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdzdGltdWxhdGlvbicgfHwgc2JnbmNsYXNzID09ICdjYXRhbHlzaXMnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2luaGliaXRpb24nIHx8IHNiZ25jbGFzcyA9PSAnbmVjZXNzYXJ5IHN0aW11bGF0aW9uJyk7XHJcbn1cclxuXHJcbi8vIFJlbG9jYXRlcyBzdGF0ZSBhbmQgaW5mbyBib3hlcy4gVGhpcyBmdW5jdGlvbiBpcyBleHBlY3RlZCB0byBiZSBjYWxsZWQgYWZ0ZXIgYWRkL3JlbW92ZSBzdGF0ZSBhbmQgaW5mbyBib3hlc1xyXG5lbGVtZW50VXRpbGl0aWVzLnJlbG9jYXRlU3RhdGVBbmRJbmZvcyA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc3RhdGVBbmRJbmZvcyA9IChlbGUuaXNOb2RlICYmIGVsZS5pc05vZGUoKSkgPyBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKSA6IGVsZTtcclxuICB2YXIgbGVuZ3RoID0gc3RhdGVBbmRJbmZvcy5sZW5ndGg7XHJcbiAgaWYgKGxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGxlbmd0aCA9PSAxKSB7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcclxuICB9XHJcbiAgZWxzZSBpZiAobGVuZ3RoID09IDIpIHtcclxuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gMDtcclxuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xyXG5cclxuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMDtcclxuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC55ID0gNTA7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGxlbmd0aCA9PSAzKSB7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IC0yNTtcclxuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xyXG5cclxuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IC01MDtcclxuXHJcbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IDA7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xyXG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XHJcblxyXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAyNTtcclxuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC55ID0gLTUwO1xyXG5cclxuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gLTI1O1xyXG4gICAgc3RhdGVBbmRJbmZvc1syXS5iYm94LnkgPSA1MDtcclxuXHJcbiAgICBzdGF0ZUFuZEluZm9zWzNdLmJib3gueCA9IDI1O1xyXG4gICAgc3RhdGVBbmRJbmZvc1szXS5iYm94LnkgPSA1MDtcclxuICB9XHJcbn07XHJcblxyXG4vLyBDaGFuZ2Ugc3RhdGUgdmFsdWUgb3IgdW5pdCBvZiBpbmZvcm1hdGlvbiBib3ggb2YgZ2l2ZW4gbm9kZXMgd2l0aCBnaXZlbiBpbmRleC5cclxuLy8gVHlwZSBwYXJhbWV0ZXIgaW5kaWNhdGVzIHdoZXRoZXIgdG8gY2hhbmdlIHZhbHVlIG9yIHZhcmlhYmxlLCBpdCBpcyB2YWxpZCBpZiB0aGUgYm94IGF0IHRoZSBnaXZlbiBpbmRleCBpcyBhIHN0YXRlIHZhcmlhYmxlLlxyXG4vLyBWYWx1ZSBwYXJhbWV0ZXIgaXMgdGhlIG5ldyB2YWx1ZSB0byBzZXQuXHJcbi8vIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIG9sZCB2YWx1ZSBvZiB0aGUgY2hhbmdlZCBkYXRhIChXZSBhc3N1bWUgdGhhdCB0aGUgb2xkIHZhbHVlIG9mIHRoZSBjaGFuZ2VkIGRhdGEgd2FzIHRoZSBzYW1lIGZvciBhbGwgbm9kZXMpLlxyXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpIHtcclxuICB2YXIgcmVzdWx0O1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcclxuICAgIHZhciBib3ggPSBzdGF0ZUFuZEluZm9zW2luZGV4XTtcclxuXHJcbiAgICBpZiAoYm94LmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikge1xyXG4gICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgIHJlc3VsdCA9IGJveC5zdGF0ZVt0eXBlXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgYm94LnN0YXRlW3R5cGVdID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChib3guY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcclxuICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICByZXN1bHQgPSBib3gubGFiZWwudGV4dDtcclxuICAgICAgfVxyXG5cclxuICAgICAgYm94LmxhYmVsLnRleHQgPSB2YWx1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXHJcbi8vIFRoZSBib3ggaXMgcmVwcmVzZW50ZWQgYnkgdGhlIHBhcmFtZXRlciBvYmouXHJcbi8vIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBqdXN0IGFkZGVkIGJveC5cclxuZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2Rlcywgb2JqKSB7XHJcbiAgdmFyIGluZGV4O1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcclxuICAgIFxyXG4gICAgLy8gQ2xvbmUgdGhlIG9iamVjdCB0byBhdm9pZCByZWZlcmVuY2luZyBpc3N1ZXNcclxuICAgIHZhciBjbG9uZSA9IGpRdWVyeS5leHRlbmQodHJ1ZSwge30sIG9iaik7XHJcbiAgICBcclxuICAgIHN0YXRlQW5kSW5mb3MucHVzaChjbG9uZSk7XHJcbiAgICBpbmRleCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoIC0gMTtcclxuICAgIHRoaXMucmVsb2NhdGVTdGF0ZUFuZEluZm9zKHN0YXRlQW5kSW5mb3MpOyAvLyBSZWxvY2F0ZSBzdGF0ZSBhbmQgaW5mb3NcclxuICB9XHJcblxyXG4gIHJldHVybiBpbmRleDtcclxufTtcclxuXHJcbi8vIFJlbW92ZSB0aGUgc3RhdGUgb3IgaW5mbyBib3hlcyBvZiB0aGUgZ2l2ZW4gbm9kZXMgYXQgZ2l2ZW4gaW5kZXguXHJcbi8vIFJldHVybnMgdGhlIHJlbW92ZWQgYm94LlxyXG5lbGVtZW50VXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBpbmRleCkge1xyXG4gIHZhciBvYmo7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xyXG4gICAgaWYgKCFvYmopIHtcclxuICAgICAgb2JqID0gc3RhdGVBbmRJbmZvc1tpbmRleF07XHJcbiAgICB9XHJcbiAgICBzdGF0ZUFuZEluZm9zLnNwbGljZShpbmRleCwgMSk7IC8vIFJlbW92ZSB0aGUgYm94XHJcbiAgICB0aGlzLnJlbG9jYXRlU3RhdGVBbmRJbmZvcyhzdGF0ZUFuZEluZm9zKTsgLy8gUmVsb2NhdGUgc3RhdGUgYW5kIGluZm9zXHJcbiAgfVxyXG5cclxuICByZXR1cm4gb2JqO1xyXG59O1xyXG5cclxuLy8gU2V0IG11bHRpbWVyIHN0YXR1cyBvZiB0aGUgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cclxuZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uIChub2Rlcywgc3RhdHVzKSB7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHZhciBzYmduY2xhc3MgPSBub2RlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgICB2YXIgaXNNdWx0aW1lciA9IG5vZGUuZGF0YSgnY2xhc3MnKS5lbmRzV2l0aCgnIG11bHRpbWVyJyk7XHJcblxyXG4gICAgaWYgKHN0YXR1cykgeyAvLyBNYWtlIG11bHRpbWVyIHN0YXR1cyB0cnVlXHJcbiAgICAgIGlmICghaXNNdWx0aW1lcikge1xyXG4gICAgICAgIG5vZGUuZGF0YSgnY2xhc3MnLCBzYmduY2xhc3MgKyAnIG11bHRpbWVyJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgeyAvLyBNYWtlIG11bHRpbWVyIHN0YXR1cyBmYWxzZVxyXG4gICAgICBpZiAoaXNNdWx0aW1lcikge1xyXG4gICAgICAgIG5vZGUuZGF0YSgnY2xhc3MnLCBzYmduY2xhc3MucmVwbGFjZSgnIG11bHRpbWVyJywgJycpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8vIFNldCBjbG9uZSBtYXJrZXIgc3RhdHVzIG9mIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXHJcbmVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbiAobm9kZXMsIHN0YXR1cykge1xyXG4gIGlmIChzdGF0dXMpIHtcclxuICAgIG5vZGVzLmRhdGEoJ2Nsb25lbWFya2VyJywgdHJ1ZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbm9kZXMucmVtb3ZlRGF0YSgnY2xvbmVtYXJrZXInKTtcclxuICB9XHJcbn07XHJcblxyXG4vL2VsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbigpXHJcblxyXG4vLyBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBlbGVtZW50cyB3aXRoIGdpdmVuIGZvbnQgZGF0YVxyXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKGVsZXMsIGRhdGEpIHtcclxuICBmb3IgKHZhciBwcm9wIGluIGRhdGEpIHtcclxuICAgIGVsZXMuZGF0YShwcm9wLCBkYXRhW3Byb3BdKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIGdldHMgYW4gZWRnZSwgYW5kIGVuZHMgb2YgdGhhdCBlZGdlIChPcHRpb25hbGx5IGl0IG1heSB0YWtlIGp1c3QgdGhlIGNsYXNzZXMgb2YgdGhlc2UgZWxlbWVudHMgYXMgd2VsbCkgYXMgcGFyYW1ldGVycy5cclxuLy8gSXQgbWF5IHJldHVybiAndmFsaWQnICh0aGF0IGVuZHMgaXMgdmFsaWQgZm9yIHRoYXQgZWRnZSksICdyZXZlcnNlJyAodGhhdCBlbmRzIGlzIG5vdCB2YWxpZCBmb3IgdGhhdCBlZGdlIGJ1dCB0aGV5IHdvdWxkIGJlIHZhbGlkIFxyXG4vLyBpZiB5b3UgcmV2ZXJzZSB0aGUgc291cmNlIGFuZCB0YXJnZXQpLCAnaW52YWxpZCcgKHRoYXQgZW5kcyBhcmUgdG90YWxseSBpbnZhbGlkIGZvciB0aGF0IGVkZ2UpLlxyXG5lbGVtZW50VXRpbGl0aWVzLnZhbGlkYXRlQXJyb3dFbmRzID0gZnVuY3Rpb24gKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0KSB7XHJcbiAgdmFyIGVkZ2VjbGFzcyA9IHR5cGVvZiBlZGdlID09PSAnc3RyaW5nJyA/IGVkZ2UgOiBlZGdlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgLy8gVE9ETyBpcyBpdCBuZWNlc3NhcnkgdG8gYWNjZXB0IHN0cmluZ3MgPyBiZXR0ZXIgdG8gYWx3YXlzIGhhdmUgdGhlIGVsZW1lbnRzIGZvciBzb3VyY2UgYW5kIHRhcmdldC5cclxuICAvLyBUaGUgZGF5IHdlIG5lZWQgdG8gY2hlY2sgb3RoZXIgcnVsZXMgd2Ugd2lsbCBuZWVkIHRvIGFjY2VzcyBzb21lIHByb3BlcnRpZXMgb2YgZWFjaCBlbGVtZW50LlxyXG4gIHZhciBzb3VyY2VjbGFzcyA9IHR5cGVvZiBzb3VyY2UgPT09ICdzdHJpbmcnID8gc291cmNlIDogc291cmNlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgdmFyIHRhcmdldGNsYXNzID0gdHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycgPyB0YXJnZXQgOiB0YXJnZXQuZGF0YSgnY2xhc3MnKTtcclxuXHJcbiAgaWYgKHRoaXMuaXNNb2R1bGF0aW9uQXJjQ2xhc3MoZWRnZWNsYXNzKSl7XHJcbiAgICAvKlxyXG4gICAgICogQ2FzZSBvZiB0aGUgb3V0cHV0IGFyYyBvZiBhIGxvZ2ljIG9wZXJhdG9yLCB3aGljaCBjYW4gYmUgYW55IG1vZHVsYXRpb24gYXJjIHR5cGUuXHJcbiAgICAgKiBIYXMgdG8gZ28gZnJvbSBsb2dpYyBvcGVyYXRvciB0byBQTiBjbGFzcy5cclxuICAgICAqIFBEMzcgc2F5cyB0aGVyZSBzaG91bGQgYmUgb25seSAxLCBub3QgZW5mb3JjZWQgZm9yIG5vdywgcnVsZXMgYXJlIGxlZnQgY29tbWVudGVkLlxyXG4gICAgICovXHJcbiAgICB2YWxpZCA9IHRydWU7XHJcbiAgICByZXZlcnNlID0gZmFsc2U7XHJcbiAgICBpZiAodGhpcy5pc0xvZ2ljYWxPcGVyYXRvcihzb3VyY2VjbGFzcykgfHwgdGhpcy5pc0xvZ2ljYWxPcGVyYXRvcih0YXJnZXRjbGFzcykpeyAvLyBhIGxvZ2ljIG9wZXJhdG9yIGlzIGludm9sdmVkXHJcbiAgICAgIGlmICghdGhpcy5pc0xvZ2ljYWxPcGVyYXRvcihzb3VyY2VjbGFzcykgfHwgIXRoaXMuaXNQTkNsYXNzKHRhcmdldGNsYXNzKSl7IC8vIGRpZmZlcmVudCBmcm9tIHRoZSBpZGVhbCBjYXNlIG9mIGxvZ2ljIC0+IHByb2Nlc3NcclxuICAgICAgICBpZiAodGhpcy5pc1BOQ2xhc3Moc291cmNlY2xhc3MpICYmIHRoaXMuaXNMb2dpY2FsT3BlcmF0b3IodGFyZ2V0Y2xhc3MpKXtcclxuICAgICAgICAgIHJldmVyc2UgPSB0cnVlO1xyXG4gICAgICAgICAgLyppZiAodGFyZ2V0Lm91dGdvZXJzKCdlZGdlJykuc2l6ZSgpICE9IDApeyAvLyBvbmx5IDEgb3V0Z29pbmcgZWRnZSBhbGxvd2VkIChQRDM3KVxyXG4gICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgfSovXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgdmFsaWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgLyplbHNlIGlmIChzb3VyY2Uub3V0Z29lcnMoJ2VkZ2UnKS5zaXplKCkgIT0gMCl7IC8vIG9ubHkgMSBvdXRnb2luZyBlZGdlIGFsbG93ZWQgKFBEMzcpXHJcbiAgICAgICAgdmFsaWQgPSBmYWxzZTtcclxuICAgICAgfSovXHJcblxyXG4gICAgICBpZiAodmFsaWQpe1xyXG4gICAgICAgIHJldHVybiByZXZlcnNlID8gJ3JldmVyc2UnIDogJ3ZhbGlkJztcclxuICAgICAgfVxyXG4gICAgICBlbHNle1xyXG4gICAgICAgIHJldHVybiAnaW52YWxpZCc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChlZGdlY2xhc3MgPT0gJ2NvbnN1bXB0aW9uJyB8fCB0aGlzLmlzTW9kdWxhdGlvbkFyY0NsYXNzKGVkZ2VjbGFzcykpIHtcclxuICAgIGlmICh0aGlzLmlzRW1wdHlTZXRDbGFzcyhzb3VyY2VjbGFzcykgfHwgdGhpcy5pc0VtcHR5U2V0Q2xhc3ModGFyZ2V0Y2xhc3MpKXsgLy8gY2FzZSBvZiBFbXB0eVNldCBpbiBvbmUgb2YgdGhlIDJcclxuICAgICAgLy8gZm9sbG93aW5nIGJsb2NrIGlzIHRoZSBzYW1lIGFzIHRoZSAnZWxzZSBpZicgYmVsb3csIHdpdGggaXNFUE5DbGFzcyByZXBsYWNlZCBieSBpc0VtcHR5U2V0Q2xhc3NcclxuICAgICAgaWYgKCF0aGlzLmlzRW1wdHlTZXRDbGFzcyhzb3VyY2VjbGFzcykgfHwgIXRoaXMuaXNQTkNsYXNzKHRhcmdldGNsYXNzKSl7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNQTkNsYXNzKHNvdXJjZWNsYXNzKSAmJiB0aGlzLmlzRW1wdHlTZXRDbGFzcyh0YXJnZXRjbGFzcykpIHtcclxuICAgICAgICAgIC8vSWYganVzdCB0aGUgZGlyZWN0aW9uIGlzIG5vdCB2YWxpZCByZXZlcnNlIHRoZSBkaXJlY3Rpb25cclxuICAgICAgICAgIHJldHVybiAncmV2ZXJzZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuICdpbnZhbGlkJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKCF0aGlzLmlzRVBOQ2xhc3Moc291cmNlY2xhc3MpIHx8ICF0aGlzLmlzUE5DbGFzcyh0YXJnZXRjbGFzcykpIHtcclxuICAgICAgaWYgKHRoaXMuaXNQTkNsYXNzKHNvdXJjZWNsYXNzKSAmJiB0aGlzLmlzRVBOQ2xhc3ModGFyZ2V0Y2xhc3MpKSB7XHJcbiAgICAgICAgLy9JZiBqdXN0IHRoZSBkaXJlY3Rpb24gaXMgbm90IHZhbGlkIHJldmVyc2UgdGhlIGRpcmVjdGlvblxyXG4gICAgICAgIHJldHVybiAncmV2ZXJzZSc7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICdpbnZhbGlkJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIGlmIChlZGdlY2xhc3MgPT0gJ3Byb2R1Y3Rpb24nKSB7XHJcbiAgICBpZiAodGhpcy5pc0VtcHR5U2V0Q2xhc3Moc291cmNlY2xhc3MpIHx8IHRoaXMuaXNFbXB0eVNldENsYXNzKHRhcmdldGNsYXNzKSl7IC8vIGNhc2Ugb2YgRW1wdHlTZXQgaW4gb25lIG9mIHRoZSAyXHJcbiAgICAgIC8vIGZvbGxvd2luZyBibG9jayBpcyB0aGUgc2FtZSBhcyB0aGUgJ2Vsc2UgaWYnIGJlbG93LCB3aXRoIGlzRVBOQ2xhc3MgcmVwbGFjZWQgYnkgaXNFbXB0eVNldENsYXNzXHJcbiAgICAgIGlmICghdGhpcy5pc1BOQ2xhc3Moc291cmNlY2xhc3MpIHx8ICF0aGlzLmlzRW1wdHlTZXRDbGFzcyh0YXJnZXRjbGFzcykpe1xyXG4gICAgICAgIGlmICh0aGlzLmlzRW1wdHlTZXRDbGFzcyhzb3VyY2VjbGFzcykgJiYgdGhpcy5pc1BOQ2xhc3ModGFyZ2V0Y2xhc3MpKSB7XHJcbiAgICAgICAgICAvL0lmIGp1c3QgdGhlIGRpcmVjdGlvbiBpcyBub3QgdmFsaWQgcmV2ZXJzZSB0aGUgZGlyZWN0aW9uXHJcbiAgICAgICAgICByZXR1cm4gJ3JldmVyc2UnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiAnaW52YWxpZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICghdGhpcy5pc1BOQ2xhc3Moc291cmNlY2xhc3MpIHx8ICF0aGlzLmlzRVBOQ2xhc3ModGFyZ2V0Y2xhc3MpKSB7XHJcbiAgICAgIGlmICh0aGlzLmlzRVBOQ2xhc3Moc291cmNlY2xhc3MpICYmIHRoaXMuaXNQTkNsYXNzKHRhcmdldGNsYXNzKSkge1xyXG4gICAgICAgIC8vSWYganVzdCB0aGUgZGlyZWN0aW9uIGlzIG5vdCB2YWxpZCByZXZlcnNlIHRoZSBkaXJlY3Rpb25cclxuICAgICAgICByZXR1cm4gJ3JldmVyc2UnO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAnaW52YWxpZCc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgZWxzZSBpZiAoZWRnZWNsYXNzID09ICdsb2dpYyBhcmMnKSB7XHJcbiAgICB2YXIgaW52YWxpZCA9IGZhbHNlO1xyXG4gICAgaWYgKCF0aGlzLmlzRVBOQ2xhc3Moc291cmNlY2xhc3MpIHx8ICF0aGlzLmlzTG9naWNhbE9wZXJhdG9yKHRhcmdldGNsYXNzKSkge1xyXG4gICAgICBpZiAodGhpcy5pc0xvZ2ljYWxPcGVyYXRvcihzb3VyY2VjbGFzcykgJiYgdGhpcy5pc0VQTkNsYXNzKHRhcmdldGNsYXNzKSkge1xyXG4gICAgICAgIC8vSWYganVzdCB0aGUgZGlyZWN0aW9uIGlzIG5vdCB2YWxpZCByZXZlcnNlIHRoZSBkaXJlY3Rpb25cclxuICAgICAgICByZXR1cm4gJ3JldmVyc2UnO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGludmFsaWQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGhlIGNhc2UgdGhhdCBib3RoIHNpZGVzIGFyZSBsb2dpY2FsIG9wZXJhdG9ycyBhcmUgdmFsaWQgdG9vXHJcbiAgICBpZiAodGhpcy5pc0xvZ2ljYWxPcGVyYXRvcihzb3VyY2VjbGFzcykgJiYgdGhpcy5pc0xvZ2ljYWxPcGVyYXRvcih0YXJnZXRjbGFzcykpIHtcclxuICAgICAgaW52YWxpZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpbnZhbGlkKSB7XHJcbiAgICAgIHJldHVybiAnaW52YWxpZCc7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGVkZ2VjbGFzcyA9PSAnZXF1aXZhbGVuY2UgYXJjJykge1xyXG4gICAgaWYgKCEodGhpcy5pc0VQTkNsYXNzKHNvdXJjZWNsYXNzKSAmJiB0aGlzLmNvbnZlbmllbnRUb0VxdWl2YWxlbmNlKHRhcmdldGNsYXNzKSlcclxuICAgICAgICAgICAgJiYgISh0aGlzLmlzRVBOQ2xhc3ModGFyZ2V0Y2xhc3MpICYmIHRoaXMuY29udmVuaWVudFRvRXF1aXZhbGVuY2Uoc291cmNlY2xhc3MpKSkge1xyXG4gICAgICByZXR1cm4gJ2ludmFsaWQnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuICd2YWxpZCc7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBVbmhpZGUgZ2l2ZW4gZWxlcyBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xyXG4gKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuXHJcbiAqL1xyXG5lbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgZ2l2ZW4gZWxlc1xyXG4gIGlmICh0eXBlb2YgbGF5b3V0cGFyYW0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGxheW91dHBhcmFtKCk7IC8vIElmIGxheW91dHBhcmFtIGlzIGEgZnVuY3Rpb24gZXhlY3V0ZSBpdFxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGN5LmxheW91dChsYXlvdXRwYXJhbSk7IC8vIElmIGxheW91dHBhcmFtIGlzIGxheW91dCBvcHRpb25zIGNhbGwgbGF5b3V0IHdpdGggdGhhdCBvcHRpb25zLlxyXG4gIH1cclxuICBcclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLypcclxuICogQ2hhbmdlIHN0eWxlL2NzcyBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXHJcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLlxyXG4gKi9cclxuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VDc3MgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xyXG4gIGlmICggdHlwZW9mIHZhbHVlTWFwID09PSAnb2JqZWN0JyApIHtcclxuICAgIGN5LnN0YXJ0QmF0Y2goKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZWxlID0gZWxlc1tpXTtcclxuICAgICAgZWxlLmNzcyhuYW1lLCB2YWx1ZU1hcFtlbGUuaWQoKV0pOyAvLyB2YWx1ZU1hcCBpcyBhbiBpZCB0byB2YWx1ZSBtYXAgdXNlIGl0IGluIHRoaXMgd2F5XHJcbiAgICB9XHJcbiAgICBjeS5lbmRCYXRjaCgpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZXMuY3NzKG5hbWUsIHZhbHVlTWFwKTsgLy8gdmFsdWVNYXAgaXMganVzdCBhIHN0cmluZyBzZXQgY3NzKCduYW1lJykgZm9yIGFsbCBlbGVzIHRvIHRoaXMgdmFsdWVcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDaGFuZ2UgZGF0YSBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXHJcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLlxyXG4gKi9cclxuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcclxuICBpZiAoIHR5cGVvZiB2YWx1ZU1hcCA9PT0gJ29iamVjdCcgKSB7XHJcbiAgICBjeS5zdGFydEJhdGNoKCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICAgIGVsZS5kYXRhKG5hbWUsIHZhbHVlTWFwW2VsZS5pZCgpXSk7IC8vIHZhbHVlTWFwIGlzIGFuIGlkIHRvIHZhbHVlIG1hcCB1c2UgaXQgaW4gdGhpcyB3YXlcclxuICAgIH1cclxuICAgIGN5LmVuZEJhdGNoKCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlcy5kYXRhKG5hbWUsIHZhbHVlTWFwKTsgLy8gdmFsdWVNYXAgaXMganVzdCBhIHN0cmluZyBzZXQgY3NzKCduYW1lJykgZm9yIGFsbCBlbGVzIHRvIHRoaXMgdmFsdWVcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdGhlIHNldCBvZiBhbGwgbm9kZXMgcHJlc2VudCB1bmRlciB0aGUgZ2l2ZW4gcG9zaXRpb25cclxuICogcmVuZGVyZWRQb3MgbXVzdCBiZSBhIHBvaW50IGRlZmluZWQgcmVsYXRpdmVseSB0byBjeXRvc2NhcGUgY29udGFpbmVyXHJcbiAqIChsaWtlIHJlbmRlcmVkUG9zaXRpb24gZmllbGQgb2YgYSBub2RlKVxyXG4gKi9cclxuZWxlbWVudFV0aWxpdGllcy5nZXROb2Rlc0F0ID0gZnVuY3Rpb24ocmVuZGVyZWRQb3MpIHtcclxuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xyXG4gIHZhciB4ID0gcmVuZGVyZWRQb3MueDtcclxuICB2YXIgeSA9IHJlbmRlcmVkUG9zLnk7XHJcbiAgdmFyIHJlc3VsdE5vZGVzID0gW107XHJcbiAgZm9yKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgdmFyIHJlbmRlcmVkQmJveCA9IG5vZGUucmVuZGVyZWRCb3VuZGluZ0JveCh7XHJcbiAgICAgIGluY2x1ZGVOb2RlczogdHJ1ZSxcclxuICAgICAgaW5jbHVkZUVkZ2VzOiBmYWxzZSxcclxuICAgICAgaW5jbHVkZUxhYmVsczogZmFsc2UsXHJcbiAgICAgIGluY2x1ZGVTaGFkb3dzOiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgICBpZiAoeCA+PSByZW5kZXJlZEJib3gueDEgJiYgeCA8PSByZW5kZXJlZEJib3gueDIpIHtcclxuICAgICAgaWYgKHkgPj0gcmVuZGVyZWRCYm94LnkxICYmIHkgPD0gcmVuZGVyZWRCYm94LnkyKSB7XHJcbiAgICAgICAgcmVzdWx0Tm9kZXMucHVzaChub2RlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gcmVzdWx0Tm9kZXM7XHJcbn07XHJcblxyXG5lbGVtZW50VXRpbGl0aWVzLmRlbXVsdGltZXJpemVDbGFzcyA9IGZ1bmN0aW9uKHNiZ25jbGFzcykge1xyXG4gIHJldHVybiBzYmduY2xhc3MucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlbGVtZW50VXRpbGl0aWVzO1xyXG4iLCIvKiBcclxuICogVXRpbGl0eSBmaWxlIHRvIGdldCBhbmQgc2V0IHRoZSBsaWJyYXJpZXMgdG8gd2hpY2ggc2JnbnZpeiBpcyBkZXBlbmRlbnQgZnJvbSBhbnkgZmlsZS5cclxuICovXHJcblxyXG52YXIgbGliVXRpbGl0aWVzID0gZnVuY3Rpb24oKXtcclxufTtcclxuXHJcbmxpYlV0aWxpdGllcy5zZXRMaWJzID0gZnVuY3Rpb24obGlicykge1xyXG4gIHRoaXMubGlicyA9IGxpYnM7XHJcbn07XHJcblxyXG5saWJVdGlsaXRpZXMuZ2V0TGlicyA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB0aGlzLmxpYnM7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpYlV0aWxpdGllczsiLCJ2YXIgb3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpLmdldE9wdGlvbnMoKTtcclxudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XHJcblxyXG4vKlxyXG4gKiBUaGUgbWFpbiB1dGlsaXRpZXMgdG8gYmUgZXhwb3NlZCBkaXJlY3RseS5cclxuICovXHJcbmZ1bmN0aW9uIG1haW5VdGlsaXRpZXMoKSB7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBBZGRzIGEgbmV3IG5vZGUgd2l0aCB0aGUgZ2l2ZW4gY2xhc3MgYW5kIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlcy4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuYWRkTm9kZSA9IGZ1bmN0aW9uKHgsIHkgLCBub2RlY2xhc3MsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeCwgeSwgbm9kZWNsYXNzLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIG5ld05vZGUgOiB7XHJcbiAgICAgICAgeDogeCxcclxuICAgICAgICB5OiB5LFxyXG4gICAgICAgIGNsYXNzOiBub2RlY2xhc3MsXHJcbiAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgIHBhcmVudDogcGFyZW50LFxyXG4gICAgICAgIHZpc2liaWxpdHk6IHZpc2liaWxpdHlcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZE5vZGVcIiwgcGFyYW0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIEFkZHMgYSBuZXcgZWRnZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgaGF2aW5nIHRoZSBnaXZlbiBzb3VyY2UgYW5kIHRhcmdldCBpZHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmFkZEVkZ2UgPSBmdW5jdGlvbihzb3VyY2UsIHRhcmdldCAsIGVkZ2VjbGFzcywgaWQsIHZpc2liaWxpdHkpIHtcclxuICAvLyBHZXQgdGhlIHZhbGlkYXRpb24gcmVzdWx0XHJcbiAgdmFyIHZhbGlkYXRpb24gPSBlbGVtZW50VXRpbGl0aWVzLnZhbGlkYXRlQXJyb3dFbmRzKGVkZ2VjbGFzcywgY3kuZ2V0RWxlbWVudEJ5SWQoc291cmNlKSwgY3kuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0KSk7XHJcblxyXG4gIC8vIElmIHZhbGlkYXRpb24gcmVzdWx0IGlzICdpbnZhbGlkJyBjYW5jZWwgdGhlIG9wZXJhdGlvblxyXG4gIGlmICh2YWxpZGF0aW9uID09PSAnaW52YWxpZCcpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgLy8gSWYgdmFsaWRhdGlvbiByZXN1bHQgaXMgJ3JldmVyc2UnIHJldmVyc2UgdGhlIHNvdXJjZS10YXJnZXQgcGFpciBiZWZvcmUgY3JlYXRpbmcgdGhlIGVkZ2VcclxuICBpZiAodmFsaWRhdGlvbiA9PT0gJ3JldmVyc2UnKSB7XHJcbiAgICB2YXIgdGVtcCA9IHNvdXJjZTtcclxuICAgIHNvdXJjZSA9IHRhcmdldDtcclxuICAgIHRhcmdldCA9IHRlbXA7XHJcbiAgfVxyXG4gICAgICBcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2Uoc291cmNlLCB0YXJnZXQsIGVkZ2VjbGFzcywgaWQsIHZpc2liaWxpdHkpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgbmV3RWRnZSA6IHtcclxuICAgICAgICBzb3VyY2U6IHNvdXJjZSxcclxuICAgICAgICB0YXJnZXQ6IHRhcmdldCxcclxuICAgICAgICBjbGFzczogZWRnZWNsYXNzLFxyXG4gICAgICAgIGlkOiBpZCxcclxuICAgICAgICB2aXNpYmlsaXR5OiB2aXNpYmlsaXR5XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRFZGdlXCIsIHBhcmFtKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBBZGRzIGEgcHJvY2VzcyB3aXRoIGNvbnZlbmllbnQgZWRnZXMuIEZvciBtb3JlIGluZm9ybWF0aW9uIHBsZWFzZSBzZWUgJ2h0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvbmV3dC9pc3N1ZXMvOScuXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24oX3NvdXJjZSwgX3RhcmdldCwgcHJvY2Vzc1R5cGUpIHtcclxuICAvLyBJZiBzb3VyY2UgYW5kIHRhcmdldCBJRHMgYXJlIGdpdmVuIGdldCB0aGUgZWxlbWVudHMgYnkgSURzXHJcbiAgdmFyIHNvdXJjZSA9IHR5cGVvZiBfc291cmNlID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9zb3VyY2UpIDogX3NvdXJjZTtcclxuICB2YXIgdGFyZ2V0ID0gdHlwZW9mIF90YXJnZXQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3RhcmdldCkgOiBfdGFyZ2V0O1xyXG4gIFxyXG4gIC8vIElmIHNvdXJjZSBvciB0YXJnZXQgZG9lcyBub3QgaGF2ZSBhbiBFUE4gY2xhc3MgdGhlIG9wZXJhdGlvbiBpcyBub3QgdmFsaWRcclxuICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyhzb3VyY2UpIHx8ICFlbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3ModGFyZ2V0KSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzKF9zb3VyY2UsIF90YXJnZXQsIHByb2Nlc3NUeXBlKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIHNvdXJjZTogX3NvdXJjZSxcclxuICAgICAgdGFyZ2V0OiBfdGFyZ2V0LFxyXG4gICAgICBwcm9jZXNzVHlwZTogcHJvY2Vzc1R5cGVcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlc1wiLCBwYXJhbSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogQ2xvbmUgZ2l2ZW4gZWxlbWVudHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jbG9uZUVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZXMpIHtcclxuICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgdmFyIGNiID0gY3kuY2xpcGJvYXJkKCk7XHJcbiAgdmFyIF9pZCA9IGNiLmNvcHkoZWxlcywgXCJjbG9uZU9wZXJhdGlvblwiKTtcclxuXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJwYXN0ZVwiLCB7aWQ6IF9pZH0pO1xyXG4gIH0gXHJcbiAgZWxzZSB7XHJcbiAgICBjYi5wYXN0ZShfaWQpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIENvcHkgZ2l2ZW4gZWxlbWVudHMgdG8gY2xpcGJvYXJkLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuY29weUVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZXMpIHtcclxuICBjeS5jbGlwYm9hcmQoKS5jb3B5KGVsZXMpO1xyXG59O1xyXG5cclxuLypcclxuICogUGFzdCB0aGUgZWxlbWVudHMgY29waWVkIHRvIGNsaXBib2FyZC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLnBhc3RlRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInBhc3RlXCIpO1xyXG4gIH0gXHJcbiAgZWxzZSB7XHJcbiAgICBjeS5jbGlwYm9hcmQoKS5wYXN0ZSgpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIEFsaWducyBnaXZlbiBub2RlcyBpbiBnaXZlbiBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBvcmRlci4gXHJcbiAqIEhvcml6b250YWwgYW5kIHZlcnRpY2FsIHBhcmFtZXRlcnMgbWF5IGJlICdub25lJyBvciB1bmRlZmluZWQuXHJcbiAqIGFsaWduVG8gcGFyYW1ldGVyIGluZGljYXRlcyB0aGUgbGVhZGluZyBub2RlLlxyXG4gKiBSZXF1cmlyZXMgY3l0b3NjYXBlLWdyaWQtZ3VpZGUgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5hbGlnbiA9IGZ1bmN0aW9uIChub2RlcywgaG9yaXpvbnRhbCwgdmVydGljYWwsIGFsaWduVG8pIHtcclxuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWxpZ25cIiwge1xyXG4gICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgIGhvcml6b250YWw6IGhvcml6b250YWwsXHJcbiAgICAgIHZlcnRpY2FsOiB2ZXJ0aWNhbCxcclxuICAgICAgYWxpZ25UbzogYWxpZ25Ub1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIG5vZGVzLmFsaWduKGhvcml6b250YWwsIHZlcnRpY2FsLCBhbGlnblRvKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDcmVhdGUgY29tcG91bmQgZm9yIGdpdmVuIG5vZGVzLiBjb21wb3VuZFR5cGUgbWF5IGJlICdjb21wbGV4JyBvciAnY29tcGFydG1lbnQnLlxyXG4gKiBUaGlzIG1ldGhvZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgPSBmdW5jdGlvbiAoX25vZGVzLCBjb21wb3VuZFR5cGUpIHtcclxuICB2YXIgbm9kZXMgPSBfbm9kZXM7XHJcbiAgLypcclxuICAgKiBFbGVtaW5hdGUgdGhlIG5vZGVzIHdoaWNoIGNhbm5vdCBoYXZlIGEgcGFyZW50IHdpdGggZ2l2ZW4gY29tcG91bmQgdHlwZVxyXG4gICAqL1xyXG4gIG5vZGVzID0gX25vZGVzLmZpbHRlcihmdW5jdGlvbiAoaSwgZWxlbWVudCkge1xyXG4gICAgdmFyIHNiZ25jbGFzcyA9IGVsZW1lbnQuZGF0YShcImNsYXNzXCIpO1xyXG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNWYWxpZFBhcmVudChzYmduY2xhc3MsIGNvbXBvdW5kVHlwZSk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgbm9kZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldFRvcE1vc3ROb2Rlcyhub2Rlcyk7XHJcblxyXG4gIC8vIEFsbCBlbGVtZW50cyBzaG91bGQgaGF2ZSB0aGUgc2FtZSBwYXJlbnQgYW5kIHRoZSBjb21tb24gcGFyZW50IHNob3VsZCBub3QgYmUgYSAnY29tcGxleCcgXHJcbiAgLy8gaWYgY29tcG91bmRUeXBlIGlzICdjb21wYXJ0ZW50J1xyXG4gIC8vIGJlY2F1c2UgdGhlIG9sZCBjb21tb24gcGFyZW50IHdpbGwgYmUgdGhlIHBhcmVudCBvZiB0aGUgbmV3IGNvbXBhcnRtZW50IGFmdGVyIHRoaXMgb3BlcmF0aW9uIGFuZFxyXG4gIC8vICdjb21wbGV4ZXMnIGNhbm5vdCBpbmNsdWRlICdjb21wYXJ0bWVudHMnXHJcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwIHx8ICFlbGVtZW50VXRpbGl0aWVzLmFsbEhhdmVUaGVTYW1lUGFyZW50KG5vZGVzKVxyXG4gICAgICAgICAgfHwgKCBjb21wb3VuZFR5cGUgPT09ICdjb21wYXJ0bWVudCcgJiYgbm9kZXMucGFyZW50KCkuZGF0YSgnY2xhc3MnKSA9PT0gJ2NvbXBsZXgnICkgKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChjeS51bmRvUmVkbygpKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIGNvbXBvdW5kVHlwZTogY29tcG91bmRUeXBlLFxyXG4gICAgICBub2Rlc1RvTWFrZUNvbXBvdW5kOiBub2Rlc1xyXG4gICAgfTtcclxuXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyhub2RlcywgY29tcG91bmRUeXBlKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBNb3ZlIHRoZSBub2RlcyB0byBhIG5ldyBwYXJlbnQgYW5kIGNoYW5nZSB0aGVpciBwb3NpdGlvbiBpZiBwb3NzRGlmZiBwYXJhbXMgYXJlIHNldC5cclxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbiBhbmQgY2hlY2tzIGlmIHRoZSBvcGVyYXRpb24gaXMgdmFsaWQuXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNoYW5nZVBhcmVudCA9IGZ1bmN0aW9uKG5vZGVzLCBfbmV3UGFyZW50LCBwb3NEaWZmWCwgcG9zRGlmZlkpIHtcclxuICB2YXIgbmV3UGFyZW50ID0gdHlwZW9mIF9uZXdQYXJlbnQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX25ld1BhcmVudCkgOiBfbmV3UGFyZW50O1xyXG4gIC8vIE5ldyBwYXJlbnQgaXMgc3VwcG9zZWQgdG8gYmUgb25lIG9mIHRoZSByb290LCBhIGNvbXBsZXggb3IgYSBjb21wYXJ0bWVudFxyXG4gIGlmIChuZXdQYXJlbnQgJiYgbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKSAhPSBcImNvbXBsZXhcIiAmJiBuZXdQYXJlbnQuZGF0YShcImNsYXNzXCIpICE9IFwiY29tcGFydG1lbnRcIikge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICAvKlxyXG4gICAqIEVsZW1pbmF0ZSB0aGUgbm9kZXMgd2hpY2ggY2Fubm90IGhhdmUgdGhlIG5ld1BhcmVudCBhcyB0aGVpciBwYXJlbnRcclxuICAgKi9cclxuICBub2RlcyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoaSwgZWxlbWVudCkge1xyXG4gICAgdmFyIHNiZ25jbGFzcyA9IGVsZW1lbnQuZGF0YShcImNsYXNzXCIpO1xyXG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNWYWxpZFBhcmVudChzYmduY2xhc3MsIG5ld1BhcmVudCk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgLy8gRGlzY2FyZCB0aGUgbm9kZXMgd2hvc2UgcGFyZW50IGlzIGFscmVhZHkgbmV3UGFyZW50XHJcbiAgbm9kZXMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGksIGVsZSkge1xyXG4gICAgaWYgKCFuZXdQYXJlbnQpIHtcclxuICAgICAgcmV0dXJuIGVsZS5kYXRhKCdwYXJlbnQnKSAhPSBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVsZS5kYXRhKCdwYXJlbnQnKSAhPT0gbmV3UGFyZW50LmlkKCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIElmIHNvbWUgbm9kZXMgYXJlIGFuY2VzdG9yIG9mIG5ldyBwYXJlbnQgZWxlbWluYXRlIHRoZW1cclxuICBpZiAobmV3UGFyZW50KSB7XHJcbiAgICBub2RlcyA9IG5vZGVzLmRpZmZlcmVuY2UobmV3UGFyZW50LmFuY2VzdG9ycygpKTtcclxuICB9XHJcblxyXG4gIC8vIElmIGFsbCBub2RlcyBhcmUgZWxlbWluYXRlZCByZXR1cm4gZGlyZWN0bHlcclxuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBKdXN0IG1vdmUgdGhlIHRvcCBtb3N0IG5vZGVzXHJcbiAgbm9kZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldFRvcE1vc3ROb2Rlcyhub2Rlcyk7XHJcbiAgXHJcbiAgdmFyIHBhcmVudElkID0gbmV3UGFyZW50ID8gbmV3UGFyZW50LmlkKCkgOiBudWxsO1xyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIGZpcnN0VGltZTogdHJ1ZSxcclxuICAgICAgcGFyZW50RGF0YTogcGFyZW50SWQsIC8vIEl0IGtlZXBzIHRoZSBuZXdQYXJlbnRJZCAoSnVzdCBhbiBpZCBmb3IgZWFjaCBub2RlcyBmb3IgdGhlIGZpcnN0IHRpbWUpXHJcbiAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgcG9zRGlmZlg6IHBvc0RpZmZYLFxyXG4gICAgICBwb3NEaWZmWTogcG9zRGlmZllcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZVBhcmVudFwiLCBwYXJhbSk7IC8vIFRoaXMgYWN0aW9uIGlzIHJlZ2lzdGVyZWQgYnkgdW5kb1JlZG8gZXh0ZW5zaW9uXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQobm9kZXMsIHBhcmVudElkLCBwb3NEaWZmWCwgcG9zRGlmZlkpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxyXG4gKiBpbiB0aGUgY29tcGxleC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIHRoZSBzYW1lIGZ1bmN0aW9uIGluIGVsZW1lbnRVdGlsaXRpZXNcclxuICovXHJcbm1haW5VdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKSB7XHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24odGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICB0ZW1wbGF0ZVR5cGU6IHRlbXBsYXRlVHlwZSxcclxuICAgICAgbWFjcm9tb2xlY3VsZUxpc3Q6IG1hY3JvbW9sZWN1bGVMaXN0LFxyXG4gICAgICBjb21wbGV4TmFtZTogY29tcGxleE5hbWUsXHJcbiAgICAgIHByb2Nlc3NQb3NpdGlvbjogcHJvY2Vzc1Bvc2l0aW9uLFxyXG4gICAgICB0aWxpbmdQYWRkaW5nVmVydGljYWw6IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCxcclxuICAgICAgdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLFxyXG4gICAgICBlZGdlTGVuZ3RoOiBlZGdlTGVuZ3RoXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlVGVtcGxhdGVSZWFjdGlvblwiLCBwYXJhbSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogUmVzaXplIGdpdmVuIG5vZGVzIGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeSBvbmUgb2Ygd2lkdGggb3IgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0LiBcclxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMucmVzaXplTm9kZXMgPSBmdW5jdGlvbihub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8pIHtcclxuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgd2lkdGg6IHdpZHRoLFxyXG4gICAgICBoZWlnaHQ6IGhlaWdodCxcclxuICAgICAgdXNlQXNwZWN0UmF0aW86IHVzZUFzcGVjdFJhdGlvLFxyXG4gICAgICBwZXJmb3JtT3BlcmF0aW9uOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwicmVzaXplTm9kZXNcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMobm9kZXMsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIENoYW5nZXMgdGhlIGxhYmVsIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gbGFiZWwuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uKG5vZGVzLCBsYWJlbCkge1xyXG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBub2Rlcy5kYXRhKCdsYWJlbCcsIGxhYmVsKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgbGFiZWw6IGxhYmVsLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VOb2RlTGFiZWxcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuLypcclxuICogQ2hhbmdlIGZvbnQgcHJvcGVydGllcyBmb3IgZ2l2ZW4gbm9kZXMgdXNlIHRoZSBnaXZlbiBmb250IGRhdGEuXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24oZWxlcywgZGF0YSkge1xyXG4gIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBlbGVzOiBlbGVzLFxyXG4gICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUZvbnRQcm9wZXJ0aWVzXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZXMsIGRhdGEpO1xyXG4gIH1cclxuICBcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuLypcclxuICogQ2hhbmdlIHN0YXRlIHZhbHVlIG9yIHVuaXQgb2YgaW5mb3JtYXRpb24gYm94IG9mIGdpdmVuIG5vZGVzIHdpdGggZ2l2ZW4gaW5kZXguXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBwYXJhbWV0ZXJzIHNlZSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94XHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24obm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSkge1xyXG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgaW5kZXg6IGluZGV4LFxyXG4gICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZVN0YXRlT3JJbmZvQm94XCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbi8vIEFkZCBhIG5ldyBzdGF0ZSBvciBpbmZvIGJveCB0byBnaXZlbiBub2Rlcy5cclxuLy8gVGhlIGJveCBpcyByZXByZXNlbnRlZCBieSB0aGUgcGFyYW1ldGVyIG9iai5cclxuLy8gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uKG5vZGVzLCBvYmopIHtcclxuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChub2Rlcywgb2JqKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIG9iajogb2JqLFxyXG4gICAgICBub2Rlczogbm9kZXNcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxyXG4vLyBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24obm9kZXMsIGluZGV4KSB7XHJcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3gobm9kZXMsIGluZGV4KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIGluZGV4OiBpbmRleCxcclxuICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICB9O1xyXG5cclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZW1vdmVTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBTZXQgbXVsdGltZXIgc3RhdHVzIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxyXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uKG5vZGVzLCBzdGF0dXMpIHtcclxuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIHN0YXR1czogc3RhdHVzLFxyXG4gICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwic2V0TXVsdGltZXJTdGF0dXNcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMobm9kZXMsIHN0YXR1cyk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBTZXQgY2xvbmUgbWFya2VyIHN0YXR1cyBvZiBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxyXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi8gXHJcbm1haW5VdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbihub2Rlcywgc3RhdHVzKSB7XHJcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBzdGF0dXM6IHN0YXR1cyxcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNldENsb25lTWFya2VyU3RhdHVzXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xyXG4gIH1cclxuICBcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuLypcclxuICogQ2hhbmdlIHN0eWxlL2NzcyBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXHJcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jaGFuZ2VDc3MgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xyXG4gIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzKGVsZXMsIG5hbWUsIHZhbHVlTWFwKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIGVsZXM6IGVsZXMsXHJcbiAgICAgIHZhbHVlTWFwOiB2YWx1ZU1hcCxcclxuICAgICAgbmFtZTogbmFtZVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUNzc1wiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDaGFuZ2UgZGF0YSBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXHJcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcclxuICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEoZWxlcywgbmFtZSwgdmFsdWVNYXApO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgZWxlczogZWxlcyxcclxuICAgICAgdmFsdWVNYXA6IHZhbHVlTWFwLFxyXG4gICAgICBuYW1lOiBuYW1lXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlRGF0YVwiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBVbmhpZGUgZ2l2ZW4gZWxlcyAodGhlIG9uZXMgd2hpY2ggYXJlIGhpZGRlbiBpZiBhbnkpIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXHJcbiAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcclxuICB2YXIgaGlkZGVuRWxlcyA9IGVsZXMuZmlsdGVyKCc6aGlkZGVuJyk7XHJcbiAgaWYgKGhpZGRlbkVsZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dChoaWRkZW5FbGVzLCBsYXlvdXRwYXJhbSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBlbGVzOiBoaWRkZW5FbGVzLFxyXG4gICAgICBsYXlvdXRwYXJhbTogbGF5b3V0cGFyYW0sXHJcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNob3dBbmRQZXJmb3JtTGF5b3V0XCIsIHBhcmFtKTtcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1haW5VdGlsaXRpZXM7IiwiLypcclxuICogIEV4dGVuZCBkZWZhdWx0IG9wdGlvbnMgYW5kIGdldCBjdXJyZW50IG9wdGlvbnMgYnkgdXNpbmcgdGhpcyBmaWxlIFxyXG4gKi9cclxuXHJcbi8vIGRlZmF1bHQgb3B0aW9uc1xyXG52YXIgZGVmYXVsdHMgPSB7XHJcbiAgLy8gVGhlIHBhdGggb2YgY29yZSBsaWJyYXJ5IGltYWdlcyB3aGVuIHNiZ252aXogaXMgcmVxdWlyZWQgZnJvbSBucG0gYW5kIHRoZSBpbmRleCBodG1sIFxyXG4gIC8vIGZpbGUgYW5kIG5vZGVfbW9kdWxlcyBhcmUgdW5kZXIgdGhlIHNhbWUgZm9sZGVyIHRoZW4gdXNpbmcgdGhlIGRlZmF1bHQgdmFsdWUgaXMgZmluZVxyXG4gIGltZ1BhdGg6ICdub2RlX21vZHVsZXMvc2JnbnZpei9zcmMvaW1nJyxcclxuICAvLyBXaGV0aGVyIHRvIGZpdCBsYWJlbHMgdG8gbm9kZXNcclxuICBmaXRMYWJlbHNUb05vZGVzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSxcclxuICAvLyBkeW5hbWljIGxhYmVsIHNpemUgaXQgbWF5IGJlICdzbWFsbCcsICdyZWd1bGFyJywgJ2xhcmdlJ1xyXG4gIGR5bmFtaWNMYWJlbFNpemU6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAncmVndWxhcic7XHJcbiAgfSxcclxuICAvLyBwZXJjZW50YWdlIHVzZWQgdG8gY2FsY3VsYXRlIGNvbXBvdW5kIHBhZGRpbmdzXHJcbiAgY29tcG91bmRQYWRkaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gMTA7XHJcbiAgfSxcclxuICAvLyBXaGV0aGVyIHRvIGFkanVzdCBub2RlIGxhYmVsIGZvbnQgc2l6ZSBhdXRvbWF0aWNhbGx5LlxyXG4gIC8vIElmIHRoaXMgb3B0aW9uIHJldHVybiBmYWxzZSBkbyBub3QgYWRqdXN0IGxhYmVsIHNpemVzIGFjY29yZGluZyB0byBub2RlIGhlaWdodCB1c2VzIG5vZGUuZGF0YSgnZm9udC1zaXplJylcclxuICAvLyBpbnN0ZWFkIG9mIGRvaW5nIGl0LlxyXG4gIGFkanVzdE5vZGVMYWJlbEZvbnRTaXplQXV0b21hdGljYWxseTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9LFxyXG4gIC8vIFRoZSBzZWxlY3RvciBvZiB0aGUgY29tcG9uZW50IGNvbnRhaW5pbmcgdGhlIHNiZ24gbmV0d29ya1xyXG4gIG5ldHdvcmtDb250YWluZXJTZWxlY3RvcjogJyNzYmduLW5ldHdvcmstY29udGFpbmVyJyxcclxuICAvLyBXaGV0aGVyIHRoZSBhY3Rpb25zIGFyZSB1bmRvYWJsZSwgcmVxdWlyZXMgY3l0b3NjYXBlLXVuZG8tcmVkbyBleHRlbnNpb25cclxuICB1bmRvYWJsZTogdHJ1ZSxcclxuICAvLyBXaGV0aGVyIHRvIGhhdmUgdW5kb2FibGUgZHJhZyBmZWF0dXJlIGluIHVuZG8vcmVkbyBleHRlbnNpb24uIFRoaXMgb3B0aW9ucyB3aWxsIGJlIHBhc3NlZCB0byB1bmRvL3JlZG8gZXh0ZW5zaW9uXHJcbiAgdW5kb2FibGVEcmFnOiB0cnVlXHJcbn07XHJcblxyXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gZnVuY3Rpb24gKCkge1xyXG59O1xyXG5cclxuLy8gRXh0ZW5kIHRoZSBkZWZhdWx0cyBvcHRpb25zIHdpdGggdGhlIHVzZXIgb3B0aW9uc1xyXG5vcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgdmFyIHJlc3VsdCA9IHt9O1xyXG5cclxuICBmb3IgKHZhciBwcm9wIGluIGRlZmF1bHRzKSB7XHJcbiAgICByZXN1bHRbcHJvcF0gPSBkZWZhdWx0c1twcm9wXTtcclxuICB9XHJcbiAgXHJcbiAgZm9yICh2YXIgcHJvcCBpbiBvcHRpb25zKSB7XHJcbiAgICByZXN1bHRbcHJvcF0gPSBvcHRpb25zW3Byb3BdO1xyXG4gIH1cclxuXHJcbiAgb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnMgPSByZXN1bHQ7XHJcblxyXG4gIHJldHVybiBvcHRpb25zO1xyXG59O1xyXG5cclxub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIG9wdGlvblV0aWxpdGllcy5vcHRpb25zO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBvcHRpb25VdGlsaXRpZXM7IiwidmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gcmVxdWlyZSgnLi91bmRvLXJlZG8tYWN0aW9uLWZ1bmN0aW9ucycpO1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIG9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKS5nZXRPcHRpb25zKCk7XHJcbnZhciAkID0gbGlicy5qUXVlcnk7XHJcblxyXG52YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSBmdW5jdGlvbiAodW5kb2FibGVEcmFnKSB7XHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIC8vIGNyZWF0ZSB1bmRvLXJlZG8gaW5zdGFuY2VcclxuICB2YXIgdXIgPSBjeS51bmRvUmVkbyh7XHJcbiAgICB1bmRvYWJsZURyYWc6IHVuZG9hYmxlRHJhZ1xyXG4gIH0pO1xyXG5cclxuICAvLyByZWdpc3RlciBhZGQgcmVtb3ZlIGFjdGlvbnNcclxuICB1ci5hY3Rpb24oXCJhZGROb2RlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZE5vZGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xyXG4gIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTaW1wbGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xyXG4gIHVyLmFjdGlvbihcImFkZEVkZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XHJcbiAgdXIuYWN0aW9uKFwiYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xyXG4gIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTbWFydFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU21hcnQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcclxuICB1ci5hY3Rpb24oXCJjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMpO1xyXG5cclxuICAvLyByZWdpc3RlciBnZW5lcmFsIGFjdGlvbnNcclxuICB1ci5hY3Rpb24oXCJyZXNpemVOb2Rlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMpO1xyXG4gIHVyLmFjdGlvbihcImNoYW5nZU5vZGVMYWJlbFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCk7XHJcbiAgdXIuYWN0aW9uKFwiY2hhbmdlRGF0YVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhKTtcclxuICB1ci5hY3Rpb24oXCJjaGFuZ2VDc3NcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MpO1xyXG4gIHVyLmFjdGlvbihcImNoYW5nZUJlbmRQb2ludHNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmVuZFBvaW50cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmVuZFBvaW50cyk7XHJcbiAgdXIuYWN0aW9uKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKTtcclxuICB1ci5hY3Rpb24oXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUxheW91dCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtTGF5b3V0KTtcclxuXHJcbiAgLy8gcmVnaXN0ZXIgU0JHTiBhY3Rpb25zXHJcbiAgdXIuYWN0aW9uKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94KTtcclxuICB1ci5hY3Rpb24oXCJjaGFuZ2VTdGF0ZU9ySW5mb0JveFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3gpO1xyXG4gIHVyLmFjdGlvbihcInNldE11bHRpbWVyU3RhdHVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cyk7XHJcbiAgdXIuYWN0aW9uKFwic2V0Q2xvbmVNYXJrZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzKTtcclxuICB1ci5hY3Rpb24oXCJyZW1vdmVTdGF0ZU9ySW5mb0JveFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3gpO1xyXG4gIFxyXG4gIC8vIHJlZ2lzdGVyIGVhc3kgY3JlYXRpb24gYWN0aW9uc1xyXG4gIHVyLmFjdGlvbihcImNyZWF0ZVRlbXBsYXRlUmVhY3Rpb25cIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XHJcblxyXG4gIHVyLmFjdGlvbihcInNldERlZmF1bHRQcm9wZXJ0eVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXREZWZhdWx0UHJvcGVydHksIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldERlZmF1bHRQcm9wZXJ0eSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVuZG9hYmxlRHJhZykge1xyXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnModW5kb2FibGVEcmFnKTtcclxuICB9KTtcclxufTsiLCIvLyBFeHRlbmRzIHNiZ252aXoudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnNcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBzYmdudml6ID0gbGlicy5zYmdudml6O1xyXG52YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSBzYmdudml6LnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xyXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcclxuXHJcbi8vIFNlY3Rpb24gU3RhcnRcclxuLy8gYWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGROb2RlID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdDtcclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICB2YXIgbmV3Tm9kZSA9IHBhcmFtLm5ld05vZGU7XHJcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUobmV3Tm9kZS54LCBuZXdOb2RlLnksIG5ld05vZGUuY2xhc3MsIG5ld05vZGUuaWQsIG5ld05vZGUucGFyZW50LCBuZXdOb2RlLnZpc2liaWxpdHkpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGVsZXM6IHJlc3VsdFxyXG4gIH07XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRFZGdlID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdDtcclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICB2YXIgbmV3RWRnZSA9IHBhcmFtLm5ld0VkZ2U7XHJcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3RWRnZS5zb3VyY2UsIG5ld0VkZ2UudGFyZ2V0LCBuZXdFZGdlLmNsYXNzLCBuZXdFZGdlLmlkLCBuZXdFZGdlLnZpc2liaWxpdHkpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGVsZXM6IHJlc3VsdFxyXG4gIH07XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyA9IGZ1bmN0aW9uKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdDtcclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzKHBhcmFtLnNvdXJjZSwgcGFyYW0udGFyZ2V0LCBwYXJhbS5wcm9jZXNzVHlwZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZWxlczogcmVzdWx0XHJcbiAgfTtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQgPSB7fTtcclxuXHJcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgLy8gTm9kZXMgdG8gbWFrZSBjb21wb3VuZCBhbmQgZWRnZXMgY29ubmVjdGVkIHRvIHRoZW0gd2lsbCBiZSByZW1vdmVkIGR1cmluZyBjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgb3BlcmF0aW9uXHJcbiAgICAvLyAoaW50ZXJuYWxseSBieSBlbGVzLm1vdmUoKSBvcGVyYXRpb24pLCBzbyBtYXJrIHRoZW0gYXMgcmVtb3ZlZCBlbGVzIGZvciB1bmRvIG9wZXJhdGlvbi5cclxuICAgIHZhciBub2Rlc1RvTWFrZUNvbXBvdW5kID0gcGFyYW0ubm9kZXNUb01ha2VDb21wb3VuZDtcclxuICAgIHJlc3VsdC5yZW1vdmVkRWxlcyA9IG5vZGVzVG9NYWtlQ29tcG91bmQudW5pb24obm9kZXNUb01ha2VDb21wb3VuZC5jb25uZWN0ZWRFZGdlcygpKTtcclxuICAgIC8vIEFzc3VtZSB0aGF0IGFsbCBub2RlcyB0byBtYWtlIGNvbXBvdW5kIGhhdmUgdGhlIHNhbWUgcGFyZW50XHJcbiAgICB2YXIgb2xkUGFyZW50SWQgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJwYXJlbnRcIik7XHJcbiAgICAvLyBUaGUgcGFyZW50IG9mIG5ldyBjb21wb3VuZCB3aWxsIGJlIHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kXHJcbiAgICAvLyBOZXcgZWxlcyBpbmNsdWRlcyBuZXcgY29tcG91bmQgYW5kIHRoZSBtb3ZlZCBlbGVzIGFuZCB3aWxsIGJlIHVzZWQgaW4gdW5kbyBvcGVyYXRpb24uXHJcbiAgICByZXN1bHQubmV3RWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKG5vZGVzVG9NYWtlQ29tcG91bmQsIHBhcmFtLmNvbXBvdW5kVHlwZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmVzdWx0LnJlbW92ZWRFbGVzID0gcGFyYW0ubmV3RWxlcy5yZW1vdmUoKTtcclxuICAgIHJlc3VsdC5uZXdFbGVzID0gcGFyYW0ucmVtb3ZlZEVsZXMucmVzdG9yZSgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8vIFNlY3Rpb24gRW5kXHJcbi8vIGFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxuLy8gU2VjdGlvbiBTdGFydFxyXG4vLyBlYXN5IGNyZWF0aW9uIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xyXG4gIHZhciBlbGVzO1xyXG5cclxuICBpZiAoZmlyc3RUaW1lKSB7XHJcbiAgICBlbGVzID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uKHBhcmFtLnRlbXBsYXRlVHlwZSwgcGFyYW0ubWFjcm9tb2xlY3VsZUxpc3QsIHBhcmFtLmNvbXBsZXhOYW1lLCBwYXJhbS5wcm9jZXNzUG9zaXRpb24sIHBhcmFtLnRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgcGFyYW0udGlsaW5nUGFkZGluZ0hvcml6b250YWwsIHBhcmFtLmVkZ2VMZW5ndGgpXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlcyA9IHBhcmFtO1xyXG4gICAgY3kuYWRkKGVsZXMpO1xyXG4gICAgXHJcbiAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XHJcbiAgICBlbGVzLnNlbGVjdCgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGVsZXM6IGVsZXNcclxuICB9O1xyXG59O1xyXG5cclxuLy8gU2VjdGlvbiBFbmRcclxuLy8gZWFzeSBjcmVhdGlvbiBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG4vLyBTZWN0aW9uIFN0YXJ0XHJcbi8vIGdlbmVyYWwgYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcG9zaXRpb25zID0ge307XHJcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcclxuICBcclxuICBub2Rlcy5lYWNoKGZ1bmN0aW9uKGksIGVsZSkge1xyXG4gICAgcG9zaXRpb25zW2VsZS5pZCgpXSA9IHtcclxuICAgICAgeDogZWxlLnBvc2l0aW9uKFwieFwiKSxcclxuICAgICAgeTogZWxlLnBvc2l0aW9uKFwieVwiKVxyXG4gICAgfTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHBvc2l0aW9ucztcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zID0gZnVuY3Rpb24gKHBvc2l0aW9ucykge1xyXG4gIHZhciBjdXJyZW50UG9zaXRpb25zID0ge307XHJcbiAgY3kubm9kZXMoKS5wb3NpdGlvbnMoZnVuY3Rpb24gKGksIGVsZSkge1xyXG4gICAgY3VycmVudFBvc2l0aW9uc1tlbGUuaWQoKV0gPSB7XHJcbiAgICAgIHg6IGVsZS5wb3NpdGlvbihcInhcIiksXHJcbiAgICAgIHk6IGVsZS5wb3NpdGlvbihcInlcIilcclxuICAgIH07XHJcbiAgICBcclxuICAgIHZhciBwb3MgPSBwb3NpdGlvbnNbZWxlLmlkKCldO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogcG9zLngsXHJcbiAgICAgIHk6IHBvcy55XHJcbiAgICB9O1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gY3VycmVudFBvc2l0aW9ucztcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICAgIHBlcmZvcm1PcGVyYXRpb246IHRydWVcclxuICB9O1xyXG5cclxuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuXHJcbiAgcmVzdWx0LnNpemVNYXAgPSB7fTtcclxuICByZXN1bHQudXNlQXNwZWN0UmF0aW8gPSBmYWxzZTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHJlc3VsdC5zaXplTWFwW25vZGUuaWQoKV0gPSB7XHJcbiAgICAgIHc6IG5vZGUud2lkdGgoKSxcclxuICAgICAgaDogbm9kZS5oZWlnaHQoKVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHJlc3VsdC5ub2RlcyA9IG5vZGVzO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG5cclxuICAgIGlmIChwYXJhbS5wZXJmb3JtT3BlcmF0aW9uKSB7XHJcbiAgICAgIGlmIChwYXJhbS5zaXplTWFwKSB7XHJcbiAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLnc7XHJcbiAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmg7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2RlcyhwYXJhbS5ub2RlcywgcGFyYW0ud2lkdGgsIHBhcmFtLmhlaWdodCwgcGFyYW0udXNlQXNwZWN0UmF0aW8pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICB9O1xyXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG4gIHJlc3VsdC5ub2RlcyA9IG5vZGVzO1xyXG4gIHJlc3VsdC5sYWJlbCA9IHt9O1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgcmVzdWx0LmxhYmVsW25vZGUuaWQoKV0gPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XHJcbiAgfVxyXG5cclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICBub2Rlcy5kYXRhKCdsYWJlbCcsIHBhcmFtLmxhYmVsKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgIG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbCA9IHBhcmFtLmxhYmVsW25vZGUuaWQoKV07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRGF0YSA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgfTtcclxuICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XHJcbiAgcmVzdWx0Lm5hbWUgPSBwYXJhbS5uYW1lO1xyXG4gIHJlc3VsdC52YWx1ZU1hcCA9IHt9O1xyXG4gIHJlc3VsdC5lbGVzID0gZWxlcztcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgZWxlID0gZWxlc1tpXTtcclxuICAgIHJlc3VsdC52YWx1ZU1hcFtlbGUuaWQoKV0gPSBlbGUuZGF0YShwYXJhbS5uYW1lKTtcclxuICB9XHJcblxyXG4gIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShwYXJhbS5lbGVzLCBwYXJhbS5uYW1lLCBwYXJhbS52YWx1ZU1hcCk7XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gIH07XHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG4gIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTtcclxuICByZXN1bHQudmFsdWVNYXAgPSB7fTtcclxuICByZXN1bHQuZWxlcyA9IGVsZXM7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICByZXN1bHQudmFsdWVNYXBbZWxlLmlkKCldID0gZWxlLmNzcyhwYXJhbS5uYW1lKTtcclxuICB9XHJcblxyXG4gIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzKHBhcmFtLmVsZXMsIHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlTWFwKTtcclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICB9O1xyXG5cclxuICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XHJcbiAgcmVzdWx0LmRhdGEgPSB7fTtcclxuICByZXN1bHQuZWxlcyA9IGVsZXM7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcblxyXG4gICAgcmVzdWx0LmRhdGFbZWxlLmlkKCldID0ge307XHJcblxyXG4gICAgdmFyIGRhdGEgPSBwYXJhbS5maXJzdFRpbWUgPyBwYXJhbS5kYXRhIDogcGFyYW0uZGF0YVtlbGUuaWQoKV07XHJcblxyXG4gICAgZm9yICh2YXIgcHJvcCBpbiBkYXRhKSB7XHJcbiAgICAgIHJlc3VsdC5kYXRhW2VsZS5pZCgpXVtwcm9wXSA9IGVsZS5kYXRhKHByb3ApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyhlbGVzLCBkYXRhKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICAgIFxyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZSwgZGF0YSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLypcclxuICogU2hvdyBlbGVzIGFuZCBwZXJmb3JtIGxheW91dC5cclxuICovXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG5cclxuICB2YXIgcmVzdWx0ID0ge307XHJcbiAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcclxuICBcclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICByZXN1bHQuZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQocGFyYW0uZWxlcywgcGFyYW0ubGF5b3V0cGFyYW0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgZ2l2ZW4gZWxlc1xyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvU2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XHJcblxyXG4gIHZhciByZXN1bHQgPSB7fTtcclxuICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xyXG4gIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLmhpZGUoZWxlcyk7IC8vIEhpZGUgcHJldmlvdXNseSB1bmhpZGRlbiBlbGVzO1xyXG5cclxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyhwYXJhbS5wb3NpdGlvbnMpO1xyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLy8gU2VjdGlvbiBFbmRcclxuLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG4vLyBTZWN0aW9uIFN0YXJ0XHJcbi8vIHNiZ24gYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gIH07XHJcbiAgcmVzdWx0LnR5cGUgPSBwYXJhbS50eXBlO1xyXG4gIHJlc3VsdC5ub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG4gIHJlc3VsdC5pbmRleCA9IHBhcmFtLmluZGV4O1xyXG5cclxuICByZXN1bHQudmFsdWUgPSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94KHBhcmFtLm5vZGVzLCBwYXJhbS5pbmRleCwgcGFyYW0udmFsdWUsIHBhcmFtLnR5cGUpO1xyXG5cclxuICBjeS5mb3JjZVJlbmRlcigpO1xyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgb2JqID0gcGFyYW0ub2JqO1xyXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG5cclxuICB2YXIgaW5kZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG5vZGVzLCBvYmopO1xyXG5cclxuICBjeS5mb3JjZVJlbmRlcigpO1xyXG5cclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgaW5kZXg6IGluZGV4LFxyXG4gICAgb2JqOiBvYmpcclxuICB9O1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBpbmRleCA9IHBhcmFtLmluZGV4O1xyXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG5cclxuICB2YXIgb2JqID0gZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgpO1xyXG5cclxuICBjeS5mb3JjZVJlbmRlcigpO1xyXG5cclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgb2JqOiBvYmpcclxuICB9O1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcbiAgdmFyIHN0YXR1cyA9IHBhcmFtLnN0YXR1cztcclxuICB2YXIgcmVzdWx0U3RhdHVzID0ge307XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICB2YXIgaXNNdWx0aW1lciA9IG5vZGUuZGF0YSgnY2xhc3MnKS5lbmRzV2l0aCgnIG11bHRpbWVyJyk7XHJcblxyXG4gICAgcmVzdWx0U3RhdHVzW25vZGUuaWQoKV0gPSBpc011bHRpbWVyO1xyXG4gIH1cclxuXHJcbiAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZSBjaGFuZ2UgdGhlIHN0YXR1cyBvZiBhbGwgbm9kZXMgYXQgb25jZS5cclxuICAvLyBJZiBub3QgY2hhbmdlIHN0YXR1cyBvZiBlYWNoIHNlcGVyYXRlbHkgdG8gdGhlIHZhbHVlcyBtYXBwZWQgdG8gdGhlaXIgaWQuXHJcbiAgaWYgKGZpcnN0VGltZSkge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMobm9kZSwgc3RhdHVzW25vZGUuaWQoKV0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbi8vICBpZiAoIWZpcnN0VGltZSAmJiBfLmlzRXF1YWwobm9kZXMsIGN5Lm5vZGVzKCc6c2VsZWN0ZWQnKSkpIHtcclxuLy8gICAgJCgnI2luc3BlY3Rvci1pcy1tdWx0aW1lcicpLmF0dHIoXCJjaGVja2VkXCIsICEkKCcjaW5zcGVjdG9yLWlzLW11bHRpbWVyJykuYXR0cihcImNoZWNrZWRcIikpO1xyXG4vLyAgfVxyXG5cclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgc3RhdHVzOiByZXN1bHRTdGF0dXMsXHJcbiAgICBub2Rlczogbm9kZXNcclxuICB9O1xyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuICB2YXIgc3RhdHVzID0gcGFyYW0uc3RhdHVzO1xyXG4gIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XHJcbiAgdmFyIHJlc3VsdFN0YXR1cyA9IHt9O1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgcmVzdWx0U3RhdHVzW25vZGUuaWQoKV0gPSBub2RlLmRhdGEoJ2Nsb25lbWFya2VyJyk7XHJcbiAgICB2YXIgY3VycmVudFN0YXR1cyA9IGZpcnN0VGltZSA/IHN0YXR1cyA6IHN0YXR1c1tub2RlLmlkKCldO1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhub2RlLCBjdXJyZW50U3RhdHVzKTtcclxuICB9XHJcblxyXG4vLyAgaWYgKCFmaXJzdFRpbWUgJiYgXy5pc0VxdWFsKG5vZGVzLCBjeS5ub2RlcygnOnNlbGVjdGVkJykpKSB7XHJcbi8vICAgICQoJyNpbnNwZWN0b3ItaXMtY2xvbmUtbWFya2VyJykuYXR0cihcImNoZWNrZWRcIiwgISQoJyNpbnNwZWN0b3ItaXMtY2xvbmUtbWFya2VyJykuYXR0cihcImNoZWNrZWRcIikpO1xyXG4vLyAgfVxyXG5cclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgc3RhdHVzOiByZXN1bHRTdGF0dXMsXHJcbiAgICBub2Rlczogbm9kZXNcclxuICB9O1xyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLy8gcGFyYW06IHtjbGFzczogc2JnbmNsYXNzLCBuYW1lOiBwcm9wZXJ0eU5hbWUsIHZhbHVlOiB2YWx1ZX1cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0RGVmYXVsdFByb3BlcnR5ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9IHBhcmFtLmNsYXNzO1xyXG4gIHZhciBuYW1lID0gcGFyYW0ubmFtZTtcclxuICB2YXIgdmFsdWUgPSBwYXJhbS52YWx1ZTtcclxuICB2YXIgY2xhc3NEZWZhdWx0cyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbc2JnbmNsYXNzXTtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgY2xhc3M6IHNiZ25jbGFzcyxcclxuICAgIG5hbWU6IG5hbWUsXHJcbiAgICB2YWx1ZTogY2xhc3NEZWZhdWx0cy5oYXNPd25Qcm9wZXJ0eShuYW1lKSA/IGNsYXNzRGVmYXVsdHNbbmFtZV0gOiB1bmRlZmluZWRcclxuICB9O1xyXG5cclxuICBjbGFzc0RlZmF1bHRzW25hbWVdID0gdmFsdWU7XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vLyBTZWN0aW9uIEVuZFxyXG4vLyBzYmduIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7Il19
