<?php

namespace App\Models;

use
  Phalcon\Mvc\Model,
  Phalcon\Validation,
  Phalcon\Validation\Validator\Uniqueness,
  Phalcon\Validation\Validator\Email as EmailValidator;


class Manufacturers extends Model
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
  public $prefix;

  /**
   *
   * @var string
   */
  public $rs;

  /**
   *
   * @var string
   */
  public $title;

  /**
   *
   * @var string
   */
  public $email;

  /**
   *
   * @var string
   */
  public $zipcode;

  /**
   *
   * @var string
   */
  public $city;

  /**
   *
   * @var string
   */
  public $address;

  /**
   *
   * @var string
   */
  public $contactName;

  /**
   *
   * @var string
   */
  // public $permission;


  /* !- Methods of LifeCycles */

  public function beforeValidationOnCreate()
  {
    if (!$this->status)
    {
      $this->status = 1;
    }
  }

  public function beforeValidation()
  {
    $validator = new Validation();

    $validator->add(
      'title',
      new Uniqueness([
        'model' => $this,
        'message' => 'user.title.uniqueness'
      ])
    );

    if (!empty($this->email))
    {
      $validator->add(
        'email',
        new Uniqueness([
          'model' => $this,
          'message' => 'user.email.uniqueness'
        ])
      );
      // $validator->add(
      //   'email',
      //   new EmailValidator([
      //     'model' => $this,
      //     'message' => 'user.email.validator'
      //   ])
      // );
    }

    return $this->validate($validator);
  }
}
