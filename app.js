const express          = require('express');
const mysql            = require('mysql');
const bodyParser       = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const session          = require('express-session');
const cookieParser     = require('cookie-parser');
const flash            = require('connect-flash');

const app = express();

// Criar conexao
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'mysql1994',
    database : 'NodeCRUD'
});

// //Criar banco de dados e as tabelas
// db.query('CREATE DATABASE IF NOT EXISTS NodeCRUD', (err) => {
//     if (err) throw err;
//     db.query('USE NodeCRUD', function (err) {
//         if (err) throw err;
//         db.query('CREATE TABLE IF NOT EXISTS clientes('
//             + 'idCli int not null primary key,'
//             + 'nome varchar(50) not null,'
//             + 'email varchar(50) not null'
//             + 'senha varchar(10) not null'
//             + 'telefone int not null'
//             +  ')', 
//             (err) => {
//                 if (err) throw err;
//             });
//     });
// });

// Verificar a Conexao com o banco
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('Conectado no banco de dados...');
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(expressSanitizer()); 
app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 60000 }}));

app.use(flash());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


/** ROTAS */
app.get('/', (req, res) => {
    res.render('index', {
        titulo: 'CRUD com Nodejs e MySql',
        mensagem: 'Seja Bem-vindo!'
    });
});

app.get('/adicionar-endereco', (req, res) => {
    
    let sql = 'SELECT idCli FROM clientes';

    let query = db.query(sql, (err, result) => {
        if(err){
            throw err;
        } 
        else{ 
            res.render('user/addEndereco', {
                local: '',
                numero: '',
                bairro: '',
                cidade: '',
                estado: '',
                id: result        
            })
        }
        console.log(result);
    });
});

app.post('/adicionar-endereco', (req, res) => {

    let input = JSON.parse(JSON.stringify(req.body));

    let endereco = {
        local: input.local,
        numero: input.numero,
        bairro: input.bairro,
        cidade: input.cidade,
        estado: input.estado,
        idCli: input.idCli 
    };

    db.query('INSERT INTO endereco SET ?', endereco, (err, result) => {
        if(err) {
            //throw err
            res.render('user/addEndereco', {
                local: endereco.local,
                numero: endereco.numero,
                bairro: endereco.bairro,
                cidade: endereco.cidade,
                estado: endereco.estado,
                id:  endereco.idCli                   
            })
        }
        else{
            console.log('Adicionado sucesso');

            req.flash('success', 'Endereço dicionado com sucesso!');
            res.locals.message = req.flash();

            // res.render('user/addEndereco', {
            //     local: '',
            //     numero: '',
            //     bairro: '',
            //     cidade: '',
            //     estado: '',
            //     id: endereco.idCli                              
            // })
        }
    });
});

app.get('/adicionar-cliente', (req, res) => {
    
    res.render('user/adicionar', {
        nome: '',
        email: '',
        senha: '',
        telefone: '',       
    })
});

// ADD NEW USER POST ACTION
app.post('/adicionar-cliente', function(req, res, next){ 

    let input = JSON.parse(JSON.stringify(req.body));

    let cliente = {
        nome: input.nome, 
        email: input.email,
        senha: input.senha,
        telefone: input.telefone
    }

    db.query('INSERT INTO clientes SET ?', cliente, (err, result) => {
        if(err) {
            throw err
            res.render('user/adicionar', {
                nome: cliente.nome,
                email: cliente.email,
                senha: cliente.senha,
                telefone: cliente.telefone                    
            })
        }
        else{
            console.log('Adicionado sucesso');

            req.flash('success', 'Adicionado com sucesso!');
            res.locals.message = req.flash();

            res.render('user/adicionar', {
                nome:'',
                email: '',
                senha: '',
                telefone: '',                    
            })
        }
        
    });
});

app.get('/listar-clientes', (req, res) => {
    let sql = 'SELECT * FROM clientes';
    let query = db.query(sql, (err, result) => {
        if(err){
            throw err;
        } 
        else{ 
            res.render('user/listar', {
               dados: result
            });
        }
        //console.log(result);
    });
});

app.get('/listar-tudo', (req, res) => {
    let sql = 'select nome, email, senha, telefone, local, numero, bairro, cidade, estado from clientes inner join endereco on clientes.idCli=endereco.idCli;';
    let query = db.query(sql, (err, result) => {
        if(err){
            throw err;
        } 
        else{ 
            //console.log(result);
            res.render('user/listAll', {
               dados: result
            });
        }
        //
    });
});

// Excluir um cliente
app.get('/delete/:id', (req, res) => {
    let sql = `DELETE FROM clientes WHERE idCli = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        //console.log(result);
        res.redirect('/listar-clientes')
        console.log(`Cliente ${req.params.id} Excluido com sucesso...`);
    });
});

// Editar um cliente
app.get('/edit/:id', (req, res) => {
    let sql = `SELECT * FROM clientes WHERE idCli = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
            res.render('user/edit', {
                id: result[0].idCli,
                nome: result[0].nome,
                email: result[0].email,
                senha: result[0].senha,
                telefone: result[0].telefone
            });
       // console.log(JSON.stringify(result));
    });
});

app.post('/edit/:id', (req, res) => {

    let input = JSON.parse(JSON.stringify(req.body));
    let id = req.params.id;
    

    let cliente = {
        nome: input.nome,
        email: input.email,
        senha: input.senha,
        telefone: input.telefone
    }

    let query = db.query('UPDATE clientes SET ? WHERE idCli = ? ',[cliente, id] , (err, result) => {
        if(err) {
            throw err;
        } else {
            console.log('Editado com sucesso');
            req.flash('success', 'Cliente editado com sucesso!');
            res.locals.message = req.flash();
             res.render('user/edit', {
                 id: req.params.id,
                 nome: req.body.nome,
                 email: req.body.email,
                 senha: req.body.senha,
                 telefone: req.body.telefone
             });
            //res.redirect('/listar-clientes');
        }
    });
});

app.listen('3000', () => {
    console.log('Servidor rodando na porta 3000, acesse no navegador http://localhost:3000');
});