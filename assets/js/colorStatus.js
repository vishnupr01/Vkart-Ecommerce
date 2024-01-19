
  // Assuming orderList is an array containing your orders

  // Function to set color based on orderStatus value
  function setColorBasedOnOrderStatus(orderStatus, elementId) {
    var element = document.getElementById(elementId);

    switch (orderStatus) {
      case 'pending':
        element.classList.add('alert-warning');
        break;
      case 'Shipped':
        element.classList.add('alert-success');
        break;
      case 'cancelled':
        element.classList.add('alert-danger');
        break;
      // Add more cases as needed

      default:
        // Default color or class
        element.classList.add('default-color');
    }
  }

  // Loop through orderList and set color for each orderStatus
  for (var i = 0; i < orderList.length; i++) {
    var orderStatus = orderList[i].orderItems.orderStatus;
    var elementId = 'orderStatus' + i;
    setColorBasedOnOrderStatus(orderStatus, elementId);
  }

