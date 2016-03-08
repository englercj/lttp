import Entity from './Entity';
import Constants from '../data/Constants';

export default class Enemy extends Entity {
    entityType = Constants.ENTITY_TYPE.ENEMY;
}
