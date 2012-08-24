(function(Modal) {

	
	Modal.Views.LinkAdvanced = Backbone.View.extend({
		
		initialize : function(){},
		
		render: function()
		{
			var _this = this;
			$(this.el).html( this.getTemplate() );
			
			if(zeega.app.currentFrame.get('layers').length < 1 ) $(_this.el).find('.layer-checkbox-list').append('there are no layers on this frame to continue. Press the "Make New Sequence" button to continue with a blank sequence.')
			_.each( zeega.app.currentFrame.get('layers'), function(layerID){
				var layer = zeega.app.project.layers.get(layerID);
				if(layer.get('type') != 'Link')
				{
					var optionString = "<li><label class='checkbox'><input type='checkbox' value='"+ layer.id +"'> <i class='zicon-"+ layer.get('type').toLowerCase() +"'></i> "+layer.get('attr').title +"</label></li>";
					_this.$el.find('.layer-checkbox-list').append(optionString)
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
			this.model.trigger('cancel_connection');
			this.$el.modal('hide');
			zeega.app.busy = false;
			this.remove();
			return false;
		},
		
		events : {
			'click .close' : 'hide',
			'click .save' : 'makeConnection'
		},

		
		makeConnection : function()
		{
			this.hide();
			var checked = $(this.el).find('.layer-checkbox-list input:checked');
			var selectedLayers = _.map( checked, function(input){ return parseInt( $(input).val() ) });
			
			this.model.trigger('connectToAdvanced', _.union([],selectedLayers) );
			
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
					'<h3>Select layers to persist to your new sequence:</h3>'+
					'<ul class="layer-checkbox-list unstyled"></ul>'+
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