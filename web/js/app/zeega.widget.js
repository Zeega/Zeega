//Adds a function to the javascript date object.
//Didn't really know where to put this so I put it here...(Catherine)
Date.prototype.getMonthAbbreviation = function() {
   return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][this.getMonth()]; 
}

this.zeegaWidget = {
	// break up logical components of code into modules.
	module: function()
	{
		// Internal module cache.
		var modules = {};

		// Create a new module reference scaffold or load an existing module.
		return function(name) 
		{
			// If this module has already been created, return it.
			if (modules[name]) return modules[name];

			// Create a module and save it under this name
			return modules[name] = { Views: {} };
		};
	}(),

  // Keep active application instances namespaced under an app object.
	app: _.extend({
	
		myCollections : null,
		myCollectionsView : null,
		search : null, 
		searchItemsView : null,
		searchCollectionsView : null,

		init : function()
		{
			console.log('WIDGET INIT')
			var Items = zeegaWidget.module('items');
			this.items = new Items.MasterCollection();
			console.log(this.items)
			var itemBS = jQuery.parseJSON(itemJSON);
			console.log(itemBS)
			var newItem = new Items.Model( itemBS );
			console.log(newItem);
			var newItemView = new Items.Views.Ingesting({ model : newItem } )
			newItemView.render();
			//not html
			//$('#item-view').append( newItemView.render().el );

		}

	}, Backbone.Events)

};