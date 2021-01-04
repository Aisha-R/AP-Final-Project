const { Model } = require('objection');

const Gp = require('./Gp.js');

class Admin extends Model { 

    static tableName = 'admins';

    static relationMappings = {
        gps: {
            relation: Model.HasManyRelation,
            modelClass: Gp,
            join: {
                from: 'admins.id',
                to: 'gps.adminId'
            }
        }
    }

}

module.exports = Admin;