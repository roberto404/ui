<?php

namespace App\Controllers;

use
  Phalcon\Filter,
  \App\Models\Products,
  \App\Models\Stock,
  \App\Models\Categories,
  \App\Models\Features,
  \App\Exceptions\HTTPException;


class ProductController extends AppController
{
  // TODO:
  public $restricted = false;


  protected $model = 'App\Models\Products';
  protected $listFields = '
    id,
    related_id,
    brand,
    flag,
    title,
    subtitle,
    title_orig,
    title_orig_rest,
    color,
    vat,
    price_orig,
    price_orig_gross,
    price_sale,
    price_sale_gross,
    price_discount,
    manufacturer,
    category,
    features,
    features_orig,
    dimension,
    images,
    instore,
    incart,
    description,
    priority
  ';


  protected $fetchFields = array(
    'related_id',
    'flag',
    'category',
    'features',
    // 'images',
    'instore',
    'incart',
    'description',
    'priority',

    // -- !!! Automatically generated of DOS. Never update these fields. !!! --
    //
    // 'id',
    // 'brand',
    // 'title',
    // 'title_orig',
    // 'title_orig_rest',
    // 'subtitle',
    // 'color',
    // 'vat',
    // 'price_orig',
    // 'price_orig_gross',
    // 'price_sale',
    // 'price_sale_gross',
    // 'price_discount',
    // 'manufacturer',
    // 'dimension',
  );

  protected $jsonFields = array(
    'flag',
    'dimension',
    'features',
  );

  // protected $availableMethods = array(
  //   'read',
  //   'create',
  // );


  public function Checkout()
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
          'code' => 'api.controller.product.checkout.nozipcode',
          'dev' => array(
            'zipcode' => $request->getPost('zipcode'),
          )
        )
      );
    }


    /* -- Floor -- */
    $transport = $request->getPost('transport', 'absint') ?: 1;

    /* -- Cart -- */
    $cart = [];
    $totalCart = 0;
    $isFreeDelivery = false;


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
      $quantity = $filter->sanitize($item->quantity, 'int!');
      $price = $filter->sanitize($item->unitGrossPrice, 'float!');

      $stock = Stock::findFirst("cikkszam = '$id'");

      if ($price !== $stock->getPriceSaleGross())
      {
        throw new HTTPException(
          'Forbidden',
          403,
          array(
            'level' => 'emergency',
            'code' => 'api.controller.product.checkout.price',
            'dev' => array(
              'priceStock' => $stock->getPriceSaleGross(),
              'priceRequest' => $price,
            )
          )
        );
      }

      $product = Products::findFirst("id = '{$id}'");

      if (!$product || !$product->instore || !$product->incart)
      {
        throw new HTTPException(
          'Forbidden',
          403,
          array(
            'level' => 'emergency',
            'code' => 'api.controller.product.checkout.product',
            'dev' => array(
              'id' => $id,
              'item' => $item,
            )
          )
        );
      }


      if (!$isFreeDelivery && \in_array(Products::FREE_DELIVERY, $product->getFlag()))
      {
        $isFreeDelivery = true;
      }

      $cart[] = array(
        'id' => $id,
        'quantity' => $quantity,
        'unitGrossPrice' => $price,
      );

      $totalCart += $price * $quantity;
    };

    restore_error_handler();

    /* -- Fee calculation -- */

    $basicFee = $this->getBasicFee($zipcode);
    $extraFee = $this->getExtraFee($totalCart);

    if (!$basicFee)
    {
      throw new HTTPException(
        'Forbidden',
        403,
        array(
          'level' => 'emergency',
          'code' => 'api.controller.product.checkout.zipcode',
          'dev' => array(
            'zipcode' => $request->getPost('zipcode'),
          )
        )
      );
    }

    /**
     * TODO
     * couponCode
     * loyalityId
     * userEmail
     */

    $shippingFee = floor($totalCart < 400000 ?
      $basicFee['szallitas_alapdij']
      :
      max(
        min($totalCart * 0.04, $basicFee['szallitas_alapdij'] * 2),
        $basicFee['szallitas_alapdij']
      )
    );

    $unloadingFee = $extraFee['unloading'] * $basicFee['rakodo_szorzo'];

    $transport = $extraFee['transport'] * floor($transport / 20);

    $transportFloorWithLift = min(
      ($extraFee['transportFloorWithLift'] * $floor),
      $extraFee['transportFloorWithLiftMax']
    );

    $transportFloorWithoutLift = $extraFee['transportFloorWithoutLift'] * $floor;

    $shippingDiscount = $isFreeDelivery ? ($basicFee['RS2_tavolsag'] > 30 ? 9000 : $shippingFee) : 0;


    $this->respond([
      'floor' => $floor,
      'zipcode' => $zipcode,
      'cart' => $cart,
      'fee' => [
        'shipping' => $shippingFee,
        'shippingDiscount' => $shippingDiscount,
        'unloading' => $unloadingFee,
        'transport' => $transport,
        'transportFloorWithLift' => $transportFloorWithLift,
        'transportFloorWithoutLift' => $transportFloorWithoutLift,
      ],
      'stock' => $basicFee['kozeli_bolt'],
      'totalCart' => $totalCart,
    ]);
  }

  public function setConfig()
  {
    // var_dump($this->getDI()->getDispatcher()->getControllerName());
    // var_dump($this->getDI()->getDispatcher->getActionName());
    // var_dump($this->di->get('router')->getActionName());
    // // var_dump($this->di->get('router')->getRoutes());
    // var_dump($this->di->get('router')->getControllerName());
    // var_dump($this->di->get('router')->getMatchedRoute()->getPattern());
    // var_dump($this->di->get('dispatcher')->getControllerName());
    // die();

    $route = $this->di->get('router')->getMatchedRoute()->getPattern();

    if ($route === '/v3/product/checkout')
    {
      return;
    }

    $Categories = new Categories();
    $categories = $Categories::find();

    $Features = new Features();
    $features = $Features::find();

    $flagsQuery = $this->db->query('
      SELECT
        id, title, instore, priority
      FROM
        products_flags
    ');

    $flagsQuery->setFetchMode(
      \Phalcon\Db::FETCH_ASSOC
    );

    return array(
      'categories' => $categories,
      'features' => $features,
      'flags' => $flagsQuery->fetchAll(),
    );
  }

  public function getBasicFee($zipcode)
  {
    $basicFeeQuery = $this->db->query("
      SELECT
        szallitas_alapdij, rakodo_szorzo, RS2_tavolsag, kozeli_bolt
      FROM
        szallitas.iranyitoszamok
      WHERE
        iranyitoszam = '${zipcode}'
    ");

    $basicFeeQuery->setFetchMode(
      \Phalcon\Db::FETCH_ASSOC
    );

    $result = $basicFeeQuery->fetchAll()[0];

    return $result && is_array($result) ? array(
      "szallitas_alapdij" => (float) $result['szallitas_alapdij'],
      "rakodo_szorzo" => (float) $result['rakodo_szorzo'],
      "RS2_tavolsag" => (float) $result['RS2_tavolsag'],
      "kozeli_bolt" => (float) $result['kozeli_bolt'],
    ) : false;
  }

  /**
   * 2.0 calculation base on value on Total cart
   * @return [Array] extra fees
   */
  public function getExtraFee($totalCart)
  {
    $extraFeeQuery = $this->db->query("
      SELECT
        unloading, transport, transportFloorWithLift, transportFloorWithLiftMax, transportFloorWithoutLift
      FROM
        shipping_fees
      WHERE
        totalCartMax >= {$totalCart}
      OR
        totalCartMax = 0
      ORDER BY
        id
      LIMIT 1
    ");

    $extraFeeQuery->setFetchMode(
      \Phalcon\Db::FETCH_ASSOC
    );

    $result = $extraFeeQuery->fetchAll()[0];

    return array(
      'unloading' => (int) $result['unloading'],
      'transport' => (int) $result['transport'],
      'transportFloorWithLift' => (int) $result['transportFloorWithLift'],
      'transportFloorWithLiftMax' => (int) $result['transportFloorWithLiftMax'],
      'transportFloorWithoutLift' => (int) $result['transportFloorWithoutLift'],
    );
  }

}
