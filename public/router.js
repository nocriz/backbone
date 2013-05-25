// Filename: router.js
define([
  'config',
  'jquery',
  'underscore',
  'backbone'
], function(Config, $, _, Backbone){

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
    },
    displayValidationErrors: function (messages) {
        for (var key in messages) {
            if (messages.hasOwnProperty(key)) {
                this.addValidationError(key, messages[key]);
            }
        }
        this.showAlert('Warning!', 'Fix validation errors and try again', 'alert-warning');
    },
    addValidationError: function (field, message) {
        var controlGroup = $('#' + field).parent().parent();
        controlGroup.addClass('error');
        $('.help-inline', controlGroup).html(message);
    },
    removeValidationError: function (field) {
        var controlGroup = $('#' + field).parent().parent();
        controlGroup.removeClass('error');
        $('.help-inline', controlGroup).html('');
    },
    showAlert: function(title, text, klass) {
        $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
        $('.alert').addClass(klass);
        $('.alert').html('<strong>' + title + '</strong> ' + text);
        $('.alert').show();
    },
    hideAlert: function() {
        $('.alert').hide();
    }
  });

  var initialize = function(){
    var routes = Config.loadJson('config/routes.json');
    app_router = new AppRouter({routes:routes});
    var func = Config.loadJson('config/functions.json');
    for(i in func){
      var json = eval('('+func[i]+')');
      //app_router.push({i:json[i]});
    }

    //Backbone.emulateHTTP = true;
    //Backbone.emulateJSON = true;
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});