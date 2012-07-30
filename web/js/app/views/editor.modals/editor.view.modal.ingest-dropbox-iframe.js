(function(Modal) {

	
	Modal.Views.IngestDropboxIFrame = Backbone.View.extend({

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
			'click .save' : 'makeConnection'
		},

		
		makeConnection : function()
		{
			this.hide();
			var checked = $(this.el).find('.layer-checkbox-list input:checked');
			var selectedLayers = _.map( checked, function(input){ return parseInt( $(input).val() ) })
			zeega.app.connectToAdvanced(_.union([],selectedLayers))
			
			return false;
		},
	
		getTemplate : function()
		{
			var host = window.location.protocol + "//" + window.location.host + "/web/widget/?url=https%3A%2F%2Fwww.dropbox.com%2Fhome%2FApps%2FZeega";
			console.log("editor.view.modal.ingest-dropbox-iframe.  host = ", host);
			var html = '<div class="modal" id="sequence-modal">'+
				'<div class="modal-header">'+
					'<button class="close">×</button>'+
				'</div>'+
				'<div class="modal-body">'+
					'<iframe src=' + host + ' />' +
				'</div>'+
			'</div>';
			
			return html
		},
});
	
})(zeega.module("modal"));