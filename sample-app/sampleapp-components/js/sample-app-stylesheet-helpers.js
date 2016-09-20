var getCyShape = function (ele) {
  var shape = ele.data('sbgnclass');
  if (shape.endsWith(' multimer')) {
    shape = shape.replace(' multimer', '');
  }

  if (shape == 'compartment') {
    return 'roundrectangle';
  }
  if (shape == 'phenotype') {
    return 'hexagon';
  }
  if (shape == 'perturbing agent' || shape == 'tag') {
    return 'polygon';
  }
  if (shape == 'source and sink' || shape == 'nucleic acid feature' || shape == 'dissociation'
          || shape == 'macromolecule' || shape == 'simple chemical' || shape == 'complex'
          || shape == 'unspecified entity' || shape == 'process' || shape == 'omitted process'
          || shape == 'uncertain process' || shape == 'association') {
    return shape;
  }
  return 'ellipse';
};

var getCyArrowShape = function (ele) {
  var sbgnclass = ele.data('sbgnclass');
  if (sbgnclass == 'necessary stimulation') {
    return 'necessary stimulation';
//    return 'triangle-tee';
  }
  if (sbgnclass == 'inhibition') {
    return 'tee';
  }
  if (sbgnclass == 'catalysis') {
    return 'circle';
  }
  if (sbgnclass == 'stimulation' || sbgnclass == 'production') {
    return 'triangle';
  }
  if (sbgnclass == 'modulation') {
    return 'diamond';
  }
  return 'none';
};

var truncateText = function (textProp, font) {
  var context = document.createElement('canvas').getContext("2d");
  context.font = font;

  var fitLabelsToNodes = sbgnStyleRules['fit-labels-to-nodes'];

  var text = (typeof textProp.label === 'undefined') ? "" : textProp.label;
  //If fit labels to nodes is false do not truncate
  if (fitLabelsToNodes == false) {
    return text;
  }
  var width;
  var len = text.length;
  var ellipsis = "..";

  //if(context.measureText(text).width < textProp.width)
  //	return text;
  var textWidth = (textProp.width > 30) ? textProp.width - 10 : textProp.width;

  while ((width = context.measureText(text).width) > textWidth) {
    --len;
    text = text.substring(0, len) + ellipsis;
  }
  return text;
};

var getElementContent = function (ele) {
  var sbgnclass = ele.data('sbgnclass');
  
  if (sbgnclass.endsWith(' multimer')) {
    sbgnclass = sbgnclass.replace(' multimer', '');
  }

  var content = "";
  if (sbgnclass == 'macromolecule' || sbgnclass == 'simple chemical'
          || sbgnclass == 'phenotype'
          || sbgnclass == 'unspecified entity' || sbgnclass == 'nucleic acid feature'
          || sbgnclass == 'perturbing agent' || sbgnclass == 'tag') {
    content = ele.data('sbgnlabel') ? ele.data('sbgnlabel') : "";
  }
  else if(sbgnclass == 'compartment'){
    content = ele.data('sbgnlabel') ? ele.data('sbgnlabel') : "";
  }
  else if(sbgnclass == 'complex'){
    if(ele.children().length == 0){
      if(ele.data('sbgnlabel')){
        content = ele.data('sbgnlabel');
      }
      else if(ele.data('infoLabel')){
        content = ele.data('infoLabel');
      }
      else{
        content = '';
      }
    }
    else{
      content = '';
    }
  }
  else if (sbgnclass == 'and') {
    return 'AND';
  }
  else if (sbgnclass == 'or') {
    return 'OR';
  }
  else if (sbgnclass == 'not') {
    return 'NOT';
  }
  else if (sbgnclass == 'omitted process') {
    return '\\\\';
  }
  else if (sbgnclass == 'uncertain process') {
    return '?';
  }
  else if (sbgnclass == 'dissociation') {
    return 'O';
  }

  var textWidth = ele.css('width') ? parseFloat(ele.css('width')) : ele.data('sbgnbbox').w;

  var textProp = {
    label: content,
    width: ( sbgnclass==('complex') || sbgnclass==('compartment') )?textWidth * 2:textWidth
  };

  var font = getLabelTextSize(ele) + "px Arial";
  return truncateText(textProp, font);
};

var getLabelTextSize = function (ele) {
  var sbgnclass = ele.data('sbgnclass');
  
  if(sbgnclass === 'and' || sbgnclass === 'or' || sbgnclass === 'not') {
    return getDynamicLabelTextSize(ele, 1);
  }
  
  if(sbgnclass.endsWith('process')) {
    return getDynamicLabelTextSize(ele, 1.5);
  }
  
  if(sbgnclass === 'complex' || sbgnclass === 'compartment' || !sbgnStyleRules['adjust-node-label-font-size-automatically']) {
    return ele.data('labelsize');
  }
  
  return getDynamicLabelTextSize(ele);
};

/*
 * calculates the dynamic label size for the given node
 */
var getDynamicLabelTextSize = function (ele, dynamicLabelSizeCoefficient) {
  var dynamicLabelSize = sbgnStyleRules['dynamic-label-size'];
  
  if(dynamicLabelSizeCoefficient === undefined) {
    if (dynamicLabelSize == 'small') {
      dynamicLabelSizeCoefficient = 0.75;
    }
    else if (dynamicLabelSize == 'regular') {
      dynamicLabelSizeCoefficient = 1;
    }
    else if (dynamicLabelSize == 'large') {
      dynamicLabelSizeCoefficient = 1.25;
    }
  }

  //This line will be useless and is to be removed later
//  dynamicLabelSizeCoefficient = dynamicLabelSizeCoefficient ? dynamicLabelSizeCoefficient : 1;

//  var h = ele.css('height') ? parseInt(ele.css('height')) : ele.data('sbgnbbox').h;
  var h = ele.height();
  var textHeight = parseInt(h / 2.45) * dynamicLabelSizeCoefficient;

  return textHeight;
};

var getCardinalityDistance = function(ele) {
  var srcPos = ele.source().position();
  var tgtPos = ele.target().position();

  var distance = Math.sqrt( Math.pow( ( srcPos.x - tgtPos.x ), 2) + Math.pow( ( srcPos.y - tgtPos.y ), 2) );
  return distance * 0.15;
};