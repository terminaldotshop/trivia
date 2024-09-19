defmodule TriviaWeb.Auth do
  import Phoenix.LiveView

  def on_mount(:default, _params, session, socket) do
    session
    |> Map.get("user_id")
    |> case do
      nil ->
        {:halt, redirect(socket, to: "/")}

      user_id ->
        {:cont, socket}
    end
  end
end
