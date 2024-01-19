function validateEmail(email) {
  // Regular expression for a basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateEmailInput() {
  const emailInput = document.getElementById('email');
  const validationMessage = document.getElementById('validation-message');

  const email = emailInput.value.trim();

  if (email === '') {
    validationMessage.textContent = 'Email cannot be empty';
    validationMessage.style.color = 'red';
  } else if (validateEmail(email)) {
    validationMessage.textContent = 'Valid email address';
    validationMessage.style.color = 'green';
  } else {
    validationMessage.textContent = 'Invalid email address';
    validationMessage.style.color = 'red';

   
  }
  
}
