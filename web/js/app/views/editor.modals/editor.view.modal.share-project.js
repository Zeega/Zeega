(function(Modal) {
	
	Modal.Views.ShareProject = Backbone.View.extend({
		
		el : $('#publish-project-modal'),
		
		render: function()
		{
			var _this = this;
			
			this.elemId = Math.floor(Math.random()*10000);

			var imageHTML = '';

			console.log(this.model)

			var frames = this.model.frames.models;
			
			var attr = _.isUndefined(this.model.get('attr')) ? {} : this.model.get('attr');

			//maybe don't need frame id there if just need img src
			for(var i=0;i<frames.length;i++){
				var frame = frames[i];
				imageHTML += 	'<a href="#"><img class="publish-cover-image'+ 
								(attr.project_thumbnail == frame.get('thumbnail_url') ? ' publish-image-select' : '') + 
								'" id="'+ frame.id +'" src="' + frame.get('thumbnail_url')+ '"></a>';
				
			}
			//http://dev.zeega.org/joseph/web/project/ID/view
			var projectlink = zeega.app.url_prefix +this.model.get('item_id');
			var iframeLink = zeega.app.url_prefix +this.model.get('item_id');
			this.iframeHTML = '<iframe src="'+ iframeLink +'" width="100%" height="100%" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
			var iframeEmbed = this.convertHTML(this.iframeHTML);

			var blanks = {
				//title : this.model.get('title'),
				//author : attr.author,
				imageHTML : imageHTML,
				projectlink 	: 	projectlink,
				uriEncodedProjectlink : encodeURIComponent(projectlink),
				uriEncodedTitle : encodeURIComponent(this.model.get("title")),
				iframeEmbed : iframeEmbed,
				iframeHTML : this.iframeHTML,
				randId : this.elemId,
				//tags : this.model.get('tags'),
			};
			//var template = _.template( this.getTemplate() );

			console.log(this)
			console.log( _.extend(this.model.attributes,blanks) )

			$(this.el).html( _.template( this.getTemplate(), _.extend(this.model.attributes,blanks) ) );

			$(this.el).find('.tagsedit').empty().tagsInput({
				'interactive':true,
				'defaultText':'add a tag',
				'onAddTag':function(){_this.updateTags('',_this)},
				'onRemoveTag':function(){_this.updateTags('',_this)},
				'removeWithBackspace' : false,
				'minChars' : 1,
				'maxChars' : 0,
				'placeholderColor' : '#C0C0C0',
			});

			$(this.el).find('#preview-images img').mouseup(function(){
				$('#preview-images img').removeClass('publish-image-select');
				$(this).addClass('publish-image-select');
				
			});
			$(this.el).find('#close-modal').mouseup(function(){
				$(_this.el).html(" "); //need to get rid of preview because audio/video keeps playing
				$(_this.el).modal('hide');
				return false;
			});
			$(this.el).find('#publish-open-customize-size').mouseup(function(){
				$('#publish-customize-size').fadeToggle();
				return false;
			});

			$(_this.el).find('#publish-project-modal-step2').show();

			$(this.el).find('#publish-width, #publish-height').blur(
				function(e){
					var iframeElem = null;
					if ($(this).attr("id") == 'publish-width')
					{
					 	iframeElem = $(_this.iframeHTML).attr("width", $(this).val());
					} else {
						iframeElem = $(_this.iframeHTML).attr("height", $(this).val());
					}
					_this.iframeHTML = iframeElem[0].outerHTML;
					$(_this.el).find('#publish-embed').html(_this.convertHTML(_this.iframeHTML));
					e.stopPropagation();
					e.preventDefault();
					return false;
				}
			);
			$(this.el).modal('show');
			return this;
		},
	convertHTML : function(str){
		return str.replace(/</gi, "&lt;").replace(/>/gi, "&gt;").replace(/"/gi, "&quot;");
	},
	updateTags:function(name, _this)
	{
	    model = _this.model;
		var $t = $("#"+_this.elemId+"_tagsinput").children(".tag");
		var tags = [];
		for (var i = $t.length; i--;) 
		{  
			tags.push($($t[i]).text().substring(0, $($t[i]).text().length -  1).trim());  
		}
		_this.model.save({tags : tags});
	},		
	getTemplate : function()
	{

		console.log(this)

		var html =	//Step 1
					'<div id="publish-project-modal-step2" style="display:none">'+
						'<div class="modal-header">'+
							'<button data-dismiss="modal" class="close">&times;</button>'+
							//'<a href="#" id="close-modal" class="btn secondary close-modal">x</a>'+
							'<h3>You\'re ready to publish <span style="color:#F15A29"><%= title %></span>!</h3>'+
							'<p>As you edit in the future this project will be automatically updated.</p>'+
						'</div>'+

						'<div class="modal-body clearfix">'+

							'<div class="publish-left-column">'+
								'<label for="project-title">Share your project</label>'+
								'<div id="publish-social-media">'+
									/*
									//FACEBOOK
									'<span class="publish-social-media">'+
									'<iframe src="//www.facebook.com/plugins/like.php?href=<%= uriEncodedProjectlink %>&amp;send=false&amp;layout=button_count&amp;width=450&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font=arial&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:120px; height:21px; float:left" allowTransparency="true"></iframe>'+
									'</span>'+
									*/
									//TWITTER
									'<span class="publish-social-media">'+
									'<a href="https://twitter.com/share" class="twitter-share-button" data-url="<%=projectlink %>" data-text="Zeega Project: <%=title %>">Tweet</a>'+
									'<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>'+
									'</span>'+
/*
									//TUMBLR
									'<span class="publish-social-media">'+
									'<span id="tumblr_button_abc123"></span>'+

									'<script type="text/javascript">'+
									    'var tumblr_link_url = "<%=projectlink%>";'+
									    'var tumblr_link_name = "<%=title%>";'+
									    'var tumblr_link_description = "<%=author%>";'+
									'</script>'+

									'<script type="text/javascript">'+
									    'var tumblr_button = document.createElement("a");'+
									    'tumblr_button.setAttribute("href", "http://www.tumblr.com/share/link?url=" + encodeURIComponent(tumblr_link_url) + "&name=" + encodeURIComponent(tumblr_link_name) + "&description=" + encodeURIComponent(tumblr_link_description));'+
									    'tumblr_button.setAttribute("title", "Share on Tumblr");'+
									    'tumblr_button.setAttribute("target", "_blank");'+
									    'tumblr_button.setAttribute("style", "display:inline-block; text-indent:-9999px; overflow:hidden; width:61px; height:20px; background:url(\'http://platform.tumblr.com/v1/share_2.png\') top left no-repeat transparent;");'+
									    'tumblr_button.innerHTML = "Share on Tumblr";'+
									    'document.getElementById("tumblr_button_abc123").appendChild(tumblr_button);'+
									'</script>'+
									'</span>'+

									//GOOGLE+
									'<span class="publish-social-media">'+
									'<g:plusone size="medium" annotation="inline" width="120" href="<%= projectlink %>"></g:plusone>'+

									'<script type="text/javascript">'+
									  '(function() {'+
									    'var po = document.createElement(\'script\'); po.type = \'text/javascript\'; po.async = true;'+
									    'po.src = \'https://apis.google.com/js/plusone.js\';'+
									    'var s = document.getElementsByTagName(\'script\')[0]; s.parentNode.insertBefore(po, s);'+
									  '})();'+
									'</script>'+
									'</span>'+
*/
								'</div>'+

								//END SOCIAL MEDIA INTEGRATION

								'<label for="project-link">Or copy this link</label>'+
								'<input type="text" id="project-link" value="<%= projectlink %>"/>'+

							'</div>'+
							'<div class="publish-right-column">'+
								'<label for="publish-embed">Embed your project</label>'+
								'<textarea id="publish-embed"><%= iframeEmbed %></textarea>'+
								'<a href="#" class="customize" id="publish-open-customize-size">Customize size</a>'+
								'<div id="publish-customize-size">'+
									'<label for="publish-width">Width</label>'+
									'<input type="text" id="publish-width" value=""/>'+
									'<label for="publish-height">Height</label>'+
									'<input type="text" id="publish-height" value=""/>'+
								'</div>'+
								'<label for="publish-preview">Preview</label>'+
								'<div class="publish-preview" style="background-image:url(<%= cover_image %>);background-size:100%;position:relative">'+
									'<div style="position:absolute;bottom:0;color:white;padding:10px;font-size:18px"><%= title %></div>'+
									//<div></div>
								'</div>'+
							'</div>'+
							'<div class="publish-footer">'+
								'<button class="btn secondary pull-right" data-dismiss="modal" ><i class="icon-ok-circle"></i> Done</button>'+
							'</div>'+
						'</div>'+
					'</div>';

		return html;
	},
});
	
})(zeega.module("modal"));