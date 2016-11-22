var actions = [];
var numActions = 0;
var layers = 0;
function insert(who, idx) {
	if (!ccolour) return;

	layers ++;
	$(who).addClass("disabled");
	$(who).next().attr("class","ribbon "+ccolour).addClass("ribbon-on");
	$(who).parent().css("z-index",layers);

	numActions ++;
	$("#steps").html(''+numActions);
	console.log("Insert "+ccolour+" ribbon at "+idx);
	actions.push(ccolour+":"+idx);

	check();
}

var ccolour = null;
function colour(who) {
	$("#colours span").each(function(){
		$(this).removeClass("colour-on");
	})
	ccolour = $(who).attr('class');
	$(who).addClass("colour-on");
}

function restart() {
	actions = [];
	numActions = 0;
	$("#steps").html('0');
	layers = 0;
	console.log("Restart");

	$("#board span.insert").each(function(idx){
		$(this).attr("class", "insert").next().removeClass('ribbon-on');
	});
	$("#colours span").each(function(){
		$(this).removeClass("colour-on");
	});
}

function undo() {
	if (actions.length == 0) return;
	var [colour, idx] = actions.pop().split(":");
	$insert = $($("#board span.insert")[parseInt(idx)]);
	$insert.removeClass("disabled").next().removeClass('ribbon-on');

	layers --;
	console.log("Undo "+colour+" ribbon at "+idx);
}

var board = [];
function build(clrs) {
	// Builds the game scene (board, insert btns, colour stripes)
	// Takes a flattened list of colours. 
	// e.g. build(['red', 'red', 'green', 'orange'])
	var side = Math.sqrt(clrs.length);
	if (Math.floor(side) != side) return;
	board = clrs;

	var used = {};
	var $ribbons = $(".ribbons");
	var $colours = $("#colours");
	$ribbons.html("");
	$colours.html("");

	// Board
	var patternStr = "";
	$.each(clrs, function(idx, val) {
		patternStr += "<div class=\""+val+" cell-"+side+"\"></div>";
		used[val] = 1;
	});
	$("#pattern").html(patternStr);

	// Insert btns
	for (let i=0;i<2*side;i++) {
		$c = $("<div class=\"cell-" + side + (i>=side?" right":"")+
		"\"><span class=\"insert\"></span><div class=\"ribbon\"></div></div>");
		$c.find("span").click(function(){
			insert(this, i);
		});
		$ribbons.append($c);
	}

	// Colour stripes
	$.each(used, function(k, v) {
		$colours.append($("<span class=\""+k+"\"></span>").click(function(){
			colour(this);
		}));
	});
}

function check() {
	// Check the state dictionary/list and compare with board
	// If match, end game
	if (layers < board.length) return;

}
