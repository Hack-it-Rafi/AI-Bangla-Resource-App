import { Router } from 'express';
import { UserRoutes } from '../Modules/User/User.route';
import { ChatRoutes } from '../Modules/Chat/Chat.route';
import { SpeechRoutes } from '../Modules/Speech/Speech.route';
import { TextRoutes } from '../Modules/Text/Text.route';
import { PdfRoutes } from '../Modules/Pdf/Pdf.route';

const router = Router();

const moduleRoutes = [
  
  {
    path: '/user',
    route: UserRoutes
  },
  {
    path: '/chat',
    route: ChatRoutes
  },
  {
    path: '/mp3',
    route: SpeechRoutes
  },
  {
    path: '/text',
    route: TextRoutes
  },
  {
    path: '/pdf',
    route: PdfRoutes
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;