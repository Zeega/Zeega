	(function(Dashboard) {

	Dashboard.Projects = Dashboard.Projects || {};
	Dashboard.Projects.Views = Dashboard.Projects.Views || {};
	
	Dashboard.Projects.Views.Project = Backbone.View.extend({
		
		className : 'project-card span7',
		events: {
			'click .project-delete':'deleteProject'
		},
		
		render: function(done)
		{
			var blanks = this.model.attributes;
			if (blanks['cover_image'] === "")blanks['cover_image'] = 'http://static.zeega.org/community/templates/default_project_cover.png';
			if(_.isNull(this.model.get('item_id'))) blanks['view_url']= sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + 'projects/' +this.model.id + '/preview';
			else blanks['view_url']=sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + this.model.get('item_id');

			$(this.el).html( _.template( this.getTemplate(), blanks ) );

			return this;
		},

		deleteProject: function () {
			if(confirm('Delete Project?')){
				$(this.el).fadeOut();
				$.ajax({
						url: sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'api/projects/'+this.model.id,
						type: 'DELETE',
						success: function(){
					}
				});
			}
			return false;
		},
		getTemplate : function()
		{
			var html =
						'<div class="row">'+
							'<div id="zeega-embed" class="span7 project-image" style="background:url(<%= cover_image %>) no-repeat center center;background-size:cover">'+
								'<a class="zeega-link" href="<%= view_url %>" target="_blank">'+
									'<img class="pull-left" style="width:60px;position:relative;z-index:2" src="'+sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'images/embed_play.png">'+
								'</a>';
								
								if (zeega.dashboard.app.editable)
								{
									html+=
										'<div class="admin-actions btn-group">'+
											'<a class="btn btn-mini btn-inverse edit community-edit-button" href="'+sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'editor/'+ this.model.id+'"><i class="icon-pencil icon-white"></i> edit</a>'+
											'<a class="btn btn-mini btn-danger community-edit-button project-delete" href="#" ><i class="icon-remove-circle icon-white"></i> delete</a>'+
										'</div>';
								}
								if( this.model.get("title") !== "" ){
									html+=
										'<div style="padding:10px 0 0 10px;margin-top:106px;height:60px;background-color:rgba(0,0,0,0.3);">'+
											'<div class="pull-left" style="margin-right:20px">'+
												'<h4><%= title %></h4>'+
												'<h6><%= date_created %></h6>'+
											'</div>'+
											
										'</div>'+
										'<div class="gradient" style="top:-176px;"></div>';
								} else{
									html+='<div class="gradient" ></div>';
								}
								
								html+=
								
								'<div id="embed-wrapper"></div>'+
							'</div>'+
						'</div>';
			return html;
		}
	});

})(zeega.dashboard.module("dashboard"));