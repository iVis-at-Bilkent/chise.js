var elementUtilities = {
  processTypes: ['process', 'omitted process', 'uncertain process',
    'association', 'dissociation', 'phenotype'],
  defaultSizes: {
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
  },
  defaultFontProperties: {
    fontfamily: 'Helvetica',
    fontweight: 'normal',
    fontstyle: 'normal'
  },
  getDefaultLabelSize: function (sbgnclass) {
    if (!elementUtilities.canHaveSBGNLabel(sbgnclass)) {
      return undefined;
    }
    else if (sbgnclass === 'complex' || sbgnclass === 'compartment') {
      return 16;
    }
    else {
      return 20;
    }
  },
  //the list of the element classes handled by the tool
  handledElements: {'unspecified entity': true, 'simple chemical': true, 'macromolecule': true,
    'nucleic acid feature': true, 'perturbing agent': true, 'source and sink': true,
    'complex': true, 'process': true, 'omitted process': true, 'uncertain process': true,
    'association': true, 'dissociation': true, 'phenotype': true,
    'tag': true, 'consumption': true, 'production': true, 'modulation': true,
    'stimulation': true, 'catalysis': true, 'inhibition': true, 'necessary stimulation': true,
    'logic arc': true, 'equivalence arc': true, 'and operator': true,
    'or operator': true, 'not operator': true, 'and': true, 'or': true, 'not': true,
    'nucleic acid feature multimer': true, 'macromolecule multimer': true,
    'simple chemical multimer': true, 'complex multimer': true, 'compartment': true},
  // Section Start
  // General Element Utilities

  //this method returns the nodes non of whose ancestors is not in given nodes
  getTopMostNodes: function (nodes) {
    var nodesMap = {};
    for (var i = 0; i < nodes.length; i++) {
      nodesMap[nodes[i].id()] = true;
    }
    var roots = nodes.filter(function (i, ele) {
      var parent = ele.parent()[0];
      while (parent != null) {
        if (nodesMap[parent.id()]) {
          return false;
        }
        parent = parent.parent()[0];
      }
      return true;
    });

    return roots;
  },
  //This method checks if all of the given nodes have the same parent assuming that the size 
  //of  nodes is not 0
  allHaveTheSameParent: function (nodes) {
    if (nodes.length == 0) {
      return true;
    }
    var parent = nodes[0].data("parent");
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.data("parent") != parent) {
        return false;
      }
    }
    return true;
  },
  //This method propogates given replacement to the children of the given node recursively
  propogateReplacementToChildren: function (node, dx, dy) {
    var children = node.children();
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      child.position({
        x: child.position('x') + dx,
        y: child.position('y') + dy
      });

      this.propogateReplacementToChildren(child, dx, dy);
    }
  },
  moveNodes: function (positionDiff, nodes, notCalcTopMostNodes) {
    var topMostNodes = notCalcTopMostNodes ? nodes : this.getTopMostNodes(nodes);
    for (var i = 0; i < topMostNodes.length; i++) {
      var node = topMostNodes[i];
      var oldX = node.position("x");
      var oldY = node.position("y");
      node.position({
        x: oldX + positionDiff.x,
        y: oldY + positionDiff.y
      });
      var children = node.children();
      this.moveNodes(positionDiff, children, true);
    }
  },
  convertToModelPosition: function (renderedPosition) {
    var pan = cy.pan();
    var zoom = cy.zoom();

    var x = (renderedPosition.x - pan.x) / zoom;
    var y = (renderedPosition.y - pan.y) / zoom;

    return {
      x: x,
      y: y
    };
  },
  // Section End
  // General Element Utilities

  // Section Start
  // Element Filtering Utilities

  getProcessesOfSelected: function () {
    var selectedEles = cy.elements(":selected");
    return this.getProcessesOfGivenEles(selectedEles);
  },
  getNeighboursOfSelected: function () {
    var selectedEles = cy.elements(":selected");
    return this.getNeighboursOfGivenEles(selectedEles);
  },
  getProcessesOfGivenEles: function (eles) {
    var processesOfGivenEles = eles;
    processesOfGivenEles = this.extendNodeList(processesOfGivenEles);
    return processesOfGivenEles;
  },
  getNeighboursOfGivenEles: function (eles) {
    var neighbourOfGivenEles = eles;
    neighbourOfGivenEles = neighbourOfGivenEles.add(neighbourOfGivenEles.parents("node[sbgnclass='complex']"));
    neighbourOfGivenEles = neighbourOfGivenEles.add(neighbourOfGivenEles.descendants());
    var neighborhoodEles = neighbourOfGivenEles.neighborhood();
    var result = neighbourOfGivenEles.add(neighborhoodEles);
    result = result.add(result.descendants());
    return result;
  },
  extendNodeList: function (nodesToShow) {
    var self = this;
    //add children
    nodesToShow = nodesToShow.add(nodesToShow.nodes().descendants());
    //add parents
    nodesToShow = nodesToShow.add(nodesToShow.parents());
    //add complex children
    nodesToShow = nodesToShow.add(nodesToShow.nodes("node[sbgnclass='complex']").descendants());

    // var processes = nodesToShow.nodes("node[sbgnclass='process']");
    // var nonProcesses = nodesToShow.nodes("node[sbgnclass!='process']");
    // var neighborProcesses = nonProcesses.neighborhood("node[sbgnclass='process']");

    var processes = nodesToShow.filter(function () {
      return $.inArray(this._private.data.sbgnclass, self.processTypes) >= 0;
    });
    var nonProcesses = nodesToShow.filter(function () {
      return $.inArray(this._private.data.sbgnclass, self.processTypes) === -1;
    });
    var neighborProcesses = nonProcesses.neighborhood().filter(function () {
      return $.inArray(this._private.data.sbgnclass, self.processTypes) >= 0;
    });

    nodesToShow = nodesToShow.add(processes.neighborhood());
    nodesToShow = nodesToShow.add(neighborProcesses);
    nodesToShow = nodesToShow.add(neighborProcesses.neighborhood());

    //add parents
    nodesToShow = nodesToShow.add(nodesToShow.nodes().parents());
    //add children
    nodesToShow = nodesToShow.add(nodesToShow.nodes("node[sbgnclass='complex']").descendants());

    return nodesToShow;
  },
  extendRemainingNodes: function (nodesToFilter, allNodes) {
    nodesToFilter = this.extendNodeList(nodesToFilter);
    var nodesToShow = allNodes.not(nodesToFilter);
    nodesToShow = this.extendNodeList(nodesToShow);
    return nodesToShow;
  },
  noneIsNotHighlighted: function () {
    var notHighlightedNodes = cy.nodes(":visible").nodes(".unhighlighted");
    var notHighlightedEdges = cy.edges(":visible").edges(".unhighlighted");

    return notHighlightedNodes.length + notHighlightedEdges.length === 0;
  },
  // Section End
  // Element Filtering Utilities

  // Section Start
  // Add remove utilities

  addNode: function (x, y, sbgnclass, parent, visibility) {
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
    if (defaults && defaults['sbgnclonemarker']) {
      newNode._private.data.sbgnclonemarker = defaults.sbgnclonemarker;
    }

    newNode.addClass('changeBorderColor');
    newNode.addClass('changeBackgroundOpacity');

    refreshPaddings();
    return newNode;
  },
  addEdge: function (source, target, sbgnclass, visibility) {
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
  },
  restoreEles: function (eles) {
    eles.restore();
    return eles;
  },
  deleteElesSimple: function (eles) {
    cy.elements().unselect();
    return eles.remove();
  },
  deleteElesSmart: function (eles) {
    var allNodes = cy.nodes();
    cy.elements().unselect();
    var nodesToKeep = this.extendRemainingNodes(eles, allNodes);
    var nodesNotToKeep = allNodes.not(nodesToKeep);
    return nodesNotToKeep.remove();
  },
  // Section End
  // Add remove utilities

  // Section Start
  // Common element properties

  getCommonSBGNClass: function (elements) {
    if (elements.length < 1) {
      return "";
    }

    var SBGNClassOfFirstElement = elements[0].data('sbgnclass');
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].data('sbgnclass') != SBGNClassOfFirstElement) {
        return "";
      }
    }

    return SBGNClassOfFirstElement;
  },
  allAreNode: function (elements) {
    for (var i = 0; i < elements.length; i++) {
      var ele = elements[i];
      if (!ele.isNode()) {
        return false;
      }
    }

    return true;
  },
  allAreEdge: function (elements) {
    for (var i = 0; i < elements.length; i++) {
      var ele = elements[i];
      if (!ele.isEdge()) {
        return false;
      }
    }

    return true;
  },
  allCanHaveStateVariable: function (elements) {
    for (var i = 0; i < elements.length; i++) {
      var ele = elements[i];
      if (!elementUtilities.canHaveStateVariable(ele.data('sbgnclass'))) {
        return false;
      }
    }

    return true;
  },
  allCanHaveUnitOfInformation: function (elements) {
    for (var i = 0; i < elements.length; i++) {
      var ele = elements[i];
      if (!elementUtilities.canHaveUnitOfInformation(ele.data('sbgnclass'))) {
        return false;
      }
    }

    return true;
  },
  getCommonStateAndInfos: function (elements) {
    if (elements.length == 0) {
      return [];
    }

    var firstStateOrInfo = elements[0]._private.data.sbgnstatesandinfos;
    for (var i = 1; i < elements.length; i++) {
      if (!_.isEqual(elements[i]._private.data.sbgnstatesandinfos, firstStateOrInfo)) {
        return null;
      }
    }

    return firstStateOrInfo;
  },
  allCanBeCloned: function (elements) {
    for (var i = 0; i < elements.length; i++) {
      var ele = elements[i];
      if (!elementUtilities.canBeCloned(ele.data('sbgnclass'))) {
        return false;
      }
    }

    return true;
  },
  allCanBeMultimer: function (elements) {
    for (var i = 0; i < elements.length; i++) {
      var ele = elements[i];
      if (!elementUtilities.canBeMultimer(ele.data('sbgnclass'))) {
        return false;
      }
    }

    return true;
  },
  getCommonIsCloned: function (elements) {
    if (elements.length == 0) {
      return null;
    }

    var firstElementIsCloned = elements[0].data('sbgnclonemarker');
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].data('sbgnclonemarker') != firstElementIsCloned) {
        return null;
      }
    }

    return firstElementIsCloned;
  },
  getCommonIsMultimer: function (elements) {
    if (elements.length == 0) {
      return null;
    }

    var firstElementIsMultimer = elements[0].data('sbgnclass').endsWith(' multimer');
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].data('sbgnclass').endsWith(' multimer') != firstElementIsMultimer) {
        return null;
      }
    }

    return firstElementIsMultimer;
  },
  getCommonLabel: function (elements) {
    if (elements.length == 0) {
      return null;
    }

    var labelOfFirstElement = elements[0].data('sbgnlabel');
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].data('sbgnlabel') != labelOfFirstElement) {
        return null;
      }
    }

    return labelOfFirstElement;
  },
  getCommonBorderColor: function (elements) {
    if (elements.length == 0) {
      return null;
    }

    var borderColorOfFirstElement = elements[0].data('borderColor');
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].data('borderColor') != borderColorOfFirstElement) {
        return null;
      }
    }

    return borderColorOfFirstElement;
  },
  getCommonFillColor: function (elements) {
    if (elements.length == 0) {
      return null;
    }

    var fillColorOfFirstElement = elements[0].css('background-color');
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].css('background-color') != fillColorOfFirstElement) {
        return null;
      }
    }

    return fillColorOfFirstElement;
  },
  getCommonBorderWidth: function (elements) {
    if (elements.length == 0) {
      return null;
    }

    var borderWidthOfFirstElement = elements[0].css('border-width');
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].css('border-width') != borderWidthOfFirstElement) {
        return null;
      }
    }

    return borderWidthOfFirstElement;
  },
  getCommonBackgroundOpacity: function (elements) {
    if (elements.length == 0) {
      return null;
    }

    var backgroundOpacityOfFirstElement = elements[0].data('backgroundOpacity');
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].data('backgroundOpacity') != backgroundOpacityOfFirstElement) {
        return null;
      }
    }

    return backgroundOpacityOfFirstElement;
  },
  getCommonLineColor: function (elements) {
    if (elements.length == 0) {
      return null;
    }

    var lineColorOfFirstElement = elements[0].data('lineColor');
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].data('lineColor') != lineColorOfFirstElement) {
        return null;
      }
    }

    return lineColorOfFirstElement;
  },
  getCommonLineWidth: function (elements) {
    if (elements.length == 0) {
      return null;
    }

    var lineWidthOfFirstElement = elements[0].css('width');
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].css('width') != lineWidthOfFirstElement) {
        return null;
      }
    }

    return lineWidthOfFirstElement;
  },
  getCommonSBGNCardinality: function (elements) {
    if (elements.length == 0) {
      return undefined;
    }

    var cardinalityOfFirstElement = elements[0].data('sbgncardinality');
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].data('sbgncardinality') != cardinalityOfFirstElement) {
        return undefined;
      }
    }

    return cardinalityOfFirstElement;
  },
  canHaveSBGNCardinality: function (ele) {
    return ele.data('sbgnclass') == 'consumption' || ele.data('sbgnclass') == 'production';
  },
  canHaveSBGNLabel: function (ele) {
    var sbgnclass = typeof ele === 'string' ? ele : ele.data('sbgnclass');

    return sbgnclass != 'and' && sbgnclass != 'or' && sbgnclass != 'not'
            && sbgnclass != 'association' && sbgnclass != 'dissociation' && !sbgnclass.endsWith('process');
  },
  allCanHaveSBGNCardinality: function (elements) {
    for (var i = 0; i < elements.length; i++) {
      if (!elementUtilities.canHaveSBGNCardinality(elements[i])) {
        return false;
      }
    }

    return true;
  },
  allCanHaveSBGNLabel: function (elements) {
    for (var i = 0; i < elements.length; i++) {
      if (!elementUtilities.canHaveSBGNLabel(elements[i])) {
        return false;
      }
    }

    return true;
  },
  getCommonNodeWidth: function (elements) {
    if (elements.length == 0) {
      return null;
    }

    var widthOfFirstElement = elements[0].width();
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].width() != widthOfFirstElement) {
        return null;
      }
    }

    return widthOfFirstElement;
  },
  getCommonNodeHeight: function (elements) {
    if (elements.length == 0) {
      return null;
    }

    var heightOfFirstElement = elements[0].height();
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].height() != heightOfFirstElement) {
        return null;
      }
    }

    return heightOfFirstElement;
  },
  
  canHaveUnitOfInformation: function (sbgnclass) {
    if (sbgnclass == 'simple chemical'
            || sbgnclass == 'macromolecule' || sbgnclass == 'nucleic acid feature'
            || sbgnclass == 'complex' || sbgnclass == 'simple chemical multimer'
            || sbgnclass == 'macromolecule multimer' || sbgnclass == 'nucleic acid feature multimer'
            || sbgnclass == 'complex multimer') {
      return true;
    }
    return false;
  },
  canHaveStateVariable: function (sbgnclass) {
    if (sbgnclass == 'macromolecule' || sbgnclass == 'nucleic acid feature'
            || sbgnclass == 'complex'
            || sbgnclass == 'macromolecule multimer' || sbgnclass == 'nucleic acid feature multimer'
            || sbgnclass == 'complex multimer') {
      return true;
    }
    return false;
  },
  mustBeSquare: function (sbgnclass) {
    return (sbgnclass.indexOf('process') != -1 || sbgnclass == 'source and sink'
            || sbgnclass == 'and' || sbgnclass == 'or' || sbgnclass == 'not'
            || sbgnclass == 'association' || sbgnclass == 'dissociation');
  },
  someMustNotBeSquare: function (nodes) {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (!elementUtilities.mustBeSquare(node.data('sbgnclass'))) {
        return true;
      }
    }

    return false;
  },
  isParent: function (node) {
    return (node.children() && node.children().length > 0);
  },
  includesParentElement: function (nodes) {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (!elementUtilities.isParent(node)) {
        return true;
      }
    }

    return false;
  },
//checks if a node with the given sbgnclass can be cloned
  canBeCloned: function (_sbgnclass) {
    var sbgnclass = _sbgnclass.replace(" multimer", "");
    var list = {
      'unspecified entity': true,
      'macromolecule': true,
      'complex': true,
      'nucleic acid feature': true,
      'simple chemical': true,
      'perturbing agent': true
    };

    return list[sbgnclass] ? true : false;
  },
//checks if a node with the given sbgnclass can become a multimer
  canBeMultimer: function (_sbgnclass) {
    var sbgnclass = _sbgnclass.replace(" multimer", "");
    var list = {
      'macromolecule': true,
      'complex': true,
      'nucleic acid feature': true,
      'simple chemical': true
    };

    return list[sbgnclass] ? true : false;
  },
  isEPNClass: function (_sbgnclass) {
    var sbgnclass = _sbgnclass.replace(" multimer", "");
    return (sbgnclass == 'unspecified entity'
            || sbgnclass == 'simple chemical'
            || sbgnclass == 'macromolecule'
            || sbgnclass == 'nucleic acid feature'
            || sbgnclass == 'complex');
  },
  isPNClass: function (sbgnclass) {
    return (sbgnclass == 'process'
            || sbgnclass == 'omitted process'
            || sbgnclass == 'uncertain process'
            || sbgnclass == 'association'
            || sbgnclass == 'dissociation'
            || sbgnclass == 'phenotype');
  },
  isLogicalOperator: function (sbgnclass) {
    return (sbgnclass == 'and' || sbgnclass == 'or' || sbgnclass == 'not');
  },
  convenientToEquivalence: function (sbgnclass) {
    return (sbgnclass == 'tag' || sbgnclass == 'terminal');
  },
  getCommonLabelFontSize: function (elements) {
    if (elements.length == 0) {
      return null;
    }

    var labelSizeOfFirstElement = elements[0].data('labelsize');
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].data('labelsize') != labelSizeOfFirstElement) {
        return null;
      }
    }

    return labelSizeOfFirstElement;
  },
  getCommonLabelFontFamily: function (elements) {
    if (elements.length == 0) {
      return null;
    }

    var fontFamilyOfFirstElement = elements[0].data('fontfamily');
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].data('fontfamily') != fontFamilyOfFirstElement) {
        return null;
      }
    }

    return fontFamilyOfFirstElement;
  },
  getCommonLabelFontWeight: function (elements) {
    if (elements.length == 0) {
      return null;
    }

    var fontWeightOfFirstElement = elements[0].data('fontweight');
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].data('fontweight') != fontWeightOfFirstElement) {
        return null;
      }
    }

    return fontWeightOfFirstElement;
  },
  getCommonLabelFontStyle: function (elements) {
    if (elements.length == 0) {
      return null;
    }

    var fontStyleOfFirstElement = elements[0].data('fontstyle');
    for (var i = 1; i < elements.length; i++) {
      if (elements[i].data('fontstyle') != fontStyleOfFirstElement) {
        return null;
      }
    }

    return fontStyleOfFirstElement;
  },
  // Section End
  // Common element properties
  
  // Section Start
  // Stylesheet helpers

  getCyShape: function (ele) {
    var shape = ele.data('sbgnclass');
    if (shape.endsWith(' multimer')) {
      shape = shape.replace(' multimer', '');
    }

    if (shape == 'compartment') {
      return 'roundrectangle';
    }
    if (shape == 'phenotype') {
      return 'hexagon';
    }
    if (shape == 'perturbing agent' || shape == 'tag') {
      return 'polygon';
    }
    if (shape == 'source and sink' || shape == 'nucleic acid feature' || shape == 'dissociation'
            || shape == 'macromolecule' || shape == 'simple chemical' || shape == 'complex'
            || shape == 'unspecified entity' || shape == 'process' || shape == 'omitted process'
            || shape == 'uncertain process' || shape == 'association') {
      return shape;
    }
    return 'ellipse';
  },
  getCyArrowShape: function (ele) {
    var sbgnclass = ele.data('sbgnclass');
    if (sbgnclass == 'necessary stimulation') {
      return 'necessary stimulation';
//    return 'triangle-tee';
    }
    if (sbgnclass == 'inhibition') {
      return 'tee';
    }
    if (sbgnclass == 'catalysis') {
      return 'circle';
    }
    if (sbgnclass == 'stimulation' || sbgnclass == 'production') {
      return 'triangle';
    }
    if (sbgnclass == 'modulation') {
      return 'diamond';
    }
    return 'none';
  },
  getElementContent: function (ele) {
    var sbgnclass = ele.data('sbgnclass');

    if (sbgnclass.endsWith(' multimer')) {
      sbgnclass = sbgnclass.replace(' multimer', '');
    }

    var content = "";
    if (sbgnclass == 'macromolecule' || sbgnclass == 'simple chemical'
            || sbgnclass == 'phenotype'
            || sbgnclass == 'unspecified entity' || sbgnclass == 'nucleic acid feature'
            || sbgnclass == 'perturbing agent' || sbgnclass == 'tag') {
      content = ele.data('sbgnlabel') ? ele.data('sbgnlabel') : "";
    }
    else if (sbgnclass == 'compartment') {
      content = ele.data('sbgnlabel') ? ele.data('sbgnlabel') : "";
    }
    else if (sbgnclass == 'complex') {
      if (ele.children().length == 0) {
        if (ele.data('sbgnlabel')) {
          content = ele.data('sbgnlabel');
        }
        else if (ele.data('infoLabel')) {
          content = ele.data('infoLabel');
        }
        else {
          content = '';
        }
      }
      else {
        content = '';
      }
    }
    else if (sbgnclass == 'and') {
      return 'AND';
    }
    else if (sbgnclass == 'or') {
      return 'OR';
    }
    else if (sbgnclass == 'not') {
      return 'NOT';
    }
    else if (sbgnclass == 'omitted process') {
      return '\\\\';
    }
    else if (sbgnclass == 'uncertain process') {
      return '?';
    }
    else if (sbgnclass == 'dissociation') {
      return 'O';
    }

    var textWidth = ele.css('width') ? parseFloat(ele.css('width')) : ele.data('sbgnbbox').w;

    var textProp = {
      label: content,
      width: (sbgnclass == ('complex') || sbgnclass == ('compartment')) ? textWidth * 2 : textWidth
    };

    var font = elementUtilities.getLabelTextSize(ele) + "px Arial";
    return truncateText(textProp, font);
  },
  getLabelTextSize: function (ele) {
    var sbgnclass = ele.data('sbgnclass');

    // These types of nodes cannot have label but this is statement is needed as a workaround
    if (sbgnclass === 'association' || sbgnclass === 'dissociation') {
      return 20;
    }

    if (sbgnclass === 'and' || sbgnclass === 'or' || sbgnclass === 'not') {
      return elementUtilities.getDynamicLabelTextSize(ele, 1);
    }

    if (sbgnclass.endsWith('process')) {
      return elementUtilities.getDynamicLabelTextSize(ele, 1.5);
    }

    if (sbgnclass === 'complex' || sbgnclass === 'compartment' || !sbgnStyleRules['adjust-node-label-font-size-automatically']) {
      return ele.data('labelsize');
    }

    return elementUtilities.getDynamicLabelTextSize(ele);
  },
  /*
   * calculates the dynamic label size for the given node
   */
  getDynamicLabelTextSize: function (ele, dynamicLabelSizeCoefficient) {
    var dynamicLabelSize = sbgnStyleRules['dynamic-label-size'];

    if (dynamicLabelSizeCoefficient === undefined) {
      if (dynamicLabelSize == 'small') {
        dynamicLabelSizeCoefficient = 0.75;
      }
      else if (dynamicLabelSize == 'regular') {
        dynamicLabelSizeCoefficient = 1;
      }
      else if (dynamicLabelSize == 'large') {
        dynamicLabelSizeCoefficient = 1.25;
      }
    }

    //This line will be useless and is to be removed later
//  dynamicLabelSizeCoefficient = dynamicLabelSizeCoefficient ? dynamicLabelSizeCoefficient : 1;

//  var h = ele.css('height') ? parseInt(ele.css('height')) : ele.data('sbgnbbox').h;
    var h = ele.height();
    var textHeight = parseInt(h / 2.45) * dynamicLabelSizeCoefficient;

    return textHeight;
  },
  getCardinalityDistance: function (ele) {
    var srcPos = ele.source().position();
    var tgtPos = ele.target().position();

    var distance = Math.sqrt(Math.pow((srcPos.x - tgtPos.x), 2) + Math.pow((srcPos.y - tgtPos.y), 2));
    return distance * 0.15;
  }

  // Section End
  // Stylesheet helpers
};

