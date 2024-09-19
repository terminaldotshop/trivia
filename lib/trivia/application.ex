defmodule Trivia.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    IO.inspect(Node.self())

    children = [
      TriviaWeb.Telemetry,
      {DNSCluster, query: Application.get_env(:trivia, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Trivia.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: Trivia.Finch},
      # Start a worker by calling: Trivia.Worker.start_link(arg)
      # {Trivia.Worker, arg},
      # Start to serve requests, typically the last entry
      TriviaWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Trivia.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    TriviaWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
