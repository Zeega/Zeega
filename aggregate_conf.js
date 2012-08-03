module.exports = {
	watch:{
		filePattern:/.*\.js$/
	},
	convert:[
		{
		    input: 'web/js/loaders/editor.js',
		    output: 'web/js_min/editor.js',
		    message:"Don't forget to check the JS paths in /src/Zeega/CoreBundle/Resources/views/Editor/editor.html.twig"
		},
	/*	{
		    input: 'web/js/loaders/browser.js',
		    output: 'web/js_min/browser.js',
		    message:"Don't forget to check the JS paths in /src/Zeega/CoreBundle/Resources/views/Editor/browser.html.twig"
		},
	*/	{
		    input: 'web/js/loaders/standalone-player.js',
		    output: 'web/js_min/standalone-player.js',
		    message:"Don't forget to check the JS paths in /src/Zeega/CoreBundle/Resources/views/Editor/player.html.twig"
		},

	]
}
