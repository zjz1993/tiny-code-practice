import "./globals.css";
import { FC } from "react";
import { TCommonLayoutAndPageProps } from "@/types/index";

const SiteRootLayout: FC<TCommonLayoutAndPageProps> = ({ children }) => {
  return <div>{children}</div>;
};
export default SiteRootLayout;
