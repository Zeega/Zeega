(function(Items) {


	Items.Views = Items.Views || {};
	
	Items.Views.PublishSettings = Backbone.View.extend({
		
		events: {
			'click .close' : 'hide',
			'click .save' : 'save'
		},
		
		initialize: function()
		{
			
			this.settings = {
				'public' : this.model.get('published') ? 'checked' : '',
				'private' : !this.model.get('published') ? 'checked' : ''
			}
		},
		
		render: function()
		{
			$(this.el).html( _.template(this.getTemplate(),this.settings) );
			
			return this;
		},
		
		show : function()
		{
			this.$el.find('#modal-archive-settings').modal('show');
		},
		hide : function()
		{
			this.$el.find('#modal-archive-settings').modal('hide');
			this.remove();
			return false;
		},
		
		save : function()
		{
			var v = this.$el.find('input[name=set]:checked').val() == 'true' ? true : false;
			this.model.save({'published':v});
			if(v){
				$('.archive-setting-type').addClass('label-success').html('Public');
				$('.archive-setting-description').text(l.jda_collection_publicdesc);
			}
			else{
				$('.archive-setting-type').removeClass('label-success').html('Limited');
				$('.archive-setting-description').text(l.jda_collection_limiteddesc);
			}
			this.hide();
			return false;
		},
		
		getTemplate : function()
		{


			var html =
			
			'<div class="modal" id="modal-archive-settings">'+
				'<div class="modal-header">'+
					'<h3>コレクション設定</h3>'+
				'</div>'+
				'<div class="modal-body">'+
				
					'<div class="control-group">'+
						'<label class="radio"><input name="set" type="radio" value="true" <%= public %>> <span class="label label-success">'+l.jda_collection_public+'</span>'+l.jda_collection_publiclabel+'</label>'+
						'<label class="radio"><input name="set" type="radio" value="false" <%= private %>> <span class="label">'+l.jda_collection_limited+'</span>'+l.jda_collection_limitedlabel+'</label>'+
					'</div>'+
					'Note: it may take several minutes for the changes to take effect'+
				'</div>'+
				'<div class="modal-footer">'+
					'<a href="#" class="btn close">Cancel</a>'+
					'<a href="#" class="btn btn-success pull-right save">Save</a>'+
				'</div>'+
			'</div>';

			
			return html
		}
		

	});

})(zeega.module("items"));