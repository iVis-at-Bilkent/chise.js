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

elementUtilities.PD = {}; // namespace for all PD specific stuff

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
    'background-color': '#ffffff',
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
    width: 100,
    height: 100,
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
    width: 100,
    height: 100,
    'font-size': 11,
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
  }
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
  -1 edge means no limit

  the nodes/edges class listed below are those used in the program.
  For instance "compartment" isn't a node in SBGN specs.
*/
elementUtilities.PD.connectivityConstraints = {
  "consumption": {
    "macromolecule":        {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "simple chemical":      {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "unspecified entity":   {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "complex":              {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "nucleic acid feature": {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "compartment":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "tag":                  {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "source and sink":      {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "perturbing agent":     {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "submap":               {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "process":              {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "omitted process":      {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "uncertain process":    {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "phenotype":            {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "association":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "dissociation":         {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: 1, maxTotal: 1}},
    "and":                  {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "or":                   {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "not":                  {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}}
  },
  "production": {
    "macromolecule":        {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "simple chemical":      {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "unspecified entity":   {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "complex":              {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "nucleic acid feature": {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "compartment":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "tag":                  {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "source and sink":      {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "perturbing agent":     {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "submap":               {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "process":              {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "omitted process":      {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "uncertain process":    {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "phenotype":            {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "association":          {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "dissociation":         {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "and":                  {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "or":                   {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "not":                  {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}}
  },
  "modulation": {
    "macromolecule":        {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "simple chemical":      {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "unspecified entity":   {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "complex":              {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "nucleic acid feature": {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "compartment":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "tag":                  {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "source and sink":      {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "perturbing agent":     {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "submap":               {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "process":              {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "omitted process":      {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "uncertain process":    {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "phenotype":            {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "association":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "dissociation":         {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "and":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "or":                   {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "not":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}}
  },
  "stimulation": {
    "macromolecule":        {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "simple chemical":      {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "unspecified entity":   {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "complex":              {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "nucleic acid feature": {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "compartment":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "tag":                  {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "source and sink":      {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "perturbing agent":     {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "submap":               {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "process":              {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "omitted process":      {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "uncertain process":    {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "phenotype":            {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "association":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "dissociation":         {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "and":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "or":                   {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "not":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}}
  },
  "catalysis": {
    "macromolecule":        {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "simple chemical":      {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "unspecified entity":   {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "complex":              {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "nucleic acid feature": {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "compartment":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "tag":                  {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "source and sink":      {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "perturbing agent":     {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "submap":               {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "process":              {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: 1, maxTotal: -1}},
    "omitted process":      {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: 1, maxTotal: -1}},
    "uncertain process":    {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: 1, maxTotal: -1}},
    "phenotype":            {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: 1, maxTotal: -1}},
    "association":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "dissociation":         {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "and":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "or":                   {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "not":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}}
  },
  "inhibition": {
    "macromolecule":        {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "simple chemical":      {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "unspecified entity":   {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "complex":              {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "nucleic acid feature": {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "compartment":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "tag":                  {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "source and sink":      {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "perturbing agent":     {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "submap":               {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "process":              {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "omitted process":      {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "uncertain process":    {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "phenotype":            {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "association":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "dissociation":         {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "and":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "or":                   {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "not":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}}
  },
  "necessary stimulation": {
    "macromolecule":        {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "simple chemical":      {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "unspecified entity":   {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "complex":              {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "nucleic acid feature": {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "compartment":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "tag":                  {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "source and sink":      {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "perturbing agent":     {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "submap":               {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "process":              {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: 1, maxTotal: -1}},
    "omitted process":      {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: 1, maxTotal: -1}},
    "uncertain process":    {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: 1, maxTotal: -1}},
    "phenotype":            {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: 1, maxTotal: -1}},
    "association":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "dissociation":         {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "and":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "or":                   {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "not":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
  },
  "logic arc": {
    "macromolecule":        {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "simple chemical":      {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "unspecified entity":   {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "complex":              {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "nucleic acid feature": {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "compartment":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "tag":                  {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "source and sink":      {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},    asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "perturbing agent":     {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "submap":               {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "process":              {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "omitted process":      {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "uncertain process":    {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "phenotype":            {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "association":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "dissociation":         {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "and":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "or":                   {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "not":                  {asSource: {isAllowed: true, maxEdge: 1, maxTotal: 1},      asTarget: {isAllowed: true, maxEdge: 1, maxTotal: 1}},
  },
  "equivalence arc": {
    "macromolecule":        {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "simple chemical":      {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "unspecified entity":   {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "complex":              {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "nucleic acid feature": {asSource: {isAllowed: true, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "compartment":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "tag":                  {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "source and sink":      {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "perturbing agent":     {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "submap":               {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: true, maxEdge: -1, maxTotal: -1}},
    "process":              {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "omitted process":      {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "uncertain process":    {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "phenotype":            {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "association":          {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "dissociation":         {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "and":                  {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "or":                   {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}},
    "not":                  {asSource: {isAllowed: false, maxEdge: -1, maxTotal: -1},   asTarget: {isAllowed: false, maxEdge: -1, maxTotal: -1}}
  }
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

elementUtilities.addNode = function (x, y, sbgnclass, id, parent, visibility) {
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

  return newNode;
};

elementUtilities.addEdge = function (source, target, sbgnclass, id, visibility) {
  var defaultProperties = this.defaultProperties;
  var defaults = defaultProperties[sbgnclass];
  
  var css = {};

  if (visibility) {
    css.visibility = visibility;
  }

  var data = {
      source: source,
      target: target,
      class: sbgnclass
  };
  
  if(id) {
    data.id = id;
  }
  else {
    data.id = "nwtE_" + generateUUID();
  }

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
  var newEles = nodesToMakeCompound.move({parent: newCompoundId});
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
  nodes.move({"parent": newParentId});
  elementUtilities.moveNodes({x: posDiffX, y: posDiffY}, nodes);
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

  return sbgnclass != 'and' && sbgnclass != 'or' && sbgnclass != 'not'
          && sbgnclass != 'association' && sbgnclass != 'dissociation' && !sbgnclass.endsWith('process');
};

// Returns whether the give element have unit of information
elementUtilities.canHaveUnitOfInformation = function (ele) {
  var sbgnclass = typeof ele === 'string' ? ele : ele.data('class');

  if (sbgnclass == 'simple chemical'
          || sbgnclass == 'macromolecule' || sbgnclass == 'nucleic acid feature'
          || sbgnclass == 'complex' || sbgnclass == 'simple chemical multimer'
          || sbgnclass == 'macromolecule multimer' || sbgnclass == 'nucleic acid feature multimer'
          || sbgnclass == 'complex multimer') {
    return true;
  }
  return false;
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
          || sbgnclass == 'association' || sbgnclass == 'dissociation');
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
  return (sbgnclass == 'and' || sbgnclass == 'or' || sbgnclass == 'not');
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
  var index;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var stateAndInfos = node.data('statesandinfos');
    
    // Clone the object to avoid referencing issues
    var clone = jQuery.extend(true, {}, obj);
    
    stateAndInfos.push(clone);
    index = stateAndInfos.length - 1;
    this.relocateStateAndInfos(stateAndInfos); // Relocate state and infos
  }

  return index;
};

// Remove the state or info boxes of the given nodes at given index.
// Returns the removed box.
elementUtilities.removeStateOrInfoBox = function (nodes, index) {
  var obj;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var stateAndInfos = node.data('statesandinfos');
    if (!obj) {
      obj = stateAndInfos[index];
    }
    stateAndInfos.splice(index, 1); // Remove the box
    this.relocateStateAndInfos(stateAndInfos); // Relocate state and infos
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
  var edgeclass = typeof edge === 'string' ? edge : edge.data('class');
  var sourceclass = source.data('class');
  var targetclass = target.data('class');

  var edgeConstraints = this.PD.connectivityConstraints[edgeclass];

  // given a node, acting as source or target, returns boolean wether or not it has too many edges already
  function hasTooManyEdges(node, sourceOrTarget) {
    var nodeclass = node.data('class');
    var totalTooMany = true;
    var edgeTooMany = true;
    if (sourceOrTarget == "source") {
        var sameEdgeCountOut = node.outgoers('edge[class="'+edgeclass+'"]').size();
        var totalEdgeCountOut = node.outgoers('edge').size();
        // check that the total edge count is within the limits
        if (edgeConstraints[nodeclass].asSource.maxTotal == -1
            || totalEdgeCountOut < edgeConstraints[nodeclass].asSource.maxTotal ) {
            totalTooMany = false;
        }
        // then check limits for this specific edge class
        if (edgeConstraints[nodeclass].asSource.maxEdge == -1
            || sameEdgeCountOut < edgeConstraints[nodeclass].asSource.maxEdge ) {
            edgeTooMany = false;
        }
        // if only one of the limits is reached then edge is invalid
        return totalTooMany || edgeTooMany;
    }
    else { // node is used as target
        var sameEdgeCountIn = node.incomers('edge[class="'+edgeclass+'"]').size();
        var totalEdgeCountIn = node.incomers('edge').size();
        if (edgeConstraints[nodeclass].asTarget.maxTotal == -1
            || totalEdgeCountIn < edgeConstraints[nodeclass].asTarget.maxTotal ) {
            totalTooMany = false;
        }
        if (edgeConstraints[nodeclass].asTarget.maxEdge == -1
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

/*
 * Add ports to the given node, with given ordering and port distance.
 */
elementUtilities.addPorts = function(node, ordering, portDistance) {
  var firstPortId = node.id() + ".1"; // Id of first port
  var secondPortId = node.id() + ".2"; // Id of seconf port
  // First port object x and y will be filled according to ordering, the first port is supposed to be the left most or the top most one
  var firstPort = { id: firstPortId };
  // Second port object x and y will be filled according to ordering, the second port is supposed to be the right most or the bottom most one
  var secondPort = { id: secondPortId };
  
  // Complete port objects according to ordering
  if ( ordering === 'L-to-R' || ordering === 'R-to-L' ) {
    // If ordering is in horizontal axis first port is the left most one and the second port is the right most one
    firstPort.x = -1 * portDistance;
    secondPort.x = portDistance;
    firstPort.y = 0;
    secondPort.y = 0;
  }
  else { // If ordering is 'T-to-B' or 'B-to-T'
     // If ordering is in vertical axis first port is the top most one and the second port is the bottom most one
    firstPort.y = -1 * portDistance;
    secondPort.y = portDistance;
    firstPort.x = 0;
    secondPort.x = 0;
  }
  
  var fromLorT = ordering === 'L-to-R' || ordering === 'T-to-B'; // Check if ordering starts from left or top
  var ports = [firstPort, secondPort]; // Ports array for the node
  var connectedEdges = node.connectedEdges(); // The edges connected to the node
  
  cy.startBatch();
  
  node.data('ports', ports);
  
  // Reset the portsource and porttarget for each edge connected to the node
  for ( var i = 0; i < connectedEdges.length; i++ ) {
    var edge = connectedEdges[i];
    /*
     * If the node is the edge target we should set the porttarget of the edge to one of id of first port or second port ( according to the ordering )
     * if it is the edge target we should set the portsource similarly.
     */
    if ( edge.data('target') === node.id() ) {
      if ( fromLorT ) {
        edge.data('porttarget', firstPortId);
      }
      else {
        edge.data('porttarget', secondPortId);
      }
    }
    else {
      if ( fromLorT ) {
        edge.data('portsource', secondPortId);
      }
      else {
        edge.data('portsource', firstPortId);
      }
    }
  }
  
  cy.endBatch();
};

/*
 * Remove the ports of the given node
 */
elementUtilities.removePorts = function(node) {
  var connectedEdges = node.connectedEdges();
  var nodeId = node.id();
  
  cy.startBatch();
  
  // Reset portsource or porttarget of the connected edges to the node id
  for ( var i = 0; i < connectedEdges.length; i++ ) {
    var edge = connectedEdges[i];
    if ( edge.data('source') === nodeId ) {
      edge.data('portsource', nodeId);
    }
    else {
      edge.data('porttarget', nodeId);
    }
  }
  
  node.data('ports', []); // Clear ports data
  
  cy.endBatch();
};

/*
 * Sets the ordering of the given nodes.
 * Ordering options are 'L-to-R', 'R-to-L', 'T-to-B', 'B-to-T', 'none'.
 * If a node does not have any port before the operation and it is supposed to have some after operation the portDistance parameter is 
 * used to set the distance between the node center and the ports. The default port distance is 60.
 */
elementUtilities.setPortsOrdering = function( nodes, ordering, portDistance ) {
  /*
  * Retursn if the given portId is porttarget of any of the given edges.
  * These edges are expected to be the edges connected to the node associated with that port.
  */
  var isPortTargetOfAnyEdge = function(edges, portId) {
    for (var i = 0; i < edges.length; i++) {
      if (edges[i].data('porttarget') === portId) {
        return true;
      }
    }

    return false;
  };
  
  portDistance = portDistance ? portDistance : 60; // The default port distance is 60
  
  cy.startBatch();
  
  for ( var i = 0; i < nodes.length; i++ ) {
    var node = nodes[i];
    var currentOrdering = sbgnviz.elementUtilities.getPortsOrdering(node); // The current ports ordering of the node
    
    // If the current ordering is already equal to the desired ordering pass this node directly
    if ( ordering === currentOrdering ) {
      continue;
    }
    
    if ( ordering === 'none' ) { // If the ordering is 'none' remove the ports of the node
      elementUtilities.removePorts(node);
    }
    else if ( currentOrdering === 'none' ) { // If the desired ordering is not 'none' but the current one is 'none' add ports with the given parameters.
      elementUtilities.addPorts(node, ordering, portDistance);
    }
    else { // Else change the ordering by altering node 'ports'
      var ports = node.data('ports'); // Ports of the node
      // If currentOrdering is 'none' use the portDistance given by parameter else use the existing one
      var dist = currentOrdering === 'none' ? portDistance : ( Math.abs( ports[0].x ) || Math.abs( ports[0].y ) );
      var connectedEdges = node.connectedEdges(); // The edges connected to the node
      var portsource, porttarget; // The ports which are portsource/porttarget of the connected edges
      
      // Determine the portsource and porttarget
      if ( isPortTargetOfAnyEdge(connectedEdges, ports[0].id) ) {
        porttarget = ports[0];
        portsource = ports[1];
      }
      else {
        porttarget = ports[1];
        portsource = ports[0];
      }
      
      if ( ordering === 'L-to-R' ) {
        // If ordering is 'L-to-R' the porttarget should be the left most port and the portsource should be the right most port
        porttarget.x = -1 * dist;
        portsource.x = dist;
        porttarget.y = 0;
        portsource.y = 0;
      }
      else if ( ordering === 'R-to-L' ) {
        // If ordering is 'R-to-L' the porttarget should be the right most port and the portsource should be the left most port
        porttarget.x = dist;
        portsource.x = -1 * dist;
        porttarget.y = 0;
        portsource.y = 0;
      }
      else if ( ordering === 'T-to-B' ) {
        // If ordering is 'T-to-B' the porttarget should be the top most port and the portsource should be the bottom most port
        porttarget.x = 0;
        portsource.x = 0;
        porttarget.y = -1 * dist;
        portsource.y = dist;
      }
      else  { //if ordering is 'B-to-T'
        // If ordering is 'B-to-T' the porttarget should be the bottom most port and the portsource should be the top most port
        porttarget.x = 0;
        portsource.x = 0;
        porttarget.y = dist;
        portsource.y = -1 * dist;
      }
    }
    
    node.data('ports', ports); // Reset the node ports
  }
  
  cy.endBatch();
};

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

/*
 * The main utilities to be exposed directly.
 */
function mainUtilities() {
};

/*
 * Adds a new node with the given class and at the given coordinates. Considers undoable option.
 */
mainUtilities.addNode = function(x, y , nodeclass, id, parent, visibility) {
  if (!options.undoable) {
    return elementUtilities.addNode(x, y, nodeclass, id, parent, visibility);
  }
  else {
    var param = {
      newNode : {
        x: x,
        y: y,
        class: nodeclass,
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
mainUtilities.addEdge = function(source, target , edgeclass, id, visibility) {
  // Get the validation result
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
    return elementUtilities.addEdge(source, target, edgeclass, id, visibility);
  }
  else {
    var param = {
      newEdge : {
        source: source,
        target: target,
        class: edgeclass,
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
      posDiffY: posDiffY
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
    elementUtilities.removeStateOrInfoBox(nodes, index);
  }
  else {
    var param = {
      index: index,
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
  
  if (!options.undoable) {
    elementUtilities.showAndPerformLayout(hiddenEles, layoutparam);
  }
  else {
    var param = {
      eles: hiddenEles,
      layoutparam: layoutparam,
      firstTime: true
    };
    
    cy.undoRedo().do("showAndPerformLayout", param);
  }
};

/*
 * Sets the ordering of the given nodes.
 * Ordering options are 'L-to-R', 'R-to-L', 'T-to-B', 'B-to-T', 'none'.
 * If a node does not have any port before the operation and it is supposed to have some after operation the portDistance parameter is 
 * used to set the distance between the node center and the ports. The default port distance is 60.
 * Considers undoable option.
 */
mainUtilities.setPortsOrdering = function (nodes, ordering, portDistance) {
  if ( nodes.length === 0 ) {
    return;
  }
  
  if (!options.undoable) {
    elementUtilities.setPortsOrdering(nodes, ordering, portDistance);
  }
  else {
    var param = {
      nodes: nodes,
      ordering: ordering,
      portDistance: portDistance
    };
    
    cy.undoRedo().do("setPortsOrdering", param);
  }
};

module.exports = mainUtilities;
},{"./element-utilities":3,"./option-utilities":6}],6:[function(_dereq_,module,exports){
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
  ur.action("setPortsOrdering", undoRedoActionFunctions.setPortsOrdering, undoRedoActionFunctions.setPortsOrdering);
  
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

  var index = elementUtilities.addStateOrInfoBox(nodes, obj);

  cy.forceRender();

  var result = {
    nodes: nodes,
    index: index,
    obj: obj
  };
  return result;
};

undoRedoActionFunctions.removeStateOrInfoBox = function (param) {
  var index = param.index;
  var nodes = param.nodes;

  var obj = elementUtilities.removeStateOrInfoBox(nodes, index);

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

undoRedoActionFunctions.setPortsOrdering = function(param) {
  var nodes = param.nodes;
  var ordering = param.ordering;
  var portDistance = param.portDistance;
  var connectedEdges = nodes.connectedEdges();
  var nodePropMap = {}; // Node prop map for current status of the nodes it is to be attached to the result map. It includes node ports.
  var edgePropMap = {}; // Edge prop map for current status of the nodes it is to be attached to the result map. It includes edge portsource and porttarget.
  
  // Fill node/edge prop maps for undo/redo actions
  
  // Node prop map includes a copy of node ports
  for ( var i = 0; i < nodes.length; i++ ) {
    var node = nodes[i];
    var ports = node.data('ports');
    nodePropMap[node.id()] = ports.length === 2 ? [ { id: ports[0].id, x: ports[0].x, y: ports[0].y }, { id: ports[1].id, x: ports[1].x, y: ports[1].y } ] : [];
  }
  
  // Node prop map includes a edge portsource and porttarget
  for ( var i = 0; i < connectedEdges.length; i++ ) {
    var edge = connectedEdges[i];
    edgePropMap[edge.id()] = { portsource: edge.data('portsource'), porttarget: edge.data('porttarget') };
  }
  
  var result = {
    nodes: nodes,
    nodePropMap: nodePropMap,
    edgePropMap: edgePropMap
  };
  
  // If this is the first time call related method from element utilities else go back to the stored props of nodes/edges
  if ( param.firstTime ) {
    elementUtilities.setPortsOrdering(nodes, ordering, portDistance);
  }
  else {
    cy.startBatch();
    
    // Go back to stored node ports state
    for ( var i = 0; i < nodes.length; i++ ) {
      var node = nodes[i];
      var ports = param.nodePropMap[node.id()];
      node.data('ports', ports);
    }
    
    // Go back to stored edge portsource/porttargets state
    for ( var i = 0; i < connectedEdges.length; i++ ) {
      var edge = connectedEdges[i];
      var props = param.edgePropMap[edge.id()];
      edge.data('portsource', props.portsource);
      edge.data('porttarget', props.porttarget);
    }
    
    cy.endBatch();
  }
  
  return result;
};

// Section End
// sbgn action functions

module.exports = undoRedoActionFunctions;
},{"./element-utilities":3,"./lib-utilities":4}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9saWItdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3Q4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNobEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpe1xyXG4gIHZhciBjaGlzZSA9IHdpbmRvdy5jaGlzZSA9IGZ1bmN0aW9uKF9vcHRpb25zLCBfbGlicykge1xyXG4gICAgdmFyIGxpYnMgPSB7fTtcclxuICAgIGxpYnMualF1ZXJ5ID0gX2xpYnMualF1ZXJ5IHx8IGpRdWVyeTtcclxuICAgIGxpYnMuY3l0b3NjYXBlID0gX2xpYnMuY3l0b3NjYXBlIHx8IGN5dG9zY2FwZTtcclxuICAgIGxpYnMuc2JnbnZpeiA9IF9saWJzLnNiZ252aXogfHwgc2JnbnZpejtcclxuICAgIGxpYnMuc2F2ZUFzID0gX2xpYnMuZmlsZXNhdmVyanMgPyBfbGlicy5maWxlc2F2ZXJqcy5zYXZlQXMgOiBzYXZlQXM7XHJcbiAgICBcclxuICAgIGxpYnMuc2JnbnZpeihfb3B0aW9ucywgX2xpYnMpOyAvLyBJbml0aWxpemUgc2JnbnZpelxyXG4gICAgXHJcbiAgICAvLyBTZXQgdGhlIGxpYnJhcmllcyB0byBhY2Nlc3MgdGhlbSBmcm9tIGFueSBmaWxlXHJcbiAgICB2YXIgbGliVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpO1xyXG4gICAgbGliVXRpbGl0aWVzLnNldExpYnMobGlicyk7XHJcbiAgICBcclxuICAgIHZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9vcHRpb24tdXRpbGl0aWVzJyk7XHJcbiAgICB2YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zKF9vcHRpb25zKTsgLy8gRXh0ZW5kcyB0aGUgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhlIGdpdmVuIG9wdGlvbnNcclxuICAgIFxyXG4gICAgLy8gVXBkYXRlIHN0eWxlIGFuZCBiaW5kIGV2ZW50c1xyXG4gICAgdmFyIGN5U3R5bGVBbmRFdmVudHMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9jeS1zdHlsZS1hbmQtZXZlbnRzJyk7XHJcbiAgICBjeVN0eWxlQW5kRXZlbnRzKGxpYnMuc2JnbnZpeik7XHJcbiAgICBcclxuICAgIC8vIFJlZ2lzdGVyIHVuZG8vcmVkbyBhY3Rpb25zXHJcbiAgICB2YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9yZWdpc3Rlci11bmRvLXJlZG8tYWN0aW9ucycpO1xyXG4gICAgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMob3B0aW9ucy51bmRvYWJsZURyYWcpO1xyXG4gICAgXHJcbiAgICB2YXIgbWFpblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzJyk7XHJcbiAgICB2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzJyk7XHJcbiAgICB2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy91bmRvLXJlZG8tYWN0aW9uLWZ1bmN0aW9ucycpO1xyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgdGhlIGFwaVxyXG4gICAgXHJcbiAgICAvLyBFeHBvc2UgdGhlIHByb3BlcnRpZXMgaW5oZXJpdGVkIGZyb20gc2JnbnZpelxyXG4gICAgLy8gdGhlbiBvdmVycmlkZSBzb21lIG9mIHRoZXNlIHByb3BlcnRpZXMgYW5kIGV4cG9zZSBzb21lIG5ldyBwcm9wZXJ0aWVzXHJcbiAgICBmb3IgKHZhciBwcm9wIGluIGxpYnMuc2JnbnZpeikge1xyXG4gICAgICBjaGlzZVtwcm9wXSA9IGxpYnMuc2JnbnZpeltwcm9wXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gRXhwb3NlIGVhY2ggbWFpbiB1dGlsaXR5IHNlcGVyYXRlbHlcclxuICAgIGZvciAodmFyIHByb3AgaW4gbWFpblV0aWxpdGllcykge1xyXG4gICAgICBjaGlzZVtwcm9wXSA9IG1haW5VdGlsaXRpZXNbcHJvcF07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEV4cG9zZSBlbGVtZW50VXRpbGl0aWVzIGFuZCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyBhcyBpc1xyXG4gICAgY2hpc2UuZWxlbWVudFV0aWxpdGllcyA9IGVsZW1lbnRVdGlsaXRpZXM7XHJcbiAgICBjaGlzZS51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xyXG4gIH07XHJcbiAgXHJcbiAgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gY2hpc2U7XHJcbiAgfVxyXG59KSgpOyIsInZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyICQgPSBsaWJzLmpRdWVyeTtcclxudmFyIG9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKS5nZXRPcHRpb25zKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzYmdudml6KSB7XHJcbiAgLy9IZWxwZXJzXHJcbiAgdmFyIGluaXRFbGVtZW50RGF0YSA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgIHZhciBlbGVjbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xyXG4gICAgaWYgKCFlbGVjbGFzcykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBlbGVjbGFzcyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVtdWx0aW1lcml6ZUNsYXNzKGVsZWNsYXNzKTtcclxuICAgIHZhciBjbGFzc1Byb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW2VsZWNsYXNzXTtcclxuXHJcbiAgICBjeS5iYXRjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChlbGUuaXNOb2RlKCkpIHtcclxuICAgICAgICBpZiAoY2xhc3NQcm9wZXJ0aWVzWyd3aWR0aCddICYmICFlbGUuZGF0YSgnYmJveCcpLncpIHtcclxuICAgICAgICAgIGVsZS5kYXRhKCdiYm94JykudyA9IGNsYXNzUHJvcGVydGllc1snd2lkdGgnXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNsYXNzUHJvcGVydGllc1snaGVpZ2h0J10gJiYgIWVsZS5kYXRhKCdiYm94JykuaCkge1xyXG4gICAgICAgICAgZWxlLmRhdGEoJ2Jib3gnKS5oID0gY2xhc3NQcm9wZXJ0aWVzWydoZWlnaHQnXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC1zaXplJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydmb250LXNpemUnXSkge1xyXG4gICAgICAgICAgZWxlLmRhdGEoJ2ZvbnQtc2l6ZScsIGNsYXNzUHJvcGVydGllc1snZm9udC1zaXplJ10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdmb250LWZhbWlseScpICYmIGNsYXNzUHJvcGVydGllc1snZm9udC1mYW1pbHknXSkge1xyXG4gICAgICAgICAgZWxlLmRhdGEoJ2ZvbnQtZmFtaWx5JywgY2xhc3NQcm9wZXJ0aWVzWydmb250LWZhbWlseSddKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC1zdHlsZScpICYmIGNsYXNzUHJvcGVydGllc1snZm9udC1zdHlsZSddKSB7XHJcbiAgICAgICAgICBlbGUuZGF0YSgnZm9udC1zdHlsZScsIGNsYXNzUHJvcGVydGllc1snZm9udC1zdHlsZSddKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC13ZWlnaHQnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtd2VpZ2h0J10pIHtcclxuICAgICAgICAgIGVsZS5kYXRhKCdmb250LXdlaWdodCcsIGNsYXNzUHJvcGVydGllc1snZm9udC13ZWlnaHQnXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2JhY2tncm91bmQtY29sb3InKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2JhY2tncm91bmQtY29sb3InXSkge1xyXG4gICAgICAgICAgZWxlLmRhdGEoJ2JhY2tncm91bmQtY29sb3InLCBjbGFzc1Byb3BlcnRpZXNbJ2JhY2tncm91bmQtY29sb3InXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2JhY2tncm91bmQtb3BhY2l0eScpICYmIGNsYXNzUHJvcGVydGllc1snYmFja2dyb3VuZC1vcGFjaXR5J10pIHtcclxuICAgICAgICAgIGVsZS5kYXRhKCdiYWNrZ3JvdW5kLW9wYWNpdHknLCBjbGFzc1Byb3BlcnRpZXNbJ2JhY2tncm91bmQtb3BhY2l0eSddKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnYm9yZGVyLWNvbG9yJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydib3JkZXItY29sb3InXSkge1xyXG4gICAgICAgICAgZWxlLmRhdGEoJ2JvcmRlci1jb2xvcicsIGNsYXNzUHJvcGVydGllc1snYm9yZGVyLWNvbG9yJ10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdib3JkZXItd2lkdGgnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2JvcmRlci13aWR0aCddKSB7XHJcbiAgICAgICAgICBlbGUuZGF0YSgnYm9yZGVyLXdpZHRoJywgY2xhc3NQcm9wZXJ0aWVzWydib3JkZXItd2lkdGgnXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZWxlLmRhdGEoJ3RleHQtd3JhcCcpICYmIGNsYXNzUHJvcGVydGllc1sndGV4dC13cmFwJ10pIHtcclxuICAgICAgICAgIGVsZS5kYXRhKCd0ZXh0LXdyYXAnLCBjbGFzc1Byb3BlcnRpZXNbJ3RleHQtd3JhcCddKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKGVsZS5pc0VkZ2UoKSkge1xyXG4gICAgICAgIGlmICghZWxlLmRhdGEoJ3dpZHRoJykgJiYgY2xhc3NQcm9wZXJ0aWVzWyd3aWR0aCddKSB7XHJcbiAgICAgICAgICBlbGUuZGF0YSgnd2lkdGgnLCBjbGFzc1Byb3BlcnRpZXNbJ3dpZHRoJ10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdsaW5lLWNvbG9yJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydsaW5lLWNvbG9yJ10pIHtcclxuICAgICAgICAgIGVsZS5kYXRhKCdsaW5lLWNvbG9yJywgY2xhc3NQcm9wZXJ0aWVzWydsaW5lLWNvbG9yJ10pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuICBcclxuICAvLyBVcGRhdGUgY3kgc3R5bGVzaGVldFxyXG4gIHZhciB1cGRhdGVTdHlsZVNoZWV0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjeS5zdHlsZSgpXHJcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250LXNpemVdXCIpXHJcbiAgICAuc3R5bGUoe1xyXG4gICAgICAnZm9udC1zaXplJzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgIC8vIElmIG5vZGUgbGFiZWxzIGFyZSBleHBlY3RlZCB0byBiZSBhZGp1c3RlZCBhdXRvbWF0aWNhbGx5IG9yIGVsZW1lbnQgY2Fubm90IGhhdmUgbGFiZWxcclxuICAgICAgICAvLyByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRMYWJlbFRleHRTaXplKCkgZWxzZSByZXR1cm4gZWxlLmRhdGEoJ2ZvbnQtc2l6ZScpXHJcbiAgICAgICAgdmFyIG9wdCA9IG9wdGlvbnMuYWRqdXN0Tm9kZUxhYmVsRm9udFNpemVBdXRvbWF0aWNhbGx5O1xyXG4gICAgICAgIHZhciBhZGp1c3QgPSB0eXBlb2Ygb3B0ID09PSAnZnVuY3Rpb24nID8gb3B0KCkgOiBvcHQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCFhZGp1c3QpIHtcclxuICAgICAgICAgIHJldHVybiBlbGUuZGF0YSgnZm9udC1zaXplJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldExhYmVsVGV4dFNpemUoZWxlKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2ZvbnQtZmFtaWx5XVwiKVxyXG4gICAgLnN0eWxlKHtcclxuICAgICAgJ2ZvbnQtZmFtaWx5JzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnZm9udC1mYW1pbHknKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2ZvbnQtc3R5bGVdXCIpXHJcbiAgICAuc3R5bGUoe1xyXG4gICAgICAnZm9udC1zdHlsZSc6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2ZvbnQtc3R5bGUnKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2ZvbnQtd2VpZ2h0XVwiKVxyXG4gICAgLnN0eWxlKHtcclxuICAgICAgJ2ZvbnQtd2VpZ2h0JzogZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnZm9udC13ZWlnaHQnKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2JhY2tncm91bmQtY29sb3JdXCIpXHJcbiAgICAuc3R5bGUoe1xyXG4gICAgICAnYmFja2dyb3VuZC1jb2xvcic6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2JhY2tncm91bmQtY29sb3InKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2JhY2tncm91bmQtb3BhY2l0eV1cIilcclxuICAgIC5zdHlsZSh7XHJcbiAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdiYWNrZ3JvdW5kLW9wYWNpdHknKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2JvcmRlci13aWR0aF1cIilcclxuICAgIC5zdHlsZSh7XHJcbiAgICAgICdib3JkZXItd2lkdGgnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdib3JkZXItd2lkdGgnKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW2JvcmRlci1jb2xvcl1cIilcclxuICAgIC5zdHlsZSh7XHJcbiAgICAgICdib3JkZXItY29sb3InOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdib3JkZXItY29sb3InKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5zZWxlY3RvcihcIm5vZGVbY2xhc3NdW3RleHQtd3JhcF1cIilcclxuICAgIC5zdHlsZSh7XHJcbiAgICAgICd0ZXh0LXdyYXAnOiBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCd0ZXh0LXdyYXAnKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5zZWxlY3RvcihcImVkZ2VbY2xhc3NdW2xpbmUtY29sb3JdXCIpXHJcbiAgICAuc3R5bGUoe1xyXG4gICAgICAnbGluZS1jb2xvcic6IGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2xpbmUtY29sb3InKTtcclxuICAgICAgfSxcclxuICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnbGluZS1jb2xvcicpO1xyXG4gICAgICB9LFxyXG4gICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdsaW5lLWNvbG9yJyk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzXVt3aWR0aF1cIilcclxuICAgIC5zdHlsZSh7XHJcbiAgICAgICd3aWR0aCc6IGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnd2lkdGgnKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5zZWxlY3RvcihcImVkZ2UuY3ktZXhwYW5kLWNvbGxhcHNlLW1ldGEtZWRnZVwiKVxyXG4gICAgLmNzcyh7XHJcbiAgICAgICdsaW5lLWNvbG9yJzogJyNDNEM0QzQnLFxyXG4gICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyNDNEM0QzQnLFxyXG4gICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyNDNEM0QzQnXHJcbiAgICB9KVxyXG4gICAgLnNlbGVjdG9yKFwibm9kZTpzZWxlY3RlZFwiKVxyXG4gICAgLnN0eWxlKHtcclxuICAgICAgJ2JvcmRlci1jb2xvcic6ICcjZDY3NjE0JyxcclxuICAgICAgJ3RleHQtb3V0bGluZS1jb2xvcic6ICcjMDAwJ1xyXG4gICAgfSlcclxuICAgIC5zZWxlY3RvcihcImVkZ2U6c2VsZWN0ZWRcIilcclxuICAgIC5zdHlsZSh7XHJcbiAgICAgICdsaW5lLWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyNkNjc2MTQnLFxyXG4gICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogJyNkNjc2MTQnXHJcbiAgICB9KS51cGRhdGUoKTtcclxuICB9O1xyXG4gIFxyXG4gIC8vIEJpbmQgZXZlbnRzXHJcbiAgdmFyIGJpbmRDeUV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY3kub24oXCJhZGRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHZhciBlbGUgPSBldmVudC5jeVRhcmdldCB8fCBldmVudC50YXJnZXQ7XHJcbiAgICAgIGluaXRFbGVtZW50RGF0YShlbGUpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuICAvLyBIZWxwZXJzIEVuZFxyXG4gIFxyXG4gIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBleGVjdXRlZCBhZnRlciBkb2N1bWVudC5yZWFkeSBpbiBzYmdudml6IGJlY2F1c2UgaXQgaXMgcmVnaXN0ZXJlZCBsYXRlclxyXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIE9uY2UgY3kgaXMgcmVhZHkgYmluZCBldmVudHMgYW5kIHVwZGF0ZSBzdHlsZSBzaGVldFxyXG4gICAgY3kucmVhZHkoIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGJpbmRDeUV2ZW50cygpO1xyXG4gICAgICB1cGRhdGVTdHlsZVNoZWV0KCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTsiLCIvLyBFeHRlbmRzIHNiZ252aXouZWxlbWVudFV0aWxpdGllc1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIHNiZ252aXogPSBsaWJzLnNiZ252aXo7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzO1xyXG52YXIgb3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpLmdldE9wdGlvbnMoKTtcclxuXHJcbmVsZW1lbnRVdGlsaXRpZXMuUEQgPSB7fTsgLy8gbmFtZXNwYWNlIGZvciBhbGwgUEQgc3BlY2lmaWMgc3R1ZmZcclxuXHJcbmVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXMgPSB7XHJcbiAgXCJwcm9jZXNzXCI6IHtcclxuICAgIHdpZHRoOiAxNSxcclxuICAgIGhlaWdodDogMTUsXHJcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcclxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXHJcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcclxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcclxuICB9LFxyXG4gIFwib21pdHRlZCBwcm9jZXNzXCI6IHtcclxuICAgIHdpZHRoOiAxNSxcclxuICAgIGhlaWdodDogMTUsXHJcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcclxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXHJcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcclxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcclxuICB9LFxyXG4gIFwidW5jZXJ0YWluIHByb2Nlc3NcIjoge1xyXG4gICAgd2lkdGg6IDE1LFxyXG4gICAgaGVpZ2h0OiAxNSxcclxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcclxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxyXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xyXG4gIH0sXHJcbiAgXCJhc3NvY2lhdGlvblwiOiB7XHJcbiAgICB3aWR0aDogMTUsXHJcbiAgICBoZWlnaHQ6IDE1LFxyXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXHJcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxyXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXHJcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXHJcbiAgfSxcclxuICBcImRpc3NvY2lhdGlvblwiOiB7XHJcbiAgICB3aWR0aDogMTUsXHJcbiAgICBoZWlnaHQ6IDE1LFxyXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXHJcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxyXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXHJcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXHJcbiAgfSxcclxuICBcIm1hY3JvbW9sZWN1bGVcIjoge1xyXG4gICAgd2lkdGg6IDcwLFxyXG4gICAgaGVpZ2h0OiAzNSxcclxuICAgICdmb250LXNpemUnOiAxMSxcclxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxyXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcclxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxyXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXHJcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxyXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXHJcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxyXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xyXG4gIH0sXHJcbiAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7XHJcbiAgICB3aWR0aDogNzAsXHJcbiAgICBoZWlnaHQ6IDM1LFxyXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxyXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXHJcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxyXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXHJcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcclxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXHJcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcclxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXHJcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXHJcbiAgfSxcclxuICBcInNpbXBsZSBjaGVtaWNhbFwiOiB7XHJcbiAgICB3aWR0aDogMzUsXHJcbiAgICBoZWlnaHQ6IDM1LFxyXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxyXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXHJcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxyXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXHJcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcclxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXHJcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcclxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXHJcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXHJcbiAgfSxcclxuICBcInNvdXJjZSBhbmQgc2lua1wiOiB7XHJcbiAgICB3aWR0aDogMjUsXHJcbiAgICBoZWlnaHQ6IDI1LFxyXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxyXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXHJcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxyXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXHJcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcclxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXHJcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcclxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXHJcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXHJcbiAgfSxcclxuICBcInRhZ1wiOiB7XHJcbiAgICB3aWR0aDogMzUsXHJcbiAgICBoZWlnaHQ6IDM1LFxyXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxyXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXHJcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxyXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXHJcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcclxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXHJcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcclxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXHJcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXHJcbiAgfSxcclxuICBcInBoZW5vdHlwZVwiOiB7XHJcbiAgICB3aWR0aDogNzAsXHJcbiAgICBoZWlnaHQ6IDM1LFxyXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxyXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXHJcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxyXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXHJcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcclxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXHJcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcclxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXHJcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXHJcbiAgfSxcclxuICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiB7XHJcbiAgICB3aWR0aDogNzAsXHJcbiAgICBoZWlnaHQ6IDM1LFxyXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxyXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXHJcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxyXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXHJcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcclxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXHJcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcclxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXHJcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXHJcbiAgfSxcclxuICBcInBlcnR1cmJpbmcgYWdlbnRcIjoge1xyXG4gICAgd2lkdGg6IDcwLFxyXG4gICAgaGVpZ2h0OiAzNSxcclxuICAgICdmb250LXNpemUnOiAxMSxcclxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxyXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcclxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxyXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXHJcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxyXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXHJcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxyXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xyXG4gIH0sXHJcbiAgXCJjb21wbGV4XCI6IHtcclxuICAgIHdpZHRoOiAxMDAsXHJcbiAgICBoZWlnaHQ6IDEwMCxcclxuICAgICdmb250LXNpemUnOiAxMSxcclxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxyXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcclxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxyXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXHJcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxyXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXHJcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxyXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xyXG4gIH0sXHJcbiAgXCJjb21wYXJ0bWVudFwiOiB7XHJcbiAgICB3aWR0aDogMTAwLFxyXG4gICAgaGVpZ2h0OiAxMDAsXHJcbiAgICAnZm9udC1zaXplJzogMTEsXHJcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcclxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXHJcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcclxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcclxuICAgICdib3JkZXItd2lkdGgnOiAzLjI1LFxyXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcclxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcclxuICB9LFxyXG4gIFwiYW5kXCI6IHtcclxuICAgIHdpZHRoOiAyNSxcclxuICAgIGhlaWdodDogMjUsXHJcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcclxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXHJcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcclxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcclxuICB9LFxyXG4gIFwib3JcIjoge1xyXG4gICAgd2lkdGg6IDI1LFxyXG4gICAgaGVpZ2h0OiAyNSxcclxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcclxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxyXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xyXG4gIH0sXHJcbiAgXCJub3RcIjoge1xyXG4gICAgd2lkdGg6IDI1LFxyXG4gICAgaGVpZ2h0OiAyNSxcclxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxyXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcclxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxyXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xyXG4gIH0sXHJcbiAgXCJjb25zdW1wdGlvblwiOiB7XHJcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcclxuICAgICd3aWR0aCc6IDEuMjVcclxuICB9LFxyXG4gIFwicHJvZHVjdGlvblwiOiB7XHJcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcclxuICAgICd3aWR0aCc6IDEuMjVcclxuICB9LFxyXG4gIFwibW9kdWxhdGlvblwiOiB7XHJcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcclxuICAgICd3aWR0aCc6IDEuMjVcclxuICB9LFxyXG4gIFwic3RpbXVsYXRpb25cIjoge1xyXG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXHJcbiAgICAnd2lkdGgnOiAxLjI1XHJcbiAgfSxcclxuICBcImNhdGFseXNpc1wiOiB7XHJcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcclxuICAgICd3aWR0aCc6IDEuMjVcclxuICB9LFxyXG4gIFwiaW5oaWJpdGlvblwiOiB7XHJcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcclxuICAgICd3aWR0aCc6IDEuMjVcclxuICB9LFxyXG4gIFwibmVjZXNzYXJ5IHN0aW11bGF0aW9uXCI6IHtcclxuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxyXG4gICAgJ3dpZHRoJzogMS4yNVxyXG4gIH0sXHJcbiAgXCJsb2dpYyBhcmNcIjoge1xyXG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXHJcbiAgICAnd2lkdGgnOiAxLjI1XHJcbiAgfSxcclxuICBcImVxdWl2YWxlbmNlIGFyY1wiOiB7XHJcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcclxuICAgICd3aWR0aCc6IDEuMjVcclxuICB9XHJcbn07XHJcblxyXG5cclxuLypcclxuICBzZWUgaHR0cDovL2pvdXJuYWwuaW1iaW8uZGUvYXJ0aWNsZXMvcGRmL2ppYi0yNjMucGRmIHAuNDEgPC0tIGJ1dCBiZXdhcmUsIG91dGRhdGVkXHJcbiAgZm9sbG93aW5nIHRhYmxlcyBoYXZlIGJlZW4gdXBkYXRlZCB3aXRoIFBEIGx2bDEgdjIuMCBvZiBOb3ZlbWJlciA3LCAyMDE2IHdvcmtpbmcgZHJhZnRcclxuICBvbmx5IHRoZSBmb2xsb3dpbmcgdGhpbmdzIGhhdmUgYmVlbiBjaGFuZ2VkIGZyb20gMi4wICh0aGlzIHZlcnNpb24gaXMgbm90IGNsZWFyIG9uIGNvbm5lY3Rpdml0eSk6XHJcbiAgIC0gZW1wdHkgc2V0IGhhcyBubyBsaW1pdCBvbiBpdHMgZWRnZSBjb3VudFxyXG4gICAtIGxvZ2ljIG9wZXJhdG9ycyBjYW4gYmUgc291cmNlIGFuZCB0YXJnZXRcclxuICAgLSBsaW1pdCBvZiAxIGNhdGFseXNpcyBhbmQgMSBuZWNlc3Nhcnkgc3RpbXVsYXRpb24gb24gYSBwcm9jZXNzXHJcblxyXG4gIGZvciBlYWNoIGVkZ2UgY2xhc3MgYW5kIG5vZGVjbGFzcyBkZWZpbmUgMiBjYXNlczpcclxuICAgLSBub2RlIGNhbiBiZSBhIHNvdXJjZSBvZiB0aGlzIGVkZ2UgLT4gYXNTb3VyY2VcclxuICAgLSBub2RlIGNhbiBiZSBhIHRhcmdldCBvZiB0aGlzIGVkZ2UgLT4gYXNUYXJnZXRcclxuICBmb3IgYm90aCBjYXNlcywgdGVsbHMgaWYgaXQgaXMgYWxsb3dlZCBhbmQgd2hhdCBpcyB0aGUgbGltaXQgb2YgZWRnZXMgYWxsb3dlZC5cclxuICBMaW1pdHMgY2FuIGNvbmNlcm4gb25seSB0aGlzIHR5cGUgb2YgZWRnZSAobWF4RWRnZSkgb3IgdGhlIHRvdGFsIG51bWJlciBvZiBlZGdlcyBmb3IgdGhpcyBub2RlIChtYXhUb3RhbCkuXHJcbiAgLTEgZWRnZSBtZWFucyBubyBsaW1pdFxyXG5cclxuICB0aGUgbm9kZXMvZWRnZXMgY2xhc3MgbGlzdGVkIGJlbG93IGFyZSB0aG9zZSB1c2VkIGluIHRoZSBwcm9ncmFtLlxyXG4gIEZvciBpbnN0YW5jZSBcImNvbXBhcnRtZW50XCIgaXNuJ3QgYSBub2RlIGluIFNCR04gc3BlY3MuXHJcbiovXHJcbmVsZW1lbnRVdGlsaXRpZXMuUEQuY29ubmVjdGl2aXR5Q29uc3RyYWludHMgPSB7XHJcbiAgXCJjb25zdW1wdGlvblwiOiB7XHJcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfX0sXHJcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX1cclxuICB9LFxyXG4gIFwicHJvZHVjdGlvblwiOiB7XHJcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImRpc3NvY2lhdGlvblwiOiAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19XHJcbiAgfSxcclxuICBcIm1vZHVsYXRpb25cIjoge1xyXG4gICAgXCJtYWNyb21vbGVjdWxlXCI6ICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwic2ltcGxlIGNoZW1pY2FsXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJjb21wbGV4XCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjogICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwidW5jZXJ0YWluIHByb2Nlc3NcIjogICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImRpc3NvY2lhdGlvblwiOiAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19XHJcbiAgfSxcclxuICBcInN0aW11bGF0aW9uXCI6IHtcclxuICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInNvdXJjZSBhbmQgc2lua1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInByb2Nlc3NcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImFzc29jaWF0aW9uXCI6ICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJub3RcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fVxyXG4gIH0sXHJcbiAgXCJjYXRhbHlzaXNcIjoge1xyXG4gICAgXCJtYWNyb21vbGVjdWxlXCI6ICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwic2ltcGxlIGNoZW1pY2FsXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJjb21wbGV4XCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjogICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX1cclxuICB9LFxyXG4gIFwiaW5oaWJpdGlvblwiOiB7XHJcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX1cclxuICB9LFxyXG4gIFwibmVjZXNzYXJ5IHN0aW11bGF0aW9uXCI6IHtcclxuICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInNvdXJjZSBhbmQgc2lua1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInByb2Nlc3NcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImRpc3NvY2lhdGlvblwiOiAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gIH0sXHJcbiAgXCJsb2dpYyBhcmNcIjoge1xyXG4gICAgXCJtYWNyb21vbGVjdWxlXCI6ICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwic2ltcGxlIGNoZW1pY2FsXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJjb21wbGV4XCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjogICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImFzc29jaWF0aW9uXCI6ICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfX0sXHJcbiAgfSxcclxuICBcImVxdWl2YWxlbmNlIGFyY1wiOiB7XHJcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInByb2Nlc3NcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwidW5jZXJ0YWluIHByb2Nlc3NcIjogICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXHJcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxyXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcclxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX1cclxuICB9XHJcbn07XHJcblxyXG5cclxuLy8gU2VjdGlvbiBTdGFydFxyXG4vLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xyXG5cclxuLy8gc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzg4MDk0NzJcclxuLy8gd2UgbmVlZCB0byB0YWtlIGNhcmUgb2Ygb3VyIG93biBJRHMgYmVjYXVzZSB0aGUgb25lcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBjeXRvc2NhcGUgKGFsc28gVVVJRClcclxuLy8gZG9uJ3QgY29tcGx5IHdpdGggeHNkOlNJRCB0eXBlIHRoYXQgbXVzdCBub3QgYmVnaW4gd2l0aCBhIG51bWJlclxyXG5mdW5jdGlvbiBnZW5lcmF0ZVVVSUQgKCkgeyAvLyBQdWJsaWMgRG9tYWluL01JVFxyXG4gICAgdmFyIGQgPSBEYXRlLm5vdygpO1xyXG4gICAgaWYgKHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHBlcmZvcm1hbmNlLm5vdyA9PT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICAgICAgZCArPSBwZXJmb3JtYW5jZS5ub3coKTsgLy91c2UgaGlnaC1wcmVjaXNpb24gdGltZXIgaWYgYXZhaWxhYmxlXHJcbiAgICB9XHJcbiAgICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xyXG4gICAgICAgIHZhciByID0gKGQgKyBNYXRoLnJhbmRvbSgpICogMTYpICUgMTYgfCAwO1xyXG4gICAgICAgIGQgPSBNYXRoLmZsb29yKGQgLyAxNik7XHJcbiAgICAgICAgcmV0dXJuIChjID09PSAneCcgPyByIDogKHIgJiAweDMgfCAweDgpKS50b1N0cmluZygxNik7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZWxlbWVudFV0aWxpdGllcy5hZGROb2RlID0gZnVuY3Rpb24gKHgsIHksIHNiZ25jbGFzcywgaWQsIHBhcmVudCwgdmlzaWJpbGl0eSkge1xyXG4gIHZhciBkZWZhdWx0UHJvcGVydGllcyA9IHRoaXMuZGVmYXVsdFByb3BlcnRpZXM7XHJcbiAgdmFyIGRlZmF1bHRzID0gZGVmYXVsdFByb3BlcnRpZXNbc2JnbmNsYXNzXTtcclxuXHJcbiAgdmFyIHdpZHRoID0gZGVmYXVsdHMgPyBkZWZhdWx0cy53aWR0aCA6IDUwO1xyXG4gIHZhciBoZWlnaHQgPSBkZWZhdWx0cyA/IGRlZmF1bHRzLmhlaWdodCA6IDUwO1xyXG4gIFxyXG4gIHZhciBjc3MgPSB7fTtcclxuICBcclxuICBpZiAodmlzaWJpbGl0eSkge1xyXG4gICAgY3NzLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xyXG4gIH1cclxuXHJcbiAgaWYgKGRlZmF1bHRzICYmIGRlZmF1bHRzLm11bHRpbWVyKSB7XHJcbiAgICBzYmduY2xhc3MgKz0gXCIgbXVsdGltZXJcIjtcclxuICB9XHJcbiAgdmFyIGRhdGEgPSB7XHJcbiAgICBjbGFzczogc2JnbmNsYXNzLFxyXG4gICAgYmJveDoge1xyXG4gICAgICBoOiBoZWlnaHQsXHJcbiAgICAgIHc6IHdpZHRoLFxyXG4gICAgICB4OiB4LFxyXG4gICAgICB5OiB5XHJcbiAgICB9LFxyXG4gICAgc3RhdGVzYW5kaW5mb3M6IFtdLFxyXG4gICAgcG9ydHM6IFtdLFxyXG4gICAgY2xvbmVtYXJrZXI6IGRlZmF1bHRzICYmIGRlZmF1bHRzLmNsb25lbWFya2VyID8gZGVmYXVsdHMuY2xvbmVtYXJrZXIgOiB1bmRlZmluZWRcclxuICB9O1xyXG5cclxuICBpZihpZCkge1xyXG4gICAgZGF0YS5pZCA9IGlkO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGRhdGEuaWQgPSBcIm53dE5fXCIgKyBnZW5lcmF0ZVVVSUQoKTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKHBhcmVudCkge1xyXG4gICAgZGF0YS5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgfVxyXG5cclxuICB2YXIgZWxlcyA9IGN5LmFkZCh7XHJcbiAgICBncm91cDogXCJub2Rlc1wiLFxyXG4gICAgZGF0YTogZGF0YSxcclxuICAgIGNzczogY3NzLFxyXG4gICAgcG9zaXRpb246IHtcclxuICAgICAgeDogeCxcclxuICAgICAgeTogeVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICB2YXIgbmV3Tm9kZSA9IGVsZXNbZWxlcy5sZW5ndGggLSAxXTtcclxuXHJcbiAgcmV0dXJuIG5ld05vZGU7XHJcbn07XHJcblxyXG5lbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UgPSBmdW5jdGlvbiAoc291cmNlLCB0YXJnZXQsIHNiZ25jbGFzcywgaWQsIHZpc2liaWxpdHkpIHtcclxuICB2YXIgZGVmYXVsdFByb3BlcnRpZXMgPSB0aGlzLmRlZmF1bHRQcm9wZXJ0aWVzO1xyXG4gIHZhciBkZWZhdWx0cyA9IGRlZmF1bHRQcm9wZXJ0aWVzW3NiZ25jbGFzc107XHJcbiAgXHJcbiAgdmFyIGNzcyA9IHt9O1xyXG5cclxuICBpZiAodmlzaWJpbGl0eSkge1xyXG4gICAgY3NzLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xyXG4gIH1cclxuXHJcbiAgdmFyIGRhdGEgPSB7XHJcbiAgICAgIHNvdXJjZTogc291cmNlLFxyXG4gICAgICB0YXJnZXQ6IHRhcmdldCxcclxuICAgICAgY2xhc3M6IHNiZ25jbGFzc1xyXG4gIH07XHJcbiAgXHJcbiAgaWYoaWQpIHtcclxuICAgIGRhdGEuaWQgPSBpZDtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBkYXRhLmlkID0gXCJud3RFX1wiICsgZ2VuZXJhdGVVVUlEKCk7XHJcbiAgfVxyXG5cclxuICB2YXIgZWxlcyA9IGN5LmFkZCh7XHJcbiAgICBncm91cDogXCJlZGdlc1wiLFxyXG4gICAgZGF0YTogZGF0YSxcclxuICAgIGNzczogY3NzXHJcbiAgfSk7XHJcblxyXG4gIHZhciBuZXdFZGdlID0gZWxlc1tlbGVzLmxlbmd0aCAtIDFdO1xyXG4gIFxyXG4gIHJldHVybiBuZXdFZGdlO1xyXG59O1xyXG5cclxuZWxlbWVudFV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyA9IGZ1bmN0aW9uKF9zb3VyY2UsIF90YXJnZXQsIHByb2Nlc3NUeXBlKSB7XHJcbiAgLy8gSWYgc291cmNlIGFuZCB0YXJnZXQgSURzIGFyZSBnaXZlbiBnZXQgdGhlIGVsZW1lbnRzIGJ5IElEc1xyXG4gIHZhciBzb3VyY2UgPSB0eXBlb2YgX3NvdXJjZSA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfc291cmNlKSA6IF9zb3VyY2U7XHJcbiAgdmFyIHRhcmdldCA9IHR5cGVvZiBfdGFyZ2V0ID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF90YXJnZXQpIDogX3RhcmdldDtcclxuICBcclxuICAvLyBQcm9jZXNzIHBhcmVudCBzaG91bGQgYmUgdGhlIGNsb3Nlc3QgY29tbW9uIGFuY2VzdG9yIG9mIHRoZSBzb3VyY2UgYW5kIHRhcmdldCBub2Rlc1xyXG4gIHZhciBwcm9jZXNzUGFyZW50ID0gY3kuY29sbGVjdGlvbihbc291cmNlWzBdLCB0YXJnZXRbMF1dKS5jb21tb25BbmNlc3RvcnMoKS5maXJzdCgpO1xyXG4gIFxyXG4gIC8vIFByb2Nlc3Mgc2hvdWxkIGJlIGF0IHRoZSBtaWRkbGUgb2YgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0IG5vZGVzXHJcbiAgdmFyIHggPSAoIHNvdXJjZS5wb3NpdGlvbigneCcpICsgdGFyZ2V0LnBvc2l0aW9uKCd4JykgKSAvIDI7XHJcbiAgdmFyIHkgPSAoIHNvdXJjZS5wb3NpdGlvbigneScpICsgdGFyZ2V0LnBvc2l0aW9uKCd5JykgKSAvIDI7XHJcbiAgXHJcbiAgLy8gQ3JlYXRlIHRoZSBwcm9jZXNzIHdpdGggZ2l2ZW4vY2FsY3VsYXRlZCB2YXJpYWJsZXNcclxuICB2YXIgcHJvY2VzcyA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4LCB5LCBwcm9jZXNzVHlwZSwgdW5kZWZpbmVkLCBwcm9jZXNzUGFyZW50LmlkKCkpO1xyXG4gIFxyXG4gIC8vIENyZWF0ZSB0aGUgZWRnZXMgb25lIGlzIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSBzb3VyY2Ugbm9kZSAod2hpY2ggc2hvdWxkIGJlIGEgY29uc3VtcHRpb24pLCBcclxuICAvLyB0aGUgb3RoZXIgb25lIGlzIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSB0YXJnZXQgbm9kZSAod2hpY2ggc2hvdWxkIGJlIGEgcHJvZHVjdGlvbikuXHJcbiAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gcGxlYXNlIHJlZmVyIHRvIFNCR04tUEQgcmVmZXJlbmNlIGNhcmQuXHJcbiAgdmFyIGVkZ2VCdHdTcmMgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2Uoc291cmNlLmlkKCksIHByb2Nlc3MuaWQoKSwgJ2NvbnN1bXB0aW9uJyk7XHJcbiAgdmFyIGVkZ2VCdHdUZ3QgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCB0YXJnZXQuaWQoKSwgJ3Byb2R1Y3Rpb24nKTtcclxuICBcclxuICAvLyBDcmVhdGUgYSBjb2xsZWN0aW9uIGluY2x1ZGluZyB0aGUgZWxlbWVudHMgYW5kIHRvIGJlIHJldHVybmVkXHJcbiAgdmFyIGNvbGxlY3Rpb24gPSBjeS5jb2xsZWN0aW9uKFtwcm9jZXNzWzBdLCBlZGdlQnR3U3JjWzBdLCBlZGdlQnR3VGd0WzBdXSk7XHJcbiAgcmV0dXJuIGNvbGxlY3Rpb247XHJcbn07XHJcblxyXG4vKlxyXG4gKiBSZXR1cm5zIGlmIHRoZSBlbGVtZW50cyB3aXRoIHRoZSBnaXZlbiBwYXJlbnQgY2xhc3MgY2FuIGJlIHBhcmVudCBvZiB0aGUgZWxlbWVudHMgd2l0aCB0aGUgZ2l2ZW4gbm9kZSBjbGFzc1xyXG4gKi9cclxuZWxlbWVudFV0aWxpdGllcy5pc1ZhbGlkUGFyZW50ID0gZnVuY3Rpb24oX25vZGVDbGFzcywgX3BhcmVudENsYXNzKSB7XHJcbiAgLy8gSWYgbm9kZUNsYXNzIGFuZCBwYXJlbnRDbGFzcyBwYXJhbXMgYXJlIGVsZW1lbnRzIGl0c2VsdmVzIGluc3RlYWQgb2YgdGhlaXIgY2xhc3MgbmFtZXMgaGFuZGxlIGl0XHJcbiAgdmFyIG5vZGVDbGFzcyA9IHR5cGVvZiBfbm9kZUNsYXNzICE9PSAnc3RyaW5nJyA/IF9ub2RlQ2xhc3MuZGF0YSgnY2xhc3MnKSA6IF9ub2RlQ2xhc3M7XHJcbiAgdmFyIHBhcmVudENsYXNzID0gX3BhcmVudENsYXNzICE9IHVuZGVmaW5lZCAmJiB0eXBlb2YgX3BhcmVudENsYXNzICE9PSAnc3RyaW5nJyA/IF9wYXJlbnRDbGFzcy5kYXRhKCdjbGFzcycpIDogX3BhcmVudENsYXNzO1xyXG4gIFxyXG4gIGlmIChwYXJlbnRDbGFzcyA9PSB1bmRlZmluZWQgfHwgcGFyZW50Q2xhc3MgPT09ICdjb21wYXJ0bWVudCcpIHsgLy8gQ29tcGFydG1lbnRzIGFuZCB0aGUgcm9vdCBjYW4gaW5jbHVkZSBhbnkgdHlwZSBvZiBub2Rlc1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHBhcmVudENsYXNzID09PSAnY29tcGxleCcpIHsgLy8gQ29tcGxleGVzIGNhbiBvbmx5IGluY2x1ZGUgRVBOc1xyXG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyhub2RlQ2xhc3MpO1xyXG4gIH1cclxuICBcclxuICByZXR1cm4gZmFsc2U7IC8vIEN1cnJlbnRseSBqdXN0ICdjb21wYXJ0bWVudCcgYW5kICdjb21wbGV4JyBjb21wb3VuZHMgYXJlIHN1cHBvcnRlZCByZXR1cm4gZmFsc2UgZm9yIGFueSBvdGhlciBwYXJlbnRDbGFzc1xyXG59O1xyXG5cclxuLypcclxuICogVGhpcyBtZXRob2QgYXNzdW1lcyB0aGF0IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQgY29udGFpbnMgYXQgbGVhc3Qgb25lIG5vZGVcclxuICogYW5kIGFsbCBvZiB0aGUgbm9kZXMgaW5jbHVkaW5nIGluIGl0IGhhdmUgdGhlIHNhbWUgcGFyZW50LiBJdCBjcmVhdGVzIGEgY29tcG91bmQgZm90IHRoZSBnaXZlbiBub2RlcyBhbiBoYXZpbmcgdGhlIGdpdmVuIHR5cGUuXHJcbiAqL1xyXG5lbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChub2Rlc1RvTWFrZUNvbXBvdW5kLCBjb21wb3VuZFR5cGUpIHtcclxuICB2YXIgb2xkUGFyZW50SWQgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJwYXJlbnRcIik7XHJcbiAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZC4geCwgeSBhbmQgaWQgcGFyYW1ldGVycyBhcmUgbm90IHNldC5cclxuICB2YXIgbmV3Q29tcG91bmQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUodW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbXBvdW5kVHlwZSwgdW5kZWZpbmVkLCBvbGRQYXJlbnRJZCk7XHJcbiAgdmFyIG5ld0NvbXBvdW5kSWQgPSBuZXdDb21wb3VuZC5pZCgpO1xyXG4gIHZhciBuZXdFbGVzID0gbm9kZXNUb01ha2VDb21wb3VuZC5tb3ZlKHtwYXJlbnQ6IG5ld0NvbXBvdW5kSWR9KTtcclxuICBuZXdFbGVzID0gbmV3RWxlcy51bmlvbihuZXdDb21wb3VuZCk7XHJcbiAgcmV0dXJuIG5ld0VsZXM7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcclxuICogaW4gdGhlIGNvbXBsZXguIFBhcmFtZXRlcnMgYXJlIGV4cGxhaW5lZCBiZWxvdy5cclxuICogdGVtcGxhdGVUeXBlOiBUaGUgdHlwZSBvZiB0aGUgdGVtcGxhdGUgcmVhY3Rpb24uIEl0IG1heSBiZSAnYXNzb2NpYXRpb24nIG9yICdkaXNzb2NpYXRpb24nIGZvciBub3cuXHJcbiAqIG1hY3JvbW9sZWN1bGVMaXN0OiBUaGUgbGlzdCBvZiB0aGUgbmFtZXMgb2YgbWFjcm9tb2xlY3VsZXMgd2hpY2ggd2lsbCBpbnZvbHZlIGluIHRoZSByZWFjdGlvbi5cclxuICogY29tcGxleE5hbWU6IFRoZSBuYW1lIG9mIHRoZSBjb21wbGV4IGluIHRoZSByZWFjdGlvbi5cclxuICogcHJvY2Vzc1Bvc2l0aW9uOiBUaGUgbW9kYWwgcG9zaXRpb24gb2YgdGhlIHByb2Nlc3MgaW4gdGhlIHJlYWN0aW9uLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyB0aGUgY2VudGVyIG9mIHRoZSBjYW52YXMuXHJcbiAqIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cclxuICogdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IFRoaXMgb3B0aW9uIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBjb3NlLWJpbGtlbnQgbGF5b3V0IHdpdGggdGhlIHNhbWUgbmFtZS4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgMTUuXHJcbiAqIGVkZ2VMZW5ndGg6IFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBwcm9jZXNzIGFuZCB0aGUgbWFjcm9tb2xlY3VsZXMgYXQgdGhlIGJvdGggc2lkZXMuXHJcbiAqL1xyXG5lbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAodGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCkge1xyXG4gIHZhciBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbXCJtYWNyb21vbGVjdWxlXCJdO1xyXG4gIHZhciB0ZW1wbGF0ZVR5cGUgPSB0ZW1wbGF0ZVR5cGU7XHJcbiAgdmFyIHByb2Nlc3NXaWR0aCA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbdGVtcGxhdGVUeXBlXSA/IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbdGVtcGxhdGVUeXBlXS53aWR0aCA6IDUwO1xyXG4gIHZhciBtYWNyb21vbGVjdWxlV2lkdGggPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA/IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLndpZHRoIDogNTA7XHJcbiAgdmFyIG1hY3JvbW9sZWN1bGVIZWlnaHQgPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA/IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLmhlaWdodCA6IDUwO1xyXG4gIHZhciBwcm9jZXNzUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24gPyBwcm9jZXNzUG9zaXRpb24gOiBlbGVtZW50VXRpbGl0aWVzLmNvbnZlcnRUb01vZGVsUG9zaXRpb24oe3g6IGN5LndpZHRoKCkgLyAyLCB5OiBjeS5oZWlnaHQoKSAvIDJ9KTtcclxuICB2YXIgbWFjcm9tb2xlY3VsZUxpc3QgPSBtYWNyb21vbGVjdWxlTGlzdDtcclxuICB2YXIgY29tcGxleE5hbWUgPSBjb21wbGV4TmFtZTtcclxuICB2YXIgbnVtT2ZNYWNyb21vbGVjdWxlcyA9IG1hY3JvbW9sZWN1bGVMaXN0Lmxlbmd0aDtcclxuICB2YXIgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsID0gdGlsaW5nUGFkZGluZ1ZlcnRpY2FsID8gdGlsaW5nUGFkZGluZ1ZlcnRpY2FsIDogMTU7XHJcbiAgdmFyIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID0gdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPyB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA6IDE1O1xyXG4gIHZhciBlZGdlTGVuZ3RoID0gZWRnZUxlbmd0aCA/IGVkZ2VMZW5ndGggOiA2MDtcclxuXHJcbiAgY3kuc3RhcnRCYXRjaCgpO1xyXG5cclxuICB2YXIgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXM7XHJcbiAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xyXG4gICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xyXG4gIH1cclxuXHJcbiAgLy9DcmVhdGUgdGhlIHByb2Nlc3MgaW4gdGVtcGxhdGUgdHlwZVxyXG4gIHZhciBwcm9jZXNzID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwgdGVtcGxhdGVUeXBlKTtcclxuICBwcm9jZXNzLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xyXG5cclxuICAvL0RlZmluZSB0aGUgc3RhcnRpbmcgeSBwb3NpdGlvblxyXG4gIHZhciB5UG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZNYWNyb21vbGVjdWxlcyAtIDEpIC8gMikgKiAobWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XHJcblxyXG4gIC8vQ3JlYXRlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1PZk1hY3JvbW9sZWN1bGVzOyBpKyspIHtcclxuICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzLCB5UG9zaXRpb24sIFwibWFjcm9tb2xlY3VsZVwiKTtcclxuICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcbiAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgbWFjcm9tb2xlY3VsZUxpc3RbaV0pO1xyXG5cclxuICAgIC8vY3JlYXRlIHRoZSBlZGdlIGNvbm5lY3RlZCB0byB0aGUgbmV3IG1hY3JvbW9sZWN1bGVcclxuICAgIHZhciBuZXdFZGdlO1xyXG4gICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xyXG4gICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKG5ld05vZGUuaWQoKSwgcHJvY2Vzcy5pZCgpLCAnY29uc3VtcHRpb24nKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgbmV3Tm9kZS5pZCgpLCAncHJvZHVjdGlvbicpO1xyXG4gICAgfVxyXG5cclxuICAgIG5ld0VkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcblxyXG4gICAgLy91cGRhdGUgdGhlIHkgcG9zaXRpb25cclxuICAgIHlQb3NpdGlvbiArPSBtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xyXG4gIH1cclxuXHJcbiAgLy9DcmVhdGUgdGhlIGNvbXBsZXggaW5jbHVkaW5nIG1hY3JvbW9sZWN1bGVzIGluc2lkZSBvZiBpdFxyXG4gIC8vVGVtcHJvcmFyaWx5IGFkZCBpdCB0byB0aGUgcHJvY2VzcyBwb3NpdGlvbiB3ZSB3aWxsIG1vdmUgaXQgYWNjb3JkaW5nIHRvIHRoZSBsYXN0IHNpemUgb2YgaXRcclxuICB2YXIgY29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksICdjb21wbGV4Jyk7XHJcbiAgY29tcGxleC5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcclxuICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcclxuXHJcbiAgLy9JZiBhIG5hbWUgaXMgc3BlY2lmaWVkIGZvciB0aGUgY29tcGxleCBzZXQgaXRzIGxhYmVsIGFjY29yZGluZ2x5XHJcbiAgaWYgKGNvbXBsZXhOYW1lKSB7XHJcbiAgICBjb21wbGV4LmRhdGEoJ2xhYmVsJywgY29tcGxleE5hbWUpO1xyXG4gIH1cclxuXHJcbiAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubm5lY3RlZCB0byB0aGUgY29tcGxleFxyXG4gIHZhciBlZGdlT2ZDb21wbGV4O1xyXG4gIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcclxuICAgIGVkZ2VPZkNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBjb21wbGV4LmlkKCksICdwcm9kdWN0aW9uJyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWRnZU9mQ29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShjb21wbGV4LmlkKCksIHByb2Nlc3MuaWQoKSwgJ2NvbnN1bXB0aW9uJyk7XHJcbiAgfVxyXG4gIGVkZ2VPZkNvbXBsZXguZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcblxyXG4gIC8vQ3JlYXRlIHRoZSBtYWNyb21vbGVjdWxlcyBpbnNpZGUgdGhlIGNvbXBsZXhcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mTWFjcm9tb2xlY3VsZXM7IGkrKykge1xyXG4gICAgLy8gQWRkIGEgbWFjcm9tb2xlY3VsZSBub3QgaGF2aW5nIGEgcHJldmlvdXNseSBkZWZpbmVkIGlkIGFuZCBoYXZpbmcgdGhlIGNvbXBsZXggY3JlYXRlZCBpbiB0aGlzIHJlYWN0aW9uIGFzIHBhcmVudFxyXG4gICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoY29tcGxleC5wb3NpdGlvbigneCcpLCBjb21wbGV4LnBvc2l0aW9uKCd5JyksIFwibWFjcm9tb2xlY3VsZVwiLCB1bmRlZmluZWQsIGNvbXBsZXguaWQoKSk7XHJcbiAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xyXG4gICAgbmV3Tm9kZS5kYXRhKCdsYWJlbCcsIG1hY3JvbW9sZWN1bGVMaXN0W2ldKTtcclxuICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkTGF5b3V0Tm9kZScsIHRydWUpO1xyXG4gIH1cclxuICBcclxuICBjeS5lbmRCYXRjaCgpO1xyXG5cclxuICB2YXIgbGF5b3V0Tm9kZXMgPSBjeS5ub2RlcygnW2p1c3RBZGRlZExheW91dE5vZGVdJyk7XHJcbiAgbGF5b3V0Tm9kZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkTGF5b3V0Tm9kZScpO1xyXG4gIHZhciBsYXlvdXQgPSBsYXlvdXROb2Rlcy5sYXlvdXQoe1xyXG4gICAgbmFtZTogJ2Nvc2UtYmlsa2VudCcsXHJcbiAgICByYW5kb21pemU6IGZhbHNlLFxyXG4gICAgZml0OiBmYWxzZSxcclxuICAgIGFuaW1hdGU6IGZhbHNlLFxyXG4gICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXHJcbiAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXHJcbiAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vcmUtcG9zaXRpb24gdGhlIG5vZGVzIGluc2lkZSB0aGUgY29tcGxleFxyXG4gICAgICB2YXIgc3VwcG9zZWRYUG9zaXRpb247XHJcbiAgICAgIHZhciBzdXBwb3NlZFlQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi55O1xyXG5cclxuICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xyXG4gICAgICAgIHN1cHBvc2VkWFBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIGNvbXBsZXgub3V0ZXJXaWR0aCgpIC8gMjtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBzdXBwb3NlZFhQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBjb21wbGV4Lm91dGVyV2lkdGgoKSAvIDI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBwb3NpdGlvbkRpZmZYID0gc3VwcG9zZWRYUG9zaXRpb24gLSBjb21wbGV4LnBvc2l0aW9uKCd4Jyk7XHJcbiAgICAgIHZhciBwb3NpdGlvbkRpZmZZID0gc3VwcG9zZWRZUG9zaXRpb24gLSBjb21wbGV4LnBvc2l0aW9uKCd5Jyk7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NpdGlvbkRpZmZYLCB5OiBwb3NpdGlvbkRpZmZZfSwgY29tcGxleCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgLy8gRG8gdGhpcyBjaGVjayBmb3IgY3l0b3NjYXBlLmpzIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcclxuICBpZiAobGF5b3V0ICYmIGxheW91dC5ydW4pIHtcclxuICAgIGxheW91dC5ydW4oKTtcclxuICB9XHJcblxyXG4gIC8vZmlsdGVyIHRoZSBqdXN0IGFkZGVkIGVsZW1lbXRzIHRvIHJldHVybiB0aGVtIGFuZCByZW1vdmUganVzdCBhZGRlZCBtYXJrXHJcbiAgdmFyIGVsZXMgPSBjeS5lbGVtZW50cygnW2p1c3RBZGRlZF0nKTtcclxuICBlbGVzLnJlbW92ZURhdGEoJ2p1c3RBZGRlZCcpO1xyXG4gIFxyXG4gIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcclxuICBlbGVzLnNlbGVjdCgpO1xyXG4gIFxyXG4gIHJldHVybiBlbGVzOyAvLyBSZXR1cm4gdGhlIGp1c3QgYWRkZWQgZWxlbWVudHNcclxufTtcclxuXHJcbi8qXHJcbiAqIE1vdmUgdGhlIG5vZGVzIHRvIGEgbmV3IHBhcmVudCBhbmQgY2hhbmdlIHRoZWlyIHBvc2l0aW9uIGlmIHBvc3NEaWZmIHBhcmFtcyBhcmUgc2V0LlxyXG4gKi9cclxuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQgPSBmdW5jdGlvbihub2RlcywgbmV3UGFyZW50LCBwb3NEaWZmWCwgcG9zRGlmZlkpIHtcclxuICB2YXIgbmV3UGFyZW50SWQgPSBuZXdQYXJlbnQgPT0gdW5kZWZpbmVkIHx8IHR5cGVvZiBuZXdQYXJlbnQgPT09ICdzdHJpbmcnID8gbmV3UGFyZW50IDogbmV3UGFyZW50LmlkKCk7XHJcbiAgbm9kZXMubW92ZSh7XCJwYXJlbnRcIjogbmV3UGFyZW50SWR9KTtcclxuICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyh7eDogcG9zRGlmZlgsIHk6IHBvc0RpZmZZfSwgbm9kZXMpO1xyXG59O1xyXG5cclxuLy8gUmVzaXplIGdpdmVuIG5vZGVzIGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeSBvbmUgb2Ygd2lkdGggb3IgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0LlxyXG5lbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbykge1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICB2YXIgcmF0aW8gPSB1bmRlZmluZWQ7XHJcbiAgICB2YXIgZWxlTXVzdEJlU3F1YXJlID0gZWxlbWVudFV0aWxpdGllcy5tdXN0QmVTcXVhcmUobm9kZS5kYXRhKCdjbGFzcycpKTtcclxuXHJcbiAgICAvLyBOb3RlIHRoYXQgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0IGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeVxyXG4gICAgaWYgKHdpZHRoKSB7XHJcbiAgICAgIGlmICh1c2VBc3BlY3RSYXRpbyB8fCBlbGVNdXN0QmVTcXVhcmUpIHtcclxuICAgICAgICByYXRpbyA9IHdpZHRoIC8gbm9kZS53aWR0aCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSB3aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaGVpZ2h0KSB7XHJcbiAgICAgIGlmICh1c2VBc3BlY3RSYXRpbyB8fCBlbGVNdXN0QmVTcXVhcmUpIHtcclxuICAgICAgICByYXRpbyA9IGhlaWdodCAvIG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IGhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmF0aW8gJiYgIWhlaWdodCkge1xyXG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBub2RlLmhlaWdodCgpICogcmF0aW87XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChyYXRpbyAmJiAhd2lkdGgpIHtcclxuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gbm9kZS53aWR0aCgpICogcmF0aW87XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gU2VjdGlvbiBFbmRcclxuLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcclxuXHJcbi8vIFNlY3Rpb24gU3RhcnRcclxuLy8gQ29tbW9uIGVsZW1lbnQgcHJvcGVydGllc1xyXG5cclxuLy8gR2V0IGNvbW1vbiBwcm9wZXJ0aWVzIG9mIGdpdmVuIGVsZW1lbnRzLiBSZXR1cm5zIG51bGwgaWYgdGhlIGdpdmVuIGVsZW1lbnQgbGlzdCBpcyBlbXB0eSBvciB0aGVcclxuLy8gcHJvcGVydHkgaXMgbm90IGNvbW1vbiBmb3IgYWxsIGVsZW1lbnRzLiBkYXRhT3JDc3MgcGFyYW1ldGVyIHNwZWNpZnkgd2hldGhlciB0byBjaGVjayB0aGUgcHJvcGVydHkgb24gZGF0YSBvciBjc3MuXHJcbi8vIFRoZSBkZWZhdWx0IHZhbHVlIGZvciBpdCBpcyBkYXRhLiBJZiBwcm9wZXJ0eU5hbWUgcGFyYW1ldGVyIGlzIGdpdmVuIGFzIGEgZnVuY3Rpb24gaW5zdGVhZCBvZiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIFxyXG4vLyBwcm9wZXJ0eSBuYW1lIHRoZW4gdXNlIHdoYXQgdGhhdCBmdW5jdGlvbiByZXR1cm5zLlxyXG5lbGVtZW50VXRpbGl0aWVzLmdldENvbW1vblByb3BlcnR5ID0gZnVuY3Rpb24gKGVsZW1lbnRzLCBwcm9wZXJ0eU5hbWUsIGRhdGFPckNzcykge1xyXG4gIGlmIChlbGVtZW50cy5sZW5ndGggPT0gMCkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICB2YXIgaXNGdW5jdGlvbjtcclxuICAvLyBJZiB3ZSBhcmUgbm90IGNvbXBhcmluZyB0aGUgcHJvcGVydGllcyBkaXJlY3RseSB1c2VycyBjYW4gc3BlY2lmeSBhIGZ1bmN0aW9uIGFzIHdlbGxcclxuICBpZiAodHlwZW9mIHByb3BlcnR5TmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgaXNGdW5jdGlvbiA9IHRydWU7XHJcbiAgfVxyXG5cclxuICAvLyBVc2UgZGF0YSBhcyBkZWZhdWx0XHJcbiAgaWYgKCFpc0Z1bmN0aW9uICYmICFkYXRhT3JDc3MpIHtcclxuICAgIGRhdGFPckNzcyA9ICdkYXRhJztcclxuICB9XHJcblxyXG4gIHZhciB2YWx1ZSA9IGlzRnVuY3Rpb24gPyBwcm9wZXJ0eU5hbWUoZWxlbWVudHNbMF0pIDogZWxlbWVudHNbMF1bZGF0YU9yQ3NzXShwcm9wZXJ0eU5hbWUpO1xyXG5cclxuICBmb3IgKHZhciBpID0gMTsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoICggaXNGdW5jdGlvbiA/IHByb3BlcnR5TmFtZShlbGVtZW50c1tpXSkgOiBlbGVtZW50c1tpXVtkYXRhT3JDc3NdKHByb3BlcnR5TmFtZSkgKSAhPSB2YWx1ZSkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB2YWx1ZTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgaWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgYSB0cnV0aHkgdmFsdWUgZm9yIGFsbCBvZiB0aGUgZ2l2ZW4gZWxlbWVudHMuXHJcbmVsZW1lbnRVdGlsaXRpZXMudHJ1ZUZvckFsbEVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZW1lbnRzLCBmY24pIHtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoIWZjbihlbGVtZW50c1tpXSkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBjYW4gaGF2ZSBzYmduY2FyZGluYWxpdHlcclxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkNhcmRpbmFsaXR5ID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xyXG5cclxuICByZXR1cm4gZWxlLmRhdGEoJ2NsYXNzJykgPT0gJ2NvbnN1bXB0aW9uJyB8fCBlbGUuZGF0YSgnY2xhc3MnKSA9PSAncHJvZHVjdGlvbic7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBjYW4gaGF2ZSBzYmdubGFiZWxcclxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkxhYmVsID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xyXG5cclxuICByZXR1cm4gc2JnbmNsYXNzICE9ICdhbmQnICYmIHNiZ25jbGFzcyAhPSAnb3InICYmIHNiZ25jbGFzcyAhPSAnbm90J1xyXG4gICAgICAgICAgJiYgc2JnbmNsYXNzICE9ICdhc3NvY2lhdGlvbicgJiYgc2JnbmNsYXNzICE9ICdkaXNzb2NpYXRpb24nICYmICFzYmduY2xhc3MuZW5kc1dpdGgoJ3Byb2Nlc3MnKTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZSBlbGVtZW50IGhhdmUgdW5pdCBvZiBpbmZvcm1hdGlvblxyXG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVVbml0T2ZJbmZvcm1hdGlvbiA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcclxuXHJcbiAgaWYgKHNiZ25jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4JyB8fCBzYmduY2xhc3MgPT0gJ3NpbXBsZSBjaGVtaWNhbCBtdWx0aW1lcidcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZSBtdWx0aW1lcicgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSBtdWx0aW1lcidcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCBtdWx0aW1lcicpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBoYXZlIHN0YXRlIHZhcmlhYmxlXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVN0YXRlVmFyaWFibGUgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XHJcblxyXG4gIGlmIChzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUnIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXgnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUgbXVsdGltZXInIHx8IHNiZ25jbGFzcyA9PSAnbnVjbGVpYyBhY2lkIGZlYXR1cmUgbXVsdGltZXInXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXggbXVsdGltZXInKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGUgc2hvdWxkIGJlIHNxdWFyZSBpbiBzaGFwZVxyXG5lbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZSA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcclxuXHJcbiAgcmV0dXJuIChzYmduY2xhc3MuaW5kZXhPZigncHJvY2VzcycpICE9IC0xIHx8IHNiZ25jbGFzcyA9PSAnc291cmNlIGFuZCBzaW5rJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdhbmQnIHx8IHNiZ25jbGFzcyA9PSAnb3InIHx8IHNiZ25jbGFzcyA9PSAnbm90J1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdhc3NvY2lhdGlvbicgfHwgc2JnbmNsYXNzID09ICdkaXNzb2NpYXRpb24nKTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2hldGhlciBhbnkgb2YgdGhlIGdpdmVuIG5vZGVzIG11c3Qgbm90IGJlIGluIHNxdWFyZSBzaGFwZVxyXG5lbGVtZW50VXRpbGl0aWVzLnNvbWVNdXN0Tm90QmVTcXVhcmUgPSBmdW5jdGlvbiAobm9kZXMpIHtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZShub2RlLmRhdGEoJ2NsYXNzJykpKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlcyBlbGVtZW50IGNhbiBiZSBjbG9uZWRcclxuZWxlbWVudFV0aWxpdGllcy5jYW5CZUNsb25lZCA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XHJcblxyXG4gIHZhciBsaXN0ID0ge1xyXG4gICAgJ3Vuc3BlY2lmaWVkIGVudGl0eSc6IHRydWUsXHJcbiAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAnY29tcGxleCc6IHRydWUsXHJcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxyXG4gICAgJ3NpbXBsZSBjaGVtaWNhbCc6IHRydWUsXHJcbiAgICAncGVydHVyYmluZyBhZ2VudCc6IHRydWVcclxuICB9O1xyXG5cclxuICByZXR1cm4gbGlzdFtzYmduY2xhc3NdID8gdHJ1ZSA6IGZhbHNlO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlcyBlbGVtZW50IGNhbiBiZSBjbG9uZWRcclxuZWxlbWVudFV0aWxpdGllcy5jYW5CZU11bHRpbWVyID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcclxuXHJcbiAgdmFyIGxpc3QgPSB7XHJcbiAgICAnbWFjcm9tb2xlY3VsZSc6IHRydWUsXHJcbiAgICAnY29tcGxleCc6IHRydWUsXHJcbiAgICAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnOiB0cnVlLFxyXG4gICAgJ3NpbXBsZSBjaGVtaWNhbCc6IHRydWVcclxuICB9O1xyXG5cclxuICByZXR1cm4gbGlzdFtzYmduY2xhc3NdID8gdHJ1ZSA6IGZhbHNlO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGVtZW50IGlzIGFuIEVQTlxyXG5lbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xyXG5cclxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAndW5zcGVjaWZpZWQgZW50aXR5J1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdzaW1wbGUgY2hlbWljYWwnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ21hY3JvbW9sZWN1bGUnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdjb21wbGV4Jyk7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgaXMgYSBQTlxyXG5lbGVtZW50VXRpbGl0aWVzLmlzUE5DbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcclxuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XHJcblxyXG4gIHJldHVybiAoc2JnbmNsYXNzID09ICdwcm9jZXNzJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdvbWl0dGVkIHByb2Nlc3MnXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ3VuY2VydGFpbiBwcm9jZXNzJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdhc3NvY2lhdGlvbidcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnZGlzc29jaWF0aW9uJ1xyXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdwaGVub3R5cGUnKTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2V0aGVyIHRoZSBnaXZlbiBlbGVtZW50IG9yIHN0cmluZyBpcyBvZiB0aGUgc3BlY2lhbCBlbXB0eSBzZXQvc291cmNlIGFuZCBzaW5rIGNsYXNzXHJcbmVsZW1lbnRVdGlsaXRpZXMuaXNFbXB0eVNldENsYXNzID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcclxuICByZXR1cm4gc2JnbmNsYXNzID09ICdzb3VyY2UgYW5kIHNpbmsnO1xyXG59O1xyXG5cclxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGVtZW50IGlzIGEgbG9naWNhbCBvcGVyYXRvclxyXG5lbGVtZW50VXRpbGl0aWVzLmlzTG9naWNhbE9wZXJhdG9yID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xyXG4gIHJldHVybiAoc2JnbmNsYXNzID09ICdhbmQnIHx8IHNiZ25jbGFzcyA9PSAnb3InIHx8IHNiZ25jbGFzcyA9PSAnbm90Jyk7XHJcbn07XHJcblxyXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGNsYXNzIG9mIGdpdmVuIGVsZW1lbnQgaXMgYSBlcXVpdmFsYW5jZSBjbGFzc1xyXG5lbGVtZW50VXRpbGl0aWVzLmNvbnZlbmllbnRUb0VxdWl2YWxlbmNlID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xyXG4gIHJldHVybiAoc2JnbmNsYXNzID09ICd0YWcnIHx8IHNiZ25jbGFzcyA9PSAndGVybWluYWwnKTtcclxufTtcclxuXHJcbi8vIFJldHVybnMgd2V0aGVyIHRoZSBjbGFzcyBvZiBnaXZlbiBlbGVtbnQgaXMgYSBtb2R1bGF0aW9uIGFyYyBhcyBkZWZpbmVkIGluIFBEIHNwZWNzXHJcbmVsZW1lbnRVdGlsaXRpZXMuaXNNb2R1bGF0aW9uQXJjQ2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgcmV0dXJuIChzYmduY2xhc3MgPT0gJ21vZHVsYXRpb24nXHJcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ3N0aW11bGF0aW9uJyB8fCBzYmduY2xhc3MgPT0gJ2NhdGFseXNpcydcclxuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnaW5oaWJpdGlvbicgfHwgc2JnbmNsYXNzID09ICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKTtcclxufVxyXG5cclxuLy8gUmVsb2NhdGVzIHN0YXRlIGFuZCBpbmZvIGJveGVzLiBUaGlzIGZ1bmN0aW9uIGlzIGV4cGVjdGVkIHRvIGJlIGNhbGxlZCBhZnRlciBhZGQvcmVtb3ZlIHN0YXRlIGFuZCBpbmZvIGJveGVzXHJcbmVsZW1lbnRVdGlsaXRpZXMucmVsb2NhdGVTdGF0ZUFuZEluZm9zID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gIHZhciBzdGF0ZUFuZEluZm9zID0gKGVsZS5pc05vZGUgJiYgZWxlLmlzTm9kZSgpKSA/IGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpIDogZWxlO1xyXG4gIHZhciBsZW5ndGggPSBzdGF0ZUFuZEluZm9zLmxlbmd0aDtcclxuICBpZiAobGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgZWxzZSBpZiAobGVuZ3RoID09IDEpIHtcclxuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gMDtcclxuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xyXG4gIH1cclxuICBlbHNlIGlmIChsZW5ndGggPT0gMikge1xyXG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAwO1xyXG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XHJcblxyXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAwO1xyXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSA1MDtcclxuICB9XHJcbiAgZWxzZSBpZiAobGVuZ3RoID09IDMpIHtcclxuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xyXG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XHJcblxyXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAyNTtcclxuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC55ID0gLTUwO1xyXG5cclxuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gMDtcclxuICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC55ID0gNTA7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAtMjU7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcclxuXHJcbiAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDI1O1xyXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSAtNTA7XHJcblxyXG4gICAgc3RhdGVBbmRJbmZvc1syXS5iYm94LnggPSAtMjU7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xyXG5cclxuICAgIHN0YXRlQW5kSW5mb3NbM10uYmJveC54ID0gMjU7XHJcbiAgICBzdGF0ZUFuZEluZm9zWzNdLmJib3gueSA9IDUwO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIENoYW5nZSBzdGF0ZSB2YWx1ZSBvciB1bml0IG9mIGluZm9ybWF0aW9uIGJveCBvZiBnaXZlbiBub2RlcyB3aXRoIGdpdmVuIGluZGV4LlxyXG4vLyBUeXBlIHBhcmFtZXRlciBpbmRpY2F0ZXMgd2hldGhlciB0byBjaGFuZ2UgdmFsdWUgb3IgdmFyaWFibGUsIGl0IGlzIHZhbGlkIGlmIHRoZSBib3ggYXQgdGhlIGdpdmVuIGluZGV4IGlzIGEgc3RhdGUgdmFyaWFibGUuXHJcbi8vIFZhbHVlIHBhcmFtZXRlciBpcyB0aGUgbmV3IHZhbHVlIHRvIHNldC5cclxuLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgb2xkIHZhbHVlIG9mIHRoZSBjaGFuZ2VkIGRhdGEgKFdlIGFzc3VtZSB0aGF0IHRoZSBvbGQgdmFsdWUgb2YgdGhlIGNoYW5nZWQgZGF0YSB3YXMgdGhlIHNhbWUgZm9yIGFsbCBub2RlcykuXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAobm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSkge1xyXG4gIHZhciByZXN1bHQ7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xyXG4gICAgdmFyIGJveCA9IHN0YXRlQW5kSW5mb3NbaW5kZXhdO1xyXG5cclxuICAgIGlmIChib3guY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7XHJcbiAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gYm94LnN0YXRlW3R5cGVdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBib3guc3RhdGVbdHlwZV0gPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGJveC5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xyXG4gICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgIHJlc3VsdCA9IGJveC5sYWJlbC50ZXh0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBib3gubGFiZWwudGV4dCA9IHZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8vIEFkZCBhIG5ldyBzdGF0ZSBvciBpbmZvIGJveCB0byBnaXZlbiBub2Rlcy5cclxuLy8gVGhlIGJveCBpcyByZXByZXNlbnRlZCBieSB0aGUgcGFyYW1ldGVyIG9iai5cclxuLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGp1c3QgYWRkZWQgYm94LlxyXG5lbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBvYmopIHtcclxuICB2YXIgaW5kZXg7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xyXG4gICAgXHJcbiAgICAvLyBDbG9uZSB0aGUgb2JqZWN0IHRvIGF2b2lkIHJlZmVyZW5jaW5nIGlzc3Vlc1xyXG4gICAgdmFyIGNsb25lID0galF1ZXJ5LmV4dGVuZCh0cnVlLCB7fSwgb2JqKTtcclxuICAgIFxyXG4gICAgc3RhdGVBbmRJbmZvcy5wdXNoKGNsb25lKTtcclxuICAgIGluZGV4ID0gc3RhdGVBbmRJbmZvcy5sZW5ndGggLSAxO1xyXG4gICAgdGhpcy5yZWxvY2F0ZVN0YXRlQW5kSW5mb3Moc3RhdGVBbmRJbmZvcyk7IC8vIFJlbG9jYXRlIHN0YXRlIGFuZCBpbmZvc1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGluZGV4O1xyXG59O1xyXG5cclxuLy8gUmVtb3ZlIHRoZSBzdGF0ZSBvciBpbmZvIGJveGVzIG9mIHRoZSBnaXZlbiBub2RlcyBhdCBnaXZlbiBpbmRleC5cclxuLy8gUmV0dXJucyB0aGUgcmVtb3ZlZCBib3guXHJcbmVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAobm9kZXMsIGluZGV4KSB7XHJcbiAgdmFyIG9iajtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XHJcbiAgICBpZiAoIW9iaikge1xyXG4gICAgICBvYmogPSBzdGF0ZUFuZEluZm9zW2luZGV4XTtcclxuICAgIH1cclxuICAgIHN0YXRlQW5kSW5mb3Muc3BsaWNlKGluZGV4LCAxKTsgLy8gUmVtb3ZlIHRoZSBib3hcclxuICAgIHRoaXMucmVsb2NhdGVTdGF0ZUFuZEluZm9zKHN0YXRlQW5kSW5mb3MpOyAvLyBSZWxvY2F0ZSBzdGF0ZSBhbmQgaW5mb3NcclxuICB9XHJcblxyXG4gIHJldHVybiBvYmo7XHJcbn07XHJcblxyXG4vLyBTZXQgbXVsdGltZXIgc3RhdHVzIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxyXG5lbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24gKG5vZGVzLCBzdGF0dXMpIHtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgdmFyIHNiZ25jbGFzcyA9IG5vZGUuZGF0YSgnY2xhc3MnKTtcclxuICAgIHZhciBpc011bHRpbWVyID0gbm9kZS5kYXRhKCdjbGFzcycpLmVuZHNXaXRoKCcgbXVsdGltZXInKTtcclxuXHJcbiAgICBpZiAoc3RhdHVzKSB7IC8vIE1ha2UgbXVsdGltZXIgc3RhdHVzIHRydWVcclxuICAgICAgaWYgKCFpc011bHRpbWVyKSB7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdjbGFzcycsIHNiZ25jbGFzcyArICcgbXVsdGltZXInKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7IC8vIE1ha2UgbXVsdGltZXIgc3RhdHVzIGZhbHNlXHJcbiAgICAgIGlmIChpc011bHRpbWVyKSB7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdjbGFzcycsIHNiZ25jbGFzcy5yZXBsYWNlKCcgbXVsdGltZXInLCAnJykpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gU2V0IGNsb25lIG1hcmtlciBzdGF0dXMgb2YgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cclxuZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uIChub2Rlcywgc3RhdHVzKSB7XHJcbiAgaWYgKHN0YXR1cykge1xyXG4gICAgbm9kZXMuZGF0YSgnY2xvbmVtYXJrZXInLCB0cnVlKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBub2Rlcy5yZW1vdmVEYXRhKCdjbG9uZW1hcmtlcicpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uKClcclxuXHJcbi8vIENoYW5nZSBmb250IHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIGVsZW1lbnRzIHdpdGggZ2l2ZW4gZm9udCBkYXRhXHJcbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbiAoZWxlcywgZGF0YSkge1xyXG4gIGZvciAodmFyIHByb3AgaW4gZGF0YSkge1xyXG4gICAgZWxlcy5kYXRhKHByb3AsIGRhdGFbcHJvcF0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIFRoaXMgZnVuY3Rpb24gZ2V0cyBhbiBlZGdlLCBhbmQgZW5kcyBvZiB0aGF0IGVkZ2UgKE9wdGlvbmFsbHkgaXQgbWF5IHRha2UganVzdCB0aGUgY2xhc3NlcyBvZiB0aGUgZWRnZSBhcyB3ZWxsKSBhcyBwYXJhbWV0ZXJzLlxyXG4vLyBJdCBtYXkgcmV0dXJuICd2YWxpZCcgKHRoYXQgZW5kcyBpcyB2YWxpZCBmb3IgdGhhdCBlZGdlKSwgJ3JldmVyc2UnICh0aGF0IGVuZHMgaXMgbm90IHZhbGlkIGZvciB0aGF0IGVkZ2UgYnV0IHRoZXkgd291bGQgYmUgdmFsaWQgXHJcbi8vIGlmIHlvdSByZXZlcnNlIHRoZSBzb3VyY2UgYW5kIHRhcmdldCksICdpbnZhbGlkJyAodGhhdCBlbmRzIGFyZSB0b3RhbGx5IGludmFsaWQgZm9yIHRoYXQgZWRnZSkuXHJcbmVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMgPSBmdW5jdGlvbiAoZWRnZSwgc291cmNlLCB0YXJnZXQpIHtcclxuICB2YXIgZWRnZWNsYXNzID0gdHlwZW9mIGVkZ2UgPT09ICdzdHJpbmcnID8gZWRnZSA6IGVkZ2UuZGF0YSgnY2xhc3MnKTtcclxuICB2YXIgc291cmNlY2xhc3MgPSBzb3VyY2UuZGF0YSgnY2xhc3MnKTtcclxuICB2YXIgdGFyZ2V0Y2xhc3MgPSB0YXJnZXQuZGF0YSgnY2xhc3MnKTtcclxuXHJcbiAgdmFyIGVkZ2VDb25zdHJhaW50cyA9IHRoaXMuUEQuY29ubmVjdGl2aXR5Q29uc3RyYWludHNbZWRnZWNsYXNzXTtcclxuXHJcbiAgLy8gZ2l2ZW4gYSBub2RlLCBhY3RpbmcgYXMgc291cmNlIG9yIHRhcmdldCwgcmV0dXJucyBib29sZWFuIHdldGhlciBvciBub3QgaXQgaGFzIHRvbyBtYW55IGVkZ2VzIGFscmVhZHlcclxuICBmdW5jdGlvbiBoYXNUb29NYW55RWRnZXMobm9kZSwgc291cmNlT3JUYXJnZXQpIHtcclxuICAgIHZhciBub2RlY2xhc3MgPSBub2RlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgICB2YXIgdG90YWxUb29NYW55ID0gdHJ1ZTtcclxuICAgIHZhciBlZGdlVG9vTWFueSA9IHRydWU7XHJcbiAgICBpZiAoc291cmNlT3JUYXJnZXQgPT0gXCJzb3VyY2VcIikge1xyXG4gICAgICAgIHZhciBzYW1lRWRnZUNvdW50T3V0ID0gbm9kZS5vdXRnb2VycygnZWRnZVtjbGFzcz1cIicrZWRnZWNsYXNzKydcIl0nKS5zaXplKCk7XHJcbiAgICAgICAgdmFyIHRvdGFsRWRnZUNvdW50T3V0ID0gbm9kZS5vdXRnb2VycygnZWRnZScpLnNpemUoKTtcclxuICAgICAgICAvLyBjaGVjayB0aGF0IHRoZSB0b3RhbCBlZGdlIGNvdW50IGlzIHdpdGhpbiB0aGUgbGltaXRzXHJcbiAgICAgICAgaWYgKGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzU291cmNlLm1heFRvdGFsID09IC0xXHJcbiAgICAgICAgICAgIHx8IHRvdGFsRWRnZUNvdW50T3V0IDwgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNTb3VyY2UubWF4VG90YWwgKSB7XHJcbiAgICAgICAgICAgIHRvdGFsVG9vTWFueSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0aGVuIGNoZWNrIGxpbWl0cyBmb3IgdGhpcyBzcGVjaWZpYyBlZGdlIGNsYXNzXHJcbiAgICAgICAgaWYgKGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzU291cmNlLm1heEVkZ2UgPT0gLTFcclxuICAgICAgICAgICAgfHwgc2FtZUVkZ2VDb3VudE91dCA8IGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzU291cmNlLm1heEVkZ2UgKSB7XHJcbiAgICAgICAgICAgIGVkZ2VUb29NYW55ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmIG9ubHkgb25lIG9mIHRoZSBsaW1pdHMgaXMgcmVhY2hlZCB0aGVuIGVkZ2UgaXMgaW52YWxpZFxyXG4gICAgICAgIHJldHVybiB0b3RhbFRvb01hbnkgfHwgZWRnZVRvb01hbnk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHsgLy8gbm9kZSBpcyB1c2VkIGFzIHRhcmdldFxyXG4gICAgICAgIHZhciBzYW1lRWRnZUNvdW50SW4gPSBub2RlLmluY29tZXJzKCdlZGdlW2NsYXNzPVwiJytlZGdlY2xhc3MrJ1wiXScpLnNpemUoKTtcclxuICAgICAgICB2YXIgdG90YWxFZGdlQ291bnRJbiA9IG5vZGUuaW5jb21lcnMoJ2VkZ2UnKS5zaXplKCk7XHJcbiAgICAgICAgaWYgKGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heFRvdGFsID09IC0xXHJcbiAgICAgICAgICAgIHx8IHRvdGFsRWRnZUNvdW50SW4gPCBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1RhcmdldC5tYXhUb3RhbCApIHtcclxuICAgICAgICAgICAgdG90YWxUb29NYW55ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1RhcmdldC5tYXhFZGdlID09IC0xXHJcbiAgICAgICAgICAgIHx8IHNhbWVFZGdlQ291bnRJbiA8IGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heEVkZ2UgKSB7XHJcbiAgICAgICAgICAgIGVkZ2VUb29NYW55ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0b3RhbFRvb01hbnkgfHwgZWRnZVRvb01hbnk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc0luQ29tcGxleChub2RlKSB7XHJcbiAgICByZXR1cm4gbm9kZS5wYXJlbnQoKS5kYXRhKCdjbGFzcycpID09ICdjb21wbGV4JztcclxuICB9XHJcblxyXG4gIGlmIChpc0luQ29tcGxleChzb3VyY2UpIHx8IGlzSW5Db21wbGV4KHRhcmdldCkpIHsgLy8gc3VidW5pdHMgb2YgYSBjb21wbGV4IGFyZSBubyBsb25nZXIgRVBOcywgbm8gY29ubmVjdGlvbiBhbGxvd2VkXHJcbiAgICByZXR1cm4gJ2ludmFsaWQnO1xyXG4gIH1cclxuXHJcbiAgLy8gY2hlY2sgbmF0dXJlIG9mIGNvbm5lY3Rpb25cclxuICBpZiAoZWRnZUNvbnN0cmFpbnRzW3NvdXJjZWNsYXNzXS5hc1NvdXJjZS5pc0FsbG93ZWQgJiYgZWRnZUNvbnN0cmFpbnRzW3RhcmdldGNsYXNzXS5hc1RhcmdldC5pc0FsbG93ZWQpIHtcclxuICAgIC8vIGNoZWNrIGFtb3VudCBvZiBjb25uZWN0aW9uc1xyXG4gICAgaWYgKCFoYXNUb29NYW55RWRnZXMoc291cmNlLCBcInNvdXJjZVwiKSAmJiAhaGFzVG9vTWFueUVkZ2VzKHRhcmdldCwgXCJ0YXJnZXRcIikgKSB7XHJcbiAgICAgIHJldHVybiAndmFsaWQnO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyB0cnkgdG8gcmV2ZXJzZVxyXG4gIGlmIChlZGdlQ29uc3RyYWludHNbdGFyZ2V0Y2xhc3NdLmFzU291cmNlLmlzQWxsb3dlZCAmJiBlZGdlQ29uc3RyYWludHNbc291cmNlY2xhc3NdLmFzVGFyZ2V0LmlzQWxsb3dlZCkge1xyXG4gICAgaWYgKCFoYXNUb29NYW55RWRnZXModGFyZ2V0LCBcInNvdXJjZVwiKSAmJiAhaGFzVG9vTWFueUVkZ2VzKHNvdXJjZSwgXCJ0YXJnZXRcIikgKSB7XHJcbiAgICAgIHJldHVybiAncmV2ZXJzZSc7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiAnaW52YWxpZCc7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBVbmhpZGUgZ2l2ZW4gZWxlcyBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xyXG4gKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuXHJcbiAqL1xyXG5lbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgZ2l2ZW4gZWxlc1xyXG4gIGlmICh0eXBlb2YgbGF5b3V0cGFyYW0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGxheW91dHBhcmFtKCk7IC8vIElmIGxheW91dHBhcmFtIGlzIGEgZnVuY3Rpb24gZXhlY3V0ZSBpdFxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBsYXlvdXQgPSBjeS5sYXlvdXQobGF5b3V0cGFyYW0pOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBsYXlvdXQgb3B0aW9ucyBjYWxsIGxheW91dCB3aXRoIHRoYXQgb3B0aW9ucy5cclxuICAgIFxyXG4gICAgLy8gRG8gdGhpcyBjaGVjayBmb3IgY3l0b3NjYXBlLmpzIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcclxuICAgIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xyXG4gICAgICBsYXlvdXQucnVuKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDaGFuZ2Ugc3R5bGUvY3NzIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcclxuICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuXHJcbiAqL1xyXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlTWFwKSB7XHJcbiAgaWYgKCB0eXBlb2YgdmFsdWVNYXAgPT09ICdvYmplY3QnICkge1xyXG4gICAgY3kuc3RhcnRCYXRjaCgpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG4gICAgICBlbGUuY3NzKG5hbWUsIHZhbHVlTWFwW2VsZS5pZCgpXSk7IC8vIHZhbHVlTWFwIGlzIGFuIGlkIHRvIHZhbHVlIG1hcCB1c2UgaXQgaW4gdGhpcyB3YXlcclxuICAgIH1cclxuICAgIGN5LmVuZEJhdGNoKCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlcy5jc3MobmFtZSwgdmFsdWVNYXApOyAvLyB2YWx1ZU1hcCBpcyBqdXN0IGEgc3RyaW5nIHNldCBjc3MoJ25hbWUnKSBmb3IgYWxsIGVsZXMgdG8gdGhpcyB2YWx1ZVxyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIENoYW5nZSBkYXRhIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcclxuICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuXHJcbiAqL1xyXG5lbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xyXG4gIGlmICggdHlwZW9mIHZhbHVlTWFwID09PSAnb2JqZWN0JyApIHtcclxuICAgIGN5LnN0YXJ0QmF0Y2goKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZWxlID0gZWxlc1tpXTtcclxuICAgICAgZWxlLmRhdGEobmFtZSwgdmFsdWVNYXBbZWxlLmlkKCldKTsgLy8gdmFsdWVNYXAgaXMgYW4gaWQgdG8gdmFsdWUgbWFwIHVzZSBpdCBpbiB0aGlzIHdheVxyXG4gICAgfVxyXG4gICAgY3kuZW5kQmF0Y2goKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVzLmRhdGEobmFtZSwgdmFsdWVNYXApOyAvLyB2YWx1ZU1hcCBpcyBqdXN0IGEgc3RyaW5nIHNldCBjc3MoJ25hbWUnKSBmb3IgYWxsIGVsZXMgdG8gdGhpcyB2YWx1ZVxyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIFJldHVybiB0aGUgc2V0IG9mIGFsbCBub2RlcyBwcmVzZW50IHVuZGVyIHRoZSBnaXZlbiBwb3NpdGlvblxyXG4gKiByZW5kZXJlZFBvcyBtdXN0IGJlIGEgcG9pbnQgZGVmaW5lZCByZWxhdGl2ZWx5IHRvIGN5dG9zY2FwZSBjb250YWluZXJcclxuICogKGxpa2UgcmVuZGVyZWRQb3NpdGlvbiBmaWVsZCBvZiBhIG5vZGUpXHJcbiAqL1xyXG5lbGVtZW50VXRpbGl0aWVzLmdldE5vZGVzQXQgPSBmdW5jdGlvbihyZW5kZXJlZFBvcykge1xyXG4gIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XHJcbiAgdmFyIHggPSByZW5kZXJlZFBvcy54O1xyXG4gIHZhciB5ID0gcmVuZGVyZWRQb3MueTtcclxuICB2YXIgcmVzdWx0Tm9kZXMgPSBbXTtcclxuICBmb3IodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICB2YXIgcmVuZGVyZWRCYm94ID0gbm9kZS5yZW5kZXJlZEJvdW5kaW5nQm94KHtcclxuICAgICAgaW5jbHVkZU5vZGVzOiB0cnVlLFxyXG4gICAgICBpbmNsdWRlRWRnZXM6IGZhbHNlLFxyXG4gICAgICBpbmNsdWRlTGFiZWxzOiBmYWxzZSxcclxuICAgICAgaW5jbHVkZVNoYWRvd3M6IGZhbHNlXHJcbiAgICB9KTtcclxuICAgIGlmICh4ID49IHJlbmRlcmVkQmJveC54MSAmJiB4IDw9IHJlbmRlcmVkQmJveC54Mikge1xyXG4gICAgICBpZiAoeSA+PSByZW5kZXJlZEJib3gueTEgJiYgeSA8PSByZW5kZXJlZEJib3gueTIpIHtcclxuICAgICAgICByZXN1bHROb2Rlcy5wdXNoKG5vZGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiByZXN1bHROb2RlcztcclxufTtcclxuXHJcbmVsZW1lbnRVdGlsaXRpZXMuZGVtdWx0aW1lcml6ZUNsYXNzID0gZnVuY3Rpb24oc2JnbmNsYXNzKSB7XHJcbiAgcmV0dXJuIHNiZ25jbGFzcy5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xyXG59O1xyXG5cclxuLypcclxuICogQWRkIHBvcnRzIHRvIHRoZSBnaXZlbiBub2RlLCB3aXRoIGdpdmVuIG9yZGVyaW5nIGFuZCBwb3J0IGRpc3RhbmNlLlxyXG4gKi9cclxuZWxlbWVudFV0aWxpdGllcy5hZGRQb3J0cyA9IGZ1bmN0aW9uKG5vZGUsIG9yZGVyaW5nLCBwb3J0RGlzdGFuY2UpIHtcclxuICB2YXIgZmlyc3RQb3J0SWQgPSBub2RlLmlkKCkgKyBcIi4xXCI7IC8vIElkIG9mIGZpcnN0IHBvcnRcclxuICB2YXIgc2Vjb25kUG9ydElkID0gbm9kZS5pZCgpICsgXCIuMlwiOyAvLyBJZCBvZiBzZWNvbmYgcG9ydFxyXG4gIC8vIEZpcnN0IHBvcnQgb2JqZWN0IHggYW5kIHkgd2lsbCBiZSBmaWxsZWQgYWNjb3JkaW5nIHRvIG9yZGVyaW5nLCB0aGUgZmlyc3QgcG9ydCBpcyBzdXBwb3NlZCB0byBiZSB0aGUgbGVmdCBtb3N0IG9yIHRoZSB0b3AgbW9zdCBvbmVcclxuICB2YXIgZmlyc3RQb3J0ID0geyBpZDogZmlyc3RQb3J0SWQgfTtcclxuICAvLyBTZWNvbmQgcG9ydCBvYmplY3QgeCBhbmQgeSB3aWxsIGJlIGZpbGxlZCBhY2NvcmRpbmcgdG8gb3JkZXJpbmcsIHRoZSBzZWNvbmQgcG9ydCBpcyBzdXBwb3NlZCB0byBiZSB0aGUgcmlnaHQgbW9zdCBvciB0aGUgYm90dG9tIG1vc3Qgb25lXHJcbiAgdmFyIHNlY29uZFBvcnQgPSB7IGlkOiBzZWNvbmRQb3J0SWQgfTtcclxuICBcclxuICAvLyBDb21wbGV0ZSBwb3J0IG9iamVjdHMgYWNjb3JkaW5nIHRvIG9yZGVyaW5nXHJcbiAgaWYgKCBvcmRlcmluZyA9PT0gJ0wtdG8tUicgfHwgb3JkZXJpbmcgPT09ICdSLXRvLUwnICkge1xyXG4gICAgLy8gSWYgb3JkZXJpbmcgaXMgaW4gaG9yaXpvbnRhbCBheGlzIGZpcnN0IHBvcnQgaXMgdGhlIGxlZnQgbW9zdCBvbmUgYW5kIHRoZSBzZWNvbmQgcG9ydCBpcyB0aGUgcmlnaHQgbW9zdCBvbmVcclxuICAgIGZpcnN0UG9ydC54ID0gLTEgKiBwb3J0RGlzdGFuY2U7XHJcbiAgICBzZWNvbmRQb3J0LnggPSBwb3J0RGlzdGFuY2U7XHJcbiAgICBmaXJzdFBvcnQueSA9IDA7XHJcbiAgICBzZWNvbmRQb3J0LnkgPSAwO1xyXG4gIH1cclxuICBlbHNlIHsgLy8gSWYgb3JkZXJpbmcgaXMgJ1QtdG8tQicgb3IgJ0ItdG8tVCdcclxuICAgICAvLyBJZiBvcmRlcmluZyBpcyBpbiB2ZXJ0aWNhbCBheGlzIGZpcnN0IHBvcnQgaXMgdGhlIHRvcCBtb3N0IG9uZSBhbmQgdGhlIHNlY29uZCBwb3J0IGlzIHRoZSBib3R0b20gbW9zdCBvbmVcclxuICAgIGZpcnN0UG9ydC55ID0gLTEgKiBwb3J0RGlzdGFuY2U7XHJcbiAgICBzZWNvbmRQb3J0LnkgPSBwb3J0RGlzdGFuY2U7XHJcbiAgICBmaXJzdFBvcnQueCA9IDA7XHJcbiAgICBzZWNvbmRQb3J0LnggPSAwO1xyXG4gIH1cclxuICBcclxuICB2YXIgZnJvbUxvclQgPSBvcmRlcmluZyA9PT0gJ0wtdG8tUicgfHwgb3JkZXJpbmcgPT09ICdULXRvLUInOyAvLyBDaGVjayBpZiBvcmRlcmluZyBzdGFydHMgZnJvbSBsZWZ0IG9yIHRvcFxyXG4gIHZhciBwb3J0cyA9IFtmaXJzdFBvcnQsIHNlY29uZFBvcnRdOyAvLyBQb3J0cyBhcnJheSBmb3IgdGhlIG5vZGVcclxuICB2YXIgY29ubmVjdGVkRWRnZXMgPSBub2RlLmNvbm5lY3RlZEVkZ2VzKCk7IC8vIFRoZSBlZGdlcyBjb25uZWN0ZWQgdG8gdGhlIG5vZGVcclxuICBcclxuICBjeS5zdGFydEJhdGNoKCk7XHJcbiAgXHJcbiAgbm9kZS5kYXRhKCdwb3J0cycsIHBvcnRzKTtcclxuICBcclxuICAvLyBSZXNldCB0aGUgcG9ydHNvdXJjZSBhbmQgcG9ydHRhcmdldCBmb3IgZWFjaCBlZGdlIGNvbm5lY3RlZCB0byB0aGUgbm9kZVxyXG4gIGZvciAoIHZhciBpID0gMDsgaSA8IGNvbm5lY3RlZEVkZ2VzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgdmFyIGVkZ2UgPSBjb25uZWN0ZWRFZGdlc1tpXTtcclxuICAgIC8qXHJcbiAgICAgKiBJZiB0aGUgbm9kZSBpcyB0aGUgZWRnZSB0YXJnZXQgd2Ugc2hvdWxkIHNldCB0aGUgcG9ydHRhcmdldCBvZiB0aGUgZWRnZSB0byBvbmUgb2YgaWQgb2YgZmlyc3QgcG9ydCBvciBzZWNvbmQgcG9ydCAoIGFjY29yZGluZyB0byB0aGUgb3JkZXJpbmcgKVxyXG4gICAgICogaWYgaXQgaXMgdGhlIGVkZ2UgdGFyZ2V0IHdlIHNob3VsZCBzZXQgdGhlIHBvcnRzb3VyY2Ugc2ltaWxhcmx5LlxyXG4gICAgICovXHJcbiAgICBpZiAoIGVkZ2UuZGF0YSgndGFyZ2V0JykgPT09IG5vZGUuaWQoKSApIHtcclxuICAgICAgaWYgKCBmcm9tTG9yVCApIHtcclxuICAgICAgICBlZGdlLmRhdGEoJ3BvcnR0YXJnZXQnLCBmaXJzdFBvcnRJZCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgZWRnZS5kYXRhKCdwb3J0dGFyZ2V0Jywgc2Vjb25kUG9ydElkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGlmICggZnJvbUxvclQgKSB7XHJcbiAgICAgICAgZWRnZS5kYXRhKCdwb3J0c291cmNlJywgc2Vjb25kUG9ydElkKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBlZGdlLmRhdGEoJ3BvcnRzb3VyY2UnLCBmaXJzdFBvcnRJZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgY3kuZW5kQmF0Y2goKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIFJlbW92ZSB0aGUgcG9ydHMgb2YgdGhlIGdpdmVuIG5vZGVcclxuICovXHJcbmVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlUG9ydHMgPSBmdW5jdGlvbihub2RlKSB7XHJcbiAgdmFyIGNvbm5lY3RlZEVkZ2VzID0gbm9kZS5jb25uZWN0ZWRFZGdlcygpO1xyXG4gIHZhciBub2RlSWQgPSBub2RlLmlkKCk7XHJcbiAgXHJcbiAgY3kuc3RhcnRCYXRjaCgpO1xyXG4gIFxyXG4gIC8vIFJlc2V0IHBvcnRzb3VyY2Ugb3IgcG9ydHRhcmdldCBvZiB0aGUgY29ubmVjdGVkIGVkZ2VzIHRvIHRoZSBub2RlIGlkXHJcbiAgZm9yICggdmFyIGkgPSAwOyBpIDwgY29ubmVjdGVkRWRnZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICB2YXIgZWRnZSA9IGNvbm5lY3RlZEVkZ2VzW2ldO1xyXG4gICAgaWYgKCBlZGdlLmRhdGEoJ3NvdXJjZScpID09PSBub2RlSWQgKSB7XHJcbiAgICAgIGVkZ2UuZGF0YSgncG9ydHNvdXJjZScsIG5vZGVJZCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgZWRnZS5kYXRhKCdwb3J0dGFyZ2V0Jywgbm9kZUlkKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgbm9kZS5kYXRhKCdwb3J0cycsIFtdKTsgLy8gQ2xlYXIgcG9ydHMgZGF0YVxyXG4gIFxyXG4gIGN5LmVuZEJhdGNoKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBTZXRzIHRoZSBvcmRlcmluZyBvZiB0aGUgZ2l2ZW4gbm9kZXMuXHJcbiAqIE9yZGVyaW5nIG9wdGlvbnMgYXJlICdMLXRvLVInLCAnUi10by1MJywgJ1QtdG8tQicsICdCLXRvLVQnLCAnbm9uZScuXHJcbiAqIElmIGEgbm9kZSBkb2VzIG5vdCBoYXZlIGFueSBwb3J0IGJlZm9yZSB0aGUgb3BlcmF0aW9uIGFuZCBpdCBpcyBzdXBwb3NlZCB0byBoYXZlIHNvbWUgYWZ0ZXIgb3BlcmF0aW9uIHRoZSBwb3J0RGlzdGFuY2UgcGFyYW1ldGVyIGlzIFxyXG4gKiB1c2VkIHRvIHNldCB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgbm9kZSBjZW50ZXIgYW5kIHRoZSBwb3J0cy4gVGhlIGRlZmF1bHQgcG9ydCBkaXN0YW5jZSBpcyA2MC5cclxuICovXHJcbmVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyA9IGZ1bmN0aW9uKCBub2Rlcywgb3JkZXJpbmcsIHBvcnREaXN0YW5jZSApIHtcclxuICAvKlxyXG4gICogUmV0dXJzbiBpZiB0aGUgZ2l2ZW4gcG9ydElkIGlzIHBvcnR0YXJnZXQgb2YgYW55IG9mIHRoZSBnaXZlbiBlZGdlcy5cclxuICAqIFRoZXNlIGVkZ2VzIGFyZSBleHBlY3RlZCB0byBiZSB0aGUgZWRnZXMgY29ubmVjdGVkIHRvIHRoZSBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGF0IHBvcnQuXHJcbiAgKi9cclxuICB2YXIgaXNQb3J0VGFyZ2V0T2ZBbnlFZGdlID0gZnVuY3Rpb24oZWRnZXMsIHBvcnRJZCkge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAoZWRnZXNbaV0uZGF0YSgncG9ydHRhcmdldCcpID09PSBwb3J0SWQpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9O1xyXG4gIFxyXG4gIHBvcnREaXN0YW5jZSA9IHBvcnREaXN0YW5jZSA/IHBvcnREaXN0YW5jZSA6IDYwOyAvLyBUaGUgZGVmYXVsdCBwb3J0IGRpc3RhbmNlIGlzIDYwXHJcbiAgXHJcbiAgY3kuc3RhcnRCYXRjaCgpO1xyXG4gIFxyXG4gIGZvciAoIHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHZhciBjdXJyZW50T3JkZXJpbmcgPSBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXMuZ2V0UG9ydHNPcmRlcmluZyhub2RlKTsgLy8gVGhlIGN1cnJlbnQgcG9ydHMgb3JkZXJpbmcgb2YgdGhlIG5vZGVcclxuICAgIFxyXG4gICAgLy8gSWYgdGhlIGN1cnJlbnQgb3JkZXJpbmcgaXMgYWxyZWFkeSBlcXVhbCB0byB0aGUgZGVzaXJlZCBvcmRlcmluZyBwYXNzIHRoaXMgbm9kZSBkaXJlY3RseVxyXG4gICAgaWYgKCBvcmRlcmluZyA9PT0gY3VycmVudE9yZGVyaW5nICkge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKCBvcmRlcmluZyA9PT0gJ25vbmUnICkgeyAvLyBJZiB0aGUgb3JkZXJpbmcgaXMgJ25vbmUnIHJlbW92ZSB0aGUgcG9ydHMgb2YgdGhlIG5vZGVcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVQb3J0cyhub2RlKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKCBjdXJyZW50T3JkZXJpbmcgPT09ICdub25lJyApIHsgLy8gSWYgdGhlIGRlc2lyZWQgb3JkZXJpbmcgaXMgbm90ICdub25lJyBidXQgdGhlIGN1cnJlbnQgb25lIGlzICdub25lJyBhZGQgcG9ydHMgd2l0aCB0aGUgZ2l2ZW4gcGFyYW1ldGVycy5cclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRQb3J0cyhub2RlLCBvcmRlcmluZywgcG9ydERpc3RhbmNlKTtcclxuICAgIH1cclxuICAgIGVsc2UgeyAvLyBFbHNlIGNoYW5nZSB0aGUgb3JkZXJpbmcgYnkgYWx0ZXJpbmcgbm9kZSAncG9ydHMnXHJcbiAgICAgIHZhciBwb3J0cyA9IG5vZGUuZGF0YSgncG9ydHMnKTsgLy8gUG9ydHMgb2YgdGhlIG5vZGVcclxuICAgICAgLy8gSWYgY3VycmVudE9yZGVyaW5nIGlzICdub25lJyB1c2UgdGhlIHBvcnREaXN0YW5jZSBnaXZlbiBieSBwYXJhbWV0ZXIgZWxzZSB1c2UgdGhlIGV4aXN0aW5nIG9uZVxyXG4gICAgICB2YXIgZGlzdCA9IGN1cnJlbnRPcmRlcmluZyA9PT0gJ25vbmUnID8gcG9ydERpc3RhbmNlIDogKCBNYXRoLmFicyggcG9ydHNbMF0ueCApIHx8IE1hdGguYWJzKCBwb3J0c1swXS55ICkgKTtcclxuICAgICAgdmFyIGNvbm5lY3RlZEVkZ2VzID0gbm9kZS5jb25uZWN0ZWRFZGdlcygpOyAvLyBUaGUgZWRnZXMgY29ubmVjdGVkIHRvIHRoZSBub2RlXHJcbiAgICAgIHZhciBwb3J0c291cmNlLCBwb3J0dGFyZ2V0OyAvLyBUaGUgcG9ydHMgd2hpY2ggYXJlIHBvcnRzb3VyY2UvcG9ydHRhcmdldCBvZiB0aGUgY29ubmVjdGVkIGVkZ2VzXHJcbiAgICAgIFxyXG4gICAgICAvLyBEZXRlcm1pbmUgdGhlIHBvcnRzb3VyY2UgYW5kIHBvcnR0YXJnZXRcclxuICAgICAgaWYgKCBpc1BvcnRUYXJnZXRPZkFueUVkZ2UoY29ubmVjdGVkRWRnZXMsIHBvcnRzWzBdLmlkKSApIHtcclxuICAgICAgICBwb3J0dGFyZ2V0ID0gcG9ydHNbMF07XHJcbiAgICAgICAgcG9ydHNvdXJjZSA9IHBvcnRzWzFdO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHBvcnR0YXJnZXQgPSBwb3J0c1sxXTtcclxuICAgICAgICBwb3J0c291cmNlID0gcG9ydHNbMF07XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGlmICggb3JkZXJpbmcgPT09ICdMLXRvLVInICkge1xyXG4gICAgICAgIC8vIElmIG9yZGVyaW5nIGlzICdMLXRvLVInIHRoZSBwb3J0dGFyZ2V0IHNob3VsZCBiZSB0aGUgbGVmdCBtb3N0IHBvcnQgYW5kIHRoZSBwb3J0c291cmNlIHNob3VsZCBiZSB0aGUgcmlnaHQgbW9zdCBwb3J0XHJcbiAgICAgICAgcG9ydHRhcmdldC54ID0gLTEgKiBkaXN0O1xyXG4gICAgICAgIHBvcnRzb3VyY2UueCA9IGRpc3Q7XHJcbiAgICAgICAgcG9ydHRhcmdldC55ID0gMDtcclxuICAgICAgICBwb3J0c291cmNlLnkgPSAwO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKCBvcmRlcmluZyA9PT0gJ1ItdG8tTCcgKSB7XHJcbiAgICAgICAgLy8gSWYgb3JkZXJpbmcgaXMgJ1ItdG8tTCcgdGhlIHBvcnR0YXJnZXQgc2hvdWxkIGJlIHRoZSByaWdodCBtb3N0IHBvcnQgYW5kIHRoZSBwb3J0c291cmNlIHNob3VsZCBiZSB0aGUgbGVmdCBtb3N0IHBvcnRcclxuICAgICAgICBwb3J0dGFyZ2V0LnggPSBkaXN0O1xyXG4gICAgICAgIHBvcnRzb3VyY2UueCA9IC0xICogZGlzdDtcclxuICAgICAgICBwb3J0dGFyZ2V0LnkgPSAwO1xyXG4gICAgICAgIHBvcnRzb3VyY2UueSA9IDA7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAoIG9yZGVyaW5nID09PSAnVC10by1CJyApIHtcclxuICAgICAgICAvLyBJZiBvcmRlcmluZyBpcyAnVC10by1CJyB0aGUgcG9ydHRhcmdldCBzaG91bGQgYmUgdGhlIHRvcCBtb3N0IHBvcnQgYW5kIHRoZSBwb3J0c291cmNlIHNob3VsZCBiZSB0aGUgYm90dG9tIG1vc3QgcG9ydFxyXG4gICAgICAgIHBvcnR0YXJnZXQueCA9IDA7XHJcbiAgICAgICAgcG9ydHNvdXJjZS54ID0gMDtcclxuICAgICAgICBwb3J0dGFyZ2V0LnkgPSAtMSAqIGRpc3Q7XHJcbiAgICAgICAgcG9ydHNvdXJjZS55ID0gZGlzdDtcclxuICAgICAgfVxyXG4gICAgICBlbHNlICB7IC8vaWYgb3JkZXJpbmcgaXMgJ0ItdG8tVCdcclxuICAgICAgICAvLyBJZiBvcmRlcmluZyBpcyAnQi10by1UJyB0aGUgcG9ydHRhcmdldCBzaG91bGQgYmUgdGhlIGJvdHRvbSBtb3N0IHBvcnQgYW5kIHRoZSBwb3J0c291cmNlIHNob3VsZCBiZSB0aGUgdG9wIG1vc3QgcG9ydFxyXG4gICAgICAgIHBvcnR0YXJnZXQueCA9IDA7XHJcbiAgICAgICAgcG9ydHNvdXJjZS54ID0gMDtcclxuICAgICAgICBwb3J0dGFyZ2V0LnkgPSBkaXN0O1xyXG4gICAgICAgIHBvcnRzb3VyY2UueSA9IC0xICogZGlzdDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBub2RlLmRhdGEoJ3BvcnRzJywgcG9ydHMpOyAvLyBSZXNldCB0aGUgbm9kZSBwb3J0c1xyXG4gIH1cclxuICBcclxuICBjeS5lbmRCYXRjaCgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlbGVtZW50VXRpbGl0aWVzO1xyXG4iLCIvKiBcclxuICogVXRpbGl0eSBmaWxlIHRvIGdldCBhbmQgc2V0IHRoZSBsaWJyYXJpZXMgdG8gd2hpY2ggc2JnbnZpeiBpcyBkZXBlbmRlbnQgZnJvbSBhbnkgZmlsZS5cclxuICovXHJcblxyXG52YXIgbGliVXRpbGl0aWVzID0gZnVuY3Rpb24oKXtcclxufTtcclxuXHJcbmxpYlV0aWxpdGllcy5zZXRMaWJzID0gZnVuY3Rpb24obGlicykge1xyXG4gIHRoaXMubGlicyA9IGxpYnM7XHJcbn07XHJcblxyXG5saWJVdGlsaXRpZXMuZ2V0TGlicyA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB0aGlzLmxpYnM7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpYlV0aWxpdGllczsiLCJ2YXIgb3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpLmdldE9wdGlvbnMoKTtcclxudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL2VsZW1lbnQtdXRpbGl0aWVzJyk7XHJcblxyXG4vKlxyXG4gKiBUaGUgbWFpbiB1dGlsaXRpZXMgdG8gYmUgZXhwb3NlZCBkaXJlY3RseS5cclxuICovXHJcbmZ1bmN0aW9uIG1haW5VdGlsaXRpZXMoKSB7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBBZGRzIGEgbmV3IG5vZGUgd2l0aCB0aGUgZ2l2ZW4gY2xhc3MgYW5kIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlcy4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuYWRkTm9kZSA9IGZ1bmN0aW9uKHgsIHkgLCBub2RlY2xhc3MsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeCwgeSwgbm9kZWNsYXNzLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIG5ld05vZGUgOiB7XHJcbiAgICAgICAgeDogeCxcclxuICAgICAgICB5OiB5LFxyXG4gICAgICAgIGNsYXNzOiBub2RlY2xhc3MsXHJcbiAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgIHBhcmVudDogcGFyZW50LFxyXG4gICAgICAgIHZpc2liaWxpdHk6IHZpc2liaWxpdHlcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZE5vZGVcIiwgcGFyYW0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIEFkZHMgYSBuZXcgZWRnZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgaGF2aW5nIHRoZSBnaXZlbiBzb3VyY2UgYW5kIHRhcmdldCBpZHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmFkZEVkZ2UgPSBmdW5jdGlvbihzb3VyY2UsIHRhcmdldCAsIGVkZ2VjbGFzcywgaWQsIHZpc2liaWxpdHkpIHtcclxuICAvLyBHZXQgdGhlIHZhbGlkYXRpb24gcmVzdWx0XHJcbiAgdmFyIHZhbGlkYXRpb24gPSBlbGVtZW50VXRpbGl0aWVzLnZhbGlkYXRlQXJyb3dFbmRzKGVkZ2VjbGFzcywgY3kuZ2V0RWxlbWVudEJ5SWQoc291cmNlKSwgY3kuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0KSk7XHJcblxyXG4gIC8vIElmIHZhbGlkYXRpb24gcmVzdWx0IGlzICdpbnZhbGlkJyBjYW5jZWwgdGhlIG9wZXJhdGlvblxyXG4gIGlmICh2YWxpZGF0aW9uID09PSAnaW52YWxpZCcpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgLy8gSWYgdmFsaWRhdGlvbiByZXN1bHQgaXMgJ3JldmVyc2UnIHJldmVyc2UgdGhlIHNvdXJjZS10YXJnZXQgcGFpciBiZWZvcmUgY3JlYXRpbmcgdGhlIGVkZ2VcclxuICBpZiAodmFsaWRhdGlvbiA9PT0gJ3JldmVyc2UnKSB7XHJcbiAgICB2YXIgdGVtcCA9IHNvdXJjZTtcclxuICAgIHNvdXJjZSA9IHRhcmdldDtcclxuICAgIHRhcmdldCA9IHRlbXA7XHJcbiAgfVxyXG4gICAgICBcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2Uoc291cmNlLCB0YXJnZXQsIGVkZ2VjbGFzcywgaWQsIHZpc2liaWxpdHkpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgbmV3RWRnZSA6IHtcclxuICAgICAgICBzb3VyY2U6IHNvdXJjZSxcclxuICAgICAgICB0YXJnZXQ6IHRhcmdldCxcclxuICAgICAgICBjbGFzczogZWRnZWNsYXNzLFxyXG4gICAgICAgIGlkOiBpZCxcclxuICAgICAgICB2aXNpYmlsaXR5OiB2aXNpYmlsaXR5XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRFZGdlXCIsIHBhcmFtKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBBZGRzIGEgcHJvY2VzcyB3aXRoIGNvbnZlbmllbnQgZWRnZXMuIEZvciBtb3JlIGluZm9ybWF0aW9uIHBsZWFzZSBzZWUgJ2h0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvbmV3dC9pc3N1ZXMvOScuXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24oX3NvdXJjZSwgX3RhcmdldCwgcHJvY2Vzc1R5cGUpIHtcclxuICAvLyBJZiBzb3VyY2UgYW5kIHRhcmdldCBJRHMgYXJlIGdpdmVuIGdldCB0aGUgZWxlbWVudHMgYnkgSURzXHJcbiAgdmFyIHNvdXJjZSA9IHR5cGVvZiBfc291cmNlID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9zb3VyY2UpIDogX3NvdXJjZTtcclxuICB2YXIgdGFyZ2V0ID0gdHlwZW9mIF90YXJnZXQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3RhcmdldCkgOiBfdGFyZ2V0O1xyXG4gIFxyXG4gIC8vIElmIHNvdXJjZSBvciB0YXJnZXQgZG9lcyBub3QgaGF2ZSBhbiBFUE4gY2xhc3MgdGhlIG9wZXJhdGlvbiBpcyBub3QgdmFsaWRcclxuICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyhzb3VyY2UpIHx8ICFlbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3ModGFyZ2V0KSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzKF9zb3VyY2UsIF90YXJnZXQsIHByb2Nlc3NUeXBlKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIHNvdXJjZTogX3NvdXJjZSxcclxuICAgICAgdGFyZ2V0OiBfdGFyZ2V0LFxyXG4gICAgICBwcm9jZXNzVHlwZTogcHJvY2Vzc1R5cGVcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlc1wiLCBwYXJhbSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogQ2xvbmUgZ2l2ZW4gZWxlbWVudHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jbG9uZUVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZXMpIHtcclxuICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgdmFyIGNiID0gY3kuY2xpcGJvYXJkKCk7XHJcbiAgdmFyIF9pZCA9IGNiLmNvcHkoZWxlcywgXCJjbG9uZU9wZXJhdGlvblwiKTtcclxuXHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJwYXN0ZVwiLCB7aWQ6IF9pZH0pO1xyXG4gIH0gXHJcbiAgZWxzZSB7XHJcbiAgICBjYi5wYXN0ZShfaWQpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIENvcHkgZ2l2ZW4gZWxlbWVudHMgdG8gY2xpcGJvYXJkLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuY29weUVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZXMpIHtcclxuICBjeS5jbGlwYm9hcmQoKS5jb3B5KGVsZXMpO1xyXG59O1xyXG5cclxuLypcclxuICogUGFzdCB0aGUgZWxlbWVudHMgY29waWVkIHRvIGNsaXBib2FyZC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLnBhc3RlRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInBhc3RlXCIpO1xyXG4gIH0gXHJcbiAgZWxzZSB7XHJcbiAgICBjeS5jbGlwYm9hcmQoKS5wYXN0ZSgpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIEFsaWducyBnaXZlbiBub2RlcyBpbiBnaXZlbiBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBvcmRlci4gXHJcbiAqIEhvcml6b250YWwgYW5kIHZlcnRpY2FsIHBhcmFtZXRlcnMgbWF5IGJlICdub25lJyBvciB1bmRlZmluZWQuXHJcbiAqIGFsaWduVG8gcGFyYW1ldGVyIGluZGljYXRlcyB0aGUgbGVhZGluZyBub2RlLlxyXG4gKiBSZXF1cmlyZXMgY3l0b3NjYXBlLWdyaWQtZ3VpZGUgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5hbGlnbiA9IGZ1bmN0aW9uIChub2RlcywgaG9yaXpvbnRhbCwgdmVydGljYWwsIGFsaWduVG8pIHtcclxuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWxpZ25cIiwge1xyXG4gICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgIGhvcml6b250YWw6IGhvcml6b250YWwsXHJcbiAgICAgIHZlcnRpY2FsOiB2ZXJ0aWNhbCxcclxuICAgICAgYWxpZ25UbzogYWxpZ25Ub1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIG5vZGVzLmFsaWduKGhvcml6b250YWwsIHZlcnRpY2FsLCBhbGlnblRvKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDcmVhdGUgY29tcG91bmQgZm9yIGdpdmVuIG5vZGVzLiBjb21wb3VuZFR5cGUgbWF5IGJlICdjb21wbGV4JyBvciAnY29tcGFydG1lbnQnLlxyXG4gKiBUaGlzIG1ldGhvZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgPSBmdW5jdGlvbiAoX25vZGVzLCBjb21wb3VuZFR5cGUpIHtcclxuICB2YXIgbm9kZXMgPSBfbm9kZXM7XHJcbiAgLypcclxuICAgKiBFbGVtaW5hdGUgdGhlIG5vZGVzIHdoaWNoIGNhbm5vdCBoYXZlIGEgcGFyZW50IHdpdGggZ2l2ZW4gY29tcG91bmQgdHlwZVxyXG4gICAqL1xyXG4gIG5vZGVzID0gX25vZGVzLmZpbHRlcihmdW5jdGlvbiAoZWxlbWVudCwgaSkge1xyXG4gICAgaWYodHlwZW9mIGVsZW1lbnQgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgZWxlbWVudCA9IGk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHZhciBzYmduY2xhc3MgPSBlbGVtZW50LmRhdGEoXCJjbGFzc1wiKTtcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmlzVmFsaWRQYXJlbnQoc2JnbmNsYXNzLCBjb21wb3VuZFR5cGUpO1xyXG4gIH0pO1xyXG4gIFxyXG4gIG5vZGVzID0gZWxlbWVudFV0aWxpdGllcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xyXG5cclxuICAvLyBBbGwgZWxlbWVudHMgc2hvdWxkIGhhdmUgdGhlIHNhbWUgcGFyZW50IGFuZCB0aGUgY29tbW9uIHBhcmVudCBzaG91bGQgbm90IGJlIGEgJ2NvbXBsZXgnIFxyXG4gIC8vIGlmIGNvbXBvdW5kVHlwZSBpcyAnY29tcGFydGVudCdcclxuICAvLyBiZWNhdXNlIHRoZSBvbGQgY29tbW9uIHBhcmVudCB3aWxsIGJlIHRoZSBwYXJlbnQgb2YgdGhlIG5ldyBjb21wYXJ0bWVudCBhZnRlciB0aGlzIG9wZXJhdGlvbiBhbmRcclxuICAvLyAnY29tcGxleGVzJyBjYW5ub3QgaW5jbHVkZSAnY29tcGFydG1lbnRzJ1xyXG4gIGlmIChub2Rlcy5sZW5ndGggPT0gMCB8fCAhZWxlbWVudFV0aWxpdGllcy5hbGxIYXZlVGhlU2FtZVBhcmVudChub2RlcylcclxuICAgICAgICAgIHx8ICggY29tcG91bmRUeXBlID09PSAnY29tcGFydG1lbnQnICYmIG5vZGVzLnBhcmVudCgpLmRhdGEoJ2NsYXNzJykgPT09ICdjb21wbGV4JyApICkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAoY3kudW5kb1JlZG8oKSkge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBjb21wb3VuZFR5cGU6IGNvbXBvdW5kVHlwZSxcclxuICAgICAgbm9kZXNUb01ha2VDb21wb3VuZDogbm9kZXNcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlc1wiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMobm9kZXMsIGNvbXBvdW5kVHlwZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24gYW5kIGNoZWNrcyBpZiB0aGUgb3BlcmF0aW9uIGlzIHZhbGlkLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jaGFuZ2VQYXJlbnQgPSBmdW5jdGlvbihub2RlcywgX25ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XHJcbiAgdmFyIG5ld1BhcmVudCA9IHR5cGVvZiBfbmV3UGFyZW50ID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9uZXdQYXJlbnQpIDogX25ld1BhcmVudDtcclxuICAvLyBOZXcgcGFyZW50IGlzIHN1cHBvc2VkIHRvIGJlIG9uZSBvZiB0aGUgcm9vdCwgYSBjb21wbGV4IG9yIGEgY29tcGFydG1lbnRcclxuICBpZiAobmV3UGFyZW50ICYmIG5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikgIT0gXCJjb21wbGV4XCIgJiYgbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKSAhPSBcImNvbXBhcnRtZW50XCIpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgLypcclxuICAgKiBFbGVtaW5hdGUgdGhlIG5vZGVzIHdoaWNoIGNhbm5vdCBoYXZlIHRoZSBuZXdQYXJlbnQgYXMgdGhlaXIgcGFyZW50XHJcbiAgICovXHJcbiAgbm9kZXMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGVsZW1lbnQsIGkpIHtcclxuICAgIGlmKHR5cGVvZiBlbGVtZW50ID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgIGVsZW1lbnQgPSBpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB2YXIgc2JnbmNsYXNzID0gZWxlbWVudC5kYXRhKFwiY2xhc3NcIik7XHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc1ZhbGlkUGFyZW50KHNiZ25jbGFzcywgbmV3UGFyZW50KTtcclxuICB9KTtcclxuICBcclxuICAvLyBEaXNjYXJkIHRoZSBub2RlcyB3aG9zZSBwYXJlbnQgaXMgYWxyZWFkeSBuZXdQYXJlbnQuXHJcbiAgLy8gRGlzY2FyZCB0aGUgbmV3UGFyZW50IGl0c2VsZiBpZiBpdCBpcyBhbW9uZyB0aGUgbm9kZXNcclxuICBub2RlcyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZWxlLCBpKSB7XHJcbiAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgIGVsZSA9IGk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIERpc2NhcmQgdGhlIG5ld1BhcmVudCBpZiBpdCBpcyBhbW9uZyB0aGUgbm9kZXNcclxuICAgIGlmIChuZXdQYXJlbnQgJiYgZWxlLmlkKCkgPT09IG5ld1BhcmVudC5pZCgpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIC8vIERpc2NhcmQgdGhlIG5vZGVzIHdob3NlIHBhcmVudCBpcyBhbHJlYWR5IG5ld1BhcmVudFxyXG4gICAgaWYgKCFuZXdQYXJlbnQpIHtcclxuICAgICAgcmV0dXJuIGVsZS5kYXRhKCdwYXJlbnQnKSAhPSBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVsZS5kYXRhKCdwYXJlbnQnKSAhPT0gbmV3UGFyZW50LmlkKCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIElmIHNvbWUgbm9kZXMgYXJlIGFuY2VzdG9yIG9mIG5ldyBwYXJlbnQgZWxlbWluYXRlIHRoZW1cclxuICBpZiAobmV3UGFyZW50KSB7XHJcbiAgICBub2RlcyA9IG5vZGVzLmRpZmZlcmVuY2UobmV3UGFyZW50LmFuY2VzdG9ycygpKTtcclxuICB9XHJcblxyXG4gIC8vIElmIGFsbCBub2RlcyBhcmUgZWxlbWluYXRlZCByZXR1cm4gZGlyZWN0bHlcclxuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBKdXN0IG1vdmUgdGhlIHRvcCBtb3N0IG5vZGVzXHJcbiAgbm9kZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldFRvcE1vc3ROb2Rlcyhub2Rlcyk7XHJcbiAgXHJcbiAgdmFyIHBhcmVudElkID0gbmV3UGFyZW50ID8gbmV3UGFyZW50LmlkKCkgOiBudWxsO1xyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIGZpcnN0VGltZTogdHJ1ZSxcclxuICAgICAgcGFyZW50RGF0YTogcGFyZW50SWQsIC8vIEl0IGtlZXBzIHRoZSBuZXdQYXJlbnRJZCAoSnVzdCBhbiBpZCBmb3IgZWFjaCBub2RlcyBmb3IgdGhlIGZpcnN0IHRpbWUpXHJcbiAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgcG9zRGlmZlg6IHBvc0RpZmZYLFxyXG4gICAgICBwb3NEaWZmWTogcG9zRGlmZllcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZVBhcmVudFwiLCBwYXJhbSk7IC8vIFRoaXMgYWN0aW9uIGlzIHJlZ2lzdGVyZWQgYnkgdW5kb1JlZG8gZXh0ZW5zaW9uXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQobm9kZXMsIHBhcmVudElkLCBwb3NEaWZmWCwgcG9zRGlmZlkpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qXHJcbiAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxyXG4gKiBpbiB0aGUgY29tcGxleC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIHRoZSBzYW1lIGZ1bmN0aW9uIGluIGVsZW1lbnRVdGlsaXRpZXNcclxuICovXHJcbm1haW5VdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKSB7XHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24odGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICB0ZW1wbGF0ZVR5cGU6IHRlbXBsYXRlVHlwZSxcclxuICAgICAgbWFjcm9tb2xlY3VsZUxpc3Q6IG1hY3JvbW9sZWN1bGVMaXN0LFxyXG4gICAgICBjb21wbGV4TmFtZTogY29tcGxleE5hbWUsXHJcbiAgICAgIHByb2Nlc3NQb3NpdGlvbjogcHJvY2Vzc1Bvc2l0aW9uLFxyXG4gICAgICB0aWxpbmdQYWRkaW5nVmVydGljYWw6IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCxcclxuICAgICAgdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLFxyXG4gICAgICBlZGdlTGVuZ3RoOiBlZGdlTGVuZ3RoXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlVGVtcGxhdGVSZWFjdGlvblwiLCBwYXJhbSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLypcclxuICogUmVzaXplIGdpdmVuIG5vZGVzIGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeSBvbmUgb2Ygd2lkdGggb3IgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0LiBcclxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMucmVzaXplTm9kZXMgPSBmdW5jdGlvbihub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8pIHtcclxuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgd2lkdGg6IHdpZHRoLFxyXG4gICAgICBoZWlnaHQ6IGhlaWdodCxcclxuICAgICAgdXNlQXNwZWN0UmF0aW86IHVzZUFzcGVjdFJhdGlvLFxyXG4gICAgICBwZXJmb3JtT3BlcmF0aW9uOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwicmVzaXplTm9kZXNcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMobm9kZXMsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbi8qXHJcbiAqIENoYW5nZXMgdGhlIGxhYmVsIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gbGFiZWwuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uKG5vZGVzLCBsYWJlbCkge1xyXG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBub2Rlcy5kYXRhKCdsYWJlbCcsIGxhYmVsKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgbGFiZWw6IGxhYmVsLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VOb2RlTGFiZWxcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuLypcclxuICogQ2hhbmdlIGZvbnQgcHJvcGVydGllcyBmb3IgZ2l2ZW4gbm9kZXMgdXNlIHRoZSBnaXZlbiBmb250IGRhdGEuXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24oZWxlcywgZGF0YSkge1xyXG4gIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBlbGVzOiBlbGVzLFxyXG4gICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUZvbnRQcm9wZXJ0aWVzXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZXMsIGRhdGEpO1xyXG4gIH1cclxuICBcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuLypcclxuICogQ2hhbmdlIHN0YXRlIHZhbHVlIG9yIHVuaXQgb2YgaW5mb3JtYXRpb24gYm94IG9mIGdpdmVuIG5vZGVzIHdpdGggZ2l2ZW4gaW5kZXguXHJcbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBwYXJhbWV0ZXJzIHNlZSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94XHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24obm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSkge1xyXG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgaW5kZXg6IGluZGV4LFxyXG4gICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZVN0YXRlT3JJbmZvQm94XCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKTtcclxuICB9XHJcbiAgXHJcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxufTtcclxuXHJcbi8vIEFkZCBhIG5ldyBzdGF0ZSBvciBpbmZvIGJveCB0byBnaXZlbiBub2Rlcy5cclxuLy8gVGhlIGJveCBpcyByZXByZXNlbnRlZCBieSB0aGUgcGFyYW1ldGVyIG9iai5cclxuLy8gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxubWFpblV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uKG5vZGVzLCBvYmopIHtcclxuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChub2Rlcywgb2JqKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIG9iajogb2JqLFxyXG4gICAgICBub2Rlczogbm9kZXNcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxyXG4vLyBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG5tYWluVXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24obm9kZXMsIGluZGV4KSB7XHJcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3gobm9kZXMsIGluZGV4KTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIGluZGV4OiBpbmRleCxcclxuICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICB9O1xyXG5cclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZW1vdmVTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBTZXQgbXVsdGltZXIgc3RhdHVzIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxyXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uKG5vZGVzLCBzdGF0dXMpIHtcclxuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIHN0YXR1czogc3RhdHVzLFxyXG4gICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwic2V0TXVsdGltZXJTdGF0dXNcIiwgcGFyYW0pO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMobm9kZXMsIHN0YXR1cyk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBTZXQgY2xvbmUgbWFya2VyIHN0YXR1cyBvZiBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxyXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi8gXHJcbm1haW5VdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbihub2Rlcywgc3RhdHVzKSB7XHJcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBzdGF0dXM6IHN0YXR1cyxcclxuICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNldENsb25lTWFya2VyU3RhdHVzXCIsIHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xyXG4gIH1cclxuICBcclxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuLypcclxuICogQ2hhbmdlIHN0eWxlL2NzcyBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXHJcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jaGFuZ2VDc3MgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xyXG4gIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzKGVsZXMsIG5hbWUsIHZhbHVlTWFwKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgIGVsZXM6IGVsZXMsXHJcbiAgICAgIHZhbHVlTWFwOiB2YWx1ZU1hcCxcclxuICAgICAgbmFtZTogbmFtZVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUNzc1wiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBDaGFuZ2UgZGF0YSBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXHJcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gKi9cclxubWFpblV0aWxpdGllcy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcclxuICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgXHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEoZWxlcywgbmFtZSwgdmFsdWVNYXApO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgZWxlczogZWxlcyxcclxuICAgICAgdmFsdWVNYXA6IHZhbHVlTWFwLFxyXG4gICAgICBuYW1lOiBuYW1lXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlRGF0YVwiLCBwYXJhbSk7XHJcbiAgfVxyXG4gIFxyXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBVbmhpZGUgZ2l2ZW4gZWxlcyAodGhlIG9uZXMgd2hpY2ggYXJlIGhpZGRlbiBpZiBhbnkpIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXHJcbiAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAqL1xyXG5tYWluVXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcclxuICB2YXIgaGlkZGVuRWxlcyA9IGVsZXMuZmlsdGVyKCc6aGlkZGVuJyk7XHJcbiAgaWYgKGhpZGRlbkVsZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIFxyXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dChoaWRkZW5FbGVzLCBsYXlvdXRwYXJhbSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBlbGVzOiBoaWRkZW5FbGVzLFxyXG4gICAgICBsYXlvdXRwYXJhbTogbGF5b3V0cGFyYW0sXHJcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNob3dBbmRQZXJmb3JtTGF5b3V0XCIsIHBhcmFtKTtcclxuICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBTZXRzIHRoZSBvcmRlcmluZyBvZiB0aGUgZ2l2ZW4gbm9kZXMuXHJcbiAqIE9yZGVyaW5nIG9wdGlvbnMgYXJlICdMLXRvLVInLCAnUi10by1MJywgJ1QtdG8tQicsICdCLXRvLVQnLCAnbm9uZScuXHJcbiAqIElmIGEgbm9kZSBkb2VzIG5vdCBoYXZlIGFueSBwb3J0IGJlZm9yZSB0aGUgb3BlcmF0aW9uIGFuZCBpdCBpcyBzdXBwb3NlZCB0byBoYXZlIHNvbWUgYWZ0ZXIgb3BlcmF0aW9uIHRoZSBwb3J0RGlzdGFuY2UgcGFyYW1ldGVyIGlzIFxyXG4gKiB1c2VkIHRvIHNldCB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgbm9kZSBjZW50ZXIgYW5kIHRoZSBwb3J0cy4gVGhlIGRlZmF1bHQgcG9ydCBkaXN0YW5jZSBpcyA2MC5cclxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICovXHJcbm1haW5VdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyA9IGZ1bmN0aW9uIChub2Rlcywgb3JkZXJpbmcsIHBvcnREaXN0YW5jZSkge1xyXG4gIGlmICggbm9kZXMubGVuZ3RoID09PSAwICkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhub2Rlcywgb3JkZXJpbmcsIHBvcnREaXN0YW5jZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgIG9yZGVyaW5nOiBvcmRlcmluZyxcclxuICAgICAgcG9ydERpc3RhbmNlOiBwb3J0RGlzdGFuY2VcclxuICAgIH07XHJcbiAgICBcclxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXRQb3J0c09yZGVyaW5nXCIsIHBhcmFtKTtcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1haW5VdGlsaXRpZXM7IiwiLypcclxuICogIEV4dGVuZCBkZWZhdWx0IG9wdGlvbnMgYW5kIGdldCBjdXJyZW50IG9wdGlvbnMgYnkgdXNpbmcgdGhpcyBmaWxlIFxyXG4gKi9cclxuXHJcbi8vIGRlZmF1bHQgb3B0aW9uc1xyXG52YXIgZGVmYXVsdHMgPSB7XHJcbiAgLy8gVGhlIHBhdGggb2YgY29yZSBsaWJyYXJ5IGltYWdlcyB3aGVuIHNiZ252aXogaXMgcmVxdWlyZWQgZnJvbSBucG0gYW5kIHRoZSBpbmRleCBodG1sIFxyXG4gIC8vIGZpbGUgYW5kIG5vZGVfbW9kdWxlcyBhcmUgdW5kZXIgdGhlIHNhbWUgZm9sZGVyIHRoZW4gdXNpbmcgdGhlIGRlZmF1bHQgdmFsdWUgaXMgZmluZVxyXG4gIGltZ1BhdGg6ICdub2RlX21vZHVsZXMvc2JnbnZpei9zcmMvaW1nJyxcclxuICAvLyBXaGV0aGVyIHRvIGZpdCBsYWJlbHMgdG8gbm9kZXNcclxuICBmaXRMYWJlbHNUb05vZGVzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSxcclxuICAvLyBkeW5hbWljIGxhYmVsIHNpemUgaXQgbWF5IGJlICdzbWFsbCcsICdyZWd1bGFyJywgJ2xhcmdlJ1xyXG4gIGR5bmFtaWNMYWJlbFNpemU6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAncmVndWxhcic7XHJcbiAgfSxcclxuICAvLyBwZXJjZW50YWdlIHVzZWQgdG8gY2FsY3VsYXRlIGNvbXBvdW5kIHBhZGRpbmdzXHJcbiAgY29tcG91bmRQYWRkaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gMTA7XHJcbiAgfSxcclxuICAvLyBXaGV0aGVyIHRvIGFkanVzdCBub2RlIGxhYmVsIGZvbnQgc2l6ZSBhdXRvbWF0aWNhbGx5LlxyXG4gIC8vIElmIHRoaXMgb3B0aW9uIHJldHVybiBmYWxzZSBkbyBub3QgYWRqdXN0IGxhYmVsIHNpemVzIGFjY29yZGluZyB0byBub2RlIGhlaWdodCB1c2VzIG5vZGUuZGF0YSgnZm9udC1zaXplJylcclxuICAvLyBpbnN0ZWFkIG9mIGRvaW5nIGl0LlxyXG4gIGFkanVzdE5vZGVMYWJlbEZvbnRTaXplQXV0b21hdGljYWxseTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9LFxyXG4gIC8vIFRoZSBzZWxlY3RvciBvZiB0aGUgY29tcG9uZW50IGNvbnRhaW5pbmcgdGhlIHNiZ24gbmV0d29ya1xyXG4gIG5ldHdvcmtDb250YWluZXJTZWxlY3RvcjogJyNzYmduLW5ldHdvcmstY29udGFpbmVyJyxcclxuICAvLyBXaGV0aGVyIHRoZSBhY3Rpb25zIGFyZSB1bmRvYWJsZSwgcmVxdWlyZXMgY3l0b3NjYXBlLXVuZG8tcmVkbyBleHRlbnNpb25cclxuICB1bmRvYWJsZTogdHJ1ZSxcclxuICAvLyBXaGV0aGVyIHRvIGhhdmUgdW5kb2FibGUgZHJhZyBmZWF0dXJlIGluIHVuZG8vcmVkbyBleHRlbnNpb24uIFRoaXMgb3B0aW9ucyB3aWxsIGJlIHBhc3NlZCB0byB1bmRvL3JlZG8gZXh0ZW5zaW9uXHJcbiAgdW5kb2FibGVEcmFnOiB0cnVlXHJcbn07XHJcblxyXG52YXIgb3B0aW9uVXRpbGl0aWVzID0gZnVuY3Rpb24gKCkge1xyXG59O1xyXG5cclxuLy8gRXh0ZW5kIHRoZSBkZWZhdWx0cyBvcHRpb25zIHdpdGggdGhlIHVzZXIgb3B0aW9uc1xyXG5vcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgdmFyIHJlc3VsdCA9IHt9O1xyXG5cclxuICBmb3IgKHZhciBwcm9wIGluIGRlZmF1bHRzKSB7XHJcbiAgICByZXN1bHRbcHJvcF0gPSBkZWZhdWx0c1twcm9wXTtcclxuICB9XHJcbiAgXHJcbiAgZm9yICh2YXIgcHJvcCBpbiBvcHRpb25zKSB7XHJcbiAgICByZXN1bHRbcHJvcF0gPSBvcHRpb25zW3Byb3BdO1xyXG4gIH1cclxuXHJcbiAgb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnMgPSByZXN1bHQ7XHJcblxyXG4gIHJldHVybiBvcHRpb25zO1xyXG59O1xyXG5cclxub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIG9wdGlvblV0aWxpdGllcy5vcHRpb25zO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBvcHRpb25VdGlsaXRpZXM7IiwidmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gcmVxdWlyZSgnLi91bmRvLXJlZG8tYWN0aW9uLWZ1bmN0aW9ucycpO1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIG9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKS5nZXRPcHRpb25zKCk7XHJcbnZhciAkID0gbGlicy5qUXVlcnk7XHJcblxyXG52YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSBmdW5jdGlvbiAodW5kb2FibGVEcmFnKSB7XHJcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIC8vIGNyZWF0ZSB1bmRvLXJlZG8gaW5zdGFuY2VcclxuICB2YXIgdXIgPSBjeS51bmRvUmVkbyh7XHJcbiAgICB1bmRvYWJsZURyYWc6IHVuZG9hYmxlRHJhZ1xyXG4gIH0pO1xyXG5cclxuICAvLyByZWdpc3RlciBhZGQgcmVtb3ZlIGFjdGlvbnNcclxuICB1ci5hY3Rpb24oXCJhZGROb2RlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZE5vZGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xyXG4gIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTaW1wbGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xyXG4gIHVyLmFjdGlvbihcImFkZEVkZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XHJcbiAgdXIuYWN0aW9uKFwiYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xyXG4gIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTbWFydFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU21hcnQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcclxuICB1ci5hY3Rpb24oXCJjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMpO1xyXG5cclxuICAvLyByZWdpc3RlciBnZW5lcmFsIGFjdGlvbnNcclxuICB1ci5hY3Rpb24oXCJyZXNpemVOb2Rlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMpO1xyXG4gIHVyLmFjdGlvbihcImNoYW5nZU5vZGVMYWJlbFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCk7XHJcbiAgdXIuYWN0aW9uKFwiY2hhbmdlRGF0YVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhKTtcclxuICB1ci5hY3Rpb24oXCJjaGFuZ2VDc3NcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MpO1xyXG4gIHVyLmFjdGlvbihcImNoYW5nZUJlbmRQb2ludHNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmVuZFBvaW50cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmVuZFBvaW50cyk7XHJcbiAgdXIuYWN0aW9uKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKTtcclxuICB1ci5hY3Rpb24oXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUxheW91dCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtTGF5b3V0KTtcclxuXHJcbiAgLy8gcmVnaXN0ZXIgU0JHTiBhY3Rpb25zXHJcbiAgdXIuYWN0aW9uKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94KTtcclxuICB1ci5hY3Rpb24oXCJjaGFuZ2VTdGF0ZU9ySW5mb0JveFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3gpO1xyXG4gIHVyLmFjdGlvbihcInNldE11bHRpbWVyU3RhdHVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cyk7XHJcbiAgdXIuYWN0aW9uKFwic2V0Q2xvbmVNYXJrZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzKTtcclxuICB1ci5hY3Rpb24oXCJyZW1vdmVTdGF0ZU9ySW5mb0JveFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3gpO1xyXG4gIHVyLmFjdGlvbihcInNldFBvcnRzT3JkZXJpbmdcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0UG9ydHNPcmRlcmluZywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0UG9ydHNPcmRlcmluZyk7XHJcbiAgXHJcbiAgLy8gcmVnaXN0ZXIgZWFzeSBjcmVhdGlvbiBhY3Rpb25zXHJcbiAgdXIuYWN0aW9uKFwiY3JlYXRlVGVtcGxhdGVSZWFjdGlvblwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcclxuXHJcbiAgdXIuYWN0aW9uKFwic2V0RGVmYXVsdFByb3BlcnR5XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldERlZmF1bHRQcm9wZXJ0eSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0RGVmYXVsdFByb3BlcnR5KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odW5kb2FibGVEcmFnKSB7XHJcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyh1bmRvYWJsZURyYWcpO1xyXG4gIH0pO1xyXG59OyIsIi8vIEV4dGVuZHMgc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIHNiZ252aXogPSBsaWJzLnNiZ252aXo7XHJcbnZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHNiZ252aXoudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XHJcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xyXG5cclxuLy8gU2VjdGlvbiBTdGFydFxyXG4vLyBhZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZE5vZGUgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0O1xyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIHZhciBuZXdOb2RlID0gcGFyYW0ubmV3Tm9kZTtcclxuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShuZXdOb2RlLngsIG5ld05vZGUueSwgbmV3Tm9kZS5jbGFzcywgbmV3Tm9kZS5pZCwgbmV3Tm9kZS5wYXJlbnQsIG5ld05vZGUudmlzaWJpbGl0eSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZWxlczogcmVzdWx0XHJcbiAgfTtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZEVkZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0O1xyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIHZhciBuZXdFZGdlID0gcGFyYW0ubmV3RWRnZTtcclxuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdFZGdlLnNvdXJjZSwgbmV3RWRnZS50YXJnZXQsIG5ld0VkZ2UuY2xhc3MsIG5ld0VkZ2UuaWQsIG5ld0VkZ2UudmlzaWJpbGl0eSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZWxlczogcmVzdWx0XHJcbiAgfTtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24ocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0O1xyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMocGFyYW0uc291cmNlLCBwYXJhbS50YXJnZXQsIHBhcmFtLnByb2Nlc3NUeXBlKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKHBhcmFtKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBlbGVzOiByZXN1bHRcclxuICB9O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdCA9IHt9O1xyXG5cclxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICAvLyBOb2RlcyB0byBtYWtlIGNvbXBvdW5kLCB0aGVpciBkZXNjZW5kYW50cyBhbmQgZWRnZXMgY29ubmVjdGVkIHRvIHRoZW0gd2lsbCBiZSByZW1vdmVkIGR1cmluZyBjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgb3BlcmF0aW9uXHJcbiAgICAvLyAoaW50ZXJuYWxseSBieSBlbGVzLm1vdmUoKSBvcGVyYXRpb24pLCBzbyBtYXJrIHRoZW0gYXMgcmVtb3ZlZCBlbGVzIGZvciB1bmRvIG9wZXJhdGlvbi5cclxuICAgIHZhciBub2Rlc1RvTWFrZUNvbXBvdW5kID0gcGFyYW0ubm9kZXNUb01ha2VDb21wb3VuZDtcclxuICAgIHZhciByZW1vdmVkRWxlcyA9IG5vZGVzVG9NYWtlQ29tcG91bmQudW5pb24obm9kZXNUb01ha2VDb21wb3VuZC5kZXNjZW5kYW50cygpKTtcclxuICAgIHJlbW92ZWRFbGVzID0gcmVtb3ZlZEVsZXMudW5pb24ocmVtb3ZlZEVsZXMuY29ubmVjdGVkRWRnZXMoKSk7XHJcbiAgICByZXN1bHQucmVtb3ZlZEVsZXMgPSByZW1vdmVkRWxlcztcclxuICAgIC8vIEFzc3VtZSB0aGF0IGFsbCBub2RlcyB0byBtYWtlIGNvbXBvdW5kIGhhdmUgdGhlIHNhbWUgcGFyZW50XHJcbiAgICB2YXIgb2xkUGFyZW50SWQgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJwYXJlbnRcIik7XHJcbiAgICAvLyBUaGUgcGFyZW50IG9mIG5ldyBjb21wb3VuZCB3aWxsIGJlIHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kXHJcbiAgICAvLyBOZXcgZWxlcyBpbmNsdWRlcyBuZXcgY29tcG91bmQgYW5kIHRoZSBtb3ZlZCBlbGVzIGFuZCB3aWxsIGJlIHVzZWQgaW4gdW5kbyBvcGVyYXRpb24uXHJcbiAgICByZXN1bHQubmV3RWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKG5vZGVzVG9NYWtlQ29tcG91bmQsIHBhcmFtLmNvbXBvdW5kVHlwZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmVzdWx0LnJlbW92ZWRFbGVzID0gcGFyYW0ubmV3RWxlcy5yZW1vdmUoKTtcclxuICAgIHJlc3VsdC5uZXdFbGVzID0gcGFyYW0ucmVtb3ZlZEVsZXMucmVzdG9yZSgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8vIFNlY3Rpb24gRW5kXHJcbi8vIGFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxuLy8gU2VjdGlvbiBTdGFydFxyXG4vLyBlYXN5IGNyZWF0aW9uIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xyXG4gIHZhciBlbGVzO1xyXG5cclxuICBpZiAoZmlyc3RUaW1lKSB7XHJcbiAgICBlbGVzID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uKHBhcmFtLnRlbXBsYXRlVHlwZSwgcGFyYW0ubWFjcm9tb2xlY3VsZUxpc3QsIHBhcmFtLmNvbXBsZXhOYW1lLCBwYXJhbS5wcm9jZXNzUG9zaXRpb24sIHBhcmFtLnRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgcGFyYW0udGlsaW5nUGFkZGluZ0hvcml6b250YWwsIHBhcmFtLmVkZ2VMZW5ndGgpXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWxlcyA9IHBhcmFtO1xyXG4gICAgY3kuYWRkKGVsZXMpO1xyXG4gICAgXHJcbiAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XHJcbiAgICBlbGVzLnNlbGVjdCgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGVsZXM6IGVsZXNcclxuICB9O1xyXG59O1xyXG5cclxuLy8gU2VjdGlvbiBFbmRcclxuLy8gZWFzeSBjcmVhdGlvbiBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG4vLyBTZWN0aW9uIFN0YXJ0XHJcbi8vIGdlbmVyYWwgYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcG9zaXRpb25zID0ge307XHJcbiAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcclxuICBcclxuICBub2Rlcy5lYWNoKGZ1bmN0aW9uKGVsZSwgaSkge1xyXG4gICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICBlbGUgPSBpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwb3NpdGlvbnNbZWxlLmlkKCldID0ge1xyXG4gICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxyXG4gICAgICB5OiBlbGUucG9zaXRpb24oXCJ5XCIpXHJcbiAgICB9O1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gcG9zaXRpb25zO1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMgPSBmdW5jdGlvbiAocG9zaXRpb25zKSB7XHJcbiAgdmFyIGN1cnJlbnRQb3NpdGlvbnMgPSB7fTtcclxuICBjeS5ub2RlcygpLnBvc2l0aW9ucyhmdW5jdGlvbiAoZWxlLCBpKSB7XHJcbiAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgIGVsZSA9IGk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGN1cnJlbnRQb3NpdGlvbnNbZWxlLmlkKCldID0ge1xyXG4gICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxyXG4gICAgICB5OiBlbGUucG9zaXRpb24oXCJ5XCIpXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICB2YXIgcG9zID0gcG9zaXRpb25zW2VsZS5pZCgpXTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IHBvcy54LFxyXG4gICAgICB5OiBwb3MueVxyXG4gICAgfTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGN1cnJlbnRQb3NpdGlvbnM7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBwZXJmb3JtT3BlcmF0aW9uOiB0cnVlXHJcbiAgfTtcclxuXHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcblxyXG4gIHJlc3VsdC5zaXplTWFwID0ge307XHJcbiAgcmVzdWx0LnVzZUFzcGVjdFJhdGlvID0gZmFsc2U7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICByZXN1bHQuc2l6ZU1hcFtub2RlLmlkKCldID0ge1xyXG4gICAgICB3OiBub2RlLndpZHRoKCksXHJcbiAgICAgIGg6IG5vZGUuaGVpZ2h0KClcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICByZXN1bHQubm9kZXMgPSBub2RlcztcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuXHJcbiAgICBpZiAocGFyYW0ucGVyZm9ybU9wZXJhdGlvbikge1xyXG4gICAgICBpZiAocGFyYW0uc2l6ZU1hcCkge1xyXG4gICAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS53O1xyXG4gICAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5oO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMocGFyYW0ubm9kZXMsIHBhcmFtLndpZHRoLCBwYXJhbS5oZWlnaHQsIHBhcmFtLnVzZUFzcGVjdFJhdGlvKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgfTtcclxuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuICByZXN1bHQubm9kZXMgPSBub2RlcztcclxuICByZXN1bHQubGFiZWwgPSB7fTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHJlc3VsdC5sYWJlbFtub2RlLmlkKCldID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xyXG4gIH1cclxuXHJcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBwYXJhbS5sYWJlbCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICBub2RlLl9wcml2YXRlLmRhdGEubGFiZWwgPSBwYXJhbS5sYWJlbFtub2RlLmlkKCldO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gIH07XHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG4gIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTtcclxuICByZXN1bHQudmFsdWVNYXAgPSB7fTtcclxuICByZXN1bHQuZWxlcyA9IGVsZXM7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICByZXN1bHQudmFsdWVNYXBbZWxlLmlkKCldID0gZWxlLmRhdGEocGFyYW0ubmFtZSk7XHJcbiAgfVxyXG5cclxuICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEocGFyYW0uZWxlcywgcGFyYW0ubmFtZSwgcGFyYW0udmFsdWVNYXApO1xyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICB9O1xyXG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuICByZXN1bHQubmFtZSA9IHBhcmFtLm5hbWU7XHJcbiAgcmVzdWx0LnZhbHVlTWFwID0ge307XHJcbiAgcmVzdWx0LmVsZXMgPSBlbGVzO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG4gICAgcmVzdWx0LnZhbHVlTWFwW2VsZS5pZCgpXSA9IGVsZS5jc3MocGFyYW0ubmFtZSk7XHJcbiAgfVxyXG5cclxuICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyhwYXJhbS5lbGVzLCBwYXJhbS5uYW1lLCBwYXJhbS52YWx1ZU1hcCk7XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgfTtcclxuXHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG4gIHJlc3VsdC5kYXRhID0ge307XHJcbiAgcmVzdWx0LmVsZXMgPSBlbGVzO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG5cclxuICAgIHJlc3VsdC5kYXRhW2VsZS5pZCgpXSA9IHt9O1xyXG5cclxuICAgIHZhciBkYXRhID0gcGFyYW0uZmlyc3RUaW1lID8gcGFyYW0uZGF0YSA6IHBhcmFtLmRhdGFbZWxlLmlkKCldO1xyXG5cclxuICAgIGZvciAodmFyIHByb3AgaW4gZGF0YSkge1xyXG4gICAgICByZXN1bHQuZGF0YVtlbGUuaWQoKV1bcHJvcF0gPSBlbGUuZGF0YShwcm9wKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgZGF0YSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG4gICAgICBcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyhlbGUsIGRhdGEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8qXHJcbiAqIFNob3cgZWxlcyBhbmQgcGVyZm9ybSBsYXlvdXQuXHJcbiAqL1xyXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuXHJcbiAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XHJcbiAgXHJcbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgcmVzdWx0LmVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0KHBhcmFtLmVsZXMsIHBhcmFtLmxheW91dHBhcmFtKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXN1bHQuZWxlcyA9IGN5LnZpZXdVdGlsaXRpZXMoKS5zaG93KGVsZXMpOyAvLyBTaG93IGdpdmVuIGVsZXNcclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG5cclxuICB2YXIgcmVzdWx0ID0ge307XHJcbiAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcclxuICByZXN1bHQuZWxlcyA9IGN5LnZpZXdVdGlsaXRpZXMoKS5oaWRlKGVsZXMpOyAvLyBIaWRlIHByZXZpb3VzbHkgdW5oaWRkZW4gZWxlcztcclxuXHJcbiAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8vIFNlY3Rpb24gRW5kXHJcbi8vIGdlbmVyYWwgYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxuLy8gU2VjdGlvbiBTdGFydFxyXG4vLyBzYmduIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICB9O1xyXG4gIHJlc3VsdC50eXBlID0gcGFyYW0udHlwZTtcclxuICByZXN1bHQubm9kZXMgPSBwYXJhbS5ub2RlcztcclxuICByZXN1bHQuaW5kZXggPSBwYXJhbS5pbmRleDtcclxuXHJcbiAgcmVzdWx0LnZhbHVlID0gZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveChwYXJhbS5ub2RlcywgcGFyYW0uaW5kZXgsIHBhcmFtLnZhbHVlLCBwYXJhbS50eXBlKTtcclxuXHJcbiAgY3kuZm9yY2VSZW5kZXIoKTtcclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIG9iaiA9IHBhcmFtLm9iajtcclxuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuXHJcbiAgdmFyIGluZGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChub2Rlcywgb2JqKTtcclxuXHJcbiAgY3kuZm9yY2VSZW5kZXIoKTtcclxuXHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICAgIG5vZGVzOiBub2RlcyxcclxuICAgIGluZGV4OiBpbmRleCxcclxuICAgIG9iajogb2JqXHJcbiAgfTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgaW5kZXggPSBwYXJhbS5pbmRleDtcclxuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuXHJcbiAgdmFyIG9iaiA9IGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3gobm9kZXMsIGluZGV4KTtcclxuXHJcbiAgY3kuZm9yY2VSZW5kZXIoKTtcclxuXHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICAgIG5vZGVzOiBub2RlcyxcclxuICAgIG9iajogb2JqXHJcbiAgfTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xyXG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG4gIHZhciBzdGF0dXMgPSBwYXJhbS5zdGF0dXM7XHJcbiAgdmFyIHJlc3VsdFN0YXR1cyA9IHt9O1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgdmFyIGlzTXVsdGltZXIgPSBub2RlLmRhdGEoJ2NsYXNzJykuZW5kc1dpdGgoJyBtdWx0aW1lcicpO1xyXG5cclxuICAgIHJlc3VsdFN0YXR1c1tub2RlLmlkKCldID0gaXNNdWx0aW1lcjtcclxuICB9XHJcblxyXG4gIC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IHRpbWUgY2hhbmdlIHRoZSBzdGF0dXMgb2YgYWxsIG5vZGVzIGF0IG9uY2UuXHJcbiAgLy8gSWYgbm90IGNoYW5nZSBzdGF0dXMgb2YgZWFjaCBzZXBlcmF0ZWx5IHRvIHRoZSB2YWx1ZXMgbWFwcGVkIHRvIHRoZWlyIGlkLlxyXG4gIGlmIChmaXJzdFRpbWUpIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMobm9kZXMsIHN0YXR1cyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGUsIHN0YXR1c1tub2RlLmlkKCldKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4vLyAgaWYgKCFmaXJzdFRpbWUgJiYgXy5pc0VxdWFsKG5vZGVzLCBjeS5ub2RlcygnOnNlbGVjdGVkJykpKSB7XHJcbi8vICAgICQoJyNpbnNwZWN0b3ItaXMtbXVsdGltZXInKS5hdHRyKFwiY2hlY2tlZFwiLCAhJCgnI2luc3BlY3Rvci1pcy1tdWx0aW1lcicpLmF0dHIoXCJjaGVja2VkXCIpKTtcclxuLy8gIH1cclxuXHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICAgIHN0YXR1czogcmVzdWx0U3RhdHVzLFxyXG4gICAgbm9kZXM6IG5vZGVzXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcbiAgdmFyIHN0YXR1cyA9IHBhcmFtLnN0YXR1cztcclxuICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xyXG4gIHZhciByZXN1bHRTdGF0dXMgPSB7fTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHJlc3VsdFN0YXR1c1tub2RlLmlkKCldID0gbm9kZS5kYXRhKCdjbG9uZW1hcmtlcicpO1xyXG4gICAgdmFyIGN1cnJlbnRTdGF0dXMgPSBmaXJzdFRpbWUgPyBzdGF0dXMgOiBzdGF0dXNbbm9kZS5pZCgpXTtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMobm9kZSwgY3VycmVudFN0YXR1cyk7XHJcbiAgfVxyXG5cclxuLy8gIGlmICghZmlyc3RUaW1lICYmIF8uaXNFcXVhbChub2RlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xyXG4vLyAgICAkKCcjaW5zcGVjdG9yLWlzLWNsb25lLW1hcmtlcicpLmF0dHIoXCJjaGVja2VkXCIsICEkKCcjaW5zcGVjdG9yLWlzLWNsb25lLW1hcmtlcicpLmF0dHIoXCJjaGVja2VkXCIpKTtcclxuLy8gIH1cclxuXHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICAgIHN0YXR1czogcmVzdWx0U3RhdHVzLFxyXG4gICAgbm9kZXM6IG5vZGVzXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8vIHBhcmFtOiB7Y2xhc3M6IHNiZ25jbGFzcywgbmFtZTogcHJvcGVydHlOYW1lLCB2YWx1ZTogdmFsdWV9XHJcbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldERlZmF1bHRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gIHZhciBzYmduY2xhc3MgPSBwYXJhbS5jbGFzcztcclxuICB2YXIgbmFtZSA9IHBhcmFtLm5hbWU7XHJcbiAgdmFyIHZhbHVlID0gcGFyYW0udmFsdWU7XHJcbiAgdmFyIGNsYXNzRGVmYXVsdHMgPSBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW3NiZ25jbGFzc107XHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICAgIGNsYXNzOiBzYmduY2xhc3MsXHJcbiAgICBuYW1lOiBuYW1lLFxyXG4gICAgdmFsdWU6IGNsYXNzRGVmYXVsdHMuaGFzT3duUHJvcGVydHkobmFtZSkgPyBjbGFzc0RlZmF1bHRzW25hbWVdIDogdW5kZWZpbmVkXHJcbiAgfTtcclxuXHJcbiAgY2xhc3NEZWZhdWx0c1tuYW1lXSA9IHZhbHVlO1xyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0UG9ydHNPcmRlcmluZyA9IGZ1bmN0aW9uKHBhcmFtKSB7XHJcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcbiAgdmFyIG9yZGVyaW5nID0gcGFyYW0ub3JkZXJpbmc7XHJcbiAgdmFyIHBvcnREaXN0YW5jZSA9IHBhcmFtLnBvcnREaXN0YW5jZTtcclxuICB2YXIgY29ubmVjdGVkRWRnZXMgPSBub2Rlcy5jb25uZWN0ZWRFZGdlcygpO1xyXG4gIHZhciBub2RlUHJvcE1hcCA9IHt9OyAvLyBOb2RlIHByb3AgbWFwIGZvciBjdXJyZW50IHN0YXR1cyBvZiB0aGUgbm9kZXMgaXQgaXMgdG8gYmUgYXR0YWNoZWQgdG8gdGhlIHJlc3VsdCBtYXAuIEl0IGluY2x1ZGVzIG5vZGUgcG9ydHMuXHJcbiAgdmFyIGVkZ2VQcm9wTWFwID0ge307IC8vIEVkZ2UgcHJvcCBtYXAgZm9yIGN1cnJlbnQgc3RhdHVzIG9mIHRoZSBub2RlcyBpdCBpcyB0byBiZSBhdHRhY2hlZCB0byB0aGUgcmVzdWx0IG1hcC4gSXQgaW5jbHVkZXMgZWRnZSBwb3J0c291cmNlIGFuZCBwb3J0dGFyZ2V0LlxyXG4gIFxyXG4gIC8vIEZpbGwgbm9kZS9lZGdlIHByb3AgbWFwcyBmb3IgdW5kby9yZWRvIGFjdGlvbnNcclxuICBcclxuICAvLyBOb2RlIHByb3AgbWFwIGluY2x1ZGVzIGEgY29weSBvZiBub2RlIHBvcnRzXHJcbiAgZm9yICggdmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKysgKSB7XHJcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgdmFyIHBvcnRzID0gbm9kZS5kYXRhKCdwb3J0cycpO1xyXG4gICAgbm9kZVByb3BNYXBbbm9kZS5pZCgpXSA9IHBvcnRzLmxlbmd0aCA9PT0gMiA/IFsgeyBpZDogcG9ydHNbMF0uaWQsIHg6IHBvcnRzWzBdLngsIHk6IHBvcnRzWzBdLnkgfSwgeyBpZDogcG9ydHNbMV0uaWQsIHg6IHBvcnRzWzFdLngsIHk6IHBvcnRzWzFdLnkgfSBdIDogW107XHJcbiAgfVxyXG4gIFxyXG4gIC8vIE5vZGUgcHJvcCBtYXAgaW5jbHVkZXMgYSBlZGdlIHBvcnRzb3VyY2UgYW5kIHBvcnR0YXJnZXRcclxuICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBjb25uZWN0ZWRFZGdlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgIHZhciBlZGdlID0gY29ubmVjdGVkRWRnZXNbaV07XHJcbiAgICBlZGdlUHJvcE1hcFtlZGdlLmlkKCldID0geyBwb3J0c291cmNlOiBlZGdlLmRhdGEoJ3BvcnRzb3VyY2UnKSwgcG9ydHRhcmdldDogZWRnZS5kYXRhKCdwb3J0dGFyZ2V0JykgfTtcclxuICB9XHJcbiAgXHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICAgIG5vZGVzOiBub2RlcyxcclxuICAgIG5vZGVQcm9wTWFwOiBub2RlUHJvcE1hcCxcclxuICAgIGVkZ2VQcm9wTWFwOiBlZGdlUHJvcE1hcFxyXG4gIH07XHJcbiAgXHJcbiAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZSBjYWxsIHJlbGF0ZWQgbWV0aG9kIGZyb20gZWxlbWVudCB1dGlsaXRpZXMgZWxzZSBnbyBiYWNrIHRvIHRoZSBzdG9yZWQgcHJvcHMgb2Ygbm9kZXMvZWRnZXNcclxuICBpZiAoIHBhcmFtLmZpcnN0VGltZSApIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhub2Rlcywgb3JkZXJpbmcsIHBvcnREaXN0YW5jZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgY3kuc3RhcnRCYXRjaCgpO1xyXG4gICAgXHJcbiAgICAvLyBHbyBiYWNrIHRvIHN0b3JlZCBub2RlIHBvcnRzIHN0YXRlXHJcbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgdmFyIHBvcnRzID0gcGFyYW0ubm9kZVByb3BNYXBbbm9kZS5pZCgpXTtcclxuICAgICAgbm9kZS5kYXRhKCdwb3J0cycsIHBvcnRzKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gR28gYmFjayB0byBzdG9yZWQgZWRnZSBwb3J0c291cmNlL3BvcnR0YXJnZXRzIHN0YXRlXHJcbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBjb25uZWN0ZWRFZGdlcy5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgdmFyIGVkZ2UgPSBjb25uZWN0ZWRFZGdlc1tpXTtcclxuICAgICAgdmFyIHByb3BzID0gcGFyYW0uZWRnZVByb3BNYXBbZWRnZS5pZCgpXTtcclxuICAgICAgZWRnZS5kYXRhKCdwb3J0c291cmNlJywgcHJvcHMucG9ydHNvdXJjZSk7XHJcbiAgICAgIGVkZ2UuZGF0YSgncG9ydHRhcmdldCcsIHByb3BzLnBvcnR0YXJnZXQpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjeS5lbmRCYXRjaCgpO1xyXG4gIH1cclxuICBcclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLy8gU2VjdGlvbiBFbmRcclxuLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zOyJdfQ==
