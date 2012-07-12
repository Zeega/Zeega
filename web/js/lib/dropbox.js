var dropbox = {
  OAuthWindow:{
    closed:true,
  },
  sync:function(){
    var host = window.location.protocol + "//" + window.location.host;
    dropbox.OAuthWindow =  window.open(host + "/web/widget/?url=https%3A%2F%2Fwww.dropbox.com%2Fhome%2FApps%2FZeega", "OAuthWindow", "width=500,height=500,status=no,resizable=no");
  },
  sync_iframe:function(){
    var Modal = zeega.module('modal');
    var linkModal = new Modal.Views.IngestDropboxIFrame();
    $('body').append(linkModal.render().el);
    linkModal.show();
    //dropbox.OAuthWindow =  window.open(host + "/web/widget/?url=https%3A%2F%2Fwww.dropbox.com%2Fhome%2FApps%2FZeega", "OAuthWindow", "width=500,height=500,status=no,resizable=no");
  },
  sync_fancy:function(){    
    var Modal = zeega.module('modal');
    var linkModal = new Modal.Views.IngestDropboxStart();
    $('body').append(linkModal.render().el);
    linkModal.show();
  },
}
