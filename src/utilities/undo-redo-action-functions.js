// Extends sbgnviz.undoRedoActionFunctions
var libs = require('./lib-utilities').getLibs();
var undoRedoActionFunctions = libs.undoRedoActionFunctions;

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

// TODO handle the firstTime case in elementUtilities
undoRedoActionFunctions.createTemplateReaction = function (param) {
  var firstTime = param.firstTime;
  var eles;

  if (firstTime) {
    var defaultMacromoleculProperties = elementUtilities.defaultSizes["macromolecule"];
    var templateType = param.templateType;
    var processWidth = elementUtilities.defaultSizes[templateType] ? elementUtilities.defaultSizes[templateType].width : 50;
    var macromoleculeWidth = defaultMacromoleculProperties ? defaultMacromoleculProperties.width : 50;
    var macromoleculeHeight = defaultMacromoleculProperties ? defaultMacromoleculProperties.height : 50;
    var processPosition = param.processPosition;
    var macromoleculeList = param.macromoleculeList;
    var complexName = param.complexName;
    var numOfMacromolecules = macromoleculeList.length;
    var tilingPaddingVertical = param.tilingPaddingVertical ? param.tilingPaddingVertical : 15;
    var tilingPaddingHorizontal = param.tilingPaddingHorizontal ? param.tilingPaddingHorizontal : 15;
    var edgeLength = param.edgeLength ? param.edgeLength : 60;

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
    eles = cy.elements('[justAdded]');
    eles.removeData('justAdded');
  }
  else {
    eles = param;
    cy.add(eles);
  }

  refreshPaddings();
  cy.elements().unselect();
  eles.select();

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

undoRedoActionFunctions.resizeNode = function (param) {
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

  nodes.removeClass('noderesized');
  nodes.addClass('noderesized');

  if (_.isEqual(nodes, cy.nodes(':selected'))) {
    inspectorUtilities.handleSBGNInspector();
  }

  return result;
};

undoRedoActionFunctions.changeNodeLabel = function (param) {
  var result = {
  };
  var nodes = param.nodes;
  result.nodes = nodes;
  result.sbgnlabel = {};

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    result.sbgnlabel[node.id()] = node._private.data.sbgnlabel;
  }

  if (param.firstTime) {
    nodes.data('sbgnlabel', param.sbgnlabel);
  }
  else {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      node._private.data.sbgnlabel = param.sbgnlabel[node.id()];
    }
  }

  nodes.removeClass('changeContent');
  nodes.addClass('changeContent');

  if (_.isEqual(nodes, cy.nodes(':selected'))) {
    inspectorUtilities.handleSBGNInspector();
  }

  return result;
};

undoRedoActionFunctions.changeStyleData = function (param) {
  var result = {
  };
  var eles = param.eles;

  result.dataType = param.dataType;
  result.data = {};
  result.eles = eles;

  for (var i = 0; i < eles.length; i++) {
    var ele = eles[i];
    result.data[ele.id()] = ele.data(param.dataType);
  }

  if (param.firstTime) {
    eles.data(param.dataType, param.data);
  }
  else {
    for (var i = 0; i < eles.length; i++) {
      var ele = eles[i];
      ele.data(param.dataType, param.data[ele.id()]);
    }
  }

  cy.forceRender();

  if (_.isEqual(eles, cy.nodes(':selected'))) {
    inspectorUtilities.handleSBGNInspector();
  }

  return result;
};

undoRedoActionFunctions.changeStyleCss = function (param) {
  var result = {
  };
  var eles = param.eles;
  result.dataType = param.dataType;
  result.data = {};
  result.eles = eles;

  for (var i = 0; i < eles.length; i++) {
    var ele = eles[i];
    result.data[ele.id()] = ele.css(param.dataType);
  }

  if (param.firstTime) {
    eles.css(param.dataType, param.data);
  }
  else {
    for (var i = 0; i < eles.length; i++) {
      var ele = eles[i];
      ele.css(param.dataType, param.data[ele.id()]);
    }
  }
  cy.forceRender();

  // TODO move such calls to sample application maybe by triggering an event
  if (_.isEqual(eles, cy.nodes(':selected'))) {
    inspectorUtilities.handleSBGNInspector();
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
  result.width = param.width;
  result.index = param.index;

  result.value = elementUtilities.changeStateOrInfoBox(param.nodes, param.index, param.value, param.type);

  cy.forceRender();

  // TODO move such calls to sample application maybe by triggering an event
  inspectorUtilities.fillInspectorStateAndInfos(param.nodes, param.nodes().data('stateandinfos'), param.width);

  return result;
};

undoRedoActionFunctions.addStateOrInfoBox = function (param) {
  var obj = param.obj;
  var nodes = param.nodes;

  var index = elementUtilities.addStateOrInfoBox(nodes, obj);

  if (_.isEqual(nodes, cy.nodes(':selected'))) {
    inspectorUtilities.fillInspectorStateAndInfos(nodes, nodes.data('stateandinfos'), param.width);
  }
  cy.forceRender();

  var result = {
    nodes: nodes,
    width: param.width,
    index: index,
    obj: obj
  };
  return result;
};

undoRedoActionFunctions.removeStateOrInfoBox = function (param) {
  var index = param.index;
  var nodes = param.nodes;

  var obj = elementUtilities.removeStateOrInfoBox(nodes, index);

  if (_.isEqual(nodes, cy.nodes(':selected'))) {
    inspectorUtilities.fillInspectorStateAndInfos(nodes, nodes.data('stateandinfos'), param.width);
  }
  cy.forceRender();

  var result = {
    nodes: nodes,
    width: param.width,
    obj: obj
  };
  return result;
};

undoRedoActionFunctions.setMultimerStatus = function (param) {
  var firstTime = param.firstTime;
  var nodes = param.nodes;
  var status = param.makeMultimer;
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