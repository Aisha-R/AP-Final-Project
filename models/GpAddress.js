const { Model } = require('objection');

class GpAddress extends Model {

    static tableName = 'gpAddresses';

}

module.exports = GpAddress;