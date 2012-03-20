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
	
	
	//sequenceID : 1,
	currentFrame : null,
	thumbnailUpdates : false,
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
		this.startRouter();

	},
	
	loadModules : function()
	{
		var _this = this;
		var Project = zeega.module("project");
		var Items = zeega.module("items");
		console.log($.parseJSON(projectJSON))
		this.project = new Project.Model($.parseJSON(projectJSON).project);
		this.project.on('ready',function(){ _this.startEditor() })
		this.project.loadProject()
		this.itemCollection = new Items.ViewCollection();
	},
	
	searchDatabase : function( search, reset ){ this.itemCollection.search(search,reset) },
	refreshDatabase : function(){ this.itemCollection.refresh() },

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
	
	goToFrame : function(frameId)
	{
		console.log('GOTOFRAME')
		if(this.isLoaded) 
		{
			console.log('GO TO FRAME: '+frameId)
			if( _.isUndefined(frameId) ) this.loadFrame( this.project.sequences[0].frames.collection.at(0) );
			else this.loadFrame( this.project.sequences[0].frames.collection.get( frameId ) );
		}
	},

	loadFrame : function( frame )
	{
		var _this = this;
		this.clearCurrentFrame();
		if(this.currentFrame) this.currentFrame.trigger('blur');
		this.currentFrame = frame;
		this.currentFrame.trigger('focus');
		
		this.router.navigate('editor/frame/'+ frame.id, {silent:true});

		this.restorePanelStates();
		this.setAdvanceValues();

		// add the frame's layers // remove falsy values
		var layerIDArray = _.compact( this.currentFrame.get('layers'));
		this.project.sequences[0].layers.renderLayers( layerIDArray );

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
			$('#advance-time').val(adv);
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

	clearCurrentFrame : function ()
	{
		$('.icon-tray').empty();
	},

	addFrame : function()
	{
		// maybe something like function( index, numberOfFramesToAdd ) ??
		this.project.sequences[0].frames.addFrame();
	},
	
	addLayer : function( args )
	{
		console.log('ADD LAYER')
		args = _.defaults( args, { frame : this.currentFrame, show : function(){ return _.isEqual( this.currentFrame, args.frame ) } } );
		console.log(args)
		this.project.sequences[0].layers.addNewLayer( args )
	},
	
	updateLayerOrder : function( layerIDArray )
	{
		layerIDs = layerIDArray.reverse();
		// updates z-index of divs in workspace
		_.each(layerIDs, function(id, i){ $('#layer-preview-'+ id ).css('z-index', i) });
		this.currentFrame.set({'layers':layerIDs})
	},
	
	updateFrameOrder : function(){ this.project.sequences[0].updateFrameOrder() },

	// returns the order that the frame appears in the sequence
	getFrameIndex : function( frame )
	{
		if( _.isNumber( frame ) ) frameId = frame;				//tests if it's a number id
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

		Player.init( this.exportProject(), parseInt(this.project.sequences[0].id), parseInt(this.currentFrame.id), true );

	},

	exportProject : function( string )
	{
		console.log('-- EXPORT --');

		var order = _.map( this.project.sequences[0].get('framesOrder'), function(num){ return parseInt(num) });
		
		var frames = this.project.sequences[0].frames.collection.toJSON();
		_.each( frames, function(frame){ frame.layers = _.compact(frame.layers) })
		
		var layers = this.project.sequences[0].layers.toJSON();
		_.each(layers, function(layer){ layer.id = parseInt(layer.id) });
		
		var sequences = [{
			'id' : parseInt( this.project.sequences[0].id ),
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
	},	

	getLeftFrame : function()
	{
		var frameOrder = this.project.sequences[0].get('framesOrder');
		var currentFrameIndex = _.indexOf( frameOrder, parseInt(this.currentFrame.id) );
		if( currentFrameIndex ) return this.project.sequences[0].frames.collection.get( frameOrder[ currentFrameIndex-1 ] );
		else return this.project.sequences[0].frames.collection.get( frameOrder[1] );
	},

	getRightFrame : function()
	{
		var currentFrameIndex = _.indexOf( this.project.sequences[0].get('framesOrder'), this.currentFrame.id );
		if(currentFrameIndex < _.size( this.project.sequences[0].frames.collection )-1 ) return this.project.sequences[0].frames.collection.at( currentFrameIndex + 1 );
		else return false;
	},

	loadLeftFrame : function(){ if(frame) this.loadFrame( this.getLeftFrame() ) },
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
		
		/*
		if(localStorage.help != 'false' && this.helpCounter == 0)
		{
			//init the popovers
			$('#visual-editor-workspace').popover({
				trigger: manual,
				html:true,
				placement:'above',
				offset:'-250',
				template: '<div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="zeega.app.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="zeega.app.displayStartHelp();return false;">next</a></div></div>'
			});
			$('#database-panel').popover({
				trigger: manual,
				html:true,
				placement:'right',
				//offset:'-250',
				template: '<div class="arrow"></div><div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="zeega.app.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="zeega.app.displayStartHelp();return false;">next</a></div></div>'
			});
			$('#new-layer-tray').popover({
				trigger: manual,
				html:true,
				placement:'above',
				template: '<div class="arrow"></div><div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="zeega.app.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="zeega.app.displayStartHelp();return false;">next</a></div></div>'
			});
			$('#layer-panel').popover({
				trigger: manual,
				html:true,
				placement:'above',
				template: '<div class="arrow"></div><div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="zeega.app.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="zeega.app.displayStartHelp();return false;">next</a></div></div>'
			});
			$('#frame-drawer').popover({
				trigger: manual,
				html:true,
				placement:'below',
				template: '<div class="arrow"></div><div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="zeega.app.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="zeega.app.displayStartHelp();return false;">next</a></div></div>'
			});
			$('#preview').popover({
				trigger: manual,
				html:true,
				placement:'below',
				template: '<div class="arrow"></div><div class="inner help"><h3 class="title"></h3><div class="content"><p></p></div><div class="help-controls"><a href="#" onclick="zeega.app.turnOffHelp();return false">close</a><a class="btn success" href="#" onClick="zeega.app.displayStartHelp();return false;">next</a></div></div>'
			});

			this.displayStartHelp();
		}
		*/
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

	
	
	
}, Backbone.Events)


};
