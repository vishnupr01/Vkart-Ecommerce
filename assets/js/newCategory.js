function deleteCategory(documentId) {
  // AJAX request
  $.ajax({
    url: 'api/unlisted', // replace with your server endpoint
    type: 'GET',
    data: { documentId: documentId },
    success: function(response) {
      // Handle success response
      window.location.href = '/adminCategory'
      // Optionally, update the UI or perform additional actions
    },
    error: function(error) {
      // Handle error response
      console.error('Error deleting category:', error);
      // Optionally, display an error message to the user
    }
  });
}




