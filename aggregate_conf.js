module.exports = {
	watch:{
		filePattern:/.*\.js$/
	},
	convert:[
		{
		    input: 'web/js/loaders/home.js',
		    output: 'web/js_min/home.js',
		    message:"Don't forget to check the JS paths in /src/Zeega/CoreBundle/Resources/views/Community/home.html.twig"
		},
		{
		    input: 'web/js/loaders/editor.js',
		    output: 'web/js_min/editor.js',
		    message:"Don't forget to check the JS paths in /src/Zeega/CoreBundle/Resources/views/Editor/editor.html.twig"
		},
		{
		    input: 'web/js/loaders/discovery.js',
		    output: 'web/js_min/discovery.js',
		    message:"Don't forget to check the JS paths in /src/Zeega/DiscoveryBundle/Resources/views/Library/library.html.twig"
		},
		{
		    input: 'web/js/loaders/standalone-player.js',
		    output: 'web/js_min/standalone-player.js',
		    message:"Don't forget to check the JS paths in /src/Zeega/CoreBundle/Resources/views/Editor/player.html.twig"
		},
		{
		    input: 'web/js/loaders/widget.js',
		    output: 'web/js_min/widget.js',
		    message:"Don't forget to check the JS paths in /src/Zeega/CoreBundle/Resources/views/Editor/widget.html.twig"
		},
	

	]
}
