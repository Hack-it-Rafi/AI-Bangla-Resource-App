import { Router } from 'express';
import { UserRoutes } from '../Modules/User/User.route';
import { ChatRoutes } from '../Modules/Chat/Chat.route';
import { PDFRoutes } from '../Modules/Pdf/Pdf.route';
import { TestRoutes } from '../Modules/TestData/Test.route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;