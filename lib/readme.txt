This file indicates the altered parts in used libraries and explains why they are changed.

Libary name: cytoscape-edgehandles.js
The code between line numbers 415 and 479 are commented out.
(starting from the line "for( var i = 0; i < targets.length; i++ ) {")

The reason of this change was disabling user with creating edges with multiple targets at a time.

Line number 581 is commented out.
(line is containing the following content "drawHandle( hx, hy, hr );")

The reason of this change was preventing that the red handle drawn on every hover on a node.

Library name: cytoscape-noderesize.js
Changes are done inside moveHandler function defined as "function moveHandler(e)"

The reason of this changes was disabling user from changing the sizes of nodes with some special types arbitrarily.

clearDraws function globally named as clearDrawsOfNodeResize.

The reason of this change was to call "clearDraws" function when it is needed outside of the library.
In this case, it is needed to clear the handle on hide.