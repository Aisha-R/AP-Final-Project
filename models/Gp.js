const { Model } = require('objection');

const Admin = require('./Admin');
const Doctor = require('./Doctor.js');

class Gp extends Model {

    static tableName = 'gps';

    static relationMappings = {
        admin: { 
            relation: Model.BelongsToOneRelation,
            modelClass: Admin,
            join: {
                from: 'gps.adminId',
                to: 'admins.id'
            }
        },
        doctors: {
            relation: Model.HasManyRelation,
            modelClass: Doctor,
            join: {
                from: 'gps.id',
                to: 'doctors.gpId'
            }
        }
    }

}

module.exports = Gp;