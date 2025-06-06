document$.subscribe(function() {
  var feedback = document.forms.feedback;
  if (!feedback) return; // Ensure the form exists before proceeding

  feedback.hidden = false;

  feedback.addEventListener("submit", function(ev) {
    ev.preventDefault();

    var page = document.location.pathname;
    var data = ev.submitter.getAttribute("data-md-value");

    console.log(page, data);

    feedback.firstElementChild.disabled = true;

    var note = feedback.querySelector(
      ".md-feedback__note [data-md-value='" + data + "']"
    );
    if (note) note.hidden = false;
  });
});