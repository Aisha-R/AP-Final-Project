
exports.seed = function(knex) {

  return knex('gps').select().then(gps => {
    if (gps.length >= 1) {

      return knex('patient_addresses').select().then(patient_addresses => {
        if (patient_addresses.length >= 1) {

          return knex('patients').insert([                                                         //patientPassword
            {name: 'Aisha Rooble', date_of_birth: '1997-12-22', ni_number: 'SE907382D', password: '$2b$12$hO276agPXpKAFEVoTFyP/u8BiA6kicBXc5tbaR6EAR9PBxwvOcr8y', email_address: 'aisha.rooble@hotmail.com', phone_number: '91708509', patient_address_id: patient_addresses[0].id, gp_id: gps[0].id}
          ]);

        } else {
          console.log('No patient addresses listed in the patient_addresses table.');
        }

      })

    } else {
      console.log('No GPs listed in the GP table.');
    }

  })

};
