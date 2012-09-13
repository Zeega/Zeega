(function(Modal) {
	
	Modal.Views.ShareProject = Backbone.View.extend({
		
		className : 'modal',
		
		render: function()
		{
			var _this = this;
			
			var imageHTML = '';
			var frames = this.model.frames.models;

			var attr = _.isUndefined(this.model.get('attr')) ? {} : this.model.get('attr');

			//maybe don't need frame id there if just need img src
			for(var i = 0 ; i < frames.length ; i++)
			{
				var frame = frames[i];
				imageHTML += 	'<a href="#"><img class="publish-cover-image'+ 
								(attr.project_thumbnail == frame.get('thumbnail_url') ? ' publish-image-select' : '') + 
								'" id="'+ frame.id +'" src="' + frame.get('thumbnail_url')+ '"></a>';
				
			}
			//http://dev.zeega.org/joseph/web/project/ID/view

			console.log('##		share', this)

			var projectlink = 'http:'+zeega.app.url_prefix +this.model.get('item_id');
			var iframeLink = 'http:'+zeega.app.url_prefix +this.model.get('item_id')+"/embed";
			this.iframeHTML = '<iframe src="'+ iframeLink +'" width="100%" height="100%" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
			var iframeEmbed = this.convertHTML(this.iframeHTML);
			//var iframeEmbed = escape(this.iframeHTML)

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

			$(this.el).html( _.template( this.getTemplate(), _.extend(this.model.attributes,blanks) ) );

			return this;
		},


	convertHTML : function(str)
	{
		return str.replace(/</gi, "&lt;").replace(/>/gi, "&gt;").replace(/"/gi, "&quot;");
	},

	events : {
		'click .close' : 'hide',
		'click #publish-open-customize-size' : 'customizeEmbedSize',
		'blur #publish-width' : 'onSizeBlur',
		'blur #publish-height' : 'onSizeBlur'
	},

	customizeEmbedSize : function()
	{
		$('#publish-customize-size').fadeToggle();
		return false;
	},
	onSizeBlur : function(e)
	{
		console.log('on blur')
		var iframeElem = null;
		if ($(e.target).attr("id") == 'publish-width') iframeElem = $( this.iframeHTML ).attr("width", $(e.target).val());
		else iframeElem = $( this.iframeHTML ).attr("height", $(e.target).val());

		this.iframeHTML = iframeElem[0].outerHTML;
		this.$el.find('#publish-embed').html( this.convertHTML(this.iframeHTML));
		return false;
	},

	show : function(){ this.$el.modal('show') },
	hide : function(){ this.$el.modal('hide') },

	getTemplate : function()
	{

		console.log(this)

		var html =	//Step 1
			'<div class="modal-header">'+
				'<button class="close">&times;</button>'+
				'<h3>Share <span style="color:#F15A29"><%= title %></span> with the universe!</h3>'+
			'</div>'+

			'<div class="modal-body clearfix">'+

				'<div class="publish-left-column">'+
					'<label for="project-title">Social Media</label>'+
					'<div id="publish-social-media">'+
						/*
						//FACEBOOK
						'<span class="publish-social-media">'+
						'<iframe src="//www.facebook.com/plugins/like.php?href=<%= uriEncodedProjectlink %>&amp;send=false&amp;layout=button_count&amp;width=450&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font=arial&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:120px; height:21px; float:left" allowTransparency="true"></iframe>'+
						'</span>'+
					
						'<span class="publish-social-media">'+
						'<a href="https://twitter.com/share" class="twitter-share-button" data-url="<%=projectlink %>" data-text="Zeega Project: <%=title %>">Tweet</a>'+
						'<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>'+
						'</span>'+
						
							*/
						//TWITTER
						'<span class="publish-social-media">'+
						'<a href="https://twitter.com/intent/tweet?original_referer=<%=projectlink %>&amp;text=<%= title %>:&nbsp;&amp;url=<%=projectlink %>" class="share-twitter pull-left" target="blank"><i class="zitem-twitter zitem-30 loaded"></i></a>'+
						'</span>'+
						
						//FB
						
						'<span class="publish-social-media">'+
						'<a href="http://www.facebook.com/sharer.php?u=<%=projectlink %>" class="share-facebook pull-left" target="blank"><i class="zitem-facebook zitem-30 loaded"></i></a>'+
						'</span><br><br>'+

					'</div>'+

					//END SOCIAL MEDIA INTEGRATION

					'<label for="project-link">Link to your project</label>'+
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
					'<button class="btn secondary pull-right close" ><i class="icon-ok-circle"></i> Done</button>'+
				'</div>'+
			'</div>';

		return html;
	},
});
	
})(zeega.module("modal"));