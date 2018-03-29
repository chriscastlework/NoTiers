sp.namespace('sp.core.data.validation.test.ValidationTest');

sp.core.data.validation.test.ValidationTest = Class.extend
(
{
    run: function()
    {
        var validation = sp.core.data.validation;
        var nullField = new validation.ValueWrapper(null);

        this.test('value wrapper 1', nullField.getValue(), null);

        // test base validation
        var baseValidation = new validation.Validation(nullField, new validation.type.Base());
        this.test('default validation returns true', baseValidation.validate(), true);

        // test null validation
        var nullValidation = new validation.Validation(nullField, new validation.type.NotNull());
        this.test('null validation returns false on null field', nullValidation.validate(), false);

        // test automatic validation
        var automaticValidationTriggered = false;
        var automaticCustomBehavior = new validation.behavior.Custom(function(){automaticValidationTriggered = true});
        var automaticValidation = new validation.Validation(nullField, new validation.type.NotNull(automaticCustomBehavior), {validationBasis: validation.ValidationBasis.AUTOMATIC});
        nullField.setValue(null);

        this.test('automatic validation triggered, checked with custom validation', automaticValidationTriggered, true);


        // test greater than
        var strNumberField = new validation.ValueWrapper('5');
        this.test('value wrapper 2', strNumberField.getValue(), '5');
        var greaterThanFourValidation = new validation.Validation(strNumberField, new validation.type.GreaterThan(4));
        this.test('"greater than" validation success', greaterThanFourValidation.validate(), true);
        strNumberField.setValue('3');
        this.test('"greater than" validation failure', greaterThanFourValidation.validate(), false);

        // test less than
        var lessThanFourValidation = new validation.Validation(strNumberField, new validation.type.LessThan(4));
        this.test('"less than" validation success', lessThanFourValidation.validate(), true);
        strNumberField.setValue('5');
        this.test('"less than" validation failure', lessThanFourValidation.validate(), false);

        // test required validation
        var stringField = new validation.ValueWrapper('test');
        var requiredValidation = new validation.Validation(stringField, new validation.type.Required());
        this.test('required validation success', requiredValidation.validate(), true);
        stringField.setValue('');
        this.test('required validation failure 1', requiredValidation.validate(), false);
        stringField.setValue(' ');
        this.test('required validation failure 2', requiredValidation.validate(), false);
        stringField.setValue(null);
        this.test('required validation failure 3', requiredValidation.validate(), false);
        stringField.setValue(undefined);
        this.test('required validation failure 4', requiredValidation.validate(), false);

        // test custom function based validation
        stringField.setValue('custom');
        var customValidation = new validation.Validation(stringField, new validation.type.Custom(this._testCustomValidation))
        this.test('custom function based validation success', customValidation.validate(), true);
        stringField.setValue('default');
        this.test('custom function based validation failure', customValidation.validate(), false);

        // test number validation
        stringField.setValue('5');
        var numberValidation = new validation.Validation(stringField, new validation.type.Number())
        this.test('number validation success 1', numberValidation.validate(), true);
        stringField.setValue('.1');
        this.test('number validation success 2', numberValidation.validate(), true);
        stringField.setValue('default');
        this.test('number validation failure 1', numberValidation.validate(), false);
        stringField.setValue(' ');
        this.test('number validation failure 2', numberValidation.validate(), false);

        // test date validation
        stringField.setValue('01/06/2012');
        var dateValidation = new validation.Validation(stringField, new validation.type.Date());
        this.test('date validation success', dateValidation.validate(), true);
        stringField.setValue('01/13/2012');
        this.test('date validation failure 1', dateValidation.validate(), false);
        stringField.setValue('something');
        this.test('date validation failure 2', dateValidation.validate(), false);


        // test validator
        var dummyField = new validation.ValueWrapper(true);
        var validator = new validation.Validator();
        var dummyType = new validation.type.Base();
        var val1 = new validation.Validation(dummyField, dummyType);
        var val2 = new validation.Validation(dummyField, dummyType);
        var val3 = new validation.Validation(dummyField, dummyType);
        var val4 = new validation.Validation(dummyField, dummyType);

        validator.add(val1,val2,val3,val4);
        this.test('validator add validators', validator.elements.length, 4);
        validator.remove(val1);
        this.test('validator remove by validator', validator.elements.length, 3);
        validator.remove(dummyField);
        this.test('validator remove by field', validator.elements.length, 0);
        validator.add(val1,val2,val3,val4);
        var validatorResults = validator.validate();
        this.test('validator results', validatorResults.length, 4);

        // test dom field wrapper
        $('body').append($('<input id="testinput" value="5"/>'))
        var fieldWrapper = new validation.DomElementWrapper($('#testinput')[0]);

        this.test('DOM element wrapper 1', fieldWrapper.getValue(), '5');
        automaticValidationTriggered = false;
        var fieldChangeAutoValidation = new validation.Validation(fieldWrapper, new validation.type.GreaterThan(5,automaticCustomBehavior), {validationBasis: validation.ValidationBasis.AUTOMATIC});
        $('#testinput').change();
        this.test('DOM element change handler proxy triggers validation', automaticValidationTriggered, true);

        // test email validation
        var emailValidation = new validation.Validation(stringField, new validation.type.Email());
        stringField.setValue('someone@somewhere.com')
        this.test('email validation success', emailValidation.validate(), true);
        stringField.setValue('someone@error')
        this.test('email validation failure', emailValidation.validate(), false);

        var popupValidation = new validation.Validation(fieldWrapper, new validation.type.GreaterThan(5,new validation.behavior.PopUp()));
        popupValidation.validate();

        $('body').append($('<div style="position:absolute; left:100px; top:100px;"><input id="testinput2" value="5"/></div>'))
        var offsetFieldWrapper = new validation.DomElementWrapper($('#testinput2')[0]);
        var popupValidation2 = new validation.Validation(offsetFieldWrapper, new validation.type.GreaterThan(5,new validation.behavior.PopUp()));
        popupValidation2.validate();

        $('body').append($('<div style="position:absolute; left:100px; top:300px;"><input id="testinput3" value="5"/></div>'))
        var offsetFieldWrapper = new validation.DomElementWrapper($('#testinput3')[0]);
        var popupValidation3 = new validation.Validation(offsetFieldWrapper, new validation.type.GreaterThan(5,
            new validation.behavior.PopUp({position: validation.behavior.PopUp.BESIDE})),
            {validationBasis: validation.ValidationBasis.AUTOMATIC});
        popupValidation3.validate();

        $('body').append($('<div style="position:absolute; left:100px; top:200px;"><input id="testinput4" value="5"/></div>'))
        var highlightFieldWrapper = new validation.DomElementWrapper($('#testinput4')[0]);
        var highlightValidation4 = new validation.Validation(highlightFieldWrapper, new validation.type.GreaterThan(5,
            new validation.behavior.FieldHighlight()),
            {validationBasis: validation.ValidationBasis.AUTOMATIC});
        highlightValidation4.validate();
    },

    _testCustomValidation: function (val)
    {
        return val === 'custom';
    },

    test: function (desc, val1, val2)
    {
        if (val1 === val2)
        {
            console.log('[success] '+desc);
        }
        else
        {
            console.error('[fail] '+desc+' ::: expected '+val2+' but got '+val1);
        }
    }
}
);