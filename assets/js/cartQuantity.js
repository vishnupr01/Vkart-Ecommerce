function handleInputChange(index) {
  alert('hi')
  // Get the input element
  var inputElement = document.getElementById('form'+index);

  // Get the current value
  var currentValue = inputElement.value;

  // Create a data object to send to the backend
  var data = {
    quantity: currentValue
  };

  // Perform a fetch request to the backend
  fetch('/getCart', {
    method: 'GET', // You can change this to 'GET' or 'PUT' depending on your backend
    headers: {
      'Content-Type': 'application/json'
      // You may need to add other headers based on your backend requirements
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(responseData => {
    // Handle the response from the backend if needed
    console.log('Backend response:', responseData);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}