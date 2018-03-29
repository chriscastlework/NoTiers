
<script>
    (function () {

        var app = angular.module("app", ["ngTable"]);

        // RelationshipMeta Service
        angular.module('app').factory('RelationshipMetaApiService', RelationshipMetaApiService);
        RelationshipMetaApiService.$inject = ['$http'];
        function RelationshipMetaApiService($http) {

            return {
                Get: get,
                Post: post,
                Put: put,
                Delete: deleteApi
            };

            function get(id) {
                return $http.get('/api/RelationshipMeta/' + id)
                   .then(getRelationshipMetaComplete)
                   .catch(getRelationshipMetaFail);

                function getRelationshipMetaComplete(response) {
                    return response.data.Data;
                }

                function getRelationshipMetaFail(error) {
                    debugger;
                }
            };

            function post(data) {
                return $http.post('/api/RelationshipMeta/', data)
                   .then(postRelationshipMetaComplete)
                   .catch(postRelationshipMetaFail);

                function postRelationshipMetaComplete(response) {
                    return response.data;
                }

                function postRelationshipMetaFail(error) {
                    debugger;
                }
            };

            function put(id, data) {
                return $http.put('/api/RelationshipMeta/' + id, data)
                   .then(putRelationshipMetaComplete)
                   .catch(putRelationshipMetaFail);

                function putRelationshipMetaComplete(response) {
                    return response.data.Data;
                }

                function putRelationshipMetaFail(error) {
                    debugger;
                }
            };

            function deleteApi(id) {
                return $http.delete('/api/RelationshipMeta/' + id)
                   .then(deleteRelationshipMetaComplete)
                   .catch(deleteRelationshipMetaFail);

                function deleteRelationshipMetaComplete(response) {
                    return response.data.Data;
                }

                function deleteRelationshipMetaFail(error) {
                    debugger;
                }
            };
        };
        // RelationshipMeta Service End

        // RelationshipMeta Table Controller
        angular.module('app').controller('RelationshipMetaController', RelationshipMetaController);
        RelationshipMetaController.$inject = ["NgTableParams", "RelationshipMetaApiService"];
        function RelationshipMetaController(NgTableParams, RelationshipMetaApiService) {
            var vm = this;
            vm.tableParams = new NgTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                getData: function (params) {
                    var postParams = {};
                    postParams.page = params.page();
                    postParams.count = params.count();
                    postParams.total = params.total();
                    postParams.filter = params.filter();
                    postParams.sorting = params.sorting();
                    postParams.group = params.group();
                    return RelationshipMetaApiService.Post(postParams) 
                        .then(function (response) {
                            params.total(response.Count);
                            return response.Data;
                        });
                }
            });
        };
        // RelationshipMeta Table Controller End
    })();
</script>


<div ng-app="app">

 <div ng-controller="RelationshipMetaController as RelationshipMeta">

        <h2 class="page-header">RelationshipMeta Table</h2>

        <table ng-table="RelationshipMeta.tableParams" class="table table-bordered table-striped table-condensed">
            <tr ng-repeat="row in $data track by row.Id">

 <td data-title="'ID'" 
 sortable="'ID'" 
filter="{ID: 'text'}" >
{{row.ID}}
</td>
 <td data-title="'PkAomMetaId'" 
 sortable="'PkAomMetaId'" 
filter="{PkAomMetaId: 'text'}" >
{{row.PkAomMetaId}}
</td>
 <td data-title="'FkAomMetaId'" 
 sortable="'FkAomMetaId'" 
filter="{FkAomMetaId: 'text'}" >
{{row.FkAomMetaId}}
</td>
 <td data-title="'FkAomFieldMetaId'" 
 sortable="'FkAomFieldMetaId'" 
filter="{FkAomFieldMetaId: 'text'}" >
{{row.FkAomFieldMetaId}}
</td>
 <td data-title="'Name'" 
 sortable="'Name'" 
filter="{Name: 'text'}" >
{{row.Name}}
</td>
 <td data-title="'PkAomFieldMetaId'" 
 sortable="'PkAomFieldMetaId'" 
filter="{PkAomFieldMetaId: 'text'}" >
{{row.PkAomFieldMetaId}}
</td>
            </tr>
        </table>
    </div>
 </div>



<!-- Trigger the modal with a button -->
<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">Open Modal</button>

<!-- Modal -->
<div id="myModal" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Modal Header</h4>
      </div>
      <div class="modal-body">
        <p>Some text in the modal.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>

  </div>
</div>

