

let mainMediaList = [];
let currentActiveEntry = null;

function cleanString(input) {
  var output = "";
  for (var i=0; i<input.length; i++) {
      if (input.charCodeAt(i) <= 127) {
          output += input.charAt(i);
      }
  }
  return output;
}


fetch("/get-media-list")
  .then((response) => response.json())
  .then((media_list) => {
    media_list = media_list.map(element => {element["id"] = element["filename"].replace(/\s+/g, '-').replace(/[^\w.-]+/g, ""); return element})
    console.log(media_list);
    mainMediaList = media_list;
    let listEntry = document.getElementById("list_entry");
    media_list.forEach(media_entry => {
      let html_str = `
      <a id="${media_entry["id"]}" href="#${media_entry["id"]}" class="list-group-item list-group-item-action py-3 lh-tight"">
        <div class="d-flex w-100 align-items-center justify-content-between WordWrap">
          <strong class="mb-1">${media_entry["filename"]}</strong>
          <small class="text-muted">Tues</small>
        </div>
        <div class="col-10 mb-1 small">Some placeholder content in a paragraph below the heading and date.</div>
      </a>
      `
    listEntry.insertAdjacentHTML("beforeend", html_str);
    });
  });

function getMediaType(filename) {
  let ext = filename.split(".").pop().toLowerCase();
  if (ext === "mp4" || ext === "mkv")
    return "video"
  else if (ext === "png" || ext === "jpg" || ext === "webp")
    return "image"
}

window.addEventListener('hashchange',() => {
  // console.log(event)
  let oldID, newID = "";
  if (event["oldURL"]) {
    oldID = event["oldURL"].split("#").length == 2 ? event["oldURL"].split("#").pop() : "";
  }
  newID = event["newURL"].split("#").length == 2 ? event["newURL"].split("#").pop() : "";
  // update select
  if (oldID != "") {
    // console.log(oldID);
    let oldElement = document.getElementById(oldID);
    if (oldElement) {
      oldElement.classList.remove("active");
      oldElement.removeAttribute("aria-current");
    }
  }
  let newElement = document.getElementById(newID);
  newElement.classList.add("active");
  newElement.setAttribute("aria-current", "true");

  let currentMedia = mainMediaList.find(x => x.id == newID);
  currentActiveEntry = currentMedia;

  let entryViewElement = document.getElementById("entry_view");
  entryViewElement.innerHTML = "";

  // begin display stuffs
  let media_type = getMediaType(newID);
  if (!currentMedia.embed_json_file) {
    if (media_type == "video") {
      let html_str = `<iframe width="800" height="600" src="/media/${currentMedia.filename}" frameborder="0" allowfullscreen></iframe>`
      entryViewElement.insertAdjacentHTML("beforeend", html_str)
    } else if (media_type == "image") {
      let html_str = `<img src="/media/${newID}"/>`
      entryViewElement.insertAdjacentHTML("beforeend", html_str)
    }
  } else {
    if (media_type == "video") {
      let html_str = `<iframe width="800" height="600" src="/media/${currentMedia.filename}" frameborder="0" allowfullscreen></iframe>`
      entryViewElement.insertAdjacentHTML("beforeend", html_str)
    }
    if (currentMedia.embed_json_file && currentMedia.embed_json_file.extractor_key == "Twitter") {
      let html_str = `
      <blockquote class="twitter-tweet">
        <a href="https://twitter.com/i/status/${currentMedia.embed_json_file.webpage_url_basename}"></a> 
      </blockquote>
      `
      entryViewElement.insertAdjacentHTML("beforeend", html_str)
    }
  }


})

// <!--  -->
// <a href="#" class="list-group-item list-group-item-action active py-3 lh-tight" aria-current="true">
//   <div class="d-flex w-100 align-items-center justify-content-between">
//     <strong class="mb-1">Ignore me</strong>
//     <small>Wed</small>
//   </div>
//   <div class="col-10 mb-1 small">This is a template entry.</div>
// </a>
// <!--  -->
// <a href="#" class="list-group-item list-group-item-action py-3 lh-tight" onclick="entryClicked()">
//   <div class="d-flex w-100 align-items-center justify-content-between">
//     <strong class="mb-1">List group item heading</strong>
//     <small class="text-muted">Tues</small>
//   </div>
//   <div class="col-10 mb-1 small">Some placeholder content in a paragraph below the heading and date.</div>
// </a>
// <!--  -->