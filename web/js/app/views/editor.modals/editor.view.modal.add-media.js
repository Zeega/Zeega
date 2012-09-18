(function(Modal) {
	
	Modal.Views.AddMedia = Backbone.View.extend({
		
		className : 'modal',
		
		render: function()
		{
			this.$el.html( this.getTemplate() );
			return this;
		},

		events : {
			'click .close' : 'hide',
		},

		show : function(){ this.$el.modal('show') },
		hide : function(){ this.$el.modal('hide') },

		getTemplate : function()
		{

			console.log(this)

			var html =	//Step 1
				'<div class="modal-header">'+
					'<button class="close">&times;</button>'+
					'<h3>Add media to your database</h3>'+
				'</div>'+

				'<div class="modal-body clearfix">'+

					'<div>'+
						"<a style='float:left' href=\"javascript:(function()%7Bvar%20head=document.getElementsByTagName('body')%5B0%5D,script=document.createElement('script');script.id='zeegabm';script.type='text/javascript';script.src='"+ zeega.app.url_prefix +"js/widget/zeega.bookmarklet.js?'%20+%20Math.floor(Math.random()*99999);head.appendChild(script);%7D)();%20void%200\">"+
							"<img src='"+ zeega.app.url_prefix +"images/drag-zeega.gif' alt='Add to Zeega'/>"+
						"</a>"+
						'<ul style="width:393px; float:left">'+
							'<li>Drag the icon to the right to the Bookmarks Bar within the browser</li>'+
							'<li>make sure you\'re using the latest version of Google Chrome.</li>'+
							'<li>Under Chrome\'s view menu, select "Always show Bookmarks Bar"</li>'+
							'<li> "Add to Zeega" will appear in your Bookmarks Bar. As you find media across the web, click this to open the bookmarklet plugin.</li>'+

						'</ul>'+
					'</div>'+

					//"javascript:(function()%7Bvar%20head=document.getElementsByTagName('body')%5B0%5D,script=document.createElement('script');script.id='zeegabm';script.type='text/javascript';script.src='"+ zeega.app.url_prefix +"js/widget/zeega.bookmarklet.js?'%20+%20Math.floor(Math.random()*99999);head.appendChild(script);%7D)();%20void%200"+

					'<div class="publish-footer">'+
						'<button class="btn secondary pull-right close" ><i class="icon-ok-circle"></i> Done</button>'+
					'</div>'+
				'</div>';

			return html;
		},
	});
	
})(zeega.module("modal"));