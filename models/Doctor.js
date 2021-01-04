const { Model } = require('objection');

const Gp = require('./Gp.js')
const Appointment = require('./Appointment.js')

class Doctor extends Model {

    static tableName = 'doctors';

    static relationMappings = {
        gp: { 
            relation: Model.BelongsToOneRelation,
            modelClass: Gp,
            join: {
                from: 'doctors.gpId',
                to: 'gps.id'
            }
        },
        appointments: {
            relation: Model.HasManyRelation,
            modelClass: Appointment,
            join: {
                from: 'doctors.id',
                to: 'appointments.doctorId'
            }
        }
    }

}

module.exports = Doctor;