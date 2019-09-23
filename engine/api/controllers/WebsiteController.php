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

  public function readAllMenu()
  {
    $this->model = 'App\Models\CategoriesWeb';
    $this->readAll();
  }

  public function updateOneMenu($id)
  {
    $prevRecord = CategoriesWeb::findFirst("id = {$id}")->toArray();

    $this->eventsManager->attach(
      'controller:beforeRespond',
      function (Event $event, $component, $data) use ($prevRecord)
      {
        $nextRecord = $data['records'];

        $component->siblingReposition($prevRecord['id'], $prevRecord['pid']);

        if ($nextRecord['pid'] !== $prevRecord['pid'])
        {
          $component->prevSiblingReposition($prevRecord['id'], $nextRecord['pid']);
        }

        /**
         * Respond ReadAll records.
         */
        // $this->eventsManager->detachAll('controller:beforeRespond'); // ???
        $this->eventsManager->detachAll();

        $this->eventsManager->attach(
          'controller:beforeRespond',
          function (Event $event, $component, $data) use ($prevRecord)
          {
            $component->createResponse(
              $data['records']
            );
          }
        );

        $component->readAll();
      }
    );

    $this->model = 'App\Models\CategoriesWeb';
    $this->updateOne($id);
  }

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

  private function prevSiblingReposition($pid, $pos)
  {
    $model = new $this->model();

    foreach ($model::find(array(
      'conditions' => "pid = ?1 AND pos > ?2",
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
