import { Component, OnInit, ElementRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { DataService } from "../chart-data.service";
declare const d3: any;

@Component({
  selector: 'app-stacked-chart',
  templateUrl: './stacked-chart.component.html',
  styleUrls: ['./stacked-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StackedChartComponent implements OnInit {
  @ViewChild('chart') private chartContainer: ElementRef;
  chartdata: any = [];
  keys: any = [];
  constructor(private dataService: DataService) {
    //Get chart Json data from service
    this.dataService.getChartData().subscribe((data) => {
      this.chartdata = data;

      this.drawGraph();
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.chartdata.length > 0)
      this.drawGraph();
  }
  // To create graph
  drawGraph() {
    const element = this.chartContainer.nativeElement;
    const div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    const series = d3.stack()
      .keys(["GDP", "Product price", "Habit persistance", "Population", "Demographics", "Market Environment", "Soft Drivers"])
      .offset(d3.stackOffsetDiverging)
      (this.chartdata);

    const svg = d3.select("svg"),
      margin = { top: 30, right: 20, bottom: 60, left: 30 },
      width = +svg.attr("width"),
      height = +svg.attr("height");

    const y = d3.scaleBand()
      .domain(this.chartdata.map(function (d) { return d.Country; }))
      .rangeRound([margin.top, height - margin.bottom])
      .padding(0.1);

    const x = d3.scaleLinear()
      .domain([d3.min(series, stackMin), d3.max(series, stackMax)])
      .rangeRound([margin.left, width - margin.right]);

    const z = d3.scaleOrdinal(d3.schemeCategory10);
 
    svg.append("g")
      .selectAll("g")
      .data(series)
      .enter().append("g")
      .attr("fill", function (d) { return z(d.key); })
      .selectAll("rect")
      .data(function (d) { return d; })
      .enter().append("rect")
      .attr("height", y.bandwidth)
      .attr("y", function (d) { return y(d.data.Country); })
      .attr("x", function (d) { return x(d[0]); })
      .attr("width", function (d) { return x(d[1]) - x(d[0]); })
      .on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(
          '<span>GDP: ' + d.data.GDP + "%</span><br/><span>Product price: "
          + d.data['Product price'] + "%</span><br/>Habit persistance: " +
          d.data['Habit persistance'] + "%</span><br/><span>Population: " +
          d.data.Population + "%</span><br/><span>Demographics: " + d.data.Demographics +
          "%</span><br/><span>Market Environment: " + d.data['Market Environment'] + "%</span><br/>")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      });
    svg.selectAll("g")
      .select("rect")
      .data(series)
      .insert("circle")
      .attr("x", 200)
      .attr("y", 100)
      .attr("r", 50)
      .style("stroke", "red")
      .style("fill", "none");      

      svg.selectAll("g")
      .select("rect")
      .append("line")
      .attr("x", function (d) { return x(d[0]); })
      .attr("y", function (d) { return y(d.Country); })
      .style("stroke", "red")
      .style("stroke-width", "2px");   

    svg.append("g")
      .attr("transform", "translate(" + x(0) + ", 0)")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("x", -170);

    svg.append("g")
      .attr("transform", "translate(0," + margin.top + ")")
      .call(d3.axisTop(x));

    function stackMin(serie) {
      return d3.min(serie, function (d) { return d[0]; });
    }

    function stackMax(serie) {
      return d3.max(serie, function (d) { return d[1]; });
    }


  }

}
