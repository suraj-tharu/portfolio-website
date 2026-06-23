// Shared event bus for opening the ChatWidget from anywhere in the app
export const openChatWidget = () => {
  window.dispatchEvent(new CustomEvent('chat-widget:open'));
};
