import HeaderServer from "./header/actions/headerServer";
import "./styles.css";
import React, { ReactElement, ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactElement {
  return <html>
      <body>
      <HeaderServer />
        {children}
      </body>
  </html>;
}