var modeHandler = {
  mode: "selection-mode",
  selectedNodeType: "macromolecule",
  selectedEdgeType: "inhibition",
  elementsHTMLNameToName: {
    //nodes
    "macromolecule": "macromolecule",
    "simple-molecule": "simple molecule",
    "complex": "complex",
    "process": "process",
    "omitted-process": "omitted process",
    "uncertain-process": "uncertain process",
    "association": "association",
    "phenotype": "phenotype",
    "compartment": "compartment",
    "unspecified-entity": "unspecified entity",
    "nucleic-acid-feature": "nucleic acid feature",
    "source-and-sink": "source and sink",
    "perturbing-agent": "perturbing agent",
    "tag": "tag",
    "and": "and",
    "or": "or",
    "not": "not",
    //edges
    "consumption": "consumption",
    "production": "production",
    "modulation": "modulation",
    "stimulation": "stimulation",
    "catalysis": "catalysis",
    "inhibition": "inhibition",
    "necessary-stimulation": "necessary stimulation",
    "logic-arc": "logic arc"
  },
  initilize: function () {
    $('#node-list').ddslick({
      onSelected: function (data) {
        modeHandler.selectedNodeType = data.selectedData.value;
        modeHandler.setAddNodeMode();
        modeHandler.setSelectedMenuItem("add-node-mode", data.selectedData.value);
      }
    });
    $('#edge-list').ddslick({
      onSelected: function (data) {
        modeHandler.selectedEdgeType = data.selectedData.value;
        modeHandler.setAddEdgeMode();
        modeHandler.setSelectedMenuItem("add-edge-mode", data.selectedData.value);
      }
    });

    $('#select-icon').addClass('selectedType');

    $('#node-list').ddslick('disable');
    $('#edge-list').ddslick('disable');

    this.setSelectedMenuItem("selection-mode");
  },
  setAddNodeMode: function () {
    $('#node-list').ddslick('enable');
    $('#node-list').addClass('selectedType');
//    $('#add-node-menu-item').addClass('selectedMenuItem');

    $('#select-icon').removeClass('selectedType');

    $('#edge-list').removeClass('selectedType');
    $('#edge-list').ddslick('close');
    $('#edge-list').ddslick('disable');

    modeHandler.mode = "add-node-mode";
    cy.autolock(true);
    cy.autounselectify(true);

    cy.edgehandles('drawoff');
  },
  setAddEdgeMode: function () {
    $('#edge-list').ddslick('enable');
    $('#edge-list').addClass('selectedType');
//    $('#add-edge-menu-item').addClass('selectedMenuItem');

    $('#select-icon').removeClass('selectedType');

    $('#node-list').removeClass('selectedType');
    $('#node-list').ddslick('close');
    $('#node-list').ddslick('disable');

    modeHandler.mode = "add-edge-mode";
    cy.autolock(true);
    cy.autounselectify(true);

    cy.edgehandles('drawon');
  },
  setSelectionMode: function () {
    $('#select-icon').addClass('selectedType');
    modeHandler.setSelectedMenuItem("selection-mode");
//    $('#select-edit').addClass('selectedMenuItem');

    $('#edge-list').removeClass('selectedType');
    $('#edge-list').ddslick('close');
    $('#edge-list').ddslick('disable');

    $('#node-list').removeClass('selectedType');
    $('#node-list').ddslick('close');
    $('#node-list').ddslick('disable');

    modeHandler.mode = "selection-mode";
    cy.autolock(false);
    cy.autounselectify(false);

    cy.edgehandles('drawoff');
  },
  setSelectedIndexOfSelector: function (selector, name) {
    var index = $(selector + " li:has(input[value=" + name + "])").index();
    $(selector).ddslick('select', {index: index});
  },
  setSelectedMenuItem: function (mode, name) {
    $(".selectedMenuItem").removeClass("selectedMenuItem");

    if (mode == "selection-mode") {
      $('#select-edit').addClass('selectedMenuItem');
    }
    else if (mode == "add-node-mode") {
      $('#add-node-menu-option').addClass('selectedMenuItem');
      var menuItem = $("#add-node-submenu [name=" + name + "]");
      menuItem.addClass("selectedMenuItem");
      if (menuItem.hasClass("process-type")) {
        $('#process-menu-option').addClass("selectedMenuItem");
      }
      if (menuItem.hasClass("logical-operator-type")) {
        $('#logical-operator-menu-option').addClass("selectedMenuItem");
      }
    }
    else if (mode == "add-edge-mode") {
      $('#add-edge-menu-option').addClass('selectedMenuItem');
      var menuItem = $("#add-edge-submenu [name=" + name + "]");
      menuItem.addClass("selectedMenuItem");
    }
  }
};