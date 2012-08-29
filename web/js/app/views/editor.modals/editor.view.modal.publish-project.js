(function(Modal) {
	
	Modal.Views.PublishProject = Backbone.View.extend({
		
		//el : $('#publish-project-modal'),
		className : 'modal',

		render: function()
		{
			//http://dev.zeega.org/joseph/web/project/ID/view
			// why do these live here ?? MOVE!!
/*
			var projectlink = zeega.app.url_prefix + 'project/'+ this.model.id +'/view';
			var iframeLink = zeega.app.url_prefix +this.model.id;
			this.iframeHTML = '<iframe src="'+ iframeLink +'" width="100%" height="100%" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
			var iframeEmbed = this.convertHTML(this.iframeHTML);

			var blanks = {
				title : this.model.get('title'),
				author : attr.author,
				projectlink 	: 	projectlink,
				uriEncodedProjectlink : encodeURIComponent(projectlink),
				uriEncodedTitle : encodeURIComponent(this.model.get("title")),
				iframeEmbed : iframeEmbed,
				iframeHTML : this.iframeHTML,
				tags : this.model.get('tags'),
			};
*/
			this.$el.html( _.template( this.getTemplate(), this.model.toJSON() ));

			return this;
		},

		events : {
			'click .close' : 'hide',
			'click #looks-good' : 'publish'
		},

		show : function(){ this.$el.modal('show') },
		hide : function(){ this.$el.modal('hide') },
		
		publish : function()
		{
			this.$el.find('#looks-good').html('Publishing...');
			var properties = {
				title: this.$el.find('#publish-project-title').val(),
				description : this.$el.find('#publish-project-description').val(),
				publish_update:1,
				published:true,
				authors : this.$el.find('#publish-project-author').val(),
				//location : this.$el.find('#publish-project-location').val(),
				estimated_time : this.$el.find('#publish-project-estimated-time').val()
			}

			this.model.on('sync', this.onPublishSuccess, this);
			this.model.save( properties );
			
			return false;
		},

		onPublishSuccess : function(model,response)
		{
			console.log('$$		on publish success', model, response, this.model, zeega.app.project)
			this.model.off('sync', this.onPublishSuccess);
			/*
			this.model.set({
				item_id : response.project.item_id,
				publish_update : 0,
				date_published : response.project.date_published,
				date_updated : response.project.date_updated
			});
*/
			//zeega.app.shareProject();
			this.hide();
		},

/*
		convertHTML : function(str)
		{
			return str.replace(/</gi, "&lt;").replace(/>/gi, "&gt;").replace(/"/gi, "&quot;");
		},
*/

		getTemplate : function()
		{
			var html =	//Step 1
						'<div id="publish-project-modal-step1">'+
							'<div class="modal-header">'+
								'<button class="close">&times;</button>'+
								'<h3>Project Settings</h3>'+
							'</div>'+

							'<div class="modal-body clearfix twocolumn-rows">'+
								
								'<label for="publish-project-title" class="">Title</label>'+
								'<input type="text" id="publish-project-title" class="twocolumn-field span6" value="<%= title %>"/>'+
								
								'<label for="publish-project-description" class="twocolumn-label">Description</label>'+
								'<textarea id="publish-project-description" class="twocolumn-field span6"> <%= description %> </textarea>'+
							
								'<label for="publish-project-author" class="twocolumn-label">Author(s)</label>'+
								'<input type="text" id="publish-project-author" class="twocolumn-field span6" value="<%= author %>"/>'+
								
								'<label for="publish-project-estimated-time" class="twocolumn-label">Estimated Time</label>'+
								'<input type="text" id="publish-project-estimated-time" class="twocolumn-field span6" value="<%= estimated_time %>"/>'+
								
								/*
								'<p class="twocolumn-pair">'+
								'<label for="publish-project-location" class="twocolumn-label">Location</label>'+
								'<input type="text" id="publish-project-location" class="twocolumn-field" value="<%= location %>"/>'+
								'</p>'+
								*/
								
								'<label for="tags" class="twocolumn-label">Tags</label>'+
								'<input name="tags" class="tagsedit twocolumn-field span6" id="" value="<%=tags%>" />'+

								//'<label for="preview-images">Choose an image to represent your project</label>'+
								//'<div id="preview-images"><%= imageHTML %></div>'+

								'<div class="publish-footer">'+
									'<button id="looks-good" data-dismiss="modal"  class="btn btn-success secondary">Publish <i class="icon-circle-arrow-right icon-white"></i></button>'+
								'</div>'+
									
							'</div>'+
						'</div>';

			return html;
		},
	});
	
})(zeega.module("modal"));