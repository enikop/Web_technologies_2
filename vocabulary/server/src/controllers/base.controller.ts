import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';

export abstract class Controller {
    repository: Repository<any>;

    //Get all entities from the given repository (of given type)
    getAll = async (req: Request, res: Response) => {
        try {
            const entities = await this.repository.find();
            res.json(entities);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    //Get one entity by id, given as part of the requested route
    getOne = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const entity = await this.repository.findOneBy({
                 _id: new ObjectId(id)
            });
            if (!entity) {
                return this.handleError(res, null, 404, 'Not found.');
            }

            res.json(entity);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    //Create the entity specified in request body
    create = async (req: Request, res: Response) => {
        try {
            const entity = this.repository.create(req.body as object);
            delete entity._id;

            const entityInserted = await this.repository.save(entity);

            res.json(entityInserted);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    //Update the entity specified in request body, if it already exists (otherwise response 404)
    update = async (req: Request, res: Response) => {
        try {
            const entity = this.repository.create(req.body as object);
            const entityToUpdate = await this.repository.findOneBy({
                _id: new ObjectId(entity._id)
            });

            if (!entityToUpdate || !entity._id) {
                return this.handleError(res, null, 404, 'No entity found with this id.');
            }

            await this.repository.update(entity._id, entity);
            res.json(entity);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    //Delete the entity with the id specified as part of the request route, if it already exists (otherwise response 404)
    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const entityToDelete = await this.repository.findOneBy({
              _id: new ObjectId(id)
           });

            if (!entityToDelete) {
                return this.handleError(res, null, 404, 'Entity not found.');
            }

            await this.repository.remove(entityToDelete);
            res.send();
        } catch (err) {
            this.handleError(res, err);
        }
    };

    //Universal error handler, sends back status and error message
    handleError(res: Response, err = null, status = 500, message = 'Unexpected server error') {
        if (err) {
            console.error(err);
            if(err.code && err.code == 11000){
              res.status(422).json({ error: "Duplicate entry." });
            } else {
              res.status(status).json({ error: message });
            }
        } else {
          res.status(status).json({ error: message });
        }
    }
}
