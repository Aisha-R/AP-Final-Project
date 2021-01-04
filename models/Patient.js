const { Model } = require('objection');

class Patient extends Model {

    static tableName = "patients";

}

module.exports = Patient;