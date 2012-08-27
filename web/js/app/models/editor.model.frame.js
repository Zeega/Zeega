(function(Frame){

	Frame.LayerCollection = Backbone.Collection.extend({

		comparator : function( layer ){ return layer.layerIndex }
	
	})

	Frame.Model = Backbone.Model.extend({
		
		frameTarget : $('#frame-list'),
		
		defaults : {
			"name" : "Untitled",
			'layers' : [],
			"thumbnail_url" : '../../../images/thumb.png',
			"attr" : {
				"advance": 0
			}
		},
	
		url : function()
		{
			if( this.isNew() )return zeega.app.url_prefix+'api/projects/'+ zeega.app.project.id +'/sequences/'+ zeega.app.currentSequence.id +'/frames';
			else return zeega.app.url_prefix + 'api/frames/'+ this.id;
		},
	
		initialize : function()
		{
			if( this.get('layers') ) this.set({ 'layers' : _.map(this.get('layers'), function(layer){ return parseInt(layer) }) });
			if(this.get('thumbnail_url')=='') this.set('thumbnail_url',this.defaults.thumbnail_url)
			
			//this is the function that only calls updateThumb once after n miliseconds
			this.updateFrameThumb = _.debounce( this.updateThumb, 2000 );
			this.on('update_thumb', this.updateFrameThumb, this );
		},

		/*
			must be called after the model is created and after the project is fully loaded/parsed
		*/

		complete : function()
		{
			if( !this.get('layers') ) this.set({ layers:[] });
			var layerArray = this.get('layers').map(function(layerID){ return zeega.app.project.layers.get(layerID) });
			this.layers = new Frame.LayerCollection( layerArray );
			this.layers.on('add', this.updateLayerOrder, this);
			this.layers.on('remove', this.updateLayerOrder, this);

			this.sequenceFrameView = new Frame.Views.FrameSequence({
				model:this,
				attributes : {
					id:'frame-thumb-'+ this.id,
					'data-id' : this.id,
					style:'background-image:url('+ this.get('thumbnail_url') +')'
				}
			});
			this.editorWorkspace = new Frame.Views.EditorWorkspace({model:this});
			this.editorLayerList = new Frame.Views.EditorLayerList({model:this});
			this.editorLinkLayerList = new Frame.Views.EditorLinkLayerList({model:this});
		},

		/*
			updates the layer order when a layer is added, removed, or moved
		*/

		updateLayerOrder : function()
		{
			var layerOrder = this.layers.map(function(layer){ return parseInt(layer.id) });
			var layerOrder = _.compact( layerOrder );
			if(layerOrder.length == 0) layerOrder = [false];
			this.save('layers', layerOrder);
			this.updateThumb();
		},

		/*
			relies on the frame actually being rendered in the dom to work
		*/

		sortLayers : function( layerIDArray )
		{
			var _this = this;
			_.each(layerIDArray, function(layerID, i){
				var layer = _this.layers.get(layerID);
				$('#layer-visual-'+ layer.id).css('z-index', i);
				layer.layerIndex = i;
			})
			this.layers.sort();
			this.updateLayerOrder();
		},

		/*
			creates a new layer from an item model and adds it to the frame
		*/

		addItemLayer : function( itemModel )
		{
			var _this = this;
			var Layer = zeega.module('layer');
			// make a new layer // this could be more elegant // shouldnt' dump attributes into model!
			var newLayer = new Layer[itemModel.get('layer_type')]({
					type: itemModel.get('layer_type'),
					attr: itemModel.toJSON()
				});
			newLayer.save({},{
				success : function()
				{
					_this.layers.push( newLayer );
					zeega.app.project.layers.add( newLayer );
					newLayer.trigger('sync');
				}
			})
			return newLayer;
		},

		/*
			creates a new layer from a type and adds it to the frame
		*/

		addLayerByType : function( type, a )
		{
			var _this = this;
			var attributes = a || {};
			var Layer = zeega.module('layer');
			var newLayer = new Layer[type]();

			if( newLayer )
			{
				newLayer.save( {attr: _.extend(newLayer.get('attr'),attributes) }, {
					success : function()
					{
						_this.layers.push( newLayer );
						zeega.app.project.layers.add( newLayer );
						newLayer.trigger('sync');
					}
				})
				return newLayer;
			}
			else console.log('!!		no such layer type!');
		},

		// adds the frame workspace view to the editor
		renderWorkspace : function()
		{
			this.editorWorkspace.renderToEditor();
			this.editorLinkLayerList.renderToEditor();
			this.editorLayerList.renderToEditor();
		},
		// removes the frame workspace view to the editor
		removeWorkspace : function()
		{
			this.editorWorkspace.removeFromEditor()
			this.editorLinkLayerList.removeFromEditor();
			this.editorLayerList.removeFromEditor();
		},
		
		update : function( newAttr, silent )
		{
			var _this = this;
			if( _.isArray(this.get('attr')) ) this.set('attr',{});
			var a = _.extend( this.get('attr'), newAttr );
			this.set('attr',a);
			if( !silent )
			{
				this.save({},{
					success : function(){ _this.trigger('update') }
				});
			}
		},
		
		//update the frame thumbnail
		updateThumb : function()
		{
			
			// single frame url: frame
			var _this = this;
						
			if( this.updating != true && zeega.app.thumbnailUpdates )
			{
				this.updating = true; //prevent more thumb requests while this is working
				//Trigger new frame snapshot and persist url to database
				$('#frame-thumb-'+this.id).find('.frame-update-overlay').fadeIn('fast');
			
				var worker = new Worker( sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'/js/helpers/thumbworker.js');
			
				worker.addEventListener('message', function(e) {
					console.log(e)
					if(e.data)
					{
						_this.set({thumbnail_url:e.data});
						_this.save();
						console.log('thumbnail returned!!',e.data)
					}else{
						_this.trigger('thumbUpdateFail');
					}
					_this.updating = false; //allow further thumb updates
					this.terminate();
				}, false);
			
				worker.postMessage({'cmd': 'capture', 'msg': sessionStorage.getItem('hostname')+'static/scripts/frame.php?id='+this.get('id')}); // Send data to our worker.
			
			}
		},
		
		validate : function( attrs )
		{

			if( !_.isNull(attrs.layers) && attrs.layers.length > 1 && _.include(attrs.layers,false))
			{
				alert('There was an error with your project :(/nplease email bugs@zeega.org and describe what you were doing that led to this error.\nPlease refresh your browser. Your last edit may not have saved. We apologize for the inconvenience.');
				return 'layer array update error!';
			}
		}
	

	});

})(zeega.module("frame"));
