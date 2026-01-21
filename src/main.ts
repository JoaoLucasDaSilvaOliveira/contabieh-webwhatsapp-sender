import { createApp } from 'vue'
import { createPinia } from 'pinia'
// O ?inline diz ao Vite para importar o CSS como uma string de texto, não injetar na head
import style from '@/assets/style.css?inline' 
import App from './App.vue'
import router from './router'

// 1. Criar o elemento hospedeiro na página do WhatsApp
const hostId = 'contabiehl-extension-host';
let host = document.getElementById(hostId);

if (!host) {
  host = document.createElement('div');
  host.id = hostId;
  host.style.position = 'absolute';
  host.style.top = '0px'
  host.style.right = '0';
  host.style.zIndex = '99999'; // Fica sobre tudo
  host.style.pointerEvents = 'none'; // Permite clicar através da área vazia
  document.body.appendChild(host);
}

// 2. Criar Shadow DOM para isolar estilos
// Verifica se já existe shadowRoot para evitar erro em re-injeções (hot reload)
const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });

// 3. Injetar o CSS do Tailwind DENTRO do Shadow DOM
// Limpa estilos antigos se houver
const oldStyle = shadow.querySelector('style');
if(oldStyle) oldStyle.remove();

const styleTag = document.createElement('style');
styleTag.textContent = style;
shadow.appendChild(styleTag);

// 4. Criar o container do Vue dentro do Shadow
let appContainer = shadow.getElementById('app');
if (!appContainer) {
  appContainer = document.createElement('div');
  appContainer.id = 'app';
  
  // --- CORREÇÃO ---
  // Removemos o 'style.all = initial' que estava bloqueando sua fonte.
  
  // Garantimos apenas que o container se comporte como um bloco padrão e aceite cliques
  appContainer.style.display = 'block';
  appContainer.style.pointerEvents = 'auto';

  // Aplicamos as classes do Tailwind.
  // Como removemos o 'style.all', essas classes agora VÃO funcionar.
  // 'font-sans' usará a fonte definida no CSS (Satoshi) se o Tailwind estiver configurado, 
  // mas a regra do #app no style.css garante isso de qualquer forma.
  appContainer.classList.add('font-sans', 'text-base', 'antialiased', 'text-gray-900');
  
  shadow.appendChild(appContainer);
}


// 5. Montar a aplicação
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount(appContainer)