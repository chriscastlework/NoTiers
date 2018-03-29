
<script>
    (function () {

        var app = angular.module("app", ["ngTable"]);

        // ContainerAlert Service
        angular.module('app').factory('ContainerAlertApiService', ContainerAlertApiService);
        ContainerAlertApiService.$inject = ['$http'];
        function ContainerAlertApiService($http) {

            return {
                Get: get,
                Post: post,
                Put: put,
                Delete: deleteApi
            };

            function get(id) {
                return $http.get('/api/ContainerAlert/' + id)
                   .then(getContainerAlertComplete)
                   .catch(getContainerAlertFail);

                function getContainerAlertComplete(response) {
                    return response.data.Data;
                }

                function getContainerAlertFail(error) {
                    debugger;
                }
            };

            function post(data) {
                return $http.post('/api/ContainerAlert/', data)
                   .then(postContainerAlertComplete)
                   .catch(postContainerAlertFail);

                function postContainerAlertComplete(response) {
                    return response.data;
                }

                function postContainerAlertFail(error) {
                    debugger;
                }
            };

            function put(id, data) {
                return $http.put('/api/ContainerAlert/' + id, data)
                   .then(putContainerAlertComplete)
                   .catch(putContainerAlertFail);

                function putContainerAlertComplete(response) {
                    return response.data.Data;
                }

                function putContainerAlertFail(error) {
                    debugger;
                }
            };

            function deleteApi(id) {
                return $http.delete('/api/ContainerAlert/' + id)
                   .then(deleteContainerAlertComplete)
                   .catch(deleteContainerAlertFail);

                function deleteContainerAlertComplete(response) {
                    return response.data.Data;
                }

                function deleteContainerAlertFail(error) {
                    debugger;
                }
            };
        };
        // ContainerAlert Service End

        // ContainerAlert Table Controller
        angular.module('app').controller('ContainerAlertController', ContainerAlertController);
        ContainerAlertController.$inject = ["NgTableParams", "ContainerAlertApiService"];
        function ContainerAlertController(NgTableParams, ContainerAlertApiService) {
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
                    return ContainerAlertApiService.Post(postParams) 
                        .then(function (response) {
                            params.total(response.Count);
                            return response.Data;
                        });
                }
            });
        };
        // ContainerAlert Table Controller End
    })();
</script>


<div ng-app="app">

 <div ng-controller="ContainerAlertController as ContainerAlerts">

        <h2 class="page-header">ContainerAlert Table</h2>

        <table ng-table="ContainerAlerts.tableParams" class="table table-bordered table-striped table-condensed">
            <tr ng-repeat="row in $data track by row.Id">

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

