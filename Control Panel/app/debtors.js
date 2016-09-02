biziApp.controller('debtorsController', function ($scope,datatables_service) {
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
            startDate: moment().subtract(6, 'days'),//Set Default Range
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

    //Payment Popup-----------------------------------------------------
    $scope.invoice_total_price = 0;
    $scope.invoice_discount_price=0;
    $scope.invoice_cash_price = 0;
    $scope.invoice_card_price = 0;
    $scope.invoice_cheque_price = 0;
    $scope.invoice_credit_price = 0;
    $scope.txt_cheque_number='';
    $scope.txt_discount_amount='';
    $scope.txt_cash_amount='';
    $scope.txt_card_amount='';
    $scope.txt_cheque_amount='';
    $scope.txt_credit_amount='';
    $scope.popup_note_type='';
    $scope.popup_note_id='';
    $scope.popup_note_no='';
    $scope.note_string='Person';
    $scope.data_set = {form_data: [], serials: [], common: [], selected: {},warrenty_period:[]};
    //$scope.is_fast_add=false;

    $scope.card_type = 'visa';



    $scope.payment_popup = function (data) {

        console.log(data);
        if(data['is_debtor']==true){
            $('#toggle-two').bootstrapToggle('on');
        }else {
            $('#toggle-two').bootstrapToggle('off');
        }
        //$('#toggle-two').bootstrapToggle('disable')

        $scope.$apply(function () //to reset dropdown
        {
            /*$scope.popup_note_type=data['note_type'];

            $scope.popup_note_id=data['note_id'];
            $scope.popup_note_no=data['note_number'];
            if($scope.popup_note_type==5){$scope.note_string='Supplier';$scope.popup_note_type_id=1;}
            if($scope.popup_note_type==9){$scope.note_string='Customer';$scope.popup_note_type_id=2;}*/
            $scope.invoice_total_price = data['total_value'];

            $scope.txt_discount_amount='';
            $scope.txt_cash_amount='';
            $scope.txt_card_amount='';
            $scope.txt_cheque_amount='';
            $scope.txt_credit_amount='';

            $scope.discount_view=false;
            $scope.card_view=false;
            $scope.cheque_view=false;
            $scope.credit_view=false;

            $scope.hide_discount=true;
            $scope.hide_credit=true;
        });

        if (typeof data['person_id'] == 'undefined') {
            /// load person
            $.ajax({
                url: base_url + "Inventory_load/get_person",
                type: "POST",
                dataType: 'json',
                data: {"type": $scope.popup_note_type_id},
                success: function (response) {
                    //console.log(response['manufactures']);
                    $scope.$apply(function () //to reset dropdown
                    {
                        $scope.show_person_name=false;
                        $scope.customers = response;
                    });

                }

            });
        }else {

            $scope.$apply(function () //to reset dropdown
            {
                $scope.show_person_name=true;
                $scope.popup_person_id=data['person_id'];
                $scope.person_name_display=data['person_code']+'-'+data['person_name'];
            });
        }
        /// end load customers

        $('#payment_modal').modal('show');
    };


    $scope.save_data_grid = function (is_print) {
        $scope.payments={"Cash": $scope.invoice_cash_price,"Card": $scope.invoice_card_price,"Cheque":$scope.invoice_cheque_price,"Credit":$scope.invoice_credit_price};
        // alert($scope.txt_cheque_number);
        $scope.enable_loading = true;
        $scope.cheque_date='2016-06-04';
        $scope.credit_date='2016-06-04';
        //alert(is_expense_chk);
        $scope.data_set.common.push({
           // note_no: $scope.popup_note_no,
            is_expense: is_expense_chk,//true false
           // note_id: $scope.popup_note_id,
            discount: $scope.invoice_discount_price,
            cheque_number: $scope.txt_cheque_number,
            cheque_date: $scope.cheque_date,
            credit_date: $scope.credit_date,
            card_type:$scope.card_type,
            payment_methode:$scope.payments,
            person_id:  $scope.popup_person_id,
            note_type: $scope.popup_note_type,
            user_id: user_id,
            department_id: 1

        });

        console.log($scope.data_set);

        $.ajax({
            url: base_url + "inventory_save/debt_invoices_clear",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                console.log(response);
                if (response['success'] == 1) {
                    alert("Data Inserted Successfully");

                    /*

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

                     $scope.data_set = [];
                     $scope.data_set = {form_data: [], serials: [], common: [], selected: {},warrenty_period:[]};
                     $scope.showme = false;
                     $scope.clear_form();
                     $scope.clear_value();

                     $scope.module_datatables_show=true;
                     $scope.load_complete=datatables_service.grid_refresh($scope.start_date,$scope.end_date,false);

                     });
                     */
                } else
                    alert("Save Failed");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Save Failed");
                $scope.load_complete = false;

            }
        });
    };

    //Popup Grid Load Function
    var popup_data_table=null;
    var init_popup_data_table=true;
    var  info_Table;
    $scope.balance_invoice_bttn=true;
    $scope.infoModal_data_table_title='Credit/Debt Notes';
    $scope.popup_grid_refresh = function (data_id) {

        var data_set={};
        var is_succss=true;

        //data_set['start_date']=start;
        //data_set['end_date']=end;
        data_set['data_id']=data_id;

        $.ajax({
            url: base_url+'/accounts_load/get_debtor_notes',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify(data_set),
            success: function (response) {
                //$scope.module_datatables_show=true;
                //console.log(response);
                if(response['logged_in']==true) {
                    var res_data;
                    if (typeof response['data'] !== 'undefined') {
                        res_data = response['data'];
                    } else res_data = 0;

                    //console.log(response);
                    var no_sort_last=false;
                    if(typeof response['no_sort_last']!= 'undefined') {
                        no_sort_last=true;
                    }

                    if (init_popup_data_table == true) {

                        //Initialize Datatables (In Custom Functions)
                        var array_column = [];
                        // array_column['class']=[];

                        array_column['title'] = response['title'];
                        //array_column['class'][4]='hidden';

                        info_Table = datatables_service.init_data_table('#debtors_popup_data_grid', array_column, true, true);
                        init_popup_data_table=false;
                        //End Initialize Datatables (In Custom Functions)

                    }



                    if (info_Table != null)info_Table.fnClearTable();

                    for (var i = 0; i < res_data.length; i++) {
                        info_Table.fnAddData(res_data[i], false);
                    }
                    info_Table.fnDraw();


                    $('#infoModal_data_table').modal('show');

                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("Load Error");
                is_succss=false;
            }

        });

        // table.row.add( [ '1', '2', '3', '4','5','600','700' ] ).draw();

    };

    $scope.module_datatables_show=true;
    $scope.load_complete=datatables_service.grid_refresh($scope.start_date,$scope.end_date,true);

    //$(window).trigger('resize');
});