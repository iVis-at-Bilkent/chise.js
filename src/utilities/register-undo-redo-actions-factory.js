var libs = require('./lib-utilities').getLibs();
var $ = libs.jQuery;

module.exports = function () {

  var undoRedoActionFunctions, options, cy;

  var registerUndoRedoActions = function (param) {

    undoRedoActionFunctions = param.undoRedoActionFunctions;
    options = param.optionUtilities.getOptions();
    cy = param.sbgnvizInstanceUtilities.getCy();

    if (!options.undoable) {
      return;
    }

    // create undo-redo instance
    var ur = cy.undoRedo({
      undoableDrag: options.undoableDrag
    });

    // register add remove actions
    ur.action("addNode", undoRedoActionFunctions.addNode, undoRedoActionFunctions.deleteElesSimple);
    ur.action("deleteElesSimple", undoRedoActionFunctions.deleteElesSimple, undoRedoActionFunctions.restoreEles);
    ur.action("addEdge", undoRedoActionFunctions.addEdge, undoRedoActionFunctions.deleteElesSimple);
    ur.action("addProcessWithConvenientEdges", undoRedoActionFunctions.addProcessWithConvenientEdges, undoRedoActionFunctions.deleteElesSimple);
    ur.action("deleteElesSmart", undoRedoActionFunctions.deleteElesSmart, undoRedoActionFunctions.restoreEles);
    ur.action("createCompoundForGivenNodes", undoRedoActionFunctions.createCompoundForGivenNodes, undoRedoActionFunctions.createCompoundForGivenNodes);

    // register general actions
    ur.action("resizeNodes", undoRedoActionFunctions.resizeNodes, undoRedoActionFunctions.resizeNodes);
    ur.action("changeNodeLabel", undoRedoActionFunctions.changeNodeLabel, undoRedoActionFunctions.changeNodeLabel);
    ur.action("changeData", undoRedoActionFunctions.changeData, undoRedoActionFunctions.changeData);
    ur.action("updateSetField", undoRedoActionFunctions.updateSetField, undoRedoActionFunctions.updateSetField);
    ur.action("changeCss", undoRedoActionFunctions.changeCss, undoRedoActionFunctions.changeCss);
    ur.action("changeBendPoints", undoRedoActionFunctions.changeBendPoints, undoRedoActionFunctions.changeBendPoints);
    ur.action("changeFontProperties", undoRedoActionFunctions.changeFontProperties, undoRedoActionFunctions.changeFontProperties);
    ur.action("showAndPerformLayout", undoRedoActionFunctions.showAndPerformLayout, undoRedoActionFunctions.undoShowAndPerformLayout);
    ur.action("hideAndPerformLayout", undoRedoActionFunctions.hideAndPerformLayout, undoRedoActionFunctions.undoHideAndPerformLayout);

    // register SBGN actions
    ur.action("addStateOrInfoBox", undoRedoActionFunctions.addStateOrInfoBox, undoRedoActionFunctions.removeStateOrInfoBox);
    ur.action("changeStateOrInfoBox", undoRedoActionFunctions.changeStateOrInfoBox, undoRedoActionFunctions.changeStateOrInfoBox);
    ur.action("setMultimerStatus", undoRedoActionFunctions.setMultimerStatus, undoRedoActionFunctions.setMultimerStatus);
    ur.action("setCloneMarkerStatus", undoRedoActionFunctions.setCloneMarkerStatus, undoRedoActionFunctions.setCloneMarkerStatus);
    ur.action("removeStateOrInfoBox", undoRedoActionFunctions.removeStateOrInfoBox, undoRedoActionFunctions.addStateOrInfoBox);
    ur.action("fitUnits", undoRedoActionFunctions.fitUnits, undoRedoActionFunctions.restoreUnits);
    ur.action("addBackgroundImage", undoRedoActionFunctions.addBackgroundImage, undoRedoActionFunctions.removeBackgroundImage);
    ur.action("removeBackgroundImage", undoRedoActionFunctions.removeBackgroundImage, undoRedoActionFunctions.addBackgroundImage);
    ur.action("updateBackgroundImage", undoRedoActionFunctions.updateBackgroundImage, undoRedoActionFunctions.updateBackgroundImage);
    ur.action("changeBackgroundImage", undoRedoActionFunctions.changeBackgroundImage, undoRedoActionFunctions.changeBackgroundImage);
    ur.action("updateInfoboxStyle", undoRedoActionFunctions.updateInfoboxStyle, undoRedoActionFunctions.updateInfoboxStyle);
    ur.action("updateInfoboxObj", undoRedoActionFunctions.updateInfoboxObj, undoRedoActionFunctions.updateInfoboxObj);

    // register easy creation actions
    ur.action("createTemplateReaction", undoRedoActionFunctions.createTemplateReaction, undoRedoActionFunctions.deleteElesSimple);
    ur.action("setDefaultProperty", undoRedoActionFunctions.setDefaultProperty, undoRedoActionFunctions.setDefaultProperty);
    ur.action("convertIntoReversibleReaction", undoRedoActionFunctions.convertIntoReversibleReaction, undoRedoActionFunctions.convertIntoReversibleReaction);
  };

  return registerUndoRedoActions;
};
