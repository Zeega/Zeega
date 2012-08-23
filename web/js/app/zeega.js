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
	

	currentFrame : null,
	currentSequence : null,

	busy : false,
	hold : null,
	
	//sequenceID : 1,
	currentFrame : null,
	thumbnailUpdates : true,
	previewMode:false,
	
	updated:false,
	
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
		
		this.itemCollection = new Items.Collection();
		
		// initializes project
		this.project = new Project.Model($.parseJSON(projectJSON).project);
		this.project.completeCollections();

		this.project.loadProject();
		
		this.setButtonStates();
		this.setProjectListeners();
		console.log("project data ", this.project);

		this.startEditor();
	},
	
	// listens to things saving to update the button states
	setProjectListeners : function()
	{
		var _this = this;
		this.project.on('sync',function(){console.log('project_sync');zeega.app.updated=true;_this.setButtonStates()});
		this.project.layers.on('sync',function(){console.log('layer_sync');zeega.app.updated=true;_this.setButtonStates()});
		this.project.sequences.on('sync',function(){console.log('sequence_sync');zeega.app.updated=true;_this.setButtonStates()});
		this.project.frames.on('sync',function(){console.log('frame_sync');zeega.app.updated=true;_this.setButtonStates()});
	
	},
	
	startEditor : function()
	{
		console.log('editor started')
		//always start the editor at sequence 0, frame 0
		var startFrameID = this.project.sequences.at(0).get('frames')[0];
		this.goToFrame(startFrameID);
	},

	goToFrame : function( f )
	{
		if( _.isNumber(f) ) var frame = this.project.frames.get(f);
		else var frame = f;

		console.log('$$		go to frame', frame)

		// if the frame's sequence isn't rendered, then render it
		if( _.isNull(this.currentSequence) || this.currentSequence.id != frame.sequenceID )
		{
			var sequence = this.project.sequences.get( frame.sequenceID )
			sequence.renderSequenceFrames();
			this.currentSequence = sequence;
		}

		// render the frame workspace
		if( _.isNull(this.currentFrame) || this.currentFrame != frame )
		{
			this.loadFrame( frame );
			this.currentFrame = frame;
		}

	},
	
	goToSequence : function(sequenceID, frameID)
	{
		// go to the first frame in the sequence
		var frame = frameID || this.project.sequences.get(sequenceID).get('frames')[0];
		this.currentSequence.trigger('blur');
		this.goToFrame( frame );
		this.currentSequence.trigger('focus');
	},

	loadFrame : function( frame )
	{
		//make sure we're not trying to load the same frame again!
		if( !this.currentFrame || this.currentFrame.id != frame.id )
		{
			var _this = this;
		
			if(this.currentFrame)
			{
				this.currentFrame.removeWorkspace();
				this.currentFrame.trigger('blur');
			}
			frame.renderWorkspace();
			frame.trigger('focus');
			this.currentFrame = frame;
		}

	},

	searchDatabase : function( search, reset ){console.log('searchdatabase:',search,reset); this.itemCollection.search(search,reset) },
	refreshDatabase : function(){ this.itemCollection.refresh() },
	
	returnToFrame : function()
	{
		console.log('~~		return to frame', this.currentFrame.id+'', this.currentFrame.get('layers') );
		
		$('#wrapper').show();
		this.currentFrame.renderWorkspace();
		//this.currentFrame.trigger('focus');
		
	},

	deleteSequence : function(sequenceID)
	{
		var _this = this;
		var sequence = this.project.sequences.get(sequenceID);

		var layers = [];
		_.each( sequence.get('frames'), function(frameID){
			var frame = _this.project.frames.get(frameID);
			layers = _.union(layers,frame.get('layers'));
		});
		console.log( 'layers:',layers)
		_.each( layers, function(layerID){
			var layer = _this.project.layers.get(layerID);
			if( layer && layer.get('type') == 'Link' )
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

					_this.project.frames.add( savedFrame );
					_this.currentSequence.insertFrameView( savedFrame , dupeModel.frameIndex );
					
				}
			});
			
			
		} //busy
	},

	/*
		Launches the continue layer modal
	*/

	continueLayer : function(layerID)
	{
		var Modal = zeega.module('modal');
		var linkModal = new Modal.Views.ContinueLayer({ model:this.project.layers.get(layerID)});
		$('body').append(linkModal.render().el);
		linkModal.show();
	},
	
	/*
		Continues the selected layer to the next frame if there is one
	*/

	continueLayerToNextFrame : function( layerID )
	{
		var nextFrame = this.getRightFrame();
		var layer = this.project.layers.get(layerID);
		if( nextFrame != false && nextFrame != this.currentFrame ) nextFrame.layers.unshift( layer );
	},
	
	/*
		continues the selected layer to the entire sequence
	*/

	continueOnAllFrames : function( layerID )
	{
		var layer = this.project.layers.get(layerID);
		this.currentSequence.addPersistentLayer( layer );
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
		
		$('#wrapper').hide();
		
		this.currentFrame.removeWorkspace();
		
		
		this.Player = zeegaPlayer.app;
		this.Player.initialize( this.exportProject(), {mode: 'editor', frameID : parseInt(this.currentFrame.id) } )
		
		$('body').addClass('preview-mode');
	},
	
	restoreFromPreview : function()
	{
		$('#wrapper').show();
		this.previewMode = false;
		$('body').removeClass('preview-mode');
		this.returnToFrame();
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
		var frameID =  this.currentSequence.get('frames')[ currentFrameIndex-1 ] || this.currentSequence.get('frames')[ 0 ];
		return this.project.frames.get( frameID );
	},

	getRightFrame : function()
	{
		var currentFrameIndex = _.indexOf( this.currentSequence.get('frames'), this.currentFrame.id );
		return this.project.frames.get( this.currentSequence.get('frames')[currentFrameIndex+1] ) || false;
	},

	loadLeftFrame : function()
	{
		console.log('##		load left ----', this.getLeftFrame())
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

	
	shareProject : function()
	{
		if(this.project.get("published"))
		{
			var Modal = zeega.module('modal');
			this.view = new Modal.Views.ShareProject({ model:this.project });
			this.view.render();
		}
	},

	publishProject : function()
	{
		console.log(this.updated);
		if(this.project.get("published")){
			if(this.project.get('date_updated')!=this.project.get('date_published')||this.updated)
			{
				this.updated=false;
				$('#publish-project').html("<i class='zicon-publish raise-up'></i> Publishing...");
				this.project.save({'publish_update':1},{
					success:function(model,response){
						zeega.app.project.set({'publish_update':0,'date_published':response.project.date_published,'date_updated':response.project.date_updated});
						console.log(model,response);
						zeega.app.setButtonStates();
					
					}
				});
			}
		}else{
			var Modal = zeega.module('modal');
			this.view = new Modal.Views.PublishProject({ model:this.project });
			this.view.render();
		}
		
	},

	settingsProject : function()
	{
		if(this.project.get("published"))
		{
			var Modal = zeega.module('modal');
			this.view = new Modal.Views.PublishProject({ model:this.project });
			this.view.render();
		}
	},
	
	setButtonStates : function()
	{
		//console.log("setButtonStates", this.project)
		//console.log("setButtonStates", this.project.get("published"))

		// Publish button
		if(this.project.get("published"))
		{
			$('#settings-project').show();
			$('#share-project').css("color", "#fff");
			$('#publish-project').html("<i class='zicon-publish raise-up'></i> Publish Update");
			if(this.project.get('date_updated')!=this.project.get('date_published')||zeega.app.updated)$('#publish-project').css("color", "#fff");
			else $('#publish-project').css("color", "#666");
			console.log("dates:",this.project.get('date_updated'),this.project.get('date_published'));
		}else{
			$('#settings-project').hide();
			$('#publish-project').html("<i class='zicon-publish raise-up'></i> Publish");
			$('#share-project').css("color", "#666");
		}
	}

	
}, Backbone.Events)


};
