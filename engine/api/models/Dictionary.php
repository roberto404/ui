<?php

namespace App\Models;

use
  Phalcon\Mvc\Model;


class Dictionary extends BaseConfigModel
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
    public $i18n;

    /**
     *
     * @var string
     */
    public $title;

    /**
     *
     * @var string
     */
    public $guide;
}
