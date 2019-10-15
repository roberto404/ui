<?php

namespace App\Models;

use
  Phalcon\Mvc\Model;


class BaseConfigModel extends Model
{
    // Create or update
    public function afterSave()
    {
      $this->updateCache();
    }

    public function afterDelete()
    {
      $this->updateCache();
    }

    private function updateCache()
    {
      putenv("SERVER_NAME=".$_SERVER['SERVER_NAME']);
      $r = exec('php ' . __DIR__ . '/../../cli/cli.php config cache  2>&1', $response);

      if ($respone)
      {
        error_log($response);
        // var_dump($response, $r);
        // die();
      }
    }
}
