# API de Operadoras Ativas

## Descrição
Esta API foi desenvolvida utilizando **Python**, **Vue.js** e **MySQL**, com o objetivo de fornecer uma ferramenta de busca eficiente dentro de uma tabela, permitindo filtragem de dados com base no conteúdo de suas colunas.

## Tecnologias Utilizadas
### Backend:
- **Flask** (Framework web para Python)
- **Flask-CORS** (Gerenciamento de CORS)
- **pymysql** (Conexão com MySQL)
- **dotenv** (Gerenciamento de variáveis de ambiente)

### Frontend:
- **Vue.js** (Framework JavaScript para interface de usuário)
- **Vite** (Ferramenta de build rápida)
- **CSS** (Estilização da aplicação)

## Estrutura do Projeto
```
API-Operadoras-Ativas/
├── backend/             # Código do backend
│   ├── app.py          # Arquivo principal da API
│   ├── config.py       # Configurações do sistema
│   ├── .env            # Variáveis de ambiente
├── frontend/            # Código do frontend
│   ├── public/         # Arquivos estáticos
│   ├── src/            # Código-fonte Vue.js
│   │   ├── assets/     # Recursos estáticos
│   │   ├── components/ # Componentes reutilizáveis
│   │   ├── App.vue     # Componente raiz
│   │   ├── main.js     # Arquivo de inicialização
│   │   ├── script.js   # Scripts auxiliares
│   │   ├── style.css   # Estilos CSS
│   ├── index.html      # Arquivo principal do frontend
│   ├── package.json    # Dependências do frontend
│   ├── vite.config.js  # Configuração do Vite
├── scripts_sql/         # Pasta compactada contendo scripts SQL necessários para o banco de dados
├── .gitignore           # Arquivos ignorados pelo Git
├── .gitattributes       # Configuração de atributos do Git
├── README.md            # Documentação do projeto
```

## Configuração do Banco de Dados
Antes de executar a aplicação, é necessário configurar o banco de dados MySQL. Para isso:
1. Extraia a pasta `scripts_sql` que contém os arquivos necessários para criação das tabelas e população inicial do banco.
2. Execute os scripts SQL no MySQL para criar a estrutura correta.
3. Certifique-se de configurar as credenciais do banco no arquivo `config.py`.

## Como Executar
### Backend:
1. Instale as dependências do backend:
   ```bash
   pip install -r requirements.txt
   ```
2. Execute a API:
   ```bash
   python backend/app.py
   ```

### Frontend:
1. Acesse a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```


