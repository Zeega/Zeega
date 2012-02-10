
/********************************************

	ZEEGA.JS 

	CORE APPLICATION OBJECT
	
	VERSION 1.0
	
	
*********************************************/

/********************************************

	THE Zeega object to end all objects

*********************************************/

var Zeega = {
	
	sequenceID : 1,
	currentFrame : null,
	
	previewMode:false,
	
	helpCounter: 0,
	
	maxFramesPerSequence : 0, // 0 = no limit
	maxLayersPerFrame : 0, // 0 = no limit
	
	url_prefix : "",
	
	url_hash : {
		'sequence' : null,
		'frame' : null
	},
	
	//this function is called once all the js files are sucessfully loaded
	init : function()
	{

		// makes sure that zeega only advances after both frames and layers are loaded
		//commented out??
		this.zeegaReady = _.after(2,this.framesAndLayersReady);

		this.initStartHelp();

		Zeega.url_prefix = sessionStorage.getItem('hostname') + sessionStorage.getItem('directory');
	},
	
	
	//set the sequence without loading it
	//do we need this?
	setSequence : function(sequenceID)
	{
		this.sequenceID = sequenceID;
	},
	
	createSequence : function()
	{
		//make a new and empty sequence
		
		var newSequence = new Sequence();
		var _this = this;
		
		newSequence.save({},{
		
			success: function(sequence,response){
				_this.sequence = sequence;
				_this.sequenceID= sequence.id;
				_this.sequenceView = new SequenceView({ model : z.sequence });
				_this.sequenceView.render();
				_this.loadFrames();
				_this.loadLayers();
			
				console.log('new sequence created with id: '+ sequence.id);
			},
			error: function(){
				console.log('error');
			}
		
		
		});
		
	},
	
	//set and load a new sequence
	//this is the first function called when loading the editor in dev
	loadProject : function()
	{
		var _this = this;
		this.projectID =  $('#project-id').val();
		this.project = new Project({ 'id' : this.projectID });
		this.project.fetch({
			success: function(project)
			{
				_this.projectView = new ProjectView({ model : _this.project });
				_this.projectView.render();
				if( project.get('attr').ratio ) changeAspectRatio( project.get('attr').ratio )
			}
		});
	},
	loadSequence : function(sequenceID)
	{
		
		var _this = this;
		this.sequenceID = sequenceID;
		this.sequence = new Sequence({ 'id' : this.sequenceID });
		this.sequence.fetch({
			success: function(sequence, response)
			{
				_this.loadFrames();
				_this.loadLayers();
				_this.loadProject();
			}
		});
		

	},
	
	loadFrames : function()
	{
		var _this = this;
		//create a frame collection inside the sequence model
		this.sequence.frames = new FrameCollection;
		//get all existing frames

		this.sequence.frames.fetch({
			success : function(frames,response)
			{
				console.log('frames')
				console.log(frames)
				//make a frame view collection
				_this.sequence.frameViewCollection = new FrameViewCollection({ collection : frames });
				//render everything in the frameViewCollection
				_this.sequence.frameViewCollection.render();
				_this.zeegaReady();
			}
		});
	},
	
	loadLayers : function()
	{
		var _this = this;
		//create a layer collection inside the sequence model
		this.sequence.layerCollection = new LayerCollection;
		//get all existing layers
		this.sequence.layerCollection.fetch({
			
			success : function(layers)
			{
				console.log('layers')
				console.log(layers)
				_this.sequence.layerCollection.parseLayers();
				_this.zeegaReady();
			}
		});
	},
	
	framesAndLayersReady : function()
	{
		this.currentFrame = this.sequence.frames.at(0);
		console.log('ready')
		console.log(this)
		//if no frames exist, create one
		if( _.size(this.sequence.frames) == 0 )
		{
			console.log('no frames. MAKE ONE!')
			var newFrame = new Frame;
			this.sequence.frameViewCollection.add(newFrame);
			this.loadFrame( newFrame );
		}else if(this.url_hash.frame){
			this.loadFrame( this.sequence.frames.get(this.url_hash.frame) );
		}else{
			this.loadFrame( this.sequence.frames.at(0) );
		}
		
		this.frameSort();
		
	},
	
	loadFrame : function( frame )
	{
		var _this = this;
		
		this.clearCurrentFrame();
		
		//set global currentFrame to the selected frame
		this.currentFrame = frame;

		if(frame) window.location.hash = '/editor/frame/'+ frame.id; //change location hash
		else window.location.hash = 'newFrame';
		//open/close visual editor
		var el = $('#workspace');


		//show/hide editor panels
		// what should happen to panels which haven't been set?
		//right now they inherit the last frame's state
		
		
		var storage = localStorage.getObject( this.currentFrame.id );
		if( !_.isNull( storage ) && !_.isUndefined( storage.panelStates ) )
		{
			//go through each saved state
			_.each( storage.panelStates , function(closed, panel){
				var dom = $( '#' +panel+ '-view-bar' );
				var expander = $(dom).next('div');
				if( closed && expander.is(':visible') )
				{
					expander.hide('blind',{'direction':'vertical'});
					$(dom).find('.expander').removeClass('zicon-collapse').addClass('zicon-expand');
				}else if( !closed && expander.is(':hidden') ){
					expander.show('blind',{'direction':'vertical'});
					$(dom).find('.expander').addClass('zicon-collapse').removeClass('zicon-expand');
				}
			})
		}
		
		
		//update the auto advance tray
		//make sure the attribute exists
		var adv = false;
		if( !_.isNull(this.currentFrame.get('attr')) && !_.isNull( this.currentFrame.get('attr').advance ) )
			adv = this.currentFrame.get('attr').advance;
			
		var advanceControls = $('#advance-controls');

		if(adv > 0)
		{
			//after time in seconds
			advanceControls.find('input[id="time"]').prop('checked', true );
			advanceControls.find('input[id="manual"]').prop('checked', false );
			advanceControls.find('input[id="playback"]').prop('checked', false );
			$('#advance-time').val(adv);
		}else if( adv == -1 ){
			//manual

			advanceControls.find('input[id="time"]').prop('checked', false );
			advanceControls.find('input[id="manual"]').prop('checked', true );
			advanceControls.find('input[id="playback"]').prop('checked', false );

			$('#advance-time').val(10);
		
		//if the attr doesn't exist, then give it default values
		}else if( !adv ){
			advanceControls.find('input[id="time"]').prop('checked', false );
			advanceControls.find('input[id="manual"]').prop('checked', false );
			advanceControls.find('input[id="playback"]').prop('checked', true );
			$('#advance-time').val(10);
		}
		
		// add the frame's layers // remove falsy values
		var layerArray = _.compact( this.currentFrame.get('layers'));
		
		//call render on the entire collection. it should have the logic to draw what's needed
		Zeega.sequence.layerCollection.render( this.currentFrame );
		
		//add a new current frame style
		$('#frame-thumb-'+this.currentFrame.id).addClass('active-frame');
	},
	
	clearCurrentFrame : function ()
	{
		//remove a prexisiting frame style
		if(this.currentFrame) $('#frame-thumb-'+this.currentFrame.id).removeClass('active-frame');
		
		//clear out existing stuff in icon trays
		$('.icon-tray').empty();

		//clear the workspaces
		//$('#visual-editor-workspace').empty();
		//$('#layers-list-interaction').empty();
		
	},
	
	addFrame : function()
	{
		this.sequence.frames.add(new Frame);
	},
	
	addToLayerCollections : function(frame,layer)
	{

		//only add to the layers collection if it's not already there!
		if( !this.sequence.layerCollection.get(layer.id) )
		{
			console.log('not in collection');
			
			//this.sequence.layerCollection.add( layer );
			
			//Add to the collection do update stuff if it's the current layer (like show the item in the visual editor)
			if(frame == this.currentFrame)
			{
				console.log('layer should be added to the editor window')
				this.sequence.layerCollection.add( layer );
			}else{
				console.log('layer should not be drawn')
				//if it's not the current frame, then be quiet about it
				//this.sequence.layerCollection.add( layer , {silent:true} ); // do I need this??
				//we still need to add it to the type collection though
				this.sequence.layerCollection.add( layer, {silent:true} );
			 	this.sequence.layerCollection.addToLayerTypeCollection( layer, false );
			}
		}

	},
	
	addLayerToFrame : function( frame, layer )
	{

		//reject if there are too many layers inside the frame
		if( !frame.get('layers') || frame.get('layers').length < this.maxLayersPerFrame || this.maxLayersPerFrame == 0)
		{
			var _this = this;
			
			//add URL to layer model
			layer.url = Zeega.url_prefix + 'sequences/'+ Zeega.sequenceID +'/layers';
		
			//check to see if the layer is saved or not. save if ndeeded
			if( layer.isNew() )
			{
				console.log('this is a new layer');
				console.log(layer)
				layer.save(
					{},
					{
						success : function(savedLayer, response){
							console.log(response)
							savedLayer.url = _this.url_prefix + "layers/" + savedLayer.id
							_this.updateAndSaveFrameLayer(frame,savedLayer);
							_this.addToLayerCollections(frame, savedLayer);
							if( savedLayer.layerClass.thumbUpdate ) frame.noteChange() ;
						},
						error : function(model, error)
						{
							console.log(response);
						}
					});
				//save the new layer then prepend the layer id into the frame layers array
			}else{
				console.log('this is an old layer');
				//prepend the layer id into the frame layers array
				this.updateAndSaveFrameLayer(frame,layer);
				console.log(layer.layerClass.thumbUpdate)
				if( layer.layerClass.thumbUpdate ) frame.noteChange() ;
			}
		}
	},
	
	//frame arg is optional. Defaults to currentFrame if not set.
	createLayerFromItem : function( item, frame )
	{
		if( _.isUndefined(frame)) frame = this.currentFrame;
		var newLayer = new Layer({
			type: Zeega.draggedItem.get('layer_type'),
			attr: {
				'item_id' : item.id,
				'title' : item.get('title'),
				'url' : item.get('uri'),
				'uri' : item.get('uri'),
				'thumbnail_url' : item.get('thumbnail_url'),
				'attribution_url' : item.get('attribution_uri'),
				'citation':true,
			}
		});

		this.addLayerToFrame( frame, newLayer );
	},
	
	updateAndSaveFrameLayer : function(frame, layer)
	{
		console.log('updateAndSaveFrameLayer');
		var layerOrder = [parseInt(layer.id)];
		if( frame.get('layers') )
		{
			//if the layer array already exists eliminate false values if they exist
			layerOrder = _.compact( frame.get('layers') );
			//add the layer id to the layer order array
			layerOrder.push( parseInt( layer.id ) );
		}
		//set the layerOrder array inside the frame
		frame.set({'layers':layerOrder});
		frame.save();
	},
	
	removeLayerFromFrame : function( frame, layer )
	{
		//remove from frame.layer and save it back
		//remove icon from tray
		$('.'+layer.get("type").toLowerCase()+'-tray-icon').remove();
		
	
		//test to see if the layer is a persisting layer and destroy it from all frames if so
		//var sequenceAttributes = this.sequence.get('attr');
		
		if( _.include( this.sequence.get('attr').persistLayers , layer.id ) )
		{
			console.log('a persistent layer');
			
			
			this.removeLayerPersist(layer)
			_.each( _.toArray(this.sequence.frames), function(_frame){
				var layerOrder = _frame.get('layers');
				layerOrder = _.without(layerOrder, parseInt(layer.id) );
				if(layerOrder.length == 0) layerOrder = [false];
				_frame.set({'layers':layerOrder});
				_frame.save();
				_frame.updateThumb();
			});
			
			
		}else{
			console.log('NOT a persistent layer');
			
			var layerOrder = frame.get('layers');
			layerOrder = _.without(layerOrder, parseInt(layer.id) );
			//set array to false if empty  //weirdness
			if(layerOrder.length == 0) layerOrder = [false]; //can't save an empty array so I put false instead. use _.compact() to remove it later
			frame.set({'layers':layerOrder});
			frame.save();
			frame.updateThumb();
			
		}
		
		this.destroyOrphans();
		
	},
	
	destroyOrphans : function()
	{
		console.log('destroyOrphans');
		_this = this;
		// make a giant array of all the layer IDs in use by frames
		var layersInFrames = [];
		
		_.each( _.toArray(this.sequence.frames), function(frame){
			layersInFrames = _.union(frame.get('layers'), layersInFrames);
		});
		
		layersInFrames = _.compact(layersInFrames); //remove falsy values needed to save 'empty' arrays
				
		// make a giant array of all the layer IDs saved in the sequence
		var layersInSequence = [];
		_.each( _.toArray(this.sequence.layerCollection), function(layer){
			layersInSequence.push( parseInt(layer.id) );
		});

		var orphanIDs = _.difference(layersInSequence, layersInFrames);
		
		if(orphanIDs)
		{

			_.each(orphanIDs, function(orphanID){
				//removes and destroys the orphan
				var orphan = _this.sequence.layerCollection.get(orphanID);
				_this.removeLayerPersist(orphan);
			
				//remove from the layer collection
				_this.sequence.layerCollection.remove(orphan)
				
				orphan.destroy();
			})
		}else{
			return false;
		}
		
		
	},
	
	copyLayerToNextFrame : function(layer)
	{
		console.log('copy to next layer');
		var nextFrame = this.getRightFrame();
		if (nextFrame) this.addLayerToFrame(nextFrame,layer);
	},
	
	persistLayerOverFrames : function(layer)
	{
		console.log('peristing');
		//function(layer,[frames])
		//eventually you should pass in an array of frame IDs and only add to those frames
		//for now we persist to all frames EXCEPT the currentFrame

		_.each( _.toArray(this.sequence.frames), function(frame){
			if(frame != Zeega.currentFrame)
			{
				//test to see if it exists in any of the target frames. If so, DO NOT add
				var layerArray = _.toArray( frame.get('layers') );
				if( ! _.include(layerArray,layer.id) ) Zeega.addLayerToFrame(frame, layer);
			}
		});
		
		//add to the sequence persistLayers array
		var attr = this.sequence.get('attr');
		
		//if the array exists and the layer isn't already inside it
		if( attr.persistLayers && !_.include( _.toArray(attr.persistLayers),layer.id) )
		{
			attr.persistLayers.push(layer.id);
			attr.persistLayers = _.uniq(attr.persistLayers);
			console.log('new layer persisting')
			this.sequence.set({'attr': attr});
			this.sequence.save();
			
		//if the array doesn't exist
		}else{
			
			attr.persistLayers = [layer.id];
			this.sequence.set({'attr':attr});
			this.sequence.save();
		}
		
	},
	
	removeLayerPersist : function(layer)
	{
		console.log('remove persistance!');
		//removes layers from the sequence layerPersist array
		//does not affect existing layers or frames
		//future frames will not have the persisting layers
		var attr = this.sequence.get('attr');
		attr.persistLayers = _.without( attr.persistLayers, layer.id );
		this.sequence.set({'attr':attr});
		this.sequence.save();
		
		
	},
	
	updateLayerOrder : function(layerIDs)
	{
		console.log('updateLayerOrder');
		layerIDs = layerIDs.reverse();
		// updates z-index of divs in workspace
		_.each(layerIDs, function(id, i){ $('#layer-preview-'+ id ).css('z-index', i) });
		console.log(layerIDs)

		//update the layerOrder array 
		this.currentFrame.set({'layers':layerIDs})
		this.currentFrame.save();

		//update frame thumb
		this.currentFrame.updateThumb();

	},
	
	destroyFrame : function( view )
	{
		
		view.model.destroy();
		view.remove();
		this.loadLeftFrame();
		
		//remove from Sequence Order
		this.removeFromSequence( view.model );
		
		//if the sequence is empty(false), then make a new frame
		if( this.getSequenceOrder()[0] === false )
		{
			var newFrame = new Frame;
			Zeega.sequence.frameViewCollection.add(newFrame);
			Zeega.loadFrame( newFrame );
		}
		
		this.frameSort();
		this.destroyOrphans();
	},
	
	// returns the order that the frame appears in the sequence
	getFrameIndex : function( frame )
	{
		if( _.isNumber( frame ) ) frameId = frame;				//tests if it's a number id
		else if( _.isString( frame ) ) frameId = parseInt(frame);		//tests if it's a string id
		else if( _.isNumber( frame.id ) ) frameId = frame.id;	//assumes it must be a model
		else return false;

		return _.indexOf( this.sequence.get('framesOrder') , frameId );
	},
	
	getSequenceOrder : function(){ return this.sequence.get('framesOrder') },
	
	removeFromSequence : function( frame )
	{
		//test to see if it's actually in the sequence first
		if( this.getFrameIndex(frame) === false ) return false;
		else
		{
			var frameId;
			if( _.isNumber( frame ) ) frameId = frame;
			else if( _.isString( frame ) ) frameId = parseInt(frame);
			else if( _.isNumber( frame.id ) ) frameId = frame.id;
			else return false;
			
			var newOrder = _.without( this.sequence.get('framesOrder') , frameId );
			if( _.size(newOrder) == 0 ) newOrder.push(false);
			this.sequence.set({ framesOrder:newOrder });
			return frameId;
		}
		
	},
	
	
	duplicateFrame : function( view )
	{
		var dupeModel = new Frame({'duplicate_id':view.model.id,'thumb_url':view.model.get('thumb_url')});
		dupeModel.oldLayerIDs = view.model.get('layers');
		
		dupeModel.dupe = true;
		dupeModel.frameIndex = _.indexOf( this.sequence.get('framesOrder'), view.model.id );
		this.sequence.frames.add( dupeModel );
	},
		
	frameSort : function()
	{
		//turn the string IDs into integers to compare with model IDs
		var order = _.map( $('#frame-list').sortable('toArray'), function(num){ return parseInt( num.match( /[0-9 - ()+]+$/ )[0] ) })
		
		//var order = _.map( $('#frame-list').sortable('toArray'), function(str){ return parseInt(str) });
		this.sequence.set({'framesOrder': order});
		console.log(this.sequence.get('framesOrder'))
		this.sequence.save();
	},
	
	previewSequence : function()
	{
		this.previewMode = true;
		//remove branch viewer if present

		Player.init( this.exportProject(), this.sequence.id, this.currentFrame.id );
	
	},
	
	exportProject : function( string )
	{
		console.log('export');
		
		var order = _.map( this.sequence.get('framesOrder'), function(num){ return parseInt(num) });
		var sequences = [{
			'id' : this.sequence.id,
			'frameOrder' : order,
			'frames' : this.sequence.frames.toJSON(),
			'layers' : this.sequence.layerCollection.toJSON() //$.parseJSON( JSON.stringify(this.sequence.layers) )
		}];
		
		var project = {
			'id' : this.project.id,
			'title' : this.project.get('title'),
			'sequences' : sequences
		};
		
		var exportObject = { 'project' : project };
		
		console.log(exportObject)
		
		if(string) return JSON.stringify(exportObject);
		else return exportObject;
	},	
	
	getLeftFrame : function()
	{
		var frameOrder = this.sequence.get('framesOrder');
		var currentFrameIndex = _.indexOf( frameOrder,this.currentFrame.id );
		if( currentFrameIndex ) return this.sequence.frames.get( frameOrder[ currentFrameIndex-1 ] );
		else return this.sequence.frames.get( frameOrder[1] );
	},
	
	getRightFrame : function()
	{
		var currentFrameIndex = _.indexOf( this.sequence.get('framesOrder'), this.currentFrame.id );
		if(currentFrameIndex < _.size( this.sequence.frames )-1 ) return this.sequence.frames.at( currentFrameIndex + 1 );
		else return false;
	},
	
	loadLeftFrame : function()
	{
		console.log('loading left frame')
		var frame = this.getLeftFrame();
		if(frame) this.loadFrame(frame)
	},
	
	loadRightFrame : function()
	{
		var frame = this.getRightFrame();
		console.log(frame);
		
		if(frame) this.loadFrame(frame)
	},
	
	udpateAspectRatio : function( ratioID )
	{
		console.log('changeAspectRatio to: '+ ratioID)
		console.log(this.project)
		this.project.set({'attr':{'ratio':ratioID}});
		this.project.save();
	},
	
	initStartHelp : function()
	{
		if(localStorage.help != 'false' && this.helpCounter == 0)
		{
			//init the popovers
			$('#visual-editor-workspace').popover({
				trigger: manual,
				html:true,
				placement:'above',
				offset:'-250',
				template: '<div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="Zeega.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="Zeega.displayStartHelp();return false;">next</a></div></div>'
			});
			$('#database-panel').popover({
				trigger: manual,
				html:true,
				placement:'right',
				//offset:'-250',
				template: '<div class="arrow"></div><div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="Zeega.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="Zeega.displayStartHelp();return false;">next</a></div></div>'
			});
			$('#new-layer-tray').popover({
				trigger: manual,
				html:true,
				placement:'above',
				template: '<div class="arrow"></div><div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="Zeega.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="Zeega.displayStartHelp();return false;">next</a></div></div>'
			});
			$('#layer-panel').popover({
				trigger: manual,
				html:true,
				placement:'above',
				template: '<div class="arrow"></div><div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="Zeega.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="Zeega.displayStartHelp();return false;">next</a></div></div>'
			});
			$('#frame-drawer').popover({
				trigger: manual,
				html:true,
				placement:'below',
				template: '<div class="arrow"></div><div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="Zeega.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="Zeega.displayStartHelp();return false;">next</a></div></div>'
			});
			$('#preview').popover({
				trigger: manual,
				html:true,
				placement:'below',
				template: '<div class="arrow"></div><div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="Zeega.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="Zeega.displayStartHelp();return false;">next</a></div></div>'
			});

			this.displayStartHelp();
		}
	},
	
	displayStartHelp : function()
	{
		var _this = this;
		var helpOrderArray = [
			'visual-editor-workspace',
			'database-panel',
			'new-layer-tray',
			'layer-panel',
			'frame-drawer',
			'preview'
		];
		
	
		if(_this.helpCounter > 0 )
		{
			$('#'+helpOrderArray[_this.helpCounter-1]).popover('hide');
			$('#'+helpOrderArray[_this.helpCounter-1]).css('box-shadow', '');
		}
		if(_this.helpCounter >= helpOrderArray.length )
		{
			console.log('end of line')
			$('#'+helpOrderArray[_this.helpCounter-1]).css('box-shadow', '');
			this.turnOffHelp();
			return false;
		}
			
		$('#'+helpOrderArray[_this.helpCounter]).popover('show');
		$('#'+helpOrderArray[_this.helpCounter]).css('box-shadow', '0 0 18px orange');
	
		this.helpCounter++;
		
	},
	
	turnOffHelp : function()
	{
		console.log('turn off help windows')
		var helpOrderArray = [
			'visual-editor-workspace',
			'database-panel',
			'new-layer-tray',
			'layer-panel',
			'frame-drawer',
			'preview'
		];
		localStorage.help = false;

console.log( helpOrderArray[this.helpCounter-1] )

			$('#'+helpOrderArray[this.helpCounter-1]).popover('hide');
			$('#'+helpOrderArray[this.helpCounter-1]).css('box-shadow', '');
			this.helpCounter = 0;
		
	}
	
	
	
	
};