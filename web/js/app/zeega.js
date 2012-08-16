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
		
		this.loadCollectionsDropdown( $.parseJSON(collectionsJSON) );
		this.itemCollection = new Items.Collection();
		
		// initializes project
		this.project = new Project.Model($.parseJSON(projectJSON).project);
		this.project.on('ready',function(){ _this.startEditor() })
		this.project.loadProject();
		
		this.setButtonStates()
		this.setProjectListeners();
		console.log("project data ", this.project);

	},
	
	// listens to things saving to update the button states
	
	setProjectListeners : function (){
	
		var _this=this;
		this.project.on('sync',function(){console.log('project_sync');zeega.app.updated=true;_this.setButtonStates()});
		this.project.layers.on('sync',function(){console.log('layer_sync');zeega.app.updated=true;_this.setButtonStates()});
		this.project.sequences.on('sync',function(){console.log('sequence_sync');zeega.app.updated=true;_this.setButtonStates()});
		this.project.frames.on('sync',function(){console.log('frame_sync');zeega.app.updated=true;_this.setButtonStates()});
	
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
		//this.renderWorkspace();
		
		//this.renderSequenceFrames();
		//$('#frame-list').sortable(); // why would I put this here -joseph
		//this.currentSequence.updateFrameOrder();
		
		this.startRouter();
	},
	
	
	//this is temporary. should be moved to the frame model/view
	renderWorkspace : function()
	{
		var Frame = zeega.module('frame');
		this.workspaceView = new Frame.Views.EditorWorkspace();
		this.workspaceView.renderToTarget();
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
				//_this.goToFrame( _this.project.sequences.at(0).get('frames')[0] );
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
		console.log('goToSequence', sequenceID, this.project.sequences.get(sequenceID), frameID, this.project.frames.get( this.currentSequence.get('frames')[0]) )
		//this.unrenderFrame(this.currentFrame);
		this.currentSequence.trigger('blur');
		this.currentSequence = this.project.sequences.get(sequenceID);
		this.currentSequence.trigger('focus');
		
		
		this.currentSequence.renderSequenceFrames();
		
		//this.renderSequenceFrames(this.currentSequence);
		
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
		//make sure we're not trying to load the same frame again!
		if( !this.currentFrame || this.currentFrame.id != frame.id )
		{
			var _this = this;
		
			if(this.currentFrame)
			{
				this.currentFrame.removeWorkspace();
				this.currentFrame.trigger('blur');
			}
			console.log(frame)
			frame.renderWorkspace();
			this.currentFrame = frame;
			this.currentFrame.trigger('focus');

			this.router.navigate('editor/sequence/'+ this.currentSequence.id +'/frame/'+ frame.id, {silent:true});
		}

	},
	
	returnToFrame : function()
	{
		console.log('~~		return to frame', this.currentFrame.id+'', this.currentFrame.get('layers') );
		
		this.currentFrame.renderWorkspace();
		//this.currentFrame.trigger('focus');
		
		this.router.navigate('editor/sequence/'+ this.currentSequence.id +'/frame/'+ this.currentFrame.id, {silent:true});
	},

/*	
	renderSequenceFrames : function(sequence)
	{
		console.log('render sequence frames', sequence);
		
		
		var Sequence = zeega.module('sequence');
		var sequenceView = new Sequence.Views.SequenceFrameDrawer
		
		var _this = this;
		//this is ugly
		$('#frame-list').empty();
		_.each( this.currentSequence.get('frames'), function(frameID){
			_this.project.frames.get(frameID).render();
		})
		//this.currentSequence.updateFrameOrder(false);
	},
*/
	
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
				this.loadFrame(newFrame);//newFrame.render();
				
				if(i>0)
				{
					// if more than one frame is being created
					console.log("not loading frame for later",i);
					newFrame.save({},{
						success : function()
						{
							//console.log(newFrame)
							//newFrame.render();
						
							newFrame.trigger('refresh_view');
							//_this.currentSequence.trigger('updateFrameOrder');
							newFrame.trigger('updateThumb');
							_this.project.frames.add( newFrame );
							//_this.loadFrame( newFrame );
							
							_this.currentSequence.get('frames').push(newFrame.id);
							
							console.log('new frame saved', _this.currentSequence)
							_this.loadFrame( newFrame.id )
						}
					});
				}
				else
				{
					// if more ONLY one frame is being created
					console.log("loading frame for first",i);
					newFrame.save({},{
						success : function()
						{
							_this.project.frames.add( newFrame );
							_this.currentSequence.addFrame( newFrame );
							
							//$('#frame-list').append(newFrame.sequenceFrameView.render().el);
							//newFrame.trigger('refresh_view');
							//newFrame.trigger('updateThumb');
							//_this.currentSequence.get('frames').push(newFrame.id);
							
							_this.loadFrame( newFrame );
							newFrame.trigger('focus');
						}
					});
				}
			
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
	
	addLayer : function( args )
	{
		if(!this.busy)
		{
			console.log('ADD LAYER')
			var _this = this;
			args = _.defaults( args, { frame : _this.currentFrame, options : {}, show : function(){ return (_this.currentFrame.id == args.frame.id)? true : false } } );
			console.log('show layer? '+ args.show() )
			args.frame.trigger('update_thumb');
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
		
		$('#wrapper').hide();
		
		this.currentFrame.removeWorkspace();
		
		this.player = new Player2($('body'));
		this.player.loadProject(this.exportProject(), {sequenceID: parseInt(this.currentSequence.id), frameID : parseInt(this.currentFrame.id) } );
		
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
