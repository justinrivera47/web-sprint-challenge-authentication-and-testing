exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').truncate()
  await knex('users').insert([
    {username: 'Captain Marvel', password: '$2a$06$BUFPouZvJN6z.EnotjgrWeX7Ipj9rlwQPMtRy83t1ZVavXE6ZgNuq'} //foobar
  ]);
};
