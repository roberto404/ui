<?php

use
  App\Models\Products;

class AgentTask extends \Phalcon\CLI\Task
{
  public function mainAction()
  {
    echo "\nAvailable Agent actions: \033[1;33...\033[0m\n\n";
  }

  /**
   * Products have not category
   */
  public function productWithoutCategoryAction()
  {
    $products = Products::find('category = ""');

    foreach ($products as $product)
    {
      var_dump($product->id);
    }
  }

  public function missingWebProductsAction()
  {
    $cache = \file_get_contents(__DIR__ . '/../../../cache/task/webshop_stock.json');
    $json = json_decode($cache, true);

    $products = Products::find('instore = 1');
    $missingProducts = [];

    foreach($products as $product)
    {
      foreach($json as $jsonProduct)
      {
        if ($jsonProduct['id'] === $product->id)
        {
          continue 2;
        }
      }

      $missingProducts[] = $product->toArray();
    }

    var_dump(sizeof($missingProducts));
  }

  public function productWithoutDimensionAction()
  {
    $query = $this->db->query("
          SELECT
            products.id
          FROM
            categories, products
          WHERE
            (
              categories.template_title LIKE '%{dimension%'
                OR
              categories.template_subtitle LIKE '%{dimension%'
            )
            AND
              products.dimension IS NULL
            AND
              products.category = categories.id
      ");

      foreach($query->fetchAll() as $productDimension)
      {
        var_dump($productDimension['id']);
      }

  }

  public function productGroupDimensionAction()
  {
    $query = $this->db->query("
        SELECT
          related_id
        FROM
          site_kontakt.products
        GROUP BY
          related_id
        HAVING
          COUNT(DISTINCT dimension) > 1
      ");

      $relatedIds = [];

      foreach ($query->fetchAll() as $relatedProduct)
      {
        $relatedIds[] = $relatedProduct['related_id'];
      }

      if (count($relatedIds) > 0)
      {
        $products = Products::find([
          'related_id IN ({related_id:array})',
          'bind' => [
              'related_id' => $relatedIds
          ]
        ]);

        foreach ($products as $product)
        {
          var_dump($product->id);
        }
      }

  }

  public function categoryWithoutWebCategoryAction()
  {
    $query = $this->db->query("
      SELECT
        category
      FROM
        site_kontakt.products
      GROUP BY
        category
    ");

    $productCategories = [];
    foreach ($query->fetchAll() as $productCategory)
    {
      $productCategories[] = $productCategory['category'];
    }

    $query = $this->db->query("
      SELECT
        categories
      FROM
        site_kontakt.categories_web
      WHERE
        categories IS NOT NULL
      AND
        categories != ''
    ");

    $webCategories = [];
    foreach ($query->fetchAll() as $webCategory)
    {
      $thisWebCategory = json_decode($webCategory['categories'], true);
      foreach ($thisWebCategory as $key => $value) {
        $webCategories[] = $key;
      }
    }
    $webCategories = array_unique($webCategories);

    //print_r($productCategories);
    //print_r($webCategories);

    $diffArray = [];
    $diffArray = array_diff($productCategories, $webCategories);
    $diffArray = array_values($diffArray);
    print_r($diffArray);
  }

  /**
   * Related products categories or title or dimension not same
   */
  public function productRelatedPropsAction()
  {
    $query = $this->db->query("
      SELECT
        related_id
      FROM
        products
      WHERE
        `flag` NOT LIKE '%X%'
      GROUP BY
        related_id
      HAVING
        COUNT(distinct category) > 1
      OR
        COUNT(distinct brand) > 1
      OR
        COUNT(distinct title) > 1
      OR
        COUNT(distinct dimension) > 1
    ");

    $relatedIds = [];

    foreach ($query->fetchAll() as $relatedProduct)
    {
      $relatedIds[] = $relatedProduct['related_id'];
    }
    // var_dump($relatedIds);
    // die();

    if (count($relatedIds) > 0)
    {
      $products = Products::find([
        'related_id IN ({related_id:array})',
        'bind' => [
            'related_id' => $relatedIds
        ]
      ]);


      foreach ($products as $product)
      {
        $product->related_id = $product->id;

        if (!$product->save())
        {
          var_dump($product->getMessages());
        }
        // var_dump($product->id);
      }

    }


    echo count($relatedIds);
  }

  /**
   * Find Wrong related Id length and reset to product id
   */
  public function productRelatedIdAction()
  {
    $products = Products::find();

    foreach($products as $product)
    {
      $regex = '/^' . $product->related_id . '[0-9]{1}[A-Z]{0,2}$/m';

      if ($product->id !== $product->related_id && !preg_match($regex, $product->id))
      {
        $product->related_id = $product->id;
        $product->save();
      };
    }
  }

  public function productMissingColorAction()
  {
    //TODO Megane-LX forgószék (zöld) <- ezeknek sosincs színűk
    $products = Products::find('color = "" AND manufacturer IN ("NI") AND instore = "1"');

    foreach($products as $product)
    {
      var_dump($product->title_orig);
      // die();
    }
  }



  /**
   * Product has color code, but doesn't match fabrics database
   */
  public function productMissingFabricsAction()
  {
    $products = Products::find('color != ""');

    foreach($products as $product)
    {
      if (
        ($product->manufacturer == '1' && $product->color == 'R')
        || ($product->manufacturer == '8' && $product->color == 'R')
        || ($product->manufacturer == 'C4')
        || ($product->manufacturer == 'D8')
        || ($product->manufacturer == 'F13' && $product->color != 'pác')
        || ($product->manufacturer == 'F26' && $product->color == 'B') // valószínűleg balos
        || ($product->manufacturer == 'F27')

        || ($product->manufacturer == 'K40')
        || ($product->manufacturer == 'K49')
        || ($product->manufacturer == 'K55')
        || ($product->manufacturer == 'K65' && $product->color == 'B') // balos
        || ($product->manufacturer == 'K65' && $product->color == 'm')
        || ($product->manufacturer == 'K65' && $product->color == 'R')
        || ($product->manufacturer == 'M' && $product->color == 'R')
        // || ($product->manufacturer == 'NF1')
        // || ($product->manufacturer == 'NF3')
        || ($product->manufacturer == 'NK1')
        || ($product->manufacturer == 'NK2')
        || ($product->manufacturer == 'NK3')
        || ($product->manufacturer == 'NK8')
        || ($product->manufacturer == 'NK9')



        //in_array($product->id, ['1L009200600R'])
      )
      {
        continue;
      }
      if (!$product->getFabrics())
      {
        var_dump([
          'id' => $product->id,
          'flag' => $product->flag,
          'title_orig' => $product->title_orig,
          'color' => $product->color,
          'manufacturer' => $product->manufacturer,
        ]);
        // exit;
      }
    }
  }

  /**
   * Warning if there is a flag in the product, which is missing in the database (products_flags)
   */
  public function productFlagValidationAction()
  {
    $results = [];

    $query = $this->db->query('
      SELECT
        id
      FROM
        products_flags
    ');

    $query->setFetchMode(
      \Phalcon\Db::FETCH_ASSOC
    );;

    $availableFlags = [];

    foreach($query->fetchAll() as $productFlag)
    {
      $availableFlags[] = $productFlag['id'];
    };

    foreach (Products::find() as $product)
    {
      foreach($product->getFlag() as $flag)
      {
        if (!in_array($flag, $availableFlags) && !in_array($flag, $results))
        {
          $results[] = $flag;
        }
      }
    }

    var_dump($results);
  }
}
