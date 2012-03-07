
$(document).ready(function(){

	$('#home-search-bar').focus();
	$('#home-search-bar').find('input').bind('keypress', function(e) {
        if(e.keyCode==13){
            var query = $('#home-search-text-field').val();
			window.location = 'search#q=' + query;
			return false;
        }
	});
	$('#go-button').click(function(){
		var query = $('#home-search-text-field').val();
		window.location = 'search#q=' + query;
	});

});