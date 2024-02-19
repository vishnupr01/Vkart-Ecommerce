const image=document.getElementById(`image_${fileId}`)
const cropper=new Cropper(image,{
  aspectRatio:0,
  viewMode:0,
})
document.getElementById('cropImageBtn').addEventListener('click',function(){
  var croppedImage=cropper.getCroppedCanvas().toDataURL(image)
  alert(croppedImage)
  document.getElementById('output').src =croppedImage
})