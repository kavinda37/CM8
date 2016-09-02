<!-- jQuery 2.1.4 -->
<script src="<?php echo base_url(); ?>assets/common/jQuery/jQuery-2.1.4.min.js"></script>
<!-- Bootstrap 3.3.5 -->
<script src="<?php echo base_url(); ?>assets/common/bootstrap/js/bootstrap.min.js"></script>
<!-- jasny-bootstrap -->
<script src="<?php echo base_url(); ?>assets/admin/plugins/jasny-bootstrap/js/jasny-bootstrap.min.js"></script>

<!-- SlimScroll -->
<script src="<?php echo base_url(); ?>assets/admin/plugins/slimScroll/jquery.slimscroll.min.js"></script>
<!-- FastClick -->
<script src="<?php echo base_url(); ?>assets/admin/plugins/fastclick/fastclick.min.js"></script>
<!-- AdminLTE App -->
<script src="<?php echo base_url(); ?>assets/admin/dist/js/app.min.js"></script>

<!-- AngularJs -->
<script data-require="angular.js@*" data-semver="1.3.15"
        src="<?php echo base_url(); ?>assets/common/angular-1.4.6/angular.min.js"></script>
<!-- AngularJs - Bootstrap -->
<script data-require="ui-bootstrap@*" data-semver="0.12.1"
        src="<?php echo base_url(); ?>assets/common/angular-1.4.6/ui-bootstrap-tpls-0.12.1.min.js"></script>
<!-- AngularJs - Routes -->
<script src="<?php echo base_url(); ?>assets/common/angular-1.4.6/angular-route.min.js"></script>
<!-- AngularJs - sanitize -->
<script src="<?php echo base_url(); ?>assets/common/angular-1.4.6/angular-sanitize.min.js"></script>


<!-- DataTables -->
<script src="<?php echo base_url(); ?>assets/admin/plugins/datatables/jquery.dataTables.min.js"></script>
<script src="<?php echo base_url(); ?>assets/admin/plugins/datatables/dataTables.bootstrap.min.js"></script>
<script src="<?php echo base_url(); ?>assets/admin/plugins/datatables/dataTables.buttons.min.js"></script>
<script src="<?php echo base_url(); ?>assets/admin/plugins/datatables/buttons.print.min.js"></script>
<!-- jQuery Print -->
<script src="<?php echo base_url(); ?>assets/admin/plugins/printThis-master/printThis.js"></script>
<!-- date-range-picker -->
<script src="<?php echo base_url(); ?>assets/admin/plugins/momentjs/moment.min.js"></script>
<script src="<?php echo base_url(); ?>assets/admin/plugins/daterangepicker/daterangepicker.js"></script>
<!-- InputMask -->
<!--<script src="<?php echo base_url(); ?>assets/admin/plugins/input-mask/jquery.inputmask.js"></script>
<script src="<?php echo base_url(); ?>assets/admin/plugins/input-mask/jquery.inputmask.date.extensions.js"></script>
<script src="<?php echo base_url(); ?>assets/admin/plugins/input-mask/jquery.inputmask.extensions.js"></script>-->
<script src="<?php echo base_url(); ?>assets/admin/plugins/robin-herbots-jquery.inputmask/dist/jquery.inputmask.bundle.js"></script>

<!-- Select2 -->
<!--<script src="<?php echo base_url(); ?>assets/admin/plugins/select2/select2.full.min.js"></script>-->
<script src="<?php echo base_url(); ?>assets/admin/dist/js/demo.js"></script>
<!--Multi Select-->
<script src="<?php echo base_url(); ?>assets/admin/plugins/multiple-select-master/jquery.multiple.select.js"></script>
<!-- ChartJS 1.0.1 -->
<!--<script src="<?php echo base_url(); ?>assets/admin/plugins/chartjs/Chart.min.js"></script>-->
<!-- Morris.js charts -->
<!--<script src="https://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
<script src="<?php echo base_url(); ?>assets/admin/plugins/morris/morris.min.js"></script>-->
<!--High Chart-->
<script src="<?php echo base_url(); ?>assets/admin/plugins/highcharts-4.2.6/js/highcharts.js"></script>
<script src="<?php echo base_url(); ?>assets/admin/plugins/highcharts-4.2.6/js/themes/grid-light.js"></script>
<!-- Flat Weather -->
<script src="<?php echo base_url(); ?>assets/admin/plugins/flatWeatherPlugin/js/jquery.flatWeatherPlugin.js"></script>
<!-- datepicker -->
<script src="<?php echo base_url(); ?>assets/admin/plugins/datepicker/bootstrap-datepicker.js"></script>
<!-- Ion Slider -->
<script src="<?php echo base_url(); ?>assets/admin/plugins/ionslider/ion.rangeSlider.min.js"></script>
<!-- iCheck 1.0.1 -->
<script src="<?php echo base_url(); ?>assets/admin/plugins/iCheck/icheck.min.js"></script>
<!-- Bootsrap Toggle -->
<script src="<?php echo base_url(); ?>assets/admin/plugins/bootstrap-toggle/bootstrap-toggle.min.js"></script>

<!--Custom Scripts-->
<script src="<?php echo base_url(); ?>assets/admin/js/custom.js"></script>


<script>


    var base_url='<?php echo base_url(); ?>';
    var company_id = '<?php //echo $company_id; ?>';
    var user_id = '<?php //echo $user_id; ?>';
    var current_users_name='<?php //echo $first_name; ?> <?php //echo $last_name; ?>';
    var server_date='<?php echo date("Y-m-d")  ?>';
    var server_date_machine_code='<?php echo date("m/d/Y")  ?>';

    var fast_add=false; //Global fast add FLAG

    $(document).ready(function () {

        $(".main-footer ").removeClass("hidden");
        $(".hide_till_load ").removeClass("hidden");


    });

</script>



<!--Angular Module-->
<script src="<?php echo base_url(); ?>app/config.js"></script>

<!--Angular Controllers-->
<script src="<?php echo base_url(); ?>app/main.js"></script>
<script src="<?php echo base_url(); ?>app/search.js"></script>
<script src="<?php echo base_url(); ?>app/stock.js"></script>


<!--Custom Application Functions-->
<script src="<?php echo base_url(); ?>app/custom_functions.js"></script>