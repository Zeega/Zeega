/************************************

	LINK LAYER CHILD CLASS

************************************/
(function(Layer){

	Layer.Link = Layer.Model.extend({

		layerType : 'Link',
		
		defaultAttributes : {
			'title' : 'Link Layer',
			'to_sequence' : null,
			'from_sequence' : null,
			'to_frame' : null,
			'from_frame' : null,
			'left' : 25,
			'top' : 25,
			'height' : 50,
			'width' : 50
		},
		
		init : function()
		{
			if( this.isNew() )
			{
				this.get('attr').from_frame = zeega.app.currentFrame.id;
				this.get('attr').from_sequence = zeega.app.currentSequence.id;
			}
		},
		
		setToFrame : function(sequenceID, frameID)
		{
			this.get('attr').to_sequence = sequenceID;
			this.get('attr').to_frame = frameID;
			this.save();
		}
		
	});
	
	Layer.Views.Controls.Link = Layer.Views.Controls.extend({
		
		render : function()
		{
			$(this.el).remove();
			return this;
		}
		
	});

	Layer.Views.Visual.Link = Layer.Views.Visual.extend({
		
		render : function()
		{
			var _this = this;
			
			
			
			var style = {
				'height' : this.model.get('attr').height +'%',
				'cursor' : 'pointer',
				'border' : '2px dashed red',
				'border-radius' : '6px',
				'z-index' : 100
			}
			$(this.el).html( this.getTemplate() ).css( style );
			
			this.model.trigger('ready',this.model.id)
			
			return this;
		},
		
		events : {
			'click .go-to-sequence' : 'goToSequenceFrame',
			'click .delete-link' : 'deleteLink',
			'mousedown .show-controls' : 'showControls'
		},
		
		goToSequenceFrame : function()
		{
			console.log('go to the new Sequence!!!');
			console.log(this.model)
			if(zeega.app.previewMode) zeega.app.player.goToSequenceFrame(this.model.get('attr').to_sequence, this.model.get('attr').to_frame);
			else zeega.app.router.navigate("editor/sequence/"+this.model.get('attr').to_sequence+"/frame/"+this.model.get('attr').to_frame,{trigger:true})
		},
		
		deleteLink : function(e)
		{
			if( confirm('delete link?') )
			{
				this.model.trigger('editor_removeLayerFromFrame', this.model);
				this.remove();
			}
		},
		
		showControls : function(e)
		{
			
		},
		
		onLayerEnter : function()
		{
			
			if(this.model.get('attr').from_frame == zeega.app.currentFrame.id)
			{
				var _this = this;

				this.delegateEvents();
				this.$el.resizable({
					stop: function(e,ui)
					{
						console.log('save this bad boy')
						_this.model.update({
							'width' : $(this).width() / $(this).parent().width() * 100,
							'height' : $(this).height() / $(this).parent().height() * 100
						})
					}
				})
			}
			
		},
		
		getTemplate : function()
		{
			var html =
			
				'<i class="icon-remove delete-link"></i>'+
				'<i class="icon-share go-to-sequence"></i>';
			
			return html;
		}
		
		
	});
	
})(zeega.module("layer"));