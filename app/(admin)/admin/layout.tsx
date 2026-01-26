import { TCommonLayoutAndPageProps } from "@/types/index";
import { FC } from "react";
import "./adminGlobals.css";

const AdminLayout: FC<TCommonLayoutAndPageProps> = ({ children }) => {
  return (
    <div className="text-blue">
      <div>这是后台的layout</div>
      {children}
    </div>
  );
};
export default AdminLayout;
