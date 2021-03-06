import React from "react";
import Resource from "resource-management/resource";
import GridListComponent from "./grid-list-component";
import ResourceDisplayComponent from "./resource-display-component";

interface SharedResourceListProperties {
    resources: Resource[];
    onReupload: (resource: Resource) => void;
    onDelete: (resource: Resource) => void;
    onSoundPlay: (resource: Resource) => void;
    onSoundStop: (resource: Resource) => void;
    onScriptEdit: (resource: Resource) => void;
    onScriptRun: (resource: Resource, args: string) => void;
    onInfoChange: (resource: Resource, kind: string, value: string) => void;
    onInfoSubmit: (resource: Resource, kind: string, value: string) => void;
    onResourceChange: (resourceID?: string) => void;
    onClone: (resource: Resource) => void;
    selectedResourceID?: string;
}

export default class SharedResourceListComponent extends React.Component<SharedResourceListProperties> {
    constructor(props: SharedResourceListProperties) {
        super(props);
        this._setResource = this._setResource.bind(this);
    }
    public render() {
        return <div className="shared-list">
            <GridListComponent
                class="resource-select"
                direction="vertical"
                resources={this.props.resources}
                onClick={this._setResource}
            >
            {this.props.children}
            </GridListComponent>
            {(() => {
                if (this.props.selectedResourceID !== undefined) {
                    const resource = this._getResource(this.props.selectedResourceID);
                    if (resource !== undefined) {
                        return <ResourceDisplayComponent
                            resource={resource}
                            onReupload={this._onReupload}
                            onDelete={this._onDelete}
                            onSoundPlay={this._onSoundPlay}
                            onSoundStop={this._onSoundStop}
                            onScriptRun={this._onScriptRun}
                            onScriptEdit={this._onScriptEdit}
                            onInfoChange={this.props.onInfoChange}
                            onInfoSubmit={this.props.onInfoSubmit}
                            onClone={this._onClone}
                            shared
                        />;
                    }
                }
                return <div className="shared-display">Choose a resource to inspect.</div>;
            })()}
        </div>;
    }
    private _setResource(id?: string) {
        this.props.onResourceChange(id);
    }
    private _getResource(id: string) {
        return this.props.resources.find((res) => res.id === id);
    }
    private _onReupload = (resource: Resource) => {
        this.props.onReupload(resource);
    }

    private _onScriptEdit = (resource: Resource) => {
        this.props.onScriptEdit(resource);
    }

    private _onSoundPlay = (resource: Resource) => {
        this.props.onSoundPlay(resource);
    }

    private _onSoundStop = (resource: Resource) => {
        this.props.onSoundStop(resource);
    }

    private _onScriptRun = (resource: Resource, args: string) => {
        this.props.onScriptRun(resource, args);
    }

    private _onDelete = (resource: Resource) => {
        this.props.onDelete(resource);
    }

    private _onClone = (resource: Resource) => {
        this.props.onClone(resource);
    }
}
