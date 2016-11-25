var actions = [];
var numActions = 0;
var layers = 0;
function insert(who, idx) {
	if (!ccolour) return;

	layers ++;
	$(who).addClass("disabled");
	$(who).next().attr("class","ribbon "+ccolour).addClass("ribbon-on");
	$(who).parent().css("z-index",layers);

	if (idx >= side) {  // Update column
		for (let i=0;i<side**2;i++) {
			if (i % side == idx-side) state[i].unshift(ccolour);
		}
	} else {  // Update row
		for (let i=0;i<side**2;i++) {
			if (Math.floor(i / side) == idx) state[i].unshift(ccolour);
		}
	}

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
	state = [];
	for (let i=0;i<side**2;i++) { state.push([]); }
	$("#steps").html('0');
	layers = 0;
	console.log("Restart");

	$("#board span.insert").each(function(idx){
		$(this).attr("class", "insert").next().removeClass('ribbon-on');
	});
	$("#colours span").each(function(){
		$(this).removeClass("colour-on");
	});

	$("#congrats").addClass('disabled');
	$("#lower-mask").addClass('disabled');
}

function undo() {
	if (actions.length == 0) return;
	var [colour, idx] = actions.pop().split(":");
	$insert = $($("#board span.insert")[parseInt(idx)]);
	$insert.removeClass("disabled").next().removeClass('ribbon-on');

	if (idx >= side) {  // Update column
		for (let i=0;i<side**2;i++) {
			if (i % side == idx-side) state[i].shift();
		}
	} else {  // Update row
		for (let i=0;i<side**2;i++) {
			if (Math.floor(i / side) == idx) state[i].shift();
		}
	}

	layers --;
	console.log("Undo "+colour+" ribbon at "+idx);
}

var board = [];
var state = [];
var side = 0;
function build(clrs) {
	// Builds the game scene (board, insert btns, colour stripes)
	// Takes a flattened list of colours. 
	// e.g. build(['red', 'red', 'green', 'orange'])
	side = Math.sqrt(clrs.length);
	if (Math.floor(side) != side) return;
	board = clrs;
	state = [];
	$("#board").attr("class", "board-"+side);
	for (let i=0;i<side**2;i++) { state.push([]); }

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

var state = null;
function check() {
	// Check the state dictionary/list and compare with board
	// If match, end game
	if (layers < 2*side) return;  // No holes
	for (let i=0;i<side**2;i++) { // Compare with board
		if (state[i][0] != board[i]) return;
	}
	console.log("Match solution. Game ended");
	$("#congrats").removeClass('disabled').find("span").html(''+numActions);
	$("#lower-mask").removeClass('disabled');
}

var level = 1;
const levelStr = ['Easy', 'Normal', 'Hard', 'Expert'];
function levelDiff(amount) {
	if (level+amount > 4 || level+amount<1) return;
	level += amount;
	$("#level-dialog").find(".spinner").find("span").html(levelStr[level-1]);
}

var levels = null;
$( document ).ready(function() {
	superInit();
	// $.get('levels.json', function(data) {
	// 	levels = JSON.parse(data);
	// });
	levels = {
		1.1:["yellow", "yellow", "yellow", "yellow"],
		1.2:["blue", "blue", "cyan", "cyan"],
		1.3:["red", "red", "green", "orange"],
		1.4:["cyan", "violet", "cyan", "cyan"],
		1.5:["red", "red", "green", "orange"],
		1.6:["cyan", "violet", "cyan", "cyan"],
		1.7:["cyan", "violet", "cyan", "violet", "violet", "violet", "cyan", "violet", "cyan"],
		1.8:["orange", "cyan", "orange", "green", "cyan", "yellow", "yellow", "cyan", "yellow"],
		1.9:["cyan", "cyan", "blue", "violet", "violet", "violet", "cyan", "violet", "blue"],
		2.1:["white", "grey", "black", "grey", "grey", "black", "black", "black", "black"],
		3.1:["orange", "orange", "green", "red", "yellow", "orange", "green", "red", "green", "green", "green", "red", "yellow", "yellow", "green", "yellow"],
		4.1:["cyan", "blue", "blue", "violet", "blue", "cyan", "cyan", "blue", "cyan", "cyan", "cyan", "cyan", "violet", "blue", "violet", "violet", "blue", "violet", "cyan", "blue", "blue", "violet", "blue", "cyan", "blue", "blue", "blue", "blue", "blue", "blue", "violet", "violet", "violet", "violet", "violet", "violet"]
	}
});

function enterLevel(second) {
	$("#dialogs").addClass("disabled");
	$("#lower").removeClass("disabled");
	build(levels[level+'.'+second]);
}
