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
        window.Z=this;
        this.url_prefix = sessionStorage.getItem('hostname') + sessionStorage.getItem('directory');

        this.initDatabase();
        this.initProject();

        this.isLoaded = true;

        this.activateWorkspace();
        this.startEditor();
    },

    activateWorkspace : function()
    {
        var Main = zeega.module('main');
        this.workspace = new Main.Views.Framework();
    },

    initDatabase : function()
    {
        var itemsBS,
            collectionsBS,
            Items = zeega.module("items");
        
        itemsBS = jQuery.parseJSON(itemsJSON);

        this.items = new Items.Collection(itemsBS.items);
        this.items.totalItemsCount = itemsBS.items_count;
        this.items.itemCollectionView.render();

        //Collection Selector

        collectionsBS = jQuery.parseJSON(collectionsJSON);
        this.collections = new Items.Collection(collectionsBS.items);
        this.collections.each(function( collection ){
            $("#collection-selector").append("<option value = " + collection.id + ">" + collection.get("title") + "</option>" );
        });

        $("#collection-selector").change( function(){
            zeega.app.refreshDatabase();
        });


    },

    initProject : function()
    {
        var Project = zeega.module("project");
        console.log('!!        projectJSON',$.parseJSON(projectJSON));
        // initializes project
        this.project = new Project.Model($.parseJSON(projectJSON));
        this.project.completeCollections();

        this.project.loadProject();
        this.project.trigger('ready');

        console.log("!!        project initialized: ", this.project);
    },
    
    startEditor : function()
    {
        console.log('editor started');

        //always start the editor at sequence 0, frame 0
        var startFrameID = this.project.sequences.at(0).get('frames')[0];
        this.goToFrame(startFrameID);

        // resize edit window!!
        this.workspace.toggleColumnSize();
        this.workspace.updateWorkspaceScale();
        this.workspace.updateLayerListsContainerHeight();
/*
// router disabled for now
        var Router = Backbone.Router.extend({
            routes : {
                'frame/:frameID' : 'goToFrame'
            },
            goToFrame : function( frameID ){ _this.project.goToFrame(frameID) }
        });
        this.router = new Router();
        Backbone.history.start();
*/
    },

    goToFrame : function( f ){
        var frame;
        if( _.isNumber(f) ) frame = this.project.frames.get(f);
        else frame = f;

        // if the frame's sequence isn't rendered, then render it
        if( _.isNull(this.currentSequence) || this.currentSequence.id != frame.sequenceID ){
            var sequence = this.project.sequences.get( frame.sequenceID );

            sequence.renderSequenceFrames();
            if(this.currentSequence) this.currentSequence.trigger('blur');
            sequence.trigger('focus');
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

    searchDatabase : function( search, reset ){console.log('searchdatabase:',search,reset); this.items.search(search,reset); },
    refreshDatabase : function(){ this.items.refresh(); },

    returnToFrame : function() {
        
        $('#wrapper').show();
        this.currentFrame.renderWorkspace();
        //this.currentFrame.trigger('focus');
        
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
        if( nextFrame !== false && nextFrame != this.currentFrame ) nextFrame.layers.unshift( layer );
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
        if( _.isNumber( frame ) ) frameId = frame;    //tests if it's a number id
        else if( _.isString( frame ) ) frameId = parseInt(frame,10);        //tests if it's a string id
        else if( _.isNumber( frame.id ) ) frameId = frame.id;    //assumes it must be a model
        else return false;

        return _.indexOf( this.sequence.get('framesOrder') , frameId );
    },

    previewSequence : function()
    {
        var _this = this;
        this.previewMode = true;
        this.exportProject();
        
        $('#wrapper').hide();
        
        this.currentFrame.removeWorkspace();
        
        
        this.Player = zeegaPlayer.app;
        this.Player.initialize( this.exportProject(), {mode: 'editor', frameID : parseInt(this.currentFrame.id,10) } );
        
        $('body').addClass('preview-mode');
    },
    
    restoreFromPreview : function()
    {
        console.log('restore from preview');
        $('#wrapper').show();
        this.previewMode = false;
        $('body').removeClass('preview-mode');
        this.returnToFrame();
    },

    exportProject : function( string )
    {
        var projectObject = this.project.toJSON();

        //eliminate falsy values from the frames.layers array
        var f = this.project.frames.toJSON();
        _.each( f, function(frame){ frame.layers = _.compact(frame.layers); });
        
        var sfl = {
            sequences : this.project.sequences.toJSON(),
            frames : f,
            layers : this.project.layers.toJSON()
        };
        
        _.extend(projectObject,sfl);
        
        console.log('EXPORT -- ',projectObject);

        if(string) return JSON.stringify(projectObject);
        else return projectObject;
    },

    getLeftFrame : function()
    {
        var currentFrameIndex = _.indexOf( this.currentSequence.get('frames'), parseInt(this.currentFrame.id,10) );
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
        this.loadFrame( this.getLeftFrame() );
    },
    
    loadRightFrame : function(){ this.loadFrame( this.getRightFrame() ); }

    
}, Backbone.Events)


};
