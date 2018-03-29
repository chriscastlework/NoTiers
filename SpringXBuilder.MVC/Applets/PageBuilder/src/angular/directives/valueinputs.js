app.directive("datePicker",[function()
{
    return {
        replace:false,
        scope:{datePicker:"="},
        controller:function($scope,$element,$attrs)
        {

        },
        link:function(scope,element,attrs)
        {
            element.datepicker();
        }
    }
}]);

app.filter('number', [function() {
    return function(input) {
        return parseInt(input, 10);
    };
}]);