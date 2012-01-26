var NodeView = Backbone.View.extend({
		
	initialize : function()
	{
		this.model.bind( 'change:thumb_url', this.onNewThumb, this );
	},
	
	render: function()
	{
		var _this = this;
	
		var blanks = {
			nodeID : this.model.id,
			thumbURL : this.model.get('thumb_url')
		}
		var template = _.template( this.getTemplate() );
		
		this.el = $( template(blanks) );

		//node droppable stuff
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

			//this happens when you drop a database item onto a node
			drop : function( event, ui )
			{
				
				ui.draggable.draggable('option','revert',false);
				//make the new layer model
				
				var settings = {
					url: Zeega.url_prefix + 'nodes/'+ _this.model.id +'/layers',
					type: Zeega.draggedItem.get('source'),
//					zIndex: Zeega.currentNode.get('layers').length+1,
					attr: {
						'item_id' : Zeega.draggedItem.id,
						'title' : Zeega.draggedItem.get('title'),
						'url' : Zeega.draggedItem.get('uri'),
					}
				};
				var newLayer = new Layer( settings );
				
				Zeega.addLayerToNode(_this.model,newLayer, this);
				
			}
		});


		$(this.el).hover(function(){
			$(_this.el).find('.frame-menu').show();
		},function(){
			$(_this.el).find('.menu-items').removeClass('open');
			$(_this.el).find('.frame-menu').hide();
		})

		$(this.el).click(function(){
			_this.goToNode();
		})
		
		$(this.el).find('.menu-toggle').click(function(){
			_this.openDropdown();
		})
		
		$(this.el).find('.menu-items a').click(function(){

			event.stopPropagation();
			
			switch($(this).data('action'))
			{
				case 'delete':
					Zeega.destroyNode(_this);
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
				//only highlight the node if something is being dragged into it
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
	
	goToNode : function()
	{
		console.log('goto node')
		Zeega.loadNode(this.model);
		return false;
	},
	
	onNewThumb : function()
	{
		var _this = this;
		//Update thumbnail in route display
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
			
			"<li id='frame-thumb-<%= nodeID %>' class='frame-thumb' style='background-image:url(\"<%= thumbURL %>\")'>"+
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


var NodeViewCollection = Backbone.View.extend({
	//set the location where the nodes are to be drawn
	el : $('#frame-list'),
	
	initialize : function()
	{
		
		//	bind add & remove actions
		_(this).bindAll('add','remove');
		
		//create empty _nodeViews array
		this._nodeViews = [];
		
		//	add each node to the view
		this.collection.each(this.add);
		
		//	bind the view to the add & remove events of the collection
		this.collection.bind('add', this.add);
		this.collection.bind('remove', this.remove);
		
	},
	
	add : function(node)
	{
		var _this = this;
		node.url = Zeega.url_prefix+'nodes/'+ node.id;
				
		
		_(Zeega.route.nodes).push(node);
		
		console.log(node)
		
		//save node if the layer is new!
		if( node.isNew() )
		{
			
			node.url = Zeega.url_prefix+'routes/'+ Zeega.routeID +'/nodes';
			//if(Zeega.currentNode) node.set({'attr':{'editorHidden':Zeega.currentNode.get('attr').editorHidden}});
			

			node.save(
				{},
				{
					success : function( savedNode )
					{
						
						savedNode.url = Zeega.url_prefix+'nodes/'+ node.id;
						//must do this after success to capture the new id!!
						
						
						
						
						if(node.dupe) 
						{
							console.log('dupe node id: '+savedNode.id+'. insert at: '+ node.frameIndex)
							console.log(savedNode);
							
							_this.insertView(new NodeView({ model : node }), node.frameIndex );
							
						}
						else
						{
							console.log('BLANK NODE')
							_this.insertView(new NodeView({ model : node }));
						
							//add persisting layers to new nodes
							var persistLayers = Zeega.route.get('attr').persistLayers;
							_.each(persistLayers,function(layerID){
								Zeega.addLayerToNode( node, Zeega.route.layers.get(layerID) );
							});
							//add a new current node style
							$('.node-thumb-'+Zeega.currentNode.id).addClass('node-selected');
						
							//go to the new node
							Zeega.loadNode(node);
						}
						
						
					}
				}
				
			);
			
			
			
				
		}else{
			this.insertView(new NodeView({ model : node }));
		}
		
	},
	
	insertView : function( view, index )
	{
		
		console.log('insertView index: '+ index )
		//	push the nodeView to the collection
		//should be placed after the current node
		this._nodeViews.push(view);
		//	if already rendered
		//	append to the rendered view
		if (this._rendered) 
		{
			console.log( $(this.el).children('li:eq('+index+')') );
			if( _.isUndefined(index) ) $(this.el).append(view.render().el);
			else $(this.el).children('li:eq('+index+')').after(view.render().el);
			
			//call re-sort
			Zeega.nodeSort()
		}
	},
	
	render : function()
	{
		this._rendered = true;
		var _this = this;
		
		//clear out any old stuff inside this.el
		$(this.el).empty();
		//add EACH model's view to the _this.el and render it
		_(this._nodeViews).each(function(node){
			$(_this.el).append(node.render().el);
		});
		
		console.log('renderNodes');

		return this;
	}
	
});