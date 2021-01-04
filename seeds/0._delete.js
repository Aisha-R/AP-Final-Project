
exports.seed = function(knex) {
  return knex('appointments').del().then(function () {
    return knex('doctors').del().then(function () {
      return knex('patients').del().then(function () {
        return knex('patient_addresses').del().then(function () {
          return knex('gps').del().then(function () {
            return knex('gp_addresses').del().then(function () {
              return knex('admins').del()
            });
          });
        });
      });
    });
  });
};
