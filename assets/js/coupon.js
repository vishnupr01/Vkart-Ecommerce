
function deleteCoupon(documentId) {
  Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
      if (result.isConfirmed) {
          // Redirect to delete route with coupon ID
          $.ajax({
            url: `/api/deleteCoupon?CouponId=${documentId}`, // replace with your server endpoint
            type: 'GET',
            data: { documentId: documentId },
            success: function(response) {
              // Handle success response
              window.location.href = '/addCoupon';
              // Optionally, update the UI or perform additional actions
            },
            error: function(error) {
              // Handle error response
              console.error('Error deleting category:', error);
              // Optionally, display an error message to the user
            }
          });
      }
  });
}


