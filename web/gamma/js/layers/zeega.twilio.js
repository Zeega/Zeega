
/************************************

	TWILIO LAYER CHILD CLASS
	

************************************/

var TwilioLayer = ProtoLayer.extend({
	
	interaction: true,
	
	defaultAttributes : 
	{
		'title' : 'Twilio Layer',
		'phone'  : '+1 (617) 500-7254'
	},
						
	drawControls : function(template)
	{
		//this should go top to bottom
		var _this = this;
		
		//set the ilayer template
		var controls = $(iLayerTemplate);
		
		//set title
		controls.find('.i-layer-title').html(this.model.get('type')+ " Layer");
		
		//set delete button
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
		
		//determine checkbox activity
		var txtCheck;
		var phoneCheck;
		if(_this.model.get('attr').call) phoneCheck ='checked'; 
		if(_this.model.get('attr').txt) txtCheck = 'checked';
		
		//default text in the dropbox
		var dropBox = "Drag audio into this box";
		if(_this.model.get('attr').audioItemID)
		{
			//if something already exists in the dropbox
			dropBox = _this.model.get('attr').audioTitle;
		}
		
		
		//load controls
		var tmp = _.template(this.getTemplate());
		var content = 
			{
				code : 'WFMU-'+ _this.model.id,
				phone_number : _this.defaultAttributes.phone,
				drop_box : dropBox,
				txt_body : _this.model.get('attr').txtBody,
				txt_checked : txtCheck,
				phone_checked : phoneCheck
				/*
				//this is better, but broken
				txt_checked : function(){ if(_this.model.get('attr').txt) return 'checked' },
				phone_checked : function(){ if(_this.model.get('attr').phone) return 'checked' }
				*/
			};
		controls.find('#controls').html( tmp(content) );
		
		//make droppable
		controls.find('.item-drop').droppable({
				accept : '.database-asset',
				hoverClass : 'interactive-drop-hover',
				tolerance : 'pointer',

				//this happens when you drop a database item onto a node
				drop : function( event, ui )
					{
						console.log(Zeega.draggedItem);
						var source = Zeega.draggedItem;
						//make sure it's an audio file
						if(source.get('content_type') == 'Audio')
						{
							ui.draggable.draggable('option','revert',false);

							//save to layer
							var attr = _this.model.get('attr');
							attr.call = true;
							attr.audioURL = source.get('item_url');
							attr.audioItemID = source.id;
							attr.audioTitle = source.get('title');
							
							_this.model.set({'attr':attr});
							_this.model.save();
							//draw audio controls
							
							//auto check the phone checkbox
							controls.find('input[name$="phone"]').attr('checked','true');
							
							//replace content with audio info
							$("#drop-content").html('media accepted! '+ attr.audioTitle);

						}else{
							$("#drop-content").html('This media will not work in with twilio. Try searching audio.');
						}
						
					}
			});
			
		// activate text area
		controls.find('textarea').focus(function(){
			controls.find('input[name$="txt"]').attr('checked','true');
		});
		
		controls.find('textarea').blur(function(){
			// save txtBody
			var attr = _this.model.get('attr');
			attr.txtBody = $(this).val();
			attr.txt = true;
			_this.model.set({'attr':attr});
			_this.model.save();
			console.log(attr.txtBody);
		});
		
		controls.find('input[type="checkbox"]').change(function(){
			console.log(this);
			console.log($(this).is(':checked'));
			var attr = _this.model.get('attr');
			
			if( $(this).attr('name') == 'phone' ) attr.call = $(this).is(':checked');
			if( $(this).attr('name') == 'txt' ) attr.txt = $(this).is(':checked');
			console.log(attr);
			_this.model.set({'attr':attr});
			_this.model.save();
		});
		
		
		
		//draw controls
		$('#interaction-workspace').append(controls);

	},
	
	
	drawPreview : function(){
		//put icon in icon tray
		$('#interaction-icon-tray').append('<span class="twilio-tray-icon">Twilio</span>');
		
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
	
		var html = "<div class='alert-message info interaction-instructions'>Text <%= code %> to <%= phone_number %> </div>"
		html +=	"<table class='twilio-table'>";
		html +=		"<tr>";
		html +=		"<td><input type='checkbox' name='phone' value='phone' <%= phone_checked %>/></td>";
		html +=		"<td>";
		html +=			"Get a phone call and play:";
		html +=			"<div class='twilio-audio-drop item-drop' data-type='audio' ><div id='drop-content'><%= drop_box %></div></div>";
		html +=		"</td>";
		html +=	"</tr>";
		html +=	"<tr>";
		html +=		"<td><input type='checkbox' name='txt' value='txt' <%= txt_checked %>/></td>";
		html +=		"<td>";
		html +=			"Get a text";
		html +=			"<div><textarea id='txt-area' rows='2' cols='58' maxlength='160'><%= txt_body %></textarea></div>";
		html +=		"</td>";
		html +=	"</tr>";
		html += "</table>";

		return html;
	}
	
});