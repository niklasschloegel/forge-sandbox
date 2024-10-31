import { Children, isValidElement, ReactNode } from "react";
import * as React from "react";
import { ForgeModule, ForgeModuleProps } from "@/components/ForgeModule";
import { AllExtensions, getForgeContext } from "@/lib/forge-context";
import { useAsync } from "react-use";
import { ForgeModal, ForgeModalProps } from "@/components/ForgeModal.tsx";

interface ForgeModulesProps {
  children?: ReactNode;
}

/**
 * Defines different application modules to render depending on the current context's `moduleKey`.
 * The `moduleKey` is the same as defined in the manifest.
 *
 * @example
 * // This will render `Main` when the context contains `moduleKey` is `main` and `Panel` when `moduleKey` is `panel`.
 * <ForgeModules>
 *     <ForgeModule moduleKey="main" element={<Main/>} />
 *     <ForgeModule moduleKey="panel" element={<Panel/>} />
 * </ForgeModules>
 */
export function ForgeModules({ children }: ForgeModulesProps): React.ReactElement {
  const modules = collectPropsFromChildren(children);
  const contextState = useAsync(() => getForgeContext<AllExtensions>());
  return (
    <>
      {!!contextState.value &&
        (modules.find(({ moduleKey }) => moduleKey === contextState.value?.moduleKey)?.element ?? <div>unknown module key {contextState.value.moduleKey}</div>)}
    </>
  );
}

type ForgeModuleObject = Partial<ForgeModuleProps & ForgeModalProps>;

function collectPropsFromChildren(children: ReactNode): ForgeModuleObject[] {
  const modules: ForgeModuleObject[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }
    if (child.type !== ForgeModule && child.type !== ForgeModal) {
      const childName = typeof child.type === "string" ? child.type : child.type.name;
      throw new Error(`[${childName}] is not a <ForgeModule> component. All component children of <ForgeModules> must be a <ForgeModule> or <ForgeModal>`);
    }
    const props = child.props as ForgeModuleObject;
    modules.push(props);
  });
  return modules;
}
