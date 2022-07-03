/* global dc, crossfilter, d3 */

// == load the data
d3.csv('data/people.csv')
  .then(function (data) {
    data.forEach(d => modifyData(d));
    return data;
  })
  .then(function (data) {
    createCharts(data);
  })
  .catch(function (error) {
    console.log(error);
  });

function modifyData(d) {
  if (d["CreditCardType"] == "") {
    d["CreditCardType"] = "no data"
  }
  d.age = ~~((Date.now() - new Date(d.DOB)) / (31557600000));
  d.ageGroup = roundDown(d.age, 10) + "'s'"
  return d;
}

function createCharts(peopleData) {
  dc.config.defaultColors(d3.schemePaired);

  // ==  create the crossfilter object
  let ndx = crossfilter(peopleData);

  // ==  create dimensions
  let genderDimension = ndx.dimension(function (data) { return data.gender; }),
    ageGroupDimension = ndx.dimension(function (data) { return data.ageGroup; });

  // instanciate the charts
  let barChart01 = dc.barChart('#chart01'),
    barChart02 = dc.barChart('#chart02');

  barChart01
    .dimension(genderDimension)
    .group(genderDimension.group())
    .width($(barChart01.anchor()).parent().width())
    .height(200)
    .x(d3.scaleBand())
    .xUnits(dc.units.ordinal)
    .yAxisLabel("Count")
    .xAxisLabel("Age Bracket");

  barChart02
    .dimension(ageGroupDimension)
    .group(ageGroupDimension.group())
    .width($(barChart02.anchor()).parent().width())
    .height(200)
    .x(d3.scaleBand())
    .xUnits(dc.units.ordinal)
    .yAxisLabel("Count")
    .xAxisLabel("Age");

  dc.renderAll();
};


let roundDown = function (num, precision) {
  num = parseFloat(num);
  if (!precision) return num.toLocaleString();
  return (Math.floor(num / precision) * precision).toLocaleString();
};
