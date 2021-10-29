/*
  @param {string} url
  @return {string}
*/
function getDomain(url) {
  return url.replace(/.+\/\/|www.|\..+/g, "").toLowerCase();
}

/*
  @param {string} url
  @param {string} domain
  @return {string|null}
*/
function getSource(url, domain) {
  switch (domain) {
    case "youtube":
      return getVideoIdYoutube(url);
    default:
      return null;
  }
}

/*
  all youtube URLs are 11 characters long
  @param {string} url
  @return {string}
*/
function getVideoIdYoutube(url) {
  const YOUTUBE_VIDEO_ID_LENGTH = 11;
  let start = 0;

  while (start < url.length) {
    if (url[start] === "v" && url[start + 1] === "=") {
      start += 2;
      break;
    }
    start++;
  }

  const videoId = url.substring(start, start + YOUTUBE_VIDEO_ID_LENGTH);
  return `https://www.youtube.com/embed/${videoId}`;
}

export { getDomain, getSource };
