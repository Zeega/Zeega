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

			this.model.frames.each(function(frame){
				_this.$el.find('.frame-list').append( frame.sequenceFrameView.render().el)
			})
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

				stop : function()
				{
					var frameIDArray = _.map( _this.$el.find('.frame-list').sortable('toArray') ,function(str){ return Math.floor(str.match(/([0-9])*$/g)[0]) });
					_this.model.onFrameReorder( frameIDArray );
				}
			});
			this.$el.find('.frame-list').disableSelection();
			
			this.$el.find('#add-frame').draggable({
				axis:'x',
				revert:true,

				start : function(e,ui)
				{
					this.num = Math.floor( ui.position.left / 55 );
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
					var frameCount = Math.floor( ui.position.left/55-this.num );
					_this.model.addFrames( frameCount );
				}
			})
			.click(function(){
				zeega.app.addFrame();
				return false;
			});
			
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
