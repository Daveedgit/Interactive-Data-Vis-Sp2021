/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.9,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

let svg;
let autoBox;
//let tooltip;

/**
 * APPLICATION STATE
 * */
let state = {
  // + INITIALIZE STATE
};

/**
 * LOAD DATA
 * */
d3.json("../../data/flare.json", d3.autotype).then(data => {
  state.data = data;
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  const container = d3.select("#d3-container").style("position", "relative");
//console.log("state,data", state.data)

   svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    
    const radius = (width/2)
    

    //const root = d3.partition(state.data)
  
   // partitionLayout = d3.partition()
    
  const root = d3.hierarchy(state.data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value)
  //console.log("state.data", state.data)

    partitionLayout = d3.partition(root)
    .size([2 * Math.PI, 250])
    
  console.log("root", root)

    partitionLayout(root)

    format= d3.format(",d")
    //width = 975
    //radius = width/2

    const arc = d3.arc()
       .innerRadius(d => d.y0)
       .outerRadius(d => d.y1)
       .startAngle(d => d.x0)
       .endAngle(d => d.x1)
       .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.0025))
       .padRadius(450 / 2)

       console.log("arc", arc)

    //colors
   const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, root.children.length + 1))

    //svg
    //svg.append("g")
    const paths = svg.append("g")
    paths.selectAll("path")
      .append("g")
      .attr("fill-opacity", 0.6)
      .data(root.descendants().filter(d => d.depth))
      .join("path")
      .attr("fill",  
      d => { while (d.depth > 1) d = d.parent; 
        return color(d.data.name); })
      .attr("d", arc)
      .append("title")
      .text(d => `${d.ancestors()
        .map(d => d.data.name).reverse()
        .join("/")}\n${format(d.value)}`);

  svg.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
    .selectAll("text")
    .data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
    .join("text")
      .attr("transform", function(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) 
        translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        
      })
      .attr("dy", "0.35em")
      .text(d => d.data.name);

      function autoBox() {
        document.body.appendChild(this);
        const {x, y, width, height} = this.getBBox();
        document.body.removeChild(this);
        return [x, y, width, height];
      }
    

  // + INITIALIZE TOOLTIP IN YOUR CONTAINER ELEMENT

  // + CREATE YOUR ROOT HIERARCHY NODE

  // + CREATE YOUR LAYOUT GENERATOR

  // + CALL YOUR LAYOUT FUNCTION ON YOUR ROOT DATA

  // + CREATE YOUR GRAPHICAL ELEMENTS

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  // + UPDATE TOOLTIP
}
/*
var partitionLayout = d3.partition()
   .size([2 * Math.PI,250])

partitionLayout(root)

var arc = d3.arc()
   .innerRadius(d => d.y0)
   .outerRadius(d => d.y1)

d3.select("svg")
  .append("g")
  .attr("transform", "translate(255,255)")
  .selectAll("path")
  .data(root.descendants())
  .enter()
  .append("path")
  .attr("d", ({ y0, y1, x0, x1 }) => arc({y0, y1,
        startAngle: x0, endAngle: x1}))
  .style("fill", d => depthScale(d.depth))
  .style("stroke", "black")
  **/