<?php

namespace App\Models;

use
  Phalcon\Mvc\Model;


class ProductsFlags extends Model
{
  /**
   *
   * @var integer
   */
  public $id;

  /**
   *
   * @var string
   */
  public $title;

  /**
   *
   * @var integer
   */
  public $instore;

  /**
   *
   * @var integer
   */
  public $priority;

  /**
   *
   * @var string
   */
  public $description;


  public function initialize()
  {
    $this->setSource('products_flags');
  }
}
