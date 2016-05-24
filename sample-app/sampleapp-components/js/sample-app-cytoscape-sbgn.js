//Override String endsWith method for IE
String.prototype.endsWith = function (suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function dynamicResize()
{

  var win = $(this); //this = window

  var windowWidth = win.width();
  var windowHeight = win.height();

  var canvasWidth = 1000;
  var canvasHeight = 680;

  if (windowWidth > canvasWidth)
  {
    $("#sbgn-network-container").width(windowWidth * 0.9 * 0.8);
    $("#sbgn-inspector").width(windowWidth * 0.9 * 0.2);
    var w = $("#sbgn-inspector-and-canvas").width();
    $(".nav-menu").width(w);
    $(".navbar").width(w);
//    $("#sbgn-info-content").width(windowWidth * 0.85);
    $("#sbgn-toolbar").width(w);
  }

  if (windowHeight > canvasHeight)
  {
    $("#sbgn-network-container").height(windowHeight * 0.85);
    $("#sbgn-inspector").height(windowHeight * 0.85);
  }
}

$(window).on('resize', dynamicResize);

$(document).ready(function ()
{
  dynamicResize();
});

var getCommonSBGNClass = function(elements){
  if(elements.length < 1){
    return "";
  }
  
  var SBGNClassOfFirstElement = elements[0].data('sbgnclass');
  for(var i = 1; i < elements.length; i++){
    if(elements[i].data('sbgnclass') != SBGNClassOfFirstElement){
      return "";
    }
  }
  
  return SBGNClassOfFirstElement;
};

var allAreNode = function(elements){
  for(var i = 0; i <elements.length; i++){
    var ele = elements[i];
    if(!ele.isNode()){
      return false;
    }
  }
  
  return true;
};

var allAreEdge = function(elements){
  for(var i = 0; i <elements.length; i++){
    var ele = elements[i];
    if(!ele.isEdge()){
      return false;
    }
  }
  
  return true;
};

var allCanHaveStateVariable = function(elements){
  for(var i = 0; i <elements.length; i++){
    var ele = elements[i];
    if(!canHaveStateVariable(ele.data('sbgnclass'))){
      return false;
    }
  }
  
  return true;
};

var allCanHaveUnitOfInformation = function(elements){
  for(var i = 0; i <elements.length; i++){
    var ele = elements[i];
    if(!canHaveUnitOfInformation(ele.data('sbgnclass'))){
      return false;
    }
  }
  
  return true;
};

var getCommonStateAndInfos = function(elements){
  if(elements.length == 0){
    return [];
  }
  
  var firstStateOrInfo = elements[0]._private.data.sbgnstatesandinfos;
  for(var i = 1; i <elements.length; i++){
    if(!_.isEqual(elements[i]._private.data.sbgnstatesandinfos, firstStateOrInfo)){
      return null;
    }
  }
  
  return firstStateOrInfo;
};

var allCanBeCloned = function(elements){
  for(var i = 0; i <elements.length; i++){
    var ele = elements[i];
    if(!canBeCloned(ele.data('sbgnclass'))){
      return false;
    }
  }
  
  return true;
};

var allCanBeMultimer = function(elements){
  for(var i = 0; i <elements.length; i++){
    var ele = elements[i];
    if(!canBeMultimer(ele.data('sbgnclass'))){
      return false;
    }
  }
  
  return true;
};

var getCommonIsCloned = function(elements){
  if(elements.length == 0){
    return null;
  }
  
  var firstElementIsCloned = elements[0].data('sbgnclonemarker');
  for(var i = 1; i < elements.length; i++){
    if(elements[i].data('sbgnclonemarker') != firstElementIsCloned){
      return null;
    }
  }
  
  return firstElementIsCloned;
};

var getCommonIsMultimer = function(elements){
  if(elements.length == 0){
    return null;
  }
  
  var firstElementIsMultimer = elements[0].data('sbgnclass').endsWith(' multimer');
  for(var i = 1; i < elements.length; i++){
    if(elements[i].data('sbgnclass').endsWith(' multimer') != firstElementIsMultimer){
      return null;
    }
  }
  
  return firstElementIsMultimer;
};

var getCommonLabel = function(elements){
  if(elements.length == 0){
    return null;
  }
  
  var labelOfFirstElement = elements[0].data('sbgnlabel');
  for(var i = 1; i < elements.length; i++){
    if(elements[i].data('sbgnlabel') != labelOfFirstElement){
      return null;
    }
  }
  
  return labelOfFirstElement;
};

var getCommonBorderColor = function(elements){
  if(elements.length == 0){
    return null;
  }
  
  var borderColorOfFirstElement = elements[0].data('borderColor');
  for(var i = 1; i < elements.length; i++){
    if(elements[i].data('borderColor') != borderColorOfFirstElement){
      return null;
    }
  }
  
  return borderColorOfFirstElement;
};

var getCommonFillColor = function(elements){
  if(elements.length == 0){
    return null;
  }
  
  var fillColorOfFirstElement = elements[0].css('background-color');
  for(var i = 1; i < elements.length; i++){
    if(elements[i].css('background-color') != fillColorOfFirstElement){
      return null;
    }
  }
  
  return fillColorOfFirstElement;
};

var getCommonBorderWidth = function(elements){
  if(elements.length == 0){
    return null;
  }
  
  var borderWidthOfFirstElement = elements[0].css('border-width');
  for(var i = 1; i < elements.length; i++){
    if(elements[i].css('border-width') != borderWidthOfFirstElement){
      return null;
    }
  }
  
  return borderWidthOfFirstElement;
};

var getCommonBackgroundOpacity = function(elements){
  if(elements.length == 0){
    return null;
  }
  
  var backgroundOpacityOfFirstElement = elements[0].data('backgroundOpacity');
  for(var i = 1; i < elements.length; i++){
    if(elements[i].data('backgroundOpacity') != backgroundOpacityOfFirstElement){
      return null;
    }
  }
  
  return backgroundOpacityOfFirstElement;
};

var getCommonLineColor = function(elements){
  if(elements.length == 0){
    return null;
  }
  
  var lineColorOfFirstElement = elements[0].data('lineColor');
  for(var i = 1; i < elements.length; i++){
    if(elements[i].data('lineColor') != lineColorOfFirstElement){
      return null;
    }
  }
  
  return lineColorOfFirstElement;
};

var getCommonLineWidth = function(elements){
  if(elements.length == 0){
    return null;
  }
  
  var lineWidthOfFirstElement = elements[0].css('width');
  for(var i = 1; i < elements.length; i++){
    if(elements[i].css('width') != lineWidthOfFirstElement){
      return null;
    }
  }
  
  return lineWidthOfFirstElement;
};

var getCommonSBGNCardinality = function(elements){
  if(elements.length == 0){
    return undefined;
  }
  
  var cardinalityOfFirstElement = elements[0].data('sbgncardinality');
  for(var i = 1; i < elements.length; i++){
    if(elements[i].data('sbgncardinality') != cardinalityOfFirstElement){
      return undefined;
    }
  }
  
  return cardinalityOfFirstElement;
};

var canHaveSBGNCardinality = function(ele) {
  return ele.data('sbgnclass') == 'consumption' || ele.data('sbgnclass') == 'production';
};

var allCanHaveSBGNCardinality = function(elements){
  for(var i = 0; i < elements.length; i++){
    if(!canHaveSBGNCardinality(elements[i])){
      return false;
    }
  }
  
  return true;
};

var stringAfterValueCheck = function (value) {
  return value ? value : '';
};

var enableDragAndDropMode = function () {
  window.dragAndDropModeEnabled = true;
  $("#sbgn-network-container").addClass("target-cursor");
  cy.autolock(true);
  cy.autounselectify(true);
};

var disableDragAndDropMode = function () {
  window.dragAndDropModeEnabled = null;
  window.nodeToDragAndDrop = null;
  $("#sbgn-network-container").removeClass("target-cursor");
  cy.autolock(false);
  cy.autounselectify(false);
};

var canHaveUnitOfInformation = function(sbgnclass) {
   if (sbgnclass == 'simple chemical'
          || sbgnclass == 'macromolecule' || sbgnclass == 'nucleic acid feature'
          || sbgnclass == 'complex' || sbgnclass == 'simple chemical multimer'
          || sbgnclass == 'macromolecule multimer' || sbgnclass == 'nucleic acid feature multimer'
          || sbgnclass == 'complex multimer') {
    return true;
  }
  return false;
};

var canHaveStateVariable = function(sbgnclass) {
   if (sbgnclass == 'macromolecule' || sbgnclass == 'nucleic acid feature'
          || sbgnclass == 'complex' 
          || sbgnclass == 'macromolecule multimer' || sbgnclass == 'nucleic acid feature multimer'
          || sbgnclass == 'complex multimer') {
    return true;
  }
  return false;
};

//checks if a node with the given sbgnclass can be cloned
var canBeCloned = function (sbgnclass) {
  sbgnclass = sbgnclass.replace(" multimer", "");
  var list = {
    'unspecified entity': true,
    'macromolecule': true,
    'complex': true,
    'nucleic acid feature': true,
    'simple chemical': true,
    'perturbing agent': true
  };

  return list[sbgnclass] ? true : false;
};

//checks if a node with the given sbgnclass can become a multimer
var canBeMultimer = function (sbgnclass) {
  sbgnclass = sbgnclass.replace(" multimer", "");
  var list = {
    'macromolecule': true,
    'complex': true,
    'nucleic acid feature': true,
    'simple chemical': true
  };

  return list[sbgnclass] ? true : false;
};

var getNodesData = function () {
  var nodesData = {};
  var nodes = cy.nodes();
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    nodesData[node.id()] = {
      width: node.width(),
      height: node.height(),
      x: node.position("x"),
      y: node.position("y")
    };
  }
  return nodesData;
};

var relocateStateAndInfos = function (stateAndInfos) {
  var length = stateAndInfos.length;
  if (length == 0) {
    return;
  }
  else if (length == 1) {
    stateAndInfos[0].bbox.x = 0;
    stateAndInfos[0].bbox.y = -50;
  }
  else if (length == 2) {
    stateAndInfos[0].bbox.x = 0;
    stateAndInfos[0].bbox.y = -50;

    stateAndInfos[1].bbox.x = 0;
    stateAndInfos[1].bbox.y = 50;
  }
  else if (length == 3) {
    stateAndInfos[0].bbox.x = -25;
    stateAndInfos[0].bbox.y = -50;

    stateAndInfos[1].bbox.x = 25;
    stateAndInfos[1].bbox.y = -50;

    stateAndInfos[2].bbox.x = 0;
    stateAndInfos[2].bbox.y = 50;
  }
  else {
    stateAndInfos[0].bbox.x = -25;
    stateAndInfos[0].bbox.y = -50;

    stateAndInfos[1].bbox.x = 25;
    stateAndInfos[1].bbox.y = -50;

    stateAndInfos[2].bbox.x = -25;
    stateAndInfos[2].bbox.y = 50;

    stateAndInfos[3].bbox.x = 25;
    stateAndInfos[3].bbox.y = 50;
  }
};

var fillInspectorStateAndInfos = function (nodes, stateAndInfos, width) {
  //first empty the state variables and infos data in inspector
  $("#inspector-state-variables").html("");
  $("#inspector-unit-of-informations").html("");
  
  for (var i = 0; i < stateAndInfos.length; i++) {
    var state = stateAndInfos[i];
    if (state.clazz == "state variable") {
      $("#inspector-state-variables").append("<div><input type='text' class='just-added-inspector-input inspector-state-variable-value inspector-input-box' style='width: "
              + width / 5 + "px;' value='" + stringAfterValueCheck(state.state.value) + "'/>"
              + "<span width='" + width / 5 + "'px>@</span>"
              + "<input type='text' class='just-added-inspector-input inspector-state-variable-variable inspector-input-box' style='width: "
              + width / 2.5 + "px;' value='" + stringAfterValueCheck(state.state.variable)
              + "'/><img width='12px' height='12px' class='just-added-inspector-input inspector-delete-state-and-info inspector-input-box' src='sampleapp-images/delete.png'></img></div>");

      $(".inspector-state-variable-value").unbind('change').on('change', function () {
        var param = {
          state: $(this).data("state"),
          valueOrVariable: $(this).attr('value'),
          type: 'value',
          nodes: nodes,
          stateAndInfos: stateAndInfos,
          width: width
        };
        editorActionsManager._do(new ChangeStateVariableCommand(param));
        refreshUndoRedoButtonsStatus();
//        $(this).data("state").state.value = $(this).attr('value');
//        cy.forceRender();
      });

      $(".inspector-state-variable-variable").unbind('change').on('change', function () {
        var param = {
          state: $(this).data("state"),
          valueOrVariable: $(this).attr('value'),
          type: 'variable',
          nodes: nodes,
          stateAndInfos: stateAndInfos,
          width: width
        };
        editorActionsManager._do(new ChangeStateVariableCommand(param));
        refreshUndoRedoButtonsStatus();
//        $(this).data("state").state.variable = $(this).attr('value');
//        cy.forceRender();
      });
    }
    else if (state.clazz == "unit of information") {
      var total = width / 1.25;
      $("#inspector-unit-of-informations").append("<div><input type='text' class='just-added-inspector-input inspector-unit-of-information-label inspector-input-box' style='width: "
              + total + "px;' value='" + stringAfterValueCheck(state.label.text)
              + "'/><img width='12px' height='12px' class='just-added-inspector-input inspector-delete-state-and-info' src='sampleapp-images/delete.png'></img></div>");

      $(".inspector-unit-of-information-label").unbind('change').on('change', function () {
        var param = {
          state: $(this).data("state"),
          text: $(this).attr('value'),
          stateAndInfos: stateAndInfos,
          nodes: nodes,
          width: width
        };
        editorActionsManager._do(new ChangeUnitOfInformationCommand(param));
        refreshUndoRedoButtonsStatus();
//        $(this).data("state").label.text = $(this).attr('value');
//        cy.forceRender();
      });
    }

    $(".inspector-delete-state-and-info").unbind('click').click(function (event) {
      var param = {
        obj: $(this).data("state"),
        nodes: nodes,
        stateAndInfos: stateAndInfos,
        width: width
      };
      editorActionsManager._do(new RemoveStateAndInfoCommand(param));
      refreshUndoRedoButtonsStatus();
    });

    $(".just-added-inspector-input").data("state", state);
    $(".just-added-inspector-input").removeClass("just-added-inspector-input");
  }
  $("#inspector-state-variables").append("<img id='inspector-add-state-variable' src='sampleapp-images/add.png'/>");
  $("#inspector-unit-of-informations").append("<img id='inspector-add-unit-of-information' src='sampleapp-images/add.png'/>");

  $("#inspector-add-state-variable").click(function () {
    var obj = {};
    obj.clazz = "state variable";

    obj.state = {
      value: "",
      variable: ""
    };
    obj.bbox = {
      w: 69,
      h: 28
    };
    var param = {
      obj: obj,
      nodes: nodes,
      stateAndInfos: stateAndInfos,
      width: width
    };
    editorActionsManager._do(new AddStateAndInfoCommand(param));
    refreshUndoRedoButtonsStatus();
  });

  $("#inspector-add-unit-of-information").click(function () {
    var obj = {};
    obj.clazz = "unit of information";
    obj.label = {
      text: ""
    };
    obj.bbox = {
      w: 53,
      h: 18
    };
    var param = {
      obj: obj,
      nodes: nodes,
      width: width,
      stateAndInfos: stateAndInfos
    };
    editorActionsManager._do(new AddStateAndInfoCommand(param));
    refreshUndoRedoButtonsStatus();
  });
}

var handleSBGNInspector = function () {
  var selectedEles = cy.elements(":selected");
  
  if(selectedEles.length == 0){
    $("#sbgn-inspector").html("");
    return;
  }
  
  var width = $("#sbgn-inspector").width() * 0.45;
  
  var allNodes = allAreNode(selectedEles);
  var allEdges = allAreEdge(selectedEles);
  
  if (allNodes || allEdges) {
    var sbgnlabel = getCommonLabel(selectedEles);
    if (sbgnlabel == null) {
      sbgnlabel = "";
    }

    var classInfo = getCommonSBGNClass(selectedEles);
    if (classInfo == 'and' || classInfo == 'or' || classInfo == 'not') {
      classInfo = classInfo.toUpperCase();
    }
    else {
      classInfo = classInfo.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      classInfo = classInfo.replace(' Of ', ' of ');
      classInfo = classInfo.replace(' And ', ' and ');
      classInfo = classInfo.replace(' Or ', ' or ');
      classInfo = classInfo.replace(' Not ', ' not ');
    }

    var title = classInfo=="" ? "Properties":classInfo + " Properties";

    var buttonwidth = width;
    if (buttonwidth > 50) {
      buttonwidth = 50;
    }

    var html = "<div style='text-align: center; color: black; font-weight: bold; margin-bottom: 5px;'>" + title + "</div><table cellpadding='0' cellspacing='0'>";
    var type;
    var fillStateAndInfos;
    var multimerCheck;
    var clonedCheck;
    var commonIsMultimer;
    var commonIsCloned;
    var commonStateAndInfos;
    var commonSBGNCardinality;
    
    if (allNodes) {
      type = "node";
      
      var borderColor = getCommonBorderColor(selectedEles);
      borderColor = borderColor?borderColor:'#FFFFFF';
      
      var backgroundColor = getCommonFillColor(selectedEles);
      backgroundColor = backgroundColor?backgroundColor:'#FFFFFF';
      
      var borderWidth = getCommonBorderWidth(selectedEles);
      
      var backgroundOpacity = getCommonBackgroundOpacity(selectedEles);
      backgroundOpacity = backgroundOpacity?backgroundOpacity:0.5;
      
      html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Label</font>" + "</td><td style='padding-left: 5px;'>"
              + "<input id='inspector-label' class='inspector-input-box' type='text' style='width: " + width / 1.25 + "px;' value='" + sbgnlabel
              + "'/>" + "</td></tr>";
      html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Border Color</font>" + "</td><td style='padding-left: 5px;'>"
              + "<input id='inspector-border-color' class='inspector-input-box' type='color' style='width: " + buttonwidth + "px;' value='" + borderColor
              + "'/>" + "</td></tr>";
      html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Fill Color</font>" + "</td><td style='padding-left: 5px;'>"
              + "<input id='inspector-fill-color' class='inspector-input-box' type='color' style='width: " + buttonwidth + "px;' value='" + backgroundColor
              + "'/>" + "</td></tr>";
      html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Border Width</font>" + "</td><td style='padding-left: 5px;'>"
              + "<input id='inspector-border-width' class='inspector-input-box' type='number' step='0.01' min='0' style='width: " + buttonwidth + "px;'";
      
      if(borderWidth){
        html += " value='" + parseFloat(borderWidth) + "'";
      }
      
      html += "/>" + "</td></tr>";
      
      html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Fill Opacity</font>" + "</td><td style='padding-left: 5px;'>"
              + "<input id='inspector-background-opacity' class='inspector-input-box' type='range' step='0.01' min='0' max='1' style='width: " + buttonwidth + "px;' value='" + parseFloat(backgroundOpacity)
              + "'/>" + "</td></tr>"; 
      
      commonStateAndInfos = getCommonStateAndInfos(selectedEles);
      
      if(commonStateAndInfos){
        if (allCanHaveStateVariable(selectedEles)) {
          fillStateAndInfos = true;
          
          html += "<tr><td colspan='2'><hr style='padding: 0px; margin-top: 5px; margin-bottom: 5px;' width='" + $("#sbgn-inspector").width() + "'></td></tr>";
          html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>State Variables</font>" + "</td>"
                  + "<td id='inspector-state-variables' style='padding-left: 5px; width: '" + width + "'></td></tr>";
        }

        if (allCanHaveUnitOfInformation(selectedEles)) {
          fillStateAndInfos = true;
          
          html += "<tr><td colspan='2'><hr style='padding: 0px; margin-top: 5px; margin-bottom: 5px;' width='" + $("#sbgn-inspector").width() + "'></td></tr>";
          html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Units of Information</font>" + "</td>"
                  + "<td id='inspector-unit-of-informations' style='padding-left: 5px; width: '" + width + "'></td></tr>";
        }
      }
      
      commonIsMultimer = getCommonIsMultimer(selectedEles);
      commonIsCloned = getCommonIsCloned(selectedEles);
//      multimerCheck = ( commonIsMultimer !== null ) && allCanBeMultimer(selectedEles);
//      clonedCheck = ( commonIsCloned !== null ) && allCanBeCloned(selectedEles);
      multimerCheck = allCanBeMultimer(selectedEles);
      clonedCheck = allCanBeCloned(selectedEles);
      
      multimerCheck = multimerCheck?multimerCheck:false;
      clonedCheck = clonedCheck?clonedCheck:false;

      if (multimerCheck || clonedCheck) {
        html += "<tr><td colspan='2'><hr style='padding: 0px; margin-top: 5px; margin-bottom: 5px;' width='" + $("#sbgn-inspector").width() + "'></td></tr>";
      }

      if (multimerCheck) {
        html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Multimer</font>" + "</td>"
                + "<td style='padding-left: 5px; width: '" + width + "'><input type='checkbox' id='inspector-is-multimer'></td></tr>";
      }

      if (clonedCheck) {
        html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Cloned</font>" + "</td>"
                + "<td style='padding-left: 5px; width: '" + width + "'><input type='checkbox' id='inspector-is-clone-marker'></td></tr>";
      }
    }
    else {
      type = "edge";
      
      var commonLineColor = getCommonLineColor(selectedEles);
      commonLineColor = commonLineColor?commonLineColor:'#FFFFFF';
      
      var commonLineWidth = getCommonLineWidth(selectedEles);
      
      html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Fill Color</font>" + "</td><td style='padding-left: 5px;'>"
              + "<input id='inspector-line-color' class='inspector-input-box' type='color' style='width: " + buttonwidth + "px;' value='" + commonLineColor
              + "'/>" + "</td></tr>";

      html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Width</font>" + "</td><td style='padding-left: 5px;'>"
              + "<input id='inspector-width' class='inspector-input-box' type='number' step='0.01' min='0' style='width: " + buttonwidth + "px;'";
      
      if(commonLineWidth){
        html += " value='" + parseFloat(commonLineWidth) + "'";
      }
      
      html += "/>" + "</td></tr>";
      
      if (allCanHaveSBGNCardinality(selectedEles)) {
        var cardinality = getCommonSBGNCardinality(selectedEles);
        commonSBGNCardinality = cardinality;
        
        if (cardinality <= 0) {
          cardinality = undefined;
        }
        html += "<tr><td style='width: " + width + "px; text-align:right; padding-right: 5px;'>" + "<font size='2'>Cardinality</font>" + "</td><td style='padding-left: 5px;'>"
                + "<input id='inspector-cardinality' class='inspector-input-box' type='number' min='0' step='1' style='width: " + buttonwidth + "px;' value='" + cardinality
                + "'/>" + "</td></tr>";
      }

    }
    html += "</table>";
    
    if(selectedEles.length == 1){
      html += "<div style='text-align: center; margin-top: 5px;'><button style='align: center;' id='inspector-set-as-default-button'"
            + ">Set as Default</button></div>";
    }
    
    html += "<hr style='padding: 0px; margin-top: 5px; margin-bottom: 5px;' width='" + $("#sbgn-inspector").width() + "'>";
//    html += "<button type='button' style='display: block; margin: 0 auto;' class='btn btn-default' id='inspector-apply-button'>Apply Changes</button>";
    $("#sbgn-inspector").html(html);

    if (type == "node") {
      if (fillStateAndInfos) {
        fillInspectorStateAndInfos(selectedEles, commonStateAndInfos, width);
      }

      if (multimerCheck && commonIsMultimer) {
        $('#inspector-is-multimer').attr('checked', true);
      }

      if (clonedCheck && commonIsCloned) {
        $('#inspector-is-clone-marker').attr('checked', true);
      }

      $('#inspector-set-as-default-button').on('click', function () {
        var multimer;
        var selected = selectedEles[0];
        var sbgnclass = selected.data('sbgnclass');
        if (sbgnclass.endsWith(' multimer')) {
          sbgnclass = sbgnclass.replace(' multimer', '');
          multimer = true;
        }
        if (addRemoveUtilities.defaultsMap[sbgnclass] == null) {
          addRemoveUtilities.defaultsMap[sbgnclass] = {};
        }
        var defaults = addRemoveUtilities.defaultsMap[sbgnclass];
        defaults.width = selected.width();
        defaults.height = selected.height();
        defaults.sbgnclonemarker = selected._private.data.sbgnclonemarker;
        defaults.multimer = multimer;
        defaults['border-width'] = selected.css('border-width');
        defaults['border-color'] = selected.data('borderColor');
        defaults['background-color'] = selected.css('background-color');
        defaults['font-size'] = selected.css('font-size');
        defaults['background-opacity'] = selected.css('background-opacity');
      });

      $('#inspector-is-multimer').on('click', function () {
        var param = {
          makeMultimer: $('#inspector-is-multimer').attr('checked') == 'checked',
          nodes: selectedEles,
          firstTime: true
        };
        editorActionsManager._do(new changeIsMultimerStatusCommand(param));
        refreshUndoRedoButtonsStatus();
      });

      $('#inspector-is-clone-marker').on('click', function () {
        var param = {
          makeCloneMarker: $('#inspector-is-clone-marker').attr('checked') == 'checked',
          nodes: selectedEles,
          firstTime: true
        };
        editorActionsManager._do(new changeIsCloneMarkerStatusCommand(param));
        refreshUndoRedoButtonsStatus();
      });

      $("#inspector-border-color").on('change', function () {
        var param = {
          eles: selectedEles,
          data: $("#inspector-border-color").attr("value"),
          dataType: "borderColor",
          firstTime: true
        };
        editorActionsManager._do(new ChangeStyleDataCommand(param));
        refreshUndoRedoButtonsStatus();
      });

      $("#inspector-label").on('change', function () {
        var param = {
          nodes: selectedEles,
          sbgnlabel: $(this).attr('value'),
          firstTime: true
        };
        editorActionsManager._do(new ChangeNodeLabelCommand(param));
        refreshUndoRedoButtonsStatus();
      });

      $("#inspector-background-opacity").on('change', function () {
        var param = {
          eles: selectedEles,
          data: $("#inspector-background-opacity").attr("value"),
          dataType: "backgroundOpacity",
          firstTime: true
        };
        editorActionsManager._do(new ChangeStyleDataCommand(param));
        refreshUndoRedoButtonsStatus();
      });

      $("#inspector-fill-color").on('change', function () {
        var param = {
          eles: selectedEles,
          data: $("#inspector-fill-color").attr("value"),
          dataType: "background-color",
          firstTime: true
        };
        editorActionsManager._do(new ChangeStyleCssCommand(param));
        refreshUndoRedoButtonsStatus();
      });

      $("#inspector-border-width").bind('change').on('change', function () {
        var param = {
          eles: selectedEles,
          data: $("#inspector-border-width").attr("value"),
          dataType: "border-width",
          firstTime: true
        };
        editorActionsManager._do(new ChangeStyleCssCommand(param));
        refreshUndoRedoButtonsStatus();
      });
    }
    else {
      $('#inspector-set-as-default-button').on('click', function () {
        if (addRemoveUtilities.defaultsMap[selected.data('sbgnclass')] == null) {
          addRemoveUtilities.defaultsMap[selected.data('sbgnclass')] = {};
        }
        var defaults = addRemoveUtilities.defaultsMap[selected.data('sbgnclass')];
        defaults['line-color'] = selected.data('lineColor');
        defaults['width'] = selected.css('width');
      });

      $("#inspector-line-color").on('change', function () {
        var param = {
          eles: selectedEles,
          data: $("#inspector-line-color").attr("value"),
          dataType: "lineColor",
          firstTime: true
        };
        editorActionsManager._do(new ChangeStyleDataCommand(param));
        refreshUndoRedoButtonsStatus();
      });

      $("#inspector-cardinality").bind('change').on('change', function () {
        var data = Math.round($("#inspector-cardinality").attr("value"));

        if (data < 0) {
          if (commonSBGNCardinality == 0) {
            handleSBGNInspector();
            return;
          }
          data = 0;
        }
        var param = {
          eles: selectedEles,
          data: data,
          dataType: "sbgncardinality",
          firstTime: true
        };
        editorActionsManager._do(new ChangeStyleDataCommand(param));
        refreshUndoRedoButtonsStatus();
      });

      $("#inspector-width").bind('change').on('change', function () {
        var param = {
          eles: selectedEles,
          data: $("#inspector-width").attr("value"),
          dataType: "width",
          firstTime: true
        };
        editorActionsManager._do(new ChangeStyleCssCommand(param));
        refreshUndoRedoButtonsStatus();
      });
    }
  }
  else {
    $("#sbgn-inspector").html("");
  }
}

var makePresetLayout = function (fit) {
  var options = {
    name: "preset"
  };
  
  if(fit != null){
    options.fit = fit;
  }
  
  cy.layout(options);
};

var initilizeUnselectedDataOfElements = function () {
  var nodes = cy.nodes();
  var edges = cy.edges();

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    node.data("borderColor", node.css('border-color'));
    node.addClass('changeBorderColor');

    node.data("backgroundOpacity", node.css('background-opacity'));
    node.addClass('changeBackgroundOpacity');
  }

  for (var i = 0; i < edges.length; i++) {
    var edge = edges[i];
    edge.data("lineColor", edge.css('line-color'));
    edge.addClass('changeLineColor');
  }
};

/*
 * This function obtains the info label of the given node by
 * it's children info recursively
 */
var getInfoLabel = function (node) {
  /*    * Info label of a collapsed node cannot be changed if
   * the node is collapsed return the already existing info label of it
   */
  if (node._private.data.collapsedChildren != null) {
    return node._private.data.infoLabel;
  }

  /*
   * If the node is simple then it's infolabel is equal to it's sbgnlabel
   */
  if (node.children() == null || node.children().length == 0) {
    return node._private.data.sbgnlabel;
  }

  var children = node.children();
  var infoLabel = "";
  /*
   * Get the info label of the given node by it's children info recursively
   */
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var childInfo = getInfoLabel(child);

    if (childInfo == null || childInfo == "") {
      continue;
    }

    if (infoLabel != "") {
      infoLabel += ":";
    }
    infoLabel += childInfo;
  }

  //return info label
  return infoLabel;
};

/*
 * This function create qtip for the given node
 */
var nodeQtipFunction = function (node) {
  /*    * Check the sbgnlabel of the node if it is not valid 
   * then check the infolabel if it is also not valid do not show qtip
   */
  var label = node._private.data.sbgnlabel;

  if (label == null || label == "")
    label = getInfoLabel(node);

  if (label == null || label == "")
    return;

  node.qtip({
    content: function () {
      var contentHtml = "<b style='text-align:center;font-size:16px;'>" + label + "</b>";
      var sbgnstatesandinfos = node._private.data.sbgnstatesandinfos;
      for (var i = 0; i < sbgnstatesandinfos.length; i++) {
        var sbgnstateandinfo = sbgnstatesandinfos[i];
        if (sbgnstateandinfo.clazz == "state variable") {
          var value = sbgnstateandinfo.state.value;
          var variable = sbgnstateandinfo.state.variable;
          var stateLabel = (variable == null /*|| typeof stateVariable === undefined */) ? value :
                  value + "@" + variable;
          if (stateLabel == null) {
            stateLabel = "";
          }
          contentHtml += "<div style='text-align:center;font-size:14px;'>" + stateLabel + "</div>";
        }
        else if (sbgnstateandinfo.clazz == "unit of information") {
          var stateLabel = sbgnstateandinfo.label.text;
          if (stateLabel == null) {
            stateLabel = "";
          }
          contentHtml += "<div style='text-align:center;font-size:14px;'>" + stateLabel + "</div>";
        }
      }
      return contentHtml;
    },
    show: {
      ready: true
    },
    position: {
      my: 'top center',
      at: 'bottom center',
      adjust: {
        cyViewport: true
      }
    },
    style: {
      classes: 'qtip-bootstrap',
      tip: {
        width: 16,
        height: 8
      }
    }
  });

};

/*
 * This function refreshs the enabled-disabled status of undo-redo buttons.
 * The status of buttons are determined by whether the undo-redo stacks are empty.
 */
var refreshUndoRedoButtonsStatus = function () {
  if (editorActionsManager.isUndoStackEmpty()) {
    $("#undo-last-action").parent("li").addClass("disabled");
  }
  else {
    $("#undo-last-action").parent("li").removeClass("disabled");
  }

  if (editorActionsManager.isRedoStackEmpty()) {
    $("#redo-last-action").parent("li").addClass("disabled");
  }
  else {
    $("#redo-last-action").parent("li").removeClass("disabled");
  }
};

var calculatePaddings = function (paddingPercent) {
  //As default use the compound padding value
  if (!paddingPercent) {
    paddingPercent = parseInt(sbgnStyleRules['compound-padding'], 10);
  }

  var nodes = cy.nodes();
  var total = 0;
  var numOfSimples = 0;

  for (var i = 0; i < nodes.length; i++) {
    var theNode = nodes[i];
    if (theNode.children() == null || theNode.children().length == 0) {
      var collapsedChildren = theNode._private.data.collapsedChildren;
      if (collapsedChildren == null || collapsedChildren.length == 0) {
        total += Number(theNode.width());
        total += Number(theNode.height());
        numOfSimples++;
      }
      else {
        var result = expandCollapseUtilities.getCollapsedChildrenData(collapsedChildren, numOfSimples, total);
        numOfSimples = result.numOfSimples;
        total = result.total;
      }
    }
  }

  var calc_padding = (paddingPercent / 100) * Math.floor(total / (2 * numOfSimples));

  if (calc_padding < 15) {
    calc_padding = 15;
  }

  return calc_padding;
};

var calculateTilingPaddings = calculatePaddings;
var calculateCompoundPaddings = calculatePaddings;

var refreshPaddings = function () {
  var calc_padding = calculateCompoundPaddings();

  var nodes = cy.nodes();
  nodes.css('padding-left', 0);
  nodes.css('padding-right', 0);
  nodes.css('padding-top', 0);
  nodes.css('padding-bottom', 0);

  var compounds = nodes.filter('$node > node');

  compounds.css('padding-left', calc_padding);
  compounds.css('padding-right', calc_padding);
  compounds.css('padding-top', calc_padding);
  compounds.css('padding-bottom', calc_padding);
};

var isEPNClass = function (sbgnclass) {
  return (sbgnclass == 'unspecified entity'
          || sbgnclass == 'simple chemical'
          || sbgnclass == 'macromolecule'
          || sbgnclass == 'nucleic acid feature'
          || sbgnclass == 'complex');
};

var isPNClass = function (sbgnclass) {
  return (sbgnclass == 'process'
          || sbgnclass == 'omitted process'
          || sbgnclass == 'uncertain process'
          || sbgnclass == 'association'
          || sbgnclass == 'dissociation');
};

var isLogicalOperator = function (sbgnclass) {
  return (sbgnclass == 'and' || sbgnclass == 'or' || sbgnclass == 'not');
};

var convenientToEquivalence = function (sbgnclass) {
  return (sbgnclass == 'tag' || sbgnclass == 'terminal');
};

/*
 * This is a debugging function
 */
var printNodeInfo = function () {
  console.log("print node info");
  var nodes = cy.nodes();
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    console.log(node.data("id") + "\t" + node.data("parent"));
  }
  console.log("print edge info");
  var edges = cy.edges();
  for (var i = 0; i < edges.length; i++) {
    var edge = edges[i];
    console.log(edge.data("id") + "\t" + edge.data("source") + "\t" + edge.data("target"));
  }
};

var getCyShape = function (ele) {
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
};

var getCyArrowShape = function (ele) {
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
};

var truncateText = function (textProp, font) {
  var context = document.createElement('canvas').getContext("2d");
  context.font = font;

  var fitLabelsToNodes = (sbgnStyleRules['fit-labels-to-nodes'] == 'true');

  var text = (typeof textProp.label === 'undefined') ? "" : textProp.label;
  //If fit labels to nodes is false do not truncate
  if (fitLabelsToNodes == false) {
    return text;
  }
  var width;
  var len = text.length;
  var ellipsis = "..";

  //if(context.measureText(text).width < textProp.width)
  //	return text;
  var textWidth = (textProp.width > 30) ? textProp.width - 10 : textProp.width;

  while ((width = context.measureText(text).width) > textWidth) {
    --len;
    text = text.substring(0, len) + ellipsis;
  }
  return text;
};

var getElementContent = function (ele) {
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
  else if(sbgnclass == 'compartment'){
    content = ele.data('sbgnlabel') ? ele.data('sbgnlabel') : "";
  }
  else if(sbgnclass == 'complex'){
    if(ele.children().length == 0){
      if(ele.data('sbgnlabel')){
        content = ele.data('sbgnlabel');
      }
      else if(ele.data('infoLabel')){
        content = ele.data('infoLabel');
      }
      else{
        content = '';
      }
    }
    else{
      content = '';
    }
  }
  else if (sbgnclass == 'and') {
    content = 'AND';
  }
  else if (sbgnclass == 'or') {
    content = 'OR';
  }
  else if (sbgnclass == 'not') {
    content = 'NOT';
  }
  else if (sbgnclass == 'omitted process') {
    content = '\\\\';
  }
  else if (sbgnclass == 'uncertain process') {
    content = '?';
  }
  else if (sbgnclass == 'dissociation') {
    content = 'O';
  }

  var textWidth = ele.css('width') ? parseFloat(ele.css('width')) : ele.data('sbgnbbox').w;

  var textProp = {
    label: content,
    width: ( sbgnclass==('complex') || sbgnclass==('compartment') )?textWidth * 2:textWidth
  };

  var font = getLabelTextSize(ele) + "px Arial";
  return truncateText(textProp, font);
};

var getLabelTextSize = function (ele) {
  var sbgnclass = ele.data('sbgnclass');
  if (sbgnclass.endsWith('process')) {
    return 18;
  }
  return getDynamicLabelTextSize(ele);
};

/*
 * calculates the dynamic label size for the given node
 */
var getDynamicLabelTextSize = function (ele) {
  var dynamicLabelSize = sbgnStyleRules['dynamic-label-size'];
  var dynamicLabelSizeCoefficient;

  if (dynamicLabelSize == 'small') {
    dynamicLabelSizeCoefficient = 0.75;
  }
  else if (dynamicLabelSize == 'regular') {
    dynamicLabelSizeCoefficient = 1;
  }
  else if (dynamicLabelSize == 'large') {
    dynamicLabelSizeCoefficient = 1.25;
  }

  //This line will be useless and is to be removed later
//  dynamicLabelSizeCoefficient = dynamicLabelSizeCoefficient ? dynamicLabelSizeCoefficient : 1;

  var h = ele.css('height') ? parseInt(ele.css('height')) : ele.data('sbgnbbox').h;
  var textHeight = parseInt(h / 2.45) * dynamicLabelSizeCoefficient;

  return textHeight;
};

var sbgnStyleSheet = cytoscape.stylesheet()
        .selector("node")
        .css({
          'border-width': 1.5,
          'border-color': '#555',
          'background-color': '#f6f6f6',
          'font-size': 11,
//          'shape': 'data(sbgnclass)',
          'background-opacity': 0.5,
        })
        .selector("node[?sbgnclonemarker][sbgnclass='perturbing agent']")
        .css({
          'background-image': 'sampleapp-images/clone_bg.png',
          'background-position-x': '50%',
          'background-position-y': '100%',
          'background-width': '100%',
          'background-height': '25%',
          'background-fit': 'none',
          'background-image-opacity': function (ele) {
            if(!ele.data('sbgnclonemarker')){
              return 0;
            }
            return ele._private.style['background-opacity'].value;
          }
        })
        .selector("node[sbgnclass][sbgnclass!='complex'][sbgnclass!='process'][sbgnclass!='association'][sbgnclass!='dissociation'][sbgnclass!='compartment'][sbgnclass!='source and sink']")
        .css({
//          'content': 'data(sbgnlabel)',
          'content': function (ele) {
            return getElementContent(ele);
          },
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': function (ele) {
            return getLabelTextSize(ele);
          }
        })
        .selector("node[sbgnclass]")
        .css({
          'shape': function (ele) {
            return getCyShape(ele);
          }
        })
        .selector("node[sbgnclass='perturbing agent']")
        .css({
          'shape-polygon-points': '-1, -1,   -0.5, 0,  -1, 1,   1, 1,   0.5, 0, 1, -1'
        })
        .selector("node[sbgnclass='association']")
        .css({
          'background-color': '#6B6B6B'
        })
        .selector("node[sbgnclass='tag']")
        .css({
          'shape-polygon-points': '-1, -1,   0.25, -1,   1, 0,    0.25, 1,    -1, 1'
        })
        .selector("node[sbgnclass='complex']")
        .css({
          'background-color': '#F4F3EE',
          'text-valign': 'bottom',
          'text-halign': 'center',
          'font-size': '16',
          'width': function(ele){
            if(ele.children() == null || ele.children().length == 0){
              return '36';
            }
            return ele.data('width');
          },
          'height': function(ele){
            if(ele.children() == null || ele.children().length == 0){
              return '36';
            }
            return ele.data('height');
          },
          'content': function(ele){
            return getElementContent(ele);
          }
        })
        .selector("node[sbgnclass='compartment']")
        .css({
          'border-width': 3.75,
          'background-opacity': 0,
          'background-color': '#FFFFFF',
          'content': function(ele){
            return getElementContent(ele);
          },
          'width': function(ele){
            if(ele.children() == null || ele.children().length == 0){
              return '36';
            }
            return ele.data('width');
          },
          'height': function(ele){
            if(ele.children() == null || ele.children().length == 0){
              return '36';
            }
            return ele.data('height');
          },
          'text-valign': 'bottom',
          'text-halign': 'center',
          'font-size': '16'
        })
        .selector("node[sbgnclass][sbgnclass!='complex'][sbgnclass!='compartment'][sbgnclass!='submap']")
        .css({
          'width': 'data(sbgnbbox.w)',
          'height': 'data(sbgnbbox.h)'
        })
        .selector("node:selected")
        .css({
          'border-color': '#d67614',
          'target-arrow-color': '#000',
          'text-outline-color': '#000'})
        .selector("node:active")
        .css({
          'background-opacity': 0.7, 'overlay-color': '#d67614',
          'overlay-padding': '14'
        })
        .selector("edge")
        .css({
          'curve-style': 'bezier',
          'line-color': '#555',
          'target-arrow-fill': 'hollow',
          'source-arrow-fill': 'hollow',
          'width': 1.5,
          'target-arrow-color': '#555',
          'source-arrow-color': '#555',
//          'target-arrow-shape': 'data(sbgnclass)'
        })
        .selector("edge[distances][weights]")
        .css({
          'curve-style': 'segments',
          'segment-distances': function (ele) {
            return sbgnBendPointUtilities.getSegmentDistancesString(ele);
          },
          'segment-weights': function (ele) {
            return sbgnBendPointUtilities.getSegmentWeightsString(ele);
          }
        })
        .selector("edge[sbgnclass]")
        .css({
          'target-arrow-shape': function (ele) {
            return getCyArrowShape(ele);
          }
        })
        .selector("edge[sbgnclass='inhibition']")
        .css({
          'target-arrow-fill': 'filled'
        })
        .selector("edge[sbgnclass='consumption']")
        .css({
          'line-style': 'consumption'
        })
        .selector("edge[sbgnclass='production']")
        .css({
          'target-arrow-fill': 'filled',
          'line-style': 'production'
        })
        .selector("edge:selected")
        .css({
          'line-color': '#d67614',
          'source-arrow-color': '#d67614',
          'target-arrow-color': '#d67614'
        })
        .selector("edge:active")
        .css({
          'background-opacity': 0.7, 'overlay-color': '#d67614',
          'overlay-padding': '8'
        })
        .selector("core")
        .css({
          'selection-box-color': '#d67614',
          'selection-box-opacity': '0.2', 'selection-box-border-color': '#d67614'
        })
        .selector(".ui-cytoscape-edgehandles-source")
        .css({
          'border-color': '#5CC2ED',
          'border-width': 3
        })
        .selector(".ui-cytoscape-edgehandles-target, node.ui-cytoscape-edgehandles-preview")
        .css({
          'background-color': '#5CC2ED'
        })
        .selector("edge.ui-cytoscape-edgehandles-preview")
        .css({
          'line-color': '#5CC2ED'
        })
        .selector("node.ui-cytoscape-edgehandles-preview, node.intermediate")
        .css({
          'shape': 'rectangle',
          'width': 15,
          'height': 15
        })
        .selector('edge.not-highlighted')
        .css({
          'opacity': 0.3,
          'text-opacity': 0.3,
          'background-opacity': 0.3
        })
//        .selector("node.emptyComplexOrCompartment")
//        .css({
//          'width': 36,
//          'height': 36,
//          'content': function (ele) {
//            return getElementContent(ele);
//          }
//        })
        .selector('node.not-highlighted')
        .css({
          'border-opacity': 0.3,
          'text-opacity': 0.3,
          'background-opacity': 0.3
        })
        .selector('edge.meta')
        .css({
          'line-color': '#C4C4C4',
          'source-arrow-color': '#C4C4C4',
          'target-arrow-color': '#C4C4C4'
        })
        .selector("edge.meta:selected")
        .css({
          'line-color': '#d67614',
          'source-arrow-color': '#d67614',
          'target-arrow-color': '#d67614'
        })
        .selector("node.changeBackgroundOpacity")
        .css({
          'background-opacity': 'data(backgroundOpacity)'
        })
        .selector("node.changeLabelTextSize")
        .css({
          'font-size': function (ele) {
            return getLabelTextSize(ele);
          }
        })
        .selector("node.changeContent")
        .css({
          'content': function (ele) {
            return getElementContent(ele);
          }
        })
        .selector("node.changeBorderColor")
        .css({
          'border-color': 'data(borderColor)'
        })
        .selector("node.changeBorderColor:selected")
        .css({
          'border-color': '#d67614'
        })
        .selector("edge.changeLineColor")
        .css({
          'line-color': 'data(lineColor)',
          'source-arrow-color': 'data(lineColor)',
          'target-arrow-color': 'data(lineColor)'
        })
        .selector("edge.changeLineColor:selected")
        .css({
          'line-color': '#d67614',
          'source-arrow-color': '#d67614',
          'target-arrow-color': '#d67614'
        })
        .selector('edge.changeLineColor.meta')
        .css({
          'line-color': '#C4C4C4',
          'source-arrow-color': '#C4C4C4',
          'target-arrow-color': '#C4C4C4'
        })
        .selector("edge.changeLineColor.meta:selected")
        .css({
          'line-color': '#d67614',
          'source-arrow-color': '#d67614',
          'target-arrow-color': '#d67614'
        }).selector("node.changeClonedStatus")
        .css({
          'background-image-opacity': function (ele) {
            if(!ele.data('sbgnclonemarker')){
              return 0;
            }
            return ele._private.style['background-opacity'].value;
          }
        });
// end of sbgnStyleSheet

var NotyView = Backbone.View.extend({
  render: function () {
    //this.model["theme"] = " twitter bootstrap";
    this.model["layout"] = "bottomRight";
    this.model["timeout"] = 8000;
    this.model["text"] = "Right click on a gene to see its details!";

    noty(this.model);
    return this;
  }
});

var SBGNContainer = Backbone.View.extend({
  cyStyle: sbgnStyleSheet,
  render: function () {
    (new NotyView({
      template: "#noty-info",
      model: {}
    })).render();

    var container = $(this.el);
    // container.html("");
    // container.append(_.template($("#loading-template").html()));


    var cytoscapeJsGraph = (this.model.cytoscapeJsGraph);

    var positionMap = {};
    //add position information to data for preset layout
    for (var i = 0; i < cytoscapeJsGraph.nodes.length; i++) {
      var xPos = cytoscapeJsGraph.nodes[i].data.sbgnbbox.x;
      var yPos = cytoscapeJsGraph.nodes[i].data.sbgnbbox.y;
      positionMap[cytoscapeJsGraph.nodes[i].data.id] = {'x': xPos, 'y': yPos};
    }

    var cyOptions = {
      elements: cytoscapeJsGraph,
      style: sbgnStyleSheet,
      layout: {
        name: 'preset',
        positions: positionMap
      },
      showOverlay: false, minZoom: 0.125, maxZoom: 16,
      boxSelectionEnabled: true,
      motionBlur: true,
      wheelSensitivity: 0.1,
      ready: function ()
      {
        window.cy = this;

        var edges = cy.edges();
//        console.log(edges.length);

        for (var i = 0; i < edges.length; i++) {
          var edge = edges[i];
          var result = sbgnBendPointUtilities.convertToRelativeBendPositions(edge);

          if (result.distances.length > 0) {
            edge.data('weights', result.weights);
            edge.data('distances', result.distances);
          }
        }

//        refreshEmptyComplexesOrCompartments();
        refreshPaddings();
        initilizeUnselectedDataOfElements();

        cy.nodes('[sbgnclass="complex"],[sbgnclass="compartment"],[sbgnclass="submap"]').data('expanded-collapsed', 'expanded');

        cy.noderesize({
          handleColor: '#000000', // the colour of the handle and the line drawn from it
          hoverDelay: 1, // time spend over a target node before it is considered a target selection
          enabled: true, // whether to start the plugin in the enabled state
          minNodeWidth: 30,
          minNodeHeight: 30,
          triangleSize: 10,
          lines: 3,
          padding: 5,
          start: function (sourceNode) {
            // fired when noderesize interaction starts (drag on handle)
            var param = {
              node: sourceNode,
              firstTime: true
            };
            editorActionsManager._do(new ResizeNodeCommand(param));
            refreshUndoRedoButtonsStatus();
          },
          complete: function (sourceNode, targetNodes, addedEntities) {
            // fired when noderesize is done and entities are added
          },
          stop: function (sourceNode) {
            sourceNode._private.data.sbgnbbox.w = sourceNode.width();
            sourceNode._private.data.sbgnbbox.h = sourceNode.height();
          }
        });

        //For adding edges interactively
        cy.edgehandles({
          complete: function (sourceNode, targetNodes, addedEntities) {
            // fired when edgehandles is done and entities are added
            var param = {};
            var source = sourceNode.id();
            var target = targetNodes[0].id();
            var sourceClass = sourceNode.data('sbgnclass');
            var targetClass = targetNodes[0].data('sbgnclass');
            var sbgnclass = modeHandler.elementsHTMLNameToName[modeHandler.selectedEdgeType];

            if (sbgnclass == 'consumption' || sbgnclass == 'modulation'
                    || sbgnclass == 'stimulation' || sbgnclass == 'catalysis'
                    || sbgnclass == 'inhibition' || sbgnclass == 'necessary stimulation') {
              if (!isEPNClass(sourceClass) || !isPNClass(targetClass)) {
                if (isPNClass(sourceClass) && isEPNClass(targetClass)) {
                  //If just the direction is not valid reverse the direction
                  var temp = source;
                  source = target;
                  target = temp;
                }
                else {
                  return;
                }
              }
            }
            else if (sbgnclass == 'production') {
              if (!isPNClass(sourceClass) || !isEPNClass(targetClass)) {
                if (isEPNClass(sourceClass) && isPNClass(targetClass)) {
                  //If just the direction is not valid reverse the direction
                  var temp = source;
                  source = target;
                  target = temp;
                }
                else {
                  return;
                }
              }
            }
            else if (sbgnclass == 'logic arc') {
              if (!isEPNClass(sourceClass) || !isLogicalOperator(targetClass)) {
                if (isLogicalOperator(sourceClass) && isEPNClass(targetClass)) {
                  //If just the direction is not valid reverse the direction
                  var temp = source;
                  source = target;
                  target = temp;
                }
                else {
                  return;
                }
              }
            }
            else if (sbgnclass == 'equivalence arc') {
              if (!(isEPNClass(sourceClass) && convenientToEquivalence(targetClass))
                      && !(isEPNClass(targetClass) && convenientToEquivalence(sourceClass))) {
                return;
              }
            }

            param.newEdge = {
              source: source,
              target: target,
              sbgnclass: sbgnclass
            };
            param.firstTime = true;
            editorActionsManager._do(new AddEdgeCommand(param));
            modeHandler.setSelectionMode();
            cy.edges()[cy.edges().length - 1].select();
            refreshUndoRedoButtonsStatus();
          }
        });

        cy.edgehandles('drawoff');

        expandCollapseUtilities.initCollapsedNodes();

        editorActionsManager.reset();
        refreshUndoRedoButtonsStatus();

//        cy.panzoom({
//          // options here...
//        });
        var panProps = ({
          fitPadding: 10
        });
        container.cytoscapePanzoom(panProps);

        var lastMouseDownNodeInfo = null;
        cy.on("mousedown", "node", function () {
          var self = this;
          if (modeHandler.mode == 'selection-mode' && window.ctrlKeyDown) {
            enableDragAndDropMode();
            window.nodeToDragAndDrop = self;
          }
          else {
            lastMouseDownNodeInfo = {};
            lastMouseDownNodeInfo.lastMouseDownPosition = {
              x: this.position("x"),
              y: this.position("y")
            };
            lastMouseDownNodeInfo.node = this;
          }
        });

        cy.on("mouseup", function (event) {
          var self = event.cyTarget;
          if (window.dragAndDropModeEnabled) {
            var nodesData = getNodesData();
            nodesData.firstTime = true;
            var newParent;
            if (self != cy) {
              newParent = self;
            }
            var node = window.nodeToDragAndDrop;

            if (newParent && self.data("sbgnclass") != "complex" && self.data("sbgnclass") != "compartment") {
              return;
            }

            if (newParent && self.data("sbgnclass") == "complex" && !isEPNClass(node.data("sbgnclass"))) {
              return;
            }

            disableDragAndDropMode();
            if (node.parent()[0] == newParent || node._private.data.parent == node.id()) {
              return;
            }
            var param = {
              newParent: newParent,
              node: node,
              nodesData: nodesData,
              posX: event.cyPosition.x,
              posY: event.cyPosition.y
            };
            editorActionsManager._do(new changeParentCommand(param));
          }
        });

        cy.on("mouseup", "node", function () {
          if (window.dragAndDropModeEnabled) {
            return;
          }
          if (lastMouseDownNodeInfo == null) {
            return;
          }
          var node = lastMouseDownNodeInfo.node;
          var lastMouseDownPosition = lastMouseDownNodeInfo.lastMouseDownPosition;
          var mouseUpPosition = {
            x: node.position("x"),
            y: node.position("y")
          };
          if (mouseUpPosition.x != lastMouseDownPosition.x ||
                  mouseUpPosition.y != lastMouseDownPosition.y) {
            var positionDiff = {
              x: mouseUpPosition.x - lastMouseDownPosition.x,
              y: mouseUpPosition.y - lastMouseDownPosition.y
            };

            var nodes;
            if (node.selected()) {
              nodes = cy.nodes(":visible").filter(":selected");
            }
            else {
              nodes = [];
              nodes.push(node);
            }

            var param = {
              positionDiff: positionDiff,
              nodes: nodes, move: false
            };
            editorActionsManager._do(new MoveNodeCommand(param));

            lastMouseDownNodeInfo = null;
            refreshUndoRedoButtonsStatus();
          }
        });

        cy.on('mouseover', 'node', function (event) {
          var node = this;
          if (modeHandler.mode != "selection-mode") {
            node.mouseover = false;
          }
          else if (!node.mouseover) {
            node.mouseover = true;
            //make preset layout to redraw the nodes
            cy.forceRender();
          }

          $(".qtip").remove();

          if (event.originalEvent.shiftKey)
            return;

          node.qtipTimeOutFcn = setTimeout(function () {
            nodeQtipFunction(node);
          }, 1000);
        });

        cy.on('mouseout', 'node', function (event) {
          if (this.qtipTimeOutFcn != null) {
            clearTimeout(this.qtipTimeOutFcn);
            this.qtipTimeOutFcn = null;
          }
          this.mouseover = false;           //make preset layout to redraw the nodes
          cy.forceRender();
        });

        cy.on('cxttap', 'edge', function (event) {
          var edge = this;
          var containerPos = $(cy.container()).position();

          var left = containerPos.left + event.cyRenderedPosition.x;
          left = left.toString() + 'px';

          var top = containerPos.top + event.cyRenderedPosition.y;
          top = top.toString() + 'px';

//          var ctxMenu = document.getElementById("edge-ctx-menu");
//          ctxMenu.style.display = "block";
//          ctxMenu.style.left = left;
//          ctxMenu.style.top = top;

          $('.ctx-bend-operation').css('display', 'none');

          var selectedBendIndex = cytoscape.sbgn.getContainingBendShapeIndex(event.cyPosition.x, event.cyPosition.y, edge);
          if (selectedBendIndex == -1) {
            $('#ctx-add-bend-point').css('display', 'block');
            sbgnBendPointUtilities.currentCtxPos = event.cyPosition;
            ctxMenu = document.getElementById("ctx-add-bend-point");
          }
          else {
            $('#ctx-remove-bend-point').css('display', 'block');
            sbgnBendPointUtilities.currentBendIndex = selectedBendIndex;
            ctxMenu = document.getElementById("ctx-remove-bend-point");
          }

          ctxMenu.style.display = "block";
          ctxMenu.style.left = left;
          ctxMenu.style.top = top;

          sbgnBendPointUtilities.currentCtxEdge = edge;
        });

        var movedBendIndex;
        var movedBendEdge;
        var moveBendParam;

        cy.on('tapstart', 'edge', function (event) {
          var edge = this;
          movedBendEdge = edge;

          moveBendParam = {
            edge: edge,
            weights: edge.data('weights') ? [].concat(edge.data('weights')) : edge.data('weights'),
            distances: edge.data('distances') ? [].concat(edge.data('distances')) : edge.data('distances')
          };

          var cyPosX = event.cyPosition.x;
          var cyPosY = event.cyPosition.y;

          if (edge._private.selected) {
            var index = cytoscape.sbgn.getContainingBendShapeIndex(cyPosX, cyPosY, edge);
            if (index != -1) {
              movedBendIndex = index;
              cy.panningEnabled(false);
              cy.boxSelectionEnabled(false);
            }
          }
        });

        cy.on('tapdrag', function (event) {
          var edge = movedBendEdge;

          if (movedBendEdge === undefined || movedBendIndex === undefined) {
            return;
          }

          var weights = edge.data('weights');
          var distances = edge.data('distances');

          var relativeBendPosition = sbgnBendPointUtilities.convertToRelativeBendPosition(edge, event.cyPosition);
          weights[movedBendIndex] = relativeBendPosition.weight;
          distances[movedBendIndex] = relativeBendPosition.distance;

          edge.data('weights', weights);
          edge.data('distances', distances);
        });

        cy.on('tapend', 'edge', function (event) {
          var edge = movedBendEdge;

          if (moveBendParam !== undefined && edge.data('weights')
                  && edge.data('weights').toString() != moveBendParam.weights.toString()) {
            editorActionsManager._do(new changeBendPointsCommand(moveBendParam));
            refreshUndoRedoButtonsStatus();
          }

          movedBendIndex = undefined;
          movedBendEdge = undefined;
          moveBendParam = undefined;

          cy.panningEnabled(true);
          cy.boxSelectionEnabled(true);
        });

        cy.on('cxttap', 'node', function (event) {
          var node = this;
          $(".qtip").remove();

          if (node.qtipTimeOutFcn != null) {
            clearTimeout(node.qtipTimeOutFcn);
            node.qtipTimeOutFcn = null;
          }

          var geneClass = node._private.data.sbgnclass;
          if (geneClass != 'macromolecule' && geneClass != 'nucleic acid feature' &&
                  geneClass != 'unspecified entity')
            return;

          var queryScriptURL = "sampleapp-components/php/BioGeneQuery.php";
          var geneName = node._private.data.sbgnlabel;

          // set the query parameters
          var queryParams =
                  {
                    query: geneName,
                    org: "human",
                    format: "json",
                  };

          cy.getElementById(node.id()).qtip({
            content: {
              text: function (event, api) {
                $.ajax({
                  type: "POST",
                  url: queryScriptURL,
                  async: true,
                  data: queryParams,
                })
                        .then(function (content) {
                          queryResult = JSON.parse(content);
                          if (queryResult.count > 0 && queryParams.query != "" && typeof queryParams.query != 'undefined')
                          {
                            var info = (new BioGeneView(
                                    {
                                      el: '#biogene-container',
                                      model: queryResult.geneInfo[0]
                                    })).render();
                            var html = $('#biogene-container').html();
                            api.set('content.text', html);
                          }
                          else {
                            api.set('content.text', "No additional information available &#013; for the selected node!");
                          }
                        }, function (xhr, status, error) {
                          api.set('content.text', "Error retrieving data: " + error);
                        });
                api.set('content.title', node._private.data.sbgnlabel);
                return _.template($("#loading-small-template").html());
              }
            },
            show: {
              ready: true
            },
            position: {
              my: 'top center',
              at: 'bottom center',
              adjust: {
                cyViewport: true
              },
              effect: false
            },
            style: {
              classes: 'qtip-bootstrap',
              tip: {
                width: 16,
                height: 8
              }
            }
          });
        });

//        var cancelSelection;
//        var selectAgain;
        window.firstSelectedNode = null;
        cy.on('select', 'node', function (event) {
//          if (cancelSelection) {
//            this.unselect();
//            cancelSelection = null;
//            selectAgain.select();
//            selectAgain = null;
//          }
          if (cy.nodes(':selected').filter(':visible').length == 1) {
            window.firstSelectedNode = this;
          }
        });

        cy.on('unselect', 'node', function (event) {
          if (window.firstSelectedNode == this) {
            window.firstSelectedNode = null;
          }
        });

        cy.on('select', function (event) {
          handleSBGNInspector();
        });

        cy.on('unselect', function (event) {
          handleSBGNInspector();
        });

        cy.on('tap', function (event) {
          $('input').blur();
          $('.ctx-bend-operation').css('display', 'none');
//          $("#node-label-textbox").blur();
          cy.nodes(":selected").length;

          if (modeHandler.mode == "add-node-mode") {
            var cyPosX = event.cyPosition.x;
            var cyPosY = event.cyPosition.y;
            var param = {};
            var sbgnclass = modeHandler.elementsHTMLNameToName[modeHandler.selectedNodeType];
            param.newNode = {
              x: cyPosX,
              y: cyPosY,
              sbgnclass: sbgnclass
            };
            param.firstTime = true;
            editorActionsManager._do(new AddNodeCommand(param));
            modeHandler.setSelectionMode();
            cy.nodes()[cy.nodes().length - 1].select();
            refreshUndoRedoButtonsStatus();
          }
        });

        var tappedBefore = null;

        cy.on('doubleTap', 'node', function (event) {
          if (modeHandler.mode == 'selection-mode') {
            var node = this;
            var containerPos = $(cy.container()).position();
            var left = containerPos.left + this.renderedPosition().x;
            left -= $("#node-label-textbox").width() / 2;
            left = left.toString() + 'px';
            var top = containerPos.top + this.renderedPosition().y;
            top -= $("#node-label-textbox").height() / 2;
            top = top.toString() + 'px';

            $("#node-label-textbox").css('left', left);
            $("#node-label-textbox").css('top', top);
            $("#node-label-textbox").show();
            var sbgnlabel = this._private.data.sbgnlabel;
            if (sbgnlabel == null) {
              sbgnlabel = "";
            }
            $("#node-label-textbox").attr('value', sbgnlabel);
            $("#node-label-textbox").data('node', this);
            $("#node-label-textbox").focus();
          }
        });

        cy.on('tap', 'node', function (event) {
          var node = this;

          var tappedNow = event.cyTarget;
          setTimeout(function () {
            tappedBefore = null;
          }, 300);
          if (tappedBefore === tappedNow) {
            tappedNow.trigger('doubleTap');
            tappedBefore = null;
          } else {
            tappedBefore = tappedNow;
          }

          //Handle expand-collapse box
          var cyPosX = event.cyPosition.x;
          var cyPosY = event.cyPosition.y;

          if (modeHandler.mode == "selection-mode"
                  && cyPosX >= node._private.data.expandcollapseStartX
                  && cyPosX <= node._private.data.expandcollapseEndX
                  && cyPosY >= node._private.data.expandcollapseStartY
                  && cyPosY <= node._private.data.expandcollapseEndY) {
//            selectAgain = cy.filter(":selected");
//            cancelSelection = true;
            var expandedOrcollapsed = this.data('expanded-collapsed');

            var fishEyeViewAfterExpandCollapse =
                    (sbgnStyleRules['fish-eye-view-after-expand-collapse'] == 'true');
            
            if (expandedOrcollapsed == 'expanded') {
//              expandCollapseUtilities.collapseNode(this);
              if (fishEyeViewAfterExpandCollapse)
                editorActionsManager._do(new CollapseNodeCommand({
                  node: this,
                  firstTime: true
                }));
              else
                editorActionsManager._do(new SimpleCollapseNodeCommand(this));
              refreshUndoRedoButtonsStatus();
            }
            else {
              if (fishEyeViewAfterExpandCollapse)
                editorActionsManager._do(new ExpandNodeCommand({
                  node: this,
                  firstTime: true
                }));
              else
                editorActionsManager._do(new SimpleExpandNodeCommand(this));
              refreshUndoRedoButtonsStatus();
//              expandCollapseUtilities.expandNode(this);
            }
          }

          $(".qtip").remove();

          if (event.originalEvent.shiftKey)
            return;

          if (node.qtipTimeOutFcn != null) {
            clearTimeout(node.qtipTimeOutFcn);
            node.qtipTimeOutFcn = null;
          }

          nodeQtipFunction(node);

        });
      }
    };
    container.html("");
    container.cy(cyOptions);
    return this;
  }
});

var SBGNLayout = Backbone.View.extend({
  defaultLayoutProperties: {
    name: 'cose-bilkent',
    nodeRepulsion: 4500,
    nodeOverlap: 10,
    idealEdgeLength: 50,
    edgeElasticity: 0.45,
    nestingFactor: 0.1,
    gravity: 0.25,
    numIter: 2500,
    tile: true,
    animate: false,
    randomize: true,
    tilingPaddingVertical: function () {
      return calculateTilingPaddings(parseInt(sbgnStyleRules['tiling-padding-vertical'], 10));
    },
    tilingPaddingHorizontal: function () {
      return calculateTilingPaddings(parseInt(sbgnStyleRules['tiling-padding-horizontal'], 10));
    }
  },
  currentLayoutProperties: null,
  initialize: function () {
    var self = this;
    self.copyProperties();

    var templateProperties = _.clone(self.currentLayoutProperties);
    templateProperties.tilingPaddingVertical = sbgnStyleRules['tiling-padding-vertical'];
    templateProperties.tilingPaddingHorizontal = sbgnStyleRules['tiling-padding-horizontal'];

    self.template = _.template($("#layout-settings-template").html(), templateProperties);
  },
  copyProperties: function () {
    this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
  },
  applyLayout: function () {
    var options = this.currentLayoutProperties;
    options.fit = options.randomize;
    cy.elements().filter(':visible').layout(options);
  },
  applyIncrementalLayout: function () {
    var options = _.clone(this.currentLayoutProperties);
    options.randomize = false;
    options.animate = false;
    options.fit = false;
//    options.stop = function(){
//      cy.center(cy.elements(':visible'));
//    };
    cy.elements().filter(':visible').layout(options);
  },
  render: function () {
    var self = this;

    var templateProperties = _.clone(self.currentLayoutProperties);
    templateProperties.tilingPaddingVertical = sbgnStyleRules['tiling-padding-vertical'];
    templateProperties.tilingPaddingHorizontal = sbgnStyleRules['tiling-padding-horizontal'];

    self.template = _.template($("#layout-settings-template").html(), templateProperties);
    $(self.el).html(self.template);

    $(self.el).dialog();

    $("#save-layout").die("click").live("click", function (evt) {
      self.currentLayoutProperties.nodeRepulsion = Number(document.getElementById("node-repulsion").value);
      self.currentLayoutProperties.nodeOverlap = Number(document.getElementById("node-overlap").value);
      self.currentLayoutProperties.idealEdgeLength = Number(document.getElementById("ideal-edge-length").value);
      self.currentLayoutProperties.edgeElasticity = Number(document.getElementById("edge-elasticity").value);
      self.currentLayoutProperties.nestingFactor = Number(document.getElementById("nesting-factor").value);
      self.currentLayoutProperties.gravity = Number(document.getElementById("gravity").value);
      self.currentLayoutProperties.numIter = Number(document.getElementById("num-iter").value);
      self.currentLayoutProperties.tile = document.getElementById("tile").checked;
      self.currentLayoutProperties.animate = document.getElementById("animate").checked;
      self.currentLayoutProperties.randomize = !document.getElementById("incremental").checked;

      sbgnStyleRules['tiling-padding-vertical'] = Number(document.getElementById("tiling-padding-vertical").value);
      sbgnStyleRules['tiling-padding-horizontal'] = Number(document.getElementById("tiling-padding-horizontal").value);

      $(self.el).dialog('close');
    });

    $("#default-layout").die("click").live("click", function (evt) {
      self.copyProperties();

      sbgnStyleRules['tiling-padding-vertical'] = defaultSbgnStyleRules['tiling-padding-vertical'];
      sbgnStyleRules['tiling-padding-horizontal'] = defaultSbgnStyleRules['tiling-padding-horizontal'];

      var templateProperties = _.clone(self.currentLayoutProperties);
      templateProperties.tilingPaddingVertical = sbgnStyleRules['tiling-padding-vertical'];
      templateProperties.tilingPaddingHorizontal = sbgnStyleRules['tiling-padding-horizontal'];

      self.template = _.template($("#layout-settings-template").html(), templateProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});

var SBGNProperties = Backbone.View.extend({
  defaultSBGNProperties: {
    compoundPadding: parseInt(sbgnStyleRules['compound-padding'], 10),
    dynamicLabelSize: sbgnStyleRules['dynamic-label-size'],
    fitLabelsToNodes: (sbgnStyleRules['fit-labels-to-nodes'] == 'true'),
    fishEyeViewAfterExpandCollapse: (sbgnStyleRules['fish-eye-view-after-expand-collapse'] == 'true')
  },
  currentSBGNProperties: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    self.template = _.template($("#sbgn-properties-template").html(), self.currentSBGNProperties);
  },
  copyProperties: function () {
    this.currentSBGNProperties = _.clone(this.defaultSBGNProperties);
  },
  render: function () {
    var self = this;
    self.template = _.template($("#sbgn-properties-template").html(), self.currentSBGNProperties);
    $(self.el).html(self.template);

    $(self.el).dialog();

    $("#save-sbgn").die("click").live("click", function (evt) {

      var param = {};
      param.firstTime = true;
      param.previousSBGNProperties = _.clone(self.currentSBGNProperties);

      self.currentSBGNProperties.compoundPadding = Number(document.getElementById("compound-padding").value);
      self.currentSBGNProperties.dynamicLabelSize = $('select[name="dynamic-label-size"] option:selected').val();
      self.currentSBGNProperties.fitLabelsToNodes = document.getElementById("fit-labels-to-nodes").checked;
      self.currentSBGNProperties.fishEyeViewAfterExpandCollapse =
              document.getElementById("fish-eye-view-after-expand-collapse").checked;

      //Refresh paddings if needed
      if (sbgnStyleRules['compound-padding'] != self.currentSBGNProperties.compoundPadding) {
        sbgnStyleRules['compound-padding'] = self.currentSBGNProperties.compoundPadding;
        refreshPaddings();
      }
      //Refresh label size if needed
      if (sbgnStyleRules['dynamic-label-size'] != self.currentSBGNProperties.dynamicLabelSize) {
        sbgnStyleRules['dynamic-label-size'] = '' + self.currentSBGNProperties.dynamicLabelSize;
        cy.nodes().removeClass('changeLabelTextSize');
        cy.nodes().addClass('changeLabelTextSize');
      }
      //Refresh truncations if needed
      if (sbgnStyleRules['fit-labels-to-nodes'] != self.currentSBGNProperties.fitLabelsToNodes) {
        sbgnStyleRules['fit-labels-to-nodes'] = '' + self.currentSBGNProperties.fitLabelsToNodes;
        cy.nodes().removeClass('changeContent');
        cy.nodes().addClass('changeContent');
      }

      sbgnStyleRules['fish-eye-view-after-expand-collapse'] =
              '' + self.currentSBGNProperties.fishEyeViewAfterExpandCollapse;

      $(self.el).dialog('close');
    });

    $("#default-sbgn").die("click").live("click", function (evt) {
      self.copyProperties();
      self.template = _.template($("#sbgn-properties-template").html(), self.currentSBGNProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});

var PathsBetweenQuery = Backbone.View.extend({
  defaultQueryParameters: {
    geneSymbols: "",
    lengthLimit: 1
//    shortestK: 0,
//    enableShortestKAlteration: false,
//    ignoreS2SandT2TTargets: false
  },
  currentQueryParameters: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    self.template = _.template($("#query-pathsbetween-template").html(), self.currentQueryParameters);
  },
  copyProperties: function () {
    this.currentQueryParameters = _.clone(this.defaultQueryParameters);
  },
  render: function () {
    var self = this;
    self.template = _.template($("#query-pathsbetween-template").html(), self.currentQueryParameters);
    $(self.el).html(self.template);

    $("#query-pathsbetween-enable-shortest-k-alteration").change(function(e){
      if(document.getElementById("query-pathsbetween-enable-shortest-k-alteration").checked){
        $( "#query-pathsbetween-shortest-k" ).prop( "disabled", false );
      }
      else {
        $( "#query-pathsbetween-shortest-k" ).prop( "disabled", true );
      }
    });

    $(self.el).dialog({width:'auto'});

    $("#save-query-pathsbetween").die("click").live("click", function (evt) {

      self.currentQueryParameters.geneSymbols = document.getElementById("query-pathsbetween-gene-symbols").value;
      self.currentQueryParameters.lengthLimit = Number(document.getElementById("query-pathsbetween-length-limit").value);
//      self.currentQueryParameters.shortestK = Number(document.getElementById("query-pathsbetween-shortest-k").value);
//      self.currentQueryParameters.enableShortestKAlteration =
//              document.getElementById("query-pathsbetween-enable-shortest-k-alteration").checked;
//      self.currentQueryParameters.ignoreS2SandT2TTargets =
//              document.getElementById("query-pathsbetween-ignore-s2s-t2t-targets").checked;
      
      var pc2URL = "http://www.pathwaycommons.org/pc2/";
      var format = "graph?format=SBGN";
      var kind = "&kind=PATHSBETWEEN";
      var limit = "&limit=" + self.currentQueryParameters.lengthLimit;
      var sources = "";
      var newfilename = "";
      
      var geneSymbolsArray = self.currentQueryParameters.geneSymbols.replace("\n"," ").replace("\t"," ").split(" ");
      for(var i = 0; i < geneSymbolsArray.length; i++){
        var currentGeneSymbol = geneSymbolsArray[i];
        if(currentGeneSymbol.length == 0 || currentGeneSymbol == ' ' || currentGeneSymbol == '\n' || currentGeneSymbol == '\t'){
          continue;
        }
        
        sources = sources + "&source=" + currentGeneSymbol;
        
        if(newfilename == ''){
          newfilename = currentGeneSymbol;
        }
        else{
          newfilename = newfilename + '_' + currentGeneSymbol;
        }
      }
      
      newfilename = newfilename + '_PBTWN.sbgnml';
      
      setFileContent(newfilename);
      pc2URL = pc2URL + format + kind + limit + sources;
      
      $('#sbgn-network-container').html('<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>');
      
      $.ajax(
      {
        url: pc2URL,
        type: 'GET',
        success: function(data)
        {
          (new SBGNContainer({
            el: '#sbgn-network-container',
            model: {cytoscapeJsGraph: sbgnmlToJson.convert(data)}
          })).render();
          handleSBGNInspector();
        }
      });
      
      $(self.el).dialog('close');
    });
    
    $("#cancel-query-pathsbetween").die("click").live("click", function (evt) {
      $(self.el).dialog('close');
    });
    
    return this;
  }
});