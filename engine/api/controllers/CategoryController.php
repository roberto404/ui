<?php

namespace App\Controllers;

use
  \App\Models\CategoriesWeb,
  \App\Models\Features,
  \App\Exceptions\HTTPException;


class CategoryController extends BaseController
{
  // TODO:
  public $restricted = false;


  protected $model = 'App\Models\Categories';
  protected $listFields = 'id, status, title, pid, pos';
  protected $fetchFields = array(
    'id',
    'status',
    'title',
    'pid',
    'pos',
    'featureRegEx',
  );

  public function setConfig($response)
  {
    $CategoriesWeb = new CategoriesWeb();
    $categoriesWeb = $CategoriesWeb::find();

    $Features = new Features();
    $features = $Features::find();

    return array(
      'categoriesWeb' => $categoriesWeb,
      'features' => $features,
    );
  }

}
