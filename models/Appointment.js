const { Model } = require('objection');

const Doctor = require('./Doctor.js');

class Appointment extends Model{

    static tableName = 'appointments';

    static relationMappings = {
        doctor: { 
            relation: Model.BelongsToOneRelation,
            modelClass: Doctor,
            join: {
                from: 'appointments.doctorId',
                to: 'doctors.id'
            }
        }
    }

}

module.exports = Appointment;