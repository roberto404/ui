<?php

/**
 * Phalcon Framework Validator
 * @Copyright 1 Studio Kft. (http://www.1studio.hu)
 */

namespace App\Model\Validator;

use Phalcon\Mvc\Model\Exception;


/**
 * Phalcon\Validation\Validator\IntLength
 *
 * Validates that an integer has the specified maximum and minimum constraints
 *
 * <code>
 * use Phalcon\Validation\Validator\IntLength;
 *
 * $validation->add('integer_field', new IntLength([
 *     'max' => 50,
 *     'min' => 2,
 *     'messageMaximum' => 'We don\'t like really long names',
 *     'messageMinimum' => 'We want more than just their initials'
 * ]));
 * </code>
 */
class IntLength extends \Phalcon\Mvc\Model\Validator implements \Phalcon\Mvc\Model\ValidatorInterface
{
	/**
	 * Executes the validation
	 */
    public function validate(\Phalcon\Mvc\EntityInterface $record)
    {
        $field = $this->getOption("field");
        $options = array();

        if ($this->isSetOption("min"))
            $options['min'] = $this->getOption("min");

        if ($this->isSetOption("max"))
            $options['max'] = $this->getOption("max");

        $validation = new \Phalcon\Validation();

        $validation->add(
            $field,
            new \App\Validator\IntLength($options)
        );

        $message = $validation->validate($record);

        if (count($message))
        {
            $this->appendMessage($message[0]->getMessage());
            return false;
        }
        else
        {
            return true;
        }
    }
}
