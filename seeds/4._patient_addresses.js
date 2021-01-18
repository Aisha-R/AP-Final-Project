
exports.seed = function(knex) {
 
      return knex('patient_addresses').insert([
        {country: 'england', city: 'london', borough: 'enfield', postcode: 'en1 1xs', street_name: 'ayley croft', flat_name: 'romney house', number: '11'},
        {country: 'england', city: 'london', borough: 'edmonton', postcode: 'en4 7rt', street_name: 'ponders end street', flat_name: 'bonnington house', number: '27'}
      ]);
};
