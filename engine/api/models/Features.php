<?php

namespace App\Models;

use
  Phalcon\Mvc\Model;


class Features extends BaseModel
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
   * @var string
   */
  public $options;



  /* !- Methods of LifeCycles */

  public function beforeValidationOnCreate()
  {
    if (!$this->status)
    {
      $this->status = 1;
    }
  }

  /* !- Getter & Setter */

  // ..

	/* !- Public methods */

}
