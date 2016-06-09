/**
 *	Design for SBGNViz Editor actions.
 *  Command Design Pattern is used.
 *  A simple undo-redo manager is implemented(EditorActionsManager)
 *	Author: Istemi Bahceci<istemi.bahceci@gmail.com>
 */

function addNode(param)
{
  var result;
  if (param.firstTime) {
    var newNode = param.newNode;
    result = addRemoveUtilities.addNode(newNode.x, newNode.y, newNode.sbgnclass);
  }
  else {
    result = addRemoveUtilities.restoreEles(param);
  }
  return result;
}

function removeNodes(nodesToBeDeleted)
{
  return addRemoveUtilities.removeNodes(nodesToBeDeleted);
}

function removeEles(elesToBeRemoved) {
  return addRemoveUtilities.removeEles(elesToBeRemoved);
}

function restoreEles(eles)
{
  return addRemoveUtilities.restoreEles(eles);
}

function addEdge(param)
{
  var result;
  if (param.firstTime) {
    var newEdge = param.newEdge;
    result = addRemoveUtilities.addEdge(newEdge.source, newEdge.target, newEdge.sbgnclass);
  }
  else {
    result = addRemoveUtilities.restoreEles(param);
  }
  return result;
}

function removeEdges(edgesToBeDeleted)
{
  return addRemoveUtilities.removeEdges(edgesToBeDeleted);
}

//Clones given nodes and their descendants in top down order
function cloneTopDown(nodes, nodeIdMap, oldIDToID){
  if(nodes.length == 0){
    return cy.collection();
  }
  
  var jsons = jQuery.extend(true, [], nodes.jsons());
  for(var i = 0; i < jsons.length; i++){
    var json = jsons[i];
    nodeIdMap[json.data.id] = true;
    json.data.oldId = json.data.id;
    json.data.justAdded = true;
    
    //change the original parent with the clone parent
    if(json.data.parent && oldIDToID[json.data.parent]){
      json.data.parent = oldIDToID[json.data.parent];
    }
    
    delete json.data.id;
  }
  
  cy.add(jsons);
  
  var justAddedNodes = cy.nodes('[justAdded]');
  
  for(var i = 0; i < justAddedNodes.length; i++){
    var node = justAddedNodes[i];
    oldIDToID[node.data('oldId')] = node.id();
    node.removeData('justAdded');
  }
  
  justAddedNodes.removeData('oldId');
  var clonedDescendants = cloneTopDown(nodes.children(), nodeIdMap, oldIDToID);
  return justAddedNodes.union(clonedDescendants);
}

function createTemplateReaction(param){
  var firstTime = param.firstTime;
  var eles;
  
  if(firstTime){
    var defaultMacromoleculProperties = addRemoveUtilities.defaultsMap["macromolecule"];
    var templateType = param.templateType;
    var processWidth = addRemoveUtilities.defaultsMap[templateType]?addRemoveUtilities.defaultsMap[templateType].width:50;
    var macromoleculeWidth = defaultMacromoleculProperties?defaultMacromoleculProperties.width:50;
    var macromoleculeHeight = defaultMacromoleculProperties?defaultMacromoleculProperties.height:50;
    var processPosition = param.processPosition;
    var macromoleculeList = param.macromoleculeList;
    var complexName = param.complexName;
    var numOfMacromolecules = macromoleculeList.length;
    var tilingPaddingVertical = param.tilingPaddingVertical?param.tilingPaddingVertical:15;
    var tilingPaddingHorizontal = param.tilingPaddingHorizontal?param.tilingPaddingHorizontal:15;
    var edgeLength = param.edgeLength?param.edgeLength:60;
    
    var xPositionOfFreeMacromolecules;
    if(templateType === 'association'){
      xPositionOfFreeMacromolecules = processPosition.x - edgeLength - processWidth / 2 - macromoleculeWidth / 2;
    }
    else{
      xPositionOfFreeMacromolecules = processPosition.x + edgeLength + processWidth / 2 + macromoleculeWidth / 2;
    }
    
    //Create the process in template type
    var process = addRemoveUtilities.addNode(processPosition.x, processPosition.y, templateType);
    process.data('justAdded', true);
    
    //Define the starting y position
    var yPosition = processPosition.y - ((numOfMacromolecules - 1) / 2) * ( macromoleculeHeight + tilingPaddingVertical );
    
    //Create the free macromolecules
    for(var i = 0; i < numOfMacromolecules; i++){
      var newNode = addRemoveUtilities.addNode(xPositionOfFreeMacromolecules, yPosition, "macromolecule");
      newNode.data('justAdded', true);
      newNode.data('sbgnlabel', macromoleculeList[i]);
      
      //create the edge connected to the new macromolecule
      var newEdge;
      if(templateType === 'association'){
        newEdge = addRemoveUtilities.addEdge(newNode.id(), process.id(), 'consumption');
      }
      else{
        newEdge = addRemoveUtilities.addEdge(process.id(), newNode.id(), 'production');
      }
      
      newEdge.data('justAdded', true);
      
      //update the y position
      yPosition += macromoleculeHeight + tilingPaddingVertical;
    }
    
    //Create the complex including macromolecules inside of it
    //Temprorarily add it to the process position we will move it according to the last size of it
    var complex = addRemoveUtilities.addNode(processPosition.x, processPosition.y, 'complex');
    complex.data('justAdded', true);
    complex.data('justAddedLayoutNode', true);
    
    //If a name is specified for the complex set its label accordingly
    if(complexName){
      complex.data('sbgnlabel', complexName);
    }
    
    //create the edge connnected to the complex
    var edgeOfComplex;
    if(templateType === 'association'){
      edgeOfComplex = addRemoveUtilities.addEdge(process.id(), complex.id(), 'production');
    }
    else{
      edgeOfComplex = addRemoveUtilities.addEdge(complex.id(), process.id(), 'consumption');
    }
    edgeOfComplex.data('justAdded', true);
    
    //Create the macromolecules inside the complex
    for(var i = 0; i < numOfMacromolecules; i++){
      var newNode = addRemoveUtilities.addNode(complex.position('x'), complex.position('y'), "macromolecule", complex.id());
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
      stop: function(){
        //re-position the nodes inside the complex
        var supposedXPosition;
        var supposedYPosition = processPosition.y;
        
        if(templateType === 'association'){
          supposedXPosition = processPosition.x + edgeLength + processWidth / 2 + complex.outerWidth() / 2;
        }
        else{
          supposedXPosition = processPosition.x - edgeLength - processWidth / 2 - complex.outerWidth() / 2;
        }
        
        var positionDiffX = supposedXPosition - complex.position('x');
        var positionDiffY = supposedYPosition - complex.position('y');
        moveNodes({x: positionDiffX, y: positionDiffY}, complex);
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
}

function cloneGivenElements(param){
  var eles;
  if(param.firstTime){
    eles = param.eles;
    //Keep nodeIdMap to select the edges to clone
    var nodeIdMap = {};
    var oldIDToID = {};
    var topMostNodes = sbgnElementUtilities.getTopMostNodes(eles);
    var edges;
    
    var justAddedNodes = cloneTopDown(topMostNodes, nodeIdMap, oldIDToID);
    moveNodes({x: 50, y: 50}, sbgnElementUtilities.getTopMostNodes(justAddedNodes));
    
    //filter the edges which must be included in the cloned sub-network
    edges = cy.edges(':visible').filter(function(i, ele){
      var srcId = ele.data('source');
      var tgtId = ele.data('target');
      
      return nodeIdMap[srcId] && nodeIdMap[tgtId];
    });
    
    var edgeJsons = jQuery.extend(true, [], edges.jsons());
    //remove the ids in jsons and alter the source and target ids
    for(var i = 0; i < edgeJsons.length; i++){
      var json = edgeJsons[i];
      var newSrcId = oldIDToID[json.data.source];
      var newTgtId = oldIDToID[json.data.target];
      json.data.source = newSrcId;
      json.data.target = newTgtId;
      json.data.justAdded = true;
      delete json.data.id;
    }
    
    cy.add(edgeJsons);
    
    var justAddedEdges = cy.edges('[justAdded]');
    justAddedEdges.removeData('justAdded');
    
    //update the eles to be returned for undo operation
    eles = justAddedNodes.union(justAddedEdges);
  }
  else {
    eles = param;
    cy.add(eles);
  }
  
  refreshPaddings();
  cy.elements().unselect();
  eles.select();
  
  return eles;
}

function expandNode(param) {
  var result = {
    firstTime: false
  };
  var node = param.node;
  result.node = node;
  result.nodesData = getNodePositionsAndSizes();
  if (param.firstTime) {
    expandCollapseUtilities.expandNode(node);
  }
  else {
    expandCollapseUtilities.simpleExpandNode(node);
    returnToPositionsAndSizes(param.nodesData);
  }
  return result;
}

function collapseNode(param) {
  var result = {
    firstTime: false
  };
  var node = param.node;
  result.node = node;
  result.nodesData = getNodePositionsAndSizes();
  if (param.firstTime) {
    expandCollapseUtilities.collapseNode(node);
  }
  else {
    expandCollapseUtilities.simpleCollapseNode(node);
    returnToPositionsAndSizes(param.nodesData);
  }
  return result;
}

function expandGivenNodes(param) {
  var nodes = param.nodes;
  var result = {
    firstTime: false
  };
  result.nodes = nodes;
  result.nodesData = getNodePositionsAndSizes();
  if (param.firstTime) {
    expandCollapseUtilities.expandGivenNodes(nodes);
  }
  else {
    expandCollapseUtilities.simpleExpandGivenNodes(nodes);
    returnToPositionsAndSizes(param.nodesData);
  }
  return result;
}

function collapseGivenNodes(param) {
  var nodes = param.nodes;
  var result = {};
  result.nodes = nodes;
  result.nodesData = getNodePositionsAndSizes();
  if (param.firstTime) {
    expandCollapseUtilities.collapseGivenNodes(nodes);
  }
  else {
    expandCollapseUtilities.simpleCollapseGivenNodes(nodes);
    returnToPositionsAndSizes(param.nodesData);
  }
  return result;
}

function expandAllNodes(param) {
  var result = {
    firstTime: false
  };
  result.nodesData = getNodePositionsAndSizes();
  if (param.firstTime) {
    result.expandStack = expandCollapseUtilities.expandAllNodes(param.nodes, param.selector);
  }
  else {
    result.expandStack = expandCollapseUtilities.simpleExpandAllNodes();
    returnToPositionsAndSizes(param.nodesData);
  }
  return result;
}

function simpleExpandAllNodes(param) {
  var result = {
    firstTime: false
  };
  result.nodesData = getNodePositionsAndSizes();
  if (param.firstTime) {
    result.expandStack = expandCollapseUtilities.simpleExpandAllNodes(param.nodes, param.selector);
  }
  else {
    result.expandStack = expandCollapseUtilities.simpleExpandAllNodes();
    returnToPositionsAndSizes(param.nodesData);
  }
  return result;
}

function collapseExpandedStack(expandedStack) {
  return expandCollapseUtilities.collapseExpandedStack(expandedStack);
}

function undoExpandAllNodes(param) {
  var result = {
    firstTime: false
  };
  result.nodesData = getNodePositionsAndSizes();
  expandCollapseUtilities.collapseExpandedStack(param.expandStack);
  returnToPositionsAndSizes(param.nodesData);
  return result;
}

function getNodePositionsAndSizes() {
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
}

function undoExpandNode(param) {
  var result = {
    firstTime: false
  };
  result.nodesData = getNodePositionsAndSizes();
  result.node = expandCollapseUtilities.simpleCollapseNode(param.node);
  returnToPositionsAndSizes(param.nodesData);
  return result;
}

function undoCollapseNode(param) {
  var result = {
    firstTime: false
  };
  result.nodesData = getNodePositionsAndSizes();
  result.node = expandCollapseUtilities.simpleExpandNode(param.node);
  returnToPositionsAndSizes(param.nodesData);
  return result;
}

function undoExpandGivenNodes(param) {
  var result = {
    firstTime: false
  };
  result.nodesData = getNodePositionsAndSizes();
  result.nodes = expandCollapseUtilities.simpleCollapseGivenNodes(param.nodes);
  returnToPositionsAndSizes(param.nodesData);
  return result;
}

function undoCollapseGivenNodes(param) {
  var result = {
    firstTime: false
  };
  result.nodesData = getNodePositionsAndSizes();
  result.nodes = expandCollapseUtilities.simpleExpandGivenNodes(param.nodes);
  returnToPositionsAndSizes(param.nodesData);
  return result;
}

function simpleExpandNode(node) {
  return expandCollapseUtilities.simpleExpandNode(node);
}

function simpleCollapseNode(node) {
  return expandCollapseUtilities.simpleCollapseNode(node);
}

function simpleExpandGivenNodes(nodes) {
  return expandCollapseUtilities.simpleExpandGivenNodes(nodes);
}

function simpleCollapseGivenNodes(nodes) {
  return expandCollapseUtilities.simpleCollapseGivenNodes(nodes);
}

function returnToPositionsAndSizesConditionally(nodesData) {
  if (nodesData.firstTime) {
    delete nodesData.firstTime;
    return nodesData;
  }
  return returnToPositionsAndSizes(nodesData);
}

function returnToPositionsAndSizes(nodesData) {
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
}

function moveNodesConditionally(param) {
  if (param.move) {
    moveNodes(param.positionDiff, param.nodes);
  }
  return param;
}

function moveNodesReversely(param) {
  var diff = {
    x: -1 * param.positionDiff.x,
    y: -1 * param.positionDiff.y
  };
  var result = {
    positionDiff: param.positionDiff,
    nodes: param.nodes,
    move: true
  };
  moveNodes(diff, param.nodes);
  return result;
}

function moveNodes(positionDiff, nodes, notCalcTopMostNodes) {
  var topMostNodes = notCalcTopMostNodes?nodes:sbgnElementUtilities.getTopMostNodes(nodes);
  for (var i = 0; i < topMostNodes.length; i++) {
    var node = topMostNodes[i];
    var oldX = node.position("x");
    var oldY = node.position("y");
    node.position({
      x: oldX + positionDiff.x,
      y: oldY + positionDiff.y
    });
    var children = node.children();
    moveNodes(positionDiff, children, true);
  }
}

function deleteSelected(param) {
  if (param.firstTime) {
    return sbgnFiltering.deleteSelected();
  }
  return addRemoveUtilities.removeElesSimply(param.eles);
}

function restoreSelected(eles) {
  var param = {};
  param.eles = restoreEles(eles);
  param.firstTime = false;
  return param;
}

function hideSelected(param) {
  var currentNodes = cy.nodes(":visible");
  
  if(currentNodes.length == 0){
    return;
  }
  
  if (param.firstTime) {
    sbgnFiltering.hideSelected();
  }
  else {
    sbgnFiltering.showJustGivenNodes(param.nodesToShow);
  }
  clearDrawsOfNodeResize();
  return currentNodes;
}

function showSelected(param) {
  var currentNodes = cy.nodes(":visible");
  if (param.firstTime) {
    sbgnFiltering.showSelected();
  }
  else {
    sbgnFiltering.showJustGivenNodes(param.nodesToShow);
  }
  return currentNodes;
}

function showAll() {
  var currentNodes = cy.nodes(":visible");
  sbgnFiltering.showAll();
  return currentNodes;
}

function showJustGivenNodes(nodesToShow) {
  var param = {};
  param.nodesToShow = cy.nodes(":visible");
  param.firstTime = false;
  sbgnFiltering.showJustGivenNodes(nodesToShow);
  return param;
}

function highlightExtensionOfSelectedElements(param) {
  var elementsToHighlight;
  var result = {};
  //If this is the first call of the function then call the original method
  if (param.firstTime) {
    if (sbgnFiltering.thereIsNoHighlightedElement()) {
      //mark that there was no highlighted element
      result.thereWasNoHighlightedElement = true;
    }
    
    var alreadyHighlighted = cy.elements("[highlighted='true']").filter(":visible");
    
    if(param.elesToHighlight){
      elementsToHighlight = param.elesToHighlight;
    }
    
    //If elementsToHighlight is undefined it will be calculated in the function else it
    //will be directly used in the function
    if (param.highlightNeighboursofSelected) {
      elementsToHighlight = sbgnFiltering.highlightNeighborsofSelected(elementsToHighlight);
    }
    else if (param.highlightProcessesOfSelected) {
      elementsToHighlight = sbgnFiltering.highlightProcessesOfSelected(elementsToHighlight);
    }
    
    elementsToHighlight = elementsToHighlight.not(alreadyHighlighted);
  }
  else {
    elementsToHighlight = param.elesToHighlight.not(cy.elements("[highlighted='true']").filter(":visible"));
    elementsToHighlight.data("highlighted", 'true');
    sbgnFiltering.highlightNodes(elementsToHighlight.nodes());
    sbgnFiltering.highlightEdges(elementsToHighlight.edges());

    //If there are some elements to not highlight handle them
    if (param.elesToNotHighlight != null) {
      var elesToNotHighlight = param.elesToNotHighlight;
      elesToNotHighlight.removeData("highlighted");
      sbgnFiltering.notHighlightNodes(elesToNotHighlight.nodes());
      sbgnFiltering.notHighlightEdges(elesToNotHighlight.edges());

      //If there are some elements to not highlight then thereWasNoHighlightedElement should be true
      result.thereWasNoHighlightedElement = true;
    }
  }
  result.elesToNotHighlight = elementsToHighlight;
  return result;
}

function removeHighlightOfElements(param) {
  var elesToNotHighlight = param.elesToNotHighlight;
  var thereWasNoHighlightedElement = param.thereWasNoHighlightedElement;

  var result = {};

  if (param.thereWasNoHighlightedElement) {
    sbgnFiltering.removeHighlights();
    result.elesToHighlight = elesToNotHighlight;
    result.elesToNotHighlight = cy.elements(":visible").not(elesToNotHighlight);
  }
  else {
    sbgnFiltering.notHighlightNodes(elesToNotHighlight.nodes());
    sbgnFiltering.notHighlightEdges(elesToNotHighlight.edges());
    elesToNotHighlight.removeData("highlighted");

    result.elesToHighlight = elesToNotHighlight;
  }

  result.firstTime = false;
  return result;
}

function removeHighlights() {
  var result = {};
  if (sbgnFiltering.thereIsNoHighlightedElement()) {
    result.elesToHighlight = cy.elements(":visible");
  }
  else {
    result.elesToHighlight = cy.elements("[highlighted='true']").filter(":visible");
  }

  sbgnFiltering.removeHighlights();

  result.elesToNotHighlight = cy.elements(":visible").not(result.elesToHighlight);
  result.firstTime = false;
  return result;
}

function changeParent(param) {
  //If there is an inner param firstly call the function with it
  //Inner param is created if the change parent operation requires 
  //another change parent operation in it.
  if (param.innerParam) {
    changeParent(param.innerParam);
  }

  var node = param.node;
  var oldParentId = node._private.data.parent;
  var oldParent = node.parent()[0];
  var newParent = param.newParent;
  var nodesData = param.nodesData;
  var result = {
    node: node,
    newParent: oldParent
  };

  result.nodesData = getNodesData();

  //If new parent is not null some checks should be performed
  if (newParent) {
    //check if the node was the anchestor of it's new parent 
    var wasAnchestorOfNewParent = false;
    var temp = newParent.parent()[0];
    while (temp != null) {
      if (temp == node) {
        wasAnchestorOfNewParent = true;
        break;
      }
      temp = temp.parent()[0];
    }
    //if so firstly remove the parent from inside of the node
    if (wasAnchestorOfNewParent) {
      var parentOfNewParent = newParent.parent()[0];
      addRemoveUtilities.changeParent(newParent, newParent._private.data.parent, node._private.data.parent);
      oldParentId = node._private.data.parent;
      //We have an internal change parent operation to redo this operation 
      //we need an inner param to call the function with it at the beginning
      result.innerParam = {
        node: newParent,
        newParent: parentOfNewParent,
        nodesData: {
          firstTime: true
        }
      };
    }
  }

  //Change the parent of the node
  addRemoveUtilities.changeParent(node, oldParentId, newParent ? newParent._private.data.id : undefined);

  if (param.posX && param.posY) {
    var positionDiff = {
      x: param.posX - node.position('x'),
      y: param.posY - node.position('y')
    };
    
    moveNodes(positionDiff ,node);
  }

  cy.nodes().updateCompoundBounds();
  
  returnToPositionsAndSizesConditionally(nodesData);

  return result;
}

/*
 * This method assumes that param.nodesToMakeCompound contains at least one node
 * and all of the nodes including in it have the same parent
 */
function createCompoundForSelectedNodes(param) {
  var nodesToMakeCompound = param.nodesToMakeCompound;
  var oldParentId = nodesToMakeCompound[0].data("parent");
  var newCompound;

  if (param.firstTime) {
    var eles = cy.add({
      group: "nodes",
      data: {
        sbgnclass: param.compundType,
        parent: oldParentId,
        sbgnbbox: {
        },
        sbgnstatesandinfos: [],
        ports: []
      }
    });

    newCompound = eles[eles.length - 1];
    newCompound._private.data.sbgnbbox.h = newCompound.height();
    newCompound._private.data.sbgnbbox.w = newCompound.width();
  }
  else {
    newCompound = param.removedCompund.restore();
  }

  var newCompoundId = newCompound.id();

  addRemoveUtilities.changeParent(nodesToMakeCompound, oldParentId, newCompoundId);
  
  return newCompound;
}

function removeCompound(compoundToRemove) {
  var compoundId = compoundToRemove.id();
  var newParentId = compoundToRemove.data("parent");
  var childrenOfCompound = compoundToRemove.children();

  addRemoveUtilities.changeParent(childrenOfCompound, compoundId, newParentId);
  var removedCompund = compoundToRemove.remove();

  var param = {
    nodesToMakeCompound: childrenOfCompound,
    removedCompund: removedCompund
  };

  return param;
}

function resizeNode(param) {
  var result = {
    firstTime: false
  };
  var node = param.node;
  result.width = node.width();
  result.height = node.height();
  result.node = node;
  if (!param.firstTime) {
    node.data("width", param.width);
    node.data("height", param.height);
  }
  
  node._private.data.sbgnbbox.w = node.width();
  node._private.data.sbgnbbox.h = node.height();
  return result;
}

function changeNodeLabel(param) {
  var result = {
  };
  var nodes = param.nodes;
  result.nodes = nodes;
  result.sbgnlabel = {};
  
  for(var i = 0; i < nodes.length; i++){
    var node = nodes[i];
    result.sbgnlabel[node.id()] = node._private.data.sbgnlabel;
  }
  
  if(param.firstTime){
    nodes.data('sbgnlabel', param.sbgnlabel);
  }
  else {
    for(var i = 0; i < nodes.length; i++){
      var node = nodes[i];
      node._private.data.sbgnlabel = param.sbgnlabel[node.id()];
    }
  }
  
  nodes.removeClass('changeContent');
  nodes.addClass('changeContent');

  if (_.isEqual(nodes, cy.nodes(':selected'))) {
    handleSBGNInspector();
  }

  return result;
}

function changeStateVariable(param) {
  var result = {
  };
  var state = param.state;
  var type = param.type;
  result.state = state;
  result.type = type;
  result.valueOrVariable = state.state[type];
  result.nodes = param.nodes;
  result.width = param.width;
  result.stateAndInfos = param.stateAndInfos;

  var index = param.stateAndInfos.indexOf(state);
  state.state[type] = param.valueOrVariable;
  
  for(var i = 0; i < param.nodes.length; i++){
    param.nodes[i]._private.data.sbgnstatesandinfos = param.stateAndInfos;
  }
  
  cy.forceRender();

  fillInspectorStateAndInfos(param.nodes, param.stateAndInfos, param.width);

  return result;
}

function changeUnitOfInformation(param) {
  var result = {
  };
  var state = param.state;
  result.state = state;
  result.text = state.label.text;
  result.node = param.node;
  result.width = param.width;

  state.label.text = param.text;
  cy.forceRender();

  if (cy.elements(":selected").length == 1 && cy.elements(":selected")[0] == param.node) {
    fillInspectorStateAndInfos(param.node, param.width);
  }

  return result;
}

function addStateAndInfo(param) {
  var obj = param.obj;
  var nodes = param.nodes;
  var stateAndInfos = param.stateAndInfos;

  stateAndInfos.push(obj);
  relocateStateAndInfos(stateAndInfos);
  
  for(var i = 0; i < nodes.length; i++){
    nodes[i]._private.data.sbgnstatesandinfos = stateAndInfos;
  }
  
  if (_.isEqual(nodes, cy.nodes(':selected'))) {
    fillInspectorStateAndInfos(nodes, stateAndInfos, param.width);
  }
  cy.forceRender();

  var result = {
    nodes: nodes,
    width: param.width,
    stateAndInfos: stateAndInfos,
    obj: obj
  };
  return result;
}

function removeStateAndInfo(param) {
  var obj = param.obj;
  var nodes = param.nodes;
  var stateAndInfos = param.stateAndInfos;

  var index = stateAndInfos.indexOf(obj);
  stateAndInfos.splice(index, 1);
  
  for(var i = 0; i < nodes.length; i++){
    nodes[i]._private.data.sbgnstatesandinfos = stateAndInfos;
  }
  
  if (_.isEqual(nodes, cy.nodes(':selected'))) {
    fillInspectorStateAndInfos(nodes, stateAndInfos, param.width);
  }
  relocateStateAndInfos(stateAndInfos);
  cy.forceRender();

  var result = {
    nodes: nodes,
    width: param.width,
    stateAndInfos: stateAndInfos,
    obj: obj
  };
  return result;
}

function changeIsMultimerStatus(param) {
  var firstTime = param.firstTime;
  var nodes = param.nodes;
  var makeMultimer = param.makeMultimer;
  var resultMakeMultimer = {};
  
  for(var i = 0; i < nodes.length; i++){
    var node = nodes[i];
    var isMultimer = node.data('sbgnclass').endsWith(' multimer');
  
    resultMakeMultimer[node.id()] = isMultimer;
  }
  
  for(var i = 0; i < nodes.length; i++){
    var node = nodes[i];
    var sbgnclass = node.data('sbgnclass');
    var isMultimer = node.data('sbgnclass').endsWith(' multimer');
    
    if( ( firstTime && makeMultimer ) || ( !firstTime && makeMultimer[node.id()] ) ) {
      if(!isMultimer){
        node.data('sbgnclass', sbgnclass + ' multimer');
      }
    }
    else {
      if(isMultimer){
        node.data('sbgnclass', sbgnclass.replace(' multimer', ''));
      }
    }
  }
  
  if (!firstTime && _.isEqual(nodes, cy.nodes(':selected'))) {
    $('#inspector-is-multimer').attr("checked", !$('#inspector-is-multimer').attr("checked"));
  }
  
  var result = {
    makeMultimer: resultMakeMultimer,
    nodes: nodes
  };
  
  return result;
}

function changeIsCloneMarkerStatus(param) {
  var nodes = param.nodes;
  var makeCloneMarker = param.makeCloneMarker;
  var firstTime = param.firstTime;
  var resultMakeCloneMarker = {};
  
  for(var i = 0; i < nodes.length; i++){
    var node = nodes[i];
    resultMakeCloneMarker[node.id()] = node._private.data.sbgnclonemarker;
    var currentMakeCloneMarker = firstTime?makeCloneMarker:makeCloneMarker[node.id()];
    node._private.data.sbgnclonemarker = currentMakeCloneMarker ? true : undefined;
    if(node.data('sbgnclass') === 'perturbing agent'){
      node.removeClass('changeClonedStatus');
      node.addClass('changeClonedStatus');
    }
  }
  
  cy.forceRender();
  if (!firstTime && _.isEqual(nodes, cy.nodes(':selected'))) {
    $('#inspector-is-clone-marker').attr("checked", !$('#inspector-is-clone-marker').attr("checked"));
  }
  
  var result = {
    makeCloneMarker: resultMakeCloneMarker,
    nodes: nodes
  };
  
  return result;
}

function changeStyleData(param) {
  var result = {
  };
  var eles = param.eles;
  
  result.dataType = param.dataType;
  result.data = {};
  result.eles = eles;
  
  for(var i = 0; i < eles.length; i++){
    var ele = eles[i];
    result.data[ele.id()] = ele.data(param.dataType);
  }

  if(param.firstTime){
    eles.data(param.dataType, param.data);
  }
  else {
    for(var i = 0; i < eles.length; i++){
      var ele = eles[i];
      ele.data(param.dataType, param.data[ele.id()]);
    }
  }
  
  cy.forceRender();

  if (_.isEqual(eles, cy.nodes(':selected'))) {
    handleSBGNInspector();
  }

  return result;
}

function changeStyleCss(param) {
  var result = {
  };
  var eles = param.eles;
  result.dataType = param.dataType;
  result.data = {};
  result.eles = eles;

  for(var i = 0; i < eles.length; i++){
    var ele = eles[i];
    result.data[ele.id()] = ele.css(param.dataType);
  }

  if(param.firstTime){
    eles.css(param.dataType, param.data);
  }
  else {
    for(var i = 0; i < eles.length; i++){
      var ele = eles[i];
      ele.css(param.dataType, param.data[ele.id()]);
    }
  }
  cy.forceRender();

  if (_.isEqual(eles, cy.nodes(':selected'))) {
    handleSBGNInspector();
  }

  return result;
}

function changeBendPoints(param){
  var edge = param.edge;
  var result = {
    edge: edge,
    weights: param.set?edge.data('weights'):param.weights,
    distances: param.set?edge.data('distances'):param.distances,
    set: true//As the result will not be used for the first function call params should be used to set the data
  };
  
  //Check if we need to set the weights and distances by the param values
  if(param.set) {
    param.weights?edge.data('weights', param.weights):edge.removeData('weights');
    param.distances?edge.data('distances', param.distances):edge.removeData('distances');
    
    //refresh the curve style as the number of bend point would be changed by the previous operation
    if(param.weights){
      edge.css('curve-style', 'segments');
    }
    else {
      edge.css('curve-style', 'bezier');
    }
  }
  
  return result;
}

/*
 *	Base command class
 * do: reference to the function that performs actual action for this command.
 * undo: reference to the action that is reverse of this action's command.
 * params: additional parameters for this command
 */
var Command = function (_do, undo, params) {
  this._do = _do;
  this.undo = undo;
  this.params = params;
};

var AddNodeCommand = function (newNode)
{
  return new Command(addNode, removeNodes, newNode);
};

//var RemoveNodesCommand = function (nodesTobeDeleted)
//{
//  return new Command(removeNodes, restoreEles, nodesTobeDeleted);
//};

var RemoveElesCommand = function (elesTobeDeleted)
{
  return new Command(removeEles, restoreEles, elesTobeDeleted);
};

var AddEdgeCommand = function (newEdge)
{
  return new Command(addEdge, removeEdges, newEdge);
};

//var RemoveEdgesCommand = function (edgesTobeDeleted)
//{
//  return new Command(removeEdges, restoreEles, edgesTobeDeleted);
//};

var ExpandNodeCommand = function (param) {
  return new Command(expandNode, undoExpandNode, param);
};

var CollapseNodeCommand = function (param) {
  return new Command(collapseNode, undoCollapseNode, param);
};

var SimpleExpandNodeCommand = function (node) {
  return new Command(simpleExpandNode, simpleCollapseNode, node);
};

var SimpleCollapseNodeCommand = function (node) {
  return new Command(simpleCollapseNode, simpleExpandNode, node);
};

var ExpandGivenNodesCommand = function (param) {
  return new Command(expandGivenNodes, undoExpandGivenNodes, param);
};

var CollapseGivenNodesCommand = function (param) {
  return new Command(collapseGivenNodes, undoCollapseGivenNodes, param);
};

var SimpleExpandGivenNodesCommand = function (nodes) {
  return new Command(simpleExpandGivenNodes, simpleCollapseGivenNodes, nodes);
};

var SimpleCollapseGivenNodesCommand = function (nodes) {
  return new Command(simpleCollapseGivenNodes, simpleExpandGivenNodes, nodes);
};

var SimpleExpandAllNodesCommand = function (param) {
  return new Command(simpleExpandAllNodes, undoExpandAllNodes, param);
};

var ExpandAllNodesCommand = function (param) {
  return new Command(expandAllNodes, undoExpandAllNodes, param);
};

var ReturnToPositionsAndSizesCommand = function (nodesData) {
  return new Command(returnToPositionsAndSizesConditionally, returnToPositionsAndSizes, nodesData);
};

var MoveNodeCommand = function (param) {
  return new Command(moveNodesConditionally, moveNodesReversely, param);
};

var DeleteSelectedCommand = function (param) {
  return new Command(deleteSelected, restoreSelected, param);
};

var HideSelectedCommand = function (param) {
  return new Command(hideSelected, showJustGivenNodes, param);
};

var ShowSelectedCommand = function (param) {
  return new Command(showSelected, showJustGivenNodes, param);
};

var ShowAllCommand = function () {
  return new Command(showAll, showJustGivenNodes);
};

var HighlightNeighborsofSelectedCommand = function (param) {
  param.highlightNeighboursofSelected = true;
  return new Command(highlightExtensionOfSelectedElements, removeHighlightOfElements, param);
};

var HighlightProcessesOfSelectedCommand = function (param) {
  param.highlightProcessesOfSelected = true;
  return new Command(highlightExtensionOfSelectedElements, removeHighlightOfElements, param);
};

var RemoveHighlightsCommand = function () {
  return new Command(removeHighlights, highlightExtensionOfSelectedElements);
};

var CreateCompundForSelectedNodesCommand = function (param) {
  return new Command(createCompoundForSelectedNodes, removeCompound, param);
};

var ResizeNodeCommand = function (param) {
  return new Command(resizeNode, resizeNode, param);
};

var ChangeNodeLabelCommand = function (param) {
  return new Command(changeNodeLabel, changeNodeLabel, param);
};

var AddStateAndInfoCommand = function (param) {
  return new Command(addStateAndInfo, removeStateAndInfo, param);
};

var RemoveStateAndInfoCommand = function (param) {
  return new Command(removeStateAndInfo, addStateAndInfo, param);
};

var ChangeStateVariableCommand = function (param) {
  return new Command(changeStateVariable, changeStateVariable, param);
};

var ChangeUnitOfInformationCommand = function (param) {
  return new Command(changeUnitOfInformation, changeUnitOfInformation, param);
};

var ChangeStyleDataCommand = function (param) {
  return new Command(changeStyleData, changeStyleData, param);
};

var ChangeStyleCssCommand = function (param) {
  return new Command(changeStyleCss, changeStyleCss, param);
};

var changeIsMultimerStatusCommand = function (param) {
  return new Command(changeIsMultimerStatus, changeIsMultimerStatus, param);
};

var changeIsCloneMarkerStatusCommand = function (param) {
  return new Command(changeIsCloneMarkerStatus, changeIsCloneMarkerStatus, param);
};

var changeParentCommand = function (param) {
  return new Command(changeParent, changeParent, param);
};

var changeBendPointsCommand = function (param) {
  return new Command(changeBendPoints, changeBendPoints, param);
};

var CloneGivenElementsCommand = function(param) {
  return new Command(cloneGivenElements, removeEles, param);
};

var CreateTemplateReactionCommand = function(param) {
  return new Command(createTemplateReaction, removeEles, param);
};

/**
 *  Description: A simple action manager that acts also as a undo-redo manager regarding Command Design Pattern
 *	Author: Istemi Bahceci<istemi.bahceci@gmail.com>
 */
function EditorActionsManager()
{
  this.undoStack = [];
  this.redoStack = [];

  /*
   *  Executes given command by calling do method of given command
   *  pushes the action to the undoStack after execution.
   */
  this._do = function (command)
  {
    //_do function returns the parameters for undo function
    command.undoparams = command._do(command.params);
    this.undoStack.push(command);
  };

  /*
   *  Undo last command.
   *  Pushes the reversed action to the redoStack after undo operation.
   */
  this.undo = function ()
  {
    if (this.undoStack.length == 0) {
      return;
    }
    var lastCommand = this.undoStack.pop();
    var result = lastCommand.undo(lastCommand.undoparams);
    //If undo function returns something then do function params should be refreshed
    if (result != null) {
      lastCommand.params = result;
    }
    this.redoStack.push(lastCommand);
  };

  /*
   *  Redo last command that is previously undid.
   *  This method basically calls do method for the last command that is popped of the redoStack.
   */
  this.redo = function ()
  {
    if (this.redoStack.length == 0) {
      return;
    }
    var lastCommand = this.redoStack.pop();
    this._do(lastCommand);
  };

  /*
   * 
   * This method indicates whether the undo stack is empty
   */
  this.isUndoStackEmpty = function () {
    return this.undoStack.length == 0;
  }

  /*
   * 
   * This method indicates whether the redo stack is empty
   */
  this.isRedoStackEmpty = function () {
    return this.redoStack.length == 0;
  }

  /*
   *  Empties undo and redo stacks !
   */
  this.reset = function ()
  {
    this.undoStack = [];
    this.redoStack = [];
  };
}
var editorActionsManager = new EditorActionsManager();

/*
 *  A sample run that gives insight about the usage of EditorActionsManager and commands
 */
function sampleRun()
{
  var editorActionsManager = new EditorActionsManager();

  // issue commands
  editorActionsManager._do(new AddNodeCommand(newNode));

  // undo redo mechanism
  editorActionsManager.undo();
  editorActionsManager.redo();

}