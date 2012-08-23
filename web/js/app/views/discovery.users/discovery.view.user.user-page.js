(function(Discovery) {

	Discovery.Users = Discovery.Users || {};
	Discovery.Users.Views = Discovery.Users || {};
	
	Discovery.Users.Views.UserPage = Backbone.View.extend({
		
		el : $('#jda-user-filter'),
		geolocated : false,
		
		events: {
			
			'click a.edit' : 'editMetadata',
			'click button.save' : 'saveMetadata',
			'click button.cancel' : 'cancelEdits',
		},
		
		initialize: function () {

			//for looking up address from lat/lon
			this.geocoder = new google.maps.Geocoder();

			if(this.model.get('locationLatitude')) this.geolocated = true;
			if(!_.isUndefined(window._gaq)) _gaq.push(["_trackEvent", "JDA-User", "View", this.model.id.toString()]);
			this.render();

		},
		render: function(done)
		{
			var _this = this;

			

			/***************************************************************************
				Put template together
			***************************************************************************/
			var template = this.getTemplate();
			var blanks = this.model.attributes;

			if (blanks["created_at"] == null){
				blanks["created_at"] = "March 20th, 2011";
			}
			$(this.el).html( _.template( template, blanks ) );

			$(this.el).find('.jda-user-filter-edit-profile-image').click(function(){
				alert('Edits profile image for user');
				return false;
			});

			/***************************************************************************
				Map
			***************************************************************************/
			

			if(this.geolocated&&1==2)
			{
				this.cloudmadeUrl = 'http://{s}.tiles.mapbox.com/v2/mapbox.mapbox-streets/{z}/{x}/{y}.png',
		    	this.cloudmadeAttrib = '',
		   		this.cloudmade = new L.TileLayer(this.cloudmadeUrl, {maxZoom: 18, attribution: this.cloudmadeAttrib});
			
				var values = {
					latitude : this.model.get('locationLatitude') == null ? 38.266667 : this.model.get('locationLatitude'),//this.model.get('media_geo_latitude'),
					longitude : this.model.get('locationLongitude') == null ? 140.866667 : this.model.get('locationLongitude'),
				};
				this.latlng = new L.LatLng( values.latitude,values.longitude);
				var div = $(this.el).find('.jda-user-map').get(0);
				this.map = new L.Map(div);
				this.map.setView(this.latlng, 8).addLayer(this.cloudmade);
				this.marker = new L.Marker(this.latlng,{draggable:true});
				this.marker.addEventListener( 'drag', this.updateLatLng, this );
				this.marker.addEventListener( 'dragend', this.updateLocation, this );
				this.map.addLayer(this.marker);
		
				this.geocoder.geocode( { 'latLng' : new google.maps.LatLng(values.latitude,values.longitude) }, function(results, status) {	
					if (status == google.maps.GeocoderStatus.OK) {
						if (results[0].formatted_address)
						{
							$(_this.el).find('.jda-collection-map-location').html( results[ results.length-3 ].formatted_address );
						}
					}

				});
			}

			/***************************************************************************
				Edit button
			***************************************************************************/
			if (this.model.get('editable')){
				$(this.el).find('button.edit').show();
				
			}
			
			$('#user-image-upload-file').change(function(){
				console.log('upload image!!!')
				_this.fileUpload();
			})
			

			return this;
		},
		saveMetadata : function()
		{
			this.turnOffEditMode();
			this.saveFields();
			
		},
		
		saveFields : function()
		{
			$(this.el).find('.jda-user-filter-description').text($(this.el).find('.jda-user-filter-description').text().substring(0,250));
			this.model.save({
				
				'bio' : $(this.el).find('.jda-user-filter-description').text().substring(0,250),
				'thumbnail_url' : $(this.el).find('.jda-user-filter-profile-image').attr('src'),
				
			})
		},
		
		cancelEdits : function()
		{
			this.turnOffEditMode();
		},
		
		turnOffEditMode : function()
		{
			this.$el.find('.user-image-upload , .save-data button').hide();
			$('.jda-delete-collection').hide();

			$(this.el).find('button.edit').removeClass('active');
			$(this.el).find('.editing').removeClass('editing').attr('contenteditable', false);
			$(this.el).find('.jda-user-map-location').removeClass('editing').attr('contenteditable', false);
			
		},
		editMetadata : function()
		{
			console.log('edit the metadata!')
			var _this  = this;
			
			this.$el.find('.user-image-upload, .save-data button').show();
			
			//Show the remove stuff
			$('.jda-delete-collection').unbind().click(function(){
				var doDelete = confirm(l.jda_collection_confirmdelete);
				if (doDelete){
					var itemID = $(this).closest('li').attr('id');
					var itemToDelete = zeega.discovery.app.resultsView.collection.collectionsCollection.get(itemID);
					console.log('deleting ' + itemID + itemToDelete.get('title'))

					//KILL KILL
					itemToDelete.destroy();
					
					return false;
				}else{
					return false;
				}
			})
			$('.jda-delete-collection').show();
			
			$(this.el).find('button.edit').addClass('active');
			$(this.el).find('.jda-user-filter-description').addClass('editing').attr('contenteditable', true);
			
			
			$(this.el).find('.jda-user-map-location').addClass('editing').attr('contenteditable', true).keypress(function(e){
				if(e.which==13)
				{
					_this.geocodeString();
					return false;
				}
			});
			return false
		},
		
		fileUpload : function()
		{
/*
		prepareing ajax file upload
		url: the url of script file handling the uploaded files
		fileElementId: the file type of input element id and it will be the index of  $_FILES Array()
		dataType: it support json, xml
		secureuri:use secure protocol
		success: call back function when the ajax complete
		error: callback function when the ajax failed
*/
			var _this = this;
			$('.jda-user-filter-profile-image').fadeTo(500,0.5);
			$('.profile-image-wrapper').spin('tiny');
			
			jQuery.handleError=function(a,b,c,d)
			{
				console.log('ERROR UPLOADING',a,b,c,d)
				$('.jda-user-filter-profile-image').fadeTo(500,1);
				$('.profile-image-wrapper').spin(false)
				
				$('#user-image-upload-file').change(function(){
					console.log('upload image some more!!!!!')
					_this.fileUpload();
				})
				//_this.$el.prepend('<div class="alert">There was a problem with your file upload. Please try again.</div>');
				//_.delay(function(){ $('.alert').remove() }, 2000 );
			};
						
			$.ajaxFileUpload({
				url:zeega.discovery.app.apiLocation + 'api/users/'+this.model.id+'/profileimage', 
				secureuri:false,
				fileElementId:'user-image-upload-file',
				dataType: 'json',
				success: function (data, status)
				{
					if(typeof(data.error) != 'undefined')
					{
							console.log('ERROR',data);
					}
					else
					{
						$('.jda-user-filter-profile-image')
							.attr('src',data.thumbnail_url)
							.fadeTo(500,1);
						$('.profile-image-wrapper').spin(false);
						
						$('#user-image-upload-file').change(function(){
							console.log('upload image again!!!!!!')
							_this.fileUpload();
						})
						
					}
	
				},
				handleError: function (data, status, e)
				{
					console.log('ERROR!!',e);
				}
			})
			
			return false;

		},
		
		geocodeString : function()
		{
			var _this = this;
			var placeText = $(this.el).find('.jda-user-map-location').text();
			this.geocoder.geocode( { 'address': placeText}, function(results, status) {
			
				if (status == google.maps.GeocoderStatus.OK)
				{
					_this.latlng=new L.LatLng(results[0].geometry.location.lat(),results[0].geometry.location.lng());
					
					_this.map.setView( _this.latlng,8);
					_this.marker.setLatLng(_this.latlng);
					
					_this.model.save({
						'location_latitude': results[0].geometry.location.lat(),
						'location_longitude': results[0].geometry.location.lng()
					})
				}
				else console.log("Geocoder failed at address look for "+$(that.el).find('.locator-search-input').val()+": " + status);
			});
		},
		remove:function()
		{
			console.log("Users.UserPage.remove");
			//remove from DOM
			$(this.el).empty();
			$('.jda-separate-collections-and-items').hide();
		},
		
		getTemplate : function()
		{
			html = 	'<div class="row-fluid" >'+
			
		
				'<div class="profile-image-wrapper span2" style="width:155px">'+
					'<img class="pull-left jda-user-filter-profile-image" src="<%=thumbnail_url%>" alt="" style="width:160px;height:160px;margin-right:10px;border: 1px solid grey;" >'+
				'</div>'+
				'<div class="span6">'+
					'<h1 class="jda-user-filter-name"><%=display_name%></h1>'+
					'<h5>Joined on <%= created_at %></h5>'+
					'<div class="jda-user-filter-description"><%=bio%></div>'+
					'<div class="user-image-upload hide" >update your profile picture <input id="user-image-upload-file" type="file" size="40" name="imagefile"></input></div>';
			
			if(this.model.get('editable')) html += '<a href="#" class="edit"><i class="icon-pencil"></i></a>';
			
			html+=	'<div class="btn-group save-data">'+
						'<button class="btn btn-success btn-mini save hide">save</button>'+
						'<button class="btn btn-mini cancel hide">cancel</button>'+
					'</div>'+

				'</div>';
				
				
					
			html+= 	 '<div class="span2">'+
							//'<div><div class="jda-user-map" style="border:1px solid #aaa"></div></div>'+
							//'<div class="jda-user-map-location"></div>'+
						'</div>'+
					'</div>';
			
			return html;
		},
		

	});

})(zeega.module("discovery"));