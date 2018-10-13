import Editor, { SlateValue } from './SlateMentionEditor'
import { defaultOptions } from './MentionPlugin'
import { getEntitiesFromValue } from './utilities'
import SlateTransformer from './slateTransformer'
import { IOption } from './models'

const triggerCharacter = defaultOptions.triggerCharacter
const Utilities = {
    getEntitiesFromValue,
    updateOptionNames: SlateTransformer.updateOptionNames
}
export {
    triggerCharacter, 
    SlateValue,
    Editor,
    IOption,
    Utilities
}
