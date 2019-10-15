<?php

use
  App\Models\Products,
  App\Models\Features,
  App\Models\ProductsFlags,
  App\Models\Categories,
  App\Models\Stock,
  App\Components\Menu;


class ProductTask extends \Phalcon\CLI\Task
{
  const FILE_PATH = __DIR__ . '/../../../cache/task/';
  const FILE_NAME = 'products.json';
  const WEBSHOP_FILE_NAME = 'webshop_stock.json';
  const OUTLET_FILE_NAME = 'webshop_outlet.json';
  const TMP_POSTFIX = '.task';


  public function mainAction()
  {
    echo "\nAvailable Stock actions: \033[1;33mupdate, sync, cache\033[0m\n\n";
  }

  /**
   * Testing method
   */
  public function testAction()
  {
    $products = Products::find([
      'conditions' => 'id = "DMCS600"',
      // 'conditions' => 'features LIKE \'%\"41\":true%\'',
      // 'conditions' => 'id = "NF112I0220U01"',
      // 'conditions' => 'category = "15"',
      // 'conditions' => 'manufacturer = "1"',
      // 'conditions' => 'manufacturer = "K29" AND color = "III"',
      //price
      // 'conditions' => 'id = "8F00055A0"', //(37100.51)
      // 'conditions' => 'id = "8F0005500"', //(63859.41)
      // 'conditions' => 'brand LIKE "%Vénusz%"',
      // 'conditions' => 'id = "NF20712RK"',
    ]);

    // $this->updateDosAction($products); die();

    // var_dump(count($products));

    foreach ($products as $product)
    {
      // $this->updateWarrantyAction($products);
      // $product::parseTitle($product);
      // $product->createSubtitle();
      // $product::parseDOSTitle($product);


      // var_dump(array(
        // $product->toArray()
        // $product::parseManufacturerTitle($product)
        // $product::parseStock($product)
        // $product::parseDimension($product)
        // $product::parseOutlet($product)
        // $product::parseColor($product)
        // $product::parseDelivery($product),
        // $product->getStock()
      // ));

      //
      // var_dump(
        // $product::parseWebCategory($product)
        // $product->toWebsiteProps()
        // $product->getStock(false)
      // );
      // die();

      // $product->createRelatedId();

      // $colorFabrics = $product->getFabrics();
      // var_dump($product->features);

      // $product->addFeatures(['51' => '1']);


      if (!$product->save())
      {
        echo "\n💩 \033[1;33mERROR\033[0m {$product->id}\n\n";
        var_dump($product->getMessages());
        var_dump(array(
          "brand" => $product->brand,
        ));
        die();
      }

      // continue;
      // die();

      // var_dump(array(
      //   "id" => $product->id,
      //   // "price_orig_gross" => $product->price_orig_gross,
        // "price_sale_gross" => $product->price_sale_gross,
      //   // "related_id" => $product->related_id,
        // "brand" => $product->brand,
        // "title" => $product->title,
        // "subtitle" => $product->subtitle,
        // "title_orig" => $product->title_orig,
      //   // "category" => $product->category,
      //   // "manufacturerTitle" => $product->getManufacturerTitle(),
        // "dimension" => $product->getDimension(),
      //   "flag" => $product->getFlag(),
      //   // "priority" => $product->getPriority(),
      //   // "manufacturer" => $product->manufacturer,
        // "color" => $product->color,
      //   // "colors" => array(
      //   //   'category' => $product->color,
      //   //   'sum' => count($colorFabrics),
      //   //   'items' => array_slice($colorFabrics, 0, 5),
      //   // ),
      //   // "fabrics" => $colorFabrics,
        // "title_orig_rest" => $product->title_orig_rest,
      //   // "instore" => $product->instore,
      //   "features" => $product->features,
      //   // "stock" => $product->getStock()
      // ));
    }
  }


  /**
   * Observe the modified stock dateTime. If it changed, then cache stock cache file
   */
  public function syncAction()
  {
    $currentTimeStamp = Stock::getModifyDateTime()->getTimestamp();

    //@TODO agent, ha túl rég óta nem frissült, akkor vmi DOS-os sync para van.
    //
    // $cachedTimeStamp = filemtime(self::FILE_PATH . self::FILE_NAME);

    // if ($currentTimeStamp != $cachedTimeStamp)
    // {
    // }

    $this->updateAction();
    $this->cacheAction($currentTimeStamp);
  }

  /**
   * Create Stock cache file with database modified timestamp
   */
  public function cacheAction($timestamp)
  {
    if (!$timestamp)
    {
      $timestamp = time();
    }

    $products = [];

    foreach(Products::find([
      'conditions' => 'instore = 1'
    ]) as $product)
    {
      $products[] = $product->toWebsiteProps();
    }

    file_put_contents(
      self::FILE_PATH . self::FILE_NAME . self::TMP_POSTFIX,
      json_encode(
        array(
          'status' => 'SUCCESS',
          'modified' => $timestamp,
          'records' => $products,
          'config' => [
            'fabrics' => Products::getFabricsCache(),
            'features' => Features::find([
              'conditions' => 'status = 1',
              'columns' => 'id, title, options'
            ])->toArray(),
            'flags' => ProductsFlags::find([
              'conditions' => 'instore = 1',
              'columns' => 'id, title, priority, description'
            ])->toArray(),
            'category' => Categories::find([
              'conditions' => 'status = 1',
              'columns' => 'id, title'
            ])->toArray(),
          ]
        ),
        JSON_UNESCAPED_UNICODE /*| JSON_PRETTY_PRINT*/
      )
    );

    rename(
      self::FILE_PATH . self::FILE_NAME . self::TMP_POSTFIX,
      self::FILE_PATH . self::FILE_NAME
    );

    touch(self::FILE_PATH . self::FILE_NAME, $timestamp);
  }



  /**
   * Export Outlet Products with webshop extra informations
   */
  public function cacheWebshopOutletAction()
  {
    $results = array();

    $query = $this->db->query("
      SELECT
        id,
        aruhaz,
        cikkszam,
        nev,
        jpg,
        learazasoka,
        leiras,
        webcsoport,
        afa,
        raktar_listaar_kedv,
        netto_eredeti,
        netto_uj,
        raktar_listaar_br,
        brutto_uj
      FROM
        leertekeles.tetel
      WHERE
        archivalt = 0
      AND
        lezart = 0
      AND
        jpg != ''
      AND
        webcsoport != ''
    ");

    $webshopProductsString = file_get_contents(
      self::FILE_PATH . 'webshop_stock.json'
    );

    $webshopProducts = [];

    foreach(json_decode($webshopProductsString) as $product)
    {
      $webshopProducts[$product->id] = $product;
    };

    unset($webshopProductsString);

    foreach ($query->fetchAll() as $outlet)
    {
      $product = '';

      if (isset($webshopProducts[$outlet['cikkszam']]))
      {
        $product = $webshopProducts[$outlet['cikkszam']];
      }

      $description = "Leárazás oka:/n" . $outlet['learazasoka'];

      if ($outlet['leiras'])
      {
        $description = $outlet['leiras'] .  "/n" . $description;
      }

      if ($product && $product->description)
      {
        $product->description = $product->description . "/n" . $description;
      }

      $images = ["http://www.rs.hu/image/" . $outlet['jpg']];

      if ($product && $product->images)
      {
        $images[] = "http://kontakt2.rs.hu/product_images/"
          . $product->manufacturer . "/" . $product->id . "_01.jpg";
      }

      $results[] = array(
        "id" => $outlet['cikkszam'] . '-' . $outlet['id'],
        "title" => $outlet['nev'],
        "vat" => $outlet['afa'],
        "price_sale_net" => $outlet['netto_uj'],
        "price_orig_gross" => $outlet['raktar_listaar_br'],
        "price_sale_gross" => $outlet['brutto_uj'],
        "price_discount" => $outlet['raktar_listaar_kedv'],
        "category" => $outlet['webcsoport'],
        "dimension" => $product ? $product->dimension : [],
        "features" => $product ? $product->features : [],
        "description" => $description,
        "images" => $images,
        "incart" => 0,
        "stock" => array(
          'global' => "megtekinthető",
          'stores' => [$outlet['aruhaz'] => "megtekinthető"],
        ),
      );
    }

    file_put_contents(
      self::FILE_PATH . self::OUTLET_FILE_NAME . self::TMP_POSTFIX,
      json_encode($results, JSON_UNESCAPED_UNICODE /*| JSON_PRETTY_PRINT*/)
    );

    rename(
      self::FILE_PATH . self::OUTLET_FILE_NAME . self::TMP_POSTFIX,
      self::FILE_PATH . self::OUTLET_FILE_NAME
    );
  }




  /* !- Helper Task */

  /**
   * ReParsing all products
   * @param  [Products] $products
   */
  public function refreshAction($products = false)
  {
    if (!$products)
    {
      $products = Products::find();
    }

    foreach ($products as $product)
    {
      // @important $product->createRelatedId(); // bekapcsolásával elvesznek a manuálisan szétválasztott termékek
      $product->save();
    }
  }

  /**
   * Set instore and incart those products where the related product instore
   * @param Products $products
   */
  public function refreshRelatedInStoreAction($products = false)
  {
    $relatedIds = [];

    $query = $this->db->query("
      SELECT
        related_id
      FROM
        `products`
      WHERE
        related_id != ''
      AND
        related_id != id
      AND
        flag NOT LIKE '%X%'
      AND
        flag NOT LIKE '%Y%'
      GROUP By
        related_id
      HAVING
        count(id) > 1
      AND
        sum(instore) > 0
      AND
        count(id) > sum(instore)
    ");

    foreach ($query->fetchAll() as $record)
    {
      $relatedIds[] = $record['related_id'];
    }

    if (count($relatedIds))
    {
      $this->db->execute("
        UPDATE
          `products`
        SET
          `incart` = '1',
          `instore` = '1'
        WHERE
          `related_id` IN ('" . implode("','", $relatedIds) . "')
      ");
    }
  }



  public function updateAction($products = false)
  {
    if (!$products)
    {
      $products = Products::find();
    }

    $this->updateDOSAction($products);
    $this->updateKontaktAction($products);
  }

  /**
   * Observe DOS product changes -> Update products.
   *
   * title_orig, vat, price_orig, price_sale, features_orig, dimension_orig, [dimension_orig_new]
   * -> effected fields: brand, title, price_orig_gross, price_sale_gross, price_discount, dimension
   * @param  [Product] $products
   */
  public function updateDOSAction($products = false)
  {
    ini_set("memory_limit","1024M");

    if (!$products)
    {
      $products = Products::find();
    }

    $stocks = Stock::find();
    $stocksById = array();

    foreach ($stocks as $stock)
    {
      $stocksById[$stock->cikkszam] = $stock->toArray();
    }

    $stocks = null;

    foreach ($products as $product)
    {
      if (isset($stocksById[$product->id]))
      {
        $stock = $stocksById[$product->id];

        $akcar = round($stock['akcar_float'], 2);
        $listaar = round($stock['listaar_float'], 2);

        $stockProps = array(
          "title_orig" => $stock['megnevezes'],
          "vat" => $stock['afa'],
          "price_orig" => (float) $listaar,
          "price_sale" => (float) $akcar,
          "features_orig" => $stock['jellemzo'],
          "dimension_orig" => $stock['meret']
          // dimension_orig_new => $stock[],
        );

        $productProps = array(
          "title_orig" => $product->title_orig,
          "vat" => $product->vat,
          "price_orig" => (float) $product->price_orig,
          "price_sale" => (float) $product->price_sale,
          "features_orig" => $product->features_orig,
          "dimension_orig" => $product->dimension_orig
        );
        if (array_diff($stockProps, $productProps))
        {
          $product->title_orig = $stock['megnevezes'];
          $product->vat = $stock['afa'];
          $product->price_orig = $listaar;
          $product->price_sale = $akcar;
          $product->features_orig = $stock['jellemzo'];
          $product->dimension_orig = $stock['meret'];

          // parsers automatically update the realted fields
          $product->save();
        }
      }
    }
  }

  /**
   * Observe Kontakt1 product changes -> Update products
   *
   * manufacturer, images, instore, incart, description
   * @param  [Product] $products
   */
  public function updateKontaktAction($products = false)
  {
    if (!$products)
    {
      $products = Products::find();
    }

    foreach ($products as $product)
    {
      // - delete after launch
      $this->updateInStoreAction($products);
      $this->refreshRelatedInStoreAction($products);
      $this->updateDescriptionAction($products);
      // --
      $this->updateFreeDeliveryAction($products);
      $this->updateHunProductsAction($products);
      $this->updateWarrantyAction($products);
    }
  }

  /**
   * Update instore field
   *
   * Product exist in webshop 1.0
   * @param  [Products] $products
   */
  public function updateInStoreAction($products = false)
  {
    if (!$products)
    {
      $products = Products::find();
    }

    $instoreProducts = $this->getWebshopProducts();

    foreach ($products as $product)
    {
      $instore = (int) isset($instoreProducts[$product->id]);

      if ($instore !== (int) $product->instore)
      {
        $product->instore = $instore;
        $product->save();
      }
    }
  }

  /**
   * Update description field
   * @param  [Products] $products
   */
  public function updateDescriptionAction($products = false)
  {
    if (!$products)
    {
      $products = Products::find();
    }

    $webshopProducts = $this->getWebshopProducts();

    foreach ($products as $product)
    {
      if (isset($webshopProducts[$product->id]))
      {
        $description = strip_tags($webshopProducts[$product->id]);
        $product->description = strip_tags($webshopProducts[$product->id]);
        $product->save();
      }
    }
  }

  /**
   * Update flag with Free_Delivery if isset in kontakt1
   * @param  [Products] $products
   */
  public function updateFreeDeliveryAction($products = false)
  {
    if (!$products)
    {
      $products = Products::find();
    }

    $freeDeliveryProducts = $this->getFreeDeliveryProducts();

    foreach ($products as $product)
    {
      if (in_array($product->id, $freeDeliveryProducts))
      {
        $product->addFlag(Products::FREE_DELIVERY);
        $product->save();
      }
      else if (in_array(Products::FREE_DELIVERY, $product->getFlag()))
      {
        $product->removeFlag(Products::FREE_DELIVERY);
        $product->save();
      }
    }
  }

  /**
   * Update flag with Hun products cames from Kontakt1
   * @param  [Products] $products
   */
  public function updateHunProductsAction($products = false)
  {
    if (!$products)
    {
      $products = Products::find();
    }

    $hunProducts = $this->getHunProducts();

    foreach ($products as $product)
    {
      if (in_array($product->manufacturer, $hunProducts))
      {
        $product->addFlag(Products::HUN);
        $product->save();
      }
      else if (in_array(Products::HUN, $product->getFlag()))
      {
        $product->removeFlag(Products::HUN);
        $product->save();
      }
    }
  }

  /**
   * Add flag predefined brand
   * @param  [Products] $products
   */
  public function updateWarrantyAction($products = false)
  {
    $warranty = array();

    // 5 yrs
    $warranty[Products::WARRANTY . '_5'] = [
      [ "brand" => 'Zero', "manufacturer" => 'NF1'],
      [ "brand" => 'DominoGo'],
      [ "brand" => 'K170'],
      [ "brand" => 'K230'],
      [ "brand" => 'K260'],
      [ "brand" => 'Joy'],
      [ "brand" => 'Farmer'],
      [ "brand" => 'Vénusz', "manufacturer" => 'NF2'],
      [ "brand" => 'Extend'],
    ];


    if (!$products)
    {
      $products = Products::find();
    }

    foreach ($products as $product)
    {
      foreach ($warranty as $flag => $productFilters) // warranty flags: WARRANTY_5...
      {
        foreach($productFilters as $productFilter)
        {
          $found = false;

          foreach($productFilter as $field => $value)
          {
            if ($product->$field !== $value)
            {
              $found = false;
              break;
            }

            $found = true;
          }

          if ($found)
          {
            $product->addFlag($flag);
            $product->save();
            continue 3;
          }
        }
      }


      if (in_array(Products::WARRANTY . '_5', $product->getFlag()))
      {
        $product->removeFlag(Products::WARRANTY . '_5');
        $product->save();
      }
    }
  }



  /**
   * Simplfy all NF2 Related ID
   * @example
   * id: NF2123RK, NF2123R, NF2123RA
   * // -> NF2123
   */
  public function rebaseNF2RelatedIdAction()
  {
    $products = Products::find([
      'conditions' => "manufacturer = 'NF2'"
    ]);

    foreach($products as $product)
    {
      $regex = '/(.*)R(K|A)?$/';

      if ($product->id !== $product->related_id && preg_match($regex, $product->id, $matches))
      {
        $product->related_id = $matches[1];
        $product->save();
      }
    }
  }


  public function fetchRelatedProductsFromStockAction()
  {
    ini_set("memory_limit","1024M");

    $results = array();

    $query = $this->db->query("
      SELECT
        *
      FROM
        rsdb.raktar
      LEFT JOIN
        products
      ON
        raktar.cikkszam = products.id
      WHERE
        products.id is NULL
    ");

    $query->setFetchMode(
      \Phalcon\Db::FETCH_ASSOC
    );

    foreach ($query->fetchAll() as $record)
    {
      $stock = new Stock($record);
      $product = $stock->toProduct();

      $relatedProduct = Products::findFirst([
        'conditions' => "related_id = ?1",
        'bind' => [1 => $product->related_id]
      ]);

      if (!$relatedProduct)
      {
        $relatedProduct = Products::findFirst([
          'conditions' => "
              related_id LIKE ?1
            AND
              brand = ?2
            AND
              dimension = ?3
            AND
              title_orig LIKE ?4
          ",
          'bind' => [
            1 => $product->related_id . '%',
            2 => $product->brand,
            3 => $product->dimension,
            4 => substr(
              $product->title_orig,
              0,
              (strlen($product->title_orig) - strlen($product->color) - 3)
            ) . '%',
          ]
        ]);
      }

      if ($relatedProduct)
      {
        if (
          $product->brand === $relatedProduct->brand
          && $product->color && $product->color !== $relatedProduct->color
          && $product->dimension === $relatedProduct->dimension
          && $product->price_orig > 0
        )
        {
          $product->flag = $relatedProduct->flag;
          $product->category = $relatedProduct->category;
          $product->features = $relatedProduct->features;
          $product->instore = $relatedProduct->instore;
          $product->incart = $relatedProduct->incart;

          if (!$product->description)
          {
           $product->description = $relatedProduct->description;
          }

          $product->save();

          if ($relatedProduct->related_id !== $product->related_id)
          {
            $relatedProducts = Products::find([
              'conditions' => "
                  related_id = ?1
              ",
              'bind' => [
                1 => $relatedProduct->related_id
              ]
            ]);

            foreach($relatedProducts as $rproduct)
            {
              $rproduct->related_id = $product->related_id;
              $rproduct->save();
            }
          }
        }
      }
    }
  }



  /**
   * These products visible current webshopt but kontakt2 not included
   * Need to import
   */
  public function missingProductsAction()
  {
    $query = $this->db->query( "
      SELECT
        rsdb.termek.cikkszam
      FROM
        rsdb.termek
      LEFT JOIN
        site_kontakt.products
      ON
        rsdb.termek.cikkszam = site_kontakt.products.id
      WHERE
        site_kontakt.products.id IS NULL
    ");

    $missingProducts = [];
    foreach ($query->fetchAll() as $product)
    {
      $missingProducts[] = $product['cikkszam'];
    }

    var_dump($missingProducts);
  }


  /**
   * Delete selected feature and those relations like product's feature
   * @param  [integer] $featureId Id of Flag
   */
  public function deleteFeatureAction($args)
  {
    if (!$args || !$args[0])
    {
      echo "\n💩 \033[1;33mERROR\033[0m featureId missing\n\n";
      die();
    }

    $featureId = $args[0];

    $products = Products::find("features LIKE '%\"{$featureId}\":%'");

    foreach($products as $product)
    {
      $features = $product->getFeatures();

      if (isset($features[$featureId]))
      {
        $product->removeFeature($featureId);
        $product->save();
      }
    }

    $categories = Categories::find();

    foreach($categories as $category)
    {
      $categoryFeatures = $category->getFeatures();

      if (in_array($featureId, $categoryFeatures))
      {
        $category->removeFeature($featureId);
        $category->save();
      }
    }

    $feature = Features::findFirst($featureId);

    if ($feature)
    {
      $feature->delete();
    }
  }



  /* !- Helper Methods */


  /**
  * Fetch all products from Webshop 1.0
  * @return [Array] [cikkszam => leiras]
  */
  private function getWebshopProducts()
  {
    $results = [];

    $query = $this->db->query("
      SELECT
        cikkszam, leiras
      FROM
        rsdb.termek
      WHERE
        inaktiv = 0
    ");

    foreach ($query->fetchAll() as $record)
    {
      $results[$record['cikkszam']] = $this->translation($record['leiras']);
    }
    return $results;
  }



  /**
  * Fetch all free delivery products
  * @return [Array] [cikkszam]
  */
  private function getFreeDeliveryProducts()
  {
    $results = [];

    $query = $this->db->query("
      SELECT
        cikkszam
      FROM
        rsdb.termek_szallitasi_arak
      WHERE
        kedvezmeny_szazalek = 100
    ");

    foreach ($query->fetchAll() as $record)
    {
      $results[] = $record['cikkszam'];
    }

    return $results;
  }

  /**
  * Fetch all hungarian products
  * @return [Array] [prefix]
  */
  private function getHunProducts()
  {
    $results = [];

    $query = $this->db->query("
      SELECT
        prefix
      FROM
        kozos.users
      WHERE
        magyar = 1
    ");

    foreach ($query->fetchAll() as $record)
    {
      $results[] = $record['prefix'];
    }

    return $results;
  }








  private function translation($value)
  {
    $translations = array(
	    'û'=>'ű', 'Ũ'=>'Ű',
	    'õ'=>'ő', 'Õ'=>'Ő'
		);

    return strtr($value, $translations);
  }

}
