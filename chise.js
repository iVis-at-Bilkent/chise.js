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
module.exports = function (sbgnviz) {
  //Helpers
  
  // This function is to be called after nodes are resized throuh the node resize extension or through undo/redo actions
  var nodeResizeEndFunction = function (nodes) {
    nodes.removeClass('changeLabelTextSize');
    nodes.addClass('changeLabelTextSize');

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var w = node.width();
      var h = node.height();

      node.removeStyle('width');
      node.removeStyle('height');

      node.data('sbgnbbox').w = w;
      node.data('sbgnbbox').h = h;
    }

    nodes.removeClass('noderesized');
    nodes.addClass('noderesized');
  };
  
  // Update cy stylesheet
  var upateStyleSheet = function() {
    cy.style()
    .selector("node[class][fontweight]")
    .style({
      'font-weight': function(ele) {
        return ele.data('fontweight');
      }
    })
    .selector("node[class][fontfamily]")
    .style({
      'font-family': function(ele) {
        return ele.data('fontfamily');
      }
    })
    .selector("node[class][fontstyle]")
    .style({
      'font-style': function(ele) {
        return ele.data('fontstyle');
      }
    })
    .selector("node[class='complex'],node[class='compartment'],node.cancel-dynamic-label-size[fontsize]")
    .style({
      'font-size': function (ele) {
        return ele.data('fontsize');
      }
    })
    .selector("node.resized")
    .style({
      'width': 'data(bbox.w)',
      'height': 'data(bbox.h)'
    }).update();
  };
  
  // Bind events
  var bindCyEvents = function() {
    cy.on("noderesize.resizeend", function (event, type, node) {
      nodeResizeEndFunction(node);
    });

    cy.on("afterDo", function (event, actionName, args) {
      refreshUndoRedoButtonsStatus();

      if (actionName === 'changeParent') {
        sbgnviz.refreshPaddings();
      }
    });

    cy.on("afterUndo", function (event, actionName, args) {
      refreshUndoRedoButtonsStatus();

      if (actionName === 'resize') {
        nodeResizeEndFunction(args.node);
      }
      else if (actionName === 'changeParent') {
        sbgnviz.refreshPaddings();
      }
    });

    cy.on("afterRedo", function (event, actionName, args) {
      refreshUndoRedoButtonsStatus();

      if (actionName === 'resize') {
        nodeResizeEndFunction(args.node);
      }
      else if (actionName === 'changeParent') {
        sbgnviz.refreshPaddings();
      }
    });
  };
  // Helpers End
  
  // Initilize font related data of the elements which can have label
  cy.nodes().each(function(ele) {
    if (elementUtilities.canHaveSBGNLabel(ele)) {
      ele.data('labelsize', elementUtilities.getDefaultLabelSize(ele));
      ele.data('fontweight', elementUtilities.defaultFontProperties.fontweight);
      ele.data('fontfamily', elementUtilities.defaultFontProperties.fontfamily);
      ele.data('fontstyle', elementUtilities.defaultFontProperties.fontstyle);
    }
  });
  
  cy.nodes().addClass('cancel-dynamic-label-size'); // TODO think of a better way
  
  upateStyleSheet();
  bindCyEvents();
};
},{}],3:[function(_dereq_,module,exports){
// Extends sbgnviz.elementUtilities
var libs = _dereq_('./lib-utilities').getLibs();
var elementUtilities = libs.sbgnviz.elementUtilities;

elementUtilities.defaultSizes = {
  "process": {
    width: 30,
    height: 30
  },
  "omitted process": {
    width: 30,
    height: 30
  },
  "uncertain process": {
    width: 30,
    height: 30
  },
  "associationprocess": {
    width: 30,
    height: 30
  },
  "association": {
    width: 30,
    height: 30
  },
  "dissociation": {
    width: 30,
    height: 30
  },
  "macromolecule": {
    width: 100,
    height: 50
  },
  "nucleic acid feature": {
    width: 100,
    height: 50
  },
  "phenotype": {
    width: 100,
    height: 50
  },
  "unspecified entity": {
    width: 100,
    height: 50
  },
  "perturbing agent": {
    width: 100,
    height: 50
  },
  "complex": {
    width: 100,
    height: 100
  },
  "compartment": {
    width: 100,
    height: 100
  }
};

elementUtilities.defaultFontProperties = {
  fontfamily: 'Helvetica',
  fontweight: 'normal',
  fontstyle: 'normal'
};

elemetUtilities.getDefaultLabelSize = function (sbgnclass) {
  if (!elementUtilities.canHaveSBGNLabel(sbgnclass)) {
    return undefined;
  }
  else if (sbgnclass === 'complex' || sbgnclass === 'compartment') {
    return 16;
  }
  else {
    return 20;
  }
};

// Section Start
// Add remove utilities

elemetUtilities.addNode = function (x, y, sbgnclass, parent, visibility) {
  var defaultSizes = this.defaultSizes;
  var defaults = defaultSizes[sbgnclass];

  var width = defaults ? defaults.width : 50;
  var height = defaults ? defaults.height : 50;



  var css = defaults ? {
    'border-width': defaults['border-width'],
//      'border-color': defaults['border-color'],
    'background-color': defaults['background-color'],
//      'font-size': defaults['font-size'],
    'background-opacity': defaults['background-opacity']
  } : {};

  if (visibility) {
    css.visibility = visibility;
  }

  if (defaults && defaults.multimer) {
    sbgnclass += " multimer";
  }
  var data = {
    sbgnclass: sbgnclass,
    sbgnbbox: {
      h: height,
      w: width,
      x: x,
      y: y
    },
    sbgnstatesandinfos: [],
    ports: [],
    labelsize: elementUtilities.canHaveSBGNLabel(sbgnclass) ? (defaults && defaults.labelsize) || this.getDefaultLabelSize(sbgnclass) : undefined,
    fontfamily: elementUtilities.canHaveSBGNLabel(sbgnclass) ? (defaults && defaults.fontfamily) || this.defaultFontProperties.fontfamily : undefined,
    fontweight: elementUtilities.canHaveSBGNLabel(sbgnclass) ? (defaults && defaults.fontweight) || this.defaultFontProperties.fontweight : undefined,
    fontstyle: elementUtilities.canHaveSBGNLabel(sbgnclass) ? (defaults && defaults.fontstyle) || this.defaultFontProperties.fontstyle : undefined
  };

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
  if (defaults && defaults['border-color']) {
    newNode.data('borderColor', defaults['border-color']);
  }
  else {
    newNode.data('borderColor', newNode.css('border-color'));
  }
  if (defaults && defaults['clonemarker']) {
    newNode._private.data.clonemarker = defaults.clonemarker;
  }

  newNode.addClass('changeBorderColor');
  newNode.addClass('changeBackgroundOpacity');

  refreshPaddings();
  return newNode;
};

elementUtilities.addEdge = function (source, target, sbgnclass, visibility) {
  var defaultSizes = this.defaultSizes;
  var defaults = defaultSizes[sbgnclass];
  var css = defaults ? {
    'width': defaults['width']
  } : {};

  if (visibility) {
    css.visibility = visibility;
  }

  var eles = cy.add({
    group: "edges",
    data: {
      source: source,
      target: target,
      sbgnclass: sbgnclass
    },
    css: css
  });

  var newEdge = eles[eles.length - 1];
  if (defaults && defaults['line-color']) {
    newEdge.data('lineColor', defaults['line-color']);
  }
  else {
    newEdge.data('lineColor', newEdge.css('line-color'));
  }
  newEdge.addClass('changeLineColor');
  return newEdge;
};

/*
 * This method assumes that param.nodesToMakeCompound contains at least one node
 * and all of the nodes including in it have the same parent. It creates a compound fot the given nodes an having the given type.
 */
elementUtilities.createCompoundForGivenNodes = function (nodesToMakeCompound, compundType) {
  var oldParentId = nodesToMakeCompound[0].data("parent");
  // The parent of new compound will be the old parent of the nodes to make compound
  var newCompound = elementUtilities.addNode(undefined, undefined, compundType, oldParentId, true);
  var newCompoundId = newCompound.id();
  nodesToMakeCompound.move({parent: newCompoundId});
  refreshPaddings();
  return newCompound;
};

/*
 * Removes a compound. Before the removal operation moves the children of that compound to the parent of the compound.
 */
elementUtilities.removeCompound = function (compoundToRemove) {
  var compoundId = compoundToRemove.id();
  var newParentId = compoundToRemove.data("parent");
  newParentId = newParentId === undefined ? null : newParentId;
  var childrenOfCompound = compoundToRemove.children();

  childrenOfCompound.move({parent: newParentId});
  var removedCompund = compoundToRemove.remove();
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
  var defaultMacromoleculProperties = elementUtilities.defaultSizes["macromolecule"];
  var templateType = templateType;
  var processWidth = elementUtilities.defaultSizes[templateType] ? elementUtilities.defaultSizes[templateType].width : 50;
  var macromoleculeWidth = defaultMacromoleculProperties ? defaultMacromoleculProperties.width : 50;
  var macromoleculeHeight = defaultMacromoleculProperties ? defaultMacromoleculProperties.height : 50;
  var processPosition = processPosition ? processPosition : elementUtilities.convertToModelPosition({x: cy.width() / 2, y: cy.height() / 2});
  var macromoleculeList = macromoleculeList;
  var complexName = complexName;
  var numOfMacromolecules = macromoleculeList.length;
  var tilingPaddingVertical = tilingPaddingVertical ? tilingPaddingVertical : 15;
  var tilingPaddingHorizontal = tilingPaddingHorizontal ? tilingPaddingHorizontal : 15;
  var edgeLength = edgeLength ? edgeLength : 60;

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
    newNode.data('sbgnlabel', macromoleculeList[i]);

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
    complex.data('sbgnlabel', complexName);
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
    var newNode = elementUtilities.addNode(complex.position('x'), complex.position('y'), "macromolecule", complex.id());
    newNode.data('justAdded', true);
    newNode.data('sbgnlabel', macromoleculeList[i]);
    newNode.data('justAddedLayoutNode', true);
  }

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
  
  refreshPaddings();
  cy.elements().unselect();
  eles.select();
  
  return eles; // Return the just added elements
};

// Resize given nodes if useAspectRatio is truthy one of width or height should not be set.
elementUtilities.resizeNodes = function (nodes, width, height, useAspectRatio) {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var ratio = undefined;
    var eleMustBeSquare = elementUtilities.mustBeSquare(node.data('sbgnclass'));

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

    node.removeClass('noderesized');
    node.addClass('noderesized');
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
    if (isFunction ? propertyName(elements[i]) : elements[i][dataOrCss](propertyName) != value) {
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
// This method the old value of the changed data (We assume that the old value of the changed data was the same for all nodes).
elementUtilities.changeStateOrInfoBox = function (nodes, index, value, type) {
  var result;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var stateAndInfos = node.data('stateandinfos');
    var box = stateAndInfos[i];

    if (box.clazz == "state variable") {
      if (!result) {
        result = box.state[type];
      }

      box.state[type] = value;
    }
    else if (state.clazz == "unit of information") {
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
    var stateAndInfos = node.data('stateandinfos');
    stateAndInfos.push(obj);
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
    var stateAndInfos = node.data('stateandinfos');
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
    var sbgnclass = node.data('sbgnclass');
    var isMultimer = node.data('sbgnclass').endsWith(' multimer');

    if (status) { // Make multimer status true
      if (!isMultimer) {
        node.data('sbgnclass', sbgnclass + ' multimer');
      }
    }
    else { // Make multimer status false
      if (isMultimer) {
        node.data('sbgnclass', sbgnclass.replace(' multimer', ''));
      }
    }
  }
};

// Set clone marker status of given nodes to the given status.
elementUtilities.setCloneMarkerStatus = function (nodes, status) {
  cy.startBatch();

  nodes.data('clonemarker', status ? true : undefined);
  var nodesToAddClass = nodes.filter('[class="perturbing agent"]');
  nodesToAddClass.removeClass('changeClonedStatus');
  nodesToAddClass.addClass('changeClonedStatus');

  cy.endBatch();
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
  var sourceclass = typeof source === 'string' ? source : source.data('class');
  var targetclass = typeof target === 'string' ? target : target.data('class');

  if (edgeclass == 'consumption' || edgeclass == 'modulation'
          || edgeclass == 'stimulation' || edgeclass == 'catalysis'
          || edgeclass == 'inhibition' || edgeclass == 'necessary stimulation') {
    if (!this.isEPNClass(sourceclass) || !this.isEPNClass(targetclass)) {
      if (this.isEPNClass(sourceclass) && this.isEPNClass(targetclass)) {
        //If just the direction is not valid reverse the direction
        return 'reverse';
      }
      else {
        return 'invalid';
      }
    }
  }
  else if (edgeclass == 'production') {
    if (!this.isEPNClass(sourceclass) || !this.isEPNClass(targetclass)) {
      if (this.isEPNClass(sourceclass) && this.isEPNClass(targetclass)) {
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
 * Change style/css of given eles by setting getting property name to the given value.
 * Considers undoable option.
 */
elementUtilities.changeCss = function(eles, name, value) {
  if (options.undoable) {
    eles.css(name, value);
    cy.style().update();
  }
  else {
    var param = {
      eles: eles,
      value: value,
      name: name,
      firstTime: true
    };
    
    cy.undoRedo().do("changeCss", param);
  }
};

/*
 * Change data of given eles by setting getting property name to the given value.
 * Considers undoable option.
 */
elementUtilities.changeData = function(eles, name, value) {
  if (options.undoable) {
    eles.data(name, value);
    cy.style().update();
  }
  else {
    var param = {
      eles: eles,
      value: value,
      name: name,
      firstTime: true
    };
    
    cy.undoRedo().do("changeData", param);
  }
};

module.exports = elementUtilities;
},{"./lib-utilities":4}],4:[function(_dereq_,module,exports){
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
/*
 * The main utilities to be exposed directly.
 */
function mainUtilities() {
};

/*
 * Adds a new node with the given class and at the given coordinates.
 */
mainUtilities.addNode = function(x, y , nodeclass) {
  if (options.undoable) {
    return elementUtilities.addNode(x, y, nodeclass);
  }
  else {
    var param = {
      newNode : {
        x: x,
        y: y,
        class: nodeclass
      }
    };
    
    cy.undoRedo().do("addNode", param);
  }
};

/*
 * Adds a new edge with the given class and having the given source and target ids
 */
mainUtilities.addEdge = function(source, target , edgeclass) {
  if (options.undoable) {
    return elementUtilities.addEdge(source, target, edgeclass);
  }
  else {
    var param = {
      newEdge : {
        source: source,
        target: target,
        sbgnclass: edgeclass
      }
    };
    
    cy.undoRedo().do("addEdge", param);
  }
};

/*
 * Clone given elements. Considers undoable option. Requires cytoscape-clipboard extension.
 */
mainUtilities.cloneElements = function (eles) {
  var cb = cy.clipboard();
  var _id = cb.copy(eles, "cloneOperation");

  if (options.undoable) {
    cy.undoRedo().do("paste", {id: _id});
  } else {
    cb.paste(_id);
  }
};

/*
 * Aligns given nodes in given horizontal and vertical order. 
 * Horizontal and vertical parameters may be 'none' or undefined.
 * alignTo parameter indicates the leading node.
 * Requrires cytoscape-grid-guide extension and considers undoable option.
 */
mainUtilities.align = function (nodes, horizontal, vertical, alignTo) {
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
      compundType: compoundType,
      nodesToMakeCompound: nodes
    };

    cy.undoRedo().do("createCompoundForGivenNodes", param);
  }
  else {
    elementUtilities.createCompoundForGivenNodes(nodes, compoundType);
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
};

/*
 * Changes the label of the given nodes to the given label. Considers undoable option.
 */
mainUtilities.changeNodeLabel = function(nodes, label) {
  if (options.undoable) {
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
 * Change font properties for given eles use the given font data.
 * Considers undoable option.
 */
mainUtilities.changeFontProperties = function(eles, data) {
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
};

/*
 * Change state value or unit of information box of given nodes with given index.
 * Considers undoable option.
 * For more information about the parameters see elementUtilities.changeStateOrInfoBox
 */
mainUtilities.changeStateOrInfoBox = function(nodes, index, value, type) {
  if (options.undoable) {
    var param = {
      index: index,
      value: value,
      type: type,
      nodes: nodes
    };
  }
  else {
    return elementUtilities.changeStateOrInfoBox(nodes, index, value, type);
  }
};

// Add a new state or info box to given nodes.
// The box is represented by the parameter obj.
// Considers undoable option.
mainUtilities.addStateOrInfoBox = function(nodes, obj) {
  if (options.undoable) {
    elementUtilities.addStateOrInfoBox(nodes, obj);
  }
  else {
    var param = {
      obj: obj,
      nodes: nodes
    };
    
    cy.undoRedo().do("addStateOrInfoBox", param);
  }
};

// Remove the state or info boxes of the given nodes at given index.
// Considers undoable option.
mainUtilities.removeStateOrInfoBox = function(nodes, index) {
  if (options.undoable) {
    elementUtilities.removeStateOrInfoBox(nodes, index);
  }
  else {
    var param = {
      index: index,
      nodes: nodes
    };

    cy.undoRedo().do("removeStateOrInfoBox", param);
  }
};

/*
 * Set multimer status of the given nodes to the given status.
 * Considers undoable option.
 */
mainUtilities.setMultimerStatus = function(nodes, status) {
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
};

/*
 * Set clone marker status of given nodes to the given status.
 * Considers undoable option.
 */ 
mainUtilities.setCloneMarkerStatus = function(nodes, status) {
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
};

module.exports = mainUtilities;
},{}],6:[function(_dereq_,module,exports){
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
  // TODO remove this
  ur.action("changeData", undoRedoActionFunctions.changeData, undoRedoActionFunctions.changeData);
  ur.action("changeCss", undoRedoActionFunctions.changeCss, undoRedoActionFunctions.changeCss);
  ur.action("changeBendPoints", undoRedoActionFunctions.changeBendPoints, undoRedoActionFunctions.changeBendPoints);
  ur.action("changeFontProperties", undoRedoActionFunctions.changeFontProperties, undoRedoActionFunctions.changeFontProperties);
  ur.action("showAndPerformIncrementalLayout", undoRedoActionFunctions.showAndPerformIncrementalLayout, undoRedoActionFunctions.undoShowAndPerformIncrementalLayout);

  // register SBGN actions
  ur.action("addStateAndInfo", undoRedoActionFunctions.addStateAndInfo, undoRedoActionFunctions.removeStateOrInfoBox);
  ur.action("changeStateOrInfoBox", undoRedoActionFunctions.changeStateOrInfoBox, undoRedoActionFunctions.changeStateOrInfoBox);
  ur.action("changeUnitOfInformation", undoRedoActionFunctions.changeUnitOfInformation, undoRedoActionFunctions.changeUnitOfInformation);
  ur.action("setMultimerStatus", undoRedoActionFunctions.setMultimerStatus, undoRedoActionFunctions.setMultimerStatus);
  ur.action("setCloneMarkerStatus", undoRedoActionFunctions.setCloneMarkerStatus, undoRedoActionFunctions.setCloneMarkerStatus);
  ur.action("removeStateOrInfoBox", undoRedoActionFunctions.removeStateOrInfoBox, undoRedoActionFunctions.addStateAndInfo);
  
  // register easy creation actions
  ur.action("createTemplateReaction", undoRedoActionFunctions.createTemplateReaction, undoRedoActionFunctions.removeEles);
};

module.exports = registerUndoRedoActions;
},{"./undo-redo-action-functions":8}],8:[function(_dereq_,module,exports){
// Extends sbgnviz.undoRedoActionFunctions
var libs = _dereq_('./lib-utilities').getLibs();
var undoRedoActionFunctions = libs.sbgnviz.undoRedoActionFunctions;

// Section Start
// add/remove action functions

undoRedoActionFunctions.addNode = function (param) {
  var result;
  if (param.firstTime) {
    var newNode = param.newNode;
    result = elementUtilities.addNode(newNode.x, newNode.y, newNode.sbgnclass);
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
    result = elementUtilities.addEdge(newEdge.source, newEdge.target, newEdge.sbgnclass);
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
    newCompound = elementUtilities.createCompoundForGivenNodes(nodesToMakeCompound, param.compundType);
  }
  else {
    newCompound = param.removedCompund.restore();
    var newCompoundId = newCompound.id();

    nodesToMakeCompound.move({parent: newCompoundId});

    refreshPaddings();
  }

  return newCompound;
};

undoRedoActionFunctions.removeCompound = function (compoundToRemove) {
  elementUtilities.removeCompound(compoundToRemove);

  var param = {
    nodesToMakeCompound: childrenOfCompound,
    removedCompund: removedCompund
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
    
    refreshPaddings();
    cy.elements().unselect();
    eles.select();
  }

  return eles;
};

// Section End
// easy creation action functions

// Section Start
// general action functions

undoRedoActionFunctions.getNodePositionsAndSizes = function () {
  var positionsAndSizes = {};
  var nodes = cy.nodes();

  for (var i = 0; i < nodes.length; i++) {
    var ele = nodes[i];
    positionsAndSizes[ele.id()] = {
      width: ele.width(),
      height: ele.height(),
      x: ele.position("x"),
      y: ele.position("y")
    };
  }

  return positionsAndSizes;
};

undoRedoActionFunctions.returnToPositionsAndSizesConditionally = function (nodesData) {
  if (nodesData.firstTime) {
    delete nodesData.firstTime;
    return nodesData;
  }
  return this.returnToPositionsAndSizes(nodesData);
};

undoRedoActionFunctions.returnToPositionsAndSizes = function (nodesData) {
  var currentPositionsAndSizes = {};
  cy.nodes().positions(function (i, ele) {
    currentPositionsAndSizes[ele.id()] = {
      width: ele.width(),
      height: ele.height(),
      x: ele.position("x"),
      y: ele.position("y")
    };
    var data = nodesData[ele.id()];
    ele._private.data.width = data.width;
    ele._private.data.height = data.height;
    return {
      x: data.x,
      y: data.y
    };
  });

  return currentPositionsAndSizes;
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
        node.data("sbgnbbox").w = param.sizeMap[node.id()].w;
        node.data("sbgnbbox").h = param.sizeMap[node.id()].h;

        node.removeClass('noderesized');
        node.addClass('noderesized');
      }
      else {
        elementUtilities.resizeNodes(param.nodes, param.width, param.height, param.useAspectRatio);
      }
    }
  }

//  cy.style().update();
  nodes.removeClass('noderesized');
  nodes.addClass('noderesized');

  // TODO handle sbgn inspector after this call

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
  
  // cy.style().update();

  // TODO handle sbgn inspector after this call

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

  if (param.firstTime) {
    eles.data(param.name, param.value);
  }
  else {
    for (var i = 0; i < eles.length; i++) {
      var ele = eles[i];
      ele.data(param.name, param.valueMap[ele.id()]);
    }
  }

  //  cy.forceRender();
  cy.style().update(); // Update style

  // TODO handle sbgn inspector after this call

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

  if (param.firstTime) {
    eles.css(param.name, param.value);
  }
  else {
    for (var i = 0; i < eles.length; i++) {
      var ele = eles[i];
      ele.css(param.name, param.valueMap[ele.id()]);
    }
  }
//  cy.forceRender();
  cy.style().update(); // Update style

  // TODO move such calls to sample application maybe by triggering an event
//  if (_.isEqual(eles, cy.nodes(':selected'))) {
//    inspectorUtilities.handleSBGNInspector();
//  }

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
    elementUtilities.changeFontProperties(eles, param.data);
  }
  else {
    for (var i = 0; i < eles.length; i++) {
      var ele = eles[i];

      for (var prop in param.data[ele.id()]) {
        ele.data(prop, param.data[ele.id()][prop]);
      }
    }
  }

  return result;
};

// TODO reconsider this operation of undo of it.
undoRedoActionFunctions.showAndPerformIncrementalLayout = function (param) {
  var eles = param.eles;

  var result = {};
  result.positionAndSizes = this.getNodePositionsAndSizes();
  result.eles = eles.showEles();

  if (param.positionAndSizes) {
    this.returnToPositionsAndSizes(param.positionAndSizes);
  }
  else {
    triggerIncrementalLayout();
  }

  return result;
};

undoRedoActionFunctions.undoShowAndPerformIncrementalLayout = function (param) {
  var eles = param.eles;

  var result = {};
  result.positionAndSizes = this.getNodePositionsAndSizes();
  result.eles = eles.hideEles();

  this.returnToPositionsAndSizes(param.positionAndSizes);

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

  // TODO move such calls to sample application maybe by triggering an event
//  inspectorUtilities.fillInspectorStateAndInfos(param.nodes, param.nodes().data('stateandinfos'), param.width);

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

  // TODO fill inspector state and infos after this call
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
    var isMultimer = node.data('sbgnclass').endsWith(' multimer');

    resultMakeMultimer[node.id()] = isMultimer;
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

  if (!firstTime && _.isEqual(nodes, cy.nodes(':selected'))) {
    $('#inspector-is-multimer').attr("checked", !$('#inspector-is-multimer').attr("checked"));
  }

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
    elementUtilities.setCloneMarkerStatus(nodes, currentStatus);
  }

  cy.style().update();

  if (!firstTime && _.isEqual(nodes, cy.nodes(':selected'))) {
    $('#inspector-is-clone-marker').attr("checked", !$('#inspector-is-clone-marker').attr("checked"));
  }

  var result = {
    status: resultStatus,
    nodes: nodes
  };

  return result;
};

// Section End
// sbgn action functions

module.exports = undoRedoActionFunctions;
},{"./lib-utilities":4}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9saWItdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ255QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCl7XG4gIHZhciBjaGlzZSA9IHdpbmRvdy5jaGlzZSA9IGZ1bmN0aW9uKF9vcHRpb25zLCBfbGlicykge1xuICAgIHZhciBsaWJzID0ge307XG4gICAgbGlicy5qUXVlcnkgPSBfbGlicy5qUXVlcnkgfHwgalF1ZXJ5O1xuICAgIGxpYnMuY3l0b3NjYXBlID0gX2xpYnMuY3l0b3NjYXBlIHx8IGN5dG9zY2FwZTtcbiAgICBsaWJzLnNiZ252aXogPSBfbGlicy5zYmdudml6IHx8IHNiZ252aXo7XG4gICAgbGlicy5zYXZlQXMgPSBfbGlicy5maWxlc2F2ZXJqcyA/IF9saWJzLmZpbGVzYXZlcmpzLnNhdmVBcyA6IHNhdmVBcztcbiAgICBcbiAgICBsaWJzLnNiZ252aXooX29wdGlvbnMsIF9saWJzKTsgLy8gSW5pdGlsaXplIHNiZ252aXpcbiAgICBcbiAgICAvLyBTZXQgdGhlIGxpYnJhcmllcyB0byBhY2Nlc3MgdGhlbSBmcm9tIGFueSBmaWxlXG4gICAgdmFyIGxpYlV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKTtcbiAgICBsaWJVdGlsaXRpZXMuc2V0TGlicyhsaWJzKTtcbiAgICBcbiAgICB2YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcycpO1xuICAgIHZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMoX29wdGlvbnMpOyAvLyBFeHRlbmRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9uc1xuICAgIFxuICAgIC8vIFVwZGF0ZSBzdHlsZSBhbmQgYmluZCBldmVudHNcbiAgICB2YXIgY3lTdHlsZUFuZEV2ZW50cyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMnKTtcbiAgICBjeVN0eWxlQW5kRXZlbnRzKGxpYnMuc2JnbnZpeik7XG4gICAgXG4gICAgLy8gUmVnaXN0ZXIgdW5kby9yZWRvIGFjdGlvbnNcbiAgICB2YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9yZWdpc3Rlci11bmRvLXJlZG8tYWN0aW9ucycpO1xuICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKG9wdGlvbnMudW5kb2FibGVEcmFnKTtcbiAgICBcbiAgICB2YXIgbWFpblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzJyk7XG4gICAgdmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcycpO1xuICAgIHZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XG4gICAgLy8gRXhwb3NlIHRoZSBhcGlcbiAgICAvLyBFeHBvc2UgZWFjaCBtYWluIHV0aWxpdHkgc2VwZXJhdGVseVxuICAgIGZvciAodmFyIHByb3AgaW4gbWFpblV0aWxpdGllcykge1xuICAgICAgY2hpc2VbcHJvcF0gPSBtYWluVXRpbGl0aWVzW3Byb3BdO1xuICAgIH1cbiAgICBcbiAgICAvLyBFeHBvc2UgZWxlbWVudFV0aWxpdGllcyBhbmQgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgYXMgaXNcbiAgICBjaGlzZS5lbGVtZW50VXRpbGl0aWVzID0gZWxlbWVudFV0aWxpdGllcztcbiAgICBjaGlzZS51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xuICB9O1xuICBcbiAgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGNoaXNlO1xuICB9XG59KSgpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHNiZ252aXopIHtcbiAgLy9IZWxwZXJzXG4gIFxuICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHRvIGJlIGNhbGxlZCBhZnRlciBub2RlcyBhcmUgcmVzaXplZCB0aHJvdWggdGhlIG5vZGUgcmVzaXplIGV4dGVuc2lvbiBvciB0aHJvdWdoIHVuZG8vcmVkbyBhY3Rpb25zXG4gIHZhciBub2RlUmVzaXplRW5kRnVuY3Rpb24gPSBmdW5jdGlvbiAobm9kZXMpIHtcbiAgICBub2Rlcy5yZW1vdmVDbGFzcygnY2hhbmdlTGFiZWxUZXh0U2l6ZScpO1xuICAgIG5vZGVzLmFkZENsYXNzKCdjaGFuZ2VMYWJlbFRleHRTaXplJyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgdmFyIHcgPSBub2RlLndpZHRoKCk7XG4gICAgICB2YXIgaCA9IG5vZGUuaGVpZ2h0KCk7XG5cbiAgICAgIG5vZGUucmVtb3ZlU3R5bGUoJ3dpZHRoJyk7XG4gICAgICBub2RlLnJlbW92ZVN0eWxlKCdoZWlnaHQnKTtcblxuICAgICAgbm9kZS5kYXRhKCdzYmduYmJveCcpLncgPSB3O1xuICAgICAgbm9kZS5kYXRhKCdzYmduYmJveCcpLmggPSBoO1xuICAgIH1cblxuICAgIG5vZGVzLnJlbW92ZUNsYXNzKCdub2RlcmVzaXplZCcpO1xuICAgIG5vZGVzLmFkZENsYXNzKCdub2RlcmVzaXplZCcpO1xuICB9O1xuICBcbiAgLy8gVXBkYXRlIGN5IHN0eWxlc2hlZXRcbiAgdmFyIHVwYXRlU3R5bGVTaGVldCA9IGZ1bmN0aW9uKCkge1xuICAgIGN5LnN0eWxlKClcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250d2VpZ2h0XVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnZm9udC13ZWlnaHQnOiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250d2VpZ2h0Jyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250ZmFtaWx5XVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnZm9udC1mYW1pbHknOiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250ZmFtaWx5Jyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250c3R5bGVdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdmb250LXN0eWxlJzogZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnZm9udHN0eWxlJyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzPSdjb21wbGV4J10sbm9kZVtjbGFzcz0nY29tcGFydG1lbnQnXSxub2RlLmNhbmNlbC1keW5hbWljLWxhYmVsLXNpemVbZm9udHNpemVdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdmb250LXNpemUnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnZm9udHNpemUnKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zZWxlY3RvcihcIm5vZGUucmVzaXplZFwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnd2lkdGgnOiAnZGF0YShiYm94LncpJyxcbiAgICAgICdoZWlnaHQnOiAnZGF0YShiYm94LmgpJ1xuICAgIH0pLnVwZGF0ZSgpO1xuICB9O1xuICBcbiAgLy8gQmluZCBldmVudHNcbiAgdmFyIGJpbmRDeUV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIGN5Lm9uKFwibm9kZXJlc2l6ZS5yZXNpemVlbmRcIiwgZnVuY3Rpb24gKGV2ZW50LCB0eXBlLCBub2RlKSB7XG4gICAgICBub2RlUmVzaXplRW5kRnVuY3Rpb24obm9kZSk7XG4gICAgfSk7XG5cbiAgICBjeS5vbihcImFmdGVyRG9cIiwgZnVuY3Rpb24gKGV2ZW50LCBhY3Rpb25OYW1lLCBhcmdzKSB7XG4gICAgICByZWZyZXNoVW5kb1JlZG9CdXR0b25zU3RhdHVzKCk7XG5cbiAgICAgIGlmIChhY3Rpb25OYW1lID09PSAnY2hhbmdlUGFyZW50Jykge1xuICAgICAgICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY3kub24oXCJhZnRlclVuZG9cIiwgZnVuY3Rpb24gKGV2ZW50LCBhY3Rpb25OYW1lLCBhcmdzKSB7XG4gICAgICByZWZyZXNoVW5kb1JlZG9CdXR0b25zU3RhdHVzKCk7XG5cbiAgICAgIGlmIChhY3Rpb25OYW1lID09PSAncmVzaXplJykge1xuICAgICAgICBub2RlUmVzaXplRW5kRnVuY3Rpb24oYXJncy5ub2RlKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGFjdGlvbk5hbWUgPT09ICdjaGFuZ2VQYXJlbnQnKSB7XG4gICAgICAgIHNiZ252aXoucmVmcmVzaFBhZGRpbmdzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjeS5vbihcImFmdGVyUmVkb1wiLCBmdW5jdGlvbiAoZXZlbnQsIGFjdGlvbk5hbWUsIGFyZ3MpIHtcbiAgICAgIHJlZnJlc2hVbmRvUmVkb0J1dHRvbnNTdGF0dXMoKTtcblxuICAgICAgaWYgKGFjdGlvbk5hbWUgPT09ICdyZXNpemUnKSB7XG4gICAgICAgIG5vZGVSZXNpemVFbmRGdW5jdGlvbihhcmdzLm5vZGUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoYWN0aW9uTmFtZSA9PT0gJ2NoYW5nZVBhcmVudCcpIHtcbiAgICAgICAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgLy8gSGVscGVycyBFbmRcbiAgXG4gIC8vIEluaXRpbGl6ZSBmb250IHJlbGF0ZWQgZGF0YSBvZiB0aGUgZWxlbWVudHMgd2hpY2ggY2FuIGhhdmUgbGFiZWxcbiAgY3kubm9kZXMoKS5lYWNoKGZ1bmN0aW9uKGVsZSkge1xuICAgIGlmIChlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOTGFiZWwoZWxlKSkge1xuICAgICAgZWxlLmRhdGEoJ2xhYmVsc2l6ZScsIGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdExhYmVsU2l6ZShlbGUpKTtcbiAgICAgIGVsZS5kYXRhKCdmb250d2VpZ2h0JywgZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0Rm9udFByb3BlcnRpZXMuZm9udHdlaWdodCk7XG4gICAgICBlbGUuZGF0YSgnZm9udGZhbWlseScsIGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdEZvbnRQcm9wZXJ0aWVzLmZvbnRmYW1pbHkpO1xuICAgICAgZWxlLmRhdGEoJ2ZvbnRzdHlsZScsIGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdEZvbnRQcm9wZXJ0aWVzLmZvbnRzdHlsZSk7XG4gICAgfVxuICB9KTtcbiAgXG4gIGN5Lm5vZGVzKCkuYWRkQ2xhc3MoJ2NhbmNlbC1keW5hbWljLWxhYmVsLXNpemUnKTsgLy8gVE9ETyB0aGluayBvZiBhIGJldHRlciB3YXlcbiAgXG4gIHVwYXRlU3R5bGVTaGVldCgpO1xuICBiaW5kQ3lFdmVudHMoKTtcbn07IiwiLy8gRXh0ZW5kcyBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXNcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSBsaWJzLnNiZ252aXouZWxlbWVudFV0aWxpdGllcztcblxuZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0U2l6ZXMgPSB7XG4gIFwicHJvY2Vzc1wiOiB7XG4gICAgd2lkdGg6IDMwLFxuICAgIGhlaWdodDogMzBcbiAgfSxcbiAgXCJvbWl0dGVkIHByb2Nlc3NcIjoge1xuICAgIHdpZHRoOiAzMCxcbiAgICBoZWlnaHQ6IDMwXG4gIH0sXG4gIFwidW5jZXJ0YWluIHByb2Nlc3NcIjoge1xuICAgIHdpZHRoOiAzMCxcbiAgICBoZWlnaHQ6IDMwXG4gIH0sXG4gIFwiYXNzb2NpYXRpb25wcm9jZXNzXCI6IHtcbiAgICB3aWR0aDogMzAsXG4gICAgaGVpZ2h0OiAzMFxuICB9LFxuICBcImFzc29jaWF0aW9uXCI6IHtcbiAgICB3aWR0aDogMzAsXG4gICAgaGVpZ2h0OiAzMFxuICB9LFxuICBcImRpc3NvY2lhdGlvblwiOiB7XG4gICAgd2lkdGg6IDMwLFxuICAgIGhlaWdodDogMzBcbiAgfSxcbiAgXCJtYWNyb21vbGVjdWxlXCI6IHtcbiAgICB3aWR0aDogMTAwLFxuICAgIGhlaWdodDogNTBcbiAgfSxcbiAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7XG4gICAgd2lkdGg6IDEwMCxcbiAgICBoZWlnaHQ6IDUwXG4gIH0sXG4gIFwicGhlbm90eXBlXCI6IHtcbiAgICB3aWR0aDogMTAwLFxuICAgIGhlaWdodDogNTBcbiAgfSxcbiAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjoge1xuICAgIHdpZHRoOiAxMDAsXG4gICAgaGVpZ2h0OiA1MFxuICB9LFxuICBcInBlcnR1cmJpbmcgYWdlbnRcIjoge1xuICAgIHdpZHRoOiAxMDAsXG4gICAgaGVpZ2h0OiA1MFxuICB9LFxuICBcImNvbXBsZXhcIjoge1xuICAgIHdpZHRoOiAxMDAsXG4gICAgaGVpZ2h0OiAxMDBcbiAgfSxcbiAgXCJjb21wYXJ0bWVudFwiOiB7XG4gICAgd2lkdGg6IDEwMCxcbiAgICBoZWlnaHQ6IDEwMFxuICB9XG59O1xuXG5lbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRGb250UHJvcGVydGllcyA9IHtcbiAgZm9udGZhbWlseTogJ0hlbHZldGljYScsXG4gIGZvbnR3ZWlnaHQ6ICdub3JtYWwnLFxuICBmb250c3R5bGU6ICdub3JtYWwnXG59O1xuXG5lbGVtZXRVdGlsaXRpZXMuZ2V0RGVmYXVsdExhYmVsU2l6ZSA9IGZ1bmN0aW9uIChzYmduY2xhc3MpIHtcbiAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOTGFiZWwoc2JnbmNsYXNzKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgZWxzZSBpZiAoc2JnbmNsYXNzID09PSAnY29tcGxleCcgfHwgc2JnbmNsYXNzID09PSAnY29tcGFydG1lbnQnKSB7XG4gICAgcmV0dXJuIDE2O1xuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybiAyMDtcbiAgfVxufTtcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcblxuZWxlbWV0VXRpbGl0aWVzLmFkZE5vZGUgPSBmdW5jdGlvbiAoeCwgeSwgc2JnbmNsYXNzLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcbiAgdmFyIGRlZmF1bHRTaXplcyA9IHRoaXMuZGVmYXVsdFNpemVzO1xuICB2YXIgZGVmYXVsdHMgPSBkZWZhdWx0U2l6ZXNbc2JnbmNsYXNzXTtcblxuICB2YXIgd2lkdGggPSBkZWZhdWx0cyA/IGRlZmF1bHRzLndpZHRoIDogNTA7XG4gIHZhciBoZWlnaHQgPSBkZWZhdWx0cyA/IGRlZmF1bHRzLmhlaWdodCA6IDUwO1xuXG5cblxuICB2YXIgY3NzID0gZGVmYXVsdHMgPyB7XG4gICAgJ2JvcmRlci13aWR0aCc6IGRlZmF1bHRzWydib3JkZXItd2lkdGgnXSxcbi8vICAgICAgJ2JvcmRlci1jb2xvcic6IGRlZmF1bHRzWydib3JkZXItY29sb3InXSxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6IGRlZmF1bHRzWydiYWNrZ3JvdW5kLWNvbG9yJ10sXG4vLyAgICAgICdmb250LXNpemUnOiBkZWZhdWx0c1snZm9udC1zaXplJ10sXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IGRlZmF1bHRzWydiYWNrZ3JvdW5kLW9wYWNpdHknXVxuICB9IDoge307XG5cbiAgaWYgKHZpc2liaWxpdHkpIHtcbiAgICBjc3MudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XG4gIH1cblxuICBpZiAoZGVmYXVsdHMgJiYgZGVmYXVsdHMubXVsdGltZXIpIHtcbiAgICBzYmduY2xhc3MgKz0gXCIgbXVsdGltZXJcIjtcbiAgfVxuICB2YXIgZGF0YSA9IHtcbiAgICBzYmduY2xhc3M6IHNiZ25jbGFzcyxcbiAgICBzYmduYmJveDoge1xuICAgICAgaDogaGVpZ2h0LFxuICAgICAgdzogd2lkdGgsXG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH0sXG4gICAgc2JnbnN0YXRlc2FuZGluZm9zOiBbXSxcbiAgICBwb3J0czogW10sXG4gICAgbGFiZWxzaXplOiBlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOTGFiZWwoc2JnbmNsYXNzKSA/IChkZWZhdWx0cyAmJiBkZWZhdWx0cy5sYWJlbHNpemUpIHx8IHRoaXMuZ2V0RGVmYXVsdExhYmVsU2l6ZShzYmduY2xhc3MpIDogdW5kZWZpbmVkLFxuICAgIGZvbnRmYW1pbHk6IGVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbChzYmduY2xhc3MpID8gKGRlZmF1bHRzICYmIGRlZmF1bHRzLmZvbnRmYW1pbHkpIHx8IHRoaXMuZGVmYXVsdEZvbnRQcm9wZXJ0aWVzLmZvbnRmYW1pbHkgOiB1bmRlZmluZWQsXG4gICAgZm9udHdlaWdodDogZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkxhYmVsKHNiZ25jbGFzcykgPyAoZGVmYXVsdHMgJiYgZGVmYXVsdHMuZm9udHdlaWdodCkgfHwgdGhpcy5kZWZhdWx0Rm9udFByb3BlcnRpZXMuZm9udHdlaWdodCA6IHVuZGVmaW5lZCxcbiAgICBmb250c3R5bGU6IGVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbChzYmduY2xhc3MpID8gKGRlZmF1bHRzICYmIGRlZmF1bHRzLmZvbnRzdHlsZSkgfHwgdGhpcy5kZWZhdWx0Rm9udFByb3BlcnRpZXMuZm9udHN0eWxlIDogdW5kZWZpbmVkXG4gIH07XG5cbiAgaWYgKHBhcmVudCkge1xuICAgIGRhdGEucGFyZW50ID0gcGFyZW50O1xuICB9XG5cbiAgdmFyIGVsZXMgPSBjeS5hZGQoe1xuICAgIGdyb3VwOiBcIm5vZGVzXCIsXG4gICAgZGF0YTogZGF0YSxcbiAgICBjc3M6IGNzcyxcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBuZXdOb2RlID0gZWxlc1tlbGVzLmxlbmd0aCAtIDFdO1xuICBpZiAoZGVmYXVsdHMgJiYgZGVmYXVsdHNbJ2JvcmRlci1jb2xvciddKSB7XG4gICAgbmV3Tm9kZS5kYXRhKCdib3JkZXJDb2xvcicsIGRlZmF1bHRzWydib3JkZXItY29sb3InXSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgbmV3Tm9kZS5kYXRhKCdib3JkZXJDb2xvcicsIG5ld05vZGUuY3NzKCdib3JkZXItY29sb3InKSk7XG4gIH1cbiAgaWYgKGRlZmF1bHRzICYmIGRlZmF1bHRzWydjbG9uZW1hcmtlciddKSB7XG4gICAgbmV3Tm9kZS5fcHJpdmF0ZS5kYXRhLmNsb25lbWFya2VyID0gZGVmYXVsdHMuY2xvbmVtYXJrZXI7XG4gIH1cblxuICBuZXdOb2RlLmFkZENsYXNzKCdjaGFuZ2VCb3JkZXJDb2xvcicpO1xuICBuZXdOb2RlLmFkZENsYXNzKCdjaGFuZ2VCYWNrZ3JvdW5kT3BhY2l0eScpO1xuXG4gIHJlZnJlc2hQYWRkaW5ncygpO1xuICByZXR1cm4gbmV3Tm9kZTtcbn07XG5cbmVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHRhcmdldCwgc2JnbmNsYXNzLCB2aXNpYmlsaXR5KSB7XG4gIHZhciBkZWZhdWx0U2l6ZXMgPSB0aGlzLmRlZmF1bHRTaXplcztcbiAgdmFyIGRlZmF1bHRzID0gZGVmYXVsdFNpemVzW3NiZ25jbGFzc107XG4gIHZhciBjc3MgPSBkZWZhdWx0cyA/IHtcbiAgICAnd2lkdGgnOiBkZWZhdWx0c1snd2lkdGgnXVxuICB9IDoge307XG5cbiAgaWYgKHZpc2liaWxpdHkpIHtcbiAgICBjc3MudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XG4gIH1cblxuICB2YXIgZWxlcyA9IGN5LmFkZCh7XG4gICAgZ3JvdXA6IFwiZWRnZXNcIixcbiAgICBkYXRhOiB7XG4gICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgc2JnbmNsYXNzOiBzYmduY2xhc3NcbiAgICB9LFxuICAgIGNzczogY3NzXG4gIH0pO1xuXG4gIHZhciBuZXdFZGdlID0gZWxlc1tlbGVzLmxlbmd0aCAtIDFdO1xuICBpZiAoZGVmYXVsdHMgJiYgZGVmYXVsdHNbJ2xpbmUtY29sb3InXSkge1xuICAgIG5ld0VkZ2UuZGF0YSgnbGluZUNvbG9yJywgZGVmYXVsdHNbJ2xpbmUtY29sb3InXSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgbmV3RWRnZS5kYXRhKCdsaW5lQ29sb3InLCBuZXdFZGdlLmNzcygnbGluZS1jb2xvcicpKTtcbiAgfVxuICBuZXdFZGdlLmFkZENsYXNzKCdjaGFuZ2VMaW5lQ29sb3InKTtcbiAgcmV0dXJuIG5ld0VkZ2U7XG59O1xuXG4vKlxuICogVGhpcyBtZXRob2QgYXNzdW1lcyB0aGF0IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQgY29udGFpbnMgYXQgbGVhc3Qgb25lIG5vZGVcbiAqIGFuZCBhbGwgb2YgdGhlIG5vZGVzIGluY2x1ZGluZyBpbiBpdCBoYXZlIHRoZSBzYW1lIHBhcmVudC4gSXQgY3JlYXRlcyBhIGNvbXBvdW5kIGZvdCB0aGUgZ2l2ZW4gbm9kZXMgYW4gaGF2aW5nIHRoZSBnaXZlbiB0eXBlLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChub2Rlc1RvTWFrZUNvbXBvdW5kLCBjb21wdW5kVHlwZSkge1xuICB2YXIgb2xkUGFyZW50SWQgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJwYXJlbnRcIik7XG4gIC8vIFRoZSBwYXJlbnQgb2YgbmV3IGNvbXBvdW5kIHdpbGwgYmUgdGhlIG9sZCBwYXJlbnQgb2YgdGhlIG5vZGVzIHRvIG1ha2UgY29tcG91bmRcbiAgdmFyIG5ld0NvbXBvdW5kID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjb21wdW5kVHlwZSwgb2xkUGFyZW50SWQsIHRydWUpO1xuICB2YXIgbmV3Q29tcG91bmRJZCA9IG5ld0NvbXBvdW5kLmlkKCk7XG4gIG5vZGVzVG9NYWtlQ29tcG91bmQubW92ZSh7cGFyZW50OiBuZXdDb21wb3VuZElkfSk7XG4gIHJlZnJlc2hQYWRkaW5ncygpO1xuICByZXR1cm4gbmV3Q29tcG91bmQ7XG59O1xuXG4vKlxuICogUmVtb3ZlcyBhIGNvbXBvdW5kLiBCZWZvcmUgdGhlIHJlbW92YWwgb3BlcmF0aW9uIG1vdmVzIHRoZSBjaGlsZHJlbiBvZiB0aGF0IGNvbXBvdW5kIHRvIHRoZSBwYXJlbnQgb2YgdGhlIGNvbXBvdW5kLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLnJlbW92ZUNvbXBvdW5kID0gZnVuY3Rpb24gKGNvbXBvdW5kVG9SZW1vdmUpIHtcbiAgdmFyIGNvbXBvdW5kSWQgPSBjb21wb3VuZFRvUmVtb3ZlLmlkKCk7XG4gIHZhciBuZXdQYXJlbnRJZCA9IGNvbXBvdW5kVG9SZW1vdmUuZGF0YShcInBhcmVudFwiKTtcbiAgbmV3UGFyZW50SWQgPSBuZXdQYXJlbnRJZCA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IG5ld1BhcmVudElkO1xuICB2YXIgY2hpbGRyZW5PZkNvbXBvdW5kID0gY29tcG91bmRUb1JlbW92ZS5jaGlsZHJlbigpO1xuXG4gIGNoaWxkcmVuT2ZDb21wb3VuZC5tb3ZlKHtwYXJlbnQ6IG5ld1BhcmVudElkfSk7XG4gIHZhciByZW1vdmVkQ29tcHVuZCA9IGNvbXBvdW5kVG9SZW1vdmUucmVtb3ZlKCk7XG59O1xuXG4vKlxuICogQ3JlYXRlcyBhIHRlbXBsYXRlIHJlYWN0aW9uIHdpdGggZ2l2ZW4gcGFyYW1ldGVycy4gUmVxdWlyZXMgY29zZS1iaWxrZW50IGxheW91dCB0byB0aWxlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzIGluY2x1ZGVkXG4gKiBpbiB0aGUgY29tcGxleC4gUGFyYW1ldGVycyBhcmUgZXhwbGFpbmVkIGJlbG93LlxuICogdGVtcGxhdGVUeXBlOiBUaGUgdHlwZSBvZiB0aGUgdGVtcGxhdGUgcmVhY3Rpb24uIEl0IG1heSBiZSAnYXNzb2NpYXRpb24nIG9yICdkaXNzb2NpYXRpb24nIGZvciBub3cuXG4gKiBtYWNyb21vbGVjdWxlTGlzdDogVGhlIGxpc3Qgb2YgdGhlIG5hbWVzIG9mIG1hY3JvbW9sZWN1bGVzIHdoaWNoIHdpbGwgaW52b2x2ZSBpbiB0aGUgcmVhY3Rpb24uXG4gKiBjb21wbGV4TmFtZTogVGhlIG5hbWUgb2YgdGhlIGNvbXBsZXggaW4gdGhlIHJlYWN0aW9uLlxuICogcHJvY2Vzc1Bvc2l0aW9uOiBUaGUgbW9kYWwgcG9zaXRpb24gb2YgdGhlIHByb2Nlc3MgaW4gdGhlIHJlYWN0aW9uLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyB0aGUgY2VudGVyIG9mIHRoZSBjYW52YXMuXG4gKiB0aWxpbmdQYWRkaW5nVmVydGljYWw6IFRoaXMgb3B0aW9uIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBjb3NlLWJpbGtlbnQgbGF5b3V0IHdpdGggdGhlIHNhbWUgbmFtZS4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgMTUuXG4gKiB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cbiAqIGVkZ2VMZW5ndGg6IFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBwcm9jZXNzIGFuZCB0aGUgbWFjcm9tb2xlY3VsZXMgYXQgdGhlIGJvdGggc2lkZXMuXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKSB7XG4gIHZhciBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFNpemVzW1wibWFjcm9tb2xlY3VsZVwiXTtcbiAgdmFyIHRlbXBsYXRlVHlwZSA9IHRlbXBsYXRlVHlwZTtcbiAgdmFyIHByb2Nlc3NXaWR0aCA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFNpemVzW3RlbXBsYXRlVHlwZV0gPyBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRTaXplc1t0ZW1wbGF0ZVR5cGVdLndpZHRoIDogNTA7XG4gIHZhciBtYWNyb21vbGVjdWxlV2lkdGggPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA/IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLndpZHRoIDogNTA7XG4gIHZhciBtYWNyb21vbGVjdWxlSGVpZ2h0ID0gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMgPyBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcy5oZWlnaHQgOiA1MDtcbiAgdmFyIHByb2Nlc3NQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbiA/IHByb2Nlc3NQb3NpdGlvbiA6IGVsZW1lbnRVdGlsaXRpZXMuY29udmVydFRvTW9kZWxQb3NpdGlvbih7eDogY3kud2lkdGgoKSAvIDIsIHk6IGN5LmhlaWdodCgpIC8gMn0pO1xuICB2YXIgbWFjcm9tb2xlY3VsZUxpc3QgPSBtYWNyb21vbGVjdWxlTGlzdDtcbiAgdmFyIGNvbXBsZXhOYW1lID0gY29tcGxleE5hbWU7XG4gIHZhciBudW1PZk1hY3JvbW9sZWN1bGVzID0gbWFjcm9tb2xlY3VsZUxpc3QubGVuZ3RoO1xuICB2YXIgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsID0gdGlsaW5nUGFkZGluZ1ZlcnRpY2FsID8gdGlsaW5nUGFkZGluZ1ZlcnRpY2FsIDogMTU7XG4gIHZhciB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA9IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID8gdGlsaW5nUGFkZGluZ0hvcml6b250YWwgOiAxNTtcbiAgdmFyIGVkZ2VMZW5ndGggPSBlZGdlTGVuZ3RoID8gZWRnZUxlbmd0aCA6IDYwO1xuXG4gIHZhciB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcztcbiAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgIHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG4gIH1cbiAgZWxzZSB7XG4gICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgfVxuXG4gIC8vQ3JlYXRlIHRoZSBwcm9jZXNzIGluIHRlbXBsYXRlIHR5cGVcbiAgdmFyIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCB0ZW1wbGF0ZVR5cGUpO1xuICBwcm9jZXNzLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gIC8vRGVmaW5lIHRoZSBzdGFydGluZyB5IHBvc2l0aW9uXG4gIHZhciB5UG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZNYWNyb21vbGVjdWxlcyAtIDEpIC8gMikgKiAobWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XG5cbiAgLy9DcmVhdGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXNcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1PZk1hY3JvbW9sZWN1bGVzOyBpKyspIHtcbiAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcywgeVBvc2l0aW9uLCBcIm1hY3JvbW9sZWN1bGVcIik7XG4gICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICBuZXdOb2RlLmRhdGEoJ3NiZ25sYWJlbCcsIG1hY3JvbW9sZWN1bGVMaXN0W2ldKTtcblxuICAgIC8vY3JlYXRlIHRoZSBlZGdlIGNvbm5lY3RlZCB0byB0aGUgbmV3IG1hY3JvbW9sZWN1bGVcbiAgICB2YXIgbmV3RWRnZTtcbiAgICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XG4gICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKG5ld05vZGUuaWQoKSwgcHJvY2Vzcy5pZCgpLCAnY29uc3VtcHRpb24nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgbmV3Tm9kZS5pZCgpLCAncHJvZHVjdGlvbicpO1xuICAgIH1cblxuICAgIG5ld0VkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAvL3VwZGF0ZSB0aGUgeSBwb3NpdGlvblxuICAgIHlQb3NpdGlvbiArPSBtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xuICB9XG5cbiAgLy9DcmVhdGUgdGhlIGNvbXBsZXggaW5jbHVkaW5nIG1hY3JvbW9sZWN1bGVzIGluc2lkZSBvZiBpdFxuICAvL1RlbXByb3JhcmlseSBhZGQgaXQgdG8gdGhlIHByb2Nlc3MgcG9zaXRpb24gd2Ugd2lsbCBtb3ZlIGl0IGFjY29yZGluZyB0byB0aGUgbGFzdCBzaXplIG9mIGl0XG4gIHZhciBjb21wbGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwgJ2NvbXBsZXgnKTtcbiAgY29tcGxleC5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgY29tcGxleC5kYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJywgdHJ1ZSk7XG5cbiAgLy9JZiBhIG5hbWUgaXMgc3BlY2lmaWVkIGZvciB0aGUgY29tcGxleCBzZXQgaXRzIGxhYmVsIGFjY29yZGluZ2x5XG4gIGlmIChjb21wbGV4TmFtZSkge1xuICAgIGNvbXBsZXguZGF0YSgnc2JnbmxhYmVsJywgY29tcGxleE5hbWUpO1xuICB9XG5cbiAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubm5lY3RlZCB0byB0aGUgY29tcGxleFxuICB2YXIgZWRnZU9mQ29tcGxleDtcbiAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgIGVkZ2VPZkNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBjb21wbGV4LmlkKCksICdwcm9kdWN0aW9uJyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWRnZU9mQ29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShjb21wbGV4LmlkKCksIHByb2Nlc3MuaWQoKSwgJ2NvbnN1bXB0aW9uJyk7XG4gIH1cbiAgZWRnZU9mQ29tcGxleC5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAvL0NyZWF0ZSB0aGUgbWFjcm9tb2xlY3VsZXMgaW5zaWRlIHRoZSBjb21wbGV4XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtT2ZNYWNyb21vbGVjdWxlczsgaSsrKSB7XG4gICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoY29tcGxleC5wb3NpdGlvbigneCcpLCBjb21wbGV4LnBvc2l0aW9uKCd5JyksIFwibWFjcm9tb2xlY3VsZVwiLCBjb21wbGV4LmlkKCkpO1xuICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgbmV3Tm9kZS5kYXRhKCdzYmdubGFiZWwnLCBtYWNyb21vbGVjdWxlTGlzdFtpXSk7XG4gICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJywgdHJ1ZSk7XG4gIH1cblxuICB2YXIgbGF5b3V0Tm9kZXMgPSBjeS5ub2RlcygnW2p1c3RBZGRlZExheW91dE5vZGVdJyk7XG4gIGxheW91dE5vZGVzLnJlbW92ZURhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnKTtcbiAgbGF5b3V0Tm9kZXMubGF5b3V0KHtcbiAgICBuYW1lOiAnY29zZS1iaWxrZW50JyxcbiAgICByYW5kb21pemU6IGZhbHNlLFxuICAgIGZpdDogZmFsc2UsXG4gICAgYW5pbWF0ZTogZmFsc2UsXG4gICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXG4gICAgdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLFxuICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vcmUtcG9zaXRpb24gdGhlIG5vZGVzIGluc2lkZSB0aGUgY29tcGxleFxuICAgICAgdmFyIHN1cHBvc2VkWFBvc2l0aW9uO1xuICAgICAgdmFyIHN1cHBvc2VkWVBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnk7XG5cbiAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICAgICAgc3VwcG9zZWRYUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgY29tcGxleC5vdXRlcldpZHRoKCkgLyAyO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHN1cHBvc2VkWFBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIGNvbXBsZXgub3V0ZXJXaWR0aCgpIC8gMjtcbiAgICAgIH1cblxuICAgICAgdmFyIHBvc2l0aW9uRGlmZlggPSBzdXBwb3NlZFhQb3NpdGlvbiAtIGNvbXBsZXgucG9zaXRpb24oJ3gnKTtcbiAgICAgIHZhciBwb3NpdGlvbkRpZmZZID0gc3VwcG9zZWRZUG9zaXRpb24gLSBjb21wbGV4LnBvc2l0aW9uKCd5Jyk7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyh7eDogcG9zaXRpb25EaWZmWCwgeTogcG9zaXRpb25EaWZmWX0sIGNvbXBsZXgpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy9maWx0ZXIgdGhlIGp1c3QgYWRkZWQgZWxlbWVtdHMgdG8gcmV0dXJuIHRoZW0gYW5kIHJlbW92ZSBqdXN0IGFkZGVkIG1hcmtcbiAgdmFyIGVsZXMgPSBjeS5lbGVtZW50cygnW2p1c3RBZGRlZF0nKTtcbiAgZWxlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWQnKTtcbiAgXG4gIHJlZnJlc2hQYWRkaW5ncygpO1xuICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gIGVsZXMuc2VsZWN0KCk7XG4gIFxuICByZXR1cm4gZWxlczsgLy8gUmV0dXJuIHRoZSBqdXN0IGFkZGVkIGVsZW1lbnRzXG59O1xuXG4vLyBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuXG5lbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgcmF0aW8gPSB1bmRlZmluZWQ7XG4gICAgdmFyIGVsZU11c3RCZVNxdWFyZSA9IGVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlKG5vZGUuZGF0YSgnc2JnbmNsYXNzJykpO1xuXG4gICAgLy8gTm90ZSB0aGF0IGJvdGggd2lkdGggYW5kIGhlaWdodCBzaG91bGQgbm90IGJlIHNldCBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHlcbiAgICBpZiAod2lkdGgpIHtcbiAgICAgIGlmICh1c2VBc3BlY3RSYXRpbyB8fCBlbGVNdXN0QmVTcXVhcmUpIHtcbiAgICAgICAgcmF0aW8gPSB3aWR0aCAvIG5vZGUud2lkdGgoKTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gd2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKGhlaWdodCkge1xuICAgICAgaWYgKHVzZUFzcGVjdFJhdGlvIHx8IGVsZU11c3RCZVNxdWFyZSkge1xuICAgICAgICByYXRpbyA9IGhlaWdodCAvIG5vZGUuaGVpZ2h0KCk7XG4gICAgICB9XG5cbiAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IGhlaWdodDtcbiAgICB9XG5cbiAgICBpZiAocmF0aW8gJiYgIWhlaWdodCkge1xuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gbm9kZS5oZWlnaHQoKSAqIHJhdGlvO1xuICAgIH1cbiAgICBlbHNlIGlmIChyYXRpbyAmJiAhd2lkdGgpIHtcbiAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IG5vZGUud2lkdGgoKSAqIHJhdGlvO1xuICAgIH1cblxuICAgIG5vZGUucmVtb3ZlQ2xhc3MoJ25vZGVyZXNpemVkJyk7XG4gICAgbm9kZS5hZGRDbGFzcygnbm9kZXJlc2l6ZWQnKTtcbiAgfVxufTtcblxuLy8gU2VjdGlvbiBFbmRcbi8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXG5cbi8vIFNlY3Rpb24gU3RhcnRcbi8vIENvbW1vbiBlbGVtZW50IHByb3BlcnRpZXNcblxuLy8gR2V0IGNvbW1vbiBwcm9wZXJ0aWVzIG9mIGdpdmVuIGVsZW1lbnRzLiBSZXR1cm5zIG51bGwgaWYgdGhlIGdpdmVuIGVsZW1lbnQgbGlzdCBpcyBlbXB0eSBvciB0aGVcbi8vIHByb3BlcnR5IGlzIG5vdCBjb21tb24gZm9yIGFsbCBlbGVtZW50cy4gZGF0YU9yQ3NzIHBhcmFtZXRlciBzcGVjaWZ5IHdoZXRoZXIgdG8gY2hlY2sgdGhlIHByb3BlcnR5IG9uIGRhdGEgb3IgY3NzLlxuLy8gVGhlIGRlZmF1bHQgdmFsdWUgZm9yIGl0IGlzIGRhdGEuIElmIHByb3BlcnR5TmFtZSBwYXJhbWV0ZXIgaXMgZ2l2ZW4gYXMgYSBmdW5jdGlvbiBpbnN0ZWFkIG9mIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgXG4vLyBwcm9wZXJ0eSBuYW1lIHRoZW4gdXNlIHdoYXQgdGhhdCBmdW5jdGlvbiByZXR1cm5zLlxuZWxlbWVudFV0aWxpdGllcy5nZXRDb21tb25Qcm9wZXJ0eSA9IGZ1bmN0aW9uIChlbGVtZW50cywgcHJvcGVydHlOYW1lLCBkYXRhT3JDc3MpIHtcbiAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgaXNGdW5jdGlvbjtcbiAgLy8gSWYgd2UgYXJlIG5vdCBjb21wYXJpbmcgdGhlIHByb3BlcnRpZXMgZGlyZWN0bHkgdXNlcnMgY2FuIHNwZWNpZnkgYSBmdW5jdGlvbiBhcyB3ZWxsXG4gIGlmICh0eXBlb2YgcHJvcGVydHlOYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaXNGdW5jdGlvbiA9IHRydWU7XG4gIH1cblxuICAvLyBVc2UgZGF0YSBhcyBkZWZhdWx0XG4gIGlmICghaXNGdW5jdGlvbiAmJiAhZGF0YU9yQ3NzKSB7XG4gICAgZGF0YU9yQ3NzID0gJ2RhdGEnO1xuICB9XG5cbiAgdmFyIHZhbHVlID0gaXNGdW5jdGlvbiA/IHByb3BlcnR5TmFtZShlbGVtZW50c1swXSkgOiBlbGVtZW50c1swXVtkYXRhT3JDc3NdKHByb3BlcnR5TmFtZSk7XG5cbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpc0Z1bmN0aW9uID8gcHJvcGVydHlOYW1lKGVsZW1lbnRzW2ldKSA6IGVsZW1lbnRzW2ldW2RhdGFPckNzc10ocHJvcGVydHlOYW1lKSAhPSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuLy8gUmV0dXJucyBpZiB0aGUgZnVuY3Rpb24gcmV0dXJucyBhIHRydXRoeSB2YWx1ZSBmb3IgYWxsIG9mIHRoZSBnaXZlbiBlbGVtZW50cy5cbmVsZW1lbnRVdGlsaXRpZXMudHJ1ZUZvckFsbEVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZW1lbnRzLCBmY24pIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGlmICghZmNuKGVsZW1lbnRzW2ldKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgY2FuIGhhdmUgc2JnbmNhcmRpbmFsaXR5XG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOQ2FyZGluYWxpdHkgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuXG4gIHJldHVybiBlbGUuZGF0YSgnY2xhc3MnKSA9PSAnY29uc3VtcHRpb24nIHx8IGVsZS5kYXRhKCdjbGFzcycpID09ICdwcm9kdWN0aW9uJztcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZSBlbGVtZW50IGNhbiBoYXZlIHNiZ25sYWJlbFxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkxhYmVsID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICByZXR1cm4gc2JnbmNsYXNzICE9ICdhbmQnICYmIHNiZ25jbGFzcyAhPSAnb3InICYmIHNiZ25jbGFzcyAhPSAnbm90J1xuICAgICAgICAgICYmIHNiZ25jbGFzcyAhPSAnYXNzb2NpYXRpb24nICYmIHNiZ25jbGFzcyAhPSAnZGlzc29jaWF0aW9uJyAmJiAhc2JnbmNsYXNzLmVuZHNXaXRoKCdwcm9jZXNzJyk7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBoYXZlIHVuaXQgb2YgaW5mb3JtYXRpb25cbmVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVVuaXRPZkluZm9ybWF0aW9uID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICBpZiAoc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCcgfHwgc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwgbXVsdGltZXInXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlIG11bHRpbWVyJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCBtdWx0aW1lcicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBoYXZlIHN0YXRlIHZhcmlhYmxlXG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTdGF0ZVZhcmlhYmxlID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICBpZiAoc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUgbXVsdGltZXInIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUgbXVsdGltZXInXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4IG11bHRpbWVyJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlIHNob3VsZCBiZSBzcXVhcmUgaW4gc2hhcGVcbmVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICByZXR1cm4gKHNiZ25jbGFzcy5pbmRleE9mKCdwcm9jZXNzJykgIT0gLTEgfHwgc2JnbmNsYXNzID09ICdzb3VyY2UgYW5kIHNpbmsnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdhbmQnIHx8IHNiZ25jbGFzcyA9PSAnb3InIHx8IHNiZ25jbGFzcyA9PSAnbm90J1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYXNzb2NpYXRpb24nIHx8IHNiZ25jbGFzcyA9PSAnZGlzc29jaWF0aW9uJyk7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgYW55IG9mIHRoZSBnaXZlbiBub2RlcyBtdXN0IG5vdCBiZSBpbiBzcXVhcmUgc2hhcGVcbmVsZW1lbnRVdGlsaXRpZXMuc29tZU11c3ROb3RCZVNxdWFyZSA9IGZ1bmN0aW9uIChub2Rlcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlKG5vZGUuZGF0YSgnY2xhc3MnKSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZXMgZWxlbWVudCBjYW4gYmUgY2xvbmVkXG5lbGVtZW50VXRpbGl0aWVzLmNhbkJlQ2xvbmVkID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XG5cbiAgdmFyIGxpc3QgPSB7XG4gICAgJ3Vuc3BlY2lmaWVkIGVudGl0eSc6IHRydWUsXG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxuICAgICdjb21wbGV4JzogdHJ1ZSxcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxuICAgICdwZXJ0dXJiaW5nIGFnZW50JzogdHJ1ZVxuICB9O1xuXG4gIHJldHVybiBsaXN0W3NiZ25jbGFzc10gPyB0cnVlIDogZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVzIGVsZW1lbnQgY2FuIGJlIGNsb25lZFxuZWxlbWVudFV0aWxpdGllcy5jYW5CZU11bHRpbWVyID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XG5cbiAgdmFyIGxpc3QgPSB7XG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxuICAgICdjb21wbGV4JzogdHJ1ZSxcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlXG4gIH07XG5cbiAgcmV0dXJuIGxpc3Rbc2JnbmNsYXNzXSA/IHRydWUgOiBmYWxzZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhbiBFUE5cbmVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuXG4gIHJldHVybiAoc2JnbmNsYXNzID09ICd1bnNwZWNpZmllZCBlbnRpdHknXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4Jyk7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgaXMgYSBQTlxuZWxlbWVudFV0aWxpdGllcy5pc1BOQ2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcblxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAncHJvY2VzcydcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcydcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ3VuY2VydGFpbiBwcm9jZXNzJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYXNzb2NpYXRpb24nXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdkaXNzb2NpYXRpb24nXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdwaGVub3R5cGUnKTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhIGxvZ2ljYWwgb3BlcmF0b3JcbmVsZW1lbnRVdGlsaXRpZXMuaXNMb2dpY2FsT3BlcmF0b3IgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAnYW5kJyB8fCBzYmduY2xhc3MgPT0gJ29yJyB8fCBzYmduY2xhc3MgPT0gJ25vdCcpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBjbGFzcyBvZiBnaXZlbiBlbGVtZW50IGlzIGEgZXF1aXZhbGFuY2UgY2xhc3NcbmVsZW1lbnRVdGlsaXRpZXMuY29udmVuaWVudFRvRXF1aXZhbGVuY2UgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAndGFnJyB8fCBzYmduY2xhc3MgPT0gJ3Rlcm1pbmFsJyk7XG59O1xuXG4vLyBSZWxvY2F0ZXMgc3RhdGUgYW5kIGluZm8gYm94ZXMuIFRoaXMgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gYmUgY2FsbGVkIGFmdGVyIGFkZC9yZW1vdmUgc3RhdGUgYW5kIGluZm8gYm94ZXNcbmVsZW1lbnRVdGlsaXRpZXMucmVsb2NhdGVTdGF0ZUFuZEluZm9zID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc3RhdGVBbmRJbmZvcyA9IChlbGUuaXNOb2RlICYmIGVsZS5pc05vZGUoKSkgPyBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKSA6IGVsZTtcbiAgdmFyIGxlbmd0aCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoO1xuICBpZiAobGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxzZSBpZiAobGVuZ3RoID09IDEpIHtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XG4gIH1cbiAgZWxzZSBpZiAobGVuZ3RoID09IDIpIHtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XG5cbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDA7XG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSA1MDtcbiAgfVxuICBlbHNlIGlmIChsZW5ndGggPT0gMykge1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAyNTtcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IC01MDtcblxuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gMDtcbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xuICB9XG4gIGVsc2Uge1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAyNTtcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IC01MDtcblxuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gLTI1O1xuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC55ID0gNTA7XG5cbiAgICBzdGF0ZUFuZEluZm9zWzNdLmJib3gueCA9IDI1O1xuICAgIHN0YXRlQW5kSW5mb3NbM10uYmJveC55ID0gNTA7XG4gIH1cbn07XG5cbi8vIENoYW5nZSBzdGF0ZSB2YWx1ZSBvciB1bml0IG9mIGluZm9ybWF0aW9uIGJveCBvZiBnaXZlbiBub2RlcyB3aXRoIGdpdmVuIGluZGV4LlxuLy8gVHlwZSBwYXJhbWV0ZXIgaW5kaWNhdGVzIHdoZXRoZXIgdG8gY2hhbmdlIHZhbHVlIG9yIHZhcmlhYmxlLCBpdCBpcyB2YWxpZCBpZiB0aGUgYm94IGF0IHRoZSBnaXZlbiBpbmRleCBpcyBhIHN0YXRlIHZhcmlhYmxlLlxuLy8gVmFsdWUgcGFyYW1ldGVyIGlzIHRoZSBuZXcgdmFsdWUgdG8gc2V0LlxuLy8gVGhpcyBtZXRob2QgdGhlIG9sZCB2YWx1ZSBvZiB0aGUgY2hhbmdlZCBkYXRhIChXZSBhc3N1bWUgdGhhdCB0aGUgb2xkIHZhbHVlIG9mIHRoZSBjaGFuZ2VkIGRhdGEgd2FzIHRoZSBzYW1lIGZvciBhbGwgbm9kZXMpLlxuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XG4gIHZhciByZXN1bHQ7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZWFuZGluZm9zJyk7XG4gICAgdmFyIGJveCA9IHN0YXRlQW5kSW5mb3NbaV07XG5cbiAgICBpZiAoYm94LmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikge1xuICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgcmVzdWx0ID0gYm94LnN0YXRlW3R5cGVdO1xuICAgICAgfVxuXG4gICAgICBib3guc3RhdGVbdHlwZV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdCA9IGJveC5sYWJlbC50ZXh0O1xuICAgICAgfVxuXG4gICAgICBib3gubGFiZWwudGV4dCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXG4vLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxuLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGp1c3QgYWRkZWQgYm94LlxuZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2Rlcywgb2JqKSB7XG4gIHZhciBpbmRleDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlYW5kaW5mb3MnKTtcbiAgICBzdGF0ZUFuZEluZm9zLnB1c2gob2JqKTtcbiAgICBpbmRleCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoIC0gMTtcbiAgICB0aGlzLnJlbG9jYXRlU3RhdGVBbmRJbmZvcyhzdGF0ZUFuZEluZm9zKTsgLy8gUmVsb2NhdGUgc3RhdGUgYW5kIGluZm9zXG4gIH1cblxuICByZXR1cm4gaW5kZXg7XG59O1xuXG4vLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxuLy8gUmV0dXJucyB0aGUgcmVtb3ZlZCBib3guXG5lbGVtZW50VXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBpbmRleCkge1xuICB2YXIgb2JqO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVhbmRpbmZvcycpO1xuICAgIGlmICghb2JqKSB7XG4gICAgICBvYmogPSBzdGF0ZUFuZEluZm9zW2luZGV4XTtcbiAgICB9XG4gICAgc3RhdGVBbmRJbmZvcy5zcGxpY2UoaW5kZXgsIDEpOyAvLyBSZW1vdmUgdGhlIGJveFxuICAgIHRoaXMucmVsb2NhdGVTdGF0ZUFuZEluZm9zKHN0YXRlQW5kSW5mb3MpOyAvLyBSZWxvY2F0ZSBzdGF0ZSBhbmQgaW5mb3NcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG4vLyBTZXQgbXVsdGltZXIgc3RhdHVzIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxuZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uIChub2Rlcywgc3RhdHVzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHZhciBzYmduY2xhc3MgPSBub2RlLmRhdGEoJ3NiZ25jbGFzcycpO1xuICAgIHZhciBpc011bHRpbWVyID0gbm9kZS5kYXRhKCdzYmduY2xhc3MnKS5lbmRzV2l0aCgnIG11bHRpbWVyJyk7XG5cbiAgICBpZiAoc3RhdHVzKSB7IC8vIE1ha2UgbXVsdGltZXIgc3RhdHVzIHRydWVcbiAgICAgIGlmICghaXNNdWx0aW1lcikge1xuICAgICAgICBub2RlLmRhdGEoJ3NiZ25jbGFzcycsIHNiZ25jbGFzcyArICcgbXVsdGltZXInKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7IC8vIE1ha2UgbXVsdGltZXIgc3RhdHVzIGZhbHNlXG4gICAgICBpZiAoaXNNdWx0aW1lcikge1xuICAgICAgICBub2RlLmRhdGEoJ3NiZ25jbGFzcycsIHNiZ25jbGFzcy5yZXBsYWNlKCcgbXVsdGltZXInLCAnJykpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuLy8gU2V0IGNsb25lIG1hcmtlciBzdGF0dXMgb2YgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cbmVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbiAobm9kZXMsIHN0YXR1cykge1xuICBjeS5zdGFydEJhdGNoKCk7XG5cbiAgbm9kZXMuZGF0YSgnY2xvbmVtYXJrZXInLCBzdGF0dXMgPyB0cnVlIDogdW5kZWZpbmVkKTtcbiAgdmFyIG5vZGVzVG9BZGRDbGFzcyA9IG5vZGVzLmZpbHRlcignW2NsYXNzPVwicGVydHVyYmluZyBhZ2VudFwiXScpO1xuICBub2Rlc1RvQWRkQ2xhc3MucmVtb3ZlQ2xhc3MoJ2NoYW5nZUNsb25lZFN0YXR1cycpO1xuICBub2Rlc1RvQWRkQ2xhc3MuYWRkQ2xhc3MoJ2NoYW5nZUNsb25lZFN0YXR1cycpO1xuXG4gIGN5LmVuZEJhdGNoKCk7XG59O1xuXG4vL2VsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbigpXG5cbi8vIENoYW5nZSBmb250IHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIGVsZW1lbnRzIHdpdGggZ2l2ZW4gZm9udCBkYXRhXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKGVsZXMsIGRhdGEpIHtcbiAgZm9yICh2YXIgcHJvcCBpbiBkYXRhKSB7XG4gICAgZWxlcy5kYXRhKHByb3AsIGRhdGFbcHJvcF0pO1xuICB9XG59O1xuXG4vLyBUaGlzIGZ1bmN0aW9uIGdldHMgYW4gZWRnZSwgYW5kIGVuZHMgb2YgdGhhdCBlZGdlIChPcHRpb25hbGx5IGl0IG1heSB0YWtlIGp1c3QgdGhlIGNsYXNzZXMgb2YgdGhlc2UgZWxlbWVudHMgYXMgd2VsbCkgYXMgcGFyYW1ldGVycy5cbi8vIEl0IG1heSByZXR1cm4gJ3ZhbGlkJyAodGhhdCBlbmRzIGlzIHZhbGlkIGZvciB0aGF0IGVkZ2UpLCAncmV2ZXJzZScgKHRoYXQgZW5kcyBpcyBub3QgdmFsaWQgZm9yIHRoYXQgZWRnZSBidXQgdGhleSB3b3VsZCBiZSB2YWxpZCBcbi8vIGlmIHlvdSByZXZlcnNlIHRoZSBzb3VyY2UgYW5kIHRhcmdldCksICdpbnZhbGlkJyAodGhhdCBlbmRzIGFyZSB0b3RhbGx5IGludmFsaWQgZm9yIHRoYXQgZWRnZSkuXG5lbGVtZW50VXRpbGl0aWVzLnZhbGlkYXRlQXJyb3dFbmRzID0gZnVuY3Rpb24gKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0KSB7XG4gIHZhciBlZGdlY2xhc3MgPSB0eXBlb2YgZWRnZSA9PT0gJ3N0cmluZycgPyBlZGdlIDogZWRnZS5kYXRhKCdjbGFzcycpO1xuICB2YXIgc291cmNlY2xhc3MgPSB0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyA/IHNvdXJjZSA6IHNvdXJjZS5kYXRhKCdjbGFzcycpO1xuICB2YXIgdGFyZ2V0Y2xhc3MgPSB0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJyA/IHRhcmdldCA6IHRhcmdldC5kYXRhKCdjbGFzcycpO1xuXG4gIGlmIChlZGdlY2xhc3MgPT0gJ2NvbnN1bXB0aW9uJyB8fCBlZGdlY2xhc3MgPT0gJ21vZHVsYXRpb24nXG4gICAgICAgICAgfHwgZWRnZWNsYXNzID09ICdzdGltdWxhdGlvbicgfHwgZWRnZWNsYXNzID09ICdjYXRhbHlzaXMnXG4gICAgICAgICAgfHwgZWRnZWNsYXNzID09ICdpbmhpYml0aW9uJyB8fCBlZGdlY2xhc3MgPT0gJ25lY2Vzc2FyeSBzdGltdWxhdGlvbicpIHtcbiAgICBpZiAoIXRoaXMuaXNFUE5DbGFzcyhzb3VyY2VjbGFzcykgfHwgIXRoaXMuaXNFUE5DbGFzcyh0YXJnZXRjbGFzcykpIHtcbiAgICAgIGlmICh0aGlzLmlzRVBOQ2xhc3Moc291cmNlY2xhc3MpICYmIHRoaXMuaXNFUE5DbGFzcyh0YXJnZXRjbGFzcykpIHtcbiAgICAgICAgLy9JZiBqdXN0IHRoZSBkaXJlY3Rpb24gaXMgbm90IHZhbGlkIHJldmVyc2UgdGhlIGRpcmVjdGlvblxuICAgICAgICByZXR1cm4gJ3JldmVyc2UnO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKGVkZ2VjbGFzcyA9PSAncHJvZHVjdGlvbicpIHtcbiAgICBpZiAoIXRoaXMuaXNFUE5DbGFzcyhzb3VyY2VjbGFzcykgfHwgIXRoaXMuaXNFUE5DbGFzcyh0YXJnZXRjbGFzcykpIHtcbiAgICAgIGlmICh0aGlzLmlzRVBOQ2xhc3Moc291cmNlY2xhc3MpICYmIHRoaXMuaXNFUE5DbGFzcyh0YXJnZXRjbGFzcykpIHtcbiAgICAgICAgLy9JZiBqdXN0IHRoZSBkaXJlY3Rpb24gaXMgbm90IHZhbGlkIHJldmVyc2UgdGhlIGRpcmVjdGlvblxuICAgICAgICByZXR1cm4gJ3JldmVyc2UnO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKGVkZ2VjbGFzcyA9PSAnbG9naWMgYXJjJykge1xuICAgIHZhciBpbnZhbGlkID0gZmFsc2U7XG4gICAgaWYgKCF0aGlzLmlzRVBOQ2xhc3Moc291cmNlY2xhc3MpIHx8ICF0aGlzLmlzTG9naWNhbE9wZXJhdG9yKHRhcmdldGNsYXNzKSkge1xuICAgICAgaWYgKHRoaXMuaXNMb2dpY2FsT3BlcmF0b3Ioc291cmNlY2xhc3MpICYmIHRoaXMuaXNFUE5DbGFzcyh0YXJnZXRjbGFzcykpIHtcbiAgICAgICAgLy9JZiBqdXN0IHRoZSBkaXJlY3Rpb24gaXMgbm90IHZhbGlkIHJldmVyc2UgdGhlIGRpcmVjdGlvblxuICAgICAgICByZXR1cm4gJ3JldmVyc2UnO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGludmFsaWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHRoZSBjYXNlIHRoYXQgYm90aCBzaWRlcyBhcmUgbG9naWNhbCBvcGVyYXRvcnMgYXJlIHZhbGlkIHRvb1xuICAgIGlmICh0aGlzLmlzTG9naWNhbE9wZXJhdG9yKHNvdXJjZWNsYXNzKSAmJiB0aGlzLmlzTG9naWNhbE9wZXJhdG9yKHRhcmdldGNsYXNzKSkge1xuICAgICAgaW52YWxpZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpbnZhbGlkKSB7XG4gICAgICByZXR1cm4gJ2ludmFsaWQnO1xuICAgIH1cbiAgfVxuICBlbHNlIGlmIChlZGdlY2xhc3MgPT0gJ2VxdWl2YWxlbmNlIGFyYycpIHtcbiAgICBpZiAoISh0aGlzLmlzRVBOQ2xhc3Moc291cmNlY2xhc3MpICYmIHRoaXMuY29udmVuaWVudFRvRXF1aXZhbGVuY2UodGFyZ2V0Y2xhc3MpKVxuICAgICAgICAgICAgJiYgISh0aGlzLmlzRVBOQ2xhc3ModGFyZ2V0Y2xhc3MpICYmIHRoaXMuY29udmVuaWVudFRvRXF1aXZhbGVuY2Uoc291cmNlY2xhc3MpKSkge1xuICAgICAgcmV0dXJuICdpbnZhbGlkJztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gJ3ZhbGlkJztcbn07XG5cbi8qXG4gKiBDaGFuZ2Ugc3R5bGUvY3NzIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIHZhbHVlLlxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VDc3MgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZSkge1xuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZXMuY3NzKG5hbWUsIHZhbHVlKTtcbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGVsZXM6IGVsZXMsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlQ3NzXCIsIHBhcmFtKTtcbiAgfVxufTtcblxuLypcbiAqIENoYW5nZSBkYXRhIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIHZhbHVlLlxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWUpIHtcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBlbGVzLmRhdGEobmFtZSwgdmFsdWUpO1xuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgZWxlczogZWxlcyxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VEYXRhXCIsIHBhcmFtKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbGVtZW50VXRpbGl0aWVzOyIsIi8qIFxuICogVXRpbGl0eSBmaWxlIHRvIGdldCBhbmQgc2V0IHRoZSBsaWJyYXJpZXMgdG8gd2hpY2ggc2JnbnZpeiBpcyBkZXBlbmRlbnQgZnJvbSBhbnkgZmlsZS5cbiAqL1xuXG52YXIgbGliVXRpbGl0aWVzID0gZnVuY3Rpb24oKXtcbn07XG5cbmxpYlV0aWxpdGllcy5zZXRMaWJzID0gZnVuY3Rpb24obGlicykge1xuICB0aGlzLmxpYnMgPSBsaWJzO1xufTtcblxubGliVXRpbGl0aWVzLmdldExpYnMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMubGlicztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbGliVXRpbGl0aWVzOyIsIi8qXHJcbiAqIFRoZSBtYWluIHV0aWxpdGllcyB0byBiZSBleHBvc2VkIGRpcmVjdGx5LlxyXG4gKi9cclxuZnVuY3Rpb24gbWFpblV0aWxpdGllcygpIHtcclxufTtcclxuXHJcbi8qXHJcbiAqIEFkZHMgYSBuZXcgbm9kZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5hZGROb2RlID0gZnVuY3Rpb24oeCwgeSAsIG5vZGVjbGFzcykge1xyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHgsIHksIG5vZGVjbGFzcyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBuZXdOb2RlIDoge1xyXG4gICAgICAgIHg6IHgsXHJcbiAgICAgICAgeTogeSxcclxuICAgICAgICBjbGFzczogbm9kZWNsYXNzXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGROb2RlXCIsIHBhcmFtKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBBZGRzIGEgbmV3IGVkZ2Ugd2l0aCB0aGUgZ2l2ZW4gY2xhc3MgYW5kIGhhdmluZyB0aGUgZ2l2ZW4gc291cmNlIGFuZCB0YXJnZXQgaWRzXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmFkZEVkZ2UgPSBmdW5jdGlvbihzb3VyY2UsIHRhcmdldCAsIGVkZ2VjbGFzcykge1xyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHNvdXJjZSwgdGFyZ2V0LCBlZGdlY2xhc3MpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgbmV3RWRnZSA6IHtcclxuICAgICAgICBzb3VyY2U6IHNvdXJjZSxcclxuICAgICAgICB0YXJnZXQ6IHRhcmdldCxcclxuICAgICAgICBzYmduY2xhc3M6IGVkZ2VjbGFzc1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkRWRnZVwiLCBwYXJhbSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogQ2xvbmUgZ2l2ZW4gZWxlbWVudHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jbG9uZUVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZXMpIHtcclxuICB2YXIgY2IgPSBjeS5jbGlwYm9hcmQoKTtcclxuICB2YXIgX2lkID0gY2IuY29weShlbGVzLCBcImNsb25lT3BlcmF0aW9uXCIpO1xyXG5cclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInBhc3RlXCIsIHtpZDogX2lkfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNiLnBhc3RlKF9pZCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogQWxpZ25zIGdpdmVuIG5vZGVzIGluIGdpdmVuIGhvcml6b250YWwgYW5kIHZlcnRpY2FsIG9yZGVyLiBcclxuICogSG9yaXpvbnRhbCBhbmQgdmVydGljYWwgcGFyYW1ldGVycyBtYXkgYmUgJ25vbmUnIG9yIHVuZGVmaW5lZC5cclxuICogYWxpZ25UbyBwYXJhbWV0ZXIgaW5kaWNhdGVzIHRoZSBsZWFkaW5nIG5vZGUuXHJcbiAqIFJlcXVyaXJlcyBjeXRvc2NhcGUtZ3JpZC1ndWlkZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmFsaWduID0gZnVuY3Rpb24gKG5vZGVzLCBob3Jpem9udGFsLCB2ZXJ0aWNhbCwgYWxpZ25Ubykge1xyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWxpZ25cIiwge1xyXG4gICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgIGhvcml6b250YWw6IGhvcml6b250YWwsXHJcbiAgICAgIHZlcnRpY2FsOiB2ZXJ0aWNhbCxcclxuICAgICAgYWxpZ25UbzogYWxpZ25Ub1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIG5vZGVzLmFsaWduKGhvcml6b250YWwsIHZlcnRpY2FsLCBhbGlnblRvKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDcmVhdGUgY29tcG91bmQgZm9yIGdpdmVuIG5vZGVzLiBjb21wb3VuZFR5cGUgbWF5IGJlICdjb21wbGV4JyBvciAnY29tcGFydG1lbnQnLlxyXG4gKiBUaGlzIG1ldGhvZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgPSBmdW5jdGlvbiAoX25vZGVzLCBjb21wb3VuZFR5cGUpIHtcclxuICB2YXIgbm9kZXMgPSBfbm9kZXM7XHJcbiAgLy8gSnVzdCBFUE4ncyBjYW4gYmUgaW5jbHVkZWQgaW4gY29tcGxleGVzIHNvIHdlIG5lZWQgdG8gZmlsdGVyIEVQTidzIGlmIGNvbXBvdW5kIHR5cGUgaXMgY29tcGxleFxyXG4gIGlmIChjb21wb3VuZFR5cGUgPT09ICdjb21wbGV4Jykge1xyXG4gICAgbm9kZXMgPSBfbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChpLCBlbGVtZW50KSB7XHJcbiAgICAgIHZhciBzYmduY2xhc3MgPSBlbGVtZW50LmRhdGEoXCJjbGFzc1wiKTtcclxuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyhzYmduY2xhc3MpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIFxyXG4gIG5vZGVzID0gZWxlbWVudFV0aWxpdGllcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xyXG5cclxuICAvLyBBbGwgZWxlbWVudHMgc2hvdWxkIGhhdmUgdGhlIHNhbWUgcGFyZW50IGFuZCB0aGUgY29tbW9uIHBhcmVudCBzaG91bGQgbm90IGJlIGEgJ2NvbXBsZXgnIFxyXG4gIC8vIGlmIGNvbXBvdW5kVHlwZSBpcyAnY29tcGFydGVudCdcclxuICAvLyBiZWNhdXNlIHRoZSBvbGQgY29tbW9uIHBhcmVudCB3aWxsIGJlIHRoZSBwYXJlbnQgb2YgdGhlIG5ldyBjb21wYXJ0bWVudCBhZnRlciB0aGlzIG9wZXJhdGlvbiBhbmRcclxuICAvLyAnY29tcGxleGVzJyBjYW5ub3QgaW5jbHVkZSAnY29tcGFydG1lbnRzJ1xyXG4gIGlmIChub2Rlcy5sZW5ndGggPT0gMCB8fCAhZWxlbWVudFV0aWxpdGllcy5hbGxIYXZlVGhlU2FtZVBhcmVudChub2RlcylcclxuICAgICAgICAgIHx8ICggY29tcG91bmRUeXBlID09PSAnY29tcGFydG1lbnQnICYmIG5vZGVzLnBhcmVudCgpLmRhdGEoJ2NsYXNzJykgPT09ICdjb21wbGV4JyApICkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAoY3kudW5kb1JlZG8oKSkge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBjb21wdW5kVHlwZTogY29tcG91bmRUeXBlLFxyXG4gICAgICBub2Rlc1RvTWFrZUNvbXBvdW5kOiBub2Rlc1xyXG4gICAgfTtcclxuXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyhub2RlcywgY29tcG91bmRUeXBlKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcclxuICogaW4gdGhlIGNvbXBsZXguIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSB0aGUgc2FtZSBmdW5jdGlvbiBpbiBlbGVtZW50VXRpbGl0aWVzXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAodGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCkge1xyXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uKHRlbXBsYXRlVHlwZSwgbWFjcm9tb2xlY3VsZUxpc3QsIGNvbXBsZXhOYW1lLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgdGVtcGxhdGVUeXBlOiB0ZW1wbGF0ZVR5cGUsXHJcbiAgICAgIG1hY3JvbW9sZWN1bGVMaXN0OiBtYWNyb21vbGVjdWxlTGlzdCxcclxuICAgICAgY29tcGxleE5hbWU6IGNvbXBsZXhOYW1lLFxyXG4gICAgICBwcm9jZXNzUG9zaXRpb246IHByb2Nlc3NQb3NpdGlvbixcclxuICAgICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXHJcbiAgICAgIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCxcclxuICAgICAgZWRnZUxlbmd0aDogZWRnZUxlbmd0aFxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZVRlbXBsYXRlUmVhY3Rpb25cIiwgcGFyYW0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIFJlc2l6ZSBnaXZlbiBub2RlcyBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHkgb25lIG9mIHdpZHRoIG9yIGhlaWdodCBzaG91bGQgbm90IGJlIHNldC4gXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24obm9kZXMsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvKSB7XHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICB3aWR0aDogd2lkdGgsXHJcbiAgICAgIGhlaWdodDogaGVpZ2h0LFxyXG4gICAgICB1c2VBc3BlY3RSYXRpbzogdXNlQXNwZWN0UmF0aW8sXHJcbiAgICAgIHBlcmZvcm1PcGVyYXRpb246IHRydWVcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZXNpemVOb2Rlc1wiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2Rlcyhub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8pO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIENoYW5nZXMgdGhlIGxhYmVsIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gbGFiZWwuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uKG5vZGVzLCBsYWJlbCkge1xyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBub2Rlcy5kYXRhKCdsYWJlbCcsIGxhYmVsKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgbGFiZWw6IGxhYmVsLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VOb2RlTGFiZWxcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuLypcclxuICogQ2hhbmdlIGZvbnQgcHJvcGVydGllcyBmb3IgZ2l2ZW4gZWxlcyB1c2UgdGhlIGdpdmVuIGZvbnQgZGF0YS5cclxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbihlbGVzLCBkYXRhKSB7XHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgZWxlczogZWxlcyxcclxuICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgZmlyc3RUaW1lOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VGb250UHJvcGVydGllc1wiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyhlbGVzLCBkYXRhKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDaGFuZ2Ugc3RhdGUgdmFsdWUgb3IgdW5pdCBvZiBpbmZvcm1hdGlvbiBib3ggb2YgZ2l2ZW4gbm9kZXMgd2l0aCBnaXZlbiBpbmRleC5cclxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHBhcmFtZXRlcnMgc2VlIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3hcclxuICovXHJcbm1haW5VdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgaW5kZXg6IGluZGV4LFxyXG4gICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgfTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXHJcbi8vIFRoZSBib3ggaXMgcmVwcmVzZW50ZWQgYnkgdGhlIHBhcmFtZXRlciBvYmouXHJcbi8vIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2Rlcywgb2JqKSB7XHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBvYmo6IG9iaixcclxuICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIFJlbW92ZSB0aGUgc3RhdGUgb3IgaW5mbyBib3hlcyBvZiB0aGUgZ2l2ZW4gbm9kZXMgYXQgZ2l2ZW4gaW5kZXguXHJcbi8vIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgpIHtcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgaW5kZXg6IGluZGV4LFxyXG4gICAgICBub2Rlczogbm9kZXNcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInJlbW92ZVN0YXRlT3JJbmZvQm94XCIsIHBhcmFtKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBTZXQgbXVsdGltZXIgc3RhdHVzIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxyXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uKG5vZGVzLCBzdGF0dXMpIHtcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBzdGF0dXM6IHN0YXR1cyxcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNldE11bHRpbWVyU3RhdHVzXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIFNldCBjbG9uZSBtYXJrZXIgc3RhdHVzIG9mIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqLyBcclxubWFpblV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uKG5vZGVzLCBzdGF0dXMpIHtcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBzdGF0dXM6IHN0YXR1cyxcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNldENsb25lTWFya2VyU3RhdHVzXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFpblV0aWxpdGllczsiLCIvKlxuICogIEV4dGVuZCBkZWZhdWx0IG9wdGlvbnMgYW5kIGdldCBjdXJyZW50IG9wdGlvbnMgYnkgdXNpbmcgdGhpcyBmaWxlIFxuICovXG5cbi8vIGRlZmF1bHQgb3B0aW9uc1xudmFyIGRlZmF1bHRzID0ge1xuICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgdGhlIGluZGV4IGh0bWwgXG4gIC8vIGZpbGUgYW5kIG5vZGVfbW9kdWxlcyBhcmUgdW5kZXIgdGhlIHNhbWUgZm9sZGVyIHRoZW4gdXNpbmcgdGhlIGRlZmF1bHQgdmFsdWUgaXMgZmluZVxuICBpbWdQYXRoOiAnbm9kZV9tb2R1bGVzL3NiZ252aXovc3JjL2ltZycsXG4gIC8vIFdoZXRoZXIgdG8gZml0IGxhYmVscyB0byBub2Rlc1xuICBmaXRMYWJlbHNUb05vZGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICAvLyBkeW5hbWljIGxhYmVsIHNpemUgaXQgbWF5IGJlICdzbWFsbCcsICdyZWd1bGFyJywgJ2xhcmdlJ1xuICBkeW5hbWljTGFiZWxTaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICdyZWd1bGFyJztcbiAgfSxcbiAgLy8gcGVyY2VudGFnZSB1c2VkIHRvIGNhbGN1bGF0ZSBjb21wb3VuZCBwYWRkaW5nc1xuICBjb21wb3VuZFBhZGRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gMTA7XG4gIH0sXG4gIC8vIFRoZSBzZWxlY3RvciBvZiB0aGUgY29tcG9uZW50IGNvbnRhaW5pbmcgdGhlIHNiZ24gbmV0d29ya1xuICBuZXR3b3JrQ29udGFpbmVyU2VsZWN0b3I6ICcjc2Jnbi1uZXR3b3JrLWNvbnRhaW5lcicsXG4gIC8vIFdoZXRoZXIgdGhlIGFjdGlvbnMgYXJlIHVuZG9hYmxlLCByZXF1aXJlcyBjeXRvc2NhcGUtdW5kby1yZWRvIGV4dGVuc2lvblxuICB1bmRvYWJsZTogdHJ1ZSxcbiAgLy8gV2hldGhlciB0byBoYXZlIHVuZG9hYmxlIGRyYWcgZmVhdHVyZSBpbiB1bmRvL3JlZG8gZXh0ZW5zaW9uLiBUaGlzIG9wdGlvbnMgd2lsbCBiZSBwYXNzZWQgdG8gdW5kby9yZWRvIGV4dGVuc2lvblxuICB1bmRvYWJsZURyYWc6IHRydWVcbn07XG5cbnZhciBvcHRpb25VdGlsaXRpZXMgPSBmdW5jdGlvbiAoKSB7XG59O1xuXG4vLyBFeHRlbmQgdGhlIGRlZmF1bHRzIG9wdGlvbnMgd2l0aCB0aGUgdXNlciBvcHRpb25zXG5vcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcblxuICBmb3IgKHZhciBwcm9wIGluIGRlZmF1bHRzKSB7XG4gICAgcmVzdWx0W3Byb3BdID0gZGVmYXVsdHNbcHJvcF07XG4gIH1cbiAgXG4gIGZvciAodmFyIHByb3AgaW4gb3B0aW9ucykge1xuICAgIHJlc3VsdFtwcm9wXSA9IG9wdGlvbnNbcHJvcF07XG4gIH1cblxuICBvcHRpb25VdGlsaXRpZXMub3B0aW9ucyA9IHJlc3VsdDtcblxuICByZXR1cm4gb3B0aW9ucztcbn07XG5cbm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9wdGlvblV0aWxpdGllczsiLCJ2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XHJcblxyXG52YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSBmdW5jdGlvbiAodW5kb2FibGVEcmFnKSB7XHJcbiAgLy8gY3JlYXRlIHVuZG8tcmVkbyBpbnN0YW5jZVxyXG4gIHZhciB1ciA9IGN5LnVuZG9SZWRvKHtcclxuICAgIHVuZG9hYmxlRHJhZzogdW5kb2FibGVEcmFnXHJcbiAgfSk7XHJcblxyXG4gIC8vIHJlZ2lzdGVyIGFkZCByZW1vdmUgYWN0aW9uc1xyXG4gIHVyLmFjdGlvbihcImFkZE5vZGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkTm9kZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XHJcbiAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XHJcbiAgdXIuYWN0aW9uKFwiYWRkRWRnZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRFZGdlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcclxuICB1ci5hY3Rpb24oXCJkZWxldGVFbGVzU21hcnRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NtYXJ0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XHJcbiAgdXIuYWN0aW9uKFwiY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlQ29tcG91bmQpO1xyXG5cclxuICAvLyByZWdpc3RlciBnZW5lcmFsIGFjdGlvbnNcclxuICB1ci5hY3Rpb24oXCJyZXNpemVOb2Rlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMpO1xyXG4gIHVyLmFjdGlvbihcImNoYW5nZU5vZGVMYWJlbFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCk7XHJcbiAgLy8gVE9ETyByZW1vdmUgdGhpc1xyXG4gIHVyLmFjdGlvbihcImNoYW5nZURhdGFcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRGF0YSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRGF0YSk7XHJcbiAgdXIuYWN0aW9uKFwiY2hhbmdlQ3NzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUNzcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzKTtcclxuICB1ci5hY3Rpb24oXCJjaGFuZ2VCZW5kUG9pbnRzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMpO1xyXG4gIHVyLmFjdGlvbihcImNoYW5nZUZvbnRQcm9wZXJ0aWVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUZvbnRQcm9wZXJ0aWVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcyk7XHJcbiAgdXIuYWN0aW9uKFwic2hvd0FuZFBlcmZvcm1JbmNyZW1lbnRhbExheW91dFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUluY3JlbWVudGFsTGF5b3V0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvU2hvd0FuZFBlcmZvcm1JbmNyZW1lbnRhbExheW91dCk7XHJcblxyXG4gIC8vIHJlZ2lzdGVyIFNCR04gYWN0aW9uc1xyXG4gIHVyLmFjdGlvbihcImFkZFN0YXRlQW5kSW5mb1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZUFuZEluZm8sIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94KTtcclxuICB1ci5hY3Rpb24oXCJjaGFuZ2VTdGF0ZU9ySW5mb0JveFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3gpO1xyXG4gIHVyLmFjdGlvbihcImNoYW5nZVVuaXRPZkluZm9ybWF0aW9uXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVVuaXRPZkluZm9ybWF0aW9uLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VVbml0T2ZJbmZvcm1hdGlvbik7XHJcbiAgdXIuYWN0aW9uKFwic2V0TXVsdGltZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzKTtcclxuICB1ci5hY3Rpb24oXCJzZXRDbG9uZU1hcmtlclN0YXR1c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMpO1xyXG4gIHVyLmFjdGlvbihcInJlbW92ZVN0YXRlT3JJbmZvQm94XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZUFuZEluZm8pO1xyXG4gIFxyXG4gIC8vIHJlZ2lzdGVyIGVhc3kgY3JlYXRpb24gYWN0aW9uc1xyXG4gIHVyLmFjdGlvbihcImNyZWF0ZVRlbXBsYXRlUmVhY3Rpb25cIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlRWxlcyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zOyIsIi8vIEV4dGVuZHMgc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gbGlicy5zYmdudml6LnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xyXG5cclxuLy8gU2VjdGlvbiBTdGFydFxyXG4vLyBhZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZE5vZGUgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0O1xyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIHZhciBuZXdOb2RlID0gcGFyYW0ubmV3Tm9kZTtcclxuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShuZXdOb2RlLngsIG5ld05vZGUueSwgbmV3Tm9kZS5zYmduY2xhc3MpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGVsZXM6IHJlc3VsdFxyXG4gIH07XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRFZGdlID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdDtcclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICB2YXIgbmV3RWRnZSA9IHBhcmFtLm5ld0VkZ2U7XHJcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3RWRnZS5zb3VyY2UsIG5ld0VkZ2UudGFyZ2V0LCBuZXdFZGdlLnNiZ25jbGFzcyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZWxlczogcmVzdWx0XHJcbiAgfTtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBub2Rlc1RvTWFrZUNvbXBvdW5kID0gcGFyYW0ubm9kZXNUb01ha2VDb21wb3VuZDtcclxuICB2YXIgbmV3Q29tcG91bmQ7XHJcblxyXG4gIC8vIElmIHRoaXMgaXMgYSByZWRvIGFjdGlvbiByZWZyZXNoIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kIChXZSBuZWVkIHRoaXMgYmVjYXVzZSBhZnRlciBlbGUubW92ZSgpIHJlZmVyZW5jZXMgdG8gZWxlcyBjaGFuZ2VzKVxyXG4gIGlmICghcGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICB2YXIgbm9kZXNUb01ha2VDb21wb3VuZElkcyA9IHt9O1xyXG5cclxuICAgIG5vZGVzVG9NYWtlQ29tcG91bmQuZWFjaChmdW5jdGlvbiAoaSwgZWxlKSB7XHJcbiAgICAgIG5vZGVzVG9NYWtlQ29tcG91bmRJZHNbZWxlLmlkKCldID0gdHJ1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKCk7XHJcblxyXG4gICAgbm9kZXNUb01ha2VDb21wb3VuZCA9IGFsbE5vZGVzLmZpbHRlcihmdW5jdGlvbiAoaSwgZWxlKSB7XHJcbiAgICAgIHJldHVybiBub2Rlc1RvTWFrZUNvbXBvdW5kSWRzW2VsZS5pZCgpXTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgdmFyIG9sZFBhcmVudElkID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwicGFyZW50XCIpO1xyXG4gICAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZFxyXG4gICAgbmV3Q29tcG91bmQgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyhub2Rlc1RvTWFrZUNvbXBvdW5kLCBwYXJhbS5jb21wdW5kVHlwZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbmV3Q29tcG91bmQgPSBwYXJhbS5yZW1vdmVkQ29tcHVuZC5yZXN0b3JlKCk7XHJcbiAgICB2YXIgbmV3Q29tcG91bmRJZCA9IG5ld0NvbXBvdW5kLmlkKCk7XHJcblxyXG4gICAgbm9kZXNUb01ha2VDb21wb3VuZC5tb3ZlKHtwYXJlbnQ6IG5ld0NvbXBvdW5kSWR9KTtcclxuXHJcbiAgICByZWZyZXNoUGFkZGluZ3MoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXdDb21wb3VuZDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZUNvbXBvdW5kID0gZnVuY3Rpb24gKGNvbXBvdW5kVG9SZW1vdmUpIHtcclxuICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZUNvbXBvdW5kKGNvbXBvdW5kVG9SZW1vdmUpO1xyXG5cclxuICB2YXIgcGFyYW0gPSB7XHJcbiAgICBub2Rlc1RvTWFrZUNvbXBvdW5kOiBjaGlsZHJlbk9mQ29tcG91bmQsXHJcbiAgICByZW1vdmVkQ29tcHVuZDogcmVtb3ZlZENvbXB1bmRcclxuICB9O1xyXG5cclxuICByZXR1cm4gcGFyYW07XHJcbn07XHJcblxyXG4vLyBTZWN0aW9uIEVuZFxyXG4vLyBhZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbi8vIFNlY3Rpb24gU3RhcnRcclxuLy8gZWFzeSBjcmVhdGlvbiBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcclxuICB2YXIgZWxlcztcclxuXHJcbiAgaWYgKGZpcnN0VGltZSkge1xyXG4gICAgZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbihwYXJhbS50ZW1wbGF0ZVR5cGUsIHBhcmFtLm1hY3JvbW9sZWN1bGVMaXN0LCBwYXJhbS5jb21wbGV4TmFtZSwgcGFyYW0ucHJvY2Vzc1Bvc2l0aW9uLCBwYXJhbS50aWxpbmdQYWRkaW5nVmVydGljYWwsIHBhcmFtLnRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBwYXJhbS5lZGdlTGVuZ3RoKVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZXMgPSBwYXJhbTtcclxuICAgIGN5LmFkZChlbGVzKTtcclxuICAgIFxyXG4gICAgcmVmcmVzaFBhZGRpbmdzKCk7XHJcbiAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XHJcbiAgICBlbGVzLnNlbGVjdCgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGVsZXM7XHJcbn07XHJcblxyXG4vLyBTZWN0aW9uIEVuZFxyXG4vLyBlYXN5IGNyZWF0aW9uIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbi8vIFNlY3Rpb24gU3RhcnRcclxuLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zQW5kU2l6ZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHBvc2l0aW9uc0FuZFNpemVzID0ge307XHJcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGVsZSA9IG5vZGVzW2ldO1xyXG4gICAgcG9zaXRpb25zQW5kU2l6ZXNbZWxlLmlkKCldID0ge1xyXG4gICAgICB3aWR0aDogZWxlLndpZHRoKCksXHJcbiAgICAgIGhlaWdodDogZWxlLmhlaWdodCgpLFxyXG4gICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxyXG4gICAgICB5OiBlbGUucG9zaXRpb24oXCJ5XCIpXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHBvc2l0aW9uc0FuZFNpemVzO1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnNBbmRTaXplc0NvbmRpdGlvbmFsbHkgPSBmdW5jdGlvbiAobm9kZXNEYXRhKSB7XHJcbiAgaWYgKG5vZGVzRGF0YS5maXJzdFRpbWUpIHtcclxuICAgIGRlbGV0ZSBub2Rlc0RhdGEuZmlyc3RUaW1lO1xyXG4gICAgcmV0dXJuIG5vZGVzRGF0YTtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMucmV0dXJuVG9Qb3NpdGlvbnNBbmRTaXplcyhub2Rlc0RhdGEpO1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnNBbmRTaXplcyA9IGZ1bmN0aW9uIChub2Rlc0RhdGEpIHtcclxuICB2YXIgY3VycmVudFBvc2l0aW9uc0FuZFNpemVzID0ge307XHJcbiAgY3kubm9kZXMoKS5wb3NpdGlvbnMoZnVuY3Rpb24gKGksIGVsZSkge1xyXG4gICAgY3VycmVudFBvc2l0aW9uc0FuZFNpemVzW2VsZS5pZCgpXSA9IHtcclxuICAgICAgd2lkdGg6IGVsZS53aWR0aCgpLFxyXG4gICAgICBoZWlnaHQ6IGVsZS5oZWlnaHQoKSxcclxuICAgICAgeDogZWxlLnBvc2l0aW9uKFwieFwiKSxcclxuICAgICAgeTogZWxlLnBvc2l0aW9uKFwieVwiKVxyXG4gICAgfTtcclxuICAgIHZhciBkYXRhID0gbm9kZXNEYXRhW2VsZS5pZCgpXTtcclxuICAgIGVsZS5fcHJpdmF0ZS5kYXRhLndpZHRoID0gZGF0YS53aWR0aDtcclxuICAgIGVsZS5fcHJpdmF0ZS5kYXRhLmhlaWdodCA9IGRhdGEuaGVpZ2h0O1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogZGF0YS54LFxyXG4gICAgICB5OiBkYXRhLnlcclxuICAgIH07XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBjdXJyZW50UG9zaXRpb25zQW5kU2l6ZXM7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBwZXJmb3JtT3BlcmF0aW9uOiB0cnVlXHJcbiAgfTtcclxuXHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcblxyXG4gIHJlc3VsdC5zaXplTWFwID0ge307XHJcbiAgcmVzdWx0LnVzZUFzcGVjdFJhdGlvID0gZmFsc2U7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICByZXN1bHQuc2l6ZU1hcFtub2RlLmlkKCldID0ge1xyXG4gICAgICB3OiBub2RlLndpZHRoKCksXHJcbiAgICAgIGg6IG5vZGUuaGVpZ2h0KClcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICByZXN1bHQubm9kZXMgPSBub2RlcztcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuXHJcbiAgICBpZiAocGFyYW0ucGVyZm9ybU9wZXJhdGlvbikge1xyXG4gICAgICBpZiAocGFyYW0uc2l6ZU1hcCkge1xyXG4gICAgICAgIG5vZGUuZGF0YShcInNiZ25iYm94XCIpLncgPSBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0udztcclxuICAgICAgICBub2RlLmRhdGEoXCJzYmduYmJveFwiKS5oID0gcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmg7XHJcblxyXG4gICAgICAgIG5vZGUucmVtb3ZlQ2xhc3MoJ25vZGVyZXNpemVkJyk7XHJcbiAgICAgICAgbm9kZS5hZGRDbGFzcygnbm9kZXJlc2l6ZWQnKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKHBhcmFtLm5vZGVzLCBwYXJhbS53aWR0aCwgcGFyYW0uaGVpZ2h0LCBwYXJhbS51c2VBc3BlY3RSYXRpbyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4vLyAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICBub2Rlcy5yZW1vdmVDbGFzcygnbm9kZXJlc2l6ZWQnKTtcclxuICBub2Rlcy5hZGRDbGFzcygnbm9kZXJlc2l6ZWQnKTtcclxuXHJcbiAgLy8gVE9ETyBoYW5kbGUgc2JnbiBpbnNwZWN0b3IgYWZ0ZXIgdGhpcyBjYWxsXHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gIH07XHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcbiAgcmVzdWx0Lm5vZGVzID0gbm9kZXM7XHJcbiAgcmVzdWx0LmxhYmVsID0ge307XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICByZXN1bHQubGFiZWxbbm9kZS5pZCgpXSA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcclxuICB9XHJcblxyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIG5vZGVzLmRhdGEoJ2xhYmVsJywgcGFyYW0ubGFiZWwpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsID0gcGFyYW0ubGFiZWxbbm9kZS5pZCgpXTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLy8gY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuXHJcbiAgLy8gVE9ETyBoYW5kbGUgc2JnbiBpbnNwZWN0b3IgYWZ0ZXIgdGhpcyBjYWxsXHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICB9O1xyXG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuXHJcbiAgcmVzdWx0Lm5hbWUgPSBwYXJhbS5uYW1lO1xyXG4gIHJlc3VsdC52YWx1ZU1hcCA9IHt9O1xyXG4gIHJlc3VsdC5lbGVzID0gZWxlcztcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgZWxlID0gZWxlc1tpXTtcclxuICAgIHJlc3VsdC52YWx1ZU1hcFtlbGUuaWQoKV0gPSBlbGUuZGF0YShwYXJhbS5uYW1lKTtcclxuICB9XHJcblxyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIGVsZXMuZGF0YShwYXJhbS5uYW1lLCBwYXJhbS52YWx1ZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG4gICAgICBlbGUuZGF0YShwYXJhbS5uYW1lLCBwYXJhbS52YWx1ZU1hcFtlbGUuaWQoKV0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gIGN5LmZvcmNlUmVuZGVyKCk7XHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTsgLy8gVXBkYXRlIHN0eWxlXHJcblxyXG4gIC8vIFRPRE8gaGFuZGxlIHNiZ24gaW5zcGVjdG9yIGFmdGVyIHRoaXMgY2FsbFxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICB9O1xyXG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuICByZXN1bHQubmFtZSA9IHBhcmFtLm5hbWU7XHJcbiAgcmVzdWx0LnZhbHVlTWFwID0ge307XHJcbiAgcmVzdWx0LmVsZXMgPSBlbGVzO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG4gICAgcmVzdWx0LnZhbHVlTWFwW2VsZS5pZCgpXSA9IGVsZS5jc3MocGFyYW0ubmFtZSk7XHJcbiAgfVxyXG5cclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICBlbGVzLmNzcyhwYXJhbS5uYW1lLCBwYXJhbS52YWx1ZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG4gICAgICBlbGUuY3NzKHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlTWFwW2VsZS5pZCgpXSk7XHJcbiAgICB9XHJcbiAgfVxyXG4vLyAgY3kuZm9yY2VSZW5kZXIoKTtcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpOyAvLyBVcGRhdGUgc3R5bGVcclxuXHJcbiAgLy8gVE9ETyBtb3ZlIHN1Y2ggY2FsbHMgdG8gc2FtcGxlIGFwcGxpY2F0aW9uIG1heWJlIGJ5IHRyaWdnZXJpbmcgYW4gZXZlbnRcclxuLy8gIGlmIChfLmlzRXF1YWwoZWxlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xyXG4vLyAgICBpbnNwZWN0b3JVdGlsaXRpZXMuaGFuZGxlU0JHTkluc3BlY3RvcigpO1xyXG4vLyAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gIH07XHJcblxyXG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuICByZXN1bHQuZGF0YSA9IHt9O1xyXG4gIHJlc3VsdC5lbGVzID0gZWxlcztcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgZWxlID0gZWxlc1tpXTtcclxuXHJcbiAgICByZXN1bHQuZGF0YVtlbGUuaWQoKV0gPSB7fTtcclxuXHJcbiAgICB2YXIgZGF0YSA9IHBhcmFtLmZpcnN0VGltZSA/IHBhcmFtLmRhdGEgOiBwYXJhbS5kYXRhW2VsZS5pZCgpXTtcclxuXHJcbiAgICBmb3IgKHZhciBwcm9wIGluIGRhdGEpIHtcclxuICAgICAgcmVzdWx0LmRhdGFbZWxlLmlkKCldW3Byb3BdID0gZWxlLmRhdGEocHJvcCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZXMsIHBhcmFtLmRhdGEpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZWxlID0gZWxlc1tpXTtcclxuXHJcbiAgICAgIGZvciAodmFyIHByb3AgaW4gcGFyYW0uZGF0YVtlbGUuaWQoKV0pIHtcclxuICAgICAgICBlbGUuZGF0YShwcm9wLCBwYXJhbS5kYXRhW2VsZS5pZCgpXVtwcm9wXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vLyBUT0RPIHJlY29uc2lkZXIgdGhpcyBvcGVyYXRpb24gb2YgdW5kbyBvZiBpdC5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2hvd0FuZFBlcmZvcm1JbmNyZW1lbnRhbExheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuXHJcbiAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gIHJlc3VsdC5wb3NpdGlvbkFuZFNpemVzID0gdGhpcy5nZXROb2RlUG9zaXRpb25zQW5kU2l6ZXMoKTtcclxuICByZXN1bHQuZWxlcyA9IGVsZXMuc2hvd0VsZXMoKTtcclxuXHJcbiAgaWYgKHBhcmFtLnBvc2l0aW9uQW5kU2l6ZXMpIHtcclxuICAgIHRoaXMucmV0dXJuVG9Qb3NpdGlvbnNBbmRTaXplcyhwYXJhbS5wb3NpdGlvbkFuZFNpemVzKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0cmlnZ2VySW5jcmVtZW50YWxMYXlvdXQoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvU2hvd0FuZFBlcmZvcm1JbmNyZW1lbnRhbExheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuXHJcbiAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gIHJlc3VsdC5wb3NpdGlvbkFuZFNpemVzID0gdGhpcy5nZXROb2RlUG9zaXRpb25zQW5kU2l6ZXMoKTtcclxuICByZXN1bHQuZWxlcyA9IGVsZXMuaGlkZUVsZXMoKTtcclxuXHJcbiAgdGhpcy5yZXR1cm5Ub1Bvc2l0aW9uc0FuZFNpemVzKHBhcmFtLnBvc2l0aW9uQW5kU2l6ZXMpO1xyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLy8gU2VjdGlvbiBFbmRcclxuLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG4vLyBTZWN0aW9uIFN0YXJ0XHJcbi8vIHNiZ24gYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gIH07XHJcbiAgcmVzdWx0LnR5cGUgPSBwYXJhbS50eXBlO1xyXG4gIHJlc3VsdC5ub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG4gIHJlc3VsdC5pbmRleCA9IHBhcmFtLmluZGV4O1xyXG5cclxuICByZXN1bHQudmFsdWUgPSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94KHBhcmFtLm5vZGVzLCBwYXJhbS5pbmRleCwgcGFyYW0udmFsdWUsIHBhcmFtLnR5cGUpO1xyXG5cclxuICBjeS5mb3JjZVJlbmRlcigpO1xyXG5cclxuICAvLyBUT0RPIG1vdmUgc3VjaCBjYWxscyB0byBzYW1wbGUgYXBwbGljYXRpb24gbWF5YmUgYnkgdHJpZ2dlcmluZyBhbiBldmVudFxyXG4vLyAgaW5zcGVjdG9yVXRpbGl0aWVzLmZpbGxJbnNwZWN0b3JTdGF0ZUFuZEluZm9zKHBhcmFtLm5vZGVzLCBwYXJhbS5ub2RlcygpLmRhdGEoJ3N0YXRlYW5kaW5mb3MnKSwgcGFyYW0ud2lkdGgpO1xyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgb2JqID0gcGFyYW0ub2JqO1xyXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG5cclxuICB2YXIgaW5kZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG5vZGVzLCBvYmopO1xyXG5cclxuICBcclxuICBjeS5mb3JjZVJlbmRlcigpO1xyXG5cclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgaW5kZXg6IGluZGV4LFxyXG4gICAgb2JqOiBvYmpcclxuICB9O1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBpbmRleCA9IHBhcmFtLmluZGV4O1xyXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG5cclxuICB2YXIgb2JqID0gZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgpO1xyXG5cclxuICAvLyBUT0RPIGZpbGwgaW5zcGVjdG9yIHN0YXRlIGFuZCBpbmZvcyBhZnRlciB0aGlzIGNhbGxcclxuICBjeS5mb3JjZVJlbmRlcigpO1xyXG5cclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgb2JqOiBvYmpcclxuICB9O1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcbiAgdmFyIHN0YXR1cyA9IHBhcmFtLnN0YXR1cztcclxuICB2YXIgcmVzdWx0U3RhdHVzID0ge307XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICB2YXIgaXNNdWx0aW1lciA9IG5vZGUuZGF0YSgnc2JnbmNsYXNzJykuZW5kc1dpdGgoJyBtdWx0aW1lcicpO1xyXG5cclxuICAgIHJlc3VsdE1ha2VNdWx0aW1lcltub2RlLmlkKCldID0gaXNNdWx0aW1lcjtcclxuICB9XHJcblxyXG4gIC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IHRpbWUgY2hhbmdlIHRoZSBzdGF0dXMgb2YgYWxsIG5vZGVzIGF0IG9uY2UuXHJcbiAgLy8gSWYgbm90IGNoYW5nZSBzdGF0dXMgb2YgZWFjaCBzZXBlcmF0ZWx5IHRvIHRoZSB2YWx1ZXMgbWFwcGVkIHRvIHRoZWlyIGlkLlxyXG4gIGlmIChmaXJzdFRpbWUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMobm9kZXMsIHN0YXR1cyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGUsIHN0YXR1c1tub2RlLmlkKCldKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICghZmlyc3RUaW1lICYmIF8uaXNFcXVhbChub2RlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xyXG4gICAgJCgnI2luc3BlY3Rvci1pcy1tdWx0aW1lcicpLmF0dHIoXCJjaGVja2VkXCIsICEkKCcjaW5zcGVjdG9yLWlzLW11bHRpbWVyJykuYXR0cihcImNoZWNrZWRcIikpO1xyXG4gIH1cclxuXHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICAgIHN0YXR1czogcmVzdWx0U3RhdHVzLFxyXG4gICAgbm9kZXM6IG5vZGVzXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcbiAgdmFyIHN0YXR1cyA9IHBhcmFtLnN0YXR1cztcclxuICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xyXG4gIHZhciByZXN1bHRTdGF0dXMgPSB7fTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHJlc3VsdFN0YXR1c1tub2RlLmlkKCldID0gbm9kZS5kYXRhKCdjbG9uZW1hcmtlcicpO1xyXG4gICAgdmFyIGN1cnJlbnRTdGF0dXMgPSBmaXJzdFRpbWUgPyBzdGF0dXMgOiBzdGF0dXNbbm9kZS5pZCgpXTtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMobm9kZXMsIGN1cnJlbnRTdGF0dXMpO1xyXG4gIH1cclxuXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuXHJcbiAgaWYgKCFmaXJzdFRpbWUgJiYgXy5pc0VxdWFsKG5vZGVzLCBjeS5ub2RlcygnOnNlbGVjdGVkJykpKSB7XHJcbiAgICAkKCcjaW5zcGVjdG9yLWlzLWNsb25lLW1hcmtlcicpLmF0dHIoXCJjaGVja2VkXCIsICEkKCcjaW5zcGVjdG9yLWlzLWNsb25lLW1hcmtlcicpLmF0dHIoXCJjaGVja2VkXCIpKTtcclxuICB9XHJcblxyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBzdGF0dXM6IHJlc3VsdFN0YXR1cyxcclxuICAgIG5vZGVzOiBub2Rlc1xyXG4gIH07XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vLyBTZWN0aW9uIEVuZFxyXG4vLyBzYmduIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7Il19
