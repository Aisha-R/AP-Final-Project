
exports.seed = function(knex) {

  return knex('gps').select().then(gps => {
    if (gps.length >= 1) {

      return knex('patient_addresses').select().then(patient_addresses => {
        if (patient_addresses.length >= 1) {

          return knex('patients').insert([                                                         //patientPassword //patientPassword2
            {name: 'Jane Doe', date_of_birth: '1973-03-17', ni_number: 'SE907382D', password: '$2b$12$hO276agPXpKAFEVoTFyP/u8BiA6kicBXc5tbaR6EAR9PBxwvOcr8y', email_address: 'jane.doe@hotmail.com', phone_number: '07891708509', patient_address_id: patient_addresses[0].id, gp_id: gps[0].id},
            {name: 'John Doe', date_of_birth: '1992-09-24', ni_number: 'SD906539L', password: '$2b$12$t4of7bCkaLNEdvk3ogPOruX2G0Su7YZfJvKgExDxPGUVNh9FmeIpy', email_address: 'john.doe@hotmail.com', phone_number: '07951308519', patient_address_id: patient_addresses[1].id, gp_id: gps[1].id}
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
