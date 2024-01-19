// function navigateToCategory(categoryName) {
//   axios.get('http://localhost:3000/api/categoryFind')
//     .then(response => {
//       let categories = response.data;

//       // Find the category with the specified name
//       let selectedCategory = categories.find(category => category.name == categoryName);


//       let route = `/laptop?param=${encodeURIComponent(selectedCategory.name)}`;
//       console.log(route);


//       // Redirect to the determined route
//       window.location.href = route;
//     })
//     .catch(error => {
//       console.error('Error fetching categories:', error);
//       // Handle error or set a default route in case of an error
//       window.location.href = '/';
//     });
// }
