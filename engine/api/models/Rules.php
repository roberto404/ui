<?php

namespace App\Models;

use
  Phalcon\Mvc\Model,
  Phalcon\Validation,
  Phalcon\Validation\Validator\Uniqueness,
  Phalcon\Validation\Validator\Email as EmailValidator;


class Rules extends Model
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
  public $modul;

  /**
   *
   * @var string
   */
  public $title;

  /**
   *
   * @var string
   */
  public $rule;

  /**
   *
   * @var string
   */
  public $guide;


}
