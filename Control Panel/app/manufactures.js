biziApp.controller('manufacturesController', function ($scope, $http) {
    // create a message to display in our view
    //$(window).trigger('resize');

    var save_data = [];
    var load_data = [];


    var begin, end;

    $scope.filteredTodos = [],
        $scope.currentPage = 1,
        $scope.numPerPage = 10,
        $scope.maxSize = 5,
        $scope.itemNumber = 0;

    $scope.data_set = {form_data: [], selected: {}};
    $scope.update_data = {update_data: [], selected: {}};
    $scope.delete_data = {delete_data: [], selected: {}};

    $scope.db_data = [];


    $http.get(base_url+'countries.json').success(function (data) {
        $scope.countries = data;
    });


// ------------------------ Main Grid Load ----------------------------------------
    $scope.grid_refrash = function () {


        $.ajax({
            url: base_url+"Inventory_load/get_manufacture_grid",
            type: "POST",
            dataType: 'json',
            //data: {"modelID": modelID},
            success: function (response) {

                $scope.$apply(function () //to reset dropdown
                {
                    load_data = response;
                    oTable.fnClearTable();
                    for (var i = 0; i < response.length; i++) {
                        //console.log(response);
                        oTable.fnAddData([i + 1, response[i]['manufacture_name'],
                            response[i]['manufacture_country']

                            , '<div class="tools" >' +
                            '<span onclick="get_index(' + response[i]['manufacture_id'] + ',' + i + ',\'edit\')" class="btn-link hidden-xs" style="cursor: pointer;"> <i class="fa fa-edit"></i></span>' +
                            '&nbsp;&nbsp;' +
                            '<span onclick="get_index(' + response[i]['manufacture_id'] + ',' + i + ',\'delete\')" class="btn-link" style="cursor: pointer;"><i class="fa fa-trash-o"></i></span>' +
                            '</div>'
                        ]);

                    }
                    $scope.load_complete = true;


                })
                //console.log($scope.db_data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Loading  Failed");
                $scope.load_complete = true;

            }

        });

    };
    $scope.grid_refrash();

    $scope.$watch('currentPage + numPerPage', function () {
        $scope.paging();
        $scope.indexStartNo = begin;
        // save_data = $scope.data_set;
    });
    $scope.removeItem = function (index) {

        if (confirm("Delete This Item?") === true) {
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
//-------------- Button Events -------------------------------------


    $scope.add_to_grid = function () {
        if (typeof ($scope.array_search($scope.data_set.form_data, 'manufacture', $scope.manufacture)) != 'undefined') {
            alert("This Manufacture is  Already in Grid");
        }
        else
        {
            $.ajax({
                url: base_url + "inventory_load/search_duplicates",
                type: "POST",
                dataType: 'json',
                data: {
                    "col": 'manufacture_id',
                    "table": 'nsinm_manufacture',
                    "search_col": 'manufacture_name',
                    "search_data": $scope.manufacture
                },
                success: function (response) {
                    console.log(response);
                    if (response['status'] == 0) {
                        $scope.$apply(function () //to reset dropdown
                        {
                            $scope.data_set.form_data.push({
                                id: $scope.itemNumber++,
                                country_code: $scope.country.code,
                                country: $scope.country.name,
                                manufacture: $scope.manufacture,
                                manufacture_details: $scope.manufacture_details
                            });

                            $scope.paging();
                            $scope.currentPage = Math.ceil($scope.data_set.form_data.length / $scope.numPerPage);
                            $scope.clear_form_data();
                        });
                    } else {
                        alert("already add this manufacture ");
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(xhr.responseText);

                    alert(thrownError + " Save Failed");


                }
            });

        }

    };
    $scope.click_cancel = function () {

        // $scope.grid_refrash();
        $scope.showme = false;

    };
    $scope.save_data_grid = function () {

        $.ajax({
            url: base_url+"inventory_save/manufactures_save",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                console.log(response);
                if (response == 1) {
                    alert("Data Inserted Successfully");
                    $scope.$apply(function () //to reset dropdown
                    {
                        $scope.data_set = [];
                        $scope.data_set = {form_data: [], selected: {}};
                        $scope.grid_refrash();
                        $scope.showme = false;

                    });
                    console.log($scope.data_set);
                } else {

                    alert("Save Faild");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Save Failed");


            }
        });


    };
    $scope.add_button_click = function () {
        $scope.showme = true;
        $scope.edit_mode_enabled = false;

        $scope.clear_form_data();

    };

    $scope.clear_form_data = function () {
        $scope.manufacture = '';
        $scope.manufacture_details = '';
        $scope.country = $scope.countries[$scope.countries.objIndexOf('')];//i am not sure this is ok

    }


// ----------------------------------Edit part--------------------------------------------


    $scope.load_main_data_for_edit = function (data_id, array_index) {


        // alert(data_id);
        //console.log($scope.db_data);

        if (confirm("Edit " + load_data[array_index]['manufacture_name'] + "?") === true) {
            //load text box and dropdowns
            $scope.$apply(function () //to reset dropdown
            {
                console.log(load_data);
                $scope.manufacture = load_data[array_index]['manufacture_name'];
                $scope.manufacture_ID = data_id;
                $scope.manufacture_details = load_data[array_index]['manufacture_description'];
                // document.getElementById('dropdown_manifacture').value=response['manufactureID'];indexOf

                $scope.country = $scope.countries[$scope.countries.objIndexOf(load_data[array_index]['manufacture_country'])];

                $scope.edit_mode_enabled = true;
                $scope.showme = true;
            });
        }


    };

    //Save The edited data NEED TO BE FIXED
    $scope.update_main_data = function () {


        $scope.update_data.update_data.push({
            id: $scope.manufacture_ID,
            country_code: $scope.country.code,
            country: $scope.country.name,
            manufacture: $scope.manufacture,
            manufacture_details: $scope.manufacture_details


        });


        //I know this is a copypaste but this function isnt right to update data,
        //use save_data_grid function instead

        $.ajax({
            url: base_url+"Inventory_update/manufacture_update",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.update_data),
            success: function (response) {
                // console.log(response);
                if (response.res === 1) {
                    alert("Data Updated Successfully");
                    $scope.$apply(function () //to reset dropdown
                    {
                        // $scope.update_data = [];
                        $scope.update_data = {update_data: [], selected: {}};
                        $scope.grid_refrash();

                        $scope.showme = false;

                    });
                    // console.log($scope.data_set);
                } else {
                    alert("Update Failed");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Updated Failed");


            }
        });


    };

    //--------------------------Delete -------------------

    $scope.Delete_main_data_user = function (data_id, array_index) {

        if (confirm("Delete " + load_data[array_index]['manufacture_name'] + "?") === true) {
            $scope.delete_data.delete_data.push({manufacture_id: data_id});
            $.ajax({
                url: base_url+"Inventory_delete/manufacture_delete_user",
                type: "POST",
                dataType: 'json',
                data: JSON.stringify($scope.delete_data),
                success: function (response) {
                    console.log(response);
                    if (response.res === 1) {
                        alert("Data Delete Successfully");
                        $scope.$apply(function () //to reset dropdown
                        {
                            // $scope.update_data = [];
                            $scope.delete_data = {delete_data: [], selected: {}};
                            $scope.grid_refrash();

                            $scope.showme = false;

                        });
                        // console.log($scope.data_set);
                    } else
                        alert("Delete Failed");
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(xhr.responseText);

                    alert(thrownError + " Delete Failed");


                }
            });
        }
    };

    $scope.array_search = function (array, index, string) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][index] === string) {
                return i;
            }

        }
    };


});