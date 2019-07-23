<?php

namespace App\Controllers;

use
  \App\Exceptions\HTTPException;



class ProductWebController extends AppController
{
  /**
  * Basic Read All Actions
  * curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://kontakt2.rs.hu/api/v3/productWeb
  */
  public function ReadAll($filters = array())
  {
    $this->validationByIp();

    ini_set("memory_limit","150M");
    $file = __DIR__ . '/../../../cache/task/webshop_stock.json';

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
          'Method Not Allowed',
          405,
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

    $this->respond($json, array(
      'config' => array(
        'stock_priority' => ['raktáron', 'utolsó darabok', '? héten belül', 'nincs készleten']
      )
    ));
  }
}
