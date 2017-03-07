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

// Section End
// sbgn action functions

module.exports = undoRedoActionFunctions;
},{"./element-utilities":3,"./lib-utilities":4}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9saWItdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbjdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCl7XG4gIHZhciBjaGlzZSA9IHdpbmRvdy5jaGlzZSA9IGZ1bmN0aW9uKF9vcHRpb25zLCBfbGlicykge1xuICAgIHZhciBsaWJzID0ge307XG4gICAgbGlicy5qUXVlcnkgPSBfbGlicy5qUXVlcnkgfHwgalF1ZXJ5O1xuICAgIGxpYnMuY3l0b3NjYXBlID0gX2xpYnMuY3l0b3NjYXBlIHx8IGN5dG9zY2FwZTtcbiAgICBsaWJzLnNiZ252aXogPSBfbGlicy5zYmdudml6IHx8IHNiZ252aXo7XG4gICAgbGlicy5zYXZlQXMgPSBfbGlicy5maWxlc2F2ZXJqcyA/IF9saWJzLmZpbGVzYXZlcmpzLnNhdmVBcyA6IHNhdmVBcztcbiAgICBcbiAgICBsaWJzLnNiZ252aXooX29wdGlvbnMsIF9saWJzKTsgLy8gSW5pdGlsaXplIHNiZ252aXpcbiAgICBcbiAgICAvLyBTZXQgdGhlIGxpYnJhcmllcyB0byBhY2Nlc3MgdGhlbSBmcm9tIGFueSBmaWxlXG4gICAgdmFyIGxpYlV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKTtcbiAgICBsaWJVdGlsaXRpZXMuc2V0TGlicyhsaWJzKTtcbiAgICBcbiAgICB2YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcycpO1xuICAgIHZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMoX29wdGlvbnMpOyAvLyBFeHRlbmRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9uc1xuICAgIFxuICAgIC8vIFVwZGF0ZSBzdHlsZSBhbmQgYmluZCBldmVudHNcbiAgICB2YXIgY3lTdHlsZUFuZEV2ZW50cyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMnKTtcbiAgICBjeVN0eWxlQW5kRXZlbnRzKGxpYnMuc2JnbnZpeik7XG4gICAgXG4gICAgLy8gUmVnaXN0ZXIgdW5kby9yZWRvIGFjdGlvbnNcbiAgICB2YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9yZWdpc3Rlci11bmRvLXJlZG8tYWN0aW9ucycpO1xuICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKG9wdGlvbnMudW5kb2FibGVEcmFnKTtcbiAgICBcbiAgICB2YXIgbWFpblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzJyk7XG4gICAgdmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcycpO1xuICAgIHZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XG4gICAgXG4gICAgLy8gRXhwb3NlIHRoZSBhcGlcbiAgICBcbiAgICAvLyBFeHBvc2UgdGhlIHByb3BlcnRpZXMgaW5oZXJpdGVkIGZyb20gc2JnbnZpelxuICAgIC8vIHRoZW4gb3ZlcnJpZGUgc29tZSBvZiB0aGVzZSBwcm9wZXJ0aWVzIGFuZCBleHBvc2Ugc29tZSBuZXcgcHJvcGVydGllc1xuICAgIGZvciAodmFyIHByb3AgaW4gbGlicy5zYmdudml6KSB7XG4gICAgICBjaGlzZVtwcm9wXSA9IGxpYnMuc2JnbnZpeltwcm9wXTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXhwb3NlIGVhY2ggbWFpbiB1dGlsaXR5IHNlcGVyYXRlbHlcbiAgICBmb3IgKHZhciBwcm9wIGluIG1haW5VdGlsaXRpZXMpIHtcbiAgICAgIGNoaXNlW3Byb3BdID0gbWFpblV0aWxpdGllc1twcm9wXTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXhwb3NlIGVsZW1lbnRVdGlsaXRpZXMgYW5kIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zIGFzIGlzXG4gICAgY2hpc2UuZWxlbWVudFV0aWxpdGllcyA9IGVsZW1lbnRVdGlsaXRpZXM7XG4gICAgY2hpc2UudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcbiAgfTtcbiAgXG4gIGlmICggdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBjaGlzZTtcbiAgfVxufSkoKTsiLCJ2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyICQgPSBsaWJzLmpRdWVyeTtcbnZhciBvcHRpb25zID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJykuZ2V0T3B0aW9ucygpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzYmdudml6KSB7XG4gIC8vSGVscGVyc1xuICBcbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyB0byBiZSBjYWxsZWQgYWZ0ZXIgbm9kZXMgYXJlIHJlc2l6ZWQgdGhyb3VoIHRoZSBub2RlIHJlc2l6ZSBleHRlbnNpb24gb3IgdGhyb3VnaCB1bmRvL3JlZG8gYWN0aW9uc1xuICB2YXIgbm9kZVJlc2l6ZUVuZEZ1bmN0aW9uID0gZnVuY3Rpb24gKG5vZGVzKSB7XG4gICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICB2YXIgdyA9IG5vZGUud2lkdGgoKTtcbiAgICAgIHZhciBoID0gbm9kZS5oZWlnaHQoKTtcblxuICAgICAgbm9kZS5yZW1vdmVTdHlsZSgnd2lkdGgnKTtcbiAgICAgIG5vZGUucmVtb3ZlU3R5bGUoJ2hlaWdodCcpO1xuXG4gICAgICBub2RlLmRhdGEoJ2Jib3gnKS53ID0gdztcbiAgICAgIG5vZGUuZGF0YSgnYmJveCcpLmggPSBoO1xuICAgIH1cbiAgICBjeS5lbmRCYXRjaCgpO1xuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG4gIFxuICAvLyBVcGRhdGUgY3kgc3R5bGVzaGVldFxuICB2YXIgdXBhdGVTdHlsZVNoZWV0ID0gZnVuY3Rpb24oKSB7XG4gICAgY3kuc3R5bGUoKVxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2xhYmVsc2l6ZV1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2ZvbnQtc2l6ZSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgLy8gSWYgdGhlIG5vZGUgaGFzIGxhYmVsc2l6ZSBkYXRhIGNoZWNrIGFkanVzdE5vZGVMYWJlbEZvbnRTaXplQXV0b21hdGljYWxseSBvcHRpb24uXG4gICAgICAgIC8vIElmIGl0IGlzIG5vdCBzZXQgdXNlIGxhYmVsc2l6ZSBkYXRhIGFzIGZvbnQgc2l6ZSBlbGVzLiBVc2UgZ2V0TGFiZWxUZXh0U2l6ZSBtZXRob2QuXG4gICAgICAgIHZhciBvcHQgPSBvcHRpb25zLmFkanVzdE5vZGVMYWJlbEZvbnRTaXplQXV0b21hdGljYWxseTtcbiAgICAgICAgdmFyIGFkanVzdCA9IHR5cGVvZiBvcHQgPT09ICdmdW5jdGlvbicgPyBvcHQoKSA6IG9wdDtcbiAgICAgICAgaWYgKCFhZGp1c3QpIHtcbiAgICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2xhYmVsc2l6ZScpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRMYWJlbFRleHRTaXplKGVsZSk7XG4gICAgICB9XG4gICAgfSkudXBkYXRlKCk7XG4gIH07XG4gIFxuICAvLyBCaW5kIGV2ZW50c1xuICB2YXIgYmluZEN5RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgY3kub24oXCJub2RlcmVzaXplLnJlc2l6ZWVuZFwiLCBmdW5jdGlvbiAoZXZlbnQsIHR5cGUsIG5vZGUpIHtcbiAgICAgIG5vZGVSZXNpemVFbmRGdW5jdGlvbihub2RlKTtcbiAgICB9KTtcblxuICAgIGN5Lm9uKFwiYWZ0ZXJEb1wiLCBmdW5jdGlvbiAoZXZlbnQsIGFjdGlvbk5hbWUsIGFyZ3MpIHtcbiAgICAgIGlmIChhY3Rpb25OYW1lID09PSAnY2hhbmdlUGFyZW50Jykge1xuICAgICAgICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY3kub24oXCJhZnRlclVuZG9cIiwgZnVuY3Rpb24gKGV2ZW50LCBhY3Rpb25OYW1lLCBhcmdzKSB7XG4gICAgICBpZiAoYWN0aW9uTmFtZSA9PT0gJ3Jlc2l6ZScpIHtcbiAgICAgICAgbm9kZVJlc2l6ZUVuZEZ1bmN0aW9uKGFyZ3Mubm9kZSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChhY3Rpb25OYW1lID09PSAnY2hhbmdlUGFyZW50Jykge1xuICAgICAgICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY3kub24oXCJhZnRlclJlZG9cIiwgZnVuY3Rpb24gKGV2ZW50LCBhY3Rpb25OYW1lLCBhcmdzKSB7XG4gICAgICBpZiAoYWN0aW9uTmFtZSA9PT0gJ3Jlc2l6ZScpIHtcbiAgICAgICAgbm9kZVJlc2l6ZUVuZEZ1bmN0aW9uKGFyZ3Mubm9kZSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChhY3Rpb25OYW1lID09PSAnY2hhbmdlUGFyZW50Jykge1xuICAgICAgICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICAvLyBIZWxwZXJzIEVuZFxuICBcbiAgJChkb2N1bWVudCkub24oJ3VwZGF0ZUdyYXBoRW5kJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBjeS5zdGFydEJhdGNoKCk7XG4gICAgLy8gSW5pdGlsaXplIGZvbnQgcmVsYXRlZCBkYXRhIG9mIHRoZSBlbGVtZW50cyB3aGljaCBjYW4gaGF2ZSBsYWJlbFxuICAgIGN5Lm5vZGVzKCkuZWFjaChmdW5jdGlvbihpLCBlbGUpIHtcbiAgICAgIGlmIChlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOTGFiZWwoZWxlKSkge1xuICAgICAgICB2YXIgX2NsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJykucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcbiAgICAgICAgZWxlLmRhdGEoJ2xhYmVsc2l6ZScsIGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbX2NsYXNzXS5sYWJlbHNpemUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGN5LmVuZEJhdGNoKCk7XG4gIH0pO1xuICBcbiAgLy8gRG8gdGhlc2UganVzdCBvbmUgdGltZVxuICAkKGRvY3VtZW50KS5vbmUoJ3VwZGF0ZUdyYXBoRW5kJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB1cGF0ZVN0eWxlU2hlZXQoKTtcbiAgICBiaW5kQ3lFdmVudHMoKTtcbiAgfSk7XG59OyIsIi8vIEV4dGVuZHMgc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBzYmdudml6ID0gbGlicy5zYmdudml6O1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzO1xudmFyIG9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKS5nZXRPcHRpb25zKCk7XG5cbmVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXMgPSB7XG4gIFwicHJvY2Vzc1wiOiB7XG4gICAgd2lkdGg6IDE1LFxuICAgIGhlaWdodDogMTVcbiAgfSxcbiAgXCJvbWl0dGVkIHByb2Nlc3NcIjoge1xuICAgIHdpZHRoOiAxNSxcbiAgICBoZWlnaHQ6IDE1XG4gIH0sXG4gIFwidW5jZXJ0YWluIHByb2Nlc3NcIjoge1xuICAgIHdpZHRoOiAxNSxcbiAgICBoZWlnaHQ6IDE1XG4gIH0sXG4gIFwiYXNzb2NpYXRpb25wcm9jZXNzXCI6IHsgLy8gVE9ETyBub3Qgc3VyZSBpZiBsZWdpdCwgXCJhc3NvY2lhdGlvblwiIGp1c3QgYmVsb3dcbiAgICB3aWR0aDogMTUsXG4gICAgaGVpZ2h0OiAxNVxuICB9LFxuICBcImFzc29jaWF0aW9uXCI6IHtcbiAgICB3aWR0aDogMTUsXG4gICAgaGVpZ2h0OiAxNVxuICB9LFxuICBcImRpc3NvY2lhdGlvblwiOiB7XG4gICAgd2lkdGg6IDE1LFxuICAgIGhlaWdodDogMTVcbiAgfSxcbiAgXCJtYWNyb21vbGVjdWxlXCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICBsYWJlbHNpemU6IDExXG4gIH0sXG4gIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgIGxhYmVsc2l6ZTogMTFcbiAgfSxcbiAgXCJzaW1wbGUgY2hlbWljYWxcIjoge1xuICAgIHdpZHRoOiAzNSxcbiAgICBoZWlnaHQ6IDM1LFxuICAgIGxhYmVsc2l6ZTogMTFcbiAgfSxcbiAgXCJzb3VyY2UgYW5kIHNpbmtcIjoge1xuICAgIHdpZHRoOiAyNSxcbiAgICBoZWlnaHQ6IDI1LFxuICAgIGxhYmVsc2l6ZTogMTFcbiAgfSxcbiAgXCJ0YWdcIjoge1xuICAgIHdpZHRoOiAzNSxcbiAgICBoZWlnaHQ6IDM1LFxuICAgIGxhYmVsc2l6ZTogMTFcbiAgfSxcbiAgXCJwaGVub3R5cGVcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgIGxhYmVsc2l6ZTogMTFcbiAgfSxcbiAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgIGxhYmVsc2l6ZTogMTFcbiAgfSxcbiAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICBsYWJlbHNpemU6IDExXG4gIH0sXG4gIFwiY29tcGxleFwiOiB7XG4gICAgd2lkdGg6IDEwMCxcbiAgICBoZWlnaHQ6IDEwMCxcbiAgICBsYWJlbHNpemU6IDExXG4gIH0sXG4gIFwiY29tcGFydG1lbnRcIjoge1xuICAgIHdpZHRoOiAxMDAsXG4gICAgaGVpZ2h0OiAxMDAsXG4gICAgbGFiZWxzaXplOiAxMVxuICB9LFxuICBcImFuZFwiOiB7XG4gICAgd2lkdGg6IDI1LFxuICAgIGhlaWdodDogMjUsXG4gICAgbGFiZWxzaXplOiAxMVxuICB9LFxuICBcIm9yXCI6IHtcbiAgICB3aWR0aDogMjUsXG4gICAgaGVpZ2h0OiAyNSxcbiAgICBsYWJlbHNpemU6IDExXG4gIH0sXG4gIFwibm90XCI6IHtcbiAgICB3aWR0aDogMjUsXG4gICAgaGVpZ2h0OiAyNSxcbiAgICBsYWJlbHNpemU6IDExXG4gIH1cbn07XG5cbi8vIFNlY3Rpb24gU3RhcnRcbi8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXG5cbmVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSA9IGZ1bmN0aW9uICh4LCB5LCBzYmduY2xhc3MsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcbiAgdmFyIGRlZmF1bHRQcm9wZXJ0aWVzID0gdGhpcy5kZWZhdWx0UHJvcGVydGllcztcbiAgdmFyIGRlZmF1bHRzID0gZGVmYXVsdFByb3BlcnRpZXNbc2JnbmNsYXNzXTtcblxuICB2YXIgd2lkdGggPSBkZWZhdWx0cyA/IGRlZmF1bHRzLndpZHRoIDogNTA7XG4gIHZhciBoZWlnaHQgPSBkZWZhdWx0cyA/IGRlZmF1bHRzLmhlaWdodCA6IDUwO1xuICBcbiAgdmFyIGNzcyA9IHt9O1xuICBcbiAgaWYgKGRlZmF1bHRzKSB7XG4gICAgaWYgKGRlZmF1bHRzWydib3JkZXItd2lkdGgnXSkge1xuICAgICAgY3NzWydib3JkZXItd2lkdGgnXSA9IGRlZmF1bHRzWydib3JkZXItd2lkdGgnXTtcbiAgICB9XG4gICAgXG4gICAgaWYgKGRlZmF1bHRzWydiYWNrZ3JvdW5kLWNvbG9yJ10pIHtcbiAgICAgIGNzc1snYmFja2dyb3VuZC1jb2xvciddID0gZGVmYXVsdHNbJ2JhY2tncm91bmQtY29sb3InXTtcbiAgICB9XG4gICAgXG4gICAgaWYgKGRlZmF1bHRzWydiYWNrZ3JvdW5kLW9wYWNpdHknXSkge1xuICAgICAgY3NzWydiYWNrZ3JvdW5kLW9wYWNpdHknXSA9IGRlZmF1bHRzWydiYWNrZ3JvdW5kLW9wYWNpdHknXTtcbiAgICB9XG4gICAgXG4gICAgaWYgKGRlZmF1bHRzWydib3JkZXItY29sb3InXSkge1xuICAgICAgY3NzWydib3JkZXItY29sb3InXSA9IGRlZmF1bHRzWydib3JkZXItY29sb3InXTtcbiAgICB9XG4gIH1cblxuICBpZiAodmlzaWJpbGl0eSkge1xuICAgIGNzcy52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcbiAgfVxuXG4gIGlmIChkZWZhdWx0cyAmJiBkZWZhdWx0cy5tdWx0aW1lcikge1xuICAgIHNiZ25jbGFzcyArPSBcIiBtdWx0aW1lclwiO1xuICB9XG4gIHZhciBkYXRhID0ge1xuICAgIGNsYXNzOiBzYmduY2xhc3MsXG4gICAgYmJveDoge1xuICAgICAgaDogaGVpZ2h0LFxuICAgICAgdzogd2lkdGgsXG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH0sXG4gICAgc3RhdGVzYW5kaW5mb3M6IFtdLFxuICAgIHBvcnRzOiBbXSxcbiAgICBsYWJlbHNpemU6IGVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbChzYmduY2xhc3MpID8gKGRlZmF1bHRzICYmIGRlZmF1bHRzLmxhYmVsc2l6ZSkgOiB1bmRlZmluZWQsXG4gICAgZm9udGZhbWlseTogZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkxhYmVsKHNiZ25jbGFzcykgPyAoZGVmYXVsdHMgJiYgZGVmYXVsdHMuZm9udGZhbWlseSkgOiB1bmRlZmluZWQsXG4gICAgZm9udHdlaWdodDogZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkxhYmVsKHNiZ25jbGFzcykgPyAoZGVmYXVsdHMgJiYgZGVmYXVsdHMuZm9udHdlaWdodCkgOiB1bmRlZmluZWQsXG4gICAgZm9udHN0eWxlOiBlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOTGFiZWwoc2JnbmNsYXNzKSA/IChkZWZhdWx0cyAmJiBkZWZhdWx0cy5mb250c3R5bGUpIDogdW5kZWZpbmVkLFxuICAgIGNsb25lbWFya2VyOiBkZWZhdWx0cyAmJiBkZWZhdWx0cy5jbG9uZW1hcmtlciA/IGRlZmF1bHRzLmNsb25lbWFya2VyIDogdW5kZWZpbmVkXG4gIH07XG5cbiAgaWYoaWQpIHtcbiAgICBkYXRhLmlkID0gaWQ7XG4gIH1cbiAgXG4gIGlmIChwYXJlbnQpIHtcbiAgICBkYXRhLnBhcmVudCA9IHBhcmVudDtcbiAgfVxuXG4gIHZhciBlbGVzID0gY3kuYWRkKHtcbiAgICBncm91cDogXCJub2Rlc1wiLFxuICAgIGRhdGE6IGRhdGEsXG4gICAgY3NzOiBjc3MsXG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfVxuICB9KTtcblxuICB2YXIgbmV3Tm9kZSA9IGVsZXNbZWxlcy5sZW5ndGggLSAxXTtcblxuICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xuICByZXR1cm4gbmV3Tm9kZTtcbn07XG5cbmVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHRhcmdldCwgc2JnbmNsYXNzLCBpZCwgdmlzaWJpbGl0eSkge1xuICB2YXIgZGVmYXVsdFByb3BlcnRpZXMgPSB0aGlzLmRlZmF1bHRQcm9wZXJ0aWVzO1xuICB2YXIgZGVmYXVsdHMgPSBkZWZhdWx0UHJvcGVydGllc1tzYmduY2xhc3NdO1xuICB2YXIgY3NzID0gZGVmYXVsdHMgPyB7XG4gICAgJ3dpZHRoJzogZGVmYXVsdHNbJ3dpZHRoJ11cbiAgfSA6IHt9O1xuICBcbiAgdmFyIGNzcyA9IHt9O1xuICBcbiAgaWYgKGRlZmF1bHRzKSB7XG4gICAgaWYgKGRlZmF1bHRzLndpZHRoKSB7XG4gICAgICBjc3Mud2lkdGggPSBkZWZhdWx0cy53aWR0aDtcbiAgICB9IFxuICAgIFxuICAgIGlmIChkZWZhdWx0c1snbGluZS1jb2xvciddKSB7XG4gICAgICBjc3NbJ2xpbmUtY29sb3InXSA9IGRlZmF1bHRzWydsaW5lLWNvbG9yJ107XG4gICAgfVxuICB9XG5cbiAgaWYgKHZpc2liaWxpdHkpIHtcbiAgICBjc3MudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XG4gIH1cblxuICB2YXIgZGF0YSA9IHtcbiAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICBjbGFzczogc2JnbmNsYXNzXG4gIH07XG4gIFxuICBpZihpZCkge1xuICAgIGRhdGEuaWQgPSBpZDtcbiAgfVxuXG4gIHZhciBlbGVzID0gY3kuYWRkKHtcbiAgICBncm91cDogXCJlZGdlc1wiLFxuICAgIGRhdGE6IGRhdGEsXG4gICAgY3NzOiBjc3NcbiAgfSk7XG5cbiAgdmFyIG5ld0VkZ2UgPSBlbGVzW2VsZXMubGVuZ3RoIC0gMV07XG4gIFxuICByZXR1cm4gbmV3RWRnZTtcbn07XG5cbi8qXG4gKiBUaGlzIG1ldGhvZCBhc3N1bWVzIHRoYXQgcGFyYW0ubm9kZXNUb01ha2VDb21wb3VuZCBjb250YWlucyBhdCBsZWFzdCBvbmUgbm9kZVxuICogYW5kIGFsbCBvZiB0aGUgbm9kZXMgaW5jbHVkaW5nIGluIGl0IGhhdmUgdGhlIHNhbWUgcGFyZW50LiBJdCBjcmVhdGVzIGEgY29tcG91bmQgZm90IHRoZSBnaXZlbiBub2RlcyBhbiBoYXZpbmcgdGhlIGdpdmVuIHR5cGUuXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKG5vZGVzVG9NYWtlQ29tcG91bmQsIGNvbXBvdW5kVHlwZSkge1xuICB2YXIgb2xkUGFyZW50SWQgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJwYXJlbnRcIik7XG4gIC8vIFRoZSBwYXJlbnQgb2YgbmV3IGNvbXBvdW5kIHdpbGwgYmUgdGhlIG9sZCBwYXJlbnQgb2YgdGhlIG5vZGVzIHRvIG1ha2UgY29tcG91bmQuIHgsIHkgYW5kIGlkIHBhcmFtZXRlcnMgYXJlIG5vdCBzZXQuXG4gIHZhciBuZXdDb21wb3VuZCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29tcG91bmRUeXBlLCB1bmRlZmluZWQsIG9sZFBhcmVudElkKTtcbiAgdmFyIG5ld0NvbXBvdW5kSWQgPSBuZXdDb21wb3VuZC5pZCgpO1xuICBub2Rlc1RvTWFrZUNvbXBvdW5kLm1vdmUoe3BhcmVudDogbmV3Q29tcG91bmRJZH0pO1xuICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xuICByZXR1cm4gbmV3Q29tcG91bmQ7XG59O1xuXG4vKlxuICogUmVtb3ZlcyBhIGNvbXBvdW5kLiBCZWZvcmUgdGhlIHJlbW92YWwgb3BlcmF0aW9uIG1vdmVzIHRoZSBjaGlsZHJlbiBvZiB0aGF0IGNvbXBvdW5kIHRvIHRoZSBwYXJlbnQgb2YgdGhlIGNvbXBvdW5kLlxuICogUmV0dXJucyBvbGQgY2hpbGRyZW4gb2YgdGhlIGNvbXBvdW5kIHdoaWNoIGFyZSBtb3ZlZCB0byBhbm90aGVyIHBhcmVudCBhbmQgdGhlIHJlbW92ZWQgY29tcG91bmQgdG8gcmVzdG9yZSBiYWNrIGxhdGVyLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLnJlbW92ZUNvbXBvdW5kID0gZnVuY3Rpb24gKGNvbXBvdW5kVG9SZW1vdmUpIHtcbiAgdmFyIGNvbXBvdW5kSWQgPSBjb21wb3VuZFRvUmVtb3ZlLmlkKCk7XG4gIHZhciBuZXdQYXJlbnRJZCA9IGNvbXBvdW5kVG9SZW1vdmUuZGF0YShcInBhcmVudFwiKTtcbiAgbmV3UGFyZW50SWQgPSBuZXdQYXJlbnRJZCA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IG5ld1BhcmVudElkO1xuICB2YXIgY2hpbGRyZW5PZkNvbXBvdW5kID0gY29tcG91bmRUb1JlbW92ZS5jaGlsZHJlbigpO1xuXG4gIGNoaWxkcmVuT2ZDb21wb3VuZC5tb3ZlKHtwYXJlbnQ6IG5ld1BhcmVudElkfSk7XG4gIHZhciByZW1vdmVkQ29tcG91bmQgPSBjb21wb3VuZFRvUmVtb3ZlLnJlbW92ZSgpO1xuICBcbiAgcmV0dXJuIHtcbiAgICBjaGlsZHJlbk9mQ29tcG91bmQ6IGNoaWxkcmVuT2ZDb21wb3VuZCxcbiAgICByZW1vdmVkQ29tcG91bmQ6IHJlbW92ZWRDb21wb3VuZFxuICB9O1xufTtcblxuLypcbiAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxuICogaW4gdGhlIGNvbXBsZXguIFBhcmFtZXRlcnMgYXJlIGV4cGxhaW5lZCBiZWxvdy5cbiAqIHRlbXBsYXRlVHlwZTogVGhlIHR5cGUgb2YgdGhlIHRlbXBsYXRlIHJlYWN0aW9uLiBJdCBtYXkgYmUgJ2Fzc29jaWF0aW9uJyBvciAnZGlzc29jaWF0aW9uJyBmb3Igbm93LlxuICogbWFjcm9tb2xlY3VsZUxpc3Q6IFRoZSBsaXN0IG9mIHRoZSBuYW1lcyBvZiBtYWNyb21vbGVjdWxlcyB3aGljaCB3aWxsIGludm9sdmUgaW4gdGhlIHJlYWN0aW9uLlxuICogY29tcGxleE5hbWU6IFRoZSBuYW1lIG9mIHRoZSBjb21wbGV4IGluIHRoZSByZWFjdGlvbi5cbiAqIHByb2Nlc3NQb3NpdGlvbjogVGhlIG1vZGFsIHBvc2l0aW9uIG9mIHRoZSBwcm9jZXNzIGluIHRoZSByZWFjdGlvbi4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgdGhlIGNlbnRlciBvZiB0aGUgY2FudmFzLlxuICogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiBUaGlzIG9wdGlvbiB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY29zZS1iaWxrZW50IGxheW91dCB3aXRoIHRoZSBzYW1lIG5hbWUuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDE1LlxuICogdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IFRoaXMgb3B0aW9uIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBjb3NlLWJpbGtlbnQgbGF5b3V0IHdpdGggdGhlIHNhbWUgbmFtZS4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgMTUuXG4gKiBlZGdlTGVuZ3RoOiBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgcHJvY2VzcyBhbmQgdGhlIG1hY3JvbW9sZWN1bGVzIGF0IHRoZSBib3RoIHNpZGVzLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAodGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCkge1xuICB2YXIgZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW1wibWFjcm9tb2xlY3VsZVwiXTtcbiAgdmFyIHRlbXBsYXRlVHlwZSA9IHRlbXBsYXRlVHlwZTtcbiAgdmFyIHByb2Nlc3NXaWR0aCA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbdGVtcGxhdGVUeXBlXSA/IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbdGVtcGxhdGVUeXBlXS53aWR0aCA6IDUwO1xuICB2YXIgbWFjcm9tb2xlY3VsZVdpZHRoID0gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMgPyBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcy53aWR0aCA6IDUwO1xuICB2YXIgbWFjcm9tb2xlY3VsZUhlaWdodCA9IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID8gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMuaGVpZ2h0IDogNTA7XG4gIHZhciBwcm9jZXNzUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24gPyBwcm9jZXNzUG9zaXRpb24gOiBlbGVtZW50VXRpbGl0aWVzLmNvbnZlcnRUb01vZGVsUG9zaXRpb24oe3g6IGN5LndpZHRoKCkgLyAyLCB5OiBjeS5oZWlnaHQoKSAvIDJ9KTtcbiAgdmFyIG1hY3JvbW9sZWN1bGVMaXN0ID0gbWFjcm9tb2xlY3VsZUxpc3Q7XG4gIHZhciBjb21wbGV4TmFtZSA9IGNvbXBsZXhOYW1lO1xuICB2YXIgbnVtT2ZNYWNyb21vbGVjdWxlcyA9IG1hY3JvbW9sZWN1bGVMaXN0Lmxlbmd0aDtcbiAgdmFyIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA9IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA/IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA6IDE1O1xuICB2YXIgdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPSB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA/IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsIDogMTU7XG4gIHZhciBlZGdlTGVuZ3RoID0gZWRnZUxlbmd0aCA/IGVkZ2VMZW5ndGggOiA2MDtcblxuICBjeS5zdGFydEJhdGNoKCk7XG5cbiAgdmFyIHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzO1xuICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XG4gICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgfVxuICBlbHNlIHtcbiAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xuICB9XG5cbiAgLy9DcmVhdGUgdGhlIHByb2Nlc3MgaW4gdGVtcGxhdGUgdHlwZVxuICB2YXIgcHJvY2VzcyA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksIHRlbXBsYXRlVHlwZSk7XG4gIHByb2Nlc3MuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgLy9EZWZpbmUgdGhlIHN0YXJ0aW5nIHkgcG9zaXRpb25cbiAgdmFyIHlQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi55IC0gKChudW1PZk1hY3JvbW9sZWN1bGVzIC0gMSkgLyAyKSAqIChtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsKTtcblxuICAvL0NyZWF0ZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mTWFjcm9tb2xlY3VsZXM7IGkrKykge1xuICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzLCB5UG9zaXRpb24sIFwibWFjcm9tb2xlY3VsZVwiKTtcbiAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgIG5ld05vZGUuZGF0YSgnbGFiZWwnLCBtYWNyb21vbGVjdWxlTGlzdFtpXSk7XG5cbiAgICAvL2NyZWF0ZSB0aGUgZWRnZSBjb25uZWN0ZWQgdG8gdGhlIG5ldyBtYWNyb21vbGVjdWxlXG4gICAgdmFyIG5ld0VkZ2U7XG4gICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdOb2RlLmlkKCksIHByb2Nlc3MuaWQoKSwgJ2NvbnN1bXB0aW9uJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIG5ld05vZGUuaWQoKSwgJ3Byb2R1Y3Rpb24nKTtcbiAgICB9XG5cbiAgICBuZXdFZGdlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgLy91cGRhdGUgdGhlIHkgcG9zaXRpb25cbiAgICB5UG9zaXRpb24gKz0gbWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDtcbiAgfVxuXG4gIC8vQ3JlYXRlIHRoZSBjb21wbGV4IGluY2x1ZGluZyBtYWNyb21vbGVjdWxlcyBpbnNpZGUgb2YgaXRcbiAgLy9UZW1wcm9yYXJpbHkgYWRkIGl0IHRvIHRoZSBwcm9jZXNzIHBvc2l0aW9uIHdlIHdpbGwgbW92ZSBpdCBhY2NvcmRpbmcgdG8gdGhlIGxhc3Qgc2l6ZSBvZiBpdFxuICB2YXIgY29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksICdjb21wbGV4Jyk7XG4gIGNvbXBsZXguZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gIGNvbXBsZXguZGF0YSgnanVzdEFkZGVkTGF5b3V0Tm9kZScsIHRydWUpO1xuXG4gIC8vSWYgYSBuYW1lIGlzIHNwZWNpZmllZCBmb3IgdGhlIGNvbXBsZXggc2V0IGl0cyBsYWJlbCBhY2NvcmRpbmdseVxuICBpZiAoY29tcGxleE5hbWUpIHtcbiAgICBjb21wbGV4LmRhdGEoJ2xhYmVsJywgY29tcGxleE5hbWUpO1xuICB9XG5cbiAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubm5lY3RlZCB0byB0aGUgY29tcGxleFxuICB2YXIgZWRnZU9mQ29tcGxleDtcbiAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgIGVkZ2VPZkNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBjb21wbGV4LmlkKCksICdwcm9kdWN0aW9uJyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWRnZU9mQ29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShjb21wbGV4LmlkKCksIHByb2Nlc3MuaWQoKSwgJ2NvbnN1bXB0aW9uJyk7XG4gIH1cbiAgZWRnZU9mQ29tcGxleC5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAvL0NyZWF0ZSB0aGUgbWFjcm9tb2xlY3VsZXMgaW5zaWRlIHRoZSBjb21wbGV4XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtT2ZNYWNyb21vbGVjdWxlczsgaSsrKSB7XG4gICAgLy8gQWRkIGEgbWFjcm9tb2xlY3VsZSBub3QgaGF2aW5nIGEgcHJldmlvdXNseSBkZWZpbmVkIGlkIGFuZCBoYXZpbmcgdGhlIGNvbXBsZXggY3JlYXRlZCBpbiB0aGlzIHJlYWN0aW9uIGFzIHBhcmVudFxuICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKGNvbXBsZXgucG9zaXRpb24oJ3gnKSwgY29tcGxleC5wb3NpdGlvbigneScpLCBcIm1hY3JvbW9sZWN1bGVcIiwgdW5kZWZpbmVkLCBjb21wbGV4LmlkKCkpO1xuICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgbmV3Tm9kZS5kYXRhKCdsYWJlbCcsIG1hY3JvbW9sZWN1bGVMaXN0W2ldKTtcbiAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcbiAgfVxuICBcbiAgY3kuZW5kQmF0Y2goKTtcblxuICB2YXIgbGF5b3V0Tm9kZXMgPSBjeS5ub2RlcygnW2p1c3RBZGRlZExheW91dE5vZGVdJyk7XG4gIGxheW91dE5vZGVzLnJlbW92ZURhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnKTtcbiAgbGF5b3V0Tm9kZXMubGF5b3V0KHtcbiAgICBuYW1lOiAnY29zZS1iaWxrZW50JyxcbiAgICByYW5kb21pemU6IGZhbHNlLFxuICAgIGZpdDogZmFsc2UsXG4gICAgYW5pbWF0ZTogZmFsc2UsXG4gICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXG4gICAgdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLFxuICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vcmUtcG9zaXRpb24gdGhlIG5vZGVzIGluc2lkZSB0aGUgY29tcGxleFxuICAgICAgdmFyIHN1cHBvc2VkWFBvc2l0aW9uO1xuICAgICAgdmFyIHN1cHBvc2VkWVBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnk7XG5cbiAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICAgICAgc3VwcG9zZWRYUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgY29tcGxleC5vdXRlcldpZHRoKCkgLyAyO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHN1cHBvc2VkWFBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIGNvbXBsZXgub3V0ZXJXaWR0aCgpIC8gMjtcbiAgICAgIH1cblxuICAgICAgdmFyIHBvc2l0aW9uRGlmZlggPSBzdXBwb3NlZFhQb3NpdGlvbiAtIGNvbXBsZXgucG9zaXRpb24oJ3gnKTtcbiAgICAgIHZhciBwb3NpdGlvbkRpZmZZID0gc3VwcG9zZWRZUG9zaXRpb24gLSBjb21wbGV4LnBvc2l0aW9uKCd5Jyk7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyh7eDogcG9zaXRpb25EaWZmWCwgeTogcG9zaXRpb25EaWZmWX0sIGNvbXBsZXgpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy9maWx0ZXIgdGhlIGp1c3QgYWRkZWQgZWxlbWVtdHMgdG8gcmV0dXJuIHRoZW0gYW5kIHJlbW92ZSBqdXN0IGFkZGVkIG1hcmtcbiAgdmFyIGVsZXMgPSBjeS5lbGVtZW50cygnW2p1c3RBZGRlZF0nKTtcbiAgZWxlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWQnKTtcbiAgXG4gIHNiZ252aXoucmVmcmVzaFBhZGRpbmdzKCk7XG4gIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgZWxlcy5zZWxlY3QoKTtcbiAgXG4gIHJldHVybiBlbGVzOyAvLyBSZXR1cm4gdGhlIGp1c3QgYWRkZWQgZWxlbWVudHNcbn07XG5cbi8qXG4gKiBNb3ZlIHRoZSBub2RlcyB0byBhIG5ldyBwYXJlbnQgYW5kIGNoYW5nZSB0aGVpciBwb3NpdGlvbiBpZiBwb3NzRGlmZiBwYXJhbXMgYXJlIHNldC5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQgPSBmdW5jdGlvbihub2RlcywgbmV3UGFyZW50LCBwb3NEaWZmWCwgcG9zRGlmZlkpIHtcbiAgdmFyIG5ld1BhcmVudElkID0gdHlwZW9mIG5ld1BhcmVudCA9PT0gJ3N0cmluZycgPyBuZXdQYXJlbnQgOiBuZXdQYXJlbnQuaWQoKTtcbiAgbm9kZXMubW92ZSh7XCJwYXJlbnRcIjogbmV3UGFyZW50SWR9KTtcbiAgZWxlbWVudFV0aWxpdGllcy5tb3ZlTm9kZXMoe3g6IHBvc0RpZmZYLCB5OiBwb3NEaWZmWX0sIG5vZGVzKTtcbn07XG5cbi8vIFJlc2l6ZSBnaXZlbiBub2RlcyBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHkgb25lIG9mIHdpZHRoIG9yIGhlaWdodCBzaG91bGQgbm90IGJlIHNldC5cbmVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMgPSBmdW5jdGlvbiAobm9kZXMsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHZhciByYXRpbyA9IHVuZGVmaW5lZDtcbiAgICB2YXIgZWxlTXVzdEJlU3F1YXJlID0gZWxlbWVudFV0aWxpdGllcy5tdXN0QmVTcXVhcmUobm9kZS5kYXRhKCdjbGFzcycpKTtcblxuICAgIC8vIE5vdGUgdGhhdCBib3RoIHdpZHRoIGFuZCBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5XG4gICAgaWYgKHdpZHRoKSB7XG4gICAgICBpZiAodXNlQXNwZWN0UmF0aW8gfHwgZWxlTXVzdEJlU3F1YXJlKSB7XG4gICAgICAgIHJhdGlvID0gd2lkdGggLyBub2RlLndpZHRoKCk7XG4gICAgICB9XG5cbiAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IHdpZHRoO1xuICAgIH1cblxuICAgIGlmIChoZWlnaHQpIHtcbiAgICAgIGlmICh1c2VBc3BlY3RSYXRpbyB8fCBlbGVNdXN0QmVTcXVhcmUpIHtcbiAgICAgICAgcmF0aW8gPSBoZWlnaHQgLyBub2RlLmhlaWdodCgpO1xuICAgICAgfVxuXG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBoZWlnaHQ7XG4gICAgfVxuXG4gICAgaWYgKHJhdGlvICYmICFoZWlnaHQpIHtcbiAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IG5vZGUuaGVpZ2h0KCkgKiByYXRpbztcbiAgICB9XG4gICAgZWxzZSBpZiAocmF0aW8gJiYgIXdpZHRoKSB7XG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSBub2RlLndpZHRoKCkgKiByYXRpbztcbiAgICB9XG4gIH1cbn07XG5cbi8vIFNlY3Rpb24gRW5kXG4vLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xuXG4vLyBTZWN0aW9uIFN0YXJ0XG4vLyBDb21tb24gZWxlbWVudCBwcm9wZXJ0aWVzXG5cbi8vIEdldCBjb21tb24gcHJvcGVydGllcyBvZiBnaXZlbiBlbGVtZW50cy4gUmV0dXJucyBudWxsIGlmIHRoZSBnaXZlbiBlbGVtZW50IGxpc3QgaXMgZW1wdHkgb3IgdGhlXG4vLyBwcm9wZXJ0eSBpcyBub3QgY29tbW9uIGZvciBhbGwgZWxlbWVudHMuIGRhdGFPckNzcyBwYXJhbWV0ZXIgc3BlY2lmeSB3aGV0aGVyIHRvIGNoZWNrIHRoZSBwcm9wZXJ0eSBvbiBkYXRhIG9yIGNzcy5cbi8vIFRoZSBkZWZhdWx0IHZhbHVlIGZvciBpdCBpcyBkYXRhLiBJZiBwcm9wZXJ0eU5hbWUgcGFyYW1ldGVyIGlzIGdpdmVuIGFzIGEgZnVuY3Rpb24gaW5zdGVhZCBvZiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIFxuLy8gcHJvcGVydHkgbmFtZSB0aGVuIHVzZSB3aGF0IHRoYXQgZnVuY3Rpb24gcmV0dXJucy5cbmVsZW1lbnRVdGlsaXRpZXMuZ2V0Q29tbW9uUHJvcGVydHkgPSBmdW5jdGlvbiAoZWxlbWVudHMsIHByb3BlcnR5TmFtZSwgZGF0YU9yQ3NzKSB7XG4gIGlmIChlbGVtZW50cy5sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIGlzRnVuY3Rpb247XG4gIC8vIElmIHdlIGFyZSBub3QgY29tcGFyaW5nIHRoZSBwcm9wZXJ0aWVzIGRpcmVjdGx5IHVzZXJzIGNhbiBzcGVjaWZ5IGEgZnVuY3Rpb24gYXMgd2VsbFxuICBpZiAodHlwZW9mIHByb3BlcnR5TmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGlzRnVuY3Rpb24gPSB0cnVlO1xuICB9XG5cbiAgLy8gVXNlIGRhdGEgYXMgZGVmYXVsdFxuICBpZiAoIWlzRnVuY3Rpb24gJiYgIWRhdGFPckNzcykge1xuICAgIGRhdGFPckNzcyA9ICdkYXRhJztcbiAgfVxuXG4gIHZhciB2YWx1ZSA9IGlzRnVuY3Rpb24gPyBwcm9wZXJ0eU5hbWUoZWxlbWVudHNbMF0pIDogZWxlbWVudHNbMF1bZGF0YU9yQ3NzXShwcm9wZXJ0eU5hbWUpO1xuXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoICggaXNGdW5jdGlvbiA/IHByb3BlcnR5TmFtZShlbGVtZW50c1tpXSkgOiBlbGVtZW50c1tpXVtkYXRhT3JDc3NdKHByb3BlcnR5TmFtZSkgKSAhPSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuLy8gUmV0dXJucyBpZiB0aGUgZnVuY3Rpb24gcmV0dXJucyBhIHRydXRoeSB2YWx1ZSBmb3IgYWxsIG9mIHRoZSBnaXZlbiBlbGVtZW50cy5cbmVsZW1lbnRVdGlsaXRpZXMudHJ1ZUZvckFsbEVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZW1lbnRzLCBmY24pIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGlmICghZmNuKGVsZW1lbnRzW2ldKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgY2FuIGhhdmUgc2JnbmNhcmRpbmFsaXR5XG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOQ2FyZGluYWxpdHkgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuXG4gIHJldHVybiBlbGUuZGF0YSgnY2xhc3MnKSA9PSAnY29uc3VtcHRpb24nIHx8IGVsZS5kYXRhKCdjbGFzcycpID09ICdwcm9kdWN0aW9uJztcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZSBlbGVtZW50IGNhbiBoYXZlIHNiZ25sYWJlbFxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkxhYmVsID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICByZXR1cm4gc2JnbmNsYXNzICE9ICdhbmQnICYmIHNiZ25jbGFzcyAhPSAnb3InICYmIHNiZ25jbGFzcyAhPSAnbm90J1xuICAgICAgICAgICYmIHNiZ25jbGFzcyAhPSAnYXNzb2NpYXRpb24nICYmIHNiZ25jbGFzcyAhPSAnZGlzc29jaWF0aW9uJyAmJiAhc2JnbmNsYXNzLmVuZHNXaXRoKCdwcm9jZXNzJyk7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBoYXZlIHVuaXQgb2YgaW5mb3JtYXRpb25cbmVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVVuaXRPZkluZm9ybWF0aW9uID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICBpZiAoc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCcgfHwgc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwgbXVsdGltZXInXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlIG11bHRpbWVyJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCBtdWx0aW1lcicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBoYXZlIHN0YXRlIHZhcmlhYmxlXG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTdGF0ZVZhcmlhYmxlID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICBpZiAoc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUgbXVsdGltZXInIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUgbXVsdGltZXInXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4IG11bHRpbWVyJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlIHNob3VsZCBiZSBzcXVhcmUgaW4gc2hhcGVcbmVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICByZXR1cm4gKHNiZ25jbGFzcy5pbmRleE9mKCdwcm9jZXNzJykgIT0gLTEgfHwgc2JnbmNsYXNzID09ICdzb3VyY2UgYW5kIHNpbmsnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdhbmQnIHx8IHNiZ25jbGFzcyA9PSAnb3InIHx8IHNiZ25jbGFzcyA9PSAnbm90J1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYXNzb2NpYXRpb24nIHx8IHNiZ25jbGFzcyA9PSAnZGlzc29jaWF0aW9uJyk7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgYW55IG9mIHRoZSBnaXZlbiBub2RlcyBtdXN0IG5vdCBiZSBpbiBzcXVhcmUgc2hhcGVcbmVsZW1lbnRVdGlsaXRpZXMuc29tZU11c3ROb3RCZVNxdWFyZSA9IGZ1bmN0aW9uIChub2Rlcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlKG5vZGUuZGF0YSgnY2xhc3MnKSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZXMgZWxlbWVudCBjYW4gYmUgY2xvbmVkXG5lbGVtZW50VXRpbGl0aWVzLmNhbkJlQ2xvbmVkID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XG5cbiAgdmFyIGxpc3QgPSB7XG4gICAgJ3Vuc3BlY2lmaWVkIGVudGl0eSc6IHRydWUsXG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxuICAgICdjb21wbGV4JzogdHJ1ZSxcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxuICAgICdwZXJ0dXJiaW5nIGFnZW50JzogdHJ1ZVxuICB9O1xuXG4gIHJldHVybiBsaXN0W3NiZ25jbGFzc10gPyB0cnVlIDogZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVzIGVsZW1lbnQgY2FuIGJlIGNsb25lZFxuZWxlbWVudFV0aWxpdGllcy5jYW5CZU11bHRpbWVyID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XG5cbiAgdmFyIGxpc3QgPSB7XG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxuICAgICdjb21wbGV4JzogdHJ1ZSxcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlXG4gIH07XG5cbiAgcmV0dXJuIGxpc3Rbc2JnbmNsYXNzXSA/IHRydWUgOiBmYWxzZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhbiBFUE5cbmVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuXG4gIHJldHVybiAoc2JnbmNsYXNzID09ICd1bnNwZWNpZmllZCBlbnRpdHknXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4Jyk7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgaXMgYSBQTlxuZWxlbWVudFV0aWxpdGllcy5pc1BOQ2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcblxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAncHJvY2VzcydcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcydcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ3VuY2VydGFpbiBwcm9jZXNzJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYXNzb2NpYXRpb24nXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdkaXNzb2NpYXRpb24nXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdwaGVub3R5cGUnKTtcbn07XG5cbi8vIFJldHVybnMgd2V0aGVyIHRoZSBnaXZlbiBlbGVtZW50IG9yIHN0cmluZyBpcyBvZiB0aGUgc3BlY2lhbCBlbXB0eSBzZXQvc291cmNlIGFuZCBzaW5rIGNsYXNzXG5lbGVtZW50VXRpbGl0aWVzLmlzRW1wdHlTZXRDbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuICByZXR1cm4gc2JnbmNsYXNzID09ICdzb3VyY2UgYW5kIHNpbmsnO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGVtZW50IGlzIGEgbG9naWNhbCBvcGVyYXRvclxuZWxlbWVudFV0aWxpdGllcy5pc0xvZ2ljYWxPcGVyYXRvciA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG4gIHJldHVybiAoc2JnbmNsYXNzID09ICdhbmQnIHx8IHNiZ25jbGFzcyA9PSAnb3InIHx8IHNiZ25jbGFzcyA9PSAnbm90Jyk7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGNsYXNzIG9mIGdpdmVuIGVsZW1lbnQgaXMgYSBlcXVpdmFsYW5jZSBjbGFzc1xuZWxlbWVudFV0aWxpdGllcy5jb252ZW5pZW50VG9FcXVpdmFsZW5jZSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG4gIHJldHVybiAoc2JnbmNsYXNzID09ICd0YWcnIHx8IHNiZ25jbGFzcyA9PSAndGVybWluYWwnKTtcbn07XG5cbi8vIFJldHVybnMgd2V0aGVyIHRoZSBjbGFzcyBvZiBnaXZlbiBlbGVtbnQgaXMgYSBtb2R1bGF0aW9uIGFyYyBhcyBkZWZpbmVkIGluIFBEIHNwZWNzXG5lbGVtZW50VXRpbGl0aWVzLmlzTW9kdWxhdGlvbkFyY0NsYXNzID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcbiAgcmV0dXJuIChzYmduY2xhc3MgPT0gJ21vZHVsYXRpb24nXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdzdGltdWxhdGlvbicgfHwgc2JnbmNsYXNzID09ICdjYXRhbHlzaXMnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdpbmhpYml0aW9uJyB8fCBzYmduY2xhc3MgPT0gJ25lY2Vzc2FyeSBzdGltdWxhdGlvbicpO1xufVxuXG4vLyBSZWxvY2F0ZXMgc3RhdGUgYW5kIGluZm8gYm94ZXMuIFRoaXMgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gYmUgY2FsbGVkIGFmdGVyIGFkZC9yZW1vdmUgc3RhdGUgYW5kIGluZm8gYm94ZXNcbmVsZW1lbnRVdGlsaXRpZXMucmVsb2NhdGVTdGF0ZUFuZEluZm9zID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc3RhdGVBbmRJbmZvcyA9IChlbGUuaXNOb2RlICYmIGVsZS5pc05vZGUoKSkgPyBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKSA6IGVsZTtcbiAgdmFyIGxlbmd0aCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoO1xuICBpZiAobGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxzZSBpZiAobGVuZ3RoID09IDEpIHtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XG4gIH1cbiAgZWxzZSBpZiAobGVuZ3RoID09IDIpIHtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XG5cbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDA7XG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSA1MDtcbiAgfVxuICBlbHNlIGlmIChsZW5ndGggPT0gMykge1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAyNTtcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IC01MDtcblxuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gMDtcbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xuICB9XG4gIGVsc2Uge1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAyNTtcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IC01MDtcblxuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gLTI1O1xuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC55ID0gNTA7XG5cbiAgICBzdGF0ZUFuZEluZm9zWzNdLmJib3gueCA9IDI1O1xuICAgIHN0YXRlQW5kSW5mb3NbM10uYmJveC55ID0gNTA7XG4gIH1cbn07XG5cbi8vIENoYW5nZSBzdGF0ZSB2YWx1ZSBvciB1bml0IG9mIGluZm9ybWF0aW9uIGJveCBvZiBnaXZlbiBub2RlcyB3aXRoIGdpdmVuIGluZGV4LlxuLy8gVHlwZSBwYXJhbWV0ZXIgaW5kaWNhdGVzIHdoZXRoZXIgdG8gY2hhbmdlIHZhbHVlIG9yIHZhcmlhYmxlLCBpdCBpcyB2YWxpZCBpZiB0aGUgYm94IGF0IHRoZSBnaXZlbiBpbmRleCBpcyBhIHN0YXRlIHZhcmlhYmxlLlxuLy8gVmFsdWUgcGFyYW1ldGVyIGlzIHRoZSBuZXcgdmFsdWUgdG8gc2V0LlxuLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgb2xkIHZhbHVlIG9mIHRoZSBjaGFuZ2VkIGRhdGEgKFdlIGFzc3VtZSB0aGF0IHRoZSBvbGQgdmFsdWUgb2YgdGhlIGNoYW5nZWQgZGF0YSB3YXMgdGhlIHNhbWUgZm9yIGFsbCBub2RlcykuXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpIHtcbiAgdmFyIHJlc3VsdDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XG4gICAgdmFyIGJveCA9IHN0YXRlQW5kSW5mb3NbaW5kZXhdO1xuXG4gICAgaWYgKGJveC5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHtcbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdCA9IGJveC5zdGF0ZVt0eXBlXTtcbiAgICAgIH1cblxuICAgICAgYm94LnN0YXRlW3R5cGVdID0gdmFsdWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKGJveC5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xuICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgcmVzdWx0ID0gYm94LmxhYmVsLnRleHQ7XG4gICAgICB9XG5cbiAgICAgIGJveC5sYWJlbC50ZXh0ID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIEFkZCBhIG5ldyBzdGF0ZSBvciBpbmZvIGJveCB0byBnaXZlbiBub2Rlcy5cbi8vIFRoZSBib3ggaXMgcmVwcmVzZW50ZWQgYnkgdGhlIHBhcmFtZXRlciBvYmouXG4vLyBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUganVzdCBhZGRlZCBib3guXG5lbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBvYmopIHtcbiAgdmFyIGluZGV4O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcbiAgICBcbiAgICAvLyBDbG9uZSB0aGUgb2JqZWN0IHRvIGF2b2lkIHJlZmVyZW5jaW5nIGlzc3Vlc1xuICAgIHZhciBjbG9uZSA9IGpRdWVyeS5leHRlbmQodHJ1ZSwge30sIG9iaik7XG4gICAgXG4gICAgc3RhdGVBbmRJbmZvcy5wdXNoKGNsb25lKTtcbiAgICBpbmRleCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoIC0gMTtcbiAgICB0aGlzLnJlbG9jYXRlU3RhdGVBbmRJbmZvcyhzdGF0ZUFuZEluZm9zKTsgLy8gUmVsb2NhdGUgc3RhdGUgYW5kIGluZm9zXG4gIH1cblxuICByZXR1cm4gaW5kZXg7XG59O1xuXG4vLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxuLy8gUmV0dXJucyB0aGUgcmVtb3ZlZCBib3guXG5lbGVtZW50VXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBpbmRleCkge1xuICB2YXIgb2JqO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcbiAgICBpZiAoIW9iaikge1xuICAgICAgb2JqID0gc3RhdGVBbmRJbmZvc1tpbmRleF07XG4gICAgfVxuICAgIHN0YXRlQW5kSW5mb3Muc3BsaWNlKGluZGV4LCAxKTsgLy8gUmVtb3ZlIHRoZSBib3hcbiAgICB0aGlzLnJlbG9jYXRlU3RhdGVBbmRJbmZvcyhzdGF0ZUFuZEluZm9zKTsgLy8gUmVsb2NhdGUgc3RhdGUgYW5kIGluZm9zXG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxuLy8gU2V0IG11bHRpbWVyIHN0YXR1cyBvZiB0aGUgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cbmVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMgPSBmdW5jdGlvbiAobm9kZXMsIHN0YXR1cykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgc2JnbmNsYXNzID0gbm9kZS5kYXRhKCdjbGFzcycpO1xuICAgIHZhciBpc011bHRpbWVyID0gbm9kZS5kYXRhKCdjbGFzcycpLmVuZHNXaXRoKCcgbXVsdGltZXInKTtcblxuICAgIGlmIChzdGF0dXMpIHsgLy8gTWFrZSBtdWx0aW1lciBzdGF0dXMgdHJ1ZVxuICAgICAgaWYgKCFpc011bHRpbWVyKSB7XG4gICAgICAgIG5vZGUuZGF0YSgnY2xhc3MnLCBzYmduY2xhc3MgKyAnIG11bHRpbWVyJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgeyAvLyBNYWtlIG11bHRpbWVyIHN0YXR1cyBmYWxzZVxuICAgICAgaWYgKGlzTXVsdGltZXIpIHtcbiAgICAgICAgbm9kZS5kYXRhKCdjbGFzcycsIHNiZ25jbGFzcy5yZXBsYWNlKCcgbXVsdGltZXInLCAnJykpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuLy8gU2V0IGNsb25lIG1hcmtlciBzdGF0dXMgb2YgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cbmVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbiAobm9kZXMsIHN0YXR1cykge1xuICBpZiAoc3RhdHVzKSB7XG4gICAgbm9kZXMuZGF0YSgnY2xvbmVtYXJrZXInLCB0cnVlKTtcbiAgfVxuICBlbHNlIHtcbiAgICBub2Rlcy5yZW1vdmVEYXRhKCdjbG9uZW1hcmtlcicpO1xuICB9XG59O1xuXG4vL2VsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbigpXG5cbi8vIENoYW5nZSBmb250IHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIGVsZW1lbnRzIHdpdGggZ2l2ZW4gZm9udCBkYXRhXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKGVsZXMsIGRhdGEpIHtcbiAgZm9yICh2YXIgcHJvcCBpbiBkYXRhKSB7XG4gICAgLy8gSWYgcHJvcCBpcyBsYWJlbHNpemUgaXQgaXMgcGFydCBvZiBlbGVtZW50IGRhdGEgZWxzZSBpdCBpcyBwYXJ0IG9mIGVsZW1lbnQgY3NzXG4gICAgaWYgKHByb3AgPT09ICdsYWJlbHNpemUnKSB7XG4gICAgICBlbGVzLmRhdGEocHJvcCwgZGF0YVtwcm9wXSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlcy5jc3MocHJvcCwgZGF0YVtwcm9wXSk7XG4gICAgfVxuICB9XG59O1xuXG4vLyBUaGlzIGZ1bmN0aW9uIGdldHMgYW4gZWRnZSwgYW5kIGVuZHMgb2YgdGhhdCBlZGdlIChPcHRpb25hbGx5IGl0IG1heSB0YWtlIGp1c3QgdGhlIGNsYXNzZXMgb2YgdGhlc2UgZWxlbWVudHMgYXMgd2VsbCkgYXMgcGFyYW1ldGVycy5cbi8vIEl0IG1heSByZXR1cm4gJ3ZhbGlkJyAodGhhdCBlbmRzIGlzIHZhbGlkIGZvciB0aGF0IGVkZ2UpLCAncmV2ZXJzZScgKHRoYXQgZW5kcyBpcyBub3QgdmFsaWQgZm9yIHRoYXQgZWRnZSBidXQgdGhleSB3b3VsZCBiZSB2YWxpZCBcbi8vIGlmIHlvdSByZXZlcnNlIHRoZSBzb3VyY2UgYW5kIHRhcmdldCksICdpbnZhbGlkJyAodGhhdCBlbmRzIGFyZSB0b3RhbGx5IGludmFsaWQgZm9yIHRoYXQgZWRnZSkuXG5lbGVtZW50VXRpbGl0aWVzLnZhbGlkYXRlQXJyb3dFbmRzID0gZnVuY3Rpb24gKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0KSB7XG4gIHZhciBlZGdlY2xhc3MgPSB0eXBlb2YgZWRnZSA9PT0gJ3N0cmluZycgPyBlZGdlIDogZWRnZS5kYXRhKCdjbGFzcycpO1xuICAvLyBUT0RPIGlzIGl0IG5lY2Vzc2FyeSB0byBhY2NlcHQgc3RyaW5ncyA/IGJldHRlciB0byBhbHdheXMgaGF2ZSB0aGUgZWxlbWVudHMgZm9yIHNvdXJjZSBhbmQgdGFyZ2V0LlxuICAvLyBUaGUgZGF5IHdlIG5lZWQgdG8gY2hlY2sgb3RoZXIgcnVsZXMgd2Ugd2lsbCBuZWVkIHRvIGFjY2VzcyBzb21lIHByb3BlcnRpZXMgb2YgZWFjaCBlbGVtZW50LlxuICB2YXIgc291cmNlY2xhc3MgPSB0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyA/IHNvdXJjZSA6IHNvdXJjZS5kYXRhKCdjbGFzcycpO1xuICB2YXIgdGFyZ2V0Y2xhc3MgPSB0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJyA/IHRhcmdldCA6IHRhcmdldC5kYXRhKCdjbGFzcycpO1xuXG4gIGlmICh0aGlzLmlzTW9kdWxhdGlvbkFyY0NsYXNzKGVkZ2VjbGFzcykpe1xuICAgIC8qXG4gICAgICogQ2FzZSBvZiB0aGUgb3V0cHV0IGFyYyBvZiBhIGxvZ2ljIG9wZXJhdG9yLCB3aGljaCBjYW4gYmUgYW55IG1vZHVsYXRpb24gYXJjIHR5cGUuXG4gICAgICogSGFzIHRvIGdvIGZyb20gbG9naWMgb3BlcmF0b3IgdG8gUE4gY2xhc3MuXG4gICAgICogUEQzNyBzYXlzIHRoZXJlIHNob3VsZCBiZSBvbmx5IDEsIG5vdCBlbmZvcmNlZCBmb3Igbm93LCBydWxlcyBhcmUgbGVmdCBjb21tZW50ZWQuXG4gICAgICovXG4gICAgdmFsaWQgPSB0cnVlO1xuICAgIHJldmVyc2UgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5pc0xvZ2ljYWxPcGVyYXRvcihzb3VyY2VjbGFzcykgfHwgdGhpcy5pc0xvZ2ljYWxPcGVyYXRvcih0YXJnZXRjbGFzcykpeyAvLyBhIGxvZ2ljIG9wZXJhdG9yIGlzIGludm9sdmVkXG4gICAgICBpZiAoIXRoaXMuaXNMb2dpY2FsT3BlcmF0b3Ioc291cmNlY2xhc3MpIHx8ICF0aGlzLmlzUE5DbGFzcyh0YXJnZXRjbGFzcykpeyAvLyBkaWZmZXJlbnQgZnJvbSB0aGUgaWRlYWwgY2FzZSBvZiBsb2dpYyAtPiBwcm9jZXNzXG4gICAgICAgIGlmICh0aGlzLmlzUE5DbGFzcyhzb3VyY2VjbGFzcykgJiYgdGhpcy5pc0xvZ2ljYWxPcGVyYXRvcih0YXJnZXRjbGFzcykpe1xuICAgICAgICAgIHJldmVyc2UgPSB0cnVlO1xuICAgICAgICAgIC8qaWYgKHRhcmdldC5vdXRnb2VycygnZWRnZScpLnNpemUoKSAhPSAwKXsgLy8gb25seSAxIG91dGdvaW5nIGVkZ2UgYWxsb3dlZCAoUEQzNylcbiAgICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgfSovXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLyplbHNlIGlmIChzb3VyY2Uub3V0Z29lcnMoJ2VkZ2UnKS5zaXplKCkgIT0gMCl7IC8vIG9ubHkgMSBvdXRnb2luZyBlZGdlIGFsbG93ZWQgKFBEMzcpXG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9Ki9cblxuICAgICAgaWYgKHZhbGlkKXtcbiAgICAgICAgcmV0dXJuIHJldmVyc2UgPyAncmV2ZXJzZScgOiAndmFsaWQnO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgcmV0dXJuICdpbnZhbGlkJztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoZWRnZWNsYXNzID09ICdjb25zdW1wdGlvbicgfHwgdGhpcy5pc01vZHVsYXRpb25BcmNDbGFzcyhlZGdlY2xhc3MpKSB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eVNldENsYXNzKHNvdXJjZWNsYXNzKSB8fCB0aGlzLmlzRW1wdHlTZXRDbGFzcyh0YXJnZXRjbGFzcykpeyAvLyBjYXNlIG9mIEVtcHR5U2V0IGluIG9uZSBvZiB0aGUgMlxuICAgICAgLy8gZm9sbG93aW5nIGJsb2NrIGlzIHRoZSBzYW1lIGFzIHRoZSAnZWxzZSBpZicgYmVsb3csIHdpdGggaXNFUE5DbGFzcyByZXBsYWNlZCBieSBpc0VtcHR5U2V0Q2xhc3NcbiAgICAgIGlmICghdGhpcy5pc0VtcHR5U2V0Q2xhc3Moc291cmNlY2xhc3MpIHx8ICF0aGlzLmlzUE5DbGFzcyh0YXJnZXRjbGFzcykpe1xuICAgICAgICBpZiAodGhpcy5pc1BOQ2xhc3Moc291cmNlY2xhc3MpICYmIHRoaXMuaXNFbXB0eVNldENsYXNzKHRhcmdldGNsYXNzKSkge1xuICAgICAgICAgIC8vSWYganVzdCB0aGUgZGlyZWN0aW9uIGlzIG5vdCB2YWxpZCByZXZlcnNlIHRoZSBkaXJlY3Rpb25cbiAgICAgICAgICByZXR1cm4gJ3JldmVyc2UnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoIXRoaXMuaXNFUE5DbGFzcyhzb3VyY2VjbGFzcykgfHwgIXRoaXMuaXNQTkNsYXNzKHRhcmdldGNsYXNzKSkge1xuICAgICAgaWYgKHRoaXMuaXNQTkNsYXNzKHNvdXJjZWNsYXNzKSAmJiB0aGlzLmlzRVBOQ2xhc3ModGFyZ2V0Y2xhc3MpKSB7XG4gICAgICAgIC8vSWYganVzdCB0aGUgZGlyZWN0aW9uIGlzIG5vdCB2YWxpZCByZXZlcnNlIHRoZSBkaXJlY3Rpb25cbiAgICAgICAgcmV0dXJuICdyZXZlcnNlJztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gJ2ludmFsaWQnO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBlbHNlIGlmIChlZGdlY2xhc3MgPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eVNldENsYXNzKHNvdXJjZWNsYXNzKSB8fCB0aGlzLmlzRW1wdHlTZXRDbGFzcyh0YXJnZXRjbGFzcykpeyAvLyBjYXNlIG9mIEVtcHR5U2V0IGluIG9uZSBvZiB0aGUgMlxuICAgICAgLy8gZm9sbG93aW5nIGJsb2NrIGlzIHRoZSBzYW1lIGFzIHRoZSAnZWxzZSBpZicgYmVsb3csIHdpdGggaXNFUE5DbGFzcyByZXBsYWNlZCBieSBpc0VtcHR5U2V0Q2xhc3NcbiAgICAgIGlmICghdGhpcy5pc1BOQ2xhc3Moc291cmNlY2xhc3MpIHx8ICF0aGlzLmlzRW1wdHlTZXRDbGFzcyh0YXJnZXRjbGFzcykpe1xuICAgICAgICBpZiAodGhpcy5pc0VtcHR5U2V0Q2xhc3Moc291cmNlY2xhc3MpICYmIHRoaXMuaXNQTkNsYXNzKHRhcmdldGNsYXNzKSkge1xuICAgICAgICAgIC8vSWYganVzdCB0aGUgZGlyZWN0aW9uIGlzIG5vdCB2YWxpZCByZXZlcnNlIHRoZSBkaXJlY3Rpb25cbiAgICAgICAgICByZXR1cm4gJ3JldmVyc2UnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoIXRoaXMuaXNQTkNsYXNzKHNvdXJjZWNsYXNzKSB8fCAhdGhpcy5pc0VQTkNsYXNzKHRhcmdldGNsYXNzKSkge1xuICAgICAgaWYgKHRoaXMuaXNFUE5DbGFzcyhzb3VyY2VjbGFzcykgJiYgdGhpcy5pc1BOQ2xhc3ModGFyZ2V0Y2xhc3MpKSB7XG4gICAgICAgIC8vSWYganVzdCB0aGUgZGlyZWN0aW9uIGlzIG5vdCB2YWxpZCByZXZlcnNlIHRoZSBkaXJlY3Rpb25cbiAgICAgICAgcmV0dXJuICdyZXZlcnNlJztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gJ2ludmFsaWQnO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBlbHNlIGlmIChlZGdlY2xhc3MgPT0gJ2xvZ2ljIGFyYycpIHtcbiAgICB2YXIgaW52YWxpZCA9IGZhbHNlO1xuICAgIGlmICghdGhpcy5pc0VQTkNsYXNzKHNvdXJjZWNsYXNzKSB8fCAhdGhpcy5pc0xvZ2ljYWxPcGVyYXRvcih0YXJnZXRjbGFzcykpIHtcbiAgICAgIGlmICh0aGlzLmlzTG9naWNhbE9wZXJhdG9yKHNvdXJjZWNsYXNzKSAmJiB0aGlzLmlzRVBOQ2xhc3ModGFyZ2V0Y2xhc3MpKSB7XG4gICAgICAgIC8vSWYganVzdCB0aGUgZGlyZWN0aW9uIGlzIG5vdCB2YWxpZCByZXZlcnNlIHRoZSBkaXJlY3Rpb25cbiAgICAgICAgcmV0dXJuICdyZXZlcnNlJztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpbnZhbGlkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB0aGUgY2FzZSB0aGF0IGJvdGggc2lkZXMgYXJlIGxvZ2ljYWwgb3BlcmF0b3JzIGFyZSB2YWxpZCB0b29cbiAgICBpZiAodGhpcy5pc0xvZ2ljYWxPcGVyYXRvcihzb3VyY2VjbGFzcykgJiYgdGhpcy5pc0xvZ2ljYWxPcGVyYXRvcih0YXJnZXRjbGFzcykpIHtcbiAgICAgIGludmFsaWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoaW52YWxpZCkge1xuICAgICAgcmV0dXJuICdpbnZhbGlkJztcbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAoZWRnZWNsYXNzID09ICdlcXVpdmFsZW5jZSBhcmMnKSB7XG4gICAgaWYgKCEodGhpcy5pc0VQTkNsYXNzKHNvdXJjZWNsYXNzKSAmJiB0aGlzLmNvbnZlbmllbnRUb0VxdWl2YWxlbmNlKHRhcmdldGNsYXNzKSlcbiAgICAgICAgICAgICYmICEodGhpcy5pc0VQTkNsYXNzKHRhcmdldGNsYXNzKSAmJiB0aGlzLmNvbnZlbmllbnRUb0VxdWl2YWxlbmNlKHNvdXJjZWNsYXNzKSkpIHtcbiAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuICd2YWxpZCc7XG59O1xuXG4vKlxuICogVW5oaWRlIGdpdmVuIGVsZXMgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcbiAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGVsZXMsIGxheW91dHBhcmFtKSB7XG4gIHZhciByZXN1bHQgPSBjeS52aWV3VXRpbGl0aWVzKCkuc2hvdyhlbGVzKTsgLy8gU2hvdyBnaXZlbiBlbGVzXG4gIGlmICh0eXBlb2YgbGF5b3V0cGFyYW0gPT09ICdmdW5jdGlvbicpIHtcbiAgICBsYXlvdXRwYXJhbSgpOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBhIGZ1bmN0aW9uIGV4ZWN1dGUgaXRcbiAgfVxuICBlbHNlIHtcbiAgICBjeS5sYXlvdXQobGF5b3V0cGFyYW0pOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBsYXlvdXQgb3B0aW9ucyBjYWxsIGxheW91dCB3aXRoIHRoYXQgb3B0aW9ucy5cbiAgfVxuICBcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qXG4gKiBDaGFuZ2Ugc3R5bGUvY3NzIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlTWFwKSB7XG4gIGlmICggdHlwZW9mIHZhbHVlTWFwID09PSAnb2JqZWN0JyApIHtcbiAgICBjeS5zdGFydEJhdGNoKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICAgIGVsZS5jc3MobmFtZSwgdmFsdWVNYXBbZWxlLmlkKCldKTsgLy8gdmFsdWVNYXAgaXMgYW4gaWQgdG8gdmFsdWUgbWFwIHVzZSBpdCBpbiB0aGlzIHdheVxuICAgIH1cbiAgICBjeS5lbmRCYXRjaCgpO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZXMuY3NzKG5hbWUsIHZhbHVlTWFwKTsgLy8gdmFsdWVNYXAgaXMganVzdCBhIHN0cmluZyBzZXQgY3NzKCduYW1lJykgZm9yIGFsbCBlbGVzIHRvIHRoaXMgdmFsdWVcbiAgfVxufTtcblxuLypcbiAqIENoYW5nZSBkYXRhIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICBpZiAoIHR5cGVvZiB2YWx1ZU1hcCA9PT0gJ29iamVjdCcgKSB7XG4gICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XG4gICAgICBlbGUuZGF0YShuYW1lLCB2YWx1ZU1hcFtlbGUuaWQoKV0pOyAvLyB2YWx1ZU1hcCBpcyBhbiBpZCB0byB2YWx1ZSBtYXAgdXNlIGl0IGluIHRoaXMgd2F5XG4gICAgfVxuICAgIGN5LmVuZEJhdGNoKCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlcy5kYXRhKG5hbWUsIHZhbHVlTWFwKTsgLy8gdmFsdWVNYXAgaXMganVzdCBhIHN0cmluZyBzZXQgY3NzKCduYW1lJykgZm9yIGFsbCBlbGVzIHRvIHRoaXMgdmFsdWVcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbGVtZW50VXRpbGl0aWVzO1xuIiwiLyogXG4gKiBVdGlsaXR5IGZpbGUgdG8gZ2V0IGFuZCBzZXQgdGhlIGxpYnJhcmllcyB0byB3aGljaCBzYmdudml6IGlzIGRlcGVuZGVudCBmcm9tIGFueSBmaWxlLlxuICovXG5cbnZhciBsaWJVdGlsaXRpZXMgPSBmdW5jdGlvbigpe1xufTtcblxubGliVXRpbGl0aWVzLnNldExpYnMgPSBmdW5jdGlvbihsaWJzKSB7XG4gIHRoaXMubGlicyA9IGxpYnM7XG59O1xuXG5saWJVdGlsaXRpZXMuZ2V0TGlicyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5saWJzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBsaWJVdGlsaXRpZXM7IiwidmFyIG9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKS5nZXRPcHRpb25zKCk7XG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcblxuLypcbiAqIFRoZSBtYWluIHV0aWxpdGllcyB0byBiZSBleHBvc2VkIGRpcmVjdGx5LlxuICovXG5mdW5jdGlvbiBtYWluVXRpbGl0aWVzKCkge1xufTtcblxuLypcbiAqIEFkZHMgYSBuZXcgbm9kZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmFkZE5vZGUgPSBmdW5jdGlvbih4LCB5ICwgbm9kZWNsYXNzLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KSB7XG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeCwgeSwgbm9kZWNsYXNzLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBuZXdOb2RlIDoge1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5LFxuICAgICAgICBjbGFzczogbm9kZWNsYXNzLFxuICAgICAgICBpZDogaWQsXG4gICAgICAgIHBhcmVudDogcGFyZW50LFxuICAgICAgICB2aXNpYmlsaXR5OiB2aXNpYmlsaXR5XG4gICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkTm9kZVwiLCBwYXJhbSk7XG4gIH1cbn07XG5cbi8qXG4gKiBBZGRzIGEgbmV3IGVkZ2Ugd2l0aCB0aGUgZ2l2ZW4gY2xhc3MgYW5kIGhhdmluZyB0aGUgZ2l2ZW4gc291cmNlIGFuZCB0YXJnZXQgaWRzLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmFkZEVkZ2UgPSBmdW5jdGlvbihzb3VyY2UsIHRhcmdldCAsIGVkZ2VjbGFzcywgaWQsIHZpc2liaWxpdHkpIHtcbiAgLy8gR2V0IHRoZSB2YWxpZGF0aW9uIHJlc3VsdFxuICB2YXIgdmFsaWRhdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMoZWRnZWNsYXNzLCBjeS5nZXRFbGVtZW50QnlJZChzb3VyY2UpLCBjeS5nZXRFbGVtZW50QnlJZCh0YXJnZXQpKTtcblxuICAvLyBJZiB2YWxpZGF0aW9uIHJlc3VsdCBpcyAnaW52YWxpZCcgY2FuY2VsIHRoZSBvcGVyYXRpb25cbiAgaWYgKHZhbGlkYXRpb24gPT09ICdpbnZhbGlkJykge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgLy8gSWYgdmFsaWRhdGlvbiByZXN1bHQgaXMgJ3JldmVyc2UnIHJldmVyc2UgdGhlIHNvdXJjZS10YXJnZXQgcGFpciBiZWZvcmUgY3JlYXRpbmcgdGhlIGVkZ2VcbiAgaWYgKHZhbGlkYXRpb24gPT09ICdyZXZlcnNlJykge1xuICAgIHZhciB0ZW1wID0gc291cmNlO1xuICAgIHNvdXJjZSA9IHRhcmdldDtcbiAgICB0YXJnZXQgPSB0ZW1wO1xuICB9XG4gICAgICBcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShzb3VyY2UsIHRhcmdldCwgZWRnZWNsYXNzLCBpZCwgdmlzaWJpbGl0eSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgbmV3RWRnZSA6IHtcbiAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICBjbGFzczogZWRnZWNsYXNzLFxuICAgICAgICBpZDogaWQsXG4gICAgICAgIHZpc2liaWxpdHk6IHZpc2liaWxpdHlcbiAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRFZGdlXCIsIHBhcmFtKTtcbiAgfVxufTtcblxuLypcbiAqIENsb25lIGdpdmVuIGVsZW1lbnRzLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cbiAqL1xubWFpblV0aWxpdGllcy5jbG9uZUVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZXMpIHtcbiAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICB2YXIgY2IgPSBjeS5jbGlwYm9hcmQoKTtcbiAgdmFyIF9pZCA9IGNiLmNvcHkoZWxlcywgXCJjbG9uZU9wZXJhdGlvblwiKTtcblxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJwYXN0ZVwiLCB7aWQ6IF9pZH0pO1xuICB9IFxuICBlbHNlIHtcbiAgICBjYi5wYXN0ZShfaWQpO1xuICB9XG59O1xuXG4vKlxuICogQ29weSBnaXZlbiBlbGVtZW50cyB0byBjbGlwYm9hcmQuIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmNvcHlFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gIGN5LmNsaXBib2FyZCgpLmNvcHkoZWxlcyk7XG59O1xuXG4vKlxuICogUGFzdCB0aGUgZWxlbWVudHMgY29waWVkIHRvIGNsaXBib2FyZC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMucGFzdGVFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJwYXN0ZVwiKTtcbiAgfSBcbiAgZWxzZSB7XG4gICAgY3kuY2xpcGJvYXJkKCkucGFzdGUoKTtcbiAgfVxufTtcblxuLypcbiAqIEFsaWducyBnaXZlbiBub2RlcyBpbiBnaXZlbiBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBvcmRlci4gXG4gKiBIb3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBwYXJhbWV0ZXJzIG1heSBiZSAnbm9uZScgb3IgdW5kZWZpbmVkLlxuICogYWxpZ25UbyBwYXJhbWV0ZXIgaW5kaWNhdGVzIHRoZSBsZWFkaW5nIG5vZGUuXG4gKiBSZXF1cmlyZXMgY3l0b3NjYXBlLWdyaWQtZ3VpZGUgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmFsaWduID0gZnVuY3Rpb24gKG5vZGVzLCBob3Jpem9udGFsLCB2ZXJ0aWNhbCwgYWxpZ25Ubykge1xuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhbGlnblwiLCB7XG4gICAgICBub2Rlczogbm9kZXMsXG4gICAgICBob3Jpem9udGFsOiBob3Jpem9udGFsLFxuICAgICAgdmVydGljYWw6IHZlcnRpY2FsLFxuICAgICAgYWxpZ25UbzogYWxpZ25Ub1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG5vZGVzLmFsaWduKGhvcml6b250YWwsIHZlcnRpY2FsLCBhbGlnblRvKTtcbiAgfVxufTtcblxuLypcbiAqIENyZWF0ZSBjb21wb3VuZCBmb3IgZ2l2ZW4gbm9kZXMuIGNvbXBvdW5kVHlwZSBtYXkgYmUgJ2NvbXBsZXgnIG9yICdjb21wYXJ0bWVudCcuXG4gKiBUaGlzIG1ldGhvZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChfbm9kZXMsIGNvbXBvdW5kVHlwZSkge1xuICB2YXIgbm9kZXMgPSBfbm9kZXM7XG4gIC8vIEp1c3QgRVBOJ3MgY2FuIGJlIGluY2x1ZGVkIGluIGNvbXBsZXhlcyBzbyB3ZSBuZWVkIHRvIGZpbHRlciBFUE4ncyBpZiBjb21wb3VuZCB0eXBlIGlzIGNvbXBsZXhcbiAgaWYgKGNvbXBvdW5kVHlwZSA9PT0gJ2NvbXBsZXgnKSB7XG4gICAgbm9kZXMgPSBfbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChpLCBlbGVtZW50KSB7XG4gICAgICB2YXIgc2JnbmNsYXNzID0gZWxlbWVudC5kYXRhKFwiY2xhc3NcIik7XG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKHNiZ25jbGFzcyk7XG4gICAgfSk7XG4gIH1cbiAgXG4gIG5vZGVzID0gZWxlbWVudFV0aWxpdGllcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xuXG4gIC8vIEFsbCBlbGVtZW50cyBzaG91bGQgaGF2ZSB0aGUgc2FtZSBwYXJlbnQgYW5kIHRoZSBjb21tb24gcGFyZW50IHNob3VsZCBub3QgYmUgYSAnY29tcGxleCcgXG4gIC8vIGlmIGNvbXBvdW5kVHlwZSBpcyAnY29tcGFydGVudCdcbiAgLy8gYmVjYXVzZSB0aGUgb2xkIGNvbW1vbiBwYXJlbnQgd2lsbCBiZSB0aGUgcGFyZW50IG9mIHRoZSBuZXcgY29tcGFydG1lbnQgYWZ0ZXIgdGhpcyBvcGVyYXRpb24gYW5kXG4gIC8vICdjb21wbGV4ZXMnIGNhbm5vdCBpbmNsdWRlICdjb21wYXJ0bWVudHMnXG4gIGlmIChub2Rlcy5sZW5ndGggPT0gMCB8fCAhZWxlbWVudFV0aWxpdGllcy5hbGxIYXZlVGhlU2FtZVBhcmVudChub2RlcylcbiAgICAgICAgICB8fCAoIGNvbXBvdW5kVHlwZSA9PT0gJ2NvbXBhcnRtZW50JyAmJiBub2Rlcy5wYXJlbnQoKS5kYXRhKCdjbGFzcycpID09PSAnY29tcGxleCcgKSApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChjeS51bmRvUmVkbygpKSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgY29tcG91bmRUeXBlOiBjb21wb3VuZFR5cGUsXG4gICAgICBub2Rlc1RvTWFrZUNvbXBvdW5kOiBub2Rlc1xuICAgIH07XG5cbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzXCIsIHBhcmFtKTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyhub2RlcywgY29tcG91bmRUeXBlKTtcbiAgfVxufTtcblxuLypcbiAqIE1vdmUgdGhlIG5vZGVzIHRvIGEgbmV3IHBhcmVudCBhbmQgY2hhbmdlIHRoZWlyIHBvc2l0aW9uIGlmIHBvc3NEaWZmIHBhcmFtcyBhcmUgc2V0LlxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbiBhbmQgY2hlY2tzIGlmIHRoZSBvcGVyYXRpb24gaXMgdmFsaWQuXG4gKi9cbm1haW5VdGlsaXRpZXMuY2hhbmdlUGFyZW50ID0gZnVuY3Rpb24obm9kZXMsIF9uZXdQYXJlbnQsIHBvc0RpZmZYLCBwb3NEaWZmWSkge1xuICB2YXIgbmV3UGFyZW50ID0gdHlwZW9mIF9uZXdQYXJlbnQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX25ld1BhcmVudCkgOiBfbmV3UGFyZW50O1xuICBpZiAobmV3UGFyZW50ICYmIG5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikgIT0gXCJjb21wbGV4XCIgJiYgbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKSAhPSBcImNvbXBhcnRtZW50XCIpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAobmV3UGFyZW50ICYmIG5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikgPT0gXCJjb21wbGV4XCIpIHtcbiAgICBub2RlcyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoaSwgZWxlKSB7XG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKGVsZS5kYXRhKFwiY2xhc3NcIikpO1xuICAgIH0pO1xuICB9XG5cbiAgbm9kZXMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGksIGVsZSkge1xuICAgIGlmICghbmV3UGFyZW50KSB7XG4gICAgICByZXR1cm4gZWxlLmRhdGEoJ3BhcmVudCcpICE9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBlbGUuZGF0YSgncGFyZW50JykgIT09IG5ld1BhcmVudC5pZCgpO1xuICB9KTtcblxuICBpZiAobmV3UGFyZW50KSB7XG4gICAgbm9kZXMgPSBub2Rlcy5kaWZmZXJlbmNlKG5ld1BhcmVudC5hbmNlc3RvcnMoKSk7XG4gIH1cblxuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbm9kZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldFRvcE1vc3ROb2Rlcyhub2Rlcyk7XG4gIFxuICB2YXIgcGFyZW50SWQgPSBuZXdQYXJlbnQgPyBuZXdQYXJlbnQuaWQoKSA6IG51bGw7XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGZpcnN0VGltZTogdHJ1ZSxcbiAgICAgIHBhcmVudERhdGE6IHBhcmVudElkLCAvLyBJdCBrZWVwcyB0aGUgbmV3UGFyZW50SWQgKEp1c3QgYW4gaWQgZm9yIGVhY2ggbm9kZXMgZm9yIHRoZSBmaXJzdCB0aW1lKVxuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgcG9zRGlmZlg6IHBvc0RpZmZYLFxuICAgICAgcG9zRGlmZlk6IHBvc0RpZmZZXG4gICAgfTtcblxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VQYXJlbnRcIiwgcGFyYW0pOyAvLyBUaGlzIGFjdGlvbiBpcyByZWdpc3RlcmVkIGJ5IHVuZG9SZWRvIGV4dGVuc2lvblxuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50KG5vZGVzLCBwYXJlbnRJZCwgcG9zRGlmZlgsIHBvc0RpZmZZKTtcbiAgfVxufTtcblxuLypcbiAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxuICogaW4gdGhlIGNvbXBsZXguIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSB0aGUgc2FtZSBmdW5jdGlvbiBpbiBlbGVtZW50VXRpbGl0aWVzXG4gKi9cbm1haW5VdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKSB7XG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbih0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICB0ZW1wbGF0ZVR5cGU6IHRlbXBsYXRlVHlwZSxcbiAgICAgIG1hY3JvbW9sZWN1bGVMaXN0OiBtYWNyb21vbGVjdWxlTGlzdCxcbiAgICAgIGNvbXBsZXhOYW1lOiBjb21wbGV4TmFtZSxcbiAgICAgIHByb2Nlc3NQb3NpdGlvbjogcHJvY2Vzc1Bvc2l0aW9uLFxuICAgICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXG4gICAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXG4gICAgICBlZGdlTGVuZ3RoOiBlZGdlTGVuZ3RoXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlVGVtcGxhdGVSZWFjdGlvblwiLCBwYXJhbSk7XG4gIH1cbn07XG5cbi8qXG4gKiBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuIFxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbykge1xuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgdXNlQXNwZWN0UmF0aW86IHVzZUFzcGVjdFJhdGlvLFxuICAgICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZVxuICAgIH07XG4gICAgXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInJlc2l6ZU5vZGVzXCIsIHBhcmFtKTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbyk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vKlxuICogQ2hhbmdlcyB0aGUgbGFiZWwgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBsYWJlbC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5jaGFuZ2VOb2RlTGFiZWwgPSBmdW5jdGlvbihub2RlcywgbGFiZWwpIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBsYWJlbCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlTm9kZUxhYmVsXCIsIHBhcmFtKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIGZvciBnaXZlbiBub2RlcyB1c2UgdGhlIGdpdmVuIGZvbnQgZGF0YS5cbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbihlbGVzLCBkYXRhKSB7XG4gIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBlbGVzOiBlbGVzLFxuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgIH07XG5cbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgcGFyYW0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgZGF0YSk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vKlxuICogQ2hhbmdlIHN0YXRlIHZhbHVlIG9yIHVuaXQgb2YgaW5mb3JtYXRpb24gYm94IG9mIGdpdmVuIG5vZGVzIHdpdGggZ2l2ZW4gaW5kZXguXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHBhcmFtZXRlcnMgc2VlIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3hcbiAqL1xubWFpblV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uKG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3gobm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXG4vLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxuLy8gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2Rlcywgb2JqKSB7XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgb2JqOiBvYmosXG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxuLy8gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgpIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgIG5vZGVzOiBub2Rlc1xuICAgIH07XG5cbiAgICBjeS51bmRvUmVkbygpLmRvKFwicmVtb3ZlU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLypcbiAqIFNldCBtdWx0aW1lciBzdGF0dXMgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24obm9kZXMsIHN0YXR1cykge1xuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgfTtcblxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXRNdWx0aW1lclN0YXR1c1wiLCBwYXJhbSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBTZXQgY2xvbmUgbWFya2VyIHN0YXR1cyBvZiBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqLyBcbm1haW5VdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbihub2Rlcywgc3RhdHVzKSB7XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgc3RhdHVzOiBzdGF0dXMsXG4gICAgICBub2Rlczogbm9kZXMsXG4gICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICB9O1xuXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNldENsb25lTWFya2VyU3RhdHVzXCIsIHBhcmFtKTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLypcbiAqIENoYW5nZSBzdHlsZS9jc3Mgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gZ2l2ZW4gdmFsdWUvdmFsdWVzIChOb3RlIHRoYXQgdmFsdWVNYXAgcGFyYW1ldGVyIG1heSBiZVxuICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuY2hhbmdlQ3NzID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcbiAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyhlbGVzLCBuYW1lLCB2YWx1ZU1hcCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgZWxlczogZWxlcyxcbiAgICAgIHZhbHVlTWFwOiB2YWx1ZU1hcCxcbiAgICAgIG5hbWU6IG5hbWVcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VDc3NcIiwgcGFyYW0pO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLypcbiAqIENoYW5nZSBkYXRhIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmNoYW5nZURhdGEgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShlbGVzLCBuYW1lLCB2YWx1ZU1hcCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgZWxlczogZWxlcyxcbiAgICAgIHZhbHVlTWFwOiB2YWx1ZU1hcCxcbiAgICAgIG5hbWU6IG5hbWVcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VEYXRhXCIsIHBhcmFtKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBVbmhpZGUgZ2l2ZW4gZWxlcyAodGhlIG9uZXMgd2hpY2ggYXJlIGhpZGRlbiBpZiBhbnkpIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXG4gKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcbiAgdmFyIGhpZGRlbkVsZXMgPSBlbGVzLmZpbHRlcignOmhpZGRlbicpO1xuICBpZiAoaGlkZGVuRWxlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQoaGlkZGVuRWxlcywgbGF5b3V0cGFyYW0pO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGVsZXM6IGhpZGRlbkVsZXMsXG4gICAgICBsYXlvdXRwYXJhbTogbGF5b3V0cGFyYW0sXG4gICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCBwYXJhbSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWFpblV0aWxpdGllczsiLCIvKlxuICogIEV4dGVuZCBkZWZhdWx0IG9wdGlvbnMgYW5kIGdldCBjdXJyZW50IG9wdGlvbnMgYnkgdXNpbmcgdGhpcyBmaWxlIFxuICovXG5cbi8vIGRlZmF1bHQgb3B0aW9uc1xudmFyIGRlZmF1bHRzID0ge1xuICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgdGhlIGluZGV4IGh0bWwgXG4gIC8vIGZpbGUgYW5kIG5vZGVfbW9kdWxlcyBhcmUgdW5kZXIgdGhlIHNhbWUgZm9sZGVyIHRoZW4gdXNpbmcgdGhlIGRlZmF1bHQgdmFsdWUgaXMgZmluZVxuICBpbWdQYXRoOiAnbm9kZV9tb2R1bGVzL3NiZ252aXovc3JjL2ltZycsXG4gIC8vIFdoZXRoZXIgdG8gZml0IGxhYmVscyB0byBub2Rlc1xuICBmaXRMYWJlbHNUb05vZGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICAvLyBkeW5hbWljIGxhYmVsIHNpemUgaXQgbWF5IGJlICdzbWFsbCcsICdyZWd1bGFyJywgJ2xhcmdlJ1xuICBkeW5hbWljTGFiZWxTaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICdyZWd1bGFyJztcbiAgfSxcbiAgLy8gcGVyY2VudGFnZSB1c2VkIHRvIGNhbGN1bGF0ZSBjb21wb3VuZCBwYWRkaW5nc1xuICBjb21wb3VuZFBhZGRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gMTA7XG4gIH0sXG4gIC8vIFdoZXRoZXIgdG8gYWRqdXN0IG5vZGUgbGFiZWwgZm9udCBzaXplIGF1dG9tYXRpY2FsbHkuXG4gIC8vIElmIHRoaXMgb3B0aW9uIHJldHVybiBmYWxzZSBkbyBub3QgYWRqdXN0IGxhYmVsIHNpemVzIGFjY29yZGluZyB0byBub2RlIGhlaWdodCB1c2VzIG5vZGUuZGF0YSgnbGFiZWxzaXplJylcbiAgLy8gaW5zdGVhZCBvZiBkb2luZyBpdC5cbiAgYWRqdXN0Tm9kZUxhYmVsRm9udFNpemVBdXRvbWF0aWNhbGx5OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgLy8gVGhlIHNlbGVjdG9yIG9mIHRoZSBjb21wb25lbnQgY29udGFpbmluZyB0aGUgc2JnbiBuZXR3b3JrXG4gIG5ldHdvcmtDb250YWluZXJTZWxlY3RvcjogJyNzYmduLW5ldHdvcmstY29udGFpbmVyJyxcbiAgLy8gV2hldGhlciB0aGUgYWN0aW9ucyBhcmUgdW5kb2FibGUsIHJlcXVpcmVzIGN5dG9zY2FwZS11bmRvLXJlZG8gZXh0ZW5zaW9uXG4gIHVuZG9hYmxlOiB0cnVlLFxuICAvLyBXaGV0aGVyIHRvIGhhdmUgdW5kb2FibGUgZHJhZyBmZWF0dXJlIGluIHVuZG8vcmVkbyBleHRlbnNpb24uIFRoaXMgb3B0aW9ucyB3aWxsIGJlIHBhc3NlZCB0byB1bmRvL3JlZG8gZXh0ZW5zaW9uXG4gIHVuZG9hYmxlRHJhZzogdHJ1ZVxufTtcblxudmFyIG9wdGlvblV0aWxpdGllcyA9IGZ1bmN0aW9uICgpIHtcbn07XG5cbi8vIEV4dGVuZCB0aGUgZGVmYXVsdHMgb3B0aW9ucyB3aXRoIHRoZSB1c2VyIG9wdGlvbnNcbm9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIGZvciAodmFyIHByb3AgaW4gZGVmYXVsdHMpIHtcbiAgICByZXN1bHRbcHJvcF0gPSBkZWZhdWx0c1twcm9wXTtcbiAgfVxuICBcbiAgZm9yICh2YXIgcHJvcCBpbiBvcHRpb25zKSB7XG4gICAgcmVzdWx0W3Byb3BdID0gb3B0aW9uc1twcm9wXTtcbiAgfVxuXG4gIG9wdGlvblV0aWxpdGllcy5vcHRpb25zID0gcmVzdWx0O1xuXG4gIHJldHVybiBvcHRpb25zO1xufTtcblxub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBvcHRpb25VdGlsaXRpZXMub3B0aW9ucztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gb3B0aW9uVXRpbGl0aWVzOyIsInZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMnKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyICQgPSBsaWJzLmpRdWVyeTtcblxudmFyIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zID0gZnVuY3Rpb24gKHVuZG9hYmxlRHJhZykge1xuICAvLyBjcmVhdGUgdW5kby1yZWRvIGluc3RhbmNlXG4gIHZhciB1ciA9IGN5LnVuZG9SZWRvKHtcbiAgICB1bmRvYWJsZURyYWc6IHVuZG9hYmxlRHJhZ1xuICB9KTtcblxuICAvLyByZWdpc3RlciBhZGQgcmVtb3ZlIGFjdGlvbnNcbiAgdXIuYWN0aW9uKFwiYWRkTm9kZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGROb2RlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XG4gIHVyLmFjdGlvbihcImFkZEVkZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTbWFydFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU21hcnQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcbiAgdXIuYWN0aW9uKFwiY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlQ29tcG91bmQpO1xuXG4gIC8vIHJlZ2lzdGVyIGdlbmVyYWwgYWN0aW9uc1xuICB1ci5hY3Rpb24oXCJyZXNpemVOb2Rlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VOb2RlTGFiZWxcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VEYXRhXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VDc3NcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VCZW5kUG9pbnRzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VGb250UHJvcGVydGllc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMpO1xuICB1ci5hY3Rpb24oXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUxheW91dCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtTGF5b3V0KTtcblxuICAvLyByZWdpc3RlciBTQkdOIGFjdGlvbnNcbiAgdXIuYWN0aW9uKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94KTtcbiAgdXIuYWN0aW9uKFwiY2hhbmdlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94KTtcbiAgdXIuYWN0aW9uKFwic2V0TXVsdGltZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzKTtcbiAgdXIuYWN0aW9uKFwic2V0Q2xvbmVNYXJrZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzKTtcbiAgdXIuYWN0aW9uKFwicmVtb3ZlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94KTtcbiAgXG4gIC8vIHJlZ2lzdGVyIGVhc3kgY3JlYXRpb24gYWN0aW9uc1xuICB1ci5hY3Rpb24oXCJjcmVhdGVUZW1wbGF0ZVJlYWN0aW9uXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24sIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1bmRvYWJsZURyYWcpIHtcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnModW5kb2FibGVEcmFnKTtcbiAgfSk7XG59OyIsIi8vIEV4dGVuZHMgc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgc2JnbnZpeiA9IGxpYnMuc2JnbnZpejtcbnZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHNiZ252aXoudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gYWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZE5vZGUgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgIHZhciBuZXdOb2RlID0gcGFyYW0ubmV3Tm9kZTtcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUobmV3Tm9kZS54LCBuZXdOb2RlLnksIG5ld05vZGUuY2xhc3MsIG5ld05vZGUuaWQsIG5ld05vZGUucGFyZW50LCBuZXdOb2RlLnZpc2liaWxpdHkpO1xuICB9XG4gIGVsc2Uge1xuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBlbGVzOiByZXN1bHRcbiAgfTtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZEVkZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgIHZhciBuZXdFZGdlID0gcGFyYW0ubmV3RWRnZTtcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3RWRnZS5zb3VyY2UsIG5ld0VkZ2UudGFyZ2V0LCBuZXdFZGdlLmNsYXNzLCBuZXdFZGdlLmlkLCBuZXdFZGdlLnZpc2liaWxpdHkpO1xuICB9XG4gIGVsc2Uge1xuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBlbGVzOiByZXN1bHRcbiAgfTtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgbm9kZXNUb01ha2VDb21wb3VuZCA9IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQ7XG4gIHZhciBuZXdDb21wb3VuZDtcblxuICAvLyBJZiB0aGlzIGlzIGEgcmVkbyBhY3Rpb24gcmVmcmVzaCB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZCAoV2UgbmVlZCB0aGlzIGJlY2F1c2UgYWZ0ZXIgZWxlLm1vdmUoKSByZWZlcmVuY2VzIHRvIGVsZXMgY2hhbmdlcylcbiAgaWYgKCFwYXJhbS5maXJzdFRpbWUpIHtcbiAgICB2YXIgbm9kZXNUb01ha2VDb21wb3VuZElkcyA9IHt9O1xuXG4gICAgbm9kZXNUb01ha2VDb21wb3VuZC5lYWNoKGZ1bmN0aW9uIChpLCBlbGUpIHtcbiAgICAgIG5vZGVzVG9NYWtlQ29tcG91bmRJZHNbZWxlLmlkKCldID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKCk7XG5cbiAgICBub2Rlc1RvTWFrZUNvbXBvdW5kID0gYWxsTm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChpLCBlbGUpIHtcbiAgICAgIHJldHVybiBub2Rlc1RvTWFrZUNvbXBvdW5kSWRzW2VsZS5pZCgpXTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICB2YXIgb2xkUGFyZW50SWQgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJwYXJlbnRcIik7XG4gICAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZFxuICAgIG5ld0NvbXBvdW5kID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMobm9kZXNUb01ha2VDb21wb3VuZCwgcGFyYW0uY29tcG91bmRUeXBlKTtcbiAgfVxuICBlbHNlIHtcbiAgICBuZXdDb21wb3VuZCA9IHBhcmFtLnJlbW92ZWRDb21wb3VuZC5yZXN0b3JlKCk7XG4gICAgdmFyIG5ld0NvbXBvdW5kSWQgPSBuZXdDb21wb3VuZC5pZCgpO1xuXG4gICAgbm9kZXNUb01ha2VDb21wb3VuZC5tb3ZlKHtwYXJlbnQ6IG5ld0NvbXBvdW5kSWR9KTtcblxuICAgIHNiZ252aXoucmVmcmVzaFBhZGRpbmdzKCk7XG4gIH1cblxuICByZXR1cm4gbmV3Q29tcG91bmQ7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVDb21wb3VuZCA9IGZ1bmN0aW9uIChjb21wb3VuZFRvUmVtb3ZlKSB7XG4gIHZhciByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZUNvbXBvdW5kKGNvbXBvdW5kVG9SZW1vdmUpO1xuXG4gIHZhciBwYXJhbSA9IHtcbiAgICBub2Rlc1RvTWFrZUNvbXBvdW5kOiByZXN1bHQuY2hpbGRyZW5PZkNvbXBvdW5kLFxuICAgIHJlbW92ZWRDb21wb3VuZDogcmVzdWx0LnJlbW92ZWRDb21wb3VuZFxuICB9O1xuXG4gIHJldHVybiBwYXJhbTtcbn07XG5cbi8vIFNlY3Rpb24gRW5kXG4vLyBhZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gZWFzeSBjcmVhdGlvbiBhY3Rpb24gZnVuY3Rpb25zXG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgdmFyIGVsZXM7XG5cbiAgaWYgKGZpcnN0VGltZSkge1xuICAgIGVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24ocGFyYW0udGVtcGxhdGVUeXBlLCBwYXJhbS5tYWNyb21vbGVjdWxlTGlzdCwgcGFyYW0uY29tcGxleE5hbWUsIHBhcmFtLnByb2Nlc3NQb3NpdGlvbiwgcGFyYW0udGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCBwYXJhbS50aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgcGFyYW0uZWRnZUxlbmd0aClcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVzID0gcGFyYW07XG4gICAgY3kuYWRkKGVsZXMpO1xuICAgIFxuICAgIHNiZ252aXoucmVmcmVzaFBhZGRpbmdzKCk7XG4gICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgIGVsZXMuc2VsZWN0KCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVsZXM6IGVsZXNcbiAgfTtcbn07XG5cbi8vIFNlY3Rpb24gRW5kXG4vLyBlYXN5IGNyZWF0aW9uIGFjdGlvbiBmdW5jdGlvbnNcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwb3NpdGlvbnMgPSB7fTtcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcbiAgXG4gIG5vZGVzLmVhY2goZnVuY3Rpb24oaSwgZWxlKSB7XG4gICAgcG9zaXRpb25zW2VsZS5pZCgpXSA9IHtcbiAgICAgIHg6IGVsZS5wb3NpdGlvbihcInhcIiksXG4gICAgICB5OiBlbGUucG9zaXRpb24oXCJ5XCIpXG4gICAgfTtcbiAgfSk7XG5cbiAgcmV0dXJuIHBvc2l0aW9ucztcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zID0gZnVuY3Rpb24gKHBvc2l0aW9ucykge1xuICB2YXIgY3VycmVudFBvc2l0aW9ucyA9IHt9O1xuICBjeS5ub2RlcygpLnBvc2l0aW9ucyhmdW5jdGlvbiAoaSwgZWxlKSB7XG4gICAgY3VycmVudFBvc2l0aW9uc1tlbGUuaWQoKV0gPSB7XG4gICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxuICAgICAgeTogZWxlLnBvc2l0aW9uKFwieVwiKVxuICAgIH07XG4gICAgXG4gICAgdmFyIHBvcyA9IHBvc2l0aW9uc1tlbGUuaWQoKV07XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHBvcy54LFxuICAgICAgeTogcG9zLnlcbiAgICB9O1xuICB9KTtcblxuICByZXR1cm4gY3VycmVudFBvc2l0aW9ucztcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciByZXN1bHQgPSB7XG4gICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZVxuICB9O1xuXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuXG4gIHJlc3VsdC5zaXplTWFwID0ge307XG4gIHJlc3VsdC51c2VBc3BlY3RSYXRpbyA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHJlc3VsdC5zaXplTWFwW25vZGUuaWQoKV0gPSB7XG4gICAgICB3OiBub2RlLndpZHRoKCksXG4gICAgICBoOiBub2RlLmhlaWdodCgpXG4gICAgfTtcbiAgfVxuXG4gIHJlc3VsdC5ub2RlcyA9IG5vZGVzO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuXG4gICAgaWYgKHBhcmFtLnBlcmZvcm1PcGVyYXRpb24pIHtcbiAgICAgIGlmIChwYXJhbS5zaXplTWFwKSB7XG4gICAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS53O1xuICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0uaDtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKHBhcmFtLm5vZGVzLCBwYXJhbS53aWR0aCwgcGFyYW0uaGVpZ2h0LCBwYXJhbS51c2VBc3BlY3RSYXRpbyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0ge1xuICB9O1xuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgcmVzdWx0Lm5vZGVzID0gbm9kZXM7XG4gIHJlc3VsdC5sYWJlbCA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHJlc3VsdC5sYWJlbFtub2RlLmlkKCldID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICB9XG5cbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgIG5vZGVzLmRhdGEoJ2xhYmVsJywgcGFyYW0ubGFiZWwpO1xuICB9XG4gIGVsc2Uge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICBub2RlLl9wcml2YXRlLmRhdGEubGFiZWwgPSBwYXJhbS5sYWJlbFtub2RlLmlkKCldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciByZXN1bHQgPSB7XG4gIH07XG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcbiAgcmVzdWx0Lm5hbWUgPSBwYXJhbS5uYW1lO1xuICByZXN1bHQudmFsdWVNYXAgPSB7fTtcbiAgcmVzdWx0LmVsZXMgPSBlbGVzO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuICAgIHJlc3VsdC52YWx1ZU1hcFtlbGUuaWQoKV0gPSBlbGUuZGF0YShwYXJhbS5uYW1lKTtcbiAgfVxuXG4gIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShwYXJhbS5lbGVzLCBwYXJhbS5uYW1lLCBwYXJhbS52YWx1ZU1hcCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUNzcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0ge1xuICB9O1xuICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG4gIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTtcbiAgcmVzdWx0LnZhbHVlTWFwID0ge307XG4gIHJlc3VsdC5lbGVzID0gZWxlcztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICByZXN1bHQudmFsdWVNYXBbZWxlLmlkKCldID0gZWxlLmNzcyhwYXJhbS5uYW1lKTtcbiAgfVxuXG4gIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzKHBhcmFtLmVsZXMsIHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlTWFwKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgfTtcblxuICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG4gIHJlc3VsdC5kYXRhID0ge307XG4gIHJlc3VsdC5lbGVzID0gZWxlcztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZWxlID0gZWxlc1tpXTtcblxuICAgIHJlc3VsdC5kYXRhW2VsZS5pZCgpXSA9IHt9O1xuXG4gICAgdmFyIGRhdGEgPSBwYXJhbS5maXJzdFRpbWUgPyBwYXJhbS5kYXRhIDogcGFyYW0uZGF0YVtlbGUuaWQoKV07XG5cbiAgICBmb3IgKHZhciBwcm9wIGluIGRhdGEpIHtcbiAgICAgIC8vIElmIHByb3AgaXMgbGFiZWxzaXplIGl0IGlzIHBhcnQgb2YgZWxlbWVudCBkYXRhIGVsc2UgaXQgaXMgcGFydCBvZiBlbGVtZW50IGNzc1xuICAgICAgaWYgKHByb3AgPT09ICdsYWJlbHNpemUnKSB7XG4gICAgICAgIHJlc3VsdC5kYXRhW2VsZS5pZCgpXVtwcm9wXSA9IGVsZS5kYXRhKHByb3ApO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdC5kYXRhW2VsZS5pZCgpXVtwcm9wXSA9IGVsZS5jc3MocHJvcCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgZGF0YSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICAgIFxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyhlbGUsIGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKlxuICogU2hvdyBlbGVzIGFuZCBwZXJmb3JtIGxheW91dC5cbiAqL1xudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gIHZhciByZXN1bHQgPSB7fTtcbiAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcbiAgXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICByZXN1bHQuZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQocGFyYW0uZWxlcywgcGFyYW0ubGF5b3V0cGFyYW0pO1xuICB9XG4gIGVsc2Uge1xuICAgIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgZ2l2ZW4gZWxlc1xuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcblxuICB2YXIgcmVzdWx0ID0ge307XG4gIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XG4gIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLmhpZGUoZWxlcyk7IC8vIEhpZGUgcHJldmlvdXNseSB1bmhpZGRlbiBlbGVzO1xuXG4gIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIFNlY3Rpb24gRW5kXG4vLyBnZW5lcmFsIGFjdGlvbiBmdW5jdGlvbnNcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciByZXN1bHQgPSB7XG4gIH07XG4gIHJlc3VsdC50eXBlID0gcGFyYW0udHlwZTtcbiAgcmVzdWx0Lm5vZGVzID0gcGFyYW0ubm9kZXM7XG4gIHJlc3VsdC5pbmRleCA9IHBhcmFtLmluZGV4O1xuXG4gIHJlc3VsdC52YWx1ZSA9IGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3gocGFyYW0ubm9kZXMsIHBhcmFtLmluZGV4LCBwYXJhbS52YWx1ZSwgcGFyYW0udHlwZSk7XG5cbiAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIG9iaiA9IHBhcmFtLm9iajtcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG5cbiAgdmFyIGluZGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChub2Rlcywgb2JqKTtcblxuICBjeS5mb3JjZVJlbmRlcigpO1xuXG4gIHZhciByZXN1bHQgPSB7XG4gICAgbm9kZXM6IG5vZGVzLFxuICAgIGluZGV4OiBpbmRleCxcbiAgICBvYmo6IG9ialxuICB9O1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIGluZGV4ID0gcGFyYW0uaW5kZXg7XG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuXG4gIHZhciBvYmogPSBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94KG5vZGVzLCBpbmRleCk7XG5cbiAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICB2YXIgcmVzdWx0ID0ge1xuICAgIG5vZGVzOiBub2RlcyxcbiAgICBvYmo6IG9ialxuICB9O1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG4gIHZhciBzdGF0dXMgPSBwYXJhbS5zdGF0dXM7XG4gIHZhciByZXN1bHRTdGF0dXMgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgaXNNdWx0aW1lciA9IG5vZGUuZGF0YSgnY2xhc3MnKS5lbmRzV2l0aCgnIG11bHRpbWVyJyk7XG5cbiAgICByZXN1bHRTdGF0dXNbbm9kZS5pZCgpXSA9IGlzTXVsdGltZXI7XG4gIH1cblxuICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIGNoYW5nZSB0aGUgc3RhdHVzIG9mIGFsbCBub2RlcyBhdCBvbmNlLlxuICAvLyBJZiBub3QgY2hhbmdlIHN0YXR1cyBvZiBlYWNoIHNlcGVyYXRlbHkgdG8gdGhlIHZhbHVlcyBtYXBwZWQgdG8gdGhlaXIgaWQuXG4gIGlmIChmaXJzdFRpbWUpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xuICB9XG4gIGVsc2Uge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGUsIHN0YXR1c1tub2RlLmlkKCldKTtcbiAgICB9XG4gIH1cblxuLy8gIGlmICghZmlyc3RUaW1lICYmIF8uaXNFcXVhbChub2RlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xuLy8gICAgJCgnI2luc3BlY3Rvci1pcy1tdWx0aW1lcicpLmF0dHIoXCJjaGVja2VkXCIsICEkKCcjaW5zcGVjdG9yLWlzLW11bHRpbWVyJykuYXR0cihcImNoZWNrZWRcIikpO1xuLy8gIH1cblxuICB2YXIgcmVzdWx0ID0ge1xuICAgIHN0YXR1czogcmVzdWx0U3RhdHVzLFxuICAgIG5vZGVzOiBub2Rlc1xuICB9O1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgdmFyIHN0YXR1cyA9IHBhcmFtLnN0YXR1cztcbiAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgdmFyIHJlc3VsdFN0YXR1cyA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHJlc3VsdFN0YXR1c1tub2RlLmlkKCldID0gbm9kZS5kYXRhKCdjbG9uZW1hcmtlcicpO1xuICAgIHZhciBjdXJyZW50U3RhdHVzID0gZmlyc3RUaW1lID8gc3RhdHVzIDogc3RhdHVzW25vZGUuaWQoKV07XG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhub2RlLCBjdXJyZW50U3RhdHVzKTtcbiAgfVxuXG4vLyAgaWYgKCFmaXJzdFRpbWUgJiYgXy5pc0VxdWFsKG5vZGVzLCBjeS5ub2RlcygnOnNlbGVjdGVkJykpKSB7XG4vLyAgICAkKCcjaW5zcGVjdG9yLWlzLWNsb25lLW1hcmtlcicpLmF0dHIoXCJjaGVja2VkXCIsICEkKCcjaW5zcGVjdG9yLWlzLWNsb25lLW1hcmtlcicpLmF0dHIoXCJjaGVja2VkXCIpKTtcbi8vICB9XG5cbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBzdGF0dXM6IHJlc3VsdFN0YXR1cyxcbiAgICBub2Rlczogbm9kZXNcbiAgfTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLy8gU2VjdGlvbiBFbmRcbi8vIHNiZ24gYWN0aW9uIGZ1bmN0aW9uc1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zOyJdfQ==
