(function(Dashboard){

	Dashboard.Items = Dashboard.Items || {};
	
	
	Dashboard.Items.View =  Backbone.View.extend({
		
		tagName : 'li',
		className : 'asset',

		
		initialize: function (options) {
			_.extend(this,options);
			
		},
		events: {
			'click .accept':'approveItem',
			'click .reject':'rejectItem'
		},

		render: function()
		{
			var blanks = this.model.attributes;
			var _this=this;
			blanks['title']=blanks['title'].shorten(30);

			$(this.el).html( _.template( this.getTemplate(), blanks ) );

	
			_.each(this.model.get('tags'), function(tag){
				$(_this.el).find('.media-tags').append('<li>'+tag+'</li>');
			});

			return this;
		},
		approveItem:function(){

				$(this.el).animate({'opacity': '0', 'height': '0'}, 1000, 'linear', function(){
					$(this).remove();
				});
				this.model.trigger('approved',this.model.id);
		},
		rejectItem:function(){
				$(this.el).animate({'opacity': '0', 'height': '0'}, 1000, 'linear', function(){
					$(this).remove();
				});
				this.model.trigger('rejected',this.model.id);
		},
		getTemplate : function()
		{
			var html=
			
			'<div class="controls">'+
							'<a class="accept" href="#">'+
								'<i class="icon-ok"></i>'+
							'</a>'+
							'<a class="reject" href="#">'+
								'<i class="icon-remove"></i>'+
							'</a>'+
						'</div>'+
						'<div class="media-preview" >'+
							'<img src="<%=thumbnail_url%>"/>'+
						'</div>'+
						'<div class="media-info">'+
							'<h2><%= title %> </h2>'+
							'<dl>'+
								'<dt>Created by</dt>'+
								'<dd><%= media_creator_username %></dd>'+
								'<dt>Created on</dt>'+
								'<dd><%=date_created %></dd>'+
							'</dl>'+
							'<p><%=description%></p>'+
						'</div>'+
						'<ul class="media-tags">'+
						'</ul>';

		return html;
		
		}
		
	});

	Dashboard.Items.CollectionView =  Backbone.View.extend({
		
		tagName : 'div',
		className : 'row',

		
		initialize: function (options) {
			_.extend(this,options);
			this.approvedItems = new Dashboard.Items.Collection();
			this.rejectedItems = new Dashboard.Items.Collection();
			var _this=this;
			
			this.collection.on('remove',function(){
				$(this.el).find('.items-count').html(this.collection.length+" ");
			},this);





		},
		events: {
			'click .approve-all':'approveAll',
			'click .refresh':'refresh'
		},

		render: function()
		{
			var blanks = {
				count:this.collection.length
			};
			var _this=this;
			$(this.el).html( _.template( this.getTemplate(), blanks ) );

			_.each(this.collection.models,function(item){
				item.on('approved',_this.onItemApproved,_this);
				item.on('rejected',_this.onItemRejected,_this);
				var itemView = new Dashboard.Items.View({model:item});
				$(_this.el).find('.media-assets').append(itemView.render().el);
			});


			if(this.collection.length===0) $(this.el).find('.empty-status').removeClass('hidden');
			else $(this.el).find('.item-info').removeClass('hidden');
			return this;
		},
		onItemApproved:function(item_id){
			var item = this.collection.get(item_id);

			item.save({published:2});
			$('.alert').css({'background-color':'green'}).text('Approved Item: '+item.get('title')).stop().fadeIn(300).delay(1500).fadeOut(300);
			this.collection.remove(item);
			this.approvedItems.add(item);
		},
		onItemRejected :function(item_id){
			var item = this.collection.get(item_id);
			item.destroy();
			$('.alert').css({'background-color':'red'}).text('Deleted Item: '+item.get('title')).stop().fadeIn(300).delay(1500).fadeOut(300);
			this.collection.remove(item);
			this.rejectedItems.add(item);
			
		},
		approveAll : function(){
			var _this=this;
			$('.alert').css({'background-color':'green'}).text('Approved '+this.collection.length+' Items').stop().fadeIn(300);
			
			_.each(this.collection.models,function(item){
				console.log(item);
				item.save({published:2});
				_this.approvedItems.add(item);
			});
			_this.collection.reset();
			$(this.el).find('.item-info').fadeOut('fast',function(){
				$(_this.el).find('.empty-status').fadeIn();
			});

		},
		refresh:function(){
			this.collection.reset();
			var _this=this;
			this.collection.fetch({success:function(){
				_this.render();
			}});
		},


		getTemplate : function()
		{
			var html=
			'<div class="span11">'+
				
				'<div class="row">'+
					'<div class="span11">'+
						'<div class="tagged-info">'+
							'<span class="tag-name">#planettakeout</span> '+
							//'<span class="from">from</span> <span class="zitem-flickr zitem-30"></span> <span class="zitem-vimeo zitem-30"></span>'+
						'</div>'+
					'</div>'+
				'</div>'+

				'<div class="row">'+
					'<div class="span4">'+
						'<div class="approval-header item-info hidden">'+
							'<span class="items-count"><%=count%> </span>items'+
							'<button class="approve-all" href="#">Approve All</button>'+
						'</div>'+
						'<div class="approval-header empty-status hidden">'+
							'<span class="empty-msg">No items to approve!</span>'+
							'<button class="refresh" href="#">Refresh</button>'+
						'</div>'+
					'</div>'+
					'<div class="span7">'+
						'<div class="alert" style="display: none;">Added to your collections</div>'+
					'</div>'+
				'</div>'+
				'<ul class="media-assets">'+
				'</ul>'+
			'</div>'+
			'<div class="span3">'+
			'</div>'+
		'</div>';
		return html;
		
		}
		
	});

	Dashboard.Items.Model = Backbone.Model.extend({
		initialize:function(){

		},
		url:function(){

			var url = zeega.url_prefix+'api/items/'+this.id;
			return url;
		}

	});

	Dashboard.Items.Collection = Backbone.Collection.extend({
		model:Dashboard.Items.Model,

		initialize:function(options){
			_.extend(this,options);
		},
		url:function(){
			var url;
			if(this.type==='unmoderated') url = zeega.url_prefix+'api/items/unmoderated';
			else if(this.type==='rejected') url = zeega.url_prefix+'api/items/rejected';
			return url;
		},
		parse:function(response){
			return response.items;
		}

	});
	

	
	
})(zeega.dashboard.module("dashboard"));