

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
		var _this = this;
		
		//make arrays to store the views in
		this._allViews = [];
		this._renderedViews =[];
		
		_.each( _.toArray( this.collection ), function(layer){
			_this.addLayerToViewArrays(layer);
		})
		
		//this.collection.bind('add',this.add);
		
		/*
		this.collection.bind("add", function(layer) {
			// should draw the layer if it's in the node
			_this.addLayerToViewArrays(layer);
		});
*/

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
	
	addLayerToViewArrays : function( layer )
	{
		console.log('layerviewvisualeditor: '+layer.id)
		var editorView = new VisualLayerEditorView({ model : layer });

		this._allViews[layer.id] = editorView;

		this._renderedViews.push(editorView);
		editorView.render(this._renderedViews.length);
	},
	
	remove : function(layer)
	{
		console.log('rmvCollection')
		
		var viewToRemove = this; // _(this._layerViews.select(function(lv){return lv.model === model;}))[0];
		this._layerViews = _(this._layerViews).without(viewToRemove);
		
		Zeega.currentNode.noteChange();
		
	},
	
	removeAll : function()
	{
		//remove from the dom
		_.each( this.renderedViews, function(view){
			view.remove();
		});
		//empty array
		this._renderedViews = [];
		
		this.el.empty();
	},
	
	render : function(layerIDs)
	{
		var _this = this;
		_.each( layerIDs, function(layerID, i){
			var layerToRender = _this._allViews[layerID];
			_this._renderedViews.push( layerToRender )
			layerToRender.render(i);
		})

	}
	
	
	
});



