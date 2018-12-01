$(document).ready(function() {
  var CONTENT_ID = "my_tutorial";
  var annotation = $(".content").annotator();
 
  annotation.annotator("addPlugin", "Store", {
    prefix: "",
    loadFromSearch : {
      content_id : CONTENT_ID, 
    },
    annotationData : {
      content_id : CONTENT_ID,
      content_version : CONTENT_VERSION,
    },
    urls: {
      create:  "/create",
      update:  "/update/:id",
      destroy: "/delete/:id",
      search:  "/search"
    }
  });

  function updateOutdatedAnn(ann) {
    for (var hl of ann.highlights) {
      hl.className += " old-annotation";
    }
  }

  annotation.annotator("subscribe", "annotationsLoaded", function(annotations) {
    for (var ann of annotations) {
        if (ann.content_version != CONTENT_VERSION) {
            updateOutdatedAnn(ann);
        }
    }
  });
});
