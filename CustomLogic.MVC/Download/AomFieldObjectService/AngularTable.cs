
<script>
    (function () {

        var app = angular.module("app", ["ngTable"]);

        // AomFieldObject Service
        angular.module('app').factory('AomFieldObjectApiService', AomFieldObjectApiService);
        AomFieldObjectApiService.$inject = ['$http'];
        function AomFieldObjectApiService($http) {

            return {
                Get: get,
                Post: post,
                Put: put,
                Delete: deleteApi
            };

            function get(id) {
                return $http.get('/api/AomFieldObject/' + id)
                   .then(getAomFieldObjectComplete)
                   .catch(getAomFieldObjectFail);

                function getAomFieldObjectComplete(response) {
                    return response.data.Data;
                }

                function getAomFieldObjectFail(error) {
                    debugger;
                }
            };

            function post(data) {
                return $http.post('/api/AomFieldObject/', data)
                   .then(postAomFieldObjectComplete)
                   .catch(postAomFieldObjectFail);

                function postAomFieldObjectComplete(response) {
                    return response.data;
                }

                function postAomFieldObjectFail(error) {
                    debugger;
                }
            };

            function put(id, data) {
                return $http.put('/api/AomFieldObject/' + id, data)
                   .then(putAomFieldObjectComplete)
                   .catch(putAomFieldObjectFail);

                function putAomFieldObjectComplete(response) {
                    return response.data.Data;
                }

                function putAomFieldObjectFail(error) {
                    debugger;
                }
            };

            function deleteApi(id) {
                return $http.delete('/api/AomFieldObject/' + id)
                   .then(deleteAomFieldObjectComplete)
                   .catch(deleteAomFieldObjectFail);

                function deleteAomFieldObjectComplete(response) {
                    return response.data.Data;
                }

                function deleteAomFieldObjectFail(error) {
                    debugger;
                }
            };
        };
        // AomFieldObject Service End

        // AomFieldObject Table Controller
        angular.module('app').controller('AomFieldObjectController', AomFieldObjectController);
        AomFieldObjectController.$inject = ["NgTableParams", "AomFieldObjectApiService"];
        function AomFieldObjectController(NgTableParams, AomFieldObjectApiService) {
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
                    return AomFieldObjectApiService.Post(postParams) 
                        .then(function (response) {
                            params.total(response.Count);
                            return response.Data;
                        });
                }
            });
        };
        // AomFieldObject Table Controller End
    })();
</script>


<div ng-app="app">

 <div ng-controller="AomFieldObjectController as AomFieldObject">

        <h2 class="page-header">AomFieldObject Table</h2>

        <table ng-table="AomFieldObject.tableParams" class="table table-bordered table-striped table-condensed">
            <tr ng-repeat="row in $data track by row.Id">

 <td data-title="'ID'" 
 sortable="'ID'" 
filter="{ID: 'text'}" >
{{row.ID}}
</td>
 <td data-title="'AomObjectId'" 
 sortable="'AomObjectId'" 
filter="{AomObjectId: 'text'}" >
{{row.AomObjectId}}
</td>
 <td data-title="'AomFieldMetaId'" 
 sortable="'AomFieldMetaId'" 
filter="{AomFieldMetaId: 'text'}" >
{{row.AomFieldMetaId}}
</td>
 <td data-title="'Value'" 
 sortable="'Value'" 
filter="{Value: 'text'}" >
{{row.Value}}
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

