

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
	render : function(i)
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
			'width' : _this.model.get('attr').w+'%',
			'opacity' : _this.model.get('attr').opacity
		};

		this.el.css(cssObj);
		
		
		//set the z-index of the layer
/*		var layerOrder = _.compact( Zeega.currentNode.get('layers') );
		this.model.layerClass.setZIndex( _.indexOf(layerOrder, this.model.id) );
*/		this.model.layerClass.setZIndex( i );
		

		
		//return the view
		return this;
	}
});


var VisualLayerEditorViewCollection = Backbone.View.extend({

	el : $('#visual-editor-workspace'),
	
	initialize : function( options )
	{
		var _this = this;
		
		
		//make arrays to store the views in
		this._renderedViews =[];
		
		this.collection.bind("add", function(layer) {
			// should draw the layer if it's in the node
			console.log('layer added to layerViewVisualEditor collection');
			_this.add(layer);
		});
		
		
		this.collection.bind("remove", function(layer) {
			// should draw the layer if it's in the node
			_this.remove(layer);
		});
		
		//this.collection.bind('remove',this.remove);


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
	
	add : function ( layer ){
		var layerView = new VisualLayerEditorView({ model : layer });
		this._renderedViews.push( layerView );
		$(this.el).append( layerView.render().el );
	},
	
	remove : function(layer)
	{
		console.log('REMOVE from Collection')
		
		var viewToRemove = this; // _(this._layerViews.select(function(lv){return lv.model === model;}))[0];
		this._layerViews = _(this._layerViews).without(viewToRemove);
		
		Zeega.currentNode.noteChange();
		
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



