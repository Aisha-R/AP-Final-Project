
exports.seed = function(knex) {

  return knex('patients').select().then(patients => {

    if (patients.length >= 1) {

      return knex('doctors').select().then(doctors => {

        if (doctors.length >= 1) {

          return knex('appointments').insert([
            {type: 'general', date_time: '2021-01-18 14:40:00', patient_id: patients[0].id, doctor_id: doctors[0].id},
          ]);

        } else {

          console.log("Fewer doctors than requested.");
          
        }

      })

    } else {

      console.log("Fewer patients than appointments.");

    }

  })

};
