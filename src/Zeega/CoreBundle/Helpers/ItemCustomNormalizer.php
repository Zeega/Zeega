<?php

namespace Zeega\CoreBundle\Helpers;

use Symfony\Component\Serializer\Exception\RuntimeException;
use Symfony\Component\Serializer\Normalizer\SerializerAwareNormalizer;
/**
 * Converts between objects with getter and setter methods and arrays.
 *
 * The normalization process looks at all public methods and calls the ones
 * which have a name starting with get and take no parameters. The result is a
 * map from property names (method name stripped of the get prefix, with 
 * the words separated by underscore and converted to lower case) to property 
 * values. Property values are normalized through the serializer.
 *
 * The denormalization first looks at the constructor of the given class to see
 * if any of the parameters have the same name as one of the properties. The
 * constructor is then called with all parameters or an exception is thrown if
 * any required parameters were not present as properties. Then the denormalizer
 * walks through the given map of property names to property values to see if a
 * setter method exists for any of the properties. If a setter exists it is
 * called with the property value. No automatic denormalization of the value
 * takes place.
 *
 * @author Nils Adermann <naderman@naderman.de>
 */
class ItemCustomNormalizer extends SerializerAwareNormalizer
{
    /**
     * {@inheritdoc}
     */
    public function normalize($object, $format = null)
    {
        $reflectionClass = new \ReflectionClass($object);

        $attributes = array();
        foreach ($reflectionClass->getMethods(\ReflectionMethod::IS_PUBLIC) as $reflectionMethod) 
        {
            
            if (strtolower(substr($reflectionMethod->getName(), 0, 3)) !== 'get') 
            {
                continue;
            }
            
            $property = lcfirst(substr($reflectionMethod->getName(), 3));
            $value = $reflectionMethod->invoke($object);

            //            $data[$property] = $value;
            /*
            if (null !== $attributeValue && !is_scalar($attributeValue)) {
                $attributeValue = $this->serializer->normalize($attributeValue, $format);
            }
            */
            
            if(is_object($value))
            {
                $value = self::normalize($value, $format);
            }
            /*
            if(is_array($value))
            {
                $temp = array();
                foreach ($value as $v) 
                {
                    array_push($temp, self::normalize($v, $format));
                    // $attributeValue = 
                }
                $value = $temp;
                //$value = "yo";
            }
            */
            $attributes[$property] = $value;
        }

        return $attributes;
    }
    /*
    public function normalize($object, $format = null)
    {
        $data = array();

        $reflectionClass = new \ReflectionClass($object);

        $data['__jsonclass__'] = array(
            get_class($object),
            array(), // constructor arguments
        );

        foreach ($reflectionClass->getMethods(\ReflectionMethod::IS_PUBLIC) as $reflectionMethod) {
            if (strtolower(substr($reflectionMethod->getName(), 0, 3)) !== 'get') {
                continue;
            }

            if ($reflectionMethod->getNumberOfRequiredParameters() > 0) {
                continue;
            }

            $property = lcfirst(substr($reflectionMethod->getName(), 3));
            $value = $reflectionMethod->invoke($object);

            $data[$property] = $value;
        }

        return $data;
    }    
    */
    /**
     * {@inheritdoc}
     */
    public function denormalize($data, $class, $format = null)
    {
        //TODO - shouldn't work for now
        $reflectionClass = new \ReflectionClass($class);
        $constructor = $reflectionClass->getConstructor();

        if ($constructor) {
            $constructorParameters = $constructor->getParameters();

            $params = array();
            foreach ($constructorParameters as $constructorParameter) {
                $paramName = strtolower($constructorParameter->getName());

                if (isset($data[$paramName])) {
                    $params[] = $data[$paramName];
                    // don't run set for a parameter passed to the constructor
                    unset($data[$paramName]);
                } else if (!$constructorParameter->isOptional()) {
                    throw new RuntimeException(
                        'Cannot create an instance of '.$class.
                        ' from serialized data because its constructor requires '.
                        'parameter "'.$constructorParameter->getName().
                        '" to be present.');
                }
            }

            $object = $reflectionClass->newInstanceArgs($params);
        } else {
            $object = new $class;
        }

        foreach ($data as $attribute => $value) {
            $setter = 'set'.$attribute;
            if (method_exists($object, $setter)) {
                $object->$setter($value);
            }
        }

        return $object;
    }

    /**
     * {@inheritDoc}
     */
    public function supportsNormalization($data, $format = null)
    {
        return is_object($data) && $this->supports(get_class($data));
    }

    /**
     * {@inheritDoc}
     */
    public function supportsDenormalization($data, $type, $format = null)
    {
        return $this->supports($type);
    }

    /**
     * Checks if the given class has any get{Property} method.
     *
     * @param string $class
     * @return Boolean
     */
    private function supports($class)
    {
        $class = new \ReflectionClass($class);
        $methods = $class->getMethods(\ReflectionMethod::IS_PUBLIC);
        foreach ($methods as $method) {
            if ($this->isGetMethod($method)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks if a method's name is get.* and can be called without parameters.
     *
     * @param ReflectionMethod $method the method to check
     * @return Boolean whether the method is a getter.
     */
    private function isGetMethod(\ReflectionMethod $method)
    {
        return (
            0 === strpos($method->getName(), 'get') &&
            3 < strlen($method->getName()) &&
            0 === $method->getNumberOfRequiredParameters()
        );
    }
}