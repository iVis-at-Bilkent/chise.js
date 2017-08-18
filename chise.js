(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sbgnviz = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function(){
  var chise = window.chise = function(_options, _libs) {
    var libs = {};
    libs.jQuery = _libs.jQuery || jQuery;
    libs.cytoscape = _libs.cytoscape || cytoscape;
    libs.sbgnviz = _libs.sbgnviz || sbgnviz;
    libs.saveAs = _libs.filesaverjs ? _libs.filesaverjs.saveAs : saveAs;
    
    libs.sbgnviz(_options, _libs); // Initilize sbgnviz
    
    // Set the libraries to access them from any file
    var libUtilities = _dereq_('./utilities/lib-utilities');
    libUtilities.setLibs(libs);
    
    var optionUtilities = _dereq_('./utilities/option-utilities');
    var options = optionUtilities.extendOptions(_options); // Extends the default options with the given options
    
    // Update style and bind events
    var cyStyleAndEvents = _dereq_('./utilities/cy-style-and-events');
    cyStyleAndEvents(libs.sbgnviz);
    
    // Register undo/redo actions
    var registerUndoRedoActions = _dereq_('./utilities/register-undo-redo-actions');
    registerUndoRedoActions(options.undoableDrag);
    
    var mainUtilities = _dereq_('./utilities/main-utilities');
    var elementUtilities = _dereq_('./utilities/element-utilities');
    var undoRedoActionFunctions = _dereq_('./utilities/undo-redo-action-functions');
    
    // Expose the api
    
    // Expose the properties inherited from sbgnviz
    // then override some of these properties and expose some new properties
    for (var prop in libs.sbgnviz) {
      chise[prop] = libs.sbgnviz[prop];
    }
    
    // Expose each main utility seperately
    for (var prop in mainUtilities) {
      chise[prop] = mainUtilities[prop];
    }
    
    // Expose elementUtilities and undoRedoActionFunctions as is
    chise.elementUtilities = elementUtilities;
    chise.undoRedoActionFunctions = undoRedoActionFunctions;
  };
  
  if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = chise;
  }
})();
},{"./utilities/cy-style-and-events":2,"./utilities/element-utilities":3,"./utilities/lib-utilities":4,"./utilities/main-utilities":5,"./utilities/option-utilities":6,"./utilities/register-undo-redo-actions":7,"./utilities/undo-redo-action-functions":8}],2:[function(_dereq_,module,exports){
var elementUtilities = _dereq_('./element-utilities');
var libs = _dereq_('./lib-utilities').getLibs();
var $ = libs.jQuery;
var options = _dereq_('./option-utilities').getOptions();

module.exports = function (sbgnviz) {
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
  
  // This function will be executed after document.ready in sbgnviz because it is registered later
  $(document).ready(function () {
    // Once cy is ready bind events and update style sheet
    cy.ready( function(event) {
      bindCyEvents();
      updateStyleSheet();
    });
  });
};
},{"./element-utilities":3,"./lib-utilities":4,"./option-utilities":6}],3:[function(_dereq_,module,exports){
// Extends sbgnviz.elementUtilities
var libs = _dereq_('./lib-utilities').getLibs();
var sbgnviz = libs.sbgnviz;
var jQuery = $ = libs.jQuery;
var elementUtilities = sbgnviz.elementUtilities;
var options = _dereq_('./option-utilities').getOptions();

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
    var nodePortsOrdering = sbgnviz.elementUtilities.getPortsOrdering(node);
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
            chise.elementUtilities.setPortsOrdering(process, 'L-to-R');
        else
            chise.elementUtilities.setPortsOrdering(process, 'R-to-L');
    }
    else
    {
        if (ydiff < 0)
            chise.elementUtilities.setPortsOrdering(process, 'T-to-B');
        else
            chise.elementUtilities.setPortsOrdering(process, 'B-to-T');
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
  else if (parentClass.startsWith('complex') && (!node || node.connectedEdges().length == 0)) { // Complexes can only include EPNs which do not have edges
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
        locationObj = sbgnviz.classes.UnitOfInformation.create(node, obj.label.text, obj.bbox, obj.location, obj.position, obj.index);
      }
      else if (node.data("language") == "AF"){
        locationObj = sbgnviz.classes.UnitOfInformation.create(node, obj.label.text, obj.bbox, obj.location, obj.position, obj.index,
            libs.cytoscape.sbgn.AfShapeFn, libs.cytoscape.sbgn.AfShapeArgsFn);
      }
    }
    else if (obj.clazz == "state variable") {
      locationObj = sbgnviz.classes.StateVariable.create(node, obj.state.value, obj.state.variable, obj.bbox, obj.location, obj.position, obj.index);
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

    obj = unit.remove();
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
      ele.data('auxunitlayouts')[side].parentNode = ele;
    }
    for(var i=0; i < ele.data('statesandinfos').length; i++) {
      ele.data('statesandinfos')[i].parent = ele;
    }
  });
}

module.exports = elementUtilities;

},{"./lib-utilities":4,"./option-utilities":6}],4:[function(_dereq_,module,exports){
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
var options = _dereq_('./option-utilities').getOptions();
var elementUtilities = _dereq_('./element-utilities');
var libs = _dereq_('./lib-utilities').getLibs();

/*
 * The main utilities to be exposed directly.
 */
function mainUtilities() {
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
    var nodesToShow = chise.elementUtilities.extendRemainingNodes(nodes, allNodes);
    var nodesToHide = allNodes.not(nodesToShow);

    if (nodesToHide.length === 0) {
        return;
    }

    if (!options.undoable) {

        var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
        chise.thinBorder(nodesWithHiddenNeighbor);
        elementUtilities.hideAndPerformLayout(nodesToHide, layoutparam);
        var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
        chise.thickenBorder(nodesWithHiddenNeighbor);
    }
    else {
        var param = {
            eles: nodesToHide,
            layoutparam: layoutparam,
            firstTime: true
        };

        var ur = cy.undoRedo();
        ur.action("thickenBorder", chise.thickenBorder, chise.thinBorder);
        ur.action("thinBorder", chise.thinBorder, chise.thickenBorder);

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
        chise.thinBorder(nodesWithHiddenNeighbor);
        elementUtilities.showAndPerformLayout(hiddenEles, layoutparam);
        var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
        chise.thickenBorder(nodesWithHiddenNeighbor);
    }
    else {
        var param = {
            eles: hiddenEles,
            layoutparam: layoutparam,
            firstTime: true
        };

        var ur = cy.undoRedo();
        ur.action("thickenBorder", chise.thickenBorder, chise.thinBorder);
        ur.action("thinBorder", chise.thinBorder, chise.thickenBorder);
        
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
    if (chise.getMapType() == 'PD')
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
  libs.sbgnviz.highlightProcesses(_nodes);
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

module.exports = mainUtilities;

},{"./element-utilities":3,"./lib-utilities":4,"./option-utilities":6}],6:[function(_dereq_,module,exports){
/*
 *  Extend default options and get current options by using this file 
 */

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

module.exports = optionUtilities;
},{}],7:[function(_dereq_,module,exports){
var undoRedoActionFunctions = _dereq_('./undo-redo-action-functions');
var libs = _dereq_('./lib-utilities').getLibs();
var options = _dereq_('./option-utilities').getOptions();
var $ = libs.jQuery;

var registerUndoRedoActions = function (undoableDrag) {
  if (!options.undoable) {
    return;
  }
  // create undo-redo instance
  var ur = cy.undoRedo({
    undoableDrag: undoableDrag
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

module.exports = function(undoableDrag) {
  $(document).ready(function() {
    registerUndoRedoActions(undoableDrag);
  });
};
},{"./lib-utilities":4,"./option-utilities":6,"./undo-redo-action-functions":8}],8:[function(_dereq_,module,exports){
// Extends sbgnviz.undoRedoActionFunctions
var libs = _dereq_('./lib-utilities').getLibs();
var sbgnviz = libs.sbgnviz;
var undoRedoActionFunctions = sbgnviz.undoRedoActionFunctions;
var elementUtilities = _dereq_('./element-utilities');

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

module.exports = undoRedoActionFunctions;
},{"./element-utilities":3,"./lib-utilities":4}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9saWItdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDanVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2w0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCl7XG4gIHZhciBjaGlzZSA9IHdpbmRvdy5jaGlzZSA9IGZ1bmN0aW9uKF9vcHRpb25zLCBfbGlicykge1xuICAgIHZhciBsaWJzID0ge307XG4gICAgbGlicy5qUXVlcnkgPSBfbGlicy5qUXVlcnkgfHwgalF1ZXJ5O1xuICAgIGxpYnMuY3l0b3NjYXBlID0gX2xpYnMuY3l0b3NjYXBlIHx8IGN5dG9zY2FwZTtcbiAgICBsaWJzLnNiZ252aXogPSBfbGlicy5zYmdudml6IHx8IHNiZ252aXo7XG4gICAgbGlicy5zYXZlQXMgPSBfbGlicy5maWxlc2F2ZXJqcyA/IF9saWJzLmZpbGVzYXZlcmpzLnNhdmVBcyA6IHNhdmVBcztcbiAgICBcbiAgICBsaWJzLnNiZ252aXooX29wdGlvbnMsIF9saWJzKTsgLy8gSW5pdGlsaXplIHNiZ252aXpcbiAgICBcbiAgICAvLyBTZXQgdGhlIGxpYnJhcmllcyB0byBhY2Nlc3MgdGhlbSBmcm9tIGFueSBmaWxlXG4gICAgdmFyIGxpYlV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKTtcbiAgICBsaWJVdGlsaXRpZXMuc2V0TGlicyhsaWJzKTtcbiAgICBcbiAgICB2YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcycpO1xuICAgIHZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMoX29wdGlvbnMpOyAvLyBFeHRlbmRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9uc1xuICAgIFxuICAgIC8vIFVwZGF0ZSBzdHlsZSBhbmQgYmluZCBldmVudHNcbiAgICB2YXIgY3lTdHlsZUFuZEV2ZW50cyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMnKTtcbiAgICBjeVN0eWxlQW5kRXZlbnRzKGxpYnMuc2JnbnZpeik7XG4gICAgXG4gICAgLy8gUmVnaXN0ZXIgdW5kby9yZWRvIGFjdGlvbnNcbiAgICB2YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9yZWdpc3Rlci11bmRvLXJlZG8tYWN0aW9ucycpO1xuICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKG9wdGlvbnMudW5kb2FibGVEcmFnKTtcbiAgICBcbiAgICB2YXIgbWFpblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzJyk7XG4gICAgdmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcycpO1xuICAgIHZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XG4gICAgXG4gICAgLy8gRXhwb3NlIHRoZSBhcGlcbiAgICBcbiAgICAvLyBFeHBvc2UgdGhlIHByb3BlcnRpZXMgaW5oZXJpdGVkIGZyb20gc2JnbnZpelxuICAgIC8vIHRoZW4gb3ZlcnJpZGUgc29tZSBvZiB0aGVzZSBwcm9wZXJ0aWVzIGFuZCBleHBvc2Ugc29tZSBuZXcgcHJvcGVydGllc1xuICAgIGZvciAodmFyIHByb3AgaW4gbGlicy5zYmdudml6KSB7XG4gICAgICBjaGlzZVtwcm9wXSA9IGxpYnMuc2JnbnZpeltwcm9wXTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXhwb3NlIGVhY2ggbWFpbiB1dGlsaXR5IHNlcGVyYXRlbHlcbiAgICBmb3IgKHZhciBwcm9wIGluIG1haW5VdGlsaXRpZXMpIHtcbiAgICAgIGNoaXNlW3Byb3BdID0gbWFpblV0aWxpdGllc1twcm9wXTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXhwb3NlIGVsZW1lbnRVdGlsaXRpZXMgYW5kIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zIGFzIGlzXG4gICAgY2hpc2UuZWxlbWVudFV0aWxpdGllcyA9IGVsZW1lbnRVdGlsaXRpZXM7XG4gICAgY2hpc2UudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcbiAgfTtcbiAgXG4gIGlmICggdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBjaGlzZTtcbiAgfVxufSkoKTsiLCJ2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyICQgPSBsaWJzLmpRdWVyeTtcbnZhciBvcHRpb25zID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJykuZ2V0T3B0aW9ucygpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzYmdudml6KSB7XG4gIC8vSGVscGVyc1xuICB2YXIgaW5pdEVsZW1lbnREYXRhID0gZnVuY3Rpb24gKGVsZSkge1xuICAgIHZhciBlbGVjbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xuICAgIGlmICghZWxlY2xhc3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZWxlY2xhc3MgPSBlbGVtZW50VXRpbGl0aWVzLmRlbXVsdGltZXJpemVDbGFzcyhlbGVjbGFzcyk7XG4gICAgdmFyIGNsYXNzUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbZWxlY2xhc3NdO1xuXG4gICAgY3kuYmF0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGVsZS5pc05vZGUoKSkge1xuICAgICAgICBpZiAoY2xhc3NQcm9wZXJ0aWVzWyd3aWR0aCddICYmICFlbGUuZGF0YSgnYmJveCcpLncpIHtcbiAgICAgICAgICBlbGUuZGF0YSgnYmJveCcpLncgPSBjbGFzc1Byb3BlcnRpZXNbJ3dpZHRoJ107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsYXNzUHJvcGVydGllc1snaGVpZ2h0J10gJiYgIWVsZS5kYXRhKCdiYm94JykuaCkge1xuICAgICAgICAgIGVsZS5kYXRhKCdiYm94JykuaCA9IGNsYXNzUHJvcGVydGllc1snaGVpZ2h0J107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC1zaXplJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydmb250LXNpemUnXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdmb250LXNpemUnLCBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtc2l6ZSddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdmb250LWZhbWlseScpICYmIGNsYXNzUHJvcGVydGllc1snZm9udC1mYW1pbHknXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdmb250LWZhbWlseScsIGNsYXNzUHJvcGVydGllc1snZm9udC1mYW1pbHknXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC1zdHlsZScpICYmIGNsYXNzUHJvcGVydGllc1snZm9udC1zdHlsZSddKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ2ZvbnQtc3R5bGUnLCBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtc3R5bGUnXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC13ZWlnaHQnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtd2VpZ2h0J10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnZm9udC13ZWlnaHQnLCBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtd2VpZ2h0J10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2JhY2tncm91bmQtY29sb3InKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2JhY2tncm91bmQtY29sb3InXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdiYWNrZ3JvdW5kLWNvbG9yJywgY2xhc3NQcm9wZXJ0aWVzWydiYWNrZ3JvdW5kLWNvbG9yJ10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2JhY2tncm91bmQtb3BhY2l0eScpICYmIGNsYXNzUHJvcGVydGllc1snYmFja2dyb3VuZC1vcGFjaXR5J10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnYmFja2dyb3VuZC1vcGFjaXR5JywgY2xhc3NQcm9wZXJ0aWVzWydiYWNrZ3JvdW5kLW9wYWNpdHknXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnYm9yZGVyLWNvbG9yJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydib3JkZXItY29sb3InXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdib3JkZXItY29sb3InLCBjbGFzc1Byb3BlcnRpZXNbJ2JvcmRlci1jb2xvciddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdib3JkZXItd2lkdGgnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2JvcmRlci13aWR0aCddKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ2JvcmRlci13aWR0aCcsIGNsYXNzUHJvcGVydGllc1snYm9yZGVyLXdpZHRoJ10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ3RleHQtd3JhcCcpICYmIGNsYXNzUHJvcGVydGllc1sndGV4dC13cmFwJ10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgndGV4dC13cmFwJywgY2xhc3NQcm9wZXJ0aWVzWyd0ZXh0LXdyYXAnXSk7XG4gICAgICAgIH1cblxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoZWxlLmlzRWRnZSgpKSB7XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ3dpZHRoJykgJiYgY2xhc3NQcm9wZXJ0aWVzWyd3aWR0aCddKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ3dpZHRoJywgY2xhc3NQcm9wZXJ0aWVzWyd3aWR0aCddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdsaW5lLWNvbG9yJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydsaW5lLWNvbG9yJ10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnbGluZS1jb2xvcicsIGNsYXNzUHJvcGVydGllc1snbGluZS1jb2xvciddKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBcbiAgLy8gVXBkYXRlIGN5IHN0eWxlc2hlZXRcbiAgdmFyIHVwZGF0ZVN0eWxlU2hlZXQgPSBmdW5jdGlvbigpIHtcbiAgICBjeS5zdHlsZSgpXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bZm9udC1zaXplXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnZm9udC1zaXplJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAvLyBJZiBub2RlIGxhYmVscyBhcmUgZXhwZWN0ZWQgdG8gYmUgYWRqdXN0ZWQgYXV0b21hdGljYWxseSBvciBlbGVtZW50IGNhbm5vdCBoYXZlIGxhYmVsXG4gICAgICAgIC8vIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldExhYmVsVGV4dFNpemUoKSBlbHNlIHJldHVybiBlbGUuZGF0YSgnZm9udC1zaXplJylcbiAgICAgICAgdmFyIG9wdCA9IG9wdGlvbnMuYWRqdXN0Tm9kZUxhYmVsRm9udFNpemVBdXRvbWF0aWNhbGx5O1xuICAgICAgICB2YXIgYWRqdXN0ID0gdHlwZW9mIG9wdCA9PT0gJ2Z1bmN0aW9uJyA/IG9wdCgpIDogb3B0O1xuICAgICAgICBcbiAgICAgICAgaWYgKCFhZGp1c3QpIHtcbiAgICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2ZvbnQtc2l6ZScpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRMYWJlbFRleHRTaXplKGVsZSk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250LWZhbWlseV1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2ZvbnQtZmFtaWx5JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2ZvbnQtZmFtaWx5Jyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250LXN0eWxlXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnZm9udC1zdHlsZSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250LXN0eWxlJyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250LXdlaWdodF1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2ZvbnQtd2VpZ2h0JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2ZvbnQtd2VpZ2h0Jyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtiYWNrZ3JvdW5kLWNvbG9yXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnYmFja2dyb3VuZC1jb2xvcic6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdiYWNrZ3JvdW5kLWNvbG9yJyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtiYWNrZ3JvdW5kLW9wYWNpdHldXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnYmFja2dyb3VuZC1vcGFjaXR5Jyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtib3JkZXItd2lkdGhdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdib3JkZXItd2lkdGgnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnYm9yZGVyLXdpZHRoJyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtib3JkZXItY29sb3JdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdib3JkZXItY29sb3InOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnYm9yZGVyLWNvbG9yJyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVt0ZXh0LXdyYXBdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICd0ZXh0LXdyYXAnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgndGV4dC13cmFwJyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzXVtsaW5lLWNvbG9yXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnbGluZS1jb2xvcic6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdsaW5lLWNvbG9yJyk7XG4gICAgICB9LFxuICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6IGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2xpbmUtY29sb3InKTtcbiAgICAgIH0sXG4gICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnbGluZS1jb2xvcicpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzc11bd2lkdGhdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICd3aWR0aCc6IGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ3dpZHRoJyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJlZGdlLmN5LWV4cGFuZC1jb2xsYXBzZS1tZXRhLWVkZ2VcIilcbiAgICAuY3NzKHtcbiAgICAgICdsaW5lLWNvbG9yJzogJyNDNEM0QzQnLFxuICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjQzRDNEM0JyxcbiAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnI0M0QzRDNCdcbiAgICB9KVxuICAgIC5zZWxlY3RvcihcIm5vZGU6c2VsZWN0ZWRcIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2JvcmRlci1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICd0ZXh0LW91dGxpbmUtY29sb3InOiAnIzAwMCdcbiAgICB9KVxuICAgIC5zZWxlY3RvcihcImVkZ2U6c2VsZWN0ZWRcIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2xpbmUtY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjZDY3NjE0J1xuICAgIH0pLnVwZGF0ZSgpO1xuICB9O1xuICBcbiAgLy8gQmluZCBldmVudHNcbiAgdmFyIGJpbmRDeUV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIGN5Lm9uKFwiYWRkXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIGVsZSA9IGV2ZW50LmN5VGFyZ2V0IHx8IGV2ZW50LnRhcmdldDtcbiAgICAgIGluaXRFbGVtZW50RGF0YShlbGUpO1xuICAgIH0pO1xuICB9O1xuICAvLyBIZWxwZXJzIEVuZFxuICBcbiAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGV4ZWN1dGVkIGFmdGVyIGRvY3VtZW50LnJlYWR5IGluIHNiZ252aXogYmVjYXVzZSBpdCBpcyByZWdpc3RlcmVkIGxhdGVyXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAvLyBPbmNlIGN5IGlzIHJlYWR5IGJpbmQgZXZlbnRzIGFuZCB1cGRhdGUgc3R5bGUgc2hlZXRcbiAgICBjeS5yZWFkeSggZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGJpbmRDeUV2ZW50cygpO1xuICAgICAgdXBkYXRlU3R5bGVTaGVldCgpO1xuICAgIH0pO1xuICB9KTtcbn07IiwiLy8gRXh0ZW5kcyBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXNcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIHNiZ252aXogPSBsaWJzLnNiZ252aXo7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXM7XG52YXIgb3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpLmdldE9wdGlvbnMoKTtcblxuZWxlbWVudFV0aWxpdGllcy5tYXBUeXBlID0gdW5kZWZpbmVkOyAvLyBpbml0aWFsaXplIG1hcCB0eXBlXG5cbmVsZW1lbnRVdGlsaXRpZXMuUEQgPSB7fTsgLy8gbmFtZXNwYWNlIGZvciBhbGwgUEQgc3BlY2lmaWMgc3R1ZmZcbmVsZW1lbnRVdGlsaXRpZXMuQUYgPSB7fTsgLy8gbmFtZXNwYWNlIGZvciBhbGwgQUYgc3BlY2lmaWMgc3R1ZmZcblxuZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllcyA9IHtcbiAgXCJwcm9jZXNzXCI6IHtcbiAgICB3aWR0aDogMTUsXG4gICAgaGVpZ2h0OiAxNSxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgfSxcbiAgXCJvbWl0dGVkIHByb2Nlc3NcIjoge1xuICAgIHdpZHRoOiAxNSxcbiAgICBoZWlnaHQ6IDE1LFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcInVuY2VydGFpbiBwcm9jZXNzXCI6IHtcbiAgICB3aWR0aDogMTUsXG4gICAgaGVpZ2h0OiAxNSxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgfSxcbiAgXCJhc3NvY2lhdGlvblwiOiB7XG4gICAgd2lkdGg6IDE1LFxuICAgIGhlaWdodDogMTUsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnIzcwNzA3MCcsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwiZGlzc29jaWF0aW9uXCI6IHtcbiAgICB3aWR0aDogMTUsXG4gICAgaGVpZ2h0OiAxNSxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgfSxcbiAgXCJtYWNyb21vbGVjdWxlXCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcInNpbXBsZSBjaGVtaWNhbFwiOiB7XG4gICAgd2lkdGg6IDM1LFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJzb3VyY2UgYW5kIHNpbmtcIjoge1xuICAgIHdpZHRoOiAyNSxcbiAgICBoZWlnaHQ6IDI1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwidGFnXCI6IHtcbiAgICB3aWR0aDogMzUsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcInBoZW5vdHlwZVwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwicGVydHVyYmluZyBhZ2VudFwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJjb21wbGV4XCI6IHtcbiAgICB3aWR0aDogNTAsXG4gICAgaGVpZ2h0OiA1MCxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcImNvbXBhcnRtZW50XCI6IHtcbiAgICB3aWR0aDogODAsXG4gICAgaGVpZ2h0OiA4MCxcbiAgICAnZm9udC1zaXplJzogMTQsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAzLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcImFuZFwiOiB7XG4gICAgd2lkdGg6IDI1LFxuICAgIGhlaWdodDogMjUsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwib3JcIjoge1xuICAgIHdpZHRoOiAyNSxcbiAgICBoZWlnaHQ6IDI1LFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcIm5vdFwiOiB7XG4gICAgd2lkdGg6IDI1LFxuICAgIGhlaWdodDogMjUsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwiY29uc3VtcHRpb25cIjoge1xuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICd3aWR0aCc6IDEuMjVcbiAgfSxcbiAgXCJwcm9kdWN0aW9uXCI6IHtcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAnd2lkdGgnOiAxLjI1XG4gIH0sXG4gIFwibW9kdWxhdGlvblwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcInN0aW11bGF0aW9uXCI6IHtcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAnd2lkdGgnOiAxLjI1XG4gIH0sXG4gIFwiY2F0YWx5c2lzXCI6IHtcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAnd2lkdGgnOiAxLjI1XG4gIH0sXG4gIFwiaW5oaWJpdGlvblwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcIm5lY2Vzc2FyeSBzdGltdWxhdGlvblwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcImxvZ2ljIGFyY1wiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcImVxdWl2YWxlbmNlIGFyY1wiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwiQkEgcGxhaW5cIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwiQkEgdW5zcGVjaWZpZWQgZW50aXR5XCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcIkJBIHNpbXBsZSBjaGVtaWNhbFwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJCQSBtYWNyb21vbGVjdWxlXCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcIkJBIG51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcIkJBIHBlcnR1cmJpbmcgYWdlbnRcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwiQkEgY29tcGxleFwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJkZWxheVwiOiB7XG4gICAgd2lkdGg6IDI1LFxuICAgIGhlaWdodDogMjUsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0NhbWJyaWEnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcInVua25vd24gaW5mbHVlbmNlXCI6IHtcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAnd2lkdGgnOiAxLjI1XG4gIH0sXG4gIFwicG9zaXRpdmUgaW5mbHVlbmNlXCI6IHtcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAnd2lkdGgnOiAxLjI1XG4gIH0sXG4gIFwibmVnYXRpdmUgaW5mbHVlbmNlXCI6IHtcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAnd2lkdGgnOiAxLjI1XG4gIH0sXG4gIFwic3VibWFwXCI6IHtcbiAgICB3aWR0aDogODAsXG4gICAgaGVpZ2h0OiA4MCxcbiAgICAnZm9udC1zaXplJzogMTQsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAyLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJyxcbiAgfSxcbn07XG5cblxuLypcbiAgc2VlIGh0dHA6Ly9qb3VybmFsLmltYmlvLmRlL2FydGljbGVzL3BkZi9qaWItMjYzLnBkZiBwLjQxIDwtLSBidXQgYmV3YXJlLCBvdXRkYXRlZFxuICBmb2xsb3dpbmcgdGFibGVzIGhhdmUgYmVlbiB1cGRhdGVkIHdpdGggUEQgbHZsMSB2Mi4wIG9mIE5vdmVtYmVyIDcsIDIwMTYgd29ya2luZyBkcmFmdFxuICBvbmx5IHRoZSBmb2xsb3dpbmcgdGhpbmdzIGhhdmUgYmVlbiBjaGFuZ2VkIGZyb20gMi4wICh0aGlzIHZlcnNpb24gaXMgbm90IGNsZWFyIG9uIGNvbm5lY3Rpdml0eSk6XG4gICAtIGVtcHR5IHNldCBoYXMgbm8gbGltaXQgb24gaXRzIGVkZ2UgY291bnRcbiAgIC0gbG9naWMgb3BlcmF0b3JzIGNhbiBiZSBzb3VyY2UgYW5kIHRhcmdldFxuICAgLSBsaW1pdCBvZiAxIGNhdGFseXNpcyBhbmQgMSBuZWNlc3Nhcnkgc3RpbXVsYXRpb24gb24gYSBwcm9jZXNzXG5cbiAgZm9yIGVhY2ggZWRnZSBjbGFzcyBhbmQgbm9kZWNsYXNzIGRlZmluZSAyIGNhc2VzOlxuICAgLSBub2RlIGNhbiBiZSBhIHNvdXJjZSBvZiB0aGlzIGVkZ2UgLT4gYXNTb3VyY2VcbiAgIC0gbm9kZSBjYW4gYmUgYSB0YXJnZXQgb2YgdGhpcyBlZGdlIC0+IGFzVGFyZ2V0XG4gIGZvciBib3RoIGNhc2VzLCB0ZWxscyBpZiBpdCBpcyBhbGxvd2VkIGFuZCB3aGF0IGlzIHRoZSBsaW1pdCBvZiBlZGdlcyBhbGxvd2VkLlxuICBMaW1pdHMgY2FuIGNvbmNlcm4gb25seSB0aGlzIHR5cGUgb2YgZWRnZSAobWF4RWRnZSkgb3IgdGhlIHRvdGFsIG51bWJlciBvZiBlZGdlcyBmb3IgdGhpcyBub2RlIChtYXhUb3RhbCkuXG4gIENvbnNpZGVyIHVuZGVmaW5lZCB0aGluZ3MgYXMgZmFsc2UvdW5hbGxvd2VkIC0+IHdoaXRlbGlzdCBiZWhhdmlvci5cblxuICB0aGUgbm9kZXMvZWRnZXMgY2xhc3MgbGlzdGVkIGJlbG93IGFyZSB0aG9zZSB1c2VkIGluIHRoZSBwcm9ncmFtLlxuICBGb3IgaW5zdGFuY2UgXCJjb21wYXJ0bWVudFwiIGlzbid0IGEgbm9kZSBpbiBTQkdOIHNwZWNzLlxuKi9cbmVsZW1lbnRVdGlsaXRpZXMuUEQuY29ubmVjdGl2aXR5Q29uc3RyYWludHMgPSB7XG4gIFwiY29uc3VtcHRpb25cIjoge1xuICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwidW5jZXJ0YWluIHByb2Nlc3NcIjogICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fVxuICB9LFxuICBcInByb2R1Y3Rpb25cIjoge1xuICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwic2ltcGxlIGNoZW1pY2FsXCI6ICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImRpc3NvY2lhdGlvblwiOiAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJub3RcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX1cbiAgfSxcbiAgXCJtb2R1bGF0aW9uXCI6IHtcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjogICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX1cbiAgfSxcbiAgXCJzdGltdWxhdGlvblwiOiB7XG4gICAgXCJtYWNyb21vbGVjdWxlXCI6ICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwic2ltcGxlIGNoZW1pY2FsXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wbGV4XCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInNvdXJjZSBhbmQgc2lua1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwidW5jZXJ0YWluIHByb2Nlc3NcIjogICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJub3RcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319XG4gIH0sXG4gIFwiY2F0YWx5c2lzXCI6IHtcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMX19LFxuICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMX19LFxuICAgIFwidW5jZXJ0YWluIHByb2Nlc3NcIjogICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMX19LFxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMX19LFxuICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJub3RcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319XG4gIH0sXG4gIFwiaW5oaWJpdGlvblwiOiB7XG4gICAgXCJtYWNyb21vbGVjdWxlXCI6ICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwic2ltcGxlIGNoZW1pY2FsXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wbGV4XCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInNvdXJjZSBhbmQgc2lua1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwidW5jZXJ0YWluIHByb2Nlc3NcIjogICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJub3RcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319XG4gIH0sXG4gIFwibmVjZXNzYXJ5IHN0aW11bGF0aW9uXCI6IHtcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjogICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxfX0sXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxfX0sXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxfX0sXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX0sXG4gIH0sXG4gIFwibG9naWMgYXJjXCI6IHtcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjogICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInByb2Nlc3NcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImFzc29jaWF0aW9uXCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImRpc3NvY2lhdGlvblwiOiAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfX0sXG4gIH0sXG4gIFwiZXF1aXZhbGVuY2UgYXJjXCI6IHtcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcInNvdXJjZSBhbmQgc2lua1wiOiAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjogICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcInByb2Nlc3NcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImFzc29jaWF0aW9uXCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImRpc3NvY2lhdGlvblwiOiAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fVxuICB9XG59O1xuXG4vKiBBRiBub2RlIGNvbm5lY3Rpdml0eSBydWxlc1xuICogU2VlOiBTeXN0ZW1zIEJpb2xvZ3kgR3JhcGhpY2FsIE5vdGF0aW9uOiBBY3Rpdml0eSBGbG93IGxhbmd1YWdlIExldmVsIDEsIFZlcnNpb24gMS4yLCBEYXRlOiBKdWx5IDI3LCAyMDE1XG4gKiAgIFNlY3Rpb24gMy4zLjE6IEFjdGl2aXR5IE5vZGVzIGNvbm5lY3Rpdml0eSBkZWZpbml0aW9uXG4gKiAgIFVSTDogaHR0cHM6Ly9kb2kub3JnLzEwLjIzOTAvYmllY29sbC1qaWItMjAxNS0yNjVcbiAqL1xuZWxlbWVudFV0aWxpdGllcy5BRi5jb25uZWN0aXZpdHlDb25zdHJhaW50cyA9IHtcbiAgXCJwb3NpdGl2ZSBpbmZsdWVuY2VcIjoge1xuICAgIFwiYmlvbG9naWNhbCBhY3Rpdml0eVwiOiAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJub3RcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwiZGVsYXlcIjogICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgfSxcbiAgXCJuZWdhdGl2ZSBpbmZsdWVuY2VcIjoge1xuICAgIFwiYmlvbG9naWNhbCBhY3Rpdml0eVwiOiAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJub3RcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwiZGVsYXlcIjogICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgfSxcbiAgXCJ1bmtub3duIGluZmx1ZW5jZVwiOiB7XG4gICAgXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI6ICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJkZWxheVwiOiAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICB9LFxuICBcIm5lY2Vzc2FyeSBzdGltdWxhdGlvblwiOiB7XG4gICAgXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI6ICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJkZWxheVwiOiAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICB9LFxuICBcImxvZ2ljIGFyY1wiOiB7XG4gICAgXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI6ICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJub3RcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX19LFxuICAgIFwiZGVsYXlcIjogICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9fSxcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgfSxcbiAgXCJlcXVpdmFsZW5jZSBhcmNcIjoge1xuICAgIFwiYmlvbG9naWNhbCBhY3Rpdml0eVwiOiAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge319LFxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge319LFxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiZGVsYXlcIjogICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICB9LFxufVxuLy8gaW5pdGlhbGl6ZSBhIGdsb2JhbCB1bml0IG9mIGluZm9ybWF0aW9uIG9iamVjdFxudmFyIHVvaV9vYmogPSB7fTtcbnVvaV9vYmouY2xhenogPSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIjtcbnVvaV9vYmoubGFiZWwgPSB7XG4gIHRleHQ6IFwiXCJcbn07XG5cbnVvaV9vYmouYmJveCA9IHtcbiAgIHc6IDMwLFxuICAgaDogMTJcbn07XG5cbi8vIFNlY3Rpb24gU3RhcnRcbi8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXG5cbi8vIHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84ODA5NDcyXG4vLyB3ZSBuZWVkIHRvIHRha2UgY2FyZSBvZiBvdXIgb3duIElEcyBiZWNhdXNlIHRoZSBvbmVzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGJ5IGN5dG9zY2FwZSAoYWxzbyBVVUlEKVxuLy8gZG9uJ3QgY29tcGx5IHdpdGggeHNkOlNJRCB0eXBlIHRoYXQgbXVzdCBub3QgYmVnaW4gd2l0aCBhIG51bWJlclxuZnVuY3Rpb24gZ2VuZXJhdGVVVUlEICgpIHsgLy8gUHVibGljIERvbWFpbi9NSVRcbiAgICB2YXIgZCA9IERhdGUubm93KCk7XG4gICAgaWYgKHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHBlcmZvcm1hbmNlLm5vdyA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgIGQgKz0gcGVyZm9ybWFuY2Uubm93KCk7IC8vdXNlIGhpZ2gtcHJlY2lzaW9uIHRpbWVyIGlmIGF2YWlsYWJsZVxuICAgIH1cbiAgICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgICAgICB2YXIgciA9IChkICsgTWF0aC5yYW5kb20oKSAqIDE2KSAlIDE2IHwgMDtcbiAgICAgICAgZCA9IE1hdGguZmxvb3IoZCAvIDE2KTtcbiAgICAgICAgcmV0dXJuIChjID09PSAneCcgPyByIDogKHIgJiAweDMgfCAweDgpKS50b1N0cmluZygxNik7XG4gICAgfSk7XG59XG5cbmVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSA9IGZ1bmN0aW9uICh4LCB5LCBub2RlUGFyYW1zLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KSB7XG4gIGlmICh0eXBlb2Ygbm9kZVBhcmFtcyAhPSAnb2JqZWN0Jyl7XG4gICAgdmFyIHNiZ25jbGFzcyA9IG5vZGVQYXJhbXM7XG4gIH0gZWxzZSB7XG4gICAgICB2YXIgc2JnbmNsYXNzID0gbm9kZVBhcmFtcy5jbGFzcztcbiAgICAgIHZhciBsYW5ndWFnZSA9IG5vZGVQYXJhbXMubGFuZ3VhZ2U7XG4gIH1cbiAgdmFyIGRlZmF1bHRQcm9wZXJ0aWVzID0gdGhpcy5kZWZhdWx0UHJvcGVydGllcztcbiAgdmFyIGRlZmF1bHRzID0gZGVmYXVsdFByb3BlcnRpZXNbc2JnbmNsYXNzXTtcblxuICB2YXIgd2lkdGggPSBkZWZhdWx0cyA/IGRlZmF1bHRzLndpZHRoIDogNTA7XG4gIHZhciBoZWlnaHQgPSBkZWZhdWx0cyA/IGRlZmF1bHRzLmhlaWdodCA6IDUwO1xuICBcbiAgdmFyIGNzcyA9IHt9O1xuXG5cbiAgaWYgKHZpc2liaWxpdHkpIHtcbiAgICBjc3MudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XG4gIH1cblxuICBpZiAoZGVmYXVsdHMgJiYgZGVmYXVsdHMubXVsdGltZXIpIHtcbiAgICBzYmduY2xhc3MgKz0gXCIgbXVsdGltZXJcIjtcbiAgfVxuICB2YXIgZGF0YSA9IHtcbiAgICBjbGFzczogc2JnbmNsYXNzLFxuXHRsYW5ndWFnZTogbGFuZ3VhZ2UsXG4gICAgYmJveDoge1xuICAgICAgaDogaGVpZ2h0LFxuICAgICAgdzogd2lkdGgsXG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH0sXG4gICAgc3RhdGVzYW5kaW5mb3M6IFtdLFxuICAgIHBvcnRzOiBbXSxcbiAgICBjbG9uZW1hcmtlcjogZGVmYXVsdHMgJiYgZGVmYXVsdHMuY2xvbmVtYXJrZXIgPyBkZWZhdWx0cy5jbG9uZW1hcmtlciA6IHVuZGVmaW5lZFxuICB9O1xuXG4gIGlmKGlkKSB7XG4gICAgZGF0YS5pZCA9IGlkO1xuICB9XG4gIGVsc2Uge1xuICAgIGRhdGEuaWQgPSBcIm53dE5fXCIgKyBnZW5lcmF0ZVVVSUQoKTtcbiAgfVxuICBcbiAgaWYgKHBhcmVudCkge1xuICAgIGRhdGEucGFyZW50ID0gcGFyZW50O1xuICB9XG5cbiAgdmFyIGVsZXMgPSBjeS5hZGQoe1xuICAgIGdyb3VwOiBcIm5vZGVzXCIsXG4gICAgZGF0YTogZGF0YSxcbiAgICBjc3M6IGNzcyxcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBuZXdOb2RlID0gZWxlc1tlbGVzLmxlbmd0aCAtIDFdO1xuICB2YXIgb3JkZXJpbmcgPSB0aGlzLmRlZmF1bHRQcm9wZXJ0aWVzW3NiZ25jbGFzcy5yZXBsYWNlKC9cXHMqbXVsdGltZXIkLywgJycpXVsncG9ydHMtb3JkZXJpbmcnXTsgLy8gR2V0IHRoZSBkZWZhdWx0IHBvcnRzIG9yZGVyaW5nIGZvciB0aGUgbm9kZXMgd2l0aCBnaXZlbiBzYmduY2xhc3NcblxuICAvLyBJZiB0aGVyZSBpcyBhIGRlZmF1bHQgcG9ydHMgb3JkZXJpbmcgZm9yIHRoZSBub2RlcyB3aXRoIGdpdmVuIHNiZ25jbGFzcyBhbmQgaXQgaXMgZGlmZmVyZW50IHRoYW4gJ25vbmUnIHNldCB0aGUgcG9ydHMgb3JkZXJpbmcgdG8gdGhhdCBvcmRlcmluZ1xuICBpZiAob3JkZXJpbmcgJiYgb3JkZXJpbmcgIT09ICdub25lJykge1xuICAgIHRoaXMuc2V0UG9ydHNPcmRlcmluZyhuZXdOb2RlLCBvcmRlcmluZyk7XG4gIH1cblxuICBpZiAobGFuZ3VhZ2UgPT0gXCJBRlwiICYmICFlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVNdWx0aXBsZVVuaXRPZkluZm9ybWF0aW9uKG5ld05vZGUpKXtcbiAgICBpZiAoc2JnbmNsYXNzICE9IFwiQkEgcGxhaW5cIikgIC8vIGlmIEFGIG5vZGUgY2FuIGhhdmUgbGFiZWwgaS5lOiBub3QgcGxhaW4gYmlvbG9naWNhbCBhY3Rpdml0eSBcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobmV3Tm9kZSwgdW9pX29iaik7XG4gIH1cblxuICByZXR1cm4gbmV3Tm9kZTtcbn07XG5cbmVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHRhcmdldCwgZWRnZVBhcmFtcywgaWQsIHZpc2liaWxpdHkpIHtcbiAgaWYgKHR5cGVvZiBlZGdlUGFyYW1zICE9ICdvYmplY3QnKXtcbiAgICB2YXIgc2JnbmNsYXNzID0gZWRnZVBhcmFtcztcbiAgfSBlbHNlIHtcbiAgICAgIHZhciBzYmduY2xhc3MgPSBlZGdlUGFyYW1zLmNsYXNzO1xuICAgICAgdmFyIGxhbmd1YWdlID0gZWRnZVBhcmFtcy5sYW5ndWFnZTtcbiAgfVxuICB2YXIgZGVmYXVsdFByb3BlcnRpZXMgPSB0aGlzLmRlZmF1bHRQcm9wZXJ0aWVzO1xuICB2YXIgZGVmYXVsdHMgPSBkZWZhdWx0UHJvcGVydGllc1tzYmduY2xhc3NdO1xuICBcbiAgdmFyIGNzcyA9IHt9O1xuXG4gIGlmICh2aXNpYmlsaXR5KSB7XG4gICAgY3NzLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xuICB9XG5cbiAgdmFyIGRhdGEgPSB7XG4gICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgY2xhc3M6IHNiZ25jbGFzcyxcbiAgICAgIGxhbmd1YWdlOiBsYW5ndWFnZSxcbiAgfTtcbiAgXG4gIGlmKGlkKSB7XG4gICAgZGF0YS5pZCA9IGlkO1xuICB9XG4gIGVsc2Uge1xuICAgIGRhdGEuaWQgPSBcIm53dEVfXCIgKyBnZW5lcmF0ZVVVSUQoKTtcbiAgfVxuICBcbiAgdmFyIHNvdXJjZU5vZGUgPSBjeS5nZXRFbGVtZW50QnlJZChzb3VyY2UpOyAvLyBUaGUgb3JpZ2luYWwgc291cmNlIG5vZGVcbiAgdmFyIHRhcmdldE5vZGUgPSBjeS5nZXRFbGVtZW50QnlJZCh0YXJnZXQpOyAvLyBUaGUgb3JpZ2luYWwgdGFyZ2V0IG5vZGVcbiAgdmFyIHNvdXJjZUhhc1BvcnRzID0gc291cmNlTm9kZS5kYXRhKCdwb3J0cycpLmxlbmd0aCA9PT0gMjtcbiAgdmFyIHRhcmdldEhhc1BvcnRzID0gdGFyZ2V0Tm9kZS5kYXRhKCdwb3J0cycpLmxlbmd0aCA9PT0gMjtcbiAgLy8gVGhlIHBvcnRzb3VyY2UgYW5kIHBvcnR0YXJnZXQgdmFyaWFibGVzXG4gIHZhciBwb3J0c291cmNlO1xuICB2YXIgcG9ydHRhcmdldDtcbiAgXG4gIC8qXG4gICAqIEdldCBpbnB1dC9vdXRwdXQgcG9ydCBpZCdzIG9mIGEgbm9kZSB3aXRoIHRoZSBhc3N1bXB0aW9uIHRoYXQgdGhlIG5vZGUgaGFzIHZhbGlkIHBvcnRzLlxuICAgKi9cbiAgdmFyIGdldElPUG9ydElkcyA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgdmFyIG5vZGVJbnB1dFBvcnRJZCwgbm9kZU91dHB1dFBvcnRJZDtcbiAgICB2YXIgbm9kZVBvcnRzT3JkZXJpbmcgPSBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXMuZ2V0UG9ydHNPcmRlcmluZyhub2RlKTtcbiAgICB2YXIgbm9kZVBvcnRzID0gbm9kZS5kYXRhKCdwb3J0cycpO1xuICAgIGlmICggbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdMLXRvLVInIHx8IG5vZGVQb3J0c09yZGVyaW5nID09PSAnUi10by1MJyApIHtcbiAgICAgIHZhciBsZWZ0UG9ydElkID0gbm9kZVBvcnRzWzBdLnggPCAwID8gbm9kZVBvcnRzWzBdLmlkIDogbm9kZVBvcnRzWzFdLmlkOyAvLyBUaGUgeCB2YWx1ZSBvZiBsZWZ0IHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgbmVnYXRpdmVcbiAgICAgIHZhciByaWdodFBvcnRJZCA9IG5vZGVQb3J0c1swXS54ID4gMCA/IG5vZGVQb3J0c1swXS5pZCA6IG5vZGVQb3J0c1sxXS5pZDsgLy8gVGhlIHggdmFsdWUgb2YgcmlnaHQgcG9ydCBpcyBzdXBwb3NlZCB0byBiZSBwb3NpdGl2ZVxuICAgICAgLypcbiAgICAgICAqIElmIHRoZSBwb3J0IG9yZGVyaW5nIGlzIGxlZnQgdG8gcmlnaHQgdGhlbiB0aGUgaW5wdXQgcG9ydCBpcyB0aGUgbGVmdCBwb3J0IGFuZCB0aGUgb3V0cHV0IHBvcnQgaXMgdGhlIHJpZ2h0IHBvcnQuXG4gICAgICAgKiBFbHNlIGlmIGl0IGlzIHJpZ2h0IHRvIGxlZnQgaXQgaXMgdmljZSB2ZXJzYVxuICAgICAgICovXG4gICAgICBub2RlSW5wdXRQb3J0SWQgPSBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ0wtdG8tUicgPyBsZWZ0UG9ydElkIDogcmlnaHRQb3J0SWQ7XG4gICAgICBub2RlT3V0cHV0UG9ydElkID0gbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdSLXRvLUwnID8gbGVmdFBvcnRJZCA6IHJpZ2h0UG9ydElkO1xuICAgIH1cbiAgICBlbHNlIGlmICggbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdULXRvLUInIHx8IG5vZGVQb3J0c09yZGVyaW5nID09PSAnQi10by1UJyApe1xuICAgICAgdmFyIHRvcFBvcnRJZCA9IG5vZGVQb3J0c1swXS55IDwgMCA/IG5vZGVQb3J0c1swXS5pZCA6IG5vZGVQb3J0c1sxXS5pZDsgLy8gVGhlIHkgdmFsdWUgb2YgdG9wIHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgbmVnYXRpdmVcbiAgICAgIHZhciBib3R0b21Qb3J0SWQgPSBub2RlUG9ydHNbMF0ueSA+IDAgPyBub2RlUG9ydHNbMF0uaWQgOiBub2RlUG9ydHNbMV0uaWQ7IC8vIFRoZSB5IHZhbHVlIG9mIGJvdHRvbSBwb3J0IGlzIHN1cHBvc2VkIHRvIGJlIHBvc2l0aXZlXG4gICAgICAvKlxuICAgICAgICogSWYgdGhlIHBvcnQgb3JkZXJpbmcgaXMgdG9wIHRvIGJvdHRvbSB0aGVuIHRoZSBpbnB1dCBwb3J0IGlzIHRoZSB0b3AgcG9ydCBhbmQgdGhlIG91dHB1dCBwb3J0IGlzIHRoZSBib3R0b20gcG9ydC5cbiAgICAgICAqIEVsc2UgaWYgaXQgaXMgcmlnaHQgdG8gbGVmdCBpdCBpcyB2aWNlIHZlcnNhXG4gICAgICAgKi9cbiAgICAgIG5vZGVJbnB1dFBvcnRJZCA9IG5vZGVQb3J0c09yZGVyaW5nID09PSAnVC10by1CJyA/IHRvcFBvcnRJZCA6IGJvdHRvbVBvcnRJZDtcbiAgICAgIG5vZGVPdXRwdXRQb3J0SWQgPSBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ0ItdG8tVCcgPyB0b3BQb3J0SWQgOiBib3R0b21Qb3J0SWQ7XG4gICAgfVxuICAgIFxuICAgIC8vIFJldHVybiBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgSU8gcG9ydHMgb2YgdGhlIG5vZGVcbiAgICByZXR1cm4ge1xuICAgICAgaW5wdXRQb3J0SWQ6IG5vZGVJbnB1dFBvcnRJZCxcbiAgICAgIG91dHB1dFBvcnRJZDogbm9kZU91dHB1dFBvcnRJZFxuICAgIH07XG4gIH07XG4gIFxuICAvLyBJZiBhdCBsZWFzdCBvbmUgZW5kIG9mIHRoZSBlZGdlIGhhcyBwb3J0cyB0aGVuIHdlIHNob3VsZCBkZXRlcm1pbmUgdGhlIHBvcnRzIHdoZXJlIHRoZSBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQuXG4gIGlmIChzb3VyY2VIYXNQb3J0cyB8fCB0YXJnZXRIYXNQb3J0cykge1xuICAgIHZhciBzb3VyY2VOb2RlSW5wdXRQb3J0SWQsIHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQsIHRhcmdldE5vZGVJbnB1dFBvcnRJZCwgdGFyZ2V0Tm9kZU91dHB1dFBvcnRJZDtcbiAgICBcbiAgICAvLyBJZiBzb3VyY2Ugbm9kZSBoYXMgcG9ydHMgc2V0IHRoZSB2YXJpYWJsZXMgZGVkaWNhdGVkIGZvciBpdHMgSU8gcG9ydHNcbiAgICBpZiAoIHNvdXJjZUhhc1BvcnRzICkge1xuICAgICAgdmFyIGlvUG9ydHMgPSBnZXRJT1BvcnRJZHMoc291cmNlTm9kZSk7XG4gICAgICBzb3VyY2VOb2RlSW5wdXRQb3J0SWQgPSBpb1BvcnRzLmlucHV0UG9ydElkO1xuICAgICAgc291cmNlTm9kZU91dHB1dFBvcnRJZCA9IGlvUG9ydHMub3V0cHV0UG9ydElkO1xuICAgIH1cbiAgICBcbiAgICAvLyBJZiB0YXJnZXQgbm9kZSBoYXMgcG9ydHMgc2V0IHRoZSB2YXJpYWJsZXMgZGVkaWNhdGVkIGZvciBpdHMgSU8gcG9ydHNcbiAgICBpZiAoIHRhcmdldEhhc1BvcnRzICkge1xuICAgICAgdmFyIGlvUG9ydHMgPSBnZXRJT1BvcnRJZHModGFyZ2V0Tm9kZSk7XG4gICAgICB0YXJnZXROb2RlSW5wdXRQb3J0SWQgPSBpb1BvcnRzLmlucHV0UG9ydElkO1xuICAgICAgdGFyZ2V0Tm9kZU91dHB1dFBvcnRJZCA9IGlvUG9ydHMub3V0cHV0UG9ydElkO1xuICAgIH1cblxuICAgIGlmIChzYmduY2xhc3MgPT09ICdjb25zdW1wdGlvbicpIHtcbiAgICAgIC8vIEEgY29uc3VtcHRpb24gZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBpbnB1dCBwb3J0IG9mIHRoZSB0YXJnZXQgbm9kZSB3aGljaCBpcyBzdXBwb3NlZCB0byBiZSBhIHByb2Nlc3MgKGFueSBraW5kIG9mKVxuICAgICAgcG9ydHRhcmdldCA9IHRhcmdldE5vZGVJbnB1dFBvcnRJZDtcbiAgICB9XG4gICAgZWxzZSBpZiAoc2JnbmNsYXNzID09PSAncHJvZHVjdGlvbicgfHwgdGhpcy5pc01vZHVsYXRpb25BcmNDbGFzcyhzYmduY2xhc3MpKSB7XG4gICAgICAvLyBBIHByb2R1Y3Rpb24gZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBvdXRwdXQgcG9ydCBvZiB0aGUgc291cmNlIG5vZGUgd2hpY2ggaXMgc3VwcG9zZWQgdG8gYmUgYSBwcm9jZXNzIChhbnkga2luZCBvZilcbiAgICAgIC8vIEEgbW9kdWxhdGlvbiBlZGdlIG1heSBoYXZlIGEgbG9naWNhbCBvcGVyYXRvciBhcyBzb3VyY2Ugbm9kZSBpbiB0aGlzIGNhc2UgdGhlIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgb3V0cHV0IHBvcnQgb2YgaXRcbiAgICAgIC8vIFRoZSBiZWxvdyBhc3NpZ25tZW50IHNhdGlzZnkgYWxsIG9mIHRoZXNlIGNvbmRpdGlvblxuICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PT0gJ2xvZ2ljIGFyYycpIHtcbiAgICAgIHZhciBzcmNDbGFzcyA9IHNvdXJjZU5vZGUuZGF0YSgnY2xhc3MnKTtcbiAgICAgIHZhciB0Z3RDbGFzcyA9IHRhcmdldE5vZGUuZGF0YSgnY2xhc3MnKTtcbiAgICAgIHZhciBpc1NvdXJjZUxvZ2ljYWxPcCA9IHNyY0NsYXNzID09PSAnYW5kJyB8fCBzcmNDbGFzcyA9PT0gJ29yJyB8fCBzcmNDbGFzcyA9PT0gJ25vdCc7XG4gICAgICB2YXIgaXNUYXJnZXRMb2dpY2FsT3AgPSB0Z3RDbGFzcyA9PT0gJ2FuZCcgfHwgdGd0Q2xhc3MgPT09ICdvcicgfHwgdGd0Q2xhc3MgPT09ICdub3QnO1xuICAgICAgXG4gICAgICBpZiAoaXNTb3VyY2VMb2dpY2FsT3AgJiYgaXNUYXJnZXRMb2dpY2FsT3ApIHtcbiAgICAgICAgLy8gSWYgYm90aCBlbmQgYXJlIGxvZ2ljYWwgb3BlcmF0b3JzIHRoZW4gdGhlIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgaW5wdXQgcG9ydCBvZiB0aGUgdGFyZ2V0IGFuZCB0aGUgb3V0cHV0IHBvcnQgb2YgdGhlIGlucHV0XG4gICAgICAgIHBvcnR0YXJnZXQgPSB0YXJnZXROb2RlSW5wdXRQb3J0SWQ7XG4gICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlT3V0cHV0UG9ydElkO1xuICAgICAgfS8vIElmIGp1c3Qgb25lIGVuZCBvZiBsb2dpY2FsIG9wZXJhdG9yIHRoZW4gdGhlIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgaW5wdXQgcG9ydCBvZiB0aGUgbG9naWNhbCBvcGVyYXRvclxuICAgICAgZWxzZSBpZiAoaXNTb3VyY2VMb2dpY2FsT3ApIHtcbiAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVJbnB1dFBvcnRJZDsgXG4gICAgICB9XG4gICAgICBlbHNlIGlmIChpc1RhcmdldExvZ2ljYWxPcCkge1xuICAgICAgICBwb3J0dGFyZ2V0ID0gdGFyZ2V0Tm9kZUlucHV0UG9ydElkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgLy8gVGhlIGRlZmF1bHQgcG9ydHNvdXJjZS9wb3J0dGFyZ2V0IGFyZSB0aGUgc291cmNlL3RhcmdldCB0aGVtc2VsdmVzLiBJZiB0aGV5IGFyZSBub3Qgc2V0IHVzZSB0aGVzZSBkZWZhdWx0cy5cbiAgLy8gVGhlIHBvcnRzb3VyY2UgYW5kIHBvcnR0YXJnZXQgYXJlIGRldGVybWluZWQgc2V0IHRoZW0gaW4gZGF0YSBvYmplY3QuIFxuICBkYXRhLnBvcnRzb3VyY2UgPSBwb3J0c291cmNlIHx8IHNvdXJjZTtcbiAgZGF0YS5wb3J0dGFyZ2V0ID0gcG9ydHRhcmdldCB8fCB0YXJnZXQ7XG5cbiAgdmFyIGVsZXMgPSBjeS5hZGQoe1xuICAgIGdyb3VwOiBcImVkZ2VzXCIsXG4gICAgZGF0YTogZGF0YSxcbiAgICBjc3M6IGNzc1xuICB9KTtcblxuICB2YXIgbmV3RWRnZSA9IGVsZXNbZWxlcy5sZW5ndGggLSAxXTtcbiAgXG4gIHJldHVybiBuZXdFZGdlO1xufTtcblxuZWxlbWVudFV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyA9IGZ1bmN0aW9uKF9zb3VyY2UsIF90YXJnZXQsIHByb2Nlc3NUeXBlKSB7XG4gIC8vIElmIHNvdXJjZSBhbmQgdGFyZ2V0IElEcyBhcmUgZ2l2ZW4gZ2V0IHRoZSBlbGVtZW50cyBieSBJRHNcbiAgdmFyIHNvdXJjZSA9IHR5cGVvZiBfc291cmNlID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9zb3VyY2UpIDogX3NvdXJjZTtcbiAgdmFyIHRhcmdldCA9IHR5cGVvZiBfdGFyZ2V0ID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF90YXJnZXQpIDogX3RhcmdldDtcbiAgXG4gIC8vIFByb2Nlc3MgcGFyZW50IHNob3VsZCBiZSB0aGUgY2xvc2VzdCBjb21tb24gYW5jZXN0b3Igb2YgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0IG5vZGVzXG4gIHZhciBwcm9jZXNzUGFyZW50ID0gY3kuY29sbGVjdGlvbihbc291cmNlWzBdLCB0YXJnZXRbMF1dKS5jb21tb25BbmNlc3RvcnMoKS5maXJzdCgpO1xuICBcbiAgLy8gUHJvY2VzcyBzaG91bGQgYmUgYXQgdGhlIG1pZGRsZSBvZiB0aGUgc291cmNlIGFuZCB0YXJnZXQgbm9kZXNcbiAgdmFyIHggPSAoIHNvdXJjZS5wb3NpdGlvbigneCcpICsgdGFyZ2V0LnBvc2l0aW9uKCd4JykgKSAvIDI7XG4gIHZhciB5ID0gKCBzb3VyY2UucG9zaXRpb24oJ3knKSArIHRhcmdldC5wb3NpdGlvbigneScpICkgLyAyO1xuICBcbiAgLy8gQ3JlYXRlIHRoZSBwcm9jZXNzIHdpdGggZ2l2ZW4vY2FsY3VsYXRlZCB2YXJpYWJsZXNcbiAgdmFyIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeCwgeSwgcHJvY2Vzc1R5cGUsIHVuZGVmaW5lZCwgcHJvY2Vzc1BhcmVudC5pZCgpKTtcbiAgICB2YXIgeGRpZmYgPSBzb3VyY2UucG9zaXRpb24oJ3gnKSAtIHRhcmdldC5wb3NpdGlvbigneCcpO1xuICAgIHZhciB5ZGlmZiA9IHNvdXJjZS5wb3NpdGlvbigneScpIC0gdGFyZ2V0LnBvc2l0aW9uKCd5JylcbiAgICBpZiAoTWF0aC5hYnMoeGRpZmYpID49IE1hdGguYWJzKHlkaWZmKSlcbiAgICB7XG4gICAgICAgIGlmICh4ZGlmZiA8IDApXG4gICAgICAgICAgICBjaGlzZS5lbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2VzcywgJ0wtdG8tUicpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjaGlzZS5lbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2VzcywgJ1ItdG8tTCcpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBpZiAoeWRpZmYgPCAwKVxuICAgICAgICAgICAgY2hpc2UuZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdULXRvLUInKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY2hpc2UuZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdCLXRvLVQnKTtcbiAgICB9XG5cblxuICAvLyBDcmVhdGUgdGhlIGVkZ2VzIG9uZSBpcyBiZXR3ZWVuIHRoZSBwcm9jZXNzIGFuZCB0aGUgc291cmNlIG5vZGUgKHdoaWNoIHNob3VsZCBiZSBhIGNvbnN1bXB0aW9uKSwgXG4gIC8vIHRoZSBvdGhlciBvbmUgaXMgYmV0d2VlbiB0aGUgcHJvY2VzcyBhbmQgdGhlIHRhcmdldCBub2RlICh3aGljaCBzaG91bGQgYmUgYSBwcm9kdWN0aW9uKS5cbiAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gcGxlYXNlIHJlZmVyIHRvIFNCR04tUEQgcmVmZXJlbmNlIGNhcmQuXG4gIHZhciBlZGdlQnR3U3JjID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHNvdXJjZS5pZCgpLCBwcm9jZXNzLmlkKCksICdjb25zdW1wdGlvbicpO1xuICB2YXIgZWRnZUJ0d1RndCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIHRhcmdldC5pZCgpLCAncHJvZHVjdGlvbicpO1xuICBcbiAgLy8gQ3JlYXRlIGEgY29sbGVjdGlvbiBpbmNsdWRpbmcgdGhlIGVsZW1lbnRzIGFuZCB0byBiZSByZXR1cm5lZFxuICB2YXIgY29sbGVjdGlvbiA9IGN5LmNvbGxlY3Rpb24oW3Byb2Nlc3NbMF0sIGVkZ2VCdHdTcmNbMF0sIGVkZ2VCdHdUZ3RbMF1dKTtcbiAgcmV0dXJuIGNvbGxlY3Rpb247XG59O1xuXG4vKlxuICogUmV0dXJucyBpZiB0aGUgZWxlbWVudHMgd2l0aCB0aGUgZ2l2ZW4gcGFyZW50IGNsYXNzIGNhbiBiZSBwYXJlbnQgb2YgdGhlIGVsZW1lbnRzIHdpdGggdGhlIGdpdmVuIG5vZGUgY2xhc3NcbiAqL1xuZWxlbWVudFV0aWxpdGllcy5pc1ZhbGlkUGFyZW50ID0gZnVuY3Rpb24oX25vZGVDbGFzcywgX3BhcmVudENsYXNzLCBub2RlKSB7XG4gIC8vIElmIG5vZGVDbGFzcyBhbmQgcGFyZW50Q2xhc3MgcGFyYW1zIGFyZSBlbGVtZW50cyBpdHNlbHZlcyBpbnN0ZWFkIG9mIHRoZWlyIGNsYXNzIG5hbWVzIGhhbmRsZSBpdFxuICB2YXIgbm9kZUNsYXNzID0gdHlwZW9mIF9ub2RlQ2xhc3MgIT09ICdzdHJpbmcnID8gX25vZGVDbGFzcy5kYXRhKCdjbGFzcycpIDogX25vZGVDbGFzcztcbiAgdmFyIHBhcmVudENsYXNzID0gX3BhcmVudENsYXNzICE9IHVuZGVmaW5lZCAmJiB0eXBlb2YgX3BhcmVudENsYXNzICE9PSAnc3RyaW5nJyA/IF9wYXJlbnRDbGFzcy5kYXRhKCdjbGFzcycpIDogX3BhcmVudENsYXNzO1xuICBcbiAgaWYgKHBhcmVudENsYXNzID09IHVuZGVmaW5lZCB8fCBwYXJlbnRDbGFzcyA9PT0gJ2NvbXBhcnRtZW50J1xuICAgICAgICAgIHx8IHBhcmVudENsYXNzID09PSAnc3VibWFwJykgeyAvLyBDb21wYXJ0bWVudHMsIHN1Ym1hcHMgYW5kIHRoZSByb290IGNhbiBpbmNsdWRlIGFueSB0eXBlIG9mIG5vZGVzXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZWxzZSBpZiAocGFyZW50Q2xhc3Muc3RhcnRzV2l0aCgnY29tcGxleCcpICYmICghbm9kZSB8fCBub2RlLmNvbm5lY3RlZEVkZ2VzKCkubGVuZ3RoID09IDApKSB7IC8vIENvbXBsZXhlcyBjYW4gb25seSBpbmNsdWRlIEVQTnMgd2hpY2ggZG8gbm90IGhhdmUgZWRnZXNcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKG5vZGVDbGFzcyk7XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTsgLy8gQ3VycmVudGx5IGp1c3QgJ2NvbXBhcnRtZW50JyBhbmQgJ2NvbXBsZXgnIGNvbXBvdW5kcyBhcmUgc3VwcG9ydGVkIHJldHVybiBmYWxzZSBmb3IgYW55IG90aGVyIHBhcmVudENsYXNzXG59O1xuXG4vKlxuICogVGhpcyBtZXRob2QgYXNzdW1lcyB0aGF0IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQgY29udGFpbnMgYXQgbGVhc3Qgb25lIG5vZGVcbiAqIGFuZCBhbGwgb2YgdGhlIG5vZGVzIGluY2x1ZGluZyBpbiBpdCBoYXZlIHRoZSBzYW1lIHBhcmVudC4gSXQgY3JlYXRlcyBhIGNvbXBvdW5kIGZvdCB0aGUgZ2l2ZW4gbm9kZXMgYW4gaGF2aW5nIHRoZSBnaXZlbiB0eXBlLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChub2Rlc1RvTWFrZUNvbXBvdW5kLCBjb21wb3VuZFR5cGUpIHtcbiAgdmFyIG9sZFBhcmVudElkID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwicGFyZW50XCIpO1xuICAvLyBUaGUgcGFyZW50IG9mIG5ldyBjb21wb3VuZCB3aWxsIGJlIHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kLiB4LCB5IGFuZCBpZCBwYXJhbWV0ZXJzIGFyZSBub3Qgc2V0LlxuICB2YXIgbmV3Q29tcG91bmQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUodW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbXBvdW5kVHlwZSwgdW5kZWZpbmVkLCBvbGRQYXJlbnRJZCk7XG4gIHZhciBuZXdDb21wb3VuZElkID0gbmV3Q29tcG91bmQuaWQoKTtcbiAgdmFyIG5ld0VsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVBhcmVudChub2Rlc1RvTWFrZUNvbXBvdW5kLCBuZXdDb21wb3VuZElkKTtcbiAgbmV3RWxlcyA9IG5ld0VsZXMudW5pb24obmV3Q29tcG91bmQpO1xuICByZXR1cm4gbmV3RWxlcztcbn07XG5cbi8qXG4gKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcbiAqIGluIHRoZSBjb21wbGV4LiBQYXJhbWV0ZXJzIGFyZSBleHBsYWluZWQgYmVsb3cuXG4gKiB0ZW1wbGF0ZVR5cGU6IFRoZSB0eXBlIG9mIHRoZSB0ZW1wbGF0ZSByZWFjdGlvbi4gSXQgbWF5IGJlICdhc3NvY2lhdGlvbicgb3IgJ2Rpc3NvY2lhdGlvbicgZm9yIG5vdy5cbiAqIG1hY3JvbW9sZWN1bGVMaXN0OiBUaGUgbGlzdCBvZiB0aGUgbmFtZXMgb2YgbWFjcm9tb2xlY3VsZXMgd2hpY2ggd2lsbCBpbnZvbHZlIGluIHRoZSByZWFjdGlvbi5cbiAqIGNvbXBsZXhOYW1lOiBUaGUgbmFtZSBvZiB0aGUgY29tcGxleCBpbiB0aGUgcmVhY3Rpb24uXG4gKiBwcm9jZXNzUG9zaXRpb246IFRoZSBtb2RhbCBwb3NpdGlvbiBvZiB0aGUgcHJvY2VzcyBpbiB0aGUgcmVhY3Rpb24uIFRoZSBkZWZhdWx0IHZhbHVlIGlzIHRoZSBjZW50ZXIgb2YgdGhlIGNhbnZhcy5cbiAqIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cbiAqIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiBUaGlzIG9wdGlvbiB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY29zZS1iaWxrZW50IGxheW91dCB3aXRoIHRoZSBzYW1lIG5hbWUuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDE1LlxuICogZWRnZUxlbmd0aDogVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSBtYWNyb21vbGVjdWxlcyBhdCB0aGUgYm90aCBzaWRlcy5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHRlbXBsYXRlVHlwZSwgbWFjcm9tb2xlY3VsZUxpc3QsIGNvbXBsZXhOYW1lLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgpIHtcbiAgdmFyIGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1tcIm1hY3JvbW9sZWN1bGVcIl07XG4gIHZhciB0ZW1wbGF0ZVR5cGUgPSB0ZW1wbGF0ZVR5cGU7XG4gIHZhciBwcm9jZXNzV2lkdGggPSBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW3RlbXBsYXRlVHlwZV0gPyBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW3RlbXBsYXRlVHlwZV0ud2lkdGggOiA1MDtcbiAgdmFyIG1hY3JvbW9sZWN1bGVXaWR0aCA9IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID8gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMud2lkdGggOiA1MDtcbiAgdmFyIG1hY3JvbW9sZWN1bGVIZWlnaHQgPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA/IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLmhlaWdodCA6IDUwO1xuICB2YXIgcHJvY2Vzc1Bvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uID8gcHJvY2Vzc1Bvc2l0aW9uIDogZWxlbWVudFV0aWxpdGllcy5jb252ZXJ0VG9Nb2RlbFBvc2l0aW9uKHt4OiBjeS53aWR0aCgpIC8gMiwgeTogY3kuaGVpZ2h0KCkgLyAyfSk7XG4gIHZhciBtYWNyb21vbGVjdWxlTGlzdCA9IG1hY3JvbW9sZWN1bGVMaXN0O1xuICB2YXIgY29tcGxleE5hbWUgPSBjb21wbGV4TmFtZTtcbiAgdmFyIG51bU9mTWFjcm9tb2xlY3VsZXMgPSBtYWNyb21vbGVjdWxlTGlzdC5sZW5ndGg7XG4gIHZhciB0aWxpbmdQYWRkaW5nVmVydGljYWwgPSB0aWxpbmdQYWRkaW5nVmVydGljYWwgPyB0aWxpbmdQYWRkaW5nVmVydGljYWwgOiAxNTtcbiAgdmFyIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID0gdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPyB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA6IDE1O1xuICB2YXIgZWRnZUxlbmd0aCA9IGVkZ2VMZW5ndGggPyBlZGdlTGVuZ3RoIDogNjA7XG5cbiAgY3kuc3RhcnRCYXRjaCgpO1xuXG4gIHZhciB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcztcbiAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgIHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG4gIH1cbiAgZWxzZSB7XG4gICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgfVxuXG4gIC8vQ3JlYXRlIHRoZSBwcm9jZXNzIGluIHRlbXBsYXRlIHR5cGVcbiAgdmFyIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCB0ZW1wbGF0ZVR5cGUpO1xuICBwcm9jZXNzLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gIC8vRGVmaW5lIHRoZSBzdGFydGluZyB5IHBvc2l0aW9uXG4gIHZhciB5UG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZNYWNyb21vbGVjdWxlcyAtIDEpIC8gMikgKiAobWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XG5cbiAgLy9DcmVhdGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXNcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1PZk1hY3JvbW9sZWN1bGVzOyBpKyspIHtcbiAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcywgeVBvc2l0aW9uLCBcIm1hY3JvbW9sZWN1bGVcIik7XG4gICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgbWFjcm9tb2xlY3VsZUxpc3RbaV0pO1xuXG4gICAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubmVjdGVkIHRvIHRoZSBuZXcgbWFjcm9tb2xlY3VsZVxuICAgIHZhciBuZXdFZGdlO1xuICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3Tm9kZS5pZCgpLCBwcm9jZXNzLmlkKCksICdjb25zdW1wdGlvbicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBuZXdOb2RlLmlkKCksICdwcm9kdWN0aW9uJyk7XG4gICAgfVxuXG4gICAgbmV3RWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgIC8vdXBkYXRlIHRoZSB5IHBvc2l0aW9uXG4gICAgeVBvc2l0aW9uICs9IG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XG4gIH1cblxuICAvL0NyZWF0ZSB0aGUgY29tcGxleCBpbmNsdWRpbmcgbWFjcm9tb2xlY3VsZXMgaW5zaWRlIG9mIGl0XG4gIC8vVGVtcHJvcmFyaWx5IGFkZCBpdCB0byB0aGUgcHJvY2VzcyBwb3NpdGlvbiB3ZSB3aWxsIG1vdmUgaXQgYWNjb3JkaW5nIHRvIHRoZSBsYXN0IHNpemUgb2YgaXRcbiAgdmFyIGNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCAnY29tcGxleCcpO1xuICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcblxuICAvL0lmIGEgbmFtZSBpcyBzcGVjaWZpZWQgZm9yIHRoZSBjb21wbGV4IHNldCBpdHMgbGFiZWwgYWNjb3JkaW5nbHlcbiAgaWYgKGNvbXBsZXhOYW1lKSB7XG4gICAgY29tcGxleC5kYXRhKCdsYWJlbCcsIGNvbXBsZXhOYW1lKTtcbiAgfVxuXG4gIC8vY3JlYXRlIHRoZSBlZGdlIGNvbm5uZWN0ZWQgdG8gdGhlIGNvbXBsZXhcbiAgdmFyIGVkZ2VPZkNvbXBsZXg7XG4gIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICBlZGdlT2ZDb21wbGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgY29tcGxleC5pZCgpLCAncHJvZHVjdGlvbicpO1xuICB9XG4gIGVsc2Uge1xuICAgIGVkZ2VPZkNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UoY29tcGxleC5pZCgpLCBwcm9jZXNzLmlkKCksICdjb25zdW1wdGlvbicpO1xuICB9XG4gIGVkZ2VPZkNvbXBsZXguZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgLy9DcmVhdGUgdGhlIG1hY3JvbW9sZWN1bGVzIGluc2lkZSB0aGUgY29tcGxleFxuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mTWFjcm9tb2xlY3VsZXM7IGkrKykge1xuICAgIC8vIEFkZCBhIG1hY3JvbW9sZWN1bGUgbm90IGhhdmluZyBhIHByZXZpb3VzbHkgZGVmaW5lZCBpZCBhbmQgaGF2aW5nIHRoZSBjb21wbGV4IGNyZWF0ZWQgaW4gdGhpcyByZWFjdGlvbiBhcyBwYXJlbnRcbiAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShjb21wbGV4LnBvc2l0aW9uKCd4JyksIGNvbXBsZXgucG9zaXRpb24oJ3knKSwgXCJtYWNyb21vbGVjdWxlXCIsIHVuZGVmaW5lZCwgY29tcGxleC5pZCgpKTtcbiAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgIG5ld05vZGUuZGF0YSgnbGFiZWwnLCBtYWNyb21vbGVjdWxlTGlzdFtpXSk7XG4gICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJywgdHJ1ZSk7XG4gIH1cbiAgXG4gIGN5LmVuZEJhdGNoKCk7XG5cbiAgdmFyIGxheW91dE5vZGVzID0gY3kubm9kZXMoJ1tqdXN0QWRkZWRMYXlvdXROb2RlXScpO1xuICBsYXlvdXROb2Rlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJyk7XG4gIHZhciBsYXlvdXQgPSBsYXlvdXROb2Rlcy5sYXlvdXQoe1xuICAgIG5hbWU6ICdjb3NlLWJpbGtlbnQnLFxuICAgIHJhbmRvbWl6ZTogZmFsc2UsXG4gICAgZml0OiBmYWxzZSxcbiAgICBhbmltYXRlOiBmYWxzZSxcbiAgICB0aWxpbmdQYWRkaW5nVmVydGljYWw6IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCxcbiAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXG4gICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgLy9yZS1wb3NpdGlvbiB0aGUgbm9kZXMgaW5zaWRlIHRoZSBjb21wbGV4XG4gICAgICB2YXIgc3VwcG9zZWRYUG9zaXRpb247XG4gICAgICB2YXIgc3VwcG9zZWRZUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueTtcblxuICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgICAgICBzdXBwb3NlZFhQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBjb21wbGV4Lm91dGVyV2lkdGgoKSAvIDI7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc3VwcG9zZWRYUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gY29tcGxleC5vdXRlcldpZHRoKCkgLyAyO1xuICAgICAgfVxuXG4gICAgICB2YXIgcG9zaXRpb25EaWZmWCA9IHN1cHBvc2VkWFBvc2l0aW9uIC0gY29tcGxleC5wb3NpdGlvbigneCcpO1xuICAgICAgdmFyIHBvc2l0aW9uRGlmZlkgPSBzdXBwb3NlZFlQb3NpdGlvbiAtIGNvbXBsZXgucG9zaXRpb24oJ3knKTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NpdGlvbkRpZmZYLCB5OiBwb3NpdGlvbkRpZmZZfSwgY29tcGxleCk7XG4gICAgfVxuICB9KTtcbiAgXG4gIC8vIERvIHRoaXMgY2hlY2sgZm9yIGN5dG9zY2FwZS5qcyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xuICAgIGxheW91dC5ydW4oKTtcbiAgfVxuXG4gIC8vZmlsdGVyIHRoZSBqdXN0IGFkZGVkIGVsZW1lbXRzIHRvIHJldHVybiB0aGVtIGFuZCByZW1vdmUganVzdCBhZGRlZCBtYXJrXG4gIHZhciBlbGVzID0gY3kuZWxlbWVudHMoJ1tqdXN0QWRkZWRdJyk7XG4gIGVsZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkJyk7XG4gIFxuICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gIGVsZXMuc2VsZWN0KCk7XG4gIFxuICByZXR1cm4gZWxlczsgLy8gUmV0dXJuIHRoZSBqdXN0IGFkZGVkIGVsZW1lbnRzXG59O1xuXG4vKlxuICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50ID0gZnVuY3Rpb24obm9kZXMsIG5ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XG4gIHZhciBuZXdQYXJlbnRJZCA9IG5ld1BhcmVudCA9PSB1bmRlZmluZWQgfHwgdHlwZW9mIG5ld1BhcmVudCA9PT0gJ3N0cmluZycgPyBuZXdQYXJlbnQgOiBuZXdQYXJlbnQuaWQoKTtcbiAgdmFyIG1vdmVkRWxlcyA9IG5vZGVzLm1vdmUoe1wicGFyZW50XCI6IG5ld1BhcmVudElkfSk7XG4gIGlmKHR5cGVvZiBwb3NEaWZmWCAhPSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgcG9zRGlmZlkgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyh7eDogcG9zRGlmZlgsIHk6IHBvc0RpZmZZfSwgbm9kZXMpO1xuICB9XG4gIGVsZW1lbnRVdGlsaXRpZXMubWFpbnRhaW5Qb2ludGVyKG1vdmVkRWxlcyk7XG4gIHJldHVybiBtb3ZlZEVsZXM7XG59O1xuXG4vLyBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuXG5lbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgcmF0aW8gPSB1bmRlZmluZWQ7XG4gICAgdmFyIGVsZU11c3RCZVNxdWFyZSA9IGVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlKG5vZGUuZGF0YSgnY2xhc3MnKSk7XG5cbiAgICAvLyBOb3RlIHRoYXQgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0IGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeVxuICAgIGlmICh3aWR0aCkge1xuICAgICAgaWYgKHVzZUFzcGVjdFJhdGlvIHx8IGVsZU11c3RCZVNxdWFyZSkge1xuICAgICAgICByYXRpbyA9IHdpZHRoIC8gbm9kZS53aWR0aCgpO1xuICAgICAgfVxuXG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSB3aWR0aDtcbiAgICB9XG5cbiAgICBpZiAoaGVpZ2h0KSB7XG4gICAgICBpZiAodXNlQXNwZWN0UmF0aW8gfHwgZWxlTXVzdEJlU3F1YXJlKSB7XG4gICAgICAgIHJhdGlvID0gaGVpZ2h0IC8gbm9kZS5oZWlnaHQoKTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gaGVpZ2h0O1xuICAgIH1cblxuICAgIGlmIChyYXRpbyAmJiAhaGVpZ2h0KSB7XG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBub2RlLmhlaWdodCgpICogcmF0aW87XG4gICAgfVxuICAgIGVsc2UgaWYgKHJhdGlvICYmICF3aWR0aCkge1xuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gbm9kZS53aWR0aCgpICogcmF0aW87XG4gICAgfVxuICB9XG59O1xuXG4vLyBTZWN0aW9uIEVuZFxuLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gQ29tbW9uIGVsZW1lbnQgcHJvcGVydGllc1xuXG4vLyBHZXQgY29tbW9uIHByb3BlcnRpZXMgb2YgZ2l2ZW4gZWxlbWVudHMuIFJldHVybnMgbnVsbCBpZiB0aGUgZ2l2ZW4gZWxlbWVudCBsaXN0IGlzIGVtcHR5IG9yIHRoZVxuLy8gcHJvcGVydHkgaXMgbm90IGNvbW1vbiBmb3IgYWxsIGVsZW1lbnRzLiBkYXRhT3JDc3MgcGFyYW1ldGVyIHNwZWNpZnkgd2hldGhlciB0byBjaGVjayB0aGUgcHJvcGVydHkgb24gZGF0YSBvciBjc3MuXG4vLyBUaGUgZGVmYXVsdCB2YWx1ZSBmb3IgaXQgaXMgZGF0YS4gSWYgcHJvcGVydHlOYW1lIHBhcmFtZXRlciBpcyBnaXZlbiBhcyBhIGZ1bmN0aW9uIGluc3RlYWQgb2YgYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBcbi8vIHByb3BlcnR5IG5hbWUgdGhlbiB1c2Ugd2hhdCB0aGF0IGZ1bmN0aW9uIHJldHVybnMuXG5lbGVtZW50VXRpbGl0aWVzLmdldENvbW1vblByb3BlcnR5ID0gZnVuY3Rpb24gKGVsZW1lbnRzLCBwcm9wZXJ0eU5hbWUsIGRhdGFPckNzcykge1xuICBpZiAoZWxlbWVudHMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBpc0Z1bmN0aW9uO1xuICAvLyBJZiB3ZSBhcmUgbm90IGNvbXBhcmluZyB0aGUgcHJvcGVydGllcyBkaXJlY3RseSB1c2VycyBjYW4gc3BlY2lmeSBhIGZ1bmN0aW9uIGFzIHdlbGxcbiAgaWYgKHR5cGVvZiBwcm9wZXJ0eU5hbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBpc0Z1bmN0aW9uID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIFVzZSBkYXRhIGFzIGRlZmF1bHRcbiAgaWYgKCFpc0Z1bmN0aW9uICYmICFkYXRhT3JDc3MpIHtcbiAgICBkYXRhT3JDc3MgPSAnZGF0YSc7XG4gIH1cblxuICB2YXIgdmFsdWUgPSBpc0Z1bmN0aW9uID8gcHJvcGVydHlOYW1lKGVsZW1lbnRzWzBdKSA6IGVsZW1lbnRzWzBdW2RhdGFPckNzc10ocHJvcGVydHlOYW1lKTtcblxuICBmb3IgKHZhciBpID0gMTsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCAoIGlzRnVuY3Rpb24gPyBwcm9wZXJ0eU5hbWUoZWxlbWVudHNbaV0pIDogZWxlbWVudHNbaV1bZGF0YU9yQ3NzXShwcm9wZXJ0eU5hbWUpICkgIT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbi8vIFJldHVybnMgaWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgYSB0cnV0aHkgdmFsdWUgZm9yIGFsbCBvZiB0aGUgZ2l2ZW4gZWxlbWVudHMuXG5lbGVtZW50VXRpbGl0aWVzLnRydWVGb3JBbGxFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVtZW50cywgZmNuKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIWZjbihlbGVtZW50c1tpXSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZSBlbGVtZW50IGNhbiBoYXZlIHNiZ25jYXJkaW5hbGl0eVxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkNhcmRpbmFsaXR5ID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICByZXR1cm4gZWxlLmRhdGEoJ2NsYXNzJykgPT0gJ2NvbnN1bXB0aW9uJyB8fCBlbGUuZGF0YSgnY2xhc3MnKSA9PSAncHJvZHVjdGlvbic7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBjYW4gaGF2ZSBzYmdubGFiZWxcbmVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbCA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgcmV0dXJuIHNiZ25jbGFzcyAhPSAnYW5kJyAmJiBzYmduY2xhc3MgIT0gJ29yJyAmJiBzYmduY2xhc3MgIT0gJ25vdCcgJiYgc2JnbmNsYXNzICE9ICdkZWxheSdcbiAgICAgICAgICAmJiBzYmduY2xhc3MgIT0gJ2Fzc29jaWF0aW9uJyAmJiBzYmduY2xhc3MgIT0gJ2Rpc3NvY2lhdGlvbicgJiYgc2JnbmNsYXNzICE9ICdzb3VyY2UgYW5kIHNpbmsnICYmICFzYmduY2xhc3MuZW5kc1dpdGgoJ3Byb2Nlc3MnKTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZSBlbGVtZW50IGhhdmUgdW5pdCBvZiBpbmZvcm1hdGlvblxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlVW5pdE9mSW5mb3JtYXRpb24gPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuXG4gIGlmIChzYmduY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUnIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4JyB8fCBzYmduY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCBtdWx0aW1lcidcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUgbXVsdGltZXInIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUgbXVsdGltZXInXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4IG11bHRpbWVyJyB8fCAoc2JnbmNsYXNzLnN0YXJ0c1dpdGgoJ0JBJykgJiYgc2JnbmNsYXNzICE9IFwiQkEgcGxhaW5cIilcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBhcnRtZW50Jykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBjYW4gaGF2ZSBtb3JlIHRoYW4gb25lIHVuaXRzIG9mIGluZm9ybWF0aW9uXG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVNdWx0aXBsZVVuaXRPZkluZm9ybWF0aW9uID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcbiAgcmV0dXJuICFzYmduY2xhc3Muc3RhcnRzV2l0aCgnQkEnKTtcbn07XG5cblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgaGF2ZSBzdGF0ZSB2YXJpYWJsZVxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU3RhdGVWYXJpYWJsZSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgaWYgKHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZScgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXgnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlIG11bHRpbWVyJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCBtdWx0aW1lcicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZSBzaG91bGQgYmUgc3F1YXJlIGluIHNoYXBlXG5lbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgcmV0dXJuIChzYmduY2xhc3MuaW5kZXhPZigncHJvY2VzcycpICE9IC0xIHx8IHNiZ25jbGFzcyA9PSAnc291cmNlIGFuZCBzaW5rJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYW5kJyB8fCBzYmduY2xhc3MgPT0gJ29yJyB8fCBzYmduY2xhc3MgPT0gJ25vdCdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2Fzc29jaWF0aW9uJyB8fCBzYmduY2xhc3MgPT0gJ2Rpc3NvY2lhdGlvbicgfHwgc2JnbmNsYXNzID09ICdkZWxheScpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIGFueSBvZiB0aGUgZ2l2ZW4gbm9kZXMgbXVzdCBub3QgYmUgaW4gc3F1YXJlIHNoYXBlXG5lbGVtZW50VXRpbGl0aWVzLnNvbWVNdXN0Tm90QmVTcXVhcmUgPSBmdW5jdGlvbiAobm9kZXMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZShub2RlLmRhdGEoJ2NsYXNzJykpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVzIGVsZW1lbnQgY2FuIGJlIGNsb25lZFxuZWxlbWVudFV0aWxpdGllcy5jYW5CZUNsb25lZCA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuXG4gIHZhciBsaXN0ID0ge1xuICAgICd1bnNwZWNpZmllZCBlbnRpdHknOiB0cnVlLFxuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcbiAgICAnY29tcGxleCc6IHRydWUsXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcbiAgICAncGVydHVyYmluZyBhZ2VudCc6IHRydWVcbiAgfTtcblxuICByZXR1cm4gbGlzdFtzYmduY2xhc3NdID8gdHJ1ZSA6IGZhbHNlO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlcyBlbGVtZW50IGNhbiBiZSBjbG9uZWRcbmVsZW1lbnRVdGlsaXRpZXMuY2FuQmVNdWx0aW1lciA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuXG4gIHZhciBsaXN0ID0ge1xuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcbiAgICAnY29tcGxleCc6IHRydWUsXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZVxuICB9O1xuXG4gIHJldHVybiBsaXN0W3NiZ25jbGFzc10gPyB0cnVlIDogZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgaXMgYW4gRVBOXG5lbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcblxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAndW5zcGVjaWZpZWQgZW50aXR5J1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZSdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCcpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGVtZW50IGlzIGEgUE5cbmVsZW1lbnRVdGlsaXRpZXMuaXNQTkNsYXNzID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XG5cbiAgcmV0dXJuIChzYmduY2xhc3MgPT0gJ3Byb2Nlc3MnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdvbWl0dGVkIHByb2Nlc3MnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICd1bmNlcnRhaW4gcHJvY2VzcydcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2Fzc29jaWF0aW9uJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnZGlzc29jaWF0aW9uJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAncGhlbm90eXBlJyk7XG59O1xuXG4vLyBSZXR1cm5zIHdldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBvciBzdHJpbmcgaXMgb2YgdGhlIHNwZWNpYWwgZW1wdHkgc2V0L3NvdXJjZSBhbmQgc2luayBjbGFzc1xuZWxlbWVudFV0aWxpdGllcy5pc0VtcHR5U2V0Q2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcbiAgcmV0dXJuIHNiZ25jbGFzcyA9PSAnc291cmNlIGFuZCBzaW5rJztcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhIGxvZ2ljYWwgb3BlcmF0b3JcbmVsZW1lbnRVdGlsaXRpZXMuaXNMb2dpY2FsT3BlcmF0b3IgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAnYW5kJyB8fCBzYmduY2xhc3MgPT0gJ29yJyB8fCBzYmduY2xhc3MgPT0gJ25vdCcgfHwgc2JnbmNsYXNzID09ICdkZWxheScpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBjbGFzcyBvZiBnaXZlbiBlbGVtZW50IGlzIGEgZXF1aXZhbGFuY2UgY2xhc3NcbmVsZW1lbnRVdGlsaXRpZXMuY29udmVuaWVudFRvRXF1aXZhbGVuY2UgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAndGFnJyB8fCBzYmduY2xhc3MgPT0gJ3Rlcm1pbmFsJyk7XG59O1xuXG4vLyBSZXR1cm5zIHdldGhlciB0aGUgY2xhc3Mgb2YgZ2l2ZW4gZWxlbW50IGlzIGEgbW9kdWxhdGlvbiBhcmMgYXMgZGVmaW5lZCBpbiBQRCBzcGVjc1xuZWxlbWVudFV0aWxpdGllcy5pc01vZHVsYXRpb25BcmNDbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG4gIHJldHVybiAoc2JnbmNsYXNzID09ICdtb2R1bGF0aW9uJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnc3RpbXVsYXRpb24nIHx8IHNiZ25jbGFzcyA9PSAnY2F0YWx5c2lzJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnaW5oaWJpdGlvbicgfHwgc2JnbmNsYXNzID09ICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKTtcbn1cblxuLy8gUmVsb2NhdGVzIHN0YXRlIGFuZCBpbmZvIGJveGVzLiBUaGlzIGZ1bmN0aW9uIGlzIGV4cGVjdGVkIHRvIGJlIGNhbGxlZCBhZnRlciBhZGQvcmVtb3ZlIHN0YXRlIGFuZCBpbmZvIGJveGVzXG5lbGVtZW50VXRpbGl0aWVzLnJlbG9jYXRlU3RhdGVBbmRJbmZvcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHN0YXRlQW5kSW5mb3MgPSAoZWxlLmlzTm9kZSAmJiBlbGUuaXNOb2RlKCkpID8gZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykgOiBlbGU7XG4gIHZhciBsZW5ndGggPSBzdGF0ZUFuZEluZm9zLmxlbmd0aDtcbiAgaWYgKGxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVsc2UgaWYgKGxlbmd0aCA9PSAxKSB7XG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAwO1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuICB9XG4gIGVsc2UgaWYgKGxlbmd0aCA9PSAyKSB7XG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAwO1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAwO1xuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC55ID0gNTA7XG4gIH1cbiAgZWxzZSBpZiAobGVuZ3RoID09IDMpIHtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IC0yNTtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcblxuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSAtNTA7XG5cbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IDA7XG4gICAgc3RhdGVBbmRJbmZvc1syXS5iYm94LnkgPSA1MDtcbiAgfVxuICBlbHNlIHtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IC0yNTtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcblxuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSAtNTA7XG5cbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IC0yNTtcbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xuXG4gICAgc3RhdGVBbmRJbmZvc1szXS5iYm94LnggPSAyNTtcbiAgICBzdGF0ZUFuZEluZm9zWzNdLmJib3gueSA9IDUwO1xuICB9XG59O1xuXG4vLyBDaGFuZ2Ugc3RhdGUgdmFsdWUgb3IgdW5pdCBvZiBpbmZvcm1hdGlvbiBib3ggb2YgZ2l2ZW4gbm9kZXMgd2l0aCBnaXZlbiBpbmRleC5cbi8vIFR5cGUgcGFyYW1ldGVyIGluZGljYXRlcyB3aGV0aGVyIHRvIGNoYW5nZSB2YWx1ZSBvciB2YXJpYWJsZSwgaXQgaXMgdmFsaWQgaWYgdGhlIGJveCBhdCB0aGUgZ2l2ZW4gaW5kZXggaXMgYSBzdGF0ZSB2YXJpYWJsZS5cbi8vIFZhbHVlIHBhcmFtZXRlciBpcyB0aGUgbmV3IHZhbHVlIHRvIHNldC5cbi8vIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIG9sZCB2YWx1ZSBvZiB0aGUgY2hhbmdlZCBkYXRhIChXZSBhc3N1bWUgdGhhdCB0aGUgb2xkIHZhbHVlIG9mIHRoZSBjaGFuZ2VkIGRhdGEgd2FzIHRoZSBzYW1lIGZvciBhbGwgbm9kZXMpLlxuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XG4gIHZhciByZXN1bHQ7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xuICAgIHZhciBib3ggPSBzdGF0ZUFuZEluZm9zW2luZGV4XTtcblxuICAgIGlmIChib3guY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7XG4gICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICByZXN1bHQgPSBib3guc3RhdGVbdHlwZV07XG4gICAgICB9XG5cbiAgICAgIGJveC5zdGF0ZVt0eXBlXSA9IHZhbHVlO1xuICAgIH1cbiAgICBlbHNlIGlmIChib3guY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdCA9IGJveC5sYWJlbC50ZXh0O1xuICAgICAgfVxuXG4gICAgICBib3gubGFiZWwudGV4dCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXG4vLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxuLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGp1c3QgYWRkZWQgYm94LlxuZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2Rlcywgb2JqKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuXG4gICAgdmFyIGxvY2F0aW9uT2JqO1xuICAgIGlmKG9iai5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xuICAgICAgaWYgKCFub2RlLmRhdGEoXCJsYW5ndWFnZVwiKSB8fCBub2RlLmRhdGEoXCJsYW5ndWFnZVwiKSA9PSBcIlBEXCIpe1xuICAgICAgICBsb2NhdGlvbk9iaiA9IHNiZ252aXouY2xhc3Nlcy5Vbml0T2ZJbmZvcm1hdGlvbi5jcmVhdGUobm9kZSwgb2JqLmxhYmVsLnRleHQsIG9iai5iYm94LCBvYmoubG9jYXRpb24sIG9iai5wb3NpdGlvbiwgb2JqLmluZGV4KTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKG5vZGUuZGF0YShcImxhbmd1YWdlXCIpID09IFwiQUZcIil7XG4gICAgICAgIGxvY2F0aW9uT2JqID0gc2JnbnZpei5jbGFzc2VzLlVuaXRPZkluZm9ybWF0aW9uLmNyZWF0ZShub2RlLCBvYmoubGFiZWwudGV4dCwgb2JqLmJib3gsIG9iai5sb2NhdGlvbiwgb2JqLnBvc2l0aW9uLCBvYmouaW5kZXgsXG4gICAgICAgICAgICBsaWJzLmN5dG9zY2FwZS5zYmduLkFmU2hhcGVGbiwgbGlicy5jeXRvc2NhcGUuc2Jnbi5BZlNoYXBlQXJnc0ZuKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAob2JqLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikge1xuICAgICAgbG9jYXRpb25PYmogPSBzYmdudml6LmNsYXNzZXMuU3RhdGVWYXJpYWJsZS5jcmVhdGUobm9kZSwgb2JqLnN0YXRlLnZhbHVlLCBvYmouc3RhdGUudmFyaWFibGUsIG9iai5iYm94LCBvYmoubG9jYXRpb24sIG9iai5wb3NpdGlvbiwgb2JqLmluZGV4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxvY2F0aW9uT2JqO1xufTtcblxuLy8gUmVtb3ZlIHRoZSBzdGF0ZSBvciBpbmZvIGJveGVzIG9mIHRoZSBnaXZlbiBub2RlcyBhdCBnaXZlbiBpbmRleC5cbi8vIFJldHVybnMgdGhlIHJlbW92ZWQgYm94LlxuZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2RlcywgbG9jYXRpb25PYmopIHtcbiAgdmFyIG9iajtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XG4gICAgdmFyIHVuaXQgPSBzdGF0ZUFuZEluZm9zW2xvY2F0aW9uT2JqLmluZGV4XTtcblxuICAgIG9iaiA9IHVuaXQucmVtb3ZlKCk7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxuLy8gU2V0IG11bHRpbWVyIHN0YXR1cyBvZiB0aGUgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cbmVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMgPSBmdW5jdGlvbiAobm9kZXMsIHN0YXR1cykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgc2JnbmNsYXNzID0gbm9kZS5kYXRhKCdjbGFzcycpO1xuICAgIHZhciBpc011bHRpbWVyID0gbm9kZS5kYXRhKCdjbGFzcycpLmVuZHNXaXRoKCcgbXVsdGltZXInKTtcblxuICAgIGlmIChzdGF0dXMpIHsgLy8gTWFrZSBtdWx0aW1lciBzdGF0dXMgdHJ1ZVxuICAgICAgaWYgKCFpc011bHRpbWVyKSB7XG4gICAgICAgIG5vZGUuZGF0YSgnY2xhc3MnLCBzYmduY2xhc3MgKyAnIG11bHRpbWVyJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgeyAvLyBNYWtlIG11bHRpbWVyIHN0YXR1cyBmYWxzZVxuICAgICAgaWYgKGlzTXVsdGltZXIpIHtcbiAgICAgICAgbm9kZS5kYXRhKCdjbGFzcycsIHNiZ25jbGFzcy5yZXBsYWNlKCcgbXVsdGltZXInLCAnJykpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuLy8gU2V0IGNsb25lIG1hcmtlciBzdGF0dXMgb2YgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cbmVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbiAobm9kZXMsIHN0YXR1cykge1xuICBpZiAoc3RhdHVzKSB7XG4gICAgbm9kZXMuZGF0YSgnY2xvbmVtYXJrZXInLCB0cnVlKTtcbiAgfVxuICBlbHNlIHtcbiAgICBub2Rlcy5yZW1vdmVEYXRhKCdjbG9uZW1hcmtlcicpO1xuICB9XG59O1xuXG4vL2VsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbigpXG5cbi8vIENoYW5nZSBmb250IHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIGVsZW1lbnRzIHdpdGggZ2l2ZW4gZm9udCBkYXRhXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKGVsZXMsIGRhdGEpIHtcbiAgZm9yICh2YXIgcHJvcCBpbiBkYXRhKSB7XG4gICAgZWxlcy5kYXRhKHByb3AsIGRhdGFbcHJvcF0pO1xuICB9XG59O1xuXG4vLyBUaGlzIGZ1bmN0aW9uIGdldHMgYW4gZWRnZSwgYW5kIGVuZHMgb2YgdGhhdCBlZGdlIChPcHRpb25hbGx5IGl0IG1heSB0YWtlIGp1c3QgdGhlIGNsYXNzZXMgb2YgdGhlIGVkZ2UgYXMgd2VsbCkgYXMgcGFyYW1ldGVycy5cbi8vIEl0IG1heSByZXR1cm4gJ3ZhbGlkJyAodGhhdCBlbmRzIGlzIHZhbGlkIGZvciB0aGF0IGVkZ2UpLCAncmV2ZXJzZScgKHRoYXQgZW5kcyBpcyBub3QgdmFsaWQgZm9yIHRoYXQgZWRnZSBidXQgdGhleSB3b3VsZCBiZSB2YWxpZCBcbi8vIGlmIHlvdSByZXZlcnNlIHRoZSBzb3VyY2UgYW5kIHRhcmdldCksICdpbnZhbGlkJyAodGhhdCBlbmRzIGFyZSB0b3RhbGx5IGludmFsaWQgZm9yIHRoYXQgZWRnZSkuXG5lbGVtZW50VXRpbGl0aWVzLnZhbGlkYXRlQXJyb3dFbmRzID0gZnVuY3Rpb24gKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0KSB7XG4gIC8vIGlmIG1hcCB0eXBlIGlzIFVua25vd24gLS0gbm8gcnVsZXMgYXBwbGllZFxuICBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgPT0gXCJVbmtub3duXCIgfHwgIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKVxuICAgIHJldHVybiBcInZhbGlkXCI7XG5cbiAgdmFyIGVkZ2VjbGFzcyA9IHR5cGVvZiBlZGdlID09PSAnc3RyaW5nJyA/IGVkZ2UgOiBlZGdlLmRhdGEoJ2NsYXNzJyk7XG4gIHZhciBzb3VyY2VjbGFzcyA9IHNvdXJjZS5kYXRhKCdjbGFzcycpO1xuICB2YXIgdGFyZ2V0Y2xhc3MgPSB0YXJnZXQuZGF0YSgnY2xhc3MnKTtcblxuICBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgPT0gXCJBRlwiKXtcbiAgICBpZiAoc291cmNlY2xhc3Muc3RhcnRzV2l0aChcIkJBXCIpKSAvLyB3ZSBoYXZlIHNlcGFyYXRlIGNsYXNzZXMgZm9yIGVhY2ggYmlvbG9naWNhbCBhY3Rpdml0eVxuICAgICAgc291cmNlY2xhc3MgPSBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjsgLy8gYnV0IHNhbWUgcnVsZSBhcHBsaWVzIHRvIGFsbCBvZiB0aGVtXG5cbiAgICBpZiAodGFyZ2V0Y2xhc3Muc3RhcnRzV2l0aChcIkJBXCIpKSAvLyB3ZSBoYXZlIHNlcGFyYXRlIGNsYXNzZXMgZm9yIGVhY2ggYmlvbG9naWNhbCBhY3Rpdml0eVxuICAgICAgdGFyZ2V0Y2xhc3MgPSBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjsgLy8gYnV0IHNhbWUgcnVsZSBhcHBsaWVzIHRvIGFsbCBvZiB0aGVtXG5cbiAgICB2YXIgZWRnZUNvbnN0cmFpbnRzID0gdGhpcy5BRi5jb25uZWN0aXZpdHlDb25zdHJhaW50c1tlZGdlY2xhc3NdO1xuICB9XG4gIGVsc2V7XG4gICAgc291cmNlY2xhc3MgPSBzb3VyY2VjbGFzcy5yZXBsYWNlKC9cXHMqbXVsdGltZXIkLywgJycpXG4gICAgdGFyZ2V0Y2xhc3MgPSB0YXJnZXRjbGFzcy5yZXBsYWNlKC9cXHMqbXVsdGltZXIkLywgJycpXG4gICAgdmFyIGVkZ2VDb25zdHJhaW50cyA9IHRoaXMuUEQuY29ubmVjdGl2aXR5Q29uc3RyYWludHNbZWRnZWNsYXNzXTtcbiAgfVxuICAvLyBnaXZlbiBhIG5vZGUsIGFjdGluZyBhcyBzb3VyY2Ugb3IgdGFyZ2V0LCByZXR1cm5zIGJvb2xlYW4gd2V0aGVyIG9yIG5vdCBpdCBoYXMgdG9vIG1hbnkgZWRnZXMgYWxyZWFkeVxuICBmdW5jdGlvbiBoYXNUb29NYW55RWRnZXMobm9kZSwgc291cmNlT3JUYXJnZXQpIHtcbiAgICB2YXIgbm9kZWNsYXNzID0gbm9kZS5kYXRhKCdjbGFzcycpO1xuICAgIG5vZGVjbGFzcyA9IG5vZGVjbGFzcy5yZXBsYWNlKC9cXHMqbXVsdGltZXIkLywgJycpO1xuICAgIGlmIChub2RlY2xhc3Muc3RhcnRzV2l0aChcIkJBXCIpKVxuICAgICAgbm9kZWNsYXNzID0gXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI7XG5cbiAgICB2YXIgdG90YWxUb29NYW55ID0gdHJ1ZTtcbiAgICB2YXIgZWRnZVRvb01hbnkgPSB0cnVlO1xuICAgIGlmIChzb3VyY2VPclRhcmdldCA9PSBcInNvdXJjZVwiKSB7XG4gICAgICAgIHZhciBzYW1lRWRnZUNvdW50T3V0ID0gbm9kZS5vdXRnb2VycygnZWRnZVtjbGFzcz1cIicrZWRnZWNsYXNzKydcIl0nKS5zaXplKCk7XG4gICAgICAgIHZhciB0b3RhbEVkZ2VDb3VudE91dCA9IG5vZGUub3V0Z29lcnMoJ2VkZ2UnKS5zaXplKCk7XG4gICAgICAgIC8vIGNoZWNrIHRoYXQgdGhlIHRvdGFsIGVkZ2UgY291bnQgaXMgd2l0aGluIHRoZSBsaW1pdHNcbiAgICAgICAgaWYgKHR5cGVvZiBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1NvdXJjZS5tYXhUb3RhbCA9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgfHwgdG90YWxFZGdlQ291bnRPdXQgPCBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1NvdXJjZS5tYXhUb3RhbCApIHtcbiAgICAgICAgICAgIHRvdGFsVG9vTWFueSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRoZW4gY2hlY2sgbGltaXRzIGZvciB0aGlzIHNwZWNpZmljIGVkZ2UgY2xhc3NcbiAgICAgICAgaWYgKHR5cGVvZiBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1NvdXJjZS5tYXhFZGdlID09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICB8fCBzYW1lRWRnZUNvdW50T3V0IDwgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNTb3VyY2UubWF4RWRnZSApIHtcbiAgICAgICAgICAgIGVkZ2VUb29NYW55ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgb25seSBvbmUgb2YgdGhlIGxpbWl0cyBpcyByZWFjaGVkIHRoZW4gZWRnZSBpcyBpbnZhbGlkXG4gICAgICAgIHJldHVybiB0b3RhbFRvb01hbnkgfHwgZWRnZVRvb01hbnk7XG4gICAgfVxuICAgIGVsc2UgeyAvLyBub2RlIGlzIHVzZWQgYXMgdGFyZ2V0XG4gICAgICAgIHZhciBzYW1lRWRnZUNvdW50SW4gPSBub2RlLmluY29tZXJzKCdlZGdlW2NsYXNzPVwiJytlZGdlY2xhc3MrJ1wiXScpLnNpemUoKTtcbiAgICAgICAgdmFyIHRvdGFsRWRnZUNvdW50SW4gPSBub2RlLmluY29tZXJzKCdlZGdlJykuc2l6ZSgpO1xuICAgICAgICBpZiAodHlwZW9mIGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heFRvdGFsID09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICB8fCB0b3RhbEVkZ2VDb3VudEluIDwgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNUYXJnZXQubWF4VG90YWwgKSB7XG4gICAgICAgICAgICB0b3RhbFRvb01hbnkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heEVkZ2UgPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgIHx8IHNhbWVFZGdlQ291bnRJbiA8IGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heEVkZ2UgKSB7XG4gICAgICAgICAgICBlZGdlVG9vTWFueSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b3RhbFRvb01hbnkgfHwgZWRnZVRvb01hbnk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzSW5Db21wbGV4KG5vZGUpIHtcbiAgICB2YXIgcGFyZW50Q2xhc3MgPSBub2RlLnBhcmVudCgpLmRhdGEoJ2NsYXNzJyk7XG4gICAgcmV0dXJuIHBhcmVudENsYXNzICYmIHBhcmVudENsYXNzLnN0YXJ0c1dpdGgoJ2NvbXBsZXgnKTtcbiAgfVxuXG4gIGlmIChpc0luQ29tcGxleChzb3VyY2UpIHx8IGlzSW5Db21wbGV4KHRhcmdldCkpIHsgLy8gc3VidW5pdHMgb2YgYSBjb21wbGV4IGFyZSBubyBsb25nZXIgRVBOcywgbm8gY29ubmVjdGlvbiBhbGxvd2VkXG4gICAgcmV0dXJuICdpbnZhbGlkJztcbiAgfVxuXG4gIC8vIGNoZWNrIG5hdHVyZSBvZiBjb25uZWN0aW9uXG4gIGlmIChlZGdlQ29uc3RyYWludHNbc291cmNlY2xhc3NdLmFzU291cmNlLmlzQWxsb3dlZCAmJiBlZGdlQ29uc3RyYWludHNbdGFyZ2V0Y2xhc3NdLmFzVGFyZ2V0LmlzQWxsb3dlZCkge1xuICAgIC8vIGNoZWNrIGFtb3VudCBvZiBjb25uZWN0aW9uc1xuICAgIGlmICghaGFzVG9vTWFueUVkZ2VzKHNvdXJjZSwgXCJzb3VyY2VcIikgJiYgIWhhc1Rvb01hbnlFZGdlcyh0YXJnZXQsIFwidGFyZ2V0XCIpICkge1xuICAgICAgcmV0dXJuICd2YWxpZCc7XG4gICAgfVxuICB9XG4gIC8vIHRyeSB0byByZXZlcnNlXG4gIGlmIChlZGdlQ29uc3RyYWludHNbdGFyZ2V0Y2xhc3NdLmFzU291cmNlLmlzQWxsb3dlZCAmJiBlZGdlQ29uc3RyYWludHNbc291cmNlY2xhc3NdLmFzVGFyZ2V0LmlzQWxsb3dlZCkge1xuICAgIGlmICghaGFzVG9vTWFueUVkZ2VzKHRhcmdldCwgXCJzb3VyY2VcIikgJiYgIWhhc1Rvb01hbnlFZGdlcyhzb3VyY2UsIFwidGFyZ2V0XCIpICkge1xuICAgICAgcmV0dXJuICdyZXZlcnNlJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuICdpbnZhbGlkJztcbn07XG5cbi8qXG4gKiBIaWRlIGdpdmVuIGVsZXMgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcbiAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5oaWRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGVsZXMsIGxheW91dHBhcmFtKSB7XG4gICAgdmFyIHJlc3VsdCA9IGN5LnZpZXdVdGlsaXRpZXMoKS5oaWRlKGVsZXMpOyAvLyBIaWRlIGdpdmVuIGVsZXNcbiAgICBpZiAodHlwZW9mIGxheW91dHBhcmFtID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGxheW91dHBhcmFtKCk7IC8vIElmIGxheW91dHBhcmFtIGlzIGEgZnVuY3Rpb24gZXhlY3V0ZSBpdFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIGxheW91dCA9IGN5LmxheW91dChsYXlvdXRwYXJhbSk7IC8vIElmIGxheW91dHBhcmFtIGlzIGxheW91dCBvcHRpb25zIGNhbGwgbGF5b3V0IHdpdGggdGhhdCBvcHRpb25zLlxuXG4gICAgICAgIC8vIERvIHRoaXMgY2hlY2sgZm9yIGN5dG9zY2FwZS5qcyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gICAgICAgIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xuICAgICAgICAgICAgbGF5b3V0LnJ1bigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qXG4gKiBVbmhpZGUgZ2l2ZW4gZWxlcyBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xuICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcbiAgdmFyIHJlc3VsdCA9IGN5LnZpZXdVdGlsaXRpZXMoKS5zaG93KGVsZXMpOyAvLyBTaG93IGdpdmVuIGVsZXNcbiAgaWYgKHR5cGVvZiBsYXlvdXRwYXJhbSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGxheW91dHBhcmFtKCk7IC8vIElmIGxheW91dHBhcmFtIGlzIGEgZnVuY3Rpb24gZXhlY3V0ZSBpdFxuICB9XG4gIGVsc2Uge1xuICAgIHZhciBsYXlvdXQgPSBjeS5sYXlvdXQobGF5b3V0cGFyYW0pOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBsYXlvdXQgb3B0aW9ucyBjYWxsIGxheW91dCB3aXRoIHRoYXQgb3B0aW9ucy5cbiAgICBcbiAgICAvLyBEbyB0aGlzIGNoZWNrIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xuICAgICAgbGF5b3V0LnJ1bigpO1xuICAgIH1cbiAgfVxuICBcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qXG4gKiBDaGFuZ2Ugc3R5bGUvY3NzIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlTWFwKSB7XG4gIGlmICggdHlwZW9mIHZhbHVlTWFwID09PSAnb2JqZWN0JyApIHtcbiAgICBjeS5zdGFydEJhdGNoKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICAgIGVsZS5jc3MobmFtZSwgdmFsdWVNYXBbZWxlLmlkKCldKTsgLy8gdmFsdWVNYXAgaXMgYW4gaWQgdG8gdmFsdWUgbWFwIHVzZSBpdCBpbiB0aGlzIHdheVxuICAgIH1cbiAgICBjeS5lbmRCYXRjaCgpO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZXMuY3NzKG5hbWUsIHZhbHVlTWFwKTsgLy8gdmFsdWVNYXAgaXMganVzdCBhIHN0cmluZyBzZXQgY3NzKCduYW1lJykgZm9yIGFsbCBlbGVzIHRvIHRoaXMgdmFsdWVcbiAgfVxufTtcblxuLypcbiAqIENoYW5nZSBkYXRhIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICBpZiAoIHR5cGVvZiB2YWx1ZU1hcCA9PT0gJ29iamVjdCcgKSB7XG4gICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XG4gICAgICBlbGUuZGF0YShuYW1lLCB2YWx1ZU1hcFtlbGUuaWQoKV0pOyAvLyB2YWx1ZU1hcCBpcyBhbiBpZCB0byB2YWx1ZSBtYXAgdXNlIGl0IGluIHRoaXMgd2F5XG4gICAgfVxuICAgIGN5LmVuZEJhdGNoKCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlcy5kYXRhKG5hbWUsIHZhbHVlTWFwKTsgLy8gdmFsdWVNYXAgaXMganVzdCBhIHN0cmluZyBzZXQgY3NzKCduYW1lJykgZm9yIGFsbCBlbGVzIHRvIHRoaXMgdmFsdWVcbiAgfVxufTtcblxuLypcbiAqIFJldHVybiB0aGUgc2V0IG9mIGFsbCBub2RlcyBwcmVzZW50IHVuZGVyIHRoZSBnaXZlbiBwb3NpdGlvblxuICogcmVuZGVyZWRQb3MgbXVzdCBiZSBhIHBvaW50IGRlZmluZWQgcmVsYXRpdmVseSB0byBjeXRvc2NhcGUgY29udGFpbmVyXG4gKiAobGlrZSByZW5kZXJlZFBvc2l0aW9uIGZpZWxkIG9mIGEgbm9kZSlcbiAqL1xuZWxlbWVudFV0aWxpdGllcy5nZXROb2Rlc0F0ID0gZnVuY3Rpb24ocmVuZGVyZWRQb3MpIHtcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcbiAgdmFyIHggPSByZW5kZXJlZFBvcy54O1xuICB2YXIgeSA9IHJlbmRlcmVkUG9zLnk7XG4gIHZhciByZXN1bHROb2RlcyA9IFtdO1xuICBmb3IodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHZhciByZW5kZXJlZEJib3ggPSBub2RlLnJlbmRlcmVkQm91bmRpbmdCb3goe1xuICAgICAgaW5jbHVkZU5vZGVzOiB0cnVlLFxuICAgICAgaW5jbHVkZUVkZ2VzOiBmYWxzZSxcbiAgICAgIGluY2x1ZGVMYWJlbHM6IGZhbHNlLFxuICAgICAgaW5jbHVkZVNoYWRvd3M6IGZhbHNlXG4gICAgfSk7XG4gICAgaWYgKHggPj0gcmVuZGVyZWRCYm94LngxICYmIHggPD0gcmVuZGVyZWRCYm94LngyKSB7XG4gICAgICBpZiAoeSA+PSByZW5kZXJlZEJib3gueTEgJiYgeSA8PSByZW5kZXJlZEJib3gueTIpIHtcbiAgICAgICAgcmVzdWx0Tm9kZXMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdE5vZGVzO1xufTtcblxuZWxlbWVudFV0aWxpdGllcy5kZW11bHRpbWVyaXplQ2xhc3MgPSBmdW5jdGlvbihzYmduY2xhc3MpIHtcbiAgcmV0dXJuIHNiZ25jbGFzcy5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0gbWFwVHlwZSAtIHR5cGUgb2YgdGhlIGN1cnJlbnQgbWFwIChQRCwgQUYgb3IgVW5rbm93bilcbiAqL1xuZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlID0gZnVuY3Rpb24obWFwVHlwZSl7XG4gIGVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZSA9IG1hcFR5cGU7XG4gIHJldHVybiBtYXBUeXBlO1xufVxuXG4vKipcbiAqIHJldHVybiAtIG1hcCB0eXBlXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZTtcbn1cbi8qKlxuICogUmVzZXRzIG1hcCB0eXBlXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMucmVzZXRNYXBUeXBlID0gZnVuY3Rpb24oKXtcbiAgICBlbGVtZW50VXRpbGl0aWVzLm1hcFR5cGUgPSB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogS2VlcCBjb25zaXN0ZW5jeSBvZiBsaW5rcyB0byBzZWxmIGluc2lkZSB0aGUgZGF0YSgpIHN0cnVjdHVyZS5cbiAqIFRoaXMgaXMgbmVlZGVkIHdoZW5ldmVyIGEgbm9kZSBjaGFuZ2VzIHBhcmVudHMsIGZvciBleGFtcGxlLFxuICogYXMgaXQgaXMgZGVzdHJveWVkIGFuZCByZWNyZWF0ZWQuIEJ1dCB0aGUgZGF0YSgpIHN0YXlzIGlkZW50aWNhbC5cbiAqIFRoaXMgY3JlYXRlcyBpbmNvbnNpc3RlbmNpZXMgZm9yIHRoZSBwb2ludGVycyBzdG9yZWQgaW4gZGF0YSgpLFxuICogYXMgdGhleSBub3cgcG9pbnQgdG8gYSBkZWxldGVkIG5vZGUuXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMubWFpbnRhaW5Qb2ludGVyID0gZnVuY3Rpb24gKGVsZXMpIHtcbiAgZWxlcy5ub2RlcygpLmZvckVhY2goZnVuY3Rpb24oZWxlKXtcbiAgICAvLyBza2lwIG5vZGVzIHdpdGhvdXQgYW55IGF1eGlsaWFyeSB1bml0c1xuICAgIGlmKCFlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKSB8fCBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKS5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IodmFyIHNpZGUgaW4gZWxlLmRhdGEoJ2F1eHVuaXRsYXlvdXRzJykpIHtcbiAgICAgIGVsZS5kYXRhKCdhdXh1bml0bGF5b3V0cycpW3NpZGVdLnBhcmVudE5vZGUgPSBlbGU7XG4gICAgfVxuICAgIGZvcih2YXIgaT0wOyBpIDwgZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykubGVuZ3RoOyBpKyspIHtcbiAgICAgIGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpW2ldLnBhcmVudCA9IGVsZTtcbiAgICB9XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVsZW1lbnRVdGlsaXRpZXM7XG4iLCIvKiBcbiAqIFV0aWxpdHkgZmlsZSB0byBnZXQgYW5kIHNldCB0aGUgbGlicmFyaWVzIHRvIHdoaWNoIHNiZ252aXogaXMgZGVwZW5kZW50IGZyb20gYW55IGZpbGUuXG4gKi9cblxudmFyIGxpYlV0aWxpdGllcyA9IGZ1bmN0aW9uKCl7XG59O1xuXG5saWJVdGlsaXRpZXMuc2V0TGlicyA9IGZ1bmN0aW9uKGxpYnMpIHtcbiAgdGhpcy5saWJzID0gbGlicztcbn07XG5cbmxpYlV0aWxpdGllcy5nZXRMaWJzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmxpYnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxpYlV0aWxpdGllczsiLCJ2YXIgb3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpLmdldE9wdGlvbnMoKTtcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG5cbi8qXG4gKiBUaGUgbWFpbiB1dGlsaXRpZXMgdG8gYmUgZXhwb3NlZCBkaXJlY3RseS5cbiAqL1xuZnVuY3Rpb24gbWFpblV0aWxpdGllcygpIHtcbn07XG5cbi8qXG4gKiBBZGRzIGEgbmV3IG5vZGUgd2l0aCB0aGUgZ2l2ZW4gY2xhc3MgYW5kIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlcy4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5hZGROb2RlID0gZnVuY3Rpb24oeCwgeSAsIG5vZGVQYXJhbXMsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcbiAgLy8gdXBkYXRlIG1hcCB0eXBlXG4gIGlmICh0eXBlb2Ygbm9kZVBhcmFtcyA9PSAnb2JqZWN0Jyl7XG5cbiAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKVxuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKG5vZGVQYXJhbXMubGFuZ3VhZ2UpO1xuICAgIGVsc2UgaWYgKGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpICE9IG5vZGVQYXJhbXMubGFuZ3VhZ2UpXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJVbmtub3duXCIpO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4LCB5LCBub2RlUGFyYW1zLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBuZXdOb2RlIDoge1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5LFxuICAgICAgICBjbGFzczogbm9kZVBhcmFtcyxcbiAgICAgICAgaWQ6IGlkLFxuICAgICAgICBwYXJlbnQ6IHBhcmVudCxcbiAgICAgICAgdmlzaWJpbGl0eTogdmlzaWJpbGl0eVxuICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZE5vZGVcIiwgcGFyYW0pO1xuICB9XG59O1xuXG4vKlxuICogQWRkcyBhIG5ldyBlZGdlIHdpdGggdGhlIGdpdmVuIGNsYXNzIGFuZCBoYXZpbmcgdGhlIGdpdmVuIHNvdXJjZSBhbmQgdGFyZ2V0IGlkcy4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5hZGRFZGdlID0gZnVuY3Rpb24oc291cmNlLCB0YXJnZXQsIGVkZ2VQYXJhbXMsIGlkLCB2aXNpYmlsaXR5KSB7XG4gIC8vIHVwZGF0ZSBtYXAgdHlwZVxuICBpZiAodHlwZW9mIGVkZ2VQYXJhbXMgPT0gJ29iamVjdCcpe1xuXG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSlcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShlZGdlUGFyYW1zLmxhbmd1YWdlKTtcbiAgICBlbHNlIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSAhPSBlZGdlUGFyYW1zLmxhbmd1YWdlKVxuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiVW5rbm93blwiKTtcbiAgfVxuICAvLyBHZXQgdGhlIHZhbGlkYXRpb24gcmVzdWx0XG4gIHZhciBlZGdlY2xhc3MgPSBlZGdlUGFyYW1zLmNsYXNzID8gZWRnZVBhcmFtcy5jbGFzcyA6IGVkZ2VQYXJhbXM7XG4gIHZhciB2YWxpZGF0aW9uID0gZWxlbWVudFV0aWxpdGllcy52YWxpZGF0ZUFycm93RW5kcyhlZGdlY2xhc3MsIGN5LmdldEVsZW1lbnRCeUlkKHNvdXJjZSksIGN5LmdldEVsZW1lbnRCeUlkKHRhcmdldCkpO1xuXG4gIC8vIElmIHZhbGlkYXRpb24gcmVzdWx0IGlzICdpbnZhbGlkJyBjYW5jZWwgdGhlIG9wZXJhdGlvblxuICBpZiAodmFsaWRhdGlvbiA9PT0gJ2ludmFsaWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICAvLyBJZiB2YWxpZGF0aW9uIHJlc3VsdCBpcyAncmV2ZXJzZScgcmV2ZXJzZSB0aGUgc291cmNlLXRhcmdldCBwYWlyIGJlZm9yZSBjcmVhdGluZyB0aGUgZWRnZVxuICBpZiAodmFsaWRhdGlvbiA9PT0gJ3JldmVyc2UnKSB7XG4gICAgdmFyIHRlbXAgPSBzb3VyY2U7XG4gICAgc291cmNlID0gdGFyZ2V0O1xuICAgIHRhcmdldCA9IHRlbXA7XG4gIH1cbiAgICAgIFxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHNvdXJjZSwgdGFyZ2V0LCBlZGdlUGFyYW1zLCBpZCwgdmlzaWJpbGl0eSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgbmV3RWRnZSA6IHtcbiAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICBjbGFzczogZWRnZVBhcmFtcyxcbiAgICAgICAgaWQ6IGlkLFxuICAgICAgICB2aXNpYmlsaXR5OiB2aXNpYmlsaXR5XG4gICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkRWRnZVwiLCBwYXJhbSk7XG4gIH1cbn07XG5cbi8qXG4gKiBBZGRzIGEgcHJvY2VzcyB3aXRoIGNvbnZlbmllbnQgZWRnZXMuIEZvciBtb3JlIGluZm9ybWF0aW9uIHBsZWFzZSBzZWUgJ2h0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvbmV3dC9pc3N1ZXMvOScuXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24oX3NvdXJjZSwgX3RhcmdldCwgcHJvY2Vzc1R5cGUpIHtcbiAgLy8gSWYgc291cmNlIGFuZCB0YXJnZXQgSURzIGFyZSBnaXZlbiBnZXQgdGhlIGVsZW1lbnRzIGJ5IElEc1xuICB2YXIgc291cmNlID0gdHlwZW9mIF9zb3VyY2UgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3NvdXJjZSkgOiBfc291cmNlO1xuICB2YXIgdGFyZ2V0ID0gdHlwZW9mIF90YXJnZXQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3RhcmdldCkgOiBfdGFyZ2V0O1xuICBcbiAgLy8gSWYgc291cmNlIG9yIHRhcmdldCBkb2VzIG5vdCBoYXZlIGFuIEVQTiBjbGFzcyB0aGUgb3BlcmF0aW9uIGlzIG5vdCB2YWxpZFxuICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyhzb3VyY2UpIHx8ICFlbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3ModGFyZ2V0KSkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMoX3NvdXJjZSwgX3RhcmdldCwgcHJvY2Vzc1R5cGUpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIHNvdXJjZTogX3NvdXJjZSxcbiAgICAgIHRhcmdldDogX3RhcmdldCxcbiAgICAgIHByb2Nlc3NUeXBlOiBwcm9jZXNzVHlwZVxuICAgIH07XG4gICAgXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzXCIsIHBhcmFtKTtcbiAgfVxufTtcblxuLy8gY29udmVydCBjb2xsYXBzZWQgY29tcG91bmQgbm9kZXMgdG8gc2ltcGxlIG5vZGVzXG4vLyBhbmQgdXBkYXRlIHBvcnQgdmFsdWVzIG9mIHBhc3RlZCBub2RlcyBhbmQgZWRnZXNcbnZhciBjbG9uZUNvbGxhcHNlZE5vZGVzQW5kUG9ydHMgPSBmdW5jdGlvbiAoZWxlc0JlZm9yZSl7XG4gIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgdmFyIGVsZXNBZnRlciA9IGN5LmVsZW1lbnRzKCk7XG4gIHZhciBlbGVzRGlmZiA9IGVsZXNBZnRlci5kaWZmKGVsZXNCZWZvcmUpLmxlZnQ7XG5cbiAgLy8gc2hhbGxvdyBjb3B5IGNvbGxhcHNlZCBub2RlcyAtIGNvbGxhcHNlZCBjb21wb3VuZHMgYmVjb21lIHNpbXBsZSBub2Rlc1xuICAvLyBkYXRhIHJlbGF0ZWQgdG8gY29sbGFwc2VkIG5vZGVzIGFyZSByZW1vdmVkIGZyb20gZ2VuZXJhdGVkIGNsb25lc1xuICAvLyByZWxhdGVkIGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vaVZpcy1hdC1CaWxrZW50L25ld3QvaXNzdWVzLzE0NVxuICB2YXIgY29sbGFwc2VkTm9kZXMgPSBlbGVzRGlmZi5maWx0ZXIoJ25vZGUuY3ktZXhwYW5kLWNvbGxhcHNlLWNvbGxhcHNlZC1ub2RlJyk7XG4gIFxuICBjb2xsYXBzZWROb2Rlcy5jb25uZWN0ZWRFZGdlcygpLnJlbW92ZSgpO1xuICBjb2xsYXBzZWROb2Rlcy5yZW1vdmVDbGFzcygnY3ktZXhwYW5kLWNvbGxhcHNlLWNvbGxhcHNlZC1ub2RlJyk7XG4gIGNvbGxhcHNlZE5vZGVzLnJlbW92ZURhdGEoJ2NvbGxhcHNlZENoaWxkcmVuJyk7XG4gIGNvbGxhcHNlZE5vZGVzLnJlbW92ZURhdGEoJ3Bvc2l0aW9uLWJlZm9yZS1jb2xsYXBzZSBzaXplLWJlZm9yZS1jb2xsYXBzZScpO1xuICBjb2xsYXBzZWROb2Rlcy5yZW1vdmVEYXRhKCdleHBhbmRjb2xsYXBzZVJlbmRlcmVkQ3VlU2l6ZSBleHBhbmRjb2xsYXBzZVJlbmRlcmVkU3RhcnRYIGV4cGFuZGNvbGxhcHNlUmVuZGVyZWRTdGFydFknKTtcblxuICAvLyBjbG9uaW5nIHBvcnRzXG4gIGVsZXNEaWZmLm5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbihfbm9kZSl7XG4gICAgaWYoX25vZGUuZGF0YShcInBvcnRzXCIpLmxlbmd0aCA9PSAyKXtcbiAgICAgICAgdmFyIG9sZFBvcnROYW1lMCA9IF9ub2RlLmRhdGEoXCJwb3J0c1wiKVswXS5pZDtcbiAgICAgICAgdmFyIG9sZFBvcnROYW1lMSA9IF9ub2RlLmRhdGEoXCJwb3J0c1wiKVsxXS5pZDtcbiAgICAgICAgX25vZGUuZGF0YShcInBvcnRzXCIpWzBdLmlkID0gX25vZGUuaWQoKSArIFwiLjFcIjtcbiAgICAgICAgX25vZGUuZGF0YShcInBvcnRzXCIpWzFdLmlkID0gX25vZGUuaWQoKSArIFwiLjJcIjtcbiAgICAgICAgXG4gICAgICAgIF9ub2RlLm91dGdvZXJzKCkuZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKF9lZGdlKXtcbiAgICAgICAgICBpZihfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiKSA9PSBvbGRQb3J0TmFtZTApe1xuICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIiwgX25vZGUuZGF0YShcInBvcnRzXCIpWzBdLmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZihfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiKSA9PSBvbGRQb3J0TmFtZTEpe1xuICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIiwgX25vZGUuZGF0YShcInBvcnRzXCIpWzFdLmlkKTsgXG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiLCBfbm9kZS5pZCgpKTsgXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgX25vZGUuaW5jb21lcnMoKS5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24oX2VkZ2Upe1xuICAgICAgICAgIGlmKF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIpID09IG9sZFBvcnROYW1lMCl7XG4gICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiLCBfbm9kZS5kYXRhKFwicG9ydHNcIilbMF0uaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmKF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIpID09IG9sZFBvcnROYW1lMSl7XG4gICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiLCBfbm9kZS5kYXRhKFwicG9ydHNcIilbMV0uaWQpOyBcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIsIF9ub2RlLmlkKCkpOyBcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgX25vZGUub3V0Z29lcnMoKS5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24oX2VkZ2Upe1xuICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiLCBfbm9kZS5pZCgpKTtcbiAgICAgIH0pO1xuICAgICAgX25vZGUuaW5jb21lcnMoKS5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24oX2VkZ2Upe1xuICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiLCBfbm9kZS5pZCgpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIGVsZXNEaWZmLnNlbGVjdCgpO1xufVxuXG4vKlxuICogQ2xvbmUgZ2l2ZW4gZWxlbWVudHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmNsb25lRWxlbWVudHMgPSBmdW5jdGlvbiAoZWxlcykge1xuICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGVsZXNCZWZvcmUgPSBjeS5lbGVtZW50cygpO1xuICBcbiAgdmFyIGNiID0gY3kuY2xpcGJvYXJkKCk7XG4gIHZhciBfaWQgPSBjYi5jb3B5KGVsZXMsIFwiY2xvbmVPcGVyYXRpb25cIik7XG5cbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwicGFzdGVcIiwge2lkOiBfaWR9KTtcbiAgfSBcbiAgZWxzZSB7XG4gICAgY2IucGFzdGUoX2lkKTtcbiAgfVxuICBjbG9uZUNvbGxhcHNlZE5vZGVzQW5kUG9ydHMoZWxlc0JlZm9yZSk7XG59O1xuXG4vKlxuICogQ29weSBnaXZlbiBlbGVtZW50cyB0byBjbGlwYm9hcmQuIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmNvcHlFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gIGN5LmNsaXBib2FyZCgpLmNvcHkoZWxlcyk7XG59O1xuXG4vKlxuICogUGFzdCB0aGUgZWxlbWVudHMgY29waWVkIHRvIGNsaXBib2FyZC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMucGFzdGVFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZWxlc0JlZm9yZSA9IGN5LmVsZW1lbnRzKCk7XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJwYXN0ZVwiKTtcbiAgfSBcbiAgZWxzZSB7XG4gICAgY3kuY2xpcGJvYXJkKCkucGFzdGUoKTtcbiAgfVxuICBjbG9uZUNvbGxhcHNlZE5vZGVzQW5kUG9ydHMoZWxlc0JlZm9yZSk7XG59O1xuXG4vKlxuICogQWxpZ25zIGdpdmVuIG5vZGVzIGluIGdpdmVuIGhvcml6b250YWwgYW5kIHZlcnRpY2FsIG9yZGVyLiBcbiAqIEhvcml6b250YWwgYW5kIHZlcnRpY2FsIHBhcmFtZXRlcnMgbWF5IGJlICdub25lJyBvciB1bmRlZmluZWQuXG4gKiBhbGlnblRvIHBhcmFtZXRlciBpbmRpY2F0ZXMgdGhlIGxlYWRpbmcgbm9kZS5cbiAqIFJlcXVyaXJlcyBjeXRvc2NhcGUtZ3JpZC1ndWlkZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuYWxpZ24gPSBmdW5jdGlvbiAobm9kZXMsIGhvcml6b250YWwsIHZlcnRpY2FsLCBhbGlnblRvKSB7XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImFsaWduXCIsIHtcbiAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgIGhvcml6b250YWw6IGhvcml6b250YWwsXG4gICAgICB2ZXJ0aWNhbDogdmVydGljYWwsXG4gICAgICBhbGlnblRvOiBhbGlnblRvXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbm9kZXMuYWxpZ24oaG9yaXpvbnRhbCwgdmVydGljYWwsIGFsaWduVG8pO1xuICB9XG59O1xuXG4vKlxuICogQ3JlYXRlIGNvbXBvdW5kIGZvciBnaXZlbiBub2Rlcy4gY29tcG91bmRUeXBlIG1heSBiZSAnY29tcGxleCcgb3IgJ2NvbXBhcnRtZW50Jy5cbiAqIFRoaXMgbWV0aG9kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKF9ub2RlcywgY29tcG91bmRUeXBlKSB7XG4gIHZhciBub2RlcyA9IF9ub2RlcztcbiAgLypcbiAgICogRWxlbWluYXRlIHRoZSBub2RlcyB3aGljaCBjYW5ub3QgaGF2ZSBhIHBhcmVudCB3aXRoIGdpdmVuIGNvbXBvdW5kIHR5cGVcbiAgICovXG4gIG5vZGVzID0gX25vZGVzLmZpbHRlcihmdW5jdGlvbiAoZWxlbWVudCwgaSkge1xuICAgIGlmKHR5cGVvZiBlbGVtZW50ID09PSBcIm51bWJlclwiKSB7XG4gICAgICBlbGVtZW50ID0gaTtcbiAgICB9XG4gICAgXG4gICAgdmFyIHNiZ25jbGFzcyA9IGVsZW1lbnQuZGF0YShcImNsYXNzXCIpO1xuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmlzVmFsaWRQYXJlbnQoc2JnbmNsYXNzLCBjb21wb3VuZFR5cGUsIGVsZW1lbnQpO1xuICB9KTtcbiAgXG4gIG5vZGVzID0gZWxlbWVudFV0aWxpdGllcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xuXG4gIC8vIEFsbCBlbGVtZW50cyBzaG91bGQgaGF2ZSB0aGUgc2FtZSBwYXJlbnQgYW5kIHRoZSBjb21tb24gcGFyZW50IHNob3VsZCBub3QgYmUgYSAnY29tcGxleCcgXG4gIC8vIGlmIGNvbXBvdW5kVHlwZSBpcyAnY29tcGFydGVudCdcbiAgLy8gYmVjYXVzZSB0aGUgb2xkIGNvbW1vbiBwYXJlbnQgd2lsbCBiZSB0aGUgcGFyZW50IG9mIHRoZSBuZXcgY29tcGFydG1lbnQgYWZ0ZXIgdGhpcyBvcGVyYXRpb24gYW5kXG4gIC8vICdjb21wbGV4ZXMnIGNhbm5vdCBpbmNsdWRlICdjb21wYXJ0bWVudHMnXG4gIGlmIChub2Rlcy5sZW5ndGggPT0gMCB8fCAhZWxlbWVudFV0aWxpdGllcy5hbGxIYXZlVGhlU2FtZVBhcmVudChub2RlcylcbiAgICAgICAgICB8fCAoIChjb21wb3VuZFR5cGUgPT09ICdjb21wYXJ0bWVudCcgfHwgY29tcG91bmRUeXBlID09ICdzdWJtYXAnKSAmJiBub2Rlcy5wYXJlbnQoKS5kYXRhKCdjbGFzcycpXG4gICAgICAgICAgJiYgbm9kZXMucGFyZW50KCkuZGF0YSgnY2xhc3MnKS5zdGFydHNXaXRoKCdjb21wbGV4JykgKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKGN5LnVuZG9SZWRvKCkpIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBjb21wb3VuZFR5cGU6IGNvbXBvdW5kVHlwZSxcbiAgICAgIG5vZGVzVG9NYWtlQ29tcG91bmQ6IG5vZGVzXG4gICAgfTtcblxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXNcIiwgcGFyYW0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKG5vZGVzLCBjb21wb3VuZFR5cGUpO1xuICB9XG59O1xuXG4vKlxuICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uIGFuZCBjaGVja3MgaWYgdGhlIG9wZXJhdGlvbiBpcyB2YWxpZC5cbiAqL1xubWFpblV0aWxpdGllcy5jaGFuZ2VQYXJlbnQgPSBmdW5jdGlvbihub2RlcywgX25ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XG4gIHZhciBuZXdQYXJlbnQgPSB0eXBlb2YgX25ld1BhcmVudCA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfbmV3UGFyZW50KSA6IF9uZXdQYXJlbnQ7XG4gIC8vIE5ldyBwYXJlbnQgaXMgc3VwcG9zZWQgdG8gYmUgb25lIG9mIHRoZSByb290LCBhIGNvbXBsZXggb3IgYSBjb21wYXJ0bWVudFxuICBpZiAobmV3UGFyZW50ICYmICFuZXdQYXJlbnQuZGF0YShcImNsYXNzXCIpLnN0YXJ0c1dpdGgoXCJjb21wbGV4XCIpICYmIG5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikgIT0gXCJjb21wYXJ0bWVudFwiXG4gICAgICAgICAgJiYgbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKSAhPSBcInN1Ym1hcFwiKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8qXG4gICAqIEVsZW1pbmF0ZSB0aGUgbm9kZXMgd2hpY2ggY2Fubm90IGhhdmUgdGhlIG5ld1BhcmVudCBhcyB0aGVpciBwYXJlbnRcbiAgICovXG4gIG5vZGVzID0gbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XG4gICAgaWYodHlwZW9mIGVsZW1lbnQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZW1lbnQgPSBpO1xuICAgIH1cbiAgICBcbiAgICB2YXIgc2JnbmNsYXNzID0gZWxlbWVudC5kYXRhKFwiY2xhc3NcIik7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNWYWxpZFBhcmVudChzYmduY2xhc3MsIG5ld1BhcmVudCwgZWxlbWVudCk7XG4gIH0pO1xuICBcbiAgLy8gRGlzY2FyZCB0aGUgbm9kZXMgd2hvc2UgcGFyZW50IGlzIGFscmVhZHkgbmV3UGFyZW50LlxuICAvLyBEaXNjYXJkIHRoZSBuZXdQYXJlbnQgaXRzZWxmIGlmIGl0IGlzIGFtb25nIHRoZSBub2Rlc1xuICBub2RlcyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZWxlLCBpKSB7XG4gICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZWxlID0gaTtcbiAgICB9XG4gICAgXG4gICAgLy8gRGlzY2FyZCB0aGUgbmV3UGFyZW50IGlmIGl0IGlzIGFtb25nIHRoZSBub2Rlc1xuICAgIGlmIChuZXdQYXJlbnQgJiYgZWxlLmlkKCkgPT09IG5ld1BhcmVudC5pZCgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIERpc2NhcmQgdGhlIG5vZGVzIHdob3NlIHBhcmVudCBpcyBhbHJlYWR5IG5ld1BhcmVudFxuICAgIGlmICghbmV3UGFyZW50KSB7XG4gICAgICByZXR1cm4gZWxlLmRhdGEoJ3BhcmVudCcpICE9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBlbGUuZGF0YSgncGFyZW50JykgIT09IG5ld1BhcmVudC5pZCgpO1xuICB9KTtcblxuICAvLyBJZiBzb21lIG5vZGVzIGFyZSBhbmNlc3RvciBvZiBuZXcgcGFyZW50IGVsZW1pbmF0ZSB0aGVtXG4gIGlmIChuZXdQYXJlbnQpIHtcbiAgICBub2RlcyA9IG5vZGVzLmRpZmZlcmVuY2UobmV3UGFyZW50LmFuY2VzdG9ycygpKTtcbiAgfVxuXG4gIC8vIElmIGFsbCBub2RlcyBhcmUgZWxlbWluYXRlZCByZXR1cm4gZGlyZWN0bHlcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEp1c3QgbW92ZSB0aGUgdG9wIG1vc3Qgbm9kZXNcbiAgbm9kZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldFRvcE1vc3ROb2Rlcyhub2Rlcyk7XG4gIFxuICB2YXIgcGFyZW50SWQgPSBuZXdQYXJlbnQgPyBuZXdQYXJlbnQuaWQoKSA6IG51bGw7XG5cbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBmaXJzdFRpbWU6IHRydWUsXG4gICAgICBwYXJlbnREYXRhOiBwYXJlbnRJZCwgLy8gSXQga2VlcHMgdGhlIG5ld1BhcmVudElkIChKdXN0IGFuIGlkIGZvciBlYWNoIG5vZGVzIGZvciB0aGUgZmlyc3QgdGltZSlcbiAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgIHBvc0RpZmZYOiBwb3NEaWZmWCxcbiAgICAgIHBvc0RpZmZZOiBwb3NEaWZmWSxcbiAgICAgIC8vIFRoaXMgaXMgbmVlZGVkIGJlY2F1c2UgdGhlIGNoYW5nZVBhcmVudCBmdW5jdGlvbiBjYWxsZWQgaXMgbm90IGZyb20gZWxlbWVudFV0aWxpdGllc1xuICAgICAgLy8gYnV0IGZyb20gdGhlIHVuZG9SZWRvIGV4dGVuc2lvbiBkaXJlY3RseSwgc28gbWFpbnRhaW5pbmcgcG9pbnRlciBpcyBub3QgYXV0b21hdGljYWxseSBkb25lLlxuICAgICAgY2FsbGJhY2s6IGVsZW1lbnRVdGlsaXRpZXMubWFpbnRhaW5Qb2ludGVyXG4gICAgfTtcblxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VQYXJlbnRcIiwgcGFyYW0pOyAvLyBUaGlzIGFjdGlvbiBpcyByZWdpc3RlcmVkIGJ5IHVuZG9SZWRvIGV4dGVuc2lvblxuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50KG5vZGVzLCBwYXJlbnRJZCwgcG9zRGlmZlgsIHBvc0RpZmZZKTtcbiAgfVxufTtcblxuLypcbiAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxuICogaW4gdGhlIGNvbXBsZXguIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSB0aGUgc2FtZSBmdW5jdGlvbiBpbiBlbGVtZW50VXRpbGl0aWVzXG4gKi9cbm1haW5VdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKSB7XG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbih0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICB0ZW1wbGF0ZVR5cGU6IHRlbXBsYXRlVHlwZSxcbiAgICAgIG1hY3JvbW9sZWN1bGVMaXN0OiBtYWNyb21vbGVjdWxlTGlzdCxcbiAgICAgIGNvbXBsZXhOYW1lOiBjb21wbGV4TmFtZSxcbiAgICAgIHByb2Nlc3NQb3NpdGlvbjogcHJvY2Vzc1Bvc2l0aW9uLFxuICAgICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXG4gICAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXG4gICAgICBlZGdlTGVuZ3RoOiBlZGdlTGVuZ3RoXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlVGVtcGxhdGVSZWFjdGlvblwiLCBwYXJhbSk7XG4gIH1cbn07XG5cbi8qXG4gKiBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuIFxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbykge1xuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgdXNlQXNwZWN0UmF0aW86IHVzZUFzcGVjdFJhdGlvLFxuICAgICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZVxuICAgIH07XG4gICAgXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInJlc2l6ZU5vZGVzXCIsIHBhcmFtKTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbyk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vKlxuICogQ2hhbmdlcyB0aGUgbGFiZWwgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBsYWJlbC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5jaGFuZ2VOb2RlTGFiZWwgPSBmdW5jdGlvbihub2RlcywgbGFiZWwpIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBsYWJlbCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlTm9kZUxhYmVsXCIsIHBhcmFtKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIGZvciBnaXZlbiBub2RlcyB1c2UgdGhlIGdpdmVuIGZvbnQgZGF0YS5cbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbihlbGVzLCBkYXRhKSB7XG4gIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBlbGVzOiBlbGVzLFxuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgIH07XG5cbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgcGFyYW0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgZGF0YSk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vKlxuICogQ2hhbmdlIHN0YXRlIHZhbHVlIG9yIHVuaXQgb2YgaW5mb3JtYXRpb24gYm94IG9mIGdpdmVuIG5vZGVzIHdpdGggZ2l2ZW4gaW5kZXguXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHBhcmFtZXRlcnMgc2VlIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3hcbiAqL1xubWFpblV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uKG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3gobm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXG4vLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxuLy8gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2Rlcywgb2JqKSB7XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgb2JqOiBvYmosXG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxuLy8gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgpIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2Rlcywge2luZGV4OiBpbmRleH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGxvY2F0aW9uT2JqOiB7aW5kZXg6IGluZGV4fSxcbiAgICAgIG5vZGVzOiBub2Rlc1xuICAgIH07XG5cbiAgICBjeS51bmRvUmVkbygpLmRvKFwicmVtb3ZlU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLypcbiAqIFNldCBtdWx0aW1lciBzdGF0dXMgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24obm9kZXMsIHN0YXR1cykge1xuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgfTtcblxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXRNdWx0aW1lclN0YXR1c1wiLCBwYXJhbSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBTZXQgY2xvbmUgbWFya2VyIHN0YXR1cyBvZiBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqLyBcbm1haW5VdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbihub2Rlcywgc3RhdHVzKSB7XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgc3RhdHVzOiBzdGF0dXMsXG4gICAgICBub2Rlczogbm9kZXMsXG4gICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICB9O1xuXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNldENsb25lTWFya2VyU3RhdHVzXCIsIHBhcmFtKTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLypcbiAqIENoYW5nZSBzdHlsZS9jc3Mgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gZ2l2ZW4gdmFsdWUvdmFsdWVzIChOb3RlIHRoYXQgdmFsdWVNYXAgcGFyYW1ldGVyIG1heSBiZVxuICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuY2hhbmdlQ3NzID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcbiAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyhlbGVzLCBuYW1lLCB2YWx1ZU1hcCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgZWxlczogZWxlcyxcbiAgICAgIHZhbHVlTWFwOiB2YWx1ZU1hcCxcbiAgICAgIG5hbWU6IG5hbWVcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VDc3NcIiwgcGFyYW0pO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLypcbiAqIENoYW5nZSBkYXRhIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmNoYW5nZURhdGEgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShlbGVzLCBuYW1lLCB2YWx1ZU1hcCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgZWxlczogZWxlcyxcbiAgICAgIHZhbHVlTWFwOiB2YWx1ZU1hcCxcbiAgICAgIG5hbWU6IG5hbWVcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VEYXRhXCIsIHBhcmFtKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cblxuLypcbiAqIEhpZGVzIGdpdmVuIGVsZXMgKHRoZSBvbmVzIHdoaWNoIGFyZSBzZWxlY3RlZCkgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcbiAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuaGlkZUFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihlbGVzLCBsYXlvdXRwYXJhbSkge1xuICAgIHZhciBub2RlcyA9IGVsZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcblxuICAgIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIik7XG4gICAgdmFyIG5vZGVzVG9TaG93ID0gY2hpc2UuZWxlbWVudFV0aWxpdGllcy5leHRlbmRSZW1haW5pbmdOb2Rlcyhub2RlcywgYWxsTm9kZXMpO1xuICAgIHZhciBub2Rlc1RvSGlkZSA9IGFsbE5vZGVzLm5vdChub2Rlc1RvU2hvdyk7XG5cbiAgICBpZiAobm9kZXNUb0hpZGUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcblxuICAgICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoJzp2aXNpYmxlJyk7XG4gICAgICAgIGNoaXNlLnRoaW5Cb3JkZXIobm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IpO1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmhpZGVBbmRQZXJmb3JtTGF5b3V0KG5vZGVzVG9IaWRlLCBsYXlvdXRwYXJhbSk7XG4gICAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5jb25uZWN0ZWROb2RlcygnOnZpc2libGUnKTtcbiAgICAgICAgY2hpc2UudGhpY2tlbkJvcmRlcihub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgICAgICBlbGVzOiBub2Rlc1RvSGlkZSxcbiAgICAgICAgICAgIGxheW91dHBhcmFtOiBsYXlvdXRwYXJhbSxcbiAgICAgICAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciB1ciA9IGN5LnVuZG9SZWRvKCk7XG4gICAgICAgIHVyLmFjdGlvbihcInRoaWNrZW5Cb3JkZXJcIiwgY2hpc2UudGhpY2tlbkJvcmRlciwgY2hpc2UudGhpbkJvcmRlcik7XG4gICAgICAgIHVyLmFjdGlvbihcInRoaW5Cb3JkZXJcIiwgY2hpc2UudGhpbkJvcmRlciwgY2hpc2UudGhpY2tlbkJvcmRlcik7XG5cbiAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCkuaW50ZXJzZWN0aW9uKG5vZGVzVG9IaWRlKTtcbiAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInRoaW5Cb3JkZXJcIiwgcGFyYW06IG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yfSk7XG4gICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJoaWRlQW5kUGVyZm9ybUxheW91dFwiLCBwYXJhbTogcGFyYW19KTtcbiAgICAgICAgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBub2Rlc1RvSGlkZS5uZWlnaGJvcmhvb2QoXCI6dmlzaWJsZVwiKS5ub2RlcygpLmRpZmZlcmVuY2Uobm9kZXNUb0hpZGUpLmRpZmZlcmVuY2UoY3kubm9kZXMoXCJbdGhpY2tCb3JkZXJdXCIpKTtcbiAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInRoaWNrZW5Cb3JkZXJcIiwgcGFyYW06IG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yfSk7XG4gICAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJiYXRjaFwiLCBhY3Rpb25zKTtcbiAgICB9XG59O1xuXG4vKlxuICogVW5oaWRlIGdpdmVuIGVsZXMgKHRoZSBvbmVzIHdoaWNoIGFyZSBoaWRkZW4gaWYgYW55KSBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xuICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKG1haW5FbGUsIGVsZXMsIGxheW91dHBhcmFtKSB7XG4gICAgdmFyIGhpZGRlbkVsZXMgPSBlbGVzLmZpbHRlcignOmhpZGRlbicpO1xuICAgIGlmIChoaWRkZW5FbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIG1haW5VdGlsaXRpZXMuY2xvc2VVcEVsZW1lbnRzKG1haW5FbGUsIGhpZGRlbkVsZXMubm9kZXMoKSk7XG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5jb25uZWN0ZWROb2RlcygnOnZpc2libGUnKTtcbiAgICAgICAgY2hpc2UudGhpbkJvcmRlcihub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcik7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQoaGlkZGVuRWxlcywgbGF5b3V0cGFyYW0pO1xuICAgICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoJzp2aXNpYmxlJyk7XG4gICAgICAgIGNoaXNlLnRoaWNrZW5Cb3JkZXIobm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICAgICAgZWxlczogaGlkZGVuRWxlcyxcbiAgICAgICAgICAgIGxheW91dHBhcmFtOiBsYXlvdXRwYXJhbSxcbiAgICAgICAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciB1ciA9IGN5LnVuZG9SZWRvKCk7XG4gICAgICAgIHVyLmFjdGlvbihcInRoaWNrZW5Cb3JkZXJcIiwgY2hpc2UudGhpY2tlbkJvcmRlciwgY2hpc2UudGhpbkJvcmRlcik7XG4gICAgICAgIHVyLmFjdGlvbihcInRoaW5Cb3JkZXJcIiwgY2hpc2UudGhpbkJvcmRlciwgY2hpc2UudGhpY2tlbkJvcmRlcik7XG4gICAgICAgIFxuICAgICAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgICAgICB2YXIgbm9kZXNUb1RoaW5Cb3JkZXIgPSAoaGlkZGVuRWxlcy5uZWlnaGJvcmhvb2QoXCI6dmlzaWJsZVwiKS5ub2RlcyhcIlt0aGlja0JvcmRlcl1cIikpXG4gICAgICAgICAgICAgICAgLmRpZmZlcmVuY2UoY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcy5lZGdlcygpLnVuaW9uKGhpZGRlbkVsZXMubm9kZXMoKS5jb25uZWN0ZWRFZGdlcygpKSkuY29ubmVjdGVkTm9kZXMoKSk7XG4gICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGluQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1RvVGhpbkJvcmRlcn0pO1xuICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwic2hvd0FuZFBlcmZvcm1MYXlvdXRcIiwgcGFyYW06IHBhcmFtfSk7XG4gICAgICAgIHZhciBub2Rlc1RvVGhpY2tlbkJvcmRlciA9IGhpZGRlbkVsZXMubm9kZXMoKS5lZGdlc1dpdGgoY3kubm9kZXMoXCI6aGlkZGVuXCIpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcy5ub2RlcygpKSlcblx0ICAgICAgICAgICAgLmNvbm5lY3RlZE5vZGVzKCkuaW50ZXJzZWN0aW9uKGhpZGRlbkVsZXMubm9kZXMoKSk7XG4gICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGlja2VuQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1RvVGhpY2tlbkJvcmRlcn0pO1xuICAgICAgICBjeS51bmRvUmVkbygpLmRvKFwiYmF0Y2hcIiwgYWN0aW9ucyk7XG4gICAgfVxufTtcblxuLypcbiogVGFrZXMgdGhlIGhpZGRlbiBlbGVtZW50cyBjbG9zZSB0byB0aGUgbm9kZXMgd2hvc2UgbmVpZ2hib3JzIHdpbGwgYmUgc2hvd25cbiogKi9cbm1haW5VdGlsaXRpZXMuY2xvc2VVcEVsZW1lbnRzID0gZnVuY3Rpb24obWFpbkVsZSwgaGlkZGVuRWxlcykge1xuICAgIHZhciBsZWZ0WCA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgdmFyIHJpZ2h0WCA9IE51bWJlci5NSU5fVkFMVUU7XG4gICAgdmFyIHRvcFkgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgIHZhciBib3R0b21ZID0gTnVtYmVyLk1JTl9WQUxVRTtcbiAgICAvLyBDaGVjayB0aGUgeCBhbmQgeSBsaW1pdHMgb2YgYWxsIGhpZGRlbiBlbGVtZW50cyBhbmQgc3RvcmUgdGhlbSBpbiB0aGUgdmFyaWFibGVzIGFib3ZlXG4gICAgaGlkZGVuRWxlcy5mb3JFYWNoKGZ1bmN0aW9uKCBlbGUgKXtcbiAgICAgICAgaWYgKGVsZS5kYXRhKCdjbGFzcycpICE9ICdjb21wYXJ0bWVudCcgJiYgIGVsZS5kYXRhKCdjbGFzcycpICE9ICdjb21wbGV4JylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGhhbGZXaWR0aCA9IGVsZS5vdXRlcldpZHRoKCkvMjtcbiAgICAgICAgICAgIHZhciBoYWxmSGVpZ2h0ID0gZWxlLm91dGVySGVpZ2h0KCkvMjtcbiAgICAgICAgICAgIGlmIChlbGUucG9zaXRpb24oXCJ4XCIpIC0gaGFsZldpZHRoIDwgbGVmdFgpXG4gICAgICAgICAgICAgICAgbGVmdFggPSBlbGUucG9zaXRpb24oXCJ4XCIpIC0gaGFsZldpZHRoO1xuICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgKyBoYWxmV2lkdGggPiByaWdodFgpXG4gICAgICAgICAgICAgICAgcmlnaHRYID0gZWxlLnBvc2l0aW9uKFwieFwiKSArIGhhbGZXaWR0aDtcbiAgICAgICAgICAgIGlmIChlbGUucG9zaXRpb24oXCJ5XCIpIC0gaGFsZkhlaWdodCA8IHRvcFkpXG4gICAgICAgICAgICAgICAgdG9wWSA9IGVsZS5wb3NpdGlvbihcInlcIikgLSBoYWxmSGVpZ2h0O1xuICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInlcIikgKyBoYWxmSGVpZ2h0ID4gdG9wWSlcbiAgICAgICAgICAgICAgICBib3R0b21ZID0gZWxlLnBvc2l0aW9uKFwieVwiKSArIGhhbGZIZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vVGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBvbGQgY2VudGVyIGNvbnRhaW5pbmcgdGhlIGhpZGRlbiBub2Rlc1xuICAgIHZhciBvbGRDZW50ZXJYID0gKGxlZnRYICsgcmlnaHRYKS8yO1xuICAgIHZhciBvbGRDZW50ZXJZID0gKHRvcFkgKyBib3R0b21ZKS8yO1xuXG4gICAgLy9IZXJlIHdlIGNhbGN1bGF0ZSB0d28gcGFyYW1ldGVycyB3aGljaCBkZWZpbmUgdGhlIGFyZWEgaW4gd2hpY2ggdGhlIGhpZGRlbiBlbGVtZW50cyBhcmUgcGxhY2VkIGluaXRpYWxseVxuICAgIHZhciBtaW5Ib3Jpem9udGFsUGFyYW0gPSBtYWluRWxlLm91dGVyV2lkdGgoKS8yICsgKHJpZ2h0WCAtIGxlZnRYKS8yO1xuICAgIHZhciBtYXhIb3Jpem9udGFsUGFyYW0gPSBtYWluRWxlLm91dGVyV2lkdGgoKSArIChyaWdodFggLSBsZWZ0WCkvMjtcbiAgICB2YXIgbWluVmVydGljYWxQYXJhbSA9IG1haW5FbGUub3V0ZXJIZWlnaHQoKS8yICsgKGJvdHRvbVkgLSB0b3BZKS8yO1xuICAgIHZhciBtYXhWZXJ0aWNhbFBhcmFtID0gbWFpbkVsZS5vdXRlckhlaWdodCgpICsgKGJvdHRvbVkgLSB0b3BZKS8yO1xuXG4gICAgLy9RdWFkcmFudHMgaXMgYW4gb2JqZWN0IG9mIHRoZSBmb3JtIHtmaXJzdDpcIm9idGFpbmVkXCIsIHNlY29uZDpcImZyZWVcIiwgdGhpcmQ6XCJmcmVlXCIsIGZvdXJ0aDpcIm9idGFpbmVkXCJ9XG4gICAgLy8gd2hpY2ggaG9sZHMgd2hpY2ggcXVhZHJhbnQgYXJlIGZyZWUgKHRoYXQncyB3aGVyZSBoaWRkZW4gbm9kZXMgd2lsbCBiZSBicm91Z2h0KVxuICAgIHZhciBxdWFkcmFudHMgPSBtYWluVXRpbGl0aWVzLmNoZWNrT2NjdXBpZWRRdWFkcmFudHMobWFpbkVsZSwgaGlkZGVuRWxlcyk7XG4gICAgdmFyIGZyZWVRdWFkcmFudHMgPSBbXTtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBxdWFkcmFudHMpIHtcbiAgICAgICAgaWYgKHF1YWRyYW50c1twcm9wZXJ0eV0gPT09IFwiZnJlZVwiKVxuICAgICAgICAgICAgZnJlZVF1YWRyYW50cy5wdXNoKHByb3BlcnR5KTtcbiAgICB9XG5cbiAgICAvL0NhbiB0YWtlIHZhbHVlcyAxIGFuZCAtMSBhbmQgYXJlIHVzZWQgdG8gcGxhY2UgdGhlIGhpZGRlbiBub2RlcyBpbiB0aGUgcmFuZG9tIHF1YWRyYW50XG4gICAgdmFyIGhvcml6b250YWxNdWx0O1xuICAgIHZhciB2ZXJ0aWNhbE11bHQ7XG4gICAgaWYgKGZyZWVRdWFkcmFudHMubGVuZ3RoID4gMClcbiAgICB7XG4gICAgICBpZiAoZnJlZVF1YWRyYW50cy5sZW5ndGggPT09IDMpXG4gICAgICB7XG4gICAgICAgIGlmIChmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmaXJzdCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ3NlY29uZCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ3RoaXJkJykpXG4gICAgICAgIHtcbiAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IC0xO1xuICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IC0xO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZpcnN0JykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnc2Vjb25kJykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnZm91cnRoJykpXG4gICAgICAgIHtcbiAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IDE7XG4gICAgICAgICAgdmVydGljYWxNdWx0ID0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnZmlyc3QnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCd0aGlyZCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZvdXJ0aCcpKVxuICAgICAgICB7XG4gICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAxO1xuICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnc2Vjb25kJykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygndGhpcmQnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmb3VydGgnKSlcbiAgICAgICAge1xuICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gLTE7XG4gICAgICAgICAgdmVydGljYWxNdWx0ID0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICAvL1JhbmRvbWx5IHBpY2tzIG9uZSBxdWFkcmFudCBmcm9tIHRoZSBmcmVlIHF1YWRyYW50c1xuICAgICAgICB2YXIgcmFuZG9tUXVhZHJhbnQgPSBmcmVlUXVhZHJhbnRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpmcmVlUXVhZHJhbnRzLmxlbmd0aCldO1xuXG4gICAgICAgIGlmIChyYW5kb21RdWFkcmFudCA9PT0gXCJmaXJzdFwiKSB7XG4gICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IDE7XG4gICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAtMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyYW5kb21RdWFkcmFudCA9PT0gXCJzZWNvbmRcIikge1xuICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAtMTtcbiAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IC0xO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJhbmRvbVF1YWRyYW50ID09PSBcInRoaXJkXCIpIHtcbiAgICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gLTE7XG4gICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJhbmRvbVF1YWRyYW50ID09PSBcImZvdXJ0aFwiKSB7XG4gICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IDE7XG4gICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIGhvcml6b250YWxNdWx0ID0gMDtcbiAgICAgICAgdmVydGljYWxNdWx0ID0gMDtcbiAgICB9XG4gICAgLy8gSWYgdGhlIGhvcml6b250YWxNdWx0IGlzIDAgaXQgbWVhbnMgdGhhdCBubyBxdWFkcmFudCBpcyBmcmVlLCBzbyB3ZSByYW5kb21seSBjaG9vc2UgYSBxdWFkcmFudFxuICAgIHZhciBob3Jpem9udGFsUGFyYW0gPSBtYWluVXRpbGl0aWVzLmdlbmVyYXRlUmFuZG9tKG1pbkhvcml6b250YWxQYXJhbSxtYXhIb3Jpem9udGFsUGFyYW0saG9yaXpvbnRhbE11bHQpO1xuICAgIHZhciB2ZXJ0aWNhbFBhcmFtID0gbWFpblV0aWxpdGllcy5nZW5lcmF0ZVJhbmRvbShtaW5WZXJ0aWNhbFBhcmFtLG1heFZlcnRpY2FsUGFyYW0sdmVydGljYWxNdWx0KTtcblxuICAgIC8vVGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBjZW50ZXIgd2hlcmUgdGhlIGhpZGRlbiBub2RlcyB3aWxsIGJlIHRyYW5zZmVyZWRcbiAgICB2YXIgbmV3Q2VudGVyWCA9IG1haW5FbGUucG9zaXRpb24oXCJ4XCIpICsgaG9yaXpvbnRhbFBhcmFtO1xuICAgIHZhciBuZXdDZW50ZXJZID0gbWFpbkVsZS5wb3NpdGlvbihcInlcIikgKyB2ZXJ0aWNhbFBhcmFtO1xuXG4gICAgdmFyIHhkaWZmID0gbmV3Q2VudGVyWCAtIG9sZENlbnRlclg7XG4gICAgdmFyIHlkaWZmID0gbmV3Q2VudGVyWSAtIG9sZENlbnRlclk7XG5cbiAgICAvL0NoYW5nZSB0aGUgcG9zaXRpb24gb2YgaGlkZGVuIGVsZW1lbnRzXG4gICAgaGlkZGVuRWxlcy5mb3JFYWNoKGZ1bmN0aW9uKCBlbGUgKXtcbiAgICAgICAgdmFyIG5ld3ggPSBlbGUucG9zaXRpb24oXCJ4XCIpICsgeGRpZmY7XG4gICAgICAgIHZhciBuZXd5ID0gZWxlLnBvc2l0aW9uKFwieVwiKSArIHlkaWZmO1xuICAgICAgICBlbGUucG9zaXRpb24oXCJ4XCIsIG5ld3gpO1xuICAgICAgICBlbGUucG9zaXRpb24oXCJ5XCIsbmV3eSk7XG4gICAgfSk7XG59O1xuXG4vKlxuICogR2VuZXJhdGVzIGEgbnVtYmVyIGJldHdlZW4gMiBuciBhbmQgbXVsdGltcGxpZXMgaXQgd2l0aCAxIG9yIC0xXG4gKiAqL1xubWFpblV0aWxpdGllcy5nZW5lcmF0ZVJhbmRvbSA9IGZ1bmN0aW9uKG1pbiwgbWF4LCBtdWx0KSB7XG4gICAgdmFyIHZhbCA9IFstMSwxXTtcbiAgICBpZiAobXVsdCA9PT0gMClcbiAgICAgICAgbXVsdCA9IHZhbFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqdmFsLmxlbmd0aCldO1xuICAgIHJldHVybiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbikgKiBtdWx0O1xufTtcblxuLypcbiAqIFRoaXMgZnVuY3Rpb24gbWFrZXMgc3VyZSB0aGF0IHRoZSByYW5kb20gbnVtYmVyIGxpZXMgaW4gZnJlZSBxdWFkcmFudFxuICogKi9cbm1haW5VdGlsaXRpZXMuY2hlY2tPY2N1cGllZFF1YWRyYW50cyA9IGZ1bmN0aW9uKG1haW5FbGUsIGhpZGRlbkVsZXMpIHtcbiAgICBpZiAoY2hpc2UuZ2V0TWFwVHlwZSgpID09ICdQRCcpXG4gICAge1xuICAgICAgdmFyIHZpc2libGVOZWlnaGJvckVsZXMgPSBtYWluRWxlLm5laWdoYm9yaG9vZCgpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcykubm9kZXMoKTtcbiAgICAgIHZhciB2aXNpYmxlTmVpZ2hib3JzT2ZOZWlnaGJvcnMgPSB2aXNpYmxlTmVpZ2hib3JFbGVzLm5laWdoYm9yaG9vZCgpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcykuZGlmZmVyZW5jZShtYWluRWxlKS5ub2RlcygpO1xuICAgICAgdmFyIHZpc2libGVFbGVzID0gdmlzaWJsZU5laWdoYm9yRWxlcy51bmlvbih2aXNpYmxlTmVpZ2hib3JzT2ZOZWlnaGJvcnMpO1xuICAgIH1cbiAgICBlbHNlXG4gICAgICB2YXIgdmlzaWJsZUVsZXMgPSBtYWluRWxlLm5laWdoYm9yaG9vZCgpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcykubm9kZXMoKTtcbiAgICB2YXIgb2NjdXBpZWRRdWFkcmFudHMgPSB7Zmlyc3Q6XCJmcmVlXCIsIHNlY29uZDpcImZyZWVcIiwgdGhpcmQ6XCJmcmVlXCIsIGZvdXJ0aDpcImZyZWVcIn07XG5cbiAgICB2aXNpYmxlRWxlcy5mb3JFYWNoKGZ1bmN0aW9uKCBlbGUgKXtcbiAgICAgICAgaWYgKGVsZS5kYXRhKCdjbGFzcycpICE9ICdjb21wYXJ0bWVudCcgJiYgIGVsZS5kYXRhKCdjbGFzcycpICE9ICdjb21wbGV4JylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgPCBtYWluRWxlLnBvc2l0aW9uKFwieFwiKSAmJiBlbGUucG9zaXRpb24oXCJ5XCIpIDwgbWFpbkVsZS5wb3NpdGlvbihcInlcIikpXG4gICAgICAgICAgICAgICAgb2NjdXBpZWRRdWFkcmFudHMuc2Vjb25kID0gXCJvY2N1cGllZFwiO1xuICAgICAgICAgICAgZWxzZSBpZiAoZWxlLnBvc2l0aW9uKFwieFwiKSA+IG1haW5FbGUucG9zaXRpb24oXCJ4XCIpICYmIGVsZS5wb3NpdGlvbihcInlcIikgPCBtYWluRWxlLnBvc2l0aW9uKFwieVwiKSlcbiAgICAgICAgICAgICAgICBvY2N1cGllZFF1YWRyYW50cy5maXJzdCA9IFwib2NjdXBpZWRcIjtcbiAgICAgICAgICAgIGVsc2UgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgPCBtYWluRWxlLnBvc2l0aW9uKFwieFwiKSAmJiBlbGUucG9zaXRpb24oXCJ5XCIpID4gbWFpbkVsZS5wb3NpdGlvbihcInlcIikpXG4gICAgICAgICAgICAgICAgb2NjdXBpZWRRdWFkcmFudHMudGhpcmQgPSBcIm9jY3VwaWVkXCI7XG4gICAgICAgICAgICBlbHNlIGlmIChlbGUucG9zaXRpb24oXCJ4XCIpID4gbWFpbkVsZS5wb3NpdGlvbihcInhcIikgJiYgZWxlLnBvc2l0aW9uKFwieVwiKSA+IG1haW5FbGUucG9zaXRpb24oXCJ5XCIpKVxuICAgICAgICAgICAgICAgIG9jY3VwaWVkUXVhZHJhbnRzLmZvdXJ0aCA9IFwib2NjdXBpZWRcIjtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvY2N1cGllZFF1YWRyYW50cztcbn07XG5cbi8vIE92ZXJyaWRlcyBoaWdobGlnaHRQcm9jZXNzZXMgZnJvbSBTQkdOVklaIC0gZG8gbm90IGhpZ2hsaWdodCBhbnkgbm9kZXMgd2hlbiB0aGUgbWFwIHR5cGUgaXMgQUZcbm1haW5VdGlsaXRpZXMuaGlnaGxpZ2h0UHJvY2Vzc2VzID0gZnVuY3Rpb24oX25vZGVzKSB7XG4gIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSA9PSBcIkFGXCIpXG4gICAgcmV0dXJuO1xuICBsaWJzLnNiZ252aXouaGlnaGxpZ2h0UHJvY2Vzc2VzKF9ub2Rlcyk7XG59O1xuXG4vKipcbiAqIFJlc2V0cyBtYXAgdHlwZSB0byB1bmRlZmluZWRcbiAqL1xubWFpblV0aWxpdGllcy5yZXNldE1hcFR5cGUgPSBmdW5jdGlvbigpe1xuICBlbGVtZW50VXRpbGl0aWVzLnJlc2V0TWFwVHlwZSgpO1xufTtcblxuLyoqXG4gKiByZXR1cm4gOiBtYXAgdHlwZVxuICovXG5tYWluVXRpbGl0aWVzLmdldE1hcFR5cGUgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1haW5VdGlsaXRpZXM7XG4iLCIvKlxuICogIEV4dGVuZCBkZWZhdWx0IG9wdGlvbnMgYW5kIGdldCBjdXJyZW50IG9wdGlvbnMgYnkgdXNpbmcgdGhpcyBmaWxlIFxuICovXG5cbi8vIGRlZmF1bHQgb3B0aW9uc1xudmFyIGRlZmF1bHRzID0ge1xuICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgdGhlIGluZGV4IGh0bWwgXG4gIC8vIGZpbGUgYW5kIG5vZGVfbW9kdWxlcyBhcmUgdW5kZXIgdGhlIHNhbWUgZm9sZGVyIHRoZW4gdXNpbmcgdGhlIGRlZmF1bHQgdmFsdWUgaXMgZmluZVxuICBpbWdQYXRoOiAnbm9kZV9tb2R1bGVzL3NiZ252aXovc3JjL2ltZycsXG4gIC8vIFdoZXRoZXIgdG8gZml0IGxhYmVscyB0byBub2Rlc1xuICBmaXRMYWJlbHNUb05vZGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBmaXRMYWJlbHNUb0luZm9ib3hlczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgLy8gZHluYW1pYyBsYWJlbCBzaXplIGl0IG1heSBiZSAnc21hbGwnLCAncmVndWxhcicsICdsYXJnZSdcbiAgZHluYW1pY0xhYmVsU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAncmVndWxhcic7XG4gIH0sXG4gIC8vIHBlcmNlbnRhZ2UgdXNlZCB0byBjYWxjdWxhdGUgY29tcG91bmQgcGFkZGluZ3NcbiAgY29tcG91bmRQYWRkaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIDEwO1xuICB9LFxuICAvLyBXaGV0aGVyIHRvIGFkanVzdCBub2RlIGxhYmVsIGZvbnQgc2l6ZSBhdXRvbWF0aWNhbGx5LlxuICAvLyBJZiB0aGlzIG9wdGlvbiByZXR1cm4gZmFsc2UgZG8gbm90IGFkanVzdCBsYWJlbCBzaXplcyBhY2NvcmRpbmcgdG8gbm9kZSBoZWlnaHQgdXNlcyBub2RlLmRhdGEoJ2ZvbnQtc2l6ZScpXG4gIC8vIGluc3RlYWQgb2YgZG9pbmcgaXQuXG4gIGFkanVzdE5vZGVMYWJlbEZvbnRTaXplQXV0b21hdGljYWxseTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIC8vIFRoZSBzZWxlY3RvciBvZiB0aGUgY29tcG9uZW50IGNvbnRhaW5pbmcgdGhlIHNiZ24gbmV0d29ya1xuICBuZXR3b3JrQ29udGFpbmVyU2VsZWN0b3I6ICcjc2Jnbi1uZXR3b3JrLWNvbnRhaW5lcicsXG4gIC8vIFdoZXRoZXIgdGhlIGFjdGlvbnMgYXJlIHVuZG9hYmxlLCByZXF1aXJlcyBjeXRvc2NhcGUtdW5kby1yZWRvIGV4dGVuc2lvblxuICB1bmRvYWJsZTogdHJ1ZSxcbiAgLy8gV2hldGhlciB0byBoYXZlIHVuZG9hYmxlIGRyYWcgZmVhdHVyZSBpbiB1bmRvL3JlZG8gZXh0ZW5zaW9uLiBUaGlzIG9wdGlvbnMgd2lsbCBiZSBwYXNzZWQgdG8gdW5kby9yZWRvIGV4dGVuc2lvblxuICB1bmRvYWJsZURyYWc6IHRydWVcbn07XG5cbnZhciBvcHRpb25VdGlsaXRpZXMgPSBmdW5jdGlvbiAoKSB7XG59O1xuXG4vLyBFeHRlbmQgdGhlIGRlZmF1bHRzIG9wdGlvbnMgd2l0aCB0aGUgdXNlciBvcHRpb25zXG5vcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcblxuICBmb3IgKHZhciBwcm9wIGluIGRlZmF1bHRzKSB7XG4gICAgcmVzdWx0W3Byb3BdID0gZGVmYXVsdHNbcHJvcF07XG4gIH1cbiAgXG4gIGZvciAodmFyIHByb3AgaW4gb3B0aW9ucykge1xuICAgIHJlc3VsdFtwcm9wXSA9IG9wdGlvbnNbcHJvcF07XG4gIH1cblxuICBvcHRpb25VdGlsaXRpZXMub3B0aW9ucyA9IHJlc3VsdDtcblxuICByZXR1cm4gb3B0aW9ucztcbn07XG5cbm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9wdGlvblV0aWxpdGllczsiLCJ2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBvcHRpb25zID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJykuZ2V0T3B0aW9ucygpO1xudmFyICQgPSBsaWJzLmpRdWVyeTtcblxudmFyIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zID0gZnVuY3Rpb24gKHVuZG9hYmxlRHJhZykge1xuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gY3JlYXRlIHVuZG8tcmVkbyBpbnN0YW5jZVxuICB2YXIgdXIgPSBjeS51bmRvUmVkbyh7XG4gICAgdW5kb2FibGVEcmFnOiB1bmRvYWJsZURyYWdcbiAgfSk7XG5cbiAgLy8gcmVnaXN0ZXIgYWRkIHJlbW92ZSBhY3Rpb25zXG4gIHVyLmFjdGlvbihcImFkZE5vZGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkTm9kZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTaW1wbGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xuICB1ci5hY3Rpb24oXCJhZGRFZGdlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZEVkZ2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuICB1ci5hY3Rpb24oXCJhZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTbWFydFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU21hcnQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcbiAgdXIuYWN0aW9uKFwiY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKTtcblxuICAvLyByZWdpc3RlciBnZW5lcmFsIGFjdGlvbnNcbiAgdXIuYWN0aW9uKFwicmVzaXplTm9kZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc2l6ZU5vZGVzKTtcbiAgdXIuYWN0aW9uKFwiY2hhbmdlTm9kZUxhYmVsXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsKTtcbiAgdXIuYWN0aW9uKFwiY2hhbmdlRGF0YVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhKTtcbiAgdXIuYWN0aW9uKFwiY2hhbmdlQ3NzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUNzcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzKTtcbiAgdXIuYWN0aW9uKFwiY2hhbmdlQmVuZFBvaW50c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCZW5kUG9pbnRzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCZW5kUG9pbnRzKTtcbiAgdXIuYWN0aW9uKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKTtcbiAgdXIuYWN0aW9uKFwic2hvd0FuZFBlcmZvcm1MYXlvdXRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2hvd0FuZFBlcmZvcm1MYXlvdXQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9TaG93QW5kUGVyZm9ybUxheW91dCk7XG4gIHVyLmFjdGlvbihcImhpZGVBbmRQZXJmb3JtTGF5b3V0XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmhpZGVBbmRQZXJmb3JtTGF5b3V0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvSGlkZUFuZFBlcmZvcm1MYXlvdXQpO1xuXG4gIC8vIHJlZ2lzdGVyIFNCR04gYWN0aW9uc1xuICB1ci5hY3Rpb24oXCJhZGRTdGF0ZU9ySW5mb0JveFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZU9ySW5mb0JveCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3gpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VTdGF0ZU9ySW5mb0JveFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3gpO1xuICB1ci5hY3Rpb24oXCJzZXRNdWx0aW1lclN0YXR1c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMpO1xuICB1ci5hY3Rpb24oXCJzZXRDbG9uZU1hcmtlclN0YXR1c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMpO1xuICB1ci5hY3Rpb24oXCJyZW1vdmVTdGF0ZU9ySW5mb0JveFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3gpO1xuICBcbiAgLy8gcmVnaXN0ZXIgZWFzeSBjcmVhdGlvbiBhY3Rpb25zXG4gIHVyLmFjdGlvbihcImNyZWF0ZVRlbXBsYXRlUmVhY3Rpb25cIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG5cbiAgdXIuYWN0aW9uKFwic2V0RGVmYXVsdFByb3BlcnR5XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldERlZmF1bHRQcm9wZXJ0eSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0RGVmYXVsdFByb3BlcnR5KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odW5kb2FibGVEcmFnKSB7XG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKHVuZG9hYmxlRHJhZyk7XG4gIH0pO1xufTsiLCIvLyBFeHRlbmRzIHNiZ252aXoudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnNcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIHNiZ252aXogPSBsaWJzLnNiZ252aXo7XG52YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSBzYmdudml6LnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XG5cbi8vIFNlY3Rpb24gU3RhcnRcbi8vIGFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGROb2RlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICB2YXIgbmV3Tm9kZSA9IHBhcmFtLm5ld05vZGU7XG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKG5ld05vZGUueCwgbmV3Tm9kZS55LCBuZXdOb2RlLmNsYXNzLCBuZXdOb2RlLmlkLCBuZXdOb2RlLnBhcmVudCwgbmV3Tm9kZS52aXNpYmlsaXR5KTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKHBhcmFtKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZWxlczogcmVzdWx0XG4gIH07XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRFZGdlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICB2YXIgbmV3RWRnZSA9IHBhcmFtLm5ld0VkZ2U7XG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKG5ld0VkZ2Uuc291cmNlLCBuZXdFZGdlLnRhcmdldCwgbmV3RWRnZS5jbGFzcywgbmV3RWRnZS5pZCwgbmV3RWRnZS52aXNpYmlsaXR5KTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKHBhcmFtKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZWxlczogcmVzdWx0XG4gIH07XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyA9IGZ1bmN0aW9uKHBhcmFtKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzKHBhcmFtLnNvdXJjZSwgcGFyYW0udGFyZ2V0LCBwYXJhbS5wcm9jZXNzVHlwZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVsZXM6IHJlc3VsdFxuICB9O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcblxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgLy8gTm9kZXMgdG8gbWFrZSBjb21wb3VuZCwgdGhlaXIgZGVzY2VuZGFudHMgYW5kIGVkZ2VzIGNvbm5lY3RlZCB0byB0aGVtIHdpbGwgYmUgcmVtb3ZlZCBkdXJpbmcgY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzIG9wZXJhdGlvblxuICAgIC8vIChpbnRlcm5hbGx5IGJ5IGVsZXMubW92ZSgpIG9wZXJhdGlvbiksIHNvIG1hcmsgdGhlbSBhcyByZW1vdmVkIGVsZXMgZm9yIHVuZG8gb3BlcmF0aW9uLlxuICAgIHZhciBub2Rlc1RvTWFrZUNvbXBvdW5kID0gcGFyYW0ubm9kZXNUb01ha2VDb21wb3VuZDtcbiAgICB2YXIgcmVtb3ZlZEVsZXMgPSBub2Rlc1RvTWFrZUNvbXBvdW5kLnVuaW9uKG5vZGVzVG9NYWtlQ29tcG91bmQuZGVzY2VuZGFudHMoKSk7XG4gICAgcmVtb3ZlZEVsZXMgPSByZW1vdmVkRWxlcy51bmlvbihyZW1vdmVkRWxlcy5jb25uZWN0ZWRFZGdlcygpKTtcbiAgICByZXN1bHQucmVtb3ZlZEVsZXMgPSByZW1vdmVkRWxlcztcbiAgICAvLyBBc3N1bWUgdGhhdCBhbGwgbm9kZXMgdG8gbWFrZSBjb21wb3VuZCBoYXZlIHRoZSBzYW1lIHBhcmVudFxuICAgIHZhciBvbGRQYXJlbnRJZCA9IG5vZGVzVG9NYWtlQ29tcG91bmRbMF0uZGF0YShcInBhcmVudFwiKTtcbiAgICAvLyBUaGUgcGFyZW50IG9mIG5ldyBjb21wb3VuZCB3aWxsIGJlIHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kXG4gICAgLy8gTmV3IGVsZXMgaW5jbHVkZXMgbmV3IGNvbXBvdW5kIGFuZCB0aGUgbW92ZWQgZWxlcyBhbmQgd2lsbCBiZSB1c2VkIGluIHVuZG8gb3BlcmF0aW9uLlxuICAgIHJlc3VsdC5uZXdFbGVzID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMobm9kZXNUb01ha2VDb21wb3VuZCwgcGFyYW0uY29tcG91bmRUeXBlKTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXN1bHQucmVtb3ZlZEVsZXMgPSBwYXJhbS5uZXdFbGVzLnJlbW92ZSgpO1xuICAgIHJlc3VsdC5uZXdFbGVzID0gcGFyYW0ucmVtb3ZlZEVsZXMucmVzdG9yZSgpO1xuICAgIGVsZW1lbnRVdGlsaXRpZXMubWFpbnRhaW5Qb2ludGVyKHJlc3VsdC5uZXdFbGVzKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBTZWN0aW9uIEVuZFxuLy8gYWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXG5cbi8vIFNlY3Rpb24gU3RhcnRcbi8vIGVhc3kgY3JlYXRpb24gYWN0aW9uIGZ1bmN0aW9uc1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XG4gIHZhciBlbGVzO1xuXG4gIGlmIChmaXJzdFRpbWUpIHtcbiAgICBlbGVzID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uKHBhcmFtLnRlbXBsYXRlVHlwZSwgcGFyYW0ubWFjcm9tb2xlY3VsZUxpc3QsIHBhcmFtLmNvbXBsZXhOYW1lLCBwYXJhbS5wcm9jZXNzUG9zaXRpb24sIHBhcmFtLnRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgcGFyYW0udGlsaW5nUGFkZGluZ0hvcml6b250YWwsIHBhcmFtLmVkZ2VMZW5ndGgpXG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlcyA9IHBhcmFtO1xuICAgIGN5LmFkZChlbGVzKTtcbiAgICBcbiAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgZWxlcy5zZWxlY3QoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZWxlczogZWxlc1xuICB9O1xufTtcblxuLy8gU2VjdGlvbiBFbmRcbi8vIGVhc3kgY3JlYXRpb24gYWN0aW9uIGZ1bmN0aW9uc1xuXG4vLyBTZWN0aW9uIFN0YXJ0XG4vLyBnZW5lcmFsIGFjdGlvbiBmdW5jdGlvbnNcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHBvc2l0aW9ucyA9IHt9O1xuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xuICBcbiAgbm9kZXMuZWFjaChmdW5jdGlvbihlbGUsIGkpIHtcbiAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XG4gICAgICBlbGUgPSBpO1xuICAgIH1cbiAgICBcbiAgICBwb3NpdGlvbnNbZWxlLmlkKCldID0ge1xuICAgICAgeDogZWxlLnBvc2l0aW9uKFwieFwiKSxcbiAgICAgIHk6IGVsZS5wb3NpdGlvbihcInlcIilcbiAgICB9O1xuICB9KTtcblxuICByZXR1cm4gcG9zaXRpb25zO1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMgPSBmdW5jdGlvbiAocG9zaXRpb25zKSB7XG4gIHZhciBjdXJyZW50UG9zaXRpb25zID0ge307XG4gIGN5Lm5vZGVzKCkucG9zaXRpb25zKGZ1bmN0aW9uIChlbGUsIGkpIHtcbiAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XG4gICAgICBlbGUgPSBpO1xuICAgIH1cbiAgICBcbiAgICBjdXJyZW50UG9zaXRpb25zW2VsZS5pZCgpXSA9IHtcbiAgICAgIHg6IGVsZS5wb3NpdGlvbihcInhcIiksXG4gICAgICB5OiBlbGUucG9zaXRpb24oXCJ5XCIpXG4gICAgfTtcbiAgICBcbiAgICB2YXIgcG9zID0gcG9zaXRpb25zW2VsZS5pZCgpXTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogcG9zLngsXG4gICAgICB5OiBwb3MueVxuICAgIH07XG4gIH0pO1xuXG4gIHJldHVybiBjdXJyZW50UG9zaXRpb25zO1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBwZXJmb3JtT3BlcmF0aW9uOiB0cnVlXG4gIH07XG5cbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG5cbiAgcmVzdWx0LnNpemVNYXAgPSB7fTtcbiAgcmVzdWx0LnVzZUFzcGVjdFJhdGlvID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgcmVzdWx0LnNpemVNYXBbbm9kZS5pZCgpXSA9IHtcbiAgICAgIHc6IG5vZGUud2lkdGgoKSxcbiAgICAgIGg6IG5vZGUuaGVpZ2h0KClcbiAgICB9O1xuICB9XG5cbiAgcmVzdWx0Lm5vZGVzID0gbm9kZXM7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG5cbiAgICBpZiAocGFyYW0ucGVyZm9ybU9wZXJhdGlvbikge1xuICAgICAgaWYgKHBhcmFtLnNpemVNYXApIHtcbiAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLnc7XG4gICAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5oO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMocGFyYW0ubm9kZXMsIHBhcmFtLndpZHRoLCBwYXJhbS5oZWlnaHQsIHBhcmFtLnVzZUFzcGVjdFJhdGlvKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciByZXN1bHQgPSB7XG4gIH07XG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICByZXN1bHQubm9kZXMgPSBub2RlcztcbiAgcmVzdWx0LmxhYmVsID0ge307XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgcmVzdWx0LmxhYmVsW25vZGUuaWQoKV0gPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG4gIH1cblxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBwYXJhbS5sYWJlbCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgIG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbCA9IHBhcmFtLmxhYmVsW25vZGUuaWQoKV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgfTtcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuICByZXN1bHQubmFtZSA9IHBhcmFtLm5hbWU7XG4gIHJlc3VsdC52YWx1ZU1hcCA9IHt9O1xuICByZXN1bHQuZWxlcyA9IGVsZXM7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGVsZSA9IGVsZXNbaV07XG4gICAgcmVzdWx0LnZhbHVlTWFwW2VsZS5pZCgpXSA9IGVsZS5kYXRhKHBhcmFtLm5hbWUpO1xuICB9XG5cbiAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKHBhcmFtLmVsZXMsIHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlTWFwKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciByZXN1bHQgPSB7XG4gIH07XG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcbiAgcmVzdWx0Lm5hbWUgPSBwYXJhbS5uYW1lO1xuICByZXN1bHQudmFsdWVNYXAgPSB7fTtcbiAgcmVzdWx0LmVsZXMgPSBlbGVzO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuICAgIHJlc3VsdC52YWx1ZU1hcFtlbGUuaWQoKV0gPSBlbGUuY3NzKHBhcmFtLm5hbWUpO1xuICB9XG5cbiAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VDc3MocGFyYW0uZWxlcywgcGFyYW0ubmFtZSwgcGFyYW0udmFsdWVNYXApO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0ge1xuICB9O1xuXG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcbiAgcmVzdWx0LmRhdGEgPSB7fTtcbiAgcmVzdWx0LmVsZXMgPSBlbGVzO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuXG4gICAgcmVzdWx0LmRhdGFbZWxlLmlkKCldID0ge307XG5cbiAgICB2YXIgZGF0YSA9IHBhcmFtLmZpcnN0VGltZSA/IHBhcmFtLmRhdGEgOiBwYXJhbS5kYXRhW2VsZS5pZCgpXTtcblxuICAgIGZvciAodmFyIHByb3AgaW4gZGF0YSkge1xuICAgICAgcmVzdWx0LmRhdGFbZWxlLmlkKCldW3Byb3BdID0gZWxlLmRhdGEocHJvcCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgZGF0YSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICAgIFxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyhlbGUsIGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKlxuICogU2hvdyBlbGVzIGFuZCBwZXJmb3JtIGxheW91dC5cbiAqL1xudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gIHZhciByZXN1bHQgPSB7fTtcbiAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcbiAgXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICByZXN1bHQuZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQocGFyYW0uZWxlcywgcGFyYW0ubGF5b3V0cGFyYW0pO1xuICB9XG4gIGVsc2Uge1xuICAgIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgZ2l2ZW4gZWxlc1xuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcblxuICB2YXIgcmVzdWx0ID0ge307XG4gIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XG4gIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLmhpZGUoZWxlcyk7IC8vIEhpZGUgcHJldmlvdXNseSB1bmhpZGRlbiBlbGVzO1xuXG4gIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qXG4gKiBIaWRlIGVsZXMgYW5kIHBlcmZvcm0gbGF5b3V0LlxuICovXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5oaWRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgIHZhciBlbGVzID0gcGFyYW0uZWxlcztcblxuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuXG4gICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICByZXN1bHQuZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuaGlkZUFuZFBlcmZvcm1MYXlvdXQocGFyYW0uZWxlcywgcGFyYW0ubGF5b3V0cGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuaGlkZShlbGVzKTsgLy8gSGlkZSBnaXZlbiBlbGVzXG4gICAgICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9IaWRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgIHZhciBlbGVzID0gcGFyYW0uZWxlcztcblxuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuICAgIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgcHJldmlvdXNseSBoaWRkZW4gZWxlc1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBTZWN0aW9uIEVuZFxuLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXG5cbi8vIFNlY3Rpb24gU3RhcnRcbi8vIHNiZ24gYWN0aW9uIGZ1bmN0aW9uc1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0ge1xuICB9O1xuICByZXN1bHQudHlwZSA9IHBhcmFtLnR5cGU7XG4gIHJlc3VsdC5ub2RlcyA9IHBhcmFtLm5vZGVzO1xuICByZXN1bHQuaW5kZXggPSBwYXJhbS5pbmRleDtcblxuICByZXN1bHQudmFsdWUgPSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94KHBhcmFtLm5vZGVzLCBwYXJhbS5pbmRleCwgcGFyYW0udmFsdWUsIHBhcmFtLnR5cGUpO1xuXG4gIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBvYmogPSBwYXJhbS5vYmo7XG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuXG4gIHZhciBsb2NhdGlvbk9iaiA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XG5cbiAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICB2YXIgcmVzdWx0ID0ge1xuICAgIG5vZGVzOiBub2RlcyxcbiAgICBsb2NhdGlvbk9iajogbG9jYXRpb25PYmosXG4gICAgb2JqOiBvYmpcbiAgfTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBsb2NhdGlvbk9iaiA9IHBhcmFtLmxvY2F0aW9uT2JqO1xuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcblxuICB2YXIgb2JqID0gZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgbG9jYXRpb25PYmopO1xuXG4gIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBub2Rlczogbm9kZXMsXG4gICAgb2JqOiBvYmpcbiAgfTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICB2YXIgc3RhdHVzID0gcGFyYW0uc3RhdHVzO1xuICB2YXIgcmVzdWx0U3RhdHVzID0ge307XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIGlzTXVsdGltZXIgPSBub2RlLmRhdGEoJ2NsYXNzJykuZW5kc1dpdGgoJyBtdWx0aW1lcicpO1xuXG4gICAgcmVzdWx0U3RhdHVzW25vZGUuaWQoKV0gPSBpc011bHRpbWVyO1xuICB9XG5cbiAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZSBjaGFuZ2UgdGhlIHN0YXR1cyBvZiBhbGwgbm9kZXMgYXQgb25jZS5cbiAgLy8gSWYgbm90IGNoYW5nZSBzdGF0dXMgb2YgZWFjaCBzZXBlcmF0ZWx5IHRvIHRoZSB2YWx1ZXMgbWFwcGVkIHRvIHRoZWlyIGlkLlxuICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcbiAgfVxuICBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2RlLCBzdGF0dXNbbm9kZS5pZCgpXSk7XG4gICAgfVxuICB9XG5cbi8vICBpZiAoIWZpcnN0VGltZSAmJiBfLmlzRXF1YWwobm9kZXMsIGN5Lm5vZGVzKCc6c2VsZWN0ZWQnKSkpIHtcbi8vICAgICQoJyNpbnNwZWN0b3ItaXMtbXVsdGltZXInKS5hdHRyKFwiY2hlY2tlZFwiLCAhJCgnI2luc3BlY3Rvci1pcy1tdWx0aW1lcicpLmF0dHIoXCJjaGVja2VkXCIpKTtcbi8vICB9XG5cbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBzdGF0dXM6IHJlc3VsdFN0YXR1cyxcbiAgICBub2Rlczogbm9kZXNcbiAgfTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG4gIHZhciBzdGF0dXMgPSBwYXJhbS5zdGF0dXM7XG4gIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XG4gIHZhciByZXN1bHRTdGF0dXMgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICByZXN1bHRTdGF0dXNbbm9kZS5pZCgpXSA9IG5vZGUuZGF0YSgnY2xvbmVtYXJrZXInKTtcbiAgICB2YXIgY3VycmVudFN0YXR1cyA9IGZpcnN0VGltZSA/IHN0YXR1cyA6IHN0YXR1c1tub2RlLmlkKCldO1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMobm9kZSwgY3VycmVudFN0YXR1cyk7XG4gIH1cblxuLy8gIGlmICghZmlyc3RUaW1lICYmIF8uaXNFcXVhbChub2RlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xuLy8gICAgJCgnI2luc3BlY3Rvci1pcy1jbG9uZS1tYXJrZXInKS5hdHRyKFwiY2hlY2tlZFwiLCAhJCgnI2luc3BlY3Rvci1pcy1jbG9uZS1tYXJrZXInKS5hdHRyKFwiY2hlY2tlZFwiKSk7XG4vLyAgfVxuXG4gIHZhciByZXN1bHQgPSB7XG4gICAgc3RhdHVzOiByZXN1bHRTdGF0dXMsXG4gICAgbm9kZXM6IG5vZGVzXG4gIH07XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIHBhcmFtOiB7Y2xhc3M6IHNiZ25jbGFzcywgbmFtZTogcHJvcGVydHlOYW1lLCB2YWx1ZTogdmFsdWV9XG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXREZWZhdWx0UHJvcGVydHkgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHBhcmFtLmNsYXNzO1xuICB2YXIgbmFtZSA9IHBhcmFtLm5hbWU7XG4gIHZhciB2YWx1ZSA9IHBhcmFtLnZhbHVlO1xuICB2YXIgY2xhc3NEZWZhdWx0cyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbc2JnbmNsYXNzXTtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBjbGFzczogc2JnbmNsYXNzLFxuICAgIG5hbWU6IG5hbWUsXG4gICAgdmFsdWU6IGNsYXNzRGVmYXVsdHMuaGFzT3duUHJvcGVydHkobmFtZSkgPyBjbGFzc0RlZmF1bHRzW25hbWVdIDogdW5kZWZpbmVkXG4gIH07XG5cbiAgY2xhc3NEZWZhdWx0c1tuYW1lXSA9IHZhbHVlO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBTZWN0aW9uIEVuZFxuLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXG5cbm1vZHVsZS5leHBvcnRzID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7Il19
