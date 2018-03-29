
<script>
    (function () {

        var app = angular.module("app", ["ngTable"]);

        // FieldType Service
        angular.module('app').factory('FieldTypeApiService', FieldTypeApiService);
        FieldTypeApiService.$inject = ['$http'];
        function FieldTypeApiService($http) {

            return {
                Get: get,
                Post: post,
                Put: put,
                Delete: deleteApi
            };

            function get(id) {
                return $http.get('/api/FieldType/' + id)
                   .then(getFieldTypeComplete)
                   .catch(getFieldTypeFail);

                function getFieldTypeComplete(response) {
                    return response.data.Data;
                }

                function getFieldTypeFail(error) {
                    debugger;
                }
            };

            function post(data) {
                return $http.post('/api/FieldType/', data)
                   .then(postFieldTypeComplete)
                   .catch(postFieldTypeFail);

                function postFieldTypeComplete(response) {
                    return response.data;
                }

                function postFieldTypeFail(error) {
                    debugger;
                }
            };

            function put(id, data) {
                return $http.put('/api/FieldType/' + id, data)
                   .then(putFieldTypeComplete)
                   .catch(putFieldTypeFail);

                function putFieldTypeComplete(response) {
                    return response.data.Data;
                }

                function putFieldTypeFail(error) {
                    debugger;
                }
            };

            function deleteApi(id) {
                return $http.delete('/api/FieldType/' + id)
                   .then(deleteFieldTypeComplete)
                   .catch(deleteFieldTypeFail);

                function deleteFieldTypeComplete(response) {
                    return response.data.Data;
                }

                function deleteFieldTypeFail(error) {
                    debugger;
                }
            };
        };
        // FieldType Service End

        // FieldType Table Controller
        angular.module('app').controller('FieldTypeController', FieldTypeController);
        FieldTypeController.$inject = ["NgTableParams", "FieldTypeApiService"];
        function FieldTypeController(NgTableParams, FieldTypeApiService) {
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
                    return FieldTypeApiService.Post(postParams) 
                        .then(function (response) {
                            params.total(response.Count);
                            return response.Data;
                        });
                }
            });
        };
        // FieldType Table Controller End
    })();
</script>


<div ng-app="app">

 <div ng-controller="FieldTypeController as FieldTypes">

        <h2 class="page-header">FieldType Table</h2>

        <table ng-table="FieldTypes.tableParams" class="table table-bordered table-striped table-condensed">
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

