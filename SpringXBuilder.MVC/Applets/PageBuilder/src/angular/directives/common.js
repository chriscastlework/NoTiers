app.directive("pbCollapsible",["log","refData",function(log,refData)
{
    return {
                transclude:true,
                templateUrl:"templates/angular/common/collapsible.html",
                link:function(scope,element,attrs)
                {
                    scope.open = true;
                    scope.label = "-";
                    scope.toggle = function()
                    {
                        scope.open = !scope.open;
                        scope.label = (scope.open)? "-" : "...";
                    }
                }
            }
}]);