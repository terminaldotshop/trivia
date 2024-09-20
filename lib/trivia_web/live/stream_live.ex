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
       form: to_form(%{}),
       messages: []
     ), temporary_assigns: [form: to_form(%{})]}
  end

  def render(assigns) do
    ~H"""
    <div class="absolute inset-0 flex items-center justify-center">
      <div>
        <div>
          <div :for={message <- Enum.reverse(@messages)}><%= message.message %></div>
        </div>
        <.form for={@form} phx-submit="chat_submit" class="flex items-center">
          <.input field={@form[:chat_input]} type="text" class="bg-transparent" />
        </.form>
      </div>
    </div>
    """
  end

  def handle_event("chat_submit", %{"chat_input" => message}, socket) do
    Phoenix.PubSub.broadcast(
      Trivia.PubSub,
      @topic,
      {:chat,
       %{
         user_id: socket.assigns.user_id,
         message: message
       }}
    )

    {:noreply, assign(socket, :form, to_form(%{"chat_input" => ""}))}
  end

  def handle_event(_, _, socket) do
    {:noreply, socket}
  end

  def handle_info({:chat, evt}, socket) do
    {:noreply, update(socket, :messages, &[evt | Enum.take(&1, 99)])}
  end
end
