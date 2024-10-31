import { ReactElement } from "react";

export interface ForgeModalProps {
  modalType: string;
  element: ReactElement;
}

export function ForgeModal(_props: ForgeModalProps): null {
  throw new Error(
    "A <ForgeModule> is only ever to be used as the child of <ForgeModules> element, never rendered directly. Please wrap your <ForgeModule> in a <ForgeModules>."
  );
}
