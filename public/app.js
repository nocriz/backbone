// Filename: app.js
define([
  'config',
  'jquery',
  'underscore',
  'backbone',
  'router', 
], function(Config,$, _, Backbone, Router){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function    
    Router.initialize();
  }
  return {
    initialize: initialize
  };
});