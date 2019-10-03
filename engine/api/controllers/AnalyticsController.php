<?php

namespace App\Controllers;

use
  \App\Exceptions\HTTPException;


class AnalyticsController extends AppController
{
  public function ReadAll($filters = array())
  {
    ini_set("memory_limit","1024M");
    
    $this->validateRestricted();
    // $permissionFilters = $this->getPermissionFilter();

    $cache = \file_get_contents(DOCUMENT_ROOT . 'cache/task/analytics.json');
    $this->createResponse(\json_decode($cache));
  }
}
