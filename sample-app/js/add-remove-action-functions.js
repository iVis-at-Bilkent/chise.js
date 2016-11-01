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
  /*
   * This method assumes that param.nodesToMakeCompound contains at least one node
   * and all of the nodes including in it have the same parent
   */
  createCompoundForSelectedNodes: function (param) {
    var nodesToMakeCompound = param.nodesToMakeCompound;
    var newCompound;

    // If this is a redo action refresh the nodes to make compound (We need this because after ele.move() references to eles changes)
    if (!param.firstTime) {
      var nodesToMakeCompoundIds = {};
      
      nodesToMakeCompound.each(function(i,ele){
        nodesToMakeCompoundIds[ele.id()] = true;
      });
      
      var allNodes = cy.nodes();
      
      nodesToMakeCompound = allNodes.filter(function(i,ele) {
        return nodesToMakeCompoundIds[ele.id()];
      });
    }

    if (param.firstTime) {
      var oldParentId = nodesToMakeCompound[0].data("parent");
      // The parent of new compound will be the old parent of the nodes to make compound
      newCompound = addRemoveUtilities.addNode(undefined, undefined, param.compundType, oldParentId, true);
    }
    else {
      newCompound = param.removedCompund.restore();
    }

    var newCompoundId = newCompound.id();

    nodesToMakeCompound.move({parent: newCompoundId});

    refreshPaddings();

    return newCompound;
  },
  removeCompound: function (compoundToRemove) {
    var compoundId = compoundToRemove.id();
    var newParentId = compoundToRemove.data("parent");
    newParentId = newParentId === undefined ? null : newParentId;
    var childrenOfCompound = compoundToRemove.children();

    childrenOfCompound.move({parent: newParentId});
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