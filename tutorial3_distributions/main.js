/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = { top: 30, bottom: 80, left: 100, right: 40 },
  radius = 6;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;
let colorScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedIncome: "All" // + YOUR FILTER SELECTION
};

/* LOAD DATA */
d3.csv("co2gdp.csv", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

//mat.log("co2gdp.csv")

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in 
function init() {
  console.log('State', state)

  // + SCALES
  xScale = d3.scaleLog()
  .domain(d3.extent(state.data, d=> d.gdp))
  .range([margin.left, width - margin.right])

  yScale = d3.scaleLog()
  .domain(d3.extent(state.data, d=> d.co2)) // [min, max]
  .range([height-margin.bottom, margin.top])

  colorScale = d3.scaleOrdinal()
   .domain(["H","UM","LM","L"])
   .range(["red","orange","teal","blue"])
 

  // + AXES
  const xAxis = d3.axisBottom(xScale).ticks(7, "~s")
  const yAxis = d3.axisLeft(yScale).ticks(6, "~s")
  

  // Create svg
  svg = d3.select("#d3-container")
    .append("svg")
    .attr('width', width)
    .attr('height', height)

  //adding axes
  svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${height-margin.bottom})`)
    .call(xAxis)

    .append("text")
    .attr ("class", 'axis-title')
    .attr ("x", width /2)
    .attr ("y", "45")
    .attr ("font-size", "12")
    .attr ("fill", "orange")
    .attr ("font", "arial")
    .attr ("text-anchor", "middle")
    .text("GDP (log)")
    

  svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.left}, ${0})`)
    .call(yAxis)
    .append ("text")
    .attr ("class", 'axis-title')
    .attr ("x", "-45")
    .attr ("y", height /2)
    .attr ("writing-mode", "vertical-lr")
    .attr ("text-anchor", "middle")
    .style ("fill", "orange")
    .attr("font-size","12")
    .text ("CO2 Tons (log)")
    
   
  // + UI ELEMENT SETUP

    const dropdown = d3.select("#dropdown")

    dropdown.selectAll("options")
    .data([
      {Key: "All", label: "All"},
      {Key: "H", label: "H"},
      {Key: "UM", label: "UM"},
      {Key: "LM", label: "LM"},
      {Key: "L", label: "L"}])
      .join("option")
      .attr("value", d => d.key)
      .text(d=> d.label)
      
  
    dropdown.on("change", event=> {
      console.log("dropdown changed!", event.target.value)
      state.selectedIncome = event.target.value
      console.log("new state:", state)
      draw();
    })
  
      draw();
  }
/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {
  console.log()

  const filteredData = state.data
  .filter(d=>{
    if (state.selectedIncome === "All") return true
    else return d.income === state.selectedIncome
    })

  svg.selectAll("circle")
    .data(filteredData, d=>d.country) 
    .join(
      enter=> enter.append("circle")
        .attr("r", radius)
        .attr("fill", d => colorScale(d.income))
        .style ("stroke-opacity", .40)
        
        // set attribute before
        .attr("cy", height - margin.bottom)
        .attr("cx", d=> xScale(d.gdp))
        //.call(sel => sel.transition())
          //.duration(1000)
          //.attr("cy", d => yscale(d.income)
          //if (d.income==="Rc") return "red"
          //else return "blue"
        
        // start a transition
          .call(enter => enter
          .transition()
          .duration(5000)
          .delay(1000)
          // set the end attribute
          .attr("cy", d=> yScale(d.co2))
          .ease(d3.easeCircleIn)
        ),
      update=> update
        .call(sel => sel
          .transition()
          .duration (200)
          .attr("r", radius *1.5)
          .transition()
          .duration(500)
          .attr("r", radius)
          ),
      
      exit => exit
      .attr("cy", d => yScale(d.gdp))
      .attr("cx", d => xScale(d.co2)) 
      .call(exit => exit
        .transition()
        .style("opacity", .25)
        .duration(500)
        .attr("cx", width - margin.right)
        .attr("cy", height/2)
        .remove()
        )
      );

}

    //state.selection = this.value
    //console.log("new value is", this.value);
    //draw(); // re-draw the graph based on this new selection
  //});

  // add in dropdown options from the unique values in the data
  //selectElement
    //.selectAll("option")
    //.data(["All", "1", "2", "3"]) // + ADD UNIQUE VALUES
    //.join("option")
    //.attr("value", d => d)
    //.text(d => d);

  // + CREATE SVG ELEMENT

  // + CALL AXES

  //draw(); // calls the draw function
//}

/* DRAW FUNCTION */
 // we call this everytime there is an update to the data/state
//function draw() {
  
  // + FILTER DATA BASED ON STATE

  // const dot = svg
  //   .selectAll("circle")
  //   .data(filteredData, d => d.name)
  //   .join(
  //     enter => enter, // + HANDLE ENTER SELECTION
  //     update => update, // + HANDLE UPDATE SELECTION
  //     exit => exit // + HANDLE EXIT SELECTION
  //   );
//}
