biziApp.controller('modelsController', function ($scope) {
    // create a message to display in our view
    //$(window).trigger('resize');

    var save_data = [];
    var obj_manufac = document.getElementById("dropdown_manifacture");

    var supplier_id;
    var custom_type_id;
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

    $scope.get_field = [];
    $scope.send_field = [];
    $scope.set_types_array = [];
    $scope.warrenty_in_week = 0;
    //Array to be config

//load qty type


    $scope.data_QT = {
        /*quntity_types: [{
            ID: 1,
            Name: 'Single Serialized'
        }, {
            ID: 2,
            Name: 'Bulk Serialized'
        }, {
            ID: 3,
            Name: 'Single Non-Serialized'
        }, {
            ID: 4,
            Name: 'Bulk Non-Serialized'
        }
        ],
        select_QT: {} //This sets the default value of the select in the uiID: '', name: 'Option C'
    };
*/

        quntity_types: [{
            ID: 1,
            Name: 'Serialized'
        }, {
            ID: 3,
            Name: 'Non-Serialized'
        }
        ],
        select_QT: {} //This sets the default value of the select in the uiID: '', name: 'Option C'
    };
    $scope.data_Types = {
        set_types_array: [],
        select_Type: {} //This sets the default value of the select in the uiID: '', name: 'Option C'
    };
    $scope.data_Manu = {
        manufactures: [],
        select_Manufacture: {}
    };
    $scope.data_supp = {
        suppliers: [],
        select_Supplier: {}
    };

    $scope.data_warranty = {
        warrantys: [{ID: '',Name: 'None'},{
            ID: 'Y',
            Name: 'Year(s)'
        }, {
            ID: 'M',
            Name: 'Month(s)'
        }, {
            ID: 'W',
            Name: 'Week(s)'
        }, {
            ID: -1,
            Name: 'Lifetime'
        }
        ],
        select_warranty: {ID: '',Name: 'None'}
    };


    // ----------Data grid Load-----------------

    $scope.db_data = [];
    $scope.grid_refrash = function () {


        $.ajax({
            url: base_url + "Inventory_load/get_model_grid",
            type: "POST",
            dataType: 'json',
            //data: {"modelID": modelID},
            success: function (response) {
                //console.log(response);
                $scope.$apply(function () //to reset dropdown
                {
                    //console.log(response);
                    load_data = response;
                    console.log(load_data);
                    oTable.fnClearTable();
                    for (var i = 0; i < response.length; i++) {
                        //alert(response[i]['data_ID']);
                        oTable.fnAddData([i + 1,
                            response[i]['manufacture_name'] + ' ' + response[i]['model_name'],
                            response[i]['code_value'],
                            response[i]['item_type_name'],
                            response[i]['model_cost_price'],
                            response[i]['model_retail_price']

                            , '<div class="tools" >' +
                            '<span onclick="get_index(' + response[i]['data_ID'] + ',' + i + ',\'edit\')" class="btn-link hidden-xs" style="cursor: pointer;"> <i class="fa fa-edit"></i></span>' +
                            '&nbsp;&nbsp;' +
                            '<span onclick="get_index(' + response[i]['data_ID'] + ',' + i + ',\'delete\')" class="btn-link" style="cursor: pointer;"><i class="fa fa-trash-o"></i></span>' +
                            '</div>'
                        ]);


                    }
                    $scope.load_complete = true;


                });
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
    // ---------- END Data grid Load-----------------
    // ----------
    $scope.set_types = function () {


    };

    ///  $scope.set_types_array=set_types_array;
    //console.log(set_types_array);
    $scope.get_fields = function (model) {
        $scope.send_field = [];
        for (var i = 0; i < $scope.fields.length; i++) {

            $scope.send_field.push({
                field_id: $scope.fields[i].field_description,
                field_data_value: $scope.get_field[$scope.fields[i].field_name],
                model_id: model
            });

        }
    };


    $scope.add_to_grid = function () {
        //Change this array according to the page
        // //to reset fields
        $scope.get_fields('');
        if (typeof ($scope.array_search($scope.data_set.form_data, 'model_serial', $scope.M_serialno)) != 'undefined') {
            alert("This Model Code is  Already in Grid");
        }
        else {
            //---------------------------------------
            $.ajax({
                url: base_url + "Inventory_load/get_model_code_no",
                type: "POST",
                dataType: 'json',
                data: {"model_code": $scope.M_serialno},
                success: function (response) {
                    $scope.$apply(function () //to reset dropdown
                    {
                        if (response == 1) {
                            alert("Already added this Model code")

                        } else {
                            $scope.data_set.form_data.push({
                                id: $scope.itemNumber++,
                                model: $scope.model,
                                // manufacture: obj_manufac.options[obj_manufac.selectedIndex].text,
                                manufacture: $scope.data_Manu.select_Manufacture.manufacture_name,
                                //  M_ID: obj_manufac.options[obj_manufac.selectedIndex].value,
                                M_ID: $scope.data_Manu.select_Manufacture.manufacture_id,
                                supplier: $scope.data_supp.select_Supplier.person_name,
                                //supplier: $('#dropdown_supplier').multipleSelect('getSelects', 'text'),
                                // supplier_grid: $scope.arrayToString($('#dropdown_supplier').multipleSelect('getSelects', 'text')),
                                supplier_grid: $scope.data_supp.select_Supplier.person_name,
                                supplier_ID: $scope.data_supp.select_Supplier.person_id,
                                type: $scope.data_Types.select_Type.item_type_name,
                                type_ID: $scope.data_Types.select_Type.item_type_id,
                                model_serial: $scope.M_serialno,
                                bulk_size: $scope.bulk_size,
                                model_qty_type: $scope.data_QT.select_QT.ID,
                                fields: $scope.send_field,
                                model_cost: $scope.M_cost,
                                warrenty_period: $scope.warrenty_in_week,
                                model_retail: $scope.M_retail,
                                model_wholesale_retail: $scope.wholesale_price,
                                model_visible_cost: $scope.visible_cost
                            });
                            $scope.paging();
                            $scope.currentPage = Math.ceil($scope.data_set.form_data.length / $scope.numPerPage);
                            $scope.clear_form();
                            console.log($scope.data_set.form_data);
                        }
                    });
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(xhr.responseText);

                    alert(thrownError + " Model code test Failed");


                }

            });
            //---------------------------------


        }
        //console.log($scope.data_set);


        $scope.send_field = [];

        $scope.fields = [];
        // $scope.type = 2;
    };

    $scope.$watch('currentPage + numPerPage', function () {
        $scope.paging();
        $scope.indexStartNo = begin;
        save_data = $scope.data_set;
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
    // Array to string (display array in grid)
    $scope.arrayToString = function (string) {

        return string.join(", ");
    };

    $scope.click_cancel = function () {
        location.reload();
        /*$scope.grid_refrash();
         $scope.showme = false;*/
    };
    $scope.save_data_grid = function () {
        $scope.enable_loading = true;
        $.ajax({
            url: base_url + "inventory_save/models_save",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                console.log(response);
                if (response == 1) {
                    alert('Data Inserted Successfully');
                    $scope.$apply(function () //to reset dropdown
                    {
                        $scope.data_set = [];
                        $scope.data_set = {form_data: [], selected: {}};
                        $scope.grid_refrash();

                        $scope.showme = false;

                    });
                    // console.log($scope.data_set);
                } else
                    alert("Save Faild");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Save  Failed");
                $scope.load_complete = true;

            }
        });


    };
    //----------------------------------------- dropdown load ---------------------------------------------------------

    //Add Fields (Need to be custom created on dropdown select)
    $scope.fields = [];
    //$scope.add_field = function () { //this function is comented for illustration purpose,
    //uncomment and use this function on dropdown change, use ajax to get dynamic field data
    $scope.get_custom_fields = function (type_id) {

        $.ajax({
            url: base_url + "Inventory_load/get_custom_fields",
            type: "POST",
            dataType: 'json',
            data: {"item_typeID": type_id},
            success: function (response) {
                // console.log(response.item_typeID);
                $scope.$apply(function () //to reset dropdown
                {
                    //alert('Hi ' + $scope.type);
                    //alert(response.item_typeID.length);
                    $scope.fields = [];
                    for (var i = 0; i < response.item_typeID.length; i++) {

                        $scope.fields.push({
                            field_name: response.item_typeID[i]['field_name'],
                            field_data_type: response.item_typeID[i]['field_data_type'],
                            field_description: response.item_typeID[i]['field_id']
                        });

                    }

                    if (response.item_typeID.length > 0)
                        $scope.show_fields = true;
                    else
                        $scope.show_fields = false;
                });
                // console.log($scope.fields);
            }

        });

    };


    // Item List From database
//-----------------------------

    $scope.show_bulk_size = function () {
        // alert($scope.qty_type.ID);
        if ($scope.data_QT.select_QT.ID == 2 || $scope.data_QT.select_QT.ID == 4) {
            $scope.show_bulk = false;

        } else {
            $scope.show_bulk = true;
            $scope.bulk_size = 1;
        }


    };

    $scope.set_time_period = function () {
        // alert($scope.data_warranty.select_warranty.ID);
        var time_id=null;
        time_id=$scope.data_warranty.select_warranty.ID;

        if (time_id == 'Y') {
            $scope.warrenty_in_week = 52 * $scope.company_warrenty;
        }
        else if (time_id == 'M') {
            $scope.warrenty_in_week = 4 * $scope.company_warrenty;
        }
        else if (time_id == 'W') {
            $scope.warrenty_in_week = $scope.company_warrenty;
        }
        else if (time_id == -1) {
            $scope.warrenty_in_week = -1;
            $scope.company_warrenty='';
        }
        else {
            $scope.warrenty_in_week = 0;
            $scope.company_warrenty='';
        }
        //alert($scope.warrenty_in_week);
    };


//---------------------

    $scope.add_button_click = function () {
        $scope.enable_loading = false;
        $scope.showme = true;
        $scope.edit_mode_enabled = false;
        $scope.show_fields = false;
        $scope.show_bulk = true;
        $scope.data_warranty.select_warranty = {ID: '',Name: 'None'};
        $scope.company_warrenty = 0;

        $scope.is_edit = false;

        // $scope.qty_type = $scope.quntity_types[3];
        //$scope.show_bulk_size();
        $scope.warrenty_in_week = 0;

        $scope.clear_form();

        $scope.load_dropdown();


        var element = document.getElementById('dropdown_manifacture');
        element.value = '';
        //$scope.qty_type = $scope.quntity_types[3];//Bulk Type select
        // $scope.show_bulk_size();
        // $("#dropdown_supplier").multipleSelect("setSelects", [0]);
        //  $scope.type = $scope.set_types_array[0];
        // console.log(data_Types);

    };

    $scope.clear_form = function () {
        //Clear txt Boxes
        $scope.model = "";
        $scope.Model_ID = "";
        $scope.M_serialno = "";
        $scope.bulk_size = "";
        $scope.M_cost = null;
        $scope.M_retail = null;
        $scope.data_QT.select_QT = {'ID': '', 'Name': 'None'};
        $scope.wholesale_price=null;
        $scope.visible_cost=null;
        // $scope.type = $scope.set_types_array[0];
        //$scope.qty_type = $scope.quntity_types[0];
    };

    $scope.load_dropdown = function () {
        $.ajax({
            url: base_url + "Inventory_load/add_button",
            type: "POST",
            dataType: 'json',
            data: {"button_location": 'Model'},
            success: function (response) {

                $scope.$apply(function () //to reset dropdown
                {
                    $scope.set_types_array = response['Types'];

                    $scope.manufactures = response['manufactures'];

                    $scope.suppliers = response['suppliers'];

                });
                console.log($scope.set_types_array);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " load  Failed");
                $scope.load_complete = true;

            }


        });
    };

//=======================

// ----------------------------------Edit part--------------------------------------------
    $scope.load_main_data_for_edit = function (data_id, array_index) {

        $scope.load_dropdown();
        $scope.is_edit = true;

        //alert(data_id);
        // console.log($scope.load_data);

        if (confirm("Edit " + load_data[array_index]['manufacture_name'] + " " + load_data[array_index]['model_name'] + "?") === true) {
            //load text box and dropdowns

            $scope.$apply(function () //to reset dropdown
            {
                 console.log(load_data);
//alert(data_id);
                $scope.model = load_data[array_index]['model_name'];
                $scope.Model_ID = data_id;
                $scope.M_serialno = load_data[array_index]['model_code'];
                $scope.M_cost = parseInt(load_data[array_index]['model_cost_price']);
                $scope.M_retail = parseInt(load_data[array_index]['model_retail_price']);
                var manu_name = load_data[array_index]['manufacture_name'];
                $scope.data_Manu.select_Manufacture = {
                    'manufacture_id': load_data[array_index]['manufacture_id'],
                    'manufacture_name': manu_name
                };


                var sup_name = load_data[array_index]['supplier_name'];
                $scope.data_supp.select_Supplier = {
                    'supplier_id': load_data[array_index]['supplier_id'],
                    'supplier_name': sup_name
                };
                // $scope.data_Types.select_Type = $scope.set_types_array[$scope.array_search($scope.set_types_array, 'item_type_id', load_data[array_index]['item_type_id'])];
                var types = load_data[array_index]['item_type_name'];
                $scope.data_Types.select_Type = {
                    'item_type_id': load_data[array_index]['item_type_id'],
                    'item_type_name': types
                };

                var qty_st = $scope.quntity_types_search(load_data[array_index]['model_qty_type']);
                $scope.data_QT.select_QT = {'ID': load_data[array_index]['model_qty_type'], 'Name': qty_st};

                if (load_data[array_index]['warrenty_time_period'] == -1) {

                    $scope.company_warrenty = '';


                }
                else {
                    $scope.company_warrenty = parseInt(load_data[array_index]['warrenty_time']);
                }
                var warrant = $scope.warrenty_search(load_data[array_index]['warrenty_time_period']);
                $scope.data_warranty.select_warranty = {
                    'ID': load_data[array_index]['warrenty_time_period'],
                    'Name': warrant
                };
                $scope.show_bulk_size();
                //load_data[array_index]['supplier_id']
                //$scope.type=1;item_type_id
                //  $scope.qty_type=1;
                custom_type_id = load_data[array_index]['item_type_id'];//field_7
                //  supplier_id = load_data[array_index]['supplier_id'];
                $scope.bulk_size = parseInt(load_data[array_index]['model_bulk_size']);
                $scope.wholesale_price=parseInt(load_data[array_index]['model_wholesale_retail']);
                $scope.visible_cost=parseInt(load_data[array_index]['model_public_cost']);

                // var element = document.getElementById('time_period');
                // element.value = load_data[array_index]['warrenty_time_period'];
                // console.log($scope.data_Types);


            });
            // $("#dropdown_supplier").multipleSelect("setSelects", [supplier_id]);

            //$scope.show_bulk_size();

            $.ajax({
                url: base_url + "Inventory_load/get_custom_field_values",
                type: "POST",
                dataType: 'json',
                data: {"item_typeID": custom_type_id, "Model_id": data_id},
                success: function (response) {
                    console.log(response.item_typeID);
                    $scope.$apply(function () //to reset dropdown
                    {
                        //alert('Hi ' + $scope.type);
                        //alert(response.item_typeID.length);
                        $scope.fields = [];
                        for (var i = 0; i < response.item_typeID.length; i++) {

                            $scope.fields.push({
                                field_name: response.item_typeID[i]['field_name'],
                                field_data_type: response.item_typeID[i]['field_data_type'],
                                field_description: response.item_typeID[i]['field_id'],
                                value: response.item_typeID[i]['field_data_value']
                            });//value

                        }

                        if (response.item_typeID.length > 0)
                            $scope.show_fields = true;
                        else
                            $scope.show_fields = false;
                    })
                    // console.log($scope.fields);
                }

            });

            $scope.$apply(function () {
                $scope.edit_mode_enabled = true;
                $scope.showme = true;
            });
        }


    };

    //Save The edited data NEED TO BE FIXED


    $scope.quntity_types_search = function (type_id) {
        var typetostring = '';
        if (type_id == 1) {
            typetostring = 'Single Serialized';

        }
        else if (type_id == 2) {
            typetostring = 'Bulk Serialized';
        }
        else if (type_id == 3) {
            typetostring = 'Single Non-Serialized';
        }
        else if (type_id == 4) {
            typetostring = 'Bulk Non-Serialized';
        }
        else {
            typetostring = 'None';
        }
        return typetostring;
    };
    $scope.warrenty_search = function (type_id) {
        var typetostring = '';
        if (type_id == 'Y') {
            typetostring = 'Year(s)';

        }
        else if (type_id == 'M') {
            typetostring = 'Month(s)';
        }
        else if (type_id == 'W') {
            typetostring = 'Week(s)';
        }
        else if (type_id == -1) {
            typetostring = 'Lifetime';
        }
        else {
            typetostring = 'None';
        }
        return typetostring;
    };


    $scope.update_main_data = function () {

        $scope.set_time_period();
        $scope.get_fields($scope.Model_ID);
        $scope.update_data.update_data.push({
            id: $scope.Model_ID,
            model: $scope.model,
            // M_ID: obj_manufac.options[obj_manufac.selectedIndex].value,
            //  supplier_ID: $('#dropdown_supplier').val(),
            M_ID: $scope.data_Manu.select_Manufacture.manufacture_id,
            supplier_ID: $scope.data_supp.select_Supplier.person_id,
            type_ID: $scope.data_Types.select_Type.item_type_id,
            model_serial: $scope.M_serialno,
            bulk_size: $scope.bulk_size,
            model_qty_type: $scope.data_QT.select_QT.ID,
            model_cost: $scope.M_cost,
            warrenty_period: $scope.warrenty_in_week,
            model_retail: $scope.M_retail,
            model_wholesale_retail: $scope.wholesale_price,
            model_visible_cost: $scope.visible_cost,
            fields: $scope.send_field


        });


        //I know this is a copypaste but this function isnt right to update data,
        //use save_data_grid function instead

        $.ajax({
            url: base_url + "Inventory_update/models_update",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.update_data),
            success: function (response) {
                // console.log(response);
                if (response.res === "Data Updated Successfully") {
                    alert(response.res + ' * custom data fields not updated*');
                    $scope.$apply(function () //to reset dropdown
                    {
                        // $scope.update_data = [];
                        $scope.send_field = [];
                        $scope.update_data = {update_data: [], selected: {}};
                        $scope.grid_refrash();

                        $scope.showme = false;

                    });
                    // console.log($scope.data_set);
                } else {
                    alert(response.res + "  Update Failed");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Update  Failed");
                $scope.load_complete = true;

            }
        });


    };

    //Delete -------------------


    $scope.Delete_main_data_user = function (data_id, array_index) {

        if (confirm("Delete " + load_data[array_index]['manufacture_name'] + " " + load_data[array_index]['model_name'] + "?") === true) {
            $scope.delete_data.delete_data.push({Model_id: data_id});
            $.ajax({
                url: base_url + "Inventory_delete/models_delete_user",
                type: "POST",
                dataType: 'json',
                data: JSON.stringify($scope.delete_data),
                success: function (response) {
                    //console.log(response);
                    if (response.res === 1) {
                        alert("Data Deleted Successfully");
                        $scope.$apply(function () //to reset dropdown
                        {
                            // $scope.update_data = [];
                            $scope.delete_data = {delete_data: [], selected: {}};
                            $scope.grid_refrash();

                            $scope.showme = false;

                        });
                        // console.log($scope.data_set);
                    } else {
                        if (response.msg === 1) {
                            alert("Items available can't delete");

                        }
                        else {
                            alert("Deleted Failed");
                        }
                        $scope.delete_data = {delete_data: [], selected: {}};
                        $scope.grid_refrash();
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(xhr.responseText);

                    alert(thrownError + " Delete  Failed");
                    $scope.delete_data = {delete_data: [], selected: {}};
                    $scope.grid_refrash();
                    $scope.load_complete = true;

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