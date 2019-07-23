<?php

namespace App\Controllers;

use
  \App\Exceptions\HTTPException;

class AppController extends BaseController
{
  private function getColumns()
  {
    if ($this->listFields)
    {
      foreach (implode(',', $this->listFields) as $field)
      {
        $field = trim($field);

        if ($field)
        {
          $columns[] = $field;
        }
      }
      var_dump($this->listFields);
      var_dump(implode(',', $this->listFields));
      return explode(',', $columns);
    }
  }

  public function ReadAll($filters = array())
  {
    $permissionFilters = $this->getPermissionFilter();
    // $columns = $this->getColumns();

    if (!sizeof($filters))
    {
      $filters = $permissionFilters;
      $filters['columns'] = $this->listFields;
    }

    return parent::ReadAll($filters);
  }


  public function CreateOne($fetchFields = array())
  {
    $this->getPermissionFilter();
    return parent::CreateOne($fetchFields);
  }


  public function ReadOne($id, $columns = false)
  {
    $filters = $this->getPermissionFilter();
    $filters[] = "id = {$id}";

    return parent::ReadOne($filters, $columns);
  }


  public function UpdateOne($id, array $fetchFields = array(), $filters = array())
  {
    $permissionFilters = $this->getPermissionFilter();

    if (!sizeof($filters))
    {
      $filters = $permissionFilters;
      $filters[] = "id = '{$id}'";
    }

    return parent::UpdateOne($id, $fetchFields, $filters);
  }


  public function DeleteOne($id, $filters = array())
  {
    $permissionFilters = $this->getPermissionFilter();

    if (!sizeof($filters))
    {
      $filters = $permissionFilters;
      $filters[] = "id = {$id}";
    }

    return parent::DeleteOne($id, $filters);
  }


  /**
   * Return user permissions to the current controller action
   * @return [array] permission filters
   *
   * @example
   * // user session ['permission']
   * 'user' => ['ReadAll' => ['status = 1']]
   *
   * //=> ReadAll action returns only status = 1 users
   */
  protected function getPermissionFilter()
  {
    $user = $this->session->get('user');
    $caller = debug_backtrace()[1];

    // "vehicle"
    // $controller = strtolower(preg_replace("/^App\\\\Controllers\\\\(.+)Controller$/", '${1}', $caller['class']));
    $controller = strtolower(preg_replace("/^App\\\\Models\\\\(.+)/", '${1}', $this->model));
    // "DeleteOne"
    $action = $caller['function'];

    // App contorller global validation;
    if (
      !isset($user['permission'])
      || !isset($user['permission'][$controller])
      || !isset($user['permission'][$controller][$action])
    )
    {
      throw new HTTPException(
        'Forbidden',
        403,
        array(
          'level' => 'emergency',
          'code' => 'api.controller.app.permission',
          'dev' => array(
            'request' => "{$controller} > {$action}",
            'permission' => $user['permission']
          )
        )
      );
    }

    return $user['permission'][$controller][$action];
  }


  protected function validationByIp()
  {
    $REMOTE_ADDRESSES = [
      '178.48.28.37', // rs iroda
      '80.99.228.103', // home
      '80.99.198.36', // home
      '5.56.32.42', // rs.hu
      '173.249.11.34', // avocado.hidden.hu, donebox
      '86.101.67.67', //done iroda
      '89.133.23.70', //jozsi otthon
      '89.133.123.170', //bartos otthon
    ];

    try
    {
      $this->validateRestricted();
    }
    catch (HTTPException $e)
    {
      if (!in_array($_SERVER["REMOTE_ADDR"], $REMOTE_ADDRESSES))
      {
        throw($e);
      }

      $this->validateToken();
    }
  }
}
