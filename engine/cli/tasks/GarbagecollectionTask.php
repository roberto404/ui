<?php


class GarbagecollectionTask extends \Phalcon\CLI\Task
{
  public function mainAction()
  {
      echo "\nThis is the default task and the default action \n";
  }

  public function truncateLogsAction()
  {
    shell_exec('find ' . APPLICATION_PATH .'../../logs/*  -exec cp /dev/null {} \;');
  }

}
