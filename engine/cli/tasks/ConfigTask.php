<?php

class ConfigTask extends \Phalcon\CLI\Task
{
  public function mainAction()
  {
    echo "\nThis is the default task and the default action \n";
  }

  public function updateAction()
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
        $results
        // JSON_PRETTY_PRINT
      )
    );
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
}
