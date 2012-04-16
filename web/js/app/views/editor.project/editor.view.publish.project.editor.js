(function(Project) {

	
	Project.Views.Publish = Backbone.View.extend({

		el : $('#publish-project-modal'),
		
		render: function()
		{
			var _this = this;
			
			
			var imageHTML = '';

			var frames = this.model.sequences.at(0).frames.models;
			
			var attr = this.model.get('attr') == "" ? new Object() : this.model.get('attr');

			//maybe don't need frame id there if just need img src
			for(var i=0;i<frames.length;i++){
				var frame = frames[i];
				imageHTML += 	'<a href="#"><img class="publish-cover-image'+ 
								(attr.project_thumbnail == frame.get('thumbnail_url') ? ' publish-image-select' : '') + 
								'" id="'+ frame.id +'" src="' + frame.get('thumbnail_url')+ '"></a>';
				
			}

			
			var projectlink = zeega.app.url_prefix + "project/" + this.model.id + '/view';
			var iframeHTML = '<iframe src="'+ projectlink +'"></iframe>';
			var iframeEmbed = iframeHTML.replace(/</gi, "&lt;").replace(/>/gi, "&gt;").replace(/"/gi, "&quot;");


			var blanks = {
				
				title : this.model.get('title'),
				author : attr.author,
				imageHTML : imageHTML,
				projectlink 	: 	projectlink,
				uriEncodedProjectlink : encodeURIComponent(projectlink),
				uriEncodedTitle : encodeURIComponent(this.model.get("title")),
				iframeEmbed : iframeEmbed,
				iframeHTML : iframeHTML

			};
			var template = _.template( this.getTemplate() );

			$(this.el).html( template( blanks ) );

			$(this.el).find('#preview-images img').mouseup(function(){
				$('#preview-images img').removeClass('publish-image-select');
				$(this).addClass('publish-image-select');
				
			});
			$(this.el).find('#close-modal').mouseup(function(){
				$(_this.el).html(" "); //need to get rid of preview because audio/video keeps playing
				$(_this.el).modal('hide');
				return false;
			});
			$(this.el).find('#looks-good').mouseup(function(){

				attr.project_thumbnail = $('#preview-images .publish-image-select').attr('src');
				attr.author = $('#publish-project-author').val();
				_this.model.save({	
							'title': $('#publish-project-title').val(),
							'attr': attr,
							'published':true,
				},
				{
					success : function(model, response){
						$(_this.el).find('#publish-project-modal-step1').hide();
						$(_this.el).find('#publish-project-modal-step2').show();
					},
					error : function(model, response){
						console.log('error publishing project');
						console.log(model);
					},
				});
				
				return false;
			});
			$(this.el).find('#publish-back').mouseup(function(){

				$(_this.el).find('#publish-project-modal-step2').hide();
				$(_this.el).find('#publish-project-modal-step1').show();
				return false;
			});

			$(this.el).modal('show');
			return this;
		},
	
	getTemplate : function()
	{


		var html =	//Step 1
					'<div id="publish-project-modal-step1">'+
						'<div class="modal-header">'+
							'<a href="#" id="close-modal" class="btn secondary close-modal">x</a>'+
							'<h3>Before you publish, make sure everything looks good</h3>'+
						'</div>'+

						'<div class="modal-body clearfix">'+
							'<label for="publish-project-title">Title</label>'+
							'<input type="text" id="publish-project-title" value="<%= title %>"/>'+

							'<label for="publish-project-author">Author(s)</label>'+
							'<input type="text" id="publish-project-author" value="<%= author %>"/>'+

							'<label for="tags">Tags</label>'+
							'<p><a href="#">Add a tag</a></p>'+

							'<label for="preview-images">Choose an image to represent your project</label>'+
							'<div id="preview-images"><%= imageHTML %></div>'+

							'<div class="publish-footer">'+
								'<a href="#" id="looks-good" class="btn secondary">looks good</a>'+
							'</div>'+
								
						'</div>'+
					'</div>'+ 
					
					//Step 2
					'<div id="publish-project-modal-step2" style="display:none">'+
						'<div class="modal-header">'+
							'<a href="#" id="close-modal" class="btn secondary close-modal">x</a>'+
							'<h3>You\'re ready to publish <span style="color:#F15A29"><%= title %></span>!</h3>'+
							'<p>As you edit in the future this project will be automatically re-published.</p>'+
						'</div>'+

						'<div class="modal-body clearfix">'+

							'<div class="publish-left-column">'+
								'<label for="project-title">Share your project</label>'+
								//Add this button
								'<div class="addthis_toolbox addthis_default_style ">'+
								'<a class="addthis_button_preferred_1"></a>'+
								'<a class="addthis_button_preferred_2"></a>'+
								'<a class="addthis_button_preferred_3"></a>'+
								'<a class="addthis_button_preferred_4"></a>'+
								'</div>'+
								'<script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=xa-4f8720015e8fa2ab"></script>'+
								

								'<a href="http://www.facebook.com/sharer.php?u=<%= uriEncodedProjectlink %>&t=<%= uriEncodedTitle %>"><span class="socialmedia-icon-facebook" title="Facebook"></span></a>'+
								'<span class="socialmedia-icon-twitter" title="Twitter"></span>'+
								'<span class="socialmedia-icon-tumblr" title="Tumblr"></span>'+
								'<span class="socialmedia-icon-googleplus" title="Google+"></span>'+
								'<span class="socialmedia-icon-wordpress" title="WordPress"></span>'+
								'<iframe src="//www.facebook.com/plugins/like.php?href=<%= uriEncodedProjectlink %>&amp;send=false&amp;layout=button_count&amp;width=450&amp;show_faces=false&amp;action=recommend&amp;colorscheme=light&amp;font=arial&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:21px;" allowTransparency="true"></iframe>'+
								
								'<label for="project-link">Or copy this link</label>'+
								'<input type="text" id="project-link" value="<%= projectlink %>"/>'+
							'</div>'+
							'<div class="publish-right-column">'+
								'<label for="publish-embed">Embed your project</label>'+
								'<textarea id="publish-embed"><%= iframeEmbed %></textarea>'+

								'<label for="publish-preview">Preview</label>'+
								'<div class="publish-preview"><%= iframeHTML %></div>'+
							'</div>'+
							'<div class="publish-footer">'+
								'<a href="#" id="publish-back" class="btn secondary">Back</a>'+
								'<a href="#" id="close-modal" class="btn secondary" style="float:right">Done</a>'+
							'</div>'+
						'</div>'+
					'</div>';

		return html;
	},
});
	
})(zeega.module("project"));