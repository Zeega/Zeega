(function(Modal) {

	
	Modal.Views.ContinueLayer = Backbone.View.extend({

		className : 'modal',
		
		initialize : function()
		{
			
		},
		
		render: function()
		{
			var _this = this;
			console.log('modal render!!!')
			$(this.el).html( this.getTemplate() );
			
			if(zeega.app.currentFrame.get('layers').length < 1 ) $(_this.el).find('.layer-list-checkboxes').append('there are no layers on this frame to continue. Press the "Make New Sequence" button to continue with a blank sequence.')
			_.each( zeega.app.currentFrame.get('layers'), function(layerID){
				var layer = zeega.app.project.layers.get(layerID);
				if(layer.get('type') == 'Link' &&  layer.get('attr').from_frame == zeega.app.currentFrame.id)
				{
					console.log('this frame has links!!')
					var frame = zeega.app.project.frames.get(layer.get('attr').to_frame);
					console.log(frame)
					var optionString = "<li data-id='"+frame.id+"'><a href='#'><img src='"+ frame.get('thumbnail_url')+"'/></a></li>";
					$(_this.el).find('.layer-list-checkboxes').append(optionString)
				}
			})

			return this;
		},
		
		show : function()
		{
			this.$el.modal('show');
		},
		
		hide : function()
		{
			this.$el.modal('hide');
			zeega.app.busy = false;
		},
		
		events : {
			'click .close' : 'hide',
			'click .save' : 'makeConnection',
			'click .layer-list-checkboxes li' : 'selectFrame',
		},

		
		makeConnection : function()
		{
			this.hide();
			var _this = this;
			_.each( $(this.el).find('.layer-list-checkboxes li.selected'), function(frame){
				var frame = zeega.app.project.frames.get( $(frame).data('id') );
				var framelayers = frame.get('layers');
				framelayers.push(_this.model.id);
				frame.save({ layers : framelayers });
			})
			if( $(this.el).find('#continue-sequence').is(':checked') )
			{
				zeega.app.continueOnAllFrames( this.model.id )
				return false; // prevents activation of continue to next frame which would be redundant
			}
			if( $(this.el).find('#continue-next-frame').is(':checked') ) zeega.app.continueLayerToNextFrame( this.model.id );

			return false;
		},
		
		selectFrame : function(e)
		{
			$(e.target).toggleClass('selected');
			return false;
		},
	
		getTemplate : function()
		{


			var html =
			
			'<div class="modal" id="sequence-modal">'+
				'<div class="modal-header">'+
					'<button class="close">×</button>'+
				'</div>'+
				'<div class="modal-body">'+
					'<h3>Continue this layer to</h3>'+
					
					'<label class="checkbox"><input id="continue-next-frame" type="checkbox" value="next_frame"> next frame</label>'+
					'<label class="checkbox"><input id="continue-sequence" type="checkbox" value="sequence"> this sequence</label>'+
					
					'linked frames</br>'+
					
					'<ul class="layer-list-checkboxes unstyled"></ul>'+
				'</div>'+
				'<div class="modal-footer">'+
					'<a href="#" class="btn close" >Cancel</a>'+
					'<a href="#" class="btn btn-success pull-right save">Go</a>'+
				'</div>'+
			'</div>';
			
			return html
		},
});
	
})(zeega.module("modal"));