defmodule TriviaWeb.Home do
  use TriviaWeb, :live_view

  def render(assigns) do
    ~H"""
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="flex flex-col justify-center gap-4 ">
        <div>
          <h1 class="font-[600]">terminal [trivia]</h1>
          <p class="text-gray-10">
            # a live game show for devs<br /> # win real cash prizes
          </p>
        </div>
        <a href={@authorize} class="text-orange font-[600] text-left">
          sign in with github ➔
        </a>
      </div>
    </div>
    """
  end

  def mount(_params, _session, socket) do
    authorize =
      %URI{
        scheme: "https",
        host: "auth.terminal.shop",
        path: "/github/authorize",
        query:
          URI.encode_query(%{
            redirect_uri: socket.host_uri,
            response_type: "code",
            client_id: "trivia"
          })
      }
      |> URI.to_string()

    socket = assign(socket, authorize: authorize)
    {:ok, socket}
  end
end
