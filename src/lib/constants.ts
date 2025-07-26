export enum ID {
    PANEL = 'PANEL',
    SHELL = 'SHELL',
    TAB = 'TAB',
}

export enum ShellState {
    IDLE = 'idle',
    RUNNING = 'running',
}

export enum ShellAction {
    ADD_PANEL = 'ADD_PANEL',
    REMOVE_PANEL = 'REMOVE_PANEL',
    IDLE = 'IDLE',
}

export enum ShellEvent {
    ADD_PANEL = 'ADD_PANEL',
    REMOVE_PANEL = 'REMOVE_PANEL',
    UPDATE_PANEL = 'UPDATE_PANEL',
    IDLE = 'IDLE',
}

export enum PanelState {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum PanelAction {
    ADD_TAB = 'ADD_TAB',
    REMOVE_TAB = 'REMOVE_TAB',
    ACTIVATE_TAB = 'ACTIVATE_TAB',
}

export enum PanelEvent {
    ADD_TAB = 'ADD_TAB',
    REMOVE_TAB = 'REMOVE_TAB',
    ACTIVATE_TAB = 'ACTIVATE_TAB',
}