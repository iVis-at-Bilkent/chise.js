(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sbgnviz = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function(){
  var chise = function(_options) {

    var param = {};

    // Access the libs
    var libs = _dereq_('./utilities/lib-utilities').getLibs();

    var optionUtilities = _dereq_('./utilities/option-utilities-factory')();
    var options = optionUtilities.extendOptions(_options); // Extends the default options with the given options

    // Create an sbgnviz instance
    var sbgnvizInstanceUtilities = _dereq_('./utilities/sbgnviz-instance-utilities-factory')();
    var sbgnvizInstance = sbgnvizInstanceUtilities(options);

    // Update style and bind events
    var cyStyleAndEvents = _dereq_('./utilities/cy-style-and-events-factory')();

    // Register undo/redo actions
    var registerUndoRedoActions = _dereq_('./utilities/register-undo-redo-actions-factory')();

    var mainUtilities = _dereq_('./utilities/main-utilities-factory')();
    var elementUtilitiesExtender = _dereq_('./utilities/element-utilities-extender-factory')();
    var undoRedoActionFunctionsExtender = _dereq_('./utilities/ur-action-functions-extender-factory')();

    var elementUtilities =  sbgnvizInstance.elementUtilities;
    var undoRedoActionFunctions = sbgnvizInstance.undoRedoActionFunctions;

    param.sbgnvizInstanceUtilities = sbgnvizInstanceUtilities;
    param.optionUtilities = optionUtilities;
    param.elementUtilities = elementUtilities;
    param.undoRedoActionFunctions = undoRedoActionFunctions;

    undoRedoActionFunctionsExtender(param);
    elementUtilitiesExtender(param);
    cyStyleAndEvents(param);
    registerUndoRedoActions(param);
    mainUtilities(param);

    // Expose the api
    var api = {};

    // Expose the properties inherited from sbgnviz
    // then override some of these properties and expose some new properties
    for (var prop in sbgnvizInstance) {
      api[prop] = sbgnvizInstance[prop];
    }

    // Expose each main utility seperately
    for (var prop in mainUtilities) {
      api[prop] = mainUtilities[prop];
    }

    // Expose getSbgnvizInstance()
    api.getSbgnvizInstance = sbgnvizInstanceUtilities.getInstance;

    // Expose elementUtilities and undoRedoActionFunctions as is
    api.elementUtilities = elementUtilities;
    api.undoRedoActionFunctions = undoRedoActionFunctions;

    return api;
  };

  // Register chise with given libraries
  chise.register = function (_libs) {

    var libs = {};
    libs.jQuery = _libs.jQuery || jQuery;
    libs.cytoscape = _libs.cytoscape || cytoscape;
    libs.sbgnviz = _libs.sbgnviz || sbgnviz;
    libs.saveAs = _libs.filesaverjs ? _libs.filesaverjs.saveAs : saveAs;

    libs.sbgnviz.register(_libs); // Register sbgnviz with the given libs

    // Set the libraries to access them from any file
    var libUtilities = _dereq_('./utilities/lib-utilities');
    libUtilities.setLibs(libs);
  };

  if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = chise;
  }
})();

},{"./utilities/cy-style-and-events-factory":2,"./utilities/element-utilities-extender-factory":3,"./utilities/lib-utilities":4,"./utilities/main-utilities-factory":5,"./utilities/option-utilities-factory":6,"./utilities/register-undo-redo-actions-factory":7,"./utilities/sbgnviz-instance-utilities-factory":8,"./utilities/ur-action-functions-extender-factory":9}],2:[function(_dereq_,module,exports){
var libs = _dereq_('./lib-utilities').getLibs();
var $ = libs.jQuery;

module.exports = function () {

  var options, elementUtilities, cy;

  function cyStyleAndEvents (param) {
    elementUtilities = param.elementUtilities;
    options = param.optionUtilities.getOptions();
    cy = param.sbgnvizInstanceUtilities.getCy();

    //Helpers
    var initElementData = function (ele) {
      var eleclass = ele.data('class');
      if (!eleclass) {
        return;
      }
      eleclass = elementUtilities.demultimerizeClass(eleclass);
      var classProperties = elementUtilities.defaultProperties[eleclass];

      cy.batch(function () {
        if (ele.isNode()) {
          if (classProperties['width'] && !ele.data('bbox').w) {
            ele.data('bbox').w = classProperties['width'];
          }
          if (classProperties['height'] && !ele.data('bbox').h) {
            ele.data('bbox').h = classProperties['height'];
          }
          if (!ele.data('font-size') && classProperties['font-size']) {
            ele.data('font-size', classProperties['font-size']);
          }
          if (!ele.data('font-family') && classProperties['font-family']) {
            ele.data('font-family', classProperties['font-family']);
          }
          if (!ele.data('font-style') && classProperties['font-style']) {
            ele.data('font-style', classProperties['font-style']);
          }
          if (!ele.data('font-weight') && classProperties['font-weight']) {
            ele.data('font-weight', classProperties['font-weight']);
          }
          if (!ele.data('background-color') && classProperties['background-color']) {
            ele.data('background-color', classProperties['background-color']);
          }
          if (!ele.data('background-opacity') && classProperties['background-opacity']) {
            ele.data('background-opacity', classProperties['background-opacity']);
          }
          if (!ele.data('border-color') && classProperties['border-color']) {
            ele.data('border-color', classProperties['border-color']);
          }
          if (!ele.data('border-width') && classProperties['border-width']) {
            ele.data('border-width', classProperties['border-width']);
          }
          if (!ele.data('text-wrap') && classProperties['text-wrap']) {
            ele.data('text-wrap', classProperties['text-wrap']);
          }

        }
        else if (ele.isEdge()) {
          if (!ele.data('width') && classProperties['width']) {
            ele.data('width', classProperties['width']);
          }
          if (!ele.data('line-color') && classProperties['line-color']) {
            ele.data('line-color', classProperties['line-color']);
          }
        }
      });
    };

    // Update cy stylesheet
    var updateStyleSheet = function() {
      cy.style()
      .selector("node[class][font-size]")
      .style({
        'font-size': function (ele) {
          // If node labels are expected to be adjusted automatically or element cannot have label
          // return elementUtilities.getLabelTextSize() else return ele.data('font-size')
          var opt = options.adjustNodeLabelFontSizeAutomatically;
          var adjust = typeof opt === 'function' ? opt() : opt;

          if (!adjust) {
            return ele.data('font-size');
          }

          return elementUtilities.getLabelTextSize(ele);
        }
      })
      .selector("node[class][font-family]")
      .style({
        'font-family': function (ele) {
          return ele.data('font-family');
        }
      })
      .selector("node[class][font-style]")
      .style({
        'font-style': function (ele) {
          return ele.data('font-style');
        }
      })
      .selector("node[class][font-weight]")
      .style({
        'font-weight': function (ele) {
          return ele.data('font-weight');
        }
      })
      .selector("node[class][background-color]")
      .style({
        'background-color': function (ele) {
          return ele.data('background-color');
        }
      })
      .selector("node[class][background-opacity]")
      .style({
        'background-opacity': function (ele) {
          return ele.data('background-opacity');
        }
      })
      .selector("node[class][border-width]")
      .style({
        'border-width': function (ele) {
          return ele.data('border-width');
        }
      })
      .selector("node[class][border-color]")
      .style({
        'border-color': function (ele) {
          return ele.data('border-color');
        }
      })
      .selector("node[class][text-wrap]")
      .style({
        'text-wrap': function (ele) {
          return ele.data('text-wrap');
        }
      })
      .selector("edge[class][line-color]")
      .style({
        'line-color': function (ele) {
          return ele.data('line-color');
        },
        'source-arrow-color': function(ele) {
          return ele.data('line-color');
        },
        'target-arrow-color': function(ele) {
          return ele.data('line-color');
        }
      })
      .selector("edge[class][width]")
      .style({
        'width': function(ele) {
          return ele.data('width');
        }
      })
      .selector("edge.cy-expand-collapse-meta-edge")
      .css({
        'line-color': '#C4C4C4',
        'source-arrow-color': '#C4C4C4',
        'target-arrow-color': '#C4C4C4'
      })
      .selector("node:selected")
      .style({
        'border-color': '#d67614',
        'text-outline-color': '#000'
      })
      .selector("edge:selected")
      .style({
        'line-color': '#d67614',
        'source-arrow-color': '#d67614',
        'target-arrow-color': '#d67614'
      }).update();
    };

    // Bind events
    var bindCyEvents = function() {
      cy.on("add", function (event) {
        var ele = event.cyTarget || event.target;
        initElementData(ele);
      });
    };
    // Helpers End

    // Once cy is ready bind events and update style sheet
    cy.ready( function(event) {
      bindCyEvents();
      updateStyleSheet();
    });
  }

  return cyStyleAndEvents;
};

},{"./lib-utilities":4}],3:[function(_dereq_,module,exports){
// Extends sbgnviz.elementUtilities
var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;

module.exports = function () {
  var options, sbgnvizInstance, elementUtilities, cy;

  function elementUtilitiesExtender (param) {
    sbgnvizInstance = param.sbgnvizInstanceUtilities.getInstance();
    options = param.optionUtilities.getOptions();
    elementUtilities = sbgnvizInstance.elementUtilities;
    cy = param.sbgnvizInstanceUtilities.getCy();

    extend();

    // Return the extended elementUtilities
    return elementUtilities;
  }

  // Extends elementUtilities with chise specific facilities
  function extend () {
    elementUtilities.mapType = undefined; // initialize map type

    elementUtilities.PD = {}; // namespace for all PD specific stuff
    elementUtilities.AF = {}; // namespace for all AF specific stuff

    elementUtilities.defaultProperties = {
      "process": {
        width: 15,
        height: 15,
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555'
      },
      "omitted process": {
        width: 15,
        height: 15,
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555'
      },
      "uncertain process": {
        width: 15,
        height: 15,
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555'
      },
      "association": {
        width: 15,
        height: 15,
        'background-color': '#707070',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555'
      },
      "dissociation": {
        width: 15,
        height: 15,
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555'
      },
      "macromolecule": {
        width: 70,
        height: 35,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "nucleic acid feature": {
        width: 70,
        height: 35,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "simple chemical": {
        width: 35,
        height: 35,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "source and sink": {
        width: 25,
        height: 25,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "tag": {
        width: 35,
        height: 35,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "phenotype": {
        width: 70,
        height: 35,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "unspecified entity": {
        width: 70,
        height: 35,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "perturbing agent": {
        width: 70,
        height: 35,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "complex": {
        width: 50,
        height: 50,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "compartment": {
        width: 80,
        height: 80,
        'font-size': 14,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 3.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "and": {
        width: 25,
        height: 25,
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555'
      },
      "or": {
        width: 25,
        height: 25,
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555'
      },
      "not": {
        width: 25,
        height: 25,
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555'
      },
      "consumption": {
        'line-color': '#555',
        'width': 1.25
      },
      "production": {
        'line-color': '#555',
        'width': 1.25
      },
      "modulation": {
        'line-color': '#555',
        'width': 1.25
      },
      "stimulation": {
        'line-color': '#555',
        'width': 1.25
      },
      "catalysis": {
        'line-color': '#555',
        'width': 1.25
      },
      "inhibition": {
        'line-color': '#555',
        'width': 1.25
      },
      "necessary stimulation": {
        'line-color': '#555',
        'width': 1.25
      },
      "logic arc": {
        'line-color': '#555',
        'width': 1.25
      },
      "equivalence arc": {
        'line-color': '#555',
        'width': 1.25
      },
      "biological activity": {
        width: 70,
        height: 35,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "BA plain": {
        width: 70,
        height: 35,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "BA unspecified entity": {
        width: 70,
        height: 35,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "BA simple chemical": {
        width: 70,
        height: 35,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "BA macromolecule": {
        width: 70,
        height: 35,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "BA nucleic acid feature": {
        width: 70,
        height: 35,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "BA perturbing agent": {
        width: 70,
        height: 35,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "BA complex": {
        width: 70,
        height: 35,
        'font-size': 11,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555',
        'text-wrap': 'wrap'
      },
      "delay": {
        width: 25,
        height: 25,
        'font-family': 'Cambria',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 1.25,
        'border-color': '#555'
      },
      "unknown influence": {
        'line-color': '#555',
        'width': 1.25
      },
      "positive influence": {
        'line-color': '#555',
        'width': 1.25
      },
      "negative influence": {
        'line-color': '#555',
        'width': 1.25
      },
      "submap": {
        width: 80,
        height: 80,
        'font-size': 14,
        'font-family': 'Helvetica',
        'font-style': 'normal',
        'font-weight': 'normal',
        'background-color': '#ffffff',
        'background-opacity': 0.5,
        'border-width': 2.25,
        'border-color': '#555',
        'text-wrap': 'wrap',
      },
    };


    /*
      see http://journal.imbio.de/articles/pdf/jib-263.pdf p.41 <-- but beware, outdated
      following tables have been updated with PD lvl1 v2.0 of November 7, 2016 working draft
      only the following things have been changed from 2.0 (this version is not clear on connectivity):
       - empty set has no limit on its edge count
       - logic operators can be source and target
       - limit of 1 catalysis and 1 necessary stimulation on a process

      for each edge class and nodeclass define 2 cases:
       - node can be a source of this edge -> asSource
       - node can be a target of this edge -> asTarget
      for both cases, tells if it is allowed and what is the limit of edges allowed.
      Limits can concern only this type of edge (maxEdge) or the total number of edges for this node (maxTotal).
      Consider undefined things as false/unallowed -> whitelist behavior.

      the nodes/edges class listed below are those used in the program.
      For instance "compartment" isn't a node in SBGN specs.
    */
    elementUtilities.PD.connectivityConstraints = {
      "consumption": {
        "macromolecule":        {asSource: {isAllowed: true},    asTarget: {}},
        "simple chemical":      {asSource: {isAllowed: true},    asTarget: {}},
        "unspecified entity":   {asSource: {isAllowed: true},    asTarget: {}},
        "complex":              {asSource: {isAllowed: true},    asTarget: {}},
        "nucleic acid feature": {asSource: {isAllowed: true},    asTarget: {}},
        "compartment":          {asSource: {},   asTarget: {}},
        "tag":                  {asSource: {},   asTarget: {}},
        "source and sink":      {asSource: {isAllowed: true},    asTarget: {}},
        "perturbing agent":     {asSource: {},   asTarget: {}},
        "submap":               {asSource: {},   asTarget: {}},
        "process":              {asSource: {},   asTarget: {isAllowed: true}},
        "omitted process":      {asSource: {},   asTarget: {isAllowed: true}},
        "uncertain process":    {asSource: {},   asTarget: {isAllowed: true}},
        "phenotype":            {asSource: {},   asTarget: {}},
        "association":          {asSource: {},   asTarget: {isAllowed: true}},
        "dissociation":         {asSource: {},   asTarget: {isAllowed: true, maxEdge: 1, maxTotal: 1}},
        "and":                  {asSource: {},   asTarget: {}},
        "or":                   {asSource: {},   asTarget: {}},
        "not":                  {asSource: {},   asTarget: {}}
      },
      "production": {
        "macromolecule":        {asSource: {},   asTarget: {isAllowed: true}},
        "simple chemical":      {asSource: {},   asTarget: {isAllowed: true}},
        "unspecified entity":   {asSource: {},   asTarget: {isAllowed: true}},
        "complex":              {asSource: {},   asTarget: {isAllowed: true}},
        "nucleic acid feature": {asSource: {},   asTarget: {isAllowed: true}},
        "compartment":          {asSource: {},   asTarget: {}},
        "tag":                  {asSource: {},   asTarget: {}},
        "source and sink":      {asSource: {},   asTarget: {isAllowed: true}},
        "perturbing agent":     {asSource: {},   asTarget: {}},
        "submap":               {asSource: {},   asTarget: {}},
        "process":              {asSource: {isAllowed: true},    asTarget: {}},
        "omitted process":      {asSource: {isAllowed: true},    asTarget: {}},
        "uncertain process":    {asSource: {isAllowed: true},    asTarget: {}},
        "phenotype":            {asSource: {},   asTarget: {}},
        "association":          {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {}},
        "dissociation":         {asSource: {isAllowed: true},    asTarget: {}},
        "and":                  {asSource: {},   asTarget: {}},
        "or":                   {asSource: {},   asTarget: {}},
        "not":                  {asSource: {},   asTarget: {}}
      },
      "modulation": {
        "macromolecule":        {asSource: {isAllowed: true},    asTarget: {}},
        "simple chemical":      {asSource: {isAllowed: true},    asTarget: {}},
        "unspecified entity":   {asSource: {isAllowed: true},    asTarget: {}},
        "complex":              {asSource: {isAllowed: true},    asTarget: {}},
        "nucleic acid feature": {asSource: {isAllowed: true},    asTarget: {}},
        "compartment":          {asSource: {},   asTarget: {}},
        "tag":                  {asSource: {},   asTarget: {}},
        "source and sink":      {asSource: {isAllowed: true},    asTarget: {}},
        "perturbing agent":     {asSource: {isAllowed: true},    asTarget: {}},
        "submap":               {asSource: {},   asTarget: {}},
        "process":              {asSource: {},   asTarget: {isAllowed: true}},
        "omitted process":      {asSource: {},   asTarget: {isAllowed: true}},
        "uncertain process":    {asSource: {},   asTarget: {isAllowed: true}},
        "phenotype":            {asSource: {},   asTarget: {isAllowed: true}},
        "association":          {asSource: {},   asTarget: {}},
        "dissociation":         {asSource: {},   asTarget: {}},
        "and":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {}},
        "or":                   {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {}},
        "not":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {}}
      },
      "stimulation": {
        "macromolecule":        {asSource: {isAllowed: true},    asTarget: {}},
        "simple chemical":      {asSource: {isAllowed: true},    asTarget: {}},
        "unspecified entity":   {asSource: {isAllowed: true},    asTarget: {}},
        "complex":              {asSource: {isAllowed: true},    asTarget: {}},
        "nucleic acid feature": {asSource: {isAllowed: true},    asTarget: {}},
        "compartment":          {asSource: {},   asTarget: {}},
        "tag":                  {asSource: {},   asTarget: {}},
        "source and sink":      {asSource: {isAllowed: true},    asTarget: {}},
        "perturbing agent":     {asSource: {isAllowed: true},    asTarget: {}},
        "submap":               {asSource: {},   asTarget: {}},
        "process":              {asSource: {},   asTarget: {isAllowed: true}},
        "omitted process":      {asSource: {},   asTarget: {isAllowed: true}},
        "uncertain process":    {asSource: {},   asTarget: {isAllowed: true}},
        "phenotype":            {asSource: {},   asTarget: {isAllowed: true}},
        "association":          {asSource: {},   asTarget: {}},
        "dissociation":         {asSource: {},   asTarget: {}},
        "and":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {}},
        "or":                   {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {}},
        "not":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {}}
      },
      "catalysis": {
        "macromolecule":        {asSource: {isAllowed: true},    asTarget: {}},
        "simple chemical":      {asSource: {isAllowed: true},    asTarget: {}},
        "unspecified entity":   {asSource: {isAllowed: true},    asTarget: {}},
        "complex":              {asSource: {isAllowed: true},    asTarget: {}},
        "nucleic acid feature": {asSource: {},   asTarget: {}},
        "compartment":          {asSource: {},   asTarget: {}},
        "tag":                  {asSource: {},   asTarget: {}},
        "source and sink":      {asSource: {isAllowed: true},    asTarget: {}},
        "perturbing agent":     {asSource: {},   asTarget: {}},
        "submap":               {asSource: {},   asTarget: {}},
        "process":              {asSource: {},   asTarget: {isAllowed: true, maxEdge: 1}},
        "omitted process":      {asSource: {},   asTarget: {isAllowed: true, maxEdge: 1}},
        "uncertain process":    {asSource: {},   asTarget: {isAllowed: true, maxEdge: 1}},
        "phenotype":            {asSource: {},   asTarget: {isAllowed: true, maxEdge: 1}},
        "association":          {asSource: {},   asTarget: {}},
        "dissociation":         {asSource: {},   asTarget: {}},
        "and":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {}},
        "or":                   {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {}},
        "not":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {}}
      },
      "inhibition": {
        "macromolecule":        {asSource: {isAllowed: true},    asTarget: {}},
        "simple chemical":      {asSource: {isAllowed: true},    asTarget: {}},
        "unspecified entity":   {asSource: {isAllowed: true},    asTarget: {}},
        "complex":              {asSource: {isAllowed: true},    asTarget: {}},
        "nucleic acid feature": {asSource: {isAllowed: true},    asTarget: {}},
        "compartment":          {asSource: {},   asTarget: {}},
        "tag":                  {asSource: {},   asTarget: {}},
        "source and sink":      {asSource: {isAllowed: true},    asTarget: {}},
        "perturbing agent":     {asSource: {isAllowed: true},    asTarget: {}},
        "submap":               {asSource: {},   asTarget: {}},
        "process":              {asSource: {},   asTarget: {isAllowed: true}},
        "omitted process":      {asSource: {},   asTarget: {isAllowed: true}},
        "uncertain process":    {asSource: {},   asTarget: {isAllowed: true}},
        "phenotype":            {asSource: {},   asTarget: {isAllowed: true}},
        "association":          {asSource: {},   asTarget: {}},
        "dissociation":         {asSource: {},   asTarget: {}},
        "and":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {}},
        "or":                   {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {}},
        "not":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {}}
      },
      "necessary stimulation": {
        "macromolecule":        {asSource: {isAllowed: true},    asTarget: {}},
        "simple chemical":      {asSource: {isAllowed: true},    asTarget: {}},
        "unspecified entity":   {asSource: {isAllowed: true},    asTarget: {}},
        "complex":              {asSource: {isAllowed: true},    asTarget: {}},
        "nucleic acid feature": {asSource: {isAllowed: true},    asTarget: {}},
        "compartment":          {asSource: {},   asTarget: {}},
        "tag":                  {asSource: {},   asTarget: {}},
        "source and sink":      {asSource: {isAllowed: true},    asTarget: {}},
        "perturbing agent":     {asSource: {isAllowed: true},    asTarget: {}},
        "submap":               {asSource: {},   asTarget: {}},
        "process":              {asSource: {},   asTarget: {isAllowed: true, maxEdge: 1}},
        "omitted process":      {asSource: {},   asTarget: {isAllowed: true, maxEdge: 1}},
        "uncertain process":    {asSource: {},   asTarget: {isAllowed: true, maxEdge: 1}},
        "phenotype":            {asSource: {},   asTarget: {isAllowed: true, maxEdge: 1}},
        "association":          {asSource: {},   asTarget: {}},
        "dissociation":         {asSource: {},   asTarget: {}},
        "and":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {}},
        "or":                   {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {}},
        "not":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {}},
      },
      "logic arc": {
        "macromolecule":        {asSource: {isAllowed: true},    asTarget: {}},
        "simple chemical":      {asSource: {isAllowed: true},    asTarget: {}},
        "unspecified entity":   {asSource: {isAllowed: true},    asTarget: {}},
        "complex":              {asSource: {isAllowed: true},    asTarget: {}},
        "nucleic acid feature": {asSource: {isAllowed: true},    asTarget: {}},
        "compartment":          {asSource: {},   asTarget: {}},
        "tag":                  {asSource: {},   asTarget: {}},
        "source and sink":      {asSource: {isAllowed: true},    asTarget: {}},
        "perturbing agent":     {asSource: {},   asTarget: {}},
        "submap":               {asSource: {},   asTarget: {}},
        "process":              {asSource: {},   asTarget: {}},
        "omitted process":      {asSource: {},   asTarget: {}},
        "uncertain process":    {asSource: {},   asTarget: {}},
        "phenotype":            {asSource: {},   asTarget: {}},
        "association":          {asSource: {},   asTarget: {}},
        "dissociation":         {asSource: {},   asTarget: {}},
        "and":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: true}},
        "or":                   {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: true}},
        "not":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: true, maxEdge: 1, maxTotal: 1}},
      },
      "equivalence arc": {
        "macromolecule":        {asSource: {isAllowed: true},   asTarget: {}},
        "simple chemical":      {asSource: {isAllowed: true},   asTarget: {}},
        "unspecified entity":   {asSource: {isAllowed: true},   asTarget: {}},
        "complex":              {asSource: {isAllowed: true},   asTarget: {}},
        "nucleic acid feature": {asSource: {isAllowed: true},   asTarget: {}},
        "compartment":          {asSource: {},   asTarget: {}},
        "tag":                  {asSource: {},   asTarget: {isAllowed: true}},
        "source and sink":      {asSource: {},   asTarget: {}},
        "perturbing agent":     {asSource: {},   asTarget: {}},
        "submap":               {asSource: {},   asTarget: {isAllowed: true}},
        "process":              {asSource: {},   asTarget: {}},
        "omitted process":      {asSource: {},   asTarget: {}},
        "uncertain process":    {asSource: {},   asTarget: {}},
        "phenotype":            {asSource: {},   asTarget: {}},
        "association":          {asSource: {},   asTarget: {}},
        "dissociation":         {asSource: {},   asTarget: {}},
        "and":                  {asSource: {},   asTarget: {}},
        "or":                   {asSource: {},   asTarget: {}},
        "not":                  {asSource: {},   asTarget: {}}
      }
    };

    /* AF node connectivity rules
     * See: Systems Biology Graphical Notation: Activity Flow language Level 1, Version 1.2, Date: July 27, 2015
     *   Section 3.3.1: Activity Nodes connectivity definition
     *   URL: https://doi.org/10.2390/biecoll-jib-2015-265
     */
    elementUtilities.AF.connectivityConstraints = {
      "positive influence": {
        "biological activity":  {asSource: {isAllowed: true},   asTarget: {isAllowed: true}},
        "phenotype":            {asSource: {},   asTarget: {isAllowed: true}},
        "tag":                  {asSource: {},   asTarget: {}},
        "submap":               {asSource: {},   asTarget: {}},
        "and":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},   asTarget: {}},
        "or":                   {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},   asTarget: {}},
        "not":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},   asTarget: {}},
        "delay":                {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},   asTarget: {}},
        "compartment":          {asSource: {},   asTarget: {}},
      },
      "negative influence": {
        "biological activity":  {asSource: {isAllowed: true},   asTarget: {isAllowed: true}},
        "phenotype":            {asSource: {},   asTarget: {isAllowed: true}},
        "tag":                  {asSource: {},   asTarget: {}},
        "submap":               {asSource: {},   asTarget: {}},
        "and":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},   asTarget: {}},
        "or":                   {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},   asTarget: {}},
        "not":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},   asTarget: {}},
        "delay":                {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},   asTarget: {}},
        "compartment":          {asSource: {},   asTarget: {}},
      },
      "unknown influence": {
        "biological activity":  {asSource: {isAllowed: true},   asTarget: {isAllowed: true}},
        "phenotype":            {asSource: {},   asTarget: {isAllowed: true}},
        "tag":                  {asSource: {},   asTarget: {}},
        "submap":               {asSource: {},   asTarget: {}},
        "and":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},   asTarget: {}},
        "or":                   {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},   asTarget: {}},
        "not":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},   asTarget: {}},
        "delay":                {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},   asTarget: {}},
        "compartment":          {asSource: {},   asTarget: {}},
      },
      "necessary stimulation": {
        "biological activity":  {asSource: {isAllowed: true},   asTarget: {isAllowed: true}},
        "phenotype":            {asSource: {},   asTarget: {isAllowed: true}},
        "tag":                  {asSource: {},   asTarget: {}},
        "submap":               {asSource: {},   asTarget: {}},
        "and":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},   asTarget: {}},
        "or":                   {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},   asTarget: {}},
        "not":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},   asTarget: {}},
        "delay":                {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},   asTarget: {}},
        "compartment":          {asSource: {},   asTarget: {}},
      },
      "logic arc": {
        "biological activity":  {asSource: {isAllowed: true},   asTarget: {}},
        "phenotype":            {asSource: {},   asTarget: {}},
        "tag":                  {asSource: {},   asTarget: {}},
        "submap":               {asSource: {},   asTarget: {}},
        "and":                  {asSource: {},   asTarget: {isAllowed: true}},
        "or":                   {asSource: {},   asTarget: {isAllowed: true}},
        "not":                  {asSource: {},   asTarget: {isAllowed: true, maxEdge: 1, maxTotal: 1}},
        "delay":                {asSource: {},   asTarget: {isAllowed: true, maxEdge: 1, maxTotal: 1}},
        "compartment":          {asSource: {},   asTarget: {}},
      },
      "equivalence arc": {
        "biological activity":  {asSource: {isAllowed: true},   asTarget: {}},
        "phenotype":            {asSource: {isAllowed: true},   asTarget: {}},
        "tag":                  {asSource: {},   asTarget: {isAllowed: true}},
        "submap":               {asSource: {},   asTarget: {isAllowed: true}},
        "and":                  {asSource: {},   asTarget: {}},
        "or":                   {asSource: {},   asTarget: {}},
        "not":                  {asSource: {},   asTarget: {}},
        "delay":                {asSource: {},   asTarget: {}},
        "compartment":          {asSource: {},   asTarget: {}},
      },
    }
    // initialize a global unit of information object
    var uoi_obj = {};
    uoi_obj.clazz = "unit of information";
    uoi_obj.label = {
      text: ""
    };

    uoi_obj.bbox = {
       w: 30,
       h: 12
    };

    // Section Start
    // Add remove utilities

    // see http://stackoverflow.com/a/8809472
    // we need to take care of our own IDs because the ones automatically generated by cytoscape (also UUID)
    // don't comply with xsd:SID type that must not begin with a number
    function generateUUID () { // Public Domain/MIT
        var d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    elementUtilities.addNode = function (x, y, nodeParams, id, parent, visibility) {
      if (typeof nodeParams != 'object'){
        var sbgnclass = nodeParams;
      } else {
          var sbgnclass = nodeParams.class;
          var language = nodeParams.language;
      }
      var defaultProperties = this.defaultProperties;
      var defaults = defaultProperties[sbgnclass];

      var width = defaults ? defaults.width : 50;
      var height = defaults ? defaults.height : 50;

      var css = {};


      if (visibility) {
        css.visibility = visibility;
      }

      if (defaults && defaults.multimer) {
        sbgnclass += " multimer";
      }
      var data = {
        class: sbgnclass,
    	language: language,
        bbox: {
          h: height,
          w: width,
          x: x,
          y: y
        },
        statesandinfos: [],
        ports: [],
        clonemarker: defaults && defaults.clonemarker ? defaults.clonemarker : undefined
      };

      if(id) {
        data.id = id;
      }
      else {
        data.id = "nwtN_" + generateUUID();
      }

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
      var ordering = this.defaultProperties[sbgnclass.replace(/\s*multimer$/, '')]['ports-ordering']; // Get the default ports ordering for the nodes with given sbgnclass

      // If there is a default ports ordering for the nodes with given sbgnclass and it is different than 'none' set the ports ordering to that ordering
      if (ordering && ordering !== 'none') {
        this.setPortsOrdering(newNode, ordering);
      }

      if (language == "AF" && !elementUtilities.canHaveMultipleUnitOfInformation(newNode)){
        if (sbgnclass != "BA plain")  // if AF node can have label i.e: not plain biological activity
          elementUtilities.addStateOrInfoBox(newNode, uoi_obj);
      }

      return newNode;
    };

    elementUtilities.addEdge = function (source, target, edgeParams, id, visibility) {
      if (typeof edgeParams != 'object'){
        var sbgnclass = edgeParams;
      } else {
          var sbgnclass = edgeParams.class;
          var language = edgeParams.language;
      }
      var defaultProperties = this.defaultProperties;
      var defaults = defaultProperties[sbgnclass];

      var css = {};

      if (visibility) {
        css.visibility = visibility;
      }

      var data = {
          source: source,
          target: target,
          class: sbgnclass,
          language: language,
      };

      if(id) {
        data.id = id;
      }
      else {
        data.id = "nwtE_" + generateUUID();
      }

      var sourceNode = cy.getElementById(source); // The original source node
      var targetNode = cy.getElementById(target); // The original target node
      var sourceHasPorts = sourceNode.data('ports').length === 2;
      var targetHasPorts = targetNode.data('ports').length === 2;
      // The portsource and porttarget variables
      var portsource;
      var porttarget;

      /*
       * Get input/output port id's of a node with the assumption that the node has valid ports.
       */
      var getIOPortIds = function (node) {
        var nodeInputPortId, nodeOutputPortId;
        var nodePortsOrdering = sbgnvizInstance.elementUtilities.getPortsOrdering(node);
        var nodePorts = node.data('ports');
        if ( nodePortsOrdering === 'L-to-R' || nodePortsOrdering === 'R-to-L' ) {
          var leftPortId = nodePorts[0].x < 0 ? nodePorts[0].id : nodePorts[1].id; // The x value of left port is supposed to be negative
          var rightPortId = nodePorts[0].x > 0 ? nodePorts[0].id : nodePorts[1].id; // The x value of right port is supposed to be positive
          /*
           * If the port ordering is left to right then the input port is the left port and the output port is the right port.
           * Else if it is right to left it is vice versa
           */
          nodeInputPortId = nodePortsOrdering === 'L-to-R' ? leftPortId : rightPortId;
          nodeOutputPortId = nodePortsOrdering === 'R-to-L' ? leftPortId : rightPortId;
        }
        else if ( nodePortsOrdering === 'T-to-B' || nodePortsOrdering === 'B-to-T' ){
          var topPortId = nodePorts[0].y < 0 ? nodePorts[0].id : nodePorts[1].id; // The y value of top port is supposed to be negative
          var bottomPortId = nodePorts[0].y > 0 ? nodePorts[0].id : nodePorts[1].id; // The y value of bottom port is supposed to be positive
          /*
           * If the port ordering is top to bottom then the input port is the top port and the output port is the bottom port.
           * Else if it is right to left it is vice versa
           */
          nodeInputPortId = nodePortsOrdering === 'T-to-B' ? topPortId : bottomPortId;
          nodeOutputPortId = nodePortsOrdering === 'B-to-T' ? topPortId : bottomPortId;
        }

        // Return an object containing the IO ports of the node
        return {
          inputPortId: nodeInputPortId,
          outputPortId: nodeOutputPortId
        };
      };

      // If at least one end of the edge has ports then we should determine the ports where the edge should be connected.
      if (sourceHasPorts || targetHasPorts) {
        var sourceNodeInputPortId, sourceNodeOutputPortId, targetNodeInputPortId, targetNodeOutputPortId;

        // If source node has ports set the variables dedicated for its IO ports
        if ( sourceHasPorts ) {
          var ioPorts = getIOPortIds(sourceNode);
          sourceNodeInputPortId = ioPorts.inputPortId;
          sourceNodeOutputPortId = ioPorts.outputPortId;
        }

        // If target node has ports set the variables dedicated for its IO ports
        if ( targetHasPorts ) {
          var ioPorts = getIOPortIds(targetNode);
          targetNodeInputPortId = ioPorts.inputPortId;
          targetNodeOutputPortId = ioPorts.outputPortId;
        }

        if (sbgnclass === 'consumption') {
          // A consumption edge should be connected to the input port of the target node which is supposed to be a process (any kind of)
          porttarget = targetNodeInputPortId;
        }
        else if (sbgnclass === 'production' || this.isModulationArcClass(sbgnclass)) {
          // A production edge should be connected to the output port of the source node which is supposed to be a process (any kind of)
          // A modulation edge may have a logical operator as source node in this case the edge should be connected to the output port of it
          // The below assignment satisfy all of these condition
          portsource = sourceNodeOutputPortId;
        }
        else if (sbgnclass === 'logic arc') {
          var srcClass = sourceNode.data('class');
          var tgtClass = targetNode.data('class');
          var isSourceLogicalOp = srcClass === 'and' || srcClass === 'or' || srcClass === 'not';
          var isTargetLogicalOp = tgtClass === 'and' || tgtClass === 'or' || tgtClass === 'not';

          if (isSourceLogicalOp && isTargetLogicalOp) {
            // If both end are logical operators then the edge should be connected to the input port of the target and the output port of the input
            porttarget = targetNodeInputPortId;
            portsource = sourceNodeOutputPortId;
          }// If just one end of logical operator then the edge should be connected to the input port of the logical operator
          else if (isSourceLogicalOp) {
            portsource = sourceNodeInputPortId;
          }
          else if (isTargetLogicalOp) {
            porttarget = targetNodeInputPortId;
          }
        }
      }

      // The default portsource/porttarget are the source/target themselves. If they are not set use these defaults.
      // The portsource and porttarget are determined set them in data object.
      data.portsource = portsource || source;
      data.porttarget = porttarget || target;

      var eles = cy.add({
        group: "edges",
        data: data,
        css: css
      });

      var newEdge = eles[eles.length - 1];

      return newEdge;
    };

    elementUtilities.addProcessWithConvenientEdges = function(_source, _target, processType) {
      // If source and target IDs are given get the elements by IDs
      var source = typeof _source === 'string' ? cy.getElementById(_source) : _source;
      var target = typeof _target === 'string' ? cy.getElementById(_target) : _target;

      // Process parent should be the closest common ancestor of the source and target nodes
      var processParent = cy.collection([source[0], target[0]]).commonAncestors().first();

      // Process should be at the middle of the source and target nodes
      var x = ( source.position('x') + target.position('x') ) / 2;
      var y = ( source.position('y') + target.position('y') ) / 2;

      // Create the process with given/calculated variables
      var process = elementUtilities.addNode(x, y, processType, undefined, processParent.id());
        var xdiff = source.position('x') - target.position('x');
        var ydiff = source.position('y') - target.position('y')
        if (Math.abs(xdiff) >= Math.abs(ydiff))
        {
            if (xdiff < 0)
                elementUtilities.setPortsOrdering(process, 'L-to-R');
            else
                elementUtilities.setPortsOrdering(process, 'R-to-L');
        }
        else
        {
            if (ydiff < 0)
                elementUtilities.setPortsOrdering(process, 'T-to-B');
            else
                elementUtilities.setPortsOrdering(process, 'B-to-T');
        }


      // Create the edges one is between the process and the source node (which should be a consumption),
      // the other one is between the process and the target node (which should be a production).
      // For more information please refer to SBGN-PD reference card.
      var edgeBtwSrc = elementUtilities.addEdge(source.id(), process.id(), 'consumption');
      var edgeBtwTgt = elementUtilities.addEdge(process.id(), target.id(), 'production');

      // Create a collection including the elements and to be returned
      var collection = cy.collection([process[0], edgeBtwSrc[0], edgeBtwTgt[0]]);
      return collection;
    };

    /*
     * Returns if the elements with the given parent class can be parent of the elements with the given node class
     */
    elementUtilities.isValidParent = function(_nodeClass, _parentClass, node) {
      // If nodeClass and parentClass params are elements itselves instead of their class names handle it
      var nodeClass = typeof _nodeClass !== 'string' ? _nodeClass.data('class') : _nodeClass;
      var parentClass = _parentClass != undefined && typeof _parentClass !== 'string' ? _parentClass.data('class') : _parentClass;

      if (parentClass == undefined || parentClass === 'compartment'
              || parentClass === 'submap') { // Compartments, submaps and the root can include any type of nodes
        return true;
      }
      else if (parentClass.startsWith('complex') && (!node || node.connectedEdges().length == 0  // Complexes can only include EPNs which do not have edges
              || elementUtilities.mapType == "Unknown")) { // When map type is unknown, allow complexes to include EPNs with edges
        return elementUtilities.isEPNClass(nodeClass);
      }

      return false; // Currently just 'compartment' and 'complex' compounds are supported return false for any other parentClass
    };

    /*
     * This method assumes that param.nodesToMakeCompound contains at least one node
     * and all of the nodes including in it have the same parent. It creates a compound fot the given nodes an having the given type.
     */
    elementUtilities.createCompoundForGivenNodes = function (nodesToMakeCompound, compoundType) {
      var oldParentId = nodesToMakeCompound[0].data("parent");
      // The parent of new compound will be the old parent of the nodes to make compound. x, y and id parameters are not set.
      var newCompound = elementUtilities.addNode(undefined, undefined, compoundType, undefined, oldParentId);
      var newCompoundId = newCompound.id();
      var newEles = elementUtilities.changeParent(nodesToMakeCompound, newCompoundId);
      newEles = newEles.union(newCompound);
      return newEles;
    };

    /*
     * Creates a template reaction with given parameters. Requires cose-bilkent layout to tile the free macromolecules included
     * in the complex. Parameters are explained below.
     * templateType: The type of the template reaction. It may be 'association' or 'dissociation' for now.
     * macromoleculeList: The list of the names of macromolecules which will involve in the reaction.
     * complexName: The name of the complex in the reaction.
     * processPosition: The modal position of the process in the reaction. The default value is the center of the canvas.
     * tilingPaddingVertical: This option will be passed to the cose-bilkent layout with the same name. The default value is 15.
     * tilingPaddingHorizontal: This option will be passed to the cose-bilkent layout with the same name. The default value is 15.
     * edgeLength: The distance between the process and the macromolecules at the both sides.
     */
    elementUtilities.createTemplateReaction = function (templateType, macromoleculeList, complexName, processPosition, tilingPaddingVertical, tilingPaddingHorizontal, edgeLength) {
      var defaultMacromoleculProperties = elementUtilities.defaultProperties["macromolecule"];
      var templateType = templateType;
      var processWidth = elementUtilities.defaultProperties[templateType] ? elementUtilities.defaultProperties[templateType].width : 50;
      var macromoleculeWidth = defaultMacromoleculProperties ? defaultMacromoleculProperties.width : 50;
      var macromoleculeHeight = defaultMacromoleculProperties ? defaultMacromoleculProperties.height : 50;
      var processPosition = processPosition ? processPosition : elementUtilities.convertToModelPosition({x: cy.width() / 2, y: cy.height() / 2});
      var macromoleculeList = macromoleculeList;
      var complexName = complexName;
      var numOfMacromolecules = macromoleculeList.length;
      var tilingPaddingVertical = tilingPaddingVertical ? tilingPaddingVertical : 15;
      var tilingPaddingHorizontal = tilingPaddingHorizontal ? tilingPaddingHorizontal : 15;
      var edgeLength = edgeLength ? edgeLength : 60;

      cy.startBatch();

      var xPositionOfFreeMacromolecules;
      if (templateType === 'association') {
        xPositionOfFreeMacromolecules = processPosition.x - edgeLength - processWidth / 2 - macromoleculeWidth / 2;
      }
      else {
        xPositionOfFreeMacromolecules = processPosition.x + edgeLength + processWidth / 2 + macromoleculeWidth / 2;
      }

      //Create the process in template type
      var process = elementUtilities.addNode(processPosition.x, processPosition.y, templateType);
      process.data('justAdded', true);

      //Define the starting y position
      var yPosition = processPosition.y - ((numOfMacromolecules - 1) / 2) * (macromoleculeHeight + tilingPaddingVertical);

      //Create the free macromolecules
      for (var i = 0; i < numOfMacromolecules; i++) {
        var newNode = elementUtilities.addNode(xPositionOfFreeMacromolecules, yPosition, "macromolecule");
        newNode.data('justAdded', true);
        newNode.data('label', macromoleculeList[i]);

        //create the edge connected to the new macromolecule
        var newEdge;
        if (templateType === 'association') {
          newEdge = elementUtilities.addEdge(newNode.id(), process.id(), 'consumption');
        }
        else {
          newEdge = elementUtilities.addEdge(process.id(), newNode.id(), 'production');
        }

        newEdge.data('justAdded', true);

        //update the y position
        yPosition += macromoleculeHeight + tilingPaddingVertical;
      }

      //Create the complex including macromolecules inside of it
      //Temprorarily add it to the process position we will move it according to the last size of it
      var complex = elementUtilities.addNode(processPosition.x, processPosition.y, 'complex');
      complex.data('justAdded', true);
      complex.data('justAddedLayoutNode', true);

      //If a name is specified for the complex set its label accordingly
      if (complexName) {
        complex.data('label', complexName);
      }

      //create the edge connnected to the complex
      var edgeOfComplex;
      if (templateType === 'association') {
        edgeOfComplex = elementUtilities.addEdge(process.id(), complex.id(), 'production');
      }
      else {
        edgeOfComplex = elementUtilities.addEdge(complex.id(), process.id(), 'consumption');
      }
      edgeOfComplex.data('justAdded', true);

      //Create the macromolecules inside the complex
      for (var i = 0; i < numOfMacromolecules; i++) {
        // Add a macromolecule not having a previously defined id and having the complex created in this reaction as parent
        var newNode = elementUtilities.addNode(complex.position('x'), complex.position('y'), "macromolecule", undefined, complex.id());
        newNode.data('justAdded', true);
        newNode.data('label', macromoleculeList[i]);
        newNode.data('justAddedLayoutNode', true);
      }

      cy.endBatch();

      var layoutNodes = cy.nodes('[justAddedLayoutNode]');
      layoutNodes.removeData('justAddedLayoutNode');
      var layout = layoutNodes.layout({
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
          elementUtilities.moveNodes({x: positionDiffX, y: positionDiffY}, complex);
        }
      });

      // Do this check for cytoscape.js backward compatibility
      if (layout && layout.run) {
        layout.run();
      }

      //filter the just added elememts to return them and remove just added mark
      var eles = cy.elements('[justAdded]');
      eles.removeData('justAdded');

      cy.elements().unselect();
      eles.select();

      return eles; // Return the just added elements
    };

    /*
     * Move the nodes to a new parent and change their position if possDiff params are set.
     */
    elementUtilities.changeParent = function(nodes, newParent, posDiffX, posDiffY) {
      var newParentId = newParent == undefined || typeof newParent === 'string' ? newParent : newParent.id();
      var movedEles = nodes.move({"parent": newParentId});
      if(typeof posDiffX != 'undefined' || typeof posDiffY != 'undefined') {
        elementUtilities.moveNodes({x: posDiffX, y: posDiffY}, nodes);
      }
      elementUtilities.maintainPointer(movedEles);
      return movedEles;
    };

    // Resize given nodes if useAspectRatio is truthy one of width or height should not be set.
    elementUtilities.resizeNodes = function (nodes, width, height, useAspectRatio) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var ratio = undefined;
        var eleMustBeSquare = elementUtilities.mustBeSquare(node.data('class'));

        // Note that both width and height should not be set if useAspectRatio is truthy
        if (width) {
          if (useAspectRatio || eleMustBeSquare) {
            ratio = width / node.width();
          }

          node.data("bbox").w = width;
        }

        if (height) {
          if (useAspectRatio || eleMustBeSquare) {
            ratio = height / node.height();
          }

          node.data("bbox").h = height;
        }

        if (ratio && !height) {
          node.data("bbox").h = node.height() * ratio;
        }
        else if (ratio && !width) {
          node.data("bbox").w = node.width() * ratio;
        }
      }
    };

    // Section End
    // Add remove utilities

    // Section Start
    // Common element properties

    // Get common properties of given elements. Returns null if the given element list is empty or the
    // property is not common for all elements. dataOrCss parameter specify whether to check the property on data or css.
    // The default value for it is data. If propertyName parameter is given as a function instead of a string representing the
    // property name then use what that function returns.
    elementUtilities.getCommonProperty = function (elements, propertyName, dataOrCss) {
      if (elements.length == 0) {
        return null;
      }

      var isFunction;
      // If we are not comparing the properties directly users can specify a function as well
      if (typeof propertyName === 'function') {
        isFunction = true;
      }

      // Use data as default
      if (!isFunction && !dataOrCss) {
        dataOrCss = 'data';
      }

      var value = isFunction ? propertyName(elements[0]) : elements[0][dataOrCss](propertyName);

      for (var i = 1; i < elements.length; i++) {
        if ( ( isFunction ? propertyName(elements[i]) : elements[i][dataOrCss](propertyName) ) != value) {
          return null;
        }
      }

      return value;
    };

    // Returns if the function returns a truthy value for all of the given elements.
    elementUtilities.trueForAllElements = function (elements, fcn) {
      for (var i = 0; i < elements.length; i++) {
        if (!fcn(elements[i])) {
          return false;
        }
      }

      return true;
    };

    // Returns whether the give element can have sbgncardinality
    elementUtilities.canHaveSBGNCardinality = function (ele) {
      var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');

      return ele.data('class') == 'consumption' || ele.data('class') == 'production';
    };

    // Returns whether the give element can have sbgnlabel
    elementUtilities.canHaveSBGNLabel = function (ele) {
      var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');

      return sbgnclass != 'and' && sbgnclass != 'or' && sbgnclass != 'not' && sbgnclass != 'delay'
              && sbgnclass != 'association' && sbgnclass != 'dissociation' && sbgnclass != 'source and sink' && !sbgnclass.endsWith('process');
    };

    // Returns whether the give element have unit of information
    elementUtilities.canHaveUnitOfInformation = function (ele) {
      var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');

      if (sbgnclass == 'simple chemical'
              || sbgnclass == 'macromolecule' || sbgnclass == 'nucleic acid feature'
              || sbgnclass == 'complex' || sbgnclass == 'simple chemical multimer'
              || sbgnclass == 'macromolecule multimer' || sbgnclass == 'nucleic acid feature multimer'
              || sbgnclass == 'complex multimer' || (sbgnclass.startsWith('BA') && sbgnclass != "BA plain")
              || sbgnclass == 'compartment') {
        return true;
      }
      return false;
    };

    // Returns whether the given element can have more than one units of information
    elementUtilities.canHaveMultipleUnitOfInformation = function (ele) {
      var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');
      return !sbgnclass.startsWith('BA');
    };


    // Returns whether the give element have state variable
    elementUtilities.canHaveStateVariable = function (ele) {
      var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');

      if (sbgnclass == 'macromolecule' || sbgnclass == 'nucleic acid feature'
              || sbgnclass == 'complex'
              || sbgnclass == 'macromolecule multimer' || sbgnclass == 'nucleic acid feature multimer'
              || sbgnclass == 'complex multimer') {
        return true;
      }
      return false;
    };

    // Returns whether the given ele should be square in shape
    elementUtilities.mustBeSquare = function (ele) {
      var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');

      return (sbgnclass.indexOf('process') != -1 || sbgnclass == 'source and sink'
              || sbgnclass == 'and' || sbgnclass == 'or' || sbgnclass == 'not'
              || sbgnclass == 'association' || sbgnclass == 'dissociation' || sbgnclass == 'delay');
    };

    // Returns whether any of the given nodes must not be in square shape
    elementUtilities.someMustNotBeSquare = function (nodes) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (!elementUtilities.mustBeSquare(node.data('class'))) {
          return true;
        }
      }

      return false;
    };

    // Returns whether the gives element can be cloned
    elementUtilities.canBeCloned = function (ele) {
      var sbgnclass = (typeof ele === 'string' ? ele : ele.data('class')).replace(" multimer", "");

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

    // Returns whether the gives element can be cloned
    elementUtilities.canBeMultimer = function (ele) {
      var sbgnclass = (typeof ele === 'string' ? ele : ele.data('class')).replace(" multimer", "");

      var list = {
        'macromolecule': true,
        'complex': true,
        'nucleic acid feature': true,
        'simple chemical': true
      };

      return list[sbgnclass] ? true : false;
    };

    // Returns whether the given element is an EPN
    elementUtilities.isEPNClass = function (ele) {
      var sbgnclass = (typeof ele === 'string' ? ele : ele.data('class')).replace(" multimer", "");

      return (sbgnclass == 'unspecified entity'
              || sbgnclass == 'simple chemical'
              || sbgnclass == 'macromolecule'
              || sbgnclass == 'nucleic acid feature'
              || sbgnclass == 'complex');
    };

    // Returns whether the given element is a PN
    elementUtilities.isPNClass = function (ele) {
      var sbgnclass = (typeof ele === 'string' ? ele : ele.data('class')).replace(" multimer", "");

      return (sbgnclass == 'process'
              || sbgnclass == 'omitted process'
              || sbgnclass == 'uncertain process'
              || sbgnclass == 'association'
              || sbgnclass == 'dissociation'
              || sbgnclass == 'phenotype');
    };

    // Returns wether the given element or string is of the special empty set/source and sink class
    elementUtilities.isEmptySetClass = function (ele) {
      var sbgnclass = (typeof ele === 'string' ? ele : ele.data('class')).replace(" multimer", "");
      return sbgnclass == 'source and sink';
    };

    // Returns whether the given element is a logical operator
    elementUtilities.isLogicalOperator = function (ele) {
      var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');
      return (sbgnclass == 'and' || sbgnclass == 'or' || sbgnclass == 'not' || sbgnclass == 'delay');
    };

    // Returns whether the class of given element is a equivalance class
    elementUtilities.convenientToEquivalence = function (ele) {
      var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');
      return (sbgnclass == 'tag' || sbgnclass == 'terminal');
    };

    // Returns wether the class of given elemnt is a modulation arc as defined in PD specs
    elementUtilities.isModulationArcClass = function (ele) {
      var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');
      return (sbgnclass == 'modulation'
              || sbgnclass == 'stimulation' || sbgnclass == 'catalysis'
              || sbgnclass == 'inhibition' || sbgnclass == 'necessary stimulation');
    }

    // Relocates state and info boxes. This function is expected to be called after add/remove state and info boxes
    elementUtilities.relocateStateAndInfos = function (ele) {
      var stateAndInfos = (ele.isNode && ele.isNode()) ? ele.data('statesandinfos') : ele;
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

    // Change state value or unit of information box of given nodes with given index.
    // Type parameter indicates whether to change value or variable, it is valid if the box at the given index is a state variable.
    // Value parameter is the new value to set.
    // This method returns the old value of the changed data (We assume that the old value of the changed data was the same for all nodes).
    elementUtilities.changeStateOrInfoBox = function (nodes, index, value, type) {
      var result;
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var stateAndInfos = node.data('statesandinfos');
        var box = stateAndInfos[index];

        if (box.clazz == "state variable") {
          if (!result) {
            result = box.state[type];
          }

          box.state[type] = value;
        }
        else if (box.clazz == "unit of information") {
          if (!result) {
            result = box.label.text;
          }

          box.label.text = value;
        }
      }

      return result;
    };

    // Add a new state or info box to given nodes.
    // The box is represented by the parameter obj.
    // This method returns the index of the just added box.
    elementUtilities.addStateOrInfoBox = function (nodes, obj) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];

        var locationObj;
        if(obj.clazz == "unit of information") {
          if (!node.data("language") || node.data("language") == "PD"){
            locationObj = sbgnvizInstance.classes.UnitOfInformation.create(node, cy, obj.label.text, obj.bbox, obj.location, obj.position, obj.index);
          }
          else if (node.data("language") == "AF"){
            locationObj = sbgnvizInstance.classes.UnitOfInformation.create(node, cy, obj.label.text, obj.bbox, obj.location, obj.position, obj.index,
                libs.cytoscape.sbgn.AfShapeFn, libs.cytoscape.sbgn.AfShapeArgsFn);
          }
        }
        else if (obj.clazz == "state variable") {
          locationObj = sbgnvizInstance.classes.StateVariable.create(node, cy, obj.state.value, obj.state.variable, obj.bbox, obj.location, obj.position, obj.index);
        }
      }
      return locationObj;
    };

    // Remove the state or info boxes of the given nodes at given index.
    // Returns the removed box.
    elementUtilities.removeStateOrInfoBox = function (nodes, locationObj) {
      var obj;
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var stateAndInfos = node.data('statesandinfos');
        var unit = stateAndInfos[locationObj.index];

        var unitClass = sbgnvizInstance.classes.getAuxUnitClass(unit);

        obj = unitClass.remove(unit, cy);
      }

      return obj;
    };

    // Set multimer status of the given nodes to the given status.
    elementUtilities.setMultimerStatus = function (nodes, status) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var sbgnclass = node.data('class');
        var isMultimer = node.data('class').endsWith(' multimer');

        if (status) { // Make multimer status true
          if (!isMultimer) {
            node.data('class', sbgnclass + ' multimer');
          }
        }
        else { // Make multimer status false
          if (isMultimer) {
            node.data('class', sbgnclass.replace(' multimer', ''));
          }
        }
      }
    };

    // Set clone marker status of given nodes to the given status.
    elementUtilities.setCloneMarkerStatus = function (nodes, status) {
      if (status) {
        nodes.data('clonemarker', true);
      }
      else {
        nodes.removeData('clonemarker');
      }
    };

    //elementUtilities.setCloneMarkerStatus = function()

    // Change font properties of the given elements with given font data
    elementUtilities.changeFontProperties = function (eles, data) {
      for (var prop in data) {
        eles.data(prop, data[prop]);
      }
    };

    // This function gets an edge, and ends of that edge (Optionally it may take just the classes of the edge as well) as parameters.
    // It may return 'valid' (that ends is valid for that edge), 'reverse' (that ends is not valid for that edge but they would be valid
    // if you reverse the source and target), 'invalid' (that ends are totally invalid for that edge).
    elementUtilities.validateArrowEnds = function (edge, source, target) {
      // if map type is Unknown -- no rules applied
      if (elementUtilities.getMapType() == "Unknown" || !elementUtilities.getMapType())
        return "valid";

      var edgeclass = typeof edge === 'string' ? edge : edge.data('class');
      var sourceclass = source.data('class');
      var targetclass = target.data('class');

      if (elementUtilities.getMapType() == "AF"){
        if (sourceclass.startsWith("BA")) // we have separate classes for each biological activity
          sourceclass = "biological activity"; // but same rule applies to all of them

        if (targetclass.startsWith("BA")) // we have separate classes for each biological activity
          targetclass = "biological activity"; // but same rule applies to all of them

        var edgeConstraints = this.AF.connectivityConstraints[edgeclass];
      }
      else{
        sourceclass = sourceclass.replace(/\s*multimer$/, '')
        targetclass = targetclass.replace(/\s*multimer$/, '')
        var edgeConstraints = this.PD.connectivityConstraints[edgeclass];
      }
      // given a node, acting as source or target, returns boolean wether or not it has too many edges already
      function hasTooManyEdges(node, sourceOrTarget) {
        var nodeclass = node.data('class');
        nodeclass = nodeclass.replace(/\s*multimer$/, '');
        if (nodeclass.startsWith("BA"))
          nodeclass = "biological activity";

        var totalTooMany = true;
        var edgeTooMany = true;
        if (sourceOrTarget == "source") {
            var sameEdgeCountOut = node.outgoers('edge[class="'+edgeclass+'"]').size();
            var totalEdgeCountOut = node.outgoers('edge').size();
            // check that the total edge count is within the limits
            if (typeof edgeConstraints[nodeclass].asSource.maxTotal == 'undefined'
                || totalEdgeCountOut < edgeConstraints[nodeclass].asSource.maxTotal ) {
                totalTooMany = false;
            }
            // then check limits for this specific edge class
            if (typeof edgeConstraints[nodeclass].asSource.maxEdge == 'undefined'
                || sameEdgeCountOut < edgeConstraints[nodeclass].asSource.maxEdge ) {
                edgeTooMany = false;
            }
            // if only one of the limits is reached then edge is invalid
            return totalTooMany || edgeTooMany;
        }
        else { // node is used as target
            var sameEdgeCountIn = node.incomers('edge[class="'+edgeclass+'"]').size();
            var totalEdgeCountIn = node.incomers('edge').size();
            if (typeof edgeConstraints[nodeclass].asTarget.maxTotal == 'undefined'
                || totalEdgeCountIn < edgeConstraints[nodeclass].asTarget.maxTotal ) {
                totalTooMany = false;
            }
            if (typeof edgeConstraints[nodeclass].asTarget.maxEdge == 'undefined'
                || sameEdgeCountIn < edgeConstraints[nodeclass].asTarget.maxEdge ) {
                edgeTooMany = false;
            }
            return totalTooMany || edgeTooMany;
        }
        return false;
      }

      function isInComplex(node) {
        var parentClass = node.parent().data('class');
        return parentClass && parentClass.startsWith('complex');
      }

      if (isInComplex(source) || isInComplex(target)) { // subunits of a complex are no longer EPNs, no connection allowed
        return 'invalid';
      }

      // check nature of connection
      if (edgeConstraints[sourceclass].asSource.isAllowed && edgeConstraints[targetclass].asTarget.isAllowed) {
        // check amount of connections
        if (!hasTooManyEdges(source, "source") && !hasTooManyEdges(target, "target") ) {
          return 'valid';
        }
      }
      // try to reverse
      if (edgeConstraints[targetclass].asSource.isAllowed && edgeConstraints[sourceclass].asTarget.isAllowed) {
        if (!hasTooManyEdges(target, "source") && !hasTooManyEdges(source, "target") ) {
          return 'reverse';
        }
      }
      return 'invalid';
    };

    /*
     * Hide given eles and perform given layout afterward. Layout parameter may be layout options
     * or a function to call.
     */
    elementUtilities.hideAndPerformLayout = function(eles, layoutparam) {
        var result = cy.viewUtilities().hide(eles); // Hide given eles
        if (typeof layoutparam === 'function') {
            layoutparam(); // If layoutparam is a function execute it
        }
        else {
            var layout = cy.layout(layoutparam); // If layoutparam is layout options call layout with that options.

            // Do this check for cytoscape.js backward compatibility
            if (layout && layout.run) {
                layout.run();
            }
        }

        return result;
    };

    /*
     * Unhide given eles and perform given layout afterward. Layout parameter may be layout options
     * or a function to call.
     */
    elementUtilities.showAndPerformLayout = function(eles, layoutparam) {
      var result = cy.viewUtilities().show(eles); // Show given eles
      if (typeof layoutparam === 'function') {
        layoutparam(); // If layoutparam is a function execute it
      }
      else {
        var layout = cy.layout(layoutparam); // If layoutparam is layout options call layout with that options.

        // Do this check for cytoscape.js backward compatibility
        if (layout && layout.run) {
          layout.run();
        }
      }

      return result;
    };

    /*
     * Change style/css of given eles by setting getting property name to the given value/values (Note that valueMap parameter may be
     * a single string or an id to value map).
     */
    elementUtilities.changeCss = function(eles, name, valueMap) {
      if ( typeof valueMap === 'object' ) {
        cy.startBatch();
        for (var i = 0; i < eles.length; i++) {
          var ele = eles[i];
          ele.css(name, valueMap[ele.id()]); // valueMap is an id to value map use it in this way
        }
        cy.endBatch();
      }
      else {
        eles.css(name, valueMap); // valueMap is just a string set css('name') for all eles to this value
      }
    };

    /*
     * Change data of given eles by setting getting property name to the given value/values (Note that valueMap parameter may be
     * a single string or an id to value map).
     */
    elementUtilities.changeData = function(eles, name, valueMap) {
      if ( typeof valueMap === 'object' ) {
        cy.startBatch();
        for (var i = 0; i < eles.length; i++) {
          var ele = eles[i];
          ele.data(name, valueMap[ele.id()]); // valueMap is an id to value map use it in this way
        }
        cy.endBatch();
      }
      else {
        eles.data(name, valueMap); // valueMap is just a string set css('name') for all eles to this value
      }
    };

    /*
     * Return the set of all nodes present under the given position
     * renderedPos must be a point defined relatively to cytoscape container
     * (like renderedPosition field of a node)
     */
    elementUtilities.getNodesAt = function(renderedPos) {
      var nodes = cy.nodes();
      var x = renderedPos.x;
      var y = renderedPos.y;
      var resultNodes = [];
      for(var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var renderedBbox = node.renderedBoundingBox({
          includeNodes: true,
          includeEdges: false,
          includeLabels: false,
          includeShadows: false
        });
        if (x >= renderedBbox.x1 && x <= renderedBbox.x2) {
          if (y >= renderedBbox.y1 && y <= renderedBbox.y2) {
            resultNodes.push(node);
          }
        }
      }
      return resultNodes;
    };

    elementUtilities.demultimerizeClass = function(sbgnclass) {
      return sbgnclass.replace(" multimer", "");
    };

    /**
     * @param mapType - type of the current map (PD, AF or Unknown)
     */
    elementUtilities.setMapType = function(mapType){
      elementUtilities.mapType = mapType;
      return mapType;
    }

    /**
     * return - map type
     */
    elementUtilities.getMapType = function(){
        return elementUtilities.mapType;
    }
    /**
     * Resets map type
     */
    elementUtilities.resetMapType = function(){
        elementUtilities.mapType = undefined;
    }

    /**
     * Keep consistency of links to self inside the data() structure.
     * This is needed whenever a node changes parents, for example,
     * as it is destroyed and recreated. But the data() stays identical.
     * This creates inconsistencies for the pointers stored in data(),
     * as they now point to a deleted node.
     */
    elementUtilities.maintainPointer = function (eles) {
      eles.nodes().forEach(function(ele){
        // skip nodes without any auxiliary units
        if(!ele.data('statesandinfos') || ele.data('statesandinfos').length == 0) {
          return;
        }
        for(var side in ele.data('auxunitlayouts')) {
          ele.data('auxunitlayouts')[side].parentNode = ele.id();
        }
        for(var i=0; i < ele.data('statesandinfos').length; i++) {
          ele.data('statesandinfos')[i].parent = ele.id();
        }
      });
    }
  }

  return elementUtilitiesExtender;
};

},{"./lib-utilities":4}],4:[function(_dereq_,module,exports){
/* 
 * Utility file to get and set the libraries to which sbgnviz is dependent from any file.
 */

var libUtilities = function(){
};

libUtilities.setLibs = function(libs) {
  this.libs = libs;
};

libUtilities.getLibs = function() {
  return this.libs;
};

module.exports = libUtilities;
},{}],5:[function(_dereq_,module,exports){
var libs = _dereq_('./lib-utilities').getLibs();

/*
 * The main utilities to be exposed directly.
 */
module.exports = function () {

  var elementUtilities, options, cy, sbgnvizInstance;

  function mainUtilities (param) {
    elementUtilities = param.elementUtilities;
    options = param.optionUtilities.getOptions();
    cy = param.sbgnvizInstanceUtilities.getCy();
    sbgnvizInstance = param.sbgnvizInstanceUtilities.getInstance();
  };

  /*
   * Adds a new node with the given class and at the given coordinates. Considers undoable option.
   */
  mainUtilities.addNode = function(x, y , nodeParams, id, parent, visibility) {
    // update map type
    if (typeof nodeParams == 'object'){

      if (!elementUtilities.getMapType())
        elementUtilities.setMapType(nodeParams.language);
      else if (elementUtilities.getMapType() != nodeParams.language)
        elementUtilities.setMapType("Unknown");
    }

    if (!options.undoable) {
      return elementUtilities.addNode(x, y, nodeParams, id, parent, visibility);
    }
    else {
      var param = {
        newNode : {
          x: x,
          y: y,
          class: nodeParams,
          id: id,
          parent: parent,
          visibility: visibility
        }
      };

      cy.undoRedo().do("addNode", param);
    }
  };

  /*
   * Adds a new edge with the given class and having the given source and target ids. Considers undoable option.
   */
  mainUtilities.addEdge = function(source, target, edgeParams, id, visibility) {
    // update map type
    if (typeof edgeParams == 'object'){

      if (!elementUtilities.getMapType())
        elementUtilities.setMapType(edgeParams.language);
      else if (elementUtilities.getMapType() != edgeParams.language)
        elementUtilities.setMapType("Unknown");
    }
    // Get the validation result
    var edgeclass = edgeParams.class ? edgeParams.class : edgeParams;
    var validation = elementUtilities.validateArrowEnds(edgeclass, cy.getElementById(source), cy.getElementById(target));

    // If validation result is 'invalid' cancel the operation
    if (validation === 'invalid') {
      return;
    }

    // If validation result is 'reverse' reverse the source-target pair before creating the edge
    if (validation === 'reverse') {
      var temp = source;
      source = target;
      target = temp;
    }

    if (!options.undoable) {
      return elementUtilities.addEdge(source, target, edgeParams, id, visibility);
    }
    else {
      var param = {
        newEdge : {
          source: source,
          target: target,
          class: edgeParams,
          id: id,
          visibility: visibility
        }
      };

      cy.undoRedo().do("addEdge", param);
    }
  };

  /*
   * Adds a process with convenient edges. For more information please see 'https://github.com/iVis-at-Bilkent/newt/issues/9'.
   * Considers undoable option.
   */
  mainUtilities.addProcessWithConvenientEdges = function(_source, _target, processType) {
    // If source and target IDs are given get the elements by IDs
    var source = typeof _source === 'string' ? cy.getElementById(_source) : _source;
    var target = typeof _target === 'string' ? cy.getElementById(_target) : _target;

    // If source or target does not have an EPN class the operation is not valid
    if (!elementUtilities.isEPNClass(source) || !elementUtilities.isEPNClass(target)) {
      return;
    }

    if (!options.undoable) {
      return elementUtilities.addProcessWithConvenientEdges(_source, _target, processType);
    }
    else {
      var param = {
        source: _source,
        target: _target,
        processType: processType
      };

      cy.undoRedo().do("addProcessWithConvenientEdges", param);
    }
  };

  // convert collapsed compound nodes to simple nodes
  // and update port values of pasted nodes and edges
  var cloneCollapsedNodesAndPorts = function (elesBefore){
    cy.elements().unselect();
    var elesAfter = cy.elements();
    var elesDiff = elesAfter.diff(elesBefore).left;

    // shallow copy collapsed nodes - collapsed compounds become simple nodes
    // data related to collapsed nodes are removed from generated clones
    // related issue: https://github.com/iVis-at-Bilkent/newt/issues/145
    var collapsedNodes = elesDiff.filter('node.cy-expand-collapse-collapsed-node');

    collapsedNodes.connectedEdges().remove();
    collapsedNodes.removeClass('cy-expand-collapse-collapsed-node');
    collapsedNodes.removeData('collapsedChildren');
    collapsedNodes.removeData('position-before-collapse size-before-collapse');
    collapsedNodes.removeData('expandcollapseRenderedCueSize expandcollapseRenderedStartX expandcollapseRenderedStartY');

    // cloning ports
    elesDiff.nodes().forEach(function(_node){
      if(_node.data("ports").length == 2){
          var oldPortName0 = _node.data("ports")[0].id;
          var oldPortName1 = _node.data("ports")[1].id;
          _node.data("ports")[0].id = _node.id() + ".1";
          _node.data("ports")[1].id = _node.id() + ".2";

          _node.outgoers().edges().forEach(function(_edge){
            if(_edge.data("portsource") == oldPortName0){
              _edge.data("portsource", _node.data("ports")[0].id);
            }
            else if(_edge.data("portsource") == oldPortName1){
              _edge.data("portsource", _node.data("ports")[1].id);
            }
            else{
              _edge.data("portsource", _node.id());
            }
          });
          _node.incomers().edges().forEach(function(_edge){
            if(_edge.data("porttarget") == oldPortName0){
              _edge.data("porttarget", _node.data("ports")[0].id);
            }
            else if(_edge.data("porttarget") == oldPortName1){
              _edge.data("porttarget", _node.data("ports")[1].id);
            }
            else{
              _edge.data("porttarget", _node.id());
            }
          });
      }
      else{
        _node.outgoers().edges().forEach(function(_edge){
          _edge.data("portsource", _node.id());
        });
        _node.incomers().edges().forEach(function(_edge){
          _edge.data("porttarget", _node.id());
        });
      }
    });
    elesDiff.select();
  }

  /*
   * Clone given elements. Considers undoable option. Requires cytoscape-clipboard extension.
   */
  mainUtilities.cloneElements = function (eles) {
    if (eles.length === 0) {
      return;
    }
    var elesBefore = cy.elements();

    var cb = cy.clipboard();
    var _id = cb.copy(eles, "cloneOperation");

    if (options.undoable) {
      cy.undoRedo().do("paste", {id: _id});
    }
    else {
      cb.paste(_id);
    }
    cloneCollapsedNodesAndPorts(elesBefore);
  };

  /*
   * Copy given elements to clipboard. Requires cytoscape-clipboard extension.
   */
  mainUtilities.copyElements = function (eles) {
    cy.clipboard().copy(eles);
  };

  /*
   * Past the elements copied to clipboard. Considers undoable option. Requires cytoscape-clipboard extension.
   */
  mainUtilities.pasteElements = function() {
    var elesBefore = cy.elements();

    if (options.undoable) {
      cy.undoRedo().do("paste");
    }
    else {
      cy.clipboard().paste();
    }
    cloneCollapsedNodesAndPorts(elesBefore);
  };

  /*
   * Aligns given nodes in given horizontal and vertical order.
   * Horizontal and vertical parameters may be 'none' or undefined.
   * alignTo parameter indicates the leading node.
   * Requrires cytoscape-grid-guide extension and considers undoable option.
   */
  mainUtilities.align = function (nodes, horizontal, vertical, alignTo) {
    if (nodes.length === 0) {
      return;
    }

    if (options.undoable) {
      cy.undoRedo().do("align", {
        nodes: nodes,
        horizontal: horizontal,
        vertical: vertical,
        alignTo: alignTo
      });
    } else {
      nodes.align(horizontal, vertical, alignTo);
    }
  };

  /*
   * Create compound for given nodes. compoundType may be 'complex' or 'compartment'.
   * This method considers undoable option.
   */
  mainUtilities.createCompoundForGivenNodes = function (_nodes, compoundType) {
    var nodes = _nodes;
    /*
     * Eleminate the nodes which cannot have a parent with given compound type
     */
    nodes = _nodes.filter(function (element, i) {
      if(typeof element === "number") {
        element = i;
      }

      var sbgnclass = element.data("class");
      return elementUtilities.isValidParent(sbgnclass, compoundType, element);
    });

    nodes = elementUtilities.getTopMostNodes(nodes);

    // All elements should have the same parent and the common parent should not be a 'complex'
    // if compoundType is 'compartent'
    // because the old common parent will be the parent of the new compartment after this operation and
    // 'complexes' cannot include 'compartments'
    if (nodes.length == 0 || !elementUtilities.allHaveTheSameParent(nodes)
            || ( (compoundType === 'compartment' || compoundType == 'submap') && nodes.parent().data('class')
            && nodes.parent().data('class').startsWith('complex') )) {
      return;
    }

    if (cy.undoRedo()) {
      var param = {
        compoundType: compoundType,
        nodesToMakeCompound: nodes
      };

      cy.undoRedo().do("createCompoundForGivenNodes", param);
    }
    else {
      elementUtilities.createCompoundForGivenNodes(nodes, compoundType);
    }
  };

  /*
   * Move the nodes to a new parent and change their position if possDiff params are set.
   * Considers undoable option and checks if the operation is valid.
   */
  mainUtilities.changeParent = function(nodes, _newParent, posDiffX, posDiffY) {
    var newParent = typeof _newParent === 'string' ? cy.getElementById(_newParent) : _newParent;
    // New parent is supposed to be one of the root, a complex or a compartment
    if (newParent && !newParent.data("class").startsWith("complex") && newParent.data("class") != "compartment"
            && newParent.data("class") != "submap") {
      return;
    }
    /*
     * Eleminate the nodes which cannot have the newParent as their parent
     */
    nodes = nodes.filter(function (element, i) {
      if(typeof element === "number") {
        element = i;
      }

      var sbgnclass = element.data("class");
      return elementUtilities.isValidParent(sbgnclass, newParent, element);
    });

    // Discard the nodes whose parent is already newParent.
    // Discard the newParent itself if it is among the nodes
    nodes = nodes.filter(function (ele, i) {
      if(typeof ele === "number") {
        ele = i;
      }

      // Discard the newParent if it is among the nodes
      if (newParent && ele.id() === newParent.id()) {
        return false;
      }
      // Discard the nodes whose parent is already newParent
      if (!newParent) {
        return ele.data('parent') != null;
      }
      return ele.data('parent') !== newParent.id();
    });

    // If some nodes are ancestor of new parent eleminate them
    if (newParent) {
      nodes = nodes.difference(newParent.ancestors());
    }

    // If all nodes are eleminated return directly
    if (nodes.length === 0) {
      return;
    }

    // Just move the top most nodes
    nodes = elementUtilities.getTopMostNodes(nodes);

    var parentId = newParent ? newParent.id() : null;

    if (options.undoable) {
      var param = {
        firstTime: true,
        parentData: parentId, // It keeps the newParentId (Just an id for each nodes for the first time)
        nodes: nodes,
        posDiffX: posDiffX,
        posDiffY: posDiffY,
        // This is needed because the changeParent function called is not from elementUtilities
        // but from the undoRedo extension directly, so maintaining pointer is not automatically done.
        callback: elementUtilities.maintainPointer
      };

      cy.undoRedo().do("changeParent", param); // This action is registered by undoRedo extension
    }
    else {
      elementUtilities.changeParent(nodes, parentId, posDiffX, posDiffY);
    }
  };

  /*
   * Creates a template reaction with given parameters. Requires cose-bilkent layout to tile the free macromolecules included
   * in the complex. Considers undoable option. For more information see the same function in elementUtilities
   */
  mainUtilities.createTemplateReaction = function (templateType, macromoleculeList, complexName, processPosition, tilingPaddingVertical, tilingPaddingHorizontal, edgeLength) {
    if (!options.undoable) {
      elementUtilities.createTemplateReaction(templateType, macromoleculeList, complexName, processPosition, tilingPaddingVertical, tilingPaddingHorizontal, edgeLength);
    }
    else {
      var param = {
        templateType: templateType,
        macromoleculeList: macromoleculeList,
        complexName: complexName,
        processPosition: processPosition,
        tilingPaddingVertical: tilingPaddingVertical,
        tilingPaddingHorizontal: tilingPaddingHorizontal,
        edgeLength: edgeLength
      };

      cy.undoRedo().do("createTemplateReaction", param);
    }
  };

  /*
   * Resize given nodes if useAspectRatio is truthy one of width or height should not be set.
   * Considers undoable option.
   */
  mainUtilities.resizeNodes = function(nodes, width, height, useAspectRatio) {
    if (nodes.length === 0) {
      return;
    }

    if (options.undoable) {
      var param = {
        nodes: nodes,
        width: width,
        height: height,
        useAspectRatio: useAspectRatio,
        performOperation: true
      };

      cy.undoRedo().do("resizeNodes", param);
    }
    else {
      elementUtilities.resizeNodes(nodes, width, height, useAspectRatio);
    }

    cy.style().update();
  };

  /*
   * Changes the label of the given nodes to the given label. Considers undoable option.
   */
  mainUtilities.changeNodeLabel = function(nodes, label) {
    if (nodes.length === 0) {
      return;
    }

    if (!options.undoable) {
      nodes.data('label', label);
    }
    else {
      var param = {
        nodes: nodes,
        label: label,
        firstTime: true
      };

      cy.undoRedo().do("changeNodeLabel", param);
    }

    cy.style().update();
  };

  /*
   * Change font properties for given nodes use the given font data.
   * Considers undoable option.
   */
  mainUtilities.changeFontProperties = function(eles, data) {
    if (eles.length === 0) {
      return;
    }

    if (options.undoable) {
      var param = {
        eles: eles,
        data: data,
        firstTime: true
      };

      cy.undoRedo().do("changeFontProperties", param);
    }
    else {
      elementUtilities.changeFontProperties(eles, data);
    }

    cy.style().update();
  };

  /*
   * Change state value or unit of information box of given nodes with given index.
   * Considers undoable option.
   * For more information about the parameters see elementUtilities.changeStateOrInfoBox
   */
  mainUtilities.changeStateOrInfoBox = function(nodes, index, value, type) {
    if (nodes.length === 0) {
      return;
    }
    if (options.undoable) {
      var param = {
        index: index,
        value: value,
        type: type,
        nodes: nodes
      };

      cy.undoRedo().do("changeStateOrInfoBox", param);
    }
    else {
      return elementUtilities.changeStateOrInfoBox(nodes, index, value, type);
    }

    cy.style().update();
  };

  // Add a new state or info box to given nodes.
  // The box is represented by the parameter obj.
  // Considers undoable option.
  mainUtilities.addStateOrInfoBox = function(nodes, obj) {
    if (nodes.length === 0) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.addStateOrInfoBox(nodes, obj);
    }
    else {
      var param = {
        obj: obj,
        nodes: nodes
      };

      cy.undoRedo().do("addStateOrInfoBox", param);
    }

    cy.style().update();
  };

  // Remove the state or info boxes of the given nodes at given index.
  // Considers undoable option.
  mainUtilities.removeStateOrInfoBox = function(nodes, index) {
    if (nodes.length === 0) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.removeStateOrInfoBox(nodes, {index: index});
    }
    else {
      var param = {
        locationObj: {index: index},
        nodes: nodes
      };

      cy.undoRedo().do("removeStateOrInfoBox", param);
    }

    cy.style().update();
  };

  /*
   * Set multimer status of the given nodes to the given status.
   * Considers undoable option.
   */
  mainUtilities.setMultimerStatus = function(nodes, status) {
    if (nodes.length === 0) {
      return;
    }

    if (options.undoable) {
      var param = {
        status: status,
        nodes: nodes,
        firstTime: true
      };

      cy.undoRedo().do("setMultimerStatus", param);
    }
    else {
      elementUtilities.setMultimerStatus(nodes, status);
    }

    cy.style().update();
  };

  /*
   * Set clone marker status of given nodes to the given status.
   * Considers undoable option.
   */
  mainUtilities.setCloneMarkerStatus = function(nodes, status) {
    if (nodes.length === 0) {
      return;
    }

    if (options.undoable) {
      var param = {
        status: status,
        nodes: nodes,
        firstTime: true
      };

      cy.undoRedo().do("setCloneMarkerStatus", param);
    }
    else {
      elementUtilities.setCloneMarkerStatus(nodes, status);
    }

    cy.style().update();
  };

  /*
   * Change style/css of given eles by setting getting property name to the given given value/values (Note that valueMap parameter may be
   * a single string or an id to value map). Considers undoable option.
   */
  mainUtilities.changeCss = function(eles, name, valueMap) {
    if (eles.length === 0) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.changeCss(eles, name, valueMap);
    }
    else {
      var param = {
        eles: eles,
        valueMap: valueMap,
        name: name
      };

      cy.undoRedo().do("changeCss", param);
    }

    cy.style().update();
  };

  /*
   * Change data of given eles by setting getting property name to the given given value/values (Note that valueMap parameter may be
   * a single string or an id to value map). Considers undoable option.
   */
  mainUtilities.changeData = function(eles, name, valueMap) {
    if (eles.length === 0) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.changeData(eles, name, valueMap);
    }
    else {
      var param = {
        eles: eles,
        valueMap: valueMap,
        name: name
      };

      cy.undoRedo().do("changeData", param);
    }

    cy.style().update();
  };


  /*
   * Hides given eles (the ones which are selected) and perform given layout afterward. Layout parameter may be layout options
   * or a function to call. Requires viewUtilities extension and considers undoable option.
   */
  mainUtilities.hideAndPerformLayout = function(eles, layoutparam) {
      var nodes = eles.nodes(); // Ensure that nodes list just include nodes

      var allNodes = cy.nodes(":visible");
      var nodesToShow = elementUtilities.extendRemainingNodes(nodes, allNodes);
      var nodesToHide = allNodes.not(nodesToShow);

      if (nodesToHide.length === 0) {
          return;
      }

      if (!options.undoable) {

          var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
          sbgnvizInstance.thinBorder(nodesWithHiddenNeighbor);
          elementUtilities.hideAndPerformLayout(nodesToHide, layoutparam);
          var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
          sbgnvizInstance.thickenBorder(nodesWithHiddenNeighbor);
      }
      else {
          var param = {
              eles: nodesToHide,
              layoutparam: layoutparam,
              firstTime: true
          };

          var ur = cy.undoRedo();
          ur.action("thickenBorder", sbgnvizInstance.thickenBorder, sbgnvizInstance.thinBorder);
          ur.action("thinBorder", sbgnvizInstance.thinBorder, sbgnvizInstance.thickenBorder);

          var actions = [];
          var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes().intersection(nodesToHide);
          actions.push({name: "thinBorder", param: nodesWithHiddenNeighbor});
          actions.push({name: "hideAndPerformLayout", param: param});
          nodesWithHiddenNeighbor = nodesToHide.neighborhood(":visible").nodes().difference(nodesToHide).difference(cy.nodes("[thickBorder]"));
          actions.push({name: "thickenBorder", param: nodesWithHiddenNeighbor});
          cy.undoRedo().do("batch", actions);
      }
  };

  /*
   * Shows all elements (the ones which are hidden if any) and perform given layout afterward. Layout parameter may be layout options
   * or a function to call. Requires viewUtilities extension and considers undoable option.
   */
  mainUtilities.showAllAndPerformLayout = function(layoutparam) {
    var hiddenEles = cy.elements(':hidden');
    if (hiddenEles.length === 0) {
      return;
    }
    if (!options.undoable) {
      var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
      sbgnvizInstance.thinBorder(nodesWithHiddenNeighbor);
      elementUtilities.showAndPerformLayout(hiddenEles, layoutparam);
    }
    else {
      var param = {
        eles: hiddenEles,
        layoutparam: layoutparam,
        firstTime: true
      };

      var ur = cy.undoRedo();
      ur.action("thickenBorder", sbgnvizInstance.thickenBorder, sbgnvizInstance.thinBorder);
      ur.action("thinBorder", sbgnvizInstance.thinBorder, sbgnvizInstance.thickenBorder);

      var actions = [];
      var nodesWithHiddenNeighbor = cy.nodes("[thickBorder]");
      actions.push({name: "thinBorder", param: nodesWithHiddenNeighbor});
      actions.push({name: "showAndPerformLayout", param: param});
      cy.undoRedo().do("batch", actions);
    }
  };

  /*
   * Unhide given eles (the ones which are hidden if any) and perform given layout afterward. Layout parameter may be layout options
   * or a function to call. Requires viewUtilities extension and considers undoable option.
   */
  mainUtilities.showAndPerformLayout = function(mainEle, eles, layoutparam) {
      var hiddenEles = eles.filter(':hidden');
      if (hiddenEles.length === 0) {
          return;
      }
      mainUtilities.closeUpElements(mainEle, hiddenEles.nodes());
      if (!options.undoable) {
          var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
          sbgnvizInstance.thinBorder(nodesWithHiddenNeighbor);
          elementUtilities.showAndPerformLayout(hiddenEles, layoutparam);
          var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
          sbgnvizInstance.thickenBorder(nodesWithHiddenNeighbor);
      }
      else {
          var param = {
              eles: hiddenEles,
              layoutparam: layoutparam,
              firstTime: true
          };

          var ur = cy.undoRedo();
          ur.action("thickenBorder", sbgnvizInstance.thickenBorder, sbgnvizInstance.thinBorder);
          ur.action("thinBorder", sbgnvizInstance.thinBorder, sbgnvizInstance.thickenBorder);

          var actions = [];
          var nodesToThinBorder = (hiddenEles.neighborhood(":visible").nodes("[thickBorder]"))
                  .difference(cy.edges(":hidden").difference(hiddenEles.edges().union(hiddenEles.nodes().connectedEdges())).connectedNodes());
          actions.push({name: "thinBorder", param: nodesToThinBorder});
          actions.push({name: "showAndPerformLayout", param: param});
          var nodesToThickenBorder = hiddenEles.nodes().edgesWith(cy.nodes(":hidden").difference(hiddenEles.nodes()))
  	            .connectedNodes().intersection(hiddenEles.nodes());
          actions.push({name: "thickenBorder", param: nodesToThickenBorder});
          cy.undoRedo().do("batch", actions);
      }
  };

  /*
  * Takes the hidden elements close to the nodes whose neighbors will be shown
  * */
  mainUtilities.closeUpElements = function(mainEle, hiddenEles) {
      var leftX = Number.MAX_VALUE;
      var rightX = Number.MIN_VALUE;
      var topY = Number.MAX_VALUE;
      var bottomY = Number.MIN_VALUE;
      // Check the x and y limits of all hidden elements and store them in the variables above
      hiddenEles.forEach(function( ele ){
          if (ele.data('class') != 'compartment' &&  ele.data('class') != 'complex')
          {
              var halfWidth = ele.outerWidth()/2;
              var halfHeight = ele.outerHeight()/2;
              if (ele.position("x") - halfWidth < leftX)
                  leftX = ele.position("x") - halfWidth;
              if (ele.position("x") + halfWidth > rightX)
                  rightX = ele.position("x") + halfWidth;
              if (ele.position("y") - halfHeight < topY)
                  topY = ele.position("y") - halfHeight;
              if (ele.position("y") + halfHeight > topY)
                  bottomY = ele.position("y") + halfHeight;
          }
      });

      //The coordinates of the old center containing the hidden nodes
      var oldCenterX = (leftX + rightX)/2;
      var oldCenterY = (topY + bottomY)/2;

      //Here we calculate two parameters which define the area in which the hidden elements are placed initially
      var minHorizontalParam = mainEle.outerWidth()/2 + (rightX - leftX)/2;
      var maxHorizontalParam = mainEle.outerWidth() + (rightX - leftX)/2;
      var minVerticalParam = mainEle.outerHeight()/2 + (bottomY - topY)/2;
      var maxVerticalParam = mainEle.outerHeight() + (bottomY - topY)/2;

      //Quadrants is an object of the form {first:"obtained", second:"free", third:"free", fourth:"obtained"}
      // which holds which quadrant are free (that's where hidden nodes will be brought)
      var quadrants = mainUtilities.checkOccupiedQuadrants(mainEle, hiddenEles);
      var freeQuadrants = [];
      for (var property in quadrants) {
          if (quadrants[property] === "free")
              freeQuadrants.push(property);
      }

      //Can take values 1 and -1 and are used to place the hidden nodes in the random quadrant
      var horizontalMult;
      var verticalMult;
      if (freeQuadrants.length > 0)
      {
        if (freeQuadrants.length === 3)
        {
          if (freeQuadrants.includes('first') && freeQuadrants.includes('second') && freeQuadrants.includes('third'))
          {
            horizontalMult = -1;
            verticalMult = -1;
          }
          else if (freeQuadrants.includes('first') && freeQuadrants.includes('second') && freeQuadrants.includes('fourth'))
          {
            horizontalMult = 1;
            verticalMult = -1;
          }
          else if (freeQuadrants.includes('first') && freeQuadrants.includes('third') && freeQuadrants.includes('fourth'))
          {
            horizontalMult = 1;
            verticalMult = 1;
          }
          else if (freeQuadrants.includes('second') && freeQuadrants.includes('third') && freeQuadrants.includes('fourth'))
          {
            horizontalMult = -1;
            verticalMult = 1;
          }
        }
        else
        {
          //Randomly picks one quadrant from the free quadrants
          var randomQuadrant = freeQuadrants[Math.floor(Math.random()*freeQuadrants.length)];

          if (randomQuadrant === "first") {
              horizontalMult = 1;
              verticalMult = -1;
          }
          else if (randomQuadrant === "second") {
              horizontalMult = -1;
              verticalMult = -1;
          }
          else if (randomQuadrant === "third") {
              horizontalMult = -1;
              verticalMult = 1;
          }
          else if (randomQuadrant === "fourth") {
              horizontalMult = 1;
              verticalMult = 1;
          }
        }
      }
      else
      {
          horizontalMult = 0;
          verticalMult = 0;
      }
      // If the horizontalMult is 0 it means that no quadrant is free, so we randomly choose a quadrant
      var horizontalParam = mainUtilities.generateRandom(minHorizontalParam,maxHorizontalParam,horizontalMult);
      var verticalParam = mainUtilities.generateRandom(minVerticalParam,maxVerticalParam,verticalMult);

      //The coordinates of the center where the hidden nodes will be transfered
      var newCenterX = mainEle.position("x") + horizontalParam;
      var newCenterY = mainEle.position("y") + verticalParam;

      var xdiff = newCenterX - oldCenterX;
      var ydiff = newCenterY - oldCenterY;

      //Change the position of hidden elements
      hiddenEles.forEach(function( ele ){
          var newx = ele.position("x") + xdiff;
          var newy = ele.position("y") + ydiff;
          ele.position("x", newx);
          ele.position("y",newy);
      });
  };

  /*
   * Generates a number between 2 nr and multimplies it with 1 or -1
   * */
  mainUtilities.generateRandom = function(min, max, mult) {
      var val = [-1,1];
      if (mult === 0)
          mult = val[Math.floor(Math.random()*val.length)];
      return (Math.floor(Math.random() * (max - min + 1)) + min) * mult;
  };

  /*
   * This function makes sure that the random number lies in free quadrant
   * */
  mainUtilities.checkOccupiedQuadrants = function(mainEle, hiddenEles) {
      if (elementUtilities.getMapType() == 'PD')
      {
        var visibleNeighborEles = mainEle.neighborhood().difference(hiddenEles).nodes();
        var visibleNeighborsOfNeighbors = visibleNeighborEles.neighborhood().difference(hiddenEles).difference(mainEle).nodes();
        var visibleEles = visibleNeighborEles.union(visibleNeighborsOfNeighbors);
      }
      else
        var visibleEles = mainEle.neighborhood().difference(hiddenEles).nodes();
      var occupiedQuadrants = {first:"free", second:"free", third:"free", fourth:"free"};

      visibleEles.forEach(function( ele ){
          if (ele.data('class') != 'compartment' &&  ele.data('class') != 'complex')
          {
              if (ele.position("x") < mainEle.position("x") && ele.position("y") < mainEle.position("y"))
                  occupiedQuadrants.second = "occupied";
              else if (ele.position("x") > mainEle.position("x") && ele.position("y") < mainEle.position("y"))
                  occupiedQuadrants.first = "occupied";
              else if (ele.position("x") < mainEle.position("x") && ele.position("y") > mainEle.position("y"))
                  occupiedQuadrants.third = "occupied";
              else if (ele.position("x") > mainEle.position("x") && ele.position("y") > mainEle.position("y"))
                  occupiedQuadrants.fourth = "occupied";
          }
      });
      return occupiedQuadrants;
  };

  // Overrides highlightProcesses from SBGNVIZ - do not highlight any nodes when the map type is AF
  mainUtilities.highlightProcesses = function(_nodes) {
    if (elementUtilities.getMapType() == "AF")
      return;
    sbgnvizInstance.highlightProcesses(_nodes);
  };

  /**
   * Resets map type to undefined
   */
  mainUtilities.resetMapType = function(){
    elementUtilities.resetMapType();
  };

  /**
   * return : map type
   */
  mainUtilities.getMapType = function(){
    return elementUtilities.getMapType();
  };

  return mainUtilities;
};

},{"./lib-utilities":4}],6:[function(_dereq_,module,exports){
/*
 *  Extend default options and get current options by using this file
 */

module.exports = function () {

  // default options
  var defaults = {
    // The path of core library images when sbgnviz is required from npm and the index html
    // file and node_modules are under the same folder then using the default value is fine
    imgPath: 'node_modules/sbgnviz/src/img',
    // Whether to fit labels to nodes
    fitLabelsToNodes: function () {
      return false;
    },
    fitLabelsToInfoboxes: function () {
      return false;
    },
    // dynamic label size it may be 'small', 'regular', 'large'
    dynamicLabelSize: function () {
      return 'regular';
    },
    // Whether to infer nesting on load 
    inferNestingOnLoad: function () {
      return false;
    },
    // percentage used to calculate compound paddings
    compoundPadding: function () {
      return 10;
    },
    // Whether to adjust node label font size automatically.
    // If this option return false do not adjust label sizes according to node height uses node.data('font-size')
    // instead of doing it.
    adjustNodeLabelFontSizeAutomatically: function() {
      return true;
    },
    // The selector of the component containing the sbgn network
    networkContainerSelector: '#sbgn-network-container',
    // Whether the actions are undoable, requires cytoscape-undo-redo extension
    undoable: true,
    // Whether to have undoable drag feature in undo/redo extension. This options will be passed to undo/redo extension
    undoableDrag: true
  };

  var optionUtilities = function () {
  };

  // Extend the defaults options with the user options
  optionUtilities.extendOptions = function (options) {
    var result = {};

    for (var prop in defaults) {
      result[prop] = defaults[prop];
    }

    for (var prop in options) {
      result[prop] = options[prop];
    }

    optionUtilities.options = result;

    return options;
  };

  optionUtilities.getOptions = function () {
    return optionUtilities.options;
  };

  return optionUtilities;
};

},{}],7:[function(_dereq_,module,exports){
var libs = _dereq_('./lib-utilities').getLibs();
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

    // register easy creation actions
    ur.action("createTemplateReaction", undoRedoActionFunctions.createTemplateReaction, undoRedoActionFunctions.deleteElesSimple);

    ur.action("setDefaultProperty", undoRedoActionFunctions.setDefaultProperty, undoRedoActionFunctions.setDefaultProperty);
  };

  return registerUndoRedoActions;
};

},{"./lib-utilities":4}],8:[function(_dereq_,module,exports){
var libs = _dereq_('./lib-utilities').getLibs();

module.exports = function () {

  var instance;

  function sbgnvizInstanceUtilities (options) {

    instance = libs.sbgnviz(options);

    return instance;
  }

  sbgnvizInstanceUtilities.getInstance = function () {
    return instance;
  }

  sbgnvizInstanceUtilities.getCy = function () {
    return this.getInstance().getCy();
  }

  return sbgnvizInstanceUtilities;
};

},{"./lib-utilities":4}],9:[function(_dereq_,module,exports){
// Extends sbgnviz.undoRedoActionFunctions
var libs = _dereq_('./lib-utilities').getLibs();

module.exports = function () {

  var sbgnvizInstance, undoRedoActionFunctions, elementUtilities, cy;

  function undoRedoActionFunctionsExtender (param) {

    sbgnvizInstance = param.sbgnvizInstanceUtilities.getInstance();
    cy = param.sbgnvizInstanceUtilities.getCy();
    undoRedoActionFunctions = sbgnvizInstance.undoRedoActionFunctions;
    elementUtilities = param.elementUtilities;

    extend();
  }

  // Extends undoRedoActionFunctions with chise specific features
  function extend () {
    // Section Start
    // add/remove action functions

    undoRedoActionFunctions.addNode = function (param) {
      var result;
      if (param.firstTime) {
        var newNode = param.newNode;
        result = elementUtilities.addNode(newNode.x, newNode.y, newNode.class, newNode.id, newNode.parent, newNode.visibility);
      }
      else {
        result = elementUtilities.restoreEles(param);
      }

      return {
        eles: result
      };
    };

    undoRedoActionFunctions.addEdge = function (param) {
      var result;
      if (param.firstTime) {
        var newEdge = param.newEdge;
        result = elementUtilities.addEdge(newEdge.source, newEdge.target, newEdge.class, newEdge.id, newEdge.visibility);
      }
      else {
        result = elementUtilities.restoreEles(param);
      }

      return {
        eles: result
      };
    };

    undoRedoActionFunctions.addProcessWithConvenientEdges = function(param) {
      var result;
      if (param.firstTime) {
        result = elementUtilities.addProcessWithConvenientEdges(param.source, param.target, param.processType);
      }
      else {
        result = elementUtilities.restoreEles(param);
      }

      return {
        eles: result
      };
    };

    undoRedoActionFunctions.createCompoundForGivenNodes = function (param) {
      var result = {};

      if (param.firstTime) {
        // Nodes to make compound, their descendants and edges connected to them will be removed during createCompoundForGivenNodes operation
        // (internally by eles.move() operation), so mark them as removed eles for undo operation.
        var nodesToMakeCompound = param.nodesToMakeCompound;
        var removedEles = nodesToMakeCompound.union(nodesToMakeCompound.descendants());
        removedEles = removedEles.union(removedEles.connectedEdges());
        result.removedEles = removedEles;
        // Assume that all nodes to make compound have the same parent
        var oldParentId = nodesToMakeCompound[0].data("parent");
        // The parent of new compound will be the old parent of the nodes to make compound
        // New eles includes new compound and the moved eles and will be used in undo operation.
        result.newEles = elementUtilities.createCompoundForGivenNodes(nodesToMakeCompound, param.compoundType);
      }
      else {
        result.removedEles = param.newEles.remove();
        result.newEles = param.removedEles.restore();
        elementUtilities.maintainPointer(result.newEles);
      }

      return result;
    };

    // Section End
    // add/remove action functions

    // Section Start
    // easy creation action functions

    undoRedoActionFunctions.createTemplateReaction = function (param) {
      var firstTime = param.firstTime;
      var eles;

      if (firstTime) {
        eles = elementUtilities.createTemplateReaction(param.templateType, param.macromoleculeList, param.complexName, param.processPosition, param.tilingPaddingVertical, param.tilingPaddingHorizontal, param.edgeLength)
      }
      else {
        eles = param;
        cy.add(eles);

        cy.elements().unselect();
        eles.select();
      }

      return {
        eles: eles
      };
    };

    // Section End
    // easy creation action functions

    // Section Start
    // general action functions

    undoRedoActionFunctions.getNodePositions = function () {
      var positions = {};
      var nodes = cy.nodes();

      nodes.each(function(ele, i) {
        if(typeof ele === "number") {
          ele = i;
        }

        positions[ele.id()] = {
          x: ele.position("x"),
          y: ele.position("y")
        };
      });

      return positions;
    };

    undoRedoActionFunctions.returnToPositions = function (positions) {
      var currentPositions = {};
      cy.nodes().positions(function (ele, i) {
        if(typeof ele === "number") {
          ele = i;
        }

        currentPositions[ele.id()] = {
          x: ele.position("x"),
          y: ele.position("y")
        };

        var pos = positions[ele.id()];
        return {
          x: pos.x,
          y: pos.y
        };
      });

      return currentPositions;
    };

    undoRedoActionFunctions.resizeNodes = function (param) {
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
            node.data("bbox").w = param.sizeMap[node.id()].w;
            node.data("bbox").h = param.sizeMap[node.id()].h;
          }
          else {
            elementUtilities.resizeNodes(param.nodes, param.width, param.height, param.useAspectRatio);
          }
        }
      }

      return result;
    };

    undoRedoActionFunctions.changeNodeLabel = function (param) {
      var result = {
      };
      var nodes = param.nodes;
      result.nodes = nodes;
      result.label = {};

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        result.label[node.id()] = node._private.data.label;
      }

      if (param.firstTime) {
        nodes.data('label', param.label);
      }
      else {
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          node._private.data.label = param.label[node.id()];
        }
      }

      return result;
    };

    undoRedoActionFunctions.changeData = function (param) {
      var result = {
      };
      var eles = param.eles;
      result.name = param.name;
      result.valueMap = {};
      result.eles = eles;

      for (var i = 0; i < eles.length; i++) {
        var ele = eles[i];
        result.valueMap[ele.id()] = ele.data(param.name);
      }

      elementUtilities.changeData(param.eles, param.name, param.valueMap);

      return result;
    };

    undoRedoActionFunctions.changeCss = function (param) {
      var result = {
      };
      var eles = param.eles;
      result.name = param.name;
      result.valueMap = {};
      result.eles = eles;

      for (var i = 0; i < eles.length; i++) {
        var ele = eles[i];
        result.valueMap[ele.id()] = ele.css(param.name);
      }

      elementUtilities.changeCss(param.eles, param.name, param.valueMap);

      return result;
    };

    undoRedoActionFunctions.changeFontProperties = function (param) {
      var result = {
      };

      var eles = param.eles;
      result.data = {};
      result.eles = eles;

      for (var i = 0; i < eles.length; i++) {
        var ele = eles[i];

        result.data[ele.id()] = {};

        var data = param.firstTime ? param.data : param.data[ele.id()];

        for (var prop in data) {
          result.data[ele.id()][prop] = ele.data(prop);
        }
      }

      if (param.firstTime) {
        elementUtilities.changeFontProperties(eles, data);
      }
      else {
        for (var i = 0; i < eles.length; i++) {
          var ele = eles[i];

          elementUtilities.changeFontProperties(ele, data);
        }
      }

      return result;
    };

    /*
     * Show eles and perform layout.
     */
    undoRedoActionFunctions.showAndPerformLayout = function (param) {
      var eles = param.eles;

      var result = {};
      result.positions = undoRedoActionFunctions.getNodePositions();

      if (param.firstTime) {
        result.eles = elementUtilities.showAndPerformLayout(param.eles, param.layoutparam);
      }
      else {
        result.eles = cy.viewUtilities().show(eles); // Show given eles
        undoRedoActionFunctions.returnToPositions(param.positions);
      }

      return result;
    };

    undoRedoActionFunctions.undoShowAndPerformLayout = function (param) {
      var eles = param.eles;

      var result = {};
      result.positions = undoRedoActionFunctions.getNodePositions();
      result.eles = cy.viewUtilities().hide(eles); // Hide previously unhidden eles;

      undoRedoActionFunctions.returnToPositions(param.positions);

      return result;
    };

    /*
     * Hide eles and perform layout.
     */
    undoRedoActionFunctions.hideAndPerformLayout = function (param) {
        var eles = param.eles;

        var result = {};
        result.positions = undoRedoActionFunctions.getNodePositions();

        if (param.firstTime) {
            result.eles = elementUtilities.hideAndPerformLayout(param.eles, param.layoutparam);
        }
        else {
            result.eles = cy.viewUtilities().hide(eles); // Hide given eles
            undoRedoActionFunctions.returnToPositions(param.positions);
        }

        return result;
    };

    undoRedoActionFunctions.undoHideAndPerformLayout = function (param) {
        var eles = param.eles;

        var result = {};
        result.positions = undoRedoActionFunctions.getNodePositions();
        result.eles = cy.viewUtilities().show(eles); // Show previously hidden eles

        undoRedoActionFunctions.returnToPositions(param.positions);

        return result;
    };

    // Section End
    // general action functions

    // Section Start
    // sbgn action functions

    undoRedoActionFunctions.changeStateOrInfoBox = function (param) {
      var result = {
      };
      result.type = param.type;
      result.nodes = param.nodes;
      result.index = param.index;

      result.value = elementUtilities.changeStateOrInfoBox(param.nodes, param.index, param.value, param.type);

      cy.forceRender();

      return result;
    };

    undoRedoActionFunctions.addStateOrInfoBox = function (param) {
      var obj = param.obj;
      var nodes = param.nodes;

      var locationObj = elementUtilities.addStateOrInfoBox(nodes, obj);

      cy.forceRender();

      var result = {
        nodes: nodes,
        locationObj: locationObj,
        obj: obj
      };
      return result;
    };

    undoRedoActionFunctions.removeStateOrInfoBox = function (param) {
      var locationObj = param.locationObj;
      var nodes = param.nodes;

      var obj = elementUtilities.removeStateOrInfoBox(nodes, locationObj);

      cy.forceRender();

      var result = {
        nodes: nodes,
        obj: obj
      };
      return result;
    };

    undoRedoActionFunctions.setMultimerStatus = function (param) {
      var firstTime = param.firstTime;
      var nodes = param.nodes;
      var status = param.status;
      var resultStatus = {};

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var isMultimer = node.data('class').endsWith(' multimer');

        resultStatus[node.id()] = isMultimer;
      }

      // If this is the first time change the status of all nodes at once.
      // If not change status of each seperately to the values mapped to their id.
      if (firstTime) {
        elementUtilities.setMultimerStatus(nodes, status);
      }
      else {
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          elementUtilities.setMultimerStatus(node, status[node.id()]);
        }
      }

    //  if (!firstTime && _.isEqual(nodes, cy.nodes(':selected'))) {
    //    $('#inspector-is-multimer').attr("checked", !$('#inspector-is-multimer').attr("checked"));
    //  }

      var result = {
        status: resultStatus,
        nodes: nodes
      };

      return result;
    };

    undoRedoActionFunctions.setCloneMarkerStatus = function (param) {
      var nodes = param.nodes;
      var status = param.status;
      var firstTime = param.firstTime;
      var resultStatus = {};

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        resultStatus[node.id()] = node.data('clonemarker');
        var currentStatus = firstTime ? status : status[node.id()];
        elementUtilities.setCloneMarkerStatus(node, currentStatus);
      }

    //  if (!firstTime && _.isEqual(nodes, cy.nodes(':selected'))) {
    //    $('#inspector-is-clone-marker').attr("checked", !$('#inspector-is-clone-marker').attr("checked"));
    //  }

      var result = {
        status: resultStatus,
        nodes: nodes
      };

      return result;
    };

    // param: {class: sbgnclass, name: propertyName, value: value}
    undoRedoActionFunctions.setDefaultProperty = function (param) {
      var sbgnclass = param.class;
      var name = param.name;
      var value = param.value;
      var classDefaults = elementUtilities.defaultProperties[sbgnclass];
      var result = {
        class: sbgnclass,
        name: name,
        value: classDefaults.hasOwnProperty(name) ? classDefaults[name] : undefined
      };

      classDefaults[name] = value;

      return result;
    };

    // Section End
    // sbgn action functions
  }


  return undoRedoActionFunctionsExtender;
};

},{"./lib-utilities":4}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvZWxlbWVudC11dGlsaXRpZXMtZXh0ZW5kZXItZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvbGliLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvbWFpbi11dGlsaXRpZXMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy1mYWN0b3J5LmpzIiwic3JjL3V0aWxpdGllcy9yZWdpc3Rlci11bmRvLXJlZG8tYWN0aW9ucy1mYWN0b3J5LmpzIiwic3JjL3V0aWxpdGllcy9zYmdudml6LWluc3RhbmNlLXV0aWxpdGllcy1mYWN0b3J5LmpzIiwic3JjL3V0aWxpdGllcy91ci1hY3Rpb24tZnVuY3Rpb25zLWV4dGVuZGVyLWZhY3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcHZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMTZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCl7XG4gIHZhciBjaGlzZSA9IGZ1bmN0aW9uKF9vcHRpb25zKSB7XG5cbiAgICB2YXIgcGFyYW0gPSB7fTtcblxuICAgIC8vIEFjY2VzcyB0aGUgbGlic1xuICAgIHZhciBsaWJzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcblxuICAgIHZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9vcHRpb24tdXRpbGl0aWVzLWZhY3RvcnknKSgpO1xuICAgIHZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMoX29wdGlvbnMpOyAvLyBFeHRlbmRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9uc1xuXG4gICAgLy8gQ3JlYXRlIGFuIHNiZ252aXogaW5zdGFuY2VcbiAgICB2YXIgc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvc2JnbnZpei1pbnN0YW5jZS11dGlsaXRpZXMtZmFjdG9yeScpKCk7XG4gICAgdmFyIHNiZ252aXpJbnN0YW5jZSA9IHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcyhvcHRpb25zKTtcblxuICAgIC8vIFVwZGF0ZSBzdHlsZSBhbmQgYmluZCBldmVudHNcbiAgICB2YXIgY3lTdHlsZUFuZEV2ZW50cyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMtZmFjdG9yeScpKCk7XG5cbiAgICAvLyBSZWdpc3RlciB1bmRvL3JlZG8gYWN0aW9uc1xuICAgIHZhciByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3JlZ2lzdGVyLXVuZG8tcmVkby1hY3Rpb25zLWZhY3RvcnknKSgpO1xuXG4gICAgdmFyIG1haW5VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy1mYWN0b3J5JykoKTtcbiAgICB2YXIgZWxlbWVudFV0aWxpdGllc0V4dGVuZGVyID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZWxlbWVudC11dGlsaXRpZXMtZXh0ZW5kZXItZmFjdG9yeScpKCk7XG4gICAgdmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zRXh0ZW5kZXIgPSByZXF1aXJlKCcuL3V0aWxpdGllcy91ci1hY3Rpb24tZnVuY3Rpb25zLWV4dGVuZGVyLWZhY3RvcnknKSgpO1xuXG4gICAgdmFyIGVsZW1lbnRVdGlsaXRpZXMgPSAgc2JnbnZpekluc3RhbmNlLmVsZW1lbnRVdGlsaXRpZXM7XG4gICAgdmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gc2JnbnZpekluc3RhbmNlLnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xuXG4gICAgcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzID0gc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzO1xuICAgIHBhcmFtLm9wdGlvblV0aWxpdGllcyA9IG9wdGlvblV0aWxpdGllcztcbiAgICBwYXJhbS5lbGVtZW50VXRpbGl0aWVzID0gZWxlbWVudFV0aWxpdGllcztcbiAgICBwYXJhbS51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnNFeHRlbmRlcihwYXJhbSk7XG4gICAgZWxlbWVudFV0aWxpdGllc0V4dGVuZGVyKHBhcmFtKTtcbiAgICBjeVN0eWxlQW5kRXZlbnRzKHBhcmFtKTtcbiAgICByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyhwYXJhbSk7XG4gICAgbWFpblV0aWxpdGllcyhwYXJhbSk7XG5cbiAgICAvLyBFeHBvc2UgdGhlIGFwaVxuICAgIHZhciBhcGkgPSB7fTtcblxuICAgIC8vIEV4cG9zZSB0aGUgcHJvcGVydGllcyBpbmhlcml0ZWQgZnJvbSBzYmdudml6XG4gICAgLy8gdGhlbiBvdmVycmlkZSBzb21lIG9mIHRoZXNlIHByb3BlcnRpZXMgYW5kIGV4cG9zZSBzb21lIG5ldyBwcm9wZXJ0aWVzXG4gICAgZm9yICh2YXIgcHJvcCBpbiBzYmdudml6SW5zdGFuY2UpIHtcbiAgICAgIGFwaVtwcm9wXSA9IHNiZ252aXpJbnN0YW5jZVtwcm9wXTtcbiAgICB9XG5cbiAgICAvLyBFeHBvc2UgZWFjaCBtYWluIHV0aWxpdHkgc2VwZXJhdGVseVxuICAgIGZvciAodmFyIHByb3AgaW4gbWFpblV0aWxpdGllcykge1xuICAgICAgYXBpW3Byb3BdID0gbWFpblV0aWxpdGllc1twcm9wXTtcbiAgICB9XG5cbiAgICAvLyBFeHBvc2UgZ2V0U2JnbnZpekluc3RhbmNlKClcbiAgICBhcGkuZ2V0U2JnbnZpekluc3RhbmNlID0gc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEluc3RhbmNlO1xuXG4gICAgLy8gRXhwb3NlIGVsZW1lbnRVdGlsaXRpZXMgYW5kIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zIGFzIGlzXG4gICAgYXBpLmVsZW1lbnRVdGlsaXRpZXMgPSBlbGVtZW50VXRpbGl0aWVzO1xuICAgIGFwaS51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xuXG4gICAgcmV0dXJuIGFwaTtcbiAgfTtcblxuICAvLyBSZWdpc3RlciBjaGlzZSB3aXRoIGdpdmVuIGxpYnJhcmllc1xuICBjaGlzZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChfbGlicykge1xuXG4gICAgdmFyIGxpYnMgPSB7fTtcbiAgICBsaWJzLmpRdWVyeSA9IF9saWJzLmpRdWVyeSB8fCBqUXVlcnk7XG4gICAgbGlicy5jeXRvc2NhcGUgPSBfbGlicy5jeXRvc2NhcGUgfHwgY3l0b3NjYXBlO1xuICAgIGxpYnMuc2JnbnZpeiA9IF9saWJzLnNiZ252aXogfHwgc2JnbnZpejtcbiAgICBsaWJzLnNhdmVBcyA9IF9saWJzLmZpbGVzYXZlcmpzID8gX2xpYnMuZmlsZXNhdmVyanMuc2F2ZUFzIDogc2F2ZUFzO1xuXG4gICAgbGlicy5zYmdudml6LnJlZ2lzdGVyKF9saWJzKTsgLy8gUmVnaXN0ZXIgc2JnbnZpeiB3aXRoIHRoZSBnaXZlbiBsaWJzXG5cbiAgICAvLyBTZXQgdGhlIGxpYnJhcmllcyB0byBhY2Nlc3MgdGhlbSBmcm9tIGFueSBmaWxlXG4gICAgdmFyIGxpYlV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKTtcbiAgICBsaWJVdGlsaXRpZXMuc2V0TGlicyhsaWJzKTtcbiAgfTtcblxuICBpZiAoIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gY2hpc2U7XG4gIH1cbn0pKCk7XG4iLCJ2YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciAkID0gbGlicy5qUXVlcnk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBvcHRpb25zLCBlbGVtZW50VXRpbGl0aWVzLCBjeTtcblxuICBmdW5jdGlvbiBjeVN0eWxlQW5kRXZlbnRzIChwYXJhbSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMgPSBwYXJhbS5lbGVtZW50VXRpbGl0aWVzO1xuICAgIG9wdGlvbnMgPSBwYXJhbS5vcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xuICAgIGN5ID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5KCk7XG5cbiAgICAvL0hlbHBlcnNcbiAgICB2YXIgaW5pdEVsZW1lbnREYXRhID0gZnVuY3Rpb24gKGVsZSkge1xuICAgICAgdmFyIGVsZWNsYXNzID0gZWxlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICBpZiAoIWVsZWNsYXNzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGVsZWNsYXNzID0gZWxlbWVudFV0aWxpdGllcy5kZW11bHRpbWVyaXplQ2xhc3MoZWxlY2xhc3MpO1xuICAgICAgdmFyIGNsYXNzUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbZWxlY2xhc3NdO1xuXG4gICAgICBjeS5iYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChlbGUuaXNOb2RlKCkpIHtcbiAgICAgICAgICBpZiAoY2xhc3NQcm9wZXJ0aWVzWyd3aWR0aCddICYmICFlbGUuZGF0YSgnYmJveCcpLncpIHtcbiAgICAgICAgICAgIGVsZS5kYXRhKCdiYm94JykudyA9IGNsYXNzUHJvcGVydGllc1snd2lkdGgnXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNsYXNzUHJvcGVydGllc1snaGVpZ2h0J10gJiYgIWVsZS5kYXRhKCdiYm94JykuaCkge1xuICAgICAgICAgICAgZWxlLmRhdGEoJ2Jib3gnKS5oID0gY2xhc3NQcm9wZXJ0aWVzWydoZWlnaHQnXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC1zaXplJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydmb250LXNpemUnXSkge1xuICAgICAgICAgICAgZWxlLmRhdGEoJ2ZvbnQtc2l6ZScsIGNsYXNzUHJvcGVydGllc1snZm9udC1zaXplJ10pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWVsZS5kYXRhKCdmb250LWZhbWlseScpICYmIGNsYXNzUHJvcGVydGllc1snZm9udC1mYW1pbHknXSkge1xuICAgICAgICAgICAgZWxlLmRhdGEoJ2ZvbnQtZmFtaWx5JywgY2xhc3NQcm9wZXJ0aWVzWydmb250LWZhbWlseSddKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC1zdHlsZScpICYmIGNsYXNzUHJvcGVydGllc1snZm9udC1zdHlsZSddKSB7XG4gICAgICAgICAgICBlbGUuZGF0YSgnZm9udC1zdHlsZScsIGNsYXNzUHJvcGVydGllc1snZm9udC1zdHlsZSddKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC13ZWlnaHQnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtd2VpZ2h0J10pIHtcbiAgICAgICAgICAgIGVsZS5kYXRhKCdmb250LXdlaWdodCcsIGNsYXNzUHJvcGVydGllc1snZm9udC13ZWlnaHQnXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghZWxlLmRhdGEoJ2JhY2tncm91bmQtY29sb3InKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2JhY2tncm91bmQtY29sb3InXSkge1xuICAgICAgICAgICAgZWxlLmRhdGEoJ2JhY2tncm91bmQtY29sb3InLCBjbGFzc1Byb3BlcnRpZXNbJ2JhY2tncm91bmQtY29sb3InXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghZWxlLmRhdGEoJ2JhY2tncm91bmQtb3BhY2l0eScpICYmIGNsYXNzUHJvcGVydGllc1snYmFja2dyb3VuZC1vcGFjaXR5J10pIHtcbiAgICAgICAgICAgIGVsZS5kYXRhKCdiYWNrZ3JvdW5kLW9wYWNpdHknLCBjbGFzc1Byb3BlcnRpZXNbJ2JhY2tncm91bmQtb3BhY2l0eSddKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFlbGUuZGF0YSgnYm9yZGVyLWNvbG9yJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydib3JkZXItY29sb3InXSkge1xuICAgICAgICAgICAgZWxlLmRhdGEoJ2JvcmRlci1jb2xvcicsIGNsYXNzUHJvcGVydGllc1snYm9yZGVyLWNvbG9yJ10pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWVsZS5kYXRhKCdib3JkZXItd2lkdGgnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2JvcmRlci13aWR0aCddKSB7XG4gICAgICAgICAgICBlbGUuZGF0YSgnYm9yZGVyLXdpZHRoJywgY2xhc3NQcm9wZXJ0aWVzWydib3JkZXItd2lkdGgnXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghZWxlLmRhdGEoJ3RleHQtd3JhcCcpICYmIGNsYXNzUHJvcGVydGllc1sndGV4dC13cmFwJ10pIHtcbiAgICAgICAgICAgIGVsZS5kYXRhKCd0ZXh0LXdyYXAnLCBjbGFzc1Byb3BlcnRpZXNbJ3RleHQtd3JhcCddKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChlbGUuaXNFZGdlKCkpIHtcbiAgICAgICAgICBpZiAoIWVsZS5kYXRhKCd3aWR0aCcpICYmIGNsYXNzUHJvcGVydGllc1snd2lkdGgnXSkge1xuICAgICAgICAgICAgZWxlLmRhdGEoJ3dpZHRoJywgY2xhc3NQcm9wZXJ0aWVzWyd3aWR0aCddKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFlbGUuZGF0YSgnbGluZS1jb2xvcicpICYmIGNsYXNzUHJvcGVydGllc1snbGluZS1jb2xvciddKSB7XG4gICAgICAgICAgICBlbGUuZGF0YSgnbGluZS1jb2xvcicsIGNsYXNzUHJvcGVydGllc1snbGluZS1jb2xvciddKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBVcGRhdGUgY3kgc3R5bGVzaGVldFxuICAgIHZhciB1cGRhdGVTdHlsZVNoZWV0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBjeS5zdHlsZSgpXG4gICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250LXNpemVdXCIpXG4gICAgICAuc3R5bGUoe1xuICAgICAgICAnZm9udC1zaXplJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgIC8vIElmIG5vZGUgbGFiZWxzIGFyZSBleHBlY3RlZCB0byBiZSBhZGp1c3RlZCBhdXRvbWF0aWNhbGx5IG9yIGVsZW1lbnQgY2Fubm90IGhhdmUgbGFiZWxcbiAgICAgICAgICAvLyByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRMYWJlbFRleHRTaXplKCkgZWxzZSByZXR1cm4gZWxlLmRhdGEoJ2ZvbnQtc2l6ZScpXG4gICAgICAgICAgdmFyIG9wdCA9IG9wdGlvbnMuYWRqdXN0Tm9kZUxhYmVsRm9udFNpemVBdXRvbWF0aWNhbGx5O1xuICAgICAgICAgIHZhciBhZGp1c3QgPSB0eXBlb2Ygb3B0ID09PSAnZnVuY3Rpb24nID8gb3B0KCkgOiBvcHQ7XG5cbiAgICAgICAgICBpZiAoIWFkanVzdCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250LXNpemUnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRMYWJlbFRleHRTaXplKGVsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250LWZhbWlseV1cIilcbiAgICAgIC5zdHlsZSh7XG4gICAgICAgICdmb250LWZhbWlseSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2ZvbnQtZmFtaWx5Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250LXN0eWxlXVwiKVxuICAgICAgLnN0eWxlKHtcbiAgICAgICAgJ2ZvbnQtc3R5bGUnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250LXN0eWxlJyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250LXdlaWdodF1cIilcbiAgICAgIC5zdHlsZSh7XG4gICAgICAgICdmb250LXdlaWdodCc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2ZvbnQtd2VpZ2h0Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtiYWNrZ3JvdW5kLWNvbG9yXVwiKVxuICAgICAgLnN0eWxlKHtcbiAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdiYWNrZ3JvdW5kLWNvbG9yJyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtiYWNrZ3JvdW5kLW9wYWNpdHldXCIpXG4gICAgICAuc3R5bGUoe1xuICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgIHJldHVybiBlbGUuZGF0YSgnYmFja2dyb3VuZC1vcGFjaXR5Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtib3JkZXItd2lkdGhdXCIpXG4gICAgICAuc3R5bGUoe1xuICAgICAgICAnYm9yZGVyLXdpZHRoJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgIHJldHVybiBlbGUuZGF0YSgnYm9yZGVyLXdpZHRoJyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtib3JkZXItY29sb3JdXCIpXG4gICAgICAuc3R5bGUoe1xuICAgICAgICAnYm9yZGVyLWNvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgIHJldHVybiBlbGUuZGF0YSgnYm9yZGVyLWNvbG9yJyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVt0ZXh0LXdyYXBdXCIpXG4gICAgICAuc3R5bGUoe1xuICAgICAgICAndGV4dC13cmFwJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAgIHJldHVybiBlbGUuZGF0YSgndGV4dC13cmFwJyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzXVtsaW5lLWNvbG9yXVwiKVxuICAgICAgLnN0eWxlKHtcbiAgICAgICAgJ2xpbmUtY29sb3InOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdsaW5lLWNvbG9yJyk7XG4gICAgICAgIH0sXG4gICAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2xpbmUtY29sb3InKTtcbiAgICAgICAgfSxcbiAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6IGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICAgIHJldHVybiBlbGUuZGF0YSgnbGluZS1jb2xvcicpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzc11bd2lkdGhdXCIpXG4gICAgICAuc3R5bGUoe1xuICAgICAgICAnd2lkdGgnOiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ3dpZHRoJyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc2VsZWN0b3IoXCJlZGdlLmN5LWV4cGFuZC1jb2xsYXBzZS1tZXRhLWVkZ2VcIilcbiAgICAgIC5jc3Moe1xuICAgICAgICAnbGluZS1jb2xvcic6ICcjQzRDNEM0JyxcbiAgICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjQzRDNEM0JyxcbiAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjQzRDNEM0J1xuICAgICAgfSlcbiAgICAgIC5zZWxlY3RvcihcIm5vZGU6c2VsZWN0ZWRcIilcbiAgICAgIC5zdHlsZSh7XG4gICAgICAgICdib3JkZXItY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAgICd0ZXh0LW91dGxpbmUtY29sb3InOiAnIzAwMCdcbiAgICAgIH0pXG4gICAgICAuc2VsZWN0b3IoXCJlZGdlOnNlbGVjdGVkXCIpXG4gICAgICAuc3R5bGUoe1xuICAgICAgICAnbGluZS1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjZDY3NjE0J1xuICAgICAgfSkudXBkYXRlKCk7XG4gICAgfTtcblxuICAgIC8vIEJpbmQgZXZlbnRzXG4gICAgdmFyIGJpbmRDeUV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgY3kub24oXCJhZGRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBlbGUgPSBldmVudC5jeVRhcmdldCB8fCBldmVudC50YXJnZXQ7XG4gICAgICAgIGluaXRFbGVtZW50RGF0YShlbGUpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyBIZWxwZXJzIEVuZFxuXG4gICAgLy8gT25jZSBjeSBpcyByZWFkeSBiaW5kIGV2ZW50cyBhbmQgdXBkYXRlIHN0eWxlIHNoZWV0XG4gICAgY3kucmVhZHkoIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBiaW5kQ3lFdmVudHMoKTtcbiAgICAgIHVwZGF0ZVN0eWxlU2hlZXQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBjeVN0eWxlQW5kRXZlbnRzO1xufTtcbiIsIi8vIEV4dGVuZHMgc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3B0aW9ucywgc2JnbnZpekluc3RhbmNlLCBlbGVtZW50VXRpbGl0aWVzLCBjeTtcblxuICBmdW5jdGlvbiBlbGVtZW50VXRpbGl0aWVzRXh0ZW5kZXIgKHBhcmFtKSB7XG4gICAgc2JnbnZpekluc3RhbmNlID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEluc3RhbmNlKCk7XG4gICAgb3B0aW9ucyA9IHBhcmFtLm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XG4gICAgZWxlbWVudFV0aWxpdGllcyA9IHNiZ252aXpJbnN0YW5jZS5lbGVtZW50VXRpbGl0aWVzO1xuICAgIGN5ID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5KCk7XG5cbiAgICBleHRlbmQoKTtcblxuICAgIC8vIFJldHVybiB0aGUgZXh0ZW5kZWQgZWxlbWVudFV0aWxpdGllc1xuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzO1xuICB9XG5cbiAgLy8gRXh0ZW5kcyBlbGVtZW50VXRpbGl0aWVzIHdpdGggY2hpc2Ugc3BlY2lmaWMgZmFjaWxpdGllc1xuICBmdW5jdGlvbiBleHRlbmQgKCkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZSA9IHVuZGVmaW5lZDsgLy8gaW5pdGlhbGl6ZSBtYXAgdHlwZVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5QRCA9IHt9OyAvLyBuYW1lc3BhY2UgZm9yIGFsbCBQRCBzcGVjaWZpYyBzdHVmZlxuICAgIGVsZW1lbnRVdGlsaXRpZXMuQUYgPSB7fTsgLy8gbmFtZXNwYWNlIGZvciBhbGwgQUYgc3BlY2lmaWMgc3R1ZmZcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXMgPSB7XG4gICAgICBcInByb2Nlc3NcIjoge1xuICAgICAgICB3aWR0aDogMTUsXG4gICAgICAgIGhlaWdodDogMTUsXG4gICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICAgICAgfSxcbiAgICAgIFwib21pdHRlZCBwcm9jZXNzXCI6IHtcbiAgICAgICAgd2lkdGg6IDE1LFxuICAgICAgICBoZWlnaHQ6IDE1LFxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAgICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgICAgIH0sXG4gICAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6IHtcbiAgICAgICAgd2lkdGg6IDE1LFxuICAgICAgICBoZWlnaHQ6IDE1LFxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAgICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgICAgIH0sXG4gICAgICBcImFzc29jaWF0aW9uXCI6IHtcbiAgICAgICAgd2lkdGg6IDE1LFxuICAgICAgICBoZWlnaHQ6IDE1LFxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjNzA3MDcwJyxcbiAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAgICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgICAgIH0sXG4gICAgICBcImRpc3NvY2lhdGlvblwiOiB7XG4gICAgICAgIHdpZHRoOiAxNSxcbiAgICAgICAgaGVpZ2h0OiAxNSxcbiAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gICAgICB9LFxuICAgICAgXCJtYWNyb21vbGVjdWxlXCI6IHtcbiAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAnZm9udC1zaXplJzogMTEsXG4gICAgICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gICAgICB9LFxuICAgICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7XG4gICAgICAgIHdpZHRoOiA3MCxcbiAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAgICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAgICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICAgICAgfSxcbiAgICAgIFwic2ltcGxlIGNoZW1pY2FsXCI6IHtcbiAgICAgICAgd2lkdGg6IDM1LFxuICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAnZm9udC1zaXplJzogMTEsXG4gICAgICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gICAgICB9LFxuICAgICAgXCJzb3VyY2UgYW5kIHNpbmtcIjoge1xuICAgICAgICB3aWR0aDogMjUsXG4gICAgICAgIGhlaWdodDogMjUsXG4gICAgICAgICdmb250LXNpemUnOiAxMSxcbiAgICAgICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAgICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgICAgIH0sXG4gICAgICBcInRhZ1wiOiB7XG4gICAgICAgIHdpZHRoOiAzNSxcbiAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAgICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAgICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICAgICAgfSxcbiAgICAgIFwicGhlbm90eXBlXCI6IHtcbiAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAnZm9udC1zaXplJzogMTEsXG4gICAgICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gICAgICB9LFxuICAgICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjoge1xuICAgICAgICB3aWR0aDogNzAsXG4gICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICdmb250LXNpemUnOiAxMSxcbiAgICAgICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAgICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgICAgIH0sXG4gICAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjoge1xuICAgICAgICB3aWR0aDogNzAsXG4gICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICdmb250LXNpemUnOiAxMSxcbiAgICAgICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAgICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgICAgIH0sXG4gICAgICBcImNvbXBsZXhcIjoge1xuICAgICAgICB3aWR0aDogNTAsXG4gICAgICAgIGhlaWdodDogNTAsXG4gICAgICAgICdmb250LXNpemUnOiAxMSxcbiAgICAgICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAgICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgICAgIH0sXG4gICAgICBcImNvbXBhcnRtZW50XCI6IHtcbiAgICAgICAgd2lkdGg6IDgwLFxuICAgICAgICBoZWlnaHQ6IDgwLFxuICAgICAgICAnZm9udC1zaXplJzogMTQsXG4gICAgICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgICAgICdib3JkZXItd2lkdGgnOiAzLjI1LFxuICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gICAgICB9LFxuICAgICAgXCJhbmRcIjoge1xuICAgICAgICB3aWR0aDogMjUsXG4gICAgICAgIGhlaWdodDogMjUsXG4gICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICAgICAgfSxcbiAgICAgIFwib3JcIjoge1xuICAgICAgICB3aWR0aDogMjUsXG4gICAgICAgIGhlaWdodDogMjUsXG4gICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICAgICAgfSxcbiAgICAgIFwibm90XCI6IHtcbiAgICAgICAgd2lkdGg6IDI1LFxuICAgICAgICBoZWlnaHQ6IDI1LFxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAgICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgICAgIH0sXG4gICAgICBcImNvbnN1bXB0aW9uXCI6IHtcbiAgICAgICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgICAgICd3aWR0aCc6IDEuMjVcbiAgICAgIH0sXG4gICAgICBcInByb2R1Y3Rpb25cIjoge1xuICAgICAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAgICAgJ3dpZHRoJzogMS4yNVxuICAgICAgfSxcbiAgICAgIFwibW9kdWxhdGlvblwiOiB7XG4gICAgICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAnd2lkdGgnOiAxLjI1XG4gICAgICB9LFxuICAgICAgXCJzdGltdWxhdGlvblwiOiB7XG4gICAgICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAnd2lkdGgnOiAxLjI1XG4gICAgICB9LFxuICAgICAgXCJjYXRhbHlzaXNcIjoge1xuICAgICAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAgICAgJ3dpZHRoJzogMS4yNVxuICAgICAgfSxcbiAgICAgIFwiaW5oaWJpdGlvblwiOiB7XG4gICAgICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAnd2lkdGgnOiAxLjI1XG4gICAgICB9LFxuICAgICAgXCJuZWNlc3Nhcnkgc3RpbXVsYXRpb25cIjoge1xuICAgICAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAgICAgJ3dpZHRoJzogMS4yNVxuICAgICAgfSxcbiAgICAgIFwibG9naWMgYXJjXCI6IHtcbiAgICAgICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgICAgICd3aWR0aCc6IDEuMjVcbiAgICAgIH0sXG4gICAgICBcImVxdWl2YWxlbmNlIGFyY1wiOiB7XG4gICAgICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAnd2lkdGgnOiAxLjI1XG4gICAgICB9LFxuICAgICAgXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI6IHtcbiAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAnZm9udC1zaXplJzogMTEsXG4gICAgICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gICAgICB9LFxuICAgICAgXCJCQSBwbGFpblwiOiB7XG4gICAgICAgIHdpZHRoOiA3MCxcbiAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAgICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAgICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICAgICAgfSxcbiAgICAgIFwiQkEgdW5zcGVjaWZpZWQgZW50aXR5XCI6IHtcbiAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAnZm9udC1zaXplJzogMTEsXG4gICAgICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gICAgICB9LFxuICAgICAgXCJCQSBzaW1wbGUgY2hlbWljYWxcIjoge1xuICAgICAgICB3aWR0aDogNzAsXG4gICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICdmb250LXNpemUnOiAxMSxcbiAgICAgICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAgICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgICAgIH0sXG4gICAgICBcIkJBIG1hY3JvbW9sZWN1bGVcIjoge1xuICAgICAgICB3aWR0aDogNzAsXG4gICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICdmb250LXNpemUnOiAxMSxcbiAgICAgICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAgICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgICAgIH0sXG4gICAgICBcIkJBIG51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHtcbiAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAnZm9udC1zaXplJzogMTEsXG4gICAgICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gICAgICB9LFxuICAgICAgXCJCQSBwZXJ0dXJiaW5nIGFnZW50XCI6IHtcbiAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAnZm9udC1zaXplJzogMTEsXG4gICAgICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gICAgICB9LFxuICAgICAgXCJCQSBjb21wbGV4XCI6IHtcbiAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAnZm9udC1zaXplJzogMTEsXG4gICAgICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gICAgICB9LFxuICAgICAgXCJkZWxheVwiOiB7XG4gICAgICAgIHdpZHRoOiAyNSxcbiAgICAgICAgaGVpZ2h0OiAyNSxcbiAgICAgICAgJ2ZvbnQtZmFtaWx5JzogJ0NhbWJyaWEnLFxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAgICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgICAgIH0sXG4gICAgICBcInVua25vd24gaW5mbHVlbmNlXCI6IHtcbiAgICAgICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgICAgICd3aWR0aCc6IDEuMjVcbiAgICAgIH0sXG4gICAgICBcInBvc2l0aXZlIGluZmx1ZW5jZVwiOiB7XG4gICAgICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAnd2lkdGgnOiAxLjI1XG4gICAgICB9LFxuICAgICAgXCJuZWdhdGl2ZSBpbmZsdWVuY2VcIjoge1xuICAgICAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAgICAgJ3dpZHRoJzogMS4yNVxuICAgICAgfSxcbiAgICAgIFwic3VibWFwXCI6IHtcbiAgICAgICAgd2lkdGg6IDgwLFxuICAgICAgICBoZWlnaHQ6IDgwLFxuICAgICAgICAnZm9udC1zaXplJzogMTQsXG4gICAgICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgICAgICdib3JkZXItd2lkdGgnOiAyLjI1LFxuICAgICAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICAgICAndGV4dC13cmFwJzogJ3dyYXAnLFxuICAgICAgfSxcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAgc2VlIGh0dHA6Ly9qb3VybmFsLmltYmlvLmRlL2FydGljbGVzL3BkZi9qaWItMjYzLnBkZiBwLjQxIDwtLSBidXQgYmV3YXJlLCBvdXRkYXRlZFxuICAgICAgZm9sbG93aW5nIHRhYmxlcyBoYXZlIGJlZW4gdXBkYXRlZCB3aXRoIFBEIGx2bDEgdjIuMCBvZiBOb3ZlbWJlciA3LCAyMDE2IHdvcmtpbmcgZHJhZnRcbiAgICAgIG9ubHkgdGhlIGZvbGxvd2luZyB0aGluZ3MgaGF2ZSBiZWVuIGNoYW5nZWQgZnJvbSAyLjAgKHRoaXMgdmVyc2lvbiBpcyBub3QgY2xlYXIgb24gY29ubmVjdGl2aXR5KTpcbiAgICAgICAtIGVtcHR5IHNldCBoYXMgbm8gbGltaXQgb24gaXRzIGVkZ2UgY291bnRcbiAgICAgICAtIGxvZ2ljIG9wZXJhdG9ycyBjYW4gYmUgc291cmNlIGFuZCB0YXJnZXRcbiAgICAgICAtIGxpbWl0IG9mIDEgY2F0YWx5c2lzIGFuZCAxIG5lY2Vzc2FyeSBzdGltdWxhdGlvbiBvbiBhIHByb2Nlc3NcblxuICAgICAgZm9yIGVhY2ggZWRnZSBjbGFzcyBhbmQgbm9kZWNsYXNzIGRlZmluZSAyIGNhc2VzOlxuICAgICAgIC0gbm9kZSBjYW4gYmUgYSBzb3VyY2Ugb2YgdGhpcyBlZGdlIC0+IGFzU291cmNlXG4gICAgICAgLSBub2RlIGNhbiBiZSBhIHRhcmdldCBvZiB0aGlzIGVkZ2UgLT4gYXNUYXJnZXRcbiAgICAgIGZvciBib3RoIGNhc2VzLCB0ZWxscyBpZiBpdCBpcyBhbGxvd2VkIGFuZCB3aGF0IGlzIHRoZSBsaW1pdCBvZiBlZGdlcyBhbGxvd2VkLlxuICAgICAgTGltaXRzIGNhbiBjb25jZXJuIG9ubHkgdGhpcyB0eXBlIG9mIGVkZ2UgKG1heEVkZ2UpIG9yIHRoZSB0b3RhbCBudW1iZXIgb2YgZWRnZXMgZm9yIHRoaXMgbm9kZSAobWF4VG90YWwpLlxuICAgICAgQ29uc2lkZXIgdW5kZWZpbmVkIHRoaW5ncyBhcyBmYWxzZS91bmFsbG93ZWQgLT4gd2hpdGVsaXN0IGJlaGF2aW9yLlxuXG4gICAgICB0aGUgbm9kZXMvZWRnZXMgY2xhc3MgbGlzdGVkIGJlbG93IGFyZSB0aG9zZSB1c2VkIGluIHRoZSBwcm9ncmFtLlxuICAgICAgRm9yIGluc3RhbmNlIFwiY29tcGFydG1lbnRcIiBpc24ndCBhIG5vZGUgaW4gU0JHTiBzcGVjcy5cbiAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuUEQuY29ubmVjdGl2aXR5Q29uc3RyYWludHMgPSB7XG4gICAgICBcImNvbnN1bXB0aW9uXCI6IHtcbiAgICAgICAgXCJtYWNyb21vbGVjdWxlXCI6ICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJjb21wbGV4XCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjogICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICAgICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcImFzc29jaWF0aW9uXCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICAgICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX19LFxuICAgICAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319XG4gICAgICB9LFxuICAgICAgXCJwcm9kdWN0aW9uXCI6IHtcbiAgICAgICAgXCJtYWNyb21vbGVjdWxlXCI6ICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgICAgIFwic2ltcGxlIGNoZW1pY2FsXCI6ICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICAgICAgXCJjb21wbGV4XCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgICAgIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjogICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcImFzc29jaWF0aW9uXCI6ICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fVxuICAgICAgfSxcbiAgICAgIFwibW9kdWxhdGlvblwiOiB7XG4gICAgICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICAgICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcImRpc3NvY2lhdGlvblwiOiAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fVxuICAgICAgfSxcbiAgICAgIFwic3RpbXVsYXRpb25cIjoge1xuICAgICAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwic2ltcGxlIGNoZW1pY2FsXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInNvdXJjZSBhbmQgc2lua1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICAgICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcImFzc29jaWF0aW9uXCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX1cbiAgICAgIH0sXG4gICAgICBcImNhdGFseXNpc1wiOiB7XG4gICAgICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjogICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMX19LFxuICAgICAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDF9fSxcbiAgICAgICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxfX0sXG4gICAgICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMX19LFxuICAgICAgICBcImFzc29jaWF0aW9uXCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX1cbiAgICAgIH0sXG4gICAgICBcImluaGliaXRpb25cIjoge1xuICAgICAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwic2ltcGxlIGNoZW1pY2FsXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInNvdXJjZSBhbmQgc2lua1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICAgICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcImFzc29jaWF0aW9uXCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX1cbiAgICAgIH0sXG4gICAgICBcIm5lY2Vzc2FyeSBzdGltdWxhdGlvblwiOiB7XG4gICAgICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxfX0sXG4gICAgICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMX19LFxuICAgICAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDF9fSxcbiAgICAgICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxfX0sXG4gICAgICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcImRpc3NvY2lhdGlvblwiOiAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgIH0sXG4gICAgICBcImxvZ2ljIGFyY1wiOiB7XG4gICAgICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgICAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInByb2Nlc3NcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwidW5jZXJ0YWluIHByb2Nlc3NcIjogICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICAgICAgXCJub3RcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9fSxcbiAgICAgIH0sXG4gICAgICBcImVxdWl2YWxlbmNlIGFyY1wiOiB7XG4gICAgICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcInNvdXJjZSBhbmQgc2lua1wiOiAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcInByb2Nlc3NcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwidW5jZXJ0YWluIHByb2Nlc3NcIjogICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qIEFGIG5vZGUgY29ubmVjdGl2aXR5IHJ1bGVzXG4gICAgICogU2VlOiBTeXN0ZW1zIEJpb2xvZ3kgR3JhcGhpY2FsIE5vdGF0aW9uOiBBY3Rpdml0eSBGbG93IGxhbmd1YWdlIExldmVsIDEsIFZlcnNpb24gMS4yLCBEYXRlOiBKdWx5IDI3LCAyMDE1XG4gICAgICogICBTZWN0aW9uIDMuMy4xOiBBY3Rpdml0eSBOb2RlcyBjb25uZWN0aXZpdHkgZGVmaW5pdGlvblxuICAgICAqICAgVVJMOiBodHRwczovL2RvaS5vcmcvMTAuMjM5MC9iaWVjb2xsLWppYi0yMDE1LTI2NVxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuQUYuY29ubmVjdGl2aXR5Q29uc3RyYWludHMgPSB7XG4gICAgICBcInBvc2l0aXZlIGluZmx1ZW5jZVwiOiB7XG4gICAgICAgIFwiYmlvbG9naWNhbCBhY3Rpdml0eVwiOiAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICAgICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJub3RcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcImRlbGF5XCI6ICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgfSxcbiAgICAgIFwibmVnYXRpdmUgaW5mbHVlbmNlXCI6IHtcbiAgICAgICAgXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI6ICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiZGVsYXlcIjogICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICB9LFxuICAgICAgXCJ1bmtub3duIGluZmx1ZW5jZVwiOiB7XG4gICAgICAgIFwiYmlvbG9naWNhbCBhY3Rpdml0eVwiOiAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICAgICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJub3RcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcImRlbGF5XCI6ICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgfSxcbiAgICAgIFwibmVjZXNzYXJ5IHN0aW11bGF0aW9uXCI6IHtcbiAgICAgICAgXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI6ICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiZGVsYXlcIjogICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICB9LFxuICAgICAgXCJsb2dpYyBhcmNcIjoge1xuICAgICAgICBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjogIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfX0sXG4gICAgICAgIFwiZGVsYXlcIjogICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9fSxcbiAgICAgICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICB9LFxuICAgICAgXCJlcXVpdmFsZW5jZSBhcmNcIjoge1xuICAgICAgICBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjogIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgICAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICAgICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICAgICAgXCJkZWxheVwiOiAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgICAgfSxcbiAgICB9XG4gICAgLy8gaW5pdGlhbGl6ZSBhIGdsb2JhbCB1bml0IG9mIGluZm9ybWF0aW9uIG9iamVjdFxuICAgIHZhciB1b2lfb2JqID0ge307XG4gICAgdW9pX29iai5jbGF6eiA9IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiO1xuICAgIHVvaV9vYmoubGFiZWwgPSB7XG4gICAgICB0ZXh0OiBcIlwiXG4gICAgfTtcblxuICAgIHVvaV9vYmouYmJveCA9IHtcbiAgICAgICB3OiAzMCxcbiAgICAgICBoOiAxMlxuICAgIH07XG5cbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcblxuICAgIC8vIHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84ODA5NDcyXG4gICAgLy8gd2UgbmVlZCB0byB0YWtlIGNhcmUgb2Ygb3VyIG93biBJRHMgYmVjYXVzZSB0aGUgb25lcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBjeXRvc2NhcGUgKGFsc28gVVVJRClcbiAgICAvLyBkb24ndCBjb21wbHkgd2l0aCB4c2Q6U0lEIHR5cGUgdGhhdCBtdXN0IG5vdCBiZWdpbiB3aXRoIGEgbnVtYmVyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVVVUlEICgpIHsgLy8gUHVibGljIERvbWFpbi9NSVRcbiAgICAgICAgdmFyIGQgPSBEYXRlLm5vdygpO1xuICAgICAgICBpZiAodHlwZW9mIHBlcmZvcm1hbmNlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcGVyZm9ybWFuY2Uubm93ID09PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgICAgIGQgKz0gcGVyZm9ybWFuY2Uubm93KCk7IC8vdXNlIGhpZ2gtcHJlY2lzaW9uIHRpbWVyIGlmIGF2YWlsYWJsZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICB2YXIgciA9IChkICsgTWF0aC5yYW5kb20oKSAqIDE2KSAlIDE2IHwgMDtcbiAgICAgICAgICAgIGQgPSBNYXRoLmZsb29yKGQgLyAxNik7XG4gICAgICAgICAgICByZXR1cm4gKGMgPT09ICd4JyA/IHIgOiAociAmIDB4MyB8IDB4OCkpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5hZGROb2RlID0gZnVuY3Rpb24gKHgsIHksIG5vZGVQYXJhbXMsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcbiAgICAgIGlmICh0eXBlb2Ygbm9kZVBhcmFtcyAhPSAnb2JqZWN0Jyl7XG4gICAgICAgIHZhciBzYmduY2xhc3MgPSBub2RlUGFyYW1zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc2JnbmNsYXNzID0gbm9kZVBhcmFtcy5jbGFzcztcbiAgICAgICAgICB2YXIgbGFuZ3VhZ2UgPSBub2RlUGFyYW1zLmxhbmd1YWdlO1xuICAgICAgfVxuICAgICAgdmFyIGRlZmF1bHRQcm9wZXJ0aWVzID0gdGhpcy5kZWZhdWx0UHJvcGVydGllcztcbiAgICAgIHZhciBkZWZhdWx0cyA9IGRlZmF1bHRQcm9wZXJ0aWVzW3NiZ25jbGFzc107XG5cbiAgICAgIHZhciB3aWR0aCA9IGRlZmF1bHRzID8gZGVmYXVsdHMud2lkdGggOiA1MDtcbiAgICAgIHZhciBoZWlnaHQgPSBkZWZhdWx0cyA/IGRlZmF1bHRzLmhlaWdodCA6IDUwO1xuXG4gICAgICB2YXIgY3NzID0ge307XG5cblxuICAgICAgaWYgKHZpc2liaWxpdHkpIHtcbiAgICAgICAgY3NzLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xuICAgICAgfVxuXG4gICAgICBpZiAoZGVmYXVsdHMgJiYgZGVmYXVsdHMubXVsdGltZXIpIHtcbiAgICAgICAgc2JnbmNsYXNzICs9IFwiIG11bHRpbWVyXCI7XG4gICAgICB9XG4gICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgY2xhc3M6IHNiZ25jbGFzcyxcbiAgICBcdGxhbmd1YWdlOiBsYW5ndWFnZSxcbiAgICAgICAgYmJveDoge1xuICAgICAgICAgIGg6IGhlaWdodCxcbiAgICAgICAgICB3OiB3aWR0aCxcbiAgICAgICAgICB4OiB4LFxuICAgICAgICAgIHk6IHlcbiAgICAgICAgfSxcbiAgICAgICAgc3RhdGVzYW5kaW5mb3M6IFtdLFxuICAgICAgICBwb3J0czogW10sXG4gICAgICAgIGNsb25lbWFya2VyOiBkZWZhdWx0cyAmJiBkZWZhdWx0cy5jbG9uZW1hcmtlciA/IGRlZmF1bHRzLmNsb25lbWFya2VyIDogdW5kZWZpbmVkXG4gICAgICB9O1xuXG4gICAgICBpZihpZCkge1xuICAgICAgICBkYXRhLmlkID0gaWQ7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZGF0YS5pZCA9IFwibnd0Tl9cIiArIGdlbmVyYXRlVVVJRCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIGRhdGEucGFyZW50ID0gcGFyZW50O1xuICAgICAgfVxuXG4gICAgICB2YXIgZWxlcyA9IGN5LmFkZCh7XG4gICAgICAgIGdyb3VwOiBcIm5vZGVzXCIsXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGNzczogY3NzLFxuICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgeTogeVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdmFyIG5ld05vZGUgPSBlbGVzW2VsZXMubGVuZ3RoIC0gMV07XG4gICAgICB2YXIgb3JkZXJpbmcgPSB0aGlzLmRlZmF1bHRQcm9wZXJ0aWVzW3NiZ25jbGFzcy5yZXBsYWNlKC9cXHMqbXVsdGltZXIkLywgJycpXVsncG9ydHMtb3JkZXJpbmcnXTsgLy8gR2V0IHRoZSBkZWZhdWx0IHBvcnRzIG9yZGVyaW5nIGZvciB0aGUgbm9kZXMgd2l0aCBnaXZlbiBzYmduY2xhc3NcblxuICAgICAgLy8gSWYgdGhlcmUgaXMgYSBkZWZhdWx0IHBvcnRzIG9yZGVyaW5nIGZvciB0aGUgbm9kZXMgd2l0aCBnaXZlbiBzYmduY2xhc3MgYW5kIGl0IGlzIGRpZmZlcmVudCB0aGFuICdub25lJyBzZXQgdGhlIHBvcnRzIG9yZGVyaW5nIHRvIHRoYXQgb3JkZXJpbmdcbiAgICAgIGlmIChvcmRlcmluZyAmJiBvcmRlcmluZyAhPT0gJ25vbmUnKSB7XG4gICAgICAgIHRoaXMuc2V0UG9ydHNPcmRlcmluZyhuZXdOb2RlLCBvcmRlcmluZyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChsYW5ndWFnZSA9PSBcIkFGXCIgJiYgIWVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZU11bHRpcGxlVW5pdE9mSW5mb3JtYXRpb24obmV3Tm9kZSkpe1xuICAgICAgICBpZiAoc2JnbmNsYXNzICE9IFwiQkEgcGxhaW5cIikgIC8vIGlmIEFGIG5vZGUgY2FuIGhhdmUgbGFiZWwgaS5lOiBub3QgcGxhaW4gYmlvbG9naWNhbCBhY3Rpdml0eVxuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobmV3Tm9kZSwgdW9pX29iaik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXdOb2RlO1xuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UgPSBmdW5jdGlvbiAoc291cmNlLCB0YXJnZXQsIGVkZ2VQYXJhbXMsIGlkLCB2aXNpYmlsaXR5KSB7XG4gICAgICBpZiAodHlwZW9mIGVkZ2VQYXJhbXMgIT0gJ29iamVjdCcpe1xuICAgICAgICB2YXIgc2JnbmNsYXNzID0gZWRnZVBhcmFtcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHNiZ25jbGFzcyA9IGVkZ2VQYXJhbXMuY2xhc3M7XG4gICAgICAgICAgdmFyIGxhbmd1YWdlID0gZWRnZVBhcmFtcy5sYW5ndWFnZTtcbiAgICAgIH1cbiAgICAgIHZhciBkZWZhdWx0UHJvcGVydGllcyA9IHRoaXMuZGVmYXVsdFByb3BlcnRpZXM7XG4gICAgICB2YXIgZGVmYXVsdHMgPSBkZWZhdWx0UHJvcGVydGllc1tzYmduY2xhc3NdO1xuXG4gICAgICB2YXIgY3NzID0ge307XG5cbiAgICAgIGlmICh2aXNpYmlsaXR5KSB7XG4gICAgICAgIGNzcy52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcbiAgICAgIH1cblxuICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgY2xhc3M6IHNiZ25jbGFzcyxcbiAgICAgICAgICBsYW5ndWFnZTogbGFuZ3VhZ2UsXG4gICAgICB9O1xuXG4gICAgICBpZihpZCkge1xuICAgICAgICBkYXRhLmlkID0gaWQ7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZGF0YS5pZCA9IFwibnd0RV9cIiArIGdlbmVyYXRlVVVJRCgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc291cmNlTm9kZSA9IGN5LmdldEVsZW1lbnRCeUlkKHNvdXJjZSk7IC8vIFRoZSBvcmlnaW5hbCBzb3VyY2Ugbm9kZVxuICAgICAgdmFyIHRhcmdldE5vZGUgPSBjeS5nZXRFbGVtZW50QnlJZCh0YXJnZXQpOyAvLyBUaGUgb3JpZ2luYWwgdGFyZ2V0IG5vZGVcbiAgICAgIHZhciBzb3VyY2VIYXNQb3J0cyA9IHNvdXJjZU5vZGUuZGF0YSgncG9ydHMnKS5sZW5ndGggPT09IDI7XG4gICAgICB2YXIgdGFyZ2V0SGFzUG9ydHMgPSB0YXJnZXROb2RlLmRhdGEoJ3BvcnRzJykubGVuZ3RoID09PSAyO1xuICAgICAgLy8gVGhlIHBvcnRzb3VyY2UgYW5kIHBvcnR0YXJnZXQgdmFyaWFibGVzXG4gICAgICB2YXIgcG9ydHNvdXJjZTtcbiAgICAgIHZhciBwb3J0dGFyZ2V0O1xuXG4gICAgICAvKlxuICAgICAgICogR2V0IGlucHV0L291dHB1dCBwb3J0IGlkJ3Mgb2YgYSBub2RlIHdpdGggdGhlIGFzc3VtcHRpb24gdGhhdCB0aGUgbm9kZSBoYXMgdmFsaWQgcG9ydHMuXG4gICAgICAgKi9cbiAgICAgIHZhciBnZXRJT1BvcnRJZHMgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB2YXIgbm9kZUlucHV0UG9ydElkLCBub2RlT3V0cHV0UG9ydElkO1xuICAgICAgICB2YXIgbm9kZVBvcnRzT3JkZXJpbmcgPSBzYmdudml6SW5zdGFuY2UuZWxlbWVudFV0aWxpdGllcy5nZXRQb3J0c09yZGVyaW5nKG5vZGUpO1xuICAgICAgICB2YXIgbm9kZVBvcnRzID0gbm9kZS5kYXRhKCdwb3J0cycpO1xuICAgICAgICBpZiAoIG5vZGVQb3J0c09yZGVyaW5nID09PSAnTC10by1SJyB8fCBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ1ItdG8tTCcgKSB7XG4gICAgICAgICAgdmFyIGxlZnRQb3J0SWQgPSBub2RlUG9ydHNbMF0ueCA8IDAgPyBub2RlUG9ydHNbMF0uaWQgOiBub2RlUG9ydHNbMV0uaWQ7IC8vIFRoZSB4IHZhbHVlIG9mIGxlZnQgcG9ydCBpcyBzdXBwb3NlZCB0byBiZSBuZWdhdGl2ZVxuICAgICAgICAgIHZhciByaWdodFBvcnRJZCA9IG5vZGVQb3J0c1swXS54ID4gMCA/IG5vZGVQb3J0c1swXS5pZCA6IG5vZGVQb3J0c1sxXS5pZDsgLy8gVGhlIHggdmFsdWUgb2YgcmlnaHQgcG9ydCBpcyBzdXBwb3NlZCB0byBiZSBwb3NpdGl2ZVxuICAgICAgICAgIC8qXG4gICAgICAgICAgICogSWYgdGhlIHBvcnQgb3JkZXJpbmcgaXMgbGVmdCB0byByaWdodCB0aGVuIHRoZSBpbnB1dCBwb3J0IGlzIHRoZSBsZWZ0IHBvcnQgYW5kIHRoZSBvdXRwdXQgcG9ydCBpcyB0aGUgcmlnaHQgcG9ydC5cbiAgICAgICAgICAgKiBFbHNlIGlmIGl0IGlzIHJpZ2h0IHRvIGxlZnQgaXQgaXMgdmljZSB2ZXJzYVxuICAgICAgICAgICAqL1xuICAgICAgICAgIG5vZGVJbnB1dFBvcnRJZCA9IG5vZGVQb3J0c09yZGVyaW5nID09PSAnTC10by1SJyA/IGxlZnRQb3J0SWQgOiByaWdodFBvcnRJZDtcbiAgICAgICAgICBub2RlT3V0cHV0UG9ydElkID0gbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdSLXRvLUwnID8gbGVmdFBvcnRJZCA6IHJpZ2h0UG9ydElkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ1QtdG8tQicgfHwgbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdCLXRvLVQnICl7XG4gICAgICAgICAgdmFyIHRvcFBvcnRJZCA9IG5vZGVQb3J0c1swXS55IDwgMCA/IG5vZGVQb3J0c1swXS5pZCA6IG5vZGVQb3J0c1sxXS5pZDsgLy8gVGhlIHkgdmFsdWUgb2YgdG9wIHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgbmVnYXRpdmVcbiAgICAgICAgICB2YXIgYm90dG9tUG9ydElkID0gbm9kZVBvcnRzWzBdLnkgPiAwID8gbm9kZVBvcnRzWzBdLmlkIDogbm9kZVBvcnRzWzFdLmlkOyAvLyBUaGUgeSB2YWx1ZSBvZiBib3R0b20gcG9ydCBpcyBzdXBwb3NlZCB0byBiZSBwb3NpdGl2ZVxuICAgICAgICAgIC8qXG4gICAgICAgICAgICogSWYgdGhlIHBvcnQgb3JkZXJpbmcgaXMgdG9wIHRvIGJvdHRvbSB0aGVuIHRoZSBpbnB1dCBwb3J0IGlzIHRoZSB0b3AgcG9ydCBhbmQgdGhlIG91dHB1dCBwb3J0IGlzIHRoZSBib3R0b20gcG9ydC5cbiAgICAgICAgICAgKiBFbHNlIGlmIGl0IGlzIHJpZ2h0IHRvIGxlZnQgaXQgaXMgdmljZSB2ZXJzYVxuICAgICAgICAgICAqL1xuICAgICAgICAgIG5vZGVJbnB1dFBvcnRJZCA9IG5vZGVQb3J0c09yZGVyaW5nID09PSAnVC10by1CJyA/IHRvcFBvcnRJZCA6IGJvdHRvbVBvcnRJZDtcbiAgICAgICAgICBub2RlT3V0cHV0UG9ydElkID0gbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdCLXRvLVQnID8gdG9wUG9ydElkIDogYm90dG9tUG9ydElkO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBJTyBwb3J0cyBvZiB0aGUgbm9kZVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlucHV0UG9ydElkOiBub2RlSW5wdXRQb3J0SWQsXG4gICAgICAgICAgb3V0cHV0UG9ydElkOiBub2RlT3V0cHV0UG9ydElkXG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gICAgICAvLyBJZiBhdCBsZWFzdCBvbmUgZW5kIG9mIHRoZSBlZGdlIGhhcyBwb3J0cyB0aGVuIHdlIHNob3VsZCBkZXRlcm1pbmUgdGhlIHBvcnRzIHdoZXJlIHRoZSBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQuXG4gICAgICBpZiAoc291cmNlSGFzUG9ydHMgfHwgdGFyZ2V0SGFzUG9ydHMpIHtcbiAgICAgICAgdmFyIHNvdXJjZU5vZGVJbnB1dFBvcnRJZCwgc291cmNlTm9kZU91dHB1dFBvcnRJZCwgdGFyZ2V0Tm9kZUlucHV0UG9ydElkLCB0YXJnZXROb2RlT3V0cHV0UG9ydElkO1xuXG4gICAgICAgIC8vIElmIHNvdXJjZSBub2RlIGhhcyBwb3J0cyBzZXQgdGhlIHZhcmlhYmxlcyBkZWRpY2F0ZWQgZm9yIGl0cyBJTyBwb3J0c1xuICAgICAgICBpZiAoIHNvdXJjZUhhc1BvcnRzICkge1xuICAgICAgICAgIHZhciBpb1BvcnRzID0gZ2V0SU9Qb3J0SWRzKHNvdXJjZU5vZGUpO1xuICAgICAgICAgIHNvdXJjZU5vZGVJbnB1dFBvcnRJZCA9IGlvUG9ydHMuaW5wdXRQb3J0SWQ7XG4gICAgICAgICAgc291cmNlTm9kZU91dHB1dFBvcnRJZCA9IGlvUG9ydHMub3V0cHV0UG9ydElkO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGFyZ2V0IG5vZGUgaGFzIHBvcnRzIHNldCB0aGUgdmFyaWFibGVzIGRlZGljYXRlZCBmb3IgaXRzIElPIHBvcnRzXG4gICAgICAgIGlmICggdGFyZ2V0SGFzUG9ydHMgKSB7XG4gICAgICAgICAgdmFyIGlvUG9ydHMgPSBnZXRJT1BvcnRJZHModGFyZ2V0Tm9kZSk7XG4gICAgICAgICAgdGFyZ2V0Tm9kZUlucHV0UG9ydElkID0gaW9Qb3J0cy5pbnB1dFBvcnRJZDtcbiAgICAgICAgICB0YXJnZXROb2RlT3V0cHV0UG9ydElkID0gaW9Qb3J0cy5vdXRwdXRQb3J0SWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2JnbmNsYXNzID09PSAnY29uc3VtcHRpb24nKSB7XG4gICAgICAgICAgLy8gQSBjb25zdW1wdGlvbiBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQgdG8gdGhlIGlucHV0IHBvcnQgb2YgdGhlIHRhcmdldCBub2RlIHdoaWNoIGlzIHN1cHBvc2VkIHRvIGJlIGEgcHJvY2VzcyAoYW55IGtpbmQgb2YpXG4gICAgICAgICAgcG9ydHRhcmdldCA9IHRhcmdldE5vZGVJbnB1dFBvcnRJZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzYmduY2xhc3MgPT09ICdwcm9kdWN0aW9uJyB8fCB0aGlzLmlzTW9kdWxhdGlvbkFyY0NsYXNzKHNiZ25jbGFzcykpIHtcbiAgICAgICAgICAvLyBBIHByb2R1Y3Rpb24gZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBvdXRwdXQgcG9ydCBvZiB0aGUgc291cmNlIG5vZGUgd2hpY2ggaXMgc3VwcG9zZWQgdG8gYmUgYSBwcm9jZXNzIChhbnkga2luZCBvZilcbiAgICAgICAgICAvLyBBIG1vZHVsYXRpb24gZWRnZSBtYXkgaGF2ZSBhIGxvZ2ljYWwgb3BlcmF0b3IgYXMgc291cmNlIG5vZGUgaW4gdGhpcyBjYXNlIHRoZSBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQgdG8gdGhlIG91dHB1dCBwb3J0IG9mIGl0XG4gICAgICAgICAgLy8gVGhlIGJlbG93IGFzc2lnbm1lbnQgc2F0aXNmeSBhbGwgb2YgdGhlc2UgY29uZGl0aW9uXG4gICAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2JnbmNsYXNzID09PSAnbG9naWMgYXJjJykge1xuICAgICAgICAgIHZhciBzcmNDbGFzcyA9IHNvdXJjZU5vZGUuZGF0YSgnY2xhc3MnKTtcbiAgICAgICAgICB2YXIgdGd0Q2xhc3MgPSB0YXJnZXROb2RlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgICAgdmFyIGlzU291cmNlTG9naWNhbE9wID0gc3JjQ2xhc3MgPT09ICdhbmQnIHx8IHNyY0NsYXNzID09PSAnb3InIHx8IHNyY0NsYXNzID09PSAnbm90JztcbiAgICAgICAgICB2YXIgaXNUYXJnZXRMb2dpY2FsT3AgPSB0Z3RDbGFzcyA9PT0gJ2FuZCcgfHwgdGd0Q2xhc3MgPT09ICdvcicgfHwgdGd0Q2xhc3MgPT09ICdub3QnO1xuXG4gICAgICAgICAgaWYgKGlzU291cmNlTG9naWNhbE9wICYmIGlzVGFyZ2V0TG9naWNhbE9wKSB7XG4gICAgICAgICAgICAvLyBJZiBib3RoIGVuZCBhcmUgbG9naWNhbCBvcGVyYXRvcnMgdGhlbiB0aGUgZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBpbnB1dCBwb3J0IG9mIHRoZSB0YXJnZXQgYW5kIHRoZSBvdXRwdXQgcG9ydCBvZiB0aGUgaW5wdXRcbiAgICAgICAgICAgIHBvcnR0YXJnZXQgPSB0YXJnZXROb2RlSW5wdXRQb3J0SWQ7XG4gICAgICAgICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZU91dHB1dFBvcnRJZDtcbiAgICAgICAgICB9Ly8gSWYganVzdCBvbmUgZW5kIG9mIGxvZ2ljYWwgb3BlcmF0b3IgdGhlbiB0aGUgZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBpbnB1dCBwb3J0IG9mIHRoZSBsb2dpY2FsIG9wZXJhdG9yXG4gICAgICAgICAgZWxzZSBpZiAoaXNTb3VyY2VMb2dpY2FsT3ApIHtcbiAgICAgICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlSW5wdXRQb3J0SWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGlzVGFyZ2V0TG9naWNhbE9wKSB7XG4gICAgICAgICAgICBwb3J0dGFyZ2V0ID0gdGFyZ2V0Tm9kZUlucHV0UG9ydElkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgZGVmYXVsdCBwb3J0c291cmNlL3BvcnR0YXJnZXQgYXJlIHRoZSBzb3VyY2UvdGFyZ2V0IHRoZW1zZWx2ZXMuIElmIHRoZXkgYXJlIG5vdCBzZXQgdXNlIHRoZXNlIGRlZmF1bHRzLlxuICAgICAgLy8gVGhlIHBvcnRzb3VyY2UgYW5kIHBvcnR0YXJnZXQgYXJlIGRldGVybWluZWQgc2V0IHRoZW0gaW4gZGF0YSBvYmplY3QuXG4gICAgICBkYXRhLnBvcnRzb3VyY2UgPSBwb3J0c291cmNlIHx8IHNvdXJjZTtcbiAgICAgIGRhdGEucG9ydHRhcmdldCA9IHBvcnR0YXJnZXQgfHwgdGFyZ2V0O1xuXG4gICAgICB2YXIgZWxlcyA9IGN5LmFkZCh7XG4gICAgICAgIGdyb3VwOiBcImVkZ2VzXCIsXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGNzczogY3NzXG4gICAgICB9KTtcblxuICAgICAgdmFyIG5ld0VkZ2UgPSBlbGVzW2VsZXMubGVuZ3RoIC0gMV07XG5cbiAgICAgIHJldHVybiBuZXdFZGdlO1xuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24oX3NvdXJjZSwgX3RhcmdldCwgcHJvY2Vzc1R5cGUpIHtcbiAgICAgIC8vIElmIHNvdXJjZSBhbmQgdGFyZ2V0IElEcyBhcmUgZ2l2ZW4gZ2V0IHRoZSBlbGVtZW50cyBieSBJRHNcbiAgICAgIHZhciBzb3VyY2UgPSB0eXBlb2YgX3NvdXJjZSA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfc291cmNlKSA6IF9zb3VyY2U7XG4gICAgICB2YXIgdGFyZ2V0ID0gdHlwZW9mIF90YXJnZXQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3RhcmdldCkgOiBfdGFyZ2V0O1xuXG4gICAgICAvLyBQcm9jZXNzIHBhcmVudCBzaG91bGQgYmUgdGhlIGNsb3Nlc3QgY29tbW9uIGFuY2VzdG9yIG9mIHRoZSBzb3VyY2UgYW5kIHRhcmdldCBub2Rlc1xuICAgICAgdmFyIHByb2Nlc3NQYXJlbnQgPSBjeS5jb2xsZWN0aW9uKFtzb3VyY2VbMF0sIHRhcmdldFswXV0pLmNvbW1vbkFuY2VzdG9ycygpLmZpcnN0KCk7XG5cbiAgICAgIC8vIFByb2Nlc3Mgc2hvdWxkIGJlIGF0IHRoZSBtaWRkbGUgb2YgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0IG5vZGVzXG4gICAgICB2YXIgeCA9ICggc291cmNlLnBvc2l0aW9uKCd4JykgKyB0YXJnZXQucG9zaXRpb24oJ3gnKSApIC8gMjtcbiAgICAgIHZhciB5ID0gKCBzb3VyY2UucG9zaXRpb24oJ3knKSArIHRhcmdldC5wb3NpdGlvbigneScpICkgLyAyO1xuXG4gICAgICAvLyBDcmVhdGUgdGhlIHByb2Nlc3Mgd2l0aCBnaXZlbi9jYWxjdWxhdGVkIHZhcmlhYmxlc1xuICAgICAgdmFyIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeCwgeSwgcHJvY2Vzc1R5cGUsIHVuZGVmaW5lZCwgcHJvY2Vzc1BhcmVudC5pZCgpKTtcbiAgICAgICAgdmFyIHhkaWZmID0gc291cmNlLnBvc2l0aW9uKCd4JykgLSB0YXJnZXQucG9zaXRpb24oJ3gnKTtcbiAgICAgICAgdmFyIHlkaWZmID0gc291cmNlLnBvc2l0aW9uKCd5JykgLSB0YXJnZXQucG9zaXRpb24oJ3knKVxuICAgICAgICBpZiAoTWF0aC5hYnMoeGRpZmYpID49IE1hdGguYWJzKHlkaWZmKSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHhkaWZmIDwgMClcbiAgICAgICAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2VzcywgJ0wtdG8tUicpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzLCAnUi10by1MJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoeWRpZmYgPCAwKVxuICAgICAgICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzLCAnVC10by1CJyk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdCLXRvLVQnKTtcbiAgICAgICAgfVxuXG5cbiAgICAgIC8vIENyZWF0ZSB0aGUgZWRnZXMgb25lIGlzIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSBzb3VyY2Ugbm9kZSAod2hpY2ggc2hvdWxkIGJlIGEgY29uc3VtcHRpb24pLFxuICAgICAgLy8gdGhlIG90aGVyIG9uZSBpcyBiZXR3ZWVuIHRoZSBwcm9jZXNzIGFuZCB0aGUgdGFyZ2V0IG5vZGUgKHdoaWNoIHNob3VsZCBiZSBhIHByb2R1Y3Rpb24pLlxuICAgICAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gcGxlYXNlIHJlZmVyIHRvIFNCR04tUEQgcmVmZXJlbmNlIGNhcmQuXG4gICAgICB2YXIgZWRnZUJ0d1NyYyA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShzb3VyY2UuaWQoKSwgcHJvY2Vzcy5pZCgpLCAnY29uc3VtcHRpb24nKTtcbiAgICAgIHZhciBlZGdlQnR3VGd0ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgdGFyZ2V0LmlkKCksICdwcm9kdWN0aW9uJyk7XG5cbiAgICAgIC8vIENyZWF0ZSBhIGNvbGxlY3Rpb24gaW5jbHVkaW5nIHRoZSBlbGVtZW50cyBhbmQgdG8gYmUgcmV0dXJuZWRcbiAgICAgIHZhciBjb2xsZWN0aW9uID0gY3kuY29sbGVjdGlvbihbcHJvY2Vzc1swXSwgZWRnZUJ0d1NyY1swXSwgZWRnZUJ0d1RndFswXV0pO1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogUmV0dXJucyBpZiB0aGUgZWxlbWVudHMgd2l0aCB0aGUgZ2l2ZW4gcGFyZW50IGNsYXNzIGNhbiBiZSBwYXJlbnQgb2YgdGhlIGVsZW1lbnRzIHdpdGggdGhlIGdpdmVuIG5vZGUgY2xhc3NcbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLmlzVmFsaWRQYXJlbnQgPSBmdW5jdGlvbihfbm9kZUNsYXNzLCBfcGFyZW50Q2xhc3MsIG5vZGUpIHtcbiAgICAgIC8vIElmIG5vZGVDbGFzcyBhbmQgcGFyZW50Q2xhc3MgcGFyYW1zIGFyZSBlbGVtZW50cyBpdHNlbHZlcyBpbnN0ZWFkIG9mIHRoZWlyIGNsYXNzIG5hbWVzIGhhbmRsZSBpdFxuICAgICAgdmFyIG5vZGVDbGFzcyA9IHR5cGVvZiBfbm9kZUNsYXNzICE9PSAnc3RyaW5nJyA/IF9ub2RlQ2xhc3MuZGF0YSgnY2xhc3MnKSA6IF9ub2RlQ2xhc3M7XG4gICAgICB2YXIgcGFyZW50Q2xhc3MgPSBfcGFyZW50Q2xhc3MgIT0gdW5kZWZpbmVkICYmIHR5cGVvZiBfcGFyZW50Q2xhc3MgIT09ICdzdHJpbmcnID8gX3BhcmVudENsYXNzLmRhdGEoJ2NsYXNzJykgOiBfcGFyZW50Q2xhc3M7XG5cbiAgICAgIGlmIChwYXJlbnRDbGFzcyA9PSB1bmRlZmluZWQgfHwgcGFyZW50Q2xhc3MgPT09ICdjb21wYXJ0bWVudCdcbiAgICAgICAgICAgICAgfHwgcGFyZW50Q2xhc3MgPT09ICdzdWJtYXAnKSB7IC8vIENvbXBhcnRtZW50cywgc3VibWFwcyBhbmQgdGhlIHJvb3QgY2FuIGluY2x1ZGUgYW55IHR5cGUgb2Ygbm9kZXNcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChwYXJlbnRDbGFzcy5zdGFydHNXaXRoKCdjb21wbGV4JykgJiYgKCFub2RlIHx8IG5vZGUuY29ubmVjdGVkRWRnZXMoKS5sZW5ndGggPT0gMCAgLy8gQ29tcGxleGVzIGNhbiBvbmx5IGluY2x1ZGUgRVBOcyB3aGljaCBkbyBub3QgaGF2ZSBlZGdlc1xuICAgICAgICAgICAgICB8fCBlbGVtZW50VXRpbGl0aWVzLm1hcFR5cGUgPT0gXCJVbmtub3duXCIpKSB7IC8vIFdoZW4gbWFwIHR5cGUgaXMgdW5rbm93biwgYWxsb3cgY29tcGxleGVzIHRvIGluY2x1ZGUgRVBOcyB3aXRoIGVkZ2VzXG4gICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3Mobm9kZUNsYXNzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlOyAvLyBDdXJyZW50bHkganVzdCAnY29tcGFydG1lbnQnIGFuZCAnY29tcGxleCcgY29tcG91bmRzIGFyZSBzdXBwb3J0ZWQgcmV0dXJuIGZhbHNlIGZvciBhbnkgb3RoZXIgcGFyZW50Q2xhc3NcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBUaGlzIG1ldGhvZCBhc3N1bWVzIHRoYXQgcGFyYW0ubm9kZXNUb01ha2VDb21wb3VuZCBjb250YWlucyBhdCBsZWFzdCBvbmUgbm9kZVxuICAgICAqIGFuZCBhbGwgb2YgdGhlIG5vZGVzIGluY2x1ZGluZyBpbiBpdCBoYXZlIHRoZSBzYW1lIHBhcmVudC4gSXQgY3JlYXRlcyBhIGNvbXBvdW5kIGZvdCB0aGUgZ2l2ZW4gbm9kZXMgYW4gaGF2aW5nIHRoZSBnaXZlbiB0eXBlLlxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKG5vZGVzVG9NYWtlQ29tcG91bmQsIGNvbXBvdW5kVHlwZSkge1xuICAgICAgdmFyIG9sZFBhcmVudElkID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwicGFyZW50XCIpO1xuICAgICAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZC4geCwgeSBhbmQgaWQgcGFyYW1ldGVycyBhcmUgbm90IHNldC5cbiAgICAgIHZhciBuZXdDb21wb3VuZCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29tcG91bmRUeXBlLCB1bmRlZmluZWQsIG9sZFBhcmVudElkKTtcbiAgICAgIHZhciBuZXdDb21wb3VuZElkID0gbmV3Q29tcG91bmQuaWQoKTtcbiAgICAgIHZhciBuZXdFbGVzID0gZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQobm9kZXNUb01ha2VDb21wb3VuZCwgbmV3Q29tcG91bmRJZCk7XG4gICAgICBuZXdFbGVzID0gbmV3RWxlcy51bmlvbihuZXdDb21wb3VuZCk7XG4gICAgICByZXR1cm4gbmV3RWxlcztcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcbiAgICAgKiBpbiB0aGUgY29tcGxleC4gUGFyYW1ldGVycyBhcmUgZXhwbGFpbmVkIGJlbG93LlxuICAgICAqIHRlbXBsYXRlVHlwZTogVGhlIHR5cGUgb2YgdGhlIHRlbXBsYXRlIHJlYWN0aW9uLiBJdCBtYXkgYmUgJ2Fzc29jaWF0aW9uJyBvciAnZGlzc29jaWF0aW9uJyBmb3Igbm93LlxuICAgICAqIG1hY3JvbW9sZWN1bGVMaXN0OiBUaGUgbGlzdCBvZiB0aGUgbmFtZXMgb2YgbWFjcm9tb2xlY3VsZXMgd2hpY2ggd2lsbCBpbnZvbHZlIGluIHRoZSByZWFjdGlvbi5cbiAgICAgKiBjb21wbGV4TmFtZTogVGhlIG5hbWUgb2YgdGhlIGNvbXBsZXggaW4gdGhlIHJlYWN0aW9uLlxuICAgICAqIHByb2Nlc3NQb3NpdGlvbjogVGhlIG1vZGFsIHBvc2l0aW9uIG9mIHRoZSBwcm9jZXNzIGluIHRoZSByZWFjdGlvbi4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgdGhlIGNlbnRlciBvZiB0aGUgY2FudmFzLlxuICAgICAqIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cbiAgICAgKiB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cbiAgICAgKiBlZGdlTGVuZ3RoOiBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgcHJvY2VzcyBhbmQgdGhlIG1hY3JvbW9sZWN1bGVzIGF0IHRoZSBib3RoIHNpZGVzLlxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKSB7XG4gICAgICB2YXIgZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW1wibWFjcm9tb2xlY3VsZVwiXTtcbiAgICAgIHZhciB0ZW1wbGF0ZVR5cGUgPSB0ZW1wbGF0ZVR5cGU7XG4gICAgICB2YXIgcHJvY2Vzc1dpZHRoID0gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1t0ZW1wbGF0ZVR5cGVdID8gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1t0ZW1wbGF0ZVR5cGVdLndpZHRoIDogNTA7XG4gICAgICB2YXIgbWFjcm9tb2xlY3VsZVdpZHRoID0gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMgPyBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcy53aWR0aCA6IDUwO1xuICAgICAgdmFyIG1hY3JvbW9sZWN1bGVIZWlnaHQgPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA/IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLmhlaWdodCA6IDUwO1xuICAgICAgdmFyIHByb2Nlc3NQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbiA/IHByb2Nlc3NQb3NpdGlvbiA6IGVsZW1lbnRVdGlsaXRpZXMuY29udmVydFRvTW9kZWxQb3NpdGlvbih7eDogY3kud2lkdGgoKSAvIDIsIHk6IGN5LmhlaWdodCgpIC8gMn0pO1xuICAgICAgdmFyIG1hY3JvbW9sZWN1bGVMaXN0ID0gbWFjcm9tb2xlY3VsZUxpc3Q7XG4gICAgICB2YXIgY29tcGxleE5hbWUgPSBjb21wbGV4TmFtZTtcbiAgICAgIHZhciBudW1PZk1hY3JvbW9sZWN1bGVzID0gbWFjcm9tb2xlY3VsZUxpc3QubGVuZ3RoO1xuICAgICAgdmFyIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA9IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA/IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA6IDE1O1xuICAgICAgdmFyIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID0gdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPyB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA6IDE1O1xuICAgICAgdmFyIGVkZ2VMZW5ndGggPSBlZGdlTGVuZ3RoID8gZWRnZUxlbmd0aCA6IDYwO1xuXG4gICAgICBjeS5zdGFydEJhdGNoKCk7XG5cbiAgICAgIHZhciB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcztcbiAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICAgICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xuICAgICAgfVxuXG4gICAgICAvL0NyZWF0ZSB0aGUgcHJvY2VzcyBpbiB0ZW1wbGF0ZSB0eXBlXG4gICAgICB2YXIgcHJvY2VzcyA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksIHRlbXBsYXRlVHlwZSk7XG4gICAgICBwcm9jZXNzLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICAvL0RlZmluZSB0aGUgc3RhcnRpbmcgeSBwb3NpdGlvblxuICAgICAgdmFyIHlQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi55IC0gKChudW1PZk1hY3JvbW9sZWN1bGVzIC0gMSkgLyAyKSAqIChtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsKTtcblxuICAgICAgLy9DcmVhdGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXNcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtT2ZNYWNyb21vbGVjdWxlczsgaSsrKSB7XG4gICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzLCB5UG9zaXRpb24sIFwibWFjcm9tb2xlY3VsZVwiKTtcbiAgICAgICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgICAgbmV3Tm9kZS5kYXRhKCdsYWJlbCcsIG1hY3JvbW9sZWN1bGVMaXN0W2ldKTtcblxuICAgICAgICAvL2NyZWF0ZSB0aGUgZWRnZSBjb25uZWN0ZWQgdG8gdGhlIG5ldyBtYWNyb21vbGVjdWxlXG4gICAgICAgIHZhciBuZXdFZGdlO1xuICAgICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XG4gICAgICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdOb2RlLmlkKCksIHByb2Nlc3MuaWQoKSwgJ2NvbnN1bXB0aW9uJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIG5ld05vZGUuaWQoKSwgJ3Byb2R1Y3Rpb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld0VkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgICAgLy91cGRhdGUgdGhlIHkgcG9zaXRpb25cbiAgICAgICAgeVBvc2l0aW9uICs9IG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XG4gICAgICB9XG5cbiAgICAgIC8vQ3JlYXRlIHRoZSBjb21wbGV4IGluY2x1ZGluZyBtYWNyb21vbGVjdWxlcyBpbnNpZGUgb2YgaXRcbiAgICAgIC8vVGVtcHJvcmFyaWx5IGFkZCBpdCB0byB0aGUgcHJvY2VzcyBwb3NpdGlvbiB3ZSB3aWxsIG1vdmUgaXQgYWNjb3JkaW5nIHRvIHRoZSBsYXN0IHNpemUgb2YgaXRcbiAgICAgIHZhciBjb21wbGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwgJ2NvbXBsZXgnKTtcbiAgICAgIGNvbXBsZXguZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcblxuICAgICAgLy9JZiBhIG5hbWUgaXMgc3BlY2lmaWVkIGZvciB0aGUgY29tcGxleCBzZXQgaXRzIGxhYmVsIGFjY29yZGluZ2x5XG4gICAgICBpZiAoY29tcGxleE5hbWUpIHtcbiAgICAgICAgY29tcGxleC5kYXRhKCdsYWJlbCcsIGNvbXBsZXhOYW1lKTtcbiAgICAgIH1cblxuICAgICAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubm5lY3RlZCB0byB0aGUgY29tcGxleFxuICAgICAgdmFyIGVkZ2VPZkNvbXBsZXg7XG4gICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XG4gICAgICAgIGVkZ2VPZkNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBjb21wbGV4LmlkKCksICdwcm9kdWN0aW9uJyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWRnZU9mQ29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShjb21wbGV4LmlkKCksIHByb2Nlc3MuaWQoKSwgJ2NvbnN1bXB0aW9uJyk7XG4gICAgICB9XG4gICAgICBlZGdlT2ZDb21wbGV4LmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICAvL0NyZWF0ZSB0aGUgbWFjcm9tb2xlY3VsZXMgaW5zaWRlIHRoZSBjb21wbGV4XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mTWFjcm9tb2xlY3VsZXM7IGkrKykge1xuICAgICAgICAvLyBBZGQgYSBtYWNyb21vbGVjdWxlIG5vdCBoYXZpbmcgYSBwcmV2aW91c2x5IGRlZmluZWQgaWQgYW5kIGhhdmluZyB0aGUgY29tcGxleCBjcmVhdGVkIGluIHRoaXMgcmVhY3Rpb24gYXMgcGFyZW50XG4gICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKGNvbXBsZXgucG9zaXRpb24oJ3gnKSwgY29tcGxleC5wb3NpdGlvbigneScpLCBcIm1hY3JvbW9sZWN1bGVcIiwgdW5kZWZpbmVkLCBjb21wbGV4LmlkKCkpO1xuICAgICAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgbWFjcm9tb2xlY3VsZUxpc3RbaV0pO1xuICAgICAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgY3kuZW5kQmF0Y2goKTtcblxuICAgICAgdmFyIGxheW91dE5vZGVzID0gY3kubm9kZXMoJ1tqdXN0QWRkZWRMYXlvdXROb2RlXScpO1xuICAgICAgbGF5b3V0Tm9kZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkTGF5b3V0Tm9kZScpO1xuICAgICAgdmFyIGxheW91dCA9IGxheW91dE5vZGVzLmxheW91dCh7XG4gICAgICAgIG5hbWU6ICdjb3NlLWJpbGtlbnQnLFxuICAgICAgICByYW5kb21pemU6IGZhbHNlLFxuICAgICAgICBmaXQ6IGZhbHNlLFxuICAgICAgICBhbmltYXRlOiBmYWxzZSxcbiAgICAgICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXG4gICAgICAgIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCxcbiAgICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vcmUtcG9zaXRpb24gdGhlIG5vZGVzIGluc2lkZSB0aGUgY29tcGxleFxuICAgICAgICAgIHZhciBzdXBwb3NlZFhQb3NpdGlvbjtcbiAgICAgICAgICB2YXIgc3VwcG9zZWRZUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueTtcblxuICAgICAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICAgICAgICAgIHN1cHBvc2VkWFBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIGNvbXBsZXgub3V0ZXJXaWR0aCgpIC8gMjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdXBwb3NlZFhQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBjb21wbGV4Lm91dGVyV2lkdGgoKSAvIDI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHBvc2l0aW9uRGlmZlggPSBzdXBwb3NlZFhQb3NpdGlvbiAtIGNvbXBsZXgucG9zaXRpb24oJ3gnKTtcbiAgICAgICAgICB2YXIgcG9zaXRpb25EaWZmWSA9IHN1cHBvc2VkWVBvc2l0aW9uIC0gY29tcGxleC5wb3NpdGlvbigneScpO1xuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NpdGlvbkRpZmZYLCB5OiBwb3NpdGlvbkRpZmZZfSwgY29tcGxleCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBEbyB0aGlzIGNoZWNrIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgaWYgKGxheW91dCAmJiBsYXlvdXQucnVuKSB7XG4gICAgICAgIGxheW91dC5ydW4oKTtcbiAgICAgIH1cblxuICAgICAgLy9maWx0ZXIgdGhlIGp1c3QgYWRkZWQgZWxlbWVtdHMgdG8gcmV0dXJuIHRoZW0gYW5kIHJlbW92ZSBqdXN0IGFkZGVkIG1hcmtcbiAgICAgIHZhciBlbGVzID0gY3kuZWxlbWVudHMoJ1tqdXN0QWRkZWRdJyk7XG4gICAgICBlbGVzLnJlbW92ZURhdGEoJ2p1c3RBZGRlZCcpO1xuXG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICBlbGVzLnNlbGVjdCgpO1xuXG4gICAgICByZXR1cm4gZWxlczsgLy8gUmV0dXJuIHRoZSBqdXN0IGFkZGVkIGVsZW1lbnRzXG4gICAgfTtcblxuICAgIC8qXG4gICAgICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQgPSBmdW5jdGlvbihub2RlcywgbmV3UGFyZW50LCBwb3NEaWZmWCwgcG9zRGlmZlkpIHtcbiAgICAgIHZhciBuZXdQYXJlbnRJZCA9IG5ld1BhcmVudCA9PSB1bmRlZmluZWQgfHwgdHlwZW9mIG5ld1BhcmVudCA9PT0gJ3N0cmluZycgPyBuZXdQYXJlbnQgOiBuZXdQYXJlbnQuaWQoKTtcbiAgICAgIHZhciBtb3ZlZEVsZXMgPSBub2Rlcy5tb3ZlKHtcInBhcmVudFwiOiBuZXdQYXJlbnRJZH0pO1xuICAgICAgaWYodHlwZW9mIHBvc0RpZmZYICE9ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwb3NEaWZmWSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyh7eDogcG9zRGlmZlgsIHk6IHBvc0RpZmZZfSwgbm9kZXMpO1xuICAgICAgfVxuICAgICAgZWxlbWVudFV0aWxpdGllcy5tYWludGFpblBvaW50ZXIobW92ZWRFbGVzKTtcbiAgICAgIHJldHVybiBtb3ZlZEVsZXM7XG4gICAgfTtcblxuICAgIC8vIFJlc2l6ZSBnaXZlbiBub2RlcyBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHkgb25lIG9mIHdpZHRoIG9yIGhlaWdodCBzaG91bGQgbm90IGJlIHNldC5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgcmF0aW8gPSB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBlbGVNdXN0QmVTcXVhcmUgPSBlbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZShub2RlLmRhdGEoJ2NsYXNzJykpO1xuXG4gICAgICAgIC8vIE5vdGUgdGhhdCBib3RoIHdpZHRoIGFuZCBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5XG4gICAgICAgIGlmICh3aWR0aCkge1xuICAgICAgICAgIGlmICh1c2VBc3BlY3RSYXRpbyB8fCBlbGVNdXN0QmVTcXVhcmUpIHtcbiAgICAgICAgICAgIHJhdGlvID0gd2lkdGggLyBub2RlLndpZHRoKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gd2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGVpZ2h0KSB7XG4gICAgICAgICAgaWYgKHVzZUFzcGVjdFJhdGlvIHx8IGVsZU11c3RCZVNxdWFyZSkge1xuICAgICAgICAgICAgcmF0aW8gPSBoZWlnaHQgLyBub2RlLmhlaWdodCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IGhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyYXRpbyAmJiAhaGVpZ2h0KSB7XG4gICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gbm9kZS5oZWlnaHQoKSAqIHJhdGlvO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJhdGlvICYmICF3aWR0aCkge1xuICAgICAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IG5vZGUud2lkdGgoKSAqIHJhdGlvO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcblxuICAgIC8vIFNlY3Rpb24gU3RhcnRcbiAgICAvLyBDb21tb24gZWxlbWVudCBwcm9wZXJ0aWVzXG5cbiAgICAvLyBHZXQgY29tbW9uIHByb3BlcnRpZXMgb2YgZ2l2ZW4gZWxlbWVudHMuIFJldHVybnMgbnVsbCBpZiB0aGUgZ2l2ZW4gZWxlbWVudCBsaXN0IGlzIGVtcHR5IG9yIHRoZVxuICAgIC8vIHByb3BlcnR5IGlzIG5vdCBjb21tb24gZm9yIGFsbCBlbGVtZW50cy4gZGF0YU9yQ3NzIHBhcmFtZXRlciBzcGVjaWZ5IHdoZXRoZXIgdG8gY2hlY2sgdGhlIHByb3BlcnR5IG9uIGRhdGEgb3IgY3NzLlxuICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIGZvciBpdCBpcyBkYXRhLiBJZiBwcm9wZXJ0eU5hbWUgcGFyYW1ldGVyIGlzIGdpdmVuIGFzIGEgZnVuY3Rpb24gaW5zdGVhZCBvZiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlXG4gICAgLy8gcHJvcGVydHkgbmFtZSB0aGVuIHVzZSB3aGF0IHRoYXQgZnVuY3Rpb24gcmV0dXJucy5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmdldENvbW1vblByb3BlcnR5ID0gZnVuY3Rpb24gKGVsZW1lbnRzLCBwcm9wZXJ0eU5hbWUsIGRhdGFPckNzcykge1xuICAgICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgaXNGdW5jdGlvbjtcbiAgICAgIC8vIElmIHdlIGFyZSBub3QgY29tcGFyaW5nIHRoZSBwcm9wZXJ0aWVzIGRpcmVjdGx5IHVzZXJzIGNhbiBzcGVjaWZ5IGEgZnVuY3Rpb24gYXMgd2VsbFxuICAgICAgaWYgKHR5cGVvZiBwcm9wZXJ0eU5hbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaXNGdW5jdGlvbiA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFVzZSBkYXRhIGFzIGRlZmF1bHRcbiAgICAgIGlmICghaXNGdW5jdGlvbiAmJiAhZGF0YU9yQ3NzKSB7XG4gICAgICAgIGRhdGFPckNzcyA9ICdkYXRhJztcbiAgICAgIH1cblxuICAgICAgdmFyIHZhbHVlID0gaXNGdW5jdGlvbiA/IHByb3BlcnR5TmFtZShlbGVtZW50c1swXSkgOiBlbGVtZW50c1swXVtkYXRhT3JDc3NdKHByb3BlcnR5TmFtZSk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKCAoIGlzRnVuY3Rpb24gPyBwcm9wZXJ0eU5hbWUoZWxlbWVudHNbaV0pIDogZWxlbWVudHNbaV1bZGF0YU9yQ3NzXShwcm9wZXJ0eU5hbWUpICkgIT0gdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIC8vIFJldHVybnMgaWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgYSB0cnV0aHkgdmFsdWUgZm9yIGFsbCBvZiB0aGUgZ2l2ZW4gZWxlbWVudHMuXG4gICAgZWxlbWVudFV0aWxpdGllcy50cnVlRm9yQWxsRWxlbWVudHMgPSBmdW5jdGlvbiAoZWxlbWVudHMsIGZjbikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIWZjbihlbGVtZW50c1tpXSkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIC8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZSBlbGVtZW50IGNhbiBoYXZlIHNiZ25jYXJkaW5hbGl0eVxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05DYXJkaW5hbGl0eSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuXG4gICAgICByZXR1cm4gZWxlLmRhdGEoJ2NsYXNzJykgPT0gJ2NvbnN1bXB0aW9uJyB8fCBlbGUuZGF0YSgnY2xhc3MnKSA9PSAncHJvZHVjdGlvbic7XG4gICAgfTtcblxuICAgIC8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZSBlbGVtZW50IGNhbiBoYXZlIHNiZ25sYWJlbFxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbCA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuXG4gICAgICByZXR1cm4gc2JnbmNsYXNzICE9ICdhbmQnICYmIHNiZ25jbGFzcyAhPSAnb3InICYmIHNiZ25jbGFzcyAhPSAnbm90JyAmJiBzYmduY2xhc3MgIT0gJ2RlbGF5J1xuICAgICAgICAgICAgICAmJiBzYmduY2xhc3MgIT0gJ2Fzc29jaWF0aW9uJyAmJiBzYmduY2xhc3MgIT0gJ2Rpc3NvY2lhdGlvbicgJiYgc2JnbmNsYXNzICE9ICdzb3VyY2UgYW5kIHNpbmsnICYmICFzYmduY2xhc3MuZW5kc1dpdGgoJ3Byb2Nlc3MnKTtcbiAgICB9O1xuXG4gICAgLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgaGF2ZSB1bml0IG9mIGluZm9ybWF0aW9uXG4gICAgZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlVW5pdE9mSW5mb3JtYXRpb24gPSBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICAgICAgaWYgKHNiZ25jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJ1xuICAgICAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUnIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXG4gICAgICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCcgfHwgc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwgbXVsdGltZXInXG4gICAgICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZSBtdWx0aW1lcicgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSBtdWx0aW1lcidcbiAgICAgICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4IG11bHRpbWVyJyB8fCAoc2JnbmNsYXNzLnN0YXJ0c1dpdGgoJ0JBJykgJiYgc2JnbmNsYXNzICE9IFwiQkEgcGxhaW5cIilcbiAgICAgICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wYXJ0bWVudCcpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBjYW4gaGF2ZSBtb3JlIHRoYW4gb25lIHVuaXRzIG9mIGluZm9ybWF0aW9uXG4gICAgZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlTXVsdGlwbGVVbml0T2ZJbmZvcm1hdGlvbiA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuICAgICAgcmV0dXJuICFzYmduY2xhc3Muc3RhcnRzV2l0aCgnQkEnKTtcbiAgICB9O1xuXG5cbiAgICAvLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBoYXZlIHN0YXRlIHZhcmlhYmxlXG4gICAgZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU3RhdGVWYXJpYWJsZSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuXG4gICAgICBpZiAoc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xuICAgICAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXgnXG4gICAgICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZSBtdWx0aW1lcicgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSBtdWx0aW1lcidcbiAgICAgICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4IG11bHRpbWVyJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGUgc2hvdWxkIGJlIHNxdWFyZSBpbiBzaGFwZVxuICAgIGVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlID0gZnVuY3Rpb24gKGVsZSkge1xuICAgICAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgICAgIHJldHVybiAoc2JnbmNsYXNzLmluZGV4T2YoJ3Byb2Nlc3MnKSAhPSAtMSB8fCBzYmduY2xhc3MgPT0gJ3NvdXJjZSBhbmQgc2luaydcbiAgICAgICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdhbmQnIHx8IHNiZ25jbGFzcyA9PSAnb3InIHx8IHNiZ25jbGFzcyA9PSAnbm90J1xuICAgICAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2Fzc29jaWF0aW9uJyB8fCBzYmduY2xhc3MgPT0gJ2Rpc3NvY2lhdGlvbicgfHwgc2JnbmNsYXNzID09ICdkZWxheScpO1xuICAgIH07XG5cbiAgICAvLyBSZXR1cm5zIHdoZXRoZXIgYW55IG9mIHRoZSBnaXZlbiBub2RlcyBtdXN0IG5vdCBiZSBpbiBzcXVhcmUgc2hhcGVcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNvbWVNdXN0Tm90QmVTcXVhcmUgPSBmdW5jdGlvbiAobm9kZXMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZShub2RlLmRhdGEoJ2NsYXNzJykpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVzIGVsZW1lbnQgY2FuIGJlIGNsb25lZFxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2FuQmVDbG9uZWQgPSBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XG5cbiAgICAgIHZhciBsaXN0ID0ge1xuICAgICAgICAndW5zcGVjaWZpZWQgZW50aXR5JzogdHJ1ZSxcbiAgICAgICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxuICAgICAgICAnY29tcGxleCc6IHRydWUsXG4gICAgICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSc6IHRydWUsXG4gICAgICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxuICAgICAgICAncGVydHVyYmluZyBhZ2VudCc6IHRydWVcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBsaXN0W3NiZ25jbGFzc10gPyB0cnVlIDogZmFsc2U7XG4gICAgfTtcblxuICAgIC8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZXMgZWxlbWVudCBjYW4gYmUgY2xvbmVkXG4gICAgZWxlbWVudFV0aWxpdGllcy5jYW5CZU11bHRpbWVyID0gZnVuY3Rpb24gKGVsZSkge1xuICAgICAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuXG4gICAgICB2YXIgbGlzdCA9IHtcbiAgICAgICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxuICAgICAgICAnY29tcGxleCc6IHRydWUsXG4gICAgICAgICdudWNsZWljIGFjaWQgZmVhdHVyZSc6IHRydWUsXG4gICAgICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gbGlzdFtzYmduY2xhc3NdID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH07XG5cbiAgICAvLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgaXMgYW4gRVBOXG4gICAgZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzID0gZnVuY3Rpb24gKGVsZSkge1xuICAgICAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuXG4gICAgICByZXR1cm4gKHNiZ25jbGFzcyA9PSAndW5zcGVjaWZpZWQgZW50aXR5J1xuICAgICAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCdcbiAgICAgICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJ1xuICAgICAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xuICAgICAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXgnKTtcbiAgICB9O1xuXG4gICAgLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGVtZW50IGlzIGEgUE5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmlzUE5DbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcblxuICAgICAgcmV0dXJuIChzYmduY2xhc3MgPT0gJ3Byb2Nlc3MnXG4gICAgICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnb21pdHRlZCBwcm9jZXNzJ1xuICAgICAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ3VuY2VydGFpbiBwcm9jZXNzJ1xuICAgICAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2Fzc29jaWF0aW9uJ1xuICAgICAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2Rpc3NvY2lhdGlvbidcbiAgICAgICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdwaGVub3R5cGUnKTtcbiAgICB9O1xuXG4gICAgLy8gUmV0dXJucyB3ZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgb3Igc3RyaW5nIGlzIG9mIHRoZSBzcGVjaWFsIGVtcHR5IHNldC9zb3VyY2UgYW5kIHNpbmsgY2xhc3NcbiAgICBlbGVtZW50VXRpbGl0aWVzLmlzRW1wdHlTZXRDbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcbiAgICAgIHJldHVybiBzYmduY2xhc3MgPT0gJ3NvdXJjZSBhbmQgc2luayc7XG4gICAgfTtcblxuICAgIC8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhIGxvZ2ljYWwgb3BlcmF0b3JcbiAgICBlbGVtZW50VXRpbGl0aWVzLmlzTG9naWNhbE9wZXJhdG9yID0gZnVuY3Rpb24gKGVsZSkge1xuICAgICAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICByZXR1cm4gKHNiZ25jbGFzcyA9PSAnYW5kJyB8fCBzYmduY2xhc3MgPT0gJ29yJyB8fCBzYmduY2xhc3MgPT0gJ25vdCcgfHwgc2JnbmNsYXNzID09ICdkZWxheScpO1xuICAgIH07XG5cbiAgICAvLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGNsYXNzIG9mIGdpdmVuIGVsZW1lbnQgaXMgYSBlcXVpdmFsYW5jZSBjbGFzc1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY29udmVuaWVudFRvRXF1aXZhbGVuY2UgPSBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcbiAgICAgIHJldHVybiAoc2JnbmNsYXNzID09ICd0YWcnIHx8IHNiZ25jbGFzcyA9PSAndGVybWluYWwnKTtcbiAgICB9O1xuXG4gICAgLy8gUmV0dXJucyB3ZXRoZXIgdGhlIGNsYXNzIG9mIGdpdmVuIGVsZW1udCBpcyBhIG1vZHVsYXRpb24gYXJjIGFzIGRlZmluZWQgaW4gUEQgc3BlY3NcbiAgICBlbGVtZW50VXRpbGl0aWVzLmlzTW9kdWxhdGlvbkFyY0NsYXNzID0gZnVuY3Rpb24gKGVsZSkge1xuICAgICAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICByZXR1cm4gKHNiZ25jbGFzcyA9PSAnbW9kdWxhdGlvbidcbiAgICAgICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdzdGltdWxhdGlvbicgfHwgc2JnbmNsYXNzID09ICdjYXRhbHlzaXMnXG4gICAgICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnaW5oaWJpdGlvbicgfHwgc2JnbmNsYXNzID09ICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKTtcbiAgICB9XG5cbiAgICAvLyBSZWxvY2F0ZXMgc3RhdGUgYW5kIGluZm8gYm94ZXMuIFRoaXMgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gYmUgY2FsbGVkIGFmdGVyIGFkZC9yZW1vdmUgc3RhdGUgYW5kIGluZm8gYm94ZXNcbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlbG9jYXRlU3RhdGVBbmRJbmZvcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gKGVsZS5pc05vZGUgJiYgZWxlLmlzTm9kZSgpKSA/IGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpIDogZWxlO1xuICAgICAgdmFyIGxlbmd0aCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGxlbmd0aCA9PSAxKSB7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gMDtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChsZW5ndGggPT0gMikge1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMDtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSA1MDtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGxlbmd0aCA9PSAzKSB7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcblxuICAgICAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDI1O1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IC01MDtcblxuICAgICAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IDA7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC55ID0gNTA7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAtMjU7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC55ID0gLTUwO1xuXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gLTI1O1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xuXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbM10uYmJveC54ID0gMjU7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbM10uYmJveC55ID0gNTA7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIENoYW5nZSBzdGF0ZSB2YWx1ZSBvciB1bml0IG9mIGluZm9ybWF0aW9uIGJveCBvZiBnaXZlbiBub2RlcyB3aXRoIGdpdmVuIGluZGV4LlxuICAgIC8vIFR5cGUgcGFyYW1ldGVyIGluZGljYXRlcyB3aGV0aGVyIHRvIGNoYW5nZSB2YWx1ZSBvciB2YXJpYWJsZSwgaXQgaXMgdmFsaWQgaWYgdGhlIGJveCBhdCB0aGUgZ2l2ZW4gaW5kZXggaXMgYSBzdGF0ZSB2YXJpYWJsZS5cbiAgICAvLyBWYWx1ZSBwYXJhbWV0ZXIgaXMgdGhlIG5ldyB2YWx1ZSB0byBzZXQuXG4gICAgLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgb2xkIHZhbHVlIG9mIHRoZSBjaGFuZ2VkIGRhdGEgKFdlIGFzc3VtZSB0aGF0IHRoZSBvbGQgdmFsdWUgb2YgdGhlIGNoYW5nZWQgZGF0YSB3YXMgdGhlIHNhbWUgZm9yIGFsbCBub2RlcykuXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcbiAgICAgICAgdmFyIGJveCA9IHN0YXRlQW5kSW5mb3NbaW5kZXhdO1xuXG4gICAgICAgIGlmIChib3guY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7XG4gICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGJveC5zdGF0ZVt0eXBlXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBib3guc3RhdGVbdHlwZV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChib3guY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcbiAgICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gYm94LmxhYmVsLnRleHQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYm94LmxhYmVsLnRleHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXG4gICAgLy8gVGhlIGJveCBpcyByZXByZXNlbnRlZCBieSB0aGUgcGFyYW1ldGVyIG9iai5cbiAgICAvLyBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUganVzdCBhZGRlZCBib3guXG4gICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2Rlcywgb2JqKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG5cbiAgICAgICAgdmFyIGxvY2F0aW9uT2JqO1xuICAgICAgICBpZihvYmouY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcbiAgICAgICAgICBpZiAoIW5vZGUuZGF0YShcImxhbmd1YWdlXCIpIHx8IG5vZGUuZGF0YShcImxhbmd1YWdlXCIpID09IFwiUERcIil7XG4gICAgICAgICAgICBsb2NhdGlvbk9iaiA9IHNiZ252aXpJbnN0YW5jZS5jbGFzc2VzLlVuaXRPZkluZm9ybWF0aW9uLmNyZWF0ZShub2RlLCBjeSwgb2JqLmxhYmVsLnRleHQsIG9iai5iYm94LCBvYmoubG9jYXRpb24sIG9iai5wb3NpdGlvbiwgb2JqLmluZGV4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAobm9kZS5kYXRhKFwibGFuZ3VhZ2VcIikgPT0gXCJBRlwiKXtcbiAgICAgICAgICAgIGxvY2F0aW9uT2JqID0gc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuVW5pdE9mSW5mb3JtYXRpb24uY3JlYXRlKG5vZGUsIGN5LCBvYmoubGFiZWwudGV4dCwgb2JqLmJib3gsIG9iai5sb2NhdGlvbiwgb2JqLnBvc2l0aW9uLCBvYmouaW5kZXgsXG4gICAgICAgICAgICAgICAgbGlicy5jeXRvc2NhcGUuc2Jnbi5BZlNoYXBlRm4sIGxpYnMuY3l0b3NjYXBlLnNiZ24uQWZTaGFwZUFyZ3NGbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9iai5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHtcbiAgICAgICAgICBsb2NhdGlvbk9iaiA9IHNiZ252aXpJbnN0YW5jZS5jbGFzc2VzLlN0YXRlVmFyaWFibGUuY3JlYXRlKG5vZGUsIGN5LCBvYmouc3RhdGUudmFsdWUsIG9iai5zdGF0ZS52YXJpYWJsZSwgb2JqLmJib3gsIG9iai5sb2NhdGlvbiwgb2JqLnBvc2l0aW9uLCBvYmouaW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbG9jYXRpb25PYmo7XG4gICAgfTtcblxuICAgIC8vIFJlbW92ZSB0aGUgc3RhdGUgb3IgaW5mbyBib3hlcyBvZiB0aGUgZ2l2ZW4gbm9kZXMgYXQgZ2l2ZW4gaW5kZXguXG4gICAgLy8gUmV0dXJucyB0aGUgcmVtb3ZlZCBib3guXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2RlcywgbG9jYXRpb25PYmopIHtcbiAgICAgIHZhciBvYmo7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xuICAgICAgICB2YXIgdW5pdCA9IHN0YXRlQW5kSW5mb3NbbG9jYXRpb25PYmouaW5kZXhdO1xuXG4gICAgICAgIHZhciB1bml0Q2xhc3MgPSBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5nZXRBdXhVbml0Q2xhc3ModW5pdCk7XG5cbiAgICAgICAgb2JqID0gdW5pdENsYXNzLnJlbW92ZSh1bml0LCBjeSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcblxuICAgIC8vIFNldCBtdWx0aW1lciBzdGF0dXMgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uIChub2Rlcywgc3RhdHVzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHZhciBzYmduY2xhc3MgPSBub2RlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgIHZhciBpc011bHRpbWVyID0gbm9kZS5kYXRhKCdjbGFzcycpLmVuZHNXaXRoKCcgbXVsdGltZXInKTtcblxuICAgICAgICBpZiAoc3RhdHVzKSB7IC8vIE1ha2UgbXVsdGltZXIgc3RhdHVzIHRydWVcbiAgICAgICAgICBpZiAoIWlzTXVsdGltZXIpIHtcbiAgICAgICAgICAgIG5vZGUuZGF0YSgnY2xhc3MnLCBzYmduY2xhc3MgKyAnIG11bHRpbWVyJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvLyBNYWtlIG11bHRpbWVyIHN0YXR1cyBmYWxzZVxuICAgICAgICAgIGlmIChpc011bHRpbWVyKSB7XG4gICAgICAgICAgICBub2RlLmRhdGEoJ2NsYXNzJywgc2JnbmNsYXNzLnJlcGxhY2UoJyBtdWx0aW1lcicsICcnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFNldCBjbG9uZSBtYXJrZXIgc3RhdHVzIG9mIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uIChub2Rlcywgc3RhdHVzKSB7XG4gICAgICBpZiAoc3RhdHVzKSB7XG4gICAgICAgIG5vZGVzLmRhdGEoJ2Nsb25lbWFya2VyJywgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbm9kZXMucmVtb3ZlRGF0YSgnY2xvbmVtYXJrZXInKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy9lbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24oKVxuXG4gICAgLy8gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gZWxlbWVudHMgd2l0aCBnaXZlbiBmb250IGRhdGFcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKGVsZXMsIGRhdGEpIHtcbiAgICAgIGZvciAodmFyIHByb3AgaW4gZGF0YSkge1xuICAgICAgICBlbGVzLmRhdGEocHJvcCwgZGF0YVtwcm9wXSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gZ2V0cyBhbiBlZGdlLCBhbmQgZW5kcyBvZiB0aGF0IGVkZ2UgKE9wdGlvbmFsbHkgaXQgbWF5IHRha2UganVzdCB0aGUgY2xhc3NlcyBvZiB0aGUgZWRnZSBhcyB3ZWxsKSBhcyBwYXJhbWV0ZXJzLlxuICAgIC8vIEl0IG1heSByZXR1cm4gJ3ZhbGlkJyAodGhhdCBlbmRzIGlzIHZhbGlkIGZvciB0aGF0IGVkZ2UpLCAncmV2ZXJzZScgKHRoYXQgZW5kcyBpcyBub3QgdmFsaWQgZm9yIHRoYXQgZWRnZSBidXQgdGhleSB3b3VsZCBiZSB2YWxpZFxuICAgIC8vIGlmIHlvdSByZXZlcnNlIHRoZSBzb3VyY2UgYW5kIHRhcmdldCksICdpbnZhbGlkJyAodGhhdCBlbmRzIGFyZSB0b3RhbGx5IGludmFsaWQgZm9yIHRoYXQgZWRnZSkuXG4gICAgZWxlbWVudFV0aWxpdGllcy52YWxpZGF0ZUFycm93RW5kcyA9IGZ1bmN0aW9uIChlZGdlLCBzb3VyY2UsIHRhcmdldCkge1xuICAgICAgLy8gaWYgbWFwIHR5cGUgaXMgVW5rbm93biAtLSBubyBydWxlcyBhcHBsaWVkXG4gICAgICBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgPT0gXCJVbmtub3duXCIgfHwgIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKVxuICAgICAgICByZXR1cm4gXCJ2YWxpZFwiO1xuXG4gICAgICB2YXIgZWRnZWNsYXNzID0gdHlwZW9mIGVkZ2UgPT09ICdzdHJpbmcnID8gZWRnZSA6IGVkZ2UuZGF0YSgnY2xhc3MnKTtcbiAgICAgIHZhciBzb3VyY2VjbGFzcyA9IHNvdXJjZS5kYXRhKCdjbGFzcycpO1xuICAgICAgdmFyIHRhcmdldGNsYXNzID0gdGFyZ2V0LmRhdGEoJ2NsYXNzJyk7XG5cbiAgICAgIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSA9PSBcIkFGXCIpe1xuICAgICAgICBpZiAoc291cmNlY2xhc3Muc3RhcnRzV2l0aChcIkJBXCIpKSAvLyB3ZSBoYXZlIHNlcGFyYXRlIGNsYXNzZXMgZm9yIGVhY2ggYmlvbG9naWNhbCBhY3Rpdml0eVxuICAgICAgICAgIHNvdXJjZWNsYXNzID0gXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI7IC8vIGJ1dCBzYW1lIHJ1bGUgYXBwbGllcyB0byBhbGwgb2YgdGhlbVxuXG4gICAgICAgIGlmICh0YXJnZXRjbGFzcy5zdGFydHNXaXRoKFwiQkFcIikpIC8vIHdlIGhhdmUgc2VwYXJhdGUgY2xhc3NlcyBmb3IgZWFjaCBiaW9sb2dpY2FsIGFjdGl2aXR5XG4gICAgICAgICAgdGFyZ2V0Y2xhc3MgPSBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjsgLy8gYnV0IHNhbWUgcnVsZSBhcHBsaWVzIHRvIGFsbCBvZiB0aGVtXG5cbiAgICAgICAgdmFyIGVkZ2VDb25zdHJhaW50cyA9IHRoaXMuQUYuY29ubmVjdGl2aXR5Q29uc3RyYWludHNbZWRnZWNsYXNzXTtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIHNvdXJjZWNsYXNzID0gc291cmNlY2xhc3MucmVwbGFjZSgvXFxzKm11bHRpbWVyJC8sICcnKVxuICAgICAgICB0YXJnZXRjbGFzcyA9IHRhcmdldGNsYXNzLnJlcGxhY2UoL1xccyptdWx0aW1lciQvLCAnJylcbiAgICAgICAgdmFyIGVkZ2VDb25zdHJhaW50cyA9IHRoaXMuUEQuY29ubmVjdGl2aXR5Q29uc3RyYWludHNbZWRnZWNsYXNzXTtcbiAgICAgIH1cbiAgICAgIC8vIGdpdmVuIGEgbm9kZSwgYWN0aW5nIGFzIHNvdXJjZSBvciB0YXJnZXQsIHJldHVybnMgYm9vbGVhbiB3ZXRoZXIgb3Igbm90IGl0IGhhcyB0b28gbWFueSBlZGdlcyBhbHJlYWR5XG4gICAgICBmdW5jdGlvbiBoYXNUb29NYW55RWRnZXMobm9kZSwgc291cmNlT3JUYXJnZXQpIHtcbiAgICAgICAgdmFyIG5vZGVjbGFzcyA9IG5vZGUuZGF0YSgnY2xhc3MnKTtcbiAgICAgICAgbm9kZWNsYXNzID0gbm9kZWNsYXNzLnJlcGxhY2UoL1xccyptdWx0aW1lciQvLCAnJyk7XG4gICAgICAgIGlmIChub2RlY2xhc3Muc3RhcnRzV2l0aChcIkJBXCIpKVxuICAgICAgICAgIG5vZGVjbGFzcyA9IFwiYmlvbG9naWNhbCBhY3Rpdml0eVwiO1xuXG4gICAgICAgIHZhciB0b3RhbFRvb01hbnkgPSB0cnVlO1xuICAgICAgICB2YXIgZWRnZVRvb01hbnkgPSB0cnVlO1xuICAgICAgICBpZiAoc291cmNlT3JUYXJnZXQgPT0gXCJzb3VyY2VcIikge1xuICAgICAgICAgICAgdmFyIHNhbWVFZGdlQ291bnRPdXQgPSBub2RlLm91dGdvZXJzKCdlZGdlW2NsYXNzPVwiJytlZGdlY2xhc3MrJ1wiXScpLnNpemUoKTtcbiAgICAgICAgICAgIHZhciB0b3RhbEVkZ2VDb3VudE91dCA9IG5vZGUub3V0Z29lcnMoJ2VkZ2UnKS5zaXplKCk7XG4gICAgICAgICAgICAvLyBjaGVjayB0aGF0IHRoZSB0b3RhbCBlZGdlIGNvdW50IGlzIHdpdGhpbiB0aGUgbGltaXRzXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzU291cmNlLm1heFRvdGFsID09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICAgICAgfHwgdG90YWxFZGdlQ291bnRPdXQgPCBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1NvdXJjZS5tYXhUb3RhbCApIHtcbiAgICAgICAgICAgICAgICB0b3RhbFRvb01hbnkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRoZW4gY2hlY2sgbGltaXRzIGZvciB0aGlzIHNwZWNpZmljIGVkZ2UgY2xhc3NcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNTb3VyY2UubWF4RWRnZSA9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgIHx8IHNhbWVFZGdlQ291bnRPdXQgPCBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1NvdXJjZS5tYXhFZGdlICkge1xuICAgICAgICAgICAgICAgIGVkZ2VUb29NYW55ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiBvbmx5IG9uZSBvZiB0aGUgbGltaXRzIGlzIHJlYWNoZWQgdGhlbiBlZGdlIGlzIGludmFsaWRcbiAgICAgICAgICAgIHJldHVybiB0b3RhbFRvb01hbnkgfHwgZWRnZVRvb01hbnk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8vIG5vZGUgaXMgdXNlZCBhcyB0YXJnZXRcbiAgICAgICAgICAgIHZhciBzYW1lRWRnZUNvdW50SW4gPSBub2RlLmluY29tZXJzKCdlZGdlW2NsYXNzPVwiJytlZGdlY2xhc3MrJ1wiXScpLnNpemUoKTtcbiAgICAgICAgICAgIHZhciB0b3RhbEVkZ2VDb3VudEluID0gbm9kZS5pbmNvbWVycygnZWRnZScpLnNpemUoKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNUYXJnZXQubWF4VG90YWwgPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICB8fCB0b3RhbEVkZ2VDb3VudEluIDwgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNUYXJnZXQubWF4VG90YWwgKSB7XG4gICAgICAgICAgICAgICAgdG90YWxUb29NYW55ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heEVkZ2UgPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICB8fCBzYW1lRWRnZUNvdW50SW4gPCBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1RhcmdldC5tYXhFZGdlICkge1xuICAgICAgICAgICAgICAgIGVkZ2VUb29NYW55ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdG90YWxUb29NYW55IHx8IGVkZ2VUb29NYW55O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaXNJbkNvbXBsZXgobm9kZSkge1xuICAgICAgICB2YXIgcGFyZW50Q2xhc3MgPSBub2RlLnBhcmVudCgpLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgIHJldHVybiBwYXJlbnRDbGFzcyAmJiBwYXJlbnRDbGFzcy5zdGFydHNXaXRoKCdjb21wbGV4Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0luQ29tcGxleChzb3VyY2UpIHx8IGlzSW5Db21wbGV4KHRhcmdldCkpIHsgLy8gc3VidW5pdHMgb2YgYSBjb21wbGV4IGFyZSBubyBsb25nZXIgRVBOcywgbm8gY29ubmVjdGlvbiBhbGxvd2VkXG4gICAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgICB9XG5cbiAgICAgIC8vIGNoZWNrIG5hdHVyZSBvZiBjb25uZWN0aW9uXG4gICAgICBpZiAoZWRnZUNvbnN0cmFpbnRzW3NvdXJjZWNsYXNzXS5hc1NvdXJjZS5pc0FsbG93ZWQgJiYgZWRnZUNvbnN0cmFpbnRzW3RhcmdldGNsYXNzXS5hc1RhcmdldC5pc0FsbG93ZWQpIHtcbiAgICAgICAgLy8gY2hlY2sgYW1vdW50IG9mIGNvbm5lY3Rpb25zXG4gICAgICAgIGlmICghaGFzVG9vTWFueUVkZ2VzKHNvdXJjZSwgXCJzb3VyY2VcIikgJiYgIWhhc1Rvb01hbnlFZGdlcyh0YXJnZXQsIFwidGFyZ2V0XCIpICkge1xuICAgICAgICAgIHJldHVybiAndmFsaWQnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyB0cnkgdG8gcmV2ZXJzZVxuICAgICAgaWYgKGVkZ2VDb25zdHJhaW50c1t0YXJnZXRjbGFzc10uYXNTb3VyY2UuaXNBbGxvd2VkICYmIGVkZ2VDb25zdHJhaW50c1tzb3VyY2VjbGFzc10uYXNUYXJnZXQuaXNBbGxvd2VkKSB7XG4gICAgICAgIGlmICghaGFzVG9vTWFueUVkZ2VzKHRhcmdldCwgXCJzb3VyY2VcIikgJiYgIWhhc1Rvb01hbnlFZGdlcyhzb3VyY2UsIFwidGFyZ2V0XCIpICkge1xuICAgICAgICAgIHJldHVybiAncmV2ZXJzZSc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogSGlkZSBnaXZlbiBlbGVzIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXG4gICAgICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLlxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuaGlkZUFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihlbGVzLCBsYXlvdXRwYXJhbSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gY3kudmlld1V0aWxpdGllcygpLmhpZGUoZWxlcyk7IC8vIEhpZGUgZ2l2ZW4gZWxlc1xuICAgICAgICBpZiAodHlwZW9mIGxheW91dHBhcmFtID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBsYXlvdXRwYXJhbSgpOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBhIGZ1bmN0aW9uIGV4ZWN1dGUgaXRcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBsYXlvdXQgPSBjeS5sYXlvdXQobGF5b3V0cGFyYW0pOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBsYXlvdXQgb3B0aW9ucyBjYWxsIGxheW91dCB3aXRoIHRoYXQgb3B0aW9ucy5cblxuICAgICAgICAgICAgLy8gRG8gdGhpcyBjaGVjayBmb3IgY3l0b3NjYXBlLmpzIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xuICAgICAgICAgICAgICAgIGxheW91dC5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogVW5oaWRlIGdpdmVuIGVsZXMgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcbiAgICAgKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGVsZXMsIGxheW91dHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgZ2l2ZW4gZWxlc1xuICAgICAgaWYgKHR5cGVvZiBsYXlvdXRwYXJhbSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBsYXlvdXRwYXJhbSgpOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBhIGZ1bmN0aW9uIGV4ZWN1dGUgaXRcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgbGF5b3V0ID0gY3kubGF5b3V0KGxheW91dHBhcmFtKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgbGF5b3V0IG9wdGlvbnMgY2FsbCBsYXlvdXQgd2l0aCB0aGF0IG9wdGlvbnMuXG5cbiAgICAgICAgLy8gRG8gdGhpcyBjaGVjayBmb3IgY3l0b3NjYXBlLmpzIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICAgICAgaWYgKGxheW91dCAmJiBsYXlvdXQucnVuKSB7XG4gICAgICAgICAgbGF5b3V0LnJ1bigpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogQ2hhbmdlIHN0eWxlL2NzcyBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXG4gICAgICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VDc3MgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICAgICAgaWYgKCB0eXBlb2YgdmFsdWVNYXAgPT09ICdvYmplY3QnICkge1xuICAgICAgICBjeS5zdGFydEJhdGNoKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuICAgICAgICAgIGVsZS5jc3MobmFtZSwgdmFsdWVNYXBbZWxlLmlkKCldKTsgLy8gdmFsdWVNYXAgaXMgYW4gaWQgdG8gdmFsdWUgbWFwIHVzZSBpdCBpbiB0aGlzIHdheVxuICAgICAgICB9XG4gICAgICAgIGN5LmVuZEJhdGNoKCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlcy5jc3MobmFtZSwgdmFsdWVNYXApOyAvLyB2YWx1ZU1hcCBpcyBqdXN0IGEgc3RyaW5nIHNldCBjc3MoJ25hbWUnKSBmb3IgYWxsIGVsZXMgdG8gdGhpcyB2YWx1ZVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKlxuICAgICAqIENoYW5nZSBkYXRhIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAgICAgKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS5cbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICAgICAgaWYgKCB0eXBlb2YgdmFsdWVNYXAgPT09ICdvYmplY3QnICkge1xuICAgICAgICBjeS5zdGFydEJhdGNoKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuICAgICAgICAgIGVsZS5kYXRhKG5hbWUsIHZhbHVlTWFwW2VsZS5pZCgpXSk7IC8vIHZhbHVlTWFwIGlzIGFuIGlkIHRvIHZhbHVlIG1hcCB1c2UgaXQgaW4gdGhpcyB3YXlcbiAgICAgICAgfVxuICAgICAgICBjeS5lbmRCYXRjaCgpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGVsZXMuZGF0YShuYW1lLCB2YWx1ZU1hcCk7IC8vIHZhbHVlTWFwIGlzIGp1c3QgYSBzdHJpbmcgc2V0IGNzcygnbmFtZScpIGZvciBhbGwgZWxlcyB0byB0aGlzIHZhbHVlXG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogUmV0dXJuIHRoZSBzZXQgb2YgYWxsIG5vZGVzIHByZXNlbnQgdW5kZXIgdGhlIGdpdmVuIHBvc2l0aW9uXG4gICAgICogcmVuZGVyZWRQb3MgbXVzdCBiZSBhIHBvaW50IGRlZmluZWQgcmVsYXRpdmVseSB0byBjeXRvc2NhcGUgY29udGFpbmVyXG4gICAgICogKGxpa2UgcmVuZGVyZWRQb3NpdGlvbiBmaWVsZCBvZiBhIG5vZGUpXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5nZXROb2Rlc0F0ID0gZnVuY3Rpb24ocmVuZGVyZWRQb3MpIHtcbiAgICAgIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XG4gICAgICB2YXIgeCA9IHJlbmRlcmVkUG9zLng7XG4gICAgICB2YXIgeSA9IHJlbmRlcmVkUG9zLnk7XG4gICAgICB2YXIgcmVzdWx0Tm9kZXMgPSBbXTtcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgcmVuZGVyZWRCYm94ID0gbm9kZS5yZW5kZXJlZEJvdW5kaW5nQm94KHtcbiAgICAgICAgICBpbmNsdWRlTm9kZXM6IHRydWUsXG4gICAgICAgICAgaW5jbHVkZUVkZ2VzOiBmYWxzZSxcbiAgICAgICAgICBpbmNsdWRlTGFiZWxzOiBmYWxzZSxcbiAgICAgICAgICBpbmNsdWRlU2hhZG93czogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh4ID49IHJlbmRlcmVkQmJveC54MSAmJiB4IDw9IHJlbmRlcmVkQmJveC54Mikge1xuICAgICAgICAgIGlmICh5ID49IHJlbmRlcmVkQmJveC55MSAmJiB5IDw9IHJlbmRlcmVkQmJveC55Mikge1xuICAgICAgICAgICAgcmVzdWx0Tm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHROb2RlcztcbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5kZW11bHRpbWVyaXplQ2xhc3MgPSBmdW5jdGlvbihzYmduY2xhc3MpIHtcbiAgICAgIHJldHVybiBzYmduY2xhc3MucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG1hcFR5cGUgLSB0eXBlIG9mIHRoZSBjdXJyZW50IG1hcCAoUEQsIEFGIG9yIFVua25vd24pXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlID0gZnVuY3Rpb24obWFwVHlwZSl7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLm1hcFR5cGUgPSBtYXBUeXBlO1xuICAgICAgcmV0dXJuIG1hcFR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIC0gbWFwIHR5cGVcbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUgPSBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5tYXBUeXBlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXNldHMgbWFwIHR5cGVcbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2V0TWFwVHlwZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBLZWVwIGNvbnNpc3RlbmN5IG9mIGxpbmtzIHRvIHNlbGYgaW5zaWRlIHRoZSBkYXRhKCkgc3RydWN0dXJlLlxuICAgICAqIFRoaXMgaXMgbmVlZGVkIHdoZW5ldmVyIGEgbm9kZSBjaGFuZ2VzIHBhcmVudHMsIGZvciBleGFtcGxlLFxuICAgICAqIGFzIGl0IGlzIGRlc3Ryb3llZCBhbmQgcmVjcmVhdGVkLiBCdXQgdGhlIGRhdGEoKSBzdGF5cyBpZGVudGljYWwuXG4gICAgICogVGhpcyBjcmVhdGVzIGluY29uc2lzdGVuY2llcyBmb3IgdGhlIHBvaW50ZXJzIHN0b3JlZCBpbiBkYXRhKCksXG4gICAgICogYXMgdGhleSBub3cgcG9pbnQgdG8gYSBkZWxldGVkIG5vZGUuXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5tYWludGFpblBvaW50ZXIgPSBmdW5jdGlvbiAoZWxlcykge1xuICAgICAgZWxlcy5ub2RlcygpLmZvckVhY2goZnVuY3Rpb24oZWxlKXtcbiAgICAgICAgLy8gc2tpcCBub2RlcyB3aXRob3V0IGFueSBhdXhpbGlhcnkgdW5pdHNcbiAgICAgICAgaWYoIWVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpIHx8IGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvcih2YXIgc2lkZSBpbiBlbGUuZGF0YSgnYXV4dW5pdGxheW91dHMnKSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdhdXh1bml0bGF5b3V0cycpW3NpZGVdLnBhcmVudE5vZGUgPSBlbGUuaWQoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IodmFyIGk9MDsgaSA8IGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJylbaV0ucGFyZW50ID0gZWxlLmlkKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50VXRpbGl0aWVzRXh0ZW5kZXI7XG59O1xuIiwiLyogXG4gKiBVdGlsaXR5IGZpbGUgdG8gZ2V0IGFuZCBzZXQgdGhlIGxpYnJhcmllcyB0byB3aGljaCBzYmdudml6IGlzIGRlcGVuZGVudCBmcm9tIGFueSBmaWxlLlxuICovXG5cbnZhciBsaWJVdGlsaXRpZXMgPSBmdW5jdGlvbigpe1xufTtcblxubGliVXRpbGl0aWVzLnNldExpYnMgPSBmdW5jdGlvbihsaWJzKSB7XG4gIHRoaXMubGlicyA9IGxpYnM7XG59O1xuXG5saWJVdGlsaXRpZXMuZ2V0TGlicyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5saWJzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBsaWJVdGlsaXRpZXM7IiwidmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG5cbi8qXG4gKiBUaGUgbWFpbiB1dGlsaXRpZXMgdG8gYmUgZXhwb3NlZCBkaXJlY3RseS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGVsZW1lbnRVdGlsaXRpZXMsIG9wdGlvbnMsIGN5LCBzYmdudml6SW5zdGFuY2U7XG5cbiAgZnVuY3Rpb24gbWFpblV0aWxpdGllcyAocGFyYW0pIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzID0gcGFyYW0uZWxlbWVudFV0aWxpdGllcztcbiAgICBvcHRpb25zID0gcGFyYW0ub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcbiAgICBjeSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRDeSgpO1xuICAgIHNiZ252aXpJbnN0YW5jZSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRJbnN0YW5jZSgpO1xuICB9O1xuXG4gIC8qXG4gICAqIEFkZHMgYSBuZXcgbm9kZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5hZGROb2RlID0gZnVuY3Rpb24oeCwgeSAsIG5vZGVQYXJhbXMsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcbiAgICAvLyB1cGRhdGUgbWFwIHR5cGVcbiAgICBpZiAodHlwZW9mIG5vZGVQYXJhbXMgPT0gJ29iamVjdCcpe1xuXG4gICAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKVxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUobm9kZVBhcmFtcy5sYW5ndWFnZSk7XG4gICAgICBlbHNlIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSAhPSBub2RlUGFyYW1zLmxhbmd1YWdlKVxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJVbmtub3duXCIpO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4LCB5LCBub2RlUGFyYW1zLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIG5ld05vZGUgOiB7XG4gICAgICAgICAgeDogeCxcbiAgICAgICAgICB5OiB5LFxuICAgICAgICAgIGNsYXNzOiBub2RlUGFyYW1zLFxuICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICBwYXJlbnQ6IHBhcmVudCxcbiAgICAgICAgICB2aXNpYmlsaXR5OiB2aXNpYmlsaXR5XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGROb2RlXCIsIHBhcmFtKTtcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogQWRkcyBhIG5ldyBlZGdlIHdpdGggdGhlIGdpdmVuIGNsYXNzIGFuZCBoYXZpbmcgdGhlIGdpdmVuIHNvdXJjZSBhbmQgdGFyZ2V0IGlkcy4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuYWRkRWRnZSA9IGZ1bmN0aW9uKHNvdXJjZSwgdGFyZ2V0LCBlZGdlUGFyYW1zLCBpZCwgdmlzaWJpbGl0eSkge1xuICAgIC8vIHVwZGF0ZSBtYXAgdHlwZVxuICAgIGlmICh0eXBlb2YgZWRnZVBhcmFtcyA9PSAnb2JqZWN0Jyl7XG5cbiAgICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkpXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShlZGdlUGFyYW1zLmxhbmd1YWdlKTtcbiAgICAgIGVsc2UgaWYgKGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpICE9IGVkZ2VQYXJhbXMubGFuZ3VhZ2UpXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShcIlVua25vd25cIik7XG4gICAgfVxuICAgIC8vIEdldCB0aGUgdmFsaWRhdGlvbiByZXN1bHRcbiAgICB2YXIgZWRnZWNsYXNzID0gZWRnZVBhcmFtcy5jbGFzcyA/IGVkZ2VQYXJhbXMuY2xhc3MgOiBlZGdlUGFyYW1zO1xuICAgIHZhciB2YWxpZGF0aW9uID0gZWxlbWVudFV0aWxpdGllcy52YWxpZGF0ZUFycm93RW5kcyhlZGdlY2xhc3MsIGN5LmdldEVsZW1lbnRCeUlkKHNvdXJjZSksIGN5LmdldEVsZW1lbnRCeUlkKHRhcmdldCkpO1xuXG4gICAgLy8gSWYgdmFsaWRhdGlvbiByZXN1bHQgaXMgJ2ludmFsaWQnIGNhbmNlbCB0aGUgb3BlcmF0aW9uXG4gICAgaWYgKHZhbGlkYXRpb24gPT09ICdpbnZhbGlkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIHZhbGlkYXRpb24gcmVzdWx0IGlzICdyZXZlcnNlJyByZXZlcnNlIHRoZSBzb3VyY2UtdGFyZ2V0IHBhaXIgYmVmb3JlIGNyZWF0aW5nIHRoZSBlZGdlXG4gICAgaWYgKHZhbGlkYXRpb24gPT09ICdyZXZlcnNlJykge1xuICAgICAgdmFyIHRlbXAgPSBzb3VyY2U7XG4gICAgICBzb3VyY2UgPSB0YXJnZXQ7XG4gICAgICB0YXJnZXQgPSB0ZW1wO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShzb3VyY2UsIHRhcmdldCwgZWRnZVBhcmFtcywgaWQsIHZpc2liaWxpdHkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgbmV3RWRnZSA6IHtcbiAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICBjbGFzczogZWRnZVBhcmFtcyxcbiAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgdmlzaWJpbGl0eTogdmlzaWJpbGl0eVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkRWRnZVwiLCBwYXJhbSk7XG4gICAgfVxuICB9O1xuXG4gIC8qXG4gICAqIEFkZHMgYSBwcm9jZXNzIHdpdGggY29udmVuaWVudCBlZGdlcy4gRm9yIG1vcmUgaW5mb3JtYXRpb24gcGxlYXNlIHNlZSAnaHR0cHM6Ly9naXRodWIuY29tL2lWaXMtYXQtQmlsa2VudC9uZXd0L2lzc3Vlcy85Jy5cbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMgPSBmdW5jdGlvbihfc291cmNlLCBfdGFyZ2V0LCBwcm9jZXNzVHlwZSkge1xuICAgIC8vIElmIHNvdXJjZSBhbmQgdGFyZ2V0IElEcyBhcmUgZ2l2ZW4gZ2V0IHRoZSBlbGVtZW50cyBieSBJRHNcbiAgICB2YXIgc291cmNlID0gdHlwZW9mIF9zb3VyY2UgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3NvdXJjZSkgOiBfc291cmNlO1xuICAgIHZhciB0YXJnZXQgPSB0eXBlb2YgX3RhcmdldCA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfdGFyZ2V0KSA6IF90YXJnZXQ7XG5cbiAgICAvLyBJZiBzb3VyY2Ugb3IgdGFyZ2V0IGRvZXMgbm90IGhhdmUgYW4gRVBOIGNsYXNzIHRoZSBvcGVyYXRpb24gaXMgbm90IHZhbGlkXG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3Moc291cmNlKSB8fCAhZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKHRhcmdldCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzKF9zb3VyY2UsIF90YXJnZXQsIHByb2Nlc3NUeXBlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIHNvdXJjZTogX3NvdXJjZSxcbiAgICAgICAgdGFyZ2V0OiBfdGFyZ2V0LFxuICAgICAgICBwcm9jZXNzVHlwZTogcHJvY2Vzc1R5cGVcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlc1wiLCBwYXJhbSk7XG4gICAgfVxuICB9O1xuXG4gIC8vIGNvbnZlcnQgY29sbGFwc2VkIGNvbXBvdW5kIG5vZGVzIHRvIHNpbXBsZSBub2Rlc1xuICAvLyBhbmQgdXBkYXRlIHBvcnQgdmFsdWVzIG9mIHBhc3RlZCBub2RlcyBhbmQgZWRnZXNcbiAgdmFyIGNsb25lQ29sbGFwc2VkTm9kZXNBbmRQb3J0cyA9IGZ1bmN0aW9uIChlbGVzQmVmb3JlKXtcbiAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgdmFyIGVsZXNBZnRlciA9IGN5LmVsZW1lbnRzKCk7XG4gICAgdmFyIGVsZXNEaWZmID0gZWxlc0FmdGVyLmRpZmYoZWxlc0JlZm9yZSkubGVmdDtcblxuICAgIC8vIHNoYWxsb3cgY29weSBjb2xsYXBzZWQgbm9kZXMgLSBjb2xsYXBzZWQgY29tcG91bmRzIGJlY29tZSBzaW1wbGUgbm9kZXNcbiAgICAvLyBkYXRhIHJlbGF0ZWQgdG8gY29sbGFwc2VkIG5vZGVzIGFyZSByZW1vdmVkIGZyb20gZ2VuZXJhdGVkIGNsb25lc1xuICAgIC8vIHJlbGF0ZWQgaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvbmV3dC9pc3N1ZXMvMTQ1XG4gICAgdmFyIGNvbGxhcHNlZE5vZGVzID0gZWxlc0RpZmYuZmlsdGVyKCdub2RlLmN5LWV4cGFuZC1jb2xsYXBzZS1jb2xsYXBzZWQtbm9kZScpO1xuXG4gICAgY29sbGFwc2VkTm9kZXMuY29ubmVjdGVkRWRnZXMoKS5yZW1vdmUoKTtcbiAgICBjb2xsYXBzZWROb2Rlcy5yZW1vdmVDbGFzcygnY3ktZXhwYW5kLWNvbGxhcHNlLWNvbGxhcHNlZC1ub2RlJyk7XG4gICAgY29sbGFwc2VkTm9kZXMucmVtb3ZlRGF0YSgnY29sbGFwc2VkQ2hpbGRyZW4nKTtcbiAgICBjb2xsYXBzZWROb2Rlcy5yZW1vdmVEYXRhKCdwb3NpdGlvbi1iZWZvcmUtY29sbGFwc2Ugc2l6ZS1iZWZvcmUtY29sbGFwc2UnKTtcbiAgICBjb2xsYXBzZWROb2Rlcy5yZW1vdmVEYXRhKCdleHBhbmRjb2xsYXBzZVJlbmRlcmVkQ3VlU2l6ZSBleHBhbmRjb2xsYXBzZVJlbmRlcmVkU3RhcnRYIGV4cGFuZGNvbGxhcHNlUmVuZGVyZWRTdGFydFknKTtcblxuICAgIC8vIGNsb25pbmcgcG9ydHNcbiAgICBlbGVzRGlmZi5ub2RlcygpLmZvckVhY2goZnVuY3Rpb24oX25vZGUpe1xuICAgICAgaWYoX25vZGUuZGF0YShcInBvcnRzXCIpLmxlbmd0aCA9PSAyKXtcbiAgICAgICAgICB2YXIgb2xkUG9ydE5hbWUwID0gX25vZGUuZGF0YShcInBvcnRzXCIpWzBdLmlkO1xuICAgICAgICAgIHZhciBvbGRQb3J0TmFtZTEgPSBfbm9kZS5kYXRhKFwicG9ydHNcIilbMV0uaWQ7XG4gICAgICAgICAgX25vZGUuZGF0YShcInBvcnRzXCIpWzBdLmlkID0gX25vZGUuaWQoKSArIFwiLjFcIjtcbiAgICAgICAgICBfbm9kZS5kYXRhKFwicG9ydHNcIilbMV0uaWQgPSBfbm9kZS5pZCgpICsgXCIuMlwiO1xuXG4gICAgICAgICAgX25vZGUub3V0Z29lcnMoKS5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24oX2VkZ2Upe1xuICAgICAgICAgICAgaWYoX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIikgPT0gb2xkUG9ydE5hbWUwKXtcbiAgICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIiwgX25vZGUuZGF0YShcInBvcnRzXCIpWzBdLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIikgPT0gb2xkUG9ydE5hbWUxKXtcbiAgICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIiwgX25vZGUuZGF0YShcInBvcnRzXCIpWzFdLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0c291cmNlXCIsIF9ub2RlLmlkKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIF9ub2RlLmluY29tZXJzKCkuZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKF9lZGdlKXtcbiAgICAgICAgICAgIGlmKF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIpID09IG9sZFBvcnROYW1lMCl7XG4gICAgICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIsIF9ub2RlLmRhdGEoXCJwb3J0c1wiKVswXS5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIpID09IG9sZFBvcnROYW1lMSl7XG4gICAgICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIsIF9ub2RlLmRhdGEoXCJwb3J0c1wiKVsxXS5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiLCBfbm9kZS5pZCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIF9ub2RlLm91dGdvZXJzKCkuZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKF9lZGdlKXtcbiAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiLCBfbm9kZS5pZCgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIF9ub2RlLmluY29tZXJzKCkuZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKF9lZGdlKXtcbiAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiLCBfbm9kZS5pZCgpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZWxlc0RpZmYuc2VsZWN0KCk7XG4gIH1cblxuICAvKlxuICAgKiBDbG9uZSBnaXZlbiBlbGVtZW50cy4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNsb25lRWxlbWVudHMgPSBmdW5jdGlvbiAoZWxlcykge1xuICAgIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgZWxlc0JlZm9yZSA9IGN5LmVsZW1lbnRzKCk7XG5cbiAgICB2YXIgY2IgPSBjeS5jbGlwYm9hcmQoKTtcbiAgICB2YXIgX2lkID0gY2IuY29weShlbGVzLCBcImNsb25lT3BlcmF0aW9uXCIpO1xuXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJwYXN0ZVwiLCB7aWQ6IF9pZH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNiLnBhc3RlKF9pZCk7XG4gICAgfVxuICAgIGNsb25lQ29sbGFwc2VkTm9kZXNBbmRQb3J0cyhlbGVzQmVmb3JlKTtcbiAgfTtcblxuICAvKlxuICAgKiBDb3B5IGdpdmVuIGVsZW1lbnRzIHRvIGNsaXBib2FyZC4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNvcHlFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgY3kuY2xpcGJvYXJkKCkuY29weShlbGVzKTtcbiAgfTtcblxuICAvKlxuICAgKiBQYXN0IHRoZSBlbGVtZW50cyBjb3BpZWQgdG8gY2xpcGJvYXJkLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMucGFzdGVFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbGVzQmVmb3JlID0gY3kuZWxlbWVudHMoKTtcblxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwicGFzdGVcIik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY3kuY2xpcGJvYXJkKCkucGFzdGUoKTtcbiAgICB9XG4gICAgY2xvbmVDb2xsYXBzZWROb2Rlc0FuZFBvcnRzKGVsZXNCZWZvcmUpO1xuICB9O1xuXG4gIC8qXG4gICAqIEFsaWducyBnaXZlbiBub2RlcyBpbiBnaXZlbiBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBvcmRlci5cbiAgICogSG9yaXpvbnRhbCBhbmQgdmVydGljYWwgcGFyYW1ldGVycyBtYXkgYmUgJ25vbmUnIG9yIHVuZGVmaW5lZC5cbiAgICogYWxpZ25UbyBwYXJhbWV0ZXIgaW5kaWNhdGVzIHRoZSBsZWFkaW5nIG5vZGUuXG4gICAqIFJlcXVyaXJlcyBjeXRvc2NhcGUtZ3JpZC1ndWlkZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmFsaWduID0gZnVuY3Rpb24gKG5vZGVzLCBob3Jpem9udGFsLCB2ZXJ0aWNhbCwgYWxpZ25Ubykge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImFsaWduXCIsIHtcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBob3Jpem9udGFsOiBob3Jpem9udGFsLFxuICAgICAgICB2ZXJ0aWNhbDogdmVydGljYWwsXG4gICAgICAgIGFsaWduVG86IGFsaWduVG9cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2Rlcy5hbGlnbihob3Jpem9udGFsLCB2ZXJ0aWNhbCwgYWxpZ25Ubyk7XG4gICAgfVxuICB9O1xuXG4gIC8qXG4gICAqIENyZWF0ZSBjb21wb3VuZCBmb3IgZ2l2ZW4gbm9kZXMuIGNvbXBvdW5kVHlwZSBtYXkgYmUgJ2NvbXBsZXgnIG9yICdjb21wYXJ0bWVudCcuXG4gICAqIFRoaXMgbWV0aG9kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChfbm9kZXMsIGNvbXBvdW5kVHlwZSkge1xuICAgIHZhciBub2RlcyA9IF9ub2RlcztcbiAgICAvKlxuICAgICAqIEVsZW1pbmF0ZSB0aGUgbm9kZXMgd2hpY2ggY2Fubm90IGhhdmUgYSBwYXJlbnQgd2l0aCBnaXZlbiBjb21wb3VuZCB0eXBlXG4gICAgICovXG4gICAgbm9kZXMgPSBfbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XG4gICAgICBpZih0eXBlb2YgZWxlbWVudCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBlbGVtZW50ID0gaTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNiZ25jbGFzcyA9IGVsZW1lbnQuZGF0YShcImNsYXNzXCIpO1xuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNWYWxpZFBhcmVudChzYmduY2xhc3MsIGNvbXBvdW5kVHlwZSwgZWxlbWVudCk7XG4gICAgfSk7XG5cbiAgICBub2RlcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcblxuICAgIC8vIEFsbCBlbGVtZW50cyBzaG91bGQgaGF2ZSB0aGUgc2FtZSBwYXJlbnQgYW5kIHRoZSBjb21tb24gcGFyZW50IHNob3VsZCBub3QgYmUgYSAnY29tcGxleCdcbiAgICAvLyBpZiBjb21wb3VuZFR5cGUgaXMgJ2NvbXBhcnRlbnQnXG4gICAgLy8gYmVjYXVzZSB0aGUgb2xkIGNvbW1vbiBwYXJlbnQgd2lsbCBiZSB0aGUgcGFyZW50IG9mIHRoZSBuZXcgY29tcGFydG1lbnQgYWZ0ZXIgdGhpcyBvcGVyYXRpb24gYW5kXG4gICAgLy8gJ2NvbXBsZXhlcycgY2Fubm90IGluY2x1ZGUgJ2NvbXBhcnRtZW50cydcbiAgICBpZiAobm9kZXMubGVuZ3RoID09IDAgfHwgIWVsZW1lbnRVdGlsaXRpZXMuYWxsSGF2ZVRoZVNhbWVQYXJlbnQobm9kZXMpXG4gICAgICAgICAgICB8fCAoIChjb21wb3VuZFR5cGUgPT09ICdjb21wYXJ0bWVudCcgfHwgY29tcG91bmRUeXBlID09ICdzdWJtYXAnKSAmJiBub2Rlcy5wYXJlbnQoKS5kYXRhKCdjbGFzcycpXG4gICAgICAgICAgICAmJiBub2Rlcy5wYXJlbnQoKS5kYXRhKCdjbGFzcycpLnN0YXJ0c1dpdGgoJ2NvbXBsZXgnKSApKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGN5LnVuZG9SZWRvKCkpIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgY29tcG91bmRUeXBlOiBjb21wb3VuZFR5cGUsXG4gICAgICAgIG5vZGVzVG9NYWtlQ29tcG91bmQ6IG5vZGVzXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzXCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyhub2RlcywgY29tcG91bmRUeXBlKTtcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXG4gICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24gYW5kIGNoZWNrcyBpZiB0aGUgb3BlcmF0aW9uIGlzIHZhbGlkLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VQYXJlbnQgPSBmdW5jdGlvbihub2RlcywgX25ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XG4gICAgdmFyIG5ld1BhcmVudCA9IHR5cGVvZiBfbmV3UGFyZW50ID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9uZXdQYXJlbnQpIDogX25ld1BhcmVudDtcbiAgICAvLyBOZXcgcGFyZW50IGlzIHN1cHBvc2VkIHRvIGJlIG9uZSBvZiB0aGUgcm9vdCwgYSBjb21wbGV4IG9yIGEgY29tcGFydG1lbnRcbiAgICBpZiAobmV3UGFyZW50ICYmICFuZXdQYXJlbnQuZGF0YShcImNsYXNzXCIpLnN0YXJ0c1dpdGgoXCJjb21wbGV4XCIpICYmIG5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikgIT0gXCJjb21wYXJ0bWVudFwiXG4gICAgICAgICAgICAmJiBuZXdQYXJlbnQuZGF0YShcImNsYXNzXCIpICE9IFwic3VibWFwXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLypcbiAgICAgKiBFbGVtaW5hdGUgdGhlIG5vZGVzIHdoaWNoIGNhbm5vdCBoYXZlIHRoZSBuZXdQYXJlbnQgYXMgdGhlaXIgcGFyZW50XG4gICAgICovXG4gICAgbm9kZXMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGVsZW1lbnQsIGkpIHtcbiAgICAgIGlmKHR5cGVvZiBlbGVtZW50ID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIGVsZW1lbnQgPSBpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2JnbmNsYXNzID0gZWxlbWVudC5kYXRhKFwiY2xhc3NcIik7XG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc1ZhbGlkUGFyZW50KHNiZ25jbGFzcywgbmV3UGFyZW50LCBlbGVtZW50KTtcbiAgICB9KTtcblxuICAgIC8vIERpc2NhcmQgdGhlIG5vZGVzIHdob3NlIHBhcmVudCBpcyBhbHJlYWR5IG5ld1BhcmVudC5cbiAgICAvLyBEaXNjYXJkIHRoZSBuZXdQYXJlbnQgaXRzZWxmIGlmIGl0IGlzIGFtb25nIHRoZSBub2Rlc1xuICAgIG5vZGVzID0gbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGUsIGkpIHtcbiAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgZWxlID0gaTtcbiAgICAgIH1cblxuICAgICAgLy8gRGlzY2FyZCB0aGUgbmV3UGFyZW50IGlmIGl0IGlzIGFtb25nIHRoZSBub2Rlc1xuICAgICAgaWYgKG5ld1BhcmVudCAmJiBlbGUuaWQoKSA9PT0gbmV3UGFyZW50LmlkKCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gRGlzY2FyZCB0aGUgbm9kZXMgd2hvc2UgcGFyZW50IGlzIGFscmVhZHkgbmV3UGFyZW50XG4gICAgICBpZiAoIW5ld1BhcmVudCkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ3BhcmVudCcpICE9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gZWxlLmRhdGEoJ3BhcmVudCcpICE9PSBuZXdQYXJlbnQuaWQoKTtcbiAgICB9KTtcblxuICAgIC8vIElmIHNvbWUgbm9kZXMgYXJlIGFuY2VzdG9yIG9mIG5ldyBwYXJlbnQgZWxlbWluYXRlIHRoZW1cbiAgICBpZiAobmV3UGFyZW50KSB7XG4gICAgICBub2RlcyA9IG5vZGVzLmRpZmZlcmVuY2UobmV3UGFyZW50LmFuY2VzdG9ycygpKTtcbiAgICB9XG5cbiAgICAvLyBJZiBhbGwgbm9kZXMgYXJlIGVsZW1pbmF0ZWQgcmV0dXJuIGRpcmVjdGx5XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEp1c3QgbW92ZSB0aGUgdG9wIG1vc3Qgbm9kZXNcbiAgICBub2RlcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcblxuICAgIHZhciBwYXJlbnRJZCA9IG5ld1BhcmVudCA/IG5ld1BhcmVudC5pZCgpIDogbnVsbDtcblxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZSxcbiAgICAgICAgcGFyZW50RGF0YTogcGFyZW50SWQsIC8vIEl0IGtlZXBzIHRoZSBuZXdQYXJlbnRJZCAoSnVzdCBhbiBpZCBmb3IgZWFjaCBub2RlcyBmb3IgdGhlIGZpcnN0IHRpbWUpXG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgcG9zRGlmZlg6IHBvc0RpZmZYLFxuICAgICAgICBwb3NEaWZmWTogcG9zRGlmZlksXG4gICAgICAgIC8vIFRoaXMgaXMgbmVlZGVkIGJlY2F1c2UgdGhlIGNoYW5nZVBhcmVudCBmdW5jdGlvbiBjYWxsZWQgaXMgbm90IGZyb20gZWxlbWVudFV0aWxpdGllc1xuICAgICAgICAvLyBidXQgZnJvbSB0aGUgdW5kb1JlZG8gZXh0ZW5zaW9uIGRpcmVjdGx5LCBzbyBtYWludGFpbmluZyBwb2ludGVyIGlzIG5vdCBhdXRvbWF0aWNhbGx5IGRvbmUuXG4gICAgICAgIGNhbGxiYWNrOiBlbGVtZW50VXRpbGl0aWVzLm1haW50YWluUG9pbnRlclxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZVBhcmVudFwiLCBwYXJhbSk7IC8vIFRoaXMgYWN0aW9uIGlzIHJlZ2lzdGVyZWQgYnkgdW5kb1JlZG8gZXh0ZW5zaW9uXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQobm9kZXMsIHBhcmVudElkLCBwb3NEaWZmWCwgcG9zRGlmZlkpO1xuICAgIH1cbiAgfTtcblxuICAvKlxuICAgKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcbiAgICogaW4gdGhlIGNvbXBsZXguIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSB0aGUgc2FtZSBmdW5jdGlvbiBpbiBlbGVtZW50VXRpbGl0aWVzXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAodGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCkge1xuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uKHRlbXBsYXRlVHlwZSwgbWFjcm9tb2xlY3VsZUxpc3QsIGNvbXBsZXhOYW1lLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgdGVtcGxhdGVUeXBlOiB0ZW1wbGF0ZVR5cGUsXG4gICAgICAgIG1hY3JvbW9sZWN1bGVMaXN0OiBtYWNyb21vbGVjdWxlTGlzdCxcbiAgICAgICAgY29tcGxleE5hbWU6IGNvbXBsZXhOYW1lLFxuICAgICAgICBwcm9jZXNzUG9zaXRpb246IHByb2Nlc3NQb3NpdGlvbixcbiAgICAgICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXG4gICAgICAgIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCxcbiAgICAgICAgZWRnZUxlbmd0aDogZWRnZUxlbmd0aFxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZVRlbXBsYXRlUmVhY3Rpb25cIiwgcGFyYW0pO1xuICAgIH1cbiAgfTtcblxuICAvKlxuICAgKiBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuXG4gICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24obm9kZXMsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgdXNlQXNwZWN0UmF0aW86IHVzZUFzcGVjdFJhdGlvLFxuICAgICAgICBwZXJmb3JtT3BlcmF0aW9uOiB0cnVlXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwicmVzaXplTm9kZXNcIiwgcGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMobm9kZXMsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIC8qXG4gICAqIENoYW5nZXMgdGhlIGxhYmVsIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gbGFiZWwuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uKG5vZGVzLCBsYWJlbCkge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIG5vZGVzLmRhdGEoJ2xhYmVsJywgbGFiZWwpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZU5vZGVMYWJlbFwiLCBwYXJhbSk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuICAvKlxuICAgKiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIGZvciBnaXZlbiBub2RlcyB1c2UgdGhlIGdpdmVuIGZvbnQgZGF0YS5cbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbihlbGVzLCBkYXRhKSB7XG4gICAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgZWxlczogZWxlcyxcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgcGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgZGF0YSk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuICAvKlxuICAgKiBDaGFuZ2Ugc3RhdGUgdmFsdWUgb3IgdW5pdCBvZiBpbmZvcm1hdGlvbiBib3ggb2YgZ2l2ZW4gbm9kZXMgd2l0aCBnaXZlbiBpbmRleC5cbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHBhcmFtZXRlcnMgc2VlIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3hcbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgbm9kZXM6IG5vZGVzXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94KG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cbiAgLy8gQWRkIGEgbmV3IHN0YXRlIG9yIGluZm8gYm94IHRvIGdpdmVuIG5vZGVzLlxuICAvLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxuICAvLyBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICBtYWluVXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24obm9kZXMsIG9iaikge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBvYmo6IG9iaixcbiAgICAgICAgbm9kZXM6IG5vZGVzXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cbiAgLy8gUmVtb3ZlIHRoZSBzdGF0ZSBvciBpbmZvIGJveGVzIG9mIHRoZSBnaXZlbiBub2RlcyBhdCBnaXZlbiBpbmRleC5cbiAgLy8gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgbWFpblV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uKG5vZGVzLCBpbmRleCkge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3gobm9kZXMsIHtpbmRleDogaW5kZXh9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGxvY2F0aW9uT2JqOiB7aW5kZXg6IGluZGV4fSxcbiAgICAgICAgbm9kZXM6IG5vZGVzXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwicmVtb3ZlU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cbiAgLypcbiAgICogU2V0IG11bHRpbWVyIHN0YXR1cyBvZiB0aGUgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMgPSBmdW5jdGlvbihub2Rlcywgc3RhdHVzKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInNldE11bHRpbWVyU3RhdHVzXCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cbiAgLypcbiAgICogU2V0IGNsb25lIG1hcmtlciBzdGF0dXMgb2YgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbihub2Rlcywgc3RhdHVzKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInNldENsb25lTWFya2VyU3RhdHVzXCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cbiAgLypcbiAgICogQ2hhbmdlIHN0eWxlL2NzcyBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXG4gICAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VDc3MgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICAgIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VDc3MoZWxlcywgbmFtZSwgdmFsdWVNYXApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgZWxlczogZWxlcyxcbiAgICAgICAgdmFsdWVNYXA6IHZhbHVlTWFwLFxuICAgICAgICBuYW1lOiBuYW1lXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlQ3NzXCIsIHBhcmFtKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIC8qXG4gICAqIENoYW5nZSBkYXRhIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAgICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNoYW5nZURhdGEgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICAgIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVsZXMsIG5hbWUsIHZhbHVlTWFwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGVsZXM6IGVsZXMsXG4gICAgICAgIHZhbHVlTWFwOiB2YWx1ZU1hcCxcbiAgICAgICAgbmFtZTogbmFtZVxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZURhdGFcIiwgcGFyYW0pO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cblxuICAvKlxuICAgKiBIaWRlcyBnaXZlbiBlbGVzICh0aGUgb25lcyB3aGljaCBhcmUgc2VsZWN0ZWQpIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXG4gICAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmhpZGVBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcbiAgICAgIHZhciBub2RlcyA9IGVsZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcblxuICAgICAgdmFyIGFsbE5vZGVzID0gY3kubm9kZXMoXCI6dmlzaWJsZVwiKTtcbiAgICAgIHZhciBub2Rlc1RvU2hvdyA9IGVsZW1lbnRVdGlsaXRpZXMuZXh0ZW5kUmVtYWluaW5nTm9kZXMobm9kZXMsIGFsbE5vZGVzKTtcbiAgICAgIHZhciBub2Rlc1RvSGlkZSA9IGFsbE5vZGVzLm5vdChub2Rlc1RvU2hvdyk7XG5cbiAgICAgIGlmIChub2Rlc1RvSGlkZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuXG4gICAgICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCc6dmlzaWJsZScpO1xuICAgICAgICAgIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyKG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yKTtcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmhpZGVBbmRQZXJmb3JtTGF5b3V0KG5vZGVzVG9IaWRlLCBsYXlvdXRwYXJhbSk7XG4gICAgICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCc6dmlzaWJsZScpO1xuICAgICAgICAgIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyKG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgICAgICAgZWxlczogbm9kZXNUb0hpZGUsXG4gICAgICAgICAgICAgIGxheW91dHBhcmFtOiBsYXlvdXRwYXJhbSxcbiAgICAgICAgICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHZhciB1ciA9IGN5LnVuZG9SZWRvKCk7XG4gICAgICAgICAgdXIuYWN0aW9uKFwidGhpY2tlbkJvcmRlclwiLCBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlciwgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIpO1xuICAgICAgICAgIHVyLmFjdGlvbihcInRoaW5Cb3JkZXJcIiwgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIsIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyKTtcblxuICAgICAgICAgIHZhciBhY3Rpb25zID0gW107XG4gICAgICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCkuaW50ZXJzZWN0aW9uKG5vZGVzVG9IaWRlKTtcbiAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwidGhpbkJvcmRlclwiLCBwYXJhbTogbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3J9KTtcbiAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwiaGlkZUFuZFBlcmZvcm1MYXlvdXRcIiwgcGFyYW06IHBhcmFtfSk7XG4gICAgICAgICAgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBub2Rlc1RvSGlkZS5uZWlnaGJvcmhvb2QoXCI6dmlzaWJsZVwiKS5ub2RlcygpLmRpZmZlcmVuY2Uobm9kZXNUb0hpZGUpLmRpZmZlcmVuY2UoY3kubm9kZXMoXCJbdGhpY2tCb3JkZXJdXCIpKTtcbiAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwidGhpY2tlbkJvcmRlclwiLCBwYXJhbTogbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3J9KTtcbiAgICAgICAgICBjeS51bmRvUmVkbygpLmRvKFwiYmF0Y2hcIiwgYWN0aW9ucyk7XG4gICAgICB9XG4gIH07XG5cbiAgLypcbiAgICogU2hvd3MgYWxsIGVsZW1lbnRzICh0aGUgb25lcyB3aGljaCBhcmUgaGlkZGVuIGlmIGFueSkgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcbiAgICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuc2hvd0FsbEFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihsYXlvdXRwYXJhbSkge1xuICAgIHZhciBoaWRkZW5FbGVzID0gY3kuZWxlbWVudHMoJzpoaWRkZW4nKTtcbiAgICBpZiAoaGlkZGVuRWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoJzp2aXNpYmxlJyk7XG4gICAgICBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlcihub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcik7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0KGhpZGRlbkVsZXMsIGxheW91dHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGVsZXM6IGhpZGRlbkVsZXMsXG4gICAgICAgIGxheW91dHBhcmFtOiBsYXlvdXRwYXJhbSxcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgICB9O1xuXG4gICAgICB2YXIgdXIgPSBjeS51bmRvUmVkbygpO1xuICAgICAgdXIuYWN0aW9uKFwidGhpY2tlbkJvcmRlclwiLCBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlciwgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIpO1xuICAgICAgdXIuYWN0aW9uKFwidGhpbkJvcmRlclwiLCBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlciwgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIpO1xuXG4gICAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kubm9kZXMoXCJbdGhpY2tCb3JkZXJdXCIpO1xuICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInRoaW5Cb3JkZXJcIiwgcGFyYW06IG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yfSk7XG4gICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwic2hvd0FuZFBlcmZvcm1MYXlvdXRcIiwgcGFyYW06IHBhcmFtfSk7XG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYmF0Y2hcIiwgYWN0aW9ucyk7XG4gICAgfVxuICB9O1xuXG4gIC8qXG4gICAqIFVuaGlkZSBnaXZlbiBlbGVzICh0aGUgb25lcyB3aGljaCBhcmUgaGlkZGVuIGlmIGFueSkgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcbiAgICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihtYWluRWxlLCBlbGVzLCBsYXlvdXRwYXJhbSkge1xuICAgICAgdmFyIGhpZGRlbkVsZXMgPSBlbGVzLmZpbHRlcignOmhpZGRlbicpO1xuICAgICAgaWYgKGhpZGRlbkVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbWFpblV0aWxpdGllcy5jbG9zZVVwRWxlbWVudHMobWFpbkVsZSwgaGlkZGVuRWxlcy5ub2RlcygpKTtcbiAgICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5jb25uZWN0ZWROb2RlcygnOnZpc2libGUnKTtcbiAgICAgICAgICBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlcihub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcik7XG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dChoaWRkZW5FbGVzLCBsYXlvdXRwYXJhbSk7XG4gICAgICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCc6dmlzaWJsZScpO1xuICAgICAgICAgIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyKG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgICAgICAgZWxlczogaGlkZGVuRWxlcyxcbiAgICAgICAgICAgICAgbGF5b3V0cGFyYW06IGxheW91dHBhcmFtLFxuICAgICAgICAgICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIHVyID0gY3kudW5kb1JlZG8oKTtcbiAgICAgICAgICB1ci5hY3Rpb24oXCJ0aGlja2VuQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlcik7XG4gICAgICAgICAgdXIuYWN0aW9uKFwidGhpbkJvcmRlclwiLCBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlciwgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIpO1xuXG4gICAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgICAgICB2YXIgbm9kZXNUb1RoaW5Cb3JkZXIgPSAoaGlkZGVuRWxlcy5uZWlnaGJvcmhvb2QoXCI6dmlzaWJsZVwiKS5ub2RlcyhcIlt0aGlja0JvcmRlcl1cIikpXG4gICAgICAgICAgICAgICAgICAuZGlmZmVyZW5jZShjeS5lZGdlcyhcIjpoaWRkZW5cIikuZGlmZmVyZW5jZShoaWRkZW5FbGVzLmVkZ2VzKCkudW5pb24oaGlkZGVuRWxlcy5ub2RlcygpLmNvbm5lY3RlZEVkZ2VzKCkpKS5jb25uZWN0ZWROb2RlcygpKTtcbiAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwidGhpbkJvcmRlclwiLCBwYXJhbTogbm9kZXNUb1RoaW5Cb3JkZXJ9KTtcbiAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwic2hvd0FuZFBlcmZvcm1MYXlvdXRcIiwgcGFyYW06IHBhcmFtfSk7XG4gICAgICAgICAgdmFyIG5vZGVzVG9UaGlja2VuQm9yZGVyID0gaGlkZGVuRWxlcy5ub2RlcygpLmVkZ2VzV2l0aChjeS5ub2RlcyhcIjpoaWRkZW5cIikuZGlmZmVyZW5jZShoaWRkZW5FbGVzLm5vZGVzKCkpKVxuICBcdCAgICAgICAgICAgIC5jb25uZWN0ZWROb2RlcygpLmludGVyc2VjdGlvbihoaWRkZW5FbGVzLm5vZGVzKCkpO1xuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGlja2VuQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1RvVGhpY2tlbkJvcmRlcn0pO1xuICAgICAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJiYXRjaFwiLCBhY3Rpb25zKTtcbiAgICAgIH1cbiAgfTtcblxuICAvKlxuICAqIFRha2VzIHRoZSBoaWRkZW4gZWxlbWVudHMgY2xvc2UgdG8gdGhlIG5vZGVzIHdob3NlIG5laWdoYm9ycyB3aWxsIGJlIHNob3duXG4gICogKi9cbiAgbWFpblV0aWxpdGllcy5jbG9zZVVwRWxlbWVudHMgPSBmdW5jdGlvbihtYWluRWxlLCBoaWRkZW5FbGVzKSB7XG4gICAgICB2YXIgbGVmdFggPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgdmFyIHJpZ2h0WCA9IE51bWJlci5NSU5fVkFMVUU7XG4gICAgICB2YXIgdG9wWSA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICB2YXIgYm90dG9tWSA9IE51bWJlci5NSU5fVkFMVUU7XG4gICAgICAvLyBDaGVjayB0aGUgeCBhbmQgeSBsaW1pdHMgb2YgYWxsIGhpZGRlbiBlbGVtZW50cyBhbmQgc3RvcmUgdGhlbSBpbiB0aGUgdmFyaWFibGVzIGFib3ZlXG4gICAgICBoaWRkZW5FbGVzLmZvckVhY2goZnVuY3Rpb24oIGVsZSApe1xuICAgICAgICAgIGlmIChlbGUuZGF0YSgnY2xhc3MnKSAhPSAnY29tcGFydG1lbnQnICYmICBlbGUuZGF0YSgnY2xhc3MnKSAhPSAnY29tcGxleCcpXG4gICAgICAgICAge1xuICAgICAgICAgICAgICB2YXIgaGFsZldpZHRoID0gZWxlLm91dGVyV2lkdGgoKS8yO1xuICAgICAgICAgICAgICB2YXIgaGFsZkhlaWdodCA9IGVsZS5vdXRlckhlaWdodCgpLzI7XG4gICAgICAgICAgICAgIGlmIChlbGUucG9zaXRpb24oXCJ4XCIpIC0gaGFsZldpZHRoIDwgbGVmdFgpXG4gICAgICAgICAgICAgICAgICBsZWZ0WCA9IGVsZS5wb3NpdGlvbihcInhcIikgLSBoYWxmV2lkdGg7XG4gICAgICAgICAgICAgIGlmIChlbGUucG9zaXRpb24oXCJ4XCIpICsgaGFsZldpZHRoID4gcmlnaHRYKVxuICAgICAgICAgICAgICAgICAgcmlnaHRYID0gZWxlLnBvc2l0aW9uKFwieFwiKSArIGhhbGZXaWR0aDtcbiAgICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInlcIikgLSBoYWxmSGVpZ2h0IDwgdG9wWSlcbiAgICAgICAgICAgICAgICAgIHRvcFkgPSBlbGUucG9zaXRpb24oXCJ5XCIpIC0gaGFsZkhlaWdodDtcbiAgICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInlcIikgKyBoYWxmSGVpZ2h0ID4gdG9wWSlcbiAgICAgICAgICAgICAgICAgIGJvdHRvbVkgPSBlbGUucG9zaXRpb24oXCJ5XCIpICsgaGFsZkhlaWdodDtcbiAgICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy9UaGUgY29vcmRpbmF0ZXMgb2YgdGhlIG9sZCBjZW50ZXIgY29udGFpbmluZyB0aGUgaGlkZGVuIG5vZGVzXG4gICAgICB2YXIgb2xkQ2VudGVyWCA9IChsZWZ0WCArIHJpZ2h0WCkvMjtcbiAgICAgIHZhciBvbGRDZW50ZXJZID0gKHRvcFkgKyBib3R0b21ZKS8yO1xuXG4gICAgICAvL0hlcmUgd2UgY2FsY3VsYXRlIHR3byBwYXJhbWV0ZXJzIHdoaWNoIGRlZmluZSB0aGUgYXJlYSBpbiB3aGljaCB0aGUgaGlkZGVuIGVsZW1lbnRzIGFyZSBwbGFjZWQgaW5pdGlhbGx5XG4gICAgICB2YXIgbWluSG9yaXpvbnRhbFBhcmFtID0gbWFpbkVsZS5vdXRlcldpZHRoKCkvMiArIChyaWdodFggLSBsZWZ0WCkvMjtcbiAgICAgIHZhciBtYXhIb3Jpem9udGFsUGFyYW0gPSBtYWluRWxlLm91dGVyV2lkdGgoKSArIChyaWdodFggLSBsZWZ0WCkvMjtcbiAgICAgIHZhciBtaW5WZXJ0aWNhbFBhcmFtID0gbWFpbkVsZS5vdXRlckhlaWdodCgpLzIgKyAoYm90dG9tWSAtIHRvcFkpLzI7XG4gICAgICB2YXIgbWF4VmVydGljYWxQYXJhbSA9IG1haW5FbGUub3V0ZXJIZWlnaHQoKSArIChib3R0b21ZIC0gdG9wWSkvMjtcblxuICAgICAgLy9RdWFkcmFudHMgaXMgYW4gb2JqZWN0IG9mIHRoZSBmb3JtIHtmaXJzdDpcIm9idGFpbmVkXCIsIHNlY29uZDpcImZyZWVcIiwgdGhpcmQ6XCJmcmVlXCIsIGZvdXJ0aDpcIm9idGFpbmVkXCJ9XG4gICAgICAvLyB3aGljaCBob2xkcyB3aGljaCBxdWFkcmFudCBhcmUgZnJlZSAodGhhdCdzIHdoZXJlIGhpZGRlbiBub2RlcyB3aWxsIGJlIGJyb3VnaHQpXG4gICAgICB2YXIgcXVhZHJhbnRzID0gbWFpblV0aWxpdGllcy5jaGVja09jY3VwaWVkUXVhZHJhbnRzKG1haW5FbGUsIGhpZGRlbkVsZXMpO1xuICAgICAgdmFyIGZyZWVRdWFkcmFudHMgPSBbXTtcbiAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHF1YWRyYW50cykge1xuICAgICAgICAgIGlmIChxdWFkcmFudHNbcHJvcGVydHldID09PSBcImZyZWVcIilcbiAgICAgICAgICAgICAgZnJlZVF1YWRyYW50cy5wdXNoKHByb3BlcnR5KTtcbiAgICAgIH1cblxuICAgICAgLy9DYW4gdGFrZSB2YWx1ZXMgMSBhbmQgLTEgYW5kIGFyZSB1c2VkIHRvIHBsYWNlIHRoZSBoaWRkZW4gbm9kZXMgaW4gdGhlIHJhbmRvbSBxdWFkcmFudFxuICAgICAgdmFyIGhvcml6b250YWxNdWx0O1xuICAgICAgdmFyIHZlcnRpY2FsTXVsdDtcbiAgICAgIGlmIChmcmVlUXVhZHJhbnRzLmxlbmd0aCA+IDApXG4gICAgICB7XG4gICAgICAgIGlmIChmcmVlUXVhZHJhbnRzLmxlbmd0aCA9PT0gMylcbiAgICAgICAge1xuICAgICAgICAgIGlmIChmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmaXJzdCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ3NlY29uZCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ3RoaXJkJykpXG4gICAgICAgICAge1xuICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAtMTtcbiAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IC0xO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmaXJzdCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ3NlY29uZCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZvdXJ0aCcpKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gMTtcbiAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IC0xO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmaXJzdCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ3RoaXJkJykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnZm91cnRoJykpXG4gICAgICAgICAge1xuICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAxO1xuICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnc2Vjb25kJykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygndGhpcmQnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmb3VydGgnKSlcbiAgICAgICAgICB7XG4gICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IC0xO1xuICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgLy9SYW5kb21seSBwaWNrcyBvbmUgcXVhZHJhbnQgZnJvbSB0aGUgZnJlZSBxdWFkcmFudHNcbiAgICAgICAgICB2YXIgcmFuZG9tUXVhZHJhbnQgPSBmcmVlUXVhZHJhbnRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpmcmVlUXVhZHJhbnRzLmxlbmd0aCldO1xuXG4gICAgICAgICAgaWYgKHJhbmRvbVF1YWRyYW50ID09PSBcImZpcnN0XCIpIHtcbiAgICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAxO1xuICAgICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAtMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAocmFuZG9tUXVhZHJhbnQgPT09IFwic2Vjb25kXCIpIHtcbiAgICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAtMTtcbiAgICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gLTE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKHJhbmRvbVF1YWRyYW50ID09PSBcInRoaXJkXCIpIHtcbiAgICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAtMTtcbiAgICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAocmFuZG9tUXVhZHJhbnQgPT09IFwiZm91cnRoXCIpIHtcbiAgICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAxO1xuICAgICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gMDtcbiAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAwO1xuICAgICAgfVxuICAgICAgLy8gSWYgdGhlIGhvcml6b250YWxNdWx0IGlzIDAgaXQgbWVhbnMgdGhhdCBubyBxdWFkcmFudCBpcyBmcmVlLCBzbyB3ZSByYW5kb21seSBjaG9vc2UgYSBxdWFkcmFudFxuICAgICAgdmFyIGhvcml6b250YWxQYXJhbSA9IG1haW5VdGlsaXRpZXMuZ2VuZXJhdGVSYW5kb20obWluSG9yaXpvbnRhbFBhcmFtLG1heEhvcml6b250YWxQYXJhbSxob3Jpem9udGFsTXVsdCk7XG4gICAgICB2YXIgdmVydGljYWxQYXJhbSA9IG1haW5VdGlsaXRpZXMuZ2VuZXJhdGVSYW5kb20obWluVmVydGljYWxQYXJhbSxtYXhWZXJ0aWNhbFBhcmFtLHZlcnRpY2FsTXVsdCk7XG5cbiAgICAgIC8vVGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBjZW50ZXIgd2hlcmUgdGhlIGhpZGRlbiBub2RlcyB3aWxsIGJlIHRyYW5zZmVyZWRcbiAgICAgIHZhciBuZXdDZW50ZXJYID0gbWFpbkVsZS5wb3NpdGlvbihcInhcIikgKyBob3Jpem9udGFsUGFyYW07XG4gICAgICB2YXIgbmV3Q2VudGVyWSA9IG1haW5FbGUucG9zaXRpb24oXCJ5XCIpICsgdmVydGljYWxQYXJhbTtcblxuICAgICAgdmFyIHhkaWZmID0gbmV3Q2VudGVyWCAtIG9sZENlbnRlclg7XG4gICAgICB2YXIgeWRpZmYgPSBuZXdDZW50ZXJZIC0gb2xkQ2VudGVyWTtcblxuICAgICAgLy9DaGFuZ2UgdGhlIHBvc2l0aW9uIG9mIGhpZGRlbiBlbGVtZW50c1xuICAgICAgaGlkZGVuRWxlcy5mb3JFYWNoKGZ1bmN0aW9uKCBlbGUgKXtcbiAgICAgICAgICB2YXIgbmV3eCA9IGVsZS5wb3NpdGlvbihcInhcIikgKyB4ZGlmZjtcbiAgICAgICAgICB2YXIgbmV3eSA9IGVsZS5wb3NpdGlvbihcInlcIikgKyB5ZGlmZjtcbiAgICAgICAgICBlbGUucG9zaXRpb24oXCJ4XCIsIG5ld3gpO1xuICAgICAgICAgIGVsZS5wb3NpdGlvbihcInlcIixuZXd5KTtcbiAgICAgIH0pO1xuICB9O1xuXG4gIC8qXG4gICAqIEdlbmVyYXRlcyBhIG51bWJlciBiZXR3ZWVuIDIgbnIgYW5kIG11bHRpbXBsaWVzIGl0IHdpdGggMSBvciAtMVxuICAgKiAqL1xuICBtYWluVXRpbGl0aWVzLmdlbmVyYXRlUmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgsIG11bHQpIHtcbiAgICAgIHZhciB2YWwgPSBbLTEsMV07XG4gICAgICBpZiAobXVsdCA9PT0gMClcbiAgICAgICAgICBtdWx0ID0gdmFsW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSp2YWwubGVuZ3RoKV07XG4gICAgICByZXR1cm4gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW4pICogbXVsdDtcbiAgfTtcblxuICAvKlxuICAgKiBUaGlzIGZ1bmN0aW9uIG1ha2VzIHN1cmUgdGhhdCB0aGUgcmFuZG9tIG51bWJlciBsaWVzIGluIGZyZWUgcXVhZHJhbnRcbiAgICogKi9cbiAgbWFpblV0aWxpdGllcy5jaGVja09jY3VwaWVkUXVhZHJhbnRzID0gZnVuY3Rpb24obWFpbkVsZSwgaGlkZGVuRWxlcykge1xuICAgICAgaWYgKGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpID09ICdQRCcpXG4gICAgICB7XG4gICAgICAgIHZhciB2aXNpYmxlTmVpZ2hib3JFbGVzID0gbWFpbkVsZS5uZWlnaGJvcmhvb2QoKS5kaWZmZXJlbmNlKGhpZGRlbkVsZXMpLm5vZGVzKCk7XG4gICAgICAgIHZhciB2aXNpYmxlTmVpZ2hib3JzT2ZOZWlnaGJvcnMgPSB2aXNpYmxlTmVpZ2hib3JFbGVzLm5laWdoYm9yaG9vZCgpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcykuZGlmZmVyZW5jZShtYWluRWxlKS5ub2RlcygpO1xuICAgICAgICB2YXIgdmlzaWJsZUVsZXMgPSB2aXNpYmxlTmVpZ2hib3JFbGVzLnVuaW9uKHZpc2libGVOZWlnaGJvcnNPZk5laWdoYm9ycyk7XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICAgIHZhciB2aXNpYmxlRWxlcyA9IG1haW5FbGUubmVpZ2hib3Job29kKCkuZGlmZmVyZW5jZShoaWRkZW5FbGVzKS5ub2RlcygpO1xuICAgICAgdmFyIG9jY3VwaWVkUXVhZHJhbnRzID0ge2ZpcnN0OlwiZnJlZVwiLCBzZWNvbmQ6XCJmcmVlXCIsIHRoaXJkOlwiZnJlZVwiLCBmb3VydGg6XCJmcmVlXCJ9O1xuXG4gICAgICB2aXNpYmxlRWxlcy5mb3JFYWNoKGZ1bmN0aW9uKCBlbGUgKXtcbiAgICAgICAgICBpZiAoZWxlLmRhdGEoJ2NsYXNzJykgIT0gJ2NvbXBhcnRtZW50JyAmJiAgZWxlLmRhdGEoJ2NsYXNzJykgIT0gJ2NvbXBsZXgnKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgPCBtYWluRWxlLnBvc2l0aW9uKFwieFwiKSAmJiBlbGUucG9zaXRpb24oXCJ5XCIpIDwgbWFpbkVsZS5wb3NpdGlvbihcInlcIikpXG4gICAgICAgICAgICAgICAgICBvY2N1cGllZFF1YWRyYW50cy5zZWNvbmQgPSBcIm9jY3VwaWVkXCI7XG4gICAgICAgICAgICAgIGVsc2UgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgPiBtYWluRWxlLnBvc2l0aW9uKFwieFwiKSAmJiBlbGUucG9zaXRpb24oXCJ5XCIpIDwgbWFpbkVsZS5wb3NpdGlvbihcInlcIikpXG4gICAgICAgICAgICAgICAgICBvY2N1cGllZFF1YWRyYW50cy5maXJzdCA9IFwib2NjdXBpZWRcIjtcbiAgICAgICAgICAgICAgZWxzZSBpZiAoZWxlLnBvc2l0aW9uKFwieFwiKSA8IG1haW5FbGUucG9zaXRpb24oXCJ4XCIpICYmIGVsZS5wb3NpdGlvbihcInlcIikgPiBtYWluRWxlLnBvc2l0aW9uKFwieVwiKSlcbiAgICAgICAgICAgICAgICAgIG9jY3VwaWVkUXVhZHJhbnRzLnRoaXJkID0gXCJvY2N1cGllZFwiO1xuICAgICAgICAgICAgICBlbHNlIGlmIChlbGUucG9zaXRpb24oXCJ4XCIpID4gbWFpbkVsZS5wb3NpdGlvbihcInhcIikgJiYgZWxlLnBvc2l0aW9uKFwieVwiKSA+IG1haW5FbGUucG9zaXRpb24oXCJ5XCIpKVxuICAgICAgICAgICAgICAgICAgb2NjdXBpZWRRdWFkcmFudHMuZm91cnRoID0gXCJvY2N1cGllZFwiO1xuICAgICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9jY3VwaWVkUXVhZHJhbnRzO1xuICB9O1xuXG4gIC8vIE92ZXJyaWRlcyBoaWdobGlnaHRQcm9jZXNzZXMgZnJvbSBTQkdOVklaIC0gZG8gbm90IGhpZ2hsaWdodCBhbnkgbm9kZXMgd2hlbiB0aGUgbWFwIHR5cGUgaXMgQUZcbiAgbWFpblV0aWxpdGllcy5oaWdobGlnaHRQcm9jZXNzZXMgPSBmdW5jdGlvbihfbm9kZXMpIHtcbiAgICBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgPT0gXCJBRlwiKVxuICAgICAgcmV0dXJuO1xuICAgIHNiZ252aXpJbnN0YW5jZS5oaWdobGlnaHRQcm9jZXNzZXMoX25vZGVzKTtcbiAgfTtcblxuICAvKipcbiAgICogUmVzZXRzIG1hcCB0eXBlIHRvIHVuZGVmaW5lZFxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5yZXNldE1hcFR5cGUgPSBmdW5jdGlvbigpe1xuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzZXRNYXBUeXBlKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIHJldHVybiA6IG1hcCB0eXBlXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmdldE1hcFR5cGUgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKTtcbiAgfTtcblxuICByZXR1cm4gbWFpblV0aWxpdGllcztcbn07XG4iLCIvKlxuICogIEV4dGVuZCBkZWZhdWx0IG9wdGlvbnMgYW5kIGdldCBjdXJyZW50IG9wdGlvbnMgYnkgdXNpbmcgdGhpcyBmaWxlXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBkZWZhdWx0cyA9IHtcbiAgICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgdGhlIGluZGV4IGh0bWxcbiAgICAvLyBmaWxlIGFuZCBub2RlX21vZHVsZXMgYXJlIHVuZGVyIHRoZSBzYW1lIGZvbGRlciB0aGVuIHVzaW5nIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGZpbmVcbiAgICBpbWdQYXRoOiAnbm9kZV9tb2R1bGVzL3NiZ252aXovc3JjL2ltZycsXG4gICAgLy8gV2hldGhlciB0byBmaXQgbGFiZWxzIHRvIG5vZGVzXG4gICAgZml0TGFiZWxzVG9Ob2RlczogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgZml0TGFiZWxzVG9JbmZvYm94ZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIC8vIGR5bmFtaWMgbGFiZWwgc2l6ZSBpdCBtYXkgYmUgJ3NtYWxsJywgJ3JlZ3VsYXInLCAnbGFyZ2UnXG4gICAgZHluYW1pY0xhYmVsU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICdyZWd1bGFyJztcbiAgICB9LFxuICAgIC8vIFdoZXRoZXIgdG8gaW5mZXIgbmVzdGluZyBvbiBsb2FkIFxuICAgIGluZmVyTmVzdGluZ09uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgLy8gcGVyY2VudGFnZSB1c2VkIHRvIGNhbGN1bGF0ZSBjb21wb3VuZCBwYWRkaW5nc1xuICAgIGNvbXBvdW5kUGFkZGluZzogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIDEwO1xuICAgIH0sXG4gICAgLy8gV2hldGhlciB0byBhZGp1c3Qgbm9kZSBsYWJlbCBmb250IHNpemUgYXV0b21hdGljYWxseS5cbiAgICAvLyBJZiB0aGlzIG9wdGlvbiByZXR1cm4gZmFsc2UgZG8gbm90IGFkanVzdCBsYWJlbCBzaXplcyBhY2NvcmRpbmcgdG8gbm9kZSBoZWlnaHQgdXNlcyBub2RlLmRhdGEoJ2ZvbnQtc2l6ZScpXG4gICAgLy8gaW5zdGVhZCBvZiBkb2luZyBpdC5cbiAgICBhZGp1c3ROb2RlTGFiZWxGb250U2l6ZUF1dG9tYXRpY2FsbHk6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICAvLyBUaGUgc2VsZWN0b3Igb2YgdGhlIGNvbXBvbmVudCBjb250YWluaW5nIHRoZSBzYmduIG5ldHdvcmtcbiAgICBuZXR3b3JrQ29udGFpbmVyU2VsZWN0b3I6ICcjc2Jnbi1uZXR3b3JrLWNvbnRhaW5lcicsXG4gICAgLy8gV2hldGhlciB0aGUgYWN0aW9ucyBhcmUgdW5kb2FibGUsIHJlcXVpcmVzIGN5dG9zY2FwZS11bmRvLXJlZG8gZXh0ZW5zaW9uXG4gICAgdW5kb2FibGU6IHRydWUsXG4gICAgLy8gV2hldGhlciB0byBoYXZlIHVuZG9hYmxlIGRyYWcgZmVhdHVyZSBpbiB1bmRvL3JlZG8gZXh0ZW5zaW9uLiBUaGlzIG9wdGlvbnMgd2lsbCBiZSBwYXNzZWQgdG8gdW5kby9yZWRvIGV4dGVuc2lvblxuICAgIHVuZG9hYmxlRHJhZzogdHJ1ZVxuICB9O1xuXG4gIHZhciBvcHRpb25VdGlsaXRpZXMgPSBmdW5jdGlvbiAoKSB7XG4gIH07XG5cbiAgLy8gRXh0ZW5kIHRoZSBkZWZhdWx0cyBvcHRpb25zIHdpdGggdGhlIHVzZXIgb3B0aW9uc1xuICBvcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgZm9yICh2YXIgcHJvcCBpbiBkZWZhdWx0cykge1xuICAgICAgcmVzdWx0W3Byb3BdID0gZGVmYXVsdHNbcHJvcF07XG4gICAgfVxuXG4gICAgZm9yICh2YXIgcHJvcCBpbiBvcHRpb25zKSB7XG4gICAgICByZXN1bHRbcHJvcF0gPSBvcHRpb25zW3Byb3BdO1xuICAgIH1cblxuICAgIG9wdGlvblV0aWxpdGllcy5vcHRpb25zID0gcmVzdWx0O1xuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG4gIH07XG5cbiAgb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG9wdGlvblV0aWxpdGllcy5vcHRpb25zO1xuICB9O1xuXG4gIHJldHVybiBvcHRpb25VdGlsaXRpZXM7XG59O1xuIiwidmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgJCA9IGxpYnMualF1ZXJ5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMsIG9wdGlvbnMsIGN5O1xuXG4gIHZhciByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSBwYXJhbS51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcbiAgICBvcHRpb25zID0gcGFyYW0ub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcbiAgICBjeSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRDeSgpO1xuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIHVuZG8tcmVkbyBpbnN0YW5jZVxuICAgIHZhciB1ciA9IGN5LnVuZG9SZWRvKHtcbiAgICAgIHVuZG9hYmxlRHJhZzogb3B0aW9ucy51bmRvYWJsZURyYWdcbiAgICB9KTtcblxuICAgIC8vIHJlZ2lzdGVyIGFkZCByZW1vdmUgYWN0aW9uc1xuICAgIHVyLmFjdGlvbihcImFkZE5vZGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkTm9kZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gICAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XG4gICAgdXIuYWN0aW9uKFwiYWRkRWRnZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRFZGdlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgICB1ci5hY3Rpb24oXCJhZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gICAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NtYXJ0XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTbWFydCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xuICAgIHVyLmFjdGlvbihcImNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyk7XG5cbiAgICAvLyByZWdpc3RlciBnZW5lcmFsIGFjdGlvbnNcbiAgICB1ci5hY3Rpb24oXCJyZXNpemVOb2Rlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMpO1xuICAgIHVyLmFjdGlvbihcImNoYW5nZU5vZGVMYWJlbFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCk7XG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlRGF0YVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhKTtcbiAgICB1ci5hY3Rpb24oXCJjaGFuZ2VDc3NcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MpO1xuICAgIHVyLmFjdGlvbihcImNoYW5nZUJlbmRQb2ludHNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmVuZFBvaW50cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmVuZFBvaW50cyk7XG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKTtcbiAgICB1ci5hY3Rpb24oXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUxheW91dCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtTGF5b3V0KTtcbiAgICB1ci5hY3Rpb24oXCJoaWRlQW5kUGVyZm9ybUxheW91dFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5oaWRlQW5kUGVyZm9ybUxheW91dCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb0hpZGVBbmRQZXJmb3JtTGF5b3V0KTtcblxuICAgIC8vIHJlZ2lzdGVyIFNCR04gYWN0aW9uc1xuICAgIHVyLmFjdGlvbihcImFkZFN0YXRlT3JJbmZvQm94XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCk7XG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94KTtcbiAgICB1ci5hY3Rpb24oXCJzZXRNdWx0aW1lclN0YXR1c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMpO1xuICAgIHVyLmFjdGlvbihcInNldENsb25lTWFya2VyU3RhdHVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cyk7XG4gICAgdXIuYWN0aW9uKFwicmVtb3ZlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94KTtcblxuICAgIC8vIHJlZ2lzdGVyIGVhc3kgY3JlYXRpb24gYWN0aW9uc1xuICAgIHVyLmFjdGlvbihcImNyZWF0ZVRlbXBsYXRlUmVhY3Rpb25cIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG5cbiAgICB1ci5hY3Rpb24oXCJzZXREZWZhdWx0UHJvcGVydHlcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0RGVmYXVsdFByb3BlcnR5LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXREZWZhdWx0UHJvcGVydHkpO1xuICB9O1xuXG4gIHJldHVybiByZWdpc3RlclVuZG9SZWRvQWN0aW9ucztcbn07XG4iLCJ2YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGluc3RhbmNlO1xuXG4gIGZ1bmN0aW9uIHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcyAob3B0aW9ucykge1xuXG4gICAgaW5zdGFuY2UgPSBsaWJzLnNiZ252aXoob3B0aW9ucyk7XG5cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG5cbiAgc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlKCkuZ2V0Q3koKTtcbiAgfVxuXG4gIHJldHVybiBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXM7XG59O1xuIiwiLy8gRXh0ZW5kcyBzYmdudml6LnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIHNiZ252aXpJbnN0YW5jZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMsIGVsZW1lbnRVdGlsaXRpZXMsIGN5O1xuXG4gIGZ1bmN0aW9uIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zRXh0ZW5kZXIgKHBhcmFtKSB7XG5cbiAgICBzYmdudml6SW5zdGFuY2UgPSBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0SW5zdGFuY2UoKTtcbiAgICBjeSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRDeSgpO1xuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gc2JnbnZpekluc3RhbmNlLnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xuICAgIGVsZW1lbnRVdGlsaXRpZXMgPSBwYXJhbS5lbGVtZW50VXRpbGl0aWVzO1xuXG4gICAgZXh0ZW5kKCk7XG4gIH1cblxuICAvLyBFeHRlbmRzIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zIHdpdGggY2hpc2Ugc3BlY2lmaWMgZmVhdHVyZXNcbiAgZnVuY3Rpb24gZXh0ZW5kICgpIHtcbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gYWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGROb2RlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICB2YXIgbmV3Tm9kZSA9IHBhcmFtLm5ld05vZGU7XG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShuZXdOb2RlLngsIG5ld05vZGUueSwgbmV3Tm9kZS5jbGFzcywgbmV3Tm9kZS5pZCwgbmV3Tm9kZS5wYXJlbnQsIG5ld05vZGUudmlzaWJpbGl0eSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVsZXM6IHJlc3VsdFxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgdmFyIG5ld0VkZ2UgPSBwYXJhbS5uZXdFZGdlO1xuICAgICAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3RWRnZS5zb3VyY2UsIG5ld0VkZ2UudGFyZ2V0LCBuZXdFZGdlLmNsYXNzLCBuZXdFZGdlLmlkLCBuZXdFZGdlLnZpc2liaWxpdHkpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVzOiByZXN1bHRcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMocGFyYW0uc291cmNlLCBwYXJhbS50YXJnZXQsIHBhcmFtLnByb2Nlc3NUeXBlKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKHBhcmFtKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZWxlczogcmVzdWx0XG4gICAgICB9O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICAvLyBOb2RlcyB0byBtYWtlIGNvbXBvdW5kLCB0aGVpciBkZXNjZW5kYW50cyBhbmQgZWRnZXMgY29ubmVjdGVkIHRvIHRoZW0gd2lsbCBiZSByZW1vdmVkIGR1cmluZyBjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgb3BlcmF0aW9uXG4gICAgICAgIC8vIChpbnRlcm5hbGx5IGJ5IGVsZXMubW92ZSgpIG9wZXJhdGlvbiksIHNvIG1hcmsgdGhlbSBhcyByZW1vdmVkIGVsZXMgZm9yIHVuZG8gb3BlcmF0aW9uLlxuICAgICAgICB2YXIgbm9kZXNUb01ha2VDb21wb3VuZCA9IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQ7XG4gICAgICAgIHZhciByZW1vdmVkRWxlcyA9IG5vZGVzVG9NYWtlQ29tcG91bmQudW5pb24obm9kZXNUb01ha2VDb21wb3VuZC5kZXNjZW5kYW50cygpKTtcbiAgICAgICAgcmVtb3ZlZEVsZXMgPSByZW1vdmVkRWxlcy51bmlvbihyZW1vdmVkRWxlcy5jb25uZWN0ZWRFZGdlcygpKTtcbiAgICAgICAgcmVzdWx0LnJlbW92ZWRFbGVzID0gcmVtb3ZlZEVsZXM7XG4gICAgICAgIC8vIEFzc3VtZSB0aGF0IGFsbCBub2RlcyB0byBtYWtlIGNvbXBvdW5kIGhhdmUgdGhlIHNhbWUgcGFyZW50XG4gICAgICAgIHZhciBvbGRQYXJlbnRJZCA9IG5vZGVzVG9NYWtlQ29tcG91bmRbMF0uZGF0YShcInBhcmVudFwiKTtcbiAgICAgICAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZFxuICAgICAgICAvLyBOZXcgZWxlcyBpbmNsdWRlcyBuZXcgY29tcG91bmQgYW5kIHRoZSBtb3ZlZCBlbGVzIGFuZCB3aWxsIGJlIHVzZWQgaW4gdW5kbyBvcGVyYXRpb24uXG4gICAgICAgIHJlc3VsdC5uZXdFbGVzID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMobm9kZXNUb01ha2VDb21wb3VuZCwgcGFyYW0uY29tcG91bmRUeXBlKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQucmVtb3ZlZEVsZXMgPSBwYXJhbS5uZXdFbGVzLnJlbW92ZSgpO1xuICAgICAgICByZXN1bHQubmV3RWxlcyA9IHBhcmFtLnJlbW92ZWRFbGVzLnJlc3RvcmUoKTtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5tYWludGFpblBvaW50ZXIocmVzdWx0Lm5ld0VsZXMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvLyBTZWN0aW9uIEVuZFxuICAgIC8vIGFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xuXG4gICAgLy8gU2VjdGlvbiBTdGFydFxuICAgIC8vIGVhc3kgY3JlYXRpb24gYWN0aW9uIGZ1bmN0aW9uc1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgICAgIHZhciBlbGVzO1xuXG4gICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgIGVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24ocGFyYW0udGVtcGxhdGVUeXBlLCBwYXJhbS5tYWNyb21vbGVjdWxlTGlzdCwgcGFyYW0uY29tcGxleE5hbWUsIHBhcmFtLnByb2Nlc3NQb3NpdGlvbiwgcGFyYW0udGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCBwYXJhbS50aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgcGFyYW0uZWRnZUxlbmd0aClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVzID0gcGFyYW07XG4gICAgICAgIGN5LmFkZChlbGVzKTtcblxuICAgICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICAgIGVsZXMuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVsZXM6IGVsZXNcbiAgICAgIH07XG4gICAgfTtcblxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gZWFzeSBjcmVhdGlvbiBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHBvc2l0aW9ucyA9IHt9O1xuICAgICAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcblxuICAgICAgbm9kZXMuZWFjaChmdW5jdGlvbihlbGUsIGkpIHtcbiAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgIGVsZSA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICBwb3NpdGlvbnNbZWxlLmlkKCldID0ge1xuICAgICAgICAgIHg6IGVsZS5wb3NpdGlvbihcInhcIiksXG4gICAgICAgICAgeTogZWxlLnBvc2l0aW9uKFwieVwiKVxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBwb3NpdGlvbnM7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zID0gZnVuY3Rpb24gKHBvc2l0aW9ucykge1xuICAgICAgdmFyIGN1cnJlbnRQb3NpdGlvbnMgPSB7fTtcbiAgICAgIGN5Lm5vZGVzKCkucG9zaXRpb25zKGZ1bmN0aW9uIChlbGUsIGkpIHtcbiAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgIGVsZSA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50UG9zaXRpb25zW2VsZS5pZCgpXSA9IHtcbiAgICAgICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxuICAgICAgICAgIHk6IGVsZS5wb3NpdGlvbihcInlcIilcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcG9zID0gcG9zaXRpb25zW2VsZS5pZCgpXTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB4OiBwb3MueCxcbiAgICAgICAgICB5OiBwb3MueVxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBjdXJyZW50UG9zaXRpb25zO1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZVxuICAgICAgfTtcblxuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG5cbiAgICAgIHJlc3VsdC5zaXplTWFwID0ge307XG4gICAgICByZXN1bHQudXNlQXNwZWN0UmF0aW8gPSBmYWxzZTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICByZXN1bHQuc2l6ZU1hcFtub2RlLmlkKCldID0ge1xuICAgICAgICAgIHc6IG5vZGUud2lkdGgoKSxcbiAgICAgICAgICBoOiBub2RlLmhlaWdodCgpXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdC5ub2RlcyA9IG5vZGVzO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG5cbiAgICAgICAgaWYgKHBhcmFtLnBlcmZvcm1PcGVyYXRpb24pIHtcbiAgICAgICAgICBpZiAocGFyYW0uc2l6ZU1hcCkge1xuICAgICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLnc7XG4gICAgICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0uaDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKHBhcmFtLm5vZGVzLCBwYXJhbS53aWR0aCwgcGFyYW0uaGVpZ2h0LCBwYXJhbS51c2VBc3BlY3RSYXRpbyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIH07XG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgICAgIHJlc3VsdC5ub2RlcyA9IG5vZGVzO1xuICAgICAgcmVzdWx0LmxhYmVsID0ge307XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgcmVzdWx0LmxhYmVsW25vZGUuaWQoKV0gPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBwYXJhbS5sYWJlbCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgICAgbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsID0gcGFyYW0ubGFiZWxbbm9kZS5pZCgpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgfTtcbiAgICAgIHZhciBlbGVzID0gcGFyYW0uZWxlcztcbiAgICAgIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTtcbiAgICAgIHJlc3VsdC52YWx1ZU1hcCA9IHt9O1xuICAgICAgcmVzdWx0LmVsZXMgPSBlbGVzO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XG4gICAgICAgIHJlc3VsdC52YWx1ZU1hcFtlbGUuaWQoKV0gPSBlbGUuZGF0YShwYXJhbS5uYW1lKTtcbiAgICAgIH1cblxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKHBhcmFtLmVsZXMsIHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlTWFwKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgfTtcbiAgICAgIHZhciBlbGVzID0gcGFyYW0uZWxlcztcbiAgICAgIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTtcbiAgICAgIHJlc3VsdC52YWx1ZU1hcCA9IHt9O1xuICAgICAgcmVzdWx0LmVsZXMgPSBlbGVzO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XG4gICAgICAgIHJlc3VsdC52YWx1ZU1hcFtlbGUuaWQoKV0gPSBlbGUuY3NzKHBhcmFtLm5hbWUpO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyhwYXJhbS5lbGVzLCBwYXJhbS5uYW1lLCBwYXJhbS52YWx1ZU1hcCk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgfTtcblxuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuICAgICAgcmVzdWx0LmRhdGEgPSB7fTtcbiAgICAgIHJlc3VsdC5lbGVzID0gZWxlcztcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuXG4gICAgICAgIHJlc3VsdC5kYXRhW2VsZS5pZCgpXSA9IHt9O1xuXG4gICAgICAgIHZhciBkYXRhID0gcGFyYW0uZmlyc3RUaW1lID8gcGFyYW0uZGF0YSA6IHBhcmFtLmRhdGFbZWxlLmlkKCldO1xuXG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gZGF0YSkge1xuICAgICAgICAgIHJlc3VsdC5kYXRhW2VsZS5pZCgpXVtwcm9wXSA9IGVsZS5kYXRhKHByb3ApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyhlbGVzLCBkYXRhKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgZWxlID0gZWxlc1tpXTtcblxuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIFNob3cgZWxlcyBhbmQgcGVyZm9ybSBsYXlvdXQuXG4gICAgICovXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBlbGVzID0gcGFyYW0uZWxlcztcblxuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcblxuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICByZXN1bHQuZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQocGFyYW0uZWxlcywgcGFyYW0ubGF5b3V0cGFyYW0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgZ2l2ZW4gZWxlc1xuICAgICAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyhwYXJhbS5wb3NpdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvU2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBlbGVzID0gcGFyYW0uZWxlcztcblxuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcbiAgICAgIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLmhpZGUoZWxlcyk7IC8vIEhpZGUgcHJldmlvdXNseSB1bmhpZGRlbiBlbGVzO1xuXG4gICAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyhwYXJhbS5wb3NpdGlvbnMpO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIEhpZGUgZWxlcyBhbmQgcGVyZm9ybSBsYXlvdXQuXG4gICAgICovXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuaGlkZUFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcblxuICAgICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgICAgICAgICByZXN1bHQuZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuaGlkZUFuZFBlcmZvcm1MYXlvdXQocGFyYW0uZWxlcywgcGFyYW0ubGF5b3V0cGFyYW0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuaGlkZShlbGVzKTsgLy8gSGlkZSBnaXZlbiBlbGVzXG4gICAgICAgICAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyhwYXJhbS5wb3NpdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb0hpZGVBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICAgIHZhciBlbGVzID0gcGFyYW0uZWxlcztcblxuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XG4gICAgICAgIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgcHJldmlvdXNseSBoaWRkZW4gZWxlc1xuXG4gICAgICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgLy8gU2VjdGlvbiBFbmRcbiAgICAvLyBnZW5lcmFsIGFjdGlvbiBmdW5jdGlvbnNcblxuICAgIC8vIFNlY3Rpb24gU3RhcnRcbiAgICAvLyBzYmduIGFjdGlvbiBmdW5jdGlvbnNcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgfTtcbiAgICAgIHJlc3VsdC50eXBlID0gcGFyYW0udHlwZTtcbiAgICAgIHJlc3VsdC5ub2RlcyA9IHBhcmFtLm5vZGVzO1xuICAgICAgcmVzdWx0LmluZGV4ID0gcGFyYW0uaW5kZXg7XG5cbiAgICAgIHJlc3VsdC52YWx1ZSA9IGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3gocGFyYW0ubm9kZXMsIHBhcmFtLmluZGV4LCBwYXJhbS52YWx1ZSwgcGFyYW0udHlwZSk7XG5cbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgb2JqID0gcGFyYW0ub2JqO1xuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG5cbiAgICAgIHZhciBsb2NhdGlvbk9iaiA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XG5cbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgbG9jYXRpb25PYmo6IGxvY2F0aW9uT2JqLFxuICAgICAgICBvYmo6IG9ialxuICAgICAgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgbG9jYXRpb25PYmogPSBwYXJhbS5sb2NhdGlvbk9iajtcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuXG4gICAgICB2YXIgb2JqID0gZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgbG9jYXRpb25PYmopO1xuXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIG9iajogb2JqXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgICAgIHZhciBzdGF0dXMgPSBwYXJhbS5zdGF0dXM7XG4gICAgICB2YXIgcmVzdWx0U3RhdHVzID0ge307XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgdmFyIGlzTXVsdGltZXIgPSBub2RlLmRhdGEoJ2NsYXNzJykuZW5kc1dpdGgoJyBtdWx0aW1lcicpO1xuXG4gICAgICAgIHJlc3VsdFN0YXR1c1tub2RlLmlkKCldID0gaXNNdWx0aW1lcjtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZSBjaGFuZ2UgdGhlIHN0YXR1cyBvZiBhbGwgbm9kZXMgYXQgb25jZS5cbiAgICAgIC8vIElmIG5vdCBjaGFuZ2Ugc3RhdHVzIG9mIGVhY2ggc2VwZXJhdGVseSB0byB0aGUgdmFsdWVzIG1hcHBlZCB0byB0aGVpciBpZC5cbiAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGUsIHN0YXR1c1tub2RlLmlkKCldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgLy8gIGlmICghZmlyc3RUaW1lICYmIF8uaXNFcXVhbChub2RlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xuICAgIC8vICAgICQoJyNpbnNwZWN0b3ItaXMtbXVsdGltZXInKS5hdHRyKFwiY2hlY2tlZFwiLCAhJCgnI2luc3BlY3Rvci1pcy1tdWx0aW1lcicpLmF0dHIoXCJjaGVja2VkXCIpKTtcbiAgICAvLyAgfVxuXG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBzdGF0dXM6IHJlc3VsdFN0YXR1cyxcbiAgICAgICAgbm9kZXM6IG5vZGVzXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG4gICAgICB2YXIgc3RhdHVzID0gcGFyYW0uc3RhdHVzO1xuICAgICAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgICAgIHZhciByZXN1bHRTdGF0dXMgPSB7fTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICByZXN1bHRTdGF0dXNbbm9kZS5pZCgpXSA9IG5vZGUuZGF0YSgnY2xvbmVtYXJrZXInKTtcbiAgICAgICAgdmFyIGN1cnJlbnRTdGF0dXMgPSBmaXJzdFRpbWUgPyBzdGF0dXMgOiBzdGF0dXNbbm9kZS5pZCgpXTtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhub2RlLCBjdXJyZW50U3RhdHVzKTtcbiAgICAgIH1cblxuICAgIC8vICBpZiAoIWZpcnN0VGltZSAmJiBfLmlzRXF1YWwobm9kZXMsIGN5Lm5vZGVzKCc6c2VsZWN0ZWQnKSkpIHtcbiAgICAvLyAgICAkKCcjaW5zcGVjdG9yLWlzLWNsb25lLW1hcmtlcicpLmF0dHIoXCJjaGVja2VkXCIsICEkKCcjaW5zcGVjdG9yLWlzLWNsb25lLW1hcmtlcicpLmF0dHIoXCJjaGVja2VkXCIpKTtcbiAgICAvLyAgfVxuXG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBzdGF0dXM6IHJlc3VsdFN0YXR1cyxcbiAgICAgICAgbm9kZXM6IG5vZGVzXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvLyBwYXJhbToge2NsYXNzOiBzYmduY2xhc3MsIG5hbWU6IHByb3BlcnR5TmFtZSwgdmFsdWU6IHZhbHVlfVxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldERlZmF1bHRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHNiZ25jbGFzcyA9IHBhcmFtLmNsYXNzO1xuICAgICAgdmFyIG5hbWUgPSBwYXJhbS5uYW1lO1xuICAgICAgdmFyIHZhbHVlID0gcGFyYW0udmFsdWU7XG4gICAgICB2YXIgY2xhc3NEZWZhdWx0cyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbc2JnbmNsYXNzXTtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIGNsYXNzOiBzYmduY2xhc3MsXG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIHZhbHVlOiBjbGFzc0RlZmF1bHRzLmhhc093blByb3BlcnR5KG5hbWUpID8gY2xhc3NEZWZhdWx0c1tuYW1lXSA6IHVuZGVmaW5lZFxuICAgICAgfTtcblxuICAgICAgY2xhc3NEZWZhdWx0c1tuYW1lXSA9IHZhbHVlO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvLyBTZWN0aW9uIEVuZFxuICAgIC8vIHNiZ24gYWN0aW9uIGZ1bmN0aW9uc1xuICB9XG5cblxuICByZXR1cm4gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnNFeHRlbmRlcjtcbn07XG4iXX0=
