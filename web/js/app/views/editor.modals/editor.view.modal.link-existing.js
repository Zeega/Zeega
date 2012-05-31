(function(Modal) {

	
	Modal.Views.LinkExisting = Backbone.View.extend({

		className : 'modal',

		el : $('#publish-project-modal'),
		
		initialize : function()
		{
			
		},
		
		render: function()
		{
			var _this = this;
			console.log('modal render!!!')
			$(this.el).html( this.getTemplate() );
			
			//fill options for selecting a sequence
			_.each( _.toArray(zeega.app.project.sequences), function(sequence){
				$(_this.el).find('.sequence-choose-select').append('<option value="'+sequence.id+'">'+ sequence.get('title') +'</option>')
			})
			
			_.each( zeega.app.project.sequences.at(0).get('frames'), function(frameID){
				$(_this.el).find('.frame-choose-list').append('<li class="frame-thumb-choose-icon" data-id="'+ frameID +'"><img src="'+ zeega.app.project.frames.get(frameID).get('thumbnail_url') +'"/></li>')
			});
			
			this.targetSequence = zeega.app.project.sequences.at(0).id;
			
			return this;
		},
		
		show : function()
		{
			this.$el.modal('show');
		},
		
		hide : function()
		{
			this.$el.modal('hide');
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
					'<button class="close" data-dismiss="modal">×</button>'+
					
				'</div>'+
				'<div class="modal-body">'+
					'<h3>1. Choose Sequence:</h3>'+
					'<select class="sequence-choose-select"></select>'+
					'<h3>2. Choose Frame:</h3>'+
					'<ul class="frame-choose-list unstyled"></ul>'+
				'</div>'+
				'<div class="modal-footer">'+
					'<a href="#" class="btn" data-dismiss="modal">Close</a>'+
					'<a href="#" class="btn disabled">Save changes</a>'+
				'</div>'+
			'</div>';
			
			return html
		},
});
	
})(zeega.module("modal"));