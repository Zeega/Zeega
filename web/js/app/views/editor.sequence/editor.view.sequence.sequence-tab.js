(function(Sequence){

//collection view
    Sequence.Views.SequenceTray = Backbone.View.extend({
        
        target : '#zeega-project-sequence-list',

        initialize : function() {
            this.collection.on('add', this.render, this);
            this.collection.on('remove', this.render, this);
        },

        render : function() {
            var _this = this;
            this.setElement( $(this.target) );
            this.$el.html('<ul class="list">');
            this.collection.each(function(sequence, i){
                _this.$el.find('.list').append( sequence.tabView.render().el );
                sequence.tabView.delegateEvents();
            });
            this.$el.append("<div id='add-sequence'><a href='#'><div class='menu-verbose-title'>add sequence</div></a></div>");
            return this;
        },

        events: {
            "click #add-sequence a": "addSequence"
        },

        addSequence: function() {
            var Sequence = zeega.module("sequence"),
                sequence = new Sequence.Model();

            this.$el.find('#link-confirm').hide();
            sequence.on('sync', this.onSequenceSave, this);
            sequence.save().success(function() {
                sequence.onSaveNew();
                zeega.app.project.sequences.add( sequence );
            });
        }
/*
        addSequence : function( seq )
        {
            this.$el.find('.list').append( seq.tabView.render().el );
        }
*/
    });

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
            'click .sequence-options' : 'sequenceOptions',
            'click .sequence-delete' : 'deleteSequence'
        },
    
        goToSequence : function(e)
        {
            if( !this.inFocus ) zeega.app.goToSequence(this.model.id);
            this.closeDropdown();
            return false;
        },
        
        toggleDropdown : function(e)
        {
            this.$el.find('.menu').toggleClass('hide');
            return false;
        },
        
        closeDropdown : function()
        {
            this.$el.find('.menu').addClass('hide');
        },
        
        sequenceOptions : function() {
            var _this = this;

            if( !this.loadedModal ) {
                $('body').append( _.template( this.getModalTemplate(), this.model.toJSON() ) );
            } else {
                $('#sequence-modal-' + _this.model.id).replaceWith( _.template( this.getModalTemplate(), this.model.toJSON() ) );
            }

            $('#sequence-modal-'+_this.model.id+' input').focus();
            $('#sequence-modal-'+this.model.id+' .save').click(function(){
                _this.saveOptions();
            });
            $('#sequence-modal-'+_this.model.id+' input').keypress(function(e){
                if(e.which == 13)
                {
                    _this.saveOptions();
                    $('#sequence-modal-'+_this.model.id).modal('hide');
                }
            });

            $('#sequence-modal-'+this.model.id).modal('show');

            this.closeDropdown();
            this.loadedModal = true;
            return false;
        },

        saveOptions: function() {
            this.model.save({
                'title': $('#sequence-modal-'+this.model.id+' input').val(),
                'description': $('#sequence-modal-'+this.model.id+' .sequence-description').val(),
                'advance_to': parseInt( $('#sequence-modal-'+this.model.id+' .sequence-advance').val(), 10)
            });
        },
        
        deleteSequence : function()
        {
            if(zeega.app.project.sequences.length > 1 )
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
            }
            else
            {
                alert('You cannot delete your last sequence!');
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
                        "<li><a class='sequence-options' href='#' data-action='rename'>Sequence Options</a></li>"+
                        "<li><a class='sequence-delete' href='#' data-action='delete'>Delete Sequence</a></li>"+
                    "</ul>"+
                "</ul>";
                
            return html;
        },
        
        getModalTemplate : function()
        {
            var _this = this;
            var html =
            
                '<div class="modal" id="sequence-modal-<%= id %>">'+
                    '<div class="modal-header">'+
                        '<button class="close" data-dismiss="modal">×</button>'+
                        '<h3>Sequence Options</h3>'+
                    '</div>'+
                    '<div class="modal-body">'+
                        '<label>Title</label>'+
                        '<input type="text" class="input-xlarge sequence-title" value="<%= title %>">'+
                        '<label>Description</label>'+
                        '<textarea class="sequence-description" rows="3"><%= description %></textarea>'+
                        '<label>Advance to sequence</label>'+
                        '<select class="sequence-advance">';

                        zeega.app.project.sequences.each(function(sequence){

                            if(sequence.id == _this.model.id && _this.model.get('advance_to'))
                            {
                                html+= '<option value="'+ sequence.id +'">'+ sequence.get('title') +' (default)</option>';
                            }
                            else if(sequence.id == _this.model.id && !_this.model.get('advance_to') )
                            {
                                html+= '<option value="'+ sequence.id +'" selected="selected">'+ sequence.get('title') +' (default)</option>';
                            }
                            else if( sequence.id == _this.model.get('advance_to') )
                            {
                                html+= '<option value="'+ sequence.id +'" selected="selected">'+ sequence.get('title') +'</option>';
                            }
                            else
                            {
                                html+= '<option value="'+ sequence.id +'">'+ sequence.get('title') +'</option>';
                            }
                        });
            html +=
                        '</select>'+
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
