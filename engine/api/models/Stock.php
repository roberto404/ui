<?php

namespace App\Models;

use
  App\Models\Products,
  Phalcon\DI,
  Phalcon\Mvc\Model;

class Stock extends Model
{
  /**
   *
   * @var string
   */
  public $cikkszam;

  /**
   *
   * @var string
   */
  public $megnevezes;

  /**
   *
   * @var string
   */
  public $meret;

  /**
   *
   * @var integer
   */
  public $afa;

  /**
   *
   * @var float
   */
  public $listaar_float;

  /**
   *
   * @var float
   */
  public $akcar_float;

  /**
   *
   * @var string
   */
  public $keszlet1;

  /**
   *
   * @var integer
   */
  public $keszlet2;

  /**
   *
   * @var string
   */
  public $jellemzo;

  /**
   * @depricated
   * @var integer
   */
  // public $abra;

  /**
   *
   * @var integer
   */
  public $arvalt;

  /**
   * @depricated
   * @var integer
   */
  // public $karpit;

  /**
   * ????
   * @var integer
   */
  public $nar;

  /**
   * ????
   * @var integer
   */
  public $torzsvalt;

  /**
   * @depricated
   * @var integer
   */
  // public $chk;

  /**
   * @depricated
   * @var integer
   */
  // public $vkod;




  /**
   * @var integer
   */
  public $meret_szelesseg1;

  /**
   * @var integer
   */
  public $meret_szelesseg2;

  /**
   * @var integer
   */
  public $meret_magassag1;

  /**
   * @var integer
   */
  public $meret_magassag2;

  /**
   * @var integer
   */
  public $meret_melyseg1;

  /**
   * @var integer
   */
  public $meret_melyseg2;

  /**
   * @var integer
   */
  public $fekvofelulet_szelesseg;

  /**
   * @var integer
   */
  public $fekvofelulet_magassag;

  /**
   * @var integer
   */
  public $fekvofelulet_melyseg;

  /**
   * @var integer
   */
  public $meret_egyeb;


  /* !- Methods of LifeCycles */

  public function initialize()
  {
    $this->setConnectionService('db.rsdb');
    $this->setSource('raktar');
  }

  public function getPriceSale()
  {
    return round($this->listaar_float, 2);
  }

  public function getPriceSaleGross()
  {
    return round($this->akcar_float * ($this->afa + 100) / 100);
  }

  public function getSupply($storeHouse = '')
  {
    if (!$storeHouse)
    {
      return array(
        'RS2' => $this->getSupply('RS2'),
        'RS6' => $this->getSupply('RS6'),
        'RS8' => $this->getSupply('RS8'),
      );
    }

    switch ($storeHouse)
    {
      case 'RS2':
        return $this->keszlet1;
      case 'RS6':
        return $this->keszlet29;
      case 'RS8':
        return $this->keszlet9;
    }

    return false;
  }

  /**
  * Convert stock quantity to human message
  * @param  string [$storeHouse]
  * @return string           ex.: raktáron
  */
  public function getSupplyMessage($storeHouse = '', $intl = true)
  {
    if (!$storeHouse)
    {
      return array(
        'RS2' => $this->getSupplyMessage('RS2', $intl),
        'RS6' => $this->getSupplyMessage('RS6', $intl),
        'RS8' => $this->getSupplyMessage('RS8', $intl),
      );
    }

    switch ($storeHouse)
    {
      case 'RS2':
        return $this->getSupplyMessageHelper($this->keszlet1, max($this->keszletrs2_gyartoi_minta, $this->keszletrs2_kivett_keszlet), null, $intl);
      case 'RS6':
        return $this->getSupplyMessageHelper($this->keszlet29, max($this->keszletrs6_gyartoi_minta, $this->keszletrs6_kivett_keszlet), null, $intl);
      case 'RS8':
        return $this->getSupplyMessageHelper($this->keszlet9, max($this->keszletrs8_gyartoi_minta, $this->keszletrs8_kivett_keszlet), null, $intl);
    }

    return false;
  }

  public function getSupplyMessageHelper($quantity, $sample = null, $limit = null, $intl = true)
  {
    if (!$sample)
    {
      $sample = 0;
    }

    if (!$limit)
    {
      $limit = 3;
    }
    
    if ($quantity <= 0)
    {
      if ($sample > 0)
      {
        return $intl ? 'megtekinthető': 0;
      }

      return $intl ? 'rendelhető': -1;
    }
    else if ($quantity <= $limit)
    {
      return $intl ? 'utolsó darabok' : 1;
    }

    return $intl ? 'készleten' : 2;
  }

  public function toProduct()
  {
    $product = new Products([
      'id' => $this->cikkszam,
      'title_orig' => $this->megnevezes,
      'vat' => $this->afa,
      'price_orig' => $this->listaar_float,
      'price_sale' => $this->akcar_float,
      'price_discount' => $this->cikkszam,
      'features_orig' => $this->jellemzo,
      'dimension_orig' => $this->meret,
      'dimension_orig_new' => [
        $this->meret_szelesseg1,
        $this->meret_szelesseg2,
        $this->meret_magassag1,
        $this->meret_magassag2,
        $this->meret_melyseg1,
        $this->meret_melyseg2,
        $this->fekvofelulet_szelesseg,
        $this->fekvofelulet_magassag,
        $this->fekvofelulet_melyseg,
        $this->meret_egyeb,
      ],
    ]);

    $product->beforeValidation();
    $product->beforeValidationOnCreate();

    return $product;
  }


  /**
   * Get last modify date
   * @return [DateTime]
   */
  static function getModifyDateTime()
  {
    $di = DI::getDefault();
    // $db = DI::getDefault()->get('db');

    $query = $di->get('db')->query("
      SELECT
        datum
      FROM
        rsdb.frissites
      WHERE
        tipus='1';
    ");

    $query->setFetchMode(
      \Phalcon\Db::FETCH_OBJ
    );

    return new \DateTime(
      $query->fetch()->datum,
      new \DateTimeZone($di->get('config')->locale->timezone)
    );
  }
}
