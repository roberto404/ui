<?php

namespace App\Models;

use
  Phalcon\Mvc\Model,
  Phalcon\Validation,
  Phalcon\Validation\Validator\Uniqueness,
  Phalcon\Validation\Validator\Email as EmailValidator;


class Categories extends Model
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
  public $template_title;

  /**
   *
   * @var string
   */
  public $template_title_sub;

  /**
   *
   * @var string
   */
  public $features;

  /**
   *
   * @var string
   */
  public $featureRegEx;



  /* !- Methods of LifeCycles */

  public function beforeValidationOnCreate()
  {
    if (!$this->status)
    {
      $this->status = 1;
    }
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

    if (in_array($featureId, $features))
    {
      $this->features = \implode(',', array_diff($features, [$featureId]));
    }
  }

  /**
   * Return product's feature object from JSON
   * @return array { '32': '3' }
   */
  public function getFeatures()
  {
    return !$this->features ? [] : \explode(',', $this->features);
  }
}
