(function(Fancybox) {

	// This will fetch the tutorial template and render it.
	Fancybox.Views._Fancybox = Backbone.View.extend({
		
		tagName:'div',
		id:'fancybox-media-container',
		
		initialize: function(){
		},

		events : {
			'click .fancybox-more-button' : 'more',
			'click .fancybox-less-button' : 'less',
		},
		beforeClose: function(){
		},
		afterShow:function()
		{
			//console.log("I'm rendering after show");
			var _this = this;
			
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
		
		more : function(){
			var _this=this;
			sessionStorage.setItem('moreFancy', true);
			$(this.el).find('.less').hide();
			$(this.el).find('.more').fadeIn('fast',function(){
				if(_this.locatorMapView.geoLocated)_this.locatorMapView.addMap();
			});

			$(this.el).find(".fancybox-media-wrapper").addClass("fancybox-media-wrapper-more");
			$(this.el).find(".fancybox-left-column").addClass("fancybox-left-column-more");
			$(this.el).find(".fancybox-media-item").addClass("fancybox-media-item-more");
			$(this.el).addClass("fancybox-media-container-more");	

			//Show delete button in More view if user added this item
			console.log(sessionStorage.getItem("userid") + ' is session nid');
			console.log(this.model.get("user_id") + ' is mode; nid');
			if(sessionStorage.getItem("userid") == this.model.get("user_id")){
				$(this.el).find('.fancybox-delete-button').show();
			} else{
				$(this.el).find('.fancybox-delete-button').hide();
			}

			return false;
		},
		
		less : function()
		{
			sessionStorage.setItem('moreFancy', false);
			$(this.el).find('.more').hide();
			$(this.el).find('.less').show();
			$(this.el).find(".fancybox-media-wrapper").removeClass("fancybox-media-wrapper-more");
			$(this.el).find(".fancybox-left-column").removeClass("fancybox-left-column-more");
			$(this.el).find(".fancybox-media-item").removeClass("fancybox-media-item-more");
			$(this.el).removeClass("fancybox-media-container-more");	
			return false;
		},
		
		render: function(obj)
		{
            this.elemId = Math.floor(Math.random()*10000);
			/** Temp Fix **/
			var blanks = {
				sourceLink : this.model.get('attribution_uri'),
				title : this.model.get('title') == "none" ? this.model.get('layer_type') : this.model.get('title'),
				description : this.model.get('description'),
				creator : this.model.get('media_creator_username'),
				tags : this.model.get('tags'),
				randId: this.elemId
			};
			if(this.model.get('attribution_uri').indexOf('flickr')>-1) blanks.sourceText = 'View on Flickr';
			else 	if(this.model.get('attribution_uri').indexOf('youtube')>-1) blanks.sourceText = 'View on Youtube';
			else 	if(this.model.get('attribution_uri').indexOf('soundcloud')>-1) blanks.sourceText = 'Listen on Soundcloud';
			else blanks.sourceText ='View Source';

			//use template to clone the database items into
			var template = _.template( this.getTemplate() );

			//copy the cloned item into the el
			$(this.el).append( template( blanks ) );

			// Add map view
			var Map = zeegaBrowser.module('map');
			this.locatorMapView = new Map.Views.Fancybox({ model : this.model });
			$(this.el).find('.geo').append(this.locatorMapView.render());


			//Fancybox will remember if user was in MORE or LESS view
			if (sessionStorage.getItem('moreFancy') == "true") this.more(this.el);
			else this.less(this.el);

			var _this=this;
			
			//EDIT TITLE
			$(this.el).find('.title').editable(
				function(value, settings)
				{ 
					_this.model.save({ title:value }, 
							{
								success: function(model, response) { 
									console.log("Updated item title for item " + model.id);
				 				},
				 				error: function(model, response){

				 					console.log("Error updating item title.");
				 					console.log(response);
				 				}
				 			});
					return value; //must return the value
				},
				{
					indicator : 'Saving...',
					tooltip   : 'Click to edit...',
					indicator : '<img src="images/loading.gif">',
					select : false,
					onblur : 'submit',
					width : 250,
					cssclass : 'fancybox-form'
			});
			//EDIT DESCRIPTION
			$(this.el).find('.description').editable(
				function(value, settings)
				{ 
					_this.model.save({ description:value }, 
							{
								success: function(model, response) { 
									theElement.find('.description').text(_this.model.get("description"));
									console.log("Updated item description for item " + _this.model.id);
				 				},
				 				error: function(model, response){

				 					console.log("Error updating item description.");
				 					console.log(response);
				 				}
				 			});
					return value; //must return the value
				},
				{
					type 	: 'textarea',
					indicator : 'Saving...',
					tooltip   : 'Click to edit description...',
					indicator : '<img src="images/loading.gif">',
					select : false,
					onblur : 'submit',
					width : 250,
					cssclass : 'fancybox-form'
			});
			//EDIT CREATOR
			$(this.el).find('.creator').editable(
				function(value, settings)
				{ 
					_this.model.save({ "media_creator_username":value }, 
							{
								success: function(model, response) { 
									console.log("Updated item creator for item " + _this.model.id);
				 				},
				 				error: function(model, response){

				 					console.log("Error updating item creator.");
				 					console.log(response);
				 				}
				 			});
					return value; //must return the value
				},
				{
					indicator : 'Saving...',
					tooltip   : 'Click to edit...',
					indicator : '<img src="images/loading.gif">',
					select : false,
					onblur : 'submit',
					width : 150,
					cssclass : 'fancybox-form'
			});

			$(this.el).find('.no-do-not-delete').click(function(e){
				$('.fancybox-delete-button').show();
				$('.fancybox-confirm-delete-button').hide();
				e.preventDefault();
			});
			$(this.el).find('.yes-confirm-delete').click(function(e){

				var deleteURL = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/items/"
							+ _this.model.id;

				//DESTROYYYYYYYY
				_this.model.destroy({	
					 				url : deleteURL,
									success: function(model, response)
									{ 
										console.log("Deleted item " + _this.model.id);	

										//close fancy box window
										jQuery.fancybox.close();

					 				},
					 				error: function(model, response)
									{
					 					console.log("Error deleting item " + _this.model.id);		
					 					console.log(response);
					 				}
			 					});
				e.preventDefault();
			});
			
			//DELETE button
			$(this.el).find('.fancybox-delete-button').click(function(e){
				$(this).hide();
				$('.fancybox-confirm-delete-button').show();
			 	e.preventDefault();
			});

			return this;
		},
		getTemplate : function()
		{

			var html =	'<div class="fancybox-media-wrapper">'+
							'<div class="fancybox-left-column">' +
								'<div class="fancybox-media-item media-item"></div>'+
								'<p class="more subheader" style="clear:both">Tags</p><div class="more tags">'+
								'<input name="tags" class="fancybox-editable tagsedit" id="<%=randId%>" value="<%=tags%>" />'+
								'</div>'+
							'</div>'+
							'<p class="fancybox-editable title"><%= title %></p>'+
							'<p><span class=" creator fancybox-editable"><%= creator %></span> <span class="source"><a href="<%= sourceLink %>" target="_blank"><%= sourceText %></a></span></p>'+
							'<p class="more subheader">Description</p><p class="more description fancybox-editable"><%= description %></p>'+
							'<div class="more geo"></div>'+

						'</div>'+
						'<div class="fancybox-buttons" class="clearfix">'+
							'<p class="less fancybox-more-button"><a href=".">view more</a></p><p class="more fancybox-less-button"><a href=".">view less</a></p>'+
							'<p class="fancybox-delete-button more" style="display:none"><a href=".">delete</a></p>'+
							'<p class="fancybox-confirm-delete-button">are you totally sure you want to delete this? '+
							'<a href="." class="yes-confirm-delete">yes</a> <a class="no-do-not-delete" href=".">no</a></p>'+

						'</div>';

			return html;
		}
	});
	
})(zeegaBrowser.module("fancybox"));