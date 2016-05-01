// container
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Grid, Carousel, CarouselItem } from 'react-bootstrap';
import DataMap from '../../components/Visuals/DataMap.jsx';
import statesData from '../../data/statesData';
import StoryCard from '../../components/StoryCards/StoryCard.jsx';
import ListsCarousel from '../../components/ResultsPage/ListsCarousel.jsx';
import ResultDonorsList from './ResultDonorsList.jsx';
import {loadPACinfo,loadBizInfo, loadIndivs} from '../../actions'
import _ from 'lodash';
import ReactFauxDOM from 'react-faux-dom';


function loadData(props) {
  const { filer_id } = props.params;
  props.loadIndivs(filer_id);
  props.loadBizInfo(filer_id);
  props.loadPACinfo(filer_id);
}

class ResultDonorsCard extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
      loadData(this.props);
    }


    render() {
      const {pacContributions,businessContributions, indivContributions} = this.props;
      let individualDonors = _.values(indivContributions);
      let businessDonors = _.values(businessContributions);
      let pacDonors = _.values(pacContributions);
// .orderBy('amount','desc');
      let indivsTotal = individualDonors.map(d => d.grandTotal).reduce((a,b)=> {return a+b},0)
      let businessTotal = businessDonors.map(d => d.grandTotal).reduce((a,b)=> {return a+b},0)
      let pacTotal = pacDonors.map(d => d.grandTotal).reduce((a,b)=> {return a+b},0)

      var divStyle = {height: 300}

      var faux = new ReactFauxDOM.createElement('div', divStyle);

      let barData = [{bookType: "Individual", total: indivsTotal}, {bookType: "Business", total: businessTotal}, {bookType: "PAC", total: pacTotal}]

      var data = barData.map((item) => {
        return {
          bookType: item.bookType,
          total: item.total
        }
      })

      var margin = {top:20, right:20, bottom:20, left:20};

      var h = 250 - margin.top - margin.bottom;
      var w = 700 - margin.left - margin.right;

      var x = d3.scale.ordinal().rangeRoundBands([0, w], .05);

      var y = d3.scale.linear().range([h, 0]);

      x.domain(data.map(function(d) { return d.bookType; }));
      y.domain([0, d3.max(data, function(d) { return d.total; })]);

      var colorScale = d3.scale.category20c()
       .domain([0, 1, data.length-1, data.length])


      var xAxis = d3.svg.axis()
           .scale(x)
           .orient("bottom")

      var yAxis = d3.svg.axis()
           .scale(y)
           .orient("left")
           .ticks(10);

      var svg = d3.select(faux).append("svg")
      .attr('width', w + margin.left + margin.right)
      .attr('height', h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + h + ")")
     .style({'stroke-width': '0px'})
     .call(xAxis)
     .selectAll("text")
       .style("text-anchor", "end")
       .attr("dx,")


    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr("fill", function(data, index){
          return colorScale(index)
        })
      .attr("x", function(d) { return x(d.bookType)
        })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.total)
        })
      .attr("height", function(d) { return h - y(d.total)
        })


      console.log('ind ',indivsTotal, 'bus ',businessTotal, 'pac ',pacTotal);

        return (<div>
                <StoryCard
                  question={"Who is giving?"}
                  description={"This visualization is calculated by total dollars, not total people."}>
                  <div>
                    {faux.toReact()}
                  </div>
                  <ListsCarousel>
                    <CarouselItem>
                    <ResultDonorsList donorType={"Top Individual Donors"} donors={individualDonors}></ResultDonorsList>
                    <ResultDonorsList donorType={"Top Business Donors"} donors={businessDonors}></ResultDonorsList>
                    </CarouselItem>
                    <CarouselItem>
                    <ResultDonorsList donorType={"Top PAC Donors"} donors={pacDonors}></ResultDonorsList>
                    </CarouselItem>
                  </ListsCarousel>
                </StoryCard>
                </div>
        );
    }
}

ResultDonorsCard.propTypes = {
  indivContributions: PropTypes.object,
  businessContributions: PropTypes.object,
  pacContributions: PropTypes.object
}

function mapStateToProps(state) {
  const {entities:{
    indivContributions, businessContributions, pacContributions,
    }
  } = state;
  return {indivContributions,pacContributions, businessContributions};

}
export default connect(mapStateToProps,{
  loadPACinfo, loadBizInfo, loadIndivs
})(ResultDonorsCard);
