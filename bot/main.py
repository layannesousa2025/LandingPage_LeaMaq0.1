import os
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv
from neonize.client import NewClient
from neonize.events import MessageEv, ConnectedEv
from neonize.types import MessageSource
from neonize.utils import log

# Carregar variáveis de ambiente
load_dotenv()

# Configuração do Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("ERRO: GEMINI_API_KEY não encontrada no arquivo .env")
else:
    genai.configure(api_key=GEMINI_API_KEY)

# Configuração do Modelo e System Prompt
generation_config = {
    "temperature": 0.7,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 1024,
}

SYSTEM_PROMPT = """
Você é o Assistente Tecnico, o assistente virtual inteligente da L&A Maq.
Sua missão é atender clientes interessados em assistência técnica para eletrodomésticos em Brasília - DF.

**Informações da L&A Maq:**
- Serviços: Conserto, instalação e manutenção de geladeiras (Side by Side, duplex, etc), máquinas de lavar, lava e seca, freezers, adegas e fornos.
- Marcas Atendidas: Electrolux, Brastemp, Samsung, LG, Consul, Continental, Philco, Panasonic, Midea, GE Appliances, Viking.
- Diferenciais: Peças originais, equipe especializada, atendimento em domicílio e garantia nos serviços.
- Localização: Atendemos em todo o Distrito Federal (Brasília).

**Seu Comportamento:**
1. Seja sempre educado, profissional e prestativo.
2. Tire dúvidas técnicas básicas (ex: "minha geladeira não gela", "máquina fazendo barulho").
3. **MUITO IMPORTANTE**: Seu objetivo final é coletar os seguintes dados para um orçamento/agendamento:
   - Nome do Cliente
   - Endereço (ou bairro em Brasília)
   - Marca e Modelo do aparelho
   - Descrição do problema
4. Assim que coletar essas informações, informe que um técnico entrará em contato em breve para finalizar o orçamento.

Responda sempre em Português do Brasil.
"""

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    system_instruction=SYSTEM_PROMPT
)

# Inicializar cliente WhatsApp
# O arquivo tiago_session.sqlite3 salvará sua conexão para não precisar ler o QR todas as vezes.
client = NewClient("Assistente Tecnico_session.sqlite3")

@client.event(ConnectedEv)
def on_connected(_: NewClient, __: ConnectedEv):
    log.info("✅ Assistente Tecnico está online no WhatsApp!")
    print("\n" + "="*50)
    print("Assistente Tecnico ESTÁ PRONTO!")
    print("Escaneie o QR Code acima se for a primeira vez.")
    print("="*50 + "\n")

@client.event(MessageEv)
def on_message(client: NewClient, message: MessageEv):
    # Ignorar mensagens enviadas pelo próprio bot
    if message.Info.MessageSource.IsFromMe:
        return

    # Extrair texto da mensagem
    text = ""
    if message.Message.conversation:
        text = message.Message.conversation
    elif message.Message.extendedTextMessage:
        text = message.Message.extendedTextMessage.text

    if not text:
        return

    sender = message.Info.MessageSource.Sender.User
    chat = message.Info.Chat

    print(f"📩 Mensagem de {sender}: {text}")

    try:
        # Gerar resposta com Gemini
        # Nota: Para manter o histórico, poderíamos usar start_chat(), 
        # mas por simplicidade neste MVP usaremos generate_content.
        response = model.generate_content(text)
        reply_text = response.text

        # Enviar resposta
        client.reply_message(reply_text, message)
        print(f"🤖 Assistente Tecnico respondeu: {reply_text[:50]}...")

    except Exception as e:
        log.error(f"Erro ao processar mensagem: {e}")
        client.reply_message("Desculpe, tive um probleminha técnico. Pode repetir?", message)
    
def start_bot():
    print("Iniciando o Assistente Tecnico...")
    client.connect()

if __name__ == "__main__":
    start_bot()
