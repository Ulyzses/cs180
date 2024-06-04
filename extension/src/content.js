if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scanForMessageBody);
} else {
  scanForMessageBody();
}

function scanForMessageBody(){
  const messages = setInterval(() => {
    console.log('Scanning for Message Body');
    const messageBody = document.querySelectorAll('[aria-label="Message Body"]');

    if(messageBody.length > 0) {
      clearInterval(messages);
      readMessage();
    }
  }, 5000);
}

function readMessage() {
  const messageBody = document.querySelectorAll('div[aria-label="Message Body"]')[0];
  const sendButton = document.querySelectorAll('[aria-label="Send"]')[0];

  console.log('Message Body: ', messageBody);
  console.log('Send Button: ', sendButton);

  sendButton.addEventListener('click', async () => {
    await needAttachment(messageBody.innerHTML);
    scanForMessageBody();
  }, { once: true });
}

async function needAttachment(message) {
  console.log('Message: ', message);

  try {
    const response = await fetch('https://ulyzses.pythonanywhere.com/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: message })
    });

    const { prediction } = await response.json();
    console.log('Prediction: ', prediction);

    if ( prediction ) {
      const attachment = document.querySelector('[aria-label^="Attachment:"]');

      if ( !attachment ) {
        alert("Your email indicates an attachment is needed. Please attach a file.");
      }
    }
  } catch (error) {
    console.error('Error: ', error.message);
  }
}