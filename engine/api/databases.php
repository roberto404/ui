<?php

use

  Phalcon\Db\Adapter\Pdo\Mysql as MysqlAdapter;


$di->set('db.rsdb', function() use ($di)
{
  $config = $di->get('config')->database;

  return new MysqlAdapter(
    array(
      "host"     => $config->host,
      "username" => $config->username,
      "password" => $config->password,
      "dbname"   => 'rsdb',
      "options" => array(
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES '.$config->charset
      )
    )
  );
});
