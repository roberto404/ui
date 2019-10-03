<?php

use
  App\Models\Products;


define("FILE_PATH", __DIR__ . '/../../../public_html/kontakt2/json/');
define("FILE_NAME", 'stock.json');


class AnalyticsTask extends \Phalcon\CLI\Task
{
  const FILE_PATH = __DIR__ . '/../../../cache/task/';
  const FILE_NAME = 'analytics.json';
  const TMP_POSTFIX = '.task';

  public function mainAction()
  {
    echo "\nAvailable Stock actions: \033[1;33mcache\033[0m\n\n";
  }

  /**
   * Create cache file
   */
  public function cacheAction()
  {
    file_put_contents(
      self::FILE_PATH . self::FILE_NAME . self::TMP_POSTFIX,
      json_encode(
        $this->getSalesData()
        // , JSON_PRETTY_PRINT
      )
    );

    rename(
      self::FILE_PATH . self::FILE_NAME . self::TMP_POSTFIX,
      self::FILE_PATH . self::FILE_NAME
    );
  }

  /**
   * Get all saled products
   */
  private function getSalesData()
  {
    ini_set("memory_limit","1024M");

    $results = [];

    $query = $this->db->query("
      SELECT
        sor.id,
        CAST(fej.bolt AS SIGNED) as bolt,
        cikkszam,
        mennyiseg * if((sztorno = 'S'), -1, 1) as mennyiseg,
        round((ar * mennyiseg), 1) * if((sztorno = 'S'), -1, 1) as netto_osszesen,
        round((ar * mennyiseg), 1) * if((sztorno = 'S'), -1, 1) * (afa + 100) / 100 as brutto_osszesen,
        megnevezes,
        vhely,
        datum as datum,
        fej.bizkod,
        fej.munkaszam
      FROM
        rsdb.upload_szamla_sor as sor
      LEFT JOIN
        rsdb.upload_szamla_fej as fej
      ON
        (sor.file = fej.file)
      WHERE
        vnev NOT LIKE 'RS Bútorpiac Kft%' /* RS Árumozgás */
    ");

    /*
      RS Engedmény:

      AND
        (`mennyiseg` > 0 AND `osszesen_brutto` < 0) != 1
     */

    foreach ($query->fetchAll() as $record)
    {
      $product = new Products([
        'id' => $record['cikkszam'],
        'title_orig_rest' => $record['megnevezes'],
      ]);

      $results[] = array(
        'id' => $record['id'], // Id of purchase created by DOS
        'pi' => $record['cikkszam'],
        's' => $record['bolt'], // Store id: RS2, RS6, RS8
        'q' => $record['mennyiseg'], // Quantity
        'm' => $product::parseManufacturer($product), // Manufacturer
        'b' => $product::parseBrand($product), // Brand
        't' => $product->title_orig_rest, // Title of product without brand
        'p' => $record['netto_osszesen'],
        'p2' => $record['brutto_osszesen'],
        'l' => $record['vhely'], // Client's town
        'd' => $record['datum'],
        'sm' => $record['bizkod'], // Sales method (22 - prompt, 33 - order)
        'sp' => $record['munkaszam'],  // Salesperson
      );
    }

    return $results;
  }

}
