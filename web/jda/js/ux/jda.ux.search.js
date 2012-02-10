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
		
		jda.app.switchViewTo( $(this).data('goto-view') );
		
		return false;
	})

});