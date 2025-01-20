import type { APIRoute } from "astro";

// Add this line to force server-side rendering
export const prerender = false;

export const config = {
  runtime: "edge",
};

export const GET: APIRoute = async ({ request }) => {
  // Log raw request for debugging
  // console.log("Raw request:", request);
  // console.log("Request headers:", Object.fromEntries(request.headers));

  // Get URL and parameters
  const url = new URL(request.url);
  const rawQuery = url.search;
  // console.log("Raw query string:", rawQuery);

  // Parse parameters
  const params = new URLSearchParams(rawQuery);
  // console.log("Parsed search params:", Object.fromEntries(params));

  const props = {
    id: params.get("id") || "",
    title: params.get("title") || "",
    completed: params.get("completed") === "true",
  };

  if (!props.id || !props.title) {
    return new Response("Missing required parameters", {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new Response(
    `<li data-id="${props.id}">
      <input type="checkbox" ${props.completed ? "checked" : ""}>
      <span>${props.title}</span>
    </li>`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
};
