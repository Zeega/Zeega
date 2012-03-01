
$(document).ready(function() {

	$('#home-search-bar').find('input').focus(function(){$(this).attr('value','');});
	$('#home-search-bar').find('input').bind('keypress', function(e) {
        if(e.keyCode==13){
            var query = $('#home-search-bar').find('input').val();
			window.location = 'search#q=' + query;
			return false;
        }
	});
	$('#go-button').click(function(){
		var query = $('#home-search-bar').find('input').val();
		window.location = 'search#q=' + query;
	});

});