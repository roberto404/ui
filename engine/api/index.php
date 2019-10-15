<?php

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

use

  Phalcon\Loader,
  Phalcon\DI\FactoryDefault as DefaultDI,
  Phalcon\Config\Adapter\Ini as IniConfig,
  Phalcon\Session\Adapter\Files as Session,
  Phalcon\Filter,
  Phalcon\Registry,
  Phalcon\Db\Adapter\Pdo\Mysql as MysqlAdapter,

  Phalcon\Mvc\View,
  Phalcon\Mvc\View\Engine\Volt as VoltEngine,

  Phalcon\Events\Manager as EventsManager,
  Phalcon\Logger as Logger,
  Phalcon\Logger\Adapter\File as FileLogger,
  Phalcon\Db\Profiler as MysqlProfiler,

  Phalcon\Mvc\Micro as Application;


try
{
  // Define path to application directory
  define('APPLICATION_PATH', realpath(dirname(__FILE__)) . '/');

  // Define path to document root directory
  define('DOCUMENT_ROOT', APPLICATION_PATH . '../../');

  // Define path to application directory
  define('ROUTES_PATH', APPLICATION_PATH . 'routes/');


  /**
   * Register classes into the PSR-0 autoloader
   */
  $loader = new Loader();
  $loader->registerNamespaces(
    array(
      'App'               => APPLICATION_PATH,
      'App\Controllers'   => APPLICATION_PATH . 'controllers/',
      'App\Exceptions'    => APPLICATION_PATH . 'exceptions/',
      'App\Models'        => APPLICATION_PATH . 'models/',
      'App\Responses'     => APPLICATION_PATH . 'responses/',
      'App\Helpers'       => APPLICATION_PATH . 'library/helpers/'
    )
  )->register();


  /**
   * Direct Injector
   * It will store pointers to all of our services.
   */
  $di = new DefaultDI();


  /**
  * Config
  * Setup the base configuration
  */
  $di->setShared('config', function()
  {
    $config_path = DOCUMENT_ROOT . 'engine/config/';

    $bootstrap = new IniConfig($config_path . 'bootstrap.ini');
    $application = new IniConfig($config_path . 'bootstrap.api.ini');
    $enviroment = new IniConfig($config_path . $_SERVER['SERVER_NAME'].'.ini');

    return $bootstrap->merge($application)->merge($enviroment);
  });


  /**
  * Enviroment settings
  */
  require_once 'enviroment.php';


  /**
  * Session
  */
  $di->setShared('session', function ()
  {
    $session = new Session();
    $session->start();

    return $session;
  });


  /**
   * Storing objects is always available throughout your application
   */
  $di->set('registry', new Registry());

  /**
  * Database Connection
  */
  require_once 'databases.php';
  $di->set('db', function() use ($di)
  {
    $config = $di->get('config')->database;

    $connection = new MysqlAdapter(
      array(
        "host"     => $config->host,
        "username" => $config->username,
        "password" => $config->password,
        "dbname"   => $config->dbname,
        "options" => array(
          PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES '.$config->charset
        )
      )
    );

    if ($config->debug)
    {
      $logfile = DOCUMENT_ROOT . 'logs/mysql.log';

      if ( !is_file($logfile) )
      {
        if ( !is_writable(DOCUMENT_ROOT . 'logs'))
        {
          throw new \App\Exceptions\HTTPException(
						"Internal Server Error",
						500,
						array(
              'level' => 'emergency',
							'dev' => 'cannot create file: ' . $logfile,
							'internalCode' => 'index.db.log.dir'
					  )
          );
        }
				if ( !touch($logfile) )
        {
					throw new \App\Exceptions\HTTPException(
            "Internal Server Error",
						500,
						array(
              'level' => 'emergency',
							'dev' => 'cannot create file: ' . $logfile,
							'internalCode' => 'index.db.log.file'
					  )
          );
				}
			}

      $profiler       = new MysqlProfiler();
      $eventsManager  = new EventsManager();
      $logger         = new FileLogger($logfile);


      // Listen all the database events
      $eventsManager->attach(
        "db:beforeQuery",
        function ($event, $connection) use ($profiler)
        {
          $profiler->startProfile($connection->getSQLStatement());
        }
      );

      $eventsManager->attach(
        "db:afterQuery",
        function ($event, $connection) use ($logger, $profiler)
        {
          $profiler->stopProfile();

          $logger
            ->begin()
            ->debug(
              $connection->getSQLStatement()
            )
            ->log(
              ($profiler->getTotalElapsedSeconds() > 0.1) ? Logger::ERROR : Logger::INFO,
              round($profiler->getTotalElapsedSeconds(), 1) . 's'
            )
            ->commit();
        }
      );

      // Assign the eventsManager to the db adapter instance
      $connection->setEventsManager($eventsManager);
    }

    return $connection;
  });


  /**
   * Filters
   */

  $filter = $di->get('filter');

  $di->set('filter', function() use ($filter)
  {
    $collections = require_once(APPLICATION_PATH . 'library/filters/filterLoader.php');

    if (is_array($collections))
    {
      foreach ($collections as $filterName => $filterMethod)
      {
        $filter->add($filterName, $filterMethod);
      }
    }

    return $filter;
  });

  /**
   * Phalcon View Template engine
   */
  $di->set(
    "view",
    function () {
      $view = new View();

      $view->setViewsDir(APPLICATION_PATH . "/views/");

      $view->registerEngines(array(
        '.volt' => function ($view, $di)
        {
          $volt = new VoltEngine($view, $di);

          $volt->setOptions(array(
            'compiledPath' => DOCUMENT_ROOT . 'cache/volt/',
            'compiledSeparator' => '_'
          ));

          return $volt;
        }
      ));
      return $view;
    }
  );


  /**
   * Micro Phalcon application for REST
   */
  $app = new Application();
  $app->setDI($di);


  /**
   * Add routes to application
   */
  foreach(scandir(ROUTES_PATH) as $collectionFile)
  {
    $pathinfo = pathinfo($collectionFile);

    if ($pathinfo['extension'] === 'php')
    {
      $app->mount(include(ROUTES_PATH . $collectionFile));
    }
  }

  // send the Controller's returned value to the client
  $app->after(function() use ($app)
  {
    // Results returned from the route's controller.
    $records = $app->getReturnedValue();

    switch ($app->request->get('responseType'))
    {
      case 'csv':
        $response = new \App\Responses\CSVResponse();
        $response
          ->useHeaderRow(true)
          ->send($records);
        break;

      case 'json':
      default:
        $response = new \App\Responses\JSONResponse();
        $response
          ->useEnvelope(true)
          ->send($records);
        break;
    }
  });

  // notFound service
  $app->notFound(function ()
  {
    throw new \App\Exceptions\HTTPException(
      'That route or method not found on the server.',
      404,
      array(
        'code' => 'NF1000',
        'more' => 'Check route for mispellings.'
      )
    );
  });

  // Handle the request
  $app->handle();
}
catch (Exception $e)
{
  // HTTPException
  if ( is_a($e, '\\App\\Exceptions\\HTTPException'))
  {
    $e->send();
  }
  // Others: PDOException, ...
  else
  {
    var_dump((array) $e);
    die();
    $exception = new \App\Exceptions\HTTPException(
      'Internal Server Error',
      500,
      array(
        'code' => 'ERR1000',
        'more' => 'Please try again or contact us.',
        'dev' => (array) $e
      )
    );

    $exception->send();
  }
}
