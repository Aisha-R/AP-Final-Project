
exports.seed = function(knex) {
      return knex('admins').insert([
        {email: 'enfield@nhsgp.org', password: '$2b$12$Z76bEEn5aQlfaPZl6s1ifO3754G97MDYwxLT.RPGCsZMOXhzsJCAS'}, //adminPassword
        {email: 'edmonton@nhsgp.org', password: '$2b$12$M8bKtSGxoUu7MR5ipkgUt.NSLD4EhXETc/k/sNY.ocws9TLYH.Vxy'} //adminPassword2
      ]);
};
