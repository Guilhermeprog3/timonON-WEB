# 🏛️ Painel Web - Prefeitura de Timon

Este repositório contém o front-end do sistema administrativo da Prefeitura de Timon, desenvolvido como parte de um projeto de extensão acadêmico. A plataforma permite o gerenciamento de reclamações dos cidadãos, visualização de métricas e administração de usuários.

> ⚠️ **Importante:** Este projeto documenta apenas a parte **web (front-end)**. A API back-end foi desenvolvida separadamente.

---

## 🚀 Tecnologias Utilizadas

- **React.js** com **Next.js** 
- **TypeScript**
- **shadcn/ui** para componentes visuais
- **NextAuth.js** com autenticação via **JWT**
- **Zod** para validações de formulário

---

## 🎨 Paleta de Cores

| Cor         | Uso                          |
|-------------|------------------------------|
| `#EFAE0C`   | Cor principal (destaques)     |
| `#291F75`   | Cor secundária (menu e fundo) |
| `#FFFFFF`   | Fundo de conteúdo             |

---

## 🔐 Autenticação

A autenticação dos administradores é feita via [NextAuth.js](https://next-auth.js.org/) utilizando JWT. O token é salvo em cookies e utilizado para autenticar requisições protegidas ao back-end.

---

## 🧩 Estrutura de Páginas

### 🔑 Página de Login

- Acesso exclusivo para administradores
- Validação de campos com Zod
- Redirecionamento automático após login

### 🔒 Página de Recuperação de Senha

- Solicitação de envio de código por e-mail
- Validação do código recebido
- Redefinição de nova senha

---

## 🛠️ Funcionalidades para Superadministradores

### 📊 Dashboard Geral

- Total de reclamações
- Reclamações pendentes, em andamento e resolvidas
- Lista rápida das últimas reclamações

### 🗂️ Listagem de Reclamações

- Filtros por status, categoria, bairro, data e texto livre
- Paginação e ordenação por data
- Ações em lote (ex: atualizar status)

### 📝 Detalhes da Reclamação

- Exibição completa da denúncia
- Foto, mapa e dados do cidadão
- Histórico de atualizações e comentários administrativos

### 👥 Gerenciamento de Usuários

- Visualização e edição de usuários
- Cadastro de novos administradores e atribuição a departamentos

### ⚙️ Tela de Configurações

- Visualização e alteração de dados pessoais
- Fluxo completo de redefinição de senha com verificação por e-mail

---

## 💼 Funcionalidades para Administradores de Departamento

### 📊 Dashboard Setorial

- Estatísticas específicas por setor

### 🗂️ Listagem de Reclamações

- Apenas as reclamações atribuídas ao setor
- Filtros similares à visualização do superadministrador

### 📝 Detalhes da Reclamação

- Possibilidade de alterar o status
- Inserção de comentários internos
- Visualização de histórico, mapa e foto

---

## 🧪 Como Rodar o Projeto Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/Guilhermeprog3/timonON-WEB.git

# 2. Acesse o diretório
cd timonON-WEB

# 3. Instale as dependências
yarn install

# 4. Crie um arquivo .env.local com as variáveis:
NEXTAUTH_SECRET= [gere uma chave secreta]
NEXTAUTH_URL=http://localhost:3000

# 5. Rode a aplicação
yarn dev
