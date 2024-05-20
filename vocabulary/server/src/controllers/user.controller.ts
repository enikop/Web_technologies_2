import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { Controller } from './base.controller';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getAuthenticatedUsername } from '../protect-routes';

export class UserController extends Controller {
  repository = AppDataSource.getRepository(User);

  create = async (req, res) => {
    try {
      const entity = this.repository.create(req.body as User);
      delete entity._id;

      const insertedEntity = await this.repository.save(entity);

      entity.password = await bcrypt.hash(entity.password, 12);

      await this.repository.save(insertedEntity);
      delete insertedEntity.password;
      res.json(insertedEntity);
    } catch (err) {
      this.handleError(res, err);
    }
  };
  //Get all entities from the given repository (of given type)
  getAll = async (req: Request, res: Response) => {
    try {
      const entities = await this.repository.find();
      const entitiesWithoutPwd = entities.map(user => {
        delete user.password;
        return user;
      });
      res.json(entitiesWithoutPwd);
    } catch (err) {
      this.handleError(res, err);
    }
  };

  //Get one entity by id, given as part of the requested route
  getOne = async (req: Request, res: Response) => {
    try {
      const username = req.params.username;
      const entity = await this.repository.findOneBy({
        username: username
      });
      if (!entity) {
        return this.handleError(res, null, 404, 'Not found.');
      }
      delete entity.password;

      res.json(entity);
    } catch (err) {
      this.handleError(res, err);
    }
  };

  getAuthenticated = async (req: Request, res: Response) => {
    try {
      const username = getAuthenticatedUsername(req);
      const entity = await this.repository.findOneBy({
        username: username
      });
      if (!entity) {
        return this.handleError(res, null, 404, 'Not found.');
      }
      delete entity.password;

      res.json(entity);
    } catch (err) {
      this.handleError(res, err);
    }
  };

  login = async (req, res) => {
    try {
      const user = await this.repository.findOne({
        where: { username: req.body.username }
      });

      if (!user) {
        return this.handleError(res, null, 401, 'Incorrect username or password.');
      }

      const passwordMatches = await bcrypt.compare(req.body.password, user.password);
      if (!passwordMatches) {
        return this.handleError(res, null, 401, 'Incorrect username or password.');
      }

      const token = jwt.sign({ username: user.username }, '8sxYVG3yJG', { expiresIn: '2w' });
      res.json({ accessToken: token });
    } catch (err) {
      this.handleError(res, err);
    }
  };
}
