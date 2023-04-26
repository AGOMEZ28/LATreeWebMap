      $('#help').click(function(){ 
        document.getElementById("container").style.display = "block";
	  })
     
    $('#closePopup').click(function(){ 
      document.getElementById("container").style.display = "none";

  })

  $('#info').click(function(){ 
    document.getElementById("container2").style.display = "block";
})
 
$('#closePopup2').click(function(){ 
  document.getElementById("container2").style.display = "none";

})

$('#closeButton').click(function(){ 
  document.getElementById("container").style.display = "none";

})

$('#closeButton2').click(function(){ 
  document.getElementById("container2").style.display = "none";

})

	 const map = L.map("map", {
        minZoom: 2,
		attributionControl: false,
		maxZoom: 20,
    zoomControl: false
      })

      map.setView([34.02, -118.205], 10);
      var zoomHome = L.Control.zoomHome();
      zoomHome.addTo(map);

      const apiKey = "AAPKb752a08ab5404f8581977fcefc50129f72b2k0kO6jQmNu8VXUEyo-SF1nMWS-8s2EED6s4v9aACHjJZLNzfDok6GvkcEC5M";

      const basemapLayers = {

        Navigation: L.esri.Vector.vectorBasemapLayer("ArcGIS:Navigation", { apiKey: apiKey }),
        Topographic: L.esri.Vector.vectorBasemapLayer("ArcGIS:Topographic", { apiKey: apiKey }),
        "Light Gray": L.esri.Vector.vectorBasemapLayer("ArcGIS:LightGray", { apiKey: apiKey }),
        "Dark gray": L.esri.Vector.vectorBasemapLayer("ArcGIS:DarkGray", { apiKey: apiKey }).addTo(map),
        Imagery: L.esri.Vector.vectorBasemapLayer("ArcGIS:Imagery", { apiKey: apiKey }),

      };


      L.control.layers(basemapLayers, null, { collapsed: false, position: 'topright'}).addTo(map);
      
      var laBoundaries = L.esri
      .featureLayer({
        url:        "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/CityOfLA/FeatureServer/0",
        fillColor: '#2ca25f',
        color: 'black',
        fillOpacity: 0.0,
        stroke:true,
        weight:3
      });
      
                  var parkBoundaries = L.esri
        .featureLayer({
          url:        "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/LAParkBounds/FeatureServer/0",
          fillColor: '#2ca25f',
          color: '#2ca25f',
          fillOpacity: 0.6,
          stroke:false
        });
      
      parkBoundaries.bindPopup(function (layer) {

        return L.Util.template("<b>{FACILITY}</b><br>{Address}</br>", layer.feature.properties);

      });
	  
     
	
      
            var streetTrees = L.esri.Cluster
        .featureLayer({
          url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/FilteredStreetTrees/FeatureServer/0",
		  spiderfyOnMaxZoom: false,
		  removeOutsideVisibleBounds: true,
        disableClusteringAtZoom: 17,
                pointToLayer: function (feature, latlng) {
          var myStyle = {
            color: '#0CAE5B',
            fillColor: '#0CAE5B',
            fillOpacity: 1,
            stroke: true,
            weight:1,
            color:'white',
            radius: 5
    };
          return new L.CircleMarker(latlng,myStyle);
    
            },
		  where: "1 = 0"

        });
      streetTrees.addTo(map);
	  
	  	streetTrees.bindPopup(function (layer) {

        return L.Util.template("<b>{COMMON}</b><br>Botanical Name: {BOTANICAL}<br>Family: {FAMILY}<br>Genus: {GENUS}<br>Address: {Street_}<br>", layer.feature.properties);

      });
	  
	    const parkTrees = L.esri.Cluster
        .featureLayer({
          url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/ParkTreesFinal/FeatureServer/0",
		  spiderfyOnMaxZoom: false,
		  removeOutsideVisibleBounds: true,
        disableClusteringAtZoom: 17,
		
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
    color: '#0CAE5B',
        fillColor: '#0CAE5B',
        fillOpacity: 1,
        stroke: true,
        weight:1,
        color:'white',
        radius: 5
    };
          return new L.CircleMarker(latlng,myStyle);
    
            },
    
		
            where: "1 = 0"

		
		
		
        });
      parkTrees.addTo(map);
	  
	     parkTrees.bindPopup(function (layer) {

        return L.Util.template("<b>{COMMON}</b><br>Botanical Name: {Botanical_}<br>Family: {FAMILY}<br>Genus: {GENUS}<br>Park: {FACILITY_1}<br>", layer.feature.properties);

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
          "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/FilteredStreetTrees/FeatureServer/0",
        searchFields: ["COMMON"],
        label: "Tree Names",
        formatSuggestion: function (feature) {
          return feature.properties.COMMON;
        }
      });
	  


      var streetTreeSearchLayer2 = L.esri.Geocoding.featureLayerProvider({
        url:
          "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/FilteredStreetTrees/FeatureServer/0",
        searchFields: ["Street_2"],
        label: "Street Names",
        formatSuggestion: function (feature) {
          return feature.properties.Street_2;
        }
      });


     var parkSearchLayer = L.esri.Geocoding.featureLayerProvider({
        url:
          "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/ParkTreesFinal/FeatureServer/0",
        searchFields: ["FACILITY_1"],
        label: "Park Names",
        formatSuggestion: function (feature) {
          return feature.properties.FACILITY_1;
        }
      });
	  
	var treeSearchLayer = L.esri.Geocoding.featureLayerProvider({
        url:
          "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/ParkTreesFinal/FeatureServer/0",
        searchFields: ["COMMON"],
        label: "Tree Names (Common)",
        formatSuggestion: function (feature) {
          return feature.properties.COMMON;
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
    parkTrees.setWhere("where 1 = 0").addTo(map);
		streetTrees.setWhere("where 1 = 0").addTo(map);

		//map.removeLayer(parkTrees);
		//map.removeLayer(streetTrees);
	}
	catch {
		
	}

}

var x = addSearchControl("Search Park",parkSearchLayer,parkTrees,"FACILITY_1 = ",false);
var y = addSearchControl("Search Park Tree",treeSearchLayer,parkTrees,"COMMON = ",false);
var z = addSearchControl("Search Street Tree",streetTreeSearchLayer,streetTrees,"COMMON = ",true);
var v = addSearchControl("Search Street",streetTreeSearchLayer2,streetTrees,"Street_2 = ",true);
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
					$("#searchTitle").text("Los Angeles Tree Web Map");
					map.removeLayer(laBoundaries);

					var layerControlElement = document.getElementsByClassName('leaflet-control-layers')[0];
					layerControlElement.getElementsByTagName('input')[3].click();
					console.log(parkTrees.getWhere());
					parkBoundaries.addTo(map);
					$(tap).prop("disabled",true);
					$(tas).prop("disabled",false);
					showParkButtons();
					hideStreetButtons();
					createParkButtons();
				}
                else if ($(this).attr('id') == 'tas'){
                  destroyLayerControl();
                  map.setView([34.02, -118.205], 10);
					map.removeLayer(parkBoundaries);
					$("#searchTitle").text("Los Angeles Tree Web Map");

					removeAllLayers();
					var layerControlElement = document.getElementsByClassName('leaflet-control-layers')[0];
					layerControlElement.getElementsByTagName('input')[0].click();
					//streetTrees.addTo(map);
          laBoundaries.addTo(map);
					$(tap).prop("disabled",false);
					$(tas).prop("disabled",true);
					showStreetButtons();
					hideParkButtons();
					createStreetButtons();

                }

                
            });

    };
	
	createTopLevelButtons();
	

function capitalizeFirstLetter(string) {
	var x = string.toLowerCase();
    return x.charAt(0).toUpperCase() + x.slice(1).toUpperCase();
}

function addSearchControl(placeholder,provider,source,where,isStreetData) {
	 const searchControl = L.esri.Geocoding.geosearch({
		placeholder: placeholder,
		expanded: true,
        providers: [provider],
		useMapBounds: false,
		title: placeholder
      });
	  
	    searchControl.on("results", (data) => {
				if (data.text !== "") {
					console.log(data.text);
					$("#searchTitle").text(data.text);
			   source.setWhere(where + "'" + data.text + "'");
		if (isStreetData == true) { createLayerControl(1)}
		else {
         createLayerControl(2);
		}
				}
        else {
          console.log("no results");
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

div.innerHTML += "Trees " + (" <img src= assets/greencircle.png" + " height = 15"  + " width = 15" + " /><br>");
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

var legendControl2 = L.control.custom({
  position: 'bottomleft',
  content : '<button type="button" class="btn btn-primary" disabled = "true" id = "simple">Simple'+
            '    <img src="assets/simple.png" alt="Simple Icon" width = "25" height = "25" id = "simple" />'+
            '</button>'+
            '<button type="button" class="btn btn-primary" id = "treelocationbtn">Tree Design'+
            '    <img src="assets/treewell.png" alt="Tree Icon" width = "25" height = "25" id = "treelocationbtn" />'+
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
		document.getElementById("test123").innerHTML += "Trees " + (" <img src= assets/basictree.png" + " height = 20"  + " width = 20" + " /><br>");
		break;
		}
		
		case "treeheightbtn": {
			var grades = ["Other/No Data","10-20 ft.", "20-30 ft.", "30-40 ft.", "40-50 ft.", "> 50 ft."],
			labels = ["assets/nodata.png", "assets/basictree.png","assets/basictree.png", "assets/basictree.png", "assets/basictree.png", "assets/basictree.png"],
			sizes = ["10","10", "20", "30", "40","50"];
			// loop through our density intervals and generate a label with a colored square for each interval
			for (var i = 0; i < grades.length; i++) {
			  document.getElementById("test123").innerHTML +=
				  grades[i] + (" <img src= "+ labels[i] + " height = " + sizes[i] + " width = " + sizes[i] + " /><br>");
		  }
		  break;
	}
  case "treelocationbtn": {
    var grades = ["Other/No Data","Tree", "Tree in Tree Well", "Tree Well Only"],
    labels = ["assets/nodata.png", "assets/basictree.png","assets/treeintreewell.png", "assets/gymnosperm.png"];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      document.getElementById("test123").innerHTML +=
        grades[i] + (" <img src= "+ labels[i] + " height =  20 width = 20"+ " /><br>");
    }
    break;
}

		case "treetypebtn": {
			var grades = ["Other/No Data","Deciduous", "Evergreen","Gymnosperm","Palm"],
			labels = ["assets/nodata.png", "assets/deciduous.png","assets/evergreen.png","assets/gymnosperm.png", "assets/palm.png"];
			// loop through our density intervals and generate a label with a colored square for each interval
			for (var i = 0; i < grades.length; i++) {
			  document.getElementById("test123").innerHTML +=
				  grades[i] + (" <img src= "+ labels[i] + " height = 20 width = 20" + " /><br>");
		  }
		  break;
	}
	
			case "treeformbtn": {
			var grades = ["Other/No Data","Decurrent", "Excurrent"],
			labels = ["assets/nodata.png","assets/basictree.png","assets/palm.png"];
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
		if (popuplayer == parkTrees) {
			switch(id) {
				case "simple": {
					return L.Util.template("<b>{COMMON}</b><br>Botanical Name: {Botanical_}<br>Family: {FAMILY}<br>Genus: {GENUS}<br>Park: {FACILITY_1}<br>", layer.feature.properties);
				}
				case "treeheightbtn": {
					return L.Util.template("<b>{COMMON}</b><br>Botanical Name: {Botanical_}<br>Family: {FAMILY}<br>Genus: {GENUS}<br>Tree Height: {TREE_HEIGH}<br>Park: {FACILITY}<br>", layer.feature.properties);
				}
				case "treetypebtn": {
					return L.Util.template("<b>{COMMON}</b><br>Botanical Name: {Botanical_}<br>Family: {FAMILY}<br>Genus: {GENUS}<br>Tree Type: {TREETYPE}<br>Park: {FACILITY}<br>", layer.feature.properties);
				}
				case "treeformbtn": {
					return L.Util.template("<b>{COMMON}</b><br>Botanical Name: {Botanical_}<br>Family: {FAMILY}<br>Genus: {GENUS}<br>Tree Form: {TREEFORM}<br>Park: {FACILITY}<br>", layer.feature.properties);
				}
			}
		}
		else if (popuplayer == streetTrees) {
			switch(id) {
				case "simple": {
					return L.Util.template("<b>{COMMON}</b><br>Botanical Name: {Botanical_}<br>Family: {FAMILY}<br>Genus: {GENUS}<br>Address: {Street_}<br>", layer.feature.properties);
				}
				case "treelocationbtn": {
					return L.Util.template("<b>{COMMON}</b><br>Botanical Name: {Botanical_}<br>Family: {FAMILY}<br>Genus: {GENUS}<br>Tree Design: {Type_Descr}<br>Address: {Street_}<br>", layer.feature.properties);
				}
				case "treetypebtn": {
					return L.Util.template("<b>{COMMON}</b><br>Botanical Name: {Botanical_}<br>Family: {FAMILY}<br>Genus: {GENUS}<br>Tree Type: {TREETYPE}<br>Address: {Street_}<br>", layer.feature.properties);
				}
				case "treeformbtn": {
					return L.Util.template("<b>{COMMON}</b><br>Botanical Name: {Botanical_}<br>Family: {FAMILY}<br>Genus: {GENUS}<br>Tree Form: {TREEFORM}<br>Address: {Street_}<br>", layer.feature.properties);
				}
			}			
		}
      });
}

function setStyle(feat) {
			feat.eachFeature(function (layer) {  
		layer.setStyle({fillColor :'#0CAE5B', radius: 5, stroke: true,
    weight:1,
    color:'white',}) 
    
  });
	
}

function resymbolize(id) {
switch(id) {
	
	
	 case "simple": {
		updatePopup(parkTrees,"simple");
		updatePopup(streetTrees,"simple");

		updateLegend("simple");
		setStyle(parkTrees);
		setStyle(streetTrees);
  break;
  }
  
  case "treeheightbtn": {
		updatePopup(parkTrees,"treeheightbtn");

	  	updateLegend("treeheightbtn");
		parkTrees.eachFeature(function (layer) {
		layer.setStyle({ 
        fillColor: '#0CAE5B',        stroke: true,
        weight:1,
        color:'white',});
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
				layer.setStyle({radius : 5, fillColor: "#9DBBAC",         stroke: true,
        weight:1,
        color:'white', });
		
		}

		
		
	});
	

  break;
  }

  case "treelocationbtn": {
		updatePopup(streetTrees,"treelocationbtn");

	  	updateLegend("treelocationbtn");
		streetTrees.eachFeature(function (layer) {
		layer.setStyle({    color: 'white', radius: 5,
        fillColor: '#0CAE5B',});
		if(layer.feature.properties.Type_Descr == 'Tree') {    
			
			layer.setStyle({fillColor : '#0CAE5B', color: 'white', stroke: true, weight: 1, radius: 5});
		}
		else if (layer.feature.properties.Type_Descr == 'Tree in Tree Well') {
			layer.setStyle({fillColor : '#bddd97', color: 'white', stroke: true, weight: 1, radius: 5});
		}
		else if (layer.feature.properties.Type_Descr == 'Tree Well Only') {
			layer.setStyle({fillColor: '#30694B', color: 'white', stroke: true, weight: 1, radius: 5});
		}
		else {
				layer.setStyle({fillColor: "#9DBBAC", color: "#9DBBAC" });
		
		}

		
		
	});
  break;
}

      case "treetypebtn": {
		updatePopup(parkTrees,"treetypebtn");
		updatePopup(streetTrees,"treetypebtn");

		updateLegend("treetypebtn");
		parkTrees.eachFeature(function (layer) {  
		if(layer.feature.properties.TREETYPE == 'Palm') {    
			layer.setStyle({radius: 5, fillColor :'#A67B51', color: 'white', stroke: true, weight: 1}) 
		}
		else if(layer.feature.properties.TREETYPE == 'Deciduous') {    
			layer.setStyle({radius: 5, fillColor :'#f0a900', color: 'white', stroke: true, weight: 1}) 
		}
		else if(layer.feature.properties.TREETYPE == 'Evergreen') {    
			layer.setStyle({radius: 5, fillColor :'#0CAE5B', color: 'white', stroke: true, weight: 1}) 
		}
    else if(layer.feature.properties.TREETYPE == 'Gymnosperm') {    
			layer.setStyle({radius: 5, fillColor :'#30694B', color: 'white', stroke: true, weight: 1}) 
		}
		else {    
			layer.setStyle({radius : 5, fillColor: "#9DBBAC", color: 'white', stroke: true, weight: 1});
		}

  });
  		streetTrees.eachFeature(function (layer) {  
		if(layer.feature.properties.TREETYPE == 'Palm') {    
			layer.setStyle({radius: 5, fillColor :'#A67B51', color: 'white', stroke: true, weight: 1}) 
		}
		else if(layer.feature.properties.TREETYPE == 'Deciduous') {    
			layer.setStyle({radius: 5, fillColor :'#f0a900', color: 'white', stroke: true, weight: 1}) 
		}
		else if(layer.feature.properties.TREETYPE == 'Evergreen') {    
			layer.setStyle({radius: 5, fillColor :'#0CAE5B', color: 'white', stroke: true, weight: 1}) 
		}
    else if(layer.feature.properties.TREETYPE == 'Gymnosperm') {    
			layer.setStyle({radius: 5, fillColor :'#30694B', color: 'white', stroke: true, weight: 1}) 
		}
		else {    
			layer.setStyle({radius : 5, fillColor: "#9DBBAC", color: 'white', stroke: true, weight: 1 });
		}

  });
  
  break;
  }
  
      case "treeformbtn": {
		updatePopup(parkTrees,"treeformbtn");
		updatePopup(streetTrees,"treeformbtn");

		updateLegend("treeformbtn");
		parkTrees.eachFeature(function (layer) {  
      if(layer.feature.properties.TREEFORM == 'Decurrent') {    
        layer.setStyle({radius: 5, fillColor :'#0CAE5B', color: 'white',stroke:true,weight:1,fillRule:'evenodd',lineCap:'square'}) 
      }
      else if(layer.feature.properties.TREEFORM == 'Excurrent') {    
        layer.setStyle({radius: 5, fillColor :'#A67B51', color: 'white',stroke:true,weight:1,fillRule:'nonzero'}) 
      }
      else {    
        layer.setStyle({radius : 5, fillColor: "#9DBBAC", color: "white",stroke:true,weight:1 });
      }
  });
		streetTrees.eachFeature(function (layer) {  
		if(layer.feature.properties.TREEFORM == 'Decurrent') {    
			layer.setStyle({radius: 5, fillColor :'#0CAE5B', color: 'white',stroke:true,weight:1,fillRule:'evenodd',lineCap:'square'}) 
		}
		else if(layer.feature.properties.TREEFORM == 'Excurrent') {    
			layer.setStyle({radius: 5, fillColor :'#A67B51', color: 'white',stroke:true,weight:1,fillRule:'nonzero'}) 
		}
		else {    
			layer.setStyle({radius : 5, fillColor: "#9DBBAC", color: "white",stroke:true,weight:1 });
		}

  });
  break;
  }
  
  default: {
    console.log(id);
    parkTrees.eachFeature(function (layer) {
      layer.setStyle({color: '#0CAE5B',
  fillColor: '#f03',
  fillOpacity: 0,
      radius: 5, })
});
break;
    }
  }
  
  
}


function onSymbologyClicked(data) {
if (data.srcElement.id == "treetypebtn") {
  resymbolize("treetypebtn");
    $("#treeheightbtn").prop("disabled",false);
    $("#treetypebtn").prop("disabled",true);
	$("#simple").prop("disabled",false);
	$("#treeformbtn").prop("disabled",false);
  $("#treelocationbtn").prop("disabled",false);





}

else if (data.srcElement.id == "treelocationbtn") {
      resymbolize("treelocationbtn");
	$("#simple").prop("disabled",false);
    $("#treeheightbtn").prop("disabled",false);
    $("#treetypebtn").prop("disabled",false);
	$("#treeformbtn").prop("disabled",false);
  $("#treelocationbtn").prop("disabled",true);



}

else if (data.srcElement.id == "simple") {
  resymbolize("simple");
$("#simple").prop("disabled",true);
$("#treeheightbtn").prop("disabled",false);
$("#treetypebtn").prop("disabled",false);
$("#treeformbtn").prop("disabled",false);
$("#treelocationbtn").prop("disabled",false);

}

else if (data.srcElement.id == "treeheightbtn") {
      resymbolize("treeheightbtn");
	$("#simple").prop("disabled",false);
    $("#treeheightbtn").prop("disabled",true);
    $("#treetypebtn").prop("disabled",false);
	$("#treeformbtn").prop("disabled",false);
  $("#treelocationbtn").prop("disabled",false);

}

else if (data.srcElement.id == "treeformbtn") {
      resymbolize("treeformbtn");
	$("#simple").prop("disabled",false);
    $("#treeheightbtn").prop("disabled",false);
    $("#treetypebtn").prop("disabled",false);
	$("#treeformbtn").prop("disabled",true);
  $("#treelocationbtn").prop("disabled",false);

}
}

function createLayerControl(id) {

legend.addTo(map);
if (id == 1) {
	legendControl2.addTo(map);
  console.log("simple resymbolize");
  resymbolize("simple");
	
} 
else if (id == 2) {
	legendControl.addTo(map);
  console.log("simple resymbolize");
  resymbolize("simple");
	
}

}

function destroyLayerControl(id) {
legendControl.remove();
legendControl2.remove();
legend.remove();
}

