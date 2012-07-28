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
		this.itemCollection = new Items.Collection();
		
		// initializes project
		this.project = new Project.Model($.parseJSON(projectJSON).project);
		this.project.on('ready',function(){ _this.startEditor() })
		this.project.loadProject();
		
		this.setButtonStates()

		console.log("project data ", this.project);

	},
	
	loadCollectionsDropdown : function( collections )
	{
		_.each( collections, function( collection ){
			$('#database-collection-filter').append('<option value="'+ collection.id +'">'+ collection.title +'</option>')
		})
	},
	
	searchDatabase : function( search, reset ){console.log('searchdatabase:',search,reset); this.itemCollection.search(search,reset) },
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
				""						: 'nullLoad',
				"editor/sequence/:sequenceID/frame/:frameID"	: "goToSequenceFrame",
				"player/sequence/:sequenceID/frame/:frameID"	: "checkPlayer"
			},
			
			nullLoad : function()
			{
				_this.goToSequence( _this.project.sequences.at(0).id )
				_this.goToFrame( _this.project.sequences.at(0).get('frames')[0] );
			},
			
			goToSequenceFrame : function( sequenceID,frameID )
			{
				_this.goToSequence( sequenceID );
				_this.goToFrame( frameID );
			},
			
			checkPlayer : function( sequenceID,frameID )
			{
				console.log('zeega check player router')
				if( !_this.previewMode ) this.goToSequenceFrame(sequenceID,frameID);
				else _this.player.goToSequenceFrame(sequenceID,frameID);
			}
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
		
		this.renderSequenceFrames();
		
		var nextFrame = frameID ? this.project.frames.get(frameID) : this.project.frames.get( this.currentSequence.get('frames')[0] );
		this.loadFrame(nextFrame);
	},
	
	goToFrame : function( frameId )
	{
		if( _.isUndefined(frameId)||frameId=="undefined" )
		{
			this.currentFrame = this.project.frames.get( this.currentSequence.get('frames')[0] );
			this.loadFrame( this.currentFrame );
		}
		else this.loadFrame( this.project.frames.get( frameId ) );
	},

	loadFrame : function( frame )
	{
		var _this = this;
		this.unrenderFrame( this.currentFrame );
		
		if(this.currentFrame) this.currentFrame.trigger('blur');
		this.currentFrame = frame;

		this.currentFrame.trigger('focus');
		this.renderFrame( this.currentFrame );
		
		this.router.navigate('editor/sequence/'+ this.currentSequence.id +'/frame/'+ frame.id, {silent:true});

		this.restorePanelStates();
		this.setAdvanceValues();

	},
	
	renderSequenceFrames : function()
	{
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
			var layerIndex = 0;
			var _this = this;
			_.each( _.compact( frame.get('layers') ), function(layerID, i){
				var layerModel = _this.project.layers.get(layerID);

				layerModel.layerIndex = layerIndex;
				layerIndex++;
				
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
				var _this = this;

				console.log('make new sequence')
				this.hold = this.addLayer({
					type : 'Link',
					options : {
						from_sequence : this.currentSequence.id,
						from_frame : this.currentFrame.id
					}
				});
				console.log(this.hold)
				$('#connection-confirm').show();
				$('#make-connection button').addClass('disabled');
				this.busy = true;
				break;
			
			case 'existingFrame':
				console.log('link to existing')
				var Modal = zeega.module('modal');
				var linkModal = new Modal.Views.LinkExisting();
				$('body').append(linkModal.render().el);
				linkModal.show();
			
				break;
			case 'advanced':
				console.log('link with advanced options!');
				var Modal = zeega.module('modal');
				var advancedModal = new Modal.Views.LinkAdvanced();
				console.log(advancedModal)
				$('body').append(advancedModal.render().el);
				advancedModal.show();
				break;
		}
	},
	
	connectToSequenceFrame : function( sequenceID, frameID )
	{
		console.log('connectToSequenceFrame ' + sequenceID +' '+ frameID)
		this.busy = false;
		this.addLayer({
			type : 'Link',
			options : {
				from_sequence : this.currentSequence.id,
				from_frame : this.currentFrame.id,
				to_sequence : sequenceID,
				to_frame : frameID
			}
		});
		console.log(this)

	},
	
	connectToAdvanced : function( layerArray )
	{
		var _this = this;
		
		var hold = this.addLayer({
			type : 'Link',
			options : {
				from_sequence : this.currentSequence.id,
				from_frame : this.currentFrame.id
			}
		});
		
		hold.on('layer_saved', function(){
			hold.off('layer_saved');
			var layersToPersist = _.union( layerArray, [hold.id] );

			var Sequence = zeega.module("sequence");
			var sequence = new Sequence.Model({ 'frame_id' : _this.currentFrame.id, 'layers_to_persist' : layersToPersist });

			sequence.save({},{
				success : function()
				{
					hold.setToFrame( sequence.id, sequence.get('frames')[0].id );
					hold.visual.render();
					_this.project.frames.add(sequence.get('frames'));
					sequence.set('frames', [ sequence.get('frames')[0].id ]);
					sequence.trigger('sync');
					_this.goToSequence(sequence.id);
					_this.busy = false;
				}
			});
			_this.project.sequences.add(sequence);
		})
	},
	
	confirmConnection : function(action)
	{
		console.log('confirm connection: '+ action)
		if(action == 'ok')
		{
			var _this = this;
			console.log('create and go to new sequence')
			
			var layersToPersist = [this.hold.id];
			
			var Sequence = zeega.module("sequence");
			var sequence = new Sequence.Model({ 'frame_id' : this.currentFrame.id, 'layers_to_persist' : layersToPersist });

			sequence.save({},{
				success : function()
				{
					console.log('sequence saved')
					console.log(sequence)
					_this.busy = false;
					_this.hold.setToFrame( sequence.id, sequence.get('frames')[0].id );
					_this.hold.visual.render();
					_this.project.frames.add(sequence.get('frames'));
					sequence.set('frames', [ sequence.get('frames')[0].id ]);
					//sequence.createCollections();
					sequence.trigger('sync');
					_this.goToSequence(sequence.id);
					
					this.hold = null;
					this.busy = false;
				}
			});
			this.project.sequences.add(sequence);

		}
		else
		{
			this.hold.trigger('editor_removeLayerFromFrame', this.hold);
			this.hold.destroy();
			this.hold = null;
			this.busy = false;
		}

	},
	
	deleteSequence : function(sequenceID)
	{
		var _this = this;
		var sequence = this.project.sequences.get(sequenceID);

		if(this.currentSequence.id == sequenceID) this.router.navigate('',{trigger:true});

		var layers = [];
		_.each( sequence.get('frames'), function(frameID){
			var frame = _this.project.frames.get(frameID);
			layers = _.union(layers,frame.get('layers'));
		});
		_.each(layers, function(layerID){
			var layer = _this.project.layers.get(layerID);
			if(layer.get('type')=='Link')
			{
				var attr = layer.get('attr');
				if( attr.from_sequence == sequenceID || attr.to_sequence == sequenceID )
					layer.destroy();
			}
		});
		sequence.destroy();
		// if sequence is in view, then load the first sequence
		
		return false;
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
						
						_this.currentSequence.get('frames').push(newFrame.id);
						
					}
				});
			
			}
		}
	},
	
	updateFrameOrder : function( save )
	{
		console.log('	UPDATE FRAME ORDER')
		this.currentSequence.updateFrameOrder();
	},
	
	duplicateFrame : function( frameModel )
	{
		//if(!this.busy) this.project.duplicateFrame( frameModel );
		if(!this.busy)
		{
			console.log('	DUPLICATE FRAME')
			console.log(frameModel)
			var _this = this;
			var dupeModel = frameModel.clone();
			
			console.log(''+ frameModel.get('layers'))
			//remove link layers because it doesn't make sense to dupe those
			var layersToDupe = [];
			_.each( frameModel.get('layers'), function(layerID){
				if(zeega.app.project.layers.get(layerID).get('type') != 'Link') layersToDupe.push( layerID);
			})
			console.log(layersToDupe)
			dupeModel.set({
				'layers' : layersToDupe,
				'duplicate_id' : parseInt(frameModel.id),
				'id' : null
			})
			
			dupeModel.oldLayerIDs = frameModel.get('layers');
			dupeModel.frameIndex = _.indexOf( this.currentSequence.get('frames'), frameModel.id );
			dupeModel.dupe = true;
			
			dupeModel.save({},{
				success : function( savedFrame )
				{
					console.log('frame saved and is a duplicate')
					console.log(savedFrame)
					_this.currentSequence.insertFrameView( savedFrame , dupeModel.frameIndex );
				
					//zeega.app.currentSequence.get('frames');
				
					//clone layers and place them into the layer array
					_.each( savedFrame.oldLayerIDs , function(layerID, i){

						//if layer is persistent
						//replace frameIndex the id with the persistent id
						var persistLayers = _this.currentSequence.get('attr').persistLayers;
						if( _.include( persistLayers, parseInt(layerID) ) )
						{
							var layerOrder = savedFrame.get('layers');
							layerOrder[i] = String(layerID);
							savedFrame.set({layers:layerOrder})
						}
						else
						{
							_this.project.layers.duplicateLayer( layerID, savedFrame.get('layers')[i] );
						}
					})
					//resave the frame after being updated with persistent frame ids
				}
			});
			
			this.project.frames.add( dupeModel );
			
		} //busy
	},
	
	addLayer : function( args )
	{
		if(!this.busy)
		{
			console.log('ADD LAYER')
			var _this = this;
			args = _.defaults( args, { frame : _this.currentFrame, options : {}, show : function(){ return (_this.currentFrame.id == args.frame.id)? true : false } } );
			console.log('show layer? '+ args.show() )
			//args.frame.trigger('update_thumb');
			console.log(args)
			return this.project.layers.addNewLayer( args )
		}
	},
	
	continueLayer : function(layerID)
	{
		console.log('continue layer: '+layerID);
		var Modal = zeega.module('modal');
		var linkModal = new Modal.Views.ContinueLayer({ model:this.project.layers.get(layerID)});
		$('body').append(linkModal.render().el);
		linkModal.show();
	},
	
	continueLayerToNextFrame : function( layerID )
	{
		if(!this.busy)
		{
			var nextFrame = this.getRightFrame();
			if( nextFrame != false && nextFrame != this.currentFrame )
			{
				var layers = [];
				if(nextFrame.get('layers'))
				{
					var l = _.compact(nextFrame.get('layers'));
					l.unshift( parseInt(layerID) );
					layers = l;
				}
				else layers = [ parseInt(layerID) ];
				nextFrame.save({ layers : layers });
			}
		}
	},
	
	continueOnAllFrames : function( layerID )
	{
		if(!this.busy)
		{
			var layerModel = this.project.layers.get(layerID)
			//get persistent layers
			var attr = _.isObject(this.currentSequence.get('attr')) ? this.currentSequence.get('attr') : {persistLayers:[]} ;

			// check to see if the layer is already persistent
			if( _.include(attr.persistLayers, layerID ) )
			{
				//remove persistence
				console.log('remove persistence')
				attr.persistLayers = _.without( attr.persistLayers, layerID );
				if(attr.persistLayers.length == 0 ) attr.persistLayers = [false];
				this.removePersistenceFromFrames( layerID );
			}
			else
			{
				console.log('add persistence')
				//add persistence
				attr.persistLayers.unshift( layerID );
				this.addPersistenceToFrames( layerID );
			}
			this.currentSequence.save({ 'attr': attr });
			console.log('save current sequence', attr, this.currentSequence)
		} // busy
		
	},
	
	addPersistenceToFrames : function( layerID )
	{
		var _this = this;
		// add this layer to each frame in the sequence
		_.each( this.currentSequence.get('frames'), function(frameID){
			var frame = _this.project.frames.get( frameID );
			var layerArray = frame.get('layers') || [];
			layerArray.push(layerID)
			frame.save({ layers : _.compact(_.uniq(layerArray)) })
		})
	},
	removePersistenceFromFrames : function( layerID )
	{
		var _this = this;
		// add this layer to each frame in the sequence
		_.each( this.currentSequence.get('frames') , function(frameID){
			var frame = _this.project.frames.get( frameID );
			if( _.include(frame.get('layers'), layerID ) && frameID != _this.currentFrame.id )
			{
				//remove from frame
				var layers = _.without( frame.get('layers'), layerID );
				if( layers.length == 0 ) layers = [false];
				frame.save({ layers : layers });
			}
		})
	},
	
	updateLayerOrder : function( frame )
	{
		console.log('updateLayerOrder')
		var frame = frame || this.currentFrame;
		var linkOrder = _.map( $('#links-list>li'), function(layer){ return $(layer).data('id') });
		var layerOrder = _.map( $('#layers-list-visual>li'), function(layer){ return $(layer).data('id') });
		var order = linkOrder.concat(layerOrder).reverse();
		
		// updates z-index of divs in workspace
		_.each( order , function(id, i){ $('#layer-visual-'+id).css('z-index', i) });

		frame.save({'layers': _.compact(order) })
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
		var _this = this;
		this.previewMode = true;
		this.exportProject();
		this.unrenderFrame( this.currentFrame );
		this.player = new Player2($('body'));
		this.player.loadProject(this.exportProject(), {sequenceID: parseInt(this.currentSequence.id), frameID : parseInt(this.currentFrame.id) } );
		console.log('update background color')
		$('body').css({'background':'#000'});
	},
	
	restoreFromPreview : function()
	{
		this.previewMode = false;
		$('body').css({'background':'#333'});
		this.renderFrame( this.currentFrame );
	},

	exportProject : function( string )
	{
		console.log('-- EXPORT --');
		
		var projectObject = this.project.toJSON();

		//eliminate falsy values from the frames.layers array
		var f = this.project.frames.toJSON();
		_.each( f, function(frame){ frame.layers = _.compact(frame.layers) })
		
		var sfl = {
			sequences : this.project.sequences.toJSON(),
			frames : f,
			layers : this.project.layers.toJSON()
		}
		
		_.extend(projectObject,sfl);
		
		console.log(projectObject);

		if(string) return JSON.stringify(projectObject);
		else return projectObject;
	},	

	getLeftFrame : function()
	{
		var currentFrameIndex = _.indexOf( this.currentSequence.get('frames'), parseInt(this.currentFrame.id) );
		return this.frames.get( frameOrder[ currentFrameIndex-1 ] ) || this.frames.get( frameOrder[1] );
	},

	getRightFrame : function()
	{
		var currentFrameIndex = _.indexOf( this.currentSequence.get('frames'), this.currentFrame.id );
		return this.project.frames.get( this.currentSequence.get('frames')[currentFrameIndex+1] ) || false;
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
			$('#sequence-cover-image').css('background-image' , 'url("'+ obj.item.get('uri') +'")' );
			this.project.save({'cover_image':obj.item.get('uri')})
		}
	},
	
	shareProject : function()
	{
		if(this.project.get("published"))
		{
			// publishing view for project //
			var Modal = zeega.module('modal');
			this.view = new Modal.Views.ShareProject({ model:this.project });
			this.view.render();
		}
	},

	publishProject : function()
	{
		if(this.project.get("published"))
		{
			this.project.save();
		}else{
			// publishing view for project //
			var Modal = zeega.module('modal');
			this.view = new Modal.Views.PublishProject({ model:this.project });
			this.view.render();
		}
		zeega.app.setButtonStates();
	},
	
	setButtonStates : function()
	{
		console.log("setButtonStates", this.project)
		console.log("setButtonStates", this.project.get("published"))

		// Publish button
		if(this.project.get("published"))
		{
			$('#publish-project').html("<i class='zicon-publish raise-up'></i> Publish Update");
			$('#share-project').css("color", "#fff");
		}else{
			$('#publish-project').html("<i class='zicon-publish raise-up'></i> Publish");
			$('#share-project').css("color", "#666");
		}
	}

	
}, Backbone.Events)


};
