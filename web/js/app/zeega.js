// This contains the module definition factory function, application state,
// events, and the router.
this.zeega = {
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
	
	busy : false,
	hold : null,
	
	//sequenceID : 1,
	currentFrame : null,
	thumbnailUpdates : true,
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
		this.url_prefix = sessionStorage.getItem('hostname') + sessionStorage.getItem('directory');

		this.loadModules();
		this.isLoaded = true
		//this.initStartHelp(); //broken. fix!
	},
	
	loadModules : function()
	{
		var _this = this;
		var Project = zeega.module("project");
		var Items = zeega.module("items");
		
		console.log($.parseJSON(projectJSON))
		
		this.loadCollectionsDropdown( $.parseJSON(collectionsJSON) );
		this.itemCollection = new Items.ViewCollection();
		
		// initializes project
		this.project = new Project.Model($.parseJSON(projectJSON).project);
		this.project.on('ready',function(){ _this.startEditor() })
		this.project.loadProject();
		
		console.log(this.project)
	},
	
	loadCollectionsDropdown : function( collections )
	{
		_.each( collections, function( collection ){
			$('#database-collection-filter').append('<option value="'+ collection.id +'">'+ collection.title +'</option>')
		})
	},
	
	searchDatabase : function( search, reset ){ this.itemCollection.search(search,reset) },
	refreshDatabase : function(){ this.itemCollection.refresh() },

	startEditor : function()
	{
		console.log('editor started')
		
		this.renderSequenceFrames();
		this.startRouter();
	},
	
	startRouter: function()
	{
		var _this = this;
		var Router = Backbone.Router.extend({
			routes: {
				""						: 'goToFrame',
				"editor/frame/:frameID"	: "goToFrame",
				"player/frame/:frameID"	: "checkPlayer"
			},
			goToFrame : function( frameID ){ _this.goToFrame( frameID ) },
			
			checkPlayer : function( frameID ){ if( !_this.previewMode ) _this.goToFrame( frameID ) }
		});

		this.router = new Router();
		Backbone.history.start();
	},
	
	goToSequence : function(sequenceID, frameID)
	{
		this.unrenderFrame(this.currentFrame);
		this.currentSequence.trigger('blur');
		this.currentSequence = this.project.sequences.get(sequenceID);
		this.currentSequence.trigger('focus');
		
		console.log('current sequence')
		console.log(this.currentSequence )
		this.renderSequenceFrames();
		
		var nextFrame = frameID ? this.project.frames.get(frameID) : this.project.frames.get( this.currentSequence.get('frames')[0] );
		console.log('next frame')
		console.log(nextFrame)
		this.loadFrame(nextFrame);
		
		console.log('current sequence id: '+ this.currentSequence.id +' currentFrame: '+this.currentFrame.id)
	},
	
	goToFrame : function( frameId )
	{
		console.log('GO TO FRAME: '+frameId)
		if( _.isUndefined(frameId)||frameId=="undefined" )
		{
			this.currentFrame = this.project.frames.get( this.currentSequence.get('frames')[0] );
			this.loadFrame( this.currentFrame );
		}
		else this.loadFrame( this.project.frames.get( frameId ) );
	},

	loadFrame : function( frame )
	{
		console.log('load frame')
		console.log(frame)
		var _this = this;
		this.unrenderFrame( this.currentFrame );
		
		if(this.currentFrame) this.currentFrame.trigger('blur');
		this.currentFrame = frame;

		this.currentFrame.trigger('focus');
		this.renderFrame( this.currentFrame );
		
		this.router.navigate('editor/frame/'+ frame.id, {silent:true});

		this.restorePanelStates();
		this.setAdvanceValues();

	},
	
	renderSequenceFrames : function()
	{
		console.log('render sequence frames!!!')
		var _this = this;
		//this is ugly
		$('#frame-list').empty();
		_.each( this.currentSequence.get('frames'), function(frameID){
			_this.project.frames.get(frameID).render();
		})
		//this.currentSequence.updateFrameOrder(false);
	},
	
	renderFrame : function(frame)
	{
		if(frame)
		{
			console.log('render frame id: '+ frame.id)
			var _this = this;
			_.each( _.compact( frame.get('layers') ), function(layerID, i){
				console.log('RENDER layer id: '+ layerID)
				var layerModel = _this.project.layers.get(layerID);
				console.log(layerModel)
				if(_.isUndefined(layerModel)) console.log('layer missing')
				else layerModel.trigger('editor_layerRender', i)
			})
		}
	},
	
	unrenderFrame : function ( frame )
	{
		if(frame)
		{
			var _this = this;
			_.each( frame.get('layers'), function(layerID){
				var layerModel = _this.project.layers.get(layerID);
				if(_.isUndefined(layerModel)) console.log('layer missing')
				else
				{
					if(layerModel.visual) layerModel.visual.remove();
					if(layerModel.controls) layerModel.controls.remove();
					layerModel.trigger('editor_layerExit');
//					layerModel.trigger('editor_layerUnrender');
				}
			})
		}
	},

	restorePanelStates : function()
	{
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
	},
	
	
	makeConnection : function(action)
	{
		console.log('make connection: '+ action)
		switch(action)
		{
			case 'newFrame':
				this.hold = this.addLayer( { type : 'Link' } );
				
				break;
			case 'existingFrame':
			
				break;
			case 'advanced':
				
				break;
		}
		this.busy = true;
	},
	
	confirmConnection : function(action)
	{
		console.log('confirm connection: '+ action)
		if(action == 'ok')
		{
			var _this = this;
			console.log('create and go to new sequence')
			var Sequence = zeega.module("sequence");
			var sequence = new Sequence.Model({ 'frame_id' : this.currentFrame.id });

			sequence.save({},{
				success : function()
				{
					sequence.createCollections();
					sequence.trigger('sync');
					_this.goToSequence(sequence.id);
				}
			});
			this.project.sequences.add(sequence);
		}
		else
		{
			this.hold.trigger('editor_removeLayerFromFrame', this.hold);
			this.hold.destroy();
		}
		this.hold = null;
		this.busy = false;
	},
	
	setAdvanceValues : function()
	{
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
			$('#advance-time').val(adv/1000);
		}
		else if( adv == -1 )
		{
			//manual

			advanceControls.find('input[id="time"]').prop('checked', false );
			advanceControls.find('input[id="manual"]').prop('checked', true );
			advanceControls.find('input[id="playback"]').prop('checked', false );

			$('#advance-time').val(10);

		//if the attr doesn't exist, then give it default values
		}
		else if( !adv )
		{
			advanceControls.find('input[id="time"]').prop('checked', false );
			advanceControls.find('input[id="manual"]').prop('checked', false );
			advanceControls.find('input[id="playback"]').prop('checked', true );
			$('#advance-time').val(10);
		}
	},

	addFrame : function( num )
	{
		if( !this.busy )
		{
			var _this = this
			var n = num || 1;
			var Frame = zeega.module('frame');
		
			for( var i = 0 ; i < n ; i++ )
			{
				var layers = _.compact( this.currentSequence.get('attr').persistLayers ) || [];
				console.log('new frame!!!')
				console.log( this.currentSequence.get('attr').persistLayers )
				console.log(layers)
			
				var newFrame = new Frame.Model();
				newFrame.set({'layers' : layers},{'silent':true});
				console.log(newFrame)
			
				newFrame.save({},{
					success : function()
					{
						console.log(newFrame)
						newFrame.render();
					
						newFrame.trigger('refresh_view');
						//_this.currentSequence.trigger('updateFrameOrder');
						newFrame.trigger('updateThumb');
						_this.project.frames.add( newFrame );
						_this.loadFrame( newFrame );
					}
				});
			
			}
		}
	},
	
	duplicateFrame : function( frameModel )
	{
		if(!this.busy) this.currentSequence.duplicateFrame( frameModel )
	},
	
	addLayer : function( args )
	{
		if(!this.busy)
		{
			console.log('ADD LAYER')

			var _this = this;
			args = _.defaults( args, { frame : _this.currentFrame, show : function(){ return (_this.currentFrame.id == args.frame.id)? true : false } } );
			console.log('show layer? '+ args.show() )

			console.log(args)
			return this.project.layers.addNewLayer( args )
		}
	},
	
	continueLayerToNextFrame : function( layerID )
	{
		if(!this.busy)
		{
			console.log( 'copy layer to next frame!: '+ layerID );
			console.log(parseInt(layerID))
			var nextFrame = this.getRightFrame();
		
			if( nextFrame != this.currentFrame )
			{
				if(nextFrame.get('layers')) nextFrame.get('layers').push(parseInt(layerID));
				else nextFrame.set('layers',[parseInt(layerID)],{silent:true});
				nextFrame.save();
			}
		}
	},
	
	continueOnAllFrames : function( layerModel )
	{
		if(!this.busy)
		{
			console.log('zeega continue on all');
		
			var layerID = parseInt(layerModel.id);
			//get persistent layers
			var persistentLayers = this.currentSequence.get('attr').persistLayers;
			// if they do not exist
			if( _.isUndefined(persistentLayers) )
			{
				persistentLayers = [ layerID ];
				this.addPersistenceToFrames( layerID );
			}
			else
			{
				//check to see if it's already in there
				if( _.include(persistentLayers, layerID ) )
				{
					//remove persistence
					persistentLayers = _.without( layerID );
					if(persistentLayers.length == 0 ) persistentLayers = [false];
					this.removePersistenceFromFrames( layerID );
				}
				else
				{
					//add persistence
					persistentLayers.push( layerID );
					this.addPersistenceToFrames( layerID );
				}
			}
		
			var attr = this.currentSequence.get('attr') || {};
			_.extend( attr , { persistLayers : _.compact(persistentLayers) });
		
			this.currentSequence.set({ 'attr': attr });
			this.currentSequence.save();
		}
		
	},
	
	addPersistenceToFrames : function( layerID )
	{
		// add this layer to each frame in the sequence
		_.each( _.toArray( this.currentSequence.frames ), function(frame){
			if( !_.include(frame.get('layers'), layerID ) )
			{
				//add to frame
				var layers = frame.get('layers') || [];
				//var layers = [];
				layers.push( layerID );
				layers = _.compact( layers );
				//frame.set();
				frame.save({ 'layers' : layers });
			}
			
		})
	},
	removePersistenceFromFrames : function( layerID )
	{
		var _this = this;
		// add this layer to each frame in the sequence
		_.each( _.toArray( this.currentSequence.frames ), function(frame){
			if( _.include(frame.get('layers'), layerID ) && frame != _this.currentFrame )
			{
				//remove from frame
				var layers = _.without( frame.get('layers'), layerID );
				if( layers.length == 0 ) layers = [false];
				frame.set({ 'layers' : layers });
			}
			
		})
	},
	
	
	updateLayerOrder : function( layerIDArray, frame )
	{
		var frameToUpdate = frame || this.currentFrame;
		layerIDs = layerIDArray.reverse();
		// updates z-index of divs in workspace
		_.each(layerIDs, function(id, i){ $('#layer-visual-'+id).css('z-index', i) });
		frameToUpdate.set({'layers':layerIDs})
	},

	// returns the order that the frame appears in the sequence
	getFrameIndex : function( frame )
	{
		if( _.isNumber( frame ) ) frameId = frame;	//tests if it's a number id
		else if( _.isString( frame ) ) frameId = parseInt(frame);		//tests if it's a string id
		else if( _.isNumber( frame.id ) ) frameId = frame.id;	//assumes it must be a model
		else return false;

		return _.indexOf( this.sequence.get('framesOrder') , frameId );
	},

	previewSequence : function()
	{
		console.log('preview the sequence')
		this.previewMode = true;
		//remove branch viewer if present

		this.exportProject();

		/*
		this.cleanWorkspace();

		this.player = new Player2($('body'));
		
		this.player.loadProject(this.exportProject(), {sequenceID: parseInt(this.currentSequence.id), frameID : parseInt(this.currentFrame.id) } )
		*/
	},
	
	restoreFromPreview : function()
	{
		this.previewMode = false;
		this.renderFrame( this.currentFrame );
	},

	exportProject : function( string )
	{
		console.log('-- EXPORT --');

		console.log( this.project.toJSON() )
		
		var projectObject = this.project.toJSON();
		var framesObject = {frames:this.project.frames.toJSON()};
		var layersObject = {layers:this.project.layers.toJSON()};
		
		console.log(projectObject);
		console.log(framesObject);
		console.log(layersObject);
		
		_.extend(projectObject,framesObject,layersObject);
		console.log(projectObject);
		
/*
		var order = _.map( this.currentSequence.get('framesOrder'), function(num){ return parseInt(num) });
		
		var frames = this.currentSequence.frames.toJSON();
		_.each( frames, function(frame){ frame.layers = _.compact(frame.layers) })
		
		var layers = this.currentSequence.layers.toJSON();
		_.each(layers, function(layer){ layer.id = parseInt(layer.id) });
		
		var sequences = [{
			'id' : parseInt( this.currentSequence.id ),
			'frameOrder' : order,
			'frames' : frames,
			'layers' : layers //$.parseJSON( JSON.stringify(this.sequence.layers) )
		}];

		var project = {
			'id' : parseInt(this.project.id),
			'title' : this.project.get('title'),
			'sequences' : sequences
		};

		var exportObject = { 'project' : project };
		console.log(exportObject)

		if(string) return JSON.stringify(exportObject);
		else return exportObject;
		
*/
	},	

	getLeftFrame : function()
	{
		var frameOrder = this.currentSequence.get('framesOrder') || this.currentSequence.frames.pluck('id');
		
		console.log('getLeft frame ----')
		console.log(this.currentSequence)
		console.log(frameOrder)
		
		var currentFrameIndex = _.indexOf( frameOrder, parseInt(this.currentFrame.id) );
		if( currentFrameIndex ) return this.currentSequence.frames.get( frameOrder[ currentFrameIndex-1 ] );
		else return this.currentSequence.frames.get( frameOrder[1] );
	},

	getRightFrame : function()
	{
		var currentFrameIndex = _.indexOf( this.currentSequence.get('framesOrder'), this.currentFrame.id );
		if(currentFrameIndex < _.size( this.currentSequence.frames )-1 ) return this.currentSequence.frames.at( currentFrameIndex + 1 );
		else return false;
	},

	loadLeftFrame : function()
	{
		console.log('load left ----')
		console.log( this.getLeftFrame() )
		this.loadFrame( this.getLeftFrame() )
	},
	
	loadRightFrame : function(){ this.loadFrame( this.getRightFrame() ) },

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
				trigger: 'manual',
				//html:true,
				//placement:'above',
				//offset:'-250',
				//content : 'tester'
				//template: '<div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="zeega.app.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="zeega.app.displayStartHelp();return false;">next</a></div></div>'
			});
			
			/*
			$('#database-panel').popover({
				trigger: 'manual',
				html:true,
				placement:'right',
				//offset:'-250',
				template: '<div class="arrow"></div><div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="zeega.app.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="zeega.app.displayStartHelp();return false;">next</a></div></div>'
			});
			$('#new-layer-tray').popover({
				trigger: 'manual',
				html:true,
				placement:'above',
				template: '<div class="arrow"></div><div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="zeega.app.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="zeega.app.displayStartHelp();return false;">next</a></div></div>'
			});
			$('#layer-panel').popover({
				trigger: 'manual',
				html:true,
				placement:'above',
				template: '<div class="arrow"></div><div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="zeega.app.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="zeega.app.displayStartHelp();return false;">next</a></div></div>'
			});
			$('#frame-drawer').popover({
				trigger: 'manual',
				html:true,
				placement:'below',
				template: '<div class="arrow"></div><div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="zeega.app.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="zeega.app.displayStartHelp();return false;">next</a></div></div>'
			});
			$('#preview').popover({
				trigger: 'manual',
				html:true,
				placement:'below',
				template: '<div class="arrow"></div><div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="zeega.app.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="zeega.app.displayStartHelp();return false;">next</a></div></div>'
			});
*/
			this.displayStartHelp();
		}
		
	},

	displayStartHelp : function()
	{
		var _this = this;
		var helpOrderArray = [
			'visual-editor-workspace',
			/*
			'database-panel',
			'new-layer-tray',
			'layer-panel',
			'frame-drawer',
			'preview'
			*/
		];
		
		console.log('	HELPPPPPPP')
		console.log(helpOrderArray[0]);
		console.log(this.helpCounter)
		console.log( $('#'+helpOrderArray[_this.helpCounter]) )

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

	},
	
	editCoverImage : function(obj)
	{
		if(obj.item.get('layer_type') == 'Image')
		{
			console.log(obj)
			console.log( 'we can make something out of this' )
			$('#sequence-cover-image').css('background-image' , 'url("'+ obj.item.get('uri') +'")' );
			console.log(this)
			this.project.update({'cover_image':obj.item.get('uri')})
			
		}
	}

	
	
	
}, Backbone.Events)


};
