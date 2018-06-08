// Extends sbgnviz.elementUtilities
var libs = require('./lib-utilities').getLibs();
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

    //For reversible reactions both side of the process can be input/output
    //Group ID identifies to which group of nodes the edge is going to be connected for reversible reactions(0: group 1 ID and 1:group 2 ID)
    elementUtilities.addEdge = function (source, target, edgeParams, id, visibility, groupID ) {
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

      if(elementUtilities.canHaveSBGNCardinality(sbgnclass)){
        data.cardinality = 0;
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
          if(groupID == 0 || groupID == undefined) // groupID 0 for reversible reactions group 0
            portsource = sourceNodeOutputPortId;
          else { //if reaction is reversible and edge belongs to group 1
            portsource = sourceNodeInputPortId;
          }
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
     * nodeList: The list of the names and types of molecules which will involve in the reaction.
     * complexName: The name of the complex in the reaction.
     * processPosition: The modal position of the process in the reaction. The default value is the center of the canvas.
     * tilingPaddingVertical: This option will be passed to the cose-bilkent layout with the same name. The default value is 15.
     * tilingPaddingHorizontal: This option will be passed to the cose-bilkent layout with the same name. The default value is 15.
     * edgeLength: The distance between the process and the macromolecules at the both sides.
     */
    elementUtilities.createTemplateReaction = function (templateType, nodeList, complexName, processPosition, tilingPaddingVertical, tilingPaddingHorizontal, edgeLength) {

      var defaultMacromoleculProperties = elementUtilities.defaultProperties["macromolecule"];
      var defaultSimpleChemicalProperties = elementUtilities.defaultProperties["simple chemical"];
      var templateType = templateType;
      var processWidth = elementUtilities.defaultProperties[templateType] ? elementUtilities.defaultProperties[templateType].width : 50;
      var macromoleculeWidth = defaultMacromoleculProperties ? defaultMacromoleculProperties.width : 50;
      var macromoleculeHeight = defaultMacromoleculProperties ? defaultMacromoleculProperties.height : 50;
      var simpleChemicalWidth = defaultSimpleChemicalProperties ? defaultSimpleChemicalProperties.width : 35;
      var simpleChemicalHeight = defaultSimpleChemicalProperties ? defaultSimpleChemicalProperties.height : 35;
      var processPosition = processPosition ? processPosition : elementUtilities.convertToModelPosition({x: cy.width() / 2, y: cy.height() / 2});
      var nodeList = nodeList;
      var complexName = complexName;
      var numOfMolecules = nodeList.length;
      var tilingPaddingVertical = tilingPaddingVertical ? tilingPaddingVertical : 15;
      var tilingPaddingHorizontal = tilingPaddingHorizontal ? tilingPaddingHorizontal : 15;
      var edgeLength = edgeLength ? edgeLength : 60;

      cy.startBatch();

      var xPositionOfFreeMacromolecules;
      var xPositionOfInputMacromolecules;

      if (templateType === 'association') {
        xPositionOfFreeMacromolecules = processPosition.x - edgeLength - processWidth / 2 - macromoleculeWidth / 2;
      }
      else if(templateType === 'dissociation'){
        xPositionOfFreeMacromolecules = processPosition.x + edgeLength + processWidth / 2 + macromoleculeWidth / 2;
      }
      else{
        elementUtilities.setMapType("Unknown");
        xPositionOfFreeMacromolecules = processPosition.x - edgeLength - processWidth / 2 - macromoleculeWidth / 2;
        xPositionOfInputMacromolecules = processPosition.x + edgeLength + processWidth / 2 + macromoleculeWidth / 2;
      }

      //Create the process in template type
      var process;
      if (templateType === 'reversible') {
        process = elementUtilities.addNode(processPosition.x, processPosition.y, "process");
        elementUtilities.setPortsOrdering(process, 'L-to-R')
      }
      else{
        process = elementUtilities.addNode(processPosition.x, processPosition.y, templateType);
      }
      process.data('justAdded', true);

      //Define the starting y position
      var yPosition = processPosition.y - ((numOfMolecules - 1) / 2) * (macromoleculeHeight + tilingPaddingVertical);

      //Create the free molecules
      for (var i = 0; i < numOfMolecules; i++) {
        // node addition operation is determined by molecule type
        if(nodeList[i].type == "Simple Chemical"){
          var newNode = elementUtilities.addNode(xPositionOfFreeMacromolecules, yPosition, "simple chemical");
          //update the y position
          yPosition += simpleChemicalHeight + tilingPaddingVertical;
        }
        else{
          var newNode = elementUtilities.addNode(xPositionOfFreeMacromolecules, yPosition, "macromolecule");
          //update the y position
          yPosition += macromoleculeHeight + tilingPaddingVertical;
        }
        newNode.data('justAdded', true);
        newNode.data('label', nodeList[i].name);

        //create the edge connected to the new molecule
        var newEdge;
        if (templateType === 'association') {
          newEdge = elementUtilities.addEdge(newNode.id(), process.id(), 'consumption');
        }
        else if(templateType === 'dissociation'){
          newEdge = elementUtilities.addEdge(process.id(), newNode.id(), 'production');
        }
        else{
          //Group right or top elements in group id 1
          newEdge = elementUtilities.addEdge(process.id(), newNode.id(), 'production', undefined, undefined, 1);
        }

        newEdge.data('justAdded', true);
      }

      if(templateType === 'association' || templateType == 'dissociation'){
        //Create the complex including macromolecules inside of it
        //Temprorarily add it to the process position we will move it according to the last size of it
        var complex = elementUtilities.addNode(processPosition.x, processPosition.y, 'complex');
        complex.data('justAdded', true);
        complex.data('justAddedLayoutNode', true);

        //If a name is specified for the complex set its label accordingly
        if (complexName) {
          complex.data('label', complexName[0].name);
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

        for (var i = 0; i < numOfMolecules; i++) {

          // Add a molecule(dependent on it's type) not having a previously defined id and having the complex created in this reaction as parent
          if(nodeList[i].type == 'Simple Chemical'){
            var newNode = elementUtilities.addNode(complex.position('x'), complex.position('y'), "simple chemical", undefined, complex.id());
          }
          else{
            var newNode = elementUtilities.addNode(complex.position('x'), complex.position('y'), "macromolecule", undefined, complex.id());
          }

          newNode.data('justAdded', true);
          newNode.data('label', nodeList[i].name);
          newNode.data('justAddedLayoutNode', true);
        }
      }
      else{

        //Create the input macromolecules
        var numOfInputMacromolecules = complexName.length;
        yPosition = processPosition.y - ((numOfInputMacromolecules - 1) / 2) * (macromoleculeHeight + tilingPaddingVertical);

        for (var i = 0; i < numOfInputMacromolecules; i++) {

          if(complexName[i].type == 'Simple Chemical'){
            var newNode = elementUtilities.addNode(xPositionOfInputMacromolecules, yPosition, "simple chemical");
            yPosition += simpleChemicalHeight + tilingPaddingVertical;
          }
          else{
            var newNode = elementUtilities.addNode(xPositionOfInputMacromolecules, yPosition, "macromolecule");
            yPosition += macromoleculeHeight + tilingPaddingVertical;
          }

          newNode.data('justAdded', true);
          newNode.data('label', complexName[i].name);

          //create the edge connected to the new macromolecule
          var newEdge;

          //Group the left or bottom elements in group id 0
          newEdge = elementUtilities.addEdge(process.id(), newNode.id(), 'production', undefined, undefined, 0);
          newEdge.data('justAdded', true);

        }
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
          //If it is a reversible reaction no need to re-position complexes
          if(templateType === 'reversible')
            return;
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
      if (layout && layout.run && templateType !== 'reversible') {
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

      return sbgnclass == 'consumption' || sbgnclass == 'production';
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
    // Each character assumed to occupy 8 unit
    // Each infobox can have at most 32 units of width
    elementUtilities.changeStateOrInfoBox = function (nodes, index, value, type) {
      var result;
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var stateAndInfos = node.data('statesandinfos');
        var box = stateAndInfos[index];
        var oldLength = box.bbox.w;
        var newLength = 0;
        if (box.clazz == "state variable") {
          if (!result) {
            result = box.state[type];
          }

          box.state[type] = value;
          if (box.state["value"] !== undefined) {
            newLength = box.state["value"].length;
          }
          if (box.state["variable"] !== undefined) {
            newLength += box.state["variable"].length + 1;
          }

        }
        else if (box.clazz == "unit of information") {
          if (!result) {
            result = box.label.text;
          }
          newLength = value.length;
          box.label.text = value;
        }
        if (newLength == 0) {
          box.bbox.w = 8;
        }else if(newLength < 4){
          box.bbox.w = 8 * newLength;
        }else{
          box.bbox.w = 32; // 8 * 32
        }
        box.bbox.x += (box.bbox.w - oldLength) / 2;
        for (var j = index+1; j < stateAndInfos.length; j++) {
          if (box.anchorSide == stateAndInfos[j].anchorSide) {
            stateAndInfos[j].bbox.x += (box.bbox.w - oldLength);
          }
        }
        sbgnvizInstance.classes.AuxUnitLayout.fitUnits(node);
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
        sbgnvizInstance.classes.AuxUnitLayout.fitUnits(node);
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
        sbgnvizInstance.classes.AuxUnitLayout.fitUnits(node, obj.location);
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
          var ele = cy.getElementById(eles[i].id());
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
          var ele = cy.getElementById(eles[i].id());
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

    elementUtilities.hasBackgroundImage = function (ele) {
      if(ele.isNode()){
        var style = ele._private.style;
        var bg = style['background-image'] ? style['background-image'].value : [];
        var bg = style['background-image'] ? style['background-image'].value : []; 
        var cloneImg = 'data:image/svg+xml;utf8,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20style%3D%22fill%3Anone%3Bstroke%3Ablack%3Bstroke-width%3A0%3B%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22100%22%20height%3D%22100%22%20style%3D%22fill%3A%23a9a9a9%22/%3E%20%3C/svg%3E';
        if(bg.length > 0 && !(bg.indexOf(cloneImg) > -1 && bg.length === 1))
          return true;

        return false;
      }
    }

    elementUtilities.getBackgroundImageURL = function (ele) {
      if(ele.isNode()){
        var bg = ele._private.style['background-image'];
        if(bg){
          var imgList = bg.value;
          for(var i = 0; i < imgList.length; i++){
            if(imgList[i].indexOf('http') === 0)
              return imgList[i];
          }
        }
      }
    }

    elementUtilities.getBackgroundImageObj = function (ele) {
      if(ele.isNode()){
        var style = ele._private.style;
        var img = style['background-image'] ? style['background-image'].value : "" ;
        var fit = style['background-fit'] ? style['background-fit'].value : [] ;
        var opa = style['background-image-opacity'] ? style['background-image-opacity'].value : [] ;
        var x = style['background-position-x'] ? style['background-position-x'].value : [] ;
        var y = style['background-position-y'] ? style['background-position-y'].value : [] ;
        var w = style['background-width'] ? style['background-width'].value : [] ;
        var h = style['background-height'] ? style['background-height'].value : [] ;

        return {
          'background-image': img,
          'background-fit': fit,
          'background-image-opacity': opa,
          'background-position-x': x,
          'background-position-y': y,
          'background-width': w,
          'background-height': h
        };
      }
    }

    // Add a background image to given nodes.
    elementUtilities.addBackgroundImage = function (nodes, bgObj, updateInfo, promptInvalidImage) {
      if(!nodes || nodes.length == 0 || !bgObj || !bgObj['background-image'])
        return;

      // Load the image from local, else just put the URL
      if(bgObj['fromFile'])
        loadBackgroundThenApply(nodes, bgObj);
      
      // Validity of given URL should be checked before applying it 
      else
        checkGivenURL(nodes, bgObj);
      
      function loadBackgroundThenApply(nodes, bgObj) {
        var reader = new FileReader();
        var imgFile = bgObj['background-image'];
        
        // Check whether given file is an image file
        if(imgFile.type.indexOf("image") !== 0){
          if(promptInvalidImage)
            promptInvalidImage("Invalid image file is given!");
          return;
        }
        
        reader.readAsDataURL(imgFile);
        
        reader.onload = function (e) {
          var img = reader.result;
          if(img){
            bgObj['background-image'] = img;
            applyBackground(nodes, bgObj);
          }
          else{
            if(promptInvalidImage)
              promptInvalidImage("Given file could not be read!");
          }
        };
      }

      function checkGivenURL(nodes, bgObj){
        var url = bgObj['background-image'];
        var extension = url.split(".").pop();
        var validExtensions = ["png", "svg", "jpg", "jpeg"];

        if(!validExtensions.includes(extension)){
          if(promptInvalidImage)
            promptInvalidImage("Invalid URL is given!");
          return;
        }
        
        $.ajax({
          url: url,
          type: 'GET',
          success: function(result, status, xhr){
            applyBackground(nodes, bgObj);
          },
          error: function(xhr, status, error){
            if(promptInvalidImage)
              promptInvalidImage("Invalid URL is given!");
          },
        });
      }

      function applyBackground(nodes, bgObj) {
        
        for(var i = 0; i < nodes.length; i++){
          var node = nodes[0];
          var style = node._private.style;

          var imgs = style['background-image'] ? style['background-image'].value : [];
          var xPos = style['background-position-x'] ? style['background-position-x'].value : [];
          var yPos = style['background-position-y'] ? style['background-position-y'].value : [];
          var widths = style['background-width'] ? style['background-width'].value : [];
          var heights = style['background-height'] ? style['background-height'].value : [];
          var fits = style['background-fit'] ? style['background-fit'].value : [];
          var opacities = style['background-image-opacity'] ? style['background-image-opacity'].value : [];

          concatUnitToValues(xPos, "%");
          concatUnitToValues(yPos, "%");
          concatUnitToValues(heights, "%");
          concatUnitToValues(widths, "%");

          var indexToInsert = imgs.length;

          // insert to length-1
          if(hasCloneMarker(node, imgs)){
            indexToInsert--;
          }

          imgs.splice(indexToInsert, 0, bgObj['background-image']);
          fits.splice(indexToInsert, 0, bgObj['background-fit']);
          opacities.splice(indexToInsert, 0, bgObj['background-image-opacity']);
          xPos.splice(indexToInsert, 0, bgObj['background-position-x']);
          yPos.splice(indexToInsert, 0, bgObj['background-position-y']);
          widths.splice(indexToInsert, 0, bgObj['background-width']);
          heights.splice(indexToInsert, 0, bgObj['background-height']);

          var opt = {
            'background-image': imgs,
            'background-position-x': xPos,
            'background-position-y': yPos,
            'background-width': widths,
            'background-height': heights,
            'background-fit': fits,
            'background-image-opacity': opacities
          }
          node.style(opt);
          
          if(updateInfo)
            updateInfo();
        }
      }

      function hasCloneMarker(node, imgs){
        var cloneImg = 'data:image/svg+xml;utf8,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20style%3D%22fill%3Anone%3Bstroke%3Ablack%3Bstroke-width%3A0%3B%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22100%22%20height%3D%22100%22%20style%3D%22fill%3A%23a9a9a9%22/%3E%20%3C/svg%3E';
        return (imgs.indexOf(cloneImg) > -1);
      }

      function concatUnitToValues(values, unit){
        if(!values || values.length == 0)
          return;

        for(var i = 0; i < values.length; i++){
          if(values[i] && values[i] !== "" && values[i] !== "auto"){
            values[i] = "" + values[i] + unit;
          }
        }
      }
    };

    // Remove a background image from given nodes.
    elementUtilities.removeBackgroundImage = function (nodes, bgObj) {
      if(!nodes || nodes.length == 0 || !bgObj || !bgObj['background-image'])
        return;

      for(var i = 0; i < nodes.length; i++){
        var node = nodes[0];
        var style = node._private.style;

        var imgs = style['background-image'] ? style['background-image'].value : [];
        var xPos = style['background-position-x'] ? style['background-position-x'].value : [];
        var xUnits = style['background-position-x'] ? style['background-position-x'].units : [];
        var yPos = style['background-position-y'] ? style['background-position-y'].value : [];
        var yUnits = style['background-position-y'] ? style['background-position-y'].units : [];
        var widths = style['background-width'] ? style['background-width'].value : [];
        var widthUnits = style['background-width'] ? style['background-width'].units : [];
        var heights = style['background-height'] ? style['background-height'].value : [];
        var heightUnits = style['background-height'] ? style['background-height'].units : [];
        var fits = style['background-fit'] ? style['background-fit'].value : [];
        var opacities = style['background-image-opacity'] ? style['background-image-opacity'].value : [];

        concatUnitToValues(xPos, "%");
        concatUnitToValues(yPos, "%");
        concatUnitToValues(heights, "%");
        concatUnitToValues(widths, "%");

        var index = imgs.indexOf(bgObj['background-image'][0]);

        if(index > -1){
          imgs.splice(index, 1);
          fits.splice(index, 1);
          opacities.splice(index, 1);
          xPos.splice(index, 1);
          yPos.splice(index, 1);
          widths.splice(index, 1);
          heights.splice(index, 1);
        }

        var opt = {
          'background-image': imgs,
          'background-position-x': xPos,
          'background-position-y': yPos,
          'background-width': widths,
          'background-height': heights,
          'background-fit': fits,
          'background-image-opacity': opacities
        }

        node.style(opt);
      }

      function concatUnitToValues(values, unit){
        if(!values || values.length == 0)
          return;

        for(var i = 0; i < values.length; i++){
          if(values[i] && values[i] !== "" && values[i] !== "auto"){
            values[i] = "" + values[i] + unit;
          }
        }
      }
    };
  }

  return elementUtilitiesExtender;
};
