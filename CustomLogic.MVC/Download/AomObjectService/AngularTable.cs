
<script>
    (function () {

        var app = angular.module("app", ["ngTable"]);

        // AomObject Service
        angular.module('app').factory('AomObjectApiService', AomObjectApiService);
        AomObjectApiService.$inject = ['$http'];
        function AomObjectApiService($http) {

            return {
                Get: get,
                Post: post,
                Put: put,
                Delete: deleteApi
            };

            function get(id) {
                return $http.get('/api/AomObject/' + id)
                   .then(getAomObjectComplete)
                   .catch(getAomObjectFail);

                function getAomObjectComplete(response) {
                    return response.data.Data;
                }

                function getAomObjectFail(error) {
                    debugger;
                }
            };

            function post(data) {
                return $http.post('/api/AomObject/', data)
                   .then(postAomObjectComplete)
                   .catch(postAomObjectFail);

                function postAomObjectComplete(response) {
                    return response.data;
                }

                function postAomObjectFail(error) {
                    debugger;
                }
            };

            function put(id, data) {
                return $http.put('/api/AomObject/' + id, data)
                   .then(putAomObjectComplete)
                   .catch(putAomObjectFail);

                function putAomObjectComplete(response) {
                    return response.data.Data;
                }

                function putAomObjectFail(error) {
                    debugger;
                }
            };

            function deleteApi(id) {
                return $http.delete('/api/AomObject/' + id)
                   .then(deleteAomObjectComplete)
                   .catch(deleteAomObjectFail);

                function deleteAomObjectComplete(response) {
                    return response.data.Data;
                }

                function deleteAomObjectFail(error) {
                    debugger;
                }
            };
        };
        // AomObject Service End

        // AomObject Table Controller
        angular.module('app').controller('AomObjectController', AomObjectController);
        AomObjectController.$inject = ["NgTableParams", "AomObjectApiService"];
        function AomObjectController(NgTableParams, AomObjectApiService) {
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
                    return AomObjectApiService.Post(postParams) 
                        .then(function (response) {
                            params.total(response.Count);
                            return response.Data;
                        });
                }
            });
        };
        // AomObject Table Controller End
    })();
</script>


<div ng-app="app">

 <div ng-controller="AomObjectController as AomObject">

        <h2 class="page-header">AomObject Table</h2>

        <table ng-table="AomObject.tableParams" class="table table-bordered table-striped table-condensed">
            <tr ng-repeat="row in $data track by row.Id">

 <td data-title="'ID'" 
 sortable="'ID'" 
filter="{ID: 'text'}" >
{{row.ID}}
</td>
 <td data-title="'AomMetaId'" 
 sortable="'AomMetaId'" 
filter="{AomMetaId: 'text'}" >
{{row.AomMetaId}}
</td>
 <td data-title="'Name'" 
 sortable="'Name'" 
filter="{Name: 'text'}" >
{{row.Name}}
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

