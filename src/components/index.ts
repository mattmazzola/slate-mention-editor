import Editor, { SlateValue } from './SlateMentionEditor'
import { defaultOptions } from './MentionPlugin'
import { getEntitiesFromValue } from './utilities'
import { IOption } from './models'

const triggerCharacter = defaultOptions.triggerCharacter
const Utilities = {
    getOptionsFromValue: getEntitiesFromValue
}
export {
    triggerCharacter, 
    SlateValue,
    Editor,
    IOption,
    Utilities
}
