(function(Sequence){

	Sequence.Views.SequenceFrameDrawer = Backbone.View.extend({
		
		target : '#zeega-project-frame-list',

		initialize : function()
		{
			this.model.on('blur', this.undelegateEvents, this );
		},

		render: function()
		{
			var _this = this;
			this.setElement( $(this.target) );
			this.$el.html( this.getTemplate() );

			this.model.frames.each(function(frame){
				_this.$el.find('.list').append( frame.sequenceFrameView.render().el)
			})
			this.initEvents();
			
			return this;
		},
		
		initEvents : function()
		{
			var _this = this;
			//frame tray sortable and sorting events
			this.$el.find('.list').sortable({  
				
				axis : 'x',
				containment: 'parent',
				//placeholder: "frame-thumb ui-state-highlight",
				//forcePlaceholderSize:true,
				tolerance: 'pointer',
				distance: 10,

				stop : function()
				{
					var frameIDArray = _.map( _this.$el.find('.list').sortable('toArray') ,function(str){ return Math.floor(str.match(/([0-9])*$/g)[0]) });
					_this.model.onFrameReorder( frameIDArray );
				}
			});
			this.$el.find('.list').disableSelection();
			
		},

		events : {
			'click #zeega-add-frame' : 'addFrame'
		},

		addFrame : function()
		{
			this.model.addFrames( 1 );
			return false;
		},
		
		
		getTemplate : function()
		{
			var html = 
			
				"<ul class='list'></ul>"+
				"<div id='zeega-add-frame'><a href='#'>+</a></div>";

				//"<a href='#' id='add-frame'><img src='../../../images/addframe.png' height='25' width='25'/></a>";

			return html;
		}
	
	});

})(zeega.module("sequence"));
