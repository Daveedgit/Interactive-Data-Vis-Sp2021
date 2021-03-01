// data load
// reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
d3.csv('astro.csv', d3.autoType)
  .then(data => {
    // confirm that the data loaded in by looking in the console
    console.log("data", data)

    /** CONSTANTS */
    // constants help us reference the same values throughout our code
    const width = window.innerWidth * .8;
    const height = window.innerHeight /1.6;
    const margins = {top: 45, bottom: 30, left: 25, right: 90}; //names-left
    const color = d3.scaleSequential()
    .domain([0, d3.max(data, d => d.days)])
    .interpolator(d3.interpolateBlues)

    /** SCALES */
    // reference for d3.scales: https://github.com/d3/d3-scale
    const yScale = d3.scaleBand()
      .domain(data.map(d=> d.name)) // get all the `activity` values
      .range([300, margins.top, height - margins.bottom])
      .paddingInner(.5) //spacing bet bars
      .paddingOuter(.1)

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.days)]) // grab the max value
      .range([margins.left, width - margins.right])
      
      //console.log(yScale, yScale('Scott Kelly')) 

    /** DRAWING ELEMENTS */
    const svg = d3.select('#barchart-container')
      .append("svg")
      .attr("width", width)
      .attr("height", height) 

      //console.log(svg)

    // draw rect bars
    svg.selectAll("rect")
      .data(data)
      .join("rect") 
      .attr("width", d=> xScale(d.days) - margins.right) //width - margins.left - xScale(d.days))
      .attr("height", yScale.bandwidth())
      .attr("x", margins.right)
      .attr("y", d=>yScale(d.name))
      //.attr("transform", `translate(100, ${height - margin.bottom, margin.top})`)
      .attr("fill", d=>color(d.days)) // try changing this to be a dynamic colorscale
      .attr("y", d => yScale(d.name))
      .attr("x", 50, d => xScale(d.days)) //movingbar

    // draw bottom 'activity' text
    svg.selectAll("text.name")
      .data(data)
      .join("text")
      .attr("class", 'name')
      .attr("y", d=> yScale(d.name))//+(yScale.bandwidth() / 4))
      .attr("x", d=> margins.left)
      .attr("dx", "2em") // adjust the text a bit lower down
      .attr("text-anchor", 'start') // set the x/y to refer to the middle of the word
      .text(d => d.name) // set the text

    // draw top 'count' text
    svg.selectAll("text.days")
      .data(data)
      .join("text")
      .attr("class", 'days')
      .attr("y", d => yScale(d.name) + (yScale.bandwidth() / 2))
      .attr("x", d => xScale(d.days))
      .attr("dy", "0.4em") // adjust the text a bit lower down
      .attr("dx", "-0.8em")
      .attr("text-anchor", 'end') // set the x/y to refer to the middle of the word
      .text(d => d3.format(",")(d.days)) // set the text, add a formatter to properly format numbers: https://github.com/d3/d3-format
  
  
  })