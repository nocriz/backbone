define([
  'config',
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'text!templates/commons/header.html',
  'text!templates/commons/footer.html',
  'text!templates/wines/WineAboutView.html'
], function(Config,$, _, Backbone, Bootstrap, headerTemplate, footerTemplate, aboutTemplate){
  var WineAbout = Backbone.View.extend({
    initialize: function () {
      $('.header').html(headerTemplate);
      $('.footer').html(footerTemplate);
    },
    render: function () {
        $('#content').html(_.template(aboutTemplate));
        return this;
    }
  });
  return new WineAbout;
});

