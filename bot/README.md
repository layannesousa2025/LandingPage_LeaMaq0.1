# Assistente Tiago - L&A Maq (WhatsApp AI)

Esta é a assistente inteligente Tiago, pronta para atender seus clientes no WhatsApp.

## 🚀 Como Inicializar

1. **Obtenha a Chave de API**:
   - Vá para o [Google AI Studio](https://aistudio.google.com/).
   - Clique em "Get API Key".
   - Copie a chave gerada.

2. **Configure o arquivo .env**:
   - Abra o arquivo `bot/.env` neste projeto.
   - Substitua `INSIRA_SUA_CHAVE_AQUI` pela sua chave do Gemini.

3. **Inicie o Bot**:
   - Abra o terminal na pasta do projeto.
   - Execute o comando:
     ```bash
     python -m bot.main
     ```
   - Um **QR Code** aparecerá no seu terminal.
   - Abra o WhatsApp no seu celular, vá em **Aparelhos Conectados** e escaneie o código.

## 🤖 O que a Tiago faz?
- Responde dúvidas sobre conserto de geladeiras, máquinas de lavar e outros aparelhos.
- Conhece todas as marcas (Electrolux, Brastemp, Samsung, etc).
- Tenta coletar Nome, Endereço e Problema para facilitar o seu agendamento.
