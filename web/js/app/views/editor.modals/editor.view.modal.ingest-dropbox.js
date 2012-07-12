(function(Modal) {

	
	Modal.Views.IngestDropboxStart = Backbone.View.extend({

		className : 'modal',
		
		initialize : function()
		{
			
		},
		
		render: function()
		{
			var _this = this;
			console.log('IngestDropboxStart');
			$(this.el).html( this.getTemplate() );
			/*
			if(zeega.app.currentFrame.get('layers').length < 1 ) $(_this.el).find('.layer-checkbox-list').append('there are no layers on this frame to continue. Press the "Make New Sequence" button to continue with a blank sequence.')
			_.each( zeega.app.currentFrame.get('layers'), function(layerID){
				var layer = zeega.app.project.layers.get(layerID);
				if(layer.get('type') != 'Link')
				{
					var optionString = "<li><label class='checkbox'><input type='checkbox' value='"+ layer.id +"'> <i class='zicon-"+ layer.get('type').toLowerCase() +"'></i> "+layer.get('attr').title +"</label></li>";
					$(_this.el).find('.layer-checkbox-list').append(optionString)
				}
			})
			*/
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
			'click .save' : 'startSync'
		},

		
		startSync : function()
		{
			alert("Still extending Dropbox API (sorry)")
			this.hide();
			//var checked = $(this.el).find('.layer-checkbox-list input:checked');
			//var selectedLayers = _.map( checked, function(input){ return parseInt( $(input).val() ) })
			//zeega.app.connectToAdvanced(_.union([],selectedLayers))
			return false;
		},
	
		getTemplate : function()
		{
			var html = '<div class="modal" id="sequence-modal">'+
				'<div class="modal-header">'+
					'<button class="close">×</button>'+
				'</div>'+
				'<div class="modal-body">'+
					'<h3>Sync with Dropbox:</h3>'+

					'<label for="dropbox-username">Dropbox User Name</label>'+
					'<input type="text" id="ingest-dropbox-username" />'+

					'<label for="publish-project-author">Dropbox Password</label>'+
					'<input type="text" id="ingest-dropbox-password" />'+

				'</div>'+
				'<div class="modal-footer">'+
					'<a href="#" class="btn close" >Cancel</a>'+
					'<a href="#" class="btn btn-success pull-right save">Start Sync</a>'+
				'</div>'+
			'</div>';
			
			return html
		},
});
	
})(zeega.module("modal"));