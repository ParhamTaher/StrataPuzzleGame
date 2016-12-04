var actions = [];
var numActions = 0;
var layers = 0;

// Insert a ribbon when user clicks button. Update meta
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

// Change the selected colour
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
	ccolour = null;
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

// Builds the game (board, insert btns, colour stripes) and start game
// Takes a flattened list of colours. 
// e.g. build(['red', 'red', 'green', 'orange'])
function build(clrs) {
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

// Check if current state is goal state. If so end game
function check() {
	if (layers < 2*side) return;  // No holes
	for (let i=0;i<side**2;i++) { // Compare with goal
		if (state[i][0] != board[i]) return;
	}
	console.log("Goal reached. Game ended");
	$("#congrats").removeClass('disabled').find("span").html(''+numActions);
	$("#lower-mask").removeClass('disabled');
}

var level = 1;

// Change selected levels in level selection.
const levelStr = ['Easy', 'Normal', 'Hard', 'Expert'];
function levelDiff(amount) {
	if (level+amount > 4 || level+amount<1) return;
	level += amount;
	$("#level-dialog").find(".spinner").find("span").html(levelStr[level-1]);
}

function enterLevel(second) {
	build(levels[level+'.'+second]);
	$("#dialogs").addClass("disabled");
	$("#lower").removeClass("disabled");
}

// Check if the server delivered additional info, and act accordingly.
// Mainly insert username and verbose to navigation. If a board
// is provided, build the game, otherwise ask server for level data.
function getGameinfo() {
		$.get('/gameData', function(r){
			var data = JSON.parse(r);
		if (data.success && data.msg) {
			// Online pattern supplied
			build(JSON.parse(data.msg));
		} else {
			// Single player
	  		$("#dialogs").removeClass("disabled");
			$("#lower").addClass("disabled");
			$.get('levels.json', function(data) {
				levels = data;
			});
		}
	});
}





var levels = null;
$( document ).ready(function() {
	superInit();
	getuserinfo();
	getGameinfo();
});