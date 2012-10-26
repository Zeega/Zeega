(function(Modal) {

	
	Modal.Views.ContinueLayer = Backbone.View.extend({
		
		initialize : function(){},
		
		render: function()
		{
			var _this = this;
			$(this.el).html( this.getTemplate() );
			
			if(_.indexOf(zeega.app.currentSequence.get('persistent_layers'),parseInt(this.model.id,10))>-1){
				$(this.el).find('.continue-option-next').remove();
				$(this.el).find('#continue-sequence').attr({'checked': true,'disabled':true});
			}
			else {
			
				var index=_.indexOf(zeega.app.currentSequence.get('frames'),parseInt(zeega.app.currentFrame.id,10));
				if(zeega.app.currentSequence.frames.length>index+1){
					if(_.indexOf(zeega.app.currentSequence.frames.at(index+1).get('layers'),parseInt(this.model.id,10))>-1){
						$(this.el).find('#continue-next-frame').attr({'checked': true,'disabled':true});
					}
				}
				else{
					$(this.el).find('.continue-option-next').remove();
				}
			}
			
			
			// filter for only outgoing link layers
			var linkLayers = zeega.app.currentFrame.layers.filter(function(layer){
				return layer.get('type')==='Link' && (layer.get('attr').from_frame == zeega.app.currentFrame.id)
			});
			_.each(linkLayers, function(layer){
				var frame = zeega.app.project.frames.get(layer.get('attr').to_frame);
				if(_.indexOf(zeega.app.project.frames.get(layer.get('attr').to_frame).get('layers'),parseInt(_this.model.id,10))>-1) var optionString = "<li class='disabled-link-layer' data-id='"+frame.id+"'><a href='#'><img src='"+ frame.get('thumbnail_url')+"' height:'50px' width='50px'/></a></li>";
				else var optionString = "<li class='enabled-link-layer' data-id='"+frame.id+"'><a href='#'><img src='"+ frame.get('thumbnail_url')+"' height:'50px' width='50px'/></a></li>";
				_this.$el.find('.layer-list-checkboxes').append(optionString);
			});
			if(!linkLayers.length) $(_this.el).find('#linked-frames-selector').remove();

			return this;
		},
		
		show : function()
		{
			this.$el.modal('show');
		},
		
		hide : function()
		{
			this.$el.modal('hide');
			this.remove();
			zeega.app.busy = false;
			return false;
		},
		
		events : {
			'click .close' : 'hide',
			'click .save' : 'continueLayer',
			'click .enabled-link-layer' : 'selectFrame',
		},
		
		continueLayer : function()
		{
			var _this = this;
			this.hide();
			_.each( $(this.el).find('.layer-list-checkboxes li.selected'), function(frameEl){
				var frame = zeega.app.project.frames.get( $(frameEl).data('id') );
				frame.layers.unshift( _this.model );
			})
			if( $(this.el).find('#continue-sequence').is(':checked') )
			{
				this.model.update({'persistent':1});
				$('#zeega-layer-list').find('#layer-'+this.model.id).addClass('persistent');
				zeega.app.continueOnAllFrames( this.model.id )
				return false; // prevents activation of continue to next frame which would be redundant
			}
			if( $(this.el).find('#continue-next-frame').is(':checked') ){
				$('#zeega-layer-list').find('#layer-'+this.model.id).addClass('continues');
				zeega.app.continueLayerToNextFrame( this.model.id );
			}

			return false;
		},
		
		selectFrame : function(e)
		{
			$(e.target).closest('li').toggleClass('selected');
			return false;
		},
	
		getTemplate : function()
		{

			var html =
			
			'<div class="modal" id="sequence-modal">'+
				'<div class="modal-header">'+
					'<button class="close">×</button>'+
					'<h3>Continue this layer on:</h3>'+
					
				'</div>'+
				'<div class="modal-body">'+
					
					
					'<div class="continue-persist">'+
					'</div>'+
					
					'<div class="continue-option-next">'+
						'<label class="checkbox"><input id="continue-next-frame" type="checkbox" value="next_frame">Next Frame</label>'+
					'</div>'+
					'<div class="continue-option-sequence">'+
						'<label class="checkbox"><input id="continue-sequence" type="checkbox" value="sequence">This Sequence</label>'+
					'</div>'+
					
					'<div id="linked-frames-selector">linked frames</br>'+
					
					'<ul class="layer-list-checkboxes unstyled"></ul></div>'+
				'</div>'+
				'<div class="modal-footer">'+
					'<a href="#" style="color:white" class="btn btn-success pull-left save">Save</a>'+
				'</div>'+
			'</div>';
			
			return html
		},
});
	
})(zeega.module("modal"));