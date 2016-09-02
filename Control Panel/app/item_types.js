biziApp.controller('item_typesController', function ($scope) {
    // create a message to display in our view
    //$(window).trigger('resize');

    var save_data = [];
    var load_data = [];
    var e = document.getElementById("dropdown_category");


    var begin, end;

    $scope.filteredTodos = [],
        $scope.currentPage = 1,
        $scope.numPerPage = 10,
        $scope.maxSize = 5,
        $scope.itemNumber = 0;

    $scope.data_set = {form_data: [], selected: {}};
    $scope.delete_data = {delete_data: [], selected: {}};


    $scope.data_measurement = {
        measurement: [
        ],
        select_measurement: {} //This sets the default value of the select in the uiID: '', name: 'Option C'
    };

    $scope.add_to_grid = function () {
        //Change this array according to the page
        if (typeof ($scope.array_search($scope.data_set.form_data, 'item_type', $scope.item_type)) != 'undefined') {
            alert("This category is  Already in Grid");
        }
else
        {
            $.ajax({
                url: base_url + "inventory_load/search_duplicates",
                type: "POST",
                dataType: 'json',
                data: {
                    "col": '	item_type_id',
                    "table": 'nsinx_item_type',
                    "search_col": 'item_type_name',
                    "search_data": $scope.item_type
                },
                success: function (response) {
                    console.log(response);
                    if (response['status'] == 0) {
                        $scope.$apply(function () //to reset dropdown
                        {
                            $scope.data_set.form_data.push({
                                id: $scope.itemNumber++,
                                item_type: $scope.item_type,
                                item_description: $scope.item_description,
                                fields: $scope.fields

                            });
                            console.log($scope.data_set);

                            $scope.paging();
                            $scope.currentPage = Math.ceil($scope.data_set.form_data.length / $scope.numPerPage);
                            $scope.fields = [];
                            $scope.clear_form();
                            $scope.show_fields = false;
                        });
                    } else {
                        alert("already add this category ");
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(xhr.responseText);

                    alert(thrownError + " Save Failed");


                }
            });

        }

    };


    $scope.$watch('currentPage + numPerPage', function () {
        $scope.paging();
        $scope.indexStartNo = begin;
        save_data = $scope.data_set;
    });

    $scope.removeItem = function (index) {

        if (confirm("Delete This Item?") == true) {
            $scope.data_set.form_data.splice(index + $scope.indexStartNo, 1);
            $scope.paging();
        } else {

        }
    };

    //clear save Data Grid (clear button function)
    $scope.clearItems = function (index) {

        if (confirm("Clear Current Data Set?") == true) {
            $scope.data_set.form_data = [];
            $scope.paging();
        } else {

        }
    };


    // gets the template to ng-include for a table row / item
    $scope.getTemplate = function (index) {
        if (index.id === $scope.data_set.selected.id)
            return 'edit';
        else
            return 'display';
    };

    $scope.editItem = function (index) {
        $scope.data_set.selected = angular.copy(index);
        document.getElementById("save_data_grid").disabled = true;
    };

    $scope.saveItem = function (index) {
        console.log("Saving contact");
        $scope.data_set.form_data[index + $scope.indexStartNo] = angular.copy($scope.data_set.selected);
        $scope.reset();

        $scope.paging();

    };

    $scope.reset = function () {
        $scope.data_set.selected = {};
        document.getElementById("save_data_grid").disabled = false;
    };

    $scope.paging = function () {
        begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
        $scope.grid_show = $scope.data_set.form_data.slice(begin, end);

    };

    //Disable Reload if data is present
    window.onbeforeunload = function () {
        if ($scope.data_set.form_data.length > 0) {
            return "Are you sure you want to leave?";
        }
    };

    $scope.click_cancel = function () {

        //$scope.grid_refrash();
        $scope.showme = false;

    };
    $scope.save_data_grid = function () {

        $.ajax({
            url: base_url+"inventory_save/item_types_save",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                console.log(response);
                if (response ==1 ) {
                    alert("Data Inserted Successfully");
                    $scope.$apply(function () //to reset dropdown
                    {
                        $scope.data_set = [];
                        $scope.data_set = {form_data: [], selected: {}};
                        $scope.grid_refrash();
                        $scope.showme = false;

                    });
                    console.log($scope.data_set);
                } else
                    alert("Save Faild");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);
                alert(thrownError + " SAVE Failed");

            }
        });


    };

    $scope.add_button_click = function () {

        $scope.showme = true;


        $.ajax({
            url: base_url+"Inventory_load/add_button",
            type: "POST",
            dataType: 'json',
            data: {"button_location": 'ITEM_TYPES'},
            success: function (response) {

                $scope.$apply(function () //to reset dropdown
                {
                    $scope.measurement = response['categorys'];
                    //$scope.data_measurement.select_measurement = {'category_id':'', 'category_name': 'None'};

                });

            }

        });

        $scope.clear_form();


    };

    //----------------------------------------- dropdown load ---------------------------------------------------------
    //Add Fields
    $scope.fields = [];
    $scope.add_field = function () {
        $scope.fields.push({field_name: '', field_data_type: '', field_description: ''});
        //console.log($scope.fields);
        $scope.show_fields = true;
    }//end

    // Item List From database
    $scope.db_data = [];
    $scope.grid_refrash = function () {


        $.ajax({
            url: base_url+"Inventory_load/get_item_type_grid",
            type: "POST",
            dataType: 'json',
            //data: {"modelID": modelID},
            success: function (response) {
                load_data = response;
                console.log(response);
                $scope.$apply(function () //to reset dropdown
                {

                    oTable.fnClearTable();
                    for (var i = 0; i < response.length; i++) {
                        oTable.fnAddData([i + 1,
                            response[i]['item_type_name']

                            , '<div class="tools" >' +
                            '<span onclick="get_index(' + response[i]['item_type_id'] + ',' + i + ',\'edit\')" class="hidden btn-link hidden-xs" style="cursor: pointer;"> <i class="fa fa-edit"></i></span>' +
                            '&nbsp;&nbsp;' +
                            '<span onclick="get_index(' + response[i]['item_type_id'] + ',' + i + ',\'delete\')" class="btn-link" style="cursor: pointer;"><i class="fa fa-trash-o"></i></span>' +
                            '</div>'
                        ]);

                    }
                    $scope.load_complete = true;


                })
                //console.log($scope.db_data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);
                alert(thrownError + " Loading Failed");

            }

        });

    };

    $scope.grid_refrash();

    $scope.clear_form = function (){

        $scope.item_description='';
        $scope.item_type='';
        $scope.category='';
    };
    $scope.array_search = function (array, index, string) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][index] === string) {
                return i;
            }

        }
    };


    //=================================== Delete part =====================================

    $scope.Delete_main_data_user = function (data_id, array_index) {

        if (confirm("Delete " + load_data[array_index]['item_type_name'] + "?") === true) {
            $scope.delete_data.delete_data.push({
                category_id: data_id,
            });

            $.ajax({
                url: base_url+"Inventory_delete/category_delete_user",
                type: "POST",
                dataType: 'json',
                data: JSON.stringify($scope.delete_data),
                success: function (response) {
                    console.log($scope.delete_data);
                    if (response['code'] == 200) {
                        alert(response['message']);

                    } else
                        alert("Save Faild");

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(xhr.responseText);

                    alert(thrownError + " Delete Failed");


                }
            });
        }
    };

});