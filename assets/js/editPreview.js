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
function cropImages(fileId) {
  var image = document.getElementById(`image_${fileId}`).getElementsByTagName('img')[0];

  // Initialize Cropper.js for the image
  var cropper = new Cropper(image, {
    aspectRatio: 16/14, // Set your desired aspect ratio
    crop: function(event) {
      // You can access the cropped data using event.detail.x, event.detail.y, event.detail.width, event.detail.height
     

      // Display the cropped image in the modal
      var croppedImage = document.getElementById('croppedImage');
      croppedImage.src = cropper.getCroppedCanvas().toDataURL();

      // Open the modal
      $('#cropModal').modal('show');
    }
  });

  // ...

  // Save the cropped image back to the preview
  saveCroppedImage = function() {
    // Get the cropped data from the Cropper instance
    var canvas = cropper.getCroppedCanvas();
    var blob = canvas.toBlob(function(blob) {
        // Create a new File object with the cropped image data
        var croppedFile = new File([blob], `cropped_${fileId}.png`, { type: 'image/png' });
        croppedFile.fileId = fileId;

        // Get the original input files
        var inputFiles = document.getElementById('imageUpload').files;

        // Check if a file with the same fileId already exists in the inputFiles
        var existingFileIndex = Array.from(inputFiles).findIndex(file => file.fileId === fileId);

        // Create a new FileList with the original files
        var newFileList = new DataTransfer();
        Array.from(inputFiles).forEach(function(file, i) {
            // If a file with the same fileId exists, replace it with the cropped file
            if (i === existingFileIndex) {
                newFileList.items.add(croppedFile);
            } else {
                newFileList.items.add(file);
            }
        });
  console.log(newFileList.items);
        // Update the input files with the new FileList
        document.getElementById('imageUpload').files = newFileList.files;
        cropper.destroy();
        // Close the modal
        $('#cropModal').modal('hide');
    });
};
}
function closeModal(){
 
  $('#cropModal').modal('hide');
}

