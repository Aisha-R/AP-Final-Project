
exports.seed = function(knex) {

      return knex('gp_addresses').insert([
        {country: 'England', city: 'London', borough: 'Enfield', postcode: 'EN1 1LJ', street_name: 'Lincoln Road'},
        {country: 'England', city: 'London', borough: 'Enfield', postcode: 'EN3 4DN', street_name: 'High Street', number: '291'}
      ]);
    
};
