<?php

namespace App\Models;

use
  Phalcon\Mvc\Model;


class Config extends Model
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
   * @var string
   */
  public $options;

  /**
   *
   * @var string
   */
  public $guide;
}
