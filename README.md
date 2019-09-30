# ChiSE

ChiSE is a library with an API based on [SBGNViz.js](https://github.com/iVis-at-Bilkent/sbgnviz.js), which in turn is based on [Cytoscape.js](http://cytoscape.github.io/cytoscape.js/), to visualize and edit the pathway models represented by process description (PD) and activity flow (AF) languages of [SBGN](http://sbgn.org) or in [simple interaction format (SIF)](https://www.pathwaycommons.org/pc/sif_interaction_rules.do). 

It accepts the pathway models represented in enriched [SBGN-ML](https://github.com/sbgn/sbgn/wiki/SBGN_ML) format, and can save edited pathways back to the same format, including layout, style, and annotation information, as well as static image formats (PNG, JPEG, and SVG). It can also import from and export to various formats such as SIF and simple AF.
<br/>

## Software

ChiSE is distributed under [GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl.html). 

**A sample application using ChiSE** can be found [here](http://newteditor.org/).

Please cite the following when you use ChiSE.js:

M. Sari, I. Bahceci, U. Dogrusoz, S.O. Sumer, B.A. Aksoy, O. Babur, E. Demir, "[SBGNViz: a tool for visualization and complexity management of SBGN process description maps](http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0128985)", PLoS ONE, 10(6), e0128985, 2015.

## Default Options
```javascript
    var options = {
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
        // Whether to infer nesting on load 
        inferNestingOnLoad: function () {
          return false;
        },
        // percentage used to calculate compound paddings
        compoundPadding: function () {
          return 10;
        },
        // Whether to adjust node label font size automatically.
        // If this option returns false, do not adjust label sizes according to node heights; use node.data('font-size')
        // instead.
        adjustNodeLabelFontSizeAutomatically: function() {
          return true;
        },
        // The selector of the component containing the sbgn network
        networkContainerSelector: '#sbgn-network-container',
        // Whether the actions are undoable, requires cytoscape-undo-redo extension
        undoable: true,
        // Whether to have undoable drag feature in undo/redo extension. This option will be passed to undo/redo extension.
        undoableDrag: true
      };
```

## ChiSE Specific Data
```javascript
// Nodes specific data.
node.data('id'); // Id of a node. (Specific to cytoscape.js)
node.data('label'); // Label of a node. 'content' of elements are controlled by this data.
node.data('parent'); // Parent id of a node. (Specific to cytoscape.js)
node.data('class'); // SBGN specific class of a node. If it ends with 'multimer' it means that this node is a multimer.
node.data('clonemarker'); // Whether the node is cloned.
node.data('bbox'); // Bounding box of a node includes bbox.x, bbox.y, bbox.w, bbox.h. 'width' and 'height' style of elements are mapped by bbox.w and bbox.h
node.data('ports'); // Ports list of a node. A node port includes port.id, port.x, port.y where port.x and port.y are percentages relative to node position and size.
node.data('statesandinfos'); // Includes state and information boxes list of a node.
node.data('font-size'); // If the font sizes of the nodes are not automatically adjusted (controlled by adjustNodeLabelFontSizeAutomatically option) their 'font-size' style is adjusted by this data.
node.data('font-family');// 'font-family' style of nodes are controlled by this data.
node.data('font-style');// 'font-style' style of nodes are controlled by this data.
node.data('font-weight');// 'font-weight' style of nodes are controlled by this data.
node.data('background-color');// 'background-color' style of nodes are controlled by this data.
node.data('background-opacity');// 'background-opacity' style of nodes are controlled by this data.
node.data('border-color');// 'border-color' style of nodes are controlled by this data.
node.data('border-width');// 'border-width' style of nodes are controlled by this data.
// A stateorinfobox includes the followings.
var stateorinfobox = node.data('statesandinfos')[i];
stateorinfobox.id; // Id of that box.
stateorinfobox.clazz; // See whether that box is related to a 'unit of information' or a 'state variable'.
stateorinfobox.bbox; // Bbox of that box. Includes bbox.x, bbox.y, bbox.w, bbox.h where bbox.x and bbox.y are percentages relative to node position and size.
stateorinfobox.state; // Just included in state variables. Includes state.value and state.variable.
stateorinfobox.label; // Just included in units of information includes label.text.
// Edges specific data.
edge.data('id'); // Id of an edge. (Specific to cytoscape.js)
edge.data('source'); // Id of source node. (Specific to cytoscape.js)
edge.data('target'); // Id of target node. (Specific to cytoscape.js)
edge.data('class'); // SBGN specific class of an edge.
edge.data('cardinality'); // SBGN cardinality of an edge.
edge.data('portsource'); // This is set if the edge is connected to its source node by a specific port of that node.
edge.data('porttarget'); // This is set if the edge is connected to its target node by a specific port of that node.
edge.data('bendPointPositions'); // Bend point positions of an edge. Includes x and y coordinates. This data is to be passed to edgeBendEditing extension.
edge.data('width');// 'width' style of edges are controlled by this data.
edge.data('line-color');// 'line-color' style of edges are controlled by this data.
```

## API
ChiSE.js is built at the top of SBGNViz.js and any method exposed by SBGNViz.js is exposed in ChiSE.js as well ([SBGNViz.js API](https://github.com/iVis-at-Bilkent/sbgnviz.js#api)). Other ChiSE.js API is presented below.

`chise.register(options)`
Register with libraries before creating instances

`var instance = chise(options)`
Creates an extension instance with the given options

`instance.getSbgnvizInstance()`
Get the Sbgnviz.js instance created for this Chise.js instance.

`instance.getCy()`
Get the Cytoscape.js instance created for this Chise.js instance.

`instance.addNode(x, y , nodeclass, id, parent, visibility)`
Adds a new node with the given class and at the given coordinates. Optionally you can set the id, parent and visibility of the node. Considers undoable option.

`instance.addEdge(source, target , edgeclass, id, visibility)`
Adds a new edge with the given class and having the given source and target ids. Optionally you can set the id and visibility of the node. Considers undoable option.

`instance.addProcessWithConvenientEdges(source, target , processType)`
Adds a process with convenient edges. For more information please see 'https://github.com/iVis-at-Bilkent/newt/issues/9'. Considers undoable option.

`instance.cloneElements(eles)`
Clone given elements. Considers undoable option. Requires cytoscape-clipboard extension.

`instance.copyElements(eles)`
Copy given elements to clipboard. Requires cytoscape-clipboard extension.

`instance.pasteElements(eles)`
Paste the elements copied to clipboard. Considers undoable option. Requires cytoscape-clipboard extension.

`instance.align(nodes, horizontal, vertical, alignTo)`
Aligns given nodes in given horizontal and vertical order. Horizontal and vertical parameters may be 'none' or undefined.<br>
`alignTo`: indicates the leading node. Requires cytoscape-grid-guide extension and considers undoable option.

`instance.createCompoundForGivenNodes(nodes, compoundType)`
Create compound for given nodes. compoundType may be 'complex' or 'compartment'. This method considers undoable option.

`instance.changeParent(nodes, newParent, posDiffX, posDiffY)`
Move the nodes to a new parent and change their position if possDiff params are set. Considers undoable option and checks if the operation is valid.

`instance.createTemplateReaction(templateType, macromoleculeList, complexName, processPosition, tilingPaddingVertical, tilingPaddingHorizontal, edgeLength)`
Creates a template reaction with given parameters. Requires cose-bilkent layout to tile the free macromolecules included in the complex.
Considers undoable option. Parameters are explained below.<br>
`templateType`: The type of the template reaction. It may be 'association' or 'dissociation' for now.<br>
`macromoleculeList`: The list of the names of macromolecules which will involve in the reaction.<br>
`complexName`: The name of the complex in the reaction.<br>
`processPosition`: The modal position of the process in the reaction. The default value is the center of the canvas.<br>
`tilingPaddingVertical`: This option will be passed to the cose-bilkent layout with the same name. The default value is 15.<br>
`tilingPaddingHorizontal`: This option will be passed to the cose-bilkent layout with the same name. The default value is 15.<br>
`edgeLength`: The distance between the process and the macromolecules at the both sides.<br>

`instance.resizeNodes(nodes, newParent, posDiffX, posDiffY)`
Resize given nodes if `useAspectRatio` is truthy one of width or height should not be set. Considers undoable option.

`instance.changeNodeLabel(nodes, label)`
Changes the label of the given nodes to the given label. Considers undoable option.

`instance.changeFontProperties(nodes, data)`
Change font properties for given nodes use the given font data. Considers undoable option.

`instance.changeStateOrInfoBox(nodes, index, value, type)`
Change state value or unit of information box of given nodes with given index. Considers undoable option.<br>
`type` indicates whether to change value or variable, it is valid if the box at the given index is a state variable.<br>
`value` parameter is the new value to set.<br>
It returns the old value of the changed data (we assume that the old value of the changed data was the same for all nodes).

`instance.addStateOrInfoBox(nodes, obj)`
Add a new state or info box to given `nodes`. The box is represented by the parameter `obj`. Considers undoable option.

`instance.removeStateOrInfoBox(nodes, index)`
Remove the state or info boxes of the given `nodes` at given `index`. Considers undoable option.

`instance.setMultimerStatus(nodes, status)`
Set multimer status of the given `nodes` to the given `status`. Considers undoable option.

`instance.setCloneMarkerStatus(nodes, status)`
Set clone marker status of given `nodes` to the given `status`. Considers undoable option.

`instance.changeCss(eles, name, value)`
Change style/css of given `eles` by setting given property `name` to the given `value/values (Note that `value` parameter may be a single string or an id to value map). Considers undoable option. (From cytoscape.js documentation: 'You should use this function very sparingly, because it overrides the style of an element, despite the state and classes that it has.')

`instance.changeData(eles, name, value)`
Change data of given `eles` by setting given property `name` to the given value/values (Note that `value` parameter may be a single string or an id to value map). Considers undoable option.

`instance.showAndPerformLayout(eles, layoutparam)`
Unhide given `eles` and perform given layout afterward. `layoutparam` parameter may be layout options or a function to call.
Requires `viewUtilities` extension and considers undoable option.

`instance.updateInfoboxStyle(node, index, newProps)`
Extends the style of infobox that is at the given index of the given node by newProps. Considers undoable option.

`instance.updateSetField(ele, fieldName, toDelete, toAdd, callback)`
From the data of given ele updates the field recognized by the fieldName. The field is supposed to represent a set. Deletes 'toDelete' and adds 'toAdd' to the set if they exists.

`instance.elementUtilities`
General and sbgn specific utilities for cytoscape elements. Extends `sbgnviz.elementUtilities`, you can find the ChiSE extensions for `sbgnviz.elementUtilities` below.

 * `addNode(x, y, sbgnclass, id, parent, visibility)` Similar to `instance.addNode()` but do not considers undoable option.
 * `addEdge(source, target, sbgnclass, id, visibility)` Similar to `instance.addEdge()` but do not considers undoable option.
 * `addProcessWithConvenientEdges(source, target, processType)` Similar to `instance.addProcessWithConvenientEdges()` but do not considers undoable option.
 * `createCompoundForGivenNodes(nodesToMakeCompound, compoundType)` Similar to `instance.createCompoundForGivenNodes()` but do not considers undoable option.
 * `changeParent(nodes, newParent, posDiffX, posDiffY)` Similar to `instance.changeParent()` but do not considers undoable option.
 * `resizeNodes(nodes, width, height, useAspectRatio)` Similar to `instance.resizeNodes()` but do not considers undoable option.
 * `relocateStateAndInfos(ele)` Relocates the state and info boxes of the given node.
 * `changeStateOrInfoBox(nodes, index, value, type)` Similar to `instance.changeStateOrInfoBox()` but do not considers undoable option.
 * `addStateOrInfoBox(nodes, obj)` Similar to `instance.addStateOrInfoBox()` but do not considers undoable option.
 * `removeStateOrInfoBox(nodes, index)` Similar to `instance.removeStateOrInfoBox()` but do not considers undoable option.
 * `setMultimerStatus(nodes, status)` Similar to `instance.setMultimerStatus()` but do not considers undoable option.
 * `setCloneMarkerStatus(nodes, status)` Similar to `instance.setCloneMarkerStatus()` but do not considers undoable option.
 * `changeFontProperties(nodes, data)` Similar to `instance.changeFontProperties()` but do not considers undoable option.
 * `validateArrowEnds(edge, source, target)`  This function gets an edge, and ends of that edge (Optionally it may take just the classes of these elements as well) as parameters.
    It may return 'valid' (that ends is valid for that edge), 'reverse' (that ends is not valid for that edge but they would be valid 
    if you reverse the source and target), 'invalid' (that ends are totally invalid for that edge).
 * `showAndPerformLayout(eles, layoutparam)` Similar to `instance.showAndPerformLayout()` but do not considers undoable option.
 * `updateInfoboxStyle(node, index, newProps)` Similar to `instance.updateInfoboxStyle()` but do not considers undoable option.
 * `updateSetField(ele, fieldName, toDelete, toAdd, callback)` Similar to `instance.updateSetField()` but do not considers undoable option.

`instance.undoRedoActionFunctions`
Functions to be utilized in defining new actions for `cytoscape.js-undo-redo` extension. These are exposed for the users who builds
an extension library of chise. Extends `sbgnvizInstance.undoRedoActionFunctions`, you can find the ChiSE extensions for `sbgnvizInstance.undoRedoActionFunctions` below.

 * `addNode(param)` Do/Redo function for 'addNode' undo redo command.
 * `addProcessWithConvenientEdges(param)` Do/Redo function for 'addProcessWithConvenientEdges' undo redo command.
 * `createCompoundForGivenNodes(param)` Do/Undo/Redo function for 'createCompoundForGivenNodes' undo redo command.
 * `createTemplateReaction(param)` Do/Redo function for 'createTemplateReaction' undo redo command.
 * `resizeNodes(param)` Do/Undo/Redo function for 'resizeNodes' undo redo command.
 * `changeNodeLabel(param)` Do/Undo/Redo function for 'changeNodeLabel' undo redo command.
 * `changeData(param)` Do/Undo/Redo function for 'changeData' undo redo command.
 * `changeCss(param)` Do/Undo/Redo function for 'changeCss' undo redo command.
 * `changeFontProperties(param)` Do/Undo/Redo function for 'changeFontProperties' undo redo command.
 * `showAndPerformLayout(param)` Do/Redo function for 'showAndPerformLayout' undo redo command.
 * `updateInfoboxStyle(param)` Do/Redo function for 'updateInfoboxStyle' undo redo command.
 * `updateSetField(param)` Do/Redo function for 'updateSetField' undo redo command.
 * `undoShowAndPerformLayout(param)` Undo/ function for 'showAndPerformLayout' undo redo command.
 * `changeStateOrInfoBox(param)` Do/Undo/Redo function for 'changeStateOrInfoBox' undo redo command.
 * `addStateOrInfoBox(param)` Do/Redo function for 'addStateOrInfoBox' undo redo command (Also Undo function for 'removeStateOrInfoBox' undo redo command).
 * `removeStateOrInfoBox(param)` Do/Redo function for 'removeStateOrInfoBox' undo redo command (Also Undo function for 'addStateOrInfoBox' undo redo command).
 * `setMultimerStatus(param)` Do/Undo/Redo function for 'setMultimerStatus' undo redo command.
 * `setCloneMarkerStatus(param)` Do/Undo/Redo function for 'setCloneMarkerStatus' undo redo command.

## Events
`$(document).on('sbgnvizLoadSample', function(event, filename, cy) { ... });` Triggered when a sample is being loaded

`$(document).on('sbgnvizLoadFile', function(event, filename, cy) { ... });` Triggered when an external sbgnml file is being loaded

`$(document).on('updateGraphStart', function(event, cy) { ... });` Triggered when the graph update is just started

`$(document).on('updateGraphEnd', function(event, cy) { ... });` Triggered when the graph update is ended

## Dependencies

 * cytoscape (iVis-at-Bilkent/cytoscape.js#unstable)
 * jQuery ^2.2.4
 * filesaverjs ~0.2.2
 * sbgnviz ~3.4.2

## Optional Dependencies
The following extensions are used by this library if they are registered.
 * cytoscape-undo-redo ^1.2.1
 * cytoscape-expand-collapse ^3.0.0
 * cytoscape-edge-bend-editing ^1.4.0
 * cytoscape-view-utilities ^2.0.0


## Usage instructions
Download the library:
 * via npm: `npm install cytoscape-expand-collapse` or
 * via direct download in the repository (probably from a tag).

`require()` the library as appropriate for your project:

CommonJS:
```js
var sbgnviz = require('sbgnviz');
var cytoscape = require('cytoscape-for-sbgnviz');
var jQuery = require('jQuery');
var filesaverjs = require('filesaverjs');
var sbgnviz = require('sbgnviz');

var options = {
};

var libs = {
    cytoscape: cytoscape,
    jQuery: jQuery,
    filesaverjs: filesaverjs,
    sbgnviz: sbgnviz
};

chise( options, libs );
```

In plain JS you do not need to require the libraries you just need to register chise with the options.

## Publishing instructions

This project is set up to automatically be published to npm.  To publish:

1. Set the version number environment variable: `export VERSION=1.2.3`
2. Publish: `gulp publish`

## Team

  * [Hasan Balci](https://github.com/hasanbalci), [Nasim Saleh](https://github.com/nasimsaleh), and [Ugur Dogrusoz](https://github.com/ugurdogrusoz) of [i-Vis at Bilkent University](http://www.cs.bilkent.edu.tr/~ivis), and [Metin Can Siper](https://github.com/metincansiper) of the Demir Lab at [OHSU](http://www.ohsu.edu/)
  
#### Alumni

  * [Ilkin Safarli](https://github.com/kinimesi), [Ludovic Roy](https://github.com/royludo), [Leonard Dervishi](https://github.com/leonarddrv), [Alper Karacelik](https://github.com/alperkaracelik), [Selim Firat Yilmaz](https://github.com/mrsfy), [Istemi Bahceci](https://github.com/istemi-bahceci), [Ayhun Tekat](https://github.com/ayhun), [M.Furkan Sahin](https://github.com/furkansahin)
