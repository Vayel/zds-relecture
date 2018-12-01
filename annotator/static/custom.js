$(document).ready(function() {
  var PAGE_ID = "page";
  var annotation = $('.content').annotator();
 
  annotation.annotator('addPlugin', 'Store', {
    prefix: '',
    loadFromSearch : {
      page : PAGE_ID
    },
    annotationData : {
      page : PAGE_ID
    },
    urls: {
      create:  '/create',
      update:  '/update/:id',
      destroy: '/delete/:id',
      search:  '/search'
    }
  });
});
