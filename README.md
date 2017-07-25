# Project Information
Simple token based authorization project

## How to install?

- In order to install dependencies just execute following command:

```
npm install
```

- In order to run server locally run following command:
```
DEBUG=myapp:* npm start
```

Sequelize ORM Integration

1. Clone in Desktop
// Install Sequelize ORM
$npm install --save sequelize
// Install Sequelize Command Line Interface(CLI) Tool
$npm install --save sequelize-cli
// Initialize Sequlize ORM in order to generate ORM files
$sequelize init
// result
Sequelize [Node: 4.2.6, CLI: 2.7.0, ORM: 4.0.0]

Created "config/config.json"
Successfully created migrations folder at "/data/projects/nodejs/exam/migrations".
Successfully created seeders folder at "/data/projects/nodejs/exam/seeders".
Successfully created models folder at "/data/projects/nodejs/exam/models".
Initialize migrations, this command creates : model, migrations, seeds, config.json

// Create a sequelize config file
$sequelize init
Create simple User model
// user model
$sequelize model:create --force --name Users --attributes "username:string, password:string,  first_name:string, last_name:string, birth_date:Date, email:string, token:string, pid:string, type:string"

DB model migration.
$sequelize db:migrate

Application migration setting
in config.json add following line: "use_env_variable": "DATABASE_URL"
for heroku PostgreSQL use environment setting value: var sequelize = new Sequelize(process.env.DATABASE_URL);


// After login welcome page test
method: POST
URL: http://localhost:3000/welcome
Header: add Authorization and add JWT + token