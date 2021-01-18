
exports.seed = function(knex) {

  return knex('gps').select().then(gps => {

    if (gps.length >= 1) {
  
      return knex('doctors').insert([                         //doctorPassword  //doctorPassword2 //doctorPassword3
        {name: 'Josephine Doe', medical_id: '0001', password: '$2b$12$efnf1KyF5sTdDncQVoJcNut.EKR366HYgVcacvPtytCtQRaZTlH6a', email_address: 'josephine.doe@hotmail.com', gp_id: gps[0].id, room_id: 1},
        {name: 'Jakob Doe', medical_id: '0002', password: '$2b$12$sR0A6KVRTBtT0MiS0w8IPu9r2nP5mW6D6dmUK6CRvWSupzRdFWzpe', email_address: 'jacob.doe@hotmail.com', gp_id: gps[0].id, room_id: 2},
        {name: 'Janice Doe', medical_id: '0003', password: '$2b$12$Olgma1f7bljcITcH1nYBc.yDd4pFxuiCK7P3ASz14DB2VFfEs3ZIy', email_address: 'janice.doe@hotmail.com', gp_id: gps[0].id, room_id: 3}
      ]);

    } else {

      console.log('No GPs listed in the GP table.');

    }

  })
  
};
