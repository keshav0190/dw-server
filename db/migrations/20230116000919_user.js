
exports.up = function(knex) {
    return knex.schema.createTable('user', (table) => {
        table.increments('id');
        table.string('email').notNullable().unique();
        table.string('phone_no').notNullable().unique();
        table.string('password').notNullable();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.boolean('status').notNullable().defaultTo(0);
        table.timestamps(true, true);
      })
    
      .createTable('otp', (table) => {
        table.increments('id');
        table.string('otp').notNullable().unique();
        table.integer('user_id').references('id').inTable('user');
      })

      .createTable('notes', (table) => {
        table.increments('id');
        table.integer('user_id').references('id').inTable('user');
        table.string('title').notNullable();
        table.string('body').notNullable();
        table.boolean('status').notNullable().defaultTo(1);
        table.timestamps(true, true);
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable('notes').dropTable('otp').dropTable('user');
};
