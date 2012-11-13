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

				$(this.el).remove();
				this.model.trigger('approved',this.model.id);
		},
		rejectItem:function(){
				$(this.el).remove();
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
			this.collection.on('remove',function(){
				this.collection.items_count--;
				this.updateHeaderInfo();
			},this);
		},

		events: {
			'click .approve-all':'approveAll',
			'click .refresh':'refresh'
		},

		render: function()
		{
			var blanks = {
				count:this.collection.length,
				total_count:this.collection.items_count
			};
			var _this=this;
			$(this.el).html( _.template( this.getTemplate(), blanks ) );

			_.each(this.collection.models,function(item){
				item.on('approved',_this.onItemApproved,_this);
				item.on('rejected',_this.onItemRejected,_this);
				var itemView = new Dashboard.Items.View({model:item});
				$(_this.el).find('.media-assets').append(itemView.render().el);
			});

			this.updateHeaderInfo();
			return this;
		},

		updateHeaderInfo:function(){
				
				if(this.collection.length===0){
					if(this.collection.items_count>0){
						$(this.el).find('.summary-info').html('Loading more items...');
						$(this.el).find('.moderation-alert').fadeOut();
						this.loadMore();
					}
					else{
						
						$(this.el).find('.moderation-alert').fadeOut();
						$(this.el).find('.summary-info').html('Nothing to Approve! Click <a class="refresh">here</a> to refresh.');
					}
					
				}
				else if(this.collection.length<this.collection.items_count){

					$(this.el).find('.summary-info').html('Viewing '+this.collection.length+ ' of '+this.collection.items_count+ ' items');
				}
				else {
					$(this.el).find('.summary-info').html('Viewing '+this.collection.length+ ' items');
				
				}
		},

		onItemApproved:function(item_id){
			var item = this.collection.get(item_id);

			item.save({published:2});
			$('.moderation-alert').text('Approved: '+item.get('title').shorten(25)).removeClass('reject').addClass('approve');
			this.collection.remove(item);
			this.approvedItems.add(item);
		},
		onItemRejected :function(item_id){
			var item = this.collection.get(item_id);
			item.destroy();
			$('.moderation-alert').text('Deleted: '+item.get('title').shorten(25)).removeClass('approve').addClass('reject');
			this.rejectedItems.add(item);
			
		},
		approveAll : function(){
			

			var _this=this;
			$('.moderation-alert').text('Approved '+this.collection.length+' Items').removeClass('reject').addClass('approve');
			_.each(this.collection.models,function(item){
				item.save({published:2});
				_this.approvedItems.add(item);
			});
			_this.collection.reset();
			

			$(this.el).find('ul').empty();
			if(this.collection.returned_items_count<this.collection.items_count) this.refresh();
			else{
				$(this.el).find('.item-info').fadeOut('fast',function(){
				$(_this.el).find('.empty-status').fadeIn();
			});
			}
		},
		refresh:function(){
			$(this.el).find('.summary-info').html('Checking for new items...');
			this.loadMore();
		},
		loadMore:function(){
			this.collection.reset();
			var _this=this;
			this.collection.fetch({success:function(){
				_this.render();
			}});
		},


		getTemplate : function()
		{
			var html=
			'<div class="span14">'+
				
				'<div class="row">'+
					'<div class="span1">'+
						'<div class="tagged-info">'+
							// need to populate this from user data
							//'<span class="tag-name">#planettakeout</span> '+
						'</div>'+
					'</div>'+
				'</div>'+

				'<div class="row">'+
					'<div class="span7">'+
						'<div class="approval-header">'+
							'<span class="summary-info"><%=count%> </span>'+
							//'<button class="approve-all" href="#">Approve All</button>'+
						'</div>'+
					'</div>'+
					'<div class="span7">'+
						'<div class="moderation-alert" >Added to your collections</div>'+
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
			
			this.items_count=response.items_count;
			this.returned_items_count=response.returned_items_count;
			return response.items;
		}

	});
	

	
	
})(zeega.dashboard.module("dashboard"));