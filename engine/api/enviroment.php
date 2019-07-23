<?php


$config = $di->get('config');


// Set Timezone
date_default_timezone_set($config->locale->timezone);


// Session Time
ini_set('session.gc_maxlifetime', $config->application->sessionTime);
ini_set('session.cookie_lifetime', $config->application->sessionTime);
session_set_cookie_params($config->application->sessionTime);

if ($config->application->sessionPath)
{
  ini_set('session.save_path', $config->application->sessionPath);
}


// Errors
error_reporting(constant($config->application->errorReporting));
ini_set('display_errors', $config->application->errorDisplay);
ini_set("error_log", DOCUMENT_ROOT . "logs/error.log");
