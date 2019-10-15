<?php

use Phalcon\DI\FactoryDefault\CLI as CliDI,
    Phalcon\CLI\Console as ConsoleApp,
    Phalcon\Config\Adapter\Ini as IniConfig,
    Phalcon\Filter,
    Phalcon\Logger,
    Phalcon\Db\Adapter\Pdo\Mysql as MysqlAdapter;



define('VERSION', '1.0.0');
date_default_timezone_set('Europe/Budapest');


// Using the CLI factory default services container
$di = new CliDI();

// Define path to application directory
define('APPLICATION_PATH', realpath(dirname(__FILE__)) . '/');

// Define path to document root directory
define('DOCUMENT_ROOT', APPLICATION_PATH . '../../');

// Error Log
ini_set('error_log', DOCUMENT_ROOT . 'logs/error.log');

/**
 * Register the autoloader and tell it to register the tasks directory
 */
$loader = new \Phalcon\Loader();
$loader->registerDirs(
  array(
    APPLICATION_PATH . '/tasks'
  )
);
$loader->registerNamespaces(
  array(
    'App'               => APPLICATION_PATH,
    'App\Components'    => APPLICATION_PATH . '../api/library/components/',
    'App\Exceptions'    => APPLICATION_PATH . '../api/exceptions/',
    'App\Models'        => APPLICATION_PATH . '../api/models/'
  )
)->register();



/**
* Config
* Setup the base configuration
*/
$di->set('config', function()
{
  $config_path = DOCUMENT_ROOT . 'engine/config/';
  $env = isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : $_SERVER['LOGNAME'];

  $bootstrap = new IniConfig($config_path . 'bootstrap.ini');
  $application = new IniConfig($config_path . 'bootstrap.cli.ini');
  $enviroment = new IniConfig($config_path . $env .'.ini');

  return $bootstrap->merge($application)->merge($enviroment);
});


$di->set('db', function() use ($di)
{
  $connection = new MysqlAdapter(array(
    "host"     => $di->get('config')->database->host,
    "username" => $di->get('config')->database->username,
    "password" => $di->get('config')->database->password,
    "dbname"   => $di->get('config')->database->dbname,
    "options" => array(
      PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES '.$di->get('config')->database->charset,
      PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true
    )
  ));

  $eventsManager = new Phalcon\Events\Manager();

  $logger = new \Phalcon\Logger\Adapter\File(DOCUMENT_ROOT . 'logs/mysql.log');

  //Listen all the database events
  $eventsManager->attach('db', function($event, $connection) use ($logger)
  {
   if ($event->getType() == 'beforeQuery')
   {
      $sqlVariables = $connection->getSQLVariables() ?: [];

      if (count($sqlVariables))
      {
        $logger->log($connection->getSQLStatement() . ' ' . json_encode($sqlVariables), Logger::INFO);
      } else
      {
        $logger->log($connection->getSQLStatement(), Logger::INFO);
      }
    }
  });

  //Assign the eventsManager to the db adapter instance
  $connection->setEventsManager($eventsManager);

  return $connection;
});

/**
* External databases
*/
require_once APPLICATION_PATH . '../api/databases.php';

/**
* Enviroment settings
*/
require_once APPLICATION_PATH . '../api/enviroment.php';


/**
 * Filters
 */

$filter = $di->get('filter');

$di->set('filter', function() use ($filter)
{
  $collections = require_once(APPLICATION_PATH . '../api/library/filters/filterLoader.php');

  if (is_array($collections))
  {
    foreach ($collections as $filterName => $filterMethod)
    {
      $filter->add($filterName, $filterMethod);
    }
  }

  return $filter;
});



// Create a console application
$console = new ConsoleApp();
$console->setDI($di);

$di->setShared('console', $console);

/**
 * Process the console arguments
 */
$arguments = array();
foreach ($argv as $k => $arg)
{
  if ($k == 1)
  {
    $arguments['task'] = $arg;
  } elseif ($k == 2)
  {
    $arguments['action'] = $arg;
  } elseif ($k >= 3)
  {
    $arguments['params'][] = $arg;
  }
}

// Define global constants for the current task and action
define('CURRENT_TASK',   (isset($argv[1]) ? $argv[1] : null));
define('CURRENT_ACTION', (isset($argv[2]) ? $argv[2] : null));

try
{
  $console->handle($arguments);
}
catch (\Phalcon\Exception $e)
{
  echo $e->getMessage()."\n";
  exit(255);
}
