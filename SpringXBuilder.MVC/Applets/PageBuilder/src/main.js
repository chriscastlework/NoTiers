sp.namespace("pb.ServiceLocator");

var app = angular.module("app", ['angularTreeview']);
var pageModel, pageView, pageController;

$(document).ready(function () {
    di.resolve("Model").addEventListener(this, pb.model.LoadEvent.COMPLETE, onDataLoaded);
});

function onDataLoaded(event) {

    if (!event.success) {
        showLoadError(event);
    }

    //create the root Page view,model and controller and append to body..
    pageModel = di.resolve("Model").getPage();
    pageView = new pb.view.Page(pageModel);
    pageController = new pb.controller.PageController(pageView, pageModel);
    pageController.focus();

    // resolve the singleton DetailsView..
    var detailsView = di.resolve("DetailsView");

    // append the Page and the DetailsView to the body of the page..
    $($("#page-editor")[0]).append(pageView.getGraphic());
    $($("#details-view")[0]).append(detailsView.getGraphic());

    pageModel.addEventListener(this, pb.model.ModelEvent.WILLCHANGE, onPageContextChanged);

};

function onPageContextChanged(event) {
    var str = "Changing this value will remove any mapping relationships with CRM you have specified on any child elements or values. You will need to update mapping values for any elements. Are you sure you want to continue?"
    var result = confirm(str);
    if (result) {

    }
    else {
        event.preventDefault();
    }
}

function showLoadError(event) {
    alert("Unable to retrieve data\nError:" + event.error);
}