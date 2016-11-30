var actions = [];
var layers = 0;
function insert(who, idx) {
	if (!ccolour) return;

	layers ++;
	$(who).addClass("disabled");
	$(who).next().attr("class","ribbon "+ccolour).addClass("ribbon-on");
	$(who).parent().css("z-index",layers);

	console.log("Insert "+ccolour+" ribbon at "+idx);
	actions.push(ccolour+":"+idx);
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
	$("#steps").html('0');
	layers = 0;
	ccolour = null;
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

	layers --;
	console.log("Undo "+colour+" ribbon at "+idx);
}

var side = 2;
function build() {
	// Builds the empty game scene (board, insert btns, colour stripes)
	// Takes a flattened list of colours. 
	actions = [];
	$("#steps").html('0');
	layers = 0;
	$("#board").attr("class", "board-"+side);
	$("#dialogs").addClass("disabled");
	$("#lower").removeClass('disabled');

	var $ribbons = $(".ribbons");
	var $colours = $("#colours");
	$ribbons.html("");
	$colours.html("");

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
	used = ["red", "orange", "yellow", "green", "cyan", "blue", "violet", "white", "grey", "black"];
	$.each(used, function(i, v) {
		$colours.append($("<span class=\""+v+"\"></span>").click(function(){
			colour(this);
		}));
	});
}

function completed() {
	if (layers < 2*side) return;  // No holes
	$("#buttons").find("img").toggleClass("disabled");
	$("#pattern").toggleClass('disabled').prev().toggleClass('fade');
	$("#name-dialog").toggleClass('disabled');
	$("#colours").toggleClass('disabled');

	if ($("#lower-mask").hasClass('disabled')) {
		return;
	}

	// Display board
	actions2board();
	var patternStr = "";
	$.each(board, function(idx, val) {
		patternStr += "<div class=\""+val+" cell-"+side+"\"></div>";
		used[val] = 1;
	});
	$("#pattern").html(patternStr);
}

var board = [];
function actions2board() {
	board = [];
	for (let i=0;i<actions.length;i++) {
		var action = actions[i].split(":");
		clr = action[0];
		idx = action[1];
		if (idx >= side) {  // Update column
			for (let i=0;i<side**2;i++) {
				if (i % side == idx-side) board[i]=clr;
			}
		} else {  // Update row
			for (let i=0;i<side**2;i++) {
				if (Math.floor(i / side) == idx) board[i]=clr;
			}
		}
	}	
	return board;
}

function sizePattern (amount) {
	if (side+amount > 10 || side+amount<2) return;
	side += amount;
	$("#size-dialog").find("span").html(side+' x '+side);
}

function upload() {
	$name = $("#name-dialog").find("input");
	if (!$name.html()) {
		$name.css('background-color', '#c63d44');
		setTimeout(function(){ $name.css('background-color', 'transparent') }, 2000);
		return;
	}
    $.post({
        url: "/newpattern",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify( {board: board, name:$name.html()} ),
        success: function(r) {
            congrats(true, 'Upload successful');
            $("#buttons").find("img[title=Upload]").addClass('disabled');
            $("#buttons").find("img[title=Edit]").addClass('disabled');
            $("#name-dialog").find("p").addClass("disabled");
            $name.css("border", "none").prop('disabled', true);
        },
        error: function (r) {
        	congrats(false, r.responseText+". Please try again.");
        }
    });
}

function congrats(foreal, text) {
	$("#congrats").removeClass("disabled")
	.find("img").attr("src", "./assets/img/"+(foreal?"check":"cross")+".png")
	.next().html(text);
	setTimeout(function(){ $("#congrats").addClass("disabled"); }, 3000);
}

function serversays() {
	if ($("#serversays").length!=0) {
		var data = JSON.parse($("#serversays").html());
		$("#serversays").remove();

		if (data.username && data.verbose) {
			$($("#nav-pbrief").find("span")[0]).html(data.username);
			$($("#nav-pbrief").find("span")[1]).html(data.verbose);
		}
	}
}

$( document ).ready(function() {
	superInit();
	serversays();
});