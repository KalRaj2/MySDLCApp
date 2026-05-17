import AppRouter from "@app/router/AppRouter";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#000000",
            border: "1px solid #dbeafe",
          },
        }}
      />

      <AppRouter />
    </>
  );
}

export default App;