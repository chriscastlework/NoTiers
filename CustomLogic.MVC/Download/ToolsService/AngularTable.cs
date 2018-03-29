
<script>
    (function () {

        var app = angular.module("app", ["ngTable"]);

        // Tool Service
        angular.module('app').factory('ToolApiService', ToolApiService);
        ToolApiService.$inject = ['$http'];
        function ToolApiService($http) {

            return {
                Get: get,
                Post: post,
                Put: put,
                Delete: deleteApi
            };

            function get(id) {
                return $http.get('/api/Tool/' + id)
                   .then(getToolComplete)
                   .catch(getToolFail);

                function getToolComplete(response) {
                    return response.data.Data;
                }

                function getToolFail(error) {
                    debugger;
                }
            };

            function post(data) {
                return $http.post('/api/Tool/', data)
                   .then(postToolComplete)
                   .catch(postToolFail);

                function postToolComplete(response) {
                    return response.data;
                }

                function postToolFail(error) {
                    debugger;
                }
            };

            function put(id, data) {
                return $http.put('/api/Tool/' + id, data)
                   .then(putToolComplete)
                   .catch(putToolFail);

                function putToolComplete(response) {
                    return response.data.Data;
                }

                function putToolFail(error) {
                    debugger;
                }
            };

            function deleteApi(id) {
                return $http.delete('/api/Tool/' + id)
                   .then(deleteToolComplete)
                   .catch(deleteToolFail);

                function deleteToolComplete(response) {
                    return response.data.Data;
                }

                function deleteToolFail(error) {
                    debugger;
                }
            };
        };
        // Tool Service End

        // Tool Table Controller
        angular.module('app').controller('ToolController', ToolController);
        ToolController.$inject = ["NgTableParams", "ToolApiService"];
        function ToolController(NgTableParams, ToolApiService) {
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
                    return ToolApiService.Post(postParams) 
                        .then(function (response) {
                            params.total(response.Count);
                            return response.Data;
                        });
                }
            });
        };
        // Tool Table Controller End
    })();
</script>


<div ng-app="app">

 <div ng-controller="ToolController as Tools">

        <h2 class="page-header">Tool Table</h2>

        <table ng-table="Tools.tableParams" class="table table-bordered table-striped table-condensed">
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

