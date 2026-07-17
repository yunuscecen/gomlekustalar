import {
  Route,
  Routes,
} from "react-router";

import PublicLayout from "./components/layout/PublicLayout";
import NotFoundPage from "./pages/NotFoundPage";
import PublicPage from "./pages/PublicPage";

const App = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route
          index
          element={<PublicPage slug="anasayfa" />}
        />

        <Route
          path="hakkimizda"
          element={<PublicPage slug="hakkimizda" />}
        />

        <Route
          path="tasarim"
          element={<PublicPage slug="tasarim" />}
        />

        <Route
          path="uretim"
          element={<PublicPage slug="uretim" />}
        />

        <Route
          path="ihracat"
          element={<PublicPage slug="ihracat" />}
        />

        <Route
          path="iletisim"
          element={<PublicPage slug="iletisim" />}
        />
      </Route>

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
};

export default App;