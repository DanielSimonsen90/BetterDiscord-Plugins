import * as Finder from "../finder";
import * as Filters from "../filters";

interface LinkProps extends Record<string, any> {
    component?: any;
    replace?: any;
    to?: any;
    innerRef?: React.Ref<any>;
    history?: any;
    location?: any;
    children?: React.ReactChild;
    className?: string;
    tabIndex?: number;
}

interface Links {
    Link: React.ForwardRefExoticComponent<LinkProps>;
    NavLink: React.ForwardRefExoticComponent<any>;
    LinkRouter: React.ComponentClass<any, any>;
}

export const {Link, NavLink, LinkRouter}: Links = /* @__PURE__ */ Finder.demangle({
    NavLink: Filters.bySource(".sensitive", ".to"),
    Link: Filters.bySource(".component"),
    LinkRouter: Filters.bySource("this.history")
}, ["NavLink", "Link"]);