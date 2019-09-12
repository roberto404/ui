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

  private $jsonFields = array(
    'flag',
    'dimension',
    'features',
  );

  // protected $availableMethods = array(
  //   'read',
  //   'create',
  // );


  public function ReadWeb($ids)
  {
    $results = [];

    /* !- Preparation */

    // flags
    $availableFlags = array_keys(Products::getFlagsPriority());

    // features
    $features = array();

    foreach (Features::find() as $feature)
    {
      $features[$feature->id] = $feature->toArray();

      if ($feature->options)
      {
        $features[$feature->id]['options'] = json_decode($feature->options, true);
      }
    }

    /* !- Collect products */

    foreach (\explode(',', $ids) as $id)
    {
      $product = Products::findFirst("id = '{$id}'");

      if (!$product)
      {
        throw new HTTPException(
          'Not Found',
          404,
          array(
            'level' => 'emergency',
            'code' => 'controller.product.readweb.noproduct',
            'dev' => array('message' => 'Product not found', 'id' => $id)
          )
        );
      }

      // flags
      $productFlag = $product->getFlag();

      // flag translation or excluding
      $productWebshopFlag = array();

      foreach ($productFlag as $flag)
      {
        if (in_array(mb_strtoupper($flag), $availableFlags))
        {
          $productWebshopFlag[] = mb_strtoupper($flag);
        }
      }

      // feature

      $productFeatures = array();

      if ($product->features)
      {
        foreach(json_decode($product->features) as $id => $values)
        {
          $feature = $features[$id];

          $value = '';

          switch ($feature['category'])
          {
            case 'multiselect':
              $value = array_map(
                function ($v) use ($feature)
                {
                  return $feature['options'][$v];
                },
                $values
              );
              break;

            case 'select':
              $value = $feature['options'][$values];
              break;

            default:
              $value = $values;
              break;
          }

          if ((is_array($value) && sizeof($value) > 0) || $value)
          {
            $productFeatures[] = array(
              'id' => $feature['id'],
              'title' => $feature['title'],
              'type' => $feature['category'],
              'value' => $value,
            );
          }
        }
      }


      /**
       * Extend description of product with DOS features and II. Class
       */
      $productDescriptonFeatures = $product->description ? ['',''] : [];

      if (in_array('CLASS_2', $productWebshopFlag))
      {
        $productDescriptonFeatures[] = 'II. osztály';
      }

      $productFeaturesOrig = explode(',', $product->getFeatures_orig());

      if ($productFeaturesOrig)
      {
        $productDescriptonFeatures = array_merge($productDescriptonFeatures, $productFeaturesOrig);
      }

      if (preg_grep("/^.+$/", $productDescriptonFeatures))
      {
        foreach ($productDescriptonFeatures as $index => $feature)
        {
          if ($feature)
          {
            $productDescriptonFeatures[$index] = '- ' . trim($feature);
          }
        }
      }
      else
      {
        $productDescriptonFeatures = [];
      }

      if ($product->price_discount == 21)
      {
        $productWebshopFlag[] = 'VAT';
      }

      // Méret leírások
      if (in_array($product->category, ['51']))
      {
        if (count($productDescriptonFeatures))
        {
          $productDescriptonFeatures[] = ''; //extra <BR>
        }
        $productDescriptonFeatures[] = '* <b>Méretek:</b> szélesség: karfa szélessége, magasság: háttámla magassága, mélység: ülőfelület mélysége';
      }

      $results[] = array(
        "id" => $product->id,
        // "related_id" => $product->related_id ?: $product->id,
        "brand" => $product->brand,
        "title" => $product->title,
        "subtitle" => $product->subtitle,
        "flag" => $productWebshopFlag,
        "vat" => $product->vat,
        "price_sale_net" => $product->price_sale,
        "price_orig_gross" => $product->price_orig_gross,
        "price_sale_gross" => $product->price_sale_gross,
        "price_discount" => $product->price_discount,
        "manufacturer" => $product->manufacturer,
        "manufacturerTitle" => $product->getManufacturerTitle(),
        // "category" => $categories[$product->category]['title'],
        // "category" => $webCategory,
        "dimension" => json_decode($product->dimension, true),
        "features" => $productFeatures,
        // "colors" => array(
        //   'category' => $product->color,
        //   'sum' => count($colorFabrics),
        //   'items' => array_slice($colorFabrics, 0, 15),
        // ),
        "description" => nl2br($product->description) . implode('<br>', $productDescriptonFeatures),
        "images" => $product->images,
        "incart" => $product->incart,
        // "inoutlet" => $product::parseOutlet($product),
        "stock" => $product->getStock(),
        "priority" => $product->getPriority(),
      );
    }

    return $results;
  }


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
