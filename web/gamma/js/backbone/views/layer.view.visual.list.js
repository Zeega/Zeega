


var VisualLayerListView = Backbone.View.extend({
	
	tagName : 'li',
	
	//draws the controls
	render : function( )
	{
		var _this = this;

		this.model.bind('remove',this.remove);
		var text = this.model.get('text');
		var type = this.model.get('type');
		
		// make sure we have a deep copy and not a reference that can be edited
		var defaults = deepCopy(this.model.layerClass.defaultAttributes);
		if( !this.model.get('attr') ) this.model.set({ attr : defaults });
		
		
		//var layerOrder = _.compact( Zeega.currentNode.get('layers') );

		//shorten title if necessary
		var title;
		if(this.model.get('attr').title != null && this.model.get('attr').title.length > 70)
		{
			title = this.model.get('attr').title.substr(0,70)+"…";
		}else{
			title = this.model.get('attr').title;
		}
		
		var persist;
		if( Zeega.route.get('attr') && Zeega.route.get('attr').persistLayers && _.include( Zeega.route.get('attr').persistLayers , _this.model.id ) )
		{
			persist = 'checked';
		}else{
			persist = '';
		}

		//set values to be filled into template
		var values = {
			id : 'layer-edit-'+this.model.id,
			layerName : title,
			persist : persist
		}
		//make template
		var tmpl = _.template( this.getTemplate() );
		//fill in template with values
		$(this.el).html( tmpl(values) );
		//set the id of the parent element
		$(this.el).attr('id', 'layer-'+ this.model.id);
		//add the controls to the layer
		
		$(this.el).find('#controls').append( this.model.layerClass.drawControls() );
				
		return this;
	},
	
	
	
	/***********************
	
			EVENTS
	
	***********************/
	
	events : {
		'click .delete-layer'		: 'delete',
		'click .layer-title'		: 'expand',
		'change #persist'			: 'persist'
	},
	
	//delete this layer from the DB and view
	delete : function()
	{
		this.remove();
		Zeega.removeLayerFromNode( Zeega.currentNode, this.model );
	},
	
	//	open/close and expanding layer items
	expand :function()
	{
		var _this = this;
		if( $(this.el).find('.layer-content').is(':visible') )
		{
			//hide layer controls
			$(this.el).find('.layer-content').hide('blind',{'direction':'vertical'});
			this.model.layerClass.onControlsClose();
			return false;
		}else{
			//show layer controls
			$(this.el).find('.layer-content').show('blind',{'direction':'vertical'},function(){ _this.model.layerClass.onControlsOpen() });
			return false;
		}
		
	},
	
	//set persistance action
	persist : function()
	{
		if( $(this.el).find('#persist').is(':checked') ) Zeega.persistLayerOverNodes(this.model);
		else Zeega.removeLayerPersist(this.model);
	},
	
	getTemplate : function()
	{
		var layerTemplate = '<div id="<%= id %>" class="layer-list clearfix">';
		layerTemplate += 		'<div class="layer-uber-bar clearfix">';
		layerTemplate += 			'<div class="layer-icon">';
		layerTemplate += 				'<span class="asset-type-icon ui-icon ui-icon-pin-w"></span>';
		layerTemplate += 			'</div>';
		layerTemplate += 		'<div class="layer-title"><%= layerName %></div>';
		layerTemplate += 		'<div class="layer-uber-controls">';
		layerTemplate += 			'<span class="delete-layer ui-icon ui-icon-trash"></span>';
		layerTemplate += 		'</div>';
		layerTemplate += 		'<div class="layer-drag-handle">';
		layerTemplate += 			'<span class="ui-icon ui-icon-grip-solid-horizontal"></span>';
		layerTemplate += 		'</div>';
		layerTemplate += 	'</div>';
		layerTemplate += 	'<div class="hidden layer-content clearfix">';
		layerTemplate += 		'<div id="controls"></div>';
		layerTemplate += 		'<br />';
		layerTemplate += 		'<form id="layer-persist">';
		layerTemplate += 			'<input id="persist" type="checkbox" name="vehicle" value="persist" <%= persist %> /> <label for="persist">Persist layer to route</label>';
		layerTemplate += 		'</form>';
		layerTemplate += 	'</div>';
		layerTemplate += '</div>';
		
		return layerTemplate;
	}
	
	
});


var VisualLayerListViewCollection = Backbone.View.extend({

	el : $('#layers-list-visual'),
	
	initialize : function()
	{
		var _this = this;
		
		//make arrays to store the views in
		this._renderedViews =[];
		
		this.collection.bind("add", function(layer) {
			// should draw the layer if it's in the node
			_this.add(layer);
		});

	},
	
	add : function ( layer ){
		var layerView = new VisualLayerListView({ model : layer });
		this._renderedViews.push( layerView );
		$(this.el).prepend( layerView.render().el );
		
	},
	
	render : function()
	{
		var _this = this;
		
		$(this.el).empty();
		_.each( _this.renderedViews , function(view){
			$(this.el).append(view.render().el);
		});
		return this;
	}

});



