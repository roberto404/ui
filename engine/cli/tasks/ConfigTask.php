<?php

use
  App\Models\Config,
  \App\Exceptions\HTTPException;


class ConfigTask extends \Phalcon\CLI\Task
{
  public function mainAction()
  {
    var_dump($this->getConfig());
    echo "\nThis is the default task and the default action \n";
  }

  public function syncAction()
  {
    $this->cacheAction();
  }

  public function cacheAction()
  {
    $this->cacheWebsiteAction();
  }

  public function cacheKontakt2Action()
  {
    define("APP_DIR", __DIR__ . '/../../../public_html/kontakt2/json/');
    define("FILE_NAME", 'app.json');

    $results = array(
      "document" => array(
        "language" => "hu",
        "regionCode" => "hu",
        "regionName" => "Hungary",
        "token" => "pOIfdu4s",
        "charset" => "utf-8",
        "title" => "RS",
        "baseDir" => "/",
        "staticFilePrefix" => "app@"
      ),
      "application" => array(
        "id" => "rs",
        "password" => "aRSa0vn1",
        "global" => false,
      ),
      "project" => array(
        "dictionary" => $this->getDictionary(),
      )
    );

    file_put_contents(
      APP_DIR . FILE_NAME,
      json_encode(
        $results,
        JSON_UNESCAPED_UNICODE /*| JSON_PRETTY_PRINT*/
      )
    );
  }

  public function cacheWebsiteAction()
  {
    define("APP_DIR", __DIR__ . '/../../../public_html/website/json/');
    define("FILE_NAME", 'app.json');

    $results = array(
      "document" => array(
        "language" => "hu",
        "regionCode" => "hu",
        "regionName" => "Hungary",
        "token" => "pOIfdu4s",
        "charset" => "utf-8",
        "title" => "HA BÚTORT KERES, RS! - A legjobb választás otthonába, konyhájába, irodájába!",
        "baseDir" => "/",
        "staticFilePrefix" => "app@"
      ),
      "application" => array(
        "id" => "rsWeb",
        "password" => "aRSa0Vn1",
        "global" => false,
      ),
      "project" => array_merge(
        $this->getProducts(),
        array(
          "constants" => $this->getConfig(),
          // "dictionary" => $this->getDictionary(),
        )
      ),
    );

    file_put_contents(
      APP_DIR . FILE_NAME,
      json_encode(
        $results,
        JSON_UNESCAPED_UNICODE /*| JSON_PRETTY_PRINT*/
      )
    );
  }

  private function getProducts()
  {
    ini_set("memory_limit","150M");
    $file = __DIR__ . '/../../../cache/task/products.json';

    if (!is_file($file))
    {
      throw new HTTPException(
        'Method Not Allowed',
        405,
        array(
          'level' => 'emergency',
          'code' => 'task.config.getProducts',
          'dev' => array(
            'message' => 'Cache file missing',
            'filePath' => $file,
          ),
        )
      );
    }

    $cache = \file_get_contents($file);
    $json = json_decode($cache, true);

    if (!$json)
    {
      throw new HTTPException(
        'Method Not Allowed',
        405,
        array(
          'level' => 'emergency',
          'code' => 'task.config.getProducts',
          'dev' => array(
            'message' => 'Cache file missing',
            'filePath' => $file,
          ),
        )
      );
    }

    return array_merge(['products' => $json['records']], $json['config']);
  }

  private function getDictionary()
  {
    $results = array();

    $query = $this->db->query("
      SELECT
        i18n, title
      FROM
        dictionary
    ");

    foreach ($query->fetchAll() as $record)
    {
      $results[$record['i18n']] = $record['title'];
    }

    return $results;
  }

  private function getConfig()
  {
    $results = array();

    foreach (Config::find([ 'columns' => 'title, options' ]) as $record)
    {
      $results[$record->title] = $record->options;
    }

    return $results;
  }
}
