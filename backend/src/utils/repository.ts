import { Injectable } from '@nestjs/common';
import { Class } from 'type-fest';
import { getManager } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { NotUniqueError } from './errors';

export interface IRepository<Entity> {
  save(entity: Entity): Promise<Entity>;

  findOne(param: Partial<Entity>): Promise<Entity | undefined>;

  updateOne(param: Partial<Entity>, updated: Partial<Entity>): Promise<void>;
}

export function Repository<Entity>(entity: Class<Entity>): Class<IRepository<Entity>> {
  @Injectable()
  class Repos implements IRepository<Entity> {
    async findOne(param: Partial<Entity>, em = getManager()): Promise<Entity | undefined> {
      const res = await em.findOne(entity, { where: param });
      return res;
    }

    async updateOne(
      param: Partial<Entity>,
      updated: Partial<Entity>,
      em = getManager()
    ): Promise<void> {
      await em.update(entity, param, updated as QueryDeepPartialEntity<Entity>);
    }

    async save(entity: Entity, em = getManager()): Promise<Entity> {
      return em.save(entity).catch((err) => {
        if (err.detail.includes('already exists')) throw new NotUniqueError();
        throw err;
      });
    }
  }
  return Repos;
}
