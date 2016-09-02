biziApp.controller('clientsController', function ($scope) {
    // create a message to display in our view
    //$(window).trigger('resize');

    var save_data = [];
    var load_data = [];


    var begin, end;

    $scope.filteredTodos = [],
        $scope.itemNumber=0;


    $scope.data_set = {form_data: [], selected: {}};
    $scope.update_data = {update_data: [], selected: {}};
    $scope.delete_data = {delete_data: [], selected: {}};
    //  $scope.Is_company_code_variable = 0;
    $scope.company={};


    //======================== Form Loading ======================================
    // Item List From database
    $scope.grid_refrash = function () {

        $.ajax({
            url: base_url + "Inventory_load/get_clients_grid",
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
                        var street = "";
                        var city = "";
                        var phone = "";
                        var web = "";
                        if (response[i]['street1'] == "" || response[i]['street1'] == null) {
                            street = "n/a"
                        } else {
                            street = response[i]['street1'];
                        }
                        if (response[i]['city'] == "" || response[i]['city'] == null) {
                            city = "n/a"
                        } else {
                            city = response[i]['city'];
                        }
                        if (response[i]['phone_number'] == "" || response[i]['phone_number'] == 0) {
                            phone = "n/a"
                        } else {
                            phone = response[i]['phone_number'];
                        }
                        if (response[i]['web_address'] == "") {
                            web = "n/a"
                        } else {
                            web = response[i]['web_address'];
                        }
                        oTable.fnAddData([i + 1, response[i]['company_name'],
                            response[i]['company_code'],
                            response[i]['default_username'],
                            street,
                            city,
                            phone,
                            web

                            , '<div class="tools" >' +
                            '<span onclick="get_index(' + response[i]['customer_id'] + ',' + i + ',\'edit\')" class="btn-link hidden-xs" style="cursor: pointer;"> <i class="fa fa-edit"></i></span>' +
                            '&nbsp;&nbsp;' +
                            '<span onclick="get_index(' + response[i]['customer_id'] + ',' + i + ',\'delete\')" class="btn-link" style="cursor: pointer;"><i class="fa fa-trash-o"></i></span>' +
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

    //==================================================================================

    $scope.get_company_class = function () {
        $.ajax({
            url: base_url + "Inventory_load/get_company_class",
            type: "POST",
            dataType: 'json',
            //data: {"LENGTH": invoice_char_length},
            success: function (response) {
                console.log(response);

                $scope.$apply(function () //to reset dropdown
                {

                    $scope.company_classes = response;
                });

            }

        });


    };
    $scope.clear_form_data = function () {
        $scope.company.name = '';
        $scope.company.code = '';
        $scope.company.TP = '';
        $scope.company.address = '';
        $scope.company.city = '';
        $scope.company.email = '';
        $scope.company.web = '';
        $scope.company_class = '';
    }


    //======================== Buttons Click Event ======================================

    $scope.add_button_click = function () {
        $scope.showme = true;
        $scope.edit_mode_enabled = false;
        $scope.get_company_class();
        $scope.clear_form_data();
        $scope.data_set = {form_data: [], selected: {}};
        // check Customer code is exist
    };
    $scope.click_cancel = function () {

        //  $scope.grid_refrash();
        $scope.showme = false;

    };
    $scope.save_data_grid = function () {
        $scope.data_set = {form_data: [], selected: {}};
        $scope.data_set.form_data.push({
            id: $scope.itemNumber++,
            company_name: $scope.company.name,
            company_code: $scope.company.code,
            address: $scope.company.address,
            phone: $scope.company.TP,
            email: $scope.company.email,
            web: $scope.company.web,
            city: $scope.company.city,
            company_class: $scope.company_class.company_class_id,
            company_id: company_id,
            monthly_rental: 0.00,
            system_value: 0.00,
            user_id: user_id
        });
        console.log($scope.data_set);
        $.ajax({
            url: base_url + "inventory_save/company_save",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                console.log(response);

                    if (response === 1) {
                        alert("Data Inserted Successfully");
                        $scope.$apply(function () //to reset dropdown
                        {
                            $scope.data_set = [];
                            $scope.data_set = {form_data: [], selected: {}};
                            $scope.clear_form_data();
                            $scope.grid_refrash();
                            $scope.showme = false;

                        });
                        console.log($scope.data_set);
                    } else if(response === 2){
                        alert("Company Code Already Exist");
                        $scope.data_set = {form_data: [], selected: {}};
                    } else if(response === 3) {
                        alert("Warning! Save succeed without setting permission");
                    }
                    else {
                        alert("Save Faild");
                        $scope.data_set = [];
                        $scope.data_set = {form_data: [], selected: {}};
                        $scope.grid_refrash();
                        $scope.showme = false;
                    }


            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Save Failed");


            }
        });


    };

    //======================== END Buttons Click Event ======================================

    // ============================ Edit part =================================================
    $scope.load_main_data_for_edit = function (data_id, array_index) {


        // alert(data_id);
        //console.log($scope.db_data);

        if (confirm("Edit " + load_data[array_index]['customer_name'] + "?") === true) {
            //load text box and dropdowns
            $scope.$apply(function () //to reset dropdown
            {
                console.log(load_data);
                $scope.customer_name = load_data[array_index]['customer_name'];
                $scope.customer_ID = data_id;
                $scope.contact_id = load_data[array_index]['contact_id'];
                $scope.customer_address = load_data[array_index]['street1'];
                $scope.customer_TP = load_data[array_index]['phone_number'];
                //$scope.customer_email = load_data[array_index]['web_address'];
                $scope.customer_code = load_data[array_index]['customer_code'];
                $scope.customer_city = load_data[array_index]['city'];

                if (load_data[array_index]['web_address'] === null) {
                    $scope.customer_email = '';
                }
                else {
                    $scope.customer_email = load_data[array_index]['web_address'];
                }

                $scope.edit_mode_enabled = true;
                $scope.showme = true;
            });
        }


    };

    //Save The edited data NEED TO BE FIXED
    $scope.update_main_data = function () {


        $scope.update_data.update_data.push({
            id: $scope.customer_ID,
            contact_id: $scope.contact_id,
            customer_name: $scope.customer_name,
            customer_address: $scope.customer_address,
            customer_TP: $scope.customer_TP,
            customer_email: $scope.customer_email,
            customer_city: $scope.customer_city,
            customer_code: $scope.customer_code

        });


        //I know this is a copypaste but this function isnt right to update data,
        //use save_data_grid function instead

        $.ajax({
            url: base_url + "Inventory_update/customer_update",
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
                    $scope.update_data = {update_data: [], selected: {}};
                    $scope.grid_refrash();

                    $scope.showme = false;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);
                alert(thrownError + " Update Failed");

            }
        });


    };
    // ============================ END Edit part ============================

    //============================ Delete  Part ============================

    $scope.Delete_main_data_user = function (data_id, array_index) {

        if (confirm("Delete " + load_data[array_index]['customer_name'] + "?") === true) {
            $scope.delete_data.delete_data.push({
                customer_id: data_id,
                contact_id: load_data[array_index]['contact_id']
            });

            console.log($scope.delete_data);
            $.ajax({
                url: base_url + "Inventory_delete/customer_delete_user",
                type: "POST",
                dataType: 'json',
                data: JSON.stringify($scope.delete_data),
                success: function (response) {
                    console.log($scope.delete_data);
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
                    } else {
                        alert("Delete Failed");
                        $scope.delete_data = {delete_data: [], selected: {}};
                        $scope.grid_refrash();

                        $scope.showme = false;
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(xhr.responseText);

                    alert(thrownError + " Delete Failed");


                }
            });
        }
    };
    //============================  END Delete  Part ============================


    //============================ other functions ============================

    $scope.array_search = function (array, index, string) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][index] === string) {
                return i;
            }

        }
    };


});
