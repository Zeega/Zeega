(function(Dashboard) {

	Dashboard.Users = Dashboard.Users || {};
	Dashboard.Users.Views = Dashboard.Users || {};
	
	Dashboard.Users.Views.ProfilePage = Backbone.View.extend({
		
		el : $('#dashboard-profile'),
		
		
		events: {
			
			'click a.edit' : 'editMetadata',
			'click button.save' : 'saveMetadata',
			'click button.cancel' : 'cancelEdits',
		},
		
		initialize: function () {

			


		},
		render: function(done)
		{
			var _this = this;

			

			/***************************************************************************
				Put template together
			***************************************************************************/
			var template = this.getTemplate();
			var blanks = this.model.attributes;

			
			var joinDate=new Date(blanks['created_at']);
			blanks['join_date'] = joinDate.getMonth() + " " + joinDate.getFullYear();

			$(this.el).html( _.template( template, blanks ) );

			
			
			$('#user-image-upload-file').change(function(){
				
				//_this.fileUpload($(this).attr('id'));
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
			$(this.el).find('.dashboard-bio').text($(this.el).find('.dashboard-bio').text().substring(0,250));
			this.model.save({
				
				'display_name' : $(this.el).find('.dashboard-name').text(),
				'bio' : $(this.el).find('.dashboard-bio').text().substring(0,250),
				'thumbnail_url' : $(this.el).find('.dashboard-profile-photo').attr('src'),
				//background url updating 
				
			})
		},
		
		cancelEdits : function()
		{
			this.turnOffEditMode();
		},
		
		turnOffEditMode : function()
		{
			this.$el.find('.user-image-upload , .save-data button').hide();
			this.$el.find('.edit').show();

			$(this.el).find('button.edit').removeClass('active');
			$(this.el).find('.editing').removeClass('editing').attr('contenteditable', false);
			
			
		},
		editMetadata : function()
		{
			console.log('edit the metadata!')
			var _this  = this;
			
			this.$el.find('.user-image-upload, .save-data button').show();
			this.$el.find('.edit').hide();
			
			$(this.el).find('button.edit').addClass('active');
			$(this.el).find('.dashboard-bio, .dashboard-name').addClass('editing').attr('contenteditable', true);
			
			
			
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
			
			$('.dashboard-profile-photo').fadeTo(500,0.5);
			//$('.profile-image-wrapper').spin('tiny');
			
			jQuery.handleError=function(a,b,c,d)
			{
				console.log('ERROR UPLOADING',a,b,c,d)
				$('.dashboard-profile-photo').fadeTo(500,1);
				//$('.profile-image-wrapper').spin(false)
				
				$('#user-image-upload-file').change(function(){
					console.log('upload image some more!!!!!')
					_this.fileUpload();
				})
				
			};
						
			$.ajaxFileUpload({
				//user_bg.php
				url:"http://dev.zeega.org/static/community/scripts/user_profile.php?id="+this.model.id,
				//url:sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + 'api/users/'+this.model.id+'/profileimage', 
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
						//TODO get model & update thumbnail_url property
						$('.dashboard-profile-photo')
							.attr('src',data.thumbnail_url)
							.fadeTo(500,1);
						//$('.profile-image-wrapper').spin(false);
						
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
		
		
		
		getTemplate : function()
		{
			html = 	'<div class="span6 author-photo" style="height:auto">'+
						'<div class="profile-image-wrapper">'+
							'<img src="<%= thumbnail_url %>" alt="author-photo" width="400" height="225" class="dashboard-profile-photo">'+
						'</div>'+
						'<div class="gradient">'+
						'</div>'+
					
					'</div>'+
					
					'<div class="span8 author-bio" style="height:auto">'+
					
						'<div>'+
							'<h3 class="dashboard-name"><%= display_name%></h3>'+
							'<a class="edit pull-right" href="">Edit</a>'+

							'<h6>Authored 5 projects since joining on <%= join_date %></h6>'+
							'<div>'+
								'<p class="card dashboard-bio"><%= bio %></p>'+
								'<div class="user-image-upload hide">update your profile picture <input id="user-image-upload-file" type="file" size="40" name="imagefile"></input></div>'+
								//'<div class="user-image-upload hide" >update your background profile picture <input id="user-image-upload-background" type="file" size="40" name="imagefile"></input></div>'+
								'<div class="btn-group save-data">'+
									'<button class="btn btn-success btn-mini save hide">save</button>'+
									'<button class="btn btn-mini cancel hide">cancel</button>'+
								'</div>'+
								
							'</div>'+
						'</div>'+	
						'<div class="shadow">'+
						'</div>'+
					
					'</div>';
			
			return html;
		},
		

	});

})(zeegaDashboard.module("dashboard"));