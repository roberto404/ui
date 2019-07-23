<?php

namespace App\Controllers;

use
  \App\Exceptions\HTTPException;


class LoyalityController extends AppController
{
  public function TotalAmount()
  {
    $this->validationByIp();

    $query = $this->db->query("
      SELECT
        count(vevokod) as total
      FROM
        rendeles.torzsvasvevo
      WHERE
        vevokod LIKE '25%'
      AND
        pnev != ''
    ");

    $this->respond([
      'totalAmount' => $query->fetch()['total'] * 50000,
    ]);
  }


  public function GetUserTransactions()
  {
    $this->validationByIp();

    $request = $this->di->get('request');

    if (!$request->hasPost('cardnum') || !$request->hasPost('email'))
    {
      throw new HTTPException(
        'Bad Request',
        400,
        array(
          'level' => 'emergency',
          'code' => 'api.controller.loyality.getusertransactions.norequest'
        )
      );
    }

    $cardnum = $request->getPost('cardnum', 'absint');
    $email = $request->getPost('email', 'email');

    if (!$email || !$cardnum)
    {
      throw new HTTPException(
        'Bad Request',
        400,
        array(
          'level' => 'emergency',
          'code' => 'api.controller.loyality.getusertransactions.badrequest',
          'dev' => array(
            'sanitizedEmail' => $email,
            'sanitizedCardnum' => $cardnum,
          )
        )
      );
    }

    $results  = [];
    $cardnumPrefix = substr($cardnum, 0, 3);

    /**
     * Vasarlas erteke utan kapott pont (szazalekos ertek)
     */
    $usablePercentage = [
      '030' => 0.05, // régi sárga papir RS kártya
      '130' => 1, // vásárlási utalvány
      '131' => 1,
      '250' => 0.05, // új otthon kártya
      '260' => 0.05, // business kártya
      '261' => 0.05,
      '262' => 0.05,
      '263' => 0.05,
    ];

    /**
     * Az összpont hány százaléka használható fel.
     */
    $totalUsablePercentage = [
      '030' => 1, // régi sárga papir RS kártya
      '130' => 1, // vásárlási utalvány
      '131' => 1,
      '250' => 1, // új otthon kártya
      '260' => 1, // business kártya
      '261' => 0,
      '262' => 0,
      '263' => 0,
    ];

    $query = $this->db->query("
      SELECT
        forg.vevokod,
        forg.datum,
        forg.osszeg,
        forg.kedvezm
      FROM
        rendeles.torzsvasforg as forg
      LEFT JOIN
        rendeles.torzsvasvevo as vevo
      ON
        vevo.vevokod = forg.vevokod
      WHERE
        vevo.vevokod = '$cardnum'
      AND
        vevo.email = '$email'
      ORDER BY
        forg.datum
    ");

    $queryResults = $query->fetchAll();

    if (
      !$queryResults
      || !isset($usablePercentage[$cardnumPrefix])
      || !isset($totalUsablePercentage[$cardnumPrefix])
    )
    {
      throw new HTTPException(
        'Forbidden',
        403,
        array(
          'level' => 'emergency',
          'code' => 'api.controller.loyality.getusertransactions.norecord',
          'dev' => array(
            'sanitizedCardnum' => $cardnum,
            'cardnumPrefix' => $cardnumPrefix,
            'queryResults' => count($queryResults),
          )
        )
      );
    }

    foreach ($queryResults as $record)
    {
      $transaction = [
        'cardnum' => $cardnum,
        'date' => $record['datum'],
      ];

      $transaction['amount'] += floor($record['osszeg'] * $usablePercentage[$cardnumPrefix]);
      $transaction['amount'] -= floor($record['kedvezm']);

      $results['transactions'][] = $transaction;
      $results['totalAmount'] += $transaction['amount'];
    }

    $results['usableAmount'] = $results['totalAmount'] * $totalUsablePercentage[$cardnumPrefix];

    $this->respond($results);
  }


}
