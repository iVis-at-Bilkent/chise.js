var registerUndoRedoActions = function () {
  // create undo-redo instance
  var ur = cy.undoRedo({
    keyboardShortcuts: {
      ctrl_z: false, // undo
      ctrl_y: false, // redo
      ctrl_shift_z: false // redo
    },
    undoableDrag: function() {
      return window.ctrlKeyDown !== true;
    }
  });

  // register add remove actions
  ur.action("addNode", undoRedoActionFunctions.addNode, undoRedoActionFunctions.deleteElesSimple);
  ur.action("deleteElesSimple", undoRedoActionFunctions.deleteElesSimple, undoRedoActionFunctions.restoreEles);
  ur.action("addEdge", undoRedoActionFunctions.addEdge, undoRedoActionFunctions.deleteElesSimple);
  ur.action("deleteElesSmart", undoRedoActionFunctions.deleteElesSmart, undoRedoActionFunctions.restoreEles);
  ur.action("createCompoundForGivenNodes", undoRedoActionFunctions.createCompoundForGivenNodes, undoRedoActionFunctions.removeCompound);

  // register general actions
  ur.action("resizeNode", undoRedoActionFunctions.resizeNode, undoRedoActionFunctions.resizeNode);
  ur.action("changeNodeLabel", undoRedoActionFunctions.changeNodeLabel, undoRedoActionFunctions.changeNodeLabel);
  ur.action("changeStyleData", undoRedoActionFunctions.changeStyleData, undoRedoActionFunctions.changeStyleData);
  ur.action("changeStyleCss", undoRedoActionFunctions.changeStyleCss, undoRedoActionFunctions.changeStyleCss);
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