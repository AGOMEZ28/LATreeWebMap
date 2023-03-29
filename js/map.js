      const map = L.map("map", {
        minZoom: 2,
		maxZoom: 20
      })

      map.setView([34.02, -118.205], 10);

      const apiKey = "AAPKb752a08ab5404f8581977fcefc50129f72b2k0kO6jQmNu8VXUEyo-SF1nMWS-8s2EED6s4v9aACHjJZLNzfDok6GvkcEC5M";

      const basemapLayers = {

        //Streets: L.esri.Vector.vectorBasemapLayer("ArcGIS:Streets", { apiKey: apiKey }),

        Navigation: L.esri.Vector.vectorBasemapLayer("ArcGIS:Navigation", { apiKey: apiKey }),
        Topographic: L.esri.Vector.vectorBasemapLayer("ArcGIS:Topographic", { apiKey: apiKey }),
        "Light Gray": L.esri.Vector.vectorBasemapLayer("ArcGIS:LightGray", { apiKey: apiKey }),
        "Dark gray": L.esri.Vector.vectorBasemapLayer("ArcGIS:DarkGray", { apiKey: apiKey }).addTo(map),
        //"Streets Relief": L.esri.Vector.vectorBasemapLayer("ArcGIS:StreetsRelief", { apiKey: apiKey }),
        Imagery: L.esri.Vector.vectorBasemapLayer("ArcGIS:Imagery", { apiKey: apiKey }),
        //ChartedTerritory: L.esri.Vector.vectorBasemapLayer("ArcGIS:ChartedTerritory", { apiKey: apiKey }),
        //ColoredPencil: L.esri.Vector.vectorBasemapLayer("ArcGIS:ColoredPencil", { apiKey: apiKey }),
        //Nova: L.esri.Vector.vectorBasemapLayer("ArcGIS:Nova", { apiKey: apiKey }),
        //Midcentury: L.esri.Vector.vectorBasemapLayer("ArcGIS:Midcentury", { apiKey: apiKey }),
        //OSM: L.esri.Vector.vectorBasemapLayer("OSM:Standard", { apiKey: apiKey }),
        //"OSM:Streets": L.esri.Vector.vectorBasemapLayer("OSM:Streets", { apiKey: apiKey })
      };


      L.control.layers(basemapLayers, null, { collapsed: false }).addTo(map);

      
                  var parkBoundaries = L.esri
        .featureLayer({
          url:        "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Los_Angeles_Recreation_and_Parks_Boundaries/FeatureServer/0",
          fillColor: '#2ca25f',
          color: '#2ca25f',
          fillOpacity: 5,
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
        disableClusteringAtZoom: 20,
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
        disableClusteringAtZoom: 20,
		
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
    color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 5
    };
          return new L.CircleMarker(latlng,myStyle);
    
            },
    
		
		
		
		
		
		  where: "1 = 0"
        });
      parkTrees.addTo(map);
	  
	  
	     parkTrees.bindPopup(function (layer) {

        return L.Util.template("<b>Common Name: {X_COMMONNA}</b><br>Botanical Name: {Botanical_}<br>Family: {FAMILY}</br>Park: {FACILITY}<br>", layer.feature.properties);

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
	$(".radio").remove("#park");
	$(".radio").remove("#tree");
	try {
		removeSearchControl(x);
		removeSearchControl(y);
		
	}
	catch {
	}
}

function showStreetButtons() {
    $(container).append('<button class="radio" id="street" title="Street Filter">Filter by Street</button>');
    $(container).append('<button class="radio" id="streettree" title="Street Tree Filter">Filter by Tree</button>');
}

function hideStreetButtons() {
	$(".radio").remove("#street");
	$(".radio").remove("#streettree");	
		try {
		removeSearchControl(v);
		removeSearchControl(z);
		
	}
	catch {
	}
}

function showParkButtons() {
    $(container).append('<button class="radio" id="park" title="Park Filter">Filter by Park</button>');
    $(container).append('<button class="radio" id="tree" title="Park Tree Filter">Filter by Tree</button>');	
}


function createStreetButtons() {
var parkBool = false;
var treeBool = false;



    map.addControl(new RadioControl());
      $('.radio').click(function(){
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
      $('.radio').click(function(){
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
            $(container).append('<button class="radio" id="tap" title="Park Filter">Find Trees at Parks</button>');
            $(container).append('<button class="radio" id="tas" title="Street Filter">Find Trees at Streets</button>');
            //kill any mouse event listeners on the map
            $(container).on('mousedown dblclick', function(e){
                L.DomEvent.stopPropagation(e);
            });
            return container;

        }
    })
    map.addControl(new RadioControl());
      $('.radio').click(function(){
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

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

var div = L.DomUtil.create('div', 'legend'),
grades = ["Car", "ball"],
labels = ["assets/height.png","assets/type.png"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          grades[i] + (" <img src="+ labels[i] +" height='50' width='50'>") +'<br>';
  }

  return div;
 };




var legendControl = L.control.custom({
  position: 'bottomleft',
  content : '<button type="button" class="treeIconButton" disabled = "true" id = "treeheightbtn">Tree Height'+
            '    <img src="assets/height.png" alt="Tree Icon" width = "25" height = "25">'+
            '</button>'+
           '<button type="button" class="treeIconButton" id = "treetypebtn">Tree Type'+
            '    <img src="assets/type.png" alt="Tree Icon" width = "25" height = "25">'+
            '</button>',
           
  classes : 'btn-group-vertical btn-group-sm',
  style   :
  {
      margin: '10px',
      padding: 20,
      cursor: 'pointer',
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


function resymbolize(id) {
switch(id) {
  case "treeheightbtn": {
          console.log(id);

    parkTrees.eachFeature(function (layer) {  
    if(layer.feature.properties.TREETYPE == 'Evergreen') {    
    layer.setStyle({fillColor :'blue', color: 'blue'}) 
    }
  });
  break;
  }
  
  
      case "treetypebtn": {
              console.log(id);

    parkTrees.eachFeature(function (layer) {  
    if(layer.feature.properties.TREETYPE == 'Palm') {    
    layer.setStyle({fillColor :'pink', color: 'pink'}) 
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
  resymbolize("treeheightbtn");


}


if (data.srcElement.id == "treeheightbtn") {
      resymbolize("treetypebtn");

    $("#treeheightbtn").prop("disabled",true);
    $("#treetypebtn").prop("disabled",false);

}
}

function createLayerControl() {


legendControl.addTo(map);
legend.addTo(map);

}

function destroyLayerControl() {
legendControl.remove();
legend.remove();
}

