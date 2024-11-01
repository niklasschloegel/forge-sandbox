import { ReactElement } from "react";

export interface ForgeModuleProps {
  moduleKey: string;
  element: ReactElement;
}

export function ForgeModule(_props: ForgeModuleProps): null {
  throw new Error(
    "A <ForgeModule> is only ever to be used as the child of <ForgeModules> element, never rendered directly. Please wrap your <ForgeModule> in a <ForgeModules>."
  );
}
