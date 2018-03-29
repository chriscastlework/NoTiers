sp.namespace('sp.core.data.validation.ValidationResult',
             'sp.core.data.validation.type.Base',
             'sp.core.data.validation.type.Date',
             'sp.core.data.validation.type.NotNull',
             'sp.core.data.validation.type.Required',
             'sp.core.data.validation.type.Number',
             'sp.core.data.validation.type.GreaterThan',
             'sp.core.data.validation.type.LessThan',
             'sp.core.data.validation.type.Email',
             'sp.core.data.validation.type.Custom',
             'sp.core.data.validation.behavior.Base',
             'sp.core.data.validation.behavior.LogToConsole',
             'sp.core.data.validation.behavior.Custom',
             'sp.core.data.validation.behavior.PopUpManager',
             'sp.core.data.validation.behavior.PopUp',
             'sp.core.data.validation.behavior.FieldHighlight',
             'sp.core.data.validation.Validator',
             'sp.core.data.validation.Validation',
             'sp.core.data.validation.ValidationOptions',
             'sp.core.data.validation.ValidationBasis',
             'sp.core.data.validation.ValueWrapper',
             'sp.core.data.validation.DomElementWrapper');

sp.core.data.validation.ValidationResult = Class.extend
(
{
    __constructor: function(parent, validity, message, context)
    {
        this.parent = parent;
        this.validity = validity;
        this.message = message;
        this.context = context || $(document.body)[0];
    },

    isValid: function()
    {
        return this.validity;
    },

    getValue: function()
    {
        if (typeof this.parent.field.getValue === 'function')
        {
            return this.parent.field.getValue();
        }
        else
        {
            return this.parent.field;
        }
    }
}
);

// ===========================================================
// Validation types
// ===========================================================
sp.core.data.validation.type.Base = sp.core.events.EventDispatcher.extend
(
{
    __constructor: function(behavior)
    {
        this.behavior = behavior || new sp.core.data.validation.behavior.DEFAULT();
        this.message = 'Invalid value';
        this.lastResult = null;
    },

    withBehavior: function(behavior)
    {
        this.behavior = behavior;
        return this;
    },

    withMessage: function(message)
    {
        this.message = message;
        return this;
    },

    getResult: function()
    {
        return this.lastResult;
    },

    validate: function(value, parent, context)
    {
        var isValid = this.validateValue(value, parent, context);
        var result = new sp.core.data.validation.ValidationResult(parent, isValid, this.message, context);
        this.lastResult = result;
        this.behavior.execute(result);
        return isValid;
    },

    // override this in child types
    validateValue: function(value, field, context)
    {
        return true;
    }
}
);

sp.core.data.validation.type.Date = sp.core.data.validation.type.Base.extend
(
{
    __constructor: function(behavior)
    {
        this.__super(behavior);
        this.message = "Please, select a valid date!";
    },

    validateValue: function(val, field, context)
    {
        // expect dd/mm/yyyy
        var regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if(!regex.test(val)) return false;
        var d = new Date(RegExp.$2+'/'+RegExp.$1+'/'+RegExp.$3);
        return ( parseInt(RegExp.$2, 10) == (1+d.getMonth()) ) &&
            (parseInt(RegExp.$1, 10) == d.getDate()) &&
            (parseInt(RegExp.$3, 10) == d.getFullYear() );
    }
}
);

sp.core.data.validation.type.NotNull = sp.core.data.validation.type.Base.extend
(
{
    __constructor: function(behavior)
    {
        this.__super(behavior);
        this.message = "This field may not be null";
    },

    validateValue: function(val,field,context)
    {
        return val !== null;
    }
}
);

sp.core.data.validation.type.Required = sp.core.data.validation.type.Base.extend
(
{
    __constructor: function(behavior)
    {
        this.__super(behavior);
        this.message = "This field is required";
    },

    validateValue: function(val,field,context)
    {
        var isNotNull = val !== null;
        var isNotUndefined = val !== undefined;
        var isNotEmptyString = !(/^\s*$/.test(val));

        return isNotNull && isNotUndefined && isNotEmptyString;
    }
}
);


sp.core.data.validation.type.Number = sp.core.data.validation.type.Base.extend
(
{
    __constructor: function(behavior)
    {
        this.__super(behavior);
        this.message = "This field must contain a number";
    },

    validateValue: function(val,field,context)
    {
        return (!isNaN(val) && !/^\s+$/.test(val));
    }
}
);

sp.core.data.validation.type.GreaterThan = sp.core.data.validation.type.Base.extend
(
{
    __constructor: function(gtValue, behavior)
    {
        this.gtValue = gtValue;
        this.__super(behavior);
        this.message = "This field's value must be greater than "+gtValue;
    },

    validateValue: function(val,field,context)
    {
        return val > this.gtValue;
    }
}
);

sp.core.data.validation.type.LessThan = sp.core.data.validation.type.Base.extend
(
{
    __constructor: function(ltValue, behavior)
    {
        this.ltValue = ltValue;
        this.__super(behavior);
        this.message = "This field's value must be less than "+ltValue;
    },

    validateValue: function(val,field,context)
    {
        return val < this.ltValue;
    }
}
);

sp.core.data.validation.type.Email = sp.core.data.validation.type.Base.extend
(
{
    EMAIL_REGEX: /^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,

    __constructor: function(behavior)
    {
        this.__super(behavior);
        this.message = "This field's value must be an email address";
    },

    validateValue: function(val,field,context)
    {
        return this.EMAIL_REGEX.test(val);
    }
}
);

sp.core.data.validation.type.Custom = sp.core.data.validation.type.Base.extend
(
{
    __constructor: function(func, behavior)
    {
        this.func = func;
        this.__super(behavior);
        this.message = "Custom validation failed";
    },

    validateValue: function(val,field,context)
    {
        return this.func(val);
    }
}
);

// ===========================================================
// Validation behaviors - used when validation fails
// ===========================================================
sp.core.data.validation.behavior.Base = Class.extend
(
{
    execute: function(result)
    {
        return result.isValid()? this.executeValid(result) : this.executeInvalid(result);
    },
    executeValid: function (result)
    {},
    executeInvalid: function (result)
    {}
}
);

sp.core.data.validation.behavior.LogToConsole = sp.core.data.validation.behavior.Base.extend
(
{
    executeInvalid: function(result)
    {
        sp.out(result.message);
    }
}
);

sp.core.data.validation.behavior.DEFAULT = sp.core.data.validation.behavior.LogToConsole;

sp.core.data.validation.behavior.Custom = sp.core.data.validation.behavior.Base.extend
(
{
    __constructor: function(func)
    {
        this.func = func;
    },

    executeInvalid: function(result)
    {
        this.func(result);
    }
}
);

sp.core.data.validation.behavior.PopUpManager =
{
    popups: [],
    register: function(element)
    {
        sp.core.data.validation.behavior.PopUpManager.popups.push(element);
    },
    hideAll: function()
    {
        for (var i= 0, len=sp.core.data.validation.behavior.PopUpManager.popups.length; i<len; i++)
        {
            var popup = sp.core.data.validation.behavior.PopUpManager.popups[i];
            if (popup) popup.hide()
        }
    }
};

sp.core.data.validation.behavior.PopUp = sp.core.data.validation.behavior.Base.extend
(
{
    __constructor: function(options)
    {
        var defaultOptions = {
            position: sp.core.data.validation.behavior.PopUp.BELOW
        };

        this.options = $.extend({}, defaultOptions, options);
    },

    init: function(context)
    {
        this.graphic = new sp.core.graphics.Graphic($('<div/>')[0]);
        this.graphic.addClass('sp_validation_popup');
        $(context).append(this.graphic.getGraphic());
        this.graphic.click($.proxy(this.onPopupClick, this));

        sp.core.data.validation.behavior.PopUpManager.register(this.graphic);
        this.initialized = true;
    },

    onPopupClick: function (event)
    {
        this.graphic.hide();
    },

    position: function(field)
    {
        var $field = $(field);
        var $graphic = $(this.graphic.getGraphic());
        var position = this.options.position;

        var fieldPos = $field.offset();

        $graphic.offset({
            top: fieldPos.top +
                 (position === sp.core.data.validation.behavior.PopUp.BELOW? $field.height() + 5: 0),
            left: fieldPos.left +
                  (position === sp.core.data.validation.behavior.PopUp.BESIDE? $field.width() + 5: 0)
        });
    },

    executeInvalid: function(result)
    {
        if (!this.initialized) this.init(result.context);
        var $graphic = $(this.graphic.getGraphic());
        this.graphic.show();
        this.position(result.parent.getGraphic())
        $graphic.html(result.message);
    },

    executeValid: function(result)
    {
        if (!this.initialized) return;
        this.graphic.hide();
    }
}
);

sp.core.data.validation.behavior.PopUp.BELOW = 'below';
sp.core.data.validation.behavior.PopUp.BESIDE = 'beside';

sp.core.data.validation.behavior.FieldHighlight = sp.core.data.validation.behavior.Base.extend
(
{
    executeInvalid: function(result)
    {
        var $el = $(result.parent.getGraphic());
        $el.css('border-color', 'red');
        $el.attr('title', result.message);
    },

    executeValid: function(result)
    {
        var $el = $(result.parent.getGraphic());
        $el.css('border-color', '');
        $el.attr('title', '');
    }
}
);

// ===========================================================
// Validation & validator
// ===========================================================
sp.core.data.validation.Validator = sp.core.events.EventDispatcher.extend
(
{
    __constructor: function(options)
    {
        this.__super();
        this.options = options;
        this.elements = [];
    },

    add: function()
    {
        for (var i= 0, len=arguments.length; i<len; i++) this.elements.push(arguments[i]);
    },

    remove: function(paramItem)
    {
        // duck type check if this is a validation or field
        if (paramItem.getField)
        {
            // validation
            return sp.utils.ArrayUtils.removeElement(this.elements, paramItem);
        }
        else
        {
            // field
            return this.removeValidationsByField(paramItem);
        }
    },

    removeValidationsByField: function (pField)
    {
        var elementsToRemove = $.grep(this.elements, function(validation)
        {
            return validation.getField() === pField;
        });

        for (var i= 0, el=elementsToRemove[i]; i < elementsToRemove.length; i++, el = elementsToRemove[i])
        {
            if (!el) continue;
            sp.utils.ArrayUtils.removeElement(this.elements, el);
        }
    },

    validate: function()
    {
        var results = [];
        for (var i= 0, validation=this.elements[i]; i < this.elements.length; i++, validation = this.elements[i])
        {
            if (!validation || !validation.validate || !validation.getResult) continue;
            validation.validate();
            results.push(validation.getResult());
        }
        return results;
    }
}
);

sp.core.data.validation.Validation = sp.core.events.EventDispatcher.extend
(
{
    __constructor: function(field,type,options)
    {
        this.field = field;
        this.type = type;
        this.options = options || new sp.core.data.validation.ValidationOptions();
        if(this.options.validationBasis===sp.core.data.validation.ValidationBasis.AUTOMATIC)
        {
            this.field.addEventListener(this,sp.core.data.DataEvent.CHANGE, this.onChanged);
        }
    },

    getResult: function()
    {
        return this.type.getResult();
    },

    getField: function()
    {
        return this.field;
    },

    getGraphic: function()
    {
        return this.options.graphic || this.field.getGraphic();
    },

    onChanged: function(event)
    {
        this.validate();
    },

    validate: function()
    {
        var value='';

        if (this.field.getValue) value = this.field.getValue();

        if (this.field.getSelectedValue) //used to validate springsX contact selector
        {
            value = this.field.getSelectedValue();
            if (value == 'SEARCH') value = '';
        }

        if (this.field.getSelectedID)
        {
            value = this.field.getSelectedID();
            if (value == 'SEARCH') value = '';
        }

        if (this.field.getData) value = this.field.getData();

        return this.type.validate(value, this);
    }
}
);

sp.core.data.validation.ValidationOptions = sp.core.data.ValueObject.extend
(
{
    __constructor: function(valueMap)
    {
        this.__super(valueMap);
    },

    setDefaults: function()
    {
        this.validationBasis = sp.core.data.validation.ValidationBasis.MANUAL;
    }
}
);

sp.core.data.validation.ValidationBasis =
{
    AUTOMATIC : "automatic",
    MANUAL : "manual"
};

// ===========================================================
// Value and DOM input wrappers
// ===========================================================
sp.core.data.validation.ValueWrapper = sp.core.events.EventDispatcher.extend
(
{
    __constructor: function(value)
    {
        this.__super();
        this.value = value;
    },

    getValue: function()
    {
        return this.value;
    },

    setValue: function(val)
    {
        this.value = val;
        this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.CHANGE))
    }
}
);

sp.core.data.validation.DomElementWrapper = sp.core.events.EventDispatcher.extend
(
{
    __constructor: function(element)
    {
        this.__super();
        this.element = element;
        this.$element = $(element);

        this.$element.change($.proxy(this.onElementChange, this));
    },

    onElementChange: function(event)
    {
        this.dispatchEvent(new sp.core.data.DataEvent(this, sp.core.data.DataEvent.CHANGE))
    },

    getValue: function()
    {
        return this.$element.val();
    },

    getGraphic: function()
    {
        return this.element;
    }
}
);
