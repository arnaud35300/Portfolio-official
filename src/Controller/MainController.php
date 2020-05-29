<?php

namespace App\Controller;

use Swift_Mailer as SwiftMailer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class MainController extends AbstractController
{
    /**
     * @Route("/", name="home")
     */
    public function home()
    {
        return $this->render('main/home.html.twig');
    }

    /**
     * @Route("/skills", name="skills", methods={"GET"})
     */
    public function skills()
    {
        return $this->render('main/skills.html.twig');
    }

    /**
     * @Route("/projects", name="projects", methods={"GET"})
     */
    public function projects()
    {
        return $this->render('main/projects.html.twig');
    }

    /**
     * @Route("/shell", name="shell", methods={"GET"})
     */
    public function shell()
    {
        return $this->render('main/shell.html.twig');
    }

    /**
     * @Route("/contact", name="contact", methods={"GET"})
     */
    public function contact()
    {
        return $this->render('main/contact.html.twig');
    }

    /**
     * @Route("/guestbook", name="guestbook", methods={"POST"})
     */
    public function guestbook(Request $request)
    {
        $content = $request->getContent();

        if (json_decode($content) === NULL)
            return $this->json(['information' => 'invalid data format.'], Response::HTTP_UNAUTHORIZED);

        $content = json_decode($content, true);

        foreach ($content as $item)
            strip_tags($item);

        $file = fopen(__DIR__ . '/../../public/assets/files/guestbook.json', "c");
        fseek($file, -1, SEEK_END);
        fwrite($file, ', {
                "username": "<span class=\"user-comment\">' . $content['username'] . '</span>",
                "content": "' . $content['content'] . '"
            }]');
        fclose($file);

        return $this->json(['information' => 'data send, success.'], Response::HTTP_CREATED);
    }

    /**
     * @Route("/mail", name="mail", methods={"POST"})
     */
    public function mail(Request $request, SwiftMailer $mailer)
    {

        $content = $request->getContent();

        if (json_decode($content) === NULL)
            return $this->json(['information' => 'invalid data format.'], Response::HTTP_UNAUTHORIZED);

        $content = json_decode($content, true);

        $mail = (new \Swift_Message($content['subject']))
            ->setFrom('arnaudguillardportfolio@gmail.com')
            ->setTo('arnaudguillardportfolio@gmail.com')
            ->setBody(
                $this->renderView(
                    'emails/contact-form.html.twig',
                    [
                        'firstname' => $content['firstname'],
                        'lastname'  => $content['lastname'],
                        'email'     => $content['email'],
                        'content'   => $content['content']
                    ]
                ),
                'text/html'
            );

        $mailer->send($mail);

        return $this->json(['information' => 'data send, success.'], Response::HTTP_CREATED);
    }
}
