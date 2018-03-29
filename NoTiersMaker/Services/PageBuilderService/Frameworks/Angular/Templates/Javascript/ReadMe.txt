Any controls that require their own javascript conrtoller need to have:
1. Template which is named the same as the type i.e TypeJs13 will be a Grid aka Table
2. Each template must have a loader which is a partial class with the same name 
3. Each Js template needs to inherit the IPageBuilderTemplate interface

Notes: TypeJsN partial aka TypeJsNLoader would normally have a Type13 model to use data in the template
	   To Implement other methods on the class copy another for class name etc
	   You can not currently sub class the partial class as it already inheirts you need to repeat the code 
 