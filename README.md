Node.js, & MySQL: simples (CRUD)
========


Instale Nodejs <br />
https://nodejs.org/en/ <br />
Instale o Mysql Versao 5 <br />
https://www.mysql.com/ <br />

**Na pasta raiz do projeto execute o comando** <br />
``` npm install```

**Cria o banco de dados e as tabelas**
```
create database NodeCRUD; 

use NodeCRUD; 

create table clientes ( <br />
idCli int not null primary key AUTO_INCREMENT, <br />
nome varchar(50) not null,
email varchar(50) not null,
senha varchar(10) not null,
telefone int(11) not null
);


create table endereco (
idEnd int(8) not null primary key AUTO_INCREMENT,
local varchar(100) not null,
numero int not null,
bairro varchar(50),
cidade varchar(50),
estado varchar(50),
idCli int(8) not null,
foreign key(idCli) references clientes (idCli)
);
```

**No arquivo app.js do Nodejs linhas 14 e 15 coloque no nome do seu usuario mysql e senha**
```
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'usuarioSeuBancoDados',
    password : 'senhaSeuBancoDados',
    database : 'NodeCRUD'
});
```
**Caso na tiver senha**
```
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'usuarioSeuBancoDados',
    database : 'NodeCRUD'
});
```
**Na pasta raiz execute**
```node app.js ```
