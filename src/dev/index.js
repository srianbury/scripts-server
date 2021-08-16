async function initDb(models) {
  const bsunburyPassword = await models.Password.create({
    password: "myfirstpassword",
  });

  const steviesPassword = await models.Password.create({
    password: "stevespassword",
  });

  const bsunbury = await models.User.create({
    username: "bsunbury",
    email: "bsunbury@scripts.com",
    passwordId: bsunburyPassword.dataValues.id,
    roles: "GOD",
  });

  const stevie = await models.User.create({
    username: "stevie",
    email: "stevie@scripts.com",
    passwordId: steviesPassword.dataValues.id,
  });

  await models.Script.create({
    title: "the story",
    text: "this is the story of a girl",
    userId: bsunbury.dataValues.id,
  });

  await models.Script.create({
    title: "stevies story",
    text: "somebody once told me",
    userId: stevie.id,
  });
}

export { initDb };
