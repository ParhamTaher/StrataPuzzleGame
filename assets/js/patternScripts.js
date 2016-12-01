$( document ).ready(function() {
	superInit();
	serversays();
});

function serversays() {
	if ($("#serversays").length!=0) {
		var data = JSON.parse($("#serversays").html());
		$("#serversays").remove();

		if (data.username && data.verbose) {
			$($("#nav-pbrief").find("span")[0]).html(data.username);
			$($("#nav-pbrief").find("span")[1]).html(data.verbose);
		}
		if (data.pattern) {
			var p = data.pattern;
			$("#desc").find("img").attr("src", "./assets/img/"+p.src);
			$("#desc").find("div.pattern-desc").find("h4").html(p.name)
				.next().html("Author: "+p.author).next().html("Posted: "+p.time);
			$("#try").attr("href", "./game?pid="+p.pid);
			$("#like").click(function(){like(p.pid);})
				.find("span").html(p.liked?"Liked ":"like "+p.likes);
		} 
	}
}

function like(pid) {
	$.post({
        url: "/toggleLike",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify( { pid: pid } ),
        success: function(r) {
        	$("#like").find("span").html(r.liked?"Liked ":"like "+r.likes);
        }
    });
}