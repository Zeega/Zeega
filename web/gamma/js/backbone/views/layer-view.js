var LayerView = Backbone.View.extend({
	tagName : 'li',
	
	
	initialize : function(options)
	{
			
		this.model.bind( 'change', function(){
			
			console.log('layer change!!');
		});
	},
	
	//draws the controls
	render : function()
	{
		
		this.model.bind('remove',this.remove);
		var _this = this;
		var text = this.model.get('text');
		var type = this.model.get('type');
		
		//create the correct layer Child object
		eval( 'var layerClass = new '+ this.model.get('type')+'Layer();' );
		
		if( !this.model.get('attr') ) this.model.set({ attr : layerClass.defaultAttributes });
		
		var template = $(layerTemplate).attr('id', 'layer-edit-'+this.model.id );
		
		//shorten title if necessary
		if(this.model.get('attr').title != null && this.model.get('attr').title.length > 70)
		{
			var title = this.model.get('attr').title.substr(0,70)+"…";
		}else{
			var title = this.model.get('attr').title;
		}
		template.find('.layer-title').html( title );
		
		layerClass.load(this.model);

		if(Zeega.previewMode)
		{
			console.log('in preview mode');
			
			layerClass.drawPublish();
			
			var layerOrder = Zeega.currentNode.get('layers');
			layerClass.updateZIndex( _.size(layerOrder) - _.indexOf(layerOrder, this.model.id));
			
		}else{
			console.log('not in preview mode');

			layerClass.drawPreview();
		
			//set initial layer order in the workspace
			var layerOrder = Zeega.currentNode.get('layers');
			layerClass.updateZIndex( _.size(layerOrder) - _.indexOf(layerOrder, this.model.id));
		
			//insert the special layer controls into the template
			layerClass.drawControls(template);
			//save the layer element into the view object
			this.workspacePreview = layerClass;
		
			//label the li element so we can return something when sorting
			$(this.el).attr('id', 'layer-'+ this.model.id);
			$(this.el).html(template);
		
			
			//check or uncheck the layer persist box
				if( Zeega.route.get('attr') && Zeega.route.get('attr').persistLayers && _.include( Zeega.route.get('attr').persistLayers , _this.model.id ) )
				{
					$(this.el).find('#persist').attr('checked','true');
				}

			//set persistance action
			$(this.el).find('#persist').change(function(){
				var layer = _this.model;
				if( $(this).is(':checked')){
					Zeega.persistLayerOverNodes(layer);
				}else{
					Zeega.removeLayerPersist(layer);
				}
			});
		
		
		
			//	open/close and expanding layer items
			$(this.el).find('.layer-title').click(function(){
			
				//close all other open layers.
				//not working
				//console.log( $('#sortable-layers .open').find('.layer-expand').not( $(this)) );
				//$('#sortable-layers .open').find('.layer-expand').not( $(this)).closest('li').find('.layer-content').hide('blind',{'direction':'vertical'});
				//collapse all other layer controls
				if($(this).closest('li').hasClass("open")){
					//hide layer controls
					$(this).find('span').removeClass('arrow-up').addClass('arrow-down');
					$(this).closest('li').find('.layer-content').hide('blind',{'direction':'vertical'});
					$(this).closest('li').removeClass('open');
					_this.workspacePreview.closeControls();
					return false;
				}else{
					//show layer controls
					$(this).find('span').removeClass('arrow-down').addClass('arrow-up');
					$(this).closest('li').find('.layer-content').show('blind',{'direction':'vertical'},function(){_this.workspacePreview.openControls();});
					$(this).closest('li').addClass('open');
					return false;
				}
			});
		
			//delete this layer from the DB and view
			$(this.el).find('.delete-layer').click(function(){
				//verify you with alert
				var response = confirm('Delete Layer?');
				if(response)
				{
					//remove the layer controls
					_this.remove();
					//remove the workspace preview
					_this.workspacePreview.remove();
				
					Zeega.removeLayerFromNode( Zeega.currentNode, _this.model );
				}
				return false;
			});
		
		
		} //end if previewMode
		
		
		//	end jQuery interactions
		return this;
		
	}
});



var LayerViewCollection = Backbone.View.extend({
	//see the NodeViewCollection below for documentation
	el : $('#tab-layers').find('#sortable-layers'),
	
	initialize : function()
	{
		_(this).bindAll('add', 'remove');
		this._layerViews = [];
		this.collection.each(this.add);
		this.collection.bind('add',this.add);
		this.collection.bind('remove',this.remove);
		this.collection.bind('destroy', this.remove);
	},
	
	add : function ( layer )
	{
		layer.url = Zeega.url_prefix+'layers/'+ layer.id;
		
		var lv = new LayerView({ model : layer });
		this._layerViews.push(lv);
		if(this._rendered) $(this.el).prepend(lv.render().el);
	},
	
	remove : function(layer)
	{
		console.log('rmvCollection')
		
		var viewToRemove = this; // _(this._layerViews.select(function(lv){return lv.model === model;}))[0];
		this._layerViews = _(this._layerViews).without(viewToRemove);
		
		Zeega.currentNode.noteChange();
		
		//if(this._rendered) $(viewToRemove.el).remove();
		
	},
	
	
	render : function()
	{
		this._rendered = true;
		var _this = this;
		
		//clear out any old stuff inside this.el
		$(this.el).empty();
		//add EACH model's view to the _this.el and render it
		_.each(this._layerViews, function(layer){ $(_this.el).append(layer.render().el) });
		
		return this;
	}
	
});


var layerTemplate = '<div id="" class="layer-list clearfix">';
layerTemplate += 		'<div class="layer-uber-bar clearfix">';
layerTemplate += 			'<div class="layer-icon">';
layerTemplate += 				'<span class="asset-type-icon ui-icon ui-icon-pin-w"></span>';
layerTemplate += 			'</div>';
layerTemplate += 		'<div class="layer-title">Layer Name</div>';
layerTemplate += 		'<div class="layer-uber-controls">';
layerTemplate += 			'<span class="delete-layer ui-icon ui-icon-trash"></span>';
layerTemplate += 		'</div>';
layerTemplate += 		'<div class="layer-drag-handle">';
layerTemplate += 			'<span class="ui-icon ui-icon-grip-solid-horizontal"></span>';
layerTemplate += 		'</div>';
layerTemplate += 	'</div>';
layerTemplate += 	'<div class="hidden layer-content clearfix">';
layerTemplate += 		'<div id="controls"></div>';
layerTemplate += 		'<br />';
layerTemplate += 		'<form id="layer-persist">';
layerTemplate += 			'<input id="persist" type="checkbox" name="vehicle" value="persist" /> <label for="persist">Persist layer to route</label>';
layerTemplate += 		'</form>';
layerTemplate += 	'</div>';
layerTemplate += '</div>';

var iLayerTemplate = 	"<div id='i-layer-template' class='i-layer clearfix layer-wrapper'>";
iLayerTemplate +=			"<div class='i-layer-uber-bar clearfix' onclick='expandLayer(this);return false;'>";
iLayerTemplate +=				"<div class='layer-icon'>";
iLayerTemplate +=					"<span class='asset-type-icon ui-icon ui-icon-pin-w'></span>";
iLayerTemplate +=				"</div>";
iLayerTemplate +=				"<div class='i-layer-title'>Layer Name</div>";
iLayerTemplate +=				"<div class='i-layer-uber-controls'>";
iLayerTemplate +=					"<span class='i-layer-delete ui-icon ui-icon-trash' onclick='deleteLayer();return false;'></span>";
iLayerTemplate +=				"</div>";
iLayerTemplate +=			"</div>";
iLayerTemplate +=			"<div class='hidden layer-content clearfix'>";
iLayerTemplate +=				"<div id='controls'></div>";
iLayerTemplate +=				"<br />";
iLayerTemplate +=				"<form id='layer-persist'>";
iLayerTemplate +=					"<input id='persist' type='checkbox' name='vehicle' value='persist' /> <label for='persist'>Persist layer to route</label>";
iLayerTemplate +=				"</form>";
iLayerTemplate +=			"</div>";
iLayerTemplate +=		"</div>";
