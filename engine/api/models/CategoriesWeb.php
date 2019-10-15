<?php

namespace App\Models;

use
  Phalcon\Mvc\Model;


class CategoriesWeb extends BaseConfigModel
{
  /**
   *
   * @var integer
   */
  public $id;

  /**
   *
   * @var integer
   */
  public $status;

  /**
   *
   * @var string
   */
  public $title;

  /**
   *
   * @var integer
   */
  public $pid;

  /**
   *
   * @var integer
   */
  public $pos;

  /**
   *
   * @var string
   */
  public $props;



  /* !- Methods of LifeCycles */

  public function beforeValidationOnCreate()
  {
    if (!$this->status)
    {
      $this->status = 1;
    }
  }

}
