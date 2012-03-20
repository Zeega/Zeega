(function(Layer){



	Layer.Video = Layer.Model.extend({
			
		layerType : 'Video',

		defaultAttributes : 
		{
			'title' : 'Video Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'volume' : 50,
			'in'  : 0,
			'out' : 0,
			'opacity':1,
			'dimension':1.5,
			'citation':true,
		},

		init : function(){},

	});
	
	Layer.Views.Controls.Video = Layer.Views.Controls.extend({
		
		render : function()
		{
			var targetDiv = new Layer.Views.Lib.Target({
				idName : 'video-controls-'+ this.model.id,
				className : 'video-controls'
			});
			
			var volumeSlider = new Layer.Views.Lib.Slider({
				property : 'volume',
				model: this.model,
				label : 'Volume',
				min : 0,
				max : 100,
				css : false
			});
			
			var scaleSlider = new Layer.Views.Lib.Slider({
				property : 'width',
				model: this.model,
				label : 'Scale',
				suffix : '%',
				min : 1,
				max : 200,
			});
			
			var opacitySlider = new Layer.Views.Lib.Slider({
				property : 'opacity',
				model: this.model,
				label : 'Opacity',
				step : 0.01,
				min : .05,
				max : 1,
			});
			
			this.controls
				.append( targetDiv.getControl() )
				.append( volumeSlider.getControl() )
				.append( scaleSlider.getControl() )
				.append( opacitySlider.getControl() );
			
			return this;
		
		},
		
		onControlsOpen : function()
		{
			console.log('init video controls')
			this.$el.find('.video-controls').html( this.getTemplate() );
		},
		
		onControlsClosed : function()
		{
			console.log('video controls closed : controls')
		},
		
		
		getTemplate : function()
		{
			var html = 
			
			'<div class="plyr-time-wrapper">'+
				'<div class="plyr-cuein-time"></div>'+
				'<div class="plyr-cueout-time"></div>'+
			'</div>'+
			'<div class="plyr-timeline-wrapper">'+
				'<div class="plyr-button-wrapper">'+
					'<div class="plyr-button plyr-play"></div>'+
				'</div>'+
				'<div class="plyr-timeline">'+
					'<div class="plyr-cuein-bar plyr-bar"></div>'+
					'<div class="plyr-time-bar plyr-bar"></div>'+
					'<div class="plyr-cueout-bar plyr-bar"></div>'+
					'<div class="plyr-cuiein-scrubber plyr-edit-scrubber">'+
						'<div class="plyr-scrubber-select"></div>'+
						'<div class="plyr-arrow-down-green"></div>'+
					'</div>'+
					'<div class="plyr-scrubber plyr-edit-scrubber">'+
						'<div class="plyr-hanging-box"><div>'+
					'</div>'+
					'<div class="plyr-cueout-scrubber plyr-edit-scrubber">'+
						'<div class="plyr-scrubber-select"></div>'+
						'<div class="plyr-plyr-arrow-down"></div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="plyr-time-wrapper">'+
				'<span class="plyr-time"></span>'+
			'</div>';
			
			return html;
		}
		
	});

	Layer.Views.Visual.Video = Layer.Views.Visual.extend({
		
		draggable : true,
		linkable : true,
		
		render : function()
		{
			console.log(this.attr)
			var img = $('<img>')
				.attr('src', this.attr.thumbnail_url)
				.css({'width':'100%'});

			$(this.el).html( img );
			
			this.model.trigger('ready',this.model.id)
			
			return this;
		},
		
		onControlsOpen : function()
		{
			console.log('video controls open : visual')
			//replace with the actual video object
		},
		
		onControlsClosed : function()
		{
			console.log('video controls closed : visual')
		}
		
	});
	
	Layer.Youtube = Layer.Video.extend();
	Layer.Views.Controls.Youtube = Layer.Views.Controls.Video.extend();
	Layer.Views.Visual.Youtube = Layer.Views.Visual.Video.extend();
	
/*	
	Layer.Views.Player.Image = Layer.Views.Visual.extend({
		
		render : function()
		{
			var img = $('<img>')
				.attr('src', this.attr.url)
				.css({'width':'100%'});

			$(this.el).html( img );
				
			return this;
		}
	});
*/	
})(zeega.module("layer"));