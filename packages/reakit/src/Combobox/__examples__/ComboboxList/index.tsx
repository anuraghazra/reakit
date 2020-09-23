import * as React from "react";
import {
  unstable_useComboboxState as useComboboxState,
  unstable_Combobox as ComboboxInput,
  unstable_ComboboxPopover as ComboboxPopover,
  unstable_ComboboxOption as ComboboxOption,
} from "reakit/Combobox";
import { colors } from "./colors";

import "./style.css";

function Combobox({ value, onChange, onMatch, children }) {
  const combobox = useComboboxState({
    inline: true,
    autoSelect: true,
    values: colors,
    gutter: 8,
    limit: 200,
  });
  React.useEffect(() => {
    const id = setTimeout(() => {
      onMatch?.(combobox.matches);
    });
    return () => clearTimeout(id);
  }, [combobox.matches]);
  return (
    <>
      <ComboboxInput
        {...combobox}
        // value={value}
        // onChange={onChange}
        aria-label="Color"
        placeholder="Type a color"
      />
      <ComboboxPopover {...combobox} aria-label="Colors">
        {children}
      </ComboboxPopover>
    </>
  );
}

export default function ComboboxList() {
  const [matches, setMatches] = React.useState([]);
  // const [value, setValue] = React.useState("");
  // console.log(value);
  return (
    <Combobox
      // value={value}
      // onChange={(event) => setValue(event.target.value)}
      onMatch={setMatches}
    >
      {matches.length
        ? matches.map((value) => <ComboboxOption key={value} value={value} />)
        : "No results found"}
    </Combobox>
  );
}
