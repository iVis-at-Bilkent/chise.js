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

      node.data('bbox').w = w;
      node.data('bbox').h = h;
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
    .selector("node[class='complex'],node[class='compartment'],node.cancel-dynamic-label-size[labelsize]")
    .style({
      'font-size': function (ele) {
        return ele.data('labelsize');
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
    // Initilize font related data of the elements which can have label
    cy.nodes().each(function(i, ele) {
      if (elementUtilities.canHaveSBGNLabel(ele)) {
        ele.data('labelsize', elementUtilities.getDefaultLabelSize(ele.data('class')));
        ele.data('fontweight', elementUtilities.defaultFontProperties.fontweight);
        ele.data('fontfamily', elementUtilities.defaultFontProperties.fontfamily);
        ele.data('fontstyle', elementUtilities.defaultFontProperties.fontstyle);
      }
    });

    cy.nodes().addClass('cancel-dynamic-label-size'); // TODO think of a better way

    upateStyleSheet();
    bindCyEvents();
  });
};
},{"./element-utilities":3,"./lib-utilities":4}],3:[function(_dereq_,module,exports){
// Extends sbgnviz.elementUtilities
var libs = _dereq_('./lib-utilities').getLibs();
var sbgnviz = libs.sbgnviz;
var elementUtilities = sbgnviz.elementUtilities;
var options = _dereq_('./option-utilities').getOptions();

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

elementUtilities.getDefaultLabelSize = function (sbgnclass) {
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

elementUtilities.addNode = function (x, y, sbgnclass, parent, visibility) {
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
    class: sbgnclass,
    bbox: {
      h: height,
      w: width,
      x: x,
      y: y
    },
    statesandinfos: [],
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

  sbgnviz.refreshPaddings();
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
      class: sbgnclass
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
elementUtilities.createCompoundForGivenNodes = function (nodesToMakeCompound, compoundType) {
  var oldParentId = nodesToMakeCompound[0].data("parent");
  // The parent of new compound will be the old parent of the nodes to make compound
  var newCompound = elementUtilities.addNode(undefined, undefined, compoundType, oldParentId);
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
    var newNode = elementUtilities.addNode(complex.position('x'), complex.position('y'), "macromolecule", complex.id());
    newNode.data('justAdded', true);
    newNode.data('label', macromoleculeList[i]);
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
  
  sbgnviz.refreshPaddings();
  cy.elements().unselect();
  eles.select();
  
  return eles; // Return the just added elements
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
    if (!this.isEPNClass(sourceclass) || !this.isPNClass(targetclass)) {
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
    if (!this.isPNClass(sourceclass) || !this.isEPNClass(targetclass)) {
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
 * Adds a new node with the given class and at the given coordinates.
 */
mainUtilities.addNode = function(x, y , nodeclass) {
  if (!options.undoable) {
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
    return elementUtilities.addEdge(source, target, edgeclass);
  }
  else {
    var param = {
      newEdge : {
        source: source,
        target: target,
        class: edgeclass
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
    result = elementUtilities.addNode(newNode.x, newNode.y, newNode.class);
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
    result = elementUtilities.addEdge(newEdge.source, newEdge.target, newEdge.class);
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
        node.data("bbox").w = param.sizeMap[node.id()].w;
        node.data("bbox").h = param.sizeMap[node.id()].h;

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
    var isMultimer = node.data('class').endsWith(' multimer');

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
},{"./element-utilities":3,"./lib-utilities":4}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9saWItdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM3lCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCl7XG4gIHZhciBjaGlzZSA9IHdpbmRvdy5jaGlzZSA9IGZ1bmN0aW9uKF9vcHRpb25zLCBfbGlicykge1xuICAgIHZhciBsaWJzID0ge307XG4gICAgbGlicy5qUXVlcnkgPSBfbGlicy5qUXVlcnkgfHwgalF1ZXJ5O1xuICAgIGxpYnMuY3l0b3NjYXBlID0gX2xpYnMuY3l0b3NjYXBlIHx8IGN5dG9zY2FwZTtcbiAgICBsaWJzLnNiZ252aXogPSBfbGlicy5zYmdudml6IHx8IHNiZ252aXo7XG4gICAgbGlicy5zYXZlQXMgPSBfbGlicy5maWxlc2F2ZXJqcyA/IF9saWJzLmZpbGVzYXZlcmpzLnNhdmVBcyA6IHNhdmVBcztcbiAgICBcbiAgICBsaWJzLnNiZ252aXooX29wdGlvbnMsIF9saWJzKTsgLy8gSW5pdGlsaXplIHNiZ252aXpcbiAgICBcbiAgICAvLyBTZXQgdGhlIGxpYnJhcmllcyB0byBhY2Nlc3MgdGhlbSBmcm9tIGFueSBmaWxlXG4gICAgdmFyIGxpYlV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKTtcbiAgICBsaWJVdGlsaXRpZXMuc2V0TGlicyhsaWJzKTtcbiAgICBcbiAgICB2YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcycpO1xuICAgIHZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMoX29wdGlvbnMpOyAvLyBFeHRlbmRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9uc1xuICAgIFxuICAgIC8vIFVwZGF0ZSBzdHlsZSBhbmQgYmluZCBldmVudHNcbiAgICB2YXIgY3lTdHlsZUFuZEV2ZW50cyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMnKTtcbiAgICBjeVN0eWxlQW5kRXZlbnRzKGxpYnMuc2JnbnZpeik7XG4gICAgXG4gICAgLy8gUmVnaXN0ZXIgdW5kby9yZWRvIGFjdGlvbnNcbiAgICB2YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9yZWdpc3Rlci11bmRvLXJlZG8tYWN0aW9ucycpO1xuICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKG9wdGlvbnMudW5kb2FibGVEcmFnKTtcbiAgICBcbiAgICB2YXIgbWFpblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzJyk7XG4gICAgdmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcycpO1xuICAgIHZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XG4gICAgXG4gICAgLy8gRXhwb3NlIHRoZSBhcGlcbiAgICBcbiAgICAvLyBFeHBvc2UgdGhlIHByb3BlcnRpZXMgaW5oZXJpdGVkIGZyb20gc2JnbnZpelxuICAgIC8vIHRoZW4gb3ZlcnJpZGUgc29tZSBvZiB0aGVzZSBwcm9wZXJ0aWVzIGFuZCBleHBvc2Ugc29tZSBuZXcgcHJvcGVydGllc1xuICAgIGZvciAodmFyIHByb3AgaW4gbGlicy5zYmdudml6KSB7XG4gICAgICBjaGlzZVtwcm9wXSA9IGxpYnMuc2JnbnZpeltwcm9wXTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXhwb3NlIGVhY2ggbWFpbiB1dGlsaXR5IHNlcGVyYXRlbHlcbiAgICBmb3IgKHZhciBwcm9wIGluIG1haW5VdGlsaXRpZXMpIHtcbiAgICAgIGNoaXNlW3Byb3BdID0gbWFpblV0aWxpdGllc1twcm9wXTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXhwb3NlIGVsZW1lbnRVdGlsaXRpZXMgYW5kIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zIGFzIGlzXG4gICAgY2hpc2UuZWxlbWVudFV0aWxpdGllcyA9IGVsZW1lbnRVdGlsaXRpZXM7XG4gICAgY2hpc2UudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcbiAgfTtcbiAgXG4gIGlmICggdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBjaGlzZTtcbiAgfVxufSkoKTsiLCJ2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyICQgPSBsaWJzLmpRdWVyeTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc2JnbnZpeikge1xuICAvL0hlbHBlcnNcbiAgXG4gIC8vIFRoaXMgZnVuY3Rpb24gaXMgdG8gYmUgY2FsbGVkIGFmdGVyIG5vZGVzIGFyZSByZXNpemVkIHRocm91aCB0aGUgbm9kZSByZXNpemUgZXh0ZW5zaW9uIG9yIHRocm91Z2ggdW5kby9yZWRvIGFjdGlvbnNcbiAgdmFyIG5vZGVSZXNpemVFbmRGdW5jdGlvbiA9IGZ1bmN0aW9uIChub2Rlcykge1xuICAgIG5vZGVzLnJlbW92ZUNsYXNzKCdjaGFuZ2VMYWJlbFRleHRTaXplJyk7XG4gICAgbm9kZXMuYWRkQ2xhc3MoJ2NoYW5nZUxhYmVsVGV4dFNpemUnKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICB2YXIgdyA9IG5vZGUud2lkdGgoKTtcbiAgICAgIHZhciBoID0gbm9kZS5oZWlnaHQoKTtcblxuICAgICAgbm9kZS5yZW1vdmVTdHlsZSgnd2lkdGgnKTtcbiAgICAgIG5vZGUucmVtb3ZlU3R5bGUoJ2hlaWdodCcpO1xuXG4gICAgICBub2RlLmRhdGEoJ2Jib3gnKS53ID0gdztcbiAgICAgIG5vZGUuZGF0YSgnYmJveCcpLmggPSBoO1xuICAgIH1cblxuICAgIG5vZGVzLnJlbW92ZUNsYXNzKCdub2RlcmVzaXplZCcpO1xuICAgIG5vZGVzLmFkZENsYXNzKCdub2RlcmVzaXplZCcpO1xuICB9O1xuICBcbiAgLy8gVXBkYXRlIGN5IHN0eWxlc2hlZXRcbiAgdmFyIHVwYXRlU3R5bGVTaGVldCA9IGZ1bmN0aW9uKCkge1xuICAgIGN5LnN0eWxlKClcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250d2VpZ2h0XVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnZm9udC13ZWlnaHQnOiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250d2VpZ2h0Jyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250ZmFtaWx5XVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnZm9udC1mYW1pbHknOiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250ZmFtaWx5Jyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250c3R5bGVdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdmb250LXN0eWxlJzogZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnZm9udHN0eWxlJyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzPSdjb21wbGV4J10sbm9kZVtjbGFzcz0nY29tcGFydG1lbnQnXSxub2RlLmNhbmNlbC1keW5hbWljLWxhYmVsLXNpemVbbGFiZWxzaXplXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnZm9udC1zaXplJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2xhYmVsc2l6ZScpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZS5yZXNpemVkXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICd3aWR0aCc6ICdkYXRhKGJib3gudyknLFxuICAgICAgJ2hlaWdodCc6ICdkYXRhKGJib3guaCknXG4gICAgfSkudXBkYXRlKCk7XG4gIH07XG4gIFxuICAvLyBCaW5kIGV2ZW50c1xuICB2YXIgYmluZEN5RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgY3kub24oXCJub2RlcmVzaXplLnJlc2l6ZWVuZFwiLCBmdW5jdGlvbiAoZXZlbnQsIHR5cGUsIG5vZGUpIHtcbiAgICAgIG5vZGVSZXNpemVFbmRGdW5jdGlvbihub2RlKTtcbiAgICB9KTtcblxuICAgIGN5Lm9uKFwiYWZ0ZXJEb1wiLCBmdW5jdGlvbiAoZXZlbnQsIGFjdGlvbk5hbWUsIGFyZ3MpIHtcbiAgICAgIGlmIChhY3Rpb25OYW1lID09PSAnY2hhbmdlUGFyZW50Jykge1xuICAgICAgICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY3kub24oXCJhZnRlclVuZG9cIiwgZnVuY3Rpb24gKGV2ZW50LCBhY3Rpb25OYW1lLCBhcmdzKSB7XG4gICAgICBpZiAoYWN0aW9uTmFtZSA9PT0gJ3Jlc2l6ZScpIHtcbiAgICAgICAgbm9kZVJlc2l6ZUVuZEZ1bmN0aW9uKGFyZ3Mubm9kZSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChhY3Rpb25OYW1lID09PSAnY2hhbmdlUGFyZW50Jykge1xuICAgICAgICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY3kub24oXCJhZnRlclJlZG9cIiwgZnVuY3Rpb24gKGV2ZW50LCBhY3Rpb25OYW1lLCBhcmdzKSB7XG4gICAgICBpZiAoYWN0aW9uTmFtZSA9PT0gJ3Jlc2l6ZScpIHtcbiAgICAgICAgbm9kZVJlc2l6ZUVuZEZ1bmN0aW9uKGFyZ3Mubm9kZSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChhY3Rpb25OYW1lID09PSAnY2hhbmdlUGFyZW50Jykge1xuICAgICAgICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICAvLyBIZWxwZXJzIEVuZFxuICBcbiAgJChkb2N1bWVudCkub24oJ3VwZGF0ZUdyYXBoRW5kJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAvLyBJbml0aWxpemUgZm9udCByZWxhdGVkIGRhdGEgb2YgdGhlIGVsZW1lbnRzIHdoaWNoIGNhbiBoYXZlIGxhYmVsXG4gICAgY3kubm9kZXMoKS5lYWNoKGZ1bmN0aW9uKGksIGVsZSkge1xuICAgICAgaWYgKGVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbChlbGUpKSB7XG4gICAgICAgIGVsZS5kYXRhKCdsYWJlbHNpemUnLCBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRMYWJlbFNpemUoZWxlLmRhdGEoJ2NsYXNzJykpKTtcbiAgICAgICAgZWxlLmRhdGEoJ2ZvbnR3ZWlnaHQnLCBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRGb250UHJvcGVydGllcy5mb250d2VpZ2h0KTtcbiAgICAgICAgZWxlLmRhdGEoJ2ZvbnRmYW1pbHknLCBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRGb250UHJvcGVydGllcy5mb250ZmFtaWx5KTtcbiAgICAgICAgZWxlLmRhdGEoJ2ZvbnRzdHlsZScsIGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdEZvbnRQcm9wZXJ0aWVzLmZvbnRzdHlsZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjeS5ub2RlcygpLmFkZENsYXNzKCdjYW5jZWwtZHluYW1pYy1sYWJlbC1zaXplJyk7IC8vIFRPRE8gdGhpbmsgb2YgYSBiZXR0ZXIgd2F5XG5cbiAgICB1cGF0ZVN0eWxlU2hlZXQoKTtcbiAgICBiaW5kQ3lFdmVudHMoKTtcbiAgfSk7XG59OyIsIi8vIEV4dGVuZHMgc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBzYmdudml6ID0gbGlicy5zYmdudml6O1xudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXM7XG52YXIgb3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpLmdldE9wdGlvbnMoKTtcblxuZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0U2l6ZXMgPSB7XG4gIFwicHJvY2Vzc1wiOiB7XG4gICAgd2lkdGg6IDMwLFxuICAgIGhlaWdodDogMzBcbiAgfSxcbiAgXCJvbWl0dGVkIHByb2Nlc3NcIjoge1xuICAgIHdpZHRoOiAzMCxcbiAgICBoZWlnaHQ6IDMwXG4gIH0sXG4gIFwidW5jZXJ0YWluIHByb2Nlc3NcIjoge1xuICAgIHdpZHRoOiAzMCxcbiAgICBoZWlnaHQ6IDMwXG4gIH0sXG4gIFwiYXNzb2NpYXRpb25wcm9jZXNzXCI6IHtcbiAgICB3aWR0aDogMzAsXG4gICAgaGVpZ2h0OiAzMFxuICB9LFxuICBcImFzc29jaWF0aW9uXCI6IHtcbiAgICB3aWR0aDogMzAsXG4gICAgaGVpZ2h0OiAzMFxuICB9LFxuICBcImRpc3NvY2lhdGlvblwiOiB7XG4gICAgd2lkdGg6IDMwLFxuICAgIGhlaWdodDogMzBcbiAgfSxcbiAgXCJtYWNyb21vbGVjdWxlXCI6IHtcbiAgICB3aWR0aDogMTAwLFxuICAgIGhlaWdodDogNTBcbiAgfSxcbiAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7XG4gICAgd2lkdGg6IDEwMCxcbiAgICBoZWlnaHQ6IDUwXG4gIH0sXG4gIFwicGhlbm90eXBlXCI6IHtcbiAgICB3aWR0aDogMTAwLFxuICAgIGhlaWdodDogNTBcbiAgfSxcbiAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjoge1xuICAgIHdpZHRoOiAxMDAsXG4gICAgaGVpZ2h0OiA1MFxuICB9LFxuICBcInBlcnR1cmJpbmcgYWdlbnRcIjoge1xuICAgIHdpZHRoOiAxMDAsXG4gICAgaGVpZ2h0OiA1MFxuICB9LFxuICBcImNvbXBsZXhcIjoge1xuICAgIHdpZHRoOiAxMDAsXG4gICAgaGVpZ2h0OiAxMDBcbiAgfSxcbiAgXCJjb21wYXJ0bWVudFwiOiB7XG4gICAgd2lkdGg6IDEwMCxcbiAgICBoZWlnaHQ6IDEwMFxuICB9XG59O1xuXG5lbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRGb250UHJvcGVydGllcyA9IHtcbiAgZm9udGZhbWlseTogJ0hlbHZldGljYScsXG4gIGZvbnR3ZWlnaHQ6ICdub3JtYWwnLFxuICBmb250c3R5bGU6ICdub3JtYWwnXG59O1xuXG5lbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRMYWJlbFNpemUgPSBmdW5jdGlvbiAoc2JnbmNsYXNzKSB7XG4gIGlmICghZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkxhYmVsKHNiZ25jbGFzcykpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGVsc2UgaWYgKHNiZ25jbGFzcyA9PT0gJ2NvbXBsZXgnIHx8IHNiZ25jbGFzcyA9PT0gJ2NvbXBhcnRtZW50Jykge1xuICAgIHJldHVybiAxNjtcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4gMjA7XG4gIH1cbn07XG5cbi8vIFNlY3Rpb24gU3RhcnRcbi8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXG5cbmVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSA9IGZ1bmN0aW9uICh4LCB5LCBzYmduY2xhc3MsIHBhcmVudCwgdmlzaWJpbGl0eSkge1xuICB2YXIgZGVmYXVsdFNpemVzID0gdGhpcy5kZWZhdWx0U2l6ZXM7XG4gIHZhciBkZWZhdWx0cyA9IGRlZmF1bHRTaXplc1tzYmduY2xhc3NdO1xuXG4gIHZhciB3aWR0aCA9IGRlZmF1bHRzID8gZGVmYXVsdHMud2lkdGggOiA1MDtcbiAgdmFyIGhlaWdodCA9IGRlZmF1bHRzID8gZGVmYXVsdHMuaGVpZ2h0IDogNTA7XG5cblxuXG4gIHZhciBjc3MgPSBkZWZhdWx0cyA/IHtcbiAgICAnYm9yZGVyLXdpZHRoJzogZGVmYXVsdHNbJ2JvcmRlci13aWR0aCddLFxuLy8gICAgICAnYm9yZGVyLWNvbG9yJzogZGVmYXVsdHNbJ2JvcmRlci1jb2xvciddLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogZGVmYXVsdHNbJ2JhY2tncm91bmQtY29sb3InXSxcbi8vICAgICAgJ2ZvbnQtc2l6ZSc6IGRlZmF1bHRzWydmb250LXNpemUnXSxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogZGVmYXVsdHNbJ2JhY2tncm91bmQtb3BhY2l0eSddXG4gIH0gOiB7fTtcblxuICBpZiAodmlzaWJpbGl0eSkge1xuICAgIGNzcy52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcbiAgfVxuXG4gIGlmIChkZWZhdWx0cyAmJiBkZWZhdWx0cy5tdWx0aW1lcikge1xuICAgIHNiZ25jbGFzcyArPSBcIiBtdWx0aW1lclwiO1xuICB9XG4gIHZhciBkYXRhID0ge1xuICAgIGNsYXNzOiBzYmduY2xhc3MsXG4gICAgYmJveDoge1xuICAgICAgaDogaGVpZ2h0LFxuICAgICAgdzogd2lkdGgsXG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH0sXG4gICAgc3RhdGVzYW5kaW5mb3M6IFtdLFxuICAgIHBvcnRzOiBbXSxcbiAgICBsYWJlbHNpemU6IGVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbChzYmduY2xhc3MpID8gKGRlZmF1bHRzICYmIGRlZmF1bHRzLmxhYmVsc2l6ZSkgfHwgdGhpcy5nZXREZWZhdWx0TGFiZWxTaXplKHNiZ25jbGFzcykgOiB1bmRlZmluZWQsXG4gICAgZm9udGZhbWlseTogZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkxhYmVsKHNiZ25jbGFzcykgPyAoZGVmYXVsdHMgJiYgZGVmYXVsdHMuZm9udGZhbWlseSkgfHwgdGhpcy5kZWZhdWx0Rm9udFByb3BlcnRpZXMuZm9udGZhbWlseSA6IHVuZGVmaW5lZCxcbiAgICBmb250d2VpZ2h0OiBlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOTGFiZWwoc2JnbmNsYXNzKSA/IChkZWZhdWx0cyAmJiBkZWZhdWx0cy5mb250d2VpZ2h0KSB8fCB0aGlzLmRlZmF1bHRGb250UHJvcGVydGllcy5mb250d2VpZ2h0IDogdW5kZWZpbmVkLFxuICAgIGZvbnRzdHlsZTogZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkxhYmVsKHNiZ25jbGFzcykgPyAoZGVmYXVsdHMgJiYgZGVmYXVsdHMuZm9udHN0eWxlKSB8fCB0aGlzLmRlZmF1bHRGb250UHJvcGVydGllcy5mb250c3R5bGUgOiB1bmRlZmluZWRcbiAgfTtcblxuICBpZiAocGFyZW50KSB7XG4gICAgZGF0YS5wYXJlbnQgPSBwYXJlbnQ7XG4gIH1cblxuICB2YXIgZWxlcyA9IGN5LmFkZCh7XG4gICAgZ3JvdXA6IFwibm9kZXNcIixcbiAgICBkYXRhOiBkYXRhLFxuICAgIGNzczogY3NzLFxuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH1cbiAgfSk7XG5cbiAgdmFyIG5ld05vZGUgPSBlbGVzW2VsZXMubGVuZ3RoIC0gMV07XG4gIGlmIChkZWZhdWx0cyAmJiBkZWZhdWx0c1snYm9yZGVyLWNvbG9yJ10pIHtcbiAgICBuZXdOb2RlLmRhdGEoJ2JvcmRlckNvbG9yJywgZGVmYXVsdHNbJ2JvcmRlci1jb2xvciddKTtcbiAgfVxuICBlbHNlIHtcbiAgICBuZXdOb2RlLmRhdGEoJ2JvcmRlckNvbG9yJywgbmV3Tm9kZS5jc3MoJ2JvcmRlci1jb2xvcicpKTtcbiAgfVxuICBpZiAoZGVmYXVsdHMgJiYgZGVmYXVsdHNbJ2Nsb25lbWFya2VyJ10pIHtcbiAgICBuZXdOb2RlLl9wcml2YXRlLmRhdGEuY2xvbmVtYXJrZXIgPSBkZWZhdWx0cy5jbG9uZW1hcmtlcjtcbiAgfVxuXG4gIG5ld05vZGUuYWRkQ2xhc3MoJ2NoYW5nZUJvcmRlckNvbG9yJyk7XG4gIG5ld05vZGUuYWRkQ2xhc3MoJ2NoYW5nZUJhY2tncm91bmRPcGFjaXR5Jyk7XG5cbiAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcbiAgcmV0dXJuIG5ld05vZGU7XG59O1xuXG5lbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UgPSBmdW5jdGlvbiAoc291cmNlLCB0YXJnZXQsIHNiZ25jbGFzcywgdmlzaWJpbGl0eSkge1xuICB2YXIgZGVmYXVsdFNpemVzID0gdGhpcy5kZWZhdWx0U2l6ZXM7XG4gIHZhciBkZWZhdWx0cyA9IGRlZmF1bHRTaXplc1tzYmduY2xhc3NdO1xuICB2YXIgY3NzID0gZGVmYXVsdHMgPyB7XG4gICAgJ3dpZHRoJzogZGVmYXVsdHNbJ3dpZHRoJ11cbiAgfSA6IHt9O1xuXG4gIGlmICh2aXNpYmlsaXR5KSB7XG4gICAgY3NzLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xuICB9XG5cbiAgdmFyIGVsZXMgPSBjeS5hZGQoe1xuICAgIGdyb3VwOiBcImVkZ2VzXCIsXG4gICAgZGF0YToge1xuICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgIGNsYXNzOiBzYmduY2xhc3NcbiAgICB9LFxuICAgIGNzczogY3NzXG4gIH0pO1xuXG4gIHZhciBuZXdFZGdlID0gZWxlc1tlbGVzLmxlbmd0aCAtIDFdO1xuICBpZiAoZGVmYXVsdHMgJiYgZGVmYXVsdHNbJ2xpbmUtY29sb3InXSkge1xuICAgIG5ld0VkZ2UuZGF0YSgnbGluZUNvbG9yJywgZGVmYXVsdHNbJ2xpbmUtY29sb3InXSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgbmV3RWRnZS5kYXRhKCdsaW5lQ29sb3InLCBuZXdFZGdlLmNzcygnbGluZS1jb2xvcicpKTtcbiAgfVxuICBuZXdFZGdlLmFkZENsYXNzKCdjaGFuZ2VMaW5lQ29sb3InKTtcbiAgcmV0dXJuIG5ld0VkZ2U7XG59O1xuXG4vKlxuICogVGhpcyBtZXRob2QgYXNzdW1lcyB0aGF0IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQgY29udGFpbnMgYXQgbGVhc3Qgb25lIG5vZGVcbiAqIGFuZCBhbGwgb2YgdGhlIG5vZGVzIGluY2x1ZGluZyBpbiBpdCBoYXZlIHRoZSBzYW1lIHBhcmVudC4gSXQgY3JlYXRlcyBhIGNvbXBvdW5kIGZvdCB0aGUgZ2l2ZW4gbm9kZXMgYW4gaGF2aW5nIHRoZSBnaXZlbiB0eXBlLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChub2Rlc1RvTWFrZUNvbXBvdW5kLCBjb21wb3VuZFR5cGUpIHtcbiAgdmFyIG9sZFBhcmVudElkID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwicGFyZW50XCIpO1xuICAvLyBUaGUgcGFyZW50IG9mIG5ldyBjb21wb3VuZCB3aWxsIGJlIHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kXG4gIHZhciBuZXdDb21wb3VuZCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29tcG91bmRUeXBlLCBvbGRQYXJlbnRJZCk7XG4gIHZhciBuZXdDb21wb3VuZElkID0gbmV3Q29tcG91bmQuaWQoKTtcbiAgbm9kZXNUb01ha2VDb21wb3VuZC5tb3ZlKHtwYXJlbnQ6IG5ld0NvbXBvdW5kSWR9KTtcbiAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcbiAgcmV0dXJuIG5ld0NvbXBvdW5kO1xufTtcblxuLypcbiAqIFJlbW92ZXMgYSBjb21wb3VuZC4gQmVmb3JlIHRoZSByZW1vdmFsIG9wZXJhdGlvbiBtb3ZlcyB0aGUgY2hpbGRyZW4gb2YgdGhhdCBjb21wb3VuZCB0byB0aGUgcGFyZW50IG9mIHRoZSBjb21wb3VuZC5cbiAqIFJldHVybnMgb2xkIGNoaWxkcmVuIG9mIHRoZSBjb21wb3VuZCB3aGljaCBhcmUgbW92ZWQgdG8gYW5vdGhlciBwYXJlbnQgYW5kIHRoZSByZW1vdmVkIGNvbXBvdW5kIHRvIHJlc3RvcmUgYmFjayBsYXRlci5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5yZW1vdmVDb21wb3VuZCA9IGZ1bmN0aW9uIChjb21wb3VuZFRvUmVtb3ZlKSB7XG4gIHZhciBjb21wb3VuZElkID0gY29tcG91bmRUb1JlbW92ZS5pZCgpO1xuICB2YXIgbmV3UGFyZW50SWQgPSBjb21wb3VuZFRvUmVtb3ZlLmRhdGEoXCJwYXJlbnRcIik7XG4gIG5ld1BhcmVudElkID0gbmV3UGFyZW50SWQgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBuZXdQYXJlbnRJZDtcbiAgdmFyIGNoaWxkcmVuT2ZDb21wb3VuZCA9IGNvbXBvdW5kVG9SZW1vdmUuY2hpbGRyZW4oKTtcblxuICBjaGlsZHJlbk9mQ29tcG91bmQubW92ZSh7cGFyZW50OiBuZXdQYXJlbnRJZH0pO1xuICB2YXIgcmVtb3ZlZENvbXBvdW5kID0gY29tcG91bmRUb1JlbW92ZS5yZW1vdmUoKTtcbiAgXG4gIHJldHVybiB7XG4gICAgY2hpbGRyZW5PZkNvbXBvdW5kOiBjaGlsZHJlbk9mQ29tcG91bmQsXG4gICAgcmVtb3ZlZENvbXBvdW5kOiByZW1vdmVkQ29tcG91bmRcbiAgfTtcbn07XG5cbi8qXG4gKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcbiAqIGluIHRoZSBjb21wbGV4LiBQYXJhbWV0ZXJzIGFyZSBleHBsYWluZWQgYmVsb3cuXG4gKiB0ZW1wbGF0ZVR5cGU6IFRoZSB0eXBlIG9mIHRoZSB0ZW1wbGF0ZSByZWFjdGlvbi4gSXQgbWF5IGJlICdhc3NvY2lhdGlvbicgb3IgJ2Rpc3NvY2lhdGlvbicgZm9yIG5vdy5cbiAqIG1hY3JvbW9sZWN1bGVMaXN0OiBUaGUgbGlzdCBvZiB0aGUgbmFtZXMgb2YgbWFjcm9tb2xlY3VsZXMgd2hpY2ggd2lsbCBpbnZvbHZlIGluIHRoZSByZWFjdGlvbi5cbiAqIGNvbXBsZXhOYW1lOiBUaGUgbmFtZSBvZiB0aGUgY29tcGxleCBpbiB0aGUgcmVhY3Rpb24uXG4gKiBwcm9jZXNzUG9zaXRpb246IFRoZSBtb2RhbCBwb3NpdGlvbiBvZiB0aGUgcHJvY2VzcyBpbiB0aGUgcmVhY3Rpb24uIFRoZSBkZWZhdWx0IHZhbHVlIGlzIHRoZSBjZW50ZXIgb2YgdGhlIGNhbnZhcy5cbiAqIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cbiAqIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiBUaGlzIG9wdGlvbiB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY29zZS1iaWxrZW50IGxheW91dCB3aXRoIHRoZSBzYW1lIG5hbWUuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDE1LlxuICogZWRnZUxlbmd0aDogVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSBtYWNyb21vbGVjdWxlcyBhdCB0aGUgYm90aCBzaWRlcy5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHRlbXBsYXRlVHlwZSwgbWFjcm9tb2xlY3VsZUxpc3QsIGNvbXBsZXhOYW1lLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgpIHtcbiAgdmFyIGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0U2l6ZXNbXCJtYWNyb21vbGVjdWxlXCJdO1xuICB2YXIgdGVtcGxhdGVUeXBlID0gdGVtcGxhdGVUeXBlO1xuICB2YXIgcHJvY2Vzc1dpZHRoID0gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0U2l6ZXNbdGVtcGxhdGVUeXBlXSA/IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFNpemVzW3RlbXBsYXRlVHlwZV0ud2lkdGggOiA1MDtcbiAgdmFyIG1hY3JvbW9sZWN1bGVXaWR0aCA9IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID8gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMud2lkdGggOiA1MDtcbiAgdmFyIG1hY3JvbW9sZWN1bGVIZWlnaHQgPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA/IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLmhlaWdodCA6IDUwO1xuICB2YXIgcHJvY2Vzc1Bvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uID8gcHJvY2Vzc1Bvc2l0aW9uIDogZWxlbWVudFV0aWxpdGllcy5jb252ZXJ0VG9Nb2RlbFBvc2l0aW9uKHt4OiBjeS53aWR0aCgpIC8gMiwgeTogY3kuaGVpZ2h0KCkgLyAyfSk7XG4gIHZhciBtYWNyb21vbGVjdWxlTGlzdCA9IG1hY3JvbW9sZWN1bGVMaXN0O1xuICB2YXIgY29tcGxleE5hbWUgPSBjb21wbGV4TmFtZTtcbiAgdmFyIG51bU9mTWFjcm9tb2xlY3VsZXMgPSBtYWNyb21vbGVjdWxlTGlzdC5sZW5ndGg7XG4gIHZhciB0aWxpbmdQYWRkaW5nVmVydGljYWwgPSB0aWxpbmdQYWRkaW5nVmVydGljYWwgPyB0aWxpbmdQYWRkaW5nVmVydGljYWwgOiAxNTtcbiAgdmFyIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID0gdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPyB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA6IDE1O1xuICB2YXIgZWRnZUxlbmd0aCA9IGVkZ2VMZW5ndGggPyBlZGdlTGVuZ3RoIDogNjA7XG5cbiAgdmFyIHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzO1xuICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XG4gICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgfVxuICBlbHNlIHtcbiAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xuICB9XG5cbiAgLy9DcmVhdGUgdGhlIHByb2Nlc3MgaW4gdGVtcGxhdGUgdHlwZVxuICB2YXIgcHJvY2VzcyA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksIHRlbXBsYXRlVHlwZSk7XG4gIHByb2Nlc3MuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgLy9EZWZpbmUgdGhlIHN0YXJ0aW5nIHkgcG9zaXRpb25cbiAgdmFyIHlQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi55IC0gKChudW1PZk1hY3JvbW9sZWN1bGVzIC0gMSkgLyAyKSAqIChtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsKTtcblxuICAvL0NyZWF0ZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mTWFjcm9tb2xlY3VsZXM7IGkrKykge1xuICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzLCB5UG9zaXRpb24sIFwibWFjcm9tb2xlY3VsZVwiKTtcbiAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgIG5ld05vZGUuZGF0YSgnbGFiZWwnLCBtYWNyb21vbGVjdWxlTGlzdFtpXSk7XG5cbiAgICAvL2NyZWF0ZSB0aGUgZWRnZSBjb25uZWN0ZWQgdG8gdGhlIG5ldyBtYWNyb21vbGVjdWxlXG4gICAgdmFyIG5ld0VkZ2U7XG4gICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdOb2RlLmlkKCksIHByb2Nlc3MuaWQoKSwgJ2NvbnN1bXB0aW9uJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIG5ld05vZGUuaWQoKSwgJ3Byb2R1Y3Rpb24nKTtcbiAgICB9XG5cbiAgICBuZXdFZGdlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgLy91cGRhdGUgdGhlIHkgcG9zaXRpb25cbiAgICB5UG9zaXRpb24gKz0gbWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDtcbiAgfVxuXG4gIC8vQ3JlYXRlIHRoZSBjb21wbGV4IGluY2x1ZGluZyBtYWNyb21vbGVjdWxlcyBpbnNpZGUgb2YgaXRcbiAgLy9UZW1wcm9yYXJpbHkgYWRkIGl0IHRvIHRoZSBwcm9jZXNzIHBvc2l0aW9uIHdlIHdpbGwgbW92ZSBpdCBhY2NvcmRpbmcgdG8gdGhlIGxhc3Qgc2l6ZSBvZiBpdFxuICB2YXIgY29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksICdjb21wbGV4Jyk7XG4gIGNvbXBsZXguZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gIGNvbXBsZXguZGF0YSgnanVzdEFkZGVkTGF5b3V0Tm9kZScsIHRydWUpO1xuXG4gIC8vSWYgYSBuYW1lIGlzIHNwZWNpZmllZCBmb3IgdGhlIGNvbXBsZXggc2V0IGl0cyBsYWJlbCBhY2NvcmRpbmdseVxuICBpZiAoY29tcGxleE5hbWUpIHtcbiAgICBjb21wbGV4LmRhdGEoJ2xhYmVsJywgY29tcGxleE5hbWUpO1xuICB9XG5cbiAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubm5lY3RlZCB0byB0aGUgY29tcGxleFxuICB2YXIgZWRnZU9mQ29tcGxleDtcbiAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgIGVkZ2VPZkNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBjb21wbGV4LmlkKCksICdwcm9kdWN0aW9uJyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWRnZU9mQ29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShjb21wbGV4LmlkKCksIHByb2Nlc3MuaWQoKSwgJ2NvbnN1bXB0aW9uJyk7XG4gIH1cbiAgZWRnZU9mQ29tcGxleC5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAvL0NyZWF0ZSB0aGUgbWFjcm9tb2xlY3VsZXMgaW5zaWRlIHRoZSBjb21wbGV4XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtT2ZNYWNyb21vbGVjdWxlczsgaSsrKSB7XG4gICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoY29tcGxleC5wb3NpdGlvbigneCcpLCBjb21wbGV4LnBvc2l0aW9uKCd5JyksIFwibWFjcm9tb2xlY3VsZVwiLCBjb21wbGV4LmlkKCkpO1xuICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgbmV3Tm9kZS5kYXRhKCdsYWJlbCcsIG1hY3JvbW9sZWN1bGVMaXN0W2ldKTtcbiAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcbiAgfVxuXG4gIHZhciBsYXlvdXROb2RlcyA9IGN5Lm5vZGVzKCdbanVzdEFkZGVkTGF5b3V0Tm9kZV0nKTtcbiAgbGF5b3V0Tm9kZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkTGF5b3V0Tm9kZScpO1xuICBsYXlvdXROb2Rlcy5sYXlvdXQoe1xuICAgIG5hbWU6ICdjb3NlLWJpbGtlbnQnLFxuICAgIHJhbmRvbWl6ZTogZmFsc2UsXG4gICAgZml0OiBmYWxzZSxcbiAgICBhbmltYXRlOiBmYWxzZSxcbiAgICB0aWxpbmdQYWRkaW5nVmVydGljYWw6IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCxcbiAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXG4gICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgLy9yZS1wb3NpdGlvbiB0aGUgbm9kZXMgaW5zaWRlIHRoZSBjb21wbGV4XG4gICAgICB2YXIgc3VwcG9zZWRYUG9zaXRpb247XG4gICAgICB2YXIgc3VwcG9zZWRZUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueTtcblxuICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgICAgICBzdXBwb3NlZFhQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBjb21wbGV4Lm91dGVyV2lkdGgoKSAvIDI7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc3VwcG9zZWRYUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gY29tcGxleC5vdXRlcldpZHRoKCkgLyAyO1xuICAgICAgfVxuXG4gICAgICB2YXIgcG9zaXRpb25EaWZmWCA9IHN1cHBvc2VkWFBvc2l0aW9uIC0gY29tcGxleC5wb3NpdGlvbigneCcpO1xuICAgICAgdmFyIHBvc2l0aW9uRGlmZlkgPSBzdXBwb3NlZFlQb3NpdGlvbiAtIGNvbXBsZXgucG9zaXRpb24oJ3knKTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NpdGlvbkRpZmZYLCB5OiBwb3NpdGlvbkRpZmZZfSwgY29tcGxleCk7XG4gICAgfVxuICB9KTtcblxuICAvL2ZpbHRlciB0aGUganVzdCBhZGRlZCBlbGVtZW10cyB0byByZXR1cm4gdGhlbSBhbmQgcmVtb3ZlIGp1c3QgYWRkZWQgbWFya1xuICB2YXIgZWxlcyA9IGN5LmVsZW1lbnRzKCdbanVzdEFkZGVkXScpO1xuICBlbGVzLnJlbW92ZURhdGEoJ2p1c3RBZGRlZCcpO1xuICBcbiAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcbiAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICBlbGVzLnNlbGVjdCgpO1xuICBcbiAgcmV0dXJuIGVsZXM7IC8vIFJldHVybiB0aGUganVzdCBhZGRlZCBlbGVtZW50c1xufTtcblxuLy8gUmVzaXplIGdpdmVuIG5vZGVzIGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeSBvbmUgb2Ygd2lkdGggb3IgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0LlxuZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uIChub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8pIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIHJhdGlvID0gdW5kZWZpbmVkO1xuICAgIHZhciBlbGVNdXN0QmVTcXVhcmUgPSBlbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZShub2RlLmRhdGEoJ2NsYXNzJykpO1xuXG4gICAgLy8gTm90ZSB0aGF0IGJvdGggd2lkdGggYW5kIGhlaWdodCBzaG91bGQgbm90IGJlIHNldCBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHlcbiAgICBpZiAod2lkdGgpIHtcbiAgICAgIGlmICh1c2VBc3BlY3RSYXRpbyB8fCBlbGVNdXN0QmVTcXVhcmUpIHtcbiAgICAgICAgcmF0aW8gPSB3aWR0aCAvIG5vZGUud2lkdGgoKTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gd2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKGhlaWdodCkge1xuICAgICAgaWYgKHVzZUFzcGVjdFJhdGlvIHx8IGVsZU11c3RCZVNxdWFyZSkge1xuICAgICAgICByYXRpbyA9IGhlaWdodCAvIG5vZGUuaGVpZ2h0KCk7XG4gICAgICB9XG5cbiAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IGhlaWdodDtcbiAgICB9XG5cbiAgICBpZiAocmF0aW8gJiYgIWhlaWdodCkge1xuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gbm9kZS5oZWlnaHQoKSAqIHJhdGlvO1xuICAgIH1cbiAgICBlbHNlIGlmIChyYXRpbyAmJiAhd2lkdGgpIHtcbiAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IG5vZGUud2lkdGgoKSAqIHJhdGlvO1xuICAgIH1cblxuICAgIG5vZGUucmVtb3ZlQ2xhc3MoJ25vZGVyZXNpemVkJyk7XG4gICAgbm9kZS5hZGRDbGFzcygnbm9kZXJlc2l6ZWQnKTtcbiAgfVxufTtcblxuLy8gU2VjdGlvbiBFbmRcbi8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXG5cbi8vIFNlY3Rpb24gU3RhcnRcbi8vIENvbW1vbiBlbGVtZW50IHByb3BlcnRpZXNcblxuLy8gR2V0IGNvbW1vbiBwcm9wZXJ0aWVzIG9mIGdpdmVuIGVsZW1lbnRzLiBSZXR1cm5zIG51bGwgaWYgdGhlIGdpdmVuIGVsZW1lbnQgbGlzdCBpcyBlbXB0eSBvciB0aGVcbi8vIHByb3BlcnR5IGlzIG5vdCBjb21tb24gZm9yIGFsbCBlbGVtZW50cy4gZGF0YU9yQ3NzIHBhcmFtZXRlciBzcGVjaWZ5IHdoZXRoZXIgdG8gY2hlY2sgdGhlIHByb3BlcnR5IG9uIGRhdGEgb3IgY3NzLlxuLy8gVGhlIGRlZmF1bHQgdmFsdWUgZm9yIGl0IGlzIGRhdGEuIElmIHByb3BlcnR5TmFtZSBwYXJhbWV0ZXIgaXMgZ2l2ZW4gYXMgYSBmdW5jdGlvbiBpbnN0ZWFkIG9mIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgXG4vLyBwcm9wZXJ0eSBuYW1lIHRoZW4gdXNlIHdoYXQgdGhhdCBmdW5jdGlvbiByZXR1cm5zLlxuZWxlbWVudFV0aWxpdGllcy5nZXRDb21tb25Qcm9wZXJ0eSA9IGZ1bmN0aW9uIChlbGVtZW50cywgcHJvcGVydHlOYW1lLCBkYXRhT3JDc3MpIHtcbiAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgaXNGdW5jdGlvbjtcbiAgLy8gSWYgd2UgYXJlIG5vdCBjb21wYXJpbmcgdGhlIHByb3BlcnRpZXMgZGlyZWN0bHkgdXNlcnMgY2FuIHNwZWNpZnkgYSBmdW5jdGlvbiBhcyB3ZWxsXG4gIGlmICh0eXBlb2YgcHJvcGVydHlOYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaXNGdW5jdGlvbiA9IHRydWU7XG4gIH1cblxuICAvLyBVc2UgZGF0YSBhcyBkZWZhdWx0XG4gIGlmICghaXNGdW5jdGlvbiAmJiAhZGF0YU9yQ3NzKSB7XG4gICAgZGF0YU9yQ3NzID0gJ2RhdGEnO1xuICB9XG5cbiAgdmFyIHZhbHVlID0gaXNGdW5jdGlvbiA/IHByb3BlcnR5TmFtZShlbGVtZW50c1swXSkgOiBlbGVtZW50c1swXVtkYXRhT3JDc3NdKHByb3BlcnR5TmFtZSk7XG5cbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpc0Z1bmN0aW9uID8gcHJvcGVydHlOYW1lKGVsZW1lbnRzW2ldKSA6IGVsZW1lbnRzW2ldW2RhdGFPckNzc10ocHJvcGVydHlOYW1lKSAhPSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuLy8gUmV0dXJucyBpZiB0aGUgZnVuY3Rpb24gcmV0dXJucyBhIHRydXRoeSB2YWx1ZSBmb3IgYWxsIG9mIHRoZSBnaXZlbiBlbGVtZW50cy5cbmVsZW1lbnRVdGlsaXRpZXMudHJ1ZUZvckFsbEVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZW1lbnRzLCBmY24pIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGlmICghZmNuKGVsZW1lbnRzW2ldKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgY2FuIGhhdmUgc2JnbmNhcmRpbmFsaXR5XG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOQ2FyZGluYWxpdHkgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuXG4gIHJldHVybiBlbGUuZGF0YSgnY2xhc3MnKSA9PSAnY29uc3VtcHRpb24nIHx8IGVsZS5kYXRhKCdjbGFzcycpID09ICdwcm9kdWN0aW9uJztcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZSBlbGVtZW50IGNhbiBoYXZlIHNiZ25sYWJlbFxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkxhYmVsID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICByZXR1cm4gc2JnbmNsYXNzICE9ICdhbmQnICYmIHNiZ25jbGFzcyAhPSAnb3InICYmIHNiZ25jbGFzcyAhPSAnbm90J1xuICAgICAgICAgICYmIHNiZ25jbGFzcyAhPSAnYXNzb2NpYXRpb24nICYmIHNiZ25jbGFzcyAhPSAnZGlzc29jaWF0aW9uJyAmJiAhc2JnbmNsYXNzLmVuZHNXaXRoKCdwcm9jZXNzJyk7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBoYXZlIHVuaXQgb2YgaW5mb3JtYXRpb25cbmVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVVuaXRPZkluZm9ybWF0aW9uID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICBpZiAoc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCcgfHwgc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwgbXVsdGltZXInXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlIG11bHRpbWVyJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCBtdWx0aW1lcicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBoYXZlIHN0YXRlIHZhcmlhYmxlXG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTdGF0ZVZhcmlhYmxlID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICBpZiAoc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUgbXVsdGltZXInIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUgbXVsdGltZXInXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4IG11bHRpbWVyJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlIHNob3VsZCBiZSBzcXVhcmUgaW4gc2hhcGVcbmVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICByZXR1cm4gKHNiZ25jbGFzcy5pbmRleE9mKCdwcm9jZXNzJykgIT0gLTEgfHwgc2JnbmNsYXNzID09ICdzb3VyY2UgYW5kIHNpbmsnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdhbmQnIHx8IHNiZ25jbGFzcyA9PSAnb3InIHx8IHNiZ25jbGFzcyA9PSAnbm90J1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYXNzb2NpYXRpb24nIHx8IHNiZ25jbGFzcyA9PSAnZGlzc29jaWF0aW9uJyk7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgYW55IG9mIHRoZSBnaXZlbiBub2RlcyBtdXN0IG5vdCBiZSBpbiBzcXVhcmUgc2hhcGVcbmVsZW1lbnRVdGlsaXRpZXMuc29tZU11c3ROb3RCZVNxdWFyZSA9IGZ1bmN0aW9uIChub2Rlcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlKG5vZGUuZGF0YSgnY2xhc3MnKSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZXMgZWxlbWVudCBjYW4gYmUgY2xvbmVkXG5lbGVtZW50VXRpbGl0aWVzLmNhbkJlQ2xvbmVkID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XG5cbiAgdmFyIGxpc3QgPSB7XG4gICAgJ3Vuc3BlY2lmaWVkIGVudGl0eSc6IHRydWUsXG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxuICAgICdjb21wbGV4JzogdHJ1ZSxcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxuICAgICdwZXJ0dXJiaW5nIGFnZW50JzogdHJ1ZVxuICB9O1xuXG4gIHJldHVybiBsaXN0W3NiZ25jbGFzc10gPyB0cnVlIDogZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVzIGVsZW1lbnQgY2FuIGJlIGNsb25lZFxuZWxlbWVudFV0aWxpdGllcy5jYW5CZU11bHRpbWVyID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XG5cbiAgdmFyIGxpc3QgPSB7XG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxuICAgICdjb21wbGV4JzogdHJ1ZSxcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlXG4gIH07XG5cbiAgcmV0dXJuIGxpc3Rbc2JnbmNsYXNzXSA/IHRydWUgOiBmYWxzZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhbiBFUE5cbmVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuXG4gIHJldHVybiAoc2JnbmNsYXNzID09ICd1bnNwZWNpZmllZCBlbnRpdHknXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4Jyk7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgaXMgYSBQTlxuZWxlbWVudFV0aWxpdGllcy5pc1BOQ2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcblxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAncHJvY2VzcydcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcydcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ3VuY2VydGFpbiBwcm9jZXNzJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYXNzb2NpYXRpb24nXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdkaXNzb2NpYXRpb24nXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdwaGVub3R5cGUnKTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhIGxvZ2ljYWwgb3BlcmF0b3JcbmVsZW1lbnRVdGlsaXRpZXMuaXNMb2dpY2FsT3BlcmF0b3IgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAnYW5kJyB8fCBzYmduY2xhc3MgPT0gJ29yJyB8fCBzYmduY2xhc3MgPT0gJ25vdCcpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBjbGFzcyBvZiBnaXZlbiBlbGVtZW50IGlzIGEgZXF1aXZhbGFuY2UgY2xhc3NcbmVsZW1lbnRVdGlsaXRpZXMuY29udmVuaWVudFRvRXF1aXZhbGVuY2UgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAndGFnJyB8fCBzYmduY2xhc3MgPT0gJ3Rlcm1pbmFsJyk7XG59O1xuXG4vLyBSZWxvY2F0ZXMgc3RhdGUgYW5kIGluZm8gYm94ZXMuIFRoaXMgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gYmUgY2FsbGVkIGFmdGVyIGFkZC9yZW1vdmUgc3RhdGUgYW5kIGluZm8gYm94ZXNcbmVsZW1lbnRVdGlsaXRpZXMucmVsb2NhdGVTdGF0ZUFuZEluZm9zID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc3RhdGVBbmRJbmZvcyA9IChlbGUuaXNOb2RlICYmIGVsZS5pc05vZGUoKSkgPyBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKSA6IGVsZTtcbiAgdmFyIGxlbmd0aCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoO1xuICBpZiAobGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxzZSBpZiAobGVuZ3RoID09IDEpIHtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XG4gIH1cbiAgZWxzZSBpZiAobGVuZ3RoID09IDIpIHtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XG5cbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDA7XG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSA1MDtcbiAgfVxuICBlbHNlIGlmIChsZW5ndGggPT0gMykge1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAyNTtcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IC01MDtcblxuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gMDtcbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xuICB9XG4gIGVsc2Uge1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAyNTtcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IC01MDtcblxuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gLTI1O1xuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC55ID0gNTA7XG5cbiAgICBzdGF0ZUFuZEluZm9zWzNdLmJib3gueCA9IDI1O1xuICAgIHN0YXRlQW5kSW5mb3NbM10uYmJveC55ID0gNTA7XG4gIH1cbn07XG5cbi8vIENoYW5nZSBzdGF0ZSB2YWx1ZSBvciB1bml0IG9mIGluZm9ybWF0aW9uIGJveCBvZiBnaXZlbiBub2RlcyB3aXRoIGdpdmVuIGluZGV4LlxuLy8gVHlwZSBwYXJhbWV0ZXIgaW5kaWNhdGVzIHdoZXRoZXIgdG8gY2hhbmdlIHZhbHVlIG9yIHZhcmlhYmxlLCBpdCBpcyB2YWxpZCBpZiB0aGUgYm94IGF0IHRoZSBnaXZlbiBpbmRleCBpcyBhIHN0YXRlIHZhcmlhYmxlLlxuLy8gVmFsdWUgcGFyYW1ldGVyIGlzIHRoZSBuZXcgdmFsdWUgdG8gc2V0LlxuLy8gVGhpcyBtZXRob2QgdGhlIG9sZCB2YWx1ZSBvZiB0aGUgY2hhbmdlZCBkYXRhIChXZSBhc3N1bWUgdGhhdCB0aGUgb2xkIHZhbHVlIG9mIHRoZSBjaGFuZ2VkIGRhdGEgd2FzIHRoZSBzYW1lIGZvciBhbGwgbm9kZXMpLlxuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XG4gIHZhciByZXN1bHQ7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZWFuZGluZm9zJyk7XG4gICAgdmFyIGJveCA9IHN0YXRlQW5kSW5mb3NbaV07XG5cbiAgICBpZiAoYm94LmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikge1xuICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgcmVzdWx0ID0gYm94LnN0YXRlW3R5cGVdO1xuICAgICAgfVxuXG4gICAgICBib3guc3RhdGVbdHlwZV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoc3RhdGUuY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdCA9IGJveC5sYWJlbC50ZXh0O1xuICAgICAgfVxuXG4gICAgICBib3gubGFiZWwudGV4dCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXG4vLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxuLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGp1c3QgYWRkZWQgYm94LlxuZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2Rlcywgb2JqKSB7XG4gIHZhciBpbmRleDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlYW5kaW5mb3MnKTtcbiAgICBzdGF0ZUFuZEluZm9zLnB1c2gob2JqKTtcbiAgICBpbmRleCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoIC0gMTtcbiAgICB0aGlzLnJlbG9jYXRlU3RhdGVBbmRJbmZvcyhzdGF0ZUFuZEluZm9zKTsgLy8gUmVsb2NhdGUgc3RhdGUgYW5kIGluZm9zXG4gIH1cblxuICByZXR1cm4gaW5kZXg7XG59O1xuXG4vLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxuLy8gUmV0dXJucyB0aGUgcmVtb3ZlZCBib3guXG5lbGVtZW50VXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBpbmRleCkge1xuICB2YXIgb2JqO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVhbmRpbmZvcycpO1xuICAgIGlmICghb2JqKSB7XG4gICAgICBvYmogPSBzdGF0ZUFuZEluZm9zW2luZGV4XTtcbiAgICB9XG4gICAgc3RhdGVBbmRJbmZvcy5zcGxpY2UoaW5kZXgsIDEpOyAvLyBSZW1vdmUgdGhlIGJveFxuICAgIHRoaXMucmVsb2NhdGVTdGF0ZUFuZEluZm9zKHN0YXRlQW5kSW5mb3MpOyAvLyBSZWxvY2F0ZSBzdGF0ZSBhbmQgaW5mb3NcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG4vLyBTZXQgbXVsdGltZXIgc3RhdHVzIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxuZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uIChub2Rlcywgc3RhdHVzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHZhciBzYmduY2xhc3MgPSBub2RlLmRhdGEoJ2NsYXNzJyk7XG4gICAgdmFyIGlzTXVsdGltZXIgPSBub2RlLmRhdGEoJ2NsYXNzJykuZW5kc1dpdGgoJyBtdWx0aW1lcicpO1xuXG4gICAgaWYgKHN0YXR1cykgeyAvLyBNYWtlIG11bHRpbWVyIHN0YXR1cyB0cnVlXG4gICAgICBpZiAoIWlzTXVsdGltZXIpIHtcbiAgICAgICAgbm9kZS5kYXRhKCdjbGFzcycsIHNiZ25jbGFzcyArICcgbXVsdGltZXInKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7IC8vIE1ha2UgbXVsdGltZXIgc3RhdHVzIGZhbHNlXG4gICAgICBpZiAoaXNNdWx0aW1lcikge1xuICAgICAgICBub2RlLmRhdGEoJ2NsYXNzJywgc2JnbmNsYXNzLnJlcGxhY2UoJyBtdWx0aW1lcicsICcnKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vLyBTZXQgY2xvbmUgbWFya2VyIHN0YXR1cyBvZiBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxuZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uIChub2Rlcywgc3RhdHVzKSB7XG4gIGN5LnN0YXJ0QmF0Y2goKTtcblxuICBub2Rlcy5kYXRhKCdjbG9uZW1hcmtlcicsIHN0YXR1cyA/IHRydWUgOiB1bmRlZmluZWQpO1xuICB2YXIgbm9kZXNUb0FkZENsYXNzID0gbm9kZXMuZmlsdGVyKCdbY2xhc3M9XCJwZXJ0dXJiaW5nIGFnZW50XCJdJyk7XG4gIG5vZGVzVG9BZGRDbGFzcy5yZW1vdmVDbGFzcygnY2hhbmdlQ2xvbmVkU3RhdHVzJyk7XG4gIG5vZGVzVG9BZGRDbGFzcy5hZGRDbGFzcygnY2hhbmdlQ2xvbmVkU3RhdHVzJyk7XG5cbiAgY3kuZW5kQmF0Y2goKTtcbn07XG5cbi8vZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uKClcblxuLy8gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gZWxlbWVudHMgd2l0aCBnaXZlbiBmb250IGRhdGFcbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbiAoZWxlcywgZGF0YSkge1xuICBmb3IgKHZhciBwcm9wIGluIGRhdGEpIHtcbiAgICBlbGVzLmRhdGEocHJvcCwgZGF0YVtwcm9wXSk7XG4gIH1cbn07XG5cbi8vIFRoaXMgZnVuY3Rpb24gZ2V0cyBhbiBlZGdlLCBhbmQgZW5kcyBvZiB0aGF0IGVkZ2UgKE9wdGlvbmFsbHkgaXQgbWF5IHRha2UganVzdCB0aGUgY2xhc3NlcyBvZiB0aGVzZSBlbGVtZW50cyBhcyB3ZWxsKSBhcyBwYXJhbWV0ZXJzLlxuLy8gSXQgbWF5IHJldHVybiAndmFsaWQnICh0aGF0IGVuZHMgaXMgdmFsaWQgZm9yIHRoYXQgZWRnZSksICdyZXZlcnNlJyAodGhhdCBlbmRzIGlzIG5vdCB2YWxpZCBmb3IgdGhhdCBlZGdlIGJ1dCB0aGV5IHdvdWxkIGJlIHZhbGlkIFxuLy8gaWYgeW91IHJldmVyc2UgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0KSwgJ2ludmFsaWQnICh0aGF0IGVuZHMgYXJlIHRvdGFsbHkgaW52YWxpZCBmb3IgdGhhdCBlZGdlKS5cbmVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMgPSBmdW5jdGlvbiAoZWRnZSwgc291cmNlLCB0YXJnZXQpIHtcbiAgdmFyIGVkZ2VjbGFzcyA9IHR5cGVvZiBlZGdlID09PSAnc3RyaW5nJyA/IGVkZ2UgOiBlZGdlLmRhdGEoJ2NsYXNzJyk7XG4gIHZhciBzb3VyY2VjbGFzcyA9IHR5cGVvZiBzb3VyY2UgPT09ICdzdHJpbmcnID8gc291cmNlIDogc291cmNlLmRhdGEoJ2NsYXNzJyk7XG4gIHZhciB0YXJnZXRjbGFzcyA9IHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnID8gdGFyZ2V0IDogdGFyZ2V0LmRhdGEoJ2NsYXNzJyk7XG5cbiAgaWYgKGVkZ2VjbGFzcyA9PSAnY29uc3VtcHRpb24nIHx8IGVkZ2VjbGFzcyA9PSAnbW9kdWxhdGlvbidcbiAgICAgICAgICB8fCBlZGdlY2xhc3MgPT0gJ3N0aW11bGF0aW9uJyB8fCBlZGdlY2xhc3MgPT0gJ2NhdGFseXNpcydcbiAgICAgICAgICB8fCBlZGdlY2xhc3MgPT0gJ2luaGliaXRpb24nIHx8IGVkZ2VjbGFzcyA9PSAnbmVjZXNzYXJ5IHN0aW11bGF0aW9uJykge1xuICAgIGlmICghdGhpcy5pc0VQTkNsYXNzKHNvdXJjZWNsYXNzKSB8fCAhdGhpcy5pc1BOQ2xhc3ModGFyZ2V0Y2xhc3MpKSB7XG4gICAgICBpZiAodGhpcy5pc1BOQ2xhc3Moc291cmNlY2xhc3MpICYmIHRoaXMuaXNFUE5DbGFzcyh0YXJnZXRjbGFzcykpIHtcbiAgICAgICAgLy9JZiBqdXN0IHRoZSBkaXJlY3Rpb24gaXMgbm90IHZhbGlkIHJldmVyc2UgdGhlIGRpcmVjdGlvblxuICAgICAgICByZXR1cm4gJ3JldmVyc2UnO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKGVkZ2VjbGFzcyA9PSAncHJvZHVjdGlvbicpIHtcbiAgICBpZiAoIXRoaXMuaXNQTkNsYXNzKHNvdXJjZWNsYXNzKSB8fCAhdGhpcy5pc0VQTkNsYXNzKHRhcmdldGNsYXNzKSkge1xuICAgICAgaWYgKHRoaXMuaXNFUE5DbGFzcyhzb3VyY2VjbGFzcykgJiYgdGhpcy5pc1BOQ2xhc3ModGFyZ2V0Y2xhc3MpKSB7XG4gICAgICAgIC8vSWYganVzdCB0aGUgZGlyZWN0aW9uIGlzIG5vdCB2YWxpZCByZXZlcnNlIHRoZSBkaXJlY3Rpb25cbiAgICAgICAgcmV0dXJuICdyZXZlcnNlJztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gJ2ludmFsaWQnO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBlbHNlIGlmIChlZGdlY2xhc3MgPT0gJ2xvZ2ljIGFyYycpIHtcbiAgICB2YXIgaW52YWxpZCA9IGZhbHNlO1xuICAgIGlmICghdGhpcy5pc0VQTkNsYXNzKHNvdXJjZWNsYXNzKSB8fCAhdGhpcy5pc0xvZ2ljYWxPcGVyYXRvcih0YXJnZXRjbGFzcykpIHtcbiAgICAgIGlmICh0aGlzLmlzTG9naWNhbE9wZXJhdG9yKHNvdXJjZWNsYXNzKSAmJiB0aGlzLmlzRVBOQ2xhc3ModGFyZ2V0Y2xhc3MpKSB7XG4gICAgICAgIC8vSWYganVzdCB0aGUgZGlyZWN0aW9uIGlzIG5vdCB2YWxpZCByZXZlcnNlIHRoZSBkaXJlY3Rpb25cbiAgICAgICAgcmV0dXJuICdyZXZlcnNlJztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpbnZhbGlkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB0aGUgY2FzZSB0aGF0IGJvdGggc2lkZXMgYXJlIGxvZ2ljYWwgb3BlcmF0b3JzIGFyZSB2YWxpZCB0b29cbiAgICBpZiAodGhpcy5pc0xvZ2ljYWxPcGVyYXRvcihzb3VyY2VjbGFzcykgJiYgdGhpcy5pc0xvZ2ljYWxPcGVyYXRvcih0YXJnZXRjbGFzcykpIHtcbiAgICAgIGludmFsaWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoaW52YWxpZCkge1xuICAgICAgcmV0dXJuICdpbnZhbGlkJztcbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAoZWRnZWNsYXNzID09ICdlcXVpdmFsZW5jZSBhcmMnKSB7XG4gICAgaWYgKCEodGhpcy5pc0VQTkNsYXNzKHNvdXJjZWNsYXNzKSAmJiB0aGlzLmNvbnZlbmllbnRUb0VxdWl2YWxlbmNlKHRhcmdldGNsYXNzKSlcbiAgICAgICAgICAgICYmICEodGhpcy5pc0VQTkNsYXNzKHRhcmdldGNsYXNzKSAmJiB0aGlzLmNvbnZlbmllbnRUb0VxdWl2YWxlbmNlKHNvdXJjZWNsYXNzKSkpIHtcbiAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuICd2YWxpZCc7XG59O1xuXG4vKlxuICogQ2hhbmdlIHN0eWxlL2NzcyBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiB2YWx1ZS5cbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWUpIHtcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBlbGVzLmNzcyhuYW1lLCB2YWx1ZSk7XG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBlbGVzOiBlbGVzLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgIH07XG4gICAgXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUNzc1wiLCBwYXJhbSk7XG4gIH1cbn07XG5cbi8qXG4gKiBDaGFuZ2UgZGF0YSBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiB2YWx1ZS5cbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YSA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlKSB7XG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgZWxlcy5kYXRhKG5hbWUsIHZhbHVlKTtcbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGVsZXM6IGVsZXMsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlRGF0YVwiLCBwYXJhbSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZWxlbWVudFV0aWxpdGllczsiLCIvKiBcbiAqIFV0aWxpdHkgZmlsZSB0byBnZXQgYW5kIHNldCB0aGUgbGlicmFyaWVzIHRvIHdoaWNoIHNiZ252aXogaXMgZGVwZW5kZW50IGZyb20gYW55IGZpbGUuXG4gKi9cblxudmFyIGxpYlV0aWxpdGllcyA9IGZ1bmN0aW9uKCl7XG59O1xuXG5saWJVdGlsaXRpZXMuc2V0TGlicyA9IGZ1bmN0aW9uKGxpYnMpIHtcbiAgdGhpcy5saWJzID0gbGlicztcbn07XG5cbmxpYlV0aWxpdGllcy5nZXRMaWJzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmxpYnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxpYlV0aWxpdGllczsiLCJ2YXIgb3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpLmdldE9wdGlvbnMoKTtcclxudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XHJcblxyXG4vKlxyXG4gKiBUaGUgbWFpbiB1dGlsaXRpZXMgdG8gYmUgZXhwb3NlZCBkaXJlY3RseS5cclxuICovXHJcbmZ1bmN0aW9uIG1haW5VdGlsaXRpZXMoKSB7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBBZGRzIGEgbmV3IG5vZGUgd2l0aCB0aGUgZ2l2ZW4gY2xhc3MgYW5kIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlcy5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuYWRkTm9kZSA9IGZ1bmN0aW9uKHgsIHkgLCBub2RlY2xhc3MpIHtcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeCwgeSwgbm9kZWNsYXNzKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIG5ld05vZGUgOiB7XHJcbiAgICAgICAgeDogeCxcclxuICAgICAgICB5OiB5LFxyXG4gICAgICAgIGNsYXNzOiBub2RlY2xhc3NcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZE5vZGVcIiwgcGFyYW0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIEFkZHMgYSBuZXcgZWRnZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgaGF2aW5nIHRoZSBnaXZlbiBzb3VyY2UgYW5kIHRhcmdldCBpZHNcclxuICovXHJcbm1haW5VdGlsaXRpZXMuYWRkRWRnZSA9IGZ1bmN0aW9uKHNvdXJjZSwgdGFyZ2V0ICwgZWRnZWNsYXNzKSB7XHJcbiAgLy8gR2V0IHRoZSB2YWxpZGF0aW9uIHJlc3VsdFxyXG4gIHZhciB2YWxpZGF0aW9uID0gZWxlbWVudFV0aWxpdGllcy52YWxpZGF0ZUFycm93RW5kcyhlZGdlY2xhc3MsIGN5LmdldEVsZW1lbnRCeUlkKHNvdXJjZSksIGN5LmdldEVsZW1lbnRCeUlkKHRhcmdldCkpO1xyXG5cclxuICAvLyBJZiB2YWxpZGF0aW9uIHJlc3VsdCBpcyAnaW52YWxpZCcgY2FuY2VsIHRoZSBvcGVyYXRpb25cclxuICBpZiAodmFsaWRhdGlvbiA9PT0gJ2ludmFsaWQnKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIC8vIElmIHZhbGlkYXRpb24gcmVzdWx0IGlzICdyZXZlcnNlJyByZXZlcnNlIHRoZSBzb3VyY2UtdGFyZ2V0IHBhaXIgYmVmb3JlIGNyZWF0aW5nIHRoZSBlZGdlXHJcbiAgaWYgKHZhbGlkYXRpb24gPT09ICdyZXZlcnNlJykge1xyXG4gICAgdmFyIHRlbXAgPSBzb3VyY2U7XHJcbiAgICBzb3VyY2UgPSB0YXJnZXQ7XHJcbiAgICB0YXJnZXQgPSB0ZW1wO1xyXG4gIH1cclxuICAgICAgXHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHNvdXJjZSwgdGFyZ2V0LCBlZGdlY2xhc3MpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgbmV3RWRnZSA6IHtcclxuICAgICAgICBzb3VyY2U6IHNvdXJjZSxcclxuICAgICAgICB0YXJnZXQ6IHRhcmdldCxcclxuICAgICAgICBjbGFzczogZWRnZWNsYXNzXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRFZGdlXCIsIHBhcmFtKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDbG9uZSBnaXZlbiBlbGVtZW50cy4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNsb25lRWxlbWVudHMgPSBmdW5jdGlvbiAoZWxlcykge1xyXG4gIHZhciBjYiA9IGN5LmNsaXBib2FyZCgpO1xyXG4gIHZhciBfaWQgPSBjYi5jb3B5KGVsZXMsIFwiY2xvbmVPcGVyYXRpb25cIik7XHJcblxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwicGFzdGVcIiwge2lkOiBfaWR9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgY2IucGFzdGUoX2lkKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBBbGlnbnMgZ2l2ZW4gbm9kZXMgaW4gZ2l2ZW4gaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgb3JkZXIuIFxyXG4gKiBIb3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBwYXJhbWV0ZXJzIG1heSBiZSAnbm9uZScgb3IgdW5kZWZpbmVkLlxyXG4gKiBhbGlnblRvIHBhcmFtZXRlciBpbmRpY2F0ZXMgdGhlIGxlYWRpbmcgbm9kZS5cclxuICogUmVxdXJpcmVzIGN5dG9zY2FwZS1ncmlkLWd1aWRlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuYWxpZ24gPSBmdW5jdGlvbiAobm9kZXMsIGhvcml6b250YWwsIHZlcnRpY2FsLCBhbGlnblRvKSB7XHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhbGlnblwiLCB7XHJcbiAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgaG9yaXpvbnRhbDogaG9yaXpvbnRhbCxcclxuICAgICAgdmVydGljYWw6IHZlcnRpY2FsLFxyXG4gICAgICBhbGlnblRvOiBhbGlnblRvXHJcbiAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgbm9kZXMuYWxpZ24oaG9yaXpvbnRhbCwgdmVydGljYWwsIGFsaWduVG8pO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIENyZWF0ZSBjb21wb3VuZCBmb3IgZ2l2ZW4gbm9kZXMuIGNvbXBvdW5kVHlwZSBtYXkgYmUgJ2NvbXBsZXgnIG9yICdjb21wYXJ0bWVudCcuXHJcbiAqIFRoaXMgbWV0aG9kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChfbm9kZXMsIGNvbXBvdW5kVHlwZSkge1xyXG4gIHZhciBub2RlcyA9IF9ub2RlcztcclxuICAvLyBKdXN0IEVQTidzIGNhbiBiZSBpbmNsdWRlZCBpbiBjb21wbGV4ZXMgc28gd2UgbmVlZCB0byBmaWx0ZXIgRVBOJ3MgaWYgY29tcG91bmQgdHlwZSBpcyBjb21wbGV4XHJcbiAgaWYgKGNvbXBvdW5kVHlwZSA9PT0gJ2NvbXBsZXgnKSB7XHJcbiAgICBub2RlcyA9IF9ub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGksIGVsZW1lbnQpIHtcclxuICAgICAgdmFyIHNiZ25jbGFzcyA9IGVsZW1lbnQuZGF0YShcImNsYXNzXCIpO1xyXG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKHNiZ25jbGFzcyk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgXHJcbiAgbm9kZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldFRvcE1vc3ROb2Rlcyhub2Rlcyk7XHJcblxyXG4gIC8vIEFsbCBlbGVtZW50cyBzaG91bGQgaGF2ZSB0aGUgc2FtZSBwYXJlbnQgYW5kIHRoZSBjb21tb24gcGFyZW50IHNob3VsZCBub3QgYmUgYSAnY29tcGxleCcgXHJcbiAgLy8gaWYgY29tcG91bmRUeXBlIGlzICdjb21wYXJ0ZW50J1xyXG4gIC8vIGJlY2F1c2UgdGhlIG9sZCBjb21tb24gcGFyZW50IHdpbGwgYmUgdGhlIHBhcmVudCBvZiB0aGUgbmV3IGNvbXBhcnRtZW50IGFmdGVyIHRoaXMgb3BlcmF0aW9uIGFuZFxyXG4gIC8vICdjb21wbGV4ZXMnIGNhbm5vdCBpbmNsdWRlICdjb21wYXJ0bWVudHMnXHJcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwIHx8ICFlbGVtZW50VXRpbGl0aWVzLmFsbEhhdmVUaGVTYW1lUGFyZW50KG5vZGVzKVxyXG4gICAgICAgICAgfHwgKCBjb21wb3VuZFR5cGUgPT09ICdjb21wYXJ0bWVudCcgJiYgbm9kZXMucGFyZW50KCkuZGF0YSgnY2xhc3MnKSA9PT0gJ2NvbXBsZXgnICkgKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChjeS51bmRvUmVkbygpKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIGNvbXBvdW5kVHlwZTogY29tcG91bmRUeXBlLFxyXG4gICAgICBub2Rlc1RvTWFrZUNvbXBvdW5kOiBub2Rlc1xyXG4gICAgfTtcclxuXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyhub2RlcywgY29tcG91bmRUeXBlKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcclxuICogaW4gdGhlIGNvbXBsZXguIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSB0aGUgc2FtZSBmdW5jdGlvbiBpbiBlbGVtZW50VXRpbGl0aWVzXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAodGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCkge1xyXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uKHRlbXBsYXRlVHlwZSwgbWFjcm9tb2xlY3VsZUxpc3QsIGNvbXBsZXhOYW1lLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgdGVtcGxhdGVUeXBlOiB0ZW1wbGF0ZVR5cGUsXHJcbiAgICAgIG1hY3JvbW9sZWN1bGVMaXN0OiBtYWNyb21vbGVjdWxlTGlzdCxcclxuICAgICAgY29tcGxleE5hbWU6IGNvbXBsZXhOYW1lLFxyXG4gICAgICBwcm9jZXNzUG9zaXRpb246IHByb2Nlc3NQb3NpdGlvbixcclxuICAgICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXHJcbiAgICAgIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCxcclxuICAgICAgZWRnZUxlbmd0aDogZWRnZUxlbmd0aFxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZVRlbXBsYXRlUmVhY3Rpb25cIiwgcGFyYW0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIFJlc2l6ZSBnaXZlbiBub2RlcyBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHkgb25lIG9mIHdpZHRoIG9yIGhlaWdodCBzaG91bGQgbm90IGJlIHNldC4gXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24obm9kZXMsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvKSB7XHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICB3aWR0aDogd2lkdGgsXHJcbiAgICAgIGhlaWdodDogaGVpZ2h0LFxyXG4gICAgICB1c2VBc3BlY3RSYXRpbzogdXNlQXNwZWN0UmF0aW8sXHJcbiAgICAgIHBlcmZvcm1PcGVyYXRpb246IHRydWVcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZXNpemVOb2Rlc1wiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2Rlcyhub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8pO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIENoYW5nZXMgdGhlIGxhYmVsIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gbGFiZWwuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uKG5vZGVzLCBsYWJlbCkge1xyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBub2Rlcy5kYXRhKCdsYWJlbCcsIGxhYmVsKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgbGFiZWw6IGxhYmVsLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VOb2RlTGFiZWxcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuLypcclxuICogQ2hhbmdlIGZvbnQgcHJvcGVydGllcyBmb3IgZ2l2ZW4gZWxlcyB1c2UgdGhlIGdpdmVuIGZvbnQgZGF0YS5cclxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbihlbGVzLCBkYXRhKSB7XHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgZWxlczogZWxlcyxcclxuICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgZmlyc3RUaW1lOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VGb250UHJvcGVydGllc1wiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyhlbGVzLCBkYXRhKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDaGFuZ2Ugc3RhdGUgdmFsdWUgb3IgdW5pdCBvZiBpbmZvcm1hdGlvbiBib3ggb2YgZ2l2ZW4gbm9kZXMgd2l0aCBnaXZlbiBpbmRleC5cclxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHBhcmFtZXRlcnMgc2VlIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3hcclxuICovXHJcbm1haW5VdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgaW5kZXg6IGluZGV4LFxyXG4gICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgfTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXHJcbi8vIFRoZSBib3ggaXMgcmVwcmVzZW50ZWQgYnkgdGhlIHBhcmFtZXRlciBvYmouXHJcbi8vIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2Rlcywgb2JqKSB7XHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBvYmo6IG9iaixcclxuICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIFJlbW92ZSB0aGUgc3RhdGUgb3IgaW5mbyBib3hlcyBvZiB0aGUgZ2l2ZW4gbm9kZXMgYXQgZ2l2ZW4gaW5kZXguXHJcbi8vIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgpIHtcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgaW5kZXg6IGluZGV4LFxyXG4gICAgICBub2Rlczogbm9kZXNcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInJlbW92ZVN0YXRlT3JJbmZvQm94XCIsIHBhcmFtKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBTZXQgbXVsdGltZXIgc3RhdHVzIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxyXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uKG5vZGVzLCBzdGF0dXMpIHtcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBzdGF0dXM6IHN0YXR1cyxcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNldE11bHRpbWVyU3RhdHVzXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIFNldCBjbG9uZSBtYXJrZXIgc3RhdHVzIG9mIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqLyBcclxubWFpblV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uKG5vZGVzLCBzdGF0dXMpIHtcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBzdGF0dXM6IHN0YXR1cyxcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNldENsb25lTWFya2VyU3RhdHVzXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFpblV0aWxpdGllczsiLCIvKlxuICogIEV4dGVuZCBkZWZhdWx0IG9wdGlvbnMgYW5kIGdldCBjdXJyZW50IG9wdGlvbnMgYnkgdXNpbmcgdGhpcyBmaWxlIFxuICovXG5cbi8vIGRlZmF1bHQgb3B0aW9uc1xudmFyIGRlZmF1bHRzID0ge1xuICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgdGhlIGluZGV4IGh0bWwgXG4gIC8vIGZpbGUgYW5kIG5vZGVfbW9kdWxlcyBhcmUgdW5kZXIgdGhlIHNhbWUgZm9sZGVyIHRoZW4gdXNpbmcgdGhlIGRlZmF1bHQgdmFsdWUgaXMgZmluZVxuICBpbWdQYXRoOiAnbm9kZV9tb2R1bGVzL3NiZ252aXovc3JjL2ltZycsXG4gIC8vIFdoZXRoZXIgdG8gZml0IGxhYmVscyB0byBub2Rlc1xuICBmaXRMYWJlbHNUb05vZGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICAvLyBkeW5hbWljIGxhYmVsIHNpemUgaXQgbWF5IGJlICdzbWFsbCcsICdyZWd1bGFyJywgJ2xhcmdlJ1xuICBkeW5hbWljTGFiZWxTaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICdyZWd1bGFyJztcbiAgfSxcbiAgLy8gcGVyY2VudGFnZSB1c2VkIHRvIGNhbGN1bGF0ZSBjb21wb3VuZCBwYWRkaW5nc1xuICBjb21wb3VuZFBhZGRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gMTA7XG4gIH0sXG4gIC8vIFRoZSBzZWxlY3RvciBvZiB0aGUgY29tcG9uZW50IGNvbnRhaW5pbmcgdGhlIHNiZ24gbmV0d29ya1xuICBuZXR3b3JrQ29udGFpbmVyU2VsZWN0b3I6ICcjc2Jnbi1uZXR3b3JrLWNvbnRhaW5lcicsXG4gIC8vIFdoZXRoZXIgdGhlIGFjdGlvbnMgYXJlIHVuZG9hYmxlLCByZXF1aXJlcyBjeXRvc2NhcGUtdW5kby1yZWRvIGV4dGVuc2lvblxuICB1bmRvYWJsZTogdHJ1ZSxcbiAgLy8gV2hldGhlciB0byBoYXZlIHVuZG9hYmxlIGRyYWcgZmVhdHVyZSBpbiB1bmRvL3JlZG8gZXh0ZW5zaW9uLiBUaGlzIG9wdGlvbnMgd2lsbCBiZSBwYXNzZWQgdG8gdW5kby9yZWRvIGV4dGVuc2lvblxuICB1bmRvYWJsZURyYWc6IHRydWVcbn07XG5cbnZhciBvcHRpb25VdGlsaXRpZXMgPSBmdW5jdGlvbiAoKSB7XG59O1xuXG4vLyBFeHRlbmQgdGhlIGRlZmF1bHRzIG9wdGlvbnMgd2l0aCB0aGUgdXNlciBvcHRpb25zXG5vcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcblxuICBmb3IgKHZhciBwcm9wIGluIGRlZmF1bHRzKSB7XG4gICAgcmVzdWx0W3Byb3BdID0gZGVmYXVsdHNbcHJvcF07XG4gIH1cbiAgXG4gIGZvciAodmFyIHByb3AgaW4gb3B0aW9ucykge1xuICAgIHJlc3VsdFtwcm9wXSA9IG9wdGlvbnNbcHJvcF07XG4gIH1cblxuICBvcHRpb25VdGlsaXRpZXMub3B0aW9ucyA9IHJlc3VsdDtcblxuICByZXR1cm4gb3B0aW9ucztcbn07XG5cbm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9wdGlvblV0aWxpdGllczsiLCJ2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgJCA9IGxpYnMualF1ZXJ5O1xyXG5cclxudmFyIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zID0gZnVuY3Rpb24gKHVuZG9hYmxlRHJhZykge1xyXG4gIC8vIGNyZWF0ZSB1bmRvLXJlZG8gaW5zdGFuY2VcclxuICB2YXIgdXIgPSBjeS51bmRvUmVkbyh7XHJcbiAgICB1bmRvYWJsZURyYWc6IHVuZG9hYmxlRHJhZ1xyXG4gIH0pO1xyXG5cclxuICAvLyByZWdpc3RlciBhZGQgcmVtb3ZlIGFjdGlvbnNcclxuICB1ci5hY3Rpb24oXCJhZGROb2RlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZE5vZGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xyXG4gIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTaW1wbGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xyXG4gIHVyLmFjdGlvbihcImFkZEVkZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XHJcbiAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NtYXJ0XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTbWFydCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xyXG4gIHVyLmFjdGlvbihcImNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZUNvbXBvdW5kKTtcclxuXHJcbiAgLy8gcmVnaXN0ZXIgZ2VuZXJhbCBhY3Rpb25zXHJcbiAgdXIuYWN0aW9uKFwicmVzaXplTm9kZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc2l6ZU5vZGVzKTtcclxuICB1ci5hY3Rpb24oXCJjaGFuZ2VOb2RlTGFiZWxcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwpO1xyXG4gIC8vIFRPRE8gcmVtb3ZlIHRoaXNcclxuICB1ci5hY3Rpb24oXCJjaGFuZ2VEYXRhXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEpO1xyXG4gIHVyLmFjdGlvbihcImNoYW5nZUNzc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUNzcyk7XHJcbiAgdXIuYWN0aW9uKFwiY2hhbmdlQmVuZFBvaW50c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCZW5kUG9pbnRzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCZW5kUG9pbnRzKTtcclxuICB1ci5hY3Rpb24oXCJjaGFuZ2VGb250UHJvcGVydGllc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMpO1xyXG4gIHVyLmFjdGlvbihcInNob3dBbmRQZXJmb3JtSW5jcmVtZW50YWxMYXlvdXRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2hvd0FuZFBlcmZvcm1JbmNyZW1lbnRhbExheW91dCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtSW5jcmVtZW50YWxMYXlvdXQpO1xyXG5cclxuICAvLyByZWdpc3RlciBTQkdOIGFjdGlvbnNcclxuICB1ci5hY3Rpb24oXCJhZGRTdGF0ZUFuZEluZm9cIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVBbmRJbmZvLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCk7XHJcbiAgdXIuYWN0aW9uKFwiY2hhbmdlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94KTtcclxuICB1ci5hY3Rpb24oXCJjaGFuZ2VVbml0T2ZJbmZvcm1hdGlvblwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VVbml0T2ZJbmZvcm1hdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlVW5pdE9mSW5mb3JtYXRpb24pO1xyXG4gIHVyLmFjdGlvbihcInNldE11bHRpbWVyU3RhdHVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cyk7XHJcbiAgdXIuYWN0aW9uKFwic2V0Q2xvbmVNYXJrZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzKTtcclxuICB1ci5hY3Rpb24oXCJyZW1vdmVTdGF0ZU9ySW5mb0JveFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVBbmRJbmZvKTtcclxuICBcclxuICAvLyByZWdpc3RlciBlYXN5IGNyZWF0aW9uIGFjdGlvbnNcclxuICB1ci5hY3Rpb24oXCJjcmVhdGVUZW1wbGF0ZVJlYWN0aW9uXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24sIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZUVsZXMpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1bmRvYWJsZURyYWcpIHtcclxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKHVuZG9hYmxlRHJhZyk7XHJcbiAgfSk7XHJcbn07IiwiLy8gRXh0ZW5kcyBzYmdudml6LnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zXHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgc2JnbnZpeiA9IGxpYnMuc2JnbnZpejtcclxudmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcclxudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XHJcblxyXG4vLyBTZWN0aW9uIFN0YXJ0XHJcbi8vIGFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkTm9kZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQ7XHJcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgdmFyIG5ld05vZGUgPSBwYXJhbS5uZXdOb2RlO1xyXG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKG5ld05vZGUueCwgbmV3Tm9kZS55LCBuZXdOb2RlLmNsYXNzKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKHBhcmFtKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBlbGVzOiByZXN1bHRcclxuICB9O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQ7XHJcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgdmFyIG5ld0VkZ2UgPSBwYXJhbS5uZXdFZGdlO1xyXG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKG5ld0VkZ2Uuc291cmNlLCBuZXdFZGdlLnRhcmdldCwgbmV3RWRnZS5jbGFzcyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZWxlczogcmVzdWx0XHJcbiAgfTtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBub2Rlc1RvTWFrZUNvbXBvdW5kID0gcGFyYW0ubm9kZXNUb01ha2VDb21wb3VuZDtcclxuICB2YXIgbmV3Q29tcG91bmQ7XHJcblxyXG4gIC8vIElmIHRoaXMgaXMgYSByZWRvIGFjdGlvbiByZWZyZXNoIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kIChXZSBuZWVkIHRoaXMgYmVjYXVzZSBhZnRlciBlbGUubW92ZSgpIHJlZmVyZW5jZXMgdG8gZWxlcyBjaGFuZ2VzKVxyXG4gIGlmICghcGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICB2YXIgbm9kZXNUb01ha2VDb21wb3VuZElkcyA9IHt9O1xyXG5cclxuICAgIG5vZGVzVG9NYWtlQ29tcG91bmQuZWFjaChmdW5jdGlvbiAoaSwgZWxlKSB7XHJcbiAgICAgIG5vZGVzVG9NYWtlQ29tcG91bmRJZHNbZWxlLmlkKCldID0gdHJ1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKCk7XHJcblxyXG4gICAgbm9kZXNUb01ha2VDb21wb3VuZCA9IGFsbE5vZGVzLmZpbHRlcihmdW5jdGlvbiAoaSwgZWxlKSB7XHJcbiAgICAgIHJldHVybiBub2Rlc1RvTWFrZUNvbXBvdW5kSWRzW2VsZS5pZCgpXTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgdmFyIG9sZFBhcmVudElkID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwicGFyZW50XCIpO1xyXG4gICAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZFxyXG4gICAgbmV3Q29tcG91bmQgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyhub2Rlc1RvTWFrZUNvbXBvdW5kLCBwYXJhbS5jb21wdW5kVHlwZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbmV3Q29tcG91bmQgPSBwYXJhbS5yZW1vdmVkQ29tcG91bmQucmVzdG9yZSgpO1xyXG4gICAgdmFyIG5ld0NvbXBvdW5kSWQgPSBuZXdDb21wb3VuZC5pZCgpO1xyXG5cclxuICAgIG5vZGVzVG9NYWtlQ29tcG91bmQubW92ZSh7cGFyZW50OiBuZXdDb21wb3VuZElkfSk7XHJcblxyXG4gICAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXdDb21wb3VuZDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZUNvbXBvdW5kID0gZnVuY3Rpb24gKGNvbXBvdW5kVG9SZW1vdmUpIHtcclxuICB2YXIgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZW1vdmVDb21wb3VuZChjb21wb3VuZFRvUmVtb3ZlKTtcclxuXHJcbiAgdmFyIHBhcmFtID0ge1xyXG4gICAgbm9kZXNUb01ha2VDb21wb3VuZDogcmVzdWx0LmNoaWxkcmVuT2ZDb21wb3VuZCxcclxuICAgIHJlbW92ZWRDb21wb3VuZDogcmVzdWx0LnJlbW92ZWRDb21wb3VuZFxyXG4gIH07XHJcblxyXG4gIHJldHVybiBwYXJhbTtcclxufTtcclxuXHJcbi8vIFNlY3Rpb24gRW5kXHJcbi8vIGFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxuLy8gU2VjdGlvbiBTdGFydFxyXG4vLyBlYXN5IGNyZWF0aW9uIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xyXG4gIHZhciBlbGVzO1xyXG5cclxuICBpZiAoZmlyc3RUaW1lKSB7XHJcbiAgICBlbGVzID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uKHBhcmFtLnRlbXBsYXRlVHlwZSwgcGFyYW0ubWFjcm9tb2xlY3VsZUxpc3QsIHBhcmFtLmNvbXBsZXhOYW1lLCBwYXJhbS5wcm9jZXNzUG9zaXRpb24sIHBhcmFtLnRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgcGFyYW0udGlsaW5nUGFkZGluZ0hvcml6b250YWwsIHBhcmFtLmVkZ2VMZW5ndGgpXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlcyA9IHBhcmFtO1xyXG4gICAgY3kuYWRkKGVsZXMpO1xyXG4gICAgXHJcbiAgICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xyXG4gICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xyXG4gICAgZWxlcy5zZWxlY3QoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBlbGVzO1xyXG59O1xyXG5cclxuLy8gU2VjdGlvbiBFbmRcclxuLy8gZWFzeSBjcmVhdGlvbiBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG4vLyBTZWN0aW9uIFN0YXJ0XHJcbi8vIGdlbmVyYWwgYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9uc0FuZFNpemVzID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwb3NpdGlvbnNBbmRTaXplcyA9IHt9O1xyXG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBlbGUgPSBub2Rlc1tpXTtcclxuICAgIHBvc2l0aW9uc0FuZFNpemVzW2VsZS5pZCgpXSA9IHtcclxuICAgICAgd2lkdGg6IGVsZS53aWR0aCgpLFxyXG4gICAgICBoZWlnaHQ6IGVsZS5oZWlnaHQoKSxcclxuICAgICAgeDogZWxlLnBvc2l0aW9uKFwieFwiKSxcclxuICAgICAgeTogZWxlLnBvc2l0aW9uKFwieVwiKVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHJldHVybiBwb3NpdGlvbnNBbmRTaXplcztcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zQW5kU2l6ZXNDb25kaXRpb25hbGx5ID0gZnVuY3Rpb24gKG5vZGVzRGF0YSkge1xyXG4gIGlmIChub2Rlc0RhdGEuZmlyc3RUaW1lKSB7XHJcbiAgICBkZWxldGUgbm9kZXNEYXRhLmZpcnN0VGltZTtcclxuICAgIHJldHVybiBub2Rlc0RhdGE7XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzLnJldHVyblRvUG9zaXRpb25zQW5kU2l6ZXMobm9kZXNEYXRhKTtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zQW5kU2l6ZXMgPSBmdW5jdGlvbiAobm9kZXNEYXRhKSB7XHJcbiAgdmFyIGN1cnJlbnRQb3NpdGlvbnNBbmRTaXplcyA9IHt9O1xyXG4gIGN5Lm5vZGVzKCkucG9zaXRpb25zKGZ1bmN0aW9uIChpLCBlbGUpIHtcclxuICAgIGN1cnJlbnRQb3NpdGlvbnNBbmRTaXplc1tlbGUuaWQoKV0gPSB7XHJcbiAgICAgIHdpZHRoOiBlbGUud2lkdGgoKSxcclxuICAgICAgaGVpZ2h0OiBlbGUuaGVpZ2h0KCksXHJcbiAgICAgIHg6IGVsZS5wb3NpdGlvbihcInhcIiksXHJcbiAgICAgIHk6IGVsZS5wb3NpdGlvbihcInlcIilcclxuICAgIH07XHJcbiAgICB2YXIgZGF0YSA9IG5vZGVzRGF0YVtlbGUuaWQoKV07XHJcbiAgICBlbGUuX3ByaXZhdGUuZGF0YS53aWR0aCA9IGRhdGEud2lkdGg7XHJcbiAgICBlbGUuX3ByaXZhdGUuZGF0YS5oZWlnaHQgPSBkYXRhLmhlaWdodDtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IGRhdGEueCxcclxuICAgICAgeTogZGF0YS55XHJcbiAgICB9O1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gY3VycmVudFBvc2l0aW9uc0FuZFNpemVzO1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZVxyXG4gIH07XHJcblxyXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG5cclxuICByZXN1bHQuc2l6ZU1hcCA9IHt9O1xyXG4gIHJlc3VsdC51c2VBc3BlY3RSYXRpbyA9IGZhbHNlO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgcmVzdWx0LnNpemVNYXBbbm9kZS5pZCgpXSA9IHtcclxuICAgICAgdzogbm9kZS53aWR0aCgpLFxyXG4gICAgICBoOiBub2RlLmhlaWdodCgpXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcmVzdWx0Lm5vZGVzID0gbm9kZXM7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcblxyXG4gICAgaWYgKHBhcmFtLnBlcmZvcm1PcGVyYXRpb24pIHtcclxuICAgICAgaWYgKHBhcmFtLnNpemVNYXApIHtcclxuICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0udztcclxuICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0uaDtcclxuXHJcbiAgICAgICAgbm9kZS5yZW1vdmVDbGFzcygnbm9kZXJlc2l6ZWQnKTtcclxuICAgICAgICBub2RlLmFkZENsYXNzKCdub2RlcmVzaXplZCcpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMocGFyYW0ubm9kZXMsIHBhcmFtLndpZHRoLCBwYXJhbS5oZWlnaHQsIHBhcmFtLnVzZUFzcGVjdFJhdGlvKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbi8vICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gIG5vZGVzLnJlbW92ZUNsYXNzKCdub2RlcmVzaXplZCcpO1xyXG4gIG5vZGVzLmFkZENsYXNzKCdub2RlcmVzaXplZCcpO1xyXG5cclxuICAvLyBUT0RPIGhhbmRsZSBzYmduIGluc3BlY3RvciBhZnRlciB0aGlzIGNhbGxcclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgfTtcclxuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuICByZXN1bHQubm9kZXMgPSBub2RlcztcclxuICByZXN1bHQubGFiZWwgPSB7fTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHJlc3VsdC5sYWJlbFtub2RlLmlkKCldID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xyXG4gIH1cclxuXHJcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBwYXJhbS5sYWJlbCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICBub2RlLl9wcml2YXRlLmRhdGEubGFiZWwgPSBwYXJhbS5sYWJlbFtub2RlLmlkKCldO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICAvLyBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG5cclxuICAvLyBUT0RPIGhhbmRsZSBzYmduIGluc3BlY3RvciBhZnRlciB0aGlzIGNhbGxcclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gIH07XHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG5cclxuICByZXN1bHQubmFtZSA9IHBhcmFtLm5hbWU7XHJcbiAgcmVzdWx0LnZhbHVlTWFwID0ge307XHJcbiAgcmVzdWx0LmVsZXMgPSBlbGVzO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG4gICAgcmVzdWx0LnZhbHVlTWFwW2VsZS5pZCgpXSA9IGVsZS5kYXRhKHBhcmFtLm5hbWUpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgZWxlcy5kYXRhKHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICAgIGVsZS5kYXRhKHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlTWFwW2VsZS5pZCgpXSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyAgY3kuZm9yY2VSZW5kZXIoKTtcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpOyAvLyBVcGRhdGUgc3R5bGVcclxuXHJcbiAgLy8gVE9ETyBoYW5kbGUgc2JnbiBpbnNwZWN0b3IgYWZ0ZXIgdGhpcyBjYWxsXHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gIH07XHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG4gIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTtcclxuICByZXN1bHQudmFsdWVNYXAgPSB7fTtcclxuICByZXN1bHQuZWxlcyA9IGVsZXM7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICByZXN1bHQudmFsdWVNYXBbZWxlLmlkKCldID0gZWxlLmNzcyhwYXJhbS5uYW1lKTtcclxuICB9XHJcblxyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIGVsZXMuY3NzKHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICAgIGVsZS5jc3MocGFyYW0ubmFtZSwgcGFyYW0udmFsdWVNYXBbZWxlLmlkKCldKTtcclxuICAgIH1cclxuICB9XHJcbi8vICBjeS5mb3JjZVJlbmRlcigpO1xyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7IC8vIFVwZGF0ZSBzdHlsZVxyXG5cclxuICAvLyBUT0RPIG1vdmUgc3VjaCBjYWxscyB0byBzYW1wbGUgYXBwbGljYXRpb24gbWF5YmUgYnkgdHJpZ2dlcmluZyBhbiBldmVudFxyXG4vLyAgaWYgKF8uaXNFcXVhbChlbGVzLCBjeS5ub2RlcygnOnNlbGVjdGVkJykpKSB7XHJcbi8vICAgIGluc3BlY3RvclV0aWxpdGllcy5oYW5kbGVTQkdOSW5zcGVjdG9yKCk7XHJcbi8vICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgfTtcclxuXHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG4gIHJlc3VsdC5kYXRhID0ge307XHJcbiAgcmVzdWx0LmVsZXMgPSBlbGVzO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG5cclxuICAgIHJlc3VsdC5kYXRhW2VsZS5pZCgpXSA9IHt9O1xyXG5cclxuICAgIHZhciBkYXRhID0gcGFyYW0uZmlyc3RUaW1lID8gcGFyYW0uZGF0YSA6IHBhcmFtLmRhdGFbZWxlLmlkKCldO1xyXG5cclxuICAgIGZvciAodmFyIHByb3AgaW4gZGF0YSkge1xyXG4gICAgICByZXN1bHQuZGF0YVtlbGUuaWQoKV1bcHJvcF0gPSBlbGUuZGF0YShwcm9wKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgcGFyYW0uZGF0YSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG5cclxuICAgICAgZm9yICh2YXIgcHJvcCBpbiBwYXJhbS5kYXRhW2VsZS5pZCgpXSkge1xyXG4gICAgICAgIGVsZS5kYXRhKHByb3AsIHBhcmFtLmRhdGFbZWxlLmlkKCldW3Byb3BdKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8vIFRPRE8gcmVjb25zaWRlciB0aGlzIG9wZXJhdGlvbiBvZiB1bmRvIG9mIGl0LlxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUluY3JlbWVudGFsTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG5cclxuICB2YXIgcmVzdWx0ID0ge307XHJcbiAgcmVzdWx0LnBvc2l0aW9uQW5kU2l6ZXMgPSB0aGlzLmdldE5vZGVQb3NpdGlvbnNBbmRTaXplcygpO1xyXG4gIHJlc3VsdC5lbGVzID0gZWxlcy5zaG93RWxlcygpO1xyXG5cclxuICBpZiAocGFyYW0ucG9zaXRpb25BbmRTaXplcykge1xyXG4gICAgdGhpcy5yZXR1cm5Ub1Bvc2l0aW9uc0FuZFNpemVzKHBhcmFtLnBvc2l0aW9uQW5kU2l6ZXMpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRyaWdnZXJJbmNyZW1lbnRhbExheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9TaG93QW5kUGVyZm9ybUluY3JlbWVudGFsTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG5cclxuICB2YXIgcmVzdWx0ID0ge307XHJcbiAgcmVzdWx0LnBvc2l0aW9uQW5kU2l6ZXMgPSB0aGlzLmdldE5vZGVQb3NpdGlvbnNBbmRTaXplcygpO1xyXG4gIHJlc3VsdC5lbGVzID0gZWxlcy5oaWRlRWxlcygpO1xyXG5cclxuICB0aGlzLnJldHVyblRvUG9zaXRpb25zQW5kU2l6ZXMocGFyYW0ucG9zaXRpb25BbmRTaXplcyk7XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vLyBTZWN0aW9uIEVuZFxyXG4vLyBnZW5lcmFsIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbi8vIFNlY3Rpb24gU3RhcnRcclxuLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgfTtcclxuICByZXN1bHQudHlwZSA9IHBhcmFtLnR5cGU7XHJcbiAgcmVzdWx0Lm5vZGVzID0gcGFyYW0ubm9kZXM7XHJcbiAgcmVzdWx0LmluZGV4ID0gcGFyYW0uaW5kZXg7XHJcblxyXG4gIHJlc3VsdC52YWx1ZSA9IGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3gocGFyYW0ubm9kZXMsIHBhcmFtLmluZGV4LCBwYXJhbS52YWx1ZSwgcGFyYW0udHlwZSk7XHJcblxyXG4gIGN5LmZvcmNlUmVuZGVyKCk7XHJcblxyXG4gIC8vIFRPRE8gbW92ZSBzdWNoIGNhbGxzIHRvIHNhbXBsZSBhcHBsaWNhdGlvbiBtYXliZSBieSB0cmlnZ2VyaW5nIGFuIGV2ZW50XHJcbi8vICBpbnNwZWN0b3JVdGlsaXRpZXMuZmlsbEluc3BlY3RvclN0YXRlQW5kSW5mb3MocGFyYW0ubm9kZXMsIHBhcmFtLm5vZGVzKCkuZGF0YSgnc3RhdGVhbmRpbmZvcycpLCBwYXJhbS53aWR0aCk7XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBvYmogPSBwYXJhbS5vYmo7XHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcblxyXG4gIHZhciBpbmRleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XHJcblxyXG4gIFxyXG4gIGN5LmZvcmNlUmVuZGVyKCk7XHJcblxyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBub2Rlczogbm9kZXMsXHJcbiAgICBpbmRleDogaW5kZXgsXHJcbiAgICBvYmo6IG9ialxyXG4gIH07XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIGluZGV4ID0gcGFyYW0uaW5kZXg7XHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcblxyXG4gIHZhciBvYmogPSBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94KG5vZGVzLCBpbmRleCk7XHJcblxyXG4gIC8vIFRPRE8gZmlsbCBpbnNwZWN0b3Igc3RhdGUgYW5kIGluZm9zIGFmdGVyIHRoaXMgY2FsbFxyXG4gIGN5LmZvcmNlUmVuZGVyKCk7XHJcblxyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBub2Rlczogbm9kZXMsXHJcbiAgICBvYmo6IG9ialxyXG4gIH07XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcclxuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuICB2YXIgc3RhdHVzID0gcGFyYW0uc3RhdHVzO1xyXG4gIHZhciByZXN1bHRTdGF0dXMgPSB7fTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHZhciBpc011bHRpbWVyID0gbm9kZS5kYXRhKCdjbGFzcycpLmVuZHNXaXRoKCcgbXVsdGltZXInKTtcclxuXHJcbiAgICByZXN1bHRNYWtlTXVsdGltZXJbbm9kZS5pZCgpXSA9IGlzTXVsdGltZXI7XHJcbiAgfVxyXG5cclxuICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIGNoYW5nZSB0aGUgc3RhdHVzIG9mIGFsbCBub2RlcyBhdCBvbmNlLlxyXG4gIC8vIElmIG5vdCBjaGFuZ2Ugc3RhdHVzIG9mIGVhY2ggc2VwZXJhdGVseSB0byB0aGUgdmFsdWVzIG1hcHBlZCB0byB0aGVpciBpZC5cclxuICBpZiAoZmlyc3RUaW1lKSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2RlLCBzdGF0dXNbbm9kZS5pZCgpXSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoIWZpcnN0VGltZSAmJiBfLmlzRXF1YWwobm9kZXMsIGN5Lm5vZGVzKCc6c2VsZWN0ZWQnKSkpIHtcclxuICAgICQoJyNpbnNwZWN0b3ItaXMtbXVsdGltZXInKS5hdHRyKFwiY2hlY2tlZFwiLCAhJCgnI2luc3BlY3Rvci1pcy1tdWx0aW1lcicpLmF0dHIoXCJjaGVja2VkXCIpKTtcclxuICB9XHJcblxyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBzdGF0dXM6IHJlc3VsdFN0YXR1cyxcclxuICAgIG5vZGVzOiBub2Rlc1xyXG4gIH07XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG4gIHZhciBzdGF0dXMgPSBwYXJhbS5zdGF0dXM7XHJcbiAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcclxuICB2YXIgcmVzdWx0U3RhdHVzID0ge307XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICByZXN1bHRTdGF0dXNbbm9kZS5pZCgpXSA9IG5vZGUuZGF0YSgnY2xvbmVtYXJrZXInKTtcclxuICAgIHZhciBjdXJyZW50U3RhdHVzID0gZmlyc3RUaW1lID8gc3RhdHVzIDogc3RhdHVzW25vZGUuaWQoKV07XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGVzLCBjdXJyZW50U3RhdHVzKTtcclxuICB9XHJcblxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcblxyXG4gIGlmICghZmlyc3RUaW1lICYmIF8uaXNFcXVhbChub2RlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xyXG4gICAgJCgnI2luc3BlY3Rvci1pcy1jbG9uZS1tYXJrZXInKS5hdHRyKFwiY2hlY2tlZFwiLCAhJCgnI2luc3BlY3Rvci1pcy1jbG9uZS1tYXJrZXInKS5hdHRyKFwiY2hlY2tlZFwiKSk7XHJcbiAgfVxyXG5cclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgc3RhdHVzOiByZXN1bHRTdGF0dXMsXHJcbiAgICBub2Rlczogbm9kZXNcclxuICB9O1xyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLy8gU2VjdGlvbiBFbmRcclxuLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zOyJdfQ==
