/**
 * Generic function to make a post request
 * @param url type string. The url to make the post request to
 * @param body type T. Json data to send to the url
 * @returns Promise<J>
 */
export async function postRequest<T, J>(url: string, body: T): Promise<J> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  const response: J = await fetch(url, requestOptions).then((res) =>
    res.json()
  );

  return response;
}

/**
 * Generic function to make a put request
 * @param url type string. The url to make the post request to
 * @param body type T. Json data to send to the url
 * @returns Promise<J>
 */
export async function putRequest<T, J>(url: string, body: T): Promise<J> {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  const response: J = await fetch(url, requestOptions).then((res) =>
    res.json()
  );

  return response;
}
