(function(Items) {

	//var BrowserSingleItemView = BrowserItemView.extend({
	Items.Views.Item = Backbone.View.extend({
	
		tagName:'li',
		
		initialize : function()
		{
			//when item removes itself from collection this gets fired
			this.model.bind('destroy', this.remove, this);
		},
		
		remove : function()
		{
			$(this.el).remove();
		},
		
		render: function()
		{
			var blanks = {
				src : this.model.get('thumbnail_url'),
				title : this.model.get('title'),
				link : this.model.get('uri'),
				id 	: this.model.get('id'),
			};

			//use template to clone the database items into
			var template = _.template( this.getTemplate() );

			//copy the cloned item into the el
			$(this.el).append( template( blanks ) );
			$(this.el).addClass('browser-results-image');

			/*
			OLD - WHAT WAS THIS FOR? Can't remember so commenting it out
			if(this.model.get('thumbnail_url')) var thumbnail_url=this.model.get('thumbnail_url').replace('s.jpg','t.jpg');
			else var thumbnail_url=sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'images/thumb.png';
			*/

			/*OLD WAY//render individual element
			this.el.addClass('browser-results-image');
			this.el.removeAttr('id');
			this.el.find('a:first').attr('id', this.model.get('id'));
			this.el.find('a:first').attr('title', this.model.get('title'));
			this.el.find('img').attr('src', thumbnail_url);


			//this.el.find('img').attr('src', (this.model.get('thumbnail_url') == null ? '' : this.model.get('thumbnail_url')));
			this.el.find('a:first').attr('href', this.model.get('uri'));
			this.el.find('img').attr('title', this.model.get('title'));
			this.el.find('img').attr('alt', (this.model.get('thumbnail_url') == null ? this.model.get('title').substring(0,17) + '...' : this.model.get('title')));
			*/
			var theModel = this.model;
			$(this.el).draggable({
				distance : 10,
				cursor : 'crosshair',
				appendTo : 'body',
				cursorAt : { 
					top : 25,
					left : 25
				},
				opacity : .75,
				helper : 'clone',

				//init the dragged item variable
				start : function(){
					$(this).draggable('option','revert',true);
					zeegaBrowser.app.draggedItem = theModel;
				},

				stop : function(){
					zeegaBrowser.app.draggedItem = null;
				}

			});
			return this;
		},
		getTemplate : function()
		{

			var html =	'<a id="<%= id %>" class="fancymedia fancybox.image" rel="group" title="<%= title %>" href="<%= link %>">'+
						'<img class="browser-img-large" src="<%= src %>" alt="<%= title %>" title="<%= title %>"></a>'+
						'<div class="browser-results-image-edit"><a class="browser-remove-from-collection" href=".">remove</a> <a class="browser-change-thumbnail" href=".">make cover</a>'+
						'</div>';

			return html;
		},

	});


})(zeegaBrowser.module("items"));