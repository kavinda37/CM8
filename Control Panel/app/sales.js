biziApp.controller('salesController', function ($scope, $route,$templateCache,$sce,datatables_service) {
    // create a message to display in our view
    //$(window).trigger('resize');

    var save_data = [];
    var DM = document.getElementById("dropdown_manifacture");//

    var invoice_char = 'inv';
    var invoice_char_length = 3;
    //var serials_list ={};
    var serial_array = {};
    var warranty_array = {};
    var model_serial_array = {};
    $scope.serial_display = [];

    var begin, end;
    $scope.filteredTodos = [];
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.itemNumber = 0;
    $scope.data_set = {form_data: [], serials: [], common: [], selected: {},warrenty_period:[]};
    $scope.models_old = [];
    $scope.unit_price_span_gl = 0;
    $scope.TOT_qty_span_gl = 0;
    $scope.invoice_total_price = 0;
    $scope.invoice_total_price_gl = 0;
    $scope.invoice_qty = 0;
    $scope.available_qty = 0;
    $scope.TOT_qty_span = 0;
    $scope.cost_price = 0;
    $scope.serial_value = '';
    $scope.manufacture_name_variable = '';
    $scope.manufacture_id_variable = '';
    $scope.model_name_variable = '';
    $scope.model_id_variable = '';
    $scope.cost_price_variable = 0;
    $scope.bulk_type = '';
    $scope.available_qty = 0;
    $scope.invoice_discount_price=0;
    $scope.warrenty_in_week = 0;
    $scope.invoice_cash_price = 0;
    $scope.invoice_card_price = 0;
    $scope.invoice_cheque_price = 0;
    $scope.invoice_credit_price = 0;
    $scope.txt_cheque_number='';
    //$scope.is_fast_add=false;

    $scope.card_type = 'visa';





    $scope.data = {
        warranty_times: [
            {ID: '',Name: 'None'},
            {ID: 'Y',Name: 'Year(s)'},
            {ID: 'M',Name: 'Month(s)'},
            {ID: 'W',Name: 'Week(s)'},
            {ID: -1, Name: 'Lifetime'}
        ],
        time_period: {ID: '',Name: 'None'} //This sets the default value of the select in the uiID: '', name: 'Option C'
    };
    $scope.serial_data = {
        serials: [],
        select_serial: {} //This sets the default value of the select in the uiID: '', name: 'Option C'
    };



    //fast add function
    $scope.enable_fast_add = function (state) {
        if (state == 'ng_click') {
            if ($scope.is_fast_add == true) {
                fast_add = false;
                $scope.is_fast_add = false;
            } else {
                fast_add = true;
                $scope.is_fast_add = true;
            }

        } else {
            fast_add = true;
            $scope.is_fast_add = true;
        }

    };
    if (fast_add == true)$scope.enable_fast_add();

    $scope.add_to_grid = function () {
        $scope.set_time_period();

        //Change this array according to the page
        if ($scope.item_name != "") {
//
            if ($scope.bulk_type == 1 || $scope.bulk_type == 2) {

                $scope.req_qty = 1;

            }
            // alert($scope.bulk_type);
            if (typeof ($scope.array_search($scope.data_set.form_data, 'item_code', $scope.model_code_variable)) != 'undefined') {


                $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', $scope.model_code_variable)].qty += $scope.req_qty;
                // serial_array_add_single($scope.item_serial);
                /*Moved to Botoom as a single if
                 if($scope.bulk_type==1 || $scope.bulk_type==2) {
                 //serials_list.push($scope.item_serial);
                 serial_array_add($scope.model.model_id,$scope.item_serial);

                 }*/


            } else {


                if (typeof($scope.model.model_name) != 'undefined') {

                    $scope.model_code_variable = $scope.item_code;
                    $scope.manufacture_name_variable = $scope.manufacture.manufacture_name;
                    $scope.manufacture_id_variable = $scope.manufacture.manufacture_id;
                    $scope.model_name_variable = $scope.model.model_name;
                    $scope.model_id_variable = $scope.model.model_id;
                    $scope.cost_price_variable = $scope.cost_price;

                }


                //serial_array_add_single($scope.item_serial);serials
                /*Moved to Botoom as a single if
                 if($scope.bulk_type==1 || $scope.bulk_type==2) {
                 // serials_list.push($scope.item_serial);
                 serial_array_add($scope.model.model_id,$scope.item_serial);
                 }*/

                $scope.data_set.form_data.push({
                    id: $scope.itemNumber++,
                    qty: $scope.req_qty,
                    item_code: $scope.model_code_variable,
                    manufacture: $scope.manufacture_name_variable,
                    M_ID: $scope.manufacture_id_variable,
                    model: $scope.model_name_variable,
                    MO_ID: $scope.model_id_variable,
                    price: $scope.retail_price,
                    retail_price: $scope.retail_price,
                    cost_price: $scope.cost_price_variable,
                    bulk_type: $scope.bulk_type,

                    //serial: serials_list
                    serial: serial_array,
                    warrenty_period: warranty_array
                });

                console.log($scope.data_set);

            }

            if ($scope.item_code_type !=10 && ($scope.bulk_type == 1 || $scope.bulk_type == 2) ) {
                // serials_list.push($scope.item_serial);

                $scope.req_qty = 1;
                serial_array_add($scope.model_id_variable, $scope.item_serial);
                warranty_array_add($scope.item_serial, $scope.warrenty_in_week);
                //warrenty_period: $scope.warrenty_in_week,
               // alert($scope.warrenty_in_week);
            }


            $scope.invoice_total_price = parseInt($scope.invoice_total_price) + (parseInt($scope.retail_price) * parseInt($scope.req_qty));
            $scope.invoice_total_price_gl = parseInt($scope.invoice_total_price_gl) + parseInt($scope.total_price);
            $scope.invoice_qty = parseInt($scope.invoice_qty) + parseInt($scope.req_qty);
            $scope.paging();
            $scope.currentPage = Math.ceil($scope.data_set.form_data.length / $scope.numPerPage);
            console.log($scope.data_set);

            // $scope.model_code_variable = '';
            $scope.manufacture_name_variable = '';
            $scope.manufacture_id_variable = '';
            $scope.model_name_variable = '';
            $scope.model_id_variable = '';
            $scope.cost_price_variable = 0;
            $scope.item_name = '';
            $scope.retail_price = '';
            $scope.item_serial = '';
            $scope.bulk_type = '';
            $scope.req_qty = '';
            $scope.company_warrenty = 0;
            $scope.data.time_period={'ID':'','Name':'None'};
          //  var element = document.getElementById('time_period');
         //   element.value = '';
            $scope.warrenty_in_week = 0;

            $scope.warrenty_show=false;

            // $scope.clear_form();
        }
    };


    $scope.$watch('currentPage + numPerPage', function () {
        $scope.paging();
        $scope.indexStartNo = begin;
        save_data = $scope.data_set;
    });

    $scope.delete_total_val = 0;
    $scope.removeItem = function (index) {
        //console.log($scope.data_set);

        if (confirm("Delete This Item?") == true) {
            $scope.delete_price_val = $scope.data_set.form_data[index + $scope.indexStartNo]['price'];
            $scope.delete_qty_val = $scope.data_set.form_data[index + $scope.indexStartNo]['qty'];

            $scope.invoice_qty = $scope.invoice_qty - parseInt($scope.data_set.form_data[index + $scope.indexStartNo]['qty']);
            if ($scope.data_set.form_data[index + $scope.indexStartNo]['bulk_type'] == "1" || $scope.data_set.form_data[index + $scope.indexStartNo]['bulk_type'] == "2") {
                // alert("serial");

                var obj = serial_array;
                delete obj[$scope.data_set.form_data[index + $scope.indexStartNo]['MO_ID']];
                $scope.data_set.form_data.splice(index + $scope.indexStartNo, 1);
            }
            else {
                //  alert(" not serial");
                $scope.data_set.form_data.splice(index + $scope.indexStartNo, 1);
            }


            // console.log($scope.data_set);
            // $scope.clear_form();


            $scope.invoice_total_price = parseInt($scope.invoice_total_price) - (parseInt($scope.delete_price_val) * parseInt($scope.delete_qty_val));
            $scope.invoice_total_price_gl = parseInt($scope.invoice_total_price_gl) - (parseInt($scope.delete_price_val) * parseInt($scope.delete_qty_val));


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

    //Serial Number Load()
    $scope.serial_popup = function (data_index, serial_item_name, model_id) {
        //console.log(serial_array);
            $scope.is_add_button=false;

            $scope.serial_display = [];
            $scope.view_serial_model_name = serial_item_name;
            $scope.view_serial_data_index = data_index;
            $scope.view_serial_data_model_id = model_id;
            $scope.serial_display = serial_array[model_id];

    };

    //Serial Number add to grid()
    $scope.serial_add_to_grid = function (serial_no) {

        if($scope.is_add_button==true){
            $('#serialModal').modal('hide'); //fill $scope.serial_display array to show data on popup
            $scope.set_time_period();
            serial_array_add($scope.view_serial_data_model_id, serial_no);
            warranty_array_add($scope.item_serial, $scope.warrenty_in_week);

           
           // $scope.add_to_grid();
        }
    };

    //Serial Number Remove()
    $scope.delete_total_val = 0;
    $scope.serial_remove = function (model_id, index) {
        if (confirm("Delete This Serial?") == true) {
            //$scope.delete_price_val = $scope.data_set.form_data[index + $scope.indexStartNo]['retail_price'];
            //$scope.delete_qty_val = $scope.data_set.form_data[index + $scope.indexStartNo]['qty'];

            if (typeof ($scope.array_search($scope.data_set.form_data, 'MO_ID', model_id)) != 'undefined') {
                $scope.delete_price_val = $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'MO_ID', model_id)]['retail_price'];
                $scope.invoice_qty = $scope.invoice_qty - 1;
            }
            //alert(index);
            if (index > -1) {
                serial_array[model_id].splice(index, 1);

            }

            console.log(serial_array);

            if (serial_array[model_id].length > 0) {
                $scope.data_set.form_data[$scope.view_serial_data_index]['qty'] = serial_array[model_id].length;

            } else {
                //$scope.removeItem($scope.view_serial_data_index);
                delete serial_array[model_id];
                $scope.data_set.form_data.splice($scope.view_serial_data_index, 1);
                $scope.paging();


                $('#serialModal').modal('toggle');
            }


            $scope.invoice_total_price = parseInt($scope.invoice_total_price) - (parseInt($scope.delete_price_val) * 1);
            $scope.invoice_total_price_gl = parseInt($scope.invoice_total_price_gl) - (parseInt($scope.delete_price_val) * 1);

            $scope.serial_display = [];
            $scope.serial_display = serial_array[model_id];
        }
    };

    $scope.click_cancel = function () {

        if ($scope.data_set.form_data.length > 0) {
            var r = confirm("Discard Current Invoice?");
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

        /* $scope.grid_refresh();
         $scope.showme = false;

         if ($scope.data_set.form_data.length <= 0)
         {

         $scope.data_widget = false;
         $scope.clear_form();
         $scope.unit_price_span_gl = 0;
         $scope.TOT_qty_span_gl = 0;
         $scope.GIN_total_price = 0;
         $scope.GIN_total_price_gl = 0;
         $scope.GIN_qty = 0;
         $scope.available_qty = 0;
         $scope.TOT_qty_span = 0;
         $scope.delete_total_val = 0;


         }*/

    };

    //Payment Popup-----------------------------------------------------

    $scope.note_string = 'Person';
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

        $('#toggle-two').bootstrapToggle('on');
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

            $scope.hide_discount = false;
            $scope.hide_credit = false;
            $scope.show_save_print=true;
            //$scope.show_person_name = true;
            //$scope.popup_person_id = data['person_id'];
            //$scope.person_name_display = data['person_code'] + '-' + data['person_name'];
        });

        //$('#payment_modal').modal('show');
    };

    $scope.save_data_grid = function (is_print,is_pending) {
        $scope.payments={"Cash": $scope.invoice_cash_price,"Card": $scope.invoice_card_price,"Cheque":$scope.invoice_cheque_price,"Credit":$scope.invoice_credit_price};
       // alert(is_pending);


        var is_payment=0;
        if(is_pending)
            is_payment=1;
        else
            is_payment=0;
        $scope.enable_loading = true;
        $scope.cheque_date='2016-06-04';
        $scope.credit_date='2016-06-04';
       //$scope.txt_cheque_number='123';
       //
        // $scope.data_set.serial=serials_list;
        $scope.data_set.serial = serial_array;
        $scope.data_set.warrenty_period = warranty_array;
        $scope.data_set.common.push({
            invoice_no: $scope.INVOICE_no_span,
            Total_price: $scope.invoice_total_price,
            invoice_qty: $scope.invoice_qty,
            discount: $scope.invoice_discount_price,
            cheque_number: $scope.txt_cheque_number,
            payment_flag: is_payment,
            cheque_date: $scope.cheque_date,
            credit_date: $scope.credit_date,
            card_type:$scope.card_type,
            tax: 0,
            payment_methode:$scope.payments,

            company_id: company_id,
            customer: $scope.customer.person_id,
            customer_name: $scope.customer.customer_name,
            user_id: user_id,
            department_id: 1

        });

        console.log($scope.data_set);
        
        $.ajax({
            url: base_url + "inventory_save/pos_invoice_save",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                console.log(response);
                if (response['success'] == 1) {
                    alert("Data Inserted Successfully");



                    $scope.$apply(function () //to reset dropdown
                    {


                        if(is_print==true){
                            //alert('print');
                            $scope.popup_grid_refresh(
                                response['note_id'],
                                response['invoice_no']+'~'+$scope.invoice_discount_price,
                                current_users_name,
                                $scope.customer.customer_name,
                                moment().format('YYYY-MM-DD'));

                            $("#toPrint").printThis();
                        }

                        /*
                        $scope.data_set = [];
                        $scope.data_set = {form_data: [], serials: [], common: [], selected: {},warrenty_period:[]};
                        $scope.showme = false;
                        $scope.clear_form();
                        $scope.clear_value();

                        $scope.module_datatables_show=true;
                        $scope.load_complete=datatables_service.grid_refresh($scope.start_date,$scope.end_date,false);
                        */
                        var currentPageTemplate = $route.current.templateUrl;
                        $templateCache.remove(currentPageTemplate);
                        $route.reload();

                    });

                } else {
                    alert("Save Failed");
                    var currentPageTemplate = $route.current.templateUrl;
                    $templateCache.remove(currentPageTemplate);
                    $route.reload();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Save Failed");
                $scope.load_complete = false;

            }
        });
    };
    //----------------------------------------- dropdown load ---------------------------------------------------------
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
                    //  $scope.customers = response['customers'];
                });
                // console.log($scope.customers);
            }

        });
    };
    // $scope.get_dropdowns();

    $scope.find_click = function () {

        $scope.manufacture = "";
        $scope.model = "";
        $scope.item_code = '';
        $scope.unhide_models = true;
        $scope.get_dropdowns();
    };


    //Popup Grid Load Function
    var popup_data_table=null;
    $scope.popup_grid_refresh = function (data_id) {
        //alert(id);
        //alert(item_no);


        $.ajax({
            url:base_url+"Inventory_load/popup_data",
            type: "POST",
            dataType: 'json',
            data: //"data_id=" +data_id+""
            '{"data_id":' + data_id + ', "note_type_id":9}'
            ,
            success: function (response) {
                //console.log(response);
                $scope.total_note_price = 0;
                $scope.total_note_qty = 0;
                $scope.$apply(function () //to reset popup
                {


                    //var string_data =item_no.split("~");
                    var title_data=response['title'];

                    $scope.popup_note_no = title_data['number'];
                    $scope.popup_note_ref = title_data['reference'];
                    $scope.popup_note_person = title_data['person'];
                    $scope.popup_note_date = title_data['date'];
                    $scope.popup_discount= title_data['discount'];
                    $scope.total_note_price =  title_data['inv_total'];
                    $scope.absolute_payment =  title_data['absolute_payment'];
                    $scope.sub_total =  title_data['sub_total'];

                    if(popup_data_table== null) {
                        var array_column = [];
                        array_column['title'] = ['#', 'Item', 'Code', 'Retail', 'Units', 'Total'];
                        popup_data_table = datatables_service.init_data_table('#popup_data_grid', array_column, true, false);
                    }

                    var res_data;
                    if (typeof response['data'] !== 'undefined') {
                        res_data = response['data'];
                    } else res_data = 0;

                    $scope.print_array=[];

                    popup_data_table.fnClearTable();
                    for (var i = 0; i < res_data.length; i++) {
                        //Test Sample ONLY
                        popup_data_table.fnAddData(res_data[i],false);

                        $scope.print_array.push({
                            product_name: res_data[i][1],
                            model_code:res_data[i][2],
                            selling_price:res_data[i][3],
                            inventory_item_qty: res_data[i][4],
                            item_prices: res_data[i][5]
                        });



                        $scope.total_note_qty += parseFloat(res_data[i][6]);

                    }
                    if($scope.total_note_price==$scope.absolute_payment){
                        delete $scope.absolute_payment;
                    }
                    if($scope.popup_discount==0.00){
                        delete $scope.popup_discount;
                    }

                    popup_data_table.fnDraw();
                    Math.abs($scope.total_note_price).toFixed(2);
                    //$scope.load_complete = true;
                });
                //console.log($scope.db_data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Popup Loading  Failed");
                //$scope.load_complete = true;

            }

        });
        //console.log(pop_up_data_array);
    };

    $scope.add_button_click = function () {
        $scope.enable_loading = false;
        $scope.showme = true;
        $scope.module_datatables_show=false;

        // $scope.get_dropdowns();
         $scope.clear_form();
         $scope.clear_value();
        $scope.generate_invoce_no();
        //$scope.edit_mode_enabled = false;
        //  $scope.show_fields = false;
        //$scope.show_bulk = true;
        //Clear txt Boxes

        // this.bigMessage = grn_no;
        $scope.data_widget = "collapsed-box";
        $scope.GIN_invoice_span = "";
        // document.getElementById("GI_invoice_no").className = "form-control input-sm";
        $scope.GIN_invoice_date_span = "";
        $scope.GI_invoice_date = "";
        // document.getElementById("GI_invoice_date").className = "form-control input-sm";

    };
    $scope.generate_invoce_no = function () {
        $.ajax({
            url: base_url + "Inventory_load/generate_invoce_no",
            type: "POST",
            dataType: 'json',
            data: {"LENGTH": invoice_char_length},
            success: function (response) {
                console.log(response);

                $scope.$apply(function () //to reset dropdown
                {
                    // $scope.INVOICE_no_span = invoice_char + response;
                    $scope.INVOICE_no_span = invoice_char;
                });

            }

        });


    };


    // item search ----------------------
    $scope.get_item_code_search = function () {
        var item_code = $scope.item_code;
        var data_count = 0;

        // $scope.models=$scope.models_old;
        //alert($scope.model.model_id) ;
        $.ajax({
            url: base_url + "Inventory_load/get_item_code_search",
            type: "POST",
            dataType: 'json',
            data: {"Item_code": item_code},
            success: function (response) {
                console.log(response);
                // alert(response.item_typeID[0]['manufacture_id']);
                data_count = response.item_typeID.length;

                $scope.$apply(function () //to reset dropdown
                {
                    if (data_count == 1) {


                        $scope.item_code = response.item_typeID[0]['model_code'];
                        $scope.retail_price = response.item_typeID[0]['model_retail_price'];
                        $scope.manufacture = $scope.manufactures[$scope.array_search($scope.manufactures, 'manufacture_id', response.item_typeID[0]['manufacture_id'])];
                        $scope.model = $scope.models[$scope.array_search($scope.models, 'model_id', response.item_typeID[0]['model_id'])];
                        $scope.item_name = $scope.manufacture.manufacture_name + " " + response.item_typeID[0]['model_name'];
                        $scope.unhide_models = false;
                        $scope.cost_price = response.item_typeID[0]['model_cost_price'];

                    } else {

                        $scope.item_code = '';
                        $scope.manufac = $scope.manufactures[''];
                        $scope.model = $scope.models[''];
                        $scope.unhide_models = false;
                    }
                    if (response.price_qty.length > 0) {

                        if (response.price_qty[0]['total_qty'] != null) {
                            if (typeof ($scope.array_search($scope.data_set.form_data, 'item_code', response.item_typeID[0]['model_code'])) != 'undefined') {

                                $scope.TOT_qty_span = (response.price_qty[0]['total_qty']) - $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', response.item_typeID[0]['model_code'])].qty;
                                $scope.TOT_qty_span_gl = (response.price_qty[0]['total_qty']) - $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', response.item_typeID[0]['model_code'])].qty;
                                $scope.available_qty = (response.price_qty[0]['total_qty']) - $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', response.item_typeID[0]['model_code'])].qty;
                            } else {

                                $scope.TOT_qty_span = response.price_qty[0]['total_qty'];
                                $scope.TOT_qty_span_gl = response.price_qty[0]['total_qty'];
                                $scope.available_qty = response.price_qty[0]['total_qty'];
                            }
                        } else {
                            $scope.TOT_qty_span = 0;
                            $scope.TOT_qty_span_gl = 0;
                            $scope.available_qty = 0;
                        }
                        if (response.price_qty[0]['model_price'] != '') {
                            $scope.unit_price_span = response.price_qty[0]['model_price'];
                            $scope.unit_price_span_gl = response.price_qty[0]['model_price'];
                        } else {
                            $scope.unit_price_span = 0;
                            $scope.unit_price_span_gl = 0;
                        }

                    } else {
                        $scope.TOT_qty_span = 0;
                        $scope.unit_price_span = 0;
                    }
                });
                //console.log($scope.db_data);
            }

        });
    };

    $scope.get_item_manufacture_search = function () {

        var manufacture = $scope.manufacture;

        var data_count = 0;
        // $scope.models=$scope.models_old;
        //alert($scope.manufacture.manufacture_id) ;
        $.ajax({
            url: base_url + "Inventory_load/get_item_manufacture_search",
            type: "POST",
            dataType: 'json',
            data: {"manufacture": manufacture},
            success: function (response) {
                console.log(response);
                // alert(response.item_typeID[0]['model_id']-1);
                data_count = response.item_typeID.length;
                $scope.$apply(function () //to reset dropdown
                {

                    if (data_count >= 1) {

                        $scope.item_code = '';
                        // $scope.manufac = $scope.manufactures[response.item_typeID[0]['manufacture_id'] - 1];
                        $scope.models = response.item_typeID;


                    } else {

                        $scope.item_code = '';
                        $scope.manufacture = $scope.manufactures[''];
                        $scope.model = $scope.models[''];
                    }
                    if (response.price_qty.length > 0) {
                        $scope.TOT_qty_span = response.price_qty[0]['total_qty'];
                        $scope.unit_price_span = response.price_qty[0]['model_retail_price'];
                        $scope.unit_price_span_gl = response.price_qty[0]['model_retail_price'];
                        $scope.TOT_qty_span_gl = response.price_qty[0]['total_qty'];
                        $scope.available_qty = response.price_qty[0]['total_qty'];
                    } else {
                        $scope.TOT_qty_span = 0;
                        $scope.unit_price_span = 0;
                        $scope.available_qty = 0;
                    }
                });
                //console.log($scope.db_data);
            }

        });
    };

    $scope.get_item_model_search = function () {

        //var model = $scope.model;
        var data_count = 0;
        // $scope.models=$scope.models_old;
        // alert($scope.model.model_id) ;
        $.ajax({
            url: base_url + "Inventory_load/get_item_model_search",
            type: "POST",
            dataType: 'json',
            data: {"model": $scope.model.model_id},
            success: function (response) {
                console.log(response);
                // alert(response.item_typeID[0]['model_id']-1);
                data_count = response.item_typeID.length;
                $scope.$apply(function () //to reset dropdown
                {
                    var model_element = document.getElementById('dropdown_model');
                    var manufacture_element = document.getElementById('dropdown_manifacture');
                    if (data_count == 1) {

                        $scope.item_code = response.item_typeID[0]['model_code'];
                        $scope.retail_price = response.item_typeID[0]['model_retail_price'];
                        $scope.manufacture = $scope.manufactures[$scope.array_search($scope.manufactures, 'manufacture_id', response.item_typeID[0]['manufacture_id'])];
                        $scope.model = $scope.models[$scope.array_search($scope.models, 'model_id', response.item_typeID[0]['model_id'])];
                        $scope.item_name = $scope.manufacture.manufacture_name + " " + response.item_typeID[0]['model_name'];
                        $scope.unhide_models = false;
                        $scope.cost_price = response.item_typeID[0]['model_cost_price'];
                        $scope.bulk_type = response.item_typeID[0]['model_qty_type'];
                        $scope.serials = response.model_serial;
                        $scope.company_warrenty = response['warranty'][0];
                        $scope.data.time_period={'ID':response['warranty'][1],'Name':response['warranty'][2]};
                       // console.log($scope.serials);

                    } else {

                        $scope.item_code = '';
                        manufacture_element.value = " ";
                        $("#dropdown_model").val($("#dropdown_model").data("default-value"));
                        $scope.req_qty = '';
                        $scope.total_price = '';
                        $scope.unhide_models = false;
                        alert("No data Available");
                    }
                    if (response.price_qty.length > 0) {
                        if (response.price_qty[0]['total_qty'] != null) {
                            if (typeof ($scope.array_search($scope.data_set.form_data, 'item_code', response.item_typeID[0]['model_code'])) != 'undefined') {

                                $scope.TOT_qty_span = (response.price_qty[0]['total_qty']) - $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', response.item_typeID[0]['model_code'])].qty;
                                $scope.TOT_qty_span_gl = (response.price_qty[0]['total_qty']) - $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', response.item_typeID[0]['model_code'])].qty;
                                $scope.available_qty = (response.price_qty[0]['total_qty']) - $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', response.item_typeID[0]['model_code'])].qty;
                            } else {

                                $scope.TOT_qty_span = response.price_qty[0]['total_qty'];
                                $scope.TOT_qty_span_gl = response.price_qty[0]['total_qty'];
                                $scope.available_qty = response.price_qty[0]['total_qty'];
                            }
                        } else {
                            $scope.TOT_qty_span = 0;
                            $scope.TOT_qty_span_gl = 0;
                            $scope.available_qty = 0;
                        }
                        if (response.price_qty[0]['model_price'] != '') {
                            $scope.unit_price_span = response.price_qty[0]['model_price'];
                            $scope.unit_price_span_gl = response.price_qty[0]['model_price'];
                        } else {
                            $scope.unit_price_span = 0;
                            $scope.unit_price_span_gl = 0;
                        }

                        $scope.req_qty = '';
                        $scope.total_price = '';
                    } else {
                        $scope.TOT_qty_span = 0;
                        $scope.unit_price_span = 0;
                    }
                });
                //console.log($scope.db_data);
            }

        });
    };

    $scope.set_serial = function (){
    $scope.item_serial=$scope.serial_data.select_serial.code_value;
    };




    $scope.item_serial = '';
    $scope.get_item_serial_search = function () {
        //alert($scope.item_serial);
        if ($scope.item_serial != '') {

            /* var data = [
             {"target": "production", "datapoints": [[165.0, 136], [141.0, 176], [null, 176]]},
             {"target": "test", "datapoints": [[169.0, 100], [151.0, 160], [null, 120]]},
             {"target": "backup", "datapoints": [[1.0, 130], [32.0, 120], [13.0, 130]]}
             ];
             var target = "prction";
             var result = $.grep(serials_list, function(e){ return e.target == target; });

             */

            // var target = $scope.item_serial.toString();
            //var is_in = $.grep(serial_array, function(e){ return e.target == target; });

            //var is_in = serials_list.indexOf($scope.item_serial.toString());
            //console.log(serials_list);
          //  model_serial_array
            var is_in = -1;

            for (key in serial_array) {
                is_in = serial_array[key].indexOf($scope.item_serial.toString());
                if (is_in != -1)break;
            }

            if (is_in != -1) {

                alert("This Serial Number Already In Grid");
                $scope.item_serial="";

            } else {
                $.ajax({
                    url: base_url + "Inventory_load/get_item_serial_search",
                    type: "POST",
                    dataType: 'json',
                    data: {"serial": $scope.item_serial},
                    success: function (response) {
                        console.log(response);

                        $scope.$apply(function () //to reset dropdown
                        {
                            if (response['data'].length > 0) {
                                $scope.model_code_variable = response['model_code_name'][0].code_value;//model_code_name
                                $scope.manufacture_name_variable = response['data'][0].manufacture_name;
                                $scope.manufacture_id_variable = response['data'][0].manufacture_id;
                                $scope.model_name_variable = response['data'][0].model_name;
                                $scope.model_id_variable = response['data'][0].model_id;
                                $scope.cost_price_variable = response['data'][0].model_cost_price;
                                $scope.bulk_type = response['data'][0].model_qty_type;
                                $scope.available_qty = response['data'][0].model_current_stock_qty;
                                $scope.item_code_type = response['data'][0].item_code_type;

                                $scope.company_warrenty = response['warranty'][0];
                              //  var element = document.getElementById('time_period');
                            //    element.value = response['warranty'][1];

                                $scope.data.time_period={'ID':response['warranty'][1],'Name':response['warranty'][2]};
                               // alert(response['warranty'][0]);

                                if ($scope.item_code_type != 3  && ($scope.bulk_type == 1 || $scope.bulk_type == 2)) {

                                    //var MS = JSON.parse(response['model_serial']);
                                    $scope.is_add_button=true;
                                    $scope.serial_display = [];
                                    $scope.view_serial_model_name = response['data'][0].manufacture_name +' '+ response['data'][0].model_name;
                                   // $scope.view_serial_data_index = 0;
                                    $scope.view_serial_data_model_id = response['data'][0].model_id;
                                  // MS=json2array(response['model_serial']);
                                    var j = response['model_serial'];

                                   // $scope.serial_display = Object.keys(j).map(function(_) { return j[_]; });
                                    $scope.serial_display = response['model_serial'];
                                    $scope.view_serial_data_model_id =  $scope.model_id_variable ;
                                   console.log( response['model_serial']);

                                    $('#serialModal').modal('show'); //fill $scope.serial_display array to show data on popup


                                }
                                if (typeof ($scope.array_search($scope.data_set.form_data, 'item_code', response['data'][0].model_code)) != 'undefined') {

                                    $scope.TOT_qty_span_gl = (response['data'][0].model_current_stock_qty) - $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', response['data'][0].model_code)].qty;
                                    $scope.available_qty = (response['data'][0].model_current_stock_qty) - $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', response['data'][0].model_code)].qty;

                                }
                                else {
                                    $scope.TOT_qty_span_gl = (response['data'][0].model_current_stock_qty);
                                    $scope.available_qty = (response['data'][0].model_current_stock_qty);
                                }

                                $scope.item_name = response['data'][0].manufacture_name + ' ' + response['data'][0].model_name;
                                $scope.retail_price = response['data'][0].model_retail_price;


                                if (fast_add == true)$scope.add_to_grid();
                            }
                            else {
                                alert('Data Not Found');
                                $scope.item_name = '';
                                $scope.retail_price = '';
                                $scope.model_code_variable = '';
                                $scope.manufacture_name_variable = '';
                                $scope.manufacture_id_variable = '';
                                $scope.model_name_variable = '';
                                $scope.model_id_variable = '';
                                $scope.cost_price_variable = '';
                                $scope.bulk_type = '';
                                $scope.item_serial="";
                            }

                        });

                    }

                });
            }
        }

    };

    $scope.payment_methods = function () {

        /// load customers
        $.ajax({
            url: base_url + "Inventory_load/get_dropdowns",
            type: "POST",
            dataType: 'json',
            //data: {"item_typeID": $scope.type},
            success: function (response) {
                //console.log(response['manufactures']);
                $scope.$apply(function () //to reset dropdown
                {
                    $scope.customers = response['customers'];
                });

            }

        });

        /// end load customers


    };

    //----------------------------------------------------------

    $scope.calculate_price = function () {

        if ($scope.req_qty != "") {
            $scope.total_price = ($scope.req_qty * $scope.unit_price_span).toFixed(2);
            // alert($scope.TOT_qty_span_gl);
            $scope.TOT_qty_span = $scope.TOT_qty_span_gl - $scope.req_qty;

        } else {
            $scope.total_price = "";
            $scope.TOT_qty_span = $scope.TOT_qty_span_gl - 0;

        }
    };
    $scope.set_setoff_value = function () {

        if ($scope.set_off.length > 0) {

            $scope.unit_price_span = $scope.set_off;
            $scope.calculate_price();
        } else {

            $scope.unit_price_span = $scope.unit_price_span_gl;
            $scope.calculate_price();
        }

    };

    $scope.calculate_discount = function () {

        if ($scope.gi_discount.length > 0) {
            $scope.GIN_total_price = parseInt($scope.GIN_total_price_gl) - parseInt($scope.gi_discount);

        } else {

            $scope.GIN_total_price = $scope.GIN_total_price_gl;

        }
    };

    $scope.set_time_period = function () {
        // alert($scope.data.time_period.ID);
        var time_id=null;
        time_id=$scope.data.time_period.ID;
        if (time_id == 'Y') {
            $scope.warrenty_in_week = 52 * $scope.company_warrenty;
        }
        else if (time_id == 'M') {
            $scope.warrenty_in_week = 4 * $scope.company_warrenty;
        }
        else if (time_id == 'W') {
            $scope.warrenty_in_week = $scope.company_warrenty;
        }
        else {
            $scope.warrenty_in_week = 0;
        }
        // alert($scope.warrenty_in_week);
    };

    $scope.clear_form = function () {

        $scope.manufacture = "";
        $scope.model = "";
        $scope.item_code = "";
        $scope.item_name = '';
        $scope.retail_price = '';
        $scope.txt_cash_amount = '';
        $scope.txt_discount_amount = '';
        $scope.txt_card_amount = '';
        $scope.txt_cheque_amount = '';
        $scope.txt_credit_amount = '';
        $scope.customer = '';
        //$scope.req_qty = "";
        // $scope.total_price = "";
        //   $scope.TOT_qty_span = 0;
        // $scope.TOT_qty_span_gl = 0;
        // $scope.available_qty = 0;
        // $scope.unit_price_span = 0;
    };

    $scope.clear_value = function () {

        $scope.unit_price_span_gl = 0;
        $scope.TOT_qty_span_gl = 0;
        $scope.invoice_total_price = 0;
        $scope.invoice_total_price_gl = 0;
        $scope.invoice_qty = 0;
        $scope.available_qty = 0;
        $scope.TOT_qty_span = 0;
        $scope.cost_price = 0;
        $scope.serial_value = '';
        $scope.manufacture_name_variable = '';
        $scope.manufacture_id_variable = '';
        $scope.model_name_variable = '';
        $scope.model_id_variable = '';
        $scope.cost_price_variable = 0;
        $scope.bulk_type = '';
        $scope.available_qty = 0;
        $scope.invoice_discount_price=0;
        $scope.warrenty_in_week = 0;
        $scope.invoice_cash_price = 0;
        $scope.invoice_card_price = 0;
        $scope.invoice_cheque_price = 0;
        $scope.invoice_credit_price = 0;
        serial_array = {};
        warranty_array = {};

    };


    $scope.array_search = function (array, index, string) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][index] === string) {
                return i;
            }

        }
    };

    $scope.clearItems = function (index) {

        if (confirm("Clear Current Data Set?") == true) {
            serial_array = {};
            warranty_array = {};
            model_serial_array = {};
            $scope.serial_display = [];
            $scope.data_set.form_data = [];
            $scope.paging();
        } else {

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

    function warranty_array_add(model_id, serial_no) {

        if (typeof warranty_array[model_id] != "undefined") {
            warranty_array[model_id].push(serial_no);
        }
        else {
            warranty_array[model_id] = [];
            warranty_array[model_id].push(serial_no);
        }
    }

    $scope.customer_save_reset = function (index) {

        $scope.$apply(function () //to reset dropdown
        {
        $scope.customer_name_txt="";
        $scope.street1="";
        $scope.customer_city="";
        $scope.show_add_customer = false;
        $scope.province = '';
        $scope.customer_code_txt = '';
        $scope.street2 = '';
        $scope.customer_email = '';
        $scope.postal_code = '';
        $scope.payment_methods();
        });
    };




    function json2array(json){
        var result = [];
        var keys = Object.keys(json);
        keys.forEach(function(key){
            result.push(json[key]);
        });
        return result;
    }


    //Date range picker
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
    });



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


    $scope.module_datatables_show=true;
    $scope.load_complete=datatables_service.grid_refresh($scope.start_date,$scope.end_date,true);

});