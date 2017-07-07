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
  var ordering = this.defaultProperties[sbgnclass]['ports-ordering']; // Get the default ports ordering for the nodes with given sbgnclass

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
elementUtilities.isValidParent = function(_nodeClass, _parentClass) {
  // If nodeClass and parentClass params are elements itselves instead of their class names handle it
  var nodeClass = typeof _nodeClass !== 'string' ? _nodeClass.data('class') : _nodeClass;
  var parentClass = _parentClass != undefined && typeof _parentClass !== 'string' ? _parentClass.data('class') : _parentClass;
  
  if (parentClass == undefined || parentClass === 'compartment') { // Compartments and the root can include any type of nodes
    return true;
  }
  else if (parentClass === 'complex') { // Complexes can only include EPNs
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
          && sbgnclass != 'association' && sbgnclass != 'dissociation' && !sbgnclass.endsWith('process');
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
  else
    var edgeConstraints = this.PD.connectivityConstraints[edgeclass];

  // given a node, acting as source or target, returns boolean wether or not it has too many edges already
  function hasTooManyEdges(node, sourceOrTarget) {
    var nodeclass = node.data('class');
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
    return node.parent().data('class') == 'complex';
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

/*
 * Clone given elements. Considers undoable option. Requires cytoscape-clipboard extension.
 */
mainUtilities.cloneElements = function (eles) {
  if (eles.length === 0) {
    return;
  }
  
  var cb = cy.clipboard();
  var _id = cb.copy(eles, "cloneOperation");

  if (options.undoable) {
    cy.undoRedo().do("paste", {id: _id});
  } 
  else {
    cb.paste(_id);
  }
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
  if (options.undoable) {
    cy.undoRedo().do("paste");
  } 
  else {
    cy.clipboard().paste();
  }
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
    return elementUtilities.isValidParent(sbgnclass, compoundType);
  });
  
  nodes = elementUtilities.getTopMostNodes(nodes);

  // All elements should have the same parent and the common parent should not be a 'complex' 
  // if compoundType is 'compartent'
  // because the old common parent will be the parent of the new compartment after this operation and
  // 'complexes' cannot include 'compartments'
  if (nodes.length == 0 || !elementUtilities.allHaveTheSameParent(nodes)
          || ( compoundType === 'compartment' && nodes.parent().data('class') === 'complex' ) ) {
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
  if (newParent && newParent.data("class") != "complex" && newParent.data("class") != "compartment") {
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
    return elementUtilities.isValidParent(sbgnclass, newParent);
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
 * Unhide given eles (the ones which are hidden if any) and perform given layout afterward. Layout parameter may be layout options
 * or a function to call. Requires viewUtilities extension and considers undoable option.
 */
mainUtilities.showAndPerformLayout = function(eles, layoutparam) {
  var hiddenEles = eles.filter(':hidden');
  if (hiddenEles.length === 0) {
    return;
  }
  function thickenBorder(eles) {
    eles.forEach(function( ele ){
      var defaultBorderWidth = Number(ele.data("border-width"));
      ele.data("border-width", defaultBorderWidth + 2);
    });
    eles.data("thickBorder", true);
    return eles;
  }

  function thinBorder(eles) {
    eles.forEach(function( ele ){
      var defaultBorderWidth = Number(ele.data("border-width"));
      ele.data("border-width", defaultBorderWidth - 2);
    });
    eles.removeData("thickBorder");
    return eles;
  }
  if (!options.undoable) {
    var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
    thinBorder(nodesWithHiddenNeighbor);
    elementUtilities.showAndPerformLayout(hiddenEles, layoutparam);
    var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
    thickenBorder(nodesWithHiddenNeighbor);
  }
  else {
    var param = {
      eles: hiddenEles,
      layoutparam: layoutparam,
      firstTime: true
    };
    
    var ur = cy.undoRedo();
    ur.action("thickenBorder", thickenBorder, thinBorder);
    ur.action("thinBorder", thinBorder, thickenBorder);
    
    var actions = [];
    var nodesWithHiddenNeighbor = hiddenEles.neighborhood(":visible").nodes();
    actions.push({name: "thinBorder", param: nodesWithHiddenNeighbor});  
    actions.push({name: "showAndPerformLayout", param: param});
    nodesWithHiddenNeighbor = hiddenEles.nodes().edgesWith(cy.nodes(":hidden").difference(hiddenEles.nodes()))
            .connectedNodes().intersection(hiddenEles.nodes());
    actions.push({name: "thickenBorder", param: nodesWithHiddenNeighbor}); 
    cy.undoRedo().do("batch", actions);
  }
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9saWItdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6cURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqb0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpe1xuICB2YXIgY2hpc2UgPSB3aW5kb3cuY2hpc2UgPSBmdW5jdGlvbihfb3B0aW9ucywgX2xpYnMpIHtcbiAgICB2YXIgbGlicyA9IHt9O1xuICAgIGxpYnMualF1ZXJ5ID0gX2xpYnMualF1ZXJ5IHx8IGpRdWVyeTtcbiAgICBsaWJzLmN5dG9zY2FwZSA9IF9saWJzLmN5dG9zY2FwZSB8fCBjeXRvc2NhcGU7XG4gICAgbGlicy5zYmdudml6ID0gX2xpYnMuc2JnbnZpeiB8fCBzYmdudml6O1xuICAgIGxpYnMuc2F2ZUFzID0gX2xpYnMuZmlsZXNhdmVyanMgPyBfbGlicy5maWxlc2F2ZXJqcy5zYXZlQXMgOiBzYXZlQXM7XG4gICAgXG4gICAgbGlicy5zYmdudml6KF9vcHRpb25zLCBfbGlicyk7IC8vIEluaXRpbGl6ZSBzYmdudml6XG4gICAgXG4gICAgLy8gU2V0IHRoZSBsaWJyYXJpZXMgdG8gYWNjZXNzIHRoZW0gZnJvbSBhbnkgZmlsZVxuICAgIHZhciBsaWJVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9saWItdXRpbGl0aWVzJyk7XG4gICAgbGliVXRpbGl0aWVzLnNldExpYnMobGlicyk7XG4gICAgXG4gICAgdmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMnKTtcbiAgICB2YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zKF9vcHRpb25zKTsgLy8gRXh0ZW5kcyB0aGUgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhlIGdpdmVuIG9wdGlvbnNcbiAgICBcbiAgICAvLyBVcGRhdGUgc3R5bGUgYW5kIGJpbmQgZXZlbnRzXG4gICAgdmFyIGN5U3R5bGVBbmRFdmVudHMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9jeS1zdHlsZS1hbmQtZXZlbnRzJyk7XG4gICAgY3lTdHlsZUFuZEV2ZW50cyhsaWJzLnNiZ252aXopO1xuICAgIFxuICAgIC8vIFJlZ2lzdGVyIHVuZG8vcmVkbyBhY3Rpb25zXG4gICAgdmFyIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMnKTtcbiAgICByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyhvcHRpb25zLnVuZG9hYmxlRHJhZyk7XG4gICAgXG4gICAgdmFyIG1haW5VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcycpO1xuICAgIHZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZWxlbWVudC11dGlsaXRpZXMnKTtcbiAgICB2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy91bmRvLXJlZG8tYWN0aW9uLWZ1bmN0aW9ucycpO1xuICAgIFxuICAgIC8vIEV4cG9zZSB0aGUgYXBpXG4gICAgXG4gICAgLy8gRXhwb3NlIHRoZSBwcm9wZXJ0aWVzIGluaGVyaXRlZCBmcm9tIHNiZ252aXpcbiAgICAvLyB0aGVuIG92ZXJyaWRlIHNvbWUgb2YgdGhlc2UgcHJvcGVydGllcyBhbmQgZXhwb3NlIHNvbWUgbmV3IHByb3BlcnRpZXNcbiAgICBmb3IgKHZhciBwcm9wIGluIGxpYnMuc2JnbnZpeikge1xuICAgICAgY2hpc2VbcHJvcF0gPSBsaWJzLnNiZ252aXpbcHJvcF07XG4gICAgfVxuICAgIFxuICAgIC8vIEV4cG9zZSBlYWNoIG1haW4gdXRpbGl0eSBzZXBlcmF0ZWx5XG4gICAgZm9yICh2YXIgcHJvcCBpbiBtYWluVXRpbGl0aWVzKSB7XG4gICAgICBjaGlzZVtwcm9wXSA9IG1haW5VdGlsaXRpZXNbcHJvcF07XG4gICAgfVxuICAgIFxuICAgIC8vIEV4cG9zZSBlbGVtZW50VXRpbGl0aWVzIGFuZCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyBhcyBpc1xuICAgIGNoaXNlLmVsZW1lbnRVdGlsaXRpZXMgPSBlbGVtZW50VXRpbGl0aWVzO1xuICAgIGNoaXNlLnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XG4gIH07XG4gIFxuICBpZiAoIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gY2hpc2U7XG4gIH1cbn0pKCk7IiwidmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciAkID0gbGlicy5qUXVlcnk7XG52YXIgb3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpLmdldE9wdGlvbnMoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc2JnbnZpeikge1xuICAvL0hlbHBlcnNcbiAgdmFyIGluaXRFbGVtZW50RGF0YSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgICB2YXIgZWxlY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKTtcbiAgICBpZiAoIWVsZWNsYXNzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGVsZWNsYXNzID0gZWxlbWVudFV0aWxpdGllcy5kZW11bHRpbWVyaXplQ2xhc3MoZWxlY2xhc3MpO1xuICAgIHZhciBjbGFzc1Byb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW2VsZWNsYXNzXTtcblxuICAgIGN5LmJhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChlbGUuaXNOb2RlKCkpIHtcbiAgICAgICAgaWYgKGNsYXNzUHJvcGVydGllc1snd2lkdGgnXSAmJiAhZWxlLmRhdGEoJ2Jib3gnKS53KSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ2Jib3gnKS53ID0gY2xhc3NQcm9wZXJ0aWVzWyd3aWR0aCddO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGFzc1Byb3BlcnRpZXNbJ2hlaWdodCddICYmICFlbGUuZGF0YSgnYmJveCcpLmgpIHtcbiAgICAgICAgICBlbGUuZGF0YSgnYmJveCcpLmggPSBjbGFzc1Byb3BlcnRpZXNbJ2hlaWdodCddO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2ZvbnQtc2l6ZScpICYmIGNsYXNzUHJvcGVydGllc1snZm9udC1zaXplJ10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnZm9udC1zaXplJywgY2xhc3NQcm9wZXJ0aWVzWydmb250LXNpemUnXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC1mYW1pbHknKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtZmFtaWx5J10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnZm9udC1mYW1pbHknLCBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtZmFtaWx5J10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2ZvbnQtc3R5bGUnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtc3R5bGUnXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdmb250LXN0eWxlJywgY2xhc3NQcm9wZXJ0aWVzWydmb250LXN0eWxlJ10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2ZvbnQtd2VpZ2h0JykgJiYgY2xhc3NQcm9wZXJ0aWVzWydmb250LXdlaWdodCddKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ2ZvbnQtd2VpZ2h0JywgY2xhc3NQcm9wZXJ0aWVzWydmb250LXdlaWdodCddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdiYWNrZ3JvdW5kLWNvbG9yJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydiYWNrZ3JvdW5kLWNvbG9yJ10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnYmFja2dyb3VuZC1jb2xvcicsIGNsYXNzUHJvcGVydGllc1snYmFja2dyb3VuZC1jb2xvciddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2JhY2tncm91bmQtb3BhY2l0eSddKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ2JhY2tncm91bmQtb3BhY2l0eScsIGNsYXNzUHJvcGVydGllc1snYmFja2dyb3VuZC1vcGFjaXR5J10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2JvcmRlci1jb2xvcicpICYmIGNsYXNzUHJvcGVydGllc1snYm9yZGVyLWNvbG9yJ10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnYm9yZGVyLWNvbG9yJywgY2xhc3NQcm9wZXJ0aWVzWydib3JkZXItY29sb3InXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnYm9yZGVyLXdpZHRoJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydib3JkZXItd2lkdGgnXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdib3JkZXItd2lkdGgnLCBjbGFzc1Byb3BlcnRpZXNbJ2JvcmRlci13aWR0aCddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVsZS5kYXRhKCd0ZXh0LXdyYXAnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ3RleHQtd3JhcCddKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ3RleHQtd3JhcCcsIGNsYXNzUHJvcGVydGllc1sndGV4dC13cmFwJ10pO1xuICAgICAgICB9XG5cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGVsZS5pc0VkZ2UoKSkge1xuICAgICAgICBpZiAoIWVsZS5kYXRhKCd3aWR0aCcpICYmIGNsYXNzUHJvcGVydGllc1snd2lkdGgnXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCd3aWR0aCcsIGNsYXNzUHJvcGVydGllc1snd2lkdGgnXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnbGluZS1jb2xvcicpICYmIGNsYXNzUHJvcGVydGllc1snbGluZS1jb2xvciddKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ2xpbmUtY29sb3InLCBjbGFzc1Byb3BlcnRpZXNbJ2xpbmUtY29sb3InXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgXG4gIC8vIFVwZGF0ZSBjeSBzdHlsZXNoZWV0XG4gIHZhciB1cGRhdGVTdHlsZVNoZWV0ID0gZnVuY3Rpb24oKSB7XG4gICAgY3kuc3R5bGUoKVxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2ZvbnQtc2l6ZV1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2ZvbnQtc2l6ZSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgLy8gSWYgbm9kZSBsYWJlbHMgYXJlIGV4cGVjdGVkIHRvIGJlIGFkanVzdGVkIGF1dG9tYXRpY2FsbHkgb3IgZWxlbWVudCBjYW5ub3QgaGF2ZSBsYWJlbFxuICAgICAgICAvLyByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRMYWJlbFRleHRTaXplKCkgZWxzZSByZXR1cm4gZWxlLmRhdGEoJ2ZvbnQtc2l6ZScpXG4gICAgICAgIHZhciBvcHQgPSBvcHRpb25zLmFkanVzdE5vZGVMYWJlbEZvbnRTaXplQXV0b21hdGljYWxseTtcbiAgICAgICAgdmFyIGFkanVzdCA9IHR5cGVvZiBvcHQgPT09ICdmdW5jdGlvbicgPyBvcHQoKSA6IG9wdDtcbiAgICAgICAgXG4gICAgICAgIGlmICghYWRqdXN0KSB7XG4gICAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250LXNpemUnKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0TGFiZWxUZXh0U2l6ZShlbGUpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bZm9udC1mYW1pbHldXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdmb250LWZhbWlseSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250LWZhbWlseScpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bZm9udC1zdHlsZV1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2ZvbnQtc3R5bGUnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnZm9udC1zdHlsZScpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bZm9udC13ZWlnaHRdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdmb250LXdlaWdodCc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250LXdlaWdodCcpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bYmFja2dyb3VuZC1jb2xvcl1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2JhY2tncm91bmQtY29sb3InOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnYmFja2dyb3VuZC1jb2xvcicpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bYmFja2dyb3VuZC1vcGFjaXR5XVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2JhY2tncm91bmQtb3BhY2l0eScpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bYm9yZGVyLXdpZHRoXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnYm9yZGVyLXdpZHRoJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2JvcmRlci13aWR0aCcpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bYm9yZGVyLWNvbG9yXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnYm9yZGVyLWNvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2JvcmRlci1jb2xvcicpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bdGV4dC13cmFwXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAndGV4dC13cmFwJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ3RleHQtd3JhcCcpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzc11bbGluZS1jb2xvcl1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2xpbmUtY29sb3InOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnbGluZS1jb2xvcicpO1xuICAgICAgfSxcbiAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdsaW5lLWNvbG9yJyk7XG4gICAgICB9LFxuICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6IGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2xpbmUtY29sb3InKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3NdW3dpZHRoXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnd2lkdGgnOiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCd3aWR0aCcpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwiZWRnZS5jeS1leHBhbmQtY29sbGFwc2UtbWV0YS1lZGdlXCIpXG4gICAgLmNzcyh7XG4gICAgICAnbGluZS1jb2xvcic6ICcjQzRDNEM0JyxcbiAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnI0M0QzRDNCcsXG4gICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyNDNEM0QzQnXG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlOnNlbGVjdGVkXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdib3JkZXItY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAndGV4dC1vdXRsaW5lLWNvbG9yJzogJyMwMDAnXG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJlZGdlOnNlbGVjdGVkXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdsaW5lLWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnI2Q2NzYxNCdcbiAgICB9KS51cGRhdGUoKTtcbiAgfTtcbiAgXG4gIC8vIEJpbmQgZXZlbnRzXG4gIHZhciBiaW5kQ3lFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICBjeS5vbihcImFkZFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBlbGUgPSBldmVudC5jeVRhcmdldCB8fCBldmVudC50YXJnZXQ7XG4gICAgICBpbml0RWxlbWVudERhdGEoZWxlKTtcbiAgICB9KTtcbiAgfTtcbiAgLy8gSGVscGVycyBFbmRcbiAgXG4gIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBleGVjdXRlZCBhZnRlciBkb2N1bWVudC5yZWFkeSBpbiBzYmdudml6IGJlY2F1c2UgaXQgaXMgcmVnaXN0ZXJlZCBsYXRlclxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgLy8gT25jZSBjeSBpcyByZWFkeSBiaW5kIGV2ZW50cyBhbmQgdXBkYXRlIHN0eWxlIHNoZWV0XG4gICAgY3kucmVhZHkoIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBiaW5kQ3lFdmVudHMoKTtcbiAgICAgIHVwZGF0ZVN0eWxlU2hlZXQoKTtcbiAgICB9KTtcbiAgfSk7XG59OyIsIi8vIEV4dGVuZHMgc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBzYmdudml6ID0gbGlicy5zYmdudml6O1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzO1xudmFyIG9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKS5nZXRPcHRpb25zKCk7XG5cbmVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZSA9IHVuZGVmaW5lZDsgLy8gaW5pdGlhbGl6ZSBtYXAgdHlwZVxuXG5lbGVtZW50VXRpbGl0aWVzLlBEID0ge307IC8vIG5hbWVzcGFjZSBmb3IgYWxsIFBEIHNwZWNpZmljIHN0dWZmXG5lbGVtZW50VXRpbGl0aWVzLkFGID0ge307IC8vIG5hbWVzcGFjZSBmb3IgYWxsIEFGIHNwZWNpZmljIHN0dWZmXG5cbmVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXMgPSB7XG4gIFwicHJvY2Vzc1wiOiB7XG4gICAgd2lkdGg6IDE1LFxuICAgIGhlaWdodDogMTUsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwib21pdHRlZCBwcm9jZXNzXCI6IHtcbiAgICB3aWR0aDogMTUsXG4gICAgaGVpZ2h0OiAxNSxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgfSxcbiAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiB7XG4gICAgd2lkdGg6IDE1LFxuICAgIGhlaWdodDogMTUsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwiYXNzb2NpYXRpb25cIjoge1xuICAgIHdpZHRoOiAxNSxcbiAgICBoZWlnaHQ6IDE1LFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyM3MDcwNzAnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcImRpc3NvY2lhdGlvblwiOiB7XG4gICAgd2lkdGg6IDE1LFxuICAgIGhlaWdodDogMTUsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwibWFjcm9tb2xlY3VsZVwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJzaW1wbGUgY2hlbWljYWxcIjoge1xuICAgIHdpZHRoOiAzNSxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwic291cmNlIGFuZCBzaW5rXCI6IHtcbiAgICB3aWR0aDogMjUsXG4gICAgaGVpZ2h0OiAyNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcInRhZ1wiOiB7XG4gICAgd2lkdGg6IDM1LFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJwaGVub3R5cGVcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcInBlcnR1cmJpbmcgYWdlbnRcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwiY29tcGxleFwiOiB7XG4gICAgd2lkdGg6IDUwLFxuICAgIGhlaWdodDogNTAsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJjb21wYXJ0bWVudFwiOiB7XG4gICAgd2lkdGg6IDgwLFxuICAgIGhlaWdodDogODAsXG4gICAgJ2ZvbnQtc2l6ZSc6IDE0LFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMy4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJhbmRcIjoge1xuICAgIHdpZHRoOiAyNSxcbiAgICBoZWlnaHQ6IDI1LFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcIm9yXCI6IHtcbiAgICB3aWR0aDogMjUsXG4gICAgaGVpZ2h0OiAyNSxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgfSxcbiAgXCJub3RcIjoge1xuICAgIHdpZHRoOiAyNSxcbiAgICBoZWlnaHQ6IDI1LFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcImNvbnN1bXB0aW9uXCI6IHtcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAnd2lkdGgnOiAxLjI1XG4gIH0sXG4gIFwicHJvZHVjdGlvblwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcIm1vZHVsYXRpb25cIjoge1xuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICd3aWR0aCc6IDEuMjVcbiAgfSxcbiAgXCJzdGltdWxhdGlvblwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcImNhdGFseXNpc1wiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcImluaGliaXRpb25cIjoge1xuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICd3aWR0aCc6IDEuMjVcbiAgfSxcbiAgXCJuZWNlc3Nhcnkgc3RpbXVsYXRpb25cIjoge1xuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICd3aWR0aCc6IDEuMjVcbiAgfSxcbiAgXCJsb2dpYyBhcmNcIjoge1xuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICd3aWR0aCc6IDEuMjVcbiAgfSxcbiAgXCJlcXVpdmFsZW5jZSBhcmNcIjoge1xuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICd3aWR0aCc6IDEuMjVcbiAgfSxcbiAgXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcIkJBIHBsYWluXCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcIkJBIHVuc3BlY2lmaWVkIGVudGl0eVwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJCQSBzaW1wbGUgY2hlbWljYWxcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwiQkEgbWFjcm9tb2xlY3VsZVwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJCQSBudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJCQSBwZXJ0dXJiaW5nIGFnZW50XCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcIkJBIGNvbXBsZXhcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwiZGVsYXlcIjoge1xuICAgIHdpZHRoOiAyNSxcbiAgICBoZWlnaHQ6IDI1LFxuICAgICdmb250LWZhbWlseSc6ICdDYW1icmlhJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgfSxcbiAgXCJ1bmtub3duIGluZmx1ZW5jZVwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcInBvc2l0aXZlIGluZmx1ZW5jZVwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcIm5lZ2F0aXZlIGluZmx1ZW5jZVwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxufTtcblxuXG4vKlxuICBzZWUgaHR0cDovL2pvdXJuYWwuaW1iaW8uZGUvYXJ0aWNsZXMvcGRmL2ppYi0yNjMucGRmIHAuNDEgPC0tIGJ1dCBiZXdhcmUsIG91dGRhdGVkXG4gIGZvbGxvd2luZyB0YWJsZXMgaGF2ZSBiZWVuIHVwZGF0ZWQgd2l0aCBQRCBsdmwxIHYyLjAgb2YgTm92ZW1iZXIgNywgMjAxNiB3b3JraW5nIGRyYWZ0XG4gIG9ubHkgdGhlIGZvbGxvd2luZyB0aGluZ3MgaGF2ZSBiZWVuIGNoYW5nZWQgZnJvbSAyLjAgKHRoaXMgdmVyc2lvbiBpcyBub3QgY2xlYXIgb24gY29ubmVjdGl2aXR5KTpcbiAgIC0gZW1wdHkgc2V0IGhhcyBubyBsaW1pdCBvbiBpdHMgZWRnZSBjb3VudFxuICAgLSBsb2dpYyBvcGVyYXRvcnMgY2FuIGJlIHNvdXJjZSBhbmQgdGFyZ2V0XG4gICAtIGxpbWl0IG9mIDEgY2F0YWx5c2lzIGFuZCAxIG5lY2Vzc2FyeSBzdGltdWxhdGlvbiBvbiBhIHByb2Nlc3NcblxuICBmb3IgZWFjaCBlZGdlIGNsYXNzIGFuZCBub2RlY2xhc3MgZGVmaW5lIDIgY2FzZXM6XG4gICAtIG5vZGUgY2FuIGJlIGEgc291cmNlIG9mIHRoaXMgZWRnZSAtPiBhc1NvdXJjZVxuICAgLSBub2RlIGNhbiBiZSBhIHRhcmdldCBvZiB0aGlzIGVkZ2UgLT4gYXNUYXJnZXRcbiAgZm9yIGJvdGggY2FzZXMsIHRlbGxzIGlmIGl0IGlzIGFsbG93ZWQgYW5kIHdoYXQgaXMgdGhlIGxpbWl0IG9mIGVkZ2VzIGFsbG93ZWQuXG4gIExpbWl0cyBjYW4gY29uY2VybiBvbmx5IHRoaXMgdHlwZSBvZiBlZGdlIChtYXhFZGdlKSBvciB0aGUgdG90YWwgbnVtYmVyIG9mIGVkZ2VzIGZvciB0aGlzIG5vZGUgKG1heFRvdGFsKS5cbiAgQ29uc2lkZXIgdW5kZWZpbmVkIHRoaW5ncyBhcyBmYWxzZS91bmFsbG93ZWQgLT4gd2hpdGVsaXN0IGJlaGF2aW9yLlxuXG4gIHRoZSBub2Rlcy9lZGdlcyBjbGFzcyBsaXN0ZWQgYmVsb3cgYXJlIHRob3NlIHVzZWQgaW4gdGhlIHByb2dyYW0uXG4gIEZvciBpbnN0YW5jZSBcImNvbXBhcnRtZW50XCIgaXNuJ3QgYSBub2RlIGluIFNCR04gc3BlY3MuXG4qL1xuZWxlbWVudFV0aWxpdGllcy5QRC5jb25uZWN0aXZpdHlDb25zdHJhaW50cyA9IHtcbiAgXCJjb25zdW1wdGlvblwiOiB7XG4gICAgXCJtYWNyb21vbGVjdWxlXCI6ICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwic2ltcGxlIGNoZW1pY2FsXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wbGV4XCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInNvdXJjZSBhbmQgc2lua1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX19LFxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319XG4gIH0sXG4gIFwicHJvZHVjdGlvblwiOiB7XG4gICAgXCJtYWNyb21vbGVjdWxlXCI6ICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJjb21wbGV4XCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fVxuICB9LFxuICBcIm1vZHVsYXRpb25cIjoge1xuICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInByb2Nlc3NcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcImFzc29jaWF0aW9uXCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImRpc3NvY2lhdGlvblwiOiAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fVxuICB9LFxuICBcInN0aW11bGF0aW9uXCI6IHtcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjogICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX1cbiAgfSxcbiAgXCJjYXRhbHlzaXNcIjoge1xuICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInNvdXJjZSBhbmQgc2lua1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxfX0sXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxfX0sXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxfX0sXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX1cbiAgfSxcbiAgXCJpbmhpYml0aW9uXCI6IHtcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjogICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX1cbiAgfSxcbiAgXCJuZWNlc3Nhcnkgc3RpbXVsYXRpb25cIjoge1xuICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInByb2Nlc3NcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDF9fSxcbiAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDF9fSxcbiAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDF9fSxcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDF9fSxcbiAgICBcImFzc29jaWF0aW9uXCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImRpc3NvY2lhdGlvblwiOiAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgfSxcbiAgXCJsb2dpYyBhcmNcIjoge1xuICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwidW5jZXJ0YWluIHByb2Nlc3NcIjogICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJub3RcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9fSxcbiAgfSxcbiAgXCJlcXVpdmFsZW5jZSBhcmNcIjoge1xuICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge319LFxuICAgIFwic2ltcGxlIGNoZW1pY2FsXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge319LFxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge319LFxuICAgIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwidW5jZXJ0YWluIHByb2Nlc3NcIjogICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319XG4gIH1cbn07XG5cbi8qIEFGIG5vZGUgY29ubmVjdGl2aXR5IHJ1bGVzXG4gKiBTZWU6IFN5c3RlbXMgQmlvbG9neSBHcmFwaGljYWwgTm90YXRpb246IEFjdGl2aXR5IEZsb3cgbGFuZ3VhZ2UgTGV2ZWwgMSwgVmVyc2lvbiAxLjIsIERhdGU6IEp1bHkgMjcsIDIwMTVcbiAqICAgU2VjdGlvbiAzLjMuMTogQWN0aXZpdHkgTm9kZXMgY29ubmVjdGl2aXR5IGRlZmluaXRpb25cbiAqICAgVVJMOiBodHRwczovL2RvaS5vcmcvMTAuMjM5MC9iaWVjb2xsLWppYi0yMDE1LTI2NVxuICovXG5lbGVtZW50VXRpbGl0aWVzLkFGLmNvbm5lY3Rpdml0eUNvbnN0cmFpbnRzID0ge1xuICBcInBvc2l0aXZlIGluZmx1ZW5jZVwiOiB7XG4gICAgXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI6ICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJkZWxheVwiOiAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICB9LFxuICBcIm5lZ2F0aXZlIGluZmx1ZW5jZVwiOiB7XG4gICAgXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI6ICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJkZWxheVwiOiAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICB9LFxuICBcInVua25vd24gaW5mbHVlbmNlXCI6IHtcbiAgICBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjogIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImRlbGF5XCI6ICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gIH0sXG4gIFwibmVjZXNzYXJ5IHN0aW11bGF0aW9uXCI6IHtcbiAgICBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjogIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImRlbGF5XCI6ICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gIH0sXG4gIFwibG9naWMgYXJjXCI6IHtcbiAgICBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjogIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfX0sXG4gICAgXCJkZWxheVwiOiAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX19LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICB9LFxuICBcImVxdWl2YWxlbmNlIGFyY1wiOiB7XG4gICAgXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI6ICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJub3RcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJkZWxheVwiOiAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gIH0sXG59XG4vLyBpbml0aWFsaXplIGEgZ2xvYmFsIHVuaXQgb2YgaW5mb3JtYXRpb24gb2JqZWN0XG52YXIgdW9pX29iaiA9IHt9O1xudW9pX29iai5jbGF6eiA9IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiO1xudW9pX29iai5sYWJlbCA9IHtcbiAgdGV4dDogXCJcIlxufTtcblxudW9pX29iai5iYm94ID0ge1xuICAgdzogMzAsXG4gICBoOiAxMlxufTtcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcblxuLy8gc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzg4MDk0NzJcbi8vIHdlIG5lZWQgdG8gdGFrZSBjYXJlIG9mIG91ciBvd24gSURzIGJlY2F1c2UgdGhlIG9uZXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgY3l0b3NjYXBlIChhbHNvIFVVSUQpXG4vLyBkb24ndCBjb21wbHkgd2l0aCB4c2Q6U0lEIHR5cGUgdGhhdCBtdXN0IG5vdCBiZWdpbiB3aXRoIGEgbnVtYmVyXG5mdW5jdGlvbiBnZW5lcmF0ZVVVSUQgKCkgeyAvLyBQdWJsaWMgRG9tYWluL01JVFxuICAgIHZhciBkID0gRGF0ZS5ub3coKTtcbiAgICBpZiAodHlwZW9mIHBlcmZvcm1hbmNlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcGVyZm9ybWFuY2Uubm93ID09PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgZCArPSBwZXJmb3JtYW5jZS5ub3coKTsgLy91c2UgaGlnaC1wcmVjaXNpb24gdGltZXIgaWYgYXZhaWxhYmxlXG4gICAgfVxuICAgIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIHZhciByID0gKGQgKyBNYXRoLnJhbmRvbSgpICogMTYpICUgMTYgfCAwO1xuICAgICAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpO1xuICAgICAgICByZXR1cm4gKGMgPT09ICd4JyA/IHIgOiAociAmIDB4MyB8IDB4OCkpLnRvU3RyaW5nKDE2KTtcbiAgICB9KTtcbn1cblxuZWxlbWVudFV0aWxpdGllcy5hZGROb2RlID0gZnVuY3Rpb24gKHgsIHksIG5vZGVQYXJhbXMsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcbiAgaWYgKHR5cGVvZiBub2RlUGFyYW1zICE9ICdvYmplY3QnKXtcbiAgICB2YXIgc2JnbmNsYXNzID0gbm9kZVBhcmFtcztcbiAgfSBlbHNlIHtcbiAgICAgIHZhciBzYmduY2xhc3MgPSBub2RlUGFyYW1zLmNsYXNzO1xuICAgICAgdmFyIGxhbmd1YWdlID0gbm9kZVBhcmFtcy5sYW5ndWFnZTtcbiAgfVxuICB2YXIgZGVmYXVsdFByb3BlcnRpZXMgPSB0aGlzLmRlZmF1bHRQcm9wZXJ0aWVzO1xuICB2YXIgZGVmYXVsdHMgPSBkZWZhdWx0UHJvcGVydGllc1tzYmduY2xhc3NdO1xuXG4gIHZhciB3aWR0aCA9IGRlZmF1bHRzID8gZGVmYXVsdHMud2lkdGggOiA1MDtcbiAgdmFyIGhlaWdodCA9IGRlZmF1bHRzID8gZGVmYXVsdHMuaGVpZ2h0IDogNTA7XG4gIFxuICB2YXIgY3NzID0ge307XG5cblxuICBpZiAodmlzaWJpbGl0eSkge1xuICAgIGNzcy52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcbiAgfVxuXG4gIGlmIChkZWZhdWx0cyAmJiBkZWZhdWx0cy5tdWx0aW1lcikge1xuICAgIHNiZ25jbGFzcyArPSBcIiBtdWx0aW1lclwiO1xuICB9XG4gIHZhciBkYXRhID0ge1xuICAgIGNsYXNzOiBzYmduY2xhc3MsXG5cdGxhbmd1YWdlOiBsYW5ndWFnZSxcbiAgICBiYm94OiB7XG4gICAgICBoOiBoZWlnaHQsXG4gICAgICB3OiB3aWR0aCxcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfSxcbiAgICBzdGF0ZXNhbmRpbmZvczogW10sXG4gICAgcG9ydHM6IFtdLFxuICAgIGNsb25lbWFya2VyOiBkZWZhdWx0cyAmJiBkZWZhdWx0cy5jbG9uZW1hcmtlciA/IGRlZmF1bHRzLmNsb25lbWFya2VyIDogdW5kZWZpbmVkXG4gIH07XG5cbiAgaWYoaWQpIHtcbiAgICBkYXRhLmlkID0gaWQ7XG4gIH1cbiAgZWxzZSB7XG4gICAgZGF0YS5pZCA9IFwibnd0Tl9cIiArIGdlbmVyYXRlVVVJRCgpO1xuICB9XG4gIFxuICBpZiAocGFyZW50KSB7XG4gICAgZGF0YS5wYXJlbnQgPSBwYXJlbnQ7XG4gIH1cblxuICB2YXIgZWxlcyA9IGN5LmFkZCh7XG4gICAgZ3JvdXA6IFwibm9kZXNcIixcbiAgICBkYXRhOiBkYXRhLFxuICAgIGNzczogY3NzLFxuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH1cbiAgfSk7XG5cbiAgdmFyIG5ld05vZGUgPSBlbGVzW2VsZXMubGVuZ3RoIC0gMV07XG4gIHZhciBvcmRlcmluZyA9IHRoaXMuZGVmYXVsdFByb3BlcnRpZXNbc2JnbmNsYXNzXVsncG9ydHMtb3JkZXJpbmcnXTsgLy8gR2V0IHRoZSBkZWZhdWx0IHBvcnRzIG9yZGVyaW5nIGZvciB0aGUgbm9kZXMgd2l0aCBnaXZlbiBzYmduY2xhc3NcblxuICAvLyBJZiB0aGVyZSBpcyBhIGRlZmF1bHQgcG9ydHMgb3JkZXJpbmcgZm9yIHRoZSBub2RlcyB3aXRoIGdpdmVuIHNiZ25jbGFzcyBhbmQgaXQgaXMgZGlmZmVyZW50IHRoYW4gJ25vbmUnIHNldCB0aGUgcG9ydHMgb3JkZXJpbmcgdG8gdGhhdCBvcmRlcmluZ1xuICBpZiAob3JkZXJpbmcgJiYgb3JkZXJpbmcgIT09ICdub25lJykge1xuICAgIHRoaXMuc2V0UG9ydHNPcmRlcmluZyhuZXdOb2RlLCBvcmRlcmluZyk7XG4gIH1cblxuICBpZiAobGFuZ3VhZ2UgPT0gXCJBRlwiICYmICFlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVNdWx0aXBsZVVuaXRPZkluZm9ybWF0aW9uKG5ld05vZGUpKXtcbiAgICBpZiAoc2JnbmNsYXNzICE9IFwiQkEgcGxhaW5cIikgIC8vIGlmIEFGIG5vZGUgY2FuIGhhdmUgbGFiZWwgaS5lOiBub3QgcGxhaW4gYmlvbG9naWNhbCBhY3Rpdml0eSBcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobmV3Tm9kZSwgdW9pX29iaik7XG4gIH1cblxuICByZXR1cm4gbmV3Tm9kZTtcbn07XG5cbmVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHRhcmdldCwgZWRnZVBhcmFtcywgaWQsIHZpc2liaWxpdHkpIHtcbiAgaWYgKHR5cGVvZiBlZGdlUGFyYW1zICE9ICdvYmplY3QnKXtcbiAgICB2YXIgc2JnbmNsYXNzID0gZWRnZVBhcmFtcztcbiAgfSBlbHNlIHtcbiAgICAgIHZhciBzYmduY2xhc3MgPSBlZGdlUGFyYW1zLmNsYXNzO1xuICAgICAgdmFyIGxhbmd1YWdlID0gZWRnZVBhcmFtcy5sYW5ndWFnZTtcbiAgfVxuICB2YXIgZGVmYXVsdFByb3BlcnRpZXMgPSB0aGlzLmRlZmF1bHRQcm9wZXJ0aWVzO1xuICB2YXIgZGVmYXVsdHMgPSBkZWZhdWx0UHJvcGVydGllc1tzYmduY2xhc3NdO1xuICBcbiAgdmFyIGNzcyA9IHt9O1xuXG4gIGlmICh2aXNpYmlsaXR5KSB7XG4gICAgY3NzLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xuICB9XG5cbiAgdmFyIGRhdGEgPSB7XG4gICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgY2xhc3M6IHNiZ25jbGFzcyxcbiAgICAgIGxhbmd1YWdlOiBsYW5ndWFnZSxcbiAgfTtcbiAgXG4gIGlmKGlkKSB7XG4gICAgZGF0YS5pZCA9IGlkO1xuICB9XG4gIGVsc2Uge1xuICAgIGRhdGEuaWQgPSBcIm53dEVfXCIgKyBnZW5lcmF0ZVVVSUQoKTtcbiAgfVxuICBcbiAgdmFyIHNvdXJjZU5vZGUgPSBjeS5nZXRFbGVtZW50QnlJZChzb3VyY2UpOyAvLyBUaGUgb3JpZ2luYWwgc291cmNlIG5vZGVcbiAgdmFyIHRhcmdldE5vZGUgPSBjeS5nZXRFbGVtZW50QnlJZCh0YXJnZXQpOyAvLyBUaGUgb3JpZ2luYWwgdGFyZ2V0IG5vZGVcbiAgdmFyIHNvdXJjZUhhc1BvcnRzID0gc291cmNlTm9kZS5kYXRhKCdwb3J0cycpLmxlbmd0aCA9PT0gMjtcbiAgdmFyIHRhcmdldEhhc1BvcnRzID0gdGFyZ2V0Tm9kZS5kYXRhKCdwb3J0cycpLmxlbmd0aCA9PT0gMjtcbiAgLy8gVGhlIHBvcnRzb3VyY2UgYW5kIHBvcnR0YXJnZXQgdmFyaWFibGVzXG4gIHZhciBwb3J0c291cmNlO1xuICB2YXIgcG9ydHRhcmdldDtcbiAgXG4gIC8qXG4gICAqIEdldCBpbnB1dC9vdXRwdXQgcG9ydCBpZCdzIG9mIGEgbm9kZSB3aXRoIHRoZSBhc3N1bXB0aW9uIHRoYXQgdGhlIG5vZGUgaGFzIHZhbGlkIHBvcnRzLlxuICAgKi9cbiAgdmFyIGdldElPUG9ydElkcyA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgdmFyIG5vZGVJbnB1dFBvcnRJZCwgbm9kZU91dHB1dFBvcnRJZDtcbiAgICB2YXIgbm9kZVBvcnRzT3JkZXJpbmcgPSBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXMuZ2V0UG9ydHNPcmRlcmluZyhub2RlKTtcbiAgICB2YXIgbm9kZVBvcnRzID0gbm9kZS5kYXRhKCdwb3J0cycpO1xuICAgIGlmICggbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdMLXRvLVInIHx8IG5vZGVQb3J0c09yZGVyaW5nID09PSAnUi10by1MJyApIHtcbiAgICAgIHZhciBsZWZ0UG9ydElkID0gbm9kZVBvcnRzWzBdLnggPCAwID8gbm9kZVBvcnRzWzBdLmlkIDogbm9kZVBvcnRzWzFdLmlkOyAvLyBUaGUgeCB2YWx1ZSBvZiBsZWZ0IHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgbmVnYXRpdmVcbiAgICAgIHZhciByaWdodFBvcnRJZCA9IG5vZGVQb3J0c1swXS54ID4gMCA/IG5vZGVQb3J0c1swXS5pZCA6IG5vZGVQb3J0c1sxXS5pZDsgLy8gVGhlIHggdmFsdWUgb2YgcmlnaHQgcG9ydCBpcyBzdXBwb3NlZCB0byBiZSBwb3NpdGl2ZVxuICAgICAgLypcbiAgICAgICAqIElmIHRoZSBwb3J0IG9yZGVyaW5nIGlzIGxlZnQgdG8gcmlnaHQgdGhlbiB0aGUgaW5wdXQgcG9ydCBpcyB0aGUgbGVmdCBwb3J0IGFuZCB0aGUgb3V0cHV0IHBvcnQgaXMgdGhlIHJpZ2h0IHBvcnQuXG4gICAgICAgKiBFbHNlIGlmIGl0IGlzIHJpZ2h0IHRvIGxlZnQgaXQgaXMgdmljZSB2ZXJzYVxuICAgICAgICovXG4gICAgICBub2RlSW5wdXRQb3J0SWQgPSBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ0wtdG8tUicgPyBsZWZ0UG9ydElkIDogcmlnaHRQb3J0SWQ7XG4gICAgICBub2RlT3V0cHV0UG9ydElkID0gbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdSLXRvLUwnID8gbGVmdFBvcnRJZCA6IHJpZ2h0UG9ydElkO1xuICAgIH1cbiAgICBlbHNlIGlmICggbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdULXRvLUInIHx8IG5vZGVQb3J0c09yZGVyaW5nID09PSAnQi10by1UJyApe1xuICAgICAgdmFyIHRvcFBvcnRJZCA9IG5vZGVQb3J0c1swXS55IDwgMCA/IG5vZGVQb3J0c1swXS5pZCA6IG5vZGVQb3J0c1sxXS5pZDsgLy8gVGhlIHkgdmFsdWUgb2YgdG9wIHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgbmVnYXRpdmVcbiAgICAgIHZhciBib3R0b21Qb3J0SWQgPSBub2RlUG9ydHNbMF0ueSA+IDAgPyBub2RlUG9ydHNbMF0uaWQgOiBub2RlUG9ydHNbMV0uaWQ7IC8vIFRoZSB5IHZhbHVlIG9mIGJvdHRvbSBwb3J0IGlzIHN1cHBvc2VkIHRvIGJlIHBvc2l0aXZlXG4gICAgICAvKlxuICAgICAgICogSWYgdGhlIHBvcnQgb3JkZXJpbmcgaXMgdG9wIHRvIGJvdHRvbSB0aGVuIHRoZSBpbnB1dCBwb3J0IGlzIHRoZSB0b3AgcG9ydCBhbmQgdGhlIG91dHB1dCBwb3J0IGlzIHRoZSBib3R0b20gcG9ydC5cbiAgICAgICAqIEVsc2UgaWYgaXQgaXMgcmlnaHQgdG8gbGVmdCBpdCBpcyB2aWNlIHZlcnNhXG4gICAgICAgKi9cbiAgICAgIG5vZGVJbnB1dFBvcnRJZCA9IG5vZGVQb3J0c09yZGVyaW5nID09PSAnVC10by1CJyA/IHRvcFBvcnRJZCA6IGJvdHRvbVBvcnRJZDtcbiAgICAgIG5vZGVPdXRwdXRQb3J0SWQgPSBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ0ItdG8tVCcgPyB0b3BQb3J0SWQgOiBib3R0b21Qb3J0SWQ7XG4gICAgfVxuICAgIFxuICAgIC8vIFJldHVybiBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgSU8gcG9ydHMgb2YgdGhlIG5vZGVcbiAgICByZXR1cm4ge1xuICAgICAgaW5wdXRQb3J0SWQ6IG5vZGVJbnB1dFBvcnRJZCxcbiAgICAgIG91dHB1dFBvcnRJZDogbm9kZU91dHB1dFBvcnRJZFxuICAgIH07XG4gIH07XG4gIFxuICAvLyBJZiBhdCBsZWFzdCBvbmUgZW5kIG9mIHRoZSBlZGdlIGhhcyBwb3J0cyB0aGVuIHdlIHNob3VsZCBkZXRlcm1pbmUgdGhlIHBvcnRzIHdoZXJlIHRoZSBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQuXG4gIGlmIChzb3VyY2VIYXNQb3J0cyB8fCB0YXJnZXRIYXNQb3J0cykge1xuICAgIHZhciBzb3VyY2VOb2RlSW5wdXRQb3J0SWQsIHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQsIHRhcmdldE5vZGVJbnB1dFBvcnRJZCwgdGFyZ2V0Tm9kZU91dHB1dFBvcnRJZDtcbiAgICBcbiAgICAvLyBJZiBzb3VyY2Ugbm9kZSBoYXMgcG9ydHMgc2V0IHRoZSB2YXJpYWJsZXMgZGVkaWNhdGVkIGZvciBpdHMgSU8gcG9ydHNcbiAgICBpZiAoIHNvdXJjZUhhc1BvcnRzICkge1xuICAgICAgdmFyIGlvUG9ydHMgPSBnZXRJT1BvcnRJZHMoc291cmNlTm9kZSk7XG4gICAgICBzb3VyY2VOb2RlSW5wdXRQb3J0SWQgPSBpb1BvcnRzLmlucHV0UG9ydElkO1xuICAgICAgc291cmNlTm9kZU91dHB1dFBvcnRJZCA9IGlvUG9ydHMub3V0cHV0UG9ydElkO1xuICAgIH1cbiAgICBcbiAgICAvLyBJZiB0YXJnZXQgbm9kZSBoYXMgcG9ydHMgc2V0IHRoZSB2YXJpYWJsZXMgZGVkaWNhdGVkIGZvciBpdHMgSU8gcG9ydHNcbiAgICBpZiAoIHRhcmdldEhhc1BvcnRzICkge1xuICAgICAgdmFyIGlvUG9ydHMgPSBnZXRJT1BvcnRJZHModGFyZ2V0Tm9kZSk7XG4gICAgICB0YXJnZXROb2RlSW5wdXRQb3J0SWQgPSBpb1BvcnRzLmlucHV0UG9ydElkO1xuICAgICAgdGFyZ2V0Tm9kZU91dHB1dFBvcnRJZCA9IGlvUG9ydHMub3V0cHV0UG9ydElkO1xuICAgIH1cblxuICAgIGlmIChzYmduY2xhc3MgPT09ICdjb25zdW1wdGlvbicpIHtcbiAgICAgIC8vIEEgY29uc3VtcHRpb24gZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBpbnB1dCBwb3J0IG9mIHRoZSB0YXJnZXQgbm9kZSB3aGljaCBpcyBzdXBwb3NlZCB0byBiZSBhIHByb2Nlc3MgKGFueSBraW5kIG9mKVxuICAgICAgcG9ydHRhcmdldCA9IHRhcmdldE5vZGVJbnB1dFBvcnRJZDtcbiAgICB9XG4gICAgZWxzZSBpZiAoc2JnbmNsYXNzID09PSAncHJvZHVjdGlvbicgfHwgdGhpcy5pc01vZHVsYXRpb25BcmNDbGFzcyhzYmduY2xhc3MpKSB7XG4gICAgICAvLyBBIHByb2R1Y3Rpb24gZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBvdXRwdXQgcG9ydCBvZiB0aGUgc291cmNlIG5vZGUgd2hpY2ggaXMgc3VwcG9zZWQgdG8gYmUgYSBwcm9jZXNzIChhbnkga2luZCBvZilcbiAgICAgIC8vIEEgbW9kdWxhdGlvbiBlZGdlIG1heSBoYXZlIGEgbG9naWNhbCBvcGVyYXRvciBhcyBzb3VyY2Ugbm9kZSBpbiB0aGlzIGNhc2UgdGhlIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgb3V0cHV0IHBvcnQgb2YgaXRcbiAgICAgIC8vIFRoZSBiZWxvdyBhc3NpZ25tZW50IHNhdGlzZnkgYWxsIG9mIHRoZXNlIGNvbmRpdGlvblxuICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PT0gJ2xvZ2ljIGFyYycpIHtcbiAgICAgIHZhciBzcmNDbGFzcyA9IHNvdXJjZU5vZGUuZGF0YSgnY2xhc3MnKTtcbiAgICAgIHZhciB0Z3RDbGFzcyA9IHRhcmdldE5vZGUuZGF0YSgnY2xhc3MnKTtcbiAgICAgIHZhciBpc1NvdXJjZUxvZ2ljYWxPcCA9IHNyY0NsYXNzID09PSAnYW5kJyB8fCBzcmNDbGFzcyA9PT0gJ29yJyB8fCBzcmNDbGFzcyA9PT0gJ25vdCc7XG4gICAgICB2YXIgaXNUYXJnZXRMb2dpY2FsT3AgPSB0Z3RDbGFzcyA9PT0gJ2FuZCcgfHwgdGd0Q2xhc3MgPT09ICdvcicgfHwgdGd0Q2xhc3MgPT09ICdub3QnO1xuICAgICAgXG4gICAgICBpZiAoaXNTb3VyY2VMb2dpY2FsT3AgJiYgaXNUYXJnZXRMb2dpY2FsT3ApIHtcbiAgICAgICAgLy8gSWYgYm90aCBlbmQgYXJlIGxvZ2ljYWwgb3BlcmF0b3JzIHRoZW4gdGhlIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgaW5wdXQgcG9ydCBvZiB0aGUgdGFyZ2V0IGFuZCB0aGUgb3V0cHV0IHBvcnQgb2YgdGhlIGlucHV0XG4gICAgICAgIHBvcnR0YXJnZXQgPSB0YXJnZXROb2RlSW5wdXRQb3J0SWQ7XG4gICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlT3V0cHV0UG9ydElkO1xuICAgICAgfS8vIElmIGp1c3Qgb25lIGVuZCBvZiBsb2dpY2FsIG9wZXJhdG9yIHRoZW4gdGhlIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgaW5wdXQgcG9ydCBvZiB0aGUgbG9naWNhbCBvcGVyYXRvclxuICAgICAgZWxzZSBpZiAoaXNTb3VyY2VMb2dpY2FsT3ApIHtcbiAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVJbnB1dFBvcnRJZDsgXG4gICAgICB9XG4gICAgICBlbHNlIGlmIChpc1RhcmdldExvZ2ljYWxPcCkge1xuICAgICAgICBwb3J0dGFyZ2V0ID0gdGFyZ2V0Tm9kZUlucHV0UG9ydElkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgLy8gVGhlIGRlZmF1bHQgcG9ydHNvdXJjZS9wb3J0dGFyZ2V0IGFyZSB0aGUgc291cmNlL3RhcmdldCB0aGVtc2VsdmVzLiBJZiB0aGV5IGFyZSBub3Qgc2V0IHVzZSB0aGVzZSBkZWZhdWx0cy5cbiAgLy8gVGhlIHBvcnRzb3VyY2UgYW5kIHBvcnR0YXJnZXQgYXJlIGRldGVybWluZWQgc2V0IHRoZW0gaW4gZGF0YSBvYmplY3QuIFxuICBkYXRhLnBvcnRzb3VyY2UgPSBwb3J0c291cmNlIHx8IHNvdXJjZTtcbiAgZGF0YS5wb3J0dGFyZ2V0ID0gcG9ydHRhcmdldCB8fCB0YXJnZXQ7XG5cbiAgdmFyIGVsZXMgPSBjeS5hZGQoe1xuICAgIGdyb3VwOiBcImVkZ2VzXCIsXG4gICAgZGF0YTogZGF0YSxcbiAgICBjc3M6IGNzc1xuICB9KTtcblxuICB2YXIgbmV3RWRnZSA9IGVsZXNbZWxlcy5sZW5ndGggLSAxXTtcbiAgXG4gIHJldHVybiBuZXdFZGdlO1xufTtcblxuZWxlbWVudFV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyA9IGZ1bmN0aW9uKF9zb3VyY2UsIF90YXJnZXQsIHByb2Nlc3NUeXBlKSB7XG4gIC8vIElmIHNvdXJjZSBhbmQgdGFyZ2V0IElEcyBhcmUgZ2l2ZW4gZ2V0IHRoZSBlbGVtZW50cyBieSBJRHNcbiAgdmFyIHNvdXJjZSA9IHR5cGVvZiBfc291cmNlID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9zb3VyY2UpIDogX3NvdXJjZTtcbiAgdmFyIHRhcmdldCA9IHR5cGVvZiBfdGFyZ2V0ID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF90YXJnZXQpIDogX3RhcmdldDtcbiAgXG4gIC8vIFByb2Nlc3MgcGFyZW50IHNob3VsZCBiZSB0aGUgY2xvc2VzdCBjb21tb24gYW5jZXN0b3Igb2YgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0IG5vZGVzXG4gIHZhciBwcm9jZXNzUGFyZW50ID0gY3kuY29sbGVjdGlvbihbc291cmNlWzBdLCB0YXJnZXRbMF1dKS5jb21tb25BbmNlc3RvcnMoKS5maXJzdCgpO1xuICBcbiAgLy8gUHJvY2VzcyBzaG91bGQgYmUgYXQgdGhlIG1pZGRsZSBvZiB0aGUgc291cmNlIGFuZCB0YXJnZXQgbm9kZXNcbiAgdmFyIHggPSAoIHNvdXJjZS5wb3NpdGlvbigneCcpICsgdGFyZ2V0LnBvc2l0aW9uKCd4JykgKSAvIDI7XG4gIHZhciB5ID0gKCBzb3VyY2UucG9zaXRpb24oJ3knKSArIHRhcmdldC5wb3NpdGlvbigneScpICkgLyAyO1xuICBcbiAgLy8gQ3JlYXRlIHRoZSBwcm9jZXNzIHdpdGggZ2l2ZW4vY2FsY3VsYXRlZCB2YXJpYWJsZXNcbiAgdmFyIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeCwgeSwgcHJvY2Vzc1R5cGUsIHVuZGVmaW5lZCwgcHJvY2Vzc1BhcmVudC5pZCgpKTtcbiAgXG4gIC8vIENyZWF0ZSB0aGUgZWRnZXMgb25lIGlzIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSBzb3VyY2Ugbm9kZSAod2hpY2ggc2hvdWxkIGJlIGEgY29uc3VtcHRpb24pLCBcbiAgLy8gdGhlIG90aGVyIG9uZSBpcyBiZXR3ZWVuIHRoZSBwcm9jZXNzIGFuZCB0aGUgdGFyZ2V0IG5vZGUgKHdoaWNoIHNob3VsZCBiZSBhIHByb2R1Y3Rpb24pLlxuICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBwbGVhc2UgcmVmZXIgdG8gU0JHTi1QRCByZWZlcmVuY2UgY2FyZC5cbiAgdmFyIGVkZ2VCdHdTcmMgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2Uoc291cmNlLmlkKCksIHByb2Nlc3MuaWQoKSwgJ2NvbnN1bXB0aW9uJyk7XG4gIHZhciBlZGdlQnR3VGd0ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgdGFyZ2V0LmlkKCksICdwcm9kdWN0aW9uJyk7XG4gIFxuICAvLyBDcmVhdGUgYSBjb2xsZWN0aW9uIGluY2x1ZGluZyB0aGUgZWxlbWVudHMgYW5kIHRvIGJlIHJldHVybmVkXG4gIHZhciBjb2xsZWN0aW9uID0gY3kuY29sbGVjdGlvbihbcHJvY2Vzc1swXSwgZWRnZUJ0d1NyY1swXSwgZWRnZUJ0d1RndFswXV0pO1xuICByZXR1cm4gY29sbGVjdGlvbjtcbn07XG5cbi8qXG4gKiBSZXR1cm5zIGlmIHRoZSBlbGVtZW50cyB3aXRoIHRoZSBnaXZlbiBwYXJlbnQgY2xhc3MgY2FuIGJlIHBhcmVudCBvZiB0aGUgZWxlbWVudHMgd2l0aCB0aGUgZ2l2ZW4gbm9kZSBjbGFzc1xuICovXG5lbGVtZW50VXRpbGl0aWVzLmlzVmFsaWRQYXJlbnQgPSBmdW5jdGlvbihfbm9kZUNsYXNzLCBfcGFyZW50Q2xhc3MpIHtcbiAgLy8gSWYgbm9kZUNsYXNzIGFuZCBwYXJlbnRDbGFzcyBwYXJhbXMgYXJlIGVsZW1lbnRzIGl0c2VsdmVzIGluc3RlYWQgb2YgdGhlaXIgY2xhc3MgbmFtZXMgaGFuZGxlIGl0XG4gIHZhciBub2RlQ2xhc3MgPSB0eXBlb2YgX25vZGVDbGFzcyAhPT0gJ3N0cmluZycgPyBfbm9kZUNsYXNzLmRhdGEoJ2NsYXNzJykgOiBfbm9kZUNsYXNzO1xuICB2YXIgcGFyZW50Q2xhc3MgPSBfcGFyZW50Q2xhc3MgIT0gdW5kZWZpbmVkICYmIHR5cGVvZiBfcGFyZW50Q2xhc3MgIT09ICdzdHJpbmcnID8gX3BhcmVudENsYXNzLmRhdGEoJ2NsYXNzJykgOiBfcGFyZW50Q2xhc3M7XG4gIFxuICBpZiAocGFyZW50Q2xhc3MgPT0gdW5kZWZpbmVkIHx8IHBhcmVudENsYXNzID09PSAnY29tcGFydG1lbnQnKSB7IC8vIENvbXBhcnRtZW50cyBhbmQgdGhlIHJvb3QgY2FuIGluY2x1ZGUgYW55IHR5cGUgb2Ygbm9kZXNcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBlbHNlIGlmIChwYXJlbnRDbGFzcyA9PT0gJ2NvbXBsZXgnKSB7IC8vIENvbXBsZXhlcyBjYW4gb25seSBpbmNsdWRlIEVQTnNcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKG5vZGVDbGFzcyk7XG4gIH1cbiAgXG4gIHJldHVybiBmYWxzZTsgLy8gQ3VycmVudGx5IGp1c3QgJ2NvbXBhcnRtZW50JyBhbmQgJ2NvbXBsZXgnIGNvbXBvdW5kcyBhcmUgc3VwcG9ydGVkIHJldHVybiBmYWxzZSBmb3IgYW55IG90aGVyIHBhcmVudENsYXNzXG59O1xuXG4vKlxuICogVGhpcyBtZXRob2QgYXNzdW1lcyB0aGF0IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQgY29udGFpbnMgYXQgbGVhc3Qgb25lIG5vZGVcbiAqIGFuZCBhbGwgb2YgdGhlIG5vZGVzIGluY2x1ZGluZyBpbiBpdCBoYXZlIHRoZSBzYW1lIHBhcmVudC4gSXQgY3JlYXRlcyBhIGNvbXBvdW5kIGZvdCB0aGUgZ2l2ZW4gbm9kZXMgYW4gaGF2aW5nIHRoZSBnaXZlbiB0eXBlLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChub2Rlc1RvTWFrZUNvbXBvdW5kLCBjb21wb3VuZFR5cGUpIHtcbiAgdmFyIG9sZFBhcmVudElkID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwicGFyZW50XCIpO1xuICAvLyBUaGUgcGFyZW50IG9mIG5ldyBjb21wb3VuZCB3aWxsIGJlIHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kLiB4LCB5IGFuZCBpZCBwYXJhbWV0ZXJzIGFyZSBub3Qgc2V0LlxuICB2YXIgbmV3Q29tcG91bmQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUodW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbXBvdW5kVHlwZSwgdW5kZWZpbmVkLCBvbGRQYXJlbnRJZCk7XG4gIHZhciBuZXdDb21wb3VuZElkID0gbmV3Q29tcG91bmQuaWQoKTtcbiAgdmFyIG5ld0VsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVBhcmVudChub2Rlc1RvTWFrZUNvbXBvdW5kLCBuZXdDb21wb3VuZElkKTtcbiAgbmV3RWxlcyA9IG5ld0VsZXMudW5pb24obmV3Q29tcG91bmQpO1xuICByZXR1cm4gbmV3RWxlcztcbn07XG5cbi8qXG4gKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcbiAqIGluIHRoZSBjb21wbGV4LiBQYXJhbWV0ZXJzIGFyZSBleHBsYWluZWQgYmVsb3cuXG4gKiB0ZW1wbGF0ZVR5cGU6IFRoZSB0eXBlIG9mIHRoZSB0ZW1wbGF0ZSByZWFjdGlvbi4gSXQgbWF5IGJlICdhc3NvY2lhdGlvbicgb3IgJ2Rpc3NvY2lhdGlvbicgZm9yIG5vdy5cbiAqIG1hY3JvbW9sZWN1bGVMaXN0OiBUaGUgbGlzdCBvZiB0aGUgbmFtZXMgb2YgbWFjcm9tb2xlY3VsZXMgd2hpY2ggd2lsbCBpbnZvbHZlIGluIHRoZSByZWFjdGlvbi5cbiAqIGNvbXBsZXhOYW1lOiBUaGUgbmFtZSBvZiB0aGUgY29tcGxleCBpbiB0aGUgcmVhY3Rpb24uXG4gKiBwcm9jZXNzUG9zaXRpb246IFRoZSBtb2RhbCBwb3NpdGlvbiBvZiB0aGUgcHJvY2VzcyBpbiB0aGUgcmVhY3Rpb24uIFRoZSBkZWZhdWx0IHZhbHVlIGlzIHRoZSBjZW50ZXIgb2YgdGhlIGNhbnZhcy5cbiAqIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cbiAqIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiBUaGlzIG9wdGlvbiB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY29zZS1iaWxrZW50IGxheW91dCB3aXRoIHRoZSBzYW1lIG5hbWUuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDE1LlxuICogZWRnZUxlbmd0aDogVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSBtYWNyb21vbGVjdWxlcyBhdCB0aGUgYm90aCBzaWRlcy5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHRlbXBsYXRlVHlwZSwgbWFjcm9tb2xlY3VsZUxpc3QsIGNvbXBsZXhOYW1lLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgpIHtcbiAgdmFyIGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1tcIm1hY3JvbW9sZWN1bGVcIl07XG4gIHZhciB0ZW1wbGF0ZVR5cGUgPSB0ZW1wbGF0ZVR5cGU7XG4gIHZhciBwcm9jZXNzV2lkdGggPSBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW3RlbXBsYXRlVHlwZV0gPyBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW3RlbXBsYXRlVHlwZV0ud2lkdGggOiA1MDtcbiAgdmFyIG1hY3JvbW9sZWN1bGVXaWR0aCA9IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID8gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMud2lkdGggOiA1MDtcbiAgdmFyIG1hY3JvbW9sZWN1bGVIZWlnaHQgPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA/IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLmhlaWdodCA6IDUwO1xuICB2YXIgcHJvY2Vzc1Bvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uID8gcHJvY2Vzc1Bvc2l0aW9uIDogZWxlbWVudFV0aWxpdGllcy5jb252ZXJ0VG9Nb2RlbFBvc2l0aW9uKHt4OiBjeS53aWR0aCgpIC8gMiwgeTogY3kuaGVpZ2h0KCkgLyAyfSk7XG4gIHZhciBtYWNyb21vbGVjdWxlTGlzdCA9IG1hY3JvbW9sZWN1bGVMaXN0O1xuICB2YXIgY29tcGxleE5hbWUgPSBjb21wbGV4TmFtZTtcbiAgdmFyIG51bU9mTWFjcm9tb2xlY3VsZXMgPSBtYWNyb21vbGVjdWxlTGlzdC5sZW5ndGg7XG4gIHZhciB0aWxpbmdQYWRkaW5nVmVydGljYWwgPSB0aWxpbmdQYWRkaW5nVmVydGljYWwgPyB0aWxpbmdQYWRkaW5nVmVydGljYWwgOiAxNTtcbiAgdmFyIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID0gdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPyB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA6IDE1O1xuICB2YXIgZWRnZUxlbmd0aCA9IGVkZ2VMZW5ndGggPyBlZGdlTGVuZ3RoIDogNjA7XG5cbiAgY3kuc3RhcnRCYXRjaCgpO1xuXG4gIHZhciB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcztcbiAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgIHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG4gIH1cbiAgZWxzZSB7XG4gICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgfVxuXG4gIC8vQ3JlYXRlIHRoZSBwcm9jZXNzIGluIHRlbXBsYXRlIHR5cGVcbiAgdmFyIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCB0ZW1wbGF0ZVR5cGUpO1xuICBwcm9jZXNzLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gIC8vRGVmaW5lIHRoZSBzdGFydGluZyB5IHBvc2l0aW9uXG4gIHZhciB5UG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZNYWNyb21vbGVjdWxlcyAtIDEpIC8gMikgKiAobWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XG5cbiAgLy9DcmVhdGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXNcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1PZk1hY3JvbW9sZWN1bGVzOyBpKyspIHtcbiAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcywgeVBvc2l0aW9uLCBcIm1hY3JvbW9sZWN1bGVcIik7XG4gICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgbWFjcm9tb2xlY3VsZUxpc3RbaV0pO1xuXG4gICAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubmVjdGVkIHRvIHRoZSBuZXcgbWFjcm9tb2xlY3VsZVxuICAgIHZhciBuZXdFZGdlO1xuICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3Tm9kZS5pZCgpLCBwcm9jZXNzLmlkKCksICdjb25zdW1wdGlvbicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBuZXdOb2RlLmlkKCksICdwcm9kdWN0aW9uJyk7XG4gICAgfVxuXG4gICAgbmV3RWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgIC8vdXBkYXRlIHRoZSB5IHBvc2l0aW9uXG4gICAgeVBvc2l0aW9uICs9IG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XG4gIH1cblxuICAvL0NyZWF0ZSB0aGUgY29tcGxleCBpbmNsdWRpbmcgbWFjcm9tb2xlY3VsZXMgaW5zaWRlIG9mIGl0XG4gIC8vVGVtcHJvcmFyaWx5IGFkZCBpdCB0byB0aGUgcHJvY2VzcyBwb3NpdGlvbiB3ZSB3aWxsIG1vdmUgaXQgYWNjb3JkaW5nIHRvIHRoZSBsYXN0IHNpemUgb2YgaXRcbiAgdmFyIGNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCAnY29tcGxleCcpO1xuICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcblxuICAvL0lmIGEgbmFtZSBpcyBzcGVjaWZpZWQgZm9yIHRoZSBjb21wbGV4IHNldCBpdHMgbGFiZWwgYWNjb3JkaW5nbHlcbiAgaWYgKGNvbXBsZXhOYW1lKSB7XG4gICAgY29tcGxleC5kYXRhKCdsYWJlbCcsIGNvbXBsZXhOYW1lKTtcbiAgfVxuXG4gIC8vY3JlYXRlIHRoZSBlZGdlIGNvbm5uZWN0ZWQgdG8gdGhlIGNvbXBsZXhcbiAgdmFyIGVkZ2VPZkNvbXBsZXg7XG4gIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICBlZGdlT2ZDb21wbGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgY29tcGxleC5pZCgpLCAncHJvZHVjdGlvbicpO1xuICB9XG4gIGVsc2Uge1xuICAgIGVkZ2VPZkNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UoY29tcGxleC5pZCgpLCBwcm9jZXNzLmlkKCksICdjb25zdW1wdGlvbicpO1xuICB9XG4gIGVkZ2VPZkNvbXBsZXguZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgLy9DcmVhdGUgdGhlIG1hY3JvbW9sZWN1bGVzIGluc2lkZSB0aGUgY29tcGxleFxuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mTWFjcm9tb2xlY3VsZXM7IGkrKykge1xuICAgIC8vIEFkZCBhIG1hY3JvbW9sZWN1bGUgbm90IGhhdmluZyBhIHByZXZpb3VzbHkgZGVmaW5lZCBpZCBhbmQgaGF2aW5nIHRoZSBjb21wbGV4IGNyZWF0ZWQgaW4gdGhpcyByZWFjdGlvbiBhcyBwYXJlbnRcbiAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShjb21wbGV4LnBvc2l0aW9uKCd4JyksIGNvbXBsZXgucG9zaXRpb24oJ3knKSwgXCJtYWNyb21vbGVjdWxlXCIsIHVuZGVmaW5lZCwgY29tcGxleC5pZCgpKTtcbiAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgIG5ld05vZGUuZGF0YSgnbGFiZWwnLCBtYWNyb21vbGVjdWxlTGlzdFtpXSk7XG4gICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJywgdHJ1ZSk7XG4gIH1cbiAgXG4gIGN5LmVuZEJhdGNoKCk7XG5cbiAgdmFyIGxheW91dE5vZGVzID0gY3kubm9kZXMoJ1tqdXN0QWRkZWRMYXlvdXROb2RlXScpO1xuICBsYXlvdXROb2Rlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJyk7XG4gIHZhciBsYXlvdXQgPSBsYXlvdXROb2Rlcy5sYXlvdXQoe1xuICAgIG5hbWU6ICdjb3NlLWJpbGtlbnQnLFxuICAgIHJhbmRvbWl6ZTogZmFsc2UsXG4gICAgZml0OiBmYWxzZSxcbiAgICBhbmltYXRlOiBmYWxzZSxcbiAgICB0aWxpbmdQYWRkaW5nVmVydGljYWw6IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCxcbiAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXG4gICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgLy9yZS1wb3NpdGlvbiB0aGUgbm9kZXMgaW5zaWRlIHRoZSBjb21wbGV4XG4gICAgICB2YXIgc3VwcG9zZWRYUG9zaXRpb247XG4gICAgICB2YXIgc3VwcG9zZWRZUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueTtcblxuICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgICAgICBzdXBwb3NlZFhQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBjb21wbGV4Lm91dGVyV2lkdGgoKSAvIDI7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc3VwcG9zZWRYUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gY29tcGxleC5vdXRlcldpZHRoKCkgLyAyO1xuICAgICAgfVxuXG4gICAgICB2YXIgcG9zaXRpb25EaWZmWCA9IHN1cHBvc2VkWFBvc2l0aW9uIC0gY29tcGxleC5wb3NpdGlvbigneCcpO1xuICAgICAgdmFyIHBvc2l0aW9uRGlmZlkgPSBzdXBwb3NlZFlQb3NpdGlvbiAtIGNvbXBsZXgucG9zaXRpb24oJ3knKTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NpdGlvbkRpZmZYLCB5OiBwb3NpdGlvbkRpZmZZfSwgY29tcGxleCk7XG4gICAgfVxuICB9KTtcbiAgXG4gIC8vIERvIHRoaXMgY2hlY2sgZm9yIGN5dG9zY2FwZS5qcyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xuICAgIGxheW91dC5ydW4oKTtcbiAgfVxuXG4gIC8vZmlsdGVyIHRoZSBqdXN0IGFkZGVkIGVsZW1lbXRzIHRvIHJldHVybiB0aGVtIGFuZCByZW1vdmUganVzdCBhZGRlZCBtYXJrXG4gIHZhciBlbGVzID0gY3kuZWxlbWVudHMoJ1tqdXN0QWRkZWRdJyk7XG4gIGVsZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkJyk7XG4gIFxuICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gIGVsZXMuc2VsZWN0KCk7XG4gIFxuICByZXR1cm4gZWxlczsgLy8gUmV0dXJuIHRoZSBqdXN0IGFkZGVkIGVsZW1lbnRzXG59O1xuXG4vKlxuICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50ID0gZnVuY3Rpb24obm9kZXMsIG5ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XG4gIHZhciBuZXdQYXJlbnRJZCA9IG5ld1BhcmVudCA9PSB1bmRlZmluZWQgfHwgdHlwZW9mIG5ld1BhcmVudCA9PT0gJ3N0cmluZycgPyBuZXdQYXJlbnQgOiBuZXdQYXJlbnQuaWQoKTtcbiAgdmFyIG1vdmVkRWxlcyA9IG5vZGVzLm1vdmUoe1wicGFyZW50XCI6IG5ld1BhcmVudElkfSk7XG4gIGlmKHR5cGVvZiBwb3NEaWZmWCAhPSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgcG9zRGlmZlkgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyh7eDogcG9zRGlmZlgsIHk6IHBvc0RpZmZZfSwgbm9kZXMpO1xuICB9XG4gIGVsZW1lbnRVdGlsaXRpZXMubWFpbnRhaW5Qb2ludGVyKG1vdmVkRWxlcyk7XG4gIHJldHVybiBtb3ZlZEVsZXM7XG59O1xuXG4vLyBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuXG5lbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgcmF0aW8gPSB1bmRlZmluZWQ7XG4gICAgdmFyIGVsZU11c3RCZVNxdWFyZSA9IGVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlKG5vZGUuZGF0YSgnY2xhc3MnKSk7XG5cbiAgICAvLyBOb3RlIHRoYXQgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0IGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeVxuICAgIGlmICh3aWR0aCkge1xuICAgICAgaWYgKHVzZUFzcGVjdFJhdGlvIHx8IGVsZU11c3RCZVNxdWFyZSkge1xuICAgICAgICByYXRpbyA9IHdpZHRoIC8gbm9kZS53aWR0aCgpO1xuICAgICAgfVxuXG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSB3aWR0aDtcbiAgICB9XG5cbiAgICBpZiAoaGVpZ2h0KSB7XG4gICAgICBpZiAodXNlQXNwZWN0UmF0aW8gfHwgZWxlTXVzdEJlU3F1YXJlKSB7XG4gICAgICAgIHJhdGlvID0gaGVpZ2h0IC8gbm9kZS5oZWlnaHQoKTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gaGVpZ2h0O1xuICAgIH1cblxuICAgIGlmIChyYXRpbyAmJiAhaGVpZ2h0KSB7XG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBub2RlLmhlaWdodCgpICogcmF0aW87XG4gICAgfVxuICAgIGVsc2UgaWYgKHJhdGlvICYmICF3aWR0aCkge1xuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gbm9kZS53aWR0aCgpICogcmF0aW87XG4gICAgfVxuICB9XG59O1xuXG4vLyBTZWN0aW9uIEVuZFxuLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gQ29tbW9uIGVsZW1lbnQgcHJvcGVydGllc1xuXG4vLyBHZXQgY29tbW9uIHByb3BlcnRpZXMgb2YgZ2l2ZW4gZWxlbWVudHMuIFJldHVybnMgbnVsbCBpZiB0aGUgZ2l2ZW4gZWxlbWVudCBsaXN0IGlzIGVtcHR5IG9yIHRoZVxuLy8gcHJvcGVydHkgaXMgbm90IGNvbW1vbiBmb3IgYWxsIGVsZW1lbnRzLiBkYXRhT3JDc3MgcGFyYW1ldGVyIHNwZWNpZnkgd2hldGhlciB0byBjaGVjayB0aGUgcHJvcGVydHkgb24gZGF0YSBvciBjc3MuXG4vLyBUaGUgZGVmYXVsdCB2YWx1ZSBmb3IgaXQgaXMgZGF0YS4gSWYgcHJvcGVydHlOYW1lIHBhcmFtZXRlciBpcyBnaXZlbiBhcyBhIGZ1bmN0aW9uIGluc3RlYWQgb2YgYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBcbi8vIHByb3BlcnR5IG5hbWUgdGhlbiB1c2Ugd2hhdCB0aGF0IGZ1bmN0aW9uIHJldHVybnMuXG5lbGVtZW50VXRpbGl0aWVzLmdldENvbW1vblByb3BlcnR5ID0gZnVuY3Rpb24gKGVsZW1lbnRzLCBwcm9wZXJ0eU5hbWUsIGRhdGFPckNzcykge1xuICBpZiAoZWxlbWVudHMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBpc0Z1bmN0aW9uO1xuICAvLyBJZiB3ZSBhcmUgbm90IGNvbXBhcmluZyB0aGUgcHJvcGVydGllcyBkaXJlY3RseSB1c2VycyBjYW4gc3BlY2lmeSBhIGZ1bmN0aW9uIGFzIHdlbGxcbiAgaWYgKHR5cGVvZiBwcm9wZXJ0eU5hbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBpc0Z1bmN0aW9uID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIFVzZSBkYXRhIGFzIGRlZmF1bHRcbiAgaWYgKCFpc0Z1bmN0aW9uICYmICFkYXRhT3JDc3MpIHtcbiAgICBkYXRhT3JDc3MgPSAnZGF0YSc7XG4gIH1cblxuICB2YXIgdmFsdWUgPSBpc0Z1bmN0aW9uID8gcHJvcGVydHlOYW1lKGVsZW1lbnRzWzBdKSA6IGVsZW1lbnRzWzBdW2RhdGFPckNzc10ocHJvcGVydHlOYW1lKTtcblxuICBmb3IgKHZhciBpID0gMTsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCAoIGlzRnVuY3Rpb24gPyBwcm9wZXJ0eU5hbWUoZWxlbWVudHNbaV0pIDogZWxlbWVudHNbaV1bZGF0YU9yQ3NzXShwcm9wZXJ0eU5hbWUpICkgIT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbi8vIFJldHVybnMgaWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgYSB0cnV0aHkgdmFsdWUgZm9yIGFsbCBvZiB0aGUgZ2l2ZW4gZWxlbWVudHMuXG5lbGVtZW50VXRpbGl0aWVzLnRydWVGb3JBbGxFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVtZW50cywgZmNuKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIWZjbihlbGVtZW50c1tpXSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZSBlbGVtZW50IGNhbiBoYXZlIHNiZ25jYXJkaW5hbGl0eVxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkNhcmRpbmFsaXR5ID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICByZXR1cm4gZWxlLmRhdGEoJ2NsYXNzJykgPT0gJ2NvbnN1bXB0aW9uJyB8fCBlbGUuZGF0YSgnY2xhc3MnKSA9PSAncHJvZHVjdGlvbic7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBjYW4gaGF2ZSBzYmdubGFiZWxcbmVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbCA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgcmV0dXJuIHNiZ25jbGFzcyAhPSAnYW5kJyAmJiBzYmduY2xhc3MgIT0gJ29yJyAmJiBzYmduY2xhc3MgIT0gJ25vdCcgJiYgc2JnbmNsYXNzICE9ICdkZWxheSdcbiAgICAgICAgICAmJiBzYmduY2xhc3MgIT0gJ2Fzc29jaWF0aW9uJyAmJiBzYmduY2xhc3MgIT0gJ2Rpc3NvY2lhdGlvbicgJiYgIXNiZ25jbGFzcy5lbmRzV2l0aCgncHJvY2VzcycpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgaGF2ZSB1bml0IG9mIGluZm9ybWF0aW9uXG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVVbml0T2ZJbmZvcm1hdGlvbiA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgaWYgKHNiZ25jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZScgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXgnIHx8IHNiZ25jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsIG11bHRpbWVyJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZSBtdWx0aW1lcicgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSBtdWx0aW1lcidcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXggbXVsdGltZXInIHx8IChzYmduY2xhc3Muc3RhcnRzV2l0aCgnQkEnKSAmJiBzYmduY2xhc3MgIT0gXCJCQSBwbGFpblwiKVxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGFydG1lbnQnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGVtZW50IGNhbiBoYXZlIG1vcmUgdGhhbiBvbmUgdW5pdHMgb2YgaW5mb3JtYXRpb25cbmVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZU11bHRpcGxlVW5pdE9mSW5mb3JtYXRpb24gPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuICByZXR1cm4gIXNiZ25jbGFzcy5zdGFydHNXaXRoKCdCQScpO1xufTtcblxuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBoYXZlIHN0YXRlIHZhcmlhYmxlXG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTdGF0ZVZhcmlhYmxlID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICBpZiAoc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUgbXVsdGltZXInIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUgbXVsdGltZXInXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4IG11bHRpbWVyJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlIHNob3VsZCBiZSBzcXVhcmUgaW4gc2hhcGVcbmVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICByZXR1cm4gKHNiZ25jbGFzcy5pbmRleE9mKCdwcm9jZXNzJykgIT0gLTEgfHwgc2JnbmNsYXNzID09ICdzb3VyY2UgYW5kIHNpbmsnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdhbmQnIHx8IHNiZ25jbGFzcyA9PSAnb3InIHx8IHNiZ25jbGFzcyA9PSAnbm90J1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYXNzb2NpYXRpb24nIHx8IHNiZ25jbGFzcyA9PSAnZGlzc29jaWF0aW9uJyB8fCBzYmduY2xhc3MgPT0gJ2RlbGF5Jyk7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgYW55IG9mIHRoZSBnaXZlbiBub2RlcyBtdXN0IG5vdCBiZSBpbiBzcXVhcmUgc2hhcGVcbmVsZW1lbnRVdGlsaXRpZXMuc29tZU11c3ROb3RCZVNxdWFyZSA9IGZ1bmN0aW9uIChub2Rlcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlKG5vZGUuZGF0YSgnY2xhc3MnKSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZXMgZWxlbWVudCBjYW4gYmUgY2xvbmVkXG5lbGVtZW50VXRpbGl0aWVzLmNhbkJlQ2xvbmVkID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XG5cbiAgdmFyIGxpc3QgPSB7XG4gICAgJ3Vuc3BlY2lmaWVkIGVudGl0eSc6IHRydWUsXG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxuICAgICdjb21wbGV4JzogdHJ1ZSxcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlLFxuICAgICdwZXJ0dXJiaW5nIGFnZW50JzogdHJ1ZVxuICB9O1xuXG4gIHJldHVybiBsaXN0W3NiZ25jbGFzc10gPyB0cnVlIDogZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVzIGVsZW1lbnQgY2FuIGJlIGNsb25lZFxuZWxlbWVudFV0aWxpdGllcy5jYW5CZU11bHRpbWVyID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XG5cbiAgdmFyIGxpc3QgPSB7XG4gICAgJ21hY3JvbW9sZWN1bGUnOiB0cnVlLFxuICAgICdjb21wbGV4JzogdHJ1ZSxcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxuICAgICdzaW1wbGUgY2hlbWljYWwnOiB0cnVlXG4gIH07XG5cbiAgcmV0dXJuIGxpc3Rbc2JnbmNsYXNzXSA/IHRydWUgOiBmYWxzZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhbiBFUE5cbmVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuXG4gIHJldHVybiAoc2JnbmNsYXNzID09ICd1bnNwZWNpZmllZCBlbnRpdHknXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4Jyk7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgaXMgYSBQTlxuZWxlbWVudFV0aWxpdGllcy5pc1BOQ2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcblxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAncHJvY2VzcydcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ29taXR0ZWQgcHJvY2VzcydcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ3VuY2VydGFpbiBwcm9jZXNzJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYXNzb2NpYXRpb24nXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdkaXNzb2NpYXRpb24nXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdwaGVub3R5cGUnKTtcbn07XG5cbi8vIFJldHVybnMgd2V0aGVyIHRoZSBnaXZlbiBlbGVtZW50IG9yIHN0cmluZyBpcyBvZiB0aGUgc3BlY2lhbCBlbXB0eSBzZXQvc291cmNlIGFuZCBzaW5rIGNsYXNzXG5lbGVtZW50VXRpbGl0aWVzLmlzRW1wdHlTZXRDbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuICByZXR1cm4gc2JnbmNsYXNzID09ICdzb3VyY2UgYW5kIHNpbmsnO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGVtZW50IGlzIGEgbG9naWNhbCBvcGVyYXRvclxuZWxlbWVudFV0aWxpdGllcy5pc0xvZ2ljYWxPcGVyYXRvciA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG4gIHJldHVybiAoc2JnbmNsYXNzID09ICdhbmQnIHx8IHNiZ25jbGFzcyA9PSAnb3InIHx8IHNiZ25jbGFzcyA9PSAnbm90JyB8fCBzYmduY2xhc3MgPT0gJ2RlbGF5Jyk7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGNsYXNzIG9mIGdpdmVuIGVsZW1lbnQgaXMgYSBlcXVpdmFsYW5jZSBjbGFzc1xuZWxlbWVudFV0aWxpdGllcy5jb252ZW5pZW50VG9FcXVpdmFsZW5jZSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG4gIHJldHVybiAoc2JnbmNsYXNzID09ICd0YWcnIHx8IHNiZ25jbGFzcyA9PSAndGVybWluYWwnKTtcbn07XG5cbi8vIFJldHVybnMgd2V0aGVyIHRoZSBjbGFzcyBvZiBnaXZlbiBlbGVtbnQgaXMgYSBtb2R1bGF0aW9uIGFyYyBhcyBkZWZpbmVkIGluIFBEIHNwZWNzXG5lbGVtZW50VXRpbGl0aWVzLmlzTW9kdWxhdGlvbkFyY0NsYXNzID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcbiAgcmV0dXJuIChzYmduY2xhc3MgPT0gJ21vZHVsYXRpb24nXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdzdGltdWxhdGlvbicgfHwgc2JnbmNsYXNzID09ICdjYXRhbHlzaXMnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdpbmhpYml0aW9uJyB8fCBzYmduY2xhc3MgPT0gJ25lY2Vzc2FyeSBzdGltdWxhdGlvbicpO1xufVxuXG4vLyBSZWxvY2F0ZXMgc3RhdGUgYW5kIGluZm8gYm94ZXMuIFRoaXMgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gYmUgY2FsbGVkIGFmdGVyIGFkZC9yZW1vdmUgc3RhdGUgYW5kIGluZm8gYm94ZXNcbmVsZW1lbnRVdGlsaXRpZXMucmVsb2NhdGVTdGF0ZUFuZEluZm9zID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc3RhdGVBbmRJbmZvcyA9IChlbGUuaXNOb2RlICYmIGVsZS5pc05vZGUoKSkgPyBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKSA6IGVsZTtcbiAgdmFyIGxlbmd0aCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoO1xuICBpZiAobGVuZ3RoID09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxzZSBpZiAobGVuZ3RoID09IDEpIHtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XG4gIH1cbiAgZWxzZSBpZiAobGVuZ3RoID09IDIpIHtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XG5cbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDA7XG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSA1MDtcbiAgfVxuICBlbHNlIGlmIChsZW5ndGggPT0gMykge1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAyNTtcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IC01MDtcblxuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gMDtcbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xuICB9XG4gIGVsc2Uge1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAyNTtcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IC01MDtcblxuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gLTI1O1xuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC55ID0gNTA7XG5cbiAgICBzdGF0ZUFuZEluZm9zWzNdLmJib3gueCA9IDI1O1xuICAgIHN0YXRlQW5kSW5mb3NbM10uYmJveC55ID0gNTA7XG4gIH1cbn07XG5cbi8vIENoYW5nZSBzdGF0ZSB2YWx1ZSBvciB1bml0IG9mIGluZm9ybWF0aW9uIGJveCBvZiBnaXZlbiBub2RlcyB3aXRoIGdpdmVuIGluZGV4LlxuLy8gVHlwZSBwYXJhbWV0ZXIgaW5kaWNhdGVzIHdoZXRoZXIgdG8gY2hhbmdlIHZhbHVlIG9yIHZhcmlhYmxlLCBpdCBpcyB2YWxpZCBpZiB0aGUgYm94IGF0IHRoZSBnaXZlbiBpbmRleCBpcyBhIHN0YXRlIHZhcmlhYmxlLlxuLy8gVmFsdWUgcGFyYW1ldGVyIGlzIHRoZSBuZXcgdmFsdWUgdG8gc2V0LlxuLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgb2xkIHZhbHVlIG9mIHRoZSBjaGFuZ2VkIGRhdGEgKFdlIGFzc3VtZSB0aGF0IHRoZSBvbGQgdmFsdWUgb2YgdGhlIGNoYW5nZWQgZGF0YSB3YXMgdGhlIHNhbWUgZm9yIGFsbCBub2RlcykuXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpIHtcbiAgdmFyIHJlc3VsdDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XG4gICAgdmFyIGJveCA9IHN0YXRlQW5kSW5mb3NbaW5kZXhdO1xuXG4gICAgaWYgKGJveC5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHtcbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdCA9IGJveC5zdGF0ZVt0eXBlXTtcbiAgICAgIH1cblxuICAgICAgYm94LnN0YXRlW3R5cGVdID0gdmFsdWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKGJveC5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xuICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgcmVzdWx0ID0gYm94LmxhYmVsLnRleHQ7XG4gICAgICB9XG5cbiAgICAgIGJveC5sYWJlbC50ZXh0ID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIEFkZCBhIG5ldyBzdGF0ZSBvciBpbmZvIGJveCB0byBnaXZlbiBub2Rlcy5cbi8vIFRoZSBib3ggaXMgcmVwcmVzZW50ZWQgYnkgdGhlIHBhcmFtZXRlciBvYmouXG4vLyBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUganVzdCBhZGRlZCBib3guXG5lbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBvYmopIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG5cbiAgICB2YXIgbG9jYXRpb25PYmo7XG4gICAgaWYob2JqLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7XG4gICAgICBpZiAoIW5vZGUuZGF0YShcImxhbmd1YWdlXCIpIHx8IG5vZGUuZGF0YShcImxhbmd1YWdlXCIpID09IFwiUERcIil7XG4gICAgICAgIGxvY2F0aW9uT2JqID0gc2JnbnZpei5jbGFzc2VzLlVuaXRPZkluZm9ybWF0aW9uLmNyZWF0ZShub2RlLCBvYmoubGFiZWwudGV4dCwgb2JqLmJib3gsIG9iai5sb2NhdGlvbiwgb2JqLnBvc2l0aW9uLCBvYmouaW5kZXgpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAobm9kZS5kYXRhKFwibGFuZ3VhZ2VcIikgPT0gXCJBRlwiKXtcbiAgICAgICAgbG9jYXRpb25PYmogPSBzYmdudml6LmNsYXNzZXMuVW5pdE9mSW5mb3JtYXRpb24uY3JlYXRlKG5vZGUsIG9iai5sYWJlbC50ZXh0LCBvYmouYmJveCwgb2JqLmxvY2F0aW9uLCBvYmoucG9zaXRpb24sIG9iai5pbmRleCxcbiAgICAgICAgICAgIGxpYnMuY3l0b3NjYXBlLnNiZ24uQWZTaGFwZUZuLCBsaWJzLmN5dG9zY2FwZS5zYmduLkFmU2hhcGVBcmdzRm4pO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChvYmouY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7XG4gICAgICBsb2NhdGlvbk9iaiA9IHNiZ252aXouY2xhc3Nlcy5TdGF0ZVZhcmlhYmxlLmNyZWF0ZShub2RlLCBvYmouc3RhdGUudmFsdWUsIG9iai5zdGF0ZS52YXJpYWJsZSwgb2JqLmJib3gsIG9iai5sb2NhdGlvbiwgb2JqLnBvc2l0aW9uLCBvYmouaW5kZXgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbG9jYXRpb25PYmo7XG59O1xuXG4vLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxuLy8gUmV0dXJucyB0aGUgcmVtb3ZlZCBib3guXG5lbGVtZW50VXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBsb2NhdGlvbk9iaikge1xuICB2YXIgb2JqO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcbiAgICB2YXIgdW5pdCA9IHN0YXRlQW5kSW5mb3NbbG9jYXRpb25PYmouaW5kZXhdO1xuXG4gICAgb2JqID0gdW5pdC5yZW1vdmUoKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG4vLyBTZXQgbXVsdGltZXIgc3RhdHVzIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxuZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uIChub2Rlcywgc3RhdHVzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHZhciBzYmduY2xhc3MgPSBub2RlLmRhdGEoJ2NsYXNzJyk7XG4gICAgdmFyIGlzTXVsdGltZXIgPSBub2RlLmRhdGEoJ2NsYXNzJykuZW5kc1dpdGgoJyBtdWx0aW1lcicpO1xuXG4gICAgaWYgKHN0YXR1cykgeyAvLyBNYWtlIG11bHRpbWVyIHN0YXR1cyB0cnVlXG4gICAgICBpZiAoIWlzTXVsdGltZXIpIHtcbiAgICAgICAgbm9kZS5kYXRhKCdjbGFzcycsIHNiZ25jbGFzcyArICcgbXVsdGltZXInKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7IC8vIE1ha2UgbXVsdGltZXIgc3RhdHVzIGZhbHNlXG4gICAgICBpZiAoaXNNdWx0aW1lcikge1xuICAgICAgICBub2RlLmRhdGEoJ2NsYXNzJywgc2JnbmNsYXNzLnJlcGxhY2UoJyBtdWx0aW1lcicsICcnKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vLyBTZXQgY2xvbmUgbWFya2VyIHN0YXR1cyBvZiBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxuZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uIChub2Rlcywgc3RhdHVzKSB7XG4gIGlmIChzdGF0dXMpIHtcbiAgICBub2Rlcy5kYXRhKCdjbG9uZW1hcmtlcicsIHRydWUpO1xuICB9XG4gIGVsc2Uge1xuICAgIG5vZGVzLnJlbW92ZURhdGEoJ2Nsb25lbWFya2VyJyk7XG4gIH1cbn07XG5cbi8vZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uKClcblxuLy8gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gZWxlbWVudHMgd2l0aCBnaXZlbiBmb250IGRhdGFcbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbiAoZWxlcywgZGF0YSkge1xuICBmb3IgKHZhciBwcm9wIGluIGRhdGEpIHtcbiAgICBlbGVzLmRhdGEocHJvcCwgZGF0YVtwcm9wXSk7XG4gIH1cbn07XG5cbi8vIFRoaXMgZnVuY3Rpb24gZ2V0cyBhbiBlZGdlLCBhbmQgZW5kcyBvZiB0aGF0IGVkZ2UgKE9wdGlvbmFsbHkgaXQgbWF5IHRha2UganVzdCB0aGUgY2xhc3NlcyBvZiB0aGUgZWRnZSBhcyB3ZWxsKSBhcyBwYXJhbWV0ZXJzLlxuLy8gSXQgbWF5IHJldHVybiAndmFsaWQnICh0aGF0IGVuZHMgaXMgdmFsaWQgZm9yIHRoYXQgZWRnZSksICdyZXZlcnNlJyAodGhhdCBlbmRzIGlzIG5vdCB2YWxpZCBmb3IgdGhhdCBlZGdlIGJ1dCB0aGV5IHdvdWxkIGJlIHZhbGlkIFxuLy8gaWYgeW91IHJldmVyc2UgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0KSwgJ2ludmFsaWQnICh0aGF0IGVuZHMgYXJlIHRvdGFsbHkgaW52YWxpZCBmb3IgdGhhdCBlZGdlKS5cbmVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMgPSBmdW5jdGlvbiAoZWRnZSwgc291cmNlLCB0YXJnZXQpIHtcbiAgLy8gaWYgbWFwIHR5cGUgaXMgVW5rbm93biAtLSBubyBydWxlcyBhcHBsaWVkXG4gIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSA9PSBcIlVua25vd25cIiB8fCAhZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkpXG4gICAgcmV0dXJuIFwidmFsaWRcIjtcblxuICB2YXIgZWRnZWNsYXNzID0gdHlwZW9mIGVkZ2UgPT09ICdzdHJpbmcnID8gZWRnZSA6IGVkZ2UuZGF0YSgnY2xhc3MnKTtcbiAgdmFyIHNvdXJjZWNsYXNzID0gc291cmNlLmRhdGEoJ2NsYXNzJyk7XG4gIHZhciB0YXJnZXRjbGFzcyA9IHRhcmdldC5kYXRhKCdjbGFzcycpO1xuXG4gIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSA9PSBcIkFGXCIpe1xuICAgIGlmIChzb3VyY2VjbGFzcy5zdGFydHNXaXRoKFwiQkFcIikpIC8vIHdlIGhhdmUgc2VwYXJhdGUgY2xhc3NlcyBmb3IgZWFjaCBiaW9sb2dpY2FsIGFjdGl2aXR5XG4gICAgICBzb3VyY2VjbGFzcyA9IFwiYmlvbG9naWNhbCBhY3Rpdml0eVwiOyAvLyBidXQgc2FtZSBydWxlIGFwcGxpZXMgdG8gYWxsIG9mIHRoZW1cblxuICAgIGlmICh0YXJnZXRjbGFzcy5zdGFydHNXaXRoKFwiQkFcIikpIC8vIHdlIGhhdmUgc2VwYXJhdGUgY2xhc3NlcyBmb3IgZWFjaCBiaW9sb2dpY2FsIGFjdGl2aXR5XG4gICAgICB0YXJnZXRjbGFzcyA9IFwiYmlvbG9naWNhbCBhY3Rpdml0eVwiOyAvLyBidXQgc2FtZSBydWxlIGFwcGxpZXMgdG8gYWxsIG9mIHRoZW1cblxuICAgIHZhciBlZGdlQ29uc3RyYWludHMgPSB0aGlzLkFGLmNvbm5lY3Rpdml0eUNvbnN0cmFpbnRzW2VkZ2VjbGFzc107XG4gIH1cbiAgZWxzZVxuICAgIHZhciBlZGdlQ29uc3RyYWludHMgPSB0aGlzLlBELmNvbm5lY3Rpdml0eUNvbnN0cmFpbnRzW2VkZ2VjbGFzc107XG5cbiAgLy8gZ2l2ZW4gYSBub2RlLCBhY3RpbmcgYXMgc291cmNlIG9yIHRhcmdldCwgcmV0dXJucyBib29sZWFuIHdldGhlciBvciBub3QgaXQgaGFzIHRvbyBtYW55IGVkZ2VzIGFscmVhZHlcbiAgZnVuY3Rpb24gaGFzVG9vTWFueUVkZ2VzKG5vZGUsIHNvdXJjZU9yVGFyZ2V0KSB7XG4gICAgdmFyIG5vZGVjbGFzcyA9IG5vZGUuZGF0YSgnY2xhc3MnKTtcbiAgICBpZiAobm9kZWNsYXNzLnN0YXJ0c1dpdGgoXCJCQVwiKSlcbiAgICAgIG5vZGVjbGFzcyA9IFwiYmlvbG9naWNhbCBhY3Rpdml0eVwiO1xuXG4gICAgdmFyIHRvdGFsVG9vTWFueSA9IHRydWU7XG4gICAgdmFyIGVkZ2VUb29NYW55ID0gdHJ1ZTtcbiAgICBpZiAoc291cmNlT3JUYXJnZXQgPT0gXCJzb3VyY2VcIikge1xuICAgICAgICB2YXIgc2FtZUVkZ2VDb3VudE91dCA9IG5vZGUub3V0Z29lcnMoJ2VkZ2VbY2xhc3M9XCInK2VkZ2VjbGFzcysnXCJdJykuc2l6ZSgpO1xuICAgICAgICB2YXIgdG90YWxFZGdlQ291bnRPdXQgPSBub2RlLm91dGdvZXJzKCdlZGdlJykuc2l6ZSgpO1xuICAgICAgICAvLyBjaGVjayB0aGF0IHRoZSB0b3RhbCBlZGdlIGNvdW50IGlzIHdpdGhpbiB0aGUgbGltaXRzXG4gICAgICAgIGlmICh0eXBlb2YgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNTb3VyY2UubWF4VG90YWwgPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgIHx8IHRvdGFsRWRnZUNvdW50T3V0IDwgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNTb3VyY2UubWF4VG90YWwgKSB7XG4gICAgICAgICAgICB0b3RhbFRvb01hbnkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGVuIGNoZWNrIGxpbWl0cyBmb3IgdGhpcyBzcGVjaWZpYyBlZGdlIGNsYXNzXG4gICAgICAgIGlmICh0eXBlb2YgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNTb3VyY2UubWF4RWRnZSA9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgfHwgc2FtZUVkZ2VDb3VudE91dCA8IGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzU291cmNlLm1heEVkZ2UgKSB7XG4gICAgICAgICAgICBlZGdlVG9vTWFueSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIG9ubHkgb25lIG9mIHRoZSBsaW1pdHMgaXMgcmVhY2hlZCB0aGVuIGVkZ2UgaXMgaW52YWxpZFxuICAgICAgICByZXR1cm4gdG90YWxUb29NYW55IHx8IGVkZ2VUb29NYW55O1xuICAgIH1cbiAgICBlbHNlIHsgLy8gbm9kZSBpcyB1c2VkIGFzIHRhcmdldFxuICAgICAgICB2YXIgc2FtZUVkZ2VDb3VudEluID0gbm9kZS5pbmNvbWVycygnZWRnZVtjbGFzcz1cIicrZWRnZWNsYXNzKydcIl0nKS5zaXplKCk7XG4gICAgICAgIHZhciB0b3RhbEVkZ2VDb3VudEluID0gbm9kZS5pbmNvbWVycygnZWRnZScpLnNpemUoKTtcbiAgICAgICAgaWYgKHR5cGVvZiBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1RhcmdldC5tYXhUb3RhbCA9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgfHwgdG90YWxFZGdlQ291bnRJbiA8IGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heFRvdGFsICkge1xuICAgICAgICAgICAgdG90YWxUb29NYW55ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1RhcmdldC5tYXhFZGdlID09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICB8fCBzYW1lRWRnZUNvdW50SW4gPCBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1RhcmdldC5tYXhFZGdlICkge1xuICAgICAgICAgICAgZWRnZVRvb01hbnkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG90YWxUb29NYW55IHx8IGVkZ2VUb29NYW55O1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBpc0luQ29tcGxleChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUucGFyZW50KCkuZGF0YSgnY2xhc3MnKSA9PSAnY29tcGxleCc7XG4gIH1cblxuICBpZiAoaXNJbkNvbXBsZXgoc291cmNlKSB8fCBpc0luQ29tcGxleCh0YXJnZXQpKSB7IC8vIHN1YnVuaXRzIG9mIGEgY29tcGxleCBhcmUgbm8gbG9uZ2VyIEVQTnMsIG5vIGNvbm5lY3Rpb24gYWxsb3dlZFxuICAgIHJldHVybiAnaW52YWxpZCc7XG4gIH1cblxuICAvLyBjaGVjayBuYXR1cmUgb2YgY29ubmVjdGlvblxuICBpZiAoZWRnZUNvbnN0cmFpbnRzW3NvdXJjZWNsYXNzXS5hc1NvdXJjZS5pc0FsbG93ZWQgJiYgZWRnZUNvbnN0cmFpbnRzW3RhcmdldGNsYXNzXS5hc1RhcmdldC5pc0FsbG93ZWQpIHtcbiAgICAvLyBjaGVjayBhbW91bnQgb2YgY29ubmVjdGlvbnNcbiAgICBpZiAoIWhhc1Rvb01hbnlFZGdlcyhzb3VyY2UsIFwic291cmNlXCIpICYmICFoYXNUb29NYW55RWRnZXModGFyZ2V0LCBcInRhcmdldFwiKSApIHtcbiAgICAgIHJldHVybiAndmFsaWQnO1xuICAgIH1cbiAgfVxuICAvLyB0cnkgdG8gcmV2ZXJzZVxuICBpZiAoZWRnZUNvbnN0cmFpbnRzW3RhcmdldGNsYXNzXS5hc1NvdXJjZS5pc0FsbG93ZWQgJiYgZWRnZUNvbnN0cmFpbnRzW3NvdXJjZWNsYXNzXS5hc1RhcmdldC5pc0FsbG93ZWQpIHtcbiAgICBpZiAoIWhhc1Rvb01hbnlFZGdlcyh0YXJnZXQsIFwic291cmNlXCIpICYmICFoYXNUb29NYW55RWRnZXMoc291cmNlLCBcInRhcmdldFwiKSApIHtcbiAgICAgIHJldHVybiAncmV2ZXJzZSc7XG4gICAgfVxuICB9XG4gIHJldHVybiAnaW52YWxpZCc7XG59O1xuXG4vKlxuICogVW5oaWRlIGdpdmVuIGVsZXMgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcbiAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGVsZXMsIGxheW91dHBhcmFtKSB7XG4gIHZhciByZXN1bHQgPSBjeS52aWV3VXRpbGl0aWVzKCkuc2hvdyhlbGVzKTsgLy8gU2hvdyBnaXZlbiBlbGVzXG4gIGlmICh0eXBlb2YgbGF5b3V0cGFyYW0gPT09ICdmdW5jdGlvbicpIHtcbiAgICBsYXlvdXRwYXJhbSgpOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBhIGZ1bmN0aW9uIGV4ZWN1dGUgaXRcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgbGF5b3V0ID0gY3kubGF5b3V0KGxheW91dHBhcmFtKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgbGF5b3V0IG9wdGlvbnMgY2FsbCBsYXlvdXQgd2l0aCB0aGF0IG9wdGlvbnMuXG4gICAgXG4gICAgLy8gRG8gdGhpcyBjaGVjayBmb3IgY3l0b3NjYXBlLmpzIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICBpZiAobGF5b3V0ICYmIGxheW91dC5ydW4pIHtcbiAgICAgIGxheW91dC5ydW4oKTtcbiAgICB9XG4gIH1cbiAgXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKlxuICogQ2hhbmdlIHN0eWxlL2NzcyBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXG4gKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VDc3MgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICBpZiAoIHR5cGVvZiB2YWx1ZU1hcCA9PT0gJ29iamVjdCcgKSB7XG4gICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XG4gICAgICBlbGUuY3NzKG5hbWUsIHZhbHVlTWFwW2VsZS5pZCgpXSk7IC8vIHZhbHVlTWFwIGlzIGFuIGlkIHRvIHZhbHVlIG1hcCB1c2UgaXQgaW4gdGhpcyB3YXlcbiAgICB9XG4gICAgY3kuZW5kQmF0Y2goKTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVzLmNzcyhuYW1lLCB2YWx1ZU1hcCk7IC8vIHZhbHVlTWFwIGlzIGp1c3QgYSBzdHJpbmcgc2V0IGNzcygnbmFtZScpIGZvciBhbGwgZWxlcyB0byB0aGlzIHZhbHVlXG4gIH1cbn07XG5cbi8qXG4gKiBDaGFuZ2UgZGF0YSBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXG4gKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcbiAgaWYgKCB0eXBlb2YgdmFsdWVNYXAgPT09ICdvYmplY3QnICkge1xuICAgIGN5LnN0YXJ0QmF0Y2goKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuICAgICAgZWxlLmRhdGEobmFtZSwgdmFsdWVNYXBbZWxlLmlkKCldKTsgLy8gdmFsdWVNYXAgaXMgYW4gaWQgdG8gdmFsdWUgbWFwIHVzZSBpdCBpbiB0aGlzIHdheVxuICAgIH1cbiAgICBjeS5lbmRCYXRjaCgpO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZXMuZGF0YShuYW1lLCB2YWx1ZU1hcCk7IC8vIHZhbHVlTWFwIGlzIGp1c3QgYSBzdHJpbmcgc2V0IGNzcygnbmFtZScpIGZvciBhbGwgZWxlcyB0byB0aGlzIHZhbHVlXG4gIH1cbn07XG5cbi8qXG4gKiBSZXR1cm4gdGhlIHNldCBvZiBhbGwgbm9kZXMgcHJlc2VudCB1bmRlciB0aGUgZ2l2ZW4gcG9zaXRpb25cbiAqIHJlbmRlcmVkUG9zIG11c3QgYmUgYSBwb2ludCBkZWZpbmVkIHJlbGF0aXZlbHkgdG8gY3l0b3NjYXBlIGNvbnRhaW5lclxuICogKGxpa2UgcmVuZGVyZWRQb3NpdGlvbiBmaWVsZCBvZiBhIG5vZGUpXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuZ2V0Tm9kZXNBdCA9IGZ1bmN0aW9uKHJlbmRlcmVkUG9zKSB7XG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XG4gIHZhciB4ID0gcmVuZGVyZWRQb3MueDtcbiAgdmFyIHkgPSByZW5kZXJlZFBvcy55O1xuICB2YXIgcmVzdWx0Tm9kZXMgPSBbXTtcbiAgZm9yKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgcmVuZGVyZWRCYm94ID0gbm9kZS5yZW5kZXJlZEJvdW5kaW5nQm94KHtcbiAgICAgIGluY2x1ZGVOb2RlczogdHJ1ZSxcbiAgICAgIGluY2x1ZGVFZGdlczogZmFsc2UsXG4gICAgICBpbmNsdWRlTGFiZWxzOiBmYWxzZSxcbiAgICAgIGluY2x1ZGVTaGFkb3dzOiBmYWxzZVxuICAgIH0pO1xuICAgIGlmICh4ID49IHJlbmRlcmVkQmJveC54MSAmJiB4IDw9IHJlbmRlcmVkQmJveC54Mikge1xuICAgICAgaWYgKHkgPj0gcmVuZGVyZWRCYm94LnkxICYmIHkgPD0gcmVuZGVyZWRCYm94LnkyKSB7XG4gICAgICAgIHJlc3VsdE5vZGVzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHROb2Rlcztcbn07XG5cbmVsZW1lbnRVdGlsaXRpZXMuZGVtdWx0aW1lcml6ZUNsYXNzID0gZnVuY3Rpb24oc2JnbmNsYXNzKSB7XG4gIHJldHVybiBzYmduY2xhc3MucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIG1hcFR5cGUgLSB0eXBlIG9mIHRoZSBjdXJyZW50IG1hcCAoUEQsIEFGIG9yIFVua25vd24pXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZSA9IGZ1bmN0aW9uKG1hcFR5cGUpe1xuICBlbGVtZW50VXRpbGl0aWVzLm1hcFR5cGUgPSBtYXBUeXBlO1xuICByZXR1cm4gbWFwVHlwZTtcbn1cblxuLyoqXG4gKiByZXR1cm4gLSBtYXAgdHlwZVxuICovXG5lbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLm1hcFR5cGU7XG59XG4vKipcbiAqIFJlc2V0cyBtYXAgdHlwZVxuICovXG5lbGVtZW50VXRpbGl0aWVzLnJlc2V0TWFwVHlwZSA9IGZ1bmN0aW9uKCl7XG4gICAgZWxlbWVudFV0aWxpdGllcy5tYXBUeXBlID0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEtlZXAgY29uc2lzdGVuY3kgb2YgbGlua3MgdG8gc2VsZiBpbnNpZGUgdGhlIGRhdGEoKSBzdHJ1Y3R1cmUuXG4gKiBUaGlzIGlzIG5lZWRlZCB3aGVuZXZlciBhIG5vZGUgY2hhbmdlcyBwYXJlbnRzLCBmb3IgZXhhbXBsZSxcbiAqIGFzIGl0IGlzIGRlc3Ryb3llZCBhbmQgcmVjcmVhdGVkLiBCdXQgdGhlIGRhdGEoKSBzdGF5cyBpZGVudGljYWwuXG4gKiBUaGlzIGNyZWF0ZXMgaW5jb25zaXN0ZW5jaWVzIGZvciB0aGUgcG9pbnRlcnMgc3RvcmVkIGluIGRhdGEoKSxcbiAqIGFzIHRoZXkgbm93IHBvaW50IHRvIGEgZGVsZXRlZCBub2RlLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLm1haW50YWluUG9pbnRlciA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gIGVsZXMubm9kZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKGVsZSl7XG4gICAgLy8gc2tpcCBub2RlcyB3aXRob3V0IGFueSBhdXhpbGlhcnkgdW5pdHNcbiAgICBpZighZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykgfHwgZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yKHZhciBzaWRlIGluIGVsZS5kYXRhKCdhdXh1bml0bGF5b3V0cycpKSB7XG4gICAgICBlbGUuZGF0YSgnYXV4dW5pdGxheW91dHMnKVtzaWRlXS5wYXJlbnROb2RlID0gZWxlO1xuICAgIH1cbiAgICBmb3IodmFyIGk9MDsgaSA8IGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmxlbmd0aDsgaSsrKSB7XG4gICAgICBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKVtpXS5wYXJlbnQgPSBlbGU7XG4gICAgfVxuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlbGVtZW50VXRpbGl0aWVzO1xuIiwiLyogXG4gKiBVdGlsaXR5IGZpbGUgdG8gZ2V0IGFuZCBzZXQgdGhlIGxpYnJhcmllcyB0byB3aGljaCBzYmdudml6IGlzIGRlcGVuZGVudCBmcm9tIGFueSBmaWxlLlxuICovXG5cbnZhciBsaWJVdGlsaXRpZXMgPSBmdW5jdGlvbigpe1xufTtcblxubGliVXRpbGl0aWVzLnNldExpYnMgPSBmdW5jdGlvbihsaWJzKSB7XG4gIHRoaXMubGlicyA9IGxpYnM7XG59O1xuXG5saWJVdGlsaXRpZXMuZ2V0TGlicyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5saWJzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBsaWJVdGlsaXRpZXM7IiwidmFyIG9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKS5nZXRPcHRpb25zKCk7XG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xuXG4vKlxuICogVGhlIG1haW4gdXRpbGl0aWVzIHRvIGJlIGV4cG9zZWQgZGlyZWN0bHkuXG4gKi9cbmZ1bmN0aW9uIG1haW5VdGlsaXRpZXMoKSB7XG59O1xuXG4vKlxuICogQWRkcyBhIG5ldyBub2RlIHdpdGggdGhlIGdpdmVuIGNsYXNzIGFuZCBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuYWRkTm9kZSA9IGZ1bmN0aW9uKHgsIHkgLCBub2RlUGFyYW1zLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KSB7XG4gIC8vIHVwZGF0ZSBtYXAgdHlwZVxuICBpZiAodHlwZW9mIG5vZGVQYXJhbXMgPT0gJ29iamVjdCcpe1xuXG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSlcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShub2RlUGFyYW1zLmxhbmd1YWdlKTtcbiAgICBlbHNlIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSAhPSBub2RlUGFyYW1zLmxhbmd1YWdlKVxuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiVW5rbm93blwiKTtcbiAgfVxuXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeCwgeSwgbm9kZVBhcmFtcywgaWQsIHBhcmVudCwgdmlzaWJpbGl0eSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgbmV3Tm9kZSA6IHtcbiAgICAgICAgeDogeCxcbiAgICAgICAgeTogeSxcbiAgICAgICAgY2xhc3M6IG5vZGVQYXJhbXMsXG4gICAgICAgIGlkOiBpZCxcbiAgICAgICAgcGFyZW50OiBwYXJlbnQsXG4gICAgICAgIHZpc2liaWxpdHk6IHZpc2liaWxpdHlcbiAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGROb2RlXCIsIHBhcmFtKTtcbiAgfVxufTtcblxuLypcbiAqIEFkZHMgYSBuZXcgZWRnZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgaGF2aW5nIHRoZSBnaXZlbiBzb3VyY2UgYW5kIHRhcmdldCBpZHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuYWRkRWRnZSA9IGZ1bmN0aW9uKHNvdXJjZSwgdGFyZ2V0LCBlZGdlUGFyYW1zLCBpZCwgdmlzaWJpbGl0eSkge1xuICAvLyB1cGRhdGUgbWFwIHR5cGVcbiAgaWYgKHR5cGVvZiBlZGdlUGFyYW1zID09ICdvYmplY3QnKXtcblxuICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkpXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoZWRnZVBhcmFtcy5sYW5ndWFnZSk7XG4gICAgZWxzZSBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgIT0gZWRnZVBhcmFtcy5sYW5ndWFnZSlcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShcIlVua25vd25cIik7XG4gIH1cbiAgLy8gR2V0IHRoZSB2YWxpZGF0aW9uIHJlc3VsdFxuICB2YXIgZWRnZWNsYXNzID0gZWRnZVBhcmFtcy5jbGFzcyA/IGVkZ2VQYXJhbXMuY2xhc3MgOiBlZGdlUGFyYW1zO1xuICB2YXIgdmFsaWRhdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMoZWRnZWNsYXNzLCBjeS5nZXRFbGVtZW50QnlJZChzb3VyY2UpLCBjeS5nZXRFbGVtZW50QnlJZCh0YXJnZXQpKTtcblxuICAvLyBJZiB2YWxpZGF0aW9uIHJlc3VsdCBpcyAnaW52YWxpZCcgY2FuY2VsIHRoZSBvcGVyYXRpb25cbiAgaWYgKHZhbGlkYXRpb24gPT09ICdpbnZhbGlkJykge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgLy8gSWYgdmFsaWRhdGlvbiByZXN1bHQgaXMgJ3JldmVyc2UnIHJldmVyc2UgdGhlIHNvdXJjZS10YXJnZXQgcGFpciBiZWZvcmUgY3JlYXRpbmcgdGhlIGVkZ2VcbiAgaWYgKHZhbGlkYXRpb24gPT09ICdyZXZlcnNlJykge1xuICAgIHZhciB0ZW1wID0gc291cmNlO1xuICAgIHNvdXJjZSA9IHRhcmdldDtcbiAgICB0YXJnZXQgPSB0ZW1wO1xuICB9XG4gICAgICBcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShzb3VyY2UsIHRhcmdldCwgZWRnZVBhcmFtcywgaWQsIHZpc2liaWxpdHkpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIG5ld0VkZ2UgOiB7XG4gICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgY2xhc3M6IGVkZ2VQYXJhbXMsXG4gICAgICAgIGlkOiBpZCxcbiAgICAgICAgdmlzaWJpbGl0eTogdmlzaWJpbGl0eVxuICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZEVkZ2VcIiwgcGFyYW0pO1xuICB9XG59O1xuXG4vKlxuICogQWRkcyBhIHByb2Nlc3Mgd2l0aCBjb252ZW5pZW50IGVkZ2VzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBwbGVhc2Ugc2VlICdodHRwczovL2dpdGh1Yi5jb20vaVZpcy1hdC1CaWxrZW50L25ld3QvaXNzdWVzLzknLlxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyA9IGZ1bmN0aW9uKF9zb3VyY2UsIF90YXJnZXQsIHByb2Nlc3NUeXBlKSB7XG4gIC8vIElmIHNvdXJjZSBhbmQgdGFyZ2V0IElEcyBhcmUgZ2l2ZW4gZ2V0IHRoZSBlbGVtZW50cyBieSBJRHNcbiAgdmFyIHNvdXJjZSA9IHR5cGVvZiBfc291cmNlID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9zb3VyY2UpIDogX3NvdXJjZTtcbiAgdmFyIHRhcmdldCA9IHR5cGVvZiBfdGFyZ2V0ID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF90YXJnZXQpIDogX3RhcmdldDtcbiAgXG4gIC8vIElmIHNvdXJjZSBvciB0YXJnZXQgZG9lcyBub3QgaGF2ZSBhbiBFUE4gY2xhc3MgdGhlIG9wZXJhdGlvbiBpcyBub3QgdmFsaWRcbiAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3Moc291cmNlKSB8fCAhZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKHRhcmdldCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzKF9zb3VyY2UsIF90YXJnZXQsIHByb2Nlc3NUeXBlKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBzb3VyY2U6IF9zb3VyY2UsXG4gICAgICB0YXJnZXQ6IF90YXJnZXQsXG4gICAgICBwcm9jZXNzVHlwZTogcHJvY2Vzc1R5cGVcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlc1wiLCBwYXJhbSk7XG4gIH1cbn07XG5cbi8qXG4gKiBDbG9uZSBnaXZlbiBlbGVtZW50cy4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuY2xvbmVFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgdmFyIGNiID0gY3kuY2xpcGJvYXJkKCk7XG4gIHZhciBfaWQgPSBjYi5jb3B5KGVsZXMsIFwiY2xvbmVPcGVyYXRpb25cIik7XG5cbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwicGFzdGVcIiwge2lkOiBfaWR9KTtcbiAgfSBcbiAgZWxzZSB7XG4gICAgY2IucGFzdGUoX2lkKTtcbiAgfVxufTtcblxuLypcbiAqIENvcHkgZ2l2ZW4gZWxlbWVudHMgdG8gY2xpcGJvYXJkLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cbiAqL1xubWFpblV0aWxpdGllcy5jb3B5RWxlbWVudHMgPSBmdW5jdGlvbiAoZWxlcykge1xuICBjeS5jbGlwYm9hcmQoKS5jb3B5KGVsZXMpO1xufTtcblxuLypcbiAqIFBhc3QgdGhlIGVsZW1lbnRzIGNvcGllZCB0byBjbGlwYm9hcmQuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxuICovXG5tYWluVXRpbGl0aWVzLnBhc3RlRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwicGFzdGVcIik7XG4gIH0gXG4gIGVsc2Uge1xuICAgIGN5LmNsaXBib2FyZCgpLnBhc3RlKCk7XG4gIH1cbn07XG5cbi8qXG4gKiBBbGlnbnMgZ2l2ZW4gbm9kZXMgaW4gZ2l2ZW4gaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgb3JkZXIuIFxuICogSG9yaXpvbnRhbCBhbmQgdmVydGljYWwgcGFyYW1ldGVycyBtYXkgYmUgJ25vbmUnIG9yIHVuZGVmaW5lZC5cbiAqIGFsaWduVG8gcGFyYW1ldGVyIGluZGljYXRlcyB0aGUgbGVhZGluZyBub2RlLlxuICogUmVxdXJpcmVzIGN5dG9zY2FwZS1ncmlkLWd1aWRlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5hbGlnbiA9IGZ1bmN0aW9uIChub2RlcywgaG9yaXpvbnRhbCwgdmVydGljYWwsIGFsaWduVG8pIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWxpZ25cIiwge1xuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgaG9yaXpvbnRhbDogaG9yaXpvbnRhbCxcbiAgICAgIHZlcnRpY2FsOiB2ZXJ0aWNhbCxcbiAgICAgIGFsaWduVG86IGFsaWduVG9cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBub2Rlcy5hbGlnbihob3Jpem9udGFsLCB2ZXJ0aWNhbCwgYWxpZ25Ubyk7XG4gIH1cbn07XG5cbi8qXG4gKiBDcmVhdGUgY29tcG91bmQgZm9yIGdpdmVuIG5vZGVzLiBjb21wb3VuZFR5cGUgbWF5IGJlICdjb21wbGV4JyBvciAnY29tcGFydG1lbnQnLlxuICogVGhpcyBtZXRob2QgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgPSBmdW5jdGlvbiAoX25vZGVzLCBjb21wb3VuZFR5cGUpIHtcbiAgdmFyIG5vZGVzID0gX25vZGVzO1xuICAvKlxuICAgKiBFbGVtaW5hdGUgdGhlIG5vZGVzIHdoaWNoIGNhbm5vdCBoYXZlIGEgcGFyZW50IHdpdGggZ2l2ZW4gY29tcG91bmQgdHlwZVxuICAgKi9cbiAgbm9kZXMgPSBfbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XG4gICAgaWYodHlwZW9mIGVsZW1lbnQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZW1lbnQgPSBpO1xuICAgIH1cbiAgICBcbiAgICB2YXIgc2JnbmNsYXNzID0gZWxlbWVudC5kYXRhKFwiY2xhc3NcIik7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNWYWxpZFBhcmVudChzYmduY2xhc3MsIGNvbXBvdW5kVHlwZSk7XG4gIH0pO1xuICBcbiAgbm9kZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldFRvcE1vc3ROb2Rlcyhub2Rlcyk7XG5cbiAgLy8gQWxsIGVsZW1lbnRzIHNob3VsZCBoYXZlIHRoZSBzYW1lIHBhcmVudCBhbmQgdGhlIGNvbW1vbiBwYXJlbnQgc2hvdWxkIG5vdCBiZSBhICdjb21wbGV4JyBcbiAgLy8gaWYgY29tcG91bmRUeXBlIGlzICdjb21wYXJ0ZW50J1xuICAvLyBiZWNhdXNlIHRoZSBvbGQgY29tbW9uIHBhcmVudCB3aWxsIGJlIHRoZSBwYXJlbnQgb2YgdGhlIG5ldyBjb21wYXJ0bWVudCBhZnRlciB0aGlzIG9wZXJhdGlvbiBhbmRcbiAgLy8gJ2NvbXBsZXhlcycgY2Fubm90IGluY2x1ZGUgJ2NvbXBhcnRtZW50cydcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwIHx8ICFlbGVtZW50VXRpbGl0aWVzLmFsbEhhdmVUaGVTYW1lUGFyZW50KG5vZGVzKVxuICAgICAgICAgIHx8ICggY29tcG91bmRUeXBlID09PSAnY29tcGFydG1lbnQnICYmIG5vZGVzLnBhcmVudCgpLmRhdGEoJ2NsYXNzJykgPT09ICdjb21wbGV4JyApICkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKGN5LnVuZG9SZWRvKCkpIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBjb21wb3VuZFR5cGU6IGNvbXBvdW5kVHlwZSxcbiAgICAgIG5vZGVzVG9NYWtlQ29tcG91bmQ6IG5vZGVzXG4gICAgfTtcblxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXNcIiwgcGFyYW0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKG5vZGVzLCBjb21wb3VuZFR5cGUpO1xuICB9XG59O1xuXG4vKlxuICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uIGFuZCBjaGVja3MgaWYgdGhlIG9wZXJhdGlvbiBpcyB2YWxpZC5cbiAqL1xubWFpblV0aWxpdGllcy5jaGFuZ2VQYXJlbnQgPSBmdW5jdGlvbihub2RlcywgX25ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XG4gIHZhciBuZXdQYXJlbnQgPSB0eXBlb2YgX25ld1BhcmVudCA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfbmV3UGFyZW50KSA6IF9uZXdQYXJlbnQ7XG4gIC8vIE5ldyBwYXJlbnQgaXMgc3VwcG9zZWQgdG8gYmUgb25lIG9mIHRoZSByb290LCBhIGNvbXBsZXggb3IgYSBjb21wYXJ0bWVudFxuICBpZiAobmV3UGFyZW50ICYmIG5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikgIT0gXCJjb21wbGV4XCIgJiYgbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKSAhPSBcImNvbXBhcnRtZW50XCIpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIC8qXG4gICAqIEVsZW1pbmF0ZSB0aGUgbm9kZXMgd2hpY2ggY2Fubm90IGhhdmUgdGhlIG5ld1BhcmVudCBhcyB0aGVpciBwYXJlbnRcbiAgICovXG4gIG5vZGVzID0gbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XG4gICAgaWYodHlwZW9mIGVsZW1lbnQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZW1lbnQgPSBpO1xuICAgIH1cbiAgICBcbiAgICB2YXIgc2JnbmNsYXNzID0gZWxlbWVudC5kYXRhKFwiY2xhc3NcIik7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNWYWxpZFBhcmVudChzYmduY2xhc3MsIG5ld1BhcmVudCk7XG4gIH0pO1xuICBcbiAgLy8gRGlzY2FyZCB0aGUgbm9kZXMgd2hvc2UgcGFyZW50IGlzIGFscmVhZHkgbmV3UGFyZW50LlxuICAvLyBEaXNjYXJkIHRoZSBuZXdQYXJlbnQgaXRzZWxmIGlmIGl0IGlzIGFtb25nIHRoZSBub2Rlc1xuICBub2RlcyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZWxlLCBpKSB7XG4gICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZWxlID0gaTtcbiAgICB9XG4gICAgXG4gICAgLy8gRGlzY2FyZCB0aGUgbmV3UGFyZW50IGlmIGl0IGlzIGFtb25nIHRoZSBub2Rlc1xuICAgIGlmIChuZXdQYXJlbnQgJiYgZWxlLmlkKCkgPT09IG5ld1BhcmVudC5pZCgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIERpc2NhcmQgdGhlIG5vZGVzIHdob3NlIHBhcmVudCBpcyBhbHJlYWR5IG5ld1BhcmVudFxuICAgIGlmICghbmV3UGFyZW50KSB7XG4gICAgICByZXR1cm4gZWxlLmRhdGEoJ3BhcmVudCcpICE9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBlbGUuZGF0YSgncGFyZW50JykgIT09IG5ld1BhcmVudC5pZCgpO1xuICB9KTtcblxuICAvLyBJZiBzb21lIG5vZGVzIGFyZSBhbmNlc3RvciBvZiBuZXcgcGFyZW50IGVsZW1pbmF0ZSB0aGVtXG4gIGlmIChuZXdQYXJlbnQpIHtcbiAgICBub2RlcyA9IG5vZGVzLmRpZmZlcmVuY2UobmV3UGFyZW50LmFuY2VzdG9ycygpKTtcbiAgfVxuXG4gIC8vIElmIGFsbCBub2RlcyBhcmUgZWxlbWluYXRlZCByZXR1cm4gZGlyZWN0bHlcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEp1c3QgbW92ZSB0aGUgdG9wIG1vc3Qgbm9kZXNcbiAgbm9kZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldFRvcE1vc3ROb2Rlcyhub2Rlcyk7XG4gIFxuICB2YXIgcGFyZW50SWQgPSBuZXdQYXJlbnQgPyBuZXdQYXJlbnQuaWQoKSA6IG51bGw7XG5cbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBmaXJzdFRpbWU6IHRydWUsXG4gICAgICBwYXJlbnREYXRhOiBwYXJlbnRJZCwgLy8gSXQga2VlcHMgdGhlIG5ld1BhcmVudElkIChKdXN0IGFuIGlkIGZvciBlYWNoIG5vZGVzIGZvciB0aGUgZmlyc3QgdGltZSlcbiAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgIHBvc0RpZmZYOiBwb3NEaWZmWCxcbiAgICAgIHBvc0RpZmZZOiBwb3NEaWZmWSxcbiAgICAgIC8vIFRoaXMgaXMgbmVlZGVkIGJlY2F1c2UgdGhlIGNoYW5nZVBhcmVudCBmdW5jdGlvbiBjYWxsZWQgaXMgbm90IGZyb20gZWxlbWVudFV0aWxpdGllc1xuICAgICAgLy8gYnV0IGZyb20gdGhlIHVuZG9SZWRvIGV4dGVuc2lvbiBkaXJlY3RseSwgc28gbWFpbnRhaW5pbmcgcG9pbnRlciBpcyBub3QgYXV0b21hdGljYWxseSBkb25lLlxuICAgICAgY2FsbGJhY2s6IGVsZW1lbnRVdGlsaXRpZXMubWFpbnRhaW5Qb2ludGVyXG4gICAgfTtcblxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VQYXJlbnRcIiwgcGFyYW0pOyAvLyBUaGlzIGFjdGlvbiBpcyByZWdpc3RlcmVkIGJ5IHVuZG9SZWRvIGV4dGVuc2lvblxuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50KG5vZGVzLCBwYXJlbnRJZCwgcG9zRGlmZlgsIHBvc0RpZmZZKTtcbiAgfVxufTtcblxuLypcbiAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxuICogaW4gdGhlIGNvbXBsZXguIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSB0aGUgc2FtZSBmdW5jdGlvbiBpbiBlbGVtZW50VXRpbGl0aWVzXG4gKi9cbm1haW5VdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKSB7XG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbih0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICB0ZW1wbGF0ZVR5cGU6IHRlbXBsYXRlVHlwZSxcbiAgICAgIG1hY3JvbW9sZWN1bGVMaXN0OiBtYWNyb21vbGVjdWxlTGlzdCxcbiAgICAgIGNvbXBsZXhOYW1lOiBjb21wbGV4TmFtZSxcbiAgICAgIHByb2Nlc3NQb3NpdGlvbjogcHJvY2Vzc1Bvc2l0aW9uLFxuICAgICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXG4gICAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXG4gICAgICBlZGdlTGVuZ3RoOiBlZGdlTGVuZ3RoXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlVGVtcGxhdGVSZWFjdGlvblwiLCBwYXJhbSk7XG4gIH1cbn07XG5cbi8qXG4gKiBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuIFxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbykge1xuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgdXNlQXNwZWN0UmF0aW86IHVzZUFzcGVjdFJhdGlvLFxuICAgICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZVxuICAgIH07XG4gICAgXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInJlc2l6ZU5vZGVzXCIsIHBhcmFtKTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbyk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vKlxuICogQ2hhbmdlcyB0aGUgbGFiZWwgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBsYWJlbC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5jaGFuZ2VOb2RlTGFiZWwgPSBmdW5jdGlvbihub2RlcywgbGFiZWwpIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBsYWJlbCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlTm9kZUxhYmVsXCIsIHBhcmFtKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIGZvciBnaXZlbiBub2RlcyB1c2UgdGhlIGdpdmVuIGZvbnQgZGF0YS5cbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbihlbGVzLCBkYXRhKSB7XG4gIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBlbGVzOiBlbGVzLFxuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgIH07XG5cbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgcGFyYW0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgZGF0YSk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vKlxuICogQ2hhbmdlIHN0YXRlIHZhbHVlIG9yIHVuaXQgb2YgaW5mb3JtYXRpb24gYm94IG9mIGdpdmVuIG5vZGVzIHdpdGggZ2l2ZW4gaW5kZXguXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHBhcmFtZXRlcnMgc2VlIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3hcbiAqL1xubWFpblV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uKG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3gobm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXG4vLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxuLy8gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2Rlcywgb2JqKSB7XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgb2JqOiBvYmosXG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxuLy8gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgpIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2Rlcywge2luZGV4OiBpbmRleH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGxvY2F0aW9uT2JqOiB7aW5kZXg6IGluZGV4fSxcbiAgICAgIG5vZGVzOiBub2Rlc1xuICAgIH07XG5cbiAgICBjeS51bmRvUmVkbygpLmRvKFwicmVtb3ZlU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLypcbiAqIFNldCBtdWx0aW1lciBzdGF0dXMgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24obm9kZXMsIHN0YXR1cykge1xuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgfTtcblxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXRNdWx0aW1lclN0YXR1c1wiLCBwYXJhbSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBTZXQgY2xvbmUgbWFya2VyIHN0YXR1cyBvZiBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqLyBcbm1haW5VdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbihub2Rlcywgc3RhdHVzKSB7XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgc3RhdHVzOiBzdGF0dXMsXG4gICAgICBub2Rlczogbm9kZXMsXG4gICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICB9O1xuXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNldENsb25lTWFya2VyU3RhdHVzXCIsIHBhcmFtKTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLypcbiAqIENoYW5nZSBzdHlsZS9jc3Mgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gZ2l2ZW4gdmFsdWUvdmFsdWVzIChOb3RlIHRoYXQgdmFsdWVNYXAgcGFyYW1ldGVyIG1heSBiZVxuICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuY2hhbmdlQ3NzID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcbiAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyhlbGVzLCBuYW1lLCB2YWx1ZU1hcCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgZWxlczogZWxlcyxcbiAgICAgIHZhbHVlTWFwOiB2YWx1ZU1hcCxcbiAgICAgIG5hbWU6IG5hbWVcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VDc3NcIiwgcGFyYW0pO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLypcbiAqIENoYW5nZSBkYXRhIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmNoYW5nZURhdGEgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShlbGVzLCBuYW1lLCB2YWx1ZU1hcCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgZWxlczogZWxlcyxcbiAgICAgIHZhbHVlTWFwOiB2YWx1ZU1hcCxcbiAgICAgIG5hbWU6IG5hbWVcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VEYXRhXCIsIHBhcmFtKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBVbmhpZGUgZ2l2ZW4gZWxlcyAodGhlIG9uZXMgd2hpY2ggYXJlIGhpZGRlbiBpZiBhbnkpIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXG4gKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcbiAgdmFyIGhpZGRlbkVsZXMgPSBlbGVzLmZpbHRlcignOmhpZGRlbicpO1xuICBpZiAoaGlkZGVuRWxlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZnVuY3Rpb24gdGhpY2tlbkJvcmRlcihlbGVzKSB7XG4gICAgZWxlcy5mb3JFYWNoKGZ1bmN0aW9uKCBlbGUgKXtcbiAgICAgIHZhciBkZWZhdWx0Qm9yZGVyV2lkdGggPSBOdW1iZXIoZWxlLmRhdGEoXCJib3JkZXItd2lkdGhcIikpO1xuICAgICAgZWxlLmRhdGEoXCJib3JkZXItd2lkdGhcIiwgZGVmYXVsdEJvcmRlcldpZHRoICsgMik7XG4gICAgfSk7XG4gICAgZWxlcy5kYXRhKFwidGhpY2tCb3JkZXJcIiwgdHJ1ZSk7XG4gICAgcmV0dXJuIGVsZXM7XG4gIH1cblxuICBmdW5jdGlvbiB0aGluQm9yZGVyKGVsZXMpIHtcbiAgICBlbGVzLmZvckVhY2goZnVuY3Rpb24oIGVsZSApe1xuICAgICAgdmFyIGRlZmF1bHRCb3JkZXJXaWR0aCA9IE51bWJlcihlbGUuZGF0YShcImJvcmRlci13aWR0aFwiKSk7XG4gICAgICBlbGUuZGF0YShcImJvcmRlci13aWR0aFwiLCBkZWZhdWx0Qm9yZGVyV2lkdGggLSAyKTtcbiAgICB9KTtcbiAgICBlbGVzLnJlbW92ZURhdGEoXCJ0aGlja0JvcmRlclwiKTtcbiAgICByZXR1cm4gZWxlcztcbiAgfVxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoJzp2aXNpYmxlJyk7XG4gICAgdGhpbkJvcmRlcihub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcik7XG4gICAgZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dChoaWRkZW5FbGVzLCBsYXlvdXRwYXJhbSk7XG4gICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCc6dmlzaWJsZScpO1xuICAgIHRoaWNrZW5Cb3JkZXIobm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGVsZXM6IGhpZGRlbkVsZXMsXG4gICAgICBsYXlvdXRwYXJhbTogbGF5b3V0cGFyYW0sXG4gICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICB9O1xuICAgIFxuICAgIHZhciB1ciA9IGN5LnVuZG9SZWRvKCk7XG4gICAgdXIuYWN0aW9uKFwidGhpY2tlbkJvcmRlclwiLCB0aGlja2VuQm9yZGVyLCB0aGluQm9yZGVyKTtcbiAgICB1ci5hY3Rpb24oXCJ0aGluQm9yZGVyXCIsIHRoaW5Cb3JkZXIsIHRoaWNrZW5Cb3JkZXIpO1xuICAgIFxuICAgIHZhciBhY3Rpb25zID0gW107XG4gICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gaGlkZGVuRWxlcy5uZWlnaGJvcmhvb2QoXCI6dmlzaWJsZVwiKS5ub2RlcygpO1xuICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGluQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcn0pOyAgXG4gICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInNob3dBbmRQZXJmb3JtTGF5b3V0XCIsIHBhcmFtOiBwYXJhbX0pO1xuICAgIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gaGlkZGVuRWxlcy5ub2RlcygpLmVkZ2VzV2l0aChjeS5ub2RlcyhcIjpoaWRkZW5cIikuZGlmZmVyZW5jZShoaWRkZW5FbGVzLm5vZGVzKCkpKVxuICAgICAgICAgICAgLmNvbm5lY3RlZE5vZGVzKCkuaW50ZXJzZWN0aW9uKGhpZGRlbkVsZXMubm9kZXMoKSk7XG4gICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInRoaWNrZW5Cb3JkZXJcIiwgcGFyYW06IG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yfSk7IFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJiYXRjaFwiLCBhY3Rpb25zKTtcbiAgfVxufTtcblxuLy8gT3ZlcnJpZGVzIGhpZ2hsaWdodFByb2Nlc3NlcyBmcm9tIFNCR05WSVogLSBkbyBub3QgaGlnaGxpZ2h0IGFueSBub2RlcyB3aGVuIHRoZSBtYXAgdHlwZSBpcyBBRlxubWFpblV0aWxpdGllcy5oaWdobGlnaHRQcm9jZXNzZXMgPSBmdW5jdGlvbihfbm9kZXMpIHtcbiAgaWYgKGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpID09IFwiQUZcIilcbiAgICByZXR1cm47XG4gIGxpYnMuc2JnbnZpei5oaWdobGlnaHRQcm9jZXNzZXMoX25vZGVzKTtcbn07XG5cbi8qKlxuICogUmVzZXRzIG1hcCB0eXBlIHRvIHVuZGVmaW5lZFxuICovXG5tYWluVXRpbGl0aWVzLnJlc2V0TWFwVHlwZSA9IGZ1bmN0aW9uKCl7XG4gIGVsZW1lbnRVdGlsaXRpZXMucmVzZXRNYXBUeXBlKCk7XG59O1xuXG4vKipcbiAqIHJldHVybiA6IG1hcCB0eXBlXG4gKi9cbm1haW5VdGlsaXRpZXMuZ2V0TWFwVHlwZSA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWFpblV0aWxpdGllcztcbiIsIi8qXG4gKiAgRXh0ZW5kIGRlZmF1bHQgb3B0aW9ucyBhbmQgZ2V0IGN1cnJlbnQgb3B0aW9ucyBieSB1c2luZyB0aGlzIGZpbGUgXG4gKi9cblxuLy8gZGVmYXVsdCBvcHRpb25zXG52YXIgZGVmYXVsdHMgPSB7XG4gIC8vIFRoZSBwYXRoIG9mIGNvcmUgbGlicmFyeSBpbWFnZXMgd2hlbiBzYmdudml6IGlzIHJlcXVpcmVkIGZyb20gbnBtIGFuZCB0aGUgaW5kZXggaHRtbCBcbiAgLy8gZmlsZSBhbmQgbm9kZV9tb2R1bGVzIGFyZSB1bmRlciB0aGUgc2FtZSBmb2xkZXIgdGhlbiB1c2luZyB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBmaW5lXG4gIGltZ1BhdGg6ICdub2RlX21vZHVsZXMvc2JnbnZpei9zcmMvaW1nJyxcbiAgLy8gV2hldGhlciB0byBmaXQgbGFiZWxzIHRvIG5vZGVzXG4gIGZpdExhYmVsc1RvTm9kZXM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIGZpdExhYmVsc1RvSW5mb2JveGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICAvLyBkeW5hbWljIGxhYmVsIHNpemUgaXQgbWF5IGJlICdzbWFsbCcsICdyZWd1bGFyJywgJ2xhcmdlJ1xuICBkeW5hbWljTGFiZWxTaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICdyZWd1bGFyJztcbiAgfSxcbiAgLy8gcGVyY2VudGFnZSB1c2VkIHRvIGNhbGN1bGF0ZSBjb21wb3VuZCBwYWRkaW5nc1xuICBjb21wb3VuZFBhZGRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gMTA7XG4gIH0sXG4gIC8vIFdoZXRoZXIgdG8gYWRqdXN0IG5vZGUgbGFiZWwgZm9udCBzaXplIGF1dG9tYXRpY2FsbHkuXG4gIC8vIElmIHRoaXMgb3B0aW9uIHJldHVybiBmYWxzZSBkbyBub3QgYWRqdXN0IGxhYmVsIHNpemVzIGFjY29yZGluZyB0byBub2RlIGhlaWdodCB1c2VzIG5vZGUuZGF0YSgnZm9udC1zaXplJylcbiAgLy8gaW5zdGVhZCBvZiBkb2luZyBpdC5cbiAgYWRqdXN0Tm9kZUxhYmVsRm9udFNpemVBdXRvbWF0aWNhbGx5OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgLy8gVGhlIHNlbGVjdG9yIG9mIHRoZSBjb21wb25lbnQgY29udGFpbmluZyB0aGUgc2JnbiBuZXR3b3JrXG4gIG5ldHdvcmtDb250YWluZXJTZWxlY3RvcjogJyNzYmduLW5ldHdvcmstY29udGFpbmVyJyxcbiAgLy8gV2hldGhlciB0aGUgYWN0aW9ucyBhcmUgdW5kb2FibGUsIHJlcXVpcmVzIGN5dG9zY2FwZS11bmRvLXJlZG8gZXh0ZW5zaW9uXG4gIHVuZG9hYmxlOiB0cnVlLFxuICAvLyBXaGV0aGVyIHRvIGhhdmUgdW5kb2FibGUgZHJhZyBmZWF0dXJlIGluIHVuZG8vcmVkbyBleHRlbnNpb24uIFRoaXMgb3B0aW9ucyB3aWxsIGJlIHBhc3NlZCB0byB1bmRvL3JlZG8gZXh0ZW5zaW9uXG4gIHVuZG9hYmxlRHJhZzogdHJ1ZVxufTtcblxudmFyIG9wdGlvblV0aWxpdGllcyA9IGZ1bmN0aW9uICgpIHtcbn07XG5cbi8vIEV4dGVuZCB0aGUgZGVmYXVsdHMgb3B0aW9ucyB3aXRoIHRoZSB1c2VyIG9wdGlvbnNcbm9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIGZvciAodmFyIHByb3AgaW4gZGVmYXVsdHMpIHtcbiAgICByZXN1bHRbcHJvcF0gPSBkZWZhdWx0c1twcm9wXTtcbiAgfVxuICBcbiAgZm9yICh2YXIgcHJvcCBpbiBvcHRpb25zKSB7XG4gICAgcmVzdWx0W3Byb3BdID0gb3B0aW9uc1twcm9wXTtcbiAgfVxuXG4gIG9wdGlvblV0aWxpdGllcy5vcHRpb25zID0gcmVzdWx0O1xuXG4gIHJldHVybiBvcHRpb25zO1xufTtcblxub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBvcHRpb25VdGlsaXRpZXMub3B0aW9ucztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gb3B0aW9uVXRpbGl0aWVzOyIsInZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMnKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIG9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKS5nZXRPcHRpb25zKCk7XG52YXIgJCA9IGxpYnMualF1ZXJ5O1xuXG52YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSBmdW5jdGlvbiAodW5kb2FibGVEcmFnKSB7XG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBjcmVhdGUgdW5kby1yZWRvIGluc3RhbmNlXG4gIHZhciB1ciA9IGN5LnVuZG9SZWRvKHtcbiAgICB1bmRvYWJsZURyYWc6IHVuZG9hYmxlRHJhZ1xuICB9KTtcblxuICAvLyByZWdpc3RlciBhZGQgcmVtb3ZlIGFjdGlvbnNcbiAgdXIuYWN0aW9uKFwiYWRkTm9kZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGROb2RlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XG4gIHVyLmFjdGlvbihcImFkZEVkZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gIHVyLmFjdGlvbihcImFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NtYXJ0XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTbWFydCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xuICB1ci5hY3Rpb24oXCJjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMpO1xuXG4gIC8vIHJlZ2lzdGVyIGdlbmVyYWwgYWN0aW9uc1xuICB1ci5hY3Rpb24oXCJyZXNpemVOb2Rlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VOb2RlTGFiZWxcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VEYXRhXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VDc3NcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VCZW5kUG9pbnRzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VGb250UHJvcGVydGllc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMpO1xuICB1ci5hY3Rpb24oXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUxheW91dCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtTGF5b3V0KTtcblxuICAvLyByZWdpc3RlciBTQkdOIGFjdGlvbnNcbiAgdXIuYWN0aW9uKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94KTtcbiAgdXIuYWN0aW9uKFwiY2hhbmdlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94KTtcbiAgdXIuYWN0aW9uKFwic2V0TXVsdGltZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzKTtcbiAgdXIuYWN0aW9uKFwic2V0Q2xvbmVNYXJrZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzKTtcbiAgdXIuYWN0aW9uKFwicmVtb3ZlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94KTtcbiAgXG4gIC8vIHJlZ2lzdGVyIGVhc3kgY3JlYXRpb24gYWN0aW9uc1xuICB1ci5hY3Rpb24oXCJjcmVhdGVUZW1wbGF0ZVJlYWN0aW9uXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24sIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuXG4gIHVyLmFjdGlvbihcInNldERlZmF1bHRQcm9wZXJ0eVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXREZWZhdWx0UHJvcGVydHksIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldERlZmF1bHRQcm9wZXJ0eSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVuZG9hYmxlRHJhZykge1xuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyh1bmRvYWJsZURyYWcpO1xuICB9KTtcbn07IiwiLy8gRXh0ZW5kcyBzYmdudml6LnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBzYmdudml6ID0gbGlicy5zYmdudml6O1xudmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xuXG4vLyBTZWN0aW9uIFN0YXJ0XG4vLyBhZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkTm9kZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgdmFyIG5ld05vZGUgPSBwYXJhbS5uZXdOb2RlO1xuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShuZXdOb2RlLngsIG5ld05vZGUueSwgbmV3Tm9kZS5jbGFzcywgbmV3Tm9kZS5pZCwgbmV3Tm9kZS5wYXJlbnQsIG5ld05vZGUudmlzaWJpbGl0eSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVsZXM6IHJlc3VsdFxuICB9O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgdmFyIG5ld0VkZ2UgPSBwYXJhbS5uZXdFZGdlO1xuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdFZGdlLnNvdXJjZSwgbmV3RWRnZS50YXJnZXQsIG5ld0VkZ2UuY2xhc3MsIG5ld0VkZ2UuaWQsIG5ld0VkZ2UudmlzaWJpbGl0eSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVsZXM6IHJlc3VsdFxuICB9O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMgPSBmdW5jdGlvbihwYXJhbSkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyhwYXJhbS5zb3VyY2UsIHBhcmFtLnRhcmdldCwgcGFyYW0ucHJvY2Vzc1R5cGUpO1xuICB9XG4gIGVsc2Uge1xuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBlbGVzOiByZXN1bHRcbiAgfTtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0ge307XG5cbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgIC8vIE5vZGVzIHRvIG1ha2UgY29tcG91bmQsIHRoZWlyIGRlc2NlbmRhbnRzIGFuZCBlZGdlcyBjb25uZWN0ZWQgdG8gdGhlbSB3aWxsIGJlIHJlbW92ZWQgZHVyaW5nIGNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyBvcGVyYXRpb25cbiAgICAvLyAoaW50ZXJuYWxseSBieSBlbGVzLm1vdmUoKSBvcGVyYXRpb24pLCBzbyBtYXJrIHRoZW0gYXMgcmVtb3ZlZCBlbGVzIGZvciB1bmRvIG9wZXJhdGlvbi5cbiAgICB2YXIgbm9kZXNUb01ha2VDb21wb3VuZCA9IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQ7XG4gICAgdmFyIHJlbW92ZWRFbGVzID0gbm9kZXNUb01ha2VDb21wb3VuZC51bmlvbihub2Rlc1RvTWFrZUNvbXBvdW5kLmRlc2NlbmRhbnRzKCkpO1xuICAgIHJlbW92ZWRFbGVzID0gcmVtb3ZlZEVsZXMudW5pb24ocmVtb3ZlZEVsZXMuY29ubmVjdGVkRWRnZXMoKSk7XG4gICAgcmVzdWx0LnJlbW92ZWRFbGVzID0gcmVtb3ZlZEVsZXM7XG4gICAgLy8gQXNzdW1lIHRoYXQgYWxsIG5vZGVzIHRvIG1ha2UgY29tcG91bmQgaGF2ZSB0aGUgc2FtZSBwYXJlbnRcbiAgICB2YXIgb2xkUGFyZW50SWQgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJwYXJlbnRcIik7XG4gICAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZFxuICAgIC8vIE5ldyBlbGVzIGluY2x1ZGVzIG5ldyBjb21wb3VuZCBhbmQgdGhlIG1vdmVkIGVsZXMgYW5kIHdpbGwgYmUgdXNlZCBpbiB1bmRvIG9wZXJhdGlvbi5cbiAgICByZXN1bHQubmV3RWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKG5vZGVzVG9NYWtlQ29tcG91bmQsIHBhcmFtLmNvbXBvdW5kVHlwZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmVzdWx0LnJlbW92ZWRFbGVzID0gcGFyYW0ubmV3RWxlcy5yZW1vdmUoKTtcbiAgICByZXN1bHQubmV3RWxlcyA9IHBhcmFtLnJlbW92ZWRFbGVzLnJlc3RvcmUoKTtcbiAgICBlbGVtZW50VXRpbGl0aWVzLm1haW50YWluUG9pbnRlcihyZXN1bHQubmV3RWxlcyk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLy8gU2VjdGlvbiBFbmRcbi8vIGFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xuXG4vLyBTZWN0aW9uIFN0YXJ0XG4vLyBlYXN5IGNyZWF0aW9uIGFjdGlvbiBmdW5jdGlvbnNcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICB2YXIgZWxlcztcblxuICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbihwYXJhbS50ZW1wbGF0ZVR5cGUsIHBhcmFtLm1hY3JvbW9sZWN1bGVMaXN0LCBwYXJhbS5jb21wbGV4TmFtZSwgcGFyYW0ucHJvY2Vzc1Bvc2l0aW9uLCBwYXJhbS50aWxpbmdQYWRkaW5nVmVydGljYWwsIHBhcmFtLnRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBwYXJhbS5lZGdlTGVuZ3RoKVxuICB9XG4gIGVsc2Uge1xuICAgIGVsZXMgPSBwYXJhbTtcbiAgICBjeS5hZGQoZWxlcyk7XG4gICAgXG4gICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgIGVsZXMuc2VsZWN0KCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVsZXM6IGVsZXNcbiAgfTtcbn07XG5cbi8vIFNlY3Rpb24gRW5kXG4vLyBlYXN5IGNyZWF0aW9uIGFjdGlvbiBmdW5jdGlvbnNcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwb3NpdGlvbnMgPSB7fTtcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcbiAgXG4gIG5vZGVzLmVhY2goZnVuY3Rpb24oZWxlLCBpKSB7XG4gICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZWxlID0gaTtcbiAgICB9XG4gICAgXG4gICAgcG9zaXRpb25zW2VsZS5pZCgpXSA9IHtcbiAgICAgIHg6IGVsZS5wb3NpdGlvbihcInhcIiksXG4gICAgICB5OiBlbGUucG9zaXRpb24oXCJ5XCIpXG4gICAgfTtcbiAgfSk7XG5cbiAgcmV0dXJuIHBvc2l0aW9ucztcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zID0gZnVuY3Rpb24gKHBvc2l0aW9ucykge1xuICB2YXIgY3VycmVudFBvc2l0aW9ucyA9IHt9O1xuICBjeS5ub2RlcygpLnBvc2l0aW9ucyhmdW5jdGlvbiAoZWxlLCBpKSB7XG4gICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZWxlID0gaTtcbiAgICB9XG4gICAgXG4gICAgY3VycmVudFBvc2l0aW9uc1tlbGUuaWQoKV0gPSB7XG4gICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxuICAgICAgeTogZWxlLnBvc2l0aW9uKFwieVwiKVxuICAgIH07XG4gICAgXG4gICAgdmFyIHBvcyA9IHBvc2l0aW9uc1tlbGUuaWQoKV07XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHBvcy54LFxuICAgICAgeTogcG9zLnlcbiAgICB9O1xuICB9KTtcblxuICByZXR1cm4gY3VycmVudFBvc2l0aW9ucztcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciByZXN1bHQgPSB7XG4gICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZVxuICB9O1xuXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuXG4gIHJlc3VsdC5zaXplTWFwID0ge307XG4gIHJlc3VsdC51c2VBc3BlY3RSYXRpbyA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHJlc3VsdC5zaXplTWFwW25vZGUuaWQoKV0gPSB7XG4gICAgICB3OiBub2RlLndpZHRoKCksXG4gICAgICBoOiBub2RlLmhlaWdodCgpXG4gICAgfTtcbiAgfVxuXG4gIHJlc3VsdC5ub2RlcyA9IG5vZGVzO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuXG4gICAgaWYgKHBhcmFtLnBlcmZvcm1PcGVyYXRpb24pIHtcbiAgICAgIGlmIChwYXJhbS5zaXplTWFwKSB7XG4gICAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS53O1xuICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0uaDtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKHBhcmFtLm5vZGVzLCBwYXJhbS53aWR0aCwgcGFyYW0uaGVpZ2h0LCBwYXJhbS51c2VBc3BlY3RSYXRpbyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0ge1xuICB9O1xuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgcmVzdWx0Lm5vZGVzID0gbm9kZXM7XG4gIHJlc3VsdC5sYWJlbCA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHJlc3VsdC5sYWJlbFtub2RlLmlkKCldID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xuICB9XG5cbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgIG5vZGVzLmRhdGEoJ2xhYmVsJywgcGFyYW0ubGFiZWwpO1xuICB9XG4gIGVsc2Uge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICBub2RlLl9wcml2YXRlLmRhdGEubGFiZWwgPSBwYXJhbS5sYWJlbFtub2RlLmlkKCldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciByZXN1bHQgPSB7XG4gIH07XG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcbiAgcmVzdWx0Lm5hbWUgPSBwYXJhbS5uYW1lO1xuICByZXN1bHQudmFsdWVNYXAgPSB7fTtcbiAgcmVzdWx0LmVsZXMgPSBlbGVzO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuICAgIHJlc3VsdC52YWx1ZU1hcFtlbGUuaWQoKV0gPSBlbGUuZGF0YShwYXJhbS5uYW1lKTtcbiAgfVxuXG4gIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShwYXJhbS5lbGVzLCBwYXJhbS5uYW1lLCBwYXJhbS52YWx1ZU1hcCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUNzcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0ge1xuICB9O1xuICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG4gIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTtcbiAgcmVzdWx0LnZhbHVlTWFwID0ge307XG4gIHJlc3VsdC5lbGVzID0gZWxlcztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICByZXN1bHQudmFsdWVNYXBbZWxlLmlkKCldID0gZWxlLmNzcyhwYXJhbS5uYW1lKTtcbiAgfVxuXG4gIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzKHBhcmFtLmVsZXMsIHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlTWFwKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgfTtcblxuICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG4gIHJlc3VsdC5kYXRhID0ge307XG4gIHJlc3VsdC5lbGVzID0gZWxlcztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZWxlID0gZWxlc1tpXTtcblxuICAgIHJlc3VsdC5kYXRhW2VsZS5pZCgpXSA9IHt9O1xuXG4gICAgdmFyIGRhdGEgPSBwYXJhbS5maXJzdFRpbWUgPyBwYXJhbS5kYXRhIDogcGFyYW0uZGF0YVtlbGUuaWQoKV07XG5cbiAgICBmb3IgKHZhciBwcm9wIGluIGRhdGEpIHtcbiAgICAgIHJlc3VsdC5kYXRhW2VsZS5pZCgpXVtwcm9wXSA9IGVsZS5kYXRhKHByb3ApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZXMsIGRhdGEpO1xuICB9XG4gIGVsc2Uge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XG4gICAgICBcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlLCBkYXRhKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLypcbiAqIFNob3cgZWxlcyBhbmQgcGVyZm9ybSBsYXlvdXQuXG4gKi9cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcblxuICB2YXIgcmVzdWx0ID0ge307XG4gIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XG4gIFxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgcmVzdWx0LmVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0KHBhcmFtLmVsZXMsIHBhcmFtLmxheW91dHBhcmFtKTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXN1bHQuZWxlcyA9IGN5LnZpZXdVdGlsaXRpZXMoKS5zaG93KGVsZXMpOyAvLyBTaG93IGdpdmVuIGVsZXNcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyhwYXJhbS5wb3NpdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9TaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG5cbiAgdmFyIHJlc3VsdCA9IHt9O1xuICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuICByZXN1bHQuZWxlcyA9IGN5LnZpZXdVdGlsaXRpZXMoKS5oaWRlKGVsZXMpOyAvLyBIaWRlIHByZXZpb3VzbHkgdW5oaWRkZW4gZWxlcztcblxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyhwYXJhbS5wb3NpdGlvbnMpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBTZWN0aW9uIEVuZFxuLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXG5cbi8vIFNlY3Rpb24gU3RhcnRcbi8vIHNiZ24gYWN0aW9uIGZ1bmN0aW9uc1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0ge1xuICB9O1xuICByZXN1bHQudHlwZSA9IHBhcmFtLnR5cGU7XG4gIHJlc3VsdC5ub2RlcyA9IHBhcmFtLm5vZGVzO1xuICByZXN1bHQuaW5kZXggPSBwYXJhbS5pbmRleDtcblxuICByZXN1bHQudmFsdWUgPSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94KHBhcmFtLm5vZGVzLCBwYXJhbS5pbmRleCwgcGFyYW0udmFsdWUsIHBhcmFtLnR5cGUpO1xuXG4gIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBvYmogPSBwYXJhbS5vYmo7XG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuXG4gIHZhciBsb2NhdGlvbk9iaiA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XG5cbiAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICB2YXIgcmVzdWx0ID0ge1xuICAgIG5vZGVzOiBub2RlcyxcbiAgICBsb2NhdGlvbk9iajogbG9jYXRpb25PYmosXG4gICAgb2JqOiBvYmpcbiAgfTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBsb2NhdGlvbk9iaiA9IHBhcmFtLmxvY2F0aW9uT2JqO1xuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcblxuICB2YXIgb2JqID0gZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgbG9jYXRpb25PYmopO1xuXG4gIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBub2Rlczogbm9kZXMsXG4gICAgb2JqOiBvYmpcbiAgfTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICB2YXIgc3RhdHVzID0gcGFyYW0uc3RhdHVzO1xuICB2YXIgcmVzdWx0U3RhdHVzID0ge307XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIGlzTXVsdGltZXIgPSBub2RlLmRhdGEoJ2NsYXNzJykuZW5kc1dpdGgoJyBtdWx0aW1lcicpO1xuXG4gICAgcmVzdWx0U3RhdHVzW25vZGUuaWQoKV0gPSBpc011bHRpbWVyO1xuICB9XG5cbiAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZSBjaGFuZ2UgdGhlIHN0YXR1cyBvZiBhbGwgbm9kZXMgYXQgb25jZS5cbiAgLy8gSWYgbm90IGNoYW5nZSBzdGF0dXMgb2YgZWFjaCBzZXBlcmF0ZWx5IHRvIHRoZSB2YWx1ZXMgbWFwcGVkIHRvIHRoZWlyIGlkLlxuICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcbiAgfVxuICBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2RlLCBzdGF0dXNbbm9kZS5pZCgpXSk7XG4gICAgfVxuICB9XG5cbi8vICBpZiAoIWZpcnN0VGltZSAmJiBfLmlzRXF1YWwobm9kZXMsIGN5Lm5vZGVzKCc6c2VsZWN0ZWQnKSkpIHtcbi8vICAgICQoJyNpbnNwZWN0b3ItaXMtbXVsdGltZXInKS5hdHRyKFwiY2hlY2tlZFwiLCAhJCgnI2luc3BlY3Rvci1pcy1tdWx0aW1lcicpLmF0dHIoXCJjaGVja2VkXCIpKTtcbi8vICB9XG5cbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBzdGF0dXM6IHJlc3VsdFN0YXR1cyxcbiAgICBub2Rlczogbm9kZXNcbiAgfTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG4gIHZhciBzdGF0dXMgPSBwYXJhbS5zdGF0dXM7XG4gIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XG4gIHZhciByZXN1bHRTdGF0dXMgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICByZXN1bHRTdGF0dXNbbm9kZS5pZCgpXSA9IG5vZGUuZGF0YSgnY2xvbmVtYXJrZXInKTtcbiAgICB2YXIgY3VycmVudFN0YXR1cyA9IGZpcnN0VGltZSA/IHN0YXR1cyA6IHN0YXR1c1tub2RlLmlkKCldO1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMobm9kZSwgY3VycmVudFN0YXR1cyk7XG4gIH1cblxuLy8gIGlmICghZmlyc3RUaW1lICYmIF8uaXNFcXVhbChub2RlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xuLy8gICAgJCgnI2luc3BlY3Rvci1pcy1jbG9uZS1tYXJrZXInKS5hdHRyKFwiY2hlY2tlZFwiLCAhJCgnI2luc3BlY3Rvci1pcy1jbG9uZS1tYXJrZXInKS5hdHRyKFwiY2hlY2tlZFwiKSk7XG4vLyAgfVxuXG4gIHZhciByZXN1bHQgPSB7XG4gICAgc3RhdHVzOiByZXN1bHRTdGF0dXMsXG4gICAgbm9kZXM6IG5vZGVzXG4gIH07XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIHBhcmFtOiB7Y2xhc3M6IHNiZ25jbGFzcywgbmFtZTogcHJvcGVydHlOYW1lLCB2YWx1ZTogdmFsdWV9XG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXREZWZhdWx0UHJvcGVydHkgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHBhcmFtLmNsYXNzO1xuICB2YXIgbmFtZSA9IHBhcmFtLm5hbWU7XG4gIHZhciB2YWx1ZSA9IHBhcmFtLnZhbHVlO1xuICB2YXIgY2xhc3NEZWZhdWx0cyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbc2JnbmNsYXNzXTtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBjbGFzczogc2JnbmNsYXNzLFxuICAgIG5hbWU6IG5hbWUsXG4gICAgdmFsdWU6IGNsYXNzRGVmYXVsdHMuaGFzT3duUHJvcGVydHkobmFtZSkgPyBjbGFzc0RlZmF1bHRzW25hbWVdIDogdW5kZWZpbmVkXG4gIH07XG5cbiAgY2xhc3NEZWZhdWx0c1tuYW1lXSA9IHZhbHVlO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBTZWN0aW9uIEVuZFxuLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXG5cbm1vZHVsZS5leHBvcnRzID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7Il19
