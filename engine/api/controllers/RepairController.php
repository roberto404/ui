<?php

namespace App\Controllers;

use
  \App\Models\Categories,
  \App\Models\Features,
  \App\Models\Products,
  \App\Exceptions\HTTPException;


class RepairController extends BaseController
{
  // TODO:
  // public $restricted = false;


  protected $model = 'App\Models\Stock';
  protected $listFields = '
    cikkszam as id,
    megnevezes,
    meret,
    afa,
    akcar_float,
    listaar_float,
    jellemzo,
    meret_szelesseg1,
    meret_szelesseg2,
    meret_magassag1,
    meret_magassag2,
    meret_melyseg1,
    meret_melyseg2,
    fekvofelulet_szelesseg,
    fekvofelulet_magassag,
    fekvofelulet_melyseg,
    meret_egyeb
  ';


  protected $fetchFields = array(
    'id',
    // 'brand',
    // 'title',
    'title_orig',
    // 'manufacturer',
    'price_orig',
    'price_sale',
    'vat',
    'category',
    'features',
    'features_orig',
    // 'dimension',
    'dimension_orig',
    'dimension_orig_new',
    // 'images',
  );

  public function ReadAll($filters = array())
  {
    ini_set("memory_limit","256M");

    // parent::ReadAll(array(
    //   'columns' => $this->listFields,
    //   'conditions' => 'megnevezes != "" AND eladar > 0',
    // ));



    $results = array();
    $fields = array();

    foreach (explode(",", $this->listFields) as $field)
    {
      $fields[] = "A." . trim($field);
    }

    // " . implode(", ", $fields) . "

    $query = $this->db->query("
      SELECT
        raktar.cikkszam as id, raktar.*
      FROM
        rsdb.raktar
      LEFT JOIN
        products
      ON
        raktar.cikkszam = products.id
      LEFT JOIN
        rsdb.termek
      ON
        raktar.cikkszam = termek.cikkszam
      WHERE
        products.id IS NULL
      AND
        termek.cikkszam IS NOT NULL
    ");

    foreach ($query->fetchAll() as $record)
    {
      if ($record['id'] == null)
      {
        continue;
      }

      $recordArray = array('id' => $record['id']);

      foreach (explode(",", $this->listFields) as $field)
      {
        if (trim($field) === 'cikkszam as id')
        {
          continue;
        }

        $recordArray[trim($field)] = $record[trim($field)];
      }

      $results[] = $recordArray;
    }

    $this->respondWithConfig($results);

    // return $results;
  }



  public function createProducts()
  {
    // $this->validateRestricted();
    // $this->validateToken();

    $request 	= $this->di->get('request');
    $response = array();
    $responseErrors = array();

    $items = json_decode($request->getPost('items'), true);


    foreach ($items as $item)
    {
      // var_dump($item);
      $product = new Products();

      $affectedFields = array();

      foreach ($this->fetchFields as $field)
      {
        if (!isset($item[$field]))
        {
          continue;
        }

        $affectedFields[$field] = $item[$field];
      }

      // var_dump($affectedFields);

      if ($product->save($affectedFields) === false)
      {
        $errors = $product->getMessages() ?: [];
        $responseErrors[] = $affectedFields;
      }
      else
      {
        $response[] = $product->toArray();
      }
    }

    $this->respond($response, array('errors' => $responseErrors));
  }

  public function setConfig($response)
  {
    $Categories = new Categories();
    $categories = $Categories::find();

    $Features = new Features();
    $features = $Features::find();

    return array(
      'categories' => $categories,
      'features' => $features,
    );
  }
}
