biziApp.controller('note_grController', function ($scope, $route,$templateCache,datatables_service) {
    // create a message to display in our view

    //$(window).trigger('resize');

    var save_data = [];
    var DM = document.getElementById("dropdown_manifacture");//
    var DS = document.getElementById("dropdown_supplier");

    var grn_no = 0;
    var grn_qty = 0;

    var begin, end;
    $scope.filteredTodos = [],
        $scope.currentPage = 1,
        $scope.numPerPage = 10,
        $scope.maxSize = 5,
        $scope.itemNumber = 0;
    $scope.invoice_total_price = 0;
    $scope.invoice_total_price_gl = 0;
    $scope.data_set = {form_data: [], common: [], selected: {}, serial: []};
    $scope.modelcode = '';
    var serial_array = {};
    $scope.serial_display = [];
    $scope.bulk_type = '';
    $scope.is_added_serial = 0;
    $scope.ref_image_name='';
    $scope.card_type = 'visa';

    // ------------------------ Add item Grid ---------------------------------------
    $scope.$watch('currentPage + numPerPage', function () {
        $scope.paging();
        $scope.indexStartNo = begin;
        save_data = $scope.data_set;
    });
    $scope.removeItem = function (model_id,index) {

        if (confirm("Delete This Item?") == true) {
            //alert($scope.data_set.form_data[index+$scope.indexStartNo]['quantity']);
            grn_qty = grn_qty - parseInt($scope.data_set.form_data[index + $scope.indexStartNo]['quantity'])
            $scope.data_set.form_data.splice(index + $scope.indexStartNo, 1);

            serial_array[model_id].splice(0);
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
        // console.log("Saving contact");
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

    //Serial Number Load()
    $scope.serial_popup = function (data_index, serial_item_name, model_id) {
        //console.log( serial_array);
        $scope.serial_display = [];
        $scope.view_serial_model_name = serial_item_name;
        $scope.view_serial_data_index = data_index;
        $scope.view_serial_data_model_id = model_id;
        $scope.serial_display = serial_array[model_id];
    };
    //Serial Number Remove()
    $scope.serial_remove = function (model_id, index) {
        if (confirm("Delete This Serial?") == true) {

            //alert(index);
            if (index > -1) {
                serial_array[model_id].splice(index, 1);

            }

            console.log(serial_array);

            if (serial_array[model_id].length > 0) {
                $scope.data_set.form_data[$scope.view_serial_data_index]['quantity'] = serial_array[model_id].length;
                grn_qty = grn_qty - 1;
            } else {
                //$scope.removeItem($scope.view_serial_data_index);
                delete serial_array[model_id];
                $scope.data_set.form_data.splice($scope.view_serial_data_index, 1);
                $scope.paging();
                grn_qty = grn_qty - 1;

                $('#serialModal').modal('toggle');
            }
            $scope.serial_display = [];
            $scope.serial_display = serial_array[model_id];
        }
    };

    //--------------------- end add item Grid -----------------------------------------


    //-------------------- Click Button Event -------------------------------------------
    $scope.add_to_grid = function () {
        //Change this array according to the page
//alert(typeof ($scope.serial_array_search(serial_array, '232', '123456')));

        if ($scope.bulk_type == 3 || $scope.bulk_type == 4) {

            $scope.item_serialno=0;
        }

        if (search_multiple_array(serial_array, $scope.item_serialno) != 0 ) {

            console.log(serial_array);
            /// alert(serial_array[232].length);
            // alert("if");
            $scope.paging();
            $scope.currentPage = Math.ceil($scope.data_set.form_data.length / $scope.numPerPage);
            //$scope.bulk_type = '';
            //$scope.clear_form();
            $scope.item_serialno="";
            alert("This Serial Has Already Added To Data Grid");
        }
        else {

            $.ajax({
                url: base_url + "Inventory_load/item_serial_search",
                type: "POST",
                dataType: 'json',
                data: {"serial": $scope.item_serialno},
                success: function (response) {
                    //console.log(response['manufactures']);
                    $scope.$apply(function () //to reset dropdown
                    {

                    // alert(response[0]['count']);
                    if (response[0]['count'] == 0) {

                        if (typeof ($scope.array_search($scope.data_set.form_data, 'model_code', $scope.model_code)) != 'undefined') {

                            grn_qty = parseInt(grn_qty) + parseInt($scope.qty);

                            $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'model_code', $scope.model_code)].quantity += $scope.qty;


                        }
                        else {
                            grn_qty = parseInt(grn_qty) + parseInt($scope.qty);


                            $scope.data_set.form_data.push({
                                id: $scope.itemNumber++,
                                model_code: $scope.model_code,
                                // serial_code: serial_array[$scope.model.model_id],
                                Receipt_no: $scope.Receipt_no,
                                manufacture: DM.options[DM.selectedIndex].text,
                                M_ID: DM.options[DM.selectedIndex].value,
                                model: $scope.model.model_name,
                                MO_ID: $scope.model.model_id,
                                cost: $scope.itemcost,
                                retail_price: $scope.retailprice,
                                quantity: $scope.qty,
                                bulk_type: $scope.bulk_type,
                                supplier: DS.options[DS.selectedIndex].text

                            });

                        }

                        if ($scope.bulk_type == 1 || $scope.bulk_type == 2) {

                            $scope.qty = 1;
                            //  alert($scope.item_serialno);
                            serial_array_add($scope.model.model_id, $scope.item_serialno);

                        }


                        console.log(serial_array);
                        /// alert(serial_array[232].length);

                        $scope.invoice_total_price = parseInt($scope.invoice_total_price) + (parseInt($scope.itemcost) * parseInt($scope.qty));
                      //  $scope.invoice_total_price_gl = parseInt($scope.invoice_total_price_gl) + parseInt($scope.total_price);

                        $scope.paging();
                        $scope.currentPage = Math.ceil($scope.data_set.form_data.length / $scope.numPerPage);
                        //$scope.bulk_type = '';
                        $scope.item_serialno='';
                        //$scope.clear_form();
                    }
                    else {


                        console.log(serial_array);
                        /// alert(serial_array[232].length);
                        $scope.paging();
                        $scope.currentPage = Math.ceil($scope.data_set.form_data.length / $scope.numPerPage);
                        //$scope.bulk_type = '';
                        $scope.item_serialno='';
                        //$scope.clear_form();
                        alert('This Serial Has Already Added To Database');
                    }

                });
                    // console.log($scope.set_types_array);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(xhr.responseText);

                    alert(thrownError + " Loading Dropdown Failed");
                    $scope.is_added_serial = 0;

                }

            });
            // alert($scope.is_added_serial);


        }

    };


    $scope.click_cancel = function () {
        if ($scope.data_set.form_data.length > 0) {
            var r = confirm("Discard Current GRN?");
            if (r == true) {
                var currentPageTemplate = $route.current.templateUrl;
                $templateCache.remove(currentPageTemplate);
                $route.reload();
            } else {
                //txt = "You pressed Cancel!";
            }

        }else {
            var currentPageTemplate = $route.current.templateUrl;
            $templateCache.remove(currentPageTemplate);
            $route.reload();
        }
        //location.reload();
        /*$scope.grid_refresh(false);
        $scope.showme = false;

        if ($scope.data_set.form_data.length <= 0) {

            $scope.data_widget = false;
            $scope.clear_form();
            grn_qty = 0;


        }*/
    };
    $scope.add_button_click = function () {
        $scope.enable_loading = false;
        $scope.showme = true;
        $scope.module_datatables_show=false;
        //Clear txt Boxes

        $scope.clear_form();
        $scope.GRN_Reference_span = '';
        $scope.GRN_Supplier_span = '';
        $scope.model_code = '';
        $scope.item_serialno = '';

        $scope.Receipt_no = '';
        $scope.supplier = '';

        $scope.manufacture = '';

        $(".fileinput").fileinput('clear');

        $.ajax({
            url: base_url+"Inventory_load/add_button",
            type: "POST",
            dataType: 'json',
            data: {"button_location": 'GRN'},
            success: function (response) {

                $scope.$apply(function () //to reset dropdown
                {
                    $scope.manufactures = response['manufactures'];
                    $scope.models = response['models'];
                    $scope.models_old = response['models'];
                    $scope.suppliers = response['suppliers'];


                });
console.log(response);
            }

        });

        // this.bigMessage = grn_no;

    };
    $scope.confirm_button_click = function (image_upload) {
        var is_call = $scope.Receipt_no;

        $.ajax({
            url: base_url + "Inventory_load/get_grn_invoice_no",
            type: "POST",
            dataType: 'json',
            data: {"Invoice_no": is_call},
            success: function (response) {
                // console.log(response);

                $scope.$apply(function () //to reset dropdown
                {
                    check_invoice = response;

                    if (check_invoice[0]['check_invoice'] != 0) {
                        $scope.data_widget = false;
                        alert('This Invoice Already Added ');
                    } else {

                        if(image_upload===true){
                            $scope.image_upload_base64($scope.base64_img_code);

                        }else {
                            $scope.data_widget = true;

                            $scope.GRN_Reference_span = $scope.Receipt_no;
                            $scope.GRN_Supplier_span = DS.options[DS.selectedIndex].text;
                        }
                    }

                });

            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Get Invoice No Failed");
                $scope.load_complete = true;

            }

        });


    };

    //Payment Popup-----------------------------------------------------

    $scope.note_string = 'Supplier';
    $scope.card_type = 'visa';

    $('#payment_modal').on('show.bs.modal', function () {
        $scope.payment_popup();
    });

    $scope.payment_clear = function () {
        $scope.invoice_total_price = 0;
        $scope.invoice_discount_price = 0;
        $scope.invoice_cash_price = 0;
        $scope.invoice_card_price = 0;
        $scope.invoice_cheque_price = 0;
        $scope.invoice_credit_price = 0;
        $scope.txt_cheque_number = '';
        $scope.txt_discount_amount = '';
        $scope.txt_cash_amount = '';
        $scope.txt_card_amount = '';
        $scope.txt_cheque_amount = '';
        $scope.txt_credit_amount = '';
        $scope.popup_note_type = '';
        $scope.popup_note_id = '';
        $scope.popup_note_no = '';
    };

    $scope.payment_popup = function (data) {

        $('#toggle-two').bootstrapToggle('off');
        $('#toggle-two').bootstrapToggle('disable');
        $scope.$apply(function () //to reset dropdown
        {

            //$scope.invoice_total_price = data['total_value'];
            //$scope.repair_id = data['repair_id'];
            //$scope.job_number = data['job_number'];
            //$scope.state = data['status'];

            $scope.txt_discount_amount = '';
            $scope.txt_cash_amount = '';
            $scope.txt_card_amount = '';
            $scope.txt_cheque_amount = '';
            $scope.txt_credit_amount = '';

            $scope.discount_view = false;
            $scope.card_view = false;
            $scope.cheque_view = false;
            $scope.credit_view = false;

            $scope.hide_discount = true;
            $scope.hide_credit = false;
            $scope.show_save_print=false;
            $scope.show_person_name = true;
            $scope.popup_person_id = DS.options[DS.selectedIndex].value;
            $scope.person_name_display=DS.options[DS.selectedIndex].text;
            $scope.invoice_total_price=$scope.payment_total_calculate();

        });

        //$('#payment_modal').modal('show');
    };


    $scope.save_data_grid = function (is_print,is_pending) {
        if($scope.ref_image_name=='')$scope.ref_image_name=null;
        $scope.payments={"Cash": $scope.invoice_cash_price,"Card": $scope.invoice_card_price,"Cheque":$scope.invoice_cheque_price,"Credit":$scope.invoice_credit_price};
        var is_payment=0;
        if(is_pending)
            is_payment=1;
        else
            is_payment=0;
        $scope.enable_loading = true;
        $scope.data_set.serial = serial_array;
        $scope.cheque_date='2016-06-04';
        $scope.credit_date='2016-06-04';
        $scope.data_set.common.push({
            GRN_qty: grn_qty,
            GRN_No: grn_no,
            user_id: user_id,
            image_name: $scope.ref_image_name,
            company_id: company_id,
            supplier_id: DS.options[DS.selectedIndex].value,
            payment_flag: is_payment,
            payment_methode:$scope.payments,
            discount: $scope.invoice_discount_price,
            cheque_number: $scope.txt_cheque_number,
            cheque_date: $scope.cheque_date,
            credit_date: $scope.credit_date,
            card_type:$scope.card_type,
            Receipt_no: $scope.Receipt_no

        });

        $.ajax({
            url: base_url + "inventory_save/grn_save",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                // console.log(response);
                if (response == 1) {
                    alert("GRN Inserted Successfully");

                    $scope.$apply(function () //to reset dropdown
                    {
                       /* $scope.data_set = [];
                        $scope.data_set = {form_data: [], common: [], selected: {}, serial: []};
                        serial_array = {};



                        $scope.data_widget = false;
                        $scope.clear_form();
                        $scope.clear_payment();
                        grn_qty = 0;

                        $scope.grid_refresh(false);
                        $scope.showme = false;*/

                        var currentPageTemplate = $route.current.templateUrl;
                        $templateCache.remove(currentPageTemplate);
                        $route.reload();

                    });

                    // console.log($scope.data_set);
                } else {
                    alert("Save Failed");
                    var currentPageTemplate = $route.current.templateUrl;
                    $templateCache.remove(currentPageTemplate);
                    $route.reload();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Save  Failed");
                $scope.load_complete = true;

            }
        });
    };


    //-------------------- end Click Button Event -------------------------------------------


    //--------------------- On load Ajax Call  ---------------------------------------------------------

    $scope.get_dropdowns = function () {


        $.ajax({
           url: base_url + "Inventory_load/get_dropdowns",
            type: "POST",
            dataType: 'json',
            //data: {"item_typeID": $scope.type},
            success: function (response) {
                //console.log(response['manufactures']);
                $scope.$apply(function () //to reset dropdown
                {

                    $scope.manufactures = response['manufactures'];
                    $scope.models = response['models'];
                    $scope.models_old = response['models'];


                });
                // console.log($scope.set_types_array);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Loading Dropdown Failed");
                $scope.load_complete = true;

            }

        });
    };

    $scope.payment_methods = function () {


        $scope.person_name_display=DS.options[DS.selectedIndex].text;
        $scope.invoice_total_price=$scope.payment_total_calculate();

    };

    $scope.payment_total_calculate = function () {

        // alert(Object.keys($scope.data_set.form_data).length);

        var total_price=0;
        for (i = 0; i < Object.keys($scope.data_set.form_data).length; i++) {
            total_price+=parseInt($scope.data_set.form_data[i]['quantity'])*parseInt($scope.data_set.form_data[i]['cost']);
        }
        return total_price;
    };

    //$scope.load_complete = true;
    //---------------------  End On load Ajax Call  ---------------------------------------------------------

    //Popup Grid Load Function
    $scope.popup_grid_refresh = function (data_id, item_no, reference_number, person_name, ref_date) {
        //alert(id);
        //alert(item_no);
        $.ajax({
            url: base_url + "Inventory_load/popup_data",
            type: "POST",
            dataType: 'json',
            data: //"data_id=" +data_id+""
            '{"data_id":' + data_id + ', "note_type_id":5}'
            ,
            success: function (response) {
                //console.log(response);
                $scope.selected_note_image='';
                $scope.total_note_price = 0;
                $scope.total_note_qty = 0;
                $scope.$apply(function () //to reset popup
                {
                    $scope.print_array = response;

                    var string_data =item_no.split("~");

                    $scope.show_note_image=false;

                    $scope.popup_note_no = string_data[0];
                    $scope.popup_note_ref = reference_number;
                    $scope.popup_note_person = person_name;
                    $scope.popup_note_date = ref_date;
                   if(string_data[1]=='none')$scope.selected_note_image=''; else $scope.selected_note_image = string_data[1];

                    infoTable.fnClearTable();
                    for (var i = 0; i < response.length; i++) {
                        //Test Sample ONLY
                        infoTable.fnAddData([i + 1,
                            response[i]['manufacture_name'] + ' ' + response[i]['model_name'],
                            response[i]['model_code'],
                            response[i]['buying_price'],
                            response[i]['inventory_item_qty'],
                            //response[i]['item_prices'],
                            response[i]['item_costs'],
                            response[i]['manufacture_name']
                        ]);
                        $scope.total_note_qty += parseFloat(response[i]['inventory_item_qty']);
                        $scope.total_note_price += parseFloat(response[i]['item_costs']);
                    }

                    Math.abs($scope.total_note_price).toFixed(2);
                    //$scope.load_complete = true;
                });
                //console.log($scope.db_data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Popup Loading  Failed");
                $scope.load_complete = true;

            }

        });
        //console.log(pop_up_data_array);
    };

    $scope.show_note_image_func = function () {

        if($scope.show_note_image ==true ){
            $scope.show_note_image=false;
        }else {
            $scope.show_note_image=true;
        }

    };

    //--------------------- Search events --------------------------------------------------------------
    $scope.getModel = function (manufactureID) {

        // ajax call
        $scope.clear_form();
        $.ajax({
            url: base_url + "Inventory_load/get_model",
            type: "POST",
            dataType: 'json',
            data: {"manufactureID": manufactureID},
            success: function (response) {

                $scope.$apply(function () //to reset dropdown
                {
                    // console.log(response);
                    $scope.models = response.Model;
                })
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Model Loading  Failed");
                $scope.load_complete = true;

            }

        });

    };


    $scope.get_code = function () {
        var manufacture_element = document.getElementById('dropdown_manifacture');
        // ajax call
        //alert($scope.model.model_id);
        $.ajax({
            url: base_url + "Inventory_load/get_code",
            type: "POST",
            dataType: 'json',
            data: {"model": $scope.model.model_id},
            success: function (response) {

                $scope.$apply(function () //to reset dropdown
                {

                    //console.log(response);
                    $scope.model_code = response[0]['model_code'];
                    $scope.bulk_type = response[0]['model_qty_type'];
                    $scope.modelcode = response[0]['model_code'];
                    $scope.itemcost = response[0]['model_cost_price'];
                    $scope.qty_type = response[0]['model_qty_type'];
                    if ($scope.qty_type == 1) $scope.qty = 1;
                    else if ($scope.qty_type == 2) $scope.qty =  parseInt(response[0]['model_bulk_size']);
                    else $scope.qty = '';
                    $scope.retailprice = response[0]['model_retail_price'];
                    $scope.manufacture = $scope.manufactures[$scope.array_search($scope.manufactures, 'manufacture_id', response[0]['manufacture_id'])];
                    $scope.model = $scope.models[$scope.array_search($scope.models, 'model_id', response[0]['model_id'])];

                })
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + "CODE Loading  Failed");
                $scope.load_complete = true;

            }

        });

    };
    $scope.get_item_code_search = function () {
        var item_code = $scope.model_code;
        var data_count = 0;
        // $scope.models=$scope.models_old;
        //alert($scope.model.model_id) ;
        $.ajax({
            url: base_url + "Inventory_load/get_item_code_search",
            type: "POST",
            dataType: 'json',
            data: {"Item_code": item_code},
            success: function (response) {
                // console.log(response);
                // alert(response.item_typeID[0]['model_id']-1);
                data_count = response.item_typeID.length;
                $scope.$apply(function () //to reset dropdown
                {
                    if (data_count == 1) {



                        //$scope.serialno = response.item_typeID[0]['model_code'];
                        $scope.modelcode = response.item_typeID[0]['model_code']; //Generates an Error
                        $scope.bulk_type = response.item_typeID[0]['model_qty_type'];
                        $scope.itemcost = response.item_typeID[0]['model_cost_price'];
                        $scope.qty_type = response.item_typeID[0]['model_qty_type'];
                        if ($scope.qty_type == 1) $scope.qty = 1;
                        else if ($scope.qty_type == 2) $scope.qty =  parseInt(response.item_typeID[0]['model_bulk_size']);
                        else $scope.qty = '';

                        $scope.retailprice = response.item_typeID[0]['model_retail_price'];
                        $scope.manufacture = $scope.manufactures[$scope.array_search($scope.manufactures, 'manufacture_id', response.item_typeID[0]['manufacture_id'])];
                        $scope.model = $scope.models[$scope.array_search($scope.models, 'model_id', response.item_typeID[0]['model_id'])];


                    } else {

                        $scope.model_code = '';
                        //$scope.modelcode = '';
                        $scope.bulk_type = '';
                        $scope.manufacture = $scope.manufactures[''];
                        $scope.model = $scope.models[''];
                        $scope.itemcost = 0;
                        $scope.retailprice = 0;
                    }


                });
                //console.log($scope.db_data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Code search  Failed");
                $scope.load_complete = true;

            }

        });
    };
    //--------------------- End Search events --------------------------------------------------------------


    //--------------------- Common functions and Others --------------------------------------------
    $scope.array_search = function (array, index, string) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][index] === string) {
                return i;
            }

        }
    };

    $scope.serial_array_search = function (model_id, string) {
        if (typeof serial_array[model_id] != "undefined") {

            for (var i = 0; i < serial_array[model_id].length; i++) {

                if (serial_array[model_id][i] === string) {
                    return i;
                }

            }
        } else {
            return undefined;
        }
    };

    function serial_array_add(model_id, serial_no) {

        if (typeof serial_array[model_id] != "undefined") {
            serial_array[model_id].push(serial_no);
        }
        else {
            serial_array[model_id] = [];
            serial_array[model_id].push(serial_no);
        }
    }

    function search_multiple_array(asso_array,find) {

        var result;
        for (var key in asso_array) {

            for (var i = 0; asso_array[key].length > i; ++i) {
                //console.log( asso_array[key].length);
                if (asso_array[key][i] === find) {
                    result = 1;
                    break;
                }
            }
        }

        if (typeof result != "undefined"){
            return result;
        }
        else return 0;

    }

    //Disable Reload if data is present
    window.onbeforeunload = function () {
        if ($scope.data_set.form_data.length > 0) {
            return "Are you sure you want to leave?";
        }
    };
    $scope.clear_form = function () {
        //$scope.Receipt_no = '';
        //$scope.supplier = '';
        //$scope.manufacture = ''; //Manifacture and model clearing is disabled for ease
        $scope.model = '';
        $scope.serialno = '';
        $scope.qty = '';
        $scope.itemcost = '';
        $scope.retailprice = '';
        $scope.qty_type='';
        $scope.serial_display='';

    };

    $scope.clear_payment = function () {
       $scope.customer='';
       $scope.txt_cash_amount='';
       $scope.txt_discount_amount='';
       $scope.txt_card_amount='';
       $scope.txt_cheque_amount='';
       $scope.txt_cheque_number='';
       $scope.cheque_date='';
       $scope.credit_date='';
       $scope.txt_credit_amount='';


       $scope.invoice_total_price=0;
       $scope.invoice_discount_price=0;
       $scope.invoice_net_total_price=0;
       $scope.invoice_cash_price=0;



    };
    //--------------------- End  Common functions and Others --------------------------------------------

    //Image Base 64 Upload handler
    function EL(id) { return document.getElementById(id); } // Get el by ID helper function
    function readFile() {
        if (this.files && this.files[0]) {
            var FR= new FileReader();
            FR.onload = function(e) {
                //EL("img").src       = e.target.result;
                //EL("b64").innerHTML = e.target.result;
                $scope.$apply(function () //to reset dropdown
                {
                    $scope.base64_img_code = e.target.result;
                    //alert($scope.base64_img_code);
                    //EL("img").src = $scope.base64_img_code;
                });
            };
            FR.readAsDataURL( this.files[0] );
        }
    }
    EL("raw_img").addEventListener("change", readFile, false);

    $("#clear_file_input").click(function(){
        EL("raw_img").value = "";
        $scope.$apply(function () //to reset dropdown
        {
            delete $scope.base64_img_code;
        });
    });
    //Image Base 64 Upload handler END
    $scope.image_upload_base64 = function (base64_img_code) {

        $scope.base64_image=base64_img_code;
        $scope.is_upload=true;

        $.ajax({
            url: base_url + "inventory_save/base64_image_upload",
            type: "POST",
            //dataType: 'json',
            data: JSON.stringify($scope.base64_image),
            success: function (response) {

                if (response != 0) {

                    //alert(response);
                 $scope.$apply(function () //to reset dropdown
                 {
                     delete $scope.base64_img_code;
                     $scope.data_widget = true;
                     $scope.is_upload=false;
                     $scope.ref_image_name=response;
                     $scope.GRN_Reference_span = $scope.Receipt_no;
                     $scope.GRN_Supplier_span = DS.options[DS.selectedIndex].text;
                 });
                    alert("Image Uploaded");
                    return 1;
                 // console.log($scope.data_set);
                 } else{
                    alert("Upload Failed");
                    $scope.is_upload=false;
                }

           },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError);
                //$scope.load_complete = true;

            }
        });
    };

    //catch Serial no Enter key press
    $("#item_serialno").keypress(function(e) {
        if(e.which == 13) {
            if ($("#item_serialno").val() != ""){
                $scope.add_to_grid();
            }
            // $("#go").click();
        }
    });

   /* //Date range picker
    $("#cheque_date").text(server_date);
    $('#date_picker').daterangepicker({
        "singleDatePicker": true,
        "startDate": server_date_machine_code //"12/12/2015",
        //"endDate": "12/18/2015"
    }, function (start, end, label) {
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
        $("#cheque_date").text(start.format('YYYY-MM-DD'));
    });

    //Date range picker Credit
    $("#credit_date").text(server_date);
    $('#credit_date_picker').daterangepicker({
        "singleDatePicker": true,
        "startDate": server_date_machine_code //"12/12/2015",
        //"endDate": "12/18/2015"
    }, function (start, end, label) {
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
        $("#credit_date").text(start.format('YYYY-MM-DD'));
    });*/

    // Item List From database
    //Defaults
    $scope.start_date=moment().subtract(29, 'days'), moment();
    $scope.end_date=moment().format('YYYY-MM-DD');
    $scope.sub_label='Last 30 Days';

    //Date range as a button
    $('#daterange-btn').daterangepicker(
        {
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            startDate: moment().subtract(29, 'days'),//Set Default Range
            endDate: moment()
        },
        function (start, end,label) {
            //$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            //console.log(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
            $scope.$apply(function () //to reset dropdown
            {
                $scope.start_date=start.format('YYYY-MM-DD');
                $scope.end_date=end.format('YYYY-MM-DD');
                $scope.sub_label=label;
                $scope.load_complete=datatables_service.grid_refresh($scope.start_date,$scope.end_date,false);
            });

        }
    );

    $scope.grid_refresh = function (init) {
        $scope.module_datatables_show=true;
        $scope.load_complete=datatables_service.grid_refresh($scope.start_date,$scope.end_date,init);


    };
    $scope.grid_refresh(true);




});