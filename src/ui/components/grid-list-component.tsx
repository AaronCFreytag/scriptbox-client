import React from "react";
import NamedImageButtonComponent from "./named-image-button-component";

interface GridListProperties<T, T2> {
    class: string;
    direction: "horizontal" | "vertical";
    resources: T[];
    onClick: (id?: T2) => void;
}

interface Resource<T> {
    id: T;
    icon: string;
    name: string;
}

export default class GridListComponent<T extends Resource<T2>, T2>
        extends React.Component<GridListProperties<T, T2>> {
    public render() {
        return <div
            className={`grid-list grid-list-${this.props.direction} ${this.props.class}`}
            onClick={() => this.props.onClick(undefined)}
        >
        {this.props.resources.map((resource) => {
            return <NamedImageButtonComponent
                {...resource}
                id={resource.id}
                image={resource.icon}
                name={resource.name}
                onClick={() => this.props.onClick(resource.id)}
                key={"" + resource.id}
            />;
        })}
        {this.props.children}
        </div>;
    }
}
