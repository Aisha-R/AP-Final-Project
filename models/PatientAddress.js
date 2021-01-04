const { Model } = require('objection');

class PatientAddress extends Model {

    static tableName = 'patientAddresses';

}

module.exports = PatientAddress;