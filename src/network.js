/* eslint-disable no-restricted-globals */
import localforage from 'localforage';
import { deserializeRequest, serializeRequest } from './request';

const QUEUE_NAME = 'queue';

const broadcast = new BroadcastChannel('sw-channel');

export function enqueueRequest(request, id) {
  return serializeRequest(request, id).then(function (serialized) {
    localforage.getItem(QUEUE_NAME).then(function (queue) {
      queue = queue || [];

      queue.push(serialized);

      return localforage.setItem(QUEUE_NAME, queue).then(function () {
        console.log(serialized.method, serialized.url, 'enqueued!');
      });
    });
  });
}

export function flushQueue() {
  return localforage.getItem(QUEUE_NAME).then(function (queue) {
    queue = queue || [];

    if (!queue.length) {
      return Promise.resolve();
    }

    return sendInOrder(queue).then(function () {
      return localforage.setItem(QUEUE_NAME, []);
    });
  });
}

function sendInOrder(requests) {
  const sending = requests.reduce((prevPromise, serializedRequest) => {
    const { id } = JSON.parse(serializedRequest.body);

    return prevPromise.then(function () {
      return deserializeRequest(serializedRequest).then(async function (request) {
        const response = await fetch(request);
        const clonedResponse = response.clone();
        const payload = await response.json();

        broadcast.postMessage({
          type: 'SYNC_OFFLINE_TODO',
          payload,
          offlineId: id,
        });

        return clonedResponse;
      });
    });
  }, Promise.resolve());
  return sending;
}

export const tryOrFallback = async (req, constructOfflineResponse, appendId = false) => {
  if (!navigator.onLine) {
    const offlineItemId = appendId ? Math.random() : null;
    await enqueueRequest(req, offlineItemId);

    return constructOfflineResponse(req, offlineItemId);
  }

  await flushQueue();

  return fetch(req);
};

export const constructOfflinePostResponse = async (request, id) => {
  const clonedRequest = request.clone();
  const body = await clonedRequest.json();

  return new Response(
    JSON.stringify({ ...body, id, isOffline: true }),
    { headers: { 'Content-Type': 'application/json' } },
  );
};

export const httpMethods = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

export function processFetchRequest(event) {
  const { method } = event.request;

  switch (method) {
    case httpMethods.POST:
      return tryOrFallback(event.request.clone(), constructOfflinePostResponse, true);
      default:
        // TODO: replace it
        return new Response();
  }
}
