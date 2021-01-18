
exports.seed = function(knex) {

  return knex('gp_addresses').select().then(gp_addresses => {
    if (gp_addresses.length >= 1) {

      return knex('admins').select().then(admins => {
        if (admins.length >= 1) {

          return knex('gps').insert([
            {name: 'Lincoln Road Medical Practice', phone_number: '02083678989', gp_address_id: gp_addresses[0].id, admin_id: admins[0].id},
            {name: 'Eagle House Surgery', phone_number: '020 8805 8611', gp_address_id: gp_addresses[1].id, admin_id: admins[1].id}
          ]);

        } else {
          console.log("Populate the admins table first.");
        }

      })

    } else {
      console.log("Fewer than sufficient listed addresses to pull from.");
    }

  })
};
