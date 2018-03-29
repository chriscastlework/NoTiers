app.controller("main",["$scope","refData", "appletParameters",function($scope,refData, appletParameters)
{
    $scope.selectedPanel = "details";
    $scope.tools = refData.getTools();
    $scope.displayAsIcons = false;
    $scope.selectPanel = function(panel)
    {
        $scope.selectedPanel = panel;
    }
    $scope.toggleView = function()
    {
        $scope.displayAsIcons = !$scope.displayAsIcons;
    }

    $scope.getDate = function()
    {
        return $scope.date;
    }
    $scope.setDate = function(val)
    {
        if(val) $scope.date = val;
    }
    $scope.date = new Date();
    $scope.dateOptions = {item:$scope,
                          getter:$scope.getDate,
                          setter:$scope.setDate};

    /*
    //TODO: Test Load: need to handle load response
    var param = function(p){ return appletParameters.getParam(p) };

    var url = [param('url'), param('fileopen'), '?'].join('');

    $.ajax(
        url + $.param({
            RecordId: param('recordid'),
            CustomObjectKey: param('customobjectkey'),
            CRMKey: param('crmkey')
        }),
        {
            //success: function(){ console.log("LOAD: ", arguments[0]) }
        }
    );*/
}]);


app.controller("fieldsController",["$scope",function($scope)
{
    var fields = di.resolve("Fields");

    $scope.valueItems = fields.getItemsByFieldType(pb.model.fields.FieldType.VALUE);
    $scope.derivedItems = fields.getItemsByFieldType(pb.model.fields.FieldType.DERIVED);
    $scope.conditionalItems = fields.getItemsByFieldType(pb.model.fields.FieldType.CONDITIONAL);

    $scope.addValue = function(){
                                    fields.addValue();
                                    $scope.valueItems = fields.getItemsByFieldType(pb.model.fields.FieldType.VALUE);
                                }
    $scope.addDerived = function(){
                                    fields.addDerived();
                                    $scope.derivedItems = fields.getItemsByFieldType(pb.model.fields.FieldType.DERIVED);
                                  };

    $scope.addConditional = function(){
                                        fields.addConditional()
                                        $scope.conditionalItems = fields.getItemsByFieldType(pb.model.fields.FieldType.CONDITIONAL);
                                      };

    var currentEditedItem;
    $scope.onOpenItem =  function(childScope)
    {
        if(currentEditedItem) currentEditedItem.setEditMode(false);
        currentEditedItem = childScope;
        currentEditedItem.setEditMode(true);
    }
    $scope.selectedFieldsPanel = 'values';
    $scope.selectFieldsPanel = function(panelId)
    {
        $scope.selectedFieldsPanel = panelId;
    }

    function onModelChanged(event)
    {
        $scope.valueItems = fields.getItemsByFieldType(pb.model.fields.FieldType.VALUE);
        $scope.derivedItems = fields.getItemsByFieldType(pb.model.fields.FieldType.DERIVED);
        $scope.conditionalItems = fields.getItemsByFieldType(pb.model.fields.FieldType.CONDITIONAL);
    }


    // var fields = di.resolve("Fields"); Duplicate resolver
    fields.addEventListener(this,pb.model.ModelEvent.CHANGE,onModelChanged);



}]);

app.controller("schemaController",["$scope",function($scope)
{

    $scope.fields = [];
    function onModelChanged(event)
    {
        var pageContext = di.resolve("PageContext");
        if(pageContext && pageContext.getContext())
        {
            $scope.fields = pageContext.getContext().fields();
            sp.out("fields:" + $scope.fields);
        }
    }
    di.resolve("PageContext").addEventListener(this,pb.model.ModelEvent.CHANGE,onModelChanged);


}]);
