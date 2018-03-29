
<script>
    (function () {

        var app = angular.module("app", ["ngTable"]);

        // Alert Service
        angular.module('app').factory('AlertApiService', AlertApiService);
        AlertApiService.$inject = ['$http'];
        function AlertApiService($http) {

            return {
                Get: get,
                Post: post,
                Put: put,
                Delete: deleteApi
            };

            function get(id) {
                return $http.get('/api/Alert/' + id)
                   .then(getAlertComplete)
                   .catch(getAlertFail);

                function getAlertComplete(response) {
                    return response.data.Data;
                }

                function getAlertFail(error) {
                    debugger;
                }
            };

            function post(data) {
                return $http.post('/api/Alert/', data)
                   .then(postAlertComplete)
                   .catch(postAlertFail);

                function postAlertComplete(response) {
                    return response.data;
                }

                function postAlertFail(error) {
                    debugger;
                }
            };

            function put(id, data) {
                return $http.put('/api/Alert/' + id, data)
                   .then(putAlertComplete)
                   .catch(putAlertFail);

                function putAlertComplete(response) {
                    return response.data.Data;
                }

                function putAlertFail(error) {
                    debugger;
                }
            };

            function deleteApi(id) {
                return $http.delete('/api/Alert/' + id)
                   .then(deleteAlertComplete)
                   .catch(deleteAlertFail);

                function deleteAlertComplete(response) {
                    return response.data.Data;
                }

                function deleteAlertFail(error) {
                    debugger;
                }
            };
        };
        // Alert Service End

        // Alert Table Controller
        angular.module('app').controller('AlertController', AlertController);
        AlertController.$inject = ["NgTableParams", "AlertApiService"];
        function AlertController(NgTableParams, AlertApiService) {
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
                    return AlertApiService.Post(postParams) 
                        .then(function (response) {
                            params.total(response.Count);
                            return response.Data;
                        });
                }
            });
        };
        // Alert Table Controller End
    })();
</script>


<div ng-app="app">

 <div ng-controller="AlertController as Alerts">

        <h2 class="page-header">Alert Table</h2>

        <table ng-table="Alerts.tableParams" class="table table-bordered table-striped table-condensed">
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

