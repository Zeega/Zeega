	(function(Dashboard) {

	Dashboard.Projects = Dashboard.Projects || {};
	Dashboard.Projects.Views = Dashboard.Projects || {};
	
	Dashboard.Projects.Views.Project = Backbone.View.extend({
		
		className : 'project-card span7',
		
		loaded:false,
		
		events: {
			
			/*'click a.edit' : 'editMetadata',
			'click button.save' : 'saveMetadata',
			'click button.cancel' : 'cancelEdits',*/
			
			'click .zeega-link':'playProject',
			'click .project-delete':'delete',
		},
		
		initialize: function () {

		},
		
		delete: function(){
			if(confirm('Delete Project?')){
				$(this.el).fadeOut(); 
				$.ajax({
						url: sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'api/projects/'+this.model.id,
						type: 'DELETE',
						success: function(){
						console.log('done');
					}
				});
			}
			
			return false;
		
		
		},
		render: function(done)
		{
			var _this = this;

			/***************************************************************************
				Put template together
			***************************************************************************/
			var template = this.getTemplate();
			var blanks = this.model.attributes;
			if (blanks['cover_image'] == ""){
				blanks['cover_image'] = 'http://static.zeega.org/community/templates/default_project_cover.png';
			}

			$(this.el).html( _.template( template, blanks ) );

			return this;
		},
		
    	playProject:function(){
    		
    			$('#zeega-player-'+this.model.id).remove();
				var docElm= document.createElement('iframe');
				docElm.setAttribute('id','zeega-player-'+this.model.id);
				document.getElementById('zeega-embed').appendChild(docElm);
				$(docElm).css({width:'0px',height:'0px'});
    			
    		
    			
    			
    			docElm.setAttribute('src',sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'project/'+this.model.id+'/view');
					
				if (docElm.requestFullscreen) docElm.requestFullscreen();
				else if (docElm.mozRequestFullScreen) docElm.mozRequestFullScreen();
				else if (docElm.webkitRequestFullScreen) docElm.webkitRequestFullScreen();
				else{
					document.getElementById('zeega-link').setAttribute('href',sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'project/'+this.model.id+'/view');
					document.getElementById('zeega-link').setAttribute('target','blank');
					document.getElementById('zeega-link').setAttribute('onclick','');
				
				}
    		},
	
		
		getTemplate : function()
		{
			html = 	
			
						'<div class="row">'+
						
							
							'<div id="zeega-embed" class="span7 project-image" style="background:url(<%= cover_image %>) no-repeat center center;background-size:cover">';
								if (zeegaDashboard.app.editable){ html+=
								'<a class="btn btn-mini btn-inverse edit community-edit-button" href="'+sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'site/home/project/'+ this.model.id+'" style="top:0;left:400px"><i class="icon-pencil icon-white"></i> edit</a>'+
								'<a class="btn btn-mini btn-danger community-edit-button project-delete" href="#" style="top:0;left:340px">X delete</a>';
								
								}
								html+='<div style="padding:10px 0 0 10px;margin-top:106px;height:60px;background-color:rgba(0,0,0,0.3);">'+
									'<div class="pull-left" style="margin-right:20px">'+
										'<h4><%= title %></h4>'+
										'<h6><%= date_created %></h6>'+
									'</div>'+
									'<a class="zeega-link" href="#">'+
										'<img class="pull-left" style="width:60px;position:relative;z-index:2" src="'+sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'images/embed_play.png">'+
									'</a>'+
								'</div>'+
								'<div class="gradient" style="top:-176px;"></div>'+
							'</div>'+
							
							
						
						'</div>';
			
			return html;
		},
		

	});

})(zeegaDashboard.module("dashboard"));