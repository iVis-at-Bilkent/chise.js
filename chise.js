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
  var result = eles.showEles(); // Show given eles
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
    for (var i = 0; i < eles.length; i++) {
      var ele = eles[i];
      ele.data(param.name, param.valueMap[ele.id()]);
    }
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
    for (var i = 0; i < eles.length; i++) {
      var ele = eles[i];
      ele.css(param.name, param.valueMap[ele.id()]);
    }
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

// TODO reconsider this operation of undo of it.
undoRedoActionFunctions.showAndPerformLayout = function (param) {
  var eles = param.eles;

  var result = {};
  result.positionAndSizes = this.getNodePositionsAndSizes();

  if (param.firstTime) {
    result.eles = elementUtilities.showAndPerformLayout(param.eles, param.layoutparam);
  }
  else {
    result.eles = eles.showEles(); // Show given eles
    this.returnToPositionsAndSizes(param.positionAndSizes);
  }

  return result;
};

undoRedoActionFunctions.undoShowAndPerformLayout = function (param) {
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9saWItdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDajBCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMWNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24oKXtcclxuICB2YXIgY2hpc2UgPSB3aW5kb3cuY2hpc2UgPSBmdW5jdGlvbihfb3B0aW9ucywgX2xpYnMpIHtcclxuICAgIHZhciBsaWJzID0ge307XHJcbiAgICBsaWJzLmpRdWVyeSA9IF9saWJzLmpRdWVyeSB8fCBqUXVlcnk7XHJcbiAgICBsaWJzLmN5dG9zY2FwZSA9IF9saWJzLmN5dG9zY2FwZSB8fCBjeXRvc2NhcGU7XHJcbiAgICBsaWJzLnNiZ252aXogPSBfbGlicy5zYmdudml6IHx8IHNiZ252aXo7XHJcbiAgICBsaWJzLnNhdmVBcyA9IF9saWJzLmZpbGVzYXZlcmpzID8gX2xpYnMuZmlsZXNhdmVyanMuc2F2ZUFzIDogc2F2ZUFzO1xyXG4gICAgXHJcbiAgICBsaWJzLnNiZ252aXooX29wdGlvbnMsIF9saWJzKTsgLy8gSW5pdGlsaXplIHNiZ252aXpcclxuICAgIFxyXG4gICAgLy8gU2V0IHRoZSBsaWJyYXJpZXMgdG8gYWNjZXNzIHRoZW0gZnJvbSBhbnkgZmlsZVxyXG4gICAgdmFyIGxpYlV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKTtcclxuICAgIGxpYlV0aWxpdGllcy5zZXRMaWJzKGxpYnMpO1xyXG4gICAgXHJcbiAgICB2YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcycpO1xyXG4gICAgdmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyhfb3B0aW9ucyk7IC8vIEV4dGVuZHMgdGhlIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHRoZSBnaXZlbiBvcHRpb25zXHJcbiAgICBcclxuICAgIC8vIFVwZGF0ZSBzdHlsZSBhbmQgYmluZCBldmVudHNcclxuICAgIHZhciBjeVN0eWxlQW5kRXZlbnRzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvY3ktc3R5bGUtYW5kLWV2ZW50cycpO1xyXG4gICAgY3lTdHlsZUFuZEV2ZW50cyhsaWJzLnNiZ252aXopO1xyXG4gICAgXHJcbiAgICAvLyBSZWdpc3RlciB1bmRvL3JlZG8gYWN0aW9uc1xyXG4gICAgdmFyIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMnKTtcclxuICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKG9wdGlvbnMudW5kb2FibGVEcmFnKTtcclxuICAgIFxyXG4gICAgdmFyIG1haW5VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcycpO1xyXG4gICAgdmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcycpO1xyXG4gICAgdmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMnKTtcclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIHRoZSBhcGlcclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIHRoZSBwcm9wZXJ0aWVzIGluaGVyaXRlZCBmcm9tIHNiZ252aXpcclxuICAgIC8vIHRoZW4gb3ZlcnJpZGUgc29tZSBvZiB0aGVzZSBwcm9wZXJ0aWVzIGFuZCBleHBvc2Ugc29tZSBuZXcgcHJvcGVydGllc1xyXG4gICAgZm9yICh2YXIgcHJvcCBpbiBsaWJzLnNiZ252aXopIHtcclxuICAgICAgY2hpc2VbcHJvcF0gPSBsaWJzLnNiZ252aXpbcHJvcF07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEV4cG9zZSBlYWNoIG1haW4gdXRpbGl0eSBzZXBlcmF0ZWx5XHJcbiAgICBmb3IgKHZhciBwcm9wIGluIG1haW5VdGlsaXRpZXMpIHtcclxuICAgICAgY2hpc2VbcHJvcF0gPSBtYWluVXRpbGl0aWVzW3Byb3BdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgZWxlbWVudFV0aWxpdGllcyBhbmQgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgYXMgaXNcclxuICAgIGNoaXNlLmVsZW1lbnRVdGlsaXRpZXMgPSBlbGVtZW50VXRpbGl0aWVzO1xyXG4gICAgY2hpc2UudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcclxuICB9O1xyXG4gIFxyXG4gIGlmICggdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGNoaXNlO1xyXG4gIH1cclxufSkoKTsiLCJ2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciAkID0gbGlicy5qUXVlcnk7XHJcbnZhciBvcHRpb25zID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJykuZ2V0T3B0aW9ucygpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc2JnbnZpeikge1xyXG4gIC8vSGVscGVyc1xyXG4gIFxyXG4gIC8vIFRoaXMgZnVuY3Rpb24gaXMgdG8gYmUgY2FsbGVkIGFmdGVyIG5vZGVzIGFyZSByZXNpemVkIHRocm91aCB0aGUgbm9kZSByZXNpemUgZXh0ZW5zaW9uIG9yIHRocm91Z2ggdW5kby9yZWRvIGFjdGlvbnNcclxuICB2YXIgbm9kZVJlc2l6ZUVuZEZ1bmN0aW9uID0gZnVuY3Rpb24gKG5vZGVzKSB7XHJcbiAgICBjeS5zdGFydEJhdGNoKCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgIHZhciB3ID0gbm9kZS53aWR0aCgpO1xyXG4gICAgICB2YXIgaCA9IG5vZGUuaGVpZ2h0KCk7XHJcblxyXG4gICAgICBub2RlLnJlbW92ZVN0eWxlKCd3aWR0aCcpO1xyXG4gICAgICBub2RlLnJlbW92ZVN0eWxlKCdoZWlnaHQnKTtcclxuXHJcbiAgICAgIG5vZGUuZGF0YSgnYmJveCcpLncgPSB3O1xyXG4gICAgICBub2RlLmRhdGEoJ2Jib3gnKS5oID0gaDtcclxuICAgIH1cclxuICAgIGN5LmVuZEJhdGNoKCk7XHJcbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gIH07XHJcbiAgXHJcbiAgLy8gVXBkYXRlIGN5IHN0eWxlc2hlZXRcclxuICB2YXIgdXBhdGVTdHlsZVNoZWV0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjeS5zdHlsZSgpXHJcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250d2VpZ2h0XVwiKVxyXG4gICAgLnN0eWxlKHtcclxuICAgICAgJ2ZvbnQtd2VpZ2h0JzogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250d2VpZ2h0Jyk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250ZmFtaWx5XVwiKVxyXG4gICAgLnN0eWxlKHtcclxuICAgICAgJ2ZvbnQtZmFtaWx5JzogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250ZmFtaWx5Jyk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250c3R5bGVdXCIpXHJcbiAgICAuc3R5bGUoe1xyXG4gICAgICAnZm9udC1zdHlsZSc6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnZm9udHN0eWxlJyk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtsYWJlbHNpemVdXCIpXHJcbiAgICAuc3R5bGUoe1xyXG4gICAgICAnZm9udC1zaXplJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgIC8vIElmIHRoZSBub2RlIGhhcyBsYWJlbHNpemUgZGF0YSBjaGVjayBhZGp1c3ROb2RlTGFiZWxGb250U2l6ZUF1dG9tYXRpY2FsbHkgb3B0aW9uLlxyXG4gICAgICAgIC8vIElmIGl0IGlzIG5vdCBzZXQgdXNlIGxhYmVsc2l6ZSBkYXRhIGFzIGZvbnQgc2l6ZSBlbGVzLiBVc2UgZ2V0TGFiZWxUZXh0U2l6ZSBtZXRob2QuXHJcbiAgICAgICAgdmFyIG9wdCA9IG9wdGlvbnMuYWRqdXN0Tm9kZUxhYmVsRm9udFNpemVBdXRvbWF0aWNhbGx5O1xyXG4gICAgICAgIHZhciBhZGp1c3QgPSB0eXBlb2Ygb3B0ID09PSAnZnVuY3Rpb24nID8gb3B0KCkgOiBvcHQ7XHJcbiAgICAgICAgaWYgKCFhZGp1c3QpIHtcclxuICAgICAgICAgIHJldHVybiBlbGUuZGF0YSgnbGFiZWxzaXplJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldExhYmVsVGV4dFNpemUoZWxlKTtcclxuICAgICAgfVxyXG4gICAgfSkudXBkYXRlKCk7XHJcbiAgfTtcclxuICBcclxuICAvLyBCaW5kIGV2ZW50c1xyXG4gIHZhciBiaW5kQ3lFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuICAgIGN5Lm9uKFwibm9kZXJlc2l6ZS5yZXNpemVlbmRcIiwgZnVuY3Rpb24gKGV2ZW50LCB0eXBlLCBub2RlKSB7XHJcbiAgICAgIG5vZGVSZXNpemVFbmRGdW5jdGlvbihub2RlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGN5Lm9uKFwiYWZ0ZXJEb1wiLCBmdW5jdGlvbiAoZXZlbnQsIGFjdGlvbk5hbWUsIGFyZ3MpIHtcclxuICAgICAgaWYgKGFjdGlvbk5hbWUgPT09ICdjaGFuZ2VQYXJlbnQnKSB7XHJcbiAgICAgICAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oXCJhZnRlclVuZG9cIiwgZnVuY3Rpb24gKGV2ZW50LCBhY3Rpb25OYW1lLCBhcmdzKSB7XHJcbiAgICAgIGlmIChhY3Rpb25OYW1lID09PSAncmVzaXplJykge1xyXG4gICAgICAgIG5vZGVSZXNpemVFbmRGdW5jdGlvbihhcmdzLm5vZGUpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKGFjdGlvbk5hbWUgPT09ICdjaGFuZ2VQYXJlbnQnKSB7XHJcbiAgICAgICAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY3kub24oXCJhZnRlclJlZG9cIiwgZnVuY3Rpb24gKGV2ZW50LCBhY3Rpb25OYW1lLCBhcmdzKSB7XHJcbiAgICAgIGlmIChhY3Rpb25OYW1lID09PSAncmVzaXplJykge1xyXG4gICAgICAgIG5vZGVSZXNpemVFbmRGdW5jdGlvbihhcmdzLm5vZGUpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKGFjdGlvbk5hbWUgPT09ICdjaGFuZ2VQYXJlbnQnKSB7XHJcbiAgICAgICAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuICAvLyBIZWxwZXJzIEVuZFxyXG4gIFxyXG4gICQoZG9jdW1lbnQpLm9uKCd1cGRhdGVHcmFwaEVuZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBjeS5zdGFydEJhdGNoKCk7XHJcbiAgICAvLyBJbml0aWxpemUgZm9udCByZWxhdGVkIGRhdGEgb2YgdGhlIGVsZW1lbnRzIHdoaWNoIGNhbiBoYXZlIGxhYmVsXHJcbiAgICBjeS5ub2RlcygpLmVhY2goZnVuY3Rpb24oaSwgZWxlKSB7XHJcbiAgICAgIGlmIChlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOTGFiZWwoZWxlKSkge1xyXG4gICAgICAgIHZhciBfY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xyXG4gICAgICAgIGVsZS5kYXRhKCdsYWJlbHNpemUnLCBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW19jbGFzc10ubGFiZWxzaXplKTtcclxuICAgICAgICBlbGUuZGF0YSgnZm9udHdlaWdodCcsIGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbX2NsYXNzXS5mb250d2VpZ2h0KTtcclxuICAgICAgICBlbGUuZGF0YSgnZm9udGZhbWlseScsIGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbX2NsYXNzXS5mb250ZmFtaWx5KTtcclxuICAgICAgICBlbGUuZGF0YSgnZm9udHN0eWxlJywgZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1tfY2xhc3NdLmZvbnRzdHlsZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgY3kuZW5kQmF0Y2goKTtcclxuICB9KTtcclxuICBcclxuICAvLyBEbyB0aGVzZSBqdXN0IG9uZSB0aW1lXHJcbiAgJChkb2N1bWVudCkub25lKCd1cGRhdGVHcmFwaEVuZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICB1cGF0ZVN0eWxlU2hlZXQoKTtcclxuICAgIGJpbmRDeUV2ZW50cygpO1xyXG4gIH0pO1xyXG59OyIsIi8vIEV4dGVuZHMgc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzXHJcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgc2JnbnZpeiA9IGxpYnMuc2JnbnZpejtcclxudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcclxudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXM7XHJcbnZhciBvcHRpb25zID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJykuZ2V0T3B0aW9ucygpO1xyXG5cclxuZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllcyA9IHtcclxuICBcInByb2Nlc3NcIjoge1xyXG4gICAgd2lkdGg6IDMwLFxyXG4gICAgaGVpZ2h0OiAzMFxyXG4gIH0sXHJcbiAgXCJvbWl0dGVkIHByb2Nlc3NcIjoge1xyXG4gICAgd2lkdGg6IDMwLFxyXG4gICAgaGVpZ2h0OiAzMFxyXG4gIH0sXHJcbiAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiB7XHJcbiAgICB3aWR0aDogMzAsXHJcbiAgICBoZWlnaHQ6IDMwXHJcbiAgfSxcclxuICBcImFzc29jaWF0aW9ucHJvY2Vzc1wiOiB7XHJcbiAgICB3aWR0aDogMzAsXHJcbiAgICBoZWlnaHQ6IDMwXHJcbiAgfSxcclxuICBcImFzc29jaWF0aW9uXCI6IHtcclxuICAgIHdpZHRoOiAzMCxcclxuICAgIGhlaWdodDogMzBcclxuICB9LFxyXG4gIFwiZGlzc29jaWF0aW9uXCI6IHtcclxuICAgIHdpZHRoOiAzMCxcclxuICAgIGhlaWdodDogMzBcclxuICB9LFxyXG4gIFwibWFjcm9tb2xlY3VsZVwiOiB7XHJcbiAgICB3aWR0aDogMTAwLFxyXG4gICAgaGVpZ2h0OiA1MCxcclxuICAgIGZvbnRmYW1pbHk6ICdIZWx2ZXRpY2EnLFxyXG4gICAgZm9udHdlaWdodDogJ25vcm1hbCcsXHJcbiAgICBmb250c3R5bGU6ICdub3JtYWwnLFxyXG4gICAgbGFiZWxzaXplOiAyMFxyXG4gIH0sXHJcbiAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7XHJcbiAgICB3aWR0aDogMTAwLFxyXG4gICAgaGVpZ2h0OiA1MCxcclxuICAgIGZvbnRmYW1pbHk6ICdIZWx2ZXRpY2EnLFxyXG4gICAgZm9udHdlaWdodDogJ25vcm1hbCcsXHJcbiAgICBmb250c3R5bGU6ICdub3JtYWwnLFxyXG4gICAgbGFiZWxzaXplOiAyMFxyXG4gIH0sXHJcbiAgXCJzaW1wbGUgY2hlbWljYWxcIjoge1xyXG4gICAgd2lkdGg6IDUwLFxyXG4gICAgaGVpZ2h0OiA1MCxcclxuICAgIGZvbnRmYW1pbHk6ICdIZWx2ZXRpY2EnLFxyXG4gICAgZm9udHdlaWdodDogJ25vcm1hbCcsXHJcbiAgICBmb250c3R5bGU6ICdub3JtYWwnLFxyXG4gICAgbGFiZWxzaXplOiAyMFxyXG4gIH0sXHJcbiAgXCJzb3VyY2UgYW5kIHNpbmtcIjoge1xyXG4gICAgd2lkdGg6IDUwLFxyXG4gICAgaGVpZ2h0OiA1MCxcclxuICAgIGZvbnRmYW1pbHk6ICdIZWx2ZXRpY2EnLFxyXG4gICAgZm9udHdlaWdodDogJ25vcm1hbCcsXHJcbiAgICBmb250c3R5bGU6ICdub3JtYWwnLFxyXG4gICAgbGFiZWxzaXplOiAyMFxyXG4gIH0sXHJcbiAgXCJ0YWdcIjoge1xyXG4gICAgd2lkdGg6IDUwLFxyXG4gICAgaGVpZ2h0OiA1MCxcclxuICAgIGZvbnRmYW1pbHk6ICdIZWx2ZXRpY2EnLFxyXG4gICAgZm9udHdlaWdodDogJ25vcm1hbCcsXHJcbiAgICBmb250c3R5bGU6ICdub3JtYWwnLFxyXG4gICAgbGFiZWxzaXplOiAyMFxyXG4gIH0sXHJcbiAgXCJwaGVub3R5cGVcIjoge1xyXG4gICAgd2lkdGg6IDEwMCxcclxuICAgIGhlaWdodDogNTAsXHJcbiAgICBmb250ZmFtaWx5OiAnSGVsdmV0aWNhJyxcclxuICAgIGZvbnR3ZWlnaHQ6ICdub3JtYWwnLFxyXG4gICAgZm9udHN0eWxlOiAnbm9ybWFsJyxcclxuICAgIGxhYmVsc2l6ZTogMjBcclxuICB9LFxyXG4gIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6IHtcclxuICAgIHdpZHRoOiAxMDAsXHJcbiAgICBoZWlnaHQ6IDUwLFxyXG4gICAgZm9udGZhbWlseTogJ0hlbHZldGljYScsXHJcbiAgICBmb250d2VpZ2h0OiAnbm9ybWFsJyxcclxuICAgIGZvbnRzdHlsZTogJ25vcm1hbCcsXHJcbiAgICBsYWJlbHNpemU6IDIwXHJcbiAgfSxcclxuICBcInBlcnR1cmJpbmcgYWdlbnRcIjoge1xyXG4gICAgd2lkdGg6IDEwMCxcclxuICAgIGhlaWdodDogNTAsXHJcbiAgICBmb250ZmFtaWx5OiAnSGVsdmV0aWNhJyxcclxuICAgIGZvbnR3ZWlnaHQ6ICdub3JtYWwnLFxyXG4gICAgZm9udHN0eWxlOiAnbm9ybWFsJyxcclxuICAgIGxhYmVsc2l6ZTogMjBcclxuICB9LFxyXG4gIFwiY29tcGxleFwiOiB7XHJcbiAgICB3aWR0aDogMTAwLFxyXG4gICAgaGVpZ2h0OiAxMDAsXHJcbiAgICBmb250ZmFtaWx5OiAnSGVsdmV0aWNhJyxcclxuICAgIGZvbnR3ZWlnaHQ6ICdub3JtYWwnLFxyXG4gICAgZm9udHN0eWxlOiAnbm9ybWFsJyxcclxuICAgIGxhYmVsc2l6ZTogMTZcclxuICB9LFxyXG4gIFwiY29tcGFydG1lbnRcIjoge1xyXG4gICAgd2lkdGg6IDEwMCxcclxuICAgIGhlaWdodDogMTAwLFxyXG4gICAgZm9udGZhbWlseTogJ0hlbHZldGljYScsXHJcbiAgICBmb250d2VpZ2h0OiAnbm9ybWFsJyxcclxuICAgIGZvbnRzdHlsZTogJ25vcm1hbCcsXHJcbiAgICBsYWJlbHNpemU6IDE2XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gU2VjdGlvbiBTdGFydFxyXG4vLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xyXG5cclxuZWxlbWVudFV0aWxpdGllcy5hZGROb2RlID0gZnVuY3Rpb24gKHgsIHksIHNiZ25jbGFzcywgcGFyZW50LCB2aXNpYmlsaXR5KSB7XHJcbiAgdmFyIGRlZmF1bHRQcm9wZXJ0aWVzID0gdGhpcy5kZWZhdWx0UHJvcGVydGllcztcclxuICB2YXIgZGVmYXVsdHMgPSBkZWZhdWx0UHJvcGVydGllc1tzYmduY2xhc3NdO1xyXG5cclxuICB2YXIgd2lkdGggPSBkZWZhdWx0cyA/IGRlZmF1bHRzLndpZHRoIDogNTA7XHJcbiAgdmFyIGhlaWdodCA9IGRlZmF1bHRzID8gZGVmYXVsdHMuaGVpZ2h0IDogNTA7XHJcbiAgXHJcbiAgdmFyIGNzcyA9IHt9O1xyXG4gIFxyXG4gIGlmIChkZWZhdWx0cykge1xyXG4gICAgaWYgKGRlZmF1bHRzWydib3JkZXItd2lkdGgnXSkge1xyXG4gICAgICBjc3NbJ2JvcmRlci13aWR0aCddID0gZGVmYXVsdHNbJ2JvcmRlci13aWR0aCddO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAoZGVmYXVsdHNbJ2JhY2tncm91bmQtY29sb3InXSkge1xyXG4gICAgICBjc3NbJ2JhY2tncm91bmQtY29sb3InXSA9IGRlZmF1bHRzWydiYWNrZ3JvdW5kLWNvbG9yJ107XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmIChkZWZhdWx0c1snYmFja2dyb3VuZC1vcGFjaXR5J10pIHtcclxuICAgICAgY3NzWydiYWNrZ3JvdW5kLW9wYWNpdHknXSA9IGRlZmF1bHRzWydiYWNrZ3JvdW5kLW9wYWNpdHknXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKGRlZmF1bHRzWydib3JkZXItY29sb3InXSkge1xyXG4gICAgICBjc3NbJ2JvcmRlci1jb2xvciddID0gZGVmYXVsdHNbJ2JvcmRlci1jb2xvciddO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKHZpc2liaWxpdHkpIHtcclxuICAgIGNzcy52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcclxuICB9XHJcblxyXG4gIGlmIChkZWZhdWx0cyAmJiBkZWZhdWx0cy5tdWx0aW1lcikge1xyXG4gICAgc2JnbmNsYXNzICs9IFwiIG11bHRpbWVyXCI7XHJcbiAgfVxyXG4gIHZhciBkYXRhID0ge1xyXG4gICAgY2xhc3M6IHNiZ25jbGFzcyxcclxuICAgIGJib3g6IHtcclxuICAgICAgaDogaGVpZ2h0LFxyXG4gICAgICB3OiB3aWR0aCxcclxuICAgICAgeDogeCxcclxuICAgICAgeTogeVxyXG4gICAgfSxcclxuICAgIHN0YXRlc2FuZGluZm9zOiBbXSxcclxuICAgIHBvcnRzOiBbXSxcclxuICAgIGxhYmVsc2l6ZTogZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkxhYmVsKHNiZ25jbGFzcykgPyAoZGVmYXVsdHMgJiYgZGVmYXVsdHMubGFiZWxzaXplKSA6IHVuZGVmaW5lZCxcclxuICAgIGZvbnRmYW1pbHk6IGVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbChzYmduY2xhc3MpID8gKGRlZmF1bHRzICYmIGRlZmF1bHRzLmZvbnRmYW1pbHkpIDogdW5kZWZpbmVkLFxyXG4gICAgZm9udHdlaWdodDogZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkxhYmVsKHNiZ25jbGFzcykgPyAoZGVmYXVsdHMgJiYgZGVmYXVsdHMuZm9udHdlaWdodCkgOiB1bmRlZmluZWQsXHJcbiAgICBmb250c3R5bGU6IGVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbChzYmduY2xhc3MpID8gKGRlZmF1bHRzICYmIGRlZmF1bHRzLmZvbnRzdHlsZSkgOiB1bmRlZmluZWQsXHJcbiAgICBjbG9uZW1hcmtlcjogZGVmYXVsdHMgJiYgZGVmYXVsdHMuY2xvbmVtYXJrZXIgPyBkZWZhdWx0cy5jbG9uZW1hcmtlciA6IHVuZGVmaW5lZFxyXG4gIH07XHJcblxyXG4gIGlmIChwYXJlbnQpIHtcclxuICAgIGRhdGEucGFyZW50ID0gcGFyZW50O1xyXG4gIH1cclxuXHJcbiAgdmFyIGVsZXMgPSBjeS5hZGQoe1xyXG4gICAgZ3JvdXA6IFwibm9kZXNcIixcclxuICAgIGRhdGE6IGRhdGEsXHJcbiAgICBjc3M6IGNzcyxcclxuICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgIHg6IHgsXHJcbiAgICAgIHk6IHlcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgdmFyIG5ld05vZGUgPSBlbGVzW2VsZXMubGVuZ3RoIC0gMV07XHJcblxyXG4gIHNiZ252aXoucmVmcmVzaFBhZGRpbmdzKCk7XHJcbiAgcmV0dXJuIG5ld05vZGU7XHJcbn07XHJcblxyXG5lbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UgPSBmdW5jdGlvbiAoc291cmNlLCB0YXJnZXQsIHNiZ25jbGFzcywgdmlzaWJpbGl0eSkge1xyXG4gIHZhciBkZWZhdWx0UHJvcGVydGllcyA9IHRoaXMuZGVmYXVsdFByb3BlcnRpZXM7XHJcbiAgdmFyIGRlZmF1bHRzID0gZGVmYXVsdFByb3BlcnRpZXNbc2JnbmNsYXNzXTtcclxuICB2YXIgY3NzID0gZGVmYXVsdHMgPyB7XHJcbiAgICAnd2lkdGgnOiBkZWZhdWx0c1snd2lkdGgnXVxyXG4gIH0gOiB7fTtcclxuICBcclxuICB2YXIgY3NzID0ge307XHJcbiAgXHJcbiAgaWYgKGRlZmF1bHRzKSB7XHJcbiAgICBpZiAoZGVmYXVsdHMud2lkdGgpIHtcclxuICAgICAgY3NzLndpZHRoID0gZGVmYXVsdHMud2lkdGg7XHJcbiAgICB9IFxyXG4gICAgXHJcbiAgICBpZiAoZGVmYXVsdHNbJ2xpbmUtY29sb3InXSkge1xyXG4gICAgICBjc3NbJ2xpbmUtY29sb3InXSA9IGRlZmF1bHRzWydsaW5lLWNvbG9yJ107XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAodmlzaWJpbGl0eSkge1xyXG4gICAgY3NzLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xyXG4gIH1cclxuXHJcbiAgdmFyIGVsZXMgPSBjeS5hZGQoe1xyXG4gICAgZ3JvdXA6IFwiZWRnZXNcIixcclxuICAgIGRhdGE6IHtcclxuICAgICAgc291cmNlOiBzb3VyY2UsXHJcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxyXG4gICAgICBjbGFzczogc2JnbmNsYXNzXHJcbiAgICB9LFxyXG4gICAgY3NzOiBjc3NcclxuICB9KTtcclxuXHJcbiAgdmFyIG5ld0VkZ2UgPSBlbGVzW2VsZXMubGVuZ3RoIC0gMV07XHJcbiAgXHJcbiAgcmV0dXJuIG5ld0VkZ2U7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBUaGlzIG1ldGhvZCBhc3N1bWVzIHRoYXQgcGFyYW0ubm9kZXNUb01ha2VDb21wb3VuZCBjb250YWlucyBhdCBsZWFzdCBvbmUgbm9kZVxyXG4gKiBhbmQgYWxsIG9mIHRoZSBub2RlcyBpbmNsdWRpbmcgaW4gaXQgaGF2ZSB0aGUgc2FtZSBwYXJlbnQuIEl0IGNyZWF0ZXMgYSBjb21wb3VuZCBmb3QgdGhlIGdpdmVuIG5vZGVzIGFuIGhhdmluZyB0aGUgZ2l2ZW4gdHlwZS5cclxuICovXHJcbmVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKG5vZGVzVG9NYWtlQ29tcG91bmQsIGNvbXBvdW5kVHlwZSkge1xyXG4gIHZhciBvbGRQYXJlbnRJZCA9IG5vZGVzVG9NYWtlQ29tcG91bmRbMF0uZGF0YShcInBhcmVudFwiKTtcclxuICAvLyBUaGUgcGFyZW50IG9mIG5ldyBjb21wb3VuZCB3aWxsIGJlIHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kXHJcbiAgdmFyIG5ld0NvbXBvdW5kID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjb21wb3VuZFR5cGUsIG9sZFBhcmVudElkKTtcclxuICB2YXIgbmV3Q29tcG91bmRJZCA9IG5ld0NvbXBvdW5kLmlkKCk7XHJcbiAgbm9kZXNUb01ha2VDb21wb3VuZC5tb3ZlKHtwYXJlbnQ6IG5ld0NvbXBvdW5kSWR9KTtcclxuICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xyXG4gIHJldHVybiBuZXdDb21wb3VuZDtcclxufTtcclxuXHJcbi8qXHJcbiAqIFJlbW92ZXMgYSBjb21wb3VuZC4gQmVmb3JlIHRoZSByZW1vdmFsIG9wZXJhdGlvbiBtb3ZlcyB0aGUgY2hpbGRyZW4gb2YgdGhhdCBjb21wb3VuZCB0byB0aGUgcGFyZW50IG9mIHRoZSBjb21wb3VuZC5cclxuICogUmV0dXJucyBvbGQgY2hpbGRyZW4gb2YgdGhlIGNvbXBvdW5kIHdoaWNoIGFyZSBtb3ZlZCB0byBhbm90aGVyIHBhcmVudCBhbmQgdGhlIHJlbW92ZWQgY29tcG91bmQgdG8gcmVzdG9yZSBiYWNrIGxhdGVyLlxyXG4gKi9cclxuZWxlbWVudFV0aWxpdGllcy5yZW1vdmVDb21wb3VuZCA9IGZ1bmN0aW9uIChjb21wb3VuZFRvUmVtb3ZlKSB7XHJcbiAgdmFyIGNvbXBvdW5kSWQgPSBjb21wb3VuZFRvUmVtb3ZlLmlkKCk7XHJcbiAgdmFyIG5ld1BhcmVudElkID0gY29tcG91bmRUb1JlbW92ZS5kYXRhKFwicGFyZW50XCIpO1xyXG4gIG5ld1BhcmVudElkID0gbmV3UGFyZW50SWQgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBuZXdQYXJlbnRJZDtcclxuICB2YXIgY2hpbGRyZW5PZkNvbXBvdW5kID0gY29tcG91bmRUb1JlbW92ZS5jaGlsZHJlbigpO1xyXG5cclxuICBjaGlsZHJlbk9mQ29tcG91bmQubW92ZSh7cGFyZW50OiBuZXdQYXJlbnRJZH0pO1xyXG4gIHZhciByZW1vdmVkQ29tcG91bmQgPSBjb21wb3VuZFRvUmVtb3ZlLnJlbW92ZSgpO1xyXG4gIFxyXG4gIHJldHVybiB7XHJcbiAgICBjaGlsZHJlbk9mQ29tcG91bmQ6IGNoaWxkcmVuT2ZDb21wb3VuZCxcclxuICAgIHJlbW92ZWRDb21wb3VuZDogcmVtb3ZlZENvbXBvdW5kXHJcbiAgfTtcclxufTtcclxuXHJcbi8qXHJcbiAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxyXG4gKiBpbiB0aGUgY29tcGxleC4gUGFyYW1ldGVycyBhcmUgZXhwbGFpbmVkIGJlbG93LlxyXG4gKiB0ZW1wbGF0ZVR5cGU6IFRoZSB0eXBlIG9mIHRoZSB0ZW1wbGF0ZSByZWFjdGlvbi4gSXQgbWF5IGJlICdhc3NvY2lhdGlvbicgb3IgJ2Rpc3NvY2lhdGlvbicgZm9yIG5vdy5cclxuICogbWFjcm9tb2xlY3VsZUxpc3Q6IFRoZSBsaXN0IG9mIHRoZSBuYW1lcyBvZiBtYWNyb21vbGVjdWxlcyB3aGljaCB3aWxsIGludm9sdmUgaW4gdGhlIHJlYWN0aW9uLlxyXG4gKiBjb21wbGV4TmFtZTogVGhlIG5hbWUgb2YgdGhlIGNvbXBsZXggaW4gdGhlIHJlYWN0aW9uLlxyXG4gKiBwcm9jZXNzUG9zaXRpb246IFRoZSBtb2RhbCBwb3NpdGlvbiBvZiB0aGUgcHJvY2VzcyBpbiB0aGUgcmVhY3Rpb24uIFRoZSBkZWZhdWx0IHZhbHVlIGlzIHRoZSBjZW50ZXIgb2YgdGhlIGNhbnZhcy5cclxuICogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiBUaGlzIG9wdGlvbiB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY29zZS1iaWxrZW50IGxheW91dCB3aXRoIHRoZSBzYW1lIG5hbWUuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDE1LlxyXG4gKiB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cclxuICogZWRnZUxlbmd0aDogVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSBtYWNyb21vbGVjdWxlcyBhdCB0aGUgYm90aCBzaWRlcy5cclxuICovXHJcbmVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKSB7XHJcbiAgdmFyIGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1tcIm1hY3JvbW9sZWN1bGVcIl07XHJcbiAgdmFyIHRlbXBsYXRlVHlwZSA9IHRlbXBsYXRlVHlwZTtcclxuICB2YXIgcHJvY2Vzc1dpZHRoID0gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1t0ZW1wbGF0ZVR5cGVdID8gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1t0ZW1wbGF0ZVR5cGVdLndpZHRoIDogNTA7XHJcbiAgdmFyIG1hY3JvbW9sZWN1bGVXaWR0aCA9IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID8gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMud2lkdGggOiA1MDtcclxuICB2YXIgbWFjcm9tb2xlY3VsZUhlaWdodCA9IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID8gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMuaGVpZ2h0IDogNTA7XHJcbiAgdmFyIHByb2Nlc3NQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbiA/IHByb2Nlc3NQb3NpdGlvbiA6IGVsZW1lbnRVdGlsaXRpZXMuY29udmVydFRvTW9kZWxQb3NpdGlvbih7eDogY3kud2lkdGgoKSAvIDIsIHk6IGN5LmhlaWdodCgpIC8gMn0pO1xyXG4gIHZhciBtYWNyb21vbGVjdWxlTGlzdCA9IG1hY3JvbW9sZWN1bGVMaXN0O1xyXG4gIHZhciBjb21wbGV4TmFtZSA9IGNvbXBsZXhOYW1lO1xyXG4gIHZhciBudW1PZk1hY3JvbW9sZWN1bGVzID0gbWFjcm9tb2xlY3VsZUxpc3QubGVuZ3RoO1xyXG4gIHZhciB0aWxpbmdQYWRkaW5nVmVydGljYWwgPSB0aWxpbmdQYWRkaW5nVmVydGljYWwgPyB0aWxpbmdQYWRkaW5nVmVydGljYWwgOiAxNTtcclxuICB2YXIgdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPSB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA/IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsIDogMTU7XHJcbiAgdmFyIGVkZ2VMZW5ndGggPSBlZGdlTGVuZ3RoID8gZWRnZUxlbmd0aCA6IDYwO1xyXG5cclxuICB2YXIgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXM7XHJcbiAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xyXG4gICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xyXG4gIH1cclxuXHJcbiAgLy9DcmVhdGUgdGhlIHByb2Nlc3MgaW4gdGVtcGxhdGUgdHlwZVxyXG4gIHZhciBwcm9jZXNzID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwgdGVtcGxhdGVUeXBlKTtcclxuICBwcm9jZXNzLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xyXG5cclxuICAvL0RlZmluZSB0aGUgc3RhcnRpbmcgeSBwb3NpdGlvblxyXG4gIHZhciB5UG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZNYWNyb21vbGVjdWxlcyAtIDEpIC8gMikgKiAobWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XHJcblxyXG4gIC8vQ3JlYXRlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1PZk1hY3JvbW9sZWN1bGVzOyBpKyspIHtcclxuICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzLCB5UG9zaXRpb24sIFwibWFjcm9tb2xlY3VsZVwiKTtcclxuICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcbiAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgbWFjcm9tb2xlY3VsZUxpc3RbaV0pO1xyXG5cclxuICAgIC8vY3JlYXRlIHRoZSBlZGdlIGNvbm5lY3RlZCB0byB0aGUgbmV3IG1hY3JvbW9sZWN1bGVcclxuICAgIHZhciBuZXdFZGdlO1xyXG4gICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xyXG4gICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKG5ld05vZGUuaWQoKSwgcHJvY2Vzcy5pZCgpLCAnY29uc3VtcHRpb24nKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgbmV3Tm9kZS5pZCgpLCAncHJvZHVjdGlvbicpO1xyXG4gICAgfVxyXG5cclxuICAgIG5ld0VkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcblxyXG4gICAgLy91cGRhdGUgdGhlIHkgcG9zaXRpb25cclxuICAgIHlQb3NpdGlvbiArPSBtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xyXG4gIH1cclxuXHJcbiAgLy9DcmVhdGUgdGhlIGNvbXBsZXggaW5jbHVkaW5nIG1hY3JvbW9sZWN1bGVzIGluc2lkZSBvZiBpdFxyXG4gIC8vVGVtcHJvcmFyaWx5IGFkZCBpdCB0byB0aGUgcHJvY2VzcyBwb3NpdGlvbiB3ZSB3aWxsIG1vdmUgaXQgYWNjb3JkaW5nIHRvIHRoZSBsYXN0IHNpemUgb2YgaXRcclxuICB2YXIgY29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksICdjb21wbGV4Jyk7XHJcbiAgY29tcGxleC5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcclxuICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcclxuXHJcbiAgLy9JZiBhIG5hbWUgaXMgc3BlY2lmaWVkIGZvciB0aGUgY29tcGxleCBzZXQgaXRzIGxhYmVsIGFjY29yZGluZ2x5XHJcbiAgaWYgKGNvbXBsZXhOYW1lKSB7XHJcbiAgICBjb21wbGV4LmRhdGEoJ2xhYmVsJywgY29tcGxleE5hbWUpO1xyXG4gIH1cclxuXHJcbiAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubm5lY3RlZCB0byB0aGUgY29tcGxleFxyXG4gIHZhciBlZGdlT2ZDb21wbGV4O1xyXG4gIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcclxuICAgIGVkZ2VPZkNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBjb21wbGV4LmlkKCksICdwcm9kdWN0aW9uJyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWRnZU9mQ29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShjb21wbGV4LmlkKCksIHByb2Nlc3MuaWQoKSwgJ2NvbnN1bXB0aW9uJyk7XHJcbiAgfVxyXG4gIGVkZ2VPZkNvbXBsZXguZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcblxyXG4gIC8vQ3JlYXRlIHRoZSBtYWNyb21vbGVjdWxlcyBpbnNpZGUgdGhlIGNvbXBsZXhcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mTWFjcm9tb2xlY3VsZXM7IGkrKykge1xyXG4gICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoY29tcGxleC5wb3NpdGlvbigneCcpLCBjb21wbGV4LnBvc2l0aW9uKCd5JyksIFwibWFjcm9tb2xlY3VsZVwiLCBjb21wbGV4LmlkKCkpO1xyXG4gICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcclxuICAgIG5ld05vZGUuZGF0YSgnbGFiZWwnLCBtYWNyb21vbGVjdWxlTGlzdFtpXSk7XHJcbiAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcclxuICB9XHJcblxyXG4gIHZhciBsYXlvdXROb2RlcyA9IGN5Lm5vZGVzKCdbanVzdEFkZGVkTGF5b3V0Tm9kZV0nKTtcclxuICBsYXlvdXROb2Rlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJyk7XHJcbiAgbGF5b3V0Tm9kZXMubGF5b3V0KHtcclxuICAgIG5hbWU6ICdjb3NlLWJpbGtlbnQnLFxyXG4gICAgcmFuZG9taXplOiBmYWxzZSxcclxuICAgIGZpdDogZmFsc2UsXHJcbiAgICBhbmltYXRlOiBmYWxzZSxcclxuICAgIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLFxyXG4gICAgdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLFxyXG4gICAgc3RvcDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAvL3JlLXBvc2l0aW9uIHRoZSBub2RlcyBpbnNpZGUgdGhlIGNvbXBsZXhcclxuICAgICAgdmFyIHN1cHBvc2VkWFBvc2l0aW9uO1xyXG4gICAgICB2YXIgc3VwcG9zZWRZUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueTtcclxuXHJcbiAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcclxuICAgICAgICBzdXBwb3NlZFhQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBjb21wbGV4Lm91dGVyV2lkdGgoKSAvIDI7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgc3VwcG9zZWRYUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gY29tcGxleC5vdXRlcldpZHRoKCkgLyAyO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgcG9zaXRpb25EaWZmWCA9IHN1cHBvc2VkWFBvc2l0aW9uIC0gY29tcGxleC5wb3NpdGlvbigneCcpO1xyXG4gICAgICB2YXIgcG9zaXRpb25EaWZmWSA9IHN1cHBvc2VkWVBvc2l0aW9uIC0gY29tcGxleC5wb3NpdGlvbigneScpO1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyh7eDogcG9zaXRpb25EaWZmWCwgeTogcG9zaXRpb25EaWZmWX0sIGNvbXBsZXgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvL2ZpbHRlciB0aGUganVzdCBhZGRlZCBlbGVtZW10cyB0byByZXR1cm4gdGhlbSBhbmQgcmVtb3ZlIGp1c3QgYWRkZWQgbWFya1xyXG4gIHZhciBlbGVzID0gY3kuZWxlbWVudHMoJ1tqdXN0QWRkZWRdJyk7XHJcbiAgZWxlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWQnKTtcclxuICBcclxuICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xyXG4gIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcclxuICBlbGVzLnNlbGVjdCgpO1xyXG4gIFxyXG4gIHJldHVybiBlbGVzOyAvLyBSZXR1cm4gdGhlIGp1c3QgYWRkZWQgZWxlbWVudHNcclxufTtcclxuXHJcbi8qXHJcbiAqIE1vdmUgdGhlIG5vZGVzIHRvIGEgbmV3IHBhcmVudCBhbmQgY2hhbmdlIHRoZWlyIHBvc2l0aW9uIGlmIHBvc3NEaWZmIHBhcmFtcyBhcmUgc2V0LlxyXG4gKi9cclxuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQgPSBmdW5jdGlvbihub2RlcywgbmV3UGFyZW50LCBwb3NEaWZmWCwgcG9zRGlmZlkpIHtcclxuICB2YXIgbmV3UGFyZW50SWQgPSB0eXBlb2YgbmV3UGFyZW50ID09PSAnc3RyaW5nJyA/IG5ld1BhcmVudCA6IG5ld1BhcmVudC5pZCgpO1xyXG4gIG5vZGVzLm1vdmUoe1wicGFyZW50XCI6IG5ld1BhcmVudElkfSk7XHJcbiAgZWxlbWVudFV0aWxpdGllcy5tb3ZlTm9kZXMoe3g6IHBvc0RpZmZYLCB5OiBwb3NEaWZmWX0sIG5vZGVzKTtcclxufTtcclxuXHJcbi8vIFJlc2l6ZSBnaXZlbiBub2RlcyBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHkgb25lIG9mIHdpZHRoIG9yIGhlaWdodCBzaG91bGQgbm90IGJlIHNldC5cclxuZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uIChub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8pIHtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgdmFyIHJhdGlvID0gdW5kZWZpbmVkO1xyXG4gICAgdmFyIGVsZU11c3RCZVNxdWFyZSA9IGVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlKG5vZGUuZGF0YSgnY2xhc3MnKSk7XHJcblxyXG4gICAgLy8gTm90ZSB0aGF0IGJvdGggd2lkdGggYW5kIGhlaWdodCBzaG91bGQgbm90IGJlIHNldCBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHlcclxuICAgIGlmICh3aWR0aCkge1xyXG4gICAgICBpZiAodXNlQXNwZWN0UmF0aW8gfHwgZWxlTXVzdEJlU3F1YXJlKSB7XHJcbiAgICAgICAgcmF0aW8gPSB3aWR0aCAvIG5vZGUud2lkdGgoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gd2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGhlaWdodCkge1xyXG4gICAgICBpZiAodXNlQXNwZWN0UmF0aW8gfHwgZWxlTXVzdEJlU3F1YXJlKSB7XHJcbiAgICAgICAgcmF0aW8gPSBoZWlnaHQgLyBub2RlLmhlaWdodCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBoZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJhdGlvICYmICFoZWlnaHQpIHtcclxuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gbm9kZS5oZWlnaHQoKSAqIHJhdGlvO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocmF0aW8gJiYgIXdpZHRoKSB7XHJcbiAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IG5vZGUud2lkdGgoKSAqIHJhdGlvO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8vIFNlY3Rpb24gRW5kXHJcbi8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXHJcblxyXG4vLyBTZWN0aW9uIFN0YXJ0XHJcbi8vIENvbW1vbiBlbGVtZW50IHByb3BlcnRpZXNcclxuXHJcbi8vIEdldCBjb21tb24gcHJvcGVydGllcyBvZiBnaXZlbiBlbGVtZW50cy4gUmV0dXJucyBudWxsIGlmIHRoZSBnaXZlbiBlbGVtZW50IGxpc3QgaXMgZW1wdHkgb3IgdGhlXHJcbi8vIHByb3BlcnR5IGlzIG5vdCBjb21tb24gZm9yIGFsbCBlbGVtZW50cy4gZGF0YU9yQ3NzIHBhcmFtZXRlciBzcGVjaWZ5IHdoZXRoZXIgdG8gY2hlY2sgdGhlIHByb3BlcnR5IG9uIGRhdGEgb3IgY3NzLlxyXG4vLyBUaGUgZGVmYXVsdCB2YWx1ZSBmb3IgaXQgaXMgZGF0YS4gSWYgcHJvcGVydHlOYW1lIHBhcmFtZXRlciBpcyBnaXZlbiBhcyBhIGZ1bmN0aW9uIGluc3RlYWQgb2YgYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBcclxuLy8gcHJvcGVydHkgbmFtZSB0aGVuIHVzZSB3aGF0IHRoYXQgZnVuY3Rpb24gcmV0dXJucy5cclxuZWxlbWVudFV0aWxpdGllcy5nZXRDb21tb25Qcm9wZXJ0eSA9IGZ1bmN0aW9uIChlbGVtZW50cywgcHJvcGVydHlOYW1lLCBkYXRhT3JDc3MpIHtcclxuICBpZiAoZWxlbWVudHMubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgdmFyIGlzRnVuY3Rpb247XHJcbiAgLy8gSWYgd2UgYXJlIG5vdCBjb21wYXJpbmcgdGhlIHByb3BlcnRpZXMgZGlyZWN0bHkgdXNlcnMgY2FuIHNwZWNpZnkgYSBmdW5jdGlvbiBhcyB3ZWxsXHJcbiAgaWYgKHR5cGVvZiBwcm9wZXJ0eU5hbWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGlzRnVuY3Rpb24gPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLy8gVXNlIGRhdGEgYXMgZGVmYXVsdFxyXG4gIGlmICghaXNGdW5jdGlvbiAmJiAhZGF0YU9yQ3NzKSB7XHJcbiAgICBkYXRhT3JDc3MgPSAnZGF0YSc7XHJcbiAgfVxyXG5cclxuICB2YXIgdmFsdWUgPSBpc0Z1bmN0aW9uID8gcHJvcGVydHlOYW1lKGVsZW1lbnRzWzBdKSA6IGVsZW1lbnRzWzBdW2RhdGFPckNzc10ocHJvcGVydHlOYW1lKTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKCAoIGlzRnVuY3Rpb24gPyBwcm9wZXJ0eU5hbWUoZWxlbWVudHNbaV0pIDogZWxlbWVudHNbaV1bZGF0YU9yQ3NzXShwcm9wZXJ0eU5hbWUpICkgIT0gdmFsdWUpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdmFsdWU7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIGlmIHRoZSBmdW5jdGlvbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlIGZvciBhbGwgb2YgdGhlIGdpdmVuIGVsZW1lbnRzLlxyXG5lbGVtZW50VXRpbGl0aWVzLnRydWVGb3JBbGxFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVtZW50cywgZmNuKSB7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKCFmY24oZWxlbWVudHNbaV0pKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgY2FuIGhhdmUgc2JnbmNhcmRpbmFsaXR5XHJcbmVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05DYXJkaW5hbGl0eSA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcclxuXHJcbiAgcmV0dXJuIGVsZS5kYXRhKCdjbGFzcycpID09ICdjb25zdW1wdGlvbicgfHwgZWxlLmRhdGEoJ2NsYXNzJykgPT0gJ3Byb2R1Y3Rpb24nO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgY2FuIGhhdmUgc2JnbmxhYmVsXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbCA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcclxuXHJcbiAgcmV0dXJuIHNiZ25jbGFzcyAhPSAnYW5kJyAmJiBzYmduY2xhc3MgIT0gJ29yJyAmJiBzYmduY2xhc3MgIT0gJ25vdCdcclxuICAgICAgICAgICYmIHNiZ25jbGFzcyAhPSAnYXNzb2NpYXRpb24nICYmIHNiZ25jbGFzcyAhPSAnZGlzc29jaWF0aW9uJyAmJiAhc2JnbmNsYXNzLmVuZHNXaXRoKCdwcm9jZXNzJyk7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBoYXZlIHVuaXQgb2YgaW5mb3JtYXRpb25cclxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlVW5pdE9mSW5mb3JtYXRpb24gPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XHJcblxyXG4gIGlmIChzYmduY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCdcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZScgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCcgfHwgc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwgbXVsdGltZXInXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUgbXVsdGltZXInIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUgbXVsdGltZXInXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXggbXVsdGltZXInKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgaGF2ZSBzdGF0ZSB2YXJpYWJsZVxyXG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTdGF0ZVZhcmlhYmxlID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xyXG5cclxuICBpZiAoc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4J1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlIG11bHRpbWVyJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4IG11bHRpbWVyJykge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlIHNob3VsZCBiZSBzcXVhcmUgaW4gc2hhcGVcclxuZWxlbWVudFV0aWxpdGllcy5tdXN0QmVTcXVhcmUgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XHJcblxyXG4gIHJldHVybiAoc2JnbmNsYXNzLmluZGV4T2YoJ3Byb2Nlc3MnKSAhPSAtMSB8fCBzYmduY2xhc3MgPT0gJ3NvdXJjZSBhbmQgc2luaydcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYW5kJyB8fCBzYmduY2xhc3MgPT0gJ29yJyB8fCBzYmduY2xhc3MgPT0gJ25vdCdcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYXNzb2NpYXRpb24nIHx8IHNiZ25jbGFzcyA9PSAnZGlzc29jaWF0aW9uJyk7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgYW55IG9mIHRoZSBnaXZlbiBub2RlcyBtdXN0IG5vdCBiZSBpbiBzcXVhcmUgc2hhcGVcclxuZWxlbWVudFV0aWxpdGllcy5zb21lTXVzdE5vdEJlU3F1YXJlID0gZnVuY3Rpb24gKG5vZGVzKSB7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5tdXN0QmVTcXVhcmUobm9kZS5kYXRhKCdjbGFzcycpKSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZXMgZWxlbWVudCBjYW4gYmUgY2xvbmVkXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2FuQmVDbG9uZWQgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xyXG5cclxuICB2YXIgbGlzdCA9IHtcclxuICAgICd1bnNwZWNpZmllZCBlbnRpdHknOiB0cnVlLFxyXG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxyXG4gICAgJ2NvbXBsZXgnOiB0cnVlLFxyXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcclxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxyXG4gICAgJ3BlcnR1cmJpbmcgYWdlbnQnOiB0cnVlXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGxpc3Rbc2JnbmNsYXNzXSA/IHRydWUgOiBmYWxzZTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZXMgZWxlbWVudCBjYW4gYmUgY2xvbmVkXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2FuQmVNdWx0aW1lciA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XHJcblxyXG4gIHZhciBsaXN0ID0ge1xyXG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxyXG4gICAgJ2NvbXBsZXgnOiB0cnVlLFxyXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcclxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGxpc3Rbc2JnbmNsYXNzXSA/IHRydWUgOiBmYWxzZTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhbiBFUE5cclxuZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcclxuXHJcbiAgcmV0dXJuIChzYmduY2xhc3MgPT0gJ3Vuc3BlY2lmaWVkIGVudGl0eSdcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCcpO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGVtZW50IGlzIGEgUE5cclxuZWxlbWVudFV0aWxpdGllcy5pc1BOQ2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xyXG5cclxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAncHJvY2VzcydcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnb21pdHRlZCBwcm9jZXNzJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICd1bmNlcnRhaW4gcHJvY2VzcydcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYXNzb2NpYXRpb24nXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2Rpc3NvY2lhdGlvbidcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAncGhlbm90eXBlJyk7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgaXMgYSBsb2dpY2FsIG9wZXJhdG9yXHJcbmVsZW1lbnRVdGlsaXRpZXMuaXNMb2dpY2FsT3BlcmF0b3IgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgcmV0dXJuIChzYmduY2xhc3MgPT0gJ2FuZCcgfHwgc2JnbmNsYXNzID09ICdvcicgfHwgc2JnbmNsYXNzID09ICdub3QnKTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgY2xhc3Mgb2YgZ2l2ZW4gZWxlbWVudCBpcyBhIGVxdWl2YWxhbmNlIGNsYXNzXHJcbmVsZW1lbnRVdGlsaXRpZXMuY29udmVuaWVudFRvRXF1aXZhbGVuY2UgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgcmV0dXJuIChzYmduY2xhc3MgPT0gJ3RhZycgfHwgc2JnbmNsYXNzID09ICd0ZXJtaW5hbCcpO1xyXG59O1xyXG5cclxuLy8gUmVsb2NhdGVzIHN0YXRlIGFuZCBpbmZvIGJveGVzLiBUaGlzIGZ1bmN0aW9uIGlzIGV4cGVjdGVkIHRvIGJlIGNhbGxlZCBhZnRlciBhZGQvcmVtb3ZlIHN0YXRlIGFuZCBpbmZvIGJveGVzXHJcbmVsZW1lbnRVdGlsaXRpZXMucmVsb2NhdGVTdGF0ZUFuZEluZm9zID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzdGF0ZUFuZEluZm9zID0gKGVsZS5pc05vZGUgJiYgZWxlLmlzTm9kZSgpKSA/IGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpIDogZWxlO1xyXG4gIHZhciBsZW5ndGggPSBzdGF0ZUFuZEluZm9zLmxlbmd0aDtcclxuICBpZiAobGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgZWxzZSBpZiAobGVuZ3RoID09IDEpIHtcclxuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gMDtcclxuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xyXG4gIH1cclxuICBlbHNlIGlmIChsZW5ndGggPT0gMikge1xyXG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAwO1xyXG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XHJcblxyXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAwO1xyXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSA1MDtcclxuICB9XHJcbiAgZWxzZSBpZiAobGVuZ3RoID09IDMpIHtcclxuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xyXG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XHJcblxyXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAyNTtcclxuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC55ID0gLTUwO1xyXG5cclxuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gMDtcclxuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC55ID0gNTA7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAtMjU7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcclxuXHJcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDI1O1xyXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSAtNTA7XHJcblxyXG4gICAgc3RhdGVBbmRJbmZvc1syXS5iYm94LnggPSAtMjU7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xyXG5cclxuICAgIHN0YXRlQW5kSW5mb3NbM10uYmJveC54ID0gMjU7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzNdLmJib3gueSA9IDUwO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIENoYW5nZSBzdGF0ZSB2YWx1ZSBvciB1bml0IG9mIGluZm9ybWF0aW9uIGJveCBvZiBnaXZlbiBub2RlcyB3aXRoIGdpdmVuIGluZGV4LlxyXG4vLyBUeXBlIHBhcmFtZXRlciBpbmRpY2F0ZXMgd2hldGhlciB0byBjaGFuZ2UgdmFsdWUgb3IgdmFyaWFibGUsIGl0IGlzIHZhbGlkIGlmIHRoZSBib3ggYXQgdGhlIGdpdmVuIGluZGV4IGlzIGEgc3RhdGUgdmFyaWFibGUuXHJcbi8vIFZhbHVlIHBhcmFtZXRlciBpcyB0aGUgbmV3IHZhbHVlIHRvIHNldC5cclxuLy8gVGhpcyBtZXRob2QgdGhlIG9sZCB2YWx1ZSBvZiB0aGUgY2hhbmdlZCBkYXRhIChXZSBhc3N1bWUgdGhhdCB0aGUgb2xkIHZhbHVlIG9mIHRoZSBjaGFuZ2VkIGRhdGEgd2FzIHRoZSBzYW1lIGZvciBhbGwgbm9kZXMpLlxyXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpIHtcclxuICB2YXIgcmVzdWx0O1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcclxuICAgIHZhciBib3ggPSBzdGF0ZUFuZEluZm9zW2luZGV4XTtcclxuXHJcbiAgICBpZiAoYm94LmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikge1xyXG4gICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgIHJlc3VsdCA9IGJveC5zdGF0ZVt0eXBlXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgYm94LnN0YXRlW3R5cGVdID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChib3guY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcclxuICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICByZXN1bHQgPSBib3gubGFiZWwudGV4dDtcclxuICAgICAgfVxyXG5cclxuICAgICAgYm94LmxhYmVsLnRleHQgPSB2YWx1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXHJcbi8vIFRoZSBib3ggaXMgcmVwcmVzZW50ZWQgYnkgdGhlIHBhcmFtZXRlciBvYmouXHJcbi8vIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBqdXN0IGFkZGVkIGJveC5cclxuZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2Rlcywgb2JqKSB7XHJcbiAgdmFyIGluZGV4O1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcclxuICAgIFxyXG4gICAgLy8gQ2xvbmUgdGhlIG9iamVjdCB0byBhdm9pZCByZWZlcmVuY2luZyBpc3N1ZXNcclxuICAgIHZhciBjbG9uZSA9IGpRdWVyeS5leHRlbmQodHJ1ZSwge30sIG9iaik7XHJcbiAgICBcclxuICAgIHN0YXRlQW5kSW5mb3MucHVzaChjbG9uZSk7XHJcbiAgICBpbmRleCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoIC0gMTtcclxuICAgIHRoaXMucmVsb2NhdGVTdGF0ZUFuZEluZm9zKHN0YXRlQW5kSW5mb3MpOyAvLyBSZWxvY2F0ZSBzdGF0ZSBhbmQgaW5mb3NcclxuICB9XHJcblxyXG4gIHJldHVybiBpbmRleDtcclxufTtcclxuXHJcbi8vIFJlbW92ZSB0aGUgc3RhdGUgb3IgaW5mbyBib3hlcyBvZiB0aGUgZ2l2ZW4gbm9kZXMgYXQgZ2l2ZW4gaW5kZXguXHJcbi8vIFJldHVybnMgdGhlIHJlbW92ZWQgYm94LlxyXG5lbGVtZW50VXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBpbmRleCkge1xyXG4gIHZhciBvYmo7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xyXG4gICAgaWYgKCFvYmopIHtcclxuICAgICAgb2JqID0gc3RhdGVBbmRJbmZvc1tpbmRleF07XHJcbiAgICB9XHJcbiAgICBzdGF0ZUFuZEluZm9zLnNwbGljZShpbmRleCwgMSk7IC8vIFJlbW92ZSB0aGUgYm94XHJcbiAgICB0aGlzLnJlbG9jYXRlU3RhdGVBbmRJbmZvcyhzdGF0ZUFuZEluZm9zKTsgLy8gUmVsb2NhdGUgc3RhdGUgYW5kIGluZm9zXHJcbiAgfVxyXG5cclxuICByZXR1cm4gb2JqO1xyXG59O1xyXG5cclxuLy8gU2V0IG11bHRpbWVyIHN0YXR1cyBvZiB0aGUgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cclxuZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uIChub2Rlcywgc3RhdHVzKSB7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHZhciBzYmduY2xhc3MgPSBub2RlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgICB2YXIgaXNNdWx0aW1lciA9IG5vZGUuZGF0YSgnY2xhc3MnKS5lbmRzV2l0aCgnIG11bHRpbWVyJyk7XHJcblxyXG4gICAgaWYgKHN0YXR1cykgeyAvLyBNYWtlIG11bHRpbWVyIHN0YXR1cyB0cnVlXHJcbiAgICAgIGlmICghaXNNdWx0aW1lcikge1xyXG4gICAgICAgIG5vZGUuZGF0YSgnY2xhc3MnLCBzYmduY2xhc3MgKyAnIG11bHRpbWVyJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgeyAvLyBNYWtlIG11bHRpbWVyIHN0YXR1cyBmYWxzZVxyXG4gICAgICBpZiAoaXNNdWx0aW1lcikge1xyXG4gICAgICAgIG5vZGUuZGF0YSgnY2xhc3MnLCBzYmduY2xhc3MucmVwbGFjZSgnIG11bHRpbWVyJywgJycpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8vIFNldCBjbG9uZSBtYXJrZXIgc3RhdHVzIG9mIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXHJcbmVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbiAobm9kZXMsIHN0YXR1cykge1xyXG4gIGlmIChzdGF0dXMpIHtcclxuICAgIG5vZGVzLmRhdGEoJ2Nsb25lbWFya2VyJywgdHJ1ZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbm9kZXMucmVtb3ZlRGF0YSgnY2xvbmVtYXJrZXInKTtcclxuICB9XHJcbn07XHJcblxyXG4vL2VsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbigpXHJcblxyXG4vLyBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBlbGVtZW50cyB3aXRoIGdpdmVuIGZvbnQgZGF0YVxyXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKGVsZXMsIGRhdGEpIHtcclxuICBmb3IgKHZhciBwcm9wIGluIGRhdGEpIHtcclxuICAgIGVsZXMuZGF0YShwcm9wLCBkYXRhW3Byb3BdKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIGdldHMgYW4gZWRnZSwgYW5kIGVuZHMgb2YgdGhhdCBlZGdlIChPcHRpb25hbGx5IGl0IG1heSB0YWtlIGp1c3QgdGhlIGNsYXNzZXMgb2YgdGhlc2UgZWxlbWVudHMgYXMgd2VsbCkgYXMgcGFyYW1ldGVycy5cclxuLy8gSXQgbWF5IHJldHVybiAndmFsaWQnICh0aGF0IGVuZHMgaXMgdmFsaWQgZm9yIHRoYXQgZWRnZSksICdyZXZlcnNlJyAodGhhdCBlbmRzIGlzIG5vdCB2YWxpZCBmb3IgdGhhdCBlZGdlIGJ1dCB0aGV5IHdvdWxkIGJlIHZhbGlkIFxyXG4vLyBpZiB5b3UgcmV2ZXJzZSB0aGUgc291cmNlIGFuZCB0YXJnZXQpLCAnaW52YWxpZCcgKHRoYXQgZW5kcyBhcmUgdG90YWxseSBpbnZhbGlkIGZvciB0aGF0IGVkZ2UpLlxyXG5lbGVtZW50VXRpbGl0aWVzLnZhbGlkYXRlQXJyb3dFbmRzID0gZnVuY3Rpb24gKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0KSB7XHJcbiAgdmFyIGVkZ2VjbGFzcyA9IHR5cGVvZiBlZGdlID09PSAnc3RyaW5nJyA/IGVkZ2UgOiBlZGdlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgdmFyIHNvdXJjZWNsYXNzID0gdHlwZW9mIHNvdXJjZSA9PT0gJ3N0cmluZycgPyBzb3VyY2UgOiBzb3VyY2UuZGF0YSgnY2xhc3MnKTtcclxuICB2YXIgdGFyZ2V0Y2xhc3MgPSB0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJyA/IHRhcmdldCA6IHRhcmdldC5kYXRhKCdjbGFzcycpO1xyXG5cclxuICBpZiAoZWRnZWNsYXNzID09ICdjb25zdW1wdGlvbicgfHwgZWRnZWNsYXNzID09ICdtb2R1bGF0aW9uJ1xyXG4gICAgICAgICAgfHwgZWRnZWNsYXNzID09ICdzdGltdWxhdGlvbicgfHwgZWRnZWNsYXNzID09ICdjYXRhbHlzaXMnXHJcbiAgICAgICAgICB8fCBlZGdlY2xhc3MgPT0gJ2luaGliaXRpb24nIHx8IGVkZ2VjbGFzcyA9PSAnbmVjZXNzYXJ5IHN0aW11bGF0aW9uJykge1xyXG4gICAgaWYgKCF0aGlzLmlzRVBOQ2xhc3Moc291cmNlY2xhc3MpIHx8ICF0aGlzLmlzUE5DbGFzcyh0YXJnZXRjbGFzcykpIHtcclxuICAgICAgaWYgKHRoaXMuaXNQTkNsYXNzKHNvdXJjZWNsYXNzKSAmJiB0aGlzLmlzRVBOQ2xhc3ModGFyZ2V0Y2xhc3MpKSB7XHJcbiAgICAgICAgLy9JZiBqdXN0IHRoZSBkaXJlY3Rpb24gaXMgbm90IHZhbGlkIHJldmVyc2UgdGhlIGRpcmVjdGlvblxyXG4gICAgICAgIHJldHVybiAncmV2ZXJzZSc7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICdpbnZhbGlkJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIGlmIChlZGdlY2xhc3MgPT0gJ3Byb2R1Y3Rpb24nKSB7XHJcbiAgICBpZiAoIXRoaXMuaXNQTkNsYXNzKHNvdXJjZWNsYXNzKSB8fCAhdGhpcy5pc0VQTkNsYXNzKHRhcmdldGNsYXNzKSkge1xyXG4gICAgICBpZiAodGhpcy5pc0VQTkNsYXNzKHNvdXJjZWNsYXNzKSAmJiB0aGlzLmlzUE5DbGFzcyh0YXJnZXRjbGFzcykpIHtcclxuICAgICAgICAvL0lmIGp1c3QgdGhlIGRpcmVjdGlvbiBpcyBub3QgdmFsaWQgcmV2ZXJzZSB0aGUgZGlyZWN0aW9uXHJcbiAgICAgICAgcmV0dXJuICdyZXZlcnNlJztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gJ2ludmFsaWQnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGVkZ2VjbGFzcyA9PSAnbG9naWMgYXJjJykge1xyXG4gICAgdmFyIGludmFsaWQgPSBmYWxzZTtcclxuICAgIGlmICghdGhpcy5pc0VQTkNsYXNzKHNvdXJjZWNsYXNzKSB8fCAhdGhpcy5pc0xvZ2ljYWxPcGVyYXRvcih0YXJnZXRjbGFzcykpIHtcclxuICAgICAgaWYgKHRoaXMuaXNMb2dpY2FsT3BlcmF0b3Ioc291cmNlY2xhc3MpICYmIHRoaXMuaXNFUE5DbGFzcyh0YXJnZXRjbGFzcykpIHtcclxuICAgICAgICAvL0lmIGp1c3QgdGhlIGRpcmVjdGlvbiBpcyBub3QgdmFsaWQgcmV2ZXJzZSB0aGUgZGlyZWN0aW9uXHJcbiAgICAgICAgcmV0dXJuICdyZXZlcnNlJztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBpbnZhbGlkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoZSBjYXNlIHRoYXQgYm90aCBzaWRlcyBhcmUgbG9naWNhbCBvcGVyYXRvcnMgYXJlIHZhbGlkIHRvb1xyXG4gICAgaWYgKHRoaXMuaXNMb2dpY2FsT3BlcmF0b3Ioc291cmNlY2xhc3MpICYmIHRoaXMuaXNMb2dpY2FsT3BlcmF0b3IodGFyZ2V0Y2xhc3MpKSB7XHJcbiAgICAgIGludmFsaWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaW52YWxpZCkge1xyXG4gICAgICByZXR1cm4gJ2ludmFsaWQnO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIGlmIChlZGdlY2xhc3MgPT0gJ2VxdWl2YWxlbmNlIGFyYycpIHtcclxuICAgIGlmICghKHRoaXMuaXNFUE5DbGFzcyhzb3VyY2VjbGFzcykgJiYgdGhpcy5jb252ZW5pZW50VG9FcXVpdmFsZW5jZSh0YXJnZXRjbGFzcykpXHJcbiAgICAgICAgICAgICYmICEodGhpcy5pc0VQTkNsYXNzKHRhcmdldGNsYXNzKSAmJiB0aGlzLmNvbnZlbmllbnRUb0VxdWl2YWxlbmNlKHNvdXJjZWNsYXNzKSkpIHtcclxuICAgICAgcmV0dXJuICdpbnZhbGlkJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiAndmFsaWQnO1xyXG59O1xyXG5cclxuLypcclxuICogVW5oaWRlIGdpdmVuIGVsZXMgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcclxuICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLlxyXG4gKi9cclxuZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGVsZXMsIGxheW91dHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdCA9IGVsZXMuc2hvd0VsZXMoKTsgLy8gU2hvdyBnaXZlbiBlbGVzXHJcbiAgaWYgKHR5cGVvZiBsYXlvdXRwYXJhbSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgbGF5b3V0cGFyYW0oKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgYSBmdW5jdGlvbiBleGVjdXRlIGl0XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgY3kubGF5b3V0KGxheW91dHBhcmFtKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgbGF5b3V0IG9wdGlvbnMgY2FsbCBsYXlvdXQgd2l0aCB0aGF0IG9wdGlvbnMuXHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVsZW1lbnRVdGlsaXRpZXM7IiwiLyogXHJcbiAqIFV0aWxpdHkgZmlsZSB0byBnZXQgYW5kIHNldCB0aGUgbGlicmFyaWVzIHRvIHdoaWNoIHNiZ252aXogaXMgZGVwZW5kZW50IGZyb20gYW55IGZpbGUuXHJcbiAqL1xyXG5cclxudmFyIGxpYlV0aWxpdGllcyA9IGZ1bmN0aW9uKCl7XHJcbn07XHJcblxyXG5saWJVdGlsaXRpZXMuc2V0TGlicyA9IGZ1bmN0aW9uKGxpYnMpIHtcclxuICB0aGlzLmxpYnMgPSBsaWJzO1xyXG59O1xyXG5cclxubGliVXRpbGl0aWVzLmdldExpYnMgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5saWJzO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsaWJVdGlsaXRpZXM7IiwidmFyIG9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKS5nZXRPcHRpb25zKCk7XHJcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xyXG5cclxuLypcclxuICogVGhlIG1haW4gdXRpbGl0aWVzIHRvIGJlIGV4cG9zZWQgZGlyZWN0bHkuXHJcbiAqL1xyXG5mdW5jdGlvbiBtYWluVXRpbGl0aWVzKCkge1xyXG59O1xyXG5cclxuLypcclxuICogQWRkcyBhIG5ldyBub2RlIHdpdGggdGhlIGdpdmVuIGNsYXNzIGFuZCBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXMuXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmFkZE5vZGUgPSBmdW5jdGlvbih4LCB5ICwgbm9kZWNsYXNzKSB7XHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHgsIHksIG5vZGVjbGFzcyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBuZXdOb2RlIDoge1xyXG4gICAgICAgIHg6IHgsXHJcbiAgICAgICAgeTogeSxcclxuICAgICAgICBjbGFzczogbm9kZWNsYXNzXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGROb2RlXCIsIHBhcmFtKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBBZGRzIGEgbmV3IGVkZ2Ugd2l0aCB0aGUgZ2l2ZW4gY2xhc3MgYW5kIGhhdmluZyB0aGUgZ2l2ZW4gc291cmNlIGFuZCB0YXJnZXQgaWRzXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmFkZEVkZ2UgPSBmdW5jdGlvbihzb3VyY2UsIHRhcmdldCAsIGVkZ2VjbGFzcykge1xyXG4gIC8vIEdldCB0aGUgdmFsaWRhdGlvbiByZXN1bHRcclxuICB2YXIgdmFsaWRhdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMoZWRnZWNsYXNzLCBjeS5nZXRFbGVtZW50QnlJZChzb3VyY2UpLCBjeS5nZXRFbGVtZW50QnlJZCh0YXJnZXQpKTtcclxuXHJcbiAgLy8gSWYgdmFsaWRhdGlvbiByZXN1bHQgaXMgJ2ludmFsaWQnIGNhbmNlbCB0aGUgb3BlcmF0aW9uXHJcbiAgaWYgKHZhbGlkYXRpb24gPT09ICdpbnZhbGlkJykge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICAvLyBJZiB2YWxpZGF0aW9uIHJlc3VsdCBpcyAncmV2ZXJzZScgcmV2ZXJzZSB0aGUgc291cmNlLXRhcmdldCBwYWlyIGJlZm9yZSBjcmVhdGluZyB0aGUgZWRnZVxyXG4gIGlmICh2YWxpZGF0aW9uID09PSAncmV2ZXJzZScpIHtcclxuICAgIHZhciB0ZW1wID0gc291cmNlO1xyXG4gICAgc291cmNlID0gdGFyZ2V0O1xyXG4gICAgdGFyZ2V0ID0gdGVtcDtcclxuICB9XHJcbiAgICAgIFxyXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShzb3VyY2UsIHRhcmdldCwgZWRnZWNsYXNzKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIG5ld0VkZ2UgOiB7XHJcbiAgICAgICAgc291cmNlOiBzb3VyY2UsXHJcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXHJcbiAgICAgICAgY2xhc3M6IGVkZ2VjbGFzc1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkRWRnZVwiLCBwYXJhbSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogQ2xvbmUgZ2l2ZW4gZWxlbWVudHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jbG9uZUVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZXMpIHtcclxuICB2YXIgY2IgPSBjeS5jbGlwYm9hcmQoKTtcclxuICB2YXIgX2lkID0gY2IuY29weShlbGVzLCBcImNsb25lT3BlcmF0aW9uXCIpO1xyXG5cclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInBhc3RlXCIsIHtpZDogX2lkfSk7XHJcbiAgfSBcclxuICBlbHNlIHtcclxuICAgIGNiLnBhc3RlKF9pZCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogQ29weSBnaXZlbiBlbGVtZW50cyB0byBjbGlwYm9hcmQuIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jb3B5RWxlbWVudHMgPSBmdW5jdGlvbiAoZWxlcykge1xyXG4gIGN5LmNsaXBib2FyZCgpLmNvcHkoZWxlcyk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBQYXN0IHRoZSBlbGVtZW50cyBjb3BpZWQgdG8gY2xpcGJvYXJkLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMucGFzdGVFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwicGFzdGVcIik7XHJcbiAgfSBcclxuICBlbHNlIHtcclxuICAgIGN5LmNsaXBib2FyZCgpLnBhc3RlKCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogQWxpZ25zIGdpdmVuIG5vZGVzIGluIGdpdmVuIGhvcml6b250YWwgYW5kIHZlcnRpY2FsIG9yZGVyLiBcclxuICogSG9yaXpvbnRhbCBhbmQgdmVydGljYWwgcGFyYW1ldGVycyBtYXkgYmUgJ25vbmUnIG9yIHVuZGVmaW5lZC5cclxuICogYWxpZ25UbyBwYXJhbWV0ZXIgaW5kaWNhdGVzIHRoZSBsZWFkaW5nIG5vZGUuXHJcbiAqIFJlcXVyaXJlcyBjeXRvc2NhcGUtZ3JpZC1ndWlkZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmFsaWduID0gZnVuY3Rpb24gKG5vZGVzLCBob3Jpem9udGFsLCB2ZXJ0aWNhbCwgYWxpZ25Ubykge1xyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWxpZ25cIiwge1xyXG4gICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgIGhvcml6b250YWw6IGhvcml6b250YWwsXHJcbiAgICAgIHZlcnRpY2FsOiB2ZXJ0aWNhbCxcclxuICAgICAgYWxpZ25UbzogYWxpZ25Ub1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIG5vZGVzLmFsaWduKGhvcml6b250YWwsIHZlcnRpY2FsLCBhbGlnblRvKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDcmVhdGUgY29tcG91bmQgZm9yIGdpdmVuIG5vZGVzLiBjb21wb3VuZFR5cGUgbWF5IGJlICdjb21wbGV4JyBvciAnY29tcGFydG1lbnQnLlxyXG4gKiBUaGlzIG1ldGhvZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgPSBmdW5jdGlvbiAoX25vZGVzLCBjb21wb3VuZFR5cGUpIHtcclxuICB2YXIgbm9kZXMgPSBfbm9kZXM7XHJcbiAgLy8gSnVzdCBFUE4ncyBjYW4gYmUgaW5jbHVkZWQgaW4gY29tcGxleGVzIHNvIHdlIG5lZWQgdG8gZmlsdGVyIEVQTidzIGlmIGNvbXBvdW5kIHR5cGUgaXMgY29tcGxleFxyXG4gIGlmIChjb21wb3VuZFR5cGUgPT09ICdjb21wbGV4Jykge1xyXG4gICAgbm9kZXMgPSBfbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChpLCBlbGVtZW50KSB7XHJcbiAgICAgIHZhciBzYmduY2xhc3MgPSBlbGVtZW50LmRhdGEoXCJjbGFzc1wiKTtcclxuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyhzYmduY2xhc3MpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIFxyXG4gIG5vZGVzID0gZWxlbWVudFV0aWxpdGllcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xyXG5cclxuICAvLyBBbGwgZWxlbWVudHMgc2hvdWxkIGhhdmUgdGhlIHNhbWUgcGFyZW50IGFuZCB0aGUgY29tbW9uIHBhcmVudCBzaG91bGQgbm90IGJlIGEgJ2NvbXBsZXgnIFxyXG4gIC8vIGlmIGNvbXBvdW5kVHlwZSBpcyAnY29tcGFydGVudCdcclxuICAvLyBiZWNhdXNlIHRoZSBvbGQgY29tbW9uIHBhcmVudCB3aWxsIGJlIHRoZSBwYXJlbnQgb2YgdGhlIG5ldyBjb21wYXJ0bWVudCBhZnRlciB0aGlzIG9wZXJhdGlvbiBhbmRcclxuICAvLyAnY29tcGxleGVzJyBjYW5ub3QgaW5jbHVkZSAnY29tcGFydG1lbnRzJ1xyXG4gIGlmIChub2Rlcy5sZW5ndGggPT0gMCB8fCAhZWxlbWVudFV0aWxpdGllcy5hbGxIYXZlVGhlU2FtZVBhcmVudChub2RlcylcclxuICAgICAgICAgIHx8ICggY29tcG91bmRUeXBlID09PSAnY29tcGFydG1lbnQnICYmIG5vZGVzLnBhcmVudCgpLmRhdGEoJ2NsYXNzJykgPT09ICdjb21wbGV4JyApICkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAoY3kudW5kb1JlZG8oKSkge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBjb21wb3VuZFR5cGU6IGNvbXBvdW5kVHlwZSxcclxuICAgICAgbm9kZXNUb01ha2VDb21wb3VuZDogbm9kZXNcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlc1wiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMobm9kZXMsIGNvbXBvdW5kVHlwZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24gYW5kIGNoZWNrcyBpZiB0aGUgb3BlcmF0aW9uIGlzIHZhbGlkLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jaGFuZ2VQYXJlbnQgPSBmdW5jdGlvbihub2RlcywgX25ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XHJcbiAgdmFyIG5ld1BhcmVudCA9IHR5cGVvZiBfbmV3UGFyZW50ID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9uZXdQYXJlbnQpIDogX25ld1BhcmVudDtcclxuICBpZiAobmV3UGFyZW50ICYmIG5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikgIT0gXCJjb21wbGV4XCIgJiYgbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKSAhPSBcImNvbXBhcnRtZW50XCIpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGlmIChuZXdQYXJlbnQgJiYgbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKSA9PSBcImNvbXBsZXhcIikge1xyXG4gICAgbm9kZXMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGksIGVsZSkge1xyXG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKGVsZS5kYXRhKFwiY2xhc3NcIikpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBub2RlcyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoaSwgZWxlKSB7XHJcbiAgICBpZiAoIW5ld1BhcmVudCkge1xyXG4gICAgICByZXR1cm4gZWxlLmRhdGEoJ3BhcmVudCcpICE9IG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZWxlLmRhdGEoJ3BhcmVudCcpICE9PSBuZXdQYXJlbnQuaWQoKTtcclxuICB9KTtcclxuXHJcbiAgaWYgKG5ld1BhcmVudCkge1xyXG4gICAgbm9kZXMgPSBub2Rlcy5kaWZmZXJlbmNlKG5ld1BhcmVudC5hbmNlc3RvcnMoKSk7XHJcbiAgfVxyXG5cclxuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBub2RlcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcclxuICBcclxuICB2YXIgcGFyZW50SWQgPSBuZXdQYXJlbnQgPyBuZXdQYXJlbnQuaWQoKSA6IG51bGw7XHJcbiAgXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgZmlyc3RUaW1lOiB0cnVlLFxyXG4gICAgICBwYXJlbnREYXRhOiBwYXJlbnRJZCwgLy8gSXQga2VlcHMgdGhlIG5ld1BhcmVudElkIChKdXN0IGFuIGlkIGZvciBlYWNoIG5vZGVzIGZvciB0aGUgZmlyc3QgdGltZSlcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICBwb3NEaWZmWDogcG9zRGlmZlgsXHJcbiAgICAgIHBvc0RpZmZZOiBwb3NEaWZmWVxyXG4gICAgfTtcclxuXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlUGFyZW50XCIsIHBhcmFtKTsgLy8gVGhpcyBhY3Rpb24gaXMgcmVnaXN0ZXJlZCBieSB1bmRvUmVkbyBleHRlbnNpb25cclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVBhcmVudChub2RlcywgcGFyZW50SWQsIHBvc0RpZmZYLCBwb3NEaWZmWSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogQ3JlYXRlcyBhIHRlbXBsYXRlIHJlYWN0aW9uIHdpdGggZ2l2ZW4gcGFyYW1ldGVycy4gUmVxdWlyZXMgY29zZS1iaWxrZW50IGxheW91dCB0byB0aWxlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzIGluY2x1ZGVkXHJcbiAqIGluIHRoZSBjb21wbGV4LiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgdGhlIHNhbWUgZnVuY3Rpb24gaW4gZWxlbWVudFV0aWxpdGllc1xyXG4gKi9cclxubWFpblV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHRlbXBsYXRlVHlwZSwgbWFjcm9tb2xlY3VsZUxpc3QsIGNvbXBsZXhOYW1lLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgpIHtcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbih0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIHRlbXBsYXRlVHlwZTogdGVtcGxhdGVUeXBlLFxyXG4gICAgICBtYWNyb21vbGVjdWxlTGlzdDogbWFjcm9tb2xlY3VsZUxpc3QsXHJcbiAgICAgIGNvbXBsZXhOYW1lOiBjb21wbGV4TmFtZSxcclxuICAgICAgcHJvY2Vzc1Bvc2l0aW9uOiBwcm9jZXNzUG9zaXRpb24sXHJcbiAgICAgIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLFxyXG4gICAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXHJcbiAgICAgIGVkZ2VMZW5ndGg6IGVkZ2VMZW5ndGhcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjcmVhdGVUZW1wbGF0ZVJlYWN0aW9uXCIsIHBhcmFtKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuIFxyXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbykge1xyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgd2lkdGg6IHdpZHRoLFxyXG4gICAgICBoZWlnaHQ6IGhlaWdodCxcclxuICAgICAgdXNlQXNwZWN0UmF0aW86IHVzZUFzcGVjdFJhdGlvLFxyXG4gICAgICBwZXJmb3JtT3BlcmF0aW9uOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwicmVzaXplTm9kZXNcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMobm9kZXMsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIENoYW5nZXMgdGhlIGxhYmVsIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gbGFiZWwuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uKG5vZGVzLCBsYWJlbCkge1xyXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBsYWJlbCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgIGxhYmVsOiBsYWJlbCxcclxuICAgICAgZmlyc3RUaW1lOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlTm9kZUxhYmVsXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIENoYW5nZSBmb250IHByb3BlcnRpZXMgZm9yIGdpdmVuIGVsZXMgdXNlIHRoZSBnaXZlbiBmb250IGRhdGEuXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24oZWxlcywgZGF0YSkge1xyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIGVsZXM6IGVsZXMsXHJcbiAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgZGF0YSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDaGFuZ2Ugc3RhdGUgdmFsdWUgb3IgdW5pdCBvZiBpbmZvcm1hdGlvbiBib3ggb2YgZ2l2ZW4gbm9kZXMgd2l0aCBnaXZlbiBpbmRleC5cclxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHBhcmFtZXRlcnMgc2VlIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3hcclxuICovXHJcbm1haW5VdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgaW5kZXg6IGluZGV4LFxyXG4gICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZVN0YXRlT3JJbmZvQm94XCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbi8vIEFkZCBhIG5ldyBzdGF0ZSBvciBpbmZvIGJveCB0byBnaXZlbiBub2Rlcy5cclxuLy8gVGhlIGJveCBpcyByZXByZXNlbnRlZCBieSB0aGUgcGFyYW1ldGVyIG9iai5cclxuLy8gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uKG5vZGVzLCBvYmopIHtcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBvYmo6IG9iaixcclxuICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuLy8gUmVtb3ZlIHRoZSBzdGF0ZSBvciBpbmZvIGJveGVzIG9mIHRoZSBnaXZlbiBub2RlcyBhdCBnaXZlbiBpbmRleC5cclxuLy8gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uKG5vZGVzLCBpbmRleCkge1xyXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgaW5kZXg6IGluZGV4LFxyXG4gICAgICBub2Rlczogbm9kZXNcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInJlbW92ZVN0YXRlT3JJbmZvQm94XCIsIHBhcmFtKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFNldCBtdWx0aW1lciBzdGF0dXMgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24obm9kZXMsIHN0YXR1cykge1xyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIHN0YXR1czogc3RhdHVzLFxyXG4gICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwic2V0TXVsdGltZXJTdGF0dXNcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMobm9kZXMsIHN0YXR1cyk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBTZXQgY2xvbmUgbWFya2VyIHN0YXR1cyBvZiBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxyXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi8gXHJcbm1haW5VdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbihub2Rlcywgc3RhdHVzKSB7XHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgc3RhdHVzOiBzdGF0dXMsXHJcbiAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgZmlyc3RUaW1lOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXRDbG9uZU1hcmtlclN0YXR1c1wiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIENoYW5nZSBzdHlsZS9jc3Mgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gdmFsdWUuXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNoYW5nZUNzcyA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlKSB7XHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBlbGVzLmNzcyhuYW1lLCB2YWx1ZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBlbGVzOiBlbGVzLFxyXG4gICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUNzc1wiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDaGFuZ2UgZGF0YSBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiB2YWx1ZS5cclxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuY2hhbmdlRGF0YSA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlKSB7XHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBlbGVzLmRhdGEobmFtZSwgdmFsdWUpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgZWxlczogZWxlcyxcclxuICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VEYXRhXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFVuaGlkZSBnaXZlbiBlbGVzIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXHJcbiAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQoZWxlcywgbGF5b3V0cGFyYW0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgZWxlczogZWxlcyxcclxuICAgICAgbGF5b3V0cGFyYW06IGxheW91dHBhcmFtLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCBwYXJhbSk7XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWluVXRpbGl0aWVzOyIsIi8qXHJcbiAqICBFeHRlbmQgZGVmYXVsdCBvcHRpb25zIGFuZCBnZXQgY3VycmVudCBvcHRpb25zIGJ5IHVzaW5nIHRoaXMgZmlsZSBcclxuICovXHJcblxyXG4vLyBkZWZhdWx0IG9wdGlvbnNcclxudmFyIGRlZmF1bHRzID0ge1xyXG4gIC8vIFRoZSBwYXRoIG9mIGNvcmUgbGlicmFyeSBpbWFnZXMgd2hlbiBzYmdudml6IGlzIHJlcXVpcmVkIGZyb20gbnBtIGFuZCB0aGUgaW5kZXggaHRtbCBcclxuICAvLyBmaWxlIGFuZCBub2RlX21vZHVsZXMgYXJlIHVuZGVyIHRoZSBzYW1lIGZvbGRlciB0aGVuIHVzaW5nIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGZpbmVcclxuICBpbWdQYXRoOiAnbm9kZV9tb2R1bGVzL3NiZ252aXovc3JjL2ltZycsXHJcbiAgLy8gV2hldGhlciB0byBmaXQgbGFiZWxzIHRvIG5vZGVzXHJcbiAgZml0TGFiZWxzVG9Ob2RlczogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0sXHJcbiAgLy8gZHluYW1pYyBsYWJlbCBzaXplIGl0IG1heSBiZSAnc21hbGwnLCAncmVndWxhcicsICdsYXJnZSdcclxuICBkeW5hbWljTGFiZWxTaXplOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gJ3JlZ3VsYXInO1xyXG4gIH0sXHJcbiAgLy8gcGVyY2VudGFnZSB1c2VkIHRvIGNhbGN1bGF0ZSBjb21wb3VuZCBwYWRkaW5nc1xyXG4gIGNvbXBvdW5kUGFkZGluZzogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIDEwO1xyXG4gIH0sXHJcbiAgLy8gV2hldGhlciB0byBhZGp1c3Qgbm9kZSBsYWJlbCBmb250IHNpemUgYXV0b21hdGljYWxseS5cclxuICAvLyBJZiB0aGlzIG9wdGlvbiByZXR1cm4gZmFsc2UgZG8gbm90IGFkanVzdCBsYWJlbCBzaXplcyBhY2NvcmRpbmcgdG8gbm9kZSBoZWlnaHQgdXNlcyBub2RlLmRhdGEoJ2xhYmVsc2l6ZScpXHJcbiAgLy8gaW5zdGVhZCBvZiBkb2luZyBpdC5cclxuICBhZGp1c3ROb2RlTGFiZWxGb250U2l6ZUF1dG9tYXRpY2FsbHk6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSxcclxuICAvLyBUaGUgc2VsZWN0b3Igb2YgdGhlIGNvbXBvbmVudCBjb250YWluaW5nIHRoZSBzYmduIG5ldHdvcmtcclxuICBuZXR3b3JrQ29udGFpbmVyU2VsZWN0b3I6ICcjc2Jnbi1uZXR3b3JrLWNvbnRhaW5lcicsXHJcbiAgLy8gV2hldGhlciB0aGUgYWN0aW9ucyBhcmUgdW5kb2FibGUsIHJlcXVpcmVzIGN5dG9zY2FwZS11bmRvLXJlZG8gZXh0ZW5zaW9uXHJcbiAgdW5kb2FibGU6IHRydWUsXHJcbiAgLy8gV2hldGhlciB0byBoYXZlIHVuZG9hYmxlIGRyYWcgZmVhdHVyZSBpbiB1bmRvL3JlZG8gZXh0ZW5zaW9uLiBUaGlzIG9wdGlvbnMgd2lsbCBiZSBwYXNzZWQgdG8gdW5kby9yZWRvIGV4dGVuc2lvblxyXG4gIHVuZG9hYmxlRHJhZzogdHJ1ZVxyXG59O1xyXG5cclxudmFyIG9wdGlvblV0aWxpdGllcyA9IGZ1bmN0aW9uICgpIHtcclxufTtcclxuXHJcbi8vIEV4dGVuZCB0aGUgZGVmYXVsdHMgb3B0aW9ucyB3aXRoIHRoZSB1c2VyIG9wdGlvbnNcclxub3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gIHZhciByZXN1bHQgPSB7fTtcclxuXHJcbiAgZm9yICh2YXIgcHJvcCBpbiBkZWZhdWx0cykge1xyXG4gICAgcmVzdWx0W3Byb3BdID0gZGVmYXVsdHNbcHJvcF07XHJcbiAgfVxyXG4gIFxyXG4gIGZvciAodmFyIHByb3AgaW4gb3B0aW9ucykge1xyXG4gICAgcmVzdWx0W3Byb3BdID0gb3B0aW9uc1twcm9wXTtcclxuICB9XHJcblxyXG4gIG9wdGlvblV0aWxpdGllcy5vcHRpb25zID0gcmVzdWx0O1xyXG5cclxuICByZXR1cm4gb3B0aW9ucztcclxufTtcclxuXHJcbm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBvcHRpb25VdGlsaXRpZXMub3B0aW9ucztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gb3B0aW9uVXRpbGl0aWVzOyIsInZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMnKTtcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciAkID0gbGlicy5qUXVlcnk7XHJcblxyXG52YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSBmdW5jdGlvbiAodW5kb2FibGVEcmFnKSB7XHJcbiAgLy8gY3JlYXRlIHVuZG8tcmVkbyBpbnN0YW5jZVxyXG4gIHZhciB1ciA9IGN5LnVuZG9SZWRvKHtcclxuICAgIHVuZG9hYmxlRHJhZzogdW5kb2FibGVEcmFnXHJcbiAgfSk7XHJcblxyXG4gIC8vIHJlZ2lzdGVyIGFkZCByZW1vdmUgYWN0aW9uc1xyXG4gIHVyLmFjdGlvbihcImFkZE5vZGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkTm9kZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XHJcbiAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XHJcbiAgdXIuYWN0aW9uKFwiYWRkRWRnZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRFZGdlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcclxuICB1ci5hY3Rpb24oXCJkZWxldGVFbGVzU21hcnRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NtYXJ0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XHJcbiAgdXIuYWN0aW9uKFwiY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlQ29tcG91bmQpO1xyXG5cclxuICAvLyByZWdpc3RlciBnZW5lcmFsIGFjdGlvbnNcclxuICB1ci5hY3Rpb24oXCJyZXNpemVOb2Rlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMpO1xyXG4gIHVyLmFjdGlvbihcImNoYW5nZU5vZGVMYWJlbFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCk7XHJcbiAgdXIuYWN0aW9uKFwiY2hhbmdlRGF0YVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhKTtcclxuICB1ci5hY3Rpb24oXCJjaGFuZ2VDc3NcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MpO1xyXG4gIHVyLmFjdGlvbihcImNoYW5nZUJlbmRQb2ludHNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmVuZFBvaW50cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmVuZFBvaW50cyk7XHJcbiAgdXIuYWN0aW9uKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKTtcclxuICB1ci5hY3Rpb24oXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUxheW91dCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtTGF5b3V0KTtcclxuXHJcbiAgLy8gcmVnaXN0ZXIgU0JHTiBhY3Rpb25zXHJcbiAgdXIuYWN0aW9uKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94KTtcclxuICB1ci5hY3Rpb24oXCJjaGFuZ2VTdGF0ZU9ySW5mb0JveFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3gpO1xyXG4gIHVyLmFjdGlvbihcInNldE11bHRpbWVyU3RhdHVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cyk7XHJcbiAgdXIuYWN0aW9uKFwic2V0Q2xvbmVNYXJrZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzKTtcclxuICB1ci5hY3Rpb24oXCJyZW1vdmVTdGF0ZU9ySW5mb0JveFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3gpO1xyXG4gIFxyXG4gIC8vIHJlZ2lzdGVyIGVhc3kgY3JlYXRpb24gYWN0aW9uc1xyXG4gIHVyLmFjdGlvbihcImNyZWF0ZVRlbXBsYXRlUmVhY3Rpb25cIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVuZG9hYmxlRHJhZykge1xyXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnModW5kb2FibGVEcmFnKTtcclxuICB9KTtcclxufTsiLCIvLyBFeHRlbmRzIHNiZ252aXoudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnNcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBzYmdudml6ID0gbGlicy5zYmdudml6O1xyXG52YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSBzYmdudml6LnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xyXG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcclxuXHJcbi8vIFNlY3Rpb24gU3RhcnRcclxuLy8gYWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGROb2RlID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdDtcclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICB2YXIgbmV3Tm9kZSA9IHBhcmFtLm5ld05vZGU7XHJcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUobmV3Tm9kZS54LCBuZXdOb2RlLnksIG5ld05vZGUuY2xhc3MpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGVsZXM6IHJlc3VsdFxyXG4gIH07XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRFZGdlID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdDtcclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICB2YXIgbmV3RWRnZSA9IHBhcmFtLm5ld0VkZ2U7XHJcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3RWRnZS5zb3VyY2UsIG5ld0VkZ2UudGFyZ2V0LCBuZXdFZGdlLmNsYXNzKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKHBhcmFtKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBlbGVzOiByZXN1bHRcclxuICB9O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIG5vZGVzVG9NYWtlQ29tcG91bmQgPSBwYXJhbS5ub2Rlc1RvTWFrZUNvbXBvdW5kO1xyXG4gIHZhciBuZXdDb21wb3VuZDtcclxuXHJcbiAgLy8gSWYgdGhpcyBpcyBhIHJlZG8gYWN0aW9uIHJlZnJlc2ggdGhlIG5vZGVzIHRvIG1ha2UgY29tcG91bmQgKFdlIG5lZWQgdGhpcyBiZWNhdXNlIGFmdGVyIGVsZS5tb3ZlKCkgcmVmZXJlbmNlcyB0byBlbGVzIGNoYW5nZXMpXHJcbiAgaWYgKCFwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIHZhciBub2Rlc1RvTWFrZUNvbXBvdW5kSWRzID0ge307XHJcblxyXG4gICAgbm9kZXNUb01ha2VDb21wb3VuZC5lYWNoKGZ1bmN0aW9uIChpLCBlbGUpIHtcclxuICAgICAgbm9kZXNUb01ha2VDb21wb3VuZElkc1tlbGUuaWQoKV0gPSB0cnVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIGFsbE5vZGVzID0gY3kubm9kZXMoKTtcclxuXHJcbiAgICBub2Rlc1RvTWFrZUNvbXBvdW5kID0gYWxsTm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChpLCBlbGUpIHtcclxuICAgICAgcmV0dXJuIG5vZGVzVG9NYWtlQ29tcG91bmRJZHNbZWxlLmlkKCldO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICB2YXIgb2xkUGFyZW50SWQgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJwYXJlbnRcIik7XHJcbiAgICAvLyBUaGUgcGFyZW50IG9mIG5ldyBjb21wb3VuZCB3aWxsIGJlIHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kXHJcbiAgICBuZXdDb21wb3VuZCA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKG5vZGVzVG9NYWtlQ29tcG91bmQsIHBhcmFtLmNvbXBvdW5kVHlwZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbmV3Q29tcG91bmQgPSBwYXJhbS5yZW1vdmVkQ29tcG91bmQucmVzdG9yZSgpO1xyXG4gICAgdmFyIG5ld0NvbXBvdW5kSWQgPSBuZXdDb21wb3VuZC5pZCgpO1xyXG5cclxuICAgIG5vZGVzVG9NYWtlQ29tcG91bmQubW92ZSh7cGFyZW50OiBuZXdDb21wb3VuZElkfSk7XHJcblxyXG4gICAgc2JnbnZpei5yZWZyZXNoUGFkZGluZ3MoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXdDb21wb3VuZDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZUNvbXBvdW5kID0gZnVuY3Rpb24gKGNvbXBvdW5kVG9SZW1vdmUpIHtcclxuICB2YXIgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZW1vdmVDb21wb3VuZChjb21wb3VuZFRvUmVtb3ZlKTtcclxuXHJcbiAgdmFyIHBhcmFtID0ge1xyXG4gICAgbm9kZXNUb01ha2VDb21wb3VuZDogcmVzdWx0LmNoaWxkcmVuT2ZDb21wb3VuZCxcclxuICAgIHJlbW92ZWRDb21wb3VuZDogcmVzdWx0LnJlbW92ZWRDb21wb3VuZFxyXG4gIH07XHJcblxyXG4gIHJldHVybiBwYXJhbTtcclxufTtcclxuXHJcbi8vIFNlY3Rpb24gRW5kXHJcbi8vIGFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxuLy8gU2VjdGlvbiBTdGFydFxyXG4vLyBlYXN5IGNyZWF0aW9uIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xyXG4gIHZhciBlbGVzO1xyXG5cclxuICBpZiAoZmlyc3RUaW1lKSB7XHJcbiAgICBlbGVzID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uKHBhcmFtLnRlbXBsYXRlVHlwZSwgcGFyYW0ubWFjcm9tb2xlY3VsZUxpc3QsIHBhcmFtLmNvbXBsZXhOYW1lLCBwYXJhbS5wcm9jZXNzUG9zaXRpb24sIHBhcmFtLnRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgcGFyYW0udGlsaW5nUGFkZGluZ0hvcml6b250YWwsIHBhcmFtLmVkZ2VMZW5ndGgpXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlcyA9IHBhcmFtO1xyXG4gICAgY3kuYWRkKGVsZXMpO1xyXG4gICAgXHJcbiAgICBzYmdudml6LnJlZnJlc2hQYWRkaW5ncygpO1xyXG4gICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xyXG4gICAgZWxlcy5zZWxlY3QoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBlbGVzOiBlbGVzXHJcbiAgfTtcclxufTtcclxuXHJcbi8vIFNlY3Rpb24gRW5kXHJcbi8vIGVhc3kgY3JlYXRpb24gYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxuLy8gU2VjdGlvbiBTdGFydFxyXG4vLyBnZW5lcmFsIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnNBbmRTaXplcyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcG9zaXRpb25zQW5kU2l6ZXMgPSB7fTtcclxuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgZWxlID0gbm9kZXNbaV07XHJcbiAgICBwb3NpdGlvbnNBbmRTaXplc1tlbGUuaWQoKV0gPSB7XHJcbiAgICAgIHdpZHRoOiBlbGUud2lkdGgoKSxcclxuICAgICAgaGVpZ2h0OiBlbGUuaGVpZ2h0KCksXHJcbiAgICAgIHg6IGVsZS5wb3NpdGlvbihcInhcIiksXHJcbiAgICAgIHk6IGVsZS5wb3NpdGlvbihcInlcIilcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcG9zaXRpb25zQW5kU2l6ZXM7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9uc0FuZFNpemVzQ29uZGl0aW9uYWxseSA9IGZ1bmN0aW9uIChub2Rlc0RhdGEpIHtcclxuICBpZiAobm9kZXNEYXRhLmZpcnN0VGltZSkge1xyXG4gICAgZGVsZXRlIG5vZGVzRGF0YS5maXJzdFRpbWU7XHJcbiAgICByZXR1cm4gbm9kZXNEYXRhO1xyXG4gIH1cclxuICByZXR1cm4gdGhpcy5yZXR1cm5Ub1Bvc2l0aW9uc0FuZFNpemVzKG5vZGVzRGF0YSk7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9uc0FuZFNpemVzID0gZnVuY3Rpb24gKG5vZGVzRGF0YSkge1xyXG4gIHZhciBjdXJyZW50UG9zaXRpb25zQW5kU2l6ZXMgPSB7fTtcclxuICBjeS5ub2RlcygpLnBvc2l0aW9ucyhmdW5jdGlvbiAoaSwgZWxlKSB7XHJcbiAgICBjdXJyZW50UG9zaXRpb25zQW5kU2l6ZXNbZWxlLmlkKCldID0ge1xyXG4gICAgICB3aWR0aDogZWxlLndpZHRoKCksXHJcbiAgICAgIGhlaWdodDogZWxlLmhlaWdodCgpLFxyXG4gICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxyXG4gICAgICB5OiBlbGUucG9zaXRpb24oXCJ5XCIpXHJcbiAgICB9O1xyXG4gICAgdmFyIGRhdGEgPSBub2Rlc0RhdGFbZWxlLmlkKCldO1xyXG4gICAgZWxlLl9wcml2YXRlLmRhdGEud2lkdGggPSBkYXRhLndpZHRoO1xyXG4gICAgZWxlLl9wcml2YXRlLmRhdGEuaGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiBkYXRhLngsXHJcbiAgICAgIHk6IGRhdGEueVxyXG4gICAgfTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGN1cnJlbnRQb3NpdGlvbnNBbmRTaXplcztcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICAgIHBlcmZvcm1PcGVyYXRpb246IHRydWVcclxuICB9O1xyXG5cclxuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuXHJcbiAgcmVzdWx0LnNpemVNYXAgPSB7fTtcclxuICByZXN1bHQudXNlQXNwZWN0UmF0aW8gPSBmYWxzZTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHJlc3VsdC5zaXplTWFwW25vZGUuaWQoKV0gPSB7XHJcbiAgICAgIHc6IG5vZGUud2lkdGgoKSxcclxuICAgICAgaDogbm9kZS5oZWlnaHQoKVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHJlc3VsdC5ub2RlcyA9IG5vZGVzO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG5cclxuICAgIGlmIChwYXJhbS5wZXJmb3JtT3BlcmF0aW9uKSB7XHJcbiAgICAgIGlmIChwYXJhbS5zaXplTWFwKSB7XHJcbiAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLnc7XHJcbiAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmg7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2RlcyhwYXJhbS5ub2RlcywgcGFyYW0ud2lkdGgsIHBhcmFtLmhlaWdodCwgcGFyYW0udXNlQXNwZWN0UmF0aW8pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICB9O1xyXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG4gIHJlc3VsdC5ub2RlcyA9IG5vZGVzO1xyXG4gIHJlc3VsdC5sYWJlbCA9IHt9O1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgcmVzdWx0LmxhYmVsW25vZGUuaWQoKV0gPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XHJcbiAgfVxyXG5cclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICBub2Rlcy5kYXRhKCdsYWJlbCcsIHBhcmFtLmxhYmVsKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgIG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbCA9IHBhcmFtLmxhYmVsW25vZGUuaWQoKV07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRGF0YSA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgfTtcclxuICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XHJcblxyXG4gIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTtcclxuICByZXN1bHQudmFsdWVNYXAgPSB7fTtcclxuICByZXN1bHQuZWxlcyA9IGVsZXM7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICByZXN1bHQudmFsdWVNYXBbZWxlLmlkKCldID0gZWxlLmRhdGEocGFyYW0ubmFtZSk7XHJcbiAgfVxyXG5cclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICBlbGVzLmRhdGEocGFyYW0ubmFtZSwgcGFyYW0udmFsdWUpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZWxlID0gZWxlc1tpXTtcclxuICAgICAgZWxlLmRhdGEocGFyYW0ubmFtZSwgcGFyYW0udmFsdWVNYXBbZWxlLmlkKCldKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gIH07XHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG4gIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTtcclxuICByZXN1bHQudmFsdWVNYXAgPSB7fTtcclxuICByZXN1bHQuZWxlcyA9IGVsZXM7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICByZXN1bHQudmFsdWVNYXBbZWxlLmlkKCldID0gZWxlLmNzcyhwYXJhbS5uYW1lKTtcclxuICB9XHJcblxyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIGVsZXMuY3NzKHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICAgIGVsZS5jc3MocGFyYW0ubmFtZSwgcGFyYW0udmFsdWVNYXBbZWxlLmlkKCldKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgfTtcclxuXHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG4gIHJlc3VsdC5kYXRhID0ge307XHJcbiAgcmVzdWx0LmVsZXMgPSBlbGVzO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG5cclxuICAgIHJlc3VsdC5kYXRhW2VsZS5pZCgpXSA9IHt9O1xyXG5cclxuICAgIHZhciBkYXRhID0gcGFyYW0uZmlyc3RUaW1lID8gcGFyYW0uZGF0YSA6IHBhcmFtLmRhdGFbZWxlLmlkKCldO1xyXG5cclxuICAgIGZvciAodmFyIHByb3AgaW4gZGF0YSkge1xyXG4gICAgICByZXN1bHQuZGF0YVtlbGUuaWQoKV1bcHJvcF0gPSBlbGUuZGF0YShwcm9wKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgcGFyYW0uZGF0YSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG5cclxuICAgICAgZm9yICh2YXIgcHJvcCBpbiBwYXJhbS5kYXRhW2VsZS5pZCgpXSkge1xyXG4gICAgICAgIGVsZS5kYXRhKHByb3AsIHBhcmFtLmRhdGFbZWxlLmlkKCldW3Byb3BdKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8vIFRPRE8gcmVjb25zaWRlciB0aGlzIG9wZXJhdGlvbiBvZiB1bmRvIG9mIGl0LlxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuXHJcbiAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gIHJlc3VsdC5wb3NpdGlvbkFuZFNpemVzID0gdGhpcy5nZXROb2RlUG9zaXRpb25zQW5kU2l6ZXMoKTtcclxuXHJcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgcmVzdWx0LmVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0KHBhcmFtLmVsZXMsIHBhcmFtLmxheW91dHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXN1bHQuZWxlcyA9IGVsZXMuc2hvd0VsZXMoKTsgLy8gU2hvdyBnaXZlbiBlbGVzXHJcbiAgICB0aGlzLnJldHVyblRvUG9zaXRpb25zQW5kU2l6ZXMocGFyYW0ucG9zaXRpb25BbmRTaXplcyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG5cclxuICB2YXIgcmVzdWx0ID0ge307XHJcbiAgcmVzdWx0LnBvc2l0aW9uQW5kU2l6ZXMgPSB0aGlzLmdldE5vZGVQb3NpdGlvbnNBbmRTaXplcygpO1xyXG4gIHJlc3VsdC5lbGVzID0gZWxlcy5oaWRlRWxlcygpO1xyXG5cclxuICB0aGlzLnJldHVyblRvUG9zaXRpb25zQW5kU2l6ZXMocGFyYW0ucG9zaXRpb25BbmRTaXplcyk7XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vLyBTZWN0aW9uIEVuZFxyXG4vLyBnZW5lcmFsIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbi8vIFNlY3Rpb24gU3RhcnRcclxuLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgfTtcclxuICByZXN1bHQudHlwZSA9IHBhcmFtLnR5cGU7XHJcbiAgcmVzdWx0Lm5vZGVzID0gcGFyYW0ubm9kZXM7XHJcbiAgcmVzdWx0LmluZGV4ID0gcGFyYW0uaW5kZXg7XHJcblxyXG4gIHJlc3VsdC52YWx1ZSA9IGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3gocGFyYW0ubm9kZXMsIHBhcmFtLmluZGV4LCBwYXJhbS52YWx1ZSwgcGFyYW0udHlwZSk7XHJcblxyXG4gIGN5LmZvcmNlUmVuZGVyKCk7XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBvYmogPSBwYXJhbS5vYmo7XHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcblxyXG4gIHZhciBpbmRleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XHJcblxyXG4gIGN5LmZvcmNlUmVuZGVyKCk7XHJcblxyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBub2Rlczogbm9kZXMsXHJcbiAgICBpbmRleDogaW5kZXgsXHJcbiAgICBvYmo6IG9ialxyXG4gIH07XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIGluZGV4ID0gcGFyYW0uaW5kZXg7XHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcblxyXG4gIHZhciBvYmogPSBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94KG5vZGVzLCBpbmRleCk7XHJcblxyXG4gIGN5LmZvcmNlUmVuZGVyKCk7XHJcblxyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBub2Rlczogbm9kZXMsXHJcbiAgICBvYmo6IG9ialxyXG4gIH07XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcclxuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuICB2YXIgc3RhdHVzID0gcGFyYW0uc3RhdHVzO1xyXG4gIHZhciByZXN1bHRTdGF0dXMgPSB7fTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHZhciBpc011bHRpbWVyID0gbm9kZS5kYXRhKCdjbGFzcycpLmVuZHNXaXRoKCcgbXVsdGltZXInKTtcclxuXHJcbiAgICByZXN1bHRTdGF0dXNbbm9kZS5pZCgpXSA9IGlzTXVsdGltZXI7XHJcbiAgfVxyXG5cclxuICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIGNoYW5nZSB0aGUgc3RhdHVzIG9mIGFsbCBub2RlcyBhdCBvbmNlLlxyXG4gIC8vIElmIG5vdCBjaGFuZ2Ugc3RhdHVzIG9mIGVhY2ggc2VwZXJhdGVseSB0byB0aGUgdmFsdWVzIG1hcHBlZCB0byB0aGVpciBpZC5cclxuICBpZiAoZmlyc3RUaW1lKSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2RlLCBzdGF0dXNbbm9kZS5pZCgpXSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuLy8gIGlmICghZmlyc3RUaW1lICYmIF8uaXNFcXVhbChub2RlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xyXG4vLyAgICAkKCcjaW5zcGVjdG9yLWlzLW11bHRpbWVyJykuYXR0cihcImNoZWNrZWRcIiwgISQoJyNpbnNwZWN0b3ItaXMtbXVsdGltZXInKS5hdHRyKFwiY2hlY2tlZFwiKSk7XHJcbi8vICB9XHJcblxyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBzdGF0dXM6IHJlc3VsdFN0YXR1cyxcclxuICAgIG5vZGVzOiBub2Rlc1xyXG4gIH07XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG4gIHZhciBzdGF0dXMgPSBwYXJhbS5zdGF0dXM7XHJcbiAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcclxuICB2YXIgcmVzdWx0U3RhdHVzID0ge307XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICByZXN1bHRTdGF0dXNbbm9kZS5pZCgpXSA9IG5vZGUuZGF0YSgnY2xvbmVtYXJrZXInKTtcclxuICAgIHZhciBjdXJyZW50U3RhdHVzID0gZmlyc3RUaW1lID8gc3RhdHVzIDogc3RhdHVzW25vZGUuaWQoKV07XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGUsIGN1cnJlbnRTdGF0dXMpO1xyXG4gIH1cclxuXHJcbi8vICBpZiAoIWZpcnN0VGltZSAmJiBfLmlzRXF1YWwobm9kZXMsIGN5Lm5vZGVzKCc6c2VsZWN0ZWQnKSkpIHtcclxuLy8gICAgJCgnI2luc3BlY3Rvci1pcy1jbG9uZS1tYXJrZXInKS5hdHRyKFwiY2hlY2tlZFwiLCAhJCgnI2luc3BlY3Rvci1pcy1jbG9uZS1tYXJrZXInKS5hdHRyKFwiY2hlY2tlZFwiKSk7XHJcbi8vICB9XHJcblxyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBzdGF0dXM6IHJlc3VsdFN0YXR1cyxcclxuICAgIG5vZGVzOiBub2Rlc1xyXG4gIH07XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vLyBTZWN0aW9uIEVuZFxyXG4vLyBzYmduIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7Il19
