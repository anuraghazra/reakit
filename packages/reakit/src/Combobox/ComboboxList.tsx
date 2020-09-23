import * as React from "react";
import { createComponent } from "reakit-system/createComponent";
import { createHook } from "reakit-system/createHook";
import { useWarning } from "reakit-warning";
import { useCreateElement } from "reakit-system/useCreateElement";
import { BoxOptions, BoxHTMLProps, useBox } from "../Box/Box";
import { getMenuId } from "./__utils/getMenuId";
import { unstable_ComboboxStateReturn } from "./ComboboxState";
import { COMBOBOX_LIST_KEYS } from "./__keys";

export const ComboboxContext = React.createContext<unstable_ComboboxStateReturn | null>(
  null
);

export const unstable_useComboboxList = createHook<
  unstable_ComboboxListOptions,
  unstable_ComboboxListHTMLProps
>({
  name: "ComboboxList",
  compose: useBox,
  keys: COMBOBOX_LIST_KEYS,

  useOptions({ menuRole = "listbox", ...options }) {
    return { menuRole, ...options };
  },

  useProps(options, { wrapElement: htmlWrapElement, ...htmlProps }) {
    const [initialState] = React.useState(options);
    const wrapElement = React.useCallback(
      (element: React.ReactNode) => {
        if (htmlWrapElement) {
          element = htmlWrapElement(element);
        }
        element = (
          <ComboboxContext.Provider value={initialState}>
            {element}
          </ComboboxContext.Provider>
        );
        return element;
      },
      [htmlWrapElement]
    );
    return {
      role: options.menuRole,
      id: getMenuId(options.baseId),
      wrapElement,
      ...htmlProps,
    };
  },
});

export const unstable_ComboboxList = createComponent({
  as: "div",
  useHook: unstable_useComboboxList,
  useCreateElement: (type, props, children) => {
    useWarning(
      !props["aria-label"] && !props["aria-labelledby"],
      "You should provide either `aria-label` or `aria-labelledby` props.",
      "See https://reakit.io/docs/combobox"
    );
    return useCreateElement(type, props, children);
  },
});

export type unstable_ComboboxListOptions = BoxOptions &
  Pick<Partial<unstable_ComboboxStateReturn>, "menuRole" | "subscribe"> &
  Pick<unstable_ComboboxStateReturn, "baseId">;

export type unstable_ComboboxListHTMLProps = BoxHTMLProps;

export type unstable_ComboboxListProps = unstable_ComboboxListOptions &
  unstable_ComboboxListHTMLProps;
