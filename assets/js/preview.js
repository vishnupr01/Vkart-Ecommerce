

document.getElementById('imageUpload').addEventListener('change', function (e) {
  var files = e.target.files;
  var updatedFiles = [];

  for (let i = 0; i < files.length; i++) {
    (function (file) {
      var reader = new FileReader();

      reader.onload = function (e) { 
        var imageDiv = document.createElement('div');
        imageDiv.className = 'col-md-3 mb-3';
        var fileId = Date.now();
        imageDiv.innerHTML = `<div id="image_${fileId}">
           <img src="${e.target.result}" class="img-thumbnail" alt="Image Preview" />
           <button class="delete" onclick="deleteImages(${fileId})">delete</button>
           <button class="delete" type="button"  onclick="cropImage(${fileId})">Crop Image</button>
         </div>`;

        // Update the input files with the new File object
        var fileWithId = new File([file], file.name, { type: file.type });
        fileWithId.fileId = fileId;
       
        updatedFiles.push(fileWithId);

        // Create a new FileList with the updated files
        var newFileList = new DataTransfer();
        updatedFiles.forEach(function (file) {
          newFileList.items.add(file);
        });

        // Update the input files
        document.getElementById('imageUpload').files = newFileList.files;

        document.getElementById('imagePreview').appendChild(imageDiv);
      };

      reader.readAsDataURL(file);
    })(files[i]);
  }
});

function deleteImages(fileId) {
  var imageDiv = document.getElementById(`image_${fileId}`);
  imageDiv.parentNode.removeChild(imageDiv);

  // Remove the file from the input files
  var inputFiles = document.getElementById('imageUpload').files;
  var updatedFiles = Array.from(inputFiles).filter(function (file) {
    return file.fileId !== fileId;
  });

  // Create a new FileList with the updated files
  var newFileList = new DataTransfer();
  updatedFiles.forEach(function (file) {
    newFileList.items.add(file);
  });

  // Update the input files
  document.getElementById('imageUpload').files = newFileList.files;
}


function cropImage(fileId) {
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
        
        // Close the modal
        $('#cropModal').modal('hide');
    });
};
}
function closeModal(){
 
  $('#cropModal').modal('hide');
}




