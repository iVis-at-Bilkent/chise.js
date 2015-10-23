var sbgnElementUtilities = {
  //this method returns the nodes whose parent is not in given nodes
  getRootsOfGivenNodes: function (nodes) {
    var parentMap = {};
    var nodesMap = {};
    for (var i = 0; i < nodes.length; i++) {
      parentMap[nodes[i].id()] = nodes[i].data("parent");
      nodesMap[nodes[i].id()] = true;
    }
    var roots = nodes.filter(function (i, ele) {
      if (nodesMap[parentMap[ele.id()]] == null) {
        return true;
      }
    });

    return roots;
  },
  //This method checks if all of the given nodes have the same parent assuming that the size 
  //of  nodes is not 0
  allHaveTheSameParent: function (nodes) {
    if (nodes.length == 0) {
      return true;
    }
    var parent = nodes[0].data("parent");
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.data("parent") != parent) {
        return false;
      }
    }
    return true;
  },
  handledElements: {
    "macromolecule": true,
    "simple chemical": true,
    "complex": true,
    "process": true,
    "omitted process": true,
    "uncertain process": true,
    "association": true,
    "dissociation": true,
    "phenotype": true,
    "compartment": true,
    "unspecified entity": true,
    "nucleic acid feature": true,
    "source and sink": true,
    "perturbing agent": true,
    "tag": true,
    "and": true,
    "or": true,
    "not": true,
    //edges
    "consumption": true,
    "production": true,
    "modulation": true,
    "stimulation": true,
    "catalysis": true,
    "inhibition": true,
    "necessary stimulation": true,
    "logic arc": true
  }
};