(function(Project){

    Project.Model = Backbone.Model.extend({
        
        updated : false,

        defaults : {
            'cover_image' : 'images/default_cover.png',
            'author' : ''
        },
        
        url : function(){

            return zeega.app.url_prefix+"api/projects/"+this.id;

        },
        
        initialize : function( attributes )
        {
            _.defaults( this.get('attr'), this.default_attr );
            
            if( _.isUndefined(this.get('cover_image')) || this.get('cover_image') === '' ){
                this.set('cover_image','../../../images/default_cover.png');
            }
                
            //remove dupe data from the attributes
            this.unset('sequences',['silent']);
            this.unset('frames',['silent']);
            this.unset('layers',['silent']);
            
            this.preloadCollections(attributes);

            
            this.layers.on('add', this.onAddLayer, this);
            this.frames.on('add', this.onAddFrame, this);
            
            console.log('init PROJECT', this, attributes);
        },

        preloadCollections : function(attributes)
        {
            this.createLayerCollection(attributes.layers);
            this.createFrameCollection(attributes.frames);
            this.createSequenceCollection( attributes.sequences );
        },

        completeCollections : function()
        {
            // calls the collection functions that need to have the project loaded first
            this.frames.each(function(frame){ frame.complete(); });
            this.sequences.each(function(sequence){ sequence.complete(); });
        },

        /*    create collections    */

        createLayerCollection : function( layers )
        {
            //var Layers = zeega.module('layer');
            //this.layers = new Layers.MasterCollection( layers );
            
            var _this = this;
            var Layers = zeega.module("layer");
            
            // generate layer models from layers
            var layerModelArray = [];
            _.each( layers, function(layer){
                var newLayer = new Layers[ layer.type ](layer);
                _this.initLayerListeners( newLayer );
                layerModelArray.push( newLayer );
            });
            
            this.layers = new Layers.MasterCollection( layerModelArray );
        },
        createFrameCollection : function( frames )
        {
            var Frames = zeega.module('frame');
            this.frames = new Frames.Collection( frames );
        },
        createSequenceCollection : function( sequences )
        {
            var Sequence = zeega.module("sequence");
            this.sequences = new Sequence.Collection( sequences );
            this.sequences.sequenceTrayView.render();

            this.sequences.at(0).trigger('focus');
            //zeega.app.currentSequence = this.sequences.at(0);
        },
        
        /*    end create collections    */
        
        initLayerListeners : function( layerModel )
        {
            layerModel.on('editor_removeLayerFromFrame', this.removeLayerFromFrame, this);
            //layerModel.on('copyToNext', this.continueLayerToNextFrame, this);
            //layerModel.on('persist', this.updatePersistLayer, this);
        },
        
        onAddLayer : function( layer )
        {
            if(layer.get('type')==="Image"&&this.get('cover_image').indexOf("default_cover.png")>0){
                this.save({'cover_image':layer.get('attr').uri});
            }

            this.initLayerListeners( layer );
        },
        
        onAddFrame : function( frame )
        {

        },
        
        /*
        // handled by the sequence model now
        duplicateFrame : function( frameModel )
        {
            var _this = this;
            var dupeModel = frameModel.clone();
            
            dupeModel.set( 'duplicate_id' , parseInt(frameModel.id) );
            dupeModel.oldLayerIDs = frameModel.get('layers');
            dupeModel.frameIndex = _.indexOf( this.get('framesOrder'), frameModel.id );
            dupeModel.dupe = true;
            dupeModel.set('id',null);
            
            dupeModel.save({},{
                success : function( savedFrame )
                {
                    _this.insertFrameView( savedFrame , dupeModel.frameIndex );
                
                    //zeega.app.currentSequence.get('frames');
                
                    //clone layers and place them into the layer array
                    _.each( savedFrame.oldLayerIDs , function(layerID, i){

                        //if layer is persistent
                        //replace frameIndex the id with the persistent id

                        var persistLayers = _this.get('attr').persistLayers;

                        if( _.include( persistLayers, parseInt(layerID) ) )
                        {
                            var layerOrder = savedFrame.get('layers');
                            layerOrder[i] = String(layerID);
                            savedFrame.set({layers:layerOrder})
                        }
                        else
                        {
                            _this.layers.duplicateLayer( layerID, savedFrame.get('layers')[i] );
                        }
                    })
                    //resave the frame after being updated with persistent frame ids
                }
            });
            
            this.frames.add( dupeModel );
        },
        */
        
        removeLayerFromFrame : function( model )
        {
            // if layer is persistent then remove ALL instances from frames
            if( _.include( this.get('persistLayers'), parseInt(model.id,10) ) )
            {
                _.each( _.toArray( this.frames.collection ), function(frame){
                    var newLayers = _.without( frame.get('layers'), parseInt(model.id,10) );
                    if( newLayers.length === 0 ) newLayers = [false];
                    frame.set( 'layers' , newLayers );
                    frame.save();
                });
                var newPersistLayers = _.without( this.get('persistLayers'), parseInt(model.id,10) );
                if( newPersistLayers.length === 0 ) newPersistLayers = [false];
                this.set( 'persistLayers', newPersistLayers );
                this.save();
                model.destroy();
            }
            else
            {
                //remove from the current frame layer array
                var layerArray = _.without( zeega.app.currentFrame.get('layers'), parseInt(model.id,10) );
                if( layerArray.length === 0 ) layerArray = [false];
                
                
                zeega.app.currentFrame.set('layers',layerArray);
                zeega.app.currentFrame.save();
                
                this.destroyOrphanLayers();
            }
        },
        
        destroyOrphanLayers : function()
        {
            var _this = this;
            var layersInCollection = _.map( this.layers.pluck('id'), function(id){return parseInt(id,10);}); // all layers including orphans
            var layersInFrames = _.flatten( this.frames.pluck('layers') ); // layers in use
            var orphanLayerIDs = _.difference( layersInCollection, layersInFrames ); // layers to be nuked
            _.each( orphanLayerIDs, function(orphanID){
                _this.layers.get( orphanID ).destroy();
            });
        },
        
        loadProject : function()
        {
            // make view for project here //
            this.view = new Project.Views.Editor({model:this});
            this.view.render();
        },

        /*
        loadPublishProject : function()
        {
            // publishing view for project //
            var Modal = zeega.module('modal');
            this.view = new Modal.Views.ShareProject({ model:this });
            this.view.render();
        },
        */

        publishProject : function()
        {
            if(this.get('date_updated') != this.get('date_published') || this.updated )
            {
                var mobile = this.validateMobile();
                console.log("mobile playback status:",mobile);

                this.updated = false;
                this.on('sync', this.onProjectPublish, this);
                if(!this.get('published')){
                     this.set({published:true});
                }
                this.set({mobile:mobile});
                this.save({ 'publish_update':1 });
                console.log('already published. published again');
            } else {
                this.trigger('update_buttons');
            }
        },

        onProjectPublish : function( model, response)
        {
            console.log('$$        on project publish', model, response, this.project);
            this.off('sync', this.onProjectPublish);
            this.set({'publish_update':0});
            this.trigger('publish_success');
            this.trigger('update_buttons');
        },

        shareProject : function()
        {
            if(this.get("published"))
            {
                console.log('$$        share project', this);
                
                var Modal = zeega.module('modal');
                var view = new Modal.Views.ShareProject({ model:this });
                $('body').prepend( view.render().el );
                view.show();
                
            }
        },

        settingsProject : function()
        {
            if(this.get("published"))
            {
                var Modal = zeega.module('modal');
                var view = new Modal.Views.PublishProject({ model:this });
                $('body').prepend( view.render().el );
                view.show();
            }
        },
        
        update : function( newAttr, silent )
        {
            var _this = this;
            //_.extend( this.get('attr'), newAttr );
            if( !silent )
            {
                this.save({},{
                    success : function(){ _this.trigger('update'); }
                });
            }
        },
        validateMobile :function() {

            // This is rather ad-hock because it filters only single frame zeegas, also current layer and frame list may not reflect actual frame and layer list
            var audioLayers = 0,
                frameLayers = [],
                unsupportedLayers = 0,
                layerList = this.frames.at(0).get('layers');

            
            // This is necessary because layers aren't currently deleted from projects

            _.each( _.toArray( this.frames ),function( frame ){
                
                frameLayers = _.union(frameLayers, frame.get("layers"));
            });
            
            _.each(_.toArray( this.layers ), function( layer ){
                
                if( layer.get("type") === "Audio" && _.indexOf(frameLayers,layer.id)>-1){
                    console.log("existing audio layer", layer.id, frameLayers);
                    audioLayers++;
                } else if ( layer.get('type') != "Rectangle" && layer.get('type') != "Link" &&  layer.get('type') != "Text" && layer.get('type') != "Image" && _.indexOf(frameLayers,layer.id)>-1){
                    unsupportedLayers++;
                }
                
            });


            
            // Single frame version checks if layer on frame

            // if(this.frames.length>1){
            //     return false;
            // }
            // _.each(_.toArray(this.layers),function(layer){
            //     if(_.indexOf(layerList,layer.id)>-1){
            //         if(layer.get('type')==="Audio"){
            //             audioLayers++;
            //         } else if (layer.get('type')!="Text" && layer.get('type')!="Image"){
            //             unsupportedLayers++;
            //         }
            //     }
            // });




            if(audioLayers>1||unsupportedLayers>0) {
                console.log("Mobile unsupported", this.layers,audioLayers,unsupportedLayers);
                return false;
            }
            console.log("Mobile ok", this.layers,audioLayers,unsupportedLayers);
            return true;
        }
        
    });

})(zeega.module("project"));