

var VisualLayerEditorView = Backbone.View.extend({	
		
	initialize : function(options)
	{
		//eval( 'this.layerClass = new '+ this.model.get('type')+'Layer()' );
		//this.layerClass.load(this.model);
		
		this.model.bind( 'change', function(){
			console.log('layer change!!');
		});
	},
	
	//draws the controls
	render : function()
	{
		var _this = this;
		//remove this view when the model is removed
		this.model.bind('remove',function(){ _this.remove() });
				
		//set the view element to whatever the layerclass returns for the visual editor
		this.el = this.model.layerClass.drawToVisualEditor();
		
		if(this.model.layerClass.draggable)
		{
			
			$(this.el).draggable({
				stop : function(){
					_this.model.layerClass.onAttributeUpdate();
				}
			});
			
		}

		this.el.addClass('media')
			.attr({
				'id' : 'layer-preview-'+ _this.model.id,
				'data-layer-id' : _this.model.id
			});
			
			
		var cssObj = {
			'position' : 'absolute',
			'top' : _this.model.get('attr').y  +'%',
			'left' : _this.model.get('attr').x  +'%',
			'z-index' : _this.model.layerClass.zIndex,
			'width' : _this.model.get('attr').w+'%',
			'opacity' : _this.model.get('attr').opacity
		};

		this.el.css(cssObj);
		
		/*
		//set the z-index of the layer
		var layerOrder = _.compact( Zeega.currentNode.get('layers') );
		this.layerClass.setZIndex( _.indexOf(layerOrder, this.model.id) );
		*/
		
		//put the view element into the workspace
		$('#visual-editor-workspace').append($(this.el));
		
		//return the view
		return this;
	}
});


var VisualLayerEditorViewCollection = Backbone.View.extend({

	el : $('#visual-editor-workspace'),
	
	initialize : function()
	{
		console.log(this.collection);
		this.collection.each(this.add);

		/*
		_(this).bindAll('add', 'remove');
		this._layerViews = [];
		*/
		
		
		/*
		this.collection.each(this.add);
		this.collection.bind('add',this.add);
		this.collection.bind('remove',this.remove);
		this.collection.bind('destroy', this.remove);
		*/
	},
	
	add : function ( layer )
	{

		var listView = new VisualLayerEditorView({ model : layer });
		//this._layerViews.push( layer )
		$(this.el).prepend( listView.render().el );
		
		/*
		layer.url = Zeega.url_prefix+'layers/'+ layer.id;
		
		var lv = new VisualLayerListView({ model : layer });
		this._layerViews.push(lv);
		if(this._rendered) $(this.el).prepend(lv.render().el);
		*/
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



