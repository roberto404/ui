<?php

use
  App\Models\Users,
  App\Models\Rules;

class UserTask extends \Phalcon\CLI\Task
{
  private $availableRules = [];

  public function mainAction()
  {
    echo "\nAvailable Stock actions: \033[1;33mupdateKontakt\033[0m\n\n";
  }

  public function syncAction()
  {
    $this->updateKontaktAction();
  }

  /**
   * fetch kozos.users and kozos.login and insert or update users db.
   * All user updating.
   */
  public function updateKontaktAction()
  {
    $query = $this->db->query("
      SELECT
        user, password, nev, email, jogok
      FROM
        kozos.users
    ");

    $query->setFetchMode(
      \Phalcon\Db::FETCH_OBJ
    );

    $kozosUsers = $query->fetchAll();
    $groupPermission = [];

    // group users
    foreach ($kozosUsers as $record)
    {
      $groupPermission[$record->user] = $record->jogok;

      if (!$record->password)
      {
        continue;
      }

      $user = Users::findFirst("username = '{$record->user}'");

      if (!$user)
      {
        $user = new Users();
      }

      $user->username = $record->user;
      $user->password = $record->password;
      $user->name = $record->nev;
      $user->email = $record->email;
      // $user->manufacturerId = 0;
      $user->permission = $this->convertKontaktPermission($groupPermission[$record->user], $user);


      if (!$user->save())
      {
        $errors = $user->getMessages();

        if (sizeof($errors) === 1 && $errors[0]->getField()=== 'email')
        {
          $user->email = '';
          $user->save();
        }
      };
    }

    $query = $this->db->query("
      SELECT
        user, password, nev, link
      FROM
        kozos.login
      WHERE
        password != ''
    ");

    $query->setFetchMode(
      \Phalcon\Db::FETCH_OBJ
    );

    $kozosLogin = $query->fetchAll();

    // simple users
    foreach ($kozosLogin as $record)
    {
      $user = Users::findFirst("username = '{$record->user}'");

      if (!$user)
      {
        $user = new Users();
      }

      $user->username = $record->user;
      $user->password = $record->password;
      $user->name = $record->nev;
      // $user->email = $record->email;
      // $user->manufacturerId = 0;
      if (isset($groupPermission[$record->link]))
      {
        $user->permission = $this->convertKontaktPermission($groupPermission[$record->link], $user);
      }

      if (!$user->save())
      {
        $errors = $user->getMessages();

        if (sizeof($errors) === 1 && $errors[0]->getField()=== 'email')
        {
          $user->email = '';
          $user->save();
        }
      };
    }
  }

  /**
   * Observe kontakt permission rule exist on rules database
   * @param  [string] $permissions Kontakt permission: 000010001...
   * @return [string]              5,10...
   */
  private function convertKontaktPermission($permissions, $user)
  {
    if (!count($this->availableRules))
    {
      $rules = Rules::find('status = 1');

      foreach ($rules as $rule)
      {
        $this->availableRules[] = $rule->id;
      }
    }

    $newPermissions = [];

    for ($i = 0; $i < strlen($permissions); $i++)
    {
      $ruleId = (string)($i + 1);

      if ($permissions{$i} != 0 && in_array($ruleId, $this->availableRules))
      {
        $newPermissions[] = $ruleId;
      }
    }

    foreach (explode(',', $user->permission) as $ruleId)
    {
      if ((int) $ruleId > 250 &&  in_array($ruleId, $this->availableRules))
      {
        $newPermissions[] = $ruleId;
      }
    }

    return implode(',', $newPermissions);
  }
}
