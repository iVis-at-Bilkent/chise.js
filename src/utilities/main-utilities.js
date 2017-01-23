/*
 * The main utilities to be exposed directly.
 */
function mainUtilities(){
};

/*
 * Clone given elements. Considers undoable option. Requires cytoscape-clipboard extension.
 */
mainUtilities.cloneElements = function(eles) {
  var cb = cy.clipboard();
  var _id = cb.copy(eles, "cloneOperation");
  
  if(options.undoable) {
    cy.undoRedo().do("paste", {id: _id});
  }
  else {
    cb.paste(_id);
  }
};

/*
 * Aligns given nodes in given horizontal and vertical order. 
 * Horizontal and vertical parameters may be 'none' or undefined.
 * alignTo parameter indicates the leading node.
 * Requrires cytoscape-grid-guide extension and considers undoable option.
 */
mainUtilities.align = function(nodes, horizontal, vertical, alignTo) {
  if (options.undoable) {
    cy.undoRedo().do("align", {
      nodes: nodes,
      horizontal: horizontal,
      vertical: vertical,
      alignTo: alignTo
    });
  }
  else {
    nodes.align(horizontal, vertical, alignTo);
  }
};

