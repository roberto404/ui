<?php

namespace App\Models;

use
  Phalcon\Mvc\Model;


class BaseModel extends Model
{
  static function findAndGroupByIndex($field = 'id', $filter = '')
  {
    $results = [];

    foreach (get_called_class()::find($filter) as $record)
    {
      $results[$record->$field] = $record->toArray();
    }

    return $results;
  }
}
