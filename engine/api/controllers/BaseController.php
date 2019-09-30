<?php

namespace App\Controllers;

use Phalcon\Events\Manager as EventsManager;

use
  \Phalcon\Events\Event,
  \Phalcon\Mvc\Controller,
  \App\Exceptions\HTTPException;

/**
 *  \Phalcon\Mvc\Controller has a final __construct() method, so we can't
 *  extend the constructor (which we will need for our Controller).
 *  Thus we extend DI\Injectable instead.
 */
class BaseController extends Controller
{
  public $restricted = true;
  public $eventsManager;

  public function onConstruct()
  {
    if (
      isset($this->config->application->restricted) &&
      is_bool($this->config->application->restricted)
    )
    {
      $this->restricted = $this->config->application->restricted;
    }

    if (isset($this->config->application->accessControlAllowOrigin))
    {
      $response = $this->di->get('response');
      $response->setHeader('Access-Control-Allow-Origin', $this->config->application->accessControlAllowOrigin);
    }

    $this->eventsManager = new EventsManager();

    $this->eventsManager->attach(
      'controller:respond',
      function (Event $event, $component, $data)
      {
        $records = [];

        // only one record [Object]
        if (!isset($data['records'][0]))
        {
          $data['records'] = [$data['records']];
        }

        if ($this->jsonFields)
        {
          foreach ($data['records'] as $record)
          {
            foreach ($this->jsonFields as $field)
            {
              if (!isset($record[$field]))
              {
                continue;
              }
              $record[$field] = is_null($record[$field]) ? [] : \json_decode($record[$field], true);
            }
            $records[] = $record;
          }
        }

        return $component->createResponse(
          count($records) ? $records : $data['records'],
          $data['meta']
        );
      }
    );
  }

  /**
  * Provides a base CORS policy for routes like '/users' that represent a Resource's base url
  * Origin is allowed from all urls.  Setting it here using the Origin header from the request
  * allows multiple Origins to be served.  It is done this way instead of with a wildcard '*'
  * because wildcard requests are not supported when a request needs credentials.
  *
  * @return true
  */
  public function optionsBase()
  {
    $response = $this->di->get('response');
    $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
    $response->setHeader('Access-Control-Allow-Origin', $this->di->get('request')->header('Origin'));
    $response->setHeader('Access-Control-Allow-Credentials', 'true');
    $response->setHeader('Access-Control-Allow-Headers', "origin, x-requested-with, content-type");
    $response->setHeader('Access-Control-Max-Age', '86400');

    return true;
  }

  /**
  * Provides a CORS policy for routes like '/users/123' that represent a specific resource
  *
  * @return true
  */
  public function optionsOne()
  {
    $response = $this->di->get('response');
    $response->setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS, HEAD');
    $response->setHeader('Access-Control-Allow-Origin', $this->di->get('request')->header('Origin'));
    $response->setHeader('Access-Control-Allow-Credentials', 'true');
    $response->setHeader('Access-Control-Allow-Headers', "origin, x-requested-with, content-type");
    $response->setHeader('Access-Control-Max-Age', '86400');

    return true;
  }

  /**
  * Basic Read All Actions
  */
  public function ReadAll($filters = array())
  {
    $this->validateRestricted();

    if (isset($this->listFields) && !sizeof($filters))
    {
      $columns = [];

      foreach (implode(',', $this->listFields) as $field)
      {
        $field = trim($field);

        if ($field)
        {
          $columns[] = $field;
        }
      }

      $filters = array(
        'columns' => explode(',', $columns)
      );
    }

    $model = new $this->model();
    $result = $model::find($filters);

    $this->respondWithConfig($result->toArray());
  }

  /**
  * One of Basic C(R)UD Actions
  */
  public function ReadOne($filters = 0, $columns = false)
  {
    $this->validateRestricted();

    if ($filters == 0)
    {
      $this->respondWithConfig(array());
    }

    if (is_array($filters))
    {
      $filters = implode($filters, ' AND ');
    }
    else
    {
      $filters = array("id = '{$filters}'");
    }

    if ($columns)
    {
      $filters = array(
        $filters,
        "columns" => $columns
      );
    }

    $model = new $this->model();
    $records = $model::find($filters);

    if ($records->count() !== 1)
    {
      throw new HTTPException(
        'Method Not Allowed',
        405,
        array(
          'level' => 'emergency',
          'code' => 'controller.base.readone',
          'dev' => array('message' => 'ReadOne not found record, check filters.', 'model' => $this->model, 'filters' => $filters)
        )
      );
    }

    $this->respondWithConfig($records[0]->toArray());
  }


  /**
  * One of Basic (C)RUD Actions
  */
  public function CreateOne($fetchFields = array())
  {
    $this->validateRestricted();
    $this->validateToken();

    $request 	= $this->di->get('request');
    $response = array();

    if (!$request->isPost())
    {
      return $this->respond(false);
    }

    if (isset($this->fetchFields) && !sizeof($fetchFields))
    {
      $fetchFields = $this->fetchFields;
    }

    if (count($fetchFields))
    {
      $affectedFields = array();

      foreach ($fetchFields as $field)
      {
        if ($field == 'id' || !$request->hasPost($field))
        {
          continue;
        }

        $affectedFields[$field] = $request->getPost($field);
      }
    }
    else
    {
      $affectedFields = $_POST;

      if (isset($affectedFields['id']))
      {
        unset($affectedFields['id']);
      }
    }

    if (count($affectedFields) < 1)
    {
      throw new HTTPException (
        'Bad request no affected fields',
        403,
        array(
          'code' => 'controller.base.create.form',
        )
      );
    }
    else
    {
      $model = new $this->model();

      if ($model->save($affectedFields) === false)
      {
        $errors = $model->getMessages() ?: [];

        throw new HTTPException (
          'Model save error',
          405,
          array(
            'code' => 'controller.base.Create',
            'dev' => implode(' -- ', $errors),
          )
        );
      }
    }

    $this->respondWithConfig($model->toArray());
  }


  /**
  * One of Basic CR(U)D Actions
  */
  public function UpdateOne($id, array $fetchFields = array(), $filters = array())
  {
    if ((string) $id === "0")
    {
      $this->CreateOne($fetchFields);
    }

    $this->validateRestricted();
    $this->validateToken();

    if (is_array($filters))
    {
      if (sizeof($filters))
      {
        $filters = implode($filters, ' AND ');
      }
      // default
      else
      {
        $filters = array("id = '{$id}'");
      }
    }
    else
    {
      $filters = array("id = '{$filters}'");
    }

    $request 	= $this->di->get('request');
    $response 	= array();

    $model     = new $this->model();
    $records    = $model::find($filters);

    if ($records->count() !== 1)
    {
      throw new HTTPException(
        'Method Not Allowed',
        405,
        array(
          'level' => 'emergency',
          'code' => 'controller.base.update',
          'dev' => array('message' => 'UpdateOne not found record, check filters', 'model' => $this->model, 'filters' => $filters)
        )
      );
    }

    if (isset($this->fetchFields) && !sizeof($fetchFields))
    {
      $fetchFields = $this->fetchFields;
    }

    $affectedFields = array();

    if (count($fetchFields))
    {
      $affectedFields = array();

      foreach ($fetchFields as $field)
      {
        if ($field == 'id' || !$request->hasPost($field))
        {
          continue;
        }

        $affectedFields[$field] = $request->getPost($field);
      }
    }
    else
    {
      $affectedFields = $_POST;

      if (isset($affectedFields['id']))
      {
        unset($affectedFields['id']);
      }
    }

    if (count($affectedFields) < 1)
    {
      throw new HTTPException(
        'Bad request no affected fields',
        403,
        array(
          'code' => 'controller.base.update.post',
        )
      );
    }
    elseif ($records[0]->save($affectedFields) === false)
    {
      throw new HTTPException (
        'Model Save error',
        500,
        array(
          'code' => 'controller.base.update.save',
          'dev' => implode(' -- ', $records[0]->getMessages()),
          )
        );
    }

    $this->respondWithConfig($records[0]->toArray());
  }


  /**
  * One of Basic CRU(D) Actions
  */

  public function DeleteOne($id, $filters = array())
  {
    $this->validateRestricted();

    if (is_array($filters))
    {
      if (sizeof($filters))
      {
        $filters = implode($filters, ' AND ');
      }
      else
      {
        $filters = array("id = {$id}");
      }
    }
    else
    {
      $filters = array("id = {$filters}");
    }

    $model     = new $this->model();
    $records    = $model::find($filters);

    if ($records->count() !== 1)
    {
      throw new HTTPException(
        'Method Not Allowed',
        405,
        array(
          'level' => 'emergency',
          'code' => 'controller.base.delete',
          'dev' => $this->model . ' ' . $filters
        )
      );
    }

    $record = $records[0];

    if ($records->delete() === false)
    {
      return $records->getMessages();
    }

    return $record;
  }

  /**
  * Return only config
  */

  public function readConfig()
  {
    $this->validateRestricted();
    $this->respondWithConfig(array());
  }


  /**
   * Create standard JSON response
   * @param  array $records
   * @param  array  [$meta]
   * @param  bool  [$error=false]
   */
  protected function respond($records, $meta = array(), $error = false)
  {
    $this->eventsManager->fire(
      'controller:beforeRespond',
      $this,
      array("records" => $records, "meta" => $meta, "error" => $error)
    );

    $this->eventsManager->fire(
      'controller:respond',
      $this,
      array("records" => $records, "meta" => $meta, "error" => $error)
    );
  }

  protected function createResponse($records, $meta = array(), $error = false)
  {
    $response = new \App\Responses\JSONResponse();
    $response
      ->useEnvelope(true)
      ->send($records, $meta, $error);

    exit();
  }


  /**
   * Inject config to response,
   * if setConfig method exist in the controller
   * @param  [array] $response CRUD response
   * @return [JSONResponse]
   */
  public function respondWithConfig($response)
  {
    $meta = array();

    if (method_exists($this,'setConfig'))
    {
      $meta = array('config' => $this->setConfig($response));
    }

    $this->respond($response, $meta);
  }

  /**
   * Validate request
   */
  public function validateRestricted()
  {
    if ($this->restricted && !$this->session->user)
    {
      throw new HTTPException(
        'Unauthorized Client',
        401,
        array(
          'level' => 'emergency',
          'code' => 'controller.validate.session'
        )
      );
    }
  }

  /**
   * Validate token
   */
  public function validateToken()
  {
    $request 	= $this->di->get('request');

    if (!$request->hasPost('token') || $request->getPost('token') !== 'pOIfdu4s')
    {
      throw new HTTPException(
        'Forbidden',
        403,
        array(
          'level' => 'emergency',
          'code' => 'controller.validate.token'
        )
      );
    }
  }

}
