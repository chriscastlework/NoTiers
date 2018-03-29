sp.namespace("pb.graphics.LoadedTemplate");

pb.graphics.TemplateLoader = sp.core.graphics.Graphic.extend
({
    __constructor:function(templateUrl)
    {
        this.__super();
        this._isLoaded = false;
        var __this = this;

        if(templateUrl) this._jqGraphic().load(templateUrl,function(){__this.onLoad()});
    },
    toString:function()
    {
        return "[TemplateLoader, this._jqGraphic:" + this._jqGraphic() + "]";
    },
    isLoaded:function()
    {
        return this._isLoaded;
    },
    find:function(selector)
    {
        return this._jqGraphic().find(selector);
    },
    onLoad:function()
    {
        /* NOT NEEDED YET, BUT IF THERE IS A REQUIREMENT TO USE ANGULAR IN LOADED TEMPLATES...
        var $div = this._jqGraphic();
        var $target = angular.element("[ng-app]");
        angular.element($target).injector().invoke(function($compile) {
            var $scope = angular.element($target).scope();
            $compile($div)($scope);
            $scope.$apply();
        });
        */
        this._isLoaded = true;
        var event = new pb.graphics.TemplateLoaderEvent(this,pb.graphics.TemplateLoaderEvent.LOAD);
        this.dispatchEvent(event);
    }
})
pb.graphics.TemplateLoaderEvent = sp.core.events.Event.extend({});
pb.graphics.TemplateLoaderEvent.LOAD = "pb_template_loader_event_load";
