(function(Modal) {
	
	Modal.Views.PublishProject = Backbone.View.extend({
		
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
			var projectlink = zeega.app.url_prefix + 'project/'+ this.model.id +'/view';
			var iframeLink = zeega.app.url_prefix +this.model.id;
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
			$(this.el).find('#looks-good').click(function(){
				$(_this.el).find('#looks-good').html('Publishing...');
				console.log("mouseup");
				attr.project_thumbnail = $('#preview-images .publish-image-select').attr('src');
				_this.model.save({
							'title': $('#publish-project-title').val(),
							'description': $('#publish-project-description').val(),
							'publish_update':1,
							'published':true,
							'authors' : $('#publish-project-author').val(),
							'location' : $('#publish-project-location').val(),
							'estimated_time' : $('#publish-project-estimated-time').val()
				},
				{
					success : function(model, response){
						//console.log(_this.model)
						zeega.app.project.set({'item_id':response.project.item_id,'publish_update':0,'date_published':response.project.date_published,'date_updated':response.project.date_updated});
						$('#sequence-title').html(response.project.title);
						console.log("success 1");
						zeega.app.shareProject();
						console.log("success 2");
						zeega.app.setButtonStates();
						console.log("success 3");
						//$(_this.el).find('#publish-project-modal-step2').show();
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
					'<div id="publish-project-modal-step1">'+
						'<div class="modal-header">'+
							'<button data-dismiss="modal" class="close">&times;</button>'+
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
							'<input name="tags" class="tagsedit twocolumn-field span6" id="<%=randId%>" value="<%=tags%>" />'+

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