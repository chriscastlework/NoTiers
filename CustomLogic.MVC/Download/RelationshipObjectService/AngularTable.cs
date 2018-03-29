
<script>
    (function () {

        var app = angular.module("app", ["ngTable"]);

        // RelationshipObject Service
        angular.module('app').factory('RelationshipObjectApiService', RelationshipObjectApiService);
        RelationshipObjectApiService.$inject = ['$http'];
        function RelationshipObjectApiService($http) {

            return {
                Get: get,
                Post: post,
                Put: put,
                Delete: deleteApi
            };

            function get(id) {
                return $http.get('/api/RelationshipObject/' + id)
                   .then(getRelationshipObjectComplete)
                   .catch(getRelationshipObjectFail);

                function getRelationshipObjectComplete(response) {
                    return response.data.Data;
                }

                function getRelationshipObjectFail(error) {
                    debugger;
                }
            };

            function post(data) {
                return $http.post('/api/RelationshipObject/', data)
                   .then(postRelationshipObjectComplete)
                   .catch(postRelationshipObjectFail);

                function postRelationshipObjectComplete(response) {
                    return response.data;
                }

                function postRelationshipObjectFail(error) {
                    debugger;
                }
            };

            function put(id, data) {
                return $http.put('/api/RelationshipObject/' + id, data)
                   .then(putRelationshipObjectComplete)
                   .catch(putRelationshipObjectFail);

                function putRelationshipObjectComplete(response) {
                    return response.data.Data;
                }

                function putRelationshipObjectFail(error) {
                    debugger;
                }
            };

            function deleteApi(id) {
                return $http.delete('/api/RelationshipObject/' + id)
                   .then(deleteRelationshipObjectComplete)
                   .catch(deleteRelationshipObjectFail);

                function deleteRelationshipObjectComplete(response) {
                    return response.data.Data;
                }

                function deleteRelationshipObjectFail(error) {
                    debugger;
                }
            };
        };
        // RelationshipObject Service End

        // RelationshipObject Table Controller
        angular.module('app').controller('RelationshipObjectController', RelationshipObjectController);
        RelationshipObjectController.$inject = ["NgTableParams", "RelationshipObjectApiService"];
        function RelationshipObjectController(NgTableParams, RelationshipObjectApiService) {
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
                    return RelationshipObjectApiService.Post(postParams) 
                        .then(function (response) {
                            params.total(response.Count);
                            return response.Data;
                        });
                }
            });
        };
        // RelationshipObject Table Controller End
    })();
</script>


<div ng-app="app">

 <div ng-controller="RelationshipObjectController as RelationshipObject">

        <h2 class="page-header">RelationshipObject Table</h2>

        <table ng-table="RelationshipObject.tableParams" class="table table-bordered table-striped table-condensed">
            <tr ng-repeat="row in $data track by row.Id">

 <td data-title="'ID'" 
 sortable="'ID'" 
filter="{ID: 'text'}" >
{{row.ID}}
</td>
 <td data-title="'RelationshipMetaId'" 
 sortable="'RelationshipMetaId'" 
filter="{RelationshipMetaId: 'text'}" >
{{row.RelationshipMetaId}}
</td>
 <td data-title="'PkAomFieldObjectId'" 
 sortable="'PkAomFieldObjectId'" 
filter="{PkAomFieldObjectId: 'text'}" >
{{row.PkAomFieldObjectId}}
</td>
 <td data-title="'FkAomFieldObjectId'" 
 sortable="'FkAomFieldObjectId'" 
filter="{FkAomFieldObjectId: 'text'}" >
{{row.FkAomFieldObjectId}}
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

