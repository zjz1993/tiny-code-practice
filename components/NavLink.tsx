import { forwardRef } from "react";
import { NextNavLink, type NavLinkProps } from "@/components/NextNavLink";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>((props, ref) => {
  const { className, activeClassName, href, ...otherProps } = props;
  return (
    <NextNavLink
      href={href}
      activeClassName={activeClassName}
      className={className}
      {...otherProps}
    />
  );
});

NavLink.displayName = "NavLink";

export { NavLink };
