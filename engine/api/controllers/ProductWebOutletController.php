<?php

namespace App\Controllers;

use
  \App\Exceptions\HTTPException;



class ProductWebOutletController extends AppController
{
  /**
  * Basic Read All Actions
  * curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://kontakt2.rs.hu/api/v3/productWebOutlet
  */
  public function ReadAll($filters = array())
  {
    $this->validationByIp();

    ini_set("memory_limit","150M");
    $file = __DIR__ . '/../../../cache/task/webshop_outlet.json';

    $getStock = function() use ($file)
    {
      $cache = \file_get_contents($file);
      $json = json_decode($cache, true);

      return $json;
    };

    $json = $getStock();

    if (!$json)
    {
      sleep(10);
      $json = $getStock();

      if (!$json)
      {
        throw new HTTPException(
          'Service Unavailable',
          503,
          array(
            'level' => 'emergency',
            'code' => 'controller.productWeb.readall',
            'dev' => array(
              'message' => 'Cache file missing',
              'filePath' => $file,
            ),
          )
        );
      }
    }

    $this->respond($json, array('modified' => filemtime($file)));
  }
}
