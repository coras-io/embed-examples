import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

// Client-side SPA only: the SDK renders web components in the browser, so there
// is no server render. Bootstrap once and let Angular Router drive the rest.
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
