<?php

namespace App\Models;

use
  Phalcon\DI,
  App\Models\Features,
  App\Models\Categories,
  Phalcon\Mvc\Model,
  App\Components\Menu;


$cache_flagsPriority = [];
$cache_manufacturerFabricCategories = [];  // szövet (gyártó: szövetkód)
$cache_manufacturerFabricCategoryFabrics = []; // szövetek (gyártó: kategória: szövetek)
$cache_manufacturerTitles = [];

class Products extends Model
{
  /**
   * Free delivery Flag
   * @var string
   */
  const FREE_DELIVERY = 'FREE_DELIVERY';

  /**
   * Hungarian product Flag
   * @var string
   */
  const HUN = 'HUN';

  /**
   * Warranty Flag
   * @var string
   */
  const WARRANTY = 'WARRANTY';

  /**
   * Product's dimension order and keys
   */
  const DIMENSIONS = array('w', 'h', 'd');

  /**
   * special color code
   * @var array
   */
  const FABRIC_COLORS = [
    'ciklámen' => 'ciklámen',
    'natúr' => 'natúr',
    'fekete' => 'fekete',
    'fek' => 'fekete',
    'fehér' => 'fehér',
    'szü' => 'szürke',
    'szür' => 'szürke',
    'szürke' => 'szürke',
    'sárga' => 'sárga',
    'piros' => 'piros',
    'pir' => 'piros',
    'calvados' => 'calvados',
    'calv' => 'calvados',
    'kék' => 'kék',
    'zöld' => 'zöld',
    'barna' => 'barna',
    'pink' => 'pink',
    'rózsaszín' => 'rózsaszín',
    'lila' => 'lila',
    'türkiz' => 'türkiz',
    'krém' => 'krém',
    'vanília' => 'vanília',
    'vanilia' => 'vanilia',
    'bézs' => 'bézs',
    'coffee' => 'coffee',
    'cappuccino' => 'cappuccino',
    'beige' => 'beige',
    'éger' => 'éger',
    'mogyoró' => 'mogyoró',
    'narancs' => 'narancs',
    'cser' => 'cseresznye',
    'drapp' => 'drapp',
    'bükk' => 'bükk',
    'méz' => 'méz',
    'wenge' => 'wenge',
    'alma' => 'alma',
    'juhar' => 'juhar',
    'black' => 'black',
    'tölgy' => 'tölgy',
    'króm' => 'króm',
    'ezüst' => 'ezüst',
    'sonoma' => 'sonoma',
    'son' => 'sonoma',
    'vs' => 'világos sonoma',
    'szil' => 'szilva',
    'szilva' => 'szilva',
  ];

  /**
   *
   * @var string
   */
  public $id;

  /**
   *
   * @var string
   */
  public $related_id;

  /**
   *
   * @var string
   */
  public $flag;

  /**
   *
   * @var string
   */
  public $brand;

  /**
   *
   * @var string
   */
  public $title;

  /**
   *
   * @var string
   */
  public $subtitle;

  /**
   *
   * @var integer
   */
  public $title_orig;

  /**
   *
   * @var integer
   */
  public $title_orig_rest;

  /**
   *
   * @var integer
   */
  public $color;

  /**
   *
   * @var integer
   */
  public $vat;

  /**
   *
   * @var decimal
   */
  public $price_orig;

  /**
   *
   * @var decimal
   */
  public $price_orig_gross;

  /**
   *
   * @var decimal
   */
  public $price_sale;

  /**
   *
   * @var decimal
   */
  public $price_sale_gross;

  /**
   *
   * @var integer
   */
  public $price_discount;

  /**
   *
   * @var integer
   */
  public $price_installation;

  /**
   *
   * @var string
   */
  public $manufacturer;

  /**
   *
   * @var integer
   */
  public $category;

  /**
   *
   * @var string
   */
  public $features;

  /**
   *
   * @var string
   */
  public $features_orig;

  /**
   *
   * @var string
   */
  public $dimension;

  /**
   *
   * @var string
   */
  public $dimension_orig;

  /**
   *
   * @var string
   */
  public $dimension_orig_new;

  /**
   *
   * @var string
   */
  public $images;

  /**
   *
   * @var boolean
   */
  public $instore;

  /**
   *
   * @var boolean
   */
  public $incart;

  /**
   *
   * @var string
   */
  public $description;

  /**
   * Products order (calc: n*1000 + flag*flag_priority)
   * @var integer
   */
  public $priority;


  /* !- Cache storeage */

  public static $webCategoriesMenu;
  public $categoryModel;
  public static $deliveryManufacturer; // szállítási időpontok gyártónként
  public static $outletDb; // leárazott termékek cache file-a
  public static $manufacturerTitles; // gyártó nevek prefix alapján



  /* !- Methods of LifeCycles */

  /**
   * Before Validation run first, then onCreate
   * - title
   * - vat [default]
   * - price, discount (calc. gross)
   * - features convert JSON
   * - dimension parse
   * - image parse
   * - instore, incart logic
   */
  public function beforeValidation()
  {
    if (!$this->related_id)
    {
      $this->related_id = $this->id;
    }

    $this->categoryModel = Categories::findFirst($this->category);

    $this->createTitle();

    // subtitle
    $this->createSubtitle();
    $this::parseDOSTitle($this);

    // vat
    if (!$this->vat)
    {
      $this->vat = 27;
    }

    // gross price
    $this->price_orig_gross = round($this->price_orig * ($this->vat + 100) / 100);
    $this->price_sale_gross = round($this->price_sale * ($this->vat + 100) / 100);

    // clamp discount, sometimes price_sale float wrong
    $this->price_discount = 0;

    if ($this->price_orig > 0 && $this->price_sale > 0 && $this->price_orig != $this->price_sale)
    {
      $this->price_discount = max(0, min(100,
        floor(100 - (($this->price_sale / $this->price_orig) * 100))
      ));
    }

    // features
    if ($this->features)
    {
      if (!is_array($this->features))
      {
        $this->features = $this->getFeatures();
      }

      $categoryFeatures = explode(',', $this->categoryModel->features);

      $features = [];

      foreach($this->features as $featureIndex => $featureValue)
      {
        if (in_array($featureIndex, $categoryFeatures))
        {
          $features[$featureIndex] = $featureValue;
        }
      }

      $this->features = json_encode($features, JSON_UNESCAPED_UNICODE);
    }

    $this->parseDimension($this);

    // dimension_orig_new
    if (is_array($this->dimension_orig_new))
    {
      $this->dimension_orig_new = json_encode($this->dimension_orig_new, JSON_UNESCAPED_UNICODE);
    }

    // priority
    if (!$this->priority)
    {
      $this->priority = 0;
    }
  }

  /**
   * Run after beforeValidation()
   */
  public function beforeValidationOnCreate()
  {
    $this->createRelatedId();

    // manufacturer <- nem változhat updatenel
    if (!$this->manufacturer)
    {
      $this->parseManufacturer($this);
    }

    // incart
    if (!$this->incart)
    {
      $this->incart = $this->instore ? 1 : 0;
    }
  }

  /* !- Getter/setter */

  /**
   * Create related Id from sku (product's id)
   */
  public function createRelatedId()
  {
    $skuPattern = '/(.*)[0-9]{1}[A-Z]*$/m';

    // determine group sku number
    preg_match_all($skuPattern, $this->id, $matches);

    $this->related_id = sizeof($matches[1]) ? $matches[1][0] : '';

    // related_id is too short
    $regex = '/^' . $this->related_id . '[0-9]{1}[A-Z]{0,2}$/m';

    if (!$this->related_id || !preg_match($regex, $this->id))
    {
      $this->related_id = $this->id;
    };
  }

  /**
   * Create product's title. Based on category template_title
   */
  public function createTitle()
  {
    if (!$this->categoryModel)
    {
      $this->categoryModel = Categories::findFirst('id ='.$this->category);
    }

    $this->title = $this->createTitleFromTemplate($this->categoryModel->template_title);
  }

  /**
   * Create product's subtitle. Based on category template_subtitle
   */
  public function createSubtitle()
  {
    if (!$this->categoryModel)
    {
      $this->categoryModel = Categories::findFirst('id ='.$this->category);
    }

    $this->subtitle =
      $this->createTitleFromTemplate($this->categoryModel->template_subtitle);
  }


  /**
   * Create string from template, base on product props
   * @param  [string] $template
   * @return [string]
   * @example
   * {features/3} {features/1} {category} {features/26}
   * // -> Fa pácolt szekrény fabetétes
   */
  public function createTitleFromTemplate($template)
  {
    $result = $template;
    $productProps = $this->toArray();

    $regEx = '/{([a-z\/0-9]+)}/';

    if (preg_match_all($regEx, $template, $matches))
    {
      foreach ($matches[1] as $field)
      {
        $replace = '';

        $fields = explode("/", $field);

        switch ($field)
        {
          case 'category':
            if ($this->categoryModel)
            {
              $replace = $this->categoryModel->title;
            }
            break;

          // @example feature-1, dimension-w
          case count($fields) == 2:

            if ($fields[0] == "features")
            {
              $feature = Features::findFirst("id = ". $fields[1]);

              if (!$feature)
              {
                break;
              }

              /**
               * product features with selected Id
               * @var [boolean|text|array]
               */
              try
              {
                $productFeatures = json_decode($productProps['features'], true);

                if (isset($productFeatures[$fields[1]]))
                {
                  $productFeature = $productFeatures[$fields[1]];
                }
                else
                {
                  break 1;
                }
              }
              catch (\Exception $e)
              {
                break 1;
              }


              // type boolean
              if (is_bool($productFeature))
              {
                if ($productFeature === true)
                {
                  $replace = $feature->title;
                }
                break;
              }

              // type text
              if (!$feature->options)
              {
                $replace = $productFeature;
              }

              if (!is_array($productFeature))
              {
                $productFeature = array($productFeature);
              }

              $featuresResults = array();

              /**
               * type: array
               * @example
               * {1: modern, 2: classic, 3: eco}
               */
              if ($feature->options)
              {
                foreach (json_decode($feature->options, true) as $optionIndex => $optionTitle)
                {
                  if (in_array($optionIndex, $productFeature))
                  {
                    $featuresResults[] = $optionTitle;
                  }
                }
              }

              if (sizeof($featuresResults))
              {
                $replace = implode(', ', $featuresResults);
              }
            }
            else
            {
              $fieldProps = @json_decode($productProps[$fields[0]], true);
              if ($fieldProps && isset($fieldProps[$fields[1]]))
              {
                $replace = $fieldProps[$fields[1]];
              }
            }
            break;

          default:
            if (isset($productProps[$field]))
            {
              $replace = $productProps[$field];
            }
            break;
        }

        $result = str_replace('{' . $field . '}', $replace, $result);
      }
    }

    // especially one of dimension props missing
    $result = preg_replace('/ x/', '', $result);
    $result = preg_replace('/\/$/', '', $result);

    // especially one of template's variable missing
    $result = preg_replace('/  +/', ' ', $result);
    $result = preg_replace('/,+/', ',', $result);
    $result = preg_replace('/, $/', '', $result);

    return trim($result);
  }

  /**
   * Add word to subtitle of product
   * @param string|array $text
   * @example
   * $product->addSubtitle(['foo', 'bar']);
   * // => $product->subtitle = 'foo, bar';
   *
   * $product->addSubtitle('baz');
   * // => $product->subtitle = 'foo, bar, baz';
   */
  public function addSubtitle($text)
  {
    if (!$text)
    {
      return;
    }

    $subtitles = $this->subtitle ? \explode(', ', $this->subtitle) : [];

    if (!is_array($text))
    {
      $text = [$text];
    }

    foreach($text as $t)
    {
      if (!in_array($t, $subtitles))
      {
        $subtitles[] = $t;
      }
    }

    $this->subtitle = \implode(', ', $subtitles);
  }

  public function setFlag($flag)
  {
    $this->flag = $flag;
  }

  /**
   * Add flag to products
   * @param string $flag
   */
  public function addFlag($flag)
  {
    $flag = mb_strtoupper($flag);

    $productFlag = $this->getFlag();

    if (!in_array($flag, $productFlag))
    {
      $productFlag[] = $flag;
      $this->flag = \json_encode($productFlag);
    }
  }

  /**
   * Remove flag to products
   * @param string $flag
   */
  public function removeFlag($flag)
  {
    $flag = mb_strtoupper($flag);

    $productFlag = $this->getFlag();

    if (in_array($flag, $productFlag))
    {
      $this->flag = \json_encode(array_values(array_diff($productFlag, [$flag])));
    }
  }

  /**
   * Return product's flag array from JSON
   * @return array [RSTOP, KIF...]
   */
  public function getFlag()
  {
    // var_dump('getFlag'); die();
    return !$this->flag ? [] : \json_decode($this->flag, true);
  }

  /**
   * Add features to products
   * @param array $features
   * @example
   * addFeatures(['41' => true, '42' => ['1', '2']])
   */
  public function addFeatures($features)
  {
    $productFeatures = $this->getFeatures();

    if (!is_array($features))
    {
      return;
    }


    foreach($features as $featureId => $featureValue)
    {
      if (!isset($productFeatures[$featureId]))
      {
        $productFeatures[$featureId] = $featureValue;
      }
    }

    $this->features = \json_encode($productFeatures);
  }

  /**
   * Remove feature from products
   * @param string $feature
   */
  public function removeFeature($featureId)
  {
    if (!$featureId)
    {
      return;
    }

    $features = $this->getFeatures();

    if (isset($features[$featureId]))
    {
      unset($features[$featureId]);
      $this->features = \json_encode($features);
    }
  }

  /**
   * Return product's feature object from JSON
   * @return array { '32': '3' }
   */
  public function getFeatures()
  {
    return !$this->features ? [] : \json_decode($this->features, true);
  }

  public function getFeatures_orig()
  {
    $filter = DI::getDefault()->get('filter');

    // sanitize
    return $filter->sanitize(
      $this->features_orig,
      'hungarian'
    );
  }

  /**
   * Return product's dimension array from JSON
   * @return array {"w":"85","h":"75","d":"120"}
   */
  public function getDimension()
  {
    return !$this->dimension ? [] : \json_decode($this->dimension, true);
  }


  /**
   * Calculate product's priority based on Flag
   * @return integer
   */
  public function getPriority()
  {
    /**
     * { 'RSTOP': 100, ... }
     * @var array
     */
    $flags = $this->getFlagsPriority();
    $priority = 0;

    // RSTOP, HUN ...
    foreach ($this->getFlag() as $flag)
    {
      if (isset($flags[$flag]))
      {
        $priority += $flags[$flag] ?: 0;
      }
    }
    return (($this->priority ?: 0) * 1000) + $priority;
  }


  /**
   * Create stock informations
   * @param boolean $human quantity informations is exact number or human information
   * @return array {
   *    global: 'raktáron',
   *    stores: { "RS1": "utolsó darabok", "RS2": "raktáron": "RS3": "nincs készleten", "RS4": "megtekinthető" }
   *  }
   */
  public function getStock($human = true)
  {
    $stock = Stock::findFirst("cikkszam = '{$this->id}'");

    if (!$stock)
    {
      return null;
    }

    /**
     * @var [array] [RS2 => 11, RS6 => 3]
     */
    $maxQuantity = max($stock->getSupply('RS2'), $stock->getSupply('RS6'), $stock->getSupply('RS8'));

    return array(
      'global' => $maxQuantity ? $stock->getSupplyMessageHelper($maxQuantity) : Products::parseDelivery($this),
      'stores' => $stock->getSupplyMessage(),
    );
  }


  /**
   * Convert color to fabrics. Webshop use only
   *
   * - Collect color codes by Manufacturer -> $cache_manufacturerFabricCategories // => [NF2] = ["RK", "R"]
   * - Collect fabrics -> $cache_manufacturerFabricCategoryFabrics
   * {
   *  "NF2": {
   *    "kateg02": [{ title, image, colorHex, colorName }] // fabrics array
   *  }
   * }
   *
   * - Determine fabrics by color: RK => kateg02 => [{ fabric }, ...]
   *
   * @return [array]          [{title, image, colorHex, colorName}, ...]
   */
  public function getFabrics()
  {
    if (!$this->manufacturer)
    {
      $this::parseManufacturer($this);
    }

    $filter = DI::getDefault()->get('filter');

    global $cache_manufacturerFabricCategories;
    global $cache_manufacturerFabricCategoryFabrics;

    // Create library: Color code by manufacturer
    // [NF2] = ["RK", "R"]
    if (!$cache_manufacturerFabricCategories)
    {
      $query = $this->di->get('db')->query("
        SELECT
          *
        FROM
          szovetek.kategoriak
      ");

      $query->setFetchMode(
        \Phalcon\Db::FETCH_NUM
      );

      foreach($query->fetchAll() as $manufacturer)
      {
        foreach ($manufacturer as $i => $colorCategory)
        {
          if ($i < 1 || !$colorCategory) continue;

          // sanitize
          $colorCategory = $filter->sanitize(
            str_replace(['"', '.', ' ',':'], "", mb_strtolower($colorCategory)),
            'hungarian'
          );

          // remove extra info => 1.(Concept Kanapéágy)
          preg_match("/^([^(]*)(\((.+)\))?/", $colorCategory, $colorCategoryMatches);

          if (!isset($cache_manufacturerFabricCategories[$manufacturer[0]][$colorCategoryMatches[1]]))
          {
            $cache_manufacturerFabricCategories[$manufacturer[0]][] = $colorCategoryMatches[1];
          }

        }
      }

      // var_dump($cache_manufacturerFabricCategories['K45']); die();


      $query = $this->di->get('db')->query("
        SELECT
          prefix, kep, colorHex, colorName, megnevezes, kategoria
        FROM
          szovetek.szovetek
      ");

      /**
       * @example
       * {
       *  "NF2": {
       *    "kateg02": [{ title, image, colorHex, colorName }]
       *  }
       * }
       */
      foreach($query->fetchAll() as $fabric)
      {
        if (!isset($cache_manufacturerFabricCategoryFabrics[$fabric['prefix']]))
        {
          $cache_manufacturerFabricCategoryFabrics[$fabric['prefix']] = array();
          $cache_manufacturerFabricCategoryFabrics[$fabric['prefix']][$fabric['kategoria']] = array();
        }

        if (
          $fabric['megnevezes']
          && $fabric['kep']
          && $fabric['colorHex']
          && $fabric['colorName']
        )
        {
          $cache_manufacturerFabricCategoryFabrics[$fabric['prefix']][$fabric['kategoria']][] =
            array(
              'title' => $fabric['megnevezes'],
              'image' => $fabric['kep'],
              'colorHex' => $fabric['colorHex'],
              'colorName' => $fabric['colorName'],
            );
        }
      }
    }

    $getCategoryField = function($level)
    {
      $level = $level + 1;

      if ($level < 10)
      {
        $level = '0' . $level;
      }

      return 'kateg' . $level;
    };


    // Color category = brand (NF1)
    if ($this->color === $this->brand)
    {
      $fabrics = [];

      foreach ($cache_manufacturerFabricCategories[$this->manufacturer] as $colorCategory => $brands)
      {
        foreach (explode(',', $brands) as $brand)
        {
          if (mb_strtolower($this->brand) === mb_strtolower(trim($brand)))
          {
            $colorCategoryField = $getCategoryField($colorCategory);

            if (isset($cache_manufacturerFabricCategoryFabrics[$this->manufacturer][$colorCategoryField]))
            {
              foreach($cache_manufacturerFabricCategoryFabrics[$this->manufacturer][$colorCategoryField] as $fabric)
              {
                $fabrics[] = $fabric;
              }
            }
          };
        }
      }

      return $fabrics;
    }

    // determine colors
    if (isset($cache_manufacturerFabricCategories[$this->manufacturer]))
    {
      /**
      * @var [array] mix,V
      */
      $colors = \explode(',', $this->color);
      $color = sizeof($colors) == 1 ? $colors[0] : $colors[1];

      // indexOf color code
      $colorCategory = array_search(mb_strtolower($color), $cache_manufacturerFabricCategories[$this->manufacturer]);

      if ($colorCategory !== false)
      {
        $colorCategoryField = $getCategoryField($colorCategory);

        if (isset($cache_manufacturerFabricCategoryFabrics[$this->manufacturer][$colorCategoryField]))
        {
          return $cache_manufacturerFabricCategoryFabrics[$this->manufacturer][$colorCategoryField];
        }
      }
    }

    return array();
  }

  /**
   * Return Manufacturer Title, based on manufacturer's id (prefix)
   * @param  Products $product
   * @return null|string
   * @example
   * NF1
   * // => Délity Bútor Zrt.
   */
  public function getManufacturerTitle()
  {
    if (!$this->manufacturer)
    {
      $this::parseManufacturer($this);
    }

    global $manufacturerTitles;

    if (!$manufacturerTitles)
    {
      $query = $this->di->get('db')->query("
        SELECT
          nev, prefix
        FROM
          kozos.users
      ");

      foreach ($query->fetchAll() as $manufacturer)
      {
        $title = $manufacturer['nev'];

        if (preg_match('/(.*) ?\(.*\)$/', $title, $matches))
        {
          $title = trim($matches[1]);
        }

        $manufacturerTitles[$manufacturer['prefix']] = $title;
      }
    }


    if (!isset($manufacturerTitles[$this->manufacturer]))
    {
      return null;
    }

    return $manufacturerTitles[$this->manufacturer];
  }


  public function toWebProps()
  {
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


    /* !- Collect product props */

    // flags
    $productFlag = $this->getFlag();

    // flag translation or excluding
    $productWebshopFlag = array();

    foreach ($availableFlags as $flag)
    {
      if (in_array($flag, $productFlag))
      {
        $productWebshopFlag[] = $flag;
      }
    }

    if ($this->price_discount == 21)
    {
      $productWebshopFlag[] = 'VAT';
    }

    // feature

    $productFeatures = array();

    if ($this->features)
    {
      foreach(json_decode($this->features) as $id => $values)
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
    $productDescriptonFeatures = $this->description ? ['',''] : [];

    if (in_array('CLASS_2', $productWebshopFlag))
    {
      $productDescriptonFeatures[] = 'II. osztály';
    }

    $productFeaturesOrig = explode(',', $this->getFeatures_orig());

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

    // Méret leírások
    if (in_array($this->category, ['51']))
    {
      if (count($productDescriptonFeatures))
      {
        $productDescriptonFeatures[] = ''; //extra <BR>
      }
      $productDescriptonFeatures[] = '* <b>Méretek:</b> szélesség: karfa szélessége, magasság: háttámla magassága, mélység: ülőfelület mélysége';
    }

    return array(
      "id" => $this->id,
      // "related_id" => $this->related_id ?: $this->id,
      "brand" => $this->brand,
      "title" => $this->title,
      "subtitle" => $this->subtitle,
      "title_orig" => $this->title_orig,
      "flag" => $productWebshopFlag,
      "vat" => $this->vat,
      "price_sale_net" => $this->price_sale,
      "price_orig_gross" => $this->price_orig_gross,
      "price_sale_gross" => $this->price_sale_gross,
      "price_discount" => $this->price_discount,
      "manufacturer" => $this->manufacturer,
      "manufacturerTitle" => $this->getManufacturerTitle(),
      // "category" => $categories[$this->category]['title'],
      // "category" => $webCategory,
      "dimension" => json_decode($this->dimension, true),
      "features" => $productFeatures,
      "colors" => array(
        'category' => $this->color,
        'sum' => count($colorFabrics),
        'items' => $colorFabrics,
        // 'items' => array_slice($colorFabrics, 0, 15),
      ),
      "description" => nl2br($this->description) . implode('<br>', $productDescriptonFeatures),
      "images" => json_decode($this->images, true),
      "incart" => $this->incart,
      // "inoutlet" => $product::parseOutlet($product),
      "stock" => $this->getStock(),
      "priority" => $this->getPriority(),
    );
  }

  /* !- Helper methods */


  /**
   * Fetch products_flags priority
   * @return array { 'RSTOP': 100, ... }
   */
  static function getFlagsPriority()
  {
    global $cache_flagsPriority;

    if (!is_array($cache_flagsPriority) || sizeof($cache_flagsPriority) === 0)
    {
      $db = DI::getDefault()->get('db');

      $query = $db->query("
        SELECT
          id, priority
        FROM
          products_flags
        WHERE
          instore = 1
        ORDER BY
          priority DESC
      ");

      foreach($query->fetchAll() as $flagRecord)
      {
        $cache_flagsPriority[$flagRecord['id']] = $flagRecord['priority'];
      };
    }

    return $cache_flagsPriority;
  }


  /* !- DOS data parsers */

  /**
   * Set Flag
   * Remove prefix Flag: X, Y
   * Remove postfix Flag: KIF, RStop
   *
   * x: kifutott, rendszerben kivonásra került megjelennie nem kell a weboldalon.
   * y: új, belistázott termék ami még nincs élesítve, megjelennie szintén nem kell.
   * xy: elszúrták a termékfelvitelt ezért törlésre jelölték
   * ?r: megrendeléses termékre vonatkozik, csak az értékesítőnek információ, az oldalon ennek a jelölésnek nem kell megjelennie, de a terméknek igen!
   *
   * KRS: nincs kiállítva az áruházban, de a vevő rendelheti
   *
   * @param  [Product] $product
   * @return [string]  flag
   */
  static function parseFlag($product)
  {
    if (!$product || !$product->title_orig_rest)
    {
      return null;
    }

    $filter = DI::getDefault()->get('filter');

    $product->title_orig_rest = $filter->sanitize($product->title_orig_rest, 'hungarian');
    $title = $product->title_orig_rest;

    // remove prefix flag
    $preFixes = implode('|', [
      'y',
      'Y',
      'X',
      'Xy'
    ]);

    $preFixPattern = '/^((' . $preFixes . '))[A-ZÖÜÁÉÍŐÚŰ]+/m';
    preg_match($preFixPattern, $title, $flagMatches);

    if (\sizeof($flagMatches))
    {
      if (!isset($productFlag[$flagMatches[1]]))
      {
        if ($flagMatches[1] === 'Xy')
        {
          $product->addFlag("X");
          $product->addFlag("Y");
        }
        else
        {
          $product->addFlag(mb_strtoupper($flagMatches[1]));
        }
      }
      $title = trim(substr($title, strlen($flagMatches[1])));
    }

    // shortcut postfix flag KI
    if (\preg_match('/(.*)KI$/', $title, $flagMatches))
    {
      $title = $flagMatches[1] . 'KIF';
    }

    // remove postfix flag
    $postFixes = implode('|', [
      'KIF',
      'KIM',
      'KRS',
      'RStop',
    ]);

    $postFixPattern = '/((' . $postFixes . '))/m';

    preg_match_all($postFixPattern, $title, $flagMatches, PREG_SET_ORDER, 0);

    if (\sizeof($flagMatches))
    {
      foreach($flagMatches as $flag)
      {
          $product->addFlag($flag[0]);
      }

      $firstFlag = $flagMatches[0][0];
      $title = trim(substr($title, 0, strpos($title, $firstFlag)));
    }

    $product->title_orig_rest = $title;

    return $product->flag;
  }


  /**
   * parseFlag must be run first!!! Remove prefix flag
   * Remove brand code: Country-10 => Country, 10
   * Set Brand, and extend product's title with code
   *
   * @param  [Product] $product
   * @return [string]  brand
   */
  static function parseBrand($product)
  {
    if (!$product || !$product->title_orig_rest)
    {
      return null;
    }

    $title = $product->title_orig_rest;

    $product->brand = substr($title, 0, strpos($title, ' ')) ?: $title;

    if (preg_match('/^(x)([A-Z]{1}.+)/', $product->brand, $matches))
    {
      if ($matches[1] === 'x')
      {
        $product->addFlag('X');
        $product->brand = $matches[2];
      }
    }

    // remove brand
    if ($product->brand)
    {
      $product->title_orig_rest = trim(substr($title, strpos($title, $product->brand) + strlen($product->brand)));
    }

    // remove code
    // Country-21
    // Zero-19/B
    // Zero-18
    // DominoGo-1
    // Joy
    // Joy-1A
    // Joy-1NY
    // Farmer-7Ü
    $mergeBrandWithCode = array(
      'Country',
      'Zero',
      'DominoGo',
      'Joy',
      'Farmer',
      'Mozaik',
      'Box',
      'River',
      'Bling',
      'Idill',
      'Grande',
      'Free',
      'Rómeó',
      'Garda',
      'GardaPlusz',
      'Zsófia',
      'Júlia',
      'Pantergos',
    );

    $brandAndCode = explode('-', $product->brand);

    if (\sizeof($brandAndCode) == 2)
    {
      list($brand, $code) = $brandAndCode;

      if ($code && in_array($brand, $mergeBrandWithCode))
      {
        $product->brand = $brand;
        $product->title = "-{$code} {$product->title}";
      }
    }

    return $product->brand;
  }


  /**
   * Remove dictionary from DOS title
   * @param  [Product] $product
   * @return [string]  title_orig_rest
   */
  static function parseRestTitle($product)
  {
    if (!$product || !$product->title_orig_rest)
    {
      return null;
    }

    /**
     * Translated words in the title
     * @var array
     */
    $foundedWords = array();

    // second class: IIo, II.o
    if (preg_match('/([ .]|^)II[.]?o($| )/', $product->title_orig_rest, $matches))
    {
      $indexOf = strpos($product->title_orig_rest, $matches[0]);

      $product->title_orig_rest =
        substr($product->title_orig_rest, 0, $indexOf)
        . ' ' .
        substr($product->title_orig_rest, $indexOf + \strlen($matches[0]));

      // $foundedWords[] = 'II. osztály'; <- nem kell a subtitle-ben megjelennie
      $product->addFlag('CLASS_2');
    }

    /**
     * Those words in the title which is not translatable.
     */
    $titleRest = array();
    \preg_match_all('/([^ .\*\/-]+)/', $product->title_orig_rest, $titleMatches, PREG_SET_ORDER, 0);


    $productDimension = array_values($product->getDimension());

    foreach($titleMatches as $i => $titleWord)
    {
      $word = mb_strtolower($titleWord[0]);

      /**
       * Méret infok elhagyás
       */
      if (
        is_numeric($word)
        && in_array($word, $productDimension)
      )
      {
        continue;
      }


      /**
       * Ajtós, fiókos
       * @example
       * 4a2f => 4 ajtós 2 fiókos
       * 3 elemes
       */
      $translation = array(
        'a' => ' ajtós',
        'f' => ' fiókos',
        'ü' => ' üvegajtós',
        't' => ' tükörajtós',
        'k' => ' karfás',
        'elemes' => ' elemes',
        'mosdós' => ' mosdós',
        'sz' => ' személyes',
      );


      if (\preg_match_all('/[0-9]{1}(' . implode('|', array_keys($translation)) . ')/', $titleWord[0], $codeMatch))
      {
        foreach ($codeMatch[0] as $code)
        {
          // hack preg_match latin-2 return wrong char
          if (ord($code{1}) === 195)
          {
            $code = $code{0} . 'ü';
          }

          $foundedWords[] = strtr($code, $translation);
        }

        continue;
      }

      /**
       * Spec translate
       * @example
       * akasztós, polcos, nyitott...
       */
      $translation = array(
        'ak' => 'akasztós',
        'po' => 'polcos',
        'ny' => 'nyitott', // garnitúránál nyitható, szerkrény nyitott
        'nyit' => 'nyitott', // garnitúránál nyitható, szerkrény nyitott
        'kl' => 'keretléces',
        'kt' => 'középen tükrös',
        'ot' => 'oldal támlás',
        'j' => 'jobbos',
        'át' => 'ágyneműtartós',
        'lv' => 'lábvég',
        'kn' => 'karfa nélküli',
        'lt' => 'lábtartós',
        'fab' => 'fabetétes',
        'hk' => 'hátsó kárpitozott',
        'négyzet' => 'négyzet alakú',
        'szél' => 'széles',
        'kesk' => 'keskeny',
        'kont' => 'konténer',
        'fejt' => 'fejtámlás',
        'beé' => 'beépíthető',
        'beép' => 'beépíthető',
        'furn' => 'furnéros',
        'mos' => 'mosdós',
        'mosd' => 'mosdós',
        'bl' => 'blokk',
        'blok' => 'blokk',
        'tük' => 'tükrös',
        'tükr' => 'tükrös',
        'sarokp' => 'sarokpolc',
        'bm' => 'bézs márvány', // különben Bőrös lesz 1L0061606002
        // 'B' => 'balos', // ütközik a color code-al
      );

      if (\preg_match('/^(' . implode('|', array_keys($translation)) . ')$/i', $word))
      {
        $foundedWords[] = strtr($word, $translation);
        continue;
      }

      /**
       * szó + szám
       * @example
       * elem 10
       */
      $translation = array(
        'elem',
      );

      if (
        isset($titleMatches[$i+1])
        && \preg_match('/' . implode('|', $translation) . '[0-9]+$/', $word.$titleMatches[$i+1][0])
      ){
        $foundedWords[] = $word . ' ' . $titleMatches[$i+1][0];
        continue;
      }


      /**
       * Spec translate
       * @example
       * akasztós, polcos, nyitott...
       */
      $translation = array(
        'öltöző',
        'sarok',
        'záró',
        'nyitott',
        'tükrös',
        'tükör',
        'fogas',
        'cipős',
        'elem',
        'polcos',
        'fejtámla',
        'ottomán',
        'fix',
        'zsámoly',
        'pohártartó',
        'karos',
        'tégla',
        'hordó',
        'csepp',
        'nagy',
        'kicsi',
        'közepes',
        'hinta',
        'forgó',
        'fotelágy',
        'relax',
        'széles',
        'keskeny',
        'futon',
        'korlát',
        'emelt',
        'emeletes',
        'galériás',
        'rátét',
        'konténer',
        'favázas',
        'gázliftes',
        'inox',
        'indukciós',
        'fali',
        'ajtós',
        'kis',
        'karfás',
        'pad',
        'akasztható',
        'ráülhető',
        'alsó',
        'felső',
        'blokk',
        'mosdós',
        'álló',
        'racsni',
      );

      if (\preg_match('/^(' . implode('|', $translation) . ')/', $word))
      {
        if (
          !in_array($word, $foundedWords)
          && strpos($product->subtitle, $word) === false
        )
        {
          $foundedWords[] = $word;
        }
        continue;
      }


      /**
       * Elektromos gépek kódja
       * @example
       * AA12-AA2222
       * AA12+AA2222
       * min 4 char, AKC-R (akc) <- colorcode
       */
      // if (\preg_match('/^[ÁA-Z0-9]{4}/', $titleWord[0]))
      // {
      //   $foundedWords[] = $titleWord[0];
      //   continue;
      // }
      // if (
      //   preg_match('/^[A-ZÜÓÚÖŐŰÁÉÍ0-9+]+$/', $titleWord[0])
      // )
      // {
      //   // words of orig title, looking for '71-2A/2'
      //   foreach(explode(' ', $product->title_orig) as $titleOrigWord)
      //   {
      //     if (strpos($titleOrigWord, $titleWord[0]) !== false)
      //     {
      //       // find => remove orig_rest add title
      //       $foundedWords[] = $titleOrigWord;
      //       continue(2);
      //     }
      //   }
      // }

      /**
       * Akciós színkódok: Fekte, fehér, bézs...
       * Címhez adjuk hozzá
       */
      if (\preg_match('/^(' . implode('|', array_keys(Products::FABRIC_COLORS)) . ')$/', $word))
      {
        $product->title = $product->title . " (" . Products::FABRIC_COLORS[$word] . ")";
        continue;
      }

      /**
       * Kategória nevét kivesszük, ha minimum 4 karakter.
       */
      if (
        strlen($word) > 3
        && preg_match('/' . preg_quote($word, '/') . '/', mb_strtolower($product->categoryModel->title))
      )
      {
        continue;
      }


      $titleRest[] = $titleWord[0];
    }

    $product->title_orig_rest = implode(' ', $titleRest);


    // Add words to subtitle
    if (sizeof($foundedWords))
    {
      $product->addSubtitle($foundedWords);
      // $subTitleParts = $product->subtitle ? \explode(', ', $product->subtitle) : [];
      //
      // foreach($foundedWords as $word)
      // {
      //   if (!in_array($word, $subTitleParts))
      //   {
      //     $subTitleParts[] = $word;
      //   }
      // }
      //
      // $product->subtitle = \implode(', ', $subTitleParts);
    }

    return $product->title_orig_rest;
  }


  /**
   * Remove color code form DOS title
   *
   * @param  [Product] $product
   * @return [string]  brand
   */
  static function parseColor($product)
  {
    $product->color = '';

    if (\in_array($product->manufacturer, ['NF1', 'NF3']))
    {
      $product->color = $product->brand;
    }
    else
    {
      if (!$product || !$product->title_orig_rest)
      {
        return null;
      }

      // color codes
      $colorCodesSpecial = implode('|', [
        'Ex[0-9]*', // important order, because first apply
        'R[0-9K]*', // NF2 special category -> RK: akcios szin, R: nem akciós
        'p(ác)?[AE]{0,1}', //pác
        'bőr ?[0-9]{0,1}',
        'b',
        '[IVX]+',
      ]);

      $colorCodesSimple = implode('|', [
        '[A-F]{1}', // A
        '[0-9]{1}', // 1
      ]);

      $colorCodesExtras = implode('|', [
        'm',
        'mix',
        'AKC',
        'AKC R', // AKC-R
      ]);

      $productColor = [];

      if (preg_match('/(.*)(' . $colorCodesExtras . ')$/', $product->title_orig_rest, $colorMatches))
      {
        if ($colorMatches[2] === 'AKC R')
        {
          $productColor[] = 'AKC-R';
        }
        else
        {
          $productColor[] = $colorMatches[2];
        }
        $product->title_orig_rest = trim($colorMatches[1]);
      }

      $colorPatternSpecial = '/(^|[ .\/])"?((' . $colorCodesSpecial . '))[ .\/]?"?$/';
      $colorPatternSimple = '/(^|[ .\/])((' . $colorCodesSimple . '))[ .\/]?$/';
      // $colorPatternSpecial = '/(^|[ .\/])"?((' . $colorCodesSpecial . '))[ .\/]?"?((' . $colorCodesExtras . '))?$/';
      // $colorPatternSimple = '/(^|[ .\/])((' . $colorCodesSimple . '))[ .\/]?((' . $colorCodesExtras . '))?$/';

      // determine color code in the title
      preg_match($colorPatternSpecial, $product->title_orig_rest, $colorMatches);

      if (!$colorMatches && (!sizeof($productColor) || $productColor[0] !== 'AKC-R'))
      {
        preg_match($colorPatternSimple, $product->title_orig_rest, $colorMatches);
      }

      // product name without color code
      if (isset($colorMatches[1]))
      {
        $product->title_orig_rest =
          substr($product->title_orig_rest, 0, strrpos($product->title_orig_rest, $colorMatches[1]));
      }

      // primary color code: A, 1, IV, Ex ...
      if (isset($colorMatches[3]) && $colorMatches[3])
      {
        if ($colorMatches[3] === 'bõr' || $colorMatches[3] === 'b')
        {
          $colorMatches[3] = 'bőr';
        }

        else if ($colorMatches[3] === 'pA')
        {
          $colorMatches[3] = 'pácA';
        }

        else if ($colorMatches[3] === 'pE')
        {
          $colorMatches[3] = 'pácE';
        }

        $productColor[] = $colorMatches[3];
      }

      // secondary color code: mix
      if (isset($colorMatches[5]) && $colorMatches[5])
      {
        if ($colorMatches[5] === 'm')
        {
          $colorMatches[5] = 'mix';
        }

        $productColor[] = $colorMatches[5];
      }

      $product->color = implode(",", $productColor);
    }

    $productFabrics = $product->getFabrics();

    if ($product->color && !$productFabrics)
    {
      if (mb_strtolower($product->color) === 'b')
      {
        $product->addSubtitle('balos');
      }

      // missing color code
      // if (mb_strtolower($product->color) !== 'b' && $product->instore == 1)
      // {
      //   var_dump($product->color); die();
      // }

      $product->color = '';
    }

    // add special color flag
    foreach(explode(',', $product->color) as $color)
    {
      if (strrpos($color, 'bőr') !== false)
      {
        $product->addFlag('LEATHER');
      }
    }

    if ($product->color && count($productFabrics) > 1)
    {
      $product->addSubtitle('több színben');
    }

    return $product->color;
  }


  static function parseCode($product)
  {
    if (!$product || !$product->title_orig_rest)
    {
      return null;
    }

    $notMatchedWords = [];

    // rest words
    foreach(explode(' ', $product->title_orig_rest) as $rest)
    {
      if (
        preg_match('/^[A-ZÜÓÚÖŐŰÁÉÍ0-9+\/]+$/', $rest)
      )
      {
        // words of orig title, looking for '71-2A/2'
        foreach(explode(' ', $product->title_orig) as $word)
        {
          if (strpos($word, $rest) !== false)
          {
            // find => remove orig_rest add title
            $product->addSubtitle($word);
            continue(2);
          }
        }
      }

      $notMatchedWords[] = $rest;
    }

    $product->title_orig_rest = implode(' ', $notMatchedWords);
  }

  /**
   * Transform original DOS title to flag, brand, color, additional subtitle
   * @param  [Product] $product
   */
  static function parseDOSTitle($product)
  {
    if (!$product || !$product->title_orig)
    {
      return null;
    }

    $product->title_orig_rest = $product->title_orig;

    $product::parseFlag($product);
    $product::parseBrand($product);
    $product::parseRestTitle($product);
    $product::parseColor($product);
    $product::parseCode($product);
  }


  /**
   * Parse DOS dimension new format
   * @param  [Products] $product
   * @return [null|array]
   * @example
   *
   * 69*55*69
   * 44*55*39 +láb
   * 150*74/86*70
   * 140*74/86*98/60
   * átm.70 mag.50
   * átm.70 mag.45+görgõ
   * átm:45cm mag:50cm
   * 140*216 f.140*200
   */
  static function parseDimension($product)
  {
    if (!$product || !$product->dimension_orig)
    {
      return null;
    }

    $filter = DI::getDefault()->get('filter');

    $product->dimension = array();

    $regEx = '/^([0-9\/]+)[*x]([0-9\/]+)[*x]?([0-9\/]+)?/';

    if (preg_match($regEx, $product->dimension_orig, $matches))
    {
      foreach(self::DIMENSIONS as $index => $prop)
      {
        if (!isset($matches[$index + 1]))
        {
          break;
        }

        $propValues = explode('/', $matches[$index + 1]);

        foreach($propValues as $propIndex => $propValue)
        {
          $product->dimension[$prop . ($propIndex ? $propIndex : '')] = $propValue;
        }
      }
    }
    else
    {
      if (preg_match('/mag.([0-9]+)/', $product->dimension_orig, $matches))
      {
        $product->dimension['h'] = $matches[1];
      }
      if (preg_match('/átm.([0-9]+)/', $product->dimension_orig, $matches))
      {
        $product->dimension['Ø'] = $matches[1];
      }
    }

    // extra
    if (preg_match('/\+(\D+)$/', $product->dimension_orig, $matches))
    {
      $product->dimension['e'] = $filter->sanitize($matches[1], 'hungarian');
    }

    // 140*216 f.140*200
    if (preg_match('/[0-9]+\*[0-9]+ f\.([0-9]+)\*([0-9]+)/', $product->dimension_orig, $matches))
    {
      $product->dimension['w2'] = $matches[1];
      $product->dimension['h2'] = $matches[2];
      $product->dimension['e'] = 'fekvőfelület';
    }

    $product->dimension = json_encode($product->dimension, JSON_UNESCAPED_UNICODE);

    return $product->dimension;
  }

  /**
   * Return Manufacturer ID, based on product's id (sku)
   * @param  [Products] $product
   * @return [null|string]
   * @example
   * K260021101
   * // => K26
   */
  static function parseManufacturer($product)
  {
    if (!$product)
    {
      return null;
    }

    $availablePrefixes = array();

    for ($i = 1; $i <= 3; $i += 1)
    {
      $availablePrefixes[] = "'" . substr($product->id, 0, $i) . "'";
    }

    $db = DI::getDefault()->get('db');

    $query = $db->query("
      SELECT
        CHAR_LENGTH(prefix) as lenght, prefix
      FROM
        kozos.users
      WHERE
        prefix in (" . implode(',', $availablePrefixes) . ")
      ORDER BY
        lenght DESC
      LIMIT 1
    ");

    $product->manufacturer = $query->fetch()["prefix"];

    return $product->manufacturer;
  }


  /* !- Webshop pharser methods */



  /**
   * Create delivery informations
   * @param  [Products] $product
   * @return [string] [n] héten belül
   */
  static function parseDelivery($product)
  {
    if (!$product)
    {
      return null;
    }

    if (!$product->manufacturer)
    {
      $product::parseManufacturer($product);
    }

    if (!self::$deliveryManufacturer)
    {
      $db = DI::getDefault()->get('db');

      $query = $db->query("
        SELECT
          datum_rs7_1 as delivery, prefix
        FROM
          kozos.egyediidopont_bovitett
      ");

      /**
       * Delivery date by Manufacturer
       * @var [array]
       * @example
       * [NF2] = "2019-12-22"
       */
      self::$deliveryManufacturer = array();

      foreach($query->fetchAll() as $manufacturer)
      {
        self::$deliveryManufacturer[$manufacturer['prefix']] = $manufacturer['delivery'];
      }
    }

    if (isset(self::$deliveryManufacturer[$product->manufacturer]))
    {
      $deliveryDate = self::$deliveryManufacturer[$product->manufacturer];
      $deliveryUnixDate = strtotime($deliveryDate);

      if ($deliveryUnixDate)
      {
        $deliveryWeek = ceil(($deliveryUnixDate - time()) / (60 * 60 * 24) / 7);
        return "$deliveryWeek héten belül";
      }
    }

    return 'rendelésre';
  }


  static function parseWebCategory($product)
  {
    if (!$product)
    {
      return null;
    }

    if (!self::$webCategoriesMenu)
    {
      self::$webCategoriesMenu = new Menu();
    }

    $results = [];

    // features of product
    // @example {"31":"6"}
    $productFeatures = json_decode($product->features, true);


    // find web categories
    foreach(self::$webCategoriesMenu->_menu as $webCategory)
    {
      if ($webCategory['categories'])
      {
        $webCategoryCategories = json_decode($webCategory['categories'], true);

        if (isset($webCategoryCategories[$product->category]))
        {

          // @example {31: "6"}
          $categoryFeatures = $webCategoryCategories[$product->category];

          // no features filter
          // or product features same webcategory features
          if (
            !$categoryFeatures
            || (
              sizeof($productFeatures)
              && array_filter(
                $categoryFeatures,
                function($featureValue, $featureId) use ($productFeatures)
                {
                  return isset($productFeatures[$featureId]) &&
                    (
                      $featureValue == $productFeatures[$featureId] ||
                      (is_array($productFeatures[$featureId]) && in_array($featureValue, $productFeatures[$featureId]))
                    );
                },
                ARRAY_FILTER_USE_BOTH
              )
            )
          )
          {
            // collect category path to web format
            // @example Otthon/Hálószoba bútorok/Heverők
            $result = [];
            $webCategoryItem = self::$webCategoriesMenu->getItem($webCategory["id"]);

            /**
             * Product filter
             *
             * Operators
             * ==, >=, <=, !=, =*
             * @example
             * [
             *  "brand", "=*", "/^vénusz$/i",
             *  "price_sale_gross", ">=", "10"
             * ]
             */
            if ($webCategoryItem['products'])
            {
              $productFilters = json_decode($webCategoryItem['products']);

              if (!is_array($productFilters))
              {
                continue;
              }

              foreach($productFilters as $productFilter)
              {
                if (count($productFilter) !== 3)
                {
                  continue(2);
                }

                list($productFilterField, $productFilterOperator, $productFilterValue) = $productFilter;

                if (!property_exists($product, $productFilterField))
                {
                  continue(2);
                }

                switch ($productFilterOperator)
                {
                  case '==':
                    if ($productFilterValue != $product->{$productFilterField})
                    {
                      continue(3);
                    }
                    break;

                  case '>=':
                    if ((float) $product->{$productFilterField} < (float) $productFilterValue)
                    {
                      continue(3);
                    }
                    break;

                  case '<=':
                    if ((float) $product->{$productFilterField} > (float) $productFilterValue)
                    {
                      continue(3);
                    }
                    break;

                  case '!=':
                    if ($productFilterValue == $product->{$productFilterField})
                    {
                      continue(3);
                    }
                    break;

                  case '=*':
                    if (!preg_match($productFilterValue, $product->{$productFilterField}))
                    {
                      continue(3);
                    }
                    break;

                  default:
                    continue(3);
                    break;
                }
              }
            }

            foreach ($webCategoryItem['path'] as $id)
            {
              $title = self::$webCategoriesMenu->getItemTitle($id);

              if ($title)
              {
                $result[] = $title;
              }
            }

            // concate category path › Iroda/Irodabútorok/Szekrények
            $results[] = \implode('/', $result);
          }
        }
      }
    }

    return $results;
  }

  static function parseOutlet($product)
  {
    if (!$product)
    {
      return null;
    }

    if (!self::$outletDb)
    {
      $db = DI::getDefault()->get('db');

      $query = $db->query("
        SELECT
          cikkszam
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

      foreach($query->fetchAll() as $outlet)
      {
        self::$outletDb[] = $outlet['cikkszam'];
      }
    }

    return (int) in_array($product->id, self::$outletDb);
  }

}
