var addRemoveActionFunctions = {
  addNode: function (param) {
    var result;
    if (param.firstTime) {
      var newNode = param.newNode;
      result = addRemoveUtilities.addNode(newNode.x, newNode.y, newNode.sbgnclass);
    }
    else {
      result = addRemoveUtilities.restoreEles(param);
    }
    return result;
  },
  removeNodes: function (nodesToBeDeleted) {
    return addRemoveUtilities.removeNodes(nodesToBeDeleted);
  },
  removeEles: function (elesToBeRemoved) {
    return addRemoveUtilities.removeEles(elesToBeRemoved);
  },
  restoreEles: function (eles) {
    return addRemoveUtilities.restoreEles(eles);
  },
  addEdge: function (param) {
    var result;
    if (param.firstTime) {
      var newEdge = param.newEdge;
      result = addRemoveUtilities.addEdge(newEdge.source, newEdge.target, newEdge.sbgnclass);
    }
    else {
      result = addRemoveUtilities.restoreEles(param);
    }
    return result;
  },
  removeEdges: function (edgesToBeDeleted) {
    return addRemoveUtilities.removeEdges(edgesToBeDeleted);
  },
  restoreSelected: function (eles) {
    var param = {};
    param.eles = addRemoveUtilities.restoreEles(eles);
    param.firstTime = false;
    return param;
  },
  changeParent: function (param) {
    var result = {
    };
    var nodes = param.nodes;


    result.posDiffX = -1 * param.posDiffX;
    result.posDiffY = -1 * param.posDiffY;

    result.parentData = {}; // For undo / redo cases it keeps the previous parent info per node

    // Fill parent data
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      result.parentData[node.id()] = node.data('parent');
    }
    
    var newParentId;
    
    if (param.firstTime) {
      newParentId = param.parentData == undefined ? null : param.parentData;
      nodes = nodes.move({"parent": newParentId});
      
      nodes = nodes.filter(function(i, ele) {
        return ele.isNode();
      });
    }
    else {
      var nodesMap = {};
      
      for ( var i = 0; i < nodes.length; i++ ) {
        nodesMap[nodes[i].id()] = true;
      }
      
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        
        newParentId = param.parentData[node.id()] == undefined ? null : param.parentData[node.id()];
        node = node.move({"parent": newParentId});
      }
      
      nodes = cy.nodes().filter(function(i, ele){
        return nodesMap[ele.id()];
      });
    }

    var posDiff = {
      x: param.posDiffX,
      y: param.posDiffY
    };
    
    sbgnElementUtilities.moveNodes(posDiff, nodes);

    refreshPaddings();
    result.nodes = nodes;

    return result;
  },
  /*
   * This method assumes that param.nodesToMakeCompound contains at least one node
   * and all of the nodes including in it have the same parent
   */
  createCompoundForSelectedNodes: function (param) {
    var nodesToMakeCompound = param.nodesToMakeCompound;
    var oldParentId = nodesToMakeCompound[0].data("parent");
    var newCompound;

    if (param.firstTime) {
      newCompound = addRemoveUtilities.addNode(undefined, undefined, param.compundType, oldParentId, true);
    }
    else {
      newCompound = param.removedCompund.restore();
    }

    var newCompoundId = newCompound.id();

    addRemoveUtilities.changeParent(nodesToMakeCompound, oldParentId, newCompoundId);

    return newCompound;
  },
  removeCompound: function (compoundToRemove) {
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
  },
  deleteSelected: function (param) {
    if (param.firstTime) {
      return sbgnFiltering.deleteSelected();
    }
    return addRemoveUtilities.removeElesSimply(param.eles);
  },
};