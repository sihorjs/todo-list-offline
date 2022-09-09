export function serializeRequest(request, id) {
  const headers = {};

  for (const entry of request.headers.entries()) {
    headers[entry[0]] = entry[1];
  }

  const serialized = {
    url: request.url,
    headers: headers,
    method: request.method,
    mode: request.mode,
    credentials: request.credentials,
    cache: request.cache,
    redirect: request.redirect,
    referrer: request.referrer
  };

  return request.clone().text().then(function(body) {
    if (!id) {
      serialized.body = body;
      return Promise.resolve(serialized);
    }

    const todoPayload = JSON.parse(body);
    const todoPayloadWithId = { ...todoPayload, id };
    const stringifiedTodo = JSON.stringify(todoPayloadWithId);

    serialized.body = stringifiedTodo;
    return Promise.resolve(serialized);
  });
}

export function deserializeRequest(data) {
  return Promise.resolve(new Request(data.url, data));
}
