var elementUtilities = {}; // TODO this initialization should be replaced with sbgnviz.elementUtilities or something like that

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
elementUtilities.createCompoundForGivenNodes = function(nodesToMakeCompound, compundType) {
  var oldParentId = nodesToMakeCompound[0].data("parent");
  // The parent of new compound will be the old parent of the nodes to make compound
  var newCompound = elementUtilities.addNode(undefined, undefined, compundType, oldParentId, true);
  var newCompoundId = newCompound.id();
  nodesToMakeCompound.move({parent: newCompoundId});
  refreshPaddings();
  return newCompound;
};

elementUtilities.removeCompound = function(compoundToRemove) {
  var compoundId = compoundToRemove.id();
  var newParentId = compoundToRemove.data("parent");
  newParentId = newParentId === undefined ? null : newParentId;
  var childrenOfCompound = compoundToRemove.children();

  childrenOfCompound.move({parent: newParentId});
  var removedCompund = compoundToRemove.remove();
};

// Resize given nodes if useAspectRatio is truthy one of width or height should not be set.
elementUtilities.resizeNodes = function(nodes, width, height, useAspectRatio) {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var ratio = undefined;
    var eleMustBeSquare = elementUtilities.mustBeSquare(node.data('sbgnclass'));

    // Note that both width and height should not be set if useAspectRatio is truthy
    if (width) {
      if (useAspectRatio || eleMustBeSquare) {
        ratio = width / node.width();
      }

      node.data("sbgnbbox").w = width;
    }

    if (height) {
      if (useAspectRatio || eleMustBeSquare) {
        ratio = height / node.height();
      }

      node.data("sbgnbbox").h = height;
    }

    if (ratio && !height) {
      node.data("sbgnbbox").h = node.height() * ratio;
    }
    else if (ratio && !width) {
      node.data("sbgnbbox").w = node.width() * ratio;
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
elementUtilities.getCommonProperty = function(elements, propertyName, dataOrCss) {
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
elementUtilities.trueForAllElements = function(elements, fcn) {
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
  var sbgnclass = ( typeof ele === 'string' ? ele : ele.data('class') ).replace(" multimer", "");

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
  var sbgnclass = ( typeof ele === 'string' ? ele : ele.data('class') ).replace(" multimer", "");

  var list = {
    'macromolecule': true,
    'complex': true,
    'nucleic acid feature': true,
    'simple chemical': true
  };

  return list[sbgnclass] ? true : false;
};

// Returns whether the given element is an EPN
elementUtilities.isEPNClass = function(ele) {
  var sbgnclass = ( typeof ele === 'string' ? ele : ele.data('class') ).replace(" multimer", "");
  
  return (sbgnclass == 'unspecified entity'
          || sbgnclass == 'simple chemical'
          || sbgnclass == 'macromolecule'
          || sbgnclass == 'nucleic acid feature'
          || sbgnclass == 'complex');
};

// Returns whether the given element is a PN
elementUtilities.isPNClass = function(ele) {
  var sbgnclass = ( typeof ele === 'string' ? ele : ele.data('class') ).replace(" multimer", "");
  
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
elementUtilities.convenientToEquivalence = function(ele) {
  var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');
  return (sbgnclass == 'tag' || sbgnclass == 'terminal');
};

// Relocates state and info boxes. This function is expected to be called after add/remove state and info boxes
elementUtilities.relocateStateAndInfos = function (ele) {
  var stateAndInfos = ( ele.isNode && ele.isNode() ) ? ele.data('statesandinfos') : ele;
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
elementUtilities.changeStateOrInfoBox = function(nodes, index, value, type) {
  var result;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var stateAndInfos = node.data('stateandinfos');
    var box = stateAndInfos[i];
    
    if (box.clazz == "state variable") {
      if(!result) {
        result = box.state[type];
      }
      
      box.state[type] = value;
    }
    else if (state.clazz == "unit of information") {
      if(!result) {
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
elementUtilities.addStateOrInfoBox = function(nodes, obj) {
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
elementUtilities.removeStateOrInfoBox = function(nodes, index) {
  var obj;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var stateAndInfos = node.data('stateandinfos');
    if(!obj) {
      obj = stateAndInfos[index];
    }
    stateAndInfos.splice(index, 1); // Remove the box
    this.relocateStateAndInfos(stateAndInfos); // Relocate state and infos
  }
  
  return obj;
};

// Set multimer status of the given nodes to the given status.
elementUtilities.setMultimerStatus = function(nodes, status) {
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
elementUtilities.setCloneMarkerStatus = function(nodes, status) {
  cy.startBatch();
  
  nodes.data('clonemarker', status ? true : undefined);
  var nodesToAddClass = nodes.filter('[class="perturbing agent"]');
  nodesToAddClass.removeClass('changeClonedStatus');
  nodesToAddClass.addClass('changeClonedStatus');
  
  cy.endBatch();
};

//elementUtilities.setCloneMarkerStatus = function()

elementUtilities.changeFontProperties = function(eles, data) {
  for (var prop in data) {
    eles.data(prop, data[prop]);
  }
};