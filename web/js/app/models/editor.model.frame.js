(function(Frame){

	Frame.LayerCollection = Backbone.Collection.extend({

		comparator : function( layer ){ return layer.layerIndex }
	
	});

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
			var layerArray = this.get('layers').map(function(layerID){ return zeega.app.project.layers.get(layerID); });

			var brokenLayers = [];
			//validate link layers
			_.each(layerArray, function(layer){
				if(layer.get('type') == 'Link')
				{
						console.log('link layer broken', layer, layer.get('attr').to_frame,layer.get('attr').from_frame);
					if( _.isNull(layer.get('attr').to_frame) || _.isNull(layer.get('attr').from_frame) || !zeega.app.project.frames.get(layer.get('attr').to_frame) || !zeega.app.project.frames.get(layer.get('attr').from_frame) )
					{
						console.log('link layer broken', layerArray, layer);
						brokenLayers.push(layer);
						//layer.save({type:'Ghost'});
					}
				}
			});

			this.layers = new Frame.LayerCollection( layerArray );
			console.log('these are layers', this.layers);

			if( brokenLayers.length )
			{
				this.layers.remove(brokenLayers);
				this.updateLayerOrder();
			}
			this.layers.on('add', this.updateLayerOrder, this);
			this.layers.on('remove', this.updateLayerOrder, this);

			this.sequenceFrameView = new Frame.Views.FrameSequence({
				model:this,
				attributes : {
					id:'frame-thumb-'+ this.id,
					'data-id' : this.id
				}
			});
			this.detailsBar = new Frame.Views.DetailBar({model:this});
			this.visualWorkspace = new Frame.Views.VisualWorkspace({model:this});
			this.editorLayerList = new Frame.Views.EditorLayerList({model:this});
			this.editorLinkLayerList = new Frame.Views.EditorLinkLayerList({model:this});

			this.complete = true;
		},

		/*
			updates the layer order when a layer is added, removed, or moved
		*/

		updateLayerOrder : function()
		{
			console.log('update layer order', this.id, this, this.layers.length +'');
			var layerOrder = this.layers.map(function(layer){
				console.log('---inside', layer.id, layer );
				return parseInt(layer.id,10);
			});
			console.log('update layer order', layerOrder);

			layerOrder = _.compact( layerOrder );
			if(layerOrder.length === 0) layerOrder = [false];
			console.log('update layer order', layerOrder);
			this.save('layers', layerOrder);
			console.log('$$$$ update layer order', this, layerOrder);
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
			newLayer.on('sync', this.onFirstLayerSave, this);
			newLayer.save();
			
			return newLayer;
		},

		onFirstLayerSave : function( layer )
		{
			zeega.app.project.layers.add( layer );
			this.layers.push( layer );
			layer.off('sync',this.onFirstLayerSave);
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
				newLayer.on('sync', this.onNewLayerSave, this );
				newLayer.save({ attr : _.extend({},newLayer.get('attr'),attributes) })
				return newLayer;
			}
			else console.log('!!		no such layer type!');
		},

		onNewLayerSave : function( layer )
		{
			layer.off('sync', this.onNewLayerSave);
			this.layers.push( layer );
			zeega.app.project.layers.add( layer );
		},

		// adds the frame workspace view to the editor
		renderWorkspace : function()
		{
			this.detailsBar.render();
			this.visualWorkspace.render();
			this.editorLinkLayerList.render();
			this.editorLayerList.render();
		},
		// removes the frame workspace view to the editor
		removeWorkspace : function()
		{
			this.detailsBar.onExit();
			this.visualWorkspace.unrender();
			//this.editorLinkLayerList.removeFromEditor();
			this.editorLayerList.removeFromEditor();
		},
		
		update : function( newAttr, silent )
		{
			var _this = this;
			if( _.isArray(this.get('attr')) ) this.set('attr',{});
			var a = _.extend( this.get('attr'), newAttr );
			this.set('attr',a);
			if( !silent ) this.save();
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
					//console.log(e)
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
		}

	});

})(zeega.module("frame"));
