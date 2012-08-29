(function(Sequence){

//collection view
	Sequence.Views.SequenceTray = Backbone.View.extend({
		
		target : '#zeega-project-sequence-list',

		initialize : function()
		{
			this.setElement( $(this.target) );
			this.collection.on('add', this.addSequence, this);
			this.collection.on('remove', this.render, this);
		},

		render : function()
		{
			var _this = this;
			this.$el.html('<ul class="list">')
			console.log('$$		collection list', this, this.collection.length+'')
			this.collection.each(function(sequence, i){
				console.log('$$		seq',sequence, i)
				_this.$el.find('.list').append( sequence.tabView.render().el );
			})
			return this;
		},

		addSequence : function( seq )
		{
			this.$el.append( seq.tabView.render().el );
		},
		
		drawSequenceTab : function( model )
		{
			$('#sequence-tabs').append( model.tabView.render().el );
		},
	})

// model view
	Sequence.Views.SequenceTabs = Backbone.View.extend({
		
		tagName : 'li',
		
		inFocus : false,
		
		initialize : function()
		{
			this.model.on('focus',this.onFocus, this);
			this.model.on('blur',this.onBlur, this);
			this.model.on('change:title', this.render, this);
		},
		
		render: function()
		{
			$(this.el).html( _.template(this.getTemplate(),{title:this.model.get('title') || '...'}) );
			return this;
		},
		
		onFocus : function()
		{
			this.inFocus = true;
			this.$el.addClass('active')
		},
		onBlur : function()
		{
			this.inFocus = false;
			this.$el.removeClass('active')
		},
	
		events : {
			'click .menu-toggler' : 'toggleDropdown',
			'click .sequence-tab-link' : 'goToSequence',
			'click .sequence-rename' : 'renameSequence',
			'click .sequence-delete' : 'deleteSequence'
		},
	
		goToSequence : function(e)
		{
			if( !this.inFocus ) zeega.app.goToSequence(this.model.id)
			this.closeDropdown();
			return false;
		},
		
		toggleDropdown : function(e)
		{
			this.$el.find('.menu').toggleClass('hide')
			return false;
		},
		
		closeDropdown : function()
		{
			this.$el.find('.menu').addClass('hide')
		},
		
		renameSequence : function()
		{
			console.log('$$		rename sequence', this)
			var _this = this;
			if( !this.loadedModal )
			{
				$('body').append( _.template(this.getModalTemplate(),this.model.attributes) );
				$('#sequence-modal-'+_this.model.id+' input').focus();
				$('#sequence-modal-'+this.model.id+' .save').click(function(){
					_this.model.save({'title': $('#sequence-modal-'+_this.model.id+' input').val()} );
				})
				$('#sequence-modal-'+_this.model.id+' input').keypress(function(e){
					if(e.which == 13)
					{
						_this.model.save({'title': $('#sequence-modal-'+_this.model.id+' input').val()} );
						$('#sequence-modal-'+_this.model.id).modal('hide')
					}
				})
			}
			$('#sequence-modal-'+this.model.id).modal('show')

			this.closeDropdown();
			this.loadedModal = true;
			return false;
		},
		
		deleteSequence : function()
		{
			if( confirm('Delete sequence: "'+ this.model.get('title') +'"? This will also delete all incoming and outgoing connections to this sequence!') )
			{
				this.remove();
				zeega.app.project.sequences.remove(this.model);
				this.closeDropdown();
			}
			else
			{
				this.closeDropdown();
			}
			
			return false;
		},
	
		getTemplate : function()
		{
			var html =
			
				'<a href="#" class="sequence-tab-link"><%= title %></a> '+
				"<ul class='flag-menu'>"+
					"<a href='#' class='menu-toggle'><i class='icon-cog icon-white'></i></a>"+
					"<ul class='frame-action-menu'>"+
						"<li><a class='sequence-rename' href='#' data-action='rename'>Rename Sequence</a></li>"+
						"<li><a class='sequence-delete' href='#' data-action='delete'>Delete Sequence</a></li>"+
					"</ul>"+
				"</ul>";
				
				
			return html;
		},
		
		getModalTemplate : function()
		{
			var html = 
			
				'<div class="modal" id="sequence-modal-<%= id %>">'+
					'<div class="modal-header">'+
						'<button class="close" data-dismiss="modal">×</button>'+
						'<h3>Rename Sequence</h3>'+
					'</div>'+
					'<div class="modal-body">'+
						'<input type="text" class="input-xlarge sequence-title" value="<%= title %>">'+
					'</div>'+
					'<div class="modal-footer">'+
						'<a href="#" class="btn" data-dismiss="modal">Close</a>'+
						'<a href="#" class="btn btn-primary save" data-dismiss="modal">Save changes</a>'+
					'</div>'+
				'</div>';
				
			
			return html;
		}
	
	});

})(zeega.module("sequence"));
