sp.namespace("pb.model.fields");




pb.model.fields.ConditionalField = pb.model.fields.Field.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        data = data || {};
        this._fieldType = pb.model.fields.FieldType.CONDITIONAL;
        this._name = data.name || ("Value_" + this._id);
        this._expressions = [];
        this._constraint;
        this._valueType = pb.model.fields.ValueType.UNDEFINED;
        this._objectType = new pb.model.fields.ObjectType(pb.model.fields.ObjectType.UNDEFINED);   //new pb.model.fields.ObjectType(pb.model.fields.ObjectType.VALUE); // represents the return type
        if(data.expressions)
        {
            for(var i=0; i<data.expressions.length; i++)
            {
                this._expressions.push(this.createExpression(data.expressions[i]));
            }
        }
        if(this._expressions.length==0)
        {
            this.addExpression();
        }
    },
    toString:function()
    {
        return "[ConditionalField + " + this._name + "valueType:" + this._valueType + " objectType:" + this._objectType +"]";
    },
    isValid:function()
    {
        for(var i=0; i<this._expressions.length; i++)
        {
            if(!this._expressions[i].isValid()) return false;
        }
        return (this._expressions.length)? true : false;
    },
    createExpression:function(data)
    {
        var expression = new pb.model.fields.ConditionalExpression(data);
        expression.setConstraint(this.getConstraint());
        expression.setObjectTypeConstraint(new pb.model.fields.TypeConstraint(this.objectType()));
        expression.addEventListener(this,pb.model.fields.ConstraintEvent.CHANGE,this.onExpressionConstraintChanged);
        expression.addEventListener(this,pb.model.ModelEvent.CHANGE,this.onExpressionChanged);
        expression.addEventListener(this,pb.model.ModelEvent.REMOVE,this.onDeleteExpression);
        return expression;
    },
    addExpression:function()
    {
        this._expressions.push(this.createExpression());
    },
    onDeleteExpression:function(event)
    {
        _.pull(this._expressions,event.target);
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE));
    },
    expressions:function()
    {
        return this._expressions;
    },
    valueType:function()
    {
        if(this._expressions.length==0) return pb.model.fields.ValueType.UNDEFINED;
        return this._expressions[0].returnValueType();
    },
    valueTypeString:function()
    {
        return pb.model.fields.ValueType.valueToString(this.valueType());
    },
    objectTypeString:function()
    {
        return pb.model.fields.ObjectType.objectTypeToString(this._objectType.getType());
    },
    onExpressionChanged:function(event)
    {
        // if the first expression changes its return value, the return value constraint
        // for all other expressions should be changed, so that we can only return values of the same type
        // from any particular conditional field
        if(event.property=="returnValue")
        {
            if(event.target==this._expressions[0])
            {
                this.updateExpressionObjectTypeConstraints();
            }
        }
    },
    getTypeConstraint:function()
    {
        if(this._expressions.length)
        {
            return new pb.model.fields.TypeConstraint(this._objectType,this._expressions[0].valueType());
        }
        return new pb.model.fields.TypeConstraint(this._objectType);
    },
    updateExpressionObjectTypeConstraints:function()
    {
        if(this._expressions.length)
        {
            this._objectType = new pb.model.fields.ObjectType(this._expressions[0].objectType().getType());
            var valueType = this._expressions[0].returnValueType();
            var typeConstraint = new pb.model.fields.TypeConstraint(this._objectType,valueType);
            for(var i=1; i<this._expressions.length; i++)
            {
                var type = (i==0)? pb.model.fields.ObjectType.UNDEFINED : this.objectType().getType();
                this._expressions[i].setObjectTypeConstraint(typeConstraint);
            }
        }
    },
    onExpressionConstraintChanged:function(event)
    {
        this.setConstraint(this.findConstraint());
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,"constraint"));
    },
    findConstraint:function()
    {
        for(var i=0; i<this._expressions.length; i++)
        {
            var constraint = this._expressions[i].findConstraint();
            if(constraint) return constraint;
        }
        return undefined;
    },
    setConstraint:function(val)
    {
        this._constraint = val;
        this.setConstraintOnExpressions();
    },
    getConstraint:function()
    {
        return this._constraint;
    },
    setConstraintOnExpressions:function()
    {
        for(var i=0; i<this._expressions.length; i++)
        {
            this._expressions[i].setConstraint(this.getConstraint());
        }
    },
    delete:function()
    {
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.REMOVE));
    },
    getData:function()
    {
        var data = this.__super();
        data.name = this._name;
        data.expressions = [];
        for(var i=0; i<this._expressions.length; i++)
        {
            data.expressions.push(this._expressions[i].getData());
        }
        return data;
    }
});




pb.model.fields.ConditionalExpression = pb.model.fields.Field.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        this.loadedData = data || {};
        this._fieldType = pb.model.fields.FieldType.CONDITIONAL;
        this._name = this.loadedData.name || ("Value_" + this._id);
        this._conditions = [];
        this._logicType = this.loadedData.logicType || pb.model.fields.ConditionalExpressionLogicTypes.AND;
        this._returnValue;
        this._valueType = pb.model.fields.ValueType.UNDEFINED;
        this._objectType = new pb.model.fields.ObjectType(pb.model.fields.ObjectType.UNDEFINED);

        if(this.loadedData.conditions)
        {
            for(var i=0; i<data.conditions.length; i++)
            {
                this._conditions.push(this.createCondition(this.loadedData.conditions[i]));
            }
        }
        di.resolve("Fields").addEventListener(this,pb.model.LoadEvent.COMPLETE,this.onFieldsLoaded);
    },
    onFieldsLoaded:function()
    {
        if(this.loadedData.returnValueId)  this.returnValueId(this.loadedData.returnValueId);
    },
    toString:function()
    {
        return "[ConditionalExpression + " + this._name + "]";
    },
    isValid:function()
    {
        for(var i=0; i<this._conditions.length; i++)
        {
            if(!this._conditions[i].isValid()) return false;
        }
        return this._returnValue!=undefined && this._valueType !=undefined;
    },
    createCondition:function(data)
    {
        var condition = new pb.model.fields.Condition(data);
        condition.setConstraint(this.getConstraint());
        condition.addEventListener(this,pb.model.fields.ConstraintEvent.CHANGE,this.onConditionConstraintChanged);
        condition.addEventListener(this,pb.model.ModelEvent.REMOVE,this.onDeleteCondition);
        return condition;
    },
    addCondition:function()
    {
        this._conditions.push(this.createCondition());
    },
    onDeleteCondition:function(event)
    {
        _.pull(this._conditions,event.target);
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE));
    },
    conditions:function()
    {
        return this._conditions;
    },
    logicType:function(val)
    {
       if(arguments.length)
       {
           var from = this._logicType;
           this._logicType = val;
           this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,"logicType",from,this._logicType))
       }
       return this._logicType;
    },
    returnValueType:function()
    {
        if(this._returnValue)
        {
            if(this._returnValue.isCRMField())
            {
                return pb.model.fields.ValueType.fromObjectType(this._returnValue.objectType().getType());
            }
            else if(this._returnValue.valueType)
            {
                return this._returnValue.valueType();
            }
        }
        return pb.model.fields.ValueType.UNDEFINED;
    },
    returnValue:function(val)
    {
        if(arguments.length)
        {
            var old = this._returnValue;
            this._returnValue = val;
            this._returnValueId = (this._returnValue)? this._returnValue.id() : undefined;
            this.updateObjectType();
            //NB The order these events are dispatched in is important. If we send the ConstraintEvent first, this will update the Fields singleton, which will trigger
            // a change event in any listeners, but BEFORE the parent Conditional has updated its return value - which would
            // mean anything listening for the Fields update would get the old return value.
            this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,"returnValue",old,this._returnValue));
            this.dispatchEvent(new pb.model.fields.ConstraintEvent(this,pb.model.fields.ConstraintEvent.CHANGE,this._returnValue));
        }
        return this._returnValue;
    },
    returnValueId:function(val)
    {
        if(arguments.length)
        {
            this.returnValue(di.resolve("Fields").deepSearchEntity(val))
        }
        return this._returnValueId;
    },
    updateObjectType:function()
    {
        if(this._returnValue)
        {
            this._objectType = this._returnValue.objectType().clone();
        }
        else
        {
            this._objectType =  new pb.model.fields.ObjectType(pb.model.fields.ObjectType.UNDEFINED);
        }
    },
    setObjectTypeConstraint:function(typeConstraint)
    {
        this._objectTypeConstraint = typeConstraint;//new pb.model.fields.ObjectType(type);
        if(this._objectTypeConstraint.objectType().getType() != pb.model.fields.ObjectType.UNDEFINED)
        {
            // if the parent conditional has imposed an allowable object type...
            if(this._returnValue && this._returnValue.objectType().getType() != this._objectTypeConstraint.objectType().getType())
            {
                // .. and it doesn't match the selected object, then we need to wipe it..
                this._returnValueId =
                this._returnValue = undefined;
            }
        }
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,"objectTypeConstraint"));

    },
    getObjectTypeConstraint:function()
    {
        return this._objectTypeConstraint;
    },
    onConditionConstraintChanged:function(event)
    {
        event.currentTarget = this;
        this.dispatchEvent(event);
    },
    setConstraint:function(val)
    {
        this._constraint = val;
        this.setConstraintOnConditions();
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,"constraint"));
    },
    getConstraint:function()
    {
        return this._constraint;
    },
    setConstraintOnConditions:function()
    {
        for(var i=0; i<this._conditions.length; i++)
        {
            this._conditions[i].setConstraint(this._constraint);
        }
    },
    getReturnValueOptions:function()
    {
        var result = [];
        var crmFields = di.resolve("Fields").getPageContextFields();
        for(var i=0; i<crmFields.length; i++)
        {
            // filter out any values which don't belong to the same collection...
            if(this.getConstraint() && this.getConstraint().constraint.isCRMField())
            {
                if(this.getConstraint().constrainer!=this)
                {
                    if(this.getConstraint().constraint.hasCollectionAncestor() && crmFields[i].hasCollectionAncestor())
                    {
                        if(!this.getConstraint().constraint.sharesCollectionAncestor(crmFields[i])) continue;
                    }
                }
            }
            // filter out any crm fields which do not represent atomic values..
            if(crmFields[i].objectType().isAtomic())
            {
                // if there is a value type in the current return type constraint, then for some value types
                // (eg. color) we filter out fields which don't share the actual value type. In other words, if
                // user has selected a color as a return value for one expression, we don't want them to select
                // an integer for the next expression, only an actual color
                if(this.getObjectTypeConstraint().valueType() && this.getObjectTypeConstraint().valueType()==pb.model.fields.ValueType.COLOR)
                {
                    // crm fields are never of type color, so we ignore it..
                    continue;
                }

                // if the parent conditional has imposed a constraint on the allowable
                // value types then filter only ones which match
                if(this.getObjectTypeConstraint().objectType().getType()!=pb.model.fields.ObjectType.UNDEFINED)
                {
                    if(this.getObjectTypeConstraint().objectType().getType() == crmFields[i].objectType().getType())
                    {
                        result.push(crmFields[i]);
                    }
                }
                else
                {
                    result.push(crmFields[i]);
                }
            }
        }
        var userFields = di.resolve("Fields").getFieldsByType(pb.model.fields.FieldType.VALUE | pb.model.fields.FieldType.DERIVED);
        _.remove(userFields,this);
        for(var i=0; i<userFields.length; i++)
        {
            // if there is a value type in the current return type constraint, then for some value types
            // (eg. color) we filter out fields which don't share the actual value type. In other words, if
            // user has selected a color as a return value for one expression, we don't want them to select
            // an integer for the next expression, only an actual color
            if(this.getObjectTypeConstraint().valueType() && this.getObjectTypeConstraint().valueType()==pb.model.fields.ValueType.COLOR)
            {
                if(userFields[i].valueType()!=this.getObjectTypeConstraint().valueType()) continue;
            }
            if(this.getObjectTypeConstraint().objectType().getType()!=pb.model.fields.ObjectType.UNDEFINED)
            {
                if(this.getObjectTypeConstraint().objectType().getType() == userFields[i].objectType().getType())
                {
                    result.push(userFields[i]);
                }
            }
            else
            {
                result.push(userFields[i]);
            }
        }
        return result;
    },
    findConstraint:function()
    {
        if(this._returnValue && this._returnValue.isCRMField() && this._returnValue.hasCollectionAncestor())
        {
            return new pb.model.fields.ContextConstraint(this,this._returnValue);
        }
        for(var i=0; i<this._conditions.length; i++)
        {
            var constraint = this._conditions[i].findConstraint();
            if(constraint)
            {
                return constraint;
            }
        }
        return null;
    },
    delete:function()
    {
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.REMOVE));
    },
    getData:function()
    {
        var data = this.__super();
        data.name = data._name;
        data.logicType = this._logicType;
        data.returnValueId = this._returnValueId;
        data.conditions = [];
        for(var i=0; i<this._conditions.length; i++)
        {
            data.conditions.push(this._conditions[i].getData());
        }
        return data;
    }
});




pb.model.fields.ConditionalExpressionLogicTypes = {AND:"AND",OR:"OR"}




pb.model.fields.Condition = sp.core.events.EventDispatcher.extend
({
    __constructor:function(data)
    {
        this.__super(data);
        this.loadedData = data || {};
        this._id = this.loadedData.id || sp.guid();
        this._target;
        this._operator = this.loadedData.operator;
        this._operand;
        this._constraint;
        di.resolve("Fields").addEventListener(this,pb.model.LoadEvent.COMPLETE,this.onFieldsLoaded);
    },
    onFieldsLoaded:function()
    {
        // we need to ensure that all fields are created before we try to set these values so
        // we only do this after the  Fields class has finished loading (and therefore has created all its entities
        if(this.loadedData.targetId) this._target = di.resolve("Fields").deepSearchEntity(this.loadedData.targetId);
        if(this.loadedData.operandId) this._operand = di.resolve("Fields").deepSearchEntity(this.loadedData.operandId);
    },
    id:function()
    {
        return this._id;
    },
    toString:function()
    {
        return "[Condition + " + this._id + "]";
    },
    isValid:function()
    {
        return this.targetId() != undefined && this.operandId() != undefined && this.operator() != undefined;
    },
    setConstraint:function(val)
    {
        this._constraint =  val;
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.CHANGE,"constraint"));
    },
    getConstraint:function()
    {
        return this._constraint;
    },
    target:function(val)
    {
        if(arguments.length)
        {
            this._target = val;
            this.dispatchEvent(new pb.model.fields.ConstraintEvent(this,pb.model.fields.ConstraintEvent.CHANGE,this._target));
        }
        return this._target;
    },
    targetId:function(val)
    {
        if(arguments.length)
        {
            this._target = di.resolve("Fields").deepSearchEntity(val);
            this.dispatchEvent(new pb.model.fields.ConstraintEvent(this,pb.model.fields.ConstraintEvent.CHANGE,this._target));
        }
        return (this.target())? this.target().id() : undefined;
    },
    targetValueType:function()
    {
        return (this.target())? this.target().getObjectOrContentType().getType() : null;
    },
    operator:function(val)
    {
        if(val!=undefined)
        {
            this._operator = val;
        }
        return this._operator;
    },
    operand:function(val)
    {
        if(val!=undefined)
        {
            this._operand = val;
        }
        return this._operand;
    },
    operandId:function(val)
    {
        if(arguments.length)
        {
            this._operand = di.resolve("Fields").deepSearchEntity(val);
            this.dispatchEvent(new pb.model.fields.ConstraintEvent(this,pb.model.fields.ConstraintEvent.CHANGE,this._operand));
        }
        return (this.operand())? this.operand().id() : undefined;
    },
    isValidOperand:function(field,target)
    {

        //TODO needs to be made more elegant when ObjectType is updated see comment on ObjecType
        var objectType = field.getObjectOrContentType(); // if we have an enum, evaluate the content type of that enum not the enum itself...


         // targetType is an optional parameter which checks that the type of the candidate field
        // matches the specified type. used by the getAvaiableOperands to ensure that only fields
        // with the same type as the target are selected...
        if(objectType.isAtomic())
        {
            if(!target || (target.getObjectOrContentType().getType() == objectType.getType())) return true;
        }
    },
    getAvailableTargets:function()
    {
        var result = [];
        var crmFields = di.resolve("Fields").getPageContextFields();
        for(var i=0; i<crmFields.length; i++)
        {
            if(this.getConstraint() && this.getConstraint().constraint.isCRMField())
            {
                if(this.getConstraint().constrainer!=this)
                {
                    if(this.getConstraint().constraint.hasCollectionAncestor() && crmFields[i].hasCollectionAncestor())
                    {
                        if(!this.getConstraint().constraint.sharesCollectionAncestor(crmFields[i])) continue;
                    }
                }
            }
            // the line below is not good. we are checking to see if a field is an enum so that
            // we can check if the enum has an atomic content type but this should be handled in the ObjectType
            // class so that it is aware of its type and it's content type. See comment  on ObjectType class.
            if(this.isValidOperand(crmFields[i])) result.push(crmFields[i]);
        }
        var userFields = di.resolve("Fields").getFieldsByType(pb.model.fields.FieldType.VALUE | pb.model.fields.FieldType.DERIVED);
        _.remove(userFields,this);
        result = result.concat(userFields);
        return result;
    },
    getAvailableOperators:function()
    {
        return pb.model.fields.OperatorTypes.getComparisonsForType(this.targetValueType());
    },
    getAvailableOperands:function()
    {
        //sp.out("getAavailableOperands target:" + this.target());
        var result = [];
        if(this.target())
        {
            var targetType = this.target().objectType().getType();
            var crmFields = di.resolve("Fields").getPageContextFields();
            //sp.out("crmFields:" + crmFields);
            for(var i=0; i<crmFields.length; i++)
            {
                //TODO need to tidy up... hacking to handle ENUMS
                if(this.isValidOperand(crmFields[i],this.target())) result.push(crmFields[i]);
            }
            var userFields = di.resolve("Fields").getFieldsByType(pb.model.fields.FieldType.VALUE | pb.model.fields.FieldType.DERIVED);
            _.remove(userFields, this);
            for (var i = 0; i < userFields.length; i++)
            {
                if(this.target().objectType().isEnum())
                {
                    if (userFields[i].objectType().getType() == this.target().getObjectOrContentType().getType()) result.push(userFields[i]);
                }
                else
                {
                    if (userFields[i].objectType().getType() == targetType) result.push(userFields[i]);
                }

            }
        }


        return result;
    },
    findConstraint:function()
    {
        if(this.target() && this.target().isCRMField() && this.target().hasCollectionAncestor()) return new pb.model.fields.ContextConstraint(this,this.target());
    },
    delete:function()
    {
        this.dispatchEvent(new pb.model.ModelEvent(this,pb.model.ModelEvent.REMOVE));
    },
    getData:function()
    {
        var data = {};
        data.id = this.id;
        data.targetId = this.targetId();
        data.operandId = this.operandId();
        data.operator = this.operator();
        return data;
    }
})


pb.model.fields.TypeConstraint = Class.extend
({
    __constructor:function(objectType,valueType)
    {
        this._objectType = objectType;
        this._valueType = valueType;
    },
    toString:function()
    {
        return "[TypeConstraint, objectType:" + this._objectType + " valueType:" + this._valueType + "]";
    },
    objectType:function()
    {
        return this._objectType;
    },
    valueType:function()
    {
        return this._valueType;
    }
})


pb.model.fields.ContextConstraint = Class.extend
({
    __constructor:function(constrainer,constraint)
    {
        this.constrainer = constrainer;
        this.constraint = constraint;
    },
    toString:function()
    {
        return "[Constraint, constrainer:" + this.constrainer + " constraint:" + this.constraint + "]";
    }
})




pb.model.fields.ConstraintEvent = sp.core.events.Event.extend
({
    __constructor:function(target,type,constraint)
    {
        this.__super(target,type);
        this.currentTarget = target;
        this.constraint = constraint;
    },
    toString:function()
    {
        return "[ConstraintEvent constraint:" + this.constraint  + "]";
    }
})
pb.model.fields.ConstraintEvent.CHANGE = "constraint_change";
