(function(){
  var chise = window.chise = function(_options, _libs) {
    var libs = {};
    libs.jQuery = _libs.jQuery || jQuery;
    libs.cytoscape = _libs.cytoscape || cytoscape;
    libs.sbgnviz = _libs.sbgnviz || sbgnviz;
    libs.saveAs = _libs.filesaverjs ? _libs.filesaverjs.saveAs : saveAs;
    
    libs.sbgnviz(_options, _libs); // Initilize sbgnviz
    
    // Set the libraries to access them from any file
    var libUtilities = require('./utilities/lib-utilities');
    libUtilities.setLibs(libs);
    
    var optionUtilities = require('./utilities/option-utilities');
    var options = optionUtilities.extendOptions(_options); // Extends the default options with the given options
    
    var cyStyleAndEvents = _dereq_('./utilities/cy-style-and-events');
    var registerUndoRedoActions = _dereq_('./utilities/register-undo-redo-actions');
    
    // These events acceses globale cy instance which is set on document.ready
    $(document).ready(function() {
      // Update style and bind events
      cyStyleAndEvents(libs.sbgnviz);
      // Register undo/redo actions
      registerUndoRedoActions(options.undoableDrag);
    });
    
    var mainUtilities = require('./utilities/main-utilities');
    var elementUtilities = require('./utilities/element-utilities');
    var undoRedoActionFunctions = require('./utilities/undo-redo-action-functions');
    // Expose the api
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