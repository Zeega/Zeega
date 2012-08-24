(function(Sequence){

	Sequence.Views.SequenceFrameDrawer = Backbone.View.extend({
		
		id : 'frame-drawer',
		
		initialize : function()
		{
		},
		
		render: function()
		{
			var _this = this;
			this.$el.html( this.getTemplate() );
			_.each( this.model.get('frames'), function(frameID){
				var frame = zeega.app.project.frames.get(frameID);
				_this.$el.find('.frame-list').append( frame.sequenceFrameView.render().el)
			});
			
			this.initEvents();
			
			return this;
		},
		
		renderToTarget : function()
		{
			$('#'+ this.id).replaceWith( this.render().el );
		},
		
		initEvents : function()
		{
			var _this = this;
			//frame tray sortable and sorting events
			this.$el.find('.frame-list').sortable({  
				
				axis : 'x',
				containment: '#frame-drawer',
				placeholder: "frame-thumb ui-state-highlight",
				forcePlaceholderSize:true,
				tolerance: 'pointer',
				distance: 10,

				stop : function(){ _this.updateFrameOrder() }
			});
			this.$el.find('.frame-list').disableSelection();
			
			this.$el.find('#add-frame').draggable({
				axis:'x',
				revert:true,

				start : function(e,ui)
				{
					this.num= Math.floor( ui.position.left / 55 );
				},
				containment : 'parent',
				helper :function(){ return $('<div>') },

				drag : function(e,ui)
				{
					var temp = Math.floor( ui.position.left / 55 );
					if(this.num != temp)
					{
						var _this = this;
						$('.ghost-frame').remove();
						_.times(temp-this.num, function(){
							$('#frame-drawer ul').append( $('<li class="frame-thumb ghost-frame">') );
						})
					}
				},

				stop : function(e,ui)
				{
					$('.ghost-frame').remove();
					_.times( Math.floor( ui.position.left/55-this.num ), function(){ zeega.app.addFrame() });
				}
			})
			.click(function(){
				zeega.app.addFrame();
				return false;
			});
			
		},
		
		updateFrameOrder : function()
		{
			var frameIDArray = _.map( this.$el.find('.frame-list').sortable('toArray') ,function(str){ return Math.floor(str.match(/([0-9])*$/g)[0]) });
			this.model.save({'frames': frameIDArray});
		},
		
		getTemplate : function()
		{
			var html = 
			
				"<ul class='frame-list unstyled'></ul>"+
				"<a href='#' id='add-frame'><img src='../../../images/addframe.png' height='25' width='25'/></a>";

			return html;
		}
	
	});

})(zeega.module("sequence"));
