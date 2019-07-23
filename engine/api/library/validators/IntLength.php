<?php

/**
 * Phalcon Framework Validator
 * @Copyright 1 Studio Kft. (http://www.1studio.hu)
 */

namespace App\Validator;

use Phalcon\Validation;
use Phalcon\Validation\Validator;
use Phalcon\Validation\Exception;
use Phalcon\Validation\Message;

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
class IntLength extends Validator
{
	/**
	 * Executes the validation
	 */
    public function validate(\Phalcon\Validation $validation, $field)
    {
        $isMin = $this->hasOption('min');
        $isMax = $this->hasOption('max');

        // At least one of 'min' or 'max' must be set
        if (!$isMin && !$isMax)
        {
            throw new Exception("A minimum or maximum must be set");
        }

        $value = (int)$validation->getValue($field);

        $label = $this->getOption("label");

        if (is_array($label))
        {
            $label = $label[$field];
        }
        if (!$label)
        {
            $label = $validation->getLabel($field);
        }

        $code = $this->getOption("code");

        if (is_array($code))
        {
            $code = $code[$field];
        }


        /**
		 * Maximum length
		 */
        if ($isMax)
        {
            $max = $this->getOption("max");

            if (is_array($max))
            {
                $max = $max['field'];
            }

            if ($value > $max)
            {
                $message = $this->getOption("messageMaximum");

                if (is_array($message))
                {
                    $message = $message[$field];
                }

                if (!$message)
                    $message = $validation->getDefaultMessage("TooLong");

                $validation->appendMessage(
                    new Message(
                        str_replace(array(':field', ':max'), array($label, $max), $message),
                        $field,
                        "TooLong",
                        $code
                    )
                );

                return false;
            }
        }


        /**
		 * Minimum length
		 */
        if ($isMin)
        {
            $min = $this->getOption("min");

            if (is_array($min))
            {
                $min = $min['field'];
            }

            if ($value < $min)
            {
                $message = $this->getOption("messageMinimum");

                if (is_array($message))
                {
                    $message = $message[$field];
                }

                if (!$message)
                    $message = $validation->getDefaultMessage("TooShort");

                $validation->appendMessage(
                    new Message(
                        str_replace(array(':field', ':min'), array($label, $min), $message),
                        $field,
                        "TooShort",
                        $code
                    )
                );

                return false;
            }
        }

        return true;
    }

}
