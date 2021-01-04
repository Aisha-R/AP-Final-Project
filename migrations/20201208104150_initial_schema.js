
exports.up = function(knex) {
  return knex.schema
    .createTable('admins', table => {
        table.increments('id');
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
        table.dateTime('created_at').defaultTo(knex.fn.now());
    })
    .createTable('gp_addresses', table => {
        table.increments('id');
        table.string('country').notNullable();
        table.string('city').notNullable();
        table.string('borough').notNullable();
        table.string('postcode').notNullable();
        table.string('street_name').notNullable();
        table.string('flat_name');
        table.string('number');
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
        table.dateTime('created_at').defaultTo(knex.fn.now());
    })
    .createTable('gps', table => {
        table.increments('id');
        table.string('name').unique().notNullable();
        table.string('phone_number').unique().notNullable();
        table.integer('gp_address_id').unsigned().notNullable();
        table.foreign('gp_address_id').references('gp_addresses.id');
        table.integer('admin_id').unsigned().notNullable();
        table.foreign('admin_id').references('admins.id');
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
        table.dateTime('created_at').defaultTo(knex.fn.now());
    })
    .createTable('patient_addresses', table => {
        table.increments('id');
        table.string('country').notNullable();
        table.string('city').notNullable();
        table.string('borough').notNullable();
        table.string('postcode').notNullable();
        table.string('street_name').notNullable();
        table.string('flat_name');
        table.string('number').notNullable();
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
        table.dateTime('created_at').defaultTo(knex.fn.now());
    })
    .createTable('patients', table => {
        table.increments('id');
        table.string('name').notNullable();
        table.date('date_of_birth').notNullable();
        table.string('ni_number').unique().notNullable();
        table.string('password').notNullable();
        table.string('email_address');
        table.string('phone_number').notNullable();
        table.integer('patient_address_id').unsigned().notNullable();
        table.foreign('patient_address_id').references('patient_addresses.id')
        table.integer('gp_id').unsigned().notNullable();
        table.foreign('gp_id').references('gps.id');
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
        table.dateTime('created_at').defaultTo(knex.fn.now());
    })
    .createTable('doctors', table => {
        table.increments('id');
        table.string('name').notNullable();
        table.string('medical_id').unique().notNullable();
        table.string('password').notNullable();
        table.integer('gp_id').unsigned().notNullable();
        table.foreign('gp_id').references('gps.id');
        table.integer('room_id');
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
        table.dateTime('created_at').defaultTo(knex.fn.now());
    })
    .createTable('appointments', table => {
        table.increments('id');
        table.string('type').notNullable();
        table.dateTime('date_time').notNullable();
        table.integer('patient_id').unsigned().notNullable();
        table.foreign('patient_id').references('patients.id');
        table.integer('doctor_id').unsigned().notNullable();
        table.foreign('doctor_id').references('doctors.id');
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
        table.dateTime('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('refresh_tokens')
    .dropTableIfExists('appointments')
    .dropTableIfExists('doctors')
    .dropTableIfExists('patients')
    .dropTableIfExists('patient_addresses')
    .dropTableIfExists('gps')
    .dropTableIfExists('gp_addresses')
    .dropTableIfExists('admins');
};
