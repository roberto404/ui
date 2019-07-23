<?php

namespace App\Controllers;

use
  \App\Models\Dictionary,
  \App\Exceptions\HTTPException;


class DictionaryController extends BaseController
{
  protected $model = 'App\Models\Dictionary';
  protected $listFields = 'id, i18n, title, guide';
  protected $fetchFields = array(
    'id',
    'i18n',
    'title',
    'guide',
  );
}
