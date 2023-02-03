# <p align = "center"> Shortly </p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-Mateus Gueler-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/MatGueler/Projeto16-shortly-back?color=4dae71&style=flat-square" />
</p>

## :clipboard: Descrição

O **Shortly** é um projeto para o usuário criar links curtos para compartilhar com mais facilidade com os amigos, evitando aquele link enorme que ocupa várias linhas na hora de enviar para os amigos. O usuário pode criar um link encurtado e gerenciar a quantidade de acessos que aquele link obteve.

## :computer: Tecnologias e Conceitos

- REST APIs
- Node.js (v16.17.0)
- JavaScript

---

## :rocket: Rotas

```yml
POST: '/signin'
    - Rota para o usuário fazer login com sua conta
    - headers: { }
    - body: {
        email: "Email do usuário",
        password: "12345678",
    }
```

```yml
POST: '/signup'
    - Rota para o usuário criar sua conta
    - headers: { }
    - body: {
        name: "Nome do usuario",
        email: "Email do usuário",
        password: "12345678",
        confirmPassword: "12345678",
    }
```

```yml
POST: '/urls/shorten (Autenticada)'
    - Rota para o usuário criar sua conta
    - headers: {
        Authorization: `Bearer ${token}`,
    }
    - body: {
      url: "Url para encurtar",
    }
```

```yml
GET: '/urls/:id'
    - Rota para buscar informações da url encurtada
    - params: {
        id: 'Id da url'
    }
    - headers: { }
    - body: { }
```

```yml
DELETE: '/urls/:id' (Autenticada)
    - Rota para apagar os dados da url encurtada
    - params: {
        id: 'Id da url'
    }
    - headers: {
        Authorization: `Bearer ${token}`,
    }
    - body: { }
```

```yml
GET: '/urls/open/:shortUrl'
    - Rota para o usuário criar sua conta
    - params: {
        shortUrl: 'Url encurtada'
    }
    - headers: { }
    - body: { }
```

```yml
POST: '/users/me' (Autenticada)
    - Rota para o usuário criar sua conta
    - headers: {
        Authorization: `Bearer ${token}`,
     }
    - body: { }
```

```yml
GET: '/ranking'
    - Rota para o usuário criar sua conta
    - headers: { }
    - body: { }
```

---

## 🏁 Rodando a aplicação

- Local

O projeto possui algumas dependências essenciais que requerem a última versão estável de [Node.js](https://nodejs.org/en/download/) e [npm](https://www.npmjs.com/). Portanto, certifique-se de que sua versão em execução local seja compatível.

Primeiro, clone este repositório em sua máquina:

```
git clone git@github.com:MatGueler/Projeto16-shortly-back.git
```

Em seguida, dentro da pasta, execute o seguinte comando para instalar as dependências.

```
npm install
```

Preencha o arquivo **.env** com as informações presentes no **env.exemple**.

Terminado o processo, basta iniciar a aplicação:

```
npm run start
```
