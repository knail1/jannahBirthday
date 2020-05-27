//import {
//  select  as d3_select,
//  shuffle as d3_shuffle
//} from 'd3';
let data = 'You worked hard and finished the Quran. So proud of you!'.split('').map( (d, i) => ({
//let data = 'Does this make any sense?'.split('').map( (d, i) => ({
  letter  : d,
  index   : i,
  pos     : i
}));
const LETTER_WIDTH = 22;
const WIDTH        = LETTER_WIDTH * data.length;
const HEIGHT       = 80;
//const textBlackBoard = d3.select("body").selectAll('#jannahSVG').append("textBlackBoard")
const textBlackBoard = d3.select("body").select("p").append("p")
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .append('g')
    .attr('transform', 'translate(0,' + (HEIGHT/2) + ')');


function update (data) {
  const text = textBlackBoard.selectAll('text').data(data, d => d.index);
  text.enter().append('text')
    .attr('fill', d => d.letter === '?' ? 'tomato' : '#000')
    .attr('x', (d, i) => LETTER_WIDTH*d.pos)
    .style('font-size', '20px')
      .style('color', 'green')
    .style('font-family', 'monospace')
    .text(d => d.letter)
    .merge(text)
      .transition().duration(1000)
      .attr('x', (d, i) => LETTER_WIDTH*d.pos);
}



function loop () {
    console.log("log")
  update(data);
  window.setTimeout(function () {
    data = d3.shuffle(data).map( (d, i) => {
      d.pos = i;
      return d;
    });
    update(data);
    window.setTimeout(function () {
      data = data.map( (d, i) => {
        d.pos = d.index;
        return d;
      });
      loop();
    }, 2000);
  }, 2000);
}
loop();
