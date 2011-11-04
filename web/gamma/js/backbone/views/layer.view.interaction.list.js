var InteractionLayerListView = Backbone.View.extend({
	tagName : 'li',
	
	
	initialize : function(options)
	{
		this.model.bind( 'change', function(){ console.log('layer change!!') });
	},
	
	//draws the controls
	render : function()
	{
		
		this.model.bind('remove',this.remove);
		var _this = this;
		var text = this.model.get('text');
		var type = this.model.get('type');
		
		
		if( !this.model.get('attr') ) this.model.set({ attr : this.model.layerClass.defaultAttributes });
		
		console.log('interactive******');
		this.model.layerClass.load(this.model);
		
		this.model.layerClass.drawPreview();
		
		$(this.el).html( this.model.layerClass.drawControls() );
		
		return this;
		
	}
});


var InteractionLayerListViewCollection = Backbone.View.extend({

	el : $('#layers-list-interaction'),
	
	initialize : function()
	{
		_(this).bindAll('add', 'remove');
		this._layerViews = [];
	},
	
	add : function ( layer )
	{
		layer.url = Zeega.url_prefix+'layers/'+ layer.id;
		
		var lv = new InteractionLayerListView({ model : layer });
		this._layerViews.push(lv);
		if(this._rendered) $(this.el).prepend(lv.render().el);
	},
	
	remove : function(layer)
	{
		console.log('rmvCollection')
		
		//var viewToRemove = this; // _(this._layerViews.select(function(lv){return lv.model === model;}))[0];
		this._layerViews = _(this._layerViews).without(this);
		
		Zeega.currentNode.noteChange();
		
	},
	
	
	render : function()
	{
		this._rendered = true;
		var _this = this;
		
		//clear out any old stuff inside this.el
		$(this.el).empty();
		//add EACH model's view to the _this.el and render it
		_.each(this._layerViews, function(layer){ $(_this.el).prepend(layer.render().el) });
		
		return this;
	}
	
});


var iLayerTemplate = 	"<div id='i-layer-template' class='i-layer clearfix layer-wrapper'>";
iLayerTemplate +=			"<div class='i-layer-uber-bar clearfix' onclick='expandLayer(this);return false;'>";
iLayerTemplate +=				"<div class='layer-icon'>";
iLayerTemplate +=					"<span class='asset-type-icon ui-icon ui-icon-pin-w'></span>";
iLayerTemplate +=				"</div>";
iLayerTemplate +=				'<div class="i-layer-title">Layer Name</div>';
iLayerTemplate +=				"<div class='layer-uber-controls'>";
iLayerTemplate +=					"<span id='delete-layer' class='i-layer-delete ui-icon ui-icon-trash' ></span>";
iLayerTemplate +=				"</div>";
iLayerTemplate +=			"</div>";
iLayerTemplate +=			"<div class='hidden layer-content clearfix'>";
iLayerTemplate +=				"<div id='controls' class='twilio-controls controls'>";
iLayerTemplate +=				"<br />";
iLayerTemplate +=				"<form id='layer-persist'>";
iLayerTemplate +=					"<input id='persist' type='checkbox' name='vehicle' value='persist' /> <label for='persist'>Persist layer to route</label>";
iLayerTemplate +=				"</form>";
iLayerTemplate +=			"</div>";
iLayerTemplate +=		"</div>";
