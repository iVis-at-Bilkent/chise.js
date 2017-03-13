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
    height: 15
  },
  "omitted process": {
    width: 15,
    height: 15
  },
  "uncertain process": {
    width: 15,
    height: 15
  },
  "associationprocess": { // TODO not sure if legit, "association" just below
    width: 15,
    height: 15
  },
  "association": {
    width: 15,
    height: 15
  },
  "dissociation": {
    width: 15,
    height: 15
  },
  "macromolecule": {
    width: 70,
    height: 35,
    labelsize: 11
  },
  "nucleic acid feature": {
    width: 70,
    height: 35,
    labelsize: 11
  },
  "simple chemical": {
    width: 35,
    height: 35,
    labelsize: 11
  },
  "source and sink": {
    width: 25,
    height: 25,
    labelsize: 11
  },
  "tag": {
    width: 35,
    height: 35,
    labelsize: 11
  },
  "phenotype": {
    width: 70,
    height: 35,
    labelsize: 11
  },
  "unspecified entity": {
    width: 70,
    height: 35,
    labelsize: 11
  },
  "perturbing agent": {
    width: 70,
    height: 35,
    labelsize: 11
  },
  "complex": {
    width: 100,
    height: 100,
    labelsize: 11
  },
  "compartment": {
    width: 100,
    height: 100,
    labelsize: 11
  },
  "and": {
    width: 25,
    height: 25,
    labelsize: 11
  },
  "or": {
    width: 25,
    height: 25,
    labelsize: 11
  },
  "not": {
    width: 25,
    height: 25,
    labelsize: 11
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
  
  if (defaults) {
    if (defaults['border-width']) {
      css['border-width'] = defaults['border-width'];
    }
    
    if (defaults['background-color']) {
      css['background-color'] = defaults['background-color'];
    }
    
    if (defaults['background-opacity']) {
      css['background-opacity'] = defaults['background-opacity'];
    }
    
    if (defaults['border-color']) {
      css['border-color'] = defaults['border-color'];
    }
  }

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
    labelsize: elementUtilities.canHaveSBGNLabel(sbgnclass) ? (defaults && defaults.labelsize) : undefined,
    fontfamily: elementUtilities.canHaveSBGNLabel(sbgnclass) ? (defaults && defaults.fontfamily) : undefined,
    fontweight: elementUtilities.canHaveSBGNLabel(sbgnclass) ? (defaults && defaults.fontweight) : undefined,
    fontstyle: elementUtilities.canHaveSBGNLabel(sbgnclass) ? (defaults && defaults.fontstyle) : undefined,
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
    // If prop is labelsize it is part of element data else it is part of element css
    if (prop === 'labelsize') {
      eles.data(prop, data[prop]);
    }
    else {
      eles.css(prop, data[prop]);
    }
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
  // Just EPN's can be included in complexes so we need to filter EPN's if compound type is complex
  if (compoundType === 'complex') {
    nodes = _nodes.filter(function (i, element) {
      var sbgnclass = element.data("class");
      return elementUtilities.isEPNClass(sbgnclass);
    });
  }
  
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
  if (newParent && newParent.data("class") != "complex" && newParent.data("class") != "compartment") {
    return;
  }

  if (newParent && newParent.data("class") == "complex") {
    nodes = nodes.filter(function (i, ele) {
      return elementUtilities.isEPNClass(ele.data("class"));
    });
  }

  nodes = nodes.filter(function (i, ele) {
    if (!newParent) {
      return ele.data('parent') != null;
    }
    return ele.data('parent') !== newParent.id();
  });

  if (newParent) {
    nodes = nodes.difference(newParent.ancestors());
  }

  if (nodes.length === 0) {
    return;
  }

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
  // If this option return false do not adjust label sizes according to node height uses node.data('labelsize')
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
      // If prop is labelsize it is part of element data else it is part of element css
      if (prop === 'labelsize') {
        result.data[ele.id()][prop] = ele.data(prop);
      }
      else {
        result.data[ele.id()][prop] = ele.css(prop);
      }
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9saWItdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzc4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3aEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24oKXtcclxuICB2YXIgY2hpc2UgPSB3aW5kb3cuY2hpc2UgPSBmdW5jdGlvbihfb3B0aW9ucywgX2xpYnMpIHtcclxuICAgIHZhciBsaWJzID0ge307XHJcbiAgICBsaWJzLmpRdWVyeSA9IF9saWJzLmpRdWVyeSB8fCBqUXVlcnk7XHJcbiAgICBsaWJzLmN5dG9zY2FwZSA9IF9saWJzLmN5dG9zY2FwZSB8fCBjeXRvc2NhcGU7XHJcbiAgICBsaWJzLnNiZ252aXogPSBfbGlicy5zYmdudml6IHx8IHNiZ252aXo7XHJcbiAgICBsaWJzLnNhdmVBcyA9IF9saWJzLmZpbGVzYXZlcmpzID8gX2xpYnMuZmlsZXNhdmVyanMuc2F2ZUFzIDogc2F2ZUFzO1xyXG4gICAgXHJcbiAgICBsaWJzLnNiZ252aXooX29wdGlvbnMsIF9saWJzKTsgLy8gSW5pdGlsaXplIHNiZ252aXpcclxuICAgIFxyXG4gICAgLy8gU2V0IHRoZSBsaWJyYXJpZXMgdG8gYWNjZXNzIHRoZW0gZnJvbSBhbnkgZmlsZVxyXG4gICAgdmFyIGxpYlV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKTtcclxuICAgIGxpYlV0aWxpdGllcy5zZXRMaWJzKGxpYnMpO1xyXG4gICAgXHJcbiAgICB2YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcycpO1xyXG4gICAgdmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyhfb3B0aW9ucyk7IC8vIEV4dGVuZHMgdGhlIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHRoZSBnaXZlbiBvcHRpb25zXHJcbiAgICBcclxuICAgIC8vIFVwZGF0ZSBzdHlsZSBhbmQgYmluZCBldmVudHNcclxuICAgIHZhciBjeVN0eWxlQW5kRXZlbnRzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvY3ktc3R5bGUtYW5kLWV2ZW50cycpO1xyXG4gICAgY3lTdHlsZUFuZEV2ZW50cyhsaWJzLnNiZ252aXopO1xyXG4gICAgXHJcbiAgICAvLyBSZWdpc3RlciB1bmRvL3JlZG8gYWN0aW9uc1xyXG4gICAgdmFyIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMnKTtcclxuICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKG9wdGlvbnMudW5kb2FibGVEcmFnKTtcclxuICAgIFxyXG4gICAgdmFyIG1haW5VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcycpO1xyXG4gICAgdmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcycpO1xyXG4gICAgdmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMnKTtcclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIHRoZSBhcGlcclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIHRoZSBwcm9wZXJ0aWVzIGluaGVyaXRlZCBmcm9tIHNiZ252aXpcclxuICAgIC8vIHRoZW4gb3ZlcnJpZGUgc29tZSBvZiB0aGVzZSBwcm9wZXJ0aWVzIGFuZCBleHBvc2Ugc29tZSBuZXcgcHJvcGVydGllc1xyXG4gICAgZm9yICh2YXIgcHJvcCBpbiBsaWJzLnNiZ252aXopIHtcclxuICAgICAgY2hpc2VbcHJvcF0gPSBsaWJzLnNiZ252aXpbcHJvcF07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEV4cG9zZSBlYWNoIG1haW4gdXRpbGl0eSBzZXBlcmF0ZWx5XHJcbiAgICBmb3IgKHZhciBwcm9wIGluIG1haW5VdGlsaXRpZXMpIHtcclxuICAgICAgY2hpc2VbcHJvcF0gPSBtYWluVXRpbGl0aWVzW3Byb3BdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgZWxlbWVudFV0aWxpdGllcyBhbmQgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgYXMgaXNcclxuICAgIGNoaXNlLmVsZW1lbnRVdGlsaXRpZXMgPSBlbGVtZW50VXRpbGl0aWVzO1xyXG4gICAgY2hpc2UudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcclxuICB9O1xyXG4gIFxyXG4gIGlmICggdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGNoaXNlO1xyXG4gIH1cclxufSkoKTsiLCJ2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciAkID0gbGlicy5qUXVlcnk7XHJcbnZhciBvcHRpb25zID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJykuZ2V0T3B0aW9ucygpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc2JnbnZpeikge1xyXG4gIC8vSGVscGVyc1xyXG4gIFxyXG4gIC8vIFRoaXMgZnVuY3Rpb24gaXMgdG8gYmUgY2FsbGVkIGFmdGVyIG5vZGVzIGFyZSByZXNpemVkIHRocm91aCB0aGUgbm9kZSByZXNpemUgZXh0ZW5zaW9uIG9yIHRocm91Z2ggdW5kby9yZWRvIGFjdGlvbnNcclxuICB2YXIgbm9kZVJlc2l6ZUVuZEZ1bmN0aW9uID0gZnVuY3Rpb24gKG5vZGVzKSB7XHJcbiAgICBjeS5zdGFydEJhdGNoKCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgIHZhciB3ID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICB2YXIgaCA9IG5vZGUuaGVpZ2h0KCk7XHJcblxyXG4gICAgICBub2RlLnJlbW92ZVN0eWxlKCd3aWR0aCcpO1xyXG4gICAgICBub2RlLnJlbW92ZVN0eWxlKCdoZWlnaHQnKTtcclxuXHJcbiAgICAgIG5vZGUuZGF0YSgnYmJveCcpLncgPSB3O1xyXG4gICAgICBub2RlLmRhdGEoJ2Jib3gnKS5oID0gaDtcclxuICAgIH1cclxuICAgIGN5LmVuZEJhdGNoKCk7XHJcbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gIH07XHJcbiAgXHJcbiAgLy8gVXBkYXRlIGN5IHN0eWxlc2hlZXRcclxuICB2YXIgdXBhdGVTdHlsZVNoZWV0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjeS5zdHlsZSgpXHJcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtsYWJlbHNpemVdXCIpXHJcbiAgICAuc3R5bGUoe1xyXG4gICAgICAnZm9udC1zaXplJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgIC8vIElmIHRoZSBub2RlIGhhcyBsYWJlbHNpemUgZGF0YSBjaGVjayBhZGp1c3ROb2RlTGFiZWxGb250U2l6ZUF1dG9tYXRpY2FsbHkgb3B0aW9uLlxyXG4gICAgICAgIC8vIElmIGl0IGlzIG5vdCBzZXQgdXNlIGxhYmVsc2l6ZSBkYXRhIGFzIGZvbnQgc2l6ZSBlbGVzLiBVc2UgZ2V0TGFiZWxUZXh0U2l6ZSBtZXRob2QuXHJcbiAgICAgICAgdmFyIG9wdCA9IG9wdGlvbnMuYWRqdXN0Tm9kZUxhYmVsRm9udFNpemVBdXRvbWF0aWNhbGx5O1xyXG4gICAgICAgIHZhciBhZGp1c3QgPSB0eXBlb2Ygb3B0ID09PSAnZnVuY3Rpb24nID8gb3B0KCkgOiBvcHQ7XHJcbiAgICAgICAgaWYgKCFhZGp1c3QpIHtcclxuICAgICAgICAgIHJldHVybiBlbGUuZGF0YSgnbGFiZWxzaXplJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldExhYmVsVGV4dFNpemUoZWxlKTtcclxuICAgICAgfVxyXG4gICAgfSkudXBkYXRlKCk7XHJcbiAgfTtcclxuICBcclxuICAvLyBCaW5kIGV2ZW50c1xyXG4gIHZhciBiaW5kQ3lFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuICAgIGN5Lm9uKFwibm9kZXJlc2l6ZS5yZXNpemVlbmRcIiwgZnVuY3Rpb24gKGV2ZW50LCB0eXBlLCBub2RlKSB7XHJcbiAgICAgIG5vZGVSZXNpemVFbmRGdW5jdGlvbihub2RlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKFwiYWZ0ZXJEb1wiLCBmdW5jdGlvbiAoZXZlbnQsIGFjdGlvbk5hbWUsIGFyZ3MpIHtcclxuICAgICAgaWYgKGFjdGlvbk5hbWUgPT09ICdjaGFuZ2VQYXJlbnQnKSB7XHJcbiAgICAgICAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oXCJhZnRlclVuZG9cIiwgZnVuY3Rpb24gKGV2ZW50LCBhY3Rpb25OYW1lLCBhcmdzKSB7XHJcbiAgICAgIGlmIChhY3Rpb25OYW1lID09PSAncmVzaXplJykge1xyXG4gICAgICAgIG5vZGVSZXNpemVFbmRGdW5jdGlvbihhcmdzLm5vZGUpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKGFjdGlvbk5hbWUgPT09ICdjaGFuZ2VQYXJlbnQnKSB7XHJcbiAgICAgICAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oXCJhZnRlclJlZG9cIiwgZnVuY3Rpb24gKGV2ZW50LCBhY3Rpb25OYW1lLCBhcmdzKSB7XHJcbiAgICAgIGlmIChhY3Rpb25OYW1lID09PSAncmVzaXplJykge1xyXG4gICAgICAgIG5vZGVSZXNpemVFbmRGdW5jdGlvbihhcmdzLm5vZGUpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKGFjdGlvbk5hbWUgPT09ICdjaGFuZ2VQYXJlbnQnKSB7XHJcbiAgICAgICAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuICAvLyBIZWxwZXJzIEVuZFxyXG4gIFxyXG4gICQoZG9jdW1lbnQpLm9uKCd1cGRhdGVHcmFwaEVuZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBjeS5zdGFydEJhdGNoKCk7XHJcbiAgICAvLyBJbml0aWxpemUgZm9udCByZWxhdGVkIGRhdGEgb2YgdGhlIGVsZW1lbnRzIHdoaWNoIGNhbiBoYXZlIGxhYmVsXHJcbiAgICBjeS5ub2RlcygpLmVhY2goZnVuY3Rpb24oaSwgZWxlKSB7XHJcbiAgICAgIGlmIChlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOTGFiZWwoZWxlKSkge1xyXG4gICAgICAgIHZhciBfY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xyXG4gICAgICAgIGVsZS5kYXRhKCdsYWJlbHNpemUnLCBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW19jbGFzc10ubGFiZWxzaXplKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBjeS5lbmRCYXRjaCgpO1xyXG4gIH0pO1xyXG4gIFxyXG4gIC8vIERvIHRoZXNlIGp1c3Qgb25lIHRpbWVcclxuICAkKGRvY3VtZW50KS5vbmUoJ3VwZGF0ZUdyYXBoRW5kJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIHVwYXRlU3R5bGVTaGVldCgpO1xyXG4gICAgYmluZEN5RXZlbnRzKCk7XHJcbiAgfSk7XHJcbn07IiwiLy8gRXh0ZW5kcyBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXNcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBzYmdudml6ID0gbGlicy5zYmdudml6O1xyXG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xyXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHNiZ252aXouZWxlbWVudFV0aWxpdGllcztcclxudmFyIG9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKS5nZXRPcHRpb25zKCk7XHJcblxyXG5lbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzID0ge1xyXG4gIFwicHJvY2Vzc1wiOiB7XHJcbiAgICB3aWR0aDogMTUsXHJcbiAgICBoZWlnaHQ6IDE1XHJcbiAgfSxcclxuICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiB7XHJcbiAgICB3aWR0aDogMTUsXHJcbiAgICBoZWlnaHQ6IDE1XHJcbiAgfSxcclxuICBcInVuY2VydGFpbiBwcm9jZXNzXCI6IHtcclxuICAgIHdpZHRoOiAxNSxcclxuICAgIGhlaWdodDogMTVcclxuICB9LFxyXG4gIFwiYXNzb2NpYXRpb25wcm9jZXNzXCI6IHsgLy8gVE9ETyBub3Qgc3VyZSBpZiBsZWdpdCwgXCJhc3NvY2lhdGlvblwiIGp1c3QgYmVsb3dcclxuICAgIHdpZHRoOiAxNSxcclxuICAgIGhlaWdodDogMTVcclxuICB9LFxyXG4gIFwiYXNzb2NpYXRpb25cIjoge1xyXG4gICAgd2lkdGg6IDE1LFxyXG4gICAgaGVpZ2h0OiAxNVxyXG4gIH0sXHJcbiAgXCJkaXNzb2NpYXRpb25cIjoge1xyXG4gICAgd2lkdGg6IDE1LFxyXG4gICAgaGVpZ2h0OiAxNVxyXG4gIH0sXHJcbiAgXCJtYWNyb21vbGVjdWxlXCI6IHtcclxuICAgIHdpZHRoOiA3MCxcclxuICAgIGhlaWdodDogMzUsXHJcbiAgICBsYWJlbHNpemU6IDExXHJcbiAgfSxcclxuICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHtcclxuICAgIHdpZHRoOiA3MCxcclxuICAgIGhlaWdodDogMzUsXHJcbiAgICBsYWJlbHNpemU6IDExXHJcbiAgfSxcclxuICBcInNpbXBsZSBjaGVtaWNhbFwiOiB7XHJcbiAgICB3aWR0aDogMzUsXHJcbiAgICBoZWlnaHQ6IDM1LFxyXG4gICAgbGFiZWxzaXplOiAxMVxyXG4gIH0sXHJcbiAgXCJzb3VyY2UgYW5kIHNpbmtcIjoge1xyXG4gICAgd2lkdGg6IDI1LFxyXG4gICAgaGVpZ2h0OiAyNSxcclxuICAgIGxhYmVsc2l6ZTogMTFcclxuICB9LFxyXG4gIFwidGFnXCI6IHtcclxuICAgIHdpZHRoOiAzNSxcclxuICAgIGhlaWdodDogMzUsXHJcbiAgICBsYWJlbHNpemU6IDExXHJcbiAgfSxcclxuICBcInBoZW5vdHlwZVwiOiB7XHJcbiAgICB3aWR0aDogNzAsXHJcbiAgICBoZWlnaHQ6IDM1LFxyXG4gICAgbGFiZWxzaXplOiAxMVxyXG4gIH0sXHJcbiAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjoge1xyXG4gICAgd2lkdGg6IDcwLFxyXG4gICAgaGVpZ2h0OiAzNSxcclxuICAgIGxhYmVsc2l6ZTogMTFcclxuICB9LFxyXG4gIFwicGVydHVyYmluZyBhZ2VudFwiOiB7XHJcbiAgICB3aWR0aDogNzAsXHJcbiAgICBoZWlnaHQ6IDM1LFxyXG4gICAgbGFiZWxzaXplOiAxMVxyXG4gIH0sXHJcbiAgXCJjb21wbGV4XCI6IHtcclxuICAgIHdpZHRoOiAxMDAsXHJcbiAgICBoZWlnaHQ6IDEwMCxcclxuICAgIGxhYmVsc2l6ZTogMTFcclxuICB9LFxyXG4gIFwiY29tcGFydG1lbnRcIjoge1xyXG4gICAgd2lkdGg6IDEwMCxcclxuICAgIGhlaWdodDogMTAwLFxyXG4gICAgbGFiZWxzaXplOiAxMVxyXG4gIH0sXHJcbiAgXCJhbmRcIjoge1xyXG4gICAgd2lkdGg6IDI1LFxyXG4gICAgaGVpZ2h0OiAyNSxcclxuICAgIGxhYmVsc2l6ZTogMTFcclxuICB9LFxyXG4gIFwib3JcIjoge1xyXG4gICAgd2lkdGg6IDI1LFxyXG4gICAgaGVpZ2h0OiAyNSxcclxuICAgIGxhYmVsc2l6ZTogMTFcclxuICB9LFxyXG4gIFwibm90XCI6IHtcclxuICAgIHdpZHRoOiAyNSxcclxuICAgIGhlaWdodDogMjUsXHJcbiAgICBsYWJlbHNpemU6IDExXHJcbiAgfVxyXG59O1xyXG5cclxuLy8gU2VjdGlvbiBTdGFydFxyXG4vLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xyXG5cclxuZWxlbWVudFV0aWxpdGllcy5hZGROb2RlID0gZnVuY3Rpb24gKHgsIHksIHNiZ25jbGFzcywgaWQsIHBhcmVudCwgdmlzaWJpbGl0eSkge1xyXG4gIHZhciBkZWZhdWx0UHJvcGVydGllcyA9IHRoaXMuZGVmYXVsdFByb3BlcnRpZXM7XHJcbiAgdmFyIGRlZmF1bHRzID0gZGVmYXVsdFByb3BlcnRpZXNbc2JnbmNsYXNzXTtcclxuXHJcbiAgdmFyIHdpZHRoID0gZGVmYXVsdHMgPyBkZWZhdWx0cy53aWR0aCA6IDUwO1xyXG4gIHZhciBoZWlnaHQgPSBkZWZhdWx0cyA/IGRlZmF1bHRzLmhlaWdodCA6IDUwO1xyXG4gIFxyXG4gIHZhciBjc3MgPSB7fTtcclxuICBcclxuICBpZiAoZGVmYXVsdHMpIHtcclxuICAgIGlmIChkZWZhdWx0c1snYm9yZGVyLXdpZHRoJ10pIHtcclxuICAgICAgY3NzWydib3JkZXItd2lkdGgnXSA9IGRlZmF1bHRzWydib3JkZXItd2lkdGgnXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKGRlZmF1bHRzWydiYWNrZ3JvdW5kLWNvbG9yJ10pIHtcclxuICAgICAgY3NzWydiYWNrZ3JvdW5kLWNvbG9yJ10gPSBkZWZhdWx0c1snYmFja2dyb3VuZC1jb2xvciddO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAoZGVmYXVsdHNbJ2JhY2tncm91bmQtb3BhY2l0eSddKSB7XHJcbiAgICAgIGNzc1snYmFja2dyb3VuZC1vcGFjaXR5J10gPSBkZWZhdWx0c1snYmFja2dyb3VuZC1vcGFjaXR5J107XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmIChkZWZhdWx0c1snYm9yZGVyLWNvbG9yJ10pIHtcclxuICAgICAgY3NzWydib3JkZXItY29sb3InXSA9IGRlZmF1bHRzWydib3JkZXItY29sb3InXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICh2aXNpYmlsaXR5KSB7XHJcbiAgICBjc3MudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XHJcbiAgfVxyXG5cclxuICBpZiAoZGVmYXVsdHMgJiYgZGVmYXVsdHMubXVsdGltZXIpIHtcclxuICAgIHNiZ25jbGFzcyArPSBcIiBtdWx0aW1lclwiO1xyXG4gIH1cclxuICB2YXIgZGF0YSA9IHtcclxuICAgIGNsYXNzOiBzYmduY2xhc3MsXHJcbiAgICBiYm94OiB7XHJcbiAgICAgIGg6IGhlaWdodCxcclxuICAgICAgdzogd2lkdGgsXHJcbiAgICAgIHg6IHgsXHJcbiAgICAgIHk6IHlcclxuICAgIH0sXHJcbiAgICBzdGF0ZXNhbmRpbmZvczogW10sXHJcbiAgICBwb3J0czogW10sXHJcbiAgICBsYWJlbHNpemU6IGVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbChzYmduY2xhc3MpID8gKGRlZmF1bHRzICYmIGRlZmF1bHRzLmxhYmVsc2l6ZSkgOiB1bmRlZmluZWQsXHJcbiAgICBmb250ZmFtaWx5OiBlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOTGFiZWwoc2JnbmNsYXNzKSA/IChkZWZhdWx0cyAmJiBkZWZhdWx0cy5mb250ZmFtaWx5KSA6IHVuZGVmaW5lZCxcclxuICAgIGZvbnR3ZWlnaHQ6IGVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbChzYmduY2xhc3MpID8gKGRlZmF1bHRzICYmIGRlZmF1bHRzLmZvbnR3ZWlnaHQpIDogdW5kZWZpbmVkLFxyXG4gICAgZm9udHN0eWxlOiBlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOTGFiZWwoc2JnbmNsYXNzKSA/IChkZWZhdWx0cyAmJiBkZWZhdWx0cy5mb250c3R5bGUpIDogdW5kZWZpbmVkLFxyXG4gICAgY2xvbmVtYXJrZXI6IGRlZmF1bHRzICYmIGRlZmF1bHRzLmNsb25lbWFya2VyID8gZGVmYXVsdHMuY2xvbmVtYXJrZXIgOiB1bmRlZmluZWRcclxuICB9O1xyXG5cclxuICBpZihpZCkge1xyXG4gICAgZGF0YS5pZCA9IGlkO1xyXG4gIH1cclxuICBcclxuICBpZiAocGFyZW50KSB7XHJcbiAgICBkYXRhLnBhcmVudCA9IHBhcmVudDtcclxuICB9XHJcblxyXG4gIHZhciBlbGVzID0gY3kuYWRkKHtcclxuICAgIGdyb3VwOiBcIm5vZGVzXCIsXHJcbiAgICBkYXRhOiBkYXRhLFxyXG4gICAgY3NzOiBjc3MsXHJcbiAgICBwb3NpdGlvbjoge1xyXG4gICAgICB4OiB4LFxyXG4gICAgICB5OiB5XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHZhciBuZXdOb2RlID0gZWxlc1tlbGVzLmxlbmd0aCAtIDFdO1xyXG5cclxuICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xyXG4gIHJldHVybiBuZXdOb2RlO1xyXG59O1xyXG5cclxuZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlID0gZnVuY3Rpb24gKHNvdXJjZSwgdGFyZ2V0LCBzYmduY2xhc3MsIGlkLCB2aXNpYmlsaXR5KSB7XHJcbiAgdmFyIGRlZmF1bHRQcm9wZXJ0aWVzID0gdGhpcy5kZWZhdWx0UHJvcGVydGllcztcclxuICB2YXIgZGVmYXVsdHMgPSBkZWZhdWx0UHJvcGVydGllc1tzYmduY2xhc3NdO1xyXG4gIHZhciBjc3MgPSBkZWZhdWx0cyA/IHtcclxuICAgICd3aWR0aCc6IGRlZmF1bHRzWyd3aWR0aCddXHJcbiAgfSA6IHt9O1xyXG4gIFxyXG4gIHZhciBjc3MgPSB7fTtcclxuICBcclxuICBpZiAoZGVmYXVsdHMpIHtcclxuICAgIGlmIChkZWZhdWx0cy53aWR0aCkge1xyXG4gICAgICBjc3Mud2lkdGggPSBkZWZhdWx0cy53aWR0aDtcclxuICAgIH0gXHJcbiAgICBcclxuICAgIGlmIChkZWZhdWx0c1snbGluZS1jb2xvciddKSB7XHJcbiAgICAgIGNzc1snbGluZS1jb2xvciddID0gZGVmYXVsdHNbJ2xpbmUtY29sb3InXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICh2aXNpYmlsaXR5KSB7XHJcbiAgICBjc3MudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XHJcbiAgfVxyXG5cclxuICB2YXIgZGF0YSA9IHtcclxuICAgICAgc291cmNlOiBzb3VyY2UsXHJcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxyXG4gICAgICBjbGFzczogc2JnbmNsYXNzXHJcbiAgfTtcclxuICBcclxuICBpZihpZCkge1xyXG4gICAgZGF0YS5pZCA9IGlkO1xyXG4gIH1cclxuXHJcbiAgdmFyIGVsZXMgPSBjeS5hZGQoe1xyXG4gICAgZ3JvdXA6IFwiZWRnZXNcIixcclxuICAgIGRhdGE6IGRhdGEsXHJcbiAgICBjc3M6IGNzc1xyXG4gIH0pO1xyXG5cclxuICB2YXIgbmV3RWRnZSA9IGVsZXNbZWxlcy5sZW5ndGggLSAxXTtcclxuICBcclxuICByZXR1cm4gbmV3RWRnZTtcclxufTtcclxuXHJcbmVsZW1lbnRVdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMgPSBmdW5jdGlvbihfc291cmNlLCBfdGFyZ2V0LCBwcm9jZXNzVHlwZSkge1xyXG4gIC8vIElmIHNvdXJjZSBhbmQgdGFyZ2V0IElEcyBhcmUgZ2l2ZW4gZ2V0IHRoZSBlbGVtZW50cyBieSBJRHNcclxuICB2YXIgc291cmNlID0gdHlwZW9mIF9zb3VyY2UgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3NvdXJjZSkgOiBfc291cmNlO1xyXG4gIHZhciB0YXJnZXQgPSB0eXBlb2YgX3RhcmdldCA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfdGFyZ2V0KSA6IF90YXJnZXQ7XHJcbiAgXHJcbiAgLy8gUHJvY2VzcyBwYXJlbnQgc2hvdWxkIGJlIHRoZSBjbG9zZXN0IGNvbW1vbiBhbmNlc3RvciBvZiB0aGUgc291cmNlIGFuZCB0YXJnZXQgbm9kZXNcclxuICB2YXIgcHJvY2Vzc1BhcmVudCA9IGN5LmNvbGxlY3Rpb24oW3NvdXJjZVswXSwgdGFyZ2V0WzBdXSkuY29tbW9uQW5jZXN0b3JzKCkuZmlyc3QoKTtcclxuICBcclxuICAvLyBQcm9jZXNzIHNob3VsZCBiZSBhdCB0aGUgbWlkZGxlIG9mIHRoZSBzb3VyY2UgYW5kIHRhcmdldCBub2Rlc1xyXG4gIHZhciB4ID0gKCBzb3VyY2UucG9zaXRpb24oJ3gnKSArIHRhcmdldC5wb3NpdGlvbigneCcpICkgLyAyO1xyXG4gIHZhciB5ID0gKCBzb3VyY2UucG9zaXRpb24oJ3knKSArIHRhcmdldC5wb3NpdGlvbigneScpICkgLyAyO1xyXG4gIFxyXG4gIC8vIENyZWF0ZSB0aGUgcHJvY2VzcyB3aXRoIGdpdmVuL2NhbGN1bGF0ZWQgdmFyaWFibGVzXHJcbiAgdmFyIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeCwgeSwgcHJvY2Vzc1R5cGUsIHVuZGVmaW5lZCwgcHJvY2Vzc1BhcmVudC5pZCgpKTtcclxuICBcclxuICAvLyBDcmVhdGUgdGhlIGVkZ2VzIG9uZSBpcyBiZXR3ZWVuIHRoZSBwcm9jZXNzIGFuZCB0aGUgc291cmNlIG5vZGUgKHdoaWNoIHNob3VsZCBiZSBhIGNvbnN1bXB0aW9uKSwgXHJcbiAgLy8gdGhlIG90aGVyIG9uZSBpcyBiZXR3ZWVuIHRoZSBwcm9jZXNzIGFuZCB0aGUgdGFyZ2V0IG5vZGUgKHdoaWNoIHNob3VsZCBiZSBhIHByb2R1Y3Rpb24pLlxyXG4gIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uIHBsZWFzZSByZWZlciB0byBTQkdOLVBEIHJlZmVyZW5jZSBjYXJkLlxyXG4gIHZhciBlZGdlQnR3U3JjID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHNvdXJjZS5pZCgpLCBwcm9jZXNzLmlkKCksICdjb25zdW1wdGlvbicpO1xyXG4gIHZhciBlZGdlQnR3VGd0ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgdGFyZ2V0LmlkKCksICdwcm9kdWN0aW9uJyk7XHJcbiAgXHJcbiAgLy8gQ3JlYXRlIGEgY29sbGVjdGlvbiBpbmNsdWRpbmcgdGhlIGVsZW1lbnRzIGFuZCB0byBiZSByZXR1cm5lZFxyXG4gIHZhciBjb2xsZWN0aW9uID0gY3kuY29sbGVjdGlvbihbcHJvY2Vzc1swXSwgZWRnZUJ0d1NyY1swXSwgZWRnZUJ0d1RndFswXV0pO1xyXG4gIHJldHVybiBjb2xsZWN0aW9uO1xyXG59O1xyXG5cclxuLypcclxuICogVGhpcyBtZXRob2QgYXNzdW1lcyB0aGF0IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQgY29udGFpbnMgYXQgbGVhc3Qgb25lIG5vZGVcclxuICogYW5kIGFsbCBvZiB0aGUgbm9kZXMgaW5jbHVkaW5nIGluIGl0IGhhdmUgdGhlIHNhbWUgcGFyZW50LiBJdCBjcmVhdGVzIGEgY29tcG91bmQgZm90IHRoZSBnaXZlbiBub2RlcyBhbiBoYXZpbmcgdGhlIGdpdmVuIHR5cGUuXHJcbiAqL1xyXG5lbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChub2Rlc1RvTWFrZUNvbXBvdW5kLCBjb21wb3VuZFR5cGUpIHtcclxuICB2YXIgb2xkUGFyZW50SWQgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJwYXJlbnRcIik7XHJcbiAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZC4geCwgeSBhbmQgaWQgcGFyYW1ldGVycyBhcmUgbm90IHNldC5cclxuICB2YXIgbmV3Q29tcG91bmQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUodW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbXBvdW5kVHlwZSwgdW5kZWZpbmVkLCBvbGRQYXJlbnRJZCk7XHJcbiAgdmFyIG5ld0NvbXBvdW5kSWQgPSBuZXdDb21wb3VuZC5pZCgpO1xyXG4gIG5vZGVzVG9NYWtlQ29tcG91bmQubW92ZSh7cGFyZW50OiBuZXdDb21wb3VuZElkfSk7XHJcbiAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcclxuICByZXR1cm4gbmV3Q29tcG91bmQ7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBSZW1vdmVzIGEgY29tcG91bmQuIEJlZm9yZSB0aGUgcmVtb3ZhbCBvcGVyYXRpb24gbW92ZXMgdGhlIGNoaWxkcmVuIG9mIHRoYXQgY29tcG91bmQgdG8gdGhlIHBhcmVudCBvZiB0aGUgY29tcG91bmQuXHJcbiAqIFJldHVybnMgb2xkIGNoaWxkcmVuIG9mIHRoZSBjb21wb3VuZCB3aGljaCBhcmUgbW92ZWQgdG8gYW5vdGhlciBwYXJlbnQgYW5kIHRoZSByZW1vdmVkIGNvbXBvdW5kIHRvIHJlc3RvcmUgYmFjayBsYXRlci5cclxuICovXHJcbmVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlQ29tcG91bmQgPSBmdW5jdGlvbiAoY29tcG91bmRUb1JlbW92ZSkge1xyXG4gIHZhciBjb21wb3VuZElkID0gY29tcG91bmRUb1JlbW92ZS5pZCgpO1xyXG4gIHZhciBuZXdQYXJlbnRJZCA9IGNvbXBvdW5kVG9SZW1vdmUuZGF0YShcInBhcmVudFwiKTtcclxuICBuZXdQYXJlbnRJZCA9IG5ld1BhcmVudElkID09PSB1bmRlZmluZWQgPyBudWxsIDogbmV3UGFyZW50SWQ7XHJcbiAgdmFyIGNoaWxkcmVuT2ZDb21wb3VuZCA9IGNvbXBvdW5kVG9SZW1vdmUuY2hpbGRyZW4oKTtcclxuXHJcbiAgY2hpbGRyZW5PZkNvbXBvdW5kLm1vdmUoe3BhcmVudDogbmV3UGFyZW50SWR9KTtcclxuICB2YXIgcmVtb3ZlZENvbXBvdW5kID0gY29tcG91bmRUb1JlbW92ZS5yZW1vdmUoKTtcclxuICBcclxuICByZXR1cm4ge1xyXG4gICAgY2hpbGRyZW5PZkNvbXBvdW5kOiBjaGlsZHJlbk9mQ29tcG91bmQsXHJcbiAgICByZW1vdmVkQ29tcG91bmQ6IHJlbW92ZWRDb21wb3VuZFxyXG4gIH07XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcclxuICogaW4gdGhlIGNvbXBsZXguIFBhcmFtZXRlcnMgYXJlIGV4cGxhaW5lZCBiZWxvdy5cclxuICogdGVtcGxhdGVUeXBlOiBUaGUgdHlwZSBvZiB0aGUgdGVtcGxhdGUgcmVhY3Rpb24uIEl0IG1heSBiZSAnYXNzb2NpYXRpb24nIG9yICdkaXNzb2NpYXRpb24nIGZvciBub3cuXHJcbiAqIG1hY3JvbW9sZWN1bGVMaXN0OiBUaGUgbGlzdCBvZiB0aGUgbmFtZXMgb2YgbWFjcm9tb2xlY3VsZXMgd2hpY2ggd2lsbCBpbnZvbHZlIGluIHRoZSByZWFjdGlvbi5cclxuICogY29tcGxleE5hbWU6IFRoZSBuYW1lIG9mIHRoZSBjb21wbGV4IGluIHRoZSByZWFjdGlvbi5cclxuICogcHJvY2Vzc1Bvc2l0aW9uOiBUaGUgbW9kYWwgcG9zaXRpb24gb2YgdGhlIHByb2Nlc3MgaW4gdGhlIHJlYWN0aW9uLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyB0aGUgY2VudGVyIG9mIHRoZSBjYW52YXMuXHJcbiAqIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cclxuICogdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IFRoaXMgb3B0aW9uIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBjb3NlLWJpbGtlbnQgbGF5b3V0IHdpdGggdGhlIHNhbWUgbmFtZS4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgMTUuXHJcbiAqIGVkZ2VMZW5ndGg6IFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBwcm9jZXNzIGFuZCB0aGUgbWFjcm9tb2xlY3VsZXMgYXQgdGhlIGJvdGggc2lkZXMuXHJcbiAqL1xyXG5lbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAodGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCkge1xyXG4gIHZhciBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbXCJtYWNyb21vbGVjdWxlXCJdO1xyXG4gIHZhciB0ZW1wbGF0ZVR5cGUgPSB0ZW1wbGF0ZVR5cGU7XHJcbiAgdmFyIHByb2Nlc3NXaWR0aCA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbdGVtcGxhdGVUeXBlXSA/IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbdGVtcGxhdGVUeXBlXS53aWR0aCA6IDUwO1xyXG4gIHZhciBtYWNyb21vbGVjdWxlV2lkdGggPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA/IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLndpZHRoIDogNTA7XHJcbiAgdmFyIG1hY3JvbW9sZWN1bGVIZWlnaHQgPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA/IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLmhlaWdodCA6IDUwO1xyXG4gIHZhciBwcm9jZXNzUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24gPyBwcm9jZXNzUG9zaXRpb24gOiBlbGVtZW50VXRpbGl0aWVzLmNvbnZlcnRUb01vZGVsUG9zaXRpb24oe3g6IGN5LndpZHRoKCkgLyAyLCB5OiBjeS5oZWlnaHQoKSAvIDJ9KTtcclxuICB2YXIgbWFjcm9tb2xlY3VsZUxpc3QgPSBtYWNyb21vbGVjdWxlTGlzdDtcclxuICB2YXIgY29tcGxleE5hbWUgPSBjb21wbGV4TmFtZTtcclxuICB2YXIgbnVtT2ZNYWNyb21vbGVjdWxlcyA9IG1hY3JvbW9sZWN1bGVMaXN0Lmxlbmd0aDtcclxuICB2YXIgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsID0gdGlsaW5nUGFkZGluZ1ZlcnRpY2FsID8gdGlsaW5nUGFkZGluZ1ZlcnRpY2FsIDogMTU7XHJcbiAgdmFyIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID0gdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPyB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA6IDE1O1xyXG4gIHZhciBlZGdlTGVuZ3RoID0gZWRnZUxlbmd0aCA/IGVkZ2VMZW5ndGggOiA2MDtcclxuXHJcbiAgY3kuc3RhcnRCYXRjaCgpO1xyXG5cclxuICB2YXIgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXM7XHJcbiAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xyXG4gICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xyXG4gIH1cclxuXHJcbiAgLy9DcmVhdGUgdGhlIHByb2Nlc3MgaW4gdGVtcGxhdGUgdHlwZVxyXG4gIHZhciBwcm9jZXNzID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwgdGVtcGxhdGVUeXBlKTtcclxuICBwcm9jZXNzLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xyXG5cclxuICAvL0RlZmluZSB0aGUgc3RhcnRpbmcgeSBwb3NpdGlvblxyXG4gIHZhciB5UG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZNYWNyb21vbGVjdWxlcyAtIDEpIC8gMikgKiAobWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XHJcblxyXG4gIC8vQ3JlYXRlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1PZk1hY3JvbW9sZWN1bGVzOyBpKyspIHtcclxuICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzLCB5UG9zaXRpb24sIFwibWFjcm9tb2xlY3VsZVwiKTtcclxuICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcbiAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgbWFjcm9tb2xlY3VsZUxpc3RbaV0pO1xyXG5cclxuICAgIC8vY3JlYXRlIHRoZSBlZGdlIGNvbm5lY3RlZCB0byB0aGUgbmV3IG1hY3JvbW9sZWN1bGVcclxuICAgIHZhciBuZXdFZGdlO1xyXG4gICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xyXG4gICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKG5ld05vZGUuaWQoKSwgcHJvY2Vzcy5pZCgpLCAnY29uc3VtcHRpb24nKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgbmV3Tm9kZS5pZCgpLCAncHJvZHVjdGlvbicpO1xyXG4gICAgfVxyXG5cclxuICAgIG5ld0VkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcblxyXG4gICAgLy91cGRhdGUgdGhlIHkgcG9zaXRpb25cclxuICAgIHlQb3NpdGlvbiArPSBtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xyXG4gIH1cclxuXHJcbiAgLy9DcmVhdGUgdGhlIGNvbXBsZXggaW5jbHVkaW5nIG1hY3JvbW9sZWN1bGVzIGluc2lkZSBvZiBpdFxyXG4gIC8vVGVtcHJvcmFyaWx5IGFkZCBpdCB0byB0aGUgcHJvY2VzcyBwb3NpdGlvbiB3ZSB3aWxsIG1vdmUgaXQgYWNjb3JkaW5nIHRvIHRoZSBsYXN0IHNpemUgb2YgaXRcclxuICB2YXIgY29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksICdjb21wbGV4Jyk7XHJcbiAgY29tcGxleC5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcclxuICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcclxuXHJcbiAgLy9JZiBhIG5hbWUgaXMgc3BlY2lmaWVkIGZvciB0aGUgY29tcGxleCBzZXQgaXRzIGxhYmVsIGFjY29yZGluZ2x5XHJcbiAgaWYgKGNvbXBsZXhOYW1lKSB7XHJcbiAgICBjb21wbGV4LmRhdGEoJ2xhYmVsJywgY29tcGxleE5hbWUpO1xyXG4gIH1cclxuXHJcbiAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubm5lY3RlZCB0byB0aGUgY29tcGxleFxyXG4gIHZhciBlZGdlT2ZDb21wbGV4O1xyXG4gIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcclxuICAgIGVkZ2VPZkNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBjb21wbGV4LmlkKCksICdwcm9kdWN0aW9uJyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWRnZU9mQ29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShjb21wbGV4LmlkKCksIHByb2Nlc3MuaWQoKSwgJ2NvbnN1bXB0aW9uJyk7XHJcbiAgfVxyXG4gIGVkZ2VPZkNvbXBsZXguZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcblxyXG4gIC8vQ3JlYXRlIHRoZSBtYWNyb21vbGVjdWxlcyBpbnNpZGUgdGhlIGNvbXBsZXhcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mTWFjcm9tb2xlY3VsZXM7IGkrKykge1xyXG4gICAgLy8gQWRkIGEgbWFjcm9tb2xlY3VsZSBub3QgaGF2aW5nIGEgcHJldmlvdXNseSBkZWZpbmVkIGlkIGFuZCBoYXZpbmcgdGhlIGNvbXBsZXggY3JlYXRlZCBpbiB0aGlzIHJlYWN0aW9uIGFzIHBhcmVudFxyXG4gICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoY29tcGxleC5wb3NpdGlvbigneCcpLCBjb21wbGV4LnBvc2l0aW9uKCd5JyksIFwibWFjcm9tb2xlY3VsZVwiLCB1bmRlZmluZWQsIGNvbXBsZXguaWQoKSk7XHJcbiAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xyXG4gICAgbmV3Tm9kZS5kYXRhKCdsYWJlbCcsIG1hY3JvbW9sZWN1bGVMaXN0W2ldKTtcclxuICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkTGF5b3V0Tm9kZScsIHRydWUpO1xyXG4gIH1cclxuICBcclxuICBjeS5lbmRCYXRjaCgpO1xyXG5cclxuICB2YXIgbGF5b3V0Tm9kZXMgPSBjeS5ub2RlcygnW2p1c3RBZGRlZExheW91dE5vZGVdJyk7XHJcbiAgbGF5b3V0Tm9kZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkTGF5b3V0Tm9kZScpO1xyXG4gIGxheW91dE5vZGVzLmxheW91dCh7XHJcbiAgICBuYW1lOiAnY29zZS1iaWxrZW50JyxcclxuICAgIHJhbmRvbWl6ZTogZmFsc2UsXHJcbiAgICBmaXQ6IGZhbHNlLFxyXG4gICAgYW5pbWF0ZTogZmFsc2UsXHJcbiAgICB0aWxpbmdQYWRkaW5nVmVydGljYWw6IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCxcclxuICAgIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCxcclxuICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy9yZS1wb3NpdGlvbiB0aGUgbm9kZXMgaW5zaWRlIHRoZSBjb21wbGV4XHJcbiAgICAgIHZhciBzdXBwb3NlZFhQb3NpdGlvbjtcclxuICAgICAgdmFyIHN1cHBvc2VkWVBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnk7XHJcblxyXG4gICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XHJcbiAgICAgICAgc3VwcG9zZWRYUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgY29tcGxleC5vdXRlcldpZHRoKCkgLyAyO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHN1cHBvc2VkWFBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIGNvbXBsZXgub3V0ZXJXaWR0aCgpIC8gMjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHBvc2l0aW9uRGlmZlggPSBzdXBwb3NlZFhQb3NpdGlvbiAtIGNvbXBsZXgucG9zaXRpb24oJ3gnKTtcclxuICAgICAgdmFyIHBvc2l0aW9uRGlmZlkgPSBzdXBwb3NlZFlQb3NpdGlvbiAtIGNvbXBsZXgucG9zaXRpb24oJ3knKTtcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5tb3ZlTm9kZXMoe3g6IHBvc2l0aW9uRGlmZlgsIHk6IHBvc2l0aW9uRGlmZll9LCBjb21wbGV4KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy9maWx0ZXIgdGhlIGp1c3QgYWRkZWQgZWxlbWVtdHMgdG8gcmV0dXJuIHRoZW0gYW5kIHJlbW92ZSBqdXN0IGFkZGVkIG1hcmtcclxuICB2YXIgZWxlcyA9IGN5LmVsZW1lbnRzKCdbanVzdEFkZGVkXScpO1xyXG4gIGVsZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkJyk7XHJcbiAgXHJcbiAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcclxuICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XHJcbiAgZWxlcy5zZWxlY3QoKTtcclxuICBcclxuICByZXR1cm4gZWxlczsgLy8gUmV0dXJuIHRoZSBqdXN0IGFkZGVkIGVsZW1lbnRzXHJcbn07XHJcblxyXG4vKlxyXG4gKiBNb3ZlIHRoZSBub2RlcyB0byBhIG5ldyBwYXJlbnQgYW5kIGNoYW5nZSB0aGVpciBwb3NpdGlvbiBpZiBwb3NzRGlmZiBwYXJhbXMgYXJlIHNldC5cclxuICovXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50ID0gZnVuY3Rpb24obm9kZXMsIG5ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XHJcbiAgdmFyIG5ld1BhcmVudElkID0gdHlwZW9mIG5ld1BhcmVudCA9PT0gJ3N0cmluZycgPyBuZXdQYXJlbnQgOiBuZXdQYXJlbnQuaWQoKTtcclxuICBub2Rlcy5tb3ZlKHtcInBhcmVudFwiOiBuZXdQYXJlbnRJZH0pO1xyXG4gIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NEaWZmWCwgeTogcG9zRGlmZll9LCBub2Rlcyk7XHJcbn07XHJcblxyXG4vLyBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuXHJcbmVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMgPSBmdW5jdGlvbiAobm9kZXMsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvKSB7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHZhciByYXRpbyA9IHVuZGVmaW5lZDtcclxuICAgIHZhciBlbGVNdXN0QmVTcXVhcmUgPSBlbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZShub2RlLmRhdGEoJ2NsYXNzJykpO1xyXG5cclxuICAgIC8vIE5vdGUgdGhhdCBib3RoIHdpZHRoIGFuZCBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5XHJcbiAgICBpZiAod2lkdGgpIHtcclxuICAgICAgaWYgKHVzZUFzcGVjdFJhdGlvIHx8IGVsZU11c3RCZVNxdWFyZSkge1xyXG4gICAgICAgIHJhdGlvID0gd2lkdGggLyBub2RlLndpZHRoKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IHdpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChoZWlnaHQpIHtcclxuICAgICAgaWYgKHVzZUFzcGVjdFJhdGlvIHx8IGVsZU11c3RCZVNxdWFyZSkge1xyXG4gICAgICAgIHJhdGlvID0gaGVpZ2h0IC8gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyYXRpbyAmJiAhaGVpZ2h0KSB7XHJcbiAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IG5vZGUuaGVpZ2h0KCkgKiByYXRpbztcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHJhdGlvICYmICF3aWR0aCkge1xyXG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSBub2RlLndpZHRoKCkgKiByYXRpbztcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vLyBTZWN0aW9uIEVuZFxyXG4vLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xyXG5cclxuLy8gU2VjdGlvbiBTdGFydFxyXG4vLyBDb21tb24gZWxlbWVudCBwcm9wZXJ0aWVzXHJcblxyXG4vLyBHZXQgY29tbW9uIHByb3BlcnRpZXMgb2YgZ2l2ZW4gZWxlbWVudHMuIFJldHVybnMgbnVsbCBpZiB0aGUgZ2l2ZW4gZWxlbWVudCBsaXN0IGlzIGVtcHR5IG9yIHRoZVxyXG4vLyBwcm9wZXJ0eSBpcyBub3QgY29tbW9uIGZvciBhbGwgZWxlbWVudHMuIGRhdGFPckNzcyBwYXJhbWV0ZXIgc3BlY2lmeSB3aGV0aGVyIHRvIGNoZWNrIHRoZSBwcm9wZXJ0eSBvbiBkYXRhIG9yIGNzcy5cclxuLy8gVGhlIGRlZmF1bHQgdmFsdWUgZm9yIGl0IGlzIGRhdGEuIElmIHByb3BlcnR5TmFtZSBwYXJhbWV0ZXIgaXMgZ2l2ZW4gYXMgYSBmdW5jdGlvbiBpbnN0ZWFkIG9mIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgXHJcbi8vIHByb3BlcnR5IG5hbWUgdGhlbiB1c2Ugd2hhdCB0aGF0IGZ1bmN0aW9uIHJldHVybnMuXHJcbmVsZW1lbnRVdGlsaXRpZXMuZ2V0Q29tbW9uUHJvcGVydHkgPSBmdW5jdGlvbiAoZWxlbWVudHMsIHByb3BlcnR5TmFtZSwgZGF0YU9yQ3NzKSB7XHJcbiAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHZhciBpc0Z1bmN0aW9uO1xyXG4gIC8vIElmIHdlIGFyZSBub3QgY29tcGFyaW5nIHRoZSBwcm9wZXJ0aWVzIGRpcmVjdGx5IHVzZXJzIGNhbiBzcGVjaWZ5IGEgZnVuY3Rpb24gYXMgd2VsbFxyXG4gIGlmICh0eXBlb2YgcHJvcGVydHlOYW1lID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBpc0Z1bmN0aW9uID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8vIFVzZSBkYXRhIGFzIGRlZmF1bHRcclxuICBpZiAoIWlzRnVuY3Rpb24gJiYgIWRhdGFPckNzcykge1xyXG4gICAgZGF0YU9yQ3NzID0gJ2RhdGEnO1xyXG4gIH1cclxuXHJcbiAgdmFyIHZhbHVlID0gaXNGdW5jdGlvbiA/IHByb3BlcnR5TmFtZShlbGVtZW50c1swXSkgOiBlbGVtZW50c1swXVtkYXRhT3JDc3NdKHByb3BlcnR5TmFtZSk7XHJcblxyXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmICggKCBpc0Z1bmN0aW9uID8gcHJvcGVydHlOYW1lKGVsZW1lbnRzW2ldKSA6IGVsZW1lbnRzW2ldW2RhdGFPckNzc10ocHJvcGVydHlOYW1lKSApICE9IHZhbHVlKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHZhbHVlO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyBpZiB0aGUgZnVuY3Rpb24gcmV0dXJucyBhIHRydXRoeSB2YWx1ZSBmb3IgYWxsIG9mIHRoZSBnaXZlbiBlbGVtZW50cy5cclxuZWxlbWVudFV0aWxpdGllcy50cnVlRm9yQWxsRWxlbWVudHMgPSBmdW5jdGlvbiAoZWxlbWVudHMsIGZjbikge1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmICghZmNuKGVsZW1lbnRzW2ldKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZSBlbGVtZW50IGNhbiBoYXZlIHNiZ25jYXJkaW5hbGl0eVxyXG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOQ2FyZGluYWxpdHkgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XHJcblxyXG4gIHJldHVybiBlbGUuZGF0YSgnY2xhc3MnKSA9PSAnY29uc3VtcHRpb24nIHx8IGVsZS5kYXRhKCdjbGFzcycpID09ICdwcm9kdWN0aW9uJztcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZSBlbGVtZW50IGNhbiBoYXZlIHNiZ25sYWJlbFxyXG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOTGFiZWwgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XHJcblxyXG4gIHJldHVybiBzYmduY2xhc3MgIT0gJ2FuZCcgJiYgc2JnbmNsYXNzICE9ICdvcicgJiYgc2JnbmNsYXNzICE9ICdub3QnXHJcbiAgICAgICAgICAmJiBzYmduY2xhc3MgIT0gJ2Fzc29jaWF0aW9uJyAmJiBzYmduY2xhc3MgIT0gJ2Rpc3NvY2lhdGlvbicgJiYgIXNiZ25jbGFzcy5lbmRzV2l0aCgncHJvY2VzcycpO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgaGF2ZSB1bml0IG9mIGluZm9ybWF0aW9uXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVVuaXRPZkluZm9ybWF0aW9uID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xyXG5cclxuICBpZiAoc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUnIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXgnIHx8IHNiZ25jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsIG11bHRpbWVyJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlIG11bHRpbWVyJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4IG11bHRpbWVyJykge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZSBlbGVtZW50IGhhdmUgc3RhdGUgdmFyaWFibGVcclxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU3RhdGVWYXJpYWJsZSA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcclxuXHJcbiAgaWYgKHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZScgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCdcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZSBtdWx0aW1lcicgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSBtdWx0aW1lcidcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCBtdWx0aW1lcicpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZSBzaG91bGQgYmUgc3F1YXJlIGluIHNoYXBlXHJcbmVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xyXG5cclxuICByZXR1cm4gKHNiZ25jbGFzcy5pbmRleE9mKCdwcm9jZXNzJykgIT0gLTEgfHwgc2JnbmNsYXNzID09ICdzb3VyY2UgYW5kIHNpbmsnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2FuZCcgfHwgc2JnbmNsYXNzID09ICdvcicgfHwgc2JnbmNsYXNzID09ICdub3QnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2Fzc29jaWF0aW9uJyB8fCBzYmduY2xhc3MgPT0gJ2Rpc3NvY2lhdGlvbicpO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIGFueSBvZiB0aGUgZ2l2ZW4gbm9kZXMgbXVzdCBub3QgYmUgaW4gc3F1YXJlIHNoYXBlXHJcbmVsZW1lbnRVdGlsaXRpZXMuc29tZU11c3ROb3RCZVNxdWFyZSA9IGZ1bmN0aW9uIChub2Rlcykge1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlKG5vZGUuZGF0YSgnY2xhc3MnKSkpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVzIGVsZW1lbnQgY2FuIGJlIGNsb25lZFxyXG5lbGVtZW50VXRpbGl0aWVzLmNhbkJlQ2xvbmVkID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcclxuXHJcbiAgdmFyIGxpc3QgPSB7XHJcbiAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcclxuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcclxuICAgICdjb21wbGV4JzogdHJ1ZSxcclxuICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSc6IHRydWUsXHJcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcclxuICAgICdwZXJ0dXJiaW5nIGFnZW50JzogdHJ1ZVxyXG4gIH07XHJcblxyXG4gIHJldHVybiBsaXN0W3NiZ25jbGFzc10gPyB0cnVlIDogZmFsc2U7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVzIGVsZW1lbnQgY2FuIGJlIGNsb25lZFxyXG5lbGVtZW50VXRpbGl0aWVzLmNhbkJlTXVsdGltZXIgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xyXG5cclxuICB2YXIgbGlzdCA9IHtcclxuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcclxuICAgICdjb21wbGV4JzogdHJ1ZSxcclxuICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSc6IHRydWUsXHJcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZVxyXG4gIH07XHJcblxyXG4gIHJldHVybiBsaXN0W3NiZ25jbGFzc10gPyB0cnVlIDogZmFsc2U7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgaXMgYW4gRVBOXHJcbmVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XHJcblxyXG4gIHJldHVybiAoc2JnbmNsYXNzID09ICd1bnNwZWNpZmllZCBlbnRpdHknXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCdcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZSdcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXgnKTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhIFBOXHJcbmVsZW1lbnRVdGlsaXRpZXMuaXNQTkNsYXNzID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcclxuXHJcbiAgcmV0dXJuIChzYmduY2xhc3MgPT0gJ3Byb2Nlc3MnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcydcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAndW5jZXJ0YWluIHByb2Nlc3MnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2Fzc29jaWF0aW9uJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdkaXNzb2NpYXRpb24nXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ3BoZW5vdHlwZScpO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3ZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgb3Igc3RyaW5nIGlzIG9mIHRoZSBzcGVjaWFsIGVtcHR5IHNldC9zb3VyY2UgYW5kIHNpbmsgY2xhc3NcclxuZWxlbWVudFV0aWxpdGllcy5pc0VtcHR5U2V0Q2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xyXG4gIHJldHVybiBzYmduY2xhc3MgPT0gJ3NvdXJjZSBhbmQgc2luayc7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgaXMgYSBsb2dpY2FsIG9wZXJhdG9yXHJcbmVsZW1lbnRVdGlsaXRpZXMuaXNMb2dpY2FsT3BlcmF0b3IgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgcmV0dXJuIChzYmduY2xhc3MgPT0gJ2FuZCcgfHwgc2JnbmNsYXNzID09ICdvcicgfHwgc2JnbmNsYXNzID09ICdub3QnKTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgY2xhc3Mgb2YgZ2l2ZW4gZWxlbWVudCBpcyBhIGVxdWl2YWxhbmNlIGNsYXNzXHJcbmVsZW1lbnRVdGlsaXRpZXMuY29udmVuaWVudFRvRXF1aXZhbGVuY2UgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgcmV0dXJuIChzYmduY2xhc3MgPT0gJ3RhZycgfHwgc2JnbmNsYXNzID09ICd0ZXJtaW5hbCcpO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3ZXRoZXIgdGhlIGNsYXNzIG9mIGdpdmVuIGVsZW1udCBpcyBhIG1vZHVsYXRpb24gYXJjIGFzIGRlZmluZWQgaW4gUEQgc3BlY3NcclxuZWxlbWVudFV0aWxpdGllcy5pc01vZHVsYXRpb25BcmNDbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcclxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAnbW9kdWxhdGlvbidcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnc3RpbXVsYXRpb24nIHx8IHNiZ25jbGFzcyA9PSAnY2F0YWx5c2lzJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdpbmhpYml0aW9uJyB8fCBzYmduY2xhc3MgPT0gJ25lY2Vzc2FyeSBzdGltdWxhdGlvbicpO1xyXG59XHJcblxyXG4vLyBSZWxvY2F0ZXMgc3RhdGUgYW5kIGluZm8gYm94ZXMuIFRoaXMgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gYmUgY2FsbGVkIGFmdGVyIGFkZC9yZW1vdmUgc3RhdGUgYW5kIGluZm8gYm94ZXNcclxuZWxlbWVudFV0aWxpdGllcy5yZWxvY2F0ZVN0YXRlQW5kSW5mb3MgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHN0YXRlQW5kSW5mb3MgPSAoZWxlLmlzTm9kZSAmJiBlbGUuaXNOb2RlKCkpID8gZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykgOiBlbGU7XHJcbiAgdmFyIGxlbmd0aCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoO1xyXG4gIGlmIChsZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBlbHNlIGlmIChsZW5ndGggPT0gMSkge1xyXG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAwO1xyXG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGxlbmd0aCA9PSAyKSB7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcclxuXHJcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDA7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IDUwO1xyXG4gIH1cclxuICBlbHNlIGlmIChsZW5ndGggPT0gMykge1xyXG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAtMjU7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcclxuXHJcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDI1O1xyXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSAtNTA7XHJcblxyXG4gICAgc3RhdGVBbmRJbmZvc1syXS5iYm94LnggPSAwO1xyXG4gICAgc3RhdGVBbmRJbmZvc1syXS5iYm94LnkgPSA1MDtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IC0yNTtcclxuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xyXG5cclxuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IC01MDtcclxuXHJcbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IC0yNTtcclxuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC55ID0gNTA7XHJcblxyXG4gICAgc3RhdGVBbmRJbmZvc1szXS5iYm94LnggPSAyNTtcclxuICAgIHN0YXRlQW5kSW5mb3NbM10uYmJveC55ID0gNTA7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gQ2hhbmdlIHN0YXRlIHZhbHVlIG9yIHVuaXQgb2YgaW5mb3JtYXRpb24gYm94IG9mIGdpdmVuIG5vZGVzIHdpdGggZ2l2ZW4gaW5kZXguXHJcbi8vIFR5cGUgcGFyYW1ldGVyIGluZGljYXRlcyB3aGV0aGVyIHRvIGNoYW5nZSB2YWx1ZSBvciB2YXJpYWJsZSwgaXQgaXMgdmFsaWQgaWYgdGhlIGJveCBhdCB0aGUgZ2l2ZW4gaW5kZXggaXMgYSBzdGF0ZSB2YXJpYWJsZS5cclxuLy8gVmFsdWUgcGFyYW1ldGVyIGlzIHRoZSBuZXcgdmFsdWUgdG8gc2V0LlxyXG4vLyBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBvbGQgdmFsdWUgb2YgdGhlIGNoYW5nZWQgZGF0YSAoV2UgYXNzdW1lIHRoYXQgdGhlIG9sZCB2YWx1ZSBvZiB0aGUgY2hhbmdlZCBkYXRhIHdhcyB0aGUgc2FtZSBmb3IgYWxsIG5vZGVzKS5cclxuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XHJcbiAgdmFyIHJlc3VsdDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XHJcbiAgICB2YXIgYm94ID0gc3RhdGVBbmRJbmZvc1tpbmRleF07XHJcblxyXG4gICAgaWYgKGJveC5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHtcclxuICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICByZXN1bHQgPSBib3guc3RhdGVbdHlwZV07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGJveC5zdGF0ZVt0eXBlXSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYm94LmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7XHJcbiAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gYm94LmxhYmVsLnRleHQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGJveC5sYWJlbC50ZXh0ID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLy8gQWRkIGEgbmV3IHN0YXRlIG9yIGluZm8gYm94IHRvIGdpdmVuIG5vZGVzLlxyXG4vLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxyXG4vLyBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUganVzdCBhZGRlZCBib3guXHJcbmVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAobm9kZXMsIG9iaikge1xyXG4gIHZhciBpbmRleDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XHJcbiAgICBcclxuICAgIC8vIENsb25lIHRoZSBvYmplY3QgdG8gYXZvaWQgcmVmZXJlbmNpbmcgaXNzdWVzXHJcbiAgICB2YXIgY2xvbmUgPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBvYmopO1xyXG4gICAgXHJcbiAgICBzdGF0ZUFuZEluZm9zLnB1c2goY2xvbmUpO1xyXG4gICAgaW5kZXggPSBzdGF0ZUFuZEluZm9zLmxlbmd0aCAtIDE7XHJcbiAgICB0aGlzLnJlbG9jYXRlU3RhdGVBbmRJbmZvcyhzdGF0ZUFuZEluZm9zKTsgLy8gUmVsb2NhdGUgc3RhdGUgYW5kIGluZm9zXHJcbiAgfVxyXG5cclxuICByZXR1cm4gaW5kZXg7XHJcbn07XHJcblxyXG4vLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxyXG4vLyBSZXR1cm5zIHRoZSByZW1vdmVkIGJveC5cclxuZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2RlcywgaW5kZXgpIHtcclxuICB2YXIgb2JqO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcclxuICAgIGlmICghb2JqKSB7XHJcbiAgICAgIG9iaiA9IHN0YXRlQW5kSW5mb3NbaW5kZXhdO1xyXG4gICAgfVxyXG4gICAgc3RhdGVBbmRJbmZvcy5zcGxpY2UoaW5kZXgsIDEpOyAvLyBSZW1vdmUgdGhlIGJveFxyXG4gICAgdGhpcy5yZWxvY2F0ZVN0YXRlQW5kSW5mb3Moc3RhdGVBbmRJbmZvcyk7IC8vIFJlbG9jYXRlIHN0YXRlIGFuZCBpbmZvc1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG9iajtcclxufTtcclxuXHJcbi8vIFNldCBtdWx0aW1lciBzdGF0dXMgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXHJcbmVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMgPSBmdW5jdGlvbiAobm9kZXMsIHN0YXR1cykge1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICB2YXIgc2JnbmNsYXNzID0gbm9kZS5kYXRhKCdjbGFzcycpO1xyXG4gICAgdmFyIGlzTXVsdGltZXIgPSBub2RlLmRhdGEoJ2NsYXNzJykuZW5kc1dpdGgoJyBtdWx0aW1lcicpO1xyXG5cclxuICAgIGlmIChzdGF0dXMpIHsgLy8gTWFrZSBtdWx0aW1lciBzdGF0dXMgdHJ1ZVxyXG4gICAgICBpZiAoIWlzTXVsdGltZXIpIHtcclxuICAgICAgICBub2RlLmRhdGEoJ2NsYXNzJywgc2JnbmNsYXNzICsgJyBtdWx0aW1lcicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHsgLy8gTWFrZSBtdWx0aW1lciBzdGF0dXMgZmFsc2VcclxuICAgICAgaWYgKGlzTXVsdGltZXIpIHtcclxuICAgICAgICBub2RlLmRhdGEoJ2NsYXNzJywgc2JnbmNsYXNzLnJlcGxhY2UoJyBtdWx0aW1lcicsICcnKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vLyBTZXQgY2xvbmUgbWFya2VyIHN0YXR1cyBvZiBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxyXG5lbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24gKG5vZGVzLCBzdGF0dXMpIHtcclxuICBpZiAoc3RhdHVzKSB7XHJcbiAgICBub2Rlcy5kYXRhKCdjbG9uZW1hcmtlcicsIHRydWUpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIG5vZGVzLnJlbW92ZURhdGEoJ2Nsb25lbWFya2VyJyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy9lbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24oKVxyXG5cclxuLy8gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gZWxlbWVudHMgd2l0aCBnaXZlbiBmb250IGRhdGFcclxuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uIChlbGVzLCBkYXRhKSB7XHJcbiAgZm9yICh2YXIgcHJvcCBpbiBkYXRhKSB7XHJcbiAgICAvLyBJZiBwcm9wIGlzIGxhYmVsc2l6ZSBpdCBpcyBwYXJ0IG9mIGVsZW1lbnQgZGF0YSBlbHNlIGl0IGlzIHBhcnQgb2YgZWxlbWVudCBjc3NcclxuICAgIGlmIChwcm9wID09PSAnbGFiZWxzaXplJykge1xyXG4gICAgICBlbGVzLmRhdGEocHJvcCwgZGF0YVtwcm9wXSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgZWxlcy5jc3MocHJvcCwgZGF0YVtwcm9wXSk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiBnZXRzIGFuIGVkZ2UsIGFuZCBlbmRzIG9mIHRoYXQgZWRnZSAoT3B0aW9uYWxseSBpdCBtYXkgdGFrZSBqdXN0IHRoZSBjbGFzc2VzIG9mIHRoZXNlIGVsZW1lbnRzIGFzIHdlbGwpIGFzIHBhcmFtZXRlcnMuXHJcbi8vIEl0IG1heSByZXR1cm4gJ3ZhbGlkJyAodGhhdCBlbmRzIGlzIHZhbGlkIGZvciB0aGF0IGVkZ2UpLCAncmV2ZXJzZScgKHRoYXQgZW5kcyBpcyBub3QgdmFsaWQgZm9yIHRoYXQgZWRnZSBidXQgdGhleSB3b3VsZCBiZSB2YWxpZCBcclxuLy8gaWYgeW91IHJldmVyc2UgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0KSwgJ2ludmFsaWQnICh0aGF0IGVuZHMgYXJlIHRvdGFsbHkgaW52YWxpZCBmb3IgdGhhdCBlZGdlKS5cclxuZWxlbWVudFV0aWxpdGllcy52YWxpZGF0ZUFycm93RW5kcyA9IGZ1bmN0aW9uIChlZGdlLCBzb3VyY2UsIHRhcmdldCkge1xyXG4gIHZhciBlZGdlY2xhc3MgPSB0eXBlb2YgZWRnZSA9PT0gJ3N0cmluZycgPyBlZGdlIDogZWRnZS5kYXRhKCdjbGFzcycpO1xyXG4gIC8vIFRPRE8gaXMgaXQgbmVjZXNzYXJ5IHRvIGFjY2VwdCBzdHJpbmdzID8gYmV0dGVyIHRvIGFsd2F5cyBoYXZlIHRoZSBlbGVtZW50cyBmb3Igc291cmNlIGFuZCB0YXJnZXQuXHJcbiAgLy8gVGhlIGRheSB3ZSBuZWVkIHRvIGNoZWNrIG90aGVyIHJ1bGVzIHdlIHdpbGwgbmVlZCB0byBhY2Nlc3Mgc29tZSBwcm9wZXJ0aWVzIG9mIGVhY2ggZWxlbWVudC5cclxuICB2YXIgc291cmNlY2xhc3MgPSB0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyA/IHNvdXJjZSA6IHNvdXJjZS5kYXRhKCdjbGFzcycpO1xyXG4gIHZhciB0YXJnZXRjbGFzcyA9IHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnID8gdGFyZ2V0IDogdGFyZ2V0LmRhdGEoJ2NsYXNzJyk7XHJcblxyXG4gIGlmICh0aGlzLmlzTW9kdWxhdGlvbkFyY0NsYXNzKGVkZ2VjbGFzcykpe1xyXG4gICAgLypcclxuICAgICAqIENhc2Ugb2YgdGhlIG91dHB1dCBhcmMgb2YgYSBsb2dpYyBvcGVyYXRvciwgd2hpY2ggY2FuIGJlIGFueSBtb2R1bGF0aW9uIGFyYyB0eXBlLlxyXG4gICAgICogSGFzIHRvIGdvIGZyb20gbG9naWMgb3BlcmF0b3IgdG8gUE4gY2xhc3MuXHJcbiAgICAgKiBQRDM3IHNheXMgdGhlcmUgc2hvdWxkIGJlIG9ubHkgMSwgbm90IGVuZm9yY2VkIGZvciBub3csIHJ1bGVzIGFyZSBsZWZ0IGNvbW1lbnRlZC5cclxuICAgICAqL1xyXG4gICAgdmFsaWQgPSB0cnVlO1xyXG4gICAgcmV2ZXJzZSA9IGZhbHNlO1xyXG4gICAgaWYgKHRoaXMuaXNMb2dpY2FsT3BlcmF0b3Ioc291cmNlY2xhc3MpIHx8IHRoaXMuaXNMb2dpY2FsT3BlcmF0b3IodGFyZ2V0Y2xhc3MpKXsgLy8gYSBsb2dpYyBvcGVyYXRvciBpcyBpbnZvbHZlZFxyXG4gICAgICBpZiAoIXRoaXMuaXNMb2dpY2FsT3BlcmF0b3Ioc291cmNlY2xhc3MpIHx8ICF0aGlzLmlzUE5DbGFzcyh0YXJnZXRjbGFzcykpeyAvLyBkaWZmZXJlbnQgZnJvbSB0aGUgaWRlYWwgY2FzZSBvZiBsb2dpYyAtPiBwcm9jZXNzXHJcbiAgICAgICAgaWYgKHRoaXMuaXNQTkNsYXNzKHNvdXJjZWNsYXNzKSAmJiB0aGlzLmlzTG9naWNhbE9wZXJhdG9yKHRhcmdldGNsYXNzKSl7XHJcbiAgICAgICAgICByZXZlcnNlID0gdHJ1ZTtcclxuICAgICAgICAgIC8qaWYgKHRhcmdldC5vdXRnb2VycygnZWRnZScpLnNpemUoKSAhPSAwKXsgLy8gb25seSAxIG91dGdvaW5nIGVkZ2UgYWxsb3dlZCAoUEQzNylcclxuICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcclxuICAgICAgICAgIH0qL1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8qZWxzZSBpZiAoc291cmNlLm91dGdvZXJzKCdlZGdlJykuc2l6ZSgpICE9IDApeyAvLyBvbmx5IDEgb3V0Z29pbmcgZWRnZSBhbGxvd2VkIChQRDM3KVxyXG4gICAgICAgIHZhbGlkID0gZmFsc2U7XHJcbiAgICAgIH0qL1xyXG5cclxuICAgICAgaWYgKHZhbGlkKXtcclxuICAgICAgICByZXR1cm4gcmV2ZXJzZSA/ICdyZXZlcnNlJyA6ICd2YWxpZCc7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICByZXR1cm4gJ2ludmFsaWQnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoZWRnZWNsYXNzID09ICdjb25zdW1wdGlvbicgfHwgdGhpcy5pc01vZHVsYXRpb25BcmNDbGFzcyhlZGdlY2xhc3MpKSB7XHJcbiAgICBpZiAodGhpcy5pc0VtcHR5U2V0Q2xhc3Moc291cmNlY2xhc3MpIHx8IHRoaXMuaXNFbXB0eVNldENsYXNzKHRhcmdldGNsYXNzKSl7IC8vIGNhc2Ugb2YgRW1wdHlTZXQgaW4gb25lIG9mIHRoZSAyXHJcbiAgICAgIC8vIGZvbGxvd2luZyBibG9jayBpcyB0aGUgc2FtZSBhcyB0aGUgJ2Vsc2UgaWYnIGJlbG93LCB3aXRoIGlzRVBOQ2xhc3MgcmVwbGFjZWQgYnkgaXNFbXB0eVNldENsYXNzXHJcbiAgICAgIGlmICghdGhpcy5pc0VtcHR5U2V0Q2xhc3Moc291cmNlY2xhc3MpIHx8ICF0aGlzLmlzUE5DbGFzcyh0YXJnZXRjbGFzcykpe1xyXG4gICAgICAgIGlmICh0aGlzLmlzUE5DbGFzcyhzb3VyY2VjbGFzcykgJiYgdGhpcy5pc0VtcHR5U2V0Q2xhc3ModGFyZ2V0Y2xhc3MpKSB7XHJcbiAgICAgICAgICAvL0lmIGp1c3QgdGhlIGRpcmVjdGlvbiBpcyBub3QgdmFsaWQgcmV2ZXJzZSB0aGUgZGlyZWN0aW9uXHJcbiAgICAgICAgICByZXR1cm4gJ3JldmVyc2UnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiAnaW52YWxpZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICghdGhpcy5pc0VQTkNsYXNzKHNvdXJjZWNsYXNzKSB8fCAhdGhpcy5pc1BOQ2xhc3ModGFyZ2V0Y2xhc3MpKSB7XHJcbiAgICAgIGlmICh0aGlzLmlzUE5DbGFzcyhzb3VyY2VjbGFzcykgJiYgdGhpcy5pc0VQTkNsYXNzKHRhcmdldGNsYXNzKSkge1xyXG4gICAgICAgIC8vSWYganVzdCB0aGUgZGlyZWN0aW9uIGlzIG5vdCB2YWxpZCByZXZlcnNlIHRoZSBkaXJlY3Rpb25cclxuICAgICAgICByZXR1cm4gJ3JldmVyc2UnO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAnaW52YWxpZCc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgZWxzZSBpZiAoZWRnZWNsYXNzID09ICdwcm9kdWN0aW9uJykge1xyXG4gICAgaWYgKHRoaXMuaXNFbXB0eVNldENsYXNzKHNvdXJjZWNsYXNzKSB8fCB0aGlzLmlzRW1wdHlTZXRDbGFzcyh0YXJnZXRjbGFzcykpeyAvLyBjYXNlIG9mIEVtcHR5U2V0IGluIG9uZSBvZiB0aGUgMlxyXG4gICAgICAvLyBmb2xsb3dpbmcgYmxvY2sgaXMgdGhlIHNhbWUgYXMgdGhlICdlbHNlIGlmJyBiZWxvdywgd2l0aCBpc0VQTkNsYXNzIHJlcGxhY2VkIGJ5IGlzRW1wdHlTZXRDbGFzc1xyXG4gICAgICBpZiAoIXRoaXMuaXNQTkNsYXNzKHNvdXJjZWNsYXNzKSB8fCAhdGhpcy5pc0VtcHR5U2V0Q2xhc3ModGFyZ2V0Y2xhc3MpKXtcclxuICAgICAgICBpZiAodGhpcy5pc0VtcHR5U2V0Q2xhc3Moc291cmNlY2xhc3MpICYmIHRoaXMuaXNQTkNsYXNzKHRhcmdldGNsYXNzKSkge1xyXG4gICAgICAgICAgLy9JZiBqdXN0IHRoZSBkaXJlY3Rpb24gaXMgbm90IHZhbGlkIHJldmVyc2UgdGhlIGRpcmVjdGlvblxyXG4gICAgICAgICAgcmV0dXJuICdyZXZlcnNlJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gJ2ludmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoIXRoaXMuaXNQTkNsYXNzKHNvdXJjZWNsYXNzKSB8fCAhdGhpcy5pc0VQTkNsYXNzKHRhcmdldGNsYXNzKSkge1xyXG4gICAgICBpZiAodGhpcy5pc0VQTkNsYXNzKHNvdXJjZWNsYXNzKSAmJiB0aGlzLmlzUE5DbGFzcyh0YXJnZXRjbGFzcykpIHtcclxuICAgICAgICAvL0lmIGp1c3QgdGhlIGRpcmVjdGlvbiBpcyBub3QgdmFsaWQgcmV2ZXJzZSB0aGUgZGlyZWN0aW9uXHJcbiAgICAgICAgcmV0dXJuICdyZXZlcnNlJztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gJ2ludmFsaWQnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGVkZ2VjbGFzcyA9PSAnbG9naWMgYXJjJykge1xyXG4gICAgdmFyIGludmFsaWQgPSBmYWxzZTtcclxuICAgIGlmICghdGhpcy5pc0VQTkNsYXNzKHNvdXJjZWNsYXNzKSB8fCAhdGhpcy5pc0xvZ2ljYWxPcGVyYXRvcih0YXJnZXRjbGFzcykpIHtcclxuICAgICAgaWYgKHRoaXMuaXNMb2dpY2FsT3BlcmF0b3Ioc291cmNlY2xhc3MpICYmIHRoaXMuaXNFUE5DbGFzcyh0YXJnZXRjbGFzcykpIHtcclxuICAgICAgICAvL0lmIGp1c3QgdGhlIGRpcmVjdGlvbiBpcyBub3QgdmFsaWQgcmV2ZXJzZSB0aGUgZGlyZWN0aW9uXHJcbiAgICAgICAgcmV0dXJuICdyZXZlcnNlJztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBpbnZhbGlkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoZSBjYXNlIHRoYXQgYm90aCBzaWRlcyBhcmUgbG9naWNhbCBvcGVyYXRvcnMgYXJlIHZhbGlkIHRvb1xyXG4gICAgaWYgKHRoaXMuaXNMb2dpY2FsT3BlcmF0b3Ioc291cmNlY2xhc3MpICYmIHRoaXMuaXNMb2dpY2FsT3BlcmF0b3IodGFyZ2V0Y2xhc3MpKSB7XHJcbiAgICAgIGludmFsaWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaW52YWxpZCkge1xyXG4gICAgICByZXR1cm4gJ2ludmFsaWQnO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIGlmIChlZGdlY2xhc3MgPT0gJ2VxdWl2YWxlbmNlIGFyYycpIHtcclxuICAgIGlmICghKHRoaXMuaXNFUE5DbGFzcyhzb3VyY2VjbGFzcykgJiYgdGhpcy5jb252ZW5pZW50VG9FcXVpdmFsZW5jZSh0YXJnZXRjbGFzcykpXHJcbiAgICAgICAgICAgICYmICEodGhpcy5pc0VQTkNsYXNzKHRhcmdldGNsYXNzKSAmJiB0aGlzLmNvbnZlbmllbnRUb0VxdWl2YWxlbmNlKHNvdXJjZWNsYXNzKSkpIHtcclxuICAgICAgcmV0dXJuICdpbnZhbGlkJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiAndmFsaWQnO1xyXG59O1xyXG5cclxuLypcclxuICogVW5oaWRlIGdpdmVuIGVsZXMgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcclxuICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLlxyXG4gKi9cclxuZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGVsZXMsIGxheW91dHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdCA9IGN5LnZpZXdVdGlsaXRpZXMoKS5zaG93KGVsZXMpOyAvLyBTaG93IGdpdmVuIGVsZXNcclxuICBpZiAodHlwZW9mIGxheW91dHBhcmFtID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBsYXlvdXRwYXJhbSgpOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBhIGZ1bmN0aW9uIGV4ZWN1dGUgaXRcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBjeS5sYXlvdXQobGF5b3V0cGFyYW0pOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBsYXlvdXQgb3B0aW9ucyBjYWxsIGxheW91dCB3aXRoIHRoYXQgb3B0aW9ucy5cclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8qXHJcbiAqIENoYW5nZSBzdHlsZS9jc3Mgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gdmFsdWUvdmFsdWVzIChOb3RlIHRoYXQgdmFsdWVNYXAgcGFyYW1ldGVyIG1heSBiZVxyXG4gKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS5cclxuICovXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcclxuICBpZiAoIHR5cGVvZiB2YWx1ZU1hcCA9PT0gJ29iamVjdCcgKSB7XHJcbiAgICBjeS5zdGFydEJhdGNoKCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICAgIGVsZS5jc3MobmFtZSwgdmFsdWVNYXBbZWxlLmlkKCldKTsgLy8gdmFsdWVNYXAgaXMgYW4gaWQgdG8gdmFsdWUgbWFwIHVzZSBpdCBpbiB0aGlzIHdheVxyXG4gICAgfVxyXG4gICAgY3kuZW5kQmF0Y2goKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVzLmNzcyhuYW1lLCB2YWx1ZU1hcCk7IC8vIHZhbHVlTWFwIGlzIGp1c3QgYSBzdHJpbmcgc2V0IGNzcygnbmFtZScpIGZvciBhbGwgZWxlcyB0byB0aGlzIHZhbHVlXHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogQ2hhbmdlIGRhdGEgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gdmFsdWUvdmFsdWVzIChOb3RlIHRoYXQgdmFsdWVNYXAgcGFyYW1ldGVyIG1heSBiZVxyXG4gKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS5cclxuICovXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YSA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlTWFwKSB7XHJcbiAgaWYgKCB0eXBlb2YgdmFsdWVNYXAgPT09ICdvYmplY3QnICkge1xyXG4gICAgY3kuc3RhcnRCYXRjaCgpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG4gICAgICBlbGUuZGF0YShuYW1lLCB2YWx1ZU1hcFtlbGUuaWQoKV0pOyAvLyB2YWx1ZU1hcCBpcyBhbiBpZCB0byB2YWx1ZSBtYXAgdXNlIGl0IGluIHRoaXMgd2F5XHJcbiAgICB9XHJcbiAgICBjeS5lbmRCYXRjaCgpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZXMuZGF0YShuYW1lLCB2YWx1ZU1hcCk7IC8vIHZhbHVlTWFwIGlzIGp1c3QgYSBzdHJpbmcgc2V0IGNzcygnbmFtZScpIGZvciBhbGwgZWxlcyB0byB0aGlzIHZhbHVlXHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlbGVtZW50VXRpbGl0aWVzO1xyXG4iLCIvKiBcclxuICogVXRpbGl0eSBmaWxlIHRvIGdldCBhbmQgc2V0IHRoZSBsaWJyYXJpZXMgdG8gd2hpY2ggc2JnbnZpeiBpcyBkZXBlbmRlbnQgZnJvbSBhbnkgZmlsZS5cclxuICovXHJcblxyXG52YXIgbGliVXRpbGl0aWVzID0gZnVuY3Rpb24oKXtcclxufTtcclxuXHJcbmxpYlV0aWxpdGllcy5zZXRMaWJzID0gZnVuY3Rpb24obGlicykge1xyXG4gIHRoaXMubGlicyA9IGxpYnM7XHJcbn07XHJcblxyXG5saWJVdGlsaXRpZXMuZ2V0TGlicyA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB0aGlzLmxpYnM7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpYlV0aWxpdGllczsiLCJ2YXIgb3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpLmdldE9wdGlvbnMoKTtcclxudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XHJcblxyXG4vKlxyXG4gKiBUaGUgbWFpbiB1dGlsaXRpZXMgdG8gYmUgZXhwb3NlZCBkaXJlY3RseS5cclxuICovXHJcbmZ1bmN0aW9uIG1haW5VdGlsaXRpZXMoKSB7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBBZGRzIGEgbmV3IG5vZGUgd2l0aCB0aGUgZ2l2ZW4gY2xhc3MgYW5kIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlcy4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuYWRkTm9kZSA9IGZ1bmN0aW9uKHgsIHkgLCBub2RlY2xhc3MsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeCwgeSwgbm9kZWNsYXNzLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIG5ld05vZGUgOiB7XHJcbiAgICAgICAgeDogeCxcclxuICAgICAgICB5OiB5LFxyXG4gICAgICAgIGNsYXNzOiBub2RlY2xhc3MsXHJcbiAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgIHBhcmVudDogcGFyZW50LFxyXG4gICAgICAgIHZpc2liaWxpdHk6IHZpc2liaWxpdHlcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZE5vZGVcIiwgcGFyYW0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIEFkZHMgYSBuZXcgZWRnZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgaGF2aW5nIHRoZSBnaXZlbiBzb3VyY2UgYW5kIHRhcmdldCBpZHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmFkZEVkZ2UgPSBmdW5jdGlvbihzb3VyY2UsIHRhcmdldCAsIGVkZ2VjbGFzcywgaWQsIHZpc2liaWxpdHkpIHtcclxuICAvLyBHZXQgdGhlIHZhbGlkYXRpb24gcmVzdWx0XHJcbiAgdmFyIHZhbGlkYXRpb24gPSBlbGVtZW50VXRpbGl0aWVzLnZhbGlkYXRlQXJyb3dFbmRzKGVkZ2VjbGFzcywgY3kuZ2V0RWxlbWVudEJ5SWQoc291cmNlKSwgY3kuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0KSk7XHJcblxyXG4gIC8vIElmIHZhbGlkYXRpb24gcmVzdWx0IGlzICdpbnZhbGlkJyBjYW5jZWwgdGhlIG9wZXJhdGlvblxyXG4gIGlmICh2YWxpZGF0aW9uID09PSAnaW52YWxpZCcpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgLy8gSWYgdmFsaWRhdGlvbiByZXN1bHQgaXMgJ3JldmVyc2UnIHJldmVyc2UgdGhlIHNvdXJjZS10YXJnZXQgcGFpciBiZWZvcmUgY3JlYXRpbmcgdGhlIGVkZ2VcclxuICBpZiAodmFsaWRhdGlvbiA9PT0gJ3JldmVyc2UnKSB7XHJcbiAgICB2YXIgdGVtcCA9IHNvdXJjZTtcclxuICAgIHNvdXJjZSA9IHRhcmdldDtcclxuICAgIHRhcmdldCA9IHRlbXA7XHJcbiAgfVxyXG4gICAgICBcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2Uoc291cmNlLCB0YXJnZXQsIGVkZ2VjbGFzcywgaWQsIHZpc2liaWxpdHkpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgbmV3RWRnZSA6IHtcclxuICAgICAgICBzb3VyY2U6IHNvdXJjZSxcclxuICAgICAgICB0YXJnZXQ6IHRhcmdldCxcclxuICAgICAgICBjbGFzczogZWRnZWNsYXNzLFxyXG4gICAgICAgIGlkOiBpZCxcclxuICAgICAgICB2aXNpYmlsaXR5OiB2aXNpYmlsaXR5XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRFZGdlXCIsIHBhcmFtKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBBZGRzIGEgcHJvY2VzcyB3aXRoIGNvbnZlbmllbnQgZWRnZXMuIEZvciBtb3JlIGluZm9ybWF0aW9uIHBsZWFzZSBzZWUgJ2h0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvbmV3dC9pc3N1ZXMvOScuXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24oX3NvdXJjZSwgX3RhcmdldCwgcHJvY2Vzc1R5cGUpIHtcclxuICAvLyBJZiBzb3VyY2UgYW5kIHRhcmdldCBJRHMgYXJlIGdpdmVuIGdldCB0aGUgZWxlbWVudHMgYnkgSURzXHJcbiAgdmFyIHNvdXJjZSA9IHR5cGVvZiBfc291cmNlID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9zb3VyY2UpIDogX3NvdXJjZTtcclxuICB2YXIgdGFyZ2V0ID0gdHlwZW9mIF90YXJnZXQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3RhcmdldCkgOiBfdGFyZ2V0O1xyXG4gIFxyXG4gIC8vIElmIHNvdXJjZSBvciB0YXJnZXQgZG9lcyBub3QgaGF2ZSBhbiBFUE4gY2xhc3MgdGhlIG9wZXJhdGlvbiBpcyBub3QgdmFsaWRcclxuICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyhzb3VyY2UpIHx8ICFlbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3ModGFyZ2V0KSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzKF9zb3VyY2UsIF90YXJnZXQsIHByb2Nlc3NUeXBlKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIHNvdXJjZTogX3NvdXJjZSxcclxuICAgICAgdGFyZ2V0OiBfdGFyZ2V0LFxyXG4gICAgICBwcm9jZXNzVHlwZTogcHJvY2Vzc1R5cGVcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlc1wiLCBwYXJhbSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogQ2xvbmUgZ2l2ZW4gZWxlbWVudHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jbG9uZUVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZXMpIHtcclxuICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgdmFyIGNiID0gY3kuY2xpcGJvYXJkKCk7XHJcbiAgdmFyIF9pZCA9IGNiLmNvcHkoZWxlcywgXCJjbG9uZU9wZXJhdGlvblwiKTtcclxuXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJwYXN0ZVwiLCB7aWQ6IF9pZH0pO1xyXG4gIH0gXHJcbiAgZWxzZSB7XHJcbiAgICBjYi5wYXN0ZShfaWQpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIENvcHkgZ2l2ZW4gZWxlbWVudHMgdG8gY2xpcGJvYXJkLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuY29weUVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZXMpIHtcclxuICBjeS5jbGlwYm9hcmQoKS5jb3B5KGVsZXMpO1xyXG59O1xyXG5cclxuLypcclxuICogUGFzdCB0aGUgZWxlbWVudHMgY29waWVkIHRvIGNsaXBib2FyZC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLnBhc3RlRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInBhc3RlXCIpO1xyXG4gIH0gXHJcbiAgZWxzZSB7XHJcbiAgICBjeS5jbGlwYm9hcmQoKS5wYXN0ZSgpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIEFsaWducyBnaXZlbiBub2RlcyBpbiBnaXZlbiBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBvcmRlci4gXHJcbiAqIEhvcml6b250YWwgYW5kIHZlcnRpY2FsIHBhcmFtZXRlcnMgbWF5IGJlICdub25lJyBvciB1bmRlZmluZWQuXHJcbiAqIGFsaWduVG8gcGFyYW1ldGVyIGluZGljYXRlcyB0aGUgbGVhZGluZyBub2RlLlxyXG4gKiBSZXF1cmlyZXMgY3l0b3NjYXBlLWdyaWQtZ3VpZGUgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5hbGlnbiA9IGZ1bmN0aW9uIChub2RlcywgaG9yaXpvbnRhbCwgdmVydGljYWwsIGFsaWduVG8pIHtcclxuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWxpZ25cIiwge1xyXG4gICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgIGhvcml6b250YWw6IGhvcml6b250YWwsXHJcbiAgICAgIHZlcnRpY2FsOiB2ZXJ0aWNhbCxcclxuICAgICAgYWxpZ25UbzogYWxpZ25Ub1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIG5vZGVzLmFsaWduKGhvcml6b250YWwsIHZlcnRpY2FsLCBhbGlnblRvKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDcmVhdGUgY29tcG91bmQgZm9yIGdpdmVuIG5vZGVzLiBjb21wb3VuZFR5cGUgbWF5IGJlICdjb21wbGV4JyBvciAnY29tcGFydG1lbnQnLlxyXG4gKiBUaGlzIG1ldGhvZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgPSBmdW5jdGlvbiAoX25vZGVzLCBjb21wb3VuZFR5cGUpIHtcclxuICB2YXIgbm9kZXMgPSBfbm9kZXM7XHJcbiAgLy8gSnVzdCBFUE4ncyBjYW4gYmUgaW5jbHVkZWQgaW4gY29tcGxleGVzIHNvIHdlIG5lZWQgdG8gZmlsdGVyIEVQTidzIGlmIGNvbXBvdW5kIHR5cGUgaXMgY29tcGxleFxyXG4gIGlmIChjb21wb3VuZFR5cGUgPT09ICdjb21wbGV4Jykge1xyXG4gICAgbm9kZXMgPSBfbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChpLCBlbGVtZW50KSB7XHJcbiAgICAgIHZhciBzYmduY2xhc3MgPSBlbGVtZW50LmRhdGEoXCJjbGFzc1wiKTtcclxuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyhzYmduY2xhc3MpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIFxyXG4gIG5vZGVzID0gZWxlbWVudFV0aWxpdGllcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xyXG5cclxuICAvLyBBbGwgZWxlbWVudHMgc2hvdWxkIGhhdmUgdGhlIHNhbWUgcGFyZW50IGFuZCB0aGUgY29tbW9uIHBhcmVudCBzaG91bGQgbm90IGJlIGEgJ2NvbXBsZXgnIFxyXG4gIC8vIGlmIGNvbXBvdW5kVHlwZSBpcyAnY29tcGFydGVudCdcclxuICAvLyBiZWNhdXNlIHRoZSBvbGQgY29tbW9uIHBhcmVudCB3aWxsIGJlIHRoZSBwYXJlbnQgb2YgdGhlIG5ldyBjb21wYXJ0bWVudCBhZnRlciB0aGlzIG9wZXJhdGlvbiBhbmRcclxuICAvLyAnY29tcGxleGVzJyBjYW5ub3QgaW5jbHVkZSAnY29tcGFydG1lbnRzJ1xyXG4gIGlmIChub2Rlcy5sZW5ndGggPT0gMCB8fCAhZWxlbWVudFV0aWxpdGllcy5hbGxIYXZlVGhlU2FtZVBhcmVudChub2RlcylcclxuICAgICAgICAgIHx8ICggY29tcG91bmRUeXBlID09PSAnY29tcGFydG1lbnQnICYmIG5vZGVzLnBhcmVudCgpLmRhdGEoJ2NsYXNzJykgPT09ICdjb21wbGV4JyApICkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAoY3kudW5kb1JlZG8oKSkge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBjb21wb3VuZFR5cGU6IGNvbXBvdW5kVHlwZSxcclxuICAgICAgbm9kZXNUb01ha2VDb21wb3VuZDogbm9kZXNcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlc1wiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMobm9kZXMsIGNvbXBvdW5kVHlwZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24gYW5kIGNoZWNrcyBpZiB0aGUgb3BlcmF0aW9uIGlzIHZhbGlkLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jaGFuZ2VQYXJlbnQgPSBmdW5jdGlvbihub2RlcywgX25ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XHJcbiAgdmFyIG5ld1BhcmVudCA9IHR5cGVvZiBfbmV3UGFyZW50ID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9uZXdQYXJlbnQpIDogX25ld1BhcmVudDtcclxuICBpZiAobmV3UGFyZW50ICYmIG5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikgIT0gXCJjb21wbGV4XCIgJiYgbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKSAhPSBcImNvbXBhcnRtZW50XCIpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGlmIChuZXdQYXJlbnQgJiYgbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKSA9PSBcImNvbXBsZXhcIikge1xyXG4gICAgbm9kZXMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGksIGVsZSkge1xyXG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKGVsZS5kYXRhKFwiY2xhc3NcIikpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBub2RlcyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoaSwgZWxlKSB7XHJcbiAgICBpZiAoIW5ld1BhcmVudCkge1xyXG4gICAgICByZXR1cm4gZWxlLmRhdGEoJ3BhcmVudCcpICE9IG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZWxlLmRhdGEoJ3BhcmVudCcpICE9PSBuZXdQYXJlbnQuaWQoKTtcclxuICB9KTtcclxuXHJcbiAgaWYgKG5ld1BhcmVudCkge1xyXG4gICAgbm9kZXMgPSBub2Rlcy5kaWZmZXJlbmNlKG5ld1BhcmVudC5hbmNlc3RvcnMoKSk7XHJcbiAgfVxyXG5cclxuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBub2RlcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcclxuICBcclxuICB2YXIgcGFyZW50SWQgPSBuZXdQYXJlbnQgPyBuZXdQYXJlbnQuaWQoKSA6IG51bGw7XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgZmlyc3RUaW1lOiB0cnVlLFxyXG4gICAgICBwYXJlbnREYXRhOiBwYXJlbnRJZCwgLy8gSXQga2VlcHMgdGhlIG5ld1BhcmVudElkIChKdXN0IGFuIGlkIGZvciBlYWNoIG5vZGVzIGZvciB0aGUgZmlyc3QgdGltZSlcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICBwb3NEaWZmWDogcG9zRGlmZlgsXHJcbiAgICAgIHBvc0RpZmZZOiBwb3NEaWZmWVxyXG4gICAgfTtcclxuXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlUGFyZW50XCIsIHBhcmFtKTsgLy8gVGhpcyBhY3Rpb24gaXMgcmVnaXN0ZXJlZCBieSB1bmRvUmVkbyBleHRlbnNpb25cclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVBhcmVudChub2RlcywgcGFyZW50SWQsIHBvc0RpZmZYLCBwb3NEaWZmWSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogQ3JlYXRlcyBhIHRlbXBsYXRlIHJlYWN0aW9uIHdpdGggZ2l2ZW4gcGFyYW1ldGVycy4gUmVxdWlyZXMgY29zZS1iaWxrZW50IGxheW91dCB0byB0aWxlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzIGluY2x1ZGVkXHJcbiAqIGluIHRoZSBjb21wbGV4LiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgdGhlIHNhbWUgZnVuY3Rpb24gaW4gZWxlbWVudFV0aWxpdGllc1xyXG4gKi9cclxubWFpblV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHRlbXBsYXRlVHlwZSwgbWFjcm9tb2xlY3VsZUxpc3QsIGNvbXBsZXhOYW1lLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgpIHtcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbih0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIHRlbXBsYXRlVHlwZTogdGVtcGxhdGVUeXBlLFxyXG4gICAgICBtYWNyb21vbGVjdWxlTGlzdDogbWFjcm9tb2xlY3VsZUxpc3QsXHJcbiAgICAgIGNvbXBsZXhOYW1lOiBjb21wbGV4TmFtZSxcclxuICAgICAgcHJvY2Vzc1Bvc2l0aW9uOiBwcm9jZXNzUG9zaXRpb24sXHJcbiAgICAgIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLFxyXG4gICAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXHJcbiAgICAgIGVkZ2VMZW5ndGg6IGVkZ2VMZW5ndGhcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjcmVhdGVUZW1wbGF0ZVJlYWN0aW9uXCIsIHBhcmFtKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuIFxyXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbykge1xyXG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICB3aWR0aDogd2lkdGgsXHJcbiAgICAgIGhlaWdodDogaGVpZ2h0LFxyXG4gICAgICB1c2VBc3BlY3RSYXRpbzogdXNlQXNwZWN0UmF0aW8sXHJcbiAgICAgIHBlcmZvcm1PcGVyYXRpb246IHRydWVcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZXNpemVOb2Rlc1wiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2Rlcyhub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8pO1xyXG4gIH1cclxuICBcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuLypcclxuICogQ2hhbmdlcyB0aGUgbGFiZWwgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBsYWJlbC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuY2hhbmdlTm9kZUxhYmVsID0gZnVuY3Rpb24obm9kZXMsIGxhYmVsKSB7XHJcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIG5vZGVzLmRhdGEoJ2xhYmVsJywgbGFiZWwpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICBsYWJlbDogbGFiZWwsXHJcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZU5vZGVMYWJlbFwiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIGZvciBnaXZlbiBub2RlcyB1c2UgdGhlIGdpdmVuIGZvbnQgZGF0YS5cclxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbihlbGVzLCBkYXRhKSB7XHJcbiAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIGVsZXM6IGVsZXMsXHJcbiAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgZGF0YSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDaGFuZ2Ugc3RhdGUgdmFsdWUgb3IgdW5pdCBvZiBpbmZvcm1hdGlvbiBib3ggb2YgZ2l2ZW4gbm9kZXMgd2l0aCBnaXZlbiBpbmRleC5cclxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHBhcmFtZXRlcnMgc2VlIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3hcclxuICovXHJcbm1haW5VdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XHJcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBpbmRleDogaW5kZXgsXHJcbiAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94KG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpO1xyXG4gIH1cclxuICBcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuLy8gQWRkIGEgbmV3IHN0YXRlIG9yIGluZm8gYm94IHRvIGdpdmVuIG5vZGVzLlxyXG4vLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxyXG4vLyBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24obm9kZXMsIG9iaikge1xyXG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG5vZGVzLCBvYmopO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgb2JqOiBvYmosXHJcbiAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZFN0YXRlT3JJbmZvQm94XCIsIHBhcmFtKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbi8vIFJlbW92ZSB0aGUgc3RhdGUgb3IgaW5mbyBib3hlcyBvZiB0aGUgZ2l2ZW4gbm9kZXMgYXQgZ2l2ZW4gaW5kZXguXHJcbi8vIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgpIHtcclxuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgaW5kZXg6IGluZGV4LFxyXG4gICAgICBub2Rlczogbm9kZXNcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInJlbW92ZVN0YXRlT3JJbmZvQm94XCIsIHBhcmFtKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFNldCBtdWx0aW1lciBzdGF0dXMgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24obm9kZXMsIHN0YXR1cykge1xyXG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgc3RhdHVzOiBzdGF0dXMsXHJcbiAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgZmlyc3RUaW1lOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXRNdWx0aW1lclN0YXR1c1wiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFNldCBjbG9uZSBtYXJrZXIgc3RhdHVzIG9mIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqLyBcclxubWFpblV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uKG5vZGVzLCBzdGF0dXMpIHtcclxuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIHN0YXR1czogc3RhdHVzLFxyXG4gICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwic2V0Q2xvbmVNYXJrZXJTdGF0dXNcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMobm9kZXMsIHN0YXR1cyk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDaGFuZ2Ugc3R5bGUvY3NzIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcclxuICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNoYW5nZUNzcyA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlTWFwKSB7XHJcbiAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VDc3MoZWxlcywgbmFtZSwgdmFsdWVNYXApO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgZWxlczogZWxlcyxcclxuICAgICAgdmFsdWVNYXA6IHZhbHVlTWFwLFxyXG4gICAgICBuYW1lOiBuYW1lXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlQ3NzXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIENoYW5nZSBkYXRhIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcclxuICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNoYW5nZURhdGEgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xyXG4gIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShlbGVzLCBuYW1lLCB2YWx1ZU1hcCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBlbGVzOiBlbGVzLFxyXG4gICAgICB2YWx1ZU1hcDogdmFsdWVNYXAsXHJcbiAgICAgIG5hbWU6IG5hbWVcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VEYXRhXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFVuaGlkZSBnaXZlbiBlbGVzICh0aGUgb25lcyB3aGljaCBhcmUgaGlkZGVuIGlmIGFueSkgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcclxuICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihlbGVzLCBsYXlvdXRwYXJhbSkge1xyXG4gIHZhciBoaWRkZW5FbGVzID0gZWxlcy5maWx0ZXIoJzpoaWRkZW4nKTtcclxuICBpZiAoaGlkZGVuRWxlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0KGhpZGRlbkVsZXMsIGxheW91dHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIGVsZXM6IGhpZGRlbkVsZXMsXHJcbiAgICAgIGxheW91dHBhcmFtOiBsYXlvdXRwYXJhbSxcclxuICAgICAgZmlyc3RUaW1lOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwic2hvd0FuZFBlcmZvcm1MYXlvdXRcIiwgcGFyYW0pO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFpblV0aWxpdGllczsiLCIvKlxyXG4gKiAgRXh0ZW5kIGRlZmF1bHQgb3B0aW9ucyBhbmQgZ2V0IGN1cnJlbnQgb3B0aW9ucyBieSB1c2luZyB0aGlzIGZpbGUgXHJcbiAqL1xyXG5cclxuLy8gZGVmYXVsdCBvcHRpb25zXHJcbnZhciBkZWZhdWx0cyA9IHtcclxuICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgdGhlIGluZGV4IGh0bWwgXHJcbiAgLy8gZmlsZSBhbmQgbm9kZV9tb2R1bGVzIGFyZSB1bmRlciB0aGUgc2FtZSBmb2xkZXIgdGhlbiB1c2luZyB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBmaW5lXHJcbiAgaW1nUGF0aDogJ25vZGVfbW9kdWxlcy9zYmdudml6L3NyYy9pbWcnLFxyXG4gIC8vIFdoZXRoZXIgdG8gZml0IGxhYmVscyB0byBub2Rlc1xyXG4gIGZpdExhYmVsc1RvTm9kZXM6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9LFxyXG4gIC8vIGR5bmFtaWMgbGFiZWwgc2l6ZSBpdCBtYXkgYmUgJ3NtYWxsJywgJ3JlZ3VsYXInLCAnbGFyZ2UnXHJcbiAgZHluYW1pY0xhYmVsU2l6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICdyZWd1bGFyJztcclxuICB9LFxyXG4gIC8vIHBlcmNlbnRhZ2UgdXNlZCB0byBjYWxjdWxhdGUgY29tcG91bmQgcGFkZGluZ3NcclxuICBjb21wb3VuZFBhZGRpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAxMDtcclxuICB9LFxyXG4gIC8vIFdoZXRoZXIgdG8gYWRqdXN0IG5vZGUgbGFiZWwgZm9udCBzaXplIGF1dG9tYXRpY2FsbHkuXHJcbiAgLy8gSWYgdGhpcyBvcHRpb24gcmV0dXJuIGZhbHNlIGRvIG5vdCBhZGp1c3QgbGFiZWwgc2l6ZXMgYWNjb3JkaW5nIHRvIG5vZGUgaGVpZ2h0IHVzZXMgbm9kZS5kYXRhKCdsYWJlbHNpemUnKVxyXG4gIC8vIGluc3RlYWQgb2YgZG9pbmcgaXQuXHJcbiAgYWRqdXN0Tm9kZUxhYmVsRm9udFNpemVBdXRvbWF0aWNhbGx5OiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0sXHJcbiAgLy8gVGhlIHNlbGVjdG9yIG9mIHRoZSBjb21wb25lbnQgY29udGFpbmluZyB0aGUgc2JnbiBuZXR3b3JrXHJcbiAgbmV0d29ya0NvbnRhaW5lclNlbGVjdG9yOiAnI3NiZ24tbmV0d29yay1jb250YWluZXInLFxyXG4gIC8vIFdoZXRoZXIgdGhlIGFjdGlvbnMgYXJlIHVuZG9hYmxlLCByZXF1aXJlcyBjeXRvc2NhcGUtdW5kby1yZWRvIGV4dGVuc2lvblxyXG4gIHVuZG9hYmxlOiB0cnVlLFxyXG4gIC8vIFdoZXRoZXIgdG8gaGF2ZSB1bmRvYWJsZSBkcmFnIGZlYXR1cmUgaW4gdW5kby9yZWRvIGV4dGVuc2lvbi4gVGhpcyBvcHRpb25zIHdpbGwgYmUgcGFzc2VkIHRvIHVuZG8vcmVkbyBleHRlbnNpb25cclxuICB1bmRvYWJsZURyYWc6IHRydWVcclxufTtcclxuXHJcbnZhciBvcHRpb25VdGlsaXRpZXMgPSBmdW5jdGlvbiAoKSB7XHJcbn07XHJcblxyXG4vLyBFeHRlbmQgdGhlIGRlZmF1bHRzIG9wdGlvbnMgd2l0aCB0aGUgdXNlciBvcHRpb25zXHJcbm9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICB2YXIgcmVzdWx0ID0ge307XHJcblxyXG4gIGZvciAodmFyIHByb3AgaW4gZGVmYXVsdHMpIHtcclxuICAgIHJlc3VsdFtwcm9wXSA9IGRlZmF1bHRzW3Byb3BdO1xyXG4gIH1cclxuICBcclxuICBmb3IgKHZhciBwcm9wIGluIG9wdGlvbnMpIHtcclxuICAgIHJlc3VsdFtwcm9wXSA9IG9wdGlvbnNbcHJvcF07XHJcbiAgfVxyXG5cclxuICBvcHRpb25VdGlsaXRpZXMub3B0aW9ucyA9IHJlc3VsdDtcclxuXHJcbiAgcmV0dXJuIG9wdGlvbnM7XHJcbn07XHJcblxyXG5vcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnM7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG9wdGlvblV0aWxpdGllczsiLCJ2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgJCA9IGxpYnMualF1ZXJ5O1xyXG5cclxudmFyIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zID0gZnVuY3Rpb24gKHVuZG9hYmxlRHJhZykge1xyXG4gIC8vIGNyZWF0ZSB1bmRvLXJlZG8gaW5zdGFuY2VcclxuICB2YXIgdXIgPSBjeS51bmRvUmVkbyh7XHJcbiAgICB1bmRvYWJsZURyYWc6IHVuZG9hYmxlRHJhZ1xyXG4gIH0pO1xyXG5cclxuICAvLyByZWdpc3RlciBhZGQgcmVtb3ZlIGFjdGlvbnNcclxuICB1ci5hY3Rpb24oXCJhZGROb2RlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZE5vZGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xyXG4gIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTaW1wbGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xyXG4gIHVyLmFjdGlvbihcImFkZEVkZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XHJcbiAgdXIuYWN0aW9uKFwiYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xyXG4gIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTbWFydFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU21hcnQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcclxuICB1ci5hY3Rpb24oXCJjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVDb21wb3VuZCk7XHJcblxyXG4gIC8vIHJlZ2lzdGVyIGdlbmVyYWwgYWN0aW9uc1xyXG4gIHVyLmFjdGlvbihcInJlc2l6ZU5vZGVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc2l6ZU5vZGVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2Rlcyk7XHJcbiAgdXIuYWN0aW9uKFwiY2hhbmdlTm9kZUxhYmVsXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsKTtcclxuICB1ci5hY3Rpb24oXCJjaGFuZ2VEYXRhXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEpO1xyXG4gIHVyLmFjdGlvbihcImNoYW5nZUNzc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUNzcyk7XHJcbiAgdXIuYWN0aW9uKFwiY2hhbmdlQmVuZFBvaW50c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCZW5kUG9pbnRzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCZW5kUG9pbnRzKTtcclxuICB1ci5hY3Rpb24oXCJjaGFuZ2VGb250UHJvcGVydGllc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMpO1xyXG4gIHVyLmFjdGlvbihcInNob3dBbmRQZXJmb3JtTGF5b3V0XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNob3dBbmRQZXJmb3JtTGF5b3V0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvU2hvd0FuZFBlcmZvcm1MYXlvdXQpO1xyXG5cclxuICAvLyByZWdpc3RlciBTQkdOIGFjdGlvbnNcclxuICB1ci5hY3Rpb24oXCJhZGRTdGF0ZU9ySW5mb0JveFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZU9ySW5mb0JveCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3gpO1xyXG4gIHVyLmFjdGlvbihcImNoYW5nZVN0YXRlT3JJbmZvQm94XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCk7XHJcbiAgdXIuYWN0aW9uKFwic2V0TXVsdGltZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzKTtcclxuICB1ci5hY3Rpb24oXCJzZXRDbG9uZU1hcmtlclN0YXR1c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMpO1xyXG4gIHVyLmFjdGlvbihcInJlbW92ZVN0YXRlT3JJbmZvQm94XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZU9ySW5mb0JveCk7XHJcbiAgXHJcbiAgLy8gcmVnaXN0ZXIgZWFzeSBjcmVhdGlvbiBhY3Rpb25zXHJcbiAgdXIuYWN0aW9uKFwiY3JlYXRlVGVtcGxhdGVSZWFjdGlvblwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcclxuXHJcbiAgdXIuYWN0aW9uKFwic2V0RGVmYXVsdFByb3BlcnR5XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldERlZmF1bHRQcm9wZXJ0eSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0RGVmYXVsdFByb3BlcnR5KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odW5kb2FibGVEcmFnKSB7XHJcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyh1bmRvYWJsZURyYWcpO1xyXG4gIH0pO1xyXG59OyIsIi8vIEV4dGVuZHMgc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIHNiZ252aXogPSBsaWJzLnNiZ252aXo7XHJcbnZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHNiZ252aXoudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XHJcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xyXG5cclxuLy8gU2VjdGlvbiBTdGFydFxyXG4vLyBhZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZE5vZGUgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0O1xyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIHZhciBuZXdOb2RlID0gcGFyYW0ubmV3Tm9kZTtcclxuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShuZXdOb2RlLngsIG5ld05vZGUueSwgbmV3Tm9kZS5jbGFzcywgbmV3Tm9kZS5pZCwgbmV3Tm9kZS5wYXJlbnQsIG5ld05vZGUudmlzaWJpbGl0eSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZWxlczogcmVzdWx0XHJcbiAgfTtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZEVkZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0O1xyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIHZhciBuZXdFZGdlID0gcGFyYW0ubmV3RWRnZTtcclxuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdFZGdlLnNvdXJjZSwgbmV3RWRnZS50YXJnZXQsIG5ld0VkZ2UuY2xhc3MsIG5ld0VkZ2UuaWQsIG5ld0VkZ2UudmlzaWJpbGl0eSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZWxlczogcmVzdWx0XHJcbiAgfTtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24ocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0O1xyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMocGFyYW0uc291cmNlLCBwYXJhbS50YXJnZXQsIHBhcmFtLnByb2Nlc3NUeXBlKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKHBhcmFtKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBlbGVzOiByZXN1bHRcclxuICB9O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIG5vZGVzVG9NYWtlQ29tcG91bmQgPSBwYXJhbS5ub2Rlc1RvTWFrZUNvbXBvdW5kO1xyXG4gIHZhciBuZXdDb21wb3VuZDtcclxuXHJcbiAgLy8gSWYgdGhpcyBpcyBhIHJlZG8gYWN0aW9uIHJlZnJlc2ggdGhlIG5vZGVzIHRvIG1ha2UgY29tcG91bmQgKFdlIG5lZWQgdGhpcyBiZWNhdXNlIGFmdGVyIGVsZS5tb3ZlKCkgcmVmZXJlbmNlcyB0byBlbGVzIGNoYW5nZXMpXHJcbiAgaWYgKCFwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIHZhciBub2Rlc1RvTWFrZUNvbXBvdW5kSWRzID0ge307XHJcblxyXG4gICAgbm9kZXNUb01ha2VDb21wb3VuZC5lYWNoKGZ1bmN0aW9uIChpLCBlbGUpIHtcclxuICAgICAgbm9kZXNUb01ha2VDb21wb3VuZElkc1tlbGUuaWQoKV0gPSB0cnVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIGFsbE5vZGVzID0gY3kubm9kZXMoKTtcclxuXHJcbiAgICBub2Rlc1RvTWFrZUNvbXBvdW5kID0gYWxsTm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChpLCBlbGUpIHtcclxuICAgICAgcmV0dXJuIG5vZGVzVG9NYWtlQ29tcG91bmRJZHNbZWxlLmlkKCldO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICB2YXIgb2xkUGFyZW50SWQgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJwYXJlbnRcIik7XHJcbiAgICAvLyBUaGUgcGFyZW50IG9mIG5ldyBjb21wb3VuZCB3aWxsIGJlIHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kXHJcbiAgICBuZXdDb21wb3VuZCA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKG5vZGVzVG9NYWtlQ29tcG91bmQsIHBhcmFtLmNvbXBvdW5kVHlwZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbmV3Q29tcG91bmQgPSBwYXJhbS5yZW1vdmVkQ29tcG91bmQucmVzdG9yZSgpO1xyXG4gICAgdmFyIG5ld0NvbXBvdW5kSWQgPSBuZXdDb21wb3VuZC5pZCgpO1xyXG5cclxuICAgIG5vZGVzVG9NYWtlQ29tcG91bmQubW92ZSh7cGFyZW50OiBuZXdDb21wb3VuZElkfSk7XHJcblxyXG4gICAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXdDb21wb3VuZDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZUNvbXBvdW5kID0gZnVuY3Rpb24gKGNvbXBvdW5kVG9SZW1vdmUpIHtcclxuICB2YXIgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZW1vdmVDb21wb3VuZChjb21wb3VuZFRvUmVtb3ZlKTtcclxuXHJcbiAgdmFyIHBhcmFtID0ge1xyXG4gICAgbm9kZXNUb01ha2VDb21wb3VuZDogcmVzdWx0LmNoaWxkcmVuT2ZDb21wb3VuZCxcclxuICAgIHJlbW92ZWRDb21wb3VuZDogcmVzdWx0LnJlbW92ZWRDb21wb3VuZFxyXG4gIH07XHJcblxyXG4gIHJldHVybiBwYXJhbTtcclxufTtcclxuXHJcbi8vIFNlY3Rpb24gRW5kXHJcbi8vIGFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxuLy8gU2VjdGlvbiBTdGFydFxyXG4vLyBlYXN5IGNyZWF0aW9uIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xyXG4gIHZhciBlbGVzO1xyXG5cclxuICBpZiAoZmlyc3RUaW1lKSB7XHJcbiAgICBlbGVzID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uKHBhcmFtLnRlbXBsYXRlVHlwZSwgcGFyYW0ubWFjcm9tb2xlY3VsZUxpc3QsIHBhcmFtLmNvbXBsZXhOYW1lLCBwYXJhbS5wcm9jZXNzUG9zaXRpb24sIHBhcmFtLnRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgcGFyYW0udGlsaW5nUGFkZGluZ0hvcml6b250YWwsIHBhcmFtLmVkZ2VMZW5ndGgpXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlcyA9IHBhcmFtO1xyXG4gICAgY3kuYWRkKGVsZXMpO1xyXG4gICAgXHJcbiAgICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xyXG4gICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xyXG4gICAgZWxlcy5zZWxlY3QoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBlbGVzOiBlbGVzXHJcbiAgfTtcclxufTtcclxuXHJcbi8vIFNlY3Rpb24gRW5kXHJcbi8vIGVhc3kgY3JlYXRpb24gYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxuLy8gU2VjdGlvbiBTdGFydFxyXG4vLyBnZW5lcmFsIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHBvc2l0aW9ucyA9IHt9O1xyXG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XHJcbiAgXHJcbiAgbm9kZXMuZWFjaChmdW5jdGlvbihpLCBlbGUpIHtcclxuICAgIHBvc2l0aW9uc1tlbGUuaWQoKV0gPSB7XHJcbiAgICAgIHg6IGVsZS5wb3NpdGlvbihcInhcIiksXHJcbiAgICAgIHk6IGVsZS5wb3NpdGlvbihcInlcIilcclxuICAgIH07XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBwb3NpdGlvbnM7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyA9IGZ1bmN0aW9uIChwb3NpdGlvbnMpIHtcclxuICB2YXIgY3VycmVudFBvc2l0aW9ucyA9IHt9O1xyXG4gIGN5Lm5vZGVzKCkucG9zaXRpb25zKGZ1bmN0aW9uIChpLCBlbGUpIHtcclxuICAgIGN1cnJlbnRQb3NpdGlvbnNbZWxlLmlkKCldID0ge1xyXG4gICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxyXG4gICAgICB5OiBlbGUucG9zaXRpb24oXCJ5XCIpXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICB2YXIgcG9zID0gcG9zaXRpb25zW2VsZS5pZCgpXTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IHBvcy54LFxyXG4gICAgICB5OiBwb3MueVxyXG4gICAgfTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGN1cnJlbnRQb3NpdGlvbnM7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBwZXJmb3JtT3BlcmF0aW9uOiB0cnVlXHJcbiAgfTtcclxuXHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcblxyXG4gIHJlc3VsdC5zaXplTWFwID0ge307XHJcbiAgcmVzdWx0LnVzZUFzcGVjdFJhdGlvID0gZmFsc2U7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICByZXN1bHQuc2l6ZU1hcFtub2RlLmlkKCldID0ge1xyXG4gICAgICB3OiBub2RlLndpZHRoKCksXHJcbiAgICAgIGg6IG5vZGUuaGVpZ2h0KClcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICByZXN1bHQubm9kZXMgPSBub2RlcztcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuXHJcbiAgICBpZiAocGFyYW0ucGVyZm9ybU9wZXJhdGlvbikge1xyXG4gICAgICBpZiAocGFyYW0uc2l6ZU1hcCkge1xyXG4gICAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS53O1xyXG4gICAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5oO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMocGFyYW0ubm9kZXMsIHBhcmFtLndpZHRoLCBwYXJhbS5oZWlnaHQsIHBhcmFtLnVzZUFzcGVjdFJhdGlvKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgfTtcclxuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuICByZXN1bHQubm9kZXMgPSBub2RlcztcclxuICByZXN1bHQubGFiZWwgPSB7fTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHJlc3VsdC5sYWJlbFtub2RlLmlkKCldID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xyXG4gIH1cclxuXHJcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBwYXJhbS5sYWJlbCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICBub2RlLl9wcml2YXRlLmRhdGEubGFiZWwgPSBwYXJhbS5sYWJlbFtub2RlLmlkKCldO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gIH07XHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG4gIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTtcclxuICByZXN1bHQudmFsdWVNYXAgPSB7fTtcclxuICByZXN1bHQuZWxlcyA9IGVsZXM7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICByZXN1bHQudmFsdWVNYXBbZWxlLmlkKCldID0gZWxlLmRhdGEocGFyYW0ubmFtZSk7XHJcbiAgfVxyXG5cclxuICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEocGFyYW0uZWxlcywgcGFyYW0ubmFtZSwgcGFyYW0udmFsdWVNYXApO1xyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICB9O1xyXG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuICByZXN1bHQubmFtZSA9IHBhcmFtLm5hbWU7XHJcbiAgcmVzdWx0LnZhbHVlTWFwID0ge307XHJcbiAgcmVzdWx0LmVsZXMgPSBlbGVzO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG4gICAgcmVzdWx0LnZhbHVlTWFwW2VsZS5pZCgpXSA9IGVsZS5jc3MocGFyYW0ubmFtZSk7XHJcbiAgfVxyXG5cclxuICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyhwYXJhbS5lbGVzLCBwYXJhbS5uYW1lLCBwYXJhbS52YWx1ZU1hcCk7XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgfTtcclxuXHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG4gIHJlc3VsdC5kYXRhID0ge307XHJcbiAgcmVzdWx0LmVsZXMgPSBlbGVzO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG5cclxuICAgIHJlc3VsdC5kYXRhW2VsZS5pZCgpXSA9IHt9O1xyXG5cclxuICAgIHZhciBkYXRhID0gcGFyYW0uZmlyc3RUaW1lID8gcGFyYW0uZGF0YSA6IHBhcmFtLmRhdGFbZWxlLmlkKCldO1xyXG5cclxuICAgIGZvciAodmFyIHByb3AgaW4gZGF0YSkge1xyXG4gICAgICAvLyBJZiBwcm9wIGlzIGxhYmVsc2l6ZSBpdCBpcyBwYXJ0IG9mIGVsZW1lbnQgZGF0YSBlbHNlIGl0IGlzIHBhcnQgb2YgZWxlbWVudCBjc3NcclxuICAgICAgaWYgKHByb3AgPT09ICdsYWJlbHNpemUnKSB7XHJcbiAgICAgICAgcmVzdWx0LmRhdGFbZWxlLmlkKCldW3Byb3BdID0gZWxlLmRhdGEocHJvcCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0LmRhdGFbZWxlLmlkKCldW3Byb3BdID0gZWxlLmNzcyhwcm9wKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyhlbGVzLCBkYXRhKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICAgIFxyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZSwgZGF0YSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLypcclxuICogU2hvdyBlbGVzIGFuZCBwZXJmb3JtIGxheW91dC5cclxuICovXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG5cclxuICB2YXIgcmVzdWx0ID0ge307XHJcbiAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcclxuICBcclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICByZXN1bHQuZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQocGFyYW0uZWxlcywgcGFyYW0ubGF5b3V0cGFyYW0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgZ2l2ZW4gZWxlc1xyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvU2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XHJcblxyXG4gIHZhciByZXN1bHQgPSB7fTtcclxuICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xyXG4gIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLmhpZGUoZWxlcyk7IC8vIEhpZGUgcHJldmlvdXNseSB1bmhpZGRlbiBlbGVzO1xyXG5cclxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyhwYXJhbS5wb3NpdGlvbnMpO1xyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLy8gU2VjdGlvbiBFbmRcclxuLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG4vLyBTZWN0aW9uIFN0YXJ0XHJcbi8vIHNiZ24gYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gIH07XHJcbiAgcmVzdWx0LnR5cGUgPSBwYXJhbS50eXBlO1xyXG4gIHJlc3VsdC5ub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG4gIHJlc3VsdC5pbmRleCA9IHBhcmFtLmluZGV4O1xyXG5cclxuICByZXN1bHQudmFsdWUgPSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94KHBhcmFtLm5vZGVzLCBwYXJhbS5pbmRleCwgcGFyYW0udmFsdWUsIHBhcmFtLnR5cGUpO1xyXG5cclxuICBjeS5mb3JjZVJlbmRlcigpO1xyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgb2JqID0gcGFyYW0ub2JqO1xyXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG5cclxuICB2YXIgaW5kZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG5vZGVzLCBvYmopO1xyXG5cclxuICBjeS5mb3JjZVJlbmRlcigpO1xyXG5cclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgaW5kZXg6IGluZGV4LFxyXG4gICAgb2JqOiBvYmpcclxuICB9O1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBpbmRleCA9IHBhcmFtLmluZGV4O1xyXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG5cclxuICB2YXIgb2JqID0gZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgpO1xyXG5cclxuICBjeS5mb3JjZVJlbmRlcigpO1xyXG5cclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgb2JqOiBvYmpcclxuICB9O1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcbiAgdmFyIHN0YXR1cyA9IHBhcmFtLnN0YXR1cztcclxuICB2YXIgcmVzdWx0U3RhdHVzID0ge307XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICB2YXIgaXNNdWx0aW1lciA9IG5vZGUuZGF0YSgnY2xhc3MnKS5lbmRzV2l0aCgnIG11bHRpbWVyJyk7XHJcblxyXG4gICAgcmVzdWx0U3RhdHVzW25vZGUuaWQoKV0gPSBpc011bHRpbWVyO1xyXG4gIH1cclxuXHJcbiAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZSBjaGFuZ2UgdGhlIHN0YXR1cyBvZiBhbGwgbm9kZXMgYXQgb25jZS5cclxuICAvLyBJZiBub3QgY2hhbmdlIHN0YXR1cyBvZiBlYWNoIHNlcGVyYXRlbHkgdG8gdGhlIHZhbHVlcyBtYXBwZWQgdG8gdGhlaXIgaWQuXHJcbiAgaWYgKGZpcnN0VGltZSkge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMobm9kZSwgc3RhdHVzW25vZGUuaWQoKV0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbi8vICBpZiAoIWZpcnN0VGltZSAmJiBfLmlzRXF1YWwobm9kZXMsIGN5Lm5vZGVzKCc6c2VsZWN0ZWQnKSkpIHtcclxuLy8gICAgJCgnI2luc3BlY3Rvci1pcy1tdWx0aW1lcicpLmF0dHIoXCJjaGVja2VkXCIsICEkKCcjaW5zcGVjdG9yLWlzLW11bHRpbWVyJykuYXR0cihcImNoZWNrZWRcIikpO1xyXG4vLyAgfVxyXG5cclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgc3RhdHVzOiByZXN1bHRTdGF0dXMsXHJcbiAgICBub2Rlczogbm9kZXNcclxuICB9O1xyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuICB2YXIgc3RhdHVzID0gcGFyYW0uc3RhdHVzO1xyXG4gIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XHJcbiAgdmFyIHJlc3VsdFN0YXR1cyA9IHt9O1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgcmVzdWx0U3RhdHVzW25vZGUuaWQoKV0gPSBub2RlLmRhdGEoJ2Nsb25lbWFya2VyJyk7XHJcbiAgICB2YXIgY3VycmVudFN0YXR1cyA9IGZpcnN0VGltZSA/IHN0YXR1cyA6IHN0YXR1c1tub2RlLmlkKCldO1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhub2RlLCBjdXJyZW50U3RhdHVzKTtcclxuICB9XHJcblxyXG4vLyAgaWYgKCFmaXJzdFRpbWUgJiYgXy5pc0VxdWFsKG5vZGVzLCBjeS5ub2RlcygnOnNlbGVjdGVkJykpKSB7XHJcbi8vICAgICQoJyNpbnNwZWN0b3ItaXMtY2xvbmUtbWFya2VyJykuYXR0cihcImNoZWNrZWRcIiwgISQoJyNpbnNwZWN0b3ItaXMtY2xvbmUtbWFya2VyJykuYXR0cihcImNoZWNrZWRcIikpO1xyXG4vLyAgfVxyXG5cclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgc3RhdHVzOiByZXN1bHRTdGF0dXMsXHJcbiAgICBub2Rlczogbm9kZXNcclxuICB9O1xyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLy8gcGFyYW06IHtjbGFzczogc2JnbmNsYXNzLCBuYW1lOiBwcm9wZXJ0eU5hbWUsIHZhbHVlOiB2YWx1ZX1cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0RGVmYXVsdFByb3BlcnR5ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9IHBhcmFtLmNsYXNzO1xyXG4gIHZhciBuYW1lID0gcGFyYW0ubmFtZTtcclxuICB2YXIgdmFsdWUgPSBwYXJhbS52YWx1ZTtcclxuICB2YXIgY2xhc3NEZWZhdWx0cyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbc2JnbmNsYXNzXTtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgY2xhc3M6IHNiZ25jbGFzcyxcclxuICAgIG5hbWU6IG5hbWUsXHJcbiAgICB2YWx1ZTogY2xhc3NEZWZhdWx0cy5oYXNPd25Qcm9wZXJ0eShuYW1lKSA/IGNsYXNzRGVmYXVsdHNbbmFtZV0gOiB1bmRlZmluZWRcclxuICB9O1xyXG5cclxuICBjbGFzc0RlZmF1bHRzW25hbWVdID0gdmFsdWU7XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vLyBTZWN0aW9uIEVuZFxyXG4vLyBzYmduIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7Il19
