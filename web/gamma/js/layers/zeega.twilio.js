
/************************************

	TWILIO LAYER CHILD CLASS
	

************************************/

var TwilioLayer = ProtoLayer.extend({
	
	interaction: true,
	
	defaultAttributes : 
	{
		'title' : 'Twilio Layer',
		'phone'  : 5555555555
	},
						
	drawControls : function(template)
	{
		console.log("************twilio draw preview");
		var _this = this;
		var controls = $(iLayerTemplate);
		
		controls.find('.i-layer-title').html(this.model.get('type')+ " Layer");
		
		controls.find('#delete-layer').click(function(){
			//verify you with alert
			if( confirm('Delete Layer?') )
			{
				//remove the layer controls
				controls.remove();
				//remove the workspace preview

				Zeega.removeLayerFromNode( Zeega.currentNode, _this.model );
			}
			return false;
		});
		
		controls.find('#controls').html(this.getTemplate());
		
		
		
		$('#interactive-workspace').append(controls);

	},
	
	
	drawPreview : function(){
		var container= $('<div>').attr({
				'id' : 'layer-preview-'+this.model.id,
				'data-layer-id' : this.model.id
				});
				
		this.dom = container;
		
		
		
		$('.interaction-icon-tray').append('twilio');
		
	},
	
	preloadMedia : function()
	{
		
	},
	
	drawPublish : function()
	{

	},
	
	hidePublish : function()
	{

	},
	
	exit: function()
	{
		
	},
	
	updateAttr: function()
	{
	
		//get a copy of the old attributes into a variable
		var newAttr = this.attr;
		
		
		
		//set the attributes into the layer
		this.updateLayerAttr(newAttr);
		//save the layer back to the database
		this.saveLayer();
	
	
	},
	
	getTemplate : function()
	{
	
		var html ='<div id="twilio">twilio controls</div>'
		/*
		html +='<div id="avControls"> ';
		html +='<div id="avStart"> ';
		html +='<span>In:</span><input disabled="true"  name="avStartMinutes" class="mediaInput mediaInputMinutes" id="avStartMinutes" value="0" type="text">:<input  disabled="true"  name="avStartSeconds" class="mediaInput mediaInputSeconds" id="avStartSeconds" value="00.0" type="text">';
		html +='</div>';
		html +='<div id="avStop"> ';
		html +='<span>Out:</span> <input name="avStopMinutes" class="mediaInput" disabled="true" id="avStopMinutes" value="0" type="text">:<input  disabled="true"  class="mediaInput" name="avStopSeconds" id="avStopSeconds" value="00.0" type="text">';
		html +=	'</div>';
		html +='</div>';
		html +='<div id="avVolumeWrapper">';
		html +='</div> ';
		html +='<div class="avComponent"> ';
		html +='	<div id="mediaPlayerMP"> ';
		html +='		<div id="loadingMP" ><p>Loading Media...</p></div>';
		html +='		<div id="playMP" class="playButtonMP"> </div> ';
		html +='		<div id="loadingOutsideMP"> ';
		html +='			<div id="startBar"></div>';
		html +='			<div id="stopBar"></div>';
		html +='			<div id="startMP" class="markerMP"><div class="bar"></div><div class="arrow-down"></div></div>';
		html +='			<div id="stopMP" class="markerMP"><div class="bar"></div><div class="arrow-down"></div></div>';
		html +='			<div id="currentMP" class="markerMP"><div class="box"></div></div>';
		html +='			<div id="loadingInsideMP"> </div> ';
		html +='			<div id="loadingStatusMP"></div> ';
		html +='		</div> ';
		html +='		<div id="timeWrapperMP"><span id="currentTime"></span> </div>';
		html +='	</div>				';	 
		html +='</div> <!-- #avComponent --> ';
		html +='<div id="clear"></div> ';
		html +='<div id ="volumeMP">';
		html +='<h4>Volume</h4>';
		html +='<div id="volume-slider" ></div>';
		html +='</div>';
		*/
		return html;
	}
	
});