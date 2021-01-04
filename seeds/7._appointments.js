
exports.seed = function(knex) {

  return knex('patients').select().then(patients => {

    if (patients.length >= 1) {

      return knex('doctors').select().then(doctors => {

        if (doctors.length >= 1) {

          return knex('appointments').insert([
            {type: 'telephone', date_time: '2020-12-29 14:45:00', patient_id: patients[0].id, doctor_id: doctors[0].id}
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
