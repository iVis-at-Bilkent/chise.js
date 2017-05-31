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
  var ordering = this.defaultProperties[sbgnclass]['ports-ordering']; // Get the default ports ordering for the nodes with given sbgnclass
  
  // If there is a default ports ordering for the nodes with given sbgnclass and it is different than 'none' set the ports ordering to that ordering
  if (ordering && ordering !== 'none') {
    this.setPortsOrdering(newNode, ordering);
  }

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
  console.log("before", nodes.data('statesandinfos'));
  nodes.move({"parent": newParentId});
  console.log("after", nodes.data('statesandinfos'));
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
    var edgeClass = edge.data('class');
    /*
     * If the node is the edge target we may need to set the porttarget of the edge to the input port of the node (First or second port accoring to the orientation)
     * if it is the edge soruce we may need to set the portsource of the edge to the output port similarly.
     * Note that if fron left or top (fromLorT) is true then the first port is the source port and second port is the target port,
     * else it is vice versa.
     * 
     */
    if ( edge.data('target') === node.id() ) {
      if (edgeClass === 'production' || this.isModulationArcClass(edgeClass)) {
        continue; // production or modulation type of edges cannot be connected to any port of target node (A production can have a process as target node but it is supposed to be connected to that node from its body, not from a port)
      }
      if ( fromLorT ) {
        edge.data('porttarget', firstPortId);
      }
      else {
        edge.data('porttarget', secondPortId);
      }
    }
    else {
      if (edgeClass === 'consumption') {
        continue; // consumpiton edge cannot be connected to any port of source node
      }
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
  
  nodes.data('portsordering', ordering); // Update the cached orderings of the nodes
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
  
  cy.style().update();
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
  var nodePropMap = {}; // Node prop map for current status of the nodes it is to be attached to the result map. It includes node current port ordering and current ports.
  var edgePropMap = {}; // Edge prop map for current status of the nodes it is to be attached to the result map. It includes edge portsource and porttarget.
  
  // Fill node/edge prop maps for undo/redo actions
  
  // Node prop map includes a copy of node ports
  for ( var i = 0; i < nodes.length; i++ ) {
    var node = nodes[i];
    var ports = node.data('ports');
    var currentOrdering = sbgnviz.elementUtilities.getPortsOrdering(node); // Get the current node ports ordering
    var portsCopy = ports.length === 2 ? [ { id: ports[0].id, x: ports[0].x, y: ports[0].y }, { id: ports[1].id, x: ports[1].x, y: ports[1].y } ] : [];
    nodePropMap[node.id()] = { ordering: currentOrdering, ports: portsCopy };
  }
  
  // Node prop map includes edge portsource and porttarget
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
      var portsToReturn = param.nodePropMap[node.id()].ports;
      var orderingsToReturn = param.nodePropMap[node.id()].ordering;
      node.data('ports', portsToReturn);
      node.data('portsordering', orderingsToReturn); // Update the cached ports ordering
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMuanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9saWItdXRpbGl0aWVzLmpzIiwic3JjL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMuanMiLCJzcmMvdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDempEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCl7XG4gIHZhciBjaGlzZSA9IHdpbmRvdy5jaGlzZSA9IGZ1bmN0aW9uKF9vcHRpb25zLCBfbGlicykge1xuICAgIHZhciBsaWJzID0ge307XG4gICAgbGlicy5qUXVlcnkgPSBfbGlicy5qUXVlcnkgfHwgalF1ZXJ5O1xuICAgIGxpYnMuY3l0b3NjYXBlID0gX2xpYnMuY3l0b3NjYXBlIHx8IGN5dG9zY2FwZTtcbiAgICBsaWJzLnNiZ252aXogPSBfbGlicy5zYmdudml6IHx8IHNiZ252aXo7XG4gICAgbGlicy5zYXZlQXMgPSBfbGlicy5maWxlc2F2ZXJqcyA/IF9saWJzLmZpbGVzYXZlcmpzLnNhdmVBcyA6IHNhdmVBcztcbiAgICBcbiAgICBsaWJzLnNiZ252aXooX29wdGlvbnMsIF9saWJzKTsgLy8gSW5pdGlsaXplIHNiZ252aXpcbiAgICBcbiAgICAvLyBTZXQgdGhlIGxpYnJhcmllcyB0byBhY2Nlc3MgdGhlbSBmcm9tIGFueSBmaWxlXG4gICAgdmFyIGxpYlV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKTtcbiAgICBsaWJVdGlsaXRpZXMuc2V0TGlicyhsaWJzKTtcbiAgICBcbiAgICB2YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcycpO1xuICAgIHZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMoX29wdGlvbnMpOyAvLyBFeHRlbmRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9uc1xuICAgIFxuICAgIC8vIFVwZGF0ZSBzdHlsZSBhbmQgYmluZCBldmVudHNcbiAgICB2YXIgY3lTdHlsZUFuZEV2ZW50cyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2N5LXN0eWxlLWFuZC1ldmVudHMnKTtcbiAgICBjeVN0eWxlQW5kRXZlbnRzKGxpYnMuc2JnbnZpeik7XG4gICAgXG4gICAgLy8gUmVnaXN0ZXIgdW5kby9yZWRvIGFjdGlvbnNcbiAgICB2YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9yZWdpc3Rlci11bmRvLXJlZG8tYWN0aW9ucycpO1xuICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKG9wdGlvbnMudW5kb2FibGVEcmFnKTtcbiAgICBcbiAgICB2YXIgbWFpblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzJyk7XG4gICAgdmFyIGVsZW1lbnRVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcycpO1xuICAgIHZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3VuZG8tcmVkby1hY3Rpb24tZnVuY3Rpb25zJyk7XG4gICAgXG4gICAgLy8gRXhwb3NlIHRoZSBhcGlcbiAgICBcbiAgICAvLyBFeHBvc2UgdGhlIHByb3BlcnRpZXMgaW5oZXJpdGVkIGZyb20gc2JnbnZpelxuICAgIC8vIHRoZW4gb3ZlcnJpZGUgc29tZSBvZiB0aGVzZSBwcm9wZXJ0aWVzIGFuZCBleHBvc2Ugc29tZSBuZXcgcHJvcGVydGllc1xuICAgIGZvciAodmFyIHByb3AgaW4gbGlicy5zYmdudml6KSB7XG4gICAgICBjaGlzZVtwcm9wXSA9IGxpYnMuc2JnbnZpeltwcm9wXTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXhwb3NlIGVhY2ggbWFpbiB1dGlsaXR5IHNlcGVyYXRlbHlcbiAgICBmb3IgKHZhciBwcm9wIGluIG1haW5VdGlsaXRpZXMpIHtcbiAgICAgIGNoaXNlW3Byb3BdID0gbWFpblV0aWxpdGllc1twcm9wXTtcbiAgICB9XG4gICAgXG4gICAgLy8gRXhwb3NlIGVsZW1lbnRVdGlsaXRpZXMgYW5kIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zIGFzIGlzXG4gICAgY2hpc2UuZWxlbWVudFV0aWxpdGllcyA9IGVsZW1lbnRVdGlsaXRpZXM7XG4gICAgY2hpc2UudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcbiAgfTtcbiAgXG4gIGlmICggdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBjaGlzZTtcbiAgfVxufSkoKTsiLCJ2YXIgZWxlbWVudFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vZWxlbWVudC11dGlsaXRpZXMnKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyICQgPSBsaWJzLmpRdWVyeTtcbnZhciBvcHRpb25zID0gcmVxdWlyZSgnLi9vcHRpb24tdXRpbGl0aWVzJykuZ2V0T3B0aW9ucygpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzYmdudml6KSB7XG4gIC8vSGVscGVyc1xuICB2YXIgaW5pdEVsZW1lbnREYXRhID0gZnVuY3Rpb24gKGVsZSkge1xuICAgIHZhciBlbGVjbGFzcyA9IGVsZS5kYXRhKCdjbGFzcycpO1xuICAgIGlmICghZWxlY2xhc3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZWxlY2xhc3MgPSBlbGVtZW50VXRpbGl0aWVzLmRlbXVsdGltZXJpemVDbGFzcyhlbGVjbGFzcyk7XG4gICAgdmFyIGNsYXNzUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVmYXVsdFByb3BlcnRpZXNbZWxlY2xhc3NdO1xuXG4gICAgY3kuYmF0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGVsZS5pc05vZGUoKSkge1xuICAgICAgICBpZiAoY2xhc3NQcm9wZXJ0aWVzWyd3aWR0aCddICYmICFlbGUuZGF0YSgnYmJveCcpLncpIHtcbiAgICAgICAgICBlbGUuZGF0YSgnYmJveCcpLncgPSBjbGFzc1Byb3BlcnRpZXNbJ3dpZHRoJ107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsYXNzUHJvcGVydGllc1snaGVpZ2h0J10gJiYgIWVsZS5kYXRhKCdiYm94JykuaCkge1xuICAgICAgICAgIGVsZS5kYXRhKCdiYm94JykuaCA9IGNsYXNzUHJvcGVydGllc1snaGVpZ2h0J107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC1zaXplJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydmb250LXNpemUnXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdmb250LXNpemUnLCBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtc2l6ZSddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdmb250LWZhbWlseScpICYmIGNsYXNzUHJvcGVydGllc1snZm9udC1mYW1pbHknXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdmb250LWZhbWlseScsIGNsYXNzUHJvcGVydGllc1snZm9udC1mYW1pbHknXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC1zdHlsZScpICYmIGNsYXNzUHJvcGVydGllc1snZm9udC1zdHlsZSddKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ2ZvbnQtc3R5bGUnLCBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtc3R5bGUnXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnZm9udC13ZWlnaHQnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtd2VpZ2h0J10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnZm9udC13ZWlnaHQnLCBjbGFzc1Byb3BlcnRpZXNbJ2ZvbnQtd2VpZ2h0J10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2JhY2tncm91bmQtY29sb3InKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2JhY2tncm91bmQtY29sb3InXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdiYWNrZ3JvdW5kLWNvbG9yJywgY2xhc3NQcm9wZXJ0aWVzWydiYWNrZ3JvdW5kLWNvbG9yJ10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ2JhY2tncm91bmQtb3BhY2l0eScpICYmIGNsYXNzUHJvcGVydGllc1snYmFja2dyb3VuZC1vcGFjaXR5J10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnYmFja2dyb3VuZC1vcGFjaXR5JywgY2xhc3NQcm9wZXJ0aWVzWydiYWNrZ3JvdW5kLW9wYWNpdHknXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlbGUuZGF0YSgnYm9yZGVyLWNvbG9yJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydib3JkZXItY29sb3InXSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdib3JkZXItY29sb3InLCBjbGFzc1Byb3BlcnRpZXNbJ2JvcmRlci1jb2xvciddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdib3JkZXItd2lkdGgnKSAmJiBjbGFzc1Byb3BlcnRpZXNbJ2JvcmRlci13aWR0aCddKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ2JvcmRlci13aWR0aCcsIGNsYXNzUHJvcGVydGllc1snYm9yZGVyLXdpZHRoJ10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ3RleHQtd3JhcCcpICYmIGNsYXNzUHJvcGVydGllc1sndGV4dC13cmFwJ10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgndGV4dC13cmFwJywgY2xhc3NQcm9wZXJ0aWVzWyd0ZXh0LXdyYXAnXSk7XG4gICAgICAgIH1cblxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoZWxlLmlzRWRnZSgpKSB7XG4gICAgICAgIGlmICghZWxlLmRhdGEoJ3dpZHRoJykgJiYgY2xhc3NQcm9wZXJ0aWVzWyd3aWR0aCddKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ3dpZHRoJywgY2xhc3NQcm9wZXJ0aWVzWyd3aWR0aCddKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVsZS5kYXRhKCdsaW5lLWNvbG9yJykgJiYgY2xhc3NQcm9wZXJ0aWVzWydsaW5lLWNvbG9yJ10pIHtcbiAgICAgICAgICBlbGUuZGF0YSgnbGluZS1jb2xvcicsIGNsYXNzUHJvcGVydGllc1snbGluZS1jb2xvciddKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBcbiAgLy8gVXBkYXRlIGN5IHN0eWxlc2hlZXRcbiAgdmFyIHVwZGF0ZVN0eWxlU2hlZXQgPSBmdW5jdGlvbigpIHtcbiAgICBjeS5zdHlsZSgpXG4gICAgLnNlbGVjdG9yKFwibm9kZVtjbGFzc11bZm9udC1zaXplXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnZm9udC1zaXplJzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICAvLyBJZiBub2RlIGxhYmVscyBhcmUgZXhwZWN0ZWQgdG8gYmUgYWRqdXN0ZWQgYXV0b21hdGljYWxseSBvciBlbGVtZW50IGNhbm5vdCBoYXZlIGxhYmVsXG4gICAgICAgIC8vIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldExhYmVsVGV4dFNpemUoKSBlbHNlIHJldHVybiBlbGUuZGF0YSgnZm9udC1zaXplJylcbiAgICAgICAgdmFyIG9wdCA9IG9wdGlvbnMuYWRqdXN0Tm9kZUxhYmVsRm9udFNpemVBdXRvbWF0aWNhbGx5O1xuICAgICAgICB2YXIgYWRqdXN0ID0gdHlwZW9mIG9wdCA9PT0gJ2Z1bmN0aW9uJyA/IG9wdCgpIDogb3B0O1xuICAgICAgICBcbiAgICAgICAgaWYgKCFhZGp1c3QpIHtcbiAgICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2ZvbnQtc2l6ZScpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRMYWJlbFRleHRTaXplKGVsZSk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250LWZhbWlseV1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2ZvbnQtZmFtaWx5JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2ZvbnQtZmFtaWx5Jyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250LXN0eWxlXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnZm9udC1zdHlsZSc6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdmb250LXN0eWxlJyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtmb250LXdlaWdodF1cIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2ZvbnQtd2VpZ2h0JzogZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2ZvbnQtd2VpZ2h0Jyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtiYWNrZ3JvdW5kLWNvbG9yXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnYmFja2dyb3VuZC1jb2xvcic6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdiYWNrZ3JvdW5kLWNvbG9yJyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtiYWNrZ3JvdW5kLW9wYWNpdHldXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnYmFja2dyb3VuZC1vcGFjaXR5Jyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtib3JkZXItd2lkdGhdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdib3JkZXItd2lkdGgnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnYm9yZGVyLXdpZHRoJyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVtib3JkZXItY29sb3JdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICdib3JkZXItY29sb3InOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnYm9yZGVyLWNvbG9yJyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJub2RlW2NsYXNzXVt0ZXh0LXdyYXBdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICd0ZXh0LXdyYXAnOiBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgndGV4dC13cmFwJyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJlZGdlW2NsYXNzXVtsaW5lLWNvbG9yXVwiKVxuICAgIC5zdHlsZSh7XG4gICAgICAnbGluZS1jb2xvcic6IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdsaW5lLWNvbG9yJyk7XG4gICAgICB9LFxuICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6IGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ2xpbmUtY29sb3InKTtcbiAgICAgIH0sXG4gICAgICAndGFyZ2V0LWFycm93LWNvbG9yJzogZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgnbGluZS1jb2xvcicpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLnNlbGVjdG9yKFwiZWRnZVtjbGFzc11bd2lkdGhdXCIpXG4gICAgLnN0eWxlKHtcbiAgICAgICd3aWR0aCc6IGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ3dpZHRoJyk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuc2VsZWN0b3IoXCJlZGdlLmN5LWV4cGFuZC1jb2xsYXBzZS1tZXRhLWVkZ2VcIilcbiAgICAuY3NzKHtcbiAgICAgICdsaW5lLWNvbG9yJzogJyNDNEM0QzQnLFxuICAgICAgJ3NvdXJjZS1hcnJvdy1jb2xvcic6ICcjQzRDNEM0JyxcbiAgICAgICd0YXJnZXQtYXJyb3ctY29sb3InOiAnI0M0QzRDNCdcbiAgICB9KVxuICAgIC5zZWxlY3RvcihcIm5vZGU6c2VsZWN0ZWRcIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2JvcmRlci1jb2xvcic6ICcjZDY3NjE0JyxcbiAgICAgICd0ZXh0LW91dGxpbmUtY29sb3InOiAnIzAwMCdcbiAgICB9KVxuICAgIC5zZWxlY3RvcihcImVkZ2U6c2VsZWN0ZWRcIilcbiAgICAuc3R5bGUoe1xuICAgICAgJ2xpbmUtY29sb3InOiAnI2Q2NzYxNCcsXG4gICAgICAnc291cmNlLWFycm93LWNvbG9yJzogJyNkNjc2MTQnLFxuICAgICAgJ3RhcmdldC1hcnJvdy1jb2xvcic6ICcjZDY3NjE0J1xuICAgIH0pLnVwZGF0ZSgpO1xuICB9O1xuICBcbiAgLy8gQmluZCBldmVudHNcbiAgdmFyIGJpbmRDeUV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIGN5Lm9uKFwiYWRkXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIGVsZSA9IGV2ZW50LmN5VGFyZ2V0IHx8IGV2ZW50LnRhcmdldDtcbiAgICAgIGluaXRFbGVtZW50RGF0YShlbGUpO1xuICAgIH0pO1xuICB9O1xuICAvLyBIZWxwZXJzIEVuZFxuICBcbiAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGV4ZWN1dGVkIGFmdGVyIGRvY3VtZW50LnJlYWR5IGluIHNiZ252aXogYmVjYXVzZSBpdCBpcyByZWdpc3RlcmVkIGxhdGVyXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAvLyBPbmNlIGN5IGlzIHJlYWR5IGJpbmQgZXZlbnRzIGFuZCB1cGRhdGUgc3R5bGUgc2hlZXRcbiAgICBjeS5yZWFkeSggZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGJpbmRDeUV2ZW50cygpO1xuICAgICAgdXBkYXRlU3R5bGVTaGVldCgpO1xuICAgIH0pO1xuICB9KTtcbn07IiwiLy8gRXh0ZW5kcyBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXNcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIHNiZ252aXogPSBsaWJzLnNiZ252aXo7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xudmFyIGVsZW1lbnRVdGlsaXRpZXMgPSBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXM7XG52YXIgb3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpLmdldE9wdGlvbnMoKTtcblxuZWxlbWVudFV0aWxpdGllcy5QRCA9IHt9OyAvLyBuYW1lc3BhY2UgZm9yIGFsbCBQRCBzcGVjaWZpYyBzdHVmZlxuXG5lbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzID0ge1xuICBcInByb2Nlc3NcIjoge1xuICAgIHdpZHRoOiAxNSxcbiAgICBoZWlnaHQ6IDE1LFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiB7XG4gICAgd2lkdGg6IDE1LFxuICAgIGhlaWdodDogMTUsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwidW5jZXJ0YWluIHByb2Nlc3NcIjoge1xuICAgIHdpZHRoOiAxNSxcbiAgICBoZWlnaHQ6IDE1LFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcImFzc29jaWF0aW9uXCI6IHtcbiAgICB3aWR0aDogMTUsXG4gICAgaGVpZ2h0OiAxNSxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NSdcbiAgfSxcbiAgXCJkaXNzb2NpYXRpb25cIjoge1xuICAgIHdpZHRoOiAxNSxcbiAgICBoZWlnaHQ6IDE1LFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcIm1hY3JvbW9sZWN1bGVcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge1xuICAgIHdpZHRoOiA3MCxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwic2ltcGxlIGNoZW1pY2FsXCI6IHtcbiAgICB3aWR0aDogMzUsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcInNvdXJjZSBhbmQgc2lua1wiOiB7XG4gICAgd2lkdGg6IDI1LFxuICAgIGhlaWdodDogMjUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJ0YWdcIjoge1xuICAgIHdpZHRoOiAzNSxcbiAgICBoZWlnaHQ6IDM1LFxuICAgICdmb250LXNpemUnOiAxMSxcbiAgICAnZm9udC1mYW1pbHknOiAnSGVsdmV0aWNhJyxcbiAgICAnZm9udC1zdHlsZSc6ICdub3JtYWwnLFxuICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnLFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1JyxcbiAgICAndGV4dC13cmFwJzogJ3dyYXAnXG4gIH0sXG4gIFwicGhlbm90eXBlXCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiB7XG4gICAgd2lkdGg6IDcwLFxuICAgIGhlaWdodDogMzUsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6IHtcbiAgICB3aWR0aDogNzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAxLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcImNvbXBsZXhcIjoge1xuICAgIHdpZHRoOiAxMDAsXG4gICAgaGVpZ2h0OiAxMDAsXG4gICAgJ2ZvbnQtc2l6ZSc6IDExLFxuICAgICdmb250LWZhbWlseSc6ICdIZWx2ZXRpY2EnLFxuICAgICdmb250LXN0eWxlJzogJ25vcm1hbCcsXG4gICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCcsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnLFxuICAgICd0ZXh0LXdyYXAnOiAnd3JhcCdcbiAgfSxcbiAgXCJjb21wYXJ0bWVudFwiOiB7XG4gICAgd2lkdGg6IDEwMCxcbiAgICBoZWlnaHQ6IDEwMCxcbiAgICAnZm9udC1zaXplJzogMTEsXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ0hlbHZldGljYScsXG4gICAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJyxcbiAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAnYmFja2dyb3VuZC1vcGFjaXR5JzogMC41LFxuICAgICdib3JkZXItd2lkdGgnOiAzLjI1LFxuICAgICdib3JkZXItY29sb3InOiAnIzU1NScsXG4gICAgJ3RleHQtd3JhcCc6ICd3cmFwJ1xuICB9LFxuICBcImFuZFwiOiB7XG4gICAgd2lkdGg6IDI1LFxuICAgIGhlaWdodDogMjUsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwib3JcIjoge1xuICAgIHdpZHRoOiAyNSxcbiAgICBoZWlnaHQ6IDI1LFxuICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNmZmZmZmYnLFxuICAgICdiYWNrZ3JvdW5kLW9wYWNpdHknOiAwLjUsXG4gICAgJ2JvcmRlci13aWR0aCc6IDEuMjUsXG4gICAgJ2JvcmRlci1jb2xvcic6ICcjNTU1J1xuICB9LFxuICBcIm5vdFwiOiB7XG4gICAgd2lkdGg6IDI1LFxuICAgIGhlaWdodDogMjUsXG4gICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZmZmZmZicsXG4gICAgJ2JhY2tncm91bmQtb3BhY2l0eSc6IDAuNSxcbiAgICAnYm9yZGVyLXdpZHRoJzogMS4yNSxcbiAgICAnYm9yZGVyLWNvbG9yJzogJyM1NTUnXG4gIH0sXG4gIFwiY29uc3VtcHRpb25cIjoge1xuICAgICdsaW5lLWNvbG9yJzogJyM1NTUnLFxuICAgICd3aWR0aCc6IDEuMjVcbiAgfSxcbiAgXCJwcm9kdWN0aW9uXCI6IHtcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAnd2lkdGgnOiAxLjI1XG4gIH0sXG4gIFwibW9kdWxhdGlvblwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcInN0aW11bGF0aW9uXCI6IHtcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAnd2lkdGgnOiAxLjI1XG4gIH0sXG4gIFwiY2F0YWx5c2lzXCI6IHtcbiAgICAnbGluZS1jb2xvcic6ICcjNTU1JyxcbiAgICAnd2lkdGgnOiAxLjI1XG4gIH0sXG4gIFwiaW5oaWJpdGlvblwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcIm5lY2Vzc2FyeSBzdGltdWxhdGlvblwiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcImxvZ2ljIGFyY1wiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9LFxuICBcImVxdWl2YWxlbmNlIGFyY1wiOiB7XG4gICAgJ2xpbmUtY29sb3InOiAnIzU1NScsXG4gICAgJ3dpZHRoJzogMS4yNVxuICB9XG59O1xuXG5cbi8qXG4gIHNlZSBodHRwOi8vam91cm5hbC5pbWJpby5kZS9hcnRpY2xlcy9wZGYvamliLTI2My5wZGYgcC40MSA8LS0gYnV0IGJld2FyZSwgb3V0ZGF0ZWRcbiAgZm9sbG93aW5nIHRhYmxlcyBoYXZlIGJlZW4gdXBkYXRlZCB3aXRoIFBEIGx2bDEgdjIuMCBvZiBOb3ZlbWJlciA3LCAyMDE2IHdvcmtpbmcgZHJhZnRcbiAgb25seSB0aGUgZm9sbG93aW5nIHRoaW5ncyBoYXZlIGJlZW4gY2hhbmdlZCBmcm9tIDIuMCAodGhpcyB2ZXJzaW9uIGlzIG5vdCBjbGVhciBvbiBjb25uZWN0aXZpdHkpOlxuICAgLSBlbXB0eSBzZXQgaGFzIG5vIGxpbWl0IG9uIGl0cyBlZGdlIGNvdW50XG4gICAtIGxvZ2ljIG9wZXJhdG9ycyBjYW4gYmUgc291cmNlIGFuZCB0YXJnZXRcbiAgIC0gbGltaXQgb2YgMSBjYXRhbHlzaXMgYW5kIDEgbmVjZXNzYXJ5IHN0aW11bGF0aW9uIG9uIGEgcHJvY2Vzc1xuXG4gIGZvciBlYWNoIGVkZ2UgY2xhc3MgYW5kIG5vZGVjbGFzcyBkZWZpbmUgMiBjYXNlczpcbiAgIC0gbm9kZSBjYW4gYmUgYSBzb3VyY2Ugb2YgdGhpcyBlZGdlIC0+IGFzU291cmNlXG4gICAtIG5vZGUgY2FuIGJlIGEgdGFyZ2V0IG9mIHRoaXMgZWRnZSAtPiBhc1RhcmdldFxuICBmb3IgYm90aCBjYXNlcywgdGVsbHMgaWYgaXQgaXMgYWxsb3dlZCBhbmQgd2hhdCBpcyB0aGUgbGltaXQgb2YgZWRnZXMgYWxsb3dlZC5cbiAgTGltaXRzIGNhbiBjb25jZXJuIG9ubHkgdGhpcyB0eXBlIG9mIGVkZ2UgKG1heEVkZ2UpIG9yIHRoZSB0b3RhbCBudW1iZXIgb2YgZWRnZXMgZm9yIHRoaXMgbm9kZSAobWF4VG90YWwpLlxuICAtMSBlZGdlIG1lYW5zIG5vIGxpbWl0XG5cbiAgdGhlIG5vZGVzL2VkZ2VzIGNsYXNzIGxpc3RlZCBiZWxvdyBhcmUgdGhvc2UgdXNlZCBpbiB0aGUgcHJvZ3JhbS5cbiAgRm9yIGluc3RhbmNlIFwiY29tcGFydG1lbnRcIiBpc24ndCBhIG5vZGUgaW4gU0JHTiBzcGVjcy5cbiovXG5lbGVtZW50VXRpbGl0aWVzLlBELmNvbm5lY3Rpdml0eUNvbnN0cmFpbnRzID0ge1xuICBcImNvbnN1bXB0aW9uXCI6IHtcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwic2ltcGxlIGNoZW1pY2FsXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX1cbiAgfSxcbiAgXCJwcm9kdWN0aW9uXCI6IHtcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInNvdXJjZSBhbmQgc2lua1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcImRpc3NvY2lhdGlvblwiOiAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19XG4gIH0sXG4gIFwibW9kdWxhdGlvblwiOiB7XG4gICAgXCJtYWNyb21vbGVjdWxlXCI6ICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJjb21wbGV4XCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInNvdXJjZSBhbmQgc2lua1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInByb2Nlc3NcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwidW5jZXJ0YWluIHByb2Nlc3NcIjogICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcImRpc3NvY2lhdGlvblwiOiAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19XG4gIH0sXG4gIFwic3RpbXVsYXRpb25cIjoge1xuICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjogICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwib3JcIjogICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJub3RcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fVxuICB9LFxuICBcImNhdGFseXNpc1wiOiB7XG4gICAgXCJtYWNyb21vbGVjdWxlXCI6ICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJjb21wbGV4XCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInNvdXJjZSBhbmQgc2lua1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInByb2Nlc3NcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInVuY2VydGFpbiBwcm9jZXNzXCI6ICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcImFzc29jaWF0aW9uXCI6ICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX1cbiAgfSxcbiAgXCJpbmhpYml0aW9uXCI6IHtcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwic2ltcGxlIGNoZW1pY2FsXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJ1bnNwZWNpZmllZCBlbnRpdHlcIjogICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIjoge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJjb21wYXJ0bWVudFwiOiAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInRhZ1wiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwicHJvY2Vzc1wiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwicGhlbm90eXBlXCI6ICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcImFzc29jaWF0aW9uXCI6ICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX1cbiAgfSxcbiAgXCJuZWNlc3Nhcnkgc3RpbXVsYXRpb25cIjoge1xuICAgIFwibWFjcm9tb2xlY3VsZVwiOiAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInVuc3BlY2lmaWVkIGVudGl0eVwiOiAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwiY29tcGxleFwiOiAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcImNvbXBhcnRtZW50XCI6ICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwidGFnXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJzb3VyY2UgYW5kIHNpbmtcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInBlcnR1cmJpbmcgYWdlbnRcIjogICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwic3VibWFwXCI6ICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJvbWl0dGVkIHByb2Nlc3NcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJhc3NvY2lhdGlvblwiOiAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcImRpc3NvY2lhdGlvblwiOiAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwiYW5kXCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcIm5vdFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICB9LFxuICBcImxvZ2ljIGFyY1wiOiB7XG4gICAgXCJtYWNyb21vbGVjdWxlXCI6ICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInNpbXBsZSBjaGVtaWNhbFwiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJjb21wbGV4XCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCI6IHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInNvdXJjZSBhbmQgc2lua1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwicGVydHVyYmluZyBhZ2VudFwiOiAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJzdWJtYXBcIjogICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInByb2Nlc3NcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwib21pdHRlZCBwcm9jZXNzXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJ1bmNlcnRhaW4gcHJvY2Vzc1wiOiAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInBoZW5vdHlwZVwiOiAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwiYXNzb2NpYXRpb25cIjogICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJkaXNzb2NpYXRpb25cIjogICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcImFuZFwiOiAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogMSwgbWF4VG90YWw6IDF9LCAgICAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJvclwiOiAgICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfSwgICAgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAxLCBtYXhUb3RhbDogMX0sICAgICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IDEsIG1heFRvdGFsOiAxfX0sXG4gIH0sXG4gIFwiZXF1aXZhbGVuY2UgYXJjXCI6IHtcbiAgICBcIm1hY3JvbW9sZWN1bGVcIjogICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJzaW1wbGUgY2hlbWljYWxcIjogICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwidW5zcGVjaWZpZWQgZW50aXR5XCI6ICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcImNvbXBsZXhcIjogICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiOiB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IHRydWUsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwiY29tcGFydG1lbnRcIjogICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJ0YWdcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogdHJ1ZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwic291cmNlIGFuZCBzaW5rXCI6ICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJwZXJ0dXJiaW5nIGFnZW50XCI6ICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcInN1Ym1hcFwiOiAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiB0cnVlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJwcm9jZXNzXCI6ICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcIm9taXR0ZWQgcHJvY2Vzc1wiOiAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwidW5jZXJ0YWluIHByb2Nlc3NcIjogICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJwaGVub3R5cGVcIjogICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcImFzc29jaWF0aW9uXCI6ICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwiZGlzc29jaWF0aW9uXCI6ICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX0sXG4gICAgXCJhbmRcIjogICAgICAgICAgICAgICAgICB7YXNTb3VyY2U6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfSwgICBhc1RhcmdldDoge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9fSxcbiAgICBcIm9yXCI6ICAgICAgICAgICAgICAgICAgIHthc1NvdXJjZToge2lzQWxsb3dlZDogZmFsc2UsIG1heEVkZ2U6IC0xLCBtYXhUb3RhbDogLTF9LCAgIGFzVGFyZ2V0OiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX19LFxuICAgIFwibm90XCI6ICAgICAgICAgICAgICAgICAge2FzU291cmNlOiB7aXNBbGxvd2VkOiBmYWxzZSwgbWF4RWRnZTogLTEsIG1heFRvdGFsOiAtMX0sICAgYXNUYXJnZXQ6IHtpc0FsbG93ZWQ6IGZhbHNlLCBtYXhFZGdlOiAtMSwgbWF4VG90YWw6IC0xfX1cbiAgfVxufTtcblxuXG4vLyBTZWN0aW9uIFN0YXJ0XG4vLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xuXG4vLyBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvODgwOTQ3MlxuLy8gd2UgbmVlZCB0byB0YWtlIGNhcmUgb2Ygb3VyIG93biBJRHMgYmVjYXVzZSB0aGUgb25lcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBjeXRvc2NhcGUgKGFsc28gVVVJRClcbi8vIGRvbid0IGNvbXBseSB3aXRoIHhzZDpTSUQgdHlwZSB0aGF0IG11c3Qgbm90IGJlZ2luIHdpdGggYSBudW1iZXJcbmZ1bmN0aW9uIGdlbmVyYXRlVVVJRCAoKSB7IC8vIFB1YmxpYyBEb21haW4vTUlUXG4gICAgdmFyIGQgPSBEYXRlLm5vdygpO1xuICAgIGlmICh0eXBlb2YgcGVyZm9ybWFuY2UgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwZXJmb3JtYW5jZS5ub3cgPT09ICdmdW5jdGlvbicpe1xuICAgICAgICBkICs9IHBlcmZvcm1hbmNlLm5vdygpOyAvL3VzZSBoaWdoLXByZWNpc2lvbiB0aW1lciBpZiBhdmFpbGFibGVcbiAgICB9XG4gICAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgdmFyIHIgPSAoZCArIE1hdGgucmFuZG9tKCkgKiAxNikgJSAxNiB8IDA7XG4gICAgICAgIGQgPSBNYXRoLmZsb29yKGQgLyAxNik7XG4gICAgICAgIHJldHVybiAoYyA9PT0gJ3gnID8gciA6IChyICYgMHgzIHwgMHg4KSkudG9TdHJpbmcoMTYpO1xuICAgIH0pO1xufVxuXG5lbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUgPSBmdW5jdGlvbiAoeCwgeSwgc2JnbmNsYXNzLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KSB7XG4gIHZhciBkZWZhdWx0UHJvcGVydGllcyA9IHRoaXMuZGVmYXVsdFByb3BlcnRpZXM7XG4gIHZhciBkZWZhdWx0cyA9IGRlZmF1bHRQcm9wZXJ0aWVzW3NiZ25jbGFzc107XG5cbiAgdmFyIHdpZHRoID0gZGVmYXVsdHMgPyBkZWZhdWx0cy53aWR0aCA6IDUwO1xuICB2YXIgaGVpZ2h0ID0gZGVmYXVsdHMgPyBkZWZhdWx0cy5oZWlnaHQgOiA1MDtcbiAgXG4gIHZhciBjc3MgPSB7fTtcbiAgXG4gIGlmICh2aXNpYmlsaXR5KSB7XG4gICAgY3NzLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xuICB9XG5cbiAgaWYgKGRlZmF1bHRzICYmIGRlZmF1bHRzLm11bHRpbWVyKSB7XG4gICAgc2JnbmNsYXNzICs9IFwiIG11bHRpbWVyXCI7XG4gIH1cbiAgdmFyIGRhdGEgPSB7XG4gICAgY2xhc3M6IHNiZ25jbGFzcyxcbiAgICBiYm94OiB7XG4gICAgICBoOiBoZWlnaHQsXG4gICAgICB3OiB3aWR0aCxcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfSxcbiAgICBzdGF0ZXNhbmRpbmZvczogW10sXG4gICAgcG9ydHM6IFtdLFxuICAgIGNsb25lbWFya2VyOiBkZWZhdWx0cyAmJiBkZWZhdWx0cy5jbG9uZW1hcmtlciA/IGRlZmF1bHRzLmNsb25lbWFya2VyIDogdW5kZWZpbmVkXG4gIH07XG5cbiAgaWYoaWQpIHtcbiAgICBkYXRhLmlkID0gaWQ7XG4gIH1cbiAgZWxzZSB7XG4gICAgZGF0YS5pZCA9IFwibnd0Tl9cIiArIGdlbmVyYXRlVVVJRCgpO1xuICB9XG4gIFxuICBpZiAocGFyZW50KSB7XG4gICAgZGF0YS5wYXJlbnQgPSBwYXJlbnQ7XG4gIH1cblxuICB2YXIgZWxlcyA9IGN5LmFkZCh7XG4gICAgZ3JvdXA6IFwibm9kZXNcIixcbiAgICBkYXRhOiBkYXRhLFxuICAgIGNzczogY3NzLFxuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH1cbiAgfSk7XG5cbiAgdmFyIG5ld05vZGUgPSBlbGVzW2VsZXMubGVuZ3RoIC0gMV07XG4gIHZhciBvcmRlcmluZyA9IHRoaXMuZGVmYXVsdFByb3BlcnRpZXNbc2JnbmNsYXNzXVsncG9ydHMtb3JkZXJpbmcnXTsgLy8gR2V0IHRoZSBkZWZhdWx0IHBvcnRzIG9yZGVyaW5nIGZvciB0aGUgbm9kZXMgd2l0aCBnaXZlbiBzYmduY2xhc3NcbiAgXG4gIC8vIElmIHRoZXJlIGlzIGEgZGVmYXVsdCBwb3J0cyBvcmRlcmluZyBmb3IgdGhlIG5vZGVzIHdpdGggZ2l2ZW4gc2JnbmNsYXNzIGFuZCBpdCBpcyBkaWZmZXJlbnQgdGhhbiAnbm9uZScgc2V0IHRoZSBwb3J0cyBvcmRlcmluZyB0byB0aGF0IG9yZGVyaW5nXG4gIGlmIChvcmRlcmluZyAmJiBvcmRlcmluZyAhPT0gJ25vbmUnKSB7XG4gICAgdGhpcy5zZXRQb3J0c09yZGVyaW5nKG5ld05vZGUsIG9yZGVyaW5nKTtcbiAgfVxuXG4gIHJldHVybiBuZXdOb2RlO1xufTtcblxuZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlID0gZnVuY3Rpb24gKHNvdXJjZSwgdGFyZ2V0LCBzYmduY2xhc3MsIGlkLCB2aXNpYmlsaXR5KSB7XG4gIHZhciBkZWZhdWx0UHJvcGVydGllcyA9IHRoaXMuZGVmYXVsdFByb3BlcnRpZXM7XG4gIHZhciBkZWZhdWx0cyA9IGRlZmF1bHRQcm9wZXJ0aWVzW3NiZ25jbGFzc107XG4gIFxuICB2YXIgY3NzID0ge307XG5cbiAgaWYgKHZpc2liaWxpdHkpIHtcbiAgICBjc3MudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XG4gIH1cblxuICB2YXIgZGF0YSA9IHtcbiAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICBjbGFzczogc2JnbmNsYXNzXG4gIH07XG4gIFxuICBpZihpZCkge1xuICAgIGRhdGEuaWQgPSBpZDtcbiAgfVxuICBlbHNlIHtcbiAgICBkYXRhLmlkID0gXCJud3RFX1wiICsgZ2VuZXJhdGVVVUlEKCk7XG4gIH1cbiAgXG4gIHZhciBzb3VyY2VOb2RlID0gY3kuZ2V0RWxlbWVudEJ5SWQoc291cmNlKTsgLy8gVGhlIG9yaWdpbmFsIHNvdXJjZSBub2RlXG4gIHZhciB0YXJnZXROb2RlID0gY3kuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0KTsgLy8gVGhlIG9yaWdpbmFsIHRhcmdldCBub2RlXG4gIHZhciBzb3VyY2VIYXNQb3J0cyA9IHNvdXJjZU5vZGUuZGF0YSgncG9ydHMnKS5sZW5ndGggPT09IDI7XG4gIHZhciB0YXJnZXRIYXNQb3J0cyA9IHRhcmdldE5vZGUuZGF0YSgncG9ydHMnKS5sZW5ndGggPT09IDI7XG4gIC8vIFRoZSBwb3J0c291cmNlIGFuZCBwb3J0dGFyZ2V0IHZhcmlhYmxlc1xuICB2YXIgcG9ydHNvdXJjZTtcbiAgdmFyIHBvcnR0YXJnZXQ7XG4gIFxuICAvKlxuICAgKiBHZXQgaW5wdXQvb3V0cHV0IHBvcnQgaWQncyBvZiBhIG5vZGUgd2l0aCB0aGUgYXNzdW1wdGlvbiB0aGF0IHRoZSBub2RlIGhhcyB2YWxpZCBwb3J0cy5cbiAgICovXG4gIHZhciBnZXRJT1BvcnRJZHMgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIHZhciBub2RlSW5wdXRQb3J0SWQsIG5vZGVPdXRwdXRQb3J0SWQ7XG4gICAgdmFyIG5vZGVQb3J0c09yZGVyaW5nID0gc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzLmdldFBvcnRzT3JkZXJpbmcobm9kZSk7XG4gICAgdmFyIG5vZGVQb3J0cyA9IG5vZGUuZGF0YSgncG9ydHMnKTtcbiAgICBpZiAoIG5vZGVQb3J0c09yZGVyaW5nID09PSAnTC10by1SJyB8fCBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ1ItdG8tTCcgKSB7XG4gICAgICB2YXIgbGVmdFBvcnRJZCA9IG5vZGVQb3J0c1swXS54IDwgMCA/IG5vZGVQb3J0c1swXS5pZCA6IG5vZGVQb3J0c1sxXS5pZDsgLy8gVGhlIHggdmFsdWUgb2YgbGVmdCBwb3J0IGlzIHN1cHBvc2VkIHRvIGJlIG5lZ2F0aXZlXG4gICAgICB2YXIgcmlnaHRQb3J0SWQgPSBub2RlUG9ydHNbMF0ueCA+IDAgPyBub2RlUG9ydHNbMF0uaWQgOiBub2RlUG9ydHNbMV0uaWQ7IC8vIFRoZSB4IHZhbHVlIG9mIHJpZ2h0IHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgcG9zaXRpdmVcbiAgICAgIC8qXG4gICAgICAgKiBJZiB0aGUgcG9ydCBvcmRlcmluZyBpcyBsZWZ0IHRvIHJpZ2h0IHRoZW4gdGhlIGlucHV0IHBvcnQgaXMgdGhlIGxlZnQgcG9ydCBhbmQgdGhlIG91dHB1dCBwb3J0IGlzIHRoZSByaWdodCBwb3J0LlxuICAgICAgICogRWxzZSBpZiBpdCBpcyByaWdodCB0byBsZWZ0IGl0IGlzIHZpY2UgdmVyc2FcbiAgICAgICAqL1xuICAgICAgbm9kZUlucHV0UG9ydElkID0gbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdMLXRvLVInID8gbGVmdFBvcnRJZCA6IHJpZ2h0UG9ydElkO1xuICAgICAgbm9kZU91dHB1dFBvcnRJZCA9IG5vZGVQb3J0c09yZGVyaW5nID09PSAnUi10by1MJyA/IGxlZnRQb3J0SWQgOiByaWdodFBvcnRJZDtcbiAgICB9XG4gICAgZWxzZSBpZiAoIG5vZGVQb3J0c09yZGVyaW5nID09PSAnVC10by1CJyB8fCBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ0ItdG8tVCcgKXtcbiAgICAgIHZhciB0b3BQb3J0SWQgPSBub2RlUG9ydHNbMF0ueSA8IDAgPyBub2RlUG9ydHNbMF0uaWQgOiBub2RlUG9ydHNbMV0uaWQ7IC8vIFRoZSB5IHZhbHVlIG9mIHRvcCBwb3J0IGlzIHN1cHBvc2VkIHRvIGJlIG5lZ2F0aXZlXG4gICAgICB2YXIgYm90dG9tUG9ydElkID0gbm9kZVBvcnRzWzBdLnkgPiAwID8gbm9kZVBvcnRzWzBdLmlkIDogbm9kZVBvcnRzWzFdLmlkOyAvLyBUaGUgeSB2YWx1ZSBvZiBib3R0b20gcG9ydCBpcyBzdXBwb3NlZCB0byBiZSBwb3NpdGl2ZVxuICAgICAgLypcbiAgICAgICAqIElmIHRoZSBwb3J0IG9yZGVyaW5nIGlzIHRvcCB0byBib3R0b20gdGhlbiB0aGUgaW5wdXQgcG9ydCBpcyB0aGUgdG9wIHBvcnQgYW5kIHRoZSBvdXRwdXQgcG9ydCBpcyB0aGUgYm90dG9tIHBvcnQuXG4gICAgICAgKiBFbHNlIGlmIGl0IGlzIHJpZ2h0IHRvIGxlZnQgaXQgaXMgdmljZSB2ZXJzYVxuICAgICAgICovXG4gICAgICBub2RlSW5wdXRQb3J0SWQgPSBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ1QtdG8tQicgPyB0b3BQb3J0SWQgOiBib3R0b21Qb3J0SWQ7XG4gICAgICBub2RlT3V0cHV0UG9ydElkID0gbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdCLXRvLVQnID8gdG9wUG9ydElkIDogYm90dG9tUG9ydElkO1xuICAgIH1cbiAgICBcbiAgICAvLyBSZXR1cm4gYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIElPIHBvcnRzIG9mIHRoZSBub2RlXG4gICAgcmV0dXJuIHtcbiAgICAgIGlucHV0UG9ydElkOiBub2RlSW5wdXRQb3J0SWQsXG4gICAgICBvdXRwdXRQb3J0SWQ6IG5vZGVPdXRwdXRQb3J0SWRcbiAgICB9O1xuICB9O1xuICBcbiAgLy8gSWYgYXQgbGVhc3Qgb25lIGVuZCBvZiB0aGUgZWRnZSBoYXMgcG9ydHMgdGhlbiB3ZSBzaG91bGQgZGV0ZXJtaW5lIHRoZSBwb3J0cyB3aGVyZSB0aGUgZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkLlxuICBpZiAoc291cmNlSGFzUG9ydHMgfHwgdGFyZ2V0SGFzUG9ydHMpIHtcbiAgICB2YXIgc291cmNlTm9kZUlucHV0UG9ydElkLCBzb3VyY2VOb2RlT3V0cHV0UG9ydElkLCB0YXJnZXROb2RlSW5wdXRQb3J0SWQsIHRhcmdldE5vZGVPdXRwdXRQb3J0SWQ7XG4gICAgXG4gICAgLy8gSWYgc291cmNlIG5vZGUgaGFzIHBvcnRzIHNldCB0aGUgdmFyaWFibGVzIGRlZGljYXRlZCBmb3IgaXRzIElPIHBvcnRzXG4gICAgaWYgKCBzb3VyY2VIYXNQb3J0cyApIHtcbiAgICAgIHZhciBpb1BvcnRzID0gZ2V0SU9Qb3J0SWRzKHNvdXJjZU5vZGUpO1xuICAgICAgc291cmNlTm9kZUlucHV0UG9ydElkID0gaW9Qb3J0cy5pbnB1dFBvcnRJZDtcbiAgICAgIHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQgPSBpb1BvcnRzLm91dHB1dFBvcnRJZDtcbiAgICB9XG4gICAgXG4gICAgLy8gSWYgdGFyZ2V0IG5vZGUgaGFzIHBvcnRzIHNldCB0aGUgdmFyaWFibGVzIGRlZGljYXRlZCBmb3IgaXRzIElPIHBvcnRzXG4gICAgaWYgKCB0YXJnZXRIYXNQb3J0cyApIHtcbiAgICAgIHZhciBpb1BvcnRzID0gZ2V0SU9Qb3J0SWRzKHRhcmdldE5vZGUpO1xuICAgICAgdGFyZ2V0Tm9kZUlucHV0UG9ydElkID0gaW9Qb3J0cy5pbnB1dFBvcnRJZDtcbiAgICAgIHRhcmdldE5vZGVPdXRwdXRQb3J0SWQgPSBpb1BvcnRzLm91dHB1dFBvcnRJZDtcbiAgICB9XG5cbiAgICBpZiAoc2JnbmNsYXNzID09PSAnY29uc3VtcHRpb24nKSB7XG4gICAgICAvLyBBIGNvbnN1bXB0aW9uIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgaW5wdXQgcG9ydCBvZiB0aGUgdGFyZ2V0IG5vZGUgd2hpY2ggaXMgc3VwcG9zZWQgdG8gYmUgYSBwcm9jZXNzIChhbnkga2luZCBvZilcbiAgICAgIHBvcnR0YXJnZXQgPSB0YXJnZXROb2RlSW5wdXRQb3J0SWQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PT0gJ3Byb2R1Y3Rpb24nIHx8IHRoaXMuaXNNb2R1bGF0aW9uQXJjQ2xhc3Moc2JnbmNsYXNzKSkge1xuICAgICAgLy8gQSBwcm9kdWN0aW9uIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgb3V0cHV0IHBvcnQgb2YgdGhlIHNvdXJjZSBub2RlIHdoaWNoIGlzIHN1cHBvc2VkIHRvIGJlIGEgcHJvY2VzcyAoYW55IGtpbmQgb2YpXG4gICAgICAvLyBBIG1vZHVsYXRpb24gZWRnZSBtYXkgaGF2ZSBhIGxvZ2ljYWwgb3BlcmF0b3IgYXMgc291cmNlIG5vZGUgaW4gdGhpcyBjYXNlIHRoZSBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQgdG8gdGhlIG91dHB1dCBwb3J0IG9mIGl0XG4gICAgICAvLyBUaGUgYmVsb3cgYXNzaWdubWVudCBzYXRpc2Z5IGFsbCBvZiB0aGVzZSBjb25kaXRpb25cbiAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlT3V0cHV0UG9ydElkO1xuICAgIH1cbiAgICBlbHNlIGlmIChzYmduY2xhc3MgPT09ICdsb2dpYyBhcmMnKSB7XG4gICAgICB2YXIgc3JjQ2xhc3MgPSBzb3VyY2VOb2RlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICB2YXIgdGd0Q2xhc3MgPSB0YXJnZXROb2RlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICB2YXIgaXNTb3VyY2VMb2dpY2FsT3AgPSBzcmNDbGFzcyA9PT0gJ2FuZCcgfHwgc3JjQ2xhc3MgPT09ICdvcicgfHwgc3JjQ2xhc3MgPT09ICdub3QnO1xuICAgICAgdmFyIGlzVGFyZ2V0TG9naWNhbE9wID0gdGd0Q2xhc3MgPT09ICdhbmQnIHx8IHRndENsYXNzID09PSAnb3InIHx8IHRndENsYXNzID09PSAnbm90JztcbiAgICAgIFxuICAgICAgaWYgKGlzU291cmNlTG9naWNhbE9wICYmIGlzVGFyZ2V0TG9naWNhbE9wKSB7XG4gICAgICAgIC8vIElmIGJvdGggZW5kIGFyZSBsb2dpY2FsIG9wZXJhdG9ycyB0aGVuIHRoZSBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQgdG8gdGhlIGlucHV0IHBvcnQgb2YgdGhlIHRhcmdldCBhbmQgdGhlIG91dHB1dCBwb3J0IG9mIHRoZSBpbnB1dFxuICAgICAgICBwb3J0dGFyZ2V0ID0gdGFyZ2V0Tm9kZUlucHV0UG9ydElkO1xuICAgICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZU91dHB1dFBvcnRJZDtcbiAgICAgIH0vLyBJZiBqdXN0IG9uZSBlbmQgb2YgbG9naWNhbCBvcGVyYXRvciB0aGVuIHRoZSBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQgdG8gdGhlIGlucHV0IHBvcnQgb2YgdGhlIGxvZ2ljYWwgb3BlcmF0b3JcbiAgICAgIGVsc2UgaWYgKGlzU291cmNlTG9naWNhbE9wKSB7XG4gICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlSW5wdXRQb3J0SWQ7IFxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNUYXJnZXRMb2dpY2FsT3ApIHtcbiAgICAgICAgcG9ydHRhcmdldCA9IHRhcmdldE5vZGVJbnB1dFBvcnRJZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIC8vIFRoZSBkZWZhdWx0IHBvcnRzb3VyY2UvcG9ydHRhcmdldCBhcmUgdGhlIHNvdXJjZS90YXJnZXQgdGhlbXNlbHZlcy4gSWYgdGhleSBhcmUgbm90IHNldCB1c2UgdGhlc2UgZGVmYXVsdHMuXG4gIC8vIFRoZSBwb3J0c291cmNlIGFuZCBwb3J0dGFyZ2V0IGFyZSBkZXRlcm1pbmVkIHNldCB0aGVtIGluIGRhdGEgb2JqZWN0LiBcbiAgZGF0YS5wb3J0c291cmNlID0gcG9ydHNvdXJjZSB8fCBzb3VyY2U7XG4gIGRhdGEucG9ydHRhcmdldCA9IHBvcnR0YXJnZXQgfHwgdGFyZ2V0O1xuXG4gIHZhciBlbGVzID0gY3kuYWRkKHtcbiAgICBncm91cDogXCJlZGdlc1wiLFxuICAgIGRhdGE6IGRhdGEsXG4gICAgY3NzOiBjc3NcbiAgfSk7XG5cbiAgdmFyIG5ld0VkZ2UgPSBlbGVzW2VsZXMubGVuZ3RoIC0gMV07XG4gIFxuICByZXR1cm4gbmV3RWRnZTtcbn07XG5cbmVsZW1lbnRVdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMgPSBmdW5jdGlvbihfc291cmNlLCBfdGFyZ2V0LCBwcm9jZXNzVHlwZSkge1xuICAvLyBJZiBzb3VyY2UgYW5kIHRhcmdldCBJRHMgYXJlIGdpdmVuIGdldCB0aGUgZWxlbWVudHMgYnkgSURzXG4gIHZhciBzb3VyY2UgPSB0eXBlb2YgX3NvdXJjZSA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfc291cmNlKSA6IF9zb3VyY2U7XG4gIHZhciB0YXJnZXQgPSB0eXBlb2YgX3RhcmdldCA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfdGFyZ2V0KSA6IF90YXJnZXQ7XG4gIFxuICAvLyBQcm9jZXNzIHBhcmVudCBzaG91bGQgYmUgdGhlIGNsb3Nlc3QgY29tbW9uIGFuY2VzdG9yIG9mIHRoZSBzb3VyY2UgYW5kIHRhcmdldCBub2Rlc1xuICB2YXIgcHJvY2Vzc1BhcmVudCA9IGN5LmNvbGxlY3Rpb24oW3NvdXJjZVswXSwgdGFyZ2V0WzBdXSkuY29tbW9uQW5jZXN0b3JzKCkuZmlyc3QoKTtcbiAgXG4gIC8vIFByb2Nlc3Mgc2hvdWxkIGJlIGF0IHRoZSBtaWRkbGUgb2YgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0IG5vZGVzXG4gIHZhciB4ID0gKCBzb3VyY2UucG9zaXRpb24oJ3gnKSArIHRhcmdldC5wb3NpdGlvbigneCcpICkgLyAyO1xuICB2YXIgeSA9ICggc291cmNlLnBvc2l0aW9uKCd5JykgKyB0YXJnZXQucG9zaXRpb24oJ3knKSApIC8gMjtcbiAgXG4gIC8vIENyZWF0ZSB0aGUgcHJvY2VzcyB3aXRoIGdpdmVuL2NhbGN1bGF0ZWQgdmFyaWFibGVzXG4gIHZhciBwcm9jZXNzID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHgsIHksIHByb2Nlc3NUeXBlLCB1bmRlZmluZWQsIHByb2Nlc3NQYXJlbnQuaWQoKSk7XG4gIFxuICAvLyBDcmVhdGUgdGhlIGVkZ2VzIG9uZSBpcyBiZXR3ZWVuIHRoZSBwcm9jZXNzIGFuZCB0aGUgc291cmNlIG5vZGUgKHdoaWNoIHNob3VsZCBiZSBhIGNvbnN1bXB0aW9uKSwgXG4gIC8vIHRoZSBvdGhlciBvbmUgaXMgYmV0d2VlbiB0aGUgcHJvY2VzcyBhbmQgdGhlIHRhcmdldCBub2RlICh3aGljaCBzaG91bGQgYmUgYSBwcm9kdWN0aW9uKS5cbiAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gcGxlYXNlIHJlZmVyIHRvIFNCR04tUEQgcmVmZXJlbmNlIGNhcmQuXG4gIHZhciBlZGdlQnR3U3JjID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHNvdXJjZS5pZCgpLCBwcm9jZXNzLmlkKCksICdjb25zdW1wdGlvbicpO1xuICB2YXIgZWRnZUJ0d1RndCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIHRhcmdldC5pZCgpLCAncHJvZHVjdGlvbicpO1xuICBcbiAgLy8gQ3JlYXRlIGEgY29sbGVjdGlvbiBpbmNsdWRpbmcgdGhlIGVsZW1lbnRzIGFuZCB0byBiZSByZXR1cm5lZFxuICB2YXIgY29sbGVjdGlvbiA9IGN5LmNvbGxlY3Rpb24oW3Byb2Nlc3NbMF0sIGVkZ2VCdHdTcmNbMF0sIGVkZ2VCdHdUZ3RbMF1dKTtcbiAgcmV0dXJuIGNvbGxlY3Rpb247XG59O1xuXG4vKlxuICogUmV0dXJucyBpZiB0aGUgZWxlbWVudHMgd2l0aCB0aGUgZ2l2ZW4gcGFyZW50IGNsYXNzIGNhbiBiZSBwYXJlbnQgb2YgdGhlIGVsZW1lbnRzIHdpdGggdGhlIGdpdmVuIG5vZGUgY2xhc3NcbiAqL1xuZWxlbWVudFV0aWxpdGllcy5pc1ZhbGlkUGFyZW50ID0gZnVuY3Rpb24oX25vZGVDbGFzcywgX3BhcmVudENsYXNzKSB7XG4gIC8vIElmIG5vZGVDbGFzcyBhbmQgcGFyZW50Q2xhc3MgcGFyYW1zIGFyZSBlbGVtZW50cyBpdHNlbHZlcyBpbnN0ZWFkIG9mIHRoZWlyIGNsYXNzIG5hbWVzIGhhbmRsZSBpdFxuICB2YXIgbm9kZUNsYXNzID0gdHlwZW9mIF9ub2RlQ2xhc3MgIT09ICdzdHJpbmcnID8gX25vZGVDbGFzcy5kYXRhKCdjbGFzcycpIDogX25vZGVDbGFzcztcbiAgdmFyIHBhcmVudENsYXNzID0gX3BhcmVudENsYXNzICE9IHVuZGVmaW5lZCAmJiB0eXBlb2YgX3BhcmVudENsYXNzICE9PSAnc3RyaW5nJyA/IF9wYXJlbnRDbGFzcy5kYXRhKCdjbGFzcycpIDogX3BhcmVudENsYXNzO1xuICBcbiAgaWYgKHBhcmVudENsYXNzID09IHVuZGVmaW5lZCB8fCBwYXJlbnRDbGFzcyA9PT0gJ2NvbXBhcnRtZW50JykgeyAvLyBDb21wYXJ0bWVudHMgYW5kIHRoZSByb290IGNhbiBpbmNsdWRlIGFueSB0eXBlIG9mIG5vZGVzXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZWxzZSBpZiAocGFyZW50Q2xhc3MgPT09ICdjb21wbGV4JykgeyAvLyBDb21wbGV4ZXMgY2FuIG9ubHkgaW5jbHVkZSBFUE5zXG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyhub2RlQ2xhc3MpO1xuICB9XG4gIFxuICByZXR1cm4gZmFsc2U7IC8vIEN1cnJlbnRseSBqdXN0ICdjb21wYXJ0bWVudCcgYW5kICdjb21wbGV4JyBjb21wb3VuZHMgYXJlIHN1cHBvcnRlZCByZXR1cm4gZmFsc2UgZm9yIGFueSBvdGhlciBwYXJlbnRDbGFzc1xufTtcblxuLypcbiAqIFRoaXMgbWV0aG9kIGFzc3VtZXMgdGhhdCBwYXJhbS5ub2Rlc1RvTWFrZUNvbXBvdW5kIGNvbnRhaW5zIGF0IGxlYXN0IG9uZSBub2RlXG4gKiBhbmQgYWxsIG9mIHRoZSBub2RlcyBpbmNsdWRpbmcgaW4gaXQgaGF2ZSB0aGUgc2FtZSBwYXJlbnQuIEl0IGNyZWF0ZXMgYSBjb21wb3VuZCBmb3QgdGhlIGdpdmVuIG5vZGVzIGFuIGhhdmluZyB0aGUgZ2l2ZW4gdHlwZS5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgPSBmdW5jdGlvbiAobm9kZXNUb01ha2VDb21wb3VuZCwgY29tcG91bmRUeXBlKSB7XG4gIHZhciBvbGRQYXJlbnRJZCA9IG5vZGVzVG9NYWtlQ29tcG91bmRbMF0uZGF0YShcInBhcmVudFwiKTtcbiAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZC4geCwgeSBhbmQgaWQgcGFyYW1ldGVycyBhcmUgbm90IHNldC5cbiAgdmFyIG5ld0NvbXBvdW5kID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjb21wb3VuZFR5cGUsIHVuZGVmaW5lZCwgb2xkUGFyZW50SWQpO1xuICB2YXIgbmV3Q29tcG91bmRJZCA9IG5ld0NvbXBvdW5kLmlkKCk7XG4gIHZhciBuZXdFbGVzID0gbm9kZXNUb01ha2VDb21wb3VuZC5tb3ZlKHtwYXJlbnQ6IG5ld0NvbXBvdW5kSWR9KTtcbiAgbmV3RWxlcyA9IG5ld0VsZXMudW5pb24obmV3Q29tcG91bmQpO1xuICByZXR1cm4gbmV3RWxlcztcbn07XG5cbi8qXG4gKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcbiAqIGluIHRoZSBjb21wbGV4LiBQYXJhbWV0ZXJzIGFyZSBleHBsYWluZWQgYmVsb3cuXG4gKiB0ZW1wbGF0ZVR5cGU6IFRoZSB0eXBlIG9mIHRoZSB0ZW1wbGF0ZSByZWFjdGlvbi4gSXQgbWF5IGJlICdhc3NvY2lhdGlvbicgb3IgJ2Rpc3NvY2lhdGlvbicgZm9yIG5vdy5cbiAqIG1hY3JvbW9sZWN1bGVMaXN0OiBUaGUgbGlzdCBvZiB0aGUgbmFtZXMgb2YgbWFjcm9tb2xlY3VsZXMgd2hpY2ggd2lsbCBpbnZvbHZlIGluIHRoZSByZWFjdGlvbi5cbiAqIGNvbXBsZXhOYW1lOiBUaGUgbmFtZSBvZiB0aGUgY29tcGxleCBpbiB0aGUgcmVhY3Rpb24uXG4gKiBwcm9jZXNzUG9zaXRpb246IFRoZSBtb2RhbCBwb3NpdGlvbiBvZiB0aGUgcHJvY2VzcyBpbiB0aGUgcmVhY3Rpb24uIFRoZSBkZWZhdWx0IHZhbHVlIGlzIHRoZSBjZW50ZXIgb2YgdGhlIGNhbnZhcy5cbiAqIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cbiAqIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiBUaGlzIG9wdGlvbiB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY29zZS1iaWxrZW50IGxheW91dCB3aXRoIHRoZSBzYW1lIG5hbWUuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDE1LlxuICogZWRnZUxlbmd0aDogVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSBtYWNyb21vbGVjdWxlcyBhdCB0aGUgYm90aCBzaWRlcy5cbiAqL1xuZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHRlbXBsYXRlVHlwZSwgbWFjcm9tb2xlY3VsZUxpc3QsIGNvbXBsZXhOYW1lLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgpIHtcbiAgdmFyIGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1tcIm1hY3JvbW9sZWN1bGVcIl07XG4gIHZhciB0ZW1wbGF0ZVR5cGUgPSB0ZW1wbGF0ZVR5cGU7XG4gIHZhciBwcm9jZXNzV2lkdGggPSBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW3RlbXBsYXRlVHlwZV0gPyBlbGVtZW50VXRpbGl0aWVzLmRlZmF1bHRQcm9wZXJ0aWVzW3RlbXBsYXRlVHlwZV0ud2lkdGggOiA1MDtcbiAgdmFyIG1hY3JvbW9sZWN1bGVXaWR0aCA9IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID8gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMud2lkdGggOiA1MDtcbiAgdmFyIG1hY3JvbW9sZWN1bGVIZWlnaHQgPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA/IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLmhlaWdodCA6IDUwO1xuICB2YXIgcHJvY2Vzc1Bvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uID8gcHJvY2Vzc1Bvc2l0aW9uIDogZWxlbWVudFV0aWxpdGllcy5jb252ZXJ0VG9Nb2RlbFBvc2l0aW9uKHt4OiBjeS53aWR0aCgpIC8gMiwgeTogY3kuaGVpZ2h0KCkgLyAyfSk7XG4gIHZhciBtYWNyb21vbGVjdWxlTGlzdCA9IG1hY3JvbW9sZWN1bGVMaXN0O1xuICB2YXIgY29tcGxleE5hbWUgPSBjb21wbGV4TmFtZTtcbiAgdmFyIG51bU9mTWFjcm9tb2xlY3VsZXMgPSBtYWNyb21vbGVjdWxlTGlzdC5sZW5ndGg7XG4gIHZhciB0aWxpbmdQYWRkaW5nVmVydGljYWwgPSB0aWxpbmdQYWRkaW5nVmVydGljYWwgPyB0aWxpbmdQYWRkaW5nVmVydGljYWwgOiAxNTtcbiAgdmFyIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID0gdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPyB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA6IDE1O1xuICB2YXIgZWRnZUxlbmd0aCA9IGVkZ2VMZW5ndGggPyBlZGdlTGVuZ3RoIDogNjA7XG5cbiAgY3kuc3RhcnRCYXRjaCgpO1xuXG4gIHZhciB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcztcbiAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgIHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG4gIH1cbiAgZWxzZSB7XG4gICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgfVxuXG4gIC8vQ3JlYXRlIHRoZSBwcm9jZXNzIGluIHRlbXBsYXRlIHR5cGVcbiAgdmFyIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCB0ZW1wbGF0ZVR5cGUpO1xuICBwcm9jZXNzLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gIC8vRGVmaW5lIHRoZSBzdGFydGluZyB5IHBvc2l0aW9uXG4gIHZhciB5UG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZNYWNyb21vbGVjdWxlcyAtIDEpIC8gMikgKiAobWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XG5cbiAgLy9DcmVhdGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXNcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1PZk1hY3JvbW9sZWN1bGVzOyBpKyspIHtcbiAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcywgeVBvc2l0aW9uLCBcIm1hY3JvbW9sZWN1bGVcIik7XG4gICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgbWFjcm9tb2xlY3VsZUxpc3RbaV0pO1xuXG4gICAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubmVjdGVkIHRvIHRoZSBuZXcgbWFjcm9tb2xlY3VsZVxuICAgIHZhciBuZXdFZGdlO1xuICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3Tm9kZS5pZCgpLCBwcm9jZXNzLmlkKCksICdjb25zdW1wdGlvbicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBuZXdOb2RlLmlkKCksICdwcm9kdWN0aW9uJyk7XG4gICAgfVxuXG4gICAgbmV3RWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgIC8vdXBkYXRlIHRoZSB5IHBvc2l0aW9uXG4gICAgeVBvc2l0aW9uICs9IG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XG4gIH1cblxuICAvL0NyZWF0ZSB0aGUgY29tcGxleCBpbmNsdWRpbmcgbWFjcm9tb2xlY3VsZXMgaW5zaWRlIG9mIGl0XG4gIC8vVGVtcHJvcmFyaWx5IGFkZCBpdCB0byB0aGUgcHJvY2VzcyBwb3NpdGlvbiB3ZSB3aWxsIG1vdmUgaXQgYWNjb3JkaW5nIHRvIHRoZSBsYXN0IHNpemUgb2YgaXRcbiAgdmFyIGNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCAnY29tcGxleCcpO1xuICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcblxuICAvL0lmIGEgbmFtZSBpcyBzcGVjaWZpZWQgZm9yIHRoZSBjb21wbGV4IHNldCBpdHMgbGFiZWwgYWNjb3JkaW5nbHlcbiAgaWYgKGNvbXBsZXhOYW1lKSB7XG4gICAgY29tcGxleC5kYXRhKCdsYWJlbCcsIGNvbXBsZXhOYW1lKTtcbiAgfVxuXG4gIC8vY3JlYXRlIHRoZSBlZGdlIGNvbm5uZWN0ZWQgdG8gdGhlIGNvbXBsZXhcbiAgdmFyIGVkZ2VPZkNvbXBsZXg7XG4gIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICBlZGdlT2ZDb21wbGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgY29tcGxleC5pZCgpLCAncHJvZHVjdGlvbicpO1xuICB9XG4gIGVsc2Uge1xuICAgIGVkZ2VPZkNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UoY29tcGxleC5pZCgpLCBwcm9jZXNzLmlkKCksICdjb25zdW1wdGlvbicpO1xuICB9XG4gIGVkZ2VPZkNvbXBsZXguZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgLy9DcmVhdGUgdGhlIG1hY3JvbW9sZWN1bGVzIGluc2lkZSB0aGUgY29tcGxleFxuICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mTWFjcm9tb2xlY3VsZXM7IGkrKykge1xuICAgIC8vIEFkZCBhIG1hY3JvbW9sZWN1bGUgbm90IGhhdmluZyBhIHByZXZpb3VzbHkgZGVmaW5lZCBpZCBhbmQgaGF2aW5nIHRoZSBjb21wbGV4IGNyZWF0ZWQgaW4gdGhpcyByZWFjdGlvbiBhcyBwYXJlbnRcbiAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShjb21wbGV4LnBvc2l0aW9uKCd4JyksIGNvbXBsZXgucG9zaXRpb24oJ3knKSwgXCJtYWNyb21vbGVjdWxlXCIsIHVuZGVmaW5lZCwgY29tcGxleC5pZCgpKTtcbiAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgIG5ld05vZGUuZGF0YSgnbGFiZWwnLCBtYWNyb21vbGVjdWxlTGlzdFtpXSk7XG4gICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJywgdHJ1ZSk7XG4gIH1cbiAgXG4gIGN5LmVuZEJhdGNoKCk7XG5cbiAgdmFyIGxheW91dE5vZGVzID0gY3kubm9kZXMoJ1tqdXN0QWRkZWRMYXlvdXROb2RlXScpO1xuICBsYXlvdXROb2Rlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJyk7XG4gIHZhciBsYXlvdXQgPSBsYXlvdXROb2Rlcy5sYXlvdXQoe1xuICAgIG5hbWU6ICdjb3NlLWJpbGtlbnQnLFxuICAgIHJhbmRvbWl6ZTogZmFsc2UsXG4gICAgZml0OiBmYWxzZSxcbiAgICBhbmltYXRlOiBmYWxzZSxcbiAgICB0aWxpbmdQYWRkaW5nVmVydGljYWw6IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCxcbiAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXG4gICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgLy9yZS1wb3NpdGlvbiB0aGUgbm9kZXMgaW5zaWRlIHRoZSBjb21wbGV4XG4gICAgICB2YXIgc3VwcG9zZWRYUG9zaXRpb247XG4gICAgICB2YXIgc3VwcG9zZWRZUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueTtcblxuICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgICAgICBzdXBwb3NlZFhQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBjb21wbGV4Lm91dGVyV2lkdGgoKSAvIDI7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc3VwcG9zZWRYUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gY29tcGxleC5vdXRlcldpZHRoKCkgLyAyO1xuICAgICAgfVxuXG4gICAgICB2YXIgcG9zaXRpb25EaWZmWCA9IHN1cHBvc2VkWFBvc2l0aW9uIC0gY29tcGxleC5wb3NpdGlvbigneCcpO1xuICAgICAgdmFyIHBvc2l0aW9uRGlmZlkgPSBzdXBwb3NlZFlQb3NpdGlvbiAtIGNvbXBsZXgucG9zaXRpb24oJ3knKTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NpdGlvbkRpZmZYLCB5OiBwb3NpdGlvbkRpZmZZfSwgY29tcGxleCk7XG4gICAgfVxuICB9KTtcbiAgXG4gIC8vIERvIHRoaXMgY2hlY2sgZm9yIGN5dG9zY2FwZS5qcyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xuICAgIGxheW91dC5ydW4oKTtcbiAgfVxuXG4gIC8vZmlsdGVyIHRoZSBqdXN0IGFkZGVkIGVsZW1lbXRzIHRvIHJldHVybiB0aGVtIGFuZCByZW1vdmUganVzdCBhZGRlZCBtYXJrXG4gIHZhciBlbGVzID0gY3kuZWxlbWVudHMoJ1tqdXN0QWRkZWRdJyk7XG4gIGVsZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkJyk7XG4gIFxuICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gIGVsZXMuc2VsZWN0KCk7XG4gIFxuICByZXR1cm4gZWxlczsgLy8gUmV0dXJuIHRoZSBqdXN0IGFkZGVkIGVsZW1lbnRzXG59O1xuXG4vKlxuICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50ID0gZnVuY3Rpb24obm9kZXMsIG5ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XG4gIHZhciBuZXdQYXJlbnRJZCA9IG5ld1BhcmVudCA9PSB1bmRlZmluZWQgfHwgdHlwZW9mIG5ld1BhcmVudCA9PT0gJ3N0cmluZycgPyBuZXdQYXJlbnQgOiBuZXdQYXJlbnQuaWQoKTtcbiAgY29uc29sZS5sb2coXCJiZWZvcmVcIiwgbm9kZXMuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKSk7XG4gIG5vZGVzLm1vdmUoe1wicGFyZW50XCI6IG5ld1BhcmVudElkfSk7XG4gIGNvbnNvbGUubG9nKFwiYWZ0ZXJcIiwgbm9kZXMuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKSk7XG4gIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NEaWZmWCwgeTogcG9zRGlmZll9LCBub2Rlcyk7XG59O1xuXG4vLyBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuXG5lbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgcmF0aW8gPSB1bmRlZmluZWQ7XG4gICAgdmFyIGVsZU11c3RCZVNxdWFyZSA9IGVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlKG5vZGUuZGF0YSgnY2xhc3MnKSk7XG5cbiAgICAvLyBOb3RlIHRoYXQgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0IGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeVxuICAgIGlmICh3aWR0aCkge1xuICAgICAgaWYgKHVzZUFzcGVjdFJhdGlvIHx8IGVsZU11c3RCZVNxdWFyZSkge1xuICAgICAgICByYXRpbyA9IHdpZHRoIC8gbm9kZS53aWR0aCgpO1xuICAgICAgfVxuXG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSB3aWR0aDtcbiAgICB9XG5cbiAgICBpZiAoaGVpZ2h0KSB7XG4gICAgICBpZiAodXNlQXNwZWN0UmF0aW8gfHwgZWxlTXVzdEJlU3F1YXJlKSB7XG4gICAgICAgIHJhdGlvID0gaGVpZ2h0IC8gbm9kZS5oZWlnaHQoKTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gaGVpZ2h0O1xuICAgIH1cblxuICAgIGlmIChyYXRpbyAmJiAhaGVpZ2h0KSB7XG4gICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBub2RlLmhlaWdodCgpICogcmF0aW87XG4gICAgfVxuICAgIGVsc2UgaWYgKHJhdGlvICYmICF3aWR0aCkge1xuICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gbm9kZS53aWR0aCgpICogcmF0aW87XG4gICAgfVxuICB9XG59O1xuXG4vLyBTZWN0aW9uIEVuZFxuLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gQ29tbW9uIGVsZW1lbnQgcHJvcGVydGllc1xuXG4vLyBHZXQgY29tbW9uIHByb3BlcnRpZXMgb2YgZ2l2ZW4gZWxlbWVudHMuIFJldHVybnMgbnVsbCBpZiB0aGUgZ2l2ZW4gZWxlbWVudCBsaXN0IGlzIGVtcHR5IG9yIHRoZVxuLy8gcHJvcGVydHkgaXMgbm90IGNvbW1vbiBmb3IgYWxsIGVsZW1lbnRzLiBkYXRhT3JDc3MgcGFyYW1ldGVyIHNwZWNpZnkgd2hldGhlciB0byBjaGVjayB0aGUgcHJvcGVydHkgb24gZGF0YSBvciBjc3MuXG4vLyBUaGUgZGVmYXVsdCB2YWx1ZSBmb3IgaXQgaXMgZGF0YS4gSWYgcHJvcGVydHlOYW1lIHBhcmFtZXRlciBpcyBnaXZlbiBhcyBhIGZ1bmN0aW9uIGluc3RlYWQgb2YgYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBcbi8vIHByb3BlcnR5IG5hbWUgdGhlbiB1c2Ugd2hhdCB0aGF0IGZ1bmN0aW9uIHJldHVybnMuXG5lbGVtZW50VXRpbGl0aWVzLmdldENvbW1vblByb3BlcnR5ID0gZnVuY3Rpb24gKGVsZW1lbnRzLCBwcm9wZXJ0eU5hbWUsIGRhdGFPckNzcykge1xuICBpZiAoZWxlbWVudHMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBpc0Z1bmN0aW9uO1xuICAvLyBJZiB3ZSBhcmUgbm90IGNvbXBhcmluZyB0aGUgcHJvcGVydGllcyBkaXJlY3RseSB1c2VycyBjYW4gc3BlY2lmeSBhIGZ1bmN0aW9uIGFzIHdlbGxcbiAgaWYgKHR5cGVvZiBwcm9wZXJ0eU5hbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBpc0Z1bmN0aW9uID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIFVzZSBkYXRhIGFzIGRlZmF1bHRcbiAgaWYgKCFpc0Z1bmN0aW9uICYmICFkYXRhT3JDc3MpIHtcbiAgICBkYXRhT3JDc3MgPSAnZGF0YSc7XG4gIH1cblxuICB2YXIgdmFsdWUgPSBpc0Z1bmN0aW9uID8gcHJvcGVydHlOYW1lKGVsZW1lbnRzWzBdKSA6IGVsZW1lbnRzWzBdW2RhdGFPckNzc10ocHJvcGVydHlOYW1lKTtcblxuICBmb3IgKHZhciBpID0gMTsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCAoIGlzRnVuY3Rpb24gPyBwcm9wZXJ0eU5hbWUoZWxlbWVudHNbaV0pIDogZWxlbWVudHNbaV1bZGF0YU9yQ3NzXShwcm9wZXJ0eU5hbWUpICkgIT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbi8vIFJldHVybnMgaWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgYSB0cnV0aHkgdmFsdWUgZm9yIGFsbCBvZiB0aGUgZ2l2ZW4gZWxlbWVudHMuXG5lbGVtZW50VXRpbGl0aWVzLnRydWVGb3JBbGxFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVtZW50cywgZmNuKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIWZjbihlbGVtZW50c1tpXSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZSBlbGVtZW50IGNhbiBoYXZlIHNiZ25jYXJkaW5hbGl0eVxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkNhcmRpbmFsaXR5ID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKTtcblxuICByZXR1cm4gZWxlLmRhdGEoJ2NsYXNzJykgPT0gJ2NvbnN1bXB0aW9uJyB8fCBlbGUuZGF0YSgnY2xhc3MnKSA9PSAncHJvZHVjdGlvbic7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmUgZWxlbWVudCBjYW4gaGF2ZSBzYmdubGFiZWxcbmVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05MYWJlbCA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgcmV0dXJuIHNiZ25jbGFzcyAhPSAnYW5kJyAmJiBzYmduY2xhc3MgIT0gJ29yJyAmJiBzYmduY2xhc3MgIT0gJ25vdCdcbiAgICAgICAgICAmJiBzYmduY2xhc3MgIT0gJ2Fzc29jaWF0aW9uJyAmJiBzYmduY2xhc3MgIT0gJ2Rpc3NvY2lhdGlvbicgJiYgIXNiZ25jbGFzcy5lbmRzV2l0aCgncHJvY2VzcycpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgaGF2ZSB1bml0IG9mIGluZm9ybWF0aW9uXG5lbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVVbml0T2ZJbmZvcm1hdGlvbiA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgaWYgKHNiZ25jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZScgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXgnIHx8IHNiZ25jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsIG11bHRpbWVyJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZSBtdWx0aW1lcicgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSBtdWx0aW1lcidcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXggbXVsdGltZXInKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlIGVsZW1lbnQgaGF2ZSBzdGF0ZSB2YXJpYWJsZVxuZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU3RhdGVWYXJpYWJsZSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgaWYgKHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZScgfHwgc2JnbmNsYXNzID09ICdudWNsZWljIGFjaWQgZmVhdHVyZSdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2NvbXBsZXgnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdtYWNyb21vbGVjdWxlIG11bHRpbWVyJyB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlIG11bHRpbWVyJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCBtdWx0aW1lcicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZSBzaG91bGQgYmUgc3F1YXJlIGluIHNoYXBlXG5lbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG5cbiAgcmV0dXJuIChzYmduY2xhc3MuaW5kZXhPZigncHJvY2VzcycpICE9IC0xIHx8IHNiZ25jbGFzcyA9PSAnc291cmNlIGFuZCBzaW5rJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnYW5kJyB8fCBzYmduY2xhc3MgPT0gJ29yJyB8fCBzYmduY2xhc3MgPT0gJ25vdCdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2Fzc29jaWF0aW9uJyB8fCBzYmduY2xhc3MgPT0gJ2Rpc3NvY2lhdGlvbicpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIGFueSBvZiB0aGUgZ2l2ZW4gbm9kZXMgbXVzdCBub3QgYmUgaW4gc3F1YXJlIHNoYXBlXG5lbGVtZW50VXRpbGl0aWVzLnNvbWVNdXN0Tm90QmVTcXVhcmUgPSBmdW5jdGlvbiAobm9kZXMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZShub2RlLmRhdGEoJ2NsYXNzJykpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVzIGVsZW1lbnQgY2FuIGJlIGNsb25lZFxuZWxlbWVudFV0aWxpdGllcy5jYW5CZUNsb25lZCA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuXG4gIHZhciBsaXN0ID0ge1xuICAgICd1bnNwZWNpZmllZCBlbnRpdHknOiB0cnVlLFxuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcbiAgICAnY29tcGxleCc6IHRydWUsXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZSxcbiAgICAncGVydHVyYmluZyBhZ2VudCc6IHRydWVcbiAgfTtcblxuICByZXR1cm4gbGlzdFtzYmduY2xhc3NdID8gdHJ1ZSA6IGZhbHNlO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlcyBlbGVtZW50IGNhbiBiZSBjbG9uZWRcbmVsZW1lbnRVdGlsaXRpZXMuY2FuQmVNdWx0aW1lciA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9ICh0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpKS5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuXG4gIHZhciBsaXN0ID0ge1xuICAgICdtYWNyb21vbGVjdWxlJzogdHJ1ZSxcbiAgICAnY29tcGxleCc6IHRydWUsXG4gICAgJ251Y2xlaWMgYWNpZCBmZWF0dXJlJzogdHJ1ZSxcbiAgICAnc2ltcGxlIGNoZW1pY2FsJzogdHJ1ZVxuICB9O1xuXG4gIHJldHVybiBsaXN0W3NiZ25jbGFzc10gPyB0cnVlIDogZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVsZW1lbnQgaXMgYW4gRVBOXG5lbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcblxuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAndW5zcGVjaWZpZWQgZW50aXR5J1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnc2ltcGxlIGNoZW1pY2FsJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnbWFjcm9tb2xlY3VsZSdcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ251Y2xlaWMgYWNpZCBmZWF0dXJlJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnY29tcGxleCcpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlbGVtZW50IGlzIGEgUE5cbmVsZW1lbnRVdGlsaXRpZXMuaXNQTkNsYXNzID0gZnVuY3Rpb24gKGVsZSkge1xuICB2YXIgc2JnbmNsYXNzID0gKHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJykpLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XG5cbiAgcmV0dXJuIChzYmduY2xhc3MgPT0gJ3Byb2Nlc3MnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICdvbWl0dGVkIHByb2Nlc3MnXG4gICAgICAgICAgfHwgc2JnbmNsYXNzID09ICd1bmNlcnRhaW4gcHJvY2VzcydcbiAgICAgICAgICB8fCBzYmduY2xhc3MgPT0gJ2Fzc29jaWF0aW9uJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnZGlzc29jaWF0aW9uJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAncGhlbm90eXBlJyk7XG59O1xuXG4vLyBSZXR1cm5zIHdldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBvciBzdHJpbmcgaXMgb2YgdGhlIHNwZWNpYWwgZW1wdHkgc2V0L3NvdXJjZSBhbmQgc2luayBjbGFzc1xuZWxlbWVudFV0aWxpdGllcy5pc0VtcHR5U2V0Q2xhc3MgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSAodHlwZW9mIGVsZSA9PT0gJ3N0cmluZycgPyBlbGUgOiBlbGUuZGF0YSgnY2xhc3MnKSkucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcbiAgcmV0dXJuIHNiZ25jbGFzcyA9PSAnc291cmNlIGFuZCBzaW5rJztcbn07XG5cbi8vIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhIGxvZ2ljYWwgb3BlcmF0b3JcbmVsZW1lbnRVdGlsaXRpZXMuaXNMb2dpY2FsT3BlcmF0b3IgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAnYW5kJyB8fCBzYmduY2xhc3MgPT0gJ29yJyB8fCBzYmduY2xhc3MgPT0gJ25vdCcpO1xufTtcblxuLy8gUmV0dXJucyB3aGV0aGVyIHRoZSBjbGFzcyBvZiBnaXZlbiBlbGVtZW50IGlzIGEgZXF1aXZhbGFuY2UgY2xhc3NcbmVsZW1lbnRVdGlsaXRpZXMuY29udmVuaWVudFRvRXF1aXZhbGVuY2UgPSBmdW5jdGlvbiAoZWxlKSB7XG4gIHZhciBzYmduY2xhc3MgPSB0eXBlb2YgZWxlID09PSAnc3RyaW5nJyA/IGVsZSA6IGVsZS5kYXRhKCdjbGFzcycpO1xuICByZXR1cm4gKHNiZ25jbGFzcyA9PSAndGFnJyB8fCBzYmduY2xhc3MgPT0gJ3Rlcm1pbmFsJyk7XG59O1xuXG4vLyBSZXR1cm5zIHdldGhlciB0aGUgY2xhc3Mgb2YgZ2l2ZW4gZWxlbW50IGlzIGEgbW9kdWxhdGlvbiBhcmMgYXMgZGVmaW5lZCBpbiBQRCBzcGVjc1xuZWxlbWVudFV0aWxpdGllcy5pc01vZHVsYXRpb25BcmNDbGFzcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHNiZ25jbGFzcyA9IHR5cGVvZiBlbGUgPT09ICdzdHJpbmcnID8gZWxlIDogZWxlLmRhdGEoJ2NsYXNzJyk7XG4gIHJldHVybiAoc2JnbmNsYXNzID09ICdtb2R1bGF0aW9uJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnc3RpbXVsYXRpb24nIHx8IHNiZ25jbGFzcyA9PSAnY2F0YWx5c2lzJ1xuICAgICAgICAgIHx8IHNiZ25jbGFzcyA9PSAnaW5oaWJpdGlvbicgfHwgc2JnbmNsYXNzID09ICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nKTtcbn1cblxuLy8gUmVsb2NhdGVzIHN0YXRlIGFuZCBpbmZvIGJveGVzLiBUaGlzIGZ1bmN0aW9uIGlzIGV4cGVjdGVkIHRvIGJlIGNhbGxlZCBhZnRlciBhZGQvcmVtb3ZlIHN0YXRlIGFuZCBpbmZvIGJveGVzXG5lbGVtZW50VXRpbGl0aWVzLnJlbG9jYXRlU3RhdGVBbmRJbmZvcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgdmFyIHN0YXRlQW5kSW5mb3MgPSAoZWxlLmlzTm9kZSAmJiBlbGUuaXNOb2RlKCkpID8gZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykgOiBlbGU7XG4gIHZhciBsZW5ndGggPSBzdGF0ZUFuZEluZm9zLmxlbmd0aDtcbiAgaWYgKGxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVsc2UgaWYgKGxlbmd0aCA9PSAxKSB7XG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAwO1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuICB9XG4gIGVsc2UgaWYgKGxlbmd0aCA9PSAyKSB7XG4gICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAwO1xuICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAwO1xuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC55ID0gNTA7XG4gIH1cbiAgZWxzZSBpZiAobGVuZ3RoID09IDMpIHtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IC0yNTtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcblxuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSAtNTA7XG5cbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IDA7XG4gICAgc3RhdGVBbmRJbmZvc1syXS5iYm94LnkgPSA1MDtcbiAgfVxuICBlbHNlIHtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IC0yNTtcbiAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcblxuICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XG4gICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSAtNTA7XG5cbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IC0yNTtcbiAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xuXG4gICAgc3RhdGVBbmRJbmZvc1szXS5iYm94LnggPSAyNTtcbiAgICBzdGF0ZUFuZEluZm9zWzNdLmJib3gueSA9IDUwO1xuICB9XG59O1xuXG4vLyBDaGFuZ2Ugc3RhdGUgdmFsdWUgb3IgdW5pdCBvZiBpbmZvcm1hdGlvbiBib3ggb2YgZ2l2ZW4gbm9kZXMgd2l0aCBnaXZlbiBpbmRleC5cbi8vIFR5cGUgcGFyYW1ldGVyIGluZGljYXRlcyB3aGV0aGVyIHRvIGNoYW5nZSB2YWx1ZSBvciB2YXJpYWJsZSwgaXQgaXMgdmFsaWQgaWYgdGhlIGJveCBhdCB0aGUgZ2l2ZW4gaW5kZXggaXMgYSBzdGF0ZSB2YXJpYWJsZS5cbi8vIFZhbHVlIHBhcmFtZXRlciBpcyB0aGUgbmV3IHZhbHVlIHRvIHNldC5cbi8vIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIG9sZCB2YWx1ZSBvZiB0aGUgY2hhbmdlZCBkYXRhIChXZSBhc3N1bWUgdGhhdCB0aGUgb2xkIHZhbHVlIG9mIHRoZSBjaGFuZ2VkIGRhdGEgd2FzIHRoZSBzYW1lIGZvciBhbGwgbm9kZXMpLlxuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XG4gIHZhciByZXN1bHQ7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xuICAgIHZhciBib3ggPSBzdGF0ZUFuZEluZm9zW2luZGV4XTtcblxuICAgIGlmIChib3guY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7XG4gICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICByZXN1bHQgPSBib3guc3RhdGVbdHlwZV07XG4gICAgICB9XG5cbiAgICAgIGJveC5zdGF0ZVt0eXBlXSA9IHZhbHVlO1xuICAgIH1cbiAgICBlbHNlIGlmIChib3guY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdCA9IGJveC5sYWJlbC50ZXh0O1xuICAgICAgfVxuXG4gICAgICBib3gubGFiZWwudGV4dCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXG4vLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxuLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGp1c3QgYWRkZWQgYm94LlxuZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2Rlcywgb2JqKSB7XG4gIHZhciBpbmRleDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XG4gICAgXG4gICAgLy8gQ2xvbmUgdGhlIG9iamVjdCB0byBhdm9pZCByZWZlcmVuY2luZyBpc3N1ZXNcbiAgICB2YXIgY2xvbmUgPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBvYmopO1xuICAgIFxuICAgIHN0YXRlQW5kSW5mb3MucHVzaChjbG9uZSk7XG4gICAgaW5kZXggPSBzdGF0ZUFuZEluZm9zLmxlbmd0aCAtIDE7XG4gICAgdGhpcy5yZWxvY2F0ZVN0YXRlQW5kSW5mb3Moc3RhdGVBbmRJbmZvcyk7IC8vIFJlbG9jYXRlIHN0YXRlIGFuZCBpbmZvc1xuICB9XG5cbiAgcmV0dXJuIGluZGV4O1xufTtcblxuLy8gUmVtb3ZlIHRoZSBzdGF0ZSBvciBpbmZvIGJveGVzIG9mIHRoZSBnaXZlbiBub2RlcyBhdCBnaXZlbiBpbmRleC5cbi8vIFJldHVybnMgdGhlIHJlbW92ZWQgYm94LlxuZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2RlcywgaW5kZXgpIHtcbiAgdmFyIG9iajtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgIG9iaiA9IHN0YXRlQW5kSW5mb3NbaW5kZXhdO1xuICAgIH1cbiAgICBzdGF0ZUFuZEluZm9zLnNwbGljZShpbmRleCwgMSk7IC8vIFJlbW92ZSB0aGUgYm94XG4gICAgdGhpcy5yZWxvY2F0ZVN0YXRlQW5kSW5mb3Moc3RhdGVBbmRJbmZvcyk7IC8vIFJlbG9jYXRlIHN0YXRlIGFuZCBpbmZvc1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cbi8vIFNldCBtdWx0aW1lciBzdGF0dXMgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXG5lbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24gKG5vZGVzLCBzdGF0dXMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIHNiZ25jbGFzcyA9IG5vZGUuZGF0YSgnY2xhc3MnKTtcbiAgICB2YXIgaXNNdWx0aW1lciA9IG5vZGUuZGF0YSgnY2xhc3MnKS5lbmRzV2l0aCgnIG11bHRpbWVyJyk7XG5cbiAgICBpZiAoc3RhdHVzKSB7IC8vIE1ha2UgbXVsdGltZXIgc3RhdHVzIHRydWVcbiAgICAgIGlmICghaXNNdWx0aW1lcikge1xuICAgICAgICBub2RlLmRhdGEoJ2NsYXNzJywgc2JnbmNsYXNzICsgJyBtdWx0aW1lcicpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHsgLy8gTWFrZSBtdWx0aW1lciBzdGF0dXMgZmFsc2VcbiAgICAgIGlmIChpc011bHRpbWVyKSB7XG4gICAgICAgIG5vZGUuZGF0YSgnY2xhc3MnLCBzYmduY2xhc3MucmVwbGFjZSgnIG11bHRpbWVyJywgJycpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbi8vIFNldCBjbG9uZSBtYXJrZXIgc3RhdHVzIG9mIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXG5lbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24gKG5vZGVzLCBzdGF0dXMpIHtcbiAgaWYgKHN0YXR1cykge1xuICAgIG5vZGVzLmRhdGEoJ2Nsb25lbWFya2VyJywgdHJ1ZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgbm9kZXMucmVtb3ZlRGF0YSgnY2xvbmVtYXJrZXInKTtcbiAgfVxufTtcblxuLy9lbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24oKVxuXG4vLyBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBlbGVtZW50cyB3aXRoIGdpdmVuIGZvbnQgZGF0YVxuZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uIChlbGVzLCBkYXRhKSB7XG4gIGZvciAodmFyIHByb3AgaW4gZGF0YSkge1xuICAgIGVsZXMuZGF0YShwcm9wLCBkYXRhW3Byb3BdKTtcbiAgfVxufTtcblxuLy8gVGhpcyBmdW5jdGlvbiBnZXRzIGFuIGVkZ2UsIGFuZCBlbmRzIG9mIHRoYXQgZWRnZSAoT3B0aW9uYWxseSBpdCBtYXkgdGFrZSBqdXN0IHRoZSBjbGFzc2VzIG9mIHRoZSBlZGdlIGFzIHdlbGwpIGFzIHBhcmFtZXRlcnMuXG4vLyBJdCBtYXkgcmV0dXJuICd2YWxpZCcgKHRoYXQgZW5kcyBpcyB2YWxpZCBmb3IgdGhhdCBlZGdlKSwgJ3JldmVyc2UnICh0aGF0IGVuZHMgaXMgbm90IHZhbGlkIGZvciB0aGF0IGVkZ2UgYnV0IHRoZXkgd291bGQgYmUgdmFsaWQgXG4vLyBpZiB5b3UgcmV2ZXJzZSB0aGUgc291cmNlIGFuZCB0YXJnZXQpLCAnaW52YWxpZCcgKHRoYXQgZW5kcyBhcmUgdG90YWxseSBpbnZhbGlkIGZvciB0aGF0IGVkZ2UpLlxuZWxlbWVudFV0aWxpdGllcy52YWxpZGF0ZUFycm93RW5kcyA9IGZ1bmN0aW9uIChlZGdlLCBzb3VyY2UsIHRhcmdldCkge1xuICB2YXIgZWRnZWNsYXNzID0gdHlwZW9mIGVkZ2UgPT09ICdzdHJpbmcnID8gZWRnZSA6IGVkZ2UuZGF0YSgnY2xhc3MnKTtcbiAgdmFyIHNvdXJjZWNsYXNzID0gc291cmNlLmRhdGEoJ2NsYXNzJyk7XG4gIHZhciB0YXJnZXRjbGFzcyA9IHRhcmdldC5kYXRhKCdjbGFzcycpO1xuXG4gIHZhciBlZGdlQ29uc3RyYWludHMgPSB0aGlzLlBELmNvbm5lY3Rpdml0eUNvbnN0cmFpbnRzW2VkZ2VjbGFzc107XG5cbiAgLy8gZ2l2ZW4gYSBub2RlLCBhY3RpbmcgYXMgc291cmNlIG9yIHRhcmdldCwgcmV0dXJucyBib29sZWFuIHdldGhlciBvciBub3QgaXQgaGFzIHRvbyBtYW55IGVkZ2VzIGFscmVhZHlcbiAgZnVuY3Rpb24gaGFzVG9vTWFueUVkZ2VzKG5vZGUsIHNvdXJjZU9yVGFyZ2V0KSB7XG4gICAgdmFyIG5vZGVjbGFzcyA9IG5vZGUuZGF0YSgnY2xhc3MnKTtcbiAgICB2YXIgdG90YWxUb29NYW55ID0gdHJ1ZTtcbiAgICB2YXIgZWRnZVRvb01hbnkgPSB0cnVlO1xuICAgIGlmIChzb3VyY2VPclRhcmdldCA9PSBcInNvdXJjZVwiKSB7XG4gICAgICAgIHZhciBzYW1lRWRnZUNvdW50T3V0ID0gbm9kZS5vdXRnb2VycygnZWRnZVtjbGFzcz1cIicrZWRnZWNsYXNzKydcIl0nKS5zaXplKCk7XG4gICAgICAgIHZhciB0b3RhbEVkZ2VDb3VudE91dCA9IG5vZGUub3V0Z29lcnMoJ2VkZ2UnKS5zaXplKCk7XG4gICAgICAgIC8vIGNoZWNrIHRoYXQgdGhlIHRvdGFsIGVkZ2UgY291bnQgaXMgd2l0aGluIHRoZSBsaW1pdHNcbiAgICAgICAgaWYgKGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzU291cmNlLm1heFRvdGFsID09IC0xXG4gICAgICAgICAgICB8fCB0b3RhbEVkZ2VDb3VudE91dCA8IGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzU291cmNlLm1heFRvdGFsICkge1xuICAgICAgICAgICAgdG90YWxUb29NYW55ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhlbiBjaGVjayBsaW1pdHMgZm9yIHRoaXMgc3BlY2lmaWMgZWRnZSBjbGFzc1xuICAgICAgICBpZiAoZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNTb3VyY2UubWF4RWRnZSA9PSAtMVxuICAgICAgICAgICAgfHwgc2FtZUVkZ2VDb3VudE91dCA8IGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzU291cmNlLm1heEVkZ2UgKSB7XG4gICAgICAgICAgICBlZGdlVG9vTWFueSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIG9ubHkgb25lIG9mIHRoZSBsaW1pdHMgaXMgcmVhY2hlZCB0aGVuIGVkZ2UgaXMgaW52YWxpZFxuICAgICAgICByZXR1cm4gdG90YWxUb29NYW55IHx8IGVkZ2VUb29NYW55O1xuICAgIH1cbiAgICBlbHNlIHsgLy8gbm9kZSBpcyB1c2VkIGFzIHRhcmdldFxuICAgICAgICB2YXIgc2FtZUVkZ2VDb3VudEluID0gbm9kZS5pbmNvbWVycygnZWRnZVtjbGFzcz1cIicrZWRnZWNsYXNzKydcIl0nKS5zaXplKCk7XG4gICAgICAgIHZhciB0b3RhbEVkZ2VDb3VudEluID0gbm9kZS5pbmNvbWVycygnZWRnZScpLnNpemUoKTtcbiAgICAgICAgaWYgKGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heFRvdGFsID09IC0xXG4gICAgICAgICAgICB8fCB0b3RhbEVkZ2VDb3VudEluIDwgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNUYXJnZXQubWF4VG90YWwgKSB7XG4gICAgICAgICAgICB0b3RhbFRvb01hbnkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNUYXJnZXQubWF4RWRnZSA9PSAtMVxuICAgICAgICAgICAgfHwgc2FtZUVkZ2VDb3VudEluIDwgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNUYXJnZXQubWF4RWRnZSApIHtcbiAgICAgICAgICAgIGVkZ2VUb29NYW55ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvdGFsVG9vTWFueSB8fCBlZGdlVG9vTWFueTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNJbkNvbXBsZXgobm9kZSkge1xuICAgIHJldHVybiBub2RlLnBhcmVudCgpLmRhdGEoJ2NsYXNzJykgPT0gJ2NvbXBsZXgnO1xuICB9XG5cbiAgaWYgKGlzSW5Db21wbGV4KHNvdXJjZSkgfHwgaXNJbkNvbXBsZXgodGFyZ2V0KSkgeyAvLyBzdWJ1bml0cyBvZiBhIGNvbXBsZXggYXJlIG5vIGxvbmdlciBFUE5zLCBubyBjb25uZWN0aW9uIGFsbG93ZWRcbiAgICByZXR1cm4gJ2ludmFsaWQnO1xuICB9XG5cbiAgLy8gY2hlY2sgbmF0dXJlIG9mIGNvbm5lY3Rpb25cbiAgaWYgKGVkZ2VDb25zdHJhaW50c1tzb3VyY2VjbGFzc10uYXNTb3VyY2UuaXNBbGxvd2VkICYmIGVkZ2VDb25zdHJhaW50c1t0YXJnZXRjbGFzc10uYXNUYXJnZXQuaXNBbGxvd2VkKSB7XG4gICAgLy8gY2hlY2sgYW1vdW50IG9mIGNvbm5lY3Rpb25zXG4gICAgaWYgKCFoYXNUb29NYW55RWRnZXMoc291cmNlLCBcInNvdXJjZVwiKSAmJiAhaGFzVG9vTWFueUVkZ2VzKHRhcmdldCwgXCJ0YXJnZXRcIikgKSB7XG4gICAgICByZXR1cm4gJ3ZhbGlkJztcbiAgICB9XG4gIH1cbiAgLy8gdHJ5IHRvIHJldmVyc2VcbiAgaWYgKGVkZ2VDb25zdHJhaW50c1t0YXJnZXRjbGFzc10uYXNTb3VyY2UuaXNBbGxvd2VkICYmIGVkZ2VDb25zdHJhaW50c1tzb3VyY2VjbGFzc10uYXNUYXJnZXQuaXNBbGxvd2VkKSB7XG4gICAgaWYgKCFoYXNUb29NYW55RWRnZXModGFyZ2V0LCBcInNvdXJjZVwiKSAmJiAhaGFzVG9vTWFueUVkZ2VzKHNvdXJjZSwgXCJ0YXJnZXRcIikgKSB7XG4gICAgICByZXR1cm4gJ3JldmVyc2UnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gJ2ludmFsaWQnO1xufTtcblxuLypcbiAqIFVuaGlkZSBnaXZlbiBlbGVzIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXG4gKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihlbGVzLCBsYXlvdXRwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgZ2l2ZW4gZWxlc1xuICBpZiAodHlwZW9mIGxheW91dHBhcmFtID09PSAnZnVuY3Rpb24nKSB7XG4gICAgbGF5b3V0cGFyYW0oKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgYSBmdW5jdGlvbiBleGVjdXRlIGl0XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIGxheW91dCA9IGN5LmxheW91dChsYXlvdXRwYXJhbSk7IC8vIElmIGxheW91dHBhcmFtIGlzIGxheW91dCBvcHRpb25zIGNhbGwgbGF5b3V0IHdpdGggdGhhdCBvcHRpb25zLlxuICAgIFxuICAgIC8vIERvIHRoaXMgY2hlY2sgZm9yIGN5dG9zY2FwZS5qcyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gICAgaWYgKGxheW91dCAmJiBsYXlvdXQucnVuKSB7XG4gICAgICBsYXlvdXQucnVuKCk7XG4gICAgfVxuICB9XG4gIFxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLypcbiAqIENoYW5nZSBzdHlsZS9jc3Mgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gdmFsdWUvdmFsdWVzIChOb3RlIHRoYXQgdmFsdWVNYXAgcGFyYW1ldGVyIG1heSBiZVxuICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcbiAgaWYgKCB0eXBlb2YgdmFsdWVNYXAgPT09ICdvYmplY3QnICkge1xuICAgIGN5LnN0YXJ0QmF0Y2goKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuICAgICAgZWxlLmNzcyhuYW1lLCB2YWx1ZU1hcFtlbGUuaWQoKV0pOyAvLyB2YWx1ZU1hcCBpcyBhbiBpZCB0byB2YWx1ZSBtYXAgdXNlIGl0IGluIHRoaXMgd2F5XG4gICAgfVxuICAgIGN5LmVuZEJhdGNoKCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlcy5jc3MobmFtZSwgdmFsdWVNYXApOyAvLyB2YWx1ZU1hcCBpcyBqdXN0IGEgc3RyaW5nIHNldCBjc3MoJ25hbWUnKSBmb3IgYWxsIGVsZXMgdG8gdGhpcyB2YWx1ZVxuICB9XG59O1xuXG4vKlxuICogQ2hhbmdlIGRhdGEgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gdmFsdWUvdmFsdWVzIChOb3RlIHRoYXQgdmFsdWVNYXAgcGFyYW1ldGVyIG1heSBiZVxuICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YSA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlTWFwKSB7XG4gIGlmICggdHlwZW9mIHZhbHVlTWFwID09PSAnb2JqZWN0JyApIHtcbiAgICBjeS5zdGFydEJhdGNoKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICAgIGVsZS5kYXRhKG5hbWUsIHZhbHVlTWFwW2VsZS5pZCgpXSk7IC8vIHZhbHVlTWFwIGlzIGFuIGlkIHRvIHZhbHVlIG1hcCB1c2UgaXQgaW4gdGhpcyB3YXlcbiAgICB9XG4gICAgY3kuZW5kQmF0Y2goKTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVzLmRhdGEobmFtZSwgdmFsdWVNYXApOyAvLyB2YWx1ZU1hcCBpcyBqdXN0IGEgc3RyaW5nIHNldCBjc3MoJ25hbWUnKSBmb3IgYWxsIGVsZXMgdG8gdGhpcyB2YWx1ZVxuICB9XG59O1xuXG4vKlxuICogUmV0dXJuIHRoZSBzZXQgb2YgYWxsIG5vZGVzIHByZXNlbnQgdW5kZXIgdGhlIGdpdmVuIHBvc2l0aW9uXG4gKiByZW5kZXJlZFBvcyBtdXN0IGJlIGEgcG9pbnQgZGVmaW5lZCByZWxhdGl2ZWx5IHRvIGN5dG9zY2FwZSBjb250YWluZXJcbiAqIChsaWtlIHJlbmRlcmVkUG9zaXRpb24gZmllbGQgb2YgYSBub2RlKVxuICovXG5lbGVtZW50VXRpbGl0aWVzLmdldE5vZGVzQXQgPSBmdW5jdGlvbihyZW5kZXJlZFBvcykge1xuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xuICB2YXIgeCA9IHJlbmRlcmVkUG9zLng7XG4gIHZhciB5ID0gcmVuZGVyZWRQb3MueTtcbiAgdmFyIHJlc3VsdE5vZGVzID0gW107XG4gIGZvcih2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIHJlbmRlcmVkQmJveCA9IG5vZGUucmVuZGVyZWRCb3VuZGluZ0JveCh7XG4gICAgICBpbmNsdWRlTm9kZXM6IHRydWUsXG4gICAgICBpbmNsdWRlRWRnZXM6IGZhbHNlLFxuICAgICAgaW5jbHVkZUxhYmVsczogZmFsc2UsXG4gICAgICBpbmNsdWRlU2hhZG93czogZmFsc2VcbiAgICB9KTtcbiAgICBpZiAoeCA+PSByZW5kZXJlZEJib3gueDEgJiYgeCA8PSByZW5kZXJlZEJib3gueDIpIHtcbiAgICAgIGlmICh5ID49IHJlbmRlcmVkQmJveC55MSAmJiB5IDw9IHJlbmRlcmVkQmJveC55Mikge1xuICAgICAgICByZXN1bHROb2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0Tm9kZXM7XG59O1xuXG5lbGVtZW50VXRpbGl0aWVzLmRlbXVsdGltZXJpemVDbGFzcyA9IGZ1bmN0aW9uKHNiZ25jbGFzcykge1xuICByZXR1cm4gc2JnbmNsYXNzLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XG59O1xuXG4vKlxuICogQWRkIHBvcnRzIHRvIHRoZSBnaXZlbiBub2RlLCB3aXRoIGdpdmVuIG9yZGVyaW5nIGFuZCBwb3J0IGRpc3RhbmNlLlxuICovXG5lbGVtZW50VXRpbGl0aWVzLmFkZFBvcnRzID0gZnVuY3Rpb24obm9kZSwgb3JkZXJpbmcsIHBvcnREaXN0YW5jZSkge1xuICB2YXIgZmlyc3RQb3J0SWQgPSBub2RlLmlkKCkgKyBcIi4xXCI7IC8vIElkIG9mIGZpcnN0IHBvcnRcbiAgdmFyIHNlY29uZFBvcnRJZCA9IG5vZGUuaWQoKSArIFwiLjJcIjsgLy8gSWQgb2Ygc2Vjb25mIHBvcnRcbiAgLy8gRmlyc3QgcG9ydCBvYmplY3QgeCBhbmQgeSB3aWxsIGJlIGZpbGxlZCBhY2NvcmRpbmcgdG8gb3JkZXJpbmcsIHRoZSBmaXJzdCBwb3J0IGlzIHN1cHBvc2VkIHRvIGJlIHRoZSBsZWZ0IG1vc3Qgb3IgdGhlIHRvcCBtb3N0IG9uZVxuICB2YXIgZmlyc3RQb3J0ID0geyBpZDogZmlyc3RQb3J0SWQgfTtcbiAgLy8gU2Vjb25kIHBvcnQgb2JqZWN0IHggYW5kIHkgd2lsbCBiZSBmaWxsZWQgYWNjb3JkaW5nIHRvIG9yZGVyaW5nLCB0aGUgc2Vjb25kIHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgdGhlIHJpZ2h0IG1vc3Qgb3IgdGhlIGJvdHRvbSBtb3N0IG9uZVxuICB2YXIgc2Vjb25kUG9ydCA9IHsgaWQ6IHNlY29uZFBvcnRJZCB9O1xuICBcbiAgLy8gQ29tcGxldGUgcG9ydCBvYmplY3RzIGFjY29yZGluZyB0byBvcmRlcmluZ1xuICBpZiAoIG9yZGVyaW5nID09PSAnTC10by1SJyB8fCBvcmRlcmluZyA9PT0gJ1ItdG8tTCcgKSB7XG4gICAgLy8gSWYgb3JkZXJpbmcgaXMgaW4gaG9yaXpvbnRhbCBheGlzIGZpcnN0IHBvcnQgaXMgdGhlIGxlZnQgbW9zdCBvbmUgYW5kIHRoZSBzZWNvbmQgcG9ydCBpcyB0aGUgcmlnaHQgbW9zdCBvbmVcbiAgICBmaXJzdFBvcnQueCA9IC0xICogcG9ydERpc3RhbmNlO1xuICAgIHNlY29uZFBvcnQueCA9IHBvcnREaXN0YW5jZTtcbiAgICBmaXJzdFBvcnQueSA9IDA7XG4gICAgc2Vjb25kUG9ydC55ID0gMDtcbiAgfVxuICBlbHNlIHsgLy8gSWYgb3JkZXJpbmcgaXMgJ1QtdG8tQicgb3IgJ0ItdG8tVCdcbiAgICAgLy8gSWYgb3JkZXJpbmcgaXMgaW4gdmVydGljYWwgYXhpcyBmaXJzdCBwb3J0IGlzIHRoZSB0b3AgbW9zdCBvbmUgYW5kIHRoZSBzZWNvbmQgcG9ydCBpcyB0aGUgYm90dG9tIG1vc3Qgb25lXG4gICAgZmlyc3RQb3J0LnkgPSAtMSAqIHBvcnREaXN0YW5jZTtcbiAgICBzZWNvbmRQb3J0LnkgPSBwb3J0RGlzdGFuY2U7XG4gICAgZmlyc3RQb3J0LnggPSAwO1xuICAgIHNlY29uZFBvcnQueCA9IDA7XG4gIH1cbiAgXG4gIHZhciBmcm9tTG9yVCA9IG9yZGVyaW5nID09PSAnTC10by1SJyB8fCBvcmRlcmluZyA9PT0gJ1QtdG8tQic7IC8vIENoZWNrIGlmIG9yZGVyaW5nIHN0YXJ0cyBmcm9tIGxlZnQgb3IgdG9wXG4gIHZhciBwb3J0cyA9IFtmaXJzdFBvcnQsIHNlY29uZFBvcnRdOyAvLyBQb3J0cyBhcnJheSBmb3IgdGhlIG5vZGVcbiAgdmFyIGNvbm5lY3RlZEVkZ2VzID0gbm9kZS5jb25uZWN0ZWRFZGdlcygpOyAvLyBUaGUgZWRnZXMgY29ubmVjdGVkIHRvIHRoZSBub2RlXG4gIFxuICBjeS5zdGFydEJhdGNoKCk7XG4gIFxuICBub2RlLmRhdGEoJ3BvcnRzJywgcG9ydHMpO1xuICBcbiAgLy8gUmVzZXQgdGhlIHBvcnRzb3VyY2UgYW5kIHBvcnR0YXJnZXQgZm9yIGVhY2ggZWRnZSBjb25uZWN0ZWQgdG8gdGhlIG5vZGVcbiAgZm9yICggdmFyIGkgPSAwOyBpIDwgY29ubmVjdGVkRWRnZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgdmFyIGVkZ2UgPSBjb25uZWN0ZWRFZGdlc1tpXTtcbiAgICB2YXIgZWRnZUNsYXNzID0gZWRnZS5kYXRhKCdjbGFzcycpO1xuICAgIC8qXG4gICAgICogSWYgdGhlIG5vZGUgaXMgdGhlIGVkZ2UgdGFyZ2V0IHdlIG1heSBuZWVkIHRvIHNldCB0aGUgcG9ydHRhcmdldCBvZiB0aGUgZWRnZSB0byB0aGUgaW5wdXQgcG9ydCBvZiB0aGUgbm9kZSAoRmlyc3Qgb3Igc2Vjb25kIHBvcnQgYWNjb3JpbmcgdG8gdGhlIG9yaWVudGF0aW9uKVxuICAgICAqIGlmIGl0IGlzIHRoZSBlZGdlIHNvcnVjZSB3ZSBtYXkgbmVlZCB0byBzZXQgdGhlIHBvcnRzb3VyY2Ugb2YgdGhlIGVkZ2UgdG8gdGhlIG91dHB1dCBwb3J0IHNpbWlsYXJseS5cbiAgICAgKiBOb3RlIHRoYXQgaWYgZnJvbiBsZWZ0IG9yIHRvcCAoZnJvbUxvclQpIGlzIHRydWUgdGhlbiB0aGUgZmlyc3QgcG9ydCBpcyB0aGUgc291cmNlIHBvcnQgYW5kIHNlY29uZCBwb3J0IGlzIHRoZSB0YXJnZXQgcG9ydCxcbiAgICAgKiBlbHNlIGl0IGlzIHZpY2UgdmVyc2EuXG4gICAgICogXG4gICAgICovXG4gICAgaWYgKCBlZGdlLmRhdGEoJ3RhcmdldCcpID09PSBub2RlLmlkKCkgKSB7XG4gICAgICBpZiAoZWRnZUNsYXNzID09PSAncHJvZHVjdGlvbicgfHwgdGhpcy5pc01vZHVsYXRpb25BcmNDbGFzcyhlZGdlQ2xhc3MpKSB7XG4gICAgICAgIGNvbnRpbnVlOyAvLyBwcm9kdWN0aW9uIG9yIG1vZHVsYXRpb24gdHlwZSBvZiBlZGdlcyBjYW5ub3QgYmUgY29ubmVjdGVkIHRvIGFueSBwb3J0IG9mIHRhcmdldCBub2RlIChBIHByb2R1Y3Rpb24gY2FuIGhhdmUgYSBwcm9jZXNzIGFzIHRhcmdldCBub2RlIGJ1dCBpdCBpcyBzdXBwb3NlZCB0byBiZSBjb25uZWN0ZWQgdG8gdGhhdCBub2RlIGZyb20gaXRzIGJvZHksIG5vdCBmcm9tIGEgcG9ydClcbiAgICAgIH1cbiAgICAgIGlmICggZnJvbUxvclQgKSB7XG4gICAgICAgIGVkZ2UuZGF0YSgncG9ydHRhcmdldCcsIGZpcnN0UG9ydElkKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlZGdlLmRhdGEoJ3BvcnR0YXJnZXQnLCBzZWNvbmRQb3J0SWQpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmIChlZGdlQ2xhc3MgPT09ICdjb25zdW1wdGlvbicpIHtcbiAgICAgICAgY29udGludWU7IC8vIGNvbnN1bXBpdG9uIGVkZ2UgY2Fubm90IGJlIGNvbm5lY3RlZCB0byBhbnkgcG9ydCBvZiBzb3VyY2Ugbm9kZVxuICAgICAgfVxuICAgICAgaWYgKCBmcm9tTG9yVCApIHtcbiAgICAgICAgZWRnZS5kYXRhKCdwb3J0c291cmNlJywgc2Vjb25kUG9ydElkKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlZGdlLmRhdGEoJ3BvcnRzb3VyY2UnLCBmaXJzdFBvcnRJZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBjeS5lbmRCYXRjaCgpO1xufTtcblxuLypcbiAqIFJlbW92ZSB0aGUgcG9ydHMgb2YgdGhlIGdpdmVuIG5vZGVcbiAqL1xuZWxlbWVudFV0aWxpdGllcy5yZW1vdmVQb3J0cyA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgdmFyIGNvbm5lY3RlZEVkZ2VzID0gbm9kZS5jb25uZWN0ZWRFZGdlcygpO1xuICB2YXIgbm9kZUlkID0gbm9kZS5pZCgpO1xuICBcbiAgY3kuc3RhcnRCYXRjaCgpO1xuICBcbiAgLy8gUmVzZXQgcG9ydHNvdXJjZSBvciBwb3J0dGFyZ2V0IG9mIHRoZSBjb25uZWN0ZWQgZWRnZXMgdG8gdGhlIG5vZGUgaWRcbiAgZm9yICggdmFyIGkgPSAwOyBpIDwgY29ubmVjdGVkRWRnZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgdmFyIGVkZ2UgPSBjb25uZWN0ZWRFZGdlc1tpXTtcbiAgICBpZiAoIGVkZ2UuZGF0YSgnc291cmNlJykgPT09IG5vZGVJZCApIHtcbiAgICAgIGVkZ2UuZGF0YSgncG9ydHNvdXJjZScsIG5vZGVJZCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWRnZS5kYXRhKCdwb3J0dGFyZ2V0Jywgbm9kZUlkKTtcbiAgICB9XG4gIH1cbiAgXG4gIG5vZGUuZGF0YSgncG9ydHMnLCBbXSk7IC8vIENsZWFyIHBvcnRzIGRhdGFcbiAgXG4gIGN5LmVuZEJhdGNoKCk7XG59O1xuXG4vKlxuICogU2V0cyB0aGUgb3JkZXJpbmcgb2YgdGhlIGdpdmVuIG5vZGVzLlxuICogT3JkZXJpbmcgb3B0aW9ucyBhcmUgJ0wtdG8tUicsICdSLXRvLUwnLCAnVC10by1CJywgJ0ItdG8tVCcsICdub25lJy5cbiAqIElmIGEgbm9kZSBkb2VzIG5vdCBoYXZlIGFueSBwb3J0IGJlZm9yZSB0aGUgb3BlcmF0aW9uIGFuZCBpdCBpcyBzdXBwb3NlZCB0byBoYXZlIHNvbWUgYWZ0ZXIgb3BlcmF0aW9uIHRoZSBwb3J0RGlzdGFuY2UgcGFyYW1ldGVyIGlzIFxuICogdXNlZCB0byBzZXQgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIG5vZGUgY2VudGVyIGFuZCB0aGUgcG9ydHMuIFRoZSBkZWZhdWx0IHBvcnQgZGlzdGFuY2UgaXMgNjAuXG4gKi9cbmVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyA9IGZ1bmN0aW9uKCBub2Rlcywgb3JkZXJpbmcsIHBvcnREaXN0YW5jZSApIHtcbiAgLypcbiAgKiBSZXR1cnNuIGlmIHRoZSBnaXZlbiBwb3J0SWQgaXMgcG9ydHRhcmdldCBvZiBhbnkgb2YgdGhlIGdpdmVuIGVkZ2VzLlxuICAqIFRoZXNlIGVkZ2VzIGFyZSBleHBlY3RlZCB0byBiZSB0aGUgZWRnZXMgY29ubmVjdGVkIHRvIHRoZSBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGF0IHBvcnQuXG4gICovXG4gIHZhciBpc1BvcnRUYXJnZXRPZkFueUVkZ2UgPSBmdW5jdGlvbihlZGdlcywgcG9ydElkKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGVkZ2VzW2ldLmRhdGEoJ3BvcnR0YXJnZXQnKSA9PT0gcG9ydElkKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgXG4gIHBvcnREaXN0YW5jZSA9IHBvcnREaXN0YW5jZSA/IHBvcnREaXN0YW5jZSA6IDYwOyAvLyBUaGUgZGVmYXVsdCBwb3J0IGRpc3RhbmNlIGlzIDYwXG4gIFxuICBjeS5zdGFydEJhdGNoKCk7XG4gIFxuICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKyApIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHZhciBjdXJyZW50T3JkZXJpbmcgPSBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXMuZ2V0UG9ydHNPcmRlcmluZyhub2RlKTsgLy8gVGhlIGN1cnJlbnQgcG9ydHMgb3JkZXJpbmcgb2YgdGhlIG5vZGVcbiAgICBcbiAgICAvLyBJZiB0aGUgY3VycmVudCBvcmRlcmluZyBpcyBhbHJlYWR5IGVxdWFsIHRvIHRoZSBkZXNpcmVkIG9yZGVyaW5nIHBhc3MgdGhpcyBub2RlIGRpcmVjdGx5XG4gICAgaWYgKCBvcmRlcmluZyA9PT0gY3VycmVudE9yZGVyaW5nICkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIFxuICAgIGlmICggb3JkZXJpbmcgPT09ICdub25lJyApIHsgLy8gSWYgdGhlIG9yZGVyaW5nIGlzICdub25lJyByZW1vdmUgdGhlIHBvcnRzIG9mIHRoZSBub2RlXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZVBvcnRzKG5vZGUpO1xuICAgIH1cbiAgICBlbHNlIGlmICggY3VycmVudE9yZGVyaW5nID09PSAnbm9uZScgKSB7IC8vIElmIHRoZSBkZXNpcmVkIG9yZGVyaW5nIGlzIG5vdCAnbm9uZScgYnV0IHRoZSBjdXJyZW50IG9uZSBpcyAnbm9uZScgYWRkIHBvcnRzIHdpdGggdGhlIGdpdmVuIHBhcmFtZXRlcnMuXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFBvcnRzKG5vZGUsIG9yZGVyaW5nLCBwb3J0RGlzdGFuY2UpO1xuICAgIH1cbiAgICBlbHNlIHsgLy8gRWxzZSBjaGFuZ2UgdGhlIG9yZGVyaW5nIGJ5IGFsdGVyaW5nIG5vZGUgJ3BvcnRzJ1xuICAgICAgdmFyIHBvcnRzID0gbm9kZS5kYXRhKCdwb3J0cycpOyAvLyBQb3J0cyBvZiB0aGUgbm9kZVxuICAgICAgLy8gSWYgY3VycmVudE9yZGVyaW5nIGlzICdub25lJyB1c2UgdGhlIHBvcnREaXN0YW5jZSBnaXZlbiBieSBwYXJhbWV0ZXIgZWxzZSB1c2UgdGhlIGV4aXN0aW5nIG9uZVxuICAgICAgdmFyIGRpc3QgPSBjdXJyZW50T3JkZXJpbmcgPT09ICdub25lJyA/IHBvcnREaXN0YW5jZSA6ICggTWF0aC5hYnMoIHBvcnRzWzBdLnggKSB8fCBNYXRoLmFicyggcG9ydHNbMF0ueSApICk7XG4gICAgICB2YXIgY29ubmVjdGVkRWRnZXMgPSBub2RlLmNvbm5lY3RlZEVkZ2VzKCk7IC8vIFRoZSBlZGdlcyBjb25uZWN0ZWQgdG8gdGhlIG5vZGVcbiAgICAgIHZhciBwb3J0c291cmNlLCBwb3J0dGFyZ2V0OyAvLyBUaGUgcG9ydHMgd2hpY2ggYXJlIHBvcnRzb3VyY2UvcG9ydHRhcmdldCBvZiB0aGUgY29ubmVjdGVkIGVkZ2VzXG4gICAgICBcbiAgICAgIC8vIERldGVybWluZSB0aGUgcG9ydHNvdXJjZSBhbmQgcG9ydHRhcmdldFxuICAgICAgaWYgKCBpc1BvcnRUYXJnZXRPZkFueUVkZ2UoY29ubmVjdGVkRWRnZXMsIHBvcnRzWzBdLmlkKSApIHtcbiAgICAgICAgcG9ydHRhcmdldCA9IHBvcnRzWzBdO1xuICAgICAgICBwb3J0c291cmNlID0gcG9ydHNbMV07XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcG9ydHRhcmdldCA9IHBvcnRzWzFdO1xuICAgICAgICBwb3J0c291cmNlID0gcG9ydHNbMF07XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmICggb3JkZXJpbmcgPT09ICdMLXRvLVInICkge1xuICAgICAgICAvLyBJZiBvcmRlcmluZyBpcyAnTC10by1SJyB0aGUgcG9ydHRhcmdldCBzaG91bGQgYmUgdGhlIGxlZnQgbW9zdCBwb3J0IGFuZCB0aGUgcG9ydHNvdXJjZSBzaG91bGQgYmUgdGhlIHJpZ2h0IG1vc3QgcG9ydFxuICAgICAgICBwb3J0dGFyZ2V0LnggPSAtMSAqIGRpc3Q7XG4gICAgICAgIHBvcnRzb3VyY2UueCA9IGRpc3Q7XG4gICAgICAgIHBvcnR0YXJnZXQueSA9IDA7XG4gICAgICAgIHBvcnRzb3VyY2UueSA9IDA7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICggb3JkZXJpbmcgPT09ICdSLXRvLUwnICkge1xuICAgICAgICAvLyBJZiBvcmRlcmluZyBpcyAnUi10by1MJyB0aGUgcG9ydHRhcmdldCBzaG91bGQgYmUgdGhlIHJpZ2h0IG1vc3QgcG9ydCBhbmQgdGhlIHBvcnRzb3VyY2Ugc2hvdWxkIGJlIHRoZSBsZWZ0IG1vc3QgcG9ydFxuICAgICAgICBwb3J0dGFyZ2V0LnggPSBkaXN0O1xuICAgICAgICBwb3J0c291cmNlLnggPSAtMSAqIGRpc3Q7XG4gICAgICAgIHBvcnR0YXJnZXQueSA9IDA7XG4gICAgICAgIHBvcnRzb3VyY2UueSA9IDA7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICggb3JkZXJpbmcgPT09ICdULXRvLUInICkge1xuICAgICAgICAvLyBJZiBvcmRlcmluZyBpcyAnVC10by1CJyB0aGUgcG9ydHRhcmdldCBzaG91bGQgYmUgdGhlIHRvcCBtb3N0IHBvcnQgYW5kIHRoZSBwb3J0c291cmNlIHNob3VsZCBiZSB0aGUgYm90dG9tIG1vc3QgcG9ydFxuICAgICAgICBwb3J0dGFyZ2V0LnggPSAwO1xuICAgICAgICBwb3J0c291cmNlLnggPSAwO1xuICAgICAgICBwb3J0dGFyZ2V0LnkgPSAtMSAqIGRpc3Q7XG4gICAgICAgIHBvcnRzb3VyY2UueSA9IGRpc3Q7XG4gICAgICB9XG4gICAgICBlbHNlICB7IC8vaWYgb3JkZXJpbmcgaXMgJ0ItdG8tVCdcbiAgICAgICAgLy8gSWYgb3JkZXJpbmcgaXMgJ0ItdG8tVCcgdGhlIHBvcnR0YXJnZXQgc2hvdWxkIGJlIHRoZSBib3R0b20gbW9zdCBwb3J0IGFuZCB0aGUgcG9ydHNvdXJjZSBzaG91bGQgYmUgdGhlIHRvcCBtb3N0IHBvcnRcbiAgICAgICAgcG9ydHRhcmdldC54ID0gMDtcbiAgICAgICAgcG9ydHNvdXJjZS54ID0gMDtcbiAgICAgICAgcG9ydHRhcmdldC55ID0gZGlzdDtcbiAgICAgICAgcG9ydHNvdXJjZS55ID0gLTEgKiBkaXN0O1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBub2RlLmRhdGEoJ3BvcnRzJywgcG9ydHMpOyAvLyBSZXNldCB0aGUgbm9kZSBwb3J0c1xuICB9XG4gIFxuICBub2Rlcy5kYXRhKCdwb3J0c29yZGVyaW5nJywgb3JkZXJpbmcpOyAvLyBVcGRhdGUgdGhlIGNhY2hlZCBvcmRlcmluZ3Mgb2YgdGhlIG5vZGVzXG4gIGN5LmVuZEJhdGNoKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVsZW1lbnRVdGlsaXRpZXM7XG4iLCIvKiBcbiAqIFV0aWxpdHkgZmlsZSB0byBnZXQgYW5kIHNldCB0aGUgbGlicmFyaWVzIHRvIHdoaWNoIHNiZ252aXogaXMgZGVwZW5kZW50IGZyb20gYW55IGZpbGUuXG4gKi9cblxudmFyIGxpYlV0aWxpdGllcyA9IGZ1bmN0aW9uKCl7XG59O1xuXG5saWJVdGlsaXRpZXMuc2V0TGlicyA9IGZ1bmN0aW9uKGxpYnMpIHtcbiAgdGhpcy5saWJzID0gbGlicztcbn07XG5cbmxpYlV0aWxpdGllcy5nZXRMaWJzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmxpYnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxpYlV0aWxpdGllczsiLCJ2YXIgb3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9uLXV0aWxpdGllcycpLmdldE9wdGlvbnMoKTtcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xuXG4vKlxuICogVGhlIG1haW4gdXRpbGl0aWVzIHRvIGJlIGV4cG9zZWQgZGlyZWN0bHkuXG4gKi9cbmZ1bmN0aW9uIG1haW5VdGlsaXRpZXMoKSB7XG59O1xuXG4vKlxuICogQWRkcyBhIG5ldyBub2RlIHdpdGggdGhlIGdpdmVuIGNsYXNzIGFuZCBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuYWRkTm9kZSA9IGZ1bmN0aW9uKHgsIHkgLCBub2RlY2xhc3MsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4LCB5LCBub2RlY2xhc3MsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIG5ld05vZGUgOiB7XG4gICAgICAgIHg6IHgsXG4gICAgICAgIHk6IHksXG4gICAgICAgIGNsYXNzOiBub2RlY2xhc3MsXG4gICAgICAgIGlkOiBpZCxcbiAgICAgICAgcGFyZW50OiBwYXJlbnQsXG4gICAgICAgIHZpc2liaWxpdHk6IHZpc2liaWxpdHlcbiAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGROb2RlXCIsIHBhcmFtKTtcbiAgfVxufTtcblxuLypcbiAqIEFkZHMgYSBuZXcgZWRnZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgaGF2aW5nIHRoZSBnaXZlbiBzb3VyY2UgYW5kIHRhcmdldCBpZHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuYWRkRWRnZSA9IGZ1bmN0aW9uKHNvdXJjZSwgdGFyZ2V0ICwgZWRnZWNsYXNzLCBpZCwgdmlzaWJpbGl0eSkge1xuICAvLyBHZXQgdGhlIHZhbGlkYXRpb24gcmVzdWx0XG4gIHZhciB2YWxpZGF0aW9uID0gZWxlbWVudFV0aWxpdGllcy52YWxpZGF0ZUFycm93RW5kcyhlZGdlY2xhc3MsIGN5LmdldEVsZW1lbnRCeUlkKHNvdXJjZSksIGN5LmdldEVsZW1lbnRCeUlkKHRhcmdldCkpO1xuXG4gIC8vIElmIHZhbGlkYXRpb24gcmVzdWx0IGlzICdpbnZhbGlkJyBjYW5jZWwgdGhlIG9wZXJhdGlvblxuICBpZiAodmFsaWRhdGlvbiA9PT0gJ2ludmFsaWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICAvLyBJZiB2YWxpZGF0aW9uIHJlc3VsdCBpcyAncmV2ZXJzZScgcmV2ZXJzZSB0aGUgc291cmNlLXRhcmdldCBwYWlyIGJlZm9yZSBjcmVhdGluZyB0aGUgZWRnZVxuICBpZiAodmFsaWRhdGlvbiA9PT0gJ3JldmVyc2UnKSB7XG4gICAgdmFyIHRlbXAgPSBzb3VyY2U7XG4gICAgc291cmNlID0gdGFyZ2V0O1xuICAgIHRhcmdldCA9IHRlbXA7XG4gIH1cbiAgICAgIFxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHNvdXJjZSwgdGFyZ2V0LCBlZGdlY2xhc3MsIGlkLCB2aXNpYmlsaXR5KTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBuZXdFZGdlIDoge1xuICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgIGNsYXNzOiBlZGdlY2xhc3MsXG4gICAgICAgIGlkOiBpZCxcbiAgICAgICAgdmlzaWJpbGl0eTogdmlzaWJpbGl0eVxuICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZEVkZ2VcIiwgcGFyYW0pO1xuICB9XG59O1xuXG4vKlxuICogQWRkcyBhIHByb2Nlc3Mgd2l0aCBjb252ZW5pZW50IGVkZ2VzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBwbGVhc2Ugc2VlICdodHRwczovL2dpdGh1Yi5jb20vaVZpcy1hdC1CaWxrZW50L25ld3QvaXNzdWVzLzknLlxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyA9IGZ1bmN0aW9uKF9zb3VyY2UsIF90YXJnZXQsIHByb2Nlc3NUeXBlKSB7XG4gIC8vIElmIHNvdXJjZSBhbmQgdGFyZ2V0IElEcyBhcmUgZ2l2ZW4gZ2V0IHRoZSBlbGVtZW50cyBieSBJRHNcbiAgdmFyIHNvdXJjZSA9IHR5cGVvZiBfc291cmNlID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9zb3VyY2UpIDogX3NvdXJjZTtcbiAgdmFyIHRhcmdldCA9IHR5cGVvZiBfdGFyZ2V0ID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF90YXJnZXQpIDogX3RhcmdldDtcbiAgXG4gIC8vIElmIHNvdXJjZSBvciB0YXJnZXQgZG9lcyBub3QgaGF2ZSBhbiBFUE4gY2xhc3MgdGhlIG9wZXJhdGlvbiBpcyBub3QgdmFsaWRcbiAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3Moc291cmNlKSB8fCAhZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKHRhcmdldCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzKF9zb3VyY2UsIF90YXJnZXQsIHByb2Nlc3NUeXBlKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBzb3VyY2U6IF9zb3VyY2UsXG4gICAgICB0YXJnZXQ6IF90YXJnZXQsXG4gICAgICBwcm9jZXNzVHlwZTogcHJvY2Vzc1R5cGVcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlc1wiLCBwYXJhbSk7XG4gIH1cbn07XG5cbi8qXG4gKiBDbG9uZSBnaXZlbiBlbGVtZW50cy4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuY2xvbmVFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgdmFyIGNiID0gY3kuY2xpcGJvYXJkKCk7XG4gIHZhciBfaWQgPSBjYi5jb3B5KGVsZXMsIFwiY2xvbmVPcGVyYXRpb25cIik7XG5cbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwicGFzdGVcIiwge2lkOiBfaWR9KTtcbiAgfSBcbiAgZWxzZSB7XG4gICAgY2IucGFzdGUoX2lkKTtcbiAgfVxufTtcblxuLypcbiAqIENvcHkgZ2l2ZW4gZWxlbWVudHMgdG8gY2xpcGJvYXJkLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cbiAqL1xubWFpblV0aWxpdGllcy5jb3B5RWxlbWVudHMgPSBmdW5jdGlvbiAoZWxlcykge1xuICBjeS5jbGlwYm9hcmQoKS5jb3B5KGVsZXMpO1xufTtcblxuLypcbiAqIFBhc3QgdGhlIGVsZW1lbnRzIGNvcGllZCB0byBjbGlwYm9hcmQuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxuICovXG5tYWluVXRpbGl0aWVzLnBhc3RlRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwicGFzdGVcIik7XG4gIH0gXG4gIGVsc2Uge1xuICAgIGN5LmNsaXBib2FyZCgpLnBhc3RlKCk7XG4gIH1cbn07XG5cbi8qXG4gKiBBbGlnbnMgZ2l2ZW4gbm9kZXMgaW4gZ2l2ZW4gaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgb3JkZXIuIFxuICogSG9yaXpvbnRhbCBhbmQgdmVydGljYWwgcGFyYW1ldGVycyBtYXkgYmUgJ25vbmUnIG9yIHVuZGVmaW5lZC5cbiAqIGFsaWduVG8gcGFyYW1ldGVyIGluZGljYXRlcyB0aGUgbGVhZGluZyBub2RlLlxuICogUmVxdXJpcmVzIGN5dG9zY2FwZS1ncmlkLWd1aWRlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5hbGlnbiA9IGZ1bmN0aW9uIChub2RlcywgaG9yaXpvbnRhbCwgdmVydGljYWwsIGFsaWduVG8pIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiYWxpZ25cIiwge1xuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgaG9yaXpvbnRhbDogaG9yaXpvbnRhbCxcbiAgICAgIHZlcnRpY2FsOiB2ZXJ0aWNhbCxcbiAgICAgIGFsaWduVG86IGFsaWduVG9cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBub2Rlcy5hbGlnbihob3Jpem9udGFsLCB2ZXJ0aWNhbCwgYWxpZ25Ubyk7XG4gIH1cbn07XG5cbi8qXG4gKiBDcmVhdGUgY29tcG91bmQgZm9yIGdpdmVuIG5vZGVzLiBjb21wb3VuZFR5cGUgbWF5IGJlICdjb21wbGV4JyBvciAnY29tcGFydG1lbnQnLlxuICogVGhpcyBtZXRob2QgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgPSBmdW5jdGlvbiAoX25vZGVzLCBjb21wb3VuZFR5cGUpIHtcbiAgdmFyIG5vZGVzID0gX25vZGVzO1xuICAvKlxuICAgKiBFbGVtaW5hdGUgdGhlIG5vZGVzIHdoaWNoIGNhbm5vdCBoYXZlIGEgcGFyZW50IHdpdGggZ2l2ZW4gY29tcG91bmQgdHlwZVxuICAgKi9cbiAgbm9kZXMgPSBfbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XG4gICAgaWYodHlwZW9mIGVsZW1lbnQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZW1lbnQgPSBpO1xuICAgIH1cbiAgICBcbiAgICB2YXIgc2JnbmNsYXNzID0gZWxlbWVudC5kYXRhKFwiY2xhc3NcIik7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNWYWxpZFBhcmVudChzYmduY2xhc3MsIGNvbXBvdW5kVHlwZSk7XG4gIH0pO1xuICBcbiAgbm9kZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldFRvcE1vc3ROb2Rlcyhub2Rlcyk7XG5cbiAgLy8gQWxsIGVsZW1lbnRzIHNob3VsZCBoYXZlIHRoZSBzYW1lIHBhcmVudCBhbmQgdGhlIGNvbW1vbiBwYXJlbnQgc2hvdWxkIG5vdCBiZSBhICdjb21wbGV4JyBcbiAgLy8gaWYgY29tcG91bmRUeXBlIGlzICdjb21wYXJ0ZW50J1xuICAvLyBiZWNhdXNlIHRoZSBvbGQgY29tbW9uIHBhcmVudCB3aWxsIGJlIHRoZSBwYXJlbnQgb2YgdGhlIG5ldyBjb21wYXJ0bWVudCBhZnRlciB0aGlzIG9wZXJhdGlvbiBhbmRcbiAgLy8gJ2NvbXBsZXhlcycgY2Fubm90IGluY2x1ZGUgJ2NvbXBhcnRtZW50cydcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwIHx8ICFlbGVtZW50VXRpbGl0aWVzLmFsbEhhdmVUaGVTYW1lUGFyZW50KG5vZGVzKVxuICAgICAgICAgIHx8ICggY29tcG91bmRUeXBlID09PSAnY29tcGFydG1lbnQnICYmIG5vZGVzLnBhcmVudCgpLmRhdGEoJ2NsYXNzJykgPT09ICdjb21wbGV4JyApICkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKGN5LnVuZG9SZWRvKCkpIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBjb21wb3VuZFR5cGU6IGNvbXBvdW5kVHlwZSxcbiAgICAgIG5vZGVzVG9NYWtlQ29tcG91bmQ6IG5vZGVzXG4gICAgfTtcblxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXNcIiwgcGFyYW0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKG5vZGVzLCBjb21wb3VuZFR5cGUpO1xuICB9XG59O1xuXG4vKlxuICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uIGFuZCBjaGVja3MgaWYgdGhlIG9wZXJhdGlvbiBpcyB2YWxpZC5cbiAqL1xubWFpblV0aWxpdGllcy5jaGFuZ2VQYXJlbnQgPSBmdW5jdGlvbihub2RlcywgX25ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XG4gIHZhciBuZXdQYXJlbnQgPSB0eXBlb2YgX25ld1BhcmVudCA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfbmV3UGFyZW50KSA6IF9uZXdQYXJlbnQ7XG4gIC8vIE5ldyBwYXJlbnQgaXMgc3VwcG9zZWQgdG8gYmUgb25lIG9mIHRoZSByb290LCBhIGNvbXBsZXggb3IgYSBjb21wYXJ0bWVudFxuICBpZiAobmV3UGFyZW50ICYmIG5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikgIT0gXCJjb21wbGV4XCIgJiYgbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKSAhPSBcImNvbXBhcnRtZW50XCIpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIC8qXG4gICAqIEVsZW1pbmF0ZSB0aGUgbm9kZXMgd2hpY2ggY2Fubm90IGhhdmUgdGhlIG5ld1BhcmVudCBhcyB0aGVpciBwYXJlbnRcbiAgICovXG4gIG5vZGVzID0gbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XG4gICAgaWYodHlwZW9mIGVsZW1lbnQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZW1lbnQgPSBpO1xuICAgIH1cbiAgICBcbiAgICB2YXIgc2JnbmNsYXNzID0gZWxlbWVudC5kYXRhKFwiY2xhc3NcIik7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNWYWxpZFBhcmVudChzYmduY2xhc3MsIG5ld1BhcmVudCk7XG4gIH0pO1xuICBcbiAgLy8gRGlzY2FyZCB0aGUgbm9kZXMgd2hvc2UgcGFyZW50IGlzIGFscmVhZHkgbmV3UGFyZW50LlxuICAvLyBEaXNjYXJkIHRoZSBuZXdQYXJlbnQgaXRzZWxmIGlmIGl0IGlzIGFtb25nIHRoZSBub2Rlc1xuICBub2RlcyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZWxlLCBpKSB7XG4gICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZWxlID0gaTtcbiAgICB9XG4gICAgXG4gICAgLy8gRGlzY2FyZCB0aGUgbmV3UGFyZW50IGlmIGl0IGlzIGFtb25nIHRoZSBub2Rlc1xuICAgIGlmIChuZXdQYXJlbnQgJiYgZWxlLmlkKCkgPT09IG5ld1BhcmVudC5pZCgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIERpc2NhcmQgdGhlIG5vZGVzIHdob3NlIHBhcmVudCBpcyBhbHJlYWR5IG5ld1BhcmVudFxuICAgIGlmICghbmV3UGFyZW50KSB7XG4gICAgICByZXR1cm4gZWxlLmRhdGEoJ3BhcmVudCcpICE9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBlbGUuZGF0YSgncGFyZW50JykgIT09IG5ld1BhcmVudC5pZCgpO1xuICB9KTtcblxuICAvLyBJZiBzb21lIG5vZGVzIGFyZSBhbmNlc3RvciBvZiBuZXcgcGFyZW50IGVsZW1pbmF0ZSB0aGVtXG4gIGlmIChuZXdQYXJlbnQpIHtcbiAgICBub2RlcyA9IG5vZGVzLmRpZmZlcmVuY2UobmV3UGFyZW50LmFuY2VzdG9ycygpKTtcbiAgfVxuXG4gIC8vIElmIGFsbCBub2RlcyBhcmUgZWxlbWluYXRlZCByZXR1cm4gZGlyZWN0bHlcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEp1c3QgbW92ZSB0aGUgdG9wIG1vc3Qgbm9kZXNcbiAgbm9kZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldFRvcE1vc3ROb2Rlcyhub2Rlcyk7XG4gIFxuICB2YXIgcGFyZW50SWQgPSBuZXdQYXJlbnQgPyBuZXdQYXJlbnQuaWQoKSA6IG51bGw7XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGZpcnN0VGltZTogdHJ1ZSxcbiAgICAgIHBhcmVudERhdGE6IHBhcmVudElkLCAvLyBJdCBrZWVwcyB0aGUgbmV3UGFyZW50SWQgKEp1c3QgYW4gaWQgZm9yIGVhY2ggbm9kZXMgZm9yIHRoZSBmaXJzdCB0aW1lKVxuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgcG9zRGlmZlg6IHBvc0RpZmZYLFxuICAgICAgcG9zRGlmZlk6IHBvc0RpZmZZXG4gICAgfTtcblxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VQYXJlbnRcIiwgcGFyYW0pOyAvLyBUaGlzIGFjdGlvbiBpcyByZWdpc3RlcmVkIGJ5IHVuZG9SZWRvIGV4dGVuc2lvblxuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50KG5vZGVzLCBwYXJlbnRJZCwgcG9zRGlmZlgsIHBvc0RpZmZZKTtcbiAgfVxufTtcblxuLypcbiAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxuICogaW4gdGhlIGNvbXBsZXguIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSB0aGUgc2FtZSBmdW5jdGlvbiBpbiBlbGVtZW50VXRpbGl0aWVzXG4gKi9cbm1haW5VdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKSB7XG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbih0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICB0ZW1wbGF0ZVR5cGU6IHRlbXBsYXRlVHlwZSxcbiAgICAgIG1hY3JvbW9sZWN1bGVMaXN0OiBtYWNyb21vbGVjdWxlTGlzdCxcbiAgICAgIGNvbXBsZXhOYW1lOiBjb21wbGV4TmFtZSxcbiAgICAgIHByb2Nlc3NQb3NpdGlvbjogcHJvY2Vzc1Bvc2l0aW9uLFxuICAgICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXG4gICAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXG4gICAgICBlZGdlTGVuZ3RoOiBlZGdlTGVuZ3RoXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlVGVtcGxhdGVSZWFjdGlvblwiLCBwYXJhbSk7XG4gIH1cbn07XG5cbi8qXG4gKiBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuIFxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbykge1xuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgdXNlQXNwZWN0UmF0aW86IHVzZUFzcGVjdFJhdGlvLFxuICAgICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZVxuICAgIH07XG4gICAgXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInJlc2l6ZU5vZGVzXCIsIHBhcmFtKTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbyk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vKlxuICogQ2hhbmdlcyB0aGUgbGFiZWwgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBsYWJlbC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqL1xubWFpblV0aWxpdGllcy5jaGFuZ2VOb2RlTGFiZWwgPSBmdW5jdGlvbihub2RlcywgbGFiZWwpIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBsYWJlbCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgfTtcbiAgICBcbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlTm9kZUxhYmVsXCIsIHBhcmFtKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIGZvciBnaXZlbiBub2RlcyB1c2UgdGhlIGdpdmVuIGZvbnQgZGF0YS5cbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbihlbGVzLCBkYXRhKSB7XG4gIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICB2YXIgcGFyYW0gPSB7XG4gICAgICBlbGVzOiBlbGVzLFxuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgIH07XG5cbiAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgcGFyYW0pO1xuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgZGF0YSk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vKlxuICogQ2hhbmdlIHN0YXRlIHZhbHVlIG9yIHVuaXQgb2YgaW5mb3JtYXRpb24gYm94IG9mIGdpdmVuIG5vZGVzIHdpdGggZ2l2ZW4gaW5kZXguXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHBhcmFtZXRlcnMgc2VlIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3hcbiAqL1xubWFpblV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uKG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3gobm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXG4vLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxuLy8gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2Rlcywgb2JqKSB7XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgb2JqOiBvYmosXG4gICAgICBub2Rlczogbm9kZXNcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XG4gIH1cbiAgXG4gIGN5LnN0eWxlKCkudXBkYXRlKCk7XG59O1xuXG4vLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxuLy8gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbm1haW5VdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgpIHtcbiAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgIG5vZGVzOiBub2Rlc1xuICAgIH07XG5cbiAgICBjeS51bmRvUmVkbygpLmRvKFwicmVtb3ZlU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLypcbiAqIFNldCBtdWx0aW1lciBzdGF0dXMgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXG4gKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24obm9kZXMsIHN0YXR1cykge1xuICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgfTtcblxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXRNdWx0aW1lclN0YXR1c1wiLCBwYXJhbSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBTZXQgY2xvbmUgbWFya2VyIHN0YXR1cyBvZiBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxuICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAqLyBcbm1haW5VdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbihub2Rlcywgc3RhdHVzKSB7XG4gIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgc3RhdHVzOiBzdGF0dXMsXG4gICAgICBub2Rlczogbm9kZXMsXG4gICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICB9O1xuXG4gICAgY3kudW5kb1JlZG8oKS5kbyhcInNldENsb25lTWFya2VyU3RhdHVzXCIsIHBhcmFtKTtcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLypcbiAqIENoYW5nZSBzdHlsZS9jc3Mgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gZ2l2ZW4gdmFsdWUvdmFsdWVzIChOb3RlIHRoYXQgdmFsdWVNYXAgcGFyYW1ldGVyIG1heSBiZVxuICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuY2hhbmdlQ3NzID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcbiAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyhlbGVzLCBuYW1lLCB2YWx1ZU1hcCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgZWxlczogZWxlcyxcbiAgICAgIHZhbHVlTWFwOiB2YWx1ZU1hcCxcbiAgICAgIG5hbWU6IG5hbWVcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VDc3NcIiwgcGFyYW0pO1xuICB9XG4gIFxuICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xufTtcblxuLypcbiAqIENoYW5nZSBkYXRhIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLmNoYW5nZURhdGEgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShlbGVzLCBuYW1lLCB2YWx1ZU1hcCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgZWxlczogZWxlcyxcbiAgICAgIHZhbHVlTWFwOiB2YWx1ZU1hcCxcbiAgICAgIG5hbWU6IG5hbWVcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VEYXRhXCIsIHBhcmFtKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbi8qXG4gKiBVbmhpZGUgZ2l2ZW4gZWxlcyAodGhlIG9uZXMgd2hpY2ggYXJlIGhpZGRlbiBpZiBhbnkpIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXG4gKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICovXG5tYWluVXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcbiAgdmFyIGhpZGRlbkVsZXMgPSBlbGVzLmZpbHRlcignOmhpZGRlbicpO1xuICBpZiAoaGlkZGVuRWxlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQoaGlkZGVuRWxlcywgbGF5b3V0cGFyYW0pO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBwYXJhbSA9IHtcbiAgICAgIGVsZXM6IGhpZGRlbkVsZXMsXG4gICAgICBsYXlvdXRwYXJhbTogbGF5b3V0cGFyYW0sXG4gICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCBwYXJhbSk7XG4gIH1cbn07XG5cbi8qXG4gKiBTZXRzIHRoZSBvcmRlcmluZyBvZiB0aGUgZ2l2ZW4gbm9kZXMuXG4gKiBPcmRlcmluZyBvcHRpb25zIGFyZSAnTC10by1SJywgJ1ItdG8tTCcsICdULXRvLUInLCAnQi10by1UJywgJ25vbmUnLlxuICogSWYgYSBub2RlIGRvZXMgbm90IGhhdmUgYW55IHBvcnQgYmVmb3JlIHRoZSBvcGVyYXRpb24gYW5kIGl0IGlzIHN1cHBvc2VkIHRvIGhhdmUgc29tZSBhZnRlciBvcGVyYXRpb24gdGhlIHBvcnREaXN0YW5jZSBwYXJhbWV0ZXIgaXMgXG4gKiB1c2VkIHRvIHNldCB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgbm9kZSBjZW50ZXIgYW5kIHRoZSBwb3J0cy4gVGhlIGRlZmF1bHQgcG9ydCBkaXN0YW5jZSBpcyA2MC5cbiAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gKi9cbm1haW5VdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyA9IGZ1bmN0aW9uIChub2Rlcywgb3JkZXJpbmcsIHBvcnREaXN0YW5jZSkge1xuICBpZiAoIG5vZGVzLmxlbmd0aCA9PT0gMCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhub2Rlcywgb3JkZXJpbmcsIHBvcnREaXN0YW5jZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIHBhcmFtID0ge1xuICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgb3JkZXJpbmc6IG9yZGVyaW5nLFxuICAgICAgcG9ydERpc3RhbmNlOiBwb3J0RGlzdGFuY2VcbiAgICB9O1xuICAgIFxuICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXRQb3J0c09yZGVyaW5nXCIsIHBhcmFtKTtcbiAgfVxuICBcbiAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWFpblV0aWxpdGllczsiLCIvKlxuICogIEV4dGVuZCBkZWZhdWx0IG9wdGlvbnMgYW5kIGdldCBjdXJyZW50IG9wdGlvbnMgYnkgdXNpbmcgdGhpcyBmaWxlIFxuICovXG5cbi8vIGRlZmF1bHQgb3B0aW9uc1xudmFyIGRlZmF1bHRzID0ge1xuICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgdGhlIGluZGV4IGh0bWwgXG4gIC8vIGZpbGUgYW5kIG5vZGVfbW9kdWxlcyBhcmUgdW5kZXIgdGhlIHNhbWUgZm9sZGVyIHRoZW4gdXNpbmcgdGhlIGRlZmF1bHQgdmFsdWUgaXMgZmluZVxuICBpbWdQYXRoOiAnbm9kZV9tb2R1bGVzL3NiZ252aXovc3JjL2ltZycsXG4gIC8vIFdoZXRoZXIgdG8gZml0IGxhYmVscyB0byBub2Rlc1xuICBmaXRMYWJlbHNUb05vZGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICAvLyBkeW5hbWljIGxhYmVsIHNpemUgaXQgbWF5IGJlICdzbWFsbCcsICdyZWd1bGFyJywgJ2xhcmdlJ1xuICBkeW5hbWljTGFiZWxTaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICdyZWd1bGFyJztcbiAgfSxcbiAgLy8gcGVyY2VudGFnZSB1c2VkIHRvIGNhbGN1bGF0ZSBjb21wb3VuZCBwYWRkaW5nc1xuICBjb21wb3VuZFBhZGRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gMTA7XG4gIH0sXG4gIC8vIFdoZXRoZXIgdG8gYWRqdXN0IG5vZGUgbGFiZWwgZm9udCBzaXplIGF1dG9tYXRpY2FsbHkuXG4gIC8vIElmIHRoaXMgb3B0aW9uIHJldHVybiBmYWxzZSBkbyBub3QgYWRqdXN0IGxhYmVsIHNpemVzIGFjY29yZGluZyB0byBub2RlIGhlaWdodCB1c2VzIG5vZGUuZGF0YSgnZm9udC1zaXplJylcbiAgLy8gaW5zdGVhZCBvZiBkb2luZyBpdC5cbiAgYWRqdXN0Tm9kZUxhYmVsRm9udFNpemVBdXRvbWF0aWNhbGx5OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgLy8gVGhlIHNlbGVjdG9yIG9mIHRoZSBjb21wb25lbnQgY29udGFpbmluZyB0aGUgc2JnbiBuZXR3b3JrXG4gIG5ldHdvcmtDb250YWluZXJTZWxlY3RvcjogJyNzYmduLW5ldHdvcmstY29udGFpbmVyJyxcbiAgLy8gV2hldGhlciB0aGUgYWN0aW9ucyBhcmUgdW5kb2FibGUsIHJlcXVpcmVzIGN5dG9zY2FwZS11bmRvLXJlZG8gZXh0ZW5zaW9uXG4gIHVuZG9hYmxlOiB0cnVlLFxuICAvLyBXaGV0aGVyIHRvIGhhdmUgdW5kb2FibGUgZHJhZyBmZWF0dXJlIGluIHVuZG8vcmVkbyBleHRlbnNpb24uIFRoaXMgb3B0aW9ucyB3aWxsIGJlIHBhc3NlZCB0byB1bmRvL3JlZG8gZXh0ZW5zaW9uXG4gIHVuZG9hYmxlRHJhZzogdHJ1ZVxufTtcblxudmFyIG9wdGlvblV0aWxpdGllcyA9IGZ1bmN0aW9uICgpIHtcbn07XG5cbi8vIEV4dGVuZCB0aGUgZGVmYXVsdHMgb3B0aW9ucyB3aXRoIHRoZSB1c2VyIG9wdGlvbnNcbm9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIGZvciAodmFyIHByb3AgaW4gZGVmYXVsdHMpIHtcbiAgICByZXN1bHRbcHJvcF0gPSBkZWZhdWx0c1twcm9wXTtcbiAgfVxuICBcbiAgZm9yICh2YXIgcHJvcCBpbiBvcHRpb25zKSB7XG4gICAgcmVzdWx0W3Byb3BdID0gb3B0aW9uc1twcm9wXTtcbiAgfVxuXG4gIG9wdGlvblV0aWxpdGllcy5vcHRpb25zID0gcmVzdWx0O1xuXG4gIHJldHVybiBvcHRpb25zO1xufTtcblxub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBvcHRpb25VdGlsaXRpZXMub3B0aW9ucztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gb3B0aW9uVXRpbGl0aWVzOyIsInZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vdW5kby1yZWRvLWFjdGlvbi1mdW5jdGlvbnMnKTtcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIG9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbi11dGlsaXRpZXMnKS5nZXRPcHRpb25zKCk7XG52YXIgJCA9IGxpYnMualF1ZXJ5O1xuXG52YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSBmdW5jdGlvbiAodW5kb2FibGVEcmFnKSB7XG4gIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBjcmVhdGUgdW5kby1yZWRvIGluc3RhbmNlXG4gIHZhciB1ciA9IGN5LnVuZG9SZWRvKHtcbiAgICB1bmRvYWJsZURyYWc6IHVuZG9hYmxlRHJhZ1xuICB9KTtcblxuICAvLyByZWdpc3RlciBhZGQgcmVtb3ZlIGFjdGlvbnNcbiAgdXIuYWN0aW9uKFwiYWRkTm9kZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGROb2RlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XG4gIHVyLmFjdGlvbihcImFkZEVkZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gIHVyLmFjdGlvbihcImFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NtYXJ0XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTbWFydCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xuICB1ci5hY3Rpb24oXCJjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMpO1xuXG4gIC8vIHJlZ2lzdGVyIGdlbmVyYWwgYWN0aW9uc1xuICB1ci5hY3Rpb24oXCJyZXNpemVOb2Rlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VOb2RlTGFiZWxcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VEYXRhXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VDc3NcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VCZW5kUG9pbnRzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMpO1xuICB1ci5hY3Rpb24oXCJjaGFuZ2VGb250UHJvcGVydGllc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMpO1xuICB1ci5hY3Rpb24oXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUxheW91dCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtTGF5b3V0KTtcblxuICAvLyByZWdpc3RlciBTQkdOIGFjdGlvbnNcbiAgdXIuYWN0aW9uKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94KTtcbiAgdXIuYWN0aW9uKFwiY2hhbmdlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94KTtcbiAgdXIuYWN0aW9uKFwic2V0TXVsdGltZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzKTtcbiAgdXIuYWN0aW9uKFwic2V0Q2xvbmVNYXJrZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzKTtcbiAgdXIuYWN0aW9uKFwicmVtb3ZlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94KTtcbiAgdXIuYWN0aW9uKFwic2V0UG9ydHNPcmRlcmluZ1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRQb3J0c09yZGVyaW5nLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRQb3J0c09yZGVyaW5nKTtcbiAgXG4gIC8vIHJlZ2lzdGVyIGVhc3kgY3JlYXRpb24gYWN0aW9uc1xuICB1ci5hY3Rpb24oXCJjcmVhdGVUZW1wbGF0ZVJlYWN0aW9uXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24sIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuXG4gIHVyLmFjdGlvbihcInNldERlZmF1bHRQcm9wZXJ0eVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXREZWZhdWx0UHJvcGVydHksIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldERlZmF1bHRQcm9wZXJ0eSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVuZG9hYmxlRHJhZykge1xuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyh1bmRvYWJsZURyYWcpO1xuICB9KTtcbn07IiwiLy8gRXh0ZW5kcyBzYmdudml6LnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBzYmdudml6ID0gbGlicy5zYmdudml6O1xudmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcbnZhciBlbGVtZW50VXRpbGl0aWVzID0gcmVxdWlyZSgnLi9lbGVtZW50LXV0aWxpdGllcycpO1xuXG4vLyBTZWN0aW9uIFN0YXJ0XG4vLyBhZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkTm9kZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgdmFyIG5ld05vZGUgPSBwYXJhbS5uZXdOb2RlO1xuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShuZXdOb2RlLngsIG5ld05vZGUueSwgbmV3Tm9kZS5jbGFzcywgbmV3Tm9kZS5pZCwgbmV3Tm9kZS5wYXJlbnQsIG5ld05vZGUudmlzaWJpbGl0eSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVsZXM6IHJlc3VsdFxuICB9O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgdmFyIG5ld0VkZ2UgPSBwYXJhbS5uZXdFZGdlO1xuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdFZGdlLnNvdXJjZSwgbmV3RWRnZS50YXJnZXQsIG5ld0VkZ2UuY2xhc3MsIG5ld0VkZ2UuaWQsIG5ld0VkZ2UudmlzaWJpbGl0eSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVsZXM6IHJlc3VsdFxuICB9O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMgPSBmdW5jdGlvbihwYXJhbSkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyhwYXJhbS5zb3VyY2UsIHBhcmFtLnRhcmdldCwgcGFyYW0ucHJvY2Vzc1R5cGUpO1xuICB9XG4gIGVsc2Uge1xuICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBlbGVzOiByZXN1bHRcbiAgfTtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0ge307XG5cbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgIC8vIE5vZGVzIHRvIG1ha2UgY29tcG91bmQsIHRoZWlyIGRlc2NlbmRhbnRzIGFuZCBlZGdlcyBjb25uZWN0ZWQgdG8gdGhlbSB3aWxsIGJlIHJlbW92ZWQgZHVyaW5nIGNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyBvcGVyYXRpb25cbiAgICAvLyAoaW50ZXJuYWxseSBieSBlbGVzLm1vdmUoKSBvcGVyYXRpb24pLCBzbyBtYXJrIHRoZW0gYXMgcmVtb3ZlZCBlbGVzIGZvciB1bmRvIG9wZXJhdGlvbi5cbiAgICB2YXIgbm9kZXNUb01ha2VDb21wb3VuZCA9IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQ7XG4gICAgdmFyIHJlbW92ZWRFbGVzID0gbm9kZXNUb01ha2VDb21wb3VuZC51bmlvbihub2Rlc1RvTWFrZUNvbXBvdW5kLmRlc2NlbmRhbnRzKCkpO1xuICAgIHJlbW92ZWRFbGVzID0gcmVtb3ZlZEVsZXMudW5pb24ocmVtb3ZlZEVsZXMuY29ubmVjdGVkRWRnZXMoKSk7XG4gICAgcmVzdWx0LnJlbW92ZWRFbGVzID0gcmVtb3ZlZEVsZXM7XG4gICAgLy8gQXNzdW1lIHRoYXQgYWxsIG5vZGVzIHRvIG1ha2UgY29tcG91bmQgaGF2ZSB0aGUgc2FtZSBwYXJlbnRcbiAgICB2YXIgb2xkUGFyZW50SWQgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJwYXJlbnRcIik7XG4gICAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZFxuICAgIC8vIE5ldyBlbGVzIGluY2x1ZGVzIG5ldyBjb21wb3VuZCBhbmQgdGhlIG1vdmVkIGVsZXMgYW5kIHdpbGwgYmUgdXNlZCBpbiB1bmRvIG9wZXJhdGlvbi5cbiAgICByZXN1bHQubmV3RWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKG5vZGVzVG9NYWtlQ29tcG91bmQsIHBhcmFtLmNvbXBvdW5kVHlwZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmVzdWx0LnJlbW92ZWRFbGVzID0gcGFyYW0ubmV3RWxlcy5yZW1vdmUoKTtcbiAgICByZXN1bHQubmV3RWxlcyA9IHBhcmFtLnJlbW92ZWRFbGVzLnJlc3RvcmUoKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBTZWN0aW9uIEVuZFxuLy8gYWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXG5cbi8vIFNlY3Rpb24gU3RhcnRcbi8vIGVhc3kgY3JlYXRpb24gYWN0aW9uIGZ1bmN0aW9uc1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XG4gIHZhciBlbGVzO1xuXG4gIGlmIChmaXJzdFRpbWUpIHtcbiAgICBlbGVzID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uKHBhcmFtLnRlbXBsYXRlVHlwZSwgcGFyYW0ubWFjcm9tb2xlY3VsZUxpc3QsIHBhcmFtLmNvbXBsZXhOYW1lLCBwYXJhbS5wcm9jZXNzUG9zaXRpb24sIHBhcmFtLnRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgcGFyYW0udGlsaW5nUGFkZGluZ0hvcml6b250YWwsIHBhcmFtLmVkZ2VMZW5ndGgpXG4gIH1cbiAgZWxzZSB7XG4gICAgZWxlcyA9IHBhcmFtO1xuICAgIGN5LmFkZChlbGVzKTtcbiAgICBcbiAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgZWxlcy5zZWxlY3QoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZWxlczogZWxlc1xuICB9O1xufTtcblxuLy8gU2VjdGlvbiBFbmRcbi8vIGVhc3kgY3JlYXRpb24gYWN0aW9uIGZ1bmN0aW9uc1xuXG4vLyBTZWN0aW9uIFN0YXJ0XG4vLyBnZW5lcmFsIGFjdGlvbiBmdW5jdGlvbnNcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHBvc2l0aW9ucyA9IHt9O1xuICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xuICBcbiAgbm9kZXMuZWFjaChmdW5jdGlvbihlbGUsIGkpIHtcbiAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XG4gICAgICBlbGUgPSBpO1xuICAgIH1cbiAgICBcbiAgICBwb3NpdGlvbnNbZWxlLmlkKCldID0ge1xuICAgICAgeDogZWxlLnBvc2l0aW9uKFwieFwiKSxcbiAgICAgIHk6IGVsZS5wb3NpdGlvbihcInlcIilcbiAgICB9O1xuICB9KTtcblxuICByZXR1cm4gcG9zaXRpb25zO1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMgPSBmdW5jdGlvbiAocG9zaXRpb25zKSB7XG4gIHZhciBjdXJyZW50UG9zaXRpb25zID0ge307XG4gIGN5Lm5vZGVzKCkucG9zaXRpb25zKGZ1bmN0aW9uIChlbGUsIGkpIHtcbiAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XG4gICAgICBlbGUgPSBpO1xuICAgIH1cbiAgICBcbiAgICBjdXJyZW50UG9zaXRpb25zW2VsZS5pZCgpXSA9IHtcbiAgICAgIHg6IGVsZS5wb3NpdGlvbihcInhcIiksXG4gICAgICB5OiBlbGUucG9zaXRpb24oXCJ5XCIpXG4gICAgfTtcbiAgICBcbiAgICB2YXIgcG9zID0gcG9zaXRpb25zW2VsZS5pZCgpXTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogcG9zLngsXG4gICAgICB5OiBwb3MueVxuICAgIH07XG4gIH0pO1xuXG4gIHJldHVybiBjdXJyZW50UG9zaXRpb25zO1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBwZXJmb3JtT3BlcmF0aW9uOiB0cnVlXG4gIH07XG5cbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG5cbiAgcmVzdWx0LnNpemVNYXAgPSB7fTtcbiAgcmVzdWx0LnVzZUFzcGVjdFJhdGlvID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgcmVzdWx0LnNpemVNYXBbbm9kZS5pZCgpXSA9IHtcbiAgICAgIHc6IG5vZGUud2lkdGgoKSxcbiAgICAgIGg6IG5vZGUuaGVpZ2h0KClcbiAgICB9O1xuICB9XG5cbiAgcmVzdWx0Lm5vZGVzID0gbm9kZXM7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG5cbiAgICBpZiAocGFyYW0ucGVyZm9ybU9wZXJhdGlvbikge1xuICAgICAgaWYgKHBhcmFtLnNpemVNYXApIHtcbiAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLnc7XG4gICAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5oO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMocGFyYW0ubm9kZXMsIHBhcmFtLndpZHRoLCBwYXJhbS5oZWlnaHQsIHBhcmFtLnVzZUFzcGVjdFJhdGlvKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciByZXN1bHQgPSB7XG4gIH07XG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICByZXN1bHQubm9kZXMgPSBub2RlcztcbiAgcmVzdWx0LmxhYmVsID0ge307XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgcmVzdWx0LmxhYmVsW25vZGUuaWQoKV0gPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG4gIH1cblxuICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBwYXJhbS5sYWJlbCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgIG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbCA9IHBhcmFtLmxhYmVsW25vZGUuaWQoKV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgfTtcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuICByZXN1bHQubmFtZSA9IHBhcmFtLm5hbWU7XG4gIHJlc3VsdC52YWx1ZU1hcCA9IHt9O1xuICByZXN1bHQuZWxlcyA9IGVsZXM7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGVsZSA9IGVsZXNbaV07XG4gICAgcmVzdWx0LnZhbHVlTWFwW2VsZS5pZCgpXSA9IGVsZS5kYXRhKHBhcmFtLm5hbWUpO1xuICB9XG5cbiAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKHBhcmFtLmVsZXMsIHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlTWFwKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciByZXN1bHQgPSB7XG4gIH07XG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcbiAgcmVzdWx0Lm5hbWUgPSBwYXJhbS5uYW1lO1xuICByZXN1bHQudmFsdWVNYXAgPSB7fTtcbiAgcmVzdWx0LmVsZXMgPSBlbGVzO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuICAgIHJlc3VsdC52YWx1ZU1hcFtlbGUuaWQoKV0gPSBlbGUuY3NzKHBhcmFtLm5hbWUpO1xuICB9XG5cbiAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VDc3MocGFyYW0uZWxlcywgcGFyYW0ubmFtZSwgcGFyYW0udmFsdWVNYXApO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgcmVzdWx0ID0ge1xuICB9O1xuXG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcbiAgcmVzdWx0LmRhdGEgPSB7fTtcbiAgcmVzdWx0LmVsZXMgPSBlbGVzO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuXG4gICAgcmVzdWx0LmRhdGFbZWxlLmlkKCldID0ge307XG5cbiAgICB2YXIgZGF0YSA9IHBhcmFtLmZpcnN0VGltZSA/IHBhcmFtLmRhdGEgOiBwYXJhbS5kYXRhW2VsZS5pZCgpXTtcblxuICAgIGZvciAodmFyIHByb3AgaW4gZGF0YSkge1xuICAgICAgcmVzdWx0LmRhdGFbZWxlLmlkKCldW3Byb3BdID0gZWxlLmRhdGEocHJvcCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgZGF0YSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICAgIFxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyhlbGUsIGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKlxuICogU2hvdyBlbGVzIGFuZCBwZXJmb3JtIGxheW91dC5cbiAqL1xudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gIHZhciByZXN1bHQgPSB7fTtcbiAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcbiAgXG4gIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICByZXN1bHQuZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQocGFyYW0uZWxlcywgcGFyYW0ubGF5b3V0cGFyYW0pO1xuICB9XG4gIGVsc2Uge1xuICAgIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgZ2l2ZW4gZWxlc1xuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciBlbGVzID0gcGFyYW0uZWxlcztcblxuICB2YXIgcmVzdWx0ID0ge307XG4gIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XG4gIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLmhpZGUoZWxlcyk7IC8vIEhpZGUgcHJldmlvdXNseSB1bmhpZGRlbiBlbGVzO1xuXG4gIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIFNlY3Rpb24gRW5kXG4vLyBnZW5lcmFsIGFjdGlvbiBmdW5jdGlvbnNcblxuLy8gU2VjdGlvbiBTdGFydFxuLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gIHZhciByZXN1bHQgPSB7XG4gIH07XG4gIHJlc3VsdC50eXBlID0gcGFyYW0udHlwZTtcbiAgcmVzdWx0Lm5vZGVzID0gcGFyYW0ubm9kZXM7XG4gIHJlc3VsdC5pbmRleCA9IHBhcmFtLmluZGV4O1xuXG4gIHJlc3VsdC52YWx1ZSA9IGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3gocGFyYW0ubm9kZXMsIHBhcmFtLmluZGV4LCBwYXJhbS52YWx1ZSwgcGFyYW0udHlwZSk7XG5cbiAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIG9iaiA9IHBhcmFtLm9iajtcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG5cbiAgdmFyIGluZGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChub2Rlcywgb2JqKTtcblxuICBjeS5mb3JjZVJlbmRlcigpO1xuXG4gIHZhciByZXN1bHQgPSB7XG4gICAgbm9kZXM6IG5vZGVzLFxuICAgIGluZGV4OiBpbmRleCxcbiAgICBvYmo6IG9ialxuICB9O1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIGluZGV4ID0gcGFyYW0uaW5kZXg7XG4gIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuXG4gIHZhciBvYmogPSBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94KG5vZGVzLCBpbmRleCk7XG5cbiAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICB2YXIgcmVzdWx0ID0ge1xuICAgIG5vZGVzOiBub2RlcyxcbiAgICBvYmo6IG9ialxuICB9O1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG4gIHZhciBzdGF0dXMgPSBwYXJhbS5zdGF0dXM7XG4gIHZhciByZXN1bHRTdGF0dXMgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICB2YXIgaXNNdWx0aW1lciA9IG5vZGUuZGF0YSgnY2xhc3MnKS5lbmRzV2l0aCgnIG11bHRpbWVyJyk7XG5cbiAgICByZXN1bHRTdGF0dXNbbm9kZS5pZCgpXSA9IGlzTXVsdGltZXI7XG4gIH1cblxuICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIGNoYW5nZSB0aGUgc3RhdHVzIG9mIGFsbCBub2RlcyBhdCBvbmNlLlxuICAvLyBJZiBub3QgY2hhbmdlIHN0YXR1cyBvZiBlYWNoIHNlcGVyYXRlbHkgdG8gdGhlIHZhbHVlcyBtYXBwZWQgdG8gdGhlaXIgaWQuXG4gIGlmIChmaXJzdFRpbWUpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xuICB9XG4gIGVsc2Uge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGUsIHN0YXR1c1tub2RlLmlkKCldKTtcbiAgICB9XG4gIH1cblxuLy8gIGlmICghZmlyc3RUaW1lICYmIF8uaXNFcXVhbChub2RlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xuLy8gICAgJCgnI2luc3BlY3Rvci1pcy1tdWx0aW1lcicpLmF0dHIoXCJjaGVja2VkXCIsICEkKCcjaW5zcGVjdG9yLWlzLW11bHRpbWVyJykuYXR0cihcImNoZWNrZWRcIikpO1xuLy8gIH1cblxuICB2YXIgcmVzdWx0ID0ge1xuICAgIHN0YXR1czogcmVzdWx0U3RhdHVzLFxuICAgIG5vZGVzOiBub2Rlc1xuICB9O1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgdmFyIHN0YXR1cyA9IHBhcmFtLnN0YXR1cztcbiAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgdmFyIHJlc3VsdFN0YXR1cyA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIHJlc3VsdFN0YXR1c1tub2RlLmlkKCldID0gbm9kZS5kYXRhKCdjbG9uZW1hcmtlcicpO1xuICAgIHZhciBjdXJyZW50U3RhdHVzID0gZmlyc3RUaW1lID8gc3RhdHVzIDogc3RhdHVzW25vZGUuaWQoKV07XG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhub2RlLCBjdXJyZW50U3RhdHVzKTtcbiAgfVxuXG4vLyAgaWYgKCFmaXJzdFRpbWUgJiYgXy5pc0VxdWFsKG5vZGVzLCBjeS5ub2RlcygnOnNlbGVjdGVkJykpKSB7XG4vLyAgICAkKCcjaW5zcGVjdG9yLWlzLWNsb25lLW1hcmtlcicpLmF0dHIoXCJjaGVja2VkXCIsICEkKCcjaW5zcGVjdG9yLWlzLWNsb25lLW1hcmtlcicpLmF0dHIoXCJjaGVja2VkXCIpKTtcbi8vICB9XG5cbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBzdGF0dXM6IHJlc3VsdFN0YXR1cyxcbiAgICBub2Rlczogbm9kZXNcbiAgfTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLy8gcGFyYW06IHtjbGFzczogc2JnbmNsYXNzLCBuYW1lOiBwcm9wZXJ0eU5hbWUsIHZhbHVlOiB2YWx1ZX1cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldERlZmF1bHRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICB2YXIgc2JnbmNsYXNzID0gcGFyYW0uY2xhc3M7XG4gIHZhciBuYW1lID0gcGFyYW0ubmFtZTtcbiAgdmFyIHZhbHVlID0gcGFyYW0udmFsdWU7XG4gIHZhciBjbGFzc0RlZmF1bHRzID0gZWxlbWVudFV0aWxpdGllcy5kZWZhdWx0UHJvcGVydGllc1tzYmduY2xhc3NdO1xuICB2YXIgcmVzdWx0ID0ge1xuICAgIGNsYXNzOiBzYmduY2xhc3MsXG4gICAgbmFtZTogbmFtZSxcbiAgICB2YWx1ZTogY2xhc3NEZWZhdWx0cy5oYXNPd25Qcm9wZXJ0eShuYW1lKSA/IGNsYXNzRGVmYXVsdHNbbmFtZV0gOiB1bmRlZmluZWRcbiAgfTtcblxuICBjbGFzc0RlZmF1bHRzW25hbWVdID0gdmFsdWU7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldFBvcnRzT3JkZXJpbmcgPSBmdW5jdGlvbihwYXJhbSkge1xuICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgdmFyIG9yZGVyaW5nID0gcGFyYW0ub3JkZXJpbmc7XG4gIHZhciBwb3J0RGlzdGFuY2UgPSBwYXJhbS5wb3J0RGlzdGFuY2U7XG4gIHZhciBjb25uZWN0ZWRFZGdlcyA9IG5vZGVzLmNvbm5lY3RlZEVkZ2VzKCk7XG4gIHZhciBub2RlUHJvcE1hcCA9IHt9OyAvLyBOb2RlIHByb3AgbWFwIGZvciBjdXJyZW50IHN0YXR1cyBvZiB0aGUgbm9kZXMgaXQgaXMgdG8gYmUgYXR0YWNoZWQgdG8gdGhlIHJlc3VsdCBtYXAuIEl0IGluY2x1ZGVzIG5vZGUgY3VycmVudCBwb3J0IG9yZGVyaW5nIGFuZCBjdXJyZW50IHBvcnRzLlxuICB2YXIgZWRnZVByb3BNYXAgPSB7fTsgLy8gRWRnZSBwcm9wIG1hcCBmb3IgY3VycmVudCBzdGF0dXMgb2YgdGhlIG5vZGVzIGl0IGlzIHRvIGJlIGF0dGFjaGVkIHRvIHRoZSByZXN1bHQgbWFwLiBJdCBpbmNsdWRlcyBlZGdlIHBvcnRzb3VyY2UgYW5kIHBvcnR0YXJnZXQuXG4gIFxuICAvLyBGaWxsIG5vZGUvZWRnZSBwcm9wIG1hcHMgZm9yIHVuZG8vcmVkbyBhY3Rpb25zXG4gIFxuICAvLyBOb2RlIHByb3AgbWFwIGluY2x1ZGVzIGEgY29weSBvZiBub2RlIHBvcnRzXG4gIGZvciAoIHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrICkge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgdmFyIHBvcnRzID0gbm9kZS5kYXRhKCdwb3J0cycpO1xuICAgIHZhciBjdXJyZW50T3JkZXJpbmcgPSBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXMuZ2V0UG9ydHNPcmRlcmluZyhub2RlKTsgLy8gR2V0IHRoZSBjdXJyZW50IG5vZGUgcG9ydHMgb3JkZXJpbmdcbiAgICB2YXIgcG9ydHNDb3B5ID0gcG9ydHMubGVuZ3RoID09PSAyID8gWyB7IGlkOiBwb3J0c1swXS5pZCwgeDogcG9ydHNbMF0ueCwgeTogcG9ydHNbMF0ueSB9LCB7IGlkOiBwb3J0c1sxXS5pZCwgeDogcG9ydHNbMV0ueCwgeTogcG9ydHNbMV0ueSB9IF0gOiBbXTtcbiAgICBub2RlUHJvcE1hcFtub2RlLmlkKCldID0geyBvcmRlcmluZzogY3VycmVudE9yZGVyaW5nLCBwb3J0czogcG9ydHNDb3B5IH07XG4gIH1cbiAgXG4gIC8vIE5vZGUgcHJvcCBtYXAgaW5jbHVkZXMgZWRnZSBwb3J0c291cmNlIGFuZCBwb3J0dGFyZ2V0XG4gIGZvciAoIHZhciBpID0gMDsgaSA8IGNvbm5lY3RlZEVkZ2VzLmxlbmd0aDsgaSsrICkge1xuICAgIHZhciBlZGdlID0gY29ubmVjdGVkRWRnZXNbaV07XG4gICAgZWRnZVByb3BNYXBbZWRnZS5pZCgpXSA9IHsgcG9ydHNvdXJjZTogZWRnZS5kYXRhKCdwb3J0c291cmNlJyksIHBvcnR0YXJnZXQ6IGVkZ2UuZGF0YSgncG9ydHRhcmdldCcpIH07XG4gIH1cbiAgXG4gIHZhciByZXN1bHQgPSB7XG4gICAgbm9kZXM6IG5vZGVzLFxuICAgIG5vZGVQcm9wTWFwOiBub2RlUHJvcE1hcCxcbiAgICBlZGdlUHJvcE1hcDogZWRnZVByb3BNYXBcbiAgfTtcbiAgXG4gIC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IHRpbWUgY2FsbCByZWxhdGVkIG1ldGhvZCBmcm9tIGVsZW1lbnQgdXRpbGl0aWVzIGVsc2UgZ28gYmFjayB0byB0aGUgc3RvcmVkIHByb3BzIG9mIG5vZGVzL2VkZ2VzXG4gIGlmICggcGFyYW0uZmlyc3RUaW1lICkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhub2Rlcywgb3JkZXJpbmcsIHBvcnREaXN0YW5jZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgIFxuICAgIC8vIEdvIGJhY2sgdG8gc3RvcmVkIG5vZGUgcG9ydHMgc3RhdGVcbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICB2YXIgcG9ydHNUb1JldHVybiA9IHBhcmFtLm5vZGVQcm9wTWFwW25vZGUuaWQoKV0ucG9ydHM7XG4gICAgICB2YXIgb3JkZXJpbmdzVG9SZXR1cm4gPSBwYXJhbS5ub2RlUHJvcE1hcFtub2RlLmlkKCldLm9yZGVyaW5nO1xuICAgICAgbm9kZS5kYXRhKCdwb3J0cycsIHBvcnRzVG9SZXR1cm4pO1xuICAgICAgbm9kZS5kYXRhKCdwb3J0c29yZGVyaW5nJywgb3JkZXJpbmdzVG9SZXR1cm4pOyAvLyBVcGRhdGUgdGhlIGNhY2hlZCBwb3J0cyBvcmRlcmluZ1xuICAgIH1cbiAgICBcbiAgICAvLyBHbyBiYWNrIHRvIHN0b3JlZCBlZGdlIHBvcnRzb3VyY2UvcG9ydHRhcmdldHMgc3RhdGVcbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBjb25uZWN0ZWRFZGdlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIHZhciBlZGdlID0gY29ubmVjdGVkRWRnZXNbaV07XG4gICAgICB2YXIgcHJvcHMgPSBwYXJhbS5lZGdlUHJvcE1hcFtlZGdlLmlkKCldO1xuICAgICAgZWRnZS5kYXRhKCdwb3J0c291cmNlJywgcHJvcHMucG9ydHNvdXJjZSk7XG4gICAgICBlZGdlLmRhdGEoJ3BvcnR0YXJnZXQnLCBwcm9wcy5wb3J0dGFyZ2V0KTtcbiAgICB9XG4gICAgXG4gICAgY3kuZW5kQmF0Y2goKTtcbiAgfVxuICBcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIFNlY3Rpb24gRW5kXG4vLyBzYmduIGFjdGlvbiBmdW5jdGlvbnNcblxubW9kdWxlLmV4cG9ydHMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9uczsiXX0=
