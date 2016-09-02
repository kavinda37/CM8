biziApp.controller('customersController', function ($scope) {
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


    //================ Grid  Event ========================================
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

    //================ END Grid  Event ========================================
    //======================== Form Loading ======================================
    // Item List From database
    $scope.db_data = [];
    $scope.grid_refrash = function () {

        $.ajax({
            url: base_url+"Inventory_load/get_customer_grid",
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
                        oTable.fnAddData([i + 1, response[i]['person_name'],
                            response[i]['person_code'],
                            street,
                            city,
                            phone,
                            web

                            , '<div class="tools" >' +
                            '<span onclick="get_index(' + response[i]['person_id'] + ',' + i + ',\'edit\')" class="btn-link hidden-xs" style="cursor: pointer;"> <i class="fa fa-edit"></i></span>' +
                            '&nbsp;&nbsp;' +
                            '<span onclick="get_index(' + response[i]['person_id'] + ',' + i + ',\'delete\')" class="btn-link" style="cursor: pointer;"><i class="fa fa-trash-o"></i></span>' +
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

    //======================== Buttons Click Event ======================================

    $scope.add_button_click = function () {
        $scope.showme = true;
        $scope.edit_mode_enabled = false;

        $scope.clear_form_data();
        // check Customer code is exist


    };

    $scope.add_to_grid = function () {
        //Change this array according to the page
        //alert($scope.Is_customer_code($scope.customer_code));
        if (typeof ($scope.array_search($scope.data_set.form_data, 'customer_code', $scope.customer_code)) != 'undefined') {
            alert("This Customer Code Alredy in Grid");
        }
        else {
            $.ajax({
                url: base_url+"Inventory_load/get_customer_code_no",
                type: "POST",
                dataType: 'json',
                data: {"customer_code": $scope.customer_code},
                success: function (response) {
                    $scope.$apply(function () //to reset dropdown
                    {
                        if (response == 1) {
                            alert("Already added this Customer code")

                        } else {
                            $scope.data_set.form_data.push({
                                id: $scope.itemNumber++,
                                customer_name: $scope.customer_name,
                                street1: $scope.street1,
                                street2: $scope.street2,
                                province: $scope.province,
                                postal_code: $scope.postal_code,
                                phone: $scope.customer_TP,
                                email: $scope.customer_email,
                                customer_code: $scope.customer_code,
                                customer_city: $scope.customer_city,
                                company_id: company_id,
                                user_id: user_id
                            });
                            $scope.clear_form_data();

                            $scope.paging();
                            $scope.currentPage = Math.ceil($scope.data_set.form_data.length / $scope.numPerPage);
                        }
                    });
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(xhr.responseText);

                    alert(thrownError + " Customer code test Failed");


                }

            });
        }


    };

    $scope.clear_form_data = function () {
        $scope.customer_name = '';
        $scope.contact_id = '';
        $scope.street1 = '';
        $scope.street2 = '';
        $scope.province = '';
        $scope.postal_code = '';
        $scope.customer_TP = '';
        $scope.customer_email = '';
        $scope.customer_code = '';
        $scope.customer_city = '';
    }
    $scope.click_cancel = function () {

        //  $scope.grid_refrash();
        $scope.showme = false;

    };
    $scope.save_data_grid = function () {

        $.ajax({
            url: base_url+"inventory_save/customers_save",
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

    // ----------------------------------Edit part--------------------------------------------
    $scope.load_main_data_for_edit = function (data_id, array_index) {


        // alert(data_id);
        //console.log($scope.db_data);

        if (confirm("Edit " + load_data[array_index]['person_name'] + "?") === true) {
            //load text box and dropdowns
            $scope.$apply(function () //to reset dropdown
            {
                console.log(load_data);
                $scope.customer_name = load_data[array_index]['person_name'];
                $scope.customer_ID = data_id;
                $scope.contact_id = load_data[array_index]['contact_id'];
                $scope.street1 = load_data[array_index]['street1'];
                $scope.street2 = load_data[array_index]['street2'];
                $scope.province = load_data[array_index]['province'];
                $scope.postal_code = load_data[array_index]['postal_code'];
                $scope.customer_TP = load_data[array_index]['phone_number'];
                //$scope.customer_email = load_data[array_index]['web_address'];
                $scope.customer_code = load_data[array_index]['person_code'];
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

        $scope.update_data = {update_data: [], selected: {}};
        $scope.update_data.update_data.push({
            id: $scope.customer_ID,
            contact_id: $scope.contact_id,
            customer_name: $scope.customer_name,
            street1: $scope.street1,
            street2: $scope.street2,
            province: $scope.province,
            postal_code: $scope.postal_code,
            customer_TP: $scope.customer_TP,
            customer_email: $scope.customer_email,
            customer_city: $scope.customer_city,
            customer_code: $scope.customer_code

        });


        //I know this is a copypaste but this function isnt right to update data,
        //use save_data_grid function instead

        $.ajax({
            url: base_url+"Inventory_update/customer_update",
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
    // ----------------------------------END Edit part--------------------------------------------

    //--------------------------------- Delete  Part -------------------


    $scope.Delete_main_data_user = function (data_id, array_index) {

        if (confirm("Delete " + load_data[array_index]['person_name'] + "?") === true) {
            $scope.delete_data.delete_data.push({
                customer_id: data_id,
                contact_id: load_data[array_index]['contact_id']
            });

            console.log($scope.delete_data);
            $.ajax({
                url: base_url+"Inventory_delete/customer_delete_user",
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
    //--------------------------------- END Delete  Part -------------------
    //--------------------------------- other functions --------------------
    $scope.Is_customer_code = function (customer_code) {
        $.ajax({
            url: base_url+"Inventory_load/get_customer_code_no",
            type: "POST",
            dataType: 'json',
            data: {"customer_code": customer_code},
            success: function (response) {
                $scope.$apply(function () //to reset dropdown
                {
                    // alert(response);
                    // return response;
                    return true;
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                // alert(thrownError + " Loading  Failed");
                return false;


            }

        });
    };

    $scope.array_search = function (array, index, string) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][index] === string) {
                return i;
            }

        }
    };


});
