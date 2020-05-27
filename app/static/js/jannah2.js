var darkgrey = "#161616",
            middlegrey = "#a7a7a7",
            lightgrey = "#afafaf";

        var languageMap = [];
        languageMap["de"] = "German";
        languageMap["es"] = "Spanish";
        languageMap["fr"] = "French";
        languageMap["it"] = "Italian";
        languageMap["ja"] = "Japanese";
        languageMap["nl"] = "Dutch";
        languageMap["pl"] = "Polish";
        languageMap["pt"] = "Portuguese";
        languageMap["ru"] = "Russian";
        languageMap["tr"] = "Turkish";
        languageMap["all"] = "All languages";
        //var divWidth = parseInt(d3.select("#viz-word-snake").style("width"));

        //var data = d3.select("#viz-word-snake")
        //var d2 = data.attr("width")
        divWidth = 600

        var margin = {
            top: 10,
            right: 10,
            bottom: 40,
            left: 10
        };
        var width = divWidth - margin.left - margin.right;
        //var height = width;
        var height = 450;
console.log(divWidth,width,height)
        //SVG container
        var svg = d3.select("#viz-word-snake").append("svg")
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

            return { xLoc: xLoc, xLocArc: xLocArc, numCircle: numCircle };
        }//function calculateGrid

        var grid = calculateGrid();
        var top1 =[
{"language":"nl","original":"collega","translation":"colleague","frequency":"38418"},
{"language":"fr","original":"bien | bon","translation":"good","frequency":"204516"},
{"language":"de","original":"schön","translation":"beautiful","frequency":"169808"},
{"language":"it","original":"bene | buon | buono","translation":"good","frequency":"66672"},
{"language":"ja","original":"仕事 | 作業","translation":"work","frequency":"33468"},
{"language":"pl","original":"czwartek","translation":"thursday","frequency":"66756"},
{"language":"pt","original":"bom | bem | boa","translation":"good","frequency":"140778"},
{"language":"ru","original":"мама","translation":"mama","frequency":"95900"},
{"language":"es","original":"hermosa | hermoso | bonito","translation":"beautiful","frequency":"180996"},
{"language":"tr","original":"güzel","translation":"beautiful","frequency":"63927"}
]
var top100Overall = [{"translation":"beautiful","rank":"1"},{"translation":"thursday","rank":"2"},{"translation":"tuesday","rank":"3"},{"translation":"wednesday","rank":"4"},{"translation":"good","rank":"5"},{"translation":"address","rank":"6"},{"translation":"place","rank":"7"},{"translation":"little","rank":"8"},{"translation":"saturday","rank":"9"},{"translation":"white","rank":"10"},{"translation":"love","rank":"11"},{"translation":"request","rank":"12"},{"translation":"english","rank":"13"},{"translation":"great","rank":"14"},{"translation":"happy","rank":"15"},{"translation":"friday","rank":"16"},{"translation":"answer","rank":"17"},{"translation":"business","rank":"18"},{"translation":"city","rank":"19"},{"translation":"sunday","rank":"20"},{"translation":"teacher","rank":"21"},{"translation":"school","rank":"22"},{"translation":"brother","rank":"23"},{"translation":"monday","rank":"24"},{"translation":"language","rank":"25"},{"translation":"autumn","rank":"26"},{"translation":"summary","rank":"27"},{"translation":"job","rank":"28"},{"translation":"man","rank":"29"},{"translation":"available","rank":"30"},{"translation":"quantity","rank":"31"},{"translation":"street","rank":"32"},{"translation":"description","rank":"33"},{"translation":"time","rank":"34"},{"translation":"big","rank":"35"},{"translation":"dog","rank":"36"},{"translation":"work","rank":"37"},{"translation":"daughter","rank":"38"},{"translation":"fast","rank":"39"},{"translation":"company","rank":"40"},{"translation":"name","rank":"41"},{"translation":"chair","rank":"42"},{"translation":"house","rank":"43"},{"translation":"proposal","rank":"44"},{"translation":"well","rank":"45"},{"translation":"confirmation","rank":"46"},{"translation":"kitchen","rank":"47"},{"translation":"children","rank":"48"},{"translation":"order","rank":"49"},{"translation":"friend","rank":"50"},{"translation":"development","rank":"51"},{"translation":"table","rank":"52"},{"translation":"country","rank":"53"},{"translation":"home","rank":"54"},{"translation":"width","rank":"55"},{"translation":"first name","rank":"56"},{"translation":"holiday","rank":"57"},{"translation":"regards","rank":"58"},{"translation":"reply","rank":"59"},{"translation":"decision","rank":"60"},{"translation":"important","rank":"61"},{"translation":"girl","rank":"62"},{"translation":"life","rank":"63"},{"translation":"bad","rank":"64"},{"translation":"right","rank":"65"},{"translation":"aunt","rank":"66"},{"translation":"bed","rank":"67"},{"translation":"father","rank":"68"},{"translation":"offer","rank":"69"},{"translation":"sorry","rank":"70"},{"translation":"nothing","rank":"71"},{"translation":"summer","rank":"72"},{"translation":"target","rank":"73"},{"translation":"power","rank":"74"},{"translation":"colleague","rank":"75"},{"translation":"height","rank":"76"},{"translation":"price","rank":"77"},{"translation":"small","rank":"78"},{"translation":"christmas","rank":"79"},{"translation":"car","rank":"80"},{"translation":"search","rank":"81"},{"translation":"invoice","rank":"82"},{"translation":"shirt","rank":"83"},{"translation":"heart","rank":"84"},{"translation":"amount","rank":"85"},{"translation":"people","rank":"86"},{"translation":"sad","rank":"87"},{"translation":"day","rank":"88"},{"translation":"kind","rank":"89"},{"translation":"family","rank":"90"},{"translation":"responsible","rank":"91"},{"translation":"water","rank":"92"},{"translation":"translator","rank":"93"},{"translation":"son","rank":"94"},{"translation":"month","rank":"95"},{"translation":"tree","rank":"96"},{"translation":"inquiry","rank":"97"},{"translation":"expensive","rank":"98"},{"translation":"error","rank":"99"},{"translation":"high","rank":"100"}]
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
            var originalText = node.append("text")
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
            var wordSnake = svg.append("text")
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
                .text("the most often translated words across all languages");
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