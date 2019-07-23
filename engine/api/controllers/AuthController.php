<?php

namespace App\Controllers;

use
  Phalcon\Db\Column,
  App\Models\Administrators,
  App\Exceptions\HTTPException;


class AuthController extends AppController
{
  /**
   * Create User session
   */
  private function startUserSession($user)
  {
    $result = array(
      'id' => $user->id,
      'email' => $user->email,
      'name' => $user->name,
      'permission' => json_decode($user->permission, true),
    );

    $this->session->set('user', $result);

    return $this->session->get('user');
  }


  /**
   * Logout: Destroy session
   */
  public function logoutAction()
  {
    $this->session->destroy();
    return true;
  }


  /**
   * Login: create user session, if email and password matched and user status 1.
   * @return [Array] this.startUserSession => { id, email, name, permission... }
   */
  public function loginAction()
  {
    $this->validateToken();

    if (
      $this->request->isPost() &&
      $this->request->hasPost('email') &&
      $this->request->hasPost('password')
    )
    {
      $user = Administrators::findFirst(array(
        "conditions"    => "email = :email: AND password = MD5(:password:) AND status = 1",
        "bind"          => array(
          "email"  	    => $this->request->getPost('email'),
          "password"    => $this->request->getPost('password')
        ),
        "bindTypes"     => array(
          "email"       => Column::BIND_PARAM_STR,
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
}
