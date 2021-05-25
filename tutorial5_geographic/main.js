/**
 * CONSTANTS AND GLOBALS
 * */
 const width = window.innerWidth * 0.9,
 height = window.innerHeight * 0.7,
 margin = { top: 20, bottom: 50, left: 60, right: 40 };

/** these variables allow us to access anything we manipulate in
* init() but need access to in draw().
* All these variables are empty before we assign something to them.*/
let svg;

/**
* APPLICATION STATE
* */
let state = {
 // + SET UP STATE
 geojson: null,
 Temperature: null,
 hover: {
  stateName : null, 
  screenPosition: null, 
  //mapPosition: null,
  //Lat: null, // value of long 
  //Long: null, // value of lat
  Delta: null,
  visible: false,
 }
};

/**
* LOAD DATA
* Using a Promise.all([]), we can load more than one dataset at a time
* */
Promise.all([
 d3.json("../data/usState.json"),
 d3.csv("../data/usHeatExtremes.csv", d3.autoType),
]).then(([geojson, Temperature]) => {
 // + SET STATE WITH DATA
 state.geojson = geojson
 state.Temperature = Temperature
 console.log("state: ", state);
 init();
});

/**
* INITIALIZING FUNCTION
* this will be run *one time* when the data finishes loading in
* */
function init() {
 const projection = d3.geoAlbersUsa() //establishes projection 
 .fitSize([width, height], state.geojson)

 const colorScale = d3.scaleLinear([0, d3.max(state.Temperature)])
 //const colorSCale = d3.scaleSequential(d3.interpolateblues)
 //.domain(d3.extent(state.Temperature, d=> d.TempFluct))
 
 const pathFunction = d3.geoPath(projection)

// create an svg element in our main 'd3-container' element 
 svg = d3
   .select("#d3-container")
   .append("svg")
   .attr("width", width)
   .attr("height", height);


// base layer of states
const states = svg.selectAll("path")
.data(state.geojson.features)
.join("path")
.attr("stroke", "#fff")
.attr('stroke-linejoin', "round")
.attr("stroke-linecap", "round")
.attr("fill", "#ddd")
.attr("d", pathFunction)

// create circles

const dots = svg.selectAll("circle")
.data(state.Temperature)
.join("circle")
.attr("stroke", "none")
//.attr ("r", 5)
.attr("fill-opacity", "0.4")
.attr("fill", d=>{
//return colorScale(d.TempFluct) 
if (d.TempFluct>0) return "#b03d0b" 
 else if (d.TempFluct===0) return "#a9a9a9" 
 else if (d.TempFluct<0) return "#2a1363" 
})

 .attr("r", d=>{ 
 if (d.TempFluct>20) return 8;
 else if (d.TempFluct<-20) return 8;
 else if (d.TempFluct===0) return 3;
 })
 
.attr("transform", d=>{
 const point = projection([d.Long, d.Lat])
 return `translate(${point[0]}, ${point[1]})`
})



//Mouse hover function

states.on("mouseover", function(event, d){
 const {clientX, clientY} = event

 const [long, lat] = projection.invert([clientX, clientY])

 state.hover= {
   stateName: [d.properties.NAME],
   Delta: d.TempFluct,
   screenPosition: [clientX, clientY],
   mapPosition: [long, lat], 
   visible: true,
 }

 draw();

}).on("mouseout", event => {
  state.hover.visible = true
  draw(); // calls the draw function
})

draw();
}

/**
* DRAW FUNCTION
* we call this everytime there is an update to the data/state
* */
function draw() {

d3.select("#d3-container") // want to add
   .selectAll('div.hover-content')
   .data([state.hover])
   .join("div")
   .attr("class", 'hover-content')
   .classed("visible", d=> d.visible)
   .style("position", 'absolute')
   .style("transform", d=> {
     // only move if we have a value for screenPosition
     if (d.screenPosition)
     return `translate(${d.screenPosition[0]}px, ${d.screenPosition[1]}px)`
   })
   .html(d=> {
     return `
     <div> State: ${d.stateName}
      Coordinates: ${d.mapPosition}
      Delta: ${d.Delta}</div>`})
 }