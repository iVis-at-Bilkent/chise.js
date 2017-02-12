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
        ele.data('fontweight', elementUtilities.defaultProperties[_class].fontweight);
        ele.data('fontfamily', elementUtilities.defaultProperties[_class].fontfamily);
        ele.data('fontstyle', elementUtilities.defaultProperties[_class].fontstyle);
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
    height: 50,
    fontfamily: 'Helvetica',
    fontweight: 'normal',
    fontstyle: 'normal',
    labelsize: 20
  },
  "nucleic acid feature": {
    width: 100,
    height: 50,
    fontfamily: 'Helvetica',
    fontweight: 'normal',
    fontstyle: 'normal',
    labelsize: 20
  },
  "simple chemical": {
    width: 50,
    height: 50,
    fontfamily: 'Helvetica',
    fontweight: 'normal',
    fontstyle: 'normal',
    labelsize: 20
  },
  "source and sink": {
    width: 50,
    height: 50,
    fontfamily: 'Helvetica',
    fontweight: 'normal',
    fontstyle: 'normal',
    labelsize: 20
  },
  "tag": {
    width: 50,
    height: 50,
    fontfamily: 'Helvetica',
    fontweight: 'normal',
    fontstyle: 'normal',
    labelsize: 20
  },
  "phenotype": {
    width: 100,
    height: 50,
    fontfamily: 'Helvetica',
    fontweight: 'normal',
    fontstyle: 'normal',
    labelsize: 20
  },
  "unspecified entity": {
    width: 100,
    height: 50,
    fontfamily: 'Helvetica',
    fontweight: 'normal',
    fontstyle: 'normal',
    labelsize: 20
  },
  "perturbing agent": {
    width: 100,
    height: 50,
    fontfamily: 'Helvetica',
    fontweight: 'normal',
    fontstyle: 'normal',
    labelsize: 20
  },
  "complex": {
    width: 100,
    height: 100,
    fontfamily: 'Helvetica',
    fontweight: 'normal',
    fontstyle: 'normal',
    labelsize: 16
  },
  "compartment": {
    width: 100,
    height: 100,
    fontfamily: 'Helvetica',
    fontweight: 'normal',
    fontstyle: 'normal',
    labelsize: 16
  }
};

// Section Start
// Add remove utilities

elementUtilities.addNode = function (x, y, sbgnclass, parent, visibility) {
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

elementUtilities.addEdge = function (source, target, sbgnclass, visibility) {
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
    var newNode = elementUtilities.addNode(complex.position('x'), complex.position('y'), "macromolecule", complex.id());
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
  
  cy.style().update();
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
 * Change style/css of given eles by setting getting property name to the given value.
 * Considers undoable option.
 */
mainUtilities.changeCss = function(eles, name, value) {
  if (!options.undoable) {
    eles.css(name, value);
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
  
  cy.style().update();
};

/*
 * Change data of given eles by setting getting property name to the given value.
 * Considers undoable option.
 */
mainUtilities.changeData = function(eles, name, value) {
  if (!options.undoable) {
    eles.data(name, value);
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
  
  cy.style().update();
};

/*
 * Unhide given eles and perform given layout afterward. Layout parameter may be layout options
 * or a function to call. Requires viewUtilities extension and considers undoable option.
 */
mainUtilities.showAndPerformLayout = function(eles, layoutparam) {
  if (!options.undoable) {
    elementUtilities.showAndPerformLayout(eles, layoutparam);
  }
  else {
    var param = {
      eles: eles,
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

  if (param.firstTime) {
    eles.data(param.name, param.value);
  }
  else {
    cy.startBatch();
    for (var i = 0; i < eles.length; i++) {
      var ele = eles[i];
      ele.data(param.name, param.valueMap[ele.id()]);
    }
    cy.endBatch();
  }

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
    cy.startBatch();
    for (var i = 0; i < eles.length; i++) {
      var ele = eles[i];
      ele.css(param.name, param.valueMap[ele.id()]);
    }
    cy.endBatch();
  }

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9saWItdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyMEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNoaXNlID0gd2luZG93LmNoaXNlID0gZnVuY3Rpb24oX29wdGlvbnMsIF9saWJzKSB7XHJcbiAgICB2YXIgbGlicyA9IHt9O1xyXG4gICAgbGlicy5qUXVlcnkgPSBfbGlicy5qUXVlcnkgfHwgalF1ZXJ5O1xyXG4gICAgbGlicy5jeXRvc2NhcGUgPSBfbGlicy5jeXRvc2NhcGUgfHwgY3l0b3NjYXBlO1xyXG4gICAgbGlicy5zYmdudml6ID0gX2xpYnMuc2JnbnZpeiB8fCBzYmdudml6O1xyXG4gICAgbGlicy5zYXZlQXMgPSBfbGlicy5maWxlc2F2ZXJqcyA/IF9saWJzLmZpbGVzYXZlcmpzLnNhdmVBcyA6IHNhdmVBcztcclxuICAgIFxyXG4gICAgbGlicy5zYmdudml6KF9vcHRpb25zLCBfbGlicyk7IC8vIEluaXRpbGl6ZSBzYmdudml6XHJcbiAgICBcclxuICAgIC8vIFNldCB0aGUgbGlicmFyaWVzIHRvIGFjY2VzcyB0aGVtIGZyb20gYW55IGZpbGVcclxuICAgIHZhciBsaWJVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9saWItdXRpbGl0aWVzJyk7XHJcbiAgICBsaWJVdGlsaXRpZXMuc2V0TGlicyhsaWJzKTtcclxuICAgIFxyXG4gICAgdmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMnKTtcclxuICAgIHZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMoX29wdGlvbnMpOyAvLyBFeHRlbmRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9uc1xyXG4gICAgXHJcbiAgICAvLyBVcGRhdGUgc3R5bGUgYW5kIGJpbmQgZXZlbnRzXHJcbiAgICB2YXIgY3lTdHlsZUFuZEV2ZW50cyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMnKTtcclxuICAgIGN5U3R5bGVBbmRFdmVudHMobGlicy5zYmdudml6KTtcclxuICAgIFxyXG4gICAgLy8gUmVnaXN0ZXIgdW5kby9yZWRvIGFjdGlvbnNcclxuICAgIHZhciByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3JlZ2lzdGVyLXVuZG8tcmVkby1hY3Rpb25zJyk7XHJcbiAgICByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyhvcHRpb25zLnVuZG9hYmxlRHJhZyk7XHJcbiAgICBcclxuICAgIHZhciBtYWluVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvbWFpbi11dGlsaXRpZXMnKTtcclxuICAgIHZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZWxlbWVudC11dGlsaXRpZXMnKTtcclxuICAgIHZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XHJcbiAgICBcclxuICAgIC8vIEV4cG9zZSB0aGUgYXBpXHJcbiAgICBcclxuICAgIC8vIEV4cG9zZSB0aGUgcHJvcGVydGllcyBpbmhlcml0ZWQgZnJvbSBzYmdudml6XHJcbiAgICAvLyB0aGVuIG92ZXJyaWRlIHNvbWUgb2YgdGhlc2UgcHJvcGVydGllcyBhbmQgZXhwb3NlIHNvbWUgbmV3IHByb3BlcnRpZXNcclxuICAgIGZvciAodmFyIHByb3AgaW4gbGlicy5zYmdudml6KSB7XHJcbiAgICAgIGNoaXNlW3Byb3BdID0gbGlicy5zYmdudml6W3Byb3BdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgZWFjaCBtYWluIHV0aWxpdHkgc2VwZXJhdGVseVxyXG4gICAgZm9yICh2YXIgcHJvcCBpbiBtYWluVXRpbGl0aWVzKSB7XHJcbiAgICAgIGNoaXNlW3Byb3BdID0gbWFpblV0aWxpdGllc1twcm9wXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIGVsZW1lbnRVdGlsaXRpZXMgYW5kIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zIGFzIGlzXHJcbiAgICBjaGlzZS5lbGVtZW50VXRpbGl0aWVzID0gZWxlbWVudFV0aWxpdGllcztcclxuICAgIGNoaXNlLnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XHJcbiAgfTtcclxuICBcclxuICBpZiAoIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICkge1xyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBjaGlzZTtcclxuICB9XHJcbn0pKCk7IiwidmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgJCA9IGxpYnMualF1ZXJ5O1xyXG52YXIgb3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpLmdldE9wdGlvbnMoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHNiZ252aXopIHtcclxuICAvL0hlbHBlcnNcclxuICBcclxuICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHRvIGJlIGNhbGxlZCBhZnRlciBub2RlcyBhcmUgcmVzaXplZCB0aHJvdWggdGhlIG5vZGUgcmVzaXplIGV4dGVuc2lvbiBvciB0aHJvdWdoIHVuZG8vcmVkbyBhY3Rpb25zXHJcbiAgdmFyIG5vZGVSZXNpemVFbmRGdW5jdGlvbiA9IGZ1bmN0aW9uIChub2Rlcykge1xyXG4gICAgY3kuc3RhcnRCYXRjaCgpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICB2YXIgdyA9IG5vZGUud2lkdGgoKTtcclxuICAgICAgdmFyIGggPSBub2RlLmhlaWdodCgpO1xyXG5cclxuICAgICAgbm9kZS5yZW1vdmVTdHlsZSgnd2lkdGgnKTtcclxuICAgICAgbm9kZS5yZW1vdmVTdHlsZSgnaGVpZ2h0Jyk7XHJcblxyXG4gICAgICBub2RlLmRhdGEoJ2Jib3gnKS53ID0gdztcclxuICAgICAgbm9kZS5kYXRhKCdiYm94JykuaCA9IGg7XHJcbiAgICB9XHJcbiAgICBjeS5lbmRCYXRjaCgpO1xyXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICB9O1xyXG4gIFxyXG4gIC8vIFVwZGF0ZSBjeSBzdHlsZXNoZWV0XHJcbiAgdmFyIHVwYXRlU3R5bGVTaGVldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY3kuc3R5bGUoKVxyXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bZm9udHdlaWdodF1cIilcclxuICAgIC5zdHlsZSh7XHJcbiAgICAgICdmb250LXdlaWdodCc6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnZm9udHdlaWdodCcpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bZm9udGZhbWlseV1cIilcclxuICAgIC5zdHlsZSh7XHJcbiAgICAgICdmb250LWZhbWlseSc6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnZm9udGZhbWlseScpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bZm9udHN0eWxlXVwiKVxyXG4gICAgLnN0eWxlKHtcclxuICAgICAgJ2ZvbnQtc3R5bGUnOiBmdW5jdGlvbihlbGUpIHtcclxuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2ZvbnRzdHlsZScpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bbGFiZWxzaXplXVwiKVxyXG4gICAgLnN0eWxlKHtcclxuICAgICAgJ2ZvbnQtc2l6ZSc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICAvLyBJZiB0aGUgbm9kZSBoYXMgbGFiZWxzaXplIGRhdGEgY2hlY2sgYWRqdXN0Tm9kZUxhYmVsRm9udFNpemVBdXRvbWF0aWNhbGx5IG9wdGlvbi5cclxuICAgICAgICAvLyBJZiBpdCBpcyBub3Qgc2V0IHVzZSBsYWJlbHNpemUgZGF0YSBhcyBmb250IHNpemUgZWxlcy4gVXNlIGdldExhYmVsVGV4dFNpemUgbWV0aG9kLlxyXG4gICAgICAgIHZhciBvcHQgPSBvcHRpb25zLmFkanVzdE5vZGVMYWJlbEZvbnRTaXplQXV0b21hdGljYWxseTtcclxuICAgICAgICB2YXIgYWRqdXN0ID0gdHlwZW9mIG9wdCA9PT0gJ2Z1bmN0aW9uJyA/IG9wdCgpIDogb3B0O1xyXG4gICAgICAgIGlmICghYWRqdXN0KSB7XHJcbiAgICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2xhYmVsc2l6ZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRMYWJlbFRleHRTaXplKGVsZSk7XHJcbiAgICAgIH1cclxuICAgIH0pLnVwZGF0ZSgpO1xyXG4gIH07XHJcbiAgXHJcbiAgLy8gQmluZCBldmVudHNcclxuICB2YXIgYmluZEN5RXZlbnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjeS5vbihcIm5vZGVyZXNpemUucmVzaXplZW5kXCIsIGZ1bmN0aW9uIChldmVudCwgdHlwZSwgbm9kZSkge1xyXG4gICAgICBub2RlUmVzaXplRW5kRnVuY3Rpb24obm9kZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjeS5vbihcImFmdGVyRG9cIiwgZnVuY3Rpb24gKGV2ZW50LCBhY3Rpb25OYW1lLCBhcmdzKSB7XHJcbiAgICAgIGlmIChhY3Rpb25OYW1lID09PSAnY2hhbmdlUGFyZW50Jykge1xyXG4gICAgICAgIHNiZ252aXoucmVmcmVzaFBhZGRpbmdzKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKFwiYWZ0ZXJVbmRvXCIsIGZ1bmN0aW9uIChldmVudCwgYWN0aW9uTmFtZSwgYXJncykge1xyXG4gICAgICBpZiAoYWN0aW9uTmFtZSA9PT0gJ3Jlc2l6ZScpIHtcclxuICAgICAgICBub2RlUmVzaXplRW5kRnVuY3Rpb24oYXJncy5ub2RlKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChhY3Rpb25OYW1lID09PSAnY2hhbmdlUGFyZW50Jykge1xyXG4gICAgICAgIHNiZ252aXoucmVmcmVzaFBhZGRpbmdzKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKFwiYWZ0ZXJSZWRvXCIsIGZ1bmN0aW9uIChldmVudCwgYWN0aW9uTmFtZSwgYXJncykge1xyXG4gICAgICBpZiAoYWN0aW9uTmFtZSA9PT0gJ3Jlc2l6ZScpIHtcclxuICAgICAgICBub2RlUmVzaXplRW5kRnVuY3Rpb24oYXJncy5ub2RlKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChhY3Rpb25OYW1lID09PSAnY2hhbmdlUGFyZW50Jykge1xyXG4gICAgICAgIHNiZ252aXoucmVmcmVzaFBhZGRpbmdzKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcbiAgLy8gSGVscGVycyBFbmRcclxuICBcclxuICAkKGRvY3VtZW50KS5vbigndXBkYXRlR3JhcGhFbmQnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgY3kuc3RhcnRCYXRjaCgpO1xyXG4gICAgLy8gSW5pdGlsaXplIGZvbnQgcmVsYXRlZCBkYXRhIG9mIHRoZSBlbGVtZW50cyB3aGljaCBjYW4gaGF2ZSBsYWJlbFxyXG4gICAgY3kubm9kZXMoKS5lYWNoKGZ1bmN0aW9uKGksIGVsZSkge1xyXG4gICAgICBpZiAoZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkxhYmVsKGVsZSkpIHtcclxuICAgICAgICB2YXIgX2NsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJykucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcclxuICAgICAgICBlbGUuZGF0YSgnbGFiZWxzaXplJywgZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1tfY2xhc3NdLmxhYmVsc2l6ZSk7XHJcbiAgICAgICAgZWxlLmRhdGEoJ2ZvbnR3ZWlnaHQnLCBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW19jbGFzc10uZm9udHdlaWdodCk7XHJcbiAgICAgICAgZWxlLmRhdGEoJ2ZvbnRmYW1pbHknLCBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW19jbGFzc10uZm9udGZhbWlseSk7XHJcbiAgICAgICAgZWxlLmRhdGEoJ2ZvbnRzdHlsZScsIGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbX2NsYXNzXS5mb250c3R5bGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGN5LmVuZEJhdGNoKCk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgLy8gRG8gdGhlc2UganVzdCBvbmUgdGltZVxyXG4gICQoZG9jdW1lbnQpLm9uZSgndXBkYXRlR3JhcGhFbmQnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgdXBhdGVTdHlsZVNoZWV0KCk7XHJcbiAgICBiaW5kQ3lFdmVudHMoKTtcclxuICB9KTtcclxufTsiLCIvLyBFeHRlbmRzIHNiZ252aXouZWxlbWVudFV0aWxpdGllc1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIHNiZ252aXogPSBsaWJzLnNiZ252aXo7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzO1xyXG52YXIgb3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpLmdldE9wdGlvbnMoKTtcclxuXHJcbmVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXMgPSB7XHJcbiAgXCJwcm9jZXNzXCI6IHtcclxuICAgIHdpZHRoOiAzMCxcclxuICAgIGhlaWdodDogMzBcclxuICB9LFxyXG4gIFwib21pdHRlZCBwcm9jZXNzXCI6IHtcclxuICAgIHdpZHRoOiAzMCxcclxuICAgIGhlaWdodDogMzBcclxuICB9LFxyXG4gIFwidW5jZXJ0YWluIHByb2Nlc3NcIjoge1xyXG4gICAgd2lkdGg6IDMwLFxyXG4gICAgaGVpZ2h0OiAzMFxyXG4gIH0sXHJcbiAgXCJhc3NvY2lhdGlvbnByb2Nlc3NcIjoge1xyXG4gICAgd2lkdGg6IDMwLFxyXG4gICAgaGVpZ2h0OiAzMFxyXG4gIH0sXHJcbiAgXCJhc3NvY2lhdGlvblwiOiB7XHJcbiAgICB3aWR0aDogMzAsXHJcbiAgICBoZWlnaHQ6IDMwXHJcbiAgfSxcclxuICBcImRpc3NvY2lhdGlvblwiOiB7XHJcbiAgICB3aWR0aDogMzAsXHJcbiAgICBoZWlnaHQ6IDMwXHJcbiAgfSxcclxuICBcIm1hY3JvbW9sZWN1bGVcIjoge1xyXG4gICAgd2lkdGg6IDEwMCxcclxuICAgIGhlaWdodDogNTAsXHJcbiAgICBmb250ZmFtaWx5OiAnSGVsdmV0aWNhJyxcclxuICAgIGZvbnR3ZWlnaHQ6ICdub3JtYWwnLFxyXG4gICAgZm9udHN0eWxlOiAnbm9ybWFsJyxcclxuICAgIGxhYmVsc2l6ZTogMjBcclxuICB9LFxyXG4gIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge1xyXG4gICAgd2lkdGg6IDEwMCxcclxuICAgIGhlaWdodDogNTAsXHJcbiAgICBmb250ZmFtaWx5OiAnSGVsdmV0aWNhJyxcclxuICAgIGZvbnR3ZWlnaHQ6ICdub3JtYWwnLFxyXG4gICAgZm9udHN0eWxlOiAnbm9ybWFsJyxcclxuICAgIGxhYmVsc2l6ZTogMjBcclxuICB9LFxyXG4gIFwic2ltcGxlIGNoZW1pY2FsXCI6IHtcclxuICAgIHdpZHRoOiA1MCxcclxuICAgIGhlaWdodDogNTAsXHJcbiAgICBmb250ZmFtaWx5OiAnSGVsdmV0aWNhJyxcclxuICAgIGZvbnR3ZWlnaHQ6ICdub3JtYWwnLFxyXG4gICAgZm9udHN0eWxlOiAnbm9ybWFsJyxcclxuICAgIGxhYmVsc2l6ZTogMjBcclxuICB9LFxyXG4gIFwic291cmNlIGFuZCBzaW5rXCI6IHtcclxuICAgIHdpZHRoOiA1MCxcclxuICAgIGhlaWdodDogNTAsXHJcbiAgICBmb250ZmFtaWx5OiAnSGVsdmV0aWNhJyxcclxuICAgIGZvbnR3ZWlnaHQ6ICdub3JtYWwnLFxyXG4gICAgZm9udHN0eWxlOiAnbm9ybWFsJyxcclxuICAgIGxhYmVsc2l6ZTogMjBcclxuICB9LFxyXG4gIFwidGFnXCI6IHtcclxuICAgIHdpZHRoOiA1MCxcclxuICAgIGhlaWdodDogNTAsXHJcbiAgICBmb250ZmFtaWx5OiAnSGVsdmV0aWNhJyxcclxuICAgIGZvbnR3ZWlnaHQ6ICdub3JtYWwnLFxyXG4gICAgZm9udHN0eWxlOiAnbm9ybWFsJyxcclxuICAgIGxhYmVsc2l6ZTogMjBcclxuICB9LFxyXG4gIFwicGhlbm90eXBlXCI6IHtcclxuICAgIHdpZHRoOiAxMDAsXHJcbiAgICBoZWlnaHQ6IDUwLFxyXG4gICAgZm9udGZhbWlseTogJ0hlbHZldGljYScsXHJcbiAgICBmb250d2VpZ2h0OiAnbm9ybWFsJyxcclxuICAgIGZvbnRzdHlsZTogJ25vcm1hbCcsXHJcbiAgICBsYWJlbHNpemU6IDIwXHJcbiAgfSxcclxuICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiB7XHJcbiAgICB3aWR0aDogMTAwLFxyXG4gICAgaGVpZ2h0OiA1MCxcclxuICAgIGZvbnRmYW1pbHk6ICdIZWx2ZXRpY2EnLFxyXG4gICAgZm9udHdlaWdodDogJ25vcm1hbCcsXHJcbiAgICBmb250c3R5bGU6ICdub3JtYWwnLFxyXG4gICAgbGFiZWxzaXplOiAyMFxyXG4gIH0sXHJcbiAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6IHtcclxuICAgIHdpZHRoOiAxMDAsXHJcbiAgICBoZWlnaHQ6IDUwLFxyXG4gICAgZm9udGZhbWlseTogJ0hlbHZldGljYScsXHJcbiAgICBmb250d2VpZ2h0OiAnbm9ybWFsJyxcclxuICAgIGZvbnRzdHlsZTogJ25vcm1hbCcsXHJcbiAgICBsYWJlbHNpemU6IDIwXHJcbiAgfSxcclxuICBcImNvbXBsZXhcIjoge1xyXG4gICAgd2lkdGg6IDEwMCxcclxuICAgIGhlaWdodDogMTAwLFxyXG4gICAgZm9udGZhbWlseTogJ0hlbHZldGljYScsXHJcbiAgICBmb250d2VpZ2h0OiAnbm9ybWFsJyxcclxuICAgIGZvbnRzdHlsZTogJ25vcm1hbCcsXHJcbiAgICBsYWJlbHNpemU6IDE2XHJcbiAgfSxcclxuICBcImNvbXBhcnRtZW50XCI6IHtcclxuICAgIHdpZHRoOiAxMDAsXHJcbiAgICBoZWlnaHQ6IDEwMCxcclxuICAgIGZvbnRmYW1pbHk6ICdIZWx2ZXRpY2EnLFxyXG4gICAgZm9udHdlaWdodDogJ25vcm1hbCcsXHJcbiAgICBmb250c3R5bGU6ICdub3JtYWwnLFxyXG4gICAgbGFiZWxzaXplOiAxNlxyXG4gIH1cclxufTtcclxuXHJcbi8vIFNlY3Rpb24gU3RhcnRcclxuLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcclxuXHJcbmVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSA9IGZ1bmN0aW9uICh4LCB5LCBzYmduY2xhc3MsIHBhcmVudCwgdmlzaWJpbGl0eSkge1xyXG4gIHZhciBkZWZhdWx0UHJvcGVydGllcyA9IHRoaXMuZGVmYXVsdFByb3BlcnRpZXM7XHJcbiAgdmFyIGRlZmF1bHRzID0gZGVmYXVsdFByb3BlcnRpZXNbc2JnbmNsYXNzXTtcclxuXHJcbiAgdmFyIHdpZHRoID0gZGVmYXVsdHMgPyBkZWZhdWx0cy53aWR0aCA6IDUwO1xyXG4gIHZhciBoZWlnaHQgPSBkZWZhdWx0cyA/IGRlZmF1bHRzLmhlaWdodCA6IDUwO1xyXG4gIFxyXG4gIHZhciBjc3MgPSB7fTtcclxuICBcclxuICBpZiAoZGVmYXVsdHMpIHtcclxuICAgIGlmIChkZWZhdWx0c1snYm9yZGVyLXdpZHRoJ10pIHtcclxuICAgICAgY3NzWydib3JkZXItd2lkdGgnXSA9IGRlZmF1bHRzWydib3JkZXItd2lkdGgnXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKGRlZmF1bHRzWydiYWNrZ3JvdW5kLWNvbG9yJ10pIHtcclxuICAgICAgY3NzWydiYWNrZ3JvdW5kLWNvbG9yJ10gPSBkZWZhdWx0c1snYmFja2dyb3VuZC1jb2xvciddO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAoZGVmYXVsdHNbJ2JhY2tncm91bmQtb3BhY2l0eSddKSB7XHJcbiAgICAgIGNzc1snYmFja2dyb3VuZC1vcGFjaXR5J10gPSBkZWZhdWx0c1snYmFja2dyb3VuZC1vcGFjaXR5J107XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmIChkZWZhdWx0c1snYm9yZGVyLWNvbG9yJ10pIHtcclxuICAgICAgY3NzWydib3JkZXItY29sb3InXSA9IGRlZmF1bHRzWydib3JkZXItY29sb3InXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICh2aXNpYmlsaXR5KSB7XHJcbiAgICBjc3MudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XHJcbiAgfVxyXG5cclxuICBpZiAoZGVmYXVsdHMgJiYgZGVmYXVsdHMubXVsdGltZXIpIHtcclxuICAgIHNiZ25jbGFzcyArPSBcIiBtdWx0aW1lclwiO1xyXG4gIH1cclxuICB2YXIgZGF0YSA9IHtcclxuICAgIGNsYXNzOiBzYmduY2xhc3MsXHJcbiAgICBiYm94OiB7XHJcbiAgICAgIGg6IGhlaWdodCxcclxuICAgICAgdzogd2lkdGgsXHJcbiAgICAgIHg6IHgsXHJcbiAgICAgIHk6IHlcclxuICAgIH0sXHJcbiAgICBzdGF0ZXNhbmRpbmZvczogW10sXHJcbiAgICBwb3J0czogW10sXHJcbiAgICBsYWJlbHNpemU6IGVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbChzYmduY2xhc3MpID8gKGRlZmF1bHRzICYmIGRlZmF1bHRzLmxhYmVsc2l6ZSkgOiB1bmRlZmluZWQsXHJcbiAgICBmb250ZmFtaWx5OiBlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOTGFiZWwoc2JnbmNsYXNzKSA/IChkZWZhdWx0cyAmJiBkZWZhdWx0cy5mb250ZmFtaWx5KSA6IHVuZGVmaW5lZCxcclxuICAgIGZvbnR3ZWlnaHQ6IGVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbChzYmduY2xhc3MpID8gKGRlZmF1bHRzICYmIGRlZmF1bHRzLmZvbnR3ZWlnaHQpIDogdW5kZWZpbmVkLFxyXG4gICAgZm9udHN0eWxlOiBlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOTGFiZWwoc2JnbmNsYXNzKSA/IChkZWZhdWx0cyAmJiBkZWZhdWx0cy5mb250c3R5bGUpIDogdW5kZWZpbmVkLFxyXG4gICAgY2xvbmVtYXJrZXI6IGRlZmF1bHRzICYmIGRlZmF1bHRzLmNsb25lbWFya2VyID8gZGVmYXVsdHMuY2xvbmVtYXJrZXIgOiB1bmRlZmluZWRcclxuICB9O1xyXG5cclxuICBpZiAocGFyZW50KSB7XHJcbiAgICBkYXRhLnBhcmVudCA9IHBhcmVudDtcclxuICB9XHJcblxyXG4gIHZhciBlbGVzID0gY3kuYWRkKHtcclxuICAgIGdyb3VwOiBcIm5vZGVzXCIsXHJcbiAgICBkYXRhOiBkYXRhLFxyXG4gICAgY3NzOiBjc3MsXHJcbiAgICBwb3NpdGlvbjoge1xyXG4gICAgICB4OiB4LFxyXG4gICAgICB5OiB5XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHZhciBuZXdOb2RlID0gZWxlc1tlbGVzLmxlbmd0aCAtIDFdO1xyXG5cclxuICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xyXG4gIHJldHVybiBuZXdOb2RlO1xyXG59O1xyXG5cclxuZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlID0gZnVuY3Rpb24gKHNvdXJjZSwgdGFyZ2V0LCBzYmduY2xhc3MsIHZpc2liaWxpdHkpIHtcclxuICB2YXIgZGVmYXVsdFByb3BlcnRpZXMgPSB0aGlzLmRlZmF1bHRQcm9wZXJ0aWVzO1xyXG4gIHZhciBkZWZhdWx0cyA9IGRlZmF1bHRQcm9wZXJ0aWVzW3NiZ25jbGFzc107XHJcbiAgdmFyIGNzcyA9IGRlZmF1bHRzID8ge1xyXG4gICAgJ3dpZHRoJzogZGVmYXVsdHNbJ3dpZHRoJ11cclxuICB9IDoge307XHJcbiAgXHJcbiAgdmFyIGNzcyA9IHt9O1xyXG4gIFxyXG4gIGlmIChkZWZhdWx0cykge1xyXG4gICAgaWYgKGRlZmF1bHRzLndpZHRoKSB7XHJcbiAgICAgIGNzcy53aWR0aCA9IGRlZmF1bHRzLndpZHRoO1xyXG4gICAgfSBcclxuICAgIFxyXG4gICAgaWYgKGRlZmF1bHRzWydsaW5lLWNvbG9yJ10pIHtcclxuICAgICAgY3NzWydsaW5lLWNvbG9yJ10gPSBkZWZhdWx0c1snbGluZS1jb2xvciddO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKHZpc2liaWxpdHkpIHtcclxuICAgIGNzcy52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcclxuICB9XHJcblxyXG4gIHZhciBlbGVzID0gY3kuYWRkKHtcclxuICAgIGdyb3VwOiBcImVkZ2VzXCIsXHJcbiAgICBkYXRhOiB7XHJcbiAgICAgIHNvdXJjZTogc291cmNlLFxyXG4gICAgICB0YXJnZXQ6IHRhcmdldCxcclxuICAgICAgY2xhc3M6IHNiZ25jbGFzc1xyXG4gICAgfSxcclxuICAgIGNzczogY3NzXHJcbiAgfSk7XHJcblxyXG4gIHZhciBuZXdFZGdlID0gZWxlc1tlbGVzLmxlbmd0aCAtIDFdO1xyXG4gIFxyXG4gIHJldHVybiBuZXdFZGdlO1xyXG59O1xyXG5cclxuLypcclxuICogVGhpcyBtZXRob2QgYXNzdW1lcyB0aGF0IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQgY29udGFpbnMgYXQgbGVhc3Qgb25lIG5vZGVcclxuICogYW5kIGFsbCBvZiB0aGUgbm9kZXMgaW5jbHVkaW5nIGluIGl0IGhhdmUgdGhlIHNhbWUgcGFyZW50LiBJdCBjcmVhdGVzIGEgY29tcG91bmQgZm90IHRoZSBnaXZlbiBub2RlcyBhbiBoYXZpbmcgdGhlIGdpdmVuIHR5cGUuXHJcbiAqL1xyXG5lbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChub2Rlc1RvTWFrZUNvbXBvdW5kLCBjb21wb3VuZFR5cGUpIHtcclxuICB2YXIgb2xkUGFyZW50SWQgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJwYXJlbnRcIik7XHJcbiAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZFxyXG4gIHZhciBuZXdDb21wb3VuZCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29tcG91bmRUeXBlLCBvbGRQYXJlbnRJZCk7XHJcbiAgdmFyIG5ld0NvbXBvdW5kSWQgPSBuZXdDb21wb3VuZC5pZCgpO1xyXG4gIG5vZGVzVG9NYWtlQ29tcG91bmQubW92ZSh7cGFyZW50OiBuZXdDb21wb3VuZElkfSk7XHJcbiAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcclxuICByZXR1cm4gbmV3Q29tcG91bmQ7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBSZW1vdmVzIGEgY29tcG91bmQuIEJlZm9yZSB0aGUgcmVtb3ZhbCBvcGVyYXRpb24gbW92ZXMgdGhlIGNoaWxkcmVuIG9mIHRoYXQgY29tcG91bmQgdG8gdGhlIHBhcmVudCBvZiB0aGUgY29tcG91bmQuXHJcbiAqIFJldHVybnMgb2xkIGNoaWxkcmVuIG9mIHRoZSBjb21wb3VuZCB3aGljaCBhcmUgbW92ZWQgdG8gYW5vdGhlciBwYXJlbnQgYW5kIHRoZSByZW1vdmVkIGNvbXBvdW5kIHRvIHJlc3RvcmUgYmFjayBsYXRlci5cclxuICovXHJcbmVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlQ29tcG91bmQgPSBmdW5jdGlvbiAoY29tcG91bmRUb1JlbW92ZSkge1xyXG4gIHZhciBjb21wb3VuZElkID0gY29tcG91bmRUb1JlbW92ZS5pZCgpO1xyXG4gIHZhciBuZXdQYXJlbnRJZCA9IGNvbXBvdW5kVG9SZW1vdmUuZGF0YShcInBhcmVudFwiKTtcclxuICBuZXdQYXJlbnRJZCA9IG5ld1BhcmVudElkID09PSB1bmRlZmluZWQgPyBudWxsIDogbmV3UGFyZW50SWQ7XHJcbiAgdmFyIGNoaWxkcmVuT2ZDb21wb3VuZCA9IGNvbXBvdW5kVG9SZW1vdmUuY2hpbGRyZW4oKTtcclxuXHJcbiAgY2hpbGRyZW5PZkNvbXBvdW5kLm1vdmUoe3BhcmVudDogbmV3UGFyZW50SWR9KTtcclxuICB2YXIgcmVtb3ZlZENvbXBvdW5kID0gY29tcG91bmRUb1JlbW92ZS5yZW1vdmUoKTtcclxuICBcclxuICByZXR1cm4ge1xyXG4gICAgY2hpbGRyZW5PZkNvbXBvdW5kOiBjaGlsZHJlbk9mQ29tcG91bmQsXHJcbiAgICByZW1vdmVkQ29tcG91bmQ6IHJlbW92ZWRDb21wb3VuZFxyXG4gIH07XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcclxuICogaW4gdGhlIGNvbXBsZXguIFBhcmFtZXRlcnMgYXJlIGV4cGxhaW5lZCBiZWxvdy5cclxuICogdGVtcGxhdGVUeXBlOiBUaGUgdHlwZSBvZiB0aGUgdGVtcGxhdGUgcmVhY3Rpb24uIEl0IG1heSBiZSAnYXNzb2NpYXRpb24nIG9yICdkaXNzb2NpYXRpb24nIGZvciBub3cuXHJcbiAqIG1hY3JvbW9sZWN1bGVMaXN0OiBUaGUgbGlzdCBvZiB0aGUgbmFtZXMgb2YgbWFjcm9tb2xlY3VsZXMgd2hpY2ggd2lsbCBpbnZvbHZlIGluIHRoZSByZWFjdGlvbi5cclxuICogY29tcGxleE5hbWU6IFRoZSBuYW1lIG9mIHRoZSBjb21wbGV4IGluIHRoZSByZWFjdGlvbi5cclxuICogcHJvY2Vzc1Bvc2l0aW9uOiBUaGUgbW9kYWwgcG9zaXRpb24gb2YgdGhlIHByb2Nlc3MgaW4gdGhlIHJlYWN0aW9uLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyB0aGUgY2VudGVyIG9mIHRoZSBjYW52YXMuXHJcbiAqIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cclxuICogdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IFRoaXMgb3B0aW9uIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBjb3NlLWJpbGtlbnQgbGF5b3V0IHdpdGggdGhlIHNhbWUgbmFtZS4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgMTUuXHJcbiAqIGVkZ2VMZW5ndGg6IFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBwcm9jZXNzIGFuZCB0aGUgbWFjcm9tb2xlY3VsZXMgYXQgdGhlIGJvdGggc2lkZXMuXHJcbiAqL1xyXG5lbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAodGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCkge1xyXG4gIHZhciBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbXCJtYWNyb21vbGVjdWxlXCJdO1xyXG4gIHZhciB0ZW1wbGF0ZVR5cGUgPSB0ZW1wbGF0ZVR5cGU7XHJcbiAgdmFyIHByb2Nlc3NXaWR0aCA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbdGVtcGxhdGVUeXBlXSA/IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbdGVtcGxhdGVUeXBlXS53aWR0aCA6IDUwO1xyXG4gIHZhciBtYWNyb21vbGVjdWxlV2lkdGggPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA/IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLndpZHRoIDogNTA7XHJcbiAgdmFyIG1hY3JvbW9sZWN1bGVIZWlnaHQgPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA/IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLmhlaWdodCA6IDUwO1xyXG4gIHZhciBwcm9jZXNzUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24gPyBwcm9jZXNzUG9zaXRpb24gOiBlbGVtZW50VXRpbGl0aWVzLmNvbnZlcnRUb01vZGVsUG9zaXRpb24oe3g6IGN5LndpZHRoKCkgLyAyLCB5OiBjeS5oZWlnaHQoKSAvIDJ9KTtcclxuICB2YXIgbWFjcm9tb2xlY3VsZUxpc3QgPSBtYWNyb21vbGVjdWxlTGlzdDtcclxuICB2YXIgY29tcGxleE5hbWUgPSBjb21wbGV4TmFtZTtcclxuICB2YXIgbnVtT2ZNYWNyb21vbGVjdWxlcyA9IG1hY3JvbW9sZWN1bGVMaXN0Lmxlbmd0aDtcclxuICB2YXIgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsID0gdGlsaW5nUGFkZGluZ1ZlcnRpY2FsID8gdGlsaW5nUGFkZGluZ1ZlcnRpY2FsIDogMTU7XHJcbiAgdmFyIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID0gdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPyB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA6IDE1O1xyXG4gIHZhciBlZGdlTGVuZ3RoID0gZWRnZUxlbmd0aCA/IGVkZ2VMZW5ndGggOiA2MDtcclxuXHJcbiAgY3kuc3RhcnRCYXRjaCgpO1xyXG5cclxuICB2YXIgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXM7XHJcbiAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xyXG4gICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xyXG4gIH1cclxuXHJcbiAgLy9DcmVhdGUgdGhlIHByb2Nlc3MgaW4gdGVtcGxhdGUgdHlwZVxyXG4gIHZhciBwcm9jZXNzID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwgdGVtcGxhdGVUeXBlKTtcclxuICBwcm9jZXNzLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xyXG5cclxuICAvL0RlZmluZSB0aGUgc3RhcnRpbmcgeSBwb3NpdGlvblxyXG4gIHZhciB5UG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZNYWNyb21vbGVjdWxlcyAtIDEpIC8gMikgKiAobWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XHJcblxyXG4gIC8vQ3JlYXRlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1PZk1hY3JvbW9sZWN1bGVzOyBpKyspIHtcclxuICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzLCB5UG9zaXRpb24sIFwibWFjcm9tb2xlY3VsZVwiKTtcclxuICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcbiAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgbWFjcm9tb2xlY3VsZUxpc3RbaV0pO1xyXG5cclxuICAgIC8vY3JlYXRlIHRoZSBlZGdlIGNvbm5lY3RlZCB0byB0aGUgbmV3IG1hY3JvbW9sZWN1bGVcclxuICAgIHZhciBuZXdFZGdlO1xyXG4gICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xyXG4gICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKG5ld05vZGUuaWQoKSwgcHJvY2Vzcy5pZCgpLCAnY29uc3VtcHRpb24nKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgbmV3Tm9kZS5pZCgpLCAncHJvZHVjdGlvbicpO1xyXG4gICAgfVxyXG5cclxuICAgIG5ld0VkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcblxyXG4gICAgLy91cGRhdGUgdGhlIHkgcG9zaXRpb25cclxuICAgIHlQb3NpdGlvbiArPSBtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xyXG4gIH1cclxuXHJcbiAgLy9DcmVhdGUgdGhlIGNvbXBsZXggaW5jbHVkaW5nIG1hY3JvbW9sZWN1bGVzIGluc2lkZSBvZiBpdFxyXG4gIC8vVGVtcHJvcmFyaWx5IGFkZCBpdCB0byB0aGUgcHJvY2VzcyBwb3NpdGlvbiB3ZSB3aWxsIG1vdmUgaXQgYWNjb3JkaW5nIHRvIHRoZSBsYXN0IHNpemUgb2YgaXRcclxuICB2YXIgY29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksICdjb21wbGV4Jyk7XHJcbiAgY29tcGxleC5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcclxuICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcclxuXHJcbiAgLy9JZiBhIG5hbWUgaXMgc3BlY2lmaWVkIGZvciB0aGUgY29tcGxleCBzZXQgaXRzIGxhYmVsIGFjY29yZGluZ2x5XHJcbiAgaWYgKGNvbXBsZXhOYW1lKSB7XHJcbiAgICBjb21wbGV4LmRhdGEoJ2xhYmVsJywgY29tcGxleE5hbWUpO1xyXG4gIH1cclxuXHJcbiAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubm5lY3RlZCB0byB0aGUgY29tcGxleFxyXG4gIHZhciBlZGdlT2ZDb21wbGV4O1xyXG4gIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcclxuICAgIGVkZ2VPZkNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBjb21wbGV4LmlkKCksICdwcm9kdWN0aW9uJyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWRnZU9mQ29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShjb21wbGV4LmlkKCksIHByb2Nlc3MuaWQoKSwgJ2NvbnN1bXB0aW9uJyk7XHJcbiAgfVxyXG4gIGVkZ2VPZkNvbXBsZXguZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcblxyXG4gIC8vQ3JlYXRlIHRoZSBtYWNyb21vbGVjdWxlcyBpbnNpZGUgdGhlIGNvbXBsZXhcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mTWFjcm9tb2xlY3VsZXM7IGkrKykge1xyXG4gICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoY29tcGxleC5wb3NpdGlvbigneCcpLCBjb21wbGV4LnBvc2l0aW9uKCd5JyksIFwibWFjcm9tb2xlY3VsZVwiLCBjb21wbGV4LmlkKCkpO1xyXG4gICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcclxuICAgIG5ld05vZGUuZGF0YSgnbGFiZWwnLCBtYWNyb21vbGVjdWxlTGlzdFtpXSk7XHJcbiAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuZW5kQmF0Y2goKTtcclxuXHJcbiAgdmFyIGxheW91dE5vZGVzID0gY3kubm9kZXMoJ1tqdXN0QWRkZWRMYXlvdXROb2RlXScpO1xyXG4gIGxheW91dE5vZGVzLnJlbW92ZURhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnKTtcclxuICBsYXlvdXROb2Rlcy5sYXlvdXQoe1xyXG4gICAgbmFtZTogJ2Nvc2UtYmlsa2VudCcsXHJcbiAgICByYW5kb21pemU6IGZhbHNlLFxyXG4gICAgZml0OiBmYWxzZSxcclxuICAgIGFuaW1hdGU6IGZhbHNlLFxyXG4gICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXHJcbiAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXHJcbiAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vcmUtcG9zaXRpb24gdGhlIG5vZGVzIGluc2lkZSB0aGUgY29tcGxleFxyXG4gICAgICB2YXIgc3VwcG9zZWRYUG9zaXRpb247XHJcbiAgICAgIHZhciBzdXBwb3NlZFlQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi55O1xyXG5cclxuICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xyXG4gICAgICAgIHN1cHBvc2VkWFBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIGNvbXBsZXgub3V0ZXJXaWR0aCgpIC8gMjtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBzdXBwb3NlZFhQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBjb21wbGV4Lm91dGVyV2lkdGgoKSAvIDI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBwb3NpdGlvbkRpZmZYID0gc3VwcG9zZWRYUG9zaXRpb24gLSBjb21wbGV4LnBvc2l0aW9uKCd4Jyk7XHJcbiAgICAgIHZhciBwb3NpdGlvbkRpZmZZID0gc3VwcG9zZWRZUG9zaXRpb24gLSBjb21wbGV4LnBvc2l0aW9uKCd5Jyk7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NpdGlvbkRpZmZYLCB5OiBwb3NpdGlvbkRpZmZZfSwgY29tcGxleCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vZmlsdGVyIHRoZSBqdXN0IGFkZGVkIGVsZW1lbXRzIHRvIHJldHVybiB0aGVtIGFuZCByZW1vdmUganVzdCBhZGRlZCBtYXJrXHJcbiAgdmFyIGVsZXMgPSBjeS5lbGVtZW50cygnW2p1c3RBZGRlZF0nKTtcclxuICBlbGVzLnJlbW92ZURhdGEoJ2p1c3RBZGRlZCcpO1xyXG4gIFxyXG4gIHNiZ252aXoucmVmcmVzaFBhZGRpbmdzKCk7XHJcbiAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xyXG4gIGVsZXMuc2VsZWN0KCk7XHJcbiAgXHJcbiAgcmV0dXJuIGVsZXM7IC8vIFJldHVybiB0aGUganVzdCBhZGRlZCBlbGVtZW50c1xyXG59O1xyXG5cclxuLypcclxuICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXHJcbiAqL1xyXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZVBhcmVudCA9IGZ1bmN0aW9uKG5vZGVzLCBuZXdQYXJlbnQsIHBvc0RpZmZYLCBwb3NEaWZmWSkge1xyXG4gIHZhciBuZXdQYXJlbnRJZCA9IHR5cGVvZiBuZXdQYXJlbnQgPT09ICdzdHJpbmcnID8gbmV3UGFyZW50IDogbmV3UGFyZW50LmlkKCk7XHJcbiAgbm9kZXMubW92ZSh7XCJwYXJlbnRcIjogbmV3UGFyZW50SWR9KTtcclxuICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyh7eDogcG9zRGlmZlgsIHk6IHBvc0RpZmZZfSwgbm9kZXMpO1xyXG59O1xyXG5cclxuLy8gUmVzaXplIGdpdmVuIG5vZGVzIGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeSBvbmUgb2Ygd2lkdGggb3IgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0LlxyXG5lbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbykge1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICB2YXIgcmF0aW8gPSB1bmRlZmluZWQ7XHJcbiAgICB2YXIgZWxlTXVzdEJlU3F1YXJlID0gZWxlbWVudFV0aWxpdGllcy5tdXN0QmVTcXVhcmUobm9kZS5kYXRhKCdjbGFzcycpKTtcclxuXHJcbiAgICAvLyBOb3RlIHRoYXQgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0IGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeVxyXG4gICAgaWYgKHdpZHRoKSB7XHJcbiAgICAgIGlmICh1c2VBc3BlY3RSYXRpbyB8fCBlbGVNdXN0QmVTcXVhcmUpIHtcclxuICAgICAgICByYXRpbyA9IHdpZHRoIC8gbm9kZS53aWR0aCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSB3aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaGVpZ2h0KSB7XHJcbiAgICAgIGlmICh1c2VBc3BlY3RSYXRpbyB8fCBlbGVNdXN0QmVTcXVhcmUpIHtcclxuICAgICAgICByYXRpbyA9IGhlaWdodCAvIG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IGhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmF0aW8gJiYgIWhlaWdodCkge1xyXG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBub2RlLmhlaWdodCgpICogcmF0aW87XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChyYXRpbyAmJiAhd2lkdGgpIHtcclxuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gbm9kZS53aWR0aCgpICogcmF0aW87XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gU2VjdGlvbiBFbmRcclxuLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcclxuXHJcbi8vIFNlY3Rpb24gU3RhcnRcclxuLy8gQ29tbW9uIGVsZW1lbnQgcHJvcGVydGllc1xyXG5cclxuLy8gR2V0IGNvbW1vbiBwcm9wZXJ0aWVzIG9mIGdpdmVuIGVsZW1lbnRzLiBSZXR1cm5zIG51bGwgaWYgdGhlIGdpdmVuIGVsZW1lbnQgbGlzdCBpcyBlbXB0eSBvciB0aGVcclxuLy8gcHJvcGVydHkgaXMgbm90IGNvbW1vbiBmb3IgYWxsIGVsZW1lbnRzLiBkYXRhT3JDc3MgcGFyYW1ldGVyIHNwZWNpZnkgd2hldGhlciB0byBjaGVjayB0aGUgcHJvcGVydHkgb24gZGF0YSBvciBjc3MuXHJcbi8vIFRoZSBkZWZhdWx0IHZhbHVlIGZvciBpdCBpcyBkYXRhLiBJZiBwcm9wZXJ0eU5hbWUgcGFyYW1ldGVyIGlzIGdpdmVuIGFzIGEgZnVuY3Rpb24gaW5zdGVhZCBvZiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIFxyXG4vLyBwcm9wZXJ0eSBuYW1lIHRoZW4gdXNlIHdoYXQgdGhhdCBmdW5jdGlvbiByZXR1cm5zLlxyXG5lbGVtZW50VXRpbGl0aWVzLmdldENvbW1vblByb3BlcnR5ID0gZnVuY3Rpb24gKGVsZW1lbnRzLCBwcm9wZXJ0eU5hbWUsIGRhdGFPckNzcykge1xyXG4gIGlmIChlbGVtZW50cy5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICB2YXIgaXNGdW5jdGlvbjtcclxuICAvLyBJZiB3ZSBhcmUgbm90IGNvbXBhcmluZyB0aGUgcHJvcGVydGllcyBkaXJlY3RseSB1c2VycyBjYW4gc3BlY2lmeSBhIGZ1bmN0aW9uIGFzIHdlbGxcclxuICBpZiAodHlwZW9mIHByb3BlcnR5TmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgaXNGdW5jdGlvbiA9IHRydWU7XHJcbiAgfVxyXG5cclxuICAvLyBVc2UgZGF0YSBhcyBkZWZhdWx0XHJcbiAgaWYgKCFpc0Z1bmN0aW9uICYmICFkYXRhT3JDc3MpIHtcclxuICAgIGRhdGFPckNzcyA9ICdkYXRhJztcclxuICB9XHJcblxyXG4gIHZhciB2YWx1ZSA9IGlzRnVuY3Rpb24gPyBwcm9wZXJ0eU5hbWUoZWxlbWVudHNbMF0pIDogZWxlbWVudHNbMF1bZGF0YU9yQ3NzXShwcm9wZXJ0eU5hbWUpO1xyXG5cclxuICBmb3IgKHZhciBpID0gMTsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoICggaXNGdW5jdGlvbiA/IHByb3BlcnR5TmFtZShlbGVtZW50c1tpXSkgOiBlbGVtZW50c1tpXVtkYXRhT3JDc3NdKHByb3BlcnR5TmFtZSkgKSAhPSB2YWx1ZSkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB2YWx1ZTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgaWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgYSB0cnV0aHkgdmFsdWUgZm9yIGFsbCBvZiB0aGUgZ2l2ZW4gZWxlbWVudHMuXHJcbmVsZW1lbnRVdGlsaXRpZXMudHJ1ZUZvckFsbEVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZW1lbnRzLCBmY24pIHtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoIWZjbihlbGVtZW50c1tpXSkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBjYW4gaGF2ZSBzYmduY2FyZGluYWxpdHlcclxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkNhcmRpbmFsaXR5ID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xyXG5cclxuICByZXR1cm4gZWxlLmRhdGEoJ2NsYXNzJykgPT0gJ2NvbnN1bXB0aW9uJyB8fCBlbGUuZGF0YSgnY2xhc3MnKSA9PSAncHJvZHVjdGlvbic7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBjYW4gaGF2ZSBzYmdubGFiZWxcclxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkxhYmVsID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xyXG5cclxuICByZXR1cm4gc2JnbmNsYXNzICE9ICdhbmQnICYmIHNiZ25jbGFzcyAhPSAnb3InICYmIHNiZ25jbGFzcyAhPSAnbm90J1xyXG4gICAgICAgICAgJiYgc2JnbmNsYXNzICE9ICdhc3NvY2lhdGlvbicgJiYgc2JnbmNsYXNzICE9ICdkaXNzb2NpYXRpb24nICYmICFzYmduY2xhc3MuZW5kc1dpdGgoJ3Byb2Nlc3MnKTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZSBlbGVtZW50IGhhdmUgdW5pdCBvZiBpbmZvcm1hdGlvblxyXG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVVbml0T2ZJbmZvcm1hdGlvbiA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcclxuXHJcbiAgaWYgKHNiZ25jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4JyB8fCBzYmduY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCBtdWx0aW1lcidcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZSBtdWx0aW1lcicgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSBtdWx0aW1lcidcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCBtdWx0aW1lcicpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBoYXZlIHN0YXRlIHZhcmlhYmxlXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVN0YXRlVmFyaWFibGUgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XHJcblxyXG4gIGlmIChzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUnIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXgnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUgbXVsdGltZXInIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUgbXVsdGltZXInXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXggbXVsdGltZXInKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGUgc2hvdWxkIGJlIHNxdWFyZSBpbiBzaGFwZVxyXG5lbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZSA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcclxuXHJcbiAgcmV0dXJuIChzYmduY2xhc3MuaW5kZXhPZigncHJvY2VzcycpICE9IC0xIHx8IHNiZ25jbGFzcyA9PSAnc291cmNlIGFuZCBzaW5rJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdhbmQnIHx8IHNiZ25jbGFzcyA9PSAnb3InIHx8IHNiZ25jbGFzcyA9PSAnbm90J1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdhc3NvY2lhdGlvbicgfHwgc2JnbmNsYXNzID09ICdkaXNzb2NpYXRpb24nKTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciBhbnkgb2YgdGhlIGdpdmVuIG5vZGVzIG11c3Qgbm90IGJlIGluIHNxdWFyZSBzaGFwZVxyXG5lbGVtZW50VXRpbGl0aWVzLnNvbWVNdXN0Tm90QmVTcXVhcmUgPSBmdW5jdGlvbiAobm9kZXMpIHtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZShub2RlLmRhdGEoJ2NsYXNzJykpKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlcyBlbGVtZW50IGNhbiBiZSBjbG9uZWRcclxuZWxlbWVudFV0aWxpdGllcy5jYW5CZUNsb25lZCA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XHJcblxyXG4gIHZhciBsaXN0ID0ge1xyXG4gICAgJ3Vuc3BlY2lmaWVkIGVudGl0eSc6IHRydWUsXHJcbiAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAnY29tcGxleCc6IHRydWUsXHJcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxyXG4gICAgJ3NpbXBsZSBjaGVtaWNhbCc6IHRydWUsXHJcbiAgICAncGVydHVyYmluZyBhZ2VudCc6IHRydWVcclxuICB9O1xyXG5cclxuICByZXR1cm4gbGlzdFtzYmduY2xhc3NdID8gdHJ1ZSA6IGZhbHNlO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlcyBlbGVtZW50IGNhbiBiZSBjbG9uZWRcclxuZWxlbWVudFV0aWxpdGllcy5jYW5CZU11bHRpbWVyID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcclxuXHJcbiAgdmFyIGxpc3QgPSB7XHJcbiAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAnY29tcGxleCc6IHRydWUsXHJcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxyXG4gICAgJ3NpbXBsZSBjaGVtaWNhbCc6IHRydWVcclxuICB9O1xyXG5cclxuICByZXR1cm4gbGlzdFtzYmduY2xhc3NdID8gdHJ1ZSA6IGZhbHNlO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGVtZW50IGlzIGFuIEVQTlxyXG5lbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xyXG5cclxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAndW5zcGVjaWZpZWQgZW50aXR5J1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4Jyk7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgaXMgYSBQTlxyXG5lbGVtZW50VXRpbGl0aWVzLmlzUE5DbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XHJcblxyXG4gIHJldHVybiAoc2JnbmNsYXNzID09ICdwcm9jZXNzJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdvbWl0dGVkIHByb2Nlc3MnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ3VuY2VydGFpbiBwcm9jZXNzJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdhc3NvY2lhdGlvbidcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnZGlzc29jaWF0aW9uJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdwaGVub3R5cGUnKTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhIGxvZ2ljYWwgb3BlcmF0b3JcclxuZWxlbWVudFV0aWxpdGllcy5pc0xvZ2ljYWxPcGVyYXRvciA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcclxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAnYW5kJyB8fCBzYmduY2xhc3MgPT0gJ29yJyB8fCBzYmduY2xhc3MgPT0gJ25vdCcpO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBjbGFzcyBvZiBnaXZlbiBlbGVtZW50IGlzIGEgZXF1aXZhbGFuY2UgY2xhc3NcclxuZWxlbWVudFV0aWxpdGllcy5jb252ZW5pZW50VG9FcXVpdmFsZW5jZSA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcclxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAndGFnJyB8fCBzYmduY2xhc3MgPT0gJ3Rlcm1pbmFsJyk7XHJcbn07XHJcblxyXG4vLyBSZWxvY2F0ZXMgc3RhdGUgYW5kIGluZm8gYm94ZXMuIFRoaXMgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gYmUgY2FsbGVkIGFmdGVyIGFkZC9yZW1vdmUgc3RhdGUgYW5kIGluZm8gYm94ZXNcclxuZWxlbWVudFV0aWxpdGllcy5yZWxvY2F0ZVN0YXRlQW5kSW5mb3MgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHN0YXRlQW5kSW5mb3MgPSAoZWxlLmlzTm9kZSAmJiBlbGUuaXNOb2RlKCkpID8gZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykgOiBlbGU7XHJcbiAgdmFyIGxlbmd0aCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoO1xyXG4gIGlmIChsZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBlbHNlIGlmIChsZW5ndGggPT0gMSkge1xyXG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAwO1xyXG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGxlbmd0aCA9PSAyKSB7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcclxuXHJcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDA7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IDUwO1xyXG4gIH1cclxuICBlbHNlIGlmIChsZW5ndGggPT0gMykge1xyXG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAtMjU7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcclxuXHJcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDI1O1xyXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSAtNTA7XHJcblxyXG4gICAgc3RhdGVBbmRJbmZvc1syXS5iYm94LnggPSAwO1xyXG4gICAgc3RhdGVBbmRJbmZvc1syXS5iYm94LnkgPSA1MDtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IC0yNTtcclxuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xyXG5cclxuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IC01MDtcclxuXHJcbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IC0yNTtcclxuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC55ID0gNTA7XHJcblxyXG4gICAgc3RhdGVBbmRJbmZvc1szXS5iYm94LnggPSAyNTtcclxuICAgIHN0YXRlQW5kSW5mb3NbM10uYmJveC55ID0gNTA7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gQ2hhbmdlIHN0YXRlIHZhbHVlIG9yIHVuaXQgb2YgaW5mb3JtYXRpb24gYm94IG9mIGdpdmVuIG5vZGVzIHdpdGggZ2l2ZW4gaW5kZXguXHJcbi8vIFR5cGUgcGFyYW1ldGVyIGluZGljYXRlcyB3aGV0aGVyIHRvIGNoYW5nZSB2YWx1ZSBvciB2YXJpYWJsZSwgaXQgaXMgdmFsaWQgaWYgdGhlIGJveCBhdCB0aGUgZ2l2ZW4gaW5kZXggaXMgYSBzdGF0ZSB2YXJpYWJsZS5cclxuLy8gVmFsdWUgcGFyYW1ldGVyIGlzIHRoZSBuZXcgdmFsdWUgdG8gc2V0LlxyXG4vLyBUaGlzIG1ldGhvZCB0aGUgb2xkIHZhbHVlIG9mIHRoZSBjaGFuZ2VkIGRhdGEgKFdlIGFzc3VtZSB0aGF0IHRoZSBvbGQgdmFsdWUgb2YgdGhlIGNoYW5nZWQgZGF0YSB3YXMgdGhlIHNhbWUgZm9yIGFsbCBub2RlcykuXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAobm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSkge1xyXG4gIHZhciByZXN1bHQ7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xyXG4gICAgdmFyIGJveCA9IHN0YXRlQW5kSW5mb3NbaW5kZXhdO1xyXG5cclxuICAgIGlmIChib3guY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7XHJcbiAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gYm94LnN0YXRlW3R5cGVdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBib3guc3RhdGVbdHlwZV0gPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGJveC5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xyXG4gICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgIHJlc3VsdCA9IGJveC5sYWJlbC50ZXh0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBib3gubGFiZWwudGV4dCA9IHZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8vIEFkZCBhIG5ldyBzdGF0ZSBvciBpbmZvIGJveCB0byBnaXZlbiBub2Rlcy5cclxuLy8gVGhlIGJveCBpcyByZXByZXNlbnRlZCBieSB0aGUgcGFyYW1ldGVyIG9iai5cclxuLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGp1c3QgYWRkZWQgYm94LlxyXG5lbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBvYmopIHtcclxuICB2YXIgaW5kZXg7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xyXG4gICAgXHJcbiAgICAvLyBDbG9uZSB0aGUgb2JqZWN0IHRvIGF2b2lkIHJlZmVyZW5jaW5nIGlzc3Vlc1xyXG4gICAgdmFyIGNsb25lID0galF1ZXJ5LmV4dGVuZCh0cnVlLCB7fSwgb2JqKTtcclxuICAgIFxyXG4gICAgc3RhdGVBbmRJbmZvcy5wdXNoKGNsb25lKTtcclxuICAgIGluZGV4ID0gc3RhdGVBbmRJbmZvcy5sZW5ndGggLSAxO1xyXG4gICAgdGhpcy5yZWxvY2F0ZVN0YXRlQW5kSW5mb3Moc3RhdGVBbmRJbmZvcyk7IC8vIFJlbG9jYXRlIHN0YXRlIGFuZCBpbmZvc1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGluZGV4O1xyXG59O1xyXG5cclxuLy8gUmVtb3ZlIHRoZSBzdGF0ZSBvciBpbmZvIGJveGVzIG9mIHRoZSBnaXZlbiBub2RlcyBhdCBnaXZlbiBpbmRleC5cclxuLy8gUmV0dXJucyB0aGUgcmVtb3ZlZCBib3guXHJcbmVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAobm9kZXMsIGluZGV4KSB7XHJcbiAgdmFyIG9iajtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XHJcbiAgICBpZiAoIW9iaikge1xyXG4gICAgICBvYmogPSBzdGF0ZUFuZEluZm9zW2luZGV4XTtcclxuICAgIH1cclxuICAgIHN0YXRlQW5kSW5mb3Muc3BsaWNlKGluZGV4LCAxKTsgLy8gUmVtb3ZlIHRoZSBib3hcclxuICAgIHRoaXMucmVsb2NhdGVTdGF0ZUFuZEluZm9zKHN0YXRlQW5kSW5mb3MpOyAvLyBSZWxvY2F0ZSBzdGF0ZSBhbmQgaW5mb3NcclxuICB9XHJcblxyXG4gIHJldHVybiBvYmo7XHJcbn07XHJcblxyXG4vLyBTZXQgbXVsdGltZXIgc3RhdHVzIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxyXG5lbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24gKG5vZGVzLCBzdGF0dXMpIHtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgdmFyIHNiZ25jbGFzcyA9IG5vZGUuZGF0YSgnY2xhc3MnKTtcclxuICAgIHZhciBpc011bHRpbWVyID0gbm9kZS5kYXRhKCdjbGFzcycpLmVuZHNXaXRoKCcgbXVsdGltZXInKTtcclxuXHJcbiAgICBpZiAoc3RhdHVzKSB7IC8vIE1ha2UgbXVsdGltZXIgc3RhdHVzIHRydWVcclxuICAgICAgaWYgKCFpc011bHRpbWVyKSB7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdjbGFzcycsIHNiZ25jbGFzcyArICcgbXVsdGltZXInKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7IC8vIE1ha2UgbXVsdGltZXIgc3RhdHVzIGZhbHNlXHJcbiAgICAgIGlmIChpc011bHRpbWVyKSB7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdjbGFzcycsIHNiZ25jbGFzcy5yZXBsYWNlKCcgbXVsdGltZXInLCAnJykpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gU2V0IGNsb25lIG1hcmtlciBzdGF0dXMgb2YgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cclxuZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uIChub2Rlcywgc3RhdHVzKSB7XHJcbiAgaWYgKHN0YXR1cykge1xyXG4gICAgbm9kZXMuZGF0YSgnY2xvbmVtYXJrZXInLCB0cnVlKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBub2Rlcy5yZW1vdmVEYXRhKCdjbG9uZW1hcmtlcicpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uKClcclxuXHJcbi8vIENoYW5nZSBmb250IHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIGVsZW1lbnRzIHdpdGggZ2l2ZW4gZm9udCBkYXRhXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbiAoZWxlcywgZGF0YSkge1xyXG4gIGZvciAodmFyIHByb3AgaW4gZGF0YSkge1xyXG4gICAgZWxlcy5kYXRhKHByb3AsIGRhdGFbcHJvcF0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIFRoaXMgZnVuY3Rpb24gZ2V0cyBhbiBlZGdlLCBhbmQgZW5kcyBvZiB0aGF0IGVkZ2UgKE9wdGlvbmFsbHkgaXQgbWF5IHRha2UganVzdCB0aGUgY2xhc3NlcyBvZiB0aGVzZSBlbGVtZW50cyBhcyB3ZWxsKSBhcyBwYXJhbWV0ZXJzLlxyXG4vLyBJdCBtYXkgcmV0dXJuICd2YWxpZCcgKHRoYXQgZW5kcyBpcyB2YWxpZCBmb3IgdGhhdCBlZGdlKSwgJ3JldmVyc2UnICh0aGF0IGVuZHMgaXMgbm90IHZhbGlkIGZvciB0aGF0IGVkZ2UgYnV0IHRoZXkgd291bGQgYmUgdmFsaWQgXHJcbi8vIGlmIHlvdSByZXZlcnNlIHRoZSBzb3VyY2UgYW5kIHRhcmdldCksICdpbnZhbGlkJyAodGhhdCBlbmRzIGFyZSB0b3RhbGx5IGludmFsaWQgZm9yIHRoYXQgZWRnZSkuXHJcbmVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMgPSBmdW5jdGlvbiAoZWRnZSwgc291cmNlLCB0YXJnZXQpIHtcclxuICB2YXIgZWRnZWNsYXNzID0gdHlwZW9mIGVkZ2UgPT09ICdzdHJpbmcnID8gZWRnZSA6IGVkZ2UuZGF0YSgnY2xhc3MnKTtcclxuICB2YXIgc291cmNlY2xhc3MgPSB0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyA/IHNvdXJjZSA6IHNvdXJjZS5kYXRhKCdjbGFzcycpO1xyXG4gIHZhciB0YXJnZXRjbGFzcyA9IHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnID8gdGFyZ2V0IDogdGFyZ2V0LmRhdGEoJ2NsYXNzJyk7XHJcblxyXG4gIGlmIChlZGdlY2xhc3MgPT0gJ2NvbnN1bXB0aW9uJyB8fCBlZGdlY2xhc3MgPT0gJ21vZHVsYXRpb24nXHJcbiAgICAgICAgICB8fCBlZGdlY2xhc3MgPT0gJ3N0aW11bGF0aW9uJyB8fCBlZGdlY2xhc3MgPT0gJ2NhdGFseXNpcydcclxuICAgICAgICAgIHx8IGVkZ2VjbGFzcyA9PSAnaW5oaWJpdGlvbicgfHwgZWRnZWNsYXNzID09ICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKSB7XHJcbiAgICBpZiAoIXRoaXMuaXNFUE5DbGFzcyhzb3VyY2VjbGFzcykgfHwgIXRoaXMuaXNQTkNsYXNzKHRhcmdldGNsYXNzKSkge1xyXG4gICAgICBpZiAodGhpcy5pc1BOQ2xhc3Moc291cmNlY2xhc3MpICYmIHRoaXMuaXNFUE5DbGFzcyh0YXJnZXRjbGFzcykpIHtcclxuICAgICAgICAvL0lmIGp1c3QgdGhlIGRpcmVjdGlvbiBpcyBub3QgdmFsaWQgcmV2ZXJzZSB0aGUgZGlyZWN0aW9uXHJcbiAgICAgICAgcmV0dXJuICdyZXZlcnNlJztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gJ2ludmFsaWQnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGVkZ2VjbGFzcyA9PSAncHJvZHVjdGlvbicpIHtcclxuICAgIGlmICghdGhpcy5pc1BOQ2xhc3Moc291cmNlY2xhc3MpIHx8ICF0aGlzLmlzRVBOQ2xhc3ModGFyZ2V0Y2xhc3MpKSB7XHJcbiAgICAgIGlmICh0aGlzLmlzRVBOQ2xhc3Moc291cmNlY2xhc3MpICYmIHRoaXMuaXNQTkNsYXNzKHRhcmdldGNsYXNzKSkge1xyXG4gICAgICAgIC8vSWYganVzdCB0aGUgZGlyZWN0aW9uIGlzIG5vdCB2YWxpZCByZXZlcnNlIHRoZSBkaXJlY3Rpb25cclxuICAgICAgICByZXR1cm4gJ3JldmVyc2UnO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAnaW52YWxpZCc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgZWxzZSBpZiAoZWRnZWNsYXNzID09ICdsb2dpYyBhcmMnKSB7XHJcbiAgICB2YXIgaW52YWxpZCA9IGZhbHNlO1xyXG4gICAgaWYgKCF0aGlzLmlzRVBOQ2xhc3Moc291cmNlY2xhc3MpIHx8ICF0aGlzLmlzTG9naWNhbE9wZXJhdG9yKHRhcmdldGNsYXNzKSkge1xyXG4gICAgICBpZiAodGhpcy5pc0xvZ2ljYWxPcGVyYXRvcihzb3VyY2VjbGFzcykgJiYgdGhpcy5pc0VQTkNsYXNzKHRhcmdldGNsYXNzKSkge1xyXG4gICAgICAgIC8vSWYganVzdCB0aGUgZGlyZWN0aW9uIGlzIG5vdCB2YWxpZCByZXZlcnNlIHRoZSBkaXJlY3Rpb25cclxuICAgICAgICByZXR1cm4gJ3JldmVyc2UnO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGludmFsaWQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGhlIGNhc2UgdGhhdCBib3RoIHNpZGVzIGFyZSBsb2dpY2FsIG9wZXJhdG9ycyBhcmUgdmFsaWQgdG9vXHJcbiAgICBpZiAodGhpcy5pc0xvZ2ljYWxPcGVyYXRvcihzb3VyY2VjbGFzcykgJiYgdGhpcy5pc0xvZ2ljYWxPcGVyYXRvcih0YXJnZXRjbGFzcykpIHtcclxuICAgICAgaW52YWxpZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpbnZhbGlkKSB7XHJcbiAgICAgIHJldHVybiAnaW52YWxpZCc7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGVkZ2VjbGFzcyA9PSAnZXF1aXZhbGVuY2UgYXJjJykge1xyXG4gICAgaWYgKCEodGhpcy5pc0VQTkNsYXNzKHNvdXJjZWNsYXNzKSAmJiB0aGlzLmNvbnZlbmllbnRUb0VxdWl2YWxlbmNlKHRhcmdldGNsYXNzKSlcclxuICAgICAgICAgICAgJiYgISh0aGlzLmlzRVBOQ2xhc3ModGFyZ2V0Y2xhc3MpICYmIHRoaXMuY29udmVuaWVudFRvRXF1aXZhbGVuY2Uoc291cmNlY2xhc3MpKSkge1xyXG4gICAgICByZXR1cm4gJ2ludmFsaWQnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuICd2YWxpZCc7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBVbmhpZGUgZ2l2ZW4gZWxlcyBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xyXG4gKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuXHJcbiAqL1xyXG5lbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgZ2l2ZW4gZWxlc1xyXG4gIGlmICh0eXBlb2YgbGF5b3V0cGFyYW0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGxheW91dHBhcmFtKCk7IC8vIElmIGxheW91dHBhcmFtIGlzIGEgZnVuY3Rpb24gZXhlY3V0ZSBpdFxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGN5LmxheW91dChsYXlvdXRwYXJhbSk7IC8vIElmIGxheW91dHBhcmFtIGlzIGxheW91dCBvcHRpb25zIGNhbGwgbGF5b3V0IHdpdGggdGhhdCBvcHRpb25zLlxyXG4gIH1cclxuICBcclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlbGVtZW50VXRpbGl0aWVzOyIsIi8qIFxyXG4gKiBVdGlsaXR5IGZpbGUgdG8gZ2V0IGFuZCBzZXQgdGhlIGxpYnJhcmllcyB0byB3aGljaCBzYmdudml6IGlzIGRlcGVuZGVudCBmcm9tIGFueSBmaWxlLlxyXG4gKi9cclxuXHJcbnZhciBsaWJVdGlsaXRpZXMgPSBmdW5jdGlvbigpe1xyXG59O1xyXG5cclxubGliVXRpbGl0aWVzLnNldExpYnMgPSBmdW5jdGlvbihsaWJzKSB7XHJcbiAgdGhpcy5saWJzID0gbGlicztcclxufTtcclxuXHJcbmxpYlV0aWxpdGllcy5nZXRMaWJzID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMubGlicztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGliVXRpbGl0aWVzOyIsInZhciBvcHRpb25zID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJykuZ2V0T3B0aW9ucygpO1xyXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcclxuXHJcbi8qXHJcbiAqIFRoZSBtYWluIHV0aWxpdGllcyB0byBiZSBleHBvc2VkIGRpcmVjdGx5LlxyXG4gKi9cclxuZnVuY3Rpb24gbWFpblV0aWxpdGllcygpIHtcclxufTtcclxuXHJcbi8qXHJcbiAqIEFkZHMgYSBuZXcgbm9kZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5hZGROb2RlID0gZnVuY3Rpb24oeCwgeSAsIG5vZGVjbGFzcykge1xyXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4LCB5LCBub2RlY2xhc3MpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgbmV3Tm9kZSA6IHtcclxuICAgICAgICB4OiB4LFxyXG4gICAgICAgIHk6IHksXHJcbiAgICAgICAgY2xhc3M6IG5vZGVjbGFzc1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkTm9kZVwiLCBwYXJhbSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogQWRkcyBhIG5ldyBlZGdlIHdpdGggdGhlIGdpdmVuIGNsYXNzIGFuZCBoYXZpbmcgdGhlIGdpdmVuIHNvdXJjZSBhbmQgdGFyZ2V0IGlkc1xyXG4gKi9cclxubWFpblV0aWxpdGllcy5hZGRFZGdlID0gZnVuY3Rpb24oc291cmNlLCB0YXJnZXQgLCBlZGdlY2xhc3MpIHtcclxuICAvLyBHZXQgdGhlIHZhbGlkYXRpb24gcmVzdWx0XHJcbiAgdmFyIHZhbGlkYXRpb24gPSBlbGVtZW50VXRpbGl0aWVzLnZhbGlkYXRlQXJyb3dFbmRzKGVkZ2VjbGFzcywgY3kuZ2V0RWxlbWVudEJ5SWQoc291cmNlKSwgY3kuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0KSk7XHJcblxyXG4gIC8vIElmIHZhbGlkYXRpb24gcmVzdWx0IGlzICdpbnZhbGlkJyBjYW5jZWwgdGhlIG9wZXJhdGlvblxyXG4gIGlmICh2YWxpZGF0aW9uID09PSAnaW52YWxpZCcpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgLy8gSWYgdmFsaWRhdGlvbiByZXN1bHQgaXMgJ3JldmVyc2UnIHJldmVyc2UgdGhlIHNvdXJjZS10YXJnZXQgcGFpciBiZWZvcmUgY3JlYXRpbmcgdGhlIGVkZ2VcclxuICBpZiAodmFsaWRhdGlvbiA9PT0gJ3JldmVyc2UnKSB7XHJcbiAgICB2YXIgdGVtcCA9IHNvdXJjZTtcclxuICAgIHNvdXJjZSA9IHRhcmdldDtcclxuICAgIHRhcmdldCA9IHRlbXA7XHJcbiAgfVxyXG4gICAgICBcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2Uoc291cmNlLCB0YXJnZXQsIGVkZ2VjbGFzcyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBuZXdFZGdlIDoge1xyXG4gICAgICAgIHNvdXJjZTogc291cmNlLFxyXG4gICAgICAgIHRhcmdldDogdGFyZ2V0LFxyXG4gICAgICAgIGNsYXNzOiBlZGdlY2xhc3NcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZEVkZ2VcIiwgcGFyYW0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIENsb25lIGdpdmVuIGVsZW1lbnRzLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuY2xvbmVFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVzKSB7XHJcbiAgdmFyIGNiID0gY3kuY2xpcGJvYXJkKCk7XHJcbiAgdmFyIF9pZCA9IGNiLmNvcHkoZWxlcywgXCJjbG9uZU9wZXJhdGlvblwiKTtcclxuXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJwYXN0ZVwiLCB7aWQ6IF9pZH0pO1xyXG4gIH0gXHJcbiAgZWxzZSB7XHJcbiAgICBjYi5wYXN0ZShfaWQpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIENvcHkgZ2l2ZW4gZWxlbWVudHMgdG8gY2xpcGJvYXJkLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuY29weUVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZXMpIHtcclxuICBjeS5jbGlwYm9hcmQoKS5jb3B5KGVsZXMpO1xyXG59O1xyXG5cclxuLypcclxuICogUGFzdCB0aGUgZWxlbWVudHMgY29waWVkIHRvIGNsaXBib2FyZC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLnBhc3RlRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInBhc3RlXCIpO1xyXG4gIH0gXHJcbiAgZWxzZSB7XHJcbiAgICBjeS5jbGlwYm9hcmQoKS5wYXN0ZSgpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIEFsaWducyBnaXZlbiBub2RlcyBpbiBnaXZlbiBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBvcmRlci4gXHJcbiAqIEhvcml6b250YWwgYW5kIHZlcnRpY2FsIHBhcmFtZXRlcnMgbWF5IGJlICdub25lJyBvciB1bmRlZmluZWQuXHJcbiAqIGFsaWduVG8gcGFyYW1ldGVyIGluZGljYXRlcyB0aGUgbGVhZGluZyBub2RlLlxyXG4gKiBSZXF1cmlyZXMgY3l0b3NjYXBlLWdyaWQtZ3VpZGUgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5hbGlnbiA9IGZ1bmN0aW9uIChub2RlcywgaG9yaXpvbnRhbCwgdmVydGljYWwsIGFsaWduVG8pIHtcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImFsaWduXCIsIHtcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICBob3Jpem9udGFsOiBob3Jpem9udGFsLFxyXG4gICAgICB2ZXJ0aWNhbDogdmVydGljYWwsXHJcbiAgICAgIGFsaWduVG86IGFsaWduVG9cclxuICAgIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBub2Rlcy5hbGlnbihob3Jpem9udGFsLCB2ZXJ0aWNhbCwgYWxpZ25Ubyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogQ3JlYXRlIGNvbXBvdW5kIGZvciBnaXZlbiBub2Rlcy4gY29tcG91bmRUeXBlIG1heSBiZSAnY29tcGxleCcgb3IgJ2NvbXBhcnRtZW50Jy5cclxuICogVGhpcyBtZXRob2QgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKF9ub2RlcywgY29tcG91bmRUeXBlKSB7XHJcbiAgdmFyIG5vZGVzID0gX25vZGVzO1xyXG4gIC8vIEp1c3QgRVBOJ3MgY2FuIGJlIGluY2x1ZGVkIGluIGNvbXBsZXhlcyBzbyB3ZSBuZWVkIHRvIGZpbHRlciBFUE4ncyBpZiBjb21wb3VuZCB0eXBlIGlzIGNvbXBsZXhcclxuICBpZiAoY29tcG91bmRUeXBlID09PSAnY29tcGxleCcpIHtcclxuICAgIG5vZGVzID0gX25vZGVzLmZpbHRlcihmdW5jdGlvbiAoaSwgZWxlbWVudCkge1xyXG4gICAgICB2YXIgc2JnbmNsYXNzID0gZWxlbWVudC5kYXRhKFwiY2xhc3NcIik7XHJcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3Moc2JnbmNsYXNzKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBcclxuICBub2RlcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcclxuXHJcbiAgLy8gQWxsIGVsZW1lbnRzIHNob3VsZCBoYXZlIHRoZSBzYW1lIHBhcmVudCBhbmQgdGhlIGNvbW1vbiBwYXJlbnQgc2hvdWxkIG5vdCBiZSBhICdjb21wbGV4JyBcclxuICAvLyBpZiBjb21wb3VuZFR5cGUgaXMgJ2NvbXBhcnRlbnQnXHJcbiAgLy8gYmVjYXVzZSB0aGUgb2xkIGNvbW1vbiBwYXJlbnQgd2lsbCBiZSB0aGUgcGFyZW50IG9mIHRoZSBuZXcgY29tcGFydG1lbnQgYWZ0ZXIgdGhpcyBvcGVyYXRpb24gYW5kXHJcbiAgLy8gJ2NvbXBsZXhlcycgY2Fubm90IGluY2x1ZGUgJ2NvbXBhcnRtZW50cydcclxuICBpZiAobm9kZXMubGVuZ3RoID09IDAgfHwgIWVsZW1lbnRVdGlsaXRpZXMuYWxsSGF2ZVRoZVNhbWVQYXJlbnQobm9kZXMpXHJcbiAgICAgICAgICB8fCAoIGNvbXBvdW5kVHlwZSA9PT0gJ2NvbXBhcnRtZW50JyAmJiBub2Rlcy5wYXJlbnQoKS5kYXRhKCdjbGFzcycpID09PSAnY29tcGxleCcgKSApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKGN5LnVuZG9SZWRvKCkpIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgY29tcG91bmRUeXBlOiBjb21wb3VuZFR5cGUsXHJcbiAgICAgIG5vZGVzVG9NYWtlQ29tcG91bmQ6IG5vZGVzXHJcbiAgICB9O1xyXG5cclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXNcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKG5vZGVzLCBjb21wb3VuZFR5cGUpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIE1vdmUgdGhlIG5vZGVzIHRvIGEgbmV3IHBhcmVudCBhbmQgY2hhbmdlIHRoZWlyIHBvc2l0aW9uIGlmIHBvc3NEaWZmIHBhcmFtcyBhcmUgc2V0LlxyXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uIGFuZCBjaGVja3MgaWYgdGhlIG9wZXJhdGlvbiBpcyB2YWxpZC5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuY2hhbmdlUGFyZW50ID0gZnVuY3Rpb24obm9kZXMsIF9uZXdQYXJlbnQsIHBvc0RpZmZYLCBwb3NEaWZmWSkge1xyXG4gIHZhciBuZXdQYXJlbnQgPSB0eXBlb2YgX25ld1BhcmVudCA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfbmV3UGFyZW50KSA6IF9uZXdQYXJlbnQ7XHJcbiAgaWYgKG5ld1BhcmVudCAmJiBuZXdQYXJlbnQuZGF0YShcImNsYXNzXCIpICE9IFwiY29tcGxleFwiICYmIG5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikgIT0gXCJjb21wYXJ0bWVudFwiKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBpZiAobmV3UGFyZW50ICYmIG5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikgPT0gXCJjb21wbGV4XCIpIHtcclxuICAgIG5vZGVzID0gbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChpLCBlbGUpIHtcclxuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyhlbGUuZGF0YShcImNsYXNzXCIpKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbm9kZXMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGksIGVsZSkge1xyXG4gICAgaWYgKCFuZXdQYXJlbnQpIHtcclxuICAgICAgcmV0dXJuIGVsZS5kYXRhKCdwYXJlbnQnKSAhPSBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVsZS5kYXRhKCdwYXJlbnQnKSAhPT0gbmV3UGFyZW50LmlkKCk7XHJcbiAgfSk7XHJcblxyXG4gIGlmIChuZXdQYXJlbnQpIHtcclxuICAgIG5vZGVzID0gbm9kZXMuZGlmZmVyZW5jZShuZXdQYXJlbnQuYW5jZXN0b3JzKCkpO1xyXG4gIH1cclxuXHJcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgbm9kZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldFRvcE1vc3ROb2Rlcyhub2Rlcyk7XHJcbiAgXHJcbiAgdmFyIHBhcmVudElkID0gbmV3UGFyZW50ID8gbmV3UGFyZW50LmlkKCkgOiBudWxsO1xyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIGZpcnN0VGltZTogdHJ1ZSxcclxuICAgICAgcGFyZW50RGF0YTogcGFyZW50SWQsIC8vIEl0IGtlZXBzIHRoZSBuZXdQYXJlbnRJZCAoSnVzdCBhbiBpZCBmb3IgZWFjaCBub2RlcyBmb3IgdGhlIGZpcnN0IHRpbWUpXHJcbiAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgcG9zRGlmZlg6IHBvc0RpZmZYLFxyXG4gICAgICBwb3NEaWZmWTogcG9zRGlmZllcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZVBhcmVudFwiLCBwYXJhbSk7IC8vIFRoaXMgYWN0aW9uIGlzIHJlZ2lzdGVyZWQgYnkgdW5kb1JlZG8gZXh0ZW5zaW9uXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQobm9kZXMsIHBhcmVudElkLCBwb3NEaWZmWCwgcG9zRGlmZlkpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxyXG4gKiBpbiB0aGUgY29tcGxleC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIHRoZSBzYW1lIGZ1bmN0aW9uIGluIGVsZW1lbnRVdGlsaXRpZXNcclxuICovXHJcbm1haW5VdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKSB7XHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24odGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICB0ZW1wbGF0ZVR5cGU6IHRlbXBsYXRlVHlwZSxcclxuICAgICAgbWFjcm9tb2xlY3VsZUxpc3Q6IG1hY3JvbW9sZWN1bGVMaXN0LFxyXG4gICAgICBjb21wbGV4TmFtZTogY29tcGxleE5hbWUsXHJcbiAgICAgIHByb2Nlc3NQb3NpdGlvbjogcHJvY2Vzc1Bvc2l0aW9uLFxyXG4gICAgICB0aWxpbmdQYWRkaW5nVmVydGljYWw6IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCxcclxuICAgICAgdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLFxyXG4gICAgICBlZGdlTGVuZ3RoOiBlZGdlTGVuZ3RoXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlVGVtcGxhdGVSZWFjdGlvblwiLCBwYXJhbSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogUmVzaXplIGdpdmVuIG5vZGVzIGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeSBvbmUgb2Ygd2lkdGggb3IgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0LiBcclxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMucmVzaXplTm9kZXMgPSBmdW5jdGlvbihub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8pIHtcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgIHdpZHRoOiB3aWR0aCxcclxuICAgICAgaGVpZ2h0OiBoZWlnaHQsXHJcbiAgICAgIHVzZUFzcGVjdFJhdGlvOiB1c2VBc3BlY3RSYXRpbyxcclxuICAgICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInJlc2l6ZU5vZGVzXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbyk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDaGFuZ2VzIHRoZSBsYWJlbCBvZiB0aGUgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIGxhYmVsLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jaGFuZ2VOb2RlTGFiZWwgPSBmdW5jdGlvbihub2RlcywgbGFiZWwpIHtcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIG5vZGVzLmRhdGEoJ2xhYmVsJywgbGFiZWwpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICBsYWJlbDogbGFiZWwsXHJcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZU5vZGVMYWJlbFwiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIGZvciBnaXZlbiBlbGVzIHVzZSB0aGUgZ2l2ZW4gZm9udCBkYXRhLlxyXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uKGVsZXMsIGRhdGEpIHtcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBlbGVzOiBlbGVzLFxyXG4gICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUZvbnRQcm9wZXJ0aWVzXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZXMsIGRhdGEpO1xyXG4gIH1cclxuICBcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuLypcclxuICogQ2hhbmdlIHN0YXRlIHZhbHVlIG9yIHVuaXQgb2YgaW5mb3JtYXRpb24gYm94IG9mIGdpdmVuIG5vZGVzIHdpdGggZ2l2ZW4gaW5kZXguXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBwYXJhbWV0ZXJzIHNlZSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94XHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24obm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSkge1xyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIGluZGV4OiBpbmRleCxcclxuICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICBub2Rlczogbm9kZXNcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3gobm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXHJcbi8vIFRoZSBib3ggaXMgcmVwcmVzZW50ZWQgYnkgdGhlIHBhcmFtZXRlciBvYmouXHJcbi8vIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2Rlcywgb2JqKSB7XHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG5vZGVzLCBvYmopO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgb2JqOiBvYmosXHJcbiAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZFN0YXRlT3JJbmZvQm94XCIsIHBhcmFtKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbi8vIFJlbW92ZSB0aGUgc3RhdGUgb3IgaW5mbyBib3hlcyBvZiB0aGUgZ2l2ZW4gbm9kZXMgYXQgZ2l2ZW4gaW5kZXguXHJcbi8vIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbm1haW5VdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgpIHtcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3gobm9kZXMsIGluZGV4KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIGluZGV4OiBpbmRleCxcclxuICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICB9O1xyXG5cclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZW1vdmVTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBTZXQgbXVsdGltZXIgc3RhdHVzIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxyXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uKG5vZGVzLCBzdGF0dXMpIHtcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBzdGF0dXM6IHN0YXR1cyxcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNldE11bHRpbWVyU3RhdHVzXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xyXG4gIH1cclxuICBcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuLypcclxuICogU2V0IGNsb25lIG1hcmtlciBzdGF0dXMgb2YgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cclxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICovIFxyXG5tYWluVXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24obm9kZXMsIHN0YXR1cykge1xyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIHN0YXR1czogc3RhdHVzLFxyXG4gICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwic2V0Q2xvbmVNYXJrZXJTdGF0dXNcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMobm9kZXMsIHN0YXR1cyk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDaGFuZ2Ugc3R5bGUvY3NzIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIHZhbHVlLlxyXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jaGFuZ2VDc3MgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZSkge1xyXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgZWxlcy5jc3MobmFtZSwgdmFsdWUpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgZWxlczogZWxlcyxcclxuICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VDc3NcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuLypcclxuICogQ2hhbmdlIGRhdGEgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gdmFsdWUuXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNoYW5nZURhdGEgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZSkge1xyXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgZWxlcy5kYXRhKG5hbWUsIHZhbHVlKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIGVsZXM6IGVsZXMsXHJcbiAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgZmlyc3RUaW1lOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlRGF0YVwiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBVbmhpZGUgZ2l2ZW4gZWxlcyBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xyXG4gKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGVsZXMsIGxheW91dHBhcmFtKSB7XHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0KGVsZXMsIGxheW91dHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIGVsZXM6IGVsZXMsXHJcbiAgICAgIGxheW91dHBhcmFtOiBsYXlvdXRwYXJhbSxcclxuICAgICAgZmlyc3RUaW1lOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwic2hvd0FuZFBlcmZvcm1MYXlvdXRcIiwgcGFyYW0pO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFpblV0aWxpdGllczsiLCIvKlxyXG4gKiAgRXh0ZW5kIGRlZmF1bHQgb3B0aW9ucyBhbmQgZ2V0IGN1cnJlbnQgb3B0aW9ucyBieSB1c2luZyB0aGlzIGZpbGUgXHJcbiAqL1xyXG5cclxuLy8gZGVmYXVsdCBvcHRpb25zXHJcbnZhciBkZWZhdWx0cyA9IHtcclxuICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgdGhlIGluZGV4IGh0bWwgXHJcbiAgLy8gZmlsZSBhbmQgbm9kZV9tb2R1bGVzIGFyZSB1bmRlciB0aGUgc2FtZSBmb2xkZXIgdGhlbiB1c2luZyB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBmaW5lXHJcbiAgaW1nUGF0aDogJ25vZGVfbW9kdWxlcy9zYmdudml6L3NyYy9pbWcnLFxyXG4gIC8vIFdoZXRoZXIgdG8gZml0IGxhYmVscyB0byBub2Rlc1xyXG4gIGZpdExhYmVsc1RvTm9kZXM6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9LFxyXG4gIC8vIGR5bmFtaWMgbGFiZWwgc2l6ZSBpdCBtYXkgYmUgJ3NtYWxsJywgJ3JlZ3VsYXInLCAnbGFyZ2UnXHJcbiAgZHluYW1pY0xhYmVsU2l6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICdyZWd1bGFyJztcclxuICB9LFxyXG4gIC8vIHBlcmNlbnRhZ2UgdXNlZCB0byBjYWxjdWxhdGUgY29tcG91bmQgcGFkZGluZ3NcclxuICBjb21wb3VuZFBhZGRpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAxMDtcclxuICB9LFxyXG4gIC8vIFdoZXRoZXIgdG8gYWRqdXN0IG5vZGUgbGFiZWwgZm9udCBzaXplIGF1dG9tYXRpY2FsbHkuXHJcbiAgLy8gSWYgdGhpcyBvcHRpb24gcmV0dXJuIGZhbHNlIGRvIG5vdCBhZGp1c3QgbGFiZWwgc2l6ZXMgYWNjb3JkaW5nIHRvIG5vZGUgaGVpZ2h0IHVzZXMgbm9kZS5kYXRhKCdsYWJlbHNpemUnKVxyXG4gIC8vIGluc3RlYWQgb2YgZG9pbmcgaXQuXHJcbiAgYWRqdXN0Tm9kZUxhYmVsRm9udFNpemVBdXRvbWF0aWNhbGx5OiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0sXHJcbiAgLy8gVGhlIHNlbGVjdG9yIG9mIHRoZSBjb21wb25lbnQgY29udGFpbmluZyB0aGUgc2JnbiBuZXR3b3JrXHJcbiAgbmV0d29ya0NvbnRhaW5lclNlbGVjdG9yOiAnI3NiZ24tbmV0d29yay1jb250YWluZXInLFxyXG4gIC8vIFdoZXRoZXIgdGhlIGFjdGlvbnMgYXJlIHVuZG9hYmxlLCByZXF1aXJlcyBjeXRvc2NhcGUtdW5kby1yZWRvIGV4dGVuc2lvblxyXG4gIHVuZG9hYmxlOiB0cnVlLFxyXG4gIC8vIFdoZXRoZXIgdG8gaGF2ZSB1bmRvYWJsZSBkcmFnIGZlYXR1cmUgaW4gdW5kby9yZWRvIGV4dGVuc2lvbi4gVGhpcyBvcHRpb25zIHdpbGwgYmUgcGFzc2VkIHRvIHVuZG8vcmVkbyBleHRlbnNpb25cclxuICB1bmRvYWJsZURyYWc6IHRydWVcclxufTtcclxuXHJcbnZhciBvcHRpb25VdGlsaXRpZXMgPSBmdW5jdGlvbiAoKSB7XHJcbn07XHJcblxyXG4vLyBFeHRlbmQgdGhlIGRlZmF1bHRzIG9wdGlvbnMgd2l0aCB0aGUgdXNlciBvcHRpb25zXHJcbm9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICB2YXIgcmVzdWx0ID0ge307XHJcblxyXG4gIGZvciAodmFyIHByb3AgaW4gZGVmYXVsdHMpIHtcclxuICAgIHJlc3VsdFtwcm9wXSA9IGRlZmF1bHRzW3Byb3BdO1xyXG4gIH1cclxuICBcclxuICBmb3IgKHZhciBwcm9wIGluIG9wdGlvbnMpIHtcclxuICAgIHJlc3VsdFtwcm9wXSA9IG9wdGlvbnNbcHJvcF07XHJcbiAgfVxyXG5cclxuICBvcHRpb25VdGlsaXRpZXMub3B0aW9ucyA9IHJlc3VsdDtcclxuXHJcbiAgcmV0dXJuIG9wdGlvbnM7XHJcbn07XHJcblxyXG5vcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnM7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG9wdGlvblV0aWxpdGllczsiLCJ2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgJCA9IGxpYnMualF1ZXJ5O1xyXG5cclxudmFyIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zID0gZnVuY3Rpb24gKHVuZG9hYmxlRHJhZykge1xyXG4gIC8vIGNyZWF0ZSB1bmRvLXJlZG8gaW5zdGFuY2VcclxuICB2YXIgdXIgPSBjeS51bmRvUmVkbyh7XHJcbiAgICB1bmRvYWJsZURyYWc6IHVuZG9hYmxlRHJhZ1xyXG4gIH0pO1xyXG5cclxuICAvLyByZWdpc3RlciBhZGQgcmVtb3ZlIGFjdGlvbnNcclxuICB1ci5hY3Rpb24oXCJhZGROb2RlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZE5vZGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xyXG4gIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTaW1wbGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xyXG4gIHVyLmFjdGlvbihcImFkZEVkZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XHJcbiAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NtYXJ0XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTbWFydCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xyXG4gIHVyLmFjdGlvbihcImNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZUNvbXBvdW5kKTtcclxuXHJcbiAgLy8gcmVnaXN0ZXIgZ2VuZXJhbCBhY3Rpb25zXHJcbiAgdXIuYWN0aW9uKFwicmVzaXplTm9kZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc2l6ZU5vZGVzKTtcclxuICB1ci5hY3Rpb24oXCJjaGFuZ2VOb2RlTGFiZWxcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwpO1xyXG4gIHVyLmFjdGlvbihcImNoYW5nZURhdGFcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRGF0YSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRGF0YSk7XHJcbiAgdXIuYWN0aW9uKFwiY2hhbmdlQ3NzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUNzcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzKTtcclxuICB1ci5hY3Rpb24oXCJjaGFuZ2VCZW5kUG9pbnRzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMpO1xyXG4gIHVyLmFjdGlvbihcImNoYW5nZUZvbnRQcm9wZXJ0aWVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUZvbnRQcm9wZXJ0aWVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcyk7XHJcbiAgdXIuYWN0aW9uKFwic2hvd0FuZFBlcmZvcm1MYXlvdXRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2hvd0FuZFBlcmZvcm1MYXlvdXQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9TaG93QW5kUGVyZm9ybUxheW91dCk7XHJcblxyXG4gIC8vIHJlZ2lzdGVyIFNCR04gYWN0aW9uc1xyXG4gIHVyLmFjdGlvbihcImFkZFN0YXRlT3JJbmZvQm94XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCk7XHJcbiAgdXIuYWN0aW9uKFwiY2hhbmdlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94KTtcclxuICB1ci5hY3Rpb24oXCJzZXRNdWx0aW1lclN0YXR1c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMpO1xyXG4gIHVyLmFjdGlvbihcInNldENsb25lTWFya2VyU3RhdHVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cyk7XHJcbiAgdXIuYWN0aW9uKFwicmVtb3ZlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94KTtcclxuICBcclxuICAvLyByZWdpc3RlciBlYXN5IGNyZWF0aW9uIGFjdGlvbnNcclxuICB1ci5hY3Rpb24oXCJjcmVhdGVUZW1wbGF0ZVJlYWN0aW9uXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24sIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1bmRvYWJsZURyYWcpIHtcclxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKHVuZG9hYmxlRHJhZyk7XHJcbiAgfSk7XHJcbn07IiwiLy8gRXh0ZW5kcyBzYmdudml6LnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zXHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgc2JnbnZpeiA9IGxpYnMuc2JnbnZpejtcclxudmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcclxudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XHJcblxyXG4vLyBTZWN0aW9uIFN0YXJ0XHJcbi8vIGFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkTm9kZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQ7XHJcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgdmFyIG5ld05vZGUgPSBwYXJhbS5uZXdOb2RlO1xyXG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKG5ld05vZGUueCwgbmV3Tm9kZS55LCBuZXdOb2RlLmNsYXNzKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKHBhcmFtKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBlbGVzOiByZXN1bHRcclxuICB9O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQ7XHJcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgdmFyIG5ld0VkZ2UgPSBwYXJhbS5uZXdFZGdlO1xyXG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKG5ld0VkZ2Uuc291cmNlLCBuZXdFZGdlLnRhcmdldCwgbmV3RWRnZS5jbGFzcyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZWxlczogcmVzdWx0XHJcbiAgfTtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBub2Rlc1RvTWFrZUNvbXBvdW5kID0gcGFyYW0ubm9kZXNUb01ha2VDb21wb3VuZDtcclxuICB2YXIgbmV3Q29tcG91bmQ7XHJcblxyXG4gIC8vIElmIHRoaXMgaXMgYSByZWRvIGFjdGlvbiByZWZyZXNoIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kIChXZSBuZWVkIHRoaXMgYmVjYXVzZSBhZnRlciBlbGUubW92ZSgpIHJlZmVyZW5jZXMgdG8gZWxlcyBjaGFuZ2VzKVxyXG4gIGlmICghcGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICB2YXIgbm9kZXNUb01ha2VDb21wb3VuZElkcyA9IHt9O1xyXG5cclxuICAgIG5vZGVzVG9NYWtlQ29tcG91bmQuZWFjaChmdW5jdGlvbiAoaSwgZWxlKSB7XHJcbiAgICAgIG5vZGVzVG9NYWtlQ29tcG91bmRJZHNbZWxlLmlkKCldID0gdHJ1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKCk7XHJcblxyXG4gICAgbm9kZXNUb01ha2VDb21wb3VuZCA9IGFsbE5vZGVzLmZpbHRlcihmdW5jdGlvbiAoaSwgZWxlKSB7XHJcbiAgICAgIHJldHVybiBub2Rlc1RvTWFrZUNvbXBvdW5kSWRzW2VsZS5pZCgpXTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgdmFyIG9sZFBhcmVudElkID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwicGFyZW50XCIpO1xyXG4gICAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZFxyXG4gICAgbmV3Q29tcG91bmQgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyhub2Rlc1RvTWFrZUNvbXBvdW5kLCBwYXJhbS5jb21wb3VuZFR5cGUpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIG5ld0NvbXBvdW5kID0gcGFyYW0ucmVtb3ZlZENvbXBvdW5kLnJlc3RvcmUoKTtcclxuICAgIHZhciBuZXdDb21wb3VuZElkID0gbmV3Q29tcG91bmQuaWQoKTtcclxuXHJcbiAgICBub2Rlc1RvTWFrZUNvbXBvdW5kLm1vdmUoe3BhcmVudDogbmV3Q29tcG91bmRJZH0pO1xyXG5cclxuICAgIHNiZ252aXoucmVmcmVzaFBhZGRpbmdzKCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3Q29tcG91bmQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVDb21wb3VuZCA9IGZ1bmN0aW9uIChjb21wb3VuZFRvUmVtb3ZlKSB7XHJcbiAgdmFyIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlQ29tcG91bmQoY29tcG91bmRUb1JlbW92ZSk7XHJcblxyXG4gIHZhciBwYXJhbSA9IHtcclxuICAgIG5vZGVzVG9NYWtlQ29tcG91bmQ6IHJlc3VsdC5jaGlsZHJlbk9mQ29tcG91bmQsXHJcbiAgICByZW1vdmVkQ29tcG91bmQ6IHJlc3VsdC5yZW1vdmVkQ29tcG91bmRcclxuICB9O1xyXG5cclxuICByZXR1cm4gcGFyYW07XHJcbn07XHJcblxyXG4vLyBTZWN0aW9uIEVuZFxyXG4vLyBhZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbi8vIFNlY3Rpb24gU3RhcnRcclxuLy8gZWFzeSBjcmVhdGlvbiBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcclxuICB2YXIgZWxlcztcclxuXHJcbiAgaWYgKGZpcnN0VGltZSkge1xyXG4gICAgZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbihwYXJhbS50ZW1wbGF0ZVR5cGUsIHBhcmFtLm1hY3JvbW9sZWN1bGVMaXN0LCBwYXJhbS5jb21wbGV4TmFtZSwgcGFyYW0ucHJvY2Vzc1Bvc2l0aW9uLCBwYXJhbS50aWxpbmdQYWRkaW5nVmVydGljYWwsIHBhcmFtLnRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBwYXJhbS5lZGdlTGVuZ3RoKVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZXMgPSBwYXJhbTtcclxuICAgIGN5LmFkZChlbGVzKTtcclxuICAgIFxyXG4gICAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcclxuICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcclxuICAgIGVsZXMuc2VsZWN0KCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZWxlczogZWxlc1xyXG4gIH07XHJcbn07XHJcblxyXG4vLyBTZWN0aW9uIEVuZFxyXG4vLyBlYXN5IGNyZWF0aW9uIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbi8vIFNlY3Rpb24gU3RhcnRcclxuLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwb3NpdGlvbnMgPSB7fTtcclxuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xyXG4gIFxyXG4gIG5vZGVzLmVhY2goZnVuY3Rpb24oaSwgZWxlKSB7XHJcbiAgICBwb3NpdGlvbnNbZWxlLmlkKCldID0ge1xyXG4gICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxyXG4gICAgICB5OiBlbGUucG9zaXRpb24oXCJ5XCIpXHJcbiAgICB9O1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gcG9zaXRpb25zO1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMgPSBmdW5jdGlvbiAocG9zaXRpb25zKSB7XHJcbiAgdmFyIGN1cnJlbnRQb3NpdGlvbnMgPSB7fTtcclxuICBjeS5ub2RlcygpLnBvc2l0aW9ucyhmdW5jdGlvbiAoaSwgZWxlKSB7XHJcbiAgICBjdXJyZW50UG9zaXRpb25zW2VsZS5pZCgpXSA9IHtcclxuICAgICAgeDogZWxlLnBvc2l0aW9uKFwieFwiKSxcclxuICAgICAgeTogZWxlLnBvc2l0aW9uKFwieVwiKVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgdmFyIHBvcyA9IHBvc2l0aW9uc1tlbGUuaWQoKV07XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiBwb3MueCxcclxuICAgICAgeTogcG9zLnlcclxuICAgIH07XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBjdXJyZW50UG9zaXRpb25zO1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZVxyXG4gIH07XHJcblxyXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG5cclxuICByZXN1bHQuc2l6ZU1hcCA9IHt9O1xyXG4gIHJlc3VsdC51c2VBc3BlY3RSYXRpbyA9IGZhbHNlO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgcmVzdWx0LnNpemVNYXBbbm9kZS5pZCgpXSA9IHtcclxuICAgICAgdzogbm9kZS53aWR0aCgpLFxyXG4gICAgICBoOiBub2RlLmhlaWdodCgpXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcmVzdWx0Lm5vZGVzID0gbm9kZXM7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcblxyXG4gICAgaWYgKHBhcmFtLnBlcmZvcm1PcGVyYXRpb24pIHtcclxuICAgICAgaWYgKHBhcmFtLnNpemVNYXApIHtcclxuICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0udztcclxuICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0uaDtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKHBhcmFtLm5vZGVzLCBwYXJhbS53aWR0aCwgcGFyYW0uaGVpZ2h0LCBwYXJhbS51c2VBc3BlY3RSYXRpbyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gIH07XHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcbiAgcmVzdWx0Lm5vZGVzID0gbm9kZXM7XHJcbiAgcmVzdWx0LmxhYmVsID0ge307XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICByZXN1bHQubGFiZWxbbm9kZS5pZCgpXSA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcclxuICB9XHJcblxyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIG5vZGVzLmRhdGEoJ2xhYmVsJywgcGFyYW0ubGFiZWwpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsID0gcGFyYW0ubGFiZWxbbm9kZS5pZCgpXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICB9O1xyXG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuXHJcbiAgcmVzdWx0Lm5hbWUgPSBwYXJhbS5uYW1lO1xyXG4gIHJlc3VsdC52YWx1ZU1hcCA9IHt9O1xyXG4gIHJlc3VsdC5lbGVzID0gZWxlcztcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgZWxlID0gZWxlc1tpXTtcclxuICAgIHJlc3VsdC52YWx1ZU1hcFtlbGUuaWQoKV0gPSBlbGUuZGF0YShwYXJhbS5uYW1lKTtcclxuICB9XHJcblxyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIGVsZXMuZGF0YShwYXJhbS5uYW1lLCBwYXJhbS52YWx1ZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgY3kuc3RhcnRCYXRjaCgpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG4gICAgICBlbGUuZGF0YShwYXJhbS5uYW1lLCBwYXJhbS52YWx1ZU1hcFtlbGUuaWQoKV0pO1xyXG4gICAgfVxyXG4gICAgY3kuZW5kQmF0Y2goKTtcclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gIH07XHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG4gIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTtcclxuICByZXN1bHQudmFsdWVNYXAgPSB7fTtcclxuICByZXN1bHQuZWxlcyA9IGVsZXM7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICByZXN1bHQudmFsdWVNYXBbZWxlLmlkKCldID0gZWxlLmNzcyhwYXJhbS5uYW1lKTtcclxuICB9XHJcblxyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIGVsZXMuY3NzKHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBjeS5zdGFydEJhdGNoKCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICAgIGVsZS5jc3MocGFyYW0ubmFtZSwgcGFyYW0udmFsdWVNYXBbZWxlLmlkKCldKTtcclxuICAgIH1cclxuICAgIGN5LmVuZEJhdGNoKCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gIH07XHJcblxyXG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuICByZXN1bHQuZGF0YSA9IHt9O1xyXG4gIHJlc3VsdC5lbGVzID0gZWxlcztcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgZWxlID0gZWxlc1tpXTtcclxuXHJcbiAgICByZXN1bHQuZGF0YVtlbGUuaWQoKV0gPSB7fTtcclxuXHJcbiAgICB2YXIgZGF0YSA9IHBhcmFtLmZpcnN0VGltZSA/IHBhcmFtLmRhdGEgOiBwYXJhbS5kYXRhW2VsZS5pZCgpXTtcclxuXHJcbiAgICBmb3IgKHZhciBwcm9wIGluIGRhdGEpIHtcclxuICAgICAgcmVzdWx0LmRhdGFbZWxlLmlkKCldW3Byb3BdID0gZWxlLmRhdGEocHJvcCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZXMsIHBhcmFtLmRhdGEpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZWxlID0gZWxlc1tpXTtcclxuXHJcbiAgICAgIGZvciAodmFyIHByb3AgaW4gcGFyYW0uZGF0YVtlbGUuaWQoKV0pIHtcclxuICAgICAgICBlbGUuZGF0YShwcm9wLCBwYXJhbS5kYXRhW2VsZS5pZCgpXVtwcm9wXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBTaG93IGVsZXMgYW5kIHBlcmZvcm0gbGF5b3V0LlxyXG4gKi9cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XHJcblxyXG4gIHZhciByZXN1bHQgPSB7fTtcclxuICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xyXG4gIFxyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIHJlc3VsdC5lbGVzID0gZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dChwYXJhbS5lbGVzLCBwYXJhbS5sYXlvdXRwYXJhbSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuc2hvdyhlbGVzKTsgLy8gU2hvdyBnaXZlbiBlbGVzXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyhwYXJhbS5wb3NpdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9TaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuXHJcbiAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XHJcbiAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuaGlkZShlbGVzKTsgLy8gSGlkZSBwcmV2aW91c2x5IHVuaGlkZGVuIGVsZXM7XHJcblxyXG4gIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vLyBTZWN0aW9uIEVuZFxyXG4vLyBnZW5lcmFsIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbi8vIFNlY3Rpb24gU3RhcnRcclxuLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgfTtcclxuICByZXN1bHQudHlwZSA9IHBhcmFtLnR5cGU7XHJcbiAgcmVzdWx0Lm5vZGVzID0gcGFyYW0ubm9kZXM7XHJcbiAgcmVzdWx0LmluZGV4ID0gcGFyYW0uaW5kZXg7XHJcblxyXG4gIHJlc3VsdC52YWx1ZSA9IGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3gocGFyYW0ubm9kZXMsIHBhcmFtLmluZGV4LCBwYXJhbS52YWx1ZSwgcGFyYW0udHlwZSk7XHJcblxyXG4gIGN5LmZvcmNlUmVuZGVyKCk7XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBvYmogPSBwYXJhbS5vYmo7XHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcblxyXG4gIHZhciBpbmRleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XHJcblxyXG4gIGN5LmZvcmNlUmVuZGVyKCk7XHJcblxyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBub2Rlczogbm9kZXMsXHJcbiAgICBpbmRleDogaW5kZXgsXHJcbiAgICBvYmo6IG9ialxyXG4gIH07XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIGluZGV4ID0gcGFyYW0uaW5kZXg7XHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcblxyXG4gIHZhciBvYmogPSBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94KG5vZGVzLCBpbmRleCk7XHJcblxyXG4gIGN5LmZvcmNlUmVuZGVyKCk7XHJcblxyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBub2Rlczogbm9kZXMsXHJcbiAgICBvYmo6IG9ialxyXG4gIH07XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcclxuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuICB2YXIgc3RhdHVzID0gcGFyYW0uc3RhdHVzO1xyXG4gIHZhciByZXN1bHRTdGF0dXMgPSB7fTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHZhciBpc011bHRpbWVyID0gbm9kZS5kYXRhKCdjbGFzcycpLmVuZHNXaXRoKCcgbXVsdGltZXInKTtcclxuXHJcbiAgICByZXN1bHRTdGF0dXNbbm9kZS5pZCgpXSA9IGlzTXVsdGltZXI7XHJcbiAgfVxyXG5cclxuICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIGNoYW5nZSB0aGUgc3RhdHVzIG9mIGFsbCBub2RlcyBhdCBvbmNlLlxyXG4gIC8vIElmIG5vdCBjaGFuZ2Ugc3RhdHVzIG9mIGVhY2ggc2VwZXJhdGVseSB0byB0aGUgdmFsdWVzIG1hcHBlZCB0byB0aGVpciBpZC5cclxuICBpZiAoZmlyc3RUaW1lKSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2RlLCBzdGF0dXNbbm9kZS5pZCgpXSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuLy8gIGlmICghZmlyc3RUaW1lICYmIF8uaXNFcXVhbChub2RlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xyXG4vLyAgICAkKCcjaW5zcGVjdG9yLWlzLW11bHRpbWVyJykuYXR0cihcImNoZWNrZWRcIiwgISQoJyNpbnNwZWN0b3ItaXMtbXVsdGltZXInKS5hdHRyKFwiY2hlY2tlZFwiKSk7XHJcbi8vICB9XHJcblxyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBzdGF0dXM6IHJlc3VsdFN0YXR1cyxcclxuICAgIG5vZGVzOiBub2Rlc1xyXG4gIH07XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG4gIHZhciBzdGF0dXMgPSBwYXJhbS5zdGF0dXM7XHJcbiAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcclxuICB2YXIgcmVzdWx0U3RhdHVzID0ge307XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICByZXN1bHRTdGF0dXNbbm9kZS5pZCgpXSA9IG5vZGUuZGF0YSgnY2xvbmVtYXJrZXInKTtcclxuICAgIHZhciBjdXJyZW50U3RhdHVzID0gZmlyc3RUaW1lID8gc3RhdHVzIDogc3RhdHVzW25vZGUuaWQoKV07XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGUsIGN1cnJlbnRTdGF0dXMpO1xyXG4gIH1cclxuXHJcbi8vICBpZiAoIWZpcnN0VGltZSAmJiBfLmlzRXF1YWwobm9kZXMsIGN5Lm5vZGVzKCc6c2VsZWN0ZWQnKSkpIHtcclxuLy8gICAgJCgnI2luc3BlY3Rvci1pcy1jbG9uZS1tYXJrZXInKS5hdHRyKFwiY2hlY2tlZFwiLCAhJCgnI2luc3BlY3Rvci1pcy1jbG9uZS1tYXJrZXInKS5hdHRyKFwiY2hlY2tlZFwiKSk7XHJcbi8vICB9XHJcblxyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBzdGF0dXM6IHJlc3VsdFN0YXR1cyxcclxuICAgIG5vZGVzOiBub2Rlc1xyXG4gIH07XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vLyBTZWN0aW9uIEVuZFxyXG4vLyBzYmduIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7Il19
