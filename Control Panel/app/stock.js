biziApp.controller('stockController', function ($scope) {


    var begin, end;

    $scope.filteredTodos = [],
        $scope.currentPage = 1,
        $scope.numPerPage = 10,
        $scope.maxSize = 5,
        $scope.itemNumber = 0;


    // Item List From database
    $scope.db_data = [];

    $scope.grid_refresh = function () {
        $.ajax({
            url: base_url+"Inventory_load/get_stock_grid",
            type: "POST",
            dataType: 'json',
            //data: {"modelID": modelID},
            success: function (response) {
                var res_data;
                if(typeof response['data'] !== 'undefined'){
                    res_data=response['data'];
                }else res_data=0;

                //console.log(response);
                $scope.$apply(function () //to reset dropdown
                {

                    oTable.fnClearTable();

                    for (var i = 0; i < res_data.length; i++) {
                        oTable.fnAddData([
                            i + 1,
                            res_data[i][1],
                            res_data[i][2],
                            res_data[i][3],
                            //'serial no',
                            //response[i]['model_cost_price'],
                            res_data[i][4],
                            res_data[i][5]
                            //response[i]['supplier_name'],

                        ],false);

                    }
                    oTable.fnDraw();

                    $scope.load_complete = true;


                });
                //console.log($scope.db_data);
            }

        });

    };

    $scope.grid_refresh();
    $scope.load_complete = true;


   // $(window).trigger('resize');
});
