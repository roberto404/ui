<?php

namespace App\Controllers;

use
  \Phalcon\Db\Column,
  \App\Models\Users,
  \App\Exceptions\HTTPException;


class ExampleController extends AppController
{
  public function exampleAction()
  {
    return 1;
  }


  public function ApiExample()
  {

    $this->validationByIp();

    $request = $this->di->get('request');
    $filter = new Filter();

    /* -- Floor -- */
    $floor = $request->getPost('floor', 'absint');

    /* -- Zipcode -- */
    $zipcode = $request->getPost('zipcode', 'absint');

    if (!$zipcode)
    {
      throw new HTTPException(
        'Bad Request',
        400,
        array(
          'level' => 'emergency',
          'code' => 'api.controller.product.checkout.zipcode',
          'dev' => array(
            'zipcode' => $request->getPost('zipcode'),
          )
        )
      );
    }

    /* -- Cart -- */
    $cart = [];

    set_error_handler(function()
    {
      throw new HTTPException(
        'Bad Request',
        400,
        array(
          'level' => 'emergency',
          'code' => 'api.controller.product.checkout.cart',
          'dev' => array(
            'error' => func_get_args(),
          )
        )
      );
    });

    foreach(\json_decode($request->getPost('cart')) as $item)
    {

      $id = $filter->sanitize($item->id, 'alphanum');
      // $stock = Stock::find("cikkszam = '$id'");
      //
      // var_dump($stock->toArray());
      // die();


      $cart[] = array(
        'id' => $id,
        'quantity' => $filter->sanitize($item->quantity, 'absint'),
        'price' => $filter->sanitize($item->price, 'float!'),
      );
    };

    restore_error_handler();




    $this->respond([
      'floor' => $floor,
      'zipcode' => $zipcode,
      'cart' => $cart,
    ]);
  }
}
