(function(FancyBox) {

	FancyBox.Views = FancyBox.Views || {};
	
	FancyBox.Views._Fancybox = Backbone.View.extend({
		
		tagName:'div',
		id:'fancybox-media-container',
		
		initialize: function(){
			var _this = this;
			this.collection = jda.app.myCollectionsDrawer.collection;
		},

		events : {
			'click .fancybox-more-button' : 'more',
			'click .fancybox-less-button' : 'less',
			'click .jda-share-link input' : function(){ $('.jda-share-link input').select() },
		},
		
		beforeClose: function(){},
		
		afterShow:function()
		{

			if(this.locatorMapView.geoLocated&&sessionStorage.getItem('moreFancy')) this.locatorMapView.addMap();

			var _this = this;
			
			$(this.el).find('.tagsedit').empty().tagsInput({
				'interactive':true,
				'defaultText':l.fancybox_addtag,
				'onAddTag':function(){_this.updateTags('',_this)},
				'onRemoveTag':function(){_this.updateTags('',_this)},
				'removeWithBackspace' : false,
				'minChars' : 1,
				'maxChars' : 0,
				'placeholderColor' : '#C0C0C0',
			});
			
			
			$(this.el).find('.jda-show-share-link').click(function(){_this.shareLink();});
			
			
			if(!this.model.get('editable')){$('.tag').find('a').hide();}

			/***********************************
				ADD TO COLLECTION LINK
				Only show if they are logged in and not looking at a collection page already
			***********************************/
			if(sessionStorage.getItem('user')==0 || jda.app.resultsView.collectionFilter != null)
			{
				$('.jda-add-to-menu').hide();

			}
			else
			{
				var myCollections = $(_this.el).find('.fancybox-my-collections-list');

				_.each( _.toArray(this.collection), function(item){
				
					if(!_.isUndefined(item.id)) var id =item.id;
					else id = -1;
					
					if(item.get('title').length>25) var title = item.get('title').substr(0,23)+'...';
					else var title = item.get('title');
					
					var itemView = '<li class="zeega-collection-list-item" id="'+id+'"><a href=".">'+title+'</a></li>';
					myCollections.append(itemView);

				});

				//Save collection with new item
				$(_this.el).find('.zeega-collection-list-item').click(function(){

					$(_this.el).find('.jda-add-to-menu').removeClass('open');
					$(_this.el).find('.jda-saving').show()

					var collectionID = $(this).attr("id");
					var itemID = _this.model.id;
					var collection = _this.collection.get(collectionID);
					var itemExists = false;
					var kids =_.toArray( collection.get('child_items'));
					for (var i=0;i<kids.length;i++)
					{
						if(kids[i].id == itemID)
						{
							itemExists=true;
							break;
						}
					}
					if (!itemExists)
					{
						collection.save({new_items:[itemID ]},
								{
									success : function(model, response){ 
										//_this.collection.reset();
										$(_this.el).find('.jda-saving').hide();
										$(_this.el).find('.jda-added').show().delay(800).fadeOut(400);
										
										//update my collection drawer preview
										if (collection.id == jda.app.myCollectionsDrawer.activeCollectionID){
											jda.app.myCollectionsDrawer.renderCollectionPreview(collection);
										}
										
									},
									error : function(model, response){
										console.log(response);
		
									}
								}
							);
					}
					else
					{
						$(_this.el).find('.jda-saving').hide();
						$(_this.el).find('.jda-duplicate-item').show().delay(800).fadeOut(400);

					}
					return false;
				});
			} 
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
			console.log('calling more');
			var _this=this;
			sessionStorage.setItem('moreFancy', true);
			$(this.el).find('.less').hide();
			$(this.el).find('.more').fadeIn('fast');
			this.locatorMapView.addMap();
			$(this.el).find('.plyr-video').css({'height':'200px'});
			$(this.el).find(".fancybox-shrinkable").addClass("fancybox-media-wrapper-more");
			$(this.el).find(".fancybox-media-wrapper").addClass("fancybox-media-wrapper-more");
			$(this.el).find(".fancybox-left-column").addClass("fancybox-left-column-more");
			$(this.el).find(".fancybox-media-item").addClass("fancybox-media-item-more");
			$(this.el).addClass("fancybox-media-container-more");	

			//Show delete button in More view if user added this item
			console.log(sessionStorage.getItem("userid") + ' is session nid');
			console.log(this.model.get("user_id") + ' is mode; nid');
			
			if(this.model.get("editable")){
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
			$(this.el).find('.plyr-video').css({'height':'400px'});
			$(this.el).find(".fancybox-media-wrapper").removeClass("fancybox-media-wrapper-more");
			$(this.el).find(".fancybox-left-column").removeClass("fancybox-left-column-more");
			$(this.el).find(".fancybox-media-item").removeClass("fancybox-media-item-more");
			$(this.el).removeClass("fancybox-media-container-more");	
			return false;
		},
		shareLink : function(){
			
			$('.jda-share-link').toggle();			
			$('.jda-show-share-link').toggleClass('active');
			$('.jda-share-link').find('input').select();
			
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
			
			
			/*
			if(this.model.get('attribution_uri').indexOf('flickr')>-1) blanks.sourceText = 'View on Flickr';
			else 	if(this.model.get('attribution_uri').indexOf('youtube')>-1) blanks.sourceText = 'View on Youtube';
			else 	if(this.model.get('attribution_uri').indexOf('soundcloud')>-1) blanks.sourceText = 'Listen on Soundcloud';
			else blanks.sourceText = l.fancybox_source;
			*/
			blanks.sourceText = l.fancybox_source;

			blanks.itemShareLink = sessionStorage.getItem('hostname')+sessionStorage.getItem('locale')+'/item/'+ this.model.id;
			
			//use template to clone the database items into
			var template = _.template( this.getTemplate() );

			//copy the cloned item into the el
			$(this.el).append( template( blanks ) );

			// Add map view
			var FancyBox = jda.module('browser');
			this.locatorMapView = new FancyBox.Views.LocatorMap({ model : this.model });
			$(this.el).find('.geo').append(this.locatorMapView.render());

			

			//Fancybox will remember if user was in MORE or LESS view
			if (sessionStorage.getItem('moreFancy') == "true") this.more(this.el);
			else this.less(this.el);

		
			if(this.model.get('editable')){

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
										$(_this.el).find('.description').text(_this.model.get("description"));
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

			}


			$(this.el).find('.close').click(function(){
				jQuery.fancybox.close();
			});

			return this;
		},
		getTemplate : function()
		{

			var html =		'<div class="fancybox-close-button"><a class="close">&times;</a></div>'+
							'<div class="fancybox-media-wrapper">'+
							'<div class="fancybox-left-column">' +
								/* Share & Add to collection buttons */
								'<div style="margin-bottom:3px">'+
									'<button class="btn btn-mini btn-inverse pull-left jda-show-share-link" style="margin-right:5px;margin-bottom:3px"><i  class="icon-share-alt icon-white"></i>link</button> '+
									'<div class="btn-group jda-add-to-menu pull-left">'+
									  '<a class="btn btn-mini btn-inverse dropdown-toggle" data-toggle="dropdown" href="#">'+
									    'add to'+
									    '<span class="caret"></span>'+
									  '</a>'+
									  '<ul class="dropdown-menu fancybox-my-collections-list">'+
									    
									  '</ul>'+
									'</div><span class="label label-info jda-saving" style="display:none;margin-left:3px">Saving...</span><span class="label label-success jda-added" style="display:none;margin-left:3px">Added</span><span  style="display:none;margin-left:3px" class="label label-warning jda-duplicate-item">Duplicate</span>'+
								'</div>'+
								'<div class="jda-share-link" style="display:none;float:none;clear:both;margin-top:3px">'+
									'<input type="text" value="<%= itemShareLink %>">'+
								'</div>'+

								/* Media Item */
								'<div class="fancybox-media-item media-item" style="clear:both"></div>'+

								/* Tags */
								'<p class="more subheader" style="clear:both">tags</p><div id="zeega-tag-container" class="more zeega-tags">'+
								'<input name="tags" class="fancybox-editable tagsedit" id="<%=randId%>" value="<%=tags%>" />'+
								'</div>'+
							'</div>'+
							'<p class="fancybox-editable title"><%= title %></p>'+
							'<p><span class=" creator fancybox-editable"><%= creator %></span> <span class="source"><a href="<%= sourceLink %>" target="_blank"><%= sourceText %></a></span></p>'+
							'<p class="more subheader">description</p><p class="more description fancybox-editable"><%= description %></p>'+
							'<div id = "fancybox-map" class="more geo"></div>'+

						'</div>'+
						'<div class="fancybox-buttons" class="clearfix">'+
							'<p class="less fancybox-more-button"><a href=".">more</a></p><p class="more fancybox-less-button"><a href=".">less</a></p>'+
							'<p class="fancybox-delete-button more" style="display:none"><a href=".">delete</a></p>'+
							'<p class="fancybox-confirm-delete-button">are you totally sure you want to delete this? '+
							'<a href="." class="yes-confirm-delete">yes</a> <a class="no-do-not-delete" href=".">no</a></p>'+

						'</div>';

			return html;
		}
	});
	
})(zeega.module("fancybox"));