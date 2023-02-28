




fetch("/get-media-list")
  .then((response) => response.json())
  .then((media_list) => {
    console.log(media_list);
    let listEntry = document.getElementById("list_entry");
    media_list.forEach(media_entry => {
      let html_str = `<a href="#" class="list-group-item list-group-item-action py-3 lh-tight">
      <div class="d-flex w-100 align-items-center justify-content-between WordWrap">
        <strong class="mb-1">${media_entry["filename"]}</strong>
        <small class="text-muted">Tues</small>
      </div>
      <div class="col-10 mb-1 small">Some placeholder content in a paragraph below the heading and date.</div>
    </a>`
    listEntry.insertAdjacentHTML("beforeend", html_str);
    });
  });
