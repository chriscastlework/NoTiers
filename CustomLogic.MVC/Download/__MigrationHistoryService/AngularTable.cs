
<script>
    (function () {

        var app = angular.module("app", ["ngTable"]);

        // MigrationHistory Service
        angular.module('app').factory('MigrationHistoryApiService', MigrationHistoryApiService);
        MigrationHistoryApiService.$inject = ['$http'];
        function MigrationHistoryApiService($http) {

            return {
                Get: get,
                Post: post,
                Put: put,
                Delete: deleteApi
            };

            function get(id) {
                return $http.get('/api/MigrationHistory/' + id)
                   .then(getMigrationHistoryComplete)
                   .catch(getMigrationHistoryFail);

                function getMigrationHistoryComplete(response) {
                    return response.data.Data;
                }

                function getMigrationHistoryFail(error) {
                    debugger;
                }
            };

            function post(data) {
                return $http.post('/api/MigrationHistory/', data)
                   .then(postMigrationHistoryComplete)
                   .catch(postMigrationHistoryFail);

                function postMigrationHistoryComplete(response) {
                    return response.data;
                }

                function postMigrationHistoryFail(error) {
                    debugger;
                }
            };

            function put(id, data) {
                return $http.put('/api/MigrationHistory/' + id, data)
                   .then(putMigrationHistoryComplete)
                   .catch(putMigrationHistoryFail);

                function putMigrationHistoryComplete(response) {
                    return response.data.Data;
                }

                function putMigrationHistoryFail(error) {
                    debugger;
                }
            };

            function deleteApi(id) {
                return $http.delete('/api/MigrationHistory/' + id)
                   .then(deleteMigrationHistoryComplete)
                   .catch(deleteMigrationHistoryFail);

                function deleteMigrationHistoryComplete(response) {
                    return response.data.Data;
                }

                function deleteMigrationHistoryFail(error) {
                    debugger;
                }
            };
        };
        // MigrationHistory Service End

        // MigrationHistory Table Controller
        angular.module('app').controller('MigrationHistoryController', MigrationHistoryController);
        MigrationHistoryController.$inject = ["NgTableParams", "MigrationHistoryApiService"];
        function MigrationHistoryController(NgTableParams, MigrationHistoryApiService) {
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
                    return MigrationHistoryApiService.Post(postParams) 
                        .then(function (response) {
                            params.total(response.Count);
                            return response.Data;
                        });
                }
            });
        };
        // MigrationHistory Table Controller End
    })();
</script>


<div ng-app="app">

 <div ng-controller="MigrationHistoryController as MigrationHistory">

        <h2 class="page-header">MigrationHistory Table</h2>

        <table ng-table="MigrationHistory.tableParams" class="table table-bordered table-striped table-condensed">
            <tr ng-repeat="row in $data track by row.Id">

 <td data-title="'MigrationId'" 
 sortable="'MigrationId'" 
filter="{MigrationId: 'text'}" >
{{row.MigrationId}}
</td>
 <td data-title="'ContextKey'" 
 sortable="'ContextKey'" 
filter="{ContextKey: 'text'}" >
{{row.ContextKey}}
</td>
 <td data-title="'Model'" 
 sortable="'Model'" 
filter="{Model: 'text'}" >
{{row.Model}}
</td>
 <td data-title="'ProductVersion'" 
 sortable="'ProductVersion'" 
filter="{ProductVersion: 'text'}" >
{{row.ProductVersion}}
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

