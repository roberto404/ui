<?php

namespace App\Controllers;

use
  \Phalcon\Events\Event,
  \App\Models\CategoriesWeb,
  \App\Exceptions\HTTPException;


class WebsiteController extends BaseController
{
  // TODO:
  public $restricted = false;




  public $jsonFields = array(
    'props',
  );

  public function readAllMenu()
  {
    $this->model = 'App\Models\CategoriesWeb';
    $this->readAll();
  }

  public function createOneMenu()
  {
    $this->eventsManager->attach(
      'controller:beforeRespond',
      function (Event $event, $component, $data)
      {
        $nextRecord = $data['records'];

        $component->siblingReposition($nextRecord['id'], $nextRecord['pid']);

        /**
         * Respond ReadAll records.
         */
        // $this->eventsManager->detachAll('controller:beforeRespond'); // ???
        $this->eventsManager->detachAll();

        // same basecontroller response.... :(((
        $this->eventsManager->attach(
          'controller:beforeRespond',
          function (Event $event, $component, $data) use ($prevRecord)
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

        $component->readAllMenu();
      }
    );


    $this->model = 'App\Models\CategoriesWeb';
    $this->createOne($fetchFields = array());
  }


  public function deleteOneMenu($id)
  {
    $prevRecord = CategoriesWeb::findFirst("id = {$id}")->toArray();

    $this->eventsManager->attach(
      'controller:beforeRespond',
      function (Event $event, $component, $data) use ($prevRecord)
      {
        $component->siblingReposition(0, $prevRecord['pid']);

        /**
         * Respond ReadAll records.
         */
        // $this->eventsManager->detachAll('controller:beforeRespond'); // ???
        $this->eventsManager->detachAll();

        // same basecontroller response.... :(((
        $this->eventsManager->attach(
          'controller:beforeRespond',
          function (Event $event, $component, $data) use ($prevRecord)
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

        $component->readAllMenu();
      }
    );


    $this->model = 'App\Models\CategoriesWeb';
    $this->deleteOne($id, $filters = array());
  }

  public function updateOneMenu($id)
  {
    $prevRecord = CategoriesWeb::findFirst("id = {$id}")->toArray();

    $this->eventsManager->attach(
      'controller:beforeRespond',
      function (Event $event, $component, $data) use ($prevRecord)
      {
        $nextRecord = $data['records'];
        $component->siblingReposition($prevRecord['id'], $nextRecord['pid']);

        if ($nextRecord['pid'] !== $prevRecord['pid'])
        {
          $component->prevSiblingReposition($prevRecord['pid'], $prevRecord['pos']);
        }

        /**
         * Respond ReadAll records.
         */
        // $this->eventsManager->detachAll('controller:beforeRespond'); // ???
        $this->eventsManager->detachAll();

        // same basecontroller response.... :(((
        $this->eventsManager->attach(
          'controller:beforeRespond',
          function (Event $event, $component, $data) use ($prevRecord)
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

        $component->readAllMenu();
      }
    );

    $this->model = 'App\Models\CategoriesWeb';
    $this->updateOne($id);
  }

  /**
   * Reposition Menu sibling
   */
  private function siblingReposition($id, $pid)
	{
    $model = new $this->model();
    $pos = 0;

    foreach ($model::find(array(
      'conditions' => "pid = ?1",
      'bind' => [1 => $pid],
      'order' => "pos asc, if (id = {$id}, 1, 0) desc"
    )) as $record)
    {
      if ($record->pos !== $pos)
      {
        $record->pos = $pos;
        $record->save();
      }

      $pos++;
    }
	}

  /**
   * If change menu parent › reposition previous siblings
   */
  private function prevSiblingReposition($pid, $pos)
  {
    $model = new $this->model();

    foreach ($model::find(array(
      'conditions' => "pid = ?1 AND pos >= ?2",
      'bind' => [1 => $pid, 2 => $pos],
      'order' => "pos asc"
    )) as $record)
    {
      $record->pos = $pos;
      $record->save();
      $pos++;
    }
  }
}
