<?php

namespace App\Controllers;

use
  \Phalcon\Db\Column,
  \App\Models\Users,
  \App\Models\Rules,
  \App\Exceptions\HTTPException;


class UserController extends AppController
{
  protected $model = 'App\Models\Users';
  protected $listFields = 'id, status, email, name';
  protected $fetchFields = array(
    'status',
    'name',
    'password',
    'email',
    'permission',
  );

  /**
   * Create User session
   */
  private function startUserSession($user)
  {
    if (!$user->permission)
    {
      throw new HTTPException(
        'Forbidden',
        403,
        array(
          'code' => 'api.controller.user.login.permission'
        )
      );
    }

    $permission = [];
    $rules = Rules::find("id IN ({$user->permission})");

    foreach($rules as $rule)
    {
      $permission[$rule->modul] = array_merge(
        \json_decode($rule->rule, true),
        $permission[$rule->modul] ?: []
      );
    }

    $session = array(
      'id' => $user->id,
      'email' => $user->email,
      'name' => $user->name,
      'username' => $user->username,
      'permission' => $permission,
      'accounts' => array_map(
        function ($account)
        {
          return $account['username'];
        },
        Users::find("name = '{$user->name}' AND password = '{$user->password}' AND status = 1 AND permission != ''")->toArray()
      )
    );

    $this->session->set('user', $session);

    return $this->session->get('user');
  }

	/* !- Frontend API actions */

  /**
   * Login: create user session, if email and password matched and user status 1.
   * @return [Array] this.startUserSession => { id, email, name, permission... }
   */
  public function loginAction($md5 = true)
  {
    $this->validateToken();

    if (
      $this->request->isPost() &&
      $this->request->hasPost('email') &&
      $this->request->hasPost('password')
    )
    {
      $user = Users::findFirst(array(
        "conditions"    => "(username = :email: OR email = :email:) AND password = :password: AND status = 1",
        "bind"          => array(
          "email" => $this->request->getPost('email'),
          "password" => $md5 ?
            md5($this->request->getPost('password')) : $this->request->getPost('password')
        ),
        "bindTypes"     => array(
          "username"    => Column::BIND_PARAM_STR,
          "password"    => Column::BIND_PARAM_STR
        )
      ));

      if ($user)
      {
        $this->respond($this->startUserSession($user));
      }
    }

    throw new HTTPException(
      'Wrong user or password',
      401,
      array(
        'code' => 'api.controller.user.login'
      )
    );
  }

  /**
   * Logout destroy session
   */
  public function logoutAction()
  {
    $this->session->destroy();
    return true;
  }

  public function switchAccountAction()
  {
    $this->validateRestricted();

    if (
      $this->request->isPost() &&
      $this->request->hasPost('username')
    )
    {
      $currentUser = Users::findFirst($this->session->user['id']);

      $user = Users::findFirst(array(
        "conditions"    => "username = :username: AND password = :password: AND status = 1",
        "bind"          => array(
          "username" => $this->request->getPost('username'),
          "password" => $currentUser->password,
        ),
        "bindTypes"     => array(
          "username"    => Column::BIND_PARAM_STR,
          "password"    => Column::BIND_PARAM_STR
        )
      ));

      if ($user)
      {
        $this->respond($this->startUserSession($user));
      }
    }

    throw new HTTPException(
      'Forbidden',
      403,
      array(
        'code' => 'api.controller.user.switchAccount.nouser'
      )
    );
  }

}
