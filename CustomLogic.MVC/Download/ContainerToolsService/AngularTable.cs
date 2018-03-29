
<script>
    (function () {

        var app = angular.module("app", ["ngTable"]);

        // ContainerTool Service
        angular.module('app').factory('ContainerToolApiService', ContainerToolApiService);
        ContainerToolApiService.$inject = ['$http'];
        function ContainerToolApiService($http) {

            return {
                Get: get,
                Post: post,
                Put: put,
                Delete: deleteApi
            };

            function get(id) {
                return $http.get('/api/ContainerTool/' + id)
                   .then(getContainerToolComplete)
                   .catch(getContainerToolFail);

                function getContainerToolComplete(response) {
                    return response.data.Data;
                }

                function getContainerToolFail(error) {
                    debugger;
                }
            };

            function post(data) {
                return $http.post('/api/ContainerTool/', data)
                   .then(postContainerToolComplete)
                   .catch(postContainerToolFail);

                function postContainerToolComplete(response) {
                    return response.data;
                }

                function postContainerToolFail(error) {
                    debugger;
                }
            };

            function put(id, data) {
                return $http.put('/api/ContainerTool/' + id, data)
                   .then(putContainerToolComplete)
                   .catch(putContainerToolFail);

                function putContainerToolComplete(response) {
                    return response.data.Data;
                }

                function putContainerToolFail(error) {
                    debugger;
                }
            };

            function deleteApi(id) {
                return $http.delete('/api/ContainerTool/' + id)
                   .then(deleteContainerToolComplete)
                   .catch(deleteContainerToolFail);

                function deleteContainerToolComplete(response) {
                    return response.data.Data;
                }

                function deleteContainerToolFail(error) {
                    debugger;
                }
            };
        };
        // ContainerTool Service End

        // ContainerTool Table Controller
        angular.module('app').controller('ContainerToolController', ContainerToolController);
        ContainerToolController.$inject = ["NgTableParams", "ContainerToolApiService"];
        function ContainerToolController(NgTableParams, ContainerToolApiService) {
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
                    return ContainerToolApiService.Post(postParams) 
                        .then(function (response) {
                            params.total(response.Count);
                            return response.Data;
                        });
                }
            });
        };
        // ContainerTool Table Controller End
    })();
</script>


<div ng-app="app">

 <div ng-controller="ContainerToolController as ContainerTools">

        <h2 class="page-header">ContainerTool Table</h2>

        <table ng-table="ContainerTools.tableParams" class="table table-bordered table-striped table-condensed">
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

