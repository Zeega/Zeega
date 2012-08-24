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
			this.renderToTarget();
			this.$el.find('#visual-editor-workspace').html( this.workspace.render().el );
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
			var _this = this;
			$(e.target).closest('div').removeClass('open');
			
			switch($(e.target).closest('a').data('action'))
			{
				case 'newFrame':
					var _this = this;
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
				case 'advanced':
					var Modal = zeega.module('modal');
					this.advancedModal = new Modal.Views.LinkAdvanced({model:this.model});
					$('body').append( this.advancedModal.render().el );
					this.advancedModal.show();
					
					this.model.on('connectToAdvanced', this.connectToAdvanced, this );
					
					break;
			}
			
			return false;
		},
		
		//// non-linear links //// connections
		confirmConnection : function(e)
		{
			console.log('$$		confirm connection', this, this.hold)
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
					console.log('$$		info', info, sequence)
					_this.hold.update(info)
					zeega.app.project.sequences.add(sequence);

					this.hold = null;
				}
			});
			return false;
		},


		connectToSequenceFrame : function( sequenceID, frameID )
		{
			zeega.app.addLayer({
				type : 'Link',
				options : {
					from_sequence : zeega.app.currentSequence.id,
					from_frame : this.model.id,
					to_sequence : sequenceID,
					to_frame : frameID
				}
			});
			this.model.off('connectToSequenceFrame');
		},

		connectToAdvanced : function( layerArray )
		{
			var _this = this;

			this.hold = zeega.app.addLayer({
				type : 'Link',
				options : {
					from_sequence : zeega.app.currentSequence.id,
					from_frame : this.model.id
				}
			});

			this.hold.on('layer_saved', function(){
				_this.hold.off('layer_saved');
				var layersToPersist = _.union( layerArray, [_this.hold.id] );

				var Sequence = zeega.module("sequence");
				var sequence = new Sequence.Model({ 'frame_id' : zeega.app.currentFrame.id, 'layers_to_persist' : layersToPersist });

				sequence.save({},{
					success : function()
					{
						_this.hold.setToFrame( sequence.id, sequence.get('frames')[0].id );
						_this.hold.visual.render();
						zeega.app.project.frames.add(sequence.get('frames'));
						sequence.set('frames', [ sequence.get('frames')[0].id ]);
						sequence.trigger('sync');
						zeega.app.goToSequence(sequence.id);
						_this.busy = false;
					}
				});
				zeega.app.project.sequences.add(sequence);
			})
			
			this.model.off('connectToAdvanced');
		},

/*
		finishConnection : function()
		{

			var _this = this;
			var layersToPersist = [this.hold.id];
			var Sequence = zeega.module("sequence");
			var sequence = new Sequence.Model({ 'frame_id' : zeega.app.currentFrame.id, 'layers_to_persist' : layersToPersist });

			sequence.save({},{
				success : function()
				{
					_this.hold.setToFrame( sequence.id, sequence.get('frames')[0].id );
					_this.hold.visual.render();
					//zeega.app.project.frames.add(sequence.get('frames'));
					//sequence.set('frames', [ sequence.get('frames')[0].id ]);
					//zeega.app.goToSequence(sequence.id);

					this.hold = null;
				}
			});
			zeega.app.project.sequences.add(sequence);
		},

*/
		
		getTemplate : function()
		{
			var html = 
					
					"<div class='top-bar clearfix'>"+
					
						"<div class='make-connection btn-group pull-left'>"+
							"<a data-action='newFrame' class='btn btn-inverse action' href='#'><img src='../../../images/multi-linear.png' height='15px'/></a>"+
							"<a class='btn btn-inverse dropdown-toggle' data-toggle='dropdown'><span class='caret'></span></a>"+
							"<ul class='dropdown-menu'>"+
								"<li><a data-action='newFrame' class='action' href='#'><i class='zicon-new-frame small'></i>  New Frame</a></li>"+
								"<li><a data-action='existingFrame' class='action' href='#'><i class='zicon-old-frame small'></i>  Existing Frame</a></li>"+
								"<li class='divider'></li>"+
								"<li><a data-action='advanced' class='action' href='#'><i class='zicon-options small'></i>  Advanced</a></li>"+
							"</ul>"+
						"</div>"+
						"<button data-action='ok' class='connection-confirm btn btn-success btn-small hide pull-left'>OK</button>"+
						
						"<div class='advance-controls'></div>"+
					"</div>"+
					
					"<div id='visual-editor-workspace' class='workspace clearfix'></div>";
					

			return html;
		}
	
	});

	
	Frame.Views.VisualWorkspace = Backbone.View.extend({
		
		id : 'visual-editor-workspace',
		
		initialize : function()
		{
			this.model.layers.on('add', this.onAddLayer, this );
			this.model.layers.on('remove', this.onRemoveLayer, this );
		},
		
		render : function()
		{
			//render each layer into the workspace // except links
			var _this = this;
			this.model.layers.each(function(layer){
				if( layer.get('attr').from_frame == _this.model.id ) _this.$el.append( layer.visual.render().el );
			});
			return this;
		},
		
		renderToTarget : function()
		{
			$('#'+this.id).replaceWith( this.render().el )
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
		},

		removeAllLayers : function()
		{
			this.model.layers.each(function(layer){ layer.visual.private_onLayerExit() })
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
		
		tagName : 'ul',
		id : 'layers-list-visual',
		target : '#layers-list-container',
		className : 'unstyled',

		initialize : function()
		{
			this.model.layers.on('add', this.onAddLayer, this );
			this.model.layers.on('remove', this.onRemoveLayer, this );
		},
		
		render : function()
		{
			this.makeSortable();
			return this;
		},
		
		makeSortable : function()
		{
			var _this = this;
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
					var linkOrder = _.map( $('#links-list>li'), function(layer){ return $(layer).data('id') });
					var layerOrder = _.map( $('#layers-list-visual>li'), function(layer){ return $(layer).data('id') });
					var order = linkOrder.concat(layerOrder).reverse();
					_this.model.sortLayers( order );
				}
			});
			$( "#sortable-layers" ).disableSelection();
		},
		
		renderToEditor : function()
		{
			var _this = this;
			$( this.target ).html( this.render().el );

			this.model.layers.each(function(layer){
				if( !_.isUndefined(layer) && layer.get('type') != 'Link' )
				{
					_this.$el.prepend( layer.controls.renderControls().el );
					layer.controls.delegateEvents();
				}
			})
		},

		onAddLayer : function( layer )
		{
			if(zeega.app.currentFrame == this.model && layer.get('type') != 'Link')
			{
				this.$el.prepend( layer.controls.renderControls().el );
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
		
		tagName : 'ul',
		id : 'links-list',
		target : '#link-list-container',
		className : 'unstyled',
		
		initialize : function()
		{
			this.model.layers.on('add', this.onAddLayer, this );
		},

		render : function()
		{
			var _this = this;
			this.model.layers.each(function(layer){
				if( !_.isUndefined(layer) && layer.get('type') == 'Link' && layer.get('attr').from_frame == _this.model.id && !_.isUndefined(layer.get('attr').to_frame) )
					_this.$el.prepend( layer.controls.renderControls().el );
			})
			this.makeSortable();
			return this;
		},
		
		makeSortable : function()
		{
			var _this = this;
			this.$el.sortable({
				//define a grip handle for sorting
				handle: '.layer-drag-handle',
				cursor : 'move',
				axis:'y',
				containment: '#sidebar',
				cursorAt : {top:1,left:1},
				placeholder: "ui-state-highlight",
				//resort the layers in the workspace too
				update : function(){ _this.model.updateLayerOrder() }
			});
			$( "#sortable-layers" ).disableSelection();
		},
		

		onAddLayer : function( layer )
		{
			if(zeega.app.currentFrame == this.model && layer.get('type') == 'Link')
			{
				this.$el.prepend( layer.controls.renderControls().el );
				layer.controls.delegateEvents();
			}
		},

		renderToEditor : function(){ $( this.target ).html( this.render().el ) },
		removeFromEditor : function(){}
		
	})
	

})(zeega.module("frame"));