
<script>
    (function () {

        var app = angular.module("app", ["ngTable"]);

        // AomMeta Service
        angular.module('app').factory('AomMetaApiService', AomMetaApiService);
        AomMetaApiService.$inject = ['$http'];
        function AomMetaApiService($http) {

            return {
                Get: get,
                Post: post,
                Put: put,
                Delete: deleteApi
            };

            function get(id) {
                return $http.get('/api/AomMeta/' + id)
                   .then(getAomMetaComplete)
                   .catch(getAomMetaFail);

                function getAomMetaComplete(response) {
                    return response.data.Data;
                }

                function getAomMetaFail(error) {
                    debugger;
                }
            };

            function post(data) {
                return $http.post('/api/AomMeta/', data)
                   .then(postAomMetaComplete)
                   .catch(postAomMetaFail);

                function postAomMetaComplete(response) {
                    return response.data;
                }

                function postAomMetaFail(error) {
                    debugger;
                }
            };

            function put(id, data) {
                return $http.put('/api/AomMeta/' + id, data)
                   .then(putAomMetaComplete)
                   .catch(putAomMetaFail);

                function putAomMetaComplete(response) {
                    return response.data.Data;
                }

                function putAomMetaFail(error) {
                    debugger;
                }
            };

            function deleteApi(id) {
                return $http.delete('/api/AomMeta/' + id)
                   .then(deleteAomMetaComplete)
                   .catch(deleteAomMetaFail);

                function deleteAomMetaComplete(response) {
                    return response.data.Data;
                }

                function deleteAomMetaFail(error) {
                    debugger;
                }
            };
        };
        // AomMeta Service End

        // AomMeta Table Controller
        angular.module('app').controller('AomMetaController', AomMetaController);
        AomMetaController.$inject = ["NgTableParams", "AomMetaApiService"];
        function AomMetaController(NgTableParams, AomMetaApiService) {
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
                    return AomMetaApiService.Post(postParams) 
                        .then(function (response) {
                            params.total(response.Count);
                            return response.Data;
                        });
                }
            });
        };
        // AomMeta Table Controller End
    })();
</script>


<div ng-app="app">

 <div ng-controller="AomMetaController as AomMeta">

        <h2 class="page-header">AomMeta Table</h2>

        <table ng-table="AomMeta.tableParams" class="table table-bordered table-striped table-condensed">
            <tr ng-repeat="row in $data track by row.Id">

 <td data-title="'ID'" 
 sortable="'ID'" 
filter="{ID: 'text'}" >
{{row.ID}}
</td>
 <td data-title="'Name'" 
 sortable="'Name'" 
filter="{Name: 'text'}" >
{{row.Name}}
</td>
 <td data-title="'Display'" 
 sortable="'Display'" 
filter="{Display: 'text'}" >
{{row.Display}}
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

