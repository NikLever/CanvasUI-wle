import { Component } from '@wonderlandengine/api';
/**
 * Set player height for a Y-offset above the ground for
 * 'local' and 'viewer' reference spaces.
 */
export declare class PlayerHeight extends Component {
    static TypeName: string;
    height: number;
    onSessionStartCallback: () => void;
    onSessionEndCallback: () => void;
    start(): void;
    onActivate(): void;
    onDeactivate(): void;
    onXRSessionStart(): void;
    onXRSessionEnd(): void;
}
