/*

editor.view.frame.editor-workspace.js

backbone view

this is the view that each frame should draw in the editor which allows for the visual arrangement of
the frame's layers. It also includes common frame functions like adding sequence links and advance controls

*/

(function(Frame){

	Frame.Views.EditorWorkspace = Backbone.View.extend({

		id : 'workspace',
		
		isRendered : false,
		
		initialize : function()
		{
			
		},
		
		render : function()
		{
			this.$el.html( _.template(this.getTemplate(), this.model.toJSON()) );
			this.delegateEvents();
			return this;
		},

		renderToTarget : function(){ $('#'+this.id).html( this.render().el ) },
		
		renderToEditor : function()
		{
			this.workspace = new Frame.Views.VisualWorkspace({model:this.model});
			this.renderToTarget();
			this.$el.find('#visual-editor-workspace').html( this.workspace.render().el );
			this.workspace.onLayerEnter();
			this.initEvents();
		},
		removeFromEditor : function()
		{
			this.undelegateEvents();
			// call cleanup actions on frame layers if they exist
			this.workspace.removeAllLayers();
		},
		
		initEvents : function()
		{
			//enable the workspace as a valid drop location for DB items
			this.$el.find('#visual-editor-workspace').droppable({
				accept : '.database-asset-list',
				hoverClass : 'workspace-item-hover',
				tolerance : 'pointer',

				//this happens when you drop a database item onto a frame
				drop : function( event, ui )
				{
					ui.draggable.draggable('option','revert',false);
					zeega.app.addLayer({ item : zeega.app.draggedItem })
				}
			});
			this.$el.find('.advance-click').tooltip({
				title:'advance frame by click or arrow keys',
				placement:'bottom'
			});
			this.$el.find('.advance-time').tooltip({
				title:'advance frame by time only',
				placement:'bottom'
			});
		},
		
		events : {
			'click .advance-click' : 'selectAdvanceClick',
			'click .advance-time' : 'selectAdvanceTime',
			'click input' : 'selectAdvanceTime',
			'keypress input' : 'onAdvanceKeypress',
			'click #make-connection .action' : 'makeConnection',
			//'click #connection-confirm button' : 'confirmConnection',
			
		},
		
		
		
		selectAdvanceClick : function()
		{
			this.$el.find('.advance-click').addClass('active');
			this.$el.find('.advance-time').removeClass('active');
			this.$el.find('input').addClass('disabled').val('');
			
			this.saveAdvance( 0 );
			
			return false;
		},
		
		selectAdvanceTime : function()
		{
			this.$el.find('.advance-click').removeClass('active');
			this.$el.find('.advance-time').addClass('active');
			this.$el.find('input').removeClass('disabled').focus();
			return false;
		},
		
		onAdvanceKeypress : function(e)
		{
			if(e.which == 13)
			{
				//console.log('save this shizz', $(e.target).val() );
				this.saveAdvance( $(e.target).val() );
				this.$el.find('input').animate('highlight',{},'1500').blur();
				return false;
			}
		},
		
		saveAdvance : function( time )
		{
			//make sure the value is an actual number before saving
			var time = parseFloat(time*1000);
			if(_.isNumber(time)) this.model.update({ 'advance' : time });
		},
		
		//// non-linear links //// connections

		makeConnection : function( e )
		{
			if( !$(e.target).hasClass('disabled') )
			{
				$(e.target).closest('div').removeClass('open');
				zeega.app.makeConnection( $(e.target).closest('a').data('action') );
			}
			return false;
		},
		
		getTemplate : function()
		{
			var html = 
					
					"<div class='top-bar clearfix'>"+
						
						"<div id='make-connection' class='btn-group pull-left'>"+
							"<a data-action='newFrame' class='btn btn-inverse action' href='#'><img src='../../../images/multi-linear.png' height='15px'/></a>"+
							"<a class='btn btn-inverse dropdown-toggle' data-toggle='dropdown'><span class='caret'></span></a>"+
							"<ul class='dropdown-menu'>"+
								"<li><a data-action='newFrame' class='action' href='#'><i class='zicon-new-frame small'></i>  New Frame</a></li>"+
								"<li><a data-action='existingFrame' class='action' href='#'><i class='zicon-old-frame small'></i>  Existing Frame</a></li>"+
								"<li class='divider'></li>"+
								"<li><a data-action='advanced' class='action' href='#'><i class='zicon-options small'></i>  Advanced</a></li>"+
							"</ul>"+
						"</div>"+
/*						
						"<div id='connection-confirm' class='pull-left hidden'>"+
							"<button data-action='cancel' class='btn btn-danger btn-small'>Cancel</button>"+
							"<button data-action='ok' class='btn btn-success btn-small'>OK</button>"+
						"</div>"+
*/						
						"<div class='advance-controls'>"+
							"<div>Frame Advance</div>";
							
							if(this.model.get('attr').advance > 0)
							{
								html +=
								"<a href='#' class='advance-click'><i class='zicon-click zicon-white raise-up'></i></a><span class='dim'>|</span><a href='#' class='advance-time active'><i class='zicon-time zicon-white raise-up'></i></a>  "+
								"<input type='text' placeholder='sec' value='<%= attr.advance/1000 %>'/>";
							}
							else
							{
								html +=
								"<a href='#' class='advance-click active'><i class='zicon-click zicon-white raise-up'></i></a><span class='dim'>|</span><a href='#' class='advance-time'><i class='zicon-time zicon-white raise-up'></i></a>  "+
								"<input type='text' class='disabled' placeholder='sec'/>";
							}
							html +=
						"</div>"+
					"</div>"+
					
					"<div id='visual-editor-workspace' class='workspace clearfix'></div>";
					

			return html;
		}
	
	});

	
	Frame.Views.VisualWorkspace = Backbone.View.extend({
		
		id : 'visual-editor-workspace',
		
		initialize : function()
		{
		},
		
		render : function()
		{
			var _this = this;
			this.layers = _.map( this.model.get('layers'), function(layerID){
				var layer = zeega.app.project.layers.get(layerID);
				//do not include layer if it's a link in the destination frame
				if( _.isUndefined(layer) || (layer.get('type') == 'Link' && layer.get('attr').to_frame == _this.model.id )|| _.isUndefined( zeega.app.project.frames.get( layer.get('attr').to_frame ) ) ) return null;
				else return layer
			});
			//render each layer into the workspace
			_.each( _.compact(this.layers), function(layer){
				_this.$el.append( layer.visual.render().el );
			})
			return this;
		},
		
		renderToTarget : function()
		{
			$('#'+this.id).replaceWith( this.render().el );
		},
		
		onLayerEnter : function()
		{
			_.each( _.compact(this.layers), function(layer){
				layer.visual.private_onLayerEnter();
			})
		},
		
		
		addLayer : function( layer )
		{
			var _this = this;
			if(layer.isNew()) layer.on('layer_saved',function(e){
				_this.$el.append( layer.visual.render().el );
				layer.visual.private_onLayerEnter();
			})
			else layer.visual.private_onLayerEnter();
		},
		
		removeAllLayers : function()
		{
			_.each( _.compact(this.layers), function(layer){
				layer.visual.private_onLayerExit();
			})
		}
		
		
	})
	
	//move this elsewhere
	Frame.Views.EditorLayerList = Backbone.View.extend({
		
		tagName : 'ul',
		id : 'layers-list-visual',
		target : '#layers-list-container',
		className : 'unstyled',
		
		initialize : function()
		{
		},
		
		render : function()
		{
			var _this = this;
			// do this every time?
			this.layers = _.map( this.model.get('layers'), function(layerID){
				var layer = zeega.app.project.layers.get(layerID);
				if( !_.isUndefined(layer) && layer.get('type') != 'Link' ) return layer;
				else return null;
			});

			this.makeSortable();
			
			return this;
		},
		
		makeSortable : function()
		{
			this.$el.sortable({
				//define a grip handle for sorting
				handle: '.layer-drag-handle',
				cursor : 'move',
				axis:'y',
				containment: '#sidebar',
				cursorAt : {top:1,left:1},
				placeholder: "ui-state-highlight",

				//resort the layers in the workspace too
				update : function()
				{
					zeega.app.updateLayerOrder();
				}
			});
			$( "#sortable-layers" ).disableSelection();
		},
		
		renderToEditor : function()
		{
			var _this = this;
			$( this.target ).html( this.render().el );
			_.each( _.compact(this.layers), function(layer){
				_this.$el.prepend( layer.controls.renderControls().el );
				layer.controls.delegateEvents();
			})
		},
		
		addLayer : function( layer )
		{
			var _this = this;
			if(layer.isNew()) layer.on('layer_saved',function(e){
				_this.$el.prepend( layer.controls.renderControls().el );
				layer.controls.private_onLayerEnter();
			
			})
			else layer.controls.private_onLayerEnter();
			
		},
		
		removeFromEditor : function()
		{
			_.each( _.compact(this.layers), function(layer){
				layer.controls.private_onLayerExit();
			})
			this.$el.empty();
			//this.undelegateEvents()
		}
		
	})
	
	Frame.Views.EditorLinkLayerList = Backbone.View.extend({
		
		tagName : 'ul',
		id : 'links-list',
		target : '#link-list-container',
		className : 'unstyled',
		
		initialize : function()
		{
			console.log('editor link list', this)
		},
		
		render : function()
		{
			var _this = this;
			// do this every time?
			this.layers = _.map( this.model.get('layers'), function(layerID){
				var layer = zeega.app.project.layers.get(layerID);
				//single out only link layers on source frames
				if( !_.isUndefined(layer) && layer.get('type') == 'Link' && layer.get('attr').from_frame == _this.model.id && !_.isUndefined(layer.get('attr').to_frame) ) return layer;
				else return null;
			});
			console.log( 'layerssss',this.model.get('layers'),this.layers)
			//render each layer into the workspace
			_.each( _.compact(this.layers), function(layer){
				_this.$el.prepend( layer.controls.renderControls().el );
				layer.controls.delegateEvents();
			})
			
			this.makeSortable();
			
			return this;
		},
		
		makeSortable : function()
		{
			this.$el.sortable({
				//define a grip handle for sorting
				handle: '.layer-drag-handle',
				cursor : 'move',
				axis:'y',
				containment: '#sidebar',
				cursorAt : {top:1,left:1},
				placeholder: "ui-state-highlight",
				//resort the layers in the workspace too
				update : function(){ zeega.app.updateLayerOrder() }
			});
			$( "#sortable-layers" ).disableSelection();
		},
		
		renderToEditor : function(){ $( this.target ).html( this.render().el ) },
		removeFromEditor : function(){}
		
	})
	

})(zeega.module("frame"));