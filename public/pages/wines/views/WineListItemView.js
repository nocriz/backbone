define([
  'config',
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'text!templates/wines/WineListItemView.html'
], function(Config,$, _, Backbone, Bootstrap, wineListItemViewTemplate){
  var WineListItemView = Backbone.View.extend({
    tagName: "li",

    className: "span3",

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
      $(this.el).html(_.template(wineListItemViewTemplate,this.model.toJSON()));
      return this;
    }
  });
  return WineListItemView;
});

