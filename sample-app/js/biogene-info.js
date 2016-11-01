/*
 * Copyright 2013 Memorial-Sloan Kettering Cancer Center.
 *
 * This file is part of PCViz.
 *
 * PCViz is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * PCViz is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with PCViz. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Backbone view for the BioGene information.
 */
var BioGeneView = Backbone.View.extend({

    render: function() {
        // pass variables in using Underscore.js template
        var variables = {
            geneDescription: this.model.geneDescription,
            geneAliases: this.parseDelimitedInfo(this.model.geneAliases, ":", ",", null),
            geneDesignations: this.parseDelimitedInfo(this.model.geneDesignations, ":", ",", null),
            geneLocation: this.model.geneLocation,
            geneMim: this.model.geneMim,
            geneId: this.model.geneId,
            geneUniprotId: this.extractFirstUniprotId(this.model.geneUniprotMapping),
            geneUniprotLinks: this.generateUniprotLinks(this.model.geneUniprotMapping),
            geneSummary: this.model.geneSummary
        };

        // compile the template using underscore
        var template = _.template( $("#biogene-template").html());
        template = template(variables);

        // load the compiled HTML into the Backbone "el"
        this.$el.html(template);

        // format after loading
        this.format(this.model);

        return this;
    },
    format: function()
    {
        // hide rows with undefined data
        if (this.model.geneDescription == undefined)
            this.$el.find(".biogene-description").hide();

        if (this.model.geneAliases == undefined)
            this.$el.find(".biogene-aliases").hide();

        if (this.model.geneDesignations == undefined)
            this.$el.find(".biogene-designations").hide();

        if (this.model.geneChromosome == undefined)
            this.$el.find(".biogene-chromosome").hide();

        if (this.model.geneLocation == undefined)
            this.$el.find(".biogene-location").hide();

        if (this.model.geneMim == undefined)
            this.$el.find(".biogene-mim").hide();

        if (this.model.geneId == undefined)
            this.$el.find(".biogene-id").hide();

        if (this.model.geneUniprotMapping == undefined)
            this.$el.find(".biogene-uniprot-links").hide();

        if (this.model.geneSummary == undefined)
            this.$el.find(".node-details-summary").hide();

        var expanderOpts = {slicePoint: 150,
            expandPrefix: ' ',
            expandText: ' (...)',
            userCollapseText: ' (show less)',
            moreClass: 'expander-read-more',
            lessClass: 'expander-read-less',
            detailClass: 'expander-details',
            // do not use default effects
            // (see https://github.com/kswedberg/jquery-expander/issues/46)
            expandEffect: 'fadeIn',
            collapseEffect: 'fadeOut'};

        $(".biogene-info .expandable").expander(expanderOpts);

        expanderOpts.slicePoint = 2; // show comma and the space
        expanderOpts.widow = 0; // hide everything else in any case
    },
    generateUniprotLinks: function(mapping) {
        var formatter = function(id){
            return _.template($("#uniprot-link-template").html(), { id: id });
        };

        if (mapping == undefined || mapping == null)
        {
            return "";
        }

        // remove first id (assuming it is already processed)
        if (mapping.indexOf(':') < 0)
        {
            return "";
        }
        else
        {
            mapping = mapping.substring(mapping.indexOf(':') + 1);
            return ', ' + this.parseDelimitedInfo(mapping, ':', ',', formatter);
        }
    },
    extractFirstUniprotId: function(mapping) {
        if (mapping == undefined || mapping == null)
        {
            return "";
        }

        var parts = mapping.split(":");

        if (parts.length > 0)
        {
            return parts[0];
        }

        return "";
    },
    parseDelimitedInfo: function(info, delimiter, separator, formatter) {
        // do not process undefined or null values
        if (info == undefined || info == null)
        {
            return info;
        }

        var text = "";
        var parts = info.split(delimiter);

        if (parts.length > 0)
        {
            if (formatter)
            {
                text = formatter(parts[0]);
            }
            else
            {
                text = parts[0];
            }
        }

        for (var i=1; i < parts.length; i++)
        {
            text += separator + " ";

            if (formatter)
            {
                text += formatter(parts[i]);
            }
            else
            {
                text += parts[i];
            }
        }

        return text;
    }
});

var fillBioGeneContainer = function (node) {
  var geneClass = node._private.data.sbgnclass;
  if (geneClass != 'macromolecule' && geneClass != 'nucleic acid feature' &&
          geneClass != 'unspecified entity') {
    $("#biogene-container").html("");
    return;
  }

  var queryScriptURL = "sampleapp-components/php/BioGeneQuery.php";
  var geneName = node._private.data.sbgnlabel;

  // set the query parameters
  var queryParams =
          {
            query: geneName,
            org: "human",
            format: "json",
          };
//  var content = '{"count":1,"geneInfo":[{"geneAliases":"VACHT","geneChromosome":"10","geneDescription":"solute carrier family 18 member A3","geneDesignations":"solute carrier family 18 (vesicular acetylcholine transporter), member 3:solute carrier family 18 (vesicular acetylcholine), member 3:solute carrier family 18 member 3:solute carrier family 18, member 3","geneId":"6572","geneLocation":"10q11.2","geneMim":"600336","geneOrganism":"Homo sapiens","geneRif":[{"pubmedId":24732660,"rif":"PCMC expression of ADAM29, FLRT2, and SLC18A3 could be assessed as part of a routine screen to help identify individuals at risk of severe Obstructive sleep apnea in Asian populations"},{"pubmedId":24316404,"rif":"Expression of VAChT is increased in neuronal cell lines following upregulation of Lhx8."},{"pubmedId":22821666,"rif":"alpha-Synuclein expression in axons to the distal gut correlates closely with expression of the cholinergic marker, VAChT."},{"pubmedId":23222296,"rif":"Data indicate that siRNA-mediated attenuation of vesicular acetylcholine transporter (VAChT, SLC18A3) reversed the apoptotic activity of vesamicol."},{"pubmedId":21948486,"rif":"Multiple abnormalities with intellectual and developmental disability result from recurrent deletions and reciprocal duplications of 10q11.21q11.23 including CHAT and SLC18A3."},{"pubmedId":21163949,"rif":"overexpressed ChAT enhanced transcription of the CHT1 gene but not the VACHT gene"},{"pubmedId":20831599,"rif":"Mutations in the vesicular acetylcholine transporter demonstrate decreased affinity for acetylcholine and vesamicol."},{"pubmedId":20490865,"rif":"The colocalisation of CHT1 immunoreactivity with VAChT immunoreactivity in cholinergic enteric nerves in the human bowel thus suggests that CHT1 represents another marker of cholinergic nerves."},{"pubmedId":20379614,"rif":"Clinical trial of gene-disease association and gene-environment interaction. (HuGE Navigator)"},{"pubmedId":19685929,"rif":"Time-dependent dissociation of bound [3H]vesamicol is biphasic, but equilibrium saturation curves are not. The contrasting phasicity suggests that the pathway to and from the [3H]vesamicol binding site exists in open and at least partially closed states."},{"pubmedId":19204726,"rif":"Observational study of gene-disease association. (HuGE Navigator)"},{"pubmedId":16763548,"rif":"presence of VAChT in cutaneous nerves and in both epidermal melanocytes and keratinocytes as well as in their nuclei"},{"pubmedId":12759818,"rif":"Three non-coding SNPs were detected in SLC18A3. None demonstrated any reproducible association with late-onset AD in our samples."},{"pubmedId":14622097,"rif":"An 11.2 kb transgene (named hV11.2) that spanned about 5 kb upstream of the start of VACHT translation down to the first choline acetyltransferase coding exon gave variable expression in the medial habenular nucleus of transgenic mice"}],"geneSummary":"This gene is a member of the vesicular amine transporter family. The encoded transmembrane protein transports acetylcholine into secretory vesicles for release into the extracellular space. Acetylcholine transport utilizes a proton gradient established by a vacuolar ATPase. This gene is located within the first intron of the choline acetyltransferase gene. [provided by RefSeq, Jul 2008]","geneSymbol":"SLC18A3","geneTag":null,"geneUniprotMapping":"Q16572"}],"retMax":1,"returnCode":"SUCCESS"}';
  $.ajax({
    type: "POST",
    url: queryScriptURL,
    async: true,
    data: queryParams,
  })
          .then(function (content) {
            var queryResult = JSON.parse(content);
            if (queryResult.count > 0 && queryParams.query != "" && typeof queryParams.query != 'undefined')
            {
              var info = (new BioGeneView(
                      {
                        el: '#biogene-container',
                        model: queryResult.geneInfo[0]
                      })).render();
            }
            else {
              $('#biogene-container').html("<span style='padding-left: 3px;'>No additional information available &#013; for the selected node!</span>");
            }
          }, function (xhr, status, error) {
            $('#biogene-container').html("<span style='padding-left: 3px;'>Error retrieving data: " + error + "</span>");
          });
   $('#biogene-title').html("<b>" + node._private.data.sbgnlabel + "</b>");
};