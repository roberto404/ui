<?php

namespace App\Models;

use
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
        return $this->keszletrs6;
      case 'RS8':
        return $this->keszletrs8;
    }
    return false;
  }
}
