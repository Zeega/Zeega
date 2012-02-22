(function(Layer){

	Layer.Views.LayerList = Backbone.View.extend({
		
		tagName : 'li',
	
		initialize : function()
		{
			this.model.on( 'change:title', this.updateLayerTitle );
			
			this.model.on( 'change:height change:width change:opacity change:color change:left change:top', this.updateFrameThumb );
			/*
			this.model.on( 'change:width', this.updateFrameThumb );
			this.model.on( 'change:opacity', this.updateFrameThumb );
			this.model.on( 'change:color', this.updateFrameThumb );
			this.model.on( 'change:left', this.updateFrameThumb );
			this.model.on( 'change:top', this.updateFrameThumb );
			*/
		},
	
		updateFrameThumb : function(){ zeega.app.currentFrame.trigger('updateThumb') },
	
		//draws the controls
		render : function( )
		{
			var _this = this;

			var text = this.model.get('text');
			var type = this.model.get("type");
		
			// make sure we have a deep copy and not a reference that can be edited
			var defaults = deepCopy(this.model.layerClass.defaultAttributes);
			if( !this.model.get('attr') ) this.model.set({ attr : defaults });
		
			//shorten title if necessary
			var title = this.model.get('attr').title;
		
		
			var persist = '';

			if( zeega.app.project.sequences[0].get('attr') && zeega.app.project.sequences[0].get('attr').persistLayers && _.include( zeega.app.project.sequences[0].get('attr').persistLayers , _this.model.id ) )
				persist = 'checked';
			else
				persist = '';
			
			var showLink = '';
			if( _.isUndefined( this.model.get('attr').link_to ) || this.model.get('attr').link_to == '' )
				showLink = 'hidden';

			var linkURL = '';
			if(showLink == '')
			{
				linkURL = this.model.get('attr').link_to;
			}
			//set values to be filled into template
			var values = {
				id : 'layer-edit-'+this.model.id,
				layerName : title,
				persist : persist,
				show_link : showLink,
				link_to : linkURL
			}
			//make template
			var tmpl = _.template( this.getTemplate() );
			//fill in template with values
			$(this.el).html( tmpl(values) );
			//set the id of the parent element
			$(this.el).attr('id', 'layer-'+ this.model.id);
			//add the controls to the layer
		
			$(this.el).find('.asset-type-icon').addClass('zicon-' +type.toLowerCase() );
		
			$(this.el).find('#controls').append( this.model.layerClass.drawControls() );
		
			this.setListeners();
		
			return this;
		},
	
		updateLayerTitle : function()
		{
			//I can't access the this.el because the scope has changed to the model object :/
			$( '#layer-'+ this.id ).find('.layer-title').html( this.get('attr').title );
		},
	
		setListeners : function()
		{
			var _this = this;
			//twipsies
			/*
			$(this.el).find('.layer-link').twipsy({
				placement : 'right'
			})
*/
			//finish entering  link info
			$(this.el).find('.layer-link-box input')
				.keypress(function(e){
					if(e.which == 13)
					{
						$(this).blur();
						return false;
					}
					else return true;
				})
				.blur(function(){
					$(this).effect('highlight',{},3000);
					_this.saveLink( $(this).val() );
				})
		},
	
		saveLink : function( url )
		{
			// do some validation here?
			url = url.replace(/http:\/\//g, '' );

			var properties = {
				link : {
					property : 'link_to',
					value : url,
					css : false
				}
			};
			this.model.layerClass.layerControls.trigger( 'update' , [ properties ]);
		},
	
	
		/***********************
	
				EVENTS
	
		***********************/
	
		events : {
			'click .delete-layer'		: 'delete',
			'click .layer-title'		: 'expand',
			'change #persist'			: 'persist',
			'click .copy-to-next'		: 'copyToNext',
			'click .layer-icon'			: 'hideShow',
			'mouseenter .layer-icon'	: 'onLayerIconEnter', 
			'mouseleave .layer-icon'	: 'onLayerIconLeave', 
			'mouseenter .delete-layer'	: 'onLayerTrashEnter', 
			'mouseleave .delete-layer'	: 'onLayerTrashLeave',
			'click .layer-link'			: "layerLink",
			'click .clear-link'			: 'clearLayerLink'
		},
	
		//delete this layer from the DB and view
		delete : function()
		{
			if( confirm('Delete Layer?') )
			{
				this.$el.remove();
				this.model.trigger('removeFromFrame', this.model);
			}
		},
	
		//	open/close and expanding layer items
		expand :function()
		{
			var _this = this;
			console.log('expander clicked')
			console.log( $(this.el).find('.layer-content').is(':hidden') )
		
			if( $(this.el).find('.layer-content').is(':hidden') )
			{
				//show layer controls
				console.log('controls open')
				$(this.el).find('.layer-content')
					.show('blind',{'direction':'vertical'},function(){ _this.model.layerClass.onControlsOpen(); $(this).removeClass('closed'); });
			}
			else
			{
				console.log('controls close')
				//hide layer controls
				$(this.el).find('.layer-content')
					.hide('blind',{'direction':'vertical'},function(){ $(this).addClass('closed') });
				this.model.layerClass.onControlsClose();
			}
			return false;
		
		},
	
		//set persistance action
		persist : function()
		{
			this.model.trigger('persist', this.model);
			/*
			if( $(this.el).find('#persist').is(':checked') ) Zeega.persistLayerOverFrames(this.model);
			else Zeega.removeLayerPersist( this.model );
			*/
		},
	
		copyToNext : function()
		{
			//Zeega.copyLayerToNextFrame( this.model)
			this.model.trigger('copyToNext', parseInt(this.model.id) );
			return false;
		},
	
		hideShow : function()
		{
			//set the visible in editor to the opposite of what it is currently
			var visible = !this.model.get('visibleineditor');
			this.model.set({'visibleineditor': visible });
		
			//change the color of the layer icon so it's apparent on/off
			if( visible ) $(this.el).find('.asset-type-icon').addClass('orange');
			else $(this.el).find('.asset-type-icon').removeClass('orange');
		},
	
		onLayerIconEnter : function()
		{
			$(this.el).find('.asset-type-icon').addClass('zicon-visible')
		},
	
		onLayerIconLeave : function()
		{
			$(this.el).find('.asset-type-icon').removeClass('zicon-visible')
		},
	
		onLayerTrashEnter : function()
		{
			$(this.el).find('.delete-layer').addClass('orange zicon-trash-open')
		},
	
		onLayerTrashLeave : function()
		{
			$(this.el).find('.delete-layer').removeClass('orange zicon-trash-open')
		
		},
	
		layerLink : function()
		{
			$(this.el).find('.layer-link-box').show();
			return false;
		},
	
		clearLayerLink : function()
		{
		
			$(this.el).find('.layer-link-box input').val('');
		
			var properties = {
				link : {
					property : 'link_to',
					value : '',
					css : false
				}
			};
			this.model.layerClass.layerControls.trigger( 'update' , [ properties ]);
		
			return false;
		},
	
		getTemplate : function()
		{
			var html =
		
			'<div class="layer-uber-bar clearfix">'+
				'<div class="layer-icon">'+
					'<span class="asset-type-icon orange zicon"></span>'+
				'</div>'+
				'<div class="layer-title"><%= layerName %></div>'+
				'<div class="layer-uber-controls">'+
					'<span class="delete-layer zicon zicon-trash-closed"></span>'+
				'</div>'+
				'<div class="layer-drag-handle">'+
					'<span class="zicon zicon-vert-drag"></span>'+
				'</div>'+
			'</div>'+
			'<div class="layer-content inset-tray dark tray closed">'+
				'<div id="controls" class="clearfix"></div>'+
				//'<br />'+
				'<div class="standard-layer-controls clearfix">'+
					'<div>'+
						'<label for="persist" class="checkbox"><input id="persist" type="checkbox" name="vehicle" value="persist" <%= persist %> />Continue on all frames</label>'+
					'</div>'+
					'<div><a href="#" class="copy-to-next btn">Continue on next frame</a></div>';
			
			if( this.model.layerClass.linkable )
			{

				html +=	'<div><a href="#" class="layer-link" title="click here to set this layer as a link" style="float:left"><span class="zicon zicon-link orange"></span></a></div>';
				html += '<div class="layer-link-box <%= show_link %>">';
				html +=		'<div class="input-prepend"><span class="add-on">http://</span><input class="span4" name="prependedInput" type="text" placeholder="www.example.com" value="<%= link_to %>">';
				html +=		'<a href="#" class="clear-link"><span class="zicon zicon-close orange"></span></a>';
				html += '</div></div>';
			}
			html += 	'</div>'; //standard layer controls
			html += '</div>';
		
			return html;
		}
	
	
	});

})(zeega.module("layer"));
