(function(window, undefined) {
	var jQuery = window.jQuery
	if (window.Aloha === undefined || window.Aloha === null) {
		window.Aloha = {};		
	}
	window.Aloha.settings = {
		
				
				logLevels: {'error': false, 'warn': true, 'info': true, 'debug': false},
				errorhandling : true,
				ribbon: false,

/*
				"placeholder": {
					'*': '<img src="http://aloha-editor.org/logo/Aloha%20Editor%20HTML5%20technology%20class%2016.png" alt="logo"/>&nbsp;Placeholder All',
					'#typo3span': 'Placeholder for span'
				},
*/				
				/*
			
				"i18n": {
					// you can either let the system detect the users language (set acceptLanguage on server)
					// In PHP this would would be '<?=$_SERVER['HTTP_ACCEPT_LANGUAGE']?>' resulting in
					// "acceptLanguage": 'de-de,de;q=0.8,it;q=0.6,en-us;q=0.7,en;q=0.2'
					// or set current on server side to be in sync with your backend system
					"current": "en"
				},
				*/
				
				"plugins": {
					"format": {
						// all elements with no specific configuration get this configuration
						config : [ 'b', 'i','sub','sup'],
							editables : {
							// no formatting allowed for title
							'#title'	: [ ],
							// formatting for all editable DIVs
							'div'		: [ 'b', 'i', 'del', 'sub', 'sup'  ],
							// content is a DIV and has class .article so it gets both buttons
							'.article'	: [ 'b', 'i', 'p', 'title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'removeFormat']
							}
					},
					
					}
			};
})(window);