function deletemyImage(index, id) {

  fetch(`/delete-image?imageId=${index}&productId=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', // Adjust the content type if needed
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error deleting image: ${response.status} ${response.statusText}`);
      }
        // Handle successful deletion, e.g., remove the corresponding HTML element
        const imagePreview = document.getElementById(`imagePreview_${index}`);
        if (imagePreview) {
          
          imagePreview.remove();
          // Redirect to the same page
     
         console.log("after redirection");
        }
        location.reload()
     
    })
   
    .catch(error => {
      console.error('Error deleting image:', error.message);
    });
}
