 (function(Sequence){

    Sequence.FrameCollection = Backbone.Collection.extend({});

    Sequence.Model = Backbone.Model.extend({
        
        defaults :{
            attr : {},

            persistent_layers : []
        },
        
        url : function()
        {
            if ( this.isNew() ) return zeega.app.url_prefix + 'api/projects/'+ zeega.app.project.id +'/sequences';
            return zeega.app.url_prefix+'api/sequences/' + this.id;
        },
                
        initialize : function( attributes )
        {
            this.tabView = new Sequence.Views.SequenceTabs({model:this});
            this.sequenceFrameView = new Sequence.Views.SequenceFrameDrawer({model:this});
        },

        onSaveNew : function()
        {
            var _this = this;
            var Frame = zeega.module('frame');
            var frameData = this.get('frames');
            var frames = _.map( this.get('frames'), function(frameJSON){
                var frameModel = new Frame.Model(frameJSON);
                //frameModel.id = frameID;
                frameModel.sequenceID = _this.id;
                frameModel.complete();
                return frameModel;
            });
            frames = _.compact(frames);

            this.set('frames', _.pluck(frames,'id') );
            zeega.app.project.frames.add( frames, {silent:true} );
            this.complete();
        },

        complete : function()
        {
            var _this = this;
            // make persistent layer collection
            var persistentLayers = this.get('persistent_layers').map(function(layerID){
                return zeega.app.project.layers.get(layerID);
            });

            var col = Backbone.Collection.extend();
            this.persistentLayers = new col( persistentLayers );
            // make frame collection
            // if this is a new sequence the frames will come in as objects
            if(  _.isObject( this.get('frames')[0] ) )
            {
                zeega.app.project.frames.add( this.get('frames'));

                this.set('frames', _.pluck( this.get('frames'), 'id' ) );
            }

            var frameArray = this.get('frames').map(function(frameID){
                var frame = zeega.app.project.frames.get(frameID);
                if(frame.complete !== true) frame.complete();
                frame.sequenceID = _this.id;
                return frame;
            });
            
            this.frames = new Sequence.FrameCollection(frameArray);

            this.frames.each(function(frame, i){
                frame.frameIndex = i;
            });

            this.frames.comparator = function( frame ){ return frame.frameIndex; };
            this.frames.on('add', this.onAddFrame, this);
            this.frames.on('remove', this.onRemoveFrame, this);
        },
        
        refreshView : function()
        {
            this.tabView.render();
        },
        
        renderSequenceFrames : function()
        {
            this.sequenceFrameView.render();
        },
        unrenderSequenceFrames : function()
        {
            this.sequenceFrameView.remove();
        },

        addFrames : function(num)
        {
            var _this = this;
            var n = num || 1;
            var Frame = zeega.module('frame');

            _.times( n, function(i){
                var newFrame = new Frame.Model();

                newFrame.save({ 'layers' : _.compact(_this.get('persistent_layers')) })
                    .success(function(){
                        newFrame.complete(); // complete the collections inside the frame
                        newFrame.frameIndex = _this.frames.length;
                        newFrame.sequenceID = _this.id; // add the sequence id to the frame
                        zeega.app.project.frames.add( newFrame );
                        _this.frames.push( newFrame );
                        if( i == n-1 ) zeega.app.loadFrame( newFrame );
                        newFrame.trigger('sync');
                    });
                
            });
        },

        onAddFrame : function( frame )
        {
            this.sequenceFrameView.render();
            this.updateFrameOrder();
        },

        onRemoveFrame : function( frame, frames, options )
        {

            if( frame == zeega.app.currentFrame )
            {
                var newFrameIndex = options.index < 1 ? 0 : options.index - 1;
                if( frames.length > 0 ) zeega.app.loadFrame( frames.at( newFrameIndex ) );
                else this.addFrames(1);
            }
            console.log('remove frame',frame);
            var linkLayers = frame.layers.where({ type : 'Link'});
            console.log('$$        found link layers', linkLayers, frame);
            _.each( linkLayers, function(layer){
                var from = layer.get('attr').from_frame;
                var to = layer.get('attr').to_frame;
                console.log('$$        remove from frames', layer, to, from, zeega.app.project.frames.get(to), zeega.app.project.frames.get(from));

                if(to) zeega.app.project.frames.get(to).layers.remove(layer);
                if(from) zeega.app.project.frames.get(from).layers.remove(layer);
            });

            frame.destroy(); // <---------------------- remove this when api updates
            this.sequenceFrameView.render();
            this.updateFrameOrder();

        },

        onFrameReorder : function( frameIDArray )
        {
            var _this = this;
            _.each(frameIDArray, function(frameID, i){
                var frame = _this.frames.get(frameID);
                frame.frameIndex = i;
            });
            this.frames.sort();
            this.updateFrameOrder();
        },

        updateFrameOrder : function()
        {
            var frameOrder = this.frames.pluck('id');
            if(frameOrder.length === 0) frameOrder = [false];
            this.save({'frames':frameOrder});
        },
/*
        duplicateFrame : function( frame )
        {
            // determine orig frame position
            // clone orig frame
            // save clone
            // reinsert after orig frame
            var index = this.frames.indexOf(frame);
            var clone = frame.clone();
            var layersToDupe = frame.layers.reject(function(layer){ return layer.get('type') == 'Link' });
            console.log('$$        duplicate frame!!', frame, index, clone, layersToDupe)


        },
*/
        duplicateFrame : function( frameModel )
        {
            var dupeModel = frameModel.clone();
            
            //remove link layers because it doesn't make sense to dupe those
            var layersToDupe = _.map( frameModel.get('layers'), function(layerID){
                if(zeega.app.project.layers.get(layerID).get('type') != 'Link') return layerID;
            });
            dupeModel.set({
                'layers' : _.compact(layersToDupe),
                'duplicate_id' : parseInt(frameModel.id,10),
                'id' : null
            });
            
            dupeModel.oldLayerIDs = _.compact(layersToDupe);
            dupeModel.frameIndex = _.indexOf( zeega.app.currentSequence.get('frames'), frameModel.id );
            dupeModel.sequenceID = this.id;
            dupeModel.on('sync', this.onDupeFrameSave, this);
            dupeModel.save();
        },

        onDupeFrameSave : function( frame )
        {
            var _this = this;
            frame.off('sync', this.onDupeFrameSave);
            console.log('$$        on dupe save', frame);
            //clone layers and place them into the layer array
            var persistLayers = zeega.app.currentSequence.get('persistent_layers');
            _.each( frame.oldLayerIDs , function(layerID, i){
                //if layer is persistent
                //replace frameIndex the id with the persistent id
                if( _.include( persistLayers, parseInt(layerID,10) ) )
                {
                    var layerOrder = frame.get('layers');
                    layerOrder[i] = parseInt(layerID,10);
                    frame.set({layers:layerOrder});
                }
                else zeega.app.project.layers.duplicateLayer( layerID, frame.get('layers')[i] );
            });
            frame.complete();
            //resave the frame after being updated with persistent frame ids
            zeega.app.project.frames.add(frame);
            this.frames.add( frame, {at:frame.frameIndex+1} );
        },

        addPersistentLayer : function( layer )
        {
            // test to see if the layer is already in the collection
            if( !this.persistentLayers.include(layer) )
            {
                this.persistentLayers.add( layer );
                this.updatePersistLayerArray();
                this.frames.each(function(frame){
                    if(frame != zeega.app.currentFrame) frame.layers.unshift( layer );
                });
            }
        },

        removePersistentLayer : function( layer )
        {
            if( this.persistentLayers.include(layer) )
            {
                this.persistentLayers.remove( layer );
                this.updatePersistLayerArray();
            }
        },

        updatePersistLayerArray : function()
        {
            var layerIDArray = this.persistentLayers.length ? _.compact( this.persistentLayers.pluck('id') ): [false];
            this.save('persistent_layers', layerIDArray );
        },

        
        update : function( newAttr, silent )
        {
            var _this = this;
            this.set({ attr: _.extend( this.get('attr'), newAttr ) });
            if( silent !== true ) this.save();
        }
        
    });

})(zeega.module("sequence"));
