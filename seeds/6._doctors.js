
exports.seed = function(knex) {

  return knex('gps').select().then(gps => {

    if (gps.length >= 1) {
  
      return knex('doctors').insert([                         //doctorPassword
        {name: 'Jamaad Hoosh', medical_id: '0001', password: '$2b$12$efnf1KyF5sTdDncQVoJcNut.EKR366HYgVcacvPtytCtQRaZTlH6a', email_address: 'jamaad26@hotmail.com', gp_id: gps[0].id, room_id: 1}
      ]);

    } else {

      console.log('No GPs listed in the GP table.');

    }

  })
  
};
