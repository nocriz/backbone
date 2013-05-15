define([
  'config',
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'pages/wines/collections/wine',
  'text!templates/wines/WineView.html',
  'pages/wines/views/paginator'
], function(Config,$, _, Backbone, Bootstrap, WineCollection , wineViewTemplate, Paginator){
  var WineView = Backbone.View.extend({
    events: {
        "change"        : "change",
        "click .save"   : "beforeSave",
        "click .delete" : "deleteWine",
        "drop" : "drop"
    },

    initialize: function () {
        this.render();
        var body = $('body');
    },

    render: function () {
        $(this.el).html(_.template(wineViewTemplate,this.model.toJSON()));
        return this;
    },

    change: function (event) {
        // Remove any existing alert message
        app_router.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            app_router.addValidationError(target.id, check.message);
        } else {
            app_router.removeValidationError(target.id);
        }
    },

    beforeSave: function () {
        console.info(this);
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            app_router.displayValidationErrors(check.messages);
            return false;
        }
        // Upload picture file if a new file was dropped in the drop area
        if (this.pictureFile) {
            this.model.set("picture", this.pictureFile.name);
            app_router.uploadFile(this.pictureFile,
                function () {
                    self.saveWine();
                }
            );
        } else {
            this.saveWine();
        }
        return false;
    },

    saveWine: function () {
        var self = this;
        this.model.save(null, {
            success: function (model) {
                self.render();
                //console.info(app_router);
                app_router.navigate('wines/' + model.id, false);
                app_router.showAlert('Success!', 'Wine saved successfully', 'alert-success');
            },
            error: function () {
                app_router.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteWine: function () {
        this.model.destroy({
            success: function () {
                alert('Wine deleted successfully');
                window.history.back();
            }
        });
        return false;
    },
    drop : function(e){
        e.preventDefault();
        var files = e.originalEvent.dataTransfer.files;
        console.info(files);
    },
    dropHandler: function (event) {
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];

        // Read the image file from the local file system and display it in the img tag
        var reader = new FileReader();
        reader.onloadend = function () {
            $('#picture').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
    }
  });
  return WineView;
});

