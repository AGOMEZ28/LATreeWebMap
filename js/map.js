      $('#info').click(function(){ 
	  console.log("info");
	  })
     


	 const map = L.map("map", {
        minZoom: 2,
		attributionControl: false,
		maxZoom: 20
      })

      map.setView([34.02, -118.205], 10);

      const apiKey = "AAPKb752a08ab5404f8581977fcefc50129f72b2k0kO6jQmNu8VXUEyo-SF1nMWS-8s2EED6s4v9aACHjJZLNzfDok6GvkcEC5M";

      const basemapLayers = {

        //Streets: L.esri.Vector.vectorBasemapLayer("ArcGIS:Streets", { apiKey: apiKey }),

        Navigation: L.esri.Vector.vectorBasemapLayer("ArcGIS:Navigation", { apiKey: apiKey }),
        Topographic: L.esri.Vector.vectorBasemapLayer("ArcGIS:Topographic", { apiKey: apiKey }),
        "Light Gray": L.esri.Vector.vectorBasemapLayer("ArcGIS:LightGray", { apiKey: apiKey }).addTo(map),
        "Dark gray": L.esri.Vector.vectorBasemapLayer("ArcGIS:DarkGray", { apiKey: apiKey }),
        //"Streets Relief": L.esri.Vector.vectorBasemapLayer("ArcGIS:StreetsRelief", { apiKey: apiKey }),
        Imagery: L.esri.Vector.vectorBasemapLayer("ArcGIS:Imagery", { apiKey: apiKey }),
        //ChartedTerritory: L.esri.Vector.vectorBasemapLayer("ArcGIS:ChartedTerritory", { apiKey: apiKey }),
        //ColoredPencil: L.esri.Vector.vectorBasemapLayer("ArcGIS:ColoredPencil", { apiKey: apiKey }),
        //Nova: L.esri.Vector.vectorBasemapLayer("ArcGIS:Nova", { apiKey: apiKey }),
        //Midcentury: L.esri.Vector.vectorBasemapLayer("ArcGIS:Midcentury", { apiKey: apiKey }),
        //OSM: L.esri.Vector.vectorBasemapLayer("OSM:Standard", { apiKey: apiKey }),
        //"OSM:Streets": L.esri.Vector.vectorBasemapLayer("OSM:Streets", { apiKey: apiKey })
      };


      L.control.layers(basemapLayers, null, { collapsed: false, position: 'topright'}).addTo(map);

      
                  var parkBoundaries = L.esri
        .featureLayer({
          url:        "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Los_Angeles_Recreation_and_Parks_Boundaries/FeatureServer/0",
          fillColor: '#2ca25f',
          color: '#2ca25f',
          fillOpacity: 0.6,
          stroke:false
        });
      parkBoundaries.addTo(map);
      
      parkBoundaries.bindPopup(function (layer) {

        return L.Util.template("<b>{Name}</b><br>{Address}</br>", layer.feature.properties);

      });

      var parkLabels = L.esri
      .featureLayer({
        url:        "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Los_Angeles_Recreation_and_Parks_Boundaries/FeatureServer/0",
        fillColor: '#2ca25f',
        color: '#2ca25f',
        stroke:false
      }).addTo(map);

      const labels = {};

      parkLabels.on("createfeature", function (e) {
        const id = e.feature.id;
        const feature = parkLabels.getFeature(id);
        const center = feature.getBounds().getCenter();
        const label = L.marker(center, {
          icon: L.divIcon({
            iconSize: null,
            className: "label",
            html: "<div>" + e.feature.properties.Name + "</div>"
          })
        });
        labels[id] = label;
      });
      var show_label_zoom = 15; // zoom level threshold for showing/hiding labels
      function show_hide_labels() {
        var cur_zoom = map.getZoom();
        if(cur_zoom < show_label_zoom && map.hasLayer(parkLabels)) {       
            map.removeLayer(parkLabels);            
        } else if(!map.hasLayer(parkLabels) && cur_zoom >= show_label_zoom) {            
          map.addLayer(parkLabels);                 
        }
    }
    map.on('zoomend', show_hide_labels);
    show_hide_labels();

    parkLabels.on("addfeature", function (e) {
        const label = labels[e.feature.id];
        if (label) {
          label.addTo(map);
        }
      });

      parkLabels.on("removefeature", function (e) {
        const label = labels[e.feature.id];
        if (label) {
          map.removeLayer(label);
        }
      });

      
            var streetTrees = L.esri.Cluster
        .featureLayer({
          url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/LAStreetTrees/FeatureServer/0",
		  spiderfyOnMaxZoom: false,
		  removeOutsideVisibleBounds: true,
        disableClusteringAtZoom: 18,
                pointToLayer: function (feature, latlng) {
          var myStyle = {
    color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 5
    };
          return new L.CircleMarker(latlng,myStyle);
    
            },
		  where: "1 = 0"

        });
      streetTrees.addTo(map);
	  
	    const parkTrees = L.esri.Cluster
        .featureLayer({
          url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Trees_(Recreation_and_Parks_Department)/FeatureServer/0",
		  spiderfyOnMaxZoom: false,
		  removeOutsideVisibleBounds: true,
        disableClusteringAtZoom: 18,
		
/* 		 iconCreateFunction: function (cluster) {
          // get the number of items in the cluster
          const count = cluster.getChildCount();

          // figure out how many digits long the number is
          const digits = (count + "").length;

          // Return a new L.DivIcon with our classes so we can
          // style them with CSS. Take a look at the CSS in
          // the <head> to see these styles. You have to set
          // iconSize to null if you want to use CSS to set the
          // width and height.
          return L.divIcon({
            html: count,
            className: "cluster digits-" + digits,
            iconSize: null
          });
        }, */
        // This function defines how individual markers
        // are created. You can see we are using the
        // value of the "magnitude" field to set the symbol
        pointToLayer: function (feature, latlng) {
          var myStyle = {
    color: '#40EE95',
        fillColor: '#40EE95',
        fillOpacity: 0.9,
        radius: 5
    };
          return new L.CircleMarker(latlng,myStyle);
    
            },
    
		
		
		
		
		
		  where: "1 = 0"
        });
      parkTrees.addTo(map);
	  
	  
	     parkTrees.bindPopup(function (layer) {

        return L.Util.template("<b>Common Name: {X_COMMONNA}</b><br>Botanical Name: {Botanical_}<br>Family: {FAMILY}<br>Park: {FACILITY}<br>", layer.feature.properties);

      });


  L.Control.QueryControl = L.Control.extend({
        onAdd: function (map) {
          const whereClauses = [
            "Please select a Tree Filter",
            "Street Name",
            "Park Name",
            "Tree Name"
          ];

          const select = L.DomUtil.create("select", "");
          select.setAttribute("id", "whereClauseSelect");
          select.setAttribute("style", "font-size: 16px;padding:4px 8px;");
          whereClauses.forEach(function (whereClause) {
            let option = L.DomUtil.create("option");
            option.innerHTML = whereClause;
            select.appendChild(option);
          });
          return select;

        },
		
		
        onRemove: function (map) {
          // Nothing to do here
        }
      });

      L.control.queryControl = function (opts) {
        return new L.Control.QueryControl(opts);
      };


     var streetTreeSearchLayer = L.esri.Geocoding.featureLayerProvider({
        url:
          "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/LAStreetTrees/FeatureServer/0",
        searchFields: ["COMMON_N"],
        label: "Tree Names",
        formatSuggestion: function (feature) {
          return feature.properties.COMMON_N;
        }
      });

      var streetTreeSearchLayer2 = L.esri.Geocoding.featureLayerProvider({
        url:
          "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/LAStreetTrees/FeatureServer/0",
        searchFields: ["STREET"],
        label: "Street Names",
        formatSuggestion: function (feature) {
          return feature.properties.STREET;
        }
      });


     var parkSearchLayer = L.esri.Geocoding.featureLayerProvider({
        url:
          "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Los_Angeles_Recreation_and_Parks_Boundaries/FeatureServer/0",
        searchFields: ["Name"],
        label: "Park Names",
        formatSuggestion: function (feature) {
          return feature.properties.Name;
        }
      });
	  
	var treeSearchLayer = L.esri.Geocoding.featureLayerProvider({
        url:
          "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Trees_(Recreation_and_Parks_Department)/FeatureServer/0",
        searchFields: ["X_COMMONNA"],
        label: "Tree Names (Common)",
        formatSuggestion: function (feature) {
          return feature.properties.X_COMMONNA;
        }
      });


var container = L.DomUtil.create('div', 'radio-buttons-container');
var RadioControl = L.Control.extend({
        options: {
            position: 'topleft'
        },

        onAdd: function (map) {
            // create the control container div with a particular class name
                        
                    //Example 3.12 line 2...Step 5: click listener for buttons
      

            //create range input element (slider)

            //kill any mouse event listeners on the map
            $(container).on('mousedown dblclick', function(e){
                L.DomEvent.stopPropagation(e);
            });
            return container;

        }
    });

function removeAllLayers() {
	try {
		map.removeLayer(parkTrees);
		map.removeLayer(streetTrees);
	}
	catch {
		
	}

}

var x = addSearchControl("Search Park",parkSearchLayer,parkTrees,"FACILITY = ");
var y = addSearchControl("Search Park Tree",treeSearchLayer,parkTrees,"X_COMMONNA = ");
var z = addSearchControl("Search Street Tree",streetTreeSearchLayer,streetTrees,"COMMON_N = ");
var v = addSearchControl("Search Street",streetTreeSearchLayer2,streetTrees,"STREET = ");
function hideParkButtons() {
	$('button.btn.btn-primary').remove("#park");
	$('button.btn.btn-primary').remove("#tree");
	try {
		removeSearchControl(x);
		removeSearchControl(y);
		
	}
	catch {
	}
}

function showStreetButtons() {
    $(container).append('<button type="button" class="btn btn-primary"  id="street" title="Street Filter">Filter by Street</button>');
    $(container).append('<button type="button" class="btn btn-primary"  id="streettree" title="Street Tree Filter">Filter by Tree</button>');
}

function hideStreetButtons() {
	$('button.btn.btn-primary').remove("#street");
	$('button.btn.btn-primary').remove("#streettree");	
		try {
		removeSearchControl(v);
		removeSearchControl(z);
		
	}
	catch {
	}
}

function showParkButtons() {
    $(container).append('<button type="button" class="btn btn-primary" id="park" title="Park Filter">Filter by Park</button>');
    $(container).append('<button type="button" class="btn btn-primary" id="tree" title="Park Tree Filter">Filter by Tree</button>');	
}


function createStreetButtons() {
var parkBool = false;
var treeBool = false;



    map.addControl(new RadioControl());
      $('button.btn.btn-primary').click(function(){
                if ($(this).attr('id') == 'street'){
					parkBool = true;
					treeBool = false;
					$(street).prop("disabled",true);
					$(streettree).prop("disabled",false);
					
					if (parkBool == false) {
						try {
							removeSearchControl(v);

						}
						catch {}
						
					}
					else if (parkBool == true) {
						v.addTo(map);
						removeSearchControl(z);

					}
	
				}
                else if ($(this).attr('id') == 'streettree'){
					parkBool = false;
					treeBool = true;
					$(streettree).prop("disabled",true);
					$(street).prop("disabled",false);
					
					if (treeBool == false) {
						try {
							removeSearchControl(z);
						}
						catch {}
						
					}
					else if (treeBool == true) {
						z.addTo(map);
						removeSearchControl(v);
					}

                }

                
            });

    };

function createParkButtons() {
var parkBool = false;
var treeBool = false;


    map.addControl(new RadioControl());
      $('button.btn.btn-primary').click(function(){
                if ($(this).attr('id') == 'park'){
					parkBool = true;
					treeBool = false;
					$(park).prop("disabled",true);
					$(tree).prop("disabled",false);
					
					if (parkBool == false) {
						try {
							removeSearchControl(x);

						}
						catch {}
						
					}
					else if (parkBool == true) {
						x.addTo(map);
						removeSearchControl(y);

					}
	
				}
                else if ($(this).attr('id') == 'tree'){
					parkBool = false;
					treeBool = true;
					$(tree).prop("disabled",true);
					$(park).prop("disabled",false);
					
					if (treeBool == false) {
						try {
							removeSearchControl(y);
						}
						catch {}
						
					}
					else if (treeBool == true) {
						y.addTo(map);
						removeSearchControl(x);
					}

                }

                
            });

    };

function createTopLevelButtons() {
var RadioControl = L.Control.extend({
        options: {
            position: 'topleft'
        },

        onAdd: function (map) {
            // create the control container div with a particular class name
                        
                    //Example 3.12 line 2...Step 5: click listener for buttons
      
            var container = L.DomUtil.create('div', 'radio-buttons-container');

            //create range input element (slider)
            $(container).append('<button type="button" class="btn btn-primary" id="tap" title="Park Filter">Find Trees at Parks</button>');
            $(container).append('<button type="button" class="btn btn-primary" id="tas" title="Street Filter">Find Trees at Streets</button>');
            //kill any mouse event listeners on the map
            $(container).on('mousedown dblclick', function(e){
                L.DomEvent.stopPropagation(e);
            });
            return container;

        }
    })
    map.addControl(new RadioControl());
      $('button.btn.btn-primary').click(function(){
                if ($(this).attr('id') == 'tap'){
                  destroyLayerControl();
                  map.setView([34.02, -118.205], 10);
					removeAllLayers();
					parkTrees.addTo(map);
					$(tap).prop("disabled",true);
					$(tas).prop("disabled",false);
					showParkButtons();
					hideStreetButtons();
					createParkButtons();
				}
                else if ($(this).attr('id') == 'tas'){
                  destroyLayerControl();
                  map.setView([34.02, -118.205], 10);
					removeAllLayers();
					streetTrees.addTo(map);
					$(tap).prop("disabled",false);
					$(tas).prop("disabled",true);
					showStreetButtons();
					hideParkButtons();
					createStreetButtons();

                }

                
            });

    };
	
	createTopLevelButtons();
	



function addSearchControl(placeholder,provider,source,where) {
	 const searchControl = L.esri.Geocoding.geosearch({
		placeholder: placeholder,
		expanded: true,
        providers: [provider]
      });
	  
	    searchControl.on("results", (data) => {
				if (data.text !== "") {
			   source.setWhere(where + "'" + data.text + "'");
         createLayerControl();
				}
      });
	  return searchControl;
}

function removeSearchControl(control){
	control.remove();
	
};

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

//var div = L.DomUtil.create('div', 'legend');
var div = L.DomUtil.create('div', 'legend');
div.innerHTML += "Tree " + (" <img src= assets/greencircle.png" + " height = 15"  + " width = 15" + " /><br>");
div.setAttribute("id","test123");
  return div;
 };




var legendControl = L.control.custom({
  position: 'bottomleft',
  content : '<button type="button" class="btn btn-primary" disabled = "true" id = "simple">Simple'+
            '    <img src="assets/simple.png" alt="Simple Icon" width = "25" height = "25" id = "simple" />'+
            '</button>'+
			'<button type="button" class="btn btn-primary" id = "treeheightbtn">Tree Height'+
            '    <img src="assets/height.png" alt="Tree Icon" width = "25" height = "25" id = "treeheightbtn" />'+
            '</button>'+
           '<button type="button" class="btn btn-primary" id = "treeformbtn">Tree Form'+
            '    <img src="assets/treeform.png" alt="Tree Icon" width = "25" height = "25" id = "treeformbtn" />'+
            '</button>'+
           '<button type="button" class="btn btn-primary" id = "treetypebtn">Tree Type'+
            '    <img src="assets/type.png" alt="Tree Icon" width = "25" height = "25" id = "treetypebtn" />'+
            '</button>',

           
  classes : 'btn-container',
  style   :
  {

  },
  datas   :
  {
      'foo': 'bar',
  },
  events:
  {
      click: function(data)
      {
    onSymbologyClicked(data);
      },
      dblclick: function(data)
      {
          console.log('wrapper div element dblclicked');
          console.log(data);
      },
      contextmenu: function(data)
      {
          console.log('wrapper div element contextmenu');
          console.log(data);
      },
  }
});


function updateLegend(id) {
	document.getElementById("test123").innerHTML = '';

	switch(id) {
		case "simple": {
		document.getElementById("test123").innerHTML += "Tree " + (" <img src= assets/greencircle.png" + " height = 20"  + " width = 20" + " /><br>");
		break;
		}
		
		case "treeheightbtn": {
			var grades = ["No Data","10-20 ft.", "20-30 ft.", "30-40 ft.", "40-50 ft.", "> 50 ft."],
			labels = ["assets/nodata.png", "assets/greencircle.png","assets/greencircle.png", "assets/greencircle.png", "assets/greencircle.png", "assets/greencircle.png"],
			sizes = ["10","10", "20", "30", "40","50"];
			// loop through our density intervals and generate a label with a colored square for each interval
			for (var i = 0; i < grades.length; i++) {
			  document.getElementById("test123").innerHTML +=
				  grades[i] + (" <img src= "+ labels[i] + " height = " + sizes[i] + " width = " + sizes[i] + " /><br>");
		  }
		  break;
	}
		case "treetypebtn": {
			var grades = ["No Data","Deciduous", "Evergreen", "Palm"],
			labels = ["assets/nodata.png", "assets/deciduous.png","assets/evergreen.png", "assets/palm.png"];
			// loop through our density intervals and generate a label with a colored square for each interval
			for (var i = 0; i < grades.length; i++) {
			  document.getElementById("test123").innerHTML +=
				  grades[i] + (" <img src= "+ labels[i] + " height = 20 width = 20" + " /><br>");
		  }
		  break;
	}
	
			case "treeformbtn": {
			var grades = ["No Data","Decurrent", "Excurrent", "Feather"],
			labels = ["assets/nodata.png","assets/deciduous.png","assets/evergreen.png", "assets/palm.png"];
			// loop through our density intervals and generate a label with a colored square for each interval
			for (var i = 0; i < grades.length; i++) {
			  document.getElementById("test123").innerHTML +=
				  grades[i] + (" <img src= "+ labels[i] + " height = 20 width = 20" + " /><br>");
		  }
		  break;
	}

}
}

function updatePopup(popuplayer,id) {
	
		     popuplayer.bindPopup(function (layer) {
		switch(id) {
			case "simple": {
				return L.Util.template("<b>Common Name: {X_COMMONNA}</b><br>Botanical Name: {Botanical_}<br>Family: {FAMILY}<br>Park: {FACILITY}<br>", layer.feature.properties);
			}
			case "treeheightbtn": {
				return L.Util.template("<b>Common Name: {X_COMMONNA}</b><br>Botanical Name: {Botanical_}<br>Family: {FAMILY}<br>Tree Height: {TREE_HEIGH}<br>Park: {FACILITY}<br>", layer.feature.properties);
			}
			case "treetypebtn": {
				return L.Util.template("<b>Common Name: {X_COMMONNA}</b><br>Botanical Name: {Botanical_}<br>Family: {FAMILY}<br>Tree Type: {TREETYPE}<br>Park: {FACILITY}<br>", layer.feature.properties);
			}
			case "treeformbtn": {
				return L.Util.template("<b>Common Name: {X_COMMONNA}</b><br>Botanical Name: {Botanical_}<br>Family: {FAMILY}<br>Tree Form: {TREEFORM}<br>Park: {FACILITY}<br>", layer.feature.properties);
			}
		}
      });
}

function resymbolize(id) {
switch(id) {
	
	
	 case "simple": {
		updatePopup(parkTrees,"simple");
		updateLegend("simple");
		parkTrees.eachFeature(function (layer) {  
		layer.setStyle({fillColor :'#40EE95', color: '40EE95', radius: 5}) 
    
  });
  break;
  }
  
  case "treeheightbtn": {
		updatePopup(parkTrees,"treeheightbtn");
	  	updateLegend("treeheightbtn");
		parkTrees.eachFeature(function (layer) {
		layer.setStyle({    color: '#40EE95',
        fillColor: '#40EE95',});
		if(layer.feature.properties.TREE_HEIGH == '10-20 ft. Small') {    
			layer.setStyle({radius : 4});
		}
		else if (layer.feature.properties.TREE_HEIGH == '20-30 ft. Small') {
			layer.setStyle({radius : 7});
		}
		else if (layer.feature.properties.TREE_HEIGH == '30-40 ft. Medium') {
			layer.setStyle({radius : 10});
		}
		else if (layer.feature.properties.TREE_HEIGH == '40-50 ft. Medium') {
			layer.setStyle({radius : 13});
		}
		else if (layer.feature.properties.TREE_HEIGH == '> 50 ft. Large') {
			layer.setStyle({radius : 16});
		}
		else {
				layer.setStyle({radius : 5, fillColor: "#9DBBAC", color: "#9DBBAC" });
		
		}

		
		
	});
  break;
  }
      case "treetypebtn": {
		updatePopup(parkTrees,"treetypebtn");
		updateLegend("treetypebtn");
		parkTrees.eachFeature(function (layer) {  
		if(layer.feature.properties.TREETYPE == 'Palm') {    
			layer.setStyle({radius: 5, fillColor :'#A67B51', color: '#A67B51'}) 
		}
		else if(layer.feature.properties.TREETYPE == 'Deciduous') {    
			layer.setStyle({radius: 5, fillColor :'#f0a900', color: '#f0a900'}) 
		}
		else if(layer.feature.properties.TREETYPE == 'Evergreen') {    
			layer.setStyle({radius: 5, fillColor :'#0CAE5B', color: '#0CAE5B'}) 
		}
		else {    
			layer.setStyle({radius : 5, fillColor: "#9DBBAC", color: "#9DBBAC" });
		}

  });
  break;
  }
  
      case "treeformbtn": {
		updatePopup(parkTrees,"treeformbtn");
		updateLegend("treeformbtn");
		parkTrees.eachFeature(function (layer) {  
		if(layer.feature.properties.TREEFORM == 'Decurrent') {    
			layer.setStyle({radius: 5, fillColor :'#A67B51', color: '#A67B51'}) 
		}
		else if(layer.feature.properties.TREEFORM == 'Excurrent') {    
			layer.setStyle({radius: 5, fillColor :'#f0a900', color: '#f0a900'}) 
		}
		else if(layer.feature.properties.TREEFORM == 'Feather') {    
			layer.setStyle({radius: 5, fillColor :'#0CAE5B', color: '#0CAE5B'}) 
		}
		else {    
			layer.setStyle({radius : 5, fillColor: "#9DBBAC", color: "#9DBBAC" });
		}

  });
  break;
  }
  
  default: {
    console.log(id);
    parkTrees.eachFeature(function (layer) {
      layer.setStyle({color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
      radius: 5, })
});
break;
    }
  }
  
  
}


function onSymbologyClicked(data) {
if (data.srcElement.id == "treetypebtn") {
    $("#treeheightbtn").prop("disabled",false);
    $("#treetypebtn").prop("disabled",true);
	$("#simple").prop("disabled",false);
	$("#treeformbtn").prop("disabled",false);


  resymbolize("treetypebtn");


}

else if (data.srcElement.id == "simple") {
      resymbolize("simple");
	$("#simple").prop("disabled",true);
    $("#treeheightbtn").prop("disabled",false);
    $("#treetypebtn").prop("disabled",false);
	$("#treeformbtn").prop("disabled",false);


}


else if (data.srcElement.id == "treeheightbtn") {
      resymbolize("treeheightbtn");
	$("#simple").prop("disabled",false);
    $("#treeheightbtn").prop("disabled",true);
    $("#treetypebtn").prop("disabled",false);
	$("#treeformbtn").prop("disabled",false);
}

else if (data.srcElement.id == "treeformbtn") {
      resymbolize("treeformbtn");
	$("#simple").prop("disabled",false);
    $("#treeheightbtn").prop("disabled",false);
    $("#treetypebtn").prop("disabled",false);
	$("#treeformbtn").prop("disabled",true);
}
}

function createLayerControl() {

legend.addTo(map);
legendControl.addTo(map);

}

function destroyLayerControl() {
legendControl.remove();
legend.remove();
}

