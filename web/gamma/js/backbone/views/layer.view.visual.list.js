var VisualLayerListView = Backbone.View.extend({
	
	tagName : 'li',
	
	initialize : function(options)
	{
		// add a visual view into this view
		this._visualEditorView = new LayerVisualEditorView({ model : this.model })
		
		this.model.bind( 'change', function(){
			console.log('layer change!!');
		});
	},
	
	//draws the controls
	render : function()
	{
		var _this = this;
		
		//render the visual editor view
		this._visualEditorView.render();
		
		//this.model.layerClass.load(this.model);
		
		this.model.bind('remove',this.remove);
		var text = this.model.get('text');
		var type = this.model.get('type');
		
		
		if( !this.model.get('attr') ) this.model.set({ attr : this.model.layerClass.defaultAttributes });
		
		
		//var template = $(layerTemplate).attr('id', 'layer-edit-'+this.model.id );
		
		var layerOrder = _.compact( Zeega.currentNode.get('layers') );

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
		var tmpl = _.template(layerTemplate);
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
			this.model.layerClass.closeControls();
			return false;
		}else{
			//show layer controls
			$(this.el).find('.layer-content').show('blind',{'direction':'vertical'},function(){ _this.model.layerClass.openControls() });
			return false;
		}
		
	},
	
	//set persistance action
	persist : function()
	{
		if( $(this.el).find('#persist').is(':checked') ) Zeega.persistLayerOverNodes(this.model);
		else Zeega.removeLayerPersist(this.model);
	}
	
	
});


var VisualLayerListViewCollection = Backbone.View.extend({

	el : $('#layers-list-visual'),
	
	initialize : function()
	{
		_(this).bindAll('add', 'remove');
		this._layerViews = [];
		/*
		this.collection.each(this.add);
		this.collection.bind('add',this.add);
		this.collection.bind('remove',this.remove);
		this.collection.bind('destroy', this.remove);
		*/
	},
	
	add : function ( layer )
	{
		layer.url = Zeega.url_prefix+'layers/'+ layer.id;
		
		var lv = new VisualLayerListView({ model : layer });
		this._layerViews.push(lv);
		if(this._rendered) $(this.el).prepend(lv.render().el);
	},
	
	remove : function(layer)
	{
		console.log('rmvCollection')
		
		var viewToRemove = this; // _(this._layerViews.select(function(lv){return lv.model === model;}))[0];
		this._layerViews = _(this._layerViews).without(viewToRemove);
		
		Zeega.currentNode.noteChange();
		
	},
	
	
	render : function()
	{
		this._rendered = true;
		var _this = this;
		
		//clear out any old stuff inside this.el
		$(this.el).empty();
		//add EACH model's view to the _this.el and render it
		_.each(this._layerViews, function(layer){ $(_this.el).prepend(layer.render().el) });
		
		return this;
	}
	
});


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
