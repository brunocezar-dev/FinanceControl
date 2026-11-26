# FinanceControl — Sistema Financeiro

Aplicação de portfólio para organizar receitas, despesas e contas a pagar. O projeto contém uma interface web responsiva e uma API REST em Java com Spring Boot e MySQL.

## Tecnologias
- Java 17
- Spring Boot 3.3.5
- Spring Web, Spring Data JPA e MySQL Driver
- MySQL 8+
- HTML5, CSS3 e JavaScript
- Chart.js para gráficos

## Estrutura

```text
FinanceControl/
├── index.html
├── style.css
├── app.js
├── assets/
│   └── photo.png
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/br/com/financecontrol/
│       │   ├── FinanceControlApplication.java
│       │   ├── controller/
│       │   ├── model/
│       │   ├── repository/
│       │   └── config/
│       └── resources/application.properties
└── README.md
```

## 1. Executar a interface (modo demonstração)
1. Extraia o ZIP.
2. Abra a pasta `FinanceControl` no VS Code.
3. Abra `index.html` no navegador (recomendado: extensão Live Server).
4. A interface inicia em modo demonstração. Você pode cadastrar/excluir lançamentos e marcar contas como pagas. Os dados de demonstração ficam no `localStorage` do navegador.

## 2. Executar a API Java + MySQL
Pré-requisitos: JDK 17, Maven e MySQL 8 instalados.

1. No MySQL, crie o banco:
   ```sql
   CREATE DATABASE financecontrol CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Abra `backend/src/main/resources/application.properties` e ajuste usuário e senha do MySQL.
3. No terminal do VS Code, entre na pasta `backend`:
   ```bash
   cd backend
   ```
4. Inicie a API:
   ```bash
   mvn spring-boot:run
   ```
5. A API ficará em `http://localhost:8080`.

## 3. Conectar a interface à API
Depois de iniciar o backend, abra `app.js` e altere:
```js
const DEMO_MODE = true;
```
para:
```js
const DEMO_MODE = false;
```
Abra o `index.html` usando Live Server. A API permite consultar e cadastrar movimentações e contas.

## Endpoints REST

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/transactions` | Listar movimentações |
| POST | `/api/transactions` | Criar movimentação |
| DELETE | `/api/transactions/{id}` | Excluir movimentação |
| GET | `/api/bills` | Listar contas a pagar |
| POST | `/api/bills` | Criar conta |
| PATCH | `/api/bills/{id}/pay` | Marcar conta como paga |
| POST | `/api/users` | Cadastrar usuário |
| GET | `/api/users` | Listar usuários cadastrados |

Exemplo de movimentação:
```json
{
  "description": "Salário",
  "category": "Trabalho",
  "type": "INCOME",
  "amount": 3500.00,
  "date": "2026-11-25"
}
```

## Git e GitHub

Dentro da pasta `FinanceControl`, execute:
```bash
git init
git add .
git commit -m "feat: cria projeto FinanceControl"
```
Crie um repositório vazio no GitHub chamado `FinanceControl`. Depois conecte e envie:
```bash
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/FinanceControl.git
git push -u origin main
```
Troque `SEU-USUARIO` pelo seu usuário do GitHub.

## Observações importantes
- O modo demonstração usa dados locais do navegador; não precisa de MySQL.
- O backend é uma base didática para portfólio. Antes de publicar como sistema real, implemente autenticação/autorização, validação mais completa, migrações do banco, testes e proteção dos dados.
- A senha do banco fica no arquivo local `application.properties`; não publique credenciais reais no GitHub.
