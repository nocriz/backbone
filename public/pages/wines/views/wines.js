define([
  'config',
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'store',
  'pages/wines/collections/wine',
  'pages/wines/models/wine',
  'pages/wines/views/WineView',
  'pages/wines/views/WineListView',
  'text!templates/commons/header.html',
  'text!templates/commons/footer.html'
], function(Config,$, _, Backbone, Store, Bootstrap, WineCollection, WineModel, WineView, WineListView, headerTemplate, footerTemplate){
  var Wine = Backbone.View.extend({

    initialize: function () {
      this.WineCollection = WineCollection;
      $('.header').html(headerTemplate);
      $('.footer').html(footerTemplate);
    },

    render: function (id) {
        if(!id){
          this.page();  
        }else{
          this.details(id);
        }
        return this;
    },
    page:function(page){
      var p = page ? parseInt(page, 10) : 1;
      var wineList = this.WineCollection;
      wineList.fetch({success: function(){
          $("#content").html(new WineListView({model: wineList, page: p}).el);
      }});
      //$('.header').html(headerTemplate);//this.headerView.selectMenuItem('home-menu');
    },
    details:function(id){
      var wine = new WineModel({id: id});
      wine.fetch({success: function(){
          $("#content").html(new WineView({model: wine}).el);
      }});
    },
    add:function(){
      var wine = new WineModel();
      $('#content').html(new WineView({model: wine}).el);
    },
  });
  return new Wine;
});

