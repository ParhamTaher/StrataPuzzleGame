$( document ).ready(function() {
    $('#back').click(back);
    $('#menu').click(toggleNav);
});

function toggleNav() {
	$("nav").toggleClass("nav-on");
}