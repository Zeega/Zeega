/*

editor.view.frame.editor-workspace.js

backbone view

this is the view that each frame should draw in the editor which allows for the visual arrangement of
the frame's layers. It also includes common frame functions like adding sequence links and advance controls

*/

(function(Frame){


	/*
		the wrapper view for the visual workspace
	*/

	Frame.Views.EditorWorkspace = Backbone.View.extend({

		id : 'workspace',
		
		isRendered : false,
		
		initialize : function(){},
		
		render : function()
		{
			this.$el.html( _.template(this.getTemplate(), this.model.toJSON()) );
			
			this.advanceControls = new Frame.Views.FrameAdvanceControls({model:this.model});
			this.$el.find('.advance-controls').replaceWith( this.advanceControls.render().el );
			
			this.delegateEvents();
			return this;
		},

		renderToTarget : function(){ $('#'+this.id).html( this.render().el ) },
		
		renderToEditor : function()
		{
			this.workspace = new Frame.Views.VisualWorkspace({model:this.model});

			this.workspace.render();

			this.renderToTarget();
			//this.$el.find('#visual-editor-workspace').html( this.workspace.render().el );
			this.workspace.onLayerEnter();
			this.initEvents();
		},
		removeFromEditor : function()
		{
			this.advanceControls.removeFromEditor()
			this.undelegateEvents();
			// call cleanup actions on frame layers if they exist
			this.workspace.removeAllLayers();
		},
		
		initEvents : function()
		{
			//enable the workspace as a valid drop location for DB items
			var _this = this;
			this.$el.find('#visual-editor-workspace').droppable({
				accept : '.database-asset-list',
				hoverClass : 'workspace-item-hover',
				tolerance : 'pointer',

				//this happens when you drop a database item onto a frame
				drop : function( event, ui )
				{
					ui.draggable.draggable('option','revert',false);
					_this.model.addItemLayer( zeega.app.draggedItem );
				}
			});
		},
		
		events : {
			'click .make-connection .action' : 'onClickConnection',
			'click .connection-confirm' : 'confirmConnection',
		},
		
		onClickConnection : function(e)
		{
			if(this.busy != true)
			{
				var _this = this;
				$(e.target).closest('div').removeClass('open');
				this.$el.find('.make-connection>a').addClass('disabled');
				this.model.on('cancel_connection', this.cancelConnection, this);

				this.busy = true;

				switch($(e.target).closest('a').data('action'))
				{
					case 'newFrame':
						var fromInfo = {
							from_sequence : zeega.app.currentSequence.id,
							from_frame : _this.model.id
						}

						this.hold = this.model.addLayerByType('Link', fromInfo );
						
						if(this.hold.isNew())
						{
							this.hold.on('sync', function(){
								_this.hold.off('sync');
								_this.$el.find('.connection-confirm').show()
							});
						}
						else this.$el.find('.connection-confirm').show();
						break;
					case 'existingFrame':
						var Modal = zeega.module('modal');
						this.linkModal = new Modal.Views.LinkExisting({model:this.model});
						$('body').append( this.linkModal.render().el);
						this.linkModal.show();
						
						this.model.on('connectToSequenceFrame', this.connectToSequenceFrame,this );
						
						break;
				}
			}
			
			return false;
		},
		
		/*
			make a connection to a new sequence
		*/

		confirmConnection : function(e)
		{
			var _this = this;
			var Sequence = zeega.module("sequence");
			var sequence = new Sequence.Model({ 'frame_id' : zeega.app.currentFrame.id, 'layers_to_persist' : [this.hold.id] });

			this.$el.find('.connection-confirm').hide();

			sequence.save({},{
				success : function()
				{
					sequence.onSaveNew();
					var info = {
						to_sequence : sequence.id,
						to_frame : sequence.get('frames')[0]
					}
					_this.hold.update(info)
					_this.hold.trigger('update_link')
					zeega.app.project.sequences.add(sequence);

					this.hold = null;
				}
			});

			this.busy = false;
			this.$el.find('.make-connection>a').removeClass('disabled');

			return false;
		},

		connectToSequenceFrame : function( sequenceID, frameID )
		{
			var attr = {
				from_sequence : zeega.app.currentSequence.id,
				from_frame : this.model.id,
				to_sequence : sequenceID,
				to_frame : frameID
			};
			var hold = this.model.addLayerByType('Link', attr );
			
			zeega.app.project.frames.get(attr.to_frame).layers.push(hold);
			this.busy = false;
			this.$el.find('.make-connection>a').removeClass('disabled');
			this.model.off('connectToSequenceFrame');
		},

		cancelConnection : function()
		{
			this.hold = null;
			this.busy = false;
			this.$el.find('.make-connection>a').removeClass('disabled');
		},
		
		getTemplate : function()
		{
			var html = 
					
					"<div class='top-bar clearfix'>"+
					
						"<div class='make-connection btn-group pull-left'>"+
							"<a data-action='newFrame' class='btn btn-inverse action' href='#'><img src='../../../images/multi-linear.png' height='15px'/></a>"+
							"<a class='btn btn-inverse dropdown-toggle' data-toggle='dropdown'><span class='caret'></span></a>"+
							"<ul class='dropdown-menu'>"+
								"<li><a data-action='newFrame' class='action' href='#'><i class='zicon-new-frame small'></i>  Link to New Frame</a></li>"+
								"<li><a data-action='existingFrame' class='action' href='#'><i class='zicon-old-frame small'></i>  Link to Existing Frame</a></li>"+
							"</ul>"+
						"</div>"+
						"<button data-action='ok' class='connection-confirm btn btn-success btn-small hide pull-left'>OK</button>"+
						
						"<div class='advance-controls'></div>"+
					"</div>"+
					
					"<div id='visual-editor-workspace' class='workspace clearfix'></div>";
					

			return html;
		}
	
	});

	Frame.Views.DetailBar = Backbone.View.extend({

		target : '#zeega-project-frame-detail-bar',

		initialize : function()
		{
			this.setElement( $(this.target) );
		},

		render : function()
		{
			this.$el.html( _.template(this.getTemplate(),this.model.toJSON()));
			return this;
		},

		getTemplate : function()
		{
			var html = 

				"<ul class='pull-left'>"+

					"<li><a href='#'><i class='icon-leaf icon-white'></i></a></li>"+
					"<li><a href='#'><i class='icon-plane icon-white'></i></a></li>"+
					"<li class='spacer'></li>"+
					"<li><a href='#'><i class='icon-file icon-white'></i></a></li>"+

				"</ul>";

			return html;
		}

	})



	
	Frame.Views.VisualWorkspace = Backbone.View.extend({
		
		//id : 'visual-editor-workspace',
		target : '#zeega-frame-workspace',
		
		initialize : function()
		{
			this.setElement( $(this.target) );
			this.model.layers.on('add', this.onAddLayer, this );
			this.model.layers.on('remove', this.onRemoveLayer, this );
		},
		
		render : function()
		{
			console.log('##		render the workspace', this)
			//render each layer into the workspace // except links
			var _this = this;

			var layersToRender = this.model.layers.filter(function(layer){
				if( layer.get('type') != 'Link' ) return true;
				if( layer.get('attr').from_frame == _this.model.id ) return true;
			})

			_.each( layersToRender, function(layer){
				_this.$el.append( layer.visual.render().el );
			});

			this.onLayerEnter();
			this.makeDroppable();
			return this;
		},

		makeDroppable : function()
		{
			var _this = this;
			this.$el.droppable({
				accept : '.database-asset-list',
				hoverClass : 'workspace-item-hover',
				tolerance : 'pointer',

				//this happens when you drop a database item onto a frame
				drop : function( event, ui )
				{
					ui.draggable.draggable('option','revert',false);
					_this.model.addItemLayer( zeega.app.draggedItem );
				}
			});
		},

		unrender : function()
		{
			this.model.layers.each(function(layer){ layer.visual.private_onLayerExit() })
		},
		
		onLayerEnter : function()
		{
			this.model.layers.each(function(layer){ layer.visual.private_onLayerEnter() })
		},
		
		onAddLayer : function( layer )
		{
			if(zeega.app.currentFrame == this.model)
			{
				this.$el.append( layer.visual.render().el );
				layer.visual.private_onLayerEnter();
			}
		},

		onRemoveLayer : function( layer )
		{
			if(zeega.app.currentFrame == this.model) layer.visual.private_onLayerExit()
		}
	})
	
	Frame.Views.FrameAdvanceControls = Backbone.View.extend({
		
		className : 'advance-controls',
		
		initialize : function(){},
		
		render : function()
		{
			var _this = this;
			
			this.$el.html( _.template(this.getTemplate(),this.model.toJSON()) );
			
			this.$el.find('.advance-click').tooltip({
				title:'advance frame by click or arrow keys',
				placement:'bottom'
			});
			this.$el.find('.advance-time').tooltip({
				title:'advance frame by time only',
				placement:'bottom'
			});
			
			return this;
		},

		removeFromEditor : function()
		{
			this.saveAdvance( this.$el.find('input').val() );
		},

		events : {
			'click .advance-click' : 'selectAdvanceClick',
			'click .advance-time' : 'selectAdvanceTime',
			'click input' : 'selectAdvanceTime',
			'keypress input' : 'onAdvanceKeypress'
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
				this.saveAdvance( $(e.target).val() );
				this.$el.find('input').animate('highlight',{},'1500').blur();
				return false;
			}
		},
		
		saveAdvance : function( time )
		{
			//make sure the value is an actual number before saving and that it's not saving dupe data
			var time = parseFloat(time*1000);
			if(_.isNumber(time) && this.model.get('attr').advance != time ) this.model.update({ 'advance' : time });
		},
		
		getTemplate : function()
		{
			var html = 

				"<div>Frame Advance</div>";
				
				if(this.model.get('attr').advance > 0)
				{
					html +=
					"<a href='#' class='advance-click'><i class='zicon-click zicon-white raise-up'></i></a><span class='dim'>|</span>"+
					"<a href='#' class='advance-time active'><i class='zicon-time zicon-white raise-up'></i></a>  <input type='text' placeholder='sec' value='<%= attr.advance/1000 %>'/>";
				}
				else
				{
					html +=
					"<a href='#' class='advance-click active'><i class='zicon-click zicon-white raise-up'></i></a><span class='dim'>|</span>"+
					"<a href='#' class='advance-time'><i class='zicon-time zicon-white raise-up'></i></a>  <input type='text' class='disabled' placeholder='sec'/>";
				}
					
			return html;
		}
		
	})


	
	//move this elsewhere
	Frame.Views.EditorLayerList = Backbone.View.extend({
		
//		tagName : 'ul',
		target : '#zeega-layer-list',

		initialize : function()
		{
			this.setElement( $(this.target) );
			this.model.layers.on('add', this.onAddLayer, this );
			this.model.layers.on('remove', this.onRemoveLayer, this );
		},
		
		render : function()
		{
			var _this = this;

			this.$el.html('<ul class="list">');
			this.model.layers.each(function(layer){
				if( !_.isUndefined(layer) && layer.get('type') != 'Link' )
				{
					_this.$el.find('.list').prepend( layer.controls.renderControls().el );
					layer.controls.delegateEvents();
				}
			})
			this.makeSortable();
			return this;
		},
		
		makeSortable : function()
		{
			var _this = this;
			this.$el.find('.list').sortable({
				cursor : 'move',
				axis:'y',
				containment: 'parent',
				tolerance: 'pointer',
				update : function()
				{
					var linkOrder = _.map( _this.$el.find('.list>li'), function(layer){ return $(layer).data('id') });
					var layerOrder = _.map( _this.$el.find('.list>li'), function(layer){ return $(layer).data('id') });
					var order = linkOrder.concat(layerOrder).reverse();
					_this.model.sortLayers( order );
				}
			});
			this.$el.find('.list').disableSelection();
		},

		onAddLayer : function( layer )
		{
			if(zeega.app.currentFrame == this.model && layer.get('type') != 'Link')
			{
				this.$el.find('.list').prepend( layer.controls.renderControls().el );
				layer.controls.delegateEvents();
			}
		},

		onRemoveLayer : function( layer )
		{
			if(zeega.app.currentFrame == this.model)
			{
				layer.controls.private_onLayerExit();
				layer.controls.remove();
			}
		},
		
		removeFromEditor : function()
		{
			this.model.layers.each(function(layer){ layer.controls.private_onLayerExit() });
			this.$el.empty();
		}
		
	})
	
	Frame.Views.EditorLinkLayerList = Backbone.View.extend({
		

		target : '#zeega-link-list',
		
		initialize : function()
		{
			this.setElement( $(this.target) );
			this.model.layers.on('add', this.onAddLayer, this );
		},

		render : function()
		{
			console.log('$$		render link layers', this)
			var _this = this;
			this.$el.html('<ul class="list">');
			this.model.layers.each(function(layer){
				if( !_.isUndefined(layer) && layer.get('type') == 'Link' && layer.get('attr').from_frame == _this.model.id && !_.isUndefined(layer.get('attr').to_frame) )
				{
					_this.$el.find('.list').prepend( layer.controls.renderControls().el );
					layer.controls.delegateEvents();
				}
			})
			this.makeSortable();
			return this;
		},
		
		makeSortable : function()
		{
			var _this = this;
			this.$el.find('.list').sortable({

				cursor : 'move',
				axis:'y',
				containment: 'parent',
				cursorAt : {top:1,left:1},
				tolerance: 'pointer',
				update : function(){ _this.model.updateLayerOrder() }
			});
			this.$el.find('.list').disableSelection();
		},
		
		onAddLayer : function( layer )
		{
			if(zeega.app.currentFrame == this.model && layer.get('type') == 'Link')
			{
				this.$el.prepend( layer.controls.renderControls().el );
				layer.controls.delegateEvents();
			}
		}
		
	})
	

})(zeega.module("frame"));