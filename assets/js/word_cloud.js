//based on 
//https://bl.ocks.org/jyucsiro/767539a876836e920e38bc80d2031ba7
function isNumeric(word){
  return !isNaN(word)
}


function initialize_word_count_from_text(text_string)
{
	let stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any","are","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does","doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves"];

    let word_count = {};
	
	let words = text_string.split(/[ '\-\(\)\*":;\[\]|{},.!?]+/);
          if (words.length == 1){
            word_count[words[0]] = 1;
          } else {
            words.forEach(function(word){
              word = word.toLowerCase();
			  word = word.trim()
              if (word != "" && !isNumeric(word) && stopwords.indexOf(word)==-1 && word.length>1){
                if (word_count[word]){
                  word_count[word]++;
                } else {
                  word_count[word] = 1;
                }
              }
            })
          }
	return word_count;
}

function drawWordCloud(word_count,min_frequency){
		

        var svg_location = "#wordcloud";
        var width = $(document).width()/2+100;
        var height = 500;
		d3.select(svg_location).selectAll("*").remove();
        
		var fill =  d3.scaleOrdinal(d3.schemeSet3);
        var word_entries = d3.entries(Object.fromEntries(Object.entries(word_count).filter(([key, value]) => value>= min_frequency)));


        var xScale = d3.scaleLinear()
        .domain([0, d3.max(word_entries, function (d) {
            return d.value;
        })
        ])
        .range([9, 70]);

        d3.layout.cloud().size([width, height])
          .timeInterval(20)
          .words(word_entries)
          .fontSize(function(d) { return xScale(+d.value); })
          .text(function(d) { return d.key; })
          .font("Impact")
          .on("end", draw)
          .start();

        function draw(words) {
          d3.select(svg_location).append("svg")
		   .attr("width", width)
              .attr("height", height)   
            .append("g")
              .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
            .selectAll("text")
              .data(words)
            .enter().append("text")
              .style("font-size", function(d) { return xScale(d.value) + "px"; })
              .style("font-family", "Impact")
              .style("fill", function(d, i) { 
			  color = fill(i);
			  return color=="#ffffb3"?"#ffd580":color; })
              .attr("text-anchor", "middle")
              .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .text(function(d) { return d.key; });
        }

        d3.layout.cloud().stop();
      }