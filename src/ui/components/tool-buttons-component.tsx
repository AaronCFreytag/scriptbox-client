import React from "react";
import NamedImageButtonComponent from "./named-image-button-component";

interface IToolData {
    id: string;
    name: string;
    icon: string;
}

interface IToolButtonsProperties {
    tools: IToolData[];
    selectedTool: string;
    onChange: (id: string) => void;
}

export default class ToolButtonsComponent extends React.Component<IToolButtonsProperties> {
    constructor(props: IToolButtonsProperties) {
        super(props);
        this.reportToolChange = this.reportToolChange.bind(this);
    }
    public render() {
        return <div className="tool-buttons"> {
            this.props.tools.map((tool: IToolData) => {
                return <NamedImageButtonComponent
                    id={tool.id}
                    key={tool.id}
                    image={tool.icon}
                    name={tool.name}
                    onClick={() => this.reportToolChange(tool.id)}
                />;
            })
        }</div>;
    }
    private reportToolChange(id: string) {
        this.props.onChange(id);
    }
}