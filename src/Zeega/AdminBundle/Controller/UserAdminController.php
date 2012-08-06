<?php
// src/Tutorial/BlogBundle/Controller/TagAdminController.php
namespace Zeega\AdminBundle\Controller;

use Sonata\AdminBundle\Controller\CRUDController as Controller;
use Sonata\AdminBundle\Datagrid\ProxyQueryInterface;
use Symfony\Component\HttpFoundation\Response;

class UserAdminController extends Controller
{
    public function batchActionActivate(ProxyQueryInterface $selectedModelQuery)
    {
        $selectedModels = $selectedModelQuery->execute();
        
        // do the merge work here

        try 
        {
            foreach ($selectedModels as $selectedModel) 
            {
                return new Response(var_dump($selectedModel->getId()));
                $modelManager->delete($selectedModel);
            }

            $modelManager->update($selectedModel);
        } 
        catch (\Exception $e) 
        {
            $this->get('session')->setFlash('sonata_flash_error', 'flash_batch_merge_error');
            return new RedirectResponse($this->admin->generateUrl('list',$this->admin->getFilterParameters()));
        }

        $this->get('session')->setFlash('sonata_flash_success', 'flash_batch_merge_success');

        return new RedirectResponse($this->admin->generateUrl('list',$this->admin->getFilterParameters()));
    }
}
