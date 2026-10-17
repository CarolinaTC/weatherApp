# Weather, wherever

Aplicação web para consultar as condições meteorológicas atuais de uma cidade, com uma interface responsiva e fundos que mudam consoante a temperatura. Desenvolvida com React e Vite, utiliza a Open-Meteo para obter dados sem necessidade de uma chave de API.

## Screenshots

### Ecrã inicial

Campo de pesquisa, sugestões de cidades e mensagem de apresentação antes da primeira consulta.

![Ecrã inicial da aplicação, com campo de pesquisa e fundo de montanhas cobertas de neve](docs/screenshots/estado-inicial.png)

### Resultado de uma pesquisa

Condições atuais em Lisboa, com temperatura, sensação térmica, humidade, vento e hora local da observação. Os valores apresentados são exemplos de uma captura e variam entre consultas.

![Resultado da pesquisa por Lisboa, com as condições meteorológicas e os detalhes da observação](docs/screenshots/pesquisa-lisboa.png)

## Funcionalidades

- **Pesquisa por cidade:** submissão através do botão Search ou da tecla Enter, com remoção dos espaços no início e no fim do texto.
- **Condições atuais:** temperatura e sensação térmica em °C, humidade relativa em percentagem e velocidade do vento em km/h.
- **Identificação da localização:** cidade, região e país devolvidos pelo serviço de geocodificação.
- **Descrição do estado do tempo:** conversão dos códigos meteorológicos em descrições e ícones, incluindo chuva, neve, nevoeiro e trovoada.
- **Data e hora locais:** apresentação da data e da hora da observação no fuso horário da cidade pesquisada.
- **Fundos dinâmicos:** fotografia de ambiente quente para temperaturas superiores a 16 °C e fotografia de ambiente frio nos restantes casos, incluindo o estado inicial.
- **Feedback durante a pesquisa:** indicador de carregamento e botão temporariamente desativado.
- **Mensagens de erro:** validação de pesquisas demasiado curtas, cidades não encontradas, falhas de ligação, respostas inválidas e indisponibilidade do serviço.
- **Limite de espera:** cancelamento de pesquisas que ultrapassem 15 segundos, permitindo tentar novamente.
- **Preservação do último resultado:** uma pesquisa sem sucesso apresenta o erro e mantém as últimas condições obtidas.
- **Interface responsiva e acessível:** adaptação a ecrãs pequenos, pesquisa por teclado, foco visível e mensagens identificadas para tecnologias de apoio.

## Tecnologias

| Tecnologia | Utilização |
| --- | --- |
| React 17 e React DOM | Componentes funcionais e atualização da interface |
| JavaScript com ES Modules | Organização e reutilização do código |
| Vite 6 e plugin React | Servidor de desenvolvimento e build de produção |
| CSS | Layout com Flexbox e Grid, fundos fotográficos e media queries |
| Fetch API | Pedidos HTTP assíncronos aos serviços externos |
| AbortController | Cancelamento de pedidos em curso |
| Intl.DateTimeFormat | Formatação de datas e horas por fuso horário |
| ESLint e regras de React Hooks | Análise estática do código |
| node:test e node:assert/strict | Testes automatizados sem framework adicional |

## Implementações técnicas

### Separação de responsabilidades

O formulário e o ciclo de pesquisa ficam em `App.jsx`. O componente `WeatherCard` recebe os dados já normalizados e apresenta as condições meteorológicas. Os pedidos às APIs e a validação das respostas ficam no serviço `weather.js`; a formatação das datas e a interpretação dos códigos meteorológicos ficam nos utilitários.

Esta organização permite testar a integração com os serviços e a formatação dos dados sem renderizar a interface.

### Integração com as APIs

Cada pesquisa válida segue este fluxo:

1. Validar o nome da cidade, exigindo pelo menos dois caracteres após `trim()`.
2. Consultar a API de geocodificação e selecionar o primeiro resultado.
3. Utilizar a latitude e a longitude obtidas para consultar as condições meteorológicas atuais.
4. Validar os campos numéricos e normalizar a resposta para o formato utilizado pela interface.
5. Apresentar os dados e atualizar o fundo de acordo com a temperatura.

| Serviço | Endpoint | Finalidade |
| --- | --- | --- |
| Open-Meteo Geocoding | `https://geocoding-api.open-meteo.com/v1/search` | Resolver o nome da cidade para coordenadas |
| Open-Meteo Forecast | `https://api.open-meteo.com/v1/forecast` | Obter temperatura, sensação térmica, humidade, código meteorológico e vento |

Os pedidos utilizam HTTPS. `URL` e `URLSearchParams` constroem os endereços e codificam os parâmetros, incluindo nomes com acentos ou caracteres especiais. As unidades são definidas explicitamente como Celsius e km/h.

O serviço pede timestamps Unix e o fuso horário com `timezone=auto`. Converte os timestamps de segundos para milissegundos antes de os formatar com `Intl.DateTimeFormat`.

### Estado, cancelamento e limpeza

- `useState` gere o texto da pesquisa, o resultado, o carregamento e a mensagem de erro.
- `useRef` mantém o controlador do pedido ativo e a referência do temporizador.
- Uma nova pesquisa cancela o pedido anterior e limpa o respetivo temporizador.
- O resultado de um pedido cancelado é ignorado, evitando que substitua uma pesquisa mais recente.
- O temporizador cancela o pedido após 15 segundos e apresenta uma mensagem de espera excedida.
- A função de limpeza de `useEffect` cancela o pedido e remove o temporizador quando o componente é desmontado.

### Validação e tratamento de erros

O serviço distingue falhas de rede, respostas HTTP sem sucesso, JSON inválido, localizações inexistentes e dados meteorológicos incompletos. Os campos numéricos são verificados com `Number.isFinite`, evitando apresentar valores inválidos. Os cancelamentos preservam o tipo `AbortError`.

### Acessibilidade e apresentação

O formulário inclui uma etiqueta associada ao campo de pesquisa e permite submissão por teclado. As mensagens de erro usam `role="alert"`; a área de resultados utiliza `aria-live` e `aria-busy` para comunicar alterações e carregamento. Os ícones decorativos são ocultados das tecnologias de apoio.

O CSS utiliza uma largura máxima para o conteúdo, Flexbox no formulário, Grid nos detalhes meteorológicos e uma media query para ecrãs até 480 px. As imagens de fundo são assets locais incluídos no build.

### Ferramentas de desenvolvimento

O Vite substitui a configuração original de Create React App. O projeto mantém React 17 e inclui um lockfile para instalação reproduzível com `npm ci`. Os testes utilizam o runner nativo do Node.js, sem dependências adicionais de teste.

## Estrutura do projeto

```text
weatherApp/
├── docs/
│   └── screenshots/          # Capturas utilizadas neste README
├── public/                   # Favicon, manifesto e ficheiros estáticos
├── src/
│   ├── assets/               # Fotografias dos fundos quente e frio
│   ├── components/
│   │   └── WeatherCard.jsx   # Apresentação das condições atuais
│   ├── services/
│   │   ├── weather.js        # Geocodificação e consulta meteorológica
│   │   └── weather.test.js   # Testes do serviço
│   ├── test/
│   │   └── fixtures.js       # Respostas de exemplo para os testes
│   ├── utils/
│   │   ├── weather.js        # Códigos meteorológicos, datas e horas
│   │   └── weather.test.js   # Testes de formatação e condições
│   ├── App.jsx               # Formulário e gestão da pesquisa
│   ├── index.css             # Estilos globais e responsivos
│   └── index.jsx             # Inicialização da aplicação React
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js
```

## Executar localmente

### Requisitos

- Node.js 18.18 ou superior; recomenda-se uma versão LTS mantida.
- npm.
- Ligação à internet para consultar as APIs.

Na pasta do projeto, instalar as dependências e iniciar o servidor:

```sh
npm ci
npm start
```

Abrir [http://localhost:3000](http://localhost:3000). A porta 3000 deve estar disponível. As alterações ao código são refletidas automaticamente durante o desenvolvimento. Para parar o servidor, usar `Ctrl+C` no terminal.

Não é necessário criar um ficheiro `.env` nem configurar uma chave de API.

### Comandos disponíveis

| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia o servidor de desenvolvimento na porta 3000 |
| `npm run dev` | Executa o mesmo comando de `npm start` |
| `npm run lint` | Verifica JavaScript e regras de React Hooks |
| `npm test` | Executa todos os testes automatizados |
| `npm run test:watch` | Repete os testes quando os ficheiros são alterados |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |

Para verificar a versão de produção:

```sh
npm run build
npm run preview
```

Abrir o endereço apresentado no terminal pelo Vite.

## Testes

Os 10 testes automatizados utilizam respostas simuladas das APIs, sem depender de uma ligação à internet ou das condições meteorológicas do momento.

| Área | Casos cobertos |
| --- | --- |
| Serviço meteorológico | Codificação da pesquisa, unidades métricas, normalização dos dados e passagem do sinal de cancelamento |
| Validação | Pesquisa demasiado curta e cidade sem resultados |
| Erros externos | Falhas HTTP, falhas de rede, JSON inválido e dados meteorológicos incompletos |
| Cancelamento | Preservação de `AbortError` |
| Apresentação | Datas e horas em diferentes fusos horários, incluindo mudança de dia |
| Condições | Descrição de códigos meteorológicos e alternativa para códigos desconhecidos |

```sh
npm test
npm run lint
npm run build
```

## Âmbito e fontes de dados

A aplicação apresenta condições atuais e utiliza o primeiro resultado da pesquisa por cidade. A interface e as descrições meteorológicas estão em inglês. Os dados são atualizados quando é submetida uma pesquisa; não existe atualização automática periódica, previsão para vários dias, backend ou cache para utilização offline.

- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api): pesquisa de localizações.
- [Open-Meteo Forecast API](https://open-meteo.com/en/docs): condições meteorológicas.
- [GeoNames](https://www.geonames.org/): fonte dos dados de localização.
- [Termos da Open-Meteo](https://open-meteo.com/en/terms): condições de utilização do serviço.
