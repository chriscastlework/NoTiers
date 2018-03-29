
<script>
    (function () {

        var app = angular.module("app", ["ngTable"]);

        // AomFieldMeta Service
        angular.module('app').factory('AomFieldMetaApiService', AomFieldMetaApiService);
        AomFieldMetaApiService.$inject = ['$http'];
        function AomFieldMetaApiService($http) {

            return {
                Get: get,
                Post: post,
                Put: put,
                Delete: deleteApi
            };

            function get(id) {
                return $http.get('/api/AomFieldMeta/' + id)
                   .then(getAomFieldMetaComplete)
                   .catch(getAomFieldMetaFail);

                function getAomFieldMetaComplete(response) {
                    return response.data.Data;
                }

                function getAomFieldMetaFail(error) {
                    debugger;
                }
            };

            function post(data) {
                return $http.post('/api/AomFieldMeta/', data)
                   .then(postAomFieldMetaComplete)
                   .catch(postAomFieldMetaFail);

                function postAomFieldMetaComplete(response) {
                    return response.data;
                }

                function postAomFieldMetaFail(error) {
                    debugger;
                }
            };

            function put(id, data) {
                return $http.put('/api/AomFieldMeta/' + id, data)
                   .then(putAomFieldMetaComplete)
                   .catch(putAomFieldMetaFail);

                function putAomFieldMetaComplete(response) {
                    return response.data.Data;
                }

                function putAomFieldMetaFail(error) {
                    debugger;
                }
            };

            function deleteApi(id) {
                return $http.delete('/api/AomFieldMeta/' + id)
                   .then(deleteAomFieldMetaComplete)
                   .catch(deleteAomFieldMetaFail);

                function deleteAomFieldMetaComplete(response) {
                    return response.data.Data;
                }

                function deleteAomFieldMetaFail(error) {
                    debugger;
                }
            };
        };
        // AomFieldMeta Service End

        // AomFieldMeta Table Controller
        angular.module('app').controller('AomFieldMetaController', AomFieldMetaController);
        AomFieldMetaController.$inject = ["NgTableParams", "AomFieldMetaApiService"];
        function AomFieldMetaController(NgTableParams, AomFieldMetaApiService) {
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
                    return AomFieldMetaApiService.Post(postParams) 
                        .then(function (response) {
                            params.total(response.Count);
                            return response.Data;
                        });
                }
            });
        };
        // AomFieldMeta Table Controller End
    })();
</script>


<div ng-app="app">

 <div ng-controller="AomFieldMetaController as AomFieldMeta">

        <h2 class="page-header">AomFieldMeta Table</h2>

        <table ng-table="AomFieldMeta.tableParams" class="table table-bordered table-striped table-condensed">
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
 <td data-title="'FieldTypeId'" 
 sortable="'FieldTypeId'" 
filter="{FieldTypeId: 'text'}" >
{{row.FieldTypeId}}
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

