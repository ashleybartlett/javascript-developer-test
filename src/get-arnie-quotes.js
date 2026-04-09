const { httpGet } = require('./mock-http-interface');

const getArnieQuote = async (url) => {
  const response = await httpGet(url)
  const responseBody = JSON.parse(response.body)

  if (!("message" in responseBody)) {
    throw new Error(`Missing 'message' field in response body call to ${url}`)
  }

  const { message } = responseBody;

  if (response.status !== 200) {
    return {"FAILURE": message}
  } else {
    return {"Arnie Quote": message}
  }
}

const getArnieQuotes = async (urls) => {
  const queries = await Promise.allSettled(
    urls.map(u => getArnieQuote(u))
  );

  const results = queries.map(q => {
    if(q.status !== "fulfilled") {
      throw q.reason
    } 
    return q.value
  })

  return results;
};

module.exports = {
  getArnieQuotes,
};
