








$(document).ready(function() {
	

	$('#search-bar').find('input').focus(function(){$(this).attr('value','');}).keydown(function(e) {
			// Bind searching to search field
			if (e.which == 13) {
				homeSearch($(this).val());
				return false;
			}
		});
	$("#go-button").click(function() {
			homeSearch($('#search-bar').find('input').val());
			return false;
	});
	
	
	$('#language-japanese').click(function(){
	
		window.location=sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+"jp/search"+window.location.hash;
	
	});

	$('#language-english').click(function(){
		window.location=sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+"en/search"+window.location.hash;
	});

});