import * as models from "./models"

/**
 * Recursively walk up DOM tree until root or parent with non-static position is found.
 * (relative, fixed, or absolute) which will be used as reference for absolutely positioned elements within it
 */
export const getRelativeParent = (element: HTMLElement | null): HTMLElement => {
    if (!element) {
        return document.body
    }

    const position = window.getComputedStyle(element).getPropertyValue('position')
    if (position !== 'static') {
        return element
    }

    return getRelativeParent(element.parentElement)
};

export const valueToJSON = (value: any) => {
    const characters = value.characters ? value.characters.toJSON() : [];
    return {
        data: value.data.toJSON(),
        decorations: value.decorations ? value.decorations.toJSON() : [],
        document: value.toJSON().document,
        activeMarks: value.activeMarks.toJSON(),
        marks: value.marks.toJSON(),
        texts: value.texts.toJSON(),
        characters,
        selectedText: characters.reduce((s: string, node: any) => s + node.text, ''),
        selection: value.selection.toJSON()
    }
}

export const findNodeByPath = (path: number[], root: any, nodeType: string = models.NodeTypes.Mention): any => {
    if (path.length === 0) {
        return null
    }

    const [nextKey, ...nextPath] = path

    const nextRoot = root.findDescendant((node: any, i: number) => i === nextKey)
    // If the node was already removed due to another change it might not exist in the path anymore
    if (nextRoot === null) {
        return null
    }

    if (nextRoot.type === nodeType) {
        return nextRoot
    }

    return findNodeByPath(nextPath, nextRoot)
}

export const getNodesByPath = (path: number[], root: any, nodes: any[] = []): any[] => {
    if (path.length === 0) {
        return nodes
    }

    const [nextKey, ...nextPath] = path
    const nextRoot = root.findDescendant((node: any, i: number) => i === nextKey)

    // If the node was already removed due to another change it might not exist in the path anymore
    if (nextRoot === null) {
        return nodes
    }

    nodes.push(nextRoot)

    return getNodesByPath(nextPath, nextRoot, nodes)
}

export const getEntitiesFromValue = <T extends models.IOption = models.IOption>(value: any): T[] => {
    const tree = value.toJSON().document

    return depthFirstSearch(tree, n => n.type === models.NodeTypes.Mention && n.data.completed === true, n => n.type === models.NodeTypes.Optional)
        .map<T>(n => n.data.option)
}

interface INode {
    kind: string
    type: string
    nodes: INode[] | undefined
    data: any
}

/**
 * This a normal tree DFS with change that it only returns nodes that satisfy the predicate and also it will skip nodes that are excluded
 * In practice this means return all inline nodes and skip optional nodes effectively returning list of inline nodes that are not within and optional node.
 */
const depthFirstSearch = (root: INode, predicate: (n: INode) => boolean, exclude: (n: INode) => boolean, nodes: INode[] = []): INode[] => {
    if (predicate(root)) {
        nodes.push(root)
    }

    const childNodes = !Array.isArray(root.nodes)
        ? []
        : root.nodes
            .filter(n => !exclude(n))
            .map(n => depthFirstSearch(n, predicate, exclude))
            .reduce((a, b) => [...a, ...b], [])

    return [...nodes, ...childNodes]
}

export const convertMatchedTextIntoMatchedOption = <T>(inputText: string, matches: [number, number][], original: T): models.MatchedOption<T> => {
    const matchedStrings = matches.reduce<models.ISegement[]>((segements, [startIndex, originalEndIndex]) => {
        // TODO: For some reason the Fuse.io library returns the end index before the last character instead of after
        // I opened issue here for explanation: https://github.com/krisk/Fuse/issues/212
        let endIndex = originalEndIndex + 1
        const segementIndexWhereEntityBelongs = segements.findIndex(seg => seg.startIndex <= startIndex && endIndex <= seg.endIndex)
        const prevSegements = segements.slice(0, segementIndexWhereEntityBelongs)
        const nextSegements = segements.slice(segementIndexWhereEntityBelongs + 1, segements.length)
        const segementWhereEntityBelongs = segements[segementIndexWhereEntityBelongs]

        const prevSegementEndIndex = startIndex - segementWhereEntityBelongs.startIndex
        const prevSegementText = segementWhereEntityBelongs.text.substring(0, prevSegementEndIndex)
        const prevSegement: models.ISegement = {
            ...segementWhereEntityBelongs,
            text: prevSegementText,
            endIndex: startIndex,
        }

        const nextSegementStartIndex = endIndex - segementWhereEntityBelongs.startIndex
        const nextSegementText = segementWhereEntityBelongs.text.substring(nextSegementStartIndex, segementWhereEntityBelongs.text.length)
        const nextSegement: models.ISegement = {
            ...segementWhereEntityBelongs,
            text: nextSegementText,
            startIndex: endIndex,
        }

        const newSegement: models.ISegement = {
            text: segementWhereEntityBelongs.text.substring(prevSegementEndIndex, nextSegementStartIndex),
            startIndex: startIndex,
            endIndex: endIndex,
            type: models.SegementType.Inline,
            data: {
                matched: true
            }
        }

        const newSegements = []
        if (prevSegement.startIndex !== prevSegement.endIndex) {
            newSegements.push(prevSegement)
        }

        if (newSegement.startIndex !== newSegement.endIndex) {
            newSegements.push(newSegement)
        }

        if (nextSegement.startIndex !== nextSegement.endIndex) {
            newSegements.push(nextSegement)
        }

        return [...prevSegements, ...newSegements, ...nextSegements]
    }, [
            {
                text: inputText,
                startIndex: 0,
                endIndex: inputText.length,
                type: models.SegementType.Normal,
                data: {
                    matched: false
                }
            }
        ]).map(({ text, data }) => ({
            text,
            matched: data.matched
        }))

    return {
        highlighted: false,
        original,
        matchedStrings
    }
}