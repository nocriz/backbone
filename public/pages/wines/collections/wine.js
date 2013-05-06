define([
  'jquery',
  'underscore',
  'backbone',
  'pages/wines/models/wine'
], function($, _, Backbone, WineModel){
  var WineCollection = Backbone.Collection.extend({
    model: WineModel,
    url: "../src/wines"
  });

  return new WineCollection();
});
