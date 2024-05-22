import express from 'express';
import { UserController } from './controllers/user.controller';
import { TopicController } from './controllers/topic.controller';
import { PracticeController } from './controllers/practice.controller';
import { checkUser, checkUserIdentity } from './protect-routes';

export function getRoutes(){
  const router = express.Router();
  const userController = new UserController();

  //router.get('/user', checkUser, userController.getAll);
  //router.get('/user/:username', checkUserIdentity, userController.getOne);
  router.post('/user', userController.create);
  router.post('/user/login', userController.login);
  router.post('/user/authenticated', checkUser, userController.getAuthenticated);

  const topicController = new TopicController();
  router.get('/topic', checkUser, topicController.getAll);
  router.get('/topic/:id', checkUser, topicController.getOne);
  router.post('/topic', checkUser, topicController.create);
  router.put('/topic', checkUser, topicController.update);
  router.delete('/topic/:id', checkUser, topicController.delete);

  const practiceController = new PracticeController();
  router.get('/practice', checkUser, practiceController.getAll);
  //router.get('/practice/:id', checkUser, practiceController.getOne);
  router.get('/practice/byuserandtopic/:username/:topicId', checkUserIdentity, practiceController.getFiltered);
  router.get('/practice/byuser/:username', checkUserIdentity, practiceController.getUserFiltered);
  router.post('/practice', checkUser, practiceController.create);

  return router;
}
