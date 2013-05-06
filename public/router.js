// Filename: router.js
define([
  'config',
  'jquery',
  'underscore',
  'backbone',
  'store'
], function(Config, $, _, Backbone, Store){

  var AppRouter = Backbone.Router.extend({
   showAction:function(){
      var page = arguments[0];
      var id = arguments[1];
      if(page){
         require(['pages/'+page+'/views/'+page],function (View) {
              if(!id){
                View.render();
              }else{
                View.render(id);
              }
         });
      }
    },
    showAbout:function(){
      var page = arguments[0];
      if(page){
         require(['pages/'+page+'/views/about'],function (View) {
              View.render();
         });
      }
    },
    showPage:function(){
     var page = arguments[0];
     var num = arguments[1];
      if(page){
         require(['pages/'+page+'/views/'+page],function (View) {
              View.render();
              View.page(num);
         });
      }
    },
    showAdd:function(){
      var page = arguments[0];
      if(page){
         require(['pages/'+page+'/views/'+page],function (View) {
            View.add();
         });
      }
    },
    showDefault:function(){
      this.navigate('//ir/wines', true);
    },
    _extractParameters: function(route, fragment) {
      //console.info(fragment.split('/')[0]);
      var params = route.exec(fragment);
      params.shift();
      return params;
    }
  });

  var initialize = function(){
    var routes = Config.loadJson('config/routes.json');
    var app_router = new AppRouter({routes:routes});

    //Backbone.emulateHTTP = true;
    //Backbone.emulateJSON = true;
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});