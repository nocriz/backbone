// Filename: router.js
define([
  'config',
  'jquery',
  'underscore',
  'backbone'
], function(Config, $, _, Backbone){

  var AppRouter = Backbone.Router.extend({
    redirect:function(arg){
      var defaultPage = Config.settings.system.defaultPage;
      console.info(arg[0]);
      if(arg.length>1 || arg[0]!==defaultPage && typeof(Config.getCookie('authToken'))=='undefined'){
        this.navigate('//ir/'+defaultPage, true);
        window.location.reload();
      }
    },
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment);
      params.shift();
      return params;
    },
    uploadFile: function (file, callbackSuccess) {
        var self = this;
        var data = new FormData();
        data.append('file', file);
        $.ajax({
            url: 'src/upload.php',
            type: 'POST',
            data: data,
            processData: false,
            cache: false,
            contentType: false
        })
        .done(function () {
            console.log(file.name + " uploaded successfully");
            callbackSuccess();
        })
        .fail(function () {
            self.showAlert('Error!', 'An error occurred while uploading ' + file.name, 'alert-error');
        });
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
    Config.loadFunction(app_router);

    //Backbone.emulateHTTP = true;
    //Backbone.emulateJSON = true;
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});