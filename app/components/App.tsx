import { IconButton, IIconProps, Label, Stack, ITextFieldStyles, ThemeProvider } from "@fluentui/react";
import React from "react";
import ThemeHelpers from "./theme/ThemeHelper";

export const App: React.FC = (): JSX.Element => {

  const titleStyle: Partial<ITextFieldStyles> = { root: { fontSize: "large", fontWeight: "600", marginLeft: 5 } };
  const titleErrorStyle: Partial<ITextFieldStyles> = { root: { fontSize: "large", fontWeight: "600", marginLeft: 5, color: "red" } };
  const iconRefreshProps: IIconProps = { iconName: 'Refresh' };

  try {
    return (
      <ThemeProvider theme={ThemeHelpers.getAdaptedTheme()}>
        <div className="App">
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <Label styles={titleStyle}>YAML is valid</Label>
          </Stack>
          <div className="InputsPanel">
                <Label>soon</Label>
          </div>
        </div>
      </ThemeProvider>
    );
  } catch (e) {
    console.error(e);
    return (
      <ThemeProvider theme={ThemeHelpers.getAdaptedTheme()}>
        <div className="AppError">
          <Stack horizontal verticalAlign="center">
            <Label styles={titleErrorStyle}>YAML is invalid</Label>
          </Stack>
          {(e as TypeError).message}
        </div>
      </ThemeProvider>
    );
  }


};