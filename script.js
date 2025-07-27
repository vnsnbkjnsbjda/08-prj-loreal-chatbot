/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const latest = document.getElementById('latest');

latest.innerHTML = 'Your latest response will appear here';


// Set initial message
newBubble = document.createElement('div');
newBubble.classList.add('assistantBubble', 'msg');
newBubble.innerHTML =  "Hello! How may I assist you?";
chatWindow.appendChild(newBubble);

let messages = [
  {
    role: 'system', content: `You are a helpful and supportive expert at Loreal. 

    You are knowledgable about the products of Loreal and its brand partners. 
    
    You should be knowledgable about dematology and cosmotology to ensure product compatibility 
    with the client's health.

    Stay up to date with recent beauty trends to recommend and promote relevant style/product.

    Personalize the response by asking the user what they are looking for and what is suitable for them
    when applicable.
    Questions may include: Skin undertone, Hair type, hair color, skin type, product preference, and
    formulae preference. Make sure to specify these questions as optional.

    Ensure that the products being recommended are still in production and are certified safe to use by
    professionals.

    When prompted a farewell or thank you, provide an empowering message about individual beauty.
    
    It is important that you apologize and politely refuse to answer messages unrelated to Loreal and its partners.
    
    Try to keep your responses as concise as possible without losing important details.`
  }
]

const workerUrl = 'https://lorealchatbot.mxk2179.workers.dev/';

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  latest.innerHTML = userInput.value;

  let newBubble;

  // add user msg
  newBubble = document.createElement('div');
  newBubble.classList.add('userBubble', 'msg');
  newBubble.innerHTML = userInput.value;
  chatWindow.appendChild(newBubble);

  // Scroll to bottom
  chatWindow.scrollTop = chatWindow.scrollHeight;

  messages.push({role: 'user', content: userInput.value})

  // temp thinking msg - delay to seem more humanlike
  setTimeout(function(){
    let temp;
    temp = document.createElement('div');
    temp.classList.add('assistantBubble', 'msg');
    temp.id = 'tempBubble';
    temp.innerHTML = 'Thinking . . .';
    chatWindow.appendChild(temp);
  }, 500);
  

  const response = await fetch(workerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: messages,
      max_tokens: 200,
    }),
  });

  if (!response.ok){
    throw new Error(`Fetch failed --- STATUS: ${response.status}`);
  }

  const data = await response.json();

  messages.push({role: 'assistant', content: data.choices[0].message.content});

  // remove thinking bubble
  document.getElementById('tempBubble').remove();

  // add assistant message
  newBubble = document.createElement('div');
  newBubble.classList.add('assistantBubble', 'msg');
  newBubble.innerHTML = data.choices[0].message.content;
  chatWindow.appendChild(newBubble);

  userInput.value = '';

  // Scroll to bottom
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

