<!DOCTYPE html>
<html lang="en" ng-app="biziApp" id="biziApp">
<?php include 'head.php'; ?>

<!-- ADD THE CLASS fixed TO GET A FIXED HEADER AND SIDEBAR LAYOUT -->
<!-- the fixed layout is not compatible with sidebar-mini -->
<body class="hold-transition skin-blue fixed sidebar-mini" ng-controller="mainController">
<!-- Site wrapper -->
<div  class="wrapper">

    <?php include 'navbar.php'; ?>
    <!-- =============================================== -->

    <!-- Left side column. contains the sidebar -->
    <?php include 'sidebar.php'; ?>

    <!-- =============================================== -->

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
       <!-- <div  id="main">
            <div id="inventoryApp" ng-view></div>
        </div>-->
        <?php include 'temp_view.php'; ?>
    </div><!-- /.content-wrapper -->

    <?php include 'footer.php'; ?>

</div><!-- ./wrapper -->

<?php include 'scripts.php'; ?>

</body>
</html>
