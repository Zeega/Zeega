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
				if(layer.get('type') == 'Link' &&  layer.get('attr').to_frame != zeega.app.currentFrame.id)
				{
					var frame = zeega.app.project.frames.get(layer.get('attr').to_frame);
					console.log(frame)
					var optionString = "<li><a href='#'><img src='"+ frame.get('thumbnail_url')+"'/></a></li>";
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
			'click .layer-list-checkboxes li a' : 'selectFrame',
			
		},

		
		makeConnection : function()
		{
			this.hide();
			var checked = $(this.el).find('.layer-list-checkboxes input:checked');
			var selectedLayers = _.map( checked, function(input){ return parseInt( $(input).val() ) })
			zeega.app.connectToAdvanced(_.union([],selectedLayers))
			
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
					
					'<label class="checkbox"><input type="checkbox" value="next_frame"> next frame</label>'+
					'<label class="checkbox"><input type="checkbox" value="sequence"> this sequence</label>'+
					
					'linked frames</br>'+
					
					'<ul class="layer-list-checkboxes unstyled"></ul>'+
				'</div>'+
				'<div class="modal-footer">'+
					'<a href="#" class="btn close" >Cancel</a>'+
					'<a href="#" class="btn btn-success pull-right save">Make New Sequence</a>'+
				'</div>'+
			'</div>';
			
			return html
		},
});
	
})(zeega.module("modal"));