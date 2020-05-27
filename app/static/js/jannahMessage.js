var darkgrey = "#161616",
            middlegrey = "#a7a7a7",
            lightgrey = "#afafaf";

        var languageMap = [];
        languageMap["de"] = "You brightly";
        languageMap["es"] = "And";
        languageMap["fr"] = "You always";
        languageMap["it"] = "You the";
        languageMap["ja"] = "You the";
        languageMap["nl"] = "You";
        languageMap["pl"] = "You are such a";
        languageMap["pt"] = "The one who";
        languageMap["ru"] = "You the";
        languageMap["tr"] = "You are too";
        languageMap["all"] = "All languages";
        //var divWidth = parseInt(d3.select("#viz-word-snake").style("width"));
        divWidth = 800
        var margin = {
            top: 10,
            right: 10,
            bottom: 40,
            left: 10
        };
        var width = divWidth - margin.left - margin.right;
        var height = width;
//console.log(divWidth,width,height)
        //SVG container
        var svg = d3.select("#viz-word-snake")
            svg.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");

        var parseTime = d3.timeParse("%Y-%m-%d"); // timeParse is added in version v4
        var angle = 35 * Math.PI / 180;
        var radius = 75;
        var newXmargin = margin.left;
        var n;
        //Round number to 2 behind the decimal
        function round2(num) {
            return (Math.round((num + 0.00001) * 100) / 100);
        }//round2
        function calculateGrid() {
            //How many circles fir in one "row"
            var s = width / Math.cos(angle);
            var numCircle = Math.min(4, Math.floor(s / (2 * radius)));
            //I don't want 1 circle
            if (numCircle === 1) numCircle = 2;
            //If it's not an exact fit, make it so
            radius = Math.min(radius, round2((s / numCircle) / 2));

            //Save the x-locations if each circle
            var xLoc = new Array(numCircle);
            for (var i = 0; i < numCircle; i++) {
                xLoc[i] = round2((1 + 2 * i) * radius * Math.cos(angle));
            }//for i

            //Locations for the textPath
            var xLocArc = new Array(numCircle + 1);
            for (var i = 0; i <= numCircle; i++) {
                xLocArc[i] = round2(2 * i * radius * Math.cos(angle));
            }//for i

            //New width & divide margins so it will sit in the center
            width = xLocArc[numCircle];
            newXmargin = round2((divWidth - width) / 2);
            svg.attr("transform", "translate(" + newXmargin + "," + (margin.top) + ")");

            console.log("in the calculateGrid: xLoc:"+ xLoc +  " xLocArc: " + xLocArc + ", numcircle: "+ numCircle)
            return { xLoc: xLoc, xLocArc: xLocArc, numCircle: numCircle };
        }//function calculateGrid

        var grid = calculateGrid();
        var top1 =[
{"language":"nl","original":"Sana","translation":"lone and diplomatic","frequency":"38418"},
{"language":"fr","original":"Help | bon","translation":"me with your smile","frequency":"204516"},
{"language":"de","original":"Shine","translation":"among people","frequency":"169808"},
{"language":"it","original":"Charming | buon | buono","translation":" word in my vocabulary","frequency":"66672"},
{"language":"ja","original":"True","translation":"Dreamer","frequency":"33468"},
{"language":"pl","original":"Kind","translation":"girl","frequency":"66756"},
{"language":"pt","original":"Deserve | bem | boa","translation":"to be cared ","frequency":"140778"},
{"language":"ru","original":"Happy","translation":"outside","frequency":"95900"},
{"language":"es","original":"Quiet | hermoso | bonito","translation":"inside","frequency":"180996"},
{"language":"tr","original":"Lit","translation":"to quit","frequency":"63927"}
]
var top100Overall = [{"translation":"Happy Birthday","rank":"1"},{"translation":"Happy Birthday","rank":"2"},{"translation":"Happy Birthday","rank":"3"},{"translation":"Happy Birthday","rank":"4"},{"translation":"Happy Birthday","rank":"5"},{"translation":"Happy Birthday","rank":"6"},{"translation":"Happy Birthday","rank":"7"},{"translation":"Happy Birthday","rank":"8"},{"translation":"Happy Birthday","rank":"9"},{"translation":"Happy Birthday","rank":"10"},{"translation":"Happy Birthday","rank":"11"},{"translation":"Happy Birthday","rank":"12"},{"translation":"Happy Birthday","rank":"13"},{"translation":"Happy Birthday","rank":"14"},{"translation":"Happy Birthday","rank":"15"},{"translation":"Happy Birthday","rank":"16"},{"translation":"Happy Birthday","rank":"17"},{"translation":"Happy Birthday","rank":"18"},{"translation":"Happy Birthday","rank":"19"},{"translation":"Happy Birthday","rank":"20"},{"translation":"Happy Birthday","rank":"21"},{"translation":"Happy Birthday","rank":"22"},{"translation":"Happy Birthday","rank":"23"},{"translation":"Happy Birthday","rank":"24"},{"translation":"Happy Birthday","rank":"25"},{"translation":"Happy Birthday","rank":"26"},{"translation":"Happy Birthday","rank":"27"},{"translation":"Happy Birthday","rank":"28"}]
        // d3.queue()
            // .defer(d3.csv, "./data/top1_per_language_English_combined.csv")
            // .defer(d3.csv, "./data/top100_overall.csv")
            // .defer(d3.csv, "./data/google_trends_data_top_1_words.csv")
            // .defer(d3.csv, "./data/relatedCombined.csv")
            // .await(drawWordSnake);
        drawWordSnake('',top1, top100Overall);
        function drawWordSnake(error, top1, top100Overall, trends, related) {
            ///////////////////////////////////////////////////////////////////////////
            ///////////////////////////// Final data prep /////////////////////////////
            ///////////////////////////////////////////////////////////////////////////
            // console.log()
            if (error) throw error;

            // console.log(JSON.stringify(top100Overall))
            top100Overall.forEach(function (d, i) {
                d.rank = +d.rank;
                //d.totalWord = (i+1) + " " + d.translation + "\u00A0\u00A0";
                d.totalWord = d.translation + "\u00A0\u00A0";
            });

            top1.forEach(function (d) {
                d.frequency = +d.frequency;
            });

            // trends.forEach(function (d) {
            //     d.hits = +d.hits;
            //     d.date = parseTime(d.week);
            // });
            // Scale the range of the trend data
            // xScale.domain(d3.extent(trends, function (d) { return d.date; }));
            // xAxis.call(d3.axisBottom(xScale));

            // related.forEach(function (d) {
            //     d.score = +d.score;
            // });

            ///////////////////////////////////////////////////////////////////////////
            //////////////////////////// Create node data /////////////////////////////
            ///////////////////////////////////////////////////////////////////////////

            var nodes = [];

            top1.forEach(function (d, i) {
                //Are there more original words for this translation?
                var words = d.original.split(" | ");
                nodes.push({
                    rank: i,
                    frequency: d.frequency,
                    radius: radius,
                    translation: d.translation,
                    original: d.original,
                    language: languageMap[d.language],
                    originalMore: words.length > 1,
                    counter: 0,
                    originalSeparate: words
                })
            });

            n = nodes.length;

            ///////////////////////////////////////////////////////////////////////////
            ///////////////////////////// Create the nodes ////////////////////////////
            ///////////////////////////////////////////////////////////////////////////

            var nodeWrapper = svg.append("g").attr("class", "node-wrapper");

            //Create a group for each circle
            var pos = 0, add = 1;
            var node = nodeWrapper.selectAll(".node")
                .data(nodes)
                .enter().append("g")
                .attr("class", "node noselect")
                .attr("transform", function (d, i) {
                    //Save the locations
                    d.x = grid.xLoc[pos];
                    d.y = (1 + 2 * i) * radius * Math.sin(angle);

                    //Figure out which position of the xLoc to use on the next one
                    if (pos === grid.numCircle - 1) { add = -1; }
                    else if (pos === 0) { add = 1; }
                    pos = pos + add;

                    return "translate(" + d.x + "," + d.y + ")";
                });
            // .on("mouseover", mouseoverNode)
            // .on("mouseout", hideTooltip)
            // .on("click", clickOnNode);

            //Hide tooltip again on body/svg click
            // d3.select("body").on("click", hideTooltip);
            // d3.select("#viz-word-snake").on("click", hideTooltip);
            // d3.select("#tooltip-close").on("click", hideTooltip);

            ///////////////////////////////////////////////////////////////////////////
            //////////////////////// Create the central words /////////////////////////
            ///////////////////////////////////////////////////////////////////////////

            //Create background circle for the hover & click
            node.append("circle")
                .attr("class", "circle-background")
                .attr("r", radius);

            //Attach center words to each group
            //var originalText = node.append("text")
            node.append("text")
                .attr("class", "circle-center-original")
                .attr("y", 0)
                .attr("dy", "0.35em")
                .style("fill", darkgrey)
                .style("font-family", function (d) { return d.language === "Russian" ? "'Cormorant Infant', serif" : null; })
                .text(function (d) { return d.originalSeparate[0]; });
            node.append("text")
                .attr("class", "circle-center-translation")
                .attr("y", 22)
                .attr("dy", "0.35em")
                .style("fill", "#787878")
                .text(function (d) { return d.translation; });
            node.append("text")
                .attr("class", "circle-center-language")
                .attr("dy", "0.35em")
                .attr("y", -25)
                .style("fill", lightgrey)
                .text(function (d) { return d.language; });

            ///////////////////////////////////////////////////////////////////////////
            ////////////////////// Create the outer circular paths ////////////////////
            ///////////////////////////////////////////////////////////////////////////

            //Create path
            svg.append("path")
                .attr("class", "circle-path")
                .attr("id", "circle-word-path")
                //.style("stroke", "#d2d2d2")
                .attr("d", calculateSnakePath(grid, n));

            //Create the text itself
            var wordString = "1 ";
            top100Overall.forEach(function (d, i) {
                // console.log('11111')
                var rank = "";
                if ((i + 1) % 10 === 0) rank = (i + 1) + " ";
                wordString = wordString + rank + d.translation + "\u00A0\u00A0";
            });
            console.log(wordString)

            //Create text on path
            //var wordSnake = svg.append("text")
            svg.append("text")
                .attr("class", "circle-path-text noselect")
                .style("fill", "none")
                .attr("dy", "0.15em")
                .append("textPath")
                .attr("id", "top-word-string")
                .style("text-anchor", "middle")
                .style("fill", lightgrey)
                .attr("xlink:href", "#circle-word-path")
                .attr("startOffset", "0%")
                .text(wordString + "\u00A0\u00A0\u00A0" + wordString);
            //.text(top100Overall.map(function(d){ return d.translation; }).join("\u00A0\u00A0"));

            ///////////////////////////////////////////////////////////////////////////
            /////////////////////// Create the word string legend /////////////////////
            ///////////////////////////////////////////////////////////////////////////

            var legend = svg.append("g")
                .attr("class", "word-snake-legend")
                .attr("transform", "translate(" + grid.xLoc[1] + "," + (3 * radius * Math.sin(angle)) + ")");

            //Create the path for the legend
            legend.append("path")
                .attr("class", "circle-path")
                .attr("id", "circle-legend-path")
                //.style("stroke", "#d2d2d2")
                .attr("d", function (d) {
                    var r = radius * 1.2;
                    return "M" + (-r * Math.cos(angle)) + "," + (-r * Math.sin(angle)) +
                        " A" + r + "," + r + " 0 1,1" + (-r * Math.cos(angle * 0.99)) + "," + (-r * Math.sin(angle * 0.99)) + " ";
                });

            //Append text to path
            legend.append("text")
                .attr("class", "circle-path-legend noselect")
                .style("fill", "none")
                .attr("dy", "0.15em")
                .append("textPath")
                .style("text-anchor", "middle")
                .attr("startOffset", "25%")
                .style("fill", darkgrey)
                .attr("xlink:href", "#circle-legend-path")
                .text("All the good ones are little crazy");
            //d3.select("#top-word-string").interrupt("move");
            animateWordSnake();
        };//function drawWordSnake

        function calculateSnakePath(grid, n) {
            var pos = 0, add = 1;
            function newPos() {
                if (pos === grid.numCircle) { add = -1; }
                else if (pos === 0) { add = 1; }
                pos = pos + add;
            }//newPos

            var xOld = 0,
                yOld = 0,
                sweep = 0,
                switchSide = 1;

            var path = "M0,0 ";

            //Construct the custom SVG paths out of arcs
            for (var i = 1; i <= n; i++) {

                if (i !== 1 && (i - 1) % (grid.numCircle - 1) === 0 && grid.numCircle % 2 === 1 && switchSide === 1) {
                    //For the outside in an uneven row count when the arc should be the short side
                    //console.log(i, "outer side, short arc");
                    switchSide = 0;

                    x = grid.xLocArc[pos];
                    newPos();
                    newPos();

                    y = yOld + round2(2 * radius * Math.sin(angle));
                    path = path + " A" + radius + "," + radius + " 0 0," + sweep + " " + x + "," + y + " ";
                    yOld = y;
                    sweep = sweep ? 0 : 1;

                } else if (i !== 1 && (i - 1) % (grid.numCircle - 1) === 0) {
                    //For the outside rows in the even row count or,
                    //For the outside in an uneven row count when the arc should be the long side
                    //console.log(i, "outer side, long arc");
                    if (grid.numCircle % 2 === 1) switchSide = 1;

                    newPos();
                    x = grid.xLocArc[pos];
                    y = yOld + round2(2 * radius * Math.sin(angle));
                    path = path + " A" + radius + "," + radius + " 0 0," + sweep + " " + x + "," + y + " ";

                    newPos();
                    x = grid.xLocArc[pos];
                    path = path + " A" + radius + "," + radius + " 0 0," + sweep + " " + x + "," + y + " ";

                    xOld = x;
                    yOld = y;
                    sweep = sweep ? 0 : 1;

                } else {
                    //For the inbetween circles
                    //console.log(i, "inbetween");

                    newPos()
                    x = grid.xLocArc[pos];
                    y = yOld + round2(2 * radius * Math.sin(angle));
                    path = path + " A" + radius + "," + radius + " 0 0," + sweep + " " + x + "," + y + " ";
                    xOld = x;
                    yOld = y;
                    sweep = sweep ? 0 : 1;

                }//else

            }//for i

            //Adjust the height of the SVG
            height = yOld;
            d3.select("#viz-word-snake svg").attr("height", height + margin.top + margin.bottom);

            return path;
        }//function calculateSnakePath


        function animateWordSnake() {
            d3.select("#top-word-string")
                .transition("move").duration(120000)
                .ease(d3.easeLinear)
                .attr("startOffset", "100%")
                .transition("move").duration(120000)
                .ease(d3.easeLinear)
                .attr("startOffset", "0%");
        }//function animateWordSnake



function randNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

_ = self.Flower = function(opts){
  this.left = opts.left;
  this.top = opts.top;
  this.size = randNum(1.5, 6);
  this.drawFlower();
}
_.prototype = {
  spinFlower: function(el){
    var r = 0;
    var spd = Math.random() * (3 - 0.05) + 0.05;
    (function spin() {
      if (r === 350){
        r = 0
      } else {
        r += spd
      }
      el.style.transform = 'rotate('+r+'deg)';
      requestAnimationFrame(spin);
    })();
  },
  fall: function(el){
    var _this = this;
    var max_right = _this.left + randNum(20, 50);
    var max_left = _this.left - randNum(20, 50);
    var dir_i = randNum(0,1);
    var directions = ['left', 'right'];
    var direction = directions[dir_i];
    (function fall() {
      if (_this.left === max_left){
        direction = 'right';
        max_left= _this.left - randNum(20, 50);
      }
      if (_this.left === max_right){
        direction = 'left';
        max_right = _this.left + randNum(20, 50);
      }
      if (direction === 'left'){
        _this.left -= 1
      } else {
        _this.left += 1
      }
      _this.top += 2;
      el.style.top = _this.top + 'px';
      el.style.left = _this.left + 'px';
      requestAnimationFrame(fall);
    })();
  },
  fadeOut: function(el){
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= .007) < 0) {
        el.parentNode.removeChild(el);
      } else {
        requestAnimationFrame(fade);
      }
    })();
  },
  get petal (){
    var petal = document.createElement('div');
    petal.style.userSelect = 'none';
    petal.style.position = 'absolute';
    petal.style.background = 'radial-gradient(pink 100%, white 10%)';
    petal.style.backgroundSize = this.size+'vmin';
    petal.style.backgroundPosition = '-'+this.size/2+'vmin 0';
    petal.style.width = petal.style.height = this.size/2+'vmin';
    petal.style.borderTopLeftRadius = petal.style.borderBottomRightRadius = (42.5 * this.size) / 100 + "vmin";
    return petal;
  },
  get petal_styles(){
    return [
      {
        transform: 'rotate(-47deg)',
        left: '50%',
        marginLeft: '-'+this.size/4+'vmin',
        top: 0
      },{
        transform: 'rotate(15deg)',
        left: '100%',
        marginLeft: '-'+(this.size * 39 /100)+'vmin',
        top: (this.size * 17.5) / 100 + 'vmin'
      },{
        transform: 'rotate(93deg)',
        left: '100%',
        marginLeft: '-'+(this.size * 51) / 100+'vmin',
        top: (this.size * 58) / 100 + 'vmin'
      },{
        transform: 'rotate(175deg)',
        left: '0%',
        marginLeft: (this.size * 5) / 100 +'vmin',
        top: (this.size * 58) / 100 + 'vmin'
      },{
        transform: 'rotate(250deg)',
        left: '0%',
        marginLeft: -(this.size * 8) / 100 +'vmin',
        top: (this.size * 17.5) / 100 + 'vmin'
      }
    ]
  },
  get flower(){
    var flower = document.createElement('div');
    flower.style.userSelect = 'none';
    flower.style.position = 'absolute';
    flower.style.left = this.left + 'px';
    flower.style.top = this.top + 'px';
    flower.style.width = this.size + 'vmin';
    flower.style.height = this.size + 'vmin';
    for (var i = 0; i < 5; i++){
      var petal = this.petal;
      // var styles = this.petal_styles[i];
      petal.style.transform = this.petal_styles[i]['transform'];
      petal.style.top = this.petal_styles[i]['top'];
      petal.style.left = this.petal_styles[i]['left'];
      petal.style.marginLeft = this.petal_styles[i]['marginLeft'];
      flower.appendChild(petal);
    }
    this.fadeOut(flower);
    this.spinFlower(flower);
    this.fall(flower);
    return flower;
  },
  drawFlower: function(){
    document.body.appendChild(this.flower);
  }
}

window.addEventListener('mousedown', function(e){
  var amt = randNum(1, 5);
  for (var i = 0; i < amt; i++){
    var top = randNum(e.clientY - 30, e.clientY + 30);
    var left = randNum(e.clientX - 30, e.clientX + 10);
    var flower = new Flower({
      top: top,
      left: left
    });
  }
});