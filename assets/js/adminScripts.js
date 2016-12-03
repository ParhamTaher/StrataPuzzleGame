$( document ).ready(function() {
	serversays();
	$("#add-user").click(addUser);
	$("#search-btn").click(searchEntries);
});

function serversays() {
	if ($("#serversays").length!=0) {
		var data = JSON.parse($("#serversays").html());
		$("#serversays").remove();

		if (data.username) {
			$("#admin-un").html(data.username);
		}
		if (data.users) {
			$ra = $("#users").removeClass("disbled").find("tbody");
   			$.each(data.users, function(idx, val){
   				let $entry = $("<tr><td><img src=\"./assets/img/"+val.src+"\" class=\"avatar\" ></td>\
                    <td>"+val.username+"</td>\
                    <td>******</td>\
                    <td>"+val.desc+"</td>\
                    <td><a href=\"./profile?username="+val.username+"\">\
                    <img src=\"./assets/img/more.png\"></a></td>\
                    <td><img class=\"del\" src=\"./assets/img/cross.png\"></td></tr>");
   				$entry.find("img.del").click(function(){delEntry($entry, val.username, 'User')});
				$ra.append($entry);
			});
		} 
		if (data.patterns) {
			$ra = $("#patterns").removeClass("disbled").find("tbody");
   			$.each(data.patterns, function(idx, val){
   				let $entry = $("<tr><td><img src=\"./assets/img/"+val.src+"\" class=\"icon\" ></td>\
                    <td>"+val.name+"</td><td>"+val.author+"</td>\
                    <td>"+val.time+"</td><td>"+val.likes+"</td>\
                    <td><img name=\"del\" src=\"./assets/img/cross.png\"></td></tr>");
   				$entry.find("img[name=del]").click(function(){delEntry($entry, val.pid, 'Pattern')}).removeAttr('name');
				$ra.append($entry);
			});
		} 
	}
}

function delEntry(who, id, type) {
	if (type!='User' && type!='Pattern') return;
	if (confirm("Are you Sure?")) {
		var data = {};
		data[type=='User'?'username':'pid'] = id;

		$.post({
	        url: "/delete"+type,
	        dataType: "json",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify( data ),
	        success: function(r) {
	        	who.addClass("red");
	        	setTimeout(function(){who.remove()}, 2000);
	        }
	    });
	}	
}

function addUser() {
	var un = $("#new-un").val();
	var pw = $("#new-pw").val();
	if (un && pw && confirm("Create User "+un+"?")) {
		$.post({
	        url: "/register",
	        dataType: "json",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify( JSON.stringify( {	username: un, password: pw } )),
	        success: function(r) {
	        	let $entry = $("<tr><td><img src=\"./assets/img/avatar.png\" class=\"avatar\"></td>\
                    <td>"+un+"</td><td>******</td><td></td>\
                    <td><a href=\"./profile?username="+un+"\">\
                    <img src=\"./assets/img/more.png\"></a></td>\
                    <td><img class=\"del\" src=\"./assets/img/cross.png\"></td></tr>");
   				$entry.find("img.del").click(function(){delEntry($entry, un, 'User')});
	        	$("#users").find("tbody").prepend($entry);
	        	$entry.addClass("green");
	        	setTimeout(function(){$entry.removeClass("green")}, 2000);
	        	$("#new-un").val("");
	        	$("#new-pw").val("");
	        },
	        error: function(r) {
	        	var $target = $("#new-user").find("tr");
	        	$target.addClass("red");
	        	setTimeout(function(){ $target.removeClass("red") }, 2000);
	        }
	    });
	}
}

function searchEntries() {
	// Offline search since we have all data already. Examines all tr's.
	var keyword = $("#search-bar").val().toUpperCase();
	$("tbody tr").each(function(idx, val) {
		if (keyword && $(val).html().toUpperCase().indexOf(keyword)<0) {
			$(val).addClass("disabled");
		}else {
			$(val).removeClass("disabled");
		}
	})
}