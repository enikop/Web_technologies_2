import { ObjectId } from 'mongodb';
import { AppDataSource } from '../data-source';
import { Topic } from '../entity/Topic';
import { Controller } from './base.controller';
import { Request, Response } from 'express';
import { TopicDTO } from '../../../models';
import { Practice } from '../entity/Practice';

export class TopicController extends Controller {
  repository = AppDataSource.getMongoRepository(Topic);

  //Create the entity specified in request body
  create = async (req: Request, res: Response) => {
    try {
      const entity = this.repository.create(req.body as object);
      delete entity._id;
      entity.words = [];

      const entityInserted = await this.repository.save(entity);

      res.json(entityInserted);
    } catch (err) {
      this.handleError(res, err);
    }
  };
  update = async (req: Request, res: Response) => {
    try {
      const reqBody = req.body as TopicDTO;
      const entity = this.repository.create(reqBody);
      const entityToUpdate = await this.repository.findOneBy({
        _id: new ObjectId(entity._id)
      });

      if (!entityToUpdate || !entity._id) {
        return this.handleError(res, null, 404, 'No entity found with this id.');
      }
      entity.words = reqBody.words;
      delete entity._id;

      await this.repository.update(req.body._id, entity);
      res.json(entity);
    } catch (err) {
      this.handleError(res, err);
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const entityToDelete = await this.repository.findOneBy({
        _id: new ObjectId(id)
      });

      if (!entityToDelete) {
        return this.handleError(res, null, 404, 'Entity not found.');
      }

      const practices = await AppDataSource.getMongoRepository(Practice).find({
        where: {
          topicId: {$eq: entityToDelete._id.toString()}
        }
      });
      await AppDataSource.getRepository(Practice).remove(practices);
      await this.repository.remove(entityToDelete);
      res.send();
    } catch (err) {
      this.handleError(res, err);
    }
  };

}
