
exports.seed = function(knex) {
 
      return knex('patient_addresses').insert([
        {country: 'england', city: 'london', borough: 'enfield', postcode: 'en1 1xs', street_name: 'ayley croft', flat_name: 'romney house', number: '11'}
      ]);
};
