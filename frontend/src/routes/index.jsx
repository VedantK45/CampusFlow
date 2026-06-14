import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const NotFound = lazy(() => import("../pages/NotFound"));

// import CompilerRoute from "./CompilerRoute";
// import HomeRoute from "./HomeRoute";

import dashboard from "./dashboard";

const router = createBrowserRouter([
  ...dashboard,
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default router;
