import bcrypt from 'bcrypt';

const superUserPassword = bcrypt.hashSync(process.env.JWT_KEY, 10);
const regularUserPassword = bcrypt.hashSync(process.env.USER_PASSWORD, 10);

const seedSuperUser = `
  INSERT INTO users (firstname,lastname,email,admin,password)
    VALUES ('Chima','Emeka','emecus10@gmail.com',true,'${superUserPassword}');
`;

const seedRegularUser = `
  INSERT INTO users (firstname,lastname,email,admin,password)
    VALUES ('Bright','Chiemela','brighto@gmail.com',false,'${regularUserPassword}');
`;

const seedSuperUserRequests = `
  INSERT INTO requests (title,type,description,user_id,status)
    VALUES ('My Television','repair','My Television displays black and white and cant dispaly colors',1,'pending');
  INSERT INTO requests (title,type,description,user_id,status)
    VALUES ('Bad Air Conditioner','repair','The air conditioner makes noise and doesnt cool',1,'approved');
  INSERT INTO requests (title,type,description,user_id,status)
    VALUES ('Broken Drawer','repair','Please, I have a broken Drawer',1,'pending');
  INSERT INTO requests (title,type,description,user_id,status)
    VALUES ('Bad Lawn','repair','Please, I have a bad Lawn',1,'pending');
`;

const seed = async (pool) => {
  try {
    await pool.query(seedSuperUser);
    await pool.query(seedRegularUser);
    await pool.query(seedSuperUserRequests);
    return true;
  } catch (err) {
    throw err;
  }
};

export default seed;
