var LayerView = Backbone.View.extend({
	tagName : 'li',
	
	
	initialize : function(options)
	{
			
		this.model.bind( 'change', function(){
			
			console.log('layer change!!');
		});
	},
	
	
	render : function() {

		this.model.bind('remove',this.remove);
		var that = this;
		var text = this.model.get('text');
		var type = this.model.get('type');
		
		//create the correct layer Child object
		eval( 'var layerClass = new '+ this.model.get('type')+'Layer();' );
		
		if( !this.model.get('attr') ) this.model.set({ attr : layerClass.defaultAttributes });
		
		var template = $('#layer-list-template')
			.clone()
			.attr('id', 'layer-edit-'+this.model.id );
		
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
		
			//set persistance
			$(this.el).find('#persist').change(function(){
				//console.log($(this).is(':checked') );
				if( $(this).is(':checked')){
					var layer = that.model;
					Zeega.persistLayerOverNodes(layer);
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
					that.workspacePreview.closeControls();
					return false;
				}else{
					//show layer controls
					$(this).find('span').removeClass('arrow-down').addClass('arrow-up');
					$(this).closest('li').find('.layer-content').show('blind',{'direction':'vertical'},function(){that.workspacePreview.openControls();});
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
					that.remove();
					//remove the workspace preview
					that.workspacePreview.remove();
				
					Zeega.removeLayerFromNode( Zeega.currentNode, that.model );
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
	el : $('#tab-layers ul')[0],
	
	initialize : function(){
		
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
		var that = this;
		
		//clear out any old stuff inside this.el
		$(this.el).empty();
		//add EACH model's view to the that.el and render it
		_.each(this._layerViews, function(layer){ $(that.el).append(layer.render().el) });
		
		return this;
	}
	
});