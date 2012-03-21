(function(Layer){

	Layer.Views.Visual = Backbone.View.extend({
		
		className : 'visual-element',
		
		draggable : true,
		linkable : true,
		
		initialize : function()
		{
			var _this = this;
			
			this.model.on('rendered_editor', this.onRender, this);
			this.model.on('unrender_editor', this.unrender, this);
			
			this.model.on('unrendered_editor', this.onUnrender, this);
			this.model.on('controls_open', this.onControlsOpen, this);
			this.model.on('controls_closed', this.onControlsClosed, this);
			this.model.on('remove_from_frame', this.remove, this );
			
			this.attr = this.model.get('attr')
			
			$(this.el).addClass('layer-'+ this.model.layerType.toLowerCase() );
			
			$(this.el).css({
				'position' : 'absolute',
				'overflow' : 'hidden',
				
				'width' : _this.attr.width+'%',
				'opacity' : _this.attr.opacity,
				
				// if previewing, then set way off stage somewhere
				'top' : (this.model.player) ? '-1000%' : _this.attr.top +'%',
				'left' : (this.model.player) ? '-1000%' : _this.attr.left+'%'
			});
		},
		
		onRender : function()
		{
			if(this.draggable) this.makeDraggable();
		},
		
		moveOnStage :function()
		{
			$(this.el).css({
				'top' : this.attr.top +'%',
				'left' : this.attr.left+'%'
			});
		},
		
		moveOffStage :function()
		{
			$(this.el).css({
				'top' : '-1000%',
				'left' : '-1000%'
			});
		},
		
		updateZIndex : function( z )
		{
			$(this.el).css({ 'zIndex' : 'z' });
		},
		
		unrender : function()
		{
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