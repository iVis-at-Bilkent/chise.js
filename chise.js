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

  sbgnviz.refreshPaddings();
  return newNode;
};

elementUtilities.addEdge = function (source, target, sbgnclass, id, visibility) {
  var defaultProperties = this.defaultProperties;
  var defaults = defaultProperties[sbgnclass];
  var css = defaults ? {
    'width': defaults['width']
  } : {};
  
  var css = {};
  
  if (defaults) {
    if (defaults.width) {
      css.width = defaults.width;
    } 
    
    if (defaults['line-color']) {
      css['line-color'] = defaults['line-color'];
    }
  }

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
  nodesToMakeCompound.move({parent: newCompoundId});
  sbgnviz.refreshPaddings();
  return newCompound;
};

/*
 * Removes a compound. Before the removal operation moves the children of that compound to the parent of the compound.
 * Returns old children of the compound which are moved to another parent and the removed compound to restore back later.
 */
elementUtilities.removeCompound = function (compoundToRemove) {
  var compoundId = compoundToRemove.id();
  var newParentId = compoundToRemove.data("parent");
  newParentId = newParentId === undefined ? null : newParentId;
  var childrenOfCompound = compoundToRemove.children();

  childrenOfCompound.move({parent: newParentId});
  var removedCompound = compoundToRemove.remove();
  
  return {
    childrenOfCompound: childrenOfCompound,
    removedCompound: removedCompound
  };
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
  
  sbgnviz.refreshPaddings();
  cy.elements().unselect();
  eles.select();
  
  return eles; // Return the just added elements
};

/*
 * Move the nodes to a new parent and change their position if possDiff params are set.
 */
elementUtilities.changeParent = function(nodes, newParent, posDiffX, posDiffY) {
  var newParentId = typeof newParent === 'string' ? newParent : newParent.id();
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
var $ = libs.jQuery;

var registerUndoRedoActions = function (undoableDrag) {
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
  ur.action("createCompoundForGivenNodes", undoRedoActionFunctions.createCompoundForGivenNodes, undoRedoActionFunctions.removeCompound);

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
},{"./lib-utilities":4,"./undo-redo-action-functions":8}],8:[function(_dereq_,module,exports){
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
  var nodesToMakeCompound = param.nodesToMakeCompound;
  var newCompound;

  // If this is a redo action refresh the nodes to make compound (We need this because after ele.move() references to eles changes)
  if (!param.firstTime) {
    var nodesToMakeCompoundIds = {};

    nodesToMakeCompound.each(function (i, ele) {
      nodesToMakeCompoundIds[ele.id()] = true;
    });

    var allNodes = cy.nodes();

    nodesToMakeCompound = allNodes.filter(function (i, ele) {
      return nodesToMakeCompoundIds[ele.id()];
    });
  }

  if (param.firstTime) {
    var oldParentId = nodesToMakeCompound[0].data("parent");
    // The parent of new compound will be the old parent of the nodes to make compound
    newCompound = elementUtilities.createCompoundForGivenNodes(nodesToMakeCompound, param.compoundType);
  }
  else {
    newCompound = param.removedCompound.restore();
    var newCompoundId = newCompound.id();

    nodesToMakeCompound.move({parent: newCompoundId});

    sbgnviz.refreshPaddings();
  }

  return newCompound;
};

undoRedoActionFunctions.removeCompound = function (compoundToRemove) {
  var result = elementUtilities.removeCompound(compoundToRemove);

  var param = {
    nodesToMakeCompound: result.childrenOfCompound,
    removedCompound: result.removedCompound
  };

  return param;
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
    
    sbgnviz.refreshPaddings();
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9saWItdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeG1DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcGlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCl7XG4gIHZhciBjaGlzZSA9IHdpbmRvdy5jaGlzZSA9IGZ1bmN0aW9uKF9vcHRpb25zLCBfbGlicykge1xuICAgIHZhciBsaWJzID0ge307XG4gICAgbGlicy5qUXVlcnkgPSBfbGlicy5qUXVlcnkgfHwgalF1ZXJ5O1xuICAgIGxpYnMuY3l0b3NjYXBlID0gX2xpYnMuY3l0b3NjYXBlIHx8IGN5dG9zY2FwZTtcbiAgICBsaWJzLnNiZ252aXogPSBfbGlicy5zYmdudml6IHx8IHNiZ252aXo7XG4gICAgbGlicy5zYXZlQXMgPSBfbGlicy5maWxlc2F2ZXJqcyA/IF9saWJzLmZpbGVzYXZlcmpzLnNhdmVBcyA6IHNhdmVBcztcbiAgICBcbiAgICBsaWJzLnNiZ252aXooX29wdGlvbnMsIF9saWJzKTsgLy8gSW5pdGlsaXplIHNiZ252aXpcbiAgICBcbiAgICAvLyBTZXQgdGhlIGxpYnJhcmllcyB0byBhY2Nlc3MgdGhlbSBmcm9tIGFueSBmaWxlXG4gICAgdmFyIGxpYlV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKTtcbiAgICBsaWJVdGlsaXRpZXMuc2V0TGlicyhsaWJzKTtcbiAgICBcbiAgICB2YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcycpO1xuICAgIHZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMoX29wdGlvbnMpOyAvLyBFeHRlbmRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9uc1xuICAgIFxuICAgIC8vIFVwZGF0ZSBzdHlsZSBhbmQgYmluZCBldmVudHNcbiAgICB2YXIgY3lTdHlsZUFuZEV2ZW50cyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMnKTtcbiAgICBjeVN0eWxlQW5kRXZlbnRzKGxpYnMuc2JnbnZpeik7XG4gICAgXG4gICAgLy8gUmVnaXN0ZXIgdW5kby9yZWRvIGFjdGlvbnNcbiAgICB2YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9yZWdpc3Rlci11bmRvLXJlZG8tYWN0aW9ucycpO1xuICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKG9wdGlvbnMudW5kb2FibGVEcmFnKTtcbiAgICBcbiAgICB2YXIgbWFpblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzJyk7XG4gICAgdmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcycpO1xuICAgIHZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XG4gICAgXG4gICAgLy8gRXhwb3NlIHRoZSBhcGlcbiAgICBcbiAgICAvLyBFeHBvc2UgdGhlIHByb3BlcnRpZXMgaW5oZXJpdGVkIGZyb20gc2JnbnZpelxuICAgIC8vIHRoZW4gb3ZlcnJpZGUgc29tZSBvZiB0aGVzZSBwcm9wZXJ0aWVzIGFuZCBleHBvc2Ugc29tZSBuZXcgcHJvcGVydGllc1xuICAgIGZvciAodmFyIHByb3AgaW4gbGlicy5zYmdudml6KSB7XG4gICAgICBjaGlzZVtwcm9wXSA9IGxpYnMuc2JnbnZpeltwcm9wXTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXhwb3NlIGVhY2ggbWFpbiB1dGlsaXR5IHNlcGVyYXRlbHlcbiAgICBmb3IgKHZhciBwcm9wIGluIG1haW5VdGlsaXRpZXMpIHtcbiAgICAgIGNoaXNlW3Byb3BdID0gbWFpblV0aWxpdGllc1twcm9wXTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXhwb3NlIGVsZW1lbnRVdGlsaXRpZXMgYW5kIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zIGFzIGlzXG4gICAgY2hpc2UuZWxlbWVudFV0aWxpdGllcyA9IGVsZW1lbnRVdGlsaXRpZXM7XG4gICAgY2hpc2UudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcbiAgfTtcbiAgXG4gIGlmICggdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBjaGlzZTtcbiAgfVxufSkoKTsiLCJ2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyICQgPSBsaWJzLmpRdWVyeTtcbnZhciBvcHRpb25zID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJykuZ2V0T3B0aW9ucygpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzYmdudml6KSB7XG4gIC8vSGVscGVyc1xuICBcbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyB0byBiZSBjYWxsZWQgYWZ0ZXIgbm9kZXMgYXJlIHJlc2l6ZWQgdGhyb3VoIHRoZSBub2RlIHJlc2l6ZSBleHRlbnNpb24gb3IgdGhyb3VnaCB1bmRvL3JlZG8gYWN0aW9uc1xuICB2YXIgbm9kZVJlc2l6ZUVuZEZ1bmN0aW9uID0gZnVuY3Rpb24gKG5vZGVzKSB7XG4gICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICB2YXIgdyA9IG5vZGUud2lkdGgoKTtcbiAgICAgIHZhciBoID0gbm9kZS5oZWlnaHQoKTtcblxuICAgICAgbm9kZS5yZW1vdmVTdHlsZSgnd2lkdGgnKTtcbiAgICAgIG5vZGUucmVtb3ZlU3R5bGUoJ2hlaWdodCcpO1xuXG4gICAgICBub2RlLmRhdGEoJ2Jib3gnKS53ID0gdztcbiAgICAgIG5vZGUuZGF0YSgnYmJveCcpLmggPSBoO1xuICAgIH1cbiAgICBjeS5lbmRCYXRjaCgpO1xuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG4gIFxuICB2YXIgaW5pdEVsZW1lbnREYXRhID0gZnVuY3Rpb24gKGVsZSkge1xuICAgIHZhciBlbGVjbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xuICAgIGlmICghZWxlY2xhc3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZWxlY2xhc3MgPSBlbGVtZW50VXRpbGl0aWVzLmRlbXVsdGltZXJpemVDbGFzcyhlbGVjbGFzcyk7XG4gICAgdmFyIGNsYXNzUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbZWxlY2xhc3NdO1xuXG4gICAgY3kuYmF0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGVsZS5pc05vZGUoKSkge1xuICAgICAgICBpZiAoY2xhc3NQcm9wZXJ0aWVzWyd3aWR0aCddICYmICFlbGUuZGF0YSgnYmJveCcpLncpIHtcbiAgICAgICAgICBlbGUuZGF0YSgnYmJveCcpLncgPSBjbGFzc1Byb3BlcnRpZXNbJ3dpZHRoJ107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsYXNzUHJvcGVydGllc1snaGVpZ2h0J10gJiYgIWVsZS5kYXRhKCdiYm94JykuaCkge1xuICAgICAgICAgIGVsZS5kYXRhKCdiYm94JykuaCA9IGNsYXNzUHJvcGVydGllc1snaGVpZ2h0J107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC1zaXplJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydmb250LXNpemUnXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdmb250LXNpemUnLCBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtc2l6ZSddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdmb250LWZhbWlseScpICYmIGNsYXNzUHJvcGVydGllc1snZm9udC1mYW1pbHknXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdmb250LWZhbWlseScsIGNsYXNzUHJvcGVydGllc1snZm9udC1mYW1pbHknXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC1zdHlsZScpICYmIGNsYXNzUHJvcGVydGllc1snZm9udC1zdHlsZSddKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ2ZvbnQtc3R5bGUnLCBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtc3R5bGUnXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC13ZWlnaHQnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtd2VpZ2h0J10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnZm9udC13ZWlnaHQnLCBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtd2VpZ2h0J10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2JhY2tncm91bmQtY29sb3InKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2JhY2tncm91bmQtY29sb3InXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdiYWNrZ3JvdW5kLWNvbG9yJywgY2xhc3NQcm9wZXJ0aWVzWydiYWNrZ3JvdW5kLWNvbG9yJ10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2JhY2tncm91bmQtb3BhY2l0eScpICYmIGNsYXNzUHJvcGVydGllc1snYmFja2dyb3VuZC1vcGFjaXR5J10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnYmFja2dyb3VuZC1vcGFjaXR5JywgY2xhc3NQcm9wZXJ0aWVzWydiYWNrZ3JvdW5kLW9wYWNpdHknXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnYm9yZGVyLWNvbG9yJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydib3JkZXItY29sb3InXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdib3JkZXItY29sb3InLCBjbGFzc1Byb3BlcnRpZXNbJ2JvcmRlci1jb2xvciddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdib3JkZXItd2lkdGgnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2JvcmRlci13aWR0aCddKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ2JvcmRlci13aWR0aCcsIGNsYXNzUHJvcGVydGllc1snYm9yZGVyLXdpZHRoJ10pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChlbGUuaXNFZGdlKCkpIHtcbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnd2lkdGgnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ3dpZHRoJ10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnd2lkdGgnLCBjbGFzc1Byb3BlcnRpZXNbJ3dpZHRoJ10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2xpbmUtY29sb3InKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2xpbmUtY29sb3InXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdsaW5lLWNvbG9yJywgY2xhc3NQcm9wZXJ0aWVzWydsaW5lLWNvbG9yJ10pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIFxuICAvLyBVcGRhdGUgY3kgc3R5bGVzaGVldFxuICB2YXIgdXBkYXRlU3R5bGVTaGVldCA9IGZ1bmN0aW9uKCkge1xuICAgIGN5LnN0eWxlKClcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250LXNpemVdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdmb250LXNpemUnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIC8vIElmIG5vZGUgbGFiZWxzIGFyZSBleHBlY3RlZCB0byBiZSBhZGp1c3RlZCBhdXRvbWF0aWNhbGx5IG9yIGVsZW1lbnQgY2Fubm90IGhhdmUgbGFiZWxcbiAgICAgICAgLy8gcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0TGFiZWxUZXh0U2l6ZSgpIGVsc2UgcmV0dXJuIGVsZS5kYXRhKCdmb250LXNpemUnKVxuICAgICAgICB2YXIgb3B0ID0gb3B0aW9ucy5hZGp1c3ROb2RlTGFiZWxGb250U2l6ZUF1dG9tYXRpY2FsbHk7XG4gICAgICAgIHZhciBhZGp1c3QgPSB0eXBlb2Ygb3B0ID09PSAnZnVuY3Rpb24nID8gb3B0KCkgOiBvcHQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWFkanVzdCkge1xuICAgICAgICAgIHJldHVybiBlbGUuZGF0YSgnZm9udC1zaXplJyk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldExhYmVsVGV4dFNpemUoZWxlKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2ZvbnQtZmFtaWx5XVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnZm9udC1mYW1pbHknOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnZm9udC1mYW1pbHknKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2ZvbnQtc3R5bGVdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdmb250LXN0eWxlJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2ZvbnQtc3R5bGUnKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2ZvbnQtd2VpZ2h0XVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnZm9udC13ZWlnaHQnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnZm9udC13ZWlnaHQnKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2JhY2tncm91bmQtY29sb3JdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2JhY2tncm91bmQtY29sb3InKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2JhY2tncm91bmQtb3BhY2l0eV1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdiYWNrZ3JvdW5kLW9wYWNpdHknKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2JvcmRlci13aWR0aF1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2JvcmRlci13aWR0aCc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdib3JkZXItd2lkdGgnKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2JvcmRlci1jb2xvcl1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2JvcmRlci1jb2xvcic6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdib3JkZXItY29sb3InKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3NdW2xpbmUtY29sb3JdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdsaW5lLWNvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2xpbmUtY29sb3InKTtcbiAgICAgIH0sXG4gICAgICAnc291cmNlLWFycm93LWNvbG9yJzogZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnbGluZS1jb2xvcicpO1xuICAgICAgfSxcbiAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdsaW5lLWNvbG9yJyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzXVt3aWR0aF1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ3dpZHRoJzogZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnd2lkdGgnKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zZWxlY3RvcihcIm5vZGU6c2VsZWN0ZWRcIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2JvcmRlci1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICd0ZXh0LW91dGxpbmUtY29sb3InOiAnIzAwMCdcbiAgICB9KVxuICAgIC5zZWxlY3RvcihcImVkZ2U6c2VsZWN0ZWRcIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2xpbmUtY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjZDY3NjE0J1xuICAgIH0pLnVwZGF0ZSgpO1xuICB9O1xuICBcbiAgLy8gQmluZCBldmVudHNcbiAgdmFyIGJpbmRDeUV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIGN5Lm9uKFwibm9kZXJlc2l6ZS5yZXNpemVlbmRcIiwgZnVuY3Rpb24gKGV2ZW50LCB0eXBlLCBub2RlKSB7XG4gICAgICBub2RlUmVzaXplRW5kRnVuY3Rpb24obm9kZSk7XG4gICAgfSk7XG5cbiAgICBjeS5vbihcImFmdGVyRG9cIiwgZnVuY3Rpb24gKGV2ZW50LCBhY3Rpb25OYW1lLCBhcmdzKSB7XG4gICAgICBpZiAoYWN0aW9uTmFtZSA9PT0gJ2NoYW5nZVBhcmVudCcpIHtcbiAgICAgICAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGN5Lm9uKFwiYWZ0ZXJVbmRvXCIsIGZ1bmN0aW9uIChldmVudCwgYWN0aW9uTmFtZSwgYXJncykge1xuICAgICAgaWYgKGFjdGlvbk5hbWUgPT09ICdyZXNpemUnKSB7XG4gICAgICAgIG5vZGVSZXNpemVFbmRGdW5jdGlvbihhcmdzLm5vZGUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoYWN0aW9uTmFtZSA9PT0gJ2NoYW5nZVBhcmVudCcpIHtcbiAgICAgICAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGN5Lm9uKFwiYWZ0ZXJSZWRvXCIsIGZ1bmN0aW9uIChldmVudCwgYWN0aW9uTmFtZSwgYXJncykge1xuICAgICAgaWYgKGFjdGlvbk5hbWUgPT09ICdyZXNpemUnKSB7XG4gICAgICAgIG5vZGVSZXNpemVFbmRGdW5jdGlvbihhcmdzLm5vZGUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoYWN0aW9uTmFtZSA9PT0gJ2NoYW5nZVBhcmVudCcpIHtcbiAgICAgICAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICBjeS5vbihcImFkZFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBlbGUgPSBldmVudC5jeVRhcmdldDtcbiAgICAgIGluaXRFbGVtZW50RGF0YShlbGUpO1xuICAgIH0pO1xuICB9O1xuICAvLyBIZWxwZXJzIEVuZFxuICBcbiAgLy8gRG8gdGhlc2UganVzdCBvbmUgdGltZVxuICAkKGRvY3VtZW50KS5vbmUoJ3VwZGF0ZUdyYXBoRW5kJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBiaW5kQ3lFdmVudHMoKTtcbiAgICB1cGRhdGVTdHlsZVNoZWV0KCk7XG4gICAgdmFyIGVsZXMgPSBjeS5lbGVtZW50cygpO1xuICAgIFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaW5pdEVsZW1lbnREYXRhKGVsZXNbaV0pO1xuICAgIH1cbiAgfSk7XG59OyIsIi8vIEV4dGVuZHMgc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBzYmdudml6ID0gbGlicy5zYmdudml6O1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzO1xudmFyIG9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKS5nZXRPcHRpb25zKCk7XG5cbmVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXMgPSB7XG4gIFwicHJvY2Vzc1wiOiB7XG4gICAgd2lkdGg6IDE1LFxuICAgIGhlaWdodDogMTUsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwib21pdHRlZCBwcm9jZXNzXCI6IHtcbiAgICB3aWR0aDogMTUsXG4gICAgaGVpZ2h0OiAxNSxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgfSxcbiAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiB7XG4gICAgd2lkdGg6IDE1LFxuICAgIGhlaWdodDogMTUsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwiYXNzb2NpYXRpb25cIjoge1xuICAgIHdpZHRoOiAxNSxcbiAgICBoZWlnaHQ6IDE1LFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcImRpc3NvY2lhdGlvblwiOiB7XG4gICAgd2lkdGg6IDE1LFxuICAgIGhlaWdodDogMTUsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwibWFjcm9tb2xlY3VsZVwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gICAgXG4gIH0sXG4gIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcInNpbXBsZSBjaGVtaWNhbFwiOiB7XG4gICAgd2lkdGg6IDM1LFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwic291cmNlIGFuZCBzaW5rXCI6IHtcbiAgICB3aWR0aDogMjUsXG4gICAgaGVpZ2h0OiAyNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgfSxcbiAgXCJ0YWdcIjoge1xuICAgIHdpZHRoOiAzNSxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcInBoZW5vdHlwZVwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgfSxcbiAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgfSxcbiAgXCJjb21wbGV4XCI6IHtcbiAgICB3aWR0aDogMTAwLFxuICAgIGhlaWdodDogMTAwLFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcImNvbXBhcnRtZW50XCI6IHtcbiAgICB3aWR0aDogMTAwLFxuICAgIGhlaWdodDogMTAwLFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDMuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcImFuZFwiOiB7XG4gICAgd2lkdGg6IDI1LFxuICAgIGhlaWdodDogMjUsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwib3JcIjoge1xuICAgIHdpZHRoOiAyNSxcbiAgICBoZWlnaHQ6IDI1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgfSxcbiAgXCJub3RcIjoge1xuICAgIHdpZHRoOiAyNSxcbiAgICBoZWlnaHQ6IDI1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgfSxcbiAgXCJjb25zdW1wdGlvblwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcInByb2R1Y3Rpb25cIjoge1xuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICd3aWR0aCc6IDEuMjVcbiAgfSxcbiAgXCJtb2R1bGF0aW9uXCI6IHtcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAnd2lkdGgnOiAxLjI1XG4gIH0sXG4gIFwic3RpbXVsYXRpb25cIjoge1xuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICd3aWR0aCc6IDEuMjVcbiAgfSxcbiAgXCJjYXRhbHlzaXNcIjoge1xuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICd3aWR0aCc6IDEuMjVcbiAgfSxcbiAgXCJpbmhpYml0aW9uXCI6IHtcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAnd2lkdGgnOiAxLjI1XG4gIH0sXG4gIFwibmVjZXNzYXJ5IHN0aW11bGF0aW9uXCI6IHtcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAnd2lkdGgnOiAxLjI1XG4gIH0sXG4gIFwibG9naWMgYXJjXCI6IHtcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAnd2lkdGgnOiAxLjI1XG4gIH0sXG4gIFwiZXF1aXZhbGVuY2UgYXJjXCI6IHtcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAnd2lkdGgnOiAxLjI1XG4gIH1cbn07XG5cbi8vIFNlY3Rpb24gU3RhcnRcbi8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXG5cbmVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSA9IGZ1bmN0aW9uICh4LCB5LCBzYmduY2xhc3MsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcbiAgdmFyIGRlZmF1bHRQcm9wZXJ0aWVzID0gdGhpcy5kZWZhdWx0UHJvcGVydGllcztcbiAgdmFyIGRlZmF1bHRzID0gZGVmYXVsdFByb3BlcnRpZXNbc2JnbmNsYXNzXTtcblxuICB2YXIgd2lkdGggPSBkZWZhdWx0cyA/IGRlZmF1bHRzLndpZHRoIDogNTA7XG4gIHZhciBoZWlnaHQgPSBkZWZhdWx0cyA/IGRlZmF1bHRzLmhlaWdodCA6IDUwO1xuICBcbiAgdmFyIGNzcyA9IHt9O1xuICBcbiAgaWYgKHZpc2liaWxpdHkpIHtcbiAgICBjc3MudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XG4gIH1cblxuICBpZiAoZGVmYXVsdHMgJiYgZGVmYXVsdHMubXVsdGltZXIpIHtcbiAgICBzYmduY2xhc3MgKz0gXCIgbXVsdGltZXJcIjtcbiAgfVxuICB2YXIgZGF0YSA9IHtcbiAgICBjbGFzczogc2JnbmNsYXNzLFxuICAgIGJib3g6IHtcbiAgICAgIGg6IGhlaWdodCxcbiAgICAgIHc6IHdpZHRoLFxuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9LFxuICAgIHN0YXRlc2FuZGluZm9zOiBbXSxcbiAgICBwb3J0czogW10sXG4gICAgY2xvbmVtYXJrZXI6IGRlZmF1bHRzICYmIGRlZmF1bHRzLmNsb25lbWFya2VyID8gZGVmYXVsdHMuY2xvbmVtYXJrZXIgOiB1bmRlZmluZWRcbiAgfTtcblxuICBpZihpZCkge1xuICAgIGRhdGEuaWQgPSBpZDtcbiAgfVxuICBcbiAgaWYgKHBhcmVudCkge1xuICAgIGRhdGEucGFyZW50ID0gcGFyZW50O1xuICB9XG5cbiAgdmFyIGVsZXMgPSBjeS5hZGQoe1xuICAgIGdyb3VwOiBcIm5vZGVzXCIsXG4gICAgZGF0YTogZGF0YSxcbiAgICBjc3M6IGNzcyxcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBuZXdOb2RlID0gZWxlc1tlbGVzLmxlbmd0aCAtIDFdO1xuXG4gIHNiZ252aXoucmVmcmVzaFBhZGRpbmdzKCk7XG4gIHJldHVybiBuZXdOb2RlO1xufTtcblxuZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlID0gZnVuY3Rpb24gKHNvdXJjZSwgdGFyZ2V0LCBzYmduY2xhc3MsIGlkLCB2aXNpYmlsaXR5KSB7XG4gIHZhciBkZWZhdWx0UHJvcGVydGllcyA9IHRoaXMuZGVmYXVsdFByb3BlcnRpZXM7XG4gIHZhciBkZWZhdWx0cyA9IGRlZmF1bHRQcm9wZXJ0aWVzW3NiZ25jbGFzc107XG4gIHZhciBjc3MgPSBkZWZhdWx0cyA/IHtcbiAgICAnd2lkdGgnOiBkZWZhdWx0c1snd2lkdGgnXVxuICB9IDoge307XG4gIFxuICB2YXIgY3NzID0ge307XG4gIFxuICBpZiAoZGVmYXVsdHMpIHtcbiAgICBpZiAoZGVmYXVsdHMud2lkdGgpIHtcbiAgICAgIGNzcy53aWR0aCA9IGRlZmF1bHRzLndpZHRoO1xuICAgIH0gXG4gICAgXG4gICAgaWYgKGRlZmF1bHRzWydsaW5lLWNvbG9yJ10pIHtcbiAgICAgIGNzc1snbGluZS1jb2xvciddID0gZGVmYXVsdHNbJ2xpbmUtY29sb3InXTtcbiAgICB9XG4gIH1cblxuICBpZiAodmlzaWJpbGl0eSkge1xuICAgIGNzcy52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcbiAgfVxuXG4gIHZhciBkYXRhID0ge1xuICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgIGNsYXNzOiBzYmduY2xhc3NcbiAgfTtcbiAgXG4gIGlmKGlkKSB7XG4gICAgZGF0YS5pZCA9IGlkO1xuICB9XG5cbiAgdmFyIGVsZXMgPSBjeS5hZGQoe1xuICAgIGdyb3VwOiBcImVkZ2VzXCIsXG4gICAgZGF0YTogZGF0YSxcbiAgICBjc3M6IGNzc1xuICB9KTtcblxuICB2YXIgbmV3RWRnZSA9IGVsZXNbZWxlcy5sZW5ndGggLSAxXTtcbiAgXG4gIHJldHVybiBuZXdFZGdlO1xufTtcblxuZWxlbWVudFV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyA9IGZ1bmN0aW9uKF9zb3VyY2UsIF90YXJnZXQsIHByb2Nlc3NUeXBlKSB7XG4gIC8vIElmIHNvdXJjZSBhbmQgdGFyZ2V0IElEcyBhcmUgZ2l2ZW4gZ2V0IHRoZSBlbGVtZW50cyBieSBJRHNcbiAgdmFyIHNvdXJjZSA9IHR5cGVvZiBfc291cmNlID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9zb3VyY2UpIDogX3NvdXJjZTtcbiAgdmFyIHRhcmdldCA9IHR5cGVvZiBfdGFyZ2V0ID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF90YXJnZXQpIDogX3RhcmdldDtcbiAgXG4gIC8vIFByb2Nlc3MgcGFyZW50IHNob3VsZCBiZSB0aGUgY2xvc2VzdCBjb21tb24gYW5jZXN0b3Igb2YgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0IG5vZGVzXG4gIHZhciBwcm9jZXNzUGFyZW50ID0gY3kuY29sbGVjdGlvbihbc291cmNlWzBdLCB0YXJnZXRbMF1dKS5jb21tb25BbmNlc3RvcnMoKS5maXJzdCgpO1xuICBcbiAgLy8gUHJvY2VzcyBzaG91bGQgYmUgYXQgdGhlIG1pZGRsZSBvZiB0aGUgc291cmNlIGFuZCB0YXJnZXQgbm9kZXNcbiAgdmFyIHggPSAoIHNvdXJjZS5wb3NpdGlvbigneCcpICsgdGFyZ2V0LnBvc2l0aW9uKCd4JykgKSAvIDI7XG4gIHZhciB5ID0gKCBzb3VyY2UucG9zaXRpb24oJ3knKSArIHRhcmdldC5wb3NpdGlvbigneScpICkgLyAyO1xuICBcbiAgLy8gQ3JlYXRlIHRoZSBwcm9jZXNzIHdpdGggZ2l2ZW4vY2FsY3VsYXRlZCB2YXJpYWJsZXNcbiAgdmFyIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeCwgeSwgcHJvY2Vzc1R5cGUsIHVuZGVmaW5lZCwgcHJvY2Vzc1BhcmVudC5pZCgpKTtcbiAgXG4gIC8vIENyZWF0ZSB0aGUgZWRnZXMgb25lIGlzIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSBzb3VyY2Ugbm9kZSAod2hpY2ggc2hvdWxkIGJlIGEgY29uc3VtcHRpb24pLCBcbiAgLy8gdGhlIG90aGVyIG9uZSBpcyBiZXR3ZWVuIHRoZSBwcm9jZXNzIGFuZCB0aGUgdGFyZ2V0IG5vZGUgKHdoaWNoIHNob3VsZCBiZSBhIHByb2R1Y3Rpb24pLlxuICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBwbGVhc2UgcmVmZXIgdG8gU0JHTi1QRCByZWZlcmVuY2UgY2FyZC5cbiAgdmFyIGVkZ2VCdHdTcmMgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2Uoc291cmNlLmlkKCksIHByb2Nlc3MuaWQoKSwgJ2NvbnN1bXB0aW9uJyk7XG4gIHZhciBlZGdlQnR3VGd0ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgdGFyZ2V0LmlkKCksICdwcm9kdWN0aW9uJyk7XG4gIFxuICAvLyBDcmVhdGUgYSBjb2xsZWN0aW9uIGluY2x1ZGluZyB0aGUgZWxlbWVudHMgYW5kIHRvIGJlIHJldHVybmVkXG4gIHZhciBjb2xsZWN0aW9uID0gY3kuY29sbGVjdGlvbihbcHJvY2Vzc1swXSwgZWRnZUJ0d1NyY1swXSwgZWRnZUJ0d1RndFswXV0pO1xuICByZXR1cm4gY29sbGVjdGlvbjtcbn07XG5cbi8qXG4gKiBSZXR1cm5zIGlmIHRoZSBlbGVtZW50cyB3aXRoIHRoZSBnaXZlbiBwYXJlbnQgY2xhc3MgY2FuIGJlIHBhcmVudCBvZiB0aGUgZWxlbWVudHMgd2l0aCB0aGUgZ2l2ZW4gbm9kZSBjbGFzc1xuICovXG5lbGVtZW50VXRpbGl0aWVzLmlzVmFsaWRQYXJlbnQgPSBmdW5jdGlvbihfbm9kZUNsYXNzLCBfcGFyZW50Q2xhc3MpIHtcbiAgLy8gSWYgbm9kZUNsYXNzIGFuZCBwYXJlbnRDbGFzcyBwYXJhbXMgYXJlIGVsZW1lbnRzIGl0c2VsdmVzIGluc3RlYWQgb2YgdGhlaXIgY2xhc3MgbmFtZXMgaGFuZGxlIGl0XG4gIHZhciBub2RlQ2xhc3MgPSB0eXBlb2YgX25vZGVDbGFzcyAhPT0gJ3N0cmluZycgPyBfbm9kZUNsYXNzLmRhdGEoJ2NsYXNzJykgOiBfbm9kZUNsYXNzO1xuICB2YXIgcGFyZW50Q2xhc3MgPSBfcGFyZW50Q2xhc3MgIT0gdW5kZWZpbmVkICYmIHR5cGVvZiBfcGFyZW50Q2xhc3MgIT09ICdzdHJpbmcnID8gX3BhcmVudENsYXNzLmRhdGEoJ2NsYXNzJykgOiBfcGFyZW50Q2xhc3M7XG4gIFxuICBpZiAocGFyZW50Q2xhc3MgPT0gdW5kZWZpbmVkIHx8IHBhcmVudENsYXNzID09PSAnY29tcGFydG1lbnQnKSB7IC8vIENvbXBhcnRtZW50cyBhbmQgdGhlIHJvb3QgY2FuIGluY2x1ZGUgYW55IHR5cGUgb2Ygbm9kZXNcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBlbHNlIGlmIChwYXJlbnRDbGFzcyA9PT0gJ2NvbXBsZXgnKSB7IC8vIENvbXBsZXhlcyBjYW4gb25seSBpbmNsdWRlIEVQTnNcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKG5vZGVDbGFzcyk7XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTsgLy8gQ3VycmVudGx5IGp1c3QgJ2NvbXBhcnRtZW50JyBhbmQgJ2NvbXBsZXgnIGNvbXBvdW5kcyBhcmUgc3VwcG9ydGVkIHJldHVybiBmYWxzZSBmb3IgYW55IG90aGVyIHBhcmVudENsYXNzXG59O1xuXG4vKlxuICogVGhpcyBtZXRob2QgYXNzdW1lcyB0aGF0IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQgY29udGFpbnMgYXQgbGVhc3Qgb25lIG5vZGVcbiAqIGFuZCBhbGwgb2YgdGhlIG5vZGVzIGluY2x1ZGluZyBpbiBpdCBoYXZlIHRoZSBzYW1lIHBhcmVudC4gSXQgY3JlYXRlcyBhIGNvbXBvdW5kIGZvdCB0aGUgZ2l2ZW4gbm9kZXMgYW4gaGF2aW5nIHRoZSBnaXZlbiB0eXBlLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChub2Rlc1RvTWFrZUNvbXBvdW5kLCBjb21wb3VuZFR5cGUpIHtcbiAgdmFyIG9sZFBhcmVudElkID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwicGFyZW50XCIpO1xuICAvLyBUaGUgcGFyZW50IG9mIG5ldyBjb21wb3VuZCB3aWxsIGJlIHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kLiB4LCB5IGFuZCBpZCBwYXJhbWV0ZXJzIGFyZSBub3Qgc2V0LlxuICB2YXIgbmV3Q29tcG91bmQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUodW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbXBvdW5kVHlwZSwgdW5kZWZpbmVkLCBvbGRQYXJlbnRJZCk7XG4gIHZhciBuZXdDb21wb3VuZElkID0gbmV3Q29tcG91bmQuaWQoKTtcbiAgbm9kZXNUb01ha2VDb21wb3VuZC5tb3ZlKHtwYXJlbnQ6IG5ld0NvbXBvdW5kSWR9KTtcbiAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcbiAgcmV0dXJuIG5ld0NvbXBvdW5kO1xufTtcblxuLypcbiAqIFJlbW92ZXMgYSBjb21wb3VuZC4gQmVmb3JlIHRoZSByZW1vdmFsIG9wZXJhdGlvbiBtb3ZlcyB0aGUgY2hpbGRyZW4gb2YgdGhhdCBjb21wb3VuZCB0byB0aGUgcGFyZW50IG9mIHRoZSBjb21wb3VuZC5cbiAqIFJldHVybnMgb2xkIGNoaWxkcmVuIG9mIHRoZSBjb21wb3VuZCB3aGljaCBhcmUgbW92ZWQgdG8gYW5vdGhlciBwYXJlbnQgYW5kIHRoZSByZW1vdmVkIGNvbXBvdW5kIHRvIHJlc3RvcmUgYmFjayBsYXRlci5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5yZW1vdmVDb21wb3VuZCA9IGZ1bmN0aW9uIChjb21wb3VuZFRvUmVtb3ZlKSB7XG4gIHZhciBjb21wb3VuZElkID0gY29tcG91bmRUb1JlbW92ZS5pZCgpO1xuICB2YXIgbmV3UGFyZW50SWQgPSBjb21wb3VuZFRvUmVtb3ZlLmRhdGEoXCJwYXJlbnRcIik7XG4gIG5ld1BhcmVudElkID0gbmV3UGFyZW50SWQgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBuZXdQYXJlbnRJZDtcbiAgdmFyIGNoaWxkcmVuT2ZDb21wb3VuZCA9IGNvbXBvdW5kVG9SZW1vdmUuY2hpbGRyZW4oKTtcblxuICBjaGlsZHJlbk9mQ29tcG91bmQubW92ZSh7cGFyZW50OiBuZXdQYXJlbnRJZH0pO1xuICB2YXIgcmVtb3ZlZENvbXBvdW5kID0gY29tcG91bmRUb1JlbW92ZS5yZW1vdmUoKTtcbiAgXG4gIHJldHVybiB7XG4gICAgY2hpbGRyZW5PZkNvbXBvdW5kOiBjaGlsZHJlbk9mQ29tcG91bmQsXG4gICAgcmVtb3ZlZENvbXBvdW5kOiByZW1vdmVkQ29tcG91bmRcbiAgfTtcbn07XG5cbi8qXG4gKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcbiAqIGluIHRoZSBjb21wbGV4LiBQYXJhbWV0ZXJzIGFyZSBleHBsYWluZWQgYmVsb3cuXG4gKiB0ZW1wbGF0ZVR5cGU6IFRoZSB0eXBlIG9mIHRoZSB0ZW1wbGF0ZSByZWFjdGlvbi4gSXQgbWF5IGJlICdhc3NvY2lhdGlvbicgb3IgJ2Rpc3NvY2lhdGlvbicgZm9yIG5vdy5cbiAqIG1hY3JvbW9sZWN1bGVMaXN0OiBUaGUgbGlzdCBvZiB0aGUgbmFtZXMgb2YgbWFjcm9tb2xlY3VsZXMgd2hpY2ggd2lsbCBpbnZvbHZlIGluIHRoZSByZWFjdGlvbi5cbiAqIGNvbXBsZXhOYW1lOiBUaGUgbmFtZSBvZiB0aGUgY29tcGxleCBpbiB0aGUgcmVhY3Rpb24uXG4gKiBwcm9jZXNzUG9zaXRpb246IFRoZSBtb2RhbCBwb3NpdGlvbiBvZiB0aGUgcHJvY2VzcyBpbiB0aGUgcmVhY3Rpb24uIFRoZSBkZWZhdWx0IHZhbHVlIGlzIHRoZSBjZW50ZXIgb2YgdGhlIGNhbnZhcy5cbiAqIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cbiAqIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiBUaGlzIG9wdGlvbiB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY29zZS1iaWxrZW50IGxheW91dCB3aXRoIHRoZSBzYW1lIG5hbWUuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDE1LlxuICogZWRnZUxlbmd0aDogVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSBtYWNyb21vbGVjdWxlcyBhdCB0aGUgYm90aCBzaWRlcy5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHRlbXBsYXRlVHlwZSwgbWFjcm9tb2xlY3VsZUxpc3QsIGNvbXBsZXhOYW1lLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgpIHtcbiAgdmFyIGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1tcIm1hY3JvbW9sZWN1bGVcIl07XG4gIHZhciB0ZW1wbGF0ZVR5cGUgPSB0ZW1wbGF0ZVR5cGU7XG4gIHZhciBwcm9jZXNzV2lkdGggPSBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW3RlbXBsYXRlVHlwZV0gPyBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW3RlbXBsYXRlVHlwZV0ud2lkdGggOiA1MDtcbiAgdmFyIG1hY3JvbW9sZWN1bGVXaWR0aCA9IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID8gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMud2lkdGggOiA1MDtcbiAgdmFyIG1hY3JvbW9sZWN1bGVIZWlnaHQgPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA/IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLmhlaWdodCA6IDUwO1xuICB2YXIgcHJvY2Vzc1Bvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uID8gcHJvY2Vzc1Bvc2l0aW9uIDogZWxlbWVudFV0aWxpdGllcy5jb252ZXJ0VG9Nb2RlbFBvc2l0aW9uKHt4OiBjeS53aWR0aCgpIC8gMiwgeTogY3kuaGVpZ2h0KCkgLyAyfSk7XG4gIHZhciBtYWNyb21vbGVjdWxlTGlzdCA9IG1hY3JvbW9sZWN1bGVMaXN0O1xuICB2YXIgY29tcGxleE5hbWUgPSBjb21wbGV4TmFtZTtcbiAgdmFyIG51bU9mTWFjcm9tb2xlY3VsZXMgPSBtYWNyb21vbGVjdWxlTGlzdC5sZW5ndGg7XG4gIHZhciB0aWxpbmdQYWRkaW5nVmVydGljYWwgPSB0aWxpbmdQYWRkaW5nVmVydGljYWwgPyB0aWxpbmdQYWRkaW5nVmVydGljYWwgOiAxNTtcbiAgdmFyIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID0gdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPyB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA6IDE1O1xuICB2YXIgZWRnZUxlbmd0aCA9IGVkZ2VMZW5ndGggPyBlZGdlTGVuZ3RoIDogNjA7XG5cbiAgY3kuc3RhcnRCYXRjaCgpO1xuXG4gIHZhciB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcztcbiAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgIHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG4gIH1cbiAgZWxzZSB7XG4gICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgfVxuXG4gIC8vQ3JlYXRlIHRoZSBwcm9jZXNzIGluIHRlbXBsYXRlIHR5cGVcbiAgdmFyIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCB0ZW1wbGF0ZVR5cGUpO1xuICBwcm9jZXNzLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gIC8vRGVmaW5lIHRoZSBzdGFydGluZyB5IHBvc2l0aW9uXG4gIHZhciB5UG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZNYWNyb21vbGVjdWxlcyAtIDEpIC8gMikgKiAobWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XG5cbiAgLy9DcmVhdGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXNcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1PZk1hY3JvbW9sZWN1bGVzOyBpKyspIHtcbiAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcywgeVBvc2l0aW9uLCBcIm1hY3JvbW9sZWN1bGVcIik7XG4gICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgbWFjcm9tb2xlY3VsZUxpc3RbaV0pO1xuXG4gICAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubmVjdGVkIHRvIHRoZSBuZXcgbWFjcm9tb2xlY3VsZVxuICAgIHZhciBuZXdFZGdlO1xuICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3Tm9kZS5pZCgpLCBwcm9jZXNzLmlkKCksICdjb25zdW1wdGlvbicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBuZXdOb2RlLmlkKCksICdwcm9kdWN0aW9uJyk7XG4gICAgfVxuXG4gICAgbmV3RWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgIC8vdXBkYXRlIHRoZSB5IHBvc2l0aW9uXG4gICAgeVBvc2l0aW9uICs9IG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XG4gIH1cblxuICAvL0NyZWF0ZSB0aGUgY29tcGxleCBpbmNsdWRpbmcgbWFjcm9tb2xlY3VsZXMgaW5zaWRlIG9mIGl0XG4gIC8vVGVtcHJvcmFyaWx5IGFkZCBpdCB0byB0aGUgcHJvY2VzcyBwb3NpdGlvbiB3ZSB3aWxsIG1vdmUgaXQgYWNjb3JkaW5nIHRvIHRoZSBsYXN0IHNpemUgb2YgaXRcbiAgdmFyIGNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCAnY29tcGxleCcpO1xuICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcblxuICAvL0lmIGEgbmFtZSBpcyBzcGVjaWZpZWQgZm9yIHRoZSBjb21wbGV4IHNldCBpdHMgbGFiZWwgYWNjb3JkaW5nbHlcbiAgaWYgKGNvbXBsZXhOYW1lKSB7XG4gICAgY29tcGxleC5kYXRhKCdsYWJlbCcsIGNvbXBsZXhOYW1lKTtcbiAgfVxuXG4gIC8vY3JlYXRlIHRoZSBlZGdlIGNvbm5uZWN0ZWQgdG8gdGhlIGNvbXBsZXhcbiAgdmFyIGVkZ2VPZkNvbXBsZXg7XG4gIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICBlZGdlT2ZDb21wbGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgY29tcGxleC5pZCgpLCAncHJvZHVjdGlvbicpO1xuICB9XG4gIGVsc2Uge1xuICAgIGVkZ2VPZkNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UoY29tcGxleC5pZCgpLCBwcm9jZXNzLmlkKCksICdjb25zdW1wdGlvbicpO1xuICB9XG4gIGVkZ2VPZkNvbXBsZXguZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgLy9DcmVhdGUgdGhlIG1hY3JvbW9sZWN1bGVzIGluc2lkZSB0aGUgY29tcGxleFxuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mTWFjcm9tb2xlY3VsZXM7IGkrKykge1xuICAgIC8vIEFkZCBhIG1hY3JvbW9sZWN1bGUgbm90IGhhdmluZyBhIHByZXZpb3VzbHkgZGVmaW5lZCBpZCBhbmQgaGF2aW5nIHRoZSBjb21wbGV4IGNyZWF0ZWQgaW4gdGhpcyByZWFjdGlvbiBhcyBwYXJlbnRcbiAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShjb21wbGV4LnBvc2l0aW9uKCd4JyksIGNvbXBsZXgucG9zaXRpb24oJ3knKSwgXCJtYWNyb21vbGVjdWxlXCIsIHVuZGVmaW5lZCwgY29tcGxleC5pZCgpKTtcbiAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgIG5ld05vZGUuZGF0YSgnbGFiZWwnLCBtYWNyb21vbGVjdWxlTGlzdFtpXSk7XG4gICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJywgdHJ1ZSk7XG4gIH1cbiAgXG4gIGN5LmVuZEJhdGNoKCk7XG5cbiAgdmFyIGxheW91dE5vZGVzID0gY3kubm9kZXMoJ1tqdXN0QWRkZWRMYXlvdXROb2RlXScpO1xuICBsYXlvdXROb2Rlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJyk7XG4gIGxheW91dE5vZGVzLmxheW91dCh7XG4gICAgbmFtZTogJ2Nvc2UtYmlsa2VudCcsXG4gICAgcmFuZG9taXplOiBmYWxzZSxcbiAgICBmaXQ6IGZhbHNlLFxuICAgIGFuaW1hdGU6IGZhbHNlLFxuICAgIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLFxuICAgIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCxcbiAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAvL3JlLXBvc2l0aW9uIHRoZSBub2RlcyBpbnNpZGUgdGhlIGNvbXBsZXhcbiAgICAgIHZhciBzdXBwb3NlZFhQb3NpdGlvbjtcbiAgICAgIHZhciBzdXBwb3NlZFlQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi55O1xuXG4gICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XG4gICAgICAgIHN1cHBvc2VkWFBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIGNvbXBsZXgub3V0ZXJXaWR0aCgpIC8gMjtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBzdXBwb3NlZFhQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBjb21wbGV4Lm91dGVyV2lkdGgoKSAvIDI7XG4gICAgICB9XG5cbiAgICAgIHZhciBwb3NpdGlvbkRpZmZYID0gc3VwcG9zZWRYUG9zaXRpb24gLSBjb21wbGV4LnBvc2l0aW9uKCd4Jyk7XG4gICAgICB2YXIgcG9zaXRpb25EaWZmWSA9IHN1cHBvc2VkWVBvc2l0aW9uIC0gY29tcGxleC5wb3NpdGlvbigneScpO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5tb3ZlTm9kZXMoe3g6IHBvc2l0aW9uRGlmZlgsIHk6IHBvc2l0aW9uRGlmZll9LCBjb21wbGV4KTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vZmlsdGVyIHRoZSBqdXN0IGFkZGVkIGVsZW1lbXRzIHRvIHJldHVybiB0aGVtIGFuZCByZW1vdmUganVzdCBhZGRlZCBtYXJrXG4gIHZhciBlbGVzID0gY3kuZWxlbWVudHMoJ1tqdXN0QWRkZWRdJyk7XG4gIGVsZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkJyk7XG4gIFxuICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xuICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gIGVsZXMuc2VsZWN0KCk7XG4gIFxuICByZXR1cm4gZWxlczsgLy8gUmV0dXJuIHRoZSBqdXN0IGFkZGVkIGVsZW1lbnRzXG59O1xuXG4vKlxuICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50ID0gZnVuY3Rpb24obm9kZXMsIG5ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XG4gIHZhciBuZXdQYXJlbnRJZCA9IHR5cGVvZiBuZXdQYXJlbnQgPT09ICdzdHJpbmcnID8gbmV3UGFyZW50IDogbmV3UGFyZW50LmlkKCk7XG4gIG5vZGVzLm1vdmUoe1wicGFyZW50XCI6IG5ld1BhcmVudElkfSk7XG4gIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NEaWZmWCwgeTogcG9zRGlmZll9LCBub2Rlcyk7XG59O1xuXG4vLyBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuXG5lbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgcmF0aW8gPSB1bmRlZmluZWQ7XG4gICAgdmFyIGVsZU11c3RCZVNxdWFyZSA9IGVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlKG5vZGUuZGF0YSgnY2xhc3MnKSk7XG5cbiAgICAvLyBOb3RlIHRoYXQgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0IGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeVxuICAgIGlmICh3aWR0aCkge1xuICAgICAgaWYgKHVzZUFzcGVjdFJhdGlvIHx8IGVsZU11c3RCZVNxdWFyZSkge1xuICAgICAgICByYXRpbyA9IHdpZHRoIC8gbm9kZS53aWR0aCgpO1xuICAgICAgfVxuXG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSB3aWR0aDtcbiAgICB9XG5cbiAgICBpZiAoaGVpZ2h0KSB7XG4gICAgICBpZiAodXNlQXNwZWN0UmF0aW8gfHwgZWxlTXVzdEJlU3F1YXJlKSB7XG4gICAgICAgIHJhdGlvID0gaGVpZ2h0IC8gbm9kZS5oZWlnaHQoKTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gaGVpZ2h0O1xuICAgIH1cblxuICAgIGlmIChyYXRpbyAmJiAhaGVpZ2h0KSB7XG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBub2RlLmhlaWdodCgpICogcmF0aW87XG4gICAgfVxuICAgIGVsc2UgaWYgKHJhdGlvICYmICF3aWR0aCkge1xuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gbm9kZS53aWR0aCgpICogcmF0aW87XG4gICAgfVxuICB9XG59O1xuXG4vLyBTZWN0aW9uIEVuZFxuLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gQ29tbW9uIGVsZW1lbnQgcHJvcGVydGllc1xuXG4vLyBHZXQgY29tbW9uIHByb3BlcnRpZXMgb2YgZ2l2ZW4gZWxlbWVudHMuIFJldHVybnMgbnVsbCBpZiB0aGUgZ2l2ZW4gZWxlbWVudCBsaXN0IGlzIGVtcHR5IG9yIHRoZVxuLy8gcHJvcGVydHkgaXMgbm90IGNvbW1vbiBmb3IgYWxsIGVsZW1lbnRzLiBkYXRhT3JDc3MgcGFyYW1ldGVyIHNwZWNpZnkgd2hldGhlciB0byBjaGVjayB0aGUgcHJvcGVydHkgb24gZGF0YSBvciBjc3MuXG4vLyBUaGUgZGVmYXVsdCB2YWx1ZSBmb3IgaXQgaXMgZGF0YS4gSWYgcHJvcGVydHlOYW1lIHBhcmFtZXRlciBpcyBnaXZlbiBhcyBhIGZ1bmN0aW9uIGluc3RlYWQgb2YgYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBcbi8vIHByb3BlcnR5IG5hbWUgdGhlbiB1c2Ugd2hhdCB0aGF0IGZ1bmN0aW9uIHJldHVybnMuXG5lbGVtZW50VXRpbGl0aWVzLmdldENvbW1vblByb3BlcnR5ID0gZnVuY3Rpb24gKGVsZW1lbnRzLCBwcm9wZXJ0eU5hbWUsIGRhdGFPckNzcykge1xuICBpZiAoZWxlbWVudHMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBpc0Z1bmN0aW9uO1xuICAvLyBJZiB3ZSBhcmUgbm90IGNvbXBhcmluZyB0aGUgcHJvcGVydGllcyBkaXJlY3RseSB1c2VycyBjYW4gc3BlY2lmeSBhIGZ1bmN0aW9uIGFzIHdlbGxcbiAgaWYgKHR5cGVvZiBwcm9wZXJ0eU5hbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBpc0Z1bmN0aW9uID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIFVzZSBkYXRhIGFzIGRlZmF1bHRcbiAgaWYgKCFpc0Z1bmN0aW9uICYmICFkYXRhT3JDc3MpIHtcbiAgICBkYXRhT3JDc3MgPSAnZGF0YSc7XG4gIH1cblxuICB2YXIgdmFsdWUgPSBpc0Z1bmN0aW9uID8gcHJvcGVydHlOYW1lKGVsZW1lbnRzWzBdKSA6IGVsZW1lbnRzWzBdW2RhdGFPckNzc10ocHJvcGVydHlOYW1lKTtcblxuICBmb3IgKHZhciBpID0gMTsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCAoIGlzRnVuY3Rpb24gPyBwcm9wZXJ0eU5hbWUoZWxlbWVudHNbaV0pIDogZWxlbWVudHNbaV1bZGF0YU9yQ3NzXShwcm9wZXJ0eU5hbWUpICkgIT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbi8vIFJldHVybnMgaWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgYSB0cnV0aHkgdmFsdWUgZm9yIGFsbCBvZiB0aGUgZ2l2ZW4gZWxlbWVudHMuXG5lbGVtZW50VXRpbGl0aWVzLnRydWVGb3JBbGxFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVtZW50cywgZmNuKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIWZjbihlbGVtZW50c1tpXSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZSBlbGVtZW50IGNhbiBoYXZlIHNiZ25jYXJkaW5hbGl0eVxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkNhcmRpbmFsaXR5ID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICByZXR1cm4gZWxlLmRhdGEoJ2NsYXNzJykgPT0gJ2NvbnN1bXB0aW9uJyB8fCBlbGUuZGF0YSgnY2xhc3MnKSA9PSAncHJvZHVjdGlvbic7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBjYW4gaGF2ZSBzYmdubGFiZWxcbmVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbCA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgcmV0dXJuIHNiZ25jbGFzcyAhPSAnYW5kJyAmJiBzYmduY2xhc3MgIT0gJ29yJyAmJiBzYmduY2xhc3MgIT0gJ25vdCdcbiAgICAgICAgICAmJiBzYmduY2xhc3MgIT0gJ2Fzc29jaWF0aW9uJyAmJiBzYmduY2xhc3MgIT0gJ2Rpc3NvY2lhdGlvbicgJiYgIXNiZ25jbGFzcy5lbmRzV2l0aCgncHJvY2VzcycpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgaGF2ZSB1bml0IG9mIGluZm9ybWF0aW9uXG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVVbml0T2ZJbmZvcm1hdGlvbiA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgaWYgKHNiZ25jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZScgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXgnIHx8IHNiZ25jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsIG11bHRpbWVyJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZSBtdWx0aW1lcicgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSBtdWx0aW1lcidcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXggbXVsdGltZXInKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgaGF2ZSBzdGF0ZSB2YXJpYWJsZVxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU3RhdGVWYXJpYWJsZSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgaWYgKHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZScgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXgnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlIG11bHRpbWVyJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCBtdWx0aW1lcicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZSBzaG91bGQgYmUgc3F1YXJlIGluIHNoYXBlXG5lbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgcmV0dXJuIChzYmduY2xhc3MuaW5kZXhPZigncHJvY2VzcycpICE9IC0xIHx8IHNiZ25jbGFzcyA9PSAnc291cmNlIGFuZCBzaW5rJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYW5kJyB8fCBzYmduY2xhc3MgPT0gJ29yJyB8fCBzYmduY2xhc3MgPT0gJ25vdCdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2Fzc29jaWF0aW9uJyB8fCBzYmduY2xhc3MgPT0gJ2Rpc3NvY2lhdGlvbicpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIGFueSBvZiB0aGUgZ2l2ZW4gbm9kZXMgbXVzdCBub3QgYmUgaW4gc3F1YXJlIHNoYXBlXG5lbGVtZW50VXRpbGl0aWVzLnNvbWVNdXN0Tm90QmVTcXVhcmUgPSBmdW5jdGlvbiAobm9kZXMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZShub2RlLmRhdGEoJ2NsYXNzJykpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVzIGVsZW1lbnQgY2FuIGJlIGNsb25lZFxuZWxlbWVudFV0aWxpdGllcy5jYW5CZUNsb25lZCA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuXG4gIHZhciBsaXN0ID0ge1xuICAgICd1bnNwZWNpZmllZCBlbnRpdHknOiB0cnVlLFxuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcbiAgICAnY29tcGxleCc6IHRydWUsXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcbiAgICAncGVydHVyYmluZyBhZ2VudCc6IHRydWVcbiAgfTtcblxuICByZXR1cm4gbGlzdFtzYmduY2xhc3NdID8gdHJ1ZSA6IGZhbHNlO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlcyBlbGVtZW50IGNhbiBiZSBjbG9uZWRcbmVsZW1lbnRVdGlsaXRpZXMuY2FuQmVNdWx0aW1lciA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuXG4gIHZhciBsaXN0ID0ge1xuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcbiAgICAnY29tcGxleCc6IHRydWUsXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZVxuICB9O1xuXG4gIHJldHVybiBsaXN0W3NiZ25jbGFzc10gPyB0cnVlIDogZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgaXMgYW4gRVBOXG5lbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcblxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAndW5zcGVjaWZpZWQgZW50aXR5J1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZSdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCcpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGVtZW50IGlzIGEgUE5cbmVsZW1lbnRVdGlsaXRpZXMuaXNQTkNsYXNzID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XG5cbiAgcmV0dXJuIChzYmduY2xhc3MgPT0gJ3Byb2Nlc3MnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdvbWl0dGVkIHByb2Nlc3MnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICd1bmNlcnRhaW4gcHJvY2VzcydcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2Fzc29jaWF0aW9uJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnZGlzc29jaWF0aW9uJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAncGhlbm90eXBlJyk7XG59O1xuXG4vLyBSZXR1cm5zIHdldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBvciBzdHJpbmcgaXMgb2YgdGhlIHNwZWNpYWwgZW1wdHkgc2V0L3NvdXJjZSBhbmQgc2luayBjbGFzc1xuZWxlbWVudFV0aWxpdGllcy5pc0VtcHR5U2V0Q2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcbiAgcmV0dXJuIHNiZ25jbGFzcyA9PSAnc291cmNlIGFuZCBzaW5rJztcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhIGxvZ2ljYWwgb3BlcmF0b3JcbmVsZW1lbnRVdGlsaXRpZXMuaXNMb2dpY2FsT3BlcmF0b3IgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAnYW5kJyB8fCBzYmduY2xhc3MgPT0gJ29yJyB8fCBzYmduY2xhc3MgPT0gJ25vdCcpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBjbGFzcyBvZiBnaXZlbiBlbGVtZW50IGlzIGEgZXF1aXZhbGFuY2UgY2xhc3NcbmVsZW1lbnRVdGlsaXRpZXMuY29udmVuaWVudFRvRXF1aXZhbGVuY2UgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAndGFnJyB8fCBzYmduY2xhc3MgPT0gJ3Rlcm1pbmFsJyk7XG59O1xuXG4vLyBSZXR1cm5zIHdldGhlciB0aGUgY2xhc3Mgb2YgZ2l2ZW4gZWxlbW50IGlzIGEgbW9kdWxhdGlvbiBhcmMgYXMgZGVmaW5lZCBpbiBQRCBzcGVjc1xuZWxlbWVudFV0aWxpdGllcy5pc01vZHVsYXRpb25BcmNDbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG4gIHJldHVybiAoc2JnbmNsYXNzID09ICdtb2R1bGF0aW9uJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnc3RpbXVsYXRpb24nIHx8IHNiZ25jbGFzcyA9PSAnY2F0YWx5c2lzJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnaW5oaWJpdGlvbicgfHwgc2JnbmNsYXNzID09ICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKTtcbn1cblxuLy8gUmVsb2NhdGVzIHN0YXRlIGFuZCBpbmZvIGJveGVzLiBUaGlzIGZ1bmN0aW9uIGlzIGV4cGVjdGVkIHRvIGJlIGNhbGxlZCBhZnRlciBhZGQvcmVtb3ZlIHN0YXRlIGFuZCBpbmZvIGJveGVzXG5lbGVtZW50VXRpbGl0aWVzLnJlbG9jYXRlU3RhdGVBbmRJbmZvcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHN0YXRlQW5kSW5mb3MgPSAoZWxlLmlzTm9kZSAmJiBlbGUuaXNOb2RlKCkpID8gZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykgOiBlbGU7XG4gIHZhciBsZW5ndGggPSBzdGF0ZUFuZEluZm9zLmxlbmd0aDtcbiAgaWYgKGxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVsc2UgaWYgKGxlbmd0aCA9PSAxKSB7XG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAwO1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuICB9XG4gIGVsc2UgaWYgKGxlbmd0aCA9PSAyKSB7XG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAwO1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAwO1xuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC55ID0gNTA7XG4gIH1cbiAgZWxzZSBpZiAobGVuZ3RoID09IDMpIHtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IC0yNTtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcblxuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSAtNTA7XG5cbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IDA7XG4gICAgc3RhdGVBbmRJbmZvc1syXS5iYm94LnkgPSA1MDtcbiAgfVxuICBlbHNlIHtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IC0yNTtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcblxuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSAtNTA7XG5cbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IC0yNTtcbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xuXG4gICAgc3RhdGVBbmRJbmZvc1szXS5iYm94LnggPSAyNTtcbiAgICBzdGF0ZUFuZEluZm9zWzNdLmJib3gueSA9IDUwO1xuICB9XG59O1xuXG4vLyBDaGFuZ2Ugc3RhdGUgdmFsdWUgb3IgdW5pdCBvZiBpbmZvcm1hdGlvbiBib3ggb2YgZ2l2ZW4gbm9kZXMgd2l0aCBnaXZlbiBpbmRleC5cbi8vIFR5cGUgcGFyYW1ldGVyIGluZGljYXRlcyB3aGV0aGVyIHRvIGNoYW5nZSB2YWx1ZSBvciB2YXJpYWJsZSwgaXQgaXMgdmFsaWQgaWYgdGhlIGJveCBhdCB0aGUgZ2l2ZW4gaW5kZXggaXMgYSBzdGF0ZSB2YXJpYWJsZS5cbi8vIFZhbHVlIHBhcmFtZXRlciBpcyB0aGUgbmV3IHZhbHVlIHRvIHNldC5cbi8vIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIG9sZCB2YWx1ZSBvZiB0aGUgY2hhbmdlZCBkYXRhIChXZSBhc3N1bWUgdGhhdCB0aGUgb2xkIHZhbHVlIG9mIHRoZSBjaGFuZ2VkIGRhdGEgd2FzIHRoZSBzYW1lIGZvciBhbGwgbm9kZXMpLlxuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XG4gIHZhciByZXN1bHQ7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xuICAgIHZhciBib3ggPSBzdGF0ZUFuZEluZm9zW2luZGV4XTtcblxuICAgIGlmIChib3guY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7XG4gICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICByZXN1bHQgPSBib3guc3RhdGVbdHlwZV07XG4gICAgICB9XG5cbiAgICAgIGJveC5zdGF0ZVt0eXBlXSA9IHZhbHVlO1xuICAgIH1cbiAgICBlbHNlIGlmIChib3guY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdCA9IGJveC5sYWJlbC50ZXh0O1xuICAgICAgfVxuXG4gICAgICBib3gubGFiZWwudGV4dCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXG4vLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxuLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGp1c3QgYWRkZWQgYm94LlxuZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2Rlcywgb2JqKSB7XG4gIHZhciBpbmRleDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XG4gICAgXG4gICAgLy8gQ2xvbmUgdGhlIG9iamVjdCB0byBhdm9pZCByZWZlcmVuY2luZyBpc3N1ZXNcbiAgICB2YXIgY2xvbmUgPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBvYmopO1xuICAgIFxuICAgIHN0YXRlQW5kSW5mb3MucHVzaChjbG9uZSk7XG4gICAgaW5kZXggPSBzdGF0ZUFuZEluZm9zLmxlbmd0aCAtIDE7XG4gICAgdGhpcy5yZWxvY2F0ZVN0YXRlQW5kSW5mb3Moc3RhdGVBbmRJbmZvcyk7IC8vIFJlbG9jYXRlIHN0YXRlIGFuZCBpbmZvc1xuICB9XG5cbiAgcmV0dXJuIGluZGV4O1xufTtcblxuLy8gUmVtb3ZlIHRoZSBzdGF0ZSBvciBpbmZvIGJveGVzIG9mIHRoZSBnaXZlbiBub2RlcyBhdCBnaXZlbiBpbmRleC5cbi8vIFJldHVybnMgdGhlIHJlbW92ZWQgYm94LlxuZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2RlcywgaW5kZXgpIHtcbiAgdmFyIG9iajtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgIG9iaiA9IHN0YXRlQW5kSW5mb3NbaW5kZXhdO1xuICAgIH1cbiAgICBzdGF0ZUFuZEluZm9zLnNwbGljZShpbmRleCwgMSk7IC8vIFJlbW92ZSB0aGUgYm94XG4gICAgdGhpcy5yZWxvY2F0ZVN0YXRlQW5kSW5mb3Moc3RhdGVBbmRJbmZvcyk7IC8vIFJlbG9jYXRlIHN0YXRlIGFuZCBpbmZvc1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cbi8vIFNldCBtdWx0aW1lciBzdGF0dXMgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXG5lbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24gKG5vZGVzLCBzdGF0dXMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIHNiZ25jbGFzcyA9IG5vZGUuZGF0YSgnY2xhc3MnKTtcbiAgICB2YXIgaXNNdWx0aW1lciA9IG5vZGUuZGF0YSgnY2xhc3MnKS5lbmRzV2l0aCgnIG11bHRpbWVyJyk7XG5cbiAgICBpZiAoc3RhdHVzKSB7IC8vIE1ha2UgbXVsdGltZXIgc3RhdHVzIHRydWVcbiAgICAgIGlmICghaXNNdWx0aW1lcikge1xuICAgICAgICBub2RlLmRhdGEoJ2NsYXNzJywgc2JnbmNsYXNzICsgJyBtdWx0aW1lcicpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHsgLy8gTWFrZSBtdWx0aW1lciBzdGF0dXMgZmFsc2VcbiAgICAgIGlmIChpc011bHRpbWVyKSB7XG4gICAgICAgIG5vZGUuZGF0YSgnY2xhc3MnLCBzYmduY2xhc3MucmVwbGFjZSgnIG11bHRpbWVyJywgJycpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbi8vIFNldCBjbG9uZSBtYXJrZXIgc3RhdHVzIG9mIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXG5lbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24gKG5vZGVzLCBzdGF0dXMpIHtcbiAgaWYgKHN0YXR1cykge1xuICAgIG5vZGVzLmRhdGEoJ2Nsb25lbWFya2VyJywgdHJ1ZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgbm9kZXMucmVtb3ZlRGF0YSgnY2xvbmVtYXJrZXInKTtcbiAgfVxufTtcblxuLy9lbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24oKVxuXG4vLyBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBlbGVtZW50cyB3aXRoIGdpdmVuIGZvbnQgZGF0YVxuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uIChlbGVzLCBkYXRhKSB7XG4gIGZvciAodmFyIHByb3AgaW4gZGF0YSkge1xuICAgIGVsZXMuZGF0YShwcm9wLCBkYXRhW3Byb3BdKTtcbiAgfVxufTtcblxuLy8gVGhpcyBmdW5jdGlvbiBnZXRzIGFuIGVkZ2UsIGFuZCBlbmRzIG9mIHRoYXQgZWRnZSAoT3B0aW9uYWxseSBpdCBtYXkgdGFrZSBqdXN0IHRoZSBjbGFzc2VzIG9mIHRoZXNlIGVsZW1lbnRzIGFzIHdlbGwpIGFzIHBhcmFtZXRlcnMuXG4vLyBJdCBtYXkgcmV0dXJuICd2YWxpZCcgKHRoYXQgZW5kcyBpcyB2YWxpZCBmb3IgdGhhdCBlZGdlKSwgJ3JldmVyc2UnICh0aGF0IGVuZHMgaXMgbm90IHZhbGlkIGZvciB0aGF0IGVkZ2UgYnV0IHRoZXkgd291bGQgYmUgdmFsaWQgXG4vLyBpZiB5b3UgcmV2ZXJzZSB0aGUgc291cmNlIGFuZCB0YXJnZXQpLCAnaW52YWxpZCcgKHRoYXQgZW5kcyBhcmUgdG90YWxseSBpbnZhbGlkIGZvciB0aGF0IGVkZ2UpLlxuZWxlbWVudFV0aWxpdGllcy52YWxpZGF0ZUFycm93RW5kcyA9IGZ1bmN0aW9uIChlZGdlLCBzb3VyY2UsIHRhcmdldCkge1xuICB2YXIgZWRnZWNsYXNzID0gdHlwZW9mIGVkZ2UgPT09ICdzdHJpbmcnID8gZWRnZSA6IGVkZ2UuZGF0YSgnY2xhc3MnKTtcbiAgLy8gVE9ETyBpcyBpdCBuZWNlc3NhcnkgdG8gYWNjZXB0IHN0cmluZ3MgPyBiZXR0ZXIgdG8gYWx3YXlzIGhhdmUgdGhlIGVsZW1lbnRzIGZvciBzb3VyY2UgYW5kIHRhcmdldC5cbiAgLy8gVGhlIGRheSB3ZSBuZWVkIHRvIGNoZWNrIG90aGVyIHJ1bGVzIHdlIHdpbGwgbmVlZCB0byBhY2Nlc3Mgc29tZSBwcm9wZXJ0aWVzIG9mIGVhY2ggZWxlbWVudC5cbiAgdmFyIHNvdXJjZWNsYXNzID0gdHlwZW9mIHNvdXJjZSA9PT0gJ3N0cmluZycgPyBzb3VyY2UgOiBzb3VyY2UuZGF0YSgnY2xhc3MnKTtcbiAgdmFyIHRhcmdldGNsYXNzID0gdHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycgPyB0YXJnZXQgOiB0YXJnZXQuZGF0YSgnY2xhc3MnKTtcblxuICBpZiAodGhpcy5pc01vZHVsYXRpb25BcmNDbGFzcyhlZGdlY2xhc3MpKXtcbiAgICAvKlxuICAgICAqIENhc2Ugb2YgdGhlIG91dHB1dCBhcmMgb2YgYSBsb2dpYyBvcGVyYXRvciwgd2hpY2ggY2FuIGJlIGFueSBtb2R1bGF0aW9uIGFyYyB0eXBlLlxuICAgICAqIEhhcyB0byBnbyBmcm9tIGxvZ2ljIG9wZXJhdG9yIHRvIFBOIGNsYXNzLlxuICAgICAqIFBEMzcgc2F5cyB0aGVyZSBzaG91bGQgYmUgb25seSAxLCBub3QgZW5mb3JjZWQgZm9yIG5vdywgcnVsZXMgYXJlIGxlZnQgY29tbWVudGVkLlxuICAgICAqL1xuICAgIHZhbGlkID0gdHJ1ZTtcbiAgICByZXZlcnNlID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuaXNMb2dpY2FsT3BlcmF0b3Ioc291cmNlY2xhc3MpIHx8IHRoaXMuaXNMb2dpY2FsT3BlcmF0b3IodGFyZ2V0Y2xhc3MpKXsgLy8gYSBsb2dpYyBvcGVyYXRvciBpcyBpbnZvbHZlZFxuICAgICAgaWYgKCF0aGlzLmlzTG9naWNhbE9wZXJhdG9yKHNvdXJjZWNsYXNzKSB8fCAhdGhpcy5pc1BOQ2xhc3ModGFyZ2V0Y2xhc3MpKXsgLy8gZGlmZmVyZW50IGZyb20gdGhlIGlkZWFsIGNhc2Ugb2YgbG9naWMgLT4gcHJvY2Vzc1xuICAgICAgICBpZiAodGhpcy5pc1BOQ2xhc3Moc291cmNlY2xhc3MpICYmIHRoaXMuaXNMb2dpY2FsT3BlcmF0b3IodGFyZ2V0Y2xhc3MpKXtcbiAgICAgICAgICByZXZlcnNlID0gdHJ1ZTtcbiAgICAgICAgICAvKmlmICh0YXJnZXQub3V0Z29lcnMoJ2VkZ2UnKS5zaXplKCkgIT0gMCl7IC8vIG9ubHkgMSBvdXRnb2luZyBlZGdlIGFsbG93ZWQgKFBEMzcpXG4gICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgIH0qL1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8qZWxzZSBpZiAoc291cmNlLm91dGdvZXJzKCdlZGdlJykuc2l6ZSgpICE9IDApeyAvLyBvbmx5IDEgb3V0Z29pbmcgZWRnZSBhbGxvd2VkIChQRDM3KVxuICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgfSovXG5cbiAgICAgIGlmICh2YWxpZCl7XG4gICAgICAgIHJldHVybiByZXZlcnNlID8gJ3JldmVyc2UnIDogJ3ZhbGlkJztcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGVkZ2VjbGFzcyA9PSAnY29uc3VtcHRpb24nIHx8IHRoaXMuaXNNb2R1bGF0aW9uQXJjQ2xhc3MoZWRnZWNsYXNzKSkge1xuICAgIGlmICh0aGlzLmlzRW1wdHlTZXRDbGFzcyhzb3VyY2VjbGFzcykgfHwgdGhpcy5pc0VtcHR5U2V0Q2xhc3ModGFyZ2V0Y2xhc3MpKXsgLy8gY2FzZSBvZiBFbXB0eVNldCBpbiBvbmUgb2YgdGhlIDJcbiAgICAgIC8vIGZvbGxvd2luZyBibG9jayBpcyB0aGUgc2FtZSBhcyB0aGUgJ2Vsc2UgaWYnIGJlbG93LCB3aXRoIGlzRVBOQ2xhc3MgcmVwbGFjZWQgYnkgaXNFbXB0eVNldENsYXNzXG4gICAgICBpZiAoIXRoaXMuaXNFbXB0eVNldENsYXNzKHNvdXJjZWNsYXNzKSB8fCAhdGhpcy5pc1BOQ2xhc3ModGFyZ2V0Y2xhc3MpKXtcbiAgICAgICAgaWYgKHRoaXMuaXNQTkNsYXNzKHNvdXJjZWNsYXNzKSAmJiB0aGlzLmlzRW1wdHlTZXRDbGFzcyh0YXJnZXRjbGFzcykpIHtcbiAgICAgICAgICAvL0lmIGp1c3QgdGhlIGRpcmVjdGlvbiBpcyBub3QgdmFsaWQgcmV2ZXJzZSB0aGUgZGlyZWN0aW9uXG4gICAgICAgICAgcmV0dXJuICdyZXZlcnNlJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJ2ludmFsaWQnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKCF0aGlzLmlzRVBOQ2xhc3Moc291cmNlY2xhc3MpIHx8ICF0aGlzLmlzUE5DbGFzcyh0YXJnZXRjbGFzcykpIHtcbiAgICAgIGlmICh0aGlzLmlzUE5DbGFzcyhzb3VyY2VjbGFzcykgJiYgdGhpcy5pc0VQTkNsYXNzKHRhcmdldGNsYXNzKSkge1xuICAgICAgICAvL0lmIGp1c3QgdGhlIGRpcmVjdGlvbiBpcyBub3QgdmFsaWQgcmV2ZXJzZSB0aGUgZGlyZWN0aW9uXG4gICAgICAgIHJldHVybiAncmV2ZXJzZSc7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuICdpbnZhbGlkJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAoZWRnZWNsYXNzID09ICdwcm9kdWN0aW9uJykge1xuICAgIGlmICh0aGlzLmlzRW1wdHlTZXRDbGFzcyhzb3VyY2VjbGFzcykgfHwgdGhpcy5pc0VtcHR5U2V0Q2xhc3ModGFyZ2V0Y2xhc3MpKXsgLy8gY2FzZSBvZiBFbXB0eVNldCBpbiBvbmUgb2YgdGhlIDJcbiAgICAgIC8vIGZvbGxvd2luZyBibG9jayBpcyB0aGUgc2FtZSBhcyB0aGUgJ2Vsc2UgaWYnIGJlbG93LCB3aXRoIGlzRVBOQ2xhc3MgcmVwbGFjZWQgYnkgaXNFbXB0eVNldENsYXNzXG4gICAgICBpZiAoIXRoaXMuaXNQTkNsYXNzKHNvdXJjZWNsYXNzKSB8fCAhdGhpcy5pc0VtcHR5U2V0Q2xhc3ModGFyZ2V0Y2xhc3MpKXtcbiAgICAgICAgaWYgKHRoaXMuaXNFbXB0eVNldENsYXNzKHNvdXJjZWNsYXNzKSAmJiB0aGlzLmlzUE5DbGFzcyh0YXJnZXRjbGFzcykpIHtcbiAgICAgICAgICAvL0lmIGp1c3QgdGhlIGRpcmVjdGlvbiBpcyBub3QgdmFsaWQgcmV2ZXJzZSB0aGUgZGlyZWN0aW9uXG4gICAgICAgICAgcmV0dXJuICdyZXZlcnNlJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJ2ludmFsaWQnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKCF0aGlzLmlzUE5DbGFzcyhzb3VyY2VjbGFzcykgfHwgIXRoaXMuaXNFUE5DbGFzcyh0YXJnZXRjbGFzcykpIHtcbiAgICAgIGlmICh0aGlzLmlzRVBOQ2xhc3Moc291cmNlY2xhc3MpICYmIHRoaXMuaXNQTkNsYXNzKHRhcmdldGNsYXNzKSkge1xuICAgICAgICAvL0lmIGp1c3QgdGhlIGRpcmVjdGlvbiBpcyBub3QgdmFsaWQgcmV2ZXJzZSB0aGUgZGlyZWN0aW9uXG4gICAgICAgIHJldHVybiAncmV2ZXJzZSc7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuICdpbnZhbGlkJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAoZWRnZWNsYXNzID09ICdsb2dpYyBhcmMnKSB7XG4gICAgdmFyIGludmFsaWQgPSBmYWxzZTtcbiAgICBpZiAoIXRoaXMuaXNFUE5DbGFzcyhzb3VyY2VjbGFzcykgfHwgIXRoaXMuaXNMb2dpY2FsT3BlcmF0b3IodGFyZ2V0Y2xhc3MpKSB7XG4gICAgICBpZiAodGhpcy5pc0xvZ2ljYWxPcGVyYXRvcihzb3VyY2VjbGFzcykgJiYgdGhpcy5pc0VQTkNsYXNzKHRhcmdldGNsYXNzKSkge1xuICAgICAgICAvL0lmIGp1c3QgdGhlIGRpcmVjdGlvbiBpcyBub3QgdmFsaWQgcmV2ZXJzZSB0aGUgZGlyZWN0aW9uXG4gICAgICAgIHJldHVybiAncmV2ZXJzZSc7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaW52YWxpZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdGhlIGNhc2UgdGhhdCBib3RoIHNpZGVzIGFyZSBsb2dpY2FsIG9wZXJhdG9ycyBhcmUgdmFsaWQgdG9vXG4gICAgaWYgKHRoaXMuaXNMb2dpY2FsT3BlcmF0b3Ioc291cmNlY2xhc3MpICYmIHRoaXMuaXNMb2dpY2FsT3BlcmF0b3IodGFyZ2V0Y2xhc3MpKSB7XG4gICAgICBpbnZhbGlkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGludmFsaWQpIHtcbiAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKGVkZ2VjbGFzcyA9PSAnZXF1aXZhbGVuY2UgYXJjJykge1xuICAgIGlmICghKHRoaXMuaXNFUE5DbGFzcyhzb3VyY2VjbGFzcykgJiYgdGhpcy5jb252ZW5pZW50VG9FcXVpdmFsZW5jZSh0YXJnZXRjbGFzcykpXG4gICAgICAgICAgICAmJiAhKHRoaXMuaXNFUE5DbGFzcyh0YXJnZXRjbGFzcykgJiYgdGhpcy5jb252ZW5pZW50VG9FcXVpdmFsZW5jZShzb3VyY2VjbGFzcykpKSB7XG4gICAgICByZXR1cm4gJ2ludmFsaWQnO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAndmFsaWQnO1xufTtcblxuLypcbiAqIFVuaGlkZSBnaXZlbiBlbGVzIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXG4gKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihlbGVzLCBsYXlvdXRwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgZ2l2ZW4gZWxlc1xuICBpZiAodHlwZW9mIGxheW91dHBhcmFtID09PSAnZnVuY3Rpb24nKSB7XG4gICAgbGF5b3V0cGFyYW0oKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgYSBmdW5jdGlvbiBleGVjdXRlIGl0XG4gIH1cbiAgZWxzZSB7XG4gICAgY3kubGF5b3V0KGxheW91dHBhcmFtKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgbGF5b3V0IG9wdGlvbnMgY2FsbCBsYXlvdXQgd2l0aCB0aGF0IG9wdGlvbnMuXG4gIH1cbiAgXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKlxuICogQ2hhbmdlIHN0eWxlL2NzcyBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXG4gKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VDc3MgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICBpZiAoIHR5cGVvZiB2YWx1ZU1hcCA9PT0gJ29iamVjdCcgKSB7XG4gICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XG4gICAgICBlbGUuY3NzKG5hbWUsIHZhbHVlTWFwW2VsZS5pZCgpXSk7IC8vIHZhbHVlTWFwIGlzIGFuIGlkIHRvIHZhbHVlIG1hcCB1c2UgaXQgaW4gdGhpcyB3YXlcbiAgICB9XG4gICAgY3kuZW5kQmF0Y2goKTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVzLmNzcyhuYW1lLCB2YWx1ZU1hcCk7IC8vIHZhbHVlTWFwIGlzIGp1c3QgYSBzdHJpbmcgc2V0IGNzcygnbmFtZScpIGZvciBhbGwgZWxlcyB0byB0aGlzIHZhbHVlXG4gIH1cbn07XG5cbi8qXG4gKiBDaGFuZ2UgZGF0YSBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXG4gKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcbiAgaWYgKCB0eXBlb2YgdmFsdWVNYXAgPT09ICdvYmplY3QnICkge1xuICAgIGN5LnN0YXJ0QmF0Y2goKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuICAgICAgZWxlLmRhdGEobmFtZSwgdmFsdWVNYXBbZWxlLmlkKCldKTsgLy8gdmFsdWVNYXAgaXMgYW4gaWQgdG8gdmFsdWUgbWFwIHVzZSBpdCBpbiB0aGlzIHdheVxuICAgIH1cbiAgICBjeS5lbmRCYXRjaCgpO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZXMuZGF0YShuYW1lLCB2YWx1ZU1hcCk7IC8vIHZhbHVlTWFwIGlzIGp1c3QgYSBzdHJpbmcgc2V0IGNzcygnbmFtZScpIGZvciBhbGwgZWxlcyB0byB0aGlzIHZhbHVlXG4gIH1cbn07XG5cbi8qXG4gKiBSZXR1cm4gdGhlIHNldCBvZiBhbGwgbm9kZXMgcHJlc2VudCB1bmRlciB0aGUgZ2l2ZW4gcG9zaXRpb25cbiAqIHJlbmRlcmVkUG9zIG11c3QgYmUgYSBwb2ludCBkZWZpbmVkIHJlbGF0aXZlbHkgdG8gY3l0b3NjYXBlIGNvbnRhaW5lclxuICogKGxpa2UgcmVuZGVyZWRQb3NpdGlvbiBmaWVsZCBvZiBhIG5vZGUpXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuZ2V0Tm9kZXNBdCA9IGZ1bmN0aW9uKHJlbmRlcmVkUG9zKSB7XG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XG4gIHZhciB4ID0gcmVuZGVyZWRQb3MueDtcbiAgdmFyIHkgPSByZW5kZXJlZFBvcy55O1xuICB2YXIgcmVzdWx0Tm9kZXMgPSBbXTtcbiAgZm9yKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgcmVuZGVyZWRCYm94ID0gbm9kZS5yZW5kZXJlZEJvdW5kaW5nQm94KHtcbiAgICAgIGluY2x1ZGVOb2RlczogdHJ1ZSxcbiAgICAgIGluY2x1ZGVFZGdlczogZmFsc2UsXG4gICAgICBpbmNsdWRlTGFiZWxzOiBmYWxzZSxcbiAgICAgIGluY2x1ZGVTaGFkb3dzOiBmYWxzZVxuICAgIH0pO1xuICAgIGlmICh4ID49IHJlbmRlcmVkQmJveC54MSAmJiB4IDw9IHJlbmRlcmVkQmJveC54Mikge1xuICAgICAgaWYgKHkgPj0gcmVuZGVyZWRCYm94LnkxICYmIHkgPD0gcmVuZGVyZWRCYm94LnkyKSB7XG4gICAgICAgIHJlc3VsdE5vZGVzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHROb2Rlcztcbn07XG5cbmVsZW1lbnRVdGlsaXRpZXMuZGVtdWx0aW1lcml6ZUNsYXNzID0gZnVuY3Rpb24oc2JnbmNsYXNzKSB7XG4gIHJldHVybiBzYmduY2xhc3MucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlbGVtZW50VXRpbGl0aWVzO1xuIiwiLyogXG4gKiBVdGlsaXR5IGZpbGUgdG8gZ2V0IGFuZCBzZXQgdGhlIGxpYnJhcmllcyB0byB3aGljaCBzYmdudml6IGlzIGRlcGVuZGVudCBmcm9tIGFueSBmaWxlLlxuICovXG5cbnZhciBsaWJVdGlsaXRpZXMgPSBmdW5jdGlvbigpe1xufTtcblxubGliVXRpbGl0aWVzLnNldExpYnMgPSBmdW5jdGlvbihsaWJzKSB7XG4gIHRoaXMubGlicyA9IGxpYnM7XG59O1xuXG5saWJVdGlsaXRpZXMuZ2V0TGlicyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5saWJzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBsaWJVdGlsaXRpZXM7IiwidmFyIG9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKS5nZXRPcHRpb25zKCk7XG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcblxuLypcbiAqIFRoZSBtYWluIHV0aWxpdGllcyB0byBiZSBleHBvc2VkIGRpcmVjdGx5LlxuICovXG5mdW5jdGlvbiBtYWluVXRpbGl0aWVzKCkge1xufTtcblxuLypcbiAqIEFkZHMgYSBuZXcgbm9kZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmFkZE5vZGUgPSBmdW5jdGlvbih4LCB5ICwgbm9kZWNsYXNzLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KSB7XG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeCwgeSwgbm9kZWNsYXNzLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBuZXdOb2RlIDoge1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5LFxuICAgICAgICBjbGFzczogbm9kZWNsYXNzLFxuICAgICAgICBpZDogaWQsXG4gICAgICAgIHBhcmVudDogcGFyZW50LFxuICAgICAgICB2aXNpYmlsaXR5OiB2aXNpYmlsaXR5XG4gICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkTm9kZVwiLCBwYXJhbSk7XG4gIH1cbn07XG5cbi8qXG4gKiBBZGRzIGEgbmV3IGVkZ2Ugd2l0aCB0aGUgZ2l2ZW4gY2xhc3MgYW5kIGhhdmluZyB0aGUgZ2l2ZW4gc291cmNlIGFuZCB0YXJnZXQgaWRzLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmFkZEVkZ2UgPSBmdW5jdGlvbihzb3VyY2UsIHRhcmdldCAsIGVkZ2VjbGFzcywgaWQsIHZpc2liaWxpdHkpIHtcbiAgLy8gR2V0IHRoZSB2YWxpZGF0aW9uIHJlc3VsdFxuICB2YXIgdmFsaWRhdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMoZWRnZWNsYXNzLCBjeS5nZXRFbGVtZW50QnlJZChzb3VyY2UpLCBjeS5nZXRFbGVtZW50QnlJZCh0YXJnZXQpKTtcblxuICAvLyBJZiB2YWxpZGF0aW9uIHJlc3VsdCBpcyAnaW52YWxpZCcgY2FuY2VsIHRoZSBvcGVyYXRpb25cbiAgaWYgKHZhbGlkYXRpb24gPT09ICdpbnZhbGlkJykge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgLy8gSWYgdmFsaWRhdGlvbiByZXN1bHQgaXMgJ3JldmVyc2UnIHJldmVyc2UgdGhlIHNvdXJjZS10YXJnZXQgcGFpciBiZWZvcmUgY3JlYXRpbmcgdGhlIGVkZ2VcbiAgaWYgKHZhbGlkYXRpb24gPT09ICdyZXZlcnNlJykge1xuICAgIHZhciB0ZW1wID0gc291cmNlO1xuICAgIHNvdXJjZSA9IHRhcmdldDtcbiAgICB0YXJnZXQgPSB0ZW1wO1xuICB9XG4gICAgICBcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShzb3VyY2UsIHRhcmdldCwgZWRnZWNsYXNzLCBpZCwgdmlzaWJpbGl0eSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgbmV3RWRnZSA6IHtcbiAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICBjbGFzczogZWRnZWNsYXNzLFxuICAgICAgICBpZDogaWQsXG4gICAgICAgIHZpc2liaWxpdHk6IHZpc2liaWxpdHlcbiAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRFZGdlXCIsIHBhcmFtKTtcbiAgfVxufTtcblxuLypcbiAqIEFkZHMgYSBwcm9jZXNzIHdpdGggY29udmVuaWVudCBlZGdlcy4gRm9yIG1vcmUgaW5mb3JtYXRpb24gcGxlYXNlIHNlZSAnaHR0cHM6Ly9naXRodWIuY29tL2lWaXMtYXQtQmlsa2VudC9uZXd0L2lzc3Vlcy85Jy5cbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMgPSBmdW5jdGlvbihfc291cmNlLCBfdGFyZ2V0LCBwcm9jZXNzVHlwZSkge1xuICAvLyBJZiBzb3VyY2UgYW5kIHRhcmdldCBJRHMgYXJlIGdpdmVuIGdldCB0aGUgZWxlbWVudHMgYnkgSURzXG4gIHZhciBzb3VyY2UgPSB0eXBlb2YgX3NvdXJjZSA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfc291cmNlKSA6IF9zb3VyY2U7XG4gIHZhciB0YXJnZXQgPSB0eXBlb2YgX3RhcmdldCA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfdGFyZ2V0KSA6IF90YXJnZXQ7XG4gIFxuICAvLyBJZiBzb3VyY2Ugb3IgdGFyZ2V0IGRvZXMgbm90IGhhdmUgYW4gRVBOIGNsYXNzIHRoZSBvcGVyYXRpb24gaXMgbm90IHZhbGlkXG4gIGlmICghZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKHNvdXJjZSkgfHwgIWVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyh0YXJnZXQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyhfc291cmNlLCBfdGFyZ2V0LCBwcm9jZXNzVHlwZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgc291cmNlOiBfc291cmNlLFxuICAgICAgdGFyZ2V0OiBfdGFyZ2V0LFxuICAgICAgcHJvY2Vzc1R5cGU6IHByb2Nlc3NUeXBlXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXNcIiwgcGFyYW0pO1xuICB9XG59O1xuXG4vKlxuICogQ2xvbmUgZ2l2ZW4gZWxlbWVudHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmNsb25lRWxlbWVudHMgPSBmdW5jdGlvbiAoZWxlcykge1xuICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIHZhciBjYiA9IGN5LmNsaXBib2FyZCgpO1xuICB2YXIgX2lkID0gY2IuY29weShlbGVzLCBcImNsb25lT3BlcmF0aW9uXCIpO1xuXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInBhc3RlXCIsIHtpZDogX2lkfSk7XG4gIH0gXG4gIGVsc2Uge1xuICAgIGNiLnBhc3RlKF9pZCk7XG4gIH1cbn07XG5cbi8qXG4gKiBDb3B5IGdpdmVuIGVsZW1lbnRzIHRvIGNsaXBib2FyZC4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuY29weUVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZXMpIHtcbiAgY3kuY2xpcGJvYXJkKCkuY29weShlbGVzKTtcbn07XG5cbi8qXG4gKiBQYXN0IHRoZSBlbGVtZW50cyBjb3BpZWQgdG8gY2xpcGJvYXJkLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cbiAqL1xubWFpblV0aWxpdGllcy5wYXN0ZUVsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInBhc3RlXCIpO1xuICB9IFxuICBlbHNlIHtcbiAgICBjeS5jbGlwYm9hcmQoKS5wYXN0ZSgpO1xuICB9XG59O1xuXG4vKlxuICogQWxpZ25zIGdpdmVuIG5vZGVzIGluIGdpdmVuIGhvcml6b250YWwgYW5kIHZlcnRpY2FsIG9yZGVyLiBcbiAqIEhvcml6b250YWwgYW5kIHZlcnRpY2FsIHBhcmFtZXRlcnMgbWF5IGJlICdub25lJyBvciB1bmRlZmluZWQuXG4gKiBhbGlnblRvIHBhcmFtZXRlciBpbmRpY2F0ZXMgdGhlIGxlYWRpbmcgbm9kZS5cbiAqIFJlcXVyaXJlcyBjeXRvc2NhcGUtZ3JpZC1ndWlkZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuYWxpZ24gPSBmdW5jdGlvbiAobm9kZXMsIGhvcml6b250YWwsIHZlcnRpY2FsLCBhbGlnblRvKSB7XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImFsaWduXCIsIHtcbiAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgIGhvcml6b250YWw6IGhvcml6b250YWwsXG4gICAgICB2ZXJ0aWNhbDogdmVydGljYWwsXG4gICAgICBhbGlnblRvOiBhbGlnblRvXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbm9kZXMuYWxpZ24oaG9yaXpvbnRhbCwgdmVydGljYWwsIGFsaWduVG8pO1xuICB9XG59O1xuXG4vKlxuICogQ3JlYXRlIGNvbXBvdW5kIGZvciBnaXZlbiBub2Rlcy4gY29tcG91bmRUeXBlIG1heSBiZSAnY29tcGxleCcgb3IgJ2NvbXBhcnRtZW50Jy5cbiAqIFRoaXMgbWV0aG9kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKF9ub2RlcywgY29tcG91bmRUeXBlKSB7XG4gIHZhciBub2RlcyA9IF9ub2RlcztcbiAgLypcbiAgICogRWxlbWluYXRlIHRoZSBub2RlcyB3aGljaCBjYW5ub3QgaGF2ZSBhIHBhcmVudCB3aXRoIGdpdmVuIGNvbXBvdW5kIHR5cGVcbiAgICovXG4gIG5vZGVzID0gX25vZGVzLmZpbHRlcihmdW5jdGlvbiAoaSwgZWxlbWVudCkge1xuICAgIHZhciBzYmduY2xhc3MgPSBlbGVtZW50LmRhdGEoXCJjbGFzc1wiKTtcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc1ZhbGlkUGFyZW50KHNiZ25jbGFzcywgY29tcG91bmRUeXBlKTtcbiAgfSk7XG4gIFxuICBub2RlcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcblxuICAvLyBBbGwgZWxlbWVudHMgc2hvdWxkIGhhdmUgdGhlIHNhbWUgcGFyZW50IGFuZCB0aGUgY29tbW9uIHBhcmVudCBzaG91bGQgbm90IGJlIGEgJ2NvbXBsZXgnIFxuICAvLyBpZiBjb21wb3VuZFR5cGUgaXMgJ2NvbXBhcnRlbnQnXG4gIC8vIGJlY2F1c2UgdGhlIG9sZCBjb21tb24gcGFyZW50IHdpbGwgYmUgdGhlIHBhcmVudCBvZiB0aGUgbmV3IGNvbXBhcnRtZW50IGFmdGVyIHRoaXMgb3BlcmF0aW9uIGFuZFxuICAvLyAnY29tcGxleGVzJyBjYW5ub3QgaW5jbHVkZSAnY29tcGFydG1lbnRzJ1xuICBpZiAobm9kZXMubGVuZ3RoID09IDAgfHwgIWVsZW1lbnRVdGlsaXRpZXMuYWxsSGF2ZVRoZVNhbWVQYXJlbnQobm9kZXMpXG4gICAgICAgICAgfHwgKCBjb21wb3VuZFR5cGUgPT09ICdjb21wYXJ0bWVudCcgJiYgbm9kZXMucGFyZW50KCkuZGF0YSgnY2xhc3MnKSA9PT0gJ2NvbXBsZXgnICkgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAoY3kudW5kb1JlZG8oKSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGNvbXBvdW5kVHlwZTogY29tcG91bmRUeXBlLFxuICAgICAgbm9kZXNUb01ha2VDb21wb3VuZDogbm9kZXNcbiAgICB9O1xuXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlc1wiLCBwYXJhbSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMobm9kZXMsIGNvbXBvdW5kVHlwZSk7XG4gIH1cbn07XG5cbi8qXG4gKiBNb3ZlIHRoZSBub2RlcyB0byBhIG5ldyBwYXJlbnQgYW5kIGNoYW5nZSB0aGVpciBwb3NpdGlvbiBpZiBwb3NzRGlmZiBwYXJhbXMgYXJlIHNldC5cbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24gYW5kIGNoZWNrcyBpZiB0aGUgb3BlcmF0aW9uIGlzIHZhbGlkLlxuICovXG5tYWluVXRpbGl0aWVzLmNoYW5nZVBhcmVudCA9IGZ1bmN0aW9uKG5vZGVzLCBfbmV3UGFyZW50LCBwb3NEaWZmWCwgcG9zRGlmZlkpIHtcbiAgdmFyIG5ld1BhcmVudCA9IHR5cGVvZiBfbmV3UGFyZW50ID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9uZXdQYXJlbnQpIDogX25ld1BhcmVudDtcbiAgLy8gTmV3IHBhcmVudCBpcyBzdXBwb3NlZCB0byBiZSBvbmUgb2YgdGhlIHJvb3QsIGEgY29tcGxleCBvciBhIGNvbXBhcnRtZW50XG4gIGlmIChuZXdQYXJlbnQgJiYgbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKSAhPSBcImNvbXBsZXhcIiAmJiBuZXdQYXJlbnQuZGF0YShcImNsYXNzXCIpICE9IFwiY29tcGFydG1lbnRcIikge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgLypcbiAgICogRWxlbWluYXRlIHRoZSBub2RlcyB3aGljaCBjYW5ub3QgaGF2ZSB0aGUgbmV3UGFyZW50IGFzIHRoZWlyIHBhcmVudFxuICAgKi9cbiAgbm9kZXMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGksIGVsZW1lbnQpIHtcbiAgICB2YXIgc2JnbmNsYXNzID0gZWxlbWVudC5kYXRhKFwiY2xhc3NcIik7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNWYWxpZFBhcmVudChzYmduY2xhc3MsIG5ld1BhcmVudCk7XG4gIH0pO1xuICBcbiAgLy8gRGlzY2FyZCB0aGUgbm9kZXMgd2hvc2UgcGFyZW50IGlzIGFscmVhZHkgbmV3UGFyZW50XG4gIG5vZGVzID0gbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChpLCBlbGUpIHtcbiAgICBpZiAoIW5ld1BhcmVudCkge1xuICAgICAgcmV0dXJuIGVsZS5kYXRhKCdwYXJlbnQnKSAhPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gZWxlLmRhdGEoJ3BhcmVudCcpICE9PSBuZXdQYXJlbnQuaWQoKTtcbiAgfSk7XG5cbiAgLy8gSWYgc29tZSBub2RlcyBhcmUgYW5jZXN0b3Igb2YgbmV3IHBhcmVudCBlbGVtaW5hdGUgdGhlbVxuICBpZiAobmV3UGFyZW50KSB7XG4gICAgbm9kZXMgPSBub2Rlcy5kaWZmZXJlbmNlKG5ld1BhcmVudC5hbmNlc3RvcnMoKSk7XG4gIH1cblxuICAvLyBJZiBhbGwgbm9kZXMgYXJlIGVsZW1pbmF0ZWQgcmV0dXJuIGRpcmVjdGx5XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBKdXN0IG1vdmUgdGhlIHRvcCBtb3N0IG5vZGVzXG4gIG5vZGVzID0gZWxlbWVudFV0aWxpdGllcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xuICBcbiAgdmFyIHBhcmVudElkID0gbmV3UGFyZW50ID8gbmV3UGFyZW50LmlkKCkgOiBudWxsO1xuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBmaXJzdFRpbWU6IHRydWUsXG4gICAgICBwYXJlbnREYXRhOiBwYXJlbnRJZCwgLy8gSXQga2VlcHMgdGhlIG5ld1BhcmVudElkIChKdXN0IGFuIGlkIGZvciBlYWNoIG5vZGVzIGZvciB0aGUgZmlyc3QgdGltZSlcbiAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgIHBvc0RpZmZYOiBwb3NEaWZmWCxcbiAgICAgIHBvc0RpZmZZOiBwb3NEaWZmWVxuICAgIH07XG5cbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlUGFyZW50XCIsIHBhcmFtKTsgLy8gVGhpcyBhY3Rpb24gaXMgcmVnaXN0ZXJlZCBieSB1bmRvUmVkbyBleHRlbnNpb25cbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVBhcmVudChub2RlcywgcGFyZW50SWQsIHBvc0RpZmZYLCBwb3NEaWZmWSk7XG4gIH1cbn07XG5cbi8qXG4gKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcbiAqIGluIHRoZSBjb21wbGV4LiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgdGhlIHNhbWUgZnVuY3Rpb24gaW4gZWxlbWVudFV0aWxpdGllc1xuICovXG5tYWluVXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAodGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCkge1xuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24odGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgdGVtcGxhdGVUeXBlOiB0ZW1wbGF0ZVR5cGUsXG4gICAgICBtYWNyb21vbGVjdWxlTGlzdDogbWFjcm9tb2xlY3VsZUxpc3QsXG4gICAgICBjb21wbGV4TmFtZTogY29tcGxleE5hbWUsXG4gICAgICBwcm9jZXNzUG9zaXRpb246IHByb2Nlc3NQb3NpdGlvbixcbiAgICAgIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLFxuICAgICAgdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLFxuICAgICAgZWRnZUxlbmd0aDogZWRnZUxlbmd0aFxuICAgIH07XG4gICAgXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZVRlbXBsYXRlUmVhY3Rpb25cIiwgcGFyYW0pO1xuICB9XG59O1xuXG4vKlxuICogUmVzaXplIGdpdmVuIG5vZGVzIGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeSBvbmUgb2Ygd2lkdGggb3IgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0LiBcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMucmVzaXplTm9kZXMgPSBmdW5jdGlvbihub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8pIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBub2Rlczogbm9kZXMsXG4gICAgICB3aWR0aDogd2lkdGgsXG4gICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgIHVzZUFzcGVjdFJhdGlvOiB1c2VBc3BlY3RSYXRpbyxcbiAgICAgIHBlcmZvcm1PcGVyYXRpb246IHRydWVcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZXNpemVOb2Rlc1wiLCBwYXJhbSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2Rlcyhub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8pO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLypcbiAqIENoYW5nZXMgdGhlIGxhYmVsIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gbGFiZWwuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuY2hhbmdlTm9kZUxhYmVsID0gZnVuY3Rpb24obm9kZXMsIGxhYmVsKSB7XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIG5vZGVzLmRhdGEoJ2xhYmVsJywgbGFiZWwpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgIH07XG4gICAgXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZU5vZGVMYWJlbFwiLCBwYXJhbSk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vKlxuICogQ2hhbmdlIGZvbnQgcHJvcGVydGllcyBmb3IgZ2l2ZW4gbm9kZXMgdXNlIHRoZSBnaXZlbiBmb250IGRhdGEuXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24oZWxlcywgZGF0YSkge1xuICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgZWxlczogZWxlcyxcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICB9O1xuXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUZvbnRQcm9wZXJ0aWVzXCIsIHBhcmFtKTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZXMsIGRhdGEpO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLypcbiAqIENoYW5nZSBzdGF0ZSB2YWx1ZSBvciB1bml0IG9mIGluZm9ybWF0aW9uIGJveCBvZiBnaXZlbiBub2RlcyB3aXRoIGdpdmVuIGluZGV4LlxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBwYXJhbWV0ZXJzIHNlZSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94XG4gKi9cbm1haW5VdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBpbmRleDogaW5kZXgsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICB0eXBlOiB0eXBlLFxuICAgICAgbm9kZXM6IG5vZGVzXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94KG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLy8gQWRkIGEgbmV3IHN0YXRlIG9yIGluZm8gYm94IHRvIGdpdmVuIG5vZGVzLlxuLy8gVGhlIGJveCBpcyByZXByZXNlbnRlZCBieSB0aGUgcGFyYW1ldGVyIG9iai5cbi8vIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24obm9kZXMsIG9iaikge1xuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG5vZGVzLCBvYmopO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIG9iajogb2JqLFxuICAgICAgbm9kZXM6IG5vZGVzXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLy8gUmVtb3ZlIHRoZSBzdGF0ZSBvciBpbmZvIGJveGVzIG9mIHRoZSBnaXZlbiBub2RlcyBhdCBnaXZlbiBpbmRleC5cbi8vIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG5tYWluVXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24obm9kZXMsIGluZGV4KSB7XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3gobm9kZXMsIGluZGV4KTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBpbmRleDogaW5kZXgsXG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9O1xuXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInJlbW92ZVN0YXRlT3JJbmZvQm94XCIsIHBhcmFtKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBTZXQgbXVsdGltZXIgc3RhdHVzIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uKG5vZGVzLCBzdGF0dXMpIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBzdGF0dXM6IHN0YXR1cyxcbiAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgIH07XG5cbiAgICBjeS51bmRvUmVkbygpLmRvKFwic2V0TXVsdGltZXJTdGF0dXNcIiwgcGFyYW0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMobm9kZXMsIHN0YXR1cyk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vKlxuICogU2V0IGNsb25lIG1hcmtlciBzdGF0dXMgb2YgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi8gXG5tYWluVXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24obm9kZXMsIHN0YXR1cykge1xuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgfTtcblxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXRDbG9uZU1hcmtlclN0YXR1c1wiLCBwYXJhbSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBDaGFuZ2Ugc3R5bGUvY3NzIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmNoYW5nZUNzcyA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlTWFwKSB7XG4gIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VDc3MoZWxlcywgbmFtZSwgdmFsdWVNYXApO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGVsZXM6IGVsZXMsXG4gICAgICB2YWx1ZU1hcDogdmFsdWVNYXAsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlQ3NzXCIsIHBhcmFtKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBDaGFuZ2UgZGF0YSBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXG4gKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcbiAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEoZWxlcywgbmFtZSwgdmFsdWVNYXApO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGVsZXM6IGVsZXMsXG4gICAgICB2YWx1ZU1hcDogdmFsdWVNYXAsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlRGF0YVwiLCBwYXJhbSk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vKlxuICogVW5oaWRlIGdpdmVuIGVsZXMgKHRoZSBvbmVzIHdoaWNoIGFyZSBoaWRkZW4gaWYgYW55KSBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xuICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGVsZXMsIGxheW91dHBhcmFtKSB7XG4gIHZhciBoaWRkZW5FbGVzID0gZWxlcy5maWx0ZXIoJzpoaWRkZW4nKTtcbiAgaWYgKGhpZGRlbkVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0KGhpZGRlbkVsZXMsIGxheW91dHBhcmFtKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBlbGVzOiBoaWRkZW5FbGVzLFxuICAgICAgbGF5b3V0cGFyYW06IGxheW91dHBhcmFtLFxuICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwic2hvd0FuZFBlcmZvcm1MYXlvdXRcIiwgcGFyYW0pO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1haW5VdGlsaXRpZXM7IiwiLypcbiAqICBFeHRlbmQgZGVmYXVsdCBvcHRpb25zIGFuZCBnZXQgY3VycmVudCBvcHRpb25zIGJ5IHVzaW5nIHRoaXMgZmlsZSBcbiAqL1xuXG4vLyBkZWZhdWx0IG9wdGlvbnNcbnZhciBkZWZhdWx0cyA9IHtcbiAgLy8gVGhlIHBhdGggb2YgY29yZSBsaWJyYXJ5IGltYWdlcyB3aGVuIHNiZ252aXogaXMgcmVxdWlyZWQgZnJvbSBucG0gYW5kIHRoZSBpbmRleCBodG1sIFxuICAvLyBmaWxlIGFuZCBub2RlX21vZHVsZXMgYXJlIHVuZGVyIHRoZSBzYW1lIGZvbGRlciB0aGVuIHVzaW5nIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGZpbmVcbiAgaW1nUGF0aDogJ25vZGVfbW9kdWxlcy9zYmdudml6L3NyYy9pbWcnLFxuICAvLyBXaGV0aGVyIHRvIGZpdCBsYWJlbHMgdG8gbm9kZXNcbiAgZml0TGFiZWxzVG9Ob2RlczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgLy8gZHluYW1pYyBsYWJlbCBzaXplIGl0IG1heSBiZSAnc21hbGwnLCAncmVndWxhcicsICdsYXJnZSdcbiAgZHluYW1pY0xhYmVsU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAncmVndWxhcic7XG4gIH0sXG4gIC8vIHBlcmNlbnRhZ2UgdXNlZCB0byBjYWxjdWxhdGUgY29tcG91bmQgcGFkZGluZ3NcbiAgY29tcG91bmRQYWRkaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIDEwO1xuICB9LFxuICAvLyBXaGV0aGVyIHRvIGFkanVzdCBub2RlIGxhYmVsIGZvbnQgc2l6ZSBhdXRvbWF0aWNhbGx5LlxuICAvLyBJZiB0aGlzIG9wdGlvbiByZXR1cm4gZmFsc2UgZG8gbm90IGFkanVzdCBsYWJlbCBzaXplcyBhY2NvcmRpbmcgdG8gbm9kZSBoZWlnaHQgdXNlcyBub2RlLmRhdGEoJ2ZvbnQtc2l6ZScpXG4gIC8vIGluc3RlYWQgb2YgZG9pbmcgaXQuXG4gIGFkanVzdE5vZGVMYWJlbEZvbnRTaXplQXV0b21hdGljYWxseTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIC8vIFRoZSBzZWxlY3RvciBvZiB0aGUgY29tcG9uZW50IGNvbnRhaW5pbmcgdGhlIHNiZ24gbmV0d29ya1xuICBuZXR3b3JrQ29udGFpbmVyU2VsZWN0b3I6ICcjc2Jnbi1uZXR3b3JrLWNvbnRhaW5lcicsXG4gIC8vIFdoZXRoZXIgdGhlIGFjdGlvbnMgYXJlIHVuZG9hYmxlLCByZXF1aXJlcyBjeXRvc2NhcGUtdW5kby1yZWRvIGV4dGVuc2lvblxuICB1bmRvYWJsZTogdHJ1ZSxcbiAgLy8gV2hldGhlciB0byBoYXZlIHVuZG9hYmxlIGRyYWcgZmVhdHVyZSBpbiB1bmRvL3JlZG8gZXh0ZW5zaW9uLiBUaGlzIG9wdGlvbnMgd2lsbCBiZSBwYXNzZWQgdG8gdW5kby9yZWRvIGV4dGVuc2lvblxuICB1bmRvYWJsZURyYWc6IHRydWVcbn07XG5cbnZhciBvcHRpb25VdGlsaXRpZXMgPSBmdW5jdGlvbiAoKSB7XG59O1xuXG4vLyBFeHRlbmQgdGhlIGRlZmF1bHRzIG9wdGlvbnMgd2l0aCB0aGUgdXNlciBvcHRpb25zXG5vcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcblxuICBmb3IgKHZhciBwcm9wIGluIGRlZmF1bHRzKSB7XG4gICAgcmVzdWx0W3Byb3BdID0gZGVmYXVsdHNbcHJvcF07XG4gIH1cbiAgXG4gIGZvciAodmFyIHByb3AgaW4gb3B0aW9ucykge1xuICAgIHJlc3VsdFtwcm9wXSA9IG9wdGlvbnNbcHJvcF07XG4gIH1cblxuICBvcHRpb25VdGlsaXRpZXMub3B0aW9ucyA9IHJlc3VsdDtcblxuICByZXR1cm4gb3B0aW9ucztcbn07XG5cbm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9wdGlvblV0aWxpdGllczsiLCJ2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciAkID0gbGlicy5qUXVlcnk7XG5cbnZhciByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyA9IGZ1bmN0aW9uICh1bmRvYWJsZURyYWcpIHtcbiAgLy8gY3JlYXRlIHVuZG8tcmVkbyBpbnN0YW5jZVxuICB2YXIgdXIgPSBjeS51bmRvUmVkbyh7XG4gICAgdW5kb2FibGVEcmFnOiB1bmRvYWJsZURyYWdcbiAgfSk7XG5cbiAgLy8gcmVnaXN0ZXIgYWRkIHJlbW92ZSBhY3Rpb25zXG4gIHVyLmFjdGlvbihcImFkZE5vZGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkTm9kZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTaW1wbGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xuICB1ci5hY3Rpb24oXCJhZGRFZGdlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZEVkZ2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuICB1ci5hY3Rpb24oXCJhZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTbWFydFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU21hcnQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcbiAgdXIuYWN0aW9uKFwiY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlQ29tcG91bmQpO1xuXG4gIC8vIHJlZ2lzdGVyIGdlbmVyYWwgYWN0aW9uc1xuICB1ci5hY3Rpb24oXCJyZXNpemVOb2Rlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VOb2RlTGFiZWxcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VEYXRhXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VDc3NcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VCZW5kUG9pbnRzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VGb250UHJvcGVydGllc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMpO1xuICB1ci5hY3Rpb24oXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUxheW91dCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtTGF5b3V0KTtcblxuICAvLyByZWdpc3RlciBTQkdOIGFjdGlvbnNcbiAgdXIuYWN0aW9uKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94KTtcbiAgdXIuYWN0aW9uKFwiY2hhbmdlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94KTtcbiAgdXIuYWN0aW9uKFwic2V0TXVsdGltZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzKTtcbiAgdXIuYWN0aW9uKFwic2V0Q2xvbmVNYXJrZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzKTtcbiAgdXIuYWN0aW9uKFwicmVtb3ZlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94KTtcbiAgXG4gIC8vIHJlZ2lzdGVyIGVhc3kgY3JlYXRpb24gYWN0aW9uc1xuICB1ci5hY3Rpb24oXCJjcmVhdGVUZW1wbGF0ZVJlYWN0aW9uXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24sIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuXG4gIHVyLmFjdGlvbihcInNldERlZmF1bHRQcm9wZXJ0eVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXREZWZhdWx0UHJvcGVydHksIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldERlZmF1bHRQcm9wZXJ0eSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVuZG9hYmxlRHJhZykge1xuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyh1bmRvYWJsZURyYWcpO1xuICB9KTtcbn07IiwiLy8gRXh0ZW5kcyBzYmdudml6LnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBzYmdudml6ID0gbGlicy5zYmdudml6O1xudmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xuXG4vLyBTZWN0aW9uIFN0YXJ0XG4vLyBhZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkTm9kZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgdmFyIG5ld05vZGUgPSBwYXJhbS5uZXdOb2RlO1xuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShuZXdOb2RlLngsIG5ld05vZGUueSwgbmV3Tm9kZS5jbGFzcywgbmV3Tm9kZS5pZCwgbmV3Tm9kZS5wYXJlbnQsIG5ld05vZGUudmlzaWJpbGl0eSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVsZXM6IHJlc3VsdFxuICB9O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgdmFyIG5ld0VkZ2UgPSBwYXJhbS5uZXdFZGdlO1xuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdFZGdlLnNvdXJjZSwgbmV3RWRnZS50YXJnZXQsIG5ld0VkZ2UuY2xhc3MsIG5ld0VkZ2UuaWQsIG5ld0VkZ2UudmlzaWJpbGl0eSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVsZXM6IHJlc3VsdFxuICB9O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMgPSBmdW5jdGlvbihwYXJhbSkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyhwYXJhbS5zb3VyY2UsIHBhcmFtLnRhcmdldCwgcGFyYW0ucHJvY2Vzc1R5cGUpO1xuICB9XG4gIGVsc2Uge1xuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBlbGVzOiByZXN1bHRcbiAgfTtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgbm9kZXNUb01ha2VDb21wb3VuZCA9IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQ7XG4gIHZhciBuZXdDb21wb3VuZDtcblxuICAvLyBJZiB0aGlzIGlzIGEgcmVkbyBhY3Rpb24gcmVmcmVzaCB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZCAoV2UgbmVlZCB0aGlzIGJlY2F1c2UgYWZ0ZXIgZWxlLm1vdmUoKSByZWZlcmVuY2VzIHRvIGVsZXMgY2hhbmdlcylcbiAgaWYgKCFwYXJhbS5maXJzdFRpbWUpIHtcbiAgICB2YXIgbm9kZXNUb01ha2VDb21wb3VuZElkcyA9IHt9O1xuXG4gICAgbm9kZXNUb01ha2VDb21wb3VuZC5lYWNoKGZ1bmN0aW9uIChpLCBlbGUpIHtcbiAgICAgIG5vZGVzVG9NYWtlQ29tcG91bmRJZHNbZWxlLmlkKCldID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKCk7XG5cbiAgICBub2Rlc1RvTWFrZUNvbXBvdW5kID0gYWxsTm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChpLCBlbGUpIHtcbiAgICAgIHJldHVybiBub2Rlc1RvTWFrZUNvbXBvdW5kSWRzW2VsZS5pZCgpXTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICB2YXIgb2xkUGFyZW50SWQgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJwYXJlbnRcIik7XG4gICAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZFxuICAgIG5ld0NvbXBvdW5kID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMobm9kZXNUb01ha2VDb21wb3VuZCwgcGFyYW0uY29tcG91bmRUeXBlKTtcbiAgfVxuICBlbHNlIHtcbiAgICBuZXdDb21wb3VuZCA9IHBhcmFtLnJlbW92ZWRDb21wb3VuZC5yZXN0b3JlKCk7XG4gICAgdmFyIG5ld0NvbXBvdW5kSWQgPSBuZXdDb21wb3VuZC5pZCgpO1xuXG4gICAgbm9kZXNUb01ha2VDb21wb3VuZC5tb3ZlKHtwYXJlbnQ6IG5ld0NvbXBvdW5kSWR9KTtcblxuICAgIHNiZ252aXoucmVmcmVzaFBhZGRpbmdzKCk7XG4gIH1cblxuICByZXR1cm4gbmV3Q29tcG91bmQ7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVDb21wb3VuZCA9IGZ1bmN0aW9uIChjb21wb3VuZFRvUmVtb3ZlKSB7XG4gIHZhciByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZUNvbXBvdW5kKGNvbXBvdW5kVG9SZW1vdmUpO1xuXG4gIHZhciBwYXJhbSA9IHtcbiAgICBub2Rlc1RvTWFrZUNvbXBvdW5kOiByZXN1bHQuY2hpbGRyZW5PZkNvbXBvdW5kLFxuICAgIHJlbW92ZWRDb21wb3VuZDogcmVzdWx0LnJlbW92ZWRDb21wb3VuZFxuICB9O1xuXG4gIHJldHVybiBwYXJhbTtcbn07XG5cbi8vIFNlY3Rpb24gRW5kXG4vLyBhZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gZWFzeSBjcmVhdGlvbiBhY3Rpb24gZnVuY3Rpb25zXG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgdmFyIGVsZXM7XG5cbiAgaWYgKGZpcnN0VGltZSkge1xuICAgIGVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24ocGFyYW0udGVtcGxhdGVUeXBlLCBwYXJhbS5tYWNyb21vbGVjdWxlTGlzdCwgcGFyYW0uY29tcGxleE5hbWUsIHBhcmFtLnByb2Nlc3NQb3NpdGlvbiwgcGFyYW0udGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCBwYXJhbS50aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgcGFyYW0uZWRnZUxlbmd0aClcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVzID0gcGFyYW07XG4gICAgY3kuYWRkKGVsZXMpO1xuICAgIFxuICAgIHNiZ252aXoucmVmcmVzaFBhZGRpbmdzKCk7XG4gICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgIGVsZXMuc2VsZWN0KCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVsZXM6IGVsZXNcbiAgfTtcbn07XG5cbi8vIFNlY3Rpb24gRW5kXG4vLyBlYXN5IGNyZWF0aW9uIGFjdGlvbiBmdW5jdGlvbnNcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwb3NpdGlvbnMgPSB7fTtcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcbiAgXG4gIG5vZGVzLmVhY2goZnVuY3Rpb24oaSwgZWxlKSB7XG4gICAgcG9zaXRpb25zW2VsZS5pZCgpXSA9IHtcbiAgICAgIHg6IGVsZS5wb3NpdGlvbihcInhcIiksXG4gICAgICB5OiBlbGUucG9zaXRpb24oXCJ5XCIpXG4gICAgfTtcbiAgfSk7XG5cbiAgcmV0dXJuIHBvc2l0aW9ucztcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zID0gZnVuY3Rpb24gKHBvc2l0aW9ucykge1xuICB2YXIgY3VycmVudFBvc2l0aW9ucyA9IHt9O1xuICBjeS5ub2RlcygpLnBvc2l0aW9ucyhmdW5jdGlvbiAoaSwgZWxlKSB7XG4gICAgY3VycmVudFBvc2l0aW9uc1tlbGUuaWQoKV0gPSB7XG4gICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxuICAgICAgeTogZWxlLnBvc2l0aW9uKFwieVwiKVxuICAgIH07XG4gICAgXG4gICAgdmFyIHBvcyA9IHBvc2l0aW9uc1tlbGUuaWQoKV07XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHBvcy54LFxuICAgICAgeTogcG9zLnlcbiAgICB9O1xuICB9KTtcblxuICByZXR1cm4gY3VycmVudFBvc2l0aW9ucztcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciByZXN1bHQgPSB7XG4gICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZVxuICB9O1xuXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuXG4gIHJlc3VsdC5zaXplTWFwID0ge307XG4gIHJlc3VsdC51c2VBc3BlY3RSYXRpbyA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHJlc3VsdC5zaXplTWFwW25vZGUuaWQoKV0gPSB7XG4gICAgICB3OiBub2RlLndpZHRoKCksXG4gICAgICBoOiBub2RlLmhlaWdodCgpXG4gICAgfTtcbiAgfVxuXG4gIHJlc3VsdC5ub2RlcyA9IG5vZGVzO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuXG4gICAgaWYgKHBhcmFtLnBlcmZvcm1PcGVyYXRpb24pIHtcbiAgICAgIGlmIChwYXJhbS5zaXplTWFwKSB7XG4gICAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS53O1xuICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0uaDtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKHBhcmFtLm5vZGVzLCBwYXJhbS53aWR0aCwgcGFyYW0uaGVpZ2h0LCBwYXJhbS51c2VBc3BlY3RSYXRpbyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0ge1xuICB9O1xuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgcmVzdWx0Lm5vZGVzID0gbm9kZXM7XG4gIHJlc3VsdC5sYWJlbCA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHJlc3VsdC5sYWJlbFtub2RlLmlkKCldID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICB9XG5cbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgIG5vZGVzLmRhdGEoJ2xhYmVsJywgcGFyYW0ubGFiZWwpO1xuICB9XG4gIGVsc2Uge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICBub2RlLl9wcml2YXRlLmRhdGEubGFiZWwgPSBwYXJhbS5sYWJlbFtub2RlLmlkKCldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciByZXN1bHQgPSB7XG4gIH07XG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcbiAgcmVzdWx0Lm5hbWUgPSBwYXJhbS5uYW1lO1xuICByZXN1bHQudmFsdWVNYXAgPSB7fTtcbiAgcmVzdWx0LmVsZXMgPSBlbGVzO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuICAgIHJlc3VsdC52YWx1ZU1hcFtlbGUuaWQoKV0gPSBlbGUuZGF0YShwYXJhbS5uYW1lKTtcbiAgfVxuXG4gIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShwYXJhbS5lbGVzLCBwYXJhbS5uYW1lLCBwYXJhbS52YWx1ZU1hcCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUNzcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0ge1xuICB9O1xuICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG4gIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTtcbiAgcmVzdWx0LnZhbHVlTWFwID0ge307XG4gIHJlc3VsdC5lbGVzID0gZWxlcztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICByZXN1bHQudmFsdWVNYXBbZWxlLmlkKCldID0gZWxlLmNzcyhwYXJhbS5uYW1lKTtcbiAgfVxuXG4gIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzKHBhcmFtLmVsZXMsIHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlTWFwKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgfTtcblxuICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG4gIHJlc3VsdC5kYXRhID0ge307XG4gIHJlc3VsdC5lbGVzID0gZWxlcztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZWxlID0gZWxlc1tpXTtcblxuICAgIHJlc3VsdC5kYXRhW2VsZS5pZCgpXSA9IHt9O1xuXG4gICAgdmFyIGRhdGEgPSBwYXJhbS5maXJzdFRpbWUgPyBwYXJhbS5kYXRhIDogcGFyYW0uZGF0YVtlbGUuaWQoKV07XG5cbiAgICBmb3IgKHZhciBwcm9wIGluIGRhdGEpIHtcbiAgICAgIHJlc3VsdC5kYXRhW2VsZS5pZCgpXVtwcm9wXSA9IGVsZS5kYXRhKHByb3ApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZXMsIGRhdGEpO1xuICB9XG4gIGVsc2Uge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XG4gICAgICBcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlLCBkYXRhKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLypcbiAqIFNob3cgZWxlcyBhbmQgcGVyZm9ybSBsYXlvdXQuXG4gKi9cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcblxuICB2YXIgcmVzdWx0ID0ge307XG4gIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XG4gIFxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgcmVzdWx0LmVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0KHBhcmFtLmVsZXMsIHBhcmFtLmxheW91dHBhcmFtKTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXN1bHQuZWxlcyA9IGN5LnZpZXdVdGlsaXRpZXMoKS5zaG93KGVsZXMpOyAvLyBTaG93IGdpdmVuIGVsZXNcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyhwYXJhbS5wb3NpdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9TaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG5cbiAgdmFyIHJlc3VsdCA9IHt9O1xuICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuICByZXN1bHQuZWxlcyA9IGN5LnZpZXdVdGlsaXRpZXMoKS5oaWRlKGVsZXMpOyAvLyBIaWRlIHByZXZpb3VzbHkgdW5oaWRkZW4gZWxlcztcblxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyhwYXJhbS5wb3NpdGlvbnMpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBTZWN0aW9uIEVuZFxuLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXG5cbi8vIFNlY3Rpb24gU3RhcnRcbi8vIHNiZ24gYWN0aW9uIGZ1bmN0aW9uc1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0ge1xuICB9O1xuICByZXN1bHQudHlwZSA9IHBhcmFtLnR5cGU7XG4gIHJlc3VsdC5ub2RlcyA9IHBhcmFtLm5vZGVzO1xuICByZXN1bHQuaW5kZXggPSBwYXJhbS5pbmRleDtcblxuICByZXN1bHQudmFsdWUgPSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94KHBhcmFtLm5vZGVzLCBwYXJhbS5pbmRleCwgcGFyYW0udmFsdWUsIHBhcmFtLnR5cGUpO1xuXG4gIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBvYmogPSBwYXJhbS5vYmo7XG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuXG4gIHZhciBpbmRleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XG5cbiAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICB2YXIgcmVzdWx0ID0ge1xuICAgIG5vZGVzOiBub2RlcyxcbiAgICBpbmRleDogaW5kZXgsXG4gICAgb2JqOiBvYmpcbiAgfTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBpbmRleCA9IHBhcmFtLmluZGV4O1xuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcblxuICB2YXIgb2JqID0gZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgpO1xuXG4gIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBub2Rlczogbm9kZXMsXG4gICAgb2JqOiBvYmpcbiAgfTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICB2YXIgc3RhdHVzID0gcGFyYW0uc3RhdHVzO1xuICB2YXIgcmVzdWx0U3RhdHVzID0ge307XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIGlzTXVsdGltZXIgPSBub2RlLmRhdGEoJ2NsYXNzJykuZW5kc1dpdGgoJyBtdWx0aW1lcicpO1xuXG4gICAgcmVzdWx0U3RhdHVzW25vZGUuaWQoKV0gPSBpc011bHRpbWVyO1xuICB9XG5cbiAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZSBjaGFuZ2UgdGhlIHN0YXR1cyBvZiBhbGwgbm9kZXMgYXQgb25jZS5cbiAgLy8gSWYgbm90IGNoYW5nZSBzdGF0dXMgb2YgZWFjaCBzZXBlcmF0ZWx5IHRvIHRoZSB2YWx1ZXMgbWFwcGVkIHRvIHRoZWlyIGlkLlxuICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcbiAgfVxuICBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2RlLCBzdGF0dXNbbm9kZS5pZCgpXSk7XG4gICAgfVxuICB9XG5cbi8vICBpZiAoIWZpcnN0VGltZSAmJiBfLmlzRXF1YWwobm9kZXMsIGN5Lm5vZGVzKCc6c2VsZWN0ZWQnKSkpIHtcbi8vICAgICQoJyNpbnNwZWN0b3ItaXMtbXVsdGltZXInKS5hdHRyKFwiY2hlY2tlZFwiLCAhJCgnI2luc3BlY3Rvci1pcy1tdWx0aW1lcicpLmF0dHIoXCJjaGVja2VkXCIpKTtcbi8vICB9XG5cbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBzdGF0dXM6IHJlc3VsdFN0YXR1cyxcbiAgICBub2Rlczogbm9kZXNcbiAgfTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG4gIHZhciBzdGF0dXMgPSBwYXJhbS5zdGF0dXM7XG4gIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XG4gIHZhciByZXN1bHRTdGF0dXMgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICByZXN1bHRTdGF0dXNbbm9kZS5pZCgpXSA9IG5vZGUuZGF0YSgnY2xvbmVtYXJrZXInKTtcbiAgICB2YXIgY3VycmVudFN0YXR1cyA9IGZpcnN0VGltZSA/IHN0YXR1cyA6IHN0YXR1c1tub2RlLmlkKCldO1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMobm9kZSwgY3VycmVudFN0YXR1cyk7XG4gIH1cblxuLy8gIGlmICghZmlyc3RUaW1lICYmIF8uaXNFcXVhbChub2RlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xuLy8gICAgJCgnI2luc3BlY3Rvci1pcy1jbG9uZS1tYXJrZXInKS5hdHRyKFwiY2hlY2tlZFwiLCAhJCgnI2luc3BlY3Rvci1pcy1jbG9uZS1tYXJrZXInKS5hdHRyKFwiY2hlY2tlZFwiKSk7XG4vLyAgfVxuXG4gIHZhciByZXN1bHQgPSB7XG4gICAgc3RhdHVzOiByZXN1bHRTdGF0dXMsXG4gICAgbm9kZXM6IG5vZGVzXG4gIH07XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIHBhcmFtOiB7Y2xhc3M6IHNiZ25jbGFzcywgbmFtZTogcHJvcGVydHlOYW1lLCB2YWx1ZTogdmFsdWV9XG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXREZWZhdWx0UHJvcGVydHkgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHBhcmFtLmNsYXNzO1xuICB2YXIgbmFtZSA9IHBhcmFtLm5hbWU7XG4gIHZhciB2YWx1ZSA9IHBhcmFtLnZhbHVlO1xuICB2YXIgY2xhc3NEZWZhdWx0cyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbc2JnbmNsYXNzXTtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBjbGFzczogc2JnbmNsYXNzLFxuICAgIG5hbWU6IG5hbWUsXG4gICAgdmFsdWU6IGNsYXNzRGVmYXVsdHMuaGFzT3duUHJvcGVydHkobmFtZSkgPyBjbGFzc0RlZmF1bHRzW25hbWVdIDogdW5kZWZpbmVkXG4gIH07XG5cbiAgY2xhc3NEZWZhdWx0c1tuYW1lXSA9IHZhbHVlO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBTZWN0aW9uIEVuZFxuLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXG5cbm1vZHVsZS5leHBvcnRzID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7Il19
