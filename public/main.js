// Author: Ramon Barros <contato@ramon-barros.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    config: 'libs/config/config',
    jquery: 'libs/jquery/jquery-1.8.2',
    underscore: 'libs/underscore/underscore-dev-1.4.1',
    backbone: 'libs/backbone/backbone-min-0.9.2',
    bootstrap:'libs/bootstrap/js/bootstrap.min',
    //dropdown:'libs/bootstrap/js/bootstrap-dropdown',
    //store:'memorystore',
    text: 'libs/require/text',
    //sha256: 'libs/hash/sha256',
    templates: 'templates'
  },
  shim: {
      'config':{
        //deps:['require','sha256'],
        exports:'Config'
      },
      'backbone':{
        deps: ['jquery','underscore'],
        exports:'Backbone'
      },
      /*
      'dropdown':{
        deps: ['jquery','bootstrap'],
        exports:'Dropdown'
      },
      */
     /*
      'store':{
        deps: ['backbone'],
        exports:'Store'
      },
      */
      'bootstrap':{
        deps: ['jquery'],
        exports:'Bootstrap'
      },
  }
});

require([

  // Load our app module and pass it to our definition function
  'app',
  'config'

  // Some plugins have to be loaded in order due to their non AMD compliance
  // Because these scripts are not "modules" they do not pass any values to the definition function below
], function(App,Config){
  
  Config.loadConfig('config');
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});
