app.directive("userFieldValue",["log","refData",function(log,refData)
{
    return {
        replace:true,
        templateUrl:"templates/angular/user-fields/user-field-value.html",
        scope:{
                item:"="
              },
        controller:function($scope,$element,$attrs)
        {

        },
        link:function(scope,element,attrs)
        {
            // Variables
            scope.valueTypes = pb.model.fields.ValueType;
            scope.dateOptions = {target:scope.item,
                                 getter:scope.item.value,
                                 setter:scope.item.value};
            scope.valueTypeOptions = [
                {value:"Number",           key:pb.model.fields.ValueType.NUMBER},
                {value:"Small text",       key:pb.model.fields.ValueType.SMALLTEXT},
                {value:"Large text",       key:pb.model.fields.ValueType.LARGETEXT},
                {value:"Date",             key:pb.model.fields.ValueType.DATE},
                {value:"Number of days",   key:pb.model.fields.ValueType.DAYS},
                {value:"Number of weeks",  key:pb.model.fields.ValueType.WEEKS},
                {value:"Number of months",  key:pb.model.fields.ValueType.MONTHS},
                {value:"Number of years", key:pb.model.fields.ValueType.YEARS},
                {value:"True or false",    key:pb.model.fields.ValueType.BOOLEAN},
                {value:"Color",            key:pb.model.fields.ValueType.COLOR}
            ];

            // Methods..
            scope.setEditMode = function(val)
            {
                scope.editMode = val;
            }
            scope.open = function()
            {
                scope.$parent.onOpenItem(this);
            }
            scope.close=function()
            {
                scope.setEditMode(false);
            }
            scope.getTypeOf = function()
            {
                return typeof(scope.item.valueType());
            }

            scope.delete = function()
            {
                scope.item.delete();
            }

            var __scope = scope;

            // Init
            scope.open();
        }
    }
}]);

app.directive("userFieldDerived",["log","refData",function(log,refData)
{
    return {
        replace:true,
        templateUrl:"templates/angular/user-fields/user-field-derived.html",
        scope:{
            item:"="
        },
        controller:function($scope,$element,$attrs)
        {

        },
        link:function(scope,element,attrs)
        {

            // Variables
            scope.operands = [];
            scope.objectTypeOptions = [
                {value:"Number",           key:pb.model.fields.ObjectType.NUMBER},
                {value:"Text",             key:pb.model.fields.ObjectType.STRING},
                {value:"True / False",     key:pb.model.fields.ObjectType.BOOLEAN},
                {value:"Date",             key:pb.model.fields.ObjectType.DATE}
            ]

            // Methods
            scope.setEditMode = function(val)
            {
                scope.editMode = val;
            }
            scope.open = function()
            {
                scope.$parent.onOpenItem(this);
            }
            scope.close= function()
            {
                scope.setEditMode(false);
            }
            scope.delete = function()
            {
                scope.item.delete();
            }

            scope.toggle = function()
            {
                if(scope.editMode)
                {
                    scope.close();
                }
                else
                {
                    scope.open();
                }
            }

            scope.deleteOperation = function(operation)
            {
                scope.item.deleteOperation(operation);
            }


            function setSourceFields()
            {
                // var fields = di.resolve("Fields").getPageContextFields();
                var fields = scope.item.getAvailableSourceFields();
                scope.displayFields = [];
                for(var i=0; i<fields.length; i++)
                {
                    var displayStr = (fields[i].fieldType() == pb.model.fields.FieldType.CRM)? fields[i].path() : fields[i].name();
                    scope.displayFields.push({id:fields[i].id(),label:displayStr});
                }
            }
            function onDataChanged(event)
            {
                if(event && event.target==scope.item) return; // prevents fields triggering a change event on themselves..
                setSourceFields();
            }

            di.resolve("Fields").addEventListener(scope,pb.model.ModelEvent.CHANGE,onDataChanged);
            di.resolve("PageContext").addEventListener(scope,pb.model.ModelEvent.CHANGE,onDataChanged);
            setSourceFields();



            scope.open();
        }
    }
}]);

app.directive("userFieldDerivedOperation",["log","refData",function(log,refData)
{
    return {
        replace:true,
        templateUrl:"templates/angular/user-fields/user-field-derived-operation.html",
        scope:{
            operation:"="
        },
        controller:function($scope,$element,$attrs)
        {

        },
        link:function(scope,element,attrs)
        {

            // Variables
            scope.operands = [];
            scope.objectTypeOptions = [
                {value:"Number",           key:pb.model.fields.ObjectType.NUMBER},
                {value:"Text",             key:pb.model.fields.ObjectType.STRING},
                {value:"True / False",     key:pb.model.fields.ObjectType.BOOLEAN},
                {value:"Date",             key:pb.model.fields.ObjectType.DATE}
            ]

            function onDataChanged(event)
            {
                if(event && event.target==scope.operation) return; // prevents fields triggering a change event on themselves..
                setOperators();
                setOperands();
            }

            function setOperands()
            {
                var fields = scope.operation.getAvailableOperands();
                scope.operands = [];
                for(var i=0; i<fields.length; i++)
                {
                    var displayStr = (fields[i].fieldType() == pb.model.fields.FieldType.CRM)? fields[i].path() : fields[i].name();
                    scope.operands.push({id:fields[i].id(),label:displayStr});
                }
            }

            function setOperators()
            {
                scope.operators = scope.operation.getAvailableOperators();
            }

            function onDataChanged(event)
            {
                if(event.property=="sourceField")
                {
                    setOperators();
                    setOperands();
                }
                else if(event.property=="operator")
                {
                    setOperands();
                }
            }

            scope.operation.addEventListener(this,pb.model.ModelEvent.CHANGE,onDataChanged);

            setOperators();
            setOperands();

        }
    }
}]);

app.directive("userFieldConditional",["log","refData",function(log,refData)
{
    return {
        replace:true,
        templateUrl:"templates/angular/user-fields/user-field-conditional.html",
        scope:{
            item:"="
        },
        controller:function($scope,$element,$attrs)
        {

        },
        link:function(scope,element,attrs)
        {

            scope.setEditMode = function(val)
            {
                scope.editMode = val;
            }

            scope.open = function()
            {
                scope.$parent.onOpenItem(this);
            }

            scope.close=function()
            {
                scope.setEditMode(false);
            }

            scope.delete = function()
            {
                scope.item.delete();
            }

            scope.toggle = function()
            {
                if(scope.editMode)
                {
                    scope.close();
                }
                else
                {
                    scope.open();
                }
            }

            scope.operatorOptions = [
                {value:"=",  key:pb.model.fields.OperatorTypes.EQUAL},
                {value:">",  key:pb.model.fields.OperatorTypes.GREATERTHAN},
                {value:"<",  key:pb.model.fields.OperatorTypes.LESSTHAN},
                {value:"<>", key:pb.model.fields.OperatorTypes.NOT},
                {value:"<=", key:pb.model.fields.OperatorTypes.LESSTHANOREQUAL},
                {value:">=", key:pb.model.fields.OperatorTypes.GREATERTHANOREQUAL}
            ];

            scope.setResultFields = function()
            {
                var fields = di.resolve("Fields").getFieldsByType(
                                                                    pb.model.fields.FieldType.CRM
                                                                    | pb.model.fields.FieldType.VALUE
                                                                    | pb.model.fields.FieldType.DERIVED
                                                                 );
                scope.resultFields = [];
                for(var i=0; i<fields.length; i++)
                {
                    var displayStr = (fields[i].fieldType()== pb.model.fields.FieldType.CRM)? fields[i].path() : fields[i].name();
                    if(fields[i].objectType().isAtomic()) scope.resultFields.push({id:fields[i].id(),label:displayStr});
                }
            }
            scope.setResultFields();
            di.resolve("Fields").addEventListener(scope,pb.model.ModelEvent.CHANGE,scope.setResultFields);





            scope.open();
        }
    }
}]);

app.directive("userFieldConditionalExpression",["log","refData",function(log,refData)
{
    return {
                replace:true,
                templateUrl:"templates/angular/user-fields/user-field-conditional-expression.html",
                scope:{
                            item:"="
                      },
                controller:function($scope,$element,$attrs)
                {

                },
                link:function(scope,element,attrs)
                {
                    function setReturnValueOptions()
                    {
                        var fields = scope.item.getReturnValueOptions();
                        scope.returnValueOptions = [{}];
                        for(var i=0; i<fields.length; i++)
                        {
                            var displayStr = (fields[i].fieldType()== pb.model.fields.FieldType.CRM)? fields[i].path() : fields[i].name();
                            if(fields[i].objectType().isAtomic()) scope.returnValueOptions.push({id:fields[i].id(),label:displayStr});
                        }
                    }

                    function onItemChanged(event)
                    {
                        if(event.property=="constraint" || event.property=="objectTypeConstraint")
                        {
                            onDataChanged();
                        }
                    }

                    function onDataChanged()
                    {
                        setReturnValueOptions();
                    }

                    setReturnValueOptions();
                    scope.item.addEventListener(this,pb.model.ModelEvent.CHANGE,onItemChanged)
                    di.resolve("Fields").addEventListener(scope,pb.model.ModelEvent.CHANGE,onDataChanged);
                    di.resolve("PageContext").addEventListener(scope,pb.model.ModelEvent.CHANGE,onDataChanged);

                    scope.delete = function()
                    {
                        scope.item.delete();
                    }

                }
            }
}]);

app.directive("userFieldCondition",["log","refData",function(log,refData)
{
    return {
                replace:true,
                templateUrl:"templates/angular/user-fields/user-field-condition.html",
                scope:{
                        item:"="
                },
                controller:function($scope,$element,$attrs)
                {

                },
                link:function(scope,element,attrs)
                {

                    function setTargetOptions()
                    {
                        var fields = scope.item.getAvailableTargets();
                        scope.targets = [{}];
                        for(var i=0; i<fields.length; i++)
                        {
                            var displayStr = (fields[i].fieldType()== pb.model.fields.FieldType.CRM)? fields[i].path() : fields[i].name();
                            scope.targets.push({id:fields[i].id(),label:displayStr});
                        }
                    }

                    function setOperands()
                    {
                        var fields = scope.item.getAvailableOperands();
                        scope.operands = [{}];
                        for(var i=0; i<fields.length; i++)
                        {
                            var displayStr = (fields[i].fieldType() == pb.model.fields.FieldType.CRM)? fields[i].path() : fields[i].name();
                            scope.operands.push({id:fields[i].id(),label:displayStr});
                        }
                    }

                    function setOperators()
                    {
                        scope.operators = scope.item.getAvailableOperators();
                    }

                    function onDataChanged(event)
                    {
                        if(event && event.target==scope.item) return; // prevents fields triggering a change event on themselves..
                        setTargetOptions();
                        setOperands();
                        setOperators();
                    }

                    function onItemChanged(event)
                    {
                        if(event.property=="constraint")
                        {
                            onDataChanged(event);
                        }
                    }

                    // Init
                    scope.$watchGroup(["item.targetId()","item.targetValueType()"],function()
                    {
                        setOperands();
                        setOperators();
                    })
                    scope.item.addEventListener(this,pb.model.ModelEvent.CHANGE,onItemChanged);
                    di.resolve("Fields").addEventListener(scope,pb.model.ModelEvent.CHANGE,onDataChanged);
                    di.resolve("PageContext").addEventListener(scope,pb.model.ModelEvent.CHANGE,onDataChanged);

                    setTargetOptions();

                    scope.delete = function()
                    {
                        scope.item.delete();
                    }

                }
            }
}]);