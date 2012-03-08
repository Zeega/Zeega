
$(document).ready(function(){
  
  $("#search-bar").fadeTo('slow',1);

  $('#content').change(function(){
    $('#select-wrap-text').text( $('#content option[value=\''+$('#content').val()+'\']').text() );
    jda.app.search({ page:1});
    return false;
  });

  $(window).resize(function() {
    jda.app.resetMapSize();
  });
  $('#search-filters a').click(function(){
    $(this).siblings().show();
    $(this).hide();
    jda.app.switchViewTo( $(this).data('goto-view') );
    
    return false;
  });
  
  //Infinite Scroll
  jda.app.killScroll = false; 
  $(window).scroll(function(){
    //don't excecute if the app is loading, if it's too far down, or if the viewing the map event view
    if  (jda.app.isLoading == false && $(window).scrollTop()+200 >= ($(document).height() - ($(window).height())) && jda.app.currentView != 'event')
    { 
      if (jda.app.killScroll == false) // Keeps the loader from fetching more than once.
      {
        jda.app.killScroll = true; // IMPORTANT - Set killScroll to true, to make sure we do not trigger this code again before it's done running.
        jda.app.search({ page: jda.app.itemViewCollection.collection.search.page+1 });
      }
    }
  });
  

  

  //Sets variable for Fancybox "more" view to false each time the page is reloaded
  sessionStorage.setItem('moreFancy', false);

  //set up fancybox lightbox plugin
  
  
  $(".list-fancymedia,.map-fancymedia").fancybox({
    openEffect : 'fade',
      closeEffect : 'fade',
      openSpeed : 'fast',
      closeSpeed : 'fast',
    closeClick:false,
    nextClick:false,
    mouseWheel:false,
    fitToView:false,
    arrows:false,
    closeBtn:false,
    aspectRatio:true,
    scroll:'none',
      // Changing next gallery item
    nextEffect: 'none', // 'elastic', 'fade' or 'none'
    nextSpeed: 700,
    nextEasing: 'none',
    nextMethod: 'changeIn',

    // Changing previous gallery item
    prevEffect: 'none', // 'elastic', 'fade' or 'none'
    prevSpeed: 700,
    prevEasing: 'none',
    prevMethod: 'changeOut',

    keys: {
        next: [ 34, 39, 40], //  page down, right arrow, down arrow
        prev: [ 33, 37, 38], //  page up, left arrow, up arrow
        close: [27] // escape key
    },

      helpers : {
        title : false,
        buttons: {}
        
      },
      beforeClose : function() {

          if (this.fancyView !=null){
            this.fancyView.beforeClose();
          }
          $('a.btnNext, a.btnPrev, a.btnClose').fadeOut('slow');
          //set video src to null to prevent browser bug
          $('video').attr("src", null);

      },
      afterShow : function(){
        this.fancyView.afterShow();
        $('#fancybox-buttons a.btnNext').show();
      },

    /* This is where we decide which kind of content to put in the fancybox */    
      beforeLoad : function() {
        
        $('#fancybox-document-cloud').remove();

        
            var elementID = $(this.element).attr('id');
            console.log(elementID);
            var thisModel = jda.app.currentView == 'list' ? jda.app.itemViewCollection.collection.get(elementID) : jda.app.mapViewCollection.collection.get(elementID);
      this.fancyView = null;

      switch(thisModel.get("media_type")){
        case 'Image':
          this.fancyView = new FancyBoxImageView({model:thisModel});
                this.fancyView.render(this);
                break;
              case 'Video':
                this.fancyView = new FancyBoxVideoView({model:thisModel});
                this.fancyView.render(this);
                break;
              case 'Audio':
                this.fancyView = new FancyBoxAudioView({model:thisModel});
                this.fancyView.render(this);
                break;
              case 'Youtube':
                this.fancyView = new FancyBoxYouTubeView({model:thisModel});
                this.fancyView.render(this);
                break;
              case 'Tweet':
                this.fancyView = new FancyBoxTweetView({model:thisModel});
                this.fancyView.render(this);
                break;
            case 'Text':
              this.fancyView = new FancyBoxTestimonialView({model:thisModel});
              this.fancyView.render(this);
              break;
              case 'Document':
                this.fancyView = new FancyBoxDocCloudView({model:thisModel});
                this.fancyView.render(this);
                break;
              case 'Website':
                this.fancyView = new FancyBoxWebsiteView({model:thisModel});
                this.fancyView.render(this);
                break;
              case 'PDF':
                this.fancyView = new FancyBoxPDFView({model:thisModel});
                this.fancyView.render(this);
                break;
      }
        },
        
  });
  
});