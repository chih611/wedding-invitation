import { AppRouter, WeddingProvider } from "@wedding/shared";
import InvitationLayout from "./components/InvitationLayout";
import { config } from "./data/config";

function App() {
  return (
    <WeddingProvider config={config}>
      <AppRouter home={<InvitationLayout />} />
    </WeddingProvider>
  );
}

export default App;
