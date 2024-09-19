defmodule TriviaWeb.Stream do
  use TriviaWeb, :live_view

  def render(assigns) do
    ~H"""
    <div class="absolute inset-0 flex items-center justify-center">
      todo
    </div>
    """
  end

  def mount(_params, _session, socket) do
    {:ok, socket}
  end
end
