using System.Collections.Generic;

// Dont change this calls it was automatically generated an has been tested to deserialise all objects in database
namespace CustomLogic.Services.PageBuilderService.PageBuilderDefinitionClasses
{
    public class Visibility
    {
        public string type { get; set; }
        public string id { get; set; }
        public int mappedEntityId { get; set; }
        public object mappingContextId { get; set; }
    }


    public class Hyperlink
    {
        public string type { get; set; }
        public string id { get; set; }
        public string mappedEntityId { get; set; }
        public string mappingContextId { get; set; }
        public string url { get; set; }
    }

    public class LayoutDirection
    {
        public string type { get; set; }
        public string id { get; set; }
        public string direction { get; set; }
    }

    public class BackgroundColor
    {
        public string type { get; set; }
        public string id { get; set; }
        public string mappedEntityId { get; set; }
        public object mappingContextId { get; set; }
    }

    public class BorderColor
    {
        public string type { get; set; }
        public string id { get; set; }
        public string mappedEntityId { get; set; }
        public object mappingContextId { get; set; }
    }

   

    public class Page
    {
        public int type { get; set; }
        public string id { get; set; }
        public string mappedEntityId { get; set; }
        public string mappingContextId { get; set; }
        public string name { get; set; }
        public Visibility visibility { get; set; }
        public List<object> elements { get; set; }
    }

    public class Value
    {
        public object id { get; set; }
        public string name { get; set; }
        public int fieldType { get; set; }
        public int objectType { get; set; }
        public bool removeable { get; set; }
        public int valueType { get; set; }
        public object value { get; set; }
    }

    public class Operation
    {
        public string id { get; set; }
        public string operandId { get; set; }
        public string @operator { get; set; }
    }

    public class Derived
    {
        public string id { get; set; }
        public string name { get; set; }
        public int fieldType { get; set; }
        public int objectType { get; set; }
        public bool removeable { get; set; }
        public string sourceFieldId { get; set; }
        public List<Operation> operations { get; set; }
    }

    public class PageBuilderExpression
    {
        public string id { get; set; }
        public int fieldType { get; set; }
        public int objectType { get; set; }
        public bool removeable { get; set; }
        public string logicType { get; set; }
        public object returnValueId { get; set; }
        public List<object> conditions { get; set; }
    }

    public class Conditional
    {
        public string id { get; set; }
        public string name { get; set; }
        public int fieldType { get; set; }
        public int objectType { get; set; }
        public bool removeable { get; set; }
        public List<PageBuilderExpression> expressions { get; set; }
    }

    public class UserFields
    {
        public List<Value> values { get; set; }
        public List<Derived> derived { get; set; }
        public List<Conditional> conditional { get; set; }
    }

    public class PageDefiniton
    {
        public Page page { get; set; }
        public UserFields userFields { get; set; }
    }
}