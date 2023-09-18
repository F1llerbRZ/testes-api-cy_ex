/// <reference types="cypress" />
import contratoUsuario from '../contracts/usuarios.contract'
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {

     let token
     before(() => {
          cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
     });

    it('Deve validar contrato de usuários', () => {
             cy.request('usuarios').then(response => {
                  return contratoUsuario.validateAsync(response.body)
        })
    });

    it('Deve listar usuários cadastrados', () => {
        cy.request({
            method: 'GET',
            url: 'usuarios',
        }).then((response) =>{
           expect(response.body.usuarios[0].nome).to.equal('Caneta Azul')
           expect(response.status).to.equal(200)
           expect(response.body).to.have.property('usuarios')
           expect(response.duration).to.be.lessThan(20)
        })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
     let email = faker.internet.email()
     cy.cadastrarUsuario("Fulano da Silva", email, "teste", "true")
        .then((response) =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
            expect(response.duration).to.be.lessThan(35)
        })
    });

    it('Deve validar um usuário com email inválido', () => {
        cy.cadastrarUsuario("usuario", "beltrano@qa.com.br", "teste", "true")
          .then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.message).to.equal('Este email já está sendo usado')
          })    
    });

    it('Deve editar um usuário previamente cadastrado', () => {
     cy.cadastrarUsuario("usuario", "beltrano@qa.com.br", "teste", "true")
     .then((response) => {
          expect(response.status).to.equal(400)
          expect(response.body.message).to.equal('Este email já está sendo usado')
     })

});

it('Deve editar um usuário previamente cadastrado', () => {
     let email = faker.internet.email()
     cy.cadastrarUsuario("Fulano da Silva", email, "teste", "true")
          .then(response => {
               let id = response.body._id
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    headers: { authorization: token },
                    body:
                    {
                         "nome": "Caneta Azul",
                         "email": email,
                         "password": "teste",
                         "administrador": "true"
                    }
               }).then(response => {
                    expect(response.status).to.equal(200)
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
                    expect(response.duration).to.be.lessThan(32)
               })
          })
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
     let email = faker.internet.email()
          cy.cadastrarUsuario("Fulano da Silva", email, "teste", "true")
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`,
                         headers: { authorization: token }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro excluído com sucesso')
                    })
               })

     });



});
