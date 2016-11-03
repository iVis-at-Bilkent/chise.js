var undoRedoActionFunctions = {
  // Section Start
  // add/remove action functions
  addNode: function (param) {
    var result;
    if (param.firstTime) {
      var newNode = param.newNode;
      result = sbgnElementUtilities.addNode(newNode.x, newNode.y, newNode.sbgnclass);
    }
    else {
      result = sbgnElementUtilities.restoreEles(param);
    }
    
    return {
      eles: result
    };
  },
  deleteElesSimple: function (param) {
    return sbgnElementUtilities.deleteElesSimple(param.eles);
  },
  deleteElesSmart: function (param) {
    if (param.firstTime) {
      return sbgnElementUtilities.deleteElesSmart(param.eles);
    }
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
    
    return {
      eles: result
    };
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
  
  // Section End
  // add/remove action functions
  
  // Section Start
  // easy creation action functions
  
  createTemplateReaction: function (param) {
    var firstTime = param.firstTime;
    var eles;

    if (firstTime) {
      var defaultMacromoleculProperties = sbgnElementUtilities.defaultSizes["macromolecule"];
      var templateType = param.templateType;
      var processWidth = sbgnElementUtilities.defaultSizes[templateType] ? sbgnElementUtilities.defaultSizes[templateType].width : 50;
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
      var process = sbgnElementUtilities.addNode(processPosition.x, processPosition.y, templateType);
      process.data('justAdded', true);

      //Define the starting y position
      var yPosition = processPosition.y - ((numOfMacromolecules - 1) / 2) * (macromoleculeHeight + tilingPaddingVertical);

      //Create the free macromolecules
      for (var i = 0; i < numOfMacromolecules; i++) {
        var newNode = sbgnElementUtilities.addNode(xPositionOfFreeMacromolecules, yPosition, "macromolecule");
        newNode.data('justAdded', true);
        newNode.data('sbgnlabel', macromoleculeList[i]);

        //create the edge connected to the new macromolecule
        var newEdge;
        if (templateType === 'association') {
          newEdge = sbgnElementUtilities.addEdge(newNode.id(), process.id(), 'consumption');
        }
        else {
          newEdge = sbgnElementUtilities.addEdge(process.id(), newNode.id(), 'production');
        }

        newEdge.data('justAdded', true);

        //update the y position
        yPosition += macromoleculeHeight + tilingPaddingVertical;
      }

      //Create the complex including macromolecules inside of it
      //Temprorarily add it to the process position we will move it according to the last size of it
      var complex = sbgnElementUtilities.addNode(processPosition.x, processPosition.y, 'complex');
      complex.data('justAdded', true);
      complex.data('justAddedLayoutNode', true);

      //If a name is specified for the complex set its label accordingly
      if (complexName) {
        complex.data('sbgnlabel', complexName);
      }

      //create the edge connnected to the complex
      var edgeOfComplex;
      if (templateType === 'association') {
        edgeOfComplex = sbgnElementUtilities.addEdge(process.id(), complex.id(), 'production');
      }
      else {
        edgeOfComplex = sbgnElementUtilities.addEdge(complex.id(), process.id(), 'consumption');
      }
      edgeOfComplex.data('justAdded', true);

      //Create the macromolecules inside the complex
      for (var i = 0; i < numOfMacromolecules; i++) {
        var newNode = sbgnElementUtilities.addNode(complex.position('x'), complex.position('y'), "macromolecule", complex.id());
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
          sbgnElementUtilities.moveNodes({x: positionDiffX, y: positionDiffY}, complex);
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
  },
  
  // Section End
  // easy creation action functions
  
  // Section Start
  // general action functions
  
  getNodePositionsAndSizes: function () {
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
  },
  returnToPositionsAndSizesConditionally: function (nodesData) {
    if (nodesData.firstTime) {
      delete nodesData.firstTime;
      return nodesData;
    }
    return this.returnToPositionsAndSizes(nodesData);
  },
  returnToPositionsAndSizes: function (nodesData) {
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
  },
  resizeNode: function (param) {
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
        }
        else {
          var ratio = undefined;
          var eleMustBeSquare = sbgnElementUtilities.mustBeSquare(node.data('sbgnclass'));

          // Note that both param.width and param.height cannot be truthy
          if (param.width) {
            if (param.useAspectRatio || eleMustBeSquare) {
              ratio = param.width / node.width();
            }

            node.data("sbgnbbox").w = param.width;
          }
          else if (param.height) {
            if (param.useAspectRatio || eleMustBeSquare) {
              ratio = param.height / node.height();
            }

            node.data("sbgnbbox").h = param.height;
          }

          if (ratio && !param.height) {
            node.data("sbgnbbox").h = node.height() * ratio;
          }
          else if (ratio && !param.width) {
            node.data("sbgnbbox").w = node.width() * ratio;
          }
        }
      }

      node.removeClass('noderesized');
      node.addClass('noderesized');
    }

    nodes.removeClass('noderesized');
    nodes.addClass('noderesized');

    if (_.isEqual(nodes, cy.nodes(':selected'))) {
      inspectorUtilities.handleSBGNInspector();
    }

    return result;
  },
  changeNodeLabel: function (param) {
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
  },
  changeStyleData: function (param) {
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
  },
  changeStyleCss: function (param) {
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

    if (_.isEqual(eles, cy.nodes(':selected'))) {
      inspectorUtilities.handleSBGNInspector();
    }

    return result;
  },
  changeFontProperties: function(param) {
    var result = {
    };
    
    var eles = param.eles;
    result.data = {};
    result.eles = eles;
    
    for (var i = 0; i < eles.length; i++) {
      var ele = eles[i];
      
      result.data[ele.id()] = {};
      
      var data = param.firstTime ? param.data : param.data[ele.id()];
      
      for ( var prop in data ) {
        result.data[ele.id()][prop] = ele.data(prop);
      }
    }

    if (param.firstTime) {
      for (var prop in param.data) {
        eles.data(prop, param.data[prop]);
      }
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
  },
  showAndPerformIncrementalLayout: function(param) {
    var eles = param.eles;
    
    var result = {};
    result.positionAndSizes = this.getNodePositionsAndSizes();
    result.eles = eles.showEles();
    
    if(param.positionAndSizes) {
      this.returnToPositionsAndSizes(param.positionAndSizes);
    }
    else {
      triggerIncrementalLayout();
    }
    
    return result;
  },
  undoShowAndPerformIncrementalLayout: function(param) {
    var eles = param.eles;
    
    var result = {};
    result.positionAndSizes = this.getNodePositionsAndSizes();
    result.eles = eles.hideEles();
    
    this.returnToPositionsAndSizes(param.positionAndSizes);
    
    return result;
  },
  
  // Section End
  // general action functions
  
  // Section Start
  // sbgn action functions
  
  changeStateVariable: function (param) {
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

    for (var i = 0; i < param.nodes.length; i++) {
      param.nodes[i]._private.data.sbgnstatesandinfos = param.stateAndInfos;
    }

    cy.forceRender();

    inspectorUtilities.fillInspectorStateAndInfos(param.nodes, param.stateAndInfos, param.width);

    return result;
  },
  changeUnitOfInformation: function (param) {
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
      inspectorUtilities.fillInspectorStateAndInfos(param.node, param.width);
    }

    return result;
  },
  addStateAndInfo: function (param) {
    var obj = param.obj;
    var nodes = param.nodes;
    var stateAndInfos = param.stateAndInfos;

    stateAndInfos.push(obj);
    inspectorUtilities.relocateStateAndInfos(stateAndInfos);

    for (var i = 0; i < nodes.length; i++) {
      nodes[i]._private.data.sbgnstatesandinfos = stateAndInfos;
    }

    if (_.isEqual(nodes, cy.nodes(':selected'))) {
      inspectorUtilities.fillInspectorStateAndInfos(nodes, stateAndInfos, param.width);
    }
    cy.forceRender();

    var result = {
      nodes: nodes,
      width: param.width,
      stateAndInfos: stateAndInfos,
      obj: obj
    };
    return result;
  },
  removeStateAndInfo: function (param) {
    var obj = param.obj;
    var nodes = param.nodes;
    var stateAndInfos = param.stateAndInfos;

    var index = stateAndInfos.indexOf(obj);
    stateAndInfos.splice(index, 1);

    for (var i = 0; i < nodes.length; i++) {
      nodes[i]._private.data.sbgnstatesandinfos = stateAndInfos;
    }

    if (_.isEqual(nodes, cy.nodes(':selected'))) {
      inspectorUtilities.fillInspectorStateAndInfos(nodes, stateAndInfos, param.width);
    }
    inspectorUtilities.relocateStateAndInfos(stateAndInfos);
    cy.forceRender();

    var result = {
      nodes: nodes,
      width: param.width,
      stateAndInfos: stateAndInfos,
      obj: obj
    };
    return result;
  },
  changeIsMultimerStatus: function (param) {
    var firstTime = param.firstTime;
    var nodes = param.nodes;
    var makeMultimer = param.makeMultimer;
    var resultMakeMultimer = {};

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var isMultimer = node.data('sbgnclass').endsWith(' multimer');

      resultMakeMultimer[node.id()] = isMultimer;
    }

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var sbgnclass = node.data('sbgnclass');
      var isMultimer = node.data('sbgnclass').endsWith(' multimer');

      if ((firstTime && makeMultimer) || (!firstTime && makeMultimer[node.id()])) {
        if (!isMultimer) {
          node.data('sbgnclass', sbgnclass + ' multimer');
        }
      }
      else {
        if (isMultimer) {
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
  },
  changeIsCloneMarkerStatus: function (param) {
    var nodes = param.nodes;
    var makeCloneMarker = param.makeCloneMarker;
    var firstTime = param.firstTime;
    var resultMakeCloneMarker = {};

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      resultMakeCloneMarker[node.id()] = node._private.data.sbgnclonemarker;
      var currentMakeCloneMarker = firstTime ? makeCloneMarker : makeCloneMarker[node.id()];
      node._private.data.sbgnclonemarker = currentMakeCloneMarker ? true : undefined;
      if (node.data('sbgnclass') === 'perturbing agent') {
        node.removeClass('changeClonedStatus');
        node.addClass('changeClonedStatus');
      }
    }

    cy.style().update();
    
    if (!firstTime && _.isEqual(nodes, cy.nodes(':selected'))) {
      $('#inspector-is-clone-marker').attr("checked", !$('#inspector-is-clone-marker').attr("checked"));
    }

    var result = {
      makeCloneMarker: resultMakeCloneMarker,
      nodes: nodes
    };

    return result;
  }
  
  // Section End
  // sbgn action functions
};