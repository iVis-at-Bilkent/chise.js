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