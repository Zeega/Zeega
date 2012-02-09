var FrameView = Backbone.View.extend({
		
	initialize : function()
	{
		this.model.bind( 'change:thumb_url', this.onNewThumb, this );
	},
	
	render: function()
	{
		var _this = this;
	
		this.model.bind('thumbUpdateFail',function(){ console.log('thumb fail');$(_this.el).find('.frame-update-overlay').hide() });
	
		var blanks = {
			frameID : this.model.id,
			thumbURL : this.model.get('thumb_url')
		}
		var template = _.template( this.getTemplate() );
		
		this.el = $( template(blanks) );

		//frame droppable stuff
		$(this.el).droppable({
			accept : '.database-asset-list',
			hoverClass : 'frame-item-hover',
			tolerance : 'pointer',

			over : function(event, ui)
			{
				$('#frame-drawer').addClass('hover');
			},
			out : function(event, ui)
			{
				$('#frame-drawer').removeClass('hover');
			},

			//this happens when you drop a database item onto a frame
			drop : function( event, ui )
			{
				$('#frame-drawer').removeClass('hover');
				ui.draggable.draggable('option','revert',false);
				Zeega.createLayerFromItem( Zeega.draggedItem, _this.model );
			}
		});


		$(this.el).hover(function(){
			$(_this.el).find('.frame-menu').show();
		},function(){
			$(_this.el).find('.menu-items').removeClass('open');
			$(_this.el).find('.frame-menu').hide();
		})

		$(this.el).click(function(){
			_this.goToFrame();
		})
		
		$(this.el).find('.menu-toggle').click(function(){
			_this.openDropdown();
		})
		
		$(this.el).find('.menu-items a').click(function(){

			event.stopPropagation();
			
			switch($(this).data('action'))
			{
				case 'delete':
					if(confirm('Delete Frame?')) Zeega.destroyFrame(_this);
					break 
				
				case 'duplicate':
					Zeega.duplicateFrame(_this);
					break;
					
				default:
					console.log('not recognized')
			}
			
			//$(_this.el).find('.menu-items').removeClass('open');
			
		})
		
		//enable the hover when dragging DB items	
		$(this.el).hover(
			//mouseover
			function()
			{
				//only highlight the frame if something is being dragged into it
				if( Zeega.draggedItem == null ) $(this).find('.menu-toggle').show();
			},
			//mouseout
			function()
			{
				$(this).find('.menu-toggle').hide();
			}
			
		);
			
		return this;
	},
	
	events : {
		'mouseover'		: 'showGear'
	},
	

	
	showGear : function()
	{
		console.log('hover')
	},
	
	openDropdown : function()
	{
		if( $(this.el).find('.menu-items').is(':hidden') )
		{
			$(this.el).find('.zicon-edit').addClass('zicon-close');
			$(this.el).find('.menu-items').addClass('open');
		}
		else
		{
			$(this.el).find('.zicon-edit').removeClass('zicon-close');
			$(this.el).find('.menu-items').removeClass('open');
		}

		event.stopPropagation();
	},
	
	goToFrame : function()
	{
		Zeega.loadFrame(this.model);
		return false;
	},
	
	onNewThumb : function()
	{
		var _this = this;
		//Update thumbnail in sequence display
		if( $(this.el).is(':visible '))
		{
			$(this.el).fadeOut('fast',function(){
				$(this)
					.css('background-image','url("'+ _this.model.get('thumb_url') +'")')
					.fadeIn('fast');
				$(this).find('.frame-update-overlay').hide();
			});
		}
		else
		{
			$(this.el).css('background-image','url("'+ this.model.get('thumb_url') +'")');
			$(this.el).find('.frame-update-overlay').hide();
		}
	},
	
	getTemplate : function()
	{
		var html = 
			
			"<li id='frame-thumb-<%= frameID %>' class='frame-thumb' style='background-image:url(\"<%= thumbURL %>\")'>"+
				"<div class='frame-update-overlay'></div>"+
				"<div class='frame-menu hidden'>"+
					"<a href='#' class='menu-toggle'><span class='zicon zicon-gear orange'></span></a>"+
					"<ul class='unstyled menu-items'>"+
						"<li><a href='#' data-action='duplicate'>Duplicate Frame</a></li>"+
						"<li><a href='#' data-action='delete'>Delete Frame</a></li>"+
					"</ul>"+
				"</div>"+
			"</li>";

		return html;
	}
	
});


var FrameViewCollection = Backbone.View.extend({
	//set the location where the frames are to be drawn
	el : $('#frame-list'),
	
	initialize : function()
	{
		
		//	bind add & remove actions
		_(this).bindAll('add','remove');
		
		//create empty _frameViews array
		this._frameViews = [];
		
		//	add each frame to the view
		this.collection.each(this.add);
		
		//	bind the view to the add & remove events of the collection
		this.collection.bind('add', this.add);
		this.collection.bind('remove', this.remove);
		
	},
	
	add : function(frame)
	{
		var _this = this;
		frame.url = Zeega.url_prefix+'frames/'+ frame.id;
		
		_(Zeega.sequence.frames).push(frame);
		
		//save frame if the layer is new!
		if( frame.isNew() )
		{
			
			frame.url = Zeega.url_prefix+'sequences/'+ Zeega.sequenceID +'/frames';
			//if(Zeega.currentFrame) frame.set({'attr':{'editorHidden':Zeega.currentFrame.get('attr').editorHidden}});
			
			frame.save(
				{},
				{
					success : function( savedFrame )
					{
						
						savedFrame.url = Zeega.url_prefix+'frames/'+ frame.id;
						//must do this after success to capture the new id!!
						
						if(frame.dupe) 
						{
							var changed = false;
							_this.insertView(new FrameView({ model : frame }), frame.frameIndex );
							
							//clone layers and place them into the layer array
							_.each( savedFrame.oldLayerIDs , function(layerID, i){

								//if layer is persistent
								//replace frameIndex the id with the persistent id
								//don't clone the layer
								
								var persistLayers = Zeega.sequence.get('attr').persistLayers;
								
								if( _.include( persistLayers, String(layerID) ) )
								{
									changed = true;
									var layerOrder = savedFrame.get('layers');
									layerOrder[i] = String(layerID);
									savedFrame.set({layers:layerOrder})
								}
								else
								{
									//if a non-persistent layer, then make a whole new model for it!
									var dupeAttr = JSON.stringify(Zeega.sequence.layerCollection.get(layerID));
									dupeAttr = $.parseJSON(dupeAttr);
								
									var newLayer = new Layer(dupeAttr);
									newLayer.id = String( savedFrame.get('layers')[i] ); //make into string
									newLayer.set({ id: String( savedFrame.get('layers')[i] ) }); //make into string
							
									Zeega.addToLayerCollections( savedFrame, newLayer );
								}
								
								Zeega.loadFrame(savedFrame);
								
							})

							//resave the frame after being updated with  persistent frame ids
							if( changed ) savedFrame.save();
							
						}
						else
						{
							console.log('BLANK NODE')
							_this.insertView(new FrameView({ model : frame }));
						
							//add persisting layers to new frames
							var persistLayers = Zeega.sequence.get('attr').persistLayers;
							_.each( persistLayers, function(layerID){
								Zeega.addLayerToFrame( savedFrame, Zeega.sequence.layerCollection.get(layerID) );
							});
							//add a new current frame style
							$('.frame-thumb-'+Zeega.currentFrame.id).addClass('frame-selected');
							//go to the new frame
							Zeega.loadFrame(savedFrame);
						}
						
						
					}
				}
				
			);
			
			
			
				
		}else{
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
			
			//call re-sort
			Zeega.frameSort()
		}
	},
	
	render : function()
	{
		this._rendered = true;
		var _this = this;
		
		//clear out any old stuff inside this.el
		$(this.el).empty();
		//add EACH model's view to the _this.el and render it
		_(this._frameViews).each(function(frame){
			$(_this.el).append(frame.render().el);
		});
		
		console.log('renderFrames');

		return this;
	}
	
});