<?php

use App\Components\Menu;


class StockTask extends \Phalcon\CLI\Task
{
  const FILE_PATH = __DIR__ . '/../../../cache/task/';
  const FILE_NAME = 'stock.json';
  const TMP_POSTFIX = '.task';


  public function mainAction()
  {
    echo "\nAvailable Stock actions: \033[1;33mupdate, sync\033[0m\n\n";
  }

  /**
   * Create Stock cache file with database modified timestamp
   */
  public function updateAction()
  {
    $modifiedTimeStamp = $this->getModifyDateTime()->getTimestamp();

    file_put_contents(
      self::FILE_PATH . self::FILE_NAME . self::TMP_POSTFIX,
      json_encode(
        array(
          'status' => 'SUCCESS',
          'modified' => $modifiedTimeStamp,
          // 'records' => $this->getStockProDb()
          'records' => $this->getStock()
        ),
        JSON_UNESCAPED_UNICODE /*| JSON_PRETTY_PRINT*/
      )
    );

    rename(
      self::FILE_PATH . self::FILE_NAME . self::TMP_POSTFIX,
      self::FILE_PATH . self::FILE_NAME
    );

    touch(self::FILE_PATH . self::FILE_NAME, $modifiedTimeStamp);
  }

  /**
   * Observe the modified stock dateTime. If it changed, then update stock cache file
   */
  public function syncAction()
  {
    $currentTimeStamp = $this->getModifyDateTime()->getTimestamp();

    if (is_file(self::FILE_PATH . self::FILE_NAME))
    {
      $cachedTimeStamp = filemtime(self::FILE_PATH . self::FILE_NAME);
    }

    if (!isset($cachedTimeStamp) || $currentTimeStamp != $cachedTimeStamp)
    {
      $this->updateAction();
    }
  }

  /**
   * Get last modify date
   * @return [DateTime]
   */
  private function getModifyDateTime()
  {
    $query = $this->db->query("
      SELECT
        datum
      FROM
        rsdb.frissites
      WHERE
        tipus='1';
    ");

    $query->setFetchMode(
      \Phalcon\Db::FETCH_OBJ
    );

    return new DateTime(
      $query->fetch()->datum,
      new DateTimeZone($this->config->locale->timezone)
    );
  }

  /**
   * Get full stock database
   *
   * Gyártói minta (meg lehet nézni, de nem eladó): keszletrs2_gyartoi_minta
   * Kivett készle (???): keszletrs2_kivett_keszlet
   *
   * @return [array] [cikkszam, megneves, ar, keszlet...]
   */
  private function getStock()
  {
    $results = array();

    $query = $this->db->query("
      SELECT
        cikkszam, megnevezes, keszlet1, keszlet9, keszlet29, keszlet4, keszletrs2_gyartoi_minta, keszletrs6_gyartoi_minta, keszletrs8_gyartoi_minta, akcar_float, listaar, afa
      FROM
        rsdb.raktar
      WHERE
        megnevezes NOT LIKE 'X%' AND
        cikkszam NOT LIKE 'R%' AND
        megnevezes NOT LIKE 'RS %' AND
        megnevezes != '' AND
        listaar > 0
    ");

    $query->setFetchMode(
      \Phalcon\Db::FETCH_OBJ
    );

    foreach ($query->fetchAll() as $record)
    {
      $vat = ($record->afa / 100) + 1;

      $results[] = array(
        "id" => $record->cikkszam,
        "t" => $record->megnevezes,
        "rs2" => $record->keszlet1,
        "rs21" => $record->keszletrs2_gyartoi_minta,
        "rs6" => $record->keszlet29,
        "rs61" => $record->keszletrs6_gyartoi_minta,
        "rs8" => $record->keszlet9,
        "rs81" => $record->keszletrs8_gyartoi_minta,
        "r" => $record->keszlet4, // rendelés
        "p1" => round($record->akcar_float * $vat, -1),
        "p0" => round($record->listaar * $vat, -1),
      );
    }

    return $results;
  }


}
