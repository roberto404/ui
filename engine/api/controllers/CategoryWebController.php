<?php

namespace App\Controllers;

use
  \App\Models\Categories,
  \App\Models\Features,
  \App\Exceptions\HTTPException;


class CategoryWebController extends BaseController
{
  // TODO:
  public $restricted = false;


  protected $model = 'App\Models\CategoriesWeb';
  protected $listFields = 'id, status, title, pid, pos';
  protected $fetchFields = array(
    'id',
    'status',
    'title',
    'pid',
    'pos',
    'categories',
  );


  public function setConfig($response)
  {
    $Categories = new $this->model();
    $categories = $Categories::find();

    return array('categories' => $categories);
  }

  // public function setConfig($response)
  // {
  //   $Categories = new Categories();
  //   $categories = $Categories::find();
  //
  //   $Features = new Features();
  //   $features = $Features::find();
  //
  //   return array(
  //     'categories' => $categories,
  //     'features' => $features,
  //   );
  // }
}
