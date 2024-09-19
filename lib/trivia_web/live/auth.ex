defmodule TriviaWeb.Auth do
  import Phoenix.LiveView

  def on_mount(:default, _params, session, socket) do
    dbg(session)
    {:halt, redirect(socket, to: "/")}
  end
end
