<?php

use
  App\Models\Users,
  App\Models\Manufacturer;

class UserTask extends \Phalcon\CLI\Task
{
  public function mainAction()
  {
    echo "\nAvailable Stock actions: \033[1;33m...\033[0m\n\n";
  }


  // public function updateKontaktManufacturerAction()
  // {
  //   $query = $this->db->query("
  //     SELECT
  //       prefix, nev, email, kapcsnev, irsz, hely, utcahsz
  //     FROM
  //       kozos.users
  //   ");
  //
  //   $query->setFetchMode(
  //     \Phalcon\Db::FETCH_OBJ
  //   );
  //
  //   $kozosUsers = $query->fetchAll();
  //
  //   // group users
  //   foreach ($kozosUsers as $record)
  //   {
  //     $manufacturer = Manufacturer::findFirst("username = '{$record->user}'");
  //
  //     if (!$manufacturer)
  //     {
  //       $manufacturer = new Manufacturer();
  //     }
  //
  //     $manufacturer->username = $record->user;
  //
  //     if (!$manufacturer->save())
  //     {
  //       $errors = $manufacturer->getMessages();
  //
  //       if (sizeof($errors) === 1 && $errors[0]->getField()=== 'email')
  //       {
  //         $manufacturer->email = '';
  //         $manufacturer->save();
  //       }
  //     };
  //   }
  // }

}
