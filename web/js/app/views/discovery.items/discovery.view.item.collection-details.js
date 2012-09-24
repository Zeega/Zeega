	
	/*  discovery.view.item.collection-details */
	
	(function(Items) {


	Items.Views = Items || {};
	
	Items.Views.CollectionDetails = Backbone.View.extend({
		
		el : $('#collection-details'),
	
		events: {
				'click a.play' : 'playCollection',
				'click button.share' : function(){alert('Opens publish process modal window');},
				'click a.edit' : 'editMetadata',
				'click button.save' : 'saveMetadata',
				'click button.cancel' : 'cancelEdits',
				'click .edit-publish-settings' : 'editPublishSettings',
		},

			
		initialize: function ()
		{
	
				this.isEditView = false;
				this.elemId = Math.floor(Math.random()*10000);
				this.render();
				if(!_.isUndefined(window._gaq)) _gaq.push(["_trackEvent", "Zeega-Collection", "View", this.model.id.toString()]);
	
		  },

		playCollection: function()
		{
			console.log('playing collection');
		},
		
		render: function(done)
		{
			var _this = this;
			
			

			/***************************************************************************
				Put template together
			***************************************************************************/
			var template = this.getTemplate();
			var blanks = this.model.attributes;

			blanks.randId = this.elemId
			blanks.publishSettingsClass = blanks.published == false ? '' : 'label-success';
			blanks.publishSettingsText = blanks.published == false ? l.jda_collection_limited : l.jda_collection_public;
			blanks.publishSettingsDesc = blanks.published == false ? l.jda_collection_limiteddesc : l.jda_collection_publicdesc;

		
		
		
			$(this.el).html( _.template( template, blanks ) );
	
			if (this.model.get('editable')){
				$(this.el).find('button.edit').show();
			}
			

			//draw map view
			this.mapView = new Items.Views.Common.LeafletMap({model:this.model});
			this.$el.find('.collection-map').html( this.mapView.render().el );
			
			//draw tags view
			this.tagsView = new Items.Views.Common.TagDisplay({model:this.model});
			this.$el.find('.collection-tags').html( this.tagsView.render().el );
			
			


			
			$(this.el).find('.cover-image').droppable({
				drop : function(e,ui)
				{
					console.log('dropped', zeega.discovery.app.draggedItem)
					var item = zeega.discovery.app.draggedItem;
					var t = ( item.get('layer_type') == 'Image' ) ? item.get('uri') : item.get('thumbnail_url');
					_this.model.save({'thumbnail_url':t});
					$(_this.el).find('.cover-image').css('background-image','url('+t+')');
					$(_this.el).find('.drop-to').remove();
				}
			})

			//awkward click event
			
			$(this.el).find('.collection-filter-author').click(function(){
				
				zeega.discovery.app.goToUser(_this.model.get('user_id'));
			
			});

			this.$el.find('.edit, .edit-publish-settings, .play').tooltip({placement:'right'});

			return this;
		},
			
		editMetadata : function()
		{
				
			var _this  = this;
		
			//Show the remove stuff
			$('#zeega-items-list .remove-item').unbind().click(function(){
				var doDelete = confirm(l.jda_collection_confirmdelete);
				if (doDelete){
					var itemID = $(this).closest('li').attr('id');
					_this.model.save({
										items_to_remove:itemID
																	},
					{
						url:zeega.discovery.app.apiLocation + 'api/items/' + zeega.discovery.app.resultsView.collectionFilter.model.id+'/items',
						success: function(model, response) { 
							
						},
						error: function(model, response){
							
							console.log("Error updating item title.");
							console.log(response);
						}

					});
					zeega.discovery.app.resultsView.collection.remove(zeega.discovery.app.resultsView.collection.get(itemID));
					return false;
				}else{
					return false;
				}
			}).show();
			
			
			$('.delete-this-collection').unbind().click(function(){
				var doDelete = confirm(l.jda_collection_confirmdelete);
				if (doDelete){
					var itemID = _this.model.id;
					var itemToDelete = _this.model;
					console.log('deleting ' + itemID + itemToDelete.get('title'))

					//KILL KILL
					itemToDelete.destroy({success:function(model){
						window.location=$('#user-profile').attr('href');
					}});
					
					return false;
				}else{
					return false;
				}
			})

			$(this.el).find('.save-data button').show();
			$(this.el).find('button.edit').addClass('active');
			$(this.el).find('.cover-overlay h1').addClass('editing').attr('contenteditable', true).keypress(function(e){
				if(e.which==13)
				{
					_this.saveFields();
					$(this).blur();
					return false;
				}
			});
			$(this.el).find('.collection-description').addClass('editing').attr('contenteditable', true);
			
			//Add placeholder text
			if( $(this.el).find('.collection-description').is(':empty') ) {
				$(this.el).find('.collection-description-empty').show();
				$(this.el).find('.collection-description-empty').click(function(){$(this).hide();$(_this.el).find('.collection-description').focus();});
			}
			$(this.el).find('.collection-description').focus(function(){
				$(_this.el).find('.collection-description-empty').hide();
				$(this).unbind('focus');
				$(this).trigger('focus');
			});
			
			this.tagsView.enterEditMode();
			
			
			return false
		},
			
		saveMetadata : function()
		{
				this.turnOffEditMode();
				this.saveFields();
			},
			
		saveFields : function()
		{
				var oldTitle = this.model.get("title");
				var _this=this;
				this.model.save({
					'title' : $(this.el).find('.cover-overlay h1').text(),
					'text' : $(this.el).find('.collection-description').text()
				},{
					success: function(model, response) { 
						
						console.log("successfully updated the collection");
						_.each( VisualSearch.searchBox.facetViews, function( facet ){
							if( facet.model.get('category') == 'collection' && facet.model.get('value') == oldTitle) {
								
								console.log(facet);
								facet.model.set({'value': model.get('title') });
								facet.render();
							}
							
						})
						
						
							
						//Update my collections drawer
						
						var title =model.get('title');
						if(title.length>20) title=title.substr(0,15)+"...";
					
						if(zeega.discovery.app.myCollectionsDrawer.activeCollectionID == model.id){
							$('#zeega-my-collections-active-collection').text(title);
						}
						else{
							$('#'+model.id+' a').html(title);
						}

						_this.turnOffEditMode();
					
					},
					error: function(model, response){
						
						console.log("Error updating collection title and description.");
						console.log(response);
					}
				})
			},
			
		cancelEdits : function()
		{
			//ensure that it's editable, weird bug where editable value changes - wha??
			this.model.set({'editable':true});

			this.render();
			
			this.turnOffEditMode();
		},
			
		turnOffEditMode : function()
		{

	
			//hide the trash cans
			$('.remove-item').hide();
			$(this.el).find('.collection-description-empty,.collection-map-empty,.collection-map-location-go').hide();
			
			$(this.el).find('.save-data button').hide();
			$(this.el).find('button.edit').removeClass('active');
			$(this.el).find('.editing').removeClass('editing').attr('contenteditable', false);
			
			this.tagsView.exitEditMode();
		},

		remove:function()
		{
	
			//remove from DOM
			$(this.el).empty();

			$('.edit-btn').hide();
			$('.tab-content').find('.item-checkbox').hide();
			$('.tab-content').removeClass('low-top');
			$('.tab-content').css('top','auto');

			$('#zeega-right-column').removeClass('zeega-right-column-low');
			
		},
		
		editPublishSettings : function()
		{
			var a = new Items.Views.PublishSettings({model:this.model});
			$('body').append(a.render().el);
			a.show();
			
			return false;
		},
			
		getTemplate : function()
		{
				
				
				html = 
				
				'<div class="collection-head">'+
					'<div class="cover-image" style="background-image:url(<%= thumbnail_url %>)">';
			
			if(_.isNull(this.model.get('thumbnail_url')) || this.model.get('thumbnail_url') == '' ) html += '<div class="drag-to"><i class="icon-camera"></i>'+l.jda_collection_dragcover+'</div>';
			html+=			'<div class="cover-overlay">'+
							'<h1 style="width:90%"><%=title%></h1><h4>by: <a href="#" class="collection-filter-author"><%=media_creator_realname%></a> on <%= date_created %></h4>'+
						'</div>'+
					'</div>'+
	
					'<div class="row-fluid">'+
					

						'<div class="span6" style="position:relative">'+
							'<div class="meta-head">'+l.jda_collection_description+':';
							
							if(this.model.get('editable')) html+='<a href="#" class="edit" title="Edit collection details"><i class="icon-pencil jdicon-halfling-red"></i></a>';

							html+='</div>'+
							'<div class="collection-description"><%= text %></div>'+
							'<div class="collection-description-empty" style="left: 5px;position: absolute;top: 32px;color:#999;display:none;">'+l.jda_collection_editdesc+'</div>'+
							'<div class="meta-head">Tags:</div>'+
							'<div class="collection-tags"></div>'+
							
							'<div class="btn-toolbar">'+
								

									'<a class="btn btn-info btn-mini play pull-left" title="'+l.jda_collection_play+'"><i class="icon-play icon-white"></i></a>&nbsp;'+

		
								'<div class="btn-group save-data">'+
									'<button class="btn btn-success btn-mini save hide">'+l.jda_save+'</button>'+
									'<button class="btn btn-mini cancel hide">'+l.jda_cancel+'</button>'+
								'</div>'+
						
						
									'<div class="btn-group save-data pull-right">'+
									'<button class="btn btn-danger btn-mini delete-this-collection hide">'+l.jda_collection_delete+'</button>'+
								'</div>'+
							
							'</div>'+
							
							
						'</div>';
						
						
						if(this.model.get('editable'))
						{
						html+=
						'<div class="span3">'+

							'<div class="meta-head">Publish Settings<a href="#" class="edit-publish-settings" title="Edit publish settings"><i class="icon-pencil jdicon-halfling-red"></i></a></div>'+

							'<div><span class="publish-setting-type label <%= publishSettingsClass %>"><%= publishSettingsText %>:</span> <span class="publish-setting-description"><%= publishSettingsDesc %></span></div>'+
						'</div>';
						}
						else
						{
							html+=
							'<div class="span3">&nbsp;</div>';
						}
						html+=
						'<div class="span1">&nbsp;</div>'+
						

						'<div class="collection-map span3" >'+

						'</div>'+

				'</div>';

				return html;
			},

});

})(zeega.module("items"));