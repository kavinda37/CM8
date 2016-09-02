<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>NexSoft | Log in</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <!-- Bootstrap 3.3.5 -->
    <link rel="stylesheet" href="<?php echo base_url();?>assets/bootstrap/css/bootstrap.min.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="<?php echo base_url();?>assets/admin/plugins/font-awesome-4.4.0/css/font-awesome.min.css">
    <!-- Ionicons -->
    <!--<link rel="stylesheet" href="<?php echo base_url(); ?>assets/admin/plugins/ionicons-2.0.1/css/ionicons.min.css">-->
    <!-- Theme style -->
    <link rel="stylesheet" href="<?php echo base_url();?>assets/admin/dist/css/AdminLTE.min.css">
    <!-- iCheck -->
    <link rel="stylesheet" href="<?php echo base_url();?>assets/admin/plugins/iCheck/square/blue.css">
	
	

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

      <!-- Icons -->
      <link rel="apple-touch-icon" sizes="57x57" href="<?php echo base_url(); ?>assets/ico/apple-icon-57x57.png">
      <link rel="apple-touch-icon" sizes="60x60" href="<?php echo base_url(); ?>assets/ico/apple-icon-60x60.png">
      <link rel="apple-touch-icon" sizes="72x72" href="<?php echo base_url(); ?>assets/ico/apple-icon-72x72.png">
      <link rel="apple-touch-icon" sizes="76x76" href="<?php echo base_url(); ?>assets/ico/apple-icon-76x76.png">
      <link rel="apple-touch-icon" sizes="114x114" href="<?php echo base_url(); ?>assets/ico/apple-icon-114x114.png">
      <link rel="apple-touch-icon" sizes="120x120" href="<?php echo base_url(); ?>assets/ico/apple-icon-120x120.png">
      <link rel="apple-touch-icon" sizes="144x144" href="<?php echo base_url(); ?>assets/ico/apple-icon-144x144.png">
      <link rel="apple-touch-icon" sizes="152x152" href="<?php echo base_url(); ?>assets/ico/apple-icon-152x152.png">
      <link rel="apple-touch-icon" sizes="180x180" href="<?php echo base_url(); ?>assets/ico/apple-icon-180x180.png">
      <link rel="icon" type="image/png" sizes="192x192"  href="<?php echo base_url(); ?>assets/ico/android-icon-192x192.png">
      <link rel="icon" type="image/png" sizes="32x32" href="<?php echo base_url(); ?>assets/ico/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="96x96" href="<?php echo base_url(); ?>assets/ico/favicon-96x96.png">
      <link rel="icon" type="image/png" sizes="16x16" href="<?php echo base_url(); ?>assets/ico/favicon-16x16.png">
      <link rel="manifest" href="<?php echo base_url(); ?>assets/ico/manifest.json">
      <meta name="msapplication-TileColor" content="#ffffff">
      <meta name="msapplication-TileImage" content="<?php echo base_url(); ?>assets/ico/ms-icon-144x144.png">
      <meta name="theme-color" content="#ffffff">
      <!-- /Icons -->


  </head>
  <body class="hold-transition login-page">
    <div class="login-box">
       <div class="login-logo">
        <a style="color: white;" href="#"><img   height="50px" src="<?php echo base_url(); ?>assets/ico/bizi-logo.png" class=""></a>
      </div><!-- /.login-logo -->
      <div class="login-box-body">

        <p class="login-box-msg">Sign in to start your session</p>
        <div class="text-danger"> <?php echo validation_errors(); ?></div>
		 <?php
				$attributes = array('class' => 'login-form');
				echo form_open('Verify_login',$attributes); 
		  ?>

          <div class="form-group has-feedback">
            <input type="text" class="form-control" placeholder="Username" name="username" id="username">
            <span class="glyphicon glyphicon-user form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback">
            <input type="password" class="form-control" placeholder="Password" name="password" id="password">
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
          </div>
          <div class="row">
            <div class="col-xs-8">
              <div class="checkbox icheck">
                <label>
                  <input type="checkbox" name="remember_me" id="remember_me" value="remember_me"> &nbsp;Remember Me
                </label>
              </div>
            </div><!-- /.col -->
            <div class="col-xs-4">
              <button type="submit" class="btn btn-primary btn-block btn-flat">Sign In</button>
            </div><!-- /.col -->
          </div>
        </form>
<hr>
		<!--<div class="social-auth-links text-center">
          <p>- OR -</p>
          <a href="#" class="btn btn-block btn-social btn-facebook btn-flat"><i class="fa fa-facebook"></i> Sign in using Facebook</a>
          <a href="#" class="btn btn-block btn-social btn-google btn-flat"><i class="fa fa-google-plus"></i> Sign in using Google+</a>
        </div><!-- /.social-auth-links
        <a href="#">I forgot my password</a><br>
        <a href="register.html" class="text-center">Register a new membership</a>
        -->


      </div><!-- /.login-box-body -->
    </div><!-- /.login-box -->

    <!-- jQuery 2.1.4 -->
    <script src="<?php echo base_url();?>assets/admin/plugins/jQuery/jQuery-2.1.4.min.js"></script>
    <!-- Bootstrap 3.3.5 -->
    <script src="<?php echo base_url();?>assets/bootstrap/js/bootstrap.min.js"></script>
    <!-- iCheck -->
    <script src="<?php echo base_url();?>assets/admin/plugins/iCheck/icheck.min.js"></script>
	<!-- Background Stretch -->
	<script src="<?php echo base_url();?>assets/login/js/jquery.backstretch.min.js"></script>
	
    <script>
      $(function () {
        $('input').iCheck({
          checkboxClass: 'icheckbox_square-blue',
          radioClass: 'iradio_square-blue',
          increaseArea: '20%' // optional
        });
      });
    </script>
	<script>
		
		jQuery(document).ready(function() {
	
			/*
				Fullscreen background
			*/
			$.backstretch("<?php echo base_url();?>assets/img/backgrounds/<?php echo $image_name;?>");
			
			/*
				Form validation
			*/
			$('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('focus', function() {
				$(this).closest('.has-feedback').removeClass('has-error');
			});
			
			$('.login-form').on('submit', function(e) {
				
				$(this).find('input[type="text"], input[type="password"], textarea').each(function(){
					if( $(this).val() == "" ) {
						e.preventDefault();
						$(this).closest('.has-feedback').addClass('has-error');
					}
					else {
						$(this).closest('.has-feedback').removeClass('has-error');
					}
				});
				
			});
			
			
		});
		</script>
  </body>
</html>
