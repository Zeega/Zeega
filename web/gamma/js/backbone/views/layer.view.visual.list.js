


var VisualLayerListView = Backbone.View.extend({
	
	tagName : 'li',
	
	initialize : function()
	{
		this.model.bind( 'change:title', this.updateLayerTitle );
		
		this.model.bind( 'change:height', this.updateNodeThumb );
		this.model.bind( 'change:width', this.updateNodeThumb );
		this.model.bind( 'change:opacity', this.updateNodeThumb );
		this.model.bind( 'change:color', this.updateNodeThumb );
		this.model.bind( 'change:left', this.updateNodeThumb );
		this.model.bind( 'change:top', this.updateNodeThumb );
	},
	
	updateNodeThumb : function()
	{
		Zeega.currentNode.noteChange();
	},
	
	//draws the controls
	render : function( )
	{
		var _this = this;

		this.model.bind('remove',this.remove);
		var text = this.model.get('text');
		var type = this.model.get('type');
		
		// make sure we have a deep copy and not a reference that can be edited
		var defaults = deepCopy(this.model.layerClass.defaultAttributes);
		if( !this.model.get('attr') ) this.model.set({ attr : defaults });
		
		//shorten title if necessary
		var title = this.model.get('attr').title;
		
		var persist;
		if( Zeega.route.get('attr') && Zeega.route.get('attr').persistLayers && _.include( Zeega.route.get('attr').persistLayers , _this.model.id ) )
		{
			persist = 'checked';
		}else{
			persist = '';
		}
		
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
		//twipsies
		$(this.el).find('.layer-link').twipsy({
			placement : 'right'
		})
		
		
		
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
		this.remove();
		Zeega.removeLayerFromNode( Zeega.currentNode, this.model );
	},
	
	//	open/close and expanding layer items
	expand :function()
	{
		var _this = this;
		if( $(this.el).find('.layer-content').is(':visible') )
		{
			//hide layer controls
			$(this.el).find('.layer-content').hide('blind',{'direction':'vertical'});
			this.model.layerClass.onControlsClose();
			return false;
		}else{
			//show layer controls
			$(this.el).find('.layer-content').show('blind',{'direction':'vertical'},function(){ _this.model.layerClass.onControlsOpen() });
			return false;
		}
		
	},
	
	//set persistance action
	persist : function()
	{
		if( $(this.el).find('#persist').is(':checked') ) Zeega.persistLayerOverNodes(this.model);
		else Zeega.removeLayerPersist( this.model );
	},
	
	copyToNext : function()
	{
		Zeega.copyLayerToNextNode( this.model)
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
		console.log('open linker')
		var _this = this;
		$(this.el).find('.layer-link-box').show();
		
		/*
		$(this.el).find('.layer-link-box input').blur(function(){
			var url = $(this).val();
			url = url.replace(/http:\/\//g, '' );

			var properties = {
				link : {
					property : 'link_to',
					value : url,
					css : false
				}
			};
			_this.model.layerClass.layerControls.trigger( 'update' , [ properties ]);
			
			$(this).blur();
			return false;
		})
		*/
		
		//finish entering  link info
		$(this.el).find('.layer-link-box input').keypress(function(e){
			if(e.which == 13)
			{
				
				console.log('inside')
				// do some validation here?
				var url = $(this).val();
				url = url.replace(/http:\/\//g, '' );

				var properties = {
					link : {
						property : 'link_to',
						value : url,
						css : false
					}
				};
				_this.model.layerClass.layerControls.trigger( 'update' , [ properties ]);
				
				$(this).blur();
				return false;
			}
			else
			{
				return true;
			}
			
		});
		
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
		'<div class="layer-content inset-tray dark hidden">'+
			'<div id="controls" class="clearfix"></div>'+
			//'<br />'+
			'<div class="standard-layer-controls clearfix">'+
				'<div>'+
					'<input id="persist" type="checkbox" name="vehicle" value="persist" <%= persist %> /> <label for="persist">Persist layer to route</label>'+
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


var VisualLayerListViewCollection = Backbone.View.extend({

	el : $('#layers-list-visual'),
	
	initialize : function( options )
	{
		var _this = this;
		
		//make arrays to store the views in
		//this._renderedViews =[];
		
		this.collection.bind("add", function(layer) {
			// should draw the layer if it's in the node
			_this.add(layer);
		});
		
		this.collection.bind("remove", function(layer) {
			// should draw the layer if it's in the node
			_this.remove(layer);
		});

	},
	
	add : function ( layer )
	{
		var layerView = new VisualLayerListView({ model : layer });
		if( this.el.find('.alert-message') ) this.el.find('.alert-message').remove(); //this.el.empty();
		this.el.prepend( layerView.render().el );
		
	},
	
	remove : function(layer)
	{
		var viewToRemove = this; // _(this._layerViews.select(function(lv){return lv.model === model;}))[0];
		this._layerViews = _(this._layerViews).without(viewToRemove);
		
		Zeega.currentNode.noteChange();
	},
	
	
	render : function()
	{
		var _this = this;
		
		//this._renderedViews = [];
		this.el.empty();
		
		/*
		_.each( _this._renderedViews , function(view){
			$(this.el).append(view.render().el);
		});
		*/
	}

});



