// Filename: app.js
define([
  'config',
  'jquery',
  'underscore',
  'backbone',
  'store',
  'router', 
], function(Config,$, _, Backbone, Store, Router){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function    
    Router.initialize();
  }
  return {
    initialize: initialize
  };
});