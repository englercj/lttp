import Entity from './Entity';
import { ENTITY_TYPE } from '../data/Constants';

export class Enemy extends Entity {
    entityType: ENTITY_TYPE = ENTITY_TYPE.ENEMY;
}
