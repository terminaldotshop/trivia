defmodule TriviaWeb.AuthController do
  alias Hex.HTTP
  use TriviaWeb, :controller

  def callback(conn, _params) do
    code = conn.query_params["code"]

    host =
      conn
      |> Plug.Conn.get_req_header("host")
      |> hd()
      |> IO.inspect()

    {:ok, claims} =
      "https://auth.dev.terminal.shop/token"
      |> HTTPoison.post!(
        {:form,
         %{
           "client_id" => "trivia",
           "redirect_uri" => "http://" <> host <> "/auth/callback",
           "code" => code,
           "grant_type" => "authorization_code"
         }},
        [
          {"Content-Type", "application/x-www-form-urlencoded"}
        ]
      )
      |> Map.get(:body)
      |> Jason.decode!()
      |> Map.get("access_token")
      |> Joken.peek_claims()

    conn
    |> put_session(
      :user_id,
      claims
      |> Map.get("properties")
      |> Map.get("userID")
    )
    |> redirect(to: "/stream")
  end
end
