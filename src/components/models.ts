export type SlateValue = any

export enum SegementType {
    Normal = "normal",
    Inline = "inline"
}

export interface ISegement {
    text: string
    startIndex: number
    endIndex: number
    type: SegementType
    data: any
}

export enum NodeTypes {
    Mention = 'mention-inline-node',
    Optional = 'optional-inline-node'
}

export interface IOption {
    id: string
    name: string
    highlighted?: boolean
}

export interface IPickerProps {
    isVisible: boolean
    top: number
    bottom: number
    left: number
    searchText: string
}

export interface FuseResult<T> {
    item: T
    matches: FuseMatch[]
}

export interface FuseMatch {
    indices: [number, number][]
    key: string
}

export interface MatchedOption<T> {
    highlighted: boolean
    matchedStrings: MatchedString[]
    original: T
}

export interface MatchedString {
    text: string
    matched: boolean
}
