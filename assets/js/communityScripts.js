function getCommunityData() {
	$.get({
	    url: "/communityData",
	    dataType: "json",
	    success: function(r){
			if (r.success && r.msg) {
				var data = JSON.parse(r.msg);
				if (data.recentlyadded && data.recentlyadded.length > 0) {
					$ra = $($("#recently-added").removeClass("disabled").find("div")[0]);
					$.each(data.recentlyadded, function(idx, val){
						$ra.append(
							$("<a href=\"/game?pid="+val.pid+"\">\
								<img src=\"./assets/img/"+val.src+"\">\
				                <div class=\"pattern-desc\"><h4>"+val.name+"</h4>\
				                <span>Author: "+val.author+"</span><span>Posted: "+val.time+"</span>\
				                </div></a>")
						);
					});
				} 
				if (data.mostliked && data.mostliked.length > 0) {
					$ml = $($("#most-liked").removeClass("disabled").find("div")[0]);
					$.each(data.mostliked, function(idx, val){
						$ml.append(
							$("<a href=\"/game?pid="+val.pid+"\">\
								<img src=\"./assets/img/"+val.src+"\">\
				                <div class=\"pattern-desc\"><h4>"+val.name+"</h4>\
				                <span>Author: "+val.author+"</span><span>Likes: "+val.likes+"</span>\
				                </div></a>")
						);
					});
				} 
				if (data.patterns && data.patterns.length > 0) {
					$ra = $($("#all-patterns").removeClass("disabled").find("div")[0]);
					$.each(data.patterns, function(idx, val){
						$ra.append(
							$("<a href=\"/game?pid="+val.pid+"\">\
								<img src=\"./assets/img/"+val.src+"\">\
				                <div class=\"pattern-desc\"><h4>"+val.name+"</h4>\
				                </div></a>")
						);
					});
				} 
			}
		}
	});
}


function search() {
	var keyword = $("#search-bar").val();
	if (!keyword) {
		if ($($("section.showroom")[0]).hasClass("disabled")) {
			$("section.showroom, section.showroom2").has("a").removeClass("disabled");
			$("section.searchresult").addClass("disabled");
		}
		return;
	} else if (!$($("section.showroom")[0]).hasClass("disabled")) {
		$("section.showroom, section.showroom2").addClass("disabled");
	}

	$.post({
        url: "/search",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify( { keyword: keyword } ),
        success: function(r) {
        	if (r.success && r.msg) {
        		r = JSON.parse(r.msg);
        		if (r.patterns && r.patterns.length > 0) {
					$ra = $($("#search-patterns").removeClass("disabled").find("div")[0]);
					$ra.html("");
	       			$.each(r.patterns, function(idx, val){
						$ra.append(
							$("<a href=\"/game?pid="+val.pid+"\">\
								<img src=\"./assets/img/"+val.src+"\">\
				                <div class=\"pattern-desc\"><h4>"+val.name+"</h4>\
				                </div></a>")
						);
					});
	            }
	            if (r.users && r.users.length > 0) {
					$ra = $($("#search-users").removeClass("disabled").find("div")[0]);
					$ra.html("");
	       			$.each(r.users, function(idx, val){
						$ra.append(
							$("<a href=\"/profile?username="+val.username+"\">\
								<img src=\"./assets/img/"+val.src+"\" class=\"user-icon\">\
				                <div class=\"pattern-desc\"><h4>"+val.username+"</h4>\
				                </div></a>")
						);
					});
	            }
        	}
        }
    });
}


$( document ).ready(function() {
	superInit();
	$("#search-btn").click(search);
	getuserinfo();
	getCommunityData();
});