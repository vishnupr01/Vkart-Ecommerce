function AddCategory(documentId) {
  // AJAX request
  $.ajax({
    url: 'api/listed', // replace with your server endpoint
    type: 'GET',
    data: { documentId: documentId },
    success: function(response) {
      window.location.href = '/unlistedCategory'
     
    },
    error: function(error) {
      // Handle error response
      console.error('Error deleting category:', error);
      // Optionally, display an error message to the user
    }
  });
}