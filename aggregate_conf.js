module.exports = {
	watch:{
		filePattern:/.*\.js$/
	},
	convert:[

		{
			input: 'web/js/loaders/discovery.js',
			output: 'web/js_min/discovery.js',
			message:"Don't forget to check the JS paths in /src/Zeega/DiscoveryBundle/Resources/views/Library/library.html.twig"
		},
		{
			input: 'web/js/loaders/header.js',
			output: 'web/js_min/header.js',
			message:""
		}
	

	]
};
