defmodule TriviaWeb.Stream do
  alias Phoenix.PubSub
  use TriviaWeb, :live_view

  @topic "global"

  def mount(_params, session, socket) do
    if connected?(socket) do
      PubSub.subscribe(Trivia.PubSub, @topic)
    end

    {:ok,
     assign(socket,
       user_id: session["user_id"],
       chat_input: "",
       messages: []
     )}
  end

  def render(assigns) do
    ~H"""
    <div class="absolute inset-0 flex items-center justify-center">
      <div>
        <div>
          <%= for message <- Enum.reverse(@messages) do %>
            <div><%= message.message %></div>
          <% end %>
        </div>
        <input
          type="text"
          value={@chat_input}
          phx-keyup="chat_submit"
          phx-key="Enter"
          class="bg-transparent"
        />
      </div>
    </div>
    """
  end

  def handle_event("chat_submit", %{"value" => value}, socket) do
    Phoenix.PubSub.broadcast(
      Trivia.PubSub,
      @topic,
      {:chat,
       %{
         user_id: socket.assigns.user_id,
         message: value
       }}
    )

    {:noreply, assign(socket, chat_input: "empty")}
  end

  def handle_event(_, _, socket) do
    {:noreply, socket}
  end

  def handle_info({:chat, evt}, socket) do
    {:noreply, assign(socket, :messages, Enum.take([evt | socket.assigns.messages], 100))}
  end
end
