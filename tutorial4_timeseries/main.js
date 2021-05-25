/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 5;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;
let xAxis;
let yAxis;
let xAxisGroup;
let yAxisGroup;

/* APPLICATION STATE */
let state = {
  data: [],
  selection: "coal", // + YOUR FILTER SELECTION
};

/* LOAD DATA */
// + SET YOUR DATA PATH
d3.csv('electricity_generation_bill_k_h.csv', d3.autotype) 
//d3.csv('electricity_generation_bill_k_h.csv', (d) => {
// use custom initializer to reformat the data the way we want it
  // ref: https://github.com/d3/d3-fetch#dsv
//return {
  //year: new Date(+d.Year, 0, 1),
  //coal: +d.coal,
  //ng: +d.ng,
  //nuclear: +d.nuclear,
  //renewables: +d.renewables,
  //p: +d.p
//}Dedalo258

//})
.then(data => {
  //console.log("LOADED DATA", data);
  state.data = data;
  init();
});

series = d3.stack().keys(state.data.columns.slice(1))//(state.data)
console.log ("series")

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // + SCALES
xScale = d3.scaleTime()
  .domain(d3.extent(state.data, function(d) {  
  return new Date(d.year)}))
//.domain([new Date(1950, 0, 1, 0), new Date(2018, 0, 1, 2)]);
  //.domain(d3.extent(state.data, d=> d.year))
  .range([margin.right,width-margin.left])

yScale = d3.scaleLinear()

  .domain(d3.min(state.data, d => d.coal),d3.max(state.data, d => d.coal))   //d3.extent(state.data, d => d.coal))
  .range([height-margin.bottom, margin.top]) //changing the order sets the values in ascending or descending

  // + AXES
  const xAxis = d3.axisBottom(xScale)//.ticks(20) //number of ticks showing
  .tickFormat(d3.timeFormat("%Y")) //sets it to yearly 
  .ticks(5) 

  const yAxis = d3.axisLeft(yScale)
  //.tickFormat(formatBillions)


  //create SVG
  svg = d3.select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  //CALL AXES
  xAxisGroup = svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${height - margin.bottom})`)
    .call(xAxis)

  xAxisGroup.append("text")
    .attr("class", 'xLabel')
    .attr("transform", `translate(${width / 2}, ${35})`)
    
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .attr("letter-spacing", "0.2em")
    .attr("font-size","12")
    .attr("style","fill:#4f5d68")
    .text("Year")

  yAxisGroup = svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.right}, ${0})`)
    .call(yAxis)

  yAxisGroup.append("text")
    .attr("class", 'yLabel')
    .attr("transform", `translate(${-45}, ${height / 2})`)
    .attr("writing-mode", 'vertical-rl')
    .text("coal")
  
  const dropdown = d3.select("#dropdown") 

  dropdown.selectAll("options")
  .data([
    { key: "coal", label: "Coal"},
    { key: "natural gas", label: "Natural Gas"},
    { key: "nuclear", label: "Nuclear"},
    { key: "renewables", label: "Renewables"},
    {key: "petroleum and other", label: "Petroleum"}])

  .join("option")
  .attr("value", d => d.key)
  .text(d => d.label)

  dropdown.on("change", event => {
    console.log("DROP DOWN IS CHANGED", event.target.value)
    state.selection = event.target.value
    console.log("NEW STATE", state)
    draw();
})

  
  // + UI ELEMENT SETUP

  //const selectElement = d3.select("#dropdown").on("change", function() {
    // `this` === the selectElement
    // 'this.value' holds the dropdown value a user just selected
    //state.selection = this.value; // + UPDATE STATE WITH YOUR SELECTED VALUE
   // console.log("new value is", this.value);
   // draw(); // re-draw the graph based on this new selection
  //});

  // add in dropdown options from the unique values in the data
  //selectElement
    //.selectAll("option")
   // .data(["All", "1", "2", "3"]) // + ADD DATA VALUES FOR DROPDOWN
   // .join("option")
   // .attr("value", d => d)
  //.text(d => d);

  // + SET SELECT ELEMENT'S DEFAULT VALUE (optional)

  // + CREATE SVG ELEMENT

  // + CALL AXES

  //draw(); // calls the draw function
//}

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {
  console.log("state.selected", state.selection)
  // + FILTER DATA BASED ON STATE
  const filteredData = state.data
  //.filter (d => d.coal === state.selectedcountry)
  console.log("filteredData", filteredData)

  const dots = svg
    .selectAll(".dot")
    .data(filteredData, d => d.year)
    .join(
      enter => enter.append("g")
        .attr("class", "dot")
        .attr("transform", d => `translate(${xScale(new Date(d.year))}, ${yScale(d.coal)})`),
      update => update
        .call(upate => update.transition()
          .duration(1500)
          .attr("transform", d => `translate(${xScale(new Date(d.year))}, ${yScale(d.coal)})`)
    ),
  exit => exit.remove()
    );
  
    dots.selectAll("circle")
    .data(d => [d])
    .join("circle")
    .attr("r", radius)
    .attr("fill", "purple")

     // specify line generator function
  const lineGen = d3.line()
  .x(d => xScale(d.year))
  .y(d => yScale(d.coal))

   svg.selectAll("path.nuclear")
  .data([data])
  .join("path")
  .attr("class", 'nuclear')
    .attr("fill", "none")
    .attr("stroke", "black")
    .transition()
    .duration(1000)
    .attr("d", d => lineGen(d))




  //console.log("filteredData", filteredData)
  //
  // + UPDATE SCALE(S), if needed
  //
  // + UPDATE AXIS/AXES, if needed
  //
  // + DRAW CIRCLES, if you decide to
  // const dot = svg
  //   .selectAll("circle")
  //   .data(filteredData, d => d.name)
  //   .join(
  //     enter => enter, // + HANDLE ENTER SELECTION
  //     update => update, // + HANDLE UPDATE SELECTION
  //     exit => exit // + HANDLE EXIT SELECTION
  //   );
  //
  // + DRAW LINE AND AREA
}
}