function deletesCategory(documentId) {
  // AJAX request
  $.ajax({
    url: 'api/deleteProductlist', // replace with your server endpoint
    type: 'GET',
    data: { documentId: documentId },
    success: function(response) {
      // Handle success response
      window.location.href = '/productlist'
      // Optionally, update the UI or perform additional actions
    },
    error: function(error) {
      // Handle error response
      console.error('Error deleting category:', error);
      // Optionally, display an error message to the user
    }
  });
}
function AddCategory(documentId) {
  // AJAX request
  $.ajax({
    url: 'api/addProductlist', // replace with your server endpoint
    type: 'GET',
    data: { documentId: documentId },
    success: function(response) {
      window.location.href = "/productUnlist"
     
    },
    error: function(error) {
      // Handle error response
      console.error('Error deleting category:', error);
      // Optionally, display an error message to the user
    }
  });
}

