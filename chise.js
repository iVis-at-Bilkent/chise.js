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
  if (process.data("class") === 'process')
  {
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
  
  if (parentClass == undefined || parentClass === 'compartment') { // Compartments and the root can include any type of nodes
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
    return elementUtilities.isValidParent(sbgnclass, compoundType, element);
  });
  
  nodes = elementUtilities.getTopMostNodes(nodes);

  // All elements should have the same parent and the common parent should not be a 'complex' 
  // if compoundType is 'compartent'
  // because the old common parent will be the parent of the new compartment after this operation and
  // 'complexes' cannot include 'compartments'
  if (nodes.length == 0 || !elementUtilities.allHaveTheSameParent(nodes)
          || ( compoundType === 'compartment' && nodes.parent().data('class')
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
  if (newParent && !newParent.data("class").startsWith("complex") && newParent.data("class") != "compartment") {
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9saWItdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqc0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqb0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpe1xuICB2YXIgY2hpc2UgPSB3aW5kb3cuY2hpc2UgPSBmdW5jdGlvbihfb3B0aW9ucywgX2xpYnMpIHtcbiAgICB2YXIgbGlicyA9IHt9O1xuICAgIGxpYnMualF1ZXJ5ID0gX2xpYnMualF1ZXJ5IHx8IGpRdWVyeTtcbiAgICBsaWJzLmN5dG9zY2FwZSA9IF9saWJzLmN5dG9zY2FwZSB8fCBjeXRvc2NhcGU7XG4gICAgbGlicy5zYmdudml6ID0gX2xpYnMuc2JnbnZpeiB8fCBzYmdudml6O1xuICAgIGxpYnMuc2F2ZUFzID0gX2xpYnMuZmlsZXNhdmVyanMgPyBfbGlicy5maWxlc2F2ZXJqcy5zYXZlQXMgOiBzYXZlQXM7XG4gICAgXG4gICAgbGlicy5zYmdudml6KF9vcHRpb25zLCBfbGlicyk7IC8vIEluaXRpbGl6ZSBzYmdudml6XG4gICAgXG4gICAgLy8gU2V0IHRoZSBsaWJyYXJpZXMgdG8gYWNjZXNzIHRoZW0gZnJvbSBhbnkgZmlsZVxuICAgIHZhciBsaWJVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9saWItdXRpbGl0aWVzJyk7XG4gICAgbGliVXRpbGl0aWVzLnNldExpYnMobGlicyk7XG4gICAgXG4gICAgdmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMnKTtcbiAgICB2YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zKF9vcHRpb25zKTsgLy8gRXh0ZW5kcyB0aGUgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhlIGdpdmVuIG9wdGlvbnNcbiAgICBcbiAgICAvLyBVcGRhdGUgc3R5bGUgYW5kIGJpbmQgZXZlbnRzXG4gICAgdmFyIGN5U3R5bGVBbmRFdmVudHMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9jeS1zdHlsZS1hbmQtZXZlbnRzJyk7XG4gICAgY3lTdHlsZUFuZEV2ZW50cyhsaWJzLnNiZ252aXopO1xuICAgIFxuICAgIC8vIFJlZ2lzdGVyIHVuZG8vcmVkbyBhY3Rpb25zXG4gICAgdmFyIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMnKTtcbiAgICByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyhvcHRpb25zLnVuZG9hYmxlRHJhZyk7XG4gICAgXG4gICAgdmFyIG1haW5VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcycpO1xuICAgIHZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZWxlbWVudC11dGlsaXRpZXMnKTtcbiAgICB2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy91bmRvLXJlZG8tYWN0aW9uLWZ1bmN0aW9ucycpO1xuICAgIFxuICAgIC8vIEV4cG9zZSB0aGUgYXBpXG4gICAgXG4gICAgLy8gRXhwb3NlIHRoZSBwcm9wZXJ0aWVzIGluaGVyaXRlZCBmcm9tIHNiZ252aXpcbiAgICAvLyB0aGVuIG92ZXJyaWRlIHNvbWUgb2YgdGhlc2UgcHJvcGVydGllcyBhbmQgZXhwb3NlIHNvbWUgbmV3IHByb3BlcnRpZXNcbiAgICBmb3IgKHZhciBwcm9wIGluIGxpYnMuc2JnbnZpeikge1xuICAgICAgY2hpc2VbcHJvcF0gPSBsaWJzLnNiZ252aXpbcHJvcF07XG4gICAgfVxuICAgIFxuICAgIC8vIEV4cG9zZSBlYWNoIG1haW4gdXRpbGl0eSBzZXBlcmF0ZWx5XG4gICAgZm9yICh2YXIgcHJvcCBpbiBtYWluVXRpbGl0aWVzKSB7XG4gICAgICBjaGlzZVtwcm9wXSA9IG1haW5VdGlsaXRpZXNbcHJvcF07XG4gICAgfVxuICAgIFxuICAgIC8vIEV4cG9zZSBlbGVtZW50VXRpbGl0aWVzIGFuZCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyBhcyBpc1xuICAgIGNoaXNlLmVsZW1lbnRVdGlsaXRpZXMgPSBlbGVtZW50VXRpbGl0aWVzO1xuICAgIGNoaXNlLnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XG4gIH07XG4gIFxuICBpZiAoIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gY2hpc2U7XG4gIH1cbn0pKCk7IiwidmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciAkID0gbGlicy5qUXVlcnk7XG52YXIgb3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpLmdldE9wdGlvbnMoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc2JnbnZpeikge1xuICAvL0hlbHBlcnNcbiAgdmFyIGluaXRFbGVtZW50RGF0YSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgICB2YXIgZWxlY2xhc3MgPSBlbGUuZGF0YSgnY2xhc3MnKTtcbiAgICBpZiAoIWVsZWNsYXNzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGVsZWNsYXNzID0gZWxlbWVudFV0aWxpdGllcy5kZW11bHRpbWVyaXplQ2xhc3MoZWxlY2xhc3MpO1xuICAgIHZhciBjbGFzc1Byb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW2VsZWNsYXNzXTtcblxuICAgIGN5LmJhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChlbGUuaXNOb2RlKCkpIHtcbiAgICAgICAgaWYgKGNsYXNzUHJvcGVydGllc1snd2lkdGgnXSAmJiAhZWxlLmRhdGEoJ2Jib3gnKS53KSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ2Jib3gnKS53ID0gY2xhc3NQcm9wZXJ0aWVzWyd3aWR0aCddO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGFzc1Byb3BlcnRpZXNbJ2hlaWdodCddICYmICFlbGUuZGF0YSgnYmJveCcpLmgpIHtcbiAgICAgICAgICBlbGUuZGF0YSgnYmJveCcpLmggPSBjbGFzc1Byb3BlcnRpZXNbJ2hlaWdodCddO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2ZvbnQtc2l6ZScpICYmIGNsYXNzUHJvcGVydGllc1snZm9udC1zaXplJ10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnZm9udC1zaXplJywgY2xhc3NQcm9wZXJ0aWVzWydmb250LXNpemUnXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC1mYW1pbHknKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtZmFtaWx5J10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnZm9udC1mYW1pbHknLCBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtZmFtaWx5J10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2ZvbnQtc3R5bGUnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtc3R5bGUnXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdmb250LXN0eWxlJywgY2xhc3NQcm9wZXJ0aWVzWydmb250LXN0eWxlJ10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2ZvbnQtd2VpZ2h0JykgJiYgY2xhc3NQcm9wZXJ0aWVzWydmb250LXdlaWdodCddKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ2ZvbnQtd2VpZ2h0JywgY2xhc3NQcm9wZXJ0aWVzWydmb250LXdlaWdodCddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdiYWNrZ3JvdW5kLWNvbG9yJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydiYWNrZ3JvdW5kLWNvbG9yJ10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnYmFja2dyb3VuZC1jb2xvcicsIGNsYXNzUHJvcGVydGllc1snYmFja2dyb3VuZC1jb2xvciddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdiYWNrZ3JvdW5kLW9wYWNpdHknKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2JhY2tncm91bmQtb3BhY2l0eSddKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ2JhY2tncm91bmQtb3BhY2l0eScsIGNsYXNzUHJvcGVydGllc1snYmFja2dyb3VuZC1vcGFjaXR5J10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2JvcmRlci1jb2xvcicpICYmIGNsYXNzUHJvcGVydGllc1snYm9yZGVyLWNvbG9yJ10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnYm9yZGVyLWNvbG9yJywgY2xhc3NQcm9wZXJ0aWVzWydib3JkZXItY29sb3InXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnYm9yZGVyLXdpZHRoJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydib3JkZXItd2lkdGgnXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdib3JkZXItd2lkdGgnLCBjbGFzc1Byb3BlcnRpZXNbJ2JvcmRlci13aWR0aCddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVsZS5kYXRhKCd0ZXh0LXdyYXAnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ3RleHQtd3JhcCddKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ3RleHQtd3JhcCcsIGNsYXNzUHJvcGVydGllc1sndGV4dC13cmFwJ10pO1xuICAgICAgICB9XG5cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGVsZS5pc0VkZ2UoKSkge1xuICAgICAgICBpZiAoIWVsZS5kYXRhKCd3aWR0aCcpICYmIGNsYXNzUHJvcGVydGllc1snd2lkdGgnXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCd3aWR0aCcsIGNsYXNzUHJvcGVydGllc1snd2lkdGgnXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnbGluZS1jb2xvcicpICYmIGNsYXNzUHJvcGVydGllc1snbGluZS1jb2xvciddKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ2xpbmUtY29sb3InLCBjbGFzc1Byb3BlcnRpZXNbJ2xpbmUtY29sb3InXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgXG4gIC8vIFVwZGF0ZSBjeSBzdHlsZXNoZWV0XG4gIHZhciB1cGRhdGVTdHlsZVNoZWV0ID0gZnVuY3Rpb24oKSB7XG4gICAgY3kuc3R5bGUoKVxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2ZvbnQtc2l6ZV1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2ZvbnQtc2l6ZSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgLy8gSWYgbm9kZSBsYWJlbHMgYXJlIGV4cGVjdGVkIHRvIGJlIGFkanVzdGVkIGF1dG9tYXRpY2FsbHkgb3IgZWxlbWVudCBjYW5ub3QgaGF2ZSBsYWJlbFxuICAgICAgICAvLyByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRMYWJlbFRleHRTaXplKCkgZWxzZSByZXR1cm4gZWxlLmRhdGEoJ2ZvbnQtc2l6ZScpXG4gICAgICAgIHZhciBvcHQgPSBvcHRpb25zLmFkanVzdE5vZGVMYWJlbEZvbnRTaXplQXV0b21hdGljYWxseTtcbiAgICAgICAgdmFyIGFkanVzdCA9IHR5cGVvZiBvcHQgPT09ICdmdW5jdGlvbicgPyBvcHQoKSA6IG9wdDtcbiAgICAgICAgXG4gICAgICAgIGlmICghYWRqdXN0KSB7XG4gICAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250LXNpemUnKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0TGFiZWxUZXh0U2l6ZShlbGUpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bZm9udC1mYW1pbHldXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdmb250LWZhbWlseSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250LWZhbWlseScpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bZm9udC1zdHlsZV1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2ZvbnQtc3R5bGUnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnZm9udC1zdHlsZScpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bZm9udC13ZWlnaHRdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdmb250LXdlaWdodCc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250LXdlaWdodCcpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bYmFja2dyb3VuZC1jb2xvcl1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2JhY2tncm91bmQtY29sb3InOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnYmFja2dyb3VuZC1jb2xvcicpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bYmFja2dyb3VuZC1vcGFjaXR5XVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2JhY2tncm91bmQtb3BhY2l0eScpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bYm9yZGVyLXdpZHRoXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnYm9yZGVyLXdpZHRoJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2JvcmRlci13aWR0aCcpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bYm9yZGVyLWNvbG9yXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnYm9yZGVyLWNvbG9yJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2JvcmRlci1jb2xvcicpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bdGV4dC13cmFwXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAndGV4dC13cmFwJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ3RleHQtd3JhcCcpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzc11bbGluZS1jb2xvcl1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2xpbmUtY29sb3InOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnbGluZS1jb2xvcicpO1xuICAgICAgfSxcbiAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdsaW5lLWNvbG9yJyk7XG4gICAgICB9LFxuICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6IGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2xpbmUtY29sb3InKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3NdW3dpZHRoXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnd2lkdGgnOiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCd3aWR0aCcpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwiZWRnZS5jeS1leHBhbmQtY29sbGFwc2UtbWV0YS1lZGdlXCIpXG4gICAgLmNzcyh7XG4gICAgICAnbGluZS1jb2xvcic6ICcjQzRDNEM0JyxcbiAgICAgICdzb3VyY2UtYXJyb3ctY29sb3InOiAnI0M0QzRDNCcsXG4gICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyNDNEM0QzQnXG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlOnNlbGVjdGVkXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdib3JkZXItY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAndGV4dC1vdXRsaW5lLWNvbG9yJzogJyMwMDAnXG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJlZGdlOnNlbGVjdGVkXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdsaW5lLWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnI2Q2NzYxNCdcbiAgICB9KS51cGRhdGUoKTtcbiAgfTtcbiAgXG4gIC8vIEJpbmQgZXZlbnRzXG4gIHZhciBiaW5kQ3lFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICBjeS5vbihcImFkZFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHZhciBlbGUgPSBldmVudC5jeVRhcmdldCB8fCBldmVudC50YXJnZXQ7XG4gICAgICBpbml0RWxlbWVudERhdGEoZWxlKTtcbiAgICB9KTtcbiAgfTtcbiAgLy8gSGVscGVycyBFbmRcbiAgXG4gIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBleGVjdXRlZCBhZnRlciBkb2N1bWVudC5yZWFkeSBpbiBzYmdudml6IGJlY2F1c2UgaXQgaXMgcmVnaXN0ZXJlZCBsYXRlclxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgLy8gT25jZSBjeSBpcyByZWFkeSBiaW5kIGV2ZW50cyBhbmQgdXBkYXRlIHN0eWxlIHNoZWV0XG4gICAgY3kucmVhZHkoIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBiaW5kQ3lFdmVudHMoKTtcbiAgICAgIHVwZGF0ZVN0eWxlU2hlZXQoKTtcbiAgICB9KTtcbiAgfSk7XG59OyIsIi8vIEV4dGVuZHMgc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBzYmdudml6ID0gbGlicy5zYmdudml6O1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzO1xudmFyIG9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKS5nZXRPcHRpb25zKCk7XG5cbmVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZSA9IHVuZGVmaW5lZDsgLy8gaW5pdGlhbGl6ZSBtYXAgdHlwZVxuXG5lbGVtZW50VXRpbGl0aWVzLlBEID0ge307IC8vIG5hbWVzcGFjZSBmb3IgYWxsIFBEIHNwZWNpZmljIHN0dWZmXG5lbGVtZW50VXRpbGl0aWVzLkFGID0ge307IC8vIG5hbWVzcGFjZSBmb3IgYWxsIEFGIHNwZWNpZmljIHN0dWZmXG5cbmVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXMgPSB7XG4gIFwicHJvY2Vzc1wiOiB7XG4gICAgd2lkdGg6IDE1LFxuICAgIGhlaWdodDogMTUsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwib21pdHRlZCBwcm9jZXNzXCI6IHtcbiAgICB3aWR0aDogMTUsXG4gICAgaGVpZ2h0OiAxNSxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgfSxcbiAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiB7XG4gICAgd2lkdGg6IDE1LFxuICAgIGhlaWdodDogMTUsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwiYXNzb2NpYXRpb25cIjoge1xuICAgIHdpZHRoOiAxNSxcbiAgICBoZWlnaHQ6IDE1LFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyM3MDcwNzAnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcImRpc3NvY2lhdGlvblwiOiB7XG4gICAgd2lkdGg6IDE1LFxuICAgIGhlaWdodDogMTUsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwibWFjcm9tb2xlY3VsZVwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJzaW1wbGUgY2hlbWljYWxcIjoge1xuICAgIHdpZHRoOiAzNSxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwic291cmNlIGFuZCBzaW5rXCI6IHtcbiAgICB3aWR0aDogMjUsXG4gICAgaGVpZ2h0OiAyNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcInRhZ1wiOiB7XG4gICAgd2lkdGg6IDM1LFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJwaGVub3R5cGVcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcInBlcnR1cmJpbmcgYWdlbnRcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwiY29tcGxleFwiOiB7XG4gICAgd2lkdGg6IDUwLFxuICAgIGhlaWdodDogNTAsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJjb21wYXJ0bWVudFwiOiB7XG4gICAgd2lkdGg6IDgwLFxuICAgIGhlaWdodDogODAsXG4gICAgJ2ZvbnQtc2l6ZSc6IDE0LFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMy4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJhbmRcIjoge1xuICAgIHdpZHRoOiAyNSxcbiAgICBoZWlnaHQ6IDI1LFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcIm9yXCI6IHtcbiAgICB3aWR0aDogMjUsXG4gICAgaGVpZ2h0OiAyNSxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgfSxcbiAgXCJub3RcIjoge1xuICAgIHdpZHRoOiAyNSxcbiAgICBoZWlnaHQ6IDI1LFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcImNvbnN1bXB0aW9uXCI6IHtcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAnd2lkdGgnOiAxLjI1XG4gIH0sXG4gIFwicHJvZHVjdGlvblwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcIm1vZHVsYXRpb25cIjoge1xuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICd3aWR0aCc6IDEuMjVcbiAgfSxcbiAgXCJzdGltdWxhdGlvblwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcImNhdGFseXNpc1wiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcImluaGliaXRpb25cIjoge1xuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICd3aWR0aCc6IDEuMjVcbiAgfSxcbiAgXCJuZWNlc3Nhcnkgc3RpbXVsYXRpb25cIjoge1xuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICd3aWR0aCc6IDEuMjVcbiAgfSxcbiAgXCJsb2dpYyBhcmNcIjoge1xuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICd3aWR0aCc6IDEuMjVcbiAgfSxcbiAgXCJlcXVpdmFsZW5jZSBhcmNcIjoge1xuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICd3aWR0aCc6IDEuMjVcbiAgfSxcbiAgXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcIkJBIHBsYWluXCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcIkJBIHVuc3BlY2lmaWVkIGVudGl0eVwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJCQSBzaW1wbGUgY2hlbWljYWxcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwiQkEgbWFjcm9tb2xlY3VsZVwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJCQSBudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJCQSBwZXJ0dXJiaW5nIGFnZW50XCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcIkJBIGNvbXBsZXhcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwiZGVsYXlcIjoge1xuICAgIHdpZHRoOiAyNSxcbiAgICBoZWlnaHQ6IDI1LFxuICAgICdmb250LWZhbWlseSc6ICdDYW1icmlhJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgfSxcbiAgXCJ1bmtub3duIGluZmx1ZW5jZVwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcInBvc2l0aXZlIGluZmx1ZW5jZVwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcIm5lZ2F0aXZlIGluZmx1ZW5jZVwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxufTtcblxuXG4vKlxuICBzZWUgaHR0cDovL2pvdXJuYWwuaW1iaW8uZGUvYXJ0aWNsZXMvcGRmL2ppYi0yNjMucGRmIHAuNDEgPC0tIGJ1dCBiZXdhcmUsIG91dGRhdGVkXG4gIGZvbGxvd2luZyB0YWJsZXMgaGF2ZSBiZWVuIHVwZGF0ZWQgd2l0aCBQRCBsdmwxIHYyLjAgb2YgTm92ZW1iZXIgNywgMjAxNiB3b3JraW5nIGRyYWZ0XG4gIG9ubHkgdGhlIGZvbGxvd2luZyB0aGluZ3MgaGF2ZSBiZWVuIGNoYW5nZWQgZnJvbSAyLjAgKHRoaXMgdmVyc2lvbiBpcyBub3QgY2xlYXIgb24gY29ubmVjdGl2aXR5KTpcbiAgIC0gZW1wdHkgc2V0IGhhcyBubyBsaW1pdCBvbiBpdHMgZWRnZSBjb3VudFxuICAgLSBsb2dpYyBvcGVyYXRvcnMgY2FuIGJlIHNvdXJjZSBhbmQgdGFyZ2V0XG4gICAtIGxpbWl0IG9mIDEgY2F0YWx5c2lzIGFuZCAxIG5lY2Vzc2FyeSBzdGltdWxhdGlvbiBvbiBhIHByb2Nlc3NcblxuICBmb3IgZWFjaCBlZGdlIGNsYXNzIGFuZCBub2RlY2xhc3MgZGVmaW5lIDIgY2FzZXM6XG4gICAtIG5vZGUgY2FuIGJlIGEgc291cmNlIG9mIHRoaXMgZWRnZSAtPiBhc1NvdXJjZVxuICAgLSBub2RlIGNhbiBiZSBhIHRhcmdldCBvZiB0aGlzIGVkZ2UgLT4gYXNUYXJnZXRcbiAgZm9yIGJvdGggY2FzZXMsIHRlbGxzIGlmIGl0IGlzIGFsbG93ZWQgYW5kIHdoYXQgaXMgdGhlIGxpbWl0IG9mIGVkZ2VzIGFsbG93ZWQuXG4gIExpbWl0cyBjYW4gY29uY2VybiBvbmx5IHRoaXMgdHlwZSBvZiBlZGdlIChtYXhFZGdlKSBvciB0aGUgdG90YWwgbnVtYmVyIG9mIGVkZ2VzIGZvciB0aGlzIG5vZGUgKG1heFRvdGFsKS5cbiAgQ29uc2lkZXIgdW5kZWZpbmVkIHRoaW5ncyBhcyBmYWxzZS91bmFsbG93ZWQgLT4gd2hpdGVsaXN0IGJlaGF2aW9yLlxuXG4gIHRoZSBub2Rlcy9lZGdlcyBjbGFzcyBsaXN0ZWQgYmVsb3cgYXJlIHRob3NlIHVzZWQgaW4gdGhlIHByb2dyYW0uXG4gIEZvciBpbnN0YW5jZSBcImNvbXBhcnRtZW50XCIgaXNuJ3QgYSBub2RlIGluIFNCR04gc3BlY3MuXG4qL1xuZWxlbWVudFV0aWxpdGllcy5QRC5jb25uZWN0aXZpdHlDb25zdHJhaW50cyA9IHtcbiAgXCJjb25zdW1wdGlvblwiOiB7XG4gICAgXCJtYWNyb21vbGVjdWxlXCI6ICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwic2ltcGxlIGNoZW1pY2FsXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wbGV4XCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInNvdXJjZSBhbmQgc2lua1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX19LFxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319XG4gIH0sXG4gIFwicHJvZHVjdGlvblwiOiB7XG4gICAgXCJtYWNyb21vbGVjdWxlXCI6ICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJjb21wbGV4XCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fVxuICB9LFxuICBcIm1vZHVsYXRpb25cIjoge1xuICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInByb2Nlc3NcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcImFzc29jaWF0aW9uXCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImRpc3NvY2lhdGlvblwiOiAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fVxuICB9LFxuICBcInN0aW11bGF0aW9uXCI6IHtcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjogICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX1cbiAgfSxcbiAgXCJjYXRhbHlzaXNcIjoge1xuICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInNvdXJjZSBhbmQgc2lua1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxfX0sXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxfX0sXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxfX0sXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX1cbiAgfSxcbiAgXCJpbmhpYml0aW9uXCI6IHtcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjogICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX1cbiAgfSxcbiAgXCJuZWNlc3Nhcnkgc3RpbXVsYXRpb25cIjoge1xuICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInByb2Nlc3NcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDF9fSxcbiAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDF9fSxcbiAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDF9fSxcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDF9fSxcbiAgICBcImFzc29jaWF0aW9uXCI6ICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImRpc3NvY2lhdGlvblwiOiAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge319LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHt9fSxcbiAgfSxcbiAgXCJsb2dpYyBhcmNcIjoge1xuICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgICBhc1RhcmdldDoge319LFxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwidW5jZXJ0YWluIHByb2Nlc3NcIjogICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJub3RcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9fSxcbiAgfSxcbiAgXCJlcXVpdmFsZW5jZSBhcmNcIjoge1xuICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge319LFxuICAgIFwic2ltcGxlIGNoZW1pY2FsXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge319LFxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge319LFxuICAgIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlfSwgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZX19LFxuICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwidW5jZXJ0YWluIHByb2Nlc3NcIjogICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319XG4gIH1cbn07XG5cbi8qIEFGIG5vZGUgY29ubmVjdGl2aXR5IHJ1bGVzXG4gKiBTZWU6IFN5c3RlbXMgQmlvbG9neSBHcmFwaGljYWwgTm90YXRpb246IEFjdGl2aXR5IEZsb3cgbGFuZ3VhZ2UgTGV2ZWwgMSwgVmVyc2lvbiAxLjIsIERhdGU6IEp1bHkgMjcsIDIwMTVcbiAqICAgU2VjdGlvbiAzLjMuMTogQWN0aXZpdHkgTm9kZXMgY29ubmVjdGl2aXR5IGRlZmluaXRpb25cbiAqICAgVVJMOiBodHRwczovL2RvaS5vcmcvMTAuMjM5MC9iaWVjb2xsLWppYi0yMDE1LTI2NVxuICovXG5lbGVtZW50VXRpbGl0aWVzLkFGLmNvbm5lY3Rpdml0eUNvbnN0cmFpbnRzID0ge1xuICBcInBvc2l0aXZlIGluZmx1ZW5jZVwiOiB7XG4gICAgXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI6ICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJkZWxheVwiOiAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICB9LFxuICBcIm5lZ2F0aXZlIGluZmx1ZW5jZVwiOiB7XG4gICAgXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI6ICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJkZWxheVwiOiAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICB9LFxuICBcInVua25vd24gaW5mbHVlbmNlXCI6IHtcbiAgICBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjogIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImRlbGF5XCI6ICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gIH0sXG4gIFwibmVjZXNzYXJ5IHN0aW11bGF0aW9uXCI6IHtcbiAgICBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjogIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICBhc1RhcmdldDoge319LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImRlbGF5XCI6ICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gIH0sXG4gIFwibG9naWMgYXJjXCI6IHtcbiAgICBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjogIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZX0sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHt9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWV9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge30sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfX0sXG4gICAgXCJkZWxheVwiOiAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX19LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7fSwgICBhc1RhcmdldDoge319LFxuICB9LFxuICBcImVxdWl2YWxlbmNlIGFyY1wiOiB7XG4gICAgXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI6ICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWV9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlfX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJub3RcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJkZWxheVwiOiAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHt9LCAgIGFzVGFyZ2V0OiB7fX0sXG4gIH0sXG59XG4vLyBpbml0aWFsaXplIGEgZ2xvYmFsIHVuaXQgb2YgaW5mb3JtYXRpb24gb2JqZWN0XG52YXIgdW9pX29iaiA9IHt9O1xudW9pX29iai5jbGF6eiA9IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiO1xudW9pX29iai5sYWJlbCA9IHtcbiAgdGV4dDogXCJcIlxufTtcblxudW9pX29iai5iYm94ID0ge1xuICAgdzogMzAsXG4gICBoOiAxMlxufTtcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcblxuLy8gc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzg4MDk0NzJcbi8vIHdlIG5lZWQgdG8gdGFrZSBjYXJlIG9mIG91ciBvd24gSURzIGJlY2F1c2UgdGhlIG9uZXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgY3l0b3NjYXBlIChhbHNvIFVVSUQpXG4vLyBkb24ndCBjb21wbHkgd2l0aCB4c2Q6U0lEIHR5cGUgdGhhdCBtdXN0IG5vdCBiZWdpbiB3aXRoIGEgbnVtYmVyXG5mdW5jdGlvbiBnZW5lcmF0ZVVVSUQgKCkgeyAvLyBQdWJsaWMgRG9tYWluL01JVFxuICAgIHZhciBkID0gRGF0ZS5ub3coKTtcbiAgICBpZiAodHlwZW9mIHBlcmZvcm1hbmNlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcGVyZm9ybWFuY2Uubm93ID09PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgZCArPSBwZXJmb3JtYW5jZS5ub3coKTsgLy91c2UgaGlnaC1wcmVjaXNpb24gdGltZXIgaWYgYXZhaWxhYmxlXG4gICAgfVxuICAgIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIHZhciByID0gKGQgKyBNYXRoLnJhbmRvbSgpICogMTYpICUgMTYgfCAwO1xuICAgICAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpO1xuICAgICAgICByZXR1cm4gKGMgPT09ICd4JyA/IHIgOiAociAmIDB4MyB8IDB4OCkpLnRvU3RyaW5nKDE2KTtcbiAgICB9KTtcbn1cblxuZWxlbWVudFV0aWxpdGllcy5hZGROb2RlID0gZnVuY3Rpb24gKHgsIHksIG5vZGVQYXJhbXMsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcbiAgaWYgKHR5cGVvZiBub2RlUGFyYW1zICE9ICdvYmplY3QnKXtcbiAgICB2YXIgc2JnbmNsYXNzID0gbm9kZVBhcmFtcztcbiAgfSBlbHNlIHtcbiAgICAgIHZhciBzYmduY2xhc3MgPSBub2RlUGFyYW1zLmNsYXNzO1xuICAgICAgdmFyIGxhbmd1YWdlID0gbm9kZVBhcmFtcy5sYW5ndWFnZTtcbiAgfVxuICB2YXIgZGVmYXVsdFByb3BlcnRpZXMgPSB0aGlzLmRlZmF1bHRQcm9wZXJ0aWVzO1xuICB2YXIgZGVmYXVsdHMgPSBkZWZhdWx0UHJvcGVydGllc1tzYmduY2xhc3NdO1xuXG4gIHZhciB3aWR0aCA9IGRlZmF1bHRzID8gZGVmYXVsdHMud2lkdGggOiA1MDtcbiAgdmFyIGhlaWdodCA9IGRlZmF1bHRzID8gZGVmYXVsdHMuaGVpZ2h0IDogNTA7XG4gIFxuICB2YXIgY3NzID0ge307XG5cblxuICBpZiAodmlzaWJpbGl0eSkge1xuICAgIGNzcy52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcbiAgfVxuXG4gIGlmIChkZWZhdWx0cyAmJiBkZWZhdWx0cy5tdWx0aW1lcikge1xuICAgIHNiZ25jbGFzcyArPSBcIiBtdWx0aW1lclwiO1xuICB9XG4gIHZhciBkYXRhID0ge1xuICAgIGNsYXNzOiBzYmduY2xhc3MsXG5cdGxhbmd1YWdlOiBsYW5ndWFnZSxcbiAgICBiYm94OiB7XG4gICAgICBoOiBoZWlnaHQsXG4gICAgICB3OiB3aWR0aCxcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfSxcbiAgICBzdGF0ZXNhbmRpbmZvczogW10sXG4gICAgcG9ydHM6IFtdLFxuICAgIGNsb25lbWFya2VyOiBkZWZhdWx0cyAmJiBkZWZhdWx0cy5jbG9uZW1hcmtlciA/IGRlZmF1bHRzLmNsb25lbWFya2VyIDogdW5kZWZpbmVkXG4gIH07XG5cbiAgaWYoaWQpIHtcbiAgICBkYXRhLmlkID0gaWQ7XG4gIH1cbiAgZWxzZSB7XG4gICAgZGF0YS5pZCA9IFwibnd0Tl9cIiArIGdlbmVyYXRlVVVJRCgpO1xuICB9XG4gIFxuICBpZiAocGFyZW50KSB7XG4gICAgZGF0YS5wYXJlbnQgPSBwYXJlbnQ7XG4gIH1cblxuICB2YXIgZWxlcyA9IGN5LmFkZCh7XG4gICAgZ3JvdXA6IFwibm9kZXNcIixcbiAgICBkYXRhOiBkYXRhLFxuICAgIGNzczogY3NzLFxuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH1cbiAgfSk7XG5cbiAgdmFyIG5ld05vZGUgPSBlbGVzW2VsZXMubGVuZ3RoIC0gMV07XG4gIHZhciBvcmRlcmluZyA9IHRoaXMuZGVmYXVsdFByb3BlcnRpZXNbc2JnbmNsYXNzLnJlcGxhY2UoL1xccyptdWx0aW1lciQvLCAnJyldWydwb3J0cy1vcmRlcmluZyddOyAvLyBHZXQgdGhlIGRlZmF1bHQgcG9ydHMgb3JkZXJpbmcgZm9yIHRoZSBub2RlcyB3aXRoIGdpdmVuIHNiZ25jbGFzc1xuXG4gIC8vIElmIHRoZXJlIGlzIGEgZGVmYXVsdCBwb3J0cyBvcmRlcmluZyBmb3IgdGhlIG5vZGVzIHdpdGggZ2l2ZW4gc2JnbmNsYXNzIGFuZCBpdCBpcyBkaWZmZXJlbnQgdGhhbiAnbm9uZScgc2V0IHRoZSBwb3J0cyBvcmRlcmluZyB0byB0aGF0IG9yZGVyaW5nXG4gIGlmIChvcmRlcmluZyAmJiBvcmRlcmluZyAhPT0gJ25vbmUnKSB7XG4gICAgdGhpcy5zZXRQb3J0c09yZGVyaW5nKG5ld05vZGUsIG9yZGVyaW5nKTtcbiAgfVxuXG4gIGlmIChsYW5ndWFnZSA9PSBcIkFGXCIgJiYgIWVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZU11bHRpcGxlVW5pdE9mSW5mb3JtYXRpb24obmV3Tm9kZSkpe1xuICAgIGlmIChzYmduY2xhc3MgIT0gXCJCQSBwbGFpblwiKSAgLy8gaWYgQUYgbm9kZSBjYW4gaGF2ZSBsYWJlbCBpLmU6IG5vdCBwbGFpbiBiaW9sb2dpY2FsIGFjdGl2aXR5IFxuICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChuZXdOb2RlLCB1b2lfb2JqKTtcbiAgfVxuXG4gIHJldHVybiBuZXdOb2RlO1xufTtcblxuZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlID0gZnVuY3Rpb24gKHNvdXJjZSwgdGFyZ2V0LCBlZGdlUGFyYW1zLCBpZCwgdmlzaWJpbGl0eSkge1xuICBpZiAodHlwZW9mIGVkZ2VQYXJhbXMgIT0gJ29iamVjdCcpe1xuICAgIHZhciBzYmduY2xhc3MgPSBlZGdlUGFyYW1zO1xuICB9IGVsc2Uge1xuICAgICAgdmFyIHNiZ25jbGFzcyA9IGVkZ2VQYXJhbXMuY2xhc3M7XG4gICAgICB2YXIgbGFuZ3VhZ2UgPSBlZGdlUGFyYW1zLmxhbmd1YWdlO1xuICB9XG4gIHZhciBkZWZhdWx0UHJvcGVydGllcyA9IHRoaXMuZGVmYXVsdFByb3BlcnRpZXM7XG4gIHZhciBkZWZhdWx0cyA9IGRlZmF1bHRQcm9wZXJ0aWVzW3NiZ25jbGFzc107XG4gIFxuICB2YXIgY3NzID0ge307XG5cbiAgaWYgKHZpc2liaWxpdHkpIHtcbiAgICBjc3MudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XG4gIH1cblxuICB2YXIgZGF0YSA9IHtcbiAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICBjbGFzczogc2JnbmNsYXNzLFxuICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlLFxuICB9O1xuICBcbiAgaWYoaWQpIHtcbiAgICBkYXRhLmlkID0gaWQ7XG4gIH1cbiAgZWxzZSB7XG4gICAgZGF0YS5pZCA9IFwibnd0RV9cIiArIGdlbmVyYXRlVVVJRCgpO1xuICB9XG4gIFxuICB2YXIgc291cmNlTm9kZSA9IGN5LmdldEVsZW1lbnRCeUlkKHNvdXJjZSk7IC8vIFRoZSBvcmlnaW5hbCBzb3VyY2Ugbm9kZVxuICB2YXIgdGFyZ2V0Tm9kZSA9IGN5LmdldEVsZW1lbnRCeUlkKHRhcmdldCk7IC8vIFRoZSBvcmlnaW5hbCB0YXJnZXQgbm9kZVxuICB2YXIgc291cmNlSGFzUG9ydHMgPSBzb3VyY2VOb2RlLmRhdGEoJ3BvcnRzJykubGVuZ3RoID09PSAyO1xuICB2YXIgdGFyZ2V0SGFzUG9ydHMgPSB0YXJnZXROb2RlLmRhdGEoJ3BvcnRzJykubGVuZ3RoID09PSAyO1xuICAvLyBUaGUgcG9ydHNvdXJjZSBhbmQgcG9ydHRhcmdldCB2YXJpYWJsZXNcbiAgdmFyIHBvcnRzb3VyY2U7XG4gIHZhciBwb3J0dGFyZ2V0O1xuICBcbiAgLypcbiAgICogR2V0IGlucHV0L291dHB1dCBwb3J0IGlkJ3Mgb2YgYSBub2RlIHdpdGggdGhlIGFzc3VtcHRpb24gdGhhdCB0aGUgbm9kZSBoYXMgdmFsaWQgcG9ydHMuXG4gICAqL1xuICB2YXIgZ2V0SU9Qb3J0SWRzID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICB2YXIgbm9kZUlucHV0UG9ydElkLCBub2RlT3V0cHV0UG9ydElkO1xuICAgIHZhciBub2RlUG9ydHNPcmRlcmluZyA9IHNiZ252aXouZWxlbWVudFV0aWxpdGllcy5nZXRQb3J0c09yZGVyaW5nKG5vZGUpO1xuICAgIHZhciBub2RlUG9ydHMgPSBub2RlLmRhdGEoJ3BvcnRzJyk7XG4gICAgaWYgKCBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ0wtdG8tUicgfHwgbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdSLXRvLUwnICkge1xuICAgICAgdmFyIGxlZnRQb3J0SWQgPSBub2RlUG9ydHNbMF0ueCA8IDAgPyBub2RlUG9ydHNbMF0uaWQgOiBub2RlUG9ydHNbMV0uaWQ7IC8vIFRoZSB4IHZhbHVlIG9mIGxlZnQgcG9ydCBpcyBzdXBwb3NlZCB0byBiZSBuZWdhdGl2ZVxuICAgICAgdmFyIHJpZ2h0UG9ydElkID0gbm9kZVBvcnRzWzBdLnggPiAwID8gbm9kZVBvcnRzWzBdLmlkIDogbm9kZVBvcnRzWzFdLmlkOyAvLyBUaGUgeCB2YWx1ZSBvZiByaWdodCBwb3J0IGlzIHN1cHBvc2VkIHRvIGJlIHBvc2l0aXZlXG4gICAgICAvKlxuICAgICAgICogSWYgdGhlIHBvcnQgb3JkZXJpbmcgaXMgbGVmdCB0byByaWdodCB0aGVuIHRoZSBpbnB1dCBwb3J0IGlzIHRoZSBsZWZ0IHBvcnQgYW5kIHRoZSBvdXRwdXQgcG9ydCBpcyB0aGUgcmlnaHQgcG9ydC5cbiAgICAgICAqIEVsc2UgaWYgaXQgaXMgcmlnaHQgdG8gbGVmdCBpdCBpcyB2aWNlIHZlcnNhXG4gICAgICAgKi9cbiAgICAgIG5vZGVJbnB1dFBvcnRJZCA9IG5vZGVQb3J0c09yZGVyaW5nID09PSAnTC10by1SJyA/IGxlZnRQb3J0SWQgOiByaWdodFBvcnRJZDtcbiAgICAgIG5vZGVPdXRwdXRQb3J0SWQgPSBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ1ItdG8tTCcgPyBsZWZ0UG9ydElkIDogcmlnaHRQb3J0SWQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKCBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ1QtdG8tQicgfHwgbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdCLXRvLVQnICl7XG4gICAgICB2YXIgdG9wUG9ydElkID0gbm9kZVBvcnRzWzBdLnkgPCAwID8gbm9kZVBvcnRzWzBdLmlkIDogbm9kZVBvcnRzWzFdLmlkOyAvLyBUaGUgeSB2YWx1ZSBvZiB0b3AgcG9ydCBpcyBzdXBwb3NlZCB0byBiZSBuZWdhdGl2ZVxuICAgICAgdmFyIGJvdHRvbVBvcnRJZCA9IG5vZGVQb3J0c1swXS55ID4gMCA/IG5vZGVQb3J0c1swXS5pZCA6IG5vZGVQb3J0c1sxXS5pZDsgLy8gVGhlIHkgdmFsdWUgb2YgYm90dG9tIHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgcG9zaXRpdmVcbiAgICAgIC8qXG4gICAgICAgKiBJZiB0aGUgcG9ydCBvcmRlcmluZyBpcyB0b3AgdG8gYm90dG9tIHRoZW4gdGhlIGlucHV0IHBvcnQgaXMgdGhlIHRvcCBwb3J0IGFuZCB0aGUgb3V0cHV0IHBvcnQgaXMgdGhlIGJvdHRvbSBwb3J0LlxuICAgICAgICogRWxzZSBpZiBpdCBpcyByaWdodCB0byBsZWZ0IGl0IGlzIHZpY2UgdmVyc2FcbiAgICAgICAqL1xuICAgICAgbm9kZUlucHV0UG9ydElkID0gbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdULXRvLUInID8gdG9wUG9ydElkIDogYm90dG9tUG9ydElkO1xuICAgICAgbm9kZU91dHB1dFBvcnRJZCA9IG5vZGVQb3J0c09yZGVyaW5nID09PSAnQi10by1UJyA/IHRvcFBvcnRJZCA6IGJvdHRvbVBvcnRJZDtcbiAgICB9XG4gICAgXG4gICAgLy8gUmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBJTyBwb3J0cyBvZiB0aGUgbm9kZVxuICAgIHJldHVybiB7XG4gICAgICBpbnB1dFBvcnRJZDogbm9kZUlucHV0UG9ydElkLFxuICAgICAgb3V0cHV0UG9ydElkOiBub2RlT3V0cHV0UG9ydElkXG4gICAgfTtcbiAgfTtcbiAgXG4gIC8vIElmIGF0IGxlYXN0IG9uZSBlbmQgb2YgdGhlIGVkZ2UgaGFzIHBvcnRzIHRoZW4gd2Ugc2hvdWxkIGRldGVybWluZSB0aGUgcG9ydHMgd2hlcmUgdGhlIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZC5cbiAgaWYgKHNvdXJjZUhhc1BvcnRzIHx8IHRhcmdldEhhc1BvcnRzKSB7XG4gICAgdmFyIHNvdXJjZU5vZGVJbnB1dFBvcnRJZCwgc291cmNlTm9kZU91dHB1dFBvcnRJZCwgdGFyZ2V0Tm9kZUlucHV0UG9ydElkLCB0YXJnZXROb2RlT3V0cHV0UG9ydElkO1xuICAgIFxuICAgIC8vIElmIHNvdXJjZSBub2RlIGhhcyBwb3J0cyBzZXQgdGhlIHZhcmlhYmxlcyBkZWRpY2F0ZWQgZm9yIGl0cyBJTyBwb3J0c1xuICAgIGlmICggc291cmNlSGFzUG9ydHMgKSB7XG4gICAgICB2YXIgaW9Qb3J0cyA9IGdldElPUG9ydElkcyhzb3VyY2VOb2RlKTtcbiAgICAgIHNvdXJjZU5vZGVJbnB1dFBvcnRJZCA9IGlvUG9ydHMuaW5wdXRQb3J0SWQ7XG4gICAgICBzb3VyY2VOb2RlT3V0cHV0UG9ydElkID0gaW9Qb3J0cy5vdXRwdXRQb3J0SWQ7XG4gICAgfVxuICAgIFxuICAgIC8vIElmIHRhcmdldCBub2RlIGhhcyBwb3J0cyBzZXQgdGhlIHZhcmlhYmxlcyBkZWRpY2F0ZWQgZm9yIGl0cyBJTyBwb3J0c1xuICAgIGlmICggdGFyZ2V0SGFzUG9ydHMgKSB7XG4gICAgICB2YXIgaW9Qb3J0cyA9IGdldElPUG9ydElkcyh0YXJnZXROb2RlKTtcbiAgICAgIHRhcmdldE5vZGVJbnB1dFBvcnRJZCA9IGlvUG9ydHMuaW5wdXRQb3J0SWQ7XG4gICAgICB0YXJnZXROb2RlT3V0cHV0UG9ydElkID0gaW9Qb3J0cy5vdXRwdXRQb3J0SWQ7XG4gICAgfVxuXG4gICAgaWYgKHNiZ25jbGFzcyA9PT0gJ2NvbnN1bXB0aW9uJykge1xuICAgICAgLy8gQSBjb25zdW1wdGlvbiBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQgdG8gdGhlIGlucHV0IHBvcnQgb2YgdGhlIHRhcmdldCBub2RlIHdoaWNoIGlzIHN1cHBvc2VkIHRvIGJlIGEgcHJvY2VzcyAoYW55IGtpbmQgb2YpXG4gICAgICBwb3J0dGFyZ2V0ID0gdGFyZ2V0Tm9kZUlucHV0UG9ydElkO1xuICAgIH1cbiAgICBlbHNlIGlmIChzYmduY2xhc3MgPT09ICdwcm9kdWN0aW9uJyB8fCB0aGlzLmlzTW9kdWxhdGlvbkFyY0NsYXNzKHNiZ25jbGFzcykpIHtcbiAgICAgIC8vIEEgcHJvZHVjdGlvbiBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQgdG8gdGhlIG91dHB1dCBwb3J0IG9mIHRoZSBzb3VyY2Ugbm9kZSB3aGljaCBpcyBzdXBwb3NlZCB0byBiZSBhIHByb2Nlc3MgKGFueSBraW5kIG9mKVxuICAgICAgLy8gQSBtb2R1bGF0aW9uIGVkZ2UgbWF5IGhhdmUgYSBsb2dpY2FsIG9wZXJhdG9yIGFzIHNvdXJjZSBub2RlIGluIHRoaXMgY2FzZSB0aGUgZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBvdXRwdXQgcG9ydCBvZiBpdFxuICAgICAgLy8gVGhlIGJlbG93IGFzc2lnbm1lbnQgc2F0aXNmeSBhbGwgb2YgdGhlc2UgY29uZGl0aW9uXG4gICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZU91dHB1dFBvcnRJZDtcbiAgICB9XG4gICAgZWxzZSBpZiAoc2JnbmNsYXNzID09PSAnbG9naWMgYXJjJykge1xuICAgICAgdmFyIHNyY0NsYXNzID0gc291cmNlTm9kZS5kYXRhKCdjbGFzcycpO1xuICAgICAgdmFyIHRndENsYXNzID0gdGFyZ2V0Tm9kZS5kYXRhKCdjbGFzcycpO1xuICAgICAgdmFyIGlzU291cmNlTG9naWNhbE9wID0gc3JjQ2xhc3MgPT09ICdhbmQnIHx8IHNyY0NsYXNzID09PSAnb3InIHx8IHNyY0NsYXNzID09PSAnbm90JztcbiAgICAgIHZhciBpc1RhcmdldExvZ2ljYWxPcCA9IHRndENsYXNzID09PSAnYW5kJyB8fCB0Z3RDbGFzcyA9PT0gJ29yJyB8fCB0Z3RDbGFzcyA9PT0gJ25vdCc7XG4gICAgICBcbiAgICAgIGlmIChpc1NvdXJjZUxvZ2ljYWxPcCAmJiBpc1RhcmdldExvZ2ljYWxPcCkge1xuICAgICAgICAvLyBJZiBib3RoIGVuZCBhcmUgbG9naWNhbCBvcGVyYXRvcnMgdGhlbiB0aGUgZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBpbnB1dCBwb3J0IG9mIHRoZSB0YXJnZXQgYW5kIHRoZSBvdXRwdXQgcG9ydCBvZiB0aGUgaW5wdXRcbiAgICAgICAgcG9ydHRhcmdldCA9IHRhcmdldE5vZGVJbnB1dFBvcnRJZDtcbiAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQ7XG4gICAgICB9Ly8gSWYganVzdCBvbmUgZW5kIG9mIGxvZ2ljYWwgb3BlcmF0b3IgdGhlbiB0aGUgZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBpbnB1dCBwb3J0IG9mIHRoZSBsb2dpY2FsIG9wZXJhdG9yXG4gICAgICBlbHNlIGlmIChpc1NvdXJjZUxvZ2ljYWxPcCkge1xuICAgICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZUlucHV0UG9ydElkOyBcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGlzVGFyZ2V0TG9naWNhbE9wKSB7XG4gICAgICAgIHBvcnR0YXJnZXQgPSB0YXJnZXROb2RlSW5wdXRQb3J0SWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICAvLyBUaGUgZGVmYXVsdCBwb3J0c291cmNlL3BvcnR0YXJnZXQgYXJlIHRoZSBzb3VyY2UvdGFyZ2V0IHRoZW1zZWx2ZXMuIElmIHRoZXkgYXJlIG5vdCBzZXQgdXNlIHRoZXNlIGRlZmF1bHRzLlxuICAvLyBUaGUgcG9ydHNvdXJjZSBhbmQgcG9ydHRhcmdldCBhcmUgZGV0ZXJtaW5lZCBzZXQgdGhlbSBpbiBkYXRhIG9iamVjdC4gXG4gIGRhdGEucG9ydHNvdXJjZSA9IHBvcnRzb3VyY2UgfHwgc291cmNlO1xuICBkYXRhLnBvcnR0YXJnZXQgPSBwb3J0dGFyZ2V0IHx8IHRhcmdldDtcblxuICB2YXIgZWxlcyA9IGN5LmFkZCh7XG4gICAgZ3JvdXA6IFwiZWRnZXNcIixcbiAgICBkYXRhOiBkYXRhLFxuICAgIGNzczogY3NzXG4gIH0pO1xuXG4gIHZhciBuZXdFZGdlID0gZWxlc1tlbGVzLmxlbmd0aCAtIDFdO1xuICBcbiAgcmV0dXJuIG5ld0VkZ2U7XG59O1xuXG5lbGVtZW50VXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24oX3NvdXJjZSwgX3RhcmdldCwgcHJvY2Vzc1R5cGUpIHtcbiAgLy8gSWYgc291cmNlIGFuZCB0YXJnZXQgSURzIGFyZSBnaXZlbiBnZXQgdGhlIGVsZW1lbnRzIGJ5IElEc1xuICB2YXIgc291cmNlID0gdHlwZW9mIF9zb3VyY2UgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3NvdXJjZSkgOiBfc291cmNlO1xuICB2YXIgdGFyZ2V0ID0gdHlwZW9mIF90YXJnZXQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3RhcmdldCkgOiBfdGFyZ2V0O1xuICBcbiAgLy8gUHJvY2VzcyBwYXJlbnQgc2hvdWxkIGJlIHRoZSBjbG9zZXN0IGNvbW1vbiBhbmNlc3RvciBvZiB0aGUgc291cmNlIGFuZCB0YXJnZXQgbm9kZXNcbiAgdmFyIHByb2Nlc3NQYXJlbnQgPSBjeS5jb2xsZWN0aW9uKFtzb3VyY2VbMF0sIHRhcmdldFswXV0pLmNvbW1vbkFuY2VzdG9ycygpLmZpcnN0KCk7XG4gIFxuICAvLyBQcm9jZXNzIHNob3VsZCBiZSBhdCB0aGUgbWlkZGxlIG9mIHRoZSBzb3VyY2UgYW5kIHRhcmdldCBub2Rlc1xuICB2YXIgeCA9ICggc291cmNlLnBvc2l0aW9uKCd4JykgKyB0YXJnZXQucG9zaXRpb24oJ3gnKSApIC8gMjtcbiAgdmFyIHkgPSAoIHNvdXJjZS5wb3NpdGlvbigneScpICsgdGFyZ2V0LnBvc2l0aW9uKCd5JykgKSAvIDI7XG4gIFxuICAvLyBDcmVhdGUgdGhlIHByb2Nlc3Mgd2l0aCBnaXZlbi9jYWxjdWxhdGVkIHZhcmlhYmxlc1xuICB2YXIgcHJvY2VzcyA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4LCB5LCBwcm9jZXNzVHlwZSwgdW5kZWZpbmVkLCBwcm9jZXNzUGFyZW50LmlkKCkpO1xuICBpZiAocHJvY2Vzcy5kYXRhKFwiY2xhc3NcIikgPT09ICdwcm9jZXNzJylcbiAge1xuICAgIHZhciB4ZGlmZiA9IHNvdXJjZS5wb3NpdGlvbigneCcpIC0gdGFyZ2V0LnBvc2l0aW9uKCd4Jyk7XG4gICAgdmFyIHlkaWZmID0gc291cmNlLnBvc2l0aW9uKCd5JykgLSB0YXJnZXQucG9zaXRpb24oJ3knKVxuICAgIGlmIChNYXRoLmFicyh4ZGlmZikgPj0gTWF0aC5hYnMoeWRpZmYpKVxuICAgIHtcbiAgICAgICAgaWYgKHhkaWZmIDwgMClcbiAgICAgICAgICAgIGNoaXNlLmVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzLCAnTC10by1SJyk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNoaXNlLmVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzLCAnUi10by1MJyk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIGlmICh5ZGlmZiA8IDApXG4gICAgICAgICAgICBjaGlzZS5lbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2VzcywgJ1QtdG8tQicpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjaGlzZS5lbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2VzcywgJ0ItdG8tVCcpO1xuICAgIH1cbiAgfVxuXG5cbiAgLy8gQ3JlYXRlIHRoZSBlZGdlcyBvbmUgaXMgYmV0d2VlbiB0aGUgcHJvY2VzcyBhbmQgdGhlIHNvdXJjZSBub2RlICh3aGljaCBzaG91bGQgYmUgYSBjb25zdW1wdGlvbiksIFxuICAvLyB0aGUgb3RoZXIgb25lIGlzIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSB0YXJnZXQgbm9kZSAod2hpY2ggc2hvdWxkIGJlIGEgcHJvZHVjdGlvbikuXG4gIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uIHBsZWFzZSByZWZlciB0byBTQkdOLVBEIHJlZmVyZW5jZSBjYXJkLlxuICB2YXIgZWRnZUJ0d1NyYyA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShzb3VyY2UuaWQoKSwgcHJvY2Vzcy5pZCgpLCAnY29uc3VtcHRpb24nKTtcbiAgdmFyIGVkZ2VCdHdUZ3QgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCB0YXJnZXQuaWQoKSwgJ3Byb2R1Y3Rpb24nKTtcbiAgXG4gIC8vIENyZWF0ZSBhIGNvbGxlY3Rpb24gaW5jbHVkaW5nIHRoZSBlbGVtZW50cyBhbmQgdG8gYmUgcmV0dXJuZWRcbiAgdmFyIGNvbGxlY3Rpb24gPSBjeS5jb2xsZWN0aW9uKFtwcm9jZXNzWzBdLCBlZGdlQnR3U3JjWzBdLCBlZGdlQnR3VGd0WzBdXSk7XG4gIHJldHVybiBjb2xsZWN0aW9uO1xufTtcblxuLypcbiAqIFJldHVybnMgaWYgdGhlIGVsZW1lbnRzIHdpdGggdGhlIGdpdmVuIHBhcmVudCBjbGFzcyBjYW4gYmUgcGFyZW50IG9mIHRoZSBlbGVtZW50cyB3aXRoIHRoZSBnaXZlbiBub2RlIGNsYXNzXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuaXNWYWxpZFBhcmVudCA9IGZ1bmN0aW9uKF9ub2RlQ2xhc3MsIF9wYXJlbnRDbGFzcywgbm9kZSkge1xuICAvLyBJZiBub2RlQ2xhc3MgYW5kIHBhcmVudENsYXNzIHBhcmFtcyBhcmUgZWxlbWVudHMgaXRzZWx2ZXMgaW5zdGVhZCBvZiB0aGVpciBjbGFzcyBuYW1lcyBoYW5kbGUgaXRcbiAgdmFyIG5vZGVDbGFzcyA9IHR5cGVvZiBfbm9kZUNsYXNzICE9PSAnc3RyaW5nJyA/IF9ub2RlQ2xhc3MuZGF0YSgnY2xhc3MnKSA6IF9ub2RlQ2xhc3M7XG4gIHZhciBwYXJlbnRDbGFzcyA9IF9wYXJlbnRDbGFzcyAhPSB1bmRlZmluZWQgJiYgdHlwZW9mIF9wYXJlbnRDbGFzcyAhPT0gJ3N0cmluZycgPyBfcGFyZW50Q2xhc3MuZGF0YSgnY2xhc3MnKSA6IF9wYXJlbnRDbGFzcztcbiAgXG4gIGlmIChwYXJlbnRDbGFzcyA9PSB1bmRlZmluZWQgfHwgcGFyZW50Q2xhc3MgPT09ICdjb21wYXJ0bWVudCcpIHsgLy8gQ29tcGFydG1lbnRzIGFuZCB0aGUgcm9vdCBjYW4gaW5jbHVkZSBhbnkgdHlwZSBvZiBub2Rlc1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGVsc2UgaWYgKHBhcmVudENsYXNzLnN0YXJ0c1dpdGgoJ2NvbXBsZXgnKSAmJiAoIW5vZGUgfHwgbm9kZS5jb25uZWN0ZWRFZGdlcygpLmxlbmd0aCA9PSAwKSkgeyAvLyBDb21wbGV4ZXMgY2FuIG9ubHkgaW5jbHVkZSBFUE5zIHdoaWNoIGRvIG5vdCBoYXZlIGVkZ2VzXG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyhub2RlQ2xhc3MpO1xuICB9XG4gIFxuICByZXR1cm4gZmFsc2U7IC8vIEN1cnJlbnRseSBqdXN0ICdjb21wYXJ0bWVudCcgYW5kICdjb21wbGV4JyBjb21wb3VuZHMgYXJlIHN1cHBvcnRlZCByZXR1cm4gZmFsc2UgZm9yIGFueSBvdGhlciBwYXJlbnRDbGFzc1xufTtcblxuLypcbiAqIFRoaXMgbWV0aG9kIGFzc3VtZXMgdGhhdCBwYXJhbS5ub2Rlc1RvTWFrZUNvbXBvdW5kIGNvbnRhaW5zIGF0IGxlYXN0IG9uZSBub2RlXG4gKiBhbmQgYWxsIG9mIHRoZSBub2RlcyBpbmNsdWRpbmcgaW4gaXQgaGF2ZSB0aGUgc2FtZSBwYXJlbnQuIEl0IGNyZWF0ZXMgYSBjb21wb3VuZCBmb3QgdGhlIGdpdmVuIG5vZGVzIGFuIGhhdmluZyB0aGUgZ2l2ZW4gdHlwZS5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgPSBmdW5jdGlvbiAobm9kZXNUb01ha2VDb21wb3VuZCwgY29tcG91bmRUeXBlKSB7XG4gIHZhciBvbGRQYXJlbnRJZCA9IG5vZGVzVG9NYWtlQ29tcG91bmRbMF0uZGF0YShcInBhcmVudFwiKTtcbiAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZC4geCwgeSBhbmQgaWQgcGFyYW1ldGVycyBhcmUgbm90IHNldC5cbiAgdmFyIG5ld0NvbXBvdW5kID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjb21wb3VuZFR5cGUsIHVuZGVmaW5lZCwgb2xkUGFyZW50SWQpO1xuICB2YXIgbmV3Q29tcG91bmRJZCA9IG5ld0NvbXBvdW5kLmlkKCk7XG4gIHZhciBuZXdFbGVzID0gZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQobm9kZXNUb01ha2VDb21wb3VuZCwgbmV3Q29tcG91bmRJZCk7XG4gIG5ld0VsZXMgPSBuZXdFbGVzLnVuaW9uKG5ld0NvbXBvdW5kKTtcbiAgcmV0dXJuIG5ld0VsZXM7XG59O1xuXG4vKlxuICogQ3JlYXRlcyBhIHRlbXBsYXRlIHJlYWN0aW9uIHdpdGggZ2l2ZW4gcGFyYW1ldGVycy4gUmVxdWlyZXMgY29zZS1iaWxrZW50IGxheW91dCB0byB0aWxlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzIGluY2x1ZGVkXG4gKiBpbiB0aGUgY29tcGxleC4gUGFyYW1ldGVycyBhcmUgZXhwbGFpbmVkIGJlbG93LlxuICogdGVtcGxhdGVUeXBlOiBUaGUgdHlwZSBvZiB0aGUgdGVtcGxhdGUgcmVhY3Rpb24uIEl0IG1heSBiZSAnYXNzb2NpYXRpb24nIG9yICdkaXNzb2NpYXRpb24nIGZvciBub3cuXG4gKiBtYWNyb21vbGVjdWxlTGlzdDogVGhlIGxpc3Qgb2YgdGhlIG5hbWVzIG9mIG1hY3JvbW9sZWN1bGVzIHdoaWNoIHdpbGwgaW52b2x2ZSBpbiB0aGUgcmVhY3Rpb24uXG4gKiBjb21wbGV4TmFtZTogVGhlIG5hbWUgb2YgdGhlIGNvbXBsZXggaW4gdGhlIHJlYWN0aW9uLlxuICogcHJvY2Vzc1Bvc2l0aW9uOiBUaGUgbW9kYWwgcG9zaXRpb24gb2YgdGhlIHByb2Nlc3MgaW4gdGhlIHJlYWN0aW9uLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyB0aGUgY2VudGVyIG9mIHRoZSBjYW52YXMuXG4gKiB0aWxpbmdQYWRkaW5nVmVydGljYWw6IFRoaXMgb3B0aW9uIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBjb3NlLWJpbGtlbnQgbGF5b3V0IHdpdGggdGhlIHNhbWUgbmFtZS4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgMTUuXG4gKiB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cbiAqIGVkZ2VMZW5ndGg6IFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBwcm9jZXNzIGFuZCB0aGUgbWFjcm9tb2xlY3VsZXMgYXQgdGhlIGJvdGggc2lkZXMuXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKSB7XG4gIHZhciBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbXCJtYWNyb21vbGVjdWxlXCJdO1xuICB2YXIgdGVtcGxhdGVUeXBlID0gdGVtcGxhdGVUeXBlO1xuICB2YXIgcHJvY2Vzc1dpZHRoID0gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1t0ZW1wbGF0ZVR5cGVdID8gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1t0ZW1wbGF0ZVR5cGVdLndpZHRoIDogNTA7XG4gIHZhciBtYWNyb21vbGVjdWxlV2lkdGggPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA/IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLndpZHRoIDogNTA7XG4gIHZhciBtYWNyb21vbGVjdWxlSGVpZ2h0ID0gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMgPyBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcy5oZWlnaHQgOiA1MDtcbiAgdmFyIHByb2Nlc3NQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbiA/IHByb2Nlc3NQb3NpdGlvbiA6IGVsZW1lbnRVdGlsaXRpZXMuY29udmVydFRvTW9kZWxQb3NpdGlvbih7eDogY3kud2lkdGgoKSAvIDIsIHk6IGN5LmhlaWdodCgpIC8gMn0pO1xuICB2YXIgbWFjcm9tb2xlY3VsZUxpc3QgPSBtYWNyb21vbGVjdWxlTGlzdDtcbiAgdmFyIGNvbXBsZXhOYW1lID0gY29tcGxleE5hbWU7XG4gIHZhciBudW1PZk1hY3JvbW9sZWN1bGVzID0gbWFjcm9tb2xlY3VsZUxpc3QubGVuZ3RoO1xuICB2YXIgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsID0gdGlsaW5nUGFkZGluZ1ZlcnRpY2FsID8gdGlsaW5nUGFkZGluZ1ZlcnRpY2FsIDogMTU7XG4gIHZhciB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA9IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID8gdGlsaW5nUGFkZGluZ0hvcml6b250YWwgOiAxNTtcbiAgdmFyIGVkZ2VMZW5ndGggPSBlZGdlTGVuZ3RoID8gZWRnZUxlbmd0aCA6IDYwO1xuXG4gIGN5LnN0YXJ0QmF0Y2goKTtcblxuICB2YXIgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXM7XG4gIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xuICB9XG4gIGVsc2Uge1xuICAgIHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG4gIH1cblxuICAvL0NyZWF0ZSB0aGUgcHJvY2VzcyBpbiB0ZW1wbGF0ZSB0eXBlXG4gIHZhciBwcm9jZXNzID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwgdGVtcGxhdGVUeXBlKTtcbiAgcHJvY2Vzcy5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAvL0RlZmluZSB0aGUgc3RhcnRpbmcgeSBwb3NpdGlvblxuICB2YXIgeVBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSAoKG51bU9mTWFjcm9tb2xlY3VsZXMgLSAxKSAvIDIpICogKG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWwpO1xuXG4gIC8vQ3JlYXRlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtT2ZNYWNyb21vbGVjdWxlczsgaSsrKSB7XG4gICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMsIHlQb3NpdGlvbiwgXCJtYWNyb21vbGVjdWxlXCIpO1xuICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgbmV3Tm9kZS5kYXRhKCdsYWJlbCcsIG1hY3JvbW9sZWN1bGVMaXN0W2ldKTtcblxuICAgIC8vY3JlYXRlIHRoZSBlZGdlIGNvbm5lY3RlZCB0byB0aGUgbmV3IG1hY3JvbW9sZWN1bGVcbiAgICB2YXIgbmV3RWRnZTtcbiAgICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XG4gICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKG5ld05vZGUuaWQoKSwgcHJvY2Vzcy5pZCgpLCAnY29uc3VtcHRpb24nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgbmV3Tm9kZS5pZCgpLCAncHJvZHVjdGlvbicpO1xuICAgIH1cblxuICAgIG5ld0VkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAvL3VwZGF0ZSB0aGUgeSBwb3NpdGlvblxuICAgIHlQb3NpdGlvbiArPSBtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xuICB9XG5cbiAgLy9DcmVhdGUgdGhlIGNvbXBsZXggaW5jbHVkaW5nIG1hY3JvbW9sZWN1bGVzIGluc2lkZSBvZiBpdFxuICAvL1RlbXByb3JhcmlseSBhZGQgaXQgdG8gdGhlIHByb2Nlc3MgcG9zaXRpb24gd2Ugd2lsbCBtb3ZlIGl0IGFjY29yZGluZyB0byB0aGUgbGFzdCBzaXplIG9mIGl0XG4gIHZhciBjb21wbGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwgJ2NvbXBsZXgnKTtcbiAgY29tcGxleC5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgY29tcGxleC5kYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJywgdHJ1ZSk7XG5cbiAgLy9JZiBhIG5hbWUgaXMgc3BlY2lmaWVkIGZvciB0aGUgY29tcGxleCBzZXQgaXRzIGxhYmVsIGFjY29yZGluZ2x5XG4gIGlmIChjb21wbGV4TmFtZSkge1xuICAgIGNvbXBsZXguZGF0YSgnbGFiZWwnLCBjb21wbGV4TmFtZSk7XG4gIH1cblxuICAvL2NyZWF0ZSB0aGUgZWRnZSBjb25ubmVjdGVkIHRvIHRoZSBjb21wbGV4XG4gIHZhciBlZGdlT2ZDb21wbGV4O1xuICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XG4gICAgZWRnZU9mQ29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIGNvbXBsZXguaWQoKSwgJ3Byb2R1Y3Rpb24nKTtcbiAgfVxuICBlbHNlIHtcbiAgICBlZGdlT2ZDb21wbGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKGNvbXBsZXguaWQoKSwgcHJvY2Vzcy5pZCgpLCAnY29uc3VtcHRpb24nKTtcbiAgfVxuICBlZGdlT2ZDb21wbGV4LmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gIC8vQ3JlYXRlIHRoZSBtYWNyb21vbGVjdWxlcyBpbnNpZGUgdGhlIGNvbXBsZXhcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1PZk1hY3JvbW9sZWN1bGVzOyBpKyspIHtcbiAgICAvLyBBZGQgYSBtYWNyb21vbGVjdWxlIG5vdCBoYXZpbmcgYSBwcmV2aW91c2x5IGRlZmluZWQgaWQgYW5kIGhhdmluZyB0aGUgY29tcGxleCBjcmVhdGVkIGluIHRoaXMgcmVhY3Rpb24gYXMgcGFyZW50XG4gICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoY29tcGxleC5wb3NpdGlvbigneCcpLCBjb21wbGV4LnBvc2l0aW9uKCd5JyksIFwibWFjcm9tb2xlY3VsZVwiLCB1bmRlZmluZWQsIGNvbXBsZXguaWQoKSk7XG4gICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgbWFjcm9tb2xlY3VsZUxpc3RbaV0pO1xuICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkTGF5b3V0Tm9kZScsIHRydWUpO1xuICB9XG4gIFxuICBjeS5lbmRCYXRjaCgpO1xuXG4gIHZhciBsYXlvdXROb2RlcyA9IGN5Lm5vZGVzKCdbanVzdEFkZGVkTGF5b3V0Tm9kZV0nKTtcbiAgbGF5b3V0Tm9kZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkTGF5b3V0Tm9kZScpO1xuICB2YXIgbGF5b3V0ID0gbGF5b3V0Tm9kZXMubGF5b3V0KHtcbiAgICBuYW1lOiAnY29zZS1iaWxrZW50JyxcbiAgICByYW5kb21pemU6IGZhbHNlLFxuICAgIGZpdDogZmFsc2UsXG4gICAgYW5pbWF0ZTogZmFsc2UsXG4gICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXG4gICAgdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLFxuICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vcmUtcG9zaXRpb24gdGhlIG5vZGVzIGluc2lkZSB0aGUgY29tcGxleFxuICAgICAgdmFyIHN1cHBvc2VkWFBvc2l0aW9uO1xuICAgICAgdmFyIHN1cHBvc2VkWVBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnk7XG5cbiAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICAgICAgc3VwcG9zZWRYUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgY29tcGxleC5vdXRlcldpZHRoKCkgLyAyO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHN1cHBvc2VkWFBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIGNvbXBsZXgub3V0ZXJXaWR0aCgpIC8gMjtcbiAgICAgIH1cblxuICAgICAgdmFyIHBvc2l0aW9uRGlmZlggPSBzdXBwb3NlZFhQb3NpdGlvbiAtIGNvbXBsZXgucG9zaXRpb24oJ3gnKTtcbiAgICAgIHZhciBwb3NpdGlvbkRpZmZZID0gc3VwcG9zZWRZUG9zaXRpb24gLSBjb21wbGV4LnBvc2l0aW9uKCd5Jyk7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyh7eDogcG9zaXRpb25EaWZmWCwgeTogcG9zaXRpb25EaWZmWX0sIGNvbXBsZXgpO1xuICAgIH1cbiAgfSk7XG4gIFxuICAvLyBEbyB0aGlzIGNoZWNrIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICBpZiAobGF5b3V0ICYmIGxheW91dC5ydW4pIHtcbiAgICBsYXlvdXQucnVuKCk7XG4gIH1cblxuICAvL2ZpbHRlciB0aGUganVzdCBhZGRlZCBlbGVtZW10cyB0byByZXR1cm4gdGhlbSBhbmQgcmVtb3ZlIGp1c3QgYWRkZWQgbWFya1xuICB2YXIgZWxlcyA9IGN5LmVsZW1lbnRzKCdbanVzdEFkZGVkXScpO1xuICBlbGVzLnJlbW92ZURhdGEoJ2p1c3RBZGRlZCcpO1xuICBcbiAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICBlbGVzLnNlbGVjdCgpO1xuICBcbiAgcmV0dXJuIGVsZXM7IC8vIFJldHVybiB0aGUganVzdCBhZGRlZCBlbGVtZW50c1xufTtcblxuLypcbiAqIE1vdmUgdGhlIG5vZGVzIHRvIGEgbmV3IHBhcmVudCBhbmQgY2hhbmdlIHRoZWlyIHBvc2l0aW9uIGlmIHBvc3NEaWZmIHBhcmFtcyBhcmUgc2V0LlxuICovXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZVBhcmVudCA9IGZ1bmN0aW9uKG5vZGVzLCBuZXdQYXJlbnQsIHBvc0RpZmZYLCBwb3NEaWZmWSkge1xuICB2YXIgbmV3UGFyZW50SWQgPSBuZXdQYXJlbnQgPT0gdW5kZWZpbmVkIHx8IHR5cGVvZiBuZXdQYXJlbnQgPT09ICdzdHJpbmcnID8gbmV3UGFyZW50IDogbmV3UGFyZW50LmlkKCk7XG4gIHZhciBtb3ZlZEVsZXMgPSBub2Rlcy5tb3ZlKHtcInBhcmVudFwiOiBuZXdQYXJlbnRJZH0pO1xuICBpZih0eXBlb2YgcG9zRGlmZlggIT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHBvc0RpZmZZICE9ICd1bmRlZmluZWQnKSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5tb3ZlTm9kZXMoe3g6IHBvc0RpZmZYLCB5OiBwb3NEaWZmWX0sIG5vZGVzKTtcbiAgfVxuICBlbGVtZW50VXRpbGl0aWVzLm1haW50YWluUG9pbnRlcihtb3ZlZEVsZXMpO1xuICByZXR1cm4gbW92ZWRFbGVzO1xufTtcblxuLy8gUmVzaXplIGdpdmVuIG5vZGVzIGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeSBvbmUgb2Ygd2lkdGggb3IgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0LlxuZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uIChub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8pIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIHJhdGlvID0gdW5kZWZpbmVkO1xuICAgIHZhciBlbGVNdXN0QmVTcXVhcmUgPSBlbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZShub2RlLmRhdGEoJ2NsYXNzJykpO1xuXG4gICAgLy8gTm90ZSB0aGF0IGJvdGggd2lkdGggYW5kIGhlaWdodCBzaG91bGQgbm90IGJlIHNldCBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHlcbiAgICBpZiAod2lkdGgpIHtcbiAgICAgIGlmICh1c2VBc3BlY3RSYXRpbyB8fCBlbGVNdXN0QmVTcXVhcmUpIHtcbiAgICAgICAgcmF0aW8gPSB3aWR0aCAvIG5vZGUud2lkdGgoKTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gd2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKGhlaWdodCkge1xuICAgICAgaWYgKHVzZUFzcGVjdFJhdGlvIHx8IGVsZU11c3RCZVNxdWFyZSkge1xuICAgICAgICByYXRpbyA9IGhlaWdodCAvIG5vZGUuaGVpZ2h0KCk7XG4gICAgICB9XG5cbiAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IGhlaWdodDtcbiAgICB9XG5cbiAgICBpZiAocmF0aW8gJiYgIWhlaWdodCkge1xuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gbm9kZS5oZWlnaHQoKSAqIHJhdGlvO1xuICAgIH1cbiAgICBlbHNlIGlmIChyYXRpbyAmJiAhd2lkdGgpIHtcbiAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IG5vZGUud2lkdGgoKSAqIHJhdGlvO1xuICAgIH1cbiAgfVxufTtcblxuLy8gU2VjdGlvbiBFbmRcbi8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXG5cbi8vIFNlY3Rpb24gU3RhcnRcbi8vIENvbW1vbiBlbGVtZW50IHByb3BlcnRpZXNcblxuLy8gR2V0IGNvbW1vbiBwcm9wZXJ0aWVzIG9mIGdpdmVuIGVsZW1lbnRzLiBSZXR1cm5zIG51bGwgaWYgdGhlIGdpdmVuIGVsZW1lbnQgbGlzdCBpcyBlbXB0eSBvciB0aGVcbi8vIHByb3BlcnR5IGlzIG5vdCBjb21tb24gZm9yIGFsbCBlbGVtZW50cy4gZGF0YU9yQ3NzIHBhcmFtZXRlciBzcGVjaWZ5IHdoZXRoZXIgdG8gY2hlY2sgdGhlIHByb3BlcnR5IG9uIGRhdGEgb3IgY3NzLlxuLy8gVGhlIGRlZmF1bHQgdmFsdWUgZm9yIGl0IGlzIGRhdGEuIElmIHByb3BlcnR5TmFtZSBwYXJhbWV0ZXIgaXMgZ2l2ZW4gYXMgYSBmdW5jdGlvbiBpbnN0ZWFkIG9mIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgXG4vLyBwcm9wZXJ0eSBuYW1lIHRoZW4gdXNlIHdoYXQgdGhhdCBmdW5jdGlvbiByZXR1cm5zLlxuZWxlbWVudFV0aWxpdGllcy5nZXRDb21tb25Qcm9wZXJ0eSA9IGZ1bmN0aW9uIChlbGVtZW50cywgcHJvcGVydHlOYW1lLCBkYXRhT3JDc3MpIHtcbiAgaWYgKGVsZW1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgaXNGdW5jdGlvbjtcbiAgLy8gSWYgd2UgYXJlIG5vdCBjb21wYXJpbmcgdGhlIHByb3BlcnRpZXMgZGlyZWN0bHkgdXNlcnMgY2FuIHNwZWNpZnkgYSBmdW5jdGlvbiBhcyB3ZWxsXG4gIGlmICh0eXBlb2YgcHJvcGVydHlOYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaXNGdW5jdGlvbiA9IHRydWU7XG4gIH1cblxuICAvLyBVc2UgZGF0YSBhcyBkZWZhdWx0XG4gIGlmICghaXNGdW5jdGlvbiAmJiAhZGF0YU9yQ3NzKSB7XG4gICAgZGF0YU9yQ3NzID0gJ2RhdGEnO1xuICB9XG5cbiAgdmFyIHZhbHVlID0gaXNGdW5jdGlvbiA/IHByb3BlcnR5TmFtZShlbGVtZW50c1swXSkgOiBlbGVtZW50c1swXVtkYXRhT3JDc3NdKHByb3BlcnR5TmFtZSk7XG5cbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGlmICggKCBpc0Z1bmN0aW9uID8gcHJvcGVydHlOYW1lKGVsZW1lbnRzW2ldKSA6IGVsZW1lbnRzW2ldW2RhdGFPckNzc10ocHJvcGVydHlOYW1lKSApICE9IHZhbHVlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59O1xuXG4vLyBSZXR1cm5zIGlmIHRoZSBmdW5jdGlvbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlIGZvciBhbGwgb2YgdGhlIGdpdmVuIGVsZW1lbnRzLlxuZWxlbWVudFV0aWxpdGllcy50cnVlRm9yQWxsRWxlbWVudHMgPSBmdW5jdGlvbiAoZWxlbWVudHMsIGZjbikge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFmY24oZWxlbWVudHNbaV0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBjYW4gaGF2ZSBzYmduY2FyZGluYWxpdHlcbmVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05DYXJkaW5hbGl0eSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgcmV0dXJuIGVsZS5kYXRhKCdjbGFzcycpID09ICdjb25zdW1wdGlvbicgfHwgZWxlLmRhdGEoJ2NsYXNzJykgPT0gJ3Byb2R1Y3Rpb24nO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgY2FuIGhhdmUgc2JnbmxhYmVsXG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOTGFiZWwgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuXG4gIHJldHVybiBzYmduY2xhc3MgIT0gJ2FuZCcgJiYgc2JnbmNsYXNzICE9ICdvcicgJiYgc2JnbmNsYXNzICE9ICdub3QnICYmIHNiZ25jbGFzcyAhPSAnZGVsYXknXG4gICAgICAgICAgJiYgc2JnbmNsYXNzICE9ICdhc3NvY2lhdGlvbicgJiYgc2JnbmNsYXNzICE9ICdkaXNzb2NpYXRpb24nICYmICFzYmduY2xhc3MuZW5kc1dpdGgoJ3Byb2Nlc3MnKTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZSBlbGVtZW50IGhhdmUgdW5pdCBvZiBpbmZvcm1hdGlvblxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlVW5pdE9mSW5mb3JtYXRpb24gPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuXG4gIGlmIChzYmduY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUnIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4JyB8fCBzYmduY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCBtdWx0aW1lcidcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUgbXVsdGltZXInIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUgbXVsdGltZXInXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4IG11bHRpbWVyJyB8fCAoc2JnbmNsYXNzLnN0YXJ0c1dpdGgoJ0JBJykgJiYgc2JnbmNsYXNzICE9IFwiQkEgcGxhaW5cIilcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBhcnRtZW50Jykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBjYW4gaGF2ZSBtb3JlIHRoYW4gb25lIHVuaXRzIG9mIGluZm9ybWF0aW9uXG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVNdWx0aXBsZVVuaXRPZkluZm9ybWF0aW9uID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcbiAgcmV0dXJuICFzYmduY2xhc3Muc3RhcnRzV2l0aCgnQkEnKTtcbn07XG5cblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgaGF2ZSBzdGF0ZSB2YXJpYWJsZVxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU3RhdGVWYXJpYWJsZSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgaWYgKHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZScgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXgnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlIG11bHRpbWVyJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCBtdWx0aW1lcicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZSBzaG91bGQgYmUgc3F1YXJlIGluIHNoYXBlXG5lbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgcmV0dXJuIChzYmduY2xhc3MuaW5kZXhPZigncHJvY2VzcycpICE9IC0xIHx8IHNiZ25jbGFzcyA9PSAnc291cmNlIGFuZCBzaW5rJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYW5kJyB8fCBzYmduY2xhc3MgPT0gJ29yJyB8fCBzYmduY2xhc3MgPT0gJ25vdCdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2Fzc29jaWF0aW9uJyB8fCBzYmduY2xhc3MgPT0gJ2Rpc3NvY2lhdGlvbicgfHwgc2JnbmNsYXNzID09ICdkZWxheScpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIGFueSBvZiB0aGUgZ2l2ZW4gbm9kZXMgbXVzdCBub3QgYmUgaW4gc3F1YXJlIHNoYXBlXG5lbGVtZW50VXRpbGl0aWVzLnNvbWVNdXN0Tm90QmVTcXVhcmUgPSBmdW5jdGlvbiAobm9kZXMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZShub2RlLmRhdGEoJ2NsYXNzJykpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVzIGVsZW1lbnQgY2FuIGJlIGNsb25lZFxuZWxlbWVudFV0aWxpdGllcy5jYW5CZUNsb25lZCA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuXG4gIHZhciBsaXN0ID0ge1xuICAgICd1bnNwZWNpZmllZCBlbnRpdHknOiB0cnVlLFxuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcbiAgICAnY29tcGxleCc6IHRydWUsXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcbiAgICAncGVydHVyYmluZyBhZ2VudCc6IHRydWVcbiAgfTtcblxuICByZXR1cm4gbGlzdFtzYmduY2xhc3NdID8gdHJ1ZSA6IGZhbHNlO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlcyBlbGVtZW50IGNhbiBiZSBjbG9uZWRcbmVsZW1lbnRVdGlsaXRpZXMuY2FuQmVNdWx0aW1lciA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuXG4gIHZhciBsaXN0ID0ge1xuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcbiAgICAnY29tcGxleCc6IHRydWUsXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZVxuICB9O1xuXG4gIHJldHVybiBsaXN0W3NiZ25jbGFzc10gPyB0cnVlIDogZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgaXMgYW4gRVBOXG5lbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcblxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAndW5zcGVjaWZpZWQgZW50aXR5J1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZSdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCcpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGVtZW50IGlzIGEgUE5cbmVsZW1lbnRVdGlsaXRpZXMuaXNQTkNsYXNzID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XG5cbiAgcmV0dXJuIChzYmduY2xhc3MgPT0gJ3Byb2Nlc3MnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdvbWl0dGVkIHByb2Nlc3MnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICd1bmNlcnRhaW4gcHJvY2VzcydcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2Fzc29jaWF0aW9uJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnZGlzc29jaWF0aW9uJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAncGhlbm90eXBlJyk7XG59O1xuXG4vLyBSZXR1cm5zIHdldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBvciBzdHJpbmcgaXMgb2YgdGhlIHNwZWNpYWwgZW1wdHkgc2V0L3NvdXJjZSBhbmQgc2luayBjbGFzc1xuZWxlbWVudFV0aWxpdGllcy5pc0VtcHR5U2V0Q2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcbiAgcmV0dXJuIHNiZ25jbGFzcyA9PSAnc291cmNlIGFuZCBzaW5rJztcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhIGxvZ2ljYWwgb3BlcmF0b3JcbmVsZW1lbnRVdGlsaXRpZXMuaXNMb2dpY2FsT3BlcmF0b3IgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAnYW5kJyB8fCBzYmduY2xhc3MgPT0gJ29yJyB8fCBzYmduY2xhc3MgPT0gJ25vdCcgfHwgc2JnbmNsYXNzID09ICdkZWxheScpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBjbGFzcyBvZiBnaXZlbiBlbGVtZW50IGlzIGEgZXF1aXZhbGFuY2UgY2xhc3NcbmVsZW1lbnRVdGlsaXRpZXMuY29udmVuaWVudFRvRXF1aXZhbGVuY2UgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAndGFnJyB8fCBzYmduY2xhc3MgPT0gJ3Rlcm1pbmFsJyk7XG59O1xuXG4vLyBSZXR1cm5zIHdldGhlciB0aGUgY2xhc3Mgb2YgZ2l2ZW4gZWxlbW50IGlzIGEgbW9kdWxhdGlvbiBhcmMgYXMgZGVmaW5lZCBpbiBQRCBzcGVjc1xuZWxlbWVudFV0aWxpdGllcy5pc01vZHVsYXRpb25BcmNDbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG4gIHJldHVybiAoc2JnbmNsYXNzID09ICdtb2R1bGF0aW9uJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnc3RpbXVsYXRpb24nIHx8IHNiZ25jbGFzcyA9PSAnY2F0YWx5c2lzJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnaW5oaWJpdGlvbicgfHwgc2JnbmNsYXNzID09ICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKTtcbn1cblxuLy8gUmVsb2NhdGVzIHN0YXRlIGFuZCBpbmZvIGJveGVzLiBUaGlzIGZ1bmN0aW9uIGlzIGV4cGVjdGVkIHRvIGJlIGNhbGxlZCBhZnRlciBhZGQvcmVtb3ZlIHN0YXRlIGFuZCBpbmZvIGJveGVzXG5lbGVtZW50VXRpbGl0aWVzLnJlbG9jYXRlU3RhdGVBbmRJbmZvcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHN0YXRlQW5kSW5mb3MgPSAoZWxlLmlzTm9kZSAmJiBlbGUuaXNOb2RlKCkpID8gZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykgOiBlbGU7XG4gIHZhciBsZW5ndGggPSBzdGF0ZUFuZEluZm9zLmxlbmd0aDtcbiAgaWYgKGxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVsc2UgaWYgKGxlbmd0aCA9PSAxKSB7XG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAwO1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuICB9XG4gIGVsc2UgaWYgKGxlbmd0aCA9PSAyKSB7XG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAwO1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAwO1xuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC55ID0gNTA7XG4gIH1cbiAgZWxzZSBpZiAobGVuZ3RoID09IDMpIHtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IC0yNTtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcblxuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSAtNTA7XG5cbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IDA7XG4gICAgc3RhdGVBbmRJbmZvc1syXS5iYm94LnkgPSA1MDtcbiAgfVxuICBlbHNlIHtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IC0yNTtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcblxuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSAtNTA7XG5cbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IC0yNTtcbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xuXG4gICAgc3RhdGVBbmRJbmZvc1szXS5iYm94LnggPSAyNTtcbiAgICBzdGF0ZUFuZEluZm9zWzNdLmJib3gueSA9IDUwO1xuICB9XG59O1xuXG4vLyBDaGFuZ2Ugc3RhdGUgdmFsdWUgb3IgdW5pdCBvZiBpbmZvcm1hdGlvbiBib3ggb2YgZ2l2ZW4gbm9kZXMgd2l0aCBnaXZlbiBpbmRleC5cbi8vIFR5cGUgcGFyYW1ldGVyIGluZGljYXRlcyB3aGV0aGVyIHRvIGNoYW5nZSB2YWx1ZSBvciB2YXJpYWJsZSwgaXQgaXMgdmFsaWQgaWYgdGhlIGJveCBhdCB0aGUgZ2l2ZW4gaW5kZXggaXMgYSBzdGF0ZSB2YXJpYWJsZS5cbi8vIFZhbHVlIHBhcmFtZXRlciBpcyB0aGUgbmV3IHZhbHVlIHRvIHNldC5cbi8vIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIG9sZCB2YWx1ZSBvZiB0aGUgY2hhbmdlZCBkYXRhIChXZSBhc3N1bWUgdGhhdCB0aGUgb2xkIHZhbHVlIG9mIHRoZSBjaGFuZ2VkIGRhdGEgd2FzIHRoZSBzYW1lIGZvciBhbGwgbm9kZXMpLlxuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XG4gIHZhciByZXN1bHQ7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xuICAgIHZhciBib3ggPSBzdGF0ZUFuZEluZm9zW2luZGV4XTtcblxuICAgIGlmIChib3guY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7XG4gICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICByZXN1bHQgPSBib3guc3RhdGVbdHlwZV07XG4gICAgICB9XG5cbiAgICAgIGJveC5zdGF0ZVt0eXBlXSA9IHZhbHVlO1xuICAgIH1cbiAgICBlbHNlIGlmIChib3guY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdCA9IGJveC5sYWJlbC50ZXh0O1xuICAgICAgfVxuXG4gICAgICBib3gubGFiZWwudGV4dCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXG4vLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxuLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGp1c3QgYWRkZWQgYm94LlxuZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2Rlcywgb2JqKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuXG4gICAgdmFyIGxvY2F0aW9uT2JqO1xuICAgIGlmKG9iai5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xuICAgICAgaWYgKCFub2RlLmRhdGEoXCJsYW5ndWFnZVwiKSB8fCBub2RlLmRhdGEoXCJsYW5ndWFnZVwiKSA9PSBcIlBEXCIpe1xuICAgICAgICBsb2NhdGlvbk9iaiA9IHNiZ252aXouY2xhc3Nlcy5Vbml0T2ZJbmZvcm1hdGlvbi5jcmVhdGUobm9kZSwgb2JqLmxhYmVsLnRleHQsIG9iai5iYm94LCBvYmoubG9jYXRpb24sIG9iai5wb3NpdGlvbiwgb2JqLmluZGV4KTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKG5vZGUuZGF0YShcImxhbmd1YWdlXCIpID09IFwiQUZcIil7XG4gICAgICAgIGxvY2F0aW9uT2JqID0gc2JnbnZpei5jbGFzc2VzLlVuaXRPZkluZm9ybWF0aW9uLmNyZWF0ZShub2RlLCBvYmoubGFiZWwudGV4dCwgb2JqLmJib3gsIG9iai5sb2NhdGlvbiwgb2JqLnBvc2l0aW9uLCBvYmouaW5kZXgsXG4gICAgICAgICAgICBsaWJzLmN5dG9zY2FwZS5zYmduLkFmU2hhcGVGbiwgbGlicy5jeXRvc2NhcGUuc2Jnbi5BZlNoYXBlQXJnc0ZuKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAob2JqLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikge1xuICAgICAgbG9jYXRpb25PYmogPSBzYmdudml6LmNsYXNzZXMuU3RhdGVWYXJpYWJsZS5jcmVhdGUobm9kZSwgb2JqLnN0YXRlLnZhbHVlLCBvYmouc3RhdGUudmFyaWFibGUsIG9iai5iYm94LCBvYmoubG9jYXRpb24sIG9iai5wb3NpdGlvbiwgb2JqLmluZGV4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxvY2F0aW9uT2JqO1xufTtcblxuLy8gUmVtb3ZlIHRoZSBzdGF0ZSBvciBpbmZvIGJveGVzIG9mIHRoZSBnaXZlbiBub2RlcyBhdCBnaXZlbiBpbmRleC5cbi8vIFJldHVybnMgdGhlIHJlbW92ZWQgYm94LlxuZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2RlcywgbG9jYXRpb25PYmopIHtcbiAgdmFyIG9iajtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XG4gICAgdmFyIHVuaXQgPSBzdGF0ZUFuZEluZm9zW2xvY2F0aW9uT2JqLmluZGV4XTtcblxuICAgIG9iaiA9IHVuaXQucmVtb3ZlKCk7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxuLy8gU2V0IG11bHRpbWVyIHN0YXR1cyBvZiB0aGUgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cbmVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMgPSBmdW5jdGlvbiAobm9kZXMsIHN0YXR1cykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgc2JnbmNsYXNzID0gbm9kZS5kYXRhKCdjbGFzcycpO1xuICAgIHZhciBpc011bHRpbWVyID0gbm9kZS5kYXRhKCdjbGFzcycpLmVuZHNXaXRoKCcgbXVsdGltZXInKTtcblxuICAgIGlmIChzdGF0dXMpIHsgLy8gTWFrZSBtdWx0aW1lciBzdGF0dXMgdHJ1ZVxuICAgICAgaWYgKCFpc011bHRpbWVyKSB7XG4gICAgICAgIG5vZGUuZGF0YSgnY2xhc3MnLCBzYmduY2xhc3MgKyAnIG11bHRpbWVyJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgeyAvLyBNYWtlIG11bHRpbWVyIHN0YXR1cyBmYWxzZVxuICAgICAgaWYgKGlzTXVsdGltZXIpIHtcbiAgICAgICAgbm9kZS5kYXRhKCdjbGFzcycsIHNiZ25jbGFzcy5yZXBsYWNlKCcgbXVsdGltZXInLCAnJykpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuLy8gU2V0IGNsb25lIG1hcmtlciBzdGF0dXMgb2YgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cbmVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbiAobm9kZXMsIHN0YXR1cykge1xuICBpZiAoc3RhdHVzKSB7XG4gICAgbm9kZXMuZGF0YSgnY2xvbmVtYXJrZXInLCB0cnVlKTtcbiAgfVxuICBlbHNlIHtcbiAgICBub2Rlcy5yZW1vdmVEYXRhKCdjbG9uZW1hcmtlcicpO1xuICB9XG59O1xuXG4vL2VsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbigpXG5cbi8vIENoYW5nZSBmb250IHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIGVsZW1lbnRzIHdpdGggZ2l2ZW4gZm9udCBkYXRhXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKGVsZXMsIGRhdGEpIHtcbiAgZm9yICh2YXIgcHJvcCBpbiBkYXRhKSB7XG4gICAgZWxlcy5kYXRhKHByb3AsIGRhdGFbcHJvcF0pO1xuICB9XG59O1xuXG4vLyBUaGlzIGZ1bmN0aW9uIGdldHMgYW4gZWRnZSwgYW5kIGVuZHMgb2YgdGhhdCBlZGdlIChPcHRpb25hbGx5IGl0IG1heSB0YWtlIGp1c3QgdGhlIGNsYXNzZXMgb2YgdGhlIGVkZ2UgYXMgd2VsbCkgYXMgcGFyYW1ldGVycy5cbi8vIEl0IG1heSByZXR1cm4gJ3ZhbGlkJyAodGhhdCBlbmRzIGlzIHZhbGlkIGZvciB0aGF0IGVkZ2UpLCAncmV2ZXJzZScgKHRoYXQgZW5kcyBpcyBub3QgdmFsaWQgZm9yIHRoYXQgZWRnZSBidXQgdGhleSB3b3VsZCBiZSB2YWxpZCBcbi8vIGlmIHlvdSByZXZlcnNlIHRoZSBzb3VyY2UgYW5kIHRhcmdldCksICdpbnZhbGlkJyAodGhhdCBlbmRzIGFyZSB0b3RhbGx5IGludmFsaWQgZm9yIHRoYXQgZWRnZSkuXG5lbGVtZW50VXRpbGl0aWVzLnZhbGlkYXRlQXJyb3dFbmRzID0gZnVuY3Rpb24gKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0KSB7XG4gIC8vIGlmIG1hcCB0eXBlIGlzIFVua25vd24gLS0gbm8gcnVsZXMgYXBwbGllZFxuICBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgPT0gXCJVbmtub3duXCIgfHwgIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKVxuICAgIHJldHVybiBcInZhbGlkXCI7XG5cbiAgdmFyIGVkZ2VjbGFzcyA9IHR5cGVvZiBlZGdlID09PSAnc3RyaW5nJyA/IGVkZ2UgOiBlZGdlLmRhdGEoJ2NsYXNzJyk7XG4gIHZhciBzb3VyY2VjbGFzcyA9IHNvdXJjZS5kYXRhKCdjbGFzcycpO1xuICB2YXIgdGFyZ2V0Y2xhc3MgPSB0YXJnZXQuZGF0YSgnY2xhc3MnKTtcblxuICBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgPT0gXCJBRlwiKXtcbiAgICBpZiAoc291cmNlY2xhc3Muc3RhcnRzV2l0aChcIkJBXCIpKSAvLyB3ZSBoYXZlIHNlcGFyYXRlIGNsYXNzZXMgZm9yIGVhY2ggYmlvbG9naWNhbCBhY3Rpdml0eVxuICAgICAgc291cmNlY2xhc3MgPSBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjsgLy8gYnV0IHNhbWUgcnVsZSBhcHBsaWVzIHRvIGFsbCBvZiB0aGVtXG5cbiAgICBpZiAodGFyZ2V0Y2xhc3Muc3RhcnRzV2l0aChcIkJBXCIpKSAvLyB3ZSBoYXZlIHNlcGFyYXRlIGNsYXNzZXMgZm9yIGVhY2ggYmlvbG9naWNhbCBhY3Rpdml0eVxuICAgICAgdGFyZ2V0Y2xhc3MgPSBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjsgLy8gYnV0IHNhbWUgcnVsZSBhcHBsaWVzIHRvIGFsbCBvZiB0aGVtXG5cbiAgICB2YXIgZWRnZUNvbnN0cmFpbnRzID0gdGhpcy5BRi5jb25uZWN0aXZpdHlDb25zdHJhaW50c1tlZGdlY2xhc3NdO1xuICB9XG4gIGVsc2V7XG4gICAgc291cmNlY2xhc3MgPSBzb3VyY2VjbGFzcy5yZXBsYWNlKC9cXHMqbXVsdGltZXIkLywgJycpXG4gICAgdGFyZ2V0Y2xhc3MgPSB0YXJnZXRjbGFzcy5yZXBsYWNlKC9cXHMqbXVsdGltZXIkLywgJycpXG4gICAgdmFyIGVkZ2VDb25zdHJhaW50cyA9IHRoaXMuUEQuY29ubmVjdGl2aXR5Q29uc3RyYWludHNbZWRnZWNsYXNzXTtcbiAgfVxuICAvLyBnaXZlbiBhIG5vZGUsIGFjdGluZyBhcyBzb3VyY2Ugb3IgdGFyZ2V0LCByZXR1cm5zIGJvb2xlYW4gd2V0aGVyIG9yIG5vdCBpdCBoYXMgdG9vIG1hbnkgZWRnZXMgYWxyZWFkeVxuICBmdW5jdGlvbiBoYXNUb29NYW55RWRnZXMobm9kZSwgc291cmNlT3JUYXJnZXQpIHtcbiAgICB2YXIgbm9kZWNsYXNzID0gbm9kZS5kYXRhKCdjbGFzcycpO1xuICAgIG5vZGVjbGFzcyA9IG5vZGVjbGFzcy5yZXBsYWNlKC9cXHMqbXVsdGltZXIkLywgJycpO1xuICAgIGlmIChub2RlY2xhc3Muc3RhcnRzV2l0aChcIkJBXCIpKVxuICAgICAgbm9kZWNsYXNzID0gXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI7XG5cbiAgICB2YXIgdG90YWxUb29NYW55ID0gdHJ1ZTtcbiAgICB2YXIgZWRnZVRvb01hbnkgPSB0cnVlO1xuICAgIGlmIChzb3VyY2VPclRhcmdldCA9PSBcInNvdXJjZVwiKSB7XG4gICAgICAgIHZhciBzYW1lRWRnZUNvdW50T3V0ID0gbm9kZS5vdXRnb2VycygnZWRnZVtjbGFzcz1cIicrZWRnZWNsYXNzKydcIl0nKS5zaXplKCk7XG4gICAgICAgIHZhciB0b3RhbEVkZ2VDb3VudE91dCA9IG5vZGUub3V0Z29lcnMoJ2VkZ2UnKS5zaXplKCk7XG4gICAgICAgIC8vIGNoZWNrIHRoYXQgdGhlIHRvdGFsIGVkZ2UgY291bnQgaXMgd2l0aGluIHRoZSBsaW1pdHNcbiAgICAgICAgaWYgKHR5cGVvZiBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1NvdXJjZS5tYXhUb3RhbCA9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgfHwgdG90YWxFZGdlQ291bnRPdXQgPCBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1NvdXJjZS5tYXhUb3RhbCApIHtcbiAgICAgICAgICAgIHRvdGFsVG9vTWFueSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRoZW4gY2hlY2sgbGltaXRzIGZvciB0aGlzIHNwZWNpZmljIGVkZ2UgY2xhc3NcbiAgICAgICAgaWYgKHR5cGVvZiBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1NvdXJjZS5tYXhFZGdlID09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICB8fCBzYW1lRWRnZUNvdW50T3V0IDwgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNTb3VyY2UubWF4RWRnZSApIHtcbiAgICAgICAgICAgIGVkZ2VUb29NYW55ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgb25seSBvbmUgb2YgdGhlIGxpbWl0cyBpcyByZWFjaGVkIHRoZW4gZWRnZSBpcyBpbnZhbGlkXG4gICAgICAgIHJldHVybiB0b3RhbFRvb01hbnkgfHwgZWRnZVRvb01hbnk7XG4gICAgfVxuICAgIGVsc2UgeyAvLyBub2RlIGlzIHVzZWQgYXMgdGFyZ2V0XG4gICAgICAgIHZhciBzYW1lRWRnZUNvdW50SW4gPSBub2RlLmluY29tZXJzKCdlZGdlW2NsYXNzPVwiJytlZGdlY2xhc3MrJ1wiXScpLnNpemUoKTtcbiAgICAgICAgdmFyIHRvdGFsRWRnZUNvdW50SW4gPSBub2RlLmluY29tZXJzKCdlZGdlJykuc2l6ZSgpO1xuICAgICAgICBpZiAodHlwZW9mIGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heFRvdGFsID09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICB8fCB0b3RhbEVkZ2VDb3VudEluIDwgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNUYXJnZXQubWF4VG90YWwgKSB7XG4gICAgICAgICAgICB0b3RhbFRvb01hbnkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heEVkZ2UgPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgIHx8IHNhbWVFZGdlQ291bnRJbiA8IGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heEVkZ2UgKSB7XG4gICAgICAgICAgICBlZGdlVG9vTWFueSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b3RhbFRvb01hbnkgfHwgZWRnZVRvb01hbnk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzSW5Db21wbGV4KG5vZGUpIHtcbiAgICB2YXIgcGFyZW50Q2xhc3MgPSBub2RlLnBhcmVudCgpLmRhdGEoJ2NsYXNzJyk7XG4gICAgcmV0dXJuIHBhcmVudENsYXNzICYmIHBhcmVudENsYXNzLnN0YXJ0c1dpdGgoJ2NvbXBsZXgnKTtcbiAgfVxuXG4gIGlmIChpc0luQ29tcGxleChzb3VyY2UpIHx8IGlzSW5Db21wbGV4KHRhcmdldCkpIHsgLy8gc3VidW5pdHMgb2YgYSBjb21wbGV4IGFyZSBubyBsb25nZXIgRVBOcywgbm8gY29ubmVjdGlvbiBhbGxvd2VkXG4gICAgcmV0dXJuICdpbnZhbGlkJztcbiAgfVxuXG4gIC8vIGNoZWNrIG5hdHVyZSBvZiBjb25uZWN0aW9uXG4gIGlmIChlZGdlQ29uc3RyYWludHNbc291cmNlY2xhc3NdLmFzU291cmNlLmlzQWxsb3dlZCAmJiBlZGdlQ29uc3RyYWludHNbdGFyZ2V0Y2xhc3NdLmFzVGFyZ2V0LmlzQWxsb3dlZCkge1xuICAgIC8vIGNoZWNrIGFtb3VudCBvZiBjb25uZWN0aW9uc1xuICAgIGlmICghaGFzVG9vTWFueUVkZ2VzKHNvdXJjZSwgXCJzb3VyY2VcIikgJiYgIWhhc1Rvb01hbnlFZGdlcyh0YXJnZXQsIFwidGFyZ2V0XCIpICkge1xuICAgICAgcmV0dXJuICd2YWxpZCc7XG4gICAgfVxuICB9XG4gIC8vIHRyeSB0byByZXZlcnNlXG4gIGlmIChlZGdlQ29uc3RyYWludHNbdGFyZ2V0Y2xhc3NdLmFzU291cmNlLmlzQWxsb3dlZCAmJiBlZGdlQ29uc3RyYWludHNbc291cmNlY2xhc3NdLmFzVGFyZ2V0LmlzQWxsb3dlZCkge1xuICAgIGlmICghaGFzVG9vTWFueUVkZ2VzKHRhcmdldCwgXCJzb3VyY2VcIikgJiYgIWhhc1Rvb01hbnlFZGdlcyhzb3VyY2UsIFwidGFyZ2V0XCIpICkge1xuICAgICAgcmV0dXJuICdyZXZlcnNlJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuICdpbnZhbGlkJztcbn07XG5cbi8qXG4gKiBVbmhpZGUgZ2l2ZW4gZWxlcyBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xuICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcbiAgdmFyIHJlc3VsdCA9IGN5LnZpZXdVdGlsaXRpZXMoKS5zaG93KGVsZXMpOyAvLyBTaG93IGdpdmVuIGVsZXNcbiAgaWYgKHR5cGVvZiBsYXlvdXRwYXJhbSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGxheW91dHBhcmFtKCk7IC8vIElmIGxheW91dHBhcmFtIGlzIGEgZnVuY3Rpb24gZXhlY3V0ZSBpdFxuICB9XG4gIGVsc2Uge1xuICAgIHZhciBsYXlvdXQgPSBjeS5sYXlvdXQobGF5b3V0cGFyYW0pOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBsYXlvdXQgb3B0aW9ucyBjYWxsIGxheW91dCB3aXRoIHRoYXQgb3B0aW9ucy5cbiAgICBcbiAgICAvLyBEbyB0aGlzIGNoZWNrIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xuICAgICAgbGF5b3V0LnJ1bigpO1xuICAgIH1cbiAgfVxuICBcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qXG4gKiBDaGFuZ2Ugc3R5bGUvY3NzIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlTWFwKSB7XG4gIGlmICggdHlwZW9mIHZhbHVlTWFwID09PSAnb2JqZWN0JyApIHtcbiAgICBjeS5zdGFydEJhdGNoKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICAgIGVsZS5jc3MobmFtZSwgdmFsdWVNYXBbZWxlLmlkKCldKTsgLy8gdmFsdWVNYXAgaXMgYW4gaWQgdG8gdmFsdWUgbWFwIHVzZSBpdCBpbiB0aGlzIHdheVxuICAgIH1cbiAgICBjeS5lbmRCYXRjaCgpO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZXMuY3NzKG5hbWUsIHZhbHVlTWFwKTsgLy8gdmFsdWVNYXAgaXMganVzdCBhIHN0cmluZyBzZXQgY3NzKCduYW1lJykgZm9yIGFsbCBlbGVzIHRvIHRoaXMgdmFsdWVcbiAgfVxufTtcblxuLypcbiAqIENoYW5nZSBkYXRhIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICBpZiAoIHR5cGVvZiB2YWx1ZU1hcCA9PT0gJ29iamVjdCcgKSB7XG4gICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XG4gICAgICBlbGUuZGF0YShuYW1lLCB2YWx1ZU1hcFtlbGUuaWQoKV0pOyAvLyB2YWx1ZU1hcCBpcyBhbiBpZCB0byB2YWx1ZSBtYXAgdXNlIGl0IGluIHRoaXMgd2F5XG4gICAgfVxuICAgIGN5LmVuZEJhdGNoKCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlcy5kYXRhKG5hbWUsIHZhbHVlTWFwKTsgLy8gdmFsdWVNYXAgaXMganVzdCBhIHN0cmluZyBzZXQgY3NzKCduYW1lJykgZm9yIGFsbCBlbGVzIHRvIHRoaXMgdmFsdWVcbiAgfVxufTtcblxuLypcbiAqIFJldHVybiB0aGUgc2V0IG9mIGFsbCBub2RlcyBwcmVzZW50IHVuZGVyIHRoZSBnaXZlbiBwb3NpdGlvblxuICogcmVuZGVyZWRQb3MgbXVzdCBiZSBhIHBvaW50IGRlZmluZWQgcmVsYXRpdmVseSB0byBjeXRvc2NhcGUgY29udGFpbmVyXG4gKiAobGlrZSByZW5kZXJlZFBvc2l0aW9uIGZpZWxkIG9mIGEgbm9kZSlcbiAqL1xuZWxlbWVudFV0aWxpdGllcy5nZXROb2Rlc0F0ID0gZnVuY3Rpb24ocmVuZGVyZWRQb3MpIHtcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcbiAgdmFyIHggPSByZW5kZXJlZFBvcy54O1xuICB2YXIgeSA9IHJlbmRlcmVkUG9zLnk7XG4gIHZhciByZXN1bHROb2RlcyA9IFtdO1xuICBmb3IodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHZhciByZW5kZXJlZEJib3ggPSBub2RlLnJlbmRlcmVkQm91bmRpbmdCb3goe1xuICAgICAgaW5jbHVkZU5vZGVzOiB0cnVlLFxuICAgICAgaW5jbHVkZUVkZ2VzOiBmYWxzZSxcbiAgICAgIGluY2x1ZGVMYWJlbHM6IGZhbHNlLFxuICAgICAgaW5jbHVkZVNoYWRvd3M6IGZhbHNlXG4gICAgfSk7XG4gICAgaWYgKHggPj0gcmVuZGVyZWRCYm94LngxICYmIHggPD0gcmVuZGVyZWRCYm94LngyKSB7XG4gICAgICBpZiAoeSA+PSByZW5kZXJlZEJib3gueTEgJiYgeSA8PSByZW5kZXJlZEJib3gueTIpIHtcbiAgICAgICAgcmVzdWx0Tm9kZXMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdE5vZGVzO1xufTtcblxuZWxlbWVudFV0aWxpdGllcy5kZW11bHRpbWVyaXplQ2xhc3MgPSBmdW5jdGlvbihzYmduY2xhc3MpIHtcbiAgcmV0dXJuIHNiZ25jbGFzcy5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0gbWFwVHlwZSAtIHR5cGUgb2YgdGhlIGN1cnJlbnQgbWFwIChQRCwgQUYgb3IgVW5rbm93bilcbiAqL1xuZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlID0gZnVuY3Rpb24obWFwVHlwZSl7XG4gIGVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZSA9IG1hcFR5cGU7XG4gIHJldHVybiBtYXBUeXBlO1xufVxuXG4vKipcbiAqIHJldHVybiAtIG1hcCB0eXBlXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZTtcbn1cbi8qKlxuICogUmVzZXRzIG1hcCB0eXBlXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMucmVzZXRNYXBUeXBlID0gZnVuY3Rpb24oKXtcbiAgICBlbGVtZW50VXRpbGl0aWVzLm1hcFR5cGUgPSB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogS2VlcCBjb25zaXN0ZW5jeSBvZiBsaW5rcyB0byBzZWxmIGluc2lkZSB0aGUgZGF0YSgpIHN0cnVjdHVyZS5cbiAqIFRoaXMgaXMgbmVlZGVkIHdoZW5ldmVyIGEgbm9kZSBjaGFuZ2VzIHBhcmVudHMsIGZvciBleGFtcGxlLFxuICogYXMgaXQgaXMgZGVzdHJveWVkIGFuZCByZWNyZWF0ZWQuIEJ1dCB0aGUgZGF0YSgpIHN0YXlzIGlkZW50aWNhbC5cbiAqIFRoaXMgY3JlYXRlcyBpbmNvbnNpc3RlbmNpZXMgZm9yIHRoZSBwb2ludGVycyBzdG9yZWQgaW4gZGF0YSgpLFxuICogYXMgdGhleSBub3cgcG9pbnQgdG8gYSBkZWxldGVkIG5vZGUuXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMubWFpbnRhaW5Qb2ludGVyID0gZnVuY3Rpb24gKGVsZXMpIHtcbiAgZWxlcy5ub2RlcygpLmZvckVhY2goZnVuY3Rpb24oZWxlKXtcbiAgICAvLyBza2lwIG5vZGVzIHdpdGhvdXQgYW55IGF1eGlsaWFyeSB1bml0c1xuICAgIGlmKCFlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKSB8fCBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKS5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IodmFyIHNpZGUgaW4gZWxlLmRhdGEoJ2F1eHVuaXRsYXlvdXRzJykpIHtcbiAgICAgIGVsZS5kYXRhKCdhdXh1bml0bGF5b3V0cycpW3NpZGVdLnBhcmVudE5vZGUgPSBlbGU7XG4gICAgfVxuICAgIGZvcih2YXIgaT0wOyBpIDwgZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykubGVuZ3RoOyBpKyspIHtcbiAgICAgIGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpW2ldLnBhcmVudCA9IGVsZTtcbiAgICB9XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVsZW1lbnRVdGlsaXRpZXM7XG4iLCIvKiBcbiAqIFV0aWxpdHkgZmlsZSB0byBnZXQgYW5kIHNldCB0aGUgbGlicmFyaWVzIHRvIHdoaWNoIHNiZ252aXogaXMgZGVwZW5kZW50IGZyb20gYW55IGZpbGUuXG4gKi9cblxudmFyIGxpYlV0aWxpdGllcyA9IGZ1bmN0aW9uKCl7XG59O1xuXG5saWJVdGlsaXRpZXMuc2V0TGlicyA9IGZ1bmN0aW9uKGxpYnMpIHtcbiAgdGhpcy5saWJzID0gbGlicztcbn07XG5cbmxpYlV0aWxpdGllcy5nZXRMaWJzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmxpYnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxpYlV0aWxpdGllczsiLCJ2YXIgb3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpLmdldE9wdGlvbnMoKTtcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG5cbi8qXG4gKiBUaGUgbWFpbiB1dGlsaXRpZXMgdG8gYmUgZXhwb3NlZCBkaXJlY3RseS5cbiAqL1xuZnVuY3Rpb24gbWFpblV0aWxpdGllcygpIHtcbn07XG5cbi8qXG4gKiBBZGRzIGEgbmV3IG5vZGUgd2l0aCB0aGUgZ2l2ZW4gY2xhc3MgYW5kIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlcy4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5hZGROb2RlID0gZnVuY3Rpb24oeCwgeSAsIG5vZGVQYXJhbXMsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcbiAgLy8gdXBkYXRlIG1hcCB0eXBlXG4gIGlmICh0eXBlb2Ygbm9kZVBhcmFtcyA9PSAnb2JqZWN0Jyl7XG5cbiAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKVxuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKG5vZGVQYXJhbXMubGFuZ3VhZ2UpO1xuICAgIGVsc2UgaWYgKGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpICE9IG5vZGVQYXJhbXMubGFuZ3VhZ2UpXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJVbmtub3duXCIpO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4LCB5LCBub2RlUGFyYW1zLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBuZXdOb2RlIDoge1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5LFxuICAgICAgICBjbGFzczogbm9kZVBhcmFtcyxcbiAgICAgICAgaWQ6IGlkLFxuICAgICAgICBwYXJlbnQ6IHBhcmVudCxcbiAgICAgICAgdmlzaWJpbGl0eTogdmlzaWJpbGl0eVxuICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZE5vZGVcIiwgcGFyYW0pO1xuICB9XG59O1xuXG4vKlxuICogQWRkcyBhIG5ldyBlZGdlIHdpdGggdGhlIGdpdmVuIGNsYXNzIGFuZCBoYXZpbmcgdGhlIGdpdmVuIHNvdXJjZSBhbmQgdGFyZ2V0IGlkcy4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5hZGRFZGdlID0gZnVuY3Rpb24oc291cmNlLCB0YXJnZXQsIGVkZ2VQYXJhbXMsIGlkLCB2aXNpYmlsaXR5KSB7XG4gIC8vIHVwZGF0ZSBtYXAgdHlwZVxuICBpZiAodHlwZW9mIGVkZ2VQYXJhbXMgPT0gJ29iamVjdCcpe1xuXG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSlcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShlZGdlUGFyYW1zLmxhbmd1YWdlKTtcbiAgICBlbHNlIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSAhPSBlZGdlUGFyYW1zLmxhbmd1YWdlKVxuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiVW5rbm93blwiKTtcbiAgfVxuICAvLyBHZXQgdGhlIHZhbGlkYXRpb24gcmVzdWx0XG4gIHZhciBlZGdlY2xhc3MgPSBlZGdlUGFyYW1zLmNsYXNzID8gZWRnZVBhcmFtcy5jbGFzcyA6IGVkZ2VQYXJhbXM7XG4gIHZhciB2YWxpZGF0aW9uID0gZWxlbWVudFV0aWxpdGllcy52YWxpZGF0ZUFycm93RW5kcyhlZGdlY2xhc3MsIGN5LmdldEVsZW1lbnRCeUlkKHNvdXJjZSksIGN5LmdldEVsZW1lbnRCeUlkKHRhcmdldCkpO1xuXG4gIC8vIElmIHZhbGlkYXRpb24gcmVzdWx0IGlzICdpbnZhbGlkJyBjYW5jZWwgdGhlIG9wZXJhdGlvblxuICBpZiAodmFsaWRhdGlvbiA9PT0gJ2ludmFsaWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICAvLyBJZiB2YWxpZGF0aW9uIHJlc3VsdCBpcyAncmV2ZXJzZScgcmV2ZXJzZSB0aGUgc291cmNlLXRhcmdldCBwYWlyIGJlZm9yZSBjcmVhdGluZyB0aGUgZWRnZVxuICBpZiAodmFsaWRhdGlvbiA9PT0gJ3JldmVyc2UnKSB7XG4gICAgdmFyIHRlbXAgPSBzb3VyY2U7XG4gICAgc291cmNlID0gdGFyZ2V0O1xuICAgIHRhcmdldCA9IHRlbXA7XG4gIH1cbiAgICAgIFxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHNvdXJjZSwgdGFyZ2V0LCBlZGdlUGFyYW1zLCBpZCwgdmlzaWJpbGl0eSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgbmV3RWRnZSA6IHtcbiAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICBjbGFzczogZWRnZVBhcmFtcyxcbiAgICAgICAgaWQ6IGlkLFxuICAgICAgICB2aXNpYmlsaXR5OiB2aXNpYmlsaXR5XG4gICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkRWRnZVwiLCBwYXJhbSk7XG4gIH1cbn07XG5cbi8qXG4gKiBBZGRzIGEgcHJvY2VzcyB3aXRoIGNvbnZlbmllbnQgZWRnZXMuIEZvciBtb3JlIGluZm9ybWF0aW9uIHBsZWFzZSBzZWUgJ2h0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvbmV3dC9pc3N1ZXMvOScuXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24oX3NvdXJjZSwgX3RhcmdldCwgcHJvY2Vzc1R5cGUpIHtcbiAgLy8gSWYgc291cmNlIGFuZCB0YXJnZXQgSURzIGFyZSBnaXZlbiBnZXQgdGhlIGVsZW1lbnRzIGJ5IElEc1xuICB2YXIgc291cmNlID0gdHlwZW9mIF9zb3VyY2UgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3NvdXJjZSkgOiBfc291cmNlO1xuICB2YXIgdGFyZ2V0ID0gdHlwZW9mIF90YXJnZXQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3RhcmdldCkgOiBfdGFyZ2V0O1xuICBcbiAgLy8gSWYgc291cmNlIG9yIHRhcmdldCBkb2VzIG5vdCBoYXZlIGFuIEVQTiBjbGFzcyB0aGUgb3BlcmF0aW9uIGlzIG5vdCB2YWxpZFxuICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyhzb3VyY2UpIHx8ICFlbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3ModGFyZ2V0KSkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMoX3NvdXJjZSwgX3RhcmdldCwgcHJvY2Vzc1R5cGUpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIHNvdXJjZTogX3NvdXJjZSxcbiAgICAgIHRhcmdldDogX3RhcmdldCxcbiAgICAgIHByb2Nlc3NUeXBlOiBwcm9jZXNzVHlwZVxuICAgIH07XG4gICAgXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzXCIsIHBhcmFtKTtcbiAgfVxufTtcblxuLypcbiAqIENsb25lIGdpdmVuIGVsZW1lbnRzLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cbiAqL1xubWFpblV0aWxpdGllcy5jbG9uZUVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZXMpIHtcbiAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICB2YXIgY2IgPSBjeS5jbGlwYm9hcmQoKTtcbiAgdmFyIF9pZCA9IGNiLmNvcHkoZWxlcywgXCJjbG9uZU9wZXJhdGlvblwiKTtcblxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJwYXN0ZVwiLCB7aWQ6IF9pZH0pO1xuICB9IFxuICBlbHNlIHtcbiAgICBjYi5wYXN0ZShfaWQpO1xuICB9XG59O1xuXG4vKlxuICogQ29weSBnaXZlbiBlbGVtZW50cyB0byBjbGlwYm9hcmQuIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmNvcHlFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gIGN5LmNsaXBib2FyZCgpLmNvcHkoZWxlcyk7XG59O1xuXG4vKlxuICogUGFzdCB0aGUgZWxlbWVudHMgY29waWVkIHRvIGNsaXBib2FyZC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMucGFzdGVFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJwYXN0ZVwiKTtcbiAgfSBcbiAgZWxzZSB7XG4gICAgY3kuY2xpcGJvYXJkKCkucGFzdGUoKTtcbiAgfVxufTtcblxuLypcbiAqIEFsaWducyBnaXZlbiBub2RlcyBpbiBnaXZlbiBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBvcmRlci4gXG4gKiBIb3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBwYXJhbWV0ZXJzIG1heSBiZSAnbm9uZScgb3IgdW5kZWZpbmVkLlxuICogYWxpZ25UbyBwYXJhbWV0ZXIgaW5kaWNhdGVzIHRoZSBsZWFkaW5nIG5vZGUuXG4gKiBSZXF1cmlyZXMgY3l0b3NjYXBlLWdyaWQtZ3VpZGUgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmFsaWduID0gZnVuY3Rpb24gKG5vZGVzLCBob3Jpem9udGFsLCB2ZXJ0aWNhbCwgYWxpZ25Ubykge1xuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhbGlnblwiLCB7XG4gICAgICBub2Rlczogbm9kZXMsXG4gICAgICBob3Jpem9udGFsOiBob3Jpem9udGFsLFxuICAgICAgdmVydGljYWw6IHZlcnRpY2FsLFxuICAgICAgYWxpZ25UbzogYWxpZ25Ub1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG5vZGVzLmFsaWduKGhvcml6b250YWwsIHZlcnRpY2FsLCBhbGlnblRvKTtcbiAgfVxufTtcblxuLypcbiAqIENyZWF0ZSBjb21wb3VuZCBmb3IgZ2l2ZW4gbm9kZXMuIGNvbXBvdW5kVHlwZSBtYXkgYmUgJ2NvbXBsZXgnIG9yICdjb21wYXJ0bWVudCcuXG4gKiBUaGlzIG1ldGhvZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChfbm9kZXMsIGNvbXBvdW5kVHlwZSkge1xuICB2YXIgbm9kZXMgPSBfbm9kZXM7XG4gIC8qXG4gICAqIEVsZW1pbmF0ZSB0aGUgbm9kZXMgd2hpY2ggY2Fubm90IGhhdmUgYSBwYXJlbnQgd2l0aCBnaXZlbiBjb21wb3VuZCB0eXBlXG4gICAqL1xuICBub2RlcyA9IF9ub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGVsZW1lbnQsIGkpIHtcbiAgICBpZih0eXBlb2YgZWxlbWVudCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZWxlbWVudCA9IGk7XG4gICAgfVxuICAgIFxuICAgIHZhciBzYmduY2xhc3MgPSBlbGVtZW50LmRhdGEoXCJjbGFzc1wiKTtcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc1ZhbGlkUGFyZW50KHNiZ25jbGFzcywgY29tcG91bmRUeXBlLCBlbGVtZW50KTtcbiAgfSk7XG4gIFxuICBub2RlcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcblxuICAvLyBBbGwgZWxlbWVudHMgc2hvdWxkIGhhdmUgdGhlIHNhbWUgcGFyZW50IGFuZCB0aGUgY29tbW9uIHBhcmVudCBzaG91bGQgbm90IGJlIGEgJ2NvbXBsZXgnIFxuICAvLyBpZiBjb21wb3VuZFR5cGUgaXMgJ2NvbXBhcnRlbnQnXG4gIC8vIGJlY2F1c2UgdGhlIG9sZCBjb21tb24gcGFyZW50IHdpbGwgYmUgdGhlIHBhcmVudCBvZiB0aGUgbmV3IGNvbXBhcnRtZW50IGFmdGVyIHRoaXMgb3BlcmF0aW9uIGFuZFxuICAvLyAnY29tcGxleGVzJyBjYW5ub3QgaW5jbHVkZSAnY29tcGFydG1lbnRzJ1xuICBpZiAobm9kZXMubGVuZ3RoID09IDAgfHwgIWVsZW1lbnRVdGlsaXRpZXMuYWxsSGF2ZVRoZVNhbWVQYXJlbnQobm9kZXMpXG4gICAgICAgICAgfHwgKCBjb21wb3VuZFR5cGUgPT09ICdjb21wYXJ0bWVudCcgJiYgbm9kZXMucGFyZW50KCkuZGF0YSgnY2xhc3MnKVxuICAgICAgICAgICYmIG5vZGVzLnBhcmVudCgpLmRhdGEoJ2NsYXNzJykuc3RhcnRzV2l0aCgnY29tcGxleCcpICkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChjeS51bmRvUmVkbygpKSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgY29tcG91bmRUeXBlOiBjb21wb3VuZFR5cGUsXG4gICAgICBub2Rlc1RvTWFrZUNvbXBvdW5kOiBub2Rlc1xuICAgIH07XG5cbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzXCIsIHBhcmFtKTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyhub2RlcywgY29tcG91bmRUeXBlKTtcbiAgfVxufTtcblxuLypcbiAqIE1vdmUgdGhlIG5vZGVzIHRvIGEgbmV3IHBhcmVudCBhbmQgY2hhbmdlIHRoZWlyIHBvc2l0aW9uIGlmIHBvc3NEaWZmIHBhcmFtcyBhcmUgc2V0LlxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbiBhbmQgY2hlY2tzIGlmIHRoZSBvcGVyYXRpb24gaXMgdmFsaWQuXG4gKi9cbm1haW5VdGlsaXRpZXMuY2hhbmdlUGFyZW50ID0gZnVuY3Rpb24obm9kZXMsIF9uZXdQYXJlbnQsIHBvc0RpZmZYLCBwb3NEaWZmWSkge1xuICB2YXIgbmV3UGFyZW50ID0gdHlwZW9mIF9uZXdQYXJlbnQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX25ld1BhcmVudCkgOiBfbmV3UGFyZW50O1xuICAvLyBOZXcgcGFyZW50IGlzIHN1cHBvc2VkIHRvIGJlIG9uZSBvZiB0aGUgcm9vdCwgYSBjb21wbGV4IG9yIGEgY29tcGFydG1lbnRcbiAgaWYgKG5ld1BhcmVudCAmJiAhbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKS5zdGFydHNXaXRoKFwiY29tcGxleFwiKSAmJiBuZXdQYXJlbnQuZGF0YShcImNsYXNzXCIpICE9IFwiY29tcGFydG1lbnRcIikge1xuICAgIHJldHVybjtcbiAgfVxuICAvKlxuICAgKiBFbGVtaW5hdGUgdGhlIG5vZGVzIHdoaWNoIGNhbm5vdCBoYXZlIHRoZSBuZXdQYXJlbnQgYXMgdGhlaXIgcGFyZW50XG4gICAqL1xuICBub2RlcyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZWxlbWVudCwgaSkge1xuICAgIGlmKHR5cGVvZiBlbGVtZW50ID09PSBcIm51bWJlclwiKSB7XG4gICAgICBlbGVtZW50ID0gaTtcbiAgICB9XG4gICAgXG4gICAgdmFyIHNiZ25jbGFzcyA9IGVsZW1lbnQuZGF0YShcImNsYXNzXCIpO1xuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmlzVmFsaWRQYXJlbnQoc2JnbmNsYXNzLCBuZXdQYXJlbnQsIGVsZW1lbnQpO1xuICB9KTtcbiAgXG4gIC8vIERpc2NhcmQgdGhlIG5vZGVzIHdob3NlIHBhcmVudCBpcyBhbHJlYWR5IG5ld1BhcmVudC5cbiAgLy8gRGlzY2FyZCB0aGUgbmV3UGFyZW50IGl0c2VsZiBpZiBpdCBpcyBhbW9uZyB0aGUgbm9kZXNcbiAgbm9kZXMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGVsZSwgaSkge1xuICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZSA9IGk7XG4gICAgfVxuICAgIFxuICAgIC8vIERpc2NhcmQgdGhlIG5ld1BhcmVudCBpZiBpdCBpcyBhbW9uZyB0aGUgbm9kZXNcbiAgICBpZiAobmV3UGFyZW50ICYmIGVsZS5pZCgpID09PSBuZXdQYXJlbnQuaWQoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBEaXNjYXJkIHRoZSBub2RlcyB3aG9zZSBwYXJlbnQgaXMgYWxyZWFkeSBuZXdQYXJlbnRcbiAgICBpZiAoIW5ld1BhcmVudCkge1xuICAgICAgcmV0dXJuIGVsZS5kYXRhKCdwYXJlbnQnKSAhPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gZWxlLmRhdGEoJ3BhcmVudCcpICE9PSBuZXdQYXJlbnQuaWQoKTtcbiAgfSk7XG5cbiAgLy8gSWYgc29tZSBub2RlcyBhcmUgYW5jZXN0b3Igb2YgbmV3IHBhcmVudCBlbGVtaW5hdGUgdGhlbVxuICBpZiAobmV3UGFyZW50KSB7XG4gICAgbm9kZXMgPSBub2Rlcy5kaWZmZXJlbmNlKG5ld1BhcmVudC5hbmNlc3RvcnMoKSk7XG4gIH1cblxuICAvLyBJZiBhbGwgbm9kZXMgYXJlIGVsZW1pbmF0ZWQgcmV0dXJuIGRpcmVjdGx5XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBKdXN0IG1vdmUgdGhlIHRvcCBtb3N0IG5vZGVzXG4gIG5vZGVzID0gZWxlbWVudFV0aWxpdGllcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xuICBcbiAgdmFyIHBhcmVudElkID0gbmV3UGFyZW50ID8gbmV3UGFyZW50LmlkKCkgOiBudWxsO1xuXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgZmlyc3RUaW1lOiB0cnVlLFxuICAgICAgcGFyZW50RGF0YTogcGFyZW50SWQsIC8vIEl0IGtlZXBzIHRoZSBuZXdQYXJlbnRJZCAoSnVzdCBhbiBpZCBmb3IgZWFjaCBub2RlcyBmb3IgdGhlIGZpcnN0IHRpbWUpXG4gICAgICBub2Rlczogbm9kZXMsXG4gICAgICBwb3NEaWZmWDogcG9zRGlmZlgsXG4gICAgICBwb3NEaWZmWTogcG9zRGlmZlksXG4gICAgICAvLyBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlIHRoZSBjaGFuZ2VQYXJlbnQgZnVuY3Rpb24gY2FsbGVkIGlzIG5vdCBmcm9tIGVsZW1lbnRVdGlsaXRpZXNcbiAgICAgIC8vIGJ1dCBmcm9tIHRoZSB1bmRvUmVkbyBleHRlbnNpb24gZGlyZWN0bHksIHNvIG1haW50YWluaW5nIHBvaW50ZXIgaXMgbm90IGF1dG9tYXRpY2FsbHkgZG9uZS5cbiAgICAgIGNhbGxiYWNrOiBlbGVtZW50VXRpbGl0aWVzLm1haW50YWluUG9pbnRlclxuICAgIH07XG5cbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlUGFyZW50XCIsIHBhcmFtKTsgLy8gVGhpcyBhY3Rpb24gaXMgcmVnaXN0ZXJlZCBieSB1bmRvUmVkbyBleHRlbnNpb25cbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVBhcmVudChub2RlcywgcGFyZW50SWQsIHBvc0RpZmZYLCBwb3NEaWZmWSk7XG4gIH1cbn07XG5cbi8qXG4gKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcbiAqIGluIHRoZSBjb21wbGV4LiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgdGhlIHNhbWUgZnVuY3Rpb24gaW4gZWxlbWVudFV0aWxpdGllc1xuICovXG5tYWluVXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAodGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCkge1xuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24odGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgdGVtcGxhdGVUeXBlOiB0ZW1wbGF0ZVR5cGUsXG4gICAgICBtYWNyb21vbGVjdWxlTGlzdDogbWFjcm9tb2xlY3VsZUxpc3QsXG4gICAgICBjb21wbGV4TmFtZTogY29tcGxleE5hbWUsXG4gICAgICBwcm9jZXNzUG9zaXRpb246IHByb2Nlc3NQb3NpdGlvbixcbiAgICAgIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLFxuICAgICAgdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLFxuICAgICAgZWRnZUxlbmd0aDogZWRnZUxlbmd0aFxuICAgIH07XG4gICAgXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZVRlbXBsYXRlUmVhY3Rpb25cIiwgcGFyYW0pO1xuICB9XG59O1xuXG4vKlxuICogUmVzaXplIGdpdmVuIG5vZGVzIGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeSBvbmUgb2Ygd2lkdGggb3IgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0LiBcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMucmVzaXplTm9kZXMgPSBmdW5jdGlvbihub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8pIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBub2Rlczogbm9kZXMsXG4gICAgICB3aWR0aDogd2lkdGgsXG4gICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgIHVzZUFzcGVjdFJhdGlvOiB1c2VBc3BlY3RSYXRpbyxcbiAgICAgIHBlcmZvcm1PcGVyYXRpb246IHRydWVcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZXNpemVOb2Rlc1wiLCBwYXJhbSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2Rlcyhub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8pO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLypcbiAqIENoYW5nZXMgdGhlIGxhYmVsIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gbGFiZWwuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuY2hhbmdlTm9kZUxhYmVsID0gZnVuY3Rpb24obm9kZXMsIGxhYmVsKSB7XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIG5vZGVzLmRhdGEoJ2xhYmVsJywgbGFiZWwpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgIH07XG4gICAgXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZU5vZGVMYWJlbFwiLCBwYXJhbSk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vKlxuICogQ2hhbmdlIGZvbnQgcHJvcGVydGllcyBmb3IgZ2l2ZW4gbm9kZXMgdXNlIHRoZSBnaXZlbiBmb250IGRhdGEuXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24oZWxlcywgZGF0YSkge1xuICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgZWxlczogZWxlcyxcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICB9O1xuXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUZvbnRQcm9wZXJ0aWVzXCIsIHBhcmFtKTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZXMsIGRhdGEpO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLypcbiAqIENoYW5nZSBzdGF0ZSB2YWx1ZSBvciB1bml0IG9mIGluZm9ybWF0aW9uIGJveCBvZiBnaXZlbiBub2RlcyB3aXRoIGdpdmVuIGluZGV4LlxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBwYXJhbWV0ZXJzIHNlZSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94XG4gKi9cbm1haW5VdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBpbmRleDogaW5kZXgsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICB0eXBlOiB0eXBlLFxuICAgICAgbm9kZXM6IG5vZGVzXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94KG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLy8gQWRkIGEgbmV3IHN0YXRlIG9yIGluZm8gYm94IHRvIGdpdmVuIG5vZGVzLlxuLy8gVGhlIGJveCBpcyByZXByZXNlbnRlZCBieSB0aGUgcGFyYW1ldGVyIG9iai5cbi8vIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG5tYWluVXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24obm9kZXMsIG9iaikge1xuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG5vZGVzLCBvYmopO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIG9iajogb2JqLFxuICAgICAgbm9kZXM6IG5vZGVzXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLy8gUmVtb3ZlIHRoZSBzdGF0ZSBvciBpbmZvIGJveGVzIG9mIHRoZSBnaXZlbiBub2RlcyBhdCBnaXZlbiBpbmRleC5cbi8vIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG5tYWluVXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24obm9kZXMsIGluZGV4KSB7XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3gobm9kZXMsIHtpbmRleDogaW5kZXh9KTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBsb2NhdGlvbk9iajoge2luZGV4OiBpbmRleH0sXG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9O1xuXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInJlbW92ZVN0YXRlT3JJbmZvQm94XCIsIHBhcmFtKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBTZXQgbXVsdGltZXIgc3RhdHVzIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uKG5vZGVzLCBzdGF0dXMpIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBzdGF0dXM6IHN0YXR1cyxcbiAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgIH07XG5cbiAgICBjeS51bmRvUmVkbygpLmRvKFwic2V0TXVsdGltZXJTdGF0dXNcIiwgcGFyYW0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMobm9kZXMsIHN0YXR1cyk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vKlxuICogU2V0IGNsb25lIG1hcmtlciBzdGF0dXMgb2YgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi8gXG5tYWluVXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24obm9kZXMsIHN0YXR1cykge1xuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgfTtcblxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXRDbG9uZU1hcmtlclN0YXR1c1wiLCBwYXJhbSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBDaGFuZ2Ugc3R5bGUvY3NzIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmNoYW5nZUNzcyA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlTWFwKSB7XG4gIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VDc3MoZWxlcywgbmFtZSwgdmFsdWVNYXApO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGVsZXM6IGVsZXMsXG4gICAgICB2YWx1ZU1hcDogdmFsdWVNYXAsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlQ3NzXCIsIHBhcmFtKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBDaGFuZ2UgZGF0YSBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXG4gKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcbiAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEoZWxlcywgbmFtZSwgdmFsdWVNYXApO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGVsZXM6IGVsZXMsXG4gICAgICB2YWx1ZU1hcDogdmFsdWVNYXAsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlRGF0YVwiLCBwYXJhbSk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vKlxuICogVW5oaWRlIGdpdmVuIGVsZXMgKHRoZSBvbmVzIHdoaWNoIGFyZSBoaWRkZW4gaWYgYW55KSBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xuICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGVsZXMsIGxheW91dHBhcmFtKSB7XG4gIHZhciBoaWRkZW5FbGVzID0gZWxlcy5maWx0ZXIoJzpoaWRkZW4nKTtcbiAgaWYgKGhpZGRlbkVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGZ1bmN0aW9uIHRoaWNrZW5Cb3JkZXIoZWxlcykge1xuICAgIGVsZXMuZm9yRWFjaChmdW5jdGlvbiggZWxlICl7XG4gICAgICB2YXIgZGVmYXVsdEJvcmRlcldpZHRoID0gTnVtYmVyKGVsZS5kYXRhKFwiYm9yZGVyLXdpZHRoXCIpKTtcbiAgICAgIGVsZS5kYXRhKFwiYm9yZGVyLXdpZHRoXCIsIGRlZmF1bHRCb3JkZXJXaWR0aCArIDIpO1xuICAgIH0pO1xuICAgIGVsZXMuZGF0YShcInRoaWNrQm9yZGVyXCIsIHRydWUpO1xuICAgIHJldHVybiBlbGVzO1xuICB9XG5cbiAgZnVuY3Rpb24gdGhpbkJvcmRlcihlbGVzKSB7XG4gICAgZWxlcy5mb3JFYWNoKGZ1bmN0aW9uKCBlbGUgKXtcbiAgICAgIHZhciBkZWZhdWx0Qm9yZGVyV2lkdGggPSBOdW1iZXIoZWxlLmRhdGEoXCJib3JkZXItd2lkdGhcIikpO1xuICAgICAgZWxlLmRhdGEoXCJib3JkZXItd2lkdGhcIiwgZGVmYXVsdEJvcmRlcldpZHRoIC0gMik7XG4gICAgfSk7XG4gICAgZWxlcy5yZW1vdmVEYXRhKFwidGhpY2tCb3JkZXJcIik7XG4gICAgcmV0dXJuIGVsZXM7XG4gIH1cbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCc6dmlzaWJsZScpO1xuICAgIHRoaW5Cb3JkZXIobm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IpO1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQoaGlkZGVuRWxlcywgbGF5b3V0cGFyYW0pO1xuICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5jb25uZWN0ZWROb2RlcygnOnZpc2libGUnKTtcbiAgICB0aGlja2VuQm9yZGVyKG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBlbGVzOiBoaWRkZW5FbGVzLFxuICAgICAgbGF5b3V0cGFyYW06IGxheW91dHBhcmFtLFxuICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgfTtcbiAgICBcbiAgICB2YXIgdXIgPSBjeS51bmRvUmVkbygpO1xuICAgIHVyLmFjdGlvbihcInRoaWNrZW5Cb3JkZXJcIiwgdGhpY2tlbkJvcmRlciwgdGhpbkJvcmRlcik7XG4gICAgdXIuYWN0aW9uKFwidGhpbkJvcmRlclwiLCB0aGluQm9yZGVyLCB0aGlja2VuQm9yZGVyKTtcbiAgICBcbiAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGhpZGRlbkVsZXMubmVpZ2hib3Job29kKFwiOnZpc2libGVcIikubm9kZXMoKTtcbiAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwidGhpbkJvcmRlclwiLCBwYXJhbTogbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3J9KTsgIFxuICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCBwYXJhbTogcGFyYW19KTtcbiAgICBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGhpZGRlbkVsZXMubm9kZXMoKS5lZGdlc1dpdGgoY3kubm9kZXMoXCI6aGlkZGVuXCIpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcy5ub2RlcygpKSlcbiAgICAgICAgICAgIC5jb25uZWN0ZWROb2RlcygpLmludGVyc2VjdGlvbihoaWRkZW5FbGVzLm5vZGVzKCkpO1xuICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGlja2VuQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcn0pOyBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYmF0Y2hcIiwgYWN0aW9ucyk7XG4gIH1cbn07XG5cbi8vIE92ZXJyaWRlcyBoaWdobGlnaHRQcm9jZXNzZXMgZnJvbSBTQkdOVklaIC0gZG8gbm90IGhpZ2hsaWdodCBhbnkgbm9kZXMgd2hlbiB0aGUgbWFwIHR5cGUgaXMgQUZcbm1haW5VdGlsaXRpZXMuaGlnaGxpZ2h0UHJvY2Vzc2VzID0gZnVuY3Rpb24oX25vZGVzKSB7XG4gIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSA9PSBcIkFGXCIpXG4gICAgcmV0dXJuO1xuICBsaWJzLnNiZ252aXouaGlnaGxpZ2h0UHJvY2Vzc2VzKF9ub2Rlcyk7XG59O1xuXG4vKipcbiAqIFJlc2V0cyBtYXAgdHlwZSB0byB1bmRlZmluZWRcbiAqL1xubWFpblV0aWxpdGllcy5yZXNldE1hcFR5cGUgPSBmdW5jdGlvbigpe1xuICBlbGVtZW50VXRpbGl0aWVzLnJlc2V0TWFwVHlwZSgpO1xufTtcblxuLyoqXG4gKiByZXR1cm4gOiBtYXAgdHlwZVxuICovXG5tYWluVXRpbGl0aWVzLmdldE1hcFR5cGUgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1haW5VdGlsaXRpZXM7XG4iLCIvKlxuICogIEV4dGVuZCBkZWZhdWx0IG9wdGlvbnMgYW5kIGdldCBjdXJyZW50IG9wdGlvbnMgYnkgdXNpbmcgdGhpcyBmaWxlIFxuICovXG5cbi8vIGRlZmF1bHQgb3B0aW9uc1xudmFyIGRlZmF1bHRzID0ge1xuICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgdGhlIGluZGV4IGh0bWwgXG4gIC8vIGZpbGUgYW5kIG5vZGVfbW9kdWxlcyBhcmUgdW5kZXIgdGhlIHNhbWUgZm9sZGVyIHRoZW4gdXNpbmcgdGhlIGRlZmF1bHQgdmFsdWUgaXMgZmluZVxuICBpbWdQYXRoOiAnbm9kZV9tb2R1bGVzL3NiZ252aXovc3JjL2ltZycsXG4gIC8vIFdoZXRoZXIgdG8gZml0IGxhYmVscyB0byBub2Rlc1xuICBmaXRMYWJlbHNUb05vZGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBmaXRMYWJlbHNUb0luZm9ib3hlczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgLy8gZHluYW1pYyBsYWJlbCBzaXplIGl0IG1heSBiZSAnc21hbGwnLCAncmVndWxhcicsICdsYXJnZSdcbiAgZHluYW1pY0xhYmVsU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAncmVndWxhcic7XG4gIH0sXG4gIC8vIHBlcmNlbnRhZ2UgdXNlZCB0byBjYWxjdWxhdGUgY29tcG91bmQgcGFkZGluZ3NcbiAgY29tcG91bmRQYWRkaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIDEwO1xuICB9LFxuICAvLyBXaGV0aGVyIHRvIGFkanVzdCBub2RlIGxhYmVsIGZvbnQgc2l6ZSBhdXRvbWF0aWNhbGx5LlxuICAvLyBJZiB0aGlzIG9wdGlvbiByZXR1cm4gZmFsc2UgZG8gbm90IGFkanVzdCBsYWJlbCBzaXplcyBhY2NvcmRpbmcgdG8gbm9kZSBoZWlnaHQgdXNlcyBub2RlLmRhdGEoJ2ZvbnQtc2l6ZScpXG4gIC8vIGluc3RlYWQgb2YgZG9pbmcgaXQuXG4gIGFkanVzdE5vZGVMYWJlbEZvbnRTaXplQXV0b21hdGljYWxseTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIC8vIFRoZSBzZWxlY3RvciBvZiB0aGUgY29tcG9uZW50IGNvbnRhaW5pbmcgdGhlIHNiZ24gbmV0d29ya1xuICBuZXR3b3JrQ29udGFpbmVyU2VsZWN0b3I6ICcjc2Jnbi1uZXR3b3JrLWNvbnRhaW5lcicsXG4gIC8vIFdoZXRoZXIgdGhlIGFjdGlvbnMgYXJlIHVuZG9hYmxlLCByZXF1aXJlcyBjeXRvc2NhcGUtdW5kby1yZWRvIGV4dGVuc2lvblxuICB1bmRvYWJsZTogdHJ1ZSxcbiAgLy8gV2hldGhlciB0byBoYXZlIHVuZG9hYmxlIGRyYWcgZmVhdHVyZSBpbiB1bmRvL3JlZG8gZXh0ZW5zaW9uLiBUaGlzIG9wdGlvbnMgd2lsbCBiZSBwYXNzZWQgdG8gdW5kby9yZWRvIGV4dGVuc2lvblxuICB1bmRvYWJsZURyYWc6IHRydWVcbn07XG5cbnZhciBvcHRpb25VdGlsaXRpZXMgPSBmdW5jdGlvbiAoKSB7XG59O1xuXG4vLyBFeHRlbmQgdGhlIGRlZmF1bHRzIG9wdGlvbnMgd2l0aCB0aGUgdXNlciBvcHRpb25zXG5vcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcblxuICBmb3IgKHZhciBwcm9wIGluIGRlZmF1bHRzKSB7XG4gICAgcmVzdWx0W3Byb3BdID0gZGVmYXVsdHNbcHJvcF07XG4gIH1cbiAgXG4gIGZvciAodmFyIHByb3AgaW4gb3B0aW9ucykge1xuICAgIHJlc3VsdFtwcm9wXSA9IG9wdGlvbnNbcHJvcF07XG4gIH1cblxuICBvcHRpb25VdGlsaXRpZXMub3B0aW9ucyA9IHJlc3VsdDtcblxuICByZXR1cm4gb3B0aW9ucztcbn07XG5cbm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9wdGlvblV0aWxpdGllczsiLCJ2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBvcHRpb25zID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJykuZ2V0T3B0aW9ucygpO1xudmFyICQgPSBsaWJzLmpRdWVyeTtcblxudmFyIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zID0gZnVuY3Rpb24gKHVuZG9hYmxlRHJhZykge1xuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gY3JlYXRlIHVuZG8tcmVkbyBpbnN0YW5jZVxuICB2YXIgdXIgPSBjeS51bmRvUmVkbyh7XG4gICAgdW5kb2FibGVEcmFnOiB1bmRvYWJsZURyYWdcbiAgfSk7XG5cbiAgLy8gcmVnaXN0ZXIgYWRkIHJlbW92ZSBhY3Rpb25zXG4gIHVyLmFjdGlvbihcImFkZE5vZGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkTm9kZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTaW1wbGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xuICB1ci5hY3Rpb24oXCJhZGRFZGdlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZEVkZ2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuICB1ci5hY3Rpb24oXCJhZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTbWFydFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU21hcnQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcbiAgdXIuYWN0aW9uKFwiY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKTtcblxuICAvLyByZWdpc3RlciBnZW5lcmFsIGFjdGlvbnNcbiAgdXIuYWN0aW9uKFwicmVzaXplTm9kZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc2l6ZU5vZGVzKTtcbiAgdXIuYWN0aW9uKFwiY2hhbmdlTm9kZUxhYmVsXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsKTtcbiAgdXIuYWN0aW9uKFwiY2hhbmdlRGF0YVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhKTtcbiAgdXIuYWN0aW9uKFwiY2hhbmdlQ3NzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUNzcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzKTtcbiAgdXIuYWN0aW9uKFwiY2hhbmdlQmVuZFBvaW50c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCZW5kUG9pbnRzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCZW5kUG9pbnRzKTtcbiAgdXIuYWN0aW9uKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKTtcbiAgdXIuYWN0aW9uKFwic2hvd0FuZFBlcmZvcm1MYXlvdXRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2hvd0FuZFBlcmZvcm1MYXlvdXQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9TaG93QW5kUGVyZm9ybUxheW91dCk7XG5cbiAgLy8gcmVnaXN0ZXIgU0JHTiBhY3Rpb25zXG4gIHVyLmFjdGlvbihcImFkZFN0YXRlT3JJbmZvQm94XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCk7XG4gIHVyLmFjdGlvbihcImNoYW5nZVN0YXRlT3JJbmZvQm94XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCk7XG4gIHVyLmFjdGlvbihcInNldE11bHRpbWVyU3RhdHVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cyk7XG4gIHVyLmFjdGlvbihcInNldENsb25lTWFya2VyU3RhdHVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cyk7XG4gIHVyLmFjdGlvbihcInJlbW92ZVN0YXRlT3JJbmZvQm94XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZU9ySW5mb0JveCk7XG4gIFxuICAvLyByZWdpc3RlciBlYXN5IGNyZWF0aW9uIGFjdGlvbnNcbiAgdXIuYWN0aW9uKFwiY3JlYXRlVGVtcGxhdGVSZWFjdGlvblwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcblxuICB1ci5hY3Rpb24oXCJzZXREZWZhdWx0UHJvcGVydHlcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0RGVmYXVsdFByb3BlcnR5LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXREZWZhdWx0UHJvcGVydHkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1bmRvYWJsZURyYWcpIHtcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnModW5kb2FibGVEcmFnKTtcbiAgfSk7XG59OyIsIi8vIEV4dGVuZHMgc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgc2JnbnZpeiA9IGxpYnMuc2JnbnZpejtcbnZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHNiZ252aXoudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XG52YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gYWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZE5vZGUgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgIHZhciBuZXdOb2RlID0gcGFyYW0ubmV3Tm9kZTtcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUobmV3Tm9kZS54LCBuZXdOb2RlLnksIG5ld05vZGUuY2xhc3MsIG5ld05vZGUuaWQsIG5ld05vZGUucGFyZW50LCBuZXdOb2RlLnZpc2liaWxpdHkpO1xuICB9XG4gIGVsc2Uge1xuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBlbGVzOiByZXN1bHRcbiAgfTtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZEVkZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgIHZhciBuZXdFZGdlID0gcGFyYW0ubmV3RWRnZTtcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3RWRnZS5zb3VyY2UsIG5ld0VkZ2UudGFyZ2V0LCBuZXdFZGdlLmNsYXNzLCBuZXdFZGdlLmlkLCBuZXdFZGdlLnZpc2liaWxpdHkpO1xuICB9XG4gIGVsc2Uge1xuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBlbGVzOiByZXN1bHRcbiAgfTtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24ocGFyYW0pIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMocGFyYW0uc291cmNlLCBwYXJhbS50YXJnZXQsIHBhcmFtLnByb2Nlc3NUeXBlKTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKHBhcmFtKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZWxlczogcmVzdWx0XG4gIH07XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAvLyBOb2RlcyB0byBtYWtlIGNvbXBvdW5kLCB0aGVpciBkZXNjZW5kYW50cyBhbmQgZWRnZXMgY29ubmVjdGVkIHRvIHRoZW0gd2lsbCBiZSByZW1vdmVkIGR1cmluZyBjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgb3BlcmF0aW9uXG4gICAgLy8gKGludGVybmFsbHkgYnkgZWxlcy5tb3ZlKCkgb3BlcmF0aW9uKSwgc28gbWFyayB0aGVtIGFzIHJlbW92ZWQgZWxlcyBmb3IgdW5kbyBvcGVyYXRpb24uXG4gICAgdmFyIG5vZGVzVG9NYWtlQ29tcG91bmQgPSBwYXJhbS5ub2Rlc1RvTWFrZUNvbXBvdW5kO1xuICAgIHZhciByZW1vdmVkRWxlcyA9IG5vZGVzVG9NYWtlQ29tcG91bmQudW5pb24obm9kZXNUb01ha2VDb21wb3VuZC5kZXNjZW5kYW50cygpKTtcbiAgICByZW1vdmVkRWxlcyA9IHJlbW92ZWRFbGVzLnVuaW9uKHJlbW92ZWRFbGVzLmNvbm5lY3RlZEVkZ2VzKCkpO1xuICAgIHJlc3VsdC5yZW1vdmVkRWxlcyA9IHJlbW92ZWRFbGVzO1xuICAgIC8vIEFzc3VtZSB0aGF0IGFsbCBub2RlcyB0byBtYWtlIGNvbXBvdW5kIGhhdmUgdGhlIHNhbWUgcGFyZW50XG4gICAgdmFyIG9sZFBhcmVudElkID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwicGFyZW50XCIpO1xuICAgIC8vIFRoZSBwYXJlbnQgb2YgbmV3IGNvbXBvdW5kIHdpbGwgYmUgdGhlIG9sZCBwYXJlbnQgb2YgdGhlIG5vZGVzIHRvIG1ha2UgY29tcG91bmRcbiAgICAvLyBOZXcgZWxlcyBpbmNsdWRlcyBuZXcgY29tcG91bmQgYW5kIHRoZSBtb3ZlZCBlbGVzIGFuZCB3aWxsIGJlIHVzZWQgaW4gdW5kbyBvcGVyYXRpb24uXG4gICAgcmVzdWx0Lm5ld0VsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyhub2Rlc1RvTWFrZUNvbXBvdW5kLCBwYXJhbS5jb21wb3VuZFR5cGUpO1xuICB9XG4gIGVsc2Uge1xuICAgIHJlc3VsdC5yZW1vdmVkRWxlcyA9IHBhcmFtLm5ld0VsZXMucmVtb3ZlKCk7XG4gICAgcmVzdWx0Lm5ld0VsZXMgPSBwYXJhbS5yZW1vdmVkRWxlcy5yZXN0b3JlKCk7XG4gICAgZWxlbWVudFV0aWxpdGllcy5tYWludGFpblBvaW50ZXIocmVzdWx0Lm5ld0VsZXMpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIFNlY3Rpb24gRW5kXG4vLyBhZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gZWFzeSBjcmVhdGlvbiBhY3Rpb24gZnVuY3Rpb25zXG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgdmFyIGVsZXM7XG5cbiAgaWYgKGZpcnN0VGltZSkge1xuICAgIGVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24ocGFyYW0udGVtcGxhdGVUeXBlLCBwYXJhbS5tYWNyb21vbGVjdWxlTGlzdCwgcGFyYW0uY29tcGxleE5hbWUsIHBhcmFtLnByb2Nlc3NQb3NpdGlvbiwgcGFyYW0udGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCBwYXJhbS50aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgcGFyYW0uZWRnZUxlbmd0aClcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVzID0gcGFyYW07XG4gICAgY3kuYWRkKGVsZXMpO1xuICAgIFxuICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgICBlbGVzLnNlbGVjdCgpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBlbGVzOiBlbGVzXG4gIH07XG59O1xuXG4vLyBTZWN0aW9uIEVuZFxuLy8gZWFzeSBjcmVhdGlvbiBhY3Rpb24gZnVuY3Rpb25zXG5cbi8vIFNlY3Rpb24gU3RhcnRcbi8vIGdlbmVyYWwgYWN0aW9uIGZ1bmN0aW9uc1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcG9zaXRpb25zID0ge307XG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XG4gIFxuICBub2Rlcy5lYWNoKGZ1bmN0aW9uKGVsZSwgaSkge1xuICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZSA9IGk7XG4gICAgfVxuICAgIFxuICAgIHBvc2l0aW9uc1tlbGUuaWQoKV0gPSB7XG4gICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxuICAgICAgeTogZWxlLnBvc2l0aW9uKFwieVwiKVxuICAgIH07XG4gIH0pO1xuXG4gIHJldHVybiBwb3NpdGlvbnM7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyA9IGZ1bmN0aW9uIChwb3NpdGlvbnMpIHtcbiAgdmFyIGN1cnJlbnRQb3NpdGlvbnMgPSB7fTtcbiAgY3kubm9kZXMoKS5wb3NpdGlvbnMoZnVuY3Rpb24gKGVsZSwgaSkge1xuICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZSA9IGk7XG4gICAgfVxuICAgIFxuICAgIGN1cnJlbnRQb3NpdGlvbnNbZWxlLmlkKCldID0ge1xuICAgICAgeDogZWxlLnBvc2l0aW9uKFwieFwiKSxcbiAgICAgIHk6IGVsZS5wb3NpdGlvbihcInlcIilcbiAgICB9O1xuICAgIFxuICAgIHZhciBwb3MgPSBwb3NpdGlvbnNbZWxlLmlkKCldO1xuICAgIHJldHVybiB7XG4gICAgICB4OiBwb3MueCxcbiAgICAgIHk6IHBvcy55XG4gICAgfTtcbiAgfSk7XG5cbiAgcmV0dXJuIGN1cnJlbnRQb3NpdGlvbnM7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0ge1xuICAgIHBlcmZvcm1PcGVyYXRpb246IHRydWVcbiAgfTtcblxuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcblxuICByZXN1bHQuc2l6ZU1hcCA9IHt9O1xuICByZXN1bHQudXNlQXNwZWN0UmF0aW8gPSBmYWxzZTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICByZXN1bHQuc2l6ZU1hcFtub2RlLmlkKCldID0ge1xuICAgICAgdzogbm9kZS53aWR0aCgpLFxuICAgICAgaDogbm9kZS5oZWlnaHQoKVxuICAgIH07XG4gIH1cblxuICByZXN1bHQubm9kZXMgPSBub2RlcztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcblxuICAgIGlmIChwYXJhbS5wZXJmb3JtT3BlcmF0aW9uKSB7XG4gICAgICBpZiAocGFyYW0uc2l6ZU1hcCkge1xuICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0udztcbiAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmg7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2RlcyhwYXJhbS5ub2RlcywgcGFyYW0ud2lkdGgsIHBhcmFtLmhlaWdodCwgcGFyYW0udXNlQXNwZWN0UmF0aW8pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgfTtcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG4gIHJlc3VsdC5ub2RlcyA9IG5vZGVzO1xuICByZXN1bHQubGFiZWwgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICByZXN1bHQubGFiZWxbbm9kZS5pZCgpXSA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcbiAgfVxuXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICBub2Rlcy5kYXRhKCdsYWJlbCcsIHBhcmFtLmxhYmVsKTtcbiAgfVxuICBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsID0gcGFyYW0ubGFiZWxbbm9kZS5pZCgpXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRGF0YSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0ge1xuICB9O1xuICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG4gIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTtcbiAgcmVzdWx0LnZhbHVlTWFwID0ge307XG4gIHJlc3VsdC5lbGVzID0gZWxlcztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICByZXN1bHQudmFsdWVNYXBbZWxlLmlkKCldID0gZWxlLmRhdGEocGFyYW0ubmFtZSk7XG4gIH1cblxuICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEocGFyYW0uZWxlcywgcGFyYW0ubmFtZSwgcGFyYW0udmFsdWVNYXApO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgfTtcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuICByZXN1bHQubmFtZSA9IHBhcmFtLm5hbWU7XG4gIHJlc3VsdC52YWx1ZU1hcCA9IHt9O1xuICByZXN1bHQuZWxlcyA9IGVsZXM7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGVsZSA9IGVsZXNbaV07XG4gICAgcmVzdWx0LnZhbHVlTWFwW2VsZS5pZCgpXSA9IGVsZS5jc3MocGFyYW0ubmFtZSk7XG4gIH1cblxuICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyhwYXJhbS5lbGVzLCBwYXJhbS5uYW1lLCBwYXJhbS52YWx1ZU1hcCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciByZXN1bHQgPSB7XG4gIH07XG5cbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuICByZXN1bHQuZGF0YSA9IHt9O1xuICByZXN1bHQuZWxlcyA9IGVsZXM7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGVsZSA9IGVsZXNbaV07XG5cbiAgICByZXN1bHQuZGF0YVtlbGUuaWQoKV0gPSB7fTtcblxuICAgIHZhciBkYXRhID0gcGFyYW0uZmlyc3RUaW1lID8gcGFyYW0uZGF0YSA6IHBhcmFtLmRhdGFbZWxlLmlkKCldO1xuXG4gICAgZm9yICh2YXIgcHJvcCBpbiBkYXRhKSB7XG4gICAgICByZXN1bHQuZGF0YVtlbGUuaWQoKV1bcHJvcF0gPSBlbGUuZGF0YShwcm9wKTtcbiAgICB9XG4gIH1cblxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyhlbGVzLCBkYXRhKTtcbiAgfVxuICBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuICAgICAgXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZSwgZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qXG4gKiBTaG93IGVsZXMgYW5kIHBlcmZvcm0gbGF5b3V0LlxuICovXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG5cbiAgdmFyIHJlc3VsdCA9IHt9O1xuICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuICBcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgIHJlc3VsdC5lbGVzID0gZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dChwYXJhbS5lbGVzLCBwYXJhbS5sYXlvdXRwYXJhbSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuc2hvdyhlbGVzKTsgLy8gU2hvdyBnaXZlbiBlbGVzXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvU2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gIHZhciByZXN1bHQgPSB7fTtcbiAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcbiAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuaGlkZShlbGVzKTsgLy8gSGlkZSBwcmV2aW91c2x5IHVuaGlkZGVuIGVsZXM7XG5cbiAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLy8gU2VjdGlvbiBFbmRcbi8vIGdlbmVyYWwgYWN0aW9uIGZ1bmN0aW9uc1xuXG4vLyBTZWN0aW9uIFN0YXJ0XG4vLyBzYmduIGFjdGlvbiBmdW5jdGlvbnNcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgfTtcbiAgcmVzdWx0LnR5cGUgPSBwYXJhbS50eXBlO1xuICByZXN1bHQubm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgcmVzdWx0LmluZGV4ID0gcGFyYW0uaW5kZXg7XG5cbiAgcmVzdWx0LnZhbHVlID0gZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveChwYXJhbS5ub2RlcywgcGFyYW0uaW5kZXgsIHBhcmFtLnZhbHVlLCBwYXJhbS50eXBlKTtcblxuICBjeS5mb3JjZVJlbmRlcigpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgb2JqID0gcGFyYW0ub2JqO1xuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcblxuICB2YXIgbG9jYXRpb25PYmogPSBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG5vZGVzLCBvYmopO1xuXG4gIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBub2Rlczogbm9kZXMsXG4gICAgbG9jYXRpb25PYmo6IGxvY2F0aW9uT2JqLFxuICAgIG9iajogb2JqXG4gIH07XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgbG9jYXRpb25PYmogPSBwYXJhbS5sb2NhdGlvbk9iajtcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG5cbiAgdmFyIG9iaiA9IGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3gobm9kZXMsIGxvY2F0aW9uT2JqKTtcblxuICBjeS5mb3JjZVJlbmRlcigpO1xuXG4gIHZhciByZXN1bHQgPSB7XG4gICAgbm9kZXM6IG5vZGVzLFxuICAgIG9iajogb2JqXG4gIH07XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgdmFyIHN0YXR1cyA9IHBhcmFtLnN0YXR1cztcbiAgdmFyIHJlc3VsdFN0YXR1cyA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHZhciBpc011bHRpbWVyID0gbm9kZS5kYXRhKCdjbGFzcycpLmVuZHNXaXRoKCcgbXVsdGltZXInKTtcblxuICAgIHJlc3VsdFN0YXR1c1tub2RlLmlkKCldID0gaXNNdWx0aW1lcjtcbiAgfVxuXG4gIC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IHRpbWUgY2hhbmdlIHRoZSBzdGF0dXMgb2YgYWxsIG5vZGVzIGF0IG9uY2UuXG4gIC8vIElmIG5vdCBjaGFuZ2Ugc3RhdHVzIG9mIGVhY2ggc2VwZXJhdGVseSB0byB0aGUgdmFsdWVzIG1hcHBlZCB0byB0aGVpciBpZC5cbiAgaWYgKGZpcnN0VGltZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMobm9kZXMsIHN0YXR1cyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMobm9kZSwgc3RhdHVzW25vZGUuaWQoKV0pO1xuICAgIH1cbiAgfVxuXG4vLyAgaWYgKCFmaXJzdFRpbWUgJiYgXy5pc0VxdWFsKG5vZGVzLCBjeS5ub2RlcygnOnNlbGVjdGVkJykpKSB7XG4vLyAgICAkKCcjaW5zcGVjdG9yLWlzLW11bHRpbWVyJykuYXR0cihcImNoZWNrZWRcIiwgISQoJyNpbnNwZWN0b3ItaXMtbXVsdGltZXInKS5hdHRyKFwiY2hlY2tlZFwiKSk7XG4vLyAgfVxuXG4gIHZhciByZXN1bHQgPSB7XG4gICAgc3RhdHVzOiByZXN1bHRTdGF0dXMsXG4gICAgbm9kZXM6IG5vZGVzXG4gIH07XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICB2YXIgc3RhdHVzID0gcGFyYW0uc3RhdHVzO1xuICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICB2YXIgcmVzdWx0U3RhdHVzID0ge307XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgcmVzdWx0U3RhdHVzW25vZGUuaWQoKV0gPSBub2RlLmRhdGEoJ2Nsb25lbWFya2VyJyk7XG4gICAgdmFyIGN1cnJlbnRTdGF0dXMgPSBmaXJzdFRpbWUgPyBzdGF0dXMgOiBzdGF0dXNbbm9kZS5pZCgpXTtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGUsIGN1cnJlbnRTdGF0dXMpO1xuICB9XG5cbi8vICBpZiAoIWZpcnN0VGltZSAmJiBfLmlzRXF1YWwobm9kZXMsIGN5Lm5vZGVzKCc6c2VsZWN0ZWQnKSkpIHtcbi8vICAgICQoJyNpbnNwZWN0b3ItaXMtY2xvbmUtbWFya2VyJykuYXR0cihcImNoZWNrZWRcIiwgISQoJyNpbnNwZWN0b3ItaXMtY2xvbmUtbWFya2VyJykuYXR0cihcImNoZWNrZWRcIikpO1xuLy8gIH1cblxuICB2YXIgcmVzdWx0ID0ge1xuICAgIHN0YXR1czogcmVzdWx0U3RhdHVzLFxuICAgIG5vZGVzOiBub2Rlc1xuICB9O1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBwYXJhbToge2NsYXNzOiBzYmduY2xhc3MsIG5hbWU6IHByb3BlcnR5TmFtZSwgdmFsdWU6IHZhbHVlfVxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0RGVmYXVsdFByb3BlcnR5ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBzYmduY2xhc3MgPSBwYXJhbS5jbGFzcztcbiAgdmFyIG5hbWUgPSBwYXJhbS5uYW1lO1xuICB2YXIgdmFsdWUgPSBwYXJhbS52YWx1ZTtcbiAgdmFyIGNsYXNzRGVmYXVsdHMgPSBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW3NiZ25jbGFzc107XG4gIHZhciByZXN1bHQgPSB7XG4gICAgY2xhc3M6IHNiZ25jbGFzcyxcbiAgICBuYW1lOiBuYW1lLFxuICAgIHZhbHVlOiBjbGFzc0RlZmF1bHRzLmhhc093blByb3BlcnR5KG5hbWUpID8gY2xhc3NEZWZhdWx0c1tuYW1lXSA6IHVuZGVmaW5lZFxuICB9O1xuXG4gIGNsYXNzRGVmYXVsdHNbbmFtZV0gPSB2YWx1ZTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLy8gU2VjdGlvbiBFbmRcbi8vIHNiZ24gYWN0aW9uIGZ1bmN0aW9uc1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zOyJdfQ==
