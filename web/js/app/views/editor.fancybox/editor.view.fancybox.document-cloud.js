(function(FancyBox) {

	FancyBox.Views = FancyBox.Views || {};
	FancyBox.Views.FancyBox = FancyBox.Views.FancyBox || {};
	
	FancyBox.Views.FancyBox.DocumentCloud = FancyBox.Views._Fancybox.extend({
		
		events : {

			'click .fancybox-more-button' : 'more',
			'click .fancybox-less-button' : 'less',

		},
		
		initialize: function()
		{
			FancyBox.Views._Fancybox.prototype.initialize.call(this); //This is like calling super()
		},
		
		more : function()
		{
			//call parent MORE method to lay out metadata
			FancyBox.Views._Fancybox.prototype.more.call(this);

			this.fillInTemplate(this.getMediaTemplate(275, 375));

			return false;
		},
		
		less : function()
		{
			//call parent LESS method to lay out metadata
			FancyBox.Views._Fancybox.prototype.less.call(this);
			var width = 750;//$(this.el).width();
			this.fillInTemplate(this.getMediaTemplate(width,400));

			return false;
		},
		
		fillInTemplate : function(template)
		{
			//use template to clone the database items into
			var template = _.template( template );

			//Fill in info
			var blanks = {

				uri : this.model.get('uri'),
			};
			//copy the cloned item into the el
			var docHTML =  template( blanks ) ;

			$(this.el).find('.fancybox-media-item').html(docHTML);
		},

		/* Pass in the element that the user clicked on from fancybox. */
		render: function(obj)
		{

			//Call parent class to do captioning and metadata
			FancyBox.Views._Fancybox.prototype.render.call(this, obj); //This is like calling super()


			/* Because the document viewer needs to be reloaded for MORE and LESS views
			this will be handled by the MORE and LESS methods in this class which call the parent
			FancyBoxView class to handle the metadata and stuff.

			So if you need to change how this renders change it in the MORE or LESS or FILLINTEMPLATE functions
			 of this class.
			*/

			//set fancybox content
			obj.content = $(this.el);

			return this;
		},
		
		getMediaTemplate : function(width, height)
		{
			var html =	'<div id="fancybox-document-cloud" class="DV-container" style="z-index:1"></div>'+
						'<script>'+
						"DV.load('http://www.documentcloud.org/documents/<%= uri %>.js', {"+
						'sidebar: false, width:'+width+',height:'+height+','+
						'container: "#fancybox-document-cloud"'+
						'      });'+
						'</script>';

			return html;
		}
		
	});
	
})(zeega.module("fancybox"));