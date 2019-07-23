<?php

namespace App\Models;

use
  Phalcon\Mvc\Model,
  Phalcon\Validation,
  Phalcon\Validation\Validator\Uniqueness,
  Phalcon\Validation\Validator\Email as EmailValidator;


class Users extends Model
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
  public $email;

  /**
   *
   * @var string
   */
  public $manufacturerId;

  /**
   *
   * @var string
   */
  public $password;

  /**
   *
   * @var string
   */
  public $selfsign;

  /**
   *
   * @var string
   */
  public $name;

  /**
   *
   * @var string
   */
  public $permission;


  /* !- Methods of LifeCycles */

  public function beforeValidationOnCreate()
  {
    if (!$this->selfsign)
    {
      $this->selfsign = bin2hex(openssl_random_pseudo_bytes(16/2)); // bin2hex double size
    }

    if (!$this->password)
    {
      $this->password = $this->generatePassword(8);
    }

    $this->password = md5($this->password);

    if (!$this->status)
    {
      $this->status = 1;
    }

    if (!$this->manufacturerId)
    {
      $this->manufacturerId = 0;
    }
  }

  public function beforeValidation()
  {
    $validator = new Validation();

    $validator->add(
      'username',
      new Uniqueness([
        'model' => $this,
        'message' => 'user.username.uniqueness'
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

  /* !- Getter & Setter */

  // ..

	/* !- Public methods */

  /**
   * Validate that emails are unique across users
   */
  public function validation()
  {

  }



  /**
   * Create random string use latin-1 chars
   * @param  {integer} $length    length of string
   * @return {string}
   */
  static function generatePassword($length)
  {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return substr(str_shuffle($chars),0,$length);
  }
}
