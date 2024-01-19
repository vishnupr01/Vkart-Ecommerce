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
