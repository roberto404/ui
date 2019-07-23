<?php

class CronTask extends \Phalcon\CLI\Task
{
  private function execute($type)
  {
    $config = $this->di->get('config');

    if (isset($config->cron) && isset($config->cron[$type]) && $config->cron[$type])
    {
      foreach ((array) $config->cron[$type] as $item)
      {
        if ($item)
        {
          list($task, $action) = explode("->", $item);

          $this->console->handle([
            'task' => $task,
            'action' => $action
          ]);
        }
      };
    }
  }

  public function mainAction()
  {
    echo "\nAvailable actions: daily, hourly, tenMinutes, minutely\n";
  }

  public function dailyAction()
  {
    $this->execute('daily');
  }

  public function hourlyAction()
  {
    $this->execute('hourly');
  }

  public function tenMinutesAction()
  {
    $this->execute('tenMinutes');
  }

  public function minutelyAction()
  {
    $this->execute('minutely');
  }

  public function testAction()
  {
    $path = __DIR__ . '/../../../cache/task/';
    $date = date("d/m : H:i :");

    file_put_contents($path . 'cron.task', $date . PHP_EOL, FILE_APPEND);
  }
}
