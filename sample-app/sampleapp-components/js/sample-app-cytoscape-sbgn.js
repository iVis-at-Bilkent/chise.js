

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
    $(".nav-menu").width(windowWidth * 0.9);
    $(".navbar").width(windowWidth * 0.9);
//    $("#sbgn-info-content").width(windowWidth * 0.85);
    $("#sbgn-toolbar").width(windowWidth * 0.9);
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

//Returns true for unspecified entity, 
//simple chemical, macromolecule, nucleic acid feature, and complexes
//As they may have some specific node properties(state variables, units of information etc.)
var isSpecialSBGNNodeClass = function (sbgnclass) {
  if (sbgnclass == 'unspecified entity' || sbgnclass == 'simple chemical'
          || sbgnclass == 'macromolecule' || sbgnclass == 'nucleic acid feature'
          || sbgnclass == 'complex'
          || sbgnclass == 'unspecified entity multimer' || sbgnclass == 'simple chemical multimer'
          || sbgnclass == 'macromolecule multimer' || sbgnclass == 'nucleic acid feature multimer'
          || sbgnclass == 'complex multimer') {
    return true;
  }
  return false;
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

var fillInspectorStateAndInfos = function (node, width) {
  //first empty the state variables and infos data in inspector
  $("#inspector-state-variables").html("");
  $("#inspector-unit-of-informations").html("");
  var stateAndInfos = node._private.data.sbgnstatesandinfos;
  for (var i = 0; i < stateAndInfos.length; i++) {
    var state = stateAndInfos[i];
    if (state.clazz == "state variable") {
      $("#inspector-state-variables").append("<div><input type='text' class='just-added-inspector-input inspector-state-variable-value' style='width: "
              + width / 5 + "px' value='" + state.state.value + "'/>"
              + "<span width='" + width / 5 + "'px>@</span>"
              + "<input type='text' class='just-added-inspector-input inspector-state-variable-variable' style='width: "
              + width / 2.5 + "px' value='" + state.state.variable
              + "'/><img width='12px' height='12px' class='just-added-inspector-input inspector-delete-state-and-info' src='sampleapp-images/delete.png'></img></div>");

      $(".inspector-state-variable-value").unbind('change').on('change', function () {
        var param = {
          state: $(this).data("state"),
          valueOrVariable: $(this).attr('value'),
          type: 'value',
          node: node,
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
          node: node,
          width: width
        };
        editorActionsManager._do(new ChangeStateVariableCommand(param));
        refreshUndoRedoButtonsStatus();
//        $(this).data("state").state.variable = $(this).attr('value');
//        cy.forceRender();
      });
    }
    else if (state.clazz == "unit of information") {
      var total = width / 5 + width / 5 + width / 2.5;
      $("#inspector-unit-of-informations").append("<div><input type='text' class='just-added-inspector-input inspector-unit-of-information-label' style='width: "
              + total + "px' value='" + state.label.text
              + "'/><img width='12px' height='12px' class='just-added-inspector-input inspector-delete-state-and-info' src='sampleapp-images/delete.png'></img></div>");

      $(".inspector-unit-of-information-label").unbind('change').on('change', function () {
        var param = {
          state: $(this).data("state"),
          text: $(this).attr('value'),
          node: node,
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
        node: node,
        width: width
      };
      editorActionsManager._do(new RemoveStateAndInfoCommand(param));
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
      node: node,
      width: width
    };
    editorActionsManager._do(new AddStateAndInfoCommand(param));
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
      node: node,
      width: width
    };
    editorActionsManager._do(new AddStateAndInfoCommand(param));
  });
}

var handleSBGNInspector = function () {
  var selectedEles = cy.elements(":selected");
  var width = $("#sbgn-inspector").width() * 0.45;
  if (selectedEles.length == 1) {
    var selected = selectedEles[0];
    var title = selected.data("sbgnlabel");
    if (title == null) {
      title = selected.data("sbgnclass");
      if(title == 'and' || title == 'or' || title == 'not'){
        title = title.toUpperCase();
      }
      else{
        title = title.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        title = title.replace(' Of ', ' of ');
        title = title.replace(' And ', ' and ');
        title = title.replace(' Or ', ' or ');
        title = title.replace(' Not ', ' not ');
      }
    }

    var buttonwidth = width;
    if (buttonwidth > 50) {
      buttonwidth = 50;
    }

    var html = "<div style='text-align: center; color: black; font-weight: bold;'>" + title + "</div><table>";
    var type;
    if (selectedEles.nodes().length == 1) {
      type = "node";

      html += "<tr><td style='width: " + width + "px'>" + "<font size='2'>Border Color</font>" + "</td><td>"
              + "<input id='inspector-border-color' type='color' style='width: " + buttonwidth + "px;' value='" + selected.data('borderColor')
              + "'/>" + "</td></tr>";
      html += "<tr><td style='width: " + width + "px'>" + "<font size='2'>Fill Color</font>" + "</td><td>"
              + "<input id='inspector-fill-color' type='color' style='width: " + buttonwidth + "px;' value='" + selected.css('background-color')
              + "'/>" + "</td></tr>";
      html += "<tr><td style='width: " + width + "px'>" + "<font size='2'>Border Width</font>" + "</td><td>"
              + "<input id='inspector-border-width' type='number' step='0.01' min='0' style='width: " + buttonwidth + "px;' value='" + parseFloat(selected.css('border-width'))
              + "'/>" + "</td></tr>";
      html += "<tr><td style='width: " + width + "px'>" + "<font size='2'>Fill Opacity</font>" + "</td><td>"
              + "<input id='inspector-background-opacity' type='range' step='0.01' min='0' max='1' style='width: " + buttonwidth + "px;' value='" + parseFloat(selected.data('backgroundOpacity'))
              + "'/>" + "</td></tr>";
      if (isSpecialSBGNNodeClass(selected.data('sbgnclass'))) {
        html += "<tr style='border: 1px solid #ddd;'><td style='width: " + width + "px'>" + "<font size='2'>State Variables</font>" + "</td>"
                + "<td id='inspector-state-variables' style='width: '" + width + "'></td></tr>";

        html += "<tr style='border: 1px solid #ddd;'><td style='width: " + width + "px'>" + "<font size='2'>Units Of Information</font>" + "</td>"
                + "<td id='inspector-unit-of-informations' style='width: '" + width + "'></td></tr>";

        html += "<tr><td style='width: " + width + "px'>" + "<font size='2'>Multimer</font>" + "</td>"
                + "<td style='width: '" + width + "'><input type='checkbox' id='inspector-is-multimer'></td></tr>";

        html += "<tr><td style='width: " + width + "px'>" + "<font size='2'>Cloned</font>" + "</td>"
                + "<td style='width: '" + width + "'><input type='checkbox' id='inspector-is-clone-marker'></td></tr>";
      }

    }
    else {
      type = "edge";
      html += "<tr><td style='width: " + width + "px'>" + "<font size='2'>Fill Color</font>" + "</td><td>"
              + "<input id='inspector-line-color' type='color' style='width: " + buttonwidth + "px;' value='" + selected.data('lineColor')
              + "'/>" + "</td></tr>";

      html += "<tr><td style='width: " + width + "px'>" + "<font size='2'>Width</font>" + "</td><td>"
              + "<input id='inspector-width' type='number' step='0.01' min='0' style='width: " + buttonwidth + "px;' value='" + parseFloat(selected.css('width'))
              + "'/>" + "</td></tr>";
      if(selected.data('sbgnclass') == 'consumption' || selected.data('sbgnclass') == 'production'){
        html += "<tr><td style='width: " + width + "px'>" + "<font size='2'>Cardinality</font>" + "</td><td>"
              + "<input id='inspector-cardinality' type='number' min='0' style='width: " + buttonwidth + "px;' value='" + parseFloat(selected.data('sbgncardinality'))
              + "'/>" + "</td></tr>";
      }
      
    }
    html += "</table>";
    html += "<div style='text-align: center;'><button style='align: center;' id='inspector-set-as-default-button'"
            + ">Set as Default</button></div>";
//    html += "<button type='button' style='display: block; margin: 0 auto;' class='btn btn-default' id='inspector-apply-button'>Apply Changes</button>";
    $("#sbgn-inspector").html(html);

    if (type == "node") {
      if (isSpecialSBGNNodeClass(selected.data('sbgnclass'))) {
        fillInspectorStateAndInfos(selected, width);
        if (selected.data('sbgnclass').endsWith(' multimer')) {
          $('#inspector-is-multimer').attr('checked', true);
        }
        if (selected.data('sbgnclonemarker')) {
          $('#inspector-is-clone-marker').attr('checked', true);
        }
      }

      $('#inspector-set-as-default-button').on('click', function () {
        var multimer;
        var sbgnclass = selected.data('sbgnclass');
        if(sbgnclass.endsWith(' multimer')){
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
          node: selected
        };
        editorActionsManager._do(new changeIsMultimerStatusCommand(param));
      });

      $('#inspector-is-clone-marker').on('click', function () {
        var param = {
          makeCloneMarker: $('#inspector-is-clone-marker').attr('checked') == 'checked',
          node: selected
        };
        editorActionsManager._do(new changeIsCloneMarkerStatusCommand(param));
      });

      $("#inspector-border-color").on('change', function () {
        var param = {
          ele: selected,
          data: $("#inspector-border-color").attr("value"),
          dataType: "borderColor"
        };
        editorActionsManager._do(new ChangeStyleDataCommand(param));
      });
      
      $("#inspector-background-opacity").on('change', function () {
        var param = {
          ele: selected,
          data: $("#inspector-background-opacity").attr("value"),
          dataType: "backgroundOpacity"
        };
        editorActionsManager._do(new ChangeStyleDataCommand(param));
      });

      $("#inspector-fill-color").on('change', function () {
        var param = {
          ele: selected,
          data: $("#inspector-fill-color").attr("value"),
          dataType: "background-color"
        };
        editorActionsManager._do(new ChangeStyleCssCommand(param));
      });

      $("#inspector-border-width").bind('change').on('change', function () {
        var param = {
          ele: selected,
          data: $("#inspector-border-width").attr("value"),
          dataType: "border-width"
        };
        editorActionsManager._do(new ChangeStyleCssCommand(param));
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
          ele: selected,
          data: $("#inspector-line-color").attr("value"),
          dataType: "lineColor"
        };
        editorActionsManager._do(new ChangeStyleDataCommand(param));
      });
      
      $("#inspector-cardinality").bind('change').on('change', function () {
        var data = $("#inspector-cardinality").attr("value");
        if(parseInt(data) != data || data < 0){
          return;
        }
        var param = {
          ele: selected,
          data: data,
          dataType: "sbgncardinality"
        };
        editorActionsManager._do(new ChangeStyleDataCommand(param));
      });

      $("#inspector-width").bind('change').on('change', function () {
        var param = {
          ele: selected,
          data: $("#inspector-width").attr("value"),
          dataType: "width"
        };
        editorActionsManager._do(new ChangeStyleCssCommand(param));
      });
    }
  }
  else {
    $("#sbgn-inspector").html("");
  }
}

var makePresetLayout = function () {
  cy.layout({
    name: "preset"
  });
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
}

var refreshPaddings = function () {
  //If compound padding is not set yet set it by css value
  if (window.compoundPadding == null) {
    window.compoundPadding = parseInt(sbgnStyleRules['compound-padding'], 10);
  }
  var nodes = cy.nodes();
  var total = 0;
  var numOfSimples = 0;

  for (var i = 0; i < nodes.length; i++) {
    var theNode = nodes[i];
    if (theNode.children() == null || theNode.children().length == 0) {
      var collapsedChildren = theNode._private.data.collapsedChildren;
      if (collapsedChildren == null || collapsedChildren.length == 0) {
        total += Number(theNode._private.data.sbgnbbox.w);
        total += Number(theNode._private.data.sbgnbbox.h);
        numOfSimples++;
      }
      else {
        var result = expandCollapseUtilities.getCollapsedChildrenData(collapsedChildren, numOfSimples, total);
        numOfSimples = result.numOfSimples;
        total = result.total;
      }
    }
  }

  var calc_padding = (compoundPadding / 100) * Math.floor(total / (2 * numOfSimples));

  if (calc_padding < 10) {
    calc_padding = 10;
  }

  var complexesAndCompartments = cy.$("node[sbgnclass='complex'], node[sbgnclass='compartment']");
  complexesAndCompartments.css('padding-left', calc_padding + 8);
  complexesAndCompartments.css('padding-right', calc_padding + 8);
  complexesAndCompartments.css('padding-top', calc_padding + 8);
  complexesAndCompartments.css('padding-bottom', calc_padding + 8);
  //To refresh the nodes on the screen apply the preset layout
  makePresetLayout();
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

//get the style properties for the given selector
var getStyleRules = function (selector) {
  for (var i = 0; i < sbgnStyleSheet.length; i++) {
    var currentStyle = sbgnStyleSheet[i];
    if (currentStyle.selector == selector) {
      return currentStyle.properties;
    }
  }
};

/*
 * get the style rules for .sbgn selector and fill them into sbgnStyleRules map
 */
var getSBGNStyleRules = function () {
  if (window.sbgnStyleRules == null) {
    var styleRulesList = getStyleRules(".sbgn");
    window.sbgnStyleRules = {};
    for (var i = 0; i < styleRulesList.length; i++) {
      var rule = styleRulesList[i];
      window.sbgnStyleRules[rule.name] = rule.value;
    }
  }
  return sbgnStyleRules;
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
        .selector("node[sbgnclass]")
        .css({
          'shape': 'data(sbgnclass)'
        })
//        .selector("node[!sbgnclass][width][height]")
//        .css({
//          'width': 'data(width)',
//          'height': 'data(height)'
//        })
        .selector("node[sbgnclass='complex']")
        .css({
          'background-color': '#F4F3EE',
          'expanded-collapsed': 'expanded',
          'text-valign': 'bottom',
          'text-halign': 'center',
          'font-size': '16'
        })
        .selector("node[sbgnclass='compartment']")
        .css({
          'border-width': 3.75,
          'background-opacity': 0,
          'background-color': '#FFFFFF',
          'content': 'data(sbgnlabel)',
          'text-valign': 'bottom',
          'text-halign': 'center',
          'font-size': '16',
          'expanded-collapsed': 'expanded'
        })
        .selector("node[sbgnclass='submap']")
        .css({
          'expanded-collapsed': 'expanded'
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
          'line-color': '#555',
          'target-arrow-fill': 'hollow',
          'source-arrow-fill': 'hollow',
          'width': 1.5,
          'target-arrow-color': '#555',
          'source-arrow-color': '#555',
//          'target-arrow-shape': 'data(sbgnclass)'
        })
        .selector("edge[sbgnclass]")
        .css({
          'target-arrow-shape': 'data(sbgnclass)'
        })
        .selector("edge[sbgnclass='inhibition']")
        .css({
          'target-arrow-fill': 'filled'
        })
        .selector("edge[sbgnclass='consumption']")
        .css({
          'target-arrow-shape': 'none',
          'source-arrow-shape': 'data(sbgnclass)',
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
        .selector("node.collapsed")
        .css({
          'width': 60,
          'height': 60
        })
        .selector("node.changeBackgroundOpacity")
        .css({
          'background-opacity': 'data(backgroundOpacity)'
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
        })
        .selector(".sbgn")
        .css({
          'compound-padding': 20,
          'dynamic-label-size': 'regular',
          'fit-labels-to-nodes': 'true',
          'incremental-layout-after-expand-collapse': 'true'
        }); // end of sbgnStyleSheet

//get the sbgn style rules
getSBGNStyleRules();

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

        refreshPaddings();
        initilizeUnselectedDataOfElements();

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
          }
        });

        //For adding edges interactively
        cy.edgehandles({
          complete: function (sourceNode, targetNodes, addedEntities) {
            // fired when edgehandles is done and entities are added
            var param = {};
            param.newEdge = {
              source: sourceNode.id(),
              target: targetNodes[0].id(),
              sbgnclass: modeHandler.elementsHTMLNameToName[modeHandler.selectedEdgeType]
//              sbgnclass: $("#edge-list").data('ddslick').selectedData.value
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

        var panProps = ({
          fitPadding: 10
        });
        container.cytoscapePanzoom(panProps);

        var lastMouseDownNodeInfo = null;
        cy.on("mousedown", "node", function () {
          lastMouseDownNodeInfo = {};
          lastMouseDownNodeInfo.lastMouseDownPosition = {
            x: this.position("x"),
            y: this.position("y")
          };
          lastMouseDownNodeInfo.node = this;
        });

        cy.on("mouseup", "node", function () {
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

        var cancelSelection;
        var selectAgain;
        cy.on('select', 'node', function (event) {
          if (cancelSelection) {
            this.unselect();
            cancelSelection = null;
            selectAgain.select();
            selectAgain = null;
          }
        });

        cy.on('select', function (event) {
          handleSBGNInspector();
        });

        cy.on('unselect', function (event) {
          handleSBGNInspector();
        });

        cy.on('tap', function (event) {
          $("#node-label-textbox").blur();
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
            selectAgain = cy.filter(":selected");
            cancelSelection = true;
            var expandedOrcollapsed = this.css('expanded-collapsed');

            if (window.incrementalLayoutAfterExpandCollapse == null) {
              window.incrementalLayoutAfterExpandCollapse =
                      (sbgnStyleRules['incremental-layout-after-expand-collapse'] == 'true');
            }

            if (expandedOrcollapsed == 'expanded') {
//              expandCollapseUtilities.collapseNode(this);
              if (incrementalLayoutAfterExpandCollapse)
                editorActionsManager._do(new CollapseNodeCommand({
                  node: this,
                  firstTime: true
                }));
              else
                editorActionsManager._do(new SimpleCollapseNodeCommand(this));
              refreshUndoRedoButtonsStatus();
            }
            else {
              if (incrementalLayoutAfterExpandCollapse)
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
    name: 'cose2',
    nodeRepulsion: 4500,
    nodeOverlap: 10,
    idealEdgeLength: 50,
    edgeElasticity: 0.45,
    nestingFactor: 0.1,
    gravity: 0.4,
    numIter: 2500,
    tile: true,
    animate: true,
    randomize: true
  },
  currentLayoutProperties: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    self.template = _.template($("#layout-settings-template").html(), self.currentLayoutProperties);
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
    cy.elements().filter(':visible').layout(options);
  },
  render: function () {
    var self = this;
    self.template = _.template($("#layout-settings-template").html(), self.currentLayoutProperties);
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

      $(self.el).dialog('close');
    });

    $("#default-layout").die("click").live("click", function (evt) {
      self.copyProperties();
      self.template = _.template($("#layout-settings-template").html(), self.currentLayoutProperties);
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
    incrementalLayoutAfterExpandCollapse: (sbgnStyleRules['incremental-layout-after-expand-collapse'] == 'true')
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
      self.currentSBGNProperties.incrementalLayoutAfterExpandCollapse =
              document.getElementById("incremental-layout-after-expand-collapse").checked;

      //Refresh paddings if needed
      if (compoundPadding != self.currentSBGNProperties.compoundPadding) {
        compoundPadding = self.currentSBGNProperties.compoundPadding;
        refreshPaddings();
      }
      //Refresh label size if needed
      if (dynamicLabelSize != self.currentSBGNProperties.dynamicLabelSize) {
        dynamicLabelSize = self.currentSBGNProperties.dynamicLabelSize;
        cy.forceRender();
      }
      //Refresh truncations if needed
      if (fitLabelsToNodes != self.currentSBGNProperties.fitLabelsToNodes) {
        fitLabelsToNodes = self.currentSBGNProperties.fitLabelsToNodes;
        cy.forceRender();
      }

      window.incrementalLayoutAfterExpandCollapse =
              self.currentSBGNProperties.incrementalLayoutAfterExpandCollapse;

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