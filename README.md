# Chat Reflexão

Um aplicativo web para gerar reflexões bíblicas e psicológicas usando IA, com suporte a múltiplos idiomas e histórico de reflexões.

## Funcionalidades

- 🤖 Geração de reflexões usando IA
- 📚 Suporte a reflexões bíblicas e psicológicas
- 🌍 Suporte a múltiplos idiomas (Português e Inglês)
- 📝 Histórico de reflexões salvas
- 🔐 Autenticação de usuários
- 💾 Armazenamento seguro no Supabase

## Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Python FastAPI
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **IA**: OpenAI API

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/chat-reflexao.git
cd chat-reflexao
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
NEXT_PUBLIC_API_URL=url_do_seu_backend
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
├── app/                    # Rotas e páginas do Next.js
│   ├── api/               # Rotas da API
│   ├── historico/         # Página de histórico
│   └── login/             # Página de login
├── components/            # Componentes React
├── lib/                   # Utilitários e configurações
└── styles/               # Estilos globais
```

## Melhorias Recentes

- Adicionado suporte a múltiplos idiomas
- Implementado histórico de reflexões
- Melhorado tratamento de erros na API
- Aumentado timeout para modelos gratuitos
- Adicionado feedback visual durante geração
- Implementada autenticação de usuários

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## ✨ Finalidade do Projeto

Este projeto tem como objetivo oferecer ao usuário uma experiência de reflexão diária, seja com base em princípios bíblicos ou psicológicos. Através de uma interface intuitiva, o usuário digita um pensamento, dúvida ou sentimento, escolhe o tipo de reflexão desejado e recebe uma resposta personalizada da IA.

Funcionalidades principais:

- Escolha entre reflexão **Bíblica** ou **Psicológica**.
- Interface de chat com envio de mensagens.
- Visualização clara da resposta da IA.
- Opção de salvar ou descartar a reflexão.
- Armazenamento das reflexões no Supabase.

---

## 🖼️ Telas do Projeto

### 🏠 Tela Inicial

![image](https://github.com/user-attachments/assets/ebc5f883-a8d8-4d8b-b924-5a6d66aaebc1)

---

## 🚀 Tecnologias Utilizadas

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase**
- **artificial intelligence(AI)**
- **React Hooks**

---
