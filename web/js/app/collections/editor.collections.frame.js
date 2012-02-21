(function(Frame){

	Frame.ViewCollection = Backbone.View.extend({
		
		//set the location where the frames are to be drawn
		el : $('#frame-list'),
	
		initialize : function()
		{
			this._frameViews = [];
			
			this.collection.on('add', this.add, this);
			this.on('resort', this.resort, this)
			//if there are no frames, then add one automagically
			if(this.collection.length == 0) this.collection.add( new Frame.Model() )
			this.render();

		},
		
		render : function()
		{
			var _this = this;
			this._rendered = true;
		
			//clear out any old stuff inside this.el
			this.$el.empty();
			//add EACH model's view to the _this.el and render it
			_.each( _.toArray( this.collection ), function( frameModel ){
				var frameView = new Frame.Views.FrameSequence({model:frameModel});
				_this._frameViews.push( frameView);
				_this.$el.append( frameView.render().el );
			});
			return this;
		},
		
		resort : function( frameIDArray )
		{
			
		},
		
		addFrame : function( frameModel )
		{
			if( _.isUndefined( frameModel) ) this.collection.add( new Frame.Model() );
			else this.collection.add( frameModel );
		},
	
		add : function(frame)
		{
			var _this = this;
			//save frame if the layer is new!
			if( frame.isNew() )
			{
				//if(zeega.app.currentFrame) frame.set({'attr':{'editorHidden':zeega.app.currentFrame.get('attr').editorHidden}});
				console.log( 'frame is new. URL is: '+ frame.url() )
			
				frame.save(
					{},
					{
						success : function( savedFrame )
						{
							console.log('savedFrame')
							console.log(savedFrame)

							if(frame.dupe) 
							{
								console.log('frame is a duplicate')
								_this.insertView(new Frame.Views.FrameSequence({ model : frame }), frame.frameIndex );
							
								//clone layers and place them into the layer array
								_.each( savedFrame.oldLayerIDs , function(layerID, i){

									//if layer is persistent
									//replace frameIndex the id with the persistent id

									var persistLayers = zeega.app.project.sequences[0].get('attr').persistLayers;

									if( _.include( persistLayers, String(layerID) ) )
									{
										var layerOrder = savedFrame.get('layers');
										layerOrder[i] = String(layerID);
										savedFrame.set({layers:layerOrder})
									}
									else
									{
										zeega.app.project.sequences[0].layers.duplicateLayer( layerID, savedFrame.get('layers')[i] );
									}
								})
								zeega.app.loadFrame(savedFrame);
								//resave the frame after being updated with persistent frame ids
								if( savedFrame.hasChanged() ) savedFrame.save();
							
							}
							else
							{
								console.log('BLANK NODE')
								_this.insertView( new Frame.Views.FrameSequence({ model : frame }) );
						
								//add persisting layers to new frames
								var persistLayers = zeega.app.project.sequences[0].get('attr').persistLayers;
								_.each( persistLayers, function(layerID){
									zeega.app.addLayerToFrame( savedFrame, zeega.app.sequence.layerCollection.get(layerID) );
								});

								//go to the new frame
								zeega.app.loadFrame(savedFrame);
							}
							
							_this.collection.trigger('updateFrameOrder');
						
						} // success
					}
				
				);
				
			}else{
				frame.url = zeega.app.url_prefix+'frames/'+ frame.id;
				this.insertView(new FrameView({ model : frame }));
			}
			
		},

		insertView : function( view, index )
		{
		
			//	push the frameView to the collection
			//should be placed after the current frame
			this._frameViews.push(view);
			//	if already rendered
			//	append to the rendered view
			if (this._rendered) 
			{
				if( _.isUndefined(index) ) $(this.el).append(view.render().el);
				else $(this.el).children('li:eq('+index+')').after(view.render().el);
			}
		}
	});

	Frame.Collection = Backbone.Collection.extend({
		model: Frame.Model,
		url : function(){ return zeega.app.url_prefix+"sequences/"+ zeega.app.sequence.id +"/frames" }
	});

})(zeega.module("frame"));
