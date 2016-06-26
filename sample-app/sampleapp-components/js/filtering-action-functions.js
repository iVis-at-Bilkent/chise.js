var filteringActionFunctions = {
  hideSelected: function (param) {
    var currentNodes = cy.nodes(":visible");

    if (currentNodes.length == 0) {
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
  },
  showSelected: function (param) {
    var currentNodes = cy.nodes(":visible");
    if (param.firstTime) {
      sbgnFiltering.showSelected();
    }
    else {
      sbgnFiltering.showJustGivenNodes(param.nodesToShow);
    }
    return currentNodes;
  },
  showAll: function () {
    var currentNodes = cy.nodes(":visible");
    sbgnFiltering.showAll();
    return currentNodes;
  },
  showJustGivenNodes: function (nodesToShow) {
    var param = {};
    param.nodesToShow = cy.nodes(":visible");
    param.firstTime = false;
    sbgnFiltering.showJustGivenNodes(nodesToShow);
    return param;
  },
  highlightExtensionOfSelectedElements: function (param) {
    var elementsToHighlight;
    var result = {};
    //If this is the first call of the function then call the original method
    if (param.firstTime) {
      if (sbgnFiltering.thereIsNoHighlightedElement()) {
        //mark that there was no highlighted element
        result.thereWasNoHighlightedElement = true;
      }

      var alreadyHighlighted = cy.elements("[highlighted='true']").filter(":visible");

      if (param.elesToHighlight) {
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
  },
  removeHighlightOfElements: function (param) {
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
  },
  removeHighlights: function () {
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
};