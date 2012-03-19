(function(Layer){

	Layer.Views.Visual = Backbone.View.extend({
		
		className : 'visual-element',
		
		draggable : true,
		linkable : true,
		
		initialize : function()
		{
			var _this = this;
			
			this.model.on('rendered_editor', this.onRender, this);
			this.model.on('unrendered_editor', this.onUnrender, this);
			this.model.on('controls_open', this.onControlsOpen, this);
			this.model.on('controls_closed', this.onControlsClosed, this);
			this.model.on('remove_from_frame', this.remove, this );
			
			this.attr = this.model.get('attr')
			
			$(this.el).addClass('layer-'+ this.model.layerType.toLowerCase() );
			
			$(this.el).css({
				'position' : 'absolute',
				'width' : _this.attr.width+'%',
				'opacity' : _this.attr.opacity,
				'top' : _this.attr.top +'%',
				'left' : _this.attr.left+'%'
			});
		},
		
		onRender : function()
		{
			if(this.draggable) this.makeDraggable();
		},
		
		onUnrender : function()
		{
		},
		
		onControlsOpen : function()
		{
			console.log('!!!!!!controls open')
		},
		
		onControlsClosed : function()
		{
			console.log('!!!!!!controls closed')
			
		},
		
		removeFromEditor: function()
		{
			this.remove();
			
		},
		
		makeDraggable : function()
		{
			var _this = this;
			$(this.el).draggable({
				stop : function(e,ui)
				{
					//convert to % first // based on parent
					var topCent = ( ui.position.top / $(this).parent().height() ) * 100;
					var leftCent = ( ui.position.left / $(this).parent().width() ) * 100;
					
					_this.model.update({
						top: topCent,
						left: leftCent
					})
				}
			});
		}

	});

})(zeega.module("layer"));