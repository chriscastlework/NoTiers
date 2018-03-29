sp.namespace("sp.ui.inputs.fileUpload",
             "sp.ui.inputs.fileUpload.FileUploadEvent");

sp.ui.inputs.fileUpload.FileUpload = sp.core.graphics.Graphic.extend
(
{
    __constructor: function(graphic, url, types, form, chooseFileButtonLabel, save, overwrite) {
        this.__super(graphic);
        this.url = url;
        this.types = types;
        this.form = form;
        this.chooseFileButtonLabel = chooseFileButtonLabel;
        this.save = save != null ? save : false;
        this.overwrite = overwrite != null ? overwrite : true;
        this.init();
    },

    init: function() {
        this.formDataSupported = true;
        var fd = "";
        try { fd = new FormData(); }
        catch (e) { this.formDataSupported = false; }
        var __this = this;
        $(this.getGraphic()).addClass("fileUploadContainer");

        this.buttonsContainer = this.createElement("div", {}, ["fileUploadButtonsContainer"]);
        this.addElement(this.buttonsContainer);
        this.addFileButton = this.createElement("div", {}, ["button"]);
        $(this.addFileButton).text(this.chooseFileButtonLabel);
        $(this.buttonsContainer).append(this.addFileButton);
        this.addFilesInput = this.createElement("input", {}, ["fileUploadInput"], { type: "file", name: "fileUpload" });
        this.addElement(this.addFilesInput);
        $(this.addFilesInput).change(function(e) {
            __this.addFileInputChanged(this);
        });
        this.uploadButton = this.createElement("div", {}, ["button"]);
        $(this.uploadButton).click(function() {
            __this.uploadFileClicked();
        });
        $(this.uploadButton).text("Start Upload");

        $(this.buttonsContainer).append(this.uploadButton);
        $(this.uploadButton).hide();

        this.filenameLabel = this.createElement("div", {}, ["labelItalic", "fileUploadFileLabel"]);
        this.addElement(this.filenameLabel);
        this.setFileLabel("");

        this.progressBarDiv = this.createElement("div", {}, ["progressBarContainer"]);
        this.addElement(this.progressBarDiv);
        this.progressBar = new sp.ui.progressIndicator.ProgressBar(this.progressBarDiv, 0, 1, true, true);
        this.progressBar.update(0, 0);
        this.progressBar.hide();
    },
    addFileInputChanged: function(control) {
        this.reset();
        var newVal = "";
        var thisVal = $(control).val();
        if (this.checkFileExtension(thisVal)) {
            newVal = thisVal;
            $(this.uploadButton).show();
        }
        else {
            $(this.uploadButton).hide();
            e.preventDefault();
        }
        this.setFileLabel(newVal);
    },
    uploadFileClicked: function(){
        this.uploadFile();
        if (!this.formDataSupported)
            this.form.submit();
    },
    checkFileExtension: function(file) {
        var idx = file.lastIndexOf(".");
        var ext = file.substring(idx != -1 ? idx + 1 : 0);
        var match = false;
        for (var i = 0; i < this.types.length; i++) {
            if (this.types[i] == ext) {
                match = true;
                break;
            }
        }
        return match;
    },
    setFileLabel: function(value) {
        var accepted = "Accepted filetypes: ";
        for (var i = 0; i < this.types.length; i++) accepted += "*." + this.types[i] + (i < this.types.length - 1 ? ", " : "");
        var idx = value.lastIndexOf("\\");
        $(this.filenameLabel).text(this.checkFileExtension(value) ? value.substring(idx != -1 ? idx + 1 : 0) : accepted);
    },

    uploadFile: function() {
        var __this = this;
        if (this.formDataSupported) { //For Chrome, FF and Safari
            this.progressBar.show();
            var fd = new FormData();
            fd.append("fileToUpload", this.addFilesInput.files[0]);
            if (this.save)
                fd.append("save", this.save.toString());
            if (this.overwrite)
                fd.append("overwrite", this.overwrite.toString());
            var xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", function(evt) { __this.uploadProgress(evt) }, false);
            xhr.addEventListener("load", function(evt) { __this.uploadComplete(evt) }, false);
            xhr.addEventListener("error", function(evt) { __this.uploadFailed(evt) }, false);
            xhr.addEventListener("abort", function(evt) { __this.uploadCanceled(evt) }, false);
            xhr.open("POST", this.url);
            xhr.send(fd);
        }
        else { // For IE9 and lower
            if (this.iframe == null) {
                this.iframe = this.createElement("iframe", { position: "fixed", left: "-99999px" }, [""], { name: "uploadIFrame" });
                this.addElement(this.iframe);
                if (this.save) {
                    if (this.saveField == null) {
                        this.saveField = this.createElement("input", {}, [""], { name: "save", type: "hidden" });
                        $(this.saveField).val(this.save.toString());
                        $(this.form).append(this.saveField);
                    }
                }
                if (this.overwrite) {
                    if (this.overwriteField == null) {
                        this.overwriteField = this.createElement("input", {}, [""], { name: "overwrite", type: "hidden" });
                        $(this.overwriteField).val(this.overwrite.toString());
                        $(this.form).append(this.overwriteField);
                    }
                }
                var __this = this;
                $(this.iframe).load(function(e) {
                    __this.uploadCompleteIE(e);
                });

            }
            $(this.form).attr("target", "uploadIFrame");
        }
    },

    reset: function() {
        this.setFileLabel("");
        this.progressBar.hide();
        $(this.uploadButton).hide()
    },

    uploadProgress: function(evt) {
        if (evt.lengthComputable) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            this.progressBar.update(percentComplete, 100);
        }
    },

    uploadComplete: function(evt) {
        this.dispatchEvent(new sp.ui.inputs.fileUpload.FileUploadEvent(this, sp.ui.inputs.fileUpload.FileUploadEvent.COMPLETE, evt.target.responseText, true, ""));
    },
    
    uploadCompleteIE: function(evt) {
        this.dispatchEvent(new sp.ui.inputs.fileUpload.FileUploadEvent(this, sp.ui.inputs.fileUpload.FileUploadEvent.COMPLETE, this.iframe.contentWindow.document.body.innerHTML, true, ""));
    },

    uploadFailed: function(evt) {
        this.dispatchEvent(new sp.ui.inputs.fileUpload.FileUploadEvent(this, sp.ui.inputs.fileUpload.FileUploadEvent.ERROR, "", false, "There was an error attempting to upload the file."));
    },

    uploadCanceled: function(evt) {
        this.dispatchEvent(new sp.ui.inputs.fileUpload.FileUploadEvent(this, sp.ui.inputs.fileUpload.FileUploadEvent.CANCEL, "", false, "The upload has been canceled by the user or the browser dropped the connection."));
    }
}
);

sp.ui.inputs.fileUpload.FileUploadEvent = sp.core.events.Event.extend
(
{
    __constructor: function(target, type, data, success, error) {
        this.__super(target, type);
        this.data = data;
        this.success = success;
        this.error = error;
    }
}
);
sp.ui.inputs.fileUpload.FileUploadEvent.COMPLETE = "complete";
sp.ui.inputs.fileUpload.FileUploadEvent.CANCEL = "cancel";
sp.ui.inputs.fileUpload.FileUploadEvent.LOAD = "load";
sp.ui.inputs.fileUpload.FileUploadEvent.ERROR = "error";