app.directive("pageEditor",["log","refData","pageData",function(log,refData,pageData)
{
    return {
                replace:true,
                templateUrl:"templates/angular/pageEditor.html",
                controller:function($scope,$element,$attrs)
                {

                },
                link:function(scope,element,attrs)
                {
                    scope.elements = pageData.getElements();
                    function willAcceptDrop(event)
                    {
                        return true;
                    }
                    var droppable = new drag.DroppableContainer(element,{willAcceptDrop:willAcceptDrop});
                    var sortable = new drag.Sortable(element);
                    droppable.addEventListener(this,drag.DragEvent.DROP,function(event)
                    {
                        pageData.addElement({type:event.draggable.id,parentId:scope.id});
                        scope.$apply();
                    });
                }
           }
}]);

app.directive("pageElement",["log","refData",function(log,refData)
{
    return {
                replace:true,
                templateUrl:"templates/angular/pageElement.html",
                scope:{data:"="},
                controller:function($scope,$element,$attrs)
                {

                },
                link:function(scope,element,attrs)
                {
                   // scope.markup = pb.view.ElementFactory.createViewForType(scope.id);
                    var droppable = new drag.DroppableContainer(element,{});
                    var draggable = new drag.Draggable(element,{});
                    //draggable.parentId =
                    //TODO handle dropping within existing parent...


                }
           }
}]);

app.directive("toolItem",["log","refData",function(log,refData)
{
    return {
        replace:true,
        templateUrl:"templates/angular/toolitem.html",
        scope:{toolId:"@"},
        controller:function($scope,$element,$attrs)
        {

        },
        link:function(scope,element,attrs)
        {
            scope.data = refData.getToolByID(scope.toolId);
            var __icon = element.find("#icon");
            var draggable = new drag.Draggable(element,{getPlaceholder:function(){return __icon.clone().fadeTo(0,0.5)}});
            draggable.type = scope.data.id;
            /// $(element).css("background-image", "url('" + scope.data.imgPath + "')");
        }}
}]);

app.directive("toolIcon",["log","refData",function(log,refData)
{
    return {
        replace:true,
        templateUrl:"templates/angular/toolicon.html",
        scope:{toolId:"@"},
        controller:function($scope,$element,$attrs)
        {

        },
        link:function(scope,element,attrs)
        {
            scope.data = refData.getToolByID(scope.toolId);
            var __icon = element.find("#icon");
            var draggable = new drag.Draggable(element,{clone:true});
            draggable.type = scope.data.id;
        }}
}]);

app.directive("test",["log","refData",function(log,refData)
{
    return {
        replace:true,
        template:"<div>HELLOTHIS WORKS</div>",
        scope:{data:"="},
        controller:function($scope,$element,$attrs)
        {

        },
        link:function(scope,element,attrs)
        {



        }
    }
}]);