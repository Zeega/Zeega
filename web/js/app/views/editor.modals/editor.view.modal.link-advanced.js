(function(Modal) {

	
	Modal.Views.LinkAdvanced = Backbone.View.extend({

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
				console.log(zeega.app.project.layers.get(layerID));
				
				var optionString = "<li><label class='checkbox'><input type='checkbox'> "+zeega.app.project.layers.get(layerID).get('attr').title +"</label></li>";
				
				$(_this.el).find('.layer-list-checkboxes').append(optionString)
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
			'change .sequence-choose-select' : 'selectSequence',
			'click li.frame-thumb-choose-icon' : 'selectFrame',
			'click .close' : 'hide',
			'click .save' : 'makeConnection'
		},
		
		selectSequence : function()
		{
			var _this = this;
			var sequenceID = $(_this.el).find('.sequence-choose-select').val();
			
			$(this.el).find('.btn-primary').addClass('disabled').removeClass('save btn-primary');
			
			$(this.el).find('.frame-choose-list').empty();
			_.each( zeega.app.project.sequences.get( sequenceID ).get('frames'), function(frameID){
				$(_this.el).find('.frame-choose-list').append('<li class="frame-thumb-choose-icon" data-id="'+ frameID +'"><img src="'+ zeega.app.project.frames.get(frameID).get('thumbnail_url') +'"/></li>')
			});
			this.targetSequence = sequenceID;
		},
		
		selectFrame : function(e)
		{
			var frame = $(e.target).closest('li');
			$(this.el).find('.selected').removeClass('selected');
			$(frame).addClass('selected');
			$(this.el).find('.disabled').removeClass('disabled').addClass('save btn-primary');
			this.targetFrame = $(frame).data('id');
		},
		
		makeConnection : function()
		{
			this.hide();
			zeega.app.connectToSequenceFrame(this.targetSequence,this.targetFrame);
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
					'<ul class="layer-list-checkboxes"></ul>'+
				'</div>'+
				'<div class="modal-footer">'+
					'<a href="#" class="btn close" >Cancel</a>'+
					'<a href="#" class="btn btn-success pull-right">Make New Sequence</a>'+
				'</div>'+
			'</div>';
			
			return html
		},
});
	
})(zeega.module("modal"));