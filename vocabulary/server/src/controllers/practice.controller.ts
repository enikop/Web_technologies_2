import { BSON, ObjectId } from 'mongodb';
import { AppDataSource } from '../data-source';
import { Practice } from '../entity/Practice';
import { Topic } from '../entity/Topic';
import { User } from '../entity/User';
import { Controller } from './base.controller';
import { Request, Response } from 'express';

export class PracticeController extends Controller {
  repository = AppDataSource.getMongoRepository(Practice);

  getFiltered = async (req: Request, res: Response) => {
    try {
      const username = req.params.username;
      const topicId = req.params.topicId;
      const entities = await this.repository.find({
        where: {
          username: { $eq: username },
          topicId: { $eq: topicId }
        }
      });
      res.json(entities);
    } catch (err) {
      this.handleError(res, err);
    }
  };

  getUserFiltered = async (req: Request, res: Response) => {
    try {
      const username = req.params.username;
      const entities = await this.repository.find({
        where: {
          username: { $eq: username }
        }
      });
      res.json(entities);
    } catch (err) {
      this.handleError(res, err);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const entity = this.repository.create(req.body as object);

      const userEntity = await AppDataSource.getMongoRepository(User).findOneBy({
        username: entity.username
      });
      if (!userEntity) {
        return this.handleError(res, null, 404, 'Referenced user not found.');
      }

      const topicEntity = await AppDataSource.getMongoRepository(Topic).findOneBy({
        _id: new ObjectId(entity.topicId)
      });
      if (!topicEntity) {
        return this.handleError(res, null, 404, 'Referenced topic not found.');
      }

      delete entity._id;

      const entityInserted = await this.repository.save(entity);

      res.json(entityInserted);
    } catch (err) {
      this.handleError(res, err);
    }
  };
}
