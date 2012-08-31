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

	Frame.Views.DetailBar = Backbone.View.extend({

		target : '#zeega-project-frame-detail-bar',

		render : function()
		{
			this.setElement( $(this.target) );
			this.$el.html( _.template(this.getTemplate(),this.model.toJSON()));
			return this;
		},

		events : {
			'click #link-new-sequence' : 'linkToNewFrame',
			'click #link-existing-sequence' : 'linkToExistingFrame',
			'click #link-confirm' : 'confirmConnection',

			'click #advance-manual' : 'selectAdvanceClick',
			'click #advance-timed' : 'selectAdvanceTime',
			'click input' : 'selectAdvanceTime',
			'keypress input' : 'onAdvanceKeypress'
		},

		linkToNewFrame : function()
		{
			if(this.busy != true)
			{
				var _this = this;
				this.busy = true;

				this.$el.find('#link-new-sequence,#link-existing-sequence').addClass('disabled');
				var fromInfo = {
					from_sequence : zeega.app.currentSequence.id,
					from_frame : _this.model.id
				}

				this.hold = this.model.addLayerByType('Link', fromInfo );
				
				if(this.hold.isNew())
				{
					this.hold.on('sync', function(){
						_this.hold.off('sync');
						_this.$el.find('#link-confirm').css('display','block');
					});
				}
				else this.$el.find('#link-confirm').css('display','block');
				
			} //busy
			return false;
		},

		linkToExistingFrame : function()
		{
			if(this.busy != true)
			{
				var Modal = zeega.module('modal');
				this.linkModal = new Modal.Views.LinkExisting({model:this.model});
				$('body').append( this.linkModal.render().el );
				this.linkModal.show();
				
				this.model.on('connectToSequenceFrame', this.connectToSequenceFrame,this );
			} //busy
			return false;
		},

		showConnectionConfirm : function()
		{
			console.log('%%		show connection confirm')
			this.hold.off('sync', this.showConnectionConfirm);
			this.$el.find('.connection-confirm').show();
		},

		hideConnectionConfirm : function()
		{
			this.$el.find('.connection-confirm').hide()
		},
		
		/*
			make a connection to a new sequence
		*/

		confirmConnection : function(e)
		{
			var _this = this;
			var Sequence = zeega.module("sequence");
			var sequence = new Sequence.Model({ 'frame_id' : zeega.app.currentFrame.id, 'layers_to_persist' : [this.hold.id] });

			this.$el.find('#link-confirm').hide();
			sequence.on('sync', this.onSequenceSave, this);
			sequence.save();

			this.busy = false;
			this.$el.find('#link-new-sequence,#link-existing-sequence').removeClass('disabled');

			return false;
		},

		onSequenceSave : function( sequence )
		{
			sequence.off('sync', this.onSequenceSave );
			sequence.onSaveNew();
			var info = {
				to_sequence : sequence.id,
				to_frame : sequence.get('frames')[0]
			}
			this.hold.update(info)
			this.hold.trigger('update_link')
			zeega.app.project.sequences.add(sequence);

			this.hold = null;
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
			this.$el.find('#link-new-sequence,#link-existing-sequence').removeClass('disabled');
			this.model.off('connectToSequenceFrame');
		},

		// advance stuffs

		selectAdvanceClick : function()
		{
			this.$el.find('#advance-manual').removeClass('disabled');
			this.$el.find('#advance-timed').addClass('disabled');
			this.$el.find('input').addClass('disabled').val('');
			
			this.saveAdvance( 0 );
			return false;
		},
		
		selectAdvanceTime : function()
		{
			this.$el.find('#advance-manual').addClass('disabled');
			this.$el.find('#advance-timed').removeClass('disabled');
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

		onExit : function()
		{
			if(this.hold)
			{
				this.model.layers.remove( this.hold );
				this.hold = null;
				this.busy = false;
			}
			this.saveAdvance( this.$el.find('input').val() );
			this.undelegateEvents();
		},

		getTemplate : function()
		{
			var html = 

				"<ul id='link-controls' class='pull-left'>"+
					"<li><a id='link-new-sequence' href='#'><div class='menu-verbose-title'>Link to New Frame</div><i class='icon-check icon-white'></i></a></li>"+
					"<li><a id='link-existing-sequence' href='#'><div class='menu-verbose-title'>Link to Existing Frame</div><i class='icon-random icon-white'></i></a></li>"+
					"<li><a id='link-confirm' href='#'><div class='menu-verbose-title'>Confirm</div><i class='icon-ok-sign icon-white'></i></a></li>"+
				"</ul>"+
				"<ul id='advance-controls' class='pull-right'>";

				if(this.model.get('attr').advance > 0)
				{
					html +=
						"<li><a id='advance-manual' class='disabled' href='#'><div class='menu-verbose-title'>Manual Advance</div><i class='icon-hand-up icon-white'></i></a></li>"+
						"<li><a id='advance-timed' href='#'><div class='menu-verbose-title'>Timed Advance</div><i class='icon-time icon-white'></i></a></li>"+
						"<li><input type='text' placeholder='sec' value='<%= attr.advance/1000 %>'/></li>"+
					"</ul>";
				}
				else
				{
					html +=
						"<li><a id='advance-manual' href='#'><div class='menu-verbose-title'>Manual Advance</div><i class='icon-hand-up icon-white'></i></a></li>"+
						"<li><a id='advance-timed' class='disabled' href='#'><div class='menu-verbose-title'>Timed Advance</div><i class='icon-time icon-white'></i></a></li>"+
						"<li><input type='text' class='disabled' placeholder='sec'/></li>"+
					"</ul>";
				}

			return html;
		}

	})


	
	Frame.Views.VisualWorkspace = Backbone.View.extend({
		
		//id : 'visual-editor-workspace',
		target : '#zeega-frame-workspace',
		
		initialize : function()
		{
			this.model.layers.on('add', this.onAddLayer, this );
			this.model.layers.on('remove', this.onRemoveLayer, this );
		},
		
		render : function()
		{
			//render each layer into the workspace // except links
			var _this = this;
			this.setElement( $(this.target) );
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
	
	//move this elsewhere to another file ?
	Frame.Views.EditorLayerList = Backbone.View.extend({
		
//		tagName : 'ul',
		target : '#zeega-layer-list',

		initialize : function()
		{
			this.model.layers.on('add', this.onAddLayer, this );
			this.model.layers.on('remove', this.onRemoveLayer, this );
		},
		
		render : function()
		{
			var _this = this;
			this.setElement( $(this.target) );
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
			this.model.layers.on('add', this.onAddLayer, this );
		},

		render : function()
		{
			var _this = this;
			this.setElement( $(this.target) );
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
				this.$el.find('.list').prepend( layer.controls.renderControls().el );
				layer.controls.delegateEvents();
			}
		}
		
	})
	

})(zeega.module("frame"));