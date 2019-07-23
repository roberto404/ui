<?php

use App\Components\Menu;


define("FILE_PATH", __DIR__ . '/../../../public_html/kontakt2/json/');
define("FILE_NAME", 'stock.json');


class StockTask extends \Phalcon\CLI\Task
{
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
      FILE_PATH . FILE_NAME,
      json_encode(
        array(
          'status' => 'SUCCESS',
          'modified' => $modifiedTimeStamp,
          // 'records' => $this->getStockProDb()
          'records' => $this->getStock()
        )
        // , JSON_PRETTY_PRINT
      )
    );

    touch(FILE_PATH . FILE_NAME, $modifiedTimeStamp);
  }

  /**
   * Observe the modified stock dateTime. If it changed, then update stock cache file
   */
  public function syncAction()
  {
    $currentTimeStamp = $this->getModifyDateTime()->getTimestamp();
    $cachedTimeStamp = filemtime(FILE_PATH . FILE_NAME);

    if ($currentTimeStamp != $cachedTimeStamp)
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
        frissites
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

  private function translation($value)
  {
    $translations = array(
	    'û'=>'ű', 'Ũ'=>'Ű',
	    'õ'=>'ő', 'Õ'=>'Ő'
		);

    return strtr($value, $translations);
  }

  private function getWebshopProducts()
  {
    $results = [];

    $query = $this->db->query("
      SELECT
        cikkszam, leiras
      FROM
        termek
      WHERE
        inaktiv = 0
    ");

    foreach ($query->fetchAll() as $record)
    {
      $results[$record['cikkszam']] = $this->translation($record['leiras']);
    }
    return $results;
  }

  /**
   * Get full stock database
   * @return [array] [cikkszam, megneves, ar, keszlet...]
   */
  private function getStock()
  {
    $results = array();

    $query = $this->db->query("
      SELECT
        cikkszam, megnevezes, keszlet1, keszlet9, keszlet29, keszlet4, keszlet2, keszletrs6m, keszletrs8m, akcar_float, listaar, afa, meret, arvalt, keszletrs7m, jellemzo
      FROM
        raktar
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
        "m" => $record->megnevezes,
        "k1" => $record->keszlet1,
        "k9" => $record->keszlet9,
        "k29" => $record->keszlet29,
        "k4" => $record->keszlet4,
        "k2" => $record->keszlet2,
        "k6" => $record->keszletrs6m,
        "k8" => $record->keszletrs8m,
        "k7" => $record->keszletrs7m,
        "a1" => round($record->akcar_float * $vat, -1),
        "a0" => round($record->listaar * $vat, -1),
        "av" => $record->arvalt,
        "d" => $record->meret,
        "j" => $record->jellemzo,
      );
    }

    return $results;
  }

  private function szotar()
  {
    $results = [];

    $query = $this->db->query("
      SELECT
        mit, mire
      FROM
        szotar
      WHERE
        statusz = 2
        AND hol_nev = 1
    ");

    foreach ($query->fetchAll() as $record)
    {
      $results[$record['mit']] = $record['mire'];
    }
    return $results;
  }

  private function getStockProDb()
  {
    $szotar = $this->szotar();
    $webshopProducts = $this->getWebshopProducts();

    $results = array();

    $categories = new Menu();

    // brands
    $query = $this->db->query("
      SELECT
        id, title, categories
      FROM
        brands
    ");

    $query->setFetchMode(
      \Phalcon\Db::FETCH_OBJ
    );

    $brands = $query->fetchAll();

    // stock
    $query = $this->db->query("
      SELECT
        cikkszam, megnevezes, keszlet1, keszlet9, keszlet29, keszlet4, keszlet2, keszletrs6m, keszletrs8m, akcar_float, listaar, afa, meret, arvalt, keszletrs7m, jellemzo
      FROM
        raktar
      WHERE
        megnevezes NOT LIKE 'X%' AND
        cikkszam NOT LIKE 'R%' AND
        megnevezes NOT LIKE 'RS %' AND
        megnevezes != '' AND
        listaar > 0
    ");
    // AND cikkszam IN ('" . implode("','", array_keys($webshopProducts)) . "')

    $query->setFetchMode(
      \Phalcon\Db::FETCH_OBJ
    );


    // parse all products
    foreach ($query->fetchAll() as $record)
    {
      // if ($record->cikkszam != 'F260711')
      // {
      //   continue;
      // }

      // find brand
      foreach ($brands as $brand)
      {
        $pattern = preg_quote($brand->title, '/');
        $regEx = "/^.*((".$pattern.") .*)|(".$pattern."(RSTOP))|(".$pattern.")$/";

        if (!preg_match($regEx, $record->megnevezes, $matches))
        {
          continue;
          // TODO: prefix
          // die();
        }

        $brandIndex = strpos(mb_strtolower($record->megnevezes), mb_strtolower($brand->title));

        // Found brand name in the title of product
        if ($brandIndex !== false)
        {
          if ($brandIndex !== 0)
          {
            // TODO: prefix
            var_dump($record->megnevezes);
          }

          $record->brand = $brand->title;
          $record->product = substr($record->megnevezes, $brandIndex + strlen($brand->title) + 1) ?: '';


          // fix: FEATURES
          $categoryTree = $categories->getItemPath($brand->categories);

          if (!$categoryTree)
          {
            var_dump('hibas kategoria: ' . $brand->categories . ' ==> '. $record->cikkszam);
            continue 2;
          }

          for ($i = 3; $i < sizeof($categoryTree); $i += 2)
          {
            $record->features[] = $categories->getItemTitle($categoryTree[$i-1]) . ": " . $categories->getItemTitle($categoryTree[$i]);
          }

          // fix: FEATURES with jellemzo field
          // collect
          $featureRegEx = [];

          foreach ($categoryTree as $categoryTreeItem)
          {
            $categoryTreeItemFeatureRegEx = $categories->getItem($categoryTreeItem)['featureRegEx'];

            if ($categoryTreeItemFeatureRegEx)
            {
              $jsonObj = json_decode($categoryTreeItemFeatureRegEx, true);

              if ($jsonObj === null && json_last_error() !== JSON_ERROR_NONE)
              {
                //todo error
                var_dump($categoryTreeItemFeatureRegEx);
              }
              else
              {
                foreach ($jsonObj as $regEx => $replacement)
                {
                  $featureRegEx[$regEx] = $replacement;
                }
              }

            }
          }

          // apply
          foreach (explode(',',  $record->jellemzo) as $feature)
          {
            foreach ($featureRegEx as $regEx => $replacement)
            {
              if (preg_match("/".$regEx."/", $feature, $matches))
              {
                if ($replacement)
                {
                  $newFeature = preg_replace('/\$1/', $matches[1], $replacement);

                  if (!isset($record->features[$newFeature]))
                  {
                    $record->features[] = $newFeature;
                  }
                }
                continue 2;
                // break;
              }
            }

            $record->noFeature[] = $feature;
          }

          // fix: CATEGORY
          $record->category = $categories->getItemTitle($categoryTree[1]);

          break;
        }
      }

      if (!isset($record->brand))
      {
        continue;
      }

      $vat = ($record->afa / 100) + 1;

      $results[] = array(
        "id" => $record->cikkszam,
        // "m" => strtr($record->megnevezes, array_merge($szotar, array('*' => 'x'))),
        // "k1" => $record->keszlet1,
        // "k9" => $record->keszlet9,
        // "k29" => $record->keszlet29,
        // "k4" => $record->keszlet4,
        // "k2" => $record->keszlet2,
        // "k6" => $record->keszletrs6m,
        // "k8" => $record->keszletrs8m,
        // "k7" => $record->keszletrs7m,
        // "a1" => round($record->akcar_float * $vat, -1),
        // "a0" => round($record->listaar * $vat, -1),
        // "av" => $record->arvalt,
        // "d" => $record->meret,
        // "j" => $record->jellemzo,
        "l" => isset($webshopProducts[$record->cikkszam]) ? $webshopProducts[$record->cikkszam] : '',
      );

      $record->product = $record->brand . " " . strtr($record->product, array_merge($szotar, array('*' => 'x')));

      if (isset($record->brand))
      {
        // matrac
        // {brand} {alapanyag} {kategoria} {szélesség}x{magassag}
        //
        if ($record->category == 'matrac')
        {
          if (preg_match('/^([0-9]+)\*([0-9]+)\*([0-9]+)$/m', $record->meret, $matches))
          {
            $record->product = $record->brand . " " . explode(': ', $record->features[0])[1] . " " . $record->category . " " . $matches[1] . "x" . $matches[3];
          }
        }

        $resultsIndex = count($results) - 1;
        // $results[$resultsIndex]["b"] = $record->brand;
        $results[$resultsIndex]["p"] = $record->product;
        $results[$resultsIndex]["f"] = implode('; ', $record->features);
        // $results[$resultsIndex]["f2"] = isset($record->noFeature) ? implode(', ', $record->noFeature) : '';
        $results[$resultsIndex]["c"] = $record->category;
      }
    }

    return $results;
  }

}
