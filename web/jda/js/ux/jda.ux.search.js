$(document).ready(function(){
	
	$('#search-bar').find('input').keydown(function(e){
		// Bind searching to search field
		if (e.which == 13)
		{
			jda.app.search({ query:$(this).val() })
			return false;
		}
	});
	
	$('#search-filters a').click(function(){
		$('#search-filters a.active').removeClass('active');
		$(this).addClass('active');
		console.log( $(this).data('goto-view') );
		return false;
	})
		
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