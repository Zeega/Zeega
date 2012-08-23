	
	/*  discovery.view.item.collection-page */
	
	(function(Items) {


	Items.Views = Items || {};
	
	Items.Views.CollectionPage = Backbone.View.extend({
		
		el : $('#jda-collection-filter-new'),
	
		events: {
				'click a.play' : 'playCollection',
				'click button.share' : function(){alert('Opens publish process modal window');},
				'click a.edit' : 'editMetadata',
				'click button.save' : 'saveMetadata',
				'click button.cancel' : 'cancelEdits',
				'click .edit-archive-settings' : 'editArchiveSettings',
		},

			
		initialize: function ()
		{
	
				
				//for looking up address from lat/lon
				this.geocoder = new google.maps.Geocoder();
				this.isGeoLocated = !_.isNull( this.model.get('media_geo_latitude') );	
				this.isEditView = false;
				this.elemId = Math.floor(Math.random()*10000);
				this.render();
				if(!_.isUndefined(window._gaq)) _gaq.push(["_trackEvent", "JDA-Collection", "View", this.model.id.toString()]);
	
		  },

		 
		
		playCollection: function()
		{
			window.open(sessionStorage.getItem('apiUrl')+'collection/'+this.model.id+'/view');
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
			blanks.archiveSettingsClass = blanks.published == false ? '' : 'label-success';
			blanks.archiveSettingsText = blanks.published == false ? l.jda_collection_limited : l.jda_collection_public;
			blanks.archiveSettingsDesc = blanks.published == false ? l.jda_collection_limiteddesc : l.jda_collection_publicdesc;

		
		
		
			$(this.el).html( _.template( template, blanks ) );
	
			if (this.model.get('editable')){
				$(this.el).find('button.edit').show();
			}
			
			
			/***************************************************************************
				Map view
			***************************************************************************/
			
			var Discovery = zeega.module('discovery');
			var mapEditable = this.isEditView;
			this.locatorMapView = new Discovery.Views.LocatorMap({ model : this.model, isEditable : mapEditable});

			$(this.el).find('.geo').append(this.locatorMapView.render());

			if (this.locatorMapView.geoLocated){this.locatorMapView.addMap();}

			/***************************************************************************
				Tags view
			***************************************************************************/
			$(this.el).find('.tagsedit').empty().tagsInput({
				'interactive':this.model.get('editable') && this.isEditView,
				'defaultText':'add a tag',
				'onAddTag':function(){_this.updateTags('',_this)},
				'onRemoveTag':function(){_this.updateTags('',_this)},
				'removeWithBackspace' : false,
				'minChars' : 1,
				'maxChars' : 0,
				'placeholderColor' : '#C0C0C0',
			});		
			/***************************************************************************
				Look up location with reverse geocode
			***************************************************************************/
			if (!_.isUndefined(this.model.get('media_geo_latitude')) && !_.isUndefined(this.model.get('media_geo_longitude'))){
				this.geocoder.geocode( { 'latLng' : new google.maps.LatLng(this.model.get('media_geo_latitude'),this.model.get('media_geo_longitude')) }, function(results, status) {	
					if (status == google.maps.GeocoderStatus.OK) {
						if (results[0].formatted_address){
							$(_this.el).find('.jda-collection-filter-location').text( results[0].formatted_address );
							
						}
					}
				});
			}

			/***********
			MAP
			***********/
			
			//this.geocoder = new google.maps.Geocoder();
			//this.mapRendered=false;
			//this.isEditable = !_.isUndefined(this.options.isEditable) ? this.options.isEditable : true;
			

			
			this.cloudmadeUrl = 'http://{s}.tiles.mapbox.com/v2/mapbox.mapbox-streets/{z}/{x}/{y}.png',
			this.cloudmadeAttrib = '',
			this.cloudmade = new L.TileLayer(this.cloudmadeUrl, {maxZoom: 18, attribution: this.cloudmadeAttrib});
		
		
			
			if( this.isGeoLocated )
			{
				var values = {
					latitude : this.model.get('media_geo_latitude'),
					longitude : this.model.get('media_geo_longitude'),
				};
				this.latlng = new L.LatLng( values.latitude,values.longitude);
				var div = $(this.el).find('.jda-collection-map').get(0);
				this.map = new L.Map(div);
				this.map.setView(this.latlng, 8).addLayer(this.cloudmade);
				this.marker = new L.Marker(this.latlng,{draggable:true});
				this.marker.addEventListener( 'drag', this.updateLatLng, this );
				this.marker.addEventListener( 'dragend', this.updateLocation, this );
				this.map.addLayer(this.marker);
			} else{
				$('.jda-collection-map').addClass('jda-no-geo-info');
				$('.jda-no-geo-location-message').show();
			}
			
			
			$(this.el).find('.cover-image').droppable({
				drop : function(e,ui)
				{
					console.log('dropped', zeegaDiscover.app.draggedItem)
					var item = zeegaDiscover.app.draggedItem;
					var t = ( item.get('layer_type') == 'Image' ) ? item.get('uri') : item.get('thumbnail_url');
					_this.model.save({'thumbnail_url':t});
					$(_this.el).find('.cover-image').css('background-image','url('+t+')');
					$(_this.el).find('.drop-to').remove();
				}
			})

			//awkward click event
			
			$(this.el).find('.jda-collection-filter-author').click(function(){
				
				zeegaDiscover.app.goToUser(_this.model.get('user_id'));
			
			});

			this.$el.find('.edit, .edit-archive-settings, .play').tooltip({placement:'right'});

			return this;
		},
			
		editMetadata : function()
		{
				
			var _this  = this;
		
			//Show the remove stuff
			$('.jda-delete-item').unbind().click(function(){
				var doDelete = confirm(l.jda_collection_confirmdelete);
				if (doDelete){
					var itemID = $(this).closest('li').attr('id');
					_this.model.save({
										items_to_remove:itemID
																	},
					{
						url:zeegaDiscover.app.apiLocation + 'api/items/' + zeegaDiscover.app.resultsView.collectionFilter.model.id+'/items',
						success: function(model, response) { 
							zeegaDiscover.app.resultsView.collection.remove(zeegaDiscover.app.resultsView.collection.get(itemID));
						},
						error: function(model, response){
							
							console.log("Error updating item title.");
							console.log(response);
						}

					});
					return false;
				}else{
					return false;
				}
			})
			$('.jda-delete-item').show();
			
			
			$('.jda-delete-this-collection').unbind().click(function(){
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
			
			
			
			this.loadMap();
			
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
			$(this.el).find('.jda-collection-description').addClass('editing').attr('contenteditable', true);
			
			//Add placeholder text
			if( $(this.el).find('.jda-collection-description').is(':empty') ) {
				
				$(this.el).find('.jda-collection-description-empty').show();
				$(this.el).find('.jda-collection-description-empty').click(function(){$(this).hide();$(_this.el).find('.jda-collection-description').focus();});
			}
			$(this.el).find('.jda-collection-description').focus(function(){
				$(_this.el).find('.jda-collection-description-empty').hide();
				$(this).unbind('focus');
				$(this).trigger('focus');
			});
			if( $(this.el).find('.jda-collection-map-location').is(':empty') ) {
				$(this.el).find('.jda-collection-map-empty').show();
				$(this.el).find('.jda-collection-map-empty').click(function(){$(this).hide();$(_this.el).find('.jda-collection-map-location').focus();});
				$(this.el).find('.jda-collection-map-location').focus(function(){
						$(_this.el).find('.jda-collection-map-empty').hide();
						$(this).unbind('focus');
						$(this).trigger('focus');
				});
			}
			$(this.el).find('.jda-collection-map-location-go').show().click(function(){
				_this.geocodeString();
				return false;
			});
			$(this.el).find('.jda-collection-map-location').addClass('editing').attr('contenteditable', true).keypress(function(e){
				if(e.which==13)
				{
					_this.geocodeString();
					return false;
				}
			});
			
			return false
		},
			
		saveMetadata : function(){
				
				this.turnOffEditMode();
				this.saveFields();
			},
			
		saveFields : function(){
				var oldTitle = this.model.get("title");
				var _this=this;
				this.model.save({
					'title' : $(this.el).find('.cover-overlay h1').text(),
					'text' : $(this.el).find('.jda-collection-description').text()
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
					
						if(zeegaDiscover.app.myCollectionsDrawer.activeCollectionID == model.id){
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
			
		cancelEdits : function(){
			//ensure that it's editable, weird bug where editable value changes - wha??
			this.model.set({'editable':true});

			this.render();
			
			this.turnOffEditMode();
		},
			
		turnOffEditMode : function()
		{


			//hide the trash cans
			$('.jda-delete-item').hide();
			$(this.el).find('.jda-collection-description-empty,.jda-collection-map-empty,.jda-collection-map-location-go').hide();
			
			$(this.el).find('.save-data button').hide();
			$(this.el).find('button.edit').removeClass('active');
			$(this.el).find('.editing').removeClass('editing').attr('contenteditable', false);
		},
			
		loadMap : function(){
				if( !this.isGeoLocated )
				{
					this.latlng = new L.LatLng( 38.266667,140.866667 );
					var div = $(this.el).find('.jda-collection-map').get(0);
					this.map = new L.Map(div);
					this.map.setView(this.latlng, 8).addLayer(this.cloudmade);
					this.marker = new L.Marker(this.latlng,{draggable:true});
					this.marker.addEventListener( 'drag', this.updateLatLng, this );
					this.marker.addEventListener( 'dragend', this.updateLocation, this );
					this.map.addLayer(this.marker);
				}
				
				
			},
			
		updateLatLng : function(e){
			var latLng = e.target.getLatLng();
			$(this.el).find('.jda-collection-map-location').html( Math.floor(latLng.lat*1000)/1000 +','+ Math.floor(latLng.lng*1000)/1000)
		},
			
		updateLocation : function(e){
				var _this = this;
				var latlng = e.target.getLatLng();
				console.log(this,latlng)
				this.model.save({
					'media_geo_latitude':latlng.lat,
					'media_geo_longitude':latlng.lng
				});
				
				this.geocoder.geocode( { 'latLng' : new google.maps.LatLng(latlng.lat,latlng.lng) }, function(results, status) {	
					if (status == google.maps.GeocoderStatus.OK) {
						if (results[0].formatted_address)
						{
							console.log(results)
							$(_this.el).find('.jda-collection-map-location').html( results[ results.length-3 ].formatted_address );
						}
					}
				});
			},
			
		geocodeString : function(){
				var _this = this;
				var placeText = $(this.el).find('.jda-collection-map-location').text();
				this.geocoder.geocode( { 'address': placeText}, function(results, status) {
				
					if (status == google.maps.GeocoderStatus.OK)
					{
						console.log(results)
						_this.latlng=new L.LatLng(results[0].geometry.location.lat(),results[0].geometry.location.lng());
						
						_this.map.setView( _this.latlng,8);
						_this.marker.setLatLng(_this.latlng);
						console.log(results[0].geometry.location.lat(),results[0].geometry.location.lng())
						_this.model.save({
							'media_geo_latitude': results[0].geometry.location.lat(),
							'media_geo_longitude': results[0].geometry.location.lng()
						})
					}
					else console.log("Geocoder failed at address look for "+$(that.el).find('.locator-search-input').val()+": " + status);
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
		
		remove:function()
		{
	
			//remove from DOM
			$(this.el).empty();

			$('.jda-edit-btn').hide();
			$('.tab-content').find('.jda-item-checkbox').hide();
			$('.tab-content').removeClass('jda-low-top');
			$('.tab-content').css('top','auto');

			$('#zeega-right-column').removeClass('zeega-right-column-low');
			
		},
		
		editArchiveSettings : function()
		{
			console.log('edit the archive settings');
			
			var a = new Discovery.Modals.Views.ArchiveSettings({model:this.model});
			$('body').append(a.render().el);
			a.show();
			
			return false;
		},
			
		getTemplate : function(){
				
				
				html = 
				
				'<div class="jda-collection-head">'+
					'<div class="cover-image" style="background-image:url(<%= thumbnail_url %>)">';
			
			if(_.isNull(this.model.get('thumbnail_url')) || this.model.get('thumbnail_url') == '' ) html += '<div class="drag-to"><i class="icon-camera"></i>'+l.jda_collection_dragcover+'</div>';
			html+=			'<div class="cover-overlay">'+
							'<h1 style="width:90%"><%=title%></h1><h4>by: <a href="#" class="jda-collection-filter-author"><%=media_creator_realname%></a> on <%= date_created %></h4>'+
						'</div>'+
					'</div>'+
	
					'<div class="row-fluid">'+
					

						'<div class="span6" style="position:relative">'+
							'<div class="meta-head">'+l.jda_collection_description+':';
							
							if(this.model.get('editable')) html+='<a href="#" class="edit" title="'+l.jda_collection_editdetails+'"><i class="icon-pencil jdicon-halfling-red"></i></a>';

							html+='</div>'+
							'<div class="jda-collection-description"><%= text %></div>'+
							'<div class="jda-collection-description-empty" style="left: 5px;position: absolute;top: 32px;color:#999;display:none;">'+l.jda_collection_editdesc+'</div>'+

							//'<div class="jda-collection-tags"><a href="#">add tags</a></div>'+
							
							'<div class="btn-toolbar">'+
								

									'<a class="btn btn-info btn-mini play pull-left" title="'+l.jda_collection_play+'"><i class="icon-play icon-white"></i></a>&nbsp;'+

		
								'<div class="btn-group save-data">'+
									'<button class="btn btn-success btn-mini save hide">'+l.jda_save+'</button>'+
									'<button class="btn btn-mini cancel hide">'+l.jda_cancel+'</button>'+
								'</div>'+
						
						
									'<div class="btn-group save-data pull-right">'+
									'<button class="btn btn-danger btn-mini jda-delete-this-collection hide">'+l.jda_collection_delete+'</button>'+
								'</div>'+
							
							'</div>'+
							
							
						'</div>';
						
						
						if(this.model.get('editable'))
						{
						html+=
						'<div class="span3">'+

							'<div class="meta-head">'+l.jda_collection_archive+'<a href="#" class="edit-archive-settings" title="'+l.jda_collection_editarchive+'"><i class="icon-pencil jdicon-halfling-red"></i></a></div>'+

							'<div><span class="archive-setting-type label <%= archiveSettingsClass %>"><%= archiveSettingsText %>:</span> <span class="archive-setting-description"><%= archiveSettingsDesc %></span></div>'+
						'</div>';
						}
						else
						{
							html+=
							'<div class="span3">&nbsp;</div>';
						}
						html+=
						'<div class="span1">&nbsp;</div>'+
						

						'<div class="span3" style="position:relative">'+
							'<div class="jda-collection-map" style="text-align:center;"><h3 class="jda-no-geo-location-message" style="top:24px">'+l.jda_collection_nolocation+'</h3></div>'+

							'<div class="jda-collection-map-location"></div>'+
							'<a class="btn btn-mini jda-collection-map-location-go" style="margin-left:5px;margin-top:5px;display:none" href=".">go</a>'+
							'<div class="jda-collection-map-empty" style="position: relative;top: -17px;left:5px;color:#999;display:none;">'+l.jda_collection_editmap+'</div>'+
						'</div>'+

				'</div>';

				return html;
			},

});

})(zeega.module("items"));