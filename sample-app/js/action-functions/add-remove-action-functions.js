var addRemoveActionFunctions = {
  addNode: function (param) {
    var result;
    if (param.firstTime) {
      var newNode = param.newNode;
      result = sbgnElementUtilities.addNode(newNode.x, newNode.y, newNode.sbgnclass);
    }
    else {
      result = sbgnElementUtilities.restoreEles(param);
    }
    return result;
  },
  removeNodes: function (nodesToBeDeleted) {
    return sbgnElementUtilities.removeNodes(nodesToBeDeleted);
  },
  deleteElesSimple: function (param) {
    return sbgnElementUtilities.deleteElesSimple(param.eles);
  },
  restoreEles: function (eles) {
    var param = {};
    param.eles = sbgnElementUtilities.restoreEles(eles);
    return param;
  },
  addEdge: function (param) {
    var result;
    if (param.firstTime) {
      var newEdge = param.newEdge;
      result = sbgnElementUtilities.addEdge(newEdge.source, newEdge.target, newEdge.sbgnclass);
    }
    else {
      result = sbgnElementUtilities.restoreEles(param);
    }
    return result;
  },
  removeEdges: function (edgesToBeDeleted) {
    return sbgnElementUtilities.removeEdges(edgesToBeDeleted);
  },
  restoreSelected: function (eles) {
    var param = {};
    param.eles = sbgnElementUtilities.restoreEles(eles);
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
      newCompound = sbgnElementUtilities.addNode(undefined, undefined, param.compundType, oldParentId, true);
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
  deleteElesSmart: function (param) {
    if (param.firstTime) {
      return sbgnElementUtilities.deleteElesSmart(param.eles);
    }
    return sbgnElementUtilities.removeElesSimply(param.eles);
  },
};