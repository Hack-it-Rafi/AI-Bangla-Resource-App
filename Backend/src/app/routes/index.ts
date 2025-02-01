import { Router } from 'express';
import { UserRoutes } from '../Modules/User/User.route';
import { ChatRoutes } from '../Modules/Chat/Chat.route';
import { PDFRoutes } from '../Modules/Pdf/Pdf.route';
import { TestRoutes } from '../Modules/TestData/Test.route';
import { SpeechRoutes } from '../Modules/Speech/Speech.route';
import { TextRoutes } from '../Modules/Text/Text.route';

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
    path: '/pdf',
    route: PDFRoutes
  },
  {
    path: '/test',
    route: TestRoutes
  },
  {
    path: '/speech',
    route: SpeechRoutes
  },
  {
    path: '/text',
    route: TextRoutes
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;